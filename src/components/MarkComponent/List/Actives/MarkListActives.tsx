import { Mark } from "../../../../interface/Mark";
import styles from "./MarkListActives.module.scss";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const MarkListActives = ({
  item,
  mark,
  deleteMark,
  openModalRE,
}: {
  item: number;
  mark: Mark;
  deleteMark: (id: string) => void;
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
            onClick={() => openModalRE(true, mark)}
          >
            {item}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, mark)}
          >
            {mark.name}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, mark)}
          >
            {mark.status && <Badge bg="success">Activo</Badge>}
          </td>
          <td className={`${styles["table--center"]}`}>
            <IoMdClose
              className={styles.table__iconClose}
              onClick={() => deleteMark(String(mark._id))}
            />
          </td>
        </tr>
      ) : (
        <tr>
          <td>{item}</td>
          <td>{mark.name}</td>
          <td className={`${styles.table__td} ${styles["table--center"]}`}>
            {mark.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteMark(String(mark._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(MarkListActives);
