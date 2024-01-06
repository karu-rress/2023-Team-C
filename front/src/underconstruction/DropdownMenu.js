// src/SearchBox.js
import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div>
      <label htmlFor="search">음식 이름 검색: </label>
      <input type="text" id="search" value={searchTerm} onChange={handleInputChange} />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBox;