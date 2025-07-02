import React, { useState, useRef, useEffect } from 'react';
import './SongPreview.css';

const SongPreview = ({ file, metadata, onMetadataChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const audioUrl = file ? URL.createObjectURL(file) : null;

  useEffect(() => {
    return () => {
      // Clean up the object URL when component unmounts
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    onMetadataChange(name, value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="song-preview">
      <div className="preview-header">
        <h3>Song Preview</h3>
      </div>
      
      <div className="preview-content">
        <div className="audio-player">
          <audio 
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />
          
          <div className="player-controls">
            <button 
              className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayPause}
              disabled={!audioUrl}
            >
              {isPlaying ? 
                <i className="fas fa-pause"></i> : 
                <i className="fas fa-play"></i>
              }
            </button>
            
            <div className="time-controls">
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="time-slider"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!audioUrl}
              />
              <span className="duration">{formatTime(duration)}</span>
            </div>
            
            <div className="volume-controls">
              <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'}`}></i>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                disabled={!audioUrl}
              />
            </div>
          </div>
        </div>
        
        <div className="metadata-editor">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={metadata.title || ''}
              onChange={handleMetadataChange}
              placeholder="Song title"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={metadata.artist || ''}
                onChange={handleMetadataChange}
                placeholder="Artist name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                value={metadata.album || ''}
                onChange={handleMetadataChange}
                placeholder="Album name"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={metadata.genre || ''}
                onChange={handleMetadataChange}
                placeholder="Genre"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={metadata.year || ''}
                onChange={handleMetadataChange}
                placeholder="Release year"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="file-details">
        <div className="detail-item">
          <span className="detail-label">File Name:</span>
          <span className="detail-value">{file?.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">File Size:</span>
          <span className="detail-value">{file ? formatFileSize(file.size) : 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">File Type:</span>
          <span className="detail-value">{file?.type}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Duration:</span>
          <span className="detail-value">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default SongPreview; 