import React, { useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import './SongsManagement.css';
import './AdminStyles.css';

const SongsManagement = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    album_id: '',
    genre_id: '',
    file_path: '',
    duration: '',
    cover_image: '',
    release_date: ''
  });

  // Define columns for the DataTable
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { 
      key: 'artist_id', 
      label: 'Artist',
      render: (song) => {
        const artist = artists.find(a => a.id === song.artist_id);
        return artist ? artist.name : 'Unknown';
      }
    },
    { 
      key: 'album_id', 
      label: 'Album',
      render: (song) => {
        const album = albums.find(a => a.id === song.album_id);
        return album ? album.title : 'N/A';
      }
    },
    { 
      key: 'genre_id', 
      label: 'Genre',
      render: (song) => {
        const genre = genres.find(g => g.id === song.genre_id);
        return genre ? genre.name : 'N/A';
      }
    },
    { 
      key: 'duration', 
      label: 'Duration',
      render: (song) => {
        const minutes = Math.floor(song.duration / 60);
        const seconds = song.duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    },
    { 
      key: 'cover_image', 
      label: 'Cover', 
      sortable: false,
      render: (song) => (
        song.cover_image ? 
        <img 
          src={song.cover_image} 
          alt={song.title} 
          className="song-thumbnail" 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
        /> : 
        <div className="no-image">No Image</div>
      )
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
        { id: 1, title: 'Abbey Road', artist_id: 1 },
        { id: 2, title: 'A Night at the Opera', artist_id: 2 },
        { id: 3, title: 'Kind of Blue', artist_id: 3 },
        { id: 4, title: 'Random Access Memories', artist_id: 4 }
      ];
      
      const mockGenres = [
        { id: 1, name: 'Rock' },
        { id: 2, name: 'Pop' },
        { id: 3, name: 'Jazz' },
        { id: 4, name: 'Electronic' },
        { id: 5, name: 'Classical' }
      ];
      
      const mockSongs = [
        {
          id: 1,
          title: 'Come Together',
          artist_id: 1,
          album_id: 1,
          genre_id: 1,
          file_path: 'come_together.mp3',
          duration: 259,
          cover_image: 'https://via.placeholder.com/150?text=Abbey+Road',
          release_date: '1969-09-26'
        },
        {
          id: 2,
          title: 'Something',
          artist_id: 1,
          album_id: 1,
          genre_id: 1,
          file_path: 'something.mp3',
          duration: 182,
          cover_image: 'https://via.placeholder.com/150?text=Abbey+Road',
          release_date: '1969-09-26'
        },
        {
          id: 3,
          title: 'Bohemian Rhapsody',
          artist_id: 2,
          album_id: 2,
          genre_id: 1,
          file_path: 'bohemian_rhapsody.mp3',
          duration: 355,
          cover_image: 'https://via.placeholder.com/150?text=Night+Opera',
          release_date: '1975-10-31'
        },
        {
          id: 4,
          title: 'So What',
          artist_id: 3,
          album_id: 3,
          genre_id: 3,
          file_path: 'so_what.mp3',
          duration: 547,
          cover_image: 'https://via.placeholder.com/150?text=Kind+Blue',
          release_date: '1959-08-17'
        },
        {
          id: 5,
          title: 'Get Lucky',
          artist_id: 4,
          album_id: 4,
          genre_id: 4,
          file_path: 'get_lucky.mp3',
          duration: 248,
          cover_image: 'https://via.placeholder.com/150?text=RAM',
          release_date: '2013-04-19'
        }
      ];
      
      setArtists(mockArtists);
      setAlbums(mockAlbums);
      setGenres(mockGenres);
      setSongs(mockSongs);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddSong = () => {
    setCurrentSong(null);
    setFormData({
      title: '',
      artist_id: '',
      album_id: '',
      genre_id: '',
      file_path: '',
      duration: '',
      cover_image: '',
      release_date: ''
    });
    setIsModalOpen(true);
  };

  const handleEditSong = (song) => {
    setCurrentSong(song);
    setFormData({
      title: song.title,
      artist_id: song.artist_id,
      album_id: song.album_id || '',
      genre_id: song.genre_id || '',
      file_path: song.file_path,
      duration: song.duration,
      cover_image: song.cover_image || '',
      release_date: song.release_date || ''
    });
    setIsModalOpen(true);
  };

  const handleViewSong = (song) => {
    // In a real app, this might navigate to a detailed view
    const artist = artists.find(a => a.id === song.artist_id);
    const album = albums.find(a => a.id === song.album_id);
    const genre = genres.find(g => g.id === song.genre_id);
    
    alert(`
      Song: ${song.title}
      Artist: ${artist ? artist.name : 'Unknown'}
      Album: ${album ? album.title : 'N/A'}
      Genre: ${genre ? genre.name : 'N/A'}
      Duration: ${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}
      Release Date: ${song.release_date || 'N/A'}
    `);
  };

  const handleDeleteSong = (song) => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      // In a real app, this would be an API call
      setSongs(songs.filter(s => s.id !== song.id));
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
    
    if (!formData.title.trim() || !formData.artist_id || !formData.file_path || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, this would be an API call
    if (currentSong) {
      // Update existing song
      const updatedSongs = songs.map(song => 
        song.id === currentSong.id ? 
        { ...song, ...formData } : 
        song
      );
      setSongs(updatedSongs);
    } else {
      // Add new song
      const newSong = {
        id: Math.max(...songs.map(s => s.id), 0) + 1,
        ...formData
      };
      setSongs([...songs, newSong]);
    }
    
    setIsModalOpen(false);
  };

  // Format seconds to mm:ss
  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Parse mm:ss to seconds
  const parseDuration = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

  return (
    <div className="songs-management">
      <DataTable
        title="Songs Management"
        columns={columns}
        data={songs}
        loading={loading}
        error={error}
        onAdd={handleAddSong}
        onEdit={handleEditSong}
        onDelete={handleDeleteSong}
        onView={handleViewSong}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentSong ? 'Edit Song' : 'Add New Song'}</h3>
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
                <label htmlFor="album_id">Album</label>
                <select
                  id="album_id"
                  name="album_id"
                  value={formData.album_id}
                  onChange={handleFormChange}
                >
                  <option value="">Select Album</option>
                  {albums
                    .filter(album => !formData.artist_id || album.artist_id === parseInt(formData.artist_id))
                    .map(album => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="genre_id">Genre</label>
                <select
                  id="genre_id"
                  name="genre_id"
                  value={formData.genre_id}
                  onChange={handleFormChange}
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="file_path">File Path *</label>
                <input
                  type="text"
                  id="file_path"
                  name="file_path"
                  value={formData.file_path}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duration (mm:ss) *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration ? formatDuration(formData.duration) : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*:[0-5]?[0-9]?$/.test(value) || value === '') {
                      setFormData({
                        ...formData,
                        duration: value ? parseDuration(value) : ''
                      });
                    }
                  }}
                  placeholder="3:45"
                  required
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
                <label htmlFor="release_date">Release Date</label>
                <input
                  type="date"
                  id="release_date"
                  name="release_date"
                  value={formData.release_date}
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
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  {currentSong ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsManagement; 