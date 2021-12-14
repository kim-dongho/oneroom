import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../fbase';
import { collection, query, where, getDocs, deleteDoc, doc } from '@firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';
import './Profile.css';
const Profile = ({ userObj }) => {
  const [roomData, setRoomData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteClick = async (event) => {
    const {
      target: { value, name },
    } = event;
    const RoomTextRef = doc(dbService, 'rooms', `${event.currentTarget.value}`);
    const urlRef = ref(storageService, event.currentTarget.name);
    const ok = window.confirm('삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(RoomTextRef);
      await deleteObject(urlRef);
      window.location.href = '/';
    }
  };
  const getMyRooms = async () => {
    setRoomData([]);
    const q = query(collection(dbService, 'rooms'), where('creatorId', '==', userObj.uid));
    const querySnapshot = await getDocs(q);
    const roomArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRoomData(roomArray);
  };

  useEffect(() => {
    getMyRooms();
  }, [userObj]);

  return (
    <div className='profile'>
      <div className='profile__text'>
        <i className='fas fa-home fa-2x'></i>
        <span>내 등록정보</span>
      </div>
      <div className='profile__wrap'>
        {roomData.map((data) => (
          <div className='profile__wrap__data'>
            <ul>
              <li className='profile__address'>
                {data.roomAddress}
                <button id={data.createAt} name={data.createAt} onClick={() => setIsOpen(!isOpen)}>
                  <i className='fas fa-caret-down'></i>
                </button>
                <button value={data.id} name={data.attachmentUrl} onClick={onDeleteClick}>
                  <i className='fas fa-trash-alt'></i>
                </button>
              </li>
              {isOpen && (
                <>
                  <li>장점 : {data.roomAdvantage}</li>
                  <li>단점 : {data.roomDisAdvantage}</li>
                  <li>옵션 : {data.roomOption}</li>
                  <li>공과금 : {data.roomUtilities}</li>
                  <li>기타 : {data.roomEtc}</li>
                </>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
