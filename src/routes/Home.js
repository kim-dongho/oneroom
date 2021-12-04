import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import Room from '../components/Room';
import { dbService } from '../fbase';

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    onSnapshot(query(collection(dbService, 'nweets'), orderBy('createAt', 'desc')), (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);

  return (
    <div>
      <div>
        <Room nweetObj={nweets} />
      </div>
    </div>
  );
};
export default Home;
