import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTutorLessonsQuery, useGetCoursesWithChaptersQuery, useCreateTutorQuizMutation } from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import '../../assets/css/tutor-upload-lesson.css';
import '../../assets/css/tutor-create-quiz.css';

const defaultQuestion = () => ({
  id: Date.now() + Math.random(),
  questionText: '',
  type: 'mcq',
  options: { A: '', B: '', C: '', D: '' },
  correctAnswer: '',
});

function TutorCreateQuiz() {
  const navigate = useNavigate();
  const [testType, setTestType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [chapterIds, setChapterIds] = useState([]);
  const [topicsCovered, setTopicsCovered] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [timeAllowed, setTimeAllowed] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [showResultsAfter, setShowResultsAfter] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [questions, setQuestions] = useState([defaultQuestion()]);

  const { data: lessonsData } = useGetTutorLessonsQuery({});
  const { data: coursesWithChapters = [] } = useGetCoursesWithChaptersQuery();
  const [createQuiz, { isLoading: createLoading }] = useCreateTutorQuizMutation();

  const raw = lessonsData?.data ?? lessonsData?.lessons ?? lessonsData;
  const lessonsList = Array.isArray(raw) ? raw : (raw?.data ? (Array.isArray(raw.data) ? raw.data : []) : []);

  const coursesList = Array.isArray(coursesWithChapters) ? coursesWithChapters : [];
  const allChapters = coursesList.flatMap((course) =>
    (course.chapters || []).map((ch) => ({
      id: ch.id,
      title: ch.title || `Chapter ${ch.id}`,
      courseTitle: course.title || `Course ${course.id}`,
    }))
  );

  const addQuestion = () => setQuestions((prev) => [...prev, defaultQuestion()]);
  const removeQuestion = (id) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [key]: value } : q)));
  };
  const updateOption = (questionId, letter, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, options: { ...q.options, [letter]: value } } : q))
    );
  };

  const buildCreatePayload = (status = 'submitted') => {
    const quizType = testType === 'practice' ? 'lesson_quiz' : testType === 'assessment' ? 'exam_quiz' : 'lesson_quiz';
    const questionsPayload = questions.map((q, i) => {
      const optionValues = q.type === 'mcq'
        ? [q.options.A, q.options.B, q.options.C, q.options.D].filter(Boolean)
        : [];
      const qType = q.type === 'truefalse' ? 'true_false' : 'mcq';
      return {
        text: q.questionText,
        question_text: q.questionText,
        type: qType,
        question_type: qType,
        options: q.type === 'mcq' && optionValues.length ? optionValues : null,
        correct: q.correctAnswer || '',
        correct_answer: q.correctAnswer || null,
        explanation: null,
        order: i + 1,
      };
    });
    const chapterIdNums =
      quizType === 'exam_quiz'
        ? chapterIds
            .map((id) => parseInt(id, 10))
            .filter((n) => Number.isFinite(n))
        : [];

    return {
      status,
      // Backend rule:
      // - lesson_quiz => uses lesson_id only
      // - exam_quiz   => uses chapter_ids only
      lesson_id:
        quizType === 'lesson_quiz' && lessonId
          ? parseInt(lessonId, 10)
          : null,
      chapter_ids:
        quizType === 'exam_quiz' && chapterIdNums.length
          ? chapterIdNums
          : null,
      title: title || 'Untitled Quiz',
      quiz_type: quizType,
      passing_score: passingScore ? parseInt(passingScore, 10) : 70,
      time_limit: timeAllowed ? parseInt(timeAllowed, 10) : 15,
      total_marks: totalMarks ? parseInt(totalMarks, 10) : 10,
      // Backend requires attempts_allowed; UI design did not include this field, so we default to 1 attempt.
      attempts_allowed: 1,
      show_results: showResultsAfter,
      shuffle_questions: shuffleQuestions,
      questions: questionsPayload,
    };
  };

  const handleSubmitApproval = async () => {
    const quizType = testType === 'practice' ? 'lesson_quiz' : testType === 'assessment' ? 'exam_quiz' : 'lesson_quiz';
    if (quizType === 'lesson_quiz') {
      if (!lessonId) {
        showError('Please select a lesson.');
        return;
      }
    } else if (quizType === 'exam_quiz') {
      if (!chapterIds.length) {
        showError('Please select at least one chapter.');
        return;
      }
    }
    const emptyText = questions.find((q) => !(q.questionText && q.questionText.trim()));
    if (emptyText) {
      showError('Question text is required for every question.');
      return;
    }
    const noCorrect = questions.find((q) => !(q.correctAnswer && q.correctAnswer.trim()));
    if (noCorrect) {
      showError('Please select the correct answer for every question.');
      return;
    }
    try {
      await createQuiz(buildCreatePayload('submitted')).unwrap();
      showSuccess('Quiz submitted for approval.');
      setTitle('');
      setQuestions([defaultQuestion()]);
    } catch (err) {
      const msg = err?.data?.message || (err?.data?.errors ? JSON.stringify(err.data.errors) : null) || err?.message || 'Failed to create quiz.';
      showError(msg);
    }
  };

  const handleSaveDraft = async () => {
    const quizType = testType === 'practice' ? 'lesson_quiz' : testType === 'assessment' ? 'exam_quiz' : 'lesson_quiz';
    if (quizType === 'lesson_quiz') {
      if (!lessonId) {
        showError('Please select a lesson.');
        return;
      }
    } else if (quizType === 'exam_quiz') {
      if (!chapterIds.length) {
        showError('Please select at least one chapter.');
        return;
      }
    }
    try {
      await createQuiz(buildCreatePayload('draft')).unwrap();
      showSuccess('Quiz saved as draft.');
    } catch (err) {
      const msg = err?.data?.message || (err?.data?.errors ? JSON.stringify(err.data.errors) : null) || err?.message || 'Failed to save draft.';
      showError(msg);
    }
  };

  const handleCancel = () => navigate('/tutor/courses');

  return (
    <div className="tutor-upload-wrapper">
      <div className="tutor-upload-header">
        <h1 className="tutor-upload-title">Create Quiz</h1>
        <p className="tutor-upload-subtitle">
          All quizzes require admin approval before students can attempt them.
        </p>
      </div>

      <section className="tutor-upload-card">
        <h2 className="tutor-upload-card-title">Quiz Details</h2>

        <div className="tutor-create-quiz-form">
          <div className="tutor-create-quiz-row tutor-create-quiz-two-cols">
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Select Test Type *</label>
              <select className="tutor-upload-select" value={testType} onChange={(e) => setTestType(e.target.value)}>
                <option value="">Select Test Type</option>
                <option value="practice">Practice</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Title *</label>
              <input type="text" className="tutor-upload-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>

          <div className="tutor-upload-field tutor-create-quiz-desc-full">
            <label className="tutor-create-quiz-label-required">Description *</label>
            <textarea className="tutor-upload-textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="tutor-create-quiz-row tutor-create-quiz-two-cols">
            {/* Left: Select Chapter (Assessment), hidden in Practice so layout same as design */}
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Select Chapter *</label>
              <select
                className="tutor-upload-select"
                value={chapterIds[0] || ''}
                onChange={(e) => setChapterIds(e.target.value ? [e.target.value] : [])}
              >
                <option value="">Select Chapter *</option>
                {allChapters.map((ch) => (
                  <option key={`${ch.id}-${ch.courseTitle}`} value={ch.id}>
                    {ch.courseTitle} – {ch.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Select Lesson (Practice) */}
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Select Lesson *</label>
              <select
                className="tutor-upload-select"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
              >
                <option value="">Select Lesson *</option>
                {lessonsList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title || `Lesson ${l.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tutor-create-quiz-row tutor-create-quiz-two-cols">
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Topics Covered *</label>
              <select className="tutor-upload-select" value={topicsCovered} onChange={(e) => setTopicsCovered(e.target.value)}>
                <option value="">Select topics</option>
                <option value="Algebra">Algebra</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Passing Score *</label>
              <input type="text" className="tutor-upload-input" placeholder="e.g. 70" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} />
            </div>
          </div>

          <div className="tutor-create-quiz-row tutor-create-quiz-two-cols">
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Time Allowed *</label>
              <select className="tutor-upload-select" value={timeAllowed} onChange={(e) => setTimeAllowed(e.target.value)}>
                <option value="">Time Allowed</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Total Marks *</label>
              <input type="text" className="tutor-upload-input" placeholder="e.g. 20" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="tutor-create-quiz-checkbox-row">
          <label className="tutor-create-quiz-checkbox-label">
            <input type="checkbox" className="tutor-create-quiz-checkbox" checked={showResultsAfter} onChange={(e) => setShowResultsAfter(e.target.checked)} />
            Show Results after Submission
          </label>
          <label className="tutor-create-quiz-checkbox-label">
            <input type="checkbox" className="tutor-create-quiz-checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} />
            Shuffle Questions
          </label>
        </div>

        <h3 className="tutor-create-quiz-label-required" style={{ marginTop: 24 }}>Questions</h3>
        {questions.map((q) => (
          <div key={q.id} className="tutor-create-quiz-question-card">
            <div className="tutor-upload-field">
              <label className="tutor-create-quiz-label-required">Type your question *</label>
              <input type="text" className="tutor-upload-input" placeholder="Type your question" value={q.questionText} onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)} />
            </div>
            <div className="tutor-create-quiz-question-type" style={{ marginTop: 12, marginBottom: 16 }}>
              <label className="tutor-create-quiz-checkbox-label">
                <input type="radio" name={`type-${q.id}`} checked={q.type === 'mcq'} onChange={() => updateQuestion(q.id, 'type', 'mcq')} /> MCQs
              </label>
              <label className="tutor-create-quiz-checkbox-label">
                <input type="radio" name={`type-${q.id}`} checked={q.type === 'truefalse'} onChange={() => updateQuestion(q.id, 'type', 'truefalse')} /> True & False
              </label>
            </div>

            {q.type === 'mcq' && (
              <div className="tutor-create-quiz-options-grid">
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <div key={letter} className="tutor-create-quiz-option-row">
                    <span className="tutor-create-quiz-option-letter">{letter}</span>
                    <input type="text" className="tutor-create-quiz-option-input" placeholder={`Type option ${letter}`} value={q.options[letter]} onChange={(e) => updateOption(q.id, letter, e.target.value)} />
                  </div>
                ))}
              </div>
            )}
            {q.type === 'truefalse' && (
              <div className="tutor-create-quiz-options-grid">
                <div className="tutor-create-quiz-option-row">
                  <span className="tutor-create-quiz-option-letter">T</span>
                  <input type="text" className="tutor-create-quiz-option-input" placeholder="True" value="True" readOnly />
                </div>
                <div className="tutor-create-quiz-option-row">
                  <span className="tutor-create-quiz-option-letter">F</span>
                  <input type="text" className="tutor-create-quiz-option-input" placeholder="False" value="False" readOnly />
                </div>
              </div>
            )}

            <div className="tutor-upload-field" style={{ marginTop: 12 }}>
              <label className="tutor-create-quiz-label-required">Correct answer *</label>
              {q.type === 'mcq' ? (
                <select className="tutor-upload-select" value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}>
                  <option value="">Select correct option</option>
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <option key={letter} value={q.options[letter] || letter}>{letter}: {q.options[letter] || '—'}</option>
                  ))}
                </select>
              ) : (
                <select className="tutor-upload-select" value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}>
                  <option value="">Select correct</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              )}
            </div>

            {questions.length > 1 && (
              <button type="button" className="tutor-upload-btn-draft" style={{ marginTop: 12 }} onClick={() => removeQuestion(q.id)}>Remove question</button>
            )}
          </div>
        ))}

        <button type="button" className="tutor-create-quiz-add-question" onClick={addQuestion}>
          <span className="tutor-create-quiz-add-question-icon">+</span>
          Add another question
        </button>

        <div className="tutor-upload-actions" style={{ marginTop: 24 }}>
          <button type="button" className="tutor-upload-btn-draft" onClick={handleCancel}>Cancel</button>
          <button type="button" className="tutor-upload-btn-draft" onClick={handleSaveDraft} disabled={createLoading}>Save as Draft</button>
          <button type="button" className="tutor-upload-btn-submit" onClick={handleSubmitApproval} disabled={createLoading}>
            {createLoading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default TutorCreateQuiz;
