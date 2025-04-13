import { Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HighestRisk from '../components/HighestRisk';

export default function Home(){
    const [taxa, setTaxa] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        if (taxa.trim()) {
            navigate(`/profile/${taxa}`);
        }
    };

    return (
        <Container fluid className = "d-flex flex-column justify-content-center align-items-center my-5">
            <h1>Species Tracker</h1>
            <p>Track the location of a species and predict the future data/liklihood of it tending towards extinction!</p>
            <Form className = "d-flex flex-row justify-content-center" onSubmit={handleSubmit}>
                <Form.Control
                    type = "text"
                    placeholder = "Lookup by Taxa"
                    className = "me-2 col-sm-10"
                    value={taxa}
                    onChange={(e) => setTaxa(e.target.value)}
                />
                <input className = "btn btn-primary" type="submit" value="Submit"/>
            </Form>
            <HighestRisk/>
        </Container>
    );
}