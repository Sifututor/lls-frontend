/**
 * My Live Classes page – dynamic from API GET /tutor/live-classes
 */
import React from 'react';
import { useGetTutorLiveClassesQuery } from '../../store/api/authApi';
import LiveClassesHeader from '../../components/tutor/LiveClassesHeader';
import LiveClassCard from '../../components/tutor/LiveClassCard';
import '../../assets/css/tutor-upload-lesson.css';
import '../../assets/css/tutor-my-live-classes.css';

function mapLiveClass(cls) {
  const dt = cls.scheduled_at ? new Date(cls.scheduled_at) : null;
  const timeStr = dt ? dt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
  const course = cls.course ?? {};
  const details = [course.level, course.subject, course.title, cls.enrolled_count ? `${cls.enrolled_count} Students` : ''].filter(Boolean).join(' • ') || '—';
  const isPast = dt && dt < new Date();
  const actions = [];
  if (cls.join_url || cls.meeting_url) actions.push('copyLink');
  if (!isPast) actions.push('startClass');
  if (isPast) actions.push('uploadRecording');
  return {
    id: cls.id,
    time: timeStr,
    title: cls.title || 'Untitled',
    details,
    meetingLink: cls.meeting_platform || 'Meeting',
    meetingUrl: cls.join_url || cls.meeting_url || '#',
    actions: actions.length ? actions : ['copyLink'],
  };
}

function TutorMyLiveClasses() {
  const { data, isLoading, isError } = useGetTutorLiveClassesQuery();
  const rawList = (data?.data ?? data) || [];
  const classes = Array.isArray(rawList) ? rawList.map(mapLiveClass) : [];

  const handleCopyLink = (url) => {
    if (url && url !== '#') navigator.clipboard?.writeText(url);
  };

  return (
    <div className="tutor-live-wrapper">
      <LiveClassesHeader />
      {isLoading ? (
        <p style={{ color: '#9A9A9A', padding: 24 }}>Loading live classes...</p>
      ) : (
      <div className="tutor-live-list">
        {classes.map((cls) => (
          <LiveClassCard
            key={cls.id}
            liveClass={cls}
            onCopyLink={handleCopyLink}
            onStartClass={() => { if (cls.meetingUrl && cls.meetingUrl !== '#') window.open(cls.meetingUrl, '_blank'); }}
            onCancel={() => {}}
            onEditClass={() => {}}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default TutorMyLiveClasses;
