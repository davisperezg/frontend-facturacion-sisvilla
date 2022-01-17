import { Mark } from "../../../../interface/Mark";
import styles from "./MarkListActives.module.scss";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";

const MarkListActives = ({
  mark,
  deleteMark,
  openModalRE,
}: {
  mark: Mark;
  deleteMark: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, mark)}
        >
          {mark._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, mark)}
        >
          {mark.name}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, mark)}
        >
          {mark.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteMark(String(mark._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(MarkListActives);
