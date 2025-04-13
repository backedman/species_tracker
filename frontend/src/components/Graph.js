import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Graphs({ taxonId }) {
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/prediction/${taxonId}`)
      .then((res) => {
        console.log("Raw response:", res);
        return res.json();  // this is likely where it's throwing
      })
      .then((data) => {
        console.log("Parsed JSON:", data);
        setPrediction(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setPrediction("Failed to load prediction.");
      });
  }, [taxonId]);
  
  return (
    <Container fluid className="py-4">
      <h2 className="mb-3">Population Forecast</h2>
      <Row>
        <Col md={9}>
          <iframe
            title={`Population Graph for Taxon ${taxonId}`}
            src={`http://localhost:5000/graph/${taxonId}`}
            width="100%"
            height="500"
            style={{ border: 'none' }}
          />
        </Col>
        <Col md={3} className="d-flex">
          <div>
            <h5>Prediction Summary</h5>
            {prediction && (
  <div>
    {console.log("Prediction:", prediction)}
    <p>5-Year Prediction: {prediction[0].pred_5yr ? "Extinct" : "Survives"} (Confidence: {Math.round(prediction[0].confidence_5yr*1000)/10})</p>
    <p>10-Year Prediction: {prediction[0].pred_10yr ? "Extinct" : "Survives"} (Confidence: {Math.round(prediction[0].confidence_10yr*1000)/10})</p>
  </div>
)} {/* Use <pre> for nice formatting of plain text */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
