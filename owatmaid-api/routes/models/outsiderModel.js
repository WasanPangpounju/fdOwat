const mongoose = require('mongoose');

const outsiderSchema = new mongoose.Schema({
  year: String,
  month: String,
 createDate: String,
createBy: String,
status: String,

workplaceId: String,
workplaceName: String,
date: String,

osd: [ {
  staffId: String,
  staffFullName: String,
  shift: String,
  startTime: String,
  endTime: String,
  allTime: String,
  selectotTime: String,
  selectotTimeOut: String,
  otTime: String,
  staffIdReplace: String,
  staffFullNameReplace: String,
  cashSalary: String,
  specialtSalary: String,
  specialtSalaryOT: String,
  messageSalary: String,
  rows: [
    {
      codeSpSalary: String,
      name: String,
      SpSalary: String,
    }
  ],
}],

  


  
});

// Create the outsider record model based on the schema
const  outsider = mongoose.model('outsider', outsiderSchema);

module.exports = outsider;