import { useCallback, useState, useEffect } from "react";
import { Button, Card, Table } from "react-bootstrap";
import {
  deleteMark,
  getMarkDeleted,
  getMarks,
  restoreMark,
} from "../../api/mark/mark";
import MarkForm from "../../components/MarkComponent/Form/MarkForm";
import MarkListActives from "../../components/MarkComponent/List/Actives/MarkListActives";
import MarkListRemoves from "../../components/MarkComponent/List/Removes/MarkListRemoves";
import { Mark } from "../../interface/Mark";
import { Resources } from "../../interface/Resources";
import styles from "./Mark.module.scss";

const MarkScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [removes, setRemoves] = useState<Mark[]>([]);

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
      const __deletedMark = await deleteMark(id);
      const { data } = __deletedMark;
      const { markDeleted } = data;
      if (markDeleted) {
        listMarks();
        listMarkDeleted();
      }
    },
    [listMarks, listMarkDeleted]
  );

  const _restoreMark = useCallback(
    async (id: string) => {
      const __restoreMark = await restoreMark(id);
      const { data } = __restoreMark;
      const { markRestored } = data;
      if (markRestored) {
        listMarks();
        listMarkDeleted();
      }
    },
    [listMarks, listMarkDeleted]
  );

  useEffect(() => {
    listMarks();
    listMarkDeleted();
  }, [listMarks, listMarkDeleted]);

  return (
    <>
      <MarkForm
        show={show}
        closeModal={closeModal}
        listMarks={listMarks}
        mark={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Marcas</Card.Header>
        <Card.Body>
          {myResource?.canCreate && (
            <Button
              type="button"
              variant="primary"
              onClick={() => openModalRE(false)}
            >
              Agregar nueva marca
            </Button>
          )}

          <Table
            striped
            bordered
            hover
            responsive="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <MarkListActives
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
        </Card.Body>
      </Card>
    </>
  );
};

export default MarkScreen;
