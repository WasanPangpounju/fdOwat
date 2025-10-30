const connectionString = require('../config');
const sURL = 'http://localhost:3000';

const timerecordEmployee = require('./models/periodtimerecordModel');
const workplaceTimerecords = require('./models/periodworkplacetimerecordModel');

const axios = require('axios');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { months } = require('moment');


//Connect mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true, useUnifiedTopology:
    true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/listemp', async (req, res) => {
  try {
    // Fetch the data first
    const workplaceTimeRecordData = await timerecordEmployee.find();

    // Delete all data
    // await timerecordEmployee.deleteMany();

    // console.log(`Deleted ${workplaceTimeRecordData.employee_record.length} records.`);
    workplaceTimeRecordData.map(item => {
    console.log(`Deleted ${item.employee_record.length} records.`);

    })
    await res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;