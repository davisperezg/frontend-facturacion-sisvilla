import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { getAreas } from "../../../api/area/area";
import { postSequence, updateSequence } from "../../../api/sequence/sequence";
import { Area } from "../../../interface/Area";
import { IAlert } from "../../../interface/IAlert";
import { Sequence } from "../../../interface/Sequence";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const SequenceForm = ({
  show,
  sequence,
  closeModal,
  listSequences,
}: {
  show: boolean;
  sequence?: Sequence;
  closeModal: () => void;
  listSequences: () => void;
}) => {
  const initialStateSequence = {
    sequence: 0,
    area: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Sequence | any>(initialStateSequence);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [areas, setAreas] = useState<Area[]>([]);

  const closeAndClear = () => {
    setForm(initialStateSequence);
    closeModal();
    setMessage(initialStateAlert);
    setErrors({});
  };

  const listAreas = async () => {
    const res = await getAreas();
    const { data } = res;
    setAreas(data);
  };

  const findFormErrors = () => {
    const { sequence, area } = form;
    const newErrors: any = {};

    if (sequence <= -1) newErrors.sequence = "Por favor ingrese un nro entero.";
    if (!area || area === "") newErrors.area = "Por favor seleccione el area.";

    return newErrors;
  };

  const handleChange = (e: InputChange) => {
    setMessage(initialStateAlert);
    if (!!errors[e.target.name])
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "sequence" ? Number(e.target.value) : e.target.value,
    });
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
          await updateSequence(form!._id, form);
          setMessage({
            type: "success",
            message: `La secuenta ha sido actualizado correctamente.`,
          });
          setDisabled(false);
          listSequences();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          await postSequence(form);
          setMessage({
            type: "success",
            message: `El secuencia ha sido registrado existosamente.`,
          });
          setForm(initialStateSequence);
          setDisabled(false);
          listSequences();
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

  const getSequence = useCallback(() => {
    if (sequence?._id) {
      setForm({
        _id: sequence?._id,
        sequence: sequence?.sequence,
        area: sequence?.area,
      });
    }
  }, [sequence?._id, sequence?.sequence, sequence?.area]);

  useEffect(() => {
    getSequence();
    listAreas();
  }, [getSequence]);

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
          {form?._id ? "Editar Nro de secuencia" : "Crear Nro de secuencia"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {message.type && (
            <Alert variant={message.type}>{message.message}</Alert>
          )}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridRole">
              <Form.Label>
                Area <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Select
                name="area"
                onChange={handleChange}
                value={form?.area}
                isInvalid={!!errors?.area}
              >
                <option value="">[Seleccione el area]</option>
                {areas.map((area) => (
                  <option key={area._id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors?.area}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>
                Nro de Secuencia <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="sequence"
                onChange={handleChange}
                value={form?.sequence}
                type="number"
                isInvalid={!!errors?.sequence}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.sequence}
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

export default memo(SequenceForm);
