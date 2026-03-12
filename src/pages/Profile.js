import React, { useState, useCallback } from 'react';
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
import {
  useLogoutMutation,
  useGetParentAccessQuery,
  useGenerateParentAccessMutation,
  useRegenerateParentAccessMutation,
} from '../store/api/authApi';

const COMING_SOON = 'This feature is coming soon.';

const DEFAULT_AVATAR = '/assets/images/icons/Ellipse 3.svg';

function extractLinkFromResponse(data) {
  if (!data) return null;
  const link = data?.data?.link ?? data?.link ?? data?.data?.url ?? data?.url;
  if (link && typeof link === 'string') return link;
  const token =
    data?.data?.token ??
    data?.token ??
    data?.data?.data?.token ??
    data?.data?.accessToken ??
    data?.accessToken ??
    data?.data?.access_token ??
    data?.access_token ??
    data?.data?.data?.accessToken ??
    data?.data?.data?.access_token;
  if (!token || typeof window === 'undefined') return null;
  return `${window.location.origin}/parent-access/${token}`;
}

function buildParentLink(token) {
  if (!token || typeof window === 'undefined') return null;
  return `${window.location.origin}/parent-access/${token}`;
}

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();
  const isStudent = currentUser?.user_type === 'student';
  const { data: parentAccessData, refetch: refetchParentAccess } = useGetParentAccessQuery(undefined, { skip: !isStudent });
  const [generateLink, { isLoading: generating }] = useGenerateParentAccessMutation();
  const [regenerateLink, { isLoading: regenerating }] = useRegenerateParentAccessMutation();
  const [freshLink, setFreshLink] = useState(null);

  const tokenFromApi =
    parentAccessData?.data?.token ??
    parentAccessData?.token ??
    parentAccessData?.data?.data?.token ??
    parentAccessData?.data?.accessToken ??
    parentAccessData?.accessToken ??
    parentAccessData?.data?.access_token ??
    parentAccessData?.access_token ??
    parentAccessData?.data?.data?.accessToken ??
    parentAccessData?.data?.data?.access_token;
  const linkFromApi =
    parentAccessData?.data?.link ??
    parentAccessData?.link ??
    (tokenFromApi ? buildParentLink(tokenFromApi) : null);

  const storedLink =
    typeof window !== 'undefined' ? window.localStorage.getItem('parentAccessLink') : null;

  const parentAccessLink = linkFromApi || freshLink || storedLink;

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
    plans: null,
    parentAccessLink,
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

  const handleRegenerateLink = useCallback(async () => {
    try {
      const result = parentAccessLink
        ? await regenerateLink().unwrap()
        : await generateLink().unwrap();
      const link = extractLinkFromResponse(result);
      if (link) {
        setFreshLink(link);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('parentAccessLink', link);
        }
      }
      refetchParentAccess();
      toast.success(parentAccessLink ? 'Link regenerated' : 'Link generated');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to generate link');
    }
  }, [parentAccessLink, generateLink, regenerateLink, refetchParentAccess]);

  const handleCopyLink = () => {
    const link = profileData.parentAccessLink;
    if (link) {
      navigator.clipboard.writeText(link).then(() => toast.success('Link copied')).catch(() => toast.error('Could not copy'));
    } else {
      toast.info('Generate a link first');
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
                isGenerating={generating || regenerating}
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