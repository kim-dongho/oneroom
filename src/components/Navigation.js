import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../fbase';
import './Navigation.css';
const Navigation = ({ userObj, isLoggedIn }) => {
  const Navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setIsActive(!isActive);
    } else {
      setIsActive(false);
    }
  };
  const changeState = (e) => {
    if (isLoggedIn) {
      authService.signOut();
      Navigate('/');
    } else {
      Navigate('/auth');
    }
  };
  const moveHome = () => {
    Navigate('/');
  };
  const moveEnroll = () => {
    if (isLoggedIn) {
      Navigate('/enroll');
    } else {
      alert('로그인 후 이용할 수 있습니다.');
      Navigate('/auth');
    }
  };
  const moveProfile = () => {
    if (isLoggedIn) {
      Navigate('/profile');
    } else {
      alert('로그인 후 이용할 수 있습니다.');
      Navigate('/auth');
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleToggle);
    return () => {
      window.removeEventListener('resize', handleToggle);
    };
  }, []);

  return (
    <nav className='navbar'>
      <div className='navbar__logo'>
        <i className='fas fa-home'></i>
        <Link to='/'>One Room</Link>
      </div>
      <ul className={isActive ? 'navbar__menu__active' : 'navbar__menu'}>
        <li onClick={moveHome}>
          <span>홈</span>
        </li>
        <li onClick={moveEnroll}>
          <span>정보 등록</span>
        </li>
        <li>
          <span onClick={moveProfile}>내 등록정보</span>
        </li>
      </ul>
      <div className={isActive ? 'navbar__button__active' : 'navbar__button'}>
        <span onClick={changeState}>{isLoggedIn ? '로그아웃' : '로그인'}</span>
      </div>
      <a herf='#' className='navbar__toggleBtn'>
        <i className='fas fa-bars' onClick={handleToggle}></i>
      </a>
    </nav>
  );
};

export default Navigation;
