import { useCallback, useState, useEffect, useContext, useMemo } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {
  deleteMark,
  getMarkDeleted,
  getMarks,
  restoreMark,
} from "../../api/mark/mark";
import { getModuleByMenu } from "../../api/module/module";
import PaginationComponent from "../../components/DatatableComponent/Pagination/Pagination";
import Search from "../../components/DatatableComponent/Search/Search";
import MarkForm from "../../components/MarkComponent/Form/MarkForm";
import MarkListActives from "../../components/MarkComponent/List/Actives/MarkListActives";
import MarkListRemoves from "../../components/MarkComponent/List/Removes/MarkListRemoves";
import { AuthContext } from "../../context/auth";
import { IAlert } from "../../interface/IAlert";
import { Mark } from "../../interface/Mark";
import styles from "./Mark.module.scss";

const initialState: IAlert = {
  type: "",
  message: "",
};

const MarkScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [removes, setRemoves] = useState<Mark[]>([]);
  const { resources } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState(value);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const listMarks = useCallback(async () => {
    const res = await getMarks();
    const { data } = res;
    setMarks(data);
  }, []);

  const listMarkDeleted = useCallback(async () => {
    const res = await getMarkDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteMark = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedMark = await deleteMark(id);
      const { data } = __deletedMark;
      const { markDeleted } = data;
      if (markDeleted) {
        listMarks();
        listMarkDeleted();
      }
    },
    [listMarks, listMarkDeleted, resource]
  );

  const _restoreMark = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreMark = await restoreMark(id);
      const { data } = __restoreMark;
      const { markRestored } = data;
      if (markRestored) {
        listMarks();
        listMarkDeleted();
      }
    },
    [listMarks, listMarkDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listMarks();
    }

    listMarkDeleted();
    getMyModule();
  }, [listMarks, listMarkDeleted, getMyModule, resource]);

  const marksFiltered = useMemo(() => {
    let computedMarks = marks! || [];

    if (search) {
      computedMarks = computedMarks.filter((mark) =>
        mark.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedMarks.length);

    //Current Page slice
    return computedMarks.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [marks, currentPage, search]);

  const onSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Marcas</Card.Header>
        <Card.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}
          {resource && resource.canCreate && resource.canUpdate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nueva marca
              </Button>
              <MarkForm
                show={show}
                closeModal={closeModal}
                listMarks={listMarks}
                mark={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nueva marca
              </Button>
              <MarkForm
                show={show}
                closeModal={closeModal}
                listMarks={listMarks}
                mark={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <MarkForm
                show={show}
                closeModal={closeModal}
                listMarks={listMarks}
                mark={state}
              />
            )
          )}

          {resource && resource.canRead && (
            <>
              <div className={styles.contentSearch}>
                <div className={styles.contentSearch__search}>
                  <Search onSearch={onSearch} placeholder="Buscar marca" />
                </div>
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <PaginationComponent
                  total={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                />
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <span style={{ marginLeft: 5 }}>
                    Hay un total de{" "}
                    {search ? marksFiltered.length : marks.length} registros
                  </span>
                </div>
              </div>
              <Table striped bordered hover responsive className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th className={`${styles["table--center"]}`}>Estado</th>
                    {resource && resource.canDelete && (
                      <th className={`${styles["table--center"]}`}>Eliminar</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {marksFiltered.map((mark, item: number) => (
                    <MarkListActives
                      item={item + 1}
                      key={mark._id}
                      mark={mark}
                      openModalRE={openModalRE}
                      deleteMark={_deleteMark}
                    />
                  ))}
                </tbody>
                <tfoot>
                  {removes.map((remove) => (
                    <MarkListRemoves
                      key={remove._id}
                      remove={remove}
                      restoreMark={_restoreMark}
                    />
                  ))}
                </tfoot>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default MarkScreen;
