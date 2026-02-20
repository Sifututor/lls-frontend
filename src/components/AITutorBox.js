import React, { useState, useRef, useEffect } from 'react';
import { useAiLimit } from '../hooks/useAiLimit';
import AiLimitModal from './AiLimitModal';
import { useAskAIMutation } from '../store/api/authApi';
import { showError } from '../utils/toast';

function AITutorBox({ aiChatData = {}, courseTitle, lessonTitle, subject: subjectProp }) {
  const [messages, setMessages] = useState(aiChatData?.messages || []);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [chatId, setChatId] = useState(null);
  const fileInputRef = useRef(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const [askAI, { isLoading: isAsking }] = useAskAIMutation();

  const suggestions = aiChatData?.suggestions || [
    'Explain this concept',
    'Give me an example',
    'How do I solve this?'
  ];

  const subject = subjectProp || [courseTitle, lessonTitle].filter(Boolean).join(' – ') || 'General';

  const {
    canAskQuestion,
    usedQuestions,
    maxQuestions,
    hoursUntilReset,
    recordQuestion,
    isPremium,
  } = useAiLimit();

  useEffect(() => {
    if (!isPremium && usedQuestions >= maxQuestions) {
      setShowLimitModal(true);
    }
  }, [usedQuestions, maxQuestions, isPremium]);

  const handleSendMessage = async () => {
    if (!isPremium && !canAskQuestion) {
      setShowLimitModal(true);
      return;
    }

    const text = inputText.trim();
    if (!text && !selectedFile) return;

    if (!isPremium) {
      const recorded = recordQuestion();
      if (!recorded) {
        setShowLimitModal(true);
        return;
      }
    }

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: text || (selectedFile ? ' [Image attached]' : '')
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSelectedFile(null);
    setPreviewUrl('');

    const aiPlaceholder = {
      id: Date.now() + 1,
      type: 'ai',
      text: 'Thinking...'
    };
    setMessages((prev) => [...prev, aiPlaceholder]);

    try {
      const payload = {
        question: text,
        model: 'gpt-4o-mini',
        max_tokens: 500,
        temperature: 0.7
      };
      if (chatId) {
        payload.chat_id = chatId;
      } else {
        payload.subject = subject;
      }

      const result = await askAI(payload).unwrap();
      const res = result?.data ?? result;

      if (res?.chat_id) setChatId(res.chat_id);

      const answer = res?.answer || result?.answer || 'Sorry, I could not process your question.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholder.id ? { ...m, text: answer } : m
        )
      );
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || 'Failed to get AI response. Please try again.';
      if (err?.status === 429) {
        setShowLimitModal(true);
      } else {
        showError(errMsg);
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholder.id
            ? { ...m, text: err?.status === 429 ? 'Daily limit reached. Upgrade for unlimited access.' : errMsg }
            : m
        )
      );
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
          {suggestions.map((suggestion, index) => (
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
          placeholder={canAskQuestion ? (isAsking ? "Getting answer..." : "Type your question here...") : "Daily limit reached. Upgrade for unlimited access."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isAsking && handleSendMessage()}
          disabled={!canAskQuestion || isAsking}
        />

        <button className="ai-tutor-send-btn" onClick={handleSendMessage} disabled={!canAskQuestion || isAsking}>
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
          {usedQuestions}/{maxQuestions} questions today
          {usedQuestions >= maxQuestions && (
            <span style={{ display: 'block', marginTop: '4px' }}>
              Daily limit reached. <button type="button" onClick={() => setShowLimitModal(true)} style={{ background: 'none', border: 'none', color: '#10B981', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Upgrade</button> for unlimited.
            </span>
          )}
        </div>
      )}

      {isPremium && (
        <p className="ai-tutor-footer">
          Unlimited questions (Premium)
        </p>
      )}

      <AiLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        usedQuestions={usedQuestions}
        maxQuestions={maxQuestions}
        hoursUntilReset={hoursUntilReset}
      />
    </div>
  );
}

export default AITutorBox;