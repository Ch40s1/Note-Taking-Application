const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));

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

// Serve static files from the current directory (public)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
