import { Card, Form, Row, Button, Col } from "react-bootstrap";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <Card>
      <Card.Header as="h5">Registro de Roles</Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Introduce nombre" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Introduce descripción" />
            </Form.Group>
          </Row>
          <div className={styles.button}>
            <Button type="submit" variant="primary">
              Registrar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Dashboard;
