import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
// components
import PostCommentItem from './post-comment-item';

// ----------------------------------------------------------------------

export default function PostCommentList({ comments = [] }) {
  const [isVisible, setIsVisible] = useState(0); 
  const [isView, setIsView] = useState(false);    

  console.log("Comments.:" , comments)

  const handleToggleReplies = (index) => {
    if (isVisible === index) {
  
      setIsView((prev) => !prev);
    } else {
      
      setIsVisible(index);
      setIsView(true);
    }
  };

  return (
    <>
      {comments
        .filter((c) => c.isParentComment) 
        .map((comment, index) => {
          const {
            id,
            comment: commentText,
            createdAt,
            user = {},
            repliesCount = [],
          } = comment;

          const hasReplies = repliesCount.length > 0;

          return (
            <Box key={id} sx={{ mb: 3 }}>
              <PostCommentItem
                name={user.fullName || 'NA'}
                comment={commentText}
                createdAt={createdAt}
              />
              {hasReplies && (
                <Button
                  size="small"
                  onClick={() => handleToggleReplies(index)}
                  sx={{ ml: 6, mb: 1 }}
                >
                  {isVisible === index && isView
                    ? 'Hide replies'
                    : `View replies (${repliesCount.length})`}
                </Button>
              )}

              {/* Replies */}
              {isVisible === index && isView &&
                repliesCount.map((reply) => {
                  const replyUser = reply.user || {};
                  return (
                    <PostCommentItem
                      key={reply.id}
                      name={replyUser.fullName || 'Anonymous'}
                      comment={reply.comment}
                      createdAt={reply.createdAt}
                      avatarUrl={replyUser.avatarUrl || ''}
                      tagUser={reply.tagUser}
                      hasReply
                    />
                  );
                })}
            </Box>
          );
        })}

      <Pagination count={8} sx={{ my: 5, mx: 'auto', width: 'fit-content' }} />
    </>
  );
}

PostCommentList.propTypes = {
  comments: PropTypes.array,
};
