// src/components/VideoPlayer.js
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(({ 
  video, 
  onNextLesson, 
  onPreviousLesson, 
  hasNextLesson = true, 
  hasPreviousLesson = true,
  onBookmarkClick // New prop - callback when bookmark is clicked
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNextLesson, setShowNextLesson] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Expose getCurrentTime method to parent via ref
  useImperativeHandle(ref, () => ({
    getCurrentTime: () => currentTime,
    getCurrentTimeFormatted: () => formatTime(currentTime),
    getDuration: () => duration
  }));

  // Reset state when video changes
  useEffect(() => {
    setShowThumbnail(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowNextLesson(false);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [video?.url]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
          setShowThumbnail(false);
        }
      } catch (error) {
        console.log('Playback error:', error);
        setVideoError(true);
      }
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (duration - videoRef.current.currentTime <= 15 && duration > 0) {
        setShowNextLesson(true);
      } else {
        setShowNextLesson(false);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowNextLesson(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setShowThumbnail(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    console.log('Video error - URL:', video?.url);
    setVideoError(true);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume || 0.5);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Handle bookmark click - opens notes tab with current timestamp
  const handleAddBookmark = () => {
    if (onBookmarkClick) {
      onBookmarkClick({
        timestamp: Math.floor(currentTime),
        timestampFormatted: formatTime(currentTime)
      });
    }
  };

  const handleNextLesson = () => {
    if (onNextLesson && hasNextLesson) {
      onNextLesson();
      setShowNextLesson(false);
      setCurrentTime(0);
      setShowThumbnail(true);
      setIsPlaying(false);
    }
  };

  const handlePreviousLesson = () => {
    if (onPreviousLesson && hasPreviousLesson) {
      onPreviousLesson();
      setCurrentTime(0);
      setShowThumbnail(true);
      setIsPlaying(false);
    }
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    setShowQualityMenu(false);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts when typing in input, textarea, or contenteditable
      const activeElement = document.activeElement;
      const isTyping = activeElement.tagName === 'INPUT' || 
                       activeElement.tagName === 'TEXTAREA' || 
                       activeElement.isContentEditable;
      
      if (isTyping) return;

      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          skipTime(-10);
          break;
        case 'ArrowRight':
          skipTime(10);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  return (
    <div 
      className="video-player-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="video-player">
        <video
          ref={videoRef}
          className="course-video"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleVideoError}
          crossOrigin="anonymous"
        >
          {video?.url && <source src={video.url} type="video/mp4" />}
        </video>

        {/* Error State */}
        {videoError && (
          <div className="video-error-overlay">
            <div className="error-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Unable to load video</p>
              <small>Please try again later</small>
            </div>
          </div>
        )}

        {showThumbnail && !videoError && (
          <div className="video-thumbnail-overlay" onClick={togglePlay}>
            <img 
              src={video?.thumbnail || '/assets/images/live-classes.png'} 
              alt="Video Thumbnail" 
              className="video-thumbnail"
              onError={(e) => e.target.src = '/assets/images/live-classes.png'}
            />
            <button className="play-button-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="white" fillOpacity="0.95"/>
                <path d="M32 26L56 40L32 54V26Z" fill="#163300"/>
              </svg>
            </button>
          </div>
        )}

        {showNextLesson && hasNextLesson && (
          <div className="next-lesson-overlay">
            <div className="next-lesson-card">
              <div className="next-lesson-info">
                <span className="next-lesson-label">Up Next</span>
                <h3 className="next-lesson-title">Next Lesson Starting...</h3>
              </div>
              <button className="btn-next-lesson-big" onClick={handleNextLesson}>
                <span>Play Now</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {!showThumbnail && !videoError && (
          <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
            <div className="progress-bar-wrapper">
              <div className="progress-bar" onClick={handleSeek}>
                <div className="progress-filled" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="controls-row">
              <div className="controls-left">
                <button className="control-btn" onClick={togglePlay} title="Play/Pause (Space)">
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="white"/>
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="white"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                    </svg>
                  )}
                </button>

                {hasPreviousLesson && (
                  <button className="control-btn" onClick={handlePreviousLesson} title="Previous Lesson">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M19 5L9 12L19 19V5Z" fill="white"/>
                      <rect x="5" y="5" width="2" height="14" fill="white"/>
                    </svg>
                  </button>
                )}

                {hasNextLesson && (
                  <button className="control-btn" onClick={handleNextLesson} title="Next Lesson">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 5L15 12L5 19V5Z" fill="white"/>
                      <rect x="17" y="5" width="2" height="14" fill="white"/>
                    </svg>
                  </button>
                )}

                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="controls-center">
                <button className="control-btn" onClick={() => skipTime(-10)} title="Skip -10s">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 8L14 12L10 16V8Z" fill="white"/>
                  </svg>
                  <span className="skip-text">10</span>
                </button>

                {/* Bookmark Button - Opens Notes Tab */}
                <button className="control-btn bookmark-btn" onClick={handleAddBookmark} title="Add Note at Current Time">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M6 3C5.44772 3 5 3.44772 5 4V19L11 16L17 19V4C17 3.44772 16.5523 3 16 3H6Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>

                <button className="control-btn" onClick={() => skipTime(10)} title="Skip +10s">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 8L10 12L14 16V8Z" fill="white"/>
                  </svg>
                  <span className="skip-text">10</span>
                </button>
              </div>

              <div className="controls-right">
                <button className="control-btn" onClick={toggleMute} title="Mute (M)">
                  {isMuted || volume === 0 ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M16 9L22 15M22 9L16 15M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <input type="range" className="volume-slider" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange} />

                <div className="quality-menu-wrapper">
                  <button className="control-btn speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)} title="Playback Speed">
                    <span className="speed-text">{playbackSpeed}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div className="quality-dropdown">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <div key={speed} className={`quality-option ${playbackSpeed === speed ? 'active' : ''}`} onClick={() => handleSpeedChange(speed)}>
                          {speed}x
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="quality-menu-wrapper">
                  <button className="control-btn" onClick={() => setShowQualityMenu(!showQualityMenu)} title="Quality Settings">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2"/>
                      <path d="M19.4 15C19.2 15.3 19.2 15.7 19.4 16L20.6 18C20.8 18.3 20.8 18.7 20.5 19L18.5 20.5C18.2 20.7 17.8 20.7 17.5 20.5L16 19.4C15.7 19.2 15.3 19.2 15 19.4L14.5 19.6C14.2 19.7 14 20 14 20.4V22C14 22.4 13.7 22.7 13.3 22.8L10.7 22.8C10.3 22.8 10 22.5 10 22.1V20.4C10 20 9.8 19.7 9.5 19.6L9 19.4C8.7 19.2 8.3 19.2 8 19.4L6.5 20.5C6.2 20.7 5.8 20.7 5.5 20.5L3.5 19C3.2 18.7 3.2 18.3 3.4 18L4.6 16C4.8 15.7 4.8 15.3 4.6 15L4.4 14.5C4.3 14.2 4 14 3.6 14H2C1.6 14 1.3 13.7 1.2 13.3L1.2 10.7C1.2 10.3 1.5 10 1.9 10H3.6C4 10 4.3 9.8 4.4 9.5L4.6 9C4.8 8.7 4.8 8.3 4.6 8L3.5 6.5C3.3 6.2 3.3 5.8 3.5 5.5L5 3.5C5.3 3.2 5.7 3.2 6 3.4L8 4.6C8.3 4.8 8.7 4.8 9 4.6L9.5 4.4C9.8 4.3 10 4 10 3.6V2C10 1.6 10.3 1.3 10.7 1.2L13.3 1.2C13.7 1.2 14 1.5 14 1.9V3.6C14 4 14.2 4.3 14.5 4.4L15 4.6C15.3 4.8 15.7 4.8 16 4.6L17.5 3.5C17.8 3.3 18.2 3.3 18.5 3.5L20.5 5C20.8 5.3 20.8 5.7 20.6 6L19.4 8C19.2 8.3 19.2 8.7 19.4 9L19.6 9.5C19.7 9.8 20 10 20.4 10H22C22.4 10 22.7 10.3 22.8 10.7V13.3C22.8 13.7 22.5 14 22.1 14H20.4C20 14 19.7 14.2 19.6 14.5L19.4 15Z" stroke="white" strokeWidth="2"/>
                    </svg>
                  </button>
                  {showQualityMenu && (
                    <div className="quality-dropdown youtube-style">
                      <div className="quality-header">Quality</div>
                      {['Auto', '1080p', '720p', '480p', '360p'].map((q) => (
                        <div key={q} className={`quality-option ${quality === q ? 'active' : ''}`} onClick={() => handleQualityChange(q)}>
                          <span>{q}</span>
                          {quality === q && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6 12L2 8L3.4 6.6L6 9.2L12.6 2.6L14 4L6 12Z" fill="currentColor"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="control-btn" onClick={toggleFullscreen} title="Fullscreen (F)">
                  {isFullscreen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3V8H3M16 3V8H21M21 16H16V21M3 16H8V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3H3V8M21 8V3H16M16 21H21V16M3 16V21H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoPlayer;