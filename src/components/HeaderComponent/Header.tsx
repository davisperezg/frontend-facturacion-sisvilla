import styles from "./Header.module.scss";
import { FaUserAlt } from "react-icons/fa";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { User } from "../../interface/User";
import { deleteSesions } from "../../lib/helpers/sesion/sesion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setUser, setResource } = useContext(AuthContext);
  const navigate = useNavigate();
  const data: User = user;

  const goLogin = () => {
    navigate("/login");
  };

  const logout = () => {
    deleteSesions();
    setUser(null);
    setResource(null);
    goLogin();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.item}>
        <div className={styles.item__left}>
          <h1>
            Comercial <strong>SARAI</strong>{" "}
            <span style={{ color: "red", background: "yellow" }}>
              Version (<strong>Beta</strong>)
            </span>
          </h1>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.item__right}>
          <label className={styles.item__user}>Bienvenido,</label>
          <strong className={styles.item__user}>
            {`${data.name.toUpperCase()} ${data.lastname.toUpperCase()}`}
          </strong>
          <DropdownButton
            align={{ lg: "end" }}
            title={<FaUserAlt className={styles.item__icon} />}
            id="dropdown-menu-align-responsive-2"
          >
            <Dropdown.Item eventKey="1">Configuración</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={logout}>
              Salir
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </nav>
  );
};

export default Header;
