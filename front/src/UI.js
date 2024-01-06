import React, { useState } from 'react';
import './UI.css';

function TitleBar() {
    return (
        <div id="titlebar">
            <label id="title">TastyNav</label>
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
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}

export {
    TitleBar,
    SearchBox,
};