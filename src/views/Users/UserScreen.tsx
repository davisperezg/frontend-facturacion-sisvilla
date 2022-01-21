import { Alert, Button, Card, Table } from "react-bootstrap";
import { User } from "../../interface/User";
import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./User.module.scss";
import {
  deleteUser,
  getUsers,
  getUsersDeleted,
  restoreUser,
} from "../../api/user/user";
import UserListActives from "../../components/UserComponent/List/Actives/UserListActives";
import UserForm from "../../components/UserComponent/Form/UserForm";
import UserListRemoves from "../../components/UserComponent/List/Removes/UserListRemoves";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { IAlert } from "../../interface/IAlert";
import { getModuleByMenu } from "../../api/module/module";

const initialState: IAlert = {
  type: "",
  message: "",
};

const UserScreen = () => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [removes, setRemoves] = useState<User[]>([]);
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

  const listUsers = useCallback(async () => {
    const res = await getUsers();
    const { data } = res;
    setUsers(data);
  }, []);

  const listUsersDeleted = useCallback(async () => {
    const res = await getUsersDeleted();
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

  const deleteUsu = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedUser = await deleteUser(id);
      const { data } = __deletedUser;
      const { userDeleted } = data;
      if (userDeleted) {
        listUsers();
        listUsersDeleted();
      }
    },
    [listUsers, listUsersDeleted, resource]
  );

  const restoreUsu = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreUsu = await restoreUser(id);
      const { data } = __restoreUsu;
      const { userRestored } = data;
      if (userRestored) {
        listUsers();
        listUsersDeleted();
      }
    },
    [listUsers, listUsersDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listUsers();
    }

    listUsersDeleted();
    getMyModule();
  }, [listUsers, listUsersDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Usuarios</Card.Header>
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
                Agregar nuevo usuario
              </Button>
              <UserForm
                show={show}
                closeModal={closeModal}
                listUsers={listUsers}
                user={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo usuario
              </Button>
              <UserForm
                show={show}
                closeModal={closeModal}
                listUsers={listUsers}
                user={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <UserForm
                show={show}
                closeModal={closeModal}
                listUsers={listUsers}
                user={state}
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
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserListActives
                    key={user._id}
                    user={user}
                    deleteUsu={deleteUsu}
                    openModalRE={openModalRE}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove) => (
                  <UserListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreUsu={restoreUsu}
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

export default UserScreen;
