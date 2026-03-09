/**
 * Upload Recording (detail) – dynamic from API GET /tutor/live-classes/:id
 * When no classId: show list of past live classes to choose from.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTutorLiveClassByIdQuery, useGetTutorLiveClassesQuery } from '../../store/api/authApi';
import UploadRecordingHeader from '../../components/tutor/UploadRecordingHeader';
import LessonInfoCard from '../../components/tutor/LessonInfoCard';
import DownloadableMaterial from '../../components/tutor/DownloadableMaterial';
import ScheduledTag from '../../components/tutor/ScheduledTag';
import '../../assets/css/tutor-recording-detail.css';

function TutorRecordingDetail() {
  const { classId } = useParams();
  const { data, isLoading, isError } = useGetTutorLiveClassByIdQuery(classId, { skip: !classId });
  const { data: classesData, isLoading: classesLoading } = useGetTutorLiveClassesQuery(undefined, { skip: !!classId });
  const rawList = (classesData?.data ?? classesData) || [];
  const allClasses = Array.isArray(rawList) ? rawList : [];
  const pastClasses = allClasses.filter((cls) => {
    const dt = cls.scheduled_at ? new Date(cls.scheduled_at) : null;
    return dt && dt < new Date();
  });

  if (!classId) {
    return (
      <div className="tutor-rec-wrapper tutor-recording-select">
        <h2 className="tutor-recording-select-title">Upload Recording</h2>
        <p className="tutor-recording-select-desc">Select a past live class to view details and upload recording.</p>
        {classesLoading ? (
          <p style={{ color: '#9A9A9A', marginTop: 16 }}>Loading live classes...</p>
        ) : pastClasses.length === 0 ? (
          <p style={{ color: '#9A9A9A', marginTop: 16 }}>
            No past classes yet. Go to <Link to="/tutor/live-classes">My Live Classes</Link> to see your schedule.
          </p>
        ) : (
          <ul className="tutor-recording-class-list" aria-label="Past live classes">
            {pastClasses.map((cls) => {
              const dt = cls.scheduled_at ? new Date(cls.scheduled_at) : null;
              const timeStr = dt ? dt.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';
              const course = cls.course ?? {};
              const details = [course.title, cls.enrolled_count ? `${cls.enrolled_count} Students` : ''].filter(Boolean).join(' • ') || '—';
              return (
                <li key={cls.id} className="tutor-recording-class-item">
                  <Link to={`/tutor/live-classes/upload-recording/${cls.id}`} className="tutor-recording-class-link">
                    <span className="tutor-recording-class-name">{cls.title || 'Untitled'}</span>
                    <span className="tutor-recording-class-meta">{timeStr} · {details}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
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
