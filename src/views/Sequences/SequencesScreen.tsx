import { useCallback, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { getSequences } from "../../api/sequence/sequence";
import SequenceForm from "../../components/SequenceComponent/Form/SequenceForm";
import SequenceList from "../../components/SequenceComponent/List/SequenceList";
import { Sequence } from "../../interface/Sequence";

const SequencesScreen = () => {
  const [show, setShow] = useState(false);
  const [state, setState] = useState<any>();
  const [sequences, setSequences] = useState<Sequence[]>([]);

  const openModalRE = useCallback((props: boolean, value?: any) => {
    setShow(true);
    if (props) {
      setState({ ...value, area: value.area.name });
    }
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
    setState({});
  }, []);

  const listSequences = useCallback(async () => {
    const res = await getSequences();
    const { data } = res;
    setSequences(data);
  }, []);

  useEffect(() => {
    listSequences();
  }, [listSequences]);

  return (
    <>
      <Card>
        <Card.Header as="h5">Tus secuencias por area</Card.Header>
        <Card.Body>
          <Button
            type="button"
            variant="primary"
            onClick={() => openModalRE(false)}
          >
            Agregar nueva secuencia
          </Button>
          <SequenceForm
            show={show}
            closeModal={closeModal}
            listSequences={listSequences}
            sequence={state}
          />

          <Table striped bordered hover responsive="sm" className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Area</th>
                <th>Secuencia</th>
              </tr>
            </thead>
            <tbody>
              {sequences.map((sequence) => (
                <SequenceList
                  key={sequence._id}
                  sequence={sequence}
                  openModalRE={openModalRE}
                />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default SequencesScreen;
