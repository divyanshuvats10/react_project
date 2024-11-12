import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (

<nav className="navbar">
  <div className="navbar-left">
    <a href="/" className="logo">
      College
    </a>
  </div>
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <a href="/">Dashboard</a>
      </li>
      
        
    </ul>
  </div>
  <div className="navbar-right">
    
  </div>
</nav>
);
};

export default Navbar;