// src/pages/Settings.js
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Privacysettingscard from '../components/Privacysettingscard';
import Dataexportcard from '../components/Dataexportcard';
import Parentaccesscard from '../components/Parentaccesscard';
import Deleteaccountcard from '../components/Deleteaccountcard';

function Settings() {
  return (
    <>
      <Sidebar />
      
      <main className="main-content">
        <TopNavbar title="Settings" />
        
        <div className="settings-container">
          <Privacysettingscard />
          <Dataexportcard />
          <Parentaccesscard />
          <Deleteaccountcard />
        </div>
      </main>
    </>
  );
}

export default Settings;