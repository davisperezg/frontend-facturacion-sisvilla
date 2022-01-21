import { Model } from "../../../../interface/Model";
import styles from "./ModelListActives.module.scss";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../../context/auth";
import { getModuleByMenu } from "../../../../api/module/module";

const ModelListActives = ({
  model,
  deleteModel,
  openModalRE,
}: {
  model: Model;
  deleteModel: (id: string) => void;
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
            onClick={() => openModalRE(true, model)}
          >
            {model._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, model)}
          >
            {model.name}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, model)}
          >
            {model.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteModel(String(model._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{model._id}</td>
          <td>{model.name}</td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, model)}
          >
            {model.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteModel(String(model._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(ModelListActives);
