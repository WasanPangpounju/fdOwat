const mongoose = require('mongoose');

// Define time record schema for period workplace
const periodWorkplaceTimerecordSchema = new mongoose.Schema({
  year: String,
  workplaceId: String,
  workplaceName: String,
  wGroup: String,
  date: String,
  employeeRecord: [{
    employeeId: String,
    employeeName: String,
    shift: String,
    startTime: String,
    endTime: String,
    totalTime: String,
    startOtTime: String,
    endOtTime: String,
    totalOtTime: String,
    cashSalary: String,
    specialtSalary: String,
    specialtSalaryOT: String,
            messageSalary: String,
  }]
});

// Create the workplace record time model based on the schema
const workplaceTimerecords = mongoose.model('periodWorkplaceTimerecord', periodWorkplaceTimerecordSchema);

module.exports = workplaceTimerecords;