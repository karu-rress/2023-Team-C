/**
 * 
 *  App.js
 *  Front-end main page
 * 
 *  Created: 2024-01-06
 *  Last modified: -
 * 
 */

import React, { useEffect, useState } from 'react';
import KakaoMap from './KakaoMap';
import { SearchBox, TitleBar, Category } from './UI';
import './App.css';


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');
  const handleSearch = st => setSearchTerm(st);
  const handleClick = ct => setCategoryTerm(ct);
  
  return (
    <div>
      <TitleBar/>
      <SearchBox onSearch={handleSearch}/>
      <Category onClick={handleClick}/>  
      <KakaoMap search={searchTerm} category={categoryTerm}/>
    </div>
  );
}

export default App;