import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';

function AITutorBox({ aiChatData }) {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [messages, setMessages] = useState(aiChatData.messages);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const maxFreeQuestions = 5;
  
  const canAskQuestion = isPremium || questionsUsed < maxFreeQuestions;

  const handleSendMessage = () => {
    if (!canAskQuestion) {
      navigate('/student/subscription');
      return;
    }
    
    if (inputText.trim() || selectedFile) {
      if (!isPremium) {
        setQuestionsUsed(prev => prev + 1);
      }
      
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setSelectedFile(null);
      setPreviewUrl('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: "I'm processing your question. Let me help you with that..."
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  return (
    <div className="ai-tutor-box">
      <div className="ai-tutor-header">
        <div className="ai-tutor-avatar">AI</div>
        <div className="ai-tutor-info">
          <h4 className="ai-tutor-title course">AI tutor</h4>
          <p className="ai-tutor-subtitle">Always here to help!</p>
        </div>
      </div>

      <p className="ai-tutor-message">
        Stuck on a problem? Ask me anything about your current courses.
      </p>

      {/* Chat Messages Container */}
      <div className="ai-chat-messages" id="aiChatMessages">
        {messages.map((message) => (
          <div key={message.id} className={`${message.type}-message`}>
            <div className={`${message.type}-message-bubble`}>{message.text}</div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="ai-tutor-suggestions">
        <div className="suggestion-title">Suggestions</div>
        <div className="suggestion-pills">
          {aiChatData.suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-pill"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Wrapper */}
      <div className="ai-tutor-input-wrapper">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Attach Button */}
        <button className="ai-input-attach-btn" onClick={handleAttachClick}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 6V14M6 10H14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <input
          type="text"
          className="ai-tutor-input"
          placeholder={canAskQuestion ? "Type your question here..." : "Upgrade for more questions"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={!canAskQuestion}
        />

        <button className="ai-tutor-send-btn" onClick={handleSendMessage} disabled={!canAskQuestion}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="ai-file-preview" style={{ display: 'flex' }}>
          <img src={previewUrl} alt="Preview" id="aiPreviewImage" />
          <button className="btn-remove-file" onClick={handleRemoveFile}>
            Remove
          </button>
        </div>
      )}

      {/* Show quota for free users */}
      {!isPremium && (
        <div className="ai-quota" style={{ 
          padding: '12px', 
          background: '#FEF3C7', 
          borderRadius: '8px', 
          marginTop: '12px',
          fontSize: '14px',
          color: '#92400E'
        }}>
          {questionsUsed}/{maxFreeQuestions} questions today
          {questionsUsed >= maxFreeQuestions && (
            <span style={{ display: 'block', marginTop: '4px' }}>
              Daily limit reached. <a href="/student/subscription" onClick={(e) => { e.preventDefault(); navigate('/student/subscription'); }} style={{ color: '#10B981', textDecoration: 'underline' }}>Upgrade</a> for unlimited.
            </span>
          )}
        </div>
      )}
      
      {isPremium && (
        <p className="ai-tutor-footer">
          Unlimited questions (Premium)
        </p>
      )}
    </div>
  );
}

export default AITutorBox;