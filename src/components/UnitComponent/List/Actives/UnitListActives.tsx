import { Unit } from "../../../../interface/Unit";
import { IoMdClose } from "react-icons/io";
import { Badge } from "react-bootstrap";
import styles from "./UnitListActives.module.scss";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";

const UnitListActives = ({
  unit,
  deleteUnit,
  openModalRE,
}: {
  unit: Unit;
  deleteUnit: (id: string) => void;
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
            onClick={() => openModalRE(true, unit)}
          >
            {unit._id}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, unit)}
          >
            {unit.name}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, unit)}
          >
            {unit.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteUnit(String(unit._id))}
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{unit._id}</td>
          <td>{unit.name}</td>
          <td className={`${styles["table--center"]}`}>
            {unit.status && <Badge bg="success">Activo</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() => deleteUnit(String(unit._id))}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default memo(UnitListActives);
