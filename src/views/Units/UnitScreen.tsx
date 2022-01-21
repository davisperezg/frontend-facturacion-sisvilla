import { Unit } from "../../interface/Unit";
import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useState, useEffect, useContext } from "react";
import styles from "./Unit.module.scss";
import {
  deleteUnit,
  getUnitDeleted,
  getUnits,
  restoreUnit,
} from "../../api/unit/unit";
import UnitListActives from "../../components/UnitComponent/List/Actives/UnitListActives";
import UnitListRemoves from "../../components/UnitComponent/List/Removes/UnitListRemoves";
import UnitForm from "../../components/UnitComponent/Form/UnitForm";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import { IAlert } from "../../interface/IAlert";

const initialState: IAlert = {
  type: "",
  message: "",
};

const UnitScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [removes, setRemoves] = useState<Unit[]>([]);
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

  const listUnits = useCallback(async () => {
    const res = await getUnits();
    const { data } = res;
    setUnits(data);
  }, []);

  const listUnitDeleted = useCallback(async () => {
    const res = await getUnitDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteUnit = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedUnit = await deleteUnit(id);
      const { data } = __deletedUnit;
      const { unitDeleted } = data;
      if (unitDeleted) {
        listUnits();
        listUnitDeleted();
      }
    },
    [listUnits, listUnitDeleted, resource]
  );

  const _restoreUnit = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreUnit = await restoreUnit(id);
      const { data } = __restoreUnit;
      const { unitRestored } = data;
      if (unitRestored) {
        listUnits();
        listUnitDeleted();
      }
    },
    [listUnits, listUnitDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listUnits();
    }
    listUnitDeleted();
    getMyModule();
  }, [listUnits, listUnitDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Unidades de medida</Card.Header>
        <Card.Body>
          {resource && resource.canCreate && resource.canUpdate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nueva unidad de medida
              </Button>
              <UnitForm
                show={show}
                closeModal={closeModal}
                listUnits={listUnits}
                unit={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nueva unidad de medida
              </Button>
              <UnitForm
                show={show}
                closeModal={closeModal}
                listUnits={listUnits}
                unit={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <UnitForm
                show={show}
                closeModal={closeModal}
                listUnits={listUnits}
                unit={state}
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
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <UnitListActives
                    key={unit._id}
                    unit={unit}
                    openModalRE={openModalRE}
                    deleteUnit={_deleteUnit}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove) => (
                  <UnitListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreUnit={_restoreUnit}
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

export default UnitScreen;
