const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Building = require('./models/Building'); // Ensure to point to your actual schema file

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/collegeDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
// Get all buildings
app.get('/api/buildings', async (req, res) => {
  const buildings = await Building.find();
  res.json(buildings);
});

// Add a new building
app.post('/api/buildings', async (req, res) => {
  const newBuilding = new Building({ buildingName: req.body.buildingName, floors: [] });
  await newBuilding.save();
  res.json(newBuilding);
});

// Get all floors in a building
app.get('/api/buildings/:buildingId/floors', async (req, res) => {
  const building = await Building.findById(req.params.buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });
  res.json(building.floors);
});

// Add a floor to a building
app.post('/api/buildings/:buildingId/floors', async (req, res) => {
  try {
    const { floorNumber } = req.body;
    
    if (floorNumber == null || isNaN(floorNumber)) {
      return res.status(400).json({ error: 'Invalid floor number' });
    }

    const building = await Building.findById(req.params.buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found' });

    building.floors.push({ floorNumber, rooms: [] });
    await building.save();

    res.json(building.floors);
  } catch (error) {
    console.error("Error adding floor:", error);
    res.status(500).json({ error: 'Failed to add new floor' });
  }
});

// Get all rooms in a specific floor of a building
app.get('/api/buildings/:buildingId/floors/:floorNumber/rooms', async (req, res) => {
  const building = await Building.findById(req.params.buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });
  
  const floor = building.floors.find(f => f.floorNumber === parseInt(req.params.floorNumber));
  if (!floor) return res.status(404).json({ error: 'Floor not found' });

  res.json(floor.rooms);
});

// Add a room to a specific floor
app.post('/api/buildings/:buildingId/floors/:floorNumber/rooms', async (req, res) => {
  const building = await Building.findById(req.params.buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  const floor = building.floors.find(f => f.floorNumber === parseInt(req.params.floorNumber));
  if (!floor) return res.status(404).json({ error: 'Floor not found' });

  floor.rooms.push({ roomName: req.body.roomName, objects: [] });
  await building.save();

  res.json(floor.rooms);
});

// Get comments for a specific object in a room
app.get('/api/buildings/:buildingId/floors/:floorNumber/rooms/:roomName/comments', async (req, res) => {
  const { buildingId, floorNumber, roomName } = req.params;
  const building = await Building.findById(buildingId);
  if (!building) return res.status(404).json({ error: 'Building not found' });

  const floor = building.floors.find(f => f.floorNumber === parseInt(floorNumber));
  if (!floor) return res.status(404).json({ error: 'Floor not found' });

  const room = floor.rooms.find(r => r.roomName === roomName);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  res.json(room.objects.flatMap(obj => obj.comments));
});

// Add a comment to a specific object in a room
app.post('/api/buildings/:buildingId/floors/:floorNumber/rooms/:roomName/comments', async (req, res) => {
  const { buildingId, floorNumber, roomName } = req.params;
  const { text, objectName, type } = req.body;

  try {
    const building = await Building.findById(buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found' });

    const floor = building.floors.find(f => f.floorNumber === parseInt(floorNumber));
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const room = floor.rooms.find(r => r.roomName === roomName);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Check if the object exists in the room
    let object = room.objects.find(obj => obj.name === objectName);

    // If the object does not exist, create it
    if (!object) {
      object = { name: objectName, type, comments: [] };
      room.objects.push(object);
    }

    // Add the new comment to the object
    const newComment = { text, date: new Date() };
    object.comments.push(newComment);

    // Save the building document after modifying it
    await building.save();

    res.json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: 'Failed to add new comment' });
  }
});


// Delete a specific comment from an object in a room
app.delete('/api/buildings/:buildingId/floors/:floorNumber/rooms/:roomName/comments/:commentId', async (req, res) => {
  const { buildingId, floorNumber, roomName, commentId } = req.params;

  // Validate commentId format
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID format' });
  }

  try {
    const building = await Building.findById(buildingId);
    if (!building) return res.status(404).json({ error: 'Building not found' });

    const floor = building.floors.find(f => f.floorNumber === parseInt(floorNumber));
    if (!floor) return res.status(404).json({ error: 'Floor not found' });

    const room = floor.rooms.find(r => r.roomName === roomName);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    

    let commentFound = false;

    // Find and remove the comment
    for (const obj of room.objects) {
      const commentIndex = obj.comments.findIndex(comment => comment._id === commentId);

      if (commentIndex !== -1) {
        obj.comments.splice(commentIndex, 1); // Remove the comment
        commentFound = true;
        break;
      }
    }

    if (!commentFound) return res.status(404).json({ error: 'Comment not found' });

    await building.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Start the server
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
