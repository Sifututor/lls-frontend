/**
 * Tutor Lesson Inner – Exact Figma Design
 * Header: Tags, Title, Published badge, Add Quiz, Edit Lesson, Upload Lesson buttons
 * Sections: Lesson Info, Video, Additional Learning Resources, Comments, Mock/Quiz Overview, Enrolled Students
 */
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer';
import EditLessonModal from '../../components/tutor/EditLessonModal';
import '../../assets/css/tutor-course-inner.css';

function TutorLessonInner() {
  const { lessonId } = useParams();
  const [commentText, setCommentText] = useState('');
  const [commentFilter, setCommentFilter] = useState('Unanswered');
  const [searchStudent, setSearchStudent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editLessonOpen, setEditLessonOpen] = useState(false);
  const uploadInputRef = useRef(null);

  // Static Data - Exact from Figma Image
  const headerTags = ['Form 4', 'Mathematics', 'Additional Mathematics', '15 Minutes', '87 Students'];
  const lessonTitle = 'Welcome to the Course';
  const seriesTag = 'Published';

  const lessonInfo = {
    title: 'Algorithmic Efficiency',
    description: 'This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you\'ll be able to analyze algorithms and improve their efficiency.',
    lastUpdated: 'Last updated: Jan 2026',
    language: 'Bahasa Melayu'
  };

  const video = {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/assets/images/course-details-img.jpg',
  };

  const downloads = [
    { id: 1, name: 'Light_Waves_S...', size: '1.2 MB' },
    { id: 2, name: 'Experiment_Da...', size: '210 MB' },
  ];

  const commentFilters = ['Unanswered', 'Answered', 'Latest', 'Oldest', 'Upvoted'];

  const comments = [
    {
      id: 1,
      userName: 'Ahmad Kamal',
      avatar: '/assets/images/avatars/student1.jpg',
      time: '4 days ago',
      text: 'The explanation of diffraction was very helpful! I finally understand how it applies to optical fibers. Thanks, Cikgu!',
      answered: false,
      pinned: true,
      replies: [],
    },
    {
      id: 2,
      userName: 'Siti Aminah',
      avatar: '/assets/images/avatars/student2.jpg',
      time: '4 days ago',
      text: 'Can anyone explain the difference between constructive and destructive interference in simpler terms? I\'m still a bit confused.',
      answered: true,
      pinned: false,
      answerText: 'Constructive interference happens when two waves meet and combine to make a bigger wave. Think of it like two friends pushing a swing together, making it go higher. On the other hand, destructive interference occurs when two waves meet and cancel each other out, like two friends pulling a swing in opposite directions, making it stop. So, constructive adds up, while destructive takes away!',
      replies: [],
    },
    {
      id: 3,
      userName: 'Lee Wei',
      avatar: '/assets/images/avatars/student3.jpg',
      time: '4 days ago',
      text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
      answered: true,
      pinned: true,
      answerText: 'Yes, there is a practice quiz available for this topic! It\'s a great way to test your understanding before the school exam. You can find it on the course website or ask your teacher for access.',
      replies: [
        {
          userName: 'Lee Wei',
          avatar: '/assets/images/avatars/student3.jpg',
          time: '4 days ago',
          text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
          answerText: 'Yes, there is a practice quiz available for this topic! It\'s a great way to test your understanding before the school exam. You can find it on the course website or ask your teacher for access.',
        }
      ],
      replyCount: 8,
    },
    {
      id: 4,
      userName: 'Ravi Kumar',
      avatar: '/assets/images/avatars/student4.jpg',
      time: '4 days ago',
      text: 'How does the refractive index affect the speed of light in different mediums? I need some clarification.',
      answered: false,
      pinned: true,
      replies: [],
    },
    {
      id: 5,
      userName: 'Lim Mei Ling',
      avatar: '/assets/images/avatars/student5.jpg',
      time: '4 days ago',
      text: 'Can we get more examples of how these concepts are applied in real-world technologies?',
      answered: true,
      pinned: false,
      answerText: 'Constructive interference is used in technologies like noise-canceling headphones, where sound waves combine to enhance desired sounds while reducing unwanted noise. Destructive interference is applied in various fields, such as in the design of certain types of antennas, where it helps to minimize signal interference. Another example is in optical coatings, like those on camera lenses, where constructive interference enhances specific wavelengths of light for clearer images, while destructive interference reduces glare.',
      replies: [],
    },
  ];

  const enrolledStudents = [
    { id: 1, name: 'Alice Johnson', stid: 'ST001', attended: 'Yes', duration: '3 months', quizAttended: '3', performance: '85%' },
    { id: 2, name: 'Brian Smith', stid: 'ST002', attended: 'Yes', duration: '5 months', quizAttended: '5', performance: '72%' },
    { id: 3, name: 'David Brown', stid: 'ST004', attended: 'Yes', duration: '4 months', quizAttended: '4', performance: '80%' },
    { id: 4, name: 'Catherine Lee', stid: 'ST003', attended: 'No', duration: '2 months', quizAttended: '0', performance: '15%' },
    { id: 5, name: 'Henry Adams', stid: 'ST008', attended: 'Yes', duration: '5 months', quizAttended: '5', performance: '45%' },
    { id: 6, name: 'Grace Hall', stid: 'ST007', attended: 'No', duration: '3 months', quizAttended: '0', performance: '90%' },
    { id: 7, name: 'Frank King', stid: 'ST006', attended: 'Yes', duration: '1 month', quizAttended: '1', performance: '85%' },
    { id: 8, name: 'Eva White', stid: 'ST005', attended: 'Yes', duration: '6 months', quizAttended: '6', performance: '80%' },
    { id: 9, name: 'Jack Taylor', stid: 'ST010', attended: 'No', duration: '2 months', quizAttended: '0', performance: '40%' },
    { id: 10, name: 'Isabella Walker', stid: 'ST009', attended: 'Yes', duration: '4 months', quizAttended: '4', performance: '85%' },
  ];

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
        <h3 className="tutor-lesson-inner-section-title">1.2k Comments</h3>
        
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
        lesson={{ description: lessonInfo.description, duration: '15 mins' }}
      />
    </div>
  );
}

export default TutorLessonInner;