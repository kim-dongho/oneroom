/*global kakao*/
import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { addDoc, collection } from '@firebase/firestore';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { dbService, storageService } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import StarRatingComponent from 'react-star-rating-component';
const Enroll = ({ userObj }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [myAddress, setMyAddress] = useState(''); // 주소
  const [advantage, setAdvantage] = useState(''); // 장점
  const [disadvantage, setDisadvantage] = useState(''); // 단점
  const [rating, setRating] = useState(0); // 별점
  const [attachment, setAttachment] = useState('');
  const [latLan, setLatLag] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, 'data_url');
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      roomAddress: myAddress,
      roomRating: rating,
      roomAdvantage: advantage,
      roomDisAdvantage: disadvantage,
      roomLatLan: latLan,

      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, 'nweets'), nweetObj);
    setMyAddress('');
    setAdvantage('');
    setDisadvantage('');
    setAttachment('');
    setRating(0);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === 'address') {
      setMyAddress(value);
    } else if (name === 'advantage') {
      setAdvantage(value);
    } else if (name === 'disadvantage') {
      setDisadvantage(value);
    }
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment('');

  const handleComplete = (data) => {
    const geocoder = new kakao.maps.services.Geocoder();
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    geocoder.addressSearch(fullAddress, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        setLatLag([result[0].y, result[0].x]);
      }
    });
    setMyAddress(fullAddress);
    setIsOpen(false);
  };

  return (
    <>
      <div>
        <button onClick={() => setIsOpen(!isOpen)}>주소찾기</button>
        {isOpen && <DaumPostcode onComplete={handleComplete} />}
        <span>{myAddress}</span>
      </div>
      <form onSubmit={onSubmit}>
        주소
        <input type='text' name='address' placeholder="What's on your mind?" maxLength={120} value={myAddress} onChange={onChange} />
        <br />
        장점
        <input type='text' name='advantage' placeholder="What's on your mind?" maxLength={120} value={advantage} onChange={onChange} />
        <br />
        단점
        <input type='text' name='disadvantage' placeholder="What's on your mind?" maxLength={120} value={disadvantage} onChange={onChange} />
        <br />
        <input type='file' accpet='image/*' onChange={onFileChange} />
        <input type='submit' value='Nweet' />
        {attachment && (
          <div>
            <img src={attachment} width='50px' height='50px' />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
        <div>
          <h2>Rating from state: {rating}</h2>
          <StarRatingComponent name='rate1' starCount={5} value={rating} onStarClick={(nextValue, prevValue, name) => setRating(nextValue)} />
        </div>
      </form>
    </>
  );
};

export default Enroll;
