import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { Client } from "../../interface/Client";
import { Resources } from "../../interface/Resources";
import {
  deleteClient,
  getClients,
  getClientDeleted,
  restoreClient,
} from "../../api/client/client";
import styles from "./Client.module.scss";

const ClientScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [removes, setRemoves] = useState<Client[]>([]);
  const [state, setState] = useState<any>();

  const listClients = useCallback(async () => {
    const res = await getClients();
    const { data } = res;
    setClients(data);
  }, []);

  const listClientsDeleted = useCallback(async () => {
    const res = await getClientDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState({ ...value, role: value.role.name });
    }
  }, []);

  const deleteCli = useCallback(
    async (id: string) => {
      const __deletedClient = await deleteClient(id);
      const { data } = __deletedClient;
      const { userDeleted } = data;
      if (userDeleted) {
        listClients();
        listClientsDeleted();
      }
    },
    [listClients, listClientsDeleted]
  );

  const restoreCli = useCallback(
    async (id: string) => {
      const __restoreCli = await restoreClient(id);
      const { data } = __restoreCli;
      const { userRestored } = data;
      if (userRestored) {
        listClients();
        listClientsDeleted();
      }
    },
    [listClients, listClientsDeleted]
  );

  useEffect(() => {
    listClients();
    listClientsDeleted();
  }, [listClients, listClientsDeleted]);

  return (
    // <ClientForm
    //   show={show}
    //   closeModal={closeModal}
    //   listClients={listClients}
    //   user={state}
    // />

    <>
      <Card>
        <Card.Header as="h5">Lista de Clientes</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nuevo cliente
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
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Documento</th>
                <th>Nro. de documento</th>
                <th>Correo</th>
                <th>Cliario</th>
                <th>Rol</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {/* {users.map((user) => (
                <ClientListActives
                  key={user._id}
                  user={user}
                  deleteCli={deleteCli}
                  openModalRE={openModalRE}
                />
              ))} */}
            </tbody>
            <tfoot>
              {/* {removes.map((remove) => (
                <ClientListRemoves
                  key={remove._id}
                  remove={remove}
                  restoreCli={restoreCli}
                />
              ))} */}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default ClientScreen;
