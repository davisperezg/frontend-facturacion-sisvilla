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

const LayoutScreen = () => {
  return (
    <>
      <Header />
      <Aside />
      <main className={styles.main}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* sila VOFI*/}
          <Route path="/roles" element={<RoleScreen />} />
          {/* sila VOFI*/}
          <Route path="/usuarios" element={<UserScreen />} />
          {/* sila VOFI*/}
          <Route path="/modulos" element={<ModulesScreen />} />
          {/* sila VOFI*/}
          <Route path="/permisos" element={<OptionsScreen />} />
          {/* sila VOFI*/}
          <Route path="/marcas" element={<MarkScreen />} />
          {/* sila VOFI*/}
          <Route path="/modelos" element={<ModelScreen />} />
          {/* sila VOFI*/}
          <Route path="/productos" element={<ProductScreen />} />
          {/* sila VOFI*/}
          <Route path="/unidad-medida" element={<UnitScreen />} />
          {/* sila VOFI*/}
          <Route path="/clientes" element={<ClientScreen />} />
          {/* sila VOFI*/}
          <Route path="/proveedores" element={<SupplierScreen />} />

          <Route path="/ventas" element={<FactScreen />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default LayoutScreen;
