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
    beforeStartOtTime: String,
    beforeEndOtTime: String,
    beforeTotalOtTime: String,
    startOtTime: String,
    endOtTime: String,
    totalOtTime: String,
    cashSalary: String,
    payFullDay: { type: Boolean, default: false },
    specialtSalary: String,
    specialtSalaryOT: String,
    messageSalary: String,
    isThreePercent: { type: Boolean, default: false },
    isNightShiftCash: { type: Boolean, default: false }
  }]
});

// Create the workplace record time model based on the schema
const workplaceTimerecords = mongoose.model('periodWorkplaceTimerecord', periodWorkplaceTimerecordSchema);

module.exports = workplaceTimerecords;