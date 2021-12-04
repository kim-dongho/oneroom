import React, { useEffect, useState } from 'react';
import { authService, dbService } from '../fbase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, deleteDoc } from '@firebase/firestore';
import { deleteObject } from '@firebase/storage';
const Profile = ({ userObj }) => {
  const Navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    Navigate('/');
  };
  const getMyNweets = async () => {
    const q = query(collection(dbService, 'nweets'), where('creatorId', '==', userObj.uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  return (
    <>
      <form>
        <input type='text' placeholder='Display Name' />
        <input type='submit' value='Update Profile' />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
