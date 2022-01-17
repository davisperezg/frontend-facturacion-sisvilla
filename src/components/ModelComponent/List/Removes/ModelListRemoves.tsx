import { memo } from "react";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import { Model } from "../../../../interface/Model";
import styles from "./ModelListRemove.module.scss";

const ModelListRemoves = ({
  remove,
  restoreModel,
}: {
  remove: Model;
  restoreModel: (id: string) => void;
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
            onClick={() => restoreModel(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ModelListRemoves);
