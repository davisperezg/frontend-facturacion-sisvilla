import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../api/auth/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { Auth } from "../../interface/Auth";
import { useState, useContext } from "react";
import { setsesionLocal } from "../../lib/helpers/sesion/sesion";
import { AuthContext } from "../../context/auth";
import { whois } from "../../api/user/user";
import { getResourceByRol } from "../../api/resources/rosources";

const LoginScreen = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Auth>();
  const [message, setMessage] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const { setUser, setResources } = useContext(AuthContext);

  const onSubmit: SubmitHandler<Auth> = async (data) => {
    setDisabled(true);
    try {
      const res: any = await postLogin(data.username, data.password);
      const access = res.data.user;
      setsesionLocal("token", access.access_token);
      setsesionLocal("refresh", access.refresh_token);
      setDisabled(false);
      const user = await whois();
      const getResourcesByRol = await getResourceByRol(
        String(user.data.role.name)
      );
      setUser(user.data);
      setResources(getResourcesByRol.data);
      setsesionLocal("user", JSON.stringify(user.data));
      setsesionLocal("resources", JSON.stringify(getResourcesByRol.data));
      goMenu();
    } catch (e) {
      setDisabled(false);
      const error: any = e as Error;
      const msg = error.response.data;
      if (msg.status === 400) {
        setMessage("Usuario y/o contraseña es incorrecta");
      }
    }
  };

  const goMenu = () => {
    navigate("/");
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__center}>
        {message && <Alert variant="danger">{message}</Alert>}

        <Card>
          <Card.Header as="h5">Acceso al sistema</Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridUsername">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    {...register("username", {
                      required: true,
                      maxLength: 11,
                    })}
                    type="text"
                    placeholder="Introduce tu usuario"
                  />
                  <Form.Text id="usernameHelpBlock" muted>
                    {errors?.username?.type === "required" && (
                      <label className="text-danger">
                        Debe ingresar el usuario
                      </label>
                    )}
                    {errors?.username?.type === "maxLength" && (
                      <label className="text-danger">
                        Debe completar solo el maximo de caracteres "11"
                      </label>
                    )}
                  </Form.Text>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    {...register("password", { required: true, maxLength: 25 })}
                    type="password"
                    placeholder="Introduce tu contraseña"
                  />
                  <Form.Text id="passwordHelpBlock" muted>
                    {errors.password?.type === "required" && (
                      <label className="text-danger">
                        Debe ingresar la contraseña
                      </label>
                    )}

                    {errors.password?.type === "maxLength" && (
                      <label className="text-danger">
                        Debe completar solo el maximo de caracteres "11"
                      </label>
                    )}
                  </Form.Text>
                </Form.Group>
              </Row>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={disabled}
              >
                Ingresar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
