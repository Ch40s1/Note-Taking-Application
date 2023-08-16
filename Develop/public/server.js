const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('../db/db.json')
const PORT = process.env.port || 3000;
const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory (public)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});
app.get("/api/notes", (req, res) => {
  // Read the content of the db.json file and send it as a response
  const dbFilePath = path.join(__dirname, '../db/db.json');
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      return res.status(500).send("Internal Server Error");
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.error("Error parsing db.json:", parseError);
      return res.status(500).send("Internal Server Error");
    }
  });
});
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  // Read the existing notes from the db.json file
  const dbFilePath = path.join(__dirname, '../db/db.json');
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      return res.status(500).send("Internal Server Error");
    }

    try {
      const notes = JSON.parse(data);

      // Assign a unique ID to the new note
      newNote.id = Date.now();

      // Add the new note to the array of notes
      notes.push(newNote);

      // Write the updated notes array back to the db.json file
      fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing to db.json:", writeErr);
          return res.status(500).send("Internal Server Error");
        }

        res.json(newNote); // Respond with the new note
      });
    } catch (parseError) {
      console.error("Error parsing db.json:", parseError);
      return res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
