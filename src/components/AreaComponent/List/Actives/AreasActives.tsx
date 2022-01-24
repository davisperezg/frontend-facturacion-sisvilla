import { Area } from "../../../../interface/Area";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";
import styles from "./AreasActives.module.scss";

const AreaListActives = ({
  area,
  deleteArea,
  openModalRE,
}: {
  area: Area;
  deleteArea: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, area)}
        >
          {area._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, area)}
        >
          {area.name}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, area)}
        >
          {area.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className="text-center">
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteArea(String(area._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(AreaListActives);
