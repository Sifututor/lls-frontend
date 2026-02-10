# Learnest — Student Learning Platform

React frontend for the Learnest educational platform. Talks to a Laravel backend API. Supports students, parents, tutors, and admin with role-based routing and premium gating.

## Tech Stack

- React 18
- Redux Toolkit + RTK Query
- React Router v6
- react-toastify
- js-cookie

## Setup

```bash
git clone <repo>
cd learnest-react-fixed
npm install
npm start
```

API base URL is set in `src/store/api/authApi.js` (default `http://10.0.0.178:8000/api`). To use an env-based URL, add:

```
REACT_APP_API_URL=http://10.0.0.178:8000/api
```

and in `authApi.js` replace the `BASE_URL` constant with `process.env.REACT_APP_API_URL || 'http://10.0.0.178:8000/api'`.

## Project Structure

```
src/
├── assets/css/       # Global and page-specific styles
├── components/       # Reusable UI (layout, cards, forms, modals, ui/)
├── context/         # LayoutContext, RegistrationContext
├── data/            # Static/mock data for fallbacks
├── hooks/            # useAuth, usePremium, useCurrentUserProfile
├── layouts/          # StudentLayout, ParentLayout, TutorLayout, AdminLayout
├── pages/            # Route-level pages (auth, student, parent, tutor)
├── routes/           # AppRoutes, RoleBasedRoute, student/parent/tutor/admin routes
├── store/
│   ├── api/          # authApi.js (RTK Query)
│   └── slices/       # authSlice.js
├── styles/           # toast.css
└── utils/            # favicon, toast, tutorProfileUtils, roleConfig
```

## Features

**Authentication**

- Role selection (Student / Parent / Tutor), then role-specific login.
- Student and parent registration (multi-step). Parent flow: register, terms, success, add children, student terms, complete, select student.
- Student self-signup: step 1 (name, email, password), step 2 (form level, school, DOB, terms), success.
- Student activation for parent-created accounts: `/activate-student/:token` with password set.
- Forgot password and reset password.
- Token in localStorage and cookies; `getMe` keeps user/role/premium in sync.

**Profile**

- View profile (Profile.js), edit profile with image upload (Editprofile.js), change password (ChangePassword.js).
- Account data from `getAccountSettings`; updates via `updateAccountSettings` (FormData for image). Profile reflected in TopNavbar, Sidebar, and Profile page.

**Courses**

- Browse catalog: `browse-catalog.js`, filters, enroll from card or details.
- My courses: `MyCourses.js` (ongoing, completed, saved).
- Course details (enrolled): `CourseDetails.js` — video, tabs (Overview, Content, Discussion, Q&A), notes, bookmarks.
- Browse course details (preview): `Browsecoursedetails.js` — about, stats, enroll, related courses.

**Live Classes**

- List: ongoing, upcoming, scheduled; filters; carousel + grid. Join (premium) or Notify me; free users get upgrade modal.
- Live class details and past sessions pages.

**Video Learning**

- VideoPlayer with play/pause, progress, volume, skip; bookmarks and speed (premium). Notes and Q&A (DiscussionSection) with questions, replies, upvote, flag; premium required to post.

**Premium**

- `usePremium` / `isPremiumUser()` from authApi. Premium users: premium tags/badges hidden on dashboard and nav. Free users: Join class, Notify me, Watch recording open Premiumupgrademodal instead of performing action.
- Premium upgrade modal and subscription page.

**Dashboard**

- Student dashboard: analytics (courses, videos, quiz, time), live classes strip, continue learning, recent Q&A.
- Parent and tutor dashboards (parent/tutor layouts and routes).

**Notifications**

- Notifications dropdown in navbar; mark read, mark all read. Notifications page.

**Quizzes**

- Quiz overview (QuizDetails), take quiz (QuizTake), check answers (CheckAnswers).

**UI**

- Skeleton loaders (course details, course cards, live classes, profile, list, section loader, page loader) in `src/components/ui/LoadingSpinner.js` and `Loading.css`.
- Toast notifications (success, error, warning, info) via `src/utils/toast.js`; no alerts.
- Global loader on initial auth check; role-based route shows PageLoader while loading.

## API Integration

All requests go through RTK Query in `src/store/api/authApi.js`.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | Login |
| `/register` | POST | Register (parent/student) |
| `/me` | GET | Current user |
| `/logout` | POST | Logout |
| `/refresh` | POST | Refresh token |
| `/account-settings` | GET | Profile/settings |
| `/account-settings` | POST | Update profile (FormData) |
| `/change-password` | POST | Change password |
| `/notifications` | GET | Notifications (page, filter) |
| `/notifications/:id/read` | POST | Mark read |
| `/notifications/mark-all-read` | POST | Mark all read |
| `/my-courses` | GET | Enrolled courses |
| `/my-courses/:slug` | GET | Enrolled course details |
| `/browse/courses` | GET | Browse catalog |
| `/courses/:slug` | GET | Browse course details |
| `/courses/:slug/enroll` | POST | Enroll |
| `/courses/:slug/lessons/:id/complete` | POST | Mark lesson complete |
| `/lesson/:id/bookmark` | POST | Add bookmark |
| `/lesson/:id/notes` | GET | Lesson notes |
| `/notes/:id` | DELETE | Delete note |
| `/browse/live-classes` | GET | Live classes |
| `/live-classes/:id/join` | POST | Join live class |
| `/parent/children` | POST | Add children (parent) |
| `/student/activation/:token` | GET | Student activation info |
| `/student/activate` | POST | Activate student |
| `/video-qna` | GET | Video Q&A (lesson_id, page, sort) |
| `/video-qna` | POST | Post question |
| `/video-qna/:id/upvote` | POST | Upvote question |
| `/video-qna/:id/flag` | POST | Flag question |
| `/video-qna/:id/reply` | POST | Post reply |
| `/video-qna/:id/replies` | GET | Replies for question |
| `/quizzes/:id/overview` | GET | Quiz overview |
| `/student/dashboard-analytics` | GET | Student dashboard stats |
| `/subjects` | GET | Subjects (AI tutor) |
| `/ai/ask` | POST | AI tutor ask |
| `/tutor/dashboard` | GET | Tutor dashboard |
| `/tutor/live-classes/upcoming` | GET | Tutor upcoming classes |
| `/tutor/students/progress` | GET | Tutor students progress |
| `/tutor/qna/pending` | GET | Tutor pending Q&A |
| `/tutor/submissions` | GET | Tutor submissions |

Helpers: `isPremiumUser()`, `getUserType()`, `isTokenExpired()`.

## State Management

- **authSlice** (`src/store/slices/authSlice.js`): `user`, `token`, `isAuthenticated`. Actions: `setCredentials`, `logout`, `updateUserProfile`. Selectors: `selectCurrentUser`, `selectCurrentToken`, `selectIsAuthenticated`. Profile image URLs normalized to full server URL when needed.
- **authApi**: All server state and mutations; cache tags for Auth, User, Courses, LiveClasses, VideoQnA, Notifications, Quiz, Tutor, etc.

## Routes

**Public**

- `/` — Landing (redirect to dashboard if authenticated)
- `/login` — Role selection
- `/login/student`, `/login/parent`, `/tutor/login`
- `/forgot-password`, `/reset-password`
- `/create-account/student`, `/create-account/student/details`, `/create-account/student/success`
- `/verify-email`
- `/activate-student/:token`, `/activate-student/success`
- `/register`, `/register/terms`, `/register/success`, `/register/add-children`, `/register/student-terms`, `/register/complete`, `/select-student`

**Auth-required (browse/tutor profile)**

- `/browse-course/:id` — Browse course details
- `/tutor-profile/:id` — Tutor profile

**Student** (RoleBasedRoute + StudentLayout)

- `/student/dashboard`
- `/student/my-courses`, `/student/browse-courses`, `/student/browse-course/:slug`, `/student/course/:slug`
- `/student/live-classes`, `/student/live-class/:slug`, `/student/past-sessions`
- `/student/ai-tutor`, `/student/video-qa`
- `/student/quiz/:id`, `/student/quiz/:id/take`, `/student/quiz/:id/review`
- `/student/profile`, `/student/profile/edit`, `/student/settings`, `/student/settings/password`
- `/student/notifications`, `/student/subscription`

**Parent** (RoleBasedRoute + ParentLayout)

- `/parent`, `/parent/dashboard`, `/parent/courses`, `/parent/live-classes`, etc. (dashboard implemented; others placeholder)

**Tutor** (RoleBasedRoute + TutorLayout)

- `/tutor`, `/tutor/dashboard`, `/tutor/courses`, `/tutor/live-classes`, etc. (dashboard implemented; others placeholder)

**Admin** (RoleBasedRoute + AdminLayout)

- `/admin/dashboard`, `/admin/users`, etc. (placeholders)

**Redirects**

- `/dashboard` → `/student/dashboard`, `/my-courses` → `/student/my-courses`, `/browse-courses` → `/student/browse-courses`, `/live-classes` → `/student/live-classes`, `/ai-tutor` → `/student/ai-tutor`
- `/signup` → `/register`, `/create-account` → `/create-account/student`
- 404: authenticated → dashboard by role; else `/login`

## Pages

| Path / File | Description |
|-------------|-------------|
| `LandingPage.js` | Public landing |
| `LoginRoleSelection.js` | Choose student / parent / tutor login |
| `StudentLogin.js` | Student login |
| `ParentLogin.js` | Parent login |
| `auth/TutorLogin.js` | Tutor login |
| `ForgotPassword.js` | Request reset |
| `Resetpassword.js` | Set new password |
| `Studentregistrationstep1.js` | Student signup step 1 |
| `Studentregistrationstep2.js` | Student signup step 2 |
| `Studentregistrationsuccess.js` | Student signup success / verify-email |
| `StudentActivation.js` | Activate student (token) |
| `StudentActivationSuccess.js` | Activation success |
| `CreateAccountStep1.js` | Parent signup step 1 |
| `auth/TermsConsent.js` | Parent terms |
| `Createaccountsuccess.js` | Parent signup success |
| `Addchildrenstep.js` | Add children |
| `auth/StudentTerms.js` | Student terms (parent flow) |
| `auth/RegistrationComplete.js` | Registration complete |
| `Selectstudent.js` | Select student (parent) |
| `Dashboard.js` | Student dashboard |
| `MyCourses.js` | Enrolled courses |
| `browse-catalog.js` | Course catalog |
| `Browsecoursedetails.js` | Course preview / about |
| `CourseDetails.js` | Enrolled course (video, content, Q&A) |
| `Liveclasses.js` | Live classes list |
| `Liveclassdetails.js` | Single live class |
| `Pastsessions.js` | Past sessions |
| `Aitutor.js` | AI tutor chat |
| `Recentvideoqa.js` | Video Q&A list |
| `QuizDetails.js` | Quiz overview |
| `QuizTake.js` | Take quiz |
| `CheckAnswers.js` | Quiz review |
| `Profile.js` | View profile |
| `Editprofile.js` | Edit profile + photo |
| `Settings.js` | Settings |
| `ChangePassword.js` | Change password |
| `Notifications.js` | Notifications list |
| `Premiumsubscription.js` | Subscription / upgrade |
| `Browsecoursedetails.js` | Browse course details (also under routes) |
| `Tutorprofile.js` | Tutor profile |
| `CreateAccountStep2.js` | Legacy parent step |
| `CreateAccountStep4.js` | Legacy step |
| `StudentRegistration.js` | Alternate student registration entry |
| `StudentDetails.js` | Student details (parent) |
| `parent/ParentDashboard.js` | Parent dashboard |
| `tutor/TutorDashboard.js` | Tutor dashboard |

## Components

**Layout**

- `Sidebar.js`, `student/Sidebar.js` — Student nav + premium card
- `TopNavbar.js`, `student/TopNavbar.js` — Search, notifications, profile
- `GlobalLoader.js` — Initial app loader

**Cards**

- `MyCourseCard.js` — Enrolled course (continue / view / enroll)
- `Browsecoursecard.js` — Catalog course (enroll)
- `LiveClassCard.js` — Live class (join / notify / watch recording)
- `CourseCard.js` — Generic course card
- `StatCard.js` — Dashboard stat
- `Tutorcard.js`, `Profilecard.js`

**Course / browse**

- `CourseHeader.js`, `Browsecourseheader.js` — Course headers
- `Browsecoursestats.js`, `Browseaboutsection.js`, `Browsecoursecontent.js`, `Browserelatedcourses.js`, `Browseupcomingclass.js`
- `CourseContentAccordion.js`, `CourseTabs.js`

**Video / Q&A**

- `VideoPlayer.js` — Player, bookmarks, speed
- `DiscussionSection.js` — Questions, replies, post (PremiumGate)
- `QAItem.js`, `Answeritem.js`
- `PremiumGate.js` — Wraps premium-only content

**Quiz**

- `Quizmodal.js`, `Quizresultscreen.js`, `Quizreviewscreen.js`, `Quiztimer.js`, `Quizquestioncard.js`, `Quizinfocard.js`, `Quizgrid.js`, `Quizlegend.js`

**Profile / settings**

- `Profilepictureupload.js`, `Personalinformationform.js`, `Passwordsecuritysection.js`
- `Deleteaccountmodal.js`, `Deleteaccountcard.js`, `Privacysettingscard.js`, `Dataprivacycard.js`, `Dataexportcard.js`, `Usagestatscard.js`, `Billingdetailscard.js`, `Billinghistorycard.js`, `Subscriptioncard.js`, `Plansection.js`, `Parentaccesscard.js`, `Studentemailcard.js`

**Modals / UI**

- `Premiumupgrademodal.js` — Upgrade prompt
- `Newsessionmodal.js` — New AI session
- `Flagcontentmodal.js`, `Endquizmodal.js`
- `FilterBar.js`, `Notificationheader.js`, `Notificationitem.js`, `Notificationlist.js`
- `Liveclassescarousel.js`, `Liveclassheader.js`, `Liveclasscardmain.js`
- `ErrorBoundary.js`, `Logoutbutton.js`, `Protectedroute.js`

**Loading** (`components/ui/LoadingSpinner.js`)

- `Spinner`, `PageLoader`, `SectionLoader`, `ButtonLoader`
- `SkeletonCard`, `SkeletonCourseDetails`, `SkeletonList`, `SkeletonProfile`, `SkeletonLiveClassCard`, `SkeletonLiveClasses`

**Shared**

- `shared/LoadingSpinner.js` — Simple fullscreen/inline spinner

**Role-specific**

- `parent/ParentSidebar.js`, `tutor/TutorSidebar.js`

## Scripts

```bash
npm start   # Dev server
npm build   # Production build
npm test    # Tests
```

## Notes

- Profile image: upload via FormData; API may return relative or full URL; authSlice normalizes to full URL where needed.
- Premium: from `user.is_premium` and localStorage/Cookies; `isPremiumUser()` and `usePremium()` used across app.
- Toasts: use `showSuccess`, `showError`, `showWarning`, `showInfo` from `src/utils/toast.js` instead of `alert`.
- Body class `is-premium` is set in App.js for optional CSS-based hiding of premium upsell for premium users.
- Card buttons (Join, Notify, Enroll, Continue) use flex + `margin-top: auto` for bottom alignment (`card-alignment.css`).
