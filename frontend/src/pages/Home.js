import { Container, Form, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HighestRisk from '../components/HighestRisk';



export default function Home(){
    const [taxa, setTaxa] = useState('');
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTaxonId, setSelectedTaxonId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        console.log("Selected Taxon ID:", taxa);
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
        <Container fluid className = "d-flex flex-column justify-content-center align-items-center my-5">
            <h1>Species Tracker</h1>
            <p>Track the location of a species and predict the future data/likelihood of it tending towards extinction!</p>
            <Form className = "d-flex flex-row justify-content-center" onSubmit={handleSubmit}>

                <div className="d-flex flex-column position-relative" style={{ width: '300px' }}>
                <Form.Control
                    type = "text"
                    placeholder = "Lookup by Taxa"
                    className = "me-2 col-sm-10"
                    value={taxa}
                    onChange={(e) => setTaxa(e.target.value)}
                    autoComplete="off"
                />
                {suggestions.length > 0 && (
                    <ListGroup className="suggestions-box position-absolute w-100 mt-10" style={{ top: '100%', marginTop: '4px' }}>
                        {suggestions.map((s, i) => (
                        <ListGroup.Item key={i} action onClick={() => handleSuggestionClick(s.taxon_id)}>
                            {s.name}
                        </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
                </div>

                <input className = "btn btn-primary" type="submit" value="Submit"/>
            </Form>
            <HighestRisk/>
        </Container>
    );
}