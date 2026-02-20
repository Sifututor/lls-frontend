/**
 * Create Quiz page – tutor. Dynamic: quiz list from API, create via POST /tutor/quizzes.
 * Backend expects: questions[].text, questions[].type, chapter_ids array, attempts_allowed max 3.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTutorQuizzesQuery, useCreateTutorQuizMutation, useDeleteTutorQuizMutation } from '../../store/api/authApi';
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
  const [quizListPage, setQuizListPage] = useState(1);
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

  const { data: quizzesData, isLoading: quizzesLoading } = useGetTutorQuizzesQuery(quizListPage);
  const [createQuiz, { isLoading: createLoading }] = useCreateTutorQuizMutation();
  const [deleteQuiz] = useDeleteTutorQuizMutation();

  const quizList = (quizzesData?.success && quizzesData?.data?.data) ? quizzesData.data.data : [];
  const pagination = quizzesData?.success && quizzesData?.data
    ? { current: quizzesData.data.current_page, last: quizzesData.data.last_page, total: quizzesData.data.total }
    : null;

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
    if (!lessonId) {
      showError('Please select a lesson.');
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
    if (!lessonId) {
      showError('Please select a lesson.');
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

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await deleteQuiz(id).unwrap();
      showSuccess('Quiz deleted.');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to delete quiz.');
    }
  };

  return (
    <div className="tutor-upload-wrapper">
      <div className="tutor-upload-header">
        <h1 className="tutor-upload-title">Create Quiz</h1>
        <p className="tutor-upload-subtitle">
          All quizzes require admin approval before students can attempt them.
        </p>
      </div>

      {/* Your Quizzes */}
      <section className="tutor-upload-card" style={{ marginBottom: 24 }}>
        <h2 className="tutor-upload-card-title">Your Quizzes</h2>
        {quizzesLoading ? (
          <p style={{ color: '#9A9A9A' }}>Loading quizzes...</p>
        ) : quizList.length === 0 ? (
          <p style={{ color: '#9A9A9A' }}>No quizzes yet. Create one below.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #CFCFCF' }}>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Lesson</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Marks</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}>Time</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {quizList.map((q) => (
                    <tr key={q.id} style={{ borderBottom: '1px solid #CFCFCF' }}>
                      <td style={{ padding: '10px 8px' }}>{q.title}</td>
                      <td style={{ padding: '10px 8px' }}>{q.lesson?.title || '—'}</td>
                      <td style={{ padding: '10px 8px' }}>{q.quiz_type || '—'}</td>
                      <td style={{ padding: '10px 8px' }}>{q.status || '—'}</td>
                      <td style={{ padding: '10px 8px' }}>{q.total_marks ?? '—'}</td>
                      <td style={{ padding: '10px 8px' }}>{q.time_limit != null ? `${q.time_limit} min` : '—'}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button type="button" onClick={() => handleDeleteQuiz(q.id)} style={{ background: 'none', border: 'none', color: '#DD4040', cursor: 'pointer', fontSize: 13 }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && pagination.last > 1 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" disabled={pagination.current <= 1} onClick={() => setQuizListPage((p) => p - 1)} style={{ padding: '6px 12px' }}>← Previous</button>
                <span style={{ color: '#9A9A9A', fontSize: 13 }}>Page {pagination.current} of {pagination.last}</span>
                <button type="button" disabled={pagination.current >= pagination.last} onClick={() => setQuizListPage((p) => p + 1)} style={{ padding: '6px 12px' }}>Next →</button>
              </div>
            )}
          </>
        )}
      </section>

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
            <label className="tutor-create-quiz-label-required">Chapter</label>
            <select className="tutor-upload-select" value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
              <option value="">Select Chapter</option>
              <option value="1">Chapter 1</option>
              <option value="2">Chapter 2</option>
            </select>
          </div>
          <div className="tutor-upload-field">
            <label className="tutor-create-quiz-label-required">Lesson *</label>
            <select className="tutor-upload-select" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
              <option value="">Select Lesson</option>
              <option value="1">Lesson 1</option>
              <option value="2">Lesson 2</option>
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
