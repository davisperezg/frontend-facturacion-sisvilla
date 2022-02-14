import { useContext } from "react";
import { AuthContext } from "../../../context/auth";
import { formatter } from "../../../lib/helpers/functions/functions";

const DetailView = ({ listed, item }: any) => {
  const { user } = useContext(AuthContext);

  return (
    <tr>
      <td>{item + 1}</td>
      <td>{listed.cod_internal}</td>
      <td>{listed.name}</td>
      <td>{listed.unit}</td>
      <td>{listed.quantity}</td>
      <td>{`S/${formatter.format(listed.price)}`}</td>
      {user.role.name === "SUPER ADMINISTRADOR" && (
        <td>{`S/${formatter.format(listed.price_c)}`}</td>
      )}
      <td>{`S/${formatter.format(listed.discount)}`}</td>
      <td>
        {`S/${formatter.format(
          Number(listed.price) * Number(listed.quantity) -
            Number(listed.discount)
        )}`}
      </td>
    </tr>
  );
};

export default DetailView;
