import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Liveclasscard from '../components/LiveClassCard';
import EmptyState from '../components/EmptyState';
import { useGetFormsQuery, useGetSubjectsQuery, useGetBrowseLiveClassesQuery } from '../store/api/authApi';
import { SkeletonLiveClasses } from '../components/ui/LoadingSpinner';

function Pastsessions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    searchText: '',
    subject: '',
    formLevel: '',
    tutor: ''
  });

  const [showActiveFilters, setShowActiveFilters] = useState(false);

  // Fetch dynamic data from API - ALL API CALLS FIRST
  const { data: formsData, isLoading: formsLoading } = useGetFormsQuery();
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsQuery();
  const { data: liveClassesData, isLoading } = useGetBrowseLiveClassesQuery({});

  // Transform API data to filter options format
  const filterOptions = useMemo(() => {
    // Extract arrays from API responses safely
    const forms = formsData || [];
    const subjects = Array.isArray(subjectsData) 
      ? subjectsData 
      : (subjectsData?.data || subjectsData?.subjects || []);
    
    // Extract unique tutors from liveClassesData (no static data)
    const allClasses = [
      ...(liveClassesData?.data?.ongoing || []),
      ...(liveClassesData?.data?.upcoming || []),
      ...(liveClassesData?.data?.scheduled || [])
    ];
    const tutors = [...new Set(allClasses.map(c => c.instructor?.name).filter(Boolean))];

    return {
      subjects: subjects.map(subject => ({
        value: typeof subject === 'string' ? subject : (subject.title || subject.name),
        label: typeof subject === 'string' ? subject : (subject.title || subject.name)
      })),
      formLevels: forms.map(form => ({
        value: form.name || form.title || `Form ${form.level}`,
        label: form.name || form.title || `Form ${form.level}`
      })),
      tutors: tutors.map(tutor => ({
        value: tutor,
        label: tutor
      }))
    };
  }, [formsData, subjectsData, liveClassesData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    setShowActiveFilters(hasActiveFilters);
  };

  const handleClearAll = () => {
    setFilters({
      searchText: '',
      subject: '',
      formLevel: '',
      tutor: ''
    });
    setShowActiveFilters(false);
  };

  const handleRemoveFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: ''
    }));
    
    const remainingFilters = { ...filters, [key]: '' };
    const hasActiveFilters = Object.values(remainingFilters).some(value => value !== '');
    setShowActiveFilters(hasActiveFilters);
  };
  
  // Get past sessions (classes with recordings)
  const pastSessions = useMemo(() => {
    if (!liveClassesData?.data) return { myEnrolled: [], relevant: [] };
    
    // Filter classes that have recordings (past sessions)
    const allClasses = [
      ...(liveClassesData.data.ongoing || []),
      ...(liveClassesData.data.upcoming || []),
      ...(liveClassesData.data.scheduled || [])
    ];
    
    const recorded = allClasses.filter(cls => cls.recording || cls.status === 'completed');
    
    return {
      myEnrolled: recorded.slice(0, 4), // First 4 as enrolled
      relevant: recorded.slice(4, 8) // Next 4 as relevant
    };
  }, [liveClassesData]);

  const handleWatchRecording = (classId) => {
    navigate(`/student/live-class/${classId}`);
  };

  return (
    <div className="dashboard-content">
          
          {/* Page Header */}
          <div className="page-header-section">
            <button 
              className="back-btn" 
              onClick={() => navigate('/student/live-classes')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', color: '#6B7280' }}
            >
              ← Back to Live Classes
            </button>
            <h1 className="welcome-title">Past Sessions</h1>
            <p className="welcome-subtitle">
              View recordings of past live class sessions
            </p>
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

          {isLoading ? (
            <SkeletonLiveClasses />
          ) : pastSessions.myEnrolled.length === 0 && pastSessions.relevant.length === 0 ? (
            <EmptyState
              icon="/assets/images/icons/140-video.svg"
              title="No past sessions available"
              description="Past live class recordings will appear here once they are completed"
              actionText="View Upcoming Classes"
              actionLink="/student/live-classes"
            />
          ) : (
            <>
              {/* MY ENROLLED COURSES */}
              {pastSessions.myEnrolled.length > 0 && (
                <div className="live-class-section">
                  <div className="section-header">
                    <h2 className="section-title">My Enrolled Courses</h2>
                  </div>
                  <div className="classes-grid">
                    {pastSessions.myEnrolled.map((classData) => (
                      <Liveclasscard
                        key={classData.id}
                        classData={classData}
                        onJoin={handleWatchRecording}
                        onNotify={handleWatchRecording}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* RELEVANT COURSES */}
              {pastSessions.relevant.length > 0 && (
                <div className="live-class-section">
                  <div className="section-header">
                    <h2 className="section-title">Relevant Courses</h2>
                  </div>
                  <div className="classes-grid">
                    {pastSessions.relevant.map((classData) => (
                      <Liveclasscard
                        key={classData.id}
                        classData={classData}
                        onJoin={handleWatchRecording}
                        onNotify={handleWatchRecording}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
    </div>
  );
}

export default Pastsessions;