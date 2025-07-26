import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// components
import axiosInstance from 'src/utils/axios';
import PostCommentItem from './post-comment-item';

export default function PostCommentList({ comments = [] }) {
  // Track which comment replies are visible (by comment ID)
  const [visibleReplies, setVisibleReplies] = useState({});

  // Store replies data for each comment by ID
  const [repliesDataMap, setRepliesDataMap] = useState({});

  const handleToggleReplies = async (commentId) => {
    // Toggle visibility
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    // Fetch replies only if not already fetched
    if (!repliesDataMap[commentId]) {
      try {
        const response = await axiosInstance.get(`/comment-replies/${commentId}`);
        if (response.data?.data) {
          setRepliesDataMap((prev) => ({
            ...prev,
            [commentId]: response.data.data,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch replies:', error);
      }
    }
  };

  return (
    <>
      {comments
        .filter((c) => c.isParentComment)
        .map((comment) => {
          const {
            id,
            comment: commentText,
            createdAt,
            user = {},
            repliesCount,
          } = comment;

          const isRepliesVisible = visibleReplies[id];
          const replies = repliesDataMap[id] || [];

          return (
            <Box key={id} sx={{ mb: 3 }}>
              <PostCommentItem
                name={user.fullName || 'NA'}
                message={commentText}
                createdAt={createdAt}
                handleReply={() => handleToggleReplies(id)}
              />

              {repliesCount > 0 && (
                <Button
                  size="small"
                  onClick={() => handleToggleReplies(id)}
                  sx={{ ml: 6, mb: 1 }}
                >
                  {isRepliesVisible
                    ? 'Hide replies'
                    : `View replies (${repliesCount})`}
                </Button>
              )}

              {/* Render replies if visible */}
              {isRepliesVisible &&
                replies.map((reply) => (
                  <PostCommentItem
                    key={reply.id}
                    name={reply.user?.fullName || 'Anonymous'}
                    message={reply?.comment}
                    createdAt={reply.createdAt}
                    avatarUrl={reply.user?.avatarUrl || ''}
                    hasReply
                  />
                ))}
            </Box>
          );
        })}
    </>
  );
}

PostCommentList.propTypes = {
  comments: PropTypes.array.isRequired,
};

