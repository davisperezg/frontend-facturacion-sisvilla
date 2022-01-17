import { Client } from "../../../../interface/Client";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo } from "react";
import styles from "./ClientListActives.module.scss";

const ClientListActives = ({
  client,
  deleteCli,
  openModalRE,
}: {
  client: Client;
  deleteCli: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.name}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.lastname}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.tipDocument}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.nroDocument}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.email}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.cellphone}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, client)}
        >
          {client.address}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, client)}
        >
          {client.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteCli(String(client._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ClientListActives);
