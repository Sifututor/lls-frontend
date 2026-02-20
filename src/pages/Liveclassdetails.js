import React from 'react';
import { useParams } from 'react-router-dom';
import LiveClassHeader from '../components/Liveclassheader';
import VideoPlayer from '../components/VideoPlayer';
import CourseTabs from '../components/CourseTabs';
import DiscussionSection from '../components/DiscussionSection';
import AITutorBox from '../components/AITutorBox';
import {
  liveClassData,
  currentLesson as staticCurrentLesson,
} from '../data/Liveclassdetailsdata';

function Liveclassdetails() {
  // Route uses :slug, but it's actually the class ID. Data is static until API is available.
  const { slug } = useParams();
  const classId = slug;

  return (
    <>
      {/* Live Class Header (Full Width) - No Progress Bar */}
      <LiveClassHeader liveClassData={liveClassData} />

        {/* Class Details Content */}
        <div className="course-details-wrapper">
          {/* Left Content Area */}
          <div className="course-main-content">
            {/* Video Player - static URL for now */}
            <VideoPlayer video={liveClassData.video} />

            {/* Tabs: Lesson from static data; Notes/Downloads disabled for live class */}
            <CourseTabs
              currentLesson={staticCurrentLesson}
              downloadsData={[]}
              lessonId={null}
              courseSlug={null}
              isLiveClassView
            />

            {/* Discussion not tied to a lesson in live class context */}
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