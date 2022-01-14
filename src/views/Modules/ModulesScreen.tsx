import { Button, Card, Table } from "react-bootstrap";
import { Module } from "../../interface/Module";
import { useCallback, useEffect, useState } from "react";
import styles from "./Module.module.scss";
import ModuleListActives from "../../components/ModuleComponent/List/Actives/ModuleListActives";
import {
  deleteModule,
  getModuleDeleted,
  getModules,
  restoreModule,
} from "../../api/module/module";
import ModuleForm from "../../components/ModuleComponent/Form/ModuleForm";
import ModuleListRemoves from "../../components/ModuleComponent/List/Removes/ModuleListRemoves";
import { Resources } from "../../interface/Resources";

const ModulesScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [removes, setRemoves] = useState<Module[]>([]);
  const [state, setState] = useState<any>();

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
      const __deletedModule = await deleteModule(id);
      const { data } = __deletedModule;
      const { moduleDeleted } = data;
      if (moduleDeleted) {
        listModules();
        listModulesDeleted();
      }
    },
    [listModules, listModulesDeleted]
  );

  const restoreMo = useCallback(
    async (id: string) => {
      const __restoreModule = await restoreModule(id);
      const { data } = __restoreModule;
      const { moduleRestored } = data;
      if (moduleRestored) {
        listModules();
        listModulesDeleted();
      }
    },
    [listModules, listModulesDeleted]
  );

  useEffect(() => {
    listModules();
    listModulesDeleted();
  }, [listModules, listModulesDeleted]);

  return (
    <>
      <ModuleForm
        show={show}
        closeModal={closeModal}
        listModules={listModules}
        module={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Modulos</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nuevo modulo
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
                <th>Nombre</th>
                <th
                  className={`${styles.table__td} ${styles["table--center"]}`}
                >
                  Menus
                </th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
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
        </Card.Body>
      </Card>
    </>
  );
};

export default ModulesScreen;
