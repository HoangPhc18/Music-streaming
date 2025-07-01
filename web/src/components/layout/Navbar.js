import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar glass-effect">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-text">Melodify</span>
          </Link>
          <div className={`search-bar ${searchOpen ? 'active' : ''}`}>
            <input 
              type="text" 
              placeholder="Tìm kiếm bài hát, nghệ sĩ, album..." 
              className="search-input"
            />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="navbar-right">
          <button 
            className="search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <FaSearch />
          </button>
          <div className="nav-links">
            <Link to="/" className="nav-link">Trang chủ</Link>
            <Link to="/explore" className="nav-link">Khám phá</Link>
            <Link to="/library" className="nav-link">Thư viện</Link>
          </div>
          <Link to="/profile" className="profile-btn">
            <FaUser />
          </Link>
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content glass-effect">
          <Link to="/" className="mobile-nav-link">Trang chủ</Link>
          <Link to="/explore" className="mobile-nav-link">Khám phá</Link>
          <Link to="/library" className="mobile-nav-link">Thư viện</Link>
          <Link to="/profile" className="mobile-nav-link">Hồ sơ</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 