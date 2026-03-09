import React, { useState, useRef, useEffect } from 'react';
import { useGetCoursesWithChaptersQuery, useCreateTutorLessonMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-upload-lesson.css';

function TutorUploadLesson() {
  const [courseId, setCourseId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [resourceFiles, setResourceFiles] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);

  const videoInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const { data: coursesList = [] } = useGetCoursesWithChaptersQuery();
  const [createLesson, { isLoading: submitting }] = useCreateTutorLessonMutation();

  const courses = Array.isArray(coursesList) ? coursesList : [];
  const selectedCourse = courses.find((c) => String(c.id) === String(courseId));
  const chapters = selectedCourse?.chapters ?? [];

  useEffect(() => {
    setChapterId('');
  }, [courseId]);

  const handleVideoClick = () => videoInputRef.current?.click();
  const handleResourceClick = () => resourceInputRef.current?.click();

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        setVideoDuration(Math.ceil(vid.duration) || 0);
        vid.remove();
      };
      vid.src = URL.createObjectURL(file);
    }
    e.target.value = '';
  };

  const handleResourceChange = (e) => {
    const files = e.target.files;
    if (files?.length) setResourceFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && /video\//.test(file.type)) {
      setVideoFile(file);
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        setVideoDuration(Math.ceil(vid.duration) || 0);
        vid.remove();
      };
      vid.src = URL.createObjectURL(file);
    }
  };

  const handleResourceDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) setResourceFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const buildFormData = (status = 'submitted') => {
    const fd = new FormData();
    fd.append('chapter_id', chapterId);
    fd.append('title', videoTitle || 'Untitled');
    fd.append('description', description || '');
    fd.append('is_review', '0');
    fd.append('video_duration', String(videoDuration));
    fd.append('status', status);
    if (videoFile) fd.append('video', videoFile);
    resourceFiles.forEach((f) => fd.append('resource', f));
    return fd;
  };

  const handleSaveDraft = async () => {
    if (!chapterId || !videoTitle.trim()) {
      showError('Please select chapter and enter video title.');
      return;
    }
    try {
      const fd = buildFormData('draft');
      await createLesson(fd).unwrap();
      showSuccess('Lesson saved as draft.');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to save draft.');
    }
  };

  const handleSubmitApproval = async () => {
    if (!chapterId || !videoTitle.trim()) {
      showError('Please select chapter and enter video title.');
      return;
    }
    if (!videoFile) {
      showError('Please upload a video file.');
      return;
    }
    try {
      const fd = buildFormData('submitted');
      await createLesson(fd).unwrap();
      showSuccess('Lesson submitted for approval.');
      setCourseId('');
      setChapterId('');
      setVideoTitle('');
      setDescription('');
      setNotes('');
      setVideoFile(null);
      setResourceFiles([]);
      setVideoDuration(0);
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to submit.');
    }
  };

  return (
    <div className="tutor-upload-wrapper">
      {/* Page Header */}
      <div className="tutor-upload-header">
        <h1 className="tutor-upload-title">Upload Lesson</h1>
        <p className="tutor-upload-subtitle">Upload video content to admin-created courses for approval</p>
      </div>

      {/* Lesson Details Card */}
      <section className="tutor-upload-card">
        <h2 className="tutor-upload-card-title">Lesson Details</h2>
        
        {/* Course & Chapter Row - Side by Side */}
        <div className="tutor-upload-row">
          <div className="tutor-upload-field">
            <select
              className="tutor-upload-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Select Course *</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title || `Course ${c.id}`}</option>
              ))}
            </select>
          </div>
          <div className="tutor-upload-field">
            <select
              className="tutor-upload-select"
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              disabled={!courseId}
            >
              <option value="">Select Chapter *</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.title || `Chapter ${ch.id}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Title */}
        <div className="tutor-upload-field">
          <input
            type="text"
            className="tutor-upload-input"
            placeholder="Video Title *"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="tutor-upload-field">
          <textarea
            className="tutor-upload-textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Notes */}
        <div className="tutor-upload-field">
          <textarea
            className="tutor-upload-textarea"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </section>

      {/* Video Upload Dropzone */}
      <section className="tutor-upload-dropzone-wrapper">
        <div
          className="tutor-upload-dropzone"
          onClick={handleVideoClick}
          onDrop={handleVideoDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo"
            onChange={handleVideoChange}
            className="tutor-upload-hidden-input"
          />
          <div className="tutor-upload-dropzone-icon">
            <img src="/assets/images/tutor/upload-lesson.svg" alt="" />
          </div>
          <p className="tutor-upload-dropzone-text">
            <span className="tutor-upload-link">Click to upload</span>
            <span className="tutor-upload-or"> or drag and drop</span>
          </p>
          <p className="tutor-upload-dropzone-hint">MP4, MOV, AVI (max 2GB)</p>
        </div>

        {/* Duration Tag */}
        {videoFile && (
          <div className="tutor-upload-duration">
            <span className="tutor-upload-duration-dot"></span>
            <span className="tutor-upload-duration-text">Duration: {Math.floor(videoDuration / 60)}min {videoDuration % 60}s</span>
          </div>
        )}
      </section>

      {/* Upload Guidelines */}
      <section className="tutor-upload-guidelines">
        <div className="tutor-upload-guidelines-row">
          <h3 className="tutor-upload-guidelines-title">Upload Guidelines</h3>
          <div className="tutor-upload-guidelines-badge">
            All videos require <strong>admin approval</strong> before being published.
          </div>
        </div>
        <div className="tutor-upload-guidelines-list">
          <div className="tutor-upload-guideline-item">
            <img src="/assets/images/tutor/upload-right.svg" alt="" className="guideline-check" />
            <span>Ensure clear audio quality</span>
          </div>
          <div className="tutor-upload-guideline-item">
            <img src="/assets/images/tutor/upload-right.svg" alt="" className="guideline-check" />
            <span>HD resolution (720p minimum)</span>
          </div>
          <div className="tutor-upload-guideline-item">
            <img src="/assets/images/tutor/upload-right.svg" alt="" className="guideline-check" />
            <span>Keep videos under 30 minutes</span>
          </div>
          <div className="tutor-upload-guideline-item">
            <img src="/assets/images/tutor/upload-right.svg" alt="" className="guideline-check" />
            <span>Follow SPM curriculum guidelines</span>
          </div>
        </div>
      </section>

      {/* Upload Additional Learning Resources */}
      <section className="tutor-upload-resources">
        <h2 className="tutor-upload-resources-title">Upload Additional Learning Resources</h2>
        <p className="tutor-upload-resources-subtitle">Upload video content to admin-created courses for approval</p>
        
        <div
          className="tutor-upload-dropzone"
          onClick={handleResourceClick}
          onDrop={handleResourceDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={resourceInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.avi,.xlsx"
            multiple
            onChange={handleResourceChange}
            className="tutor-upload-hidden-input"
          />
          <div className="tutor-upload-dropzone-icon">
            <img src="/assets/images/tutor/upload-lesson.svg" alt="" />
          </div>
          <p className="tutor-upload-dropzone-text">
            <span className="tutor-upload-link">Click to upload</span>
            <span className="tutor-upload-or"> or drag and drop</span>
          </p>
          <p className="tutor-upload-dropzone-hint">PDF, DOC, AVI, .xlsx (max 2GB)</p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="tutor-upload-actions">
        <button
          type="button"
          className="tutor-upload-btn-draft"
          onClick={handleSaveDraft}
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          className="tutor-upload-btn-submit"
          onClick={handleSubmitApproval}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </div>
    </div>
  );
}

export default TutorUploadLesson;