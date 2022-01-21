import { Client } from "../../../../interface/Client";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import styles from "./ClientListActives.module.scss";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const ClientListActives = ({
  client,
  deleteCli,
  openModalRE,
}: {
  client: Client;
  deleteCli: (id: string) => void;
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
            onClick={() => openModalRE(true, client)}
          >
            {client._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.name}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.lastname}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.tipDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.nroDocument}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.email}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.cellphone}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, client)}
          >
            {client.address}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, client)}
          >
            {client.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteCli(String(client._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{client._id}</td>
          <td>{client.name}</td>
          <td>{client.lastname}</td>
          <td>{client.tipDocument}</td>
          <td>{client.nroDocument}</td>
          <td>{client.email}</td>
          <td>{client.cellphone}</td>
          <td>{client.address}</td>
          <td className={`${styles["table--center"]}`}>
            {client.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteCli(String(client._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(ClientListActives);
