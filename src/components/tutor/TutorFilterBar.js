// Tutor My Courses filter bar - same design as student, tutor-course-* classes only. Subject + Level.
import React from 'react';

function TutorFilterBar({
  filters = {},
  onFilterChange = () => {},
  onApply = () => {},
  onClearAll = () => {},
  onRemoveFilter = () => {},
  showActiveFilters = false,
  filterOptions = { subjects: [], levels: [] },
}) {
  const handleSearchChange = (e) => {
    onFilterChange('searchText', e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onApply();
  };

  const subjectOptions = filterOptions.subjects || [];
  const levelOptions = filterOptions.levels || [];

  return (
    <div className="tutor-course-filter-bar-container">
      <div className="tutor-course-filter-row">
        <div className="tutor-course-filter-search-group">
          <input
            type="text"
            className="tutor-course-filter-search-input"
            placeholder="Search for courses, or lessons..."
            value={filters.searchText || ''}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button type="button" className="tutor-course-btn-filter-search" onClick={onApply}>
            Search
          </button>
        </div>

        <div className="tutor-course-filter-dropdowns">
          <select
            className="tutor-course-filter-dropdown"
            value={filters.subject || ''}
            onChange={(e) => onFilterChange('subject', e.target.value)}
          >
            <option value="">Subject</option>
            {subjectOptions.map((opt, i) => (
              <option key={opt.value || i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="tutor-course-filter-dropdown"
            value={filters.level || ''}
            onChange={(e) => onFilterChange('level', e.target.value)}
          >
            <option value="">Level</option>
            {levelOptions.map((opt, i) => (
              <option key={opt.value || i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button type="button" className="tutor-course-btn-apply-filters" onClick={onApply}>
            Apply Filters
          </button>
        </div>
      </div>

      {showActiveFilters && (
        <div className="tutor-course-active-filters-row">
          <button type="button" className="tutor-course-btn-clear-filters" onClick={onClearAll}>
            Clear all
          </button>
          <div className="tutor-course-filter-tags-list">
            {filters.searchText && (
              <span className="tutor-course-filter-tag">
                Search: "{filters.searchText}"
                <button type="button" className="tutor-course-btn-remove-tag" onClick={() => onRemoveFilter('searchText')}>×</button>
              </span>
            )}
            {filters.subject && (
              <span className="tutor-course-filter-tag">
                {filters.subject}
                <button type="button" className="tutor-course-btn-remove-tag" onClick={() => onRemoveFilter('subject')}>×</button>
              </span>
            )}
            {filters.level && (
              <span className="tutor-course-filter-tag">
                {filters.level}
                <button type="button" className="tutor-course-btn-remove-tag" onClick={() => onRemoveFilter('level')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorFilterBar;
