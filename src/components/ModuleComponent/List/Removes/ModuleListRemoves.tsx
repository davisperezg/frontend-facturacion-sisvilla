import { memo, useCallback, useContext, useEffect, useState } from "react";
import { MdOutlineRestore } from "react-icons/md";
import { Module } from "../../../../interface/Module";
import { Badge } from "react-bootstrap";
import styles from "./ModuleListRemove.module.scss";
import { randomColors } from "../../../../lib/helpers/functions/functions";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";
import { AuthContext } from "../../../../context/auth";

const ModuleListRemoves = ({
  remove,
  restoreMo,
}: {
  remove: Module;
  restoreMo: (id: string) => void;
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
        <td>
          {remove.menu?.map((men) => (
            <span key={men._id}>
              <Badge bg={randomColors()}>{men.name}</Badge>{" "}
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
              onClick={() => restoreMo(String(remove._id))}
            />
          </td>
        )}
      </tr>
    </>
  );
};

export default memo(ModuleListRemoves);
