// src/components/CourseTabs.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getFullFileUrl } from '../utils/fileUrl';
import { showError, showSuccess } from '../utils/toast';
import { usePremium } from '../hooks/usePremium';
import { useGetLessonNotesQuery, useAddBookmarkMutation, useDeleteNoteMutation, useCreateLessonNoteMutation } from '../store/api/authApi';

function CourseTabs({
  currentLesson,
  downloadsData = [],
  lessonId,
  courseSlug,
  bookmarkTimestamp,
  onBookmarkHandled,
  getVideoCurrentTime,
  isLiveClassView = false,
  notesFromCourse,
  onNoteAdded,
}) {
  const { isPremium } = usePremium();
  const [activeTab, setActiveTab] = useState('lesson');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('00:00:00');
  const [currentTimestampSeconds, setCurrentTimestampSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const noteInputRef = useRef(null);
  // Freeze timestamp for the note being added (so it doesn't change when video plays)
  const frozenTimestampRef = useRef({ seconds: 0, formatted: '00:00:00' });

  // When parent passes notes from course (video_bookmarks), use those; else fetch GET /lesson/:id/notes
  const useCourseNotes = Array.isArray(notesFromCourse);
  const { data: notesResponse, isLoading: notesLoading, refetch: refetchNotes, isError: notesError } = useGetLessonNotesQuery(lessonId, { skip: !lessonId || useCourseNotes });
  const notesErrorShownRef = React.useRef(false);
  const [addBookmark, { isLoading: addBookmarkLoading }] = useAddBookmarkMutation();
  const [createLessonNote] = useCreateLessonNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  // Format seconds to HH:MM:SS (API may return timestamp as number e.g. 425)
  const formatSeconds = (sec) => {
    if (sec == null || isNaN(sec)) return '00:00';
    const s = Math.floor(Number(sec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // When API fails (404/500), treat as empty; show non-blocking toast once
  React.useEffect(() => {
    if (notesError && lessonId && !useCourseNotes && !notesErrorShownRef.current) {
      notesErrorShownRef.current = true;
      toast.info('Notes list unavailable. You can still add notes with the bookmark.', { autoClose: 4000 });
    }
  }, [notesError, lessonId, useCourseNotes]);
  const rawNotesFromApi = (notesError ? [] : (
    notesResponse?.notes ??
    notesResponse?.data?.notes ??
    notesResponse?.data?.bookmarks ??
    notesResponse?.data?.data ??
    notesResponse?.data?.items ??
    (Array.isArray(notesResponse?.data) ? notesResponse.data : null) ??
    notesResponse?.bookmarks ??
    (Array.isArray(notesResponse) ? notesResponse : null) ??
    []
  ));
  const rawNotes = useCourseNotes ? notesFromCourse : rawNotesFromApi;
  const notes = Array.isArray(rawNotes) ? rawNotes.map((n) => {
    const secs = n.timestamp_seconds ?? n.timestamp ?? 0;
    const formatted = n.timestamp_formatted || (typeof n.timestamp === 'number' ? formatSeconds(n.timestamp) : (n.timestamp || formatSeconds(secs)));
    return {
      id: n.id,
      timestamp: formatted,
      timestamp_seconds: typeof secs === 'number' ? secs : parseInt(secs, 10) || 0,
      content: n.content ?? n.note
    };
  }) : [];

  useEffect(() => {
    if (bookmarkTimestamp && lessonId) {
      const secs = typeof bookmarkTimestamp.timestamp === 'number' ? bookmarkTimestamp.timestamp : parseInt(bookmarkTimestamp.timestamp, 10) || 0;
      const formatted = bookmarkTimestamp.timestampFormatted || '00:00:00';
      frozenTimestampRef.current = { seconds: secs, formatted };
      setCurrentTimestamp(formatted);
      setCurrentTimestampSeconds(secs);
      setActiveTab('notes');
      setShowNoteInput(true);
      setTimeout(() => noteInputRef.current?.focus(), 100);
      if (onBookmarkHandled) onBookmarkHandled();
    }
  }, [bookmarkTimestamp, onBookmarkHandled]);

  const handleAddNote = () => {
    if (isLiveClassView) {
      toast.info('Notes are not available for live class sessions yet.');
      return;
    }
    if (!isPremium) {
      toast.warning('Notes and bookmarks are a Premium feature. Upgrade to access!');
      return;
    }
    if (getVideoCurrentTime) {
      const { seconds, formatted } = getVideoCurrentTime();
      frozenTimestampRef.current = { seconds, formatted };
      setCurrentTimestamp(formatted);
      setCurrentTimestampSeconds(seconds);
    }
    setShowNoteInput(true);
    setTimeout(() => noteInputRef.current?.focus(), 100);
  };

  const handleSubmitNote = async () => {
    if (!noteText.trim() || !lessonId) return;
    if (!isPremium) {
      toast.warning('Notes and bookmarks are a Premium feature.');
      return;
    }
    const timestampToSend = frozenTimestampRef.current.seconds ?? currentTimestampSeconds;
    setIsSaving(true);
    try {
      await addBookmark({
        lessonId: Number(lessonId),
        timestamp: timestampToSend,
        note: noteText.trim()
      }).unwrap();
      setNoteText('');
      setShowNoteInput(false);
      setSaveSuccess(true);
      showSuccess('Note saved successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
      if (lessonId && !useCourseNotes) refetchNotes();
      onNoteAdded?.();
    } catch (err) {
      const msg = err?.data?.message || err?.message || '';
      if (msg.includes('404') || msg.includes('bookmark') || err?.status === 404) {
        try {
          await createLessonNote({
            lessonId: Number(lessonId),
            timestamp_seconds: timestampToSend,
            content: noteText.trim()
          }).unwrap();
          setNoteText('');
          setShowNoteInput(false);
          setSaveSuccess(true);
          showSuccess('Note saved successfully!');
          setTimeout(() => setSaveSuccess(false), 3000);
          if (lessonId && !useCourseNotes) refetchNotes();
          onNoteAdded?.();
        } catch (e2) {
          showError(e2?.data?.message || 'Failed to save note.');
        }
      } else {
        showError(msg || 'Failed to save note.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardNote = () => {
    setNoteText('');
    setShowNoteInput(false);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId).unwrap();
      showSuccess('Note deleted.');
    } catch (err) {
      showError(err?.data?.message || 'Failed to delete note.');
    }
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
          {isLiveClassView ? (
            <div className="empty-notes">
              <p>Notes are not available for live class sessions yet.</p>
            </div>
          ) : (
          <>
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
            {notesLoading ? (
              <div className="empty-notes">
                <p>Loading notes...</p>
              </div>
            ) : notes.length > 0 ? (
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
          </>
          )}
        </div>

        {/* Downloads Tab */}
        <div className={`tab-content ${activeTab === 'downloads' ? 'active' : ''}`}>
          <div className="downloads-list">
            {isLiveClassView ? (
              <div className="empty-downloads">
                <p>Downloads are not available for live class sessions yet.</p>
              </div>
            ) : downloadsData.length > 0 ? (
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