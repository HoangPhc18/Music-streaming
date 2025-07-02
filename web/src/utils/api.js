import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (profileData) => api.put('/users/profile/', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password/', passwordData),
};

// Artists services
export const artistService = {
  getAll: (params) => api.get('/artists/', { params }),
  getById: (id) => api.get(`/artists/${id}/`),
  getSongs: (id) => api.get(`/artists/${id}/songs/`),
  getAlbums: (id) => api.get(`/artists/${id}/albums/`),
};

// Albums services
export const albumService = {
  getAll: (params) => api.get('/albums/', { params }),
  getById: (id) => api.get(`/albums/${id}/`),
  getSongs: (id) => api.get(`/albums/${id}/songs/`),
};

// Songs services
export const songService = {
  getAll: (params) => api.get('/songs/', { params }),
  getById: (id) => api.get(`/songs/${id}/`),
  search: (query) => api.get(`/songs/search/`, { params: { q: query } }),
  getStreamUrl: (id) => api.get(`/songs/${id}/play_url/`),
};

// Genres services
export const genreService = {
  getAll: () => api.get('/genres/'),
  getById: (id) => api.get(`/genres/${id}/`),
  getSongs: (id) => api.get(`/genres/${id}/songs/`),
};

// Playlists services
export const playlistService = {
  getAll: () => api.get('/playlists/'),
  getUserPlaylists: () => api.get('/users/playlists/'),
  getById: (id) => api.get(`/playlists/${id}/`),
  create: (playlistData) => api.post('/playlists/', playlistData),
  update: (id, playlistData) => api.put(`/playlists/${id}/`, playlistData),
  delete: (id) => api.delete(`/playlists/${id}/`),
  addSong: (playlistId, songId) => api.post(`/playlists/${playlistId}/songs/`, { song_id: songId }),
  removeSong: (playlistId, songId) => api.delete(`/playlists/${playlistId}/songs/${songId}/`),
};

// Favorites services
export const favoriteService = {
  getAll: () => api.get('/favorites/'),
  add: (songId) => api.post('/favorites/', { song_id: songId }),
  remove: (favoriteId) => api.delete(`/favorites/${favoriteId}/`),
};

// Play history services
export const historyService = {
  getAll: () => api.get('/history/'),
};

export default api; 