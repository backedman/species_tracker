import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

export default function BasicInfo({ taxonId }) {
  const [imageUrl, setImageUrl] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taxonId) return;

    fetch(`/image/${taxonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image_url){
          setImageUrl(data.image_url);
          console.log(imageUrl);
        } else {
          setError('No image found.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load image.');
      });
    
    fetch(`/info/${taxonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.genus){
          setInfo(data);
          console.log(info);
        } else {
          setError('No info found.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load info.');
      });
  }, [taxonId]);

  return (
    <Container className="d-flex">
      {imageUrl && (
        <Image
          id="image"
          src={imageUrl}
          width="200"
          height="200"
          rounded
          className="ms-3"
        />
      )}
      <Container>
        <h3 className = "ms-4">{info.name}</h3>
        <p id = "description" className = "ms-4">
          <strong>Class:</strong> {info.genus}<br/>
          <strong>Species:</strong> <em>{info.species}</em><br/>
          <strong>Wikipedia Link:</strong> {info.wikipedia_link}<br/>
        </p>
      </Container>
    </Container>
  );
}
