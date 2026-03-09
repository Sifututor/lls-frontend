import React from 'react';
import EmptyState from '../components/EmptyState';

function TutorProfile() {
  return (
    <div className="instructor-profile-wrapper">
      <EmptyState
        icon="/assets/images/icons/user.svg"
        title="Tutor Profile"
        description="Public tutor profile pages are not available yet. Backend API for viewing tutor profiles by ID is planned for a future release."
        actionText="Back to Courses"
        actionLink="/student/browse-courses"
      />
    </div>
  );
}

export default TutorProfile;
