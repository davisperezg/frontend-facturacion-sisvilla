/* eslint-disable array-callback-return */
import { Card, Form, Button, Alert, Table, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useCallback, useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../context/auth";
import { useLocation } from "react-router-dom";
import { getModuleByMenu } from "../../api/module/module";

const initialStateAlert: IAlert = {
  type: "",
  message: "",
};

const OptionsScreen = () => {
  const { control, handleSubmit, getValues } = useForm<Resources>();
  const [roles, setRoles] = useState<ISelect[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState<IAlert>(initialStateAlert);
  const { resources: resourcesAux } = useContext(AuthContext);
  const [resource, setResource] = useState<any>(null);
  const location = useLocation();
  const getNameLocation = location.pathname.slice(1);

  const getMyModule = useCallback(async () => {
    const mymodule = await getModuleByMenu(getNameLocation);
    const findResource = resourcesAux.find(
      (res: any) => res.module.name === mymodule.data.name
    );
    setResource(findResource);
  }, [resourcesAux, getNameLocation]);

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
    if (resource && resource.canRead === false) return;
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
          canRestore: false,
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
      const listResources: any[] = [];
      const modulesUsed: any[] = [];

      // Recorres ambos arreglos y aplicas la condición que deseas
      res.data.module.filter((mod: any) => {
        getResourcesByRol.data.filter((dat: any) => {
          if (mod.name === dat.module.name) {
            modulesUsed.push(mod);
            listResources.push(dat);
          }
        });
      });

      const myResources = listResources.map((convert: any) => {
        return {
          _id: convert._id,
          name: convert.module.name,
          canCreate: convert.canCreate,
          canUpdate: convert.canUpdate,
          canRead: convert.canRead,
          canDelete: convert.canDelete,
          canRestore: convert.canRestore,
        };
      });

      // Una vez obtenidos los registros correctos, puedes filtrar nuevamente el arreglo omitiendo los mismos
      const myModulesAvailable = res.data.module
        .filter((d: any) => !modulesUsed.includes(d))
        .map((convert: any) => {
          return {
            name: convert.name,
            canCreate: false,
            canUpdate: false,
            canRead: false,
            canDelete: false,
            canRestore: false,
          };
        });

      // Unir los recursos con los modulos disponibles
      const joinResourcesAndModules = myResources.concat(myModulesAvailable);

      // Ordenar el array
      const ordered = joinResourcesAndModules.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setResources(ordered);
    }
  };

  const onSubmit: SubmitHandler<Resources> = async (data) => {
    setDisabled(true);
    clearAlert();
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id) {
        if (resource && resource.canUpdate) {
          const payload = {
            role: getValues("role"),
            module: resources[i].name,
            canCreate: resources[i].canCreate,
            canUpdate: resources[i].canUpdate,
            canRead: resources[i].canRead,
            canDelete: resources[i].canDelete,
            canRestore: resources[i].canRestore,
          };
          await putResource(payload, resources[i]._id);
          setAlert({
            type: "success",
            message: "Los recursos han sido actualizados existosamente.",
          });
        } else {
          setAlert({
            type: "danger",
            message: "No tienes acceso a este recurso.",
          });
          setDisabled(false);
          return;
        }
      } else {
        if (resource && resource.canCreate) {
          const payload = {
            role: getValues("role"),
            module: resources[i].name,
            canCreate: resources[i].canCreate,
            canUpdate: resources[i].canUpdate,
            canRead: resources[i].canRead,
            canDelete: resources[i].canDelete,
            canRestore: resources[i].canRestore,
          };
          await postResource(payload);
          setAlert({
            type: "success",
            message: "Los recursos han sido creados existosamente.",
          });
        } else {
          setAlert({
            type: "danger",
            message: "No tienes acceso a este recurso.",
          });
          setDisabled(false);
          return;
        }
      }
    }
    getModulesByRol(String(getValues("role")), true);
    setDisabled(false);
  };

  useEffect(() => {
    if (resource && resource.canRead) {
      listRoles();
    }

    getMyModule();
  }, [listRoles, getMyModule, resource]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Permisos a recursos</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {resource && resource.canRead && (
              <>
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
                {alert.type && (
                  <Alert variant={alert.type}>{alert.message}</Alert>
                )}
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
                              <th>Restaurar</th>
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
                    {resource && resource.canCreate && (
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
                    )}
                  </>
                )}
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default OptionsScreen;
