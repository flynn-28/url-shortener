require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// load environment variables
const port = process.env.PORT;
const dbPath = process.env.DB;

// open db
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}.`);
    // create db if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alias TEXT UNIQUE,
        longurl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  }
});

// shortening endpoint
app.get('/shorten/:alias', (req, res) => {
  const { alias } = req.params;
  let longurl = req.query.longurl;

  if (!longurl) {
    return res.status(400).json({ error: 'longurl required to shorten' });
  }

  if (!/^https?:\/\//i.test(longurl)) {
    longurl = 'http://' + longurl;
  }

  // check if alias is already in use
  db.get('SELECT * FROM urls WHERE alias = ?', [alias], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'db error' });
    } else if (row) {
      res.status(400).json({ error: 'alias already exists' });
    } else {
      // add shortened url to db
      db.run('INSERT INTO urls (alias, longurl) VALUES (?, ?)', [alias, longurl], function(err) {
        if (err) {
          res.status(500).json({ error: 'Failed to shorten URL' });
        } else {
          const shortUrl = `http://localhost:${port}/${alias}`;
          res.json({ shortUrl });
        }
      });
    }
  });
});

// redirect shortened url to long url
app.get('/:alias', (req, res) => {
  const { alias } = req.params;

  // search db for alias
  db.get('SELECT * FROM urls WHERE alias = ?', [alias], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'db error' });
    } else if (row) {
      res.redirect(row.longurl);
    } else {
      res.status(404).json({ error: 'url not found' });
    }
  });
});

// start server
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
