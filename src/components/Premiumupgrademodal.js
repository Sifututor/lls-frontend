// src/components/Premiumupgrademodal.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Premiumupgrademodal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleUpgradeNow = () => {
    onClose();
    navigate('/premium-subscription');
  };

  if (!isOpen) return null;

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div 
        className={`premium-modal-content ${isOpen ? 'slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="premium-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Crown Image Header */}
        <div className="premium-modal-header">
          <img 
            src="/assets/images/crown-header.png" 
            alt="Premium Crown" 
            className="premium-crown-image"
          />
        </div>

        {/* Content */}
        <div className="premium-modal-body">
          <h2 className="premium-modal-title">Upgrade to Premium</h2>
          <p className="premium-modal-subtitle">
            Unlock your full learning potential 🚀 Get access to all premium features including exclusive courses, 
            advanced tools, live classes, and priority content. Upgrade now and learn without limits.
          </p>

          <h3 className="premium-modal-section-title">Compare Features</h3>

          {/* Features Table */}
          <div className="premium-features-table">
            <div className="premium-table-header">
              <div className="premium-table-col feature-col">Feature</div>
              <div className="premium-table-col free-col">Free</div>
              <div className="premium-table-col premium-col">Premium</div>
            </div>

            <div className="premium-table-body">
              {/* Row 1 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Video Courses (Form 1-5)</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="check-icon gray">✓</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="check-icon green">✓</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Quiz Attempts</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">3 per Day</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="feature-value green">Unlimited</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">AI Tutor Questions</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">5 per Day</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="feature-value green">Unlimited</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Join Live Classes</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">-</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="check-icon green">✓</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Post Video Q&A</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">-</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="check-icon green">✓</span>
                </div>
              </div>

              {/* Row 6 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Video Speed Control</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">-</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="check-icon green">✓</span>
                </div>
              </div>

              {/* Row 7 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Download Materials</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">-</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="check-icon green">✓</span>
                </div>
              </div>

              {/* Row 8 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Live Class Recordings</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">Selected</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="feature-value green">All (Instant)</span>
                </div>
              </div>

              {/* Row 9 */}
              <div className="premium-table-row">
                <div className="premium-table-col feature-col">
                  <span className="feature-name">Support Response</span>
                </div>
                <div className="premium-table-col free-col">
                  <span className="feature-value">24 Hours</span>
                </div>
                <div className="premium-table-col premium-col">
                  <span className="feature-value green">4 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="premium-modal-footer">
          <button className="btn-cancel-premium" onClick={onClose}>
            Cancel
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="btn-upgrade-premium" onClick={handleUpgradeNow}>
            Upgrade Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Premiumupgrademodal;