// src/pages/Editprofile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Profilepictureupload from '../components/Profilepictureupload';
import Personalinformationform from '../components/Personalinformationform';
import Passwordsecuritysection from '../components/Passwordsecuritysection';
import { updateUserProfile } from '../store/slices/authSlice';
import {
  useGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation,
  useChangePasswordMutation,
} from '../store/api/authApi';
import { SectionLoader, ButtonLoader } from '../components/ui/LoadingSpinner';
import { showSuccess, showError, showWarning } from '../utils/toast';

function Editprofile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: accountData, isLoading, isError, refetch } = useGetAccountSettingsQuery();
  const [updateAccountSettings, { isLoading: isSaving }] = useUpdateAccountSettingsMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    dob: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Populate form when data loads
  useEffect(() => {
    if (accountData?.status && accountData?.data) {
      const { user, profile } = accountData.data;
      
      setFormData({
        firstName: profile?.first_name || user?.name || '',
        lastName: profile?.last_name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
        country: profile?.country || '',
        dob: profile?.dob || ''
      });

      // Set profile image — API returns full URL like http://10.0.0.178:8000/uploads/...
      if (profile?.profile_image) {
        setProfileImage(profile.profile_image);
      } else {
        setProfileImage('/assets/images/icons/Ellipse 3.svg');
      }
    }
  }, [accountData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageData, file) => {
    setProfileImage(imageData);
    setImageFile(file);
  };

  // Password Update
  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showWarning('Passwords do not match!');
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showWarning('Please fill all password fields');
      return;
    }

    try {
      const result = await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword
      }).unwrap();

      if (result.status) {
        showSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showError(result.message || 'Failed to update password');
      }
    } catch (err) {
      showError(err?.data?.message || 'Failed to update password');
    }
  };

  const handleCancel = () => {
    navigate('/student/profile');
  };

  // Save profile handler
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.firstName);
      formDataToSend.append('last_name', formData.lastName);
      formDataToSend.append('phone', formData.phone ?? '');
      formDataToSend.append('country', formData.country ?? '');
      formDataToSend.append('dob', formData.dob ?? '');
      if (imageFile) {
        formDataToSend.append('profile_image', imageFile);
      }

      const result = await updateAccountSettings(formDataToSend).unwrap();


      if (result.status) {
        // Update Redux state — updateUserProfile handles all response formats
        dispatch(updateUserProfile(result.data));

        // Also force refetch the account settings cache
        refetch();

        showSuccess('Profile updated successfully!');
        navigate('/student/profile');
      } else {
        showError(result.message || 'Failed to save changes');
      }
    } catch (err) {
      showError(err?.data?.message || 'Update failed');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="edit-profile-container">
        <SectionLoader message="Loading profile..." height="400px" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="edit-profile-container">
        <div className="edit-profile-error">
          <p>Failed to load profile data</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      {/* Page Header */}
      <div className="edit-profile-header">
        <button 
          className="back-btn" 
          onClick={handleCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
        >
          ← Back to Profile
        </button>
        <h1 className="edit-profile-title">Edit Profile</h1>
        <p className="edit-profile-subtitle">
          Update your personal information and profile settings.
        </p>
      </div>

      {/* Profile Picture Upload */}
      <Profilepictureupload
        avatar={profileImage}
        onImageUpload={handleImageUpload}
        uploadInfo={{ maxSize: '5MB', formats: 'JPG, PNG' }}
      />

      {/* Personal Information */}
      <Personalinformationform
        formData={formData}
        onChange={handleInputChange}
      />

      {/* Password & Security */}
      <Passwordsecuritysection
        securityLevel="strong"
        passwordData={passwordData}
        onPasswordChange={setPasswordData}
        onUpdate={handlePasswordUpdate}
      />

      {/* Action Buttons */}
      <div className="edit-profile-actions">
        <button 
          className="btn-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button 
          className="btn-save"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? <ButtonLoader text="Saving..." /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default Editprofile;