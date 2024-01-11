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
        map: map,
        position: marker.getPosition()
    })

    const wrapDiv = document.createElement('div');
    wrapDiv.className = 'wrap';
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'title';
                const addButton = document.createElement('div');
                addButton.className = 'add-description-btn';
                addButton.onclick = () => showDescription(map, marker, restaurant);
                const closeButton = document.createElement('div');
                closeButton.className = 'close';
                closeButton.onclick = () => overlay.setMap(null);
            titleDiv.appendChild(document.createTextNode(name));
            titleDiv.appendChild(addButton);
            titleDiv.appendChild(closeButton);

            const bodyDiv = document.createElement('div');
            bodyDiv.className = 'body';
                const descDiv = document.createElement('div');
                descDiv.className = 'desc';
                    const sigDiv = document.createElement('div');
                    sigDiv.appendChild(document.createTextNode(signature));
                    const openedDiv = document.createElement('div');
                    openedDiv.appendChild(document.createTextNode(isOpened ? "영업중" : "영업종료"));
                    openedDiv.className = 'opened';
                    const phoneDiv = document.createElement('div');
                    phoneDiv.className = 'phone';
                    phoneDiv.appendChild(document.createTextNode(phone));
                descDiv.appendChild(sigDiv);
                descDiv.appendChild(openedDiv);
                descDiv.appendChild(phoneDiv);
            bodyDiv.appendChild(descDiv);
        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(bodyDiv);
    wrapDiv.appendChild(infoDiv);

    overlay.setContent(wrapDiv);

    window.kakao.maps.event.addListener(marker, 'click',
        () => overlay.setMap(overlay.getMap() ? null : map));

    overlay.setMap(null);
}


/**
 * 
 * @param {window.kakao.maps.Map} map 
 * @param {*} marker 
 * @param {object} restaurant 
 */
function showDescription(map, marker, restaurant) {
    const descriptionOverlay = new window.kakao.maps.CustomOverlay({
        map: map,
        position: marker.getPosition()
    });
    
    const expandedDiv = document.createElement('div');
    expandedDiv.className = 'expanded-overlay';
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    const closeDiv = document.createElement('div');
    closeDiv.className = 'close';
    closeDiv.onclick = () => descriptionOverlay.setMap(null);
    titleDiv.appendChild(document.createTextNode(restaurant.name));
    titleDiv.appendChild(closeDiv);
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'body';
    const descDiv = document.createElement('div');
    descDiv.className = 'desc';

                
    fetchAsync('/menu/' + restaurant.name).then(([status, menus]) => {
        // 메뉴 정보가 없을 때
        if (status != 200) {
            alert('아직 메뉴 정보가 업데이트 되지 않았습니다.\n기다려주세요!');
            return;
        }                    

        let menu_list = [];
        // 메뉴 정보가 있을 때
        for (let m of menus) {
            menu_list.push([m.menu, m.price]);
        }

        descDiv.appendChild(document.createElement('br'));
        descDiv.appendChild(document.createTextNode(`${restaurant.signature} (${restaurant.category})`));
        descDiv.appendChild(document.createElement('br'));
        descDiv.appendChild(document.createElement('br'));

        for (const [m, p] of menu_list) {
            descDiv.appendChild(document.createTextNode(`${m}: ${p}원`));
            descDiv.appendChild(document.createElement('br'));
        }
        
        descDiv.appendChild(document.createElement('br'));
        descDiv.appendChild(document.createTextNode(`주소: 서울시 동작구 ${restaurant.address}`));
        descDiv.appendChild(document.createElement('br'));
        descDiv.appendChild(document.createTextNode(`(${restaurant.distance} km)`));
        descDiv.appendChild(document.createElement('br'));
        descDiv.appendChild(document.createTextNode(`전화번호: ${restaurant.phone}`));
        descDiv.appendChild(document.createElement('br'));
        bodyDiv.appendChild(descDiv);
        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(bodyDiv);
        expandedDiv.appendChild(infoDiv);
    
        descriptionOverlay.setContent(expandedDiv);
    
        descriptionOverlay.setMap(map);
        });
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
        const options = { center: initPos, level: 4 };
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