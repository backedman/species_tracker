import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

export default function Home(){
    return (
        <Container className = "d-flex flex-column justify-content-center align-items-center my-5">
            <h1>Species Tracker</h1>
            <p>Track the location of a species and predict the future data/liklihood of it tending towards extinction!</p>
            <Form className = "d-flex flex-row justify-content-center">
                <Form.Control type = "text" placeholder = "Lookup by Taxa" className = "me-2 col-sm-10"/>
                <input class="btn btn-primary" type="submit" value="Submit"/>
            </Form>
        </Container>
    );
}