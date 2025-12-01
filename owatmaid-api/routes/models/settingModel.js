const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  year: String,
  month: String,
 createDate: String,
createBy: String,
status: String,
paymentPeriod: [{
  jan: String,
  feb: String,
  mar: String,
  apr: String,
  may: String,
  jun: String,      
  jul: String,
  aug: String,
  sep: String,
  oct: String,
  nov: String,
  dec: String,
}],

social: [ {
  maxSalary   : String,
  maxSocial: String,
  socialPercent : String,
  comSocial : String,
  comSocialPercent : String,

}],
hospital : {},

salary: [{
  salaryStandard : String,
}],
leave: [{
  sickLeave: String,
  personalLeave: String,
  vacationLeave: String
}],
  
paymentCodes: [{
    transportAllowanceIds: [String],
    wageReviseIdsPlus: [String],
    wageReviseIdsMinus: [String],
    leaveInLieuIdsPlus: [String],
    leaveInLieuIdsMinus: [String],
    otherDeductIds: [String],
    plusOtherIds: [String],
    positionAndTransportationWithSocialIdsPlus: [String],
    positionAndTransportationWithSocialIdsMinus: [String],
    overtimeIdsPlus: [String],
    publicHolidayCashIds: [String],
    additionalAfterTaxIds: [String],
    deductionAfterTaxIds: [String],
    diligenceAllowanceIds: [String],
    advancePaymentIds: [String],
    totalIds: [String]
  }]
  
});

// Create the conclude record time model based on the schema
const  setting= mongoose.model('setting', settingSchema);

module.exports = setting;