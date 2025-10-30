const mongoose = require('mongoose');

// Define time record schema for employee
const periodEmployeeTimerecordSchema = new mongoose.Schema({
  year: String,
  employeeId: String,
  employeeName: String,
  prefix: String, // เพิ่ม prefix field
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
    payFullDay: { type: Boolean, default: false },
    isNightShiftCash: { type: Boolean, default: false },
    cashOtMul: String,
    cashSalary: String,
    cashOfHoliday: String,
    cashOfHolidayOt: String,
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
            date: String, // เพิ่มฟิลด์วันที่
            month: String, // เพิ่มฟิลด์เดือน
            year: String, // เพิ่มฟิลด์ปี
            welfareType: String, // เพิ่มฟิลด์ประเภท welfare
            startDay: String, // เพิ่มฟิลด์วันเริ่มต้น
            endDay: String, // เพิ่มฟิลด์วันสิ้นสุด
            welfareMonth: String, // เพิ่มฟิลด์เดือนจาก welfare record
            welfareYear: String, // เพิ่มฟิลด์ปีจาก welfare record
          },
        ],
    
}],

dayWorkCount : String,
dayOffCount : String,
specialDayOff : String,
customizeDayoff : String, 
cashcustomizeDayoff : String, 
personalDayOff: [{ // เพิ่ม field สำหรับเก็บวันหยุดส่วนบุคคล
  date: Number,
  month: Number,
  year: Number,
  dayName: String,
  note: String
}],
stopDaysList: [{ // เพิ่ม field สำหรับเก็บรายการวันหยุดพิเศษ (เดิมใช้ชื่อ stopDaysList)
  date: Number,
  month: Number,
  year: Number,
  dayName: String,
  note: String
}],
sumTimeWork : String,
publicHolidayCount : String,
publicHolidayCash : String,
sumOt1p5: String,
sumOt3: String,
sumOtPublicHoliday: String,
sumTimeOt : String,
sumCashWork : String,
sumCashOt : String,
employeeCompensation: String, // เงินสงเคราะห์ลูกจ้าง
sumCashWork21_30_31: String,
sumCashWork1_20: String,
sumcashDayOffCount: String,
totalAddSalary: String, // เพิ่มฟิลด์สำหรับเก็บยอดรวมเงินเพิ่ม
totalDeductSalary: String, // เพิ่มฟิลด์สำหรับเก็บยอดรวมเงินหัก
socialSecurity: String,
tax: String,
fund: String,
cash: String,
cashSpecialDay: String,
typeOfemployee: String,

sumSocialSecurity: String,
sumTax: String,
sumFund: String,
specialShiftTotalSalary:String,

addSalaryList: [
  {
    id: String,
    name: String,
    SpSalary: String,  // problem here, you're storing numbers as strings
    roundOfSalary: String,
    StaffType: String,
    nameType: String,
    message: String,
    date: String, // เพิ่มฟิลด์วันที่
    month: String, // เพิ่มฟิลด์เดือน
    year: String, // เพิ่มฟิลด์ปี
    welfareType: String, // เพิ่มฟิลด์ประเภท welfare
    startDay: String, // เพิ่มฟิลด์วันเริ่มต้น
    endDay: String, // เพิ่มฟิลด์วันสิ้นสุด
    welfareMonth: String, // เพิ่มฟิลด์เดือนจาก welfare record
    welfareYear: String, // เพิ่มฟิลด์ปีจาก welfare record
  }
],

    deductSalaryList: [
      {
        id: String,
        name: String,
        amount: String,
        payType: String,
        installment: String,
        nameType: String,
        message: String,
      },
    ],

sumCashWorkMul : {},
timeCashWorkMul : {},

});

// Create the workplace record time model based on the schema
const timerecordEmployee = mongoose.model('periodEmployeeTimerecord', periodEmployeeTimerecordSchema );

module.exports = timerecordEmployee;