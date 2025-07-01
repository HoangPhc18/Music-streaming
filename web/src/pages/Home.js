import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import Card from '../components/ui/Card';
import './Home.css';

const Home = () => {
  // Mock data
  const featuredPlaylists = [
    {
      id: 1,
      title: 'Top Hits Việt Nam',
      subtitle: 'Những bài hát thịnh hành nhất',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/1'
    },
    {
      id: 2,
      title: 'Chill & Relax',
      subtitle: 'Thư giãn với những bản nhạc nhẹ nhàng',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/2'
    },
    {
      id: 3,
      title: 'Workout Motivation',
      subtitle: 'Năng lượng cho buổi tập của bạn',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/3'
    },
    {
      id: 4,
      title: 'K-Pop Hits',
      subtitle: 'Những bản hit K-Pop đang thịnh hành',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/playlist/4'
    }
  ];

  const newReleases = [
    {
      id: 1,
      title: 'Hạ Còn Vương Nắng',
      subtitle: 'DATKAA, KIDO',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/1'
    },
    {
      id: 2,
      title: 'Waiting For You',
      subtitle: 'MONO',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/2'
    },
    {
      id: 3,
      title: 'Có Chơi Có Chịu',
      subtitle: 'KARIK, ONLY C',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/3'
    },
    {
      id: 4,
      title: 'Tiny Love',
      subtitle: 'Thịnh Suy',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/song/4'
    }
  ];

  const popularArtists = [
    {
      id: 1,
      title: 'Sơn Tùng M-TP',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/1'
    },
    {
      id: 2,
      title: 'Bích Phương',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/2'
    },
    {
      id: 3,
      title: 'Hoàng Thùy Linh',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/3'
    },
    {
      id: 4,
      title: 'Đen Vâu',
      subtitle: 'Nghệ sĩ',
      imageUrl: 'https://via.placeholder.com/300',
      link: '/artist/4'
    }
  ];

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
              <Card {...playlist} type="playlist" />
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
              <Card {...song} type="song" />
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
              <Card {...artist} type="artist" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 