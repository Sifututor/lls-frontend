import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const COMING_SOON = 'This feature is coming soon.';
const DEMO_NOTE = 'This page shows demo data. Real subscription features coming soon.';

function Premiumsubscription() {
  const navigate = useNavigate();

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

  const handleRegenerateLink = () => {
    toast.info(COMING_SOON);
  };

  const handleCopyLink = () => {
    const link = premiumSubscriptionData?.parentAccessLink;
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
                link={premiumSubscriptionData.parentAccessLink}
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

export default Premiumsubscription;