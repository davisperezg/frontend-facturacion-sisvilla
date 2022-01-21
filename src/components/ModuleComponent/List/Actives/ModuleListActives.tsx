import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Module } from "../../../../interface/Module";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import styles from "./ModuleList.module.scss";
import { randomColors } from "../../../../lib/helpers/functions/functions";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const ModuleListActives = ({
  module,
  deleteMo,
  openModalRE,
}: {
  module: Module;
  deleteMo: (id: string) => void;
  openModalRE: (props: boolean, value?: any) => void;
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
      {resource && resource.canUpdate ? (
        <tr>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, module)}
          >
            {module._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, module)}
          >
            {module.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, module)}
          >
            {module.menu?.map((men) => (
              <span key={men._id}>
                <Badge bg={randomColors()}>{men.name}</Badge>{" "}
              </span>
            ))}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, module)}
          >
            {module.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteMo(String(module._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{module._id}</td>
          <td>{module.name}</td>
          <td>
            {module.menu?.map((men) => (
              <span key={men._id}>
                <Badge bg={randomColors()}>{men.name}</Badge>{" "}
              </span>
            ))}
          </td>
          <td className={`${styles.table__td} ${styles["table--center"]}`}>
            {module.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteMo(String(module._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(ModuleListActives);
