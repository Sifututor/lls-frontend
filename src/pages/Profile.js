import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Profilecard from '../components/Profilecard';
import Studentemailcard from '../components/Studentemailcard';
import Logoutbutton from '../components/Logoutbutton';
import Plansection from '../components/Plansection';
import Parentaccesscard from '../components/Parentaccesscard';
import Dataprivacycard from '../components/Dataprivacycard';
import { profileData } from '../data/Profiledata';

function Profile() {
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleSubmitEmail = (email) => {
    console.log('Submitting email:', email);
  };

  const handleLogout = () => {
    console.log('Logging out');
    // Logout logic
  };

  const handleUpgradePlan = () => {
    console.log('Upgrading to premium');
  };

  const handleRegenerateLink = () => {
    console.log('Regenerating parent access link');
  };

  const handleCopyLink = () => {
    console.log('Copying link');
    navigator.clipboard.writeText(profileData.parentAccessLink);
  };

  const handleDownloadData = () => {
    console.log('Downloading user data');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account clicked');
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Profile" />

        <div className="profile-page-container">
          {/* Page Header */}
          <div className="profile-page-header">
            <h1 className="profile-page-title">Profile</h1>
          </div>

          {/* Two Column Layout */}
          <div className="profile-content-grid">
            {/* Left Column */}
            <div className="profile-left-column">
              <Profilecard
                userData={profileData.user}
                onEditProfile={handleEditProfile}
              />

              <Studentemailcard onSubmit={handleSubmitEmail} />

              <Logoutbutton onLogout={handleLogout} />
            </div>

            {/* Right Column */}
            <div className="profile-right-column">
              <Plansection
                plansData={profileData.plans}
                onUpgrade={handleUpgradePlan}
              />

              <Parentaccesscard
                link={profileData.parentAccessLink}
                onRegenerate={handleRegenerateLink}
                onCopy={handleCopyLink}
              />

              <Dataprivacycard
                onDownload={handleDownloadData}
                onDelete={handleDeleteAccount}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;