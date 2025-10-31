import endpoint from "../../config";
import { Await, json, Link } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import EmployeesSelected from "./EmployeesSelected";

// Helper function to safely get the first element from a filtered array
const safeGetFirstShift = (filteredArray) => {
  return filteredArray.length > 0 ? filteredArray[0] : null;
};

function AddsettimeEmployee() {
  const [isDataTrue, setIsDataTrue] = useState(false);
  const linkRef = useRef(null);
  const [loading, setLoading] = useState(false); // Create loading state

  // Effect to auto-click the Link when data is true
  useEffect(() => {
    if (isDataTrue) {
      linkRef.current.click(); // Programmatically click the link when isDataTrue is true
    }
  }, [isDataTrue]);

  const bordertable = {
    borderLeft: "0.3px solid #000",
  };

  // Function to generate PDF report
const generatePDFReport = async () => {
  try {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let tableElement = null;
    const allTables = document.querySelectorAll('table');
    console.log('Found tables:', allTables.length);
    
    // เลือกตารางที่สอง (ตารางล่าง) ซึ่งมีปุ่มจัดการ
    for (let i = 0; i < allTables.length; i++) {
      const table = allTables[i];
      const hasActionButtons = table.querySelector('button[title="แก้ไข"], button[title="ลบ"]');
      const hasManageColumn = table.textContent.includes('จัดการ');
      
      if (hasActionButtons || hasManageColumn) {
        tableElement = table;
        console.log('Found data table at index:', i);
        break;
      }
    }

    if (!tableElement && allTables.length >= 2) {
      tableElement = allTables[1];
    }

    if (!tableElement) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบตารางข้อมูล',
        text: 'กรุณาตรวจสอบว่ามีข้อมูลในตารางหรือไม่',
      });
      return;
    }

    // สร้าง container ชั่วคราวสำหรับรายงาน PDF
    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.top = '0';
    reportContainer.style.width = '190mm';
    reportContainer.style.padding = '20px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.fontFamily = "'Sarabun', 'TH Sarabun New', Arial, sans-serif";

    // สร้างหัวเอกสารตามรูปแบบที่ต้องการ
    const documentHeader = document.createElement('div');
    documentHeader.style.marginBottom = '20px';
    documentHeader.style.position = 'relative';

    // ส่วนหัวด้านขวาบน (วันที่ออกเอกสาร) - เพิ่มกรอบสี่เหลี่ยม
    const dateSection = document.createElement('div');
    dateSection.style.position = 'absolute';
    dateSection.style.top = '0';
    dateSection.style.right = '0';
    dateSection.style.textAlign = 'center';
    dateSection.style.fontSize = '12px';
    dateSection.style.border = '0.3px solid #000';
    dateSection.style.padding = '10px';
    dateSection.style.width = '150px';
    dateSection.style.backgroundColor = '#f8f9fa';
    dateSection.style.top = '-60px';
    
    const generatedDate = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const dateLabel = document.createElement('div');
    dateLabel.textContent = 'วันที่ออกเอกสาร';
    dateLabel.style.marginBottom = '5px';
    
    const dateValue = document.createElement('div');
    dateValue.textContent = generatedDate;
    
    dateSection.appendChild(dateLabel);
    dateSection.appendChild(dateValue);
    documentHeader.appendChild(dateSection);

   // ส่วนโลโก้และข้อมูลบริษัท (ตรงกลางทั้งหมด)
    const companySection = document.createElement('div');
    companySection.style.marginTop = '40px';
    companySection.style.display = 'flex';
    companySection.style.flexDirection = 'column'; // ✅ เรียงแนวตั้ง
    companySection.style.alignItems = 'center';    // ✅ จัดทุกอย่างให้อยู่ตรงกลาง
    companySection.style.textAlign = 'center';     // ✅ ข้อความกลาง

    // เพิ่มโลโก้บริษัท
    const logoContainer = document.createElement('div');
    logoContainer.style.marginBottom = '10px'; // ✅ เพิ่มช่องว่างระหว่างโลโก้กับข้อความ

    const logoImg = document.createElement('img');
    logoImg.src = '/src/assets/images/OwatIcon.png';
    logoImg.alt = 'Owat Maid Logo';
    logoImg.style.width = '150px';
    logoImg.style.height = '70px';
    logoImg.style.objectFit = 'contain';

    // ถ้ารูปไม่โหลด ให้ใช้ fallback
    logoImg.onerror = function() {
      console.log('Logo not found, using fallback');
      this.style.display = 'none';
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.width = '80px';
      fallbackDiv.style.height = '80px';
      fallbackDiv.style.backgroundColor = '#e9ecef';
      fallbackDiv.style.border = '0.3px solid #dee2e6';
      fallbackDiv.style.display = 'flex';
      fallbackDiv.style.alignItems = 'center';
      fallbackDiv.style.justifyContent = 'center';
      fallbackDiv.style.fontSize = '10px';
      fallbackDiv.style.color = '#6c757d';
      fallbackDiv.textContent = 'โลโก้';
      logoContainer.appendChild(fallbackDiv);
    };

    logoContainer.appendChild(logoImg);

    // ข้อมูลบริษัท
    const companyInfo = document.createElement('div');
    companyInfo.style.maxWidth = '600px'; // ✅ จำกัดความกว้างให้อ่านง่าย

    const companyName = document.createElement('div');
    companyName.textContent = 'บริษัท โอวาทเมด จํากัด (OWAT PRO AND QUICK COMPANY LIMITED)';
    companyName.style.fontWeight = 'bold';
    companyName.style.fontSize = '14px';
    companyName.style.marginBottom = '5px';

    const companyAddress = document.createElement('div');
    companyAddress.textContent = '20,22,24,26 ซอยสีหบุรานุกิจ 4 ถนนสีหบุรานุกิจ แขวงมีนบุรี เขตมีนบุรี กรุงเทพมหานคร 10510';
    companyAddress.style.fontSize = '12px';
    companyAddress.style.marginBottom = '10px';

    const reportTitle = document.createElement('div');
    reportTitle.textContent = `รายงานระบบลงเวลาของพนักงาน ${name} ${lastName} รหัสพนักงาน ${employeeId}`;
    reportTitle.style.fontWeight = 'bold';
    reportTitle.style.fontSize = '14px';
    reportTitle.style.marginBottom = '5px';

    const periodInfo = document.createElement('div');

    companyInfo.appendChild(companyName);
    companyInfo.appendChild(companyAddress);
    companyInfo.appendChild(reportTitle);
    companyInfo.appendChild(periodInfo);

    companySection.appendChild(logoContainer);
    companySection.appendChild(companyInfo);
    documentHeader.appendChild(companySection);

    reportContainer.appendChild(documentHeader);


        // สร้างตารางใหม่สำหรับ PDF โดยทำการ merge เซลล์ให้ถูกต้อง
        const pdfTable = document.createElement('table');
        pdfTable.style.width = '100%';
        pdfTable.style.borderCollapse = 'separate';
        pdfTable.style.fontSize = '10px';
        pdfTable.style.border = '0.3px solid #000';
        pdfTable.style.textAlign = 'center';
        pdfTable.style.marginTop = '20px';

        // สร้าง thead สำหรับ PDF
        const pdfThead = document.createElement('thead');
        
        // แถวแรกของหัวตาราง (merge เซลล์)
        const firstHeaderRow = document.createElement('tr');
        
        const headers = [
          { text: 'หน่วยงาน', rowSpan: 2, colSpan: 1 },
          { text: 'ชื่อหน่วยงาน', rowSpan: 2, colSpan: 1 },
          { text: 'กลุ่มงาน', rowSpan: 2, colSpan: 1 },
          { text: 'วันที่', rowSpan: 2, colSpan: 1 },
          { text: 'กะ', rowSpan: 2, colSpan: 1 },
          { text: 'OT (ก่อนเวลาทำงาน)', rowSpan: 1, colSpan: 3 },
          { text: 'เวลาทำงาน', rowSpan: 1, colSpan: 3 },
          { text: 'OT (หลังเวลาทำงาน)', rowSpan: 1, colSpan: 3 },
          { text: 'เงินจ้าง', rowSpan: 2, colSpan: 1 }
        ];

        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header.text;
          th.style.border = '0.3px solid #000';
          th.style.padding = '8px';
          th.style.backgroundColor = '#f8f9fa';
          th.style.fontWeight = 'bold';
          th.style.textAlign = 'center';
          th.style.verticalAlign = 'middle';
          
          if (header.rowSpan > 1) th.rowSpan = header.rowSpan;
          if (header.colSpan > 1) th.colSpan = header.colSpan;
          
          firstHeaderRow.appendChild(th);
        });
        
        pdfThead.appendChild(firstHeaderRow);

        // แถวที่สองของหัวตาราง
        const secondHeaderRow = document.createElement('tr');
        const subHeaders = [
          'เข้า OT', 'ออก OT', 'ชั่วโมง OT',
          'เข้างาน', 'ออกงาน', 'ชั่วโมงทำงาน',
          'เข้า OT', 'ออก OT', 'ชั่วโมง OT'
        ];

        subHeaders.forEach(subHeader => {
          const th = document.createElement('th');
          th.textContent = subHeader;
          th.style.border = '0.3px solid #000';
          th.style.padding = '8px';
          th.style.backgroundColor = '#f8f9fa';
          th.style.fontWeight = 'bold';
          th.style.textAlign = 'center';
          th.style.verticalAlign = 'middle';
          secondHeaderRow.appendChild(th);
        });

        pdfThead.appendChild(secondHeaderRow);
        pdfTable.appendChild(pdfThead);

        // สร้าง tbody สำหรับ PDF
        const pdfTbody = document.createElement('tbody');
        
        // คัดลอกข้อมูลจากตารางเดิม (ยกเว้นคอลัมน์จัดการ)
        const bodyRows = tableElement.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
          if (row.children.length > 0) {
            const newRow = document.createElement('tr');
            const cells = row.querySelectorAll('td, th');
            
            cells.forEach((cell, cellIndex) => {
              // ข้ามคอลัมน์ "จัดการ" (คอลัมน์สุดท้าย)
              if (cellIndex < cells.length - 1) {
                const newCell = document.createElement('td');
                newCell.textContent = cell.textContent.trim();
                newCell.style.border = '0.3px solid #000';
                newCell.style.padding = '6px';
                newCell.style.textAlign = 'center';
                newCell.style.verticalAlign = 'middle';
                
                // ถ้าเป็นคอลัมล์เงินจ้าง ให้จัดรูปแบบ
                if (cellIndex === cells.length - 2) {
                  const salaryText = cell.textContent.trim();
                  if (salaryText.includes('บาท')) {
                    newCell.style.fontWeight = 'bold';
                    newCell.style.color = '#d9534f';
                  }
                }
                
                newRow.appendChild(newCell);
              }
            });
            
            pdfTbody.appendChild(newRow);
          }
        });

        pdfTable.appendChild(pdfTbody);
        reportContainer.appendChild(pdfTable);
        // เพิ่ม container ลงใน body ชั่วคราว
        document.body.appendChild(reportContainer);

        // ใช้ html2canvas เพื่อแปลง HTML เป็น canvas
        const canvas = await html2canvas(reportContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: -window.scrollY,
          backgroundColor: '#ffffff'
        });

        // ลบ container ชั่วคราว
        document.body.removeChild(reportContainer);

        // สร้าง PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // เพิ่มรูปภาพจาก canvas
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // เพิ่มหน้าต่อไปหากเนื้อหายาว
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // บันทึก PDF
        pdf.save(`รายงานการทำงาน_${employeeId}_${month}_${year}.pdf`);
        
        Swal.fire({
          icon: 'success',
          title: 'สร้างเอกสารสำเร็จ',
          text: 'ไฟล์ PDF ได้ถูกดาวน์โหลดแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
        
      } catch (error) {
        console.error('Error generating PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถสร้างเอกสาร PDF ได้: ' + error.message,
        });
      } finally {
        setLoading(false);
      }
    };

  const [cashSalary, setCashSalary] = useState(false);
  const [specialtSalary, setSpecialtSalary] = useState("");
  const [specialtSalaryOT, setSpecialtSalaryOT] = useState("");
  
  const [cashOfHoliday, setCashOfHoliday] = useState("");
  const [cashOfHolidayOt, setCashOfHolidayOt] = useState("");

  const [messageSalary, setMessageSalary] = useState("");

  const handleCheckboxChange = () => {
    setCashSalary(!cashSalary); // Toggle the checkbox state
  };

  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [updateButton, setUpdateButton] = useState(false); // Initially, set to false
  const [timeRecord_id, setTimeRecord_id] = useState("");

  // Edit mode states
  const [editMode, setEditMode] = useState({}); // Object to track which rows are in edit mode
  const [editData, setEditData] = useState({}); // Object to store edit data for each row

  const [newWorkplace, setNewWorkplace] = useState(true);

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  useEffect(() => {
    const event = new Event('submit'); // Creating a synthetic event object
    handleSearch(event); // Call handleSearch with the event

    if (name !== "") {
      setCheckaddData("");

      handleCheckTimerecord();
    }
  }, [month, year]);

  const [options , setOptions] = useState([]);
  const [lastDate , setLastDate] = useState(31);
  const [groupOptions , setGroupOptions ] = useState([]);
  const [groupOptions1 , setGroupOptions1 ] = useState();

  const getLastMonthLastDate = (year, month) => {
    let date = new Date(year, month - 1, 1); // JavaScript months are 0-based
    date.setDate(0); // Moves to the last day of the previous month
    return date.getDate();
};

const generateOptions = async (year, month) => {
    const lastDay = await getLastMonthLastDate(year, month);
let tmp = [];

setLastDate(lastDay);
    for (let i = 21; i <= lastDay; i++) {
      const formattedValue = await i.toString().padStart(2, "0");
      await tmp.push(
        <option key={i} value={formattedValue}>
          {formattedValue}
        </option>
      );
    }

      // Add 1 to 20 of the current month
  for (let j = 1; j <= 20; j++) {
    // const formattedValue = await j.toString().padStart(2, "0");
    const formattedValue = await j.toString();

    await tmp.push(
      <option key={j} value={formattedValue}>
        {formattedValue}
      </option>
    );

  }

await setOptions(tmp);
tmp = [];
};


  const [checkaddData, setCheckaddData] = useState("");

  //Workplace data
  const [employeeId, setEmployeeId] = useState(""); //รหัสหน่วยงาน
  const [name, setName] = useState(""); //ชื่อหน่วยงาน
  const [lastName, setLastname] = useState(""); //ชื่อหน่วยงาน
  const [workplacestay, setWorkplacestay] = useState(""); //สังกัด
  const [workplaceArea, setWorkplaceArea] = useState(""); //สถานที่ปฏิบัติงาน
  const [workOfWeek, setWorkOfWeek] = useState(""); //วันทำงานต่อสัปดาห์
  const [workStart1, setWorkStart1] = useState(""); //เวลาเริ่มกะเช้า
  const [workEnd1, setWorkEnd1] = useState(""); //เวลาออกกะเช้า
  const [workStart2, setWorkStart2] = useState(""); //เวลาเข้ากะบ่าย
  const [workEnd2, setWorkEnd2] = useState(""); //เวลาออกกะบ่าย
  const [workStart3, setWorkStart3] = useState(""); //เวลาเข้ากะเย็น
  const [workEnd3, setWorkEnd3] = useState(""); //เวลาออกกะเย็น
  const [workOfHour, setWorkOfHour] = useState(""); //ชั่วโมงทำงานต่อสัปดาห์
  const [workOfOT, setWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์

  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [workTotalPeople, setWorkTotalPeople] = useState(""); //จำนวนคนในหน่วยงาน
  const [workRateDayoff, setWorkRateDayoff] = useState(""); //ค่าจ้างวันหยุด ต่อวัน
  const [workRateDayoffHour, setWorkRateDayoffHour] = useState(""); //ค่าจ้างวันหยุดต่อชั่วโมง
  const [workplaceAddress, setWorkplaceAddress] = useState(""); //ที่อยู่หน่วยงาน
  const [department, setDepartment] = useState("");

  //////////////////////////////
  const [employeeList, setEmployeeList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);
const [customWorkplace , setCustomWorkplace] = useState({});

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/employee/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setEmployeeList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render



  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Add test specialWorkTimeDay data to workplaces
        const dataWithSpecialDays = data.map(workplace => {
          // Get current date info for testing
          const today = new Date();
          const currentDay = today.getDate();
          const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
          const currentYear = today.getFullYear();
          const buddhistYear = currentYear + 543;
          
          // Keep existing specialWorkTimeDay and add new test data
          const existingSpecialDays = workplace.specialWorkTimeDay || [];
          
          console.log(`🏢 Processing workplace ${workplace.workplaceId}:`, workplace.workplaceName);
          
          // Add test data for ALL workplaces to ensure it works
          const newSpecialDays = [
            ...existingSpecialDays, // เก็บข้อมูลเดิมไว้
            
            {
              "day_specialwork": `${currentDay}/${currentMonth}/${buddhistYear}`, // Today's date
              "shift_specialwork": "กะพิเศษ",
              "startTime_specialwork": "09.00",
              "endTime_specialwork": "18.00",
              "startTimeOT_specialwork": "18.00",
              "endTimeOT_specialwork": "20.00",
              "payment_specialwork": 1500,
              "paymentOT_specialwork": 750,
              "workDetail_specialwork": `งานพิเศษวันที่ ${currentDay} (ทดสอบ)`,
              "employees_specialwork": [
                {
                  "positionWork_specialwork": "ทั้งหมด",
                  "countPerson_specialwork": 5,
                  "_id": "test003"
                }
              ],
              "_id": "test003"
            }
          ];
          
          console.log(`✅ Total special days after adding test data:`, newSpecialDays.length);
          
          return {
            ...workplace,
            specialWorkTimeDay: newSpecialDays
          };
        });
        
        // Update the state with the enhanced data
        setWorkplaceList(dataWithSpecialDays);
        console.log('🎯 Enhanced workplaceList with specialWorkTimeDay:', dataWithSpecialDays);
        
        // Debug: Check specific workplace 1001
        const workplace1001 = dataWithSpecialDays.find(w => w.workplaceId === "1001");
        if (workplace1001) {
          console.log('🔬 Workplace 1001 enhanced data:');
          console.log('- specialWorkTimeDay count:', workplace1001.specialWorkTimeDay?.length || 0);
          console.log('- specialWorkTimeDay dates:', workplace1001.specialWorkTimeDay?.map(d => d.day_specialwork) || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render



  /////////////////////////////////////////////
  const [tmpIndex, setTmpIndex] = useState(0);
  const [wId, setWId] = useState("");
  const [wName, setWName] = useState("");
  const [wGroup, setWGroup] = useState("");
  const [wDate, setWDate] = useState("");
  const [wShift, setWShift] = useState("morning_shift");
  const [wStartTime, setWStartTime] = useState("");
  const [wEndTime, setWEndTime] = useState("");
  const [wAllTime, setWAllTime] = useState("");
  const [wOtTime, setWOtTime] = useState("");
  const [wSelectOtTime, setWSelectOtTime] = useState("");
  const [wSelectOtTimeout, setWSelectOtTimeout] = useState("");

  //OT before time
  const [wBeforeSelectOtTime, setWBeforeSelectOtTime] = useState("");
  const [wBeforeSelectOtTimeout, setWBeforeSelectOtTimeout] = useState("");
  const [wBeforeOtTime, setWBeforeOtTime] = useState("");

  // State for "จ่ายเต็มวัน" checkbox
  const [payFullDay, setPayFullDay] = useState(false);
  
  // State for "กะดึก" checkbox when selecting "เงินสด"
  const [isNightShiftCash, setIsNightShiftCash] = useState(false);

  // Get the number of days in the specified month
  const numberOfDaysInMonth = new Date(2024, 2, 0).getDate();

  // Create an array containing numbers from 1 to the number of days in the month
  const daysOfMonth = Array.from(
    { length: numberOfDaysInMonth },
    (_, index) => index + 1
  );

  // Create an array containing the day of the week (0 to 6) for each day in the month
  const daysOfWeek = daysOfMonth.map((day) => {
    const dayOfWeek = new Date(2024, 2, day).getDay();
    return dayOfWeek;
  });
  //cczz
  // This useEffect listens for changes in wShift

  function calTime(start, end, limit) {
    const startHours = parseFloat(start.split(".")[0]);
    const startMinutes = parseFloat(start.split(".")[1] || 0);
    const endHours = parseFloat(end.split(".")[0]);
    const endMinutes = parseFloat(end.split(".")[1] || 0);
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;

    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }

    // Handle cases where endTime is on the next day
    if (hours < 0) {
      hours += 24;
    }

    // Check if employee worked >= 5 hours and subtract 1 hour
    if (hours >= 5) {
      hours -= 1;
    }

    // Calculate the total time difference in minutes
    const totalMinutes = hours * 60 + minutes;

    // Cap the time difference at the maximum work hours
    const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);

    // Convert the capped time difference back to hours and minutes
    const cappedHours = Math.floor(cappedTotalMinutes / 60);
    const cappedMinutes = cappedTotalMinutes % 60;

    // Check if the original total minutes exceed the limit
    if (totalMinutes > limit * 60) {
      const limitTotalMinutes = Math.round(limit * 60);
      const limitHours = Math.floor(limitTotalMinutes / 60);
      const limitMinutes = limitTotalMinutes % 60;
      return `${limitHours}.${limitMinutes.toString().padStart(2, "0")}`;
    }

    const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

    if (isNaN(timeDiffFormatted)) {
      return "";
    }

    return timeDiffFormatted;
  }

  // Function to check and apply special work time day data
  const checkSpecialWorkTimeDay = async () => {
    if (wDate && wId) {
      try {
        console.log(`🔍 Checking special work time day for wDate: ${wDate}, wId: ${wId}, month: ${month}, year: ${year}`);
        
        // Always prioritize workplaceList (which has enhanced test data) over customWorkplace
        let workplacesearch = workplaceList.find((workplace) => workplace.workplaceId === wId);
        
        // If not found in workplaceList, fallback to customWorkplace
        if (!workplacesearch && Object.keys(customWorkplace).length !== 0) {
          workplacesearch = customWorkplace;
        }
        
        if (workplacesearch && workplacesearch.specialWorkTimeDay) {
          console.log(`📅 Found workplace with ${workplacesearch.specialWorkTimeDay.length} special work days:`, 
            workplacesearch.specialWorkTimeDay.map(d => d.day_specialwork));
          
          // Format the current date for comparison (DD/MM/YYYY in Buddhist year)
          const currentDay = parseInt(wDate);
          let currentMonth = parseInt(month);
          let currentYear = parseInt(year);
          
          // ระบบบัญชี: เดือน 21-20 (เช่น 21/7 - 20/8 = เดือนบัญชี 8)
          // การแปลง: วันที่ในเดือนบัญชี -> วันที่ปฏิทิน
          let actualMonth, actualYear;
          
          if (currentDay >= 21) {
            // วันที่ 21-31: อยู่ในช่วงแรกของเดือนบัญชี
            // เดือนปฏิทิน = เดือนบัญชี - 1
            if (currentMonth === 1) {
              actualMonth = 12;
              actualYear = currentYear - 1;
            } else {
              actualMonth = currentMonth - 1;
              actualYear = currentYear;
            }
          } else {
            // วันที่ 1-20: อยู่ในช่วงหลังของเดือนบัญชี  
            // เดือนปฏิทิน = เดือนบัญชี
            actualMonth = currentMonth;
            actualYear = currentYear;
          }
          
          const buddhistYear = actualYear + 543;
          const formattedDate = `${currentDay}/${actualMonth}/${buddhistYear}`;
          
          console.log(`📅 Date conversion: Accounting date ${currentDay}/${currentMonth}/${currentYear} -> Calendar date ${currentDay}/${actualMonth}/${buddhistYear}`);
          
          // Also try alternative date formats to ensure matching
          const alternatives = [
            `${currentDay}/${actualMonth}/${buddhistYear}`,
            `${currentDay.toString().padStart(2, '0')}/${actualMonth}/${buddhistYear}`,
            `${currentDay}/${actualMonth.toString().padStart(2, '0')}/${buddhistYear}`,
            `${currentDay.toString().padStart(2, '0')}/${actualMonth.toString().padStart(2, '0')}/${buddhistYear}`
          ];
          
          console.log(`🎯 Looking for dates:`, alternatives);
          
          // Find matching special work day
          const specialDay = workplacesearch.specialWorkTimeDay.find(
            item => alternatives.includes(item.day_specialwork)
          );
          
          if (specialDay) {
            console.log(`✅ Found matching special day:`, specialDay);
            
            // Show notification only - no auto switch
            alert(`📅 พบวันพิเศษ วันที่ ${formattedDate}\nรายละเอียด: ${specialDay.workDetail_specialwork || 'งานพิเศษ'}\nเวลาทำงาน: ${specialDay.startTime_specialwork} - ${specialDay.endTime_specialwork}\nเวลา OT: ${specialDay.startTimeOT_specialwork} - ${specialDay.endTimeOT_specialwork}\nเงิน: ${specialDay.payment_specialwork} บาท\nOT: ${specialDay.paymentOT_specialwork} บาท\n\n💡 สามารถเปลี่ยนเป็นกะพิเศษได้ด้วยตนเอง`);
            
            return specialDay; // Return special day data
          } else {
            console.log(`❌ No matching special day found for dates:`, alternatives);
          }
        } else {
          console.log(`❌ No workplace found or no special work time day data for wId: ${wId}`);
        }
      } catch (error) {
        console.error('❌ Error checking special work time day:', error);
      }
    }
    return null; // No special day found
  };

  // Function to apply special work day data when manually switching to special shift
  const applySpecialWorkDayData = async () => {
    if (wDate && wId && wShift === "specialt_shift") {
      try {
        const specialDay = await checkSpecialWorkTimeDay();
        
        if (specialDay) {
          console.log(`🔧 Applying special work day data for manual shift change`);
          
          // Set work times
          await setWStartTime(specialDay.startTime_specialwork || "");
          await setWEndTime(specialDay.endTime_specialwork || "");
          
          // Set OT times
          await setWSelectOtTime(specialDay.startTimeOT_specialwork || "");
          await setWSelectOtTimeout(specialDay.endTimeOT_specialwork || "");
          
          // Set payment amounts
          await setSpecialtSalary(specialDay.payment_specialwork?.toString() || "");
          await setSpecialtSalaryOT(specialDay.paymentOT_specialwork?.toString() || "");
          
          // Calculate work hours
          if (specialDay.startTime_specialwork && specialDay.endTime_specialwork) {
            const workHours = calTime(
              specialDay.startTime_specialwork,
              specialDay.endTime_specialwork,
              8
            );
            await setWAllTime(workHours);
          }
          
          // Calculate OT hours
          if (specialDay.startTimeOT_specialwork && specialDay.endTimeOT_specialwork) {
            const otHours = calTime(
              specialDay.startTimeOT_specialwork,
              specialDay.endTimeOT_specialwork,
              4
            );
            await setWOtTime(otHours);
          }
          
          console.log(`✅ Successfully applied special work day data`);
        } else {
          console.log(`ℹ️ No special work day data found for this date, using default special shift settings`);
        }
      } catch (error) {
        console.error('❌ Error applying special work day data:', error);
      }
    }
  };

  // useEffect to clear salary fields when switching shifts
  useEffect(() => {
    // Clear appropriate salary fields based on current shift
    if (wShift === "specialt_shift") {
      // Clear cash holiday fields when switching to special shift
      setCashOfHoliday("");
      setCashOfHolidayOt("");
      
      // Apply special work day data if available
      applySpecialWorkDayData();
    } else if (wShift === "cash_holiday") {
      // Clear special salary fields when switching to cash holiday
      setSpecialtSalary("");
      setSpecialtSalaryOT("");
    } else {
      // Clear both when switching to normal shifts
      setSpecialtSalary("");
      setSpecialtSalaryOT("");
      setCashOfHoliday("");
      setCashOfHolidayOt("");
    }
  }, [wShift]);

  useEffect(() => {
    // Wait for workplaceList to be loaded
    if (workplaceList.length === 0) {
      return;
    }
    
    try {
      setWStartTime("");
      setWEndTime("");
      setWAllTime("");
      setWOtTime("");
      setWSelectOtTime("");
      setWSelectOtTimeout("");

      setWBeforeSelectOtTime("");
      setWBeforeSelectOtTimeout("");
      setWBeforeOtTime("");

      const runAsync = async () => {
        // Check for special work time day (notification only)
        await checkSpecialWorkTimeDay();
        
        // Always proceed with normal logic
        await timeOfWork();
      };

      const timeOfWork = async () => {
        await setWStartTime("");
        await setWEndTime("");
        await setWAllTime("");
        await setWOtTime("");
        await setWSelectOtTime("");
        await setWSelectOtTimeout("");

        await setWBeforeSelectOtTime("");
        await setWBeforeSelectOtTimeout("");
        await setWBeforeOtTime("");

        const workplaceUsed = await {};
        
        if (wId !== "" && wName !== "") {
          // const workplacesearch = await workplaceList.find(
          //   (workplace) => workplace.workplaceId === wId
          // );

          const workplacesearch =
  Object.keys(customWorkplace).length !== 0
    ? customWorkplace
    : await workplaceList.find((workplace) => workplace.workplaceId === wId);

          if (workplacesearch) {
                        // alert(JSON.stringify(customWorkplace,null,2))

            // alert('wId ' + wId);
            // alert(workplacesearch.workplaceGroup.length);

            //department: employee department process
            if (
              searchResult[0].workplace === wId &&
              ((searchResult[0].department !== "" && searchResult[0].department !== null) || wGroup !== "")
              && workplacesearch.workplaceGroup.length > 0
            ) {

              // alert(searchResult[0].workplace );
              // alert(searchResult[0].department);
              // alert(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName );
              // let dep = workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName || '';

              // setWName(workplacesearch.workplaceName + ': ' + dep );
              // workplaceUsed = await workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexData;
              // alert(JSON.stringify(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexData) );

              //add work time with select day
              const dayMapping = await {
                อาทิตย์: 0,
                จันทร์: 1,
                อังคาร: 2,
                พุธ: 3,
                พฤหัส: 4,
                ศุกร์: 5,
                เสาร์: 6,
              };
              if(wDate >= 21 && wDate <= 31 ) {
                if(month === '01') {
setMonth('12');
setYear(year - 1);
                } else {
setMonth((parseInt(month, 10) - 1).toString().padStart(2, '0'));

                }
              }
              let date = await new Date(year, month - 1, wDate); // Subtract 1 from the month since months are zero-indexed
              let dayOfWeek = await date.getDay(); // This will give you the day of the week, where 0 is Sunday, 1 is
// alert(date )

              // await workplacesearch.workplaceGroup[
              //   parseInt(searchResult[0].department || 0) - 1
              // ].workplaceComplexData.workTimeDay.map(async (item, index) => {
                
                const departmentIndex = wGroup !== "" ? parseInt(wGroup) - 1 : parseInt(searchResult[0].department || 0) - 1;

await workplacesearch.workplaceGroup[departmentIndex]
  .workplaceComplexData.workTimeDay.map(async (item, index) => {
    
                //    alert(JSON.stringify(item.allTimes));
                // const morningTimes = await item.allTimes.filter(time => time.shift === "กะเช้า");
                // await alert(morningTimes[0].startTime );

                //case start day = end day
                if (
                  dayMapping[item.startDay] == dayMapping[item.endDay] &&
                  dayMapping[item.startDay] == dayOfWeek
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );

                      if (morningTimes.length > 0) {
                        await setWStartTime(morningTimes[0].startTime || "");
                        await setWEndTime(morningTimes[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            morningTimes[0].startTime || "",
                            morningTimes[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            morningTimes[0].startTimeOT || "",
                            morningTimes[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                        await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");

                        await setWBeforeSelectOtTime(morningTimes[0].beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(morningTimes[0].beforeEndTimeOT || "");
                        await setWBeforeOtTime(
                          calTime(
                            morningTimes[0]?.beforeStartTimeOT || "",
                            morningTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                      }
                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );

                      if (afternoonTimes.length > 0) {
                        await setWStartTime(afternoonTimes[0].startTime || "");
                        await setWEndTime(afternoonTimes[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            afternoonTimes[0].startTime || "",
                            afternoonTimes[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            afternoonTimes[0].startTimeOT || "",
                            afternoonTimes[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(
                          afternoonTimes[0].startTimeOT || ""
                        );
                        await setWSelectOtTimeout(
                          afternoonTimes[0].endTimeOT || ""
                        );

                        await setWBeforeSelectOtTime(
                          afternoonTimes[0]?.beforeStartTimeOT || ""
                        );
                        await setWBeforeSelectOtTimeout(
                          afternoonTimes[0]?.beforeEndTimeOT || ""
                        );
                        await setWBeforeOtTime(
                          calTime(
                            afternoonTimes[0]?.beforeStartTimeOT || "",
                            afternoonTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                      }

                      break;

                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );

                      if (nightTimes.length > 0) {
                        await setWStartTime(nightTimes[0].startTime || "");
                        await setWEndTime(nightTimes[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            nightTimes[0].startTime || "",
                            nightTimes[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            nightTimes[0].startTimeOT || "",
                            nightTimes[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                        await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                        await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(nightTimes[0]?.beforeEndTimeOT || "");
                        await setWBeforeOtTime(
                          calTime(
                            nightTimes[0]?.beforeStartTimeOT || "",
                            nightTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                      }

                      break;
                    case "specialt_shift":
                      // setWStartTime("");
                      // setWEndTime("");
                      // setWAllTime(calTime("0", "0", "24") || "");
                      // setWOtTime(calTime("0", "0", "24") || "");
                      // setWSelectOtTime("");
                      // setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      
                      if (specialt_shift.length > 0) {
                        await setWStartTime(specialt_shift[0].startTime || "");
                        await setWEndTime(specialt_shift[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            specialt_shift[0].startTime || "",
                            specialt_shift[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            specialt_shift[0].startTimeOT || "",
                            specialt_shift[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(
                          specialt_shift[0].startTimeOT || ""
                        );
                        await setWSelectOtTimeout(
                          specialt_shift[0].endTimeOT || ""
                        );

                        await setWBeforeSelectOtTime(
                          specialt_shift[0]?.beforeStartTimeOT || ""
                        );
                        await setWBeforeSelectOtTimeout(
                          specialt_shift[0]?.beforeEndTimeOT || ""
                        );
                        await setWBeforeOtTime(
                          calTime(
                            specialt_shift[0]?.beforeStartTimeOT || "",
                            specialt_shift[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                      }

                      break;
                    default:
                      setWStartTime("");
                      setWEndTime("");
                      setWAllTime("");
                      setWOtTime("");
                      setWSelectOtTime("");
                      setWSelectOtTimeout("");
                      setWBeforeSelectOtTime("");
                      setWBeforeSelectOtTimeout("");
                      setWBeforeOtTime("");
                  }
                }

                //case start day < end day
                if (
                  dayMapping[item.startDay] < dayMapping[item.endDay] &&
                  dayOfWeek >= dayMapping[item.startDay] &&
                  dayOfWeek <= dayMapping[item.endDay]
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      
                      const morningShift = safeGetFirstShift(morningTimes);
                      if (morningShift) {
                        // await alert(morningTimes[0].startTime );
                        await setWAllTime(
                          calTime(
                            morningShift.startTime || "",
                            morningShift.endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWStartTime(morningShift.startTime || "");
                        await setWEndTime(morningShift.endTime || "");
                        await setWOtTime(
                          calTime(
                            morningShift.startTimeOT || "",
                            morningShift.endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(morningShift.startTimeOT || "");
                        await setWSelectOtTimeout(morningShift.endTimeOT || "");
                        await setWBeforeSelectOtTime(morningShift?.beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(morningShift?.beforeEndTimeOT || "");
                        await setWBeforeOtTime(
                          calTime(
                            morningShift?.beforeStartTimeOT || "",
                            morningShift?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                      }

                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );
                      await setWAllTime(
                        calTime(
                          afternoonTimes[0].startTime || "",
                          afternoonTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(afternoonTimes[0].startTime || "");
                      await setWEndTime(afternoonTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          afternoonTimes[0].startTimeOT || "",
                          afternoonTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(afternoonTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );
                      await setWAllTime(
                        calTime(
                          nightTimes[0].startTime || "",
                          nightTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(nightTimes[0].startTime || "");
                      await setWEndTime(nightTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          nightTimes[0].startTimeOT || "",
                          nightTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(nightTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    case "specialt_shift":
                      // await setWAllTime(calTime("0", "0", "24") || "");

                      // await setWStartTime("");
                      // await setWEndTime("");
                      // await setWOtTime(calTime("0", "0", "24") || "");
                      // await setWSelectOtTime("");
                      // await setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      await setWAllTime(
                        calTime(
                          specialt_shift[0].startTime || "",
                          specialt_shift[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(specialt_shift[0].startTime || "");
                      await setWEndTime(specialt_shift[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          specialt_shift[0].startTimeOT || "",
                          specialt_shift[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(specialt_shift[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                      await setWBeforeOtTime("");

                  }
                }

                //case start day > end day
                if (
                  dayMapping[item.startDay] > dayMapping[item.endDay] &&
                  dayOfWeek >= dayMapping[item.startDay] &&
                  dayOfWeek <= 6 &&
                  dayOfWeek <= dayMapping[item.endDay] &&
                  dayOfWeek >= 0
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      // await alert(morningTimes[0].startTime );
                      await setWAllTime(
                        calTime(
                          morningTimes[0].startTime || "",
                          morningTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(morningTimes[0].startTime || "");
                      await setWEndTime(morningTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          morningTimes[0].startTimeOT || "",
                          morningTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );
                      await setWAllTime(
                        calTime(
                          afternoonTimes[0].startTime || "",
                          afternoonTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(afternoonTimes[0].startTime || "");
                      await setWEndTime(afternoonTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          afternoonTimes[0].startTimeOT || "",
                          afternoonTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );
                      await setWAllTime(
                        calTime(
                          nightTimes[0].startTime || "",
                          nightTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(nightTimes[0].startTime || "");
                      await setWEndTime(nightTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          nightTimes[0].startTimeOT || "",
                          nightTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    case "specialt_shift":
                      // await setWAllTime(calTime("0", "0", "24") || "");

                      // await setWStartTime("");
                      // await setWEndTime("");
                      // await setWOtTime(calTime("0", "0", "24") || "");
                      // await setWSelectOtTime("");
                      // await setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      await setWAllTime(
                        calTime(
                          specialt_shift[0].startTime || "",
                          specialt_shift[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(specialt_shift[0].startTime || "");
                      await setWEndTime(specialt_shift[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          specialt_shift[0].startTimeOT || "",
                          specialt_shift[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                      await setWBeforeOtTime("");
                  }
                }

                // alert(dayMapping[item.startDay] );
              });

              // workplacesearch = await tmp;
              // await alert(JSON.stringify(tmp));
            } else {
              // setWName(workplacesearch.workplaceName);
              // workplaceUsed  = await workplacesearch;
              // alert(JSON.stringify('hi2') );

              //add work time with select day
              const dayMapping = await {
                อาทิตย์: 0,
                จันทร์: 1,
                อังคาร: 2,
                พุธ: 3,
                พฤหัส: 4,
                ศุกร์: 5,
                เสาร์: 6,
              };

              // let date = await new Date(year, month - 1, wDate); // Subtract 1 from the month since months are zero-indexed
              // let dayOfWeek = await date.getDay(); // This will give you the day of the week, where 0 is Sunday, 1 is
              let m = '';
let y = '';
                if (wDate >= 21 && wDate <= 31) {
                if (parseInt(month, 10) === 1) {
                  m = '12';
                  y = parseInt(year, 10) - 1; // Ensure year is treated as a number
                } else {
                  m = (parseInt(month, 10) - 1).toString().padStart(2, '0');
                  y = parseInt(year, 10); // Ensure year is treated as a number
                }              } else {
m = month;
y = year
              }
              
              
              let date = new Date(y, parseInt(m, 10) - 1, wDate); // Ensure month is a number
              let dayOfWeek = date.getDay(); // Get day of the week
              
              // alert(JSON.stringify('hi') );

              await workplacesearch.workTimeDay.map(async (item, index) => {
                //    alert(JSON.stringify(item.allTimes));
                // const morningTimes = await item.allTimes.filter(time => time.shift === "กะเช้า");
                // await alert(morningTimes[0].startTime );

                //case start day = end day
                if (
                  dayMapping[item.startDay] == dayMapping[item.endDay] &&
                  dayMapping[item.startDay] == dayOfWeek
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );

                      if (morningTimes.length > 0) {
                        await setWStartTime(morningTimes[0].startTime || "");
                        await setWEndTime(morningTimes[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            morningTimes[0].startTime || "",
                            morningTimes[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            morningTimes[0].startTimeOT || "",
                            morningTimes[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                        await setWSelectOtTimeout(
                          morningTimes[0].endTimeOT || ""
                        );

                        await setWBeforeOtTime(
                          calTime(
                            morningTimes[0]?.beforeStartTimeOT || "",
                            morningTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                        await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(
                          morningTimes[0]?.beforeEndTimeOT || ""
                        );
                      }

                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );

                      if (afternoonTimes.length > 0) {
                        await setWStartTime(afternoonTimes[0].startTime || "");
                        await setWEndTime(afternoonTimes[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            afternoonTimes[0].startTime || "",
                            afternoonTimes[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            afternoonTimes[0].startTimeOT || "",
                            afternoonTimes[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(
                          afternoonTimes[0].startTimeOT || ""
                        );
                        await setWSelectOtTimeout(
                          afternoonTimes[0].endTimeOT || ""
                        );

                        await setWBeforeOtTime(
                          calTime(
                            afternoonTimes[0]?.beforeStartTimeOT || "",
                            afternoonTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                        await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(
                          afternoonTimes[0]?.beforeEndTimeOT || ""
                        );
                      }

                      break;
                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );

                      await setWStartTime(nightTimes[0].startTime || "");
                      await setWEndTime(nightTimes[0].endTime || "");
                      await setWAllTime(
                        calTime(
                          nightTimes[0].startTime || "",
                          nightTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWOtTime(
                        calTime(
                          nightTimes[0].startTimeOT || "",
                          nightTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    case "specialt_shift":
                      // setWStartTime("");
                      // setWEndTime("");
                      // setWAllTime(calTime("0", "0", "24") || "");
                      // setWOtTime(calTime("0", "0", "24") || "");
                      // setWSelectOtTime("");
                      // setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      
                      if (specialt_shift.length > 0) {
                        await setWStartTime(specialt_shift[0].startTime || "");
                        await setWEndTime(specialt_shift[0].endTime || "");
                        await setWAllTime(
                          calTime(
                            specialt_shift[0].startTime || "",
                            specialt_shift[0].endTime || "",
                            workplacesearch.workOfHour
                          ) || ""
                        );
                        await setWOtTime(
                          calTime(
                            specialt_shift[0].startTimeOT || "",
                            specialt_shift[0].endTimeOT || "",
                            workplacesearch.workOfOT || ""
                          ) || ""
                        );
                        await setWSelectOtTime(
                          specialt_shift[0].startTimeOT || ""
                        );
                        await setWSelectOtTimeout(
                          specialt_shift[0].endTimeOT || ""
                        );

                        await setWBeforeOtTime(
                          calTime(
                            specialt_shift[0]?.beforeStartTimeOT || "",
                            specialt_shift[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
                        await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(
                          specialt_shift[0]?.beforeEndTimeOT || ""
                        );
                      }
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    default:
                      setWStartTime("");
                      setWEndTime("");
                      setWAllTime("");
                      setWOtTime("");
                      setWSelectOtTime("");
                      setWSelectOtTimeout("");
                      setWBeforeOtTime("");
                      setWBeforeSelectOtTime("");
                      setWBeforeSelectOtTimeout("");

                  }
                }

                //case start day < end day
                if (
                  dayMapping[item.startDay] < dayMapping[item.endDay] &&
                  dayOfWeek >= dayMapping[item.startDay] &&
                  dayOfWeek <= dayMapping[item.endDay]
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      // await alert(morningTimes[0].startTime );
                      await setWAllTime(
                        calTime(
                          morningTimes[0].startTime || "",
                          morningTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(morningTimes[0].startTime || "");
                      await setWEndTime(morningTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          morningTimes[0].startTimeOT || "",
                          morningTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );
                      await setWAllTime(
                        calTime(
                          afternoonTimes[0].startTime || "",
                          afternoonTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(afternoonTimes[0].startTime || "");
                      await setWEndTime(afternoonTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          afternoonTimes[0].startTimeOT || "",
                          afternoonTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );
                      await setWAllTime(
                        calTime(
                          nightTimes[0].startTime || "",
                          nightTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(nightTimes[0].startTime || "");
                      await setWEndTime(nightTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          nightTimes[0].startTimeOT || "",
                          nightTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    case "specialt_shift":
                      // await setWAllTime(calTime("0", "0", "24") || "");

                      // await setWStartTime("");
                      // await setWEndTime("");
                      // await setWOtTime(calTime("0", "0", "24") || "");
                      // await setWSelectOtTime("");
                      // await setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      await setWAllTime(
                        calTime(
                          specialt_shift[0].startTime || "",
                          specialt_shift[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(specialt_shift[0].startTime || "");
                      await setWEndTime(specialt_shift[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          specialt_shift[0].startTimeOT || "",
                          specialt_shift[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeOtTime("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                  }
                }

                //case start day > end day
                if (
                  dayMapping[item.startDay] > dayMapping[item.endDay] &&
                  dayOfWeek >= dayMapping[item.startDay] &&
                  dayOfWeek <= 6 &&
                  dayOfWeek <= dayMapping[item.endDay] &&
                  dayOfWeek >= 0
                ) {
                  switch (wShift) {
                    case "morning_shift":
                      const morningTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      // await alert(morningTimes[0].startTime );
                      await setWAllTime(
                        calTime(
                          morningTimes[0].startTime || "",
                          morningTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(morningTimes[0].startTime || "");
                      await setWEndTime(morningTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          morningTimes[0].startTimeOT || "",
                          morningTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || "");

                      break;
                    case "afternoon_shift":
                      const afternoonTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะบ่าย"
                      );
                      await setWAllTime(
                        calTime(
                          afternoonTimes[0].startTime || "",
                          afternoonTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(afternoonTimes[0].startTime || "");
                      await setWEndTime(afternoonTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          afternoonTimes[0].startTimeOT || "",
                          afternoonTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || "");

                      break;
                    case "night_shift":
                      const nightTimes = await item.allTimes.filter(
                        (time) => time.shift === "กะดึก"
                      );
                      await setWAllTime(
                        calTime(
                          nightTimes[0].startTime || "",
                          nightTimes[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );

                      await setWStartTime(nightTimes[0].startTime || "");
                      await setWEndTime(nightTimes[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          nightTimes[0].startTimeOT || "",
                          nightTimes[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                      await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || "");

                      break;
                    case "specialt_shift":
                      // await setWAllTime(calTime("0", "0", "24") || "");

                      // await setWStartTime("");
                      // await setWEndTime("");
                      // await setWOtTime(calTime("0", "0", "24") || "");
                      // await setWSelectOtTime("");
                      // await setWSelectOtTimeout("");
                      const specialt_shift = await item.allTimes.filter(
                        (time) => time.shift === "กะเช้า"
                      );
                      await setWAllTime(
                        calTime(
                          specialt_shift[0].startTime || "",
                          specialt_shift[0].endTime || "",
                          workplacesearch.workOfHour
                        ) || ""
                      );
                      await setWStartTime(specialt_shift[0].startTime || "");
                      await setWEndTime(specialt_shift[0].endTime || "");
                      await setWOtTime(
                        calTime(
                          specialt_shift[0].startTimeOT || "",
                          specialt_shift[0].endTimeOT || "",
                          workplacesearch.workOfOT || ""
                        ) || ""
                      );
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || "");


                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeOtTime("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                  }
                }

                // alert(dayMapping[item.startDay] );
              });
            }
            // await alert(dayOfWeek )
            //                     await alert(wDate);
            //                     await alert(JSON.stringify(workplacesearch.workTimeDay, null,2))
          }
        }
      };

      runAsync();
    } catch (err) {
      console("err", err);
    }
  }, [wShift, wDate, workplaceList]);

  //calculate time of work
  useEffect(() => {
    if (wStartTime !== "" && wEndTime !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          setWAllTime(
            calTime(
              wStartTime || "",
              wEndTime || "",
              workplacesearch.workOfHour || ""
            )
          );
          if (wShift == "specialt_shift" || wShift == "cash_holiday") {
            setWAllTime(calTime(wStartTime || "", wEndTime || "", 24));
          } else {
            setWAllTime(
              calTime(
                wStartTime || "",
                wEndTime || "",
                workplacesearch.workOfHour || ""
              )
            );
          }
        }
      }
    } else {
      setWAllTime(0);
    }
  }, [wStartTime, wEndTime]);

  useEffect(() => {
    if (wSelectOtTime !== "" && wSelectOtTimeout !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          if (wShift == "specialt_shift" || wShift == "cash_holiday") {
            setWOtTime(
              calTime(wSelectOtTime || "", wSelectOtTimeout || "", 24)
            );
          } else {
            setWOtTime(
              calTime(
                wSelectOtTime || "",
                wSelectOtTimeout || "",
                workplacesearch.workOfOT || ""
              )
            );
          }
        }
      }
    } else {
      setWOtTime('');
    }
  }, [wSelectOtTime, wSelectOtTimeout]);


  useEffect(() => {
    if (wBeforeSelectOtTime !== "" && wBeforeSelectOtTimeout !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          if (wShift == "specialt_shift" || wShift == "cash_holiday") {
            setWBeforeOtTime(
              calTime(wBeforeSelectOtTime || "", wBeforeSelectOtTimeout || "", 24)
            );
          } else {
            setWBeforeOtTime(
              calTime(
                wBeforeSelectOtTime || "",
                wBeforeSelectOtTimeout || "",
                workplacesearch.workOfOT || ""
              )
            );
          }
        }
      }
    } else {
      setWBeforeOtTime('');
    }
  }, [wBeforeSelectOtTime, wBeforeSelectOtTimeout]);

  // search employee Name by employeeId
  useEffect(() => {
    if (wId !== "") {
      try {
        setGroupOptions1 (null);            

        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId);
        if (workplacesearch) {
          //department: employee department process
          if (
            searchResult[0].workplace === wId &&
            // searchResult[0].department !== "" &&
            workplacesearch.workplaceGroup.length > 0
          ) {
            // alert(searchResult[0].workplace );
            setGroupOptions1 (workplacesearch.workplaceGroup);            
            const newGroupOptions = workplacesearch.workplaceGroup.map(
              element => element.workplaceComplexName
            );
        
            setGroupOptions(newGroupOptions);
            // alert(workplacesearch.workplaceGroup.length  + ' ' + groupOptions[0].length);
// alert(JSON.stringify(groupOptions1));
            // alert(searchResult[0].department);
            // alert(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName );

            // let dep =
            //   workplacesearch.workplaceGroup[
            //     parseInt(searchResult[0].department || 0) - 1
            //   ].workplaceComplexName || "";
            let dep =
              workplacesearch.workplaceGroup?.[
                parseInt(searchResult[0].department || 0) - 1
              ]?.workplaceComplexName || "";

            if (dep == "") {
              setWName(workplacesearch.workplaceName);
              setWGroup('');
            } else {
              setWName(dep);
              setWGroup(workplacesearch?.wGroup || '');
            }
          } else {
            setWName(workplacesearch.workplaceName);
            setWGroup('');
          }

          // Optional: Add work time to selection (as per your comment)
          // alert(JSON.stringify(workplacesearch.workTimeDay, null, 2));


        } else {
          setWName("");
        }
      } catch (error) {
        // alert(error);
        // alert(JSON.stringify(workplaceList,null,2) );

      }

    }

  }, [wId]);

  //search employeeId by employeeName
  // useEffect(() => {
  //     //Search Employee  by name
  //     if (wName != '') {
  //         const workplacesearch = workplaceList.find(workplace => workplace.workplaceName === wName);
  //         if (workplacesearch) {
  //             setWId(workplacesearch.workplaceId);
  //         } else {
  //             setWId('');
  //         }
  //         console.log(workplacesearch);

  //     }
  // }, [wName]);

  // const numberOfRows2 = 30; // Fixed number of rows
  const numberOfRows2 = 1; // Fixed number of rows

  const initialRowData2 = {
    workplaceId: "",
    workplaceName: "",
    wGroup: "",
    date: "", // Use null as initial value for DatePicker
    shift: "morning_shift",
    startTime: "",
    endTime: "",
    allTime: "",
    otTime: "",
    selectotTime: "",
    selectotTimeOut: "",
    cashSalary: "",
    specialtSalary: "",
    specialtSalaryOT: "",
    cashOfHoliday: "",
    cashOfHolidayOt: "",
    messageSalary: "",
  };

  const [rowDataList2, setRowDataList2] = useState(
    new Array(numberOfRows2).fill(initialRowData2)
  );

  const handleFieldChange2 = (index2, fieldName2, value) => {
    setRowDataList2((prevDataList) => {
      const newDataList2 = [...prevDataList];
      newDataList2[index2] = {
        ...newDataList2[index2],
        [fieldName2]: value,
      };

      //Search workplace by id
      if (fieldName2 == "workplaceId") {
        const workplaceIdSearch = workplaceList.find(
          (workplace) => workplace.workplaceId === value
        );
        //                 alert(JSON.stringify(workplaceList, null, 2));
        // alert( workplaceList.length);
        if (workplaceIdSearch) {
          //   setEmployeeName(employee.name);
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceName"]: workplaceIdSearch.workplaceName + "",
            ["wGroup"]: workplaceIdSearch.wGroup + "",
            ["shift"]: "morning_shift",
            ["startTime"]: workplaceIdSearch.workStart1 + "",
            ["endTime"]: workplaceIdSearch.workEnd1 + "",
            ["allTime"]: workplaceIdSearch.workOfHour + "",
            ["otTime"]: workplaceIdSearch.workOfOT + "",
            ["selectotTime"]: workplaceIdSearch.workStartOt1 + "",
            ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 + "",
          };
        } else {
          //   setEmployeeName('Employee not found');
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceName"]: "ไม่พบชื่อหน่วยงาน",
          };
        }
      }

      //Search workplace by name
      if (fieldName2 == "workplaceName") {
        const workplaceNameSearch = workplaceList.find(
          (workplace) => workplace.workplaceName === value
        );
        //                 alert(JSON.stringify(workplaceList, null, 2));
        // alert( workplaceList.length);
        if (workplaceNameSearch) {
          //   setEmployeeName(employee.name);
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: workplaceNameSearch.workplaceId + "",
          };
        } else {
          //   setEmployeeName('Employee not found');
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: "ไม่พบรหัสหน่วยงาน",
          };
        }
      }

      //Select shift then set time of work
      if (fieldName2 == "shift") {
        // alert(value);
        //Check Selected workplace by workplaceId is notnull
        if (newDataList2[index2].workplaceId !== "") {
          // alert(newDataList2[index2].workplaceId );
          //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
          const workplaceIdSearch = workplaceList.find(
            (workplace) =>
              workplace.workplaceId === newDataList2[index2].workplaceId
          );
          if (workplaceIdSearch) {
            //check shift by switch case
            switch (value) {
              case "morning_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart1 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd1 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart1 || "",
                      workplaceIdSearch.workEnd1 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt1 || "",
                      workplaceIdSearch.workEndOt1 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt1 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 || "" + "",
                };
                break;
              case "afternoon_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart2 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd2 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart2 || "",
                      workplaceIdSearch.workEnd2 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt2 || "",
                      workplaceIdSearch.workEndOt2 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt2 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt2 || "" + "",
                };
                break;
              case "night_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart3 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd3 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart3 || "",
                      workplaceIdSearch.workEnd3 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt3 || "",
                      workplaceIdSearch.workEndOt3 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt3 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt3 || "" + "",
                };
                break;
              case "specialt_shift":
                // newDataList2[index2] = {
                //   ...newDataList2[index2],
                //   ["startTime"]: "" + "",
                //   ["endTime"]: "" + "",
                //   ["allTime"]: calTime("0", "0", "24") || "" + "",
                //   ["otTime"]: calTime("0", "0", "24") || "" + "",
                //   ["selectotTime"]: "" + "",
                //   ["selectotTimeOut"]: "" + "",
                // };
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart1 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd1 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart1 || "",
                      workplaceIdSearch.workEnd1 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt1 || "",
                      workplaceIdSearch.workEndOt1 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt1 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 || "" + "",
                };
                break;
              case "cash_holiday":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart1 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd1 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart1 || "",
                      workplaceIdSearch.workEnd1 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt1 || "",
                      workplaceIdSearch.workEndOt1 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt1 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 || "" + "",
                };
                break;
              default:
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: "",
                  ["endTime"]: "",
                  ["allTime"]: "",
                  ["otTime"]: "",
                  ["selectotTime"]: "",
                  ["selectotTimeOut"]: "",
                };
            } //end switch
          }
        } else {
          //emty workplaceId
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: "กรุณาระบุหน่วยงาน",
            ["workplaceName"]: "กรุณาระบุหน่วยงาน",
          };
        }
      }

      //update time of work
      if (
        fieldName2 == "startTime" ||
        fieldName2 == "endTime" ||
        fieldName2 == "selectotTime" ||
        fieldName2 == "selectotTimeOut"
      ) {
        //Check Selected workplace by workplaceId is notnull
        if (newDataList2[index2].workplaceId !== "") {
          // alert(newDataList2[index2].workplaceId );
          //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
          const workplaceIdSearch = workplaceList.find(
            (workplace) =>
              workplace.workplaceId === newDataList2[index2].workplaceId
          );
          if (workplaceIdSearch) {
            //check specialt_shift
            if (newDataList2[index2].shift !== "specialt_shift" && newDataList2[index2].shift !== "cash_holiday") {
              //     newDataList2[index2] = {
              //         ...newDataList2[index2],
              //         ['startTime']: newDataList2[index2].startTime + '',
              //         ['endTime']: newDataList2[index2].endTime + '',
              //         ['allTime']: calTime(newDataList2[index2].startTime, newDataList2[index2].endTime, workplaceIdSearch.workOfHour) + '',
              //         ['otTime']: calTime(newDataList2[index2].selectotTime, newDataList2[index2].selectotTimeOut, workplaceIdSearch.workOfOT) + '',
              //         ['selectotTime']: newDataList2[index2].selectotTime + '',
              //         ['selectotTimeOut']: newDataList2[index2].selectotTimeOut + '',
              //     };
              // }
              // else {
              newDataList2[index2] = {
                ...newDataList2[index2],
                ["startTime"]: newDataList2[index2].startTime + "",
                ["endTime"]: newDataList2[index2].endTime + "",
                ["allTime"]:
                  calTime(
                    newDataList2[index2].startTime,
                    newDataList2[index2].endTime,
                    24
                  ) + "",
                ["otTime"]:
                  calTime(
                    newDataList2[index2].selectotTime,
                    newDataList2[index2].selectotTimeOut,
                    24
                  ) + "",
                ["selectotTime"]: newDataList2[index2].selectotTime + "",
                ["selectotTimeOut"]: newDataList2[index2].selectotTimeOut + "",
              };
            }
          } else {
            //emty workplaceId
            newDataList2[index2] = {
              ...newDataList2[index2],
              ["workplaceId"]: "กรุณาระบุหน่วยงาน",
              ["workplaceName"]: "กรุณาระบุหน่วยงาน",
            };
          }
        }
      }

      return newDataList2;
    });
  };

  // function calTime(start, end, limit) {

  //     const startHours = parseFloat(start.split('.')[0]);
  //     const startMinutes = parseFloat(start.split('.')[1] || 0);
  //     const endHours = parseFloat(end.split('.')[0]);
  //     const endMinutes = parseFloat(end.split('.')[1] || 0);
  //     let hours = endHours - startHours;
  //     let minutes = endMinutes - startMinutes;
  //     if (minutes < 0) {
  //         hours -= 1;
  //         minutes += 60;
  //     }
  //     // Handle cases where endTime is on the next day
  //     if (hours < 0) {
  //         hours += 24;
  //     }
  //     //check employee working >= 5 hours
  //     if (hours >= 5) {
  //         hours -= 1;
  //     }

  //     // Calculate the total time difference in minutes
  //     const totalMinutes = hours * 60 + minutes;
  //     // check employee working > 5 hours
  //     // Cap the time difference at the maximum work hours
  //     const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);
  //     // Convert the capped time difference back to hours and minutes
  //     const cappedHours = Math.floor(cappedTotalMinutes / 60);
  //     const cappedMinutes = cappedTotalMinutes % 60;
  //     const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

  //     if (isNaN(timeDiffFormatted)) {
  //         return '0';
  //     }

  //     return timeDiffFormatted;
  // }

  const handleStartDateChange4 = (index2, date) => {
    // alert(index2);
    handleFieldChange2(index2, "date", date);
  };

  ///////////////////

  useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);

    const savedEmployeeId = localStorage.getItem("employeeId");
    console.log('savedEmployeeId', savedEmployeeId);
    const savedName = localStorage.getItem("name");
    const savedLastName = localStorage.getItem("lastName");
    const savedMonth = localStorage.getItem("month");
    const savedYear = localStorage.getItem("year");
    if (savedEmployeeId) {
      setSearchEmployeeId(savedEmployeeId);
      setEmployeeId(savedEmployeeId);
      const event = new Event('submit'); // Creating a synthetic event object
      handleSearch(event); // Call handleSearch with the event
      localStorage.removeItem("employeeId");
    }
    if (savedName) {
      setName(savedName);
      localStorage.removeItem("name");
    }
    if (savedLastName) {
      setLastname(savedLastName);
      localStorage.removeItem("lastName");
    }
    if (savedMonth) {
      setMonth(savedMonth);
      localStorage.removeItem("month");
    }
    if (savedYear) {
      setYear(savedYear);
      localStorage.removeItem("year");
    }
  }, []); // Run this effect only once on component mount

  function handleClickResult(workplace) {
    // Populate all the startTime input fields with the search result value
    const updatedRowDataList = rowDataList.map((rowData) => ({
      ...rowData,
      startTime: workplace.workStart1,
      endTime: workplace.workEnd1,
      selectotTime: workplace.workEnd1,
    }));

    // Update the state
    setRowDataList(updatedRowDataList);
  }

  //data for search
  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน

  async function handleSearch(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    setCustomWorkplace({});

    // get value from form search
    const data = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      idCard: "",
      workPlace: "",
    };
    // alert(data.name);
    try {
      if (searchEmployeeId == '') {
        return;
      }
      const response = await axios.post(endpoint + "/employee/search", data);
      setSearchResult(response.data.employees);
      // alert(response.data.employees.length);
      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId("");
        setName("");
        setLastname("");
        alert("ไม่พบข้อมูล");
      } else {
        // alert(response.data.employees.length);

        //clean form
        // setSearchEmployeeId('');
        // setSearchEmployeeName('');

        // Set search values
        setEmployeeId(response.data.employees[0].employeeId);
        setName(response.data.employees[0].name);
        setLastname(response.data.employees[0].lastName);

        //ตรวจสอบและเรียกข้อมูล customWorkplace ตั้งค่าการทำงานเฉพาะบุคคล
if(response?.data?.employees?.[0]?.customWorkplace) {
// alert(JSON.stringify(response?.data?.employees?.[0]?.customWorkplace,null,2))
setCustomWorkplace(response?.data?.employees?.[0]?.customWorkplace);
}

        // setSearchEmployeeId(response.data.employees[0].employeeId);
        // setSearchEmployeeName(response.data.employees[0].name);

      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
      // window.location.reload();
    }
  }

  async function handleCheckTimerecord() {
    const data = {
      employeeId: employeeId,
      employeeName: name,
      month: month,
      year: year,
    };
    setRowDataList2([]);
    generateOptions(year , month);

    if (!checkaddData) {
      try {
        const response = await axios.post(
          endpoint + "/timerecord/searchtimerecordemployee",
          data
        );
        // alert(JSON.stringify(response ,null,2));

        if (response.data.result.length < 1) {
          alert("ไม่พบข้อมูล");
          // Set the state to false if no data is found
          setUpdateButton(false);
          setTimeRecord_id("");
          setRowDataList2([]);
        } else {
          // Set the state to true if data is found
          await setUpdateButton(true);
          // alert(response.data.recordworkplace[0].employee_workplaceRecord[1].workplaceId);
          await setTimeRecord_id(response.data.result[0]._id);

          // setRowDataList2(response.data.recordworkplace[0].employee_workplaceRecord);
          if (name != "") {
            
            setRowDataList2(
              response?.data?.result?.[0]?.employee_record
                .sort((a, b) => {
                  const dateA = parseInt(a.date, 10);
                  const dateB = parseInt(b.date, 10);
            
                  // Prioritize dates from 21-30 first, then 01-20
                  if ((dateA >= 21 && dateB >= 21) || (dateA <= 20 && dateB <= 20)) {
                    return dateA - dateB; // Sort normally within each group
                  }
                  return dateA >= 21 ? -1 : 1; // Move 21-30 to the front
                })
                .map((item, index) => ({
                  ...item,
                  tmpIndex: index,
                }))
            );
            
            // setRowDataList2(response.data.result[0].employee_record);
            // setRowDataList2(
            //   response.data.recordworkplace[0].employee_workplaceRecord.map(
            //     (item, index) => ({
            //       ...item,
            //       tmpIndex: index,
            //     })
            //   )
            // );
            //111
            // setRowDataList2(
            //   response.data.recordworkplace[0].employee_workplaceRecord
            //     .sort((a, b) => parseInt(a.date) - parseInt(b.date)) // Sort by date (ascending order)
            //     .map((item, index) => ({
            //       ...item,
            //       tmpIndex: index,
            //     }))
            // );
          } else {
            setRowDataList2([]);
          }

          // alert(JSON.stringify( rowDataList[0] ) );
        }
      } catch (error) {
        alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
        alert(error.message);
        window.location.reload();
      }
    }
  }

  async function handleManageWorkplace(event) {
    event.preventDefault();
    //get data from input in useState to data
    // Removed condition: if(wAllTime == 0) return; - Now allows adding with 0 work hours

    const newRowData = await {
      tmpIndex    : tmpIndex || "",
      year: year || "",
      workplaceId: wId || "",
      workplaceName: wName || "",
      wGroup: wGroup  || "",
      date: wDate || "",
      shift: wShift || "",
      startTime: wStartTime || "",
      endTime: wEndTime || "",
      totalTime: wAllTime || "",
      totalOtTime: wOtTime || "",
      startOtTime: wSelectOtTime || "",
      endOtTime: wSelectOtTimeout || "",
      beforeTotalOtTime: wBeforeOtTime || "",
      beforeStartOtTime: wBeforeSelectOtTime || "",
      beforeEndOtTime: wBeforeSelectOtTimeout || "",
      cashSalary: cashSalary || "",
      specialtSalary: specialtSalary || "",
      specialtSalaryOT: specialtSalaryOT || "",
      cashOfHoliday: cashOfHoliday || "",
      cashOfHolidayOt: cashOfHolidayOt || "",
      payFullDay: payFullDay || false, // Add payFullDay flag
      isNightShiftCash: isNightShiftCash || false, // Add night shift cash flag
      messageSalary: messageSalary || "",
    };

    await addRow(newRowData);

    // Scroll to bottom when date is 20 or greater
    if (parseInt(wDate) >= 20) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    await setTmpIndex(tmpIndex + 1);
    
    // เก็บค่า OT ที่ผู้ใช้กรอกไว้ก่อนที่ useEffect จะ reset
    const preservedOtValues = {
      wSelectOtTime: wSelectOtTime,
      wSelectOtTimeout: wSelectOtTimeout,
      wOtTime: wOtTime,
      wBeforeSelectOtTime: wBeforeSelectOtTime,
      wBeforeSelectOtTimeout: wBeforeSelectOtTimeout,
      wBeforeOtTime: wBeforeOtTime
    };
    
    // รอให้ useEffect ทำงานเสร็จแล้วค่อยเซ็ตค่า OT กลับ
    setTimeout(() => {
      setWSelectOtTime(preservedOtValues.wSelectOtTime);
      setWSelectOtTimeout(preservedOtValues.wSelectOtTimeout);
      setWOtTime(preservedOtValues.wOtTime);
      setWBeforeSelectOtTime(preservedOtValues.wBeforeSelectOtTime);
      setWBeforeSelectOtTimeout(preservedOtValues.wBeforeSelectOtTimeout);
      setWBeforeOtTime(preservedOtValues.wBeforeOtTime);
    }, 100);
    
    // Reset payFullDay checkbox
    setPayFullDay(false);
    
    // Reset isNightShiftCash checkbox
    setIsNightShiftCash(false);
    
    // ไม่ล้างค่าในฟิลด์เพื่อให้ผู้ใช้สามารถเพิ่มข้อมูลต่อเนื่องได้โดยไม่ต้องกรอกซ้ำ
    // เพียงแค่เปลี่ยนวันที่ไปวันถัดไป แต่จำค่าอื่นๆ ไว้ทั้งหมด รวมถึง OT
    // await setWId('');
    // await setWName('');
    // await setWGroup('');
    // await setWStartTime('');
    // await setWEndTime('');
    // await setWAllTime('');
    // 
    // OT (หลังเวลาทำงาน) - จำค่าไว้
    // await setWOtTime('');
    // await setWSelectOtTime('');
    // await setWSelectOtTimeout('');
    //
    // OT (ก่อนเวลาทำงาน) - จำค่าไว้
    // await setWBeforeSelectOtTime('');
    // await setWBeforeSelectOtTimeout('');
    // await setWBeforeOtTime('');
    //
    // await setCashSalary("");
    // await setSpecialtSalary("");
    // await setSpecialtSalaryOT("");
    // await setCashOfHoliday("");
    // await setCashOfHolidayOt("");
    // await setMessageSalary("");
  }

  // Function to add a new row to the rowDataList with specific values
  //   const addRow = (newRowData) => {
  //     setCheckaddData(true);

  //     // Create a copy of the current state
  //     const newDataList = [...rowDataList2];
  //     // Push a new row with specific data
  //     // newDataList.push({ ...initialRowData, ...newRowData });
  //     newDataList.unshift(newRowData);
  //     // Update the state with the new data
  //     setRowDataList2(newDataList);
  //   };


  const addRow = (newRowData) => {
    setCheckaddData(true);

    // Create a copy of the current state
    const newDataList = [...rowDataList2];

    // Check for duplicates
    // const isDuplicate = newDataList.some(
    //   (row) => row.date === newRowData.date && row.startTime === newRowData.startTime && row.endTime === newRowData.endTime
    // );
    const isDuplicate = newDataList.some((row) => {
      const existingStart = parseTime(row.startTime); // Convert existing startTime to minutes
      const existingEnd = parseTime(row.endTime);     // Convert existing endTime to minutes
      const newStart = parseTime(newRowData.startTime); // Convert new startTime to minutes
      const newEnd = parseTime(newRowData.endTime);     // Convert new endTime to minutes
      const existingDate = row.date;
      const newDate = newRowData.date;     // Convert new endTime to minutes

      // Check for time overlap
      const isOverlapping =
        existingDate === newDate &&
        (newStart < existingEnd && newEnd > existingStart);

      return isOverlapping;
    });

    // Helper function to convert "HH.mm" time strings to minutes for easy comparison
    function parseTime(timeString) {
      const [hours, minutes] = timeString.split('.').map(Number);
      return hours * 60 + minutes; // Convert to total minutes
    }

    // if (isDuplicate) {
    //   alert("มีวันและกะที่ลงไว้แล้ว");
    //   return; // Exit the function to prevent adding the duplicate row
    // }

    // Push a new row with specific data
    newDataList.unshift(newRowData);
    
    // Update the state with the new data
    setRowDataList2(newDataList);

  
    // const currentDate = parseInt(wDate, 10);
    const currentDate = parseInt(wDate);

    let nextDate = currentDate + 1;


    if (nextDate > parseInt(lastDate) ) {
      nextDate = 1;
    }

    const formattedNextDate = nextDate.toString();
    setWDate(formattedNextDate);
  };

  // Function to handle editing a row
  const handleEditRow = async (index) => {
    // You can implement the edit logic here, e.g., open a modal for editing
    // console.log('Edit row at index:', index);
    const tmp = await rowDataList2[index];
    // alert(tmp.staffId);
    await setWId(tmp.workplaceId);
    await setWName(tmp.workplaceName);
    await setWGroup(tmp.wGroup || '');
  };

  // New functions for inline editing
  const handleStartEdit = (index) => {
    const rowData = rowDataList2[index];
    setEditMode({ ...editMode, [index]: true });
    setEditData({ 
      ...editData, 
      [index]: { 
        ...rowData,
        beforeStartOtTime: rowData.beforeStartOtTime || '',
        beforeEndOtTime: rowData.beforeEndOtTime || '',
        beforeTotalOtTime: rowData.beforeTotalOtTime || '',
        startTime: rowData.startTime || '',
        endTime: rowData.endTime || '',
        totalTime: rowData.totalTime || '',
        startOtTime: rowData.startOtTime || '',
        endOtTime: rowData.endOtTime || '',
        totalOtTime: rowData.totalOtTime || '',
        specialtSalary: rowData.specialtSalary || '',
        specialtSalaryOT: rowData.specialtSalaryOT || '',
        cashOfHoliday: rowData.cashOfHoliday || '',
        cashOfHolidayOt: rowData.cashOfHolidayOt || '',
        payFullDay: rowData.payFullDay || false,
        isNightShiftCash: rowData.isNightShiftCash || false
      } 
    });
  };

  const handleCancelEdit = (index) => {
    setEditMode({ ...editMode, [index]: false });
    const newEditData = { ...editData };
    delete newEditData[index];
    setEditData(newEditData);
  };

  const handleSaveEdit = async (index) => {
    // Ask user if they want to apply changes to all days using SweetAlert2
    const result = await Swal.fire({
      title: 'เลือกการปรับเปลี่ยนข้อมูล',
      text: 'คุณต้องการปรับเปลี่ยนข้อมูลนี้อย่างไร?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'เปลี่ยนทุกวัน',
      denyButtonText: 'เปลี่ยนแค่วันนี้',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    });
    
    // If user clicks X, ESC, or Cancel button, do nothing
    if (result.isDismissed || result.dismiss === 'cancel') {
      return;
    }
    
    const applyToAllDays = result.isConfirmed; // true if "เปลี่ยนทุกวัน", false if "เปลี่ยนแค่วันนี้"
    const newDataList = [...rowDataList2];
    const editedData = editData[index];
    
    if (applyToAllDays) {
      // Apply changes to all days with same employee
      const currentEmployeeId = newDataList[index].employeeId;
      
      for (let i = 0; i < newDataList.length; i++) {
        if (newDataList[i].employeeId === currentEmployeeId) {
          // เก็บข้อมูลที่ไม่ควรเปลี่ยนแปลงไว้
          const preservedData = {
            date: newDataList[i].date, // เก็บวันที่เดิม
            recordDate: newDataList[i].recordDate,
            tmpIndex: newDataList[i].tmpIndex,
            workplaceId: newDataList[i].workplaceId, // เก็บรหัสหน่วยงานเดิม
            workplaceName: newDataList[i].workplaceName, // เก็บชื่อหน่วยงานเดิม
            employeeId: newDataList[i].employeeId // เก็บรหัสพนักงานเดิม
          };
          
          newDataList[i] = { 
            ...newDataList[i], 
            ...editedData,
            ...preservedData // ใช้ข้อมูลที่เก็บไว้ทับข้อมูลที่แก้ไข
          };
        }
      }
    } else {
      // Apply changes only to current row (when isDenied = true)
      newDataList[index] = { ...newDataList[index], ...editedData };
    }
    
    setRowDataList2(newDataList);
    setEditMode({ ...editMode, [index]: false });
    const newEditData = { ...editData };
    delete newEditData[index];
    setEditData(newEditData);
  };

  const handleEditFieldChange = (index, fieldName, value) => {
    setEditData({
      ...editData,
      [index]: {
        ...editData[index],
        [fieldName]: value
      }
    });
  };

  // Function to handle deleting a row
  const handleDeleteRow = (index) => {
    // Create a copy of the current state
    const newDataList = [...rowDataList2];
    // Remove the row at the specified index
    const updatedList = newDataList.filter((entry) => entry.tmpIndex !== index);
    // alert(index);
    newDataList.splice(index, 1);
    // Update the state with the new data
    setRowDataList2(updatedList);
  };

  async function handleCreateWorkplaceTimerecord(event) {
    setLoading(true); // Set loading to true to block the button

    event.preventDefault();
    // alert('test');

    // Calculate special shift total salary
    const specialShiftTotalSalary = rowDataList2
      .filter(item => item.shift === "specialt_shift" && item.workplaceId)
      .reduce((total, item) => {
        const specialtSalary = parseFloat(item.specialtSalary || '0');
        const specialtSalaryOT = parseFloat(item.specialtSalaryOT || '0');
        return total + specialtSalary + specialtSalaryOT;
      }, 0);

    //get data from input in useState to data
    const data = {
      year: year,
      employeeId: employeeId,
      employeeName: name,
      month: month,
      employee_record: rowDataList2,
      specialShiftTotalSalary: specialShiftTotalSalary.toString(), // Add this field
    };

    try {
      const response = await axios.post(
        endpoint + "/timerecord/createtimerecordemployee",
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        // Send specialShiftTotalSalary to accounting endpoint
        try {
          const accountingData = {
            employeeId: employeeId,
            month: month,
            year: year,
            specialShiftTotalSalary: specialShiftTotalSalary.toString()
          };
          
          console.log("CREATE: Sending to accounting API:", accountingData);
          const accountingResponse = await axios.post(
            "http://10.10.110.7:3000/accounting/searchtimerecordemployee",
            accountingData
          );
          console.log("CREATE: Accounting API response:", accountingResponse.data);
        } catch (accountingError) {
          console.error("CREATE: Error sending to accounting API:", accountingError);
          console.error("CREATE: Accounting error details:", accountingError.response?.data);
        }

        alert("บันทึกสำเร็จ");
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // window.location.reload();
        handleCheckTimerecord();

      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // alert(error)
      // window.location.reload();
    } finally {
      setLoading(false); // Set loading to false to unblock the button
    }
  }

  async function handleUpdateWorkplaceTimerecord(event) {
    event.preventDefault();
    
    // Calculate special shift total salary
    const specialShiftTotalSalary = rowDataList2
      .filter(item => item.shift === "cash_holiday" && item.workplaceId)
      .reduce((total, item) => {
        const specialtSalary = parseFloat(item.cashOfHoliday || '0');
        const specialtSalaryOT = parseFloat(item.cashOfHolidayOt || '0');
        return total + specialtSalary + specialtSalaryOT;
      }, 0);

    //get data from input in useState to data
    const data = {
      year: year,
      employeeId: employeeId,
      employeeName: staffFullName,
      month: month,
      employee_record: rowDataList2,
      specialShiftTotalSalary: specialShiftTotalSalary.toString(), // Add this field
    };
    try {
      const response = await axios.put(
        endpoint + "/timerecord/updatetimerecordemployee/" + timeRecord_id,
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response?.status === 201) {
        // Send specialShiftTotalSalary to accounting endpoint
        try {
          const accountingData = {
            employeeId: employeeId,
            month: month,
            year: year,
            specialShiftTotalSalary: specialShiftTotalSalary.toString()
          };
          
          console.log("UPDATE: Sending to accounting API:", accountingData);
          const accountingResponse = await axios.post(
            "http://10.10.110.7:3000/accounting/searchtimerecordemployee",
            accountingData
          );
          console.log("UPDATE: Accounting API response:", accountingResponse.data);
        } catch (accountingError) {
          console.error("UPDATE: Error sending to accounting API:", accountingError);
          console.error("UPDATE: Accounting error details:", accountingError.response?.data);
        }

        alert("บันทึกสำเร็จ");
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
// handleCheckTimerecord();
        setUpdateButton(true);
        // alert(response.data.recordworkplace[0].employee_workplaceRecord[1].workplaceId);
        setTimeRecord_id(response?.data?.employee_record._id);
        setRowDataList2(
          response?.data?.employee_record
            .sort((a, b) => {
              const dateA = parseInt(a.date, 10);
              const dateB = parseInt(b.date, 10);
        
              // Prioritize dates from 21-30 first, then 01-20
              if ((dateA >= 21 && dateB >= 21) || (dateA <= 20 && dateB <= 20)) {
                return dateA - dateB; // Sort normally within each group
              }
              return dateA >= 21 ? -1 : 1; // Move 21-30 to the front
            })
            .map((item, index) => ({
              ...item,
              tmpIndex: index,
            }))
        );
        
        // setRowDataList2(
        //   response?.data?.employee_record.sort((a, b) => parseInt(a.date) - parseInt(b.date)) // Sort by date (ascending order)
        //     .map((item, index) => ({
        //       ...item,
        //       tmpIndex: index,
        //     }))
        // );

      //   //get data from conclude data then check edit data
      //   const serchConclude = await {
      //     year: year,
      //     month: month,
      //     concludeDate: "",
      //     employeeId: searchEmployeeId,
      //     employeeName: searchEmployeeName,
      //   };

      //   try {
      //     const concludeResponse = await axios.post(
      //       endpoint + "/conclude/search",
      //       serchConclude
      //     );

      //     // await alert(JSON.stringify(concludeResponse ,null,2));
      //     if (concludeResponse.data.recordConclude.length < 1) {
      //       // await alert('conclude is null');
      //       window.location.reload();
      //     } else {
      //       // await alert('conclude is set');
      //       await localStorage.setItem("editConclude", searchEmployeeId);
      //       await localStorage.setItem("employeeId", searchEmployeeId);
      //       await localStorage.setItem("month", month);
      //       await localStorage.setItem("year", year);

      //       // await setIsDataTrue(true); // Set isDataTrue based on fetched data
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      //   // window.location.reload();
      }
      
    } catch (error) {
      alert("error" + error);
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // window.location.reload();
    }
  }

  /////////////////
  const [selectedOption, setSelectedOption] = useState("agencytime");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitForm1 = (event) => {
    event.preventDefault();
    // Handle submission for Form 1
  };

  const handleStaffIdChange = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);
    setSearchEmployeeId(selectedStaffId);
    // Find the corresponding employee and set the staffName
    const selectedEmployee = employeeList.find(
      (employee) => employee.employeeId === selectedStaffId
    );
    if (selectedEmployee) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setStaffFullName(selectedEmployee.name + " " + selectedEmployee.lastName);
    } else {
      setStaffName("");
      setStaffFullName("");
      setSearchEmployeeName("");
    }
  };

  const handleStaffNameChange = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(
      (employee) =>
        employee.name + " " + employee.lastName === selectedStaffName
    );
    const selectedEmployeeFName = employeeList.find(
      (employee) => employee.name === selectedStaffName
    );

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
    } else {
      setStaffId("");
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  return (
    <section class="content">
      <div class="row">
        <div class="col-md-12">
          <div class="container-fluid">
            {/* <h2 class="title">ข้อมูลการลงเวลาทำงานของพนักงาน</h2> */}
            <div class="row">
              <div class="col-md-12">
                <section class="Frame">
                  <div class="col-md-12">
                    <form onSubmit={handleSearch}>
                      {/* <div class="row">
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="staffId"
                                                            placeholder="รหัสพนักงาน"
                                                            value={staffId}
                                                            onChange={handleStaffIdChange}
                                                            list="staffIdList"
                                                        />
                                                        <datalist id="staffIdList">
                                                            {employeeList.map(employee => (
                                                                <option key={employee.employeeId} value={employee.employeeId} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="staffName"
                                                            placeholder="ชื่อพนักงาน"
                                                            value={staffFullName}
                                                            onChange={handleStaffNameChange}
                                                            list="staffNameList"
                                                        />
                                                        <datalist id="staffNameList">
                                                            {employeeList.map(employee => (
                                                                <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                </div>
                                            </div> */}
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="searchEmployeeId">รหัสพนักงาน</label>
                            {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} /> */}
                            <input
                              type="text"
                              className="form-control"
                              id="staffId"
                              placeholder="รหัสพนักงาน"
                              value={staffId}
                              onChange={handleStaffIdChange}
                              onInput={(e) => {
                                // Remove any non-digit characters
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                              }}
                              list="staffIdList"
                            />
                            <datalist id="staffIdList">
                              <option value="" />
                              {employeeList.map((employee) => (
                                <option
                                  key={employee.employeeId}
                                  value={employee.employeeId}
                                />
                              ))}
                            </datalist>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="searchname">ชื่อพนักงาน</label>
                            {/* <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} /> */}
                            <input
                              type="text"
                              className="form-control"
                              id="staffName"
                              placeholder="ชื่อพนักงาน"
                              value={staffFullName}
                              onChange={handleStaffNameChange}
                              list="staffNameList"
                            />
                            <datalist id="staffNameList">
                              {employeeList.map((employee) => (
                                <option
                                  key={employee.employeeId}
                                  value={
                                    employee.name + " " + employee.lastName
                                  }
                                />
                              ))}
                            </datalist>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-center">
                        <button class="btn b_save" onClick={handleSearch}>
                          <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                        </button>
                      </div>
                    </form>
                    <br />
                    {/* <div class="d-flex justify-content-center">
                                            <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                        </div>
                                        <div class="d-flex justify-content-center">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                            {searchResult.map(workplace => (
                                                                <li
                                                                    key={workplace.id}
                                                                    onClick={() => handleClickResult(workplace)}
                                                                >
                                                                    รหัส {workplace.employeeId} ชื่อ{workplace.name} {workplace.lastName}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                  </div>
                </section>
                {/* <!--Frame--> */}
              </div>
            </div>
            <form onSubmit={handleManageWorkplace}>
              <input type="hidden" id="hiddenField" name="" value={tmpIndex} />

              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label role="agencynumber">รหัสพนักงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencynumber"
                      placeholder="รหัสพนักงาน"
                      value={employeeId !== "null" ? employeeId : ""}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label role="agencyname">ชื่อพนักงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencyname"
                      placeholder="ชื่อพนักงาน"
                      value={name + " " + lastName}
                      onChange={(e) => setName(e.target.value)}
                      readOnly
                    />
                  </div>
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
                {/* <div class="col-md-2">
                                    <div class="form-group">
                                        <label role="datetime">วันที่</label>
                                        <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                            <DatePicker id="datetime" name="datetime"
                                                className="form-control" // Apply Bootstrap form-control class
                                                popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                selected={startjob}
                                                onChange={handleStartDateChange}
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </div>

                                </div> */}
                <div class="col-md-3">
                  <label role="button"></label>
                  <div class="d-flex align-items-end mt-3">
                    <button
                      type="button"
                      class="btn b_save"
                      onClick={handleCheckTimerecord}
                    >
                      <i class="nav-icon fas fa-search"></i> &nbsp; ตรวจสอบ
                    </button>
                  </div>
                </div>
              </div>

              <section className="Frame">
                
  <div className="table-responsive">
    <table className="table table-bordered table-sm text-center align-middle">
      <thead>
        <tr>
          <th rowSpan="2">หน่วยงาน</th>
          <th rowSpan="2">ชื่อหน่วยงาน</th>
          <th rowSpan="2">กลุ่มที่</th>
          <th rowSpan="2">วันที่</th>
          <th rowSpan="2">กะ</th>
          <th colSpan="3">OT (ก่อนเวลาทำงาน)</th>
        <th colSpan="3">เวลาทำงาน</th>
        <th colSpan="3">OT (หลังเวลาทำงาน)</th>
        {(wShift === "specialt_shift" || wShift === "cash_holiday") && <th colSpan="3">จ่ายสด</th>}
        </tr>
      {/* Second Row - Detailed Headers */}
      <tr>

          <th>เข้า OT</th>
          <th>ออก OT</th>
          <th>ชั่วโมง OT</th>
          <th>เข้างาน</th>
          <th>ออกงาน</th>
          <th>ชั่วโมงทำงาน</th>
          <th>เข้า OT</th>
          <th>ออก OT</th>
          <th>ชั่วโมง OT</th>

          {(wShift === "specialt_shift" || wShift === "cash_holiday") && (
            <>
       
              <th>เงิน</th>
              <th>เงิน OT</th>
              {/* <th>หมายเหตุ</th> */}
            </>
          )}
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Workplace ID */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wId"
              placeholder="รหัสหน่วยงาน"
              value={wId}
              onChange={(e) => setWId(e.target.value)}
              list="workplaces"
            />
            <datalist id="workplaces">
              <option value="">ยังไม่ระบุหน่วยงาน</option>
              {workplaceList.map((wp) => (
                <option key={wp._id} value={wp.workplaceId}>
                  {wp.workplaceName}
                </option>
              ))}
            </datalist>
          </td>

          {/* Workplace Name */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wName"
              placeholder="ชื่อหน่วยงาน"
              value={wName}
              onChange={(e) => setWName(e.target.value)}
            />
          </td>

          {/* Group */}
          <td>
            <select
              className="form-control"
              value={wGroup}
              onChange={(e) => setWGroup(e.target.value)}
            >
              <option value="">หน่วยงานหลัก</option>
              {groupOptions1?.map((item) => (
                <option key={item.workplaceComplexId} value={item.workplaceComplexId}>
                  {item.workplaceComplexName}
                </option>
              ))}
            </select>
          </td>

          {/* Date */}
          <td>
            <select
              className="form-control"
              value={wDate}
              onChange={(e) => setWDate(e.target.value)}
            >
              <option value="">เลือกวัน</option>
              {options}
            </select>
          </td>

          {/* Shift */}
          <td>
            <select
              className="form-control"
              value={wShift}
              onChange={(e) => {
                setWShift(e.target.value);
                // Reset checkbox when changing shift
                if (e.target.value !== "cash_holiday") {
                  setIsNightShiftCash(false);
                }
              }}
            >
              <option value="morning_shift">กะเช้า</option>
              <option value="afternoon_shift">กะบ่าย</option>
              <option value="night_shift">กะดึก</option>
              <option value="specialt_shift">กะพิเศษ</option>
              <option value="cash_holiday">เงินสด</option>
            </select>
            
            {/* Show checkbox when selecting "เงินสด" */}
            {wShift === "cash_holiday" && (
              <div className="mt-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isNightShiftCashCheckbox"
                    checked={isNightShiftCash}
                    onChange={(e) => setIsNightShiftCash(e.target.checked)}
                  />
                  <label className="form-check-label text-center" htmlFor="isNightShiftCashCheckbox">
                    กะดึก
                  </label>
                </div>
              </div>
            )}
          </td>

          {/* OT Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wBeforeSelectOtTime"
              placeholder="เข้า OT"
              value={wBeforeSelectOtTime}
              // onChange={(e) => setWBeforeSelectOtTime(e.target.value)}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wBeforeSelectOtTime;
                
                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWBeforeSelectOtTime(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWBeforeSelectOtTime(value);

                // Auto focus to next input only when completing valid entry
                if (value.length === 5 && value.includes('.') && value.length > prevValue.length) {
                  const nextInput = document.getElementById('wBeforeSelectOtTimeout');
                  if (nextInput && !nextInput.value) nextInput.focus();
                }
              }}>
              </input>
            </td>

          {/* OT End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wBeforeSelectOtTimeout"
              placeholder="ออก OT"
              value={wBeforeSelectOtTimeout}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wBeforeSelectOtTimeout;

                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWBeforeSelectOtTimeout(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWBeforeSelectOtTimeout(value);

                // Auto focus to next input only when completing valid entry
                if (value.length === 5 && value.includes('.') && value.length > prevValue.length) {
                  const nextInput = document.getElementById('wStartTime');
                  if (nextInput && !nextInput.value) nextInput.focus();
                }
              }}
            />
          </td>

          {/* OT Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wOtTime"
              placeholder="ชั่วโมง OT"
              value={wBeforeOtTime}
              onChange={(e) => setBeforeWOtTime(e.target.value)}
            />
          </td>

          {/* Work Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wStartTime"
              placeholder="เข้างาน"
              value={wStartTime}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wStartTime;

                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWStartTime(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWStartTime(value);

                // Auto focus to next input only when completing valid entry
                if (value.length === 5 && value.includes('.') && value.length > prevValue.length) {
                  const nextInput = document.getElementById('wEndTime');
                  if (nextInput && !nextInput.value) nextInput.focus();
                }
              }}
            />
          </td>

          {/* Work End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wEndTime"
              placeholder="ออกงาน"
              value={wEndTime}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wEndTime;
                
                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWEndTime(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWEndTime(value);

                // Auto focus to next input only when completing valid entry
                if (value.length === 5 && value.includes('.') && value.length > prevValue.length) {
                  const nextInput = document.getElementById('wSelectOtTime');
                  if (nextInput && !nextInput.value) nextInput.focus();
                }
              }}
             />
          </td>

          {/* Work Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wAllTime"
              placeholder="ชั่วโมงทำงาน"
              value={wAllTime}
              onChange={(e) => setWAllTime(e.target.value)}
            />
            {/* Show checkbox when work hours < 8 */}
            {wAllTime && parseFloat(wAllTime) < 8 && (
              <div className="mt-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="payFullDayCheckbox"
                    checked={payFullDay}
                    onChange={(e) => setPayFullDay(e.target.checked)}
                  />
                  <label className="form-check-label text-center" htmlFor="payFullDayCheckbox">
                    จ่ายเต็มวัน
                  </label>
                </div>
              </div>
            )}
          </td>

          {/* OT Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wSelectOtTime"
              placeholder="เข้า OT"
              value={wSelectOtTime}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wSelectOtTime;
                
                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWSelectOtTime(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWSelectOtTime(value);

                // Auto focus to next input only when completing valid entry
                if (value.length === 5 && value.includes('.') && value.length > prevValue.length) {
                  const nextInput = document.getElementById('wSelectOtTimeout');
                  if (nextInput && !nextInput.value) nextInput.focus();
                }
              }}
            />
          </td>

          {/* OT End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wSelectOtTimeout"
              placeholder="ออก OT"
              value={wSelectOtTimeout}
              onChange={(e) => {
                let value = e.target.value;
                const prevValue = wSelectOtTimeout;
                
                // Always allow deletion
                if (value.length < prevValue.length) {
                  setWSelectOtTimeout(value);
                  return;
                }

                // Only allow digits and dot
                value = value.replace(/[^\d.]/g, '');

                // Don't allow multiple dots
                if ((value.match(/\./g) || []).length > 1) {
                  return;
                }

                // Add dot after 2 digits only when typing, not when deleting
                if (value.length === 2 && !value.includes('.') && value.length > prevValue.length) {
                  value = value + '.';
                }

                // Validate hours and minutes
                if (value.includes('.')) {
                  const [hours, minutes] = value.split('.');
                  if (hours && parseInt(hours) > 24) {
                    value = '24' + (minutes ? '.' + minutes : '');
                  }
                  if (minutes && parseInt(minutes) > 59) {
                    value = hours + '.59';
                  }
                } else if (value.length > 2) {
                  // If no dot and length > 2, format it
                  const hours = value.substring(0, 2);
                  const minutes = value.substring(2);
                  value = hours + '.' + minutes;
                }

                // Limit total length
                if (value.length > 5) return;

                setWSelectOtTimeout(value);
              }}
            />
          </td>

          {/* OT Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wOtTime"
              placeholder="ชั่วโมง OT"
              value={wOtTime}
              onChange={(e) => setWOtTime(e.target.value)}
            />
          </td>

          {/* Special Shift Salary Fields (Only for กะพิเศษ) */}
          {(wShift === "specialt_shift" || wShift === "cash_holiday") && (
            <>
              
              <td>
                <input
                  type="text"
                  className="form-control text-center input"
                  id={wShift === "specialt_shift" ? "specialtSalary" : "cashOfHoliday"}
                  placeholder="เป็นเงิน"
                  value={wShift === "specialt_shift" ? specialtSalary : cashOfHoliday}
                  style={{ width: "100px" }}
                  onChange={(e) => wShift === "specialt_shift" ? setSpecialtSalary(e.target.value) : setCashOfHoliday(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control text-center"
                  id={wShift === "specialt_shift" ? "specialtSalaryOT" : "cashOfHolidayOt"}
                  placeholder="OT เป็นเงิน"
                  style={{ width: "100px" }}
                  value={wShift === "specialt_shift" ? specialtSalaryOT : cashOfHolidayOt}
                  onChange={(e) => wShift === "specialt_shift" ? setSpecialtSalaryOT(e.target.value) : setCashOfHolidayOt(e.target.value)}
                />
              </td>
              {/* <td>
                <input
                  type="text"
                  className="form-control text-center"
                  id="messageSalary"
                  placeholder="หมายเหตุ"
                  value={messageSalary}
                  onChange={(e) => setMessageSalary(e.target.value)}
                />
              </td> */}
            </>
          )}
        </tr>
      </tbody>
    </table>
  </div>

  {/* Submit Button */}
  <div className="form-group mt-3">
    <button className="btn b_save">
      <i className="fas fa-check"></i> &nbsp; เพิ่ม
    </button>
  </div>
</section>
              
            </form>

            <form onSubmit={handleManageWorkplace}>
            <section className="Frame">
  <div className="table-responsive">
    <table className="table table-bordered table-sm text-center align-middle">
      <thead>
        <tr>
          {/* <th className="text-center" style={{ backgroundColor: "transparent" }}>หน่วยงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชื่อหน่วยงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>กลุ่มงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>วันที่</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>กะ</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาเข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>


          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้างาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออกงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมงทำงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เงินพิเศษ</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ลบ</th> */}

<th rowSpan="2" className="text-center">หน่วยงาน</th>
          <th rowSpan="2" className="text-center">ชื่อหน่วยงาน</th>
          <th rowSpan="2" className="text-center">กลุ่มงาน</th>
          <th rowSpan="2" className="text-center">วันที่</th>
          <th rowSpan="2" className="text-center">กะ</th>
          <th colSpan="3" className="text-center">OT (ก่อนเวลาทำงาน)</th>
        <th colSpan="3" className="text-center">เวลาทำงาน</th>
        <th colSpan="3" className="text-center">OT (หลังเวลาทำงาน)</th>
        <th rowSpan="2" className="text-center">เงินจ้าง</th>
        <th rowSpan="2" className="text-center">จัดการ</th>


        </tr><tr>

          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาเข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>


          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้างาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออกงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมงทำงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>

        </tr>
      </thead>
      <tbody>
        {rowDataList2.map(
          (rowData2, index) =>
            rowData2.workplaceId && (
              <tr key={index} className="align-middle text-center">
                <th>{rowData2.workplaceId}</th>
                <th>{rowData2.workplaceName}</th>
                <th>{groupOptions[parseInt(rowData2.wGroup) -1 ] || ""}</th> 
                <th>{rowData2.date}</th>
                <th>
                  {editMode[index] ? (
                    <div>
                      <select
                        className="form-control form-control-sm"
                        value={editData[index]?.shift || rowData2.shift}
                        onChange={(e) => {
                          handleEditFieldChange(index, 'shift', e.target.value);
                          // Reset checkbox when changing shift
                          if (e.target.value !== "cash_holiday") {
                            handleEditFieldChange(index, 'isNightShiftCash', false);
                          }
                        }}
                        style={{ width: "100px", fontSize: "12px" }}
                      >
                        <option value="morning_shift">กะเช้า</option>
                        <option value="afternoon_shift">กะบ่าย</option>
                        <option value="night_shift">กะดึก</option>
                        <option value="specialt_shift">กะพิเศษ</option>
                        <option value="cash_holiday">เงินสด</option>
                      </select>
                      
                      {/* Show checkbox when editing and shift is "เงินสด" */}
                      {(editData[index]?.shift || rowData2.shift) === "cash_holiday" && (
                        <div className="form-check mt-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`editIsNightShiftCash${index}`}
                            checked={editData[index]?.isNightShiftCash || false}
                            onChange={(e) => handleEditFieldChange(index, 'isNightShiftCash', e.target.checked)}
                            style={{ fontSize: "10px" }}
                          />
                          <label className="form-check-label" htmlFor={`editIsNightShiftCash${index}`} style={{ fontSize: "10px" }}>
                            กะดึก
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {rowData2.shift === "morning_shift"
                        ? "กะเช้า"
                        : rowData2.shift === "afternoon_shift"
                        ? "กะบ่าย"
                        : rowData2.shift === "night_shift"
                        ? "กะดึก"
                        : rowData2.shift === "specialt_shift"
                        ? "กะพิเศษ"
                        : rowData2.shift === "cash_holiday"
                        ? "เงินสด"
                        : ""}
                      
                      {/* Show badge when shift is cash_holiday and isNightShiftCash is true */}
                      {rowData2.shift === "cash_holiday" && rowData2.isNightShiftCash && (
                        <div>
                          <span className="badge badge-info" style={{ fontSize: "10px" }}>
                            กะดึก
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </th>
                
                {/* OT Before Work */}
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.beforeStartOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'beforeStartOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.beforeStartOtTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.beforeEndOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'beforeEndOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.beforeEndOtTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.beforeTotalOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'beforeTotalOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.beforeTotalOtTime
                  )}
                </th>

                {/* Work Time */}
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.startTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'startTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.startTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.endTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'endTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.endTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <div>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editData[index]?.totalTime || ''}
                        onChange={(e) => handleEditFieldChange(index, 'totalTime', e.target.value)}
                        style={{ width: "80px", fontSize: "12px" }}
                      />
                      {editData[index]?.totalTime && parseFloat(editData[index]?.totalTime) < 8 && (
                        <div className="form-check mt-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`editPayFullDay${index}`}
                            checked={editData[index]?.payFullDay || false}
                            onChange={(e) => handleEditFieldChange(index, 'payFullDay', e.target.checked)}
                            style={{ fontSize: "10px" }}
                          />
                          <label className="form-check-label" htmlFor={`editPayFullDay${index}`} style={{ fontSize: "10px" }}>
                            จ่ายเต็มวัน
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {rowData2.totalTime}
                      {rowData2.payFullDay && (
                        <div>
                          <span className="badge badge-success" style={{ fontSize: "10px" }}>
                            จ่ายเต็มวัน
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </th>
                
                {/* OT After Work */}
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.startOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'startOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.startOtTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.endOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'endOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.endOtTime
                  )}
                </th>
                <th>
                  {editMode[index] ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editData[index]?.totalOtTime || ''}
                      onChange={(e) => handleEditFieldChange(index, 'totalOtTime', e.target.value)}
                      style={{ width: "80px", fontSize: "12px" }}
                    />
                  ) : (
                    rowData2.totalOtTime
                  )}
                </th>

                {/* Salary */}
                <th>
                  {editMode[index] ? (
                    <div className="d-flex flex-column" style={{ gap: "2px" }}>
                      {((editData[index]?.shift || rowData2.shift) === "specialt_shift" || (editData[index]?.shift || rowData2.shift) === "cash_holiday") && (
                        <>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="เงินหลัก"
                            value={(editData[index]?.shift || rowData2.shift) === "specialt_shift" ? 
                              (editData[index]?.specialtSalary || '') : 
                              (editData[index]?.cashOfHoliday || '')}
                            onChange={(e) => handleEditFieldChange(index, 
                              (editData[index]?.shift || rowData2.shift) === "specialt_shift" ? 'specialtSalary' : 'cashOfHoliday', 
                              e.target.value)}
                            style={{ width: "80px", fontSize: "11px" }}
                          />
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="เงิน OT"
                            value={(editData[index]?.shift || rowData2.shift) === "specialt_shift" ? 
                              (editData[index]?.specialtSalaryOT || '') : 
                              (editData[index]?.cashOfHolidayOt || '')}
                            onChange={(e) => handleEditFieldChange(index, 
                              (editData[index]?.shift || rowData2.shift) === "specialt_shift" ? 'specialtSalaryOT' : 'cashOfHolidayOt', 
                              e.target.value)}
                            style={{ width: "80px", fontSize: "11px" }}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      {rowData2.specialtSalary !== "" 
                        ? `${parseFloat(rowData2.specialtSalary || '0') + parseFloat(rowData2.specialtSalaryOT || '0')} บาท`
                        : rowData2.cashOfHoliday !== ""
                        ? `${parseFloat(rowData2.cashOfHoliday || '0') + parseFloat(rowData2.cashOfHolidayOt || '0')} บาท`
                        : ""}
                    </>
                  )}
                </th>
                
                {/* Action Buttons */}
                <th className="text-center">
                  {editMode[index] ? (
                    <div className="d-flex gap-1 justify-content-center">
                      <button 
                        type="button"
                        className="btn btn-success btn-sm"
                        style={{ padding: "0.25rem 0.5rem" }}
                        onClick={() => handleSaveEdit(index)}
                        title="บันทึก"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.25rem 0.5rem" }}
                        onClick={() => handleCancelEdit(index)}
                        title="ยกเลิก"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1 justify-content-center">
                      <button 
                        type="button"
                        className="btn btn-warning btn-sm"
                        style={{ width: "2.5rem", padding: "0.25rem 0.5rem" }}
                        onClick={() => handleStartEdit(index)}
                        title="แก้ไข"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        type="button"
                        className="btn btn-danger btn-sm"
                        style={{ width: "2.5rem", padding: "0.25rem 0.5rem" }}
                        onClick={() => handleDeleteRow(rowData2.tmpIndex)}
                        title="ลบ"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}
                </th>
              </tr>
            )
        )}
      </tbody>
    </table>
  </div>

  {/* สรุปสถิติ */}
  {rowDataList2.length > 0 && (() => {
    // Calculate special shift totals
    const specialShiftData = rowDataList2.filter(item => item.shift === "specialt_shift" && item.workplaceId);
    const specialShiftDays = specialShiftData.length;
    const specialShiftTotalSalary = specialShiftData.reduce((total, item) => {
      const specialtSalary = parseFloat(item.specialtSalary || '0');
      const specialtSalaryOT = parseFloat(item.specialtSalaryOT || '0');
      return total + specialtSalary + specialtSalaryOT;
    }, 0);

    return (
      <div className="mt-3 p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
        <h5 className="text-center mb-8">สรุปสถิติการทำงาน</h5>
        <div className="row text-center">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">รวมทั้งหมด</h6>
                <h4 className="text-primary">
                  {rowDataList2.filter(item => item.workplaceId).length} วัน
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">กะเช้า</h6>
                <h4 className="text-success">
                  {rowDataList2.filter(item => item.shift === "morning_shift" && item.workplaceId).length} วัน
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">กะบ่าย</h6>
                <h4 className="text-warning">
                  {rowDataList2.filter(item => item.shift === "afternoon_shift" && item.workplaceId).length} วัน
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">กะพิเศษ</h6>
                <h4 className="text-danger">
                  {specialShiftDays} วัน
                </h4>
                <p className="text-muted mb-0">
                  รวม: {specialShiftTotalSalary.toLocaleString()} บาท
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* แสดงรายละเอียดวันที่เป็นกะพิเศษ */}
        {specialShiftDays > 0 && (
          <div className="mt-3">
            <h6>รายละเอียดวันที่ทำงานกะพิเศษ:</h6>
            <div className="row">
              {specialShiftData.map((item, index) => (
                <div key={index} className="col-md-2 mb-2">
                  <span className="badge badge-danger p-2">
                    วันที่ {item.date} - {item.workplaceName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  })()}
</section>

              <div class="form-group">
                {updateButton ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      class="btn b_save"
                      onClick={handleUpdateWorkplaceTimerecord}
                      disabled={loading}
                    >
                      <i class="nav-icon fas fa-save"></i> &nbsp; อัพเดท
                    </button>
                    <button
                      class="btn btn-info"
                      onClick={generatePDFReport}
                      disabled={loading || rowDataList2.length === 0}
                      style={{
                        backgroundColor: '#17a2b8',
                        borderColor: '#17a2b8',
                        color: 'white'
                      }}
                    >
                      <i class="nav-icon fas fa-file-pdf"></i> &nbsp; ออกเอกสาร
                      
                    </button>
                  </div>
                ) : (
                  <button
                    class="btn b_save"
                    onClick={handleCreateWorkplaceTimerecord}
                    disabled={loading}
                  >
                    <i class="nav-icon fas fa-save"></i> &nbsp; บันทึก
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}
      {/* {JSON.stringify(rowDataList2)} */}

      {/* Hidden Link to /test */}
      <Link to="/compensation" style={{ display: "none" }} ref={linkRef}>
        Go to Test
      </Link>
      {/* <div>
      <h2>Days of the Month: {month + 1}/{year}</h2>
      <ul>
        {daysOfMonth.map((day, index) => (
          <li key={day}>
            {day} ({daysOfWeek[index]})
          </li>
        ))}
      </ul>
    </div> */}
    </section>
  );
}

export default AddsettimeEmployee;
