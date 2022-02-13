import { formatter } from "../../../lib/helpers/functions/functions";

const DetailView = ({ listed, item }: any) => {
  return (
    <tr>
      <td>{item + 1}</td>
      <td>{listed.cod_internal}</td>
      <td>{listed.name}</td>
      <td>{listed.unit}</td>
      <td>{listed.quantity}</td>
      <td>{`S/${formatter.format(listed.price)}`}</td>
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
