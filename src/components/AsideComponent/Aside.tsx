import styles from "./Aside.module.scss";
import { Accordion } from "react-bootstrap";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { User } from "../../interface/User";
import ListModule from "./ListModule";
import { Module } from "../../interface/Module";
import styles2 from "../HeaderComponent/Header.module.scss";

const Aside = () => {
  const { user } = useContext(AuthContext);
  const data: User = user;
  const [modules, setModules] = useState<Module[]>([]);
  const listModules = useCallback(() => {
    setModules(data.role.module || []);
  }, [data.role.module]);

  useEffect(() => {
    listModules();
  }, [listModules]);

  return (
    <>
      <input type="checkbox" id={styles2.btn_hamburger} />
      <aside className={styles2.asidePrincipal}>
        {/* <p className={styles2.kk}>aa</p> */}
        <Accordion>
          {modules.map((mod: any) => (
            <ListModule key={mod._id} mod={mod} />
          ))}
        </Accordion>
      </aside>
    </>
  );
};

export default Aside;
