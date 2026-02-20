/**
 * Edit Chapter modal – opens from "Edit Chapter" on chapter detail page.
 * Format same as student portal modals; content as per image: title, subtitle, description textarea, Duration/Lessons/Quizzes dropdowns, Cancel + Send for Approval.
 */
import React, { useEffect, useState } from 'react';

const DEFAULT_DESCRIPTION = `Master the art of UX strategy and learn how to align user experience design with business goals. This comprehensive course covers advanced research methods, Stakeholder management, and strategic planning frameworks used by top tech companies.

You will dive deep into:

• Conducting qualitative and quantitative user research at scale.
• Creating value proposition canvases and customer journey maps.
• Defining IJX metrics and KPIs that matter to stakeholders.`;

function EditChapterModal({ isOpen, onClose, chapter }) {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [duration, setDuration] = useState('45 mins');
  const [lessons, setLessons] = useState('3');
  const [quizzes, setQuizzes] = useState('3');

  useEffect(() => {
    if (chapter) {
      setDuration(`${chapter.totalMins || 45} mins`);
      setLessons(String(chapter.lessons?.length || 3));
      setQuizzes(String(chapter.quizzes ?? 3));
      if (chapter.aboutDescription && chapter.aboutBulletTitle && chapter.aboutBullets) {
        const bulletText = chapter.aboutBullets.map((b) => `• ${b}`).join('\n');
        setDescription(
          `${chapter.aboutDescription}\n\n${chapter.aboutBulletTitle}\n\n${bulletText}`
        );
      }
    }
  }, [chapter]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSendForApproval = () => {
    onClose();
  };

  return (
    <div className="tutor-edit-chapter-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="tutor-edit-chapter-modal-content slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="tutor-edit-chapter-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="tutor-edit-chapter-modal-header">
          <h2 className="tutor-edit-chapter-modal-title">Edit Chapter</h2>
          <p className="tutor-edit-chapter-modal-subtitle">Edit and submit for approval.</p>
        </div>

        <div className="tutor-edit-chapter-modal-body">
          <label className="tutor-edit-chapter-modal-label">Chapter description</label>
          <textarea
            className="tutor-edit-chapter-modal-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
          />

          <div className="tutor-edit-chapter-modal-fields">
            <div className="tutor-edit-chapter-modal-field">
              <label className="tutor-edit-chapter-modal-field-label">Duration</label>
              <select
                className="tutor-edit-chapter-modal-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
                <option value="90 mins">90 mins</option>
              </select>
            </div>
            <div className="tutor-edit-chapter-modal-field">
              <label className="tutor-edit-chapter-modal-field-label">Lessons</label>
              <select
                className="tutor-edit-chapter-modal-select"
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="tutor-edit-chapter-modal-field">
              <label className="tutor-edit-chapter-modal-field-label">Quizzes</label>
              <select
                className="tutor-edit-chapter-modal-select"
                value={quizzes}
                onChange={(e) => setQuizzes(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
        </div>

        <div className="tutor-edit-chapter-modal-footer">
          <button type="button" className="tutor-edit-chapter-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="tutor-edit-chapter-btn-submit"
            onClick={handleSendForApproval}
          >
            Send for Approval
            <span className="tutor-edit-chapter-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditChapterModal;
