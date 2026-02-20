/**
 * Upload Recording (detail) – Sidebar "Upload Recording" isi page pe jata hai.
 * Content: class title, metadata, Edit Class, lesson card, downloadable material, Scheduled tag.
 */
import React from 'react';
import UploadRecordingHeader from '../../components/tutor/UploadRecordingHeader';
import LessonInfoCard from '../../components/tutor/LessonInfoCard';
import DownloadableMaterial from '../../components/tutor/DownloadableMaterial';
import ScheduledTag from '../../components/tutor/ScheduledTag';
import '../../assets/css/tutor-recording-detail.css';

const DEFAULT_TITLE = 'Probability Revision';
const DEFAULT_METADATA = 'Form 4 • Mathematics • Modern Maths • 32 Student Enrolled';
const LESSON = {
  title: 'Algorithmic Efficiency',
  description: "This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.",
  lastUpdated: 'Jan 2026',
  language: 'Bahasa Melayu',
};
const FILES = [
  { name: 'Light_Waves_Summary.pdf', size: '1.2 MB', url: '#' },
  { name: 'Experiment_Data.zip', size: '210 MB', url: '#' },
];
const SCHEDULED_TIME = '03:00 PM';

function TutorRecordingDetail() {
  return (
    <>
      <UploadRecordingHeader
        title={DEFAULT_TITLE}
        metadata={DEFAULT_METADATA}
        editLink="/tutor/live-classes/schedule"
      />
      <div className="tutor-rec-wrapper">
        <LessonInfoCard
          title={LESSON.title}
          description={LESSON.description}
          lastUpdated={LESSON.lastUpdated}
          language={LESSON.language}
        />
        <DownloadableMaterial files={FILES} />
        <div className="tutor-rec-footer">
          <ScheduledTag time={SCHEDULED_TIME} />
        </div>
      </div>
    </>
  );
}

export default TutorRecordingDetail;
