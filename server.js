ii// const express = require('express')
// const mysql = require('mysql2');

// const app = express();

// app.use(express.json());

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     // password: '',
//     database: 'owat'
// })

// connection.connect((err => {
//     if (err) {
//         console.log('Error', err)
//         return;
//     }
//     console.log('Success');
// }))

// // rout

// app.post("/create", async (req, res) => {
//     const { Fname, Lname, user, password,userType } = req.body;

//     try {
//         connection.query(
//             "INSERT INTO user(Fname, Lname, user, password,userType) VALUES(?,?,?,?,?)",
//             [Fname, Lname, user, password,userType],
//             (err, results, field) => {
//                 if (err) {
//                     console.log("Error while user database", err);
//                     return res.status(400).send();
//                 }
//                 return res.status(201).json({ message: "New user seccess create" });
//             }
//         )


//     } catch (err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// })

// app.listen(5173, () => console.log("Server is running on page 5173"));
// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// IMPORTANT: Serve static files FIRST with proper configuration
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set proper MIME types
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Replace with your MySQL password
  database: 'owat', // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// API Endpoints
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/items', (req, res) => {
  const { Fmane, Lname } = req.body;
  db.query('INSERT INTO items (Fmane, Lname) VALUES (?, ?)', [Fmane, Lname], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, Fmane, Lname });
  });
});

app.put('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  db.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, result) => {
    if (err) throw err;
    res.json({ id, name, description });
  });
});

app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM items WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.json({ id });
  });
});

// Catch-all handler: For any request that doesn't match an API route or static file,
// send back the index.html file (for React Router)
// IMPORTANT: This MUST be the LAST route
app.get('*', (req, res) => {
  // Don't serve index.html for API routes or assets
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

