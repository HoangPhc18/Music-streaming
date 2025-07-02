import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { songService, artistService, albumService, genreService } from '../utils/api';
import './Explore.css';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch initial data
        const [songsResponse, albumsResponse, artistsResponse, genresResponse] = await Promise.all([
          songService.getAll({ limit: 8 }),
          albumService.getAll({ limit: 8 }),
          artistService.getAll({ limit: 8 }),
          genreService.getAll()
        ]);
        
        setSongs(songsResponse.data.results || []);
        setAlbums(albumsResponse.data.results || []);
        setArtists(artistsResponse.data.results || []);
        setGenres(genresResponse.data.results || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching explore data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await songService.search(searchQuery);
          setSearchResults(response.data || []);
        } catch (err) {
          console.error('Error searching:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Filter content based on active tab and search query
  const getFilteredContent = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      return searchResults.map(song => ({
        id: song.id,
        title: song.title,
        subtitle: song.artist?.name,
        imageUrl: song.image_url || 'https://via.placeholder.com/300',
        link: `/song/${song.id}`,
        type: 'song'
      }));
    }
    
    let content = [];
    
    if (activeTab === 'all' || activeTab === 'songs') {
      content = [...content, ...songs.map(song => ({
        id: song.id,
        title: song.title,
        subtitle: song.artist?.name,
        imageUrl: song.image_url || 'https://via.placeholder.com/300',
        link: `/song/${song.id}`,
        type: 'song'
      }))];
    }
    
    if (activeTab === 'all' || activeTab === 'albums') {
      content = [...content, ...albums.map(album => ({
        id: album.id,
        title: album.title,
        subtitle: album.artist?.name,
        imageUrl: album.cover_image || 'https://via.placeholder.com/300',
        link: `/album/${album.id}`,
        type: 'album'
      }))];
    }
    
    if (activeTab === 'all' || activeTab === 'artists') {
      content = [...content, ...artists.map(artist => ({
        id: artist.id,
        title: artist.name,
        subtitle: 'Nghệ sĩ',
        imageUrl: artist.profile_image || 'https://via.placeholder.com/300',
        link: `/artist/${artist.id}`,
        type: 'artist'
      }))];
    }
    
    return content;
  };

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
    <div className="explore-page">
      <div className="explore-header glass-effect">
        <div className="search-filter-container">
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
          <button 
            className="filter-btn"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FaFilter /> Lọc
          </button>
        </div>
        
        {filterOpen && (
          <div className="filter-dropdown glass-effect">
            <div className="filter-section">
              <h4>Thể loại</h4>
              <div className="filter-options">
                {genres.slice(0, 6).map(genre => (
                  <div className="filter-option" key={genre.id}>
                    <input type="checkbox" id={`genre-${genre.id}`} />
                    <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="explore-tabs">
        <button 
          className={`explore-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả
        </button>
        <button 
          className={`explore-tab ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          Bài hát
        </button>
        <button 
          className={`explore-tab ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          Album
        </button>
        <button 
          className={`explore-tab ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          Nghệ sĩ
        </button>
      </div>

      {isSearching ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tìm kiếm...</p>
        </div>
      ) : (
        <>
          <div className="explore-content">
            {getFilteredContent().length > 0 ? (
              <div className="card-grid">
                {getFilteredContent().map(item => (
                  <div className="card-item" key={`${item.type}-${item.id}`}>
                    <Card {...item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>Không tìm thấy kết quả phù hợp</p>
              </div>
            )}
          </div>

          {activeTab === 'all' && !searchQuery && (
            <div className="genres-section">
              <h3 className="section-title">Thể loại</h3>
              <div className="genres-grid">
                {genres.map(genre => (
                  <Link to={`/genre/${genre.id}`} key={genre.id} className="genre-card" style={{ background: genre.color || 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)' }}>
                    <h4>{genre.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore; 