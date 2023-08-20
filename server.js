// get all the required tools needed to make the application work
const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./Develop/db/db.json')

// make a express app and define the port used
const PORT = process.env.port || 3000;
const app = express();

// middleware to create a safety barrier agasint injections
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the current directory (public)
app.use(express.static(path.join('./Develop/public')));

// This is for the index.html.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

// this loads the notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

// API routes
//this is the get route for the nptes api
app.get('/api/notes', (req, res) => {
  // uses the file system to parse the content of the db.json and assigns it to a constant
  const notes = JSON.parse(fs.readFileSync(path.join('./Develop/db/db.json'), 'utf8'));
  // responds with the notes
  res.json(notes);
});

// Post allows us to make send the notes to the servers and add it to the file system
app.post('/api/notes', (req, res) => {
  // create a variable for the request
  const newNote = req.body;
  // reads the file and parses it
  const notes = JSON.parse(fs.readFileSync(path.join('./Develop/db/db.json'), 'utf8'));
  // adds an id to the note
  newNote.id = notes.length.toString(); // Assign a simple incremental ID
  // pushes the note to the array
  notes.push(newNote);
  // essentially re-writes the file adding all the new content
  fs.writeFileSync(path.join('./Develop/db/db.json'), JSON.stringify(notes));
  res.json(newNote);
});
// allows the deletion of notes.
app.delete('/api/notes/:id', (req, res) => {
  // checks id
  const id = req.params.id;
  // reads the file and parses it
  const notes = JSON.parse(fs.readFileSync(path.join('./Develop/db/db.json'), 'utf8'));
  // look for the note with the id
  const updatedNotes = notes.filter(note => note.id !== id);
  fs.writeFileSync(path.join('./Develop/db/db.json'), JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted successfully' });
});

// listens for the server/port
app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
