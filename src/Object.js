import React from 'react';

const Object = ({ object, onClick, selected, hasComment }) => {
  return (
    <div
      className={`object ${selected ? 'selected' : ''} ${hasComment ? 'has-comment' : ''}`}
      onClick={onClick}
    >
      {object.name}
    </div>
  );
};

export default Object;
