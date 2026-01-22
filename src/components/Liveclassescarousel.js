import React, { useState, useRef } from 'react';
import Liveclasscard from './LiveClassCard';

function Liveclassescarousel({ title, classes, onJoin, onNotify, showViewAll = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const cardWidth = 300;
  const visibleCards = 4;

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < classes.length - visibleCards;

  const handlePrev = () => {
    if (!canScrollLeft) return;

    setCurrentIndex(prev => prev - 1);
    carouselRef.current?.scrollBy({
      left: -cardWidth,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    if (!canScrollRight) return;

    setCurrentIndex(prev => prev + 1);
    carouselRef.current?.scrollBy({
      left: cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="live-class-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {showViewAll && (
          <a href="#" className="view-all-link">
            View All
          </a>
        )}
      </div>

      <div className="carousel-wrapper">
        <div className="carousel-container" ref={carouselRef}>
          <div className="carousel-track">
            {classes.map(classData => (
              <div key={classData.id} className="carousel-item">
                <Liveclasscard
                  classData={classData}
                  onJoin={onJoin}
                  onNotify={onNotify}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Arrows - Right Side */}
        <div className="carousel-arrows-stacked">
          {canScrollRight && (
            <button
              className="carousel-arrow-stacked carousel-arrow-next"
              onClick={handleNext}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {canScrollLeft && (
            <button
              className="carousel-arrow-stacked carousel-arrow-prev"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Liveclassescarousel;