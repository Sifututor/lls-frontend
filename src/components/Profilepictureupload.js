import React from 'react';

function Profilepictureupload({ avatar, onImageUpload, uploadInfo }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-profile-section">
      <h2 className="edit-profile-section-title">Update Profile Picture</h2>
      <div className="edit-profile-picture-row">
        <img 
          src={avatar} 
          alt="Profile" 
          className="edit-profile-avatar" 
        />
        <div className="edit-profile-upload-info">
          <h3 className="edit-profile-upload-title">Upload Picture</h3>
          <p className="edit-profile-upload-desc">
            File Size: Maximum {uploadInfo.maxSize} • File Format: {uploadInfo.formats}
          </p>
          <label htmlFor="profile-upload" className="edit-profile-btn-browse">
           <img src="/assets/images/icons/upload.svg" alt="Profile" class="edit-profile-upload"></img>
            Browse
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Profilepictureupload;
