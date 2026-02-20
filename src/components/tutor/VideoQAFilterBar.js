import React from 'react';

function VideoQAFilterBar({ course, subject, formLevel, onCourseChange, onSubjectChange, onFormLevelChange, onApply }) {
  return (
    <div className="tutor-video-qa-filters">
      <select
        className="tutor-video-qa-select"
        value={course}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">Course</option>
        <option value="Add Maths Form 4">Add Maths Form 4</option>
        <option value="Mathematics Form 5">Mathematics Form 5</option>
      </select>
      <select
        className="tutor-video-qa-select"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
      >
        <option value="">Subject</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Add Maths">Add Maths</option>
      </select>
      <select
        className="tutor-video-qa-select"
        value={formLevel}
        onChange={(e) => onFormLevelChange(e.target.value)}
      >
        <option value="">Form Level</option>
        <option value="Form 4">Form 4</option>
        <option value="Form 5">Form 5</option>
      </select>
      <button type="button" className="tutor-video-qa-btn-apply" onClick={onApply}>
        Apply Filters
      </button>
    </div>
  );
}

export default VideoQAFilterBar;
