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
import MarkScreen from "../Marks/MarkScreen";
import ModelScreen from "../Models/ModelScreen";
import ProductScreen from "../Products/ProductScreen";
import UnitScreen from "../Units/UnitScreen";
import ClientScreen from "../Client/ClientScreen";
import SupplierScreen from "../Supplier/SupplierScreen";
import FactScreen from "../Facts/FactScreen";
import AreaScreen from "../Area/AreaScreen";
import SequencesScreen from "../Sequences/SequencesScreen";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { BsFillHouseDoorFill } from "react-icons/bs";
import ConsultFactScreen from "../Consults/Facts/ConsultFactScreen";
import ConsultProductScreen from "../Consults/Products/ConsultProduct";
import styles2 from "../../components/HeaderComponent/Header.module.scss";

const LayoutScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Aside />
      <div className={styles2.sedePrincipal}>
        <BsFillHouseDoorFill /> <strong> SEDE: {user.area.name}</strong>
      </div>
      <main className={styles2.mainPrincipal}>
        <Routes>
          {/* pendiente de graficar*/}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roles" element={<RoleScreen />} />
          <Route path="/usuarios" element={<UserScreen />} />
          <Route path="/modulos" element={<ModulesScreen />} />
          <Route path="/permisos" element={<OptionsScreen />} />
          <Route path="/marcas" element={<MarkScreen />} />
          <Route path="/categorias" element={<ModelScreen />} />
          <Route path="/productos" element={<ProductScreen />} />
          <Route path="/unidad-medida" element={<UnitScreen />} />
          <Route path="/clientes" element={<ClientScreen />} />
          <Route path="/proveedores" element={<SupplierScreen />} />
          <Route path="/areas" element={<AreaScreen />} />
          <Route path="/secuencias" element={<SequencesScreen />} />
          <Route path="/ventas" element={<FactScreen />} />
          <Route path="/consultar-ventas" element={<ConsultFactScreen />} />
          <Route
            path="/consultar-productos"
            element={<ConsultProductScreen />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default LayoutScreen;
