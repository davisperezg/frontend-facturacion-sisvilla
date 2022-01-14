import styles from "./RoleList.module.scss";
import { Rol } from "../../../../interface/Rol";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";
import { randomColors } from "../../../../lib/helpers/functions/functions";

const RoleList = ({
  role,
  openModalRE,
  deleteRol,
}: {
  role: Rol;
  openModalRE: (props: boolean, value?: any) => void;
  deleteRol: any;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, role)}
        >
          {role._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, role)}
        >
          {role.name}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, role)}
        >
          {role.description}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, role)}
        >
          {role.module?.map((mod) => (
            <span key={mod._id}>
              <Badge bg={randomColors()}>{mod.name}</Badge>{" "}
            </span>
          ))}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, role)}
        >
          {role.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteRol(String(role._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(RoleList);
