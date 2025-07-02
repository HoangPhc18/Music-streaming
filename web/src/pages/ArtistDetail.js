import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaEllipsisH, FaShare } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { useMusic } from '../context/MusicContext';
import './ArtistDetail.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const { setCurrentSong, isPlaying, togglePlayPause } = useMusic();
  const [artist, setArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data
  const artistData = {
    id: id,
    name: 'Sơn Tùng M-TP',
    bio: 'Nguyễn Thanh Tùng (sinh ngày 5 tháng 7 năm 1994), thường được biết đến với nghệ danh Sơn Tùng M-TP, là một ca sĩ kiêm sáng tác nhạc, rapper và diễn viên người Việt Nam. Sinh ra ở thành phố Thái Bình, thời điểm đầu sự nghiệp, anh từng tham gia một nhóm nhạc địa phương mang tên Over Band.',
    coverImage: 'https://via.placeholder.com/1500x500',
    profileImage: 'https://via.placeholder.com/500',
    monthlyListeners: 1240000,
    followers: 2500000,
    genres: ['Nhạc Trẻ', 'V-Pop', 'Ballad'],
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      spotify: 'https://spotify.com'
    }
  };

  // Mock popular songs
  const popularSongs = [
    {
      id: 1,
      title: 'Chúng Ta Của Hiện Tại',
      plays: 12500000,
      duration: '4:12',
      album: 'Chúng Ta Của Hiện Tại',
      albumId: 1,
      imageUrl: 'https://via.placeholder.com/300',
      audioUrl: 'https://example.com/audio1.mp3'
    },
    {
      id: 2,
      title: 'Muộn Rồi Mà Sao Còn',
      plays: 15600000,
      duration: '3:45',
      album: 'Chúng Ta Của Hiện Tại',
      albumId: 1,
      imageUrl: 'https://via.placeholder.com/300',
      audioUrl: 'https://example.com/audio2.mp3'
    },
    {
      id: 3,
      title: 'Có Chắc Yêu Là Đây',
      plays: 9800000,
      duration: '3:52',
      album: 'Chúng Ta Của Hiện Tại',
      albumId: 1,
      imageUrl: 'https://via.placeholder.com/300',
      audioUrl: 'https://example.com/audio3.mp3'
    },
    {
      id: 4,
      title: 'Chạy Ngay Đi',
      plays: 11200000,
      duration: '4:08',
      album: 'Chúng Ta Của Hiện Tại',
      albumId: 1,
      imageUrl: 'https://via.placeholder.com/300',
      audioUrl: 'https://example.com/audio4.mp3'
    },
    {
      id: 5,
      title: 'Hãy Trao Cho Anh',
      plays: 10500000,
      duration: '4:05',
      album: 'Chúng Ta Của Hiện Tại',
      albumId: 1,
      imageUrl: 'https://via.placeholder.com/300',
      audioUrl: 'https://example.com/audio5.mp3'
    }
  ];

  // Mock albums
  const albums = [
    {
      id: 1,
      title: 'Chúng Ta Của Hiện Tại',
      subtitle: '2022',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/1',
      type: 'album'
    },
    {
      id: 2,
      title: 'Sky Tour',
      subtitle: '2020',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/2',
      type: 'album'
    },
    {
      id: 3,
      title: 'm-tp M-TP',
      subtitle: '2017',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/album/3',
      type: 'album'
    }
  ];

  // Mock similar artists
  const similarArtists = [
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

  useEffect(() => {
    // In a real app, fetch artist data from API
    setArtist(artistData);
  }, [id]);

  const handlePlayPopularSong = () => {
    if (popularSongs.length > 0) {
      const firstSong = popularSongs[0];
      setCurrentSong({
        id: firstSong.id,
        title: firstSong.title,
        artist: artist.name,
        imageUrl: firstSong.imageUrl,
        audioUrl: firstSong.audioUrl
      });
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  };

  const handlePlaySong = (song) => {
    setCurrentSong({
      id: song.id,
      title: song.title,
      artist: artist.name,
      imageUrl: song.imageUrl,
      audioUrl: song.audioUrl
    });
    if (!isPlaying) {
      togglePlayPause();
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!artist) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  const renderOverview = () => (
    <>
      <div className="artist-popular-songs glass-effect">
        <div className="section-header">
          <h3>Bài hát phổ biến</h3>
          <Link to={`/artist/${id}/songs`} className="see-all-link">Xem tất cả</Link>
        </div>
        <div className="popular-songs-list">
          {popularSongs.slice(0, 5).map((song, index) => (
            <div className="popular-song-item" key={song.id}>
              <div className="song-rank">{index + 1}</div>
              <div className="song-cover">
                <img src={song.imageUrl} alt={song.title} />
                <button className="play-icon" onClick={() => handlePlaySong(song)}>
                  <FaPlay />
                </button>
              </div>
              <div className="song-details">
                <h4>{song.title}</h4>
                <p>{formatNumber(song.plays)} lượt nghe</p>
              </div>
              <div className="song-duration">{song.duration}</div>
              <div className="song-actions">
                <button className="action-icon">
                  <FaHeart />
                </button>
                <button className="action-icon">
                  <FaEllipsisH />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="artist-albums">
        <div className="section-header">
          <h3>Album</h3>
          <Link to={`/artist/${id}/albums`} className="see-all-link">Xem tất cả</Link>
        </div>
        <div className="card-grid">
          {albums.map(album => (
            <div className="card-item" key={album.id}>
              <Card {...album} />
            </div>
          ))}
        </div>
      </div>

      <div className="artist-about glass-effect">
        <h3>Giới thiệu</h3>
        <p className="artist-bio">{artist.bio}</p>
        <div className="artist-stats">
          <div className="stat-item">
            <span className="stat-value">{formatNumber(artist.monthlyListeners)}</span>
            <span className="stat-label">Người nghe hàng tháng</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatNumber(artist.followers)}</span>
            <span className="stat-label">Người theo dõi</span>
          </div>
        </div>
      </div>

      <div className="artist-similar">
        <div className="section-header">
          <h3>Nghệ sĩ tương tự</h3>
        </div>
        <div className="card-grid">
          {similarArtists.map(artist => (
            <div className="card-item" key={artist.id}>
              <Card {...artist} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSongs = () => (
    <div className="artist-all-songs glass-effect">
      <h3>Tất cả bài hát</h3>
      <div className="songs-list">
        <div className="song-list-header">
          <div className="song-number">#</div>
          <div className="song-info">Tiêu đề</div>
          <div className="song-album">Album</div>
          <div className="song-plays">Lượt nghe</div>
          <div className="song-duration">Thời lượng</div>
          <div className="song-actions"></div>
        </div>
        {popularSongs.map((song, index) => (
          <div className="song-item" key={song.id}>
            <div className="song-number">{index + 1}</div>
            <div className="song-info" onClick={() => handlePlaySong(song)}>
              <img src={song.imageUrl} alt={song.title} className="song-image" />
              <div className="song-details">
                <h4>{song.title}</h4>
              </div>
            </div>
            <div className="song-album">
              <Link to={`/album/${song.albumId}`}>{song.album}</Link>
            </div>
            <div className="song-plays">{formatNumber(song.plays)}</div>
            <div className="song-duration">{song.duration}</div>
            <div className="song-actions">
              <button className="action-icon">
                <FaHeart />
              </button>
              <button className="action-icon">
                <FaEllipsisH />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlbums = () => (
    <div className="artist-all-albums glass-effect">
      <h3>Tất cả album</h3>
      <div className="card-grid">
        {albums.map(album => (
          <div className="card-item" key={album.id}>
            <Card {...album} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="artist-full-about glass-effect">
      <h3>Thông tin nghệ sĩ</h3>
      <div className="artist-bio-full">
        <p>{artist.bio}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna ultrices finibus. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisl.</p>
        <p>Nullam eget felis eget urna ultrices finibus. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae nisl.</p>
      </div>
      <div className="artist-genres">
        <h4>Thể loại</h4>
        <div className="genre-tags">
          {artist.genres.map((genre, index) => (
            <Link to={`/genre/${genre.toLowerCase().replace(' ', '-')}`} key={index} className="genre-tag">
              {genre}
            </Link>
          ))}
        </div>
      </div>
      <div className="artist-social">
        <h4>Liên kết</h4>
        <div className="social-links">
          {Object.entries(artist.socialLinks).map(([platform, url]) => (
            <a href={url} target="_blank" rel="noopener noreferrer" key={platform} className="social-link">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'songs':
        return renderSongs();
      case 'albums':
        return renderAlbums();
      case 'about':
        return renderAbout();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="artist-detail-page">
      <div className="artist-header">
        <div className="artist-cover" style={{ backgroundImage: `url(${artist.coverImage})` }}>
          <div className="artist-overlay"></div>
          <div className="artist-profile">
            <div className="artist-profile-image">
              <img src={artist.profileImage} alt={artist.name} />
            </div>
            <div className="artist-profile-info">
              <h1>{artist.name}</h1>
              <div className="artist-stats-brief">
                <span>{formatNumber(artist.monthlyListeners)} người nghe hàng tháng</span>
                <span className="dot">•</span>
                <span>{formatNumber(artist.followers)} người theo dõi</span>
              </div>
              <div className="artist-actions">
                <button className="play-btn" onClick={handlePlayPopularSong}>
                  <FaPlay /> Phát
                </button>
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`} 
                  onClick={toggleFollow}
                >
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
                <button className="more-btn">
                  <FaEllipsisH />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="artist-tabs glass-effect">
        <button 
          className={`artist-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Tổng quan
        </button>
        <button 
          className={`artist-tab ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          Bài hát
        </button>
        <button 
          className={`artist-tab ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          Album
        </button>
        <button 
          className={`artist-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Giới thiệu
        </button>
      </div>

      <div className="artist-content">
        {renderContent()}
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

export default ArtistDetail;
