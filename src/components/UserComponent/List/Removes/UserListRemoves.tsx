import { User } from "../../../../interface/User";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import styles from "./UserListRemoves.module.scss";
import { memo } from "react";

const UserListRemoves = ({
  remove,
  restoreUsu,
}: {
  remove: User;
  restoreUsu: (id: string) => void;
}) => {
  return (
    <>
      <tr>
        <td>{remove._id}</td>
        <td>{remove.name}</td>
        <td>{remove.lastname}</td>
        <td>{remove.tipDocument}</td>
        <td>{remove.nroDocument}</td>
        <td>{remove.email}</td>
        <td>{remove.username}</td>
        <td>{remove.role.name}</td>
        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreUsu(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(UserListRemoves);
