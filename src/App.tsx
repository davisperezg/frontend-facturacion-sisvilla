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
  const initialResourceAux = JSON.parse(String(getsesionLocal("resource")));

  const [user, setUser] = useState<User | any>(initialValue);
  const [resources, setResources] = useState<Resources[] | any>(
    initialResources
  );
  const [resource, setResource] = useState<Resources | any>(initialResourceAux);

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

      const getResources = JSON.parse(String(getsesionLocal("resources"))).find(
        (res: any) => {
          return res.module.name === initialResourceAux.module;
        }
      );

      if (!getResources) {
        setResource(null);
      } else {
        const initialResource = {
          module: getResources.module.name,
          canCreate: getResources.canCreate,
          canUpdate: getResources.canUpdate,
          canRead: getResources.canRead,
          canDelete: getResources.canDelete,
        };
        setsesionLocal("resource", JSON.stringify(initialResource));
        setResource(initialResource);
      }
    }
  };

  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, resources, setResources, resource, setResource }}
    >
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
