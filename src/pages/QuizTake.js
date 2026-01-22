import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CourseHeader from '../components/CourseHeader';
import QuizTimer from '../components/Quiztimer';
import QuizQuestionCard from '../components/Quizquestioncard';
import QuizGrid from '../components/Quizgrid';
import QuizInfoCard from '../components/Quizinfocard';
import QuizLegend from '../components/Quizlegend';
import QuizReviewScreen from '../components/Quizreviewscreen';
import QuizResultScreen from '../components/Quizresultscreen';
import EndQuizModal from '../components/Endquizmodal';
import { quizQuestions, quizSettings } from '../data/Quiztakedata';

function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quizSettings.totalQuestions).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(quizSettings.timeLimit);
  const [showReview, setShowReview] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState(null);
  
  // End Quiz Modal State
  const [showEndQuizModal, setShowEndQuizModal] = useState(false);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleShowReview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Time Helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Select Answer
  const selectAnswer = (letter) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = letter;
    setUserAnswers(newAnswers);
  };

  // Navigate to Question
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowReview(false);
  };

  // Navigation Handlers
  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
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

  // Review Screen
  const handleShowReview = () => {
    setShowReview(true);
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

  // Submit Quiz
  const handleSubmitQuiz = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === null) {
        skipped++;
      } else if (userAnswers[index] === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const percentage = Math.round((correct / quizQuestions.length) * 100);
    const passed = percentage >= quizSettings.passingScore;

    setResults({ correct, incorrect, skipped, percentage, passed });
    setShowResult(true);
    setShowReview(false);
  };

  // Calculated Values
  const answeredCount = userAnswers.filter(a => a !== null).length;

  // Quiz Header Data
  const quizHeaderData = {
    title: 'Sorting Algorithms Quiz',
    badges: [
      { id: 1, text: 'Form 5' },
      { id: 2, text: 'Computer Science' },
      { id: 3, text: 'Chapter 2' }
    ],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    progress: Math.round((answeredCount / quizQuestions.length) * 100)
  };

  // Render Review Screen
  if (showReview) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <TopNavbar title="Quiz Review" breadcrumb="Sorting Algorithms" />
          <CourseHeader courseData={quizHeaderData} />
          
          <QuizReviewScreen
            questions={quizQuestions}
            userAnswers={userAnswers}
            onBackToQuiz={handleBackToQuiz}
            onSubmitQuiz={handleSubmitQuiz}
            onGoToQuestion={goToQuestion}
          />
        </main>
      </>
    );
  }

  // Render Result Screen
  if (showResult && results) {
    return (
      <>
        <Sidebar />
        <main className="main-content">
          <TopNavbar title="Quiz Results" breadcrumb="Sorting Algorithms" />
          <CourseHeader courseData={quizHeaderData} />
          
          <QuizResultScreen
            results={results}
            passed={results.passed}
          />
        </main>
      </>
    );
  }

  // Main Quiz Screen
  const question = quizQuestions[currentQuestion];

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <TopNavbar title="Quiz" breadcrumb="Sorting Algorithms" />
        <CourseHeader courseData={quizHeaderData} />
        
        <div className="quiz-taking-container">
          {/* Left Side - Question Area */}
          <div className="quiz-question-area">
            <QuizQuestionCard
              question={question}
              currentQuestion={currentQuestion}
              totalQuestions={quizQuestions.length}
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
              totalQuestions={quizQuestions.length}
              formatTime={formatTime}
            />

            {/* Question Grid */}
            <QuizGrid
              questions={quizQuestions}
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
      </main>

      {/* End Quiz Modal */}
      <EndQuizModal
        isOpen={showEndQuizModal}
        onClose={handleCloseEndQuizModal}
        onEndQuiz={handleConfirmEndQuiz}
        answeredCount={answeredCount}
        totalQuestions={quizQuestions.length}
        attemptsRemaining={quizSettings.attemptsRemaining || 2}
        totalAttempts={quizSettings.totalAttempts || 3}
      />
    </>
  );
}

export default QuizTake;