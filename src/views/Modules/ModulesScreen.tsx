import { Alert, Button, Card, Table } from "react-bootstrap";
import { Module } from "../../interface/Module";
import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./Module.module.scss";
import ModuleListActives from "../../components/ModuleComponent/List/Actives/ModuleListActives";
import {
  deleteModule,
  getModuleByMenu,
  getModuleDeleted,
  getModules,
  restoreModule,
} from "../../api/module/module";
import ModuleForm from "../../components/ModuleComponent/Form/ModuleForm";
import ModuleListRemoves from "../../components/ModuleComponent/List/Removes/ModuleListRemoves";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { IAlert } from "../../interface/IAlert";

const initialState: IAlert = {
  type: "",
  message: "",
};

const ModulesScreen = () => {
  const [show, setShow] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [removes, setRemoves] = useState<Module[]>([]);
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

  const listModules = useCallback(async () => {
    const res = await getModules();
    const { data } = res;
    setModules(data);
  }, []);

  const listModulesDeleted = useCallback(async () => {
    const res = await getModuleDeleted();
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
      const vals = {
        _id: value._id,
        name: value.name,
        menu: value.menu.map((mod: any) => {
          return {
            label: mod.name,
            value: mod.name,
          };
        }),
      };
      setState(vals);
    }
  }, []);

  const deleteMo = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedModule = await deleteModule(id);
      const { data } = __deletedModule;
      const { moduleDeleted } = data;
      if (moduleDeleted) {
        listModules();
        listModulesDeleted();
      }
    },
    [listModules, listModulesDeleted, resource]
  );

  const restoreMo = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreModule = await restoreModule(id);
      const { data } = __restoreModule;
      const { moduleRestored } = data;
      if (moduleRestored) {
        listModules();
        listModulesDeleted();
      }
    },
    [listModules, listModulesDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listModules();
    }
    listModulesDeleted();
    getMyModule();
  }, [listModules, listModulesDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Modulos</Card.Header>
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
                Agregar nuevo modulo
              </Button>
              <ModuleForm
                show={show}
                closeModal={closeModal}
                listModules={listModules}
                module={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo modulo
              </Button>
              <ModuleForm
                show={show}
                closeModal={closeModal}
                listModules={listModules}
                module={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <ModuleForm
                show={show}
                closeModal={closeModal}
                listModules={listModules}
                module={state}
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
                  <th
                    className={`${styles.table__td} ${styles["table--center"]}`}
                  >
                    Menus
                  </th>
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <ModuleListActives
                    key={module._id}
                    module={module}
                    deleteMo={deleteMo}
                    openModalRE={openModalRE}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove, i) => (
                  <ModuleListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreMo={restoreMo}
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

export default ModulesScreen;
