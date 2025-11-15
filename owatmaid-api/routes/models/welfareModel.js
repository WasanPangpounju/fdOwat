const mongoose = require('mongoose');

// Define Welfare schema for employee
const welfareSchema = new mongoose.Schema({
  year: String,
  month: String,
 createDate: String,
  employeeId: String,
  workplace: String,
createBy: String,
status: String,

record: [ {
  startDay: String,
  endDay: String,
  welfareType: String,
  welfareTypeEn: String,
  id: String,
  name: String,
  SpSalary: String,
  roundOfSalary: String,
  StaffType: String,
  nameType: String,
  message: String,
  comment: String,
  date: String, // วันที่ลา (เช่น "21,19")
  countDate: Number, // จำนวนวันที่ลา (นับจาก date)
}],
  
  
});

// Create the conclude record time model based on the schema
const Welfare = mongoose.model('welfare', welfareSchema );

module.exports = Welfare;