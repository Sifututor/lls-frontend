import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrowseCourseStats from '../components/Browsecoursestats';
import BrowseAboutSection from '../components/Browseaboutsection';
import TutorCard from '../components/Tutorcard';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { showInfo } from '../utils/toast';
import { useGetTutorProfileQuery } from '../store/api/authApi';

function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Fetch tutor profile from API when endpoint is available
  // const { data: tutorData, isLoading } = useGetTutorProfileQuery(id);

  const handleSendMessage = () => {
    showInfo('Send message feature coming soon');
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/browse-course/${courseId}`);
  };

  // Show empty state - waiting for API integration
  return (
    <div className="instructor-profile-wrapper">
      <EmptyState
        icon="/assets/images/icons/user.svg"
        title="Tutor Profile"
        description="Tutor profile data will be available once the API is integrated"
        actionText="Back to Courses"
        actionLink="/student/browse-courses"
      />
    </div>
  );

  // TODO: Uncomment when API is ready
  /*
  return (
    <div className="instructor-profile-wrapper">
          {/* Top Grid - Stats/About + Tutor Card *\/}
          <div className="instructor-top-grid">
            {/* LEFT COLUMN - Stats + About Me *\/}
            <div className="instructor-left-column">
              <div className="browse-stats-container">
                <div className="browse-stats-row">
                  <div className="browse-stat-item">
                    <div className="browse-stat-label">Total Learners</div>
                    <div className="browse-stat-value">{tutorData?.total_learners || 0}</div>
                  </div>

                  <div className="browse-stat-item">
                    <div className="browse-stat-label">Reviews</div>
                    <div className="browse-stat-value">{tutorData?.reviews_count || 0}</div>
                  </div>
                </div>
              </div>

              <BrowseAboutSection about={tutorData?.about || {}} />
            </div>

            {/* RIGHT COLUMN - Tutor Card *\/}
            <div className="instructor-right-column">
              <TutorCard 
                tutor={tutorData}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>

          {/* My Courses Section *\/}
          <div className="instructor-courses-section">
            <h2 className="instructor-courses-heading">My Courses</h2>
            
            {tutorData?.courses?.length > 0 ? (
              <div className="courses-grid">
                {tutorData.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses available"
                description="This tutor has not published any courses yet"
              />
            )}
          </div>
        </div>
  );
  */
}

export default TutorProfile;