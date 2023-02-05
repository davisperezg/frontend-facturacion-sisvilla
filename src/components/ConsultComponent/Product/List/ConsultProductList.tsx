import { Badge } from "react-bootstrap";
import { Product } from "../../../../interface/Product";
import { convertDateToUTCLocal } from "../../../../lib/helpers/functions/functions";
import { differenceInDays } from "date-fns";

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
        <td>{String(product.cod_internal).slice(3)}</td>
        <td>{product.name}</td>
        <td>
          {product?.fecVen
            ? convertDateToUTCLocal(new Date(String(product?.fecVen)))
            : "Sin fecha de vencimiento"}
        </td>
        <td>
          {product?.fecVen ? (
            differenceInDays(new Date(String(product?.fecVen)), new Date()) >=
              0 &&
            differenceInDays(new Date(String(product?.fecVen)), new Date()) <
              7 ? (
              <Badge bg="warning">Por vencer</Badge>
            ) : differenceInDays(
                new Date(String(product?.fecVen)),
                new Date()
              ) > 6 ? (
              <Badge bg="success">Habilitado</Badge>
            ) : (
              <Badge bg="danger">Vencido</Badge>
            )
          ) : (
            <Badge bg="info">Sin fecha</Badge>
          )}
        </td>
        <td>
          {product?.fecVen
            ? differenceInDays(new Date(String(product?.fecVen)), new Date())
            : "Sin fecha de vencimiento"}
        </td>
        <td>{String(unit.name)}</td>
        <td>{product.stock}</td>
        <td>S/ {product.price}</td>
        <td>{product.status && <Badge bg="success">Activo</Badge>}</td>
      </tr>
    </>
  );
};

export default ConsultProductList;
