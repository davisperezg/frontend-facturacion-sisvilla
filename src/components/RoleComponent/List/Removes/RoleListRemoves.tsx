import { Rol } from "../../../../interface/Rol";
import { MdOutlineRestore } from "react-icons/md";
import { Badge } from "react-bootstrap";
import styles from "./RoleListRemoves.module.scss";
import { memo } from "react";
import { randomColors } from "../../../../lib/helpers/functions/functions";

const RoleListRemoves = ({
  remove,
  restoreRol,
}: {
  remove: Rol;
  restoreRol: (id: string) => void;
}) => {
  return (
    <tr>
      <td>{remove._id}</td>
      <td>{remove.name}</td>
      <td>{remove.description}</td>
      <td>
        {remove.module?.map((mod) => (
          <span key={mod._id}>
            <Badge bg={randomColors()}>{mod.name}</Badge>{" "}
          </span>
        ))}
      </td>
      <td className={`${styles["table--center"]}`}>
        {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
      </td>
      <td className={`${styles["table--center"]}`}>
        <MdOutlineRestore
          className={styles.table__iconRestore}
          onClick={() => restoreRol(String(remove._id))}
        />
      </td>
    </tr>
  );
};

export default memo(RoleListRemoves);
