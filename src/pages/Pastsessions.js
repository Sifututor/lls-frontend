import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import Liveclasscard from '../components/LiveClassCard';
import { pastSessionsData } from '../data/Pastsessionsdata';

function Pastsessions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    searchText: '',
    subject: '',
    formLevel: '',
    tutor: ''
  });

  const [showActiveFilters, setShowActiveFilters] = useState(false);

  const filterOptions = {
    subjects: [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'biology', label: 'Biology' }
    ],
    formLevels: [
      { value: 'form1', label: 'Form 1' },
      { value: 'form2', label: 'Form 2' },
      { value: 'form3', label: 'Form 3' },
      { value: 'form4', label: 'Form 4' },
      { value: 'form5', label: 'Form 5' }
    ],
    tutors: [
      { value: 'sarah', label: 'Sarah Jenkins' },
      { value: 'ahmad', label: 'Ahmad Faiz' },
      { value: 'siti', label: 'Siti Sarah' }
    ]
  };

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

          {/* MY ENROLLED COURSES */}
          <div className="live-class-section">
            <div className="section-header">
              <h2 className="section-title">My Enrolled Courses</h2>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="classes-grid">
              {pastSessionsData.myEnrolled.map((classData) => (
                <Liveclasscard
                  key={classData.id}
                  classData={classData}
                  onJoin={handleWatchRecording}
                  onNotify={handleWatchRecording}
                />
              ))}
            </div>
          </div>

          {/* RELEVANT COURSES */}
          <div className="live-class-section">
            <div className="section-header">
              <h2 className="section-title">Relevant Courses</h2>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="classes-grid">
              {pastSessionsData.relevant.map((classData) => (
                <Liveclasscard
                  key={classData.id}
                  classData={classData}
                  onJoin={handleWatchRecording}
                  onNotify={handleWatchRecording}
                />
              ))}
            </div>
          </div>

          {/* OTHERS */}
          <div className="live-class-section">
            <div className="section-header">
              <h2 className="section-title">Others</h2>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="classes-grid">
              {pastSessionsData.others.map((classData) => (
                <Liveclasscard
                  key={classData.id}
                  classData={classData}
                  onJoin={handleWatchRecording}
                  onNotify={handleWatchRecording}
                />
              ))}
            </div>
          </div>
    </div>
  );
}

export default Pastsessions;