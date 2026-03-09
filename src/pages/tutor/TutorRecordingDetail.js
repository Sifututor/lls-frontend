/**
 * Upload Recording (detail) – dynamic from API GET /tutor/live-classes/:id
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTutorLiveClassByIdQuery } from '../../store/api/authApi';
import UploadRecordingHeader from '../../components/tutor/UploadRecordingHeader';
import LessonInfoCard from '../../components/tutor/LessonInfoCard';
import DownloadableMaterial from '../../components/tutor/DownloadableMaterial';
import ScheduledTag from '../../components/tutor/ScheduledTag';
import '../../assets/css/tutor-recording-detail.css';

function TutorRecordingDetail() {
  const { classId } = useParams();
  const { data, isLoading, isError } = useGetTutorLiveClassByIdQuery(classId, { skip: !classId });

  if (!classId) {
    return (
      <div className="tutor-rec-wrapper">
        <p style={{ color: '#9A9A9A' }}>Select a live class from <Link to="/tutor/live-classes">My Live Classes</Link> and click "Upload Recording" to get started.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="tutor-rec-wrapper">
        <p style={{ color: '#9A9A9A' }}>Loading...</p>
      </div>
    );
  }

  const liveClass = data?.data ?? data;
  if (isError || !liveClass) {
    return (
      <div className="tutor-rec-wrapper">
        <p style={{ color: '#c00' }}>Live class not found.</p>
      </div>
    );
  }

  const course = liveClass.course ?? {};
  const metadata = [course.level, course.subject, course.title, liveClass.enrolled_count ? `${liveClass.enrolled_count} Student Enrolled` : ''].filter(Boolean).join(' • ') || '—';
  const dt = liveClass.scheduled_at ? new Date(liveClass.scheduled_at) : null;
  const scheduledTime = dt ? dt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
  const lesson = liveClass.lesson ?? liveClass;
  const files = liveClass.materials ?? liveClass.resources ?? [];

  return (
    <>
      <UploadRecordingHeader
        title={liveClass.title || 'Untitled'}
        metadata={metadata}
        editLink="/tutor/live-classes/schedule"
      />
      <div className="tutor-rec-wrapper">
        <LessonInfoCard
          title={lesson.title || liveClass.title || '—'}
          description={lesson.description || liveClass.description || '—'}
          lastUpdated={lesson.updated_at ? new Date(lesson.updated_at).toLocaleDateString() : '—'}
          language={lesson.language || '—'}
        />
        <DownloadableMaterial files={files.map((f) => ({ name: f.name ?? f.file_name ?? 'File', size: f.size ?? '—', url: f.url ?? '#' }))} />
        <div className="tutor-rec-footer">
          <ScheduledTag time={scheduledTime} />
        </div>
      </div>
    </>
  );
}

export default TutorRecordingDetail;
