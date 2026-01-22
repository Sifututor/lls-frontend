// src/data/Settingsdata.js

export const privacySettingsData = {
  marketingCommunications: true,
  activityTracking: true,
  publicProfile: false,
  thirdPartySharing: false
};

export const dataExportsData = [
  {
    id: 1,
    date: 'Oct 24, 2025',
    status: 'Ready',
    size: '45MB'
  },
  {
    id: 2,
    date: 'Sep 10, 2025',
    status: 'Expired',
    size: null
  }
];

export const parentAccessData = {
  baseUrl: 'https://www.learnest.com/stdid/',
  studentId: '123456',
  fullLink: 'https://www.learnest.com/stdid/123456/dashboard'
};