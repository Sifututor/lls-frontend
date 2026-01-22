// src/components/Dataprivacycard.js
import React, { useState } from 'react';
import Deleteaccountmodal from './Deleteaccountmodal';

function Dataprivacycard({ onDownload }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="profile-card-box">
        <h3 className="profile-card-heading">Data & Privacy (PDPA)</h3>

        <div className="profile-privacy-buttons">
          <button className="profile-btn-download-data" onClick={onDownload}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 15V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V15M12 3V15M12 15L7 10M12 15L17 10" stroke="#163300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download My Data</span>
          </button>

          <button className="profile-btn-delete-account" onClick={handleDeleteClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#DD4040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Delete Account</span>
          </button>
        </div>

        <p className="profile-privacy-note">
          Please refer <strong>Terms & Conditions</strong> or <strong>Privacy Policy</strong>
        </p>
      </div>

      {/* Delete Account Modal */}
      <Deleteaccountmodal 
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Dataprivacycard;