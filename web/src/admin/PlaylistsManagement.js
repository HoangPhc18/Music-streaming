import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './PlaylistsManagement.css';
import './AdminStyles.css';

const PlaylistsManagement = () => {
  const [playlists, setPlaylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id: '',
    is_public: true,
    cover_image: '',
    songs: []
  });
  const [selectedSongs, setSelectedSongs] = useState([]);

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'cover_image', 
      label: '', 
      sortable: false,
      render: (playlist) => (
        playlist.cover_image ? 
        <img 
          src={playlist.cover_image} 
          alt={playlist.title} 
          className="playlist-thumbnail" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Playlist'; }}
        /> : 
        <div className="no-image">
          <i className="fas fa-music"></i>
        </div>
      )
    },
    { key: 'title', label: 'Title' },
    { 
      key: 'user_id', 
      label: 'Created By',
      render: (playlist) => {
        const user = users.find(u => u.id === playlist.user_id);
        return user ? user.username : 'Unknown';
      }
    },
    { 
      key: 'is_public', 
      label: 'Visibility',
      render: (playlist) => (
        <span className={`visibility-badge ${playlist.is_public ? 'public' : 'private'}`}>
          {playlist.is_public ? 'Public' : 'Private'}
        </span>
      )
    },
    { 
      key: 'songs_count', 
      label: 'Songs',
      render: (playlist) => playlist.songs?.length || 0
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (playlist) => {
        if (!playlist.created_at) return 'N/A';
        const date = new Date(playlist.created_at);
        return date.toLocaleDateString();
      }
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In a real app, these would be API calls
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers = [
        { id: 1, username: 'admin', email: 'admin@example.com' },
        { id: 2, username: 'johndoe', email: 'john.doe@example.com' },
        { id: 3, username: 'janedoe', email: 'jane.doe@example.com' }
      ];
      
      const mockSongs = [
        { id: 1, title: 'Come Together', artist_id: 1, artist_name: 'The Beatles' },
        { id: 2, title: 'Something', artist_id: 1, artist_name: 'The Beatles' },
        { id: 3, title: 'Bohemian Rhapsody', artist_id: 2, artist_name: 'Queen' },
        { id: 4, title: 'So What', artist_id: 3, artist_name: 'Miles Davis' },
        { id: 5, title: 'Get Lucky', artist_id: 4, artist_name: 'Daft Punk' }
      ];
      
      const mockPlaylists = [
        {
          id: 1,
          title: 'My Favorites',
          description: 'A collection of my favorite songs',
          user_id: 2,
          is_public: true,
          cover_image: 'https://via.placeholder.com/150?text=Favorites',
          created_at: '2023-04-15T10:30:00Z',
          songs: [1, 3, 5]
        },
        {
          id: 2,
          title: 'Chill Vibes',
          description: 'Perfect for relaxing',
          user_id: 3,
          is_public: true,
          cover_image: 'https://via.placeholder.com/150?text=Chill',
          created_at: '2023-04-20T14:45:00Z',
          songs: [2, 4]
        },
        {
          id: 3,
          title: 'Private Collection',
          description: 'My personal collection',
          user_id: 2,
          is_public: false,
          cover_image: '',
          created_at: '2023-05-05T09:15:00Z',
          songs: [1, 2, 3, 4]
        }
      ];
      
      setUsers(mockUsers);
      setSongs(mockSongs);
      setPlaylists(mockPlaylists);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddPlaylist = () => {
    setCurrentPlaylist(null);
    setFormData({
      title: '',
      description: '',
      user_id: '',
      is_public: true,
      cover_image: '',
      songs: []
    });
    setSelectedSongs([]);
    setIsModalOpen(true);
  };

  const handleEditPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setFormData({
      title: playlist.title,
      description: playlist.description || '',
      user_id: playlist.user_id,
      is_public: playlist.is_public,
      cover_image: playlist.cover_image || '',
      songs: playlist.songs || []
    });
    setSelectedSongs(playlist.songs || []);
    setIsModalOpen(true);
  };

  const handleViewPlaylist = (playlist) => {
    // In a real app, this might navigate to a detailed view
    const user = users.find(u => u.id === playlist.user_id);
    const playlistSongs = songs.filter(song => playlist.songs?.includes(song.id));
    
    const songsList = playlistSongs.map(song => `- ${song.title} (${song.artist_name})`).join('\n');
    
    alert(`
      Playlist: ${playlist.title}
      Description: ${playlist.description || 'No description'}
      Created by: ${user ? user.username : 'Unknown'}
      Visibility: ${playlist.is_public ? 'Public' : 'Private'}
      Created: ${playlist.created_at ? new Date(playlist.created_at).toLocaleDateString() : 'N/A'}
      Songs (${playlistSongs.length}):
      ${songsList || 'No songs in this playlist'}
    `);
  };

  const handleDeletePlaylist = (playlist) => {
    if (window.confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
      // In a real app, this would be an API call
      setPlaylists(playlists.filter(p => p.id !== playlist.id));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSongToggle = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter(id => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.user_id) {
      alert('Please fill in all required fields');
      return;
    }
    
    const updatedFormData = {
      ...formData,
      songs: selectedSongs
    };
    
    // In a real app, this would be an API call
    if (currentPlaylist) {
      // Update existing playlist
      const updatedPlaylists = playlists.map(playlist => 
        playlist.id === currentPlaylist.id ? 
        { 
          ...playlist, 
          ...updatedFormData,
          created_at: playlist.created_at
        } : 
        playlist
      );
      setPlaylists(updatedPlaylists);
    } else {
      // Add new playlist
      const newPlaylist = {
        id: Math.max(...playlists.map(p => p.id), 0) + 1,
        ...updatedFormData,
        created_at: new Date().toISOString()
      };
      setPlaylists([...playlists, newPlaylist]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="playlists-management">
      <DataTable
        title="Playlists Management"
        columns={columns}
        data={playlists}
        loading={loading}
        error={error}
        onAdd={handleAddPlaylist}
        onEdit={handleEditPlaylist}
        onDelete={handleDeletePlaylist}
        onView={handleViewPlaylist}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentPlaylist ? 'Edit Playlist' : 'Add New Playlist'}</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="user_id">Created By *</label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_public"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleFormChange}
                />
                <label htmlFor="is_public">Public Playlist</label>
              </div>
              
              <div className="form-group">
                <label htmlFor="cover_image">Cover Image URL</label>
                <input
                  type="text"
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleFormChange}
                />
              </div>
              
              {formData.cover_image && (
                <div className="image-preview">
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Preview'; }}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Songs</label>
                <div className="songs-selection">
                  {songs.map(song => (
                    <div key={song.id} className="song-item">
                      <input
                        type="checkbox"
                        id={`song-${song.id}`}
                        checked={selectedSongs.includes(song.id)}
                        onChange={() => handleSongToggle(song.id)}
                      />
                      <label htmlFor={`song-${song.id}`}>
                        {song.title} - {song.artist_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {currentPlaylist ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsManagement;