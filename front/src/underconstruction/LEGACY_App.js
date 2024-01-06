import React, { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import SearchBox from './SearchBox';

import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Kakao Maps API 스크립트 추가
    const script = document.createElement('script');
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=';
    document.head.appendChild(script);

    script.onload = () => {
      // Kakao Maps API 초기화
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5051, 126.9571),
          level: 3
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(37.5072, 126.9586)
        });

        const content = '<div class="wrap">' +
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
          '</div>';

        const overlay = new window.kakao.maps.CustomOverlay({
          content: content,
          map: map,
          position: marker.getPosition()
        });

        window.kakao.maps.event.addListener(marker, 'click', function () {
          overlay.setMap(map);
        });

        window.closeOverlay = function () {
          overlay.setMap(null);
        };
      });
    };
  }, []);
  const handleSearch = (searchTerm) => {
    console.log('검색어:', searchTerm);
    setSearchResult(`검색 결과: ${searchTerm}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // 여기에 음식 카테고리에 따른 검색 로직 추가 가능
  };

  return (
    <div>
    

      {/* 음식 카테고리 선택용 드롭다운 메뉴 추가 */}
      <DropdownMenu
        categories={['한식', '중식', '일식', '양식', '기타']}
        onCategoryChange={handleCategoryChange}
      />

      {/* 검색창 추가 */}
      <SearchBox onSearch={handleSearch} />

      {/* 음식 카테고리와 검색 결과 표시 */}
      <div>
        {selectedCategory && <p>선택된 음식 카테고리: {selectedCategory}</p>}
        {searchResult && <div>{searchResult}</div>}
      </div>

      {/* Kakao 지도 */}
      <div id="map" style={{ width: '500px', height: '400px' }} />
    </div>
  );
}

export default App;