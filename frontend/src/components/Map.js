import React from "react";
import Container from 'react-bootstrap/Container';

export default function Map({ taxonId }) {
  return (
    <Container fluid className = "mt-3 ms-4">
      <iframe
        title="Folium Map"
        src={`http://localhost:5000/map/${taxonId}`} // Dynamically loads the map for the given taxonId
        width="100%"
        height="100%"
        style={{ border: 0 }}
      />
    </Container>
  );
}
