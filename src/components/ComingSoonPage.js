import React from 'react';
import { Link } from 'react-router-dom';

function ComingSoonPage({ title, description, reason, actionText, actionLink }) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">🚀</div>
        <h1>{title}</h1>
        <p className="coming-soon-desc">{description}</p>
        {reason && (
          <p className="coming-soon-reason">
            <strong>Note:</strong> {reason}
          </p>
        )}
        {actionText && actionLink && (
          <Link to={actionLink} className="coming-soon-btn">
            {actionText}
          </Link>
        )}
      </div>
      <style>{`
        .coming-soon-page { min-height: 400px; display: flex; align-items: center; justify-content: center; padding: 48px 24px; }
        .coming-soon-content { text-align: center; max-width: 480px; }
        .coming-soon-icon { font-size: 64px; margin-bottom: 24px; }
        .coming-soon-page h1 { font-size: 24px; font-weight: 600; color: #163300; margin-bottom: 12px; }
        .coming-soon-desc { font-size: 16px; color: #6B7280; margin-bottom: 16px; line-height: 1.5; }
        .coming-soon-reason { font-size: 14px; color: #9CA3AF; margin-bottom: 24px; line-height: 1.5; padding: 12px; background: #F9FAFB; border-radius: 8px; text-align: left; }
        .coming-soon-btn { display: inline-block; padding: 12px 24px; background: #9FE870; color: #163300; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.2s; }
        .coming-soon-btn:hover { background: #8FD85F; }
      `}</style>
    </div>
  );
}

export default ComingSoonPage;
