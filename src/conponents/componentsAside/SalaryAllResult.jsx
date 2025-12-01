import endpoint from "../../config";
import '../../fonts/THSarabunNew-normal'
import '../../fonts/THSarabunNew Bold-normal'

import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo} from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data
import th from "date-fns/locale/th"; // Import Thai locale data from date-fns
import en from "date-fns/locale/en-US";
import { addYears, set } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function SalaryAllResult({ employeeList, workplaceList }) {
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน
  const [sumCashWork, setSumCashWork] = useState(0);
  const [paymentCodes, setPaymentCodes] = useState({}); // เพิ่ม state สำหรับเก็บรหัสการจ่ายเงิน

  const [workplaces, setWorkplaces] = useState([]);
  const [searchWorkplaceId, setSearchWorkplaceId] = useState("");
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  console.log('workplaceListAll', workplaceListAll);
  const [responseDataAll, setResponseDataAll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [displayEmployees, setDisplayEmployees] = useState([]); // State สำหรับเก็บข้อมูลที่จะแสดงในตาราง
  const [leaveSalary, setLeaveSalary] = useState([]);
  const [workplacrId, setWorkplacrId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [month, setMonth] = useState("01");
  // const [year, setYear] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString()); // Set the year initially to the current year
  const [workDate, setWorkDate] = useState(new Date());
  const formattedWorkDate = moment(workDate).format("DD/MM/YYYY");
  // const handleWorkDateChange = (date) => {
  //     setWorkDate(date);
  // };
  const [present, setPresent] = useState("DATAOWAT");
  const [presentfilm, setPresentfilm] = useState(
    "\\10.10.110.20payrolldataReportUserPRUSR101.RPT"
  );

  // ฟังก์ชันสำหรับดึงรหัสการจ่ายเงินจากฐานข้อมูล
  const fetchPaymentCodes = useCallback(async () => {
    try {
      const response = await axios.get(endpoint + "/basicsetting");
      if (response.status === 200) {
        const allData = response.data;
        let data = null;

        if (Array.isArray(allData) && allData.length > 0) {
          data = allData[allData.length - 1];
        }

        // ดึงข้อมูลรหัสการจ่ายเงิน
        if (data?.paymentCodes?.[0]) {
          setPaymentCodes(data.paymentCodes[0]);
        }
      }
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลรหัสการจ่ายเงินได้:', err);
      // ใช้ค่าเริ่มต้นถ้าไม่สามารถดึงข้อมูลได้
      setPaymentCodes({
        transportAllowanceIds: ["1535","1536"],
        wageReviseIdsPlus: [1531,1525,1526],
        wageReviseIdsMinus: [2111,2120,2430],
        leaveInLieuIdsPlus: [1231,1233,1242,1423,1428,1435,1429,1427,1234],
        leaveInLieuIdsMinus: [2160],
        overtimeIdsPlus: ["1441", "1446", "1444", "1528", "1442", "1159"],
        positionAndTransportationWithSocialIdsPlus: ["1230", "1520"],
        positionAndTransportationWithSocialIdsMinus: ["2124","0000"],
        diligenceAllowanceIds: ["1410"],
        publicHolidayCashIds: ["1533"],
        plusOtherIds: ["1241", "1251", "1330", "1440", "1447", "1560", "1210", "1540", "1541", "1542", "1550", "1561", "1610", "1611", "1612", "1613", "1245"],
        otherDeductIds: ["2116", "2117", "2331", "2312"],
        advancePaymentIds: ["2330"],
        additionalAfterTaxIds: ["2250", "2310", "2340"],
        deductionAfterTaxIds: ["2230", "2333", "2261", "2311"]
      });
    }
  }, []);

  moment.locale("th");

  // const formattedWorkDateDD = moment(workDate).format('DD');
  // const formattedWorkDateMM = moment(workDate).format('MM');
  // const formattedWorkDateYYYY = moment(workDate).format('YYYY');
  const formattedDate = workDate.toLocaleString("en-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Bangkok", // Thailand timezone
  });

  

useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://10.10.110.7:3000/timerecord/searchtimerecordmonthyear');
        
        let allEmployeeRecords = [];
        if (response.data && response.data.result && Array.isArray(response.data.result)) {
          response.data.result.forEach(item => {
            if (item.employee_record && Array.isArray(item.employee_record)) {
              allEmployeeRecords = [...allEmployeeRecords, ...item.employee_record];
            }
          });
          
          // ใช้ Set แทนการใช้ filter เพื่อเพิ่มประสิทธิภาพ
          const workplaceIds = new Set();
          const uniqueWorkplaces = [];
          
          allEmployeeRecords.forEach(record => {
            if (record.workplaceId && !workplaceIds.has(record.workplaceId)) {
              workplaceIds.add(record.workplaceId);
              uniqueWorkplaces.push({
                workplaceId: record.workplaceId,
                workplaceName: record.workplaceName
              });
            }
          });
          
          setWorkplaces(uniqueWorkplaces);
          setWorkplaceListAll(uniqueWorkplaces);
        }
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลหน่วยงานได้');
        setLoading(false);
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
      }
    };

    fetchWorkplaces();
    fetchPaymentCodes(); // เพิ่มการดึงรหัสการจ่ายเงิน

    // ตั้งค่าเริ่มต้นของวันที่
    const today = new Date();
    const formattedToday = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 543}`;
    setFormattedDate321(formattedToday);
  }, [fetchPaymentCodes]);

  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  function formatThaiBuddhistYear(d) {
    const thaiYear = d.getFullYear() + 543; // Add 543 to convert to Thai Buddhist year
    return thaiYear;
  }

  function convertToThaiBuddhistDate(date) {
    const thaiYear = date.getFullYear() + 543;
    return new Date(thaiYear, date.getMonth(), date.getDate());
  }

  const thaiWorkDate = convertToThaiBuddhistDate(workDate);

  const GregorianToThaiBuddhist = (gregorianDate) => {
    const thaiYear = gregorianDate.getFullYear() + 543;
    return new Date(
      thaiYear,
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    );
  };

  const ThaiBuddhistToGregorian = (thaiDate) => {
    const gregorianYear = thaiDate.getFullYear() - 543;
    return new Date(gregorianYear, thaiDate.getMonth(), thaiDate.getDate());
  };

  // const GregorianToThaiBuddhist = (gregorianDate) => {
  //     // Convert Gregorian date to Thai Buddhist date
  //     const thaiYear = gregorianDate.getFullYear() + 543;
  //     return addYears(gregorianDate, 543);
  // };

  // const ThaiBuddhistToGregorian = (thaiDate) => {
  //     // Convert Thai Buddhist date to Gregorian date
  //     return addYears(thaiDate, -543);
  // };

  // const initialThaiDate = new Date();
  const initialThaiDate = GregorianToThaiBuddhist(new Date());

  initialThaiDate.setFullYear(initialThaiDate.getFullYear()); // Add 543 years to the current year

  const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
  const [selectedGregorianDate, setSelectedGregorianDate] = useState(
    new Date()
  );

  const handleThaiDateChange = (date) => {
    setSelectedThaiDate(date);
    setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
    // setWorkDate(date)
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
    const [formattedDate321, setFormattedDate321] = useState('');

 


  //   useEffect(() => {
  //     if (selectedDate) {
  //       // Convert the string to a Date object
  //       const date = new Date(selectedDate);

  //       // Extract day, month, and year
  //       const daySelectedDate = date.getDate().toString().padStart(2, '0');
  //       const monthSelectedDate = (date.getMonth() + 1).toString().padStart(2, '0');
  //       const yearSelectedDate = (date.getFullYear() + 543).toString();

  //       // Format the date
  //       const formattedDate = `${daySelectedDate}/${monthSelectedDate}/${yearSelectedDate}`;
  //       console.log('formattedDate', formattedDate);
  //       setFormattedDate(formattedDate);
  //     }
  //   }, [selectedDate]);
  


   const toggleDatePicker = useCallback(() => {
            setShowDatePicker(prev => !prev);
    }, []);
    const handleDatePickerChange = useCallback((date) => {
    setSelectedDate(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const thaiYear = date.getFullYear() + 543;
    setFormattedDate321(`${day}/${month}/${thaiYear}`);
    setShowDatePicker(false);
  }, []);

   const formatNumber = useCallback((num) => {
    if (num === undefined || num === null) return "0.00";
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // ฟังก์ชันสำหรับบวกตัวเลขที่ถูก format แล้ว
  const addFormattedNumbers = useCallback((formattedNum1, num2) => {
    const cleanNum1 = parseFloat(formattedNum1.replace(/,/g, ''));
    const cleanNum2 = parseFloat(num2 || 0);
    return formatNumber(cleanNum1 + cleanNum2);
  }, [formatNumber]);

  // แปลงชื่อเดือนภาษาไทย
  const getThaiMonth = useCallback((month) => {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 
      'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 
      'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return thaiMonths[parseInt(month) - 1] || '';
  }, []);

  const formattedWorkDateDD = moment(workDate).format("DD");
  const formattedWorkDateMM = moment(workDate).format("MM");
  const formattedWorkDateYYYY = moment(workDate).format("YYYY");

  console.log({
  formattedWorkDateDD,
  formattedWorkDateMM,
  formattedWorkDateYYYY,
  present,
  presentfilm
});

const fetchEmployeeData = useCallback(async () => {
  if (!month || !year) {
    alert('กรุณาเลือกเดือนและปี');
    return null;
  }

  try {
    setLoadingEmployees(true);
    setPdfReady(false);
    
    const requestData = {
      month: month,
      year: year
    };

    // เพิ่ม workplaceId เข้าไปในคำขอเฉพาะเมื่อมีการระบุ
    if (workplacrId) {
      requestData.workplaceId = workplacrId;
    }
    
    // เปลี่ยนมาใช้ API เส้นใหม่
    const response = await axios.post(
      'http://10.10.110.7:3000/timerecord/searchtimerecordmonthyear', 
      requestData
    );
    
    let filteredEmployees = [];
    
    if (response.data && response.data.result) {
      console.log("Response data:", response.data);
      
      // ข้อมูลจาก API ใหม่จะอยู่ในรูปแบบ result array
      const resultData = response.data.result;
      
      // กรองข้อมูลตามเงื่อนไข
      let filteredRecords = resultData;
      
      // ถ้ามีการระบุรหัสหน่วยงาน ให้กรองตามรหัสนั้น
      if (workplacrId) {
        filteredRecords = resultData.filter(record => {
          // ดึง workplaceId จาก employee_record แรก
          const firstEmployeeRecord = record.employee_record && record.employee_record[0];
          if (!firstEmployeeRecord) return false;
          
          const recordId = String(firstEmployeeRecord.workplaceId || '').trim();
          const inputId = String(workplacrId || '').trim();
          
          return recordId.includes(inputId) || inputId.includes(recordId);
        });
      }
      
     
filteredEmployees = filteredRecords.map(record => {
  // ดึง addSalaryList และ deductSalaryList จากข้อมูลพนักงาน
  const addSalaryList = record.addSalaryList || [];
  const deductSalaryList = record.deductSalaryList || [];
  
  // คำนวณค่าต่างๆ จาก addSalaryList
  let transportAllowance = 0;
  let diligenceAllowance = 0;
  
  const transportAllowanceIds = paymentCodes.transportAllowanceIds || ["1535","1536"];
 
  addSalaryList.forEach(item => {
    if (transportAllowanceIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        transportAllowance += spSalary ; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        transportAllowance += spSalary;
      }
    }
  });

  let wageRevisePlus = 0;
  const wageReviseIdsPlus = paymentCodes.wageReviseIdsPlus || [1531,1525,1526]
  addSalaryList.forEach(item => {
    if (wageReviseIdsPlus.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        wageRevisePlus += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        wageRevisePlus += spSalary;
      }
    }
  });


  let wageReviseMinus = 0;
  const wageReviseIdsMinus = paymentCodes.wageReviseIdsMinus || [2111,2120,2430]
  deductSalaryList.forEach(item => {
    if (wageReviseIdsMinus.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        wageReviseMinus += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        wageReviseMinus += spSalary;
      }
    }
  });

  let wageRevise = wageRevisePlus - wageReviseMinus;


  let leaveInLieuPlus = 0;
  const leaveInLieuIdsPlus = paymentCodes.leaveInLieuIdsPlus || [1231,1233,1242,1423,1428,1435,1429,1427,1234]
  addSalaryList.forEach(item => {
    if (leaveInLieuIdsPlus.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        leaveInLieuPlus += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        leaveInLieuPlus += spSalary;
      }
    }
  });

  let leaveInLieuMinus = 0;
  const leaveInLieuIdsMinus = paymentCodes.leaveInLieuIdsMinus || [2160];
  deductSalaryList.forEach(item => {
    if (leaveInLieuIdsMinus.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        leaveInLieuMinus += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        leaveInLieuMinus += spSalary;
      }
    }
  });

  let leaveInLieu = leaveInLieuPlus - leaveInLieuMinus;


  let transportWithSocial = 0
  addSalaryList.forEach(item => {
    if (item.id === "1520") {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);  
      if (item.roundOfSalary === "daily") {
        transportWithSocial += spSalary * days; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        transportWithSocial += spSalary;
      }
    }
  });

  let tax = 0;
  





  let otherDeduct = 0;
const deductIds = paymentCodes.otherDeductIds || [
  "2116", // หักคืนอื่นๆ (คำนวณ ปกส)
  "2117", // หักคืนอื่นๆ (ไม่คำนวณ ปกส)
  "2331", //หักคืนทำงานวันหยุด
  "2312", // หักผิดกฎระเบียบ

];

deductSalaryList.forEach(item => {
  if (deductIds.includes(item.id)) {
    const amount = parseFloat(item.amount || 0);
     
    // สำหรับ deductSalaryList ไม่มี roundOfSalary ให้ใช้ amount โดยตรง
    otherDeduct += amount;
    
    console.log(`Deduct - ID: ${item.id}, Name: ${item.name || 'N/A'}, Amount: ${amount}, Calculated: ${amount}`);
  }
});
console.log(`Final Deduct for employee ${record.employeeId}: ${otherDeduct}`);

let payinAdvance = 0;
const advancePaymentIds = paymentCodes.advancePaymentIds || ["2330"];
deductSalaryList.forEach(item => {
      console.log('deductSalaryList item:', item); // ดูว่ามีข้อมูลอะไรบ้าง

    if (advancePaymentIds.includes(item.id)){ 
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        payinAdvance += spSalary * days; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        payinAdvance += spSalary;
      }
    }
  });
  console.log('Final payInAdvance:', payinAdvance);



  let plusOther = 0;
const targetIds = paymentCodes.plusOtherIds || [
  "1241", // ค่าวิชาชีพ
  "1251", // ค่าโรยตัว/ค่าขับรถ
  "1330", // ค่าอาหาร
  "1440", // โบนัส
  "1447", // โบนัสรับล่วงหน้า
  "1560", // เงินเพิ่มพิเศษ
  "1210", // ค่ากะ
  "1540", // ค่าคอมมิชชั่น
  "1541", // ค่าสรรหา
  "1542", // ค่าสรรหา(รับล่วงหน้า)
  "1550", // เงินได้อื่นๆ
  "1561", // เงินเพิ่มพิเศษ(รับล่วงหน้า)
  "1610", // ปรับปรุงคืนอื่น ๆ (ไม่คิดปกส)
  "1611", // เงินได้อื่น (ไม่หัก ปกส)
  "1612", // ปรับปรุงคืนค่าเครื่องแบบจ่ายเกิน
  "1613", // ปรับปรุงคืนค่าเครื่องแบบจ่ายเกิน/อื่นๆ(รับล่วงหน้า)
  "1245"  // ค่าวิชาชีพ(รับล่วงหน้า)
];


addSalaryList.forEach(item => {
  if (targetIds.includes(item.id)) {
    const spSalary = parseFloat(item.SpSalary || 0);
    const days = parseFloat(record.dayWorkCount || 0);
    
    let calculatedAmount = 0;
    if (item.roundOfSalary === "daily") {
      calculatedAmount = spSalary * days;
      plusOther += calculatedAmount;
    } else if (item.roundOfSalary === "monthly") {
      calculatedAmount = spSalary;
      plusOther += calculatedAmount;
    }
    
    console.log(`plusOther - ID: ${item.id}, Name: ${item.SpName || 'N/A'}, SpSalary: ${spSalary}, Days: ${days}, RoundOfSalary: ${item.roundOfSalary}, Calculated: ${calculatedAmount}`);
  }
});

console.log(`Final plusOther for employee ${record.employeeId}: ${plusOther}`);

  let positionAndTransportationWithSocialPlus = 0;
  const positionAndTransportationIds = paymentCodes.positionAndTransportationWithSocialIdsPlus || ["1230", "1520"];

  addSalaryList.forEach(item => {
      console.log('addSalaryList item:', item); // ดูว่ามีข้อมูลอะไรบ้าง

    if (positionAndTransportationIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        positionAndTransportationWithSocialPlus += spSalary * days; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        positionAndTransportationWithSocialPlus += spSalary;
      }
    }
  });
  console.log('Final positionAndTransportationWithSocialPlus:', positionAndTransportationWithSocialPlus);

  let positionAndTransportationWithSocialMinus = 0;
  const positionAndTransportationMinusIds = paymentCodes.positionAndTransportationWithSocialIdsMinus || ["2124","0000"]
  deductSalaryList.forEach(item => {
    if (positionAndTransportationMinusIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);  

      if (item.roundOfSalary === "daily") {
        positionAndTransportationWithSocialMinus += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        positionAndTransportationWithSocialMinus += spSalary;
      }
    }
  });
  console.log('Final positionAndTransportationWithSocialMinus:', positionAndTransportationWithSocialMinus);

  let positionAndTransportationWithSocial = positionAndTransportationWithSocialPlus - positionAndTransportationWithSocialMinus;

  // คำนวณเบี้ยขยัน (ID 1410) - ไม่เปลี่ยนแปลง
  const diligenceAllowanceIds = paymentCodes.diligenceAllowanceIds || ["1410"];
  addSalaryList.forEach(item => {
    if (diligenceAllowanceIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);
      
      if (item.roundOfSalary === "daily") {
        diligenceAllowance += spSalary * days;
      } else if (item.roundOfSalary === "monthly") {
        diligenceAllowance += spSalary;
      }
    }
  });

  let otplusOther = 0;
  const otTargetIds = paymentCodes.overtimeIdsPlus || [
    "1441", // ค่าจ้างล่วงเวลา
    "1446", // ค่าจ้าง
    "1444", // ปรับปรุงค่าจ้างเพิ่ม
    "1528", // ค่าจ้างค่ากะ
    "1442", // ค่าจ้างวันลาป่วย
    "1159" ]; // ค่าจ้างค่าตำแหน่ง
  addSalaryList.forEach(item => {
    if (otTargetIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);  
      if (item.roundOfSalary === "daily") {
        otplusOther += spSalary * days; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        otplusOther += spSalary;
      }
    }
  });

  let otherPublicHoliday = 0;
  const publicHolidayIds = paymentCodes.publicHolidayCashIds || ["1533"]
  addSalaryList.forEach(item => {
    if (publicHolidayIds.includes(item.id)) {
      const spSalary = parseFloat(item.SpSalary || 0);
      const days = parseFloat(record.dayWorkCount || 0);  
      if (item.roundOfSalary === "daily") {
        otherPublicHoliday += spSalary * days; // คูณด้วยจำนวนวันที่ทำงาน
      } else if (item.roundOfSalary === "monthly") {
        otherPublicHoliday += spSalary;
      }
    }
  });

  let additionalAfterTax = 0;
  
  
  const additionalAfterTaxIds = paymentCodes.additionalAfterTaxIds || [
    "2250",
    "2310",
    "2340"];
 deductSalaryList.forEach(item => {
  if (additionalAfterTaxIds.includes(item.id)) {
    const amount = parseFloat(item.amount || 0);
    
    // สำหรับ deductSalaryList ไม่มี roundOfSalary ให้ใช้ amount โดยตรง
    additionalAfterTax += amount;
    
    console.log(`Deduct - ID: ${item.id}, Name: ${item.name || 'N/A'}, Amount: ${amount}, Calculated: ${amount}`);
  }
});

  // let deductionAfterTax = 0; // ลบบรรทัดนี้ออกเพราะ declare ไว้ข้างบนแล้ว
  let deductionAfterTax = 0; // ย้าย declaration มาไว้ข้างบน
  const deductionAfterTaxIds = paymentCodes.deductionAfterTaxIds || [
    "2230",
    "2333",
    "2261",
    "2311"];
 deductSalaryList.forEach(item => {
  if (deductionAfterTaxIds.includes(item.id)) {
    const amount = parseFloat(item.amount || 0);
    
    // สำหรับ deductSalaryList ไม่มี roundOfSalary ให้ใช้ amount โดยตรง
    deductionAfterTax += amount;
    
    console.log(`Deduct - ID: ${item.id}, Name: ${item.name || 'N/A'}, Amount: ${amount}, Calculated: ${amount}`);
  }
});

  // ดึงข้อมูล workplaceId และ workplaceName จาก employee_record แรก
  const firstEmployeeRecord = record.employee_record && record.employee_record[0];
  const workplaceId = firstEmployeeRecord ? firstEmployeeRecord.workplaceId : '';
  const workplaceName = firstEmployeeRecord ? firstEmployeeRecord.workplaceName : '';
  
  return {
    employeeId: record.employeeId || '',
    prefix: record.prefix || '',
    firstName: (record.employeeName || '').split(' ')[0] || '',
    lastName: (record.employeeName || '').split(' ').slice(1).join(' ') || '',
    workplaceId: workplaceId,
    workplaceName: workplaceName,
    typeOfemployee: record.typeOfemployee || '', // เพิ่มฟิลด์ typeOfemployee
    dayWorkCount: record.dayWorkCount || '0',
    sumCashWork: formatNumber(record.sumCashWork || 0),
    wageRevise: formatNumber(wageRevise), // ใช้ค่าที่คำนวณจาก wageRevise
    leaveInLieu: formatNumber(leaveInLieu), // ใช้ค่าที่คำนวณจาก leaveInLieu
    sumCashOt: addFormattedNumbers(formatNumber(record.sumCashOt || 0), otplusOther), // ใช้ค่าที่คำนวณจาก sumCashOt และ otplusOther
    transportAllowance: formatNumber(transportAllowance), // ใช้ค่าที่คำนวณจาก ID "1230"

    positionAndTransportationWithSocial: formatNumber(positionAndTransportationWithSocial),
    diligenceAllowance: formatNumber(diligenceAllowance),
    publicHolidayCash: addFormattedNumbers(formatNumber(record.publicHolidayCash || 0), otherPublicHoliday),
    additionalBeforeTax: formatNumber(plusOther || 0), // ใช้ plusOther แทน 0
    deductionBeforeTax: formatNumber(otherDeduct || 0), // ใช้ otherDeduct แทน 0
    tax: formatNumber(record.tax || 0),
    socialSecurity: formatNumber(record.socialSecurity || 0),
    additionalAfterTax: formatNumber(additionalAfterTax),
    deductionAfterTax: formatNumber(deductionAfterTax),
    advancePayment: formatNumber(payinAdvance || 0), // ใช้ payinAdvance แทน 0
    total: formatNumber(
      (record.sumCashWork || 0) + 
      wageRevise + leaveInLieu +
      (record.sumCashOt) + 
      transportAllowance + 
      
      
      diligenceAllowance + 
      positionAndTransportationWithSocial +
      (record.publicHolidayCash || 0) + 
      plusOther + otherDeduct + // เพิ่ม plusOther ในการคำนวณ total
      (record.tax || 0) - 
      (record.payinAdvance || 0) -
      (record.socialSecurity || 0)
    )-deductionAfterTax
  };
});
      
      console.log("จำนวนพนักงานที่พบ:", filteredEmployees.length);
    }
    
    setEmployees(filteredEmployees);
    setDisplayEmployees(filteredEmployees);
    setLoadingEmployees(false);
    setPdfReady(true);
    
    return filteredEmployees;
    
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน:', err);
    setLoadingEmployees(false);
    setEmployees([]);
    return null;
  }
}, [workplacrId, month, year, formatNumber]);
const fetchAllWorkplaceData = useCallback(async () => {
  if (!month || !year) {
    alert('กรุณาเลือกเดือนและปี');
    return null;
  }
  
  try {
    setLoadingEmployees(true);
    
    const requestData = {
      month: month,
      year: year
    };
    
    // เปลี่ยนมาใช้ API เส้นใหม่
    const response = await axios.post(
      'http://10.10.110.7:3000/timerecord/searchtimerecordmonthyear', 
      requestData
    );
    
    if (!response.data || !response.data.result) {
      alert('ไม่พบข้อมูล');
      setLoadingEmployees(false);
      return null;
    }
    
    const resultData = response.data.result;
    console.log("Result data:", resultData);
    
    // จัดกลุ่มข้อมูลตาม workplaceId
    const groupedByWorkplace = {};
    
    resultData.forEach(record => {
      // ดึง workplaceId จาก employee_record แรก
      const firstEmployeeRecord = record.employee_record && record.employee_record[0];
      if (!firstEmployeeRecord) return;
      
      const workplaceId = firstEmployeeRecord.workplaceId;
      const workplaceName = firstEmployeeRecord.workplaceName;
      
      if (!groupedByWorkplace[workplaceId]) {
        groupedByWorkplace[workplaceId] = {
          workplaceId: workplaceId,
          workplaceName: workplaceName,
          employees: [],
          totalSalary: 0,
          totalAmountOt: 0,
          totalAddSalary: 0,
          totalBenefitNonSocial: 0,
          totalAmountHardWorking: 0,
          totalAmountSpecialDay: 0,
          totalSumAddSalaryBeforeTax: 0,
          totalSumDeductBeforeTaxWithSocial: 0,
          totalSumAddSalaryBeforeTaxNonSocial: 0,
          totalSumDeductBeforeTax: 0,
          totalTax: 0,
          totalSocialSecurity: 0,
          totalSumAddSalaryAfterTax: 0,
          totalAdvancePayment: 0,
          totalSumDeductAfterTax: 0,
          totalTotal: 0,
          totalEmp: 0
        };
      }
      
      // ดึง addSalaryList จากข้อมูลพนักงาน
      const addSalaryList = record.addSalaryList || [];
      
      // คำนวณค่าต่างๆ จาก addSalaryList
      let transportAllowance = 0;
     
      
      // คำนวณค่าตำแหน่ง (ID 1230) สำหรับ transportAllowance
      addSalaryList.forEach(item => {
        if (item.id === "1245") {
          const spSalary = parseFloat(item.SpSalary || 0);
          const days = parseFloat(record.dayWorkCount || 0);
          
          if (item.roundOfSalary === "daily") {
            transportAllowance += spSalary * days;
          } else if (item.roundOfSalary === "monthly") {
            transportAllowance += spSalary;
          }
        }
      });


       let diligenceAllowance = 0;
       const diligenceAllowanceIds = ["1410","1412"];
      // คำนวณเบี้ยขยัน (ID 1410)
      addSalaryList.forEach(item => {
        if (diligenceAllowanceIds.includes(item.id)) {
          const spSalary = parseFloat(item.SpSalary || 0);
          const days = parseFloat(record.dayWorkCount || 0);
          
          if (item.roundOfSalary === "daily") {
            diligenceAllowance += spSalary * days;
          } else if (item.roundOfSalary === "monthly") {
            diligenceAllowance += spSalary;
          }
        }
      });
      
      // เพิ่มพนักงานเข้าไปในกลุ่ม
      groupedByWorkplace[workplaceId].employees.push({
        ...record,
        firstName: (record.employeeName || '').split(' ')[0] || '',
        lastName: (record.employeeName || '').split(' ').slice(1).join(' ') || '',
        typeOfemployee: record.typeOfemployee || '' // เพิ่มฟิลด์ typeOfemployee
      });
      
      // คำนวณยอดรวมของหน่วยงาน
      groupedByWorkplace[workplaceId].totalSalary += parseFloat(record.sumCashWork || 0);
      groupedByWorkplace[workplaceId].totalAddWageRevise += wageRevise|| 0; // ใช้ wageRevisePlus แทน 0
      groupedByWorkplace[workplaceId].totalLeaveInLieu += leaveInLieu || 0; // ใช้ leaveInLieu แทน 0
      groupedByWorkplace[workplaceId].totalAmountOt += parseFloat(record.sumCashOt || 0);
      groupedByWorkplace[workplaceId].totalAddSalary += transportAllowance;
      groupedByWorkplace[workplaceId].totalBenefitNonSocial += parseFloat(record.welfare || 0);
      groupedByWorkplace[workplaceId].totalAmountHardWorking += diligenceAllowance;
      groupedByWorkplace[workplaceId].totalAmountSpecialDay += parseFloat(record.publicHolidayCash || 0);
      groupedByWorkplace[workplaceId].totalSumAddSalaryBeforeTax += plusOther || 0.00; // ใช้ plusOther แทน 0
      groupedByWorkplace[workplaceId].totalSumDeductBeforeTaxWithSocial += otherDeduct || 0.00;
      groupedByWorkplace[workplaceId].totalTax += parseFloat(record.tax || 0);
      groupedByWorkplace[workplaceId].totalSocialSecurity += parseFloat(record.socialSecurity || 0);
      groupedByWorkplace[workplaceId].totalSumAddSalaryAfterTax += parseFloat(record.additionalAfterTax || 0);
       groupedByWorkplace[workplaceId].totalSumDeductAfterTax += parseFloat(record.deductionAfterTax || 0);
      groupedByWorkplace[workplaceId].totalAdvancePayment += payinAdvance || 0;
     
      
      // คำนวณยอดสุทธิ
      const netTotal = 
        (parseFloat(record.sumCashWork || 0)) + 
        wageRevise + leaveInLieu +
        (parseFloat(record.sumCashOt || 0)) + 
        transportAllowance + 
        
        positionAndTransportationWithSocial +
        plusOther +
        otherDeduct 
        diligenceAllowance + 
        (parseFloat(record.publicHolidayCash || 0)) - 
        (parseFloat(record.tax || 0)) - 
        (parseFloat(record.payinAdvance || 0)) -
        (parseFloat(record.socialSecurity || 0));
        - deductionAfterTax;
        
      groupedByWorkplace[workplaceId].totalTotal += netTotal;
      groupedByWorkplace[workplaceId].totalEmp += 1;
    });
    
    setLoadingEmployees(false);
    
    // ส่งคืนข้อมูลที่จัดกลุ่มแล้ว
    const sortedWorkplaceIds = Object.keys(groupedByWorkplace).sort();
    return {
      groups: sortedWorkplaceIds,
      data: groupedByWorkplace
    };
    
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงานทุกหน่วยงาน:', err);
    setLoadingEmployees(false);
    return null;
  }
}, [month, year, formatNumber]);



  // const fetchData = () => {

  //     // const dataTest = {
  //     //   year: "2024",
  //     //   month: "03",
  //     // };

  //     const dataTest = {
  //         year: year,
  //         month: month,
  //     };

  //     axios.post(endpoint + '/accounting/calsalarylist', dataTest)
  //         .then(response => {
  //             const responseData = response.data;

  //             console.log('responseData', responseData);
  //             setResponseDataAll(responseData);

  //             // Now you can use the data as needed
  //             // For example, you can iterate over the array of data
  //             // responseData.forEach(item => {
  //             //   console.log(item);
  //             //   // Your logic with each item
  //             // });
  //         })
  //         .catch(error => {
  //             console.error('Error:', error);
  //         });
  // };

  // useEffect(() => {
  //     const fetchData = () => {
  //         const dataTest = {
  //             year: year,
  //             month: month,
  //         };

  //         axios.post(endpoint + '/accounting/calsalarylist', dataTest)
  //             .then(response => {
  //                 const responseData = response.data;

  //                 console.log('searchWorkplaceId', searchWorkplaceId);

  //                 console.log('responseData', responseData);
  //                 const filteredData = searchWorkplaceId ? responseData.filter(item => item.workplace === searchWorkplaceId) : responseData;

  //                 setResponseDataAll(filteredData);

  //             })
  //             .catch(error => {
  //                 console.error('Error:', error);
  //             });
  //     };

  //     // Call fetchData when year or month changes
  //     fetchData();
  // }, [year, month, searchWorkplaceId]);

  // useEffect(() => {
  //   const fetchData = () => {
  //     const dataTest = {
  //       year: year,
  //       month: month,
  //     };

  //     axios
  //       .post(endpoint + "/accounting/calsalarylist", dataTest)
  //       .then((response) => {
  //         const responseData = response.data;

  //         console.log("searchWorkplaceId", searchWorkplaceId);
  //         console.log("responseData", responseData);

  //         // Filter the data by workplace and also ensure name and lastName exist
  //         const filteredData = responseData
  //           .filter((item) =>
  //             searchWorkplaceId ? item.workplace === searchWorkplaceId : true
  //           )
  //           .filter((item) => item.name && item.lastName); // Only include items with both name and lastName

  //         // const updatedData = filteredData.map((item) => {
  //         //   const matchingEmployee = employeeList.find(
  //         //     (emp) => emp.employeeId === item.employeeId
  //         //   );

  //         //   if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
  //         //     // Modify the workplace by changing the first digit to '2'
  //         //     item.workplace = "2" + item.workplace.slice(1);
  //         //   }

  //         //   return item;
  //         // });
  //         setResponseDataAll(filteredData);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   };

  //   fetchData();
  // }, [year, month, searchWorkplaceId]);

  // console.log("responseDataAll", responseDataAll);



  // Create a new array with updated responseDataAll values
  const responseDataAllLeaveSalary = responseDataAll.map((employee) => {
    // Find matching leaveSalary for the employee
    const matchingLeave = leaveSalary.find(
      (leave) => leave.employeeId === employee.employeeId
    );

    // Sum SpSalary from leaveSalary.record if it exists
    const totalSpSalary = matchingLeave?.record?.reduce((sum, record) => {
      return sum + (parseFloat(record.SpSalary) || 0);
    }, 0) || 0;

    // Add the summed SpSalary to addAmountAfterTax
    return {
      ...employee,
      accountingRecord: {
        ...employee.accountingRecord,
        addAmountAfterTax:
          (employee.accountingRecord?.addAmountAfterTax || 0) + totalSpSalary,
      },
    };
  });

  // Set the updated array into the state

  console.log('responseDataAllLeaveSalary', responseDataAllLeaveSalary);

  // addAmountAfterTax

  // useEffect(() => {
  //   const workplaces = ['10796', '20796', '30796', '40796'];
  //   const employeesssss = [];
  //   const workplacestest = ['10796', '10798', '10596'];

  //   // Create 40 employees for workplace '10796'
  //   for (let i = 0; i < 120; i++) {
  //     const workplaceIndex = i % workplacestest.length; // Get the index based on the current iteration
  //     const employee = {
  //       employeeId: `6704${17 + i}`,
  //       name: `EmployeeName${i + 1}`,
  //       lastName: `LastName${i + 1}`,
  //       // workplace: '10796',
  //       workplace: workplacestest[workplaceIndex], // Assign workplace based on the index
  //       countDay: '31',
  //       countDayWork: '25',
  //       amountDay: '12000',
  //       amountOt: '5520',
  //       countHour: '200',
  //       countSpecialDay: '1',
  //       createDate: '03/09/2024, 07:31',
  //       specialDayRate: '480',
  //       year: '2024',
  //       month: '06',
  //       accountingRecord: [
  //         {
  //           addAmountAfterTax: "0",
  //           addAmountBeforeTax: "4083",
  //           amountCountDayWork: "12000",
  //           amountCountDayWorkOt: "5520",
  //           amountDay: "12000",
  //           amountHardWorking: "500",
  //           amountHoliday: "0",
  //           amountOne: "12000",
  //           amountOneFive: "5520",
  //           amountOt: "5520",
  //           amountPosition: "2000",
  //           amountSpecialDay: "480",
  //           amountThree: "0",
  //           amountTwo: "0",
  //           amountTwoFive: "0",
  //           bank: "0",
  //           benefitNonSocial: "750",
  //           countDay: "31",
  //           countDayWork: "25",
  //           countHour: "200",
  //           countHourWork: "200",
  //           countOtHour: "55.19999999999998",
  //           countOtHourWork: "0",
  //           deductAfterTax: "100",
  //           deductBeforeTax: "0",
  //           hourOne: "200",
  //           hourOneFive: "55.19999999999998",
  //           hourThree: "0",
  //           hourTwo: "0",
  //           hourTwoFive: "0",
  //           socialSecurity: "750",
  //           sumAddSalary: "4833",
  //           sumAddSalaryAfterTax: "0",
  //           sumAddSalaryBeforeTax: "361",
  //           sumAddSalaryBeforeTaxNonSocial: "722",
  //           sumDeductAfterTax: "100",
  //           sumDeductBeforeTax: "0",
  //           sumDeductBeforeTaxWithSocial: "0",
  //           sumSalaryForTax: "21603",
  //           tax: "0",
  //           tel: "500",
  //           total: "22083",
  //           travel: "0"
  //         }
  //       ],
  //       specialDayListWork: [],
  //       addSalary: [],
  //     };

  //     employeesssss.push(employee);
  //   }

  //   // Create 10 employees for each of the remaining workplaces
  //   for (let i = 0; i < 30; i++) {
  //     const workplaceIndex = i % 3; // Get index for '20796', '30796', '40796'
  //     const employee = {
  //       employeeId: `6704${57 + i}`,
  //       name: `EmployeeName${i + 41}`, // Starting after the 40 employees for '10796'
  //       lastName: `LastName${i + 41}`,
  //       workplace: workplaces[workplaceIndex + 1], // Select from '20796', '30796', '40796'
  //       countDay: '31',
  //       countDayWork: '25',
  //       amountDay: '12000',
  //       amountOt: '5520',
  //       countHour: '200',
  //       countSpecialDay: '1',
  //       createDate: '03/09/2024, 07:31',
  //       specialDayRate: '480',
  //       year: '2024',
  //       month: '06',
  //       accountingRecord: [
  //         {
  //           addAmountAfterTax: "0",
  //           addAmountBeforeTax: "4083",
  //           amountCountDayWork: "12000",
  //           amountCountDayWorkOt: "5520",
  //           amountDay: "12000",
  //           amountHardWorking: "500",
  //           amountHoliday: "0",
  //           amountOne: "12000",
  //           amountOneFive: "5520",
  //           amountOt: "5520",
  //           amountPosition: "2000",
  //           amountSpecialDay: "480",
  //           amountThree: "0",
  //           amountTwo: "0",
  //           amountTwoFive: "0",
  //           bank: "0",
  //           benefitNonSocial: "750",
  //           countDay: "31",
  //           countDayWork: "25",
  //           countHour: "200",
  //           countHourWork: "200",
  //           countOtHour: "55.19999999999998",
  //           countOtHourWork: "0",
  //           deductAfterTax: "100",
  //           deductBeforeTax: "0",
  //           hourOne: "200",
  //           hourOneFive: "55.19999999999998",
  //           hourThree: "0",
  //           hourTwo: "0",
  //           hourTwoFive: "0",
  //           socialSecurity: "750",
  //           sumAddSalary: "4833",
  //           sumAddSalaryAfterTax: "0",
  //           sumAddSalaryBeforeTax: "361",
  //           sumAddSalaryBeforeTaxNonSocial: "722",
  //           sumDeductAfterTax: "100",
  //           sumDeductBeforeTax: "0",
  //           sumDeductBeforeTaxWithSocial: "0",
  //           sumSalaryForTax: "21603",
  //           tax: "0",
  //           tel: "500",
  //           total: "22083",
  //           travel: "0"
  //         }
  //       ],
  //       specialDayListWork: [],
  //       addSalary: [],
  //     };

  //     employeesssss.push(employee);
  //   }

  //   // Set the employee data to the state variable
  //   setResponseDataAll(employeesssss);
  // }, []); // Empty dependency array to run once on component mount


const generatePDF01 = async () => {
  try {
    // ตรวจสอบว่ามีการกรอกเดือนและปีครบถ้วนหรือไม่ (ไม่จำเป็นต้องมี workplacrId)
    if (!month || !year) {
      alert('กรุณากรอกเดือนและปี');
      return;
    }

    // แสดง loading indicator
    setLoadingEmployees(true);
    
    // ดึงข้อมูลพนักงานตามเงื่อนไข
    const fetchedEmployeeData = await fetchEmployeeData();
    
    if (!fetchedEmployeeData || fetchedEmployeeData.length === 0) {
      alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
      setLoadingEmployees(false);
      return;
    }
    
    // ถ้าไม่ได้ระบุ workplacrId ให้จัดกลุ่มข้อมูลตามหน่วยงาน
    if (!workplacrId) {
      // จัดกลุ่มข้อมูลตามหน่วยงาน
      const groupedData = fetchedEmployeeData.reduce((acc, emp) => {
        const wpId = emp.workplaceId || 'unknown';
        if (!acc[wpId]) {
          acc[wpId] = [];
        }
        acc[wpId].push(emp);
        return acc;
      }, {});
      
      // สร้าง PDF สำหรับแต่ละกลุ่มหน่วยงาน
      const doc = new jsPDF({ 
        orientation: "landscape", 
        unit: 'mm', 
        format: 'a4'
      });

      let currentPage = 1;
      let overallY = 10; // ตำแหน่ง Y เริ่มต้นบนหน้าแรก
      let grandTotal = {
        days: 0,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0,
        employees: 0
      };
      
      // ฟังก์ชันสำหรับวาดเซลล์ (ถ้ายังไม่มี)
      const cellHeight = 9; // ความสูงของเซลล์หัวตาราง
      const dataCellHeight = 6; // ความสูงของเซลล์ข้อมูล
      
      // กำหนดความกว้างของแต่ละคอลัมน์
      const colWidths = [
        12,  // รหัส (ลดจาก 15)
        60,  // ชื่อ-สกุล (ขยายจาก 40)
        5,   // วัน (เหมือนเดิม)
        18,  // เงินเดือน (ลดจาก 20)
        14,  // ค่าล่วงเวลา (ลดจาก 15)
        14,  // ค่ารถ/โทร/ตน. (ลดจาก 15)
        14,  // สวัสดิการ(ไม่คิด ปกส.) (ลดจาก 15)
        14,  // เบี้ยขยัน (ลดจาก 15)
        14,  // นักขัตฤกษ์ (ลดจาก 15)
        14,  // บวกอื่นๆ(คิด ปกส) (ลดจาก 15)
        14,  // หักอื่นๆ(คิด ปกส) (ลดจาก 15)
        14,  // หักภาษี (ลดจาก 15)
        13,  // หัก ปกส (ลดจาก 14)
        13,  // บวกอื่นๆ (ลดจาก 14)
        13,  // หักอื่นๆ (ลดจาก 14)
        14,  // เบิกล่วงหน้า
        15   // สุทธิ
      ];
      
      // คำนวณตำแหน่ง x ของแต่ละคอลัมน์
      const colPositions = [];
      let currentX = 15; // ตำแหน่ง X เริ่มต้น
      colWidths.forEach(width => {
        colPositions.push(currentX);
        currentX += width;
      });
      
      // ฟังก์ชันสำหรับวาดเซลล์
      const drawCell = (x, y, width, height, text, options = {}) => {
        // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
        if (options.drawBorder !== false) {
          doc.rect(x, y, width, height);
        }

        // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
        if (text === undefined || text === null || text === '') {
          return;
        }
        
        // คำนวณจุดกึ่งกลางของเซลล์
        const centerX = x + width / 2;
        
        // เพิ่ม paddingTop สำหรับหัวตาราง
        const paddingTop = options.isHeader ? 2 : 0;
        const centerY = y + height / 3;

        // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
        const fontSize = options.fontSize || 10;
        doc.setFontSize(fontSize);
        
        // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
        if (options.isHeader) {
          doc.setFont("THSarabunNew Bold");
        } else {
          doc.setFont("THSarabunNew");
        }

        // กำหนด alignment (default: center)
        const align = options.align || 'center';
        const textOptions = { align: align, baseline: "middle" };

        // ปรับตำแหน่งข้อความตาม alignment
        if (align === 'right') {
          doc.text(text, x + width - 2, centerY, textOptions);
        } else if (align === 'left') {
          doc.text(text, x + 2, centerY, textOptions);
        } else {
          doc.text(text, centerX, centerY, textOptions);
        }
      };
      
      // กำหนดหัวตาราง
      const headers = [
        "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
        "สวัสดิการพิเศษ/\nตน.", "สวัสดิการ\n(ไม่คิด ปกส.)", "เบี้ยขยัน", "นักขัติ", 
        "บวกอื่นๆ\n(คิด ปกส)", "หักอื่นๆ\n(คิด ปกส)", "บวกอื่นๆ\n(ไม่คิด ปกส)", 
        "หักอื่นๆ\n(ไม่คิด ปกส)", "หักภาษี", "หัก ปกส", "บวกอื่นๆ", "หักอื่นๆ", 
        "เบิกล่วงหน้า", "สุทธิ"
      ];
      
      // วาดหัวตารางก่อนเริ่มวนลูป (สำคัญ!)
      headers.forEach((header, index) => {
        drawCell(colPositions[index], overallY, colWidths[index], cellHeight, header, {
          isHeader: true,
          fontSize: 10
        });
      });
      
      // เพิ่ม Y หลังจากวาดหัวตาราง
      overallY += cellHeight;
      
      // เริ่มวนลูปสำหรับแต่ละหน่วยงาน
      for (const [wpId, employees] of Object.entries(groupedData)) {
        // ถ้าไม่ใช่หน้าแรกและจำเป็นต้องขึ้นหน้าใหม่
        if (overallY > 180) { // ถ้า Y มากกว่า 180mm (ใกล้ท้ายกระดาษ)
          // เพิ่มเลขหน้าก่อนขึ้นหน้าใหม่
          doc.setFont("THSarabunNew");
          doc.setFontSize(10);
          doc.text(`หน้า ${currentPage}`, 280, 200, { align: 'right' });
          
          // เพิ่มหน้าใหม่
          doc.addPage();
          currentPage++;
          overallY = 10; // รีเซ็ต Y เมื่อขึ้นหน้าใหม่
          
          // วาดหัวตารางใหม่เฉพาะเมื่อขึ้นหน้าใหม่เท่านั้น
          headers.forEach((header, index) => {
            drawCell(colPositions[index], overallY, colWidths[index], cellHeight, header, {
              isHeader: true,
              fontSize: 10
            });
          });
          
          overallY += cellHeight; // เพิ่ม Y หลังจากวาดหัวตาราง
        }
        
        // หาชื่อหน่วยงาน
        const workplace = workplaceListAll.find(w => w.workplaceId === wpId) || {};
        const wpName = workplace.workplaceName || 'ไม่ระบุชื่อ';
        
        // สร้างตารางข้อมูลสำหรับหน่วยงานนี้
        const { newY, totalValues } = createWorkplaceTable(doc, wpId, wpName, employees, overallY);
        overallY = newY + 1; // เพิ่มระยะห่างระหว่างตาราง
      }
      
      // เพิ่มเลขหน้าสุดท้าย
      doc.setFont("THSarabunNew");
      doc.setFontSize(10);
      doc.text(`หน้า ${currentPage}`, 280, 200, { align: 'right' });
      
      // เพิ่มข้อมูลส่วนท้าย
      doc.setFont("THSarabunNew");
      doc.setFontSize(10);
      doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 5, 200);
      doc.text(`รายงานโดย ${present}`, 100, 200);
      doc.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);
      
      // บันทึกไฟล์ PDF

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      // doc.save(`รายงานพนักงานทุกหน่วยงาน_${month}_${year}.pdf`);
    } else {
      // กรณีมีการระบุ workplacrId ทำเหมือนเดิม (สร้าง PDF เฉพาะหน่วยงานที่ระบุ)
      const doc = new jsPDF({ 
        orientation: "landscape", 
        unit: 'mm', 
        format: 'a4'
      });

      // เพิ่มฟอนต์ไทย (ต้องมีการโหลดฟอนต์ก่อนใช้งาน)
      doc.setFont("THSarabunNew");
      doc.setFontSize(16);
      
      // ฟังก์ชันสำหรับวาดเซลล์ และโค้ดส่วนที่เหลือเหมือนเดิม...
      const drawCell = (x, y, width, height, text, options = {}) => {
        // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
        if (options.drawBorder !== false) {
          doc.rect(x, y, width, height);
        }

        // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
        if (text === undefined || text === null || text === '') {
          return;
        }
        
        // คำนวณจุดกึ่งกลางของเซลล์
        const centerX = x + width / 2;
        const centerY = y + height / 2; // แก้ไขให้อยู่กึ่งกลางจริงๆ

        // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
        const fontSize = options.fontSize || 10;
        doc.setFontSize(fontSize);
        
        // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
        if (options.isHeader) {
          doc.setFont("THSarabunNew Bold"); // ใช้ฟอนต์ตัวหนาสำหรับหัวตาราง
        } else {
          doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติสำหรับข้อมูลอื่น
        }

        // กำหนด alignment (default: center)
        const align = options.align || 'center';
        const textOptions = { align: align, baseline: "middle" };

        // ปรับตำแหน่งข้อความตาม alignment
        if (align === 'right') {
          doc.text(text, x + width - 2, centerY, textOptions);
        } else if (align === 'left') {
          // เพิ่ม padding ด้านซ้าย 2 mm สำหรับข้อความที่ชิดซ้าย
          doc.text(text, x + 0, centerY, textOptions); 
        } else {
          doc.text(text, centerX, centerY, textOptions);
        }
      };

      // ตำแหน่งเริ่มต้น
      const startY = 10;
      const cellHeight = 9; // ความสูงของเซลล์หัวตาราง
      const dataCellHeight = 6; // ความสูงของเซลล์ข้อมูล
      const tableWidth = 280; // ความกว้างทั้งหมดของตาราง
      
      // กำหนดความกว้างของแต่ละคอลัมน์ (ไม่รวมช่องลำดับ)
      const colWidths = [
        10,  // รหัส
        32,  // ชื่อ-สกุล
        5,   // วัน
        18,  // เงินเดือน
        17,  // ปรับปรุงค่าจ้าง
        15,  // ชดเชยวันลา
        17,  // ค่าล่วงเวลา
        16,  // ค่ารถ/โทร/ตน.
        15,  // สวัสดิการ(ไม่คิด ปกส.)
        15,  // เบี้ยขยัน
        15,  // นักขัตฤกษ์
        15,  // บวกอื่นๆ(คิด ปกส)
        15,  // หักอื่นๆ(คิด ปกส)
        15,  // บวกอื่นๆ(ไม่คิด ปกส)
        15,  // หักอื่นๆ(ไม่คิด ปกส)
        15,  // หักภาษี
        14,  // หัก ปกส
        14,  // บวกอื่นๆ
        14,  // หักอื่นๆ
        14,  // เบิกล่วงหน้า
        25   // สุทธิ
      ];
      
      // คำนวณตำแหน่ง x ของแต่ละคอลัมน์
      const colPositions = [];
      let currentX = 2; // เริ่มที่ตำแหน่ง x = 3 เพื่อให้ชิดซ้ายมากขึ้น
      colWidths.forEach(width => {
        colPositions.push(currentX);
        currentX += width;
      });
      
      // วาดหัวตาราง     // กำหนดชื่อหน่วยงานและรหัสหน่วยงาน
      const headers = [
        "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน","ปรับปรุงค่าจ้าง","ชดเชยวันลา","ค่าล่วงเวลา",
        "สวัสดิการพิเศษ", "ตำแหน่ง", "เบี้ยขยัน", "นักขัติ", 
        "บวกอื่นๆ", "หักอื่นๆ", "หักภาษี","หัก ปกส", "บวกอื่นๆ",
        
         "หักอื่นๆ","เบิกล่วงหน้า", 
       
        "สุทธิ"
      ];
      
      // วาดหัวตาราง (มีเส้นตาราง)
      headers.forEach((header, index) => {
        drawCell(colPositions[index], startY, colWidths[index], cellHeight, header, {
          isHeader: true, // ระบุว่าเป็นหัวตาราง
          fontSize: 10,
          align: 'center' // จัดข้อความให้อยู่กึ่งกลาง
        });
      });
      
      // ตำแหน่งเริ่มต้นสำหรับข้อมูลพนักงาน
      let currentY = startY + cellHeight;
      
      // แสดงชื่อหน่วยงานระหว่างหัวตารางกับข้อมูลในตาราง (ที่คอลัมน์ 2)
      doc.setFontSize(10);
      doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติ
      doc.text(`${workplacrName || '-'} ${workplacrId || '-'}`, colPositions[1], currentY + 5, { align: 'left' });
      
      // เพิ่มระยะห่างสำหรับชื่อหน่วยงาน
      currentY += 8;
      
      // เตรียมข้อมูลพนักงาน
      // เตรียมข้อมูลพนักงาน
const employeeData = displayEmployees.map((emp) => {

  // แปลงข้อมูลตัวเลขให้เป็นตัวเลขทั้งหมด (ลบ comma และแปลงเป็น float)
  const salary = parseFloat(emp.sumCashWork.replace(/,/g, '') || 0);
  const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
  const leaveInLieu = parseFloat(emp.leaveInLieu?.replace(/,/g, '') || 0);
  const ot = parseFloat(emp.sumCashOt.replace(/,/g, '') || 0);
  const transportation = parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0); //
  const positionAndTransportationWithSocial = parseFloat(emp.positionAndTransportationWithSocial?.replace(/,/g, '') || 0); //ตำแหน่ง
    console.log('positionAndTransportationWithSocial in map:', positionAndTransportationWithSocial); // เพิ่มบรรทัดนี้

  const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
  const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
  const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0); // เปลี่ยนจาก plusOther เป็น additionalBeforeTax
  const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);  const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
  const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
  const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
  const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
  const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);

  // คำนวณยอดสุทธิโดยรวมทุกช่องเงิน (บวกรายรับ ลบรายจ่าย)
  const netCalculated = 
    salary + wageRevise + leaveInLieu + ot + transportation + positionAndTransportationWithSocial + diligence + holiday + 
    addBeforeTax +   addAfterTax - 
    deductBeforeTax  - tax - socialSecurity - deductAfterTax - advance;
  
  // ฟอร์แมตเป็นสตริงที่มี , คั่นหลักพัน และทศนิยม 2 ตำแหน่ง
  const netFormatted = formatNumber(netCalculated);

  return {
    id: emp.employeeId || "-",
    name:`${emp.prefix || ''} ${emp.firstName || ""} ${emp.lastName || ""}`,
    days: emp.typeOfemployee === 'รายเดือน' ? '30' : (emp.dayWorkCount || '0'),
    salary: emp.sumCashWork || '0',
    wageRevise: emp.wageRevise || '0',
    leaveInLieu: emp.leaveInLieu || '0',
    ot: emp.sumCashOt || '0',
    transportation: emp.transportAllowance || '0',
    positionAndTransportationWithSocial: emp.positionAndTransportationWithSocial || '54',
    diligence: emp.diligenceAllowance || '0',
    holiday: emp.publicHolidayCash || '0',
    addBeforeTax: emp.additionalBeforeTax || '0', // เปลี่ยนจาก plusOther เป็น additionalBeforeTax
    deductBeforeTax: emp.deductionBeforeTax || '0',
    tax: emp.tax || '0',
    socialSecurity: emp.socialSecurity || '0',
    addAfterTax: emp.additionalAfterTax || '0',
    deductAfterTax: emp.deductionAfterTax || '0',
    advance: emp.advancePayment || '0',
    net: netFormatted, // ใช้ค่าที่คำนวณได้แทน emp.netSalary || '0'
    netRaw: netCalculated // เก็บค่าดิบไว้สำหรับคำนวณรวมภายหลัง
  };
});
      
      // วาดข้อมูลพนักงาน
      let pageCount = 1;
      const maxRowsPerPage = 26; // จำนวนแถวสูงสุดต่อหน้า
      
      // สร้างตัวแปรสำหรับเก็บผลรวม
      let totals = {
        days: 0,
        salary: 0,
        wageRevise: 0,
        leaveInLieu: 0,
        ot: 0,
        transportation: 0,
        positionAndTransportationWithSocial: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
    
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0
      };
      
      employeeData.forEach((emp, index) => {
        // ถ้าถึงขอบเขตสูงสุดของหน้า ให้เพิ่มหน้าใหม่
        if (index > 0 && index % maxRowsPerPage === 0) {
          // เพิ่มเลขหน้าที่มุมล่างขวา
          doc.setFontSize(10);
          doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติสำหรับเลขหน้า
          doc.text(`หน้า ${pageCount}`, 280, 200, { align: 'right' });
          
          // สร้างหน้าใหม่
          doc.addPage();
          pageCount++;
          
          // วาดหัวตารางใหม่
          headers.forEach((header, i) => {
            drawCell(colPositions[i], startY, colWidths[i], cellHeight, header, {
              isHeader: true, // ระบุว่าเป็นหัวตาราง
              fontSize: 10
            });
          });
          
          // รีเซ็ต currentY และแสดงชื่อหน่วยงานในหน้าใหม่
          currentY = startY + cellHeight;
          doc.setFontSize(14);
          doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติ
          doc.text(`รายงานเงินเดือนพนักงาน หน่วยงาน: ${workplacrName || '-'} (${workplacrId || '-'})`, colPositions[1], currentY + 5, { align: 'left' });
          currentY += 10;
        }
        
        // ข้อมูลในแถวนี้
        const rowData = [
          emp.id,
          emp.name,
          emp.days.toString(),
          emp.salary,
          emp.wageRevise,
          emp.leaveInLieu,
          emp.ot,
          emp.transportation,
          emp.positionAndTransportationWithSocial,
          emp.diligence,
          emp.holiday,
          emp.addBeforeTax,
          emp.deductBeforeTax,

          emp.tax,
          emp.socialSecurity,
          emp.addAfterTax,
          emp.deductAfterTax,
          emp.advance,
          emp.net
        ];
        
        // บวกรวมค่าสำหรับการคำนวณผลรวม
        totals.days += parseFloat(emp.days);
        totals.salary += parseFloat(emp.salary.replace(/,/g, ''));
        totals.wageRevise += parseFloat(emp.wageRevise.replace(/,/g, ''));
        totals.leaveInLieu += parseFloat(emp.leaveInLieu.replace(/,/g, ''));
        totals.ot += parseFloat(emp.ot.replace(/,/g, ''));
        totals.transportation += parseFloat(emp.transportation.replace(/,/g, ''));
        totals.positionAndTransportationWithSocial += parseFloat(emp.positionAndTransportationWithSocial.replace(/,/g, ''));
        totals.diligence += parseFloat(emp.diligence.replace(/,/g, ''));
        totals.holiday += parseFloat(emp.holiday.replace(/,/g, ''));
        totals.addBeforeTax += parseFloat(emp.addBeforeTax.replace(/,/g, ''));
        totals.deductBeforeTax += parseFloat(emp.deductBeforeTax.replace(/,/g, ''));
        totals.tax += parseFloat(emp.tax.replace(/,/g, ''));
        totals.socialSecurity += parseFloat(emp.socialSecurity.replace(/,/g, ''));
        totals.addAfterTax += parseFloat(emp.addAfterTax.replace(/,/g, ''));
        totals.deductAfterTax += parseFloat(emp.deductAfterTax.replace(/,/g, ''));
        totals.advance += parseFloat(emp.advance.replace(/,/g, ''));
        totals.net += parseFloat(emp.net.replace(/,/g, ''));
        
        // วาดข้อมูลในแต่ละช่อง (ไม่มีเส้นตาราง)
        rowData.forEach((data, cellIndex) => {
          // จัดวางข้อความให้ชิดขวาสำหรับข้อมูลตัวเลข
          let alignment;
          if (cellIndex === 0 || cellIndex === 1) {
            alignment = 'left'; // รหัสและชื่อชิดซ้าย
          } else if (cellIndex >= 3) {
            alignment = 'right'; // ตัวเลขชิดขวา
          } else {
            alignment = 'center'; // อื่นๆ กลาง
          }
          
          drawCell(
            colPositions[cellIndex], 
            currentY, 
            colWidths[cellIndex], 
            dataCellHeight, 
            data, 
            { align: alignment, drawBorder: false } // ไม่วาดเส้นขอบ
          );
        });
        
        // เลื่อนไปแถวถัดไป
        currentY += dataCellHeight;
      });
      
      // วาดแถวสรุปผลรวม
      // วาดเส้นคั่นก่อน
      doc.setLineWidth(0.3);
      const lastColIndex = colPositions.length - 1;
      const endOfTable = colPositions[1] 
      doc.line(colPositions[19], currentY +0.5, endOfTable, currentY +0.5);
      currentY += 1; // เว้นระยะ
      
      // วาดแถวสรุปผลรวม (ไม่มีเส้นตาราง)
      doc.setFont("THSarabunNew Bold"); // ใช้ฟอนต์ตัวหนาสำหรับผลรวม
      drawCell(colPositions[0], currentY, colPositions[2] - colPositions[0], dataCellHeight, 
        `รวมแผนก     ${workplacrId || '-'}`, { drawBorder: false, align: 'left' });
      drawCell(colPositions[2], currentY, colWidths[2], dataCellHeight, 
        displayEmployees.length + " คน", { drawBorder: false });  
      
      // วาดผลรวมของแต่ละคอลัมน์ (ไม่มีเส้นตาราง)
      [
        { col: 3, value: formatNumber(totals.salary) },
        { col: 4, value: formatNumber(totals.wageRevise) },
        { col: 5, value: formatNumber(totals.leaveInLieu) },
        { col: 6, value: formatNumber(totals.ot) },
        { col: 7, value: formatNumber(totals.transportation) },
        { col: 8, value: formatNumber(totals.positionAndTransportationWithSocial) },
        { col: 9, value: formatNumber(totals.diligence) },
        { col: 10, value: formatNumber(totals.holiday) },
        { col: 11, value: formatNumber(totals.addBeforeTax) },
        { col: 12, value: formatNumber(totals.deductBeforeTax) },
        { col: 13, value: formatNumber(totals.tax) },
        { col: 14, value: formatNumber(totals.socialSecurity) },
        { col: 15, value: formatNumber(totals.addAfterTax) },
        { col: 16, value: formatNumber(totals.deductAfterTax) },
        { col: 17, value: formatNumber(totals.advance) },
        { col: 18, value: formatNumber(totals.net) }
      ].forEach(item => {
        drawCell(colPositions[item.col], currentY, colWidths[item.col], dataCellHeight, 
          item.value, { align: 'right', drawBorder: false });
      });
      
      // เพิ่มข้อมูลส่วนท้าย
      currentY += dataCellHeight + 5;
      doc.setFont("THSarabunNew"); // กลับไปใช้ฟอนต์ปกติสำหรับส่วนท้าย
      doc.setFontSize(10);
      doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 5, currentY);
      doc.text(`รายงานโดย ${present}`, 100, currentY);
      doc.text(`แฟ้มรายงาน ${presentfilm}`, 200, currentY);
      
      // เพิ่มเลขหน้าที่มุมล่างขวา
      doc.setFontSize(10);
      doc.text(`หน้า ${pageCount}`, 280, 200, { align: 'right' });
      
      // บันทึกไฟล์ PDF
      // doc.save(`รายงานพนักงาน_${workplacrName || workplacrId || ''}_${month}_${year}.pdf`);
       const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    
     
    }
    
    // ซ่อน loading indicator เมื่อสร้าง PDF เสร็จสิ้น
    setLoadingEmployees(false);
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', error);
    alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    setLoadingEmployees(false);
  }
};
const generatePDFAudit = async () => {
  try {
    // ตรวจสอบว่ามีการกรอกเดือนและปีครบถ้วนหรือไม่ (ไม่จำเป็นต้องมี workplacrId)
    if (!month || !year) {
      alert('กรุณากรอกเดือนและปี');
      return;
    }

    // แสดง loading indicator
    setLoadingEmployees(true);
    
    // ดึงข้อมูลพนักงานตามเงื่อนไข
    const fetchedEmployeeData = await fetchEmployeeData();
    
    if (!fetchedEmployeeData || fetchedEmployeeData.length === 0) {
      alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
      setLoadingEmployees(false);
      return;
    }
    
    // ถ้าไม่ได้ระบุ workplacrId ให้จัดกลุ่มข้อมูลตามหน่วยงาน
    if (!workplacrId) {
      // จัดกลุ่มข้อมูลตามหน่วยงาน
      const groupedData = fetchedEmployeeData.reduce((acc, emp) => {
        const wpId = emp.workplaceId || 'unknown';
        if (!acc[wpId]) {
          acc[wpId] = [];
        }
        acc[wpId].push(emp);
        return acc;
      }, {});
      
      // สร้าง PDF สำหรับแต่ละกลุ่มหน่วยงาน
      const doc = new jsPDF({ 
        orientation: "landscape", 
        unit: 'mm', 
        format: 'a4'
      });

      let currentPage = 1;
      let overallY = 10; // ตำแหน่ง Y เริ่มต้นบนหน้าแรก
      let grandTotal = {
        days: 0,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0,
        employees: 0
      };
      
      // ฟังก์ชันสำหรับวาดเซลล์ (ถ้ายังไม่มี)
      const cellHeight = 9; // ความสูงของเซลล์หัวตาราง
      const dataCellHeight = 6; // ความสูงของเซลล์ข้อมูล
      
      // กำหนดความกว้างของแต่ละคอลัมน์
      const colWidths = [
        15,  // รหัส
        18,  // ชื่อ-สกุล
        5,   // วัน
        20,  // เงินเดือน
        15,  // ค่าล่วงเวลา
        15,  // ค่ารถ/โทร/ตน.
        15,  // สวัสดิการ(ไม่คิด ปกส.)
        15,  // เบี้ยขยัน
        15,  // นักขัตฤกษ์
        15,  // บวกอื่นๆ(คิด ปกส)
        15,  // หักอื่นๆ(คิด ปกส)
        15,  // บวกอื่นๆ(ไม่คิด ปกส)
        15,  // หักอื่นๆ(ไม่คิด ปกส)
        15,  // หักภาษี
        14,  // หัก ปกส
        14,  // บวกอื่นๆ
        14,  // หักอื่นๆ
        14,  // เบิกล่วงหน้า
        15   // สุทธิ
      ];
      
      // คำนวณตำแหน่ง x ของแต่ละคอลัมน์
      const colPositions = [];
      let currentX = 3; 
      colWidths.forEach(width => {
        colPositions.push(currentX);
        currentX += width;
      });
      
      // ฟังก์ชันสำหรับวาดเซลล์
      const drawCell = (x, y, width, height, text, options = {}) => {
        // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
        if (options.drawBorder !== false) {
          doc.rect(x, y, width, height);
        }

        // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
        if (text === undefined || text === null || text === '') {
          return;
        }
        
        // คำนวณจุดกึ่งกลางของเซลล์
        const centerX = x + width / 2;
        
        // เพิ่ม paddingTop สำหรับหัวตาราง
        const paddingTop = options.isHeader ? 2 : 0;
        const centerY = y + height / 3;

        // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
        const fontSize = options.fontSize || 10;
        doc.setFontSize(fontSize);
        
        // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
        if (options.isHeader) {
          doc.setFont("THSarabunNew Bold");
        } else {
          doc.setFont("THSarabunNew");
        }

        // กำหนด alignment (default: center)
        const align = options.align || 'center';
        const textOptions = { align: align, baseline: "middle" };

        // ปรับตำแหน่งข้อความตาม alignment
        if (align === 'right') {
          doc.text(text, x + width - 2, centerY, textOptions);
        } else if (align === 'left') {
          doc.text(text, x + 2, centerY, textOptions);
        } else {
          doc.text(text, centerX, centerY, textOptions);
        }
      };
      
      // กำหนดหัวตาราง
      const headers = [
        "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
        "ค่าจ.", "สวัสดิการ\n(ไม่คิด ปกส.)", "เบี้ยขยัน", "นักขัติ", 
        "บวกอื่นๆ\n(คิด ปกส)", "หักอื่นๆ\n(คิด ปกส)", "บวกอื่นๆ\n(ไม่คิด ปกส)", 
        "หักอื่นๆ\n(ไม่คิด ปกส)", "หักภาษี", "หัก ปกส", "บวกอื่นๆ", "หักอื่นๆ", 
   , "สุทธิ"
      ];
      
      // วาดหัวตารางก่อนเริ่มวนลูป (สำคัญ!)
      headers.forEach((header, index) => {
        drawCell(colPositions[index], overallY, colWidths[index], cellHeight, header, {
          isHeader: true,
          fontSize: 10
        });
      });
      
      // เพิ่ม Y หลังจากวาดหัวตาราง
      overallY += cellHeight;
      
      // เริ่มวนลูปสำหรับแต่ละหน่วยงาน
      for (const [wpId, employees] of Object.entries(groupedData)) {
        // ถ้าไม่ใช่หน้าแรกและจำเป็นต้องขึ้นหน้าใหม่
        if (overallY > 180) { // ถ้า Y มากกว่า 180mm (ใกล้ท้ายกระดาษ)
          // เพิ่มเลขหน้าก่อนขึ้นหน้าใหม่
          doc.setFont("THSarabunNew");
          doc.setFontSize(10);
          doc.text(`หน้า ${currentPage}`, 280, 200, { align: 'right' });
          
          // เพิ่มหน้าใหม่
          doc.addPage();
          currentPage++;
          overallY = 10; // รีเซ็ต Y เมื่อขึ้นหน้าใหม่
          
          // วาดหัวตารางใหม่เฉพาะเมื่อขึ้นหน้าใหม่เท่านั้น
          headers.forEach((header, index) => {
            drawCell(colPositions[index], overallY, colWidths[index], cellHeight, header, {
              isHeader: true,
              fontSize: 10
            });
          });
          
          overallY += cellHeight; // เพิ่ม Y หลังจากวาดหัวตาราง
        }
        
        // หาชื่อหน่วยงาน
        const workplace = workplaceListAll.find(w => w.workplaceId === wpId) || {};
        const wpName = workplace.workplaceName || 'ไม่ระบุชื่อ';
        
        // สร้างตารางข้อมูลสำหรับหน่วยงานนี้
        const { newY, totalValues } = createWorkplaceTable(doc, wpId, wpName, employees, overallY);
        overallY = newY + 1; // เพิ่มระยะห่างระหว่างตาราง
      }
      
      // เพิ่มเลขหน้าสุดท้าย
      doc.setFont("THSarabunNew");
      doc.setFontSize(10);
      doc.text(`หน้า ${currentPage}`, 280, 200, { align: 'right' });
      
      // เพิ่มข้อมูลส่วนท้าย
      doc.setFont("THSarabunNew");
      doc.setFontSize(10);
      doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 5, 200);
      doc.text(`รายงานโดย ${present}`, 100, 200);
      doc.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);
      
      // บันทึกไฟล์ PDF

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      // doc.save(`รายงานพนักงานทุกหน่วยงาน_${month}_${year}.pdf`);
    } else {
      // กรณีมีการระบุ workplacrId ทำเหมือนเดิม (สร้าง PDF เฉพาะหน่วยงานที่ระบุ)
      const doc = new jsPDF({ 
        orientation: "landscape", 
        unit: 'mm', 
        format: 'a4'
      });

      // เพิ่มฟอนต์ไทย (ต้องมีการโหลดฟอนต์ก่อนใช้งาน)
      doc.setFont("THSarabunNew");
      doc.setFontSize(16);
      
      // ฟังก์ชันสำหรับวาดเซลล์ และโค้ดส่วนที่เหลือเหมือนเดิม...
      // ฟังก์ชันสำหรับวาดเซลล์
      const drawCell = (x, y, width, height, text, options = {}) => {
        // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
        if (options.drawBorder !== false) {
          doc.rect(x, y, width, height);
        }

  // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
  if (text === undefined || text === null || text === '') {
    return;
  }
  
  // คำนวณจุดกึ่งกลางของเซลล์
  const centerX = x + width / 2;
  
  // ปรับ centerY ให้อยู่กึ่งกลางจริงๆ
  const centerY = y + height / 2;

  // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
  const fontSize = options.fontSize || 8; // ลดขนาดจาก 10 เป็น 8
  doc.setFontSize(fontSize);
  
  // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
  if (options.isHeader) {
    doc.setFont("THSarabunNew Bold");
  } else {
    doc.setFont("THSarabunNew");
  }

  // กำหนด alignment (default: center)
  const align = options.align || 'center';
  const textOptions = { align: align, baseline: "middle" };

  // ปรับตำแหน่งข้อความตาม alignment
  if (align === 'right') {
    doc.text(text, x + width - 1, centerY, textOptions); // ลด padding จาก 2 เป็น 1
  } else if (align === 'left') {
    doc.text(text, x + 1, centerY, textOptions); // ลด padding จาก 2 เป็น 1
  } else {
    doc.text(text, centerX, centerY, textOptions);
  }
};

      // ตำแหน่งเริ่มต้น
      const startY = 10;
      const cellHeight = 9; // ความสูงของเซลล์หัวตาราง
      const dataCellHeight = 6; // ความสูงของเซลล์ข้อมูล
      const tableWidth = 280; // ความกว้างทั้งหมดของตาราง
      
  // คำนวณความกว้างอัตโนมัติให้เต็มกระดาษ
const totalWidth = 275; // ความกว้างทั้งหมดที่ต้องการ
const numCols = 14; // จำนวนคอลัมน์
const avgWidth = Math.floor(totalWidth / numCols);

const colWidths = [
  15,  // รหัส (ลดจาก 15)
  45,  // ชื่อ-สกุล (ขยายจาก 40) - รวม 275
  10,   // วัน (ลดจาก 10)
  20,  // เงินเดือน (ลดจาก 25)
  18,  // ค่าล่วงเวลา (ลดจาก 20)
  18,  // ค่ารถ/โทร/ตน. (ลดจาก 20)
  18,  // สวัสดิการ(ไม่คิด ปกส.) (ลดจาก 20)
  16,  // เบี้ยขยัน (ลดจาก 18)
  16,  // นักขัตฤกษ์ (ลดจาก 18)
  18,  // บวกอื่นๆ(คิด ปกส) (ลดจาก 20)
  18,  // หักอื่นๆ(คิด ปกส) (ลดจาก 20)
  16,  // หักภาษี (ลดจาก 18)
  16,  // หัก ปกส (ลดจาก 18)
  27   // สุทธิ (ลดจาก 27)
]; 
      const colPositions = [];
      let currentX = 10; // เริ่มที่ตำแหน่ง x = 3 เพื่อให้ชิดซ้ายมากขึ้น
      colWidths.forEach(width => {
        colPositions.push(currentX);
        currentX += width;
      });
      
      // วาดหัวตาราง     // กำหนดชื่อหน่วยงานและรหัสหน่วยงาน
      const headers = [
        "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
        "ค่าตำแหน่ง", "ค่าพาหนะ", "เบี้ยขยัน", "นักขัติฤกษ์", 
         "บวกอื่นๆ", 
        "หักอื่นๆ", "หักภาษี", "หัก ปกส",  
         "สุทธิ"
      ];
      
      // วาดหัวตาราง (มีเส้นตาราง)
      headers.forEach((header, index) => {
        drawCell(colPositions[index], startY, colWidths[index], cellHeight, header, {
          isHeader: true, // ระบุว่าเป็นหัวตาราง
          fontSize: 10
        });
      });
      
      // ตำแหน่งเริ่มต้นสำหรับข้อมูลพนักงาน
      let currentY = startY + cellHeight;
      
      // แสดงชื่อหน่วยงานระหว่างหัวตารางกับข้อมูลในตาราง (ที่คอลัมน์ 2)
      doc.setFontSize(12);
      doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติ
      doc.text(`${workplacrName || '-'} ${workplacrId || '-'}`, colPositions[1], currentY + 5, { align: 'left' });
      
      // เพิ่มระยะห่างสำหรับชื่อหน่วยงาน
      currentY += 8;
      
      // เตรียมข้อมูลพนักงาน
      // เตรียมข้อมูลพนักงาน
const employeeData = displayEmployees.map((emp) => {
  // แปลงข้อมูลตัวเลขให้เป็นตัวเลขทั้งหมด (ลบ comma และแปลงเป็น float)
  const salary = parseFloat(emp.sumCashWork.replace(/,/g, '') || 0);
  const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
  const leaveInLieu = parseFloat(emp.leaveInLieu?.replace(/,/g, '') || 0);
  const ot = parseFloat(emp.sumCashOt.replace(/,/g, '') || 0);
  const transportation = parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0);
  const positionAndTransportationWithSocial = parseFloat(emp.positionAndTransportationWithSocial?.replace(/,/g, '') || 0);
  const welfare = parseFloat(emp.welfare?.replace(/,/g, '') || 0);
  const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
  const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
  const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
  const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
  const addNoTax = parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
  const deductNoTax = parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
  const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
  const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
  const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
  const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
  const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);

  // คำนวณยอดสุทธิโดยรวมทุกช่องเงิน (บวกรายรับ ลบรายจ่าย)
  const netCalculated = 
    salary + ot + transportation + welfare + diligence + holiday + 
    addBeforeTax + addNoTax + addAfterTax - 
    deductBeforeTax - deductNoTax - tax - socialSecurity - deductAfterTax - advance;
  
  // ฟอร์แมตเป็นสตริงที่มี , คั่นหลักพัน และทศนิยม 2 ตำแหน่ง
  const netFormatted = formatNumber(netCalculated);

  return {
    id: emp.employeeId || "-",
    name: `${emp.prefix} ${emp.firstName || ""} ${emp.lastName || ""}`,
    days: emp.typeOfemployee === 'รายเดือน' ? '30' : (emp.dayWorkCount || '0'),
    salary: emp.sumCashWork || '0',
    wageRevise: emp.wageRevise || '0',
    leaveInLieu: emp.leaveInLieu || '0',
    ot: emp.sumCashOt || '0',
    transportation: emp.transportAllowance || '0',
    welfare: emp.welfare || '0',
    diligence: emp.diligenceAllowance || '0',
    holiday: emp.publicHolidayCash || '0',
    addBeforeTax: emp.additionalBeforeTax || '0',
    deductBeforeTax: emp.deductionBeforeTax || '0',
    addNoTax: emp.additionalNoTax || '0',
    deductNoTax: emp.deductionNoTax || '0',
    tax: emp.tax || '0',
    socialSecurity: emp.socialSecurity || '0',
    addAfterTax: emp.additionalAfterTax || '0',
    deductAfterTax: emp.deductionAfterTax || '0',
    advance: emp.advancePayment || '0',
    net: netFormatted, // ใช้ค่าที่คำนวณได้แทน emp.netSalary || '0'
    netRaw: netCalculated // เก็บค่าดิบไว้สำหรับคำนวณรวมภายหลัง
  };
});
      
      // วาดข้อมูลพนักงาน
      let pageCount = 1;
      const maxRowsPerPage = 26; // จำนวนแถวสูงสุดต่อหน้า
      
      // สร้างตัวแปรสำหรับเก็บผลรวม
      let totals = {
        days: 0,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0
      };
      
      employeeData.forEach((emp, index) => {
        // ถ้าถึงขอบเขตสูงสุดของหน้า ให้เพิ่มหน้าใหม่
        if (index > 0 && index % maxRowsPerPage === 0) {
          // เพิ่มเลขหน้าที่มุมล่างขวา
          doc.setFontSize(10);
          doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติสำหรับเลขหน้า
          doc.text(`หน้า ${pageCount}`, 280, 200, { align: 'right' });
          
          // สร้างหน้าใหม่
          doc.addPage();
          pageCount++;
          
          // วาดหัวตารางใหม่
          headers.forEach((header, i) => {
            drawCell(colPositions[i], startY, colWidths[i], cellHeight, header, {
              isHeader: true, // ระบุว่าเป็นหัวตาราง
              fontSize: 12
            });
          });
          
          // รีเซ็ต currentY และแสดงชื่อหน่วยงานในหน้าใหม่
          currentY = startY + cellHeight;
          doc.setFontSize(14);
          doc.setFont("THSarabunNew"); // ใช้ฟอนต์ปกติ
          doc.text(`รายงานเงินเดือนพนักงาน หน่วยงาน: ${workplacrName || '-'} (${workplacrId || '-'})`, colPositions[1], currentY + 5, { align: 'left' });
          currentY += 10;
        }
        
        // ข้อมูลในแถวนี้
        const rowData = [
          emp.id,
          emp.name,
          emp.days.toString(),
          emp.salary,
          emp.ot,
          emp.transportation,
          emp.welfare,
          emp.diligence,
          emp.holiday,
          emp.addBeforeTax,
          emp.deductBeforeTax,

          emp.tax,
          emp.socialSecurity,
     
  
          emp.net
        ];
        
        // บวกรวมค่าสำหรับการคำนวณผลรวม
        totals.days += parseFloat(emp.days);
        totals.salary += parseFloat(emp.salary.replace(/,/g, ''));
        totals.ot += parseFloat(emp.ot.replace(/,/g, ''));
        totals.transportation += parseFloat(emp.transportation.replace(/,/g, ''));
        totals.welfare += parseFloat(emp.welfare.replace(/,/g, ''));
        totals.diligence += parseFloat(emp.diligence.replace(/,/g, ''));
        totals.holiday += parseFloat(emp.holiday.replace(/,/g, ''));
        totals.addBeforeTax += parseFloat(emp.addBeforeTax.replace(/,/g, ''));
        totals.deductBeforeTax += parseFloat(emp.deductBeforeTax.replace(/,/g, ''));
        totals.addNoTax += parseFloat(emp.addNoTax.replace(/,/g, ''));
        totals.deductNoTax += parseFloat(emp.deductNoTax.replace(/,/g, ''));
        totals.tax += parseFloat(emp.tax.replace(/,/g, ''));
        totals.socialSecurity += parseFloat(emp.socialSecurity.replace(/,/g, ''));
        totals.addAfterTax += parseFloat(emp.addAfterTax.replace(/,/g, ''));
        totals.deductAfterTax += parseFloat(emp.deductAfterTax.replace(/,/g, ''));
        totals.advance += parseFloat(emp.advance.replace(/,/g, ''));
        totals.net += parseFloat(emp.net.replace(/,/g, ''));
        
        // วาดข้อมูลในแต่ละช่อง (ไม่มีเส้นตาราง)
rowData.forEach((data, cellIndex) => {
  // จัดวางข้อความให้ชิดขวาสำหรับข้อมูลตัวเลข
  let alignment;
  if (cellIndex === 0 || cellIndex === 1) {
    alignment = 'left'; // รหัสและชื่อชิดซ้าย
  } else if (cellIndex === 2) {
    alignment = 'center'; // วันกลาง
  } else {
    alignment = 'right'; // ตัวเลขชิดขวา
  }
  
  drawCell(
    colPositions[cellIndex], 
    currentY, 
    colWidths[cellIndex], 
    dataCellHeight, 
    data, 
    { 
      align: alignment, 
      drawBorder: false,
      fontSize: 12 // ปรับขนาดตัวอักษร
    }
  );
});
        
        // เลื่อนไปแถวถัดไป
        currentY += dataCellHeight;
      });
      
      // วาดแถวสรุปผลรวม
      // วาดเส้นคั่นก่อน
      doc.setLineWidth(0.3);
      const lastColIndex = colPositions.length - 1;
      const endOfTable = colPositions[lastColIndex] + colWidths[lastColIndex];
      doc.line(colPositions[2], currentY + 1, endOfTable, currentY +1 );
      currentY += 1; // เว้นระยะ
      
      // วาดแถวสรุปผลรวม (ไม่มีเส้นตาราง)
      // วาดแถวสรุปผลรวม (ไม่มีเส้นตาราง)
        doc.setFont("THSarabunNew Bold"); // ใช้ฟอนต์ตัวหนาสำหรับผลรวม
        drawCell(colPositions[0], currentY, colPositions[2] - colPositions[0], dataCellHeight, 
          `รวมแผนก ${workplacrId || '-'}`, { drawBorder: false, align: 'left', fontSize: 12 });
        drawCell(colPositions[2], currentY, colWidths[2], dataCellHeight, 
          displayEmployees.length + " คน", { drawBorder: false, fontSize: 12});  

        [
          { col: 3, value: formatNumber(totals.salary) },
          { col: 4, value: formatNumber(totals.ot) },
          { col: 5, value: formatNumber(totals.transportation) },
          { col: 6, value: formatNumber(totals.welfare) },
          { col: 7, value: formatNumber(totals.diligence) },
          { col: 8, value: formatNumber(totals.holiday) },
          { col: 9, value: formatNumber(totals.addBeforeTax) },
          { col: 10, value: formatNumber(totals.deductBeforeTax) },
          { col: 11, value: formatNumber(totals.tax) },
          { col: 12, value: formatNumber(totals.socialSecurity) },
          { col: 13, value: formatNumber(totals.net) }
        ].forEach(item => {
          drawCell(colPositions[item.col], currentY, colWidths[item.col], dataCellHeight, 
            item.value, { align: 'right', drawBorder: false, fontSize: 12 });
        });
              
      // เพิ่มข้อมูลส่วนท้าย
currentY += dataCellHeight + 10; // เพิ่มระยะห่าง
doc.setFont("THSarabunNew");
doc.setFontSize(12);

// จัดวางข้อมูลส่วนท้ายให้เป็นระเบียบมากขึ้น
const footerY = 195; // กำหนดตำแหน่ง Y คงที่สำหรับส่วนท้าย
doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 5, footerY);
doc.text(`รายงานโดย ${present}`, 80, footerY);
doc.text(`แฟ้มรายงาน ${presentfilm}`, 160, footerY);

// เพิ่มเลขหน้าที่มุมล่างขวา
doc.setFontSize(8);
doc.text(`หน้า ${pageCount}`, 285, footerY, { align: 'right' });
      
      // บันทึกไฟล์ PDF
      // doc.save(`รายงานพนักงาน_${workplacrName || workplacrId || ''}_${month}_${year}.pdf`);
       const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    
     
    }
    
    // ซ่อน loading indicator เมื่อสร้าง PDF เสร็จสิ้น
    setLoadingEmployees(false);
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', error);
    alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    setLoadingEmployees(false);
  }
};

const createWorkplaceTable = (doc, wpId, wpName, employees, startY) => {
  // กำหนดขนาดของตาราง
  const cellHeight = 9; // ความสูงของเซลล์หัวตาราง
  const dataCellHeight = 6; // ความสูงของเซลล์ข้อมูล
  
  // กำหนดความกว้างของแต่ละคอลัมน์
  const colWidths = [
    15,  // รหัส
    30,  // ชื่อ-สกุล
    8,   // วัน
    22,  // เงินเดือน
    18,  // ค่าล่วงเวลา
    18,  // ค่าตำแหน่ง
    18,  // ค่าพาหนะ
    15,  // เบี้ยขยัน
    15,  // นักขัติ
    18,  // บวกอื่นๆ
    18,  // หักอื่นๆ
    18,  // หักภาษี
    18,  // หัก ปกส
    20   // สุทธิ
  ];
  
  // คำนวณตำแหน่ง x ของแต่ละคอลัมน์
  const colPositions = [];
  let currentX = 3; 
  colWidths.forEach(width => {
    colPositions.push(currentX);
    currentX += width;
  });
  
  // ฟังก์ชันสำหรับวาดเซลล์
  const drawCell = (x, y, width, height, text, options = {}) => {
    // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
    if (options.drawBorder !== false) {
      doc.rect(x, y, width, height);
    }

    // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
    if (text === undefined || text === null || text === '') {
      return;
    }
    
    // คำนวณจุดกึ่งกลางของเซลล์
    const centerX = x + width / 2;
    
    // เพิ่ม paddingTop สำหรับหัวตาราง
    const paddingTop = options.isHeader ? 2 : 0;
    const centerY = y + height / 3;

    // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
    const fontSize = options.fontSize || 10;
    doc.setFontSize(fontSize);
    
    // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
    if (options.isHeader) {
      doc.setFont("THSarabunNew Bold");
    } else {
      doc.setFont("THSarabunNew");
    }

    // กำหนด alignment (default: center)
    const align = options.align || 'center';
    const textOptions = { align: align, baseline: "middle" };

    // ปรับตำแหน่งข้อความตาม alignment
    if (align === 'right') {
      doc.text(text, x + width - 2, centerY, textOptions);
    } else if (align === 'left') {
      doc.text(text, x + 2, centerY, textOptions);
    } else {
      doc.text(text, centerX, centerY, textOptions);
    }
  };
  
  // เก็บ headers ไว้เพื่ออ้างอิง แต่ไม่วาดในฟังก์ชันนี้
  const headers = [
    "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
    "ค่าตำแหน่ง","ค่าพาหนะ  ",  "เบี้ยขยัน", "นักขัติ", 
    "บวกอื่นๆ", "หักอื่นๆ", "หักภาษี", "หัก ปกส", "สุทธิ"
  ];
  
  // *** ลบโค้ดส่วนนี้ออก - ไม่วาดหัวตาราง ***
  // headers.forEach((header, index) => {
  //   drawCell(colPositions[index], startY, colWidths[index], cellHeight, header, {
  //     isHeader: true,
  //     fontSize: 10
  //   });
  // });
  
  // ตำแหน่งเริ่มต้นสำหรับข้อมูลพนักงาน - ปรับให้เป็น startY เลย ไม่ต้องบวก cellHeight
  let currentY = startY;
  
  // แสดงชื่อหน่วยงาน
  doc.setFontSize(10);
  doc.setFont("THSarabunNew");
  doc.text(`${wpName || '-'} ${wpId || '-'}`, colPositions[1], currentY + 5, { align: 'left' });
  
  // เพิ่มระยะห่างสำหรับชื่อหน่วยงาน
  currentY += 8;
  
  // เตรียมข้อมูลพนักงาน
  const employeeData = employees.map((emp) => {
    // แปลงข้อมูลตัวเลขให้เป็นตัวเลขทั้งหมด (ลบ comma และแปลงเป็น float)
    const salary = parseFloat(emp.sumCashWork.replace(/,/g, '') || 0);
    const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
    const leaveInLieu = parseFloat(emp.leaveInLieu?.replace(/,/g, '') || 0);
    const ot = parseFloat(emp.sumCashOt.replace(/,/g, '') || 0);
    const transportation = parseFloat(emp.transportAllsowance?.replace(/,/g, '') || 0);
    const welfare = parseFloat(emp.welfare?.replace(/,/g, '') || 0);
    const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
    const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
    const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
    const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
    const addNoTax = parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
    const deductNoTax = parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
    const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
    const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
    const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
    const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
    const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);

    // คำนวณยอดสุทธิโดยรวมทุกช่องเงิน (บวกรายรับ ลบรายจ่าย)
    const netCalculated = 
      salary + ot + transportation + welfare + diligence + holiday + 
      addBeforeTax + addNoTax + addAfterTax - 
      deductBeforeTax - deductNoTax - tax - socialSecurity - deductAfterTax - advance;
    
    // ฟอร์แมตเป็นสตริงที่มี , คั่นหลักพัน และทศนิยม 2 ตำแหน่ง
    const netFormatted = formatNumber(netCalculated);

    return {
      id: emp.employeeId || "-",
      name: `${emp.firstName || ""} ${emp.lastName || ""}`,
      days: emp.typeOfemployee === 'รายเดือน' ? '30' : (emp.dayWorkCount || '0'),
      salary: emp.sumCashOt || '0',
      wageRevise: emp.wageRevise || '0',
      leaveInLieu: emp.leaveInLieu || '0',
      ot: emp.sumCashOt || '0',
      transportation: emp.transportAllowance || '0',
      welfare: emp.welfare || '0',
      diligence: emp.diligenceAllowance || '0',
      holiday: emp.publicHolidayCash || '0',
      addBeforeTax: emp.additionalBeforeTax || '0',
      deductBeforeTax: emp.deductionBeforeTax || '0',
      addNoTax: emp.additionalNoTax || '0',
      deductNoTax: emp.deductionNoTax || '0',
      tax: emp.tax || '0',
      socialSecurity: emp.socialSecurity || '0',
      addAfterTax: emp.additionalAfterTax || '0',
      deductAfterTax: emp.deductionAfterTax || '0',
      advance: emp.advancePayment || '0',
      net: netFormatted, // ใช้ค่าที่คำนวณได้
      netRaw: netCalculated // เก็บค่าดิบไว้สำหรับคำนวณรวมภายหลัง
    };
  });
  
  // สร้างตัวแปรสำหรับเก็บผลรวม
  let totals = {
    days: 0,
    salary: 0,
    ot: 0,
    transportation: 0,
    welfare: 0,
    diligence: 0,
    holiday: 0,
    addBeforeTax: 0,
    deductBeforeTax: 0,
    addNoTax: 0,
    deductNoTax: 0,
    tax: 0,
    socialSecurity: 0,
    addAfterTax: 0,
    deductAfterTax: 0,
    advance: 0,
    net: 0
  };
  
  // วาดข้อมูลพนักงานและคำนวณผลรวม
  employeeData.forEach((emp, index) => {
    // ข้อมูลในแถวนี้
    const rowData = [
      emp.id,
      emp.name,
      emp.days.toString(),
      emp.salary,
      emp.ot,
      emp.transportation,
      emp.welfare,
      emp.diligence,
      emp.holiday,
      emp.addBeforeTax,
      emp.deductBeforeTax,
      emp.addNoTax,
      emp.deductNoTax,
      emp.tax,
      emp.socialSecurity,
      emp.addAfterTax,
      emp.deductAfterTax,
      emp.advance,
      emp.net
    ];
    
    // บวกรวมค่าสำหรับการคำนวณผลรวม
    totals.days += parseFloat(emp.days);
    totals.salary += parseFloat(emp.salary.replace(/,/g, ''));
    totals.ot += parseFloat(emp.ot.replace(/,/g, ''));
    totals.transportation += parseFloat(emp.transportation.replace(/,/g, ''));
    totals.welfare += parseFloat(emp.welfare.replace(/,/g, ''));
    totals.diligence += parseFloat(emp.diligence.replace(/,/g, ''));
    totals.holiday += parseFloat(emp.publicHolidayCash.replace(/,/g, ''));
    totals.addBeforeTax += parseFloat(emp.addBeforeTax.replace(/,/g, ''));
    totals.deductBeforeTax += parseFloat(emp.deductBeforeTax.replace(/,/g, ''));
    totals.addNoTax += parseFloat(emp.addNoTax.replace(/,/g, ''));
    totals.deductNoTax += parseFloat(emp.deductNoTax.replace(/,/g, ''));
    totals.tax += parseFloat(emp.tax.replace(/,/g, ''));
    totals.socialSecurity += parseFloat(emp.socialSecurity.replace(/,/g, ''));
    totals.addAfterTax += parseFloat(emp.addAfterTax.replace(/,/g, ''));
    totals.deductAfterTax += parseFloat(emp.deductAfterTax.replace(/,/g, ''));
    totals.advance += parseFloat(emp.advance.replace(/,/g, ''));
    totals.net += emp.netRaw; // ใช้ค่าดิบในการคำนวณผลรวม
    
    // วาดข้อมูลในแต่ละช่อง
    rowData.forEach((data, cellIndex) => {
      // จัดวางข้อความให้ชิดขวาสำหรับข้อมูลตัวเลข
      let alignment;
      if (cellIndex === 0 || cellIndex === 1) {
        alignment = 'left'; // รหัสและชื่อชิดซ้าย
      } else if (cellIndex >= 3) {
        alignment = 'right'; // ตัวเลขชิดขวา
      } else {
        alignment = 'center'; // อื่นๆ กลาง
      }
      
      drawCell(
        colPositions[cellIndex], 
        currentY, 
        colWidths[cellIndex], 
        dataCellHeight, 
        data, 
        { align: alignment, drawBorder: false }
      );
    });
    
    // เลื่อนไปแถวถัดไป
    currentY += dataCellHeight;
  });
  
  // วาดแถวสรุปผลรวม
  // วาดเส้นคั่นก่อน
  doc.setLineWidth(0.3);
  const lastColIndex = colPositions.length - 1;
  const endOfTable = colPositions[lastColIndex] + colWidths[lastColIndex];
  doc.line(colPositions[2], currentY - 1, endOfTable, currentY - 1);
  currentY += 1; // เว้นระยะ
  
  // วาดแถวสรุปผลรวม (ไม่มีเส้นตาราง)
  doc.setFont("THSarabunNew Bold"); // ใช้ฟอนต์ตัวหนาสำหรับผลรวม
  drawCell(colPositions[0], currentY, colPositions[2] - colPositions[0], dataCellHeight, 
    `รวมแผนก     ${wpId || '-'}`, { drawBorder: false, align: 'left' });
  drawCell(colPositions[2], currentY, colWidths[2], dataCellHeight, 
    employees.length + " คน", { drawBorder: false });  
  
  // วาดผลรวมของแต่ละคอลัมน์ (ไม่มีเส้นตาราง)
  [
    { col: 3, value: formatNumber(totals.salary) },
    { col: 4, value: formatNumber(totals.ot) },
    { col: 5, value: formatNumber(totals.transportation) },
    { col: 6, value: formatNumber(totals.welfare) },
    { col: 7, value: formatNumber(totals.diligence) },
    { col: 8, value: formatNumber(totals.holiday) },
    { col: 9, value: formatNumber(totals.addBeforeTax) },
    { col: 10, value: formatNumber(totals.deductBeforeTax) },
    { col: 11, value: formatNumber(totals.addNoTax) },
    { col: 12, value: formatNumber(totals.deductNoTax) },
    { col: 13, value: formatNumber(totals.tax) },
    { col: 14, value: formatNumber(totals.socialSecurity) },
    { col: 15, value: formatNumber(totals.addAfterTax) },
    { col: 16, value: formatNumber(totals.deductAfterTax) },
    { col: 17, value: formatNumber(totals.advance) },
    { col: 18, value: formatNumber(totals.net) }
  ].forEach(item => {
    drawCell(colPositions[item.col], currentY, colWidths[item.col], dataCellHeight, 
      item.value, { align: 'right', drawBorder: false });
  });
  
  // คืนค่าตำแหน่ง Y ล่าสุดและผลรวม
  return {
    newY: currentY + dataCellHeight,
    totalValues: totals
  };
};






  const generatePDF0 = () => {
    const pdf = new jsPDF({ orientation: "landscape" });

    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    const fontName = "THSarabunNew";

    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, fontName, "normal");

    // Set the font for the document
    pdf.setFont(fontName);

    const pageWidth = pdf.internal.pageSize.width;


    console.log("มีข้อมูลพนักงานหรือไม่:", employees);

    const numRows = 7;
    const numCols = 1;
    const cellWidth = 10;
    const cellHeight = 3.5;
    const startX = 20; // Adjust the starting X-coordinate as needed
    const startY = 55; // Adjust the starting Y-coordinate as needed
    const borderWidth = 0.5; // Adjust the border width as needed

    // Function to draw a cell with borders
    // const drawCell = (x, y, width, height) => {
    //     doc.rect(x, y, width, height);
    // };
    const drawCell = (x, y, width, height, text) => {
      // Draw the cell border
      pdf.rect(x, y, width, height);

      // Calculate the center of the cell
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // Add text to the center of the cell
      pdf.setFontSize(10);

      pdf.text(text, centerX, centerY, { align: "center", valign: "middle" });
    };

    const numRowsTop = 1;
    const startXTop = 50; // Adjust the starting X-coordinate as needed
    const startYTop = 5; // Adjust the starting Y-coordinate as needed
    const cellHeightTop = 10;

    // const drawTableTop = () => {
    //     for (let i = 0; i < numRowsTop; i++) {
    //         for (let j = 0; j < numCols; j++) {
    //             const x = startX + j * cellWidth;
    //             const y = startYTop + i * cellHeightTop;
    //             drawCell(x, y, cellWidth, cellHeightTop);
    //         }
    //     }
    // };

    const drawID = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startX + j * cellWidth;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `รหัส`;
          drawCell(x, y, cellWidth, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthName = 25;
    const startXName = 11; // Adjust the starting X-coordinate as needed
    const startYName = 55; // Adjust the starting Y-coordinate as needed

    const drawName = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXName + j * cellWidthName;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ชื่อ - สกุล`;
          drawCell(x, y, cellWidthName, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidthName, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAllDay = 5;
    const startXAllDay = 36; // Adjust the starting X-coordinate as needed
    const startYAllDay = 55; // Adjust the starting Y-coordinate as needed

    const drawAllDay = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAllDay + j * cellWidthAllDay;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `วัน`;
          drawCell(x, y, cellWidthAllDay, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidthAllDay, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthSalary = 16;
    const startXSalary = 41; // Adjust the starting X-coordinate as needed
    const startYSalary = 55; // Adjust the starting Y-coordinate as needed

    const drawSalary = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXSalary + j * cellWidthSalary;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เงินเดือน`;
          drawCell(x, y, cellWidthSalary, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthOT = 16;
    const startXOT = 41 + cellWidthOT * 1; // Adjust the starting X-coordinate as needed
    const startYOT = 55; // Adjust the starting Y-coordinate as needed

    const drawOT = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXOT + j * cellWidthOT;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าล่วงเวลา`;
          drawCell(x, y, cellWidthOT, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthWelfare = 16;
    // const startXWelfare = 110; // Adjust the starting X-coordinate as needed
    const startXWelfare = 41 + cellWidthOT * 2;
    const startYWelfare = 55; // Adjust the starting Y-coordinate as needed

    const drawWelfare = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXWelfare + j * cellWidthWelfare;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          // const cellText = `สวัสดิการ\nพิเศษ`;
          const cellText = `ค่ารถ/โทร/\nตน.`;

          drawCell(x, y, cellWidthWelfare, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthRoleWork = 16;
    // const startXRoleWork = 130; // Adjust the starting X-coordinate as needed
    const startXRoleWork = 41 + cellWidthOT * 3;
    const startYRoleWork = 55; // Adjust the starting Y-coordinate as needed

    const drawRoleWork = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXRoleWork + j * cellWidthRoleWork;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          // const cellText = `ค่าตำแหน่ง`;
          const cellText = `สวัสดิการ\n(ไม่คิด ปกส.)`;

          drawCell(x, y, cellWidthRoleWork, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDiligenceAllowance = 16;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXDiligenceAllowance = 41 + cellWidthOT * 4;
    const startYDiligenceAllowance = 55; // Adjust the starting Y-coordinate as needed

    const drawDiligenceAllowance = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDiligenceAllowance + j * cellWidthDiligenceAllowance;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เบี้ยขยัน`;
          drawCell(x, y, cellWidthDiligenceAllowance, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthHoliday = 16;
    // const startXHoliday = 150; // Adjust the starting X-coordinate as needed
    const startXHoliday = 41 + cellWidthOT * 5;
    const startYHoliday = 55; // Adjust the starting Y-coordinate as needed

    const drawHoliday = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXHoliday + j * cellWidthHoliday;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `นักขัติ`;
          drawCell(x, y, cellWidthHoliday, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };
    

    const cellWidthAddBeforeDeductTax = 16;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 41 + cellWidthOT * 6;
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(คิด ปกส)`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 16;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax = 41 + cellWidthOT * 7;
    const startYMinusBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusBeforeDeductTax + j * cellWidthMinusBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\n(คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthMinusBeforeDeductTax,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddBeforeDeductTax2nd = 16;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax2nd = 41 + cellWidthOT * 8;
    const startYAddBeforeDeductTax2nd = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax2nd = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXAddBeforeDeductTax2nd + j * cellWidthAddBeforeDeductTax2nd;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(ไม่คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthAddBeforeDeductTax2nd,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax2nd = 16;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax2nd = 41 + cellWidthOT * 9;
    const startYMinusBeforeDeductTax2nd = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax2nd = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusBeforeDeductTax2nd +
            j * cellWidthMinusBeforeDeductTax2nd;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\n(ไม่คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthMinusBeforeDeductTax2nd,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDeductTax = 16;
    // const startXDeductTax = 210; // Adjust the starting X-coordinate as needed
    const startXDeductTax = 41 + cellWidthOT * 10;
    const startYDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDeductTax + j * cellWidthDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักภาษี.`;
          drawCell(x, y, cellWidthDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDeductTaxSocialSecurity = 16;
    // const startXDeductTaxSocialSecurity = 230; // Adjust the starting X-coordinate as needed
    const startXDeductTaxSocialSecurity = 41 + cellWidthOT * 11;
    const startYDeductTaxSocialSecurity = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTaxSocialSecurity = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXDeductTaxSocialSecurity +
            j * cellWidthDeductTaxSocialSecurity;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หัก ปกส`;
          drawCell(
            x,
            y,
            cellWidthDeductTaxSocialSecurity,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddAfterDeductTax = 16;
    // const startXAddAfterDeductTax = 250; // Adjust the starting X-coordinate as needed
    const startXAddAfterDeductTax = 41 + cellWidthOT * 12;
    const startYAddAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddAfterDeductTax + j * cellWidthAddAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ`;
          drawCell(x, y, cellWidthAddAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusAfterDeductTax = 16;
    // const startXMinusAfterDeductTax = 290; // Adjust the starting X-coordinate as needed
    const startXMinusAfterDeductTax = 41 + cellWidthOT * 13;
    const startYMinusAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinusAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusAfterDeductTax + j * cellWidthMinusAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell หักอื่นๆ
          const cellText = `หักอื่นๆ`;
          drawCell(x, y, cellWidthMinusAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAdvancePayment = 16;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 41 + cellWidthOT * 14;
    const startYAdvancePayment = 55; // Adjust the starting Y-coordinate as needed

    const drawAdvancePayment = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAdvancePayment + j * cellWidthAdvancePayment;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เบิกล่วงหน้า`;
          drawCell(x, y, cellWidthAdvancePayment, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthBank = 16;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 41 + cellWidthOT * 15;
    const startYBank = 55; // Adjust the starting Y-coordinate as needed

    const drawBank = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXBank + j * cellWidthBank;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าธนาคาร\nโอน`;
          drawCell(x, y, cellWidthBank, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthResult = 16;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 41 + cellWidthOT * 15;
    const startYResult = 55; // Adjust the starting Y-coordinate as needed

    const drawResult = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXResult + j * cellWidthResult;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `สุทธิ`;
          drawCell(x, y, cellWidthResult, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const groupedByWorkplace = responseDataAllLeaveSalary.reduce((acc, employee) => {
      const { workplace, name } = employee;
      // const isWasana = employee.name === "วาสนา" || employee.name === "ฐิติรัตน์";
      // const workplaceKey = isWasana
      //   ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
      //   : employee.workplace;

      const matchingEmployee = employeeList.find(
        (e) => e.employeeId === employee.employeeId
      );

      // Check if the costtype is "ภ.ง.ด.3"
      const hasSpecificCostType = matchingEmployee?.costtype === "ภ.ง.ด.3";

      // Determine the workplaceKey
      const workplaceKey = hasSpecificCostType
        ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
        : employee.workplace;

      acc[workplaceKey] = acc[workplaceKey] || {
        employees: [],
        totalCountDay: 0,
        totalSalary: 0,

        totalAmountPosition: 0,
        totalTel: 0,
        totalTravel: 0,
        totalAllAddSalary: 0,
        totalBenefitNonSocial: 0,

        totalAmountSpecialDay: 0,

        totalAddSalary: 0,

        totalAmountOt: 0,
        totalAmountSpecial: 0,
        // totalAmountPosition: 0,
        totalAmountHardWorking: 0,
        totalAmountHoliday: 0,
        totalDeductBeforeTax: 0,
        totalAddAmountBeforeTax: 0,
        totalTax: 0,
        totalSocialSecurity: 0,
        totalAddAmountAfterTax: 0,
        totalAdvancePayment: 0,
        totalDeductAfterTax: 0,
        totalBank: 0,
        totalTotal: 0,
        totalEmp: 0,
        totalSpSalary: 0, // Add a new property for sum of SpSalary
        totalCountSpecialDay: 0,

        totalSumAddSalaryBeforeTax: 0,
        totalSumAddSalaryBeforeTaxNonSocial: 0,
        totalSumDeductBeforeTaxWithSocial: 0,
        totalSumDeductBeforeTax: 0,
        totalSumAddSalaryAfterTax: 0,
        totalSumDeductAfterTax: 0,

        totalSumtest: 0,
        totalSumOT: 0,
      };

      acc[workplaceKey].employees.push(employee);// 13/12/2024

      // acc[workplaceKey].name.push(employee.name);

      // Check if employee's name is "ดวงดาว"
      // Check if employee.name matches the criteria

      const addSalary = employee.addSalary || [];
      const spSalarySum = addSalary.reduce((total, item) => {
        if (item.id === "1230" || item.id === "1520" || item.id === "1350") {
          return total + parseFloat(item.SpSalary || 0);
        }
        return total;
      }, 0);

      // Adjust this line based on your specific structure to get the salary or any other relevant data
      acc[workplaceKey].totalCountDay += parseFloat(
        employee.accountingRecord?.[0]?.countDay || 0
      );
      acc[workplaceKey].totalSalary += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWork || 0
      );

      acc[workplaceKey].totalAmountPosition += parseFloat(
        employee.accountingRecord?.[0]?.amountPosition || 0
      );
      acc[workplaceKey].totalTel += parseFloat(
        employee.accountingRecord?.[0]?.tel || 0
      );
      acc[workplaceKey].totalTravel += parseFloat(
        employee.accountingRecord?.[0]?.travel || 0
      );

      // acc[workplaceKey].totalAllAddSalary += parseFloat(employee.accountingRecord?.[0]?.amountPosition + employee.accountingRecord?.[0]?.tel + employee.accountingRecord?.[0]?.travel || 0);

      acc[workplaceKey].totalBenefitNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.benefitNonSocial || 0
      );

      acc[workplaceKey].totalAmountSpecialDay += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecialDay || 0
      );

      acc[workplaceKey].totalAmountOt += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplaceKey].totalAmountSpecial += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecial || 0
      );
      // acc[workplaceKey].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);

      // acc[workplaceKey].totalAmountHardWorking += parseFloat(employee.accountingRecord?.[0]?.amountHardWorking || 0);

      acc[workplaceKey].totalAmountHoliday += parseFloat(
        employee.accountingRecord?.[0]?.amountHoliday || 0
      );

      acc[workplaceKey].totalDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.deductBeforeTax || 0
      );
      acc[workplaceKey].totalAddAmountBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
      );
      acc[workplaceKey].totalTax += parseFloat(
        employee.accountingRecord?.[0]?.tax || 0
      );
      acc[workplaceKey].totalSocialSecurity += parseFloat(
        employee.accountingRecord?.[0]?.socialSecurity || 0
      );
      acc[workplaceKey].totalAddAmountAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountAfterTax || 0
      );
      acc[workplaceKey].totalAdvancePayment += parseFloat(
        employee.accountingRecord?.[0]?.advancePayment || 0
      );
      acc[workplaceKey].totalDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.deductAfterTax || 0
      );
      acc[workplaceKey].totalBank += parseFloat(
        employee.accountingRecord?.[0]?.bank || 0
      );
      acc[workplaceKey].totalTotal += parseFloat(
        employee.accountingRecord?.[0]?.total ?? 0
      );

      acc[workplaceKey].totalSpSalary += parseFloat(
        employee.sumAddSalaryBeforeTax ?? 0
      ); // Add the sum to totalSpSalary

      acc[workplaceKey].totalSumAddSalaryBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTax ?? 0
      );
      acc[workplaceKey].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial ?? 0
      );
      acc[workplaceKey].totalSumDeductBeforeTaxWithSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial ?? 0
      );
      acc[workplaceKey].totalSumDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTax ?? 0
      );
      acc[workplaceKey].totalSumAddSalaryAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
      );
      acc[workplaceKey].totalSumDeductAfterTax += parseFloat(
        employee.accountingRecordsumDeductAfterTax ?? 0
      );

      // ((countSpecialDay - countSpecialDayListWork) * specialDayRate)
      const sum = parseFloat(
        Number(
          (employee.countSpecialDay - employee.specialDayListWork.length) *
          employee.specialDayRate
        ) || 0
      );
      acc[workplaceKey].totalSumtest += sum;

      // const sumOT = parseFloat(employee.accountingRecord?.[0]?.amountOt + (employee.specialDayListWork * employee.specialDayRate) || 0);
      const sumOT = parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplaceKey].totalSumOT += sumOT;

      const spSalaryHardWorkSum = addSalary.reduce((total, item) => {
        if (item.id === "1410") {
          return total + parseFloat(item.SpSalary || 0);
        }
        return total;
      }, 0);
      acc[workplaceKey].totalAmountHardWorking += spSalaryHardWorkSum;

      // acc[workplaceKey].totalSumOT += sumOT;

      // Parse and calculate the value
      // const countSpecialDay = Number(employee.countSpecialDay);
      // const specialDayRate = Number(employee.specialDayRate);

      // console.log('countSpecialDay',countSpecialDay);
      // console.log('specialDayRate',specialDayRate);

      // // Check if countSpecialDay and specialDayRate are valid numbers, otherwise default to 0
      // const parsedCountSpecialDay = isNaN(countSpecialDay) ? 0 : countSpecialDay;
      // const parsedSpecialDayRate = isNaN(specialDayRate) ? 0 : specialDayRate;

      // // Calculate the product and add to the totalCountSpecialDaySumSpecialDayRate
      // acc[workplaceKey].totalCountSpecialDaySumSpecialDayRate += parsedCountSpecialDay * parsedSpecialDayRate;

      // acc[workplaceKey].totalCountSpecialDaySumSpecialDayRate += parseFloat((Number(employee.countSpecialDay) * Number(employee.specialDayRate)) ?? 0); // Add the sum to totalSpSalary

      acc[workplaceKey].totalEmp += 1;

      return acc;
    }, {});
    console.log("groupedByWorkplace", groupedByWorkplace);

    // Loop through the grouped data and add content to the PDF

    let currentY = 20;

    let sumSpSalaryall = 0;
    let sumFormattedAmountHoliday = 0;

    let sumNewamountOt = 0;
    let previousFirstChar = null;
    // Loop through the grouped data and add content to the PDF
    // Object.keys(groupedByWorkplace).forEac h((workplaceKey, index) => {
  
    Object.keys(groupedByWorkplace)
      .sort((a, b) => a.localeCompare(b)) // Sort keys in ascending order
      .forEach((workplaceKey, index) => {
        const {
          employees,
          totalSalary,
          totalAddSalary,
          totalAmountOt,
          totalAmountSpecial,

          totalAmountPosition,
          totalTel,
          totalTravel,

          totalAllAddSalary,
          totalBenefitNonSocial,
          totalAmountSpecialDay,
          totalAmountHardWorking,
          totalAmountHoliday,
          totalAddAmountBeforeTax,
          totalDeductBeforeTax,
          totalTax,
          totalSocialSecurity,
          totalAddAmountAfterTax,
          totalAdvancePayment,
          totalDeductAfterTax,
          totalBank,
          totalTotal,
          totalEmp,
          totalSpSalary,
          totalCountSpecialDaySumSpecialDayRate,

          totalSumAddSalaryBeforeTax,
          totalSumAddSalaryBeforeTaxNonSocial,
          totalSumDeductBeforeTaxWithSocial,
          totalSumDeductBeforeTax,
          totalSumAddSalaryAfterTax,
          totalSumDeductAfterTax,

          totalSumtest,
          totalSumOT,
        } = groupedByWorkplace[workplaceKey];

        // const workplaceDetails = workplaceListAll.find(
        //   (w) => w.workplaceId == workplaceKey
        // ) || { name: "Unknown" };
        // console.log("workplaceDetails", workplaceDetails);
        // const workplaceName = workplaceDetails.workplaceName || "Unknown"; // Use a default value if 'name' is not available

        const workplaceDetails = workplaceListAll.find((w) => {
          // Remove the first character and compare the rest of the strings
          const trimmedWorkplaceId = w.workplaceId.toString().slice(1);
          const trimmedWorkplaceKey = workplaceKey.toString().slice(1);
          return trimmedWorkplaceId === trimmedWorkplaceKey;
        }) || { name: "Unknown" };

        console.log("workplaceDetails", workplaceDetails);

        

    
        const workplaceName = workplaceDetails.workplaceName || "Unknown"; // Use a default value if 'name' is not available

        const currentFirstChar = workplaceKey[0]; // Get the first character
        if (previousFirstChar && previousFirstChar !== currentFirstChar) {
          // If first characters are different, add a new page
          pdf.addPage({ orientation: "landscape" });
          currentY = 20; // Reset Y coordinate for the new page
        }

        previousFirstChar = currentFirstChar;

        // Display workplace heading
        pdf.setFontSize(10);
        pdf.text(
          `${workplaceName} : ${workplaceKey}`,
          startXName + 1,
          currentY
        );
        currentY += 5;

        employees.sort((a, b) => a.employeeId.localeCompare(b.employeeId));

        // Display employee information
        employees.forEach(
          ({
            employeeId,
            lastName,
            name,
            accountingRecord,
            addSalary,
            countSpecialDay,
            specialDayRate,
            specialDayListWork,
          }) => {
            // Check if this is the target employeeId
            // if (employeeId === "650768") {
            //   // Add a new page for this employee
            //   pdf.addPage({ orientation: "landscape" });
            //   currentY = 20; // Reset Y-coordinate for the new page
            // }
            drawID();
            drawName();
            drawAllDay();
            drawSalary();
            drawOT();
            drawWelfare();
            drawRoleWork();
            drawDiligenceAllowance();
            drawHoliday();
            drawAddBeforeDeductTax();
            drawMinuseforeDeductTax();

            drawMinuseforeDeductTax2nd();
            drawAddBeforeDeductTax2nd();

            drawDeductTax();
            drawDeductTaxSocialSecurity();
            drawAddAfterDeductTax();
            drawAdvancePayment();
            drawMinusAfterDeductTax();
            // drawBank();
            drawResult();

            pdf.text(`${employeeId}`, startX, currentY);
            pdf.text(`${name} ${lastName}`, startXName + 1, currentY);

            const countSpecialDayListWork = specialDayListWork.length;
            // const countcal = accountingRecord?.[0]?.countDay - countSpecialDayListWork;
            // const countcal = accountingRecord?.[0]?.countDay;

            const countcal = accountingRecord?.[0]?.countDayWork;

            // pdf.text(`${accountingRecord?.[0]?.countDay} `, startXAllDay + 5, currentY, { align: 'right' });
            pdf.text(`${countcal} `, startXAllDay + 5, currentY, {
              align: "right",
            });

            sumNewamountOt += countSpecialDayListWork * specialDayRate;
            console.log("sumNewamountOt", sumNewamountOt);

            totalBenefitNonSocial;
            console.log("totalBenefitNonSocial", totalBenefitNonSocial);

            // // เงินเดือน
            // const formattedAmountDay = Number(accountingRecord?.[0]?.amountDay ?? 0).toFixed(2);
            // // pdf.text(`${formattedAmountDay}`, pdf.internal.pageSize.width - 10, currentY, { align: 'right' });
            // pdf.text(`${formattedAmountDay}`, 85, currentY, { align: 'right' });
            // // ค่าล่วงเวลา
            // const formattedAmountOt = Number(accountingRecord.amountOt ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountOt}`, 98, currentY, { align: 'right' });
            // // สวัสดิการพิเศษ
            // // ค่ารถ/โทร/ตน.
            // const formattedAmountSpecial = Number(accountingRecord.amountSpecial ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountSpecial}`, 113, currentY, { align: 'right' });
            // // สวัสดิการ(ไม่คิด ปกส)
            // const formattedAmountPosition = Number(accountingRecord.amountPosition ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountPosition}`, 128, currentY, { align: 'right' });
            // // เบี้ยขยัน
            // const formattedAmountHardWorking = Number(accountingRecord.amountHardWorking ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountHardWorking}`, 143, currentY, { align: 'right' });
            // // บวกอื่นๆก่อน
            // const formattedAmountHoliday = Number(accountingRecord.amountHoliday ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountHoliday}`, 158, currentY, { align: 'right' });
            // // หักอื่นๆก่อน
            // const formattedDeductBeforeTax = Number(accountingRecord.deductBeforeTax ?? 0).toFixed(2);
            // pdf.text(`${formattedDeductBeforeTax}`, 173, currentY, { align: 'right' });
            // // หักภาษี
            // const formattedAddAmountBeforeTax = Number(accountingRecord.addAmountBeforeTax ?? 0).toFixed(2);
            // pdf.text(`${formattedAddAmountBeforeTax}`, 188, currentY, { align: 'right' });
            // // หัก ปกส
            // const formattedTax = Number(accountingRecord.tax ?? 0).toFixed(2);
            // pdf.text(`${formattedTax}`, 203, currentY, { align: 'right' });
            // // บวกอื่นๆหลัง
            // // const formattedSocialSecurity = Number(accountingRecord.socialSecurity ?? 0).toFixed(2);
            // const formattedSocialSecurity = Number(accountingRecord.socialSecurity ?? 0).toFixed(0);
            // pdf.text(`${formattedSocialSecurity}`, 218, currentY, { align: 'right' });
            // // หักอื่นๆหลัง
            // const formattedAddAmountAfterTax = Number(accountingRecord.addAmountAfterTax ?? 0).toFixed(2);
            // pdf.text(`${formattedAddAmountAfterTax}`, 233, currentY, { align: 'right' });
            // // เบิกล่วงหน้า
            // const formattedAdvancePayment = Number(accountingRecord.advancePayment ?? 0).toFixed(2);
            // pdf.text(`${formattedAdvancePayment}`, 248, currentY, { align: 'right' });
            // // หักหลังภาษี
            // // const formattedDeductAfterTax = Number(accountingRecord.deductAfterTax ?? 0).toFixed(2);
            // // pdf.text(`${formattedDeductAfterTax}`, 263, currentY, { align: 'right' });
            // // ธ โอน/
            // // const formattedBank = Number(accountingRecord.bank ?? 0).toFixed(2);
            // // pdf.text(`${formattedBank}`, 278, currentY, { align: 'right' });
            // // สุทธิ
            // const formattedTotal = Number(accountingRecord.total ?? 0).toFixed(2);
            // pdf.text(`${formattedTotal}`, 293, currentY, { align: 'right' });

            // // const formattedAmountOt = accountingRecord.amountOt.toFixed(2);
            // // pdf.text(`${formattedAmountOt}`, 102, currentY, { align: 'right' });

            // const addSalary = [
            //     {
            //         "id": "1250",
            //         "name": "",
            //         "SpSalary": "123",
            //         "roundOfSalary": "",
            //         "StaffType": "",
            //         "nameType": "",
            //         "message": "",
            //         "_id": "65df89794d2c06761d421844"
            //     },
            //     {
            //         "id": "1555",
            //         "name": "",
            //         "SpSalary": "100",
            //         // other properties...
            //     },
            //     {
            //         "id": "1855",
            //         "name": "",
            //         "SpSalary": "100",
            //         // other properties...
            //     },
            //     // other objects...
            // ];

            // เงินเดือน
            const formattedSumFormattedAmountHoliday =
              sumFormattedAmountHoliday.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

            // const formattedAmountDay = Number(accountingRecord.amountDay ?? 0).toFixed(2);
            const formattedAmountDay = Number(
              accountingRecord?.[0]?.amountCountDayWork ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            // pdf.text(`${formattedAmountDay}`, pdf.internal.pageSize.width - 10, currentY, { align: 'right' });
            pdf.text(`${formattedAmountDay}`, startXSalary + 16, currentY, {
              align: "right",
            });

            // ค่าล่วงเวลา
            // const formattedAmountOt = Number(accountingRecord.amountOt + (countSpecialDayListWork * specialDayRate) ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedAmountOt = Number(
              accountingRecord?.[0]?.amountCountDayWorkOt ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            pdf.text(`${formattedAmountOt}`, startXOT + cellWidthOT, currentY, {
              align: "right",
            });
            // sumNewamountOt += parseFloat(formattedAmountOt);
            // console.log('formattedAmountOt',formattedAmountOt);
            // console.log('sumNewamountOt',sumNewamountOt);

            // สวัสดิการพิเศษ
            // ค่ารถ/โทร/ตน.
            // const formattedAmountSpecial = Number(accountingRecord.amountSpecial ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountSpecial}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });

            ////////
            const filteredSalary = addSalary.filter(
              (item) =>
                item.id === "1230" || item.id === "1520" || item.id === "1350"
            );
            // Calculate the sum of SpSalary values in the filtered array

            // const sumSpSalary = filteredSalary.reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
            const sumSpSalary = filteredSalary.reduce((total, item) => {
              // Parse the SpSalary value to a number
              const spSalary = parseFloat(item.SpSalary || 0);

              // If SpSalary is greater than 100, divide it by 30, otherwise, keep the original value
              const adjustedSpSalary =
                spSalary > 100 ? spSalary / 30 : spSalary;

              // Add the adjusted SpSalary to the total
              return total + adjustedSpSalary;
            }, 0);
            // Now you can use sumSpSalary wherever you need to display the total sum, for example:

            const total =
              parseFloat(accountingRecord?.[0]?.amountPosition || 0) +
              parseFloat(accountingRecord?.[0]?.tel || 0) +
              parseFloat(accountingRecord?.[0]?.travel || 0);
            const formattedTotalSalary = total.toFixed(2);

            pdf.text(
              `${formattedTotalSalary}`,
              startXWelfare + cellWidthWelfare,
              currentY,
              { align: "right" }
            );

            // sumSpSalaryall += (totalAddSalary * accountingRecord.countDay);

            // สวัสดิการ(ไม่คิด ปกส)
            const formattedAmountPosition = Number(
              accountingRecord?.[0]?.benefitNonSocial ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedAmountPosition}`,
              startXRoleWork + cellWidthRoleWork,
              currentY,
              { align: "right" }
            );

            // เบี้ยขยัน
            // const formattedAmountHardWorking = Number(accountingRecord.amountHardWorking ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountHardWorking}`, 85 + (cellWidthOT * 4), currentY, { align: 'right' });
            /////////
            const formattedAmountHardWorking = addSalary.filter(
              (item) => item.id === "1410"
            );
            // Calculate the sum of SpSalary values in the filtered array
            const sumAmountHardWorking = formattedAmountHardWorking.reduce(
              (total, item) => total + parseFloat(item.SpSalary || 0),
              0
            );
            // Now you can use sumSpSalary wherever you need to display the total sum, for example:
            pdf.text(
              `${sumAmountHardWorking.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              startXDiligenceAllowance + cellWidthDiligenceAllowance,
              currentY,
              { align: "right" }
            );

            // นักขัติ
            // const formattedAmountHoliday = Number(accountingRecord.amountHoliday ?? 0).toFixed(2);
            // pdf.text(`${formattedAmountHoliday}`, 85 + (cellWidthOT * 5), currentY, { align: 'right' });
            // const formattedAmountHoliday = Number(((countSpecialDay - countSpecialDayListWork) * specialDayRate) ?? 0);
            // const formattedAmountSpecialDay = responseDataAll.map(item => {
            //     const amountSpecialDay = Number(item.accountingRecord.amountSpecialDay ?? 0);
            //     return amountSpecialDay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // });
            const formattedAmountSpecialDay = Number(
              accountingRecord?.[0]?.amountSpecialDay ?? 0
            );

            pdf.text(
              `${formattedAmountSpecialDay.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              startXHoliday + cellWidthHoliday,
              currentY,
              { align: "right" }
            );

            sumFormattedAmountHoliday += formattedAmountSpecialDay;
            console.log("countSpecialDay", countSpecialDay);
            console.log("specialDayRate", specialDayRate);
            console.log("countSpecialDayListWork", countSpecialDayListWork);

            // บวกอื่นๆ
            // sumAddSalaryBeforeTax
            // const formattedAddAmountBeforeTax = Number(accountingRecord.addAmountBeforeTax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // pdf.text(`${formattedAddAmountBeforeTax}`,
            //     startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax, currentY, { align: 'right' });

            const formattedSumAddSalaryBeforeTax = Number(
              accountingRecord?.[0]?.sumAddSalaryBeforeTax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumAddSalaryBeforeTax}`,
              startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax,
              currentY,
              { align: "right" }
            );

            // หักอื่นๆ
            // sumDeductBeforeTaxWithSocial
            // const formattedDeductBeforeTax = Number(accountingRecord.deductBeforeTax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // pdf.text(`${formattedDeductBeforeTax}`,
            //     startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax, currentY, { align: 'right' });

            const formattedSumDeductBeforeTaxWithSocial = Number(
              accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumDeductBeforeTaxWithSocial}`,
              startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax,
              currentY,
              { align: "right" }
            );

            // บวกอื่นๆ อันที่2
            //  const formattedAddAmountBeforeTax = Number(accountingRecord.addAmountBeforeTax ?? 0).toFixed(2);
            const formattedSumAddSalaryBeforeTaxNonSocial = Number(
              accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumAddSalaryBeforeTaxNonSocial.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}`,
              startXAddBeforeDeductTax2nd + cellWidthAddBeforeDeductTax2nd,
              currentY,
              { align: "right" }
            );

            // หักอื่นๆ  อันที่2
            //  const formattedDeductBeforeTax = Number(accountingRecord.deductBeforeTax ?? 0).toFixed(2);
            const formattedSumDeductBeforeTax = Number(
              accountingRecord?.[0]?.sumDeductBeforeTax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumDeductBeforeTax.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              startXMinusBeforeDeductTax2nd + cellWidthMinusBeforeDeductTax2nd,
              currentY,
              { align: "right" }
            );

            // หักภาษี ทดล
            const formattedTax = Number(
              sumCashWork
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedTax}`,
              startXDeductTax + cellWidthDeductTax,
              currentY,
              { align: "right" }
            );

            //  หัก ปกส
            // const formattedSocialSecurity = Number(accountingRecord.socialSecurity ?? 0).toFixed(2);
            const formattedSocialSecurity = Number(
              accountingRecord?.[0]?.socialSecurity ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            pdf.text(
              `${formattedSocialSecurity}`,
              startXDeductTaxSocialSecurity + cellWidthDeductTaxSocialSecurity,
              currentY,
              { align: "right" }
            );

            // บวกอื่นๆหลัง
            const formattedAddAmountAfterTax = Number(accountingRecord.addAmountAfterTax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            pdf.text(`${formattedAddAmountAfterTax}`,
              startXAddAfterDeductTax + cellWidthAddAfterDeductTax, currentY, { align: 'right' });
            const formattedSumAddSalaryAfterTax = Number(
              accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            // pdf.text(
            //   `${formattedSumAddSalaryAfterTax}`,
            //   startXAddAfterDeductTax + cellWidthAddAfterDeductTax,
            //   currentY,
            //   { align: "right" }
            // );

            // หักอื่นๆหลัง
            // const formattedDeductAfterTax = Number(accountingRecord.deductAfterTax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // pdf.text(`${formattedDeductAfterTax}`,
            //     startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax, currentY, { align: 'right' });
            const formattedSumDeductAfterTax = Number(
              accountingRecord?.[0]?.sumDeductAfterTax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumDeductAfterTax}`,
              startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax,
              currentY,
              { align: "right" }
            );

            // เบิกล่วงหน้า
            const formattedAdvancePayment = Number(
              accountingRecord?.[0]?.advancePayment ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedAdvancePayment}`,
              startXAdvancePayment + cellWidthAdvancePayment,
              currentY,
              { align: "right" }
            );
            // ธ โอน/
            // const formattedBank = Number(accountingRecord.bank ?? 0).toFixed(2);
            // pdf.text(`${formattedBank}`, 278, currentY, { align: 'right' });

            // สุทธิ
            const formattedTotal = Number(
              accountingRecord?.[0]?.total ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedTotal}`,
              startXResult + cellWidthResult,
              currentY,
              { align: "right" }
            );

            // const formattedAmountOt = accountingRecord.amountOt.toFixed(2);
            // pdf.text(`${formattedAmountOt}`, 102, currentY, { align: 'right' });

            currentY += 5;

            pdf.text(
              `พิมพ์วัหกด่ฟหรสร่นที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543
              }`,
              10,
              200
            );
            pdf.text(`รายงานโดย ${present}`, 100, 200);
            pdf.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);

            // Check if there's not enough space on the current page
            if (currentY > pdf.internal.pageSize.height - 20) {
              // Add a new page
              pdf.addPage({ orientation: "landscape" });
              // Reset Y coordinate
              currentY = 20;
            }
          }
        );

        // Display total salary

        const x1 = 20;
        const y1 = 20;
        const x2 = 100;
        const y2 = 20;

        // Draw the line
        pdf.line(
          cellWidthAllDay + startXAllDay - 6,
          currentY - 3,
          295,
          currentY - 3
        );

        pdf.text(`รวมแผนก`, startX, currentY);

        // pdf.text(`${workplaceName} : ${workplaceKey}`, startXName + 1, currentY);
        pdf.text(`${workplaceKey} `, startXName + 1, currentY);

        pdf.text(`${totalEmp} คน`, startXAllDay + 5, currentY, {
          align: "right",
        });

        // pdf.text(`${totalSalary.toFixed(2)}`, 85, currentY, { align: 'right' });
        // pdf.text(`${totalAmountOt.toFixed(2)}`, 85 + (cellWidthOT), currentY, { align: 'right' });
        // pdf.text(`${totalAmountSpecial.toFixed(2)}`, 113, currentY, { align: 'right' });
        // pdf.text(`${totalAmountPosition.toFixed(2)}`, 128, currentY, { align: 'right' });
        // pdf.text(`${totalAmountHardWorking.toFixed(2)}`, 143, currentY, { align: 'right' });
        // pdf.text(`${totalAmountHoliday.toFixed(2)}`, 158, currentY, { align: 'right' });
        // pdf.text(`${totalAddAmountBeforeTax.toFixed(2)}`, 173, currentY, { align: 'right' });
        // pdf.text(`${totalDeductBeforeTax.toFixed(2)}`, 188, currentY, { align: 'right' });
        // pdf.text(`${totalTax.toFixed(0)}`, 203, currentY, { align: 'right' });
        // pdf.text(`${totalSocialSecurity.toFixed(2)}`, 218, currentY, { align: 'right' });
        // pdf.text(`${totalAddAmountAfterTax.toFixed(2)}`, 233, currentY, { align: 'right' });
        // pdf.text(`${totalAdvancePayment.toFixed(2)}`, 248, currentY, { align: 'right' });
        // // pdf.text(`${totalDeductAfterTax.toFixed(2)}`, 263, currentY, { align: 'right' });
        // // pdf.text(`${totalBank.toFixed(2)}`, 278, currentY, { align: 'right' });
        // pdf.text(`${totalTotal.toFixed(2)}`, 293, currentY, { align: 'right' });

        // เงินเดือน
        // pdf.text(`${totalSalary.toFixed(2)}`, startXSalary + 16, currentY, { align: 'right' });
        // pdf.text(`${totalSalary.toFixed(2)}`, startXSalary + 16, currentY, { align: 'right' });
        // Format totalSalary with commas for thousands
        const totalSalarytest = 100000000;
        const formattedTotalSalary = totalSalary.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        // Display the formatted totalSalary with commas
        pdf.text(`${formattedTotalSalary}`, startXSalary + 16, currentY, {
          align: "right",
        });

        // ค่าล่วงเวลา
        // pdf.text(`${totalAmountOt.toFixed(2)}`, startXOT + cellWidthOT, currentY, { align: 'right' });
        // const formattedTotalAmountOt = totalAmountOt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // const formattedTotalAmountOt = (totalAmountOt + sumNewamountOt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // // Display the formatted totalSalary with commas
        // console.log('sumNewamountOt', sumNewamountOt);
        // pdf.text(`${formattedTotalAmountOt}`, startXOT + cellWidthOT, currentY, { align: 'right' });

        // totalSumOT
        const formattedTotalAmountOt = totalSumOT.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        // Display the formatted totalSalary with commas
        console.log("sumNewamountOt", sumNewamountOt);
        pdf.text(
          `${formattedTotalAmountOt}`,
          startXOT + cellWidthOT,
          currentY,
          { align: "right" }
        );

        //ค่ารถ โทร ตำแหน่ง
        // pdf.text(`${totalAmountSpecial.toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });
        // pdf.text(`${Number(totalSpSalary * totalCountDay).toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });
        // console.log('totalSpSalary', totalSpSalary)
        // console.log('accountingRecord.countDay', totalCountDay)
        // sumSpSalaryall

        // pdf.text(`${Number(sumSpSalaryall).toFixed(2)}`, startXWelfare + cellWidthWelfare, currentY, { align: 'right' });
        // const formattedSumSpSalaryall = sumSpSalaryall.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // // Display the formatted totalSalary with commas
        // pdf.text(`${formattedSumSpSalaryall}`, startXWelfare + cellWidthWelfare, currentY, { align: 'right' });
        // totalAllAddSalary
        const formattedTotalAllAddSalary = totalAllAddSalary.toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
        // Display the formatted totalSalary with commas

        const total =
          parseFloat(totalAmountPosition || 0) +
          parseFloat(totalTel || 0) +
          parseFloat(totalTravel || 0);
        const formattedTotalSalaryAll = total.toFixed(2);

        pdf.text(
          `${formattedTotalSalaryAll}`,
          startXWelfare + cellWidthWelfare,
          currentY,
          { align: "right" }
        );

        //สวัสดิการ
        const formattedTotalBenefitNonSocial =
          totalBenefitNonSocial.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalBenefitNonSocial}`,
          startXRoleWork + cellWidthRoleWork,
          currentY,
          { align: "right" }
        );

        // เบี้ยขยัน
        const formattedTotalAmountHardWorking =
          totalAmountHardWorking.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalAmountHardWorking}`,
          startXDiligenceAllowance + cellWidthDiligenceAllowance,
          currentY,
          { align: "right" }
        );

        // นักขัติ
        // pdf.text(`${totalAmountHoliday.toFixed(2)}`, 85 + (cellWidthOT * 5), currentY, { align: 'right' });
        // const formattedSumFormattedAmountHoliday = sumFormattedAmountHoliday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedSumFormattedAmountHoliday =
          totalAmountSpecialDay.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

        pdf.text(
          `${formattedSumFormattedAmountHoliday}`,
          startXHoliday + cellWidthHoliday,
          currentY,
          { align: "right" }
        );
        // totalSum
        // บวกอื่นๆ
        // const formattedTotalAddAmountBeforeTax = totalAddAmountBeforeTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalAddAmountBeforeTax =
          totalSumAddSalaryBeforeTax.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalAddAmountBeforeTax}`,
          startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ totalSumDeductBeforeTaxWithSocial
        // const formattedTotalDeductBeforeTax = totalDeductBeforeTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalSumDeductBeforeTaxWithSocial =
          totalSumDeductBeforeTaxWithSocial.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalSumDeductBeforeTaxWithSocial}`,
          startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax,
          currentY,
          { align: "right" }
        );

        // บวกอื่นๆ อันที่ 2 totalSumAddSalaryBeforeTaxNonSocial
        // const formattedTotalAddAmountBeforeTax = totalAddAmountBeforeTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalAddAmountBeforeTax2nd =
          totalSumAddSalaryBeforeTaxNonSocial.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalAddAmountBeforeTax2nd}`,
          startXAddBeforeDeductTax2nd + cellWidthAddBeforeDeductTax2nd,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ อันที่ 2
        // const formattedTotalDeductBeforeTax = totalDeductBeforeTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalDeductBeforeTax2nd =
          totalSumDeductBeforeTax.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalDeductBeforeTax2nd}`,
          startXMinusBeforeDeductTax2nd + cellWidthMinusBeforeDeductTax2nd,
          currentY,
          { align: "right" }
        );

        // หักภาษี
        const formattedTotalTax = totalTax.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        pdf.text(
          `${formattedTotalTax}`,
          startXDeductTax + cellWidthDeductTax,
          currentY,
          { align: "right" }
        );

        // หักปกส
        const formattedTotalSocialSecurity = totalSocialSecurity.toLocaleString(
          "en-US",
          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
        );
        pdf.text(
          `${formattedTotalSocialSecurity}`,
          startXDeductTaxSocialSecurity + cellWidthDeductTaxSocialSecurity,
          currentY,
          { align: "right" }
        );

        // บวกอื่นๆ
        // const formattedTotalAddAmountAfterTax = totalAddAmountAfterTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalAddAmountAfterTax =
          totalSumAddSalaryAfterTax.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalAddAmountAfterTax}`,
          startXAddAfterDeductTax + cellWidthAddAfterDeductTax,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ
        // const formattedTotalDeductAfterTax = totalDeductAfterTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedTotalDeductAfterTax =
          totalSumDeductAfterTax.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        pdf.text(
          `${formattedTotalDeductAfterTax}`,
          startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax,
          currentY,
          { align: "right" }
        );

        // เบิกล่วงหน้า
        const formattedTotalAdvancePayment = totalAdvancePayment.toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
        pdf.text(
          `${formattedTotalAdvancePayment}`,
          startXAdvancePayment + cellWidthAdvancePayment,
          currentY,
          { align: "right" }
        );

        // pdf.text(`${totalBank.toFixed(2)}`, 278, currentY, { align: 'right' });

        // สุทธิ
        // const formattedTotalTotal = totalTotal.toLocaleString('en-US', { minimumFractionDigits: 1 });
        // // pdf.text(`${formattedTotalTotal}`, startXResult + cellWidthResult, currentY, { align: 'right' });
        // pdf.text(`${formattedTotalTotal}`, 50, 50, { align: 'right' });
        // const totalTotal = 1234.56789; // Example totalTotal value
        const formattedTotalTotal = totalTotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        // Display the formatted totalTotal with exactly two decimal places
        pdf.text(
          `${formattedTotalTotal}`,
          startXResult + cellWidthResult,
          currentY,
          { align: "right" }
        );

        currentY += 5;

        // Add some space between workplaces
        pdf.text(
          `พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543
          }`,
          10,
          200
        );
        pdf.text(`รายงานโดย ${present}`, 100, 200);
        pdf.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);

        // Add a new page for the next workplace, if any
        // if (index < Object.keys(groupedByWorkplace).length - 1) {
        //   pdf.addPage({ orientation: 'landscape' });
        //   currentY = 20;
        // }
      });

    // Save or display the PDF
    window.open(pdf.output("bloburl"), "_blank");
  };
  ////////////////////////////////////////////////////////////////////////////////////////

const generatePDF02 = async () => {
  try {
    // ตรวจสอบว่ามีการกรอกเดือนและปีครบถ้วนหรือไม่ (ไม่จำเป็นต้องมี workplacrId)
    if (!month || !year) {
      alert('กรุณากรอกเดือนและปี');
      return;
    }

    // แสดง loading indicator
    setLoadingEmployees(true);
    
    let fetchedData;
    
    // ถ้ามีการระบุ workplacrId ให้ดึงข้อมูลเฉพาะหน่วยงานนั้น
    // มิฉะนั้นดึงข้อมูลทั้งหมด
    if (workplacrId) {
      fetchedData = await fetchEmployeeData();
      
      if (!fetchedData || fetchedData.length === 0) {
        alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
        setLoadingEmployees(false);
        return;
      }
    } else {
      // ดึงข้อมูลทุกหน่วยงาน
      fetchedData = await fetchAllWorkplaceData();
      
      if (!fetchedData || !fetchedData.groups || fetchedData.groups.length === 0) {
        alert('ไม่พบข้อมูลที่ตรงกับเงื่อนไข');
        setLoadingEmployees(false);
        return;
      }
      
      // เพิ่มการ log เพื่อตรวจสอบข้อมูลที่ได้
      console.log('fetchedData for all workplaces:', fetchedData);
      
      // แสดงจำนวนข้อมูลที่พบ
      console.log(`พบข้อมูลทั้งสิ้น ${fetchedData.groups.length} หน่วยงาน`);
    }

    // สร้างไฟล์ PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: 'mm',
      format: 'a4'
    });
    
    // เพิ่มฟอนต์ไทย
    doc.setFont("THSarabunNew");
    doc.setFontSize(16);

    // กำหนดค่าตัวแปรสำหรับตาราง
    const startY = 10;
    const cellHeight = 9;
    const dataCellHeight = 6;
   // คำนวณความกว้างอัตโนมัติให้เต็มกระดาษ
const totalWidth = 275; // ความกว้างทั้งหมดที่ต้องการ
const numCols = 14; // จำนวนคอลัมน์
const avgWidth = Math.floor(totalWidth / numCols);

const colWidths = [
  12,  // รหัส (ลดจาก 15)
  60,  // ชื่อ-สกุล (ขยายจาก 40) - รวม 275
  8,   // วัน (ลดจาก 10)
  20,  // เงินเดือน (ลดจาก 25)
  18,  // ค่าล่วงเวลา (ลดจาก 20)
  18,  // ค่ารถ/โทร/ตน. (ลดจาก 20)
  18,  // สวัสดิการ(ไม่คิด ปกส.) (ลดจาก 20)
  16,  // เบี้ยขยัน (ลดจาก 18)
  16,  // นักขัตฤกษ์ (ลดจาก 18)
  18,  // บวกอื่นๆ(คิด ปกส) (ลดจาก 20)
  18,  // หักอื่นๆ(คิด ปกส) (ลดจาก 20)
  16,  // หักภาษี (ลดจาก 18)
  16,  // หัก ปกส (ลดจาก 18)
  21   // สุทธิ (ลดจาก 27)
]; // รวม = 275mm
    
    // คำนวณตำแหน่ง x ของแต่ละคอลัมน์
    const colPositions = [];
    let currentX = 3;
    colWidths.forEach(width => {
      colPositions.push(currentX);
      currentX += width;
    });
    
    // ฟังก์ชันสำหรับวาดเซลล์
    const drawCell = (x, y, width, height, text, options = {}) => {
      // วาดขอบเซลล์ (เฉพาะเมื่อ drawBorder=true หรือไม่ได้ระบุ)
      if (options.drawBorder !== false) {
        doc.rect(x, y, width, height);
      }

      // ถ้าไม่มีข้อความให้แสดง ไม่ต้องวาดข้อความ
      if (text === undefined || text === null || text === '') {
        return;
      }
      
      // คำนวณจุดกึ่งกลางของเซลล์
      const centerX = x + width / 2;
      
      // เพิ่ม paddingTop สำหรับหัวตาราง
      const paddingTop = options.isHeader ? 2 : 0;
      const centerY = y + height / 3;

      // กำหนดขนาดตัวอักษรตามที่ระบุ หรือใช้ค่าเริ่มต้น
      const fontSize = options.fontSize || 10;
      doc.setFontSize(fontSize);
      
      // ตั้งค่าฟอนต์ - เฉพาะหัวตารางเท่านั้นที่เป็นตัวหนา
      if (options.isHeader) {
        doc.setFont("THSarabunNew Bold");
      } else {
        doc.setFont("THSarabunNew");
      }

      // กำหนด alignment (default: center)
      const align = options.align || 'center';
      const textOptions = { align: align, baseline: "middle" };

      // ปรับตำแหน่งข้อความตาม alignment
      if (align === 'right') {
        doc.text(text, x + width - 2, centerY, textOptions);
      } else if (align === 'left') {
        doc.text(text, x + 2, centerY, textOptions);
      } else {
        doc.text(text, centerX, centerY, textOptions);
      }
    };
    
    // วาดหัวตาราง
    const headers = [
      "รหัส", "ชื่อหน่วยงาน", "เงินเดือน", "ค่าล่วงเวลา", 
      "ค่ารถ/โทร/\nตน.", "สวัสดิการ\n(ไม่คิด ปกส.)", "เบี้ยขยัน", "นักขัติ", 
      "บวกอื่นๆ\n(คิด ปกส)", "หักอื่นๆ\n(คิด ปกส)", "บวกอื่นๆ\n(ไม่คิด ปกส)", 
      "หักอื่นๆ\n(ไม่คิด ปกส)", "หักภาษี", "หัก ปกส", "บวกอื่นๆ", "หักอื่นๆ", 
      "เบิกล่วงหน้า", "สุทธิ"
    ];
    
    // วาดหัวเรื่อง
    doc.setFontSize(14);
    
    // วาดหัวตาราง
    headers.forEach((header, index) => {
      drawCell(colPositions[index], startY, colWidths[index], cellHeight, header, {
        isHeader: true,
        fontSize: 10
      });
    });
    
    // ตำแหน่งเริ่มต้นสำหรับข้อมูล
    let currentY = startY + cellHeight;
    let pageCount = 1;
    const maxRowsPerPage = 30;
    let rowCount = 0;
    
    // สร้างตัวแปรสำหรับเก็บผลรวมทั้งหมด
    let grandTotals = {
      employees: 0,
      salary: 0,
      ot: 0,
      transportation: 0,
      welfare: 0,
      diligence: 0,
      holiday: 0,
      addBeforeTax: 0,
      deductBeforeTax: 0,
      addNoTax: 0,
      deductNoTax: 0,
      tax: 0,
      socialSecurity: 0,
      addAfterTax: 0,
      deductAfterTax: 0,
      advance: 0,
      net: 0
    };
    
    // ฟังก์ชันเพิ่มหน้าใหม่
    const addNewPage = () => {
      // เพิ่มเลขหน้าที่มุมล่างขวา
      doc.setFontSize(10);
      doc.setFont("THSarabunNew");
      doc.text(`หน้า ${pageCount}`, 280, 200, { align: 'right' });
      
      // สร้างหน้าใหม่
      doc.addPage();
      pageCount++;
      
      // วาดหัวตารางใหม่
      doc.setFontSize(14);
      
      headers.forEach((header, i) => {
        drawCell(colPositions[i], startY, colWidths[i], cellHeight, header, {
          isHeader: true,
          fontSize: 10
        });
      });
      
      // รีเซ็ตตำแหน่ง Y
      currentY = startY + cellHeight;
      rowCount = 0;
    };

    if (workplacrId) {
      // กรณีมีการระบุ workplacrId ทำเหมือนเดิม (แสดงเฉพาะหน่วยงานที่ระบุ)
      const workplace = workplaceListAll.find(w => w.workplaceId === workplacrId) || { workplaceName: 'ไม่ระบุชื่อ' };
      
      // คำนวณค่ารวมต่างๆ
      let totals = {
        employees: displayEmployees.length,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0
      };
      
      // คำนวณผลรวมจากข้อมูลพนักงาน
      displayEmployees.forEach(emp => {
        totals.salary += parseFloat(emp.sumCashWork.replace(/,/g, '') || 0);
        totals.wageRevise += parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
        totals.leaveInLieu += parseFloat(emp.leaveInLieu?.replace(/,/g, '') || 0);
        totals.ot += parseFloat(emp.sumCashOt.replace(/,/g, '') || 0);
        totals.transportation += parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0);
        totals.welfare += parseFloat(emp.welfare?.replace(/,/g, '') || 0);
        totals.diligence += parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
        totals.holiday += parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
        totals.addBeforeTax += parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
        totals.deductBeforeTax += parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
        totals.addNoTax += parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
        totals.deductNoTax += parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
        totals.tax += parseFloat(emp.tax?.replace(/,/g, '') || 0);
        totals.socialSecurity += parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
        totals.addAfterTax += parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
        totals.deductAfterTax += parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
        totals.advance += parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);
        
        // คำนวณยอดเงินสุทธิ
        const salary = parseFloat(emp.sumCashWork.replace(/,/g, '') || 0);
        const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
        const leaveInLieu = parseFloat(emp.leaveInLieu?.replace(/,/g, '') || 0);
        const ot = parseFloat(emp.sumCashOt.replace(/,/g, '') || 0);
        const transportation = parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0);
        const welfare = parseFloat(emp.welfare?.replace(/,/g, '') || 0);
        const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
        const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
        const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
        const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
        const addNoTax = parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
        const deductNoTax = parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
        const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
        const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
        const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
        const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
        const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);

        const net = salary + ot + transportation + welfare + diligence + holiday + 
          addBeforeTax + addNoTax + addAfterTax - 
          deductBeforeTax - deductNoTax - tax - socialSecurity - deductAfterTax - advance;
          
        totals.net += net;
      });
      
      // แสดงข้อมูลหน่วยงาน
      // ตรวจสอบว่าต้องเพิ่มหน้าใหม่หรือไม่
      if (rowCount >= maxRowsPerPage) {
        addNewPage();
      }
      
      // วาดข้อมูลหน่วยงาน
      const rowData = [
        workplacrId || "-",
        workplace.workplaceName || "-",
        formatNumber(totals.salary),
        formatNumber(totals.ot),
        formatNumber(totals.transportation),
        formatNumber(totals.welfare),
        formatNumber(totals.diligence),
        formatNumber(totals.holiday),
        formatNumber(totals.addBeforeTax),
        formatNumber(totals.deductBeforeTax),
        formatNumber(totals.addNoTax),
        formatNumber(totals.deductNoTax),
        formatNumber(totals.tax),
        formatNumber(totals.socialSecurity),
        formatNumber(totals.addAfterTax),
        formatNumber(totals.deductAfterTax),
        formatNumber(totals.advance),
        formatNumber(totals.net)
      ];
      
      // วาดข้อมูลในแต่ละช่อง
      rowData.forEach((data, cellIndex) => {
        // จัดวางข้อความให้ชิดขวาสำหรับข้อมูลตัวเลข
        let alignment = 'center';
        if (cellIndex === 1) {
          alignment = 'left'; // ชื่อหน่วยงานชิดซ้าย
        } else if (cellIndex >= 2) {
          alignment = 'right'; // ตัวเลขชิดขวา
        }
        
        // ไม่แสดงเส้นขอบ
        drawCell(
          colPositions[cellIndex], 
          currentY, 
          colWidths[cellIndex], 
          dataCellHeight, 
          data, 
          { align: alignment, drawBorder: false }
        );
      });
      
      // เลื่อนไปแถวถัดไป
      currentY += dataCellHeight;
      rowCount++;
      
      // เพิ่มเข้าไปในยอดรวมทั้งหมด
      Object.keys(grandTotals).forEach(key => {
        if (key !== 'workplaceCount') {
          grandTotals[key] += totals[key];
        }
      });
      
      // บรรทัดผลรวมทั้งหมด (รวมทุกหน่วยงาน)
      grandTotals.employees = displayEmployees.length; // จำนวนพนักงาน
      
    } else {
      // กรณีไม่มีการระบุ workplacrId ให้แสดงทุกหน่วยงาน
      // คำนวณจำนวนหน่วยงานทั้งหมด
      const workplaceCount = fetchedData.groups.length;
      
      // สร้างตัวแปรสำหรับเก็บผลรวมทั้งหมดของทุกหน่วยงาน
      let totalForAllWorkplaces = {
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0, 
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0,
        employees: 0
      };
      
      // วนลูปสร้างข้อมูลของแต่ละหน่วยงาน
      for (const workplaceId of fetchedData.groups) {
        // ค้นหาข้อมูลหน่วยงานและพนักงาน
        const workplaceData = fetchedData.data[workplaceId] || {};
        const workplace = workplaceListAll.find(w => w.workplaceId == workplaceId) || { workplaceName: 'ไม่ระบุชื่อ' };
        
        console.log(`กำลังแสดงข้อมูลหน่วยงาน: ${workplace.workplaceName} (${workplaceId})`);
        console.log('ข้อมูลของหน่วยงานนี้:', workplaceData);
        
        // ตรวจสอบว่าต้องเพิ่มหน้าใหม่หรือไม่
        if (rowCount >= maxRowsPerPage) {
          addNewPage();
        }
        
        // ข้อมูลต่างๆของหน่วยงาน
        const employees = workplaceData.employees || [];
        
        // ดึงข้อมูลค่าต่างๆจาก workplaceData (ถ้าไม่มีให้ใช้ 0)
        const { 
          totalSalary = 0, 
          totalAmountOt = 0, 
          totalAddSalary = 0, 
          totalBenefitNonSocial = 0,
          totalAmountHardWorking = 0, 
          totalAmountSpecialDay = 0,
          totalSumAddSalaryBeforeTax = 0, 
          totalSumDeductBeforeTaxWithSocial = 0,
          totalSumAddSalaryBeforeTaxNonSocial = 0, 
          totalSumDeductBeforeTax = 0,
          totalTax = 0, 
          totalSocialSecurity = 0, 
          totalSumAddSalaryAfterTax = 0,
          totalAdvancePayment = 0, 
          totalSumDeductAfterTax = 0, 
          totalTotal = 0, 
          totalEmp = 0 
        } = workplaceData;
        
        // คำนวณยอดเงินสุทธิ (ถ้ายังไม่มีค่า)
        const netTotal = totalTotal || (
          (totalSalary || 0) +
          (totalAmountOt || 0) +
          (totalAddSalary || 0) +
          (totalBenefitNonSocial || 0) +
          (totalAmountHardWorking || 0) +
          (totalAmountSpecialDay || 0) +
          (totalSumAddSalaryBeforeTax || 0) +
          (totalSumAddSalaryBeforeTaxNonSocial || 0) +
          (totalSumAddSalaryAfterTax || 0) -
          (totalSumDeductBeforeTaxWithSocial || 0) -
          (totalSumDeductBeforeTax || 0) -
          (totalTax || 0) -
          (totalSocialSecurity || 0) -
          (totalSumDeductAfterTax || 0) -
          (totalAdvancePayment || 0)
        );
        
        // สะสมค่าลงในตัวแปรผลรวมทั้งหมด
        totalForAllWorkplaces.salary += totalSalary || 0;
        totalForAllWorkplaces.ot += totalAmountOt || 0;
        totalForAllWorkplaces.transportation += totalAddSalary || 0;
        totalForAllWorkplaces.welfare += totalBenefitNonSocial || 0;
        totalForAllWorkplaces.diligence += totalAmountHardWorking || 0;
        totalForAllWorkplaces.holiday += totalAmountSpecialDay || 0;
        totalForAllWorkplaces.addBeforeTax += totalSumAddSalaryBeforeTax || 0;
        totalForAllWorkplaces.deductBeforeTax += totalSumDeductBeforeTaxWithSocial || 0;
        totalForAllWorkplaces.addNoTax += totalSumAddSalaryBeforeTaxNonSocial || 0;
        totalForAllWorkplaces.deductNoTax += totalSumDeductBeforeTax || 0;
        totalForAllWorkplaces.tax += totalTax || 0;
        totalForAllWorkplaces.socialSecurity += totalSocialSecurity || 0;
        totalForAllWorkplaces.addAfterTax += totalSumAddSalaryAfterTax || 0;
        totalForAllWorkplaces.deductAfterTax += totalSumDeductAfterTax || 0;
        totalForAllWorkplaces.advance += totalAdvancePayment || 0;
        totalForAllWorkplaces.net += netTotal || 0;
        totalForAllWorkplaces.employees += totalEmp || employees.length || 0;
        
        // แสดงข้อมูลรวมของหน่วยงาน
        console.log(`ยอดรวมเงินเดือนของหน่วยงาน: ${totalSalary}`);
        console.log(`ยอดรวมค่าล่วงเวลาของหน่วยงาน: ${totalAmountOt}`);
        console.log(`ยอดรวมเงินสุทธิของหน่วยงาน: ${netTotal}`);
        
        // วาดข้อมูลหน่วยงาน
        const rowData = [
          workplaceId,
          workplace.workplaceName || "ไม่ระบุชื่อ",
          formatNumber(totalSalary || 0),
          formatNumber(totalAmountOt || 0),
          formatNumber(totalAddSalary || 0),
          formatNumber(totalBenefitNonSocial || 0),
          formatNumber(totalAmountHardWorking || 0),
          formatNumber(totalAmountSpecialDay || 0),
          formatNumber(totalSumAddSalaryBeforeTax || 0),
          formatNumber(totalSumDeductBeforeTaxWithSocial || 0),
          formatNumber(totalSumAddSalaryBeforeTaxNonSocial || 0),
          formatNumber(totalSumDeductBeforeTax || 0),
          formatNumber(totalTax || 0),
          formatNumber(totalSocialSecurity || 0),
          formatNumber(totalSumAddSalaryAfterTax || 0),
          formatNumber(totalSumDeductAfterTax || 0),
          formatNumber(totalAdvancePayment || 0),
          formatNumber(netTotal || 0)
        ];
        
        // วาดข้อมูลในแต่ละช่อง
        rowData.forEach((data, cellIndex) => {
          // จัดวางข้อความให้ชิดขวาสำหรับข้อมูลตัวเลข
          let alignment = 'center';
          if (cellIndex === 1) {
            alignment = 'left'; // ชื่อหน่วยงานชิดซ้าย
          } else if (cellIndex >= 2) {
            alignment = 'right'; // ตัวเลขชิดขวา
          }
          
          // ไม่แสดงเส้นขอบ
          drawCell(
            colPositions[cellIndex], 
            currentY, 
            colWidths[cellIndex], 
            dataCellHeight, 
            data, 
            { align: alignment, drawBorder: false }
          );
        });
        
        // เลื่อนไปแถวถัดไป
        currentY += dataCellHeight;
        rowCount++;
      }
      
      // กำหนดค่า grandTotals ให้เท่ากับ totalForAllWorkplaces
      grandTotals = totalForAllWorkplaces;
    }
    
    // ข้ามไปทำส่วนท้ายของรายงานโดยตรง ไม่แสดงผลรวมทั้งสิ้น
    doc.setFont("THSarabunNew");
    doc.setFontSize(10);
    doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 5, 200);
    doc.text(`รายงานโดย ${present}`, 100, 200);
    doc.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);
    
    // เพิ่มเลขหน้าสุดท้าย
    doc.setFontSize(10);
    doc.text(`หน้า ${pageCount}`, 280, 200, { align: 'right' });
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    
    // บันทึกไฟล์ PDF
    // doc.save(`สรุปรายงานเงินเดือนหน่วยงาน_${month}_${year}.pdf`);
    
    // ซ่อน loading indicator
    setLoadingEmployees(false);
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', error);
    alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    setLoadingEmployees(false);
  }
};
















  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  const generatePDF03 = () => {
    const pdf = new jsPDF({ orientation: "landscape" });

    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    const fontName = "THSarabunNew";

    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, fontName, "normal");

    // Set the font for the document
    pdf.setFont(fontName);

    const pageWidth = pdf.internal.pageSize.width;

    const numRows = 7;
    const numCols = 1;
    const cellWidth = 10;
    const cellHeight = 3.5;
    const startX = 1; // Adjust the starting X-coordinate as needed
    const startY = 55; // Adjust the starting Y-coordinate as needed
    const borderWidth = 0.5; // Adjust the border width as needed

    // Function to draw a cell with borders
    // const drawCell = (x, y, width, height) => {
    //     doc.rect(x, y, width, height);
    // };
    const drawCell = (x, y, width, height, text) => {
      // Draw the cell border
      pdf.rect(x, y, width, height);

      // Calculate the center of the cell
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // Add text to the center of the cell
      pdf.setFontSize(10);

      pdf.text(text, centerX, centerY, { align: "center", valign: "middle" });
    };

    const numRowsTop = 1;
    const startXTop = 50; // Adjust the starting X-coordinate as needed
    const startYTop = 5; // Adjust the starting Y-coordinate as needed
    const cellHeightTop = 10;

    // const drawTableTop = () => {
    //     for (let i = 0; i < numRowsTop; i++) {
    //         for (let j = 0; j < numCols; j++) {
    //             const x = startX + j * cellWidth;
    //             const y = startYTop + i * cellHeightTop;
    //             drawCell(x, y, cellWidth, cellHeightTop);
    //         }
    //     }
    // };

    const drawID = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startX + j * cellWidth;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `รหัส`;
          drawCell(x, y, cellWidth, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthName = 28;
    const startXName = 11; // Adjust the starting X-coordinate as needed
    const startYName = 55; // Adjust the starting Y-coordinate as needed

    const drawName = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXName + j * cellWidthName;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หน่วยงาน`;
          drawCell(x, y, cellWidthName, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidthName, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAllDay = 10;
    const startXAllDay = 63; // Adjust the starting X-coordinate as needed
    const startYAllDay = 55; // Adjust the starting Y-coordinate as needed

    const drawAllDay = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAllDay + j * cellWidthAllDay;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `วัน`;
          drawCell(x, y, cellWidthAllDay, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidthAllDay, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthSalary = 16;
    const startXSalary = 39; // Adjust the starting X-coordinate as needed
    const startYSalary = 55; // Adjust the starting Y-coordinate as needed

    const drawSalary = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXSalary + j * cellWidthSalary;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เงินเดือน`;
          drawCell(x, y, cellWidthSalary, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthOT = 16;
    const startXOT = 39 + cellWidthOT * 1; // Adjust the starting X-coordinate as needed
    const startYOT = 55; // Adjust the starting Y-coordinate as needed

    const drawOT = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXOT + j * cellWidthOT;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าล่วงเวลา`;
          drawCell(x, y, cellWidthOT, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthWelfare = 16;
    // const startXWelfare = 110; // Adjust the starting X-coordinate as needed
    const startXWelfare = 39 + cellWidthOT * 2;
    const startYWelfare = 55; // Adjust the starting Y-coordinate as needed

    const drawWelfare = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXWelfare + j * cellWidthWelfare;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          // const cellText = `สวัสดิการ\nพิเศษ`;
          const cellText = `ค่ารถ/โทร/\nตน.`;

          drawCell(x, y, cellWidthWelfare, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthRoleWork = 16;
    // const startXRoleWork = 130; // Adjust the starting X-coordinate as needed
    const startXRoleWork = 39 + cellWidthOT * 3;
    const startYRoleWork = 55; // Adjust the starting Y-coordinate as needed

    const drawRoleWork = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXRoleWork + j * cellWidthRoleWork;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          // const cellText = `ค่าตำแหน่ง`;
          const cellText = `สวัสดิการ\n(ไม่คิด ปกส.)`;

          drawCell(x, y, cellWidthRoleWork, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDiligenceAllowance = 16;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXDiligenceAllowance = 39 + cellWidthOT * 4;
    const startYDiligenceAllowance = 55; // Adjust the starting Y-coordinate as needed

    const drawDiligenceAllowance = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDiligenceAllowance + j * cellWidthDiligenceAllowance;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เบี้ยขยัน`;
          drawCell(x, y, cellWidthDiligenceAllowance, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthHoliday = 16;
    // const startXHoliday = 150; // Adjust the starting X-coordinate as needed
    const startXHoliday = 39 + cellWidthOT * 5;
    const startYHoliday = 55; // Adjust the starting Y-coordinate as needed

    const drawHoliday = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXHoliday + j * cellWidthHoliday;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `นักขัติ`;
          drawCell(x, y, cellWidthHoliday, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddBeforeDeductTax = 16;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 39 + cellWidthOT * 6;
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(คิด ปกส)`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 16;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax = 39 + cellWidthOT * 7;
    const startYMinusBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusBeforeDeductTax + j * cellWidthMinusBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\n(คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthMinusBeforeDeductTax,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddBeforeDeductTax2nd = 16;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax2nd = 39 + cellWidthOT * 8;
    const startYAddBeforeDeductTax2nd = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax2nd = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXAddBeforeDeductTax2nd + j * cellWidthAddBeforeDeductTax2nd;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(ไม่คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthAddBeforeDeductTax2nd,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax2nd = 16;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax2nd = 39 + cellWidthOT * 9;
    const startYMinusBeforeDeductTax2nd = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax2nd = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusBeforeDeductTax2nd +
            j * cellWidthMinusBeforeDeductTax2nd;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\n(ไม่คิด ปกส)`;
          drawCell(
            x,
            y,
            cellWidthMinusBeforeDeductTax2nd,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDeductTax = 16;
    // const startXDeductTax = 210; // Adjust the starting X-coordinate as needed
    const startXDeductTax = 39 + cellWidthOT * 10;
    const startYDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDeductTax + j * cellWidthDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักภาษี`;
          drawCell(x, y, cellWidthDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDeductTaxSocialSecurity = 16;
    // const startXDeductTaxSocialSecurity = 230; // Adjust the starting X-coordinate as needed
    const startXDeductTaxSocialSecurity = 39 + cellWidthOT * 11;
    const startYDeductTaxSocialSecurity = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTaxSocialSecurity = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXDeductTaxSocialSecurity +
            j * cellWidthDeductTaxSocialSecurity;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หัก ปกส`;
          drawCell(
            x,
            y,
            cellWidthDeductTaxSocialSecurity,
            cellHeightTop,
            cellText
          );
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddAfterDeductTax = 16;
    // const startXAddAfterDeductTax = 250; // Adjust the starting X-coordinate as needed
    const startXAddAfterDeductTax = 39 + cellWidthOT * 12;
    const startYAddAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddAfterDeductTax + j * cellWidthAddAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ`;
          drawCell(x, y, cellWidthAddAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusAfterDeductTax = 16;
    // const startXMinusAfterDeductTax = 290; // Adjust the starting X-coordinate as needed
    const startXMinusAfterDeductTax = 39 + cellWidthOT * 13;
    const startYMinusAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinusAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x =
            startXMinusAfterDeductTax + j * cellWidthMinusAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `เบิกบ่วงหน้า`;
          drawCell(x, y, cellWidthMinusAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAdvancePayment = 16;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 39 + cellWidthOT * 14;
    const startYAdvancePayment = 55; // Adjust the starting Y-coordinate as needed

    const drawAdvancePayment = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAdvancePayment + j * cellWidthAdvancePayment;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ`;
          drawCell(x, y, cellWidthAdvancePayment, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthBank = 16;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 39 + cellWidthOT * 15;
    const startYBank = 55; // Adjust the starting Y-coordinate as needed

    const drawBank = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXBank + j * cellWidthBank;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าธนาคาร\nโอน`;
          drawCell(x, y, cellWidthBank, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthResult = 16;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 39 + cellWidthOT * 15;
    const startYResult = 55; // Adjust the starting Y-coordinate as needed

    const drawResult = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXResult + j * cellWidthResult;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `สุทธิ`;
          drawCell(x, y, cellWidthResult, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const groupedByWorkplace = responseDataAllLeaveSalary.reduce((acc, employee) => {
      const { workplace } = employee;
      // const isWasana = employee.name === "วาสนา" || employee.name === "ฐิติรัตน์";
      // const workplaceKey = isWasana
      //   ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
      //   : employee.workplace;
      const matchingEmployee = employeeList.find(
        (e) => e.employeeId === employee.employeeId
      );

      // Check if the costtype is "ภ.ง.ด.3"
      const hasSpecificCostType = matchingEmployee?.costtype === "ภ.ง.ด.3";

      // Determine the workplaceKey
      const workplaceKey = hasSpecificCostType
        ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
        : employee.workplace;

      acc[workplaceKey] = acc[workplaceKey] || {
        employees: [],
        //  totalSalary: 0, totalAmountOt: 0,
        // totalAmountSpecial: 0, totalAmountPosition: 0
        // , totalAmountHardWorking: 0, totalAmountHoliday: 0, totalDeductBeforeTax: 0, totalAddAmountBeforeTax: 0,
        // totalTax: 0, totalSocialSecurity: 0, totalAddAmountAfterTax: 0, totalAdvancePayment: 0
        // , totalDeductAfterTax: 0, totalBank: 0, totalTotal: 0, totalEmp: 0
        totalCountDay: 0,
        totalSalary: 0,
        totalAmountOt: 0,
        totalAmountSpecial: 0,
        // totalAmountPosition: 0,

        totalAmountPosition: 0,
        totalTel: 0,
        totalTravel: 0,
        totalAddSalary: 0,

        totalAmountHardWorking: 0,
        totalAmountHoliday: 0,
        totalAmountSpecialDay: 0,

        totalDeductBeforeTax: 0,
        totalAddAmountBeforeTax: 0,
        totalTax: 0,
        totalSocialSecurity: 0,
        totalAddAmountAfterTax: 0,
        totalAdvancePayment: 0,
        totalDeductAfterTax: 0,
        totalBank: 0,
        totalTotal: 0,
        totalEmp: 0,
        totalSpSalary: 0, // Add a new property for sum of SpSalary
        totalCountSpecialDay: 0,

        totalSumAddSalaryBeforeTax: 0,
        totalSumAddSalaryBeforeTaxNonSocial: 0,
        totalSumDeductBeforeTaxWithSocial: 0,
        totalSumDeductBeforeTax: 0,
        totalSumAddSalaryAfterTax: 0,
        totalSumDeductAfterTax: 0,
      };
      acc[workplaceKey].employees.push(employee);
      // acc[workplaceKey].name.push(employee.name);

      // Adjust this line based on your specific structure to get the salary or any other relevant data
      acc[workplaceKey].totalSalary += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWork || 0
      );
      // acc[workplaceKey].totalAmountOt += parseFloat(employee.accountingRecord?.[0]?.amountOt || 0);
      const sumOT = parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplaceKey].totalAmountOt += sumOT;

      // acc[workplaceKey].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);
      // acc[workplaceKey].totalTel += parseFloat(employee.accountingRecord?.[0]?.tel || 0);
      // acc[workplaceKey].totalTravel += parseFloat(employee.accountingRecord?.[0]?.travel || 0);
      const totalAmountPositio = parseFloat(
        employee.accountingRecord?.[0]?.amountPosition || 0
      );
      const totalTel = parseFloat(employee.accountingRecord?.[0]?.tel || 0);
      const totalTravel = parseFloat(
        employee.accountingRecord?.[0]?.travel || 0
      );

      acc[workplaceKey].totalAmountPositio += totalAmountPositio;
      acc[workplaceKey].totalTel += totalTel;
      acc[workplaceKey].totalTravel += totalTravel;
      acc[workplaceKey].totalAddSalary +=
        totalAmountPositio + totalTel + totalTravel;

      acc[workplaceKey].totalAmountSpecial += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecial || 0
      );
      acc[workplaceKey].totalAmountPosition += parseFloat(
        employee.accountingRecord?.[0]?.benefitNonSocial || 0
      );
      acc[workplaceKey].totalAmountHardWorking += parseFloat(
        employee.accountingRecord?.[0]?.amountHardWorking || 0
      );
      acc[workplaceKey].totalAmountHoliday += parseFloat(
        employee.accountingRecord?.[0]?.amountHoliday || 0
      );
      acc[workplaceKey].totalAmountSpecialDay += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecialDay || 0
      );

      acc[workplaceKey].totalDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.deductBeforeTax || 0
      );
      acc[workplaceKey].totalAddAmountBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
      );
      acc[workplaceKey].totalTax += parseFloat(
        employee.accountingRecord?.[0]?.tax || 0
      );
      acc[workplaceKey].totalSocialSecurity += parseFloat(
        employee.accountingRecord?.[0]?.socialSecurity || 0
      );
      acc[workplaceKey].totalAddAmountAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountAfterTax || 0
      );
      acc[workplaceKey].totalAdvancePayment += parseFloat(
        employee.accountingRecord?.[0]?.advancePayment || 0
      );
      acc[workplaceKey].totalDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.deductAfterTax || 0
      );
      acc[workplaceKey].totalBank += parseFloat(
        employee.accountingRecord?.[0]?.bank || 0
      );
      acc[workplaceKey].totalTotal += parseFloat(
        employee.accountingRecord?.[0]?.total ?? 0
      );

      acc[workplaceKey].totalSumAddSalaryBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
      );
      acc[workplaceKey].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
      );
      acc[workplaceKey].totalSumDeductBeforeTaxWithSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial || 0
      );
      acc[workplaceKey].totalSumDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTax || 0
      );
      acc[workplaceKey].totalSumAddSalaryAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryAfterTax || 0
      );
      acc[workplaceKey].totalSumDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductAfterTax || 0
      );
      // amountSpecialDay

      acc[workplaceKey].totalEmp += 1;

      return acc;
    }, {});


    console.log('groupedByWorkplace02', groupedByWorkplace);
    // Loop through the grouped data and add content to the PDF
    let currentY = 20;

    // Loop through the grouped data and add content to the PDF
    // Object.keys(groupedByWorkplace).forEach((workplaceKey, index) => {
    let totalSalarySum = 0; // Add a variable to hold the sum of totalSalary

    let totalAmountOtSum = 0;
    let totalAmountSpecialSum = 0;
    let totalAmountPositionSum = 0;
    let totalAddSalary = 0;

    let totalAmountHardWorkingSum = 0;
    let totalAmountHolidaySum = 0;
    let totalAmountSpecialDaySum = 0;

    let totalAddAmountBeforeTaxSum = 0;
    let totalDeductBeforeTaxSum = 0;
    let totalTaxSum = 0;
    let totalSocialSecuritySum = 0;
    let totalAddAmountAfterTaxSum = 0;
    let totalAdvancePaymentSum = 0;
    let totalDeductAfterTaxSum = 0;
    let totalTotalSum = 0;
    let totalSumSpSalaryall = 0;
    let totalSumFormattedAmountHolidayAll = 0;

    let sumSpSalaryall = 0;
    let sumFormattedAmountHolidayAll = 0;

    let totalSumAddSalaryBeforeTaxAll = 0;
    let totalSumAddSalaryBeforeTaxNonSocialAll = 0;
    let totalSumDeductBeforeTaxWithSocialAll = 0;
    let totalSumDeductBeforeTaxAll = 0;
    let totalSumAddSalaryAfterTaxAll = 0;
    let totalSumDeductAfterTaxAll = 0;

    Object.keys(groupedByWorkplace)
  .sort((a, b) => a.localeCompare(b)) // Sort keys in ascending order
  .forEach((workplaceKey, index) => {
    // ใช้การกำหนดค่าแบบ destructuring และกำหนดค่า default เป็น 0 หรือ [] หากไม่มีข้อมูล
    const {
      // ข้อมูลหลักที่ต้องมี
      employees = [],
      // ข้อมูลตัวเลขต่างๆ
      totalSalary = 0,
      totalAmountOt = 0,
      totalAmountSpecial = 0,
      totalAmountPosition = 0,
      totalTel = 0,
      totalTravel = 0,
      totalAddSalary = 0,
      totalAmountHardWorking = 0,
      totalAmountHoliday = 0,
      totalAmountSpecialDay = 0,
      totalEmp = 0,
      // ข้อมูลเกี่ยวกับภาษีและการหัก
      totalSumAddSalaryBeforeTax = 0,
      totalSumAddSalaryBeforeTaxNonSocial = 0,
      totalSumDeductBeforeTaxWithSocial = 0,
      totalSumDeductBeforeTax = 0,
      totalTax = 0,
      totalSocialSecurity = 0,
      totalSumAddSalaryAfterTax = 0,
      totalSumDeductAfterTax = 0,
      totalAdvancePayment = 0,
      totalDeductAfterTax = 0,
      totalTotal = 0,
    } = groupedByWorkplace[workplaceKey] || {};

        // const workplaceDetails = workplaceListAll.find(
        //   (w) => w.workplaceId == workplaceKey
        // ) || { name: "Unknown" };
        const workplaceDetails = workplaceListAll.find(
          (w) => w.workplaceId.slice(-4) === workplaceKey.slice(-4)
        ) || { name: "Unknown" };

        console.log("workplaceDetails", workplaceDetails);
        const workplaceName = workplaceDetails.workplaceName || "Unknown"; // Use a default value if 'name' is not available

        // Display workplace heading
        pdf.setFontSize(10);
        // pdf.text(`${workplaceName} : ${workplaceKey}`, 25, currentY);
        // currentY += 5;

        employees.sort((a, b) => a.employeeId.localeCompare(b.employeeId));

        // Display employee information
        employees.forEach(
          ({
            employeeId,
            lastName,
            name,
            accountingRecord,
            addSalary,
            countSpecialDay,
            specialDayRate,
          }) => {
            drawID();
            drawName();
            // drawAllDay();
            drawSalary();
            drawOT();
            drawWelfare();
            drawRoleWork();
            drawDiligenceAllowance();
            drawHoliday();
            drawAddBeforeDeductTax();
            drawMinuseforeDeductTax();

            drawAddBeforeDeductTax2nd();
            drawMinuseforeDeductTax2nd();

            drawDeductTax();
            drawDeductTaxSocialSecurity();
            drawAddAfterDeductTax();
            drawAdvancePayment();
            drawMinusAfterDeductTax();
            // drawBank();
            drawResult();

            const filteredSalary = addSalary.filter(
              (item) =>
                item.id === "1230" || item.id === "1520" || item.id === "1350"
            );
            // Calculate the sum of SpSalary values in the filtered array
            const sumSpSalary = filteredSalary.reduce(
              (total, item) => total + parseFloat(item.SpSalary || 0),
              0
            );
            // Now you can use sumSpSalary wherever you need to display the total sum, for example:
            // pdf.text(`${(sumSpSalary * accountingRecord?.[0]?.countDay).toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });

            sumSpSalaryall += sumSpSalary * accountingRecord?.[0]?.countDay;

            const formattedAmountHoliday = Number(
              countSpecialDay * specialDayRate ?? 0
            );

            sumFormattedAmountHolidayAll += formattedAmountHoliday;
            // sumSpSalaryall += (accountingRecord?.[0]?.amountSpecialDay);

            // sumFormattedAmountHolidayAll += formattedSumFormattedAmountHoliday;
            // sumFormattedAmountHolidayAll += (accountingRecord?.[0]?.amountSpecialDay);

            // Check if there's not enough space on the current page
            if (currentY > pdf.internal.pageSize.height - 20) {
              // Add a new page
              pdf.addPage({ orientation: "landscape" });
              // Reset Y coordinate
              currentY = 20;
            }
          }
        );

        // Display total salary

        const x1 = 20;
        const y1 = 20;
        const x2 = 100;
        const y2 = 20;

        // Draw the line
        // pdf.line(58, currentY - 3, 295, currentY - 3);

        // pdf.text(`รวมแผนก`, 1, currentY);

        // pdf.text(`${workplaceName} : ${workplaceKey}`, startXName + 1, currentY);
        // pdf.text(`${workplaceName} `, startXName + 1, currentY);
        // pdf.text(`${workplaceKey} `, startXName + 1, currentY);

        pdf.text(`${workplaceKey} `, 1, currentY);
        pdf.text(`${workplaceName} `, startXName + 1, currentY);
        // console.log('workplaceKey',workplaceKey);
        // console.log('workplaceName',workplaceName);

        // เงินเดือน
        pdf.text(`${totalSalary.toFixed(2)}`, startXSalary + 16, currentY, {
          align: "right",
        });

        // ค่าล่วงเวลา
        pdf.text(
          `${totalAmountOt.toFixed(2)}`,
          startXOT + cellWidthOT,
          currentY,
          { align: "right" }
        );

        //ค่ารถ โทร ตำแหน่ง
        // pdf.text(`${totalAmountSpecial.toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });
        // pdf.text(`${Number(totalSpSalary * totalCountDay).toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' });
        // console.log('totalSpSalary', totalSpSalary)
        // console.log('accountingRecord?.[0]?.countDay', totalCountDay)
        // sumSpSalaryall
        pdf.text(
          `${Number(totalAddSalary).toFixed(2)}`,
          startXWelfare + cellWidthWelfare,
          currentY,
          { align: "right" }
        );

        //สวัสดิการ
        pdf.text(
          `${totalAmountPosition.toFixed(2)}`,
          startXRoleWork + cellWidthRoleWork,
          currentY,
          { align: "right" }
        );

        // เบี้ยขยัน
        pdf.text(
          `${totalAmountHardWorking.toFixed(2)}`,
          startXDiligenceAllowance + cellWidthDiligenceAllowance,
          currentY,
          { align: "right" }
        );

        // นักขัติ
        // pdf.text(`${totalAmountHoliday.toFixed(2)}`, 85 + (cellWidthOT * 5), currentY, { align: 'right' });
        // pdf.text(`${formattedAmountHoliday.toFixed(2)}`, 85 + (cellWidthOT * 5), currentY, { align: 'right' });
        // totalAmountSpecialDay
        // pdf.text(`${Number(sumFormattedAmountHolidayAll).toFixed(2)}`, startXHoliday + cellWidthHoliday, currentY, { align: 'right' });
        pdf.text(
          `${Number(totalAmountSpecialDay).toFixed(2)}`,
          startXHoliday + cellWidthHoliday,
          currentY,
          { align: "right" }
        );

        // sumFormattedAmountHolidayAll
        // บวกอื่นๆ
        // pdf.text(`${totalAddAmountBeforeTax.toFixed(2)}`, startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax, currentY, { align: 'right' });
        pdf.text(
          `${totalSumAddSalaryBeforeTax.toFixed(2)}`,
          startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ
        // pdf.text(`${totalDeductBeforeTax.toFixed(2)}`, startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax, currentY, { align: 'right' });
        pdf.text(
          `${totalSumDeductBeforeTaxWithSocial.toFixed(2)}`,
          startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax,
          currentY,
          { align: "right" }
        );

        // บวกอื่นๆ อันที่2
        // pdf.text(`${totalAddAmountBeforeTax.toFixed(2)}`, startXAddBeforeDeductTax2nd + cellWidthAddBeforeDeductTax2nd, currentY, { align: 'right' });
        pdf.text(
          `${totalSumAddSalaryBeforeTaxNonSocial.toFixed(2)}`,
          startXAddBeforeDeductTax2nd + cellWidthAddBeforeDeductTax2nd,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ อันที่2
        // pdf.text(`${totalDeductBeforeTax.toFixed(2)}`, startXMinusBeforeDeductTax2nd + cellWidthMinusBeforeDeductTax2nd, currentY, { align: 'right' });
        pdf.text(
          `${totalSumDeductBeforeTax.toFixed(2)}`,
          startXMinusBeforeDeductTax2nd + cellWidthMinusBeforeDeductTax2nd,
          currentY,
          { align: "right" }
        );

        // หักภาษี
        pdf.text(
          `${totalTax.toFixed(2)}`,
          startXDeductTax + cellWidthDeductTax,
          currentY,
          { align: "right" }
        );

        // หักปกส
        pdf.text(
          `${totalSocialSecurity.toFixed(2)}`,
          startXDeductTaxSocialSecurity + cellWidthDeductTaxSocialSecurity,
          currentY,
          { align: "right" }
        );

        // บวกอื่นๆ
        // pdf.text(`${totalAddAmountAfterTax.toFixed(2)}`, startXAddAfterDeductTax + cellWidthAddAfterDeductTax, currentY, { align: 'right' });
        pdf.text(
          `${totalSumAddSalaryAfterTax.toFixed(2)}`,
          startXAddAfterDeductTax + cellWidthAddAfterDeductTax,
          currentY,
          { align: "right" }
        );

        // หักอื่นๆ
        // pdf.text(`${totalDeductAfterTax.toFixed(2)}`, startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax, currentY, { align: 'right' });
        pdf.text(
          `${totalSumDeductAfterTax.toFixed(2)}`,
          startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax,
          currentY,
          { align: "right" }
        );

        // เบิกล่วงหน้า
        pdf.text(
          `${totalAdvancePayment.toFixed(2)}`,
          startXAdvancePayment + cellWidthAdvancePayment,
          currentY,
          { align: "right" }
        );

        // pdf.text(`${totalBank.toFixed(2)}`, 278, currentY, { align: 'right' });
        // สุทธิ
        pdf.text(
          `${totalTotal.toFixed(2)}`,
          startXResult + cellWidthResult,
          currentY,
          { align: "right" }
        );

        currentY += 5;

        // Add some space between workplaces
        pdf.text(
          `พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543
          }`,
          10,
          200
        );
        pdf.text(`รายงานโดย ${present}`, 100, 200);
        pdf.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);

        // Add a new page for the next workplace, if any
        // if (index < Object.keys(groupedByWorkplace).length - 1) {
        //   pdf.addPage({ orientation: 'landscape' });
        //   currentY = 20;
        // }
        totalSalarySum += totalSalary;

        totalAmountOtSum += totalAmountOt;
        totalAmountSpecialSum += totalAmountSpecial;
        totalAmountPositionSum += totalAmountPosition;
        totalAmountHardWorkingSum += totalAmountHardWorking;
        // totalAmountHolidaySum += totalAmountHoliday;sumFormattedAmountHolidayAll
        totalAmountHolidaySum += sumFormattedAmountHolidayAll;
        totalAmountSpecialDaySum += totalAmountSpecialDay;

        totalAddAmountBeforeTaxSum += totalAddAmountBeforeTax;
        totalDeductBeforeTaxSum += totalDeductBeforeTax;
        totalTaxSum += totalTax;
        totalSocialSecuritySum += totalSocialSecurity;
        totalAddAmountAfterTaxSum += totalAddAmountAfterTax;
        totalAdvancePaymentSum += totalAdvancePayment;
        totalDeductAfterTaxSum += totalDeductAfterTax;
        totalTotalSum += totalTotal;
        totalSumSpSalaryall += totalAddSalary;
        totalSumFormattedAmountHolidayAll += sumFormattedAmountHolidayAll;

        totalSumAddSalaryBeforeTaxAll += totalSumAddSalaryBeforeTax;
        totalSumAddSalaryBeforeTaxNonSocialAll +=
          totalSumAddSalaryBeforeTaxNonSocial;
        totalSumDeductBeforeTaxWithSocialAll +=
          totalSumDeductBeforeTaxWithSocial;
        totalSumDeductBeforeTaxAll += totalSumDeductBeforeTax;
        totalSumAddSalaryAfterTaxAll += totalSumAddSalaryAfterTax;
        totalSumDeductAfterTaxAll += totalSumDeductAfterTax;
      });
    // เงินเดือน
    pdf.text(`${totalSalarySum.toFixed(2)}`, startXSalary + 16, currentY, {
      align: "right",
    }); // Adjust coordinates as needed
    // ค่าล่วงเวลา
    pdf.text(
      `${totalAmountOtSum.toFixed(2)}`,
      startXOT + cellWidthOT,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // pdf.text(`${totalAmountSpecialSum.toFixed(2)}`, 85 + (cellWidthOT * 2), currentY, { align: 'right' }); // Adjust coordinates as needed
    //ค่ารถ โทร ตำแหน่ง
    pdf.text(
      `${totalSumSpSalaryall.toFixed(2)}`,
      startXWelfare + cellWidthWelfare,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    //สวัสดิการ
    pdf.text(
      `${totalAmountPositionSum.toFixed(2)}`,
      startXRoleWork + cellWidthRoleWork,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // เบี้ยขยัน
    pdf.text(
      `${totalAmountHardWorkingSum.toFixed(2)}`,
      startXDiligenceAllowance + cellWidthDiligenceAllowance,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // นักขัติ
    // totalAmountSpecialDaySum
    // pdf.text(`${totalAmountHolidaySum.toFixed(2)}`,
    //     startXHoliday + cellWidthHoliday, currentY, { align: 'right' }); // Adjust coordinates as needed
    pdf.text(
      `${totalAmountSpecialDaySum.toFixed(2)}`,
      startXHoliday + cellWidthHoliday,
      currentY,
      { align: "right" }
    );
    // บวกอื่นๆ
    // pdf.text(`${totalAddAmountBeforeTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumAddSalaryBeforeTaxAll.toFixed(2)}`,
      startXAddBeforeDeductTax + cellWidthAddBeforeDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // หักอื่นๆ
    // pdf.text(`${totalDeductBeforeTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumDeductBeforeTaxWithSocialAll.toFixed(2)}`,
      startXMinusBeforeDeductTax + cellWidthMinusBeforeDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // บวกอื่นๆ อันที่2
    // pdf.text(`${totalAddAmountBeforeTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumAddSalaryBeforeTaxNonSocialAll.toFixed(2)}`,
      startXAddBeforeDeductTax2nd + cellWidthAddBeforeDeductTax2nd,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // หักอื่นๆ อันที่2
    // pdf.text(`${totalDeductBeforeTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumDeductBeforeTaxAll.toFixed(2)}`,
      startXMinusBeforeDeductTax2nd + cellWidthMinusBeforeDeductTax2nd,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // หักภาษี
    pdf.text(
      `${totalTaxSum.toFixed(2)}`,
      startXDeductTax + cellWidthDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed

    // หักปกส
    pdf.text(
      `${totalSocialSecuritySum.toFixed(2)}`,
      startXDeductTaxSocialSecurity + cellWidthDeductTaxSocialSecurity,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // บวกอื่นๆ
    // pdf.text(`${totalAddAmountAfterTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumAddSalaryAfterTaxAll.toFixed(2)}`,
      startXAddAfterDeductTax + cellWidthAddAfterDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // หักอื่นๆ
    // pdf.text(`${totalDeductAfterTaxSum.toFixed(2)}`,
    pdf.text(
      `${totalSumDeductAfterTaxAll.toFixed(2)}`,
      startXMinusAfterDeductTax + cellWidthMinusAfterDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // เบิกล่วงหน้า
    pdf.text(
      `${totalAdvancePaymentSum.toFixed(2)}`,
      startXAdvancePayment + cellWidthAdvancePayment,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed
    // สุทธิ
    pdf.text(
      `${totalTotalSum.toFixed(2)}`,
      startXResult + cellWidthResult,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed

    // Save or display the PDF
    window.open(pdf.output("bloburl"), "_blank");
  };
  const handleStaffIdChange2 = (e) => {
    const selectWorkPlaceId = e.target.value;
    setWorkplacrId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(
      (workplace) => workplace.workplaceId == selectWorkPlaceId
    );
    console.log("selectedWorkplace", selectedWorkplace);
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setWorkplacrName(selectedWorkplace.workplaceName);
    } else {
      setWorkplacrName("");
    }
  };

   const workplaceNameOptions = useMemo(() => {
    // ใช้ workplaceListAll ถ้ามีข้อมูล ไม่เช่นนั้นใช้ workplaceList จาก props
    const workplaceData = workplaceListAll.length > 0 ? workplaceListAll : workplaceList;
    return workplaceData.map((workplace) => (
      <option key={workplace.workplaceId} value={workplace.workplaceName} />
    ));
  }, [workplaceListAll, workplaceList]);

    // ปรับปรุงฟังก์ชัน handleStaffIdChange ให้เรียกใช้ fetchEmployeeData หลังกรอกรหัสหน่วยงาน
const handleStaffIdChange = useCallback((e) => {
  const id = e.target.value;
  setWorkplacrId(id);
  
  console.log("รหัสหน่วยงานที่ป้อน:", id);
  console.log("ข้อมูลหน่วยงานทั้งหมด workplaces:", workplaces);
  console.log("ข้อมูลหน่วยงานทั้งหมด workplaceListAll:", workplaceListAll);
  console.log("ข้อมูลหน่วยงานทั้งหมด workplaceList:", workplaceList);
  
  // ใช้ workplaceListAll ก่อน ถ้าไม่มีใช้ workplaceList หรือ workplaces
  const workplaceData = workplaceListAll.length > 0 ? workplaceListAll : 
                       workplaceList.length > 0 ? workplaceList : workplaces;
  
  // ค้นหาชื่อหน่วยงานจากรหัส (เพิ่มการแปลงเป็น string เพื่อให้แน่ใจว่าการเปรียบเทียบถูกต้อง)
  const selectedWorkplace = workplaceData.find(wp => String(wp.workplaceId) === String(id));
  if (selectedWorkplace) {
    setWorkplacrName(selectedWorkplace.workplaceName);
    
    console.log("พบหน่วยงาน:", {
      รหัส: id,
      ชื่อหน่วยงาน: selectedWorkplace.workplaceName
    });
    
    // ดึงข้อมูลพนักงานอัตโนมัติเมื่อรหัสหน่วยงานและเดือน/ปีครบถ้วน
    
  } else {
    // ถ้าไม่พบหน่วยงาน ล้างค่าชื่อหน่วยงาน
    setWorkplacrName('');
    console.log("ไม่พบข้อมูลหน่วยงานสำหรับรหัส:", id);
  }
}, [workplaces, workplaceListAll, workplaceList, month, year, fetchEmployeeData]);

  // const handleStaffNameChange = (e) => {
  //     const selectWorkPlaceId = e.target.value;

  //     // Find the corresponding employee and set the staffId
  //     const selectedEmployee = workplaceListAll.find(employee => employee.workplaceName == selectWorkPlaceId);
  //     const selectedEmployeeFName = workplaceListAll.find(employee => employee.workplaceName === selectWorkPlaceId);

  //     if (selectedEmployee) {
  //         setWorkplacrId(selectedEmployee.workplaceId);
  //         setSearchWorkplaceId(selectedEmployee.workplaceId);
  //         setWorkplacrName(selectedEmployee.workplaceName);

  //     } else {
  //         setStaffId('');
  //         // searchEmployeeId('');
  //     }

  //     // setStaffName(selectedStaffName);
  //     setStaffFullName(selectedStaffName);
  //     setSearchEmployeeName(selectedEmployeeFName);
  // };
  /////////////////
 const handleStaffNameChange = useCallback((e) => {
    const name = e.target.value;
    setWorkplacrName(name);
    
    // ใช้ workplaceListAll ก่อน ถ้าไม่มีใช้ workplaceList หรือ workplaces
    const workplaceData = workplaceListAll.length > 0 ? workplaceListAll : 
                         workplaceList.length > 0 ? workplaceList : workplaces;
    
    const selectedWorkplace = workplaceData.find(wp => wp.workplaceName === name);
    if (selectedWorkplace) {
      setWorkplacrId(selectedWorkplace.workplaceId);
    }
  }, [workplaces, workplaceListAll, workplaceList]);

   const workplaceIdOptions = useMemo(() => {
    // ใช้ workplaceListAll ถ้ามีข้อมูล ไม่เช่นนั้นใช้ workplaceList จาก props
    const workplaceData = workplaceListAll.length > 0 ? workplaceListAll : workplaceList;
    return workplaceData.map((workplace) => (
      <option key={workplace.workplaceId} value={workplace.workplaceId} />
    ));
  }, [workplaceListAll, workplaceList]);

   

 

  const groupedByWorkplace = responseDataAllLeaveSalary.reduce((acc, employee) => {
    const { workplace } = employee;
    // const isWasana = employee.name === "วาสนา" || employee.name === "ฐิติรัตน์";
    // const workplaceKey = isWasana
    //   ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
    //   : employee.workplace;

    const matchingEmployee = employeeList.find(
      (e) => e.employeeId === employee.employeeId
    );

    // Check if the costtype is "ภ.ง.ด.3"
    const hasSpecificCostType = matchingEmployee?.costtype === "ภ.ง.ด.3";

    // Determine the workplaceKey
    const workplaceKey = hasSpecificCostType
      ? `2${employee.workplace.slice(1)}` // Edit the first number to 2
      : employee.workplace;

    const matchingWorkplace = workplaceList.find((w) => w.workplaceId === workplace);

    acc[workplaceKey] = acc[workplaceKey] || {
      employees: [],
      workplaceName: matchingWorkplace ? matchingWorkplace.workplaceName : "N/A", // ถ้าไม่เจอให้ใส่ "N/A"

      //  totalSalary: 0, totalAmountOt: 0,
      // totalAmountSpecial: 0, totalAmountPosition: 0
      // , totalAmountHardWorking: 0, totalAmountHoliday: 0, totalDeductBeforeTax: 0, totalAddAmountBeforeTax: 0,
      // totalTax: 0, totalSocialSecurity: 0, totalAddAmountAfterTax: 0, totalAdvancePayment: 0
      // , totalDeductAfterTax: 0, totalBank: 0, totalTotal: 0, totalEmp: 0
      totalCountDay: 0,
      totalSalary: 0,
      totalAmountOt: 0,
      totalAmountSpecial: 0,
      // totalAmountPosition: 0,

      totalAmountPosition: 0,
      totalTel: 0,
      totalTravel: 0,
      totalAddSalary: 0,

      totalAmountHardWorking: 0,
      totalAmountHoliday: 0,
      totalAmountSpecialDay: 0,

      totalDeductBeforeTax: 0,
      totalAddAmountBeforeTax: 0,
      totalTax: 0,
      totalSocialSecurity: 0,
      totalAddAmountAfterTax: 0,
      totalAdvancePayment: 0,
      totalDeductAfterTax: 0,
      totalBank: 0,
      totalTotal: 0,
      totalEmp: 0,
      totalSpSalary: 0, // Add a new property for sum of SpSalary
      totalCountSpecialDay: 0,

      totalSumAddSalaryBeforeTax: 0,
      totalSumAddSalaryBeforeTaxNonSocial: 0,
      totalSumDeductBeforeTaxWithSocial: 0,
      totalSumDeductBeforeTax: 0,
      totalSumAddSalaryAfterTax: 0,
      totalSumDeductAfterTax: 0,
    };
    acc[workplaceKey].employees.push(employee);
    // acc[workplaceKey].name.push(employee.name);

    // Adjust this line based on your specific structure to get the salary or any other relevant data
    acc[workplaceKey].totalSalary += parseFloat(
      employee.accountingRecord?.[0]?.amountCountDayWork || 0
    );
    // acc[workplaceKey].totalAmountOt += parseFloat(employee.accountingRecord?.[0]?.amountOt || 0);
    const sumOT = parseFloat(
      employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
    );
    acc[workplaceKey].totalAmountOt += sumOT;

    // acc[workplaceKey].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);
    // acc[workplaceKey].totalTel += parseFloat(employee.accountingRecord?.[0]?.tel || 0);
    // acc[workplaceKey].totalTravel += parseFloat(employee.accountingRecord?.[0]?.travel || 0);
    const totalAmountPositio = parseFloat(
      employee.accountingRecord?.[0]?.amountPosition || 0
    );
    const totalTel = parseFloat(employee.accountingRecord?.[0]?.tel || 0);
    const totalTravel = parseFloat(employee.accountingRecord?.[0]?.travel || 0);

    acc[workplaceKey].totalAmountPositio += totalAmountPositio;
    acc[workplaceKey].totalTel += totalTel;
    acc[workplaceKey].totalTravel += totalTravel;
    acc[workplaceKey].totalAddSalary +=
      totalAmountPositio + totalTel + totalTravel;

    acc[workplaceKey].totalAmountSpecial += parseFloat(
      employee.accountingRecord?.[0]?.amountSpecial || 0
    );
    acc[workplaceKey].totalAmountPosition += parseFloat(
      employee.accountingRecord?.[0]?.benefitNonSocial || 0
    );
    acc[workplaceKey].totalAmountHardWorking += parseFloat(
      employee.accountingRecord?.[0]?.amountHardWorking || 0
    );
    acc[workplaceKey].totalAmountHoliday += parseFloat(
      employee.accountingRecord?.[0]?.amountHoliday || 0
    );
    acc[workplaceKey].totalAmountSpecialDay += parseFloat(
      employee.accountingRecord?.[0]?.amountSpecialDay || 0
    );

    acc[workplaceKey].totalDeductBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.deductBeforeTax || 0
    );
    acc[workplaceKey].totalAddAmountBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
    );
    acc[workplaceKey].totalTax += parseFloat(
      employee.accountingRecord?.[0]?.tax || 0
    );
    acc[workplaceKey].totalSocialSecurity += parseFloat(
      employee.accountingRecord?.[0]?.socialSecurity || 0
    );
    acc[workplaceKey].totalAddAmountAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.addAmountAfterTax || 0
    );
    acc[workplaceKey].totalAdvancePayment += parseFloat(
      employee.accountingRecord?.[0]?.advancePayment || 0
    );
    acc[workplaceKey].totalDeductAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.deductAfterTax || 0
    );
    acc[workplaceKey].totalBank += parseFloat(
      employee.accountingRecord?.[0]?.bank || 0
    );
    acc[workplaceKey].totalTotal += parseFloat(
      employee.accountingRecord?.[0]?.total ?? 0
    );

    acc[workplaceKey].totalSumAddSalaryBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
    );
    acc[workplaceKey].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
    );
    acc[workplaceKey].totalSumDeductBeforeTaxWithSocial += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial || 0
    );
    acc[workplaceKey].totalSumDeductBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductBeforeTax || 0
    );
    acc[workplaceKey].totalSumAddSalaryAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryAfterTax || 0
    );
    acc[workplaceKey].totalSumDeductAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductAfterTax || 0
    );
    // amountSpecialDay

    acc[workplaceKey].totalEmp += 1;

    return acc;
  }, {});

  console.log("groupedByWorkplace", groupedByWorkplace);

const exportToExcel = async () => {
  try {
    // ตรวจสอบว่ามีการกรอกเดือนและปีครบถ้วนหรือไม่
    if (!month || !year) {
      alert('กรุณากรอกเดือนและปี');
      return;
    }

    // แสดง loading indicator
    setLoadingEmployees(true);
    
    // ดึงข้อมูลพนักงานตามเงื่อนไข
    let fetchedData;
    
    if (workplacrId) {
      // กรณีมีการระบุ workplacrId ให้ดึงข้อมูลเฉพาะหน่วยงานนั้น
      fetchedData = await fetchEmployeeData();
      
      if (!fetchedData || fetchedData.length === 0) {
        alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
        setLoadingEmployees(false);
        return;
      }
    } else {
      // กรณีไม่ระบุ workplacrId ให้ดึงข้อมูลทั้งหมดในเดือนที่เลือก
      const result = await fetchAllWorkplaceData();
      
      if (!result || !result.data) {
        alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
        setLoadingEmployees(false);
        return;
      }
      
      fetchedData = await fetchEmployeeData(); // ดึงข้อมูลพนักงานทั้งหมด
    }
    
    if (!fetchedData || fetchedData.length === 0) {
      alert('ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข');
      setLoadingEmployees(false);
      return;
    }
    
    // สร้าง workbook
    const wb = XLSX.utils.book_new();
    
    // สร้างหัวเอกสาร
    const headerData = [
      ["รายงานเงินเดือนพนักงาน"],
      [`หน่วยงาน: ${workplacrId ? `${workplacrName} (${workplacrId})` : "ทุกหน่วยงาน"}`],
      [`ประจำเดือน: ${getThaiMonth(month)} ${parseInt(year) + 543}`],
      [`พิมพ์รายงานวันที่: ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`],
      [""]
    ];
    
    if (!workplacrId) {
      // จัดกลุ่มข้อมูลตามหน่วยงาน
      const groupedData = fetchedData.reduce((acc, emp) => {
        const wpId = emp.workplaceId || 'unknown';
        if (!acc[wpId]) {
          acc[wpId] = [];
        }
        acc[wpId].push(emp);
        return acc;
      }, {});
      
      // สร้าง sheet เปล่าสำหรับทั้งหมด
      const wsAll = XLSX.utils.aoa_to_sheet(headerData);
      
      // จัดระยะห่างแถว
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 18 } }, // รายงานเงินเดือนพนักงาน
        { s: { r: 1, c: 0 }, e: { r: 1, c: 18 } }, // หน่วยงาน
        { s: { r: 2, c: 0 }, e: { r: 2, c: 18 } }, // ประจำเดือน
        { s: { r: 3, c: 0 }, e: { r: 3, c: 18 } }, // วันที่พิมพ์รายงาน
      ];
      
      wsAll['!merges'] = merges;
      
      // เริ่มที่แถวที่ 5 (หลังจากหัวข้อ)
      let rowIndex = headerData.length;
      let grandTotals = {
        days: 0,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0,
        employees: 0
      };
      
      // สร้างข้อมูลแยกตามหน่วยงาน
      for (const [wpId, employees] of Object.entries(groupedData)) {
        if (employees.length === 0) continue; // ข้ามหน่วยงานที่ไม่มีพนักงาน
        
        // หาชื่อหน่วยงาน
        const workplace = workplaceListAll.find(w => w.workplaceId === wpId) || {};
        const wpName = workplace.workplaceName || 'ไม่ระบุชื่อ';
        
        // เพิ่มหัวข้อหน่วยงาน
        XLSX.utils.sheet_add_aoa(wsAll, [[`หน่วยงาน: ${wpName} (${wpId})`]], { origin: { r: rowIndex, c: 0 } });
        
        // เพิ่ม merge cells สำหรับหัวข้อหน่วยงาน
        merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 18 } });
        
        // เพิ่มหัวตาราง
        rowIndex++;
        const headers = [
          "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
          "ค่ารถ/โทร/\nตน.", "สวัสดิการ\n(ไม่คิด ปกส.)", "เบี้ยขยัน", "นักขัติ", 
          "บวกอื่นๆ\n(คิด ปกส)", "หักอื่นๆ\n(คิด ปกส)", "บวกอื่นๆ\n(ไม่คิด ปกส)", 
          "หักอื่นๆ\n(ไม่คิด ปกส)", "หักภาษี", "หัก ปกส", "บวกอื่นๆ", "หักอื่นๆ", 
          "เบิกล่วงหน้า", "สุทธิ"
        ];
        
        XLSX.utils.sheet_add_aoa(wsAll, [headers], { origin: { r: rowIndex, c: 0 } });
        
        // สร้างตัวแปรสำหรับเก็บผลรวม
        let totals = {
          days: 0,
          salary: 0,
          ot: 0,
          transportation: 0,
          welfare: 0,
          diligence: 0,
          holiday: 0,
          addBeforeTax: 0,
          deductBeforeTax: 0,
          addNoTax: 0,
          deductNoTax: 0,
          tax: 0,
          socialSecurity: 0,
          addAfterTax: 0,
          deductAfterTax: 0,
          advance: 0,
          net: 0
        };
        
        // เพิ่มข้อมูลพนักงานในหน่วยงาน
        employees.forEach(emp => {
          rowIndex++;
          
          // แปลงข้อมูลตัวเลขให้เป็นตัวเลขทั้งหมด (ลบ comma และแปลงเป็น float)
          const salary = parseFloat(emp.sumCashWork?.replace(/,/g, '') || 0);
          const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);

          const ot = parseFloat(emp.sumCashOt?.replace(/,/g, '') || 0);
          const transportation = parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0);
          const welfare = parseFloat(emp.welfare?.replace(/,/g, '') || 0);
          const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
          const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 5);
          const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
          const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
          const addNoTax = parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
          const deductNoTax = parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
          const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
          const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
          const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
          const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
          const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);
          const days = parseFloat(emp.typeOfemployee === 'รายเดือน' ? '30' : (emp.dayWorkCount || '0'));

          // คำนวณยอดสุทธิ
          const netCalculated = 
            salary + ot + transportation + welfare + diligence + holiday + 
            addBeforeTax + addNoTax + addAfterTax - 
            deductBeforeTax - deductNoTax - tax - socialSecurity - deductAfterTax - advance;
          
          // บวกรวมค่าสำหรับการคำนวณผลรวม
          totals.days += days;
          totals.salary += salary;
          totals.ot += ot;
          totals.transportation += transportation;
          totals.welfare += welfare;
          totals.diligence += diligence;
          totals.holiday += holiday;
          totals.addBeforeTax += addBeforeTax;
          totals.deductBeforeTax += deductBeforeTax;
          totals.addNoTax += addNoTax;
          totals.deductNoTax += deductNoTax;
          totals.tax += tax;
          totals.socialSecurity += socialSecurity;
          totals.addAfterTax += addAfterTax;
          totals.deductAfterTax += deductAfterTax;
          totals.advance += advance;
          totals.net += netCalculated;
          
          // เพิ่มข้อมูลพนักงานลงในตาราง
          const employeeRow = [
            emp.employeeId || "-",
            `${emp.firstName || ""} ${emp.lastName || ""}`,
            days,
            salary || 0,
            ot || 0,
            transportation || 0,
            welfare || 0,
            diligence || 0,
            holiday || 0,
            addBeforeTax || 0,
            deductBeforeTax || 0,
            addNoTax || 0,
            deductNoTax || 0,
            tax || 0,
            socialSecurity || 0,
            addAfterTax || 0,
            deductAfterTax || 0,
            advance || 0,
            netCalculated || 0
          ];
          
          XLSX.utils.sheet_add_aoa(wsAll, [employeeRow], { origin: { r: rowIndex, c: 0 } });
        });
        
        // เพิ่มแถวสรุปรวมของหน่วยงาน
        rowIndex += 2; // เพิ่มอีก 1 แถวว่าง
        
        const totalsRow = [
          `รวมแผนก ${wpId}`,
          `${employees.length} คน`,
          totals.days,
          totals.salary,
          totals.ot,
          totals.transportation,
          totals.welfare,
          totals.diligence,
          totals.holiday,
          totals.addBeforeTax,
          totals.deductBeforeTax,
          totals.addNoTax,
          totals.deductNoTax,
          totals.tax,
          totals.socialSecurity,
          totals.addAfterTax,
          totals.deductAfterTax,
          totals.advance,
          totals.net
        ];
        
        XLSX.utils.sheet_add_aoa(wsAll, [totalsRow], { origin: { r: rowIndex, c: 0 } });
        
        // อัปเดต grandTotals
        grandTotals.days += totals.days;
        grandTotals.salary += totals.salary;
        grandTotals.ot += totals.ot;
        grandTotals.transportation += totals.transportation;
        grandTotals.welfare += totals.welfare;
        grandTotals.diligence += totals.diligence;
        grandTotals.holiday += totals.holiday;
        grandTotals.addBeforeTax += totals.addBeforeTax;
        grandTotals.deductBeforeTax += totals.deductBeforeTax;
        grandTotals.addNoTax += totals.addNoTax;
        grandTotals.deductNoTax += totals.deductNoTax;
        grandTotals.tax += totals.tax;
        grandTotals.socialSecurity += totals.socialSecurity;
        grandTotals.addAfterTax += totals.addAfterTax;
        grandTotals.deductAfterTax += totals.deductAfterTax;
        grandTotals.advance += totals.advance;
        grandTotals.net += totals.net;
        grandTotals.employees += employees.length;
        
        rowIndex += 2; // เพิ่มแถวว่างระหว่างหน่วยงาน
      }
      
      // อัปเดต merges สำหรับ worksheet
      wsAll['!merges'] = merges;
      
      // กำหนดความกว้างของคอลัมน์
      const colWidths = [
        { wch: 10 }, // รหัส
        { wch: 25 }, // ชื่อ-สกุล
        { wch: 5 },  // วัน
        { wch: 12 }, // เงินเดือน
        { wch: 12 }, // ค่าล่วงเวลา
        { wch: 12 }, // ค่ารถ/โทร
        { wch: 18 }, // สวัสดิการ
        { wch: 12 }, // เบี้ยขยัน
        { wch: 12 }, // นักขัตฤกษ์
        { wch: 15 }, // บวกอื่นๆ(คิด ปกส)
        { wch: 15 }, // หักอื่นๆ(คิด ปกส)
        { wch: 15 }, // บวกอื่นๆ(ไม่คิด ปกส)
        { wch: 15 }, // หักอื่นๆ(ไม่คิด ปกส)
        { wch: 10 }, // หักภาษี
        { wch: 10 }, // หัก ปกส
        { wch: 12 }, // บวกอื่นๆ
        { wch: 12 }, // หักอื่นๆ
        { wch: 12 }, // เบิกล่วงหน้า
        { wch: 12 }  // สุทธิ
      ];
      
      wsAll['!cols'] = colWidths;
      
      // เพิ่มแผ่นงานลงใน workbook
      XLSX.utils.book_append_sheet(wb, wsAll, "รายงานเงินเดือนพนักงาน");
      
    } else {
      // กรณีเลือกเฉพาะหน่วยงาน
      const workplace = workplaceListAll.find(w => w.workplaceId === workplacrId) || { workplaceName: 'ไม่ระบุชื่อ' };
      
      // สร้างตาราง Excel
      const wsData = [
        ["รายงานเงินเดือนพนักงาน"],
        [`หน่วยงาน: ${workplace.workplaceName} (${workplacrId})`],
        [`ประจำเดือน: ${getThaiMonth(month)} ${parseInt(year) + 543}`],
        [`พิมพ์รายงานวันที่: ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`],
        [""],
        [
          "รหัส", "ชื่อ - สกุล", "วัน", "เงินเดือน", "ค่าล่วงเวลา", 
          "ค่ารถ/โทร/ตน.", "สวัสดิการ(ไม่คิด ปกส.)", "เบี้ยขยัน", "นักขัติ", 
          "บวกอื่นๆ(คิด ปกส)", "หักอื่นๆ(คิด ปกส)", "บวกอื่นๆ(ไม่คิด ปกส)", 
          "หักอื่นๆ(ไม่คิด ปกส)", "หักภาษี", "หัก ปกส", "บวกอื่นๆ", "หักอื่นๆ", 
          "เบิกล่วงหน้า", "สุทธิ"
        ]
      ];
      
      // สร้างตัวแปรสำหรับเก็บผลรวม
      let totals = {
        days: 0,
        salary: 0,
        ot: 0,
        transportation: 0,
        welfare: 0,
        diligence: 0,
        holiday: 0,
        addBeforeTax: 0,
        deductBeforeTax: 0,
        addNoTax: 0,
        deductNoTax: 0,
        tax: 0,
        socialSecurity: 0,
        addAfterTax: 0,
        deductAfterTax: 0,
        advance: 0,
        net: 0
      };
      
      // เพิ่มข้อมูลพนักงาน
      displayEmployees.forEach(emp => {
        const salary = parseFloat(emp.sumCashWork?.replace(/,/g, '') || 0);
        const wageRevise = parseFloat(emp.wageRevise?.replace(/,/g, '') || 0);
        const ot = parseFloat(emp.sumCashOt?.replace(/,/g, '') || 0);
        const transportation = parseFloat(emp.transportAllowance?.replace(/,/g, '') || 0);
        const welfare = parseFloat(emp.welfare?.replace(/,/g, '') || 0);
        const diligence = parseFloat(emp.diligenceAllowance?.replace(/,/g, '') || 0);
        const holiday = parseFloat(emp.publicHolidayCash?.replace(/,/g, '') || 0);
        const addBeforeTax = parseFloat(emp.additionalBeforeTax?.replace(/,/g, '') || 0);
        const deductBeforeTax = parseFloat(emp.deductionBeforeTax?.replace(/,/g, '') || 0);
        const addNoTax = parseFloat(emp.additionalNoTax?.replace(/,/g, '') || 0);
        const deductNoTax = parseFloat(emp.deductionNoTax?.replace(/,/g, '') || 0);
        const tax = parseFloat(emp.tax?.replace(/,/g, '') || 0);
        const socialSecurity = parseFloat(emp.socialSecurity?.replace(/,/g, '') || 0);
        const addAfterTax = parseFloat(emp.additionalAfterTax?.replace(/,/g, '') || 0);
        const deductAfterTax = parseFloat(emp.deductionAfterTax?.replace(/,/g, '') || 0);
        const advance = parseFloat(emp.advancePayment?.replace(/,/g, '') || 0);
        const days = parseFloat(emp.typeOfemployee === 'รายเดือน' ? '30' : (emp.dayWorkCount || '0'));

        // คำนวณยอดสุทธิ
        const netCalculated = 
          salary + wageRevise + ot + transportation + welfare + diligence + holiday + 
          addBeforeTax + addNoTax + addAfterTax - 
          deductBeforeTax - deductNoTax - tax - socialSecurity - deductAfterTax - advance;
        
        // บวกรวมค่าสำหรับการคำนวณผลรวม
        totals.days += days;
        totals.salary += salary;
        totals.wageRevise += wageRevise;
        totals.ot += ot;
        totals.transportation += transportation;
        totals.positionAndTransportationWithSocial += positionAndTransportationWithSocial;
        totals.diligence += diligence;
        totals.holiday += holiday;
        totals.addBeforeTax += addBeforeTax;
        totals.deductBeforeTax += deductBeforeTax;
        totals.addNoTax += addNoTax;
        totals.deductNoTax += deductNoTax;
        totals.tax += tax;
        totals.socialSecurity += socialSecurity;
        totals.addAfterTax += addAfterTax;
        totals.deductAfterTax += deductAfterTax;
        totals.advance += advance;
        totals.net += netCalculated;
        
        // เพิ่มข้อมูลพนักงาน
        wsData.push([
          emp.employeeId || "-",
          `${emp.firstName || ""} ${emp.lastName || ""}`,
          days,
          salary || 0,
          wageRevise || 0,
          ot || 0,
          transportation || 0,
          welfare || 0,
          diligence || 0,
          holiday || 0,
          addBeforeTax || 0,
          deductBeforeTax || 0,
          addNoTax || 0,
          deductNoTax || 0,
          tax || 0,
          socialSecurity || 0,
          addAfterTax || 0,
          deductAfterTax || 0,
          advance || 0,
          netCalculated || 0
        ]);
      });
      
      // เพิ่มแถวว่าง
      wsData.push([]);
      
      // เพิ่มแถวผลรวม
      wsData.push([
        `รวมแผนก ${workplacrId}`,
        `${displayEmployees.length} คน`,
        totals.days,
        totals.salary,
        totals.wageRevise,
        totals.ot,
        totals.transportation,
        totals.welfare,
        totals.diligence,
        totals.holiday,
        totals.addBeforeTax,
        totals.deductBeforeTax,
        totals.addNoTax,
        totals.deductNoTax,
        totals.tax,
        totals.socialSecurity,
        totals.addAfterTax,
        totals.deductAfterTax,
        totals.advance,
        totals.net
      ]);
      
      // สร้าง worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // กำหนดความกว้างของคอลัมน์
      const colWidths = [
        { wch: 10 }, // รหัส
        { wch: 25 }, // ชื่อ-สกุล
        { wch: 5 },  // วัน
        { wch: 12 }, // เงินเดือน
        { wch: 12 }, // ค่าล่วงเวลา
        { wch: 12 }, // ค่ารถ/โทร
        { wch: 18 }, // สวัสดิการ
        { wch: 12 }, // เบี้ยขยัน
        { wch: 12 }, // นักขัตฤกษ์
        { wch: 15 }, // บวกอื่นๆ(คิด ปกส)
        { wch: 15 }, // หักอื่นๆ(คิด ปกส)
        { wch: 15 }, // บวกอื่นๆ(ไม่คิด ปกส)
        { wch: 15 }, // หักอื่นๆ(ไม่คิด ปกส)
        { wch: 10 }, // หักภาษี
        { wch: 10 }, // หัก ปกส
        { wch: 12 }, // บวกอื่นๆ
        { wch: 12 }, // หักอื่นๆ
        { wch: 12 }, // เบิกล่วงหน้า
        { wch: 12 }  // สุทธิ
      ];
      
      ws['!cols'] = colWidths;
      
      // จัดการ merge cells สำหรับหัวเรื่อง
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 18 } }, // รายงานเงินเดือนพนักงาน
        { s: { r: 1, c: 0 }, e: { r: 1, c: 18 } }, // หน่วยงาน
        { s: { r: 2, c: 0 }, e: { r: 2, c: 18 } }, // ประจำเดือน
        { s: { r: 3, c: 0 }, e: { r: 3, c: 18 } }, // วันที่พิมพ์รายงาน
      ];
      
      ws['!merges'] = merges;
      
      // เพิ่ม worksheet ลงใน workbook
      XLSX.utils.book_append_sheet(wb, ws, `${workplacrId}`);
    }
    
    // จัดการกับสไตล์ทั้งหมดของตาราง
    const sheetNames = wb.SheetNames;
    for (let i = 0; i < sheetNames.length; i++) {
      const ws = wb.Sheets[sheetNames[i]];
      
      if (ws['!ref']) {
        // กำหนดให้ทุกเซลล์มีเส้นกรอบ
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        for (let R = range.s.r; R <= range.e.r; R++) {
          for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({r: R, c: C});
            if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
            if (!ws[cellRef].s) ws[cellRef].s = {};
            
            // กำหนดเส้นขอบให้ทุกเซลล์
            ws[cellRef].s.border = {
              top: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            };
            
            // กำหนดสไตล์พิเศษสำหรับแถวหัวตาราง (แถวที่ 5 หรือ R = 5)
            if (R === 5) {
              ws[cellRef].s.fill = { fgColor: { rgb: 'E2EFDA' } }; // สีพื้นหลังหัวตาราง
              ws[cellRef].s.font = { bold: true };
              ws[cellRef].s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
            }
            
            // จัดวางตัวเลขชิดขวา
            if (C >= 3 && C <= 18 && R > 5) { // คอลัมน์ที่เป็นตัวเลข (เงินเดือน ถึง สุทธิ)
              ws[cellRef].s.alignment = { horizontal: 'right', vertical: 'center' };
            }
            
            // จัดวางข้อความชิดซ้าย
            if (C <= 1 && R > 5) { // คอลัมน์ รหัส และ ชื่อ-สกุล
              ws[cellRef].s.alignment = { horizontal: 'left', vertical: 'center' };
            }
            
            // จัดวางตัวเลข วัน ให้อยู่กลาง
            if (C === 2 && R > 5) {
              ws[cellRef].s.alignment = { horizontal: 'center', vertical: 'center' };
            }
          }
        }
      }
    }
    
    // บันทึกไฟล์ Excel
    const filename = workplacrId
      ? `รายงานเงินเดือนหน่วยงาน_${workplacrName || workplacrId}_${month}_${year}.xlsx`
      : `รายงานเงินเดือนพนักงาน_${month}_${year}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    
    // ซ่อน loading indicator
    setLoadingEmployees(false);
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างไฟล์ Excel:', error);
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Excel');
    setLoadingEmployees(false);
  }
};





















  const exportToExcel2 = () => {
    const headers = [
      "รหัส",
      "หน่วยงาน",
      "เงินเดือน",
      "ค่าล่วงเวลา",
      "ค่ารถ/โทร/ตน.",
      "สวัสดิการ(ไม่คิด ปกส.)",
      "เบี้ยขยัน",
      "นักขัติ",
      "บวกอื่นๆ(คิด ปกส)",
      "หักอื่นๆ(คิด ปกส",
      "บวกอื่นๆ(ไม่คิด ปกส)",
      "หักอื่นๆ(ไม่คิด ปกส)",
      "หักภาษี",
      "หักปกส",
      "บวกอื่นๆ",
      "เบิกบ่วงหน้า",
      "หักอื่นๆ",
      "สุทธิ",
    ];

    // แปลง groupedByWorkplace เป็นอาร์เรย์ของข้อมูล
    const formattedData = Object.entries(groupedByWorkplace).map(
      ([workplaceKey, item]) => ({
        "รหัส": workplaceKey,
        "หน่วยงาน": item.workplaceName || "N/A", // ใช้ workplaceName หรือ N/A ถ้าไม่มี
        "เงินเดือน": Number(item.totalSalary.toFixed(2) || 0),
        "ค่าล่วงเวลา": Number(item.totalAmountOt.toFixed(2) || 0),
        "ค่ารถ/โทร/ตน.": Number(item.totalAddSalary ?? 0).toFixed(2),
        "สวัสดิการ(ไม่คิด ปกส.)": Number(item.totalAmountPosition.toFixed(2) || 0),
        "เบี้ยขยัน": Number(item.totalAmountHardWorking.toFixed(2) || 0),
        "นักขัติ": Number(item.totalAmountSpecialDay).toFixed(2) || 0,
        "บวกอื่นๆ(คิด ปกส)": Number(item.totalSumAddSalaryBeforeTax.toFixed(2) || 0),
        "หักอื่นๆ(คิด ปกส)":
          Number(item.totalSumDeductBeforeTaxWithSocial.toFixed(2) || 0),
        "บวกอื่นๆ(ไม่คิด ปกส)": Number(item.totalSumAddSalaryBeforeTaxNonSocial.toFixed(2) || 0),
        "หักอื่นๆ(ไม่คิด ปกส)": Number(item.totalSumDeductBeforeTax.toFixed(2) || 0),
        "หักภาษี": Number(item.totalTax.toFixed(2) || 0),
        "หักปกส": Number(item.totalSocialSecurity.toFixed(2) || 0),
        "บวกอื่นๆ": Number(item.totalSumAddSalaryAfterTax.toFixed(2) || 0),
        "เบิกบ่วงหน้า": Number(item.totalAdvancePayment.toFixed(2) || 0),
        "หักอื่นๆ": Number(item.totalSumDeductAfterTax.toFixed(2) || 0),
        "สุทธิ": Number(item.totalTotal.toFixed(2) || 0),
      })
    );

    const totals = Object.values(groupedByWorkplace).reduce(
      (acc, item) => {
        acc.totalSalary += item.totalSalary || 0;
        acc.totalAmountOt += item.totalAmountOt || 0;
        acc.totalAddSalary += Number(item.totalAddSalary ?? 0);
        acc.totalAmountPosition += item.totalAmountPosition || 0;
        acc.totalAmountHardWorking += item.totalAmountHardWorking || 0;
        acc.totalAmountSpecialDay += Number(item.totalAmountSpecialDay) || 0;
        acc.totalSumAddSalaryBeforeTax += item.totalSumAddSalaryBeforeTax || 0;
        acc.totalSumDeductBeforeTaxWithSocial +=
          item.totalSumDeductBeforeTaxWithSocial || 0;
        acc.totalSumAddSalaryBeforeTaxNonSocial +=
          item.totalSumAddSalaryBeforeTaxNonSocial || 0;
        acc.totalSumDeductBeforeTax += item.totalSumDeductBeforeTax || 0;
        acc.totalTax += item.totalTax || 0;
        acc.totalSocialSecurity += item.totalSocialSecurity || 0;
        acc.totalSumAddSalaryAfterTax += item.totalSumAddSalaryAfterTax || 0;
        acc.totalAdvancePayment += item.totalAdvancePayment || 0;
        acc.totalSumDeductAfterTax += item.totalSumDeductAfterTax || 0;
        acc.totalTotal += item.totalTotal || 0;
        return acc;
      },
      {
        totalSalary: 0,
        totalAmountOt: 0,
        totalAddSalary: 0,
        totalAmountPosition: 0,
        totalAmountHardWorking: 0,
        totalAmountSpecialDay: 0,
        totalSumAddSalaryBeforeTax: 0,
        totalSumDeductBeforeTaxWithSocial: 0,
        totalSumAddSalaryBeforeTaxNonSocial: 0,
        totalSumDeductBeforeTax: 0,
        totalTax: 0,
        totalSocialSecurity: 0,
        totalSumAddSalaryAfterTax: 0,
        totalAdvancePayment: 0,
        totalSumDeductAfterTax: 0,
        totalTotal: 0,
      }
    );

    // เพิ่มผลรวมลงใน `formattedData`
    formattedData.push({
      "รหัส": "รวมทั้งหมด",
      "หน่วยงาน": "",
      "เงินเดือน": totals.totalSalary.toFixed(2),
      "ค่าล่วงเวลา": totals.totalAmountOt.toFixed(2),
      "ค่ารถ/โทร/ตน.": totals.totalAddSalary.toFixed(2),
      "สวัสดิการ(ไม่คิด ปกส.)": totals.totalAmountPosition.toFixed(2),
      "เบี้ยขยัน": totals.totalAmountHardWorking.toFixed(2),
      "นักขัติ": totals.totalAmountSpecialDay.toFixed(2),
      "บวกอื่นๆ(ก่อนภาษี)": totals.totalSumAddSalaryBeforeTax.toFixed(2),
      "หักอื่นๆ(ก่อนภาษี)": totals.totalSumDeductBeforeTaxWithSocial.toFixed(2),
      "บวกอื่นๆ(หลังภาษี)": totals.totalSumAddSalaryBeforeTaxNonSocial.toFixed(2),
      "หักอื่นๆ(หลังภาษี)": totals.totalSumDeductBeforeTax.toFixed(2),
      "หักภาษี": totals.totalTax.toFixed(2),
      "หักปกส": totals.totalSocialSecurity.toFixed(2),
      "บวกอื่นๆ": totals.totalSumAddSalaryAfterTax.toFixed(2),
      "เบิกบ่วงหน้า": totals.totalAdvancePayment.toFixed(2),
      "หักอื่นๆ": totals.totalSumDeductAfterTax.toFixed(2),
      "สุทธิ": totals.totalTotal.toFixed(2),
    });

    console.log("formattedData", formattedData);

    // // สร้าง Worksheet และเพิ่ม Headers
    // const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    //   header: headers,
    // });

    // // สร้าง Workbook
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // // แปลง Workbook เป็น Blob
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: "xlsx",
    //   type: "array",
    // });
    // const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // // ดาวน์โหลดไฟล์
    // saveAs(blob, "Test_Excel.xlsx");
    const ws = XLSX.utils.json_to_sheet([], { origin: "A4" }); // เริ่มข้อมูล array ที่ A4

    // เพิ่มหัวเรื่องใน A1, A2, และ A3
    ws["A1"] = { v: "ชื่อ" };     // เซลล์ A1
    ws["A2"] = { v: "ที่อยู่" };  // เซลล์ A2
    ws["A3"] = { v: "วันที่" };   // เซลล์ A3

    // นำข้อมูลจาก formattedData ใส่ลงใน Excel (เริ่มที่ A4)
    XLSX.utils.sheet_add_json(ws, formattedData, { origin: "A4" });

    // สร้าง Workbook และเพิ่ม Worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(wb, "ExportedData.xlsx");
  };

  return (
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">

          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> ระบบเงินเดือน</a>
            </li>
            <li class="breadcrumb-item active">ออกรายงานเงินเดือนพนักงาน </li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ออกรายงานเงินเดือนพนักงาน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ออกรายงานเงินเดือนพนักงาน </h2>
              <section class="Frame">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-3">
                      <label role="searchEmployeeId">รหัสหน่วยงาน</label>
                      {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchWorkplaceId(e.target.value)} /> */}
                     <input
                        type="text"
                        className="form-control"
                        id="workplaceId"
                        name="workplaceId"
                        placeholder="รหัสหน่อยงาน"
                        value={workplacrId}
                        onChange={handleStaffIdChange}
                        onFocus={(e) => {
                          e.target.click();
                        }}
                        list="WorkplaceIdList"
                        autoComplete="on"
                      />
                       <datalist id="WorkplaceIdList">
                              {workplaceIdOptions}
                      </datalist>
                    </div>
                    <div class="col-md-3">
                      <label role="searchname">ชื่อหน่วยงาน</label>
                      {/* <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} /> */}
                      {/* <input
                                                type="text"
                                                className="form-control"
                                                id="staffName"
                                                placeholder="ชื่อพนักงาน"
                                                value={workplacrName}
                                                onChange={handleStaffNameChange}
                                                list="WorkplaceNameList"
                                            />

                                            <datalist id="WorkplaceNameList">
                                                {workplaceListAll.map(workplace => (
                                                    <option key={workplace.workplaceId} value={workplace.workplaceName} />
                                                ))}
                                            </datalist> */}
                      <input
                        type="text"
                          className="form-control"
                          id="workplaceName"
                          name="workplaceName"
                          placeholder="ชื่อหน่วยงาน"
                          value={workplacrName}
                          onChange={handleStaffNameChange}
                          onFocus={(e) => {
                            e.target.click();
                          }}
                          list="WorkplaceNameList"
                          autoComplete="on"
                      />
                      <datalist id="WorkplaceNameList">
                          {workplaceNameOptions}
                      </datalist>
                      
                    </div>
                    <div class="col-md-2">
                      <div class="form-group">
                        <label role="agencyname">เดือน</label>
                        <select
                          className="form-control"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="01">มกราคม</option>
                          <option value="02">กุมภาพันธ์</option>
                          <option value="03">มีนาคม</option>
                          <option value="04">เมษายน</option>
                          <option value="05">พฤษภาคม</option>
                          <option value="06">มิถุนายน</option>
                          <option value="07">กรกฎาคม</option>
                          <option value="08">สิงหาคม</option>
                          <option value="09">กันยายน</option>
                          <option value="10">ตุลาคม</option>
                          <option value="11">พฤศจิกายน</option>
                          <option value="12">ธันวาคม</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-group">
                        <label>ปี</label>
                        <select
                          className="form-control"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y + 543}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* <button class="btn btn-secondary" onClick={fetchData}>Fetch Data</button> */}
                  <br />
                  <br />

                  <div class="row">
                    <div class="col-md-3">
                      {/* <label role="datetime">พิมพ์วันที่</label>
                                            <div style=
                                                {{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                <DatePicker id="datetime" name="datetime"
                                                    className="form-control" // Apply Bootstrap form-control class
                                                    popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                    selected={workDate}
                                                    onChange={handleWorkDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                // showMonthYearPicker
                                                />
                                            </div> */}

                      <label role="datetime">พิมพ์วันที่</label>
                      {/* <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                <DatePicker
                                                    className="form-control"
                                                    selected={selectedThaiDate}
                                                    onChange={handleThaiDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale={th}
                                                />
                                            </div> */}
                      <div
                        onClick={toggleDatePicker}
                        style={{
                          position: "relative",
                          zIndex: 9999,
                          marginLeft: "0rem",
                        }}
                      >
                        <FaCalendarAlt size={20} />
                        <span style={{ marginLeft: "8px" }}>
                          {formattedDate321 ? formattedDate321 : "Select Date"}
                        </span>
                      </div>

                      {showDatePicker && (
                        <div style={{ position: "absolute", zIndex: 1000 }}>
                          <ThaiDatePicker
                            className="form-control"
                            value={selectedDate}
                            onChange={handleDatePickerChange}
                          />
                        </div>
                      )}
                    </div>
                    <div class="col-md-3">
                      <label role="datetime">ลงชื่อ</label>

                      <input
                        type="text"
                        class="form-control"
                        id="searchWorkplaceId"
                        placeholder="รายงานโดย"
                        value={present}
                        onChange={(e) => setPresent(e.target.value)}
                      />
                    </div>

                    <div class="col-md-3">
                      <label role="datetime">รหัส</label>

                      <input
                        type="text"
                        class="form-control"
                        id="searchWorkplaceId"
                        placeholder="แฟ้มรายงาน"
                        value={presentfilm}
                        onChange={(e) => setPresentfilm(e.target.value)}
                      />
                    </div>
                  </div>
                  <br />
                  <button 
                      className="btn btn-primary form-control" 
                      onClick={fetchEmployeeData}
                      style={{ marginRight: "1rem",}}
                    >
                      ค้นหาข้อมูล
                    </button>

                  <button
                    class="btn btn-success mr-3"
                    style={{ width: "10rem" }}
                    onClick={generatePDF01}
                  >
                    PDF รายหน่วยงาน
                  </button>
                  {/* <button
                    class="btn btn-success"
                    style={{ marginLeft: "1rem", width: "11rem" }}
                    onClick={generatePDF02}
                  >
                    PDF หน่วยงานทั้งหมด
                  </button> */}
                  <button  class="btn btn-danger ," onClick={generatePDFAudit}>PDF ออดิท</button>

                </div>
           
                <div class="col-md-12">
                  {/* <button class="btn btn-success" onClick={exportToExcel}>Export to Excel</button> */}
                </div>
                
                {/* เพิ่มตารางแสดงข้อมูลพนักงาน */}
                <div className="col-md-12 mt-4">
                  {/* <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">ข้อมูลพนักงานในหน่วยงาน {workplacrName} ({workplacrId})</h3>
                    </div>
                    <div className="card-body">
                      {loadingEmployees ? (
                        <div className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">กำลังโหลด...</span>
                          </div>
                          <p className="mt-2">กำลังโหลดข้อมูลพนักงาน...</p>
                        </div>
                      ) : displayEmployees.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th className="text-center">ลำดับ</th>
                                <th className="text-center">รหัสพนักงาน</th>
                                <th className="text-center">ชื่อ-นามสกุล</th>
                                <th className="text-center">เงินเดือน</th>
                                <th className="text-center">ค่าล่วงเวลา</th>
                                <th className="text-center">จำนวนวันทำงาน</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayEmployees.map((employee, index) => (
                                <tr key={employee.employeeId}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="text-center">{employee.employeeId}</td>
                                  <td>{`${employee.firstName || ''} ${employee.lastName || ''}`}</td>
                                  <td className="text-right">{employee.sumCashWork}</td>
                                  <td className="text-right">{employee.sumCashOt}</td>
                                  <td className="text-center">{employee.dayWorkCount}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-light">
                                <th colSpan="3" className="text-right">รวมทั้งหมด {displayEmployees.length} คน</th>
                                <th className="text-right">
                                  {formatNumber(displayEmployees.reduce((sum, emp) => 
                                    sum + (parseFloat(emp.sumCashWork.replace(/,/g, '')) || 0), 0))}
                                </th>
                                <th className="text-right">
                                  {formatNumber(displayEmployees.reduce((sum, emp) => 
                                    sum + (parseFloat(emp.sumCashOt.replace(/,/g, '')) || 0), 0))}
                                </th>
                                <th></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          {workplacrId ? 'ดึงข้อมูลสำเร็จ แต่ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไข' : 'กรุณาเลือกหน่วยงาน เดือน และปี เพื่อแสดงข้อมูลพนักงาน'}
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
                {/* <label>Thai Date:</label> */}
                {/* <DatePicker
                                    selected={selectedThaiDate}
                                    onChange={handleThaiDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    locale={th}
                                /> */}
                {/* <br />
                                <label>Gregorian Date:</label>
                                <DatePicker
                                    selected={selectedGregorianDate}
                                    onChange={handleGregorianDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    locale={en}
                                /> */}
              </section>
            </div>
          </section>
        </div>
      </div>
    {/* </body> */}
     </div>
  );
}

export default SalaryAllResult;
