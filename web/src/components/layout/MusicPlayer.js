import React, { useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedoAlt, FaHeart } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(30);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <div className="music-player glass-effect">
      <div className="container player-container">
        <div className="player-left">
          <div className="current-song">
            <img 
              src="https://via.placeholder.com/60" 
              alt="Album Cover" 
              className="song-cover"
            />
            <div className="song-info">
              <h4 className="song-title">Tên Bài Hát</h4>
              <p className="song-artist">Tên Nghệ Sĩ</p>
            </div>
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <FaHeart />
          </button>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className="control-btn">
              <FaRandom />
            </button>
            <button className="control-btn">
              <FaStepBackward />
            </button>
            <button className="control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn">
              <FaStepForward />
            </button>
            <button className="control-btn">
              <FaRedoAlt />
            </button>
          </div>

          <div className="progress-container">
            <span className="time current">1:23</span>
            <div className="progress-bar">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="progress-input"
              />
              <div 
                className="progress-filled" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="time total">4:10</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-container">
            <FaVolumeUp className="volume-icon" />
            <div className="volume-bar">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-input"
              />
              <div 
                className="volume-filled" 
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 