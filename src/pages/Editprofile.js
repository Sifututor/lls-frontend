import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Profilepictureupload from '../components/Profilepictureupload';
import Personalinformationform from '../components/Personalinformationform';
import Passwordsecuritysection from '../components/Passwordsecuritysection';
import { editProfileData } from '../data/Editprofiledata';

function Editprofile() {
  const [formData, setFormData] = useState({
    fullName: editProfileData.user.fullName,
    email: editProfileData.user.email,
    phone: editProfileData.user.phone,
    school: editProfileData.user.school
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileImage, setProfileImage] = useState(editProfileData.user.avatar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageData) => {
    setProfileImage(imageData);
    console.log('Profile image updated');
  };

  const handlePasswordUpdate = () => {
    console.log('Password updated successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Profile" breadcrumb="Edit Profile" />

        <div className="edit-profile-container">
          {/* Page Header */}
          <div className="edit-profile-header">
            <h1 className="edit-profile-title">Edit Profile</h1>
            <p className="edit-profile-subtitle">
              Manage your Premium subscription, billing, and payment methods.
            </p>
          </div>

          {/* Profile Picture Upload */}
          <Profilepictureupload
            avatar={profileImage}
            onImageUpload={handleImageUpload}
            uploadInfo={editProfileData.uploadInfo}
          />

          {/* Personal Information */}
          <Personalinformationform
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Password & Security */}
          <Passwordsecuritysection
            securityLevel={editProfileData.user.securityLevel}
            passwordData={passwordData}
            onPasswordChange={setPasswordData}
            onUpdate={handlePasswordUpdate}
          />
        </div>
      </main>
    </>
  );
}

export default Editprofile;