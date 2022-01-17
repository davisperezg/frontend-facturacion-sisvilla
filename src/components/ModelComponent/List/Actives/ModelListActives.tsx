import { Model } from "../../../../interface/Model";
import styles from "./ModelListActives.module.scss";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";

const ModelListActives = ({
  model,
  deleteModel,
  openModalRE,
}: {
  model: Model;
  deleteModel: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, model)}
        >
          {model._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, model)}
        >
          {model.name}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, model)}
        >
          {model.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteModel(String(model._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ModelListActives);
