// Building.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Building = () => {
  const { buildingId } = useParams();
  const [floors, setFloors] = useState([]);
  const [newFloorNumber, setNewFloorNumber] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/buildings/${buildingId}/floors`);
        setFloors(response.data);
      } catch (err) {
        console.error("Error fetching floors:", err);
        setError('Failed to load floors');
      }
    };
    fetchFloors();
  }, [buildingId]);

  // Building.js
const addFloor = async () => {
    try {
      // Parse and send as an integer to ensure no empty values
      const floorNumber = parseInt(newFloorNumber, 10);
      if (isNaN(floorNumber)) {
        setError('Please enter a valid floor number');
        return;
      }
  
      await axios.post(`http://localhost:3001/api/buildings/${buildingId}/floors`, { 
        floorNumber 
      });
      setNewFloorNumber('');
      
      // Refresh floors after adding a new one
      const response = await axios.get(`http://localhost:3001/api/buildings/${buildingId}/floors`);
      setFloors(response.data);
      setError(null);
    } catch (err) {
      console.error("Error adding floor:", err);
      setError('Failed to add new floor');
    }
  };
  

  return (
    <div className="building">
      <h2>Floors in Building</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="card-container">
        {floors.map((floor) => (
          <div className="card" key={floor._id}>
            <h3>Floor {floor.floorNumber}</h3>
            <Link className="styled-button" to={`/building/${buildingId}/floor/${floor.floorNumber}`}>
              View Floor {floor.floorNumber}
            </Link>
          </div>
        ))}
      </div>

      {/* Add Floor Form */}
      <div className="add-floor-form">
        <h2>Add New Floor</h2>
        <input
          type="text"
          placeholder="Floor Number"
          value={newFloorNumber}
          onChange={(e) => setNewFloorNumber(e.target.value)}
        />
        <button onClick={addFloor}>Add Floor</button>
      </div>
    </div>
  );
};

export default Building;
