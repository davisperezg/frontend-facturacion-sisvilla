import { Badge } from "react-bootstrap";
import { Fact } from "../../../../interface/Fact";
import styles from "./FactListRemove.module.scss";
import {
  formatter,
  formatDate,
} from "../../../../lib/helpers/functions/functions";

const FactListRemoves = ({ remove, item }: { remove: Fact; item: number }) => {
  const { client, user }: any = remove;

  return (
    <tr>
      <td>{item + 1}</td>
      <td>000{remove.cod_fact}</td>
      <td>{formatDate(new Date(String(remove.createdAt)))}</td>
      <td>
        {client.name} {client.lastname}
      </td>
      <td>
        {user.name} {user.lastname}
      </td>
      <td>{remove.payment_type}</td>
      <td>{remove.way_to_pay}</td>
      <td>{formatter.format(remove.subtotal - remove.discount)}</td>
      <td className={`${styles.table__td} ${styles["table--center"]}`}>
        <Badge bg="danger">Anulada</Badge>
      </td>
    </tr>
  );
};

export default FactListRemoves;
