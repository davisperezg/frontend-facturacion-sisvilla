import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { postCreateMark, updateMark } from "../../../api/mark/mark";
import { IAlert } from "../../../interface/IAlert";
import { Mark } from "../../../interface/Mark";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const MarkForm = ({
  show,
  mark,
  closeModal,
  listMarks,
}: {
  show: boolean;
  mark?: Mark;
  closeModal: () => void;
  listMarks: () => void;
}) => {
  const initialStateMark: Mark = {
    name: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Mark>(initialStateMark);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  const closeAndClear = () => {
    setForm(initialStateMark);
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
          const res = await updateMark(form!._id, form);
          const { markUpdated } = res.data;
          setMessage({
            type: "success",
            message: `La marca ${markUpdated.name} ha sido actualizado existosamente.`,
          });
          setDisabled(false);
          listMarks();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          const res = await postCreateMark(form);
          const { mark } = res.data;
          setMessage({
            type: "success",
            message: `La marca ${mark.name} ha sido registrado existosamente.`,
          });
          setForm(initialStateMark);
          setDisabled(false);
          listMarks();
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

  const getModule = useCallback(() => {
    if (mark?._id) {
      setForm({
        _id: mark?._id,
        name: mark?.name,
      });
    }
  }, [mark?._id, mark?.name]);

  useEffect(() => {
    getModule();
  }, [getModule]);

  return (
    <Modal
      show={show}
      onHide={closeAndClear}
      backdrop="static"
      keyboard={false}
      top="true"
    >
      <Modal.Header closeButton>
        <Modal.Title>{form?._id ? "Editar Marca" : "Crear Marca"}</Modal.Title>
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

export default memo(MarkForm);
