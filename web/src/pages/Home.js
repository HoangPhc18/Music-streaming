import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { songService, artistService, playlistService } from '../utils/api';
import './Home.css';

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch playlists
        const playlistsResponse = await playlistService.getAll();
        setFeaturedPlaylists(playlistsResponse.data.results?.slice(0, 4) || []);
        
        // Fetch new releases (songs)
        const songsResponse = await songService.getAll({ ordering: '-release_date' });
        setNewReleases(songsResponse.data.results?.slice(0, 4) || []);
        
        // Fetch popular artists
        const artistsResponse = await artistService.getAll();
        setPopularArtists(artistsResponse.data.results?.slice(0, 4) || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section glass-effect">
        <div className="hero-content">
          <h1 className="hero-title">Chào mừng đến với Melodify</h1>
          <p className="hero-subtitle">Khám phá và thưởng thức âm nhạc không giới hạn</p>
          <Link to="/explore" className="btn btn-primary">
            Khám phá ngay
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Playlist nổi bật</h2>
          <Link to="/playlists" className="section-link">
            Xem tất cả <FaChevronRight />
          </Link>
        </div>
        <div className="card-grid">
          {featuredPlaylists.map(playlist => (
            <div className="card-item" key={playlist.id}>
              <Card 
                id={playlist.id}
                title={playlist.name}
                subtitle={`${playlist.songs_count || 0} bài hát`}
                imageUrl={playlist.cover_image || 'https://via.placeholder.com/300'}
                link={`/playlist/${playlist.id}`}
                type="playlist"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Mới phát hành</h2>
          <Link to="/new-releases" className="section-link">
            Xem tất cả <FaChevronRight />
          </Link>
        </div>
        <div className="card-grid">
          {newReleases.map(song => (
            <div className="card-item" key={song.id}>
              <Card 
                id={song.id}
                title={song.title}
                subtitle={song.artist?.name}
                imageUrl={song.image_url || 'https://via.placeholder.com/300'}
                link={`/song/${song.id}`}
                type="song"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Nghệ sĩ nổi bật</h2>
          <Link to="/artists" className="section-link">
            Xem tất cả <FaChevronRight />
          </Link>
        </div>
        <div className="card-grid">
          {popularArtists.map(artist => (
            <div className="card-item" key={artist.id}>
              <Card 
                id={artist.id}
                title={artist.name}
                subtitle="Nghệ sĩ"
                imageUrl={artist.profile_image || 'https://via.placeholder.com/300'}
                link={`/artist/${artist.id}`}
                type="artist"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 