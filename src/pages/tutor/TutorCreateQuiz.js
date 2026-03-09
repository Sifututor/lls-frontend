/**
 * Create Quiz page – tutor. Dynamic: courses/chapters/lessons from API, create via POST /tutor/quizzes.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTutorCoursesQuery, useGetTutorCourseByIdQuery, useCreateTutorQuizMutation } from '../../store/api/authApi';
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
  const [chapterId, setChapterId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [timeAllowed, setTimeAllowed] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [attemptsAllowed, setAttemptsAllowed] = useState('3');
  const [showResultsAfter, setShowResultsAfter] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [questions, setQuestions] = useState([defaultQuestion()]);

  const { data: coursesRes } = useGetTutorCoursesQuery(1);
  const [courseId, setCourseId] = useState('');
  const { data: courseDetail } = useGetTutorCourseByIdQuery(courseId, { skip: !courseId });
  const [createQuiz, { isLoading: createLoading }] = useCreateTutorQuizMutation();

  const courses = coursesRes?.courses?.data ?? coursesRes?.data ?? [];
  const course = courseDetail?.course ?? courseDetail;
  const chapters = course?.chapters ?? [];
  const lessons = chapters.flatMap((ch) => (ch.lessons ?? []).map((l) => ({ ...l, chapterId: ch.id })));

  useEffect(() => {
    if (!courseId) {
      setChapterId('');
      setLessonId('');
    }
  }, [courseId]);

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
    const chapterIdsArray = chapterId
      ? chapterId.split(',').map((id) => parseInt(id.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [];
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
    return {
      status,
      lesson_id: lessonId ? parseInt(lessonId, 10) : undefined,
      chapter_ids: chapterIdsArray,
      title: title || 'Untitled Quiz',
      quiz_type: quizType,
      passing_score: passingScore ? parseInt(passingScore, 10) : 70,
      time_limit: timeAllowed ? parseInt(timeAllowed, 10) : 15,
      total_marks: totalMarks ? parseInt(totalMarks, 10) : 10,
      attempts_allowed: Math.min(attemptsAllowed ? parseInt(attemptsAllowed, 10) : 3, 3),
      show_results: showResultsAfter,
      shuffle_questions: shuffleQuestions,
      questions: questionsPayload,
    };
  };

  const handleSubmitApproval = async () => {
    if (!chapterId && !lessonId) {
      showError('Please select a chapter or lesson.');
      return;
    }
    const emptyText = questions.find((q) => !(q.questionText && q.questionText.trim()));
    if (emptyText) {
      showError('Har question ka text likhein (Question text required).');
      return;
    }
    const noCorrect = questions.find((q) => !(q.correctAnswer && q.correctAnswer.trim()));
    if (noCorrect) {
      showError('Har question mein "Correct answer" select karein.');
      return;
    }
    try {
      await createQuiz(buildCreatePayload('submitted')).unwrap();
      showSuccess('Quiz submitted for approval. Admin will review and approve it.');
      setTitle('');
      setQuestions([defaultQuestion()]);
    } catch (err) {
      const msg = err?.data?.message || (err?.data?.errors ? JSON.stringify(err.data.errors) : null) || err?.message || 'Failed to create quiz.';
      showError(msg);
    }
  };

  const handleSaveDraft = async () => {
    if (!chapterId && !lessonId) {
      showError('Please select a chapter or lesson.');
      return;
    }
    try {
      await createQuiz(buildCreatePayload('draft')).unwrap();
      showSuccess('Quiz saved as draft. You can submit for review later.');
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

      {/* Quiz Details */}
      <section className="tutor-upload-card">
        <h2 className="tutor-upload-card-title">Quiz Details</h2>

        <div className="tutor-upload-row">
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Test Type *</label>
            <select className="tutor-upload-select" value={testType} onChange={(e) => setTestType(e.target.value)}>
              <option value="">Select Test Type</option>
              <option value="practice">Practice</option>
              <option value="assessment">Assessment</option>
            </select>
          </div>
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Title</label>
            <input type="text" className="tutor-upload-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>

        <div className="tutor-upload-row">
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Course</label>
            <select className="tutor-upload-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title || `Course ${c.id}`}</option>
              ))}
            </select>
          </div>
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Chapter</label>
            <select className="tutor-upload-select" value={chapterId} onChange={(e) => setChapterId(e.target.value)} disabled={!courseId}>
              <option value="">Select Chapter</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.title || `Chapter ${ch.id}`}</option>
              ))}
            </select>
          </div>
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Lesson</label>
            <select className="tutor-upload-select" value={lessonId} onChange={(e) => setLessonId(e.target.value)} disabled={!courseId}>
              <option value="">Select Lesson (optional)</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>{l.title || `Lesson ${l.id}`}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tutor-upload-row">
          <div className="tutor-upload-field">
            <label>Passing Score</label>
            <select className="tutor-upload-select" value={passingScore} onChange={(e) => setPassingScore(e.target.value)}>
              <option value="">Passing Score</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
              <option value="60">60%</option>
            </select>
          </div>
          <div className="tutor-upload-field">
            <label>Time Allowed</label>
            <select className="tutor-upload-select" value={timeAllowed} onChange={(e) => setTimeAllowed(e.target.value)}>
              <option value="">Time Allowed</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
            </select>
          </div>
          <div className="tutor-upload-field">
            <label>Total Marks</label>
            <select className="tutor-upload-select" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)}>
              <option value="">Total Marks</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="tutor-upload-field">
            <label>Attempts allowed</label>
            <select className="tutor-upload-select" value={attemptsAllowed} onChange={(e) => setAttemptsAllowed(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
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

        {/* Questions */}
        <h3 className="tutor-create-quiz-label-required" style={{ marginTop: 24 }}>Questions</h3>
        {questions.map((q) => (
          <div key={q.id} className="tutor-create-quiz-question-card">
            <div className="tutor-create-quiz-question-header">
              <div className="tutor-create-quiz-question-input-wrap">
                <label className="tutor-create-quiz-label-required">Question text *</label>
                <input type="text" className="tutor-upload-input" placeholder="Enter question" value={q.questionText} onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)} />
              </div>
              <div className="tutor-create-quiz-question-type">
                <label className="tutor-create-quiz-checkbox-label">
                  <input type="radio" name={`type-${q.id}`} checked={q.type === 'mcq'} onChange={() => updateQuestion(q.id, 'type', 'mcq')} /> MCQ
                </label>
                <label className="tutor-create-quiz-checkbox-label">
                  <input type="radio" name={`type-${q.id}`} checked={q.type === 'truefalse'} onChange={() => updateQuestion(q.id, 'type', 'truefalse')} /> True/False
                </label>
              </div>
            </div>

            {q.type === 'mcq' && (
              <div className="tutor-create-quiz-options-grid">
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <div key={letter} className="tutor-create-quiz-option-row">
                    <span className="tutor-create-quiz-option-letter">{letter}</span>
                    <input type="text" className="tutor-create-quiz-option-input" placeholder={`Option ${letter}`} value={q.options[letter]} onChange={(e) => updateOption(q.id, letter, e.target.value)} />
                  </div>
                ))}
              </div>
            )}
            {q.type === 'truefalse' && (
              <div className="tutor-create-quiz-options-grid">
                <div className="tutor-create-quiz-option-row">
                  <span className="tutor-create-quiz-option-letter">T</span>
                  <input type="text" className="tutor-create-quiz-option-input" placeholder="True" value={q.options.A} onChange={(e) => updateOption(q.id, 'A', e.target.value)} />
                </div>
                <div className="tutor-create-quiz-option-row">
                  <span className="tutor-create-quiz-option-letter">F</span>
                  <input type="text" className="tutor-create-quiz-option-input" placeholder="False" value={q.options.B} onChange={(e) => updateOption(q.id, 'B', e.target.value)} />
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
            {createLoading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default TutorCreateQuiz;
