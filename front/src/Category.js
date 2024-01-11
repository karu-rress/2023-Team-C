import React, { useState } from "react";
import  "./Category.css";

function Category() {
  const menuLst = ["menu1"];
  const [hide, setHide] = useState({
    menu1: false,
  });
  const mouseEvent = (menuName, bool) => {
    const change = { ...hide };
    change[menuName] = bool;
    setHide(change);
  };
  
  return (
    <nav className="nav">
      <ul className="navContainer">
        {menuLst.map((v, idx) => (
          <li
            className={hide[v] ? "active" : "none"}
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <p>{`카테고리`}</p>
          </li>
        ))}
      </ul>

      <div className="detailMenu">
        {menuLst.map((v, idx) => (
          <ul
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <li>{`한식`}</li>
            <li>{`일식`}</li>
            <li>{`중식`}</li>
            <li>{`양식`}</li>
            <li>{`분식`}</li>
            <li>{`기타`}</li>
          </ul>
        ))}
      </div>
    </nav>
  );
};

export default Category;


<div class="map_wrap">
    <div id="map" style="width:100%;height:100%;position:relative;overflow:hidden;"></div>
    <ul id="category">
        <li id="한식" data-order="0"> 
            <span class="category_bg bank"></span>
            한식
        </li>       
        <li id="MT1" data-order="1"> 
            <span class="category_bg mart"></span>
            일식        </li>  
        <li id="PM9" data-order="2"> 
            <span class="category_bg pharmacy"></span>
            중식
        </li>  
        <li id="OL7" data-order="3"> 
            <span class="category_bg oil"></span>
            주유소
        </li>  
        <li id="CE7" data-order="4"> 
            <span class="category_bg cafe"></span>
            카페
        </li>  
        <li id="CS2" data-order="5"> 
            <span class="category_bg store"></span>
            편의점
        </li>      
    </ul>
</div>


// 각 카테고리에 클릭 이벤트를 등록합니다
addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
  if (target.addEventListener) {
      target.addEventListener(type, callback);
  } else {
      target.attachEvent('on' + type, callback);
  }
}

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {
  if (!currCategory) {
      return;
  }
  
  // 커스텀 오버레이를 숨깁니다 
  placeOverlay.setMap(null);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();
  
  ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {

      // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
      displayPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요

  } else if (status === kakao.maps.services.Status.ERROR) {
      // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      
  }
}

// 지도에 마커를 표출하는 함수입니다
function displayPlaces(places) {

  // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
  // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
  var order = document.getElementById(currCategory).getAttribute('data-order');

  

  for ( var i=0; i<places.length; i++ ) {

          // 마커를 생성하고 지도에 표시합니다
          var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

          // 마커와 검색결과 항목을 클릭 했을 때
          // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
          (function(marker, place) {
              kakao.maps.event.addListener(marker, 'click', function() {
                  displayPlaceInfo(place);
              });
          })(marker, places[i]);
  }
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, order) {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
      imgOptions =  {
          spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
      });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker);  // 배열에 생성된 마커를 추가합니다

  return marker;
}


// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for ( var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
  }   
  markers = [];
}


// 각 카테고리에 클릭 이벤트를 등록합니다
function addCategoryClickEvent() {
  var category = document.getElementById('category'),
      children = category.children;

  for (var i=0; i<children.length; i++) {
      children[i].onclick = onClickCategory;
  }
}


// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickCategory() {
  var id = this.id,
      className = this.className;

  placeOverlay.setMap(null);

  if (className === 'on') {
      currCategory = '';
      changeCategoryClass();
      removeMarker();
  } else {
      currCategory = id;
      changeCategoryClass(this);
      searchPlaces();
  }
}



// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
  var category = document.getElementById('category'),
      children = category.children,
      i;

  for ( i=0; i<children.length; i++ ) {
      children[i].className = '';
  }

  if (el) {
      el.className = 'on';
  } 
} 
