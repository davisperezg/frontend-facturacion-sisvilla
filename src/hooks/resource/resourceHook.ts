import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import { AuthContext } from "../../context/auth";

const useResource = () => {
  const { resources } = useContext(AuthContext);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [resource, setResource] = useState<any>({});

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  useEffect(() => {
    getMyModule();
  }, [getMyModule]);

  return [resource];
};

export default useResource;
