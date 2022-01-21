import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../api/module/module";
import {
  postCreateSupplier,
  updateSupplier,
} from "../../../api/supplier/supplier";
import { AuthContext } from "../../../context/auth";
import { IAlert } from "../../../interface/IAlert";
import { Supplier } from "../../../interface/Supplier";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const SupplierForm = ({
  show,
  supplier,
  closeModal,
  listSuppliers,
}: {
  show: boolean;
  supplier?: Supplier;
  closeModal: () => void;
  listSuppliers: () => void;
}) => {
  const initialStateSuppliers: Supplier = {
    name: "",
    contact: "",
    tipDocument: "",
    nroDocument: "",
    email: "",
    cellphone: "",
    address: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Supplier>(initialStateSuppliers);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const { resources } = useContext(AuthContext);
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
    setForm(initialStateSuppliers);
    closeModal();
    setMessage(initialStateAlert);
    setErrors({});
  };

  const findFormErrors = () => {
    const { name, contact, cellphone } = form;
    const newErrors: any = {};
    // name errors
    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";
    if (!contact || contact === "")
      newErrors.contact = "Por favor ingrese el contacto.";
    if (!cellphone || cellphone === "")
      newErrors.cellphone = "Por favor ingrese el celular.";
    else if (!cellphone || cellphone.length < 9 || cellphone.length > 9)
      newErrors.cellphone = "El celular debe tener 9 caracteres.";

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
        if (resource && resource.canUpdate) {
          try {
            const res = await updateSupplier(form!._id, form);
            const { supplierUpdated } = res.data;
            setMessage({
              type: "success",
              message: `El proveedor ${supplierUpdated.name} ha sido actualizado existosamente.`,
            });
            setDisabled(false);
            listSuppliers();
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
            const res = await postCreateSupplier(form);
            const { supplier } = res.data;
            setMessage({
              type: "success",
              message: `El proveedor ${supplier.name} ha sido registrado existosamente.`,
            });
            setForm(initialStateSuppliers);
            setDisabled(false);
            listSuppliers();
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
      setErrors({});
    }
  };

  const getModule = useCallback(() => {
    if (supplier?._id) {
      setForm({
        _id: supplier?._id,
        name: supplier?.name,
        contact: supplier?.contact,
        tipDocument: supplier?.tipDocument,
        nroDocument: supplier?.nroDocument,
        email: supplier?.email,
        cellphone: supplier?.cellphone,
        address: supplier?.address,
        obs: supplier?.obs,
      });
    }
  }, [
    supplier?._id,
    supplier?.name,
    supplier?.contact,
    supplier?.tipDocument,
    supplier?.nroDocument,
    supplier?.email,
    supplier?.cellphone,
    supplier?.address,
    supplier?.obs,
  ]);

  useEffect(() => {
    getModule();
    getMyModule();
  }, [getModule, getMyModule]);

  return (
    <Modal
      show={show}
      onHide={closeAndClear}
      backdrop="static"
      keyboard={false}
      top="true"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {form?._id ? "Editar Proveedor" : "Crear Proveedor"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Nombre</Form.Label>
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
            <Form.Group as={Col} controlId="formGridContact">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                name="contact"
                onChange={handleChange}
                value={form?.contact}
                type="text"
                placeholder="Introduce contacto"
                isInvalid={!!errors?.contact}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.contact}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" as={Col} controlId="formGridTip">
            <Form.Label>Tipo de documento</Form.Label>
            <Form.Select
              name="tipDocument"
              onChange={handleChange}
              value={form?.tipDocument}
              isInvalid={!!errors?.tipDocument}
            >
              <option value="">[Seleccione el documento]</option>
              <option value="OTRO">OTRO</option>
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors?.tipDocument}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" as={Col} controlId="formGridNro">
            <Form.Label>Nro de documento</Form.Label>
            <Form.Control
              name="nroDocument"
              onChange={handleChange}
              value={form?.nroDocument}
              type="text"
              placeholder="Introduce Nro. de documento"
              isInvalid={!!errors?.nroDocument}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.nroDocument}
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                value={form?.email}
                type="text"
                placeholder="Introduce correo"
                isInvalid={!!errors?.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridCellphone">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                name="cellphone"
                onChange={handleChange}
                value={form?.cellphone}
                type="text"
                placeholder="Introduce celular"
                isInvalid={!!errors?.cellphone}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.cellphone}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" as={Col} controlId="formGridAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="address"
              onChange={handleChange}
              value={form?.address}
              type="text"
              placeholder="Introduce dirección"
              isInvalid={!!errors?.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" as={Col} controlId="formGridObs">
            <Form.Label>Observación</Form.Label>
            <Form.Control
              name="obs"
              onChange={handleChange}
              value={form?.obs}
              as="textarea"
              placeholder="Introduce observación"
              isInvalid={!!errors?.obs}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.obs}
            </Form.Control.Feedback>
          </Form.Group>
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

export default memo(SupplierForm);
