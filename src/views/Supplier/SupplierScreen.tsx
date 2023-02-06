import { Alert, Button, Card, Table } from "react-bootstrap";
import { useCallback, useContext, useEffect, useState } from "react";
import { Supplier } from "../../interface/Supplier";
import {
  deleteSupplier,
  getSuppliers,
  getSupplierDeleted,
  restoreSupplier,
} from "../../api/supplier/supplier";
import styles from "./Supplier.module.scss";
import SupplierForm from "../../components/SupplierComponent/Form/SupplierForm";
import SupplierListActives from "../../components/SupplierComponent/List/Actives/SupplierListActives";
import SupplierListRemoves from "../../components/SupplierComponent/List/Removes/SupplierListRemoves";
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import { IAlert } from "../../interface/IAlert";

const initialState: IAlert = {
  type: "",
  message: "",
};

const SupplierScreen = () => {
  const [show, setShow] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [removes, setRemoves] = useState<Supplier[]>([]);
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

  const listSuppliers = useCallback(async () => {
    const res = await getSuppliers();
    const { data } = res;
    setSuppliers(data);
  }, []);

  const listSuppliersDeleted = useCallback(async () => {
    const res = await getSupplierDeleted();
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
      setState(value);
    }
  }, []);

  const deleteSup = useCallback(
    async (id: string) => {
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedSupplier = await deleteSupplier(id);
      const { data } = __deletedSupplier;
      const { supplierDeleted } = data;
      if (supplierDeleted) {
        listSuppliers();
        listSuppliersDeleted();
      }
    },
    [listSuppliers, listSuppliersDeleted, resource]
  );

  const restoreSup = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreSup = await restoreSupplier(id);
      const { data } = __restoreSup;
      const { supplierRestored } = data;
      if (supplierRestored) {
        listSuppliers();
        listSuppliersDeleted();
      }
    },
    [listSuppliers, listSuppliersDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listSuppliers();
    }

    listSuppliersDeleted();
    getMyModule();
  }, [listSuppliers, listSuppliersDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de Proveedores</Card.Header>
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
                Agregar nuevo proveedor
              </Button>{" "}
              <SupplierForm
                show={show}
                closeModal={closeModal}
                listSuppliers={listSuppliers}
                supplier={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar nuevo proveedor
              </Button>{" "}
              <SupplierForm
                show={show}
                closeModal={closeModal}
                listSuppliers={listSuppliers}
                supplier={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <SupplierForm
                show={show}
                closeModal={closeModal}
                listSuppliers={listSuppliers}
                supplier={state}
              />
            )
          )}

          {resource && resource.canRead && (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Celular</th>
                  <th>Tipo de documento</th>
                  <th>Nro de documento</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th className={`${styles["table--center"]}`}>Estado</th>
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <SupplierListActives
                    key={supplier._id}
                    supplier={supplier}
                    deleteSup={deleteSup}
                    openModalRE={openModalRE}
                  />
                ))}
              </tbody>
              <tfoot>
                {removes.map((remove) => (
                  <SupplierListRemoves
                    key={remove._id}
                    remove={remove}
                    restoreSup={restoreSup}
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

export default SupplierScreen;
