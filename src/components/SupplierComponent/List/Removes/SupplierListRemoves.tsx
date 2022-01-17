import { Supplier } from "../../../../interface/Supplier";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import styles from "./SupplierListRemoves.module.scss";
import { memo } from "react";

const SupplierListRemoves = ({
  remove,
  restoreSup,
}: {
  remove: Supplier;
  restoreSup: (id: string) => void;
}) => {
  return (
    <>
      <tr>
        <td>{remove._id}</td>
        <td>{remove.name}</td>
        <td>{remove.contact}</td>
        <td>{remove.cellphone}</td>
        <td>{remove.tipDocument}</td>
        <td>{remove.nroDocument}</td>
        <td>{remove.email}</td>
        <td>{remove.address}</td>
        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreSup(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(SupplierListRemoves);
