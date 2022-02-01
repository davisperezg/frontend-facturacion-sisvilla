import { useState } from "react";
import { Form } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { DetailsFact } from "../../../interface/DetailsFact";
import { formatter } from "../../../lib/helpers/functions/functions";
import styles from "../Form/FactForm.module.scss";

const DetailItem = ({
  listed,
  item,
  deleteItem,
  numberFact,
  getProductByItem,
  list,
  view,
}: any) => {
  const initialState = {
    fact: numberFact,
    product: listed.product,
    quantity: view ? listed.quantity : 1,
    price: listed.price,
    discount: view ? listed.discount : 0,
    stock: listed.stock,
  };

  const [product, setProduct] = useState<DetailsFact | any>(initialState);

  return (
    <>
      {view ? (
        <tr>
          <td>{item + 1}</td>
          <td>{listed.cod_internal}</td>
          <td>{listed.name}</td>
          <td>{listed.unit}</td>

          <td>
            <Form.Control
              name="quantity"
              defaultValue={product.quantity}
              type="number"
              min="1"
              disabled={true}
            />
          </td>
          <td>
            <Form.Control
              name="price"
              defaultValue={product.price}
              type="number"
              step="0.01"
              min="1"
              disabled={true}
            />
          </td>
          <td>
            <Form.Control
              name="discount"
              defaultValue={product.discount}
              type="number"
              step="0.01"
              min="0"
              disabled={true}
            />
          </td>
          <td>
            {`S/ ${formatter.format(
              Number(product.price) * Number(product.quantity) -
                Number(product.discount)
            )}`}
          </td>
        </tr>
      ) : (
        <tr className={styles.tr}>
          <td>{item + 1}</td>
          <td>{listed.cod_internal}</td>
          <td>{listed.name}</td>
          <td>{listed.unit}</td>
          <td>{listed.stock}</td>
          <td>
            <Form.Control
              name="quantity"
              value={product.quantity}
              type="number"
              min="1"
              disabled={view ? true : false}
              onChange={(e) => {
                if (Number(e.target.value) > product.stock) {
                  return;
                } else if (Number(e.target.value) <= 0) {
                  alert("La cantidad no puede ser 0 o negativo");
                } else {
                  const element = list.map((res: any) => {
                    return {
                      ...res,
                      quantity:
                        res.product === product.product
                          ? Number(e.target.value)
                          : res.quantity,
                    };
                  });
                  getProductByItem(element);
                  setProduct({ ...product, quantity: Number(e.target.value) });
                }
              }}
            />
          </td>
          <td>
            <Form.Control
              name="price"
              value={product.price}
              type="number"
              step="0.01"
              min="1"
              disabled={view ? true : false}
              onChange={(e) => {
                const element = list.map((res: any) => {
                  return {
                    ...res,
                    price:
                      res.product === product.product
                        ? Number(e.target.value)
                        : res.price,
                  };
                });
                getProductByItem(element);
                setProduct({ ...product, price: Number(e.target.value) });
              }}
            />
          </td>
          <td>
            <Form.Control
              name="discount"
              value={product.discount}
              type="number"
              step="0.01"
              min="0"
              onChange={(e) => {
                const total =
                  Number(product.price) * Number(product.quantity) -
                  Number(e.target.value);

                if (Number(e.target.value) > total && total < 0.0) {
                  return;
                } else if (Number(e.target.value) < 0) {
                  alert("El descuento no puede ser negativo");
                } else {
                  const element = list.map((res: any) => {
                    return {
                      ...res,
                      discount:
                        res.product === product.product
                          ? Number(e.target.value)
                          : res.discount,
                    };
                  });
                  getProductByItem(element);
                  setProduct({ ...product, discount: Number(e.target.value) });
                }
              }}
            />
          </td>
          <td>
            {`S/ ${formatter.format(
              Number(product.price) * Number(product.quantity) -
                Number(product.discount)
            )}`}
          </td>
          <td
            className="text-center"
            onClick={() => deleteItem(listed.product)}
          >
            <IoMdClose className={styles.table__iconClose} />
          </td>
        </tr>
      )}
    </>
  );
};

export default DetailItem;
