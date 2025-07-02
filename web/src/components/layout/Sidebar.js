import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaMusic, FaUser, FaHeart, FaHistory, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { playlistService } from '../../utils/api';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const response = await playlistService.getUserPlaylists();
          setUserPlaylists(response.data);
        } catch (error) {
          console.error('Error fetching user playlists:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPlaylists();
  }, [currentUser]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar glass-effect">
      <div className="sidebar-content">
        <div className="menu-section">
          <h3 className="menu-title">Menu</h3>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className={`menu-link ${isActive('/') ? 'active' : ''}`}>
                <FaHome className="menu-icon" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/explore" className={`menu-link ${isActive('/explore') ? 'active' : ''}`}>
                <FaCompass className="menu-icon" />
                <span>Khám phá</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/library" className={`menu-link ${isActive('/library') ? 'active' : ''}`}>
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
              <Link to="/profile" className={`menu-link ${isActive('/profile') ? 'active' : ''}`}>
                <FaUser className="menu-icon" />
                <span>Hồ sơ</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/favorites" className={`menu-link ${isActive('/favorites') ? 'active' : ''}`}>
                <FaHeart className="menu-icon" />
                <span>Yêu thích</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/history" className={`menu-link ${isActive('/history') ? 'active' : ''}`}>
                <FaHistory className="menu-icon" />
                <span>Lịch sử</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <div className="playlist-header">
            <h3 className="menu-title">Playlist</h3>
            <Link to="/create-playlist" className="create-playlist-btn">
              <FaPlus />
            </Link>
          </div>
          <div className="sidebar-playlists">
            {loading ? (
              <div className="sidebar-loading">Đang tải...</div>
            ) : userPlaylists.length > 0 ? (
              <ul className="menu-list playlist-list">
                {userPlaylists.map((playlist) => (
                  <li 
                    key={playlist.id} 
                    className={`menu-item ${isActive(`/playlist/${playlist.id}`) ? 'active' : ''}`}
                  >
                    <Link to={`/playlist/${playlist.id}`} className="menu-link playlist-link">
                      <span className="playlist-name">{playlist.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-playlists">
                <p>Bạn chưa có playlist nào</p>
                <Link to="/create-playlist" className="create-first-playlist">
                  Tạo playlist đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 