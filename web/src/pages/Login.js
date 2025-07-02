import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setErrorMessage(result.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card glass-effect">
        <div className="auth-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng trở lại với Melodify</p>
        </div>
        
        {errorMessage && (
          <div className="auth-error">
            {errorMessage}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email hoặc tên đăng nhập</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email hoặc tên đăng nhập"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-action">
            <button 
              type="submit" 
              className="btn-primary auth-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
        
        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">Quên mật khẩu?</Link>
          <div className="auth-separator">
            <span>hoặc</span>
          </div>
          <div className="auth-redirect">
            Chưa có tài khoản? <Link to="/register" className="auth-link highlight">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 