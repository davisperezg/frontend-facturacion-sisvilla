import {
  memo,
  useState,
  useCallback,
  useEffect,
  FormEvent,
  ChangeEvent,
  useContext,
} from "react";
import { IAlert } from "../../../interface/IAlert";
import { Menu } from "../../../interface/Menu";
import { Module } from "../../../interface/Module";
import { getMenus } from "../../../api/menu/menu";
import {
  getModuleByMenu,
  postCreateModule,
  updateModule,
} from "../../../api/module/module";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AuthContext } from "../../../context/auth";
import { useLocation } from "react-router-dom";

const animatedComponents = makeAnimated();
type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const initialState: IAlert = {
  type: "",
  message: "",
};

const ModuleForm = ({
  show,
  module,
  closeModal,
  listModules,
}: {
  show: boolean;
  module?: Module;
  closeModal: () => void;
  listModules: () => void;
}) => {
  const initialStateMod = {
    name: "",
    menu: [],
  };

  const [form, setForm] = useState<Module | any>(initialStateMod);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [menus, setMenus] = useState<Menu[]>([]);
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
    setForm(initialStateMod);
    closeModal();
    setMessage(initialState);
    setErrors({});
  };

  const listMenus = async () => {
    const res = await getMenus();
    const { data } = res;
    const filter = data.map((men: any) => {
      return {
        label: men.name,
        value: men.name,
      };
    });
    setMenus(filter);
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

  const findFormErrors = () => {
    const { name } = form;
    const newErrors: any = {};
    // name errors
    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";

    return newErrors;
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
            const res = await updateModule(form!._id, form);
            const { moduleUpdated } = res.data;
            setMessage({
              type: "success",
              message: `El modulo ${moduleUpdated.name} ha sido actualizado existosamente.`,
            });
            setDisabled(false);
            listModules();
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
            const res = await postCreateModule(form);
            const { module } = res.data;
            setMessage({
              type: "success",
              message: `El modulo ${module.name} ha sido registrado existosamente.`,
            });
            setForm(initialStateMod);
            setDisabled(false);
            listModules();
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
    if (module?._id) {
      setForm({
        _id: module?._id,
        name: module?.name,
        menu: module?.menu?.map((mod: any) => mod.value),
      });
    }
  }, [module?._id, module?.name, module?.menu]);

  useEffect(() => {
    listMenus();
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
          {form?._id ? "Editar Modulo" : "Crear Modulo"}
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
          </Row>
          <Form.Group as={Col} controlId="formGridMenu">
            <Form.Label>Menus disponibles</Form.Label>
            <Select
              placeholder="[Seleccione menu]"
              closeMenuOnSelect={false}
              components={animatedComponents}
              value={form.menu.map((mod: any) => {
                return { label: mod, value: mod };
              })}
              onChange={(values: any) => {
                const selected = values.map((val: any) => val.value);
                setForm({ ...form, menu: selected });
              }}
              options={menus}
              isMulti
            />
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

export default memo(ModuleForm);
