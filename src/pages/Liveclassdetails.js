import React from 'react';
import { useParams } from 'react-router-dom';
import LiveClassHeader from '../components/Liveclassheader';
import VideoPlayer from '../components/VideoPlayer';
import CourseTabs from '../components/CourseTabs';
import DiscussionSection from '../components/DiscussionSection';
import AITutorBox from '../components/AITutorBox';
import EmptyState from '../components/EmptyState';
import {
  liveClassData
} from '../data/Liveclassdetailsdata';

function Liveclassdetails() {
  // Route uses :slug, but it's actually the class ID
  const { slug } = useParams();
  const classId = slug; // Use slug as classId for API calls

  return (
    <>
      {/* Live Class Header (Full Width) - No Progress Bar */}
      <LiveClassHeader liveClassData={liveClassData} />

        {/* Class Details Content */}
        <div className="course-details-wrapper">
          {/* Left Content Area */}
          <div className="course-main-content">
            {/* Video Player */}
            <VideoPlayer video={liveClassData.video} />

            {/* Tabs (Lesson, Notes, Downloads) - No static data */}
            <CourseTabs
              currentLesson={null}
              notesData={[]}
              downloadsData={[]}
            />

            {/* Discussion Section - No static data */}
            <DiscussionSection commentsData={[]} />
          </div>

          {/* Right Sidebar - No Course Content Accordion */}
          <div className="course-right-sidebar">
            {/* AI Tutor Box - No static chat data */}
            <AITutorBox />
          </div>
        </div>
    </>
  );
}

export default Liveclassdetails;