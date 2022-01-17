import { Button, Card, Table } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { Supplier } from "../../interface/Supplier";
import { Resources } from "../../interface/Resources";
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

const SupplierScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [removes, setRemoves] = useState<Supplier[]>([]);
  const [state, setState] = useState<any>();

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
      const __deletedSupplier = await deleteSupplier(id);
      const { data } = __deletedSupplier;
      const { supplierDeleted } = data;
      if (supplierDeleted) {
        listSuppliers();
        listSuppliersDeleted();
      }
    },
    [listSuppliers, listSuppliersDeleted]
  );

  const restoreSup = useCallback(
    async (id: string) => {
      const __restoreSup = await restoreSupplier(id);
      const { data } = __restoreSup;
      const { supplierRestored } = data;
      if (supplierRestored) {
        listSuppliers();
        listSuppliersDeleted();
      }
    },
    [listSuppliers, listSuppliersDeleted]
  );

  useEffect(() => {
    listSuppliers();
    listSuppliersDeleted();
  }, [listSuppliers, listSuppliersDeleted]);

  return (
    <>
      <SupplierForm
        show={show}
        closeModal={closeModal}
        listSuppliers={listSuppliers}
        supplier={state}
      />

      <Card>
        <Card.Header as="h5">Lista de Proveedores</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nuevo proveedor
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
                <th>Contacto</th>
                <th>Celular</th>
                <th>Tipo de documento</th>
                <th>Nro de documento</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
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
        </Card.Body>
      </Card>
    </>
  );
};

export default SupplierScreen;
