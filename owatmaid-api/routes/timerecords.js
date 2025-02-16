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


// Define time record schema for workplace
const workplaceTimerecordSchema = new mongoose.Schema({
  timerecordId: String,
  workplaceId: String,
  workplaceName: String,
  wGroup: String,
  date: String,
  employeeRecord: [{
    staffId: String,
    staffName: String,
    shift: String,
    startTime: String,
    endTime: String,
    allTime: String,
    otTime: String,
    selectotTime: String,
    selectotTimeOut: String,
    cashSalary: String,
    specialtSalary: String,
    specialtSalaryOT: String,
            messageSalary: String,
  }]
});

// Create the workplace record time model based on the schema
const workplaceTimerecord = mongoose.model('workplaceTimerecord', workplaceTimerecordSchema);

// Define time record schema for employee
const employeeTimerecordSchema = new mongoose.Schema({
  timerecordId: String,
  employeeId: String,
  employeeName: String,
  month: String,
  employee_workplaceRecord: [{
    workplaceId: String,
    workplaceName: String,
    wGroup : String,
    date: String,
    shift: String,
    startTime: String,
    endTime: String,
    allTime: String,
    otTime: String,
    selectotTime: String,
    selectotTimeOut: String,
    cashSalary: String,
specialtSalary: String,
specialtSalaryOT: String,
        messageSalary: String,
}]
});

// Create the workplace record time model based on the schema
const workplaceTimerecordEmp = mongoose.model('employeeTimerecord', employeeTimerecordSchema );

//======test 
router.get('/listempdeletexx', async (req, res) => {
  try {
    // Fetch the data first
    const workplaceTimeRecordData = await timerecordEmployee.find();

    // Delete all data
    await timerecordEmployee.deleteMany();

    // console.log(`Deleted ${workplaceTimeRecordData.length} records.`);
    await res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get list of employeeTimerecords
router.get('/listemptest', async (req, res) => {
  try {
    // Fetch the data first
    const workplaceTimeRecordData = await timerecordEmployee.find();
    // console.log(workplaceTimeRecordData[0].employee_workplaceRecord );

console.log(workplaceTimeRecordData.length);
    res.json(workplaceTimeRecordData );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/listdeletexx', async (req, res) => {

  try {
    // Fetch the data first
    const workplaceTimeRecordData = await workplaceTimerecords.find();

    // Delete all data
    await workplaceTimerecords.deleteMany();

    // console.log(`Deleted ${workplaceTimeRecordData.length} records.`);
    res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/timerecordempdelete', async (req, res) => {
  const { timerecordId, month, employeeId } = req.query;

  if (!timerecordId || !month || !employeeId) {
    return res.status(400).send({ message: 'year, month, and employeeId are required.' });
  }

  try {
    // Delete documents based on the provided year, month, and employeeId
    const result = await workplaceTimerecordEmp.deleteMany({ timerecordId, month, employeeId });

    // Fetch the remaining documents to send back in the response
    const remainingData = await workplaceTimerecordEmp.find();

    res.json({
      message: `${result.deletedCount} document(s) were deleted.`,
      remainingData
    });
  } catch (err) {
    console.error('Error deleting documents:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get list of workplaceTimerecords
router.get('/list', async (req, res) => {
  const workplaceTimeRecordData = await workplaceTimerecord.find();
  res.json(workplaceTimeRecordData);
});


// Get list of employeeTimerecords
router.get('/listemp', async (req, res) => {
  try {
    // Fetch the data first
    const workplaceTimeRecordData = await workplaceTimerecordEmp.find();
    // console.log(workplaceTimeRecordData[0].employee_workplaceRecord );

console.log(workplaceTimeRecordData.length);
    res.json(workplaceTimeRecordData );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//======test 
router.get('/listempdelete', async (req, res) => {
  try {
    // Fetch the data first
    const workplaceTimeRecordData = await workplaceTimerecordEmp.find();

    // Delete all data
    await workplaceTimerecordEmp.deleteMany();

    // console.log(`Deleted ${workplaceTimeRecordData.length} records.`);
    res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/listdelete', async (req, res) => {

  try {
    // Fetch the data first
    const workplaceTimeRecordData = await workplaceTimerecord.find();

    // Delete all data
    await workplaceTimerecord.deleteMany();

    // console.log(`Deleted ${workplaceTimeRecordData.length} records.`);
    res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get  workplace time record by WorkplaceTimeRecord Id
router.get('/:workplaceTimeRecordId', async (req, res) => {
  try {
    const workplaceTimeRecordData = await workplaceTimerecord.findOne({ workplaceTimeRecordId: req.params.workplaceTimeRecordId });

    if (workplaceTimeRecordData) {
      res.json(workplaceTimeRecordData );
    } else {
      res.status(404).json({ error: 'workplace not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});



// Get  employee time record by employeeTimeRecord Id
router.get('/searchid/:employeeTimeRecordId', async (req, res) => {
  try {
    const employeeTimeRecordData = await workplaceTimerecordEmp.findOne({ employeeTimeRecordId: req.params.employeeTimeRecordId});
    if (workplaceTimeRecordData) {
      res.json(employeeTimeRecordData);
    } else {
      res.status(404).json({ error: 'workplace not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/search', async (req, res) => {
  try {
    const { workplaceId,
      workplaceName,
      wGroup ,
      date} = req.body;
    // Construct the search query based on the provided parameters
    const query = {};

    if (workplaceId !== '') {
      query.workplaceId = workplaceId;
    }


    if (workplaceName !== '') {
      query.workplaceName = { $regex: new RegExp(workplaceName, 'i') };
    }

    if (wGroup !== '') {
      query.wGroup = { $regex: new RegExp(wGroup , 'i') };
    }

    if (date !== '') {
      query.date= date;
    }
console.log('query.date ' + query.date);
    // console.log('Constructed Query:');
    // console.log(query);

    if (workplaceId == '' && workplaceName == '' && date == '') {
      res.status(200).json({});
    }

    // Query the workplace collection for matching documents
    const recordworkplace  = await workplaceTimerecord.find(query);

    await console.log('Search Results:');
    await console.log(recordworkplace  );
    let textSearch = 'workplace';
    await res.status(200).json({ recordworkplace  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//search employee timerecord 
router.post('/searchemp', async (req, res) => {
  try {
    const { employeeId,
      employeeName,
      month,
      timerecordId} = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId !== '') {
      query.employeeId= employeeId;
    }


    if (employeeName !== '') {
      query.employeeName = { $regex: new RegExp(employeeName, 'i') };
    }

    if (month !== '') {
      //query.month = new Date(date);
      query.month = { $regex: new RegExp(month , 'i') };
    }

    if (timerecordId !== '') {
      //query.month = new Date(date);
      query.timerecordId = { $regex: new RegExp(timerecordId , 'i') };
    }

    // console.log('Constructed Query:');
    // console.log(query);

    if (employeeId == '' && employeeName == '' && month == '' && timerecordId == '') {
      res.status(200).json({});
    }

    // Query the workplace collection for matching documents
    const recordworkplace  = await workplaceTimerecordEmp.find(query);

    // await console.log('Search Results:');
    // await console.log(recordworkplace  );
    let textSearch = 'workplace';
    await res.status(200).json({ recordworkplace  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create new employee timerecord 
router.post('/createemp', async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  //const timerecordId = currentYear;

  const {
timerecordId,
    employeeId,
    employeeName,
    month,
    employee_workplaceRecord
  } = req.body;


  // Create workplace
  const workplaceTimeRecordData = new workplaceTimerecordEmp({
timerecordId,
    employeeId,
    employeeName,
    month,
    employee_workplaceRecord
  });
console.log(workplaceTimeRecordData );

  try {
    // Delete existing records for the same employee and month timerecordId
    await workplaceTimerecordEmp.deleteMany({
      timerecordId,
      employeeId,
      employeeName,
      month    });
      
    await workplaceTimeRecordData.save();

    //save or update to workplace timeRecord
    for (const record of employee_workplaceRecord) {
      const { workplaceId, wGroup, date } = record;
      const wdate = await month + '/' + date + '/' + timerecordId;

      let workplaceRecord = await workplaceTimerecord.findOne({timerecordId: timerecordId,workplaceId: workplaceId, wGroup: wGroup,date:  wdate });

      if (workplaceRecord) {
        
        // If workplace record exists, update employeeRecord array
        const existingEmployeeIndex = workplaceRecord.employeeRecord.findIndex(emp => emp.staffId === employeeId);
        if (existingEmployeeIndex !== -1) {
                    // Update existing employee record

        }

                
      } else {
                  // Add new employee record
                  workplaceRecord = new workplaceTimerecord({
                    timerecordId,
                    workplaceId,
                    workplaceName,
                    wGroup,
                    date,
                    employeeRecord: [{
                      staffId: employeeId,
                      staffName: employeeName,
                      ...record
                    }]
                  });
          
      }
      await workplaceRecord.save();

    }

    
    await res.json(workplaceTimeRecordData);

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }

});


// // Update a employeeTimeRecordData  by its employeeTimeRecordData  
// router.put('/updateemp/:employeeRecordId', async (req, res) => {
//   const employeeIdToUpdate = req.params.employeeRecordId;
//   const updateFields = req.body;

//   try {
//     // Find the resource by ID and update it
//     const updatedResource = await workplaceTimerecordEmp.findByIdAndUpdate(
//       employeeIdToUpdate,
//       updateFields,
//       { new: true } // To get the updated document as the result
//     );
//     if (!updatedResource) {
//       return res.status(404).json({ message: 'Resource not found' });
//     }

//     // Send the updated resource as the response
//     res.json(updatedResource);


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// Delete all records by timerecordId, employeeId, and month, then save a new record
router.put('/updateemp/:employeeRecordId', async (req, res) => {
  const employeeIdToUpdate = await req.params.employeeRecordId;
  const updateFields = await req.body;

  try {
    // // Find the existing record to get timerecordId, employeeId, and month
    // const existingRecord = await workplaceTimerecordEmp.findById(employeeIdToUpdate);

    // if (!existingRecord) {
    //   return res.status(404).json({ message: 'Resource not found' });
    // }
    
    // // Delete all records that match timerecordId, employeeId, and month
    // await workplaceTimerecordEmp.deleteMany({
    //   timerecordId: existingRecord.timerecordId,
    //   employeeId: existingRecord.employeeId,
    //   month: existingRecord.month,
    // });
    await workplaceTimerecordEmp.deleteMany({
      timerecordId: updateFields.timerecordId,
      employeeId: updateFields.employeeId,
      month: updateFields.month,
    });
    
        const newRecord = await new workplaceTimerecordEmp(updateFields);
    // Create a new record with updated fields
    // const newRecord = await new workplaceTimerecordEmp({
    //   timerecordId: updateFields.timerecordId || existingRecord.timerecordId,
    //   employeeId: updateFields.employeeId || existingRecord.employeeId,
    //   employeeName: updateFields.employeeName || existingRecord.employeeName,
    //   month: updateFields.month || existingRecord.month,
    //   employee_workplaceRecord: updateFields.employee_workplaceRecord || existingRecord.employee_workplaceRecord
    // });

    // Save the new record
    const savedRecord = await newRecord.save();

    // Respond with the newly created record
    await res.status(201).json(savedRecord);
  } catch (error) {
await    console.error(error);
    await res.status(500).json({ error: 'Internal server error' });
  }
});


async function setToWorkplace(selectWorkplaceId, selectworkplaceName, selectMonth, workplaceTimeRecordData) {
  
}


async function setToEmployee(selectWorkplaceId, selectworkplaceName, selectWGroup, selectMonth, workplaceTimeRecordData) {
  console.log('setToEmployee working');
  const dateParts = selectMonth.split("/");
  const workplaceId = selectWorkplaceId;
  const workplaceName = selectworkplaceName;
  const month = dateParts[1];
  const day = dateParts[0];

  for (const element of workplaceTimeRecordData) {
    if (element.staffId !== '') {
      try {
        const timerecordId_year = dateParts[2];
        const year= timerecordId_year;

        const query = {
          year: year,
          employeeId: element.employeeId,
          month: { $regex: new RegExp(month, 'i') }
        };

        const recordworkplace = await timerecordEmployee.findOne(query);

        if (recordworkplace) {
          // Employee time record exists, update employee_workplaceRecord
          recordworkplace.employee_workplaceRecord.push({
            'workplaceId': workplaceId,
            'workplaceName': workplaceName,
            'wGroup': selectWGroup || '',
            'date': day,
            'shift': element.shift,
            'startTime': element.startTime,
            'endTime': element.endTime,
            'totalTime': element.totalTime,
            'startOtTime': element.startOtTime,
            'endOtTime': element.endOtTime,
            'totalOtTime': element.totalOtTime,
            'cashSalary': element.cashSalary,
            'specialtSalary': element.specialtSalary,
            'specialtSalaryOT': element.specialtSalaryOT,
                    'messageSalary': element.messageSalary,
          });

          await recordworkplace.save();
          console.log('Employee time record updated successfully.');
        } else {
          // Employee time record does not exist, create a new one
          const timerecordId_year = dateParts[2];
          const year= timerecordId_year;
          const employeeId = element.employeeId ;
          const employeeName = element.employeeName;

          const employee_record = {
            'workplaceId': workplaceId,
            'workplaceName': workplaceName,
            'wGroup': selectWGroup || '',
            'date': day,
            'shift': element.shift,
            'startTime': element.startTime,
            'endTime': element.endTime,
            'totalTime': element.totalTime,
            'startOtTime': element.startOtTime,
            'endOtTime': element.endOtTime,
            'totalOtTime': element.totalOtTime,
            'cashSalary': element.cashSalary,
            'specialtSalary': element.specialtSalary,
            'specialtSalaryOT': element.specialtSalaryOT,
                    'messageSalary': element.messageSalary,
          };

          // Create new employee time record
          const newEmployeeTimeRecord = new timerecordEmployee({
            year,
            employeeId,
            employeeName,
            month,
            employee_record 
          });

          await newEmployeeTimeRecord.save();
          console.log('New employee time record created successfully.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Create new workplace
router.post('/create', async (req, res) => {
  try {
    const {
      workplaceId,
      workplaceName,
      wGroup ,
      date,
      employeeRecord
    } = req.body;

    // Filter out employeeRecord objects where staffId is null
    const filteredEmployeeRecord = employeeRecord.filter(record => record.staffId !== '');

    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const timerecordId = currentYear;

    // Create workplace with filtered employeeRecord array
    const workplaceTimeRecordData = new workplaceTimerecord({
      timerecordId,
      workplaceId,
      workplaceName,
      wGroup ,
      date,
      employeeRecord: filteredEmployeeRecord
    });

    const ans = await workplaceTimeRecordData.save();
    if (ans) {
      console.log('Create workplace time record success');
      await setToEmployee(workplaceId, workplaceName, wGroup, date, filteredEmployeeRecord);
    }

    res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// Update existing records in workplaceTimerecordEmp
router.put('/update/:workplaceRecordId', async (req, res) => {
  const workplaceIdToUpdate = req.params.workplaceRecordId;
  const updateFields = req.body;

  try {
    // Find the resource by ID and update it
    const updatedResource = await workplaceTimerecord.findByIdAndUpdate(
      workplaceIdToUpdate,
      updateFields,
      { new: true } // To get the updated document as the result
    );
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update records in workplaceTimerecordEmp using setToEmployee with updateRecord set to true
    await setToEmployee(updatedResource.workplaceId, updatedResource.workplaceName, updatedResource.date, updatedResource.employeeRecord, true);

    // Send the updated resource as the response
    res.json(updatedResource);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/updateemp/:employeeId/timerecord/:recordId', async (req, res) => {
  const { employeeId, recordId } = req.params;
  const updatedRecord = req.body;

  try {
    // Find the employee's timerecord by employeeId and recordId
    const result = await workplaceTimerecordEmp.findOneAndUpdate(
      { employeeId, 'employee_workplaceRecord._id': recordId },
      {
        $set: {
          'employee_workplaceRecord.$.workplaceId': updatedRecord.workplaceId,
          'employee_workplaceRecord.$.workplaceName': updatedRecord.workplaceName,
          // Add other fields that you want to update
        }
      },
      { new: true } // Returns the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Time record not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//create all update conclude
async function createConclude(year , month , employeeId  , data ){
  const dataSearch = await {
    year: year, 
    month: month,
    concludeDate: "",
    employeeId: employeeId
  };
const newConclude = {};


try {
  const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);
  const resultWorkplace = await axios.get(sURL + '/workplace/list');
  const workplaceList = await resultWorkplace.data;
  // console.log(workplaceList[0].workplaceId);

// let workplaceTmp = await workplaceList.find(item => item.workplaceId == '1001');
// await console.log(workplaceTmp );  

  if (responseConclude.data.recordConclude.length > 0) {
// conclude created
// console.log(responseConclude.data.recordConclude);

  } else{ 
//No data 
newConclude.year = await year;
  newConclude.month = await month;

  const currentDateTmp = await new Date();
const dayTmp = await currentDateTmp.getDate();
const monthTmp = await currentDateTmp.getMonth() + 1; // Month is zero-indexed, so we add 1
const yearTmp = await currentDateTmp.getFullYear();
const formattedDateTmp = await `${dayTmp}/${monthTmp}/${yearTmp}`;

  newConclude.concludeDate = await formattedDateTmp ;
  newConclude.employeeId = await employeeId;

  const concludeRecordTmp = [];

  //loop day of month
  for(let i = 1; i <= new Date(year, month, 0).getDate(); i++){
let dayTemp = await i.toString().padStart(2, '0') ;
let dataTmp = await data.filter(record => record.date === dayTemp );
let tmp = {};
// console.log(dataTmp );

//check date > 20 then new conclude next month
if(dayTemp <=  20 ) {

if(dataTmp.length !== 0){
  //timeRecord of date is setฃ
  let workplaceTmp = await workplaceList.find(item => item.workplaceId == dataTmp[0].workplaceId );

  tmp.day = await `${dayTemp}/${monthTmp}/${yearTmp + 543}`;
  tmp.workplaceId = await dataTmp[0].workplaceId || '';
  tmp.allTimes = await dataTmp[0].allTime || '';
  tmp.workRate = await '';
  tmp.otTimes= await dataTmp[0].otTime || '';
  tmp.workRateOT = await '';
  tmp.addSalaryDay = await '';

await console.log(dataTmp[0].workplaceId);

  await concludeRecordTmp.push(tmp);

} else {
  //timeRecord of date is not set
  tmp.day = await `${dayTemp}/${monthTmp}/${yearTmp + 543}`;
  tmp.workRateOT = await "";
  tmp.addSalaryDay = await "";
  await concludeRecordTmp.push(tmp);
}
} else {

}
  }

  newConclude.concludeRecord = await concludeRecordTmp;
//   concludeRecord: [{ 
//   day: String, 
//   workplaceId: String, 
//   allTimes: String, 
//   workRate: String, 
//   otTimes: String, 
//   workRateOT: String, 
//   addSalaryDay: String 
// }],
// createBy: String
// });
await console.log(JSON.stringify(newConclude,null,2));

  }

} catch (e) {
console.log(e);
}

}

//get list employee timeRecord by year and month
// GET timerecords by timerecordId and month
router.get('/listmonth', async (req, res) => {
  const { timerecordId, month } = req.query;

  try {
    const records = await EmployeeTimerecord.find({ timerecordId, month });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========

//search timerecordEmployee 
router.post('/searchtimerecordemployee', async (req, res) => {
  try {
    const { employeeId,
      employeeName,
      month,
     year} = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId !== '') {
      query.employeeId= employeeId;
    }


    if (employeeName !== '') {
      query.employeeName = { $regex: new RegExp(employeeName, 'i') };
    }

    if (month !== '') {
      //query.month = new Date(date);
      query.month = { $regex: new RegExp(month , 'i') };
    }

    if (year!== '') {
      query.year = { $regex: new RegExp(year , 'i') };
    }

    if (employeeId == '' && employeeName == '' && month == '' && year== '') {
      res.status(200).json({});
    }

    // Query the workplace collection for matching documents
    const result = await timerecordEmployee.find(query);

    await res.status(200).json({ result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new timerecordEmployee 
router.post('/createtimerecordemployee', async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const {
year,
    employeeId,
    employeeName,
    month,
    employee_record
  } = req.body;


  // Create timerecordEmployee 
  const timerecordEmployeeData = new timerecordEmployee({
year,
    employeeId,
    employeeName,
    month,
    employee_record
  });
// console.log(workplaceTimeRecordData );

  try {
    // Delete existing records for the same employee and month timerecordId
    await timerecordEmployee.deleteMany({
      year,
      employeeId,
      employeeName,
      month    });
      
    await timerecordEmployeeData.save();

    
    await res.json(timerecordEmployeeData);

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }

});

// Route to delete all matching records and save a new one
router.put("/updatetimerecordemployee/:employeeRecordId", async (req, res) => {
  try {
    const { year, employeeId, month } = req.body;

    console.log("🔍 Finding records to delete for:", { year, employeeId, month });

    // Delete all matching records
    const deleteResult = await timerecordEmployee.deleteMany({ year, employeeId, month });

    console.log(`🗑️ Deleted ${deleteResult.deletedCount} records`);

    // Create a new record with updated fields
    const newRecord = new timerecordEmployee(req.body);

    // Save the new record
    const employee_record = await newRecord.save();

    console.log("✅ New record saved:", employee_record);

    // Respond with the newly created record
    res.status(201).json(employee_record);
  } catch (error) {
    console.error("🔥 Error updating record:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// ========= workplace

// Create new workplaceTimerecords
router.post('/createworkplacetimerecords', async (req, res) => {
  try {
    const {
      workplaceId,
      workplaceName,
      wGroup ,
      date,
      employeeRecord
    } = req.body;

    // Filter out employeeRecord objects where staffId is null
    const filteredEmployeeRecord = employeeRecord.filter(record => record.employeeId !== '');

    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const year = currentYear;

    // Create workplace with filtered employeeRecord array
    const workplaceTimeRecordData = new workplaceTimerecords({
      workplaceId,
      workplaceName,
      wGroup ,
      date,
      employeeRecord: filteredEmployeeRecord
    });

    const ans = await workplaceTimeRecordData.save();
    if (ans) {
      console.log('Create workplace time record success');
      await setToEmployee(workplaceId, workplaceName,wGroup , date, filteredEmployeeRecord);
    }

    res.json(workplaceTimeRecordData);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

//search
router.post('/searchworkplacetimerecords', async (req, res) => {
  try {
    const { workplaceId,
      workplaceName,
      wGroup ,
      date} = req.body;
    // Construct the search query based on the provided parameters
    const query = {};

    if (workplaceId !== '') {
      query.workplaceId = workplaceId;
    }


    if (workplaceName !== '') {
      query.workplaceName = { $regex: new RegExp(workplaceName, 'i') };
    }

    if (wGroup !== '') {
      query.wGroup = wGroup;
      // { $regex: new RegExp(wGroup , 'i') };
    }

    if (date !== '') {
      query.date= date;
    }
console.log('query.date ' + query.date);
    // console.log('Constructed Query:');
    // console.log(query);

    if (workplaceId == '' && workplaceName == '' && date == '') {
      res.status(200).json({});
    }

    // Query the workplace collection for matching documents
    const recordworkplace  = await workplaceTimerecords.find(query);

    await console.log('Search Results:');
    await console.log(recordworkplace  );
    let textSearch = 'workplace';
    await res.status(200).json({ recordworkplace  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete existing records by workplaceId, wGroup, and date, then save a new one
router.put('/updateworkplacetimerecords/:workplaceRecordId', async (req, res) => {
  const workplaceIdToUpdate = req.params.workplaceRecordId;
  const newData = req.body; // New data to insert

  try {
    // Step 1: Delete records matching workplaceId, wGroup, and date
    const deleteResult = await workplaceTimerecords.deleteMany({
      workplaceId: newData.workplaceId,
      wGroup: newData.wGroup,
      date: newData.date,
    });

    console.log(`🗑️ Deleted ${deleteResult.deletedCount} records`);

    // Step 2: Create a new record with the updated data
    const newRecord = new workplaceTimerecords(newData);
    const updatedResource = await newRecord.save();

    // Step 3: Update workplaceTimerecordEmp (if needed)
    await setToEmployee(
      updatedResource.workplaceId,
      updatedResource.workplaceName,
      updatedResource.wGroup,
      updatedResource.date,
      updatedResource.employeeRecord
    );

    // Respond with the newly created record
    res.status(201).json(updatedResource );
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Update existing records in workplaceTimerecordEmp
// router.put('/updateworkplacetimerecords/:workplaceRecordId', async (req, res) => {
//   const workplaceIdToUpdate = req.params.workplaceRecordId;
//   const updateFields = req.body;

//   try {
//     // Find the resource by ID and update it
//     const updatedResource = await workplaceTimerecords.findByIdAndUpdate(
//       workplaceIdToUpdate,
//       updateFields,
//       { new: true } // To get the updated document as the result
//     );
//     if (!updatedResource) {
//       return res.status(404).json({ message: 'Resource not found' });
//     }

//     // Update records in workplaceTimerecordEmp using setToEmployee with updateRecord set to true
//     await setToEmployee(updatedResource.workplaceId, updatedResource.workplaceName, updatedResource.wGroup, updatedResource.date, updatedResource.employeeRecord);

//     // Send the updated resource as the response
//     res.json(updatedResource);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;
