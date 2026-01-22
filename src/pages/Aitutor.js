// src/pages/Aitutor.js
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Newsessionmodal from '../components/Newsessionmodal';
import { useAskAIMutation } from '../store/api/authApi';
import { 
  sessionsData, 
  relevantCoursesData, 
  usageData 
} from '../data/Aitutordata';

function Aitutor() {
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState(sessionsData);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatsUsed, setChatsUsed] = useState(usageData.chatsUsed);
  const [resetTime, setResetTime] = useState(usageData.resetTime);
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

  const handleNewSession = (subject, topic) => {
    console.log('Starting new session:', subject, topic);
    setShowModal(false);
  };

  const handleSessionClick = (sessionId) => {
    setActiveSessionId(sessionId);
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
      
      // Create preview for images
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

  const handleSendMessage = async () => {
    if ((inputText.trim() || selectedFile) && !isLoading) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText,
        file: selectedFile ? {
          name: selectedFile.name,
          type: selectedFile.type,
          preview: filePreview
        } : null
      };
      setMessages([...messages, newMessage]);
      
      const questionText = inputText;
      setInputText('');
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      try {
        const result = await askAI({
          question: questionText,
          model: 'gpt-4o-mini',
          max_tokens: 500,
          temperature: 0.7
        }).unwrap();

        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: result.answer || 'Sorry, I could not process your question.',
          time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          })
        };
        setMessages(prev => [...prev, aiResponse]);
        setChatsUsed(prev => prev + 1);

      } catch (error) {
        console.error('AI API Error:', error);
        
        const isLimitError = error.status === 429 || 
                            error.data?.message?.includes('limit') ||
                            error.data?.message?.includes('exceeded');
        
        const errorMessage = {
          id: messages.length + 2,
          type: 'ai',
          text: isLimitError 
            ? 'You have reached your daily chat limit. Upgrade to Premium for unlimited AI Tutor access or wait until tomorrow for your limit to reset.'
            : 'Sorry, there was an error processing your question. Please try again.',
          time: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <TopNavbar title="AI Tutor" />

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
              <div className="session-group">
                <div className="session-group-title">TODAY</div>
                {sessions.today.map(session => (
                  <div
                    key={session.id}
                    className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    {session.title}
                  </div>
                ))}
              </div>

              <div className="session-group">
                <div className="session-group-title">Yesterday</div>
                {sessions.yesterday.map(session => (
                  <div
                    key={session.id}
                    className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    {session.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="ai-chat-area">
            {/* Messages Container - Scrollable */}
            <div className="ai-chat-messages-container">
              {messages.length === 0 ? (
                <div className="ai-empty-state">
                  <div className="empty-state-content">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="32" fill="#F5F5F5"/>
                      <path d="M32 20v24M20 32h24" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <h3>Start a conversation</h3>
                    <p>Ask me anything! I'm here to help you learn.</p>
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
                        {/* Show file attachment if exists */}
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

              {/* Input Field */}
              <div className="ai-input-area">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                />
                
                {/* Attach button */}
                <button className="ai-attach-btn" onClick={handleAttachClick}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  className="ai-input-field"
                  placeholder="Type your question here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  disabled={isLoading}
                />
                
                <button 
                  className="ai-send-btn" 
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputText.trim() && !selectedFile)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Disclaimer */}
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
                <div className="usage-value">
                  {chatsUsed}/{usageData.totalChats}
                </div>
              </div>

              <div className="usage-row">
                <div className="usage-reset">Reset in:</div>
                <div className="usage-value">{resetTime}</div>
              </div>
            </div>

            <div className="relevant-courses-section">
              <h3 className="ai-tutor-title">Relevant Courses</h3>
              <div className="courses-list">
                {relevantCoursesData.map(course => (
                  <div key={course.id} className="course-item-small">
                    <span className="course-badge-small">{course.badge}</span>
                    <h4 className="course-title-small">{course.title}</h4>
                    <p className="course-meta-small">{course.meta}</p>
                    <div className="course-instructor">
                      <img src="/assets/images/icons/Ellipse 2.svg" alt="Mr. Ahmad" className="course-instructor-avatar" />
                      <span className="course-instructor-name">{course.instructor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

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