import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
    const token = localStorage.getItem('token');
    if (token) {
      getUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const getUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setCurrentUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: email,
        password
      });
      
      const { token, user_id, username } = response.data;
      localStorage.setItem('token', token);
      
      // Lấy thông tin chi tiết của người dùng
      await getUserProfile(token);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Đăng nhập thất bại. Vui lòng thử lại.');
      return { success: false, error: error };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8000/api/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessages = err.response?.data;
      setError(errorMessages || 'Đăng ký thất bại. Vui lòng thử lại.');
      return { success: false, error: errorMessages };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 