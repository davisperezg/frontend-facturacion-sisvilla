import { Form } from "react-bootstrap";
import { useState } from "react";

const ItemCheck = ({ area, areas, setAreas, facts }: any) => {
  const [option, setOption] = useState(area);

  return (
    <Form.Check
      type="checkbox"
      label={`Ver ventas de ${area.name}`}
      name="checked"
      checked={area.checked}
      onChange={(e) => {
        const element = areas.map((aux: any) => {
          return {
            ...aux,
            checked: aux.name === area.name ? !option.checked : aux.checked,
          };
        });
        setAreas(element);
        setOption({
          ...option,
          checked: !option.checked,
        });
      }}
    />
  );
};

export default ItemCheck;
