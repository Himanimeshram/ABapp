import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import Signup from './components/UserSignUp';
import CompanySignup from './components/CompanySignup';
import BookAppointment from './components/BookAppointment';
import Logout from './components/Logout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/UserDetails" element={<UserDetails />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/CompanySignup" element={<CompanySignup />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
        <Route path="/Logout" element={<Logout/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
