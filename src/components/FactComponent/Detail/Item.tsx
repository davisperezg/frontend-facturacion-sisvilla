import { ChangeEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { IoMdClose } from "react-icons/io";
import { DetailsFact } from "../../../interface/DetailsFact";
import { formatter } from "../../../lib/helpers/functions/functions";
import styles from "../Form/FactForm.module.scss";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const DetailItem = ({
  listed,
  item,
  deleteItem,
  numberFact,
  getProductByItem,
  list,
}: any) => {
  const initialState: DetailsFact = {
    fact: numberFact,
    product: listed.product,
    quantity: 1,
    price: listed.price,
    discount: 0,
  };

  const [product, setProduct] = useState<DetailsFact>(initialState);

  return (
    <tr className={styles.tr} key={listed._id}>
      <td>{item + 1}</td>
      <td>{listed.cod_internal}</td>
      <td>{listed.name}</td>
      <td>{listed.unit}</td>
      <td>
        <Form.Control
          name="quantity"
          value={product.quantity}
          type="number"
          min="1"
          onChange={(e) => {
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
          }}
        />
      </td>
      <td>
        {`S/ ${formatter.format(
          Number(product.price) * Number(product.quantity) -
            Number(product.discount)
        )}`}
      </td>
      <td className="text-center" onClick={() => deleteItem(listed.product)}>
        <IoMdClose className={styles.table__iconClose} />
      </td>
    </tr>
  );
};

export default DetailItem;
