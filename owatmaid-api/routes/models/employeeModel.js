const mongoose = require('mongoose');
const { workplaceSchema } = require('./workplaceModel'); // 👈 export schema ด้วย

// Define employee schema
const employeeSchema = new mongoose.Schema({
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    position: { //ตำแหน่ง
      type: String,
    },
    department: {
      type: String,
    },
    workplace: { //// รหัสหน่วยงาน
      type: String,
    },
    jobtype: {
      type: String,
    },
    startjob: { /// วันที่เริ่มงาน
      type: String,
    },
    endjob: { /// วันที่ออก
      type: String,
    },
    exceptjob: { //วันที่ประจุ
      type: String,
    },
    prefix: {
      type: String, //// คำนำหน้า
    },
    name: {
      type: String, //// use SocialSecurity
    },
    lastName: {
      type: String, //// use SocialSecurity
    },
    nickName: {
      type: String,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    age: {
      type: Number,
    },
    idCard: {
      type: String,
      required: true, //// use SocialSecurity
      unique: true,
    },
    idCardIssueDate: { //วันออกบัตร
      type: String,
    },
    idCardPlace: {
      type: String, //สถานที่ออกบัตร
    },
    stayLive: {  // จังหวัดที่อยู่
      type: String,
    },
    natnalty: { //สัญชาติ
      type: String,
    },
    origin: { // เชื้อชาติ
      type: String,
    },
    religion: { // ประเทศ
      type: String,
    },
    ethnicity: { //เชื้อชาติ
      type: String,
    },
    maritalStatus: { //สถานภาพการสมรส
      type: String,
    },
    militaryStatus: { //สถานภาพทางการทหาร
      type: String,
    },
    blood: {
      type: String,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
  
    fatherName: {
      type: String,
    },
    fatherNatnalty: {
      type: String,
    },
    motherName: {
      type: String,
    },
    motherNatnalty: {
      type: String,
    },
    emr_cntt: {
      type: String,
    },
    emr_adr1: {
      type: String,
    },
    emr_adr2: {
      type: String,
    },
    emr_adr3: {
      type: String,
    },
  
    address: {
      //บ้านเลขที่ หมู่ที่
      type: String,
    },
    
    country: {
      //ประเทศ
      type: String,
    },
    province: {
      //จังหวัด
      type: String,
    },
    district: {
      //อำเภอ
      type: String,
    },
    subDistrict: {
      //ตำบล
      type: String,
    },
    postalCode: {
      //รหัสไปรษณีย์
      type: String,
    },
    houseNumber: {
      //บ้านเลขที่
      type: String,
    },
  
    province2: {
      //จังหวัด
      type: String,
    },
    district2: {
      //อำเภอ
      type: String,
    },
    subDistrict2: {
      //ตำบล
      type: String,
    },
    postalCode2: {
      //รหัสไปรษณีย์
      type: String,
    },
    houseNumber2: {
      //บ้านเลขที่
      type: String,
    },
  
    currentAddress: {
      type: String,
    },
    currentProvince: {
      //จังหวัด
      type: String,
    },
    currentDistrict: {
      //อำเภอ
      type: String,
    },
    currentSubdistrict: {
      //ตำบล
      type: String,
    },
    currentZipcode: {
      //รหัสไปรษณีย์
      type: String,
    },
  
    phoneNumber: {
      type: String,
      // match: /^[0-9]{10}$/, // Regular expression for 10-digit phone number
    },
    emergencyContactNumber: {
      type: String,
      // match: /^[0-9]{10}$/, // Regular expression for 10-digit phone number
    },
    statusEmergencyContact: {
      type: String,
    },
    tax_id: {
      type: String,
    },
    i_type: {
      type: String,
    },
    i_card: {
      type: String,
    },
    i_exp: {
      type: String,
    },
    i_iss: {
      type: String,
    },
    iss_ampur: {
      type: String,
    },
    iss_prov: {
      type: String,
    },
    sp_intl: {
      type: String,
    },
    sp_name: {
      type: String,
    },
    sp_surnme: {
      type: String,
    },
    domicile: { // ภูมิลำเนา
      type: String,
    },
    fml_domicile_origin: { // เชื้อชาติ คู่สมรส
      type: String,
    },
    fml_natnalty: { //สัญชาติ คู่สมรส
      type: String,
    },
    fml_religion: { //ประเทศ คู่สมรส
      type: String,
    },
    fml_military: { //// สถานภาพทางการทหาร คู่สมรส
      type: String,
    },
    fml_blood: {
      type: String,
    },
    fml_height: {
      type: String,
    },
    fml_weight: {
      type: String,
    },
    fml_card_adr1: {
      type: String,
    },
    fml_card_adr2: {
      type: String,
    },
    fml_card_adr3: {
      type: String,
    },
    Fml_fatherName: {
      type: String,
    },
    Fml_motherName: {
      type: String,
    },
    Fml_fatherName2: {
      type: String,
    },
    Fml_fatherID: {
      type: String,
    },
    Fml_motherID: {
      type: String,
    },
    ssoEntryDate: { // วันเข้างานปกส
      type: String,
    },
    message: {
      type: String,
    },
    bank_initial: { // อักษรย่อของธนาคาร
      type: String,
    },
    branchBank: { // สาขาธนาคาร
      type: String,
    },
    idLine: {
      type: String,
    },
    vaccination: [], // การฉีดวัคซีน
    treatmentRights: { //สิทธิการรักษา
      type: String,
    },
    startcount: String,
    salary: String, //// use SocialSecurity
    salarytype: String,
    money: String,
    salaryupdate: Date,
    salaryout: String,
    salarypayment: String,
    salarybank: String,
    banknumber: String,
    salaryTaxType: String,
    costtype: String,
  
    salaryadd1: String,
    salaryadd1v: String,
    salaryadd2: String,
    salaryadd2v: String,
    salaryadd3: String,
    salaryadd3v: String,
    salaryadd4: String,
    salaryadd4v: String,
    salaryadd5: String,
    salaryadd5v: String,
    salaryaddtype: String,
    ///socielsecurity
    salaryadd1Sec: String,
    salaryadd2Sec: String,
    salaryadd3Sec: String,
    salaryadd4Sec: String,
    salaryadd5Sec: String,
  
    remainbusinessleave: String,
    businessleavesalary: String,
    remainsickleave: String,
    sickleavesalary: String,
    remainvacation: String,
    maternityleave: String,
    maternityleavesalary: String,
    vacationsalary: String,
    militaryleave: String,
    militaryleavesalary: String,
    sterilization: String,
    sterilizationsalary: String,
    leavefortraining: String,
    leavefortrainingsalary: String,
  
    SocialSecurityCheck: String,
    selectedOption: String,
    idPerson: String,
    salary: String,
    minus: String,
    socialsecurity: String,
    socialsecurityemployer: String,
    minusemployer: String,
  
    selectedHospDFSelect: String,
    selectedHospSelect1: String,
    selectedHospSelect2: String,
    selectedHospSelect3: String,
  
    selectedHospDf: String,
    selectedHosp1: String,
    selectedHosp2: String,
    selectedHosp3: String,
    beforebecomeEmployee: String,
    wagesbeforeusingProgram: String,
    wagesafterusingProgram: String,
    companybeforeusingProgram: String,
    ////otherExp
    number1: String,
    number2: String,
  
    input1: String,
    input2: String,
    input3: String,
    anything: String,
  
    crimeinvestigation: String,
    shirt: String,
    shirtcount: String,
    trousers: String,
    trouserscount: String,
    wholeset: String,
    wholesetcount: String,
    saveftyShoes: String,
    saveftyShoescount: String,
    apron: String,
    aproncount: String,
    hat: String,
    hatcount: String,
    custom: String,
  
    admoney1: String,
    admoney2: String,
    admoney3: String,
  
    commentadmoney1: String,
    commentadmoney2: String,
    commentadmoney3: String,
    PriceType: String,
    divide: String,
  
    addSalary: [
      {
        id: String,
        name: String,
        SpSalary: String,
        roundOfSalary: String,
        StaffType: String,
        nameType: String,
        message: String,
    effectiveMonth: { type: String, default: '01' }, // ตรวจสอบว่ามีฟิลด์นี้แล้ว
    effectiveYear: { type: String, default: () => new Date().getFullYear().toString() } // ตรวจสอบว่ามีฟิลด์นี้แล้ว
      },
    ],
    deductSalary: [
      {
        id: String,
        name: String,
        amount: String,
        payType: String,
        installment: String,
        nameType: String,
        message: String,
       
            effectiveMonth: { type: String, default: '01' }, // เพิ่มฟิลด์นี้

    effectiveYear: { type: String, default: () => new Date().getFullYear().toString() } // เพิ่มฟิลด์นี้
      },
    ],
    
    // Loan contracts management
    loanContracts: [
      {
        contractCode: String,      // รหัสสัญญา
        itemCode: String,          // รหัสรายการ (2124, 2200, etc.)
        itemDescription: String,   // คำอธิบายรายการ (หักเงินกู้, etc.)
        totalAmount: Number,       // จำนวนเงินกู้ทั้งหมด
        installments: Number,      // จำนวนงวดที่ต้องชำระ
        startMonth: String,        // เดือนที่เริ่มต้น (01-12)
        startYear: String,         // ปีที่เริ่มต้น (2024, 2025, ...)
        installmentDetails: [      // รายละเอียดการชำระแต่ละงวด
          {
            month: String,         // เดือนที่ชำระ
            year: String,          // ปีที่ชำระ
            amount: Number,        // จำนวนเงินที่ชำระ
            paymentDate: String,   // วันที่ชำระ
            installmentNumber: Number // หมายเลขงวด
          }
        ],
        createdDate: String,       // วันที่สร้างสัญญา
        updatedDate: String,       // วันที่แก้ไขล่าสุด
        status: {                  // สถานะสัญญา
          type: String,
          enum: ['active', 'completed', 'cancelled'],
          default: 'active'
        }
      }
    ],
  
    selectAddSalary: [],
    sumAddSalary: String,
    sumSalaryForTax: String,
    tax: String,
    fund: String,
    
      customWorkplace: workplaceSchema, // 👈 ใช้ schema ทั้งก้อนได้เลย
  });
  
  
  // Create the Employee model based on the schema
  const Employee = mongoose.model("Employee", employeeSchema);
  
module.exports = Employee;