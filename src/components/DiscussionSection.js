import React, { useState } from 'react';
import FlagContentModal from './Flagcontentmodal';

function DiscussionSection({ commentsData }) {
  const [filter, setFilter] = useState('most-upvoted');
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comments, setComments] = useState(commentsData);
  
  // Flag Modal State
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [flaggedComments, setFlaggedComments] = useState(new Set());
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handlePostComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        userName: isAnonymous ? 'Anonymous' : 'Alex Student',
        avatar: '/assets/images/icons/Ellipse 3.svg',
        time: 'Just now',
        text: commentText,
        upvotes: 0,
        replies: 0
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setIsAnonymous(false);
    }
  };

  const handleDiscard = () => {
    setCommentText('');
    setIsAnonymous(false);
  };

  // Flag Handlers
  const handleFlagClick = (commentId) => {
    // If already flagged, unflag it
    if (flaggedComments.has(commentId)) {
      const newFlagged = new Set(flaggedComments);
      newFlagged.delete(commentId);
      setFlaggedComments(newFlagged);
      return;
    }
    
    // Open flag modal
    setSelectedCommentId(commentId);
    setShowFlagModal(true);
  };

  const handleCloseFlagModal = () => {
    setShowFlagModal(false);
    setSelectedCommentId(null);
  };

  const handleConfirmFlag = (flagData) => {
    console.log('Flag submitted:', flagData);
    
    // Add to flagged comments
    setFlaggedComments(prev => new Set([...prev, flagData.commentId]));
    
    // Close modal
    setShowFlagModal(false);
    setSelectedCommentId(null);
  };

  // Check if comment is flagged
  const isCommentFlagged = (commentId) => {
    return flaggedComments.has(commentId);
  };

  // Reply Handlers
  const handleReplyClick = (commentId, userName) => {
    setReplyingTo({ id: commentId, userName });
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handlePostReply = () => {
    if (replyText.trim() && replyingTo) {
      // Update replies count for the parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === replyingTo.id) {
          return { ...comment, replies: (comment.replies || 0) + 1 };
        }
        return comment;
      }));
      
      console.log('Reply posted:', { to: replyingTo, text: replyText });
      
      // Reset reply state
      setReplyingTo(null);
      setReplyText('');
    }
  };

  return (
    <div className="discussion-section">
      <div className="discussion-header">
        <h3 className="discussion-title">Discussion</h3>
        <div className="discussion-filters">
          <button
            className={`filter-btn-disc ${filter === 'most-upvoted' ? 'active' : ''}`}
            onClick={() => setFilter('most-upvoted')}
          >
            Most Upvoted
          </button>
          <button
            className={`filter-btn-disc ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Add Comment Box */}
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
            <button className="btn-post" onClick={handlePostComment}>
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="comments-header">
        <div className="comments-count">1.2k Comments</div>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img src={comment.avatar} alt="User" className="comment-user-avatar" />
              <div className="comment-content-wrapper">
                <div className="comment-header-info">
                  <span className="comment-user-name">{comment.userName}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-footer">
                  {/* Upvote Button */}
                  <button className="comment-action-btn">
                    <span className="upvote-icon">
                      <img src="/assets/images/icons/comments-count.svg" alt="" />
                    </span>
                    <span>{comment.upvotes}</span>
                  </button>
                  
                  {/* Flag Button - Using existing flag image, click opens popup */}
                  <button 
                    className={`comment-action-btn flag-btn ${isCommentFlagged(comment.id) ? 'flagged' : ''}`}
                    onClick={() => handleFlagClick(comment.id)}
                    title={isCommentFlagged(comment.id) ? 'Unflag' : 'Flag this comment'}
                  >
                    <img 
                      src={isCommentFlagged(comment.id) 
                        ? "/assets/images/icons/comments-reply.svg" 
                        : "/assets/images/icons/flag-grey.svg"
                      } 
                      alt="Flag" 
                    />
                  </button>
                  
                  {/* Reply Button - Click opens reply box */}
                  <button 
                    className="comment-action-btn-reply"
                    onClick={() => handleReplyClick(comment.id, comment.userName)}
                  >
                  
                    Reply
                  </button>
                </div>
                
                {/* Reply Input Box - Shows when replying to this comment */}
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
                      <button className="btn-post-reply" onClick={handlePostReply}>
                        Reply
                      </button>
                    </div>
                  </div>
                )}
                
                {comment.replies > 0 && (
                  <button className="view-replies-btn">
                    View {comment.replies} Replies
                  </button>
                )}
              </div>
            </div>
          ))}
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