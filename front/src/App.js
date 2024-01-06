/**
 * 
 *  App.js
 *  Front-end main page
 * 
 *  Created: 2024-01-06
 *  Last modified: -
 * 
 */

import React, { useState } from 'react';
import KakaoMap from './KakaoMap';
import { SearchBox, TitleBar } from './UI';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (searchTerm) => {
    alert('검색어:' + searchTerm);
    setSearchResult(`검색 결과: ${searchTerm}`);
  };

  return (
    <div>
      <TitleBar/>
      <SearchBox onSearch={handleSearch}/>
      <KakaoMap/>
    </div>
  );
}

export default App;