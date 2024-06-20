const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single note by ID
app.get('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new note
app.post('/notes', async (req, res) => {
  const { title, datetime, note } = req.body;
  try {
    const [result] = await db.query('INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)', [title, datetime, note]);
    res.status(201).json({ id: result.insertId, title, datetime, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note by ID
app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;
  try {
    const [result] = await db.query('UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?', [title, datetime, note, id]);
    if (result.affectedRows > 0) {
      res.json({ id, title, datetime, note });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note by ID
app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
