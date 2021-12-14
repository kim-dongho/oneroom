/*global kakao*/
import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { addDoc, collection } from '@firebase/firestore';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';
import { dbService, storageService } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import StarRatingComponent from 'react-star-rating-component';
import Modal from 'react-modal';
import './Enroll.css';

const Enroll = ({ userObj }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [myAddress, setMyAddress] = useState(''); // 주소
  const [advantage, setAdvantage] = useState(''); // 장점
  const [disadvantage, setDisadvantage] = useState(''); // 단점
  const [rating, setRating] = useState(0); // 별점
  const [attachment, setAttachment] = useState(''); // 사진
  const [option, setOption] = useState(''); // 방 옵션
  const [utilities, setUtilities] = useState(''); // 공과금 여부
  const [cost, setCost] = useState(''); // 방 값
  const [etc, setEtc] = useState(''); // 기타
  const [latLan, setLatLag] = useState([]);
  const [fileName, setFileName] = useState('');
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (event) => {
    setDisabled(true);
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, 'data_url');
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const roomObj = {
      roomAddress: myAddress,
      roomRating: rating,
      roomAdvantage: advantage,
      roomDisAdvantage: disadvantage,
      roomLatLan: latLan,
      roomOption: option,
      roomUtilities: utilities,
      roomCost: cost,
      roomEtc: etc,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, 'rooms'), roomObj);
    setMyAddress('');
    setAdvantage('');
    setDisadvantage('');
    setAttachment('');
    setOption('');
    setUtilities('');
    setEtc('');
    setRating(0);
    setDisabled(false);
    setCost('');
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
    } else if (name === 'option') {
      setOption(value);
    } else if (name === 'utilities') {
      setUtilities(value);
    } else if (name === 'etc') {
      setEtc(value);
    } else if (name === 'cost') {
      setCost(value);
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
    setFileName(event.target.files[0].name);
  };

  const onClearAttachment = () => {
    setAttachment('');
    setFileName('');
  };

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
    <div className='enroll'>
      <div className='enroll__wrap'>
        <div className='enroll__text'>
          <i className='fas fa-home fa-2x'></i>
          <span>정보 등록</span>
        </div>
        <form className='enroll__form' onSubmit={onSubmit}>
          <div className='enroll__address'>
            <span>주소</span>
            <input className='field__input' type='text' name='address' placeholder='옆에 검색 버튼 사용' maxLength={120} value={myAddress} onChange={onChange} />
            <button
              type='button'
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <i className='fas fa-search'></i>검색
            </button>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
              <DaumPostcode onComplete={handleComplete} />
            </Modal>
          </div>
          <span>장점 </span>
          <input type='text' name='advantage' placeholder='원룸의 장점' maxLength={120} value={advantage} onChange={onChange} />
          <br />
          <span>단점 </span>
          <input type='text' name='disadvantage' placeholder='원룸의 단점' maxLength={120} value={disadvantage} onChange={onChange} />
          <br />
          <span>옵션 </span>
          <input type='text' name='option' placeholder='풀 옵션' maxLength={120} value={option} onChange={onChange} />
          <br />
          <span>공과금</span>
          <input type='text' name='utilities' placeholder='전기세 / 수도세 / 가스비' maxLength={120} value={utilities} onChange={onChange} />
          <br />
          <span>방값 </span>
          <input type='text' name='cost' placeholder='기간 / 유형 / 보증금 / 가격' maxLength={120} value={cost} onChange={onChange} />
          <br />
          <span>기타 </span>
          <input type='text' name='etc' placeholder='고려사항' maxLength={120} value={etc} onChange={onChange} />
          <div className='filebox'>
            <input className='upload-name' value={fileName} placeholder='사진파일' />
            <label for='file'>파일찾기</label>
            <input type='file' id='file' accpet='image/*' onChange={onFileChange} />
            {attachment && (
              <div>
                <img src={attachment} width='70px' height='70px' />
                <button onClick={onClearAttachment}>
                  <i className='fas fa-trash-alt'></i>
                </button>
              </div>
            )}
          </div>
          <br />
          <div className='enroll__rate'>
            <div>
              <span>추천도 </span>
            </div>
            <StarRatingComponent className='rate' name='rate1' starCount={5} value={rating} onStarClick={(nextValue, prevValue, name) => setRating(nextValue)} />
          </div>
          <input className='form__submit' type='submit' value='등록' disabled={disabled} />
        </form>
      </div>
    </div>
  );
};

export default Enroll;
