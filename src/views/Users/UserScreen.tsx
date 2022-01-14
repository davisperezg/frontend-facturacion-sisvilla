import { Button, Card, Table } from "react-bootstrap";
import { User } from "../../interface/User";
import { useCallback, useEffect, useState } from "react";
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
import { Resources } from "../../interface/Resources";

const UserScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [removes, setRemoves] = useState<User[]>([]);
  const [state, setState] = useState<any>();

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
      const __deletedUser = await deleteUser(id);
      const { data } = __deletedUser;
      const { userDeleted } = data;
      if (userDeleted) {
        listUsers();
        listUsersDeleted();
      }
    },
    [listUsers, listUsersDeleted]
  );

  const restoreUsu = useCallback(
    async (id: string) => {
      const __restoreUsu = await restoreUser(id);
      const { data } = __restoreUsu;
      const { userRestored } = data;
      if (userRestored) {
        listUsers();
        listUsersDeleted();
      }
    },
    [listUsers, listUsersDeleted]
  );

  useEffect(() => {
    listUsers();
    listUsersDeleted();
  }, [listUsers, listUsersDeleted]);

  return (
    <>
      <UserForm
        show={show}
        closeModal={closeModal}
        listUsers={listUsers}
        user={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Usuarios</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nuevo usuario
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
                <th>Usuario</th>
                <th>Rol</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
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
        </Card.Body>
      </Card>
    </>
  );
};

export default UserScreen;
