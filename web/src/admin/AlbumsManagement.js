import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './AlbumsManagement.css';
import './AdminStyles.css';

const AlbumsManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    cover_image: '',
    release_date: '',
    description: ''
  });

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { 
      key: 'artist_id', 
      label: 'Artist',
      render: (album) => {
        const artist = artists.find(a => a.id === album.artist_id);
        return artist ? artist.name : 'Unknown';
      }
    },
    { 
      key: 'release_date', 
      label: 'Release Date',
      render: (album) => album.release_date || 'N/A'
    },
    { 
      key: 'cover_image', 
      label: 'Cover', 
      sortable: false,
      render: (album) => (
        album.cover_image ? 
        <img 
          src={album.cover_image} 
          alt={album.title} 
          className="album-thumbnail" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
        /> : 
        <div className="no-image">No Image</div>
      )
    },
    { 
      key: 'songs_count', 
      label: 'Songs',
      render: (album) => album.songs_count || 0
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
      
      const mockArtists = [
        { id: 1, name: 'The Beatles' },
        { id: 2, name: 'Queen' },
        { id: 3, name: 'Miles Davis' },
        { id: 4, name: 'Daft Punk' }
      ];
      
      const mockAlbums = [
        {
          id: 1,
          title: 'Abbey Road',
          artist_id: 1,
          cover_image: 'https://via.placeholder.com/150?text=Abbey+Road',
          release_date: '1969-09-26',
          description: 'Abbey Road is the eleventh studio album by the English rock band the Beatles.',
          songs_count: 17
        },
        {
          id: 2,
          title: 'A Night at the Opera',
          artist_id: 2,
          cover_image: 'https://via.placeholder.com/150?text=Night+Opera',
          release_date: '1975-11-21',
          description: 'A Night at the Opera is the fourth studio album by the British rock band Queen.',
          songs_count: 12
        },
        {
          id: 3,
          title: 'Kind of Blue',
          artist_id: 3,
          cover_image: 'https://via.placeholder.com/150?text=Kind+Blue',
          release_date: '1959-08-17',
          description: 'Kind of Blue is a studio album by American jazz trumpeter Miles Davis.',
          songs_count: 5
        },
        {
          id: 4,
          title: 'Random Access Memories',
          artist_id: 4,
          cover_image: 'https://via.placeholder.com/150?text=RAM',
          release_date: '2013-05-17',
          description: 'Random Access Memories is the fourth studio album by French electronic music duo Daft Punk.',
          songs_count: 13
        }
      ];
      
      setArtists(mockArtists);
      setAlbums(mockAlbums);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddAlbum = () => {
    setCurrentAlbum(null);
    setFormData({
      title: '',
      artist_id: '',
      cover_image: '',
      release_date: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEditAlbum = (album) => {
    setCurrentAlbum(album);
    setFormData({
      title: album.title,
      artist_id: album.artist_id,
      cover_image: album.cover_image || '',
      release_date: album.release_date || '',
      description: album.description || ''
    });
    setIsModalOpen(true);
  };

  const handleViewAlbum = (album) => {
    // In a real app, this might navigate to a detailed view
    const artist = artists.find(a => a.id === album.artist_id);
    
    alert(`
      Album: ${album.title}
      Artist: ${artist ? artist.name : 'Unknown'}
      Release Date: ${album.release_date || 'N/A'}
      Songs: ${album.songs_count || 0}
      Description: ${album.description || 'No description available'}
    `);
  };

  const handleDeleteAlbum = (album) => {
    if (window.confirm(`Are you sure you want to delete "${album.title}"?`)) {
      // In a real app, this would be an API call
      setAlbums(albums.filter(a => a.id !== album.id));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.artist_id) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would be an API call
    if (currentAlbum) {
      // Update existing album
      const updatedAlbums = albums.map(album => 
        album.id === currentAlbum.id ? 
        { ...album, ...formData, songs_count: album.songs_count } : 
        album
      );
      setAlbums(updatedAlbums);
    } else {
      // Add new album
      const newAlbum = {
        id: Math.max(...albums.map(a => a.id), 0) + 1,
        ...formData,
        songs_count: 0
      };
      setAlbums([...albums, newAlbum]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="albums-management">
      <DataTable
        title="Albums Management"
        columns={columns}
        data={albums}
        loading={loading}
        error={error}
        onAdd={handleAddAlbum}
        onEdit={handleEditAlbum}
        onDelete={handleDeleteAlbum}
        onView={handleViewAlbum}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentAlbum ? 'Edit Album' : 'Add New Album'}</h3>
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
                <label htmlFor="artist_id">Artist *</label>
                <select
                  id="artist_id"
                  name="artist_id"
                  value={formData.artist_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="release_date">Release Date</label>
                <input
                  type="date"
                  id="release_date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleFormChange}
                />
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
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
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
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {currentAlbum ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumsManagement;