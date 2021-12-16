/*global kakao*/
import React, { useState, useEffect } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './Room.css';
const Room = ({ roomObj }) => {
  const [markerData, setMarkerData] = useState([]);
  const [address, setAddress] = useState('');
  const [menuCollapse, setMenuCollapse] = useState(true);

  const markMarker = () => {
    const container = document.getElementById('myMap');

    const options = {
      center: new kakao.maps.LatLng(37.302788, 127.920039),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    roomObj.forEach((el) => {
      const coords = new kakao.maps.LatLng(el.roomLatLan[0], el.roomLatLan[1]);
      const marker = new kakao.maps.Marker({
        position: coords,
      });
      marker.setMap(map);
      kakao.maps.event.addListener(marker, 'click', function () {
        setMarkerData([]);
        roomObj.forEach((data) => {
          if (data.roomLatLan[1] == marker.getPosition().getLng().toFixed(12) || data.roomLatLan[1] == marker.getPosition().getLng().toFixed(11)) {
            setMarkerData((prev) => [...prev, data]);
            console.log(data);
          }
        });
        setMenuCollapse(false);
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
  }, [roomObj]);

  return (
    <>
      <div className='mapWrap'>
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className='logotext'>
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? ' ' : address}</p>
            </div>
            <div className='closemenu' onClick={() => setMenuCollapse(!menuCollapse)}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? <i className='fas fa-chevron-right'></i> : <i className='fas fa-chevron-left'></i>}
            </div>
          </SidebarHeader>
          {menuCollapse ? (
            <SidebarContent />
          ) : (
            <SidebarContent>
              {markerData.map((data) => (
                <div className='dataWrap'>
                  <div className='roomdata'>
                    <div>
                      별점 : <StarRatingComponent name='rate' starCount={5} value={data.roomRating} />
                    </div>
                    <div>장점 : {data.roomAdvantage}</div>
                    <div>단점 : {data.roomDisAdvantage}</div>
                    <div>옵션 : {data.roomOption}</div>
                    <div>공과금 : {data.roomUtilities}</div>
                    <div>방값 : {data.roomCost}</div>
                    <div>기타 : {data.roomEtc}</div>
                  </div>
                  <div className='roomphoto'>{data.attachmentUrl && <img src={data.attachmentUrl} width='100px' height='100px' onClick={showBigPicture} />}</div>
                </div>
              ))}
            </SidebarContent>
          )}
          <SidebarFooter>
            <p>Copyright&copy;2021 Oneroom All right reserved</p>
          </SidebarFooter>
        </ProSidebar>
        <div id='myMap'></div>
      </div>
    </>
  );
};

export default Room;
