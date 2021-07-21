const express = require("express");
const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const uuid = require("./utils/helper");
const path = require("path");
const { readFile, writeFile } = require("fs");
const db = require("./db/db.json");


app.get("/api/notes", (req, res) => {
    const absolutePath = path.join(process.cwd(), "db", "db.json");
    readFile(absolutePath, (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            const allNotes = JSON.parse(data);
            res.json(allNotes);
        }
    });
});

app.post("/api/notes", (req, res) => {
    const absolutePath = path.join(process.cwd(), "db", "db.json");
    const newNote = req.body;
    newNote.Id = uuid();
    db.push(newNote);
    writeFile(absolutePath, JSON.stringify(db), (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(newNote);
        }
    });
});

app.delete("/api/notes/:Id", (req, res) => {
    const noteId = req.params.Id;
    const absolutePath = path.join(process.cwd(), "db", "db.json");
    const deleteIndex = db.findIndex((note) => {
        if (noteId === note.Id) {
            return true;
        } else {
            return false;
        }
    });
    db.splice(deleteIndex, 1);
    writeFile(absolutePath, JSON.stringify(db), (err) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});
app.get("/notes", (req, res) => {
    const absolutePath = path.join(process.cwd(), "public", "notes.html");

    res.sendFile(absolutePath);
});

app.listen(PORT, () =>
    console.log(`Listening for requests on port ${PORT}! 🏎️`)
);