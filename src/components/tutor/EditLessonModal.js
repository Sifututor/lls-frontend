/**
 * Edit Lesson modal – same design as Edit Chapter modal.
 * Content: title, subtitle, lesson description, video upload, duration, downloadable materials, Cancel + Send for Approval.
 */
import React, { useEffect, useState } from 'react';

const DEFAULT_DESCRIPTION = `This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.`;

function EditLessonModal({ isOpen, onClose, lesson }) {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [duration, setDuration] = useState('15 mins');

  useEffect(() => {
    if (lesson) {
      if (lesson.description) setDescription(lesson.description);
      if (lesson.duration) setDuration(lesson.duration);
    }
  }, [lesson]);

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
          <h2 className="tutor-edit-chapter-modal-title">Edit Lesson</h2>
          <p className="tutor-edit-chapter-modal-subtitle">Edit and submit for approval</p>
        </div>

        <div className="tutor-edit-chapter-modal-body">
          <label className="tutor-edit-chapter-modal-label">Lesson description</label>
          <textarea
            className="tutor-edit-chapter-modal-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency."
          />

          <div className="tutor-edit-lesson-modal-video-row">
            <div className="tutor-edit-lesson-modal-thumb">
              <img src="/assets/images/course-details-img.jpg" alt="Lesson" onError={(e) => { e.target.style.display = 'none'; }} />
              <span className="tutor-edit-lesson-modal-play" aria-hidden>▶</span>
            </div>
            <div className="tutor-edit-lesson-modal-video-text">
              <span className="tutor-edit-lesson-modal-video-title">Upload Another Lesson</span>
              <span className="tutor-edit-lesson-modal-video-hint">MP4, MOV, AVI (max 2GB)</span>
            </div>
          </div>

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

          <div className="tutor-edit-lesson-modal-upload-zone">
            <span className="tutor-edit-lesson-modal-upload-title">Upload downloadable materials</span>
            <span className="tutor-edit-lesson-modal-upload-hint">PDF, DOC, AVI, .xlsx (max 2GB)</span>
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

export default EditLessonModal;
