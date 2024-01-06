// src/SearchBox.js
import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // 검색 로직을 수행하거나 부모 컴포넌트에 검색어를 전달할 수 있습니다.
    onSearch(searchTerm);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBox;