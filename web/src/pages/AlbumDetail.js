import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaEllipsisH, FaPlus, FaShare } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import './AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const { setCurrentSong, isPlaying, togglePlayPause } = useMusic();
  const [album, setAlbum] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Mock data
  const albumData = {
    id: id,
    title: 'Chúng Ta Của Hiện Tại',
    artist: 'Sơn Tùng M-TP',
    artistId: '1',
    releaseDate: '20/12/2022',
    genre: 'Nhạc Trẻ',
    description: 'Album mới nhất của Sơn Tùng M-TP với các ca khúc mang phong cách hiện đại, kết hợp nhiều thể loại âm nhạc khác nhau.',
    imageUrl: 'https://via.placeholder.com/500',
    playCount: 5240000,
    likes: 145600,
    tracks: [
      {
        id: 1,
        title: 'Chúng Ta Của Hiện Tại',
        duration: '4:12',
        isExplicit: false,
        imageUrl: 'https://via.placeholder.com/300',
        audioUrl: 'https://example.com/audio1.mp3'
      },
      {
        id: 2,
        title: 'Muộn Rồi Mà Sao Còn',
        duration: '3:45',
        isExplicit: false,
        imageUrl: 'https://via.placeholder.com/300',
        audioUrl: 'https://example.com/audio2.mp3'
      },
      {
        id: 3,
        title: 'Có Chắc Yêu Là Đây',
        duration: '3:52',
        isExplicit: false,
        imageUrl: 'https://via.placeholder.com/300',
        audioUrl: 'https://example.com/audio3.mp3'
      },
      {
        id: 4,
        title: 'Chạy Ngay Đi',
        duration: '4:08',
        isExplicit: false,
        imageUrl: 'https://via.placeholder.com/300',
        audioUrl: 'https://example.com/audio4.mp3'
      },
      {
        id: 5,
        title: 'Hãy Trao Cho Anh',
        duration: '4:05',
        isExplicit: false,
        imageUrl: 'https://via.placeholder.com/300',
        audioUrl: 'https://example.com/audio5.mp3'
      }
    ]
  };

  // Mock related albums
  const relatedAlbums = [
    {
      id: 2,
      title: 'Tâm 9',
      artist: 'Mỹ Tâm',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/2',
      type: 'album'
    },
    {
      id: 3,
      title: 'Hoàng',
      artist: 'Hoàng Thùy Linh',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/3',
      type: 'album'
    },
    {
      id: 4,
      title: 'Gần Như Là',
      artist: 'Thịnh Suy',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/4',
      type: 'album'
    }
  ];

  useEffect(() => {
    // In a real app, fetch album data from API
    setAlbum(albumData);
  }, [id]);

  const handlePlayAlbum = () => {
    if (album && album.tracks.length > 0) {
      const firstTrack = album.tracks[0];
      setCurrentSong({
        id: firstTrack.id,
        title: firstTrack.title,
        artist: album.artist,
        imageUrl: firstTrack.imageUrl || album.imageUrl,
        audioUrl: firstTrack.audioUrl
      });
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  };

  const handlePlayTrack = (track) => {
    setCurrentSong({
      id: track.id,
      title: track.title,
      artist: album.artist,
      imageUrl: track.imageUrl || album.imageUrl,
      audioUrl: track.audioUrl
    });
    if (!isPlaying) {
      togglePlayPause();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!album) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  const totalDuration = album.tracks.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(':').map(Number);
    return total + minutes * 60 + seconds;
  }, 0);
  
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    return hours > 0 ? `${hours} giờ ${minutes} phút` : `${minutes} phút`;
  };

  return (
    <div className="album-detail-page">
      <div className="album-header glass-effect">
        <div className="album-cover">
          <img src={album.imageUrl} alt={album.title} />
          <button className="play-button" onClick={handlePlayAlbum}>
            <FaPlay />
          </button>
        </div>
        <div className="album-info">
          <h1>{album.title}</h1>
          <div className="album-artist">
            <Link to={`/artist/${album.artistId}`} className="artist-link">
              {album.artist}
            </Link>
          </div>
          <div className="album-meta">
            <span className="release-date">{album.releaseDate}</span>
            <span className="dot">•</span>
            <span className="tracks-count">{album.tracks.length} bài hát</span>
            <span className="dot">•</span>
            <span className="total-duration">{formatTotalDuration()}</span>
            <span className="dot">•</span>
            <span className="genre">{album.genre}</span>
          </div>
          <div className="album-stats">
            <span className="play-count">{formatNumber(album.playCount)} lượt nghe</span>
            <span className="dot">•</span>
            <span className="likes">{formatNumber(album.likes)} lượt thích</span>
          </div>
          <p className="album-description">{album.description}</p>
          <div className="album-actions">
            <button 
              className={`action-btn ${isFavorite ? 'active' : ''}`} 
              onClick={toggleFavorite}
              aria-label="Thêm vào yêu thích"
            >
              <FaHeart />
            </button>
            <button 
              className="action-btn" 
              onClick={() => setShowOptions(!showOptions)}
              aria-label="Thêm vào playlist"
            >
              <FaPlus />
            </button>
            <button 
              className="action-btn" 
              aria-label="Chia sẻ"
            >
              <FaShare />
            </button>
            <button 
              className="action-btn" 
              onClick={() => setShowOptions(!showOptions)}
              aria-label="Thêm tùy chọn"
            >
              <FaEllipsisH />
            </button>
            {showOptions && (
              <div className="options-menu glass-effect">
                <button className="option-item">Thêm vào playlist</button>
                <button className="option-item">Tải xuống</button>
                <button className="option-item">Sao chép liên kết</button>
                <button className="option-item">Báo cáo</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="album-content">
        <div className="album-main">
          <div className="tracks-container glass-effect">
            <h3>Danh sách bài hát</h3>
            <div className="tracks-list">
              <div className="track-header">
                <div className="track-number">#</div>
                <div className="track-title">Tiêu đề</div>
                <div className="track-duration">Thời lượng</div>
                <div className="track-actions"></div>
              </div>
              {album.tracks.map((track, index) => (
                <div className="track-item" key={track.id}>
                  <div className="track-number">{index + 1}</div>
                  <div className="track-title" onClick={() => handlePlayTrack(track)}>
                    <div className="track-title-inner">
                      <span className="title">{track.title}</span>
                      {track.isExplicit && <span className="explicit">E</span>}
                    </div>
                  </div>
                  <div className="track-duration">{track.duration}</div>
                  <div className="track-actions">
                    <button className="track-action-btn">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="album-sidebar">
          <div className="related-albums glass-effect">
            <h3>Album tương tự</h3>
            <div className="related-list">
              {relatedAlbums.map(album => (
                <Link to={album.link} key={album.id} className="related-album-item">
                  <div className="related-album-image">
                    <img src={album.imageUrl} alt={album.title} />
                  </div>
                  <div className="related-album-info">
                    <h4>{album.title}</h4>
                    <p>{album.artist}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="album-info-box glass-effect">
            <h3>Thông tin</h3>
            <div className="info-item">
              <span className="info-label">Nghệ sĩ</span>
              <span className="info-value">
                <Link to={`/artist/${album.artistId}`}>{album.artist}</Link>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày phát hành</span>
              <span className="info-value">{album.releaseDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thể loại</span>
              <span className="info-value">{album.genre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số bài hát</span>
              <span className="info-value">{album.tracks.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thời lượng</span>
              <span className="info-value">{formatTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default AlbumDetail; 