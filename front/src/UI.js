import React, { useState } from 'react';
import './UI.css';

function TitleBar() {
    return (
        <div id="titlebar">
            <div id="title">Where We Go?</div>
        </div>
    );
}

function SearchBox({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange   = event => setSearchTerm(event.target.value);
  const handleSearch        =    () => onSearch(searchTerm);

  return (
    <div id="searchBox">
      <input
        type="text"
        placeholder="검색어를 입력하세요..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}

function Category({ onClick }) {
  const menuLst = ["menu1"];
  const [hide, setHide] = useState({ menu1: false });
  const [categoryTerm, setCategoryTerm] = useState('');
  const mouseEvent = (menuName, bool) => {
    const change = { ...hide };
    change[menuName] = bool;
    setHide(change);
  };
  const click = (str) => {
    setCategoryTerm(str);
    onClick(categoryTerm);
  };

  return (
    <nav className="nav">
      <ul className="navContainer">
        { menuLst.map((v, idx) => (
          <li
            className={hide[v] ? "active" : "none"}
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <p>카테고리</p>
          </li>
        ))}
      </ul>
      <div className="detailMenu">
        {menuLst.map((v, idx) => (
          <ul
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <li onClick={() => click("한식")}>한식</li>
            <li onClick={() => click("일식")}>일식</li>
            <li onClick={() => click("중식")}>중식</li>
            <li onClick={() => click("양식")}>양식</li>
            <li onClick={() => click("분식")}>분식</li>
            <li onClick={() => click("기타")}>기타</li>
          </ul>
        ))}
      </div>
    </nav>
  );
};

export {
    TitleBar,
    SearchBox,
    Category,
};