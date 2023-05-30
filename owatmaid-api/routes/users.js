const url = require('../config');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

//Connect mongodb
mongoose.connect(url ,{ useNewUrlParser: true, useUnifiedTopology: 
true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'manager'],
    default: 'employee'
  }
});

// Define user model
const User = mongoose.model('User', userSchema);

// Set up JWT middleware
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Token required' });
  }
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get list of users
  router.get('/list',  async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  

// Authenticate user and return JWT token
router.post('/auth/login', async (req, res) => {
  const { username, password } = await req.body;
console.log(username  + ' ' + password );
console.log(req.body );
  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    console.log('no user');
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if password is correct
  // const passwordMatches = await bcrypt.compare(password, user.password);
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    console.log('password can not Matches');
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate and sign JWT token
  // const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Generate and sign JWT token
  try {
    const userId = await user._id; // Replace with the actual user ID
    // const secretKey = process.env.JWT_SECRET; // Replace with your own secret key
    const secretKey = await 'Friendlydev'; // Replace with your own secret key
    const expiresIn = await '3h'; // Set the token expiration time
  console.log(secretKey );
    if (!secretKey) {
      throw new Error('Missing JWT secret key');
    }
  
    const token = await jwt.sign({ userId }, secretKey, { expiresIn });
    await res.json({ token });
    
    await console.log('Token:', token);
  } catch (error) {
    await     console.error('Error generating JWT token:', error.message);
  }
  
  
  // res.json({ token });
});

// Create new user
router.post('/create', async (req, res) => {
  
  const {
    name,
    email,
    username,
    password,
    role,
       } = req.body;
  console.log(`Username: ${username}, Password: ${password}`);
  

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({ 
    name,
email,
username,
password: hashedPassword ,
role
    });

  try {
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
 
});


module.exports = router;
