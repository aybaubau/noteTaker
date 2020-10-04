const express = require("express");
const path = require("path");
const fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML routes
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// reads db.json and returns all notes as JSON
app.get("/api/notes", function(_req, res) {
  const notes = fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
    res.json(data);
  });
});

// adds new note to db.json and returns note to client
app.post("/api/notes", function(req, res) {
  const notes = fs.readFileSync('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err;
    return data;
  });
  const notesArray = JSON.parse(notes);
  console.log(notesArray);
  // add id to request in proper format
  const newNote = {
    'id': notesArray.length + 1,
    'title': req.body.title,
    'text': req.body.text
  };
  console.log(newNote);
  notesArray.push(newNote);
  fs.writeFile('./db/db.json', JSON.stringify(notesArray), 'utf-8', (err) => {
    if (err) throw err;
    console.log('The new note has been added!');
  });
  res.json(newNote);
});

// deletes note by id
app.delete("/api/notes/:id", function(req, res) {
  const notes = fs.readFileSync('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err;
    return data;
  });
  const notesArray = JSON.parse(notes);
  const objectToDelete = function() {
    for (object in notesArray) {
      if (object.id === req.params.id) {
        return object;
      }
    }
  };
  const index = notesArray.findIndex(objectToDelete);
  notesArray.splice(index, 1);
  fs.writeFile('./db/db.json', JSON.stringify(notesArray), 'utf-8', (err) => {
    if (err) throw err;
    console.log('The requested note has been deleted.');
  });
});

// Starts the server to begin listening
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
