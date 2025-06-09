const mongoose = require('mongoose');

// Define time record schema for employee
const periodEmployeeTimerecordSchema = new mongoose.Schema({
  year: String,
  employeeId: String,
  employeeName: String,
  month: String,
  status: String,
  employee_record: [{
    workplaceId: String,
    workplaceName: String,
    wGroup : String,
    date: String,
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
    cashBeforeOt: String,
    cashBeforeOtMul: String,
    cashWork: String,
    cashWorkMul: String,
    cashOt: String,
    cashOtMul: String,
    cashSalary: String,
specialtSalary: String,
specialtSalaryOT: String,
        messageSalary: String,
        dayType: String,
        addSalaryDaily: [
          {
            id: String,
            name: String,
            SpSalary: String,
            roundOfSalary: String,
            StaffType: String,
            nameType: String,
            message: String,
          },
        ],
    
}],

dayWorkCount : String,
dayOffCount : String,
specialDayOff : String,
sumTimeWork : String,
sumTimeOt : String,
sumCashWork : String,
sumCashOt : String,
sumcashDayOffCount: String,
socialSecurity: String,
tax: String,
cashSpecialDay: String,

addSalaryList: [
  {
    id: String,
    name: String,
    SpSalary: String,  // problem here, you're storing numbers as strings
    roundOfSalary: String,
    StaffType: String,
    nameType: String,
    message: String,
  }
],
sumCashWorkMul : {},
timeCashWorkMul : {},

});

// Create the workplace record time model based on the schema
const timerecordEmployee = mongoose.model('periodEmployeeTimerecord', periodEmployeeTimerecordSchema );

module.exports = timerecordEmployee;