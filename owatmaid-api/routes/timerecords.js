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
    // await workplaceTimerecords.deleteMany();

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
// router.get('/:workplaceTimeRecordId', async (req, res) => {
//   try {
//     const workplaceTimeRecordData = await workplaceTimerecord.findOne({ workplaceTimeRecordId: req.params.workplaceTimeRecordId });

//     if (workplaceTimeRecordData) {
//       res.json(workplaceTimeRecordData );
//     } else {
//       res.status(404).json({ error: 'workplace not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }

// });



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


const setToWorkplaceTimerecords = async (employeeId, employeeName, employee_record, year, month) => {
  try {
    if (!employee_record || employee_record.length === 0) {
      console.log(`⚠️ No employee records provided for Employee ID: ${employeeId}. Skipping update.`);
      return;
    }

    for (const record of employee_record) {
      const { workplaceId, workplaceName, wGroup, date, shift, startTime, endTime, totalTime, 
        beforeStartOtTime, beforeEndOtTime, beforeTotalOtTime, 
        startOtTime, endOtTime, totalOtTime, cashSalary, specialtSalary, specialtSalaryOT, messageSalary } = record;

      let numericDate = Number(date);
      let numericMonth = Number(month);
      let numericYear = Number(year);

      // Adjust month if date is 21-31
      if (numericDate >= 21) {
        numericMonth -= 1;
        if (numericMonth === 0) { 
          numericMonth = 12;
          numericYear -= 1;
        }
      }

      let formattedDate = `${String(numericDate)}/${String(numericMonth).padStart(2, '0')}/${numericYear}`;

      // Find if this workplace record exists
      let workplaceRecord = await workplaceTimerecords.findOne({
        year: numericYear,
        workplaceId,
        date: formattedDate
      });

      if (workplaceRecord) {
        // Update existing employee data
        let updatedEmployeeRecords = workplaceRecord.employeeRecord.filter(emp => emp.employeeId !== employeeId);
// console.log('updatedEmployeeRecords ' + updatedEmployeeRecords .length);

        if (shift || startTime || endTime) {
          updatedEmployeeRecords.push({
            employeeId,
            employeeName,
            shift,
            startTime,
            endTime,
            totalTime,
            beforeStartOtTime,
            beforeEndOtTime,
            beforeTotalOtTime,
            startOtTime,
            endOtTime,
            totalOtTime,
            cashSalary,
            specialtSalary,
            specialtSalaryOT,
            messageSalary
          });
        }

        // 🚨 **If `employeeRecord` is empty after update, delete the workplace record**
        if (updatedEmployeeRecords.length === 0) {
          await workplaceTimerecords.findByIdAndDelete(workplaceRecord._id);
          console.log(`🗑️ Deleted workplace record for workplaceId: ${workplaceId} on ${formattedDate} because no employees exist.`);
          continue;
        }

        // // Update Workplace Record
        // await workplaceTimerecords.findByIdAndUpdate(workplaceRecord._id, { employeeRecord: updatedEmployeeRecords }, { new: true });
        // console.log(`✅ Updated workplace record for workplaceId: ${workplaceId} on ${formattedDate}`);
// Update Workplace Record - First clear old data, then update
await workplaceTimerecords.findByIdAndUpdate(workplaceRecord._id, { $set: { employeeRecord: [] } });

await workplaceTimerecords.findByIdAndUpdate(
  workplaceRecord._id,
  { $set: { employeeRecord: updatedEmployeeRecords } },
  { new: true }
);

console.log(`✅ Completely replaced workplace record for workplaceId: ${workplaceId} on ${formattedDate}`);

      } else {
        // 🚨 **Skip creation if `employee_record` is empty**
        if (employee_record.length === 0) {
          console.log(`⚠️ Skipping creation for workplaceId: ${workplaceId} on ${formattedDate} because employeeRecord is empty.`);
          continue;
        }

        // Create new workplace record
        const newWorkplaceRecord = new workplaceTimerecords({
          year: numericYear,
          workplaceId,
          workplaceName,
          wGroup,
          date: formattedDate,
          employeeRecord: [{
            employeeId,
            employeeName,
            shift,
            startTime,
            endTime,
            totalTime,
            beforeStartOtTime,
            beforeEndOtTime,
            beforeTotalOtTime,
            startOtTime,
            endOtTime,
            totalOtTime,
            cashSalary,
            specialtSalary,
            specialtSalaryOT,
            messageSalary
          }]
        });

        await newWorkplaceRecord.save();
        console.log(`✅ Created new workplace record for workplaceId: ${workplaceId} on ${formattedDate}`);
      }
    }
  } catch (error) {
    console.error("🔥 Error in setToWorkplaceTimerecords:", error);
  }
};

// async function setToWorkplaceTimerecords(employeeId, employeeName, employeeRecords, year, month) {
//   console.log("🔄 Processing workplace records...");

//   try {
//     for (const record of employeeRecords) {
//       let {
//         workplaceId,
//         workplaceName,
//         wGroup,
//         date,
//         shift,
//         startTime,
//         endTime,
//         totalTime,
//         beforeStartOtTime,
//         beforeEndOtTime,
//         beforeTotalOtTime,
//         startOtTime,
//         endOtTime,
//         totalOtTime,
//         cashSalary,
//         specialtSalary,
//         specialtSalaryOT,
//         messageSalary
//       } = record;

//       // Ensure date is in "DD/MM/YYYY" format
//       const formattedDate = `${date}/${month}/${year}`;

//       // 🔍 Check if a workplace record exists for this date
//       let workplaceRecord = await workplaceTimerecords.findOne({
//         workplaceId,
//         wGroup,
//         date: formattedDate
//       });

//       if (workplaceRecord) {
//         // ✅ Check if the employee already exists in the record
//         const existingEmployeeIndex = workplaceRecord.employeeRecord.findIndex(emp => emp.employeeId === employeeId);

//         if (existingEmployeeIndex !== -1) {
//           // 🔄 Update existing employee record
//           workplaceRecord.employeeRecord[existingEmployeeIndex] = {
//             employeeId,
//             employeeName,
//             shift,
//             startTime,
//             endTime,
//             totalTime,
//             beforeStartOtTime,
//             beforeEndOtTime,
//             beforeTotalOtTime,
//             startOtTime,
//             endOtTime,
//             totalOtTime,
//             cashSalary,
//             specialtSalary,
//             specialtSalaryOT,
//             messageSalary
//           };
//         } else {
//           // ➕ Add new employee record
//           workplaceRecord.employeeRecord.push({
//             employeeId,
//             employeeName,
//             shift,
//             startTime,
//             endTime,
//             totalTime,
//             beforeStartOtTime,
//             beforeEndOtTime,
//             beforeTotalOtTime,
//             startOtTime,
//             endOtTime,
//             totalOtTime,
//             cashSalary,
//             specialtSalary,
//             specialtSalaryOT,
//             messageSalary
//           });
//         }
//       } else {
//         // ❌ Create new workplace record if not found
//         workplaceRecord = new workplaceTimerecords({
//           year,
//           workplaceId,
//           workplaceName,
//           wGroup,
//           date: formattedDate,
//           employeeRecord: [
//             {
//               employeeId,
//               employeeName,
//               shift,
//               startTime,
//               endTime,
//               totalTime,
//               beforeStartOtTime,
//               beforeEndOtTime,
//               beforeTotalOtTime,
//               startOtTime,
//               endOtTime,
//               totalOtTime,
//               cashSalary,
//               specialtSalary,
//               specialtSalaryOT,
//               messageSalary
//             }
//           ]
//         });
//       }

//       // Save updated/new workplace record
//       await workplaceRecord.save();
//       console.log(`✅ Workplace record updated for ${workplaceId} on ${formattedDate}`);
//     }

//     console.log("✅ All workplace records processed successfully!");
//   } catch (error) {
//     console.error("❌ Error processing workplace records:", error);
//   }
// }


async function setToEmployee(selectWorkplaceId, selectworkplaceName, selectWGroup, selectMonth, workplaceTimeRecordData) {
  console.log('setToEmployee working');
  
  const dateParts = selectMonth.split("/");
  const day = parseInt(dateParts[0], 10);
  let year = parseInt(dateParts[2], 10);
  let month = parseInt(dateParts[1], 10); // Month is 1-based (1 = January, 12 = December)

  // Adjust month based on date range
  if (day >= 21) {
    month += 1; // Move to previous month
    if (month === 13) {
      month = '01'; // Wrap around to December
      year += 1; // Adjust year for previous December
    }
  }

  // Convert month to 2-digit format (e.g., '01', '02', ..., '12')
  const formattedMonth = month.toString().padStart(2, '0');

  for (const element of workplaceTimeRecordData) {
    if (element.staffId !== '') {
      try {
        const query = {
          year: year.toString(),
          employeeId: element.employeeId,
          month: { $regex: new RegExp(`^${formattedMonth}$`, 'i') } // Exact match with two-digit month
        };

        const recordworkplace = await timerecordEmployee.findOne(query);

        if (recordworkplace) {
          // Employee time record exists, update employee_workplaceRecord
          recordworkplace.employee_record.push({
            'workplaceId': selectWorkplaceId,
            'workplaceName': selectworkplaceName,
            'wGroup': selectWGroup || '',
            'date': day,
            'shift': element.shift,
            'startTime': element.startTime,
            'endTime': element.endTime,
            'totalTime': element.totalTime,
            'beforeStartOtTime': element.beforeStartOtTime,
            'beforeEndOtTime': element.beforeEndOtTime,
            'beforeTotalOtTime': element.beforeTotalOtTime,
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
          const newEmployeeTimeRecord = new timerecordEmployee({
            year: year.toString(),
            employeeId: element.employeeId,
            employeeName: element.employeeName,
            month: formattedMonth,
            employee_record: [{
              'workplaceId': selectWorkplaceId,
              'workplaceName': selectworkplaceName,
              'wGroup': selectWGroup || '',
              'date': day,
              'shift': element.shift,
              'startTime': element.startTime,
              'endTime': element.endTime,
              'totalTime': element.totalTime,
              'beforeStartOtTime': element.beforeStartOtTime,
              'beforeEndOtTime': element.beforeEndOtTime,
              'beforeTotalOtTime': element.beforeTotalOtTime,
              'startOtTime': element.startOtTime,
              'endOtTime': element.endOtTime,
              'totalOtTime': element.totalOtTime,
              'cashSalary': element.cashSalary,
              'specialtSalary': element.specialtSalary,
              'specialtSalaryOT': element.specialtSalaryOT,
              'messageSalary': element.messageSalary,
            }]
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


// async function setToEmployee(selectWorkplaceId, selectworkplaceName, selectWGroup, selectMonth, workplaceTimeRecordData) {
//   console.log('setToEmployee working');
//   const dateParts = selectMonth.split("/");
//   const workplaceId = selectWorkplaceId;
//   const workplaceName = selectworkplaceName;
//   const month = dateParts[1];
//   const day = dateParts[0];

//   for (const element of workplaceTimeRecordData) {
//     if (element.staffId !== '') {
//       try {
//         const timerecordId_year = dateParts[2];
//         const year= timerecordId_year;

//         const query = {
//           year: year,
//           employeeId: element.employeeId,
//           month: { $regex: new RegExp(month, 'i') }
//         };

//         const recordworkplace = await timerecordEmployee.findOne(query);

//         if (recordworkplace) {
//           // Employee time record exists, update employee_workplaceRecord
//           recordworkplace.employee_workplaceRecord.push({
//             'workplaceId': workplaceId,
//             'workplaceName': workplaceName,
//             'wGroup': selectWGroup || '',
//             'date': day,
//             'shift': element.shift,
//             'startTime': element.startTime,
//             'endTime': element.endTime,
//             'totalTime': element.totalTime,
//             'beforeStartOtTime': element.beforeStartOtTime,
//             'beforeEndOtTime': element.beforeEndOtTime,
//             'beforeTotalOtTime': element.beforeTotalOtTime,
//             'startOtTime': element.startOtTime,
//             'endOtTime': element.endOtTime,
//             'totalOtTime': element.totalOtTime,
//             'cashSalary': element.cashSalary,
//             'specialtSalary': element.specialtSalary,
//             'specialtSalaryOT': element.specialtSalaryOT,
//                     'messageSalary': element.messageSalary,
//           });

//           await recordworkplace.save();
//           console.log('Employee time record updated successfully.');
//         } else {
//           // Employee time record does not exist, create a new one
//           const timerecordId_year = dateParts[2];
//           const year= timerecordId_year;
//           const employeeId = element.employeeId ;
//           const employeeName = element.employeeName;

//           const employee_record = {
//             'workplaceId': workplaceId,
//             'workplaceName': workplaceName,
//             'wGroup': selectWGroup || '',
//             'date': day,
//             'shift': element.shift,
//             'startTime': element.startTime,
//             'endTime': element.endTime,
//             'totalTime': element.totalTime,
//             'beforeStartOtTime': element.beforeStartOtTime,
//             'beforeEndOtTime': element.beforeEndOtTime,
//             'beforeTotalOtTime': element.beforeTotalOtTime,
//             'startOtTime': element.startOtTime,
//             'endOtTime': element.endOtTime,
//             'totalOtTime': element.totalOtTime,
//             'cashSalary': element.cashSalary,
//             'specialtSalary': element.specialtSalary,
//             'specialtSalaryOT': element.specialtSalaryOT,
//                     'messageSalary': element.messageSalary,
//           };

//           // Create new employee time record
//           const newEmployeeTimeRecord = new timerecordEmployee({
//             year,
//             employeeId,
//             employeeName,
//             month,
//             employee_record 
//           });

//           await newEmployeeTimeRecord.save();
//           console.log('New employee time record created successfully.');
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
// }

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
    await setToEmployee(updatedResource.workplaceId, updatedResource.workplaceName,updatedResource.wGroup,  updatedResource.date, updatedResource.employeeRecord);

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

router.post('/searchtimerecordmonthyear', async (req, res) => {
  try {
    const { 
      month,
     year} = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (month !== '') {
      query.month = { $regex: new RegExp(month , 'i') };
    }

    if (year !== '') {
      query.year = { $regex: new RegExp(year , 'i') };
    }

    if (month == '' && year == '') {
      res.status(200).json({});
      return;
    }

    // Query the workplace collection for matching documents
    const result = await timerecordEmployee.find(query);

    // ✅ คำนวณ dayType ใหม่ตามลำดับ priority
    if (result && result.length > 0) {
      for (let employee of result) {
        if (employee.employee_record && employee.employee_record.length > 0) {
          for (let record of employee.employee_record) {
            try {
              // ดึงข้อมูล workplace configuration
              const workplaceResponse = await axios.get(`${sURL}/workplace/${record.workplaceId}`);
              const workplace = workplaceResponse.data;
              
              console.log(`🏢 [searchtimerecordemployee] ข้อมูล workplace ${record.workplaceId} ทั้งหมด:`, JSON.stringify(workplace, null, 2));
              
              // สร้างวันที่จาก record
              const recordDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(record.date));
              const dayOfWeek = recordDate.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ..., 6 = เสาร์
              
              // แปลงเลขวันเป็นชื่อวันภาษาไทย
              const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
              const dayName = thaiDays[dayOfWeek];
              
              console.log(`🔍 ตรวจสอบ workplace ${record.workplaceId} วันที่ ${record.date} (${dayName})`);
              
              let newDayType = 'work'; // default เป็น work
              let newCashWorkMul = '1'; // default multiplier
              
              // 🔥 PRIORITY 1: ตรวจสอบ publicHoliday ก่อนเป็นอันดับแรก
              if (workplace.publicHoliday && workplace.publicHoliday.length > 0) {
                const recordDateStr = `${year}-${month.padStart(2, '0')}-${record.date.padStart(2, '0')}`;
                
                const isPublicHoliday = workplace.publicHoliday.some(holiday => {
                  let holidayDateStr = '';
                  if (holiday.date) {
                    // แปลงวันที่ holiday เป็นรูปแบบ YYYY-MM-DD
                    const holidayDate = new Date(holiday.date);
                    if (!isNaN(holidayDate.getTime())) {
                      const year = holidayDate.getFullYear();
                      const month = String(holidayDate.getMonth() + 1).padStart(2, '0');
                      const day = String(holidayDate.getDate()).padStart(2, '0');
                      holidayDateStr = `${year}-${month}-${day}`;
                    }
                  }
                  return holidayDateStr === recordDateStr;
                });
                
                if (isPublicHoliday) {
                  console.log(`🚨 PRIORITY 1: วันที่ ${record.date} เป็นวันหยุดนักขัตฤกษ์ (publicHoliday) - เปลี่ยนเป็น stop`);
                  newDayType = 'stop';
                  newCashWorkMul = '2';
                  
                  // อัปเดตค่าและข้ามการตรวจสอบอื่นๆ
                  if (record.dayType !== newDayType) {
                    console.log(`🔄 อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                    record.dayType = newDayType;
                  }
                  
                  if (record.cashWorkMul !== newCashWorkMul) {
                    console.log(`🔄 อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                    record.cashWorkMul = newCashWorkMul;
                  }
                  
                  continue; // ข้ามการตรวจสอบอื่นๆ เพราะ publicHoliday เป็น priority สูงสุด
                }
              }
              
              // 🔥 PRIORITY 2: ตรวจสอบ dayOffOnly จาก conclude/getWeekendDates 
              try {
                const weekendResponse = await axios.get(`${sURL}/conclude/getWeekendDates?yyyy=${year}&mm=${month.padStart(2, '0')}&workplaceId=${record.workplaceId}`);
                const weekendData = weekendResponse.data;
                
                if (weekendData && weekendData.dayOffOnly && weekendData.dayOffOnly.length > 0) {
                  const recordDateStr = `${year}-${month.padStart(2, '0')}-${record.date.padStart(2, '0')}`;
                  const isDayOffOnly = weekendData.dayOffOnly.includes(recordDateStr);
                  
                  if (isDayOffOnly) {
                    console.log(`🚨 PRIORITY 2: วันที่ ${record.date} อยู่ใน dayOffOnly - เปลี่ยนเป็น stop`);
                    newDayType = 'stop';
                    newCashWorkMul = '2';
                    
                    // อัปเดตค่าและข้ามการตรวจสอบอื่นๆ
                    if (record.dayType !== newDayType) {
                      console.log(`🔄 อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                      record.dayType = newDayType;
                    }
                    
                    if (record.cashWorkMul !== newCashWorkMul) {
                      console.log(`🔄 อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                      record.cashWorkMul = newCashWorkMul;
                    }
                    
                    continue; // ข้ามการตรวจสอบอื่นๆ
                  }
                }
              } catch (weekendError) {
                console.error(`❌ ไม่สามารถดึงข้อมูล dayOffOnly สำหรับ workplace ${record.workplaceId}:`, weekendError.message);
              }
              
              // 🔥 PRIORITY 3: ตรวจสอบการตั้งค่า workTimeDay (เฉพาะถ้าไม่ใช่วันหยุด)
              if (workplace.workTimeDay && workplace.workTimeDay.length > 0) {
                console.log(`🔍 ตรวจสอบ workTimeDay สำหรับ workplace ${record.workplaceId}:`, workplace.workTimeDay);
                
                // ตรวจสอบว่ามีการตั้งค่าให้ทำงานทุกวันหรือไม่ โดยตรวจสอบทุกวัน (0-6)
                const workDays = new Set(); // เก็บวันที่ตั้งค่าเป็น work
                const stopDays = new Set(); // เก็บวันที่ตั้งค่าเป็น stop
                
                workplace.workTimeDay.forEach(config => {
                  const startDayIndex = thaiDays.indexOf(config.startDay);
                  const endDayIndex = thaiDays.indexOf(config.endDay);
                  
                  console.log(`📝 Config: ${config.startDay}(${startDayIndex}) - ${config.endDay}(${endDayIndex}) = ${config.workOrStop}`);
                  
                  if (startDayIndex !== -1 && endDayIndex !== -1) {
                    if (startDayIndex <= endDayIndex) {
                      // ช่วงวันปกติ (เช่น จันทร์-ศุกร์)
                      for (let i = startDayIndex; i <= endDayIndex; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i); // ลบออกจาก stop ถ้ามี
                        } else {
                          stopDays.add(i);
                          workDays.delete(i); // ลบออกจาก work ถ้ามี
                        }
                      }
                    } else {
                      // ช่วงวันข้ามสัปดาห์ (เช่น ศุกร์-อาทิตย์)
                      for (let i = startDayIndex; i <= 6; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i);
                        } else {
                          stopDays.add(i);
                          workDays.delete(i);
                        }
                      }
                      for (let i = 0; i <= endDayIndex; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i);
                        } else {
                          stopDays.add(i);
                          workDays.delete(i);
                        }
                      }
                    }
                  }
                });
                
                console.log(`📊 Work days: [${Array.from(workDays).sort()}], Stop days: [${Array.from(stopDays).sort()}]`);
                
                // ตรวจสอบว่าทุกวัน (0-6) อยู่ใน workDays หรือไม่
                const allDaysAreWork = [0, 1, 2, 3, 4, 5, 6].every(day => workDays.has(day));
                
                if (allDaysAreWork) {
                  console.log(`✅ พบการตั้งค่าทำงานทุกวัน (ครอบคลุม 0-6) - dayType = work`);
                  newDayType = 'work';
                  newCashWorkMul = '1';
                } else {
                  // ตรวจสอบการตั้งค่าสำหรับวันนี้โดยเฉพาะ
                  if (workDays.has(dayOfWeek)) {
                    newDayType = 'work';
                    newCashWorkMul = '1';
                    console.log(`✅ วัน ${dayName} (${dayOfWeek}) ตั้งค่าเป็น work`);
                  } else if (stopDays.has(dayOfWeek)) {
                    newDayType = 'stop';
                    newCashWorkMul = '2';
                    console.log(`✅ วัน ${dayName} (${dayOfWeek}) ตั้งค่าเป็น stop`);
                  } else {
                    console.log(`⚠️ ไม่พบการตั้งค่าสำหรับวัน ${dayName} (${dayOfWeek}) - ใช้ค่าเริ่มต้น: work`);
                    newDayType = 'work';
                    newCashWorkMul = '1';
                  }
                }
              } else {
                console.log(`⚠️ workplace ${record.workplaceId} ไม่มีการตั้งค่า workTimeDay - ถือว่าทุกวันเป็น work`);
                newDayType = 'work';
                newCashWorkMul = '1';
              }
              
              // 🎯 กรณีพิเศษสำหรับ workplace 10493 - บังคับให้เป็น work เสมอ 
              // (publicHoliday และ dayOffOnly จะ continue ไปแล้วข้างต้น ไม่มาถึงจุดนี้)
              if (record.workplaceId === '10493') {
                console.log(`🔧 workplace 10493: บังคับ dayType = work (เดิม: ${newDayType})`);
                newDayType = 'work';
                newCashWorkMul = '1';
              }
              
              // อัปเดตค่า
              if (record.dayType !== newDayType) {
                console.log(`🔄 อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                record.dayType = newDayType;
              }
              
              if (record.cashWorkMul !== newCashWorkMul) {
                console.log(`🔄 อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                record.cashWorkMul = newCashWorkMul;
              }
              
            } catch (workplaceError) {
              console.error(`❌ ไม่สามารถดึงข้อมูล workplace ${record.workplaceId}:`, workplaceError.message);
              // ถ้าดึงข้อมูล workplace ไม่ได้ ให้ใช้กฎพิเศษสำหรับ 10493
              if (record.workplaceId === '10493') {
                console.log(`🔧 fallback สำหรับ workplace 10493: dayType = work`);
                record.dayType = 'work';
                record.cashWorkMul = '1';
              }
            }
          }
        }
      }
    }

    await res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

    // ✅ คำนวณ dayType ใหม่ตามลำดับ priority (เหมือนกับ searchtimerecordmonthyear)
    if (result && result.length > 0) {
      for (let employee of result) {
        if (employee.employee_record && employee.employee_record.length > 0) {
          for (let record of employee.employee_record) {
            try {
              // ดึงข้อมูล workplace   configuration
              const workplaceResponse = await axios.get(`${sURL}/workplace/${record.workplaceId}`);
              const workplace = workplaceResponse.data;
              
              // แปลงเลขวันเป็นชื่อวันภาษาไทย (ประกาศไว้ข้างนอกเพื่อใช้ในหลายที่)
              const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
              
              // สร้างวันที่จาก record
              let recordDate;
              let dayOfWeek = 0;
              let dayName = 'ไม่ทราบ';
              
              try {
                // ตรวจสอบและแปลงค่าวันที่
                const dateValue = parseInt(record.date);
                const monthValue = parseInt(month);
                const yearValue = parseInt(year);
                
                console.log(`📅 [searchtimerecordemployee] พารามิเตอร์วันที่: date=${dateValue}, month=${monthValue}, year=${yearValue}`);
                
                if (!isNaN(dateValue) && !isNaN(monthValue) && !isNaN(yearValue)) {
                  recordDate = new Date(yearValue, monthValue - 1, dateValue);
                  dayOfWeek = recordDate.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ..., 6 = เสาร์
                  
                  dayName = thaiDays[dayOfWeek];
                  
                  console.log(`📅 [searchtimerecordemployee] วันที่สร้างได้: ${recordDate.toDateString()}, dayOfWeek: ${dayOfWeek}, dayName: ${dayName}`);
                } else {
                  console.error(`❌ [searchtimerecordemployee] ข้อมูลวันที่ไม่ถูกต้อง: date=${record.date}, month=${month}, year=${year}`);
                }
              } catch (dateError) {
                console.error(`❌ [searchtimerecordemployee] เกิดข้อผิดพลาดในการสร้างวันที่:`, dateError);
              }
              
              console.log(`🔍 [searchtimerecordemployee] ตรวจสอบ workplace ${record.workplaceId} วันที่ ${record.date} (${dayName}, dayOfWeek: ${dayOfWeek}) เดือน ${month} ปี ${year}`);
              
              let newDayType = 'work'; // default เป็น work
              let newCashWorkMul = '1'; // default multiplier
              
              // 🎯 กรณีพิเศษสำหรับ workplace 10493 - บังคับให้เป็น work ทุกวันโดยไม่มีข้อยกเว้น
              if (record.workplaceId === '10493') {
                console.log(`🔧 [searchtimerecordemployee] workplace 10493: บังคับให้เป็น work ทุกวันโดยไม่มีข้อยกเว้น`);
                
                // บังคับให้เป็น work ทุกวันโดยไม่ตรวจสอบอะไรเลย
                record.dayType = 'work';
                record.cashWorkMul = '1';
                
                console.log(`✅ [searchtimerecordemployee] workplace 10493: วันที่ ${record.date} ถูกบังคับเป็น work (cashWorkMul = 1)`);
                
                continue; // ข้ามการตรวจสอบอื่นๆ ทั้งหมดสำหรับ workplace 10493
              }
              
              // �🔥 PRIORITY 1: ตรวจสอบ publicHoliday ก่อนเป็นอันดับแรก (สำหรับ workplace อื่นๆ)
              console.log(`🔍 [searchtimerecordemployee] ตรวจสอบ publicHoliday สำหรับ workplace ${record.workplaceId}:`, workplace.publicHoliday);
              
              if (workplace.publicHoliday && workplace.publicHoliday.length > 0) {
                const recordDateStr = `${year}-${month.padStart(2, '0')}-${record.date.padStart(2, '0')}`;
                console.log(`📅 [searchtimerecordemployee] วันที่ต้องตรวจสอบ: ${recordDateStr}`);
                
                const isPublicHoliday = workplace.publicHoliday.some(holiday => {
                  let holidayDateStr = '';
                  if (holiday.date) {
                    // แปลงวันที่ holiday เป็นรูปแบบ YYYY-MM-DD
                    const holidayDate = new Date(holiday.date);
                    if (!isNaN(holidayDate.getTime())) {
                      const year = holidayDate.getFullYear();
                      const month = String(holidayDate.getMonth() + 1).padStart(2, '0');
                      const day = String(holidayDate.getDate()).padStart(2, '0');
                      holidayDateStr = `${year}-${month}-${day}`;
                    }
                  }
                  console.log(`🗓️ [searchtimerecordemployee] เปรียบเทียบ holiday: ${holidayDateStr} กับ record: ${recordDateStr}`);
                  return holidayDateStr === recordDateStr;
                });
                
                console.log(`✅ [searchtimerecordemployee] ผลการตรวจสอบ publicHoliday: ${isPublicHoliday}`);
                
                if (isPublicHoliday) {
                  console.log(`🚨 [searchtimerecordemployee] PRIORITY 1: วันที่ ${record.date} เป็นวันหยุดนักขัตฤกษ์ (publicHoliday) - เปลี่ยนเป็น stop`);
                  newDayType = 'stop';
                  newCashWorkMul = '2';
                  
                  // อัปเดตค่าและข้ามการตรวจสอบอื่นๆ
                  if (record.dayType !== newDayType) {
                    console.log(`🔄 [searchtimerecordemployee] อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                    record.dayType = newDayType;
                  }
                  
                  if (record.cashWorkMul !== newCashWorkMul) {
                    console.log(`🔄 [searchtimerecordemployee] อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                    record.cashWorkMul = newCashWorkMul;
                  }
                  
                  continue; // ข้ามการตรวจสอบอื่นๆ เพราะ publicHoliday เป็น priority สูงสุด
                }
              } else {
                console.log(`⚠️ [searchtimerecordemployee] workplace ${record.workplaceId} ไม่มี publicHoliday หรือเป็น array ว่าง`);
              }
              
              // 🔥 PRIORITY 2: ตรวจสอบ dayOffOnly จาก conclude/getWeekendDates (สำหรับ workplace อื่นๆ)
              try {
                const weekendResponse = await axios.get(`${sURL}/conclude/getWeekendDates?yyyy=${year}&mm=${month.padStart(2, '0')}&workplaceId=${record.workplaceId}`);
                const weekendData = weekendResponse.data;
                
                console.log(`🔍 [searchtimerecordemployee] ตรวจสอบ dayOffOnly สำหรับ workplace ${record.workplaceId}:`, weekendData.dayOffOnly);
                
                if (weekendData && weekendData.dayOffOnly && weekendData.dayOffOnly.length > 0) {
                  const recordDateStr = `${year}-${month.padStart(2, '0')}-${record.date.padStart(2, '0')}`;
                  console.log(`📅 [searchtimerecordemployee] วันที่ต้องตรวจสอบ dayOffOnly: ${recordDateStr}`);
                  console.log(`📅 [searchtimerecordemployee] รายการ dayOffOnly:`, weekendData.dayOffOnly);
                  
                  const isDayOffOnly = weekendData.dayOffOnly.includes(recordDateStr);
                  console.log(`✅ [searchtimerecordemployee] ผลการตรวจสอบ dayOffOnly: ${isDayOffOnly}`);
                  
                  if (isDayOffOnly) {
                    console.log(`🚨 [searchtimerecordemployee] PRIORITY 2: วันที่ ${record.date} อยู่ใน dayOffOnly - เปลี่ยนเป็น stop`);
                    newDayType = 'stop';
                    newCashWorkMul = '2';
                    
                    // อัปเดตค่าและข้ามการตรวจสอบอื่นๆ
                    if (record.dayType !== newDayType) {
                      console.log(`🔄 [searchtimerecordemployee] อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                      record.dayType = newDayType;
                    }
                    
                    if (record.cashWorkMul !== newCashWorkMul) {
                      console.log(`🔄 [searchtimerecordemployee] อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                      record.cashWorkMul = newCashWorkMul;
                    }
                    
                    continue; // ข้ามการตรวจสอบอื่นๆ
                  }
                } else {
                  console.log(`⚠️ [searchtimerecordemployee] workplace ${record.workplaceId} ไม่มี dayOffOnly หรือเป็น array ว่าง`);
                }
              } catch (weekendError) {
                console.error(`❌ [searchtimerecordemployee] ไม่สามารถดึงข้อมูล dayOffOnly สำหรับ workplace ${record.workplaceId}:`, weekendError.message);
              }
              
              // 🔥 PRIORITY 3: ตรวจสอบการตั้งค่า workTimeDay (สำหรับ workplace อื่นๆ)
              console.log(`🔍 [searchtimerecordemployee] ตรวจสอบ workTimeDay สำหรับ workplace ${record.workplaceId}:`, workplace.workTimeDay);
              
              if (workplace.workTimeDay && workplace.workTimeDay.length > 0) {
                console.log(`🔍 [searchtimerecordemployee] ตรวจสอบ workTimeDay สำหรับ workplace ${record.workplaceId}:`, workplace.workTimeDay);
                
                // ตรวจสอบว่ามีการตั้งค่าให้ทำงานทุกวันหรือไม่ โดยตรวจสอบทุกวัน (0-6)
                const workDays = new Set(); // เก็บวันที่ตั้งค่าเป็น work
                const stopDays = new Set(); // เก็บวันที่ตั้งค่าเป็น stop
                
                workplace.workTimeDay.forEach(config => {
                  const startDayIndex = thaiDays.indexOf(config.startDay);
                  const endDayIndex = thaiDays.indexOf(config.endDay);
                  
                  console.log(`📝 [searchtimerecordemployee] Config: ${config.startDay}(${startDayIndex}) - ${config.endDay}(${endDayIndex}) = ${config.workOrStop}`);
                  
                  if (startDayIndex !== -1 && endDayIndex !== -1) {
                    if (startDayIndex <= endDayIndex) {
                      // ช่วงวันปกติ (เช่น จันทร์-ศุกร์)
                      for (let i = startDayIndex; i <= endDayIndex; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i); // ลบออกจาก stop ถ้ามี
                        } else {
                          stopDays.add(i);
                          workDays.delete(i); // ลบออกจาก work ถ้ามี
                        }
                      }
                    } else {
                      // ช่วงวันข้ามสัปดาห์ (เช่น ศุกร์-อาทิตย์)
                      for (let i = startDayIndex; i <= 6; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i);
                        } else {
                          stopDays.add(i);
                          workDays.delete(i);
                        }
                      }
                      for (let i = 0; i <= endDayIndex; i++) {
                        if (config.workOrStop === 'work') {
                          workDays.add(i);
                          stopDays.delete(i);
                        } else {
                          stopDays.add(i);
                          workDays.delete(i);
                        }
                      }
                    }
                  }
                });
                
                console.log(`📊 [searchtimerecordemployee] Work days: [${Array.from(workDays).sort()}], Stop days: [${Array.from(stopDays).sort()}]`);
                
                // ตรวจสอบว่าทุกวัน (0-6) อยู่ใน workDays หรือไม่
                const allDaysAreWork = [0, 1, 2, 3, 4, 5, 6].every(day => workDays.has(day));
                
                if (allDaysAreWork) {
                  console.log(`✅ [searchtimerecordemployee] พบการตั้งค่าทำงานทุกวัน (ครอบคลุม 0-6) - dayType = work`);
                  newDayType = 'work';
                  newCashWorkMul = '1';
                } else {
                  // ตรวจสอบการตั้งค่าสำหรับวันนี้โดยเฉพาะ
                  if (workDays.has(dayOfWeek)) {
                    newDayType = 'work';
                    newCashWorkMul = '1';
                    console.log(`✅ [searchtimerecordemployee] วัน ${dayName} (${dayOfWeek}) ตั้งค่าเป็น work`);
                  } else if (stopDays.has(dayOfWeek)) {
                    newDayType = 'stop';
                    newCashWorkMul = '2';
                    console.log(`✅ [searchtimerecordemployee] วัน ${dayName} (${dayOfWeek}) ตั้งค่าเป็น stop`);
                  } else {
                    console.log(`⚠️ [searchtimerecordemployee] ไม่พบการตั้งค่าสำหรับวัน ${dayName} (${dayOfWeek}) - ใช้ค่าเริ่มต้น: work`);
                    newDayType = 'work';
                    newCashWorkMul = '1';
                  }
                }
              } else {
                console.log(`⚠️ [searchtimerecordemployee] workplace ${record.workplaceId} ไม่มีการตั้งค่า workTimeDay - ถือว่าทุกวันเป็น work`);
                newDayType = 'work';
                newCashWorkMul = '1';
              }
              
              // อัปเดตค่า
              if (record.dayType !== newDayType) {
                console.log(`🔄 [searchtimerecordemployee] อัปเดต dayType: ${record.dayType} -> ${newDayType}`);
                record.dayType = newDayType;
              }
              
              if (record.cashWorkMul !== newCashWorkMul) {
                console.log(`🔄 [searchtimerecordemployee] อัปเดต cashWorkMul: ${record.cashWorkMul} -> ${newCashWorkMul}`);
                record.cashWorkMul = newCashWorkMul;
              }
              
            } catch (workplaceError) {
              console.error(`❌ [searchtimerecordemployee] ไม่สามารถดึงข้อมูล workplace ${record.workplaceId}:`, workplaceError.message);
              // ถ้าดึงข้อมูล workplace ไม่ได้ ให้ใช้กฎพิเศษสำหรับ 10493
              if (record.workplaceId === '10493') {
                console.log(`🔧 [searchtimerecordemployee] fallback สำหรับ workplace 10493: dayType = work`);
                record.dayType = 'work';
                record.cashWorkMul = '1';
              }
            }
          }
        }
      }
    }

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

    if(timerecordEmployeeData) {
      await setToWorkplaceTimerecords(employeeId, employeeName,  employee_record, year, month) 
    }

    await res.json(timerecordEmployeeData);

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }

});

// Route to delete all matching records and save a new one
router.put("/updatetimerecordemployee/:employeeRecordId", async (req, res) => {
  try {
    const { year, employeeId, employeeName, month } = req.body;

    console.log("🔍 Finding records to delete for:", { year, employeeId, month });

    // Delete all matching records
    const deleteResult = await timerecordEmployee.deleteMany({ year, employeeId, month });

    console.log(`🗑️ Deleted ${deleteResult.deletedCount} records`);

    // Create a new record with updated fields
    const newRecord = new timerecordEmployee(req.body);

    // Save the new record
    const employee_record = await newRecord.save();

    console.log("✅ New record saved:", employee_record);

    if(employee_record ) {
      await setToWorkplaceTimerecords(employeeId, employeeName,  newRecord.employee_record, year, month) 

    }
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
      // workplaceName,
      wGroup ,
      date} = req.body;
    // Construct the search query based on the provided parameters
    const query = {};

    if (workplaceId !== '') {
      query.workplaceId = workplaceId;
    }


    // if (workplaceName !== '') {
    //   query.workplaceName = { $regex: new RegExp(workplaceName, 'i') };
    // }

    if (wGroup !== '') {
      query.wGroup = wGroup;
      // { $regex: new RegExp(wGroup , 'i') };
    }
    if (date !== '') {
      const [dd, mm, yyyy] = date.split('/'); // Split the date string
      query.date = `${parseInt(dd, 10)}/${mm}/${yyyy}`; // Convert dd to an integer to remove leading zero
    }
    
    // if (date !== '') {
    //   query.date= date;
    // }
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
      newData.date,
      updatedResource.employeeRecord
    );

    // Respond with the newly created record
    res.status(201).json(updatedResource );
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;