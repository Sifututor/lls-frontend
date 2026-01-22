import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import FilterBar from '../components/FilterBar';
import Liveclasscard from '../components/LiveClassCard';
import { pastSessionsData } from '../data/Pastsessionsdata';

function Pastsessions() {
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
    console.log('Applying filters:', filters);
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
    console.log('Watching recording:', classId);
    // Navigate to live-class-details page
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="Live Classes" breadcrumb="Past Sessions" />

        <div className="dashboard-content">
          
          {/* Page Header */}
          <div className="page-header-section">
            <h1 className="welcome-title">Past Sessions</h1>
            <p className="welcome-subtitle">
              Upcoming and Past Sessions
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
      </main>
    </>
  );
}

export default Pastsessions;