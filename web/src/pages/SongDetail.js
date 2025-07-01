import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaEllipsisH, FaPlus, FaShare } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import './SongDetail.css';

const SongDetail = () => {
  const { id } = useParams();
  const { setCurrentSong, isPlaying, togglePlayPause } = useMusic();
  const [song, setSong] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Mock data
  const songData = {
    id: id,
    title: 'Hạ Còn Vương Nắng',
    artist: 'DATKAA',
    featuring: 'KIDO',
    album: 'Chúng Ta Của Hiện Tại',
    albumId: '1',
    releaseDate: '23/06/2023',
    duration: '3:45',
    genre: 'Nhạc Trẻ',
    lyrics: `Hạ còn vương nắng, vương nắng vàng trên mái hiên
Nắng vương trên bờ vai em, nhè nhẹ nắng trên tóc em
Mùa hạ năm ấy có em, có cả những chiều nắng vàng
Nắng vương trên bờ vai em, nắng khiến môi em thêm hồng

Nhớ chân em bước vội vàng, trên những con đường ngập tràn nắng
Mùa hạ năm ấy có em, có cả những chiều nắng vàng
Nắng vương trên bờ vai em, nắng khiến môi em thêm hồng...`,
    imageUrl: 'https://via.placeholder.com/500',
    audioUrl: 'https://example.com/audio.mp3',
    playCount: 1240000,
    likes: 45600
  };

  // Mock related songs
  const relatedSongs = [
    {
      id: 2,
      title: 'Waiting For You',
      artist: 'MONO',
      imageUrl: 'https://via.placeholder.com/300',
      duration: '4:12'
    },
    {
      id: 3,
      title: 'Có Chơi Có Chịu',
      artist: 'KARIK, ONLY C',
      imageUrl: 'https://via.placeholder.com/300',
      duration: '3:50'
    },
    {
      id: 4,
      title: 'Tiny Love',
      artist: 'Thịnh Suy',
      imageUrl: 'https://via.placeholder.com/300',
      duration: '4:05'
    }
  ];

  useEffect(() => {
    // In a real app, fetch song data from API
    setSong(songData);
  }, [id]);

  const handlePlaySong = () => {
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist + (song.featuring ? `, ${song.featuring}` : ''),
      imageUrl: song.imageUrl,
      audioUrl: song.audioUrl
    });
    if (!isPlaying) {
      togglePlayPause();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!song) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="song-detail-page">
      <div className="song-header glass-effect">
        <div className="song-cover">
          <img src={song.imageUrl} alt={song.title} />
          <button className="play-button" onClick={handlePlaySong}>
            <FaPlay />
          </button>
        </div>
        <div className="song-info">
          <h1>{song.title}</h1>
          <div className="song-artists">
            <Link to={`/artist/${song.artist.toLowerCase().replace(' ', '-')}`} className="artist-link">
              {song.artist}
            </Link>
            {song.featuring && (
              <>
                <span className="featuring">ft.</span>
                <Link to={`/artist/${song.featuring.toLowerCase().replace(' ', '-')}`} className="artist-link">
                  {song.featuring}
                </Link>
              </>
            )}
          </div>
          <div className="song-meta">
            <span className="album">
              Album: <Link to={`/album/${song.albumId}`}>{song.album}</Link>
            </span>
            <span className="dot">•</span>
            <span className="release-date">{song.releaseDate}</span>
            <span className="dot">•</span>
            <span className="genre">{song.genre}</span>
          </div>
          <div className="song-stats">
            <span className="play-count">{formatNumber(song.playCount)} lượt nghe</span>
            <span className="dot">•</span>
            <span className="likes">{formatNumber(song.likes)} lượt thích</span>
          </div>
          <div className="song-actions">
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

      <div className="song-content">
        <div className="song-main">
          <div className="lyrics-container glass-effect">
            <h3>Lời bài hát</h3>
            <div className="lyrics">
              {song.lyrics.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="song-sidebar">
          <div className="related-songs glass-effect">
            <h3>Bài hát liên quan</h3>
            <div className="related-list">
              {relatedSongs.map(relatedSong => (
                <Link to={`/song/${relatedSong.id}`} key={relatedSong.id} className="related-song-item">
                  <div className="related-song-image">
                    <img src={relatedSong.imageUrl} alt={relatedSong.title} />
                    <div className="play-icon">
                      <FaPlay />
                    </div>
                  </div>
                  <div className="related-song-info">
                    <h4>{relatedSong.title}</h4>
                    <p>{relatedSong.artist}</p>
                  </div>
                  <div className="related-song-duration">{relatedSong.duration}</div>
                </Link>
              ))}
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

export default SongDetail; 