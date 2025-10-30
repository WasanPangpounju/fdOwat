import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

import "jspdf-autotable";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { PDFViewer, Document, Page, Text, View, StyleSheet as PDFStyleSheet } from '@react-pdf/renderer';


import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data
// เพิ่มที่ด้านบนไฟล์หลังจาก import
import { Font } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์


// ลงทะเบียนฟอนต์

Font.register({
  family: 'THSarabunNew',
  fonts: [
    { src: '/assets/fonts/THSarabunNew.ttf' },
    { src: '/assets/fonts/THSarabunNew-Bold.ttf', fontWeight: 'bold' },
    { src: '/assets/fonts/THSarabunNew-Italic.ttf', fontStyle: 'italic' },
  ]
});

Font.register({
  family: 'CourierPrime',
  fonts: [
    { src: '/assets/fonts/CourierPrime-Regular.ttf' },
    { src: '/assets/fonts/CourierPrime-Bold.ttf', fontWeight: 'bold' },
    { src: '/assets/fonts/CourierPrime-Italic.ttf', fontStyle: 'italic' },
  ]
});


function BackReport({ employeeList, workplaceList }) {

  const filteredEmployeeList = employeeList.map(
    ({ name, lastName, employeeId, branchBank }) => ({
      name,
      lastName,
      employeeId,
      branchBank,
    })
  );


  const [bankFullName, setBankFullName] = useState("");
const [allBankNames, setAllBankNames] = useState([]);
const [timeRecordData, setTimeRecordData] = useState([]);


  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [bankEmployees, setBankEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completeEmployeeData, setCompleteEmployeeData] = useState([]); // State to hold complete employee data

  const [dataAccounting, setDataAccounting] = useState(""); //รหัสหน่วยงาน
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน
  console.log('filteredEmployeeList', filteredEmployeeList);

  

const extractBankNames = (list) => {
  const bankNames = list
    .map((employee) => {
      // ใช้ salarybank แทน branchBank
      if (employee.salarybank) {
        return employee.salarybank.trim();
      }
      return null; // Return null for invalid entries
    })
    .filter((name) => name !== null); // Remove null entries

  return [...new Set(bankNames)]; // Remove duplicates
};

  const uniqueBankNames = extractBankNames(filteredEmployeeList);

  console.log('uniqueBankNames', uniqueBankNames);


  const [selectedBank, setSelectedBank] = useState("");
  // ฟังก์ชันจัดการการเปลี่ยนค่า
  // const handleChange = (event) => {
  //   setSelectedBank(event.target.value);
  // };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const [startShowDatePicker, setStartShowDatePicker] = useState(false);
  const [startSelectedDate, setStartSelectedDate] = useState(null);
  const [startFormattedDate321, setStartFormattedDate] = useState(null);

  const [endShowDatePicker, setEndShowDatePicker] = useState(false);
  const [endSelectedDate, setEndSelectedDate] = useState(null);
  const [endFormattedDate321, setEndFormattedDate] = useState(null);
// เพิ่ม state สำหรับเก็บข้อมูลที่กรองแล้ว
const [filteredByBankAndDate, setFilteredByBankAndDate] = useState([]);
  const [workDate, setWorkDate] = useState(new Date());

  // console.log("selectedDate", selectedDate + " " + formattedDate321);
  // console.log("startSelectedDate", startSelectedDate + " " + startFormattedDate321);
  // console.log("endSelectedDate", endSelectedDate + " " + endFormattedDate321);

  // console.log("endSelectedDate", endSelectedDate + " " + endFormattedDate321);


  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
  };

  const handleDatePickerStartChange = (date) => {
    setStartSelectedDate(date);
    setStartShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
  };

  const handleDatePickerEndChange = (date) => {
    setEndSelectedDate(date);
    setEndShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
  };

  useEffect(() => {
    // Function to format a given date
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = (date.getFullYear() + 543).toString();
      return `${day}/${month}/${year}`;
    };

    if (selectedDate) {
      // Convert the selected date string to a Date object and format it
      const date = new Date(selectedDate);
      const formattedDate = formatDate(date);
      setFormattedDate(formattedDate);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setFormattedDate(formattedCurrentDate);
      setSelectedDate(currentDate); // Set the initial selected date to the current date
    }

    if (startSelectedDate) {
      // Convert the selected date string to a Date object and format it
      const datestart = new Date(startSelectedDate);
      const formattedDateStart = formatDate(datestart);
      setStartFormattedDate(formattedDateStart);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setStartFormattedDate(formattedCurrentDate);
      setStartSelectedDate(currentDate); // Set the initial selected date to the current date
    }

    if (endSelectedDate) {
      // Convert the selected date string to a Date object and format it
      const dateend = new Date(endSelectedDate);
      const formattedDateEnd = formatDate(dateend);
      setEndFormattedDate(formattedDateEnd);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setEndFormattedDate(formattedCurrentDate);
      setEndSelectedDate(currentDate); // Set the initial selected date to the current date
    }
  }, [selectedDate, startSelectedDate, endSelectedDate]);

  const [responseDataAll, setResponseDataAll] = useState(filteredEmployeeList);
  const [present, setPresent] = useState("DATAOWAT");
  const [presentfilm, setPresentfilm] = useState(
    "\\10.10.110.251\payrolldata\Report\System\PRRPT011.V7.RPT"
  );

  const [month, setMonth] = useState("01");
  const currentYear = new Date().getFullYear(); // 2024

  const [year, setYear] = useState(currentYear);
  const EndYear = 2010;
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  const filteredEmployees = filteredEmployeeList.filter(
    (employee) => employee.branchBank === selectedBank
  );

  console.log('filteredEmployees', filteredEmployees);

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

  //         setDataAccounting(responseData);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   };

  //   fetchData();
  // }, [year, month]);

 // เพิ่ม state สำหรับเก็บข้อมูลพนักงานจาก timerecord API


// เพิ่ม useEffect เพื่อดึงข้อมูลจาก timerecord API
// แก้ไข useEffect เพื่อดึงข้อมูลจาก timerecord API และแสดงทุกคนก่อนเลือกธนาคาร
// แก้ไข useEffect เพื่อดึงข้อมูลจาก timerecord API และแสดงทุกคนก่อนเลือกธนาคาร
useEffect(() => {
  const fetchTimeRecordData = async () => {
    if (!year || !month) return;
    
    try {
      // แสดง log เพื่อตรวจสอบการส่งค่า
      console.log("กำลังดึงข้อมูล timerecord สำหรับปี", year, "เดือน", month);
      console.log("ค่า selectedBank ใน useEffect:", selectedBank);
      
      const response = await axios.get(endpoint + "/timerecord/listempdeletexx");
      console.log("ข้อมูลที่ได้จาก API:", response.data);
      
      if (response.data) {
        // กรองข้อมูลตามเดือนและปีที่เลือก
        const filteredData = response.data.filter(record => {
          // แปลงให้เป็น string ทั้งหมดเพื่อเปรียบเทียบ
          const recordYear = String(record.year || "");
          const recordMonth = String(record.month || "");
          const paramYear = String(year);
          const paramMonth = String(month);
          
          // เปรียบเทียบโดยไม่สนใจ type
          return recordYear == paramYear && recordMonth == paramMonth;
        });
        
        console.log("พบข้อมูลพนักงานในเดือน", month, "ปี", year, "จำนวน", filteredData.length, "คน");
        setTimeRecordData(filteredData);
        
        // ถ้ายังไม่มีการเลือกธนาคาร ให้แสดงข้อมูลทั้งหมด
        if (!selectedBank) {
          console.log("ไม่มีการเลือกธนาคาร จะแสดงข้อมูลทั้งหมด");
        } else {
          console.log("มีการเลือกธนาคาร:", selectedBank);
          
          // เรียกใช้ API employee/search เพื่อดึงข้อมูลพนักงานทั้งหมด
          const employeeResponse = await axios.post(endpoint + "/employee/search", {});
          
          if (employeeResponse.data && employeeResponse.data.employees) {
            console.log("ตรวจสอบค่า salarybank ของพนักงานแต่ละคน:");
            
            // ตรวจสอบค่า salarybank ของพนักงานแต่ละคน
            employeeResponse.data.employees.forEach(employee => {
              const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
              const selectedBankTrimmed = selectedBank ? selectedBank.trim() : "";
              
              console.log(`พนักงาน: ${employee.name} (${employee.employeeId})`);
              console.log(`- salarybank: "${empSalaryBank}"`);
              console.log(`- selectedBank: "${selectedBankTrimmed}"`);
              console.log(`- ตรงกัน: ${empSalaryBank === selectedBankTrimmed}`);
              console.log(`- ความยาว salarybank: ${empSalaryBank.length}`);
              console.log(`- ความยาว selectedBank: ${selectedBankTrimmed.length}`);
              console.log("----------------------------------------");
            });
            
            // กรองพนักงานที่มีธนาคารตรงกับที่เลือก
            const filteredByBank = employeeResponse.data.employees.filter(employee => {
              const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
              const selectedBankTrimmed = selectedBank ? selectedBank.trim() : "";
              return empSalaryBank === selectedBankTrimmed;
            });
            
            console.log(`พบพนักงานที่ใช้ธนาคาร "${selectedBank}" จำนวน ${filteredByBank.length} คน จากทั้งหมด ${employeeResponse.data.employees.length} คน`);
            
            // เพิ่มกรณีที่มีการเลือกทั้งเดือน/ปี และธนาคาร
            if (year && month && selectedBank) {
              console.log(`กำลังกรองข้อมูลตามเดือน ${month}/${year} และธนาคาร ${selectedBank}`);
              
              // กรองข้อมูล timerecord ตามพนักงานที่มีธนาคารตรงกับที่เลือก
              const employeeIds = filteredByBank.map(emp => emp.employeeId);
              
              // กรองข้อมูล timerecord เฉพาะพนักงานที่มีธนาคารตรงกับที่เลือก
              // กรองข้อมูล timerecord เฉพาะพนักงานที่มีธนาคารตรงกับที่เลือก
const filteredByBankAndDate = filteredData.filter(record => {
  // ตรวจสอบว่า employeeId ของ record อยู่ในรายการ employeeIds หรือไม่
  return employeeIds.includes(record.employeeId);
});
  setFilteredByBankAndDate(filteredByBankAndDate);

  // เพิ่มฟังก์ชันนี้ใน useEffect หลังจากได้ filteredByBankAndDate
const fetchEmployeeDetails = async () => {
  try {
    // สร้าง array เพื่อเก็บข้อมูลพนักงานที่สมบูรณ์
    const completeEmployeeData = [];
    
    // วนลูปตามรายการพนักงานใน filteredByBankAndDate
    for (const record of filteredByBankAndDate) {
      // เรียก API เพื่อดึงข้อมูลละเอียดของพนักงานแต่ละคน
      const response = await axios.get(`${endpoint}/employee/${record.employeeId}`);
      
      if (response.data) {
        console.log(`ข้อมูลละเอียดของพนักงาน ${record.employeeId}:`, response.data);
        
        // เพิ่มข้อมูลลงใน array
        completeEmployeeData.push({
          ...record,
          employeeDetails: response.data
        });
      }
    }
    
    // อัปเดต state หรือใช้ข้อมูลนี้แทน filteredByBankAndDate
    setCompleteEmployeeData(completeEmployeeData);
    console.log("ข้อมูลพนักงานที่สมบูรณ์:", completeEmployeeData);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลละเอียดของพนักงาน:", error);
  }
};

// เรียกใช้ฟังก์ชันหลังจากได้ filteredByBankAndDate
if (filteredByBankAndDate.length > 0) {
  fetchEmployeeDetails();
}


// แสดงข้อมูล filteredByBankAndDate ในรูปแบบ Array
console.log("----------- ข้อมูล filteredByBankAndDate ในรูปแบบ Array -----------");
console.log(filteredByBankAndDate); // แสดงข้อมูลทั้ง array
console.log(`จำนวนข้อมูลทั้งหมด: ${filteredByBankAndDate.length} รายการ`);

// แสดงข้อมูลในรูปแบบตารางเพื่อให้อ่านง่ายขึ้น
console.table(filteredByBankAndDate.map(record => ({
  employeeId: record.employeeId,
  name: record.employeeName,
  month: record.month,
  year: record.year,
  sumCashWork: record.sumCashWork || 0
})));

              // สร้างข้อมูลรวมสำหรับแสดงผล - รวมข้อมูลพนักงานกับข้อมูล timerecord
              const combinedData = filteredByBankAndDate.map(record => {
                // หาข้อมูลพนักงานที่ตรงกับ record
                const matchingEmployee = filteredByBank.find(emp => emp.employeeId === record.employeeId);
                
                // ข้อมูลบัญชีที่ตรงกัน (ถ้ามี)
                const accounting = dataAccounting.find(acc => acc.employeeId === record.employeeId);
                
                // รวมข้อมูล
                return {
                  ...record,
                  employee: matchingEmployee || {},
                  accounting: accounting || {}
                };
              });
              
              console.log("----------- ข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข -----------");
              combinedData.forEach((item, index) => {
                console.log(`${index + 1}. ชื่อ: ${item.name || item.employee.name} (${item.employeeId})`);
                console.log(`   - ธนาคาร: ${item.employee.salarybank}`);
                console.log(`   - เดือน/ปี: ${item.month}/${item.year}`);
                console.log(`   - มีข้อมูลบัญชี: ${item.accounting ? 'มี' : 'ไม่มี'}`);
                console.log("----------------------------------------");
              });
              
              // แก้ไขการ log ในส่วนของข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข
console.log("----------- ข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข -----------");
console.log("ข้อมูลทั้งหมด (Array):", combinedData); // Log array ทั้งหมดออกมา
console.log(`รวมพนักงานที่ผ่านทั้ง 3 เงื่อนไข: ${combinedData.length} คน`);

// เพิ่ม log แสดงรายละเอียดเฉพาะข้อมูลสำคัญของแต่ละพนักงาน
console.log("รายละเอียดพนักงานที่ผ่านทั้ง 3 เงื่อนไข:");
const simplifiedData = combinedData.map(item => ({
  employeeId: item.employeeId,
  name: item.name || item.employee.name,
  bank: item.employee.salarybank,
  month: item.month,
  year: item.year,
  sumCashWork: item.sumCashWork || 0
}));
console.table(simplifiedData); // แสดงในรูปแบบตาราง
            }
          }
        }
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล timerecord:", error);
    }
  };

  fetchTimeRecordData();
}, [year, month, selectedBank, dataAccounting]);
// แก้ไขฟังก์ชัน handleChange เพื่อกรองข้อมูลเมื่อมีการเลือกธนาคาร
// แก้ไขฟังก์ชัน handleChange เพื่อกรองข้อมูลตามธนาคารที่เลือก
const handleChange = async (event) => {
  const selectedValue = event.target.value.trim();
  setSelectedBank(selectedValue);
  setBankFullName(selectedValue);
  setIsLoading(true);

  // เพิ่ม log เพื่อตรวจสอบว่าผู้ใช้เลือกธนาคารไหน
  console.log("ผู้ใช้เลือกธนาคาร:", selectedValue);

  try {
    // สร้างข้อมูลสำหรับส่งไปยัง API employee/search
    const searchData = {
      salarybank: selectedValue
    };

    console.log("กำลังค้นหาพนักงานที่มีธนาคาร:", selectedValue);
    
    // เรียกใช้ API employee/search เพื่อค้นหาพนักงานที่มีธนาคารตรงกับที่เลือก
    const response = await axios.post(endpoint + "/employee/search", searchData);
    
    if (response.data && response.data.employees) {
      // ตรวจสอบโครงสร้างข้อมูลที่ได้จาก API
      console.log("ตัวอย่างข้อมูลพนักงานแรก:", response.data.employees[0]);
      
      // กรองพนักงานที่มีธนาคารตรงกับที่เลือก - ปรับปรุงให้ตรวจสอบค่า undefined
      const filteredEmployees = response.data.employees.filter(employee => {
        // ตรวจสอบว่า salarybank มีค่าหรือไม่
        const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
        
        // เพิ่ม log เพื่อตรวจสอบค่า salarybank ของพนักงานแต่ละคน
        console.log(`พนักงาน ${employee.name} (${employee.employeeId}) มีค่า salarybank:`, 
          employee.salarybank === undefined ? "undefined" : empSalaryBank);
        console.log(`เปรียบเทียบกับ selectedBank (${selectedValue}):`, empSalaryBank === selectedValue);
        
        return empSalaryBank === selectedValue;
      });
      
      console.log("พบพนักงานที่มีธนาคาร", selectedValue, "จำนวน", filteredEmployees.length, "คน");
      
      // รวมข้อมูลพนักงานกับข้อมูลจาก timerecord API
      const mergedEmployeeData = filteredEmployees.map((employee) => {
        // หาข้อมูลบัญชีที่ตรงกัน
        const accounting = dataAccounting.find(
          (record) => record.employeeId === employee.employeeId
        );
        
        // หาข้อมูลจาก timerecord โดยใช้ชื่อหรือ ID พนักงาน
        const timeRecord = timeRecordData.find(
          (record) => 
            record.employeeId === employee.employeeId || 
            record.name === employee.name || 
            (record.name && employee.name && 
            record.name.trim().toLowerCase() === employee.name.trim().toLowerCase())
        );
        
        // หากไม่พบข้อมูล timeRecord ให้ log แสดง
        if (!timeRecord) {
          console.log(`ไม่พบข้อมูล timeRecord สำหรับพนักงาน: ${employee.name} (${employee.employeeId})`);
        }
        
        return { 
          ...employee, 
          accountingRecord: accounting ? accounting.accountingRecord : [],
          timeRecordData: timeRecord || null 
        };
      });

      // กรองเฉพาะพนักงานที่มีข้อมูล timeRecord
      const employeesWithTimeRecord = mergedEmployeeData.filter(employee => employee.timeRecordData !== null);
      console.log("พนักงานที่มีข้อมูล timeRecord:", employeesWithTimeRecord.length, "คน");
      
      setResponseDataAll(mergedEmployeeData);
      console.log("รวมข้อมูลพนักงานธนาคาร", selectedValue, "เรียบร้อยแล้ว:", mergedEmployeeData.length, "คน");
    } else {
      setResponseDataAll([]);
      console.log("ไม่พบพนักงานที่มีธนาคาร", selectedValue);
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    setResponseDataAll([]);
  } finally {
    setIsLoading(false);
  }
};


  const startToggleDatePicker = () => {
    setStartShowDatePicker(!startShowDatePicker);
  };
  const enDToggleDatePicker = () => {
    setEndShowDatePicker(!endShowDatePicker);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // useEffect(() => {
  //   const generateRandomData = () => {
  //     const randomNames = ["สมชาย", "กิตทิมา", "สิริพา", "ไกลนิมาร", "ไหรามา", "อิริสา"];
  //     const randomLastNames = [
  //       "สาศิมาไร",
  //       "รืมากา",
  //       "การิมาร",
  //       "ไซนยะนะ",
  //       "คงสงไทย",
  //       "สงพารี",
  //     ];

  //     const randomArray = Array.from({ length: 150 }, () => ({
  //       name: randomNames[Math.floor(Math.random() * randomNames.length)],
  //       lastName:
  //         randomLastNames[Math.floor(Math.random() * randomLastNames.length)],
  //       banknumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Convert 10-digit number to string
  //       employee: Math.floor(100000 + Math.random() * 900000).toString(), // Convert amount to string
  //       total: Math.floor(10000 + Math.random() * 90000).toString(), // Convert amount to string
  //     }));

  //     setResponseDataAll(randomArray);
  //   };

  //   generateRandomData();
  // }, []);


  console.log('responseDataAll', responseDataAll);

  // Merge the two arrays
  const mergedData = responseDataAll
    .map((employee) => {
      const accounting = dataAccounting.find(
        (record) => record.employeeId === employee.employeeId
      );
      if (accounting) {
        return { ...employee, accountingRecord: accounting.accountingRecord };
      }
      return null; // Skip if no matching accounting record
    })
    .filter((item) => item !== null); // Remove null values

  console.log(mergedData);

  console.log('mergedData', mergedData);

  // const generatePDF = () => {
  //   const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
  //   const ages = [25, 30, 22, 35, 28];

  //   // Create a new instance of jsPDF
  //   const pdf = new jsPDF();

  //   const fontPath = "/assets/fonts/THSarabunNew.ttf";
  //   pdf.addFileToVFS(fontPath);
  //   pdf.addFont(fontPath, "THSarabunNew", "normal");

  //   // Add bold font
  //   const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
  //   pdf.addFileToVFS(boldFontPath);
  //   pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

  //   // const boldFontPath = '/assets/fonts/THSarabunNew Bold.ttf';
  //   // pdf.addFileToVFS(boldFontPath);
  //   // pdf.addFont(boldFontPath, 'THSarabunNew Bold', 'normal');

  //   // Override the default stylestable for jspdf-autotable

  //   pdf.setFont("THSarabunNew", "normal");
  // pdf.setFontSize(16);

  //   const stylestable = {
  //     font: "THSarabunNew",
  //     fontStyle: "normal",
  //     fontSize: 10,
  //   };
  //   const tableOptions = {
  //     styles: stylestable,
  //     startY: 25,
  //     // margin: { top: 10 },
  //   };

  //   // let x = 20; // Left margin
  //   // let y = 20; // Top margin

  //   // Set the initial position for text and frame

  //   // y += 10; // Add space after the title

  //   // Add table headers
  //   pdf.setFontSize(12);
  //   pdf.setFont("THSarabunNew", "bold");

  //   // pdf.text("No.", x, y);
  //   // pdf.text("Bank Number", x + 20, y);
  //   // pdf.text("Name + Last Name", x + 70, y);
  //   // pdf.text("Total", x + 150, y);

  //   // y += 5; // Move to the next line

  //   // // Reset font for table content
  //   // pdf.setFont("THSarabunNew", "normal");

  //   // // Loop through data and add rows
  //   // responseDataAll.forEach((item, index) => {
  //   //   const fullName = `${item.name} ${item.lastName}`;
  //   //   const formattedTotal = item.total.toLocaleString(); // Format total with commas

  //   //   pdf.text((index + 1).toString(), x, y); // Number
  //   //   pdf.text(item.banknumber, x + 20, y); // Bank Number
  //   //   pdf.text(fullName, x + 70, y); // Full Name
  //   //   pdf.text(formattedTotal, x + 150, y, { align: "right" }); // Total (right-aligned)

  //   //   y += 5; // Move to the next row
  //   // });

  //   const marginTop = 20;
  //   const marginBottom = 20;
  //   const pageHeight = pdf.internal.pageSize.height;
  //   const maxContentHeight = pageHeight - marginTop - marginBottom;
  //   let y = marginTop;

  //   const x = 20;

  //   // Title and table headers
  //   pdf.setFont("THSarabunNew Bold", "normal");
  //   pdf.setFontSize(12);


  //   pdf.text("No.", x, y);
  //   pdf.text("Bank Number", x + 20, y);
  //   pdf.text("Name + Last Name", x + 70, y);
  //   pdf.text("Total", x + 150, y);

  //   y += 5; // Move to the next line

  //   // Reset font for table content
  //   pdf.setFont("THSarabunNew", "normal");
  //   pdf.setFontSize(10);

  //   let totalSum = 0; // Variable to keep track of the total sum

  //   // Loop through data and add rows
  //   responseDataAll.forEach((item, index) => {
  //     // Check if we need a new page

  //     pdf.text("บริษัท โอวาท โปร แอน์ ควิก จำกัด", 10, 10);
  //     pdf.text(`รายงานโอนเงินเข้าธนาคาร ${selectedBank}`, 10, 16);
  //     pdf.text(`สำหรับงวดวันที่`, 10, 22);

  //     if (y + 10 > maxContentHeight) {
  //       pdf.addPage();
  //       y = marginTop;

  //       // Add table headers on new page

  //       pdf.setFont("THSarabunNew Bold", "normal");
  //       pdf.setFontSize(12);
  //       pdf.text("No.", x, y);
  //       pdf.text("Bank Number", x + 20, y);
  //       pdf.text("Name + Last Name", x + 70, y);
  //       pdf.text("Total", x + 150, y);

  //         totalSum += item.total; // Add item total to the sum

  //       y += 5; // Move to the next line

  //       // pdf.setFont("THSarabunNew", "normal");
  //       // pdf.setFontSize(10);

  //     }


  //     // Add row data
  //     const fullName = `${item.name} ${item.lastName}`;
  //     const formattedTotal = item.total.toLocaleString(); // Format total with commas

  //     pdf.text((index + 1).toString(), x, y); // Number
  //     pdf.text(item.banknumber, x + 20, y); // Bank Number
  //     pdf.text(fullName, x + 70, y); // Full Name
  //     pdf.text(formattedTotal, x + 150, y, { align: "right" }); // Total (right-aligned)

  //     y += 5; // Move to the next row
  //   });

  //   const formattedTotalSum = totalSum.toLocaleString(); // Format total with commas
  //   pdf.setFont("THSarabunNew Bold", "normal");
  //   pdf.text("Total Sum:", x + 100, y); // Position of "Total Sum" text
  //   pdf.text(formattedTotalSum, x + 180, y, { align: "right" }); // Position of total sum value


  //   // pdf.setFont('THSarabunNew');
  //   pdf.setFont("THSarabunNew Bold");

  //   // Loop through the names and ages arrays to add content to the PDF


  //   // Open the generated PDF in a new tab
  //   window.open(pdf.output("bloburl"), "_blank");
  // };

  const generatePDF = () => {
    // Create a new instance of jsPDF
    const pdf = new jsPDF(
      {
        format: "a4", // Set page size to A4
        unit: "mm",   // Use millimeters as the unit
        orientation: "portrait", // Orientation can be 'portrait' or 'landscape'
      }
    );

    // Add the Thai fonts to jsPDF
    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, "THSarabunNew", "normal");

    // Add bold font
    const boldFontPath = "/assets/fonts/THSarabunNew-Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew-Bold", "bold");

    // Set initial styles and positions
    const marginTop = 30;
    const marginBottom = 5;
    const pageHeight = pdf.internal.pageSize.height;
    const maxContentHeight = pageHeight - marginTop - marginBottom + 200;
    const itemsPerPage = Math.floor(maxContentHeight / 10); // Adjust row height (e.g., 10 for this example)
    const totalPages = Math.ceil(mergedData.length / itemsPerPage);
    let currentPage = 1;

    let y = marginTop;

    const x = 10;

    // Title and table headers
    pdf.setFont("THSarabunNew Bold", "normal");
    pdf.setFontSize(12);
    pdf.setLineWidth(0.6); // Set the line width
    pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
    pdf.text("ลำดับ", x, y);
    pdf.text("เลขที่บัญชี", x + 20, y);
    pdf.text("รหัสพนักงาน", x + 45, y);
    pdf.text("ชื่อ-นามสกุล", x + 90, y);
    pdf.text("ยอดเงิน", x + 180, y);
    pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)

    pdf.line(x, 290 - 5, 205, 290 - 5); // Line from (20, 50) to (190, 50)
    pdf.text(`พิมพ์วันที่ ${formattedDate321}`, x, 290);
    pdf.text(`รายงานโดน ${present}`, x + 30, 290);
    pdf.text(`แฟ้มรายงาน ${presentfilm}`, x + 80, 290);

    y += 5; // Move to the next line

    // Reset font for table content
    pdf.setFont("THSarabunNew", "normal");
    pdf.setFontSize(10);

    let totalSum = 0; // Variable to keep track of the total sum
    let allperson = 0; // Variable to keep track of the total sum

    // Loop through data and add rows
    mergedData.forEach((item, index) => {
      if ((index % itemsPerPage === 0) && index !== 0) {
        // Add footer with page number

        pdf.setFont("THSarabunNew Bold", "normal");
        pdf.setFontSize(12);
        y = marginTop;

        // Add a new page
        pdf.addPage();
        currentPage++;

        pdf.setLineWidth(0.6); // Set the line width
        pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
        pdf.text("ลำดับ", x, y);
        pdf.text("เลขที่บัญชี", x + 20, y);
        pdf.text("รหัสพนักงาน", x + 45, y);
        pdf.text("ชื่อ-นามสกุล", x + 90, y);
        pdf.text("ยอดเงิน", x + 180, y);
        pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)
        pdf.text(`หน้าที่ ${currentPage}/${totalPages}`, 200, 22, { align: "right" });
        // y = marginTop; // Reset y-coordinate for the new page

        pdf.line(x, 290 - 5, 205, 290 - 5); // Line from (20, 50) to (190, 50)
        pdf.text(`พิมพ์วันที่ ${formattedDate321}`, x, 290);
        pdf.text(`รายงานโดน ${present}`, x + 30, 290);
        pdf.text(`แฟ้มรายงาน ${presentfilm}`, x + 80, 290);
        y += 5; // Move to the next line
      }

      // Check if we need a new page

      pdf.text("บริษัท โอวาท โปร แอน์ ควิก จำกัด", 10, 10);
      pdf.text(`รายงานโอนเงินเข้าธนาคาร ${selectedBank}`, 10, 16);
      pdf.text(`สำหรับงวดวันที่ ${startFormattedDate321} ถึง ${endFormattedDate321}`, 10, 22);
      // pdf.text(`หน้าที่ ${currentPage}/${totalPages}`, 200, 22, { align: "right" });


      // if (y + 10 > maxContentHeight) {
      //   pdf.addPage();
      //   y = marginTop;

      //   // Add table headers on new page
      //   pdf.setFont("THSarabunNew Bold", "normal");
      //   pdf.setFontSize(12);

      //   pdf.setLineWidth(0.6); // Set the line width
      //   pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
      //   pdf.text("ลำดับ", x, y);
      //   pdf.text("เลขที่บัญชี", x + 20, y);
      //   pdf.text("รหัสพนักงาน", x + 45, y);
      //   pdf.text("ชื่อ-นามสกุล", x + 90, y);
      //   pdf.text("ยอดเงิน", x + 180, y);
      //   pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)

      //   y += 5; // Move to the next line

      //   pdf.setFont("THSarabunNew", "normal");
      //   pdf.setFontSize(10);
      // }

      // Add row data
      // const fullName = `${item.name} ${item.lastName}`;
      // // const formattedTotal = Number(item.total.toLocaleString()); // Format total with commas
      // const formattedTotal = Number(item.total).toLocaleString(); // e.g., "123,456"

      const fullName = `${item.name ?? ""} ${item.lastName ?? ""}`;
      // const bankNumber = item.branchBank ?? "Unknown"; // Ensure bankNumber is defined
      const bankNumber = item.branchBank
        ? item.branchBank.match(/\d{3}-\d{1}-\d{5}-\d{1}/)?.[0] ?? "Unknown"
        : "Unknown";
      const employee = item.employeeId ?? "Unknown"; // Ensure bankNumber is defined
      // const formattedTotal = item.total?.toLocaleString() ?? "0";
      // const formattedTotal = item.accountingRecord.total?.toLocaleString() ?? "0";
      const formattedTotal = item.accountingRecord?.[0]?.total ? Number(item.accountingRecord[0].total).toLocaleString() : "0";

      pdf.text((index + 1).toString(), x + 3, y, { align: "center" }); // Number
      pdf.text(bankNumber, x + 20, y); // Bank Number (displayed as string)
      pdf.text(employee, x + 46, y); // Bank Number (displayed as string)
      pdf.text(fullName, x + 90, y); // Full Name
      pdf.text(formattedTotal, x + 185, y, { align: "center" }); // 

      allperson = (index + 1).toString();
      // totalSum += Number(formattedTotal); // Add item total to the sum (ensure it's treated as a number)
      totalSum += Number(item.accountingRecord?.[0]?.total || 0); // Ensure total is treated as a number

      y += 5; // Move to the next row
    });

    // Add total sum to the last page
    const formattedTotalSum = totalSum.toLocaleString(); // Format total with commas
    pdf.setFont("THSarabunNew Bold", "normal");
    // pdf.text("Total Sum:", x + 150, y); // Position of "Total Sum" text
    pdf.text(`รวมพนักงาน`, 45, y, { align: "right" }); // Position of total sum value
    pdf.text(`${allperson} คน`, 70, y, { align: "right" }); // Position of total sum value
    pdf.text(formattedTotalSum, x + 190, y, { align: "right" }); // Position of total sum value

    pdf.line(x, y - 3, 205, y - 3); // Line from (20, 50) to (190, 50)

    // Open the generated PDF in a new tab
    window.open(pdf.output("bloburl"), "_blank");
  };

  const generatePDFAudit = () => {
    // Create a new instance of jsPDF
    const pdf = new jsPDF(
      {
        format: "a4", // Set page size to A4
        unit: "mm",   // Use millimeters as the unit
        orientation: "portrait", // Orientation can be 'portrait' or 'landscape'
      }
    );

    // Add the Thai fonts to jsPDF
    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, "THSarabunNew", "normal");

    // Add bold font
    const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew-Bold", "Bold");

    // Set initial styles and positions
    const marginTop = 30;
    const marginBottom = 5;
    const pageHeight = pdf.internal.pageSize.height;
    const maxContentHeight = pageHeight - marginTop - marginBottom + 200;
    const itemsPerPage = Math.floor(maxContentHeight / 10); // Adjust row height (e.g., 10 for this example)
    const totalPages = Math.ceil(mergedData.length / itemsPerPage);
    let currentPage = 1;

    let y = marginTop;

    const x = 10;

    // Title and table headers
    pdf.setFont("THSarabunNew Bold", "normal");
    pdf.setFontSize(12);
    pdf.setLineWidth(0.6); // Set the line width
    pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
    pdf.text("ลำดับ", x, y);
    pdf.text("เลขที่บัญชี", x + 20, y);
    pdf.text("รหัสพนักงาน", x + 45, y);
    pdf.text("ชื่อ-นามสกุล", x + 90, y);
    pdf.text("ยอดเงิน", x + 180, y);
    pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)

    pdf.line(x, 290 - 5, 205, 290 - 5); // Line from (20, 50) to (190, 50)
    pdf.text(`พิมพ์วันที่ ${formattedDate321}`, x, 290);
    pdf.text(`รายงานโดน ${present}`, x + 30, 290);
    pdf.text(`แฟ้มรายงาน ${presentfilm}`, x + 80, 290);

    y += 5; // Move to the next line

    // Reset font for table content
    pdf.setFont("THSarabunNew", "normal");
    pdf.setFontSize(10);

    let totalSum = 0; // Variable to keep track of the total sum
    let allperson = 0; // Variable to keep track of the total sum

    // Loop through data and add rows
    mergedData.forEach((item, index) => {
      if ((index % itemsPerPage === 0) && index !== 0) {
        // Add footer with page number

        pdf.setFont("THSarabunNew Bold", "normal");
        pdf.setFontSize(12);
        y = marginTop;

        // Add a new page
        pdf.addPage();
        currentPage++;

        pdf.setLineWidth(0.6); // Set the line width
        pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
        pdf.text("ลำดับ", x, y);
        pdf.text("เลขที่บัญชี", x + 20, y);
        pdf.text("รหัสพนักงาน", x + 45, y);
        pdf.text("ชื่อ-นามสกุล", x + 90, y);
        pdf.text("ยอดเงิน", x + 180, y);
        pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)
        pdf.text(`หน้าที่ ${currentPage}/${totalPages}`, 200, 22, { align: "right" });
        // y = marginTop; // Reset y-coordinate for the new page

        pdf.line(x, 290 - 5, 205, 290 - 5); // Line from (20, 50) to (190, 50)
        pdf.text(`พิมพ์วันที่ ${formattedDate321}`, x, 290);
        pdf.text(`รายงานโดน ${present}`, x + 30, 290);
        pdf.text(`แฟ้มรายงาน ${presentfilm}`, x + 80, 290);
        y += 5; // Move to the next line
      }

      // Check if we need a new page

      pdf.text("บริษัท โอวาท โปร แอน์ ควิก จำกัด", 10, 10);
      pdf.text(`รายงานโอนเงินเข้าธนาคาร ${selectedBank}`, 10, 16);
      pdf.text(`สำหรับงวดวันที่ ${startFormattedDate321} ถึง ${endFormattedDate321}`, 10, 22);
      // pdf.text(`หน้าที่ ${currentPage}/${totalPages}`, 200, 22, { align: "right" });


      // if (y + 10 > maxContentHeight) {
      //   pdf.addPage();
      //   y = marginTop;

      //   // Add table headers on new page
      //   pdf.setFont("THSarabunNew Bold", "normal");
      //   pdf.setFontSize(12);

      //   pdf.setLineWidth(0.6); // Set the line width
      //   pdf.line(x, y - 5, 205, y - 5); // Line from (20, 50) to (190, 50)
      //   pdf.text("ลำดับ", x, y);
      //   pdf.text("เลขที่บัญชี", x + 20, y);
      //   pdf.text("รหัสพนักงาน", x + 45, y);
      //   pdf.text("ชื่อ-นามสกุล", x + 90, y);
      //   pdf.text("ยอดเงิน", x + 180, y);
      //   pdf.line(x, y + 2, 205, y + 2); // Line from (20, 50) to (190, 50)

      //   y += 5; // Move to the next line

      //   pdf.setFont("THSarabunNew", "normal");
      //   pdf.setFontSize(10);
      // }

      // Add row data
      // const fullName = `${item.name} ${item.lastName}`;
      // // const formattedTotal = Number(item.total.toLocaleString()); // Format total with commas
      // const formattedTotal = Number(item.total).toLocaleString(); // e.g., "123,456"

      const fullName = `${item.name ?? ""} ${item.lastName ?? ""}`;
      // const bankNumber = item.branchBank ?? "Unknown"; // Ensure bankNumber is defined
      const bankNumber = item.branchBank
        ? item.branchBank.match(/\d{3}-\d{1}-\d{5}-\d{1}/)?.[0] ?? "Unknown"
        : "Unknown";
      const employee = item.employeeId ?? "Unknown"; // Ensure bankNumber is defined
      // const formattedTotal = item.total?.toLocaleString() ?? "0";
      // const formattedTotal = item.accountingRecord.total?.toLocaleString() ?? "0";
      const formattedTotal = item.accountingRecord?.[0]?.total
        ? Number(item.accountingRecord[0].total)
        : 0;

      const formattedTotalAdvancePayment = item.deductSalary?.find((deduction) => deduction.id === "2124")
        ? Number(item.deductSalary.find((deduction) => deduction.id === "2124").amount)
        : 0;

      const sumTotalAndAdvancePayment = formattedTotal + formattedTotalAdvancePayment;

      const formattedSum = sumTotalAndAdvancePayment.toLocaleString();

      pdf.text((index + 1).toString(), x + 3, y, { align: "center" }); // NumberdeductSalary
      pdf.text(bankNumber, x + 20, y); // Bank Number (displayed as string)
      pdf.text(employee, x + 46, y); // Bank Number (displayed as string)
      pdf.text(fullName, x + 90, y); // Full Name
      pdf.text(formattedSum, x + 185, y, { align: "center" }); // 

      allperson = (index + 1).toString();
      // totalSum += Number(formattedTotal); // Add item total to the sum (ensure it's treated as a number)
      // totalSum += Number(item.accountingRecord?.[0]?.total || 0); // Ensure total is treated as a number
      totalSum += Number(formattedSum);
      y += 5; // Move to the next row
    });

    // Add total sum to the last page
    const formattedTotalSum = totalSum.toLocaleString(); // Format total with commas
    pdf.setFont("THSarabunNew Bold", "normal");
    // pdf.text("Total Sum:", x + 150, y); // Position of "Total Sum" text
    pdf.text(`รวมพนักงาน`, 45, y, { align: "right" }); // Position of total sum value
    pdf.text(`${allperson} คน`, 70, y, { align: "right" }); // Position of total sum value
    pdf.text(formattedTotalSum, x + 190, y, { align: "right" }); // Position of total sum value

    pdf.line(x, y - 3, 205, y - 3); // Line from (20, 50) to (190, 50)

    // Open the generated PDF in a new tab
    window.open(pdf.output("bloburl"), "_blank");
  };

  const exportToExcel = () => {
    // Define the headers
    const headers = ["ลำดับ", "เลขบัญชี", "รหัสพนักงาน", "ชื่อ-นามสกุล", "ยอดเงิน"];

    // Prepare the data
    const data = mergedData.map((item, index) => [
      index + 1, // ลำดับ
      item.banknumber, // เลขบัญชี
      item.employee, // รหัสพนักงาน
      `${item.name} ${item.lastName}`, // ชื่อ-นามสกุล
      item.total, // ยอดเงิน
    ]);

    // Combine headers and data
    const worksheetData = [headers, ...data];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Data");

    // Export to Excel file
    XLSX.writeFile(workbook, "SalaryData.xlsx");
  };

const BankReportPDF = () => {
  console.log("ข้อมูลพนักงานที่สมบูรณ์:", completeEmployeeData.length);

  // คำนวณยอดรวม sumCashWork จากข้อมูลที่กรองแล้ว
  const totalCashAmount = completeEmployeeData.reduce((sum, item) => {
    const cashAmount = item.sumCashWork 
      ? Number(item.sumCashWork) 
      : 0;
    return sum + cashAmount;
  }, 0);

  // ถ้าไม่มีข้อมูลหลังการกรอง แสดงหน้า PDF ว่างพร้อมข้อความแจ้ง
  if (completeEmployeeData.length === 0) {
    return (
      <Document>
        <Page size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', fontFamily: 'THSarabunNew-Bold'}}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
            <Text style={{fontSize: 14 ,fontWeight: 'bold'}}>รายงานโอนเงินเข้าธนาคาร {selectedBank}</Text>
            <Text style={{fontSize: 12}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
            <Text style={{fontSize: 14, marginTop: 30, textAlign: 'center'}}>
              ไม่พบข้อมูลพนักงานที่มีธนาคาร {selectedBank} ในเดือน {month} ปี {year}
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  // คำนวณจำนวนหน้าทั้งหมด (35 รายการต่อหน้า)
  const itemsPerPage = 35;
  const totalPages = Math.ceil(completeEmployeeData.length / itemsPerPage);
  
  // สร้าง array ของหน้าต่างๆ
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Document>
      {pages.map((pageNum) => {
        // คำนวณว่าหน้านี้จะแสดงข้อมูลรายการที่เท่าไหร่
        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, completeEmployeeData.length);
        
        // สร้าง array ของข้อมูลที่จะแสดงในหน้านี้
        const pageItems = completeEmployeeData.slice(startIndex, endIndex);
        
        // หน้าสุดท้ายหรือไม่
        const isLastPage = pageNum === totalPages;
        
        return (
          <Page key={pageNum} size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
            <View style={{marginBottom: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <View>
                <Text style={{fontSize: 16,fontFamily:'THSarabunNew' }}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
                <Text style={{fontSize: 14,  fontWeight: 'bold', fontFamily: 'THSarabunNew' }}>รายงานโอนเงินเข้า {selectedBank}</Text>
                <Text style={{fontSize: 10}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
              </View>
              <Text style={{fontSize: 10}}>หน้าที่ {pageNum}/{totalPages}</Text>
            </View>
            
            <View>
              <View style={{flexDirection: 'row', fontWeight:'bold', borderBottomWidth: 1, borderTopWidth: 1.5, fontSize: 12, padding: 5}}>
                <Text style={{width: '10%'}}>ลำดับ</Text>
                <Text style={{width: '18%'}}>เลขที่บัญชี</Text>
                <Text style={{width: '20%'}}>รหัสพนักงาน</Text>
                <Text style={{width: '45%'}}>ชื่อ-นามสกุล</Text>
                <Text style={{width: '5%' ,textAlign:'center', paddingLeft:'8px'}}>ยอดเงิน</Text>
              </View>
              
              {pageItems.map((item, index) => {
                // ดึงข้อมูลละเอียดจาก employeeDetails
                const employeeDetails = item.employeeDetails;
                
                const employeeprefix = employeeDetails?.prefix || 'N/A';
                const employeeName = employeeDetails?.name || 'N/A';
                const employeeLastName = employeeDetails?.lastName || 'N/A';
                
                // ดึงเลขบัญชีจากข้อมูลละเอียด
                const bankAccount = 
                  employeeDetails?.banknumber || 
                  employeeDetails?.bankaccount || 
                  employeeDetails?.bankNumber || 
                  employeeDetails?.bankAccount || 
                  (employeeDetails?.branchBank && 
                    employeeDetails.branchBank.match(/\d{3}-\d{1}-\d{5}-\d{1}/)?.[0]) || 
                  'N/A';
                
                // ลำดับจริงในข้อมูลทั้งหมด
                const actualIndex = startIndex + index;
                
                return (
                  <View key={index} style={{flexDirection: 'row', fontSize: 12, borderBottomColor: '#000', padding: 1}}>
                    <Text style={{width: '10%', paddingLeft: '10px'}}>{actualIndex + 1}</Text>
                    <Text style={{width: '18%', paddingLeft: '3px'}}>{bankAccount}</Text>
                    <Text style={{width: '20%', paddingLeft: '3px'}}>{item.employeeId || 'N/A'}</Text>
                    <Text style={{width: '45%'}}>
                      {employeeName} {employeeLastName} 
                    </Text>
                    <Text style={{width: '7%' ,}}>
                      {item.employeeDetails ? 
                        (() => {
                          const accountingResult = [item];
                          
                          const incomeTotal = 
                            parseFloat(item.sumCashWork || '0') + 
                            parseFloat(item.sumCashOt || '0') +
                            parseFloat(item.cashSpecialDay || '0') + 
                            parseFloat(
                              item.addSalaryList?.reduce(
                                (total, addItem) => total + parseFloat(addItem.SpSalary || '0'),
                                0
                              ) || '0'
                            );

                          const deductionTotal =
                            parseFloat(item.socialSecurity || '0') +
                            parseFloat(item.tax || '0');

                          const netTotal = incomeTotal - deductionTotal;

                          return isNaN(netTotal)
                            ? '฿0.00'
                            : `${netTotal.toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}`;
                        })() 
                        : (item.sumCashWork 
                            ? `฿${Number(item.sumCashWork).toLocaleString()}` 
                            : '฿0.00')}
                    </Text>
                    
                  </View>
                );
              })}
              
              {/* แสดงยอดรวมเฉพาะหน้าสุดท้าย */}
              {isLastPage && (
                <View style={{flexDirection: 'row', fontSize: 12, borderTopWidth: 1, borderTopColor: '#000', padding: 1, marginTop: 5}}>
                  <Text style={{width: '10%'}}></Text>
                  <Text style={{width: '13%' , fontWeight: 'bold'}}>รวมพนักงาน</Text>
                  <Text style={{width: '20%' , fontWeight: 'bold'}}>{completeEmployeeData.length} คน</Text>
                  <Text style={{width: '10%'}}></Text>
                  <Text style={{width: '39%', fontWeight: 'bold'}}></Text>
                  <Text style={{width: '6%', fontWeight: 'bold'}}>{totalCashAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                </View>
              )}
            </View>
            
            <View style={{position: 'absolute',borderTop:'1', bottom: 30, left: 30, right: 30}}>
              <Text style={{fontSize: 10 }}>พิมพ์วันที่ {formattedDate321}                                   รายงานโดย {present}                         แฟ้มรายงาน {presentfilm}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};


  return (
  <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">
        {/* <!-- Content Header (Page header) --> */}
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <i className="fas fa-home"></i> <span>หน้าหลัก</span>
          </li>
          <li className="breadcrumb-item">
            <span> ระบบเงินเดือน</span>
          </li>
          <li className="breadcrumb-item active">ออกรายงานธนาคาร</li>
        </ol>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <h1 className="m-0">
                <i className="far fa-arrow-alt-circle-right"></i> ออกรายงานธนาคาร
              </h1>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <h2 className="title">ออกรายงานธนาคาร</h2>
            <section className="Frame">
              <div className="form-group">
                {/* Conditionally render content based on the selected option */}
                <div>
                  <div className="row">
                    <div className="col-md-3">
                      <label role="searchEmployeeId">ธนาคาร</label>
                       <select
                      className="form-control"
                      value={selectedBank}
                      onChange={handleChange}
                    >
                    <option value="ธนาคารกรุงเทพ (มหาชน)">
                                      ธนาคาร กรุงเทพ (มหาชน)
                                    </option>
                                    <option value="ธนาคารกสิกรไทย (มหาชน)">
                                      ธนาคาร กสิกรไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารกรุงไทย (มหาชน)">
                                      ธนาคาร กรุงไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารทหารไทยธนชาต (มหาชน)">
                                      ธนาคาร ทหารไทยธนชาต (มหาชน)
                                    </option>
                                    <option value="ธนาคารไทยพาณิชย์ (มหาชน)">
                                      ธนาคาร ไทยพาณิชย์ (มหาชน)
                                    </option>
                                    <option value="ธนาคารกรุงศรีอยุธยา (มหาชน)">
                                      ธนาคาร กรุงศรีอยุธยา (มหาชน)
                                    </option>
                                    <option value="ธนาคารเกียรตินาคินภัทร (มหาชน)">
                                      ธนาคาร เกียรตินาคินภัทร (มหาชน)
                                    </option>
                                    <option value="ธนาคารซีไอเอ็มบีไทย (มหาชน)">
                                      ธนาคาร ซีไอเอ็มบีไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารทิสโก้ (มหาชน)">
                                      ธนาคาร ทิสโก้ (มหาชน)
                                    </option>
                                    <option value="ธนาคารยูโอบี (มหาชน)">
                                      ธนาคาร ยูโอบี (มหาชน)
                                    </option>
                                    <option value="ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)">
                                      ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)
                                    </option>
                                    <option value="ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)">
                                      ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)
                                    </option>
                                    <option value="ธนาคารไอซีบีซี (ไทย)">
                                      ธนาคาร ไอซีบีซี (ไทย)
                                    </option>
                                    <option value="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย">
                                      ธนาคาร พัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">
                                      ธนาคาร เพื่อการเกษตรและสหกรณ์การเกษตร
                                    </option>
                                    <option value="ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย">
                                      ธนาคาร เพื่อการส่งออกและนำเข้าแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารออมสิน">
                                      ธนาคาร ออมสิน
                                    </option>
                                    <option value="ธนาคารอาคารสงเคราะห์">
                                      ธนาคาร อาคารสงเคราะห์
                                    </option>
                    </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3">
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

                  <div className="col-md-3">
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
              <br />
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label role="datetime">งวด</label>
                  <div
                    onClick={startToggleDatePicker}
                    style={{
                      position: "relative",
                      zIndex: 9999,
                      marginLeft: "0rem",
                    }}
                  >
                    <FaCalendarAlt size={20} />
                    <span style={{ marginLeft: "8px" }}>
                      {startFormattedDate321 ? startFormattedDate321 : "Select Date"}
                    </span>
                  </div>

                  {startShowDatePicker && (
                    <div style={{ position: "absolute", zIndex: 1000 }}>
                      <ThaiDatePicker
                        className="form-control"
                        value={startSelectedDate}
                        onChange={handleDatePickerStartChange}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-1">ถึง</div>
                <div className="col-md-3">
                  <label role="datetime"></label>
                  <div
                    onClick={enDToggleDatePicker}
                    style={{
                      position: "relative",
                      zIndex: 9999,
                      marginLeft: "0rem",
                    }}
                  >
                    <FaCalendarAlt size={20} />
                    <span style={{ marginLeft: "8px" }}>
                      {endFormattedDate321 ? endFormattedDate321 : "Select Date"}
                    </span>
                  </div>

                  {endShowDatePicker && (
                    <div style={{ position: "absolute", zIndex: 1000 }}>
                      <ThaiDatePicker
                        className="form-control"
                        value={endSelectedDate}
                        onChange={handleDatePickerEndChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                  <label role="datetime">พิมพ์วันที่</label>
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
                <div className="col-md-3">
                  <label role="datetime">ลงชื่อ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchWorkplaceId"
                    placeholder="รายงานโดย"
                    value={present}
                    onChange={(e) => setPresent(e.target.value)}
                  />
                </div>
                

                <div className="col-md-3">
                  <label role="datetime">รหัส</label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchWorkplaceId"
                    placeholder="แฟ้มรายงาน"
                    value={presentfilm}
                    onChange={(e) => setPresentfilm(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                  <button onClick={generatePDF} className="btn b_save">
                    ออกรายงานธนาคาร
                  </button>
                </div>
                <div className="col-md-3">
                  <button onClick={generatePDFAudit} className="btn b_save">
                    ออกรายงานธนาคาร(ออดิท)
                  </button>
                </div>
                <div className="col-md-3">
                  <button onClick={() => setShowPdfPreview(!showPdfPreview)} className="btn b_save">
                    {showPdfPreview ? "ซ่อนตัวอย่าง" : "แสดงตัวอย่าง PDF"}
                  </button>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                  <button onClick={exportToExcel} className="btn b_save">ออก Excel</button>
                </div>
              </div>
              
              {/* เพิ่มส่วนแสดงตัวอย่าง PDF */}
              {showPdfPreview && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">ตัวอย่างรายงาน PDF</h3>
                      </div>
                      <div className="card-body">
                        <div style={{ height: '600px', border: '1px solid #dee2e6', borderRadius: '0.25rem' }}>
                          <PDFViewer width="100%" height="100%">
                            <BankReportPDF />
                          </PDFViewer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  </div>
);
}

export default BackReport;
