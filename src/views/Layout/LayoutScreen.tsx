import Footer from "../../components/FooterComponent/Footer";
import Header from "../../components/HeaderComponent/Header";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import RoleScreen from "../Roles/RoleScreen";
import UserScreen from "../Users/UserScreen";
import ModulesScreen from "../Modules/ModulesScreen";
import OptionsScreen from "../Option/OptionsScreen";
import Aside from "../../components/AsideComponent/Aside";
import styles from "./LayoutScreen.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";

const LayoutScreen = () => {
  const { resource } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Aside />
      <main className={styles.main}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roles" element={<RoleScreen myResource={resource} />} />
          <Route
            path="/usuarios"
            element={<UserScreen myResource={resource} />}
          />
          <Route
            path="/modulos"
            element={<ModulesScreen myResource={resource} />}
          />
          <Route
            path="/permisos"
            element={<OptionsScreen myResource={resource} />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default LayoutScreen;
