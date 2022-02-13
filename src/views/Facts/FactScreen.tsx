import {
  Alert,
  Button,
  Card,
  Modal,
  Table,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
} from "react";
import { Fact } from "../../interface/Fact";
import { Product } from "../../interface/Product";
import { deleteFact, getFactDeleted, getFacts } from "../../api/fact/fact";
import styles from "./Fact.module.scss";
import FactForm from "../../components/FactComponent/Form/FactForm";
import FactListActives from "../../components/FactComponent/List/Actives/FactListActives";
import FactListRemoves from "../../components/FactComponent/List/Removes/FactListRemoves";
import { IAlert } from "../../interface/IAlert";
import { getProducts } from "../../api/product/product";
import TableHeader from "../../components/DatatableComponent/Header/TableHeader";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import PaginationComponent from "../../components/DatatableComponent/Pagination/Pagination";

const initialState: IAlert = {
  type: "",
  message: "",
};

const headers = [
  { name: "#", field: "item", sortable: false },
  { name: "Cod", field: "cod_fact", sortable: true },
  { name: "Fecha", field: "createdAt", sortable: true },
  { name: "Cliente", field: "client", sortable: true },
  { name: "Vendedor", field: "user", sortable: true },
  { name: "Tipo de pago", field: "payment_type", sortable: true },
  { name: "Forma de pago", field: "way_to_pay", sortable: true },
  { name: "Total", field: "subtotal", sortable: true },
  { name: "Estado", field: "status", sortable: false },
  {
    name: "Eliminar",
    field: "delete",
    sortable: false,
  },
];

const FactScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [removes, setRemoves] = useState<Fact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [idFact, setIdFact] = useState({
    id: "",
    cod: "",
  });
  const [message, setMessage] = useState<IAlert>(initialState);
  const { resources } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);

  //ordenar y buscar de la tabla
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [search, setSearch] = useState<string | any>("");
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [key, setKey] = useState<string | null>("list");

  const ITEMS_PER_PAGE = 50;

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  const handleSearch = () => {
    setSearch(searchInput.current?.value);
  };

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState(value);
    }
  }, []);

  const onPageChange = (page: number) => setCurrentPage(page);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const listFacts = useCallback(async () => {
    const res = await getFacts();
    const { data } = res;
    const filter = data.map((fact: any) => {
      return {
        _id: fact._id,
        cod_fact: fact.cod_fact,
        createdAt: fact.createdAt,
        client: fact.client.name + " " + fact.client.lastname,
        user: fact?.user.name + " " + fact.user.lastname,
        payment_type: fact.payment_type,
        way_to_pay: fact.way_to_pay,
        subtotal: fact.subtotal - fact.discount,
        discount: fact.discount,
        status: fact.status,
        customer_payment: fact.customer_payment,
      };
    });
    setFacts(filter);
  }, []);

  const listFactDeleted = useCallback(async () => {
    const res = await getFactDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteFact = async () => {
    if (resource && resource.canDelete === false) {
      setMessage({
        type: "danger",
        message: "No tienes acceso a este recurso.",
      });
      return;
    }
    const __deletedFact = await deleteFact(idFact.id);
    const { data } = __deletedFact;
    const { factDeleted } = data;
    if (factDeleted) {
      listFacts();
      listFactDeleted();
    }
    setMessage({
      type: "success",
      message: `Venta 000${idFact.cod}. anulada correctamente.`,
    });
    closeModalConfirm();
    listProducts();
  };

  useEffect(() => {
    if (resource && resource.canRead) {
      listFacts();
    }
    listFactDeleted();
    listProducts();
    getMyModule();
  }, [listFacts, listFactDeleted, getMyModule, resource]);

  const closeModalConfirm = () => {
    setShowModal(false);
    setIdFact({
      id: "",
      cod: "",
    });
    setTimeout(() => {
      setMessage(initialState);
    }, 2500);
  };

  const openModalConfirm = (id: string, cod: string) => {
    setShowModal(true);
    setIdFact({
      id: id,
      cod: cod,
    });
  };

  const listProducts = async () => {
    const res = await getProducts();
    const { data } = res;
    //const filterJustMayor0 = data.filter((product: any) => product.stock > 0);
    setProducts(data);
  };

  const onSorting = (field: string, order: string) =>
    setSorting({ field, order });

  const factsFiltered = useMemo(() => {
    let computedFacts: any = facts;

    if (search) {
      computedFacts = computedFacts.filter((fact: any) => {
        return fact.cod_fact
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }

    setTotalItems(computedFacts.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedFacts = computedFacts.sort((a: any, b: any) => {
        if (typeof a[sorting.field] === "object") {
          return (
            reversed *
            a[sorting.field].name
              .toString()
              .localeCompare(b[sorting.field].name.toString())
          );
        } else {
          if (typeof a[sorting.field] === "number") {
            return reversed * (a[sorting.field] - b[sorting.field]);
          } else {
            return (
              reversed *
              a[sorting.field]
                .toString()
                .localeCompare(b[sorting.field].toString())
            );
          }
        }
      });
    }

    //Current Page slice
    return computedFacts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [facts, search, sorting, currentPage]);

  return (
    <>
      <Modal show={showModal} onHide={closeModalConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>AVISA DE CONFIRMACION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿ Estas seguro que deseas anular la venta{" "}
          <strong>000{String(idFact.cod).slice(3)}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalConfirm}>
            Cerrar
          </Button>
          <Button variant="success" onClick={_deleteFact}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Card>
        <Card.Header as="h5">Lista de Ventas</Card.Header>
        <Card.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}
          <Tabs
            activeKey={key as string}
            onSelect={(k) => setKey(k)}
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            {resource && resource.canRead && (
              <Tab eventKey="list" title="Todas la ventas">
                <Form.Control
                  className="mt-3 mb-3"
                  type="text"
                  autoFocus
                  placeholder="Busca por código de venta"
                  value={search}
                  ref={searchInput}
                  onChange={handleSearch}
                />

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
                      {search ? factsFiltered.length : facts.length} registros
                    </span>
                  </div>
                </div>

                <Table
                  striped
                  bordered
                  hover
                  responsive="sm"
                  className={styles.table}
                >
                  <TableHeader headers={headers} onSorting={onSorting} />
                  <tbody>
                    {factsFiltered.map((fact: any, i: number) => (
                      <FactListActives
                        key={fact._id}
                        item={i}
                        fact={fact}
                        openModalRE={openModalRE}
                        deleteFact={openModalConfirm}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    {removes.map((remove, i: number) => (
                      <FactListRemoves
                        item={i}
                        key={remove._id}
                        remove={remove}
                      />
                    ))}
                  </tfoot>
                </Table>
              </Tab>
            )}

            {resource && resource.canCreate && (
              <Tab eventKey="create" title="Nueva venta">
                <FactForm
                  tab={key as string}
                  show={true}
                  byConsult={false}
                  closeModal={closeModal}
                  listFacts={listFacts}
                  listProducts={listProducts}
                  listFactDeleted={listFactDeleted}
                  products={products}
                  fact={state}
                />
              </Tab>
            )}
          </Tabs>
          {/* <FactForm
                  show={show}
                  closeModal={closeModal}
                  listFacts={listFacts}
                  listProducts={listProducts}
                  listFactDeleted={listFactDeleted}
                  products={products}
                  fact={state}
                /> */}
          {/* {resource && resource.canRead && (
            
          )} */}
        </Card.Body>
      </Card>
    </>
  );
};

export default FactScreen;
