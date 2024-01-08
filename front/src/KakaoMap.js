/**
 * 
 *  KakaoMap.js
 *  All functions related to Kakao Map API
 * 
 *  Created: 2024-01-06
 *  Last modified: -
 * 
 */

import React, { useEffect, useState } from 'react';
import { BACKEND_API } from './config';
import './KakaoMap.css';

const kakao_map = window.kakao.maps;

// 처음 지도가 표시될 때의 위치
const initPos = new kakao_map.LatLng(37.5051, 126.9571);

let index = 0

/**
 * addMarker의 wrapper 함수
 * @param {kakao_map.Map} map
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
            });
    }
}

/**
 * 마커를 추가하는 함수
 * @param {kakao_map.Map} map 
 * @param {string} name 
 * @param {string} signature 
 * @param {string} phone 
 * @param {kakao_map.LatLng} latlng
 * @param {{open: Date, close: Date, breakStart: Date, breakEnd: Date}} time
 */
function addMarker(map, name, signature, phone, latlng, time = null) {
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
            <div class="close" onclick="closeOverlay${index}()" title="닫기"></div>
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

    // 마커 생성 (토글 가능) 및 오버레이 끄기
    window.kakao.maps.event.addListener(marker, 'click',
        () => overlay.setMap(overlay.getMap() ? null : map));
    overlay.setMap(null);

    // X버튼 클릭시, 오버레이에 해당하는 창만 끄기
    eval(`window.closeOverlay${index} = () => { overlay.setMap(null); }`);
    index++;
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
            
        }
    }, [search, category]); // search 또는 category가 갱신될 때마다 마커 다시 그리기

    return (
        <div id="kakaomap" />
    );
}

export default KakaoMap;