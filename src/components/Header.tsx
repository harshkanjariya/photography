import React, {useEffect, useState} from 'react';
import '../assets/css/Header.css';
import {CameraOutlined} from "@mui/icons-material";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <header style={{ display: "flex", alignItems: "center" }} className={`header ${isActive ? 'active' : ''}`}>
      <div style={{ padding: 10, color: "white" }}>
        <CameraOutlined fontSize="large"/>
      </div>
      <nav className={`nav ${isMenuVisible ? 'showing' : ''}`}>
        <span className="menu-title">menu</span>
        <ul>
          <li><a href="/photography/">home</a></li>
          <li><a href="/photography/about">about me</a></li>
          <li><a href="/photography/photos">photo gallery</a></li>
          <li><a href="/photography/contact">contact</a></li>
        </ul>
        <ul>
          <li>facebook</li>
          <li>instagram</li>
          <li>twitter</li>
          <li>behance</li>
        </ul>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="hamburger-inner"></div>
      </div>
    </header>
  );
};

export default Header;
