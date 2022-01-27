import { useContext, useState, useCallback, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../../api/module/module";
import { AuthContext } from "../../../../context/auth";
import { Fact } from "../../../../interface/Fact";
import {
  formatter,
  formatDate,
} from "../../../../lib/helpers/functions/functions";
import styles from "./FactListActives.module.scss";

const FactListActives = ({
  fact,
  item,
  deleteFact,
  openModalRE,
}: {
  fact: Fact | any;
  item: number;
  openModalRE: (props: boolean, value?: any) => void;
  deleteFact?: (id: string, cod: number) => void;
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
            onClick={() => openModalRE(true, fact)}
          >
            {item + 1}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            000{fact.cod_fact}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            {formatDate(new Date(String(fact.createdAt)))}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            {fact.client}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            {fact.user}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            {fact.payment_type}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            {fact.way_to_pay}
          </td>
          <td
            className={styles.table__td}
            onClick={() => openModalRE(true, fact)}
          >
            S/ {formatter.format(fact.subtotal)}
          </td>
          <td
            className={`${styles.table__td} ${styles["table--center"]}`}
            onClick={() => openModalRE(true, fact)}
          >
            {fact.status && <Badge bg="success">Pagada</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() =>
                  deleteFact &&
                  deleteFact(String(fact._id), Number(fact.cod_fact))
                }
              />
            </td>
          )}
        </tr>
      ) : (
        <tr>
          <td>{item + 1}</td>
          <td>000{fact.cod_fact}</td>
          <td>{formatDate(new Date(String(fact.createdAt)))}</td>
          <td>{fact.client}</td>
          <td>{fact.user}</td>
          <td>{fact.payment_type}</td>
          <td>{fact.way_to_pay}</td>
          <td>S/ {formatter.format(fact.subtotal)}</td>
          <td className={`${styles["table--center"]}`}>
            {fact.status && <Badge bg="success">Pagada</Badge>}
          </td>
          {resource && resource.canDelete && (
            <td className={`${styles["table--center"]}`}>
              <IoMdClose
                className={styles.table__iconClose}
                onClick={() =>
                  deleteFact &&
                  deleteFact(String(fact._id), Number(fact.cod_fact))
                }
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default FactListActives;
