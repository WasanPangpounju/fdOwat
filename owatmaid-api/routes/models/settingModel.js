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
    transportAllowanceIds: [mongoose.Schema.Types.Mixed],
    wageReviseIdsPlus: [mongoose.Schema.Types.Mixed],
    wageReviseIdsMinus: [mongoose.Schema.Types.Mixed],
    leaveInLieuIdsPlus: [mongoose.Schema.Types.Mixed],
    leaveInLieuIdsMinus: [mongoose.Schema.Types.Mixed],
    otherDeductIds: [mongoose.Schema.Types.Mixed],
    plusOtherIds: [mongoose.Schema.Types.Mixed],
    positionAndTransportationWithSocialIdsPlus: [mongoose.Schema.Types.Mixed],
    positionAndTransportationWithSocialIdsMinus: [mongoose.Schema.Types.Mixed],
    overtimeIdsPlus: [mongoose.Schema.Types.Mixed],
    publicHolidayCashIds: [mongoose.Schema.Types.Mixed],
    additionalAfterTaxIds: [mongoose.Schema.Types.Mixed],
    deductionAfterTaxIds: [mongoose.Schema.Types.Mixed],
    diligenceAllowanceIds: [mongoose.Schema.Types.Mixed],
    advancePaymentIds: [mongoose.Schema.Types.Mixed],
    totalIds: [mongoose.Schema.Types.Mixed],
    
  
    netCalculationRules: {
      addToNet: [String],       // รายการที่บวกเข้ายอดสุทธิ
      subtractFromNet: [String]  // รายการที่ลบออกจากยอดสุทธิ
    }
  }]
  
});

// Create the conclude record time model based on the schema
const  setting= mongoose.model('setting', settingSchema);

module.exports = setting;