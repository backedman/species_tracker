import { useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import BasicInfo from '../components/BasicInfo.js';
import Map from '../components/Map.js';
import Graphs from '../components/Graphs.js';
import Summary from '../components/Summary.js';

export default function Profile() {
  const { taxa } = useParams();

  return (
    <>
      <Header/>
      <BasicInfo taxonId={taxa} />
      <p>test</p>
    </>
  );
}