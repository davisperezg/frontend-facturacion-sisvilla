import { Rol } from "../../../../interface/Rol";
import { MdOutlineRestore } from "react-icons/md";
import { Badge } from "react-bootstrap";
import styles from "./RoleListRemoves.module.scss";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { randomColors } from "../../../../lib/helpers/functions/functions";
import { getModuleByMenu } from "../../../../api/module/module";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";

const RoleListRemoves = ({
  remove,
  restoreRol,
}: {
  remove: Rol;
  restoreRol: (id: string) => void;
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
    <tr>
      <td>{remove._id}</td>
      <td>{remove.name}</td>
      <td>{remove.description}</td>
      <td>
        {remove.module?.map((mod) => (
          <span key={mod._id}>
            <Badge bg={randomColors()}>{mod.name}</Badge>{" "}
          </span>
        ))}
      </td>
      <td className={`${styles["table--center"]}`}>
        {remove.status === false && <Badge bg="danger">Eliminado</Badge>}
      </td>
      {resource && resource.canRestore && (
        <td className={`${styles["table--center"]}`}>
          <MdOutlineRestore
            className={styles.table__iconRestore}
            onClick={() => restoreRol(String(remove._id))}
          />
        </td>
      )}
    </tr>
  );
};

export default memo(RoleListRemoves);
