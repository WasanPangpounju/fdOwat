const connectionString = require('../config');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

//Connect mongodb
mongoose.connect(connectionString ,{ useNewUrlParser: true, useUnifiedTopology: 
true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Define employee schema
const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String
  },
  department: {
    type: String
  },
  workplace: {
    type: String
  },
  jobtype: {
    type: String
  },
  startjob: {
    type: String
    },
    endjob: {
        type: String
    },
  exceptjob: {
    type: String
  },
  prefix: {
    type: String
  },
  name: {
    type: String 
  },
  lastName: {
    type: String
  },
  nickName: {
    type: String,
  },
  gender: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  age: {
    type: Number
  },
  idCard: {
    type: String,
    required: true,
    unique: true
  },
  ethnicity: {
    type: String,
  },
  religion: {
    type: String,
  },
  maritalStatus: {
    type: String
  },
  militaryStatus: {
    type: String
  },
  address: {
    type: String
  },
  currentAddress: {
    type: String
  },
  phoneNumber: {
    type: String,
    match: /^[0-9]{10}$/ // Regular expression for 10-digit phone number
  },
  emergencyContactNumber: {
    type: String,
    match: /^[0-9]{10}$/ // Regular expression for 10-digit phone number
  },
  idLine: {
    type: String
  },
  vaccination: [] ,
  treatmentRights: {
    type: String
  }
  
});

// Create the Employee model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);


// Get list of employees
  router.get('/list',  async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
  });

  // Get  employee by Id
  router.get('/:employeeId',  async (req, res) => {
      try {
        const employee = await Employee.findOne({ employeeId: req.params.employeeId });
        if (employee) {
          res.json(employee);
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    
  });


router.post('/search', async (req, res) => {
  try {
    const { employeeId, name, idCard, workPlace } = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
//{ $regex: name, $options: 'i' };
    }

    if (idCard) {
      query.idCard = idCard;
    }

    if (workPlace) {
      query.workPlace = { $regex: workPlace, $options: 'i' };
    }

    console.log('Search Parameters:');
    console.log({ employeeId, name, idCard, workPlace });

    console.log('Constructed Query:');
    console.log(query);
if(employeeId == '' && name  == '' && idCard  == '' && workPlace  == ''){
    res.status(200).json({ });
}

    // Query the employee collection for matching documents
    const employees = await Employee.find(query);

    console.log('Search Results:');
    console.log(employees);
let textSearch  = 'test';
    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create new employee
router.post('/create', async (req, res) => {
  
  const {
    employeeId,
    position ,
     department ,
         workplace, 
    jobtype ,
    startjob,
    endjob,
   exceptjob,
   prefix,
   name,
   lastName,
   nickName,
   gender,
   dateOfBirth,
   age,
   idCard,
   ethnicity,
   religion,
   maritalStatus,
   militaryStatus,
   address,
   currentAddress,
   phoneNumber,
   emergencyContactNumber,
   idLine,
   vaccination,
   treatmentRights
       } = req.body;
  console.log(`Name: ${name}, Id card: ${idCard}`);


  // Create employee
  const employee = new Employee({ 
     employeeId,
     position ,
      department ,
          workplace, 
     jobtype ,
     startjob,
     endjob,
    exceptjob,
    prefix,
    name,
    lastName,
    nickName,
    gender,
    dateOfBirth,
    age,
    idCard,
    ethnicity,
    religion,
    maritalStatus,
    militaryStatus,
    address,
    currentAddress,
    phoneNumber,
    emergencyContactNumber,
    idLine,
    vaccination,
    treatmentRights
    });

  try {
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
 
});


//Update Employee data
router.put('/update/:_id', async (req, res) => {
    const employeeIdToUpdate = req.params._id;
    const updateFields = req.body;

    try {
        // Find the resource by ID and update it
        const updatedResource = await Employee.findByIdAndUpdate(
            employeeIdToUpdate,
            updateFields,
            { new: true } // To get the updated document as the result
        );
        if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Send the updated resource as the response
        res.json(updatedResource);


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
