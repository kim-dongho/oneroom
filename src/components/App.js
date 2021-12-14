import React, { useState, useEffect } from 'react';
import AppRouter from './Router';
import Loading from './Loading';
import { authService } from '../fbase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  return <>{init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : <Loading />}</>;
}

export default App;
