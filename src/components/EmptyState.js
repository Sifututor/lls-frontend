// src/components/EmptyState.js
import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState({ 
  icon, 
  title, 
  description, 
  actionText, 
  actionLink,
  onAction,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`} style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E5E7EB'
    }}>
      {icon && (
        <div className="empty-icon" style={{ marginBottom: '24px' }}>
          {typeof icon === 'string' ? (
            <img src={icon} alt="" style={{ width: '120px', height: '120px', opacity: 0.6 }} />
          ) : (
            icon
          )}
        </div>
      )}
      <h3 className="empty-title" style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#163300',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      {description && (
        <p className="empty-description" style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '24px'
        }}>
          {description}
        </p>
      )}
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#9FE870',
          color: '#163300',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}>
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn-primary" style={{
          padding: '12px 24px',
          background: '#9FE870',
          color: '#163300',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
