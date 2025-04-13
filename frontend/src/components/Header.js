import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, NavbarBrand, Form, Nav } from 'react-bootstrap';

export default function Header() {
  const [taxa, setTaxa] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (taxa.trim()) {
      navigate(`/profile/${taxa}`);
    }
  };

  return (
    <Navbar sticky="top">
      <Container className="justify-content-start ms-3">
        <NavbarBrand><strong>Species Tracker</strong></NavbarBrand>
        <Nav>Discover</Nav>
        <Form className="d-flex" onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Lookup by Taxa"
            className="ms-3 me-2 col-sm-10"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
          />
          <input className="btn btn-primary" type="submit" value="Submit" />
        </Form>
      </Container>
    </Navbar>
  );
}
