// src/components/ClearChatButton.js
import React from 'react';

function ClearChatButton({ onClear }) {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      onClear();
    }
  };

  return (
    <button 
      className="btn-clear-chat" 
      onClick={handleClear}
      style={{
        padding: '8px 16px',
        background: '#EF4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#DC2626'}
      onMouseOut={(e) => e.currentTarget.style.background = '#EF4444'}
    >
      Clear Chat
    </button>
  );
}

export default ClearChatButton;
