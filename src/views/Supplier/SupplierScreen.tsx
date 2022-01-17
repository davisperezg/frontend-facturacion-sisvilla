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
      setState({ ...value, role: value.role.name });
    }
  }, []);

  const deleteCli = useCallback(
    async (id: string) => {
      const __deletedSupplier = await deleteSupplier(id);
      const { data } = __deletedSupplier;
      const { userDeleted } = data;
      if (userDeleted) {
        listSuppliers();
        listSuppliersDeleted();
      }
    },
    [listSuppliers, listSuppliersDeleted]
  );

  const restoreCli = useCallback(
    async (id: string) => {
      const __restoreCli = await restoreSupplier(id);
      const { data } = __restoreCli;
      const { userRestored } = data;
      if (userRestored) {
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
    // <SupplierForm
    //   show={show}
    //   closeModal={closeModal}
    //   listSuppliers={listSuppliers}
    //   user={state}
    // />

    <>
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
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Documento</th>
                <th>Nro. de documento</th>
                <th>Correo</th>
                <th>Cliario</th>
                <th>Rol</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {/* {suppliers.map((user) => (
                <SupplierListActives
                  key={user._id}
                  user={user}
                  deleteCli={deleteCli}
                  openModalRE={openModalRE}
                />
              ))} */}
            </tbody>
            <tfoot>
              {/* {removes.map((remove) => (
                <SupplierListRemoves
                  key={remove._id}
                  remove={remove}
                  restoreCli={restoreCli}
                />
              ))} */}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default SupplierScreen;
