import styles from "./ProductListRemoves.module.scss";
import { MdOutlineRestore } from "react-icons/md";
import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";
import { formatter } from "../../../../lib/helpers/functions/functions";

const ProductListRemoves = ({
  item,
  remove,
  restorePro,
}: {
  item: number;
  remove: Product;
  restorePro: (id: string) => void;
}) => {
  const { mark, model, unit, area }: any = remove;

  const { resources, user } = useContext(AuthContext);
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
        <td>{item}</td>
        <td>{String(area.name)}</td>
        <td>{String(remove.cod_internal).slice(3)}</td>
        <td>{remove.name}</td>
        {/* <td>{remove.note}</td> */}
        <td>{String(mark.name)}</td>
        <td>{String(model.name)}</td>
        <td>{String(unit.name)}</td>
        <td>{remove.stock}</td>
        <td>S/ {formatter.format(remove.price)}</td>
        {user.role.name === "SUPER ADMINISTRADOR" && (
          <td>
            S/{" "}
            {remove.price_c === undefined
              ? "No registrado"
              : formatter.format(remove.price_c)}
          </td>
        )}

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
