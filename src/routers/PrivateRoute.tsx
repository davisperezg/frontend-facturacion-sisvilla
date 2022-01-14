import { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { getsesionLocal } from "../lib/helpers/sesion/sesion";

export const PrivateRoute = ({ children }: any) => {
  const { user } = useContext(AuthContext);

  return user?.status === true && getsesionLocal("token") ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};
