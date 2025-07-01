import React, { useState } from 'react';
import { FaUserEdit, FaKey, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data
  const userData = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: 'https://via.placeholder.com/150',
    joinDate: '01/01/2023',
    playCount: 1240,
    favoriteGenre: 'Nhạc Trẻ'
  };

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

  const renderProfileInfo = () => (
    <div className="profile-info glass-effect">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userData.avatar} alt={userData.name} />
        </div>
        <div className="profile-details">
          <h2>{userData.name}</h2>
          <p className="profile-email">{userData.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.playCount}</span>
              <span className="stat-label">Bài hát đã nghe</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.favoriteGenre}</span>
              <span className="stat-label">Thể loại yêu thích</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.joinDate}</span>
              <span className="stat-label">Ngày tham gia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => (
    <div className="edit-profile glass-effect">
      <h3>Chỉnh sửa thông tin</h3>
      <form className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Tên hiển thị</label>
          <input 
            type="text" 
            id="name" 
            className="form-control" 
            defaultValue={userData.name} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-control" 
            defaultValue={userData.email} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Ảnh đại diện</label>
          <div className="avatar-upload">
            <img src={userData.avatar} alt="Avatar" className="avatar-preview" />
            <input type="file" id="avatar" className="avatar-input" />
            <button type="button" className="btn btn-secondary">Chọn ảnh</button>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Hủy</button>
          <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );

  const renderChangePassword = () => (
    <div className="change-password glass-effect">
      <h3>Đổi mật khẩu</h3>
      <form className="password-form">
        <div className="form-group">
          <label htmlFor="current-password">Mật khẩu hiện tại</label>
          <input type="password" id="current-password" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">Mật khẩu mới</label>
          <input type="password" id="new-password" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
          <input type="password" id="confirm-password" className="form-control" />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Hủy</button>
          <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
        </div>
      </form>
    </div>
  );

  const renderPlayHistory = () => (
    <div className="play-history">
      <h3>Lịch sử nghe nhạc</h3>
      <div className="history-filter">
        <button className="btn btn-secondary active">Hôm nay</button>
        <button className="btn btn-secondary">Tuần này</button>
        <button className="btn btn-secondary">Tháng này</button>
        <button className="btn btn-secondary">Tất cả</button>
      </div>
      <div className="songs-list glass-effect">
        <div className="song-list-header">
          <div className="song-info">Tiêu đề</div>
          <div className="song-album">Album</div>
          <div className="song-time">Thời gian nghe</div>
        </div>
        {recentlyPlayed.map((song) => (
          <div className="song-item" key={song.id}>
            <div className="song-info">
              <img src={song.imageUrl} alt={song.title} className="song-image" />
              <div className="song-details">
                <h4>{song.title}</h4>
                <p>{song.subtitle}</p>
              </div>
            </div>
            <div className="song-album">Chúng Ta Của Hiện Tại</div>
            <div className="song-time">Hôm nay, 14:30</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            {renderProfileInfo()}
            <div className="section">
              <h3 className="section-title">Đã nghe gần đây</h3>
              <div className="card-grid">
                {recentlyPlayed.map(item => (
                  <div className="card-item" key={item.id}>
                    <Card {...item} />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'edit':
        return renderEditProfile();
      case 'password':
        return renderChangePassword();
      case 'history':
        return renderPlayHistory();
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="login-prompt glass-effect">
        <h2>Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem thông tin cá nhân.</p>
        <button className="btn btn-primary">Đăng nhập</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-sidebar glass-effect">
        <button 
          className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-text">Thông tin cá nhân</span>
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          <FaUserEdit className="sidebar-icon" />
          <span className="sidebar-text">Chỉnh sửa thông tin</span>
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaKey className="sidebar-icon" />
          <span className="sidebar-text">Đổi mật khẩu</span>
        </button>
        <button 
          className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory className="sidebar-icon" />
          <span className="sidebar-text">Lịch sử nghe nhạc</span>
        </button>
        <button 
          className="sidebar-item logout"
          onClick={logout}
        >
          <FaSignOutAlt className="sidebar-icon" />
          <span className="sidebar-text">Đăng xuất</span>
        </button>
      </div>
      <div className="profile-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile; 