import "./App.scss";

import { AuthContext } from "./context/auth";
import { AppRouter } from "./routers/AppRouters";
import { useState, useEffect } from "react";
import { User } from "./interface/User";
import {
  deleteSesions,
  getsesionLocal,
  setsesionLocal,
} from "./lib/helpers/sesion/sesion";
import { Resources } from "./interface/Resources";
import { getResourceByRol } from "./api/resources/rosources";
import { whois } from "./api/user/user";

// const init = () => {
//   return JSON.parse(localStorage.getItem("user")) || { logged: false };
// };

function App() {
  const initialValue = JSON.parse(String(getsesionLocal("user")));
  const initialResources = JSON.parse(String(getsesionLocal("resources")));

  const [user, setUser] = useState<User | any>(initialValue);
  const [resources, setResources] = useState<Resources[] | any>(
    initialResources
  );

  const getInfo = async () => {
    if (user) {
      const res = await whois();
      if (res.data.status === false) {
        setUser(null);
        setResources(null);
        deleteSesions();
        return;
      }
      const resbyRol = await getResourceByRol(res.data.role.name);
      setsesionLocal("user", JSON.stringify(res.data));
      setsesionLocal("resources", JSON.stringify(resbyRol.data));
      setUser(res.data);
      setResources(resbyRol.data);
    }
  };

  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, resources, setResources }}>
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
