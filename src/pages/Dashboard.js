// src/pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import StatCard from '../components/StatCard';
import LiveClassCard from '../components/LiveClassCard';
import MyCourseCard from '../components/MyCourseCard';
import QAItem from '../components/QAItem';
import { 
  useGetMyCoursesQuery, 
  useGetBrowseLiveClassesQuery, 
  useJoinLiveClassMutation,
  useGetStudentDashboardAnalyticsQuery,
  useGetUserBadgesQuery,
} from '../store/api/authApi';
import { getBadgeConfig } from '../utils/badgeConfig';
import { SectionLoader, Spinner, SkeletonCard, SkeletonLiveClasses } from '../components/ui/LoadingSpinner';
import { 
  statsData as defaultStatsData
} from '../data/dashboardData';
import EmptyState from '../components/EmptyState';
import { usePremium } from '../hooks/usePremium';
import { showInfo } from '../utils/toast';

function Dashboard() {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  
  // API Calls
  const { data: apiResponse, isLoading: coursesLoading } = useGetMyCoursesQuery({});
  const { data: liveClassesResponse, isLoading: liveClassesLoading } = useGetBrowseLiveClassesQuery({});
  const { data: analyticsData, isLoading: analyticsLoading } = useGetStudentDashboardAnalyticsQuery();
  const { data: badgesData = [], isLoading: badgesLoading } = useGetUserBadgesQuery();
  const [joinLiveClass] = useJoinLiveClassMutation();

  // Streak: from analytics or highest streak badge
  const getStreakDisplay = () => {
    const streak = analyticsData?.learning_streak ?? analyticsData?.streak;
    if (streak != null && streak > 0) return `${streak} Day${streak !== 1 ? 's' : ''} Streak`;
    const streakBadge = (Array.isArray(badgesData) ? badgesData : [])
      .map((b) => {
        const m = String(b.badge_type || '').match(/streak_(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => n > 0)
      .sort((a, b) => b - a)[0];
    if (streakBadge) return `${streakBadge} Day Streak`;
    return null;
  };


  // Transform API analytics to stats - only use API data, no fallback to static
  const getStatsData = () => {
    if (!analyticsData) return null;

    const { courses_enrolled, videos_watched, quiz_average, learning_time } = analyticsData;

    const coursesProgress = courses_enrolled?.progress?.total > 0 
      ? (courses_enrolled.progress.current / courses_enrolled.progress.total) * 100 
      : 0;

    const videosProgress = videos_watched?.progress?.total > 0 
      ? (videos_watched.progress.current / videos_watched.progress.total) * 100 
      : 0;

    const quizProgress = quiz_average?.value || 0;

    const timeProgress = learning_time?.goal?.total > 0 
      ? (learning_time.goal.current / learning_time.goal.total) * 100 
      : 0;

    return [
      {
        ...defaultStatsData[0],
        value: courses_enrolled?.value || 0,
        progressValue: `${courses_enrolled?.progress?.current || 0} of ${courses_enrolled?.progress?.total || 0}`,
        progress: coursesProgress
      },
      {
        ...defaultStatsData[1],
        value: videos_watched?.value || 0,
        progressValue: `${videos_watched?.progress?.current || 0} of ${videos_watched?.progress?.total || 0}`,
        progress: videosProgress
      },
      {
        ...defaultStatsData[2],
        value: `${quiz_average?.value || 0}%`,
        progressValue: quiz_average?.performance || 'Improvement',
        progress: quizProgress
      },
      {
        ...defaultStatsData[3],
        value: `${learning_time?.hours || 0}h`,
        progressValue: `${learning_time?.goal?.current || 0} of ${learning_time?.goal?.total || 100}h`,
        progress: timeProgress
      }
    ];
  };

  const statsData = getStatsData();

  // Calculate weekly goal percentage
  const getWeeklyGoalPercentage = () => {
    if (!analyticsData?.learning_time?.goal) return 80;
    const { current, total } = analyticsData.learning_time.goal;
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  // Helper: Strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Helper: Truncate text
  const truncateText = (text, maxLength = 18) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Transform Live Classes API data - 2 Join + 2 Notify
  const getLiveClasses = () => {
    if (!liveClassesResponse?.data) return [];
    
    const { ongoing = [], upcoming = [], scheduled = [] } = liveClassesResponse.data;

    const transformClass = (classItem, type) => {
      let buttonType = 'notify';
      let statusText = 'upcoming';

      if (type === 'ongoing') {
        buttonType = 'join';
        statusText = 'ongoing';
      } else if (type === 'upcoming') {
        buttonType = 'notify';
        statusText = 'upcoming';
      } else if (type === 'scheduled') {
        buttonType = 'notify';
        statusText = 'scheduled';
      }

      return {
        id: classItem.id,
        slug: classItem.id,
        thumbnail: '/assets/images/live-classes.png',
        status: statusText,
        subject: classItem.course?.subject || 'Biology',
        duration: `${classItem.duration_minutes || 60} Min`,
        courseBadge: truncateText(classItem.course?.title),
        schedule: null,
        instructor: {
          avatar: '/assets/images/icons/Ellipse 2.svg',
          name: classItem.tutor?.name || 'Unknown Tutor'
        },
        mainTitle: classItem.title,
        meta: 'Form 5 • Chapter 3/12',
        description: stripHtml(classItem.description),
        buttonType: buttonType
      };
    };

    const joinClasses = ongoing.slice(0, 2).map(item => transformClass(item, 'ongoing'));
    const notifyClasses = [...upcoming, ...scheduled].slice(0, 2).map(item => transformClass(item, 'upcoming'));

    return [...joinClasses, ...notifyClasses].slice(0, 4);
  };

  const liveClassesData = getLiveClasses();

  // Get first 4 ongoing courses for Continue Learning
  const getContinueLearningCourses = () => {
    if (!apiResponse) return [];
    
    const responseData = apiResponse.data || apiResponse;
    const coursesArray = responseData?.courses?.data || [];
    
    return coursesArray
      .filter(c => (c.progress_percentage ?? 0) < 100)
      .slice(0, 4)
      .map(course => {
        return {
          id: course.id,
          slug: course.slug,
          thumbnail: '/assets/images/live-classes.png',
          badge: course.subject?.toLowerCase() || 'general',
          lastWatched: (course.progress_percentage ?? 0) > 0,
          instructor: {
            name: course.creator?.name || 'Unknown',
            avatar: '/assets/images/icons/Ellipse 2.svg'
          },
          title: course.title,
          chapter: course.level || 'Form 1',
          progress: course.progress_percentage ?? 0,
          type: 'ongoing'
        };
      });
  };

  const continueLearningCourses = getContinueLearningCourses();


  // Get user name
  const getUserName = () => {
    try {
      const raw = localStorage.getItem('userData') || Cookies.get('userData');
      return raw ? JSON.parse(raw)?.name : 'Student';
    } catch {
      return 'Student';
    }
  };

  // Handlers
  const handleViewAllClasses = () => navigate('/student/live-classes');
  const handleViewAllCourses = () => navigate('/student/my-courses');
  const handleViewAllQA = () => navigate('/student/video-qa');
  
  const handleJoinClass = async (classId) => {
    try {
      const result = await joinLiveClass(classId).unwrap();
      if (result?.meeting_url) {
        window.open(result.meeting_url, '_blank');
      }
    } catch (error) {
      navigate(`/student/live-class/${classId}`);
    }
  };

  const handleNotifyClass = (classId) => {
    showInfo('You will be notified when this class starts!');
  };

  const handleViewQA = (slug) => {
    navigate(`/student/video-qa${slug ? `#${slug}` : ''}`);
  };
  
  const handleCourseClick = (slug) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/student/course/${slug}`);
  };

  return (
    <div className="dashboard-content">
          {/* Welcome + Stats */}
          <section className="welcome-stats-container">
            <div className="welcome-section">
              <div className="welcome-text">
                <h1 className="welcome-title">
                  Welcome back, {getUserName()}!
                  {getStreakDisplay() && (
                    <span className="streak-badge">
                      <img src="/assets/images/icons/fire.png" alt="Fire" className="streak-icon" />
                      {getStreakDisplay()}
                    </span>
                  )}
                </h1>
                <p className="welcome-subtitle">
                  You've completed {analyticsLoading ? '--' : getWeeklyGoalPercentage()}% of your weekly goal, Keep it up!
                </p>
              </div>
              <div className="achievement-badges">
                {badgesLoading ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="badge-item" style={{ opacity: 0.5 }} aria-hidden>
                        <img src="/assets/images/icons/dashboard-1.png" alt="" className="badge-icon" style={{ width: 24, height: 24 }} />
                      </div>
                    ))}
                  </div>
                ) : (Array.isArray(badgesData) ? badgesData : []).length > 0 ? (
                  (Array.isArray(badgesData) ? badgesData : []).map((badge) => {
                    const config = getBadgeConfig(badge.badge_type);
                    return (
                      <div
                        key={badge.id}
                        className="badge-item active"
                        data-tooltip={config.tooltip}
                        title={config.tooltip}
                      >
                        <img src={config.icon} alt={config.label} className="badge-icon" />
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', padding: '12px 0', margin: 0 }}>
                    Complete courses and quizzes to earn badges
                  </p>
                )}
              </div>
            </div>
            <div className="stats-grid">
              {analyticsLoading || !statsData ? (
                // Loading skeleton
                defaultStatsData.map((stat) => (
                  <div key={stat.id} className={`stat-card ${stat.type}`} style={{ opacity: 0.6 }}>
                    <div className="stat-label"><Spinner size="sm" color="gray" /></div>
                    <div className="stat-header">
                      <div className="stat-icon-wrapper">
                        <img src={stat.icon} alt={stat.title} className="stat-icon" />
                      </div>
                      <div className="stat-content">
                        <h2 className="stat-value">--</h2>
                        <p className="stat-title">{stat.title}</p>
                      </div>
                    </div>
                    <div className="stat-footer">
                      <span className="progress-text">{stat.progressText}</span>
                      <span className="progress-value">--</span>
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                statsData.map((stat) => (
                  <StatCard key={stat.id} data={stat} />
                ))
              )}
            </div>
          </section>

          {/* Live Classes - 2 Join + 2 Notify */}
          <section className="welcome-stats-container">
            <div className="section-header stats">
              <h3 className="section-title flex">
                Live Classes
                {!isPremium && (
                  <span className="premium-tag">
                    <img src="/assets/images/icons/120-setting.svg" alt="Premium" />
                    Premium
                  </span>
                )}
              </h3>
              <button onClick={handleViewAllClasses} className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                View All Classes
              </button>
            </div>
            {liveClassesLoading ? (
              <SkeletonLiveClasses />
            ) : liveClassesData.length > 0 ? (
              <div className="live-classes-grid">
                {liveClassesData.map((classItem) => (
                  <LiveClassCard 
                    key={classItem.id} 
                    classData={classItem}
                    onJoin={handleJoinClass}
                    onNotify={handleNotifyClass}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px' }}>
                <p style={{ color: '#6B7280', marginBottom: '16px' }}>No live classes available</p>
                <button className="btn-apply-filters" onClick={handleViewAllClasses}>
                  Browse All Classes
                </button>
              </div>
            )}
          </section>

          {/* Continue Learning - Static thumbnail/avatar */}
          <section className="welcome-stats-container">
            <div className="section-header stats">
              <h3 className="section-title flex">Continue Learning</h3>
              <button onClick={handleViewAllCourses} className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                View all courses
              </button>
            </div>
            {coursesLoading ? (
              <div className="courses-grid">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : continueLearningCourses.length > 0 ? (
              <div className="courses-grid">
                {continueLearningCourses.map((course) => (
                  <MyCourseCard 
                    key={course.id} 
                    course={course}
                    onClick={() => handleCourseClick(course.slug)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px' }}>
                <p style={{ color: '#6B7280', marginBottom: '16px' }}>No courses in progress</p>
                <button className="btn-apply-filters" onClick={() => navigate('/student/browse-courses')}>
                  Browse Courses
                </button>
              </div>
            )}
          </section>

          {/* Recent Q&A */}
          <section className="welcome-stats-container">
            <div className="section-header stats">
              <h3 className="section-title flex">
                Recent Video Q&A
                {!isPremium && (
                  <span className="premium-tag">
                    <img src="/assets/images/icons/120-setting.svg" alt="Premium" />
                    Premium
                  </span>
                )}
              </h3>
              <button onClick={handleViewAllQA} className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                View All
              </button>
            </div>
            <div className="qa-list">
              {/* No static Q&A data - show empty state */}
              <EmptyState
                title="No recent Q&A"
                description="Ask questions in your course videos to get help from tutors"
                actionText="Browse Courses"
                actionLink="/student/browse-courses"
              />
            </div>
          </section>
    </div>
  );
}

export default Dashboard;