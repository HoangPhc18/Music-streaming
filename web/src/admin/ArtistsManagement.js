import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './ArtistsManagement.css';
import './AdminStyles.css';

const ArtistsManagement = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image: ''
  });

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'image', 
      label: 'Image', 
      sortable: false,
      render: (artist) => (
        artist.image ? 
        <img 
          src={artist.image} 
          alt={artist.name} 
          className="artist-thumbnail" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
        /> : 
        <div className="no-image">No Image</div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created At',
      render: (artist) => new Date(artist.created_at).toLocaleDateString()
    }
  ];

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockArtists = [
        {
          id: 1,
          name: 'The Beatles',
          bio: 'The Beatles were an English rock band formed in Liverpool in 1960.',
          image: 'https://via.placeholder.com/150?text=Beatles',
          created_at: '2023-01-15T12:00:00Z',
          updated_at: '2023-01-15T12:00:00Z'
        },
        {
          id: 2,
          name: 'Queen',
          bio: 'Queen are a British rock band formed in London in 1970.',
          image: 'https://via.placeholder.com/150?text=Queen',
          created_at: '2023-01-16T12:00:00Z',
          updated_at: '2023-01-16T12:00:00Z'
        },
        {
          id: 3,
          name: 'Miles Davis',
          bio: 'Miles Dewey Davis III was an American jazz trumpeter, bandleader, and composer.',
          image: 'https://via.placeholder.com/150?text=Miles+Davis',
          created_at: '2023-01-17T12:00:00Z',
          updated_at: '2023-01-17T12:00:00Z'
        },
        {
          id: 4,
          name: 'Daft Punk',
          bio: 'Daft Punk were a French electronic music duo formed in 1993 in Paris.',
          image: 'https://via.placeholder.com/150?text=Daft+Punk',
          created_at: '2023-01-18T12:00:00Z',
          updated_at: '2023-01-18T12:00:00Z'
        }
      ];
      
      setArtists(mockArtists);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError('Failed to load artists. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddArtist = () => {
    setCurrentArtist(null);
    setFormData({
      name: '',
      bio: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleEditArtist = (artist) => {
    setCurrentArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio || '',
      image: artist.image || ''
    });
    setIsModalOpen(true);
  };

  const handleViewArtist = (artist) => {
    // In a real app, this might navigate to a detailed view
    alert(`Viewing artist: ${artist.name}`);
  };

  const handleDeleteArtist = (artist) => {
    if (window.confirm(`Are you sure you want to delete ${artist.name}?`)) {
      // In a real app, this would be an API call
      setArtists(artists.filter(a => a.id !== artist.id));
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
    
    if (!formData.name.trim()) {
      alert('Artist name is required');
      return;
    }
    
    // In a real app, this would be an API call
    if (currentArtist) {
      // Update existing artist
      const updatedArtists = artists.map(artist => 
        artist.id === currentArtist.id ? 
        { ...artist, ...formData, updated_at: new Date().toISOString() } : 
        artist
      );
      setArtists(updatedArtists);
    } else {
      // Add new artist
      const newArtist = {
        id: Math.max(...artists.map(a => a.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setArtists([...artists, newArtist]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="artists-management">
      <DataTable
        title="Artists Management"
        columns={columns}
        data={artists}
        loading={loading}
        error={error}
        onAdd={handleAddArtist}
        onEdit={handleEditArtist}
        onDelete={handleDeleteArtist}
        onView={handleViewArtist}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentArtist ? 'Edit Artist' : 'Add New Artist'}</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                />
              </div>
              {formData.image && (
                <div className="image-preview">
                  <img 
                    src={formData.image} 
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
                  {currentArtist ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistsManagement; 