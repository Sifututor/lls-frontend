import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CourseHeader from '../components/CourseHeader';
import AnswerItem from '../components/Answeritem';
import { answersData, answerStats } from '../data/Checkanswersdata';

function CheckAnswers() {
  const { id } = useParams();

  // Check Answers Header Data
  const checkAnswersHeaderData = {
    title: 'Sorting Algorithms Quiz - Answer Key',
    badges: [
      { id: 1, text: 'Form 5' },
      { id: 2, text: 'Computer Science' },
      { id: 3, text: 'Review Mode' }
    ],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    progress: Math.round((answerStats.correct / answerStats.total) * 100)
  };

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <TopNavbar title="Check Answers" breadcrumb="Sorting Algorithms Quiz" />
        <CourseHeader courseData={checkAnswersHeaderData} />
        
        <div className="quiz-check-container">
          {/* Stats Summary */}
          <div className="check-answers-stats">
            <div className="stats-summary">
              <h3 className="stats-title">Your Results Summary</h3>
              <div className="stats-grid">
                <div className="stat-box correct-stat">
                  <div className="stat-icon">
                    <img src="/assets/images/icons/022-check.svg" alt="Correct" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{answerStats.correct}</div>
                    <div className="stat-label">Correct</div>
                  </div>
                </div>
                <div className="stat-box incorrect-stat">
                  <div className="stat-icon">
                    <img src="/assets/images/icons/057-error sign.svg" alt="Incorrect" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{answerStats.incorrect}</div>
                    <div className="stat-label">Incorrect</div>
                  </div>
                </div>
                <div className="stat-box skipped-stat">
                  <div className="stat-icon">
                    <img src="/assets/images/icons/057-error sign-skip.svg" alt="Skipped" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{answerStats.skipped}</div>
                    <div className="stat-label">Skipped</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Questions with Answers */}
          {answersData.map((item) => (
            <AnswerItem key={item.id} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}

export default CheckAnswers;