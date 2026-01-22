import React from 'react';

function Subscriptioncard({ subscriptionData, onChangePlan }) {
  return (
    <div className="subscription-wrapper">
      <h2 className="subscription-section-heading">My Subscription</h2>
      <p className="subscription-section-subtitle">
        Manage your Premium subscription, billing, and payment methods.
      </p>

      <div className="subscription-premium-card">
        <div className="subscription-premium-header">
          <div className="subscription-premium-title-row">
            <h3 className="subscription-premium-title">Premium Plan</h3>
            <span className="subscription-badge-active">Active</span>
          </div>
          <button className="subscription-btn-change" onClick={onChangePlan}>
            Change Plan →
          </button>
        </div>

        <p className="subscription-premium-price">{subscriptionData.price}</p>

        <div className="subscription-stats-grid">
          <div className="subscription-stat-box">
            <p className="subscription-stat-label">Member Since</p>
            <p className="subscription-stat-value">{subscriptionData.memberSince}</p>
          </div>

          <div className="subscription-stat-box">
            <p className="subscription-stat-label">Next Billing</p>
            <p className="subscription-stat-value">{subscriptionData.nextBilling}</p>
          </div>

          <div className="subscription-stat-box">
            <p className="subscription-stat-label">Live Classes Joined</p>
            <p className="subscription-stat-value">{subscriptionData.liveClassesJoined}</p>
          </div>

          <div className="subscription-stat-box">
            <p className="subscription-stat-label">AI Questions Asked</p>
            <p className="subscription-stat-value">{subscriptionData.aiQuestionsAsked}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscriptioncard;