/*global kakao*/
import React, { useState, useEffect } from 'react';
import { dbService, storageService } from '../fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';
import StarRatingComponent from 'react-star-rating-component';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import './Room.css';
const Room = ({ nweetObj }) => {
  const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [markerData, setMarkerData] = useState([]);
  const [address, setAddress] = useState('');
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      await deleteDoc(NweetTextRef);
      if (nweetObj.attachmentUrl !== '') {
        await deleteObject(ref(storageService, nweetObj.attachmentUrl));
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = async (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const markMarker = () => {
    const container = document.getElementById('myMap');

    const options = {
      center: new kakao.maps.LatLng(37.302788, 127.920039),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    nweetObj.forEach((el) => {
      const content = document.createElement('div');
      const coords = new kakao.maps.LatLng(el.roomLatLan[0], el.roomLatLan[1]);
      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });
      kakao.maps.event.addListener(marker, 'click', function () {
        setMarkerData([]);
        nweetObj.forEach((data) => {
          if (data.roomLatLan[1] == marker.getPosition().getLng().toFixed(12)) {
            setMarkerData((prev) => [...prev, data]);
          }
        });
        setAddress(el.roomAddress);
      });
    });
    map.setCenter(options.center);
  };
  const showBigPicture = (e) => {
    return window.open(e.target.src);
  };
  useEffect(() => {
    markMarker();
  }, [nweetObj]);

  return (
    <>
      <div className='mapWrap'>
        <ProSidebar>
          <SidebarHeader>{address}</SidebarHeader>
          <SidebarContent>
            {markerData.map((data) => (
              <div className='dataWrap'>
                <StarRatingComponent name='rate1' starCount={5} value={data.roomRating} />
                {data.attachmentUrl && <img src={data.attachmentUrl} width='50px' height='50px' onClick={showBigPicture} />}
                <div>{data.roomAdvantage}</div>
                <div>{data.roomDisAdvantage}</div>
              </div>
            ))}
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </ProSidebar>
        <div id='myMap'></div>
      </div>
    </>
  );
};

export default Room;
