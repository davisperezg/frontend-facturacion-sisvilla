import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {
  deleteModel,
  getModelDeleted,
  getModels,
  restoreModel,
} from "../../api/model/model";
import { getModuleByMenu } from "../../api/module/module";
import ModelForm from "../../components/ModelComponent/Form/ModelForm";
import ModelListActives from "../../components/ModelComponent/List/Actives/ModelListActives";
import ModelListRemoves from "../../components/ModelComponent/List/Removes/ModelListRemoves";
import { AuthContext } from "../../context/auth";
import { IAlert } from "../../interface/IAlert";
import { Model } from "../../interface/Model";
import styles from "./Model.module.scss";

const initialState: IAlert = {
  type: "",
  message: "",
};

const ModelScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [models, setModels] = useState<Model[]>([]);
  const [removes, setRemoves] = useState<Model[]>([]);
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
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedMark = await deleteModel(id);
      const { data } = __deletedMark;
      const { modelDeleted } = data;
      if (modelDeleted) {
        listModels();
        listModelDeleted();
      }
    },
    [listModels, listModelDeleted, resource]
  );

  const _restoreMark = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreMark = await restoreModel(id);
      const { data } = __restoreMark;
      const { modelRestored } = data;
      if (modelRestored) {
        listModels();
        listModelDeleted();
      }
    },
    [listModels, listModelDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listModels();
    }

    listModelDeleted();
    getMyModule();
  }, [listModels, listModelDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Modelos</Card.Header>
        <Card.Body>
          {resource && resource.canCreate && resource.canUpdate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo modelo
              </Button>
              <ModelForm
                show={show}
                closeModal={closeModal}
                listModels={listModels}
                model={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo modelo
              </Button>
              <ModelForm
                show={show}
                closeModal={closeModal}
                listModels={listModels}
                model={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <ModelForm
                show={show}
                closeModal={closeModal}
                listModels={listModels}
                model={state}
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
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ModelScreen;
