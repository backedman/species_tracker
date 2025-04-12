import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';

export default function Header() {
  return (
    <Navbar sticky = "top"> 
      <Container className = "justify-content-start ms-3">
        <NavbarBrand><strong>Species Tracker</strong></NavbarBrand>
        <Nav.Link href = "/" className = "ms-3">Home</Nav.Link>
        <Nav.Link className = "ms-4">All Taxa</Nav.Link>
        <Form className = "d-flex">
          <Form.Control type = "text" placeholder = "Lookup by Taxa" className = "ms-4 me-2 col-sm-10"/>
          <input className ="btn btn-primary" type="submit" value="Submit"/>
        </Form>
      </Container>
    </Navbar>
  );
}