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
import Popup from './Popup';
import logo from './logo.svg';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = st => setSearchTerm(st);

  return (
    <div>
      <TitleBar/>
      <SearchBox onSearch={handleSearch}/>
      <KakaoMap search={searchTerm}/>
      <Popup/>
    </div>
  );
}

export default App;