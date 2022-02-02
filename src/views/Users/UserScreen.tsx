import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { User } from "../../interface/User";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import styles from "./User.module.scss";
import {
  changePassword,
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
import { InputChange } from "../../lib/types/types";

const initialState: IAlert = {
  type: "",
  message: "",
};

const UserScreen = () => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [removes, setRemoves] = useState<User[]>([]);
  const [state, setState] = useState<any>();
  const { resources, user } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [message2, setMessage2] = useState<IAlert>(initialState);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [changePassowrd, setChangePassword] = useState({
    id: "",
    newPassword: "",
  });
  const [disabled, setDisabled] = useState(false);

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
      setState({ ...value, role: value.role.name, area: value.area.name });
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

  const openModalPassword = (id: string) => {
    setChangePassword({ ...changePassowrd, id });
    setShowModal(true);
  };

  const closeModalPassword = () => {
    setChangePassword({
      id: "",
      newPassword: "",
    });
    setMessage2(initialState);
    setShowModal(false);
    setErrors({});
  };

  const onChangeAccount = (e: InputChange) => {
    setMessage2(initialState);
    if (errors[e.target.name])
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    setChangePassword({ ...changePassowrd, [e.target.name]: e.target.value });
  };

  const findFormErrors = () => {
    const { newPassword } = changePassowrd;
    const newErrors: any = {};
    if (!newPassword || newPassword === "")
      newErrors.newPassword = "Por favor ingrese una contraseña.";

    return newErrors;
  };

  const onSubmitChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setDisabled(true);
      const { id, newPassword } = changePassowrd;
      await changePassword(id, newPassword);
      setMessage2({
        type: "success",
        message: "Se ha cambiado la contraseña correctamente.",
      });
      setChangePassword({
        ...changePassowrd,
        newPassword: "",
      });
      setDisabled(false);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={closeModalPassword} centered>
        <Form onSubmit={onSubmitChangePassword}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message2.type && (
              <Alert variant={message2.type}>{message2.message}</Alert>
            )}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>
                  Nueva contraseña <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  name="newPassword"
                  onChange={onChangeAccount}
                  value={changePassowrd.newPassword}
                  type="password"
                  placeholder="Introduce contraseña"
                  isInvalid={!!errors?.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.newPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModalPassword}>
              Cerrar
            </Button>
            <Button disabled={disabled} type="submit" variant="success">
              Cambiar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Card>
        <Card.Header as="h5">Lista de Usuarios</Card.Header>
        <Card.Body>
          <Alert variant="warning">
            Si haz actualizado el area y/o sede de un usuario, el usuario tiene
            que actualizar su página para que vizualice su nueva area y/o sede.
          </Alert>
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
                  <th>Area</th>
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
                  <th className={`${styles["table--center"]}`}>Contraseña</th>
                </tr>
              </thead>
              <tbody>
                {user.role.name === "SUPER ADMINISTRADOR"
                  ? users.map((user) => (
                      <UserListActives
                        key={user._id}
                        user={user}
                        deleteUsu={deleteUsu}
                        openModalRE={openModalRE}
                        openModalPassword={openModalPassword}
                      />
                    ))
                  : users
                      .filter(
                        (flts) => flts.role.name !== "SUPER ADMINISTRADOR"
                      )
                      .map((user) => (
                        <UserListActives
                          key={user._id}
                          user={user}
                          deleteUsu={deleteUsu}
                          openModalRE={openModalRE}
                          openModalPassword={openModalPassword}
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
