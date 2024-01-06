import React, { useEffect, useState } from 'react';
import './KakaoMap.css';

function KakaoMap() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        if (window.kakao) {
          const container = document.getElementById('kakaomap');
          const options = {
            center: new window.kakao.maps.LatLng(37.5051, 126.9571),
            level: 3
          };
          const map = new window.kakao.maps.Map(container, options);
    
          const positions = [
            {
              content: '<div class="wrap">' +
              '    <div class="info">' +
              '        <div class="title">' +
              '            미니자이언트' +
              '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
              '        </div>' +
              '        <div class="body">' +
              '            <div class="img">' +
              '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="53" height="50">' +
              '           </div>' +
              '            <div class="desc">' +
              '                <div class="ellipsis">흑석로 81-6 1층</div>' +
              '                <div class="jibun ellipsis">대표메뉴</div>' +
              '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' +
              '            </div>' +
              '        </div>' +
              '    </div>' +
              '</div>',
              latlng: new window.kakao.maps.LatLng(37.5072, 126.9586)
            },
          ];
    
          for (let pos of positions) {
            let marker = new window.kakao.maps.Marker({
                map: map,
                position: pos.latlng,
                // clickable: true
            });

            let overlay = new window.kakao.maps.CustomOverlay({
                content: pos.content,
                map: map,
                position: marker.getPosition()
            })
    
            window.kakao.maps.event.addListener(marker, 'click', () => overlay.setMap(map));
            window.closeOverlay = () => overlay.setMap(null);
          }
        }
      }, []);

    return (
        <div id="kakaomap" />
    );
}

export default KakaoMap;