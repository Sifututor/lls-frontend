import React from 'react';

function VideoQAFilterBar({ courseId, subjectId, formLevel, onCourseChange, onSubjectChange, onFormLevelChange, onApply }) {
  const course = courseId ?? '';
  const subject = subjectId ?? '';
  const fl = formLevel ?? '';
  return (
    <div className="tutor-video-qa-filters">
      <select
        className="tutor-video-qa-select"
        value={course}
        onChange={(e) => onCourseChange(e.target.value || '')}
      >
        <option value="">Course</option>
        <option value="1">Algebra for Beginners</option>
      </select>
      <select
        className="tutor-video-qa-select"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value || '')}
      >
        <option value="">Subject</option>
        <option value="1">Mathematics</option>
        <option value="2">Physics</option>
      </select>
      <select
        className="tutor-video-qa-select"
        value={fl}
        onChange={(e) => onFormLevelChange(e.target.value || '')}
      >
        <option value="">Form Level</option>
        <option value="1">Form 1</option>
        <option value="2">Form 2</option>
        <option value="3">Form 3</option>
        <option value="4">Form 4</option>
        <option value="5">Form 5</option>
      </select>
      <button type="button" className="tutor-video-qa-btn-apply" onClick={onApply}>
        Apply Filters
      </button>
    </div>
  );
}

export default VideoQAFilterBar;
