/**
 * Video Q&A – Engagement. Dynamic from API: GET /tutor/video-qa
 * Tabs: Pending (unanswered), All. Filters: course_id, subject_id, form_level.
 */
import React, { useState } from 'react';
import VideoQATabs from '../../components/tutor/VideoQATabs';
import VideoQAFilterBar from '../../components/tutor/VideoQAFilterBar';
import VideoQAQuestionCard from '../../components/tutor/VideoQAQuestionCard';
import VideoQAAnswerModal from '../../components/tutor/VideoQAAnswerModal';
import FlagContentModal from '../../components/Flagcontentmodal';
import {
  useGetTutorVideoQAQuery,
  useToggleTutorVideoQAPinMutation,
  useFlagTutorVideoQAMutation,
  useUnflagTutorVideoQAMutation,
} from '../../store/api/authApi';
import { SectionLoader } from '../../components/ui/LoadingSpinner';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-video-qa.css';

const FILTER_MAP = { pending: 'unanswered', all: 'all', answered: 'answered' };

const FLAG_REASON_LABELS = {
  spam: 'Spam or misleading',
  harassment: 'Harassment or bullying',
  inappropriate: 'Inappropriate content',
  'hate-speech': 'Hate speech',
  misinformation: 'Misinformation',
  other: 'Other',
};

function mapApiQuestionToCard(q) {
  const lesson = q.lesson || {};
  const chapter = lesson.chapter || {};
  const course = chapter.course || {};
  const courseTitle = course.title || '—';
  const subjectId = course.subject_id;
  const formLevel = course.form_level;
  const formStr = formLevel ? `Form ${formLevel}` : '';
  const subjectStr = subjectId ? `Subject ${subjectId}` : '';
  const courseDetail = [formStr, subjectStr, chapter.title, courseTitle].filter(Boolean).join(' • ') || '—';
  const hasAnswer = !!q.latest_answer;
  return {
    id: q.id,
    studentName: q.is_anonymous ? 'Anonymous' : 'Student',
    courseDetail,
    questionText: q.question_text || '—',
    videoContext: lesson.title ? `${lesson.title}` : null,
    urgency: !hasAnswer ? 'Unanswered' : null,
    isPinned: !!q.is_pinned,
    isFlagged: !!q.is_flagged,
    raw: q,
  };
}

function TutorVideoQA() {
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [courseId, setCourseId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [formLevel, setFormLevel] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagQuestionId, setFlagQuestionId] = useState(null);

  const filter = FILTER_MAP[activeTab] || 'unanswered';
  const { data, isLoading, isError } = useGetTutorVideoQAQuery({
    page,
    filter,
    course_id: courseId || undefined,
    subject_id: subjectId || undefined,
    form_level: formLevel || undefined,
  });
  const { data: pendingData } = useGetTutorVideoQAQuery(
    {
      page: 1,
      filter: 'unanswered',
      course_id: courseId || undefined,
      subject_id: subjectId || undefined,
      form_level: formLevel || undefined,
    },
    { skip: activeTab === 'pending' }
  );
  const [togglePin] = useToggleTutorVideoQAPinMutation();
  const [flagQuestion] = useFlagTutorVideoQAMutation();
  const [unflagQuestion] = useUnflagTutorVideoQAMutation();

  const paginated = data;
  const questionList = Array.isArray(paginated?.data) ? paginated.data : [];
  const pagination = paginated
    ? {
        current: paginated.current_page,
        last: paginated.last_page,
        total: paginated.total,
      }
    : null;

  const cards = questionList.map(mapApiQuestionToCard);

  const handlePin = async (q) => {
    try {
      await togglePin(q.raw.id).unwrap();
      showSuccess(q.isPinned ? 'Unpinned' : 'Pinned');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed');
    }
  };

  const handleAnswer = (q) => {
    setSelectedQuestionId(q.raw.id);
  };

  const handleFlagClick = async (q) => {
    if (q.isFlagged) {
      try {
        await unflagQuestion({ flaggable_id: q.raw.id, questionId: q.raw.id }).unwrap();
        showSuccess('Flag removed');
      } catch (err) {
        showError(err?.data?.message || err?.message || 'Failed to remove flag');
      }
      return;
    }
    setFlagQuestionId(q.raw.id);
    setShowFlagModal(true);
  };

  const handleCloseFlagModal = () => {
    setShowFlagModal(false);
    setFlagQuestionId(null);
  };

  const handleConfirmFlag = async (flagData) => {
    try {
      const reason = FLAG_REASON_LABELS[flagData.reason] || flagData.reason;
      await flagQuestion({
        flaggable_id: flagData.commentId,
        questionId: flagData.commentId,
        reason,
      }).unwrap();
      showSuccess('Flagged successfully');
      setShowFlagModal(false);
      setFlagQuestionId(null);
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to flag');
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  const pendingCount = activeTab === 'pending'
    ? (pagination?.total ?? 0)
    : (pendingData?.total ?? 0);

  return (
    <div className="tutor-video-qa-wrapper">
      <div className="tutor-video-qa-header">
        <h1 className="tutor-video-qa-title">Video Q&A</h1>
        <p className="tutor-video-qa-subtitle">Answer student questions within 24 hours</p>
      </div>

      <div className="tutor-video-qa-filter-bar">
        <VideoQATabs
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setPage(1); }}
          tabs={[
            { id: 'pending', label: 'Pending', badge: pendingCount },
            { id: 'all', label: 'All' },
          ]}
        />
        <VideoQAFilterBar
          courseId={courseId}
          subjectId={subjectId}
          formLevel={formLevel}
          onCourseChange={setCourseId}
          onSubjectChange={setSubjectId}
          onFormLevelChange={setFormLevel}
          onApply={handleApplyFilters}
        />
      </div>

      <div className="tutor-video-qa-list">
        {isLoading ? (
          <SectionLoader message="Loading questions..." height="200px" />
        ) : isError ? (
          <p style={{ color: '#DD4040' }}>Failed to load questions.</p>
        ) : cards.length === 0 ? (
          <div className="tutor-courses-empty-state" style={{ padding: 48 }}>
            <p style={{ color: '#6b7280', margin: 0 }}>No questions found.</p>
          </div>
        ) : (
          <>
            {cards.map((q) => (
              <VideoQAQuestionCard
                key={q.id}
                question={q}
                onPin={() => handlePin(q)}
                onFlag={() => handleFlagClick(q)}
                onAnswer={() => handleAnswer(q)}
              />
            ))}
            {pagination && pagination.last > 1 && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={{ padding: '8px 16px', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous
                </button>
                <span style={{ color: '#9A9A9A' }}>
                  Page {page} of {pagination.last} ({pagination.total} total)
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.last}
                  onClick={() => setPage((p) => p + 1)}
                  style={{ padding: '8px 16px', cursor: page >= pagination.last ? 'not-allowed' : 'pointer' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedQuestionId && (
        <VideoQAAnswerModal
          questionId={selectedQuestionId}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}

      <FlagContentModal
        isOpen={showFlagModal}
        onClose={handleCloseFlagModal}
        onConfirm={handleConfirmFlag}
        commentId={flagQuestionId}
      />
    </div>
  );
}

export default TutorVideoQA;
