import React from 'react';

function Plansection({ plansData, onUpgrade }) {
  return (
    <div className="profile-plans-wrapper">
      <h2 className="profile-section-heading">Choose Your Plan</h2>

      <div className="profile-plans-grid">
        {/* Free Plan */}
        <div className="profile-plan-card profile-plan-free">
          <div className="profile-plan-header-section">
            <h3 className="profile-plan-name">{plansData.free.name}</h3>
            <p className="profile-plan-tagline">{plansData.free.tagline}</p>
          </div>

          <h4 className="profile-features-heading">What's Included</h4>

          <div className="profile-features-container">
            {plansData.free.features.map((feature, index) => (
              <div key={index} className="profile-feature-item">
                          <img src="/assets/images/icons/022-check.svg" alt="check" class="check"></img>
                <div className="profile-feature-content">
                  <p className="profile-feature-title">{feature.title}</p>
                  <p className="profile-feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="profile-btn-current-plan">Your Plan</button>
        </div>

        {/* Premium Plan */}
        <div className="profile-plan-card profile-plan-premium">
          <div className="profile-plan-header-premium-section">
            <div>
              <h3 className="profile-plan-name-premium">{plansData.premium.name}</h3>
              <p className="profile-plan-tagline-premium">{plansData.premium.tagline}</p>
            </div>
            <span className="profile-badge-recommended">Recommended</span>
          </div>

          <h4 className="profile-features-heading-premium">Everything in Free, Plus</h4>

          <div className="profile-features-container">
            {plansData.premium.features.map((feature, index) => (
              <div key={index} className="profile-feature-item">
                <img src="/assets/images/icons/022-check.svg" alt="check" class="check"></img>
                <div className="profile-feature-content">
                  <p className="profile-feature-title">{feature.title}</p>
                  <p className="profile-feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="profile-btn-upgrade-plan" onClick={onUpgrade}>
            <span className="profile-upgrade-icon"><img src="/assets/images/icons/go-premime.svg" alt="check" class="check"></img></span>
            <span>Upgrade to Premium</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Plansection;