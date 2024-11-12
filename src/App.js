// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Building from './Building';
import Floor from './Floor';
import Room from './Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/building/:buildingId" element={<Building />} />
        <Route path="/building/:buildingId/floor/:floorNumber" element={<Floor />} />
        <Route path="/building/:buildingId/floor/:floorNumber/room/:roomName" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
