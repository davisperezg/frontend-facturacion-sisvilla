import { Resources } from "../../../../interface/Resources";
import { Form } from "react-bootstrap";
import { useState, memo } from "react";

const ResourceItem = ({
  mod,
  setResources,
  resources,
  clearAlert,
}: {
  mod: any;
  setResources: React.Dispatch<React.SetStateAction<any[]>>;
  resources: any[];
  clearAlert: () => void;
}) => {
  const initialState = {
    module: mod._id ? mod.name : "",
    canCreate: mod._id ? mod.canCreate : false,
    canUpdate: mod._id ? mod.canUpdate : false,
    canRead: mod._id ? mod.canRead : false,
    canDelete: mod._id ? mod.canDelete : false,
    canRestore: mod._id ? mod.canRestore : false,
  };

  const [resource, setResource] = useState<Resources>(initialState);

  //const onChange = (e: any) => {};

  return (
    <tr>
      <td>{mod.name}</td>
      <td>
        <Form.Check
          type="checkbox"
          name="canCreate"
          checked={mod.canCreate}
          onChange={(e) => {
            clearAlert();
            const element = resources.map((res: any) => {
              return {
                ...res,
                canCreate:
                  res.name === mod.name ? !resource.canCreate : res.canCreate,
              };
            });
            setResources(element);
            setResource({
              ...resource,
              module: mod.name,
              canCreate: !resource.canCreate,
            });
          }}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          name="canUpdate"
          checked={mod.canUpdate}
          onChange={(e) => {
            clearAlert();
            const element = resources.map((res: any) => {
              return {
                ...res,
                canUpdate:
                  res.name === mod.name ? !resource.canUpdate : res.canUpdate,
              };
            });
            setResources(element);
            setResource({
              ...resource,
              module: mod.name,
              canUpdate: !resource.canUpdate,
            });
          }}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          name="canRead"
          checked={mod.canRead}
          onChange={(e) => {
            clearAlert();
            const element = resources.map((res: any) => {
              return {
                ...res,
                canRead:
                  res.name === mod.name ? !resource.canRead : res.canRead,
              };
            });
            setResources(element);
            setResource({
              ...resource,
              module: mod.name,
              canRead: !resource.canRead,
            });
          }}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          name="canDelete"
          checked={mod.canDelete}
          onChange={(e) => {
            clearAlert();
            const element = resources.map((res: any) => {
              return {
                ...res,
                canDelete:
                  res.name === mod.name ? !resource.canDelete : res.canDelete,
              };
            });
            setResources(element);
            setResource({
              ...resource,
              module: mod.name,
              canDelete: !resource.canDelete,
            });
          }}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          name="canRestore"
          checked={mod.canRestore}
          onChange={(e) => {
            clearAlert();
            const element = resources.map((res: any) => {
              return {
                ...res,
                canRestore:
                  res.name === mod.name ? !resource.canRestore : res.canRestore,
              };
            });
            setResources(element);
            setResource({
              ...resource,
              module: mod.name,
              canRestore: !resource.canRestore,
            });
          }}
        />
      </td>
    </tr>
  );
};

export default memo(ResourceItem);
