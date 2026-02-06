// src/components/Browseaboutsection.js
import React from 'react';

function BrowseAboutSection({ about }) {
  // Safe access with defaults
  const title = about?.title || 'About This Course';
  const description = about?.description || 'This course provides comprehensive learning materials.';
  
  // Support both learningPoints and learningOutcomes
  const learningPoints = about?.learningPoints || about?.learningOutcomes || [
    'Understand fundamental concepts',
    'Apply knowledge in practical scenarios',
    'Build problem-solving skills',
    'Prepare for examinations'
  ];

  return (
    <div className="browse-about-section">
      <h2 className="browse-section-title">{title}</h2>
      
      <p className="browse-about-description">{description}</p>

      <p className="browse-about-subtitle">You will dive deep into:</p>

      <ul className="browse-learning-points">
        {learningPoints.map((point, index) => (
          <li key={index} className="browse-learning-point">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BrowseAboutSection;