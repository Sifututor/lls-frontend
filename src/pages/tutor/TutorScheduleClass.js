/**
 * Schedule Class page – dynamic: courses from API, create via POST /tutor/live-classes
 */
import React, { useState } from 'react';
import { useGetTutorCoursesQuery, useCreateTutorLiveClassMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-upload-lesson.css';
import '../../assets/css/tutor-schedule-class.css';

function TutorScheduleClass() {
  const [courseId, setCourseId] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [classDuration, setClassDuration] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { data: coursesRes } = useGetTutorCoursesQuery(1);
  const [createLiveClass, { isLoading: submitting }] = useCreateTutorLiveClassMutation();
  const courses = coursesRes?.courses?.data ?? coursesRes?.data ?? [];

  const validate = (name, value) => {
    switch (name) {
      case 'courseId':
        return !value || value === '' ? 'Please select a course' : '';
      case 'classTitle':
        return !value || !value.trim() ? 'Class title is required' : '';
      case 'date':
        return !value || value === '' ? 'Please select date' : '';
      case 'startTime':
        return !value || value === '' ? 'Please select start time' : '';
      case 'classDuration':
        return !value || !value.trim() ? 'Class duration is required' : '';
      case 'description':
        return !value || !value.trim() ? 'Description is required' : '';
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseId') setCourseId(value);
    else if (name === 'classTitle') setClassTitle(value);
    else if (name === 'date') setDate(value);
    else if (name === 'startTime') setStartTime(value);
    else if (name === 'classDuration') setClassDuration(value);
    else if (name === 'description') setDescription(value);
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { courseId: true, classTitle: true, date: true, startTime: true, classDuration: true, description: true };
    setTouched(allTouched);
    const newErrors = {
      courseId: validate('courseId', courseId),
      classTitle: validate('classTitle', classTitle),
      date: validate('date', date),
      startTime: validate('startTime', startTime),
      classDuration: validate('classDuration', classDuration),
      description: validate('description', description),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).every((err) => !err)) {
      const dt = new Date(`${date}T${startTime}`);
      createLiveClass({
        title: classTitle,
        course_id: parseInt(courseId, 10),
        scheduled_at: dt.toISOString().slice(0, 19).replace('T', ' '),
        duration: parseInt(classDuration, 10) || 60,
        description,
      })
        .unwrap()
        .then(() => {
          showSuccess('Class scheduled successfully.');
          setCourseId('');
          setClassTitle('');
          setDate('');
          setStartTime('');
          setClassDuration('');
          setDescription('');
        })
        .catch((err) => showError(err?.data?.message || err?.message || 'Failed to schedule.'));
    }
  };

  return (
    <div className="tutor-schedule-wrapper">
      <div className="tutor-upload-header">
        <h1 className="tutor-upload-title">Schedule Class</h1>
        <p className="tutor-upload-subtitle">
          View and manage content for your assigned courses
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <section className="tutor-upload-card">
          <h2 className="tutor-upload-card-title">Class Details</h2>

          <div className="tutor-upload-row">
            <div className={`tutor-upload-field tutor-schedule-select-wrap ${!courseId ? 'tutor-schedule-select-empty' : ''}`}>
              <span className={`tutor-schedule-select-placeholder ${courseId ? 'tutor-schedule-placeholder-hide' : ''}`}>
                Select Course <span className="tutor-schedule-asterisk">*</span>
              </span>
              <select
                name="courseId"
                className={`tutor-upload-select ${errors.courseId ? 'tutor-schedule-input-error' : ''}`}
                value={courseId}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title || `Course ${c.id}`}</option>
                ))}
              </select>
              {errors.courseId && <span className="tutor-schedule-error-text">{errors.courseId}</span>}
            </div>
            <div className="tutor-upload-field">
              <input
                name="classTitle"
                type="text"
                className={`tutor-upload-input tutor-schedule-input ${errors.classTitle ? 'tutor-schedule-input-error' : ''}`}
                placeholder="Class Title *"
                value={classTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.classTitle && <span className="tutor-schedule-error-text">{errors.classTitle}</span>}
            </div>
          </div>

          <div className="tutor-schedule-row-3">
            <div className="tutor-upload-field">
              <div className="tutor-schedule-date-time-wrap">
                <input
                  name="date"
                  type="date"
                  className={`tutor-upload-input tutor-schedule-date-input ${errors.date ? 'tutor-schedule-input-error' : ''}`}
                  value={date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {errors.date && <span className="tutor-schedule-error-text">{errors.date}</span>}
            </div>
            <div className="tutor-upload-field">
              <div className="tutor-schedule-input-wrap tutor-schedule-date-time-wrap">
                <input
                  name="startTime"
                  type="time"
                  className={`tutor-upload-input tutor-schedule-time-input ${errors.startTime ? 'tutor-schedule-input-error' : ''}`}
                  value={startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="tutor-schedule-icon-btn" aria-hidden>
                  <img src="/assets/images/tutor/tutor-time.svg" alt="" />
                </span>
              </div>
              {errors.startTime && <span className="tutor-schedule-error-text">{errors.startTime}</span>}
            </div>
            <div className="tutor-upload-field">
              <div className="tutor-schedule-input-wrap">
                <input
                  name="classDuration"
                  type="text"
                  className={`tutor-upload-input tutor-schedule-input ${errors.classDuration ? 'tutor-schedule-input-error' : ''}`}
                  placeholder="Class Duration *"
                  value={classDuration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span className="tutor-schedule-icon-btn" aria-hidden>
                  <img src="/assets/images/tutor/tutor-time.svg" alt="" />
                </span>
              </div>
              {errors.classDuration && <span className="tutor-schedule-error-text">{errors.classDuration}</span>}
            </div>
          </div>

          <div className="tutor-upload-field">
            <textarea
              name="description"
              className={`tutor-upload-textarea tutor-schedule-textarea ${errors.description ? 'tutor-schedule-input-error' : ''}`}
              placeholder="Description *"
              value={description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              required
            />
            {errors.description && <span className="tutor-schedule-error-text">{errors.description}</span>}
          </div>
        </section>

        <div className="tutor-schedule-actions">
          <button type="submit" className="tutor-schedule-btn-submit" disabled={submitting}>
            {submitting ? 'Scheduling...' : 'Schedule Class'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TutorScheduleClass;
