// Room.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Object from './Object';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import './RoomLayout.css';

const Room = () => {
  const { buildingId, floorNumber, roomName } = useParams();
  const [comments, setComments] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectsWithComments, setObjectsWithComments] = useState(new Set());

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms/${roomName}/comments`);

        const loadedComments = [];
        const objectsWithCommentsSet = new Set();

        response.data.forEach((comment) => {
          loadedComments.push({
            id: comment._id,
            text: comment.text,
            object: comment.object,
            date: comment.date,
          });
          objectsWithCommentsSet.add(comment.object);
        });

        setComments(loadedComments);
        setObjectsWithComments(objectsWithCommentsSet);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [buildingId, floorNumber, roomName]);

  const addComment = async (text) => {
    if (selectedObject) {
      try {
        const response = await axios.post(
          `http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms/${roomName}/comments`,
          {
            text,
            objectName: selectedObject.name,
            type: selectedObject.type,  // Sending object type as well
          }
        );
  
        const newComment = {
          id: response.data._id,
          text,
          object: selectedObject.name,
          date: response.data.date,
        };
  
        setComments([...comments, newComment]);
        setObjectsWithComments(new Set([...objectsWithComments, selectedObject.name]));
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  

  const removeComment = async (commentId, objectName) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms/${roomName}/comments/${commentId}`
      );
  
      // Remove the comment from the local state after deletion
      setComments(comments.filter(comment => comment.id !== commentId));
  
      const updatedObjects = new Set(objectsWithComments);
      if (!comments.some(comment => comment.object === objectName)) {
        updatedObjects.delete(objectName);
      }
      setObjectsWithComments(updatedObjects);
    } catch (error) {
      console.error("Error removing comment:", error);
    }
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
    <div className="room">
      <h2>{roomName} Layout</h2>
      
      {/* Smart Board */}
      <div className="smart-board">
        <Object 
          object={smartBoard} 
          onClick={() => setSelectedObject(smartBoard)} 
          selected={selectedObject === smartBoard}
          hasComment={objectsWithComments.has(smartBoard.name)}
        />
      </div>

      {/* Seat and Table layout */}
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

      {/* Fans and ACs layout */}
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
      <CommentList comments={comments} removeComment={removeComment} />
    </div>
  );
};

export default Room;
