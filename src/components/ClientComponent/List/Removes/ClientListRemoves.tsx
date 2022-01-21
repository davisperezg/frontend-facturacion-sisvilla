import { Client } from "../../../../interface/Client";
import { Badge } from "react-bootstrap";
import { MdOutlineRestore } from "react-icons/md";
import styles from "./ClientListRemoves.module.scss";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../../context/auth";
import { getModuleByMenu } from "../../../../api/module/module";

const ClientListRemoves = ({
  remove,
  restoreCli,
}: {
  remove: Client;
  restoreCli: (id: string) => void;
}) => {
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
        {resource && resource.canRestore && (
          <td className={`${styles["table--center"]}`}>
            <MdOutlineRestore
              className={styles.table__iconRestore}
              onClick={() => restoreCli(String(remove._id))}
            />
          </td>
        )}
      </tr>
    </>
  );
};

export default memo(ClientListRemoves);
