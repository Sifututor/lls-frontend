// src/components/GlobalLoader.js
import React from 'react';
import './GlobalLoader.css';

function GlobalLoader({ message }) {
  return (
    <div className="loading-screen">
      <div className="loading-screen-content">
        <div className="loading-screen-icon">
          {/* SVG Book Icon */}
          <img src="/assets/images/loading.gif" alt="loading" />

        </div>
        {message && (
          <p className="loading-screen-text">{message} fhfghfhfgh</p>
        )}
      </div>
    </div>
  );
}

export default GlobalLoader;