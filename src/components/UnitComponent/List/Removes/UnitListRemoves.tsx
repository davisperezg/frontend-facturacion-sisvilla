import { Unit } from "../../../../interface/Unit";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import styles from "./UnitListRemoves.module.scss";
import { memo } from "react";

const UnitListRemoves = ({
  remove,
  restoreUnit,
}: {
  remove: Unit;
  restoreUnit: (id: string) => void;
}) => {
  return (
    <>
      <tr>
        <td>{remove._id}</td>
        <td>{remove.name}</td>
        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreUnit(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(UnitListRemoves);
