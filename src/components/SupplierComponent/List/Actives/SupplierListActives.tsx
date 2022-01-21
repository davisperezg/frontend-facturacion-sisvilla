import { Supplier } from "../../../../interface/Supplier";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import styles from "./SupplierListActives.module.scss";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const SupplierListActives = ({
  supplier,
  deleteSup,
  openModalRE,
}: {
  supplier: Supplier;
  deleteSup: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  const { resources } = useContext(AuthContext);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [resource, setResource] = useState<any>(null);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  useEffect(() => {
    getMyModule();
  }, [getMyModule]);

  return (
    <>
      {resource && resource.canUpdate ? (
        <tr>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.contact}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.cellphone}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.tipDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.nroDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.email}
          </td>

          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.address}
          </td>

          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, supplier)}
          >
            {supplier.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteSup(String(supplier._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{supplier._id}</td>
          <td>{supplier.name}</td>
          <td>{supplier.contact}</td>
          <td>{supplier.cellphone}</td>
          <td>{supplier.tipDocument}</td>
          <td>{supplier.nroDocument}</td>
          <td>{supplier.email}</td>
          <td>{supplier.address}</td>
          <td className={`${styles["table--center"]}`}>
            {supplier.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteSup(String(supplier._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(SupplierListActives);
