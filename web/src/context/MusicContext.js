import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { songService } from '../utils/api';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = async (song) => {
    try {
      // Nếu song đã có URL, phát trực tiếp
      if (song.url) {
        setCurrentSong(song);
        setIsPlaying(true);
        return;
      }
      
      // Nếu không có URL, lấy URL stream từ API
      const response = await songService.getStreamUrl(song.id);
      const songWithUrl = {
        ...song,
        url: response.data.url
      };
      
      setCurrentSong(songWithUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error getting song URL:', error);
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!playlist.length) return;

    const currentIndex = playlist.findIndex(song => song.id === currentSong?.id);
    
    if (shuffle) {
      // Phát ngẫu nhiên
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      
      playSong(playlist[randomIndex]);
    } else {
      // Phát bài tiếp theo trong danh sách
      const nextIndex = (currentIndex + 1) % playlist.length;
      playSong(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (!playlist.length) return;

    const currentIndex = playlist.findIndex(song => song.id === currentSong?.id);
    
    if (shuffle) {
      // Phát ngẫu nhiên
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      
      playSong(playlist[randomIndex]);
    } else {
      // Phát bài trước đó trong danh sách
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      playSong(playlist[prevIndex]);
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

  const handleEnded = () => {
    if (repeat) {
      // Lặp lại bài hiện tại
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      // Phát bài tiếp theo
      playNext();
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const addToPlaylist = (song) => {
    if (!playlist.some(item => item.id === song.id)) {
      setPlaylist([...playlist, song]);
    }
  };

  const removeFromPlaylist = (songId) => {
    setPlaylist(playlist.filter(song => song.id !== songId));
  };

  const value = {
    currentSong,
    playlist,
    isPlaying,
    volume,
    duration,
    currentTime,
    repeat,
    shuffle,
    audioRef,
    playSong,
    pauseSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    addToPlaylist,
    removeFromPlaylist,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </MusicContext.Provider>
  );
};

export default MusicContext; 