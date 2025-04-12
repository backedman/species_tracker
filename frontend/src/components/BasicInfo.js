import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

export default function BasicInfo() {
  return (
    <Container className = "d-flex content">
        <Image id = "image" width = "200" height = "200" rounded className = "ms-3"/>
        <Container>
            <h3 className = "ms-4">Taxa Name</h3>
            <p id = "description" className = "ms-4">
                INSERT PROFILE TEXT HERE
            </p>
        </Container>
    </Container>
  );
}