import styles from "./RoleList.module.scss";
import { Rol } from "../../../../interface/Rol";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { randomColors } from "../../../../lib/helpers/functions/functions";
import { getModuleByMenu } from "../../../../api/module/module";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";

const RoleList = ({
  role,
  openModalRE,
  deleteRol,
}: {
  role: Rol;
  openModalRE: (props: boolean, value?: any) => void;
  deleteRol: any;
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
            onClick={() => openModalRE(true, role)}
          >
            {role._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, role)}
          >
            {role.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, role)}
          >
            {role.description}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, role)}
          >
            {role.module?.map((mod) => (
              <span key={mod._id}>
                <Badge bg={randomColors()}>{mod.name}</Badge>{" "}
              </span>
            ))}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, role)}
          >
            {role.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteRol(String(role._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{role._id}</td>
          <td>{role.name}</td>
          <td>{role.description}</td>
          <td>
            {role.module?.map((mod) => (
              <span key={mod._id}>
                <Badge bg={randomColors()}>{mod.name}</Badge>{" "}
              </span>
            ))}
          </td>
          <td className={`${styles.table__td} ${styles["table--center"]}`}>
            {role.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteRol(String(role._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(RoleList);
