import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CourseHeader from '../components/CourseHeader';
import QuizTimer from '../components/Quiztimer';
import QuizQuestionCard from '../components/Quizquestioncard';
import QuizGrid from '../components/Quizgrid';
import QuizInfoCard from '../components/Quizinfocard';
import QuizLegend from '../components/Quizlegend';
import QuizReviewScreen from '../components/Quizreviewscreen';
import QuizResultScreen from '../components/Quizresultscreen';
import EndQuizModal from '../components/Endquizmodal';
import { SectionLoader } from '../components/ui/LoadingSpinner';
import { useGetQuizQuestionsQuery, useSubmitQuizAttemptMutation } from '../store/api/authApi';

// ✅ REMOVED: Static quiz data import - now using API data only
// import { quizQuestions as staticQuestions, quizSettings as staticSettings } from '../data/Quiztakedata';

function mapApiQuestionToCard(q) {
  const options = q.options && typeof q.options === 'object'
    ? Object.entries(q.options).map(([key, text]) => ({
        letter: key.length === 1 ? key.toUpperCase() : key,
        text: String(text),
      }))
    : (q.question_type === 'true_false'
        ? [{ letter: 'True', text: 'True' }, { letter: 'False', text: 'False' }]
        : []);
  return {
    id: q.id,
    question: q.question_text || q.question,
    options,
  };
}

function QuizTake() {
  const params = useParams();
  const { id, attemptId } = params;
  const navigate = useNavigate();
  const location = useLocation();
  const stateTime = location.state?.timeLimit;
  const stateQuizId = location.state?.quizId;

  // ✅ ALWAYS use API flow - no static data fallback
  const { data: questionsData, isLoading: questionsLoading } = useGetQuizQuestionsQuery(attemptId, { skip: !attemptId });
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizAttemptMutation();

  const questions = useMemo(() => {
    if (!questionsData?.questions) return [];
    return questionsData.questions.map(mapApiQuestionToCard);
  }, [questionsData]);

  const totalCount = questions.length;
  const timeLimitFromApi = questionsData?.time_remaining ?? stateTime ?? (typeof stateTime === 'number' ? stateTime : 600);
  
  const quizSettings = useMemo(() => ({
    totalQuestions: totalCount,
    timeLimit: timeLimitFromApi,
    passingScore: questionsData?.passing_score ?? 70, // Default 70%
    attemptsRemaining: questionsData?.attempts_remaining ?? 3,
    totalAttempts: 3,
  }), [totalCount, timeLimitFromApi, questionsData]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(() =>
    Math.max(0, Math.floor(Number(typeof stateTime === 'number' ? stateTime : 600)))
  );
  const [showReview, setShowReview] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState(null);
  const [showEndQuizModal, setShowEndQuizModal] = useState(false);
  const submittedOnTimeUp = useRef(false);

  useEffect(() => {
    if (questionsData?.time_remaining != null) {
      setTimeRemaining(Math.max(0, Math.floor(Number(questionsData.time_remaining))));
    }
  }, [questionsData?.time_remaining]);

  useEffect(() => {
    if (totalCount > 0 && userAnswers.length !== totalCount) {
      setUserAnswers(Array(totalCount).fill(null));
    }
  }, [totalCount, userAnswers.length]);

  const handleSubmitQuiz = useCallback(async () => {
    // ✅ Always require attemptId (API flow only, no static fallback)
    if (!attemptId) {
      if (process.env.NODE_ENV === 'development') console.error('No attempt ID - cannot submit quiz');
      alert('Failed to submit quiz: No attempt ID found. Please start the quiz again.');
      return;
    }

    try {
      const payload = Object.keys(answers).reduce((acc, qId) => {
        acc[String(qId)] = answers[qId];
        return acc;
      }, {});
      const result = await submitQuiz({ attemptId, answers: payload }).unwrap();
      const correct = result.correct ?? result.score ?? 0;
      const total = result.total_questions ?? totalCount;
      const percentage = result.percentage ?? (total ? Math.round((correct / total) * 100) : 0);
      const passed = result.passed ?? (percentage >= (quizSettings.passingScore || 70));
      setResults({
        correct: result.correct ?? correct,
        incorrect: result.incorrect ?? (total - correct),
        skipped: result.skipped ?? 0,
        percentage,
        passed,
      });
      setShowResult(true);
      setShowReview(false);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Submit failed:', err);
      alert(err?.data?.message || err?.message || 'Failed to submit quiz');
    }
  }, [attemptId, answers, submitQuiz, totalCount, quizSettings.passingScore]);

  const handleShowReview = useCallback(() => setShowReview(true), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const current = Math.floor(Number(prev) || 0);
        if (current <= 1) return 0;
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining !== 0) return;
    if (submittedOnTimeUp.current) return;
    submittedOnTimeUp.current = true;
    if (attemptId) {
      handleSubmitQuiz();
    } else {
      handleShowReview();
    }
  }, [timeRemaining, attemptId]);

  // Format Time Helper – integer seconds only, MM:SS
  const formatTime = (seconds) => {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Select Answer
  const selectAnswer = (letter) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = letter;
    setUserAnswers(newAnswers);
    if (questions[currentQuestion]) {
      const qId = questions[currentQuestion].id;
      setAnswers(prev => ({ ...prev, [String(qId)]: letter.toLowerCase() }));
    }
  };

  // Navigate to Question
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowReview(false);
  };

  // Navigation Handlers
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleShowReview();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleBackToQuiz = () => {
    setShowReview(false);
  };

  // End Quiz Modal Handlers
  const handleEndQuizClick = () => {
    setShowEndQuizModal(true);
  };

  const handleCloseEndQuizModal = () => {
    setShowEndQuizModal(false);
  };

  const handleConfirmEndQuiz = () => {
    setShowEndQuizModal(false);
    // Submit quiz and show results
    handleSubmitQuiz();
  };

  // Calculated Values
  const answeredCount = userAnswers.filter(a => a !== null).length;

  // Quiz Header Data
  const quizHeaderData = {
    title: questionsData?.title || 'Quiz',
    badges: [
      { id: 1, text: 'Form 5' },
      { id: 2, text: 'Computer Science' },
      { id: 3, text: 'Chapter 2' }
    ],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    progress: totalCount ? Math.round((answeredCount / totalCount) * 100) : 0
  };

  if (questionsLoading) {
    return (
      <div className="quiz-details-content">
        <SectionLoader message="Loading questions..." height="400px" />
      </div>
    );
  }

  const noQuestions = !questionsLoading && totalCount === 0;
  if (noQuestions) {
    return (
      <div className="quiz-details-content">
        <p>No questions found. <button type="button" onClick={() => navigate(-1)}>Go back</button></p>
      </div>
    );
  }

  // Render Review Screen
  if (showReview) {
    return (
      <>
        <CourseHeader courseData={quizHeaderData} />
        
        <QuizReviewScreen
            questions={questions}
            userAnswers={userAnswers}
            onBackToQuiz={handleBackToQuiz}
            onSubmitQuiz={handleSubmitQuiz}
            onGoToQuestion={goToQuestion}
          />
      </>
    );
  }

  // Render Result Screen
  if (showResult && results) {
    return (
      <>
        <CourseHeader courseData={quizHeaderData} />
        
        <QuizResultScreen
            results={results}
            passed={results.passed}
            quizId={stateQuizId}
            attemptId={attemptId}
          />
      </>
    );
  }

  // Main Quiz Screen
  const question = questions[currentQuestion];

  return (
    <>
      <CourseHeader courseData={quizHeaderData} />
      
      <div className="quiz-taking-container">
          {/* Left Side - Question Area */}
          <div className="quiz-question-area">
            <QuizQuestionCard
              question={question}
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              selectedAnswer={userAnswers[currentQuestion]}
              onSelectAnswer={selectAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>

          {/* Right Side - Quiz Info Sidebar */}
          <div className="quiz-info-sidebar">
            {/* Timer */}
            <QuizTimer
              timeRemaining={timeRemaining}
              answeredCount={answeredCount}
              totalQuestions={questions.length}
              formatTime={formatTime}
            />

            {/* Question Grid */}
            <QuizGrid
              questions={questions}
              userAnswers={userAnswers}
              currentQuestion={currentQuestion}
              onGoToQuestion={goToQuestion}
            />

            {/* Quiz Info */}
            <QuizInfoCard settings={quizSettings} />

            {/* Legend */}
            <QuizLegend />

            {/* End Quiz Button - Opens Modal */}
            <button className="btn-end-quiz" onClick={handleEndQuizClick}>
              End Quiz
            </button>
          </div>
        </div>

      {/* End Quiz Modal */}
      <EndQuizModal
        isOpen={showEndQuizModal}
        onClose={handleCloseEndQuizModal}
        onEndQuiz={handleConfirmEndQuiz}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        attemptsRemaining={quizSettings.attemptsRemaining || 2}
        totalAttempts={quizSettings.totalAttempts || 3}
      />
    </>
  );
}

export default QuizTake;