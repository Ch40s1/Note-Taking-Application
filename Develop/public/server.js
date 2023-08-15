const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express();

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