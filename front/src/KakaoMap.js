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
const api_address = 'http://20.205.239.240:8080';
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

async function fetchAsync() {
    try {
        const response = await fetch(api_address + '/getall');
        alert(response.status);
        const result = await response.json();
        alert(result);
    }
    catch (err) {
        alert('Error! ' + err);
    }
}

function KakaoMap() {
    const [searchResult, setSearchResult] = useState(null);
    // const [data, setData] = useState(null);

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

        const response = fetch('http://20.205.239.240:8080/getall')
            .then(res => res)
            .catch(res => alert('error'));
        alert(response.status);
        // fetchAsync().then();

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