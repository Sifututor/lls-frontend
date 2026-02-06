import React from 'react';
import { showWarning } from '../utils/toast';

function Profilepictureupload({ avatar, onImageUpload, uploadInfo }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showWarning('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        showWarning('Only JPG and PNG files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Pass both base64 preview and actual file
        onImageUpload(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-section-title">Update Profile Picture</h2>
      <div className="edit-profile-picture-row">
        <img
          src={avatar || '/assets/images/icons/Ellipse 3.svg'}
          alt="Profile"
          className="edit-profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/icons/Ellipse 3.svg';
          }}
        />
        <div className="edit-profile-upload-info">
          <h3 className="edit-profile-upload-title">Upload Picture</h3>
          <p className="edit-profile-upload-desc">
            File Size: Maximum {uploadInfo?.maxSize || '5MB'} • File Format: {uploadInfo?.formats || 'JPG, PNG'}
          </p>
          <label htmlFor="profile-upload" className="edit-profile-btn-browse">
            <img 
              src="/assets/images/icons/upload.svg" 
              alt="Upload" 
              className="edit-profile-upload"
              onError={(e) => e.target.style.display = 'none'}
            />
            Browse
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Profilepictureupload;