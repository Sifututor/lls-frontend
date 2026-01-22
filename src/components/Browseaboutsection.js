import React from 'react';

function BrowseAboutSection({ about }) {
  return (
    <div className="browse-about-section">
      <h2 className="browse-section-title">{about.title}</h2>
      
      <p className="browse-about-description">{about.description}</p>

      <p className="browse-about-subtitle">You will dive deep into:</p>

      <ul className="browse-learning-points">
        {about.learningPoints.map((point, index) => (
          <li key={index} className="browse-learning-point">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BrowseAboutSection;