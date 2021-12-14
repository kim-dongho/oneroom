import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Profile from '../routes/Profile';
import Navigation from './Navigation';
import Enroll from '../routes/Enroll';

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} userObj={userObj} />
      <Routes>
        <Route exact path='/enroll' element={<Enroll userObj={userObj} />} />
        <Route exact path='/profile' element={<Profile userObj={userObj} />} />
        <Route exact path='/auth' element={<Auth userObj={userObj} />} />
        <Route exact path='/' element={<Home userObj={userObj} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
