import Container from 'react-bootstrap/Container';

export default function Graphs({ taxonId }) {
  return (
    <Container className="py-4">
      <h2 className="mb-3">Population Forecast</h2>
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
