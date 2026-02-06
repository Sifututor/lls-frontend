// src/components/PremiumGate.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';

function PremiumGate({ children, feature, showUpgradeButton = true }) {
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  if (isPremium) {
    return children;
  }

  // Feature-specific lock messages
  const featureMessages = {
    'post-qa': 'Upgrade to Premium to ask questions',
    'live-class': 'Upgrade to Premium to join live classes',
    'speed-control': 'Speed control available with Premium',
    'bookmarks': 'Bookmarks available with Premium',
    'download': 'Downloads available with Premium',
    'unlimited-ai': 'Upgrade for unlimited AI questions',
  };

  return (
    <div className="premium-locked" style={{ 
      padding: '20px', 
      textAlign: 'center', 
      background: '#FEF3C7', 
      borderRadius: '8px',
      border: '1px solid #FCD34D',
      margin: '16px 0'
    }}>
      <span className="lock-icon" style={{ fontSize: '24px', marginRight: '8px' }}>🔒</span>
      <span className="lock-message" style={{ color: '#92400E', marginRight: '12px' }}>
        {featureMessages[feature] || 'Premium feature'}
      </span>
      {showUpgradeButton && (
        <button 
          className="btn-upgrade-small"
          onClick={() => navigate('/student/subscription')}
          style={{
            padding: '8px 16px',
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Upgrade
        </button>
      )}
    </div>
  );
}

export default PremiumGate;

