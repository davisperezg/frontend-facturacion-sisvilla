import styles from "./ProductListRemoves.module.scss";
import { MdOutlineRestore } from "react-icons/md";
import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const ProductListRemoves = ({
  remove,
  restorePro,
}: {
  remove: Product;
  restorePro: (id: string) => void;
}) => {
  const { mark, model, unit }: any = remove;

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
        {resource && resource.canRestore && (
          <td className={`${styles["table--center"]}`}>
            <MdOutlineRestore
              className={styles.table__iconRestore}
              onClick={() => restorePro(String(remove._id))}
            />
          </td>
        )}
      </tr>
    </>
  );
};

export default memo(ProductListRemoves);
