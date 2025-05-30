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

  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [bankEmployees, setBankEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dataAccounting, setDataAccounting] = useState(""); //รหัสหน่วยงาน
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน
  console.log('filteredEmployeeList', filteredEmployeeList);

  useEffect(() => {
  const fetchBankNames = async () => {
    try {
      // เรียกใช้ API เพื่อดึงข้อมูลพนักงานทั้งหมด
      const response = await axios.post(endpoint + "/employee/search", {});
      
      if (response.data && response.data.employees) {
        // รวบรวมชื่อธนาคาร (salarybank) ที่ไม่ซ้ำกัน
        const bankNames = response.data.employees
          .map(employee => employee.salarybank)
          .filter(name => name) // กรองค่า null หรือ undefined ออก
          .map(name => name.trim()); // ตัดช่องว่างหน้า-หลัง
        
        // กำจัดค่าที่ซ้ำกัน
        const uniqueBankNames = [...new Set(bankNames)];
        
        // เรียงลำดับตามตัวอักษร
        uniqueBankNames.sort();
        
        setAllBankNames(uniqueBankNames);
      }
    } catch (error) {
      console.error("Error fetching bank names:", error);
    }
  };

  fetchBankNames();
}, []);

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

  useEffect(() => {
    const fetchData = async () => {
      const dataTest = {
        year: year,
        month: month,
      };
  
      try {
        const response = await axios.post(endpoint + "/accounting/calsalarylist", dataTest);
        const responseData = response.data;
  
        setDataAccounting(responseData);
  
        // Add any code here that should run after setDataAccounting
        console.log("Data has been set:", responseData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [year, month]);
  

  console.log('dataAccounting', dataAccounting);

  // Handle dropdown change
 // ฟังก์ชัน handleChange สำหรับการเลือกธนาคาร
// ฟังก์ชัน handleChange สำหรับการเลือกธนาคาร
// ฟังก์ชัน handleChange สำหรับการเลือกธนาคาร
const handleChange = async (event) => {
  const selectedValue = event.target.value;
  setSelectedBank(selectedValue);
  setBankFullName(selectedValue); // ใช้ชื่อธนาคารที่เลือกเป็นชื่อเต็มเลย
  setIsLoading(true);

  try {
    // สร้างข้อมูลสำหรับส่งไปยัง API employee/search
    const searchData = {
      salarybank: selectedValue // ใช้ชื่อธนาคารที่เลือกเป็นเงื่อนไขในการค้นหา
    };

    // เรียกใช้ API employee/search
    const response = await axios.post(endpoint + "/employee/search", searchData);
    
    if (response.data && response.data.employees) {
      // กรองข้อมูลพนักงานที่มี salarybank ตรงกับที่เลือก
      const filteredEmployees = response.data.employees.filter(employee => 
        employee.salarybank === selectedValue
      );
      
      console.log("พบข้อมูลพนักงาน:", filteredEmployees.length, "คน");
      
      // รวมข้อมูลพนักงานกับข้อมูลบัญชี
      const mergedEmployeeData = filteredEmployees.map((employee) => {
        const accounting = dataAccounting.find(
          (record) => record.employeeId === employee.employeeId
        );
        
        return { 
          ...employee, 
          accountingRecord: accounting ? accounting.accountingRecord : [] 
        };
      });

      // อัปเดตข้อมูลที่จะแสดงในรายงาน
      setResponseDataAll(mergedEmployeeData);
    } else {
      console.log("ไม่พบข้อมูลพนักงานสำหรับธนาคารที่เลือก");
      setResponseDataAll([]);
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
    const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

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
    pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

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
  // คำนวณยอดรวม
  const totalAmount = mergedData.reduce((sum, item) => {
    const amount = item.accountingRecord?.[0]?.total 
      ? Number(item.accountingRecord[0].total) 
      : 0;
    return sum + amount;
  }, 0);

  return (
    <Document>
      <Page size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
        <View style={{marginBottom: 20}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
          <Text style={{fontSize: 14}}>รายงานโอนเงินเข้าธนาคาร {selectedBank}</Text>
          <Text style={{fontSize: 12}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
        </View>
        
        <View style={{marginBottom: 10}}>
          <View style={{flexDirection: 'row', borderBottomWidth: 1, padding: 5, backgroundColor: '#e4e4e4'}}>
            <Text style={{flex: 0.5}}>ลำดับ</Text>
            <Text style={{flex: 1.5}}>เลขที่บัญชี</Text>
            <Text style={{flex: 1}}>รหัสพนักงาน</Text>
            <Text style={{flex: 2}}>ชื่อ-นามสกุล</Text>
            <Text style={{flex: 1}}>ยอดเงิน</Text>
          </View>
          
          {mergedData.length > 0 ? (
            mergedData.map((item, index) => (
              <View key={index} style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#cccccc', padding: 5}}>
                <Text style={{flex: 0.5}}>{index + 1}</Text>
                <Text style={{flex: 1.5}}>{item.banknumber || 'N/A'}</Text>
                <Text style={{flex: 1}}>{item.employeeId || 'N/A'}</Text>
                <Text style={{flex: 2}}>{`${item.name || ''} ${item.lastName || ''}`}</Text>
                <Text style={{flex: 1}}>{item.accountingRecord?.[0]?.total ? `฿${Number(item.accountingRecord[0].total).toLocaleString()}` : '฿0.00'}</Text>
              </View>
            ))
          ) : (
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#cccccc', padding: 5}}>
              <Text style={{flex: 1, textAlign: 'center'}}>ไม่พบข้อมูลพนักงาน</Text>
            </View>
          )}
          
          {mergedData.length > 0 && (
            <View style={{flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#000', padding: 5, marginTop: 10}}>
              <Text style={{flex: 0.5}}></Text>
              <Text style={{flex: 1.5}}></Text>
              <Text style={{flex: 1, fontWeight: 'bold'}}>รวมพนักงาน</Text>
              <Text style={{flex: 2, fontWeight: 'bold'}}>{mergedData.length} คน</Text>
              <Text style={{flex: 1, fontWeight: 'bold'}}>฿{totalAmount.toLocaleString()}</Text>
            </View>
          )}
        </View>
        
        <View style={{position: 'absolute', bottom: 30, left: 30, right: 30}}>
          <Text style={{fontSize: 10}}>พิมพ์วันที่ {formattedDate321} - รายงานโดย {present}</Text>
        </View>
      </Page>
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
            <i className="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#"> ระบบเงินเดือน</a>
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
                  id="salarybank"
                  name="salarybank"
                  className="form-control"
                  value={selectedBank}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="">เลือกธนาคาร</option>
                  {/* ใช้ allBankNames แทน uniqueBankNames หากใช้วิธีดึงจาก API */}
                  {allBankNames.map((bankName, index) => (
                    <option key={index} value={bankName}>
                      {bankName}
                    </option>
                  ))}
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
