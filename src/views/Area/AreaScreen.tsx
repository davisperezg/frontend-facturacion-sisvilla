import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
import {
  deleteArea,
  getAreaDeleted,
  getAreas,
  restoreArea,
} from "../../api/area/area";
import AreaForm from "../../components/AreaComponent/Form/AreaForm";
import AreasActives from "../../components/AreaComponent/List/Actives/AreasActives";
import AreasRemoves from "../../components/AreaComponent/List/Removes/AreasRemoves";
import { Area } from "../../interface/Area";

const AreaScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [areas, setAreas] = useState<Area[]>([]);
  const [removes, setRemoves] = useState<Area[]>([]);

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

  const listAreas = useCallback(async () => {
    const res = await getAreas();
    const { data } = res;
    setAreas(data);
  }, []);
  const listAreaDeleted = useCallback(async () => {
    const res = await getAreaDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteArea = useCallback(
    async (id: string) => {
      const __deletedArea = await deleteArea(id);
      const { data } = __deletedArea;
      const { areaDeleted } = data;
      if (areaDeleted) {
        listAreas();
        listAreaDeleted();
      }
    },
    [listAreas, listAreaDeleted]
  );

  const _restoreArea = useCallback(
    async (id: string) => {
      const __restoreArea = await restoreArea(id);
      const { data } = __restoreArea;
      const { areaRestored } = data;
      if (areaRestored) {
        listAreas();
        listAreaDeleted();
      }
    },
    [listAreas, listAreaDeleted]
  );

  useEffect(() => {
    listAreas();
    listAreaDeleted();
  }, [listAreas, listAreaDeleted]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Tus areas y/o sedes</Card.Header>
        <Card.Body>
          <Alert variant="warning">
            Si vas actualizar el nombre de una area y/o sede. Recuerda que,
            actualizaras el area de todos tus usuarios asignados a esa area y/o
            sede
          </Alert>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nueva area
          </Button>
          <AreaForm
            show={show}
            closeModal={closeModal}
            listAreas={listAreas}
            area={state}
          />

          <Table striped bordered hover responsive="sm" className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <AreasActives
                  key={area._id}
                  area={area}
                  openModalRE={openModalRE}
                  deleteArea={_deleteArea}
                />
              ))}
            </tbody>
            <tfoot>
              {removes.map((remove) => (
                <AreasRemoves
                  key={remove._id}
                  remove={remove}
                  restoreArea={_restoreArea}
                />
              ))}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default AreaScreen;
