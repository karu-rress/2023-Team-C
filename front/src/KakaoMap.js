import React, { useEffect, useState } from 'react';
import './KakaoMap.css';

function KakaoMap() {
    useEffect(() => {
        // Kakao 객체가 사용 가능한지 확인합니다.
        if (window.kakao) {
          const container = document.getElementById('kakaomap');
          const options = {
            center: new window.kakao.maps.LatLng(37.5051, 126.9571),
            level: 3
          };
          const map = new window.kakao.maps.Map(container, options);
    
          const positions = [
            {
              content: '<div class="marker-content">미니자이언트</div>',
              latlng: new window.kakao.maps.LatLng(37.5072, 126.9586)
            },
            {
              content: '<div class="marker-content">미묘라멘</div>',
              latlng: new window.kakao.maps.LatLng(37.508, 126.9626)
            },
            {
              content: '<div class="marker-content">미소야</div>',
              latlng: new window.kakao.maps.LatLng(37.5085, 126.9611)
            },
            {
              content: '<div class="marker-content">미스사이공</div>',
              latlng: new window.kakao.maps.LatLng(37.5034, 126.9489)
            }
          ];
    
          for (let pos of positions) {
            let marker = new window.kakao.maps.Marker({
              map: map,
              position: pos.latlng
            });
    
            let infowindow = new window.kakao.maps.InfoWindow({
              content: pos.content
            });
    
            window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
          }
    
          function makeOverListener(map, marker, infowindow) {
            return function () {
              infowindow.open(map, marker);
            };
          }
    
          function makeOutListener(infowindow) {
            return function () {
              infowindow.close();
            };
          }
        }
      }, []);

    return (
        <div id="kakaomap" />
    );
}

export default KakaoMap;