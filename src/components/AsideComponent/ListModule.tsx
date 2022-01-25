import { Accordion, ListGroup } from "react-bootstrap";
import { Module } from "../../interface/Module";
import styles from "./Aside.module.scss";
import { memo, useEffect, useCallback, useState, useContext } from "react";
import ListItem from "./ListItem";
import { Menu } from "../../interface/Menu";
import { AuthContext } from "../../context/auth";
import { setsesionLocal } from "../../lib/helpers/sesion/sesion";

const ListModule = ({ mod }: { mod: Module }) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const listMenus = useCallback(() => {
    setMenus(mod.menu || []);
  }, [mod.menu]);

  useEffect(() => {
    listMenus();
  }, [listMenus]);

  //const [value, setValue] = useState("");
  // const handleChange = (e: any) => {
  //   setValue(e.target.value);
  // };
  //<input type="text" value={value} onChange={handleChange} />

  return (
    <Accordion.Item key={mod._id} eventKey={String(mod._id)}>
      <Accordion.Header>{mod.name}</Accordion.Header>
      <Accordion.Body className={`${styles["aside--noPaddin"]}`}>
        <ListGroup variant="flush" as="ul">
          {menus.map((men) => (
            <ListItem key={men._id} men={men} />
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default memo(ListModule);
