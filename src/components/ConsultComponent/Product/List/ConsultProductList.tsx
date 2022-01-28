import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";

const ConsultProductList = ({
  product,
  item,
}: {
  product: Product;
  item: number;
}) => {
  const { unit, area }: any = product;

  return (
    <>
      <tr>
        <td>{item + 1}</td>
        <td>{String(area.name)}</td>
        <td>{product.cod_internal}</td>
        <td>{product.name}</td>
        <td>{String(unit.name)}</td>
        <td>{product.stock}</td>
        <td>S/ {product.price}</td>
        <td>{product.status && <Badge bg="success">Activo</Badge>}</td>
      </tr>
    </>
  );
};

export default ConsultProductList;
