import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import React, { useState } from 'react';
import { authService } from '../fbase';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        //create Account
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        //Log In
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
      setIsSubmit(true);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    if (isSubmit) {
      Navigate('/');
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  return (
    <div className='auth__submit'>
      <form className='auth__form' onSubmit={onSubmit}>
        <input name='email' type='email' placeholder='Email' required value={email} onChange={onChange}></input>
        <input name='password' type='password' placeholder='Password' required value={password} onChange={onChange} />
        <input type='submit' value={newAccount ? '계정 만들기' : '로그인'} />
        {error}
      </form>
      <button onClick={toggleAccount}>{newAccount ? '로그인' : '계정 만들기'}</button>
    </div>
  );
};

export default AuthForm;
