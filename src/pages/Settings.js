// src/pages/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Privacysettingscard from '../components/Privacysettingscard';
import Dataexportcard from '../components/Dataexportcard';
import Parentaccesscard from '../components/Parentaccesscard';
import Deleteaccountcard from '../components/Deleteaccountcard';

const COMING_SOON = 'This feature is coming soon.';

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <div className="settings-page-header" style={{ marginBottom: '24px' }}>
        <h1 className="settings-page-title">Settings</h1>
        <p className="settings-page-subtitle" style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
          Some options are coming soon.
        </p>
      </div>
      <Privacysettingscard />
      <Dataexportcard />
      <Parentaccesscard link="" onRegenerate={() => toast.info(COMING_SOON)} onCopy={() => toast.info(COMING_SOON)} />
      <Deleteaccountcard onDownload={() => toast.info(COMING_SOON)} />
    </div>
  );
}

export default Settings;