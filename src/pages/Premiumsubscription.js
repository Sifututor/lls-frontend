import React from 'react';
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

function Premiumsubscription() {
  const handleEditProfile = () => {};

  const handleSubmitEmail = () => {};

  const handleLogout = () => {};

  const handleChangePlan = () => {};

  const handleDownloadReceipt = () => {};

  const handleDownloadAll = () => {};

  const handleRegenerateLink = () => {};

  const handleCopyLink = () => {
    navigator.clipboard.writeText(premiumSubscriptionData.parentAccessLink);
  };

  const handleDownloadData = () => {};

  const handleDeleteAccount = () => {};

  return (
    <div className="profile-page-container">
          {/* Page Header */}
          <div className="profile-page-header">
            <h1 className="profile-page-title">Profile</h1>
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