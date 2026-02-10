// src/pages/Aitutor.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Newsessionmodal from '../components/Newsessionmodal';
import AiLimitModal from '../components/AiLimitModal';
import TypingMessage from '../components/TypingMessage';
import ClearChatButton from '../components/ClearChatButton';
import { useAskAIMutation } from '../store/api/authApi';
import { useAiLimit } from '../hooks/useAiLimit';
import { showWarning } from '../utils/toast';

function Aitutor() {
  const navigate = useNavigate();
  
  // ✅ FIX 1: Get current user for user-specific storage
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  };
  
  const currentUser = getCurrentUser();
  const userId = currentUser?.id;
  
  // ✅ FIX 2: User-specific storage keys (different for each user)
  const CHAT_STORAGE_KEY = `ai_tutor_chat_${userId || 'guest'}`;
  const SESSION_STORAGE_KEY = `ai_tutor_session_${userId || 'guest'}`;
  const [showModal, setShowModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const {
    canAskQuestion,
    usedQuestions,
    maxQuestions,
    remainingQuestions,
    hoursUntilReset,
    recordQuestion,
    isPremium,
  } = useAiLimit();
  const [sessions, setSessions] = useState({
    today: [],
    yesterday: []
  });
  const [activeSession, setActiveSession] = useState(null); // { chat_id, chat_name, subject }
  const [messages, setMessages] = useState([]);
  const [typingMessageId, setTypingMessageId] = useState(null); // Track which message is currently typing
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [askAI, { isLoading }] = useAskAIMutation();

  // ✅ FIX 3: Load messages ONLY for current user
  useEffect(() => {
    // If no user logged in, clear everything
    if (!userId) {
      setMessages([]);
      setActiveSession(null);
      return;
    }

    // Load chat history for THIS user only
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
    
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setActiveSession(parsed);
      } catch (e) {
        console.error('Failed to parse saved session');
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, [userId, CHAT_STORAGE_KEY, SESSION_STORAGE_KEY]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Save active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    }
  }, [activeSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-show limit modal when limit is reached (e.g. after 5th question is recorded)
  useEffect(() => {
    if (!isPremium && usedQuestions >= maxQuestions) {
      setShowLimitModal(true);
    }
  }, [usedQuestions, maxQuestions, isPremium]);

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

    // ✅ FIX 5: Validate subject is selected
    if (!activeSession?.chat_id && !subject) {
      setShowModal(true);
      showWarning('Please select a subject to start a new chat');
      return;
    }

    if (!canAskQuestion) {
      setShowLimitModal(true);
      showWarning('Daily question limit reached');
      return;
    }

    const recorded = recordQuestion();
    if (!recorded && !isPremium) {
      setShowLimitModal(true);
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

      // Add AI response with typing effect
      const aiResponseId = Date.now() + 1;
      const aiResponse = {
        id: aiResponseId,
        type: 'ai',
        text: result.answer || 'Sorry, I could not process your question.',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isTyping: true
      };
      setMessages(prev => [...prev, aiResponse]);
      setTypingMessageId(aiResponseId);

    } catch (error) {
      
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

  // Clear chat messages
  const handleClearChat = () => {
    setMessages([]);
    setActiveSession(null);
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
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
              {!isPremium && (
                <div className={`questions-remaining ${remainingQuestions === 0 ? 'exhausted' : ''}`}>
                  <span className="remaining-icon" aria-hidden>💬</span>
                  <span>{remainingQuestions}/{maxQuestions} questions remaining today</span>
                </div>
              )}
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
                      <p>
                        {message.type === 'ai' && message.isTyping && message.id === typingMessageId ? (
                          <TypingMessage 
                            text={message.text} 
                            onComplete={() => {
                              // Mark typing as complete
                              setTypingMessageId(null);
                              setMessages(prev => prev.map(m => 
                                m.id === message.id ? { ...m, isTyping: false } : m
                              ));
                            }}
                          />
                        ) : (
                          message.text
                        )}
                      </p>
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
                placeholder={
                  !activeSession
                    ? 'Start a new session to ask questions...'
                    : !canAskQuestion
                    ? 'Daily limit reached. Upgrade for unlimited access.'
                    : 'Type your question here...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !activeSession || (!canAskQuestion && !isPremium)}
              />

              <button
                className="ai-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputText.trim() && !selectedFile) || !activeSession || (!canAskQuestion && !isPremium)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {!isPremium && remainingQuestions <= 2 && remainingQuestions > 0 && (
              <p className="limit-warning">
                Only {remainingQuestions} question{remainingQuestions !== 1 ? 's' : ''} remaining today
              </p>
            )}
            <p className="ai-disclaimer">
              AI Tutor can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>

        {/* Right Sidebar - Info */}
        <div className="ai-info-sidebar">
          <div className="ai-usage-box">
            <div className="usage-row">
              <div className="usage-label">Questions used:</div>
              <div className="usage-value">{usedQuestions}/{maxQuestions}</div>
            </div>
            <div className="usage-row">
              <div className="usage-reset">Reset in:</div>
              <div className="usage-value">{hoursUntilReset}h</div>
            </div>
          </div>

          <div className="relevant-courses-section">
            <h3 className="ai-tutor-title">Relevant Courses</h3>
            {/* ✅ FIX 4: Remove fake courses - show empty state or API data */}
            <div className="courses-list">
              <div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                color: '#6B7280',
                fontSize: '14px'
              }}>
                <p>Browse courses related to your selected subject</p>
                <button 
                  onClick={() => navigate('/student/browse-courses')}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    background: '#9FE870',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#163300',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Browse Courses
                </button>
              </div>
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

      <AiLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        usedQuestions={usedQuestions}
        maxQuestions={maxQuestions}
        hoursUntilReset={hoursUntilReset}
      />
    </>
  );
}

export default Aitutor;