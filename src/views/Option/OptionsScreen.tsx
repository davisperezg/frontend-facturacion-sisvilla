import { Card, Form, Button, Alert, Table, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useCallback, useEffect, useState } from "react";
import { Module } from "../../interface/Module";
import { getDataRole, getRoles } from "../../api/role/role";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import styles from "./Options.module.scss";
import {
  getResourceByRol,
  postResource,
  putResource,
} from "../../api/resources/rosources";
import { Resources } from "../../interface/Resources";
import ResourceItem from "../../components/OptionComponent/List/Module/ResourceItem";
import { IAlert } from "../../interface/IAlert";
import { ISelect } from "../../interface/ISelect";

const initialStateAlert: IAlert = {
  type: "",
  message: "",
};

const OptionsScreen = ({ myResource }: { myResource: Resources }) => {
  const { control, handleSubmit, getValues } = useForm<Resources>();
  const [roles, setRoles] = useState<ISelect[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>(initialStateAlert);

  const listRoles = useCallback(async () => {
    const res = await getRoles();
    const { data } = res;

    const filter = data.map((rol: any) => {
      return {
        label: rol.name,
        value: rol.name,
      };
    });
    setRoles(filter);
  }, []);

  const clearAlert = useCallback(() => setAlert(initialStateAlert), []);

  const cleearArrays = () => {
    setResources([]);
    setModules([]);
  };

  const getModulesByRol = async (valRol: string, registered?: boolean) => {
    cleearArrays();
    if (!registered) {
      clearAlert();
    }
    //obtienes los modulos segun el rol
    const body = { name: String(valRol) };
    const res = await getDataRole(body);
    setModules(res.data.module);

    //muestra los modulos segun el rol con los recursos ya creados
    const getResourcesByRol: any = await getResourceByRol(
      String(getValues("role"))
    );
    // console.log("como recurso tienes", getResourcesByRol.data.length);
    // console.log("como modulos tienes", res.data.module.length);
    if (res.data.module.length > 0 && getResourcesByRol.data.length === 0) {
      const filterResources = res.data.module.map((mod: any) => {
        return {
          name: mod.name,
          canCreate: false,
          canUpdate: false,
          canRead: false,
          canDelete: false,
        };
      });
      setResources(filterResources);
    } else if (
      res.data.module.length === 0 &&
      getResourcesByRol.data.length === 0
    ) {
      setAlert({
        type: "info",
        message: "El rol seleccionado no tiene recursos ni modulos asignados",
      });
    } else if (
      getResourcesByRol.data.length > 0 &&
      res.data.module.length === 0
    ) {
      setAlert({
        type: "info",
        message:
          "El rol seleccionado no tiene modulos asignados pero sí recursos, por favor asigne los modulos en la seccion /roles(Roles)",
      });
    } else {
      const myResources = res.data.module.map((res: any, i: number) => {
        if (getResourcesByRol.data[i]) {
          return {
            _id: getResourcesByRol.data[i]._id,
            name: getResourcesByRol.data[i].module.name,
            canCreate: getResourcesByRol.data[i].canCreate,
            canUpdate: getResourcesByRol.data[i].canUpdate,
            canRead: getResourcesByRol.data[i].canRead,
            canDelete: getResourcesByRol.data[i].canDelete,
          };
        } else {
          return {
            name: res.name,
            canCreate: false,
            canUpdate: false,
            canRead: false,
            canDelete: false,
          };
        }
      });
      setResources(myResources);
    }
  };

  const onSubmit: SubmitHandler<Resources> = async (data) => {
    setDisabled(true);
    clearAlert();
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id) {
        const payload = {
          role: getValues("role"),
          module: resources[i].name,
          canCreate: resources[i].canCreate,
          canUpdate: resources[i].canUpdate,
          canRead: resources[i].canRead,
          canDelete: resources[i].canDelete,
        };
        await putResource(payload, resources[i]._id);
        setAlert({
          type: "success",
          message: "Los recursos han sido actualizados existosamente",
        });
      } else {
        const payload = {
          role: getValues("role"),
          module: resources[i].name,
          canCreate: resources[i].canCreate,
          canUpdate: resources[i].canUpdate,
          canRead: resources[i].canRead,
          canDelete: resources[i].canDelete,
        };
        await postResource(payload);
        setAlert({
          type: "success",
          message: "Los recursos han sido creados existosamente",
        });
      }
    }
    getModulesByRol(String(getValues("role")), true);
    setDisabled(false);
  };

  useEffect(() => {
    listRoles();
  }, [listRoles]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Permisos a recursos</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Col xs={3}>
                <Form.Group as={Col} controlId="formGridRol">
                  <Form.Label>Seleccionar rol</Form.Label>

                  <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange, value, ref } }) => (
                      <Select
                        placeholder="[Seleccione rol]"
                        options={roles}
                        value={roles.find((c) => c.value === value)}
                        onChange={(val) => {
                          getModulesByRol(String(val?.value));
                          onChange(val?.value);
                        }}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            {alert.type && <Alert variant={alert.type}>{alert.message}</Alert>}
            {modules.length > 0 && (
              <>
                <Row>
                  <Col>
                    <Table
                      striped
                      bordered
                      hover
                      responsive="sm"
                      className={styles.table}
                    >
                      <thead>
                        <tr>
                          <th>Modulos</th>
                          <th>Crear</th>
                          <th>Actualizar</th>
                          <th>Leer</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((mod, i) => (
                          <ResourceItem
                            key={mod._id ? mod._id : i}
                            mod={mod}
                            clearAlert={clearAlert}
                            resources={resources}
                            setResources={setResources}
                          />
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row className={styles.row}>
                  <Button
                    type="submit"
                    className={styles.row__button}
                    variant="primary"
                    disabled={disabled}
                  >
                    {disabled ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </Row>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default OptionsScreen;
