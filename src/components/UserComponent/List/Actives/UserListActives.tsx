import { User } from "../../../../interface/User";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";
import styles from "./UserList.module.scss";

const UserListActives = ({
  user,
  deleteUsu,
  openModalRE,
}: {
  user: User;
  deleteUsu: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.name}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.lastname}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.tipDocument}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.nroDocument}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.email}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.username}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, user)}
        >
          {user.role.name}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, user)}
        >
          {user.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteUsu(String(user._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(UserListActives);
