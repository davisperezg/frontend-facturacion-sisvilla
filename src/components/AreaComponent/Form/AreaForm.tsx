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
import { postArea, updateArea } from "../../../api/area/area";
import { IAlert } from "../../../interface/IAlert";
import { Area } from "../../../interface/Area";
import { AuthContext } from "../../../context/auth";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const AreaForm = ({
  show,
  area,
  closeModal,
  listAreas,
}: {
  show: boolean;
  area?: Area;
  closeModal: () => void;
  listAreas: () => void;
}) => {
  const initialStateArea: Area = {
    name: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Area>(initialStateArea);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [sede, setSede] = useState<string>("");
  const { user } = useContext(AuthContext);

  const closeAndClear = () => {
    setForm(initialStateArea);
    closeModal();
    setMessage(initialStateAlert);
    setErrors({});
  };

  const findFormErrors = () => {
    const { name } = form;
    const newErrors: any = {};
    // name errors
    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";

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
          const res = await updateArea(form!._id, form);
          const { areaUpdated } = res.data;
          setMessage({
            type:
              form.name !== sede && sede === user.area.name
                ? "info"
                : "success",
            message:
              form.name !== sede && sede === user.area.name
                ? "Actualizando datos..."
                : `El area ${areaUpdated.name} ha sido actualizado existosamente.`,
          });
          if (form.name !== sede && sede === user.area.name) {
            window.location.reload();
            return;
          } else {
            listAreas();
          }
          setDisabled(false);
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          const res = await postArea(form);
          const { area } = res.data;
          setMessage({
            type: "success",
            message: `El area ${area.name} ha sido registrado existosamente.`,
          });
          setForm(initialStateArea);
          setDisabled(false);
          listAreas();
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

  const getArea = useCallback(() => {
    if (area?._id) {
      setForm({
        _id: area?._id,
        name: area?.name,
      });
      setSede(area?.name);
    }
  }, [area?._id, area?.name]);

  useEffect(() => {
    getArea();
  }, [getArea]);

  return (
    <Modal
      show={show}
      onHide={closeAndClear}
      backdrop="static"
      keyboard={false}
      top="true"
    >
      <Modal.Header closeButton>
        <Modal.Title>{form?._id ? "Editar Area" : "Crear Area"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}

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

export default memo(AreaForm);
