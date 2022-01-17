import { memo } from "react";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import { Mark } from "../../../../interface/Mark";
import styles from "./ModuleListRemove.module.scss";

const MarkListRemoves = ({
  remove,
  restoreMark,
}: {
  remove: Mark;
  restoreMark: (id: string) => void;
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
            onClick={() => restoreMark(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(MarkListRemoves);
