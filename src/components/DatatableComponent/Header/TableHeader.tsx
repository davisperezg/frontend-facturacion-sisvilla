import { useContext, useEffect, useState, useCallback } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../api/module/module";
import { AuthContext } from "../../../context/auth";

const TableHeader = ({
  headers,
  onSorting,
}: {
  headers: any[];
  onSorting: (field: string, order: string) => void;
}) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");
  const { resources, user } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);

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

  let newHeaders;

  const onSortingChange = (field: string) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  if (resource && resource.canDelete === false) {
    newHeaders = headers.filter((fil) => fil.name !== "Eliminar");
  } else {
    newHeaders = headers;
  }

  return (
    <thead>
      <tr>
        {newHeaders.map(({ name, field, sortable }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
          >
            {name}

            {sortingField &&
              sortingField === field &&
              (sortingOrder === "asc" ? (
                <AiOutlineArrowDown />
              ) : (
                <AiOutlineArrowUp />
              ))}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
