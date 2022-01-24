import { memo } from "react";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import { Area } from "../../../../interface/Area";
import styles from "./AreasRemoves.module.scss";

const AreaListRemoves = ({
  remove,
  restoreArea,
}: {
  remove: Area;
  restoreArea: (id: string) => void;
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
            onClick={() => restoreArea(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(AreaListRemoves);
