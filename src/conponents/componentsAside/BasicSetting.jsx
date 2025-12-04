import endpoint from "../../config";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "../editwindowcss.css";

function BasicSetting() {
  const [settings, setSettings] = useState([]);
  const [editSetting, setEditSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      await setLoading(true);
      const response = await axios.get(endpoint + "/basicsetting");
      if (response.status === 200) {
        const allData = response.data;
        let data = null;

        if (Array.isArray(allData) && allData.length > 0) {
          data = allData[allData.length - 1];
        }

        setSettings(data);

        // Update individual states
        setMaxSalary(data?.social?.[0]?.maxSalary || "");
        setMaxSocial(data?.social?.[0]?.maxSocial || "");
        setSocialPercent(data?.social?.[0]?.socialPercent || "");
        setComSocial(data?.social?.[0]?.comSocial || "");
        setComSocialPercent(data?.social?.[0]?.comSocialPercent || "");

        setSalaryStandard(data?.salary?.[0]?.salaryStandard || "");

        setSickLeave(data?.leave?.[0]?.sickLeave || "");
        setPersonalLeave(data?.leave?.[0]?.personalLeave || "");
        setVacationLeave(data?.leave?.[0]?.vacationLeave || "");

        // Payment period
        if (data?.paymentPeriod?.[0]) {
          setPaymentPeriod({
            jan: data.paymentPeriod[0].jan || "",
            feb: data.paymentPeriod[0].feb || "",
            mar: data.paymentPeriod[0].mar || "",
            apr: data.paymentPeriod[0].apr || "",
            may: data.paymentPeriod[0].may || "",
            jun: data.paymentPeriod[0].jun || "",
            jul: data.paymentPeriod[0].jul || "",
            aug: data.paymentPeriod[0].aug || "",
            sep: data.paymentPeriod[0].sep || "",
            oct: data.paymentPeriod[0].oct || "",
            nov: data.paymentPeriod[0].nov || "",
            dec: data.paymentPeriod[0].dec || "",
          });
        }

        // NEW: Payment codes - รวมรหัส hardcode จาก SalaryAllResult
        if (data?.paymentCodes?.[0]) {
          // Merge กับ default state เพื่อให้แน่ใจว่ามี property ทุกตัว
          setPaymentCodes(prev => ({
            ...prev,
            ...data.paymentCodes[0],
            // ตรวจสอบให้แน่ใจว่า property ที่จำเป็นต้องมีทุกตัว
            welfareIdsPlus: data.paymentCodes[0].welfareIdsPlus || prev.welfareIdsPlus || [],
            wageReviseIdsPlus: data.paymentCodes[0].wageReviseIdsPlus || prev.wageReviseIdsPlus || [],
            leaveInLieuIdsPlus: data.paymentCodes[0].leaveInLieuIdsPlus || prev.leaveInLieuIdsPlus || [],
            overtimeIdsPlus: data.paymentCodes[0].overtimeIdsPlus || prev.overtimeIdsPlus || [],
            positionAndTransportationWithSocialIdsPlus: data.paymentCodes[0].positionAndTransportationWithSocialIdsPlus || prev.positionAndTransportationWithSocialIdsPlus || [],
            diligenceAllowanceIds: data.paymentCodes[0].diligenceAllowanceIds || prev.diligenceAllowanceIds || [],
            publicHolidayCashIds: data.paymentCodes[0].publicHolidayCashIds || prev.publicHolidayCashIds || [],
            plusOtherIds: data.paymentCodes[0].plusOtherIds || prev.plusOtherIds || [],
            otherDeductIds: data.paymentCodes[0].otherDeductIds || prev.otherDeductIds || [],
            taxIdsDeduct: data.paymentCodes[0].taxIdsDeduct || prev.taxIdsDeduct || [],
            socialSecurityIdsDeduct: data.paymentCodes[0].socialSecurityIdsDeduct || prev.socialSecurityIdsDeduct || [],
            additionalAfterTaxIds: data.paymentCodes[0].additionalAfterTaxIds || prev.additionalAfterTaxIds || [],
            deductionAfterTaxIds: data.paymentCodes[0].deductionAfterTaxIds || prev.deductionAfterTaxIds || [],
            advancePaymentIds: data.paymentCodes[0].advancePaymentIds || prev.advancePaymentIds || [],
            totalIds: data.paymentCodes[0].totalIds || prev.totalIds || []
          }));
          
          // โหลดค่า categoryOperations ถ้ามี
          if (data.paymentCodes[0].categoryOperations) {
            setCategoryOperations(data.paymentCodes[0].categoryOperations);
          }
        }

        // Hospitals
        if (data?.hospitals?.[0]) {
          setSelectedLocalHospital(data.hospitals[0].province || "");
          setTmpLocalHospitalList(data.hospitals[0].hospitals || []);
        }
      }
      await setLoading(false);
    } catch (err) {
      await setError(err.message);
      await setLoading(false);
    }
  };

  // Social Insurance
  const [maxSalary, setMaxSalary] = useState("");
  const [maxSocial, setMaxSocial] = useState("");
  const [socialPercent, setSocialPercent] = useState("");
  const [comSocial, setComSocial] = useState("");
  const [comSocialPercent, setComSocialPercent] = useState("");

  // Salary
  const [salaryStandard, setSalaryStandard] = useState("");

  // Leave
  const [sickLeave, setSickLeave] = useState("");
  const [personalLeave, setPersonalLeave] = useState("");
  const [vacationLeave, setVacationLeave] = useState("");

  // Payment Period
  const [paymentPeriod, setPaymentPeriod] = useState({
    jan: "",
    feb: "",
    mar: "",
    apr: "",
    may: "",
    jun: "",
    jul: "",
    aug: "",
    sep: "",
    oct: "",
    nov: "",
    dec: "",
  });

  // Hospital Selection
  const [selectedLocalHospital, setSelectedLocalHospital] = useState("");
  const [tmpLocalHospitalList, setTmpLocalHospitalList] = useState([]);
  const [tmpHospital, setTmpHospital] = useState([]);
  const [newHospital, setNewHospital] = useState("");

  // NEW: Payment Code Settings
  const [paymentCodes, setPaymentCodes] = useState({
      // ค่าขนส่ง
    transportAllowanceIds: [],
    // ปรับปรุงค่าจ้าง
    wageReviseIdsPlus: [],
    wageReviseIdsMinus: [],
    // ชดเชยวันลา
    leaveInLieuIdsPlus: [],
    leaveInLieuIdsMinus: [],
    // หักอื่นๆ ก่อนภาษี
    otherDeductIds: [],
    // บวกอื่นๆ ก่อนภาษี
    plusOtherIds: [],
    // ตำแหน่ง/ค่าตำแหน่ง
    positionAndTransportationWithSocialIdsPlus: [],
    positionAndTransportationWithSocialIdsMinus: [],
    // ค่าล่วงเวลา
    overtimeIdsPlus: [],
    // สวัสดิการพิเศษ
    welfareIdsPlus: [],
    // นักขัติ/วันหยุด
    publicHolidayCashIds: [],
    // บวกอื่นๆ หลังภาษี
    additionalAfterTaxIds: [],
    // หักอื่นๆ หลังภาษี
    deductionAfterTaxIds: [],
    // หักภาษี
    taxIdsDeduct: [],
    // หัก ปกส
    socialSecurityIdsDeduct: [],
    // รหัสเดี่ยว
    diligenceAllowanceIds: [],           // เบี้ยขยัน
    advancePaymentIds: [],               // เงินล่วงหน้า
    // สุทธิ
    totalIds: []
  });

  const [newPaymentCode, setNewPaymentCode] = useState({
    type: "wageReviseIdsPlus",
    code: "",
    operation: "add" // add = บวก, subtract = ลบ
  });

  const [editMode, setEditMode] = useState(false);
  const [paymentCodesBackup, setPaymentCodesBackup] = useState({});

  // Payment Code Name Mapping - ดึงจาก API
  const [paymentCodeNames, setPaymentCodeNames] = useState({});
  const [paymentCodeName, setPaymentCodeName] = useState(""); // ชื่อรายการที่แสดง
  
  // State สำหรับ Payment Code Reference Note
  const [showPaymentCodes, setShowPaymentCodes] = useState(false); // Minimize/Expand
  const [searchCode, setSearchCode] = useState(""); // ค้นหารหัส/ชื่อ
  
  // ฟังก์ชันดึงรายการรหัสทั้งหมดจาก API
  const fetchPaymentCodeNames = async () => {
    try {
      const response = await axios.post(endpoint + "/employee/search", {
        employeeId: "0001" 
      });
      
      if (response.status === 200 && response.data.employees && response.data.employees.length > 0) {
        const employee = response.data.employees[0];
        const codeMapping = {};
        
        // รวมรหัสจาก addSalary (รหัสบวก)
        if (employee.addSalary && Array.isArray(employee.addSalary)) {
          employee.addSalary.forEach(item => {
            if (item.id && item.name) {
              codeMapping[item.id] = item.name;
            }
          });
        }
        
        // รวมรหัสจาก newAddSalary (ถ้ามี)
        if (employee.newAddSalary && Array.isArray(employee.newAddSalary)) {
          employee.newAddSalary.forEach(item => {
            if (item.id && item.name) {
              codeMapping[item.id] = item.name;
            }
          });
        }
        
        // รวมรหัสจาก deductSalary (รหัสหัก)
        if (employee.deductSalary && Array.isArray(employee.deductSalary)) {
          employee.deductSalary.forEach(item => {
            if (item.id && item.name) {
              codeMapping[item.id] = item.name;
            }
          });
        }
        
        // รวมรหัสจาก newDeductSalary (ถ้ามี)
        if (employee.newDeductSalary && Array.isArray(employee.newDeductSalary)) {
          employee.newDeductSalary.forEach(item => {
            if (item.id && item.name) {
              codeMapping[item.id] = item.name;
            }
          });
        }
        
        setPaymentCodeNames(codeMapping);
        console.log('โหลดรายการรหัสทั้งหมด:', Object.keys(codeMapping).length, 'รายการ');
      }
    } catch (error) {
      console.error('ไม่สามารถดึงข้อมูลรายการรหัสได้:', error);
    }
  };

  // NEW: Category Operations - กำหนด operation ของแต่ละหัวข้อในสูตรเงินสุทธิ
  const [categoryOperations, setCategoryOperations] = useState({
    wageRevise: "add",                              // ปรับปรุงค่าจ้าง
    leaveInLieu: "add",                             // ชดเชยวันลา
    ot: "add",                                      // ค่าล่วงเวลา
    transportation: "add",                          // ค่าพาหนะ
    positionAndTransportationWithSocial: "add",     // ตำแหน่ง
    welfare: "add",                                 // สวัสดิการพิเศษ
    diligence: "add",                               // เบี้ยขยัน
    holiday: "add",                                 // วันหยุด
    additionalBeforeTax: "add",                     // บวกอื่นๆ ก่อนภาษี
    deductionBeforeTax: "subtract",                 // หักอื่นๆ ก่อนภาษี
    additionalAfterTax: "add",                      // บวกอื่นๆ หลังภาษี
    deductionAfterTax: "subtract",                  // หักอื่นๆ หลังภาษี
    advancePayment: "subtract"                      // เงินเบิกล่วงหน้า
  });

  // Hospital Data
  const localHospitalList = [
    { value: "Bangkok", label: "กรุงเทพ" },
    { value: "BangkokPrivate", label: "เอกชนกรุงเทพ" },
    { value: "LopBuri", label: "ลพบุรี" },
    { value: "NakhonPathom", label: "นครปฐม" },
    { value: "Nonthaburi", label: "นนทบุรี" },
    { value: "SamutSakhon", label: "สมุทรสาคร" },
    { value: "Chachoengsao", label: "ฉะเชิงเทรา" },
    { value: "Rayong", label: "ระยอง" },
    { value: "SamutPrakan", label: "สมุทรปราการ" },
    { value: "Saraburi", label: "สระบุรี" },
    { value: "PrachinBuri", label: "ปราจีนบุรี" },
    { value: "KamphaengPhet", label: "กำแพงเพชร" },
    { value: "Ayutthaya", label: "อยุธยา" },
  ];

  const hospital = {
    Bangkok: [
      "คณะแพทยศาสตร์วชิรพยาบาล",
      "รพ.กลาง",
      "รพ.จุฬาลงกรณ์",
      "รพ.เจริญกรุงประชารักษ์",
      "รพ.ตากสิน",
      "รพ.ตำรวจ ",
      "รพ.ทัณฑสถานโรงพยาบาลราชทัณฑ์",
      "รพ.นพรัตนราชธานี(สธ)",
      "รพ.พระมงกุฎเกล้า",
      "รพ.ภูมิพลอดุลยเดช",
      "รพ.ราชวิถี(สธ)",
      "รพ.รามาธิบดี",
      "รพ.ราชพิพัฒน์",
      "รพ.เลิดสิน(สธ)",
      "รพ.เวชการุณย์รัศมิ์",
      "รพ.ศิริราช",
      "รพ.สมเด็จพระปิ่นเกล้า",
      "รพ.หลวงพ่อทวีศักดิ์ ชุตินฺธโร อุทิศ",
      "รพ.ลาดกระบัง กรุงเทพมหานคร",
    ],
    BangkokPrivate: [
      "รพ.ทั่วไปขนาดใหญ่กล้วยน้ำไท",
      "รพ.เกษมราษฎร์ บางแคโรงพยาบาล ทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ประชาชื่น",
      "รพ..เกษมราษฎร์ รามคำแหงโรงพยาบาลทั่วไปขนาดใหญ่",
      "นวมินทร์โรงพยาบาลทั่วไปขนาดใหญ่",
      "นวมินทร์ 9 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่บางนา 1",
      "รพ.บางปะกอก 8 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.บางไผ่โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.บางมดโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่ บี.แคร์ เมดิคอลเซ็นเตอร์",
      "รพ.ทั่วไปขนาดใหญ่ เปาโล โชคชัย 4",
      "รพ.ทั่วไปขนาดใหญ่เปาโล เกษตร",
      "รพ.ทั่วไปขนาดใหญ่ พีเอ็มจี",
      "รพ.พญาไท นวมินทร์ โรงพยาบาลทั่วไป ขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่มิตรประชา",
      "รพ.เพชรเวชโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่แพทย์ปัญญา",
      "รพ.มเหสักข์โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.มงกุฎวัฒนะ",
      "รพ.มิชชั่นโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่ราษฎร์บูรณะ",
      "รพ.ทั่วไปขนาดใหญ่ลาดพร้าว",
      "วิภาราม โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่ศิครินทร์",
      "รพ.ซีจีเอช สายไหม โรงพยาบาล ทั่วไปขนาดใหญ่",
      "รพ.สุขสวัสดิ์อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.หัวเฉียวโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ไอเอ็มเอช ธนบุรี โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    LopBuri: ["รพ.บ้านหมี่(สธ)", "รพ.พระนารายณ์มหาราช", "รพ.อานันทมหิดล"],
    NakhonPathom: [
      "รพ.จันทรุเบกษา",
      "รพ.นครปฐม(สธ)",
      "รพ.เมตตาประชารักษ์ วัดไร่ขิง(สธ)",
      "รพ.เทพากรโรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    Nonthaburi: [
      "รพ.พระนั่งเกล้า(สธ)",
      "รพ.ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน",
      "รพ.สถาบันบำราศนราดูร",
      "รพ.กรุงไทยโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ รัตนาธิเบศร์",
      "รพ.วิภารามปากเกร็ด โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    SamutSakhon: [
      "รพ.กระทุ่มแบน(สธ)",
      "รพ.บ้านแพ้ว(สธ)",
      "รพ.สมุทรสาคร(สธ)",
      "รพ.มหาชัย 2 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.มหาชัย 3 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.วิภาราม สมุทรสาครโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ อ้อมน้อย",
      "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ สมุทรสาคร",
    ],
    Chachoengsao: [
      "รพ.พุทธโสธร(สธ)",
      "รพ.เกษมราษฎร์ ฉะเชิงเทราโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.จุฬารัตน์ 11 อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    Rayong: [
      "รพ.ระยอง(สธ)",
      "รพ.เฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี ระยอง(สธ)",
      "รพ.มงกุฎระยอง",
      "รพ.จุฬารัตน์ระยองโรงพยาบาลทั่วไปขนาดกลาง",
    ],
    SamutPrakan: [
      "รพ.พ.บางบ่อ(สธ)",
      "รพ.บางพลี(สธ)",
      "รพ..สมุทรปราการ(สธ)",
      "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 3 อินเตอร์",
      "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 9 แอร์พอร์ต",
      "รพ.ทั่วไปขนาดใหญ่โรงพยาบาลเซ็นทรัล ปาร์ค",
      "รพ.ทั่วไปขนาดใหญ่บางนา 2",
      "รพ.ทั่วไปขนาดใหญ่บางนา 5",
      "รพ..บางปะกอก 3 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่เปาโล สมุทรปราการ",
      "รพ..เมืองสมุทรปากน าโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ..เมืองสมุทรปู่เจ้าฯ โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่รวมชัยประชารักษ์",
      "รพ.ทั่วไปขนาดใหญ่ศิครินทร์ สมุทรปราการ",
      "รพ.ทั่วไปขนาดใหญ่ส าโรงการแพทย์",
      "รพ.รามาธิบดีจักรีนฤบดินทร์",
      "รพ..เปาโล พระประแดงโรงพยาบาลทั่วไปขนาดกลาง",
    ],
    Saraburi: [
      "รพ.พระพุทธบาท(สธ)",
      "รพ.สระบุรี(สธ)",
      "รพ.เกษมราษฎร์ สระบุรีโรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    PrachinBuri: [
      "รพ.กบินทร์บุรี(สธ)",
      "รพ.เกษมราษฎร์ ปราจีนบุรีโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ค่ายจักรพงษ์",
      "รพ.เจ้าพระยาอภัยภูเบศร(สธ)",
      "รพ.ทั่วไปขนาดกลางจุฬารัตน์ 304 อินเตอร์",
    ],
    KamphaengPhet: ["รพ.กำแพงเพชร(สธ)"],
    Ayutthaya: [
      "รพ.พระนครศรีอยุธยา(สธ)",
      "รพ.เสนา(สธ)",
      "รพ.การุญเวช อยุธยาโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ราชธานีโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ราชธานี โรจนะโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.เอเชียอินเตอร์เนชั่นแนล โรงพยาบาลทั่วไปขนาดกลาง",
    ],
  };

  // NEW: Payment Code Types
  const paymentCodeTypes = {
    wageReviseIdsPlus: "ปรับปรุงค่าจ้าง",
    leaveInLieuIdsPlus: "ชดเชยวันลา",
    overtimeIdsPlus: "ค่าล่วงเวลา",
    welfareIdsPlus: "สวัสดิการพิเศษ",
    positionAndTransportationWithSocialIdsPlus: "ตำแหน่ง",
    diligenceAllowanceIds: "เบี้ยขยัน",
    publicHolidayCashIds: "นักขัติ/วันหยุด",
    plusOtherIds: "บวกอื่นๆ",
    otherDeductIds: "หักอื่นๆ",
    taxIdsDeduct: "หักภาษี",
    socialSecurityIdsDeduct: "หัก ปกส",
    additionalAfterTaxIds: "บวกอื่นๆ",
    deductionAfterTaxIds: "หักอื่นๆ",
    advancePaymentIds: "เบิกล่วงหน้า",
    totalIds: "สุทธิ",
  };

  useEffect(() => {
    document.title = "ตั้งค่าระบบ";
    fetchSettings();
    fetchPaymentCodeNames();
  }, []);

  const handlePaymentPeriodChange = (month, value) => {
    setPaymentPeriod((prev) => ({
      ...prev,
      [month]: value,
    }));
  };

  // NEW: Payment Code Functions
  const handleEditMode = () => {
    if (!editMode) {
      // เข้าสู่โหมดแก้ไข - backup ข้อมูลปัจจุบัน
      setPaymentCodesBackup({ ...paymentCodes });
      setEditMode(true);
    } else {
      // ยกเลิกแก้ไข - restore ข้อมูลจาก backup
      setPaymentCodes({ ...paymentCodesBackup });
      setEditMode(false);
    }
  };

  const handleSaveEdit = () => {
    // บันทึกการเปลี่ยนแปลง - ออกจากโหมดแก้ไข
    setEditMode(false);
    setPaymentCodesBackup({});
    // Add save to server logic here if needed
  };

  const handleAddPaymentCode = () => {
    const codeToAdd = newPaymentCode.code.trim();
    if (codeToAdd === "") {
      alert("กรุณากรอกรหัส");
      return;
    }
    
    // Prevent duplicate code in all types
    const allCodes = Object.values(paymentCodes).flat().map(item => 
      typeof item === 'string' ? item : item.code
    );
    if (allCodes.includes(codeToAdd)) {
      alert("รหัสได้ถูกใช้งานแล้ว กรุณากรอกรหัสใหม่");
      return;
    }
    
    // Check if the selected type exists in paymentCodes
    if (!Object.prototype.hasOwnProperty.call(paymentCodes, newPaymentCode.type)) {
      alert("ไม่สามารถเพิ่มรหัสในหมวดนี้ได้ กรุณาเลือกหมวดที่ถูกต้อง");
      return;
    }
    
    // เพิ่มรหัสพร้อมกับประเภท operation
    setPaymentCodes((prev) => ({
      ...prev,
      [newPaymentCode.type]: [
        ...prev[newPaymentCode.type],
        {
          code: codeToAdd,
          operation: newPaymentCode.operation // "add" หรือ "subtract"
        }
      ],
    }));
    
    setNewPaymentCode((prev) => ({ ...prev, code: "" }));
    setPaymentCodeName(""); // เคลียร์ชื่อรายการด้วย
  };

  const handleRemovePaymentCode = (type, index) => {
    setPaymentCodes((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handlePaymentCodeTypeChange = (event) => {
    setNewPaymentCode((prev) => ({
      ...prev,
      type: event.target.value,
      code: "" // เคลียร์รหัสเมื่อเปลี่ยนประเภท
    }));
    setPaymentCodeName(""); // เคลียร์ชื่อรายการด้วย
  };

  const handlePaymentCodeChange = (event) => {
    const code = event.target.value;
    setNewPaymentCode((prev) => ({
      ...prev,
      code: code,
    }));
    
    // ค้นหาชื่อรายการจากรหัส
    const name = paymentCodeNames[code] || "";
    setPaymentCodeName(name);
  };

  const handleOperationChange = (event) => {
    setNewPaymentCode((prev) => ({
      ...prev,
      operation: event.target.value,
    }));
  };

  const handleSelectionLocalHospotalChange = (event) => {
    setSelectedLocalHospital(event.target.value);
    setTmpLocalHospitalList(hospital[event.target.value] || []);
  };

  const handleSelectionHospotalChange = (event) => {
    setTmpHospital(event.target.value);
  };

  // Hospital Management Functions
  const handleAddHospital = () => {
    if (newHospital.trim() === "") {
      alert("กรุณากรอกชื่อโรงพยาบาล");
      return;
    }
    setTmpLocalHospitalList((prev) => [...prev, newHospital.trim()]);
    setNewHospital("");
  };

  const handleDeleteHospital = (index) => {
    setTmpLocalHospitalList((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleManageSetting(event) {
    event.preventDefault();

    // คำนวณ netCalculationRules จาก categoryOperations ที่ผู้ใช้กำหนด
    const calculateNetRules = () => {
      const addToNet = [];
      const subtractFromNet = [];

      // วนลูปผ่าน categoryOperations ที่ผู้ใช้เลือก
      Object.entries(categoryOperations).forEach(([fieldName, operation]) => {
        if (operation === 'add') {
          addToNet.push(fieldName);
        } else if (operation === 'subtract') {
          subtractFromNet.push(fieldName);
        }
      });

      return {
        addToNet,
        subtractFromNet,
        categoryOperations // ส่งข้อมูล categoryOperations ไปด้วยเพื่อใช้อ้างอิง
      };
    };

    const autoNetRules = calculateNetRules();

    const settingData = {
      social: [
        {
          maxSalary,
          maxSocial,
          socialPercent,
          comSocial,
          comSocialPercent,
        },
      ],
      salary: [
        {
          salaryStandard,
        },
      ],
      leave: [
        {
          sickLeave,
          personalLeave,
          vacationLeave,
        },
      ],
      paymentPeriod: [paymentPeriod],
      // NEW: Add payment codes to data
      paymentCodes: [{
        ...paymentCodes,
        categoryOperations, // บันทึกการตั้งค่า category operations
        netCalculationRules: autoNetRules // ใช้ค่าที่คำนวณอัตโนมัติ
      }],
      hospitals: [
        {
          province: selectedLocalHospital,
          hospitals: tmpLocalHospitalList,
        },
      ],
      year: new Date().getFullYear().toString(),
      month: new Date().toLocaleString("default", { month: "long" }),
      createDate: new Date().toISOString(),
      createBy: "Admin",
      status: "active",
    };

    try {
      const response = await axios.post(
        endpoint + "/basicsetting",
        settingData
      );
      if (response.status === 201) {
        alert("Data saved successfully!");
        fetchSettings();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    }
  }

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <a href="#">หน้าหลัก</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#"> ระบบจัดการพนักงาน</a>
            </li>
            <li className="breadcrumb-item ">ข้อมูลเงินเดือน</li>
          </ol>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="far fa-arrow-alt-circle-right"></i> ตั้งค่าระบบ
                </h1>
              </div>
              <div className="row mb-8 justify-content-center align-items-center">
                <div className="col-md-6 text-center">
                  {loading && <p>Loading...</p>}
                  {error && <p>Error: {error}</p>}
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <form onSubmit={handleManageSetting}>
                    {/* Existing Social Insurance Section */}
                    {/* <h2 className="title">รายละเอียดประกันสังคม</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              เงินเดือนมากกว่า
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินเดือน"
                                value={maxSalary}
                                onChange={(e) => setMaxSalary(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">
                              หักสูงสุด
                            </label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินหัก"
                                value={maxSocial}
                                onChange={(e) => setMaxSocial(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">฿</label>
                          </div>

                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              เงินเดือนน้อยกว่า
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินเดือน"
                                value={maxSalary}
                                readOnly
                              />
                            </div>
                            <label className="col-md-1 col-form-label">
                              เปอร์เซ็นต์หัก
                            </label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="หัก"
                                value={socialPercent}
                                onChange={(e) =>
                                  setSocialPercent(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-md-1 col-form-label">%</label>
                          </div>
                          <h5>นายจ้าง</h5>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              สมทบประกันสังคมไม่เกิน
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินสมทบ"
                                value={comSocial}
                                onChange={(e) => setComSocial(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">฿</label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เปอร์เซ็นต์"
                                value={comSocialPercent}
                                onChange={(e) =>
                                  setComSocialPercent(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-md-1 col-form-label">%</label>
                          </div>
                        </section>
                      </div>
                    </div> */}
                    {/* NEW: Payment Code Settings Section - อยู่ด้านบนของ Payment Period */}
                    <h2 className="title">ตั้งค่ารหัสการจ่ายเงินแต่ละประเภท</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame p-4">
                           {/* Payment Code Reference Note */}
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame p-3" style={{ backgroundColor: "#f8f9fa" }}>
                          {/* Header with Minimize/Expand Button */}
                          <div 
                            className="d-flex align-items-center justify-content-between mb-2" 
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPaymentCodes(!showPaymentCodes)}
                          >
                            <div className="d-flex align-items-center">
                              <i className="fas fa-list-ul  mr-2" style={{ fontSize: "1.2rem" }}></i>
                              <h5 className="mb-0">รหัสรายการทั้งหมดในระบบ</h5>
                              <span className="badge  ml-2"style={{backgroundColor:"rgb(43,93,142)"}}>
                                {Object.keys(paymentCodeNames).length} รายการ
                              </span>
                            </div>
                            <button 
                              type="button"
                              className="btn btn-sm btn-outline-primary "
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPaymentCodes(!showPaymentCodes);
                              }}
                              style={{backgroundColor:"rgb(43,93,142)"}}
                            >
                              <i className={`fas fa-chevron-${showPaymentCodes ? 'up' : 'down'} mr-1`}></i>
                              {showPaymentCodes ? 'ซ่อน' : 'แสดง'}
                            </button>
                          </div>

                          {/* Expandable Content */}
                          {showPaymentCodes && (
                            <>
                              <div className="">
                                <i className="fas fa-info-circle mr-1"></i>
                                <strong>คำแนะนำ:</strong> ใช้รหัสเหล่านี้ในการกรอกข้อมูลรหัสรายการต่างๆ (ปรับปรุงค่าจ้าง, ค่าล่วงเวลา, เบี้ยขยัน ฯลฯ)
                              </div>

                              {/* Search Input */}
                              <div className="mb-3">
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <i className="fas fa-search"></i>
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ค้นหาด้วยรหัสหรือชื่อรายการ... (เช่น 1410 หรือ เบี้ยขยัน)"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value)}
                                  />
                                  {searchCode && (
                                    <div className="input-group-append">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setSearchCode("")}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Payment Codes List */}
                              {Object.keys(paymentCodeNames).length > 0 ? (
                                (() => {
                                  const filteredCodes = Object.entries(paymentCodeNames)
                                    .filter(([code, name]) => {
                                      const searchTerm = searchCode.toLowerCase().trim();
                                      if (!searchTerm) return true;
                                      return code.toLowerCase().includes(searchTerm) || 
                                             name.toLowerCase().includes(searchTerm);
                                    })
                                    .sort((a, b) => a[0].localeCompare(b[0], 'th', { numeric: true }));

                                  return filteredCodes.length > 0 ? (
                                    <>
                                      <div className="mb-2 text-muted">
                                        <small>
                                          แสดง {filteredCodes.length} จาก {Object.keys(paymentCodeNames).length} รายการ
                                        </small>
                                      </div>
                                      <div className="row" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                        {filteredCodes.map(([code, name]) => (
                                          <div key={code} className="col-md-4 mb-2">
                                            <div className="p-2 border rounded" style={{ backgroundColor: "white" }}>
                                              <span className="badge  mr-2" style={{ minWidth: "60px",backgroundColor:"rgb(43,93,142)"  }}>
                                                {code}
                                              </span>
                                              <span>{name}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-center text-muted py-3">
                                      <i className="fas fa-search mr-2"></i>
                                      ไม่พบรายการที่ค้นหา "{searchCode}"
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-center text-muted py-3">
                                  <i className="fas fa-spinner fa-spin mr-2"></i>
                                  กำลังโหลดรายการรหัส...
                                </div>
                              )}
                            </>
                          )}
                        </section>
                      </div>
                    </div>
                          {/* Header & Add Form */}
                          <div className="row mb-4 align-items-end">
                            <div className="col-md-3">
                              <label className="form-label">ประเภทรายการ</label>
                              <select
                                className="form-control"
                                value={newPaymentCode.type}
                                onChange={handlePaymentCodeTypeChange}
                              >
                                {Object.entries(paymentCodeTypes).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">รหัส (ตัวเลข)</label>
                              <input
                                type="text"
                                className="form-control"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={newPaymentCode.code}
                                onChange={(e) => {
                                  const val = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  handlePaymentCodeChange({
                                    target: { value: val },
                                  });
                                }}
                                placeholder="ระบุรหัส"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">ชื่อรายการ</label>
                              <input
                                type="text"
                                className="form-control bg-light"
                                value={paymentCodeName}
                                readOnly
                                placeholder="ชื่อรายการจะแสดงที่นี่"
                                style={{ 
                                  fontWeight: paymentCodeName ? "500" : "normal",
                                  color: paymentCodeName ? "#28a745" : "#6c757d"
                                }}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">บวก/ลบ</label>
                              <select
                                className="form-control"
                                value={newPaymentCode.operation}
                                onChange={handleOperationChange}
                              >
                                <option value="add">+ บวก</option>
                                <option value="subtract">- ลบ</option>
                              </select>
                            </div>
                            <div className="col-md-2">
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className="btn "
                                  onClick={handleAddPaymentCode}
                                  style={{backgroundColor:"rgb(43,93,142)", color:"white"}}
                                >
                                  <i className="fas fa-plus mr-1"></i> เพิ่ม
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${
                                    editMode ? "btn-secondary" : "btn-warning"
                                  }`}
                                  onClick={handleEditMode}
                                >
                                  <i
                                    className={`fas ${
                                      editMode ? "fa-times" : "fa-edit"
                                    } mr-1`}
                                  ></i>
                                  {editMode ? "ยกเลิกแก้ไข" : "แก้ไขรายการ"}
                                </button>
                                {editMode && (
                                  <button
                                    type="button"
                                    className="btn b_save"
                                    onClick={handleSaveEdit}
                                  >
                                    <i className="fas fa-save mr-1"></i> บันทึก
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <hr />

                          {/* Grid Display */}
                          <div className="row">
                            {Object.entries(paymentCodeTypes).map(
                              ([type, label]) => (
                                <div key={type} className="col-md-4 col-lg-3 mb-3">
                                  <div className="card h-100 shadow-sm border">
                                    <div className="card-header bg-light py-2">
                                      <strong style={{ fontSize: "0.95rem" }}>
                                        {label}
                                      </strong>
                                    </div>
                                    <div className="card-body p-2">
                                      {paymentCodes[type]?.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-1">
                                          {paymentCodes[type].map(
                                            (item, idx) => {
                                              // รองรับทั้ง string (เก่า) และ object (ใหม่)
                                              const code = typeof item === 'string' ? item : item.code;
                                              const operation = typeof item === 'object' ? item.operation : 'add';
                                              const operationSymbol = operation === 'add' ? '+' : '-';
                                              const operationClass = operation === 'add' ? '' : 'badge-danger';
                                              const operationStyle = operation === 'add' ? { backgroundColor: 'rgb(43,93,142)' } : {};
                                              
                                              return (
                                                <span
                                                  key={idx}
                                                  className={`badge ${editMode ? 'badge-warning' : operationClass} p-2 d-flex align-items-center`}
                                                  style={{
                                                    fontSize: "0.9rem",
                                                    fontWeight: "normal",
                                                    gap: "6px",
                                                    ...(editMode ? {} : operationStyle)
                                                  }}
                                                >
                                                  <strong>{operationSymbol}</strong> {code}
                                                  {editMode && (
                                                    <i
                                                      className="fas fa-times-circle text-dark"
                                                      style={{
                                                        cursor: "pointer",
                                                        fontSize: "1rem",
                                                      }}
                                                      onClick={() =>
                                                        handleRemovePaymentCode(
                                                          type,
                                                          idx
                                                        )
                                                      }
                                                      title="ลบ"
                                                    ></i>
                                                  )}
                                                </span>
                                              );
                                            }
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted small">
                                          - ไม่มีข้อมูล -
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </section>
                      </div>
                    </div>

                   

                    {/* NEW: Net Salary Calculation Settings */}
                    <h2 className="title">กำหนดการคำนวณเงินสุทธิ</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame p-4">
                          <p className="text-muted mb-4">
                            <i className="fas fa-info-circle mr-1"></i>
                            กำหนดว่าแต่ละหัวข้อควร <strong>บวก (+)</strong> หรือ{" "}
                            <strong>ลบ (-)</strong> ในสูตรเงินสุทธิ
                            <br />
                            <small>
                              หมายเหตุ: ภาษีและประกันสังคมจะหักออกจากเงินสุทธิเสมอ
                            </small>
                          </p>

                          <div className="row">
                            {[
                              { key: "wageRevise", label: "ปรับปรุงค่าจ้าง" },
                              { key: "leaveInLieu", label: "ชดเชยวันลา" },
                              { key: "ot", label: "ค่าล่วงเวลา (OT)" },
                              { key: "transportation", label: "ค่าพาหนะ" },
                              {
                                key: "positionAndTransportationWithSocial",
                                label: "ตำแหน่ง/ค่าตำแหน่ง",
                              },
                              { key: "welfare", label: "สวัสดิการพิเศษ" },
                              { key: "diligence", label: "เบี้ยขยัน" },
                              { key: "holiday", label: "นักขัตฤกษ์/วันหยุด" },
                              {
                                key: "additionalBeforeTax",
                                label: "บวกอื่นๆ ก่อนภาษี",
                              },
                              {
                                key: "deductionBeforeTax",
                                label: "หักอื่นๆ ก่อนภาษี",
                                default: "subtract",
                              },
                              {
                                key: "additionalAfterTax",
                                label: "บวกอื่นๆ หลังภาษี",
                              },
                              {
                                key: "deductionAfterTax",
                                label: "หักอื่นๆ หลังภาษี",
                                default: "subtract",
                              },
                              {
                                key: "advancePayment",
                                label: "เงินเบิกล่วงหน้า",
                                default: "subtract",
                              },
                            ].map((item) => (
                              <div key={item.key} className="col-md-6 mb-3">
                                <div
                                  className="d-flex align-items-center justify-content-between p-2 border rounded bg-white"
                                  style={{ minHeight: "60px" }}
                                >
                                  <label
                                    className="mb-0 font-weight-bold text-dark"
                                    style={{ fontSize: "0.95rem" }}
                                  >
                                    {item.label}
                                  </label>
                                  <div
                                    className="btn-group btn-group-toggle"
                                    data-toggle="buttons"
                                  >
                                    <label
                                      className={`btn btn-sm ${
                                        (categoryOperations[item.key] ||
                                          item.default ||
                                          "add") === "add"
                                          ? "btn-success active"
                                          : "btn-outline-secondary btn-secondary"
                                      }`}
                                      style={{ width: "80px" }}
                                      onClick={() =>
                                        setCategoryOperations((prev) => ({
                                          ...prev,
                                          [item.key]: "add",
                                        }))
                                      }
                                    >
                                      <input
                                        type="radio"
                                        name={item.key}
                                        autoComplete="off"
                                        checked={
                                          (categoryOperations[item.key] ||
                                            item.default ||
                                            "add") === "add"
                                        }
                                        readOnly
                                      />{" "}
                                      <i className="fas fa-plus mr-1"></i> บวก
                                    </label>
                                    <label
                                      className={`btn btn-sm ${
                                        (categoryOperations[item.key] ||
                                          item.default ||
                                          "add") === "subtract"
                                          ? "btn-danger active"
                                          : "btn-outline-secondary btn-secondary"
                                      }`}
                                      style={{ width: "80px" }}
                                      onClick={() =>
                                        setCategoryOperations((prev) => ({
                                          ...prev,
                                          [item.key]: "subtract",
                                        }))
                                      }
                                    >
                                      <input
                                        type="radio"
                                        name={item.key}
                                        autoComplete="off"
                                        checked={
                                          (categoryOperations[item.key] ||
                                            item.default ||
                                            "add") === "subtract"
                                        }
                                        readOnly
                                      />{" "}
                                      <i className="fas fa-minus mr-1"></i> ลบ
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* แสดงสูตรที่เกิดขึ้น */}
                          <div className="mt-4">
                            <h5 className="mb-3 text-primary">
                              <i className="fas fa-calculator mr-2"></i>
                              สูตรเงินสุทธิที่จะใช้
                            </h5>
                            <div
                              className="p-3 rounded border"
                              style={{
                                backgroundColor: "#f8f9fa",
                                borderLeft: "4px solid #007bff",
                              }}
                            >
                              <p
                                className="mb-0"
                                style={{
                                  fontSize: "1rem",
                                  lineHeight: "1.8",
                                  fontFamily: "Sarabun, sans-serif",
                                }}
                              >
                                <span className="badge badge-dark p-2 mr-1">
                                  เงินสุทธิ
                                </span>{" "}
                                = <span className="text-primary">เงินเดือนฐาน</span>
                                {[
                                  { key: "wageRevise", label: "ปรับปรุงค่าจ้าง" },
                                  { key: "leaveInLieu", label: "ชดเชยวันลา" },
                                  { key: "ot", label: "ค่าล่วงเวลา" },
                                  { key: "transportation", label: "ค่าพาหนะ" },
                                  {
                                    key: "positionAndTransportationWithSocial",
                                    label: "ตำแหน่ง",
                                  },
                                  { key: "welfare", label: "สวัสดิการพิเศษ" },
                                  { key: "diligence", label: "เบี้ยขยัน" },
                                  { key: "holiday", label: "วันหยุด" },
                                  {
                                    key: "additionalBeforeTax",
                                    label: "บวกอื่นๆ(ก่อนภาษี)",
                                  },
                                  {
                                    key: "deductionBeforeTax",
                                    label: "หักอื่นๆ(ก่อนภาษี)",
                                    default: "subtract",
                                  },
                                ].map((item) => {
                                  const op =
                                    categoryOperations[item.key] ||
                                    item.default ||
                                    "add";
                                  return (
                                    <span
                                      key={item.key}
                                      className={
                                        op === "add"
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {" "}
                                      {op === "add" ? "+" : "-"} {item.label}
                                    </span>
                                  );
                                })}
                                <span className="text-danger"> - ภาษี</span>
                                <span className="text-danger">
                                  {" "}
                                  - ประกันสังคม
                                </span>
                                {[
                                  {
                                    key: "additionalAfterTax",
                                    label: "บวกอื่นๆ(หลังภาษี)",
                                  },
                                  {
                                    key: "deductionAfterTax",
                                    label: "หักอื่นๆ(หลังภาษี)",
                                    default: "subtract",
                                  },
                                  {
                                    key: "advancePayment",
                                    label: "เงินเบิกล่วงหน้า",
                                    default: "subtract",
                                  },
                                ].map((item) => {
                                  const op =
                                    categoryOperations[item.key] ||
                                    item.default ||
                                    "add";
                                  return (
                                    <span
                                      key={item.key}
                                      className={
                                        op === "add"
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {" "}
                                      {op === "add" ? "+" : "-"} {item.label}
                                    </span>
                                  );
                                })}
                              </p>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Payment Period Section - อยู่ด้านล่างของ Payment Codes */}
                    <h2 className="title">
                      ตั้งค่ารอบการจ่ายเงินในการออกสลิปเงินเดือนในแต่ละเดือน
                    </h2>
                    <div className="form-group d-flex align-items-center justify-content-center">
                      <div className="col-md-12">
                        <section className="Frame d-flex row justify-content-center align-items-center">
                          <div className="row">
                            {/* แถวที่ 1 */}
                            <div className="col-md-6 mb-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มกราคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jan}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jan",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กุมภาพันธ์
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.feb}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "feb",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 2 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มีนาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.mar}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "mar",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  เมษายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.apr}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "apr",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 3 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  พฤษภาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.may}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "may",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มิถุนายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jun}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jun",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 4 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กรกฎาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jul}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jul",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  สิงหาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.aug}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "aug",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 5 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กันยายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.sep}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "sep",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  ตุลาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.oct}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "oct",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 6 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  พฤศจิกายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.nov}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "nov",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  ธันวาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.dec}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "dec",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* ปุ่มตั้งค่าวันที่เหมือนกันทั้งหมด */}
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <div className="d-flex align-items-center justify-content-center">
                                <label className="col-form-label me-3">
                                  ตั้งค่าวันที่เดียวกันทั้งหมด:
                                </label>
                                <input
                                  className="form-control me-3"
                                  type="date"
                                  id="allMonthsDate"
                                  style={{ maxWidth: "200px" }}
                                />
                                <button
                                  type="button"
                                  className="btn b_save"
                                  onClick={() => {
                                    const selectedDate =
                                      document.getElementById(
                                        "allMonthsDate"
                                      ).value;
                                    if (selectedDate) {
                                      const dateObj = new Date(selectedDate);
                                      const day = dateObj
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0");
                                      const year = dateObj.getFullYear();

                                      setPaymentPeriod({
                                        jan: `${year}-01-${day}`,
                                        feb: `${year}-02-${day}`,
                                        mar: `${year}-03-${day}`,
                                        apr: `${year}-04-${day}`,
                                        may: `${year}-05-${day}`,
                                        jun: `${year}-06-${day}`,
                                        jul: `${year}-07-${day}`,
                                        aug: `${year}-08-${day}`,
                                        sep: `${year}-09-${day}`,
                                        oct: `${year}-10-${day}`,
                                        nov: `${year}-11-${day}`,
                                        dec: `${year}-12-${day}`,
                                      });

                                      alert(
                                        `ตั้งค่าวันที่ ${day} สำหรับทุกเดือนเรียบร้อยแล้ว`
                                      );
                                    } else {
                                      alert("กรุณาเลือกวันที่ก่อน");
                                    }
                                  }}
                                >
                                  ใช้วันที่นี้ทั้งหมด
                                </button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Hospital Section */}
                    {/* <h2 className="title">
                      รหัสสถานรักษาพยาบาลที่รองรับพนักงาน
                    </h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              รายชื่อสถานรักษาพยาบาล
                            </label>
                            <div className="col-md-9">
                              <div className="row">
                                <div className="col-md-6">
                                  <select
                                    value={selectedLocalHospital || ""}
                                    onChange={
                                      handleSelectionLocalHospotalChange
                                    }
                                    className="form-control"
                                  >
                                    <option value="" disabled>
                                      เลือกจังหวัด
                                    </option>
                                    {localHospitalList.map((hospital) => (
                                      <option
                                        key={hospital.value}
                                        value={hospital.value}
                                      >
                                        {hospital.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="col-md-6">
                                  <select
                                    value={tmpHospital || ""}
                                    onChange={handleSelectionHospotalChange}
                                    className="form-control"
                                  >
                                    <option value="" disabled>
                                      เลือกสถานรักษาพยาบาล
                                    </option>
                                    {tmpLocalHospitalList.map(
                                      (hospital, index) => (
                                        <option key={index} value={hospital}>
                                          {hospital}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-md-3 col-form-label"></label>
                            <div className="col-md-9">
                              <div className="row">
                                {tmpLocalHospitalList.map((item, index) => (
                                  <div key={index} className="col-md-12 mb-2">
                                    <div className="d-flex align-items-center border rounded p-2">
                                      <div className="flex-grow-1">
                                        <p className="mb-0">{item}</p>
                                      </div>
                                      <button
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() =>
                                          handleDeleteHospital(index)
                                        }
                                      >
                                        ลบ
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-8">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรอกชื่อโรงพยาบาลใหม่"
                                    value={newHospital}
                                    onChange={(e) =>
                                      setNewHospital(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleAddHospital}
                                  >
                                    เพิ่มโรงพยาบาล
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div> */}

                    {/* Salary Standard Section */}
                    {/* <h2 className="title">อัตราค่าจ้าง</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ค่าจ้างขั้นต่ำ
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="ค่าจ้างขั้นต่ำ"
                                value={salaryStandard}
                                onChange={(e) =>
                                  setSalaryStandard(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div> */}

                    {/* Leave Section */}
                    {/* <h2 className="title">วันลา</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลาป่วย
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันลาป่วย"
                                value={sickLeave}
                                onChange={(e) => setSickLeave(e.target.value)}
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลากิจ
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันลากิจ"
                                value={personalLeave}
                                onChange={(e) =>
                                  setPersonalLeave(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลาพักร้อน
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันพักร้อน"
                                value={vacationLeave}
                                onChange={(e) =>
                                  setVacationLeave(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                        </section>
                      </div>
                    </div> */}

                    <div className="line_btn">
                      <button type="submit" className="btn b_save">
                        <i className="nav-icon fas fa-save"></i> &nbsp;บันทึก
                      </button>
                      <button
                        type="button"
                        className="btn clean"
                        onClick={() => window.location.reload()}
                      >
                        <i className="far fa-window-close"></i> &nbsp;ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BasicSetting;
