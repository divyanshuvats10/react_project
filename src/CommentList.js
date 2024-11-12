// CommentList.js
import React from 'react';

const CommentList = ({ comments, removeComment }) => (
  <div className="comments">
    {comments.map((comment) => (
      <div key={comment.id} className="comment-item">
        <p>{comment.text}</p>
        <small>
          {comment.date ? new Date(comment.date).toLocaleString() : 'Date not available'}
        </small>
        <button onClick={() => removeComment(comment.object)}>Remove</button>
      </div>
    ))}
  </div>
);

export default CommentList;
