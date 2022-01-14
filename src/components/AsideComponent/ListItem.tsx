import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "../../interface/Menu";
import { memo, useCallback, useState, useEffect } from "react";

const ListItem = ({ men }: { men: Menu }) => {
  const location = useLocation();
  const [path, setPath] = useState<string>("");

  const getMenuSelected = useCallback(() => {
    const getNameLocation = location.pathname.substr(1);
    setPath(getNameLocation);
  }, [location.pathname]);

  useEffect(() => {
    getMenuSelected();
  }, [getMenuSelected]);

  return (
    <Link key={men._id} to={men.link} onClick={getMenuSelected}>
      <ListGroup.Item as="li" active={path === men.link ? true : false}>
        {men.name}
      </ListGroup.Item>
    </Link>
  );
};

export default memo(ListItem);
