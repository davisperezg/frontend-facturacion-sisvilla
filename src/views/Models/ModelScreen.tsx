import { useCallback, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import {
  deleteModel,
  getModelDeleted,
  getModels,
  restoreModel,
} from "../../api/model/model";
import ModelForm from "../../components/ModelComponent/Form/ModelForm";
import ModelListActives from "../../components/ModelComponent/List/Actives/ModelListActives";
import ModelListRemoves from "../../components/ModelComponent/List/Removes/ModelListRemoves";
import { Model } from "../../interface/Model";
import { Resources } from "../../interface/Resources";
import styles from "./Model.module.scss";

const ModelScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [models, setModels] = useState<Model[]>([]);
  const [removes, setRemoves] = useState<Model[]>([]);

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

  const listModels = useCallback(async () => {
    const res = await getModels();
    const { data } = res;
    setModels(data);
  }, []);

  const listModelDeleted = useCallback(async () => {
    const res = await getModelDeleted();
    const { data } = res;
    console.log(data);
    setRemoves(data);
  }, []);

  const _deleteModel = useCallback(
    async (id: string) => {
      const __deletedMark = await deleteModel(id);
      const { data } = __deletedMark;
      const { modelDeleted } = data;
      if (modelDeleted) {
        listModels();
        listModelDeleted();
      }
    },
    [listModels, listModelDeleted]
  );

  const _restoreMark = useCallback(
    async (id: string) => {
      const __restoreMark = await restoreModel(id);
      const { data } = __restoreMark;
      const { modelRestored } = data;
      if (modelRestored) {
        listModels();
        listModelDeleted();
      }
    },
    [listModels, listModelDeleted]
  );

  useEffect(() => {
    listModels();
    listModelDeleted();
  }, [listModels, listModelDeleted]);

  return (
    <>
      <ModelForm
        show={show}
        closeModal={closeModal}
        listModels={listModels}
        model={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Modelos</Card.Header>
        <Card.Body>
          {myResource?.canCreate && (
            <Button
              type="button"
              variant="primary"
              onClick={() => openModalRE(false)}
            >
              Agregar nuevo modelo
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
              {models.map((model) => (
                <ModelListActives
                  key={model._id}
                  model={model}
                  openModalRE={openModalRE}
                  deleteModel={_deleteModel}
                />
              ))}
            </tbody>
            <tfoot>
              {removes.map((remove) => (
                <ModelListRemoves
                  key={remove._id}
                  remove={remove}
                  restoreModel={_restoreMark}
                />
              ))}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default ModelScreen;
