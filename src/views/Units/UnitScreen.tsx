import { Resources } from "../../interface/Resources";
import { Unit } from "../../interface/Unit";
import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useState, useEffect } from "react";
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

const UnitScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [units, setUnits] = useState<Unit[]>([]);
  const [removes, setRemoves] = useState<Unit[]>([]);

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
      const __deletedUnit = await deleteUnit(id);
      const { data } = __deletedUnit;
      const { unitDeleted } = data;
      if (unitDeleted) {
        listUnits();
        listUnitDeleted();
      }
    },
    [listUnits, listUnitDeleted]
  );

  const _restoreUnit = useCallback(
    async (id: string) => {
      const __restoreUnit = await restoreUnit(id);
      const { data } = __restoreUnit;
      const { unitRestored } = data;
      if (unitRestored) {
        listUnits();
        listUnitDeleted();
      }
    },
    [listUnits, listUnitDeleted]
  );

  useEffect(() => {
    listUnits();
    listUnitDeleted();
  }, [listUnits, listUnitDeleted]);

  return (
    <>
      <UnitForm
        show={show}
        closeModal={closeModal}
        listUnits={listUnits}
        unit={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Unidades de medida</Card.Header>
        <Card.Body>
          {myResource?.canCreate && (
            <Button
              type="button"
              variant="primary"
              onClick={() => openModalRE(false)}
            >
              Agregar nueva unidad de medida
            </Button>
          )}

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
                <th className={`${styles["table--center"]}`}>Eliminar</th>
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
        </Card.Body>
      </Card>
    </>
  );
};

export default UnitScreen;
