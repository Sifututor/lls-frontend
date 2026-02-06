// src/pages/Settings.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Privacysettingscard from '../components/Privacysettingscard';
import Dataexportcard from '../components/Dataexportcard';
import Parentaccesscard from '../components/Parentaccesscard';
import Deleteaccountcard from '../components/Deleteaccountcard';

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      {/* Change Password Card */}
    

      <Privacysettingscard />
      <Dataexportcard />
      <Parentaccesscard />
      <Deleteaccountcard />
    </div>
  );
}

export default Settings;