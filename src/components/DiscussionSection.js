// src/components/DiscussionSection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PremiumGate from './PremiumGate';
import FlagContentModal from './Flagcontentmodal';
import {
  useGetVideoQnAQuery,
  usePostVideoQuestionMutation,
  useUpvoteQuestionMutation,
  useFlagQuestionMutation,
  usePostVideoReplyMutation,
  useGetQuestionRepliesQuery,
} from '../store/api/authApi';
import { Spinner } from './ui/LoadingSpinner';
import { showError, showWarning } from '../utils/toast';

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
};

// Helper to format count (e.g., 1200 -> 1.2k)
const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count?.toString() || '0';
};

// ✅ Direct premium check function
const checkIsPremium = () => {
  const isPremiumStorage = (localStorage.getItem('isPremium') || Cookies.get('isPremium')) === 'true';
  try {
    const raw = localStorage.getItem('userData') || Cookies.get('userData') || '{}';
    const userData = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const isPremiumUser = userData.is_premium === true || userData.is_premium === 1;
    return isPremiumStorage || isPremiumUser;
  } catch {
    return isPremiumStorage;
  }
};

// Separate component for replies section
function RepliesSection({ questionId, latestAnswer }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: repliesData, isLoading } = useGetQuestionRepliesQuery(questionId, {
    skip: !isExpanded
  });

  const replies = repliesData?.data || [];
  const repliesCount = repliesData?.total || (latestAnswer ? 1 : 0);

  if (repliesCount === 0 && !latestAnswer) return null;

  return (
    <div className="replies-section">
      <button 
        className="view-replies-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Hide' : 'View'} {repliesCount} {repliesCount === 1 ? 'Reply' : 'Replies'}
      </button>
      
      {isExpanded && (
        <div className="replies-list">
          {isLoading ? (
            <div className="replies-loading"><Spinner size="sm" color="gray" /> Loading replies...</div>
          ) : (
            <>
              {replies.length === 0 && latestAnswer && (
                <div className="reply-item tutor-reply">
                  <img 
                    src="/assets/images/icons/Ellipse 2.svg" 
                    alt="Tutor" 
                    className="reply-avatar" 
                  />
                  <div className="reply-content">
                    <div className="reply-header">
                      <span className="reply-user-name">
                        {latestAnswer.is_tutor_answer ? 'Tutor' : 'Reply'}
                      </span>
                      {latestAnswer.is_tutor_answer && (
                        <span className="tutor-badge-small">👨‍🏫</span>
                      )}
                    </div>
                    <p className="reply-text">{latestAnswer.answer_text}</p>
                  </div>
                </div>
              )}
              
              {replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`reply-item ${reply.is_tutor_answer ? 'tutor-reply' : ''}`}
                >
                  <img 
                    src={reply.user?.avatar || '/assets/images/icons/Ellipse 3.svg'} 
                    alt="User" 
                    className="reply-avatar" 
                  />
                  <div className="reply-content">
                    <div className="reply-header">
                      <span className="reply-user-name">
                        {reply.user?.name || 'Anonymous'}
                      </span>
                      {reply.is_tutor_answer && (
                        <span className="tutor-badge-small">👨‍🏫 Tutor</span>
                      )}
                      <span className="reply-time">
                        {reply.created_at ? formatTimeAgo(reply.created_at) : ''}
                      </span>
                    </div>
                    <p className="reply-text">{reply.answer_text}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DiscussionSection({ lessonId, commentsData = [] }) {
  const navigate = useNavigate();
  
  // ✅ Use direct premium check instead of hook
  const [isPremium, setIsPremium] = useState(checkIsPremium());
  
  // Re-check premium status on mount
  useEffect(() => {
    setIsPremium(checkIsPremium());
  }, []);

  const [filter, setFilter] = useState('most-upvoted');
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Flag Modal State
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Track upvoted & flagged locally
  const [upvotedComments, setUpvotedComments] = useState(new Set());
  const [flaggedComments, setFlaggedComments] = useState(new Set());

  // Debug log
  // ========== API HOOKS ==========
  const { 
    data: apiResponse, 
    isLoading, 
    isError,
    refetch 
  } = useGetVideoQnAQuery(
    { lessonId, page: 1, sort: filter },
    { skip: !lessonId }
  );
  
  const [postQuestion, { isLoading: isPosting }] = usePostVideoQuestionMutation();
  const [upvoteQuestion] = useUpvoteQuestionMutation();
  const [flagQuestion] = useFlagQuestionMutation();
  // ✅ Use correct hook name
  const [postReply, { isLoading: isReplying }] = usePostVideoReplyMutation();

  // Get comments from API or fallback to static data
  const comments = apiResponse?.data?.data || commentsData;
  const totalComments = apiResponse?.total_comments || comments.length;

  // ========== POST COMMENT ==========
  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    
    if (!isPremium) {
      showWarning('Premium subscription required to post questions');
      return;
    }

    if (!lessonId) {
      showWarning('Lesson ID is required');
      return;
    }

    try {
      await postQuestion({
        lessonId,
        questionText: commentText,
        timestamp: 0,
        isAnonymous: isAnonymous
      }).unwrap();
      
      setCommentText('');
      setIsAnonymous(false);
      refetch();
    } catch (err) {
      console.error('Post question error:', err);
      showError(err?.data?.message || 'Failed to post question');
    }
  };

  const handleDiscard = () => {
    setCommentText('');
    setIsAnonymous(false);
  };

  // ========== UPVOTE ==========
  const handleUpvote = async (commentId) => {
    try {
      await upvoteQuestion(commentId).unwrap();
      setUpvotedComments(prev => new Set([...prev, commentId]));
      refetch();
    } catch (err) {
      console.error('Upvote error:', err);
      if (err?.data?.message === 'You have already upvoted this question') {
        setUpvotedComments(prev => new Set([...prev, commentId]));
      } else if (err?.data?.message === 'Premium subscription required') {
        showWarning('Premium subscription required to upvote');
      }
    }
  };

  // ========== FLAG ==========
  const handleFlagClick = (commentId) => {
    if (flaggedComments.has(commentId)) {
      const newFlagged = new Set(flaggedComments);
      newFlagged.delete(commentId);
      setFlaggedComments(newFlagged);
      return;
    }
    
    setSelectedCommentId(commentId);
    setShowFlagModal(true);
  };

  const handleCloseFlagModal = () => {
    setShowFlagModal(false);
    setSelectedCommentId(null);
  };

  const handleConfirmFlag = async (flagData) => {
    try {
      await flagQuestion({
        questionId: flagData.commentId,
        reason: flagData.reason
      }).unwrap();
      
      setFlaggedComments(prev => new Set([...prev, flagData.commentId]));
      setShowFlagModal(false);
      setSelectedCommentId(null);
      refetch();
    } catch (err) {
      console.error('Flag error:', err);
      showError(err?.data?.message || 'Failed to flag comment');
    }
  };

  // ========== REPLY ==========
  const handleReplyClick = (commentId, userName) => {
    setReplyingTo({ id: commentId, userName });
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      // ✅ Use postReply instead of postAnswer
      await postReply({
        questionId: replyingTo.id,
        answerText: replyText
      }).unwrap();
      
      setReplyingTo(null);
      setReplyText('');
      refetch();
    } catch (err) {
      console.error('Reply error:', err);
      showError(err?.data?.message || 'Failed to post reply');
    }
  };

  // ========== FILTER CHANGE ==========
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="discussion-section">
      <div className="discussion-header">
        <h3 className="discussion-title">Discussion</h3>
        <div className="discussion-filters">
          <button
            className={`filter-btn-disc ${filter === 'most-upvoted' ? 'active' : ''}`}
            onClick={() => handleFilterChange('most-upvoted')}
          >
            Most Upvoted
          </button>
          <button
            className={`filter-btn-disc ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => handleFilterChange('recent')}
          >
            Recent
          </button>
        </div>
      </div>

      {/* ✅ Add Comment Box - Premium check fixed */}
      {isPremium ? (
        <div className="add-comment-box">
          <div className="comment-input-wrapper">
            <img src="/assets/images/icons/Ellipse 3.svg" alt="User" className="comment-avatar" />
            <textarea
              className="comment-input"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <div className="comment-actions">
            <label className="anonymous-checkbox">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>Post as anonymous</span>
            </label>
            <div className="comment-buttons">
              <button className="btn-discard" onClick={handleDiscard}>
                Discard
              </button>
              <button 
                className="btn-post" 
                onClick={handlePostComment}
                disabled={isPosting || !commentText.trim()}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <PremiumGate feature="post-qa">
          <div className="add-comment-box">
            <div className="comment-input-wrapper">
              <img src="/assets/images/icons/Ellipse 3.svg" alt="User" className="comment-avatar" />
              <textarea
                className="comment-input"
                placeholder="Upgrade to Premium to ask questions..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled
              />
            </div>
            <div className="comment-actions">
              <div className="comment-buttons">
                <button className="btn-post" disabled>
                  Post
                </button>
              </div>
            </div>
          </div>
        </PremiumGate>
      )}

      {/* Comments List */}
      <div className="comments-header">
        <div className="comments-count">{formatCount(totalComments)} Comments</div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Spinner size="sm" color="gray" /> Loading comments...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#DC2626' }}>
            Failed to load comments
            <button 
              onClick={() => refetch()} 
              style={{ marginLeft: '10px', color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
            <p>No comments yet. Be the first to start the discussion!</p>
          </div>
        )}

        {/* Comments */}
        <div className="comments-list">
          {comments.map((comment) => {
            const userName = comment.is_anonymous ? 'Anonymous' : (comment.user?.name || comment.userName);
            const avatar = comment.user?.avatar || '/assets/images/icons/Ellipse 3.svg';
            const time = comment.created_at ? formatTimeAgo(comment.created_at) : comment.time;
            const text = comment.question_text || comment.text;
            const upvotes = comment.upvote_count || comment.upvotes || 0;
            const isUpvoted = upvotedComments.has(comment.id);
            const isFlagged = flaggedComments.has(comment.id) || comment.is_flagged;

            return (
              <div key={comment.id} className="comment-item">
                <img src={avatar} alt="User" className="comment-user-avatar" />
                <div className="comment-content-wrapper">
                  <div className="comment-header-info">
                    <span className="comment-user-name">{userName}</span>
                    <span className="comment-time">{time}</span>
                  </div>
                  <p className="comment-text">{text}</p>
                  
                  <div className="comment-footer">
                    {/* Upvote Button - Toggle between two icons */}
                    <button 
                      className={`comment-action-btn ${isUpvoted ? 'upvoted' : ''}`}
                      onClick={() => handleUpvote(comment.id)}
                    >
                      <span className="upvote-icon">
                        {isUpvoted ? (
                          <img src="/assets/images/icons/comments-count.svg" alt="" />
                        ) : (
                          <img src="/assets/images/icons/comments-count-hide.svg" alt="" />
                        )}
                      </span>
                      <span>{upvotes}</span>
                    </button>
                    
                    {/* Flag Button */}
                    <button 
                      className={`comment-action-btn flag-btn ${isFlagged ? 'flagged' : ''}`}
                      onClick={() => handleFlagClick(comment.id)}
                      title={isFlagged ? 'Flagged' : 'Flag this comment'}
                    >
                      <img 
                        src={isFlagged 
                          ? "/assets/images/icons/comments-reply.svg" 
                          : "/assets/images/icons/flag-grey.svg"
                        } 
                        alt="Flag" 
                      />
                    </button>
                    
                    {/* Reply Button */}
                    <button 
                      className="comment-action-btn-reply"
                      onClick={() => handleReplyClick(comment.id, userName)}
                    >
                      Reply
                    </button>
                  </div>
                  
                  {/* Reply Input Box */}
                  {replyingTo && replyingTo.id === comment.id && (
                    <div className="reply-input-box">
                      <div className="reply-to-label">
                        Replying to <span>@{replyingTo.userName}</span>
                      </div>
                      <div className="reply-input-wrapper">
                        <img src="/assets/images/icons/Ellipse 3.svg" alt="User" className="reply-avatar" />
                        <textarea
                          className="reply-input"
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="reply-actions">
                        <button className="btn-cancel-reply" onClick={handleCancelReply}>
                          Cancel
                        </button>
                        <button 
                          className="btn-post-reply" 
                          onClick={handlePostReply}
                          disabled={isReplying || !replyText.trim()}
                        >
                          {isReplying ? 'Posting...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies Section */}
                  <RepliesSection 
                    questionId={comment.id} 
                    latestAnswer={comment.latest_answer}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flag Content Modal */}
      <FlagContentModal
        isOpen={showFlagModal}
        onClose={handleCloseFlagModal}
        onConfirm={handleConfirmFlag}
        commentId={selectedCommentId}
      />
    </div>
  );
}

export default DiscussionSection;