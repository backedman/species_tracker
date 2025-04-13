import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Header from '../components/Header';
import BasicInfo from '../components/BasicInfo';
import Map from '../components/Map';
import Graph from '../components/Graph';
import Summary from '../components/Summary';

export default function Profile() {
  const { taxa } = useParams();

  return (
    <Container fluid>
      <Header />
      <BasicInfo taxonId={taxa} />
      <Map taxonId={taxa} />
      <Graph taxonId={taxa}/>
      <Summary />
    </Container>
  );
}
