// src/components/FilterBar.js
import React from 'react';

function FilterBar({ 
  filters = {}, 
  onFilterChange = () => {}, 
  onApply = () => {}, 
  onClearAll = () => {}, 
  onRemoveFilter = () => {}, 
  showActiveFilters = false,
  filterOptions = {
    subjects: [],
    formLevels: [],
    tutors: []
  }
}) {
  const handleSearchChange = (e) => {
    onFilterChange('searchText', e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onApply();
    }
  };

  // Transform API filters to dropdown format if needed
  const getSubjectOptions = () => {
    if (filterOptions.subjects.length === 0) return [];
    
    // Check if already in {value, label} format
    if (filterOptions.subjects[0]?.value !== undefined) {
      return filterOptions.subjects;
    }
    
    // Transform string array to {value, label} format
    return filterOptions.subjects.map(subject => ({
      value: subject,
      label: subject
    }));
  };

  const getFormLevelOptions = () => {
    if (filterOptions.formLevels.length === 0) return [];
    
    if (filterOptions.formLevels[0]?.value !== undefined) {
      return filterOptions.formLevels;
    }
    
    return filterOptions.formLevels.map(level => ({
      value: level,
      label: level
    }));
  };

  const getTutorOptions = () => {
    if (filterOptions.tutors.length === 0) return [];
    
    if (filterOptions.tutors[0]?.value !== undefined) {
      return filterOptions.tutors;
    }
    
    return filterOptions.tutors.map(tutor => ({
      value: tutor,
      label: tutor
    }));
  };

  const subjectOptions = getSubjectOptions();
  const formLevelOptions = getFormLevelOptions();
  const tutorOptions = getTutorOptions();

  return (
    <div className="filter-bar-container">
      <div className="filter-row">
        <div className="filter-search-group">
          <input 
            type="text" 
            className="filter-search-input" 
            placeholder="Search for courses, lessons, or tutors..."
            value={filters.searchText || ''}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className="btn-filter-search" onClick={onApply}>
            Search
          </button>
        </div>

        <div className="filter-dropdowns">
          <select 
            className="filter-dropdown" 
            value={filters.subject || ''}
            onChange={(e) => onFilterChange('subject', e.target.value)}
          >
            <option value="">Subject</option>
            {subjectOptions.map((option, index) => (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className="filter-dropdown"
            value={filters.formLevel || ''}
            onChange={(e) => onFilterChange('formLevel', e.target.value)}
          >
            <option value="">Form Level</option>
            {formLevelOptions.map((option, index) => (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            className="filter-dropdown"
            value={filters.tutor || ''}
            onChange={(e) => onFilterChange('tutor', e.target.value)}
          >
            <option value="">Tutor</option>
            {tutorOptions.map((option, index) => (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button className="btn-apply-filters" onClick={onApply}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Filters Row */}
      {showActiveFilters && (
        <div className="active-filters-row">
          <button className="btn-clear-filters" onClick={onClearAll}>
            Clear all
          </button>
          <div className="filter-tags-list">
            {filters.searchText && (
              <span className="filter-tag">
                Search: "{filters.searchText}"
                <button className="btn-remove-tag" onClick={() => onRemoveFilter('searchText')}>×</button>
              </span>
            )}
            {filters.subject && (
              <span className="filter-tag">
                {filters.subject}
                <button className="btn-remove-tag" onClick={() => onRemoveFilter('subject')}>×</button>
              </span>
            )}
            {filters.formLevel && (
              <span className="filter-tag">
                {filters.formLevel}
                <button className="btn-remove-tag" onClick={() => onRemoveFilter('formLevel')}>×</button>
              </span>
            )}
            {filters.tutor && (
              <span className="filter-tag">
                {filters.tutor}
                <button className="btn-remove-tag" onClick={() => onRemoveFilter('tutor')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;