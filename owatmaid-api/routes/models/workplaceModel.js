const mongoose = require('mongoose');
// ✅ Define Employee Schema
const EmployeeSchema = new mongoose.Schema({
  positionWork_specialwork: { type: String, required: true }, // Job Position
  countPerson_specialwork: { type: Number, required: true }, // Number of People
});

// ✅ Define Special Work Time Schema
const SpecialWorkTimeSchema = new mongoose.Schema({
  day_specialwork: { type: String, required: true }, // Work Date (Format: dd/MM/yyyy)
  shift_specialwork: { type: String, enum: ["กะเช้า", "กะบ่าย", "กะดึก", "กะพิเศษ"], required: true }, // Shift Type
  startTime_specialwork: { type: String, required: true }, // Start Work Time
  endTime_specialwork: { type: String, required: true }, // End Work Time
  beforeStartTimeOT_specialwork: { type: String }, // OT Start Time
  beforeEndTimeOT_specialwork: { type: String }, // OT End Time
  startTimeOT_specialwork: { type: String }, // OT Start Time
  endTimeOT_specialwork: { type: String }, // OT End Time
  payment_specialwork: { type: Number, required: true }, // Payment per Shift
  paymentOT_specialwork: { type: Number }, // OT Payment
  workDetail_specialwork: { type: String }, // Work Details
  employees_specialwork: [EmployeeSchema], // Employees Assigned
});

// Define workplace schema
const workplaceSchema = new mongoose.Schema({
  workplaceId: {
      type: String,
      required: true,
      unique: true
  },
  workplaceName: {
      type: String
  },
  workplaceGroup: [{
      workplaceComplexId: String,
      workplaceComplexName: String,
      workplaceComplexData: {}
}],
  workplaceArea: {
      type: String
  },
  workOfWeek: {
      type: String
  },
  workStart1: {
      type: String
  },
  workEnd1: {
      type: String
  },
  workStart2: {
      type: String
  },
  workEnd2: {
      type: String
  },
  workStart3: {
      type: String
  },
  workEnd3: {
      type: String
  },
  workStartOt1: String,
  workEndOt1: String,
  workStartOt2: String,
  workEndOt2: String,
  workStartOt3: String,
  workEndOt3: String,
  workOfHour: {
      type: String
  },
  workOfOT: {
      type: String
  },
  workOfHour_subHour: { 
      type: String
  },
  workOfHour_subMinute: { 
      type: String
  },
  startWorkOfOT_subHour: { 
      type: String
  },
  startWorkOfOT_subMinute: {
      type: String
  },
  workOfOT_subHour: { 
      type: String
  },
  workOfOT_subMinute: {
      type: String
  },
  workOfOT_breakHour: {
      type: String
  },
  workOfOT_breakMinute: {
      type: String
  },
  workRate: {
      type: String
  },
  addWorkRate: {
      type: String
  },
  workRateOT: {
      type: String
  },
  workTotalPeople: {
      type: String,
  },
  dayoffRate: {
      type: String
  },
  dayoffRateOT: {
      type: String
  },
  dayoffRateHour: {
      type: String
  },
  holiday: {
      type: String
  },
  holidayOT: {
      type: String
  },
  holidayHour: {
      type: String
  },
  workRateChange: Date,

  salaryadd1: {
      type: String
  },
  salaryadd2: {
      type: String
  },
  salaryadd3: {
      type: String
  },
  salaryadd4: {
      type: String
  },
  salaryadd5: {
      type: String
  },
  salaryadd6: {
      type: String
  },
  personalLeave: {
      type: String
  },
  personalLeaveNumber: {
      type: String
  },
  personalLeaveRate: {
      type: String
  },
  sickLeave: {
      type: String
  },
  sickLeaveNumber: {
      type: String
  },
  sickLeaveRate: {
      type: String
  },
  workRateDayoff: {
      type: String
  },
  workRateDayoffNumber: {
      type: String
  },
  workRateDayoffRate: {
      type: String
  },
  daysOff: [{
      type: Date
  }],
  daysOffMap: [{
      dayOff: String,
      comment: String,
  }],
  publicHoliday: [{
      date: Date,
      note: String
  }],

  workplaceAddress: {
      type: String
  },
  reason: {
      type: String
  },
  employeeIdList: [],
  employeeNameList: [],

  workday1: String,
  workday2: String,
  workday3: String,
  workday4: String,
  workday5: String,
  workday6: String,
  workday7: String,

  workcount1: String,
  workcount2: String,
  workcount3: String,
  workcount4: String,
  workcount5: String,
  workcount6: String,
  workcount7: String,

  addSalary: [{
      name: String,
      codeSpSalary: String,
      SpSalary: String,
      roundOfSalary: String,
      StaffType: String,
      nameType: String,
  }],

  listEmployeeDay: [{
      day: String,
      position: String,
      employees: String,
  }],
  listSpecialWorktime: [{
      day: String,
      spWorkStart1: String,
      spWorkEnd1: String,
      spWorkStart2: String,
      spWorkEnd2: String,
      spWorkStart3: String,
      spWorkEnd3: String,
  }],

  workTimeDay: [{
      startDay: String,
      endDay: String,
      workOrStop: String,
      allTimes: [{
           shift: String, 
           startTime: String, 
           endTime: String, 
           resultTime: String, 
           beforeStartTimeOT: String, 
           beforeEndTimeOT: String, 
           beforeResultTimeOT: String,
           startTimeOT: String, 
           endTimeOT: String, 
           resultTimeOT: String }]
  }
  ],

  workTimeDayPerson:[{
      startDay: String,
      endDay: String,
      allTimesPerson: [{
          shift: String,
          positionWork: String,
          countPerson: String
      }]
  }],

  // specialWorkTimeDay: [{
  //     day: String,
  //     shift: String,
  //     startTime: String,
  //     endTime: String,
  //     startTimeOT: String,
  //     endTimeOT: String,
  //     payment: String,
  //     paymentOT: String,
  //     workDetail: String,
  //     employees: [{
  //         positionWork: String,
  //         countPerson: String
  //     }]
  // }],

    // ✅ New Special Work Time Field
    specialWorkTimeDay: [SpecialWorkTimeSchema],
});

// Create the workplace model based on the schema
const Workplace = mongoose.model('Workplace', workplaceSchema);


// module.exports = Workplace;

module.exports = {
  Workplace,        // model
  workplaceSchema   // schema
};
