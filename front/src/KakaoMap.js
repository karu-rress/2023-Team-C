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
import './KakaoMap.css';


const kakao_map = window.kakao.maps;

/**
 * 
 * @param {kakao_map.Map} map 
 * @param {string} name 
 * @param {string} signature 
 * @param {string} phone 
 * @param {kakao_map.LatLng} latlng
 * @param {*} time
 */
function AddMarker(map, name, signature, phone, latlng, time = null) {
    // var d = new Date(); // for now
 //d.getHours(); // => 9
//d.getMinutes(); // =>  30
//d.getSeconds(); // => 51

    let isOpened = true;
    // 아 이거 시간 보고...

    const content = `<div class="wrap">
    <div class="info">
        <div class="title">
        ${name}
        <div class="close" onclick="closeOverlay()" title="닫기"></div>
        </div>
        <div class="body">
        <div class="desc">
            <div class="signature">${signature}</div>
            <div class="opened">${isOpened ? "영업중" : "영업종료"}</div>
            <div class="phone">${phone}</div>
        </div>
        </div>
    </div>
    </div>`;

    const marker = new window.kakao.maps.Marker({
        map: map,
        position: latlng,
    });

    const overlay = new window.kakao.maps.CustomOverlay({
        content: content,
        map: map,
        position: marker.getPosition()
    })

    window.kakao.maps.event.addListener(marker, 'click', () => overlay.setMap(map));
    window.closeOverlay = () => overlay.setMap(null);
}

function KakaoMap() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // 처음 지도가 표시될 때의 위치
    //주소
    const initPos = { lat: 37.5051, lng: 126.9571 };

    useEffect(() => {
        if (!window.kakao) {
            alert('카카오맵 API 오류입니다.');
            return;
        }

        // 카카오맵 API 기본 설정
        const container = document.getElementById('kakaomap');
        const options = {
            center: new kakao_map.LatLng(initPos.lat, initPos.lng),
            level: 4
        };
        const map = new kakao_map.Map(container, options);


        // 여기에서 REST API 이용, 전체 데이터 받아오기
        // TO DO

        // 가게 핀 추가 (for ~ of 사용 필요)
        AddMarker(map, "맛있는 집", "음식점", "02-1234-5678", 
            new kakao_map.LatLng(37.5072, 126.9586));

        AddMarker(map, "맛집","돈가스", "010-1111-1111",
            new kakao_map.LatLng(37.5073, 126.9597));    

        AddMarker(map, "라멘집","라면", "0507-9999-8888",
            new kakao_map.LatLng(37.5074, 126.9601));    
    }, []);

    return (
        <div id="kakaomap" />
    );
}

export default KakaoMap;