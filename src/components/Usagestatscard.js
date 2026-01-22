import React from 'react';

function Usagestatscard({ usageData }) {
  return (
    <div className="subscription-usage-wrapper">
      <h3 className="subscription-usage-heading">This Month's usage</h3>

      <div className="subscription-usage-grid">
        <div className="subscription-usage-card">
            <div className="subscription-usage-section">
          <div className="subscription-usage-icon live-profile">
            <img src="/assets/images/icons/live-profile.svg" alt="Live Classes" />
          </div>
          <div className="subscription-usage-content">
            <p className="subscription-usage-title">{usageData.liveClasses.title}</p>
            <p className="subscription-usage-desc">{usageData.liveClasses.description}</p>
          </div> </div>
          <p className="subscription-usage-value">{usageData.liveClasses.value}</p>
        </div>

        <div className="subscription-usage-card">
            <div className="subscription-usage-section">
          <div className="subscription-usage-icon ai-tutor">
            <img src="/assets/images/icons/ai-tutor.svg" alt="AI Tutor" />
          </div>
          <div className="subscription-usage-content">
            <p className="subscription-usage-title">{usageData.aiQuestions.title}</p>
            <p className="subscription-usage-desc">{usageData.aiQuestions.description}</p>
          </div></div>
          <p className="subscription-usage-value">{usageData.aiQuestions.value}</p>
        </div>

        <div className="subscription-usage-card">
            <div className="subscription-usage-section">
          <div className="subscription-usage-icon video-qa">
            <img src="/assets/images/icons/vide-qa.svg" alt="Video Q&A" />
          </div>
          <div className="subscription-usage-content">
            <p className="subscription-usage-title">{usageData.videoQA.title}</p>
            <p className="subscription-usage-desc">{usageData.videoQA.description}</p>
          </div></div>
          <p className="subscription-usage-value">{usageData.videoQA.value}</p>
        </div>

        <div className="subscription-usage-card">
            <div className="subscription-usage-section">
          <div className="subscription-usage-icon downloading">
            <img src="/assets/images/icons/downloading.svg" alt="Materials" />
          </div>
          <div className="subscription-usage-content">
            <p className="subscription-usage-title">{usageData.materials.title}</p>
            <p className="subscription-usage-desc">{usageData.materials.description}</p>
          </div></div>
          <p className="subscription-usage-value">{usageData.materials.value}</p>
        </div>
      </div>
    </div>
  );
}

export default Usagestatscard;