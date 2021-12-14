import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import Room from '../components/Room';
import { dbService } from '../fbase';

const Home = ({ userObj }) => {
  const [rooms, setRooms] = useState([]);

  const getRooms = async () => {
    onSnapshot(query(collection(dbService, 'rooms'), orderBy('createAt', 'desc')), (snapshot) => {
      const roomArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomArray);
    });
  };
  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div>
      <Room roomObj={rooms} />
    </div>
  );
};
export default Home;
