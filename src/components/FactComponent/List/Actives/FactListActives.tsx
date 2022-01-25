import { Badge } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { Fact } from "../../../../interface/Fact";
import {
  formatter,
  formatDate,
} from "../../../../lib/helpers/functions/functions";
import styles from "./FactListActives.module.scss";

const FactListActives = ({
  fact,
  item,
  deleteFact,
  openModalRE,
}: {
  fact: Fact;
  item: number;
  deleteFact: (id: string, cod: number) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  const { client, user }: any = fact;

  return (
    <tr>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {item + 1}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        000{fact.cod_fact}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {formatDate(new Date(String(fact.createdAt)))}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {client.name} {client.lastname}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {user.name} {user.lastname}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {fact.payment_type}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        {fact.way_to_pay}
      </td>
      <td className={styles.table__td} onClick={() => openModalRE(true, fact)}>
        S/ {formatter.format(fact.subtotal - fact.discount)}
      </td>
      <td
        className={`${styles.table__td} ${styles["table--center"]}`}
        onClick={() => openModalRE(true, fact)}
      >
        {fact.status && <Badge bg="success">Pagada</Badge>}
      </td>
      <td className={`${styles["table--center"]}`}>
        <IoMdClose
          className={styles.table__iconClose}
          onClick={() => deleteFact(String(fact._id), Number(fact.cod_fact))}
        />
      </td>
    </tr>
  );
};

export default FactListActives;
