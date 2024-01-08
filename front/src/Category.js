import React, { useState } from "react";
import  "./Category.css";

const Category = () => {
  const menuLst = ["menu1"];
  const [hide, setHide] = useState({
    menu1: false,
    
  });
  const mouseEvent = (menuName, bool) => {
    const change = { ...hide };
    change[menuName] = bool;
    setHide(change);
  };
  return (
    <nav className="nav">
      <ul className="navContainer">
        {menuLst.map((v, idx) => (
          <li
            className={hide[v] ? "active" : "none"}
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <p>{`카테고리`}</p>
          </li>
        ))}
      </ul>
      <div className="detailMenu">
        {menuLst.map((v, idx) => (
          <ul
            onMouseEnter={() => mouseEvent(v, true)}
            onMouseLeave={() => mouseEvent(v, false)}
          >
            <li>{`한식`}</li>
            <li>{`일식`}</li>
            <li>{`중식`}</li>
            <li>{`양식`}</li>
            <li>{`분식`}</li>
            <li>{`기타`}</li>
          </ul>
        ))}
      </div>
    </nav>
  );
};

export default Category;
