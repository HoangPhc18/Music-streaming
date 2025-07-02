import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTachometerAlt, FaUsers, FaMicrophone, FaCompactDisc, FaMusic, FaUpload, FaListUl, FaTags, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Clear admin authentication from localStorage
    localStorage.removeItem('adminAuth');
    // Redirect will be handled by AdminGuard
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Music Admin</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard"><FaTachometerAlt /> <span>Dashboard</span></Link>
            </li>
            <li>
              <Link to="/admin/users"><FaUsers /> <span>Users</span></Link>
            </li>
            <li>
              <Link to="/admin/artists"><FaMicrophone /> <span>Artists</span></Link>
            </li>
            <li>
              <Link to="/admin/albums"><FaCompactDisc /> <span>Albums</span></Link>
            </li>
            <li>
              <Link to="/admin/songs"><FaMusic /> <span>Songs</span></Link>
            </li>
            <li>
              <Link to="/admin/upload"><FaUpload /> <span>Upload Music</span></Link>
            </li>
            <li>
              <Link to="/admin/playlists"><FaListUl /> <span>Playlists</span></Link>
            </li>
            <li>
              <Link to="/admin/genres"><FaTags /> <span>Genres</span></Link>
            </li>
            <li>
              <Link to="/admin/settings"><FaCog /> <span>System Settings</span></Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        <header className="admin-header">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-user">
            <span>Admin User</span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 