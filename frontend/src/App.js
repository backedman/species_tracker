import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js'

export default function App(){
  return (
    <Container fluid>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Profile/>}/>
          <Route path = "/profile/:taxa" element = {<Profile/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}