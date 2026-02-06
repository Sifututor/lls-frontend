// src/components/FlagContentModal.js
import React, { useState, useEffect } from 'react';
import { showWarning } from '../utils/toast';

function FlagContentModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  commentId 
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const flagReasons = [
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'hate-speech', label: 'Hate speech' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      // Reset form
      setSelectedReason('');
      setAdditionalInfo('');
    }, 300);
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      showWarning('Please select a reason');
      return;
    }
    
    setIsAnimating(false);
    setTimeout(() => {
      onConfirm({
        commentId,
        reason: selectedReason,
        additionalInfo
      });
      // Reset form
      setSelectedReason('');
      setAdditionalInfo('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="flag-modal-overlay" onClick={handleClose}>
      <div 
        className={`flag-modal-content ${isAnimating ? 'slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="flag-modal-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header Image */}
        <div className="flag-modal-header">
          <img 
            src="/assets/images/Flag_This_Content.png" 
            alt="Flag Content" 
            className="flag-header-image"
          />
        </div>

        {/* Modal Body */}
        <div className="flag-modal-body">
          <h2 className="flag-modal-title">Flag This Content?</h2>
          
          <p className="flag-modal-description">
            Are you sure you want to flag this content? Please help us improve the platform by selecting a reason for reporting this comment.
          </p>

          {/* Reason Dropdown */}
          <div className="flag-select-wrapper">
            <select 
              className="flag-select"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">Select Reason</option>
              {flagReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            <svg className="flag-select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#163300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Additional Info Textarea */}
          <textarea
            className="flag-textarea"
            placeholder="Share your thoughts..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
          />
        </div>

        {/* Modal Footer */}
        <div className="flag-modal-footer">
          <button className="btn-cancel-flag" onClick={handleClose}>
            Cancel
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-confirm-flag" onClick={handleConfirm}>
            Confirm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlagContentModal;