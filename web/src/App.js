import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Library from './pages/Library';
import Profile from './pages/Profile';
import SongDetail from './pages/SongDetail';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { useAuth } from './context/AuthContext';

// Admin components
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import Dashboard from './admin/Dashboard';
import ArtistsManagement from './admin/ArtistsManagement';
import AlbumsManagement from './admin/AlbumsManagement';
import SongsManagement from './admin/SongsManagement';
import GenresManagement from './admin/GenresManagement';
import UsersManagement from './admin/UsersManagement';
import PlaylistsManagement from './admin/PlaylistsManagement';
import SystemSettings from './admin/SystemSettings';
import UploadMusic from './admin/UploadMusic';

import './App.css';

// Bảo vệ routes yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Ngăn người dùng đã đăng nhập truy cập trang đăng nhập/đăng ký
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// AnimatedRoutes component for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <div className="page-container">
      <Routes location={location}>
        {/* Main App Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/explore" element={<Layout><Explore /></Layout>} />
        <Route path="/library" element={
          <ProtectedRoute>
            <Layout><Library /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/song/:id" element={<Layout><SongDetail /></Layout>} />
        <Route path="/album/:id" element={<Layout><AlbumDetail /></Layout>} />
        <Route path="/artist/:id" element={<Layout><ArtistDetail /></Layout>} />
        
        {/* Auth routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="artists" element={<ArtistsManagement />} />
            <Route path="albums" element={<AlbumsManagement />} />
            <Route path="songs" element={<SongsManagement />} />
            <Route path="upload" element={<UploadMusic />} />
            <Route path="genres" element={<GenresManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="playlists" element={<PlaylistsManagement />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <ScrollToTop />
          <AnimatedRoutes />
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
