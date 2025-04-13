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
    <Container fluid className="px-4 py-3">
      <Header />

      <section className="my-4">
        <BasicInfo taxonId={taxa} />
      </section>

      <section className="my-4">
        <Map taxonId={taxa} />
      </section>

      <section className="my-4">
        <Graph taxonId={taxa} />
      </section>

      <section className="my-4">
        <Summary />
      </section>
    </Container>
  );
}
