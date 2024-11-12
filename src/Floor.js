// Floor.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Floor = () => {
  const { buildingId, floorNumber } = useParams();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get(`http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms`);
      setRooms(response.data);
    };
    fetchRooms();
  }, [buildingId, floorNumber]);

  const addRoom = async () => {
    await axios.post(`http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms`, { roomName: newRoomName });
    setNewRoomName('');
    const response = await axios.get(`http://localhost:3001/api/buildings/${buildingId}/floors/${floorNumber}/rooms`);
    setRooms(response.data);
  };

  return (
    <div className="floor">
      <h2>Rooms on Floor {floorNumber}</h2>
      <div className="card-container">
        {rooms.map((room) => (
          <div className="card" key={room._id}>
            <h3>{room.roomName}</h3>
            <Link className="styled-button" to={`/building/${buildingId}/floor/${floorNumber}/room/${room.roomName}`}>
              View {room.roomName}
            </Link>
          </div>
        ))}
      </div>

      {/* Add Room Form */}
      <div className="add-room-form">
        <h2>Add New Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={addRoom}>Add Room</button>
      </div>
    </div>
  );
};

export default Floor;
