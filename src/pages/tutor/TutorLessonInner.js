/**
 * Tutor Lesson Inner – dynamic from API: getTutorLessonById, getTutorVideoQA (lesson_id)
 */
import React, { useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer';
import EditLessonModal from '../../components/tutor/EditLessonModal';
import { useGetTutorLessonByIdQuery, useGetTutorVideoQAQuery, usePublishTutorLessonMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-course-inner.css';

function TutorLessonInner() {
  const { id: courseId, chapterId, lessonId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [commentFilter, setCommentFilter] = useState('Unanswered');
  const [searchStudent, setSearchStudent] = useState('');
  const [editLessonOpen, setEditLessonOpen] = useState(false);
  const uploadInputRef = useRef(null);
  const [publishLesson, { isLoading: publishing }] = usePublishTutorLessonMutation();

  const { data: lessonRes, isLoading: lessonLoading, isError: lessonError } = useGetTutorLessonByIdQuery(lessonId, { skip: !lessonId });
  const { data: qaRes } = useGetTutorVideoQAQuery({ lesson_id: lessonId, page: 1 }, { skip: !lessonId });

  const lesson = lessonRes?.data ?? lessonRes?.lesson ?? lessonRes;
  const qaList = (qaRes?.data ?? qaRes) || [];

  const headerTags = useMemo(() => {
    if (!lesson) return [];
    const tags = [];
    if (lesson.course?.level) tags.push(lesson.course.level);
    if (lesson.course?.subject) tags.push(lesson.course.subject);
    if (lesson.chapter?.title) tags.push(lesson.chapter.title);
    const mins = Math.ceil((lesson.video_duration || 0) / 60);
    if (mins) tags.push(`${mins} Minutes`);
    if (lesson.enrolled_count != null) tags.push(`${lesson.enrolled_count} Students`);
    return tags.length ? tags : ['—'];
  }, [lesson]);

  const lessonTitle = lesson?.title || 'Untitled';
  const seriesTag = lesson?.status || 'Published';
  const lessonInfo = {
    title: lesson?.title || '—',
    description: lesson?.description || '—',
    lastUpdated: lesson?.updated_at ? `Last updated: ${new Date(lesson.updated_at).toLocaleDateString()}` : '—',
    language: lesson?.language || '—',
  };
  const video = {
    url: lesson?.video_url ?? lesson?.video?.url ?? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: lesson?.thumbnail ?? '/assets/images/course-details-img.jpg',
  };
  const resources = lesson?.resources ?? lesson?.resource_files ?? [];
  const downloads = Array.isArray(resources)
    ? resources.map((r, i) => ({ id: r.id ?? i, name: (r.name || r.file_name || 'File').slice(0, 14) + (r.name?.length > 14 ? '...' : ''), size: r.size || '—' }))
    : [];

  const commentFilters = ['Unanswered', 'Answered', 'Latest', 'Oldest', 'Upvoted'];
  const comments = useMemo(() => qaList.map((q) => {
    const ans = q.answers?.[0];
    const replies = (ans?.replies ?? []).map((r) => ({
      userName: r.user?.name ?? '—',
      avatar: r.user?.profile_image ?? '/assets/images/icons/Ellipse 3.svg',
      time: r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
      text: r.reply_text ?? r.answer_text ?? '',
      answerText: r.reply_text ?? r.answer_text ?? '',
    }));
    return {
      id: q.id,
      userName: q.user?.name ?? q.student?.name ?? '—',
      avatar: q.user?.profile_image ?? q.user?.avatar ?? '/assets/images/icons/Ellipse 3.svg',
      time: q.created_at ? new Date(q.created_at).toLocaleDateString() : '—',
      text: q.question_text ?? q.question ?? '',
      answered: !!(ans?.answer_text ?? ans?.reply_text),
      pinned: !!q.is_pinned,
      answerText: ans?.answer_text ?? ans?.reply_text ?? '',
      replies,
      replyCount: (ans?.replies?.length ?? 0),
    };
  }), [qaList]);

  const enrolledStudents = (lesson?.enrolled_students ?? []).map((s, i) => ({
    id: s.id ?? i,
    name: s.name ?? s.full_name ?? '—',
    stid: s.student_id ?? s.id ?? '—',
    attended: s.attended ? 'Yes' : 'No',
    duration: s.duration ?? '—',
    quizAttended: s.quiz_attended ?? '0',
    performance: s.performance ?? s.performance_pct ?? '—',
  }));

  if (lessonLoading) {
    return (
      <div className="tutor-lesson-inner-wrapper">
        <p style={{ color: '#9A9A9A' }}>Loading lesson...</p>
      </div>
    );
  }
  if (lessonError || !lesson) {
    return (
      <div className="tutor-lesson-inner-wrapper">
        <p className="tutor-course-inner-error">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="tutor-lesson-inner-wrapper">
      {/* Header */}
      <header className="tutor-lesson-inner-header">
        <div className="tutor-lesson-inner-header-top">
          <div className="tutor-lesson-inner-tags">
            {headerTags.map((tag, i) => (
              <span key={i} className="tutor-lesson-inner-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="tutor-lesson-inner-header-bottom">
          <div className="tutor-lesson-inner-header-left">
            <h1 className="tutor-lesson-inner-banner-title">{lessonTitle}</h1>
            <span className="tutor-lesson-inner-published-tag">{seriesTag}</span>
          </div>
          <div className="tutor-lesson-inner-header-actions">
            <button type="button" className="tutor-lesson-inner-btn-action quiz">Add Quiz</button>
            <button type="button" className="tutor-lesson-inner-btn-action" onClick={() => setEditLessonOpen(true)}>Edit Lesson</button>
            <button type="button" className="tutor-lesson-inner-btn-action" onClick={async () => { try { await publishLesson(lessonId).unwrap(); showSuccess('Lesson published.'); } catch (e) { showError(e?.data?.message || 'Failed'); } }} disabled={publishing}>{publishing ? 'Publishing...' : 'Publish Lesson'}</button>
            <button
              type="button"
              className="tutor-lesson-inner-btn-action btn-upload"
              onClick={() => uploadInputRef.current?.click()}
            >
              <img src="/assets/images/icons/upload.svg" alt="" className="btn-icon" />
              Upload Lesson
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*,video/*"
              className="tutor-lesson-inner-upload-input"
              onChange={(e) => { e.target.value = ''; }}
            />
            <button type="button" className="tutor-lesson-inner-btn-dots">
              <img src="/assets/images/icons/simple-line-icons_options-vertical.svg" alt="More" />
            </button>
          </div>
        </div>
      </header>

      {/* Lesson Info Card */}
      <section className="tutor-lesson-inner-info-card">
        <h2 className="tutor-lesson-inner-info-title">{lessonInfo.title}</h2>
        <p className="tutor-lesson-inner-info-desc">{lessonInfo.description}</p>
        <p className="tutor-lesson-inner-info-meta">
          {lessonInfo.lastUpdated} <span className="meta-separator">•</span> {lessonInfo.language}
        </p>
      </section>

      {/* Video Player */}
      <section className="tutor-lesson-inner-video-section">
        <VideoPlayer video={video} />
      </section>

      {/* Additional Learning Resources */}
      <section className="tutor-lesson-inner-resources">
        <h3 className="tutor-lesson-inner-section-title">Additional Learning Resources</h3>
        <div className="tutor-lesson-inner-resources-grid">
          {downloads.map((d) => (
            <div key={d.id} className="tutor-lesson-inner-resource-card">
              <div className="resource-info">
                <span className="resource-name">{d.name}</span>
                <span className="resource-size">{d.size}</span>
              </div>
              <button type="button" className="resource-download-btn">
                <img src="/assets/images/icons/download-button.png" alt="Download" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comments Section */}
      <section className="tutor-lesson-inner-comments-section">
        <h3 className="tutor-lesson-inner-section-title">{comments.length} Comments</h3>
        
        {/* Comment Input */}
        <div className="tutor-lesson-inner-comment-input-row">
        <div className="comment-avatar-placeholder">
  <img 
    src="/assets/images/icons/Ellipse 3.svg" 
    alt="avatar"
    className="comment-avatar-img"
  />
</div>

          <div className="lesson-inner-comment-input-wrapper">
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
            />
            <div className="comment-input-actions">
              <button type="button" className="btn-discard" onClick={() => setCommentText('')}>Discard</button>
              <button type="button" className="btn-post">Post</button>
            </div>
          </div>
        </div>

        {/* Comment Filters */}
        <div className="tutor-lesson-inner-comment-filters">
          {commentFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`comment-filter-btn ${commentFilter === f ? 'active' : ''}`}
              onClick={() => setCommentFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="tutor-lesson-inner-comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-main">
                <img 
                  src={c.avatar} 
                  alt={c.userName} 
                  className="comment-avatar"
                  onError={(e) => { e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{c.userName}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                  
                  {/* Answer if exists */}
                  {c.answered && c.answerText && (
                    <div className="comment-answer">
                      <p className="answer-text">{c.answerText}</p>
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="comment-reply-row">
                    <button type="button" className="btn-flag">
                      <img src="/assets/images/tutor/bookmark.svg" alt="Flag" />
                    </button>
                    <button type="button" className="btn-pin">
                      <img src="/assets/images/tutor/red-flag.svg" alt="Pin" />
                    </button>

                    <input type="text" className="lesson-reply-input" placeholder="Submit you answer" />
                    <button type="button" className="btn-reply">Reply</button>
                    
                  </div>

                  {/* View Replies */}
                  {c.replyCount && c.replyCount > 0 && (
                    <button type="button" className="btn-view-replies">
                      ▼ View {c.replyCount} Replies
                    </button>
                  )}

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="comment-replies">
                      {c.replies.map((r, idx) => (
                        <div key={idx} className="reply-item">
                          <img 
                            src={r.avatar} 
                            alt={r.userName} 
                            className="comment-avatar"
                            onError={(e) => { e.target.src = '/assets/images/icons/Ellipse 3.svg'; }}
                          />
                          <div className="reply-content">
                            <span className="comment-username">{r.userName}</span>
                            <span className="comment-time">{r.time}</span>
                            <p className="comment-text">{r.text}</p>
                            {r.answerText && (
                              <div className="comment-answer">
                                <p className="answer-text">{r.answerText}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {c.pinned && (
                  <span className="pin-icon"> <img 
                  src="/assets/images/tutor/pin.svg" 
                  alt="avatar"
                  className="comment-avatar-img"
                /></span>
                )}
                <button type="button" className="btn-more-options"><img 
                  src="/assets/images/icons/simple-line-icons_options-vertical.svg" 
                  alt="avatar"
                  className="comment-avatar-img"
                /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock Test & Quiz Overview */}
      <section className="tutor-lesson-inner-overview-section">
        <div className="overview-card">
          <h3 className="overview-title">Mock Test Overview</h3>
          <div className="overview-actions">
            <button type="button" className="btn-edit">Edit</button>
            <button type="button" className="btn-view">View</button>
          </div>
        </div>
        <div className="overview-card">
          <h3 className="overview-title">Quiz Overview</h3>
          <div className="overview-actions">
            <button type="button" className="btn-edit">Edit</button>
            <button type="button" className="btn-view">View</button>
          </div>
        </div>

        {/* Enrolled Students Table */}
        <div className="enrolled-students-card">
          <div className="enrolled-students-header">
            <h4 className="enrolled-students-title">Enrolled Students</h4>
            <input
              type="text"
              className="search-student-input"
              placeholder="Search student"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
          </div>
          <div className="enrolled-students-table-wrapper">
            <table className="enrolled-students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>STID</th>
                  <th>Attended</th>
                  <th>Duration</th>
                  <th>Quiz Attended</th>
                  <th>Performance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.stid}</td>
                    <td>{s.attended}</td>
                    <td>{s.duration}</td>
                    <td>{s.quizAttended}</td>
                    <td>{s.performance}</td>
                    <td>
                    <button type="button" className="btn-action-dots">
                        <img
                          src="/assets/images/icons/simple-line-icons_options-vertical.svg"
                          alt="options"
                          className="btn-action-dots-icon"
                        />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="enrolled-students-pagination">
            <button type="button" className="pagination-btn">← Previous</button>
            <div className="pagination-numbers">
              <button type="button" className="page-num active">1</button>
              <button type="button" className="page-num">2</button>
              <button type="button" className="page-num">3</button>
              <span className="page-dots">...</span>
              <button type="button" className="page-num">67</button>
              <button type="button" className="page-num">68</button>
            </div>
            <button type="button" className="pagination-btn">Next →</button>
          </div>
        </div>
      </section>

      <EditLessonModal
        isOpen={editLessonOpen}
        onClose={() => setEditLessonOpen(false)}
        lesson={{
          id: lessonId,
          title: lesson?.title,
          description: lessonInfo.description,
          duration: `${Math.ceil((lesson?.video_duration || 0) / 60)}`,
          chapter_id: lesson?.chapter_id ?? lesson?.chapter?.id,
        }}
      />
    </div>
  );
}

export default TutorLessonInner;