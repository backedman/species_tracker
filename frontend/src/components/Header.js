import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';

export default function Header() {
  return (
    <Navbar sticky = "top" class = "navbar Header">
      <Container className = "justify-content-start">
        <NavbarBrand><strong>Species Tracker</strong></NavbarBrand>
        <Nav>Discover</Nav>
        <Form className = "d-flex">
          <Form.Control type = "text" placeholder = "Lookup by Taxa" className = "ms-3 me-2 col-sm-10"/>
          <input class="btn btn-primary" type="submit" value="Submit"/>
        </Form>
      </Container>
    </Navbar>
  );
}