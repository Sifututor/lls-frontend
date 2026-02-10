// src/components/Deleteaccountcard.js
import React, { useState } from 'react';
import Deleteaccountmodal from './Deleteaccountmodal';

function Deleteaccountcard() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
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
      </div>

      {/* Delete Account Modal - Same as Profile page */}
      <Deleteaccountmodal 
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Deleteaccountcard;