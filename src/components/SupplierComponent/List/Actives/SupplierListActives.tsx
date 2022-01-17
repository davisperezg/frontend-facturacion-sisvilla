import { Supplier } from "../../../../interface/Supplier";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";
import styles from "./SupplierListActives.module.scss";

const SupplierListActives = ({
  supplier,
  deleteSup,
  openModalRE,
}: {
  supplier: Supplier;
  deleteSup: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
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
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteSup(String(supplier._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(SupplierListActives);
