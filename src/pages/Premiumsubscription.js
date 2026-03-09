import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Profilecard from '../components/Profilecard';
import Studentemailcard from '../components/Studentemailcard';
import Logoutbutton from '../components/Logoutbutton';
import Subscriptioncard from '../components/Subscriptioncard';
import Usagestatscard from '../components/Usagestatscard';
import Billingdetailscard from '../components/Billingdetailscard';
import Billinghistorycard from '../components/Billinghistorycard';
import Parentaccesscard from '../components/Parentaccesscard';
import Dataprivacycard from '../components/Dataprivacycard';
import { premiumSubscriptionData } from '../data/Premiumsubscriptiondata';
import { useGetParentAccessQuery, useGenerateParentAccessMutation, useRegenerateParentAccessMutation } from '../store/api/authApi';
import { selectCurrentUser } from '../store/slices/authSlice';

const COMING_SOON = 'This feature is coming soon.';
const DEMO_NOTE = 'This page shows demo data. Real subscription features coming soon.';

function extractLinkFromResponse(data) {
  if (!data) return null;
  const link = data?.data?.link ?? data?.link ?? data?.data?.url ?? data?.url;
  if (link && typeof link === 'string') return link;
  const token = data?.data?.token ?? data?.token ?? data?.data?.data?.token;
  if (token && typeof window !== 'undefined') return `${window.location.origin}/student/activate/${token}`;
  return null;
}

function buildParentLink(token) {
  if (!token || typeof window === 'undefined') return null;
  return `${window.location.origin}/student/activate/${token}`;
}

function Premiumsubscription() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isStudent = currentUser?.user_type === 'student';
  const { data: parentAccessData, refetch: refetchParentAccess } = useGetParentAccessQuery(undefined, { skip: !isStudent });
  const [generateLink, { isLoading: generating }] = useGenerateParentAccessMutation();
  const [regenerateLink, { isLoading: regenerating }] = useRegenerateParentAccessMutation();
  const [freshLink, setFreshLink] = useState(null);

  const tokenFromApi = parentAccessData?.data?.token ?? parentAccessData?.token ?? parentAccessData?.data?.data?.token;
  const linkFromApi = tokenFromApi ? buildParentLink(tokenFromApi) : null;
  const parentAccessLink = linkFromApi || freshLink;

  const handleEditProfile = () => {
    navigate('/student/profile/edit');
  };

  const handleSubmitEmail = () => {};
  const handleLogout = () => {
    navigate('/');
  };

  const handleChangePlan = () => {
    toast.info(COMING_SOON);
  };

  const handleDownloadReceipt = () => {
    toast.info(COMING_SOON);
  };

  const handleDownloadAll = () => {
    toast.info(COMING_SOON);
  };

  const handleRegenerateLink = useCallback(async () => {
    try {
      const result = parentAccessLink
        ? await regenerateLink().unwrap()
        : await generateLink().unwrap();
      const link = extractLinkFromResponse(result);
      if (link) setFreshLink(link);
      refetchParentAccess();
      toast.success(parentAccessLink ? 'Link regenerated' : 'Link generated');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to generate link');
    }
  }, [parentAccessLink, generateLink, regenerateLink, refetchParentAccess]);

  const handleCopyLink = () => {
    const link = parentAccessLink;
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
            <h1 className="profile-page-title">Subscription</h1>
            <p className="profile-page-subtitle" style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>{DEMO_NOTE}</p>
          </div>

          {/* Two Column Layout */}
          <div className="profile-content-grid">
            {/* Left Column - Reuse Profile Components */}
            <div className="profile-left-column">
              <Profilecard
                userData={premiumSubscriptionData.user}
                onEditProfile={handleEditProfile}
              />

              <Studentemailcard onSubmit={handleSubmitEmail} />

              <Logoutbutton onLogout={handleLogout} />
            </div>

            {/* Right Column - Subscription Content */}
            <div className="profile-right-column">
              <Subscriptioncard
                subscriptionData={premiumSubscriptionData.subscription}
                onChangePlan={handleChangePlan}
              />

              <Usagestatscard usageData={premiumSubscriptionData.usage} />

              <Billingdetailscard billingData={premiumSubscriptionData.billing} />

              <Billinghistorycard
                historyData={premiumSubscriptionData.history}
                onDownloadReceipt={handleDownloadReceipt}
                onDownloadAll={handleDownloadAll}
              />

              <Parentaccesscard
                link={parentAccessLink}
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

export default Premiumsubscription;