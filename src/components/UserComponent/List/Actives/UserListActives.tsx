import { User } from "../../../../interface/User";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import styles from "./UserList.module.scss";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const UserListActives = ({
  user,
  deleteUsu,
  openModalRE,
}: {
  user: User;
  deleteUsu: (id: string) => void;
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
            onClick={() => openModalRE(true, user)}
          >
            {user._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.area.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.lastname}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.tipDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.nroDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.email}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.username}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, user)}
          >
            {user.role.name}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, user)}
          >
            {user.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteUsu(String(user._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{user._id}</td>
          <td>{user.name}</td>
          <td>{user.lastname}</td>
          <td>{user.tipDocument}</td>
          <td>{user.nroDocument}</td>
          <td>{user.email}</td>
          <td>{user.username}</td>
          <td>{user.role.name}</td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, user)}
          >
            {user.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteUsu(String(user._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(UserListActives);
