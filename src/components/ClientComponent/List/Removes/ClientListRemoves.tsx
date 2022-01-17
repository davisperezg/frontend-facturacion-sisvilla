import { Client } from "../../../../interface/Client";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import styles from "./ClientListRemoves.module.scss";
import { memo } from "react";

const ClientListRemoves = ({
  remove,
  restoreCli,
}: {
  remove: Client;
  restoreCli: (id: string) => void;
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
        <td>{remove.cellphone}</td>
        <td>{remove.address}</td>
        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreCli(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ClientListRemoves);
