import { useCallback, useState, useEffect, useContext } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
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
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";
import { IAlert } from "../../interface/IAlert";

const initialState: IAlert = {
  type: "",
  message: "",
};

const ProductScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [removes, setRemoves] = useState<Product[]>([]);
  const { resources } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [message, setMessage] = useState<IAlert>(initialState);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

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
      if (resource && resource.canDelete === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __deletedProduct = await deleteProduct(id);
      const { data } = __deletedProduct;
      const { productDeleted } = data;
      if (productDeleted) {
        listProducts();
        listProductDeleted();
      }
    },
    [listProducts, listProductDeleted, resource]
  );

  const _restoreProduct = useCallback(
    async (id: string) => {
      if (resource && resource.canRestore === false) {
        setMessage({
          type: "danger",
          message: "No tienes acceso a este recurso.",
        });
        return;
      }
      const __restoreProduct = await restoreProduct(id);
      const { data } = __restoreProduct;
      const { productRestored } = data;
      if (productRestored) {
        listProducts();
        listProductDeleted();
      }
    },
    [listProducts, listProductDeleted, resource]
  );

  useEffect(() => {
    if (resource && resource.canRead) {
      listProducts();
    }

    listProductDeleted();
    getMyModule();
  }, [listProducts, listProductDeleted, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Lista de productos</Card.Header>
        <Card.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}
          {resource && resource.canCreate && resource.canUpdate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar producto
              </Button>{" "}
              <ProductForm
                show={show}
                closeModal={closeModal}
                listProducts={listProducts}
                product={state}
              />
            </>
          ) : resource && resource.canCreate ? (
            <>
              <Button
                type="button"
                variant="primary"
                onClick={() => openModalRE(false)}
              >
                Agregar producto
              </Button>{" "}
              <ProductForm
                show={show}
                closeModal={closeModal}
                listProducts={listProducts}
                product={state}
              />
            </>
          ) : (
            resource &&
            resource.canUpdate && (
              <ProductForm
                show={show}
                closeModal={closeModal}
                listProducts={listProducts}
                product={state}
              />
            )
          )}
          {resource && resource.canRead && (
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
                  {resource && resource.canDelete && (
                    <th className={`${styles["table--center"]}`}>Eliminar</th>
                  )}
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
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductScreen;
