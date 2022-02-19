import { IAlert } from "../../../interface/IAlert";
import { Product } from "../../../interface/Product";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import {
  memo,
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";
import { Mark } from "../../../interface/Mark";
import { Model } from "../../../interface/Model";
import { Unit } from "../../../interface/Unit";
import { postCreateProduct, updateProduct } from "../../../api/product/product";
import { getMarks } from "../../../api/mark/mark";
import Select from "react-select";
import { getModels } from "../../../api/model/model";
import makeAnimated from "react-select/animated";
import { getUnits } from "../../../api/unit/unit";
import { AuthContext } from "../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../api/module/module";

const animatedComponents = makeAnimated();

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const ProductForm = ({
  show,
  product,
  closeModal,
  listProducts,
}: {
  show: boolean;
  product?: Product;
  closeModal: () => void;
  listProducts: () => void;
}) => {
  const initialStateProduct: Product = {
    name: "",
    mark: "",
    model: "",
    unit: "",
    stock: 0,
    price: 0,
    price_c: 0,
    cod_internal: "",
    note: "",
  };

  const initialState: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Product>(initialStateProduct);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [errors, setErrors] = useState<any>({});
  const { resources, user } = useContext(AuthContext);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [resource, setResource] = useState<any>(null);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  const closeAndClear = () => {
    setForm(initialStateProduct);
    closeModal();
    setMessage(initialState);
    setErrors({});
  };

  const listMarks = async () => {
    const res = await getMarks();
    const { data } = res;
    const filter = data.map((mod: any) => {
      return {
        label: mod.name,
        value: mod.name,
      };
    });
    setMarks(filter);
  };

  const listModels = async () => {
    const res = await getModels();
    const { data } = res;
    const filter = data.map((mod: any) => {
      return {
        label: mod.name,
        value: mod.name,
      };
    });
    setModels(filter);
  };

  const listUnits = async () => {
    const res = await getUnits();
    const { data } = res;
    const filter = data.map((mod: any) => {
      return {
        label: mod.name,
        value: mod.name,
      };
    });
    setUnits(filter);
  };

  const handleChange = (e: InputChange) => {
    setMessage(initialState);
    // Check and see if errors exist, and remove them from the error object:
    if (errors[e.target.name])
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "stock"
          ? Number(e.target.value)
          : e.target.name === "price"
          ? Number(e.target.value)
          : e.target.name === "price_c"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const findFormErrors = () => {
    const { name, cod_internal, mark, model, unit, stock, price } = form;

    const newErrors: any = {};

    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";
    if (!cod_internal || cod_internal === "")
      newErrors.cod_internal = "Por favor ingrese un Cod. de barra o interno.";
    if (!mark || mark === "") newErrors.mark = "Por favor seleccione la marca.";
    if (!model || model === "")
      newErrors.model = "Por favor seleccione el modelo.";
    if (!unit || unit === "")
      newErrors.unit = "Por favor seleccione la unidad de medida.";
    if (stock < 0) newErrors.stock = "Por favor un stock valido.";
    if (price < 0) newErrors.price = "Por favor un stock valido.";
    // else if (!nroDocument || nroDocument.length < 8 || nroDocument.length > 11)
    //   newErrors.nroDocument =
    //     "Por favor ingrese el nro de documento de 8 - 11 caracteres";

    // if (!email || email === "")
    //   newErrors.email = "Por favor ingrese el correo.";
    // if (!username || username === "")
    //   newErrors.username = "Por favor ingrese el usuario.";
    // if (!password || password === "")
    //   newErrors.password = "Por favor ingrese la contraseña.";
    // else if (!password || password.length < 6)
    //   newErrors.password =
    //     "Por favor ingrese la contraseña mayor a 5 caracteres";

    return newErrors;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      // We got errors!
      setErrors(newErrors);
    } else {
      setDisabled(true);
      if (form?._id) {
        if (resource && resource.canUpdate) {
          try {
            const res = await updateProduct(form!._id, form);
            const { productUpdated } = res.data;
            setMessage({
              type: "success",
              message: `El producto ${productUpdated.name} ha sido actualizado existosamente.`,
            });
            setDisabled(false);
            listProducts();
          } catch (e) {
            setDisabled(false);
            const error: any = e as Error;
            const msg = error.response.data;
            setMessage({ type: "danger", message: msg.message });
          }
        } else {
          setMessage({
            type: "danger",
            message: "No tienes acceso a este recurso.",
          });
          setDisabled(false);
          return;
        }
      } else {
        if (resource && resource.canCreate) {
          try {
            const res = await postCreateProduct(form);
            const { product } = res.data;
            setMessage({
              type: "success",
              message: `El producto ${product.name} ha sido registrado existosamente.`,
            });
            setForm(initialStateProduct);
            setDisabled(false);
            listProducts();
          } catch (e) {
            setDisabled(false);
            const error: any = e as Error;
            const msg = error.response.data;
            setMessage({ type: "danger", message: msg.message });
          }
        } else {
          setMessage({
            type: "danger",
            message: "No tienes acceso a este recurso.",
          });
          setDisabled(false);
          return;
        }
      }
      setErrors(newErrors);
    }
  };

  const getProduct = useCallback(() => {
    if (product?._id) {
      setForm({
        _id: product?._id,
        name: product?.name,
        cod_internal: product?.cod_internal.slice(3),
        note: product?.note,
        mark: product?.mark,
        model: product?.model,
        unit: product?.unit,
        stock: product?.stock,
        price: product?.price,
        price_c: product?.price_c,
      });
    }
  }, [
    product?._id,
    product?.name,
    product?.cod_internal,
    product?.note,
    product?.mark,
    product?.model,
    product?.unit,
    product?.stock,
    product?.price,
    product?.price_c,
  ]);

  useEffect(() => {
    listMarks();
    listModels();
    listUnits();
    getProduct();
    getMyModule();
  }, [getProduct, getMyModule]);

  return (
    <Modal
      show={show}
      onHide={closeAndClear}
      backdrop="static"
      keyboard={false}
      top="true"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {form?._id ? "Editar Producto" : "Crear Producto"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}
          <Row className="mb-3">
            <Col xs={3}>
              <Form.Group as={Col} controlId="formGridArea">
                <Form.Label>Tu area/sede es:</Form.Label>
                <Form.Control disabled type="text" value={user.area.name} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>
                Nombre <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="name"
                onChange={handleChange}
                value={form?.name}
                type="text"
                placeholder="Introduce nombre"
                isInvalid={!!errors?.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridCodInternal">
              <Form.Label>
                Codigo barra / interno{" "}
                <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="cod_internal"
                onChange={handleChange}
                value={form?.cod_internal}
                type="text"
                placeholder="Introduce codigo barra / interno"
                isInvalid={!!errors?.cod_internal}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.cod_internal}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="formGridNote">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              onChange={handleChange}
              value={form?.note}
              isInvalid={!!errors?.note}
              placeholder="Introduce una nota"
            />
            <Form.Control.Feedback type="invalid">
              {errors?.note}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridMark">
              <Form.Label>
                Marca <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="mark"
                type="hidden"
                isInvalid={!!errors?.mark}
              />
              <Select
                placeholder="[Seleccione marca]"
                closeMenuOnSelect={true}
                components={animatedComponents}
                value={
                  form.mark === "" ? [] : { label: form.mark, value: form.mark }
                }
                onChange={(values: any) => {
                  const { value } = values;
                  setForm({ ...form, mark: value });
                  setErrors({
                    ...errors,
                    mark: null,
                  });
                }}
                options={marks}
              />

              <Form.Control.Feedback type="invalid">
                {errors?.mark}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridModel">
              <Form.Label>
                Modelo <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="model"
                type="hidden"
                isInvalid={!!errors?.model}
              />
              <Select
                placeholder="[Seleccione marca]"
                closeMenuOnSelect={true}
                components={animatedComponents}
                value={
                  form.model === ""
                    ? []
                    : { label: form.model, value: form.model }
                }
                onChange={(values: any) => {
                  const { value } = values;
                  setForm({ ...form, model: value });
                  setErrors({
                    ...errors,
                    model: null,
                  });
                }}
                options={models}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.model}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" as={Col} controlId="formGridUnit">
            <Form.Label>
              Unidad de medida <strong className="text-danger">*</strong>
            </Form.Label>
            <Form.Control
              name="unit"
              type="hidden"
              isInvalid={!!errors?.unit}
            />
            <Select
              placeholder="[Seleccione unidad de medida]"
              closeMenuOnSelect={true}
              components={animatedComponents}
              value={
                form.unit === "" ? [] : { label: form.unit, value: form.unit }
              }
              onChange={(values: any) => {
                const { value } = values;
                setForm({ ...form, unit: value });
                setErrors({
                  ...errors,
                  unit: null,
                });
              }}
              options={units}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.unit}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                name="stock"
                type="number"
                onChange={handleChange}
                value={form?.stock}
                isInvalid={!!errors?.stock}
                placeholder="Introduce un stock"
              />
              <Form.Control.Feedback type="invalid">
                {errors?.stock}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridStock">
              <Form.Label>Precio Venta</Form.Label>
              <Form.Control
                name="price"
                type="number"
                step="0.01"
                onChange={handleChange}
                value={form?.price}
                isInvalid={!!errors?.price}
                placeholder="Introduce un precio venta"
              />
              <Form.Control.Feedback type="invalid">
                {errors?.price}
              </Form.Control.Feedback>
            </Form.Group>
            {user.role.name === "SUPER ADMINISTRADOR" && (
              <Form.Group as={Col} controlId="formGridStock">
                <Form.Label>Precio Costo</Form.Label>
                <Form.Control
                  name="price_c"
                  type="number"
                  step="0.01"
                  onChange={handleChange}
                  value={form?.price_c}
                  isInvalid={!!errors?.price_c}
                  placeholder="Introduce un precio costo"
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.price_c}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAndClear}>
            Cerrar
          </Button>
          <Button type="submit" variant="primary" disabled={disabled}>
            {form?._id ? "Actualizar" : "Registrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default memo(ProductForm);
