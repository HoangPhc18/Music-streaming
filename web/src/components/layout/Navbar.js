import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            Melodify
          </Link>
        </div>
        
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>
        
        <div className="navbar-user">
          {currentUser ? (
            <div className="user-menu-container">
              <button className="user-profile-btn" onClick={toggleUserMenu}>
                {currentUser.profile_image ? (
                  <img 
                    src={currentUser.profile_image} 
                    alt={currentUser.username} 
                    className="user-avatar" 
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name">{currentUser.username}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown glass-effect">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaUser /> Hồ sơ
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaCog /> Cài đặt
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn btn-register">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 