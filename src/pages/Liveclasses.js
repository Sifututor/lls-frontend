// src/pages/LiveClasses.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Liveclassescarousel from '../components/Liveclassescarousel';
import LiveClassCard from '../components/LiveClassCard';
import { SkeletonLiveClasses } from '../components/ui/LoadingSpinner';
import { useGetBrowseLiveClassesQuery, useJoinLiveClassMutation, useGetFormsQuery } from '../store/api/authApi';
import { usePremium } from '../hooks/usePremium';
import { showInfo } from '../utils/toast';

function LiveClasses() {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [filters, setFilters] = useState({
    searchText: '',
    subject: '',
    formLevel: '',
    tutor: ''
  });
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  // API Calls - Get live classes and forms
  const { data: apiResponse, isLoading, isError, refetch } = useGetBrowseLiveClassesQuery({});
  const { data: formsDataDirect, isLoading: formsDirectLoading } = useGetFormsQuery();
  const [joinLiveClass] = useJoinLiveClassMutation();

  // Transform API data to component format
  const { ongoingClasses, upcomingClasses, scheduledClasses, filterOptions } = useMemo(() => {
    if (!apiResponse?.data) {
      return {
        ongoingClasses: [],
        upcomingClasses: [],
        scheduledClasses: [],
        filterOptions: { subjects: [], formLevels: [], tutors: [] }
      };
    }

    const { ongoing = [], upcoming = [], scheduled = [] } = apiResponse.data;

    // Helper: Format schedule time (e.g., "Thu 2:00 PM")
    const formatScheduleTime = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = dayNames[date.getDay()];
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      const minuteStr = minutes.toString().padStart(2, '0');
      return `${day} ${hour12}:${minuteStr} ${ampm}`;
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
        slug: classItem.id, // Use id as slug for navigation
        thumbnail: '/assets/images/live-classes.png',
        status: statusText,
        subject: classItem.course?.subject || 'Biology',
        duration: `${classItem.duration_minutes || 60} Min`,
        courseBadge: truncateText(classItem.course?.title),
        schedule: type === 'scheduled' ? formatScheduleTime(classItem.scheduled_at) : null,
        instructor: {
          avatar: '/assets/images/icons/Ellipse 2.svg',
          name: classItem.tutor?.name || 'Unknown Tutor'
        },
        mainTitle: classItem.title,
        meta: 'Form 5 • Chapter 3/12',
        description: stripHtml(classItem.description),
        buttonType: buttonType,
        hasRecording: !!classItem.recording,
        recordingUrl: classItem.recording?.url || null,
        meetingUrl: classItem.meeting_url || null
      };
    };

    // Transform each category
    const transformedOngoing = ongoing.map(item => transformClass(item, 'ongoing'));
    const transformedUpcoming = upcoming.map(item => transformClass(item, 'upcoming'));
    const transformedScheduled = scheduled.map(item => transformClass(item, 'scheduled'));

    // Get unique tutors for filter
    const allClasses = [...ongoing, ...upcoming, ...scheduled];
    const tutors = [...new Set(allClasses.map(c => c.tutor?.name).filter(Boolean))];
    
    // Use dedicated forms API
    const formLevels = formsDataDirect 
      ? formsDataDirect.map(form => form.name || form.title || `Form ${form.level}`)
      : [];

    return {
      ongoingClasses: transformedOngoing,
      upcomingClasses: transformedUpcoming,
      scheduledClasses: transformedScheduled,
      filterOptions: {
        subjects: [],
        formLevels: formLevels,
        tutors: tutors
      }
    };
  }, [apiResponse, formsDataDirect]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    setShowActiveFilters(hasActiveFilters);
  };

  const handleClearAll = () => {
    setFilters({ searchText: '', subject: '', formLevel: '', tutor: '' });
    setShowActiveFilters(false);
  };

  const handleRemoveFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
    const remainingFilters = { ...filters, [key]: '' };
    const hasActiveFilters = Object.values(remainingFilters).some(value => value !== '');
    setShowActiveFilters(hasActiveFilters);
  };

  const handleJoinClass = async (classId) => {
    if (!isPremium) {
      navigate('/student/subscription');
      return;
    }
    
    try {
      const result = await joinLiveClass(classId).unwrap();
      if (result?.meeting_url) {
        window.open(result.meeting_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to join class:', error);
      // Navigate to live class details page if join fails
      navigate(`/student/live-class/${classId}`);
    }
  };

  const handleNotifyMe = (classId) => {
    showInfo('You will be notified when this class starts!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="dashboard-content">
        <SkeletonLiveClasses />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="dashboard-content">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
          <p style={{ color: '#DC2626', fontSize: '18px' }}>Failed to load live classes</p>
          <button className="btn-apply-filters" onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
          
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">Live Classes</h1>
            <p className="welcome-subtitle">Upcoming and Past Sessions</p>
            <button 
              onClick={() => navigate('/student/past-sessions')}
              className="view-all-link"
              style={{ marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#10B981', fontSize: '14px' }}
            >
              View Past Sessions →
            </button>
          </div>

          {/* Filter Bar */}
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleApply}
            onClearAll={handleClearAll}
            onRemoveFilter={handleRemoveFilter}
            showActiveFilters={showActiveFilters}
            filterOptions={filterOptions}
          />

          {/* ONGOING CLASSES - WITH CAROUSEL */}
          {ongoingClasses.length > 0 && (
            <Liveclassescarousel
              title="Ongoing Classes"
              classes={ongoingClasses}
              onJoin={handleJoinClass}
              onNotify={handleNotifyMe}
              showViewAll={true}
            />
          )}

          {/* UPCOMING CLASSES - SIMPLE GRID */}
          {upcomingClasses.length > 0 && (
            <div className="live-class-section">
              <div className="section-header">
                <h2 className="section-title">Upcoming Classes</h2>
              </div>
              <div className="classes-grid">
                {upcomingClasses.map((classData) => (
                  <LiveClassCard
                    key={classData.id}
                    classData={classData}
                    onJoin={handleJoinClass}
                    onNotify={handleNotifyMe}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULED CLASSES - SIMPLE GRID (with schedule badge) */}
          {scheduledClasses.length > 0 && (
            <div className="live-class-section">
              <div className="section-header">
                <h2 className="section-title">Scheduled Classes</h2>
              </div>
              <div className="classes-grid">
                {scheduledClasses.map((classData) => (
                  <LiveClassCard
                    key={classData.id}
                    classData={classData}
                    onJoin={handleJoinClass}
                    onNotify={handleNotifyMe}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {ongoingClasses.length === 0 && upcomingClasses.length === 0 && scheduledClasses.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <rect x="8" y="16" width="48" height="32" rx="4" stroke="#9CA3AF" strokeWidth="2"/>
                <circle cx="32" cy="32" r="8" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M28 32L31 35L36 29" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No live classes available</p>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Check back later for upcoming sessions</p>
            </div>
          )}
    </div>
  );
}

export default LiveClasses;