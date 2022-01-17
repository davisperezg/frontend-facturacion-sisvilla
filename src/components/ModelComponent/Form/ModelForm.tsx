import {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { postCreateModel, updateModel } from "../../../api/model/model";
import { IAlert } from "../../../interface/IAlert";
import { Model } from "../../../interface/Model";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const ModelForm = ({
  show,
  model,
  closeModal,
  listModels,
}: {
  show: boolean;
  model?: Model;
  closeModal: () => void;
  listModels: () => void;
}) => {
  const initialStateModel: Model = {
    name: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Model>(initialStateModel);
  const [message, setMessage] = useState<IAlert>(initialStateAlert);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  const closeAndClear = () => {
    setForm(initialStateModel);
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
          const res = await updateModel(form!._id, form);
          const { modelUpdated } = res.data;
          setMessage({
            type: "success",
            message: `El modelo ${modelUpdated.name} ha sido actualizado existosamente.`,
          });
          setDisabled(false);
          listModels();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          const res = await postCreateModel(form);
          const { model } = res.data;
          setMessage({
            type: "success",
            message: `El modelo ${model.name} ha sido registrado existosamente.`,
          });
          setForm(initialStateModel);
          setDisabled(false);
          listModels();
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
    if (model?._id) {
      setForm({
        _id: model?._id,
        name: model?.name,
      });
    }
  }, [model?._id, model?.name]);

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
        <Modal.Title>{form?._id ? "Editar Model" : "Crear Model"}</Modal.Title>
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

export default memo(ModelForm);
