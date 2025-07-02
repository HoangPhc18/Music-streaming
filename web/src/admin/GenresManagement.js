import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './GenresManagement.css';
import './AdminStyles.css';

const GenresManagement = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3a86ff'
  });

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'color', 
      label: 'Color', 
      sortable: false,
      render: (genre) => (
        <div className="color-preview" style={{ backgroundColor: genre.color || '#ddd' }}></div>
      )
    },
    { 
      key: 'songs_count', 
      label: 'Songs',
      render: (genre) => genre.songs_count || 0
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockGenres = [
        {
          id: 1,
          name: 'Rock',
          description: 'Rock music is a broad genre of popular music that originated as "rock and roll" in the United States in the late 1940s and early 1950s.',
          color: '#e63946',
          songs_count: 25
        },
        {
          id: 2,
          name: 'Pop',
          description: 'Pop is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom.',
          color: '#4cc9f0',
          songs_count: 42
        },
        {
          id: 3,
          name: 'Jazz',
          description: 'Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana, in the late 19th and early 20th centuries.',
          color: '#f77f00',
          songs_count: 18
        },
        {
          id: 4,
          name: 'Electronic',
          description: 'Electronic music is music that employs electronic musical instruments, digital instruments, or circuitry-based music technology.',
          color: '#9b5de5',
          songs_count: 30
        },
        {
          id: 5,
          name: 'Classical',
          description: 'Classical music is art music produced or rooted in the traditions of Western culture, including both liturgical and secular music.',
          color: '#8d99ae',
          songs_count: 15
        }
      ];
      
      setGenres(mockGenres);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddGenre = () => {
    setCurrentGenre(null);
    setFormData({
      name: '',
      description: '',
      color: '#3a86ff'
    });
    setIsModalOpen(true);
  };

  const handleEditGenre = (genre) => {
    setCurrentGenre(genre);
    setFormData({
      name: genre.name,
      description: genre.description || '',
      color: genre.color || '#3a86ff'
    });
    setIsModalOpen(true);
  };

  const handleViewGenre = (genre) => {
    // In a real app, this might navigate to a detailed view
    alert(`
      Genre: ${genre.name}
      Description: ${genre.description || 'No description available'}
      Songs: ${genre.songs_count || 0}
    `);
  };

  const handleDeleteGenre = (genre) => {
    if (window.confirm(`Are you sure you want to delete "${genre.name}"?`)) {
      // In a real app, this would be an API call
      setGenres(genres.filter(g => g.id !== genre.id));
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
      alert('Please enter a genre name');
      return;
    }
    
    // In a real app, this would be an API call
    if (currentGenre) {
      // Update existing genre
      const updatedGenres = genres.map(genre => 
        genre.id === currentGenre.id ? 
        { ...genre, ...formData, songs_count: genre.songs_count } : 
        genre
      );
      setGenres(updatedGenres);
    } else {
      // Add new genre
      const newGenre = {
        id: Math.max(...genres.map(g => g.id), 0) + 1,
        ...formData,
        songs_count: 0
      };
      setGenres([...genres, newGenre]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="genres-management">
      <DataTable
        title="Genres Management"
        columns={columns}
        data={genres}
        loading={loading}
        error={error}
        onAdd={handleAddGenre}
        onEdit={handleEditGenre}
        onDelete={handleDeleteGenre}
        onView={handleViewGenre}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentGenre ? 'Edit Genre' : 'Add New Genre'}</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
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
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleFormChange}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={handleFormChange}
                    name="color"
                    className="color-text"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {currentGenre ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresManagement; 