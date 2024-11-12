const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const objectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  comments: [commentSchema] // Array of comments for each object
});

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  objects: [objectSchema] // Array of objects within the room
});

const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  rooms: [roomSchema] // Array of rooms on each floor
});

const buildingSchema = new mongoose.Schema({
  buildingName: { type: String, required: true },
  floors: [floorSchema] // Array of floors within the building
});

module.exports = mongoose.model('Building', buildingSchema);
