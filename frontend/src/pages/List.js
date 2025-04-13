import Container from 'react-bootstrap/Container';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function List() {

  const [taxaList, setTaxaList] = useState([]);

  useEffect(() => {
    fetch('/all_taxa')
      .then(res => res.json())
      .then(data => setTaxaList(data));
  }, []);
  return (
    <Container fluid>
      <Header />
      <Container>
        <h2 className="ms-3 my-4">All Taxa</h2>
        <ul>
            {taxaList.map((taxon, index) => (
            <li key={index}>
                {taxon.name} - <Link to={`/profile/${taxon.taxon_id}`}>{taxon.taxon_id}</Link>
            </li>
            ))}
        </ul>
      </Container>
    </Container>
  );
}
