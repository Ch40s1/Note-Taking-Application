const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('../db/db.json')

const PORT = process.env.port || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the current directory (public)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json'), 'utf8'));
  newNote.id = notes.length.toString(); // Assign a simple incremental ID
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));
  res.json(newNote);
});

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
