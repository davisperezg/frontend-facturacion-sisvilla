import { BrowserRouter, Routes, Route } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import LayoutScreen from "../views/Layout/LayoutScreen";
import LoginScreen from "../views/Login/LoginScreen";
import PrintScreen from "../views/Print/PrintScreen";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/comprobantes/ventas/venta-generada/:id"
          element={<PrintScreen />}
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <LayoutScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
