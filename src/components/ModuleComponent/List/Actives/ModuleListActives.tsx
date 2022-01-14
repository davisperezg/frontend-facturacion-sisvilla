import { memo } from "react";
import { Module } from "../../../../interface/Module";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import styles from "./ModuleList.module.scss";
import { randomColors } from "../../../../lib/helpers/functions/functions";

const ModuleListActives = ({
  module,
  deleteMo,
  openModalRE,
}: {
  module: Module;
  deleteMo: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, module)}
        >
          {module._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, module)}
        >
          {module.name}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, module)}
        >
          {module.menu?.map((men) => (
            <span key={men._id}>
              <Badge bg={randomColors()}>{men.name}</Badge>{" "}
            </span>
          ))}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, module)}
        >
          {module.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteMo(String(module._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ModuleListActives);
