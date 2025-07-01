import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaMusic, FaUser, FaHeart, FaHistory, FaPlus } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="sidebar glass-effect">
      <div className="sidebar-content">
        <div className="menu-section">
          <h3 className="menu-title">Menu</h3>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className={`menu-link ${path === '/' ? 'active' : ''}`}>
                <FaHome className="menu-icon" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/explore" className={`menu-link ${path === '/explore' ? 'active' : ''}`}>
                <FaCompass className="menu-icon" />
                <span>Khám phá</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/library" className={`menu-link ${path === '/library' ? 'active' : ''}`}>
                <FaMusic className="menu-icon" />
                <span>Thư viện</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <h3 className="menu-title">Cá nhân</h3>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/profile" className={`menu-link ${path === '/profile' ? 'active' : ''}`}>
                <FaUser className="menu-icon" />
                <span>Hồ sơ</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/library?tab=songs" className={`menu-link ${path === '/favorites' ? 'active' : ''}`}>
                <FaHeart className="menu-icon" />
                <span>Yêu thích</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/profile?tab=history" className={`menu-link ${path === '/history' ? 'active' : ''}`}>
                <FaHistory className="menu-icon" />
                <span>Lịch sử</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <div className="playlist-header">
            <h3 className="menu-title">Playlist</h3>
            <button className="create-playlist-btn">
              <FaPlus />
            </button>
          </div>
          <ul className="menu-list playlist-list">
            <li className="menu-item">
              <Link to="/playlist/1" className="menu-link">
                <span>Nhạc yêu thích</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/playlist/2" className="menu-link">
                <span>Nhạc để code</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/playlist/3" className="menu-link">
                <span>Workout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 