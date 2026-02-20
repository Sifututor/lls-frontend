/**
 * My Live Classes page – same as image: light theme, header, Schedule New Class, class cards with separators.
 */
import React from 'react';
import LiveClassesHeader from '../../components/tutor/LiveClassesHeader';
import LiveClassCard from '../../components/tutor/LiveClassCard';
import '../../assets/css/tutor-upload-lesson.css';
import '../../assets/css/tutor-my-live-classes.css';

const CLASSES = [
  {
    id: 1,
    time: '3:00 PM',
    title: 'Integration Techniques',
    details: 'Form 5 • Mathematics • Add Maths • 45 Student Enrolled',
    meetingLink: 'Zoom Meeting',
    meetingUrl: 'https://zoom.us',
    actions: ['copyLink', 'startClass'],
  },
  {
    id: 2,
    time: '6:00 PM',
    title: 'Probability Revision',
    details: 'Form 4 • Mathematics • Modern Maths • 32 Student Enrolled',
    meetingLink: 'Google Meeting',
    meetingUrl: 'https://meet.google.com',
    actions: ['cancel', 'editClass'],
  },
  {
    id: 3,
    time: '9:00 PM',
    title: 'Probability Revision',
    details: 'Form 4 • Mathematics • Modern Maths • 32 Student Enrolled',
    meetingLink: 'Google Meeting',
    meetingUrl: 'https://meet.google.com',
    actions: ['uploadRecording'],
  },
];

function TutorMyLiveClasses() {
  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="tutor-live-wrapper">
      <LiveClassesHeader />
      <div className="tutor-live-list">
        {CLASSES.map((cls) => (
          <LiveClassCard
            key={cls.id}
            liveClass={cls}
            onCopyLink={handleCopyLink}
            onStartClass={() => {}}
            onCancel={() => {}}
            onEditClass={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default TutorMyLiveClasses;
