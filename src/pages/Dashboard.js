// src/pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatCard from '../components/StatCard';
import LiveClassCard from '../components/LiveClassCard';
import MyCourseCard from '../components/MyCourseCard';
import QAItem from '../components/QAItem';
import { useGetMyCoursesQuery, useGetBrowseLiveClassesQuery, useJoinLiveClassMutation } from '../store/api/authApi';
import { 
  statsData, 
  qaData,
  achievementBadges 
} from '../data/dashboardData';

function Dashboard() {
  const navigate = useNavigate();
  
  // API Calls
  const { data: apiResponse, isLoading: coursesLoading } = useGetMyCoursesQuery({});
  const { data: liveClassesResponse, isLoading: liveClassesLoading } = useGetBrowseLiveClassesQuery({});
  const [joinLiveClass] = useJoinLiveClassMutation();

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

    console.log('📦 Dashboard Live Classes:', { ongoing, upcoming, scheduled });

    // Transform single class
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

    // Get 2 ongoing (Join Now) classes
    const joinClasses = ongoing.slice(0, 2).map(item => transformClass(item, 'ongoing'));
    
    // Get 2 upcoming/scheduled (Notify Me) classes
    const notifyClasses = [...upcoming, ...scheduled].slice(0, 2).map(item => transformClass(item, 'upcoming'));

    // Combine: 2 Join + 2 Notify = 4 cards total
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
          // Static thumbnail (same as LiveClassCard)
          thumbnail: '/assets/images/live-classes.png',
          badge: course.subject?.toLowerCase() || 'general',
          lastWatched: (course.progress_percentage ?? 0) > 0,
          instructor: {
            name: course.creator?.name || 'Unknown',
            // Static avatar (same as LiveClassCard)
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
      return JSON.parse(localStorage.getItem('userData'))?.name || 'Student';
    } catch {
      return 'Student';
    }
  };

  // Handlers
  const handleViewAllClasses = () => navigate('/live-classes');
  const handleViewAllCourses = () => navigate('/my-courses');
  const handleViewAllQA = () => navigate('/recent-video-qa');
  
  const handleJoinClass = async (classId) => {
    console.log('Joining class:', classId);
    try {
      const result = await joinLiveClass(classId).unwrap();
      console.log('Join result:', result);
      if (result?.meeting_url) {
        window.open(result.meeting_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to join class:', error);
      navigate(`/live-class-details/${classId}`);
    }
  };

  const handleNotifyClass = (classId) => {
    console.log('Notify me for class:', classId);
    alert('You will be notified when this class starts!');
  };

  const handleViewQA = (slug) => navigate(`/recent-video-qa#${slug}`);
  
  const handleCourseClick = (slug) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/course-details/${slug}`);
  };

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <TopNavbar title="Dashboard" />
        
        <div className="dashboard-content">
          {/* Welcome + Stats */}
          <section className="welcome-stats-container">
            <div className="welcome-section">
              <div className="welcome-text">
                <h1 className="welcome-title">
                  Welcome back, {getUserName()}!
                  <span className="streak-badge">
                    <img src="/assets/images/icons/fire.png" alt="Fire" className="streak-icon" />
                    12 Days Streak
                  </span>
                </h1>
                <p className="welcome-subtitle">
                  You've completed 80% of your weekly goal, Keep it up!
                </p>
              </div>
              <div className="achievement-badges">
                {achievementBadges.map((badge) => (
                  <div key={badge.id} className="badge-item">
                    <img src={badge.icon} alt={badge.alt} className="badge-icon" />
                  </div>
                ))}
              </div>
            </div>
            <div className="stats-grid">
              {statsData.map((stat) => (
                <StatCard key={stat.id} data={stat} />
              ))}
            </div>
          </section>

          {/* Live Classes - 2 Join + 2 Notify */}
          <section className="welcome-stats-container">
            <div className="section-header stats">
              <h3 className="section-title flex">
                Live Classes
                <span className="premium-tag">
                  <img src="/assets/images/icons/120-setting.svg" alt="Premium" />
                  Premium
                </span>
              </h3>
              <button onClick={handleViewAllClasses} className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                View All Classes
              </button>
            </div>
            {liveClassesLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px' }}>
                <p style={{ color: '#6B7280' }}>Loading live classes...</p>
              </div>
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
              <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px' }}>
                <p style={{ color: '#6B7280' }}>Loading courses...</p>
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
                <button className="btn-apply-filters" onClick={() => navigate('/browse-courses')}>
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
                <span className="premium-tag">
                  <img src="/assets/images/icons/120-setting.svg" alt="Premium" />
                  Premium
                </span>
              </h3>
              <button onClick={handleViewAllQA} className="view-all" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                View All
              </button>
            </div>
            <div className="qa-list">
              {qaData.map((qa) => (
                <QAItem key={qa.id} qa={qa} onClick={() => handleViewQA(qa.slug)} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Dashboard;