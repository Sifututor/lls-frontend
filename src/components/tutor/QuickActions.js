// src/components/tutor/QuickActions.js
import React from 'react';
import { Link } from 'react-router-dom';
const actionsConfig = [
  { id: 1, icon: '/assets/images/tutor/add-lesson.svg', label: 'Add Lesson', route: '/tutor/courses/upload' },
  { id: 2, icon: '/assets/images/tutor/create-quiz.svg', label: 'Create Quiz', route: '/tutor/courses/quiz/create' },
  { id: 3, icon: '/assets/images/tutor/schedule-class.svg', label: 'Schedule Class', route: '/tutor/live-classes/schedule' },
  { id: 5, icon: '/assets/images/tutor/answer.svg', label: 'Answer Q&A', route: '/tutor/engagement/qna' },
  { id: 6, icon: '/assets/images/tutor/view-progress.svg', label: 'View Progress', route: '/tutor/engagement/progress' },
];

function QuickActions() {
  return (
    <div className="quick-actions-section">
      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        {actionsConfig.map((action) => (
          <Link key={action.id} to={action.route} className="quick-action-btn">
            <div className="action-icon">
              <img src={action.icon} alt={action.label} />
            </div>
            <span className="action-label">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;