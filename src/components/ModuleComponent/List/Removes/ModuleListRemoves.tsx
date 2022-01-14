import { memo } from "react";
import { MdOutlineRestore } from "react-icons/md";
import { Module } from "../../../../interface/Module";
import { Badge } from "react-bootstrap";
import styles from "./ModuleListRemove.module.scss";
import { randomColors } from "../../../../lib/helpers/functions/functions";

const ModuleListRemoves = ({
  remove,
  restoreMo,
}: {
  remove: Module;
  restoreMo: (id: string) => void;
}) => {
  return (
    <>
      <tr>
        <td>{remove._id}</td>
        <td>{remove.name}</td>
        <td>
          {remove.menu?.map((men) => (
            <span key={men._id}>
              <Badge bg={randomColors()}>{men.name}</Badge>{" "}
            </span>
          ))}
        </td>

        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreMo(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ModuleListRemoves);
