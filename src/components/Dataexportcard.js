// src/components/Dataexportcard.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const COMING_SOON = 'This feature is coming soon.';

function Dataexportcard() {
  const [exports] = useState([
    { id: 1, date: 'Oct 24, 2025', status: 'Ready', size: '45MB' },
    { id: 2, date: 'Sep 10, 2025', status: 'Expired', size: null }
  ]);

  const handleRequestArchive = () => {
    toast.info(COMING_SOON);
  };

  const handleDownload = () => {
    toast.info(COMING_SOON);
  };

  return (
    <div className="settings-section-card data">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Data Export</h2>
        <p className="settings-section-subtitle">Download a copy of your personal data in machine-readable format.</p>
      </div>

      <div className="data-export-box">
        <div className="data-export-header">
          <div className="data-export-info">
            <h3 className="data-export-title">Export All Data</h3>
            <p className="data-export-description">
              Includes your profile details, activity logs, uploaded files, and preferences. The file will be generated in JSON format.
            </p>
          </div>
          <button className="btn-request-archive" onClick={handleRequestArchive}>
            Request Archive
          </button>
        </div>

        <div className="recent-exports-section">
          <h4 className="recent-exports-title">Recent Exports</h4>
          
          <div className="exports-table">
            <div className="exports-table-header">
              <div className="export-col-date">Date</div>
              <div className="export-col-status">Status</div>
              <div className="export-col-action">Action</div>
            </div>

            <div className="exports-table-body">
              {exports.map(exp => (
                <div key={exp.id} className="export-row">
                  <div className="export-col-date">{exp.date}</div>
                  <div className="export-col-status">
                    <span className={`export-status-badge ${exp.status.toLowerCase()}`}>
                      {exp.status}
                    </span>
                  </div>
                  <div className="export-col-action">
                    {exp.status === 'Ready' ? (
                      <button 
                        className="btn-download-export" 
                        onClick={() => handleDownload(exp.id)}
                      >
                        Download ({exp.size})
                      </button>
                    ) : (
                      <span className="export-unavailable">Unavailable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dataexportcard;