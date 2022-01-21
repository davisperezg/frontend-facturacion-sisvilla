import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useState, useEffect } from "react";
import { Fact } from "../../interface/Fact";
import {
  deleteFact,
  getFactDeleted,
  getFacts,
  restoreFact,
} from "../../api/fact/fact";
import styles from "./Fact.module.scss";
import FactForm from "../../components/FactComponent/Form/FactForm";

const FactScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [removes, setRemoves] = useState<Fact[]>([]);

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

  const listFacts = useCallback(async () => {
    const res = await getFacts();
    const { data } = res;
    setFacts(data);
  }, []);

  const listFactDeleted = useCallback(async () => {
    const res = await getFactDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteFact = useCallback(
    async (id: string) => {
      const __deletedFact = await deleteFact(id);
      const { data } = __deletedFact;
      const { factDeleted } = data;
      if (factDeleted) {
        listFacts();
        listFactDeleted();
      }
    },
    [listFacts, listFactDeleted]
  );

  const _restoreFact = useCallback(
    async (id: string) => {
      const __restoreFact = await restoreFact(id);
      const { data } = __restoreFact;
      const { factRestored } = data;
      if (factRestored) {
        listFacts();
        listFactDeleted();
      }
    },
    [listFacts, listFactDeleted]
  );

  useEffect(() => {
    listFacts();
    listFactDeleted();
  }, [listFacts, listFactDeleted]);

  return (
    <>
      <FactForm
        show={show}
        closeModal={closeModal}
        listFacts={listFacts}
        fact={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Ventas</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            autoFocus
            onClick={() => openModalRE(false)}
          >
            Agregar nueva venta
          </Button>

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
                <th>COD</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Tipo de pago</th>
                <th>Forma de pago</th>
                <th>Total</th>
                <th>Estado Factura</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {/* {facts.map((fact) => (
                <FactListActives
                  key={fact._id}
                  fact={fact}
                  openModalRE={openModalRE}
                  deleteFact={_deleteFact}
                />
              ))} */}
            </tbody>
            <tfoot>
              {/* {removes.map((remove) => (
                <FactListRemoves
                  key={remove._id}
                  remove={remove}
                  restoreFact={_restoreFact}
                />
              ))} */}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default FactScreen;
