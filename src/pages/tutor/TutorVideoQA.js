/**
 * Video Q&A – Engagement. Tabs + filter (Pending Approval jaisa), question cards.
 * URL: /tutor/engagement/qna
 */
import React, { useState } from 'react';
import VideoQATabs from '../../components/tutor/VideoQATabs';
import VideoQAFilterBar from '../../components/tutor/VideoQAFilterBar';
import VideoQAQuestionCard from '../../components/tutor/VideoQAQuestionCard';
import '../../assets/css/tutor-video-qa.css';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    urgency: '2 hrs left - Urgent',
    studentName: 'Siti Aminah',
    courseDetail: 'Form 4 • Mathematics • Add Maths • Additional Mathematics • Welcome to the Course',
    questionText: 'How do I solve this quadratic when the discriminant is negative?',
    videoContext: 'Chapter 5: Quadratic Equation at 12:34',
  },
  {
    id: 2,
    urgency: '2 hrs left - Urgent',
    studentName: 'Siti Aminah',
    courseDetail: 'Form 4 • Mathematics • Add Maths',
    questionText: 'How do I solve this quadratic when the discriminant is negative?',
    videoContext: 'Chapter 5: Quadratic Equation at 12:34',
  },
];

function TutorVideoQA() {
  const [activeTab, setActiveTab] = useState('pending');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [formLevel, setFormLevel] = useState('');

  const handleApplyFilters = () => {
    console.log('Apply filters', { course, subject, formLevel });
  };

  return (
    <div className="tutor-video-qa-wrapper">
      <div className="tutor-video-qa-header">
        <h1 className="tutor-video-qa-title">Video Q&A</h1>
        <p className="tutor-video-qa-subtitle">Answer student questions within 24 hours</p>
      </div>

      <div className="tutor-video-qa-filter-bar">
        <VideoQATabs activeTab={activeTab} onTabChange={setActiveTab} />
        <VideoQAFilterBar
          course={course}
          subject={subject}
          formLevel={formLevel}
          onCourseChange={setCourse}
          onSubjectChange={setSubject}
          onFormLevelChange={setFormLevel}
          onApply={handleApplyFilters}
        />
      </div>

      <div className="tutor-video-qa-list">
        {SAMPLE_QUESTIONS.map((q) => (
          <VideoQAQuestionCard
            key={q.id}
            question={q}
            onPin={() => {}}
            onFlag={() => {}}
            onAnswer={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default TutorVideoQA;
