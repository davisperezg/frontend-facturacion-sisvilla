import { Alert, Button, Card, Modal, Table } from "react-bootstrap";
import { useCallback, useState, useEffect } from "react";
import { Fact } from "../../interface/Fact";
import { Product } from "../../interface/Product";
import { deleteFact, getFactDeleted, getFacts } from "../../api/fact/fact";
import styles from "./Fact.module.scss";
import FactForm from "../../components/FactComponent/Form/FactForm";
import FactListActives from "../../components/FactComponent/List/Actives/FactListActives";
import FactListRemoves from "../../components/FactComponent/List/Removes/FactListRemoves";
import { IAlert } from "../../interface/IAlert";
import { getProducts } from "../../api/product/product";

const initialState: IAlert = {
  type: "",
  message: "",
};

const FactScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [removes, setRemoves] = useState<Fact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [idFact, setIdFact] = useState({
    id: "",
    cod: 0,
  });
  const [message, setMessage] = useState<IAlert>(initialState);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState({
        ...value,
        client: {
          label: value.client.name + " " + value.client.lastname,
          value: value.client.nroDocument,
        },
      });
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

  const _deleteFact = async () => {
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
    listFacts();
    listFactDeleted();
    listProducts();
  }, [listFacts, listFactDeleted]);

  const closeModalConfirm = () => {
    setShowModal(false);
    setIdFact({
      id: "",
      cod: 0,
    });
    setTimeout(() => {
      setMessage(initialState);
    }, 2500);
  };

  const openModalConfirm = (id: string, cod: number) => {
    setShowModal(true);
    setIdFact({
      id: id,
      cod: cod,
    });
  };

  const listProducts = async () => {
    const res = await getProducts();
    const { data } = res;
    const filterJustMayor0 = data.filter((product: any) => product.stock > 0);
    setProducts(filterJustMayor0);
  };

  return (
    <>
      <FactForm
        show={show}
        closeModal={closeModal}
        listFacts={listFacts}
        listProducts={listProducts}
        listFactDeleted={listFactDeleted}
        products={products}
        fact={state}
      />
      <Modal show={showModal} onHide={closeModalConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>AVISA DE CONFIRMACION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿ Estas seguro que deseas anular la venta{" "}
          <strong>000{idFact.cod}</strong> ?
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
                <th className={`${styles["table--center"]}`}>Estado Factura</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((fact, i: number) => (
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
                <FactListRemoves item={i} key={remove._id} remove={remove} />
              ))}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default FactScreen;
