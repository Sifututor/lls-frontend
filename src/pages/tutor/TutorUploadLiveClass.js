/**
 * Upload Live Class – Dashboard Quick Actions wala form. (Upload Recording = sidebar detail.)
 * Content: Select Live Class, Description, Recording Details dropzone, Downloadable Material, Upload Live Class button.
 * URL: /tutor/live-classes/upload-live-class
 */
import React, { useState, useRef } from 'react';
import '../../assets/css/tutor-upload-lesson.css';
import '../../assets/css/tutor-upload-live-class.css';

const LIVE_CLASSES_OPTIONS = [
  { value: '', label: 'Select Live Class *' },
  { value: '1', label: 'Probability Revision - Form 4 • Mathematics' },
  { value: '2', label: 'Integration Techniques - Form 5 • Add Maths' },
  { value: '3', label: 'Modern Maths - Form 4' },
];

function TutorUploadLiveClass() {
  const [liveClassId, setLiveClassId] = useState('');
  const [description, setDescription] = useState('');
  const [recordingFiles, setRecordingFiles] = useState([]);
  const [materialFiles, setMaterialFiles] = useState([]);

  const recordingInputRef = useRef(null);
  const materialInputRef = useRef(null);

  const handleRecordingClick = () => recordingInputRef.current?.click();
  const handleMaterialClick = () => materialInputRef.current?.click();

  const handleRecordingChange = (e) => {
    const files = e.target.files;
    if (files?.length) setRecordingFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleMaterialChange = (e) => {
    const files = e.target.files;
    if (files?.length) setMaterialFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleRecordingDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) setRecordingFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleMaterialDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) setMaterialFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUploadLiveClass = () => {
    console.log('Upload Live Class', { liveClassId, description, recordingFiles, materialFiles });
  };

  return (
    <div className="tutor-upload-wrapper tutor-live-class-wrapper">
      <div className="tutor-upload-card tutor-live-class-main-card">
        <div className="tutor-upload-header">
          <h1 className="tutor-upload-title">Upload Live Class</h1>
          <p className="tutor-upload-subtitle">Upload recordings of completed live classes manually.</p>
        </div>

        <div className="tutor-live-class-form-fields">
          <div className="tutor-upload-field">
            <select
            className="tutor-upload-select"
            value={liveClassId}
            onChange={(e) => setLiveClassId(e.target.value)}
          >
            {LIVE_CLASSES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="tutor-upload-field">
          <textarea
            className="tutor-upload-textarea"
            placeholder="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        </div>

        <section className="tutor-live-class-section">
        <h2 className="tutor-live-class-section-title">Recording Details</h2>
        <div
          className="tutor-upload-dropzone"
          onClick={handleRecordingClick}
          onDrop={handleRecordingDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={recordingInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo"
            multiple
            onChange={handleRecordingChange}
            className="tutor-upload-hidden-input"
          />
          <div className="tutor-upload-dropzone-icon">
            <img src="/assets/images/tutor/upload-lesson.svg" alt="" />
          </div>
          <p className="tutor-upload-dropzone-text">
            <span className="tutor-upload-link">Click to upload</span>
            <span className="tutor-upload-or"> or drag and drop</span>
          </p>
          <p className="tutor-upload-dropzone-hint">MP4, MOV, AVI (max 4GB)</p>
        </div>
        {recordingFiles.length > 0 && (
          <div className="tutor-live-class-previews">
            {recordingFiles.map((file, i) => (
              <div key={i} className="tutor-live-class-preview-item">
                <div className="tutor-live-class-preview-thumb">
                  <span className="tutor-live-class-play-icon">▶</span>
                </div>
                <span className="tutor-live-class-preview-name">{file.name}</span>
              </div>
            ))}
          </div>
        )}
        </section>

        <section className="tutor-live-class-section">
          <h2 className="tutor-live-class-section-title">Downloadable Material</h2>
        <div
          className="tutor-upload-dropzone"
          onClick={handleMaterialClick}
          onDrop={handleMaterialDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={materialInputRef}
            type="file"
            accept=".pdf,.zip,.doc,.docx"
            multiple
            onChange={handleMaterialChange}
            className="tutor-upload-hidden-input"
          />
          <div className="tutor-upload-dropzone-icon">
            <img src="/assets/images/tutor/upload-lesson.svg" alt="" />
          </div>
          <p className="tutor-upload-dropzone-text">
            <span className="tutor-upload-link">Click to upload</span>
            <span className="tutor-upload-or"> or drag and drop</span>
          </p>
          <p className="tutor-upload-dropzone-hint">PDF, ZIP, DOC (max 4GB)</p>
        </div>
        {materialFiles.length > 0 && (
          <div className="tutor-live-class-files-list">
            {materialFiles.map((file, i) => (
              <div key={i} className="tutor-live-class-file-item">
                <span className="tutor-live-class-file-name">{file.name}</span>
                <span className="tutor-live-class-file-size">{formatFileSize(file.size)}</span>
              </div>
            ))}
          </div>
        )}
        {materialFiles.length === 0 && (
          <div className="tutor-live-class-files-list tutor-live-class-files-placeholder">
            <div className="tutor-live-class-file-item">
              <span className="tutor-live-class-file-name">Light_Waves_Summary.pdf</span>
              <span className="tutor-live-class-file-size">1.2 MB</span>
            </div>
            <div className="tutor-live-class-file-item">
              <span className="tutor-live-class-file-name">Experiment_Data.zip</span>
              <span className="tutor-live-class-file-size">210 MB</span>
            </div>
          </div>
        )}
        </section>

        <div className="tutor-live-class-actions">
          <button
            type="button"
            className="tutor-live-class-btn-upload"
            onClick={handleUploadLiveClass}
          >
            Upload Live Class
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorUploadLiveClass;
