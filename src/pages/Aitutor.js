// src/pages/Aitutor.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Newsessionmodal from '../components/Newsessionmodal';
import { useAskAIMutation } from '../store/api/authApi';

function Aitutor() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState({
    today: [],
    yesterday: []
  });
  const [activeSession, setActiveSession] = useState(null); // { chat_id, chat_name, subject }
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [askAI, { isLoading }] = useAskAIMutation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start new session from modal
  const handleNewSession = (subject, topic) => {
    // Create new session with temporary ID
    const tempSessionId = `temp-${Date.now()}`;
    const newSession = {
      chat_id: tempSessionId,
      chat_name: null,
      subject: subject,
      messages: []
    };

    // Add to sessions list immediately
    setSessions(prev => ({
      ...prev,
      today: [newSession, ...prev.today]
    }));

    // Set as active session
    setActiveSession({
      chat_id: null, // Will be updated after first API call
      chat_name: null,
      subject: subject,
      tempId: tempSessionId
    });
    setMessages([]);
    setShowModal(false);

    // If topic provided, auto-send first message (topic goes to chat, not sidebar)
    if (topic && topic.trim()) {
      setTimeout(() => {
        handleSendMessage(topic, subject);
      }, 100);
    }
  };

  // Click on existing session
  const handleSessionClick = (session) => {
    setActiveSession({
      chat_id: session.chat_id,
      chat_name: session.chat_name,
      subject: session.subject
    });
    // TODO: Load chat history from API if needed
    setMessages(session.messages || []);
  };

  // Action button click - fills input field
  const handleActionClick = (actionText) => {
    setInputText(actionText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // File upload handler
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (messageText = inputText, subject = activeSession?.subject) => {
    const textToSend = messageText || inputText;
    
    if (!textToSend.trim() && !selectedFile) return;
    if (isLoading) return;

    // Check if we have a subject for new chat
    if (!activeSession?.chat_id && !subject) {
      setShowModal(true);
      return;
    }

    // Add user message
    const newMessage = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        preview: filePreview
      } : null
    };
    setMessages(prev => [...prev, newMessage]);
    
    const questionText = textToSend;
    setInputText('');
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      // Build request payload
      const payload = {
        question: questionText,
        model: 'gpt-4o-mini',
        max_tokens: 500,
        temperature: 0.7
      };

      // New chat - requires subject
      if (!activeSession?.chat_id) {
        payload.subject = subject;
      } else {
        // Existing chat - use chat_id
        payload.chat_id = activeSession.chat_id;
      }

      const result = await askAI(payload).unwrap();

      // Update active session with chat_id from response
      if (result.chat_id) {
        const updatedSession = {
          chat_id: result.chat_id,
          chat_name: result.chat_name,
          subject: subject || activeSession?.subject
        };
        setActiveSession(updatedSession);

        // Update the temp session with real chat_id
        if (result.is_new_chat && activeSession?.tempId) {
          setSessions(prev => ({
            ...prev,
            today: prev.today.map(s => 
              s.chat_id === activeSession.tempId 
                ? { ...s, chat_id: result.chat_id, chat_name: result.chat_name, messages: [...messages, newMessage] }
                : s
            )
          }));
        }
      }

      // Add AI response
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: result.answer || 'Sorry, I could not process your question.',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('AI API Error:', error);
      
      // Get actual error message from API
      let errorText = 'Sorry, there was an error processing your question. Please try again.';
      
      // Check for specific error types
      if (error.status === 429) {
        // Actual rate limit error
        errorText = 'You have reached your daily chat limit. Upgrade to Premium for unlimited AI Tutor access or wait until tomorrow for your limit to reset.';
      } else if (error.status === 422) {
        // Validation error - check for subject
        if (error.data?.errors?.subject) {
          errorText = 'Please select a subject to start a new session.';
          setShowModal(true);
        } else {
          // Other validation error - show actual message
          errorText = error.data?.message || 'Validation error. Please check your input.';
        }
      } else if (error.data?.message) {
        // Show actual API error message
        errorText = error.data.message;
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: errorText,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="ai-tutor-layout">
        {/* Left Sidebar - Sessions */}
        <div className="ai-sessions-sidebar">
          <button className="btn-new-session" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Session
          </button>

          <div className="sessions-list">
            {sessions.today.length > 0 && (
              <div className="session-group">
                <div className="session-group-title">TODAY</div>
                {sessions.today.map((session, index) => (
                  <div
                    key={session.chat_id || `today-${index}`}
                    className={`session-item ${
                      (activeSession?.chat_id && activeSession.chat_id === session.chat_id) ||
                      (activeSession?.tempId && activeSession.tempId === session.chat_id)
                        ? 'active' : ''
                    }`}
                    onClick={() => handleSessionClick(session)}
                  >
                    {session.subject}
                  </div>
                ))}
              </div>
            )}

            {sessions.yesterday.length > 0 && (
              <div className="session-group">
                <div className="session-group-title">YESTERDAY</div>
                {sessions.yesterday.map((session, index) => (
                  <div
                    key={session.chat_id || `yesterday-${index}`}
                    className={`session-item ${
                      (activeSession?.chat_id && activeSession.chat_id === session.chat_id) ||
                      (activeSession?.tempId && activeSession.tempId === session.chat_id)
                        ? 'active' : ''
                    }`}
                    onClick={() => handleSessionClick(session)}
                  >
                    {session.subject}
                  </div>
                ))}
              </div>
            )}

            {sessions.today.length === 0 && sessions.yesterday.length === 0 && (
              <div className="sessions-empty">
                <p>No sessions yet</p>
                <p className="sessions-empty-hint">Start a new session to begin!</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="ai-chat-area">
          {/* Session Header */}
          {activeSession && (
            <div className="ai-chat-header">
              <div className="chat-header-info">
                <span className="chat-subject-badge">{activeSession.subject}</span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="ai-chat-messages-container">
            {!activeSession ? (
              <div className="ai-empty-state">
                <div className="empty-state-content">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#F5F5F5"/>
                    <path d="M32 20v24M20 32h24" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <h3>Start a new session</h3>
                  <p>Select a subject and start learning with AI Tutor!</p>
                  <button className="btn-start-learning" onClick={() => setShowModal(true)}>
                    Start Learning
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="ai-empty-state">
                <div className="empty-state-content">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#F5F5F5"/>
                    <path d="M32 20v24M20 32h24" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <h3>Ask your first question</h3>
                  <p>I'm ready to help you learn {activeSession.subject}!</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div key={message.id} className={`ai-message ${message.type} ${message.isError ? 'error-message' : ''}`}>
                    {message.time && (
                      <div className="message-time">{message.time}</div>
                    )}
                    <div className="message-bubble">
                      {message.file && (
                        <div className="message-file-attachment">
                          {message.file.preview ? (
                            <img src={message.file.preview} alt={message.file.name} className="message-file-image" />
                          ) : (
                            <div className="message-file-info">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 2H12L16 6V18H4V2Z" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5"/>
                              </svg>
                              <span>{message.file.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}

            {isLoading && (
              <div className="ai-message ai">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Bottom Input Area */}
          <div className="ai-input-wrapper">
            {/* File Preview */}
            {selectedFile && (
              <div className="file-preview-bar">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="file-preview-thumb" />
                ) : (
                  <div className="file-preview-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 2H12L16 6V18H4V2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
                <span className="file-preview-name">{selectedFile.name}</span>
                <button className="file-preview-remove" onClick={handleRemoveFile}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {activeSession && (
              <div className="ai-action-buttons">
                <button 
                  className="ai-action-btn" 
                  onClick={() => handleActionClick('Explain step-by-step')}
                >
                  Explain step-by-step
                </button>
                <button 
                  className="ai-action-btn" 
                  onClick={() => handleActionClick('Give me a hint')}
                >
                  Give me a hint
                </button>
                <button 
                  className="ai-action-btn" 
                  onClick={() => handleActionClick('Show solution')}
                >
                  Show solution
                </button>
              </div>
            )}

            {/* Input Field */}
            <div className="ai-input-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
              />
              
              <button className="ai-attach-btn" onClick={handleAttachClick}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <input
                ref={inputRef}
                type="text"
                className="ai-input-field"
                placeholder={activeSession ? "Type your question here..." : "Start a new session to ask questions..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !activeSession}
              />
              
              <button 
                className="ai-send-btn" 
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputText.trim() && !selectedFile) || !activeSession}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <p className="ai-disclaimer">
              AI Tutor can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>

        {/* Right Sidebar - Info */}
        <div className="ai-info-sidebar">
          <div className="ai-usage-box">
            <div className="usage-row">
              <div className="usage-label">Chats used:</div>
              <div className="usage-value">3/5</div>
            </div>
            <div className="usage-row">
              <div className="usage-reset">Reset in:</div>
              <div className="usage-value">02:58:00</div>
            </div>
          </div>

          <div className="relevant-courses-section">
            <h3 className="ai-tutor-title">Relevant Courses</h3>
            <div className="courses-list">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="course-item-small">
                  <span className="course-badge-small">Biology</span>
                  <h4 className="course-title-small">Foundation of UX Strategy</h4>
                  <p className="course-meta-small">Form 5 • 24 Lessons</p>
                  <div
                    className="course-instructor"
                    onClick={() => navigate('/tutor-profile/Siti%20Sarah')}
                    role="button"
                    style={{ cursor: 'pointer' }}
                  >
                    <img src="/assets/images/icons/Ellipse 2.svg" alt="Instructor" className="course-instructor-avatar" />
                    <span className="course-instructor-name">Siti Sarah</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Newsessionmodal
          onClose={() => setShowModal(false)}
          onStartSession={handleNewSession}
        />
      )}
    </>
  );
}

export default Aitutor;