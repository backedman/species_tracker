import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js'
import List from './pages/List.js'

export default function App(){
  return (
    <Container fluid>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Home/>}/>
          <Route path = "/profile/:taxa" element = {<Profile/>}/>
          <Route path = "/list" element = {<List/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}