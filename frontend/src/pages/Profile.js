import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from '../components/Header.js';
import BasicInfo from '../components/BasicInfo.js';
import Map from '../components/Map.js';
import Graph from '../components/Graph.js';
import Summary from '../components/Summary.js';

export default function Profile() {
  const { taxa } = useParams();

  return (
    <Container fluid>
      <Header/>
      <BasicInfo/>
      <Map/>
      <Graph/>
      <Summary/>
    </Container>
  );
}