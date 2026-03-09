/**
 * Modal to view question detail and post answer/reply
 */
import React, { useState } from 'react';
import {
  useGetTutorVideoQADetailQuery,
  usePostTutorVideoQAAnswerMutation,
  useUpdateTutorVideoQAAnswerMutation,
  usePostTutorVideoQAReplyMutation,
} from '../../store/api/authApi';
import { showSuccess, showError } from '../../utils/toast';
import { SectionLoader } from '../ui/LoadingSpinner';

function formatDate(str) {
  if (!str) return '';
  try {
    const d = new Date(str);
    return d.toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return str;
  }
}

function VideoQAAnswerModal({ questionId, onClose }) {
  const [answerText, setAnswerText] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editText, setEditText] = useState('');

  const { data, isLoading, isError } = useGetTutorVideoQADetailQuery(questionId, { skip: !questionId });
  const [postAnswer, { isLoading: postingAnswer }] = usePostTutorVideoQAAnswerMutation();
  const [updateAnswer, { isLoading: updatingAnswer }] = useUpdateTutorVideoQAAnswerMutation();
  const [postReply, { isLoading: postingReply }] = usePostTutorVideoQAReplyMutation();

  const question = data?.success ? data?.data : data;
  const answers = question?.answers ?? [];

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      showError('Please enter your answer.');
      return;
    }
    try {
      await postAnswer({ questionId, answer_text: answerText.trim() }).unwrap();
      showSuccess('Answer posted successfully!');
      setAnswerText('');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to post answer.');
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    const text = replyToId === parentId ? replyText : '';
    if (!text.trim()) {
      showError('Please enter your reply.');
      return;
    }
    try {
      await postReply({ answerId: parentId, questionId, answer_text: text.trim() }).unwrap();
      showSuccess('Reply posted!');
      setReplyToId(null);
      setReplyText('');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to post reply.');
    }
  };

  const startReply = (id) => {
    setReplyToId(id);
    setReplyText('');
    setEditingAnswerId(null);
  };
  const cancelReply = () => {
    setReplyToId(null);
    setReplyText('');
  };

  const startEdit = (a) => {
    setEditingAnswerId(a.id);
    setEditText(a.answer_text || '');
    setReplyToId(null);
  };
  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditText('');
  };

  const handleUpdateAnswer = async (e, answerId) => {
    e.preventDefault();
    if (!editText.trim()) {
      showError('Please enter your answer.');
      return;
    }
    try {
      await updateAnswer({ answerId, questionId, answer_text: editText.trim() }).unwrap();
      showSuccess('Answer updated!');
      setEditingAnswerId(null);
      setEditText('');
    } catch (err) {
      showError(err?.data?.message || err?.message || 'Failed to update answer.');
    }
  };

  if (!questionId) return null;

  return (
    <div className="tutor-video-qa-modal-overlay" onClick={onClose}>
      <div className="tutor-video-qa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tutor-video-qa-modal-header">
          <h2 className="tutor-video-qa-modal-title">Question Details</h2>
          <button type="button" className="tutor-video-qa-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="tutor-video-qa-modal-body">
          {isLoading ? (
            <SectionLoader message="Loading..." height="200px" />
          ) : isError ? (
            <p style={{ color: '#DD4040' }}>Failed to load question.</p>
          ) : question ? (
            <>
              <div className="tutor-video-qa-modal-question">
                <p className="tutor-video-qa-modal-meta">
                  {question.user?.name || 'Student'} • {question.lesson?.title || '—'} • {formatDate(question.created_at)}
                </p>
                <h3 className="tutor-video-qa-modal-question-text">{question.question_text}</h3>
              </div>

              <div className="tutor-video-qa-modal-answers">
                <h4 className="tutor-video-qa-modal-answers-title">
                  Answers ({answers.length})
                </h4>
                {answers.map((a) => (
                  <div key={a.id} className="tutor-video-qa-modal-answer">
                    <p className="tutor-video-qa-modal-answer-meta">
                      {a.is_tutor_answer ? '👨‍🏫 Tutor' : (a.user?.name || 'User')} • {formatDate(a.created_at)}
                      {a.edited && <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 6 }}>(edited)</span>}
                    </p>
                    {editingAnswerId === a.id ? (
                      <form onSubmit={(e) => handleUpdateAnswer(e, a.id)} className="tutor-video-qa-modal-reply-form">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Edit your answer..."
                          rows={3}
                          className="tutor-video-qa-modal-textarea"
                          autoFocus
                        />
                        <div className="tutor-video-qa-modal-reply-actions">
                          <button type="button" onClick={cancelEdit} className="tutor-video-qa-btn-secondary">
                            Cancel
                          </button>
                          <button type="submit" disabled={updatingAnswer || !editText.trim()} className="tutor-video-qa-btn-primary">
                            {updatingAnswer ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="tutor-video-qa-modal-answer-text">{a.answer_text}</p>
                        <div className="tutor-video-qa-modal-answer-actions">
                          {a.is_tutor_answer && (
                            <button type="button" onClick={() => startEdit(a)} className="tutor-video-qa-modal-reply-btn">
                              Edit
                            </button>
                          )}
                          {replyToId === a.id ? (
                            <form onSubmit={(e) => handleSubmitReply(e, a.id)} className="tutor-video-qa-modal-reply-form" style={{ width: '100%' }}>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                rows={3}
                                className="tutor-video-qa-modal-textarea"
                                autoFocus
                              />
                              <div className="tutor-video-qa-modal-reply-actions">
                                <button type="button" onClick={cancelReply} className="tutor-video-qa-btn-secondary">
                                  Cancel
                                </button>
                                <button type="submit" disabled={postingReply || !replyText.trim()} className="tutor-video-qa-btn-primary">
                                  {postingReply ? 'Posting...' : 'Post Reply'}
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button type="button" onClick={() => startReply(a.id)} className="tutor-video-qa-modal-reply-btn">
                              Reply
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitAnswer} className="tutor-video-qa-modal-answer-form">
                <label className="tutor-video-qa-modal-label">Your Answer</label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer..."
                  rows={4}
                  className="tutor-video-qa-modal-textarea"
                />
                <div className="tutor-video-qa-modal-actions">
                  <button type="button" onClick={onClose} className="tutor-video-qa-btn-secondary">
                    Close
                  </button>
                  <button type="submit" disabled={postingAnswer || !answerText.trim()} className="tutor-video-qa-btn-primary">
                    {postingAnswer ? 'Posting...' : 'Post Answer'}
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default VideoQAAnswerModal;
