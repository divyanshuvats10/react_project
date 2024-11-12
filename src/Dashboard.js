// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Navbar from './Navbar.js';


const Dashboard = () => {
  const [buildings, setBuildings] = useState([]);
  const [newBuildingName, setNewBuildingName] = useState('');

  useEffect(() => {
    const fetchBuildings = async () => {
      const response = await axios.get('http://localhost:3001/api/buildings');
      setBuildings(response.data);
    };
    fetchBuildings();
  }, []);

  const addBuilding = async () => {
    await axios.post('http://localhost:3001/api/buildings', { buildingName: newBuildingName });
    setNewBuildingName('');
    const response = await axios.get('http://localhost:3001/api/buildings');
    setBuildings(response.data);
  };

  return (
  <> 
    <Navbar />
    <div className="dashboard-wrapper">
      <h1>College Dashboard</h1>
      <div className="card-container">
        {buildings.map((building) => (
          <div className="card" key={building._id}>
            <h3>{building.buildingName}</h3>
            <Link className="styled-button" to={`/building/${building._id}`}>
              View {building.buildingName}
            </Link>
          </div>
        ))}
      </div>

      {/* Add Building Form */}
      <div className="add-building-form">
        <h2>Add New Building</h2>
        <input
          type="text"
          placeholder="Building Name"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
        />
        <button onClick={addBuilding}>Add Building</button>
      </div>
    </div>
    </>     
  );
};

export default Dashboard;
