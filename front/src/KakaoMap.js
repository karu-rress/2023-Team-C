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

// 처음 지도가 표시될 때의 위치
const initPos = new kakao_map.LatLng(37.5051, 126.9571);

let index = 0

/**
 * 마커를 추가하는 함수
 * @param {kakao_map.Map} map 
 * @param {string} name 
 * @param {string} signature 
 * @param {string} phone 
 * @param {kakao_map.LatLng} latlng
 * @param {*} time
 */
function AddMarker(map, name, signature, phone, latlng, time = null) {
    const current_time = new Date(); // 현재 시간
    const hour = current_time.getHours();
    const min = current_time.getMinutes();

    let isOpened = false;

    if (time && time.open && time.close) {
        const open_hours = parseInt(new Date(time.open).getUTCHours(), 10);
        const open_minutes = parseInt(new Date(time.open).getUTCMinutes(), 10);
        const close_hours = parseInt(new Date(time.close).getUTCHours(), 10);
        const close_minutes = parseInt(new Date(time.close).getUTCMinutes(), 10);

        // 현재 시간이 open과 close 사이에 있을 때
        if (
            (hour > open_hours || (hour === open_hours && min >= open_minutes)) &&
            (hour < close_hours || (hour === close_hours && min < close_minutes))
        ) {
            isOpened = true;
        }
    }
        console.log(`현재 시간: ${hour}시 ${min}분`);   
   



    

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
 * @returns status code 및 파싱한 object
 */
async function fetchAsync(path) {
    try {
        const response = await fetch(api_address + path);
        if (response.status >= 400)
            return [response.status, null];
        return [response.status, await response.json()];
    }
    catch (err) {
        alert('에러가 발생했습니다.\n' + err);
    }
}

function KakaoMap({ search }) {
    useEffect(() => {
        if (!window.kakao) {
            alert('카카오맵 API 오류입니다.');
            return;
        }

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
                    return;
                }
                for (let res of restaurants) {
                AddMarker(map, res.name, res.signature, res.phone,
                    new kakao_map.LatLng(res.latitude, res.longitude),
                    {
                        open: res.openTime,
                        close: res.closeTime,
                        breakStart: res.breakStart,
                        breakEnd: res.breakEnd,
                    });
                }
            });
        }
        else {
            // 전체 맛집 목록을 순회한 후, 하나씩 마커를 생성
            fetchAsync('/getall').then(([_, restaurants]) => {
                for (let res of restaurants) {
                AddMarker(map, res.name, res.signature, res.phone,
                    new kakao_map.LatLng(res.latitude, res.longitude),
                    {
                        open: res.openTime,
                        close: res.closeTime,
                        breakStart: res.breakStart,
                        breakEnd: res.breakEnd,
                    });
                }
            });
        }
    }, [search]);

    return (
        <div id="kakaomap" />
    );
}

export default KakaoMap;