import { useState } from "react";
import { Form } from "react-bootstrap";
import { InputChange } from "../../../lib/types/types";

const Search = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const [search, setSearch] = useState("");

  const onInputChange = (e: InputChange) => {
    const value = e.target.value;
    onSearch(value);
    setSearch(value);
  };
  return (
    <Form.Control
      type="text"
      className="form-control"
      style={{ width: "280px" }}
      placeholder="Buscar por producto o código interno"
      value={search}
      onChange={onInputChange}
    />
  );
};

export default Search;
