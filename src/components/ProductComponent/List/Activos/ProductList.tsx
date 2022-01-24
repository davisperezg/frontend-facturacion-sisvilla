import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import styles from "./ProductList.module.scss";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const ProductListActive = ({
  product,
  deleteProd,
  openModalRE,
}: {
  product: Product;
  deleteProd: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  const { mark, model, unit, area }: any = product;

  const { resources } = useContext(AuthContext);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [resource, setResource] = useState<any>(null);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  useEffect(() => {
    getMyModule();
  }, [getMyModule]);

  return (
    <>
      {resource && resource.canUpdate ? (
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
            {String(area.name)}
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
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteProd(String(product._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{product._id}</td>
          <td>{String(area.name)}</td>
          <td>{product.cod_internal}</td>
          <td>{product.name}</td>
          <td>{product.note}</td>
          <td>{String(mark.name)}</td>
          <td>{String(model.name)}</td>
          <td>{String(unit.name)}</td>
          <td>{product.stock}</td>
          <td>S/ {product.price}</td>
          <td className={`${styles.table__td} ${styles["table--center"]}`}>
            {product.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteProd(String(product._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(ProductListActive);
