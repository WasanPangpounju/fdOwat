// const express = require('express')
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

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

// Start the server
const PORT = 5000; // Replace with the desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

