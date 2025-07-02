import React, { useState, useEffect, useRef } from 'react';
import SongPreview from './components/SongPreview';
import { artistService, genreService, albumService, adminService } from '../utils/api';
import './UploadMusic.css';
import './AdminStyles.css';

const UploadMusic = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [songMetadata, setSongMetadata] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    year: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    album_id: '',
    genre_id: '',
    release_date: '',
    is_featured: false,
    is_public: true
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update form data when selected file changes
    if (selectedFiles.length > 0) {
      const currentFile = selectedFiles[currentFileIndex];
      const filename = currentFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
      
      // Try to extract artist and title if filename follows "Artist - Title" format
      const match = filename.match(/^(.*?)\s-\s(.*)$/);
      if (match) {
        const [, artist, title] = match;
        
        // Find artist ID if it exists
        const foundArtist = artists.find(a => a.name?.toLowerCase() === artist.toLowerCase());
        
        setFormData(prev => ({
          ...prev,
          title: title || prev.title,
          artist_id: foundArtist ? foundArtist.id : prev.artist_id
        }));

        setSongMetadata(prev => ({
          ...prev,
          title: title || prev.title,
          artist: artist || prev.artist
        }));
      } else {
        // Just use the filename as title
        setFormData(prev => ({
          ...prev,
          title: filename
        }));

        setSongMetadata(prev => ({
          ...prev,
          title: filename
        }));
      }
    }
  }, [currentFileIndex, selectedFiles, artists]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch artists, albums, and genres from API
      const [artistsResponse, albumsResponse, genresResponse] = await Promise.all([
        artistService.getAll(),
        albumService.getAll(),
        genreService.getAll()
      ]);
      
      // Ensure we have arrays for our data
      const artistsData = Array.isArray(artistsResponse.data) ? artistsResponse.data : 
                         (artistsResponse.data?.results || []);
      
      const albumsData = Array.isArray(albumsResponse.data) ? albumsResponse.data : 
                        (albumsResponse.data?.results || []);
      
      const genresData = Array.isArray(genresResponse.data) ? genresResponse.data : 
                        (genresResponse.data?.results || []);
      
      console.log('Artists data:', artistsData);
      console.log('Albums data:', albumsData);
      console.log('Genres data:', genresData);
      
      setArtists(artistsData);
      setAlbums(albumsData);
      setGenres(genresData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
      
      // Fallback to mock data if API fails
      const mockArtists = [
        { id: 1, name: 'The Beatles' },
        { id: 2, name: 'Queen' },
        { id: 3, name: 'Miles Davis' },
        { id: 4, name: 'Daft Punk' }
      ];
      
      const mockAlbums = [
        { id: 1, title: 'Abbey Road', artist: 1 },
        { id: 2, title: 'A Night at the Opera', artist: 2 },
        { id: 3, title: 'Kind of Blue', artist: 3 },
        { id: 4, title: 'Random Access Memories', artist: 4 }
      ];
      
      const mockGenres = [
        { id: 1, name: 'Rock' },
        { id: 2, name: 'Pop' },
        { id: 3, name: 'Jazz' },
        { id: 4, name: 'Electronic' },
        { id: 5, name: 'Classical' }
      ];
      
      setArtists(mockArtists);
      setAlbums(mockAlbums);
      setGenres(mockGenres);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Filter albums by artist if artist_id changes
    if (name === 'artist_id') {
      setFormData(prev => ({
        ...prev,
        album_id: '' // Reset album selection when artist changes
      }));

      // Update metadata artist
      const selectedArtist = artists.find(a => a.id === parseInt(value));
      if (selectedArtist) {
        setSongMetadata(prev => ({
          ...prev,
          artist: selectedArtist.name
        }));
      }
    }

    // Update metadata album
    if (name === 'album_id') {
      const selectedAlbum = albums.find(a => a.id === parseInt(value));
      if (selectedAlbum) {
        setSongMetadata(prev => ({
          ...prev,
          album: selectedAlbum.title
        }));
      }
    }

    // Update metadata genre
    if (name === 'genre_id') {
      const selectedGenre = genres.find(g => g.id === parseInt(value));
      if (selectedGenre) {
        setSongMetadata(prev => ({
          ...prev,
          genre: selectedGenre.name
        }));
      }
    }

    // Update metadata year
    if (name === 'release_date') {
      const year = value ? new Date(value).getFullYear() : '';
      setSongMetadata(prev => ({
        ...prev,
        year
      }));
    }
  };

  const handleMetadataChange = (name, value) => {
    setSongMetadata({
      ...songMetadata,
      [name]: value
    });

    // Update form data based on metadata changes
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value
      }));
    } else if (name === 'artist') {
      const foundArtist = artists.find(a => a.name?.toLowerCase() === value.toLowerCase());
      if (foundArtist) {
        setFormData(prev => ({
          ...prev,
          artist_id: foundArtist.id
        }));
      }
    } else if (name === 'album') {
      const foundAlbum = albums.find(a => a.title?.toLowerCase() === value.toLowerCase());
      if (foundAlbum) {
        setFormData(prev => ({
          ...prev,
          album_id: foundAlbum.id
        }));
      }
    } else if (name === 'genre') {
      const foundGenre = genres.find(g => g.name?.toLowerCase() === value.toLowerCase());
      if (foundGenre) {
        setFormData(prev => ({
          ...prev,
          genre_id: foundGenre.id
        }));
      }
    } else if (name === 'year' && value) {
      // Try to create a date from the year
      try {
        const date = new Date(parseInt(value), 0, 1);
        setFormData(prev => ({
          ...prev,
          release_date: date.toISOString().split('T')[0]
        }));
      } catch (err) {
        console.error('Invalid year:', err);
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'];
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only MP3, WAV, OGG, and FLAC are allowed.`);
        return false;
      }
      return true;
    });
    
    // Validate file size (max 20MB per file)
    const validSizeFiles = validFiles.filter(file => {
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 20MB.`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(validSizeFiles);
    setCurrentFileIndex(0); // Reset to first file
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      
      // If we're removing the current file, adjust the current index
      if (currentFileIndex >= newFiles.length && newFiles.length > 0) {
        setCurrentFileIndex(newFiles.length - 1);
      } else if (newFiles.length === 0) {
        setCurrentFileIndex(0);
        // Reset form data if no files left
        setFormData({
          title: '',
          artist_id: '',
          album_id: '',
          genre_id: '',
          release_date: '',
          is_featured: false,
          is_public: true
        });
        setSongMetadata({
          title: '',
          artist: '',
          album: '',
          genre: '',
          year: ''
        });
      }
      
      return newFiles;
    });
    
    // Reset the file input if all files are removed
    if (selectedFiles.length === 1) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    
    if (!formData.title.trim() || !formData.artist_id || !formData.genre_id) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      setUploading(true);
      
      // Upload each file one by one
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const currentProgress = Math.round((i / selectedFiles.length) * 100);
        setUploadProgress(currentProgress);
        
        // Create form data for API request
        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('title', formData.title);
        apiFormData.append('artist_id', formData.artist_id);
        apiFormData.append('genre_id', formData.genre_id);
        
        if (formData.album_id) {
          apiFormData.append('album_id', formData.album_id);
        }
        
        if (formData.release_date) {
          apiFormData.append('release_date', formData.release_date);
        }
        
        apiFormData.append('is_featured', formData.is_featured);
        apiFormData.append('is_public', formData.is_public);
        
        // Upload file to API
        await adminService.uploadSong(apiFormData);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      setSuccess(`Successfully uploaded ${selectedFiles.length} file(s).`);
      setUploading(false);
      
      // Reset form after successful upload
      setSelectedFiles([]);
      setCurrentFileIndex(0);
      setFormData({
        title: '',
        artist_id: '',
        album_id: '',
        genre_id: '',
        release_date: '',
        is_featured: false,
        is_public: true
      });
      setSongMetadata({
        title: '',
        artist: '',
        album: '',
        genre: '',
        year: ''
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.response?.data?.error || 'Failed to upload files. Please try again.');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const handleNextFile = () => {
    if (currentFileIndex < selectedFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="upload-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="upload-music">
      <h1>Upload Music</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      
      <div className="upload-container">
        <div className="upload-section">
          <h2>Select Files</h2>
          <div className="file-drop-area">
            <input 
              type="file" 
              id="music-files" 
              accept=".mp3,.wav,.ogg,.flac" 
              multiple 
              onChange={handleFileSelect}
              ref={fileInputRef}
              disabled={uploading}
            />
            <label htmlFor="music-files" className={uploading ? 'disabled' : ''}>
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Drag files here or click to browse</span>
              <span className="file-info">MP3, WAV, OGG, FLAC (Max 20MB per file)</span>
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Files ({selectedFiles.length})</h3>
              <ul className="file-list">
                {selectedFiles.map((file, index) => (
                  <li 
                    key={index} 
                    className={`file-item ${index === currentFileIndex ? 'active' : ''}`}
                    onClick={() => setCurrentFileIndex(index)}
                  >
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={uploading}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              
              {selectedFiles.length > 1 && (
                <div className="file-navigation">
                  <button 
                    onClick={handlePreviousFile} 
                    disabled={currentFileIndex === 0 || uploading}
                    className="nav-button"
                  >
                    Previous
                  </button>
                  <span className="file-counter">
                    {currentFileIndex + 1} of {selectedFiles.length}
                  </span>
                  <button 
                    onClick={handleNextFile} 
                    disabled={currentFileIndex === selectedFiles.length - 1 || uploading}
                    className="nav-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="metadata-section">
          <h2>Song Metadata</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                disabled={uploading}
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
                disabled={uploading || artists.length === 0}
              >
                <option value="">Select Artist</option>
                {Array.isArray(artists) && artists.map(artist => (
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
                disabled={!formData.artist_id || uploading || albums.length === 0}
              >
                <option value="">Select Album</option>
                {Array.isArray(albums) && albums
                  .filter(album => !formData.artist_id || album.artist === parseInt(formData.artist_id))
                  .map(album => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="genre_id">Genre *</label>
              <select
                id="genre_id"
                name="genre_id"
                value={formData.genre_id}
                onChange={handleFormChange}
                required
                disabled={uploading || genres.length === 0}
              >
                <option value="">Select Genre</option>
                {Array.isArray(genres) && genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
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
                disabled={uploading}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleFormChange}
                disabled={uploading}
              />
              <label htmlFor="is_featured">Featured Song</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleFormChange}
                disabled={uploading}
              />
              <label htmlFor="is_public">Public Song</label>
            </div>
            
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{uploadProgress}% Uploaded</div>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="upload-button" 
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload Music'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <SongPreview 
          file={selectedFiles[currentFileIndex]} 
          metadata={songMetadata}
          onMetadataChange={handleMetadataChange}
        />
      )}
    </div>
  );
};

export default UploadMusic; 