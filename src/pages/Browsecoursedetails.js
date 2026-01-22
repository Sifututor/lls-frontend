import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import BrowseCourseHeader from '../components/Browsecourseheader';
import BrowseCourseStats from '../components/Browsecoursestats';
import BrowseAboutSection from '../components/Browseaboutsection';
import BrowseCourseContent from '../components/Browsecoursecontent';
import BrowseUpcomingClass from '../components/Browseupcomingclass';
import BrowseRelatedCourses from '../components/Browserelatedcourses';
import { browseCourseData } from '../data/Browsecoursedata';

function BrowseCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    alert(isSaved ? 'Course removed from saved' : 'Course saved successfully!');
  };

  const handleEnroll = () => {
    navigate(`/course-details/${id}`);
  };

  const handleNotifyMe = () => {
    alert(`You'll be notified for "${browseCourseData.upcomingClass.title}"!`);
  };

  const handleRelatedCourseClick = (courseId) => {
    window.scrollTo(0, 0);
    navigate(`/browse-course/${courseId}`);
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Browse Courses" breadcrumb="Advanced Calculus" />

        <div className="browse-page-wrapper">
          {/* TWO COLUMN LAYOUT - Everything divided here */}
          <div className="browse-main-grid">
            
            {/* LEFT COLUMN - Image 2 PURA (Header + Stats + About + Content) */}
            <div className="browse-left-section">
              {/* Course Header - Image 2 top */}
              <BrowseCourseHeader courseData={browseCourseData} />

              {/* Stats Bar - Image 2 below header */}
              <BrowseCourseStats 
                stats={browseCourseData.stats}
                isSaved={isSaved}
                onSave={handleSave}
                onEnroll={handleEnroll}
              />

              {/* About Section - Image 2 middle */}
              <BrowseAboutSection about={browseCourseData.about} />

              {/* Course Content - Image 2 bottom */}
              <BrowseCourseContent courseContent={browseCourseData.courseContent} />
            </div>

            {/* RIGHT COLUMN - Image 1 PURA (Upcoming Class + Related Courses) */}
            <div className="browse-right-section">
              {/* Upcoming Live Class Card - Image 1 top */}
              <BrowseUpcomingClass 
                classData={browseCourseData.upcomingClass}
                onNotifyMe={handleNotifyMe}
              />

              {/* Related Courses - Image 1 bottom */}
              <BrowseRelatedCourses 
                courses={browseCourseData.relatedCourses}
                onCourseClick={handleRelatedCourseClick}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BrowseCourseDetails;