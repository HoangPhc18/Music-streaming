import React, { useState, useEffect } from 'react';
import { FaUsers, FaMusic, FaMicrophone, FaCompactDisc, FaList, FaUser } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    artists: 0,
    albums: 0,
    playlists: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be API calls to your backend
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setStats({
          users: 125,
          songs: 450,
          artists: 48,
          albums: 62,
          playlists: 94
        });
        
        setRecentActivity([
          { id: 1, type: 'user', action: 'registered', name: 'John Doe', timestamp: '2 hours ago' },
          { id: 2, type: 'song', action: 'added', name: 'New Song Title', artist: 'Artist Name', timestamp: '3 hours ago' },
          { id: 3, type: 'album', action: 'updated', name: 'Album Title', artist: 'Artist Name', timestamp: '5 hours ago' },
          { id: 4, type: 'playlist', action: 'created', name: 'Summer Hits', user: 'User123', timestamp: '1 day ago' },
          { id: 5, type: 'artist', action: 'added', name: 'New Artist', timestamp: '2 days ago' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon songs">
            <FaMusic />
          </div>
          <div className="stat-info">
            <h3>Songs</h3>
            <p className="stat-number">{stats.songs}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon artists">
            <FaMicrophone />
          </div>
          <div className="stat-info">
            <h3>Artists</h3>
            <p className="stat-number">{stats.artists}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon albums">
            <FaCompactDisc />
          </div>
          <div className="stat-info">
            <h3>Albums</h3>
            <p className="stat-number">{stats.albums}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon playlists">
            <FaList />
          </div>
          <div className="stat-info">
            <h3>Playlists</h3>
            <p className="stat-number">{stats.playlists}</p>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type}`}>
                {activity.type === 'user' && <FaUser />}
                {activity.type === 'song' && <FaMusic />}
                {activity.type === 'album' && <FaCompactDisc />}
                {activity.type === 'playlist' && <FaList />}
                {activity.type === 'artist' && <FaMicrophone />}
              </div>
              <div className="activity-details">
                <p>
                  {activity.type === 'user' && (
                    <span><strong>{activity.name}</strong> {activity.action}</span>
                  )}
                  {activity.type === 'song' && (
                    <span>Song <strong>{activity.name}</strong> by {activity.artist} was {activity.action}</span>
                  )}
                  {activity.type === 'album' && (
                    <span>Album <strong>{activity.name}</strong> by {activity.artist} was {activity.action}</span>
                  )}
                  {activity.type === 'playlist' && (
                    <span>Playlist <strong>{activity.name}</strong> was {activity.action} by {activity.user}</span>
                  )}
                  {activity.type === 'artist' && (
                    <span>Artist <strong>{activity.name}</strong> was {activity.action}</span>
                  )}
                </p>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 