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
import { postCreateUnit, updateUnit } from "../../../api/unit/unit";
import { AuthContext } from "../../../context/auth";
import { IAlert } from "../../../interface/IAlert";
import { Unit } from "../../../interface/Unit";
type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const UnitForm = ({
  show,
  unit,
  closeModal,
  listUnits,
}: {
  show: boolean;
  unit?: Unit;
  closeModal: () => void;
  listUnits: () => void;
}) => {
  const initialStateUnit: Unit = {
    name: "",
  };

  const initialStateAlert: IAlert = {
    type: "",
    message: "",
  };

  const [form, setForm] = useState<Unit>(initialStateUnit);
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
    setForm(initialStateUnit);
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
        if (resource && resource.canUpdate) {
          try {
            const res = await updateUnit(form!._id, form);
            const { unitUpdated } = res.data;
            setMessage({
              type: "success",
              message: `La unidad ${unitUpdated.name} ha sido actualizado existosamente.`,
            });
            setDisabled(false);
            listUnits();
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
            const res = await postCreateUnit(form);
            const { unit } = res.data;
            setMessage({
              type: "success",
              message: `La unidad ${unit.name} ha sido registrado existosamente.`,
            });
            setForm(initialStateUnit);
            setDisabled(false);
            listUnits();
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
    if (unit?._id) {
      setForm({
        _id: unit?._id,
        name: unit?.name,
      });
    }
  }, [unit?._id, unit?.name]);

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
          {form?._id ? "Editar Unidad de medida" : "Crear Unidad de medida"}
        </Modal.Title>
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

export default memo(UnitForm);
