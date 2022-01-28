import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Table, Form, Row, Col } from "react-bootstrap";
import TableHeader from "../../../components/DatatableComponent/Header/TableHeader";
import { Product } from "../../../interface/Product";
import ConsultProductList from "../../../components/ConsultComponent/Product/List/ConsultProductList";
import PaginationComponent from "../../../components/DatatableComponent/Pagination/Pagination";
import { getProducts } from "../../../api/product/product";
import useResource from "../../../hooks/resource/resourceHook";
import { IAlert } from "../../../interface/IAlert";

const headers = [
  { name: "#", field: "item", sortable: false },
  { name: "Area/Sede", field: "area", sortable: true },
  { name: "Cod Inter", field: "cod_internal", sortable: true },
  { name: "Producto", field: "name", sortable: true },
  { name: "Unidad de medida", field: "unit", sortable: true },
  { name: "Stock", field: "stock", sortable: true },
  { name: "Precio", field: "price", sortable: true },
  { name: "Estado", field: "status", sortable: false },
];

const initialStateAlert: IAlert = {
  type: "",
  message: "",
};

const ConsultProductScreen = () => {
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [consult, setConsult] = useState({
    filter: false,
  });
  const ITEMS_PER_PAGE = 50;
  const [resource] = useResource();
  const [message, setMessage] = useState<IAlert>(initialStateAlert);

  const onSorting = (field: string, order: string) =>
    setSorting({ field, order });

  const handleChange = (e: any) => {
    setMessage(initialStateAlert);
    setConsult({ ...consult, [e.target.name]: e.target.checked });
  };

  const listProduct = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const productsFiltered = useMemo(() => {
    let computedProducts: any = products;

    if (consult.filter) {
      if (resource.canRead) {
        computedProducts = computedProducts.filter(
          (product: any) => product.stock === 0
        );
      } else {
        setMessage({
          type: "danger",
          message: `No tienes acceso a este recurso.`,
        });
      }
    }

    setTotalItems(computedProducts.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedProducts = computedProducts.sort((a: any, b: any) => {
        if (typeof a[sorting.field] === "object") {
          return (
            reversed *
            a[sorting.field].name
              .toString()
              .localeCompare(b[sorting.field].name.toString())
          );
        } else {
          if (typeof a[sorting.field] === "number") {
            return reversed * (a[sorting.field] - b[sorting.field]);
          } else {
            return (
              reversed *
              a[sorting.field]
                .toString()
                .localeCompare(b[sorting.field].toString())
            );
          }
        }
      });
    }

    if (resource.canRead)
      return computedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      );
    else return [];
  }, [products, sorting, currentPage, consult.filter, resource.canRead]);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    if (resource.canRead) listProduct();
  }, [resource.canRead]);

  return (
    <Card>
      <Card.Header as="h5">Consulta de productos</Card.Header>
      <Card.Body>
        {message.type && (
          <Alert variant={message.type}>{message.message}</Alert>
        )}
        <Row className="mb-3">
          <Form.Group
            md="2"
            as={Col}
            className="mb-3"
            controlId="formBasicCheckbox"
          >
            <Form.Check
              type="checkbox"
              label="Buscar productos agotados"
              name="filter"
              onChange={handleChange}
              checked={consult.filter}
            />
          </Form.Group>
        </Row>
        <div
          className="mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <PaginationComponent
            total={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span style={{ marginLeft: 5 }}>
              Se encontraron un total de {productsFiltered.length} registros
            </span>
          </div>
        </div>
        {resource.canRead && (
          <Table striped bordered hover responsive="sm">
            <TableHeader headers={headers} onSorting={onSorting} />
            <tbody>
              {productsFiltered.map((product: any, i: number) => (
                <ConsultProductList
                  key={product._id}
                  item={i}
                  product={product}
                />
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default ConsultProductScreen;
