const connectionString = require('../config');
const sURL = 'http://localhost:3000';

const timerecordEmployee = require('./models/periodtimerecordModel');
const workplaceTimerecords = require('./models/periodworkplacetimerecordModel');
const welfare = require('./models/welfareModel');

const axios = require('axios');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { months } = require('moment');

// ฟังก์ชันดึงข้อมูล typeOfemployee จาก employee API
async function getEmployeeJobType(employeeId) {
  try {
    const employeeResponse = await axios.get(sURL + '/employee/' + employeeId);
    if (employeeResponse && employeeResponse.data) {
      const typeOfemployee = employeeResponse.data.jobtype || '';
      console.log(`🔍 [timerecords] ดึงข้อมูล jobtype สำหรับพนักงาน ${employeeId}: ${typeOfemployee}`);
      return typeOfemployee;
    }
    return '';
  } catch (error) {
    console.error(`⚠️ [timerecords] ไม่สามารถดึงข้อมูลพนักงาน ${employeeId}:`, error.message);
    return '';
  }
}

// ฟังก์ชัน migrate ข้อมูลเก่าให้เพิ่ม typeOfemployee
async function migrateTimerecordsWithTypeOfEmployee() {
  try {
    console.log('🔄 [MIGRATE] เริ่มการ migrate ข้อมูลเก่าให้เพิ่ม typeOfemployee...');
    
    // ดึงข้อมูล timerecords ที่ยังไม่มี typeOfemployee ที่ระดับ root
    const timerecordsNeedMigration = await timerecordEmployee.find({
      $or: [
        { 'typeOfemployee': { $exists: false } },
        { 'typeOfemployee': '' },
        { 'typeOfemployee': null }
      ]
    });

    console.log(`📊 [MIGRATE] พบข้อมูลที่ต้อง migrate: ${timerecordsNeedMigration.length} records`);

    let migratedCount = 0;
    for (const timerecord of timerecordsNeedMigration) {
      const employeeId = timerecord.employeeId;
      const typeOfemployee = await getEmployeeJobType(employeeId);
      
      // อัปเดตเฉพาะ typeOfemployee ที่ระดับ root (ไม่แตะ employee_record)
      // บันทึกข้อมูลที่อัปเดตแล้ว
      await timerecordEmployee.findByIdAndUpdate(
        timerecord._id,
        { typeOfemployee: typeOfemployee }, // เพิ่มเฉพาะที่ระดับ root
        { new: true }
      );

      migratedCount++;
      console.log(`✅ [MIGRATE] อัปเดต typeOfemployee สำหรับพนักงาน ${employeeId}: ${typeOfemployee} (${migratedCount}/${timerecordsNeedMigration.length})`);
    }

    console.log(`🎉 [MIGRATE] เสร็จสิ้นการ migrate ข้อมูล: ${migratedCount} records`);
    return { success: true, migratedCount };
  } catch (error) {
    console.error('❌ [MIGRATE] เกิดข้อผิดพลาดในการ migrate:', error);
    return { success: false, error: error.message };
  }
}


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
    typeOfemployee: String,
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
  typeOfemployee: String, // เพิ่มที่ระดับ root
  employee_workplaceRecord: [{
    workplaceId: String,
    workplaceName: String,
    wGroup : String,
    date: String,
    typeOfemployee: String,
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

// Endpoint สำหรับ migrate ข้อมูลเก่าให้เพิ่ม typeOfemployee
router.get('/migrate-typeofemployee', async (req, res) => {
  try {
    const result = await migrateTimerecordsWithTypeOfEmployee();
    res.json({
      message: 'Migration completed',
      success: result.success,
      migratedCount: result.migratedCount,
      error: result.error || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
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
      year,
      timerecordId,
      workplaceId,
      'employee_workplaceRecord.workplaceId': workplaceIdInRecord} = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId && employeeId !== '') {
      query.employeeId = employeeId;
    }

    if (employeeName && employeeName !== '') {
      query.employeeName = { $regex: new RegExp(employeeName, 'i') };
    }

    if (month && month !== '') {
      query.month = { $regex: new RegExp(month, 'i') };
    }

    if (year && year !== '') {
      // Add year filter - assuming timerecordId contains year info or we need to filter by year in employee_workplaceRecord
      query.timerecordId = { $regex: new RegExp(year, 'i') };
    }

    if (timerecordId && timerecordId !== '') {
      query.timerecordId = { $regex: new RegExp(timerecordId, 'i') };
    }

    // Support for workplaceId in employee_workplaceRecord
    if (workplaceIdInRecord && workplaceIdInRecord !== '') {
      query['employee_workplaceRecord.workplaceId'] = workplaceIdInRecord;
    }

    // Direct workplaceId parameter
    if (workplaceId && workplaceId !== '') {
      query['employee_workplaceRecord.workplaceId'] = workplaceId;
    }

    console.log('Constructed Query:');
    console.log(query);

    // If no search parameters provided, return empty result
    if (Object.keys(query).length === 0) {
      return res.status(200).json({ recordworkplace: [] });
    }

    // Query the workplace collection for matching documents
    const recordworkplace = await workplaceTimerecordEmp.find(query);

    console.log('Search Results:');
    console.log(recordworkplace);
    
    res.status(200).json({ recordworkplace });
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

  try {
    // ดึงข้อมูล typeOfemployee จาก employee API
    const typeOfemployee = await getEmployeeJobType(employeeId);

    // ไม่ต้องเพิ่ม typeOfemployee ใน employee_workplaceRecord แต่ละรายการ
    // เก็บไว้ที่ระดับ root เท่านั้น

    // Create workplace
    const workplaceTimeRecordData = new workplaceTimerecordEmp({
timerecordId,
      employeeId,
      employeeName,
      month,
      typeOfemployee: typeOfemployee, // เพิ่มที่ระดับ root
      employee_workplaceRecord: employee_workplaceRecord // ใช้ข้อมูลเดิม
    });
    console.log(workplaceTimeRecordData );

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
          workplaceRecord.employeeRecord[existingEmployeeIndex] = {
            staffId: employeeId,
            staffName: employeeName,
            typeOfemployee: typeOfemployee,
            ...record
          };
        } else {
          // Add new employee record
          workplaceRecord.employeeRecord.push({
            staffId: employeeId,
            staffName: employeeName,
            typeOfemployee: typeOfemployee,
            ...record
          });
        }

                
      } else {
                  // Add new employee record
                  workplaceRecord = new workplaceTimerecord({
                    timerecordId,
                    workplaceId,
                    workplaceName: record.workplaceName,
                    wGroup,
                    date: wdate,
                    employeeRecord: [{
                      staffId: employeeId,
                      staffName: employeeName,
                      typeOfemployee: typeOfemployee,
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
    // ดึงข้อมูล typeOfemployee จาก employee API
    const typeOfemployee = await getEmployeeJobType(updateFields.employeeId);

    // ไม่ต้องเพิ่ม typeOfemployee ใน employee_workplaceRecord แต่ละรายการ
    // เก็บไว้ที่ระดับ root เท่านั้น

    // อัปเดต updateFields ด้วยข้อมูล typeOfemployee
    const updatedFields = {
      ...updateFields,
      typeOfemployee: typeOfemployee // เพิ่มที่ระดับ root เท่านั้น
    };

    await workplaceTimerecordEmp.deleteMany({
      timerecordId: updateFields.timerecordId,
      employeeId: updateFields.employeeId,
      month: updateFields.month,
    });
    
    const newRecord = await new workplaceTimerecordEmp(updatedFields);

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
            'typeOfemployee': element.typeOfemployee || '',
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
              'typeOfemployee': element.typeOfemployee || '',
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

    // เพิ่ม typeOfemployee สำหรับแต่ละพนักงาน
    const updatedEmployeeRecord = [];
    for (const record of filteredEmployeeRecord) {
      const typeOfemployee = await getEmployeeJobType(record.staffId);
      updatedEmployeeRecord.push({
        ...record,
        typeOfemployee: typeOfemployee
      });
    }

    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear();
    const timerecordId = currentYear;

    // Create workplace with updated employeeRecord array
    const workplaceTimeRecordData = new workplaceTimerecord({
      timerecordId,
      workplaceId,
      workplaceName,
      wGroup ,
      date,
      employeeRecord: updatedEmployeeRecord
    });

    const ans = await workplaceTimeRecordData.save();
    if (ans) {
      console.log('Create workplace time record success');
      await setToEmployee(workplaceId, workplaceName, wGroup, date, updatedEmployeeRecord);
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
      year,
      workplaceId,
      employeeId
    } = req.body;

    // ใช้ aggregation pipeline สำหรับการค้นหาที่ซับซ้อน
    const pipeline = [];

    // Match stage
    const matchConditions = {};
    if (month !== '') {
      matchConditions.month = { $regex: new RegExp(month, 'i') };
    }
    if (year !== '') {
      matchConditions.year = { $regex: new RegExp(year, 'i') };
    }
     if (employeeId && employeeId !== '') {
      matchConditions.employeeId = employeeId;
    }
    
    
    pipeline.push({ $match: matchConditions });

    // ถ้ามี workplaceId ให้กรองเฉพาะ employee_record ที่ตรงกับ workplaceId
    if (workplaceId && workplaceId !== '') {
      pipeline.push({
        $addFields: {
          employee_record: {
            $filter: {
              input: "$employee_record",
              cond: { $eq: ["$$this.workplaceId", workplaceId] }
            }
          }
        }
      });
      
      // กรองออกเฉพาะ documents ที่มี employee_record หลังจาก filter แล้ว
      pipeline.push({
        $match: {
          "employee_record": { $ne: [] }
        }
      });
    }

    if (month == '' && year == '' && workplaceId == '') {
      return res.status(200).json({ result: [] });
    }

    const result = await timerecordEmployee.aggregate(pipeline);

    // เพิ่มข้อมูล welfare/leave ลงใน addSalaryList และตรวจสอบ typeOfemployee
    for (let timeRecord of result) {
      try {
        // ตรวจสอบและเพิ่ม typeOfemployee หากยังไม่มี
        let needUpdate = false;
        const updatedEmployeeRecord = [];
        let typeOfemployee = timeRecord.typeOfemployee || ''; // ดึงจากระดับ root ก่อน
        
        // หากยังไม่มี typeOfemployee ที่ระดับ root ให้ดึงจาก employee API
        if (!typeOfemployee || typeOfemployee === '') {
          typeOfemployee = await getEmployeeJobType(timeRecord.employeeId);
          needUpdate = true;
          console.log(`🔄 [SEARCH] เพิ่ม typeOfemployee สำหรับพนักงาน ${timeRecord.employeeId}: ${typeOfemployee}`);
        }
        
        // คัดลอก employee_record โดยไม่เปลี่ยนแปลง (ไม่เพิ่ม typeOfemployee ในแต่ละ record)
        for (const record of timeRecord.employee_record) {
          updatedEmployeeRecord.push(record);
        }
        
        // อัปเดตฐานข้อมูลหากจำเป็น - เพิ่ม typeOfemployee ที่ระดับ root
        if (needUpdate) {
          await timerecordEmployee.findByIdAndUpdate(
            timeRecord._id,
            { 
              employee_record: updatedEmployeeRecord,
              typeOfemployee: typeOfemployee // เพิ่มที่ระดับ root
            },
            { new: true }
          );
          timeRecord.typeOfemployee = typeOfemployee; // เพิ่มในผลลัพธ์ที่ส่งกลับ
          console.log(`✅ [SEARCH] อัปเดต typeOfemployee ในฐานข้อมูลสำหรับพนักงาน ${timeRecord.employeeId}`);
        }

        // ตรวจสอบให้แน่ใจว่า typeOfemployee แสดงใน response
        if (!timeRecord.typeOfemployee) {
          timeRecord.typeOfemployee = typeOfemployee;
        }

        // ค้นหาข้อมูล welfare ของพนักงาน
        const welfareQuery = { employeeId: timeRecord.employeeId };
        
        // ถ้ามีการระบุ year ให้กรองตามปี
        if (year && year !== '') {
          welfareQuery.year = year;
        }
        
        // Debug: Log the welfare query
        console.log('🔍 Welfare Query for employee:', timeRecord.employeeId, welfareQuery);
        
        const welfareRecords = await welfare.find(welfareQuery);
        
        // Debug: Log the welfare results
        console.log('📊 Welfare Records found:', welfareRecords.length, 'records for employee:', timeRecord.employeeId);
        
        // Debug: Check what welfare data exists for this employee (without month/year filter)
        const allWelfareForEmployee = await welfare.find({ employeeId: timeRecord.employeeId });
        console.log('🔎 All welfare records for employee:', timeRecord.employeeId, 'count:', allWelfareForEmployee.length);
        if (allWelfareForEmployee.length > 0) {
          console.log('📋 Sample welfare record structure:', JSON.stringify(allWelfareForEmployee[0], null, 2));
        }
        
        // รวม addSalaryList จากข้อมูล welfare ทั้งหมด
        let addSalaryFromWelfare = [];
        // สำหรับ id เฉพาะที่จะใช้ logic รวมตาม startDay
        const targetIds = new Set(['1423', '1234']);
        // ใช้ Map สำหรับรวมรายการของ id เฉพาะ: อนุญาต id ซ้ำได้ แต่ถ้า startDay ซ้ำจะไม่รวม; ถ้า startDay ต่างกันให้รวมและบวกเงิน
        const welfareAgg = new Map(); // key = welfareId, value = { item, seenDates: Set<string> }

        const normalizeStartDay = (d) => {
          if (!d) return '';
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10);
        };
        
        welfareRecords.forEach(welfareRecord => {
          if (welfareRecord.record && Array.isArray(welfareRecord.record)) {
            welfareRecord.record.forEach(record => {
              // 🎯 กรองเฉพาะ records ที่อยู่ในรอบเงินเดือน (21 เดือนก่อน - 20 เดือนปัจจุบัน)
              let shouldInclude = true;
              
              if (month && month !== '' && record.startDay) {
                const recordStartDate = new Date(record.startDay);
                
                // คำนวณรอบเงินเดือน: 21 เดือนก่อน - 20 เดือนปัจจุบัน
                const currentYear = parseInt(year) || new Date().getFullYear();
                const currentMonth = parseInt(month);
                
                // วันที่เริ่มรอบ: 21 ของเดือนก่อน
                let startYear = currentYear;
                let startMonth = currentMonth - 1;
                if (startMonth < 1) {
                  startMonth = 12;
                  startYear--;
                }
                const periodStartDate = new Date(startYear, startMonth - 1, 21); // month - 1 เพราะ JS month เริ่มจาก 0
                
                // วันที่สิ้นสุดรอบ: 20 ของเดือนปัจจุบัน
                const periodEndDate = new Date(currentYear, currentMonth - 1, 20, 23, 59, 59); // สิ้นสุดวัน
                
                // ตรวจสอบว่า startDay อยู่ในรอบเงินเดือนหรือไม่
                shouldInclude = recordStartDate >= periodStartDate && recordStartDate <= periodEndDate;
                
                console.log(`🔍 [TIMERECORDS] กรองตามรอบเงินเดือน:`);
                console.log(`   - เดือนที่เลือก: ${month}/${year}`);
                console.log(`   - รอบเงินเดือน: ${periodStartDate.toISOString().slice(0,10)} ถึง ${periodEndDate.toISOString().slice(0,10)}`);
                console.log(`   - startDay: ${record.startDay}`);
                console.log(`   - recordDate: ${recordStartDate.toISOString().slice(0,10)}`);
                console.log(`   - include: ${shouldInclude}`);
              }
              
              if (!shouldInclude) return;

              const welfareId = record.id || record.welfareType || "";
              const amount = parseFloat(record.SpSalary || '0') || 0;

              if (targetIds.has(welfareId)) {
                // ใช้ logic เฉพาะ: รวมหลาย startDay เป็น 1 รายการต่อ id, เก็บข้อมูลวันที่ทั้งหมด
                const startKey = normalizeStartDay(record.startDay);
                if (!welfareAgg.has(welfareId)) {
                  const baseItem = {
                    id: welfareId,
                    name: record.name || record.welfareTypeEn || "",
                    SpSalary: String(amount),
                    roundOfSalary: record.roundOfSalary || "monthly",
                    StaffType: record.StaffType || "all",
                    nameType: record.nameType || "",
                    message: record.comment || record.message || "",
                    welfareType: record.welfareType || "",
                    startDay: startKey || "",
                    endDay: record.endDay || "",
                    welfareMonth: welfareRecord.month || "",
                    welfareYear: welfareRecord.year || "",
                    // เพิ่ม date/month/year ตามที่ขอ
                    date: startKey ? startKey.split('-')[2] : (welfareRecord.month ? '01' : ''),
                    month: startKey ? startKey.split('-')[1] : (welfareRecord.month || ''),
                    year: startKey ? startKey.split('-')[0] : (welfareRecord.year || ''),
                  };
                  welfareAgg.set(welfareId, { item: baseItem, seenDates: new Set(startKey ? [startKey] : []) });
                  console.log(`✅ [TIMERECORDS] (target) สร้างกลุ่ม id=${welfareId}, startDay=${startKey}, amount=${amount}`);
                } else {
                  const agg = welfareAgg.get(welfareId);
                  if (startKey && agg.seenDates.has(startKey)) {
                    console.log(`🚫 [TIMERECORDS] (target) ข้าม (id ซ้ำ + startDay ซ้ำ) id=${welfareId}, startDay=${startKey}, amount=${amount}`);
                  } else {
                    const current = parseFloat(agg.item.SpSalary || '0') || 0;
                    agg.item.SpSalary = String(current + amount);
                    if (startKey) {
                      agg.seenDates.add(startKey);
                      // รวมวันที่ในฟิลด์ date โดยคั่นด้วย comma
                      const currentDate = agg.item.date || '';
                      const newDate = startKey.split('-')[2];
                      if (currentDate && !currentDate.split(',').includes(newDate)) {
                        agg.item.date = currentDate + ',' + newDate;
                      } else if (!currentDate) {
                        agg.item.date = newDate;
                      }
                      
                      // อัปเดต startDay เป็นวันที่เก่าสุด
                      if (!agg.item.startDay) {
                        agg.item.startDay = startKey;
                        agg.item.month = startKey.split('-')[1];
                        agg.item.year = startKey.split('-')[0];
                      } else {
                        const existing = new Date(agg.item.startDay);
                        const incoming = new Date(startKey);
                        if (!isNaN(incoming.getTime()) && !isNaN(existing.getTime()) && incoming < existing) {
                          agg.item.startDay = startKey;
                          agg.item.month = startKey.split('-')[1];
                          agg.item.year = startKey.split('-')[0];
                        }
                      }
                    }
                    console.log(`🔄 [TIMERECORDS] (target) รวม id=${welfareId}, +${amount} ⇒ ${agg.item.SpSalary}, dates=${agg.item.date}`);
                  }
                }
              } else {
                // 🎯 สำหรับ id อื่นๆ: ใช้ logic รวม SpSalary ถ้า id เดียวกัน
                const existingIndex = addSalaryFromWelfare.findIndex(existingItem => existingItem.id === welfareId);
                
                if (existingIndex !== -1) {
                  // ถ้ามี id เดียวกันแล้ว ให้รวม SpSalary
                  const existingAmount = parseFloat(addSalaryFromWelfare[existingIndex].SpSalary || '0') || 0;
                  const newTotal = existingAmount + amount;
                  addSalaryFromWelfare[existingIndex].SpSalary = String(newTotal);
                  
                  // รวมวันที่ในฟิลด์ date
                  const currentStartDay = normalizeStartDay(record.startDay);
                  if (currentStartDay) {
                    const existingDate = addSalaryFromWelfare[existingIndex].date || '';
                    const newDate = currentStartDay.split('-')[2];
                    if (existingDate && !existingDate.split(',').includes(newDate)) {
                      addSalaryFromWelfare[existingIndex].date = existingDate + ',' + newDate;
                    } else if (!existingDate) {
                      addSalaryFromWelfare[existingIndex].date = newDate;
                    }
                  }
                  
                  console.log(`🔄 [TIMERECORDS] (normal) รวม id=${welfareId}, ${existingAmount} + ${amount} ⇒ ${newTotal}`);
                } else {
                  // ถ้าไม่มี id เดียวกัน ให้เพิ่มใหม่
                  addSalaryFromWelfare.push({
                    id: welfareId,
                    name: record.name || record.welfareTypeEn || "",
                    SpSalary: record.SpSalary || "0",
                    roundOfSalary: record.roundOfSalary || "monthly",
                    StaffType: record.StaffType || "all",
                    nameType: record.nameType || "",
                    message: record.comment || record.message || "",
                    welfareType: record.welfareType || "",
                    startDay: record.startDay || "",
                    endDay: record.endDay || "",
                    welfareMonth: welfareRecord.month || "",
                    welfareYear: welfareRecord.year || "",
                    // เพิ่ม date/month/year ตามที่ขอ
                    date: record.startDay ? normalizeStartDay(record.startDay).split('-')[2] : (welfareRecord.month ? '01' : ''),
                    month: record.startDay ? normalizeStartDay(record.startDay).split('-')[1] : (welfareRecord.month || ''),
                    year: record.startDay ? normalizeStartDay(record.startDay).split('-')[0] : (welfareRecord.year || ''),
                  });
                  console.log(`✅ [TIMERECORDS] (normal) เพิ่ม welfare item ใหม่: ${record.name} (${record.SpSalary})`);
                }
              }
            });
          }
        });

        // รวมผลของกลุ่ม target ids เข้ากับรายการปกติ
        const targetMergedItems = Array.from(welfareAgg.values()).map(v => v.item);
        addSalaryFromWelfare = [...addSalaryFromWelfare, ...targetMergedItems];
        console.log(`📊 [TIMERECORDS] สรุป welfare หลังประมวลผล: normal=${addSalaryFromWelfare.length - targetMergedItems.length} + target=${targetMergedItems.length} → total=${addSalaryFromWelfare.length}`);

        // รวม addSalaryList เดิมกับข้อมูลจาก welfare
        if (!timeRecord.addSalaryList) {
          timeRecord.addSalaryList = [];
        }
        
        // 🎯 ลบข้อมูล welfare เดิมออกก่อนเพิ่มใหม่ เพื่อป้องกันการซ้ำ และ sync กับ DB
        const originalLength = timeRecord.addSalaryList ? timeRecord.addSalaryList.length : 0;
        
        // สร้าง Set ของ welfare IDs ที่มีอยู่จริงใน welfare database
        const validWelfareIds = new Set();
        addSalaryFromWelfare.forEach(item => {
          if (item.id) validWelfareIds.add(item.id);
        });
        
        // กรองเอาเฉพาะข้อมูลที่ไม่ใช่ welfare หรือเป็น welfare ที่ยังมีอยู่ใน DB
        timeRecord.addSalaryList = timeRecord.addSalaryList.filter(item => {
          // ถ้าไม่มี welfareType หรือ welfareType เป็น falsy และไม่อยู่ใน validWelfareIds = เก็บไว้
          const isWelfareItem = item.welfareType || validWelfareIds.has(item.id);
          const shouldKeep = !isWelfareItem;
          
          if (isWelfareItem) {
            console.log(`🗑️ [TIMERECORDS] ลบ welfare item: id=${item.id}, name=${item.name}, welfareType=${item.welfareType || 'undefined'}`);
          }
          
          return shouldKeep;
        });
        
        console.log(`🧹 [TIMERECORDS] ลบข้อมูล welfare เดิมทั้งหมดออก: ${originalLength} → ${timeRecord.addSalaryList.length} items`);
        
        // เพิ่ม welfare data ที่ไม่ซ้ำแล้ว (เฉพาะที่มีอยู่จริงใน welfare database)
        timeRecord.addSalaryList = [...timeRecord.addSalaryList, ...addSalaryFromWelfare];
        console.log(`📝 [TIMERECORDS] เพิ่ม welfare data ใหม่จาก DB: ${addSalaryFromWelfare.length} items`);
        
        // 🎯 กรองข้อมูลซ้ำขั้นสุดท้าย เผื่อมี ID ซ้ำระหว่าง addSalaryList เดิมกับ welfare data
        const finalUniqueItems = [];
        const finalSeenIds = new Set();
        
        timeRecord.addSalaryList.forEach(item => {
          const itemId = item.id || "";
          if (!finalSeenIds.has(itemId)) {
            finalSeenIds.add(itemId);
            finalUniqueItems.push(item);
          } else {
            console.log(`🚫 [TIMERECORDS] ข้าม item ซ้ำขั้นสุดท้าย: id=${itemId}, name=${item.name}`);
          }
        });
        
        timeRecord.addSalaryList = finalUniqueItems;
        
        // Debug: Log the welfare data addition
        if (addSalaryFromWelfare.length > 0) {
          console.log('✅ Added', addSalaryFromWelfare.length, 'welfare items to addSalaryList for employee:', timeRecord.employeeId);
        } else {
          console.log('⚠️ No welfare data to add for employee:', timeRecord.employeeId);
        }
        
      } catch (welfareError) {
        console.error('Error fetching welfare data for employee:', timeRecord.employeeId, welfareError);
        // ถ้ามีข้อผิดพลาดในการดึงข้อมูล welfare ก็ให้ใช้ addSalaryList เดิม
        if (!timeRecord.addSalaryList) {
          timeRecord.addSalaryList = [];
        }
      }
    }

    res.status(200).json({ result });
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