import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Wrapper component để tránh lỗi khi sử dụng useAuth trong App
const AppRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <AppRoutes />
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
