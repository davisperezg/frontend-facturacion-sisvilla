import { Resources } from "../../interface/Resources";
import { useCallback, useState, useEffect } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { Product } from "../../interface/Product";
import {
  deleteProduct,
  getProductDeleted,
  getProducts,
  restoreProduct,
} from "../../api/product/product";
import styles from "./Product.module.scss";
import ProductForm from "../../components/ProductComponent/Form/ProductForm";
import ProductListRemoves from "../../components/ProductComponent/List/Removes/ProductListRemoves";
import ProductListActive from "../../components/ProductComponent/List/Activos/ProductList";

const ProductScreen = ({ myResource }: { myResource: Resources }) => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [removes, setRemoves] = useState<Product[]>([]);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState({
        ...value,
        mark: value.mark.name,
        model: value.model.name,
        unit: value.unit.name,
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const listProducts = useCallback(async () => {
    const res = await getProducts();
    const { data } = res;
    setProducts(data);
  }, []);

  const listProductDeleted = useCallback(async () => {
    const res = await getProductDeleted();
    const { data } = res;
    setRemoves(data);
  }, []);

  const _deleteProduct = useCallback(
    async (id: string) => {
      const __deletedProduct = await deleteProduct(id);
      const { data } = __deletedProduct;
      const { productDeleted } = data;
      if (productDeleted) {
        listProducts();
        listProductDeleted();
      }
    },
    [listProducts, listProductDeleted]
  );

  const _restoreProduct = useCallback(
    async (id: string) => {
      const __restoreProduct = await restoreProduct(id);
      const { data } = __restoreProduct;
      const { productRestored } = data;
      if (productRestored) {
        listProducts();
        listProductDeleted();
      }
    },
    [listProducts, listProductDeleted]
  );

  useEffect(() => {
    listProducts();
    listProductDeleted();
  }, [listProducts, listProductDeleted]);

  return (
    <>
      <ProductForm
        show={show}
        closeModal={closeModal}
        listProducts={listProducts}
        product={state}
      />

      <Card>
        <Card.Header as="h5">Lista de productos</Card.Header>
        <Card.Body>
          {myResource?.canCreate && (
            <Button
              type="button"
              variant="primary"
              onClick={() => openModalRE(false)}
            >
              Agregar producto
            </Button>
          )}

          <Table
            striped
            bordered
            hover
            responsive="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Cod interno</th>
                <th>Nombre</th>
                <th>Nota</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Unidad de medida</th>
                <th>Stock</th>
                <th>Precio</th>
                <th className={`${styles["table--center"]}`}>Estado</th>
                <th className={`${styles["table--center"]}`}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((pro) => (
                <ProductListActive
                  key={pro._id}
                  product={pro}
                  openModalRE={openModalRE}
                  deleteProd={_deleteProduct}
                />
              ))}
            </tbody>
            <tfoot>
              {removes.map((remove) => (
                <ProductListRemoves
                  key={remove._id}
                  remove={remove}
                  restorePro={_restoreProduct}
                />
              ))}
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductScreen;
