import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Profilecard from '../components/Profilecard';
import Studentemailcard from '../components/Studentemailcard';
import Logoutbutton from '../components/Logoutbutton';
import Plansection from '../components/Plansection';
import Parentaccesscard from '../components/Parentaccesscard';
import Dataprivacycard from '../components/Dataprivacycard';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/api/authApi';

const COMING_SOON = 'This feature is coming soon.';

const DEFAULT_AVATAR = '/assets/images/icons/Ellipse 3.svg';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  const profileData = {
    user: {
      name: currentUser?.profile
        ? `${currentUser.profile.first_name || ''} ${currentUser.profile.last_name || ''}`.trim() || currentUser?.name
        : currentUser?.name || 'Student',
      email: (currentUser?.profile?.email ?? currentUser?.email) || '',
      avatar: currentUser?.profile?.profile_image || currentUser?.avatar || DEFAULT_AVATAR,
      bio: currentUser?.profile?.bio || '',
      location: currentUser?.profile?.country || '',
      contactEmail: currentUser?.profile?.email || currentUser?.email || '',
      timezone: currentUser?.profile?.timezone || '',
      isPremium: currentUser?.is_premium === true || currentUser?.is_premium === '1',
    },
    // Remove static plans data - will be from API or empty
    plans: null,
    parentAccessLink: null,
  };

  const handleEditProfile = () => {
    navigate('/student/profile/edit');
  };

  const handleSubmitEmail = () => {};

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
    logoutApi().catch(() => {});
  };

  const handleUpgradePlan = () => {
    navigate('/student/subscription');
  };

  const handleRegenerateLink = () => {
    toast.info(COMING_SOON);
  };

  const handleCopyLink = () => {
    const link = profileData.parentAccessLink;
    if (link) {
      navigator.clipboard.writeText(link).then(() => toast.success('Link copied')).catch(() => toast.error('Could not copy'));
    } else {
      toast.info(COMING_SOON);
    }
  };

  const handleDownloadData = () => {
    toast.info(COMING_SOON);
  };

  const handleDeleteAccount = () => {
    toast.info(COMING_SOON);
  };

  return (
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
  );
}

export default Profile;