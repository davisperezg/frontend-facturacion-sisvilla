import styles from "./ProductListRemoves.module.scss";
import { MdOutlineRestore } from "react-icons/md";
import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import { memo } from "react";

const ProductListRemoves = ({
  remove,
  restorePro,
}: {
  remove: Product;
  restorePro: (id: string) => void;
}) => {
  const { mark, model, unit }: any = remove;

  return (
    <>
      <tr>
        <td>{remove._id}</td>
        <td>{remove.cod_internal}</td>
        <td>{remove.name}</td>
        <td>{remove.note}</td>
        <td>{String(mark.name)}</td>
        <td>{String(model.name)}</td>
        <td>{String(unit.name)}</td>
        <td>{remove.stock}</td>
        <td>S/ {remove.price}</td>
        <td className={`${styles["table--center"]}`}>
          {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restorePro(String(remove._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ProductListRemoves);
