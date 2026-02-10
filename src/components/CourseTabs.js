// src/components/CourseTabs.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getFullFileUrl } from '../utils/fileUrl';
import { showError } from '../utils/toast';
import { usePremium } from '../hooks/usePremium';

function CourseTabs({ 
  currentLesson, 
  notesData = [], 
  downloadsData = [],
  lessonId,
  bookmarkTimestamp,
  onBookmarkHandled
}) {
  // ✅ Premium check for notes and downloads
  const { isPremium } = usePremium();
  const [activeTab, setActiveTab] = useState('lesson');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [notes, setNotes] = useState(notesData);
  const [noteText, setNoteText] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('00:00:00');
  const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const noteInputRef = useRef(null);

  useEffect(() => {
    if (bookmarkTimestamp) {
      setActiveTab('notes');
      setCurrentTimestamp(bookmarkTimestamp.timestampFormatted);
      setCurrentTimestampSeconds(bookmarkTimestamp.timestamp);
      setShowNoteInput(true);
      
      setTimeout(() => {
        if (noteInputRef.current) {
          noteInputRef.current.focus();
        }
      }, 100);
      
      if (onBookmarkHandled) {
        onBookmarkHandled();
      }
    }
  }, [bookmarkTimestamp, onBookmarkHandled]);

  const handleAddNote = () => {
    // ✅ Premium gate for notes/bookmarks
    if (!isPremium) {
      toast.warning('Notes and bookmarks are a Premium feature. Upgrade to access!');
      return;
    }
    
    setShowNoteInput(true);
    setTimeout(() => {
      if (noteInputRef.current) {
        noteInputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmitNote = async () => {
    if (noteText.trim()) {
      setIsSaving(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote = {
        id: Date.now(),
        timestamp: currentTimestamp,
        timestamp_seconds: currentTimestampSeconds,
        content: noteText.trim()
      };
      setNotes([newNote, ...notes]);
      
      setNoteText('');
      setShowNoteInput(false);
      setIsSaving(false);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDiscardNote = () => {
    setNoteText('');
    setShowNoteInput(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleDownload = (download) => {
    // ✅ Premium gate for downloads
    if (!isPremium) {
      toast.warning('Downloads are a Premium feature. Upgrade to access course materials!');
      return;
    }
    
    const rawPath = download.url || download.path || download.file_path || download.fullName || download.file;
    const fullUrl = getFullFileUrl(rawPath);
    if (fullUrl) {
      window.open(fullUrl, '_blank');
    } else {
      showError('Download link not available');
    }
  };

  return (
    <div className="course-details-tabs">
      {/* Tabs Navigation */}
      <div className="course-tabs">
        <button
          className={`tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
          onClick={() => setActiveTab('lesson')}
        >
          Lesson
        </button>
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          My Notes
        </button>
        <button
          className={`tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
          onClick={() => setActiveTab('downloads')}
        >
          Downloads
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="tabs-container">
        {/* Lesson Tab */}
        <div className={`tab-content ${activeTab === 'lesson' ? 'active' : ''}`}>
          <div className="lesson-content">
            <h3 className="lesson-title">{currentLesson?.title || 'No lesson selected'}</h3>
            <p className="lesson-description">
              {currentLesson?.description || 'No description available for this lesson.'}
            </p>
            <div className="lesson-meta">
              <span className="lesson-updated">{currentLesson?.lastUpdated || 'Last updated recently'}</span>
              <span className="lesson-language">{currentLesson?.language || 'English'}</span>
            </div>
          </div>
        </div>

        {/* My Notes Tab */}
        <div className={`tab-content ${activeTab === 'notes' ? 'active' : ''}`}>
          {/* Success Message */}
          {saveSuccess && (
            <div className="note-success-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#22C55E"/>
              </svg>
              <span>Note saved successfully!</span>
            </div>
          )}

          {/* Add Note Section */}
          <div className="add-note-section">
            <button 
              className="btn-add-note" 
              onClick={handleAddNote}
              title={!isPremium ? 'Premium feature' : ''}
            >
              {!isPremium && '🔒 '}
              Add Note at <span id="currentTimestamp">{currentTimestamp}</span>
            </button>

            {/* Note Input Box */}
            {showNoteInput && (
              <div className="note-input-box">
                <textarea
                  ref={noteInputRef}
                  className="note-textarea"
                  placeholder="Add details here"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="note-actions">
                  <button className="btn-note-discard" onClick={handleDiscardNote} disabled={isSaving}>
                    Discard
                  </button>
                  <button 
                    className="btn-note-submit" 
                    onClick={handleSubmitNote}
                    disabled={isSaving || !noteText.trim()}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-small"></span>
                        Saving...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notes List */}
          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-timestamp">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#9FE870" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 8.5" stroke="#9FE870" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {note.timestamp}
                  </div>
                  <div className="note-content">{note.content || note.note}</div>
                  <button 
                    className="note-delete-btn"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete note"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-notes">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M8 8H32L40 16V40C40 41.1046 39.1046 42 38 42H10C8.89543 42 8 41.1046 8 40V8Z" stroke="#D1D5DB" strokeWidth="2"/>
                  <path d="M32 8V16H40" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 24H32M16 32H28" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>No notes yet</p>
                <span>Click the bookmark button on the video or "Add Note" to create your first note!</span>
              </div>
            )}
          </div>
        </div>

        {/* Downloads Tab */}
        <div className={`tab-content ${activeTab === 'downloads' ? 'active' : ''}`}>
          <div className="downloads-list">
            {downloadsData.length > 0 ? (
              downloadsData.map((download, index) => (
                <div key={download.id || index} className="download-item">
                  <div className="download-info">
                    <div className="download-name" title={download.displayName || download.name}>
                      {download.displayName || download.name}
                    </div>
                    <div className="download-size">
                      {download.chapterTitle ? `PDF • ${download.chapterTitle}` : download.size}
                    </div>
                  </div>
                  <button
                    className="btn-download"
                    onClick={() => handleDownload(download)}
                    title={!isPremium ? 'Premium feature' : `Download ${download.displayName || download.name}`}
                    style={!isPremium ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  >
                    {!isPremium && '🔒 '}
                    <img src="/assets/images/icons/download-button.png" alt="Download" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-downloads">
                <p>No downloadable materials for this course.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseTabs;