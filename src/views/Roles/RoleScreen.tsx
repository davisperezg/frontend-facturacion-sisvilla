import { Alert, Button, Card, Table } from "react-bootstrap";
import styles from "./Rol.module.scss";
import { Rol } from "../../interface/Rol";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  deleteRole,
  getRoles,
  getRolesDeleted,
  restoreRole,
} from "../../api/role/role";
import RoleListRemoves from "../../components/RoleComponent/List/Removes/RoleListRemoves";
import RoleList from "../../components/RoleComponent/List/Actives/RoleList";
import RoleForm from "../../components/RoleComponent/Form/RoleForm";
import { IAlert } from "../../interface/IAlert";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";

const initialState: IAlert = {
  type: "",
  message: "",
};

const RoleScreen = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [removes, setRemoves] = useState<Rol[]>([]);
  const [show, setShow] = useState(false);
  //const [counter, setCounter] = useState(0);
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

  const listRoles = useCallback(async () => {
    const res = await getRoles();
    const { data } = res;
    setRoles(data);
  }, []);

  const listRolesDeleted = useCallback(async () => {
    const res = await getRolesDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  useEffect(() => {
    if (resource && resource.canRead) {
      listRoles();
    }
    listRolesDeleted();
    getMyModule();
  }, [listRoles, listRolesDeleted, resource, getMyModule]);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      const valsRol = {
        _id: value._id,
        name: value.name,
        description: value.description || "",
        module: value.module.map((mod: any) => {
          return {
            label: mod.name,
            value: mod.name,
          };
        }),
      };
      setState(valsRol);
    }
  }, []);

  const deleteRol = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const deletedRol = await deleteRole(id);
      const { data } = deletedRol;
      const { roleDeleted } = data;
      if (roleDeleted) {
        listRoles();
        listRolesDeleted();
      }
    },
    [listRoles, listRolesDeleted, resource]
  );

  const restoreRol = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const restoreRol = await restoreRole(id);
      const { data } = restoreRol;
      const { roleRestored } = data;
      if (roleRestored) {
        listRoles();
        listRolesDeleted();
      }
    },
    [listRoles, listRolesDeleted, resource]
  );

  return (
    <>
      <Card>
        {/* <button onClick={onclicka}>{counter}</button> */}
        <Card.Header as="h5">Lista de Roles</Card.Header>
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
                Agregar nuevo rol
              </Button>
              <RoleForm
                show={show}
                closeModal={closeModal}
                listRoles={listRoles}
                role={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo rol
              </Button>
              <RoleForm
                show={show}
                closeModal={closeModal}
                listRoles={listRoles}
                role={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <RoleForm
                show={show}
                closeModal={closeModal}
                listRoles={listRoles}
                role={state}
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
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Modulos</th>
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <RoleList
                    key={role._id}
                    role={role}
                    openModalRE={openModalRE}
                    deleteRol={deleteRol}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove) => (
                  <RoleListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreRol={restoreRol}
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

export default RoleScreen;
