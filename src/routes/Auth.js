import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../fbase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import AuthForm from '../components/AuthForm';
import './Auth.css';
const Auth = () => {
  const Navigate = useNavigate();
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    Navigate('/');
  };
  return (
    <div className='auth__wrap'>
      <div className='auth__logo'>
        <i class='fas fa-home'></i>
        One Room
      </div>
      <AuthForm />
      <button name='google' onClick={onSocialClick}>
        Continue with Google
        <i class='fab fa-google'></i>
      </button>
    </div>
  );
};

export default Auth;
