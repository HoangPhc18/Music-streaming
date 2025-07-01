import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Library from './pages/Library';
import Profile from './pages/Profile';
import SongDetail from './pages/SongDetail';
import AlbumDetail from './pages/AlbumDetail';
import ArtistDetail from './pages/ArtistDetail';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/song/:id" element={<SongDetail />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:id" element={<ArtistDetail />} />
            </Routes>
          </Layout>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
