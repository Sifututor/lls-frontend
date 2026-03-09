// src/routes/tutorRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import TutorLayout from '../layouts/TutorLayout';
import { ROLES } from '../utils/roleConfig';

// Tutor Pages
import TutorDashboard from '../pages/tutor/TutorDashboard';
import TutorMyCourses from '../pages/tutor/TutorMyCourses';
import TutorCourseInner from '../pages/tutor/TutorCourseInner';
import TutorChapterInner from '../pages/tutor/TutorChapterInner';
import TutorLessonInner from '../pages/tutor/TutorLessonInner';
import TutorUploadLesson from '../pages/tutor/TutorUploadLesson';
import TutorCreateQuiz from '../pages/tutor/TutorCreateQuiz';
import TutorPendingApproval from '../pages/tutor/TutorPendingApproval';
import TutorScheduleClass from '../pages/tutor/TutorScheduleClass';
import TutorMyLiveClasses from '../pages/tutor/TutorMyLiveClasses';
import TutorRecordingDetail from '../pages/tutor/TutorRecordingDetail';
import TutorUploadLiveClass from '../pages/tutor/TutorUploadLiveClass';
import TutorVideoQA from '../pages/tutor/TutorVideoQA';
import TutorStudentProgress from '../pages/tutor/TutorStudentProgress';
import TutorStudentProgressCards from '../pages/tutor/TutorStudentProgressCards';
import TutorStudentProfile from '../pages/tutor/TutorStudentProfile';
import TutorQuizResults from '../pages/tutor/TutorQuizResults';
import TutorProfilePage from '../pages/tutor/TutorProfile';
import TutorVerificationForm from '../pages/tutor/TutorVerificationForm';

import ComingSoonPage from '../components/ComingSoonPage';
import Notifications from '../pages/Notifications';

const TutorRoutes = () => (
  <>
    {/* Explicit full path so this matches before catch-all; layout renders profile as child */}
    <Route
      path="/tutor/engagement/progress-cards/student/:studentId"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.TUTOR]}>
          <TutorLayout>
            <TutorStudentProfile />
          </TutorLayout>
        </RoleBasedRoute>
      }
    />
    <Route
      path="/tutor"
      element={
        <RoleBasedRoute allowedRoles={[ROLES.TUTOR]}>
          <TutorLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<TutorDashboard />} />
      <Route path="dashboard" element={<TutorDashboard />} />
      {/* courses/:id/chapters/:chapterId/lessons/:lessonId must be before courses/:id/chapters/:chapterId */}
      <Route path="courses/:id/chapters/:chapterId/lessons/:lessonId" element={<TutorLessonInner />} />
      <Route path="courses/:id/chapters/:chapterId" element={<TutorChapterInner />} />
      <Route path="courses/:id" element={<TutorCourseInner />} />
      <Route path="courses" element={<TutorMyCourses />} />
      <Route path="courses/upload" element={<TutorUploadLesson />} />
      <Route path="courses/quiz/create" element={<TutorCreateQuiz />} />
      <Route path="courses/pending" element={<TutorPendingApproval />} />
      <Route path="live-classes" element={<TutorMyLiveClasses />} />
      <Route path="live-classes/schedule" element={<TutorScheduleClass />} />
      <Route path="live-classes/upload-recording/:classId" element={<TutorRecordingDetail />} />
      <Route path="live-classes/upload-recording" element={<TutorRecordingDetail />} />
      <Route path="live-classes/upload-live-class" element={<TutorUploadLiveClass />} />
      <Route path="engagement" element={<ComingSoonPage title="Engagement" description="Select an option from the Engagement menu to manage Video Q&A, Student Progress, and Quiz Results." actionText="Go to Video Q&A" actionLink="/tutor/engagement/qna" />} />
      <Route path="engagement/qna" element={<TutorVideoQA />} />
      <Route path="engagement/progress" element={<TutorStudentProgress />} />
      <Route path="engagement/progress-cards" element={<TutorStudentProgressCards />} />
      <Route path="engagement/quiz-results" element={<TutorQuizResults />} />
      <Route path="students" element={<ComingSoonPage title="My Students" description="View your assigned students and their progress." reason="Use Engagement > Student Progress or Progress Cards to view student data." actionText="View Student Progress" actionLink="/tutor/engagement/progress" />} />
      <Route path="profile" element={<TutorProfilePage />} />
      <Route path="verification-form" element={<TutorVerificationForm />} />
      <Route path="settings" element={<ComingSoonPage title="Tutor Settings" description="Account and notification preferences." reason="Settings will be available in a future release." />} />
      <Route path="notifications" element={<Notifications />} />
    </Route>
  </>
);

export default TutorRoutes;

