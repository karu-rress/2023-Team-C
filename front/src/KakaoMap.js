import React, { useEffect, useState } from 'react';
import { BACKEND_API } from './config';
import './KakaoMap.css';

const kakao_map = window.kakao.maps;

// 처음 지도가 표시될 때의 위치
const initPos = new window.kakao.maps.LatLng(37.5051, 126.9571);

const markers = [];
let index = 0;

/**
 * addMarker의 wrapper 함수
 * @param {window.kakao.maps.Map} map
 * @param {object} restaurants 
 */
function addMarkersFromRestaurants(map, restaurants) {
    for (let res of restaurants) {
        addMarker(map, res.name, res.signature, res.phone,
            new kakao_map.LatLng(res.latitude, res.longitude),
            {
                open: res.openTime == null ? null : new Date(res.openTime),
                close: res.closeTime == null ? null : new Date(res.closeTime),
                breakStart: res.breakStart == null ? null : new Date(res.breakStart),
                breakEnd: res.breakEnd  == null ? null : new Date(res.breakEnd),
            },
            res);
    }
}

/**
 * 마커를 추가하는 함수
 * @param {window.kakao.maps.Map} map 
 * @param {string} name 
 * @param {string} signature 
 * @param {string} phone 
 * @param {kakao_map.LatLng} latlng
 * @param {{open: Date, close: Date, breakStart: Date, breakEnd: Date}} time
 * @param {object} restaurant
 */
function addMarker(map, name, signature, phone, latlng, time, restaurant) {
    const current_time = new Date();
    current_time.setFullYear(1970, 0, 1); // 현재 시간
    current_time.setHours(current_time.getHours() + 9);
    let isOpened = false;

    if (time == null || !time.open) { // 영업시간 데이터가 없는 경우, 항상 영업중인 것으로 간주
        isOpened = true;
    }
    else if (!time.breakStart) { // 휴식 시간 데이터가 없는 경우, 운영 시간만 확인
        isOpened = (current_time >= time.open && current_time <= time.close);
    }
    else {
        isOpened = (current_time >= time.open && current_time <= time.breakStart)
            || (current_time >= time.breakEnd && current_time <= time.close);
    }

    // 맛집 표시 마커
    const marker = new window.kakao.maps.Marker({
        map: map,
        position: latlng,
    });

    // 맛집 오버레이
    const overlay = new window.kakao.maps.CustomOverlay({
        content: `<div class="wrap">
        <div class="info">
            <div class="title">
            ${name}
            <div class="add-description-btn"></div>
            <div class="close" title="닫기"></div>
            </div>
            <div class="body">
            <div class="desc">
                <div class="signature">${signature}</div>
                <div class="opened">${isOpened ? "영업중" : "영업종료"}</div>
                <div class="phone">${phone}</div>
            </div>
            </div>
        </div>
        </div>`,
        map: map,
        position: marker.getPosition()
    })

    // + 버튼 클릭시, 추가 설명 오버레이를 보여주는 함수 호출
    const addButton = document.querySelector('.add-description-btn');
    if (addButton) {
        addButton.onclick = () => showDescription(map, marker, restaurant);
    }

    // .title 클래스를 가진 요소가 있는지 확인 후 추가
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        titleElement.appendChild(addButton);
    }

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.onclick = () => overlay.setMap(null);
    }

    window.kakao.maps.event.addListener(marker, 'click',
        () => overlay.setMap(overlay.getMap() ? null : map));

    overlay.setMap(null);
}



/*

[
    {
        "name": "스시톡톡",
        "signature": "초밥",
        "allowOne": true,
        "allowMulti": false,
        "category": "일식",
        "distance": 0.651,
        "phone": "02-812-5565    ",
        "address": "흑석로 109 2층",
        "latitude": 37.5083,
        "longitude": 126.9611,
        "openTime": "1970-01-01T11:00:00.000Z",
        "closeTime": "1970-01-01T22:00:00.000Z",
        "breakStart": "1970-01-01T15:30:00.000Z",
        "breakEnd": "1970-01-01T17:00:00.000Z"
    }
]
*/


/**
 * 
 * @param {window.kakao.maps.Map} map 
 * @param {*} marker 
 * @param {object} restaurant 
 */
function showDescription(map, marker, restaurant) {
    const descriptionOverlay = new window.kakao.maps.CustomOverlay({
        content: `<div class="expanded-overlay">
        <div class="info">
        <div class="title">
        ${restaurant.name}
        <div class="close" title="닫기"></div>
        </div>
        <div class="body">
        <div class="desc">
        <p>${restaurant.signature}<br>
        ${restaurant.address}</p>
        </div>
        </div>
        </div>
        </div>`,
        map: map,
        position: marker.getPosition()
    });
    

    // <저 dic class="desc"와 가장 가까운 </div> 사이에 <p></p> 써서 상세정보 넣으면 될듯
    // restaurant 안에 뭐가 들었는지는 위에 작성해둔 주석 참고

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.onclick = () => descriptionOverlay.setMap(null);
    }

    // eval(`window.closeDescription${index} = () => { descriptionOverlay.setMap(null); }`);
    descriptionOverlay.setMap(map);
}


/**
 * path에 해당하는 데이터를 GET 하여 반환하는 함수
 * @param {string} path TastyNav API 경로
 * @returns {[number, null | object]} status code 및 파싱한 object
 */
async function fetchAsync(path) {
    try {
        const response = await fetch(BACKEND_API + path);
        if (response.status >= 400)
            return [response.status, null];
        return [response.status, await response.json()];
    }
    catch (err) {
        alert('에러가 발생했습니다.\n' + err);
    }
}

function KakaoMap({ search, category }) {
    useEffect(() => {
        if (!window.kakao) {
            alert('카카오맵 API 오류입니다.');
            return;
        }
        index = 0;

        // 카카오맵 API 기본 설정
        const container = document.getElementById('kakaomap');
        const options = {
            center: initPos,
            level: 4
        };
        const map = new kakao_map.Map(container, options);

        if (search) {
            fetchAsync('/search/' + search).then(([status, restaurants]) => {
                if (status === 404) {
                    alert('검색 결과가 없습니다.');
                    return; // 검색 결과 없으면 마커 생성 중단
                }
                addMarkersFromRestaurants(map, restaurants);
            });
        }
        else if (category) {
            fetchAsync('/category/' + category).then(([status, restaurants]) => {
                if (status === 404) {
                    alert('검색 결과가 없습니다.');
                    return; // 검색 결과 없으면 마커 생성 중단
                }
                addMarkersFromRestaurants(map, restaurants);
            });
        }
        else {
            fetchAsync('/getall').then(([_, restaurants]) => {
                addMarkersFromRestaurants(map, restaurants);
            });
        }
    }, [search, category]); // search 또는 category가 갱신될 때마다 마커 다시 그리기

    return (
        <div id="kakaomap"/>
    );
}

export default KakaoMap;