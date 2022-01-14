import {
  memo,
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { postCreateRole, updateRole } from "../../../api/role/role";
import { IAlert } from "../../../interface/IAlert";
import { Rol } from "../../../interface/Rol";
import Select from "react-select";
import { Module } from "../../../interface/Module";
import { getModules } from "../../../api/module/module";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();
type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const initialState: IAlert = {
  type: "",
  message: "",
};

const RolForm = ({
  show,
  role,
  closeModal,
  listRoles,
}: {
  show: boolean;
  role?: Rol;
  closeModal: () => void;
  listRoles: () => void;
}) => {
  const initialStateRol = {
    name: "",
    description: "",
    module: [],
  };

  const [form, setForm] = useState<Rol | any>(initialStateRol);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [errors, setErrors] = useState<any>({});

  const closeAndClear = () => {
    setForm(initialStateRol);
    closeModal();
    setMessage(initialState);
    setErrors({});
  };

  const listModules = async () => {
    const res = await getModules();
    const { data } = res;
    const filter = data.map((mod: any) => {
      return {
        label: mod.name,
        value: mod.name,
      };
    });
    setModules(filter);
  };

  const handleChange = (e: InputChange) => {
    setMessage(initialState);
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
          const res = await updateRole(form!._id, form);
          const { roleUpdated } = res.data;
          setMessage({
            type: "success",
            message: `El Rol ${roleUpdated.name} ha sido actualizado existosamente.`,
          });
          setDisabled(false);
          listRoles();
        } catch (e) {
          setDisabled(false);
          const error: any = e as Error;
          const msg = error.response.data;
          setMessage({ type: "danger", message: msg.message });
        }
      } else {
        try {
          const res = await postCreateRole(form);
          const { user } = res.data;
          setMessage({
            type: "success",
            message: `El Rol ${user.name} ha sido registrado existosamente.`,
          });
          setForm(initialStateRol);
          setDisabled(false);
          listRoles();
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

  const getRole = useCallback(() => {
    if (role?._id) {
      setForm({
        _id: role?._id,
        name: role?.name,
        description: role?.description,
        module: role?.module?.map((mod: any) => mod.value),
      });
    }
  }, [role?._id, role?.name, role?.description, role?.module]);

  useEffect(() => {
    listModules();
    getRole();
  }, [getRole]);

  const findFormErrors = () => {
    const { name } = form;
    const newErrors: any = {};
    // name errors
    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";

    return newErrors;
  };

  return (
    <Modal
      show={show}
      onHide={closeAndClear}
      backdrop="static"
      keyboard={false}
      top="true"
    >
      <Modal.Header closeButton>
        <Modal.Title>{form?._id ? "Editar Rol" : "Crear Rol"}</Modal.Title>
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
                isInvalid={!!errors.name}
                placeholder="Introduce nombre"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDes">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="description"
                onChange={handleChange}
                value={form?.description}
                type="text"
                placeholder="Introduce descripción (opcional)"
              />
            </Form.Group>
          </Row>
          <Form.Group as={Col} controlId="formGridMenu">
            <Form.Label>Modulos disponibles</Form.Label>
            <Select
              placeholder="[Seleccione modulo]"
              closeMenuOnSelect={false}
              components={animatedComponents}
              value={form.module.map((mod: any) => {
                return { label: mod, value: mod };
              })}
              onChange={(values: any) => {
                const selected = values.map((val: any) => val.value);
                setForm({ ...form, module: selected });
              }}
              options={modules}
              isMulti
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAndClear}>
            Cerrar
          </Button>
          <Button type="submit" variant="primary" disabled={disabled}>
            {role?._id ? "Actualizar" : "Registrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default memo(RolForm);
