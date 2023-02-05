import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Table, Form, Row, Col, Button } from "react-bootstrap";
import TableHeader from "../../../components/DatatableComponent/Header/TableHeader";
import { Product } from "../../../interface/Product";
import ConsultProductList from "../../../components/ConsultComponent/Product/List/ConsultProductList";
import PaginationComponent from "../../../components/DatatableComponent/Pagination/Pagination";
import { getProducts } from "../../../api/product/product";
import useResource from "../../../hooks/resource/resourceHook";
import { IAlert } from "../../../interface/IAlert";
import { differenceInDays } from "date-fns";
import { CSVLink } from "react-csv";
import { formatFech } from "../../../lib/helpers/functions/functions";

const headers = [
  { name: "#", field: "item", sortable: false },
  { name: "Area/Sede", field: "area", sortable: true },
  { name: "Cod Interno/Barra", field: "cod_internal", sortable: true },
  { name: "Producto", field: "name", sortable: true },
  { name: "Fech. V.", field: "fecVen", sortable: true },
  { name: "Estado Producto", field: "stateProd", sortable: true },
  { name: "Dias Restantes", field: "daysVen", sortable: true },
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
    filter: true,
    habs: { state: false, name: "" },
    venc: { state: false, name: "" },
    xvenc: { state: false, name: "" },
    nofec: { state: false, name: "" },
    filterRange: false,
    start: "",
    end: "",
  });
  const [showRange, setShowRange] = useState(false);
  const ITEMS_PER_PAGE = 50;
  const [resource] = useResource();
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [cantProducts, setCantProduct] = useState(0);
  const [exportXML, setExportXML] = useState([]);

  const onSorting = (field: string, order: string) =>
    setSorting({ field, order });

  const handleChange = (e: any) => {
    setCurrentPage(1);
    setMessage(initialStateAlert);
    setConsult({ ...consult, [e.target.name]: e.target.checked });
  };

  const listProduct = async () => {
    const res = await getProducts();
    const map = res.data.map((format: any) => {
      return {
        ...format,
        fecVen: format?.fecVen ? format?.fecVen : NaN,
        stateProd: format.fecVen
          ? differenceInDays(new Date(String(format?.fecVen)), new Date()) >=
              0 &&
            differenceInDays(new Date(String(format?.fecVen)), new Date()) < 7
            ? "Por vencer"
            : differenceInDays(new Date(String(format?.fecVen)), new Date()) > 6
            ? "Habilitado"
            : "Vencido"
          : "Sin fecha",
        daysVen: differenceInDays(new Date(String(format?.fecVen)), new Date()),
      };
    });

    setProducts(map);
  };

  const productsFiltered = useMemo(() => {
    let computedProducts: any = products;

    if (consult.filter) {
      if (
        consult.habs.state ||
        consult.venc.state ||
        consult.xvenc.state ||
        consult.nofec.state
      ) {
        if (consult.filterRange) {
          computedProducts = computedProducts.filter(
            (product: any) =>
              (product.stock === 0 &&
                new Date(product.fecVen).getTime() >=
                  new Date(consult.start).getTime() &&
                new Date(product.fecVen).getTime() <=
                  new Date(consult.end).getTime() &&
                product.stateProd === consult.habs.name) ||
              (product.stock === 0 &&
                new Date(product.fecVen).getTime() >=
                  new Date(consult.start).getTime() &&
                new Date(product.fecVen).getTime() <=
                  new Date(consult.end).getTime() &&
                product.stateProd === consult.venc.name) ||
              (product.stock === 0 &&
                new Date(product.fecVen).getTime() >=
                  new Date(consult.start).getTime() &&
                new Date(product.fecVen).getTime() <=
                  new Date(consult.end).getTime() &&
                product.stateProd === consult.xvenc.name) ||
              (product.stock === 0 &&
                new Date(product.fecVen).getTime() >=
                  new Date(consult.start).getTime() &&
                new Date(product.fecVen).getTime() <=
                  new Date(consult.end).getTime() &&
                product.stateProd === consult.nofec.name)
          );
        } else {
          computedProducts = computedProducts.filter(
            (product: any) =>
              (product.stock === 0 &&
                product.stateProd === consult.habs.name) ||
              (product.stock === 0 &&
                product.stateProd === consult.venc.name) ||
              (product.stock === 0 &&
                product.stateProd === consult.xvenc.name) ||
              (product.stock === 0 && product.stateProd === consult.nofec.name)
          );
        }
      } else {
        //buscar por rango de fecha los productos con stock 0 y el filtro busqueda stock 0 activado + click en el boton de busqueda
        if (consult.filterRange) {
          computedProducts = computedProducts.filter(
            (product: any) =>
              product.stock === 0 &&
              new Date(product.fecVen).getTime() >=
                new Date(consult.start).getTime() &&
              new Date(product.fecVen).getTime() <=
                new Date(consult.end).getTime()
          );
        } else {
          computedProducts = computedProducts.filter(
            (product: any) => product.stock === 0
          );
        }
      }
    } else {
      if (consult.filterRange) {
        computedProducts = computedProducts.filter(
          (product: any) =>
            (product.stock !== 0 &&
              new Date(product.fecVen).getTime() >=
                new Date(consult.start).getTime() &&
              new Date(product.fecVen).getTime() <=
                new Date(consult.end).getTime() &&
              product.stateProd === consult.habs.name) ||
            (product.stock !== 0 &&
              new Date(product.fecVen).getTime() >=
                new Date(consult.start).getTime() &&
              new Date(product.fecVen).getTime() <=
                new Date(consult.end).getTime() &&
              product.stateProd === consult.venc.name) ||
            (product.stock !== 0 &&
              new Date(product.fecVen).getTime() >=
                new Date(consult.start).getTime() &&
              new Date(product.fecVen).getTime() <=
                new Date(consult.end).getTime() &&
              product.stateProd === consult.xvenc.name) ||
            (product.stock !== 0 &&
              new Date(product.fecVen).getTime() >=
                new Date(consult.start).getTime() &&
              new Date(product.fecVen).getTime() <=
                new Date(consult.end).getTime() &&
              product.stateProd === consult.nofec.name)
        );
      } else {
        if (
          consult.habs.state ||
          consult.venc.state ||
          consult.xvenc.state ||
          consult.nofec.state
        ) {
          computedProducts = computedProducts.filter(
            (product: any) =>
              (product.stock !== 0 &&
                product.stateProd === consult.habs.name) ||
              (product.stock !== 0 &&
                product.stateProd === consult.venc.name) ||
              (product.stock !== 0 &&
                product.stateProd === consult.xvenc.name) ||
              (product.stock !== 0 && product.stateProd === consult.nofec.name)
          );
        } else {
          computedProducts = computedProducts.filter(
            (product: any) => product.stock !== 0
          );
        }
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

    setCantProduct(computedProducts.length);
    setExportXML(computedProducts);

    if (resource.canRead)
      return computedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      );
    else return [];
  }, [
    products,
    sorting,
    currentPage,
    consult.filter,
    resource.canRead,
    consult.habs.state,
    consult.venc.state,
    consult.xvenc.state,
    consult.nofec.state,
    consult.nofec.name,
    consult.venc.name,
    consult.habs.name,
    consult.xvenc.name,
    consult.end,
    consult.start,
    consult.filterRange,
  ]);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    if (resource.canRead) listProduct();
  }, [resource.canRead]);

  const goSearch = () => setConsult({ ...consult, filterRange: true });

  const headerXML = headers.map((head) => {
    return {
      label: head.name,
      key: head.field,
    };
  });

  const dataXML = exportXML.map((product: any, i: number) => {
    return {
      ...product,
      area: product.area.name,
      cod_internal: product.cod_internal.slice(3),
      fecVen: product.fecVen
        ? formatFech(new Date(String(product.fecVen)))
        : "Sin fecha de vencimiento",
      unit: product.unit.name,
      daysVen: product.daysVen ? product.daysVen : "Sin fecha de vencimiento",
      item: i + 1,
    };
  });

  return (
    <Card>
      <Card.Header as="h5">Consulta de productos</Card.Header>
      <Card.Body>
        {message.type && (
          <Alert variant={message.type}>{message.message}</Alert>
        )}
        {showRange && (
          <Row className="mb-3">
            <Form.Group md="3" as={Col} controlId="formGridStart">
              <Form.Label>
                Consultar productos x fecha de vencimiento desde:
              </Form.Label>
              <Form.Control
                name="start"
                type="date"
                onChange={(e) => {
                  setConsult({
                    ...consult,
                    start: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group md="3" as={Col} controlId="formGridEnd">
              <Form.Label>
                Consultar productos x fecha de vencimiento hasta:
              </Form.Label>
              <Form.Control
                name="end"
                type="date"
                onChange={(e) => {
                  setConsult({
                    ...consult,
                    end: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group md="4" as={Col} controlId="formGridFech">
              <Form.Label>Buscar</Form.Label>
              <Button
                type="button"
                variant="primary"
                className="w-100"
                onClick={goSearch}
              >
                Consultar
              </Button>
            </Form.Group>
          </Row>
        )}
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formBasicCheckbox">
            <label
              style={{ cursor: "pointer" }}
              className="text-primary"
              onClick={() => {
                if (showRange !== false) {
                  setConsult({
                    ...consult,
                    filterRange: false,
                    start: "",
                    end: "",
                  });
                  setShowRange(!showRange);
                } else {
                  setShowRange(!showRange);
                }
              }}
            >
              {showRange
                ? "Ocultar y resetear consulta por rango de fecha de vencimiento"
                : "Mostrar consulta por rango de fecha de vencimiento"}
            </label>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Buscar productos agotados"
              name="filter"
              onChange={handleChange}
              checked={consult.filter}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formCheckboxHab">
            <Form.Check
              type="checkbox"
              label="Buscar productos habilitados"
              name="habs"
              onChange={(e) => {
                setCurrentPage(1);
                setConsult({
                  ...consult,
                  habs: {
                    name: e.target.checked ? "Habilitado" : "",
                    state: e.target.checked,
                  },
                });
              }}
              checked={consult.habs.state}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formCheckboxVen">
            <Form.Check
              type="checkbox"
              label="Buscar productos vencidos"
              name="venc"
              onChange={(e) => {
                setCurrentPage(1);
                setConsult({
                  ...consult,
                  venc: {
                    name: e.target.checked ? "Vencido" : "",
                    state: e.target.checked,
                  },
                });
              }}
              checked={consult.venc.state}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formCheckboxXVen">
            <Form.Check
              type="checkbox"
              label="Buscar productos por vencer"
              name="xvenc"
              onChange={(e) => {
                setCurrentPage(1);
                setConsult({
                  ...consult,
                  xvenc: {
                    name: e.target.checked ? "Por vencer" : "",
                    state: e.target.checked,
                  },
                });
              }}
              checked={consult.xvenc.state}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group md="4" as={Col} controlId="formCheckboxSFec">
            <Form.Check
              type="checkbox"
              label="Buscar productos sin fecha de vencimiento"
              name="nofec"
              onChange={(e) => {
                setCurrentPage(1);
                setConsult({
                  ...consult,
                  nofec: {
                    name: e.target.checked ? "Sin fecha" : "",
                    state: e.target.checked,
                  },
                });
              }}
              checked={consult.nofec.state}
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
              Se encontraron un total de {cantProducts} registros
            </span>
          </div>
        </div>
        {resource.canRead && (
          <>
            <Form.Group
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
              //className={styles.contentButtons__excel__input}
            >
              <CSVLink
                data={dataXML}
                headers={headerXML}
                filename="reporte-productos.csv"
                target="_blank"
                separator={";"}
              >
                <Form.Label
                  className="btn btn-success"
                  style={{ cursor: "pointer" }}
                >
                  Exportar a excel
                </Form.Label>
              </CSVLink>
            </Form.Group>
            <Table striped bordered hover responsive>
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
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ConsultProductScreen;
