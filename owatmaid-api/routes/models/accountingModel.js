const mongoose = require('mongoose');

// Define time record schema for workplace
const accountingSchema = new mongoose.Schema({
  year: String,
  month: String,
 createDate: String,
  employeeId: String,
  workplace: String,
  name: String,
  lastName: String,
  typeOfemployee: String,
  createBy: String,
accountingRecord: [{ 
  countDay: String, 
  countDayWork: String,
 amountDay: String, 
 amountOt: String, 
 countHour: String,
countOtHour: String,
amountPosition: String,
benefitNonSocial : String,
amountHardWorking: String,
tel:String,
travel: String,
amountSpecialDay: String,
 amountSpecial: String,
amountHoliday: String,
addAmountBeforeTax:String,
deductBeforeTax: String,
tax: String,
socialSecurity: String,
addAmountAfterTax:String,

advancePayment: String, 

deductAfterTax: String,
bank: String,
total: String,

sumAddSalaryBeforeTax: String,
sumAddSalaryBeforeTaxNonSocial: String,
sumDeductBeforeTaxWithSocial: String,
sumDeductBeforeTax: String,
sumAddSalaryAfterTax: String,
sumDeductAfterTax: String,
sumSalaryForTax: String,
sumAddSalary: String, 
amountCountDayWork : String, 
amountCountDayWorkOt: String, 
countHourWork : String,
countOtHourWork : String,
amountOne: String,
amountOneFive: String, 
amountTwo: String,
amountTwoFive: String,
amountThree: String, 
hourOne: String,
hourOneFive: String,
hourTwo: String,
hourTwoFive: String,
hourThree: String,

}],


addSalary: [{
  id: String,
  name: String,
  SpSalary: String,
  roundOfSalary: String,
  StaffType: String,
  nameType: String,
  message: String,
  date: String,
  month: String,
  year: String,
  welfareType: String,
  startDay: String,
  endDay: String,
  welfareMonth: String,
  welfareYear: String
}],
deductSalary: [{
  id: String,
  name: String,
  amount: String,
  payType: String,
  installment: String,
  nameType: String,
  message: String,
}],
status: String,
specialDayRate: String,
countSpecialDay: String,
specialDayListWork: []
});

// Create the conclude record time model based on the schema
const accounting= mongoose.model('accounting', accountingSchema );

module.exports = accounting;
