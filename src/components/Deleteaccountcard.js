// src/components/Deleteaccountcard.js
import React, { useState } from 'react';

function Deleteaccountcard() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    // API call will go here
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="settings-section-card delete-account-section">
      <div className="delete-account-content">
        <div className="delete-account-info">
          <h2 className="delete-account-title">Delete this Account</h2>
          <p className="delete-account-warning">
            Deleting your account will permanently erase your learning progress, enrolled courses, certificates, and account data.
          </p>
        </div>
        <button className="btn-delete-account" onClick={handleDeleteClick}>
          Delete Account
        </button>
      </div>

      {showConfirmation && (
        <div className="delete-confirmation-modal-overlay">
          <div className="delete-confirmation-modal">
            <h3 className="modal-title">Delete Account?</h3>
            <p className="modal-message">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deleteaccountcard;