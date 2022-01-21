import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useContext, useEffect, useState } from "react";
import { Client } from "../../interface/Client";
import {
  deleteClient,
  getClients,
  getClientDeleted,
  restoreClient,
} from "../../api/client/client";
import styles from "./Client.module.scss";
import ClientForm from "../../components/ClientComponent/Form/ClientForm";
import ClientListActives from "../../components/ClientComponent/List/Actives/ClientListActives";
import ClientListRemoves from "../../components/ClientComponent/List/Removes/ClientListRemoves";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import { IAlert } from "../../interface/IAlert";

const initialState: IAlert = {
  type: "",
  message: "",
};

const ClientScreen = () => {
  const [show, setShow] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [removes, setRemoves] = useState<Client[]>([]);
  const [state, setState] = useState<any>();
  const { resources } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [message, setMessage] = useState<IAlert>(initialState);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

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
      setState(value);
    }
  }, []);

  const deleteCli = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedClient = await deleteClient(id);
      const { data } = __deletedClient;
      const { clientDeleted } = data;
      if (clientDeleted) {
        listClients();
        listClientsDeleted();
      }
    },
    [listClients, listClientsDeleted, resource]
  );

  const restoreCli = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreCli = await restoreClient(id);
      const { data } = __restoreCli;
      const { clientRestored } = data;
      if (clientRestored) {
        listClients();
        listClientsDeleted();
      }
    },
    [listClients, listClientsDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listClients();
    }

    listClientsDeleted();
    getMyModule();
  }, [listClients, listClientsDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Clientes</Card.Header>
        <Card.Body>
          {resource && resource.canCreate && resource.canUpdate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo cliente
              </Button>
              <ClientForm
                show={show}
                closeModal={closeModal}
                listClients={listClients}
                client={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo cliente
              </Button>
              <ClientForm
                show={show}
                closeModal={closeModal}
                listClients={listClients}
                client={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <ClientForm
                show={show}
                closeModal={closeModal}
                listClients={listClients}
                client={state}
              />
            )
          )}
          {resource && resource.canRead && (
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
                  <th>Celular</th>
                  <th>Dirección</th>
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <ClientListActives
                    key={client._id}
                    client={client}
                    deleteCli={deleteCli}
                    openModalRE={openModalRE}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove) => (
                  <ClientListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreCli={restoreCli}
                  />
                ))}
              </tfoot>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ClientScreen;
