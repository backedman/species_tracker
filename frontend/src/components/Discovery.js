import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

export default function Discovery(){
    const [taxa, setTaxa] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/random')
          .then(res => res.json())
          .then(data => {
            setTaxa(data.id);
            console.log(data.id);
          });
    }, []);

    return (
        <Container>
            <a href = {`/profile/${taxa}`}>Check out a random species!</a>
        </Container>
    );
}