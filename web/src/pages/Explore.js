import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Card from '../components/ui/Card';
import './Explore.css';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock data
  const songs = [
    {
      id: 1,
      title: 'Hạ Còn Vương Nắng',
      subtitle: 'DATKAA, KIDO',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/1',
      type: 'song'
    },
    {
      id: 2,
      title: 'Waiting For You',
      subtitle: 'MONO',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/2',
      type: 'song'
    },
    {
      id: 3,
      title: 'Có Chơi Có Chịu',
      subtitle: 'KARIK, ONLY C',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/3',
      type: 'song'
    },
    {
      id: 4,
      title: 'Tiny Love',
      subtitle: 'Thịnh Suy',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/4',
      type: 'song'
    }
  ];

  const albums = [
    {
      id: 1,
      title: 'Chúng Ta Của Hiện Tại',
      subtitle: 'Sơn Tùng M-TP',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/1',
      type: 'album'
    },
    {
      id: 2,
      title: 'Tâm 9',
      subtitle: 'Mỹ Tâm',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/2',
      type: 'album'
    },
    {
      id: 3,
      title: 'Hoàng',
      subtitle: 'Hoàng Thùy Linh',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/3',
      type: 'album'
    },
    {
      id: 4,
      title: 'Gần Như Là',
      subtitle: 'Thịnh Suy',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/4',
      type: 'album'
    }
  ];

  const artists = [
    {
      id: 1,
      title: 'Sơn Tùng M-TP',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/1',
      type: 'artist'
    },
    {
      id: 2,
      title: 'Bích Phương',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/2',
      type: 'artist'
    },
    {
      id: 3,
      title: 'Hoàng Thùy Linh',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/3',
      type: 'artist'
    },
    {
      id: 4,
      title: 'Đen Vâu',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/4',
      type: 'artist'
    }
  ];

  const genres = [
    {
      id: 1,
      name: 'Nhạc Trẻ',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)'
    },
    {
      id: 2,
      name: 'Ballad',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    {
      id: 3,
      name: 'Rock',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%)'
    },
    {
      id: 4,
      name: 'Hip Hop',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #00C853 0%, #B2FF59 100%)'
    },
    {
      id: 5,
      name: 'R&B',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #FF4081 0%, #F50057 100%)'
    },
    {
      id: 6,
      name: 'EDM',
      imageUrl: 'https://via.placeholder.com/300',
      color: 'linear-gradient(135deg, #FFEB3B 0%, #FFC107 100%)'
    }
  ];

  // Filter content based on active tab and search query
  const getFilteredContent = () => {
    let content = [];
    
    if (activeTab === 'all' || activeTab === 'songs') {
      content = [...content, ...songs];
    }
    
    if (activeTab === 'all' || activeTab === 'albums') {
      content = [...content, ...albums];
    }
    
    if (activeTab === 'all' || activeTab === 'artists') {
      content = [...content, ...artists];
    }
    
    if (searchQuery) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return content;
  };

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
        
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button 
            className={`tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
            onClick={() => setActiveTab('songs')}
          >
            Bài hát
          </button>
          <button 
            className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            Album
          </button>
          <button 
            className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Nghệ sĩ
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="filter-panel glass-effect">
          <h3>Lọc theo</h3>
          <div className="filter-options">
            <div className="filter-group">
              <h4>Thể loại</h4>
              <div className="filter-checkboxes">
                <label>
                  <input type="checkbox" /> Nhạc Trẻ
                </label>
                <label>
                  <input type="checkbox" /> Ballad
                </label>
                <label>
                  <input type="checkbox" /> Rock
                </label>
                <label>
                  <input type="checkbox" /> Hip Hop
                </label>
              </div>
            </div>
            <div className="filter-group">
              <h4>Năm phát hành</h4>
              <div className="filter-checkboxes">
                <label>
                  <input type="checkbox" /> 2023
                </label>
                <label>
                  <input type="checkbox" /> 2022
                </label>
                <label>
                  <input type="checkbox" /> 2021
                </label>
                <label>
                  <input type="checkbox" /> 2020
                </label>
              </div>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn btn-secondary">Đặt lại</button>
            <button className="btn btn-primary">Áp dụng</button>
          </div>
        </div>
      )}

      <section className="section">
        <h2 className="section-title">Thể loại</h2>
        <div className="genre-grid">
          {genres.map(genre => (
            <Link to={`/genre/${genre.id}`} key={genre.id} className="genre-card" style={{background: genre.color}}>
              <h3>{genre.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Khám phá</h2>
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
            <p>Không tìm thấy kết quả phù hợp.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore; 