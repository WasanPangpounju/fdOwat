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

  const [dataAccounting, setDataAccounting] = useState(""); //รหัสหน่วยงาน
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน
  console.log('filteredEmployeeList', filteredEmployeeList);

  const extractBankNames = (list) => {
    const bankNames = list
      .map((employee) => {
        if (employee.branchBank) {
          return employee.branchBank.split(/\d/)[0].trim(); // Extract text before the first number
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
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedBank(selectedValue);

    // Filter filteredEmployeeList based on the selected bank
    const filteredData = filteredEmployeeList.filter((employee) => {
      if (employee.branchBank) {
        const bankName = employee.branchBank.split(/\d/)[0].trim();
        return bankName === selectedValue;
      }
      return false;
    });

    setResponseDataAll(filteredData); // Update filtered data
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
            <li class="breadcrumb-item active">ออกรายงานธนาคาร</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ออกรายงานธนาคาร
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ออกรายงานธนาคาร</h2>
              <section class="Frame">
                <div class="form-group">

                  {/* Conditionally render content based on the selected option */}
                  <div>
                    <div class="row">
                      <div class="col-md-3">
                        <label role="searchEmployeeId">ธนาคาร</label>
                        <select
                          id="salarybank"
                          name="salarybank"
                          className="form-control"
                          value={selectedBank}
                          onChange={handleChange}
                        >
                          {/* <option value="">ไม่ระบุ</option>
                          <option value="ธนาคารกรุงเทพ">
                            ธนาคาร กรุงเทพ
                          </option>
                          <option value="ธนาคารกสิกรไทย">
                            ธนาคาร กสิกรไทย
                          </option>
                          <option value="ธนาคารกรุงไทย">
                            ธนาคาร กรุงไทย
                          </option>
                          <option value="ธนาคารทหารไทยธนชาต">
                            ธนาคาร ทหารไทยธนชาต
                          </option>
                          <option value="ธนาคารไทยพาณิชย์">
                            ธนาคาร ไทยพาณิชย์
                          </option>
                          <option value="ธนาคารกรุงศรีอยุธยา">
                            ธนาคาร กรุงศรีอยุธยา
                          </option>
                          <option value="ธนาคารเกียรตินาคินภัทร">
                            ธนาคาร เกียรตินาคินภัทร
                          </option>
                          <option value="ธนาคารซีไอเอ็มบีไทย">
                            ธนาคาร ซีไอเอ็มบีไทย
                          </option>
                          <option value="ธนาคาร ทิสโก้">
                            ธนาคาร ทิสโก้
                          </option>
                          <option value="ธนาคารยูโอบี">
                            ธนาคาร ยูโอบี
                          </option>
                          <option value="ธนาคารไทยเครดิตเพื่อรายย่อย">
                            ธนาคาร ไทยเครดิตเพื่อรายย่อย
                          </option>
                          <option value="ธนาคารแลนด์ แอนด์ เฮ้าส์">
                            ธนาคาร แลนด์ แอนด์ เฮ้าส์
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
                          </option> */}
                          {uniqueBankNames.map((bankName, index) => (
                            <option key={index} value={bankName}>
                              {bankName}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>


                  <div class="row">
                    <div class="col-md-3">
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

                    <div class="col-md-3">
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
                <div class="row align-items-end">
                  <div class="col-md-3">
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
                  <div class="col-md-1">
                    ถึง</div>
                  <div class="col-md-3">
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
                <div class="row ">
                  <div class="col-md-3">
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
                <div class="row">
                  <div class="col-md-3">
                    <button onClick={generatePDF} class="btn b_save">
                      ออกรายงานธนาคาร
                    </button>
                  </div>
                  <div class="col-md-3">
                    <button onClick={generatePDFAudit} class="btn b_save">
                      ออกรายงานธนาคาร(ออดิท)
                    </button>
                  </div>

                </div>
                <br />
                <div class="row">
                  <div class="col-md-3">
                    <button onClick={exportToExcel} class="btn b_save">ออก Excel</button>

                  </div>

                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    {/* </body> */}
    </div>
  );
}

export default BackReport;
