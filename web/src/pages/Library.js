import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEllipsisH } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import './Library.css';

const Library = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const { currentUser } = useAuth();

  // Mock data
  const userPlaylists = [
    {
      id: 1,
      title: 'Nhạc yêu thích',
      subtitle: '32 bài hát',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/1',
      type: 'playlist'
    },
    {
      id: 2,
      title: 'Nhạc để code',
      subtitle: '18 bài hát',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/2',
      type: 'playlist'
    },
    {
      id: 3,
      title: 'Workout',
      subtitle: '24 bài hát',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/3',
      type: 'playlist'
    }
  ];

  const recentlyPlayed = [
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

  const favoriteArtists = [
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
    }
  ];

  const favoriteAlbums = [
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
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return (
          <>
            <div className="library-header">
              <h2>Playlist của tôi</h2>
              <button className="create-btn">
                <FaPlus /> Tạo playlist
              </button>
            </div>
            <div className="card-grid">
              {userPlaylists.map(playlist => (
                <div className="card-item" key={playlist.id}>
                  <Card {...playlist} />
                </div>
              ))}
              <div className="card-item">
                <div className="create-playlist-card glass-effect">
                  <div className="create-playlist-content">
                    <FaPlus className="create-icon" />
                    <p>Tạo playlist mới</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'songs':
        return (
          <>
            <div className="library-header">
              <h2>Bài hát yêu thích</h2>
            </div>
            <div className="songs-list glass-effect">
              <div className="song-list-header">
                <div className="song-number">#</div>
                <div className="song-info">Tiêu đề</div>
                <div className="song-album">Album</div>
                <div className="song-date">Ngày thêm</div>
                <div className="song-duration">Thời lượng</div>
                <div className="song-actions"></div>
              </div>
              {recentlyPlayed.map((song, index) => (
                <div className="song-item" key={song.id}>
                  <div className="song-number">{index + 1}</div>
                  <div className="song-info">
                    <img src={song.imageUrl} alt={song.title} className="song-image" />
                    <div className="song-details">
                      <h4>{song.title}</h4>
                      <p>{song.subtitle}</p>
                    </div>
                  </div>
                  <div className="song-album">Chúng Ta Của Hiện Tại</div>
                  <div className="song-date">23/06/2023</div>
                  <div className="song-duration">3:45</div>
                  <div className="song-actions">
                    <button className="action-btn">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 'artists':
        return (
          <>
            <div className="library-header">
              <h2>Nghệ sĩ yêu thích</h2>
            </div>
            <div className="card-grid">
              {favoriteArtists.map(artist => (
                <div className="card-item" key={artist.id}>
                  <Card {...artist} />
                </div>
              ))}
            </div>
          </>
        );
      case 'albums':
        return (
          <>
            <div className="library-header">
              <h2>Album yêu thích</h2>
            </div>
            <div className="card-grid">
              {favoriteAlbums.map(album => (
                <div className="card-item" key={album.id}>
                  <Card {...album} />
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="library-page">
      <div className="library-tabs glass-effect">
        <button 
          className={`library-tab ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlist
        </button>
        <button 
          className={`library-tab ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          Bài hát
        </button>
        <button 
          className={`library-tab ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          Nghệ sĩ
        </button>
        <button 
          className={`library-tab ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          Album
        </button>
      </div>

      <div className="library-content">
        {currentUser ? (
          renderContent()
        ) : (
          <div className="login-prompt glass-effect">
            <h2>Đăng nhập để xem thư viện của bạn</h2>
            <p>Đăng nhập để lưu playlist, theo dõi nghệ sĩ yêu thích và nhiều hơn nữa.</p>
            <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library; 