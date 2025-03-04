import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css';
import HomeComponent from './Components/Home/HomeComponent';
import Navbar from './Components/Navbar/NavComponent';
import LoginComponent from './Components/Login/LoginComponen';
import SignUpCompoenet from './Components/Signup/SignupComponent';
import AboutComponent from './Components/About/AboutComponent';
import ContactComponent from './Components/Contact/ContactComponent';
import ProfilePage from './Components/Profile/ProfileComponent';
import VisaInterviewQA from './Components/visaQA/VisaInterviewQA';

const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
    <Routes>
    <Route path='/' element={<HomeComponent/>}/>
    <Route path='/about' element={<AboutComponent/>}/>
    <Route path='/contact' element={<ContactComponent/>}/>
    <Route path='/qa' element={<VisaInterviewQA/>}/>
    <Route path='/profile' element={<ProfilePage/>}/>
    <Route path='/login' element={<LoginComponent/>}/>
    <Route path='/signup' element={<SignUpCompoenet/>}/>
    </Routes>
    </Router>

    </>
  );
};

export default App;
