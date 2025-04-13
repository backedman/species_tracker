import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, NavbarBrand, Form, Nav, ListGroup } from 'react-bootstrap';

export default function Header() {
  const [taxa, setTaxa] = useState('');
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (taxa.trim()) {
      navigate(`/profile/${taxa}`);
    }
  };

  useEffect(() => {
    if (taxa.length > 1) {
    
      fetch(`/animal?query=${taxa}`)
        .then(res => res.json())
        .then(data => {
            console.log("Suggestions fetched:", data);
            setSuggestions(data)});
    } else {
      setSuggestions([]);
    }
  }, [taxa]);

  const handleSuggestionClick = (id) => {
    setTaxa("" + id);
    setSuggestions([]);
  };

  return (
    <Navbar sticky="top">
      <Container className="justify-content-start ms-3">
        <NavbarBrand><strong>Species Tracker</strong></NavbarBrand>
        <Nav.Link href = "/" className = "ms-3">Home</Nav.Link>
        <Nav.Link className = "ms-4">All Taxa</Nav.Link>
        <Form className="d-flex" onSubmit={handleSubmit}>

        <div className="d-flex flex-column position-relative" style={{ width: '300px' }}>
          <Form.Control
            type="text"
            placeholder="Lookup by Taxa"
            className="ms-4 me-2 col-sm-10"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
                <ListGroup className="suggestions-box position-absolute w-50 mt-10" style={{ top: '100%', marginTop: '4px' }}>
                    {suggestions.map((s, i) => (
                    <ListGroup.Item key={i} action onClick={() => handleSuggestionClick(s.taxon_id)}>
                      {s.name}
                  </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          <input className="btn btn-primary ms-4" type="submit" value="Submit" />
        </Form>
      </Container>
    </Navbar>
  );
}
