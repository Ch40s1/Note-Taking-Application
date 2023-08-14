const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})