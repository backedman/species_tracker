import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

export default function BasicInfo({ taxonId }) {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    
    
    if (!taxonId) return;

    fetch(`/image/${taxonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image_url) setImageUrl(data.image_url);
        else setError('No image found.');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load image.');
      });

      fetch(`/info/${taxonId}`)
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
        <h3 className = "ms-4">Taxa Name</h3>
        <p id = "description" className = "ms-4">
            INSERT PROFILE TEXT HERE
        </p>
      </Container>
    </Container>
  );
}
