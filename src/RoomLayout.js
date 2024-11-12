import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Object from './Object';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import './RoomLayout.css';

const RoomLayout = () => {
  const [comments, setComments] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectsWithComments, setObjectsWithComments] = useState(new Set());

  // Load comments from MongoDB on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/api/comments')
      .then(response => {
        const loadedComments = [];
        const objectsWithCommentsSet = new Set();

        response.data.forEach(item => {
          item.comments.forEach((comment, index) => {
            loadedComments.push({
              id: `${item.objectName}-${index}`,
              text: comment.text,
              object: item.objectName,
              date: comment.date,
            });
            objectsWithCommentsSet.add(item.objectName);
          });
        });

        setComments(loadedComments);
        setObjectsWithComments(objectsWithCommentsSet);
      })
      .catch(err => console.error('Error loading comments:', err));
  }, []);

  // Add a new comment for the selected object
  const addComment = (text) => {
    if (selectedObject) {
      const newComment = {
        id: comments.length + 1,
        text,
        object: selectedObject.name,
        date: new Date(),
      };

      axios.post('http://localhost:3001/api/comments', {
        objectName: selectedObject.name,
        comment: text
      })
      .then(response => {
        setComments([...comments, newComment]);
        setObjectsWithComments(new Set([...objectsWithComments, selectedObject.name]));
      })
      .catch(err => console.error('Error saving comment:', err));
    }
  };

  // Remove a comment from the list
  const removeComment = (objectName) => {
    setComments(comments.filter(comment => comment.object !== objectName));

    const updatedObjects = new Set(objectsWithComments);
    updatedObjects.delete(objectName);
    setObjectsWithComments(updatedObjects);
  };

  // Define the objects for seats, tables, ACs, fans, and smart board
  const seatsAndTables = [];
  for (let row = 1; row <= 6; row++) {
    for (let col = 1; col <= 12; col++) {
      const table = { id: `table-${row}-${col}`, type: 'table', name: `Table ${row}-${col}` };
      const seat = { id: `seat-${row}-${col}`, type: 'seat', name: `Seat ${row}-${col}` };
      seatsAndTables.push({ table, seat });
    }
  }

  const fansAndAcs = [
    { id: 1, type: 'fan', name: 'Fan 1' },
    { id: 2, type: 'fan', name: 'Fan 2' },
    { id: 3, type: 'fan', name: 'Fan 3' },
    { id: 4, type: 'fan', name: 'Fan 4' },
    { id: 5, type: 'fan', name: 'Fan 5' },
    { id: 6, type: 'fan', name: 'Fan 6' },
    { id: 7, type: 'ac', name: 'AC 1' },
    { id: 8, type: 'ac', name: 'AC 2' },
  ];

  const smartBoard = { id: 'smart-board', type: 'smartMonitor', name: 'Smart Board' };

  return (
    <div>
      {/* Smart Board at the front */}
      <h3>Class Layout</h3>
      <div className="smart-board">
        <Object 
          object={smartBoard} 
          onClick={() => setSelectedObject(smartBoard)} 
          selected={selectedObject === smartBoard}
          hasComment={objectsWithComments.has(smartBoard.name)}
        />
      </div>

      {/* Seat and Table arrangement (6 rows X 12 columns) */}
      <div className="seat-table-layout">
        {seatsAndTables.map(({ table, seat }) => (
          <div className="seat-table-pair" key={table.id}>
            <Object
              object={table}
              onClick={() => setSelectedObject(table)}
              selected={selectedObject === table}
              hasComment={objectsWithComments.has(table.name)}
            />
            <Object
              object={seat}
              onClick={() => setSelectedObject(seat)}
              selected={selectedObject === seat}
              hasComment={objectsWithComments.has(seat.name)}
            />
          </div>
        ))}
      </div>

      {/* Fans and ACs arranged as 3 columns and 3 rows */}
      <div className="fan-ac-layout">
        {fansAndAcs.map((item) => (
          <Object
            key={item.id}
            object={item}
            onClick={() => setSelectedObject(item)}
            selected={selectedObject === item}
            hasComment={objectsWithComments.has(item.name)}
          />
        ))}
      </div>

      {/* Comment Form and List */}
      {selectedObject && (
        <>
          <h3>Add Comment for {selectedObject.name}</h3>
          <CommentForm addComment={addComment} />
        </>
      )}

      <h3>Comments:</h3>
      <CommentList
        comments={comments}
        removeComment={removeComment}
      />
    </div>
  );
};

export default RoomLayout;
