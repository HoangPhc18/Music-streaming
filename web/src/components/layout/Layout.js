import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <div className="container">
          <div className="main-layout">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Layout; 