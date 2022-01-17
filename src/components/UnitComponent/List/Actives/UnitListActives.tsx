import { Unit } from "../../../../interface/Unit";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import styles from "./UnitListActives.module.scss";
import { memo } from "react";

const UnitListActives = ({
  unit,
  deleteUnit,
  openModalRE,
}: {
  unit: Unit;
  deleteUnit: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, unit)}
        >
          {unit._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, unit)}
        >
          {unit.name}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, unit)}
        >
          {unit.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteUnit(String(unit._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(UnitListActives);
