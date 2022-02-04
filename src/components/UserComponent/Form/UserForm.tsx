import { postCreateUser, updateUser } from "../../../api/user/user";
import { IAlert } from "../../../interface/IAlert";
import { User } from "../../../interface/User";
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
import { Rol } from "../../../interface/Rol";
import { getRoles } from "../../../api/role/role";
import { AuthContext } from "../../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../../api/module/module";
import { getAreas } from "../../../api/area/area";
import { Area } from "../../../interface/Area";
import { getServiceData } from "../../../api/identify";

type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const initialState: IAlert = {
  type: "",
  message: "",
};

const UserForm = ({
  show,
  user,
  closeModal,
  listUsers,
}: {
  show: boolean;
  user?: User;
  closeModal: () => void;
  listUsers: () => void;
}) => {
  const initialStateUser = {
    name: "",
    lastname: "",
    role: "",
    tipDocument: "",
    nroDocument: "",
    email: "",
    username: "",
    password: "",
  };

  const [form, setForm] = useState<Rol | any>(initialStateUser);
  const [message, setMessage] = useState<IAlert>(initialState);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [errors, setErrors] = useState<any>({});
  const { resources, user: userContext } = useContext(AuthContext);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);
  const [resource, setResource] = useState<any>(null);
  const [areas, setAreas] = useState<Area[]>([]);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resources.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resources, getNameLocation]);

  const closeAndClear = () => {
    setForm(initialStateUser);
    closeModal();
    setMessage(initialState);
    setErrors({});
  };

  const listRoles = async () => {
    const res = await getRoles();
    const { data } = res;
    setRoles(data);
  };

  const listAreas = async () => {
    const res = await getAreas();
    const { data } = res;
    setAreas(data);
  };

  const handleChange = (e: InputChange) => {
    setMessage(initialState);
    // Check and see if errors exist, and remove them from the error object:
    if (errors[e.target.name])
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const findFormErrors = () => {
    const {
      name,
      role,
      area,
      lastname,
      tipDocument,
      nroDocument,
      email,
      username,
      password,
    } = form;
    const newErrors: any = {};
    if (!area || area === "") newErrors.area = "Por favor seleccione el area.";
    if (!name || name === "") newErrors.name = "Por favor ingrese el nombre.";
    if (!role || role === "") newErrors.role = "Por favor seleccione el rol.";
    if (!lastname || lastname === "")
      newErrors.lastname = "Por favor ingrese el apellido.";
    if (!tipDocument || tipDocument === "")
      newErrors.tipDocument = "Por favor seleccione el tipo de documento.";
    if (!nroDocument || nroDocument === "")
      newErrors.nroDocument = "Por favor ingrese nro de documento.";
    else if (!nroDocument || nroDocument.length < 8 || nroDocument.length > 11)
      newErrors.nroDocument =
        "Por favor ingrese el nro de documento de 8 - 11 caracteres";

    if (!email || email === "")
      newErrors.email = "Por favor ingrese el correo.";
    if (!username || username === "")
      newErrors.username = "Por favor ingrese el usuario.";

    if (!form._id) {
      if (!password || password === "")
        newErrors.password = "Por favor ingrese la contraseña.";
      else if (!password || password.length < 6)
        newErrors.password =
          "Por favor ingrese la contraseña mayor a 5 caracteres";
    }

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
            const res = await updateUser(form!._id, form);
            const { userUpdated } = res.data;
            setMessage({
              type: "success",
              message: `El usuario ${userUpdated.username} ha sido actualizado existosamente.`,
            });
            setDisabled(false);
            listUsers();
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
            const res = await postCreateUser(form);
            const { user } = res.data;
            setMessage({
              type: "success",
              message: `El usuario ${user.username} ha sido registrado existosamente.`,
            });
            setForm(initialStateUser);
            setDisabled(false);
            listUsers();
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

  const getUser = useCallback(() => {
    if (user?._id) {
      setForm({
        _id: user?._id,
        name: user?.name,
        lastname: user?.lastname,
        area: user?.area,
        role: user?.role,
        tipDocument: user?.tipDocument,
        nroDocument: user?.nroDocument,
        email: user?.email,
        username: user?.username,
      });
    }
  }, [
    user?._id,
    user?.name,
    user?.lastname,
    user?.area,
    user?.role,
    user?.tipDocument,
    user?.nroDocument,
    user?.email,
    user?.username,
  ]);

  useEffect(() => {
    listRoles();
    getUser();
    getMyModule();
    listAreas();
  }, [getUser, getMyModule]);

  return (
    <>
      <Modal
        show={show}
        onHide={closeAndClear}
        backdrop="static"
        keyboard={false}
        top="true"
        // size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {form?._id ? "Editar Usuario" : "Crear Usuario"}
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
              <Form.Group as={Col} controlId="formGridRole">
                <Form.Label>
                  Rol <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Select
                  name="role"
                  onChange={handleChange}
                  value={form?.role}
                  isInvalid={!!errors?.role}
                >
                  <option value="">[Seleccione el rol]</option>
                  {userContext.role.name === "SUPER ADMINISTRADOR"
                    ? roles.map((role) => (
                        <option key={role._id} value={role.name}>
                          {role.name}
                        </option>
                      ))
                    : roles
                        .filter((flts) => flts.name !== "SUPER ADMINISTRADOR")
                        .map((role) => (
                          <option key={role._id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.role}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridTip">
                <Form.Label>
                  Documento <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Select
                  name="tipDocument"
                  onChange={(e) => {
                    setForm({
                      ...form,
                      tipDocument: e.target.value,
                      nroDocument: "",
                      name: "",
                      lastname: "",
                    });
                  }}
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
            </Row>
            <Form.Group className="mb-3" controlId="formGridNroDocument">
              <Form.Label>
                Nro de documento <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="nroDocument"
                maxLength={form.tipDocument === "DNI" ? 8 : 11}
                minLength={form.tipDocument === "DNI" ? 8 : 11}
                onKeyUp={async (e: any) => {
                  if (
                    form.tipDocument === "DNI" &&
                    Number(e.target.value.length) === 8
                  ) {
                    try {
                      const res = await getServiceData(
                        String(form.tipDocument).toLowerCase(),
                        e.target.value
                      );
                      const { nombres, apellidoPaterno, apellidoMaterno } =
                        res.data;
                      setForm({
                        ...form,
                        name: nombres,
                        lastname: apellidoPaterno + " " + apellidoMaterno,
                      });
                    } catch (e) {
                      alert(
                        "Ha ocurrido un error. Borre el nro de documento y vuelva a ingresarlo, si el error persiste ingrese el nombre/razon o apellido/estado del usuario manualmente. Gracias"
                      );
                    }
                  }
                  if (
                    form.tipDocument === "RUC" &&
                    Number(e.target.value.length) === 11
                  ) {
                    try {
                      const res = await getServiceData(
                        String(form.tipDocument).toLowerCase(),
                        e.target.value
                      );
                      const { nombre, estado } = res.data;
                      setForm({
                        ...form,
                        name: nombre,
                        lastname: estado,
                      });
                    } catch (e) {
                      alert(
                        "Ha ocurrido un error. Verifique el Nro de documento borre el nro de documento y vuelva a ingresarlo, si el error persiste ingrese el nombre/razon o apellido/estado del usuario manualmente. Gracias"
                      );
                    }
                  }
                }}
                onChange={(e) => {
                  setForm({
                    ...form,
                    nroDocument: e.target.value,
                    name: "",
                    lastname: "",
                  });
                }}
                value={form?.nroDocument}
                isInvalid={!!errors?.nroDocument}
                placeholder="Introduce el nro de documento"
              />
              <Form.Control.Feedback type="invalid">
                {errors?.nroDocument}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridNames">
                <Form.Label>
                  {form.tipDocument === "RUC" ? "Razón social" : "Nombres"}{" "}
                  <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  name="name"
                  onChange={handleChange}
                  value={form?.name}
                  type="text"
                  placeholder={
                    form.tipDocument === "RUC"
                      ? "Introduce razón social"
                      : "Introduce nombre(s)"
                  }
                  isInvalid={!!errors?.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridLastnames">
                <Form.Label>
                  {form.tipDocument === "RUC" ? "Estado" : "Apellidos"}{" "}
                  <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  name="lastname"
                  onChange={handleChange}
                  value={form?.lastname}
                  type="text"
                  placeholder={
                    form.tipDocument === "RUC"
                      ? "Introduce estado de ruc"
                      : "Introduce apellido(s)"
                  }
                  isInvalid={!!errors?.lastname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.lastname}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridEmail">
              <Form.Label>
                Correo electronico <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                isInvalid={!!errors?.email}
                name="email"
                onChange={handleChange}
                value={form?.email}
                placeholder="Introduce el correo"
              />
              <Form.Control.Feedback type="invalid">
                {errors?.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridUsername">
              <Form.Label>
                Usuario <strong className="text-danger">*</strong>
              </Form.Label>
              <Form.Control
                name="username"
                onChange={handleChange}
                value={form?.username}
                isInvalid={!!errors?.username}
                placeholder="Introduce el usuario"
              />
              <Form.Control.Feedback type="invalid">
                {errors?.username}
              </Form.Control.Feedback>
            </Form.Group>
            {!user?._id && (
              <Form.Group className="mb-3" controlId="formGridPassword">
                <Form.Label>
                  Contraseña <strong className="text-danger">*</strong>
                </Form.Label>
                <Form.Control
                  name="password"
                  onChange={handleChange}
                  value={form?.password}
                  isInvalid={!!errors?.password}
                  placeholder="Introduce la contraseña"
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.password}
                </Form.Control.Feedback>
              </Form.Group>
            )}
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
    </>
  );
};

export default memo(UserForm);
