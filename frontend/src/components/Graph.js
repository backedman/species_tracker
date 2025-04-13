import Container from 'react-bootstrap/Container';

export default function Graphs({ taxonId }) {
  return (
    <Container fluid className="ms-4 py-4">
      <h4 className="ms-2 mb-3">Population Forecast</h4>
      <iframe
        title={`Population Graph for Taxon ${taxonId}`}
        src={`http://localhost:5000/graph/${taxonId}`}
        width="100%"
        height="500"
        style={{ border: 'none' }}
      />
    </Container>
  );
}
