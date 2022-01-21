import {
  ChangeEvent,
  FormEvent,
  memo,
  useEffect,
  useState,
  useMemo,
  useRef,
  KeyboardEvent,
} from "react";
import { Alert, Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { postCreateFact, updateFact } from "../../../api/fact/fact";
import { IAlert } from "../../../interface/IAlert";
import { Fact } from "../../../interface/Fact";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Client } from "../../../interface/Client";
import { getClients } from "../../../api/client/client";
import { Product } from "../../../interface/Product";
import { getProducts } from "../../../api/product/product";
import { BsFillCartFill } from "react-icons/bs";
import PaginationComponent from "../../DatatableComponent/Pagination/Pagination";
import TableHeader from "../../DatatableComponent/Header/TableHeader";
import styles from "./FactForm.module.scss";
import { IoMdClose } from "react-icons/io";

const animatedComponents = makeAnimated();

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type KeyChange = KeyboardEvent<HTMLTableRowElement>;

let selected: any = [];

const FactForm = ({
  show,
  fact,
  closeModal,
  listFacts,
}: {
  show: boolean;
  fact?: Fact;
  closeModal: () => void;
  listFacts: () => void;
}) => {
  const initialStateFact = {
    cod_fact: "",
    client: "",
    payment_type: "CONTADO",
    way_to_pay: "EFECTIVO COMPLETO",
    subtotal: 0,
    discount: 0,
    customer_payment: 0,
    obs: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Fact>(initialStateFact);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState<string | any>("");
  const searchInput = useRef<HTMLInputElement | null>(null);
  const searchProducts = useRef<HTMLButtonElement | null>(null);
  const contentDiv = useRef<HTMLFormElement | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectCliente, setSelectClient] = useState<any>({
    label: "",
    value: "",
  });
  const ITEMS_PER_PAGE = 5;

  const headers = [
    { name: "Cod Barra/interno", field: "cod_internal", sortable: true },
    { name: "Producto", field: "name", sortable: true },
    { name: "Marca", field: "mark", sortable: true },
    { name: "Modelo", field: "model", sortable: true },
    { name: "Unidad", field: "unit", sortable: true },
    { name: "Stock", field: "stock", sortable: true },
    { name: "Precio", field: "price", sortable: true },
    { name: "Añadir", field: "actiones", sortable: false },
  ];

  const handleSearch = () => {
    setSearch(searchInput.current?.value);
    setCurrentPage(1);
  };

  const listClients = async () => {
    const res = await getClients();
    const { data } = res;
    const filter = data.map((cli: any) => {
      return {
        label: cli.name + " " + cli.lastname,
        value: cli.nroDocument,
      };
    });
    const getClientNO = filter.find((find: any) => find.value === "00000000");
    setSelectClient({ label: getClientNO.label, value: getClientNO.value });
    setForm({ ...form, client: getClientNO.value });
    setClients(filter);
  };

  const listProducts = async () => {
    const res = await getProducts();
    const { data } = res;
    setProducts(data);
  };

  const productsFiltered = useMemo(() => {
    let computedProducts = products;

    if (search) {
      computedProducts = computedProducts.filter((product) => {
        return (
          product.cod_internal.toLowerCase().includes(search.toLowerCase()) ||
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      });
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
          return (
            reversed *
            a[sorting.field]
              .toString()
              .localeCompare(b[sorting.field].toString())
          );
        }
      });
    }

    //Current Page slice
    return computedProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [products, search, currentPage, sorting]);

  const onPageChange = (page: number) => setCurrentPage(page);

  const onSorting = (field: string, order: string) =>
    setSorting({ field, order });

  const getDate = () => {
    const date = new Date();
    let value: string = "";

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month < 10) {
      value = `${day}-0${month}-${year}`;
    } else {
      value = `${day}-${month}-${year}`;
    }
    return value;
  };

  const closeAndClear = () => {
    setForm(initialStateFact);
    closeModal();
    setMessage(initialStateAlert);
    setErrors({});
    setSearch("");
    setShowProducts(false);
    setList([]);
    selected = [];
  };

  const findFormErrors = () => {
    //const { name } = form;
    const newErrors: any = {};
    // name errors
    //if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";

    return newErrors;
  };

  const handleChange = (e: InputChange) => {
    setMessage(initialStateAlert);
    if (!!errors[e.target.name])
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent | any) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      setDisabled(true);
      if (form?._id) {
        try {
          const res = await updateFact(form!._id, form);
          const { factUpdated } = res.data;
          setMessage({
            type: "success",
            message: `La factura ${factUpdated.name} ha sido actualizado existosamente.`,
          });
          setDisabled(false);
          listFacts();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          const res = await postCreateFact(form);
          const { fact } = res.data;
          setMessage({
            type: "success",
            message: `La factura ha sido registrado existosamente.`,
          });
          setForm(initialStateFact);
          setDisabled(false);
          listFacts();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      }
      setErrors({});
    }
  };

  useEffect(() => {
    listClients();
    listProducts();
  }, []);

  const test = (e: any) => {
    if (!showProducts) {
      if (e.key === "Enter") {
        setShowProducts(true);
        setSearch("");
        setCurrentPage(1);
      }
    }
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "F2") {
      setSearch("");
      setCurrentPage(1);
    }

    if (e.key === "Escape") {
      setShowProducts(false);
      searchProducts.current!.focus();
      setSearch("");
      setCurrentPage(1);
    }
  };

  const handleKeyDownButton = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "F2") {
      setSearch("");
      setCurrentPage(1);
      searchInput.current!.focus();
    }

    if (e.key === "Escape") {
      setShowProducts(false);
      searchProducts.current!.focus();
    }
  };

  const handleKeyDownTr = (e: KeyChange, pro: Product) => {
    if (e.key === "Enter") {
      if (selected.length > 0) {
        const isFound = selected.find(
          (product: Product) => product._id === pro._id
        );
        if (!isFound) {
          selected.push(pro);
        }
      } else {
        selected.push(pro);
      }
      const allSelected = selected.map((product: Product) => product);
      setList(allSelected);
    }
    if (e.key === "Escape") {
      setShowProducts(false);
      searchProducts.current!.focus();
    }

    if (e.key === "F2") {
      setSearch("");
      setCurrentPage(1);
      searchInput.current!.focus();
    }
  };

  const handleClickList = (pro: Product) => {
    if (selected.length > 0) {
      const isFound = selected.find(
        (product: Product) => product._id === pro._id
      );
      if (!isFound) {
        selected.push(pro);
      }
    } else {
      selected.push(pro);
    }
    const allSelected = selected.map((product: Product) => product);
    setList(allSelected);
  };

  const deleteItem = (id: string) => {
    const filterItemDeleted = list.filter((item: any) => item._id !== id);
    setList(filterItemDeleted);
  };

  return (
    <div onKeyDown={test}>
      <Modal
        show={show}
        onHide={closeAndClear}
        backdrop="static"
        keyboard={false}
        top="true"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>{form?._id ? "Ver Venta" : "Nueva Venta"}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={onSubmit} ref={contentDiv}>
          <Modal.Body>
            {message.type && (
              <Alert variant={message.type}>{message.message}</Alert>
            )}

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{ width: "100%", display: "flex", flexDirection: "row" }}
              >
                <div style={{ width: "70%" }}>
                  <Row className="mb-3">
                    <Form.Group md="3" as={Col} controlId="formGridFech">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        name="fech"
                        value={getDate()}
                        type="text"
                        disabled
                      />
                    </Form.Group>
                    <Form.Group md="8" as={Col} controlId="formGridType">
                      <Form.Label>Tipo de pago</Form.Label>
                      <Form.Select
                        name="payment_type"
                        onChange={handleChange}
                        value={form?.payment_type}
                        isInvalid={!!errors?.payment_type}
                      >
                        <option value="CONTADO">CONTADO</option>
                        <option value="CREDITO">CREDITO</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group md="7" as={Col} controlId="formGridFech">
                      <Form.Label>Cliente</Form.Label>
                      <Select
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        value={
                          form.client === ""
                            ? []
                            : {
                                label: selectCliente.label,
                                value: selectCliente.value,
                              }
                        }
                        onChange={(values: any) => {
                          const { label, value } = values;
                          setSelectClient({ label, value });
                          setForm({ ...form, client: value });
                        }}
                        options={clients}
                      />
                    </Form.Group>
                    <Form.Group md="4" as={Col} controlId="formGridType">
                      <Form.Label>Forma de pago</Form.Label>
                      <Form.Select
                        name="way_to_pay"
                        onChange={handleChange}
                        value={form?.way_to_pay}
                        isInvalid={!!errors?.way_to_pay}
                      >
                        <option value="EFECTIVO COMPLETO">
                          EFECTIVO COMPLETO
                        </option>
                        <option value="EFECTIVO CON VUELTO">
                          EFECTIVO CON VUELTO
                        </option>
                        <option value="YAPE">YAPE</option>
                        <option value="PLIN">PLIN</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                </div>
                <div style={{ width: "30%" }}>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        flexDirection: "column",
                        padding: 20,
                        border: "1px solid #000",
                      }}
                    >
                      <h3>RUC: 10443373824</h3>
                      <h3>
                        <strong>GUIA DE VENTA</strong>
                      </h3>
                      <h3>N° 5896</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
              <Table striped bordered hover responsive="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cod Barra/interno</th>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Descuento</th>
                    <th>Total</th>
                    <th className="text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((listed, i: number) => (
                    <tr
                      className={styles.tr}
                      key={listed._id}
                      // onKeyDown={(e) => handleKeyDown(e, listed)}
                    >
                      <td>{i + 1}</td>
                      <td>{listed.cod_internal}</td>
                      <td>{listed.name}</td>
                      <td>{listed.mark.name}</td>
                      <td>{listed.model.name}</td>
                      <td>1</td>
                      <td>S/ {listed.price}</td>
                      <td>S/ 0</td>
                      <td>S/ {listed.price * 1}</td>
                      <td
                        className="text-center"
                        onClick={() => deleteItem(listed._id)}
                      >
                        <IoMdClose className={styles.table__iconClose} />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => setShowProducts(!showProducts)}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                        ref={searchProducts}
                      >
                        <strong>+</strong>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot></tfoot>
              </Table>
              {showProducts && (
                <div
                  style={{
                    boxShadow:
                      "0 16px 32px rgb(55 71 79 / 8%), 0 8px 24px rgb(55 71 79 / 10%)",
                    background: "#fff",
                    position: "absolute",
                    width: "900px",
                    top: "270px",
                    left: "110px",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    padding: 10,
                  }}
                >
                  <input
                    type="text"
                    autoFocus
                    className="p-1"
                    placeholder="Introduce Cod. de barra / interno o nombre del producto"
                    value={search}
                    ref={searchInput}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDownInput}
                  />
                  <Table
                    striped
                    bordered
                    hover
                    responsive="sm"
                    className="mt-3"
                  >
                    <TableHeader headers={headers} onSorting={onSorting} />
                    <tbody>
                      {productsFiltered.map((pro: any) => {
                        return (
                          <tr
                            tabIndex={0}
                            key={pro._id}
                            onKeyDown={(e) => handleKeyDownTr(e, pro)}
                            className={styles.tr}
                          >
                            <td>{pro.cod_internal}</td>
                            <td>{pro.name}</td>
                            <td>{pro.mark.name}</td>
                            <td>{pro.model.name}</td>
                            <td>{pro.unit.name}</td>
                            <td>{pro.stock}</td>
                            <td>S/ {pro.price}</td>
                            <td className="text-center">
                              <BsFillCartFill
                                type="button"
                                onClick={() => handleClickList(pro)}
                                className="text-success font-weight-bold"
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <Button
                        onKeyDown={handleKeyDownButton}
                        variant="danger"
                        onClick={() => setShowProducts(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                    <div style={{ display: "flex" }}>
                      <PaginationComponent
                        total={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={closeAndClear}>
              Cerrar
            </Button>
            <Button type="button" variant="primary" disabled={disabled}>
              {form?._id ? "Actualizar" : "Registrar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(FactForm);
