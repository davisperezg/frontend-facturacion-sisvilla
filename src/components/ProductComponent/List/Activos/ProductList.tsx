import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import styles from "./ProductList.module.scss";
import { memo } from "react";

const ProductListActive = ({
  product,
  deleteProd,
  openModalRE,
}: {
  product: Product;
  deleteProd: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  const { mark, model, unit }: any = product;

  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {product._id}
        </td>

        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {product.cod_internal}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {product.name}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {product.note}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {String(mark.name)}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {String(model.name)}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {String(unit.name)}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          {product.stock}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, product)}
        >
          S/ {product.price}
        </td>
        <td
          className={`${styles.table__td} ${styles["table--center"]}`}
          onClick={() => openModalRE(true, product)}
        >
          {product.status && <Badge bg="success">Activo</Badge>}
        </td>
        <td className={`${styles["table--center"]}`}>
          <IoMdClose
            className={styles.table__iconClose}
            onClick={() => deleteProd(String(product._id))}
          />
        </td>
      </tr>
    </>
  );
};

export default memo(ProductListActive);
