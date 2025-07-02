import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaHeart } from 'react-icons/fa';
import './Card.css';

const Card = ({ 
  id, 
  type, 
  title, 
  subtitle, 
  imageUrl, 
  link 
}) => {
  return (
    <div className="card glass-effect" data-type={type}>
      <Link to={link} className="card-link">
        <div className="card-image-container">
          <img src={imageUrl} alt={title} className="card-image" />
          <div className="card-overlay">
            <button className="card-play-btn">
              <FaPlay />
            </button>
          </div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </Link>
      <button className="card-favorite">
        <FaHeart />
      </button>
    </div>
  );
};

export default Card; 