import endpoint from "../../config";
import { Table } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./table.css";

import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library
import Swal from 'sweetalert2';

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ExcelJS from 'exceljs';

// import TestPDF from './TestPDF';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";
import { useTable } from "react-table";

import th from "date-fns/locale/th"; // Import Thai locale data from date-fns
import en from "date-fns/locale/en-US";

import DatePicker from "react-datepicker";
import * as XLSX from 'xlsx';
import { is } from "date-fns/locale";


function WorktimeSheetWorkplace({ employeeList }) {
  // ===== การตั้งค่าการรวม ID ที่นี่จุดเดียว =====
  // *** การแก้ไข: เปลี่ยนเฉพาะค่าใน MERGE_CONFIG นี้เท่านั้น ***
  const MERGE_CONFIG = {
    sourceId1: '',    // ID แรกที่จะรวม (เปลี่ยนตรงนี้เป็น ID ที่ต้องการ)
    sourceId2: '',    // ID ที่สองที่จะรวม (เปลี่ยนตรงนี้เป็น ID ที่ต้องการ)
    displayId: '1599' // รูปแบบที่จะแสดงเมื่อรวมแล้ว (เปลี่ยนตรงนี้เป็นรูปแบบที่ต้องการ)
  };
  // ตัวอย่าง: หากต้องการรวม ID 1560 กับ 1410 ให้แก้เป็น:
  // sourceId1: '1560', sourceId2: '1410', displayId: '1560(1)'
  // ============================================

  // เพิ่ม error state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Error handler
  const handleError = (error, errorInfo = '') => {
    console.error('WorktimeSheetWorkplace Error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
  };

  // Reset error state
  const resetError = () => {
    setHasError(false);
    setErrorMessage('');
  };

  // ถ้าเกิด error ให้แสดง error screen
  if (hasError) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            เกิดข้อผิดพลาด
          </h4>
          <p className="mb-3">{errorMessage}</p>
          <hr />
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-danger" 
              onClick={resetError}
            >
              <i className="fas fa-redo me-1"></i>
              ลองใหม่
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-refresh me-1"></i>
              รีเฟรชหน้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ห่อ component ด้วย try-catch
  try {

  const vertical1 = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const verticalText = {
    writingMode: "vertical-rl",
    textAlign: "center", // Adjust as needed
    whiteSpace: "nowrap", // Prevent text wrapping
  };
  const verticalTextHeader = {
    writingMode: "vertical-rl",
    textAlign: "center",
    whiteSpace: "nowrap",
    transform: "rotate(180deg)", // Rotate the text 180 degrees
  };

  useEffect(() => {
    document.title = "ตารางเวลาทำงานพนักงาน";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);

  const styles = {
    th: {
      minWidth: "4rem",
    },
  };
  const [dataset, setDataset] = useState([]);
  const [workplaceIdEMP, setWorkplaceIdEMP] = useState(""); //รหัสหน่วยงาน
  const [workplaceData, setWorkplaceData] = useState(null); // เพิ่ม state สำหรับข้อมูล workplace

  const [workplaceList, setWorkplaceList] = useState([]);
  const [workplaceDataList, setWorkplaceDataList] = useState([]);
  const [workplaceDataListDayOff, setWorkplaceDataListDayOff] = useState([]);
  const [workplaceDataListAddSalary, setWorkplaceDataListAddSalary] = useState(
    []
  );
  const [workplaceDataWorkTime, setWorkplaceDataWorkTime] = useState([]);
  const [workplaceDataWorkOfHour, setWorkplaceDataWorkOfHour] = useState("");
  const [workplaceDataListWorkRate, setWorkplaceDataListWorkRate] = useState();
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  const [conclude, setConclude] = useState([]);

  const [responseDataAll, setResponseDataAll] = useState([]);
  const [leaveSalary, setLeaveSalary] = useState([]);

  const [WName, setWName] = useState("");

  const [workDate, setWorkDate] = useState(new Date());

  const [workRateWorkplace, setWorkRateWorkplace] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage1, setWorkRateWorkplaceStage1] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage2, setWorkRateWorkplaceStage2] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage3, setWorkRateWorkplaceStage3] = useState(0);
const [weekendData, setWeekendData] = useState([]);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  
  // Loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false); // เพิ่ม loading สำหรับ Excel
  const [showTable, setShowTable] = useState(true); // เปลี่ยนเป็น true เพื่อแสดงตารางทันที


  // const handleWorkDateChange = (date) => {
  //     setWorkDate(date);
  // };

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


const fetchWeekendData = async (year, month, workplaceId) => {
  try {
    const response2 = await fetch('http://10.10.110.7:3000/workplace/caldata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        month,
        workplaceId,
      }),
    });
    const data2 = await response2.json();
    
    // แล้วค่อยเรียก conclude/getWeekendDates
    const response = await fetch(
      `${endpoint}/conclude/getWeekendDates?yyyy=${year}&mm=${month.padStart(2, '0')}&workplaceId=${workplaceId}`
    );
    const data = await response.json();

    const weekends = [];
    
    // สร้าง Set ของวันหยุดนักขัตฤกษ์เพื่อตรวจสอบ (รองรับทั้งรูปแบบเก่าและใหม่)
    const dayOffOnlySet = new Set();
    if (data.dayOffOnly) {
      data.dayOffOnly.forEach(item => {
        // ถ้าเป็น object (รูปแบบใหม่) ให้เอา date
        // ถ้าเป็น string (รูปแบบเก่า) ให้ใช้เลย
        const date = typeof item === 'object' ? item.date : item;
        dayOffOnlySet.add(date);
      });
    }
    
    // เพิ่มข้อมูล weekendOnly (แต่ไม่เอาวันที่อยู่ใน dayOffOnly)
    if (data.weekendOnly) {
      data.weekendOnly.forEach(date => {
        if (!dayOffOnlySet.has(date)) {
          weekends.push({ date, type: 'weekend' });
        }
      });
    }
    
    // เพิ่มข้อมูล dayOffOnly (วันหยุดนักขัตฤกษ์ - ให้ความสำคัญสูงสุด)
    if (data.dayOffOnly) {
      data.dayOffOnly.forEach(item => {
        // รองรับทั้งรูปแบบเก่า (string) และรูปแบบใหม่ (object)
        const date = typeof item === 'object' ? item.date : item;
        const message = typeof item === 'object' ? item.message : 'วันหยุดนักขัตฤกษ์';
        weekends.push({ date, type: 'dayOffOnly', message });
      });
    }
    
    // เพิ่มข้อมูล weekendAndDayOff (วันที่เป็นทั้งวันหยุดและวันลา)
    if (data.weekendAndDayOff) {
      data.weekendAndDayOff.forEach(date => {
        weekends.push({ date, type: 'weekendAndDayOff' });
      });
    }
    
    // ✅ เพิ่มการจัดการ dayoffWorkplace - แก้ไขโครงสร้างข้อมูล
    // ให้เป็น array และเพิ่ม property dayoffWorkplace
    weekends.dayoffWorkplace = data.dayoffWorkplace || [];
    
    setWeekendData(weekends);
  } catch (error) {
    console.error('Error fetching weekend data:', error);
    setWeekendData([]);
  }
};

  const ThaiBuddhistToGregorian = (thaiDate) => {
    const gregorianYear = thaiDate.getFullYear() - 543;
    return new Date(gregorianYear, thaiDate.getMonth(), thaiDate.getDate());
  };

  const initialThaiDate = new Date();
  initialThaiDate.setFullYear(initialThaiDate.getFullYear() + 543); // Add 543 years to the current year

  const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
  const [selectedGregorianDate, setSelectedGregorianDate] = useState(
    new Date()
  );

  const handleThaiDateChange = (date) => {
    setSelectedThaiDate(date);
    setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
    // setWorkDate(date);
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setWorkDate(newDate);
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
  }, [selectedDate]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleGregorianDateChange = (date) => {
    setSelectedGregorianDate(date);
    setSelectedThaiDate(GregorianToThaiBuddhist(date));
  };

  const [daysOffArray, setDaysOffArray] = useState([]);
  const [result_data, setResult_data] = useState([]);
  const [timerecordAllList, setTimerecordAllList] = useState([]);
  const [emploeeData, setEmploeeData] = useState([]);
  const [emploeeDataSearch, setEmploeeDataSearch] = useState([]);
  const [employeePrefixes, setEmployeePrefixes] = useState({});


  const [arraytestEmpAddSalary, setArraytestEmpAddSalary] = useState([]);

  const [empIDlist, setEmpIDlist] = useState([]);

  const getThaiMonthName = (month) => {
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // Ensure the month is a valid number between 1 and 12
    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return "Invalid Month";
    }

    return thaiMonths[monthNumber - 1];
  };

  // Helper function to format time values (convert 1.30 to 1.50 format)
  const formatTimeValue = (value) => {
    if (!value) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Split into integer and decimal parts
    const integerPart = Math.floor(numValue);
    const decimalPart = numValue - integerPart;
    
    // Convert decimal part (0.30 becomes 0.50, 0.15 becomes 0.25, etc.)
    // This assumes the decimal represents minutes (30 minutes = 0.50 hours)
    const formattedDecimal = decimalPart > 0 ? Math.round(decimalPart * 100 / 60 * 100) / 100 : 0;
    
    const result = integerPart + formattedDecimal;
    return result.toFixed(2);
  };

  // Helper function to format time values for Excel with 1 decimal place
  const formatTimeValueForExcel = (value) => {
    if (!value) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    // Split into integer and decimal parts
    const integerPart = Math.floor(numValue);
    const decimalPart = numValue - integerPart;
    
    // Convert decimal part (0.30 becomes 0.50, 0.15 becomes 0.25, etc.)
    // This assumes the decimal represents minutes (30 minutes = 0.50 hours)
    const formattedDecimal = decimalPart > 0 ? Math.round(decimalPart * 100 / 60 * 100) / 100 : 0;
    
    const result = integerPart + formattedDecimal;
    return result.toFixed(1); // ใช้ทศนิยม 1 ตำแหน่งสำหรับ Excel
  };

  // Helper function to format numbers with comma thousands separator
  const formatNumberWithComma = (value) => {
    if (!value || value === '') return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return numValue.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  const thaiToEnglishDayMap = {
    จันทร์: ["Mon"],
    อังคาร: ["Tue"],
    พุธ: ["Wed"],
    พฤหัส: ["Thu"],
    ศุกร์: ["Fri"],
    เสาร์: ["Sat"],
    อาทิตย์: ["Sun"],
  };

useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Sort data by workplaceId (handle numbers with parentheses) - ASCENDING ORDER
        const sortedData = [...data].sort((a, b) => {
          // Extract main number and number in parentheses
          const parseWorkplaceId = (id) => {
            const idStr = String(id).trim();
            
            // Handle numbers with parentheses like "10296(1)"
            const matchWithParens = idStr.match(/^(\d+)\((\d+)\)$/);
            if (matchWithParens) {
              return {
                main: parseInt(matchWithParens[1], 10),
                sub: parseInt(matchWithParens[2], 10)
              };
            }
            
            // Handle pure numbers like "10296" - treat as if it has (0)
            const matchPureNumber = idStr.match(/^\d+$/);
            if (matchPureNumber) {
              return { 
                main: parseInt(idStr, 10), 
                sub: 0
              };
            }
            
            return { main: 0, sub: 0 };
          };
          
          const aData = parseWorkplaceId(a.workplaceId);
          const bData = parseWorkplaceId(b.workplaceId);
          
          // Compare main number first - ASCENDING (น้อยไปมาก)
          if (aData.main !== bData.main) {
            return aData.main - bData.main;
          }
          
          // If main numbers are equal, compare sub numbers - ASCENDING (น้อยไปมาก)  
          return aData.sub - bData.sub;
        });
        
        // Update the state with the fetched data
        setWorkplaceList(sortedData);
        setWorkplaceListAll(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  // useEffect(() => {
  //     // Fetch data from the API when the component mounts
  //     fetch(endpoint + '/timerecord/listemp')
  //         .then(response => response.json())
  //         .then(data => {
  //             // Update the state with the fetched data
  //             setTimerecordAllList(data);
  //             // alert(data[0].workplaceName);
  //         })
  //         .catch(error => {
  //             console.error('Error fetching data:', error);
  //         });
  // }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/timerecord/listemp")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        if (Array.isArray(data) && data.length > 0) {
          setTimerecordAllList(data);
        } else {
          // If data is empty or not found, set state to an empty array
          setTimerecordAllList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/leave/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Filter the data based on year, month, and employeeId array
  //       const filteredData = data.filter((item) =>
  //         item.year === year &&
  //         item.month === month &&
  //         responseDataAll.some((employee) => employee.employeeId === item.employeeId)
  //       );

  //       // Update the state with the filtered data
  //       setLeaveSalary(filteredData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, [year, month, responseDataAll]);

  const [employeelist, setEmployeelist] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [listDayOff, setListDayOff] = useState([]);
  const [y, setY] = useState("");
  const [m, setM] = useState("");
  const [m1, setM1] = useState("");

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/employee/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setEmployeelist(data);
  //       // alert(data[0].workplaceName);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []); // The empty array [] ensures that the effect runs only once after the initial render

  useEffect(() => {
    const fetchData = () => {
      const dataTest = {
        timerecordId: "2024", // Specify the timerecordId here
        month: "03", // Specify the month here
      };
      axios
        .post(endpoint + "/timerecord/listemp", dataTest)
        .then((response) => {
          // Handle the response data here
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error fetching data:", error);
        });
    };

    fetchData(); // Call the fetchData function when component mounts or whenever needed
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    // conclude / list
    // fetch(endpoint + '/timerecord/listemp')
    fetch(endpoint + "/conclude/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        if (Array.isArray(data) && data.length > 0) {
          setConclude(data);
        } else {
          // If data is empty or not found, set state to an empty array
          setConclude([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //data for show in table
  const [listTableDayoff, setListTableDayoff] = useState([]);
  //data for check list dayoff
  const [data_listDayoff, setData_listDayoff] = useState([]);

  // Generate an array containing numbers from 21 to 31
  const range1 = Array.from({ length: 11 }, (_, i) => i + 21);

  // Generate an array containing numbers from 1 to 20
  const range2 = Array.from({ length: 20 }, (_, i) => i + 1);

  // Combine the two ranges into a single array
  const combinedRange = [...range1, ...range2];

  const [countWork, setCountWork] = useState(0);
  const [countWorkSTime, setCountWorkSTime] = useState(0);

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [workplaceIdList, setWorkplaceIdList] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1998 },
    (_, index) => currentYear - index
  );


  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [codePage, setCodePage] = useState("FM-HR-005-03"); //ชื่อหน่วยงาน

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [empId, setEmpId] = useState([]);

  const [searchResult1, setSearchResult1] = useState([]);

  const [woekplace, setWoekplace] = useState([]);

  const [calendarData1, setCalendarData1] = useState([]);
  const [calendarData2, setCalendarData2] = useState([]);
  // const yeartest = 2023;
  const monthtest = 3; // 3 represents March using 1-based indexing

  const [data, setData] = useState([]); // เปลี่ยนเป็น array เพื่อป้องกันปัญหา
  const [loading, setLoading] = useState(true);
  const [workplaceAddsalary , setWorkplaceAddsalary ] = useState([]);

  // ฟังก์ชันสำหรับรวมสวัสดิการจากหน่วยงานและพนักงาน (ไม่ซ้ำกัน)
  const mergeWorkplaceAndEmployeeAddSalary = (workplaceAddSalary, employeeData) => {
    const uniqueMap = new Map();

    // 1. เพิ่มสวัสดิการจากหน่วยงานก่อน
    if (workplaceAddSalary && Array.isArray(workplaceAddSalary)) {
      workplaceAddSalary.forEach(salary => {
        const key = salary.codeSpSalary || salary.id;
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, {
            codeSpSalary: key,
            name: salary.name,
            SpSalary: salary.SpSalary,
            roundOfSalary: salary.roundOfSalary,
            StaffType: salary.StaffType,
            nameType: salary.nameType || '',
            source: 'workplace'
          });
        }
      });
    }

    // 2. เพิ่มสวัสดิการจากพนักงาน (เฉพาะที่ยังไม่มีในหน่วยงาน)
    if (employeeData && employeeData.length > 0) {
      employeeData.forEach(employee => {
        if (employee.addSalaryList && Array.isArray(employee.addSalaryList)) {
          employee.addSalaryList.forEach(salary => {
            const key = salary.id || salary.codeSpSalary;
            
            // ถ้ายังไม่มีใน Map (หน่วยงานไม่มี แต่พนักงานมี)
            if (key && !uniqueMap.has(key)) {
              uniqueMap.set(key, {
                codeSpSalary: key,
                name: salary.name,
                SpSalary: salary.SpSalary,
                roundOfSalary: salary.roundOfSalary,
                StaffType: salary.StaffType,
                nameType: salary.nameType || '',
                source: 'employee'
              });
            }
          });
        }
      });
    }

    // แปลง Map กลับเป็น Array
    const mergedAddSalary = Array.from(uniqueMap.values());
    
    console.log('🎯 Merged addSalary (workplace + employees):', mergedAddSalary);
    console.log('  - From workplace:', mergedAddSalary.filter(item => item.source === 'workplace').length);
    console.log('  - From employees only:', mergedAddSalary.filter(item => item.source === 'employee').length);
    
    return mergedAddSalary;
  };

  // ฟังก์ชันสำหรับรวม ID ตาม config
  const mergeWorkplaceAddsalary = (items) => {
    const mergedItems = [];
    const processedIndices = new Set();
    
    items.forEach((item, i) => {
      if (processedIndices.has(i)) return;
      
      if (item.codeSpSalary === MERGE_CONFIG.sourceId1) {
        // หา item ที่มี codeSpSalary เป็น sourceId2
        const sourceId2Index = items.findIndex((otherItem, j) => 
          j > i && otherItem.codeSpSalary === MERGE_CONFIG.sourceId2
        );
        
        if (sourceId2Index !== -1) {
          // รวม sourceId1 และ sourceId2 เข้าด้วยกัน
          mergedItems.push({
            ...item,
            codeSpSalary: MERGE_CONFIG.displayId,
            name: item.name + ' + ' + items[sourceId2Index].name
          });
          processedIndices.add(sourceId2Index);
        } else {
          mergedItems.push(item);
        }
      } else if (item.codeSpSalary === MERGE_CONFIG.sourceId2) {
        // ตรวจสอบว่า sourceId2 นี้ยังไม่ได้ถูกรวมกับ sourceId1 แล้ว
        const sourceId1Index = items.findIndex((otherItem, j) => 
          j < i && otherItem.codeSpSalary === MERGE_CONFIG.sourceId1
        );
        
        if (sourceId1Index === -1) {
          // ถ้าไม่มี sourceId1 ก่อนหน้า ให้แสดง sourceId2 ปกติ
          mergedItems.push(item);
        }
        // ถ้ามี sourceId1 ก่อนหน้าแล้ว จะถูก skip เพราะถูกรวมไปแล้ว
      } else {
        mergedItems.push(item);
      }
      
      processedIndices.add(i);
    });
    
    return mergedItems;
  };

  // useEffect สำหรับ fetchEmployeePrefixes (ย้ายมาไว้หลังการประกาศ state)
  useEffect(() => {
    const fetchEmployeePrefixes = async () => {
      // เพิ่ม safety check
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('No data available for prefix fetching');
        return;
      }

      // เพิ่ม safety check สำหรับ endpoint
      if (!endpoint) {
        console.warn('Endpoint not available for prefix fetching');
        return;
      }

      try {
        // console.log(`🔄 Starting to fetch prefixes for ${data.length} employees...`);
        
        const prefixPromises = data.map(async (record) => {
          // เพิ่ม validation สำหรับ record
          if (!record || !record.employeeId) {
            // console.warn('Invalid record or missing employeeId:', record);
            return {
              employeeId: record?.employeeId || 'unknown',
              prefix: ''
            };
          }

          try {
            const response = await axios.post(`${endpoint}/employee/search`, {
              employeeId: record.employeeId
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 5000 // เพิ่ม timeout 5 วินาที
            });
            
            if (response.status === 200 && response.data) {
              // Debug: ดูโครงสร้างข้อมูลที่ได้จาก API
              // console.log(`🔍 API Response for ${record.employeeId}:`, response.data);
              
              // ตรวจสอบโครงสร้างข้อมูล - API ส่งกลับมาเป็น { employees: [...] }
              let employeeData = null;
              
              if (response.data.employees && Array.isArray(response.data.employees)) {
                // หาพนักงานที่ตรงกับ employeeId
                employeeData = response.data.employees.find(emp => emp.employeeId === record.employeeId);
                // console.log(`🔍 Found employee data:`, employeeData);
              } else if (response.data.employeeId) {
                // ถ้าเป็น object เดียว
                employeeData = response.data;
                // console.log(`🔍 Direct employee data:`, employeeData);
              }
              
              const prefix = employeeData?.prefix || '';
              // console.log(`✅ Fetched prefix for ${record.employeeId}: ${prefix || 'empty'}`);
              
              return {
                employeeId: record.employeeId,
                prefix: prefix
              };
            }
          } catch (error) {
            // console.error(`❌ Error fetching prefix for employee ${record.employeeId}:`, error.message);
            // Return fallback data แทนการ throw error
            return {
              employeeId: record.employeeId,
              prefix: record.prefix || '' // ใช้ prefix เดิมถ้า API error
            };
          }
          
          return {
            employeeId: record.employeeId,
            prefix: record.prefix || '' // ใช้ prefix เดิมเป็น fallback
          };
        });

        const prefixResults = await Promise.allSettled(prefixPromises); // ใช้ allSettled แทน all
        
        // แปลงเป็น object เพื่อให้เข้าถึงได้ง่าย
        const prefixMap = {};
        prefixResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            const emp = result.value;
            if (emp.employeeId) {
              prefixMap[emp.employeeId] = emp.prefix;
            }
          }
        });
        
        // console.log(`✅ Successfully processed ${Object.keys(prefixMap).length} prefixes`);
        setEmployeePrefixes(prefixMap);
        
      } catch (error) {
        console.error('❌ Error in fetchEmployeePrefixes:', error);
        // ไม่ต้อง throw error เพื่อป้องกันหน้าขาว
        // ใช้ข้อมูลเดิมแทน
        const fallbackMap = {};
        data.forEach(record => {
          if (record?.employeeId) {
            fallbackMap[record.employeeId] = record.prefix || '';
          }
        });
        setEmployeePrefixes(fallbackMap);
      }
    };

    // เพิ่ม debounce เพื่อป้องกันการเรียก API ซ้ำๆ
    const timeoutId = setTimeout(() => {
      fetchEmployeePrefixes();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [data, endpoint]);


  useEffect(() => {
    const fetchData = async () => {
      let workplaceAddSalaryData = [];
      
      try {
        setWorkplaceAddsalary([])
        const response = await axios.get(`http://10.10.110.7:3000/workplace/${searchWorkplaceId}`);
        setWorkplaceData(response.data); // เพิ่มบรรทัดนี้เพื่อให้ workplaceData มีข้อมูลจาก API
        workplaceAddSalaryData = response.data.addSalary || [];
        // เก็บไว้ก่อน จะรวมกับข้อมูลพนักงานทีหลัง
        // await alert(response.data.addSalary.length);
         if (year && month && searchWorkplaceId) {
        await fetchWeekendData(year, month, searchWorkplaceId);
      }

        // Do something with the data, e.g., set state
      } catch (error) {
        console.error('Error fetching workplace:', error);
      }

      const dataSearch = {
        year: year, 
        month: month, 
        workplaceId: searchWorkplaceId
      }

      axios
        .post(endpoint + "/accounting/searchtimerecordbyworkplace", dataSearch )
        .then((response) => {
          const groupedResult = response.data.groupedResult;
      // รวมข้อมูลทั้งหมดจากทุก workplace ให้กลายเป็น array เดียว
      const allRecords = Object.values(groupedResult).flat();

      // จัดเรียงตาม employeeId
      const sortedData = allRecords.sort((a, b) =>
        a.employeeId.localeCompare(b.employeeId)
      );

      // 🆕 รวมสวัสดิการจากหน่วยงานและพนักงาน
      const mergedAddSalary = mergeWorkplaceAndEmployeeAddSalary(workplaceAddSalaryData, sortedData);
      setWorkplaceAddsalary(mergedAddSalary);
      console.log('✅ Set merged workplaceAddsalary:', mergedAddSalary);

      // setResponseDataAll(sortedData);
      setData(sortedData);

      // alert("✅ Sorted Records:"+ JSON.stringify(sortedData) );
if(sortedData.length > 0) {
  setLoading(false);
}


        })
        .catch((error) => {
          console.error("Error:", error);
        })
        
    };

    // Call fetchData when year or month changes
    if(year !== '' &&  month !== '' &&  searchWorkplaceId !== '') {
      fetchData();
    }
  }, [year, month, searchWorkplaceId]);

  // Debug logging สำหรับ state changes (ตำแหน่งสุดท้าย หลังประกาศ state ทั้งหมด)
  useEffect(() => {
    console.log('🔍 Debug State Changes:');
    console.log('- data:', data);
    console.log('- data type:', typeof data);
    console.log('- data isArray:', Array.isArray(data));
    console.log('- data length:', Array.isArray(data) ? data.length : 'N/A');
    console.log('- loading:', loading);
    console.log('- employeePrefixes:', Object.keys(employeePrefixes).length, 'items');
    console.log('- workplaceAddsalary:', workplaceAddsalary?.length || 0, 'items');
  }, [data, loading, employeePrefixes, workplaceAddsalary]);

  // useEffect สำหรับจัดการ page loading
  useEffect(() => {
    // ตรวจสอบว่าข้อมูลพื้นฐานโหลดเสร็จแล้วหรือไม่
    const checkInitialDataReady = () => {
      // ตรวจสอบว่ามี workplaceListAll หรือไม่ (แค่นี้พอ ไม่ต้องรอ employeeList)
      if (workplaceListAll && workplaceListAll.length > 0) {
        setInitialDataLoaded(true);
        setPageLoading(false);
      } else {
        // ถ้ายังไม่มีข้อมูล ให้รอ
        setPageLoading(true);
      }
    };

    // เรียกใช้ timeout เพื่อให้เวลาข้อมูลโหลด (ลดเวลาเหลือ 500ms)
    const timer = setTimeout(checkInitialDataReady, 500);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, [workplaceListAll]); // เปลี่ยนจาก employeeList เป็น workplaceListAll

  // useEffect สำหรับตรวจสอบเมื่อ loading เปลี่ยน
  useEffect(() => {
    if (loading) {
      setPageLoading(true);
    } else if (initialDataLoaded) {
      setPageLoading(false);
    }
  }, [loading, initialDataLoaded]);


  const [searchLoading, setSearchLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    
    // ป้องกันการค้นหาซ้ำ
    if (searchLoading) {
      return;
    }

    // ตรวจสอบข้อมูลก่อนทำอะไร
    if (searchWorkplaceId === "" && searchWorkplaceName === "") {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลค้นหา',
        text: 'กรุณากรอกรหัสหรือชื่อพนักงาน',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f0ad4e'
      });
      return; // หยุดการทำงานทันที
    }

    setSearchLoading(true); // เริ่มต้น loading
    setPageLoading(true); // เพิ่ม page loading

    try {
      if (year && month && searchWorkplaceId) {
        await fetchWeekendData(year, month, searchWorkplaceId);
      }

      const dataSearch = {
        year: year, 
        month: month, 
        workplaceId: searchWorkplaceId
      }

      // 🆕 ดึงข้อมูล workplace addSalary ก่อน
      let workplaceAddSalaryData = [];
      try {
        const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${searchWorkplaceId}`);
        workplaceAddSalaryData = workplaceResponse.data.addSalary || [];
      } catch (error) {
        console.error('Error fetching workplace addSalary:', error);
      }

      // ดึงข้อมูลพนักงาน
      const response = await axios.post(endpoint + "/accounting/searchtimerecordemployee", dataSearch);
      const groupedResult = response.data.groupedResult;
      // รวมข้อมูลทั้งหมดจากทุก workplace ให้กลายเป็น array เดียว
      const allRecords = Object.values(groupedResult).flat();

      // จัดเรียงตาม employeeId
      const sortedData = allRecords.sort((a, b) =>
        a.employeeId.localeCompare(b.employeeId)
      );

      // 🆕 รวมสวัสดิการจากหน่วยงานและพนักงาน
      const mergedAddSalary = mergeWorkplaceAndEmployeeAddSalary(workplaceAddSalaryData, sortedData);
      setWorkplaceAddsalary(mergedAddSalary);

      setData(sortedData);

      if(sortedData.length > 0) {
        setLoading(false);
        setShowTable(true); // แสดงตารางเมื่อมีข้อมูล
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถค้นหาข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      setShowTable(false); // ซ่อนตารางเมื่อเกิดข้อผิดพลาด
      return; // หยุดการทำงานหากเกิดข้อผิดพลาด
    } finally {
      setSearchLoading(false); // ปิด loading เสมอ
      setPageLoading(false); // ปิด page loading เสมอ
    }
    const data = await {
      // workplaceId: searchWorkplaceId,
      // workplaceName: searchWorkplaceName,
      month: month,
      "employee_workplaceRecord.workplaceId": searchWorkplaceId,
      // 'employee_workplaceRecord.workplaceName': searchWorkplaceName,
    };

    const parsedNumber = (await parseInt(month, 10)) - 1;
    const formattedResult = await String(parsedNumber).padStart(2, "0");
    // await alert(formattedResult );

    const data1 = await {
      workplaceId: searchWorkplaceId,
      workplaceName: searchWorkplaceName,
      month: formattedResult,
    };

    // date day

    // Calculate the formatted month based on data1.month
    const parsedNumber1 = parseInt(data1.month, 10) - 1;
    const formattedResult1 = String(parsedNumber1).padStart(2, "0");

    // Calculate the formatted month based on data.month
    const parsedNumber2 = parseInt(data.month, 10) - 1;
    const formattedResult2 = String(parsedNumber2).padStart(2, "0");

    // Create a Date object for the first day of data1.month
    const firstDayOfMonth1 = new Date(yeartest, parsedNumber1, 1);

    // Create a Date object for the first day of data.month
    const firstDayOfMonth2 = new Date(yeartest, parsedNumber2, 1);
    // เพิ่มฟังก์ชันสำหรับเรียก API วันหยุด


    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dates1 = [];
    const dates2 = [];

    // Loop through the days of the week
    for (let i = 0; i < 7; i++) {
      const day = daysOfWeek[i];
      const dayDates1 = [];
      const dayDates2 = [];

      // Start from the first day of data1.month
      let currentDate1 = new Date(firstDayOfMonth1);
      let currentDate2 = new Date(firstDayOfMonth2);

      // Find the first day of the week
      while (currentDate1.getDay() !== i) {
        currentDate1.setDate(currentDate1.getDate() + 1);
      }
      while (currentDate2.getDay() !== i) {
        currentDate2.setDate(currentDate2.getDate() + 1);
      }

      // Continue adding dates while still in the same month for data1.month
      while (currentDate1.getMonth() === parsedNumber1) {
        dayDates1.push(currentDate1.getDate());
        currentDate1.setDate(currentDate1.getDate() + 7); // Move to the next occurrence of the day
      }

      // Continue adding dates while still in the same month for data.month
      while (currentDate2.getMonth() === parsedNumber2) {
        dayDates2.push(currentDate2.getDate());
        currentDate2.setDate(currentDate2.getDate() + 7); // Move to the next occurrence of the day
      }

      dates1.push({ day, dates: dayDates1 });
      dates2.push({ day, dates: dayDates2 });
    }

    const filteredDates1 = dates1
      .map((dayData) => ({
        ...dayData,
        dates: dayData.dates.filter((date) => date >= 21 && date <= 31), // Adjusted filtering condition
      }))
      .filter((dayData) => dayData.dates.length > 0);

    const filteredDates2 = dates2
      .map((dayData) => ({
        ...dayData,
        dates: dayData.dates.filter((date) => date < 20), // Adjusted filtering condition
      }))
      .filter((dayData) => dayData.dates.length > 0);

    //dddd
    setCalendarData1(filteredDates1); // Assuming you have a separate state for data1.month
    setCalendarData2(filteredDates2);

    //check reload pag

    let check = 0;
    try {
      const response = await axios.post(
        endpoint + "/timerecord/searchemp",
        data
      );

      if (response.data.recordworkplace.length >= 1) {
        await setSearchResult(response.data.recordworkplace);
        await setResult_data(response.data.recordworkplace);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'ไม่พบข้อมูล',
          text: `ไม่พบข้อมูล 1 ถึง 20 ${getMonthName(data.month)}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#17a2b8'
        });
        check = check + 1;
        // window.location.reload();
      }

      const employeeWorkplaceRecords =
        (await response.data.recordworkplace[0].employee_workplaceRecord) || "";

      if (employeeWorkplaceRecords.length > 0) {
        const dates = employeeWorkplaceRecords.map((record) => record.date);
        // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

        const allTimeA = employeeWorkplaceRecords.map(
          (record) => record.allTime
        );

        const workplaceId = employeeWorkplaceRecords.map(
          (record) => record.workplaceId
        );

        const otTime = employeeWorkplaceRecords.map((record) => record.otTime);

        setTableData((prevState) => {
          const updatedData = [...prevState];
          dates.forEach((date, index) => {
            const dataIndex = parseInt(date, 10) - 1; // Subtract 1 because indices are zero-based
            // alert(index);
            if (dataIndex >= 0 && dataIndex < updatedData.length) {
              if (dataIndex <= 20) {
                // setCountWork((countWork + 1));
                // alert((dataIndex + 11));

                updatedData[dataIndex + 11].isChecked = true;
                updatedData[dataIndex + 11].otTime = otTime[index];
                updatedData[dataIndex + 11].allTime = allTimeA[index];
                updatedData[dataIndex + 11].workplaceId = workplaceId[index]; // Set otTime at the same index as dates
                updatedData[dataIndex + 11].date = dates[index]; // Set otTime at the same index as dates

                // Set otTime at the same index as dates
              }
            }
          });
          const filteredData = updatedData.filter(
            (record) => record.isChecked == true
          );

          const workplaceIds = [
            ...new Set(filteredData.map((record) => record.workplaceId)),
          ];

          setDataset(filteredData);
          return updatedData;
        });
      }
      if (response.data.recordworkplace.length < 1) {
        // window.location.reload();
        Swal.fire({
          icon: 'info',
          title: 'ไม่พบข้อมูล',
          text: 'ไม่พบข้อมูลที่ค้นหา',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#17a2b8'
        });
        // window.location.reload();
      } else {
        // Set search values
        await setEmployeeId(response.data.recordworkplace[0].employeeId);
        await setName(response.data.recordworkplace[0].employeeName);

        setSearchWorkplaceId("");
        setSearchWorkplaceName("");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาตรวจสอบข้อมูลในช่องค้นหา',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      console.error('Search error:', error);
      setSearchLoading(false); // ปิด loading เมื่อเกิดข้อผิดพลาด - try catch 1
      // window.location.reload();
    }

    try {
      if (data1.month == "00") {
        data1.month = "12";
      }
      const response1 = await axios.post(
        endpoint + "/timerecord/searchemp",
        data1
      );
      if (response1.data.recordworkplace.length >= 1) {
        await setSearchResult1(response1.data.recordworkplace);
        // if (!result_data) {
        await setResult_data(response1.data.recordworkplace);
        // }
      } else {
        Swal.fire({
          icon: 'info',
          title: 'ไม่พบข้อมูล',
          text: `ไม่พบข้อมูล 21 ถึง สิ้นเดือน ${getMonthName(data1.month)}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#17a2b8'
        });
        check = check + 1;
        if (check > 1) {
          // alert('reload');
          // window.location.reload();
        }
      }

      const employeeWorkplaceRecords1 =
        (await response1.data.recordworkplace[0].employee_workplaceRecord) ||
        "";

      if (employeeWorkplaceRecords1.length > 0) {
        const dates1 = await employeeWorkplaceRecords1.map(
          (record) => record.date
        );
        // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

        const allTimeA1 = await employeeWorkplaceRecords1.map(
          (record) => record.allTime
        );

        const workplaceId1 = await employeeWorkplaceRecords1.map(
          (record) => record.workplaceId
        );

        const otTime1 = await employeeWorkplaceRecords1.map(
          (record) => record.otTime
        );

        await setTableData((prevState) => {
          const updatedData = [...prevState];
          dates1.forEach((date1, index) => {
            const dataIndex1 = parseInt(date1, 10) - 1; // Subtract 1 because indices are zero-based
            // if (dataIndex1 >= 0 && dataIndex1 < updatedData.length) {
            // alert(index);
            if (dataIndex1 >= 20 && dataIndex1 <= 31) {
              // alert(dataIndex1 +' .');
              // setCountWork((countWork + 1));
              // alert((dataIndex1 - 20));

              updatedData[dataIndex1 - 20].isChecked = true;
              updatedData[dataIndex1 - 20].otTime = otTime1[index];
              updatedData[dataIndex1 - 20].allTime = allTimeA1[index];
              updatedData[dataIndex1 - 20].workplaceId = workplaceId1[index]; // Set otTime at the same index as dates
              updatedData[dataIndex1 - 20].date = dates1[index]; // Set otTime at the same index as dates
              // updatedData[(dataIndex1 - 20)].month = month[index]; // Set otTime at the same index as dates

              // Set otTime at the same index as dates
            }

            // }
          });

          const filteredData = updatedData.filter(
            (record) => record.isChecked == true
          );
          const workplaceIds = [
            ...new Set(filteredData.map((record) => record.workplaceId)),
          ];
          setDataset(filteredData);
          return updatedData;
        });
        // setWoekplace(dates);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาตรวจสอบข้อมูลในช่องค้นหา',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      console.error('Search error:', error);
      setSearchLoading(false); // ปิด loading เมื่อเกิดข้อผิดพลาด - try catch 2
      // window.location.reload();
    }
    
    // ปิด loading state เมื่อเสร็จสิ้น
    setSearchLoading(false);
    //xx
    // alert(result_data[0].employeeId);
  }

  const [Datasetsec, setDatasetsec] = useState([]);

  useEffect(() => {
    // Create a mapping of date to dayoff from listTableDayoff
    const dayoffMap = listTableDayoff.reduce((acc, day) => {
      const date = Object.keys(day)[0];
      const dayoff = day[date].trim(); // Remove extra spaces
      if (dayoff !== "") {
        acc[date] = dayoff;
      }
      return acc;
    }, {});

    // Update the Dataset with the dayoff property for matching dates
    const updatedDataset = dataset.map((item) => ({
      ...item,
      dayoff: dayoffMap[item.date] || "", // Add 'dayoff' property if the date exists in the map

      // test set time ot
    }));
    const workplaceIdCounts = {};
    const workplaceIdAllTimes = {};
    const workplaceIdOtTimes = {};

    const workplaceIdDayoffAllTimes = {};
    const workplaceIdDayoffOtTimes = {};

    updatedDataset.forEach((record) => {
      if (record.isChecked) {
        const { workplaceId, otTime, allTime, dayoff } = record;
        const allTimeAsNumber = parseFloat(allTime); // Parse allTime to a number
        const otTimeAsNumber = parseFloat(otTime); // Parse otTime to a number

        if (!workplaceIdCounts[workplaceId]) {
          workplaceIdCounts[workplaceId] = 0;
          workplaceIdAllTimes[workplaceId] = 0;
          workplaceIdOtTimes[workplaceId] = 0;
          workplaceIdDayoffAllTimes[workplaceId] = 0;
          workplaceIdDayoffOtTimes[workplaceId] = 0;
        }

        workplaceIdCounts[workplaceId]++;

        if (dayoff === "หยุด" && !isNaN(allTimeAsNumber)) {
          workplaceIdDayoffAllTimes[workplaceId] += allTimeAsNumber;
          workplaceIdDayoffOtTimes[workplaceId] += otTimeAsNumber;
        } else {
          if (!isNaN(allTimeAsNumber)) {
            if (allTimeAsNumber > 5.0) {
              workplaceIdAllTimes[workplaceId] += 1;
            } else {
              workplaceIdAllTimes[workplaceId] += 0.5;
            }
          }
          if (!isNaN(otTimeAsNumber)) {
            workplaceIdOtTimes[workplaceId] += otTimeAsNumber;
          }
        }
      }
    });
    const result = Object.entries(workplaceIdCounts).map(
      ([workplaceId, count]) => ({
        workplaceId,
        count,
        allTime: workplaceIdAllTimes[workplaceId].toFixed(1),
        otTime: workplaceIdOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
        dayoffAllTime: workplaceIdDayoffAllTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
        dayoffOtTime: workplaceIdDayoffOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
      })
    );

    // Calculate the total allTime
    const totalAllTime = Object.values(workplaceIdAllTimes)
      .reduce((sum, allTime) => sum + allTime, 0)
      .toFixed(1);

    const count = dataset.length;

    // Create a mapping of date to dayoff from listTableDayoff

    setCountWork(count);
    setCountWorkSTime(totalAllTime);
    setWorkplaceIdList(result);

    setDatasetsec(updatedDataset);
  }, [dataset, listTableDayoff]);

  useEffect(() => {
    if (searchWorkplaceId !== "") {
      const workplacesearch = workplaceList.find(
        (workplace) => workplace.workplaceId === searchWorkplaceId
      );
      if (workplacesearch) {
        setSearchWorkplaceName(workplacesearch.workplaceName);
      } else {
        setSearchWorkplaceName("");
      }
    }
  }, [searchWorkplaceId]);

  //set salaty calculate
  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [holiday, setHoliday] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์
  const [holidayHour, setHolidayHour] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง
  const [addSalary, setAddSalary] = useState([]); //เงิ่นเพิ่มพิเศษ

  const [workplaceIdListSearch, setWorkplaceIdListSearch] = useState([]); //หน่วยงานที่ค้นหาและทำงาน
  const [calculatedValues, setCalculatedValues] = useState([]);

  // get employee data
  const [MinusSearch, setMinusSearch] = useState(0); // Example: February (you can set it dynamically)
  const [EmpData, setEmpData] = useState([]); // Example: February (you can set it dynamically)
  // const [EmpDataWorkplace, setEmpDataWorkplace] = useState([]); // Example: February (you can set it dynamically)

  const [tableData, setTableData] = useState(
    combinedRange.map((index) => ({
      isChecked: false, // Initial state of the checkbox
      textValue: "", // Initial state of the text value
      workplaceId: index, // Store the workplaceId
      date: "", // Store the workplaceId
    }))
  );
  const handleCheckboxChange = (index) => {
    setTableData((prevState) => {
      const updatedData = [...prevState];
      updatedData[index].isChecked = !updatedData[index].isChecked;
      return updatedData;
    });
  };

  const handleTextChange = (index, event) => {
    const { value } = event.target;
    setTableData((prevState) => {
      const updatedData = [...prevState];
      updatedData[index].textValue = value;
      return updatedData;
    });
  };
  // เพิ่มฟังก์ชันสำหรับกำหนดสีตามประเภทวัน

// ...existing code...

const getDateStyle = (day) => {
  // ตรวจสอบว่ามี year และ month หรือไม่
  if (!year || !month) {
    console.log('No year or month:', { year, month });
    return {};
  }
  
  console.log('weekendData:', weekendData); // Debug log
  
  // แปลง day เป็น number และใส่ leading zero
  const dayNum = parseInt(day);
  let targetMonth = parseInt(month);
  let targetYear = parseInt(year);
  
  // ถ้าวันที่ 21-31 ให้เป็นเดือนก่อนหน้า
  if (dayNum >= 21) {
    targetMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    if (targetMonth === 12) {
      targetYear = targetYear - 1;
    }
  }
  
  // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
  const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
  const isInvalidDate = dayNum > daysInTargetMonth;
  
  if (isInvalidDate) {
    // วันที่ไม่มีอยู่จริง - สีเทา
    return { backgroundColor: "#9e9e9e", color: '#000' };
  }
  
  // สร้างวันที่ในรูปแบบ YYYY-MM-DD
  const formattedMonth = targetMonth.toString().padStart(2, '0');
  const formattedDay = dayNum.toString().padStart(2, '0');
  const dateString = `${targetYear}-${formattedMonth}-${formattedDay}`;
  
  console.log('Checking date:', dateString, 'for day:', day); // Debug log
  
  const weekendInfo = weekendData.find(item => item.date === dateString);
  
  if (weekendInfo) {
    console.log('Found weekend info:', weekendInfo); // Debug log
    
    switch (weekendInfo.type) {
      case 'weekend':
        // สร้าง Date object เพื่อตรวจสอบวันในสัปดาห์
        const date = new Date(targetYear, targetMonth - 1, dayNum);
        const dayOfWeek = date.getDay(); // 0 = อาทิตย์, 6 = เสาร์
        
        if (dayOfWeek === 6) {
          // วันเสาร์ - สีฟ้า
          return { backgroundColor: 'rgb(79 ,173,234)', color: '#000' }; 
        } else if (dayOfWeek === 0) {
          // วันอาทิตย์ - สีแดง
          return { backgroundColor: 'rgb(234, 51, 35)', color: '#000' }; 
        } else {
          // วันหยุดอื่นๆ - สีแดง
          return { backgroundColor: '#ffcccc', color: '#000' }; 
        }
      case 'dayOff':
        console.log('Applying dayOff style to:', dateString);
        return { backgroundColor: 'rgb(255, 255, 84)', color: '#000' }; 
      case 'dayOffOnly':
        // วันหยุดนักขัตฤกษ์ - สีเหลืองทอง (แตกต่างจาก dayOff)
        console.log('Applying dayOffOnly style to:', dateString);
        return { backgroundColor: 'rgb(255, 255, 84)', color: '#000', fontWeight: 'bold', border: '2px solid #FF8C00' }; 
      case 'weekendAndDayOff':
        // 
        return { 
          backgroundColor: 'rgb(79 ,173,234)', 
          color: '' 
        }; 
      default:
        return {};
    }
  }
  
  return {}; // ไม่มีสี
};

// ...existing code...

  ///PDF///////////////////////
  // const [dataset, setDataset] = useState([]);
  const [monthset, setMonthset] = useState(""); // Example: February (you can set it dynamically)

  const [MinusSS, setMinusSS] = useState(0); // Example: February (you can set it dynamically)

  const [result, setResult] = useState(""); // Example: February (you can set it dynamically)

  // const [calendarData, setCalendarData] = useState([]);

  const [workMonth, setWorkMonth] = useState([]);

  const generateText = () => {
    return searchResult
      .map(
        (employeerecord) =>
          "ประจำเดือน " +
          getMonthName(employeerecord.month) +
          " ตั้งแต่วันที่ 21 " +
          getMonthName(parseInt(employeerecord.month, 10) - 1) +
          " ถึง 20 " +
          getMonthName(employeerecord.month) +
          " " +
          (parseInt(employeerecord.timerecordId, 10) + 543)
      )
      .join(" "); // Join the generated text into a single string
  };

  // Call generateText when the component mounts or when searchResult changes
  useEffect(() => {
    const text = generateText();
    setWorkMonth(text);
  }, [searchResult]);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF("landscape");

      // Load the Thai font
      const fontPath = "/assets/fonts/THSarabunNew.ttf";
      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };
      const tableOptions = {
        styles: stylestable,
        startY: 25,
        // margin: { top: 10 },
      };

      const title = " ใบลงเวลาการปฏิบัติงาน";

      // Set title with the Thai font
      doc.setFont("THSarabunNew");
      doc.setFontSize(16);
      const titleWidth =
        (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);

      const subTitle = workMonth; // Replace with your desired subtitle text
      doc.setFontSize(12); // You can adjust the font size for the subtitle
      const subTitleWidth =
        (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const subTitleX = (pageWidth - subTitleWidth) / 2;
      doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Calculate the number of days in the month, considering February and leap years
      const daysInMonth =
        monthset === "02" &&
          ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
          ? 29
          : monthset === "02"
            ? 28
            : [4, 6, 9, 11].includes(monthset)
              ? 30
              : 31;

      // Calculate the starting point for the table header
      let startingDay = 21;

      // Generate the header with a single cycle of "01" to "20" followed by "21" to the last day of the month
      const header = Array.from({ length: daysInMonth }, (_, index) => {
        const day =
          index + startingDay > daysInMonth
            ? index + startingDay - daysInMonth
            : index + startingDay;

        // Add leading zeros for days 1 to 9
        const formattedDay = day < 10 ? `0${day}` : day.toString();

        return formattedDay;
      });

      // Assuming that 'date' contains values like '01', '02', ..., '28', '29', '30', '31'
      // You can replace 'date' with the actual field name containing the date information in your data
      const dateOt = ["25", "09", "10"];

      const dateFieldName = "date";

      // Create an object to store data rows by date
      const rowDataByDate = {};

      // Organize the dataset into the rowDataByDate object
      Datasetsec.forEach((data) => {
        // dataset.forEach((data) => {

        const date = data[dateFieldName];
        if (!rowDataByDate[date]) {
          rowDataByDate[date] = {
            workplaceId: [],
            otTime: [],
            dateFieldName: [],
            allTime: [],
          };
        }
        rowDataByDate[date].workplaceId.push(data.workplaceId);
        rowDataByDate[date].otTime.push(data.otTime);
        rowDataByDate[date].allTime.push(data.allTime);
        rowDataByDate[date].dateFieldName.push(data[dateFieldName]);
      });

      // Map the header to transposedTableData using the rowDataByDate object
      const transposedTableData = header.map((headerDay) => {
        const rowData = rowDataByDate[headerDay];

        if (rowData) {
          return [
            rowData.workplaceId.join(", "),
            rowData.allTime.join(", "),
            rowData.otTime.join(", "),
            // rowData.dateFieldName.join(', '),
          ];
        } else {
          return ["", "", ""];
        }
      });

      // Transpose the transposedTableData to sort horizontally
      const sortedTableData = Array.from({ length: 3 }, (_, index) =>
        transposedTableData.map((row) => row[index])
      );

      const textColumn = [name, "เวลา ทำงาน", "เวลา OT"];

      const sortedTableDataWithText = sortedTableData.map((data, index) => {
        const text = [textColumn[index]];
        return [...text, ...data];
      });

      // Now, sortedTableDataWithText contains the text column followed by sorted data columns.

      const customHeaders = [["วันที่", ...header]];

      // Add custom headers and data to the table
      // doc.autoTable({
      //   head: customHeaders,
      //   body: sortedTableDataWithText,
      //   ...tableOptions,
      // });
      // Create a function to check if the cell should have a background color
      function shouldHighlightCell(text) {
        return dateOt.includes(text);
      }

      doc.autoTable({
        head: customHeaders,
        body: sortedTableDataWithText,
        ...tableOptions,
        didDrawCell: function (data) {
          if (
            data.cell.section === "head" &&
            shouldHighlightCell(data.cell.raw)
          ) {
            // Set the background color for header cells with the location number found in dateOt
            doc.setFillColor(255, 255, 0); // Yellow background color
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              "F"
            );
          }
        },
      });

      const additionalTableData = [
        ["เงินค่าจ้าง", "", "", "", "", "", "55"],
        ["Cell 4", "Cell 5", "Cell 6"],
        ["Cell 7", "Cell 8", "Cell 9"],
      ];

      const calculatedValuesAllTime = calculatedValues.map(
        (value) =>
          `${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      );

      // Combine the calculated values into a single array
      const combinedCalculatedValues = [
        "รวมวันทำงาน:",
        ...calculatedValuesAllTime,
      ];

      const calculatedValuesOt = calculatedValues.map((value) => [
        `${value.calculatedOT} (${value.otTime})`,
      ]);

      const combinedCalculatedValuesOt = [
        "รวมวันทำงาน OT:",
        ...calculatedValuesOt,
      ];

      const combinedTableData = [
        ...additionalTableData,
        combinedCalculatedValues,
        combinedCalculatedValuesOt,
      ];
      // Combine the calculated values into a single array
      // const combinedCalculatedValues = calculatedValuesAllTime.map((value, index) => [value, calculatedValuesOt[index]]);

      // const combinedTableData = [...additionalTableData, ...combinedCalculatedValues, ...calculatedValuesOt];

      const firstColumnWidth = 30; // Adjust the width as needed

      // Define column styles, including the width of the first column
      const columnStyles = {
        0: { columnWidth: firstColumnWidth }, // Index 0 corresponds to the first column
      };

      // Define options for the additional table
      const additionalTableOptions = {
        startY: 80, // Adjust the vertical position as needed
        margin: { top: 10 },
        columnStyles: columnStyles, // Assign the column stylestable here
        styles: stylestable,
      };

      // Add the additional table to the PDF
      // doc.autoTable({
      //   body: combinedTableData,
      //   ...additionalTableOptions,
      // });

      // Define the text to add background color to
      const textWithBackgroundColor = ["รวมวันทำงาน:", "รวมวันทำงาน OT:"];

      // Add the additional table to the PDF
      doc.autoTable({
        body: combinedTableData,
        ...additionalTableOptions,
        didDrawCell: function (data) {
          if (data.cell.section === "body") {
            // Check if the cell contains text that should have a background color
            const text = data.cell.raw;
            if (textWithBackgroundColor.includes(text)) {
              // Set the background color
              doc.setFillColor(255, 255, 0); // Yellow background color
              doc.rect(
                data.cell.x,
                data.cell.y,
                data.cell.width,
                data.cell.height,
                "F"
              );

              // Reset text color for better visibility
              doc.setTextColor(0, 0, 0);
            }
          }
        },
      });
      const titletest = "รวมวันทำงาน:";
      const titletest2 = "รวมวันทำงาน OT:";

      // Set title with the Thai font
      doc.setFont("THSarabunNew");
      doc.setFontSize(14);
      doc.text(titletest, 15, 108);
      doc.text(titletest2, 15, 115);

      // doc.save('example.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // const tableRef = useRef(null);

  const tableRef = useRef(null);

  const CheckMonth = parseInt(month, 10);
  const CheckYear = year;
  // const CheckMonth = 5;
  // const CheckYear = 2023;

  let countdownMonth;
  if (CheckMonth === 1) {
    countdownMonth = 12;
  } else {
    countdownMonth = CheckMonth - 1;
  }
  function getDaysInMonth(month, year) {
    // Months are 0-based, so we subtract 1 from the provided month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    return lastDayOfMonth;
  }

  const daysInMonth = getDaysInMonth(countdownMonth, CheckYear);
  const startDay = 21;
  // Create an array from startDay to daysInMonth
  const firstPart = Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, index) => startDay + index
  );

  // Create an array from 1 to 20
  const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

  // Concatenate the two arrays
  const resultArray = [...firstPart, ...secondPart];

  function getDaysInMonth2(month, year) {
    // Months are 0-based, so we subtract 1 from the provided month
    return new Date(year, month, 0).getDate();
  }
  // Function to create an array of days for a given month and year
  function createDaysArray(month, year, endDay, filter) {
    const daysArray = {};

    for (let day = 1; day <= endDay; day++) {
      const date = new Date(year, month - 1, day);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!daysArray[weekday]) {
        daysArray[weekday] = [];
      }

      if (filter(day)) {
        daysArray[weekday].push(day);
      }
    }

    return daysArray;
  }

  const daysInMonth2 = getDaysInMonth(CheckMonth, CheckYear);
  const daysInCountdownMonth = getDaysInMonth2(countdownMonth, CheckYear);

  // const array1 = createDaysArray(CheckMonth, CheckYear, daysInMonth2, (day) => day <= 20);
  // const array2 = createDaysArray(countdownMonth, CheckYear, daysInCountdownMonth, (day) => day > 21);
  const array1 = createDaysArray(
    CheckMonth,
    CheckYear,
    daysInMonth2,
    (day) => day <= 20
  );
  const array2 = createDaysArray(
    countdownMonth,
    CheckYear,
    daysInCountdownMonth,
    (day) => day >= 21
  );

  // เริ่มระบุวันที่
  const desiredWorkplaceId = searchWorkplaceId;
  const desiredTimerecordId = year;
  const desiredMonth = month;

  // const desiredTimerecordId = 2023;
  // const desiredMonth = 3;
  const desiredTimerecordIdDaysOff = parseInt(year, 10);

  const desiredMonthDaysOff = parseInt(month, 10);

  useEffect(() => {
    // Filter data based on searchWorkplaceId and set it to workplaceDataList
    const filteredData = workplaceList.filter(
      (item) => item.workplaceId === searchWorkplaceId
    );
    setWorkplaceDataList(filteredData);

    if (filteredData.length > 0) {
      setWorkRateWorkplace(filteredData[0].workRate);
      setWorkRateWorkplaceStage1(filteredData[0].workRateOT);
      setWorkRateWorkplaceStage2(filteredData[0].holiday);
      setWorkRateWorkplaceStage3(filteredData[0].holidayOT);
    }

    // Filter workplaceDataList to find items with dayOff
    // const dayOffData = filteredData.filter(item => item.daysOff); // Assuming 'dayOff' is a property in the items

    // const filteredDataAddSalary = workplaceDataList.filter(item => item.workplaceId === searchWorkplaceId);
    // setWorkplaceDataListAddSalary(filteredDataAddSalary);

    const workTime = filteredData.map((item) => item.workOfHour);
    setWorkplaceDataWorkTime;

    // const addSalaryArray = filteredData.map(item => item.addSalary).flat();
    const addSalaryArray = filteredData
      .map((item) =>
        item.addSalary.filter(
          (salary) => salary.SpSalary !== "" && salary.SpSalary !== null
        )
      )
      .flat();

    setWorkplaceDataListAddSalary(addSalaryArray);

    const addSalaryArrayWorkOfHour = filteredData.map(
      (item) => item.workOfHour
    );
    setWorkplaceDataWorkOfHour(addSalaryArrayWorkOfHour);

    const addSalaryArrayWorkRate = filteredData.map((item) => item.workRate);
    setWorkplaceDataListWorkRate(addSalaryArrayWorkRate);

    // Filter workplaceDataList to find items with dayOff
    const dayOffData = filteredData.reduce((acc, item) => {
      if (item.daysOff && Array.isArray(item.daysOff)) {
        acc.push(...item.daysOff);
      }
      return acc;
    }, []);
    // วันหยุดนัก
    setWorkplaceDataListDayOff(dayOffData);
  }, [searchWorkplaceId, workplaceList]);

  const addSalaryWorkplace = workplaceDataListAddSalary;

  // workplaceDataListAddSalary
  // วันหยุดนักขัต
  const filteredDaysOff = workplaceDataListDayOff
    .filter((item) => {
      const date = new Date(item);
      return (
        date.getFullYear() === desiredTimerecordIdDaysOff &&
        date.getMonth() + 1 === desiredMonthDaysOff
      );
    })
    .map((item) => {
      const date = new Date(item);
      return date.getDate(); // Extract day part of the date
    });

  const filteredDaysOff_lower21 = filteredDaysOff.filter((day) => day < 21);

  const filteredDaysOff2 = workplaceDataListDayOff
    .filter((item) => {
      const date = new Date(item);
      if (desiredMonthDaysOff === 1) {
        // If desired month is January
        return (
          date.getFullYear() === desiredTimerecordIdDaysOff - 1 && // Previous year
          date.getMonth() + 1 === 12 // December
        );
      } else {
        return (
          date.getFullYear() === desiredTimerecordIdDaysOff && // Previous year
          date.getMonth() + 1 === desiredMonthDaysOff - 1 // December
        );
      }
    })
    .map((item) => {
      const date = new Date(item);
      return date.getDate(); // Extract day part of the date
    });

  const filteredDaysOff2_upper20 = filteredDaysOff2.filter((day) => day > 20);

  const allDayOff = [...filteredDaysOff2_upper20, ...filteredDaysOff_lower21];

  const holidayList = [];
  const falseWorkdays = [];

  const workplace = workplaceList.find(
    (workplace) => workplace.workplaceId === searchWorkplaceId
  );

  // const monthTest = "09"; // Assuming "09" represents September
  const commonNumbers123 = new Set();

  if (workplace && year) {
    const matchingDays = workplace.daysOff.filter((date) => {
      const dateObj = new Date(date);
      return (dateObj.getMonth() + 1).toString().padStart(2, "0") === month; // +1 because getMonth() returns zero-based month index
    });

    // Iterate over matchingDays and add day numbers to commonNumbers set

    matchingDays.forEach((date) => {
      const dateObj = new Date(date);
      const day = dateObj.getDate(); // Get the day number (1-31)
      commonNumbers123.add(day); // Add day number to the set
    });
  } else {
    console.error("Workplace not found");
  }

  const commonNumbers = new Set();

  if (workplace && year) {
    const stopWorkTimeDay = workplace.workTimeDay.find(
      (day) => day.workOrStop == "stop"
    );

    if (stopWorkTimeDay) {
      const { startDay, endDay } = stopWorkTimeDay;

      const daysInBetween = getDaysInBetween(startDay, endDay);

      daysInBetween.forEach((day) => {
        const englishDayArray = thaiToEnglishDayMap[day];

        englishDayArray.forEach((englishDay) => {
          // Use forEach to add each element to commonNumbers
          // commonNumbers.add(...array1[englishDayArray]);
          array1[englishDay].forEach((value) => commonNumbers.add(value));
          array2[englishDay].forEach((value) => commonNumbers.add(value));
        });
        // englishDayArray.forEach(englishDay => {
        //     // Check if the key exists in array1 before attempting to access it
        //     if (array1.hasOwnProperty(englishDay)) {
        //         // Access the array and perform operations if the key exists
        //         array1[englishDay].forEach(value => commonNumbers.add(value));
        //     } else {
        //     }
        // });
      });
    } else {
      console.log("No stop workTimeDay found.");
    }
  } else {
    console.log("Workplace not found.");
  }

  commonNumbers123.forEach((number) => {
    commonNumbers.add(number);
  });

  commonNumbers.forEach((number) => {
    holidayList.push(number);
  });

  // Adding elements from commonNumbers123 array to falseWorkdays
  commonNumbers.forEach((number) => {
    falseWorkdays.push(number);
  });

  const commonNumbersArray = [...commonNumbers].map((value) =>
    value.toString()
  );

  function getDaysInBetween(startDay, endDay) {
    const weekdays = [
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัส",
      "ศุกร์",
      "เสาร์",
      "อาทิตย์",
    ];
    const startIndex = weekdays.indexOf(startDay);
    const endIndex = weekdays.indexOf(endDay);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    return weekdays.slice(startIndex, endIndex + 1);
  }

  // const desiredMonthInt = parseInt(month, 10);

  // Function to check if a given date falls within the desired month and year
  const isDateInDesiredMonth = (dateString, year, month) => {
    const date = new Date(dateString);
    return date.getFullYear() === year && date.getMonth() + 1 === month; // Note: month is 0-indexed
  };

  let desiredMonthLower;

  if (desiredMonth === "01") {
    desiredMonthLower = "12";
  } else {
    // Convert desiredMonth to a number, subtract 1, add 12, take modulo 12, and format as a two-digit string
    desiredMonthLower = ((parseInt(desiredMonth, 10) - 1 + 12) % 12)
      .toString()
      .padStart(2, "0");
  }
  // Filter the entries based on the criteria

  const thaiMonthName = getThaiMonthName(desiredMonth);
  const thaiMonthNameLower = getThaiMonthName(desiredMonthLower);

  // const filteredEntries = timerecordAllList.filter(entry =>
  //     entry.timerecordId === desiredTimerecordId &&
  //     entry.month === desiredMonth &&
  //     entry.employee_workplaceRecord.date < 21 &&
  //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
  // );

  const filteredEntries = timerecordAllList
    .filter(
      (entry) =>
        entry.timerecordId === desiredTimerecordId &&
        entry.month === desiredMonth &&
        entry.employee_workplaceRecord.some(
          (record) =>
            record.date < 21 && record.workplaceId === desiredWorkplaceId
        )
    )
    .map((entry) => ({
      ...entry,
      employee_workplaceRecord: entry.employee_workplaceRecord.filter(
        (record) =>
          record.date < 21 && record.workplaceId === desiredWorkplaceId
      ),
    }));

  const employeeIds = filteredEntries.map((entry) => entry.employeeId);

  // const filteredEntriesLower = timerecordAllList.filter(entry =>
  //     entry.timerecordId === desiredTimerecordId &&
  //     entry.month === desiredMonthLower
  //     &&
  //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
  // );

  const filteredEntriesLower = timerecordAllList
    .filter(
      (entry) =>
        entry.timerecordId === desiredTimerecordId &&
        entry.month === desiredMonthLower &&
        entry.employee_workplaceRecord.some(
          (record) =>
            record.date > 20 && record.workplaceId === desiredWorkplaceId
        )
    )
    .map((entry) => ({
      ...entry,
      employee_workplaceRecord: entry.employee_workplaceRecord.filter(
        (record) =>
          record.date > 20 && record.workplaceId === desiredWorkplaceId
      ),
    }));

  const employeeIdsLower = filteredEntriesLower.map(
    (entry) => entry.employeeId
  );

  // Create an object to store dates for each employee

  const datesByEmployee = {};
  const datesByEmployeeLow = {};

  const datesByEmployeeUpper = {};
  const datesByEmployeeLower = {};
  // Loop through employeeIds
  for (const employeeId of employeeIds) {
    // Filter entries for the current employee
    const employeeEntries = filteredEntries.filter(
      (entry) => entry.employeeId === employeeId
    );

    const entriesData = employeeEntries.map((entry) =>
      entry.employee_workplaceRecord
        .filter((record) => record.date <= 20)
        .map((record) => ({
          workplaceId: record.workplaceId,
          dates: record.date,
          allTimes: record.allTime,
          otTimes: record.otTime,
          specialtSalarys: record.specialtSalary,
          customizeDayoff: record.customizeDayoff,
          shift: record.shift,
        }))
    );

    datesByEmployee[employeeId] = entriesData;
  }

  for (const employeeId of employeeIdsLower) {
    // Filter entries for the current employee
    const employeeEntries = filteredEntriesLower.filter(
      (entry) => entry.employeeId === employeeId
    );

    // Extract dates for the current employee
    // const dates = employeeEntries.flatMap(entry =>
    //     entry.employee_workplaceRecord.map(record => record.date)
    // );

    // // Remove duplicates (if any)
    // const uniqueDatesLower = [...new Set(dates)];

    const entriesDataLower = employeeEntries.map((entry) =>
      entry.employee_workplaceRecord
        .filter((record) => record.date >= 21)
        .map((record) => ({
          workplaceId: record.workplaceId,
          dates: record.date,
          allTimes: record.allTime,
          otTimes: record.otTime,
          specialtSalarys: record.specialtSalary,
          shift: record.shift,
        }))
    );

    // Store the unique dates for the current employee
    datesByEmployeeLow[employeeId] = entriesDataLower;
  }

  const combinedArray = {};

  for (const employeeId of Object.keys(datesByEmployee)) {
    const entriesData = datesByEmployee[employeeId].flat();

    combinedArray[employeeId] = [
      ...(combinedArray[employeeId] || []),
      ...entriesData,
    ];
  }

  for (const employeeId of Object.keys(datesByEmployeeLow)) {
    const entriesData = datesByEmployeeLow[employeeId].flat();

    combinedArray[employeeId] = [
      ...(combinedArray[employeeId] || []),
      ...entriesData,
    ];
  }

  // แยกวันทำงานของแต่ละคน
  const uniqueDatesArray = Object.keys(combinedArray).map((employeeId) => {
    const entriesData = combinedArray[employeeId];
    const uniqueDatesSet = new Set(
      entriesData
        .map((entry) => Number(entry.dates))
        .filter((date) => date !== 0)
    );
    return [...uniqueDatesSet].sort((a, b) => a - b);
  });

  // Extract employee IDs
  // แยกemployee IDsของแต่ละคน
  const employeeIdsArray = Object.keys(combinedArray)
    .map(Number)
    .sort((a, b) => a - b);
  // setEmpIDlist(employeeIdsArray);
  // console.log('EmpIDlist',empIDlist);

  const filteredUniqueDatesArray = uniqueDatesArray.map((subArray) => {
    return subArray.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  });

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/employee/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setEmploeeData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);
  // responseDataAll
  // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)));

  // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)))
  //     .sort((a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10));
  const filteredEmployees = responseDataAll.sort(
    (a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10)
  );

  // Assuming `employeeList` is an array containing employee data
  filteredEmployees.forEach((employee) => {
    // Find the matching employee in the employeeList by employeeId
    const matchingEmployee = employeeList.find(
      (emp) => emp.employeeId === employee.employeeId
    );

    // If a matching employee is found and has "costtype" == "ภ.ง.ด.3"
    if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
      // Add the costtype information to the filteredEmployees array
      employee.costtype = "ภ.ง.ด.3";
    }
  });

  //     // Do something with the filtered employees

  // const extractedData = filteredEmployees.map((employee) => ({
  //   name: employee.name + " " + employee.lastName,
  //   employeeId: employee.employeeId,
  //   costtype: employee.costtype,
  // }));
  const extractedData = filteredEmployees
    .filter(
      (employee) =>
        employee.year === year &&
        employee.month === month &&
        employee.workplace === searchWorkplaceId
    )
    .map((employee) => ({
      name: employee.name + " " + employee.lastName,
      employeeId: employee.employeeId,
      costtype: employee.costtype,
    }));

  console.log('extractedData', extractedData);

  // console.log('filteredEmployees', filteredEmployees);


  const arraylistNameEmp = extractedData;
  const arraytest = [];

  const arrayAllTime = [];

  const arraytestOT = [];

  const arrayOTAllTime = [];

  const arrayWorkNormalDay = [];
  const arrayWorkNormalDayOld = [];

  const arrayWorkOTNormalDay = [];

  const arrayWorkHoli = [];

  const arrayWorkHoliday = [];
  const arrayWorkOTHoliday = [];

  const daySpecialts = [];

  Object.keys(combinedArray).forEach((employeeId) => {
    // วันที่ทำงานทั้งหมด
    // const datesArray = combinedArray[employeeId].map(entry => Number(entry.dates));
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }
    // });

    const datesArray = combinedArray[employeeId].map((entry) =>
      Number(entry.dates)
    );

    // Filter only numeric values in datesArray

    const filteredEntriesSpecialt = combinedArray[employeeId].filter(
      (entry) =>
        entry.shift === "specialt_shift" && Number(entry.specialtSalarys) > 300
    );

    const daySpecialt = filteredEntriesSpecialt.map((entry) =>
      parseInt(entry.dates, 10)
    );

    daySpecialts.push(daySpecialt);

    const numericDatesArray = datesArray.filter((date) => !isNaN(date));

    const datesSet = new Set(datesArray);
    const uniqueDatesArray = Array.from(datesSet);

    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    const employeeResultArray = resultArray
      .filter((day) => !daySpecialt.includes(parseInt(day, 10)))
      .map((day) => {
        const workplaceIdIndex = datesArray.indexOf(day);
        // if (workplaceIdIndex !== -1) {
        //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
        //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
        // } else {
        //     return '';
        // }
        if (workplaceIdIndex !== -1) {
          const currentWorkplaceId =
            combinedArray[employeeId][workplaceIdIndex].workplaceId;

          if (currentWorkplaceId === searchWorkplaceId) {
            return 1;
          } else if (currentWorkplaceId === "") {
            return "";
          } else {
            return currentWorkplaceId;
          }
        } else {
          return "";
        }
      });
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
    //     } else {
    //         return '';
    //     }
    // });

    // รวมชั่วโมงทำงาน
    const employeeResultArrayAllTime = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
      //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;

        if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayAllTime.push(employeeResultArrayAllTime);

    // รวมชั่วโมงทำงาน
    const employeeResultArrayOTAllTime = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
      //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayOTAllTime.push(employeeResultArrayOTAllTime);

    // const datesArray = combinedArray[employeeId].map(entry => Number(entry.dates));
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId.includes(searchWorkplaceId) ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }

    // });

    arraytest.push(employeeResultArray);

    // const commonDates = datesArray.filter(date => allDayOff.includes(date) || holidayList.includes(date));
    // const employeeResultArray2 = resultArray.map(day => {
    //     const workplaceIdIndex = commonDates.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
    //         return Number.isInteger(parseFloat(currentWorkplaceId));

    //     } else {
    //         return '';
    //     }
    // });

    // วันที่ทำงานในวันหยุดธรรมดา(ช.ม.)
    const commonDatesHoli = datesArray.filter(
      (date) => holidayList.includes(date) && !allDayOff.includes(date)
    );
    const employeeResultArray2Holi = resultArray.map((day) => {
      const workplaceIdIndex = commonDatesHoli.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
      //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });
    arrayWorkHoli.push(employeeResultArray2Holi);

    // วันที่ทำงานในวันหยุดนักขัตฤกษ์(ช.ม.)
    const commonDates = datesArray.filter(
      (date) => allDayOff.includes(date) || daySpecialt.includes(parseInt(date))
    );
    // const commonDates = datesArray.filter(date => allDayOff.includes(date) && daySpecialt.includes(parseInt(date, 10)));

    // const commonDates = datesArray.filter(date => allDayOff.includes(date));

    const employeeResultArray2 = resultArray.map((day) => {
      const workplaceIdIndex = commonDates.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
      //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;
        // const currentWorkplaceId123 = combinedArray[employeeId][workplaceIdIndex].specialtSalarys;

        const specialtSalarys =
          combinedArray[employeeId][workplaceIdIndex]?.specialtSalarys ?? "";

        const currentWorkplaceId123 =
          specialtSalarys === "" ? "" : specialtSalarys;

        // 12/06/2024
        // if (currentWorkplaceId === searchWorkplaceId) {
        //     return 1;
        // } else if (currentWorkplaceId === '') {
        //     return '';
        // } else {
        // return parseFloat(currentWorkplaceId, 10);
        if (parseFloat(currentWorkplaceId, 10) == 0) {
          return "";
        } else {
          // if (currentWorkplaceId123 == "") {
          //     return '';
          // } else {
          return parseFloat(currentWorkplaceId, 10);
          // }
          // return parseFloat(currentWorkplaceId123, 10);
        }
        // }
      } else {
        return "";
      }
    });
    arrayWorkHoliday.push(employeeResultArray2);

    // วันที่ทำงานในวันหยุดนักขัตฤกษ์OT(ช.ม.)
    const commonDatesOT = datesArray.filter(
      (date) => allDayOff.includes(date) || daySpecialt.includes(parseInt(date))
    );
    // const employeeResultArray2OT = resultArray.map(day => {
    //     const workplaceIdIndex = commonDatesOT.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;
    //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }
    // });
    const employeeResultArray2OT = resultArray.map((day) => {
      const workplaceIdIndex = commonDatesOT.indexOf(day);

      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });
    arrayWorkOTHoliday.push(employeeResultArray2OT);

    // วันที่ทำงานปกติ

    // datesArray
    const employeeResultArray3 = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].workplaceId;
        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          return currentWorkplaceId;
        }
      } else {
        return "";
      }
    });

    arrayWorkNormalDay.push(employeeResultArray3);

    // วันที่ทำงานปกติ
    // const commonDates3 = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date) || daySpecialt.includes(parseInt(date, 10))));
    const commonDates3 = datesArray.filter(
      (date) => !(allDayOff.includes(date) || holidayList.includes(date))
    );

    const employeeResultArray3Old = resultArray.map((day) => {
      const workplaceIdIndex = commonDates3.indexOf(day);
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].workplaceId;
        return currentWorkplaceId === searchWorkplaceId
          ? 1
          : parseInt(currentWorkplaceId, 10);
      } else {
        return "";
      }
    });
    arrayWorkNormalDayOld.push(employeeResultArray3Old);

    // วันที่ทำงานปกติOT
    const commonDates3OT = datesArray.filter(
      (date) =>
        !(
          allDayOff.includes(date) ||
          holidayList.includes(date) ||
          daySpecialt.includes(parseInt(date, 10))
        )
    );

    const employeeResultArray3OT = resultArray.map((day) => {
      const workplaceIdIndex = commonDates3OT.indexOf(day);

      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayWorkOTNormalDay.push(employeeResultArray3OT);
  });

  const filteredEntriesTest = conclude
    // Filter by year and month
    .filter((entry) =>
      entry.year === desiredTimerecordId && entry.month === desiredMonth
    )
    // Filter by employeeId that exists in employeeList
    .filter((entry) => {
      const employeeInList = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );
      return employeeInList !== undefined;
    })
    // Filter by searchWorkplaceId, either matching employeeList.workplace or concludeRecord.workplaceId
    .filter((entry) => {
      const employeeInList = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );

      // Check if the employee's workplace matches searchWorkplaceId
      if (employeeInList && employeeInList.workplace === searchWorkplaceId) {
        return true;
      }

      // Check if any of the concludeRecord's workplaceId matches searchWorkplaceId
      const workplaceMatch = entry.concludeRecord.some(
        (record) => record.workplaceId === searchWorkplaceId
      );

      return workplaceMatch;
    });


  filteredEntriesTest.sort((a, b) => {
    // Assuming employeeId is a string, convert it to a number for numerical comparison
    return Number(a.employeeId) - Number(b.employeeId);
  });


  // Step 1: Extract employeeId values from responseDataAll
  const employeeIdss = responseDataAll.map((entry) => entry.employeeId);

  // Step 2: Filter filteredEntriesTest based on employeeId
  const filteredEntriesqw = filteredEntriesTest.filter((entry) =>
    employeeIdss.includes(entry.employeeId)
  );

  // Step 3: Sort the filtered entries
  filteredEntriesqw.sort((a, b) => Number(a.employeeId) - Number(b.employeeId));

  const groupedByEmployeeId = {};

  filteredEntriesqw.forEach((entry) => {
    const employeeId = entry.employeeId;

    if (!groupedByEmployeeId[employeeId]) {
      groupedByEmployeeId[employeeId] = {
        addSalary: [],
        concludeDate: entry.concludeDate,
        concludeRecord: [],
        employeeId: employeeId,
        month: entry.month,
        year: entry.year,
        __v: entry.__v,
        _id: entry._id,
      };
    }

    entry.concludeRecord.forEach((record) => {
      const day = record.day;

      if (!groupedByEmployeeId[employeeId].concludeRecord[day]) {
        groupedByEmployeeId[employeeId].concludeRecord[day] = {
          day: day,
          workplaceId: [],
          allTimes: [],
          workRate: [],
          workRateMultiply: [],
          otTimes: [],
          workRateOT: [],
          workRateOTMultiply: [],
          addSalaryDay: [],
          shift: [],
          _id: [],
        };
      }

      groupedByEmployeeId[employeeId].concludeRecord[day].workplaceId.push(
        record.workplaceId
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].allTimes.push(
        parseFloat(record.allTimes) || 0
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRate.push(
        record.workRate
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRateMultiply.push(
        record.workRateMultiply
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].otTimes.push(
        parseFloat(record.otTimes) || 0
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRateOT.push(
        record.workRateOT
      );
      groupedByEmployeeId[employeeId].concludeRecord[
        day
      ].workRateOTMultiply.push(record.workRateOTMultiply);
      groupedByEmployeeId[employeeId].concludeRecord[day].addSalaryDay.push(
        record.addSalaryDay
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].shift.push(
        record.shift
      );
      groupedByEmployeeId[employeeId].concludeRecord[day]._id.push(record._id);
    });

    groupedByEmployeeId[employeeId].addSalary.push(entry.addSalary);
  });

  // Transform the grouped data into the desired array structure
  const shiftOrder = [
    "morning_shift",
    "afternoon_shift",
    "night_shift",
    "specialt_shift",
  ];
  const resultArrayNew = [];

  Object.values(groupedByEmployeeId).forEach((group) => {
    const groupedDays = [];

    Object.values(group.concludeRecord).forEach((groupDay) => {
      const sortedIndices = groupDay.shift
        .map((shift, index) => ({ shift, index }))
        .sort(
          (a, b) => shiftOrder.indexOf(a.shift) - shiftOrder.indexOf(b.shift)
        )
        .map(({ index }) => index);

      const sortArrayByIndices = (array) =>
        sortedIndices.map((index) => array[index]);

      const sortedWorkplaceId = sortArrayByIndices(groupDay.workplaceId);
      const sortedWorkRate = sortArrayByIndices(groupDay.workRate);
      const sortedWorkRateOT = sortArrayByIndices(groupDay.workRateOT);
      const sortedWorkRateMultiply = sortArrayByIndices(
        groupDay.workRateMultiply
      );
      const sortedWorkRateOTMultiply = sortArrayByIndices(
        groupDay.workRateOTMultiply
      );
      const sortedAddSalaryDay = sortArrayByIndices(groupDay.addSalaryDay);
      const sortedShift = sortArrayByIndices(groupDay.shift);
      const sortedId = sortArrayByIndices(groupDay._id);

      const sumAllTimes = groupDay.allTimes.reduce(
        (sum, time) => sum + time,
        0
      );
      const sumOtTimes = groupDay.otTimes.reduce((sum, time) => sum + time, 0);

      groupedDays.push({
        day: groupDay.day,
        workplaceId: sortedWorkplaceId[0], // Taking the first element after sorting
        allTimes: sumAllTimes,
        workRate: sortedWorkRate[0], // Taking the first element after sorting
        workRateMultiply: sortedWorkRateMultiply[0], // Taking the first element after sorting
        otTimes: sumOtTimes,
        workRateOT: sortedWorkRateOT[0], // Taking the first element after sorting
        workRateOTMultiply: sortedWorkRateOTMultiply[0], // Taking the first element after sorting
        addSalaryDay: sortedAddSalaryDay[0], // Taking the first element after sorting
        shift: sortedShift,
        _id: sortedId,
      });
    });

    resultArrayNew.push({
      addSalary: group.addSalary,
      concludeDate: group.concludeDate,
      concludeRecord: groupedDays,
      employeeId: group.employeeId,
      month: group.month,
      year: group.year,
      __v: group.__v,
      _id: group._id,
    });
  });
  

  // Initialize objects to store the grouped times
  const dayWorkMorningAndSS = {};
  const dayWorkAfternoon = {};
  const dayWorkNight = {};

  const allTimesByEmployee = {};
  const otTimesByEmployee = {};

  const allTimesByEmployee2 = {};
  const otTimesByEmployee2 = {};

  const allTimesByEmployee3 = {};
  const otTimesByEmployee3 = {};

  // Iterate over filteredEntriesTest to populate the objects
  //   filteredEntriesTest.forEach((entry) => { old
  resultArrayNew.forEach((entry) => {
    // Initialize arrays to store the results for the current employeeId
    let dayWorkMorningAndSSArray = [];
    let dayWorkAfternoonArray = [];
    let dayWorkNightArray = [];

    const uniqueDaysMorningAndSS = new Set();
    const uniqueDaysAfternoon = new Set();
    const uniqueDaysNight = new Set();

    const MorningAndSSShiftDayCount = {};
    const nightShiftDayCount = {};

    let allTimesArray = [];
    let otTimesArray = [];

    let allTimesArray2 = [];
    let otTimesArray2 = [];

    let allTimesArray3 = [];
    let otTimesArray3 = [];
    let test = 0;

    // Iterate over each concludeRecord
    entry.concludeRecord.forEach((record) => {
      const matchingEmployee = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );

      // Check if workRate or workRateOT exists
      // const
      // if (record.workRate || record.workRateOT) {
      //     // Push allTimes and otTimes to respective arrays
      //     allTimesArray.push(parseFloat(record.allTimes));
      //     otTimesArray.push(parseFloat(record.otTimes));
      //     test += 1;
      // } else {
      //     // Push empty strings if workRate and workRateOT do not exist
      //     allTimesArray.push('');
      //     otTimesArray.push('');
      // }
      // const day = parseInt(record.day.split('/')[0]);
      ///////////////////////วันที่ทำงาน
      if (
        (record.workRate != 0 &&
          record.workRate != null &&
          //   (record.shift === "specialt_shift" || record.shift === "morning_shift")
          record.shift.includes("morning_shift")) ||
        record.shift.includes("specialt_shift")
        // (record.shift != "afternoon_shift" || record.shift != "night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays

        // dayWorkMorningAndSSArray.push(parseFloat(record.day));
        if (!uniqueDaysMorningAndSS.has(parseFloat(record.day))) {
          dayWorkMorningAndSSArray.push(record.workplaceId);
          uniqueDaysMorningAndSS.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        dayWorkMorningAndSSArray.push("");
      }

      if (
        record.workRate != 0 &&
        record.workRate != null &&
        //   record.shift == "afternoon_shift"
        record.shift.includes("afternoon_shift")
        // (record.shift != "specialt_shift" ||
        //   record.shift != "morning_shift" ||
        //   record.shift != "night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays
        // dayWorkAfternoonArray.push(parseFloat(record.day));

        if (!uniqueDaysAfternoon.has(parseFloat(record.day))) {
          dayWorkAfternoonArray.push(parseFloat(record.allTimes));
          uniqueDaysAfternoon.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        dayWorkAfternoonArray.push("");
      }

      if (
        record.workRate != 0 &&
        record.workRate != null &&
        record.shift.includes("night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays
        // dayWorkNightArray.push(parseFloat(record.allTimes));
        if (!uniqueDaysNight.has(parseFloat(record.day))) {
          dayWorkNightArray.push(record.workplaceId);
          uniqueDaysNight.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        dayWorkNightArray.push("");
      }
      /////////////////วันที่ทำงาน
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        // allTimesArray.push(parseFloat(record.allTimes).toFixed(1)); // Push empty string if workplace starts with "3"
        if (parseFloat(record.allTimes) == 0) {
          allTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        }
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) <= 1 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        // allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        if (parseFloat(record.allTimes) == 0) {
          allTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          // Push allTimes to array if it's not 0
          allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        }
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        // otTimesArray.push(parseFloat(record.otTimes).toFixed(1)); // Push empty string if workplace starts with "3"
        if (parseFloat(record.otTimes) == 0) {
          otTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        }
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) <= 1.5 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        // otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        if (parseFloat(record.otTimes) == 0) {
          otTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          // Push allTimes to array if it's not 0
          otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        }
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray.push("");
        // dayWorkArray.push('');
      }
      // 22
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        allTimesArray2.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) > 1.5 && // Convert workRateMultiply to float
        parseFloat(record.workRateMultiply) <= 2
      ) {
        // Push allTimes and otTimes to respective arrays
        allTimesArray2.push(parseFloat(record.allTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray2.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        otTimesArray2.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) < 3 &&
        parseFloat(record.workRateOTMultiply) > 2
      ) {
        // Push allTimes and otTimes to respective arrays
        otTimesArray2.push(parseFloat(record.otTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray2.push("");
        // dayWorkArray.push('');
      }

      // 33
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        allTimesArray3.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) >= 3 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        allTimesArray3.push(parseFloat(record.allTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray3.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        otTimesArray3.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) >= 3
      ) {
        // Push allTimes and otTimes to respective arrays
        otTimesArray3.push(parseFloat(record.otTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray3.push("");
        // dayWorkArray.push('');
      }

      // if (
      //   record.workRate != 0 &&
      //   record.workRate != null &&
      //   record.workRate / workRateWorkplace >= workRateWorkplaceStage1 &&
      //   record.workRate / workRateWorkplace < workRateWorkplaceStage2
      // ) {
      //   // Push allTimes and otTimes to respective arrays
      //   allTimesArray2.push(parseFloat(record.allTimes).toFixed(1));
      //   otTimesArray2.push(parseFloat(record.otTimes).toFixed(1));
      // } else {
      //   // Push empty strings if workRate and workRateOT do not exist
      //   allTimesArray2.push("");
      //   otTimesArray2.push("");
      // }
      // if (
      //   record.workRate != 0 &&
      //   record.workRate != null &&
      //   record.workRate / workRateWorkplace >= workRateWorkplaceStage2
      // ) {
      //   // Push allTimes and otTimes to respective arrays
      //   allTimesArray3.push(parseFloat(record.allTimes).toFixed(1));
      //   otTimesArray3.push(parseFloat(record.otTimes).toFixed(1));
      // } else {
      //   // Push empty strings if workRate and workRateOT do not exist
      //   allTimesArray3.push("");
      //   otTimesArray3.push("");
      // }
    });

    // Store the arrays in the objects by employeeId

    if (!dayWorkMorningAndSS[entry.employeeId]) {
      dayWorkMorningAndSS[entry.employeeId] = [];
    }
    dayWorkMorningAndSS[entry.employeeId].push(dayWorkMorningAndSSArray);

    if (!dayWorkAfternoon[entry.employeeId]) {
      dayWorkAfternoon[entry.employeeId] = [];
    }
    dayWorkAfternoon[entry.employeeId].push(dayWorkAfternoonArray);

    if (!dayWorkNight[entry.employeeId]) {
      dayWorkNight[entry.employeeId] = [];
    }
    dayWorkNight[entry.employeeId].push(dayWorkNightArray);

    if (!allTimesByEmployee[entry.employeeId]) {
      allTimesByEmployee[entry.employeeId] = [];
    }
    if (!otTimesByEmployee[entry.employeeId]) {
      otTimesByEmployee[entry.employeeId] = [];
    }
    allTimesByEmployee[entry.employeeId].push(allTimesArray);
    otTimesByEmployee[entry.employeeId].push(otTimesArray);

    //
    if (!allTimesByEmployee2[entry.employeeId]) {
      allTimesByEmployee2[entry.employeeId] = [];
    }
    if (!otTimesByEmployee2[entry.employeeId]) {
      otTimesByEmployee2[entry.employeeId] = [];
    }
    allTimesByEmployee2[entry.employeeId].push(allTimesArray2);
    otTimesByEmployee2[entry.employeeId].push(otTimesArray2);

    //
    if (!allTimesByEmployee3[entry.employeeId]) {
      allTimesByEmployee3[entry.employeeId] = [];
    }
    if (!otTimesByEmployee3[entry.employeeId]) {
      otTimesByEmployee3[entry.employeeId] = [];
    }
    allTimesByEmployee3[entry.employeeId].push(allTimesArray3);
    otTimesByEmployee3[entry.employeeId].push(otTimesArray3);
  });

  // Convert the objects to arrays of arrays
  const dayWorkMorningAndSSs = Object.values(dayWorkMorningAndSS).flat();
  console.log('dayWorkMorningAndSS', dayWorkMorningAndSS);

  const dayWorkAfternoons = Object.values(dayWorkAfternoon).flat();
  const dayWorkNights = Object.values(dayWorkNight).flat();

  const newAllTimes = Object.values(allTimesByEmployee).flat();
  const newOtTimes = Object.values(otTimesByEmployee).flat();

  const newAllTimes2 = Object.values(allTimesByEmployee2).flat();
  const newOtTimes2 = Object.values(otTimesByEmployee2).flat();

  const newAllTimes3 = Object.values(allTimesByEmployee3).flat();
  const newOtTimes3 = Object.values(otTimesByEmployee3).flat();

  const singleArrayOfDates = daySpecialts.flat();

  const updateDayWorks = (
    dayWorkMorningAndSSs,
    allDayOff,
    holidayList,
    singleArrayOfDates
  ) => {
    return dayWorkMorningAndSSs.map((subArray) =>
      subArray.map((day) =>
        allDayOff.includes(day) ||
          holidayList.includes(day) ||
          singleArrayOfDates.includes(day)
          ? ""
          : day
      )
    );
  };

  const updatedDaysWorkMorningAndSS = updateDayWorks(
    dayWorkMorningAndSSs,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );
  console.log('dayWorkMorningAndSSs', dayWorkMorningAndSSs);
  console.log('allDayOff', allDayOff);
  console.log('holidayList', holidayList);
  console.log('singleArrayOfDates', singleArrayOfDates);

  console.log('updatedDaysWorkMorningAndSS', updatedDaysWorkMorningAndSS);


  const updatedDaysWorkAfternoon = updateDayWorks(
    dayWorkAfternoons,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );

  const updatedDaysWorkNight = updateDayWorks(
    dayWorkNights,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );

  const changeNumbersToOne = (array, searchWorkplaceId) => {
    return array.map((subArray) =>
      subArray.map((day) =>
        typeof day === "string" && day === searchWorkplaceId ? "1" : day
      )
    );
  };

  const changeNumbersToOne2 = (array) => {
    return array.map((subArray) =>
      subArray.map((day) => {
        if (typeof day === "string" && day === searchWorkplaceId) {
          return "1";
        } else if (typeof day === "string" && day !== "") {
          return "";
        } else {
          return day;
        }
      })
    );
  };

  // const searchWorkplaceId = '399-664';



  const finalUpdatedDayWorksWorkMorningAndSS = changeNumbersToOne(
    updatedDaysWorkMorningAndSS,
    searchWorkplaceId
  );

  console.log('searchWorkplaceId', searchWorkplaceId);
  console.log('finalUpdatedDayWorksWorkMorningAndSS', finalUpdatedDayWorksWorkMorningAndSS);

  const updatedFinalMorningAndSS = finalUpdatedDayWorksWorkMorningAndSS.map(
    (subArray) =>
      subArray.map((value) =>
        typeof value === "string" && value.length < 3 ? "" : value
      )
  );

  const finalUpdatedDayWorksWorkAfternoon = changeNumbersToOne2(
    updatedDaysWorkAfternoon
  );

  const finalUpdatedDayWorksWorkNight =
    changeNumbersToOne2(updatedDaysWorkNight);


  // const consolidateArrays = (
  //   morningArray,
  //   afternoonArray,
  //   nightArray
  // ) => {
  //   return morningArray.map((subArray, rowIndex) =>
  //     subArray.map((value, colIndex) => {
  //       // Check if "1" exists in any of the arrays at the same position
  //       return ["1"].includes(morningArray[rowIndex][colIndex]) ||
  //         ["1"].includes(afternoonArray[rowIndex][colIndex]) ||
  //         ["1"].includes(nightArray[rowIndex][colIndex])
  //         ? "1"
  //         : ""; // Set to "1" if found, else ""
  //     })
  //   );
  // };
  const consolidateArrays = (
    morningArray,
    afternoonArray,
    nightArray
  ) => {
    return morningArray.map((subArray, rowIndex) =>
      subArray.map((_, colIndex) => {
        // Check if any of the arrays have a non-empty value at the same position
        return morningArray[rowIndex][colIndex] ||
          afternoonArray[rowIndex][colIndex] ||
          nightArray[rowIndex][colIndex]
          ? "1"
          : ""; // Set to "1" if any value exists, otherwise an empty string
      })
    );
  };

  // Combine the arrays
  const finalConsolidatedArray = consolidateArrays(
    finalUpdatedDayWorksWorkMorningAndSS,
    finalUpdatedDayWorksWorkAfternoon,
    finalUpdatedDayWorksWorkNight
  );
  console.log('finalConsolidatedArray', finalConsolidatedArray);
  console.log('finalUpdatedDayWorksWorkMorningAndSS', finalUpdatedDayWorksWorkMorningAndSS);
  console.log('finalUpdatedDayWorksWorkAfternoon', finalUpdatedDayWorksWorkAfternoon);
  console.log('finalUpdatedDayWorksWorkNight', finalUpdatedDayWorksWorkNight);


  const sumArrayAllTime = arrayAllTime.map((subArray) => {
    let totalHours = 0;
    let totalMinutes = 0;

    subArray.forEach((val) => {
      if (typeof val === "number") {
        const [hours, minutes] = val.toString().split(".").map(Number);
        totalHours += hours;
        totalMinutes += minutes ? minutes * 10 : 0; // 0.1 hour is 6 minutes
      }
    });

    // Convert total minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Convert remaining minutes back to hours (fractional hours)
    totalHours += totalMinutes / 60;

    return totalHours;
  });

  const dividedArray = sumArrayAllTime.map((sum) =>
    (sum / workplaceDataWorkOfHour).toFixed(2)
  );

  const sumArrayOTAllTime = arrayOTAllTime.map((subArray) =>
    subArray.reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0)
  );

  const sumArray321 = (array) => {
    return array.map((subArray) =>
      subArray.reduce(
        (acc, val) => acc + (typeof val === "number" ? val : 0),
        0
      )
    );
  };

  // Ensure all values are numbers
  const convertToNumbers = (array) => {
    return array.map((subArray) =>
      subArray.map((val) => (val === "" ? 0 : parseFloat(val)))
    );
  };

  // Sum corresponding elements of two arrays
  const sumArraysElementWise = (array1, array2) => {
    return array1.map((subArray, i) =>
      subArray.map((val, j) => val + array2[i][j])
    );
  };

  // Convert to numbers
  // 1.5
  const newAllTimesNumbers = convertToNumbers(newAllTimes);

  const newAllTimes2Numbers = convertToNumbers(newAllTimes2);
  const newOtTimesNumbers = convertToNumbers(newOtTimes);

  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArray1_5 = sumArraysElementWise(
    newAllTimes2Numbers,
    newOtTimesNumbers
  );

  const summedArray = sumArray321(newAllTimes2Numbers);
  // Sum each sub-array

  const sumArrayOT = sumArray321(combinedArray1_5);

  const sumArrayTotal = sumArrayOT;
  // 2
  const newAllTimes3Numbers = convertToNumbers(newAllTimes3);
  const newOtTimes2Numbers = convertToNumbers(newOtTimes2);

  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArray2 = sumArraysElementWise(
    newAllTimes3Numbers,
    newOtTimes2Numbers
  );

  // Sum each sub-array
  const sumArrayHoliday = sumArray321(combinedArray2);

  // รวมช.ม.ที่งานไม่รวมOT
  const convertToHoursMinutes = (total) => {
    const hours = Math.floor(total);
    const minutes = Math.round((total - hours) * 60);
    return `${hours}.${minutes < 10 ? "0" : ""}${minutes}`;
  };
  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArrayAll = sumArraysElementWise(
    newAllTimes3Numbers,
    newAllTimesNumbers,
    newAllTimes2Numbers
  );

  // Sum each sub-array
  const sumArrayAllHourWork = sumArray321(combinedArrayAll);

  console.log('responseDataAll', responseDataAll);

  const filteredResponseDataAll = responseDataAll.filter((response) =>
    extractedData.some((employee) => employee.employeeId === response.employeeId)
  );

  const countSpecialDays = filteredResponseDataAll.map(
    (item) => Number(item.countSpecialDay) || 0
  );
  const specialDayListWorks = filteredResponseDataAll.map((item) =>
    item.specialDayListWork ? item.specialDayListWork.length : 0
  );

  // const specialDayRate = filteredResponseDataAll.map(item => item.specialDayRate);
  const specialDayRate = filteredResponseDataAll.map((item) =>
    parseInt(item.specialDayRate, 10)
  );
  // const amountSpecialDay = filteredResponseDataAll.map(item => parseInt(item.accountingRecord.amountSpecialDay, 10));
  const amountSpecialDay = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseInt(accountingRecord.amountSpecialDay, 10)
      : 0;
  });

  const countHour = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countHour, 10) : 0;
  });

  const countDay = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countDay, 10) : 0;
  });

  const countDayWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countDayWork, 10) : 0;
  });
  console.log('countDayWork', countDayWork);

  const countHourWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countHourWork, 10) : 0;
  });

  const amountCountDayWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountCountDayWork).toFixed(2)
      : 0;
  });

  const hourOneFive = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];

    // Check if the workplace starts with "3"
    if (item.workplace.startsWith("3")) {
      // Return `countOtHour` if workplace starts with "3"
      return accountingRecord
        ? parseFloat(accountingRecord.countOtHour).toFixed(2)
        : "0.00";
    } else {
      // Otherwise, return `hourOneFive`
      return accountingRecord
        ? parseFloat(accountingRecord.hourOneFive).toFixed(2)
        : "0.00";
    }
  });

  const amountOneFive = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];

    // Check if the workplace starts with "3"
    if (item.workplace.startsWith("3")) {
      // Return `countOtHour` if workplace starts with "3"
      return accountingRecord
        ? parseFloat(accountingRecord.amountOt).toFixed(2)
        : "0.00";
    } else {
      // Otherwise, return `hourOneFive`
      return accountingRecord
        ? parseFloat(accountingRecord.amountOneFive).toFixed(2)
        : "0.00";
    }
  });


  const hourTwo = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.hourTwo).toFixed(2)
      : "0.00";
  });

  const amountTwo = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountTwo).toFixed(2)
      : "0.00";
  });

  const hourThree = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.hourThree).toFixed(2)
      : "0.00";
  });

  const amountThree = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountThree).toFixed(2)
      : "0.00";
  });

  const saveCash = filteredResponseDataAll.map((item) =>
    item.workplace.startsWith("3") ? "สแปร์เงินสด" : ""
  );

  const sumArrayHoli = countSpecialDays.map(
    (countSpecialDay, index) => countSpecialDay - specialDayListWorks[index]
  );

  const socialSecurity = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.socialSecurity)
      : "0";
  });

  const tax = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.tax)
      : "0";
  });

  const adjustedAmountSpecialDay = amountSpecialDay.map((amount, index) => {
    if (isNaN(amount) || amount === 0) {
      sumArrayHoli[index] = 0;
      return 0;
    }
    return amount;
  });

  const sumArrayOTHoliday = newOtTimes3.map((subArray) =>
    subArray
      .reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0)
      .toFixed(2)
  );

  // นับวันที่ทำในวันหยุดวันนักขัตฤกษ์
  const occurrencesCount = filteredUniqueDatesArray.map((subArray) => {
    const count = subArray.filter((value) => allDayOff.includes(value)).length;
    return count;
  });

  // นับวันที่ทำในวันหยุด ไม่รวมวันนักขัตฤกษ์
  const occurrencesCount2 = filteredUniqueDatesArray.map((subArray) => {
    const count = subArray.filter(
      (value) => holidayList.includes(value) && !allDayOff.includes(value)
    ).length;
    return count;
  });

  const sumArray = arrayWorkNormalDay.map((subarray) =>
    subarray.reduce((count, item) => {
      if (typeof item === "string") {
        const stringLength = item.length;

        if (stringLength >= 4) {
          return count + 1;
        } else if (stringLength > 0) {
          return count + parseFloat(item) || 0;
        }
      } else if (typeof item === "number") {
        return count + item;
      }

      return count;
    }, 0)
  );

  const sumArrayOld = arrayWorkNormalDayOld.map((subarray) =>
    subarray
      .map((item) => (typeof item === "number" ? 1 : item))
      .reduce((count, item) => (item === 1 ? count + 1 : count), 0)
  );

  const indexArray = Array.from(
    { length: sumArray.length },
    (_, index) => index + 1
  );

  const sumHoliAllTime = sumArrayOT.map(
    (value, index) => value + sumArrayHoli[index]
  );

  // workplaceDataWorkOfHour
  // sumArrayHoliday
  // sumArrayHoli

  const sumarrayAllHoloday = sumArrayHoli.map((valueHoli, index) => {
    const valueHoliday = sumArrayHoliday[index] || 0; // If undefined, treat as 0
    const sum = valueHoli + valueHoliday;
    return sum / workplaceDataWorkOfHour;
  });
  // addSalaryWorkplace
  const sumArraySumarrayAllHolioday = sumArray.map(
    (value, index) => value + sumarrayAllHoloday[index]
  );

  const resultAllSalaryEmp = [];

  addSalaryWorkplace.sort((a, b) => a.name.localeCompare(b.name, "th"));


  const getUniqueEntriesWithLowestSpSalary = (entries) => {
    const uniqueEntriesMap = new Map();

    entries.forEach((entry) => {
      const { codeSpSalary, SpSalary } = entry;
      const currentEntry = uniqueEntriesMap.get(codeSpSalary);

      if (
        !currentEntry ||
        parseFloat(SpSalary) < parseFloat(currentEntry.SpSalary)
      ) {
        uniqueEntriesMap.set(codeSpSalary, entry);
      }
    });

    return Array.from(uniqueEntriesMap.values());
  };

  const filteredAddSalaryWorkplace =
    getUniqueEntriesWithLowestSpSalary(addSalaryWorkplace);

  console.log('filteredAddSalaryWorkplace', filteredAddSalaryWorkplace);

  const addSalaryNames = new Set(
    filteredAddSalaryWorkplace.map((item) => item.name)
  );

  // Map filteredEmployees to set SpSalary based on the position of the corresponding name in filteredAddSalaryWorkplace
  console.log('filteredEmployees', filteredEmployees);

  // ช่วงที่เพิ่มเงินลา
  const responseDataAllLeaveSalary = filteredEmployees.map((employee) => {
    // Find matching leaveSalary for the employee
    const matchingLeave = leaveSalary.find(
      (leave) => leave.employeeId === employee.employeeId
    );

    // Sum SpSalary from leaveSalary.record if it exists
    const totalSpSalary = matchingLeave?.record?.reduce((sum, record) => {
      return sum + (parseFloat(record.SpSalary) || 0);
    }, 0) || 0;

    // Prepare the "เงินลา" object to add to addSalary
    const leaveSalaryEntry = {
      SpSalary: totalSpSalary,
      StaffType: "all",
      id: "-",
      name: "เงินลา",
      nameType: "",
      roundOfSalary: "daily",
    };

    // Add the leaveSalaryEntry to addSalary array (initialize if needed)
    const updatedAddSalary = [
      ...(employee.addSalary || []), // Keep existing addSalary entries
      leaveSalaryEntry, // Add the new leaveSalary entry
    ];

    // Add the summed SpSalary to addAmountAfterTax
    // return {
    //   ...employee,
    //   accountingRecord: {
    //     ...employee.accountingRecord,
    //     addAmountAfterTax:
    //       (employee.accountingRecord?.addAmountAfterTax || 0) + totalSpSalary,
    //   },
    //   addSalary: updatedAddSalary, // Update the addSalary array
    // };
    return {
      ...employee,
      accountingRecord: {
        ...employee.accountingRecord,
        addAmountAfterTax:
          ((employee.accountingRecord?.addAmountAfterTax || 0) + totalSpSalary)
            .toString(), // Convert addAmountAfterTax to a string
      },
      addSalary: updatedAddSalary, // Update the addSalary array
    };
  });

  console.log("responseDataAllLeaveSalary", responseDataAllLeaveSalary);

  // const extractedDataAddSalary = responseDataAllLeaveSalary.map((employee) => {
  //   // Initialize an array to hold SpSalary values
  //   const spSalaryArray = [];
  //   // Iterate over filteredAddSalaryWorkplace
  //   filteredAddSalaryWorkplace.forEach((salaryItem) => {
  //     // Find the position of salaryItem.name in employee.addSalary
  //     const index = employee.addSalary.findIndex(
  //       (item) => item.id === salaryItem.codeSpSalary
  //     );
  //     // If the name exists in employee.addSalary, push the SpSalary as an integer to spSalaryArray
  //     if (index !== -1 || employee.addSalary[index].id == '-') {
  //       spSalaryArray.push(parseInt(employee.addSalary[index].SpSalary));
  //     } else {
  //       // If the name doesn't exist in employee.addSalary, push 0 as an integer
  //       spSalaryArray.push("");
  //     }
  //   });
  //   return spSalaryArray;
  // });

  const extractedDataAddSalary = responseDataAllLeaveSalary.map((employee) => {
    // Initialize an array to hold SpSalary values
    const spSalaryArray = [];

    // Track if we find an entry with `id === '-'`
    let lastSpSalary = null;

    // Iterate over filteredAddSalaryWorkplace
    filteredAddSalaryWorkplace.forEach((salaryItem) => {
      // Find the position of salaryItem.name in employee.addSalary
      const index = employee.addSalary.findIndex(
        (item) => item.id === salaryItem.codeSpSalary
      );

      if (index !== -1) {
        // If the salary item exists, push the SpSalary value
        spSalaryArray.push(parseInt(employee.addSalary[index].SpSalary) || 0);
      } else {
        // If the salary item doesn't exist, check for `id === '-'`
        const dashIndex = employee.addSalary.findIndex(
          (item) => item.id == '-'
        );

        if (dashIndex !== -1) {
          // If `id === '-'` is found, store the SpSalary to be added at the end
          lastSpSalary = parseInt(employee.addSalary[dashIndex].SpSalary) || 0;
        } else {
          // If no matching salary item or `id === '-'`, push an empty value
          spSalaryArray.push("");
        }
      }
    });

    // If we found a `'-'`, push its SpSalary to the last position of the array
    if (lastSpSalary !== null) {
      spSalaryArray.push(lastSpSalary);
    }

    return spSalaryArray;
  });


  console.log('extractedDataAddSalary', extractedDataAddSalary);

  const adjustedDailyExtractedDataAddSalary = extractedDataAddSalary.map(
    (salaryArray, outerIndex) => {
      return salaryArray.map((value, innerIndex) => {
        // Find the corresponding salary item in employee.addSalary
        const employeeSalaryItem = responseDataAllLeaveSalary[outerIndex].addSalary.find(
          (item) => item.name === filteredAddSalaryWorkplace[innerIndex].name
        );

        if (
          employeeSalaryItem &&
          employeeSalaryItem.roundOfSalary === "daily"
        ) {
          return value;
        } else {
          // Otherwise, keep the value unchanged
          return value;
        }
      });
    }
  );


  // const adjustedDailyExtractedDataAddSalaryCount = extractedDataAddSalary.map(
  //   (salaryArray, outerIndex) => {
  //     return salaryArray.map((value, innerIndex) => {
  //       // If the value is not an empty string and roundOfSalary is 'daily'
  //       // const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(item => item.name === filteredAddSalaryWorkplace[innerIndex].name);
  //       const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(
  //         (item) =>
  //           item.id === filteredAddSalaryWorkplace[innerIndex].codeSpSalary
  //       );

  //       if (
  //         value !== "" &&
  //         filteredAddSalaryWorkplace[innerIndex].roundOfSalary === "daily"
  //       ) {
  //         // Multiply the value by the corresponding count in sumArray
  //         // return sumArrayOld[outerIndex];
  //         return employeeSalaryItem.message;
  //       } else {
  //         // Otherwise, keep the value unchanged
  //         return "";
  //       }
  //     });
  //   }
  // );

  const adjustedDailyExtractedDataAddSalaryCount = extractedDataAddSalary.map(
    (salaryArray, outerIndex) => {
      return salaryArray.map((value, innerIndex) => {
        // Find the corresponding employee salary item
        const employeeSalaryItem = responseDataAllLeaveSalary[outerIndex].addSalary.find(
          (item) =>
            item.id === filteredAddSalaryWorkplace[innerIndex].codeSpSalary
        );

        if (
          value !== "" &&
          filteredAddSalaryWorkplace[innerIndex].roundOfSalary === "daily"
        ) {
          // If employeeSalaryItem is found, return its message, else return empty string
          return employeeSalaryItem ? employeeSalaryItem.message : "";
        } else {
          // Otherwise, return an empty string
          return "";
        }
      }).map((cell) => cell === undefined ? "" : cell); // Map again to replace undefined with ""
    }
  );

  console.log('adjustedDailyExtractedDataAddSalaryCount', adjustedDailyExtractedDataAddSalaryCount);
  // รวมคำนวนสวัสดิการ
  const SpSalaryArray = workplaceDataListAddSalary.map((item) => item.SpSalary);
  const roundOfSalaryArray = workplaceDataListAddSalary.map(
    (item) => item.roundOfSalary
  );

  const resultArraySumAddSalary = [];

  for (let i = 0; i < sumArraySumarrayAllHolioday.length; i++) {
    const calculatedValues = [];

    for (let j = 0; j < SpSalaryArray.length; j++) {
      const originalValue = parseInt(SpSalaryArray[j], 10);
      const roundOfSalary = roundOfSalaryArray[j];

      let calculatedValue;

      if (roundOfSalary === "monthly") {
        calculatedValue = originalValue;
      } else if (roundOfSalary === "daily") {
        calculatedValue = sumArraySumarrayAllHolioday[i] * originalValue;
      }

      calculatedValues.push(calculatedValue);
    }

    resultArraySumAddSalary.push(calculatedValues);
  }

  const yearThai = parseFloat(year, 10) + 543;
  // เริ่มฟังค์ชั่นpdf

  const generatePDFTest123 = (event) => {
    event.preventDefault();
    try {
      // Your code here
      // handleEmployeeFilter();
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const table = tableRef.current;
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };

      const arraytestSpSalary = [
        [
          "",
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          0.5,
        ],
        [2, 2, 2, 2, 2, "", 2, "", 2],
        [2, "", 2, 2, "", 2, 3, "", 3, 3],
        [3, 3, 3, "", 3, 3, 3, 3],
        [3, "", 3, "", 3, 3, 3, 1, "", 1],
        [3, 3, "", 1, 1, "", 1, 3, 3],
        [3, 3, "", 3, "", 3, 3, 3, 3, "", 1, "", 1, 0.5, 0.5, 1.5],
      ];

      const arraylistOT = ["1.5", "2", "3"];

      const arrayLength = 9;
      // Set title with the Thai font
      // const makePage = Math.ceil(arrayLength / 6);
      let roundpage = 0;

      // for (let page = 0; page < makePage; page++) {
      // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      // doc.autoTable({
      //     html: table,
      //     styles: stylestable,
      //     margin: { top: 30 },
      // });

      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      doc.setFontSize(8);
      // doc.text(title, 171, 55, { angle: 90 });

      // const CheckMonth = 2;
      // const CheckYear = 2023;

      // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);
      // const daysInMonth = 30;
      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      const numRows = 7;
      const numCols = daysInMonth;
      const cellWidth = 6.5;
      const cellHeight = 3.5;
      const startX = 55; // Adjust the starting X-coordinate as needed
      const startY = 55; // Adjust the starting Y-coordinate as needed
      const borderWidth = 0.5; // Adjust the border width as needed

      // Function to draw a cell with borders
      const drawCell = (x, y, width, height) => {
        doc.rect(x, y, width, height);
      };

      // Function to draw the entire table
      // const drawTable = () => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight;
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };

      // const drawTable = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2);
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };
      // const additionalHeight = 3;

      const drawTable = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // Increase the height for the first row
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            // const adjustedCellY = i === 0 ? y : y * 2;

            if (i === 0) {
              drawCell(x, y, cellWidth, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidth, adjustedCellHeight);
            }
            // drawCell(x, y , cellWidth, adjustedCellHeight);
          }
        }
      };

      const numRowsLeftHead = 1;
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 50;
      const cellHeightLeftHead = 3.5;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed
      // const startYLeftHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthLeftHead = 0.5; // Adjust the border width as needed

      const drawTableLeftHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthLeftHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // if (i >= numRows - 3) {
            //     const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text("โอที " + cellText, x + 46, y + 2.5, { align: 'center' }); // Use the entire cellText
            //     }
            // }
            const cellText0 = arraylistOT[0].toString(); // Convert to string if needed
            const cellText1 = arraylistOT[1].toString(); // Convert to string if needed
            const cellText2 = arraylistOT[2].toString(); // Convert to string if needed

            doc.text("โอที " + cellText0, x + 46, y + 2.5 + 3.5 * 4, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText1, x + 46, y + 2.5 + 3.5 * 5, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText2, x + 46, y + 2.5 + 3.5 * 6, {
              align: "center",
            }); // Use the entire cellText
          }
        }
      };

      const numRowsNumHead = 7;
      const numColsNumHead = 1;
      const cellWidthNumHead = 8;
      const cellHeightNumHead = 3.5;
      const startXNumHead = 5; // Adjust the starting X-coordinate as needed
      // const startYNumHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthNumHead = 0.5; // Adjust the border width as needed

      // const drawTableNumHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsNumHead; j++) {
      //             const x = startXNumHead + j * cellWidthNumHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthNumHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

      //             }
      //         }
      //     }
      // };
      const drawTableNumHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthNumHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthNumHead, adjustedCellHeight);
          }
        }
      };

      const numRowsSpSalary = 7;
      const numColsSpSalary = 3;
      const cellWidthSpSalary = 10;
      const cellHeightSpSalary = 3.5;
      const borderWidthSpSalary = 0.5; // Adjust the border width as needed

      let startXSpSalary; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXSpSalary = 157;
      } else if (daysInMonth === 29) {
        startXSpSalary = 163.5;
      } else if (daysInMonth === 30) {
        startXSpSalary = 170;
      } else if (daysInMonth === 31) {
        startXSpSalary = 176.5;
      }

      const drawTableSpSalary = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            const x =
              startXSpSalary + j * cellWidthSpSalary + cellWidthSpSalary * 8;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthSpSalary, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);
            } else {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary,
                adjustedCellHeight
              );
            }
          }
        }
      };

      const numRowsMess = 7;
      const numColsMess = 1;
      const cellWidthMess = 25;
      const cellHeightMess = 3.5;
      let startXMess; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXMess = 247;
      } else if (daysInMonth === 29) {
        startXMess = 253.5;
      } else if (daysInMonth === 30) {
        startXMess = 260;
      } else if (daysInMonth === 31) {
        startXMess = 266.5;
      }
      const borderWidthMess = 0.5;
      const drawTableMess = (tableNumber, arraylistOT) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);

            // Draw the cell
            // drawCell(x, y, cellWidthMess, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthMess, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidthMess, adjustedCellHeight);
            }

            // Add text below the last two cells
            // if (i >= numRows - 2) {
            //     const arrayIndex = i - (numRows - 2); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text(cellText, x, y + cellHeight * (arrayIndex + 1), { align: 'center' });
            //     }
            // }
          }
        }
      };

      // const drawTableOT = (tableNumber, arraylistOT) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let k = 0; k < arraylistOT.length; k++) {
      //             const x = startXMess; // Adjust the starting X-coordinate as needed
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2) + k * lineHeight;

      //             doc.text('โอที ' + arraylistOT[k], x, y, { align: 'left' });
      //         }
      //     }
      // };

      const drawTableOT = (arraylistOT) => {
        const startXOT = 10; // Adjust the starting X-coordinate for the OT text
        let startYOT = 10; // Adjust the starting Y-coordinate for the OT text
        const lineHeightOT = 10; // Adjust the vertical spacing between lines

        for (let k = 0; k < arraylistOT.length; k++) {
          doc.text("โอที " + arraylistOT[k], startXOT, startYOT);
          startYOT += lineHeightOT; // Adjust the vertical spacing if needed
        }
      };

      // Draw the table
      // drawTable();
      // for (let i = 0; i < arrayLength; i++) {

      //     drawTable(i);
      //     drawTableLeftHead(i);
      //     drawTableNumHead(i);
      //     drawTableSpSalary(i);
      //     drawTableMess(i);
      //     if ((i + 1) % 6 === 0 && i + 1 < arrayLength) {
      //         doc.addPage(); // Add a new page after every 6 iterations
      //     }
      // }

      // body table//////////////////////////////////////////////////////////////////////////////////////////////////////

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;

      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 262;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 268.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 275;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 281.5;
      }
      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };

      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };
      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            const x =
              startXSpSalary + j * cellWidthSpSalary + cellWidthSpSalary * 8;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 2; j++) {
            const x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
          }
        }
      };

      const drawTableMessTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthMess, cellHeightTop);
          }
        }
      };
      const verticalDistance = 24.7 + cellHeight; // Set your desired vertical distance

      // const drawArrayText = (dataArray) => {
      //     const arrayText = dataArray.map(row => row.join(' ')).join('\n');
      //     doc.text(arrayText, startX, startY, { align: 'left' });
      // };

      const calculateElementWidth = (element) => {
        const fontSize = doc.internal.getFontSize();
        const elementWidth =
          (element.toString().length * fontSize) / doc.internal.scaleFactor;
        return elementWidth;
      };

      // แสดงตารางวันทำงานธรรมดา
      const drawArrayText = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานธรรมดาช.ใ.
      const drawArrayTextAllTime = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.5 * 2;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            // const textToDraw = dataArray[i][j].toString();
            const textToDraw = newAllTimes[i][j].toString();

            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextSumWorkAddSalary = (
        dataArray,
        sumArray,
        filteredAddSalaryWorkplace
      ) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3;
          let currentY = startY + i * verticalDistance + addmove;

          const roundOfSalary =
            filteredAddSalaryWorkplace[i]?.roundOfSalary || ""; // Get roundOfSalary for the current index

          // Check roundOfSalary and display the appropriate text
          if (roundOfSalary === "monthly") {
            doc.text(
              filteredAddSalaryWorkplace[i].SpSalary,
              currentX + 2,
              3 + currentY,
              { align: "center" }
            );
          } else if (roundOfSalary === "daily") {
            // Calculate the product and convert it to a string
            const product = (
              sumArray[i] * filteredAddSalaryWorkplace[i].SpSalary
            ).toString();
            doc.text(product, currentX + 2, 3 + currentY + 3, {
              align: "center",
            });
          } else {
            // Handle other cases or set default text
            doc.text("N/A", currentX + 2, 3 + currentY, { align: "center" });
          }
        }
      };

      // const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
      //     const currentX = startX + columnIndex * cellWidth;
      //     const currentY = startY + 3.7 + rowIndex * verticalDistance;

      //     // Set color based on holidayList and allDayOff
      //     const currentNumber = resultArray[rowIndex];
      //     const isHighlighted = holidayList.includes(currentNumber) || allDayOff.includes(currentNumber);

      //     // Draw a colored rectangle for each column
      //     if (isHighlighted) {
      //         doc.setFillColor(255, 0, 0); // Set your desired color
      //         doc.rect(currentX, currentY, cellWidth, cellHeight, 'F');
      //     }

      //     // Draw the text on top of the colored rectangle
      //     for (let i = 0; i < dataArray.length; i++) {
      //         const textToDraw = dataArray[i].toString();
      //         const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

      //         if (textToDraw.length > 3) {
      //             doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
      //         } else {
      //             doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
      //         }
      //     }
      // };

      const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
        const currentX = startX + columnIndex * cellWidth;
        const currentY = startY + 3.7 + rowIndex * verticalDistance;

        // Set color based on holidayList and allDayOff
        const currentNumber = resultArray[columnIndex];
        const isHighlighted =
          holidayList.includes(currentNumber) ||
          allDayOff.includes(currentNumber);

        // Draw a colored rectangle for each column
        if (isHighlighted) {
          doc.setFillColor(255, 255, 0); // Set your desired color
          doc.rect(
            currentX,
            currentY - cellHeight,
            cellWidth,
            cellHeight * 8,
            "F"
          );
        }

        // Draw the text on top of the colored rectangle
        const textToDraw = dataArray[0].toString();
        const alignment =
          textToDraw.length > 3
            ? { align: "left", angle: 90, xOffset: 5 }
            : { align: "left" };

        if (textToDraw.length > 3) {
          doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
        } else {
          doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
        }
      };

      // const squareColor2 = [255, 255, 190]; // Red

      // doc.setFillColor(...squareColor2);

      // // Draw a square with the specified size and color
      // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

      // for (let i = 0; i < resultArray.length; i++) {
      //     const currentNumber = resultArray[i];

      //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
      //         // Set loop position color
      //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
      //     } else {
      //         // Set default color or do nothing
      //     }
      // }

      const drawArrayTextOT = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 + cellHeight * 2;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              6 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดธรรมดา
      const drawArrayTextHoli = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 4;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              4 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดนักขัตฤกษ์
      const drawArrayTextHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 5;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              5 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextOTHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 * 6;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              5 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextAddSalary = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 5;
          let currentY = startY + i * verticalDistance + addmove;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(dataArray[i][j].toString(), currentX + 2, 3 + currentY, {
              align: "left",
            });
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      // const drawArrayTextSumWork = (dataArray, sumArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3;
      //         let currentY = startY + i * verticalDistance;
      //         doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(sumArray[i].toString() * countalldaywork, currentX + 2, 3 + currentY +3, { align: 'center' });
      //     }
      // };

      const addmove = 3;
      // ผลรวมวันทำงานวันธรรรมดา
      const drawArrayTextSumWork = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 8;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (sumArray[i] * countalldaywork).toString();

          doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 11;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

          const position = filteredAddSalaryWorkplace.findIndex(
            (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
          );

          doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          doc.text(product, currentX + 2, 3 + currentY + 3, {
            align: "center",
          });
        }
      };
      // ผลรวมวันทำงานวันหยุด
      const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 9;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoli[i] *
            (1.5 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoli[i].toString(), currentX + 2, 6.5 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // นับเลขหัวตาราง

      const drawArrayNumHead = (dataArray, indexArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXNumHead + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            indexArray[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(indexArray[i].toString(), currentX + 2, currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์

      const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayHoliday[i].toString(),
            currentX + 2,
            10.5 + currentY,
            { align: "center" }
          );
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };
      // รวมช.ม.ทำงาน1.5
      const drawArrayTextSumWorkHoliday1q5 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoliday[i].toString(), currentX + 2, 14 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // รวมช.ม.ทำงาน2
      const drawArrayTextSumWorkHoliday2 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayHoliday[i].toString(),
            currentX + 2,
            17.5 + currentY,
            { align: "center" }
          );
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // รวมช.ม.ทำงาน3
      const drawArrayTextSumWorkHoliday3 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoliday[i].toString(), currentX + 2, 21 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT
      const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 4;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayOTHoliday[i] *
            (3 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayOTHoliday[i].toString(),
            currentX + 2,
            3 + currentY,
            { align: "center" }
          );
          doc.text(product, currentX + 2, 3 + currentY + 3, {
            align: "center",
          });
        }
      };

      // const drawArrayTextAddSalary = (dataArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const position = filteredAddSalaryWorkplace.findIndex(
      //                 (salaryItem) => salaryItem.name === item.name
      //             );

      //             // const product = (sumArray[i] * countalldaywork).toString();

      //             // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
      //             const x = position !== -1 ? position : 0;

      //             const text = `${item.SpSalary}`;
      //             doc.text(text, currentX + 2 + (cellWidthSpSalary * x), 3 + currentY + i * verticalDistance, { align: 'center' });
      //             // currentX += cellWidthSpSalary;
      //         }
      //     }
      // };

      // const drawArrayTextSumWorkTest = (dataArray, sumArraySumarrayAllHoloday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY + i * verticalDistance + addmove;

      //         // Calculate the product and convert it to a string
      //         doc.text(sumArraySumarrayAllHoloday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //     }
      // };

      // sumArrayHoliday
      // sumArrayHoli
      // sumArray

      // const drawArrayTextAddSalary2 = (dataArray, filteredAddSalaryWorkplace, sumArraySumarrayAllHoloday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY + addmove;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const salaryItem = filteredAddSalaryWorkplace.find(salary => salary.name === item.name);

      //             if (salaryItem) {
      //                 // If roundOfSalary is "daily", multiply SpSalary by the corresponding value in sumArraySumarrayAllHoloday
      //                 // If roundOfSalary is "monthly", keep SpSalary as is
      //                 const adjustedSpSalary = salaryItem.roundOfSalary === 'daily' ?
      //                     salaryItem.SpSalary * sumArraySumarrayAllHoloday[i] :
      //                     salaryItem.SpSalary;

      //                 const text = `${adjustedSpSalary}`;
      //                 doc.text(text, currentX + 2, 3 + currentY + i * verticalDistance, { align: 'center' });
      //             }

      //             currentX += cellWidthSpSalary;
      //         }
      //     }
      // };

      // Use drawArrayTextAddSalary2 with the appropriate slices

      const drawArrayTextName = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 20;
          let currentY = startY + i * verticalDistance;

          for (let j = 0; j < dataArray[i].length; j++) {
            let xAdjustment = 0;
            let yAdjustment = 0;

            if (j === 0) {
              xAdjustment = -20;
            }
            if (j === 1) {
              xAdjustment = +10;
              yAdjustment = -3.5;
            }
            if (j === 2) {
              xAdjustment = +15;
              // yAdjustment = -3.5;
            }
            if (j === 3) {
              xAdjustment = +15;
              // yAdjustment = -3.5;
            }

            if (j === 4) {
              yAdjustment = 10.5;
            }
            doc.text(
              dataArray[i][j].toString(),
              // currentX + (j === 1 ? 0 : -10 || j === 0 ? -8 : 0 || j === 2 ? 5 : 0),  // Adjust the X-coordinate for the first row
              // 3 + currentY + (j === 2 ? -3.5 : 0 || j === 3 ? -3.5 : 0),  // Adjust the Y-coordinate for the second row
              currentX + xAdjustment, // Adjust the X-coordinate for the first row
              yAdjustment + currentY + 3, // Adjust the Y-coordinate for the second row
              { align: "left" }
            );
            currentY += 3.5;
          }
        }
      };

      // doc.addPage();
      // const lineHeight = 10;

      // const drawArray = (array, startY) => {
      //     for (let i = 0; i < array.length; i++) {
      //         if (i === 0) {
      //             const text = array[i].join(' ');
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         } else {
      //             const text = '(' + array[i].join(')') + '(';
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         }
      //     }
      // };

      // drawArray(arraylistNameEmp, startY);

      // drawArrayText(arraytest);
      // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {

      //     const title = ' ใบลงเวลาการปฏิบัติงาน';

      //     doc.setFont('THSarabunNew');
      //     doc.setFontSize(16);
      //     const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const pageWidth = doc.internal.pageSize.getWidth();
      //     const titleX = (pageWidth - titleWidth) / 2;
      //     doc.text(title, titleX, 10);

      //     // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

      //     doc.text(title, titleX, 30, { angle: 90 });

      //     const subTitle = workMonth; // Replace with your desired subtitle text
      //     doc.setFontSize(12); // You can adjust the font size for the subtitle
      //     const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const subTitleX = (pageWidth - subTitleWidth) / 2;
      //     // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      //     // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      //     // doc.autoTable({
      //     //     html: table,
      //     //     styles: stylestable,
      //     //     margin: { top: 30 },
      //     // });
      //     doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      //     // const CheckMonth = 2;
      //     // const CheckYear = 2023;

      //     // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

      //     // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      //     doc.setFontSize(8);
      //     doc.text(title, 171, 55, { angle: 90 });

      //     const pageStartIndex = dataarray;
      //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);

      //     for (let i = 0; i < 6; i++) {
      //         drawTableTop();
      //         drawTableLeftHeadTop();
      //         drawTableNumHeadTop();
      //         drawTableSpSalaryTop();
      //         drawTableMessTop();

      //         // drawTable(i);
      //         drawTableLeftHead(i);
      //         drawTableNumHead(i);
      //         drawTableSpSalary(i);
      //         drawTableMess(i);
      //         // roundpage++
      //     }
      //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
      //     doc.addPage();
      // }
      const title = "บริษัท โอวาท โปร แอนด์ ควิก จำกัด";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = "";

      const alldayworkHoliday = "รวมชั่วโมงทำงาน";
      const countalldayworkHoliday = "";
      const workOt = "1.5";
      const workOt2 = "2";
      const workOt3 = "3";

      // if (daysInMonth === 28) {
      //     startXMess = 245.5;
      // } else if (daysInMonth === 29) {
      //     startXMess = 249.5;
      // } else if (daysInMonth === 30) {
      //     startXMess = 253.75;
      // } else if (daysInMonth === 31) {
      //     startXMess = 257.75;
      // };
      const countalldayworkX = "340";
      const countalldayworkY = "340";

      const startDay = 21;
      // Create an array from startDay to daysInMonth
      const firstPart = Array.from(
        { length: daysInMonth - startDay + 1 },
        (_, index) => startDay + index
      );

      // Create an array from 1 to 20
      const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

      // Concatenate the two arrays
      const resultArray = [...firstPart, ...secondPart];

      const spaceWidth = 10;

      const makePage = Math.ceil(arrayWorkNormalDay.length / 5);

      for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {
        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

        // doc.text(title, titleX, 30, { angle: 90 });

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20); // Adjust the vertical position as needed

        // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

        // doc.autoTable({
        //     html: table,
        //     styles: stylestable,
        //     margin: { top: 30 },
        // });
        function getDaysInMonth(month, year) {
          // Months are 0-based, so we subtract 1 from the provided month
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          return lastDayOfMonth;
        }

        // const CheckMonth = 2;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
        doc.setFontSize(12);
        // doc.text(title, 171, 55, { angle: 90 });

        // const CheckMonth = 3;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // workplaceDataListAddSalary.map(item => item.SpSalary);
        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);
        doc.setFontSize(8);

        const pageStartIndex = pageIndex * 5;
        const pageEndIndex = Math.min((pageIndex + 1) * 5, arraytest.length);

        const squareColor2 = [255, 255, 190]; // Red

        doc.setFillColor(...squareColor2);

        // Draw a square with the specified size and color
        // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

        // for (let i = 0; i < resultArray.length; i++) {
        //     const currentNumber = resultArray[i];

        //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
        //         // Set loop position color
        //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
        //     } else {
        //         // Set default color or do nothing
        //     }
        // }

        // for (let i = pageStartIndex; i < pageEndIndex; i++) {
        //     const rowData = arrayWorkNormalDay[i];
        //     const color = i % 2 === 0 ? [240, 240, 100] : [255, 255, 255]; // Alternate row colors

        //     drawArrayTextWithColor(rowData, color, i - pageStartIndex);

        // }

        const pageStartIndexName = pageIndex * 5;
        const pageEndIndexName = Math.min(
          (pageIndex + 1) * 5,
          arrayWorkNormalDay.length
        );
        drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

        const squareColor = [255, 255, 0]; // Red
        doc.setFillColor(...squareColor);

        for (let i = 0; i < resultArray.length; i++) {
          const currentNumber = resultArray[i];

          if (
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber)
          ) {
            // Set loop position color
            doc.rect(
              startX + i * cellWidth,
              startYTop,
              cellWidth - 0.2,
              cellHeightTop,
              "F"
            );
          } else {
            // Set default color or do nothing
          }
        }

        for (let i = 0; i < resultArray.length; i++) {
          const x = startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        doc.text("ลำดับ", startXNumHead + 2, cellHeightTop + startYTop - 2);
        doc.text(
          "ชื่อ - นามสกุล",
          startXLeftHead + 10,
          cellHeightTop + startYTop - 2
        );

        doc.setFontSize(12);
        // let startXHeadTable; // Declare startXSpSalary before using it

        // if (daysInMonth === 28) {
        //     startXHeadTable = 0;
        // } else if (daysInMonth === 29) {
        //     startXHeadTable = 3;
        // } else if (daysInMonth === 30) {
        //     startXHeadTable = 6;
        // } else if (daysInMonth === 31) {
        //     startXHeadTable = 9;
        // };
        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2); // Adjust the vertical position as needed
        // doc.text(period, (startXSpSalary - 10), startYTop - 2);
        doc.setFontSize(8);

        // doc.text('โอที', startXSpSalary + (cellWidthSpSalary * 2) + 3, startYTop + 3);
        // doc.text('สวัสดีการ', startXSpSalary + (cellWidthSpSalary * 5) + 3, startYTop + 3);

        // doc.text('หักประกันสังคม 5%', startXMess - 5, cellHeightTop + startYTop - 1, { angle: 90 });

        doc.text("หมายเหตุ", startXMess + 3, cellHeightTop + startYTop - 2);

        // startXSpSalary + j * cellWidthSpSalary;
        // const y = startYTop

        for (let i = 0; i < 5; i++) {
          const dataIdx = pageIndex * 5 + i;
          if (dataIdx < arrayWorkNormalDay.length) {
            // Set the color of the square (RGB values)
            const squareColor = [255, 255, 0]; // Red

            // Set the position where you want to place the square
            const xPosition = 165.5;
            const yPosition = 30;

            // Set the fill color
            doc.setFillColor(...squareColor);

            // Draw a square with the specified size and color
            doc.rect(
              startXSpSalary + cellWidthSpSalary * 8,
              startYTop,
              cellWidthSpSalary * numColsSpSalary - 0.2,
              cellHeightTop,
              "F"
            );

            doc.text(
              alldaywork + " " + countalldaywork,
              5 + startXSpSalary + cellWidthSpSalary * 8,
              54.8,
              { angle: 90 }
            );
            doc.text(
              alldayworkHoliday + " " + countalldayworkHoliday,
              5 + startXSpSalary + cellWidthSpSalary * 9,
              54.8,
              { angle: 90 }
            );

            doc.text(
              "รวมชั่วโมงโอทีวันหยุด",
              3 + startXSpSalary + cellWidthSpSalary * 10,
              54.8,
              { angle: 90 }
            );
            // doc.text('รวมชั่วโมงโอที' + ' ' + workOt2 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 10), 54.8, { angle: 90 });

            // doc.text('วันนักขัตฤกษ์' + ' ' + workOt2 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });

            // for (let i = 0; i < workplaceDataListAddSalary.length; i++) {
            //     let currentX = startXSpSalary + 5 + (cellWidthSpSalary * 5) + (i * cellWidthSpSalary);
            //     let currentY = startY + verticalDistance + addmove;

            //     const item = workplaceDataListAddSalary[i];

            //     // Display the name and SpSalary
            //     doc.text(`${item.name}`, currentX + 2, 54.8, { align: 'center', angle: 90 });
            //     doc.text(`${item.SpSalary} .-`, currentX + 5, 54.8, { align: 'center', angle: 90 });

            // }
            // doc.text((340 * workOt2) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });

            // doc.text('โอที' + ' ' + workOt + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });
            // doc.text((340 * workOt) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });

            // doc.text('โอที' + ' ' + workOt3 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });
            // doc.text((340 * workOt3) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });

            // doc.text(filteredAddSalaryWorkplace, 171, 54, { angle: 90 });
            // filteredAddSalaryWorkplace.forEach((item, index) => {
            //     const NameSp = `${item.name} ${item.SpSalary}`;
            //     let roundOfSalaryText = '';

            //     if (item.roundOfSalary === 'monthly') {
            //         roundOfSalaryText = 'เดือน';
            //     } else if (item.roundOfSalary === 'daily') {
            //         roundOfSalaryText = 'วัน';
            //     } doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            //     doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            // });

            drawTableTop();
            drawTableTopHead();
            drawTableLeftHeadTop();
            drawTableNumHeadTop();
            drawTableSpSalaryTop();
            // drawTableSpSalaryHeadTop();
            // drawTableMessTop();

            // drawTableOT();
            // drawTableOT(arraylistOT);

            // drawTableOT(arraylistOT);

            // for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const rowData = arrayWorkNormalDay[i];

            // Draw text with color for each column
            for (let j = 0; j < resultArray.length; j++) {
              drawArrayTextWithColor([rowData[j]], j, i);
            }
            // }
            drawTable(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
            drawTableLeftHead(
              i,
              arrayWorkNormalDay.slice(dataIdx, dataIdx + 1)
            );
            drawTableNumHead(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
            drawTableSpSalary(
              i,
              arrayWorkNormalDay.slice(dataIdx, dataIdx + 1)
            );

          }
        }

        drawArrayTextAllTime(arrayAllTime.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));
        // 1.5
        drawArrayTextHoli(newAllTimes2.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoli(newOtTimes.slice(pageStartIndex, pageEndIndex));

        // 2
        drawArrayTextHoliday(newAllTimes3.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoliday(newOtTimes2.slice(pageStartIndex, pageEndIndex));
        // 3
        drawArrayTextOTHoliday(newOtTimes3.slice(pageStartIndex, pageEndIndex));

        drawArrayNumHead(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          indexArray.slice(pageStartIndex, pageEndIndex)
        );
        //วันเต็ม
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        //วันหารชั่วโมง+สักอย่าง
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArraySumarrayAllHolioday.slice(pageStartIndex, pageEndIndex));

        //วันหารชั่วโมง //วันเต็มทั้งหมด
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), dividedArray.slice(pageStartIndex, pageEndIndex));
        // countDay
        drawArrayTextSumWork(
          arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex),
          countDay.slice(pageStartIndex, pageEndIndex)
        );

        // drawArrayTextSumWorkOT(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
        // // รวมช.ม.ที่งานไม่รวมOT
        // drawArrayTextSumWorkHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex), sumArrayAllTime.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkHoli(
          arrayWorkHoli.slice(pageStartIndex, pageEndIndex),
          sumArrayAllHourWork.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayTextSumWorkHoliday(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTAllTime.slice(pageStartIndex, pageEndIndex)
        );

        // 1.5
        // drawArrayTextSumWorkHoliday1q5(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumHoliAllTime.slice(pageStartIndex, pageEndIndex));
        // sumArrayTotal
        drawArrayTextSumWorkHoliday1q5(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayTotal.slice(pageStartIndex, pageEndIndex)
        );

        // 2
        // drawArrayTextSumWorkHoliday2(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayHoliday.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkHoliday2(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayHoliday.slice(pageStartIndex, pageEndIndex)
        );

        // 3
        drawArrayTextSumWorkHoliday3(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex)
        );
        // drawArrayTextSumWorkOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex));

        // resultArraySumAddSalary
        // drawArrayTextAddSalary(resultArraySumAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextSumWorkAddSalary(filteredAddSalaryWorkplace.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextSumWorkTest(filteredAddSalaryWorkplace.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextSumWorkTest(sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // สวัสดิการ
        // drawArrayTextSumWorkTest(sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex), sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextAddSalary(arraytest.slice(pageStartIndex, pageEndIndex), extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayText(arraytest, pageIndex * 6, Math.min((pageIndex + 1) * 6, arraytest.length));

        // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {
        //     const pageStartIndex = dataarray;
        //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);
        //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
        // }

        // for (let pageIndex = 0; pageIndex < makePage; pageIndex++)
        const formattedDate = workDate.toLocaleDateString("en-GB"); // Use 'en-GB' to get the "day/month/year" format

        doc.text(
          codePage +
          "" +
          formattedDate +
          "" +
          (pageIndex + 1) +
          " of " +
          makePage,
          250,
          210
        );

        if (pageIndex < makePage - 1) {
          doc.addPage();
        }
        // doc.text('pageStartIndex', 10 + 10, 10 + 10 - 2);

        // doc.addPage();
      }
      // If an error occurs, throw an exception
      // doc.save('your_table.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      // Display an alert with the error message
      alert(`Error: ${error.message}`);

      // Optionally, log the error to the console
      console.error(error);

      // If you want to prevent the page from reloading, you can return or throw the error
      // throw error;
      // return;
    }
  };

  //////////////////////////////////////////////////

  const generatePDFTest123Old = (event) => {
    event.preventDefault();
    try {
      // Your code here
      // handleEmployeeFilter();
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const table = tableRef.current;
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };

      const arraytestSpSalary = [
        [
          "",
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          0.5,
        ],
        [2, 2, 2, 2, 2, "", 2, "", 2],
        [2, "", 2, 2, "", 2, 3, "", 3, 3],
        [3, 3, 3, "", 3, 3, 3, 3],
        [3, "", 3, "", 3, 3, 3, 1, "", 1],
        [3, 3, "", 1, 1, "", 1, 3, 3],
        [3, 3, "", 3, "", 3, 3, 3, 3, "", 1, "", 1, 0.5, 0.5, 1.5],
      ];

      const arraylistOT = ["1.5", "2", "3"];

      // const arrayLength = arraylistNameEmp.length;
      const arrayLength = 9;
      // Set title with the Thai font
      // const makePage = Math.ceil(arrayLength / 6);
      let roundpage = 0;

      // for (let page = 0; page < makePage; page++) {
      // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      // doc.autoTable({
      //     html: table,
      //     styles: stylestable,
      //     margin: { top: 30 },
      // });

      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      doc.setFontSize(8);
      // doc.text(title, 171, 55, { angle: 90 });

      // const CheckMonth = 2;
      // const CheckYear = 2023;

      // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);
      // const daysInMonth = 30;
      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      const numRows = 7;
      const numCols = daysInMonth;
      const cellWidth = 4.125;
      const cellHeight = 3.5;
      const startX = 35; // Adjust the starting X-coordinate as needed
      const startY = 55; // Adjust the starting Y-coordinate as needed
      const borderWidth = 0.5; // Adjust the border width as needed

      // Function to draw a cell with borders
      const drawCell = (x, y, width, height) => {
        doc.rect(x, y, width, height);
      };

      // Function to draw the entire table
      // const drawTable = () => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight;
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };

      // const drawTable = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2);
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };
      // const additionalHeight = 3;

      const drawTable = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // Increase the height for the first row
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            // const adjustedCellY = i === 0 ? y : y * 2;

            if (i === 0) {
              drawCell(x, y, cellWidth, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidth, adjustedCellHeight);
            }
            // drawCell(x, y , cellWidth, adjustedCellHeight);
          }
        }
      };

      const drawArrayNumHead = (dataArray, indexArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXNumHead + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            indexArray[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(indexArray[i].toString(), currentX + 2, currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      const numRowsLeftHead = 7;
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 30;
      const cellHeightLeftHead = 3.5;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed
      // const startYLeftHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthLeftHead = 0.5; // Adjust the border width as needed

      // 02/04/2024
      // const drawTableLeftHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsLeftHead; j++) {
      //             const x = startXLeftHead + j * cellWidthLeftHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthLeftHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

      //             }

      //             if (i >= numRows - 3) {
      //                 const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
      //                 if (arraylistOT[arrayIndex]) {
      //                     const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
      //                     doc.text("โอที " + cellText, x + 26, y - 1, { align: 'center' }); // Use the entire cellText
      //                 }
      //             }
      //         }
      //     }
      // };

      const drawTableLeftHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthLeftHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // if (i >= numRows - 3) {
            //     const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text("โอที " + cellText, x + 46, y + 2.5, { align: 'center' }); // Use the entire cellText
            //     }
            // }
            const cellText0 = arraylistOT[0].toString(); // Convert to string if needed
            const cellText1 = arraylistOT[1].toString(); // Convert to string if needed
            const cellText2 = arraylistOT[2].toString(); // Convert to string if needed

            doc.text("โอที " + cellText0, x + 26, y - 1 + 3.5 * 5, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText1, x + 26, y - 1 + 3.5 * 6, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText2, x + 26, y - 1 + 3.5 * 7, {
              align: "center",
            }); // Use the entire cellText
          }
        }
      };

      const numRowsNumHead = 7;
      const numColsNumHead = 1;
      const cellWidthNumHead = 8;
      const cellHeightNumHead = 3.5;
      const startXNumHead = 5; // Adjust the starting X-coordinate as needed
      // const startYNumHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthNumHead = 0.5; // Adjust the border width as needed

      //02/04/2024
      // const drawTableNumHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsNumHead; j++) {
      //             const x = startXNumHead + j * cellWidthNumHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthNumHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

      //             }
      //         }
      //     }
      // };

      const drawTableNumHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthNumHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthNumHead, adjustedCellHeight);
          }
        }
      };

      const numRowsSpSalary = 7;
      const numColsSpSalary = 12;
      const cellWidthSpSalary = 10;
      const cellHeightSpSalary = 3.5;
      const borderWidthSpSalary = 0.5; // Adjust the border width as needed

      let startXSpSalary; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXSpSalary = 150.5;
      } else if (daysInMonth === 29) {
        startXSpSalary = 154.5;
      } else if (daysInMonth === 30) {
        startXSpSalary = 158.75;
      } else if (daysInMonth === 31) {
        startXSpSalary = 162.75;
      }

      const drawTableSpSalary = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (j > 2) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }

            if (i === 0 && j < 2) {
              drawCell(x, y, cellWidthSpSalary, cellHeight * 2);
            } else if (i === 0 && j === 2) {
              drawCell(x, y, cellWidthSpSalary + 5, adjustedCellHeight);
            } else if (j === 2) {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary + 5,
                adjustedCellHeight
              );
            } else if (i === 0 && j > 2) {
              drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);
            } else {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary,
                adjustedCellHeight
              );
            }
          }
        }
      };

      const numRowsMess = 7;
      const numColsMess = 1;
      const cellWidthMess = 15;
      const cellHeightMess = 3.5;
      let startXMess; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXMess = 260.5;
      } else if (daysInMonth === 29) {
        startXMess = 264.5;
      } else if (daysInMonth === 30) {
        startXMess = 268.75;
      } else if (daysInMonth === 31) {
        startXMess = 272.75;
      }
      const borderWidthMess = 0.5;
      const drawTableMess = (tableNumber, arraylistOT) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);

            // Draw the cell
            // drawCell(x, y, cellWidthMess, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthMess, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidthMess, adjustedCellHeight);
            }

            // Add text below the last two cells
            // if (i >= numRows - 2) {
            //     const arrayIndex = i - (numRows - 2); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text(cellText, x, y + cellHeight * (arrayIndex + 1), { align: 'center' });
            //     }
            // }
          }
        }
      };

      // const drawTableOT = (tableNumber, arraylistOT) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let k = 0; k < arraylistOT.length; k++) {
      //             const x = startXMess; // Adjust the starting X-coordinate as needed
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2) + k * lineHeight;

      //             doc.text('โอที ' + arraylistOT[k], x, y, { align: 'left' });
      //         }
      //     }
      // };

      const drawTableOT = (arraylistOT) => {
        const startXOT = 10; // Adjust the starting X-coordinate for the OT text
        let startYOT = 10; // Adjust the starting Y-coordinate for the OT text
        const lineHeightOT = 10; // Adjust the vertical spacing between lines

        for (let k = 0; k < arraylistOT.length; k++) {
          doc.text("โอที " + arraylistOT[k], startXOT, startYOT);
          startYOT += lineHeightOT; // Adjust the vertical spacing if needed
        }
      };

      // Draw the table
      // drawTable();
      // for (let i = 0; i < arrayLength; i++) {

      //     drawTable(i);
      //     drawTableLeftHead(i);
      //     drawTableNumHead(i);
      //     drawTableSpSalary(i);
      //     drawTableMess(i);
      //     if ((i + 1) % 6 === 0 && i + 1 < arrayLength) {
      //         doc.addPage(); // Add a new page after every 6 iterations
      //     }
      // }

      // body table//////////////////////////////////////////////////////////////////////////////////////////////////////

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;
      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 270.5;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 274.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 278.5;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 282.5;
      }

      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };
      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };
      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * cellHeightTop;

            if (j > 2) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }

            if (j == 2) {
              drawCell(x, y, cellWidthSpSalary + 5, cellHeightTop);
            } else {
              drawCell(x, y, cellWidthSpSalary, cellHeightTop);
            }
            // drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 2; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            // drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            if (j > 1) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }
            if (j == 1) {
              drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary + 5, 6);
            } else {
              drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            }
          }
        }
      };

      const drawTableMessTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthMess, cellHeightTop);
          }
        }
      };
      const verticalDistance = 24.7 + cellHeight; // Set your desired vertical distance

      // const drawArrayText = (dataArray) => {
      //     const arrayText = dataArray.map(row => row.join(' ')).join('\n');
      //     doc.text(arrayText, startX, startY, { align: 'left' });
      // };

      const calculateElementWidth = (element) => {
        const fontSize = doc.internal.getFontSize();
        const elementWidth =
          (element.toString().length * fontSize) / doc.internal.scaleFactor;
        return elementWidth;
      };

      // แสดงตารางวันทำงานธรรมดา
      const drawArrayText = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextAfternoon = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7 * 1.8;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextNight = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7 * 2.8;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
        const currentX = startX + columnIndex * cellWidth;
        const currentY = startY + 3.7 + rowIndex * verticalDistance;

        // Set color based on holidayList and allDayOff
        const currentNumber = resultArray[columnIndex];
        const isHighlighted =
          holidayList.includes(currentNumber) ||
          allDayOff.includes(currentNumber);

        // Draw a colored rectangle for each column
        if (isHighlighted) {
          doc.setFillColor(255, 255, 0); // Set your desired color
          doc.rect(
            currentX,
            currentY - cellHeight,
            cellWidth,
            cellHeight * 8,
            "F"
          );
        }

        // Draw the text on top of the colored rectangle
        const textToDraw = dataArray[0].toString();
        const alignment =
          textToDraw.length > 3
            ? { align: "left", angle: 90, xOffset: 5 }
            : { align: "left" };

        // if (textToDraw.length > 3) {
        //     doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
        // } else {
        //     doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
        // }
      };

      // const squareColor2 = [255, 255, 190]; // Red

      // doc.setFillColor(...squareColor2);

      // // Draw a square with the specified size and color
      // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

      // for (let i = 0; i < resultArray.length; i++) {
      //     const currentNumber = resultArray[i];

      //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
      //         // Set loop position color
      //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
      //     } else {
      //         // Set default color or do nothing
      //     }
      // }

      const drawArrayTextOT = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          // let currentY = startY + 3 + cellHeight;
          let currentY = startY + 3 * 4;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              4 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดธรรมดา
      const drawArrayTextHoli = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 3;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              4 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดนักขัตฤกษ์
      const drawArrayTextHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 5;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              5 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextOTHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 * 6;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              5 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // const drawArrayTextSumWork = (dataArray, sumArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3;
      //         let currentY = startY + i * verticalDistance;
      //         doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(sumArray[i].toString() * countalldaywork, currentX + 2, 3 + currentY +3, { align: 'center' });
      //     }
      // };

      const addmove = 3;
      // ผลรวมวันทำงานวันธรรรมดา
      const drawArrayTextSumWork = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArray[i] * countalldaywork).toString();
          // doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });

          // const product = (countDayWork[i] * countalldaywork).toString();

          doc.text(countDayWork[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });

          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
          doc.text(
            amountCountDayWork[i].toString(),
            currentX + 2,
            3 + currentY + 3,
            { align: "center" }
          );
        }
      };
      // 1.5
      const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

          // const product = (
          //   parseFloat(sumArrayOT[i]) *
          //   (workRateWorkplaceStage1 * (countalldaywork / 8))
          // ).toFixed(2);

          // const position = filteredAddSalaryWorkplace.findIndex(
          //   (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
          // );

          //   doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, {
          //     align: "center",
          //   });
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourOneFive[i].toString(), currentX + 2, 3 + currentY, {
          //   align: "center",
          // });
          // doc.text(
          //   amountOneFive[i].toString(),
          //   currentX + 2,
          //   3 + currentY + 3,
          //   {
          //     align: "center",
          //   }
          // );

          doc.text(
            `${amountOneFive[i].toString()} (${hourOneFive[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 4,
            {
              align: "center",
            }
          );
        }
      };
      // ผลรวมวันทำงานวันหยุด
      const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 1;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayHoli[i] * (1.5 * (countalldaywork / 8))).toString();
          const product = (sumArrayHoli[i] * specialDayRate[i]).toString();

          // responseDataAll

          doc.text(sumArrayHoli[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
          // doc.text(amountSpecialDay[i].toString(), currentX + 2, 3 + currentY + 3, { align: 'center' });
          // adjustedAmountSpecialDay
          doc.text(
            adjustedAmountSpecialDay[i].toString(),
            currentX + 2,
            3 + currentY + 3,
            { align: "center" }
          );
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์
      // 2 เท่า
      const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();
          // const product = (
          //   parseFloat(sumArrayHoliday[i]) *
          //   (workRateWorkplaceStage2 * (countalldaywork / 8))
          // ).toFixed(2);

          //   doc.text(sumArrayHoliday[i].toString(), currentX + 2, 3 + currentY, {
          //     align: "center",
          //   });
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourTwo[i].toString()`(`amountTwo[i].toString()`)`, currentX + 2, 3 + currentY+(3*4), {
          //   align: "center",
          // });
          // doc.text(amountTwo[i].toString(), currentX + 2, 3 + currentY + 3, {
          //   align: "center",
          // });
          doc.text(
            `${amountTwo[i].toString()} (${hourTwo[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 5,
            {
              align: "center",
            }
          );
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT 3เท่า
      // const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 4);
      //         let currentY = startY + i * verticalDistance + addmove;

      //         // Calculate the product and convert it to a string
      //         const product = (sumArrayOTHoliday[i] * (3 * (countalldaywork / 8))).toString();

      //         doc.text(sumArrayOTHoliday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(product.toFixed(2), currentX + 2, 3 + currentY + 3, { align: 'center' });
      //     }
      // };

      // 3 เท่า
      const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and format it to two decimal places
          // const product = (
          //   parseFloat(sumArrayOTHoliday[i]) *
          //   (workRateWorkplaceStage3 * (countalldaywork / 8))
          // ).toFixed(2);
          // Draw the sum and product, both formatted to two decimal places

          //   doc.text(
          //     parseFloat(sumArrayOTHoliday[i]).toFixed(2),
          //     currentX + 2,
          //     3 + currentY,
          //     { align: "center" }
          //   );
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourThree[i].toString(), currentX + 2, 3 + currentY, {
          //   align: "center",
          // });
          // doc.text(amountThree[i].toString(), currentX + 2, 3 + currentY + 3, {
          //   align: "center",
          // });
          doc.text(
            `${amountThree[i].toString()} (${hourThree[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 6,
            {
              align: "center",
            }
          );
        }
      };

      // const drawArrayTextAddSalary = (dataArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const position = filteredAddSalaryWorkplace.findIndex(
      //                 (salaryItem) => salaryItem.name === item.name
      //             );

      //             // const product = (sumArray[i] * countalldaywork).toString();

      //             // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
      //             const x = position !== -1 ? position : 0;

      //             const text = `${item.SpSalary}`;
      //             doc.text(text, currentX + 2 + (cellWidthSpSalary * x), 3 + currentY + i * verticalDistance, { align: 'center' });
      //             // currentX += cellWidthSpSalary;
      //         }
      //     }
      // };
      const drawArrayTextAddSalary = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 5;
          let currentY = startY + addmove;

          for (let j = 0; j < dataArray[i].length; j++) {
            const item = dataArray[i][j];

            // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
            const position = filteredAddSalaryWorkplace.findIndex(
              (salaryItem) => salaryItem.name === item.name
            );

            // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
            const x = position !== -1 ? position : 0;

            // If roundOfSalary is "daily", multiply SpSalary by the corresponding value in sumArray
            // If roundOfSalary is "monthly", keep SpSalary as is
            const adjustedSpSalary =
              item.roundOfSalary === "daily"
                ? item.SpSalary * sumArray[i]
                : item.SpSalary;

            const text = `${adjustedSpSalary}`;
            doc.text(
              text,
              currentX + 2 + cellWidthSpSalary * x,
              3 + currentY + i * verticalDistance,
              { align: "center" }
            );
            // currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextAddSalaryTestCount = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startXSpSalary + cellWidthSpSalary * 4;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();

            // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                { align: "center" }
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                { align: "center" }
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextAddSalaryTest = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startXSpSalary + cellWidthSpSalary * 4;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();

            // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                6 + currentY + i * verticalDistance,
                { align: "center" }
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                6 + currentY + i * verticalDistance,
                { align: "center" }
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextName = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 13;
          let currentY = startY + i * verticalDistance;

          for (let j = 0; j < dataArray[i].length; j++) {
            let xAdjustment = 0;
            let yAdjustment = 0;

            if (j === 0) {
              xAdjustment = -8;
            }
            if (j === 1) {
              xAdjustment = -8;
            }
            if (j === 2) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }
            if (j === 3) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }
            if (j === 4) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }

            if (j === 5) {
              yAdjustment = 7;
            }
            doc.text(
              dataArray[i][j].toString(),
              // currentX + (j === 1 ? 0 : -10 || j === 0 ? -8 : 0 || j === 2 ? 5 : 0),  // Adjust the X-coordinate for the first row
              // 3 + currentY + (j === 2 ? -3.5 : 0 || j === 3 ? -3.5 : 0),  // Adjust the Y-coordinate for the second row
              currentX + xAdjustment, // Adjust the X-coordinate for the first row
              yAdjustment + currentY + 3, // Adjust the Y-coordinate for the second row
              { align: "left" }
            );
            currentY += 3.5;
          }
        }
      };

      // doc.addPage();
      // const lineHeight = 10;

      // const drawArray = (array, startY) => {
      //     for (let i = 0; i < array.length; i++) {
      //         if (i === 0) {
      //             const text = array[i].join(' ');
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         } else {
      //             const text = '(' + array[i].join(')') + '(';
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         }
      //     }
      // };

      // drawArray(arraylistNameEmp, startY);

      // drawArrayText(arraytest);
      // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {

      //     const title = ' ใบลงเวลาการปฏิบัติงาน';

      //     doc.setFont('THSarabunNew');
      //     doc.setFontSize(16);
      //     const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const pageWidth = doc.internal.pageSize.getWidth();
      //     const titleX = (pageWidth - titleWidth) / 2;
      //     doc.text(title, titleX, 10);

      //     // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

      //     doc.text(title, titleX, 30, { angle: 90 });

      //     const subTitle = workMonth; // Replace with your desired subtitle text
      //     doc.setFontSize(12); // You can adjust the font size for the subtitle
      //     const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const subTitleX = (pageWidth - subTitleWidth) / 2;
      //     // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      //     // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      //     // doc.autoTable({
      //     //     html: table,
      //     //     styles: stylestable,
      //     //     margin: { top: 30 },
      //     // });
      //     doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      //     // const CheckMonth = 2;
      //     // const CheckYear = 2023;

      //     // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

      //     // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      //     doc.setFontSize(8);
      //     doc.text(title, 171, 55, { angle: 90 });

      //     const pageStartIndex = dataarray;
      //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);

      //     for (let i = 0; i < 6; i++) {
      //         drawTableTop();
      //         drawTableLeftHeadTop();
      //         drawTableNumHeadTop();
      //         drawTableSpSalaryTop();
      //         drawTableMessTop();

      //         // drawTable(i);
      //         drawTableLeftHead(i);
      //         drawTableNumHead(i);
      //         drawTableSpSalary(i);
      //         drawTableMess(i);
      //         // roundpage++
      //     }
      //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
      //     doc.addPage();
      // }
      const title = " ใบลงเวลาการปฏิบัติงาน";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = workplaceDataListWorkRate;

      const alldayworkHoliday = "วันหยุด";
      const countalldayworkHoliday = workplaceDataListWorkRate;
      const workOt = "1.5";
      const workOt2 = "2";
      const workOt3 = "3";
      // if (daysInMonth === 28) {
      //     startXMess = 245.5;
      // } else if (daysInMonth === 29) {
      //     startXMess = 249.5;
      // } else if (daysInMonth === 30) {
      //     startXMess = 253.75;
      // } else if (daysInMonth === 31) {
      //     startXMess = 257.75;
      // };
      const countalldayworkX = "340";
      const countalldayworkY = "340";

      const startDay = 21;
      // Create an array from startDay to daysInMonth
      const firstPart = Array.from(
        { length: daysInMonth - startDay + 1 },
        (_, index) => startDay + index
      );

      // Create an array from 1 to 20
      const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

      // Concatenate the two arrays
      const resultArray = [...firstPart, ...secondPart];

      const spaceWidth = 10;

      const makePage = Math.ceil(newAllTimes.length / 5);

      for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {
        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

        // doc.text(title, titleX, 30, { angle: 90 });

        // const subTitle = workMonth; // Replace with your desired subtitle text
        // doc.setFontSize(12); // You can adjust the font size for the subtitle
        // const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        // const subTitleX = (pageWidth - subTitleWidth) / 2;

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20); // Adjust the vertical position as needed

        // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

        // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

        // doc.autoTable({
        //     html: table,
        //     styles: stylestable,
        //     margin: { top: 30 },
        // });

        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);

        function getDaysInMonth(month, year) {
          // Months are 0-based, so we subtract 1 from the provided month
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          return lastDayOfMonth;
        }

        // const CheckMonth = 2;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
        doc.setFontSize(8);
        doc.text(title, 171, 55, { angle: 90 });

        // const CheckMonth = 3;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน ' + daysInMonth, 10, 10);

        const pageStartIndex = pageIndex * 5;
        const pageEndIndex = Math.min((pageIndex + 1) * 5, newAllTimes.length);

        const squareColor2 = [255, 255, 190]; // Red

        doc.setFillColor(...squareColor2);

        // Draw a square with the specified size and color
        // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

        // for (let i = 0; i < resultArray.length; i++) {
        //     const currentNumber = resultArray[i];

        //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
        //         // Set loop position color
        //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
        //     } else {
        //         // Set default color or do nothing
        //     }
        // }

        // for (let i = pageStartIndex; i < pageEndIndex; i++) {
        //     const rowData = arrayWorkNormalDayOld[i];
        //     const color = i % 2 === 0 ? [240, 240, 100] : [255, 255, 255]; // Alternate row colors

        //     drawArrayTextWithColor(rowData, color, i - pageStartIndex);

        // }

        const pageStartIndexName = pageIndex * 5;
        const pageEndIndexName = Math.min(
          (pageIndex + 1) * 5,
          newAllTimes.length
        );
        drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

        const squareColor = [255, 255, 0]; // Red
        doc.setFillColor(...squareColor);

        for (let i = 0; i < resultArray.length; i++) {
          const currentNumber = resultArray[i];

          if (
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber)
          ) {
            // Set loop position color
            doc.rect(
              startX + i * cellWidth,
              startYTop,
              cellWidth - 0.2,
              cellHeightTop,
              "F"
            );
          } else {
            // Set default color or do nothing
          }
        }

        for (let i = 0; i < resultArray.length; i++) {
          const x = startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        doc.text("ลำดับ", startXNumHead + 2, cellHeightTop + startYTop - 2);

        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2);

        doc.text(
          "ชื่อ - นามสกุล",
          startXLeftHead + 10,
          cellHeightTop + startYTop - 2
        );
        doc.text("วันหยุด", startXSpSalary + 11, startYTop + 3);
        doc.text(
          "โอที",
          startXSpSalary + cellWidthSpSalary * 2 + 3,
          startYTop + 3
        );
        doc.text(
          "สวัสดีการ",
          startXSpSalary + cellWidthSpSalary * 5 + 3,
          startYTop + 3
        );

        doc.text(
          "หักประกันสังคม 5%",
          startXMess - 5,
          cellHeightTop + startYTop - 1,
          { angle: 90 }
        );

        doc.text("หมายเหตุ", startXMess + 3, cellHeightTop + startYTop - 2);

        // startXSpSalary + j * cellWidthSpSalary;
        // const y = startYTop

        for (let i = 0; i < 5; i++) {
          const dataIdx = pageIndex * 5 + i;
          if (dataIdx < newAllTimes.length) {
            // Set the color of the square (RGB values)
            const squareColor = [255, 255, 0]; // Red

            // Set the position where you want to place the square
            const xPosition = 165.5;
            const yPosition = 30;

            // Set the fill color
            doc.setFillColor(...squareColor);

            // Draw a square with the specified size and color
            doc.rect(
              startXSpSalary,
              startYTop,
              cellWidthSpSalary * numColsSpSalary - 0.2 + 5,
              cellHeightTop,
              "F"
            );

            doc.text(
              alldaywork + " " + countalldaywork,
              5 + startXSpSalary,
              54.8,
              { angle: 90 }
            );
            doc.text(
              alldayworkHoliday + " " + countalldayworkHoliday,
              5 + startXSpSalary + cellWidthSpSalary,
              54.8,
              { angle: 90 }
            );
            // doc.text(
            //   "วันนักขัตฤกษ์" + " " + workRateWorkplaceStage2 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 2,
            //   54.8,
            //   { angle: 90 }
            // );
            doc.text(
              "เงินโอที",
              3 + startXSpSalary + cellWidthSpSalary * 2,
              54.8,
              { angle: 90 }
            );
            // doc.text(
            //   (workplaceDataListWorkRate * workRateWorkplaceStage2) / 8 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 2,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(
            //   "โอที" + " " + workRateWorkplaceStage1 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 3,
            //   54.8,
            //   { angle: 90 }
            // );
            // doc.text(
            //   (workplaceDataListWorkRate * workRateWorkplaceStage1) / 8 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 3,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(
            //   "โอที" + " " + workRateWorkplaceStage3 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 4,
            //   54.8,
            //   { angle: 90 }
            // );
            // doc.text(
            //   (workplaceDataListWorkRate / 8) * workRateWorkplaceStage3 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 4,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(filteredAddSalaryWorkplace, 171, 54, { angle: 90 });
            // filteredAddSalaryWorkplace.forEach((item, index) => {
            //     const NameSp = `${item.name} ${item.SpSalary}`;
            //     let roundOfSalaryText = '';

            //     if (item.roundOfSalary === 'monthly') {
            //         roundOfSalaryText = 'เดือน';
            //     } else if (item.roundOfSalary === 'daily') {
            //         roundOfSalaryText = 'วัน';
            //     } doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            //     doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            // });

            filteredAddSalaryWorkplace.sort((a, b) =>
              a.name.localeCompare(b.name, "th")
            );

            let uniqueSalaries = [];

            // Create a Map to keep track of the lowest SpSalary for each codeSpSalary
            let salaryMap = new Map();

            // Iterate over the sorted array and populate the salaryMap
            for (let item of filteredAddSalaryWorkplace) {
              const { codeSpSalary, SpSalary } = item;
              const currentSpSalary = parseFloat(SpSalary);
              if (
                !salaryMap.has(codeSpSalary) ||
                currentSpSalary < salaryMap.get(codeSpSalary).SpSalary
              ) {
                salaryMap.set(codeSpSalary, {
                  ...item,
                  SpSalary: currentSpSalary,
                });
              }
            }

            // Convert the Map values to an array
            uniqueSalaries = Array.from(salaryMap.values());

            uniqueSalaries.forEach((item, index) => {
              const cleanedName = item.name
                .replace(/\(ไม่คิดปกส.\)/g, "")
                .trim();
              const NameSp = `${cleanedName} ${item.SpSalary}`;
              const CodeSp = `${item.codeSpSalary}`;

              let roundOfSalaryText = "";

              if (item.roundOfSalary === "monthly") {
                roundOfSalaryText = "เดือน";
              } else if (item.roundOfSalary === "daily") {
                roundOfSalaryText = "วัน";
              }
              doc.text(
                CodeSp,
                9 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                38,
                { align: "center" }
              );
              doc.text(
                NameSp,
                9 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                54.8,
                { angle: 90 }
              );
              doc.text(
                "ต่อ " + roundOfSalaryText,
                12 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                54.8,
                { angle: 90 }
              );
            });

            drawTableTop();
            drawTableTopHead();
            drawTableLeftHeadTop();
            drawTableNumHeadTop();
            drawTableSpSalaryTop();
            drawTableSpSalaryHeadTop();
            // drawTableMessTop();

            // drawTableOT();
            // drawTableOT(arraylistOT);

            // drawTableOT(arraylistOT);

            // for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const rowData = newAllTimes[i];

            // Draw text with color for each column
            for (let j = 0; j < resultArray.length; j++) {
              drawArrayTextWithColor([rowData[j]], j, i);
            }
            // }

            drawTable(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableLeftHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableNumHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableSpSalary(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            // drawTableMess(i, newAllTimes.slice(dataIdx, dataIdx + 1));

            // drawArrayText(arraytest, dataIdx, dataIdx + 1);

            // drawArrayText(arraytest.slice(dataIdx, dataIdx + 1));
          }
        }

        // drawArrayText(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex));

        //20/06/2024 drawArrayText(dayWorks.slice(pageStartIndex, pageEndIndex));
        drawArrayText(
          finalUpdatedDayWorksWorkMorningAndSS.slice(
            pageStartIndex,
            pageEndIndex
          )
        );

        drawArrayTextAfternoon(
          finalUpdatedDayWorksWorkAfternoon.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayTextNight(
          finalUpdatedDayWorksWorkNight.slice(pageStartIndex, pageEndIndex)
        );

        //สวัสดิการ
        drawArrayTextAddSalaryTestCount(
          adjustedDailyExtractedDataAddSalaryCount.slice(
            pageStartIndex,
            pageEndIndex
          )
        );
        drawArrayTextAddSalaryTest(
          adjustedDailyExtractedDataAddSalary.slice(
            pageStartIndex,
            pageEndIndex
          )
        );

        //สวัสดิการ
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // drawArrayText(extractedDataAddSalary);

        // save17/06/2027
        // drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex));

        // 1.5
        drawArrayTextOT(newAllTimes2.slice(pageStartIndex, pageEndIndex));
        drawArrayTextOT(newOtTimes.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextOT(newOtTimes2.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoli(newOtTimes2.slice(pageStartIndex, pageEndIndex));

        // 2
        drawArrayTextHoliday(newAllTimes3.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoliday(newOtTimes2.slice(pageStartIndex, pageEndIndex));
        // 3
        drawArrayTextOTHoliday(newOtTimes3.slice(pageStartIndex, pageEndIndex));
        //
        // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

        // วันทำงาน
        // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOld.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextSumWork(newAllTimes.slice(pageStartIndex, pageEndIndex), countDayWork.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWork(
          newAllTimes.slice(pageStartIndex, pageEndIndex),
          amountCountDayWork.slice(pageStartIndex, pageEndIndex)
        );

        // ot 1.5
        // drawArrayTextSumWorkOT(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkOT(
          // newAllTimes.slice(pageStartIndex, pageEndIndex),
          sumArrayTotal.slice(pageStartIndex, pageEndIndex)
        );

        // วันหยุด เงินตรง
        drawArrayTextSumWorkHoli(
          arrayWorkHoli.slice(pageStartIndex, pageEndIndex),
          sumArrayHoli.slice(pageStartIndex, pageEndIndex)
        );
        // 2
        drawArrayTextSumWorkHoliday(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayHoliday.slice(pageStartIndex, pageEndIndex)
        );
        // 3
        drawArrayTextSumWorkOTHoliday(
          arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayNumHead(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          indexArray.slice(pageStartIndex, pageEndIndex)
        );

        // drawArrayTextAddSalary(arraytest.slice(pageStartIndex, pageEndIndex), extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayText(arraytest, pageIndex * 6, Math.min((pageIndex + 1) * 6, arraytest.length));

        // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {
        //     const pageStartIndex = dataarray;
        //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);
        //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
        // }

        doc.addPage();
      }
      // If an error occurs, throw an exception
      // doc.save('your_table.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      // Display an alert with the error message
      alert(`Error: ${error.message}`);

      // Optionally, log the error to the console
      console.error(error);

      // If you want to prevent the page from reloading, you can return or throw the error
      // throw error;
      // return;
    }
  };

  // const count = timerecordAllList.filter(employee =>
  //     employee.employee_workplaceRecord.some(record => record.workplaceId === "9999")
  // ).length;

  for (const employeeId in datesByEmployee) {
    const dates = datesByEmployee[employeeId];

    // Filter dates greater than or equal to 21
    const upperDates = dates.filter((date) => parseInt(date) <= 20);
    datesByEmployeeUpper[employeeId] = upperDates;
  }

  for (const employeeId in datesByEmployeeLower) {
    const dates = datesByEmployeeLower[employeeId];

    // Filter dates less than or equal to 20
    const lowerDates = dates.filter((date) => parseInt(date) >= 21);
    datesByEmployeeLower[employeeId] = lowerDates;
  }

  function createArrayWithDates(datesArray, resultArray) {
    const newArray = resultArray.map((day) =>
      datesArray.includes(day.toString()) ? day.toString() : ""
    );
    return newArray;
  }

  const newDatesWork = {};

  // Loop through each employee ID
  // for (const employeeId in datesByEmployeeLower) {
  //     // Concatenate the arrays for the current employee
  //     newDatesWork[employeeId] = [
  //         ...(datesByEmployeeUpper[employeeId] || []), // Handle the case where there is no upper array
  //         ...(datesByEmployeeLower[employeeId] || []), // Handle the case where there is no lower array
  //     ];
  // }

  for (const employeeId in datesByEmployeeLower) {
    // Concatenate the arrays for the current employee
    newDatesWork[employeeId] = [
      ...(datesByEmployee[employeeId] || []), // Handle the case where there is no upper array
      ...(datesByEmployeeLow[employeeId] || []), // Handle the case where there is no lower array
    ];
  }

  // Create new arrays for each employee
  const newDatesByEmployeeLower = {};
  // const newDatesByEmployeeUpper = {};

  for (const employeeId in newDatesWork) {
    const datesArrayLower = newDatesWork[employeeId];
    const newArrayLower = createArrayWithDates(datesArrayLower, resultArray);
    newDatesByEmployeeLower[employeeId] = newArrayLower;
  }

  const handleStaffIdChange = (e) => {
    const selectWorkPlaceId = e.target.value;
    // setWorkplacrId(selectWorkPlaceId);
    // setSearchEmployeeId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(
      (workplace) => workplace.workplaceId == selectWorkPlaceId
    );
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);

      // setWorkplacrName(selectedWorkplace.workplaceName);
      setSearchWorkplaceName(selectedWorkplace.workplaceName);
    } else {
      // setWorkplacrName('');
      setSearchWorkplaceName("");
    }
  };

  // ฟังก์ชันสำหรับปุ่ม Force Reload
  const handleForceReload = async () => {
    // 🎨 เอฟเฟคการลบและเติมตัวอักษรในช่องรหัสหน่วยงาน
    const originalWorkplaceId = searchWorkplaceId;
    
    if (originalWorkplaceId && originalWorkplaceId.length > 0) {
      // ลบตัวอักษรสุดท้าย
      const trimmedId = originalWorkplaceId.slice(0, -1);
      const lastChar = originalWorkplaceId.slice(-1);
      
      setSearchWorkplaceId(trimmedId);
      
      // รอ 0.3 วินาที แล้วเติมตัวอักษรสุดท้ายกลับมา
      setTimeout(() => {
        setSearchWorkplaceId(originalWorkplaceId);
      }, 3000);
    }

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
    if (!searchWorkplaceId || !month || !year) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        html: `กรุณากรอกข้อมูลให้ครบถ้วน:<br>
               • รหัสหน่วยงาน<br>
               • เดือน<br>
               • ปี`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f0ad4e'
      });
      return;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่พบข้อมูลพนักงาน',
        text: 'ไม่พบข้อมูลพนักงานในหน่วยงาน กรุณาค้นหาข้อมูลก่อน',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f0ad4e'
      });
      return;
    }

    try {
      console.log('🔄 Starting Force Reload for all employees...');
      
      // แสดง loading ด้วย SweetAlert ทันทีโดยไม่ต้องถามยืนยัน
     
      
      // แสดง loading
      setLoading(true);
      
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // วนลูปยิง API ทุกพนักงาน
      for (let i = 0; i < data.length; i++) {
        const employee = data[i];
        const employeeId = employee.employeeId;
        
        try {
          console.log(`📡 Processing employee ${i + 1}/${data.length}: ${employeeId}`);
          
          const requestData = {
            employeeId: employeeId,
            month: month,
            year: year
          };

          // ยิง API เส้นแรก: conclude/searchtimerecordemployee
          const response1 = await axios.post(
            'http://10.10.110.7:3000/conclude/searchtimerecordemployee',
            requestData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000 // 30 seconds timeout
            }
          );

          // ยิง API เส้นที่สอง: accounting/searchtimerecordemployee รายคน
          const accountingRequestData = {
            employeeId: employeeId,
            month: month,
            year: year
          };

          const response2 = await axios.post(
            'http://10.10.110.7:3000/accounting/searchtimerecordemployee',
            accountingRequestData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000 // 30 seconds timeout
            }
          );

          if (response1.status === 200 && response2.status === 200) {
            successCount++;
            console.log(`✅ Employee ${employeeId} - Both APIs processed successfully`);
          } else {
            errorCount++;
            errors.push(`Employee ${employeeId}: API1 status ${response1.status}, API2 status ${response2.status}`);
            console.warn(`⚠️ Employee ${employeeId} - API1: ${response1.status}, API2: ${response2.status}`);
          }

        } catch (error) {
          errorCount++;
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
          errors.push(`Employee ${employeeId}: ${errorMessage}`);
          console.error(`❌ Error processing employee ${employeeId}:`, error);
        }

        // เพิ่ม delay เล็กน้อยเพื่อไม่ให้ server overwhelm
        if (i < data.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        }
      }

      // ปิด loading SweetAlert
      Swal.close();

      // แสดงผลลัพธ์ด้วย SweetAlert
      const iconType = errorCount === 0 ? 'success' : (successCount > 0 ? 'warning' : 'error');
      const titleText = errorCount === 0 ? 'Force Reload สำเร็จ!' : (successCount > 0 ? 'Force Reload เสร็จสิ้น (มีข้อผิดพลาดบางส่วน)' : 'Force Reload ผิดพลาด');
      
      let htmlContent = `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>📊 สรุปผลการดำเนินการ:</strong></p>
          <p>✅ สำเร็จ: <strong>${successCount}</strong> คน</p>
          <p>❌ ผิดพลาด: <strong>${errorCount}</strong> คน</p>
          <p>รวมทั้งหมด: <strong>${data.length}</strong> คน</p>
      `;

      if (errors.length > 0 && errors.length <= 5) {
        htmlContent += `
          <hr style="margin: 15px 0;">
          <p><strong>🔍 รายการผิดพลาด:</strong></p>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${errors.map(error => `<li style="margin: 2px 0;">${error}</li>`).join('')}
          </ul>
        `;
      } else if (errors.length > 5) {
        htmlContent += `
          <hr style="margin: 15px 0;">
          <p><strong>🔍 รายการผิดพลาด (5 รายการแรก):</strong></p>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${errors.slice(0, 5).map(error => `<li style="margin: 2px 0;">${error}</li>`).join('')}
          </ul>
          <p><small>...และอีก <strong>${errors.length - 5}</strong> รายการ</small></p>
        `;
      }

      htmlContent += `</div>`;

      await Swal.fire({
        icon: iconType,
        title: titleText,
        html: htmlContent,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#28a745',
        width: '500px',
        allowOutsideClick: false
      });

      if (successCount > 0) {
        // เรียก API เส้นที่สองหลังจาก Force Reload เสร็จ
        console.log('🔄 Calling additional API after Force Reload...');
        try {
          const additionalApiData = {
            workplaceId: searchWorkplaceId,
            month: month,
            year: year
          };

          const additionalResponse = await axios.post(
            'http://10.10.110.7:3000/accounting/searchtimerecordbyworkplace',
            additionalApiData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000
            }
          );

          if (additionalResponse.status === 200) {
            console.log('✅ Additional API call successful:', additionalResponse.data);
          } else {
            console.warn('⚠️ Additional API returned status:', additionalResponse.status);
          }
        } catch (additionalError) {
          console.error('❌ Error calling additional API:', additionalError);
        }

        // ถ้ามีการประมวลผลสำเร็จ ให้ refresh ข้อมูลใหม่
        console.log('🔄 Refreshing data after Force Reload...');
        
        // เพิ่ม delay เล็กน้อยก่อน refresh
        setTimeout(async () => {
          try {
            // Force refresh โดยการเรียก API ตรงๆ
            console.log('🔄 Force refreshing data with direct API call...');
            const dataSearch = {
              workplaceId: searchWorkplaceId,
              month: month,
              year: year
            };
            
            const response = await axios.post(endpoint + "/accounting/searchtimerecordemployee", dataSearch);
            
            if (response.data && response.data.length > 0) {
              setData(response.data);
              console.log('✅ Direct API refresh successful - Data updated:', response.data.length, 'employees');
              
              // อัปเดตข้อมูลที่เกี่ยวข้องทั้งหมด
              setSearchResults(response.data);
              
              // Force re-render component
              setLoading(false);
              setTimeout(() => setLoading(true), 100);
              setTimeout(() => setLoading(false), 200);
              
              console.log('✅ Component refresh completed');
            } else {
              console.warn('⚠️ API returned empty data after Force Reload');
              
            }
          } catch (refreshError) {
            console.error('❌ Error refreshing data:', refreshError);
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาดในการรีเฟรช',
              text: 'Force Reload สำเร็จแล้ว แต่เกิดข้อผิดพลาดในการดึงข้อมูลใหม่ กรุณากดค้นหาใหม่เพื่อดูข้อมูลที่อัปเดต',
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#dc3545'
            });
          }
        }, 2000); // เพิ่มเวลารอเป็น 2 วินาทีเพื่อให้ API ประมวลผลเสร็จ
      }

    } catch (error) {
      console.error('❌ Force Reload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: `เกิดข้อผิดพลาดในการ Force Reload: ${error.message}`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

   const generateExcel = async () => {
      console.log('🚀 Starting Excel generation...');
    
    try {
      // เริ่ม loading
      setExcelLoading(true);
      setPageLoading(true);
      
      // Check if required data exists
      console.log('📊 Checking data availability...');
      console.log('- Data:', data ? Object.keys(data).length : 'null');
      console.log('- Data type:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('- Data length:', Array.isArray(data) ? data.length : 'Not array');
      console.log('- workplaceAddsalary:', workplaceAddsalary ? workplaceAddsalary.length : 'null');
      console.log('- searchWorkplaceName:', searchWorkplaceName);
      console.log('- searchWorkplaceId:', searchWorkplaceId);
      console.log('- month:', month);
      console.log('- year:', year);
      
      // Convert data to array if it's an object
      let dataArray = data;
      if (data && !Array.isArray(data)) {
        // If data is object, try to extract array from it
        if (data.data && Array.isArray(data.data)) {
          dataArray = data.data;
        } else if (Object.keys(data).length > 0) {
          // Convert object values to array
          dataArray = Object.values(data);
        } else {
          dataArray = [];
        }
      }
      
      if (!dataArray || dataArray.length === 0) {
        console.warn('⚠️ No employee data found');
        alert('ไม่มีข้อมูลพนักงานสำหรับการสร้างไฟล์ Excel\n\nกรุณา:\n1. เลือกหน่วยงาน\n2. เลือกเดือนและปี\n3. กดค้นหาก่อน');
        setExcelLoading(false);
        setPageLoading(false);
        return;
      }
      
      console.log(`✅ Data validated: ${dataArray.length} employees found`);
      console.log('📦 ExcelJS availability check:', typeof ExcelJS);
      
      if (typeof ExcelJS === 'undefined') {
        throw new Error('ExcelJS library not loaded');
      }
      
      // Create a new workbook using the imported ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ตารางเวลาทำงาน');
      
      // เพิ่ม debug log เพื่อดูข้อมูลก่อนสร้าง Excel
      console.log(`📊 Excel Export Debug - Days: ${dayNumbers.length}, Employees: ${dataArray.length}`);
      console.log(`📊 Welfare columns: ${mergeWorkplaceAddsalary(workplaceAddsalary)?.length || 0}`);
      console.log(`📊 Expected total columns: ${2 + dayNumbers.length + 1 + 5 + (mergeWorkplaceAddsalary(workplaceAddsalary)?.length || 0) + 2}`);
      console.log(`📊 Data sample:`, dataArray.slice(0, 2));
      
      // แทรกแถวว่างเป็นแถวแรก (Row 1)
      const blankRow1 = worksheet.addRow([]);
      blankRow1.height = 50; // เพิ่มความสูงแถวเพื่อรองรับฟอนต์ขนาด 30
      // Merge แถวแรกจาก A ถึง AP
      worksheet.mergeCells('A1:AP1');
      // เขียนชื่อบริษัทในแถวแรก
      const companyCell = worksheet.getCell('A1');
      companyCell.value = 'บริษัท โอวาท โปร แอนด์ ควิก จำกัด';
      companyCell.alignment = { horizontal: 'center', vertical: 'middle' };
      companyCell.font = { bold: true, size: 30 };
      companyCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' } // สีขาว
      };
      companyCell.border = {};
      
      // Merge ช่วง AQ-AT ของแถวที่ 1 และใส่ข้อความ "12356"
      worksheet.mergeCells('AQ1:AT1');
      const numberCell = worksheet.getCell('AQ1');
      numberCell.value = searchWorkplaceId;
      numberCell.alignment = { horizontal: 'center', vertical: 'middle' };
      numberCell.font = { bold: true, size: 30 };
      numberCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' } // สีเหลือง
      };
      numberCell.border = {}; 

      // แทรกแถวว่างเป็นแถวที่สอง (Row 2)
      const blankRow2 = worksheet.addRow([]);
      blankRow2.height = 50; // เพิ่มความสูงสำหรับฟอนต์ขนาด 30
      worksheet.mergeCells('A2:AP2');
      
      const descriptionCell = worksheet.getCell('A2');
      descriptionCell.value = `ใบลงเวลาการปฏิบัติงาน`;
      descriptionCell.alignment = { horizontal: 'center', vertical: 'middle' };
      descriptionCell.font = { bold: true, size: 30, underline: true }; // ฟอนต์ 30 และ underline
      descriptionCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' } // สีขาว
      };
      descriptionCell.border = {}; // ไม่มี border



      
      // แทรกแถวว่างเป็นแถวที่สาม (Row 3)
      const blankRow3 = worksheet.addRow([]);
      blankRow3.height = 50; // เพิ่มความสูงสำหรับฟอนต์ขนาด 30
      worksheet.mergeCells('A3:AP3');
      const workplaceCell = worksheet.getCell('A3');
      workplaceCell.value = `หน่วยงาน: ${searchWorkplaceName}`;
      workplaceCell.alignment = { horizontal: 'center', vertical: 'middle' };
      workplaceCell.font = { bold: true, size: 30 };
      workplaceCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' } // สีขาว
      };
      workplaceCell.border = {}; // ไม่มี border

      // Thai month names - ย้ายมาก่อนใช้งาน
      const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const monthName = month ? thaiMonths[parseInt(month) - 1] : '';
      const monthName2 = month ? thaiMonths[parseInt(month) - 2] : '';
      const yearBE = year ? (parseInt(year) + 543) : '';

    

      
      // แทรกแถวว่างเป็นแถวที่สี่ (Row 4)
     const blank4 = worksheet.addRow([]);
      blank4.height = 50; // เพิ่มความสูงสำหรับฟอนต์ขนาด 30
      worksheet.mergeCells('A4:E4');
      const monthYearCell = worksheet.getCell('A4');
      monthYearCell.value = `ประจำเดือน ${monthName} `;
      monthYearCell.alignment = { horizontal: 'left', vertical: 'middle' };
      monthYearCell.font = { bold: true, size: 30 };
      monthYearCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' } // สีขาว
      };
       worksheet.mergeCells('AK4:AT4');
      const period = worksheet.getCell('AK4');
      period.value = `งวดวันที่ 21 ${monthName2} - 20 ${monthName} พ.ศ. ${yearBE}`;
      period.alignment = { horizontal: 'center', vertical: 'middle' };
      period.font = { bold: true, size: 30 };
      monthYearCell.border = {}; // ไม่มี border
      
      console.log('Workbook and worksheet created successfully');
      
      // Get current date for filename
      const now = new Date();
      const dateStr = now.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      
      // Calculate column counts for proper layout
      const totalDayColumns = dayNumbers.length;
      const summaryColumnsCount = 6; // วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า, cash_holiday
      const welfareColumnsCount = workplaceAddsalary ? mergeWorkplaceAddsalary(workplaceAddsalary).length : 0;
      
      console.log(`Layout: Day columns: ${totalDayColumns}, Welfare columns: ${welfareColumnsCount}`);
      
            // Create header rows data (จริงๆ จะอยู่ใน Excel Row 5 เนื่องจากมีแถวว่าง 4 แถว เป็น Row 1-4)
      const row1 = ['ลำดับ', 'ชื่อ - สกุล'];
      dayNumbers.forEach(day => row1.push(day));
      row1.push('รวมวันทำงาน');
      row1.push('ค่าล่วงเวลา', '', '', '', ''); // ค่าล่วงเวลา จะ merge 5 คอลัมน์
      // 🆕 แทนที่จะใส่ "สวัสดิการ" หลายครั้ง ใส่ครั้งเดียวแล้ว merge
      if (workplaceAddsalary && workplaceAddsalary.length > 0) {
        row1.push('สวัสดิการ'); // ครั้งแรก
        // ใส่ค่าว่างสำหรับคอลัมน์ที่เหลือ (จะถูก merge)
        for (let i = 1; i < mergeWorkplaceAddsalary(workplaceAddsalary).length; i++) {
          row1.push('');
        }
      }
      row1.push('วัน Cash Holiday', 'หักประกันสังคม %', 'เงินสงเคราะห์ลูกจ้าง', 'หมายเหตุ');
      
      // Row 2: Sub headers (จริงๆ อยู่ใน Excel Row 6)
      const row2 = ['', ''];
      dayNumbers.forEach(() => row2.push(''));
      row2.push('');
      row2.push('1441', '1434', '1130', '1120', '1140');
      if (workplaceAddsalary && workplaceAddsalary.length > 0) {
        mergeWorkplaceAddsalary(workplaceAddsalary).forEach(item => row2.push(item.codeSpSalary));
      }
      row2.push('', '', '', '');
      
      // Row 3: Units (จริงๆ อยู่ใน Excel Row 7)
      const row3 = ['', ''];
      dayNumbers.forEach(() => row3.push(''));
      row3.push('');
      // กำหนดหน่วยสำหรับคอลัมน์สรุป: วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า
      row3.push('วัน', 'วัน', 'ชม', 'ชม', 'ชม');
      if (workplaceAddsalary && workplaceAddsalary.length > 0) {
        mergeWorkplaceAddsalary(workplaceAddsalary).forEach(() => row3.push(''));
      }
      row3.push('วัน', '', '', '');
      
      // Row 4: Overtime labels (จริงๆ อยู่ในไฟล์ Excel Row 8 เนื่องจากมีแถวว่าง 4 แถว เป็น Row 1-4)
      const row4 = ['', ''];
      dayNumbers.forEach(() => row4.push(''));
      row4.push('');
      overtimeLabels.forEach(label => row4.push(label));
      if (workplaceAddsalary && workplaceAddsalary.length > 0) {
        mergeWorkplaceAddsalary(workplaceAddsalary).forEach(item => row4.push(item.name));
      }
      row4.push('', '', '', '');
      
      console.log('Header rows created successfully');
      console.log('Row 1 length:', row1.length);
      console.log('Row 2 length:', row2.length);
      
      // Add header rows to worksheet (เริ่มจากแถวที่ 2 เนื่องจากแถวที่ 1 เป็นแถวว่าง)
      const headerRow1 = worksheet.addRow(row1);
      const headerRow2 = worksheet.addRow(row2);
      const headerRow3 = worksheet.addRow(row3);
      const headerRow4 = worksheet.addRow(row4);
      
      console.log('Header rows added to worksheet successfully');
      
      // Apply vertical middle alignment to all header rows
      console.log('🎨 Applying vertical middle alignment to header rows...');
      [headerRow1, headerRow2, headerRow3, headerRow4].forEach((row, rowIndex) => {
        row.eachCell((cell, colNumber) => {
          // เก็บ textRotation เดิมไว้ (ถ้ามี)
          const existingTextRotation = cell.alignment?.textRotation;
          
          cell.alignment = {
            ...cell.alignment, // Preserve any existing alignment
            vertical: 'middle',
            horizontal: 'center'
          };
          
          // เรียกคืน textRotation ถ้ามี
          if (existingTextRotation !== undefined) {
            cell.alignment.textRotation = existingTextRotation;
          }
          
          // เพิ่มการตั้งค่าสำหรับแถว row2 (รหัส 1441, 1434, etc.) - ให้มีสีเหลือง
          if (rowIndex === 1) { // rowIndex 1 คือ headerRow2 (Row 6 ในไฟล์ Excel)
            // เพิ่มพื้นหลังสีเหลืองและจัดรูปแบบ
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' } // สีเหลือง
            };
            cell.font = {
              bold: true,
              size: 10,
              color: { argb: 'FF000000' } // สีดำ
            };
          }
          
          // เพิ่มการตั้งค่าสำหรับแถว row3 (วัน, ชม) เพื่อให้ชัดเจนขึ้น
          if (rowIndex === 2) { // rowIndex 2 คือ headerRow3 (Row 7 ในไฟล์ Excel)
            cell.font = {
              bold: true,
              size: 12, // ลดขนาดให้เล็กลง
              color: { argb: 'FF000000' } // สีดำ
            };
            // เพิ่มขอบเล็กๆ รอบๆ เซลล์เพื่อให้ดูเป็นตารางเล็ก
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF666666' } },
              left: { style: 'thin', color: { argb: 'FF666666' } },
              bottom: { style: 'thin', color: { argb: 'FF666666' } },
              right: { style: 'thin', color: { argb: 'FF666666' } }
            };
            // ปรับ alignment ให้อยู่ตรงกลางล่าง แต่เก็บ textRotation ไว้
            cell.alignment = {
              horizontal: 'center',
              vertical: 'bottom',
              textRotation: existingTextRotation || cell.alignment?.textRotation
            };
          }
          
          // เพิ่มการตั้งค่าสำหรับแถว row4 (overtime labels และ welfare names) - Row 8 ในไฟล์ Excel
          if (rowIndex === 3) { // rowIndex 3 คือ headerRow4 (Row 8 ในไฟล์ Excel)
            cell.font = {
              bold: true,
              size: 10,
              color: { argb: 'FF000000' } // สีดำ
            };
          }
        });
        console.log(`Applied vertical middle alignment to header row ${rowIndex + 5}`); // +5 เนื่องจากแถวแรก 4 แถวเป็นแถวว่าง
      });
      
      // Store merged ranges to track what's been merged
      const mergedRanges = new Set();
      
      // Function to safely merge cells
      const safeMergeCell = (range) => {
        if (!mergedRanges.has(range)) {
          try {
            worksheet.mergeCells(range);
            mergedRanges.add(range);
            console.log(`Successfully merged: ${range}`);
            return true;
          } catch (error) {
            console.warn(`Failed to merge ${range}:`, error.message);
            return false;
          }
        } else {
          console.warn(`Range ${range} already merged, skipping`);
          return false;
        }
      };
      
      // Merge header cells with safety checks
      console.log('Starting header cell merging...');
      
      // Merge "ลำดับ" (A5:A8) - เพิ่ม index เนื่องจากมีแถวว่าง 4 แถว เป็นแถวที่ 1-4
      safeMergeCell('A5:A8');
      
      // Merge "ชื่อ - สกุล" (B5:B8)
      safeMergeCell('B5:B8');
      
      // Merge day number columns (each day gets merged from row 5 to row 8)
      dayNumbers.forEach((day, index) => {
        const colLetter = String.fromCharCode(67 + index); // Start from column C
        const range = `${colLetter}5:${colLetter}8`;
        safeMergeCell(range);
      });
      
      // Merge "รวมวันทำงาน" column 
      const totalWorkDaysCol = String.fromCharCode(67 + dayNumbers.length);
      safeMergeCell(`${totalWorkDaysCol}5:${totalWorkDaysCol}8`);
      
      // Merge summary columns (วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า)
      console.log('Merging summary columns (โอที and holidays)...');
      const summaryStartCol = String.fromCharCode(67 + dayNumbers.length + 1); // เริ่มจากคอลัมน์หลัง "รวมวันทำงาน"
      for (let i = 0; i < 5; i++) { // 5 คอลัมน์: วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า
        const colLetter = String.fromCharCode(summaryStartCol.charCodeAt(0) + i);
        safeMergeCell(`${colLetter}5:${colLetter}8`);
      }
      
      // Add text rotation to summary columns (โอที and holidays)
      console.log('Adding text rotation to summary columns...');
      for (let i = 0; i < 5; i++) {
        try {
          const colLetter = String.fromCharCode(summaryStartCol.charCodeAt(0) + i);
          const summaryCell = worksheet.getCell(`${colLetter}5`);
          if (summaryCell) {
            summaryCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
              textRotation: 90
            };
            console.log(`Text rotation applied to summary cell ${colLetter}5`);
          }
        } catch (rotationError) {
          console.warn(`Error applying text rotation to summary column ${i}:`, rotationError.message);
        }
      }
      
      // Add text rotation to "รวมวันทำงาน" column header (ย้ายมาหลัง merge)
      console.log('Adding text rotation to รวมวันทำงาน column...');
      try {
        const totalWorkDaysCell = worksheet.getCell(`${totalWorkDaysCol}5`);
        if (totalWorkDaysCell) {
          totalWorkDaysCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            textRotation: 90
          };
          console.log(`Text rotation applied to cell ${totalWorkDaysCol}5`);
        }
      } catch (rotationError) {
        console.warn('Error applying text rotation to รวมวันทำงาน:', rotationError.message);
      }
      
      // Merge welfare columns (สวัสดิการ)
      if (workplaceAddsalary && workplaceAddsalary.length > 0) {
        console.log('Merging welfare columns...');
        const welfareStartCol = String.fromCharCode(67 + dayNumbers.length + 1 + 5); // หลังโอที 5 คอลัมน์
        for (let i = 0; i < workplaceAddsalary.length; i++) {
          const colLetter = String.fromCharCode(welfareStartCol.charCodeAt(0) + i);
          safeMergeCell(`${colLetter}5:${colLetter}8`);
        }
        
        // Add text rotation to welfare columns
        console.log('Adding text rotation to welfare columns...');
        for (let i = 0; i < workplaceAddsalary.length; i++) {
          try {
            const colLetter = String.fromCharCode(welfareStartCol.charCodeAt(0) + i);
            const welfareCell = worksheet.getCell(`${colLetter}5`);
            if (welfareCell) {
              welfareCell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                textRotation: 90
              };
              console.log(`Text rotation applied to welfare cell ${colLetter}5`);
            }
          } catch (rotationError) {
            console.warn(`Error applying text rotation to welfare column ${i}:`, rotationError.message);
          }
        }
      }
      
      // Merge additional columns AA to AH (columns 27-34) for rows 5-8
      console.log('Merging additional columns AA to AH...');
      const additionalColumns = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH'];
      additionalColumns.forEach((col) => {
        safeMergeCell(`${col}5:${col}8`);
      });
      
      // Merge "หักประกันสังคม %" and "หมายเหตุ" columns (last 2 columns)
      console.log('Merging หักประกันสังคม % and หมายเหตุ columns...');
     // Merge "หักประกันสังคม %" and "หมายเหตุ" columns (last 2 columns)
     // Merge columns AI to AM (columns 35-39) for "ค่าล่วงเวลา"
      console.log('Merging columns AI to AM for ค่าล่วงเวลา...');
      safeMergeCell('AI5:AM5');
      
      // Set text for merged overtime column
      try {
        const overtimeCell = worksheet.getCell('AI5');
        overtimeCell.value = 'ค่าล่วงเวลา';
        overtimeCell.font = { bold: true, size: 10 };
        overtimeCell.alignment = { horizontal: 'center', vertical: 'middle' };
        console.log('✅ Set ค่าล่วงเวลา text in AI5');
      } catch (error) {
        console.warn('Error setting ค่าล่วงเวลา text:', error);
      }
console.log('Merging หักประกันสังคม % and หมายเหตุ columns...');
try {
  // Debug: แสดงความยาวของ row1 และคำนวณตำแหน่ง
  console.log('Row1 length:', row1.length);
  console.log('Row1 content:', row1);
  
  // คำนวณตำแหน่งคอลัมน์สุดท้าย
  const lastColIndex = row1.length - 1; // หมายเหตุ
  const employeeAllowanceColIndex = row1.length - 2; // เงินสงเคราะห์ลูกจ้าง  
  const socialSecurityColIndex = row1.length - 3; // หักประกันสังคม %
  const cashHolidayColIndex = row1.length - 4; // วัน Cash Holiday
  
  console.log('🔍 Merge columns debug:');
  console.log('Cash Holiday Column Index:', cashHolidayColIndex);
  console.log('Social Security Column Index:', socialSecurityColIndex);
  console.log('Employee Allowance Column Index:', employeeAllowanceColIndex);
  console.log('Notes Column Index:', lastColIndex);
  
  // แปลง index เป็นตัวอักษรคอลัมน์ Excel
  const getColumnLetter = (index) => {
    if (index < 26) {
      return String.fromCharCode(65 + index);
    } else {
      const firstLetter = String.fromCharCode(65 + Math.floor(index / 26) - 1);
      const secondLetter = String.fromCharCode(65 + (index % 26));
      return firstLetter + secondLetter;
    }
  };
  
  const cashHolidayCol = getColumnLetter(cashHolidayColIndex);
  const socialSecurityCol = getColumnLetter(socialSecurityColIndex);
  const notesCol = getColumnLetter(lastColIndex);
  
  console.log('Cash Holiday Column Letter:', cashHolidayCol);
  console.log('Social Security Column Letter:', socialSecurityCol);
  console.log('Notes Column Letter:', notesCol);
  
  // Merge วัน Cash Holiday column (row 5-8)
  console.log('🔗 Starting วัน Cash Holiday merge...');
  const cashHolidayRange = `${cashHolidayCol}5:${cashHolidayCol}8`;
  const mergedCashHoliday = safeMergeCell(cashHolidayRange);
  console.log(`🔗 Merge วัน Cash Holiday (${cashHolidayRange}):`, mergedCashHoliday ? '✅ SUCCESS' : '❌ FAILED');
  
  // Add text rotation to "วัน Cash Holiday" column header after merge
  if (mergedCashHoliday) {
    console.log('🔄 Adding text rotation to วัน Cash Holiday column...');
    try {
      const cashHolidayCell = worksheet.getCell(`${cashHolidayCol}5`);
      if (cashHolidayCell) {
        cashHolidayCell.value = 'วัน Cash Holiday'; // ตั้งค่าข้อความใหม่
        cashHolidayCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          textRotation: 90
        };
        cashHolidayCell.font = { bold: true, size: 10 };
        console.log(`✅ Text rotation applied to วัน Cash Holiday cell ${cashHolidayCol}5`);
      }
    } catch (rotationError) {
      console.warn(`❌ Error applying text rotation to วัน Cash Holiday column:`, rotationError.message);
    }
  }
  
  // Merge หักประกันสังคม % column (row 5-8)
  console.log('🔗 Starting หักประกันสังคม % merge...');
  const socialSecurityRange = `${socialSecurityCol}5:${socialSecurityCol}8`;
  const mergedSocial = safeMergeCell(socialSecurityRange);
  console.log(`🔗 Merge หักประกันสังคม % (${socialSecurityRange}):`, mergedSocial ? '✅ SUCCESS' : '❌ FAILED');
  
  // Add text rotation to "หักประกันสังคม %" column header after merge
  if (mergedSocial) {
    console.log('🔄 Adding text rotation to หักประกันสังคม % column...');
    try {
      const getColumnLetter = (index) => {
    if (index < 26) {
        return String.fromCharCode(65 + index);
    } else {
        const firstLetter = String.fromCharCode(65 + Math.floor(index / 26) - 1);
        const secondLetter = String.fromCharCode(65 + (index % 26));
        return firstLetter + secondLetter;
    }
};
const totalWorkDaysColIndex = 3 + dayNumbers.length;
const welfareColumnsCount = mergeWorkplaceAddsalary(workplaceAddsalary)?.length || 0;
const socialSecurityColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount;

      const socialSecurityColLetter = getColumnLetter(socialSecurityColIndex - 1);

      const socialSecurityCell = worksheet.getCell(`${socialSecurityCol}5`);
      if (socialSecurityCell) {
        socialSecurityCell.value = 'หักประกันสังคม %'; // ตั้งค่าข้อความใหม่
        socialSecurityCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          textRotation: 0 // หมุนข้อความ 90 องศา
        };
        socialSecurityCell.font = {
          bold: true,
          size: 9
        };
        console.log(`🔄 Text rotation applied to หักประกันสังคม % cell ${socialSecurityCol}5`);
      }
    } catch (rotationError) {
      console.warn('❌ Error applying text rotation to หักประกันสังคม %:', rotationError.message);
    }
  }
  
  // Merge เงินสงเคราะห์ลูกจ้าง column (row 5-8)
  console.log('🔗 Starting เงินสงเคราะห์ลูกจ้าง merge...');
  const employeeAllowanceCol = getColumnLetter(lastColIndex - 1); // เงินสงเคราะห์ลูกจ้าง
  const employeeAllowanceRange = `${employeeAllowanceCol}5:${employeeAllowanceCol}8`;
  const mergedEmployeeAllowance = safeMergeCell(employeeAllowanceRange);
  console.log(`🔗 Merge เงินสงเคราะห์ลูกจ้าง (${employeeAllowanceRange}):`, mergedEmployeeAllowance ? '✅ SUCCESS' : '❌ FAILED');
  
  // Add text rotation to "เงินสงเคราะห์ลูกจ้าง" column header after merge
  if (mergedEmployeeAllowance) {
    console.log('🔄 Adding text rotation to เงินสงเคราะห์ลูกจ้าง column...');
    try {
      const employeeAllowanceCell = worksheet.getCell(`${employeeAllowanceCol}5`);
      if (employeeAllowanceCell) {
        employeeAllowanceCell.value = 'เงินสงเคราะห์ลูกจ้าง'; // ตั้งค่าข้อความใหม่
        employeeAllowanceCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          textRotation: 90 // หมุนข้อความ 90 องศา
        };
        employeeAllowanceCell.font = {
          bold: true,
          size: 9
        };
        console.log(`🔄 Text rotation applied to เงินสงเคราะห์ลูกจ้าง cell ${employeeAllowanceCol}5`);
      }
    } catch (rotationError) {
      console.warn('❌ Error applying text rotation to เงินสงเคราะห์ลูกจ้าง:', rotationError.message);
    }
  }
  
  // Merge หมายเหตุ column (row 5-8)
  console.log('🔗 Starting หมายเหตุ merge...');
  const notesRange = `${notesCol}5:${notesCol}8`;
  const mergedNotes = safeMergeCell(notesRange);
  console.log(`🔗 Merge หมายเหตุ (${notesRange}):`, mergedNotes ? '✅ SUCCESS' : '❌ FAILED');
  
  // Add text rotation to "หมายเหตุ" column header after merge
  if (mergedNotes) {
    console.log('🔄 Adding text rotation to หมายเหตุ column...');
    try {
      const notesCell = worksheet.getCell(`${notesCol}5`);
      if (notesCell) {
        notesCell.value = 'หมายเหตุ'; // ตั้งค่าข้อความใหม่
        notesCell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          textRotation: 90 // หมุนข้อความ 90 องศา
        };
        notesCell.font = {
          bold: true,
          size: 9
        };
        console.log(`🔄 Text rotation applied to หมายเหตุ cell ${notesCol}5`);
      }
    } catch (rotationError) {
      console.warn('❌ Error applying text rotation to หมายเหตุ:', rotationError.message);
    }
  }
} catch (mergeError) {
  console.warn('Error merging หักประกันสังคม % and หมายเหตุ columns:', mergeError.message);
  console.warn('Error stack:', mergeError.stack);
}
      
      console.log(`Total merged ranges: ${mergedRanges.size}`);
      
      // ====== FINAL TEXT ROTATION SETUP (หลังจาก merge และ styling เสร็จทั้งหมด) ======
      console.log('🔄 Applying final text rotation to all relevant columns...');
      
      try {
        // 1. รวมวันทำงาน column
        const totalWorkDaysCell = worksheet.getCell(`${totalWorkDaysCol}5`);
        if (totalWorkDaysCell) {
          totalWorkDaysCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            textRotation: 90
          };
          console.log(`✅ Text rotation applied to รวมวันทำงาน: ${totalWorkDaysCol}2`);
        }
        
        // 2. Summary columns (วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า)
        for (let i = 0; i < 5; i++) {
          const colLetter = String.fromCharCode(summaryStartCol.charCodeAt(0) + i);
          const summaryCell = worksheet.getCell(`${colLetter}5`);
          if (summaryCell) {
            summaryCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
              textRotation: 90
            };
            console.log(`✅ Text rotation applied to summary column: ${colLetter}3`);
          }
        }
        
        // 3. Welfare columns (สวัสดิการ)
        if (workplaceAddsalary && workplaceAddsalary.length > 0) {
          const welfareStartCol = String.fromCharCode(67 + dayNumbers.length + 1 + 5);
          for (let i = 0; i < workplaceAddsalary.length; i++) {
            const colLetter = String.fromCharCode(welfareStartCol.charCodeAt(0) + i);
            const welfareCell = worksheet.getCell(`${colLetter}5`);
            if (welfareCell) {
              welfareCell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                textRotation: 90
              };
              console.log(`✅ Text rotation applied to welfare column: ${colLetter}3`);
            }
          }
        }
        
        // 4. วัน Cash Holiday column
        const cashHolidayColIndex = row1.length - 4; // วัน Cash Holiday
        const notesColIndex = row1.length - 1; // หมายเหตุ
        
        // แปลง index เป็นตัวอักษรคอลัมน์ Excel
        const getColumnLetterForRotation = (index) => {
          if (index < 26) {
            return String.fromCharCode(65 + index);
          } else {
            const firstLetter = String.fromCharCode(65 + Math.floor(index / 26) - 1);
            const secondLetter = String.fromCharCode(65 + (index % 26));
            return firstLetter + secondLetter;
          }
        };
        
        const cashHolidayCol = getColumnLetterForRotation(cashHolidayColIndex);
        const notesCol = getColumnLetterForRotation(notesColIndex);
        
        const cashHolidayCell = worksheet.getCell(`${cashHolidayCol}5`);
        if (cashHolidayCell) {
          cashHolidayCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            textRotation: 90
          };
          console.log(`✅ Text rotation applied to วัน Cash Holiday: ${cashHolidayCol}5`);
        }
        
        // 5. หมายเหตุ column
        const notesCell = worksheet.getCell(`${notesCol}5`);
        if (notesCell) {
          notesCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            textRotation: 90
          };
          console.log(`✅ Text rotation applied to หมายเหตุ: ${notesCol}5`);
        }
        
        console.log('🎉 All text rotations applied successfully!');
      } catch (finalRotationError) {
        console.warn('❌ Error in final text rotation setup:', finalRotationError.message);
      }
      
      // Employee data rows
      console.log('📝 Adding employee data rows...');
      let currentRowIndex = 9 // เริ่มจากแถวที่ 9 (หลัง header และแถวว่าง 4 แถวที่เพิ่มเข้าไป)
      const employeesPerPage = 4; // แสดงพนักงาน 4 คนต่อหน้า
      let currentPageEmployeeCount = 0;
      let currentPage = 1;
      let pageBreakRows = [];
      let employeeEndRows = [];
      
      if (dataArray && dataArray.length > 0) {
        // กำหนดตัวแปรสำหรับคำนวณจำนวนคอลัมน์ - ใช้ร่วมกันในทุกแถว
        const summaryColumns = 5; // โอที 5 ช่อง 
        const welfareColumns = workplaceAddsalary.length;
        const endColumns = 2; // หักประกันสังคม + หมายเหตุ
        
        dataArray.forEach((record, idx) => {
          console.log(`Adding employee ${idx + 1}/${dataArray.length}: ${record.employeeName || record.name}`);
          
          // Helper function to format numbers with comma separator
          const formatNumberWithComma = (value) => {
            if (!value || value === '') return '';
            const numValue = parseFloat(value);
            if (isNaN(numValue)) return value;
            return numValue.toLocaleString('en-US', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 2 
            });
          };
          
          if (idx > 0 && currentPageEmployeeCount >= employeesPerPage) {
    console.log(`🔥 Adding page break after employee ${idx} (${currentPageEmployeeCount} employees on current page)`);
    
    // เก็บแถวที่ต้องใส่ page break (แถวปัจจุบัน - 1)
    pageBreakRows.push(currentRowIndex - 1);
    
    currentPageEmployeeCount = 0; // รีเซ็ตการนับพนักงานในหน้าใหม่
    currentPage++;
  }
     
          // Create row for employee data          
          // Row 1: Main employee data (เช้า)
          const empRow1 = [idx + 1, `${employeePrefixes[record.employeeId] || record.prefix || ''} ${record.employeeName || `${record.name} ${record.lastName}`} เช้า`];
          
          // Attendance data for each day
          dayNumbers.forEach(day => {
            // หา record ทั้งหมดของวันนี้
            const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
            
            // 🔥 แก้ไข: สำหรับแถวเช้า ให้หา cash_holiday record ก่อน (สำหรับกะเช้า 06:00-15:00)
            const cashHolidayRecord = allRecordsForDay.find(itemx => {
              if (itemx.shift === "cash_holiday" && itemx.startTime) {
                const startHour = parseFloat(itemx.startTime.replace('.', ':').split(':')[0]);
                return startHour >= 6 && startHour <= 15; // เฉพาะกะเช้า 06:00-15:00 เท่านั้น
              }
              return false;
            });
            
            // หา morning_shift record
            const morningShiftRecord = allRecordsForDay.find(itemx => itemx.shift === "morning_shift");
            
            // หา record ที่มี totalTime ก่อน ถ้าไม่มีก็เอา record แรก
            const found = cashHolidayRecord || morningShiftRecord || allRecordsForDay.find(itemx => itemx.totalTime && itemx.totalTime.trim() !== '') || allRecordsForDay[0];
            
            const isWork = found?.dayType === "work" || 
                           (found?.dayType === "stop" && found?.shift === "morning_shift") ||
                           (found?.shift === "cash_holiday" && found?.startTime && (() => {
                             const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                             return startHour >= 6 && startHour <= 15; // เฉพาะกะเช้า 06:00-15:00 เท่านั้น
                           })()); // แสดงข้อมูล cash_holiday เฉพาะกะเช้าในแถวเช้า 

            // ตรวจสอบว่าวันนี้อยู่ใน stopDaysList หรือไม่
            const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
              const stopDayDate = parseInt(stopDay.date);
              const currentDay = parseInt(day);
              return stopDayDate === currentDay;
            });

            // ตรวจสอบทั้ง specialt_shift และ stopDaysList
            const specialIndividual = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
            
            // กำหนดค่าที่จะแสดง
            let displayValue = '';
            if (isWork) {
              // เปรียบเทียบ workplaceId ของ record กับ searchWorkplaceId ที่เลือก
              const recordWorkplaceId = found?.workplaceId;
              const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
              
              // ตรวจสอบว่าพนักงานคนนี้เป็นพนักงานข้ามหน่วยงานหรือไม่
              const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
              
              if (isCrossWorkplaceEmployee) {
                // ถ้าเป็นพนักงานข้ามหน่วยงาน ให้แสดง "1" เฉพาะวันที่มาทำงานที่หน่วยงานที่เลือกเท่านั้น
                if (isMatchSearchWorkplace) {
                  displayValue = '1';
                }
                // ถ้าไม่ตรงกับ searchWorkplaceId = ไม่แสดงอะไร (วันที่ไม่ได้มาทำงานที่หน่วยงานนี้)
              } else {
                // พนักงานปกติที่สังกัดหน่วยงานนี้
                if (found?.shift === "cash_holiday" && found?.startTime) {
                  // 🔥 ปรับปรุง: ตรวจสอบเวลาเริ่มงานสำหรับ cash_holiday
                  const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                  if (startHour >= 6 && startHour <= 15) {
                    // กะเช้า (06:00-15:00) - แสดงเลข 1
                    displayValue = '1';
                  }
                  // ถ้าไม่อยู่ในช่วงเวลาเช้า (06:00-15:00) ไม่แสดงอะไรในแถวเช้า
                } else if (found?.shift === "morning_shift") {
                  // เฉพาะ morning_shift เท่านั้น
                  if (isMatchSearchWorkplace) {
                    displayValue = '1';
                  } else {
                    displayValue = `1\n${found?.workplaceId || ''}`;
                  }
                }
              }
            }

            // เพิ่มเงื่อนไขพิเศษ: ถ้าเป็นวันหยุดส่วนบุคคลแต่มี totalTime ให้แสดงเลข 1
            // แต่ไม่แสดงถ้าเป็น cash_holiday กะดึก (startTime 18:00-03:00)
            if (specialIndividual && found?.totalTime && found.totalTime.trim() !== '') {
              // ตรวจสอบว่าเป็น cash_holiday กะดึกหรือไม่
              if (found?.shift === "cash_holiday" && found?.startTime) {
                const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                // ถ้าเป็นกะดึก (18:00-03:00) ไม่แสดงในแถวเช้า
                if (!(startHour >= 18 || (startHour >= 0 && startHour <= 3))) {
                  displayValue = "1";
                }
              } else {
                // ไม่ใช่ cash_holiday ให้แสดงปกติ
                displayValue = "1";
              }
            }
            
            empRow1.push(displayValue);
          });
          
          // Summary columns
          empRow1.push(record.dayWorkCount || '');
          empRow1.push(record.customizeDayoff || '');
          empRow1.push(record.publicHolidayCount || '');
          empRow1.push(record.sumOtPublicHoliday || '');
          empRow1.push(record.sumOt1p5 || '');
          empRow1.push(record.sumOt3 || '');
          
          // Workplace additional salary data
          if (workplaceAddsalary && workplaceAddsalary.length > 0) {
            mergeWorkplaceAddsalary(workplaceAddsalary).forEach(item => {
              if (item.codeSpSalary === MERGE_CONFIG.displayId) {
                // รวมค่าจาก sourceId1 และ sourceId2
                const foundSourceId1 = record.addSalaryList?.find(itemx => itemx.id === MERGE_CONFIG.sourceId1);
                const foundSourceId2 = record.addSalaryList?.find(itemx => itemx.id === MERGE_CONFIG.sourceId2);
                const valueSourceId1 = foundSourceId1?.message && !isNaN(foundSourceId1.message) ? parseFloat(foundSourceId1.message) : 0;
                const valueSourceId2 = foundSourceId2?.message && !isNaN(foundSourceId2.message) ? parseFloat(foundSourceId2.message) : 0;
                const totalValue = valueSourceId1 + valueSourceId2;
                empRow1.push(totalValue ? formatNumberWithComma(totalValue) : "");
              } else {
                const found = record.addSalaryList?.find(itemx => itemx.id === item.codeSpSalary);
                const value = found?.message;
                empRow1.push(value ? formatNumberWithComma(parseFloat(value)) : "");
              }
            });
          }
          
          empRow1.push(record.specialShiftTotalSalary ? formatNumberWithComma(parseFloat(record.cash)) : ''); // วัน Cash Holiday
          empRow1.push(''); // หักประกันสังคม
          empRow1.push(''); // เงินสงเคราะห์ลูกจ้าง
          empRow1.push(''); // หมายเหตุ
          // Row 2: Night shift data (ดึก) - Use same values as web table
          const empRow2 = ['', 'ดึก'];
          dayNumbers.forEach(day => {
            // หา record ทั้งหมดของวันนี้
            const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
            
            // 🔥 แก้ไข: สำหรับแถวดึก ให้หา night_shift record ก่อน แล้วค่อยหา cash_holiday (สำหรับกะดึก 18:00-03:00)
            const nightShiftRecord = allRecordsForDay.find(itemx => itemx.shift === "night_shift");
            const cashHolidayRecord = allRecordsForDay.find(itemx => {
              if (itemx.shift === "cash_holiday" && itemx.startTime) {
                const startHour = parseFloat(itemx.startTime.replace('.', ':').split(':')[0]);
                return startHour >= 18 || (startHour >= 0 && startHour <= 3); // เฉพาะกะดึก 18:00-03:00 เท่านั้น
              }
              return false;
            });
            
            // หา record ที่มี totalTime ก่อน ถ้าไม่มีก็เอา record แรก
            const found = nightShiftRecord || cashHolidayRecord || allRecordsForDay.find(itemx => itemx.totalTime && itemx.totalTime.trim() !== '') || allRecordsForDay[0];
            
            const isWork = found?.dayType === "work" || 
                           (found?.dayType === "stop" && found?.shift === "night_shift") ||
                           (found?.shift === "cash_holiday" && found?.startTime && (() => {
                             const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                             return startHour >= 18 || (startHour >= 0 && startHour <= 3); // เฉพาะกะดึก 18:00-03:00 เท่านั้น
                           })()); // แสดงข้อมูล cash_holiday เฉพาะกะดึกในแถวดึก

            // ตรวจสอบว่าวันนี้อยู่ใน stopDaysList หรือไม่
            const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
              const stopDayDate = parseInt(stopDay.date);
              const currentDay = parseInt(day);
              return stopDayDate === currentDay;
            });

            // ตรวจสอบทั้ง specialt_shift และ stopDaysList
            const specialIndividual = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
            
            // กำหนดค่าที่จะแสดง
            let displayValue = '';
            if (isWork) {
              // เปรียบเทียบ workplaceId ของ record กับ searchWorkplaceId ที่เลือก
              const recordWorkplaceId = found?.workplaceId;
              const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
              
              // ตรวจสอบว่าพนักงานคนนี้เป็นพนักงานข้ามหน่วยงานหรือไม่
              const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
              
              if (isCrossWorkplaceEmployee) {
                // ถ้าเป็นพนักงานข้ามหน่วยงาน ให้แสดง "1" เฉพาะวันที่มาทำงานที่หน่วยงานที่เลือกเท่านั้น
                if (isMatchSearchWorkplace) {
                  displayValue = '1';
                }
                // ถ้าไม่ตรงกับ searchWorkplaceId = ไม่แสดงอะไร (วันที่ไม่ได้มาทำงานที่หน่วยงานนี้)
              } else {
                // พนักงานปกติที่สังกัดหน่วยงานนี้
                if (found?.shift === "cash_holiday" && found?.startTime) {
                  // 🔥 ปรับปรุง: ตรวจสอบเวลาเริ่มงานสำหรับ cash_holiday
                  const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                  if (startHour >= 18 || (startHour >= 0 && startHour <= 3)) {
                    // กะดึก (18:00-03:00) - แสดงเลข 1
                    displayValue = '1';
                  }
                  // ถ้าไม่อยู่ในช่วงเวลาดึก (18:00-03:00) ไม่แสดงอะไรในแถวดึก
                } else if (found?.shift === "night_shift") {
                  // เฉพาะ night_shift เท่านั้น
                  if (isMatchSearchWorkplace) {
                    displayValue = '1';
                  } else {
                    displayValue = `1\n${found?.workplaceId || ''}`;
                  }
                }
              }
            }

            // เพิ่มเงื่อนไขพิเศษ: ถ้าเป็นวันหยุดส่วนบุคคลแต่มี totalTime ให้แสดงเลข 1
            // แต่ไม่แสดงถ้าเป็น cash_holiday กะเช้า (startTime 06:00-15:00)
            if (specialIndividual && found?.totalTime && found.totalTime.trim() !== '') {
              // ตรวจสอบว่าเป็น cash_holiday กะเช้าหรือไม่
              if (found?.shift === "cash_holiday" && found?.startTime) {
                const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                // ถ้าเป็นกะเช้า (06:00-15:00) ไม่แสดงในแถวดึก
                if (!(startHour >= 6 && startHour <= 15)) {
                  displayValue = "1";
                }
              } else {
                // ไม่ใช่ cash_holiday ให้แสดงปกติ
                displayValue = "1";
              }
            }
            
            empRow2.push(displayValue);
          });
          
          // Use exact same calculations as the web table to ensure consistency
          empRow2.push(formatNumberWithComma(record.sumCashWork) || '');                    // เงินวันทำงาน
          
          // ตรวจสอบประเภทพนักงาน ถ้าเป็นรายเดือนให้แสดง publicHolidayCash แทน cashcustomizeDayoff
          const employeeForRow2 = employeeList.find(emp => emp.employeeId === record.employeeId);
          if (employeeForRow2?.jobtype === "รายเดือน") {
            empRow2.push(record.publicHolidayCash ? formatNumberWithComma(parseFloat(record.publicHolidayCash).toFixed(2)) : '');  // รวมวันหยุด (รายเดือน)
          } else {
            empRow2.push(formatNumberWithComma(record.cashcustomizeDayoff) || '');           // รวมวันหยุด (รายวัน)
          }
          
          // ตรวจสอบประเภทพนักงาน ถ้าเป็นรายเดือนให้แสดง 0
          if (employeeForRow2?.jobtype === "รายเดือน") {
            empRow2.push('0');                                                               // รวมเงินทำงานนักขัติ (รายเดือน)
          } else {
            empRow2.push(formatNumberWithComma(record.publicHolidayCash) || '');             // รวมเงินทำงานนักขัติ (รายวัน)
          }
          empRow2.push(formatNumberWithComma(record.sumCashWorkMul?.["2"]) || '');         // รวมเงินทำงานโอที2
          empRow2.push(formatNumberWithComma(record.sumCashWorkMul?.["1.5"]) || '');       // โอที 1.5
          empRow2.push(record.sumCashWorkMul?.["3"] ? formatNumberWithComma(parseFloat(record.sumCashWorkMul["3"]).toFixed(2)) : ''); // โอที 3
          
          if (workplaceAddsalary && workplaceAddsalary.length > 0) {
            mergeWorkplaceAddsalary(workplaceAddsalary).forEach(item => {
              if (item.codeSpSalary === MERGE_CONFIG.displayId) {
                // รวมค่าจาก sourceId1 และ sourceId2
                const foundSourceId1 = record.addSalaryList?.find(itemx => itemx.id === MERGE_CONFIG.sourceId1);
                const foundSourceId2 = record.addSalaryList?.find(itemx => itemx.id === MERGE_CONFIG.sourceId2);
                const valueSourceId1 = parseFloat(foundSourceId1?.SpSalary || 0);
                const valueSourceId2 = parseFloat(foundSourceId2?.SpSalary || 0);
                const totalValue = valueSourceId1 + valueSourceId2;
                empRow2.push(totalValue === 0 ? "NO" : formatNumberWithComma(totalValue.toFixed(2)));
              } else {
                const found = record.addSalaryList?.find(itemx => itemx.id === item.codeSpSalary);
                const value = parseFloat(found?.SpSalary || 0);
                empRow2.push(value === 0 ? "NO" : formatNumberWithComma(value.toFixed(2)));
              }
            });
          }
          
          empRow2.push(record.specialShiftTotalSalary ? formatNumberWithComma(parseFloat(record.specialShiftTotalSalary).toFixed(2)) : ''); // วัน Cash Holiday
          // เพิ่ม social security column
          empRow2.push(record.socialSecurity ? formatNumberWithComma(parseFloat(record.socialSecurity).toFixed(2)) : '');
          
          // เพิ่ม employee allowance column (เงินสงเคราะห์ลูกจ้าง)
          empRow2.push(record.employeeAllowance ? formatNumberWithComma(parseFloat(record.employeeAllowance).toFixed(2)) : '');
          
          // Add empty cells for remaining columns - ใช้การนับอัตโนมัติ  
         empRow2.push(''); // หมายเหตุ
          
          // Row 3: OT 1.5 data - using same condition as sumOvertimePerDay
          const empRow3 = ['', `${record.employeeId} โอที 1.5`];
          dayNumbers.forEach(day => {
            const found = record?.employee_record?.find(itemx => itemx.date === day);
            const hasData = found && found.date; // ตรวจสอบว่ามีข้อมูลหรือไม่
            
            // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
            const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
            const recordWorkplaceId = found?.workplaceId;
            const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
            
            // กำหนดเงื่อนไขการแสดงผล
            let shouldShowData = false;
            if (isCrossWorkplaceEmployee) {
              // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก
              shouldShowData = hasData && isMatchSearchWorkplace;
            } else {
              // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล
              shouldShowData = hasData;
            }
            
            if (shouldShowData && found?.cashOtMul?.trim() && found?.cashOtMul === "1.5") {
              // รวม beforeTotalOtTime และ totalOtTime แทนการ join
              const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
              const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
              const summedTime = beforeTime + totalTime;
              empRow3.push(summedTime > 0 ? formatTimeValueForExcel(summedTime) : '');
            } else {
              empRow3.push('');
            }
          });
          
         const remainingCols3 = row1.length - empRow3.length;
for (let i = 0; i < remainingCols3; i++) {
    empRow3.push('');
}
          
          // Row 4: OT 2 data
          const empRow4 = ['', 'โอที 2'];
          dayNumbers.forEach(day => {
            const found = record?.employee_record?.find(itemx => itemx.date === day);
            
            // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
            const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
            const recordWorkplaceId = found?.workplaceId;
            const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
            
            // กำหนดเงื่อนไขการแสดงผล
            let shouldShowData = false;
            if (isCrossWorkplaceEmployee) {
              // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก และต้องเป็น dayType "stop" และมี totalTime
              shouldShowData = found && isMatchSearchWorkplace && found?.dayType === "stop" && found.totalTime;
            } else {
              // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล dayType "stop" และมี totalTime
              shouldShowData = found?.dayType === "stop" && found.totalTime;
            }
            
            // ตรวจสอบประเภทพนักงาน ถ้าเป็นรายเดือนไม่ให้แสดง totalTime
            const employee = employeeList.find(emp => emp.employeeId === record.employeeId);
            const shouldShowTotalTime = shouldShowData && employee?.jobtype !== "รายเดือน";
            
            empRow4.push(shouldShowTotalTime ? formatTimeValueForExcel(found.totalTime) : '');
          });
          
          // Add empty cells for summary columns - ใช้การนับอัตโนมัติ
         const remainingCols4 = row1.length - empRow4.length;
for (let i = 0; i < remainingCols4; i++) {
    empRow4.push('');
}
          
          // Row 5: OT 3 data + การลา
          const empRow5 = ['', 'โอที3'];
          dayNumbers.forEach(day => {
            const found = record?.employee_record?.find(itemx => itemx.date === day);
            
            // 🆕 ตรวจสอบการลาก่อน
            const isSickLeave = record?.addSalaryList?.some(salaryItem => {
              // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
              if (salaryItem.welfareType === "ลาป่วย" || 
                  salaryItem.welfareType === "ลาคลอด" ||
                  salaryItem.name?.includes("ลาป่วย") || 
                  salaryItem.name?.includes("ป่วย") ||
                  salaryItem.name?.includes("ลาพักร้อน") ||
                  salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {

                // แปลง date string เป็น array ของวันที่
                const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
                const currentDay = parseInt(day);
                
                const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
                return isMatch;
              }
              return false;
            });
            
            // ถ้าเป็นวันลา ให้แสดงสัญลักษณ์การลา
            if (isSickLeave) {
              // หาข้อมูลการลาที่ตรงกับวันนี้
              const sickLeaveItem = record?.addSalaryList?.find(salaryItem => {
                if (salaryItem.welfareType === "ลาป่วย" || 
                    salaryItem.welfareType === "ลาคลอด" ||
                    salaryItem.name?.includes("ลาป่วย") || 
                    salaryItem.name?.includes("ป่วย") ||
                    salaryItem.name?.includes("ลาพักร้อน") ||
                    salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
                  
                  const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
                  const currentDay = parseInt(day);
                  return dates.some(dateStr => parseInt(dateStr) === currentDay);
                }
                return false;
              });
              
              // กำหนดตัวย่อตามชื่อการลา
              if (sickLeaveItem) {
                const leaveName = sickLeaveItem.name || sickLeaveItem.welfareType || '';
                
                if (leaveName.includes("ลาพักร้อน") || leaveName.includes("ชดเชย")) {
                  empRow5.push('พร'); // พักร้อน
                } else if (leaveName.includes("ลาป่วย") || leaveName.includes("ป่วย")) {
                  empRow5.push('ป'); // ป่วย
                } else if (leaveName.includes("ลาคลอด") || leaveName.includes("คลอด")) {
                  empRow5.push('ค'); // คลอด
                } else if (leaveName.includes("ลากิจ") || leaveName.includes("กิจ")) {
                  empRow5.push('ก'); // กิจ
                } else if (leaveName.includes("ลาบวช")) {
                  empRow5.push('บ'); // บวช
                } else if (leaveName.includes("ลาทหาร")) {
                  empRow5.push('ท'); // ทหาร
                } else {
                  empRow5.push('ล'); // การลาทั่วไป
                }
              } else {
                empRow5.push('ล'); // fallback
              }
            } else {
              // ไม่ใช่วันลา ตรวจสอบข้อมูล OT 3 ตามปกติ
              // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
              const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
              const recordWorkplaceId = found?.workplaceId;
              const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
              
              // กำหนดเงื่อนไขการแสดงผล
              let shouldShowData = false;
              if (isCrossWorkplaceEmployee) {
                // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก
                shouldShowData = found && isMatchSearchWorkplace && found?.dayType === "stop" && found?.cashOtMul?.trim() && found.cashOtMul === "3";
              } else {
                // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล
                shouldShowData = found?.dayType === "stop" && found?.cashOtMul?.trim() && found.cashOtMul === "3";
              }
              
              if (shouldShowData) {
                // รวม beforeTotalOtTime และ totalOtTime แทนการ join
                const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
                const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
                const summedTime = beforeTime + totalTime;
                empRow5.push(summedTime > 0 ? formatTimeValueForExcel(summedTime) : '');
              } else {
                empRow5.push('');
              }
            }
          });
          
         const remainingCols5 = row1.length - empRow5.length;
for (let i = 0; i < remainingCols5; i++) {
    empRow5.push('');
}

          
          // Add employee rows to worksheet
          const empRowRefs = [];
          empRowRefs.push(worksheet.addRow(empRow1));
          empRowRefs.push(worksheet.addRow(empRow2));
          empRowRefs.push(worksheet.addRow(empRow3));
          empRowRefs.push(worksheet.addRow(empRow4));
          empRowRefs.push(worksheet.addRow(empRow5));
          // Add employee rows to worksheet

// เพิ่มเส้นขอบหนาที่แถว โอที3 (แถวสุดท้ายของพนักงาน)
const lastRowRef = empRowRefs[4]; // แถว โอที3
lastRowRef.eachCell((cell, colNumber) => {
  // คงค่า border เดิมไว้ แต่เปลี่ยนเฉพาะ bottom เป็นสีแดง
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } }, // สีดำ
    left: { style: 'thin', color: { argb: 'FF000000' } }, // สีดำ
    bottom: { style: 'medium', color: { argb: 'FFFF0000' } }, // สีแดง และหนาขึ้น
    right: { style: 'thin', color: { argb: 'FF000000' } } // สีดำ
  };
});

          
          // Apply thick bottom border to OT3 row (empRow5)
         const ot3RowNumber = currentRowIndex + 4; // empRow5 is the 5th row (index 4)
const actualTotalColumns = row1.length; // ใช้จำนวนคอลัมน์จริงจาก header

for (let colIdx = 1; colIdx <= actualTotalColumns; colIdx++) {
    const cell = worksheet.getCell(ot3RowNumber, colIdx);
    if (!cell.border) cell.border = {};
    
    cell.border = {
        ...cell.border,
        bottom: { style: 'double', color: { argb: 'FF000000' } }
    };
}
          
          // Apply gray styling to empty cells in employee day columns
          console.log(`🎨 Applying styling to cells for employee ${record.employeeName || record.name}...`);
          
          const employeeRows = [empRow1, empRow2, empRow3, empRow4, empRow5];
          const rowNames = ['เช้า', 'ดึก', 'โอที 1.5', 'โอที 2', 'โอที 3'];
          
          employeeRows.forEach((empRow, rowIdx) => {
            const actualRowNumber = currentRowIndex + rowIdx;
            
            // Check day columns (starting from column C, which is index 2)
            dayNumbers.forEach((day, dayIdx) => {
              const cellValue = empRow[dayIdx + 2]; // +2 because columns A,B are ลำดับ and ชื่อ
              const colNumber = dayIdx + 3; // +3 because Excel is 1-based and we start from column C
              const cell = worksheet.getCell(actualRowNumber, colNumber);
              
              // ตรวจสอบว่าเป็นวันหยุดหรือไม่ (ใช้ลอจิกเดียวกันกับหน้าเว็บ)
              const dayNum = parseInt(day);
              let actualMonth, actualYear;
              
              // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
              if (dayNum >= 21) {
                // วันที่ 21-31 เป็นของเดือนก่อนหน้า
                if (parseInt(month) === 1) {
                  actualMonth = 12;
                  actualYear = parseInt(year) - 1;
                } else {
                  actualMonth = parseInt(month) - 1;
                  actualYear = parseInt(year);
                }
              } else {
                // วันที่ 1-20 เป็นของเดือนปัจจุบัน
                actualMonth = parseInt(month);
                actualYear = parseInt(year);
              }
              
              // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
              const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              
              // ตรวจสอบจาก dayoffWorkplace
              const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
              
              // ตรวจสอบจาก dayOffOnly
              const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');

              // 🆕 เพิ่มการตรวจสอบ specialt_shift และ stopDaysList
              const foundRecord = record?.employee_record?.find(itemx => itemx.date === day);
              const isSpecialtShift = foundRecord?.dayType === "work" && foundRecord?.shift === "specialt_shift";
              const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
                const stopDayDate = parseInt(stopDay.date);
                const currentDay = parseInt(day);
                return stopDayDate === currentDay;
              });
              const specialIndividual = isSpecialtShift || isInStopDaysList;
              
              // 🆕 เพิ่มการตรวจสอบวันหยุดส่วนบุคคล
              const isPersonalDayOff = record?.personalDayOff?.some(personalDay => {
                const personalDayDate = parseInt(personalDay.date);
                const currentDay = parseInt(day);
                return personalDayDate === currentDay;
              });

              // 🆕 เพิ่มการตรวจสอบ isAbsent จากข้อมูลพนักงาน
              let isAbsent = false;
              if (record && record.employee_record) {
                isAbsent = foundRecord?.dayType === "work"; // ตรวจสอบว่าเป็นวันที่มาทำงานหรือไม่
              }

              // ตรวจสอบว่ามีค่าโอที 2 หรือ โอที 3 ในวันนี้หรือไม่
              const ot2Value = employeeRows[3]?.[dayIdx + 2]; // โอที 2 (empRow4)
              const ot3Value = employeeRows[4]?.[dayIdx + 2]; // โอที 3 (empRow5)
              const hasOT2 = ot2Value && ot2Value !== '' && ot2Value !== null && ot2Value !== undefined;
              const hasOT3 = ot3Value && ot3Value !== '' && ot3Value !== null && ot3Value !== undefined;
              
              // 🆕 เพิ่มการตรวจสอบการลา (เหมือนกับ HTML table)
              const isSickLeave = record?.addSalaryList?.some(salaryItem => {
                // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
                if (salaryItem.welfareType === "ลาป่วย" || 
                    salaryItem.welfareType === "ลาคลอด" ||
                    salaryItem.name?.includes("ลาป่วย") || 
                    salaryItem.name?.includes("ป่วย") ||
                    salaryItem.name?.includes("ลาพักร้อน") ||
                    salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
                  
                  // แปลง date string เป็น array ของวันที่
                  const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
                  const currentDay = parseInt(day);
                  
                  const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
                  return isMatch;
                }
                return false;
              });
              
              // ตรวจสอบ cash_holiday ก่อนเพื่อให้สีแดงในกรณีวันหยุด
              const isCashHolidayWithRedText = rowIdx === 1 && cellValue === '1' && foundRecord?.shift === "cash_holiday" && foundRecord?.startTime && (() => {
                const startTimeHour = parseFloat(foundRecord.startTime.replace('.', ':').split(':')[0]);
                return startTimeHour >= 18 || (startTimeHour >= 0 && startTimeHour <= 5);
              })();

              // Apply specific styling based on row type and cell content (ใช้ลำดับความสำคัญเหมือน HTML)
              if (isSickLeave) {
                // 🖤 วันลา - สีฟ้าอ่อน (ความสำคัญสูงสุด)
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFC5EAEB' } // สีฟ้าอ่อน #c5eaebff
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FF000000' } // ตัวอักษรสีดำ
                };
                console.log(`Applied sick leave color to cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              } else if (specialIndividual) {
                // � วันหยุดพิเศษ - สีเทาพื้นหลังและตัวอักษรสีแดง (ความสำคัญรองลงมา)
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF9E9E9E' } // สีเทา #9e9e9e
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FFFF0000' } // ตัวอักษรสีแดง
                };
                console.log(`Applied gray background with red text to special individual cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              } else if (isPersonalDayOff) {
                // 🟢 วันหยุดส่วนบุคคล - สีเขียว
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FF00FF00' } // สีเขียว #00ff00
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FF000000' }
                };
                console.log(`Applied green to personal day off cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              } else if (isCashHolidayWithRedText) {
                // 🔴 cash_holiday ในช่วงเวลากะดึก - ตัวอักษรสีแดงบนพื้นหลังขาว (สำหรับแถวกะดึก)
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' } // สีขาว #ffffff (เปลี่ยนจากสีเทา)
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FFFF0000' } // ตัวอักษรสีแดง
                };
                console.log(`Applied white background with RED text to cash_holiday cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              } else if (rowIdx === 3) { // โอที 2 (empRow4) - ตรวจสอบก่อนวันหยุดหน่วยงาน
                if (cellValue && cellValue !== '' && cellValue !== null && cellValue !== undefined) {
                  // โอที 2 มีค่า - สีเหลือง
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' } // สีเหลือง
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' } // ตัวอักษรสีดำ
                  };
                  console.log(`Applied yellow to OT2 cell with value: ${cellValue} in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
                } else if (isDayoffWorkplace || isDayOffOnly) {
                  // โอที 2 ไม่มีค่า แต่เป็นวันหยุดหน่วยงาน - สีเทา
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFAE0F1' } // ชมพู #FAE0F1
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' }
                  };
                  console.log(`Applied gray to OT2 holiday cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
                } else {
                  // โอที 2 ไม่มีค่า และไม่ใช่วันหยุด - สีขาว (วันปกติ)
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' } // ตัวอักษรสีดำ
                  };
                }
              } else if (rowIdx === 4) { // โอที 3 (empRow5) - ตรวจสอบก่อนวันหยุดหน่วยงาน
                if (cellValue && cellValue !== '' && cellValue !== null && cellValue !== undefined) {
                  // โอที 3 มีค่า - สีชมพู
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFAE0F1' } // สีชมพู
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' } // ตัวอักษรสีดำ
                  };
                  console.log(`Applied pink to OT3 cell with value: ${cellValue} in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
                } else if (isDayoffWorkplace || isDayOffOnly) {
                  // โอที 3 ไม่มีค่า แต่เป็นวันหยุดหน่วยงาน - สีเทา
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF9E9E9E' } // สีเทา #9e9e9e
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' }
                  };
                  console.log(`Applied gray to OT3 holiday cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
                } else {
                  // โอที 3 ไม่มีค่า และไม่ใช่วันหยุด - สีขาว (วันปกติ)
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                  cell.font = {
                    bold: false,
                    size: 9,
                    color: { argb: 'FF000000' } // ตัวอักษรสีดำ
                  };
                }
              } else if (isDayoffWorkplace || isDayOffOnly) {
                // 🔵 วันหยุดหน่วยงาน - สีเทา (สำหรับแถวอื่นๆ)
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '' } // สีเทา #9e9e9e
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FF000000' }
                };
                console.log(`Applied gray to holiday cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              } else {
                // ⚪ วันปกติ - สีขาว (default)
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' } // สีขาว
                };
                cell.font = {
                  bold: false,
                  size: rowIdx <= 1 ? 14 : 9,
                  color: { argb: 'FF000000' }
                };
                console.log(`Applied white to normal day cell in ${rowNames[rowIdx]} row, day ${day} (${actualRowNumber}, ${colNumber})`);
              }
            });
          });
          
          currentRowIndex += 5; // เพิ่มแถวไป 5 แถว
          if ((idx + 1) % employeesPerPage === 0 && idx !== dataArray.length - 1) {
    pageBreakRows.push(currentRowIndex - 1);
  }

         
console.log(`Employee ${idx + 1} ends at row ${currentRowIndex - 1}, page ${currentPage}, position ${currentPageEmployeeCount} of ${employeesPerPage}`);
  
  console.log(`พนักงานคนที่ ${idx + 1} สิ้นสุดที่แถว ${currentRowIndex - 1}`);
          
          
        }); // ปิด forEach
        
        console.log(`✅ Successfully added ${dataArray.length} employees to worksheet`);
      
// Apply page breaks ถ้ามี

  // Reset print area ก่อน
 
  // Set page breaks
 
  
  // Force Excel to respect our page breaks
  worksheet.pageSetup.usePageBreaks = true;

      }
      
      
      // Summary rows
      console.log('📊 Adding summary rows...');
      
      // Total employees per day
      const totalEmpRow = ['รวมพนักงานทำงาน/วัน', ''];
      dayNumbers.forEach((day, i) => {
        const count = employeeCountPerDay[i] || 0;
        totalEmpRow.push(count === 0 ? '' : count);
      });
      totalEmpRow.push(employeeCountPerDay.reduce((total, count) => total + (count || 0), 0));
const remainingColsTotal = row1.length - totalEmpRow.length;
for (let i = 0; i < remainingColsTotal; i++) {
    totalEmpRow.push('');
}
      
      // Mark special styling for empty work days (gray background)
      totalEmpRow.specialStyles = {};
      dayNumbers.forEach((day, i) => {
        const count = employeeCountPerDay[i] || 0;
        if (count === 0) {
          totalEmpRow.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "รวมพนักงานทำงาน/วัน" และ ""
            backgroundColor: '', // สีเทา
            fontColor: 'FF000000',      // ตัวอักษรสีดำ
            fontWeight: 'bold'
          };
        }
      });

      // Contract employees per day (รวมพนักงานตามสัญญา/วัน)
      const contractEmpRow = ['รวมพนักงานตามสัญญา/วัน', ''];
      dayNumbers.forEach((day, i) => {
        const count = contractEmployeeCount || 0;
        contractEmpRow.push(count === 0 ? '' : count);
      });
      // รวมพนักงานตามสัญญาทั้งหมด = จำนวนพนักงานตามสัญญา × จำนวนวันที่มีการทำงาน
      const workingDaysCount = dayNumbers.filter(day => {
        const dayIndex = dayNumbers.indexOf(day);
        return (employeeCountPerDay[dayIndex] || 0) > 0;
      }).length;
      contractEmpRow.push(contractEmployeeCount ? contractEmployeeCount * workingDaysCount : 0);
const remainingColsContract = row1.length - contractEmpRow.length;
for (let i = 0; i < remainingColsContract; i++) {
    contractEmpRow.push('');
}
      
      // Mark special styling for contract employees row
      contractEmpRow.specialStyles = {};
      dayNumbers.forEach((day, i) => {
        const count = contractEmployeeCount || 0;
        if (count === 0) {
          contractEmpRow.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "รวมพนักงานตามสัญญา/วัน" และ ""
            backgroundColor: 'FFD3D3D3', // สีเทา
            fontColor: 'FF000000',      // ตัวอักษรสีดำ
            fontWeight: 'bold'
          };
        } else {
          contractEmpRow.specialStyles[i + 2] = {
            fontColor: 'FF0000FF',      // ตัวอักษรสีน้ำเงิน
            fontWeight: 'bold'
          };
        }
      });
      
      // Absent employees per day
      const absentEmpRow = ['พนักงานขาดงาน', ''];
      dayNumbers.forEach((day, i) => {
        const absentCount = absentEmployeesPerDay[i] || 0;
        absentEmpRow.push(absentCount === 0 ? '' : absentCount);
      });
      absentEmpRow.push(absentEmployeesPerDay.reduce((total, count) => total + (count || 0), 0));
      absentEmpRow.push('', '');
      absentEmpRow.push(
        formatTimeValueForExcel(totalOtPublicHoliday), 
        formatTimeValueForExcel(totalOtWithOvertime1_5), 
        formatTimeValueForExcel(totalOtWithOvertime3)
      );
      
      // Mark special styling for empty days (gray background) and holiday work columns
      absentEmpRow.specialStyles = {
        [absentEmpRow.length - 3]: { // ทำงานวันหยุด/นักขัต
          backgroundColor: 'FFFFF7C2',
          fontColor: 'FF1654A6',
          fontWeight: 'bold'
        },
        [absentEmpRow.length - 2]: { // โอที 1.5 เท่า  
          backgroundColor: 'FFFFF7C2',
          fontColor: 'FF008000',
          fontWeight: 'bold'
        },
        [absentEmpRow.length - 1]: { // โอที 3 เท่า
          backgroundColor: 'FFFFF7C2', 
          fontColor: 'FF1654A6',
          fontWeight: 'bold'
        } 
      };
      
      // Add gray styling for days with no absent employees and red text for days with absent employees
      dayNumbers.forEach((day, i) => {
        const absentCount = absentEmployeesPerDay[i] || 0;
        if (absentCount === 0) {
          absentEmpRow.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "พนักงานขาดงาน" และ ""
            backgroundColor: '', // สีเทา
            fontColor: 'FF000000',      // ตัวอักษรสีดำ
            fontWeight: 'bold'
          };
        } else {
          // ช่องที่มีค่าขาดงาน ให้ตัวอักษรสีแดง
          absentEmpRow.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "พนักงานขาดงาน" และ ""
            fontColor: 'FFFF0000',      // ตัวอักษรสีแดง (แก้ไขให้ถูกต้อง)
            fontWeight: 'bold'
          };
        }
      });
      
      // Apply red text color to total absent column if there are absent employees
      const totalAbsent = absentEmployeesPerDay.reduce((total, count) => total + (count || 0), 0);
      if (totalAbsent > 0) {
        const totalColumnIndex = dayNumbers.length + 2; // +2 เพราะมี column A,B ก่อนหน้า
        absentEmpRow.specialStyles[totalColumnIndex] = {
          fontColor: 'FFFF0000',      // ตัวอักษรสีแดง
          fontWeight: 'bold'
        };
      }
      
      const remainingColsAbsent = row1.length - absentEmpRow.length;
for (let i = 0; i < remainingColsAbsent; i++) {
    absentEmpRow.push('');
}
      
      // OT 1.5 summary
      const ot15Row = ['โอที 1.5 เท่า', ''];
      dayNumbers.forEach((day, i) => {
        const overtimeSum = overtimeSumPerDay[i] || 0;
        ot15Row.push(overtimeSum === 0 ? '' : formatTimeValueForExcel(overtimeSum));
      });
      ot15Row.push(formatTimeValueForExcel(overtimeSumPerDay.reduce((total, sum) => total + (sum || 0), 0)));
const remainingColsOt15 = row1.length - ot15Row.length;
for (let i = 0; i < remainingColsOt15; i++) {
    ot15Row.push('');
}

      
      // Mark special styling for empty OT 1.5 days (gray background)
      ot15Row.specialStyles = {};
      dayNumbers.forEach((day, i) => {
        const overtimeSum = overtimeSumPerDay[i] || 0;
        if (overtimeSum === 0) {
          ot15Row.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "โอที 1.5 เท่า" และ ""
            backgroundColor: '', // สีเทา
            fontColor: 'FF008000',      // ตัวอักษรสีเขียว
            fontWeight: 'bold'
          };
        }
      });

  
            
      // OT 2 summary
      const ot2Row = ['โอที 2 เท่า', ''];
      dayNumbers.forEach((day, i) => {
        const overtime2Sum = overtime2SumPerDay[i] || 0;
        ot2Row.push(overtime2Sum === 0 ? '' : formatTimeValueForExcel(overtime2Sum));
      });
      ot2Row.push(formatTimeValueForExcel(overtime2SumPerDay.reduce((total, sum) => total + (sum || 0), 0)));
const remainingColsOt2 = row1.length - ot2Row.length;
for (let i = 0; i < remainingColsOt2; i++) {
    ot2Row.push('');
}

      
      // Mark special styling for OT 2 days with values (yellow background)
      ot2Row.specialStyles = {};
      dayNumbers.forEach((day, i) => {
        const overtime2Sum = overtime2SumPerDay[i] || 0;
        if (overtime2Sum > 0) { // เทสีเหลืองเฉพาะช่องที่มีค่า
          ot2Row.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "โอที 2 เท่า" และ ""
            backgroundColor: 'FFFFFF00', // สีเหลือง
            fontColor: 'FF000000',      // ตัวอักษรสีดำ
            fontWeight: 'bold'
          };
        }
      });
      
      // OT 3 summary
      const ot3Row = ['โอที 3 เท่า', ''];
      dayNumbers.forEach((day, i) => {
        const overtime3Sum = overtime3SumPerDay[i] || 0;
        ot3Row.push(overtime3Sum === 0 ? '' : formatTimeValueForExcel(overtime3Sum));
      });
      ot3Row.push(formatTimeValueForExcel(overtime3SumPerDay.reduce((total, sum) => total + (sum || 0), 0)));
const remainingColsOt3 = row1.length - ot3Row.length;
for (let i = 0; i < remainingColsOt3; i++) {
    ot3Row.push('');
}

      
      // Mark special styling for OT 3 days with values (light pink background)
      ot3Row.specialStyles = {};
      dayNumbers.forEach((day, i) => {
        const overtime3Sum = overtime3SumPerDay[i] || 0;
        if (overtime3Sum > 0) { // เทสี #fae0f1 เฉพาะช่องที่มีค่า
          ot3Row.specialStyles[i + 2] = { // +2 เพราะ column A,B เป็น "โอที 3 เท่า" และ ""
            backgroundColor: 'FFFAE0F1', // สี #fae0f1 (ชมพูอ่อน)
            fontColor: 'FF000000',      // ตัวอักษรสีดำ
            fontWeight: 'bold'
          };
        }
      });
      
      // Add summary rows to worksheet
      console.log('📋 Adding summary rows to worksheet...');
      const summaryStartRow = currentRowIndex;
      worksheet.addRow(totalEmpRow);
      worksheet.addRow(contractEmpRow); // เพิ่มแถวพนักงานตามสัญญา
      const absentRowRef = worksheet.addRow(absentEmpRow);
      worksheet.addRow(ot15Row);
      worksheet.addRow(ot2Row);
      worksheet.addRow(ot3Row);
      
      // Apply special styling to specific cells in total employee row (gray for no employees)
      if (totalEmpRow.specialStyles) {
        console.log('🎨 Applying special styles to total employee row...');
        Object.entries(totalEmpRow.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow; // totalEmpRow is first summary row
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: style.backgroundColor }
            };
            
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            console.log(`Applied gray style to total employee cell (${rowNumber}, ${colNumber})`);
          } catch (error) {
            console.warn(`Failed to apply special style to total employee cell index ${cellIndex}:`, error.message);
          }        });
      }

      // Apply special styling to specific cells in contract employee row
      if (contractEmpRow.specialStyles) {
        console.log('🎨 Applying special styles to contract employee row...');
        Object.entries(contractEmpRow.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow + 1; // contractEmpRow is second summary row (0-based, so +1)
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: style.backgroundColor }
            };
            
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            console.log(`Applied style to contract employee cell (${rowNumber}, ${colNumber})`);
          } catch (error) {
            console.warn(`Failed to apply special style to contract employee cell index ${cellIndex}:`, error.message);
          }
        });
      }

      // Apply special styling to specific cells in absent employee row
      if (absentEmpRow.specialStyles) {
        console.log('🎨 Applying special styles to absent employee row...');
        Object.entries(absentEmpRow.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow + 2; // absentEmpRow is now third summary row (0-based, so +2)
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            // Apply background color if exists
            if (style.backgroundColor) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: style.backgroundColor }
              };
            }
            
            // Apply font styling - Make sure red text is properly set
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            // Special handling for red text cells - force red color
            if (style.fontColor === 'FFFF0000') {
              console.log(`🔴 Forcing red text color for absent employee cell (${rowNumber}, ${colNumber}) with value: ${cell.value}`);
              
              // Clear any existing formatting first
              cell.font = {};
              cell.numFmt = '0'; // Ensure simple number format
              
              // Force red color with explicit properties
              cell.font = {
                name: 'Calibri',
                size: 9,
                bold: true,
                color: { argb: 'FFFF0000' }
              };
              
              // Additional verification - log what was actually set
              console.log(`🔍 Cell font after setting:`, JSON.stringify(cell.font));
              
              // Force value to be a number if it's a numeric string
              if (typeof cell.value === 'string' && !isNaN(cell.value) && cell.value !== '') {
                cell.value = parseInt(cell.value);
              }
            }
            
            console.log(`Applied special style to absent employee cell (${rowNumber}, ${colNumber}) - Font Color: ${style.fontColor}`);
          } catch (error) {
            console.warn(`Failed to apply special style to absent employee cell index ${cellIndex}:`, error.message);
          }
        });
      }
      
      // Apply special styling to specific cells in OT 1.5 row
      if (ot15Row.specialStyles) {
        console.log('🎨 Applying special styles to OT 1.5 row...');
        Object.entries(ot15Row.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow + 3; // ot15Row is now fourth summary row (0-based, so +3)
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: style.backgroundColor }
            };
            
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            console.log(`Applied special style to OT 1.5 cell (${rowNumber}, ${colNumber})`);
          } catch (error) {
            console.warn(`Failed to apply special style to OT 1.5 cell index ${cellIndex}:`, error.message);
          }
        });
      }
      
      // Apply special styling to specific cells in OT 2 row
      if (ot2Row.specialStyles) {
        console.log('🎨 Applying special styles to OT 2 row...');
        Object.entries(ot2Row.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow + 4; // ot2Row is now fifth summary row (0-based, so +4)
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: style.backgroundColor }
            };
            
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            console.log(`Applied special style to OT 2 cell (${rowNumber}, ${colNumber})`);
          } catch (error) {
            console.warn(`Failed to apply special style to OT 2 cell index ${cellIndex}:`, error.message);
          }
        });
      }
      
      // Apply special styling to specific cells in OT 3 row
      if (ot3Row.specialStyles) {
        console.log('🎨 Applying special styles to OT 3 row...');
        Object.entries(ot3Row.specialStyles).forEach(([cellIndex, style]) => {
          try {
            const colNumber = parseInt(cellIndex) + 1; // Convert to 1-based column number
            const rowNumber = summaryStartRow + 5; // ot3Row is now sixth summary row (0-based, so +5)
            const cell = worksheet.getCell(rowNumber, colNumber);
            
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: style.backgroundColor }
            };
            
            cell.font = {
              bold: style.fontWeight === 'bold',
              size: 9,
              color: { argb: style.fontColor }
            };
            
            console.log(`Applied special style to OT 3 cell (${rowNumber}, ${colNumber})`);
          } catch (error) {
            console.warn(`Failed to apply special style to OT 3 cell index ${cellIndex}:`, error.message);
          }
        });
      }
      
      // Merge cells A and B for each summary row and apply colors
      console.log('🔗 Merging summary row cells A and B with colors...');
      for (let i = 0; i < 6; i++) { // เพิ่มจาก 5 เป็น 6 แถว (เพิ่มแถว contract employees)
        const rowNum = summaryStartRow + i;
        safeMergeCell(`A${rowNum}:B${rowNum}`);
        
        // Apply colors to merged cells
        try {
          const cellA = worksheet.getCell(`A${rowNum}`);
          const cellB = worksheet.getCell(`B${rowNum}`);
          const fillColor = 'FFFFF7C2'; // สีเดียวกันทั้งหมด #fff7c2
          
          // Apply styling to both cells A and B to ensure proper formatting
          [cellA, cellB].forEach(cell => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: fillColor }
            };
            
            // Set font with proper Thai text support
            
            
            // Note: Alignment will be applied in the final step based on row content
          });
          
          console.log(`Applied color ${fillColor} to summary row ${rowNum} (cells A and B) - alignment will be set later`);
        } catch (colorError) {
          console.warn(`Failed to apply color to summary row ${rowNum}:`, colorError.message);
        }
      }
      
      console.log('✅ Summary rows added successfully');
      
      // เพิ่มตารางข้อมูลเพิ่มเติมในหน้าสุดท้าย (แยกจากตารางหลัก)
      console.log('📋 Adding additional information table for last page...');
      
     

// console.log('📏 Setting column widths...');
const welfareColumns = workplaceAddsalary ? mergeWorkplaceAddsalary(workplaceAddsalary).map(() => ({ width: 10 })) : []; // เพิ่มจาก 8 เป็น 10
worksheet.columns = [
  { width: 10 },    // ลำดับ (เพิ่มจาก 6)  
  { width: 40 },   // ชื่อ-สกุล (เพิ่มจาก 26)
  ...dayNumbers.map(() => ({ width: 6 })), // วันที่ (เพิ่มจาก 5)
  { width: 15 },   // รวมวันทำงาน (เพิ่มจาก 8)
  { width: 10 },   // วันหยุด (เพิ่มจาก 8)
  { width: 10 },   // วันนักขัต (เพิ่มจาก 8)
  { width: 10 },   // ทำงานวันหยุด/นักขัต (เพิ่มจาก 8)
  { width: 15 },   // โอที 1.5 เท่า (เพิ่มจาก 8)
  { width: 10 },   // โอที 3 เท่า (เพิ่มจาก 8)
  ...welfareColumns, // สวัสดิการ
  { width: 10 },   // หักประกันสังคม (เพิ่มจาก 8)
  { width: 10 }    // หมายเหตุ (เพิ่มจาก 8)
];
      
      // Set page setup for A4 size
      console.log('📄 Setting page setup for A4...');
worksheet.pageSetup = {
  paperSize: 9, // A4 paper size
  orientation: 'landscape',
  fitToPage: true,
  fitToWidth: 0,
  fitToHeight: 0,
  printTitlesRow: '5:8', // แสดงหัวตารางแถว 5-8 ในทุกหน้า (เปลี่ยนจาก 3:6 เนื่องจากมีแถวว่าง 4 แถว)


  margins: {
    left: 0.25,   // Narrow margin (ประมาณ 0.6 cm)
    right: 0.25,  // Narrow margin
    top: 0.2,     // ขยับตารางขึ้นชิดขอบบน
    bottom: 0.3,  // ลดระยะห่างจากขอบล่าง
    header: 0.1,  // ลดระยะห่าง header
    footer: 0.1   // ลดระยะห่าง footer
  },
  horizontalCentered: true,
  verticalCentered: false
};




// Force Excel to respect our page breaks
worksheet.pageSetup.usePageBreaks = true;

// Set print area and scaling
console.log('🖨️ Setting print options...');
worksheet.pageSetup.printArea = `A1:${String.fromCharCode(65 + worksheet.columnCount - 1)}${worksheet.rowCount}`;
worksheet.pageSetup.scale = 100; // ลดขนาดตัวอักษรเป็น 85% เพื่อให้พอดี A4
      worksheet.pageSetup = {
  paperSize: 9, // A4 paper size
  orientation: 'landscape',
  scale: 120, // 
  fitToPage: true,
  fitToWidth: 1,
  printTitlesRow: '5:8', // แสดงหัวตารางแถว 5-8 ในทุกหน้า (เปลี่ยนจาก 3:6 เนื่องจากมีแถวว่าง 4 แถว)



  fitToHeight: 0,
  margins: {
    left: 0.25,   // Narrow margin (ประมาณ 0.6 cm)
    right: 0.25,  // Narrow margin
    top: 0.2,     // ขยับตารางขึ้นชิดขอบบน
    bottom: 0.3,  // ลดระยะห่างจากขอบล่าง
    header: 0.1,  // ลดระยะห่าง header
    footer: 0.1   // ลดระยะห่าง footer
  },
  horizontalCentered: true,

    verticalCentered: false
};
      
   
      const currentDate = new Date().toLocaleDateString('th-TH');
      const workplaceName = searchWorkplaceName || searchWorkplaceId || 'ทุกหน่วยงาน';
      const monthYear = month && year ? `${month}/${year}` : 'ไม่ระบุ';

      // const headerText = `&"Angsana New,Bold"&20บริษัท โอวาท โปร แอนด์ ควิก จำกัด 
      // &ใบแสดงเวลาการทำปฏิบัติงานหน่วยงาน &U${workplaceName}&U ประจำเดือน${monthName}
      // &20 รอบวันที่ 21 ${monthName2 } ${yearBE } - 20 ${monthName} ${yearBE} ( จ่ายเงินวันที่ 30 ${monthName} ${yearBE}  )`;

      
     worksheet.headerFooter = {
  // firstHeader: headerText,
  firstFooter: '&L&"Angsana New"&12สร้างโดย: ระบบ Owat System&C&10หน้า &P จาก &N&R&10พิมพ์วันที่: ' + currentDate,
  // evenHeader: headerText,
  evenFooter: '&L&"Angsana New"&12สร้างโดย: ระบบ Owat System&C&10หน้า &P จาก &N&R&10พิมพ์วันที่: ' + currentDate,
  // oddHeader: headerText,
  oddFooter: '&L&"Angsana New"&12สร้างโดย: ระบบ Owat System&C&10หน้า &P จาก &N&R&10พิมพ์วันที่: ' + currentDate
};

// ตั้งค่า margin ตามจำนวนพนักงาน
console.log(`📊 Employee count: ${dataArray.length} employees`);
if (dataArray.length > 5) {
  // สำหรับพนักงานมากกว่า 5 คน - ใช้ margin แบบแน่น
  console.log('🔧 Using tight margins for many employees...');
  worksheet.pageSetup.margins = {
    left: 0.1,   // Narrow margin (ประมาณ 0.6 cm)
    right: 0.1,  // Narrow margin
    top: 0.2,     // ขยับตารางขึ้นชิดขอบบน
    bottom: 1.2,  // ลดระยะห่างจากขอบล่าง
    header: 0.1,  // ลดระยะห่าง header
    footer: 0  // ลดระยะห่าง footer
  };
} else if (dataArray.length <5) {
  // สำหรับพนักงาน 5 คนหรือน้อยกว่า - ใช้ margin แบบสบาย
  console.log('🔧 Using comfortable margins for few employees...');
  worksheet.pageSetup.margins = {
    left: 0.25,   // Narrow margin (ประมาณ 0.6 cm)
    right: 0.25,  // Narrow margin
    top: 0.2,     // เพิ่มระยะห่างเพื่อไม่ให้ตารางทับ header
    bottom: 0.3,  // เพิ่มระยะห่างจากขอบล่าง
    header: 0.05,  // header ชิดขอบบน
    footer: 0.2  // footer ห่างจากขอบล่างนิดหน่อย
  };
}
else if(dataArray.length === 5) {
   console.log('🔧 Using comfortable margins for few employees...');
  worksheet.pageSetup.margins = {
    left: 0.25,   // Narrow margin (ประมาณ 0.6 cm)
    right: 0.25,  // Narrow margin
    top: 0.2,     // เพิ่มระยะห่างเพื่อไม่ให้ตารางทับ header
    bottom: 0.4,  // เพิ่มระยะห่างจากขอบล่าง
    header: 0,  // header ชิดขอบบน
    footer: 0  // footer ห่างจากขอบล่างนิดหน่อย
  };
}
   
  


      
      // Apply basic styling to all cells using ExcelJS
      console.log('🎨 Starting cell styling with holiday colors...');
      console.log('- Month:', month, 'Year:', year);
      console.log('- weekendData available:', typeof weekendData !== 'undefined' && weekendData ? 'Yes' : 'No');
      
      try {
        worksheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colIndex) => {
            // Skip cells that are part of merged ranges to avoid conflicts
            // Check if this cell is part of a merged range (basic check for header area)
            const isInMergedArea = rowIndex <= 8 && ( // เปลี่ยนจาก 6 เป็น 8 เนื่องจากแทรกแถวว่าง 4 แถว
              colIndex === 1 || // Column A (ลำดับ)
              colIndex === 2 || // Column B (ชื่อ-สกุล)
              (colIndex >= 3 && colIndex <= 2 + dayNumbers.length) || // Day columns
              colIndex === 3 + dayNumbers.length // รวมวันทำงาน column
            );
            
            try {
              // Apply borders (ยกเว้นแถวที่ 1 และแถวว่าง 2-4)
              if (rowIndex !== 1 && !(rowIndex >= 2 && rowIndex <= 4)) {
                cell.border = {
                  top: {style:'thin'},
                  left: {style:'thin'},
                  bottom: {style:'thin'},
                  right: {style:'thin'}
                };
              } else {
                // แถวที่ 1 และแถวว่าง (2-4) ไม่มี border
                cell.border = {};
              }
              
              // Apply alignment for better readability
              cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true // ให้ตัดบรรทัดอัตโนมัติ
              };
              
              // Set font size for better A4 fitting
              cell.font = cell.font || {};
              // กำหนดฟอนต์ขนาด 14 เป็นค่าเริ่มต้นสำหรับทุกเซลล์ ยกเว้นแถวที่ 1, 2, และ 3
              if (rowIndex !== 1 && rowIndex !== 2 && rowIndex !== 3 && rowIndex !== 4) {
                cell.font.size = 22; // เพิ่มตัวอักษรเป็น 14pt สำหรับทุกแถว ยกเว้นแถวที่ 1, 2, และ 3
              }
              
              // Header styling (first 4 rows)
              if (rowIndex <= 8) { // เปลี่ยนจาก 6 เป็น 8 เนื่องจากแทรกแถวว่าง 4 แถว
                if (rowIndex === 1) {
                  // แถวที่ 1 (ชื่อบริษัท) ใช้ฟอนต์ขนาด 30
                  cell.font = { bold: true, size: 30 };
                  
                  // ตรวจสอบว่าเป็นช่วง AQ-AT หรือไม่ (คอลัมน์ 43-46)
                  if (colIndex >= 43 && colIndex <= 46) { // AQ=43, AR=44, AS=45, AT=46
                    // ช่วง AQ-AT ให้เป็นสีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFFF00' } // สีเหลือง
                    };
                  } else {
                    // ส่วนอื่นของแถวที่ 1 ให้เป็นสีขาว
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFFFFF' } // สีขาว
                    };
                  }
                  
                  // ตั้งค่าความสูงแถวพิเศษ
                  row.height = 30;
                  // Return เร็วเพื่อไม่ให้โค้ดส่วนอื่นมา override
                  return;
                } else if (rowIndex === 2) {
                  // แถวที่ 2 (ใบลงเวลาการปฏิบัติงาน) ใช้ฟอนต์ขนาด 30 และ underline
                  cell.font = { bold: true, size: 30, underline: true };
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                  // ตั้งค่าความสูงแถวพิเศษ
                  row.height = 30;
                  // Return เร็วเพื่อไม่ให้โค้ดส่วนอื่นมา override
                  return;
                } else if (rowIndex === 3) {
                  // แถวที่ 3 (หน่วยงาน) ใช้ฟอนต์ขนาด 30
                  cell.font = { bold: true, size: 30 };
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                  // ตั้งค่าความสูงแถวพิเศษ
                  row.height = 30;
                  // Return เร็วเพื่อไม่ให้โค้ดส่วนอื่นมา override
                  return;
                }else if (rowIndex === 4) {
                  // แถวที่ 3 (หน่วยงาน) ใช้ฟอนต์ขนาด 30
                  cell.font = { bold: true, size: 30 };
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                  // ตั้งค่าความสูงแถวพิเศษ
                  row.height = 30;
                  // Return เร็วเพื่อไม่ให้โค้ดส่วนอื่นมา override
                  return;
                } else {
                  // แถวอื่นๆ ใช้ฟอนต์ขนาด 14
                  cell.font = { bold: true, size: 25 }; // Header ใช้ตัวหนา ขนาด 14pt (เพิ่มจาก 12pt)
                }
                
                // Set row height for headers with special height for row 8
                if (rowIndex === 1) {
                  // แถวที่ 1 (ชื่อบริษัท) ใช้ความสูงพิเศษสำหรับฟอนต์ขนาด 30
                  row.height = 40; // เพิ่มความสูงสำหรับฟอนต์ขนาด 30

                } else if (rowIndex === 8) { // เปลี่ยนจาก 6 เป็น 8 เนื่องจากแทรกแถวว่าง 4 แถว
                  row.height = 120; // เพิ่มความสูงแถวที่ 4 (overtime labels) จาก 85 เป็น 95
                } else {
                  row.height = 34; // เพิ่มความสูงปกติสำหรับแถว header อื่นๆ จาก 18 เป็น 22
                }
                
                // ลำดับและชื่อ-สกุล ให้เป็นสีขาว (ยกเว้นแถวที่ 1 ที่เป็นชื่อบริษัท)
                if (rowIndex !== 1 && (colIndex === 1 || colIndex === 2)) {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                }
                // แถวว่าง (2-4) ให้เป็นสีขาวทั้งหมด
                else if (rowIndex >= 2 && rowIndex <= 4) {
                  cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFFF' } // สีขาว
                  };
                }
                // วันหยุดสี สำหรับคอลัมน์ C ถึง AG (วันที่ 1-31) ใน header rows เท่านั้น (ยกเว้นแถวที่ 1 และแถวว่าง 2-4)
                else if (rowIndex !== 1 && rowIndex > 4 && colIndex >= 3 && colIndex <= 33) { // คอลัมน์ C ถึง AG
                  const dayIndex = colIndex - 3; // แปลงเป็น index ของ dayNumbers
                  if (dayIndex < dayNumbers.length) {
                    const day = dayNumbers[dayIndex];
                    const dayNum = parseInt(day);
                    
                    // กำหนดเดือนและปีสำหรับการตรวจสอบ
                    let targetMonth, targetYear;
                    if (dayNum >= 21) {
                      // วันที่ 21-31 เป็นเดือนก่อนหน้า
                      targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
                      targetYear = year ? parseInt(year) : new Date().getFullYear();
                      if (targetMonth <= 0) {
                        targetMonth = 12;
                        targetYear -= 1;
                      }
                    } else {
                      // วันที่ 1-20 เป็นเดือนปัจจุบัน
                      targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
                      targetYear = year ? parseInt(year) : new Date().getFullYear();
                    }
                    
                    // สร้าง date string สำหรับตรวจสอบวันหยุด
                    const formattedMonth = targetMonth.toString().padStart(2, '0');
                    const formattedDay = dayNum.toString().padStart(2, '0');
                    const dateString = `${targetYear}-${formattedMonth}-${formattedDay}`;
                    
                    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
                    const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
                    const isInvalidDate = dayNum > daysInTargetMonth;
                    
                    // ถ้าเป็นวันที่ไม่มีอยู่จริง ให้แสดงสีเทา
                    if (isInvalidDate) {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF9E9E9E' } // สีเทา
                      };
                    } else {
                    // ตรวจสอบข้อมูลวันหยุดจาก weekendData (ถ้ามี)
                    if (typeof weekendData !== 'undefined' && weekendData && weekendData.length > 0) {
                      // เพิ่ม Debug logging สำหรับวัน (เฉพาะวันแรกๆ เพื่อไม่ให้ล้น console)
                      if (dayNum <= 5 && rowIndex === 5) { // เปลี่ยนจาก 2 เป็น 5 เนื่องจากแทรกแถวว่าง 4 แถว
                        console.log(`Debug day ${dayNum}, date ${dateString}:`);
                        console.log(`- weekendData available: ${weekendData.length} items`);
                        console.log(`- First few weekend dates: ${JSON.stringify(weekendData.slice(0, 3))}`);
                      }
                      
                      const weekendInfo = weekendData.find(item => item.date === dateString);
                      
                      // ถ้าเป็นวันสำคัญ ให้แสดง log เพื่อ debug
                      if (weekendInfo && rowIndex === 5) { // เปลี่ยนจาก 2 เป็น 5 เนื่องจากแทรกแถวว่าง 4 แถว
                        console.log(`Found weekend info for ${dateString}:`, weekendInfo);
                      }
                      
                      if (weekendInfo) {
                        switch (weekendInfo.type) {
                          case 'weekend':
                            // สร้าง Date object เพื่อตรวจสอบวันในสัปดาห์
                            const date = new Date(targetYear, targetMonth - 1, dayNum);
                            const dayOfWeek = date.getDay(); // 0 = อาทิตย์, 6 = เสาร์
                            
                            if (dayOfWeek === 6) {
                              // วันเสาร์ - สีฟ้า (rgb(79, 173, 234))
                              cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FF4FADEA' }
                              };
                            } else if (dayOfWeek === 0) {
                              // วันอาทิตย์ - สีแดง (rgb(234, 51, 35))
                              cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFEA3323' }
                              };
                            } else {
                              // วันอื่นๆ - สีขาว
                              cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFFFFF' } // สีขาว
                              };
                            }
                            break;
                          case 'dayOff':
                          case 'dayOffOnly':
                            // วันหยุดนักขัตฤกษ์ - สีเหลือง (rgb(255, 255, 84))
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FFFFFF54' }
                            };
                            break;
                          case 'weekendAndDayOff':
                            // วันหยุดพิเศษ - สีฟ้า
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FF4FADEA' }
                            };
                            break;
                          default:
                            // วันอื่นๆ - สีขาว
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FFFFFFFF' } // สีขาว
                            };
                        }
                      } else {
                        // ตรวจสอบวันหยุดจาก dayoffWorkplace และ dayOffOnly (ไม่รวมวันที่ไม่มีอยู่จริง)
                        let isHoliday = false;
                        
                        // ตรวจสอบ dayoffWorkplace
                        if (weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace)) {
                          isHoliday = weekendData.dayoffWorkplace.includes(dateString);
                        }
                        
                        // ตรวจสอบ dayOffOnly (ถ้ายังไม่เป็นวันหยุด)
                        if (!isHoliday && Array.isArray(weekendData)) {
                          const dayOffOnlyItem = weekendData.find(item => item.date === dateString && item.type === 'dayOffOnly');
                          isHoliday = !!dayOffOnlyItem;
                        }
                        
                        if (isHoliday) {
  // ตรวจสอบว่าเซลล์มีค่าหรือไม่
  const cellValue = cell.value;
  const hasValue = cellValue && cellValue !== '' && cellValue !== null && cellValue !== undefined;
  
  // ถ้าเป็นวันหยุดและไม่มีค่า ให้ระบายสีเทา
  if (!hasValue) {
    // วันหยุดจาก workplace - สีเทา (rgb(158, 158, 158))
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9E9E9E' }
    };
  }
  // ถ้ามีค่า ไม่ต้องระบายสีเทา (คงสีเดิมไว้)
} else {
  // ตรวจสอบวันเสาร์-อาทิตย์แบบปกติ (ถ้าไม่มีใน weekendData)
  const date = new Date(targetYear, targetMonth - 1, dayNum);
  const dayOfWeek = date.getDay();

                          if (dayOfWeek === 6) {
                            // วันเสาร์ - สีฟ้า
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FF4FADEA' }
                            };
                          } else if (dayOfWeek === 0) {
                            // วันอาทิตย์ - สีแดง
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FFEA3323' }
                            };
                          } else {
                            // วันธรรมดา - สีขาว
                            cell.fill = {
                              type: 'pattern',
                              pattern: 'solid',
                              fgColor: { argb: 'FFFFFFFF' } // สีขาว
                            };
                          }
                        }
                      }
                    } else {
                      // ถ้าไม่มี weekendData ให้ตรวจสอบแต่ dayoffWorkplace และ dayOffOnly (ไม่รวมวันที่ไม่มีอยู่จริง)
                      let isHoliday = false;
                      
                      // ตรวจสอบ dayoffWorkplace
                      if (weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace)) {
                        isHoliday = weekendData.dayoffWorkplace.includes(dateString);
                      }
                      
                      // ตรวจสอบ dayOffOnly (ถ้ายังไม่เป็นวันหยุด)
                      if (!isHoliday && Array.isArray(weekendData)) {
                        const dayOffOnlyItem = weekendData.find(item => item.date === dateString && item.type === 'dayOffOnly');
                        isHoliday = !!dayOffOnlyItem;
                      }
                      
                     if (isHoliday) {
  // ตรวจสอบว่าเซลล์มีค่าหรือไม่
  const cellValue = cell.value;
  const hasValue = cellValue && cellValue !== '' && cellValue !== null && cellValue !== undefined;
  
  // ถ้าเป็นวันหยุดและไม่มีค่า ให้ระบายสีเทา
  if (!hasValue) {
    // วันหยุดจาก workplace - สีเทา (rgb(158, 158, 158))
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9E9E9E' }
    };
  }
  // ถ้ามีค่า ไม่ต้องระบายสีเทา (คงสีเดิมไว้)
} else {
                        // ตรวจสอบวันเสาร์-อาทิตย์แบบปกติ
                        const date = new Date(targetYear, targetMonth - 1, dayNum);
                        const dayOfWeek = date.getDay();
                        
                        if (dayOfWeek === 6) {
                          // วันเสาร์ - สีฟ้า
                          cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FF4FADEA' }
                          };
                        } else if (dayOfWeek === 0) {
                          // วันอาทิตย์ - สีแดง
                          cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFEA3323' }
                          };
                        } else {
                          // วันธรรมดา - สีขาว
                          cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFFFF' } // สีขาว
                          };
                        }
                      }
                    }
                    } // ปิด if (isInvalidDate) - วันที่ไม่มีอยู่จริง
                  } else {
                    // คอลัมน์อื่นๆ ที่ไม่ใช่วันที่ - สีขาว (ยกเว้นแถวที่ 1 ที่มีการตั้งค่าแยก)
                    if (rowIndex !== 1) {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFFFF' } // สีขาว
                      };
                    }
                  }
                } else {
                  // ตรวจสอบคอลัมน์ overtime (ค่าล่วงเวลา), สวัสดิการ, รวมวันทำงาน, หักประกันสังคม %, หมายเหตุ
                  const totalWorkDaysColIndex = 3 + dayNumbers.length; // คอลัมน์รวมวันทำงาน
                  const overtimeStartCol = totalWorkDaysColIndex + 1; // เริ่มต้นคอลัมน์ค่าล่วงเวลา
                  const overtimeEndCol = totalWorkDaysColIndex + 5; // สิ้นสุดคอลัมน์ค่าล่วงเวลา (5 คอลัมน์)
                  
                  // คำนวณตำแหน่งคอลัมน์สวัสดิการ
                  const welfareStartCol = totalWorkDaysColIndex + 6; // เริ่มต้นคอลัมน์สวัสดิการ
                  const welfareColumnsCount = workplaceAddsalary?.length || 0;
                  const welfareEndCol = welfareStartCol + welfareColumnsCount - 1; // สิ้นสุดคอลัมน์สวัสดิการ
                  
                  // คำนวณตำแหน่งคอลัมน์สุดท้าย
                  const cashHolidayColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount; // วัน Cash Holiday
                  const socialSecurityColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 1; // หักประกันสังคม %
                  const employeeAllowanceColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 2; // เงินสงเคราะห์ลูกจ้าง
                  const notesColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 3; // หมายเหตุ
                  
                  if (colIndex === totalWorkDaysColIndex) {
                    // คอลัมน์รวมวันทำงาน - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (colIndex >= overtimeStartCol && colIndex <= overtimeEndCol) {
                    // คอลัมน์ค่าล่วงเวลา (วันหยุด, วันนักขัต, ทำงานวันหยุด/นักขัต, โอที 1.5 เท่า, โอที 3 เท่า) - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (welfareColumnsCount > 0 && colIndex >= welfareStartCol && colIndex <= welfareEndCol) {
                    // คอลัมน์สวัสดิการทั้งหมด (ค่าอาหาร, ค่าน้ำ/ไฟ/โทรศัพท์, ค่าตำแหน่ง, เบี้ยขยัน, ค่าเดินทาง)
                    // ตรวจสอบค่าในเซลล์ ถ้าเป็น "NO" ให้ใช้สีเทา ถ้าไม่ใช่ให้ใช้สีเหลือง
                    const cellValue = cell.value;
                    if (cellValue === "NO" || cellValue === "no" || cellValue === "No") {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF9E9E9E' } // สีเทา สำหรับค่า NO
                      };
                    } else {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                      };
                    }
                  } else if (colIndex === cashHolidayColIndex) {
                    // คอลัมน์วัน Cash Holiday - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (colIndex === socialSecurityColIndex) {
                    // คอลัมน์หักประกันสังคม % - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (colIndex === employeeAllowanceColIndex) {
                    // คอลัมน์เงินสงเคราะห์ลูกจ้าง - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (colIndex === notesColIndex) {
                    // คอลัมน์หมายเหตุ - สีเหลือง
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFF7C2' } // สีเหลือง #fff7c2
                    };
                  } else if (colIndex >= 27 && colIndex <= 34) { // คอลัมน์ AA-AH (27-34) - ไม่ใส่สี
                    // ไม่ใส่สีพื้นหลัง (ใช้สีขาว default)
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFFFFF' } // สีขาว
                    };
                  } else {
                    // คอลัมน์อื่นๆ - สีขาว
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFFFFF' } // สีขาว
                    };
                  }
                }
              } 
              // Summary rows styling (last 5 rows) - ไม่ใส่สีในส่วนนี้ เฉพาะปรับความสูงแถวและฟอนต์
              else if (rowIndex > worksheet.rowCount - 6) {
                row.height = 28; // เพิ่มความสูงแถวสรุป จาก 25 เป็น 28
                cell.font = { bold: true, size: 12 }; // เพิ่มตัวหนาสำหรับสรุป จาก 10 เป็น 12
              } else {
                // Set row height for data rows
                row.height = 35; // เพิ่มความสูงแถวข้อมูล จาก 30 เป็น 35
              }
              
              // Apply text rotation for specific header columns - ONLY ROW 8 (เดิมเป็น ROW 6)
              if (rowIndex === 8) { // เฉพาะแถวที่ 8 เท่านั้น (เปลี่ยนจาก 6 เนื่องจากแทรกแถวว่าง 4 แถว)
                // Calculate column indices for text rotation
                const totalWorkDaysColIndex = 3 + dayNumbers.length; // คอลัมน์รวมวันทำงาน
                const holidayColIndex = totalWorkDaysColIndex + 1; // คอลัมน์วันหยุด
                const publicHolidayColIndex = totalWorkDaysColIndex + 2; // คอลัมน์วันนักขัต
                const workOnHolidayColIndex = totalWorkDaysColIndex + 3; // คอลัมน์ทำงานวันหยุด/นักขัต
                const ot15ColIndex = totalWorkDaysColIndex + 4; // คอลัมน์โอที 1.5 เท่า
                const ot3ColIndex = totalWorkDaysColIndex + 5; // คอลัมน์โอที 3 เท่า
                
                // Calculate welfare column indices for text rotation
                const welfareStartColIndex = totalWorkDaysColIndex + 6; // เริ่มต้นคอลัมน์สวัสดิการ
                const welfareColumnsCount = workplaceAddsalary?.length || 0;
                
                // Calculate final columns (วัน Cash Holiday, หักประกันสังคม %, เงินสงเคราะห์ลูกจ้าง และ หมายเหตุ)
                const cashHolidayColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount; // วัน Cash Holiday
                const socialSecurityColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 1; // หักประกันสังคม %
                const employeeAllowanceColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 2; // เงินสงเคราะห์ลูกจ้าง
                const notesColIndex = totalWorkDaysColIndex + 6 + welfareColumnsCount + 3; // หมายเหตุ
                
                console.log(`🔍 Column indices debug:
                  totalWorkDaysColIndex: ${totalWorkDaysColIndex}
                  welfareColumnsCount: ${welfareColumnsCount}
                  cashHolidayColIndex: ${cashHolidayColIndex}
                  socialSecurityColIndex: ${socialSecurityColIndex}
                  employeeAllowanceColIndex: ${employeeAllowanceColIndex}
                  notesColIndex: ${notesColIndex}
                  current colIndex: ${colIndex}
                `);
                
                // Check if current column needs text rotation (90 degrees)
                const needsRotation = [
                  holidayColIndex,           // วันหยุด
                  publicHolidayColIndex,     // วันนักขัต
                  workOnHolidayColIndex,     // ทำงานวันหยุด/นักขัต
                  ot15ColIndex,              // โอที 1.5 เท่า
                  ot3ColIndex,               // โอที 3 เท่า
                  totalWorkDaysColIndex,     // รวมวันทำงาน (existing)
                  cashHolidayColIndex,       // วัน Cash Holiday
                  socialSecurityColIndex,    // หักประกันสังคม %
                  employeeAllowanceColIndex, // เงินสงเคราะห์ลูกจ้าง
                  notesColIndex              // หมายเหตุ
                ].includes(colIndex);
                
                // Check if current column is welfare column that needs rotation
                let isWelfareWithRotation = false;
                if (workplaceAddsalary && workplaceAddsalary.length > 0) {
                  const welfareEndColIndex = welfareStartColIndex + welfareColumnsCount - 1;
                  if (colIndex >= welfareStartColIndex && colIndex <= welfareEndColIndex) {
                    const welfareIndex = colIndex - welfareStartColIndex;
                    const welfareName = workplaceAddsalary[welfareIndex]?.name || '';
                    
                    // Check if welfare name matches any of the rotation criteria
                    const rotationKeywords = [
                      'ค่าอาหาร',
                    'ค่าน้ำ',
                    'ค่าไฟ', 
                    'ค่าโทรศัพท์',
                    'ค่าน้ำ/ไฟ/โทรศัพท์',
                    'ค่าตำแหน่ง',
                    'เบี้ยขยัน',
                    'ชดเชยวันลาพักร้อน (ประกันสังคม)',
                    'ค่ากะ',
                    'จ่ายลาป่วยมีใบรับรองแพทย์(รับล่วงหน้า)',
                    'จ่ายลาป่วยมีใบแพทย์',
                    'ค่าเดินทาง',
                    'ไม่คิดประกันสังคม',
                    'เงินเพิ่มพิเศษ',
                    'เงินช่วยเหลือบุตร',
                    'ค่าวิชาชีพ',
                    'หักประกันสังคม %',
                    'หักประกันสังคม %',
                    'ลากิจธุระจำเป็น(ประกันสังคม)'

                  ];
                  
                  isWelfareWithRotation = rotationKeywords.some(keyword => 
                    welfareName.includes(keyword)
                  );
                  }
                }
                
                // Apply text rotation to specified columns IN ROW 8 ONLY
                if (needsRotation || isWelfareWithRotation) {
                  cell.alignment = {
                    horizontal: 'center',
                    vertical: 'bottom',
                    textRotation: 90 // Rotate text 90 degrees
                   
                  };
                } else {
                  // Center alignment for ALL cells in row 8 (including name column)
                  cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
              } else if (rowIndex <= 8) { // เปลี่ยนจาก 6 เป็น 8 เนื่องจากแทรกแถวว่าง 4 แถว
                // For other header rows (5-7) - no text rotation, just center alignment for ALL cells
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
              } else {
                // For non-header rows (data rows)
                // ตรวจสอบสีพื้นหลังสำหรับแถวข้อมูลพนักงาน
                // ตรวจสอบสีพื้นหลังสำหรับแถวข้อมูลพนักงาน
// เพิ่มเงื่อนไขตรวจสอบว่าไม่ใช่แถวสรุป
const isSummaryRow2 = rowIndex > worksheet.rowCount - 6; // 6 แถวสุดท้ายเป็นแถวสรุป
if (!isSummaryRow2 && colIndex >= 3 && colIndex <= 2 + dayNumbers.length) { // คอลัมน์วันที่
                  const dayIndex = colIndex - 3; // แปลงเป็น index ของ dayNumbers
                  if (dayIndex < dayNumbers.length) {
                    const day = dayNumbers[dayIndex];
                    const dayNum = parseInt(day);
                    
                    // กำหนดเดือนและปีสำหรับการตรวจสอบ
                    let targetMonth, targetYear;
                    if (dayNum >= 21) {
                      // วันที่ 21-31 เป็นเดือนก่อนหน้า
                      targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
                      targetYear = year ? parseInt(year) : new Date().getFullYear();
                      if (targetMonth <= 0) {
                        targetMonth = 12;
                        targetYear -= 1;
                      }
                    } else {
                      // วันที่ 1-20 เป็นเดือนปัจจุบัน
                      targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
                      targetYear = year ? parseInt(year) : new Date().getFullYear();
                    }
                    
                    // สร้าง date string สำหรับตรวจสอบวันหยุด
                    const formattedMonth = targetMonth.toString().padStart(2, '0');
                    const formattedDay = dayNum.toString().padStart(2, '0');
                    const dateString = `${targetYear}-${formattedMonth}-${formattedDay}`;
                    
                    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
                    const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
                    const isInvalidDate = dayNum > daysInTargetMonth;
                    
                    // ถ้าเป็นวันที่ไม่มีอยู่จริง ให้แสดงสีเทา
                    if (isInvalidDate) {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF9E9E9E' } // สีเทา
                      };
                    } else {
                    // ตรวจสอบวันหยุดจาก dayoffWorkplace และ dayOffOnly
                    let isHoliday = false;
                    
                    // ตรวจสอบ dayoffWorkplace
                    if (weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace)) {
                      isHoliday = weekendData.dayoffWorkplace.includes(dateString);
                    }
                    
                    // ตรวจสอบ dayOffOnly (ถ้ายังไม่เป็นวันหยุด)
                    if (!isHoliday && Array.isArray(weekendData)) {
                      const dayOffOnlyItem = weekendData.find(item => item.date === dateString && item.type === 'dayOffOnly');
                      isHoliday = !!dayOffOnlyItem;
                    }
                    
                   if (isHoliday) {
  // ตรวจสอบว่าเซลล์มีค่าหรือไม่
  const cellValue = cell.value;
  const hasValue = cellValue  && cellValue !== null && cellValue !== undefined;
  
  // ถ้าเป็นวันหยุดและไม่มีค่า ให้ระบายสีเทา
  // แต่ถ้ามีค่า (พนักงานมาทำงาน) ไม่ต้องระบายสีเทา
  if (!hasValue) {
    // วันหยุดจาก workplace - สีเทา (rgb(158, 158, 158))
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9E9E9E' }
    };
  }
  // ถ้ามีค่า (เช่น "1" หรือ "3.0") แสดงว่าพนักงานมาทำงานในวันนักขัตฤกษ์ 
  // ไม่ต้องระบายสีเทา เพื่อให้เห็นว่ามีคนมาทำงาน
}
                    } // ปิด if (isInvalidDate) - วันที่ไม่มีอยู่จริงสำหรับแถวข้อมูล
                  }
                }
                
                // เพิ่มการตรวจสอบคอลัมน์สวัสดิการในแถวข้อมูลพนักงาน
                const isDataRow = rowIndex > 4 && rowIndex <= worksheet.rowCount - 6; // แถวข้อมูลพนักงาน (ไม่ใช่ header และไม่ใช่แถวสรุป)
                if (isDataRow) { 
                  // คำนวณตำแหน่งคอลัมน์สวัสดิการสำหรับแถวข้อมูล
                  const totalWorkDaysColIndex = 3 + dayNumbers.length; // คอลัมน์รวมวันทำงาน
                  const welfareStartCol = totalWorkDaysColIndex + 6; // เริ่มต้นคอลัมน์สวัสดิการ
                  const welfareColumnsCount = workplaceAddsalary?.length || 0;
                  const welfareEndCol = welfareStartCol + welfareColumnsCount - 1; // สิ้นสุดคอลัมน์สวัสดิการ
                  
                  // ตรวจสอบว่าเป็นคอลัมน์สวัสดิการหรือไม่
                  if (welfareColumnsCount > 0 && colIndex >= welfareStartCol && colIndex <= welfareEndCol) {
                    // ตรวจสอบค่าในเซลล์สวัสดิการ ถ้าเป็น "NO" ให้ใช้สีเทา
                    const cellValue = cell.value;
                    if (cellValue === "NO" || cellValue === "no" || cellValue === "No") {
                      cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF9E9E9E' } // สีเทา สำหรับค่า NO
                      };
                    }
                    // ถ้าไม่ใช่ NO ให้ใช้สีพื้นหลังปกติ (ไม่เปลี่ยนสี)
                  }
                }
                
                // Check if this is a summary row (last 5 rows) and in column A or B
                const isSummaryRow = rowIndex > worksheet.rowCount - 5;
                const isSummaryLabel = (colIndex === 1 || colIndex === 2); // Column A or B
                
                if (isSummaryRow && isSummaryLabel) {
                  // Skip alignment for summary row labels - they already have right alignment applied
                  console.log(`Skipping alignment override for summary row ${rowIndex}, col ${colIndex}`);
                } else if (colIndex === 2) {
                  // Left alignment for employee name column (ชื่อ-สกุล พนักงาน)
                  cell.alignment = { horizontal: 'left', vertical: 'middle' };
                } else {
                  // Center alignment for other cells in data rows
                  cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
              }
            } catch (cellError) {
              // Skip this cell if it causes an error (might be merged)
              console.warn(`Error styling cell at row ${rowIndex}, col ${colIndex}:`, cellError.message);
            }
          });
        });
        console.log('Successfully applied cell styling with holiday colors');
      } catch (styleError) {
        console.warn('Error applying styles:', styleError.message);
      }
      
      // Generate filename
      const filename = `ตารางเวลาทำงาน_${searchWorkplaceName || searchWorkplaceId || 'all'}_${month ? `${month}_${year}` : dateStr}.xlsx`;
      console.log('Generated filename:', filename);
      
      // Final step: Force alignment for summary row headers (with specific alignment per row type)
      console.log('🔧 Final step: Applying specific alignment for summary row headers...');
      try {
        for (let i = 0; i < 6; i++) {
          const rowNum = summaryStartRow + i;
          const cellA = worksheet.getCell(`A${rowNum}`);
          const cellB = worksheet.getCell(`B${rowNum}`);
          
          // Get the cell value to determine alignment
          const cellValue = cellA.value || '';
          const isOvertimeRow = cellValue.includes('โอที');
          
          // Apply specific alignment based on row content
          [cellA, cellB].forEach((cell, cellIndex) => {
            if (isOvertimeRow) {
              // Right alignment for overtime rows (โอที 1.5 เท่า, โอที 2 เท่า, โอที 3 เท่า)
              cell.alignment = {
                horizontal: 'left',
                vertical: 'middle',
                wrapText: false,
                shrinkToFit: false
              };
              console.log(`🔧 Applied RIGHT alignment to overtime row ${rowNum}, cell ${cellIndex === 0 ? 'A' : 'B'}, value: "${cell.value}"`);
            } else {
              // Center alignment for other summary rows (รวมพนักงานทำงาน/วัน, พนักงานขาดงาน)
              cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: false,
                shrinkToFit: false
              };
              console.log(`🔧 Applied CENTER alignment to summary row ${rowNum}, cell ${cellIndex === 0 ? 'A' : 'B'}, value: "${cell.value}"`);
            }
            
            // Ensure font is properly set for Thai text
           
          });
        }
      } catch (forceAlignError) {
        console.warn('Error forcing alignment:', forceAlignError.message);
      }

      // Apply red borders to separate employees
console.log('🔴 Applying red borders to separate employees...');
const totalEmployees = dataArray.length;
for (let i = 0; i < totalEmployees; i++) {
  const ot3RowNumber = 9 + (i * 5) + 4; // แถวที่ 13, 18, 23, ... (แถว โอที3 ของแต่ละคน) เปลี่ยนจาก 5 เป็น 9 เนื่องจากมีแถวว่าง 4 แถว
  
  // คำนวณจำนวนคอลัมน์ที่แน่นอนโดยใช้ notesColIndex เป็นฐาน
  const actualColumns = row1.length;

// วน loop ตามจำนวนคอลัมน์จริง
for (let col = 1; col <= actualColumns; col++) {
    const cell = worksheet.getCell(ot3RowNumber, col);
    
    // เพิ่มเส้นขอบล่างสีแดง
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thick', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    };
}
}
console.log(`✅ Applied red borders to ${totalEmployees} employees`);

// Final fix: Ensure OT 3 summary row has proper borders
console.log('🔲 Final fix: Ensuring OT 3 summary row borders...');
try {
  const summaryStartRowIndex = 9 + (dataArray.length * 5); // Start of summary rows (เปลี่ยนจาก 7 เป็น 9 เนื่องจากมีแถวว่าง 4 แถว)
  const ot3SummaryRowNumber = summaryStartRowIndex + 5; // OT 3 is the 6th summary row (0-based +5)
  
  console.log(`Fixing borders for OT 3 summary row at row ${ot3SummaryRowNumber}`);
  
  // Calculate exact columns using the same logic as notesColIndex
const exactColumns = row1.length; // ใช้จำนวนคอลัมน์จริงจาก header

for (let colIdx = 1; colIdx <= exactColumns; colIdx++) {
    const cell = worksheet.getCell(ot3SummaryRowNumber, colIdx);
    
    // Force borders on all cells in this row
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    };
}  for (let colIdx = 1; colIdx <= exactColumns; colIdx++) {
    const cell = worksheet.getCell(ot3SummaryRowNumber, colIdx);
    
    // Force borders on all cells in this row
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  }
  
  console.log(`✅ Applied borders to ${exactColumns} columns in OT 3 summary row ${ot3SummaryRowNumber}`);
} catch (borderFixError) {
  console.warn('Error in final OT 3 border fix:', borderFixError.message);
}


      
      // Generate Excel file using ExcelJS
      console.log('Starting to generate Excel buffer...');
      const buffer = await workbook.xlsx.writeBuffer();
      console.log('Excel buffer generated, size:', buffer.byteLength, 'bytes');
      
      // Create blob and download
      console.log('Creating blob and download link...');
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      console.log('Blob created, size:', blob.size, 'bytes');
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      console.log('Download link created:', link.href);
      
      document.body.appendChild(link);
      link.click();
      console.log('Download link clicked');
      
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      console.log('Download link cleaned up');
      
      console.log('Excel generation completed successfully!');
      Swal.fire({
        icon: 'success',
        title: 'สร้างไฟล์ Excel สำเร็จ!',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <strong>ไฟล์ที่สร้าง:</strong><br>
            ไฟล์ Excel (.xlsx)<br><br>
            
            <strong>ชื่อไฟล์:</strong> ${filename}<br>
            <strong>ขนาดไฟล์:</strong> ${(blob.size / 1024).toFixed(2)} KB<br><br>
            
            <small style="color: #666;">หากไฟล์ไม่ดาวน์โหลดอัตโนมัติ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์ของคุณ</small>
          </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#28a745',
        width: '500px'
      });
      
    } catch (error) {
      console.error('Error generating Excel:', error);
      console.error('Error stack:', error.stack);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการสร้างไฟล์ Excel',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <strong>รายละเอียดข้อผิดพลาด:</strong><br>
            <code style="background: #f8f9fa; padding: 10px; border-radius: 4px; display: block; margin: 10px 0; color: #dc3545;">${error.message}</code>
            
            <strong>กรุณาตรวจสอบ:</strong><br>
            1. ข้อมูลพนักงานมีครบถ้วนหรือไม่<br>
            2. ข้อมูลหน่วยงานและสวัสดิการ
          </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545',
        width: '500px'
      });
    } finally {
      setExcelLoading(false);
      setPageLoading(false);
    }
  };

  const handleStaffNameChange = (e) => {
    const selectWorkplaceName = e.target.value;

    // Find the corresponding employee and set the staffId and staffName
    const selectedEmployee = workplaceListAll.find(
      (workplace) => workplace.workplaceName == selectWorkplaceName
    );
    const selectedEmployeeFName = workplaceListAll.find(
      (workplace) => workplace.workplaceName === selectWorkplaceName
    );

    if (selectedEmployee) {
      // setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      // setWorkplacrName(selectedEmployee.workplaceName);
    } else {
      // setWorkplacrId('');
      // setSearchWorkplaceId('');
      // setWorkplacrName('');
    }
    // setWorkplacrName(selectWorkplaceName);
    setSearchWorkplaceName(selectWorkplaceName);
  };

  //////////////////////////////ทดลองตาราง8ใหม่//////////////////////////////////////////

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Helper function to generate a random employee ID in the format number1-3"-"number1-3
  const generateRandomEmployeeId = () => {
    const part1 = getRandomInt(1, 999).toString();
    const part2 = getRandomInt(1, 999).toString();
    return `${part1}-${part2}`;
  };

  // Arrays of sample names and last names
  const sampleNames = [
    "John",
    "Jane",
    "Alex",
    "Emily",
    "Chris",
    "Kate",
    "Michael",
    "Sarah",
    "David",
    "Laura",
    "Robert",
    "Olivia",
  ];

  const sampleLastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Wilson",
  ];

  // Helper function to generate a random name
  const generateRandomName = () => {
    const randomFirstName =
      sampleNames[getRandomInt(0, sampleNames.length - 1)];
    const randomLastName =
      sampleLastNames[getRandomInt(0, sampleLastNames.length - 1)];
    return randomFirstName + " " + randomLastName;
  };

  // Generate random employee data
  const generateRandomEmployeeData = (numEmployees) => {
    const employees = [];
    for (let i = 0; i < numEmployees; i++) {
      employees.push({
        name: generateRandomName(),
        employeeId: generateRandomEmployeeId(),
      });
    }
    return employees;
  };

  // Usage: Generate 5 random employees
  const extractedDatatest = generateRandomEmployeeData(10);

  const generateTestArray = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "1" : ""))
    );
  };
  const generateTestArrayspace = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "" : ""))
    );
  };

  const setEmptyArrays = (arrayData, numEmptyArrays = 2) => {
    const indexes = [...Array(arrayData.length).keys()];
    // Randomly select indices
    for (let i = 0; i < numEmptyArrays; i++) {
      if (indexes.length === 0) break; // Safety check
      const randomIndex = Math.floor(Math.random() * indexes.length);
      const indexToEmpty = indexes.splice(randomIndex, 1)[0];
      arrayData[indexToEmpty] = arrayData[indexToEmpty].map(() => "");
    }
  };

  const randomlyReplaceOnes = (arrayData, numToReplace = 2) => {
    // Flatten the array data into a single list
    const flatArray = arrayData.flat();

    // Get indices of all '1's in the flattened array
    const onesIndices = flatArray
      .map((val, index) => (val === "1" ? index : -1))
      .filter((index) => index !== -1);

    // Shuffle the indices to ensure random selection
    for (let i = onesIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [onesIndices[i], onesIndices[j]] = [onesIndices[j], onesIndices[i]];
    }

    // Replace a random number of '1's
    const indicesToReplace = onesIndices.slice(
      0,
      Math.min(numToReplace, onesIndices.length)
    );
    indicesToReplace.forEach((index) => {
      flatArray[index] = "399-158";
    });

    // Map the changes back to the original array structure
    let flatIndex = 0;
    arrayData.forEach((subArray, subArrayIndex) => {
      subArray.forEach((_, itemIndex) => {
        subArray[itemIndex] = flatArray[flatIndex++];
      });
    });
  };

  const generateTestTimeArray = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "8" : ""))
    );
  };

  const createEmptyArray = (numRows, numCols) => {
    return Array.from({ length: numRows }, () => Array(numCols).fill(""));
  };

  // Usage
  const numRows = 1; // Number of sub-arrays
  const numCols = 13; // Number of columns in each sub-array
  const emptyArray = createEmptyArray(numRows, numCols);

  console.log("emptyArray", emptyArray);

  // Define the size of each sub-array (e.g., days in a month)
  //   const daysInMonth = 29; // Adjust as necessary for your needs
  const numTestArrays = 10; // Number of test arrays to create

  // Generate test arrays for MorningAndSS, Afternoon, and Night shifts
  const finalUpdatedDayWorksWorkMorningAndSSTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );
  const finalUpdatedDayWorksWorkAfternoonTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );
  const finalUpdatedDayWorksWorkNightTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );

  const newOtTimesTest = generateTestTimeArray(numTestArrays, daysInMonth);
  const newOtTimes2Test = generateTestTimeArray(numTestArrays, daysInMonth);
  const newOtTimes3Test = generateTestTimeArray(numTestArrays, daysInMonth);

  const newOtTimes3Testspace = generateTestArrayspace(
    numTestArrays,
    daysInMonth
  );

  setEmptyArrays(finalUpdatedDayWorksWorkMorningAndSSTest, 2);
  setEmptyArrays(finalUpdatedDayWorksWorkAfternoonTest, 2);
  setEmptyArrays(finalUpdatedDayWorksWorkNightTest, 2);

  setEmptyArrays(newOtTimesTest, 6);
  setEmptyArrays(newOtTimes2Test, 6);
  setEmptyArrays(newOtTimes3Test, 6);

  randomlyReplaceOnes(finalUpdatedDayWorksWorkMorningAndSSTest, 2);
  randomlyReplaceOnes(finalUpdatedDayWorksWorkAfternoonTest, 2);
  randomlyReplaceOnes(finalUpdatedDayWorksWorkNightTest, 2);

  const getRandomTwoDigitNumber = () => {
    return Math.floor(Math.random() * 90) + 10; // Random number between 10 and 99
  };

  // Function to generate the HourWork and SalaryWork arrays
  const generateHourAndSalaryData = (numEntries) => {
    const HourWork = [];
    const SalaryWork = [];

    const HourWork1 = [];
    const SalaryWork1 = [];
    const HourWork2 = [];
    const SalaryWork2 = [];
    const HourWork3 = [];
    const SalaryWork3 = [];

    for (let i = 0; i < numEntries; i++) {
      const hour = getRandomTwoDigitNumber();
      HourWork.push(hour);
      SalaryWork.push(hour * 2);
      HourWork1.push(hour);
      SalaryWork1.push(hour * 2);
      HourWork2.push(hour);
      SalaryWork2.push(hour * 2);
      HourWork3.push(hour);
      SalaryWork3.push(hour * 2);
    }

    return {
      HourWork,
      SalaryWork,
      HourWork1,
      SalaryWork1,
      HourWork2,
      SalaryWork2,
      HourWork3,
      SalaryWork3,
    };
  };

  // Generate the data for 10 entries
  const {
    HourWork,
    SalaryWork,
    HourWork1,
    SalaryWork1,
    HourWork2,
    SalaryWork2,
    HourWork3,
    SalaryWork3,
  } = generateHourAndSalaryData(10);


  //////////////////
  const countSpecificStrings = (row, lengthThreshold = 3) => {
    // Return true if any string in the row exceeds the length threshold
    return row.some((cell) => cell.length > lengthThreshold);
  }


  //////////////////////
  const [date, setDate] = useState("");

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    // Add slashes at the appropriate positions
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    }

    setDate(value);
  };
  
  // Function to generate Excel file with ExcelJS - same structure as table

  // Constants for Excel generation
  const dayNumbers = [
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
  ];
  const overtimeLabels = ["วันหยุด", "วันนักขัต", "ทำงานวันหยุด/นักขัต", "โอที 1.5 เท่า", "โอที 3 เท่า"];

// เพิ่ม function สำหรับนับพนักงานที่ทำงานในแต่ละวัน
  const countEmployeesPerDay = () => {
    const counts = Array(dayNumbers.length).fill(0);
    
    if (data && data.length > 0) {
      data.forEach(record => {
        dayNumbers.forEach((day, dayIndex) => {
          const found = record?.employee_record?.find(itemx => itemx.date === day);
          if (found?.dayType === "work") {
            counts[dayIndex]++;
          }
        });
      });
    }
    
    return counts;
  };

  // เพิ่ม function สำหรับรวมชั่วโมงโอที 1.5 ในแต่ละวัน
  const sumOvertimePerDay = () => {
    const sums = Array(dayNumbers.length).fill(0);
    
    if (data && data.length > 0) {
      data.forEach(record => {
        dayNumbers.forEach((day, dayIndex) => {
          const found = record?.employee_record?.find(itemx => itemx.date === day);
          if (found?.cashOtMul?.trim() && found?.cashOtMul === "1.5") {
            const beforeTime = parseFloat(found.beforeTotalOtTime) || 0;
            const totalTime = parseFloat(found.totalOtTime) || 0;
            sums[dayIndex] += beforeTime + totalTime;
          }
        });
      });
    }
    
    return sums;
  };

  // เพิ่ม function สำหรับรวมชั่วโมงโอที 2 เท่าในแต่ละวัน (dayType === "stop")
  const sumOvertime2PerDay = () => {
    const sums = Array(dayNumbers.length).fill(0);
    
    if (data && data.length > 0) {
      data.forEach(record => {
        dayNumbers.forEach((day, dayIndex) => {
          const found = record?.employee_record?.find(itemx => itemx.date === day);
          if (found?.dayType === "stop" && found.totalTime) {
            const totalTime = parseFloat(found.totalTime) || 0;
            sums[dayIndex] += totalTime;
          }
        });
      });
    }
    
    return sums;
  };

  // เพิ่ม function สำหรับรวมชั่วโมงโอที 3 เท่าในแต่ละวัน (cashOtMul === "3")
  const sumOvertime3PerDay = () => {
    const sums = Array(dayNumbers.length).fill(0);
    
    if (data && data.length > 0) {
      data.forEach(record => {
        dayNumbers.forEach((day, dayIndex) => {
          const found = record?.employee_record?.find(itemx => itemx.date === day);
          if (found?.cashOtMul ==="3" && found?.cashOtMul?.trim()) {
            const beforeTime = parseFloat(found.beforeTotalOtTime) || 0;
            const totalTime = parseFloat(found.totalOtTime) || 0;
            sums[dayIndex] += beforeTime + totalTime;
          }
        });
      });
    }
    
    return sums;
  };

  const calculateTotalOtPublicHoliday = () => {
    let total = 0;
    
    if (data && data.length > 0) {
      data.forEach(record => {
        const otPublicHoliday = parseFloat(record.sumOtPublicHoliday || 0);
        total += otPublicHoliday;
      });
    }
    
    return total;
  };

  const calculateTotalOtWithOvertime1_5 = () => {
    let total = 0;
    
    if (data && data.length > 0) {
      data.forEach(record => {
        const otPublicHoliday = 0;
        const ot1p5 = parseFloat(record.sumOt1p5 || 0);
        total += otPublicHoliday + ot1p5;
      });
    }
    
    return total;
  };

  const calculateTotalOtWithOvertime3 = () => {
    let total = 0;
    
    if (data && data.length > 0) {
      data.forEach(record => {
        const otPublicHoliday = 0;
        const ot3 = parseFloat(record.sumOt3 || 0);
        total += otPublicHoliday + ot3;
      });
    }
    
    return total;
  };

  // เพิ่ม function สำหรับคำนวณพนักงานขาดงานในแต่ละวัน
  const calculateAbsentEmployeesPerDay = () => {
    const absentCounts = Array(dayNumbers.length).fill(0);
    const totalEmployees = data.length; // จำนวนพนักงานทั้งหมด
    
    if (data && data.length > 0) {
      dayNumbers.forEach((day, dayIndex) => {
        const presentCount = employeeCountPerDay[dayIndex] || 0; // จำนวนที่มาทำงาน
        
        // ถ้าไม่มีคนมาทำงานเลย (วันหยุด) ให้ไม่แสดงค่าขาดงาน
        if (presentCount === 0) {
          absentCounts[dayIndex] = 0; // ไม่แสดงค่า
        } else {
          const absentCount = totalEmployees - presentCount; // จำนวนที่ขาด
          absentCounts[dayIndex] = absentCount > 0 ? -absentCount : 0; // แสดงเป็นเลขลบ
        }
      });
    }
    
    return absentCounts;
  };

  // ฟังก์ชันสำหรับเรียก API ข้อมูล workplace และคำนวณจำนวนพนักงานตามสัญญา
  const [contractEmployeeCount, setContractEmployeeCount] = useState(0);

  const fetchWorkplaceContractData = async () => {
    if (!searchWorkplaceId) return;
    
    try {
      const response = await fetch(`${endpoint}/workplace/${searchWorkplaceId}`);
      const workplaceInfo = await response.json();
      
      console.log('Workplace data:', workplaceInfo);
      
      // คำนวณจำนวนพนักงานตามสัญญาจาก workTimeDayPerson
      let totalContractEmployees = 0;
      
      if (workplaceInfo.workTimeDayPerson && workplaceInfo.workTimeDayPerson.length > 0) {
        workplaceInfo.workTimeDayPerson.forEach(daySchedule => {
          if (daySchedule.allTimesPerson && daySchedule.allTimesPerson.length > 0) {
            daySchedule.allTimesPerson.forEach(position => {
              totalContractEmployees += parseInt(position.countPerson) || 0;
            });
          }
        });
      }
      
      console.log('Total contract employees:', totalContractEmployees);
      setContractEmployeeCount(totalContractEmployees);
      
    } catch (error) {
      console.error('Error fetching workplace data:', error);
      setContractEmployeeCount(0);
    }
  };

  // เรียกใช้ฟังก์ชันเมื่อ searchWorkplaceId เปลี่ยน
  useEffect(() => {
    fetchWorkplaceContractData();
  }, [searchWorkplaceId]);

  const employeeCountPerDay = countEmployeesPerDay();
  const overtimeSumPerDay = sumOvertimePerDay();
  const overtime2SumPerDay = sumOvertime2PerDay();
  const overtime3SumPerDay = sumOvertime3PerDay();
  const absentEmployeesPerDay = calculateAbsentEmployeesPerDay();
  const totalOtPublicHoliday = calculateTotalOtPublicHoliday();
  const totalOtWithOvertime1_5 = calculateTotalOtWithOvertime1_5();
  const totalOtWithOvertime3 = calculateTotalOtWithOvertime3();


  return (
    // <div>
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">

          {/* Loading Overlay */}
          {pageLoading && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  animation: 'spin 2s linear infinite'
                }}
              />
              <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>
                {loading ? 'กำลังโหลดข้อมูล...' : 'กำลังเตรียมข้อมูล...'}
              </p>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> ระบบเงินเดือน</a>
            </li>
            <li class="breadcrumb-item active">ตารางเวลาทำงานพนักงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ตารางเวลาทำงานพนักงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
<!-- Main content --> */}

<section class="content">
            <div class="row">
              <div class="">
                <section class="Frame">
                  <div class="col-md-12">
                    <h2 class="title">ค้นหา</h2>
                    <div class="col-md-12">
                      {/* <form onSubmit={handleSearch}> */}
                      <form 
                        className="container"
                        onSubmit={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }}
                      >
                        <div class="row">
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchWorkplaceId">
                                รหัสหน่วยงาน
                              </label>
                              <input
  type="text"
  class="form-control"
  id="searchWorkplaceId"
  placeholder="หน่วยงาน"
  value={searchWorkplaceId}
  onChange={handleStaffIdChange}
  onInput={(e) => {
    // Remove any non-digit characters first
    let value = e.target.value;
    
    // Check if user is trying to enter the restricted code
    if (value === '10105' || value.includes('10105')) {
      // Show SweetAlert warning
      Swal.fire({
        icon: 'warning',
        title: 'หน่วยงานพิเศษ',
        text: 'รหัสหน่วยงาน 10105 เป็นหน่วยงานพิเศษ ต้องกรอกเฉพาะหน้าหน่วยงานพิเศษเท่านั้น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f0ad4e'
      });
      
      // Clear the input value
      e.target.value = '';
      setSearchWorkplaceId('');
      setSearchWorkplaceName('');
      return;
    }
  }}
  list="WorkplaceIdList"
/>
                            </div>
                            <datalist id="WorkplaceIdList">
                              {workplaceListAll.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceId}
                                />
                              ))}
                            </datalist>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchWorkplaceName">
                                ชื่อหน่วยงาน
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="searchWorkplaceName"
                                placeholder="ชื่อหน่วยงาน"
                                value={searchWorkplaceName}
                                // onChange={(e) => setSearchWorkplaceName(e.target.value)}
                                onChange={handleStaffNameChange}
                                list="WorkplaceNameList"
                              />
                            </div>
                            <datalist id="WorkplaceNameList">
                              {workplaceListAll.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceName}
                                />
                              ))}
                            </datalist>
                          </div>
                          {/* {workRateWorkplaceStage1}
                                                    {workRateWorkplaceStage2}
                                                    {workRateWorkplaceStage3} */}
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="month">เดือน</label>
                              <select
                                className="form-control"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                              >
                                <option value="">เลือกเดือน</option>
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
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchEmployeeId">ปี</label>
                              <select
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                              >
                                <option value="">เลือกปี</option>
                                {years.map((y) => (
                                  <option key={y} value={y}>
                                    {y + 543}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchEmployeeId">เดือน</label>
                                                            <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
                                                                <option value="">เลือกเดือน</option>
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
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchEmployeeId">ปี</label>
                                                            <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)} >
                                                                <option value="" >เลือกปี</option>
                                                                {years.map((y) => (
                                                                    <option key={y} value={y}>
                                                                        {y + 543}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>


                                                </div> */}

                        <div class="row">
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="codePage">รหัสกระดาษ</label>
                              <input
                                type="text"
                                class="form-control"
                                id="codePage"
                                placeholder="รหัสกระดาษ"
                                value={codePage}
                                onChange={(e) => setCodePage(e.target.value)}
                              />
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              {/* <div
                                style={{
                                  position: "relative",
                                  zIndex: 9999,
                                  marginLeft: "0rem",
                                }}
                              > */}
                              {/* <DatePicker id="datetime" name="datetime"
                                                                    className="form-control" // Apply Bootstrap form-control class
                                                                    popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                                    selected={workDate}
                                                                    onChange={handleWorkDateChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                // showMonthYearPicker
                                                                /> */}

                              {/* <DatePicker
                                  className="form-control"
                                  selected={selectedThaiDate}
                                  onChange={handleThaiDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  locale={th}
                                />
                              </div> */}
                              {/* <label role="datetime">วันที่</label> */}
                              {/* <div
                                onClick={toggleDatePicker}
                                style={{
                                  position: "relative",
                                  zIndex: 9999,
                                  marginLeft: "0rem",
                                }}
                              >
                                <FaCalendarAlt size={20} />
                                <span style={{ marginLeft: "8px" }}>
                                  {formattedDate321
                                    ? formattedDate321
                                    : "Select Date"}
                                </span>
                              </div> */}

                              {/* {showDatePicker && (
                                <div
                                  style={{ position: "absolute", zIndex: 1000 }}
                                >
                                  <ThaiDatePicker
                                    className="form-control"
                                    value={selectedDate}
                                    onChange={handleDatePickerChange}
                                  />
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-12" style={{ marginTop: "1rem" }}>
                            <div
                              class="form-group"
                              style={{ position: "absolute", bottom: "0" }}
                            >
                              {/* <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button> */}
                              <br />
                              {/* <button
                                onClick={generatePDFTest123}
                                type="button "
                                class="btn b_save"
                              >
                                <i class="nav-icon fas fa-search"></i>
                                พิมพ์รายงาน
                              </button>
                              <button
                                onClick={generatePDFTest123Old}
                                style={{ marginLeft: "1rem", width: "10rem" }}
                                class="btn b_save"
                              >
                                <i class="nav-icon fas fa-search"></i>
                                พิมพ์รายงานเก่า
                              </button> */}
                            </div>
                          </div>
                        </div>
                        <button
                        onClick={(e) => {
                          handleForceReload(e);
                        }}
                        type="button"
                        className="btn b_save"
                        disabled={searchLoading || pageLoading}
                        style={{ 
                          opacity: (searchLoading || pageLoading) ? 0.6 : 1, 
                          cursor: (searchLoading || pageLoading) ? 'not-allowed' : 'pointer' 
                        }}
                      >
                        {searchLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> &nbsp; กำลังค้นหา...
                          </>
                        ) : (
                          <>
                            <i className="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                          </>
                        )}
                      </button>
                      <button
                        onClick={generateExcel}
                        style={{ marginLeft: "1rem", width: "10rem", backgroundColor: "", color: "white" }}
                        class="btn b_save bg-success p-2"
                        disabled={excelLoading || pageLoading}
                      > 
                        {excelLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin m-1"></i>กำลังสร้าง...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-excel m-1"></i>ดาวน์โหลด Excel
                          </>
                        )}
                      </button>
                       <button
                        onClick={handleForceReload}
                        style={{ marginLeft: "1rem", width: "10rem", backgroundColor: "", color: "white" }}
                        class="btn b_save bg-warning p-2"
                      > 
                       <i class="fas fa-sync-alt m-1"></i>Force Reload
                     
                      </button>

                      {/* แสดงตารางทันที */}
                      {showTable && (
                      <div className="pt-3">
                          <div className="table table-responsive" >
                          <table
                      className="excel-style-table  "
                      style={{
                        fontSize: "8px",
                        width: "100%",
                        margin: "0 auto",
                        borderCollapse: "collapse",
                        border: "1px solid #000",
                      }}
                    >

                              <thead>
                                {/* ---------------- แถวที่ 1 ---------------- */}
                                <tr >
                                  <th rowSpan="5" className="text-center   ">ลำดับ</th>
                                  <th rowSpan="4" colSpan="1" className="text-center">ชื่อ - สกุล</th>
                                  {dayNumbers.map((day, idx) => (
                                      <th 
                                        key={idx} 
                                        rowSpan={4} 
                                        className="text-center" 
                                        style={getDateStyle(day)}
                                      >
                                        {day}
                                      </th>
                                    ))}
                                  <th rowSpan="4" className="vertical-text " style={{backgroundColor:'#fff7c2'}}> รวมวันทำงาน</th>

                                  {/* ค่าล่วงเวลา → 5 คอลัมน์ */}
                        
                                  <th style={{backgroundColor:'#fff7c2'}} colSpan="5" className="text-center  align-middle">ค่าล่วงเวลา</th>
                                  <th  colSpan={mergeWorkplaceAddsalary(workplaceAddsalary).length} className="text-center p-2">สวัสดิการ</th>

                                  <th rowSpan={4}  className="vertical-text ">ทำงานวันหยุด(จ่ายสด)</th>
                                  <th rowSpan={4}  className="vertical-text ">หักประกันสังคม %</th>
                                  <th rowSpan={4}  className="vertical-text ">เงินสงเคราะห์ลูกจ้าง</th>
                                  <th rowSpan={4} className="vertical-text ">หมายเหตุ</th>
                                </tr>

                                {/* ---------------- แถวที่ 2 ---------------- */}
                                <tr>
                                  <th style={{backgroundColor:'#fff7c2'}} >1441</th>
                                  <th style={{backgroundColor:'#fff7c2'}}>1434</th>
                                  <th style={{backgroundColor:'#fff7c2'}}>1130</th>
                                  <th style={{backgroundColor:'#fff7c2'}}>1120</th>
                                  <th style={{backgroundColor:'#fff7c2'}}>1140</th>

                                  {(() => {
                                    const mergedItems = mergeWorkplaceAddsalary(workplaceAddsalary);
                                    return mergedItems.map((item, i) => (
                                      <th key={i} className="text-center ">{item.codeSpSalary} </th>
                                    ));
                                  })()}
                                </tr>

                                {/* ---------------- แถวที่ 3 ---------------- */}
                                <tr>
                                    <td className="text-bold align-middle" style={{backgroundColor:'#fff7c2'}}>วัน</td>
                                    <td className="text-bold align-middle" style={{backgroundColor:'#fff7c2'}}>วัน</td>
                                    <td className="text-bold align-middle" style={{backgroundColor:'#fff7c2'}}>ชม</td>
                                    <td className="text-bold align-middle" style={{backgroundColor:'#fff7c2'}}>ชม</td>
                                    <td className="text-bold align-middle" style={{backgroundColor:'#fff7c2'}}>ชม</td>
                                     {(() => {
                                       const mergedItems = mergeWorkplaceAddsalary(workplaceAddsalary);
                                       return mergedItems.map((_, i) => (
                                         <th key={i}></th>
                                       ));
                                     })()}

                                </tr>

                                {/* ---------------- แถวที่ 4 ---------------- */}
                                    <tr>
                                                                    {overtimeLabels.map((label, index) => {
                                    // เพิ่ม input ตรงตำแหน่งก่อน "โอที1" (index 2)
                                   
                              
                                    return (
                                        <th key={index} style={{backgroundColor:'#fff7c2'}} className="vertical-text align-middle">
                                            {label}
                                        </th>
                                    );
                                })}
    

                                        {/* สวัสดิการตามหน่วยงาน */}
                                        {(() => {
                                          const mergedItems = mergeWorkplaceAddsalary(workplaceAddsalary);
                                          return mergedItems.map((item, index) => (
                                            <th key={index} className="vertical-text align-middle">
                                              {item.name}
                                            </th>
                                          ));
                                        })()}

                                    </tr>
                              </thead>

                              <tbody>
                            

                              {loading ? (
                                <tr>
                                  
                                </tr>
                    ) : !data || data.length === 0 ? (
                                <tr>
                                  <td colSpan={dayNumbers.length + 10} className="text-center p-4 text-muted">
                                    <i className="fas fa-info-circle me-2"></i>
                                    ไม่มีข้อมูลพนักงาน กรุณาค้นหาข้อมูลก่อน
                                  </td>
                                </tr>
                    ) : (
                      Array.isArray(data) ? data.map((record, idx) => {
                        // เพิ่ม safety check สำหรับ record
                        if (!record) {
                          console.warn(`Invalid record at index ${idx}`);
                          return null;
                        }

                        try {
                          return (
                        <React.Fragment key={`employee-${record.employeeId || idx}`}>
                          <tr className="" style={{borderTop:'2px solid #000'}}>
                                        <td className="text-center align-middle">{idx + 1}</td>
                                        <td className="text-left align-middle ">
                                         {employeePrefixes[record.employeeId] || record.prefix || ''} {record.employeeName || 'ไม่ระบุชื่อ'}  <span style={{ float: "right" }}>เช้า</span>
                                    </td>


                                    

{dayNumbers.map((day, i) => {
  // หา record ทั้งหมดของวันนี้
  const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
  
  // 🔥 แก้ไข: สำหรับแถวเช้า ให้หา cash_holiday record ก่อน (สำหรับกะเช้า 06:00-15:00)
  const cashHolidayRecord = allRecordsForDay.find(itemx => {
    if (itemx.shift === "cash_holiday" && itemx.startTime) {
      const startHour = parseFloat(itemx.startTime.replace('.', ':').split(':')[0]);
      return startHour >= 6 && startHour <= 15; // เฉพาะกะเช้า 06:00-15:00 เท่านั้น
    }
    return false;
  });
  
  // หา morning_shift record
  const morningShiftRecord = allRecordsForDay.find(itemx => itemx.shift === "morning_shift");
  
  // หา record ที่มี totalTime ก่อน ถ้าไม่มีก็เอา record แรก
  const found = cashHolidayRecord || morningShiftRecord || allRecordsForDay.find(itemx => itemx.totalTime && itemx.totalTime.trim() !== '') || allRecordsForDay[0];

  const isWork = found?.dayType === "work" || 
                 (found?.dayType === "stop" && found?.shift === "morning_shift") ||
                 (found?.shift === "cash_holiday" && found?.startTime && (() => {
                   const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                   return startHour >= 6 && startHour <= 15; // เฉพาะกะเช้า 06:00-15:00 เท่านั้น
                 })()); // แสดงข้อมูล cash_holiday เฉพาะกะเช้าในแถวเช้า 

  // ตรวจสอบว่าวันนี้อยู่ใน stopDaysList หรือไม่
  const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
    const stopDayDate = parseInt(stopDay.date);
    const currentDay = parseInt(day);
    return stopDayDate === currentDay;
  });

  // ตรวจสอบทั้ง specialt_shift และ stopDaysList
  const specialIndividual = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
  
  // ตรวจสอบว่าวันนี้เป็นวันหยุดพิเศษหรือไม่
  const isSpecialHoliday = record?.personalDayOff?.some(personalDay => {
    const personalDayDate = parseInt(personalDay.date);
    const currentDay = parseInt(day);
    return personalDayDate === currentDay;
  }) || record?.stopDaysList?.some(stopDay => {
    const stopDayDate = parseInt(stopDay.date);
    const currentDay = parseInt(day);
    return stopDayDate === currentDay;
  });
  
  // ตรวจสอบว่าวันนี้เป็นวันลาป่วยหรือไม่
  const isSickLeave = record?.addSalaryList?.some(salaryItem => {
    // Debug เฉพาะวันแรก
    if (day === dayNumbers[0]) {
      console.log('🔍 Debug addSalaryList สำหรับ employee:', record.employeeId);
      console.log('🔍 addSalaryList:', record.addSalaryList);
    }
    
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
       salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")){
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      // Debug เฉพาะวันแรก
      if (day === dayNumbers[0]) {
        console.log('🔍 Found sick/leave item:', salaryItem.name);
        console.log('🔍 welfareType:', salaryItem.welfareType);
        console.log('🔍 dates array:', dates);
        console.log('🔍 current day:', currentDay);
      }
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      
      // Debug เฉพาะเมื่อมีการตรงกัน
      if (isMatch) {
        console.log(`🖤 วันที่ ${day} ตรงกับ ${salaryItem.name} (${salaryItem.welfareType})`);
      }
      
      return isMatch;
    }
    return false;
  });
  
  // ตรวจสอบวันหยุดจาก dayoffWorkplace API
  const checkDayoffWorkplace = (day, month, year) => {
    const dayNum = parseInt(day);
    let actualMonth, actualYear;
    
    // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
    if (dayNum >= 21) {
      // วันที่ 21-31 เป็นของเดือนก่อนหน้า
      if (parseInt(month) === 1) {
        actualMonth = 12;
        actualYear = parseInt(year) - 1;
      } else {
        actualMonth = parseInt(month) - 1;
        actualYear = parseInt(year);
      }
    } else {
      // วันที่ 1-20 เป็นของเดือนปัจจุบัน
      actualMonth = parseInt(month);
      actualYear = parseInt(year);
    }
    
    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
    const daysInActualMonth = new Date(actualYear, actualMonth, 0).getDate();
    if (dayNum > daysInActualMonth) {
      // วันที่ไม่มีอยู่จริงในเดือนนั้น (เช่น 31 เมษายน) → ต้องเป็นสีเทา
      console.log(`🔘 วันที่ ${day} ไม่มีอยู่จริงในเดือน ${actualMonth}/${actualYear} (เดือนมี ${daysInActualMonth} วัน) - ระบายสีเทา`);
      return true;
    }
    
    // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
    const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    
    // Debug log (เฉพาะวันแรกเพื่อไม่ให้ spam)
    if (day === dayNumbers[0]) {
      console.log(`🔍 Debug checkDayoffWorkplace แสดงเดือน ${month}/${year} (ข้ามเดือน)`);
      console.log('🔍 weekendData.dayoffWorkplace:', weekendData?.dayoffWorkplace);
      
      // แยกแสดงวันหยุดตามเดือนจริง
      const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
      const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
      console.log(`🔍 วันหยุดเดือนก่อน (${prevMonth}/${prevYear}):`, weekendData?.dayoffWorkplace?.filter(date => 
        date.startsWith(`${prevYear}-${prevMonth.toString().padStart(2, '0')}-`)
      ));
      console.log(`🔍 วันหยุดเดือนปัจจุบัน (${month}/${year}):`, weekendData?.dayoffWorkplace?.filter(date => 
        date.startsWith(`${year}-${month.toString().padStart(2, '0')}-`)
      ));
    }
    
    // ตรวจสอบจาก dayoffWorkplace ใน weekendData ที่ได้จาก API
    if (weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace)) {
      const isDayoffWorkplace = weekendData.dayoffWorkplace.includes(targetDateStr);
      
      if (isDayoffWorkplace) {
        console.log(`✅ วันที่ ${day} (${targetDateStr}) เป็นวันหยุดจาก dayoffWorkplace - ระบายสีเทา`);
        return true;
      }
    }
    
    // ถ้าไม่เจอในรายการ dayoffWorkplace แสดงว่าไม่ใช่วันหยุดจาก workplace
    return false;
  };
  
  const isDayoffWorkplace = checkDayoffWorkplace(parseInt(day), parseInt(month), parseInt(year));
  
  // ตรวจสอบ dayOffOnly (วันหยุดนักขัตฤกษ์)
  const checkDayOffOnly = (day, month, year) => {
    const dayNum = parseInt(day);
    let actualMonth, actualYear;
    
    // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
    if (dayNum >= 21) {
      // วันที่ 21-31 เป็นของเดือนก่อนหน้า
      if (parseInt(month) === 1) {
        actualMonth = 12;
        actualYear = parseInt(year) - 1;
      } else {
        actualMonth = parseInt(month) - 1;
        actualYear = parseInt(year);
      }
    } else {
      // วันที่ 1-20 เป็นของเดือนปัจจุบัน
      actualMonth = parseInt(month);
      actualYear = parseInt(year);
    }
    
    // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
    const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    
    // ตรวจสอบจาก weekendData แบบเดิม (ถ้ามี)
    if (weekendData && Array.isArray(weekendData)) {
      const foundWeekend = weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
      if (foundWeekend) {
        console.log(`✅ วันที่ ${day} (${targetDateStr}) เป็นวันหยุดนักขัตฤกษ์ (dayOffOnly) - ระบายสีเทา`);
        return true;
      }
    }
    
    return false;
  };
  
  const isDayOffOnly = checkDayOffOnly(parseInt(day), parseInt(month), parseInt(year));
  
  // หาข้อมูลวันหยุดเพื่อแสดงใน tooltip
  const getHolidayInfo = (day, month, year) => {
    const targetDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // ตรวจสอบการลาป่วยก่อน
    if (isSickLeave) {
      // หาข้อมูลการลาป่วยที่ตรงกับวันนี้
      const sickLeaveInfo = record?.addSalaryList?.find(salaryItem => {
        if (salaryItem.welfareType === "ลาป่วย" || 
            salaryItem.name?.includes("ลาป่วย") || 
            salaryItem.name?.includes("ป่วย")) {
          const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
          const currentDay = parseInt(day);
          return dates.some(dateStr => parseInt(dateStr) === currentDay);
        }
        return false;
      });
      return sickLeaveInfo?.name || "ลาป่วย";
    }
    
    // ตรวจสอบจาก dayoffWorkplace ก่อน
    if (weekendData && weekendData.dayoffWorkplace && weekendData.dayoffWorkplace.includes(targetDateStr)) {
      return "วันหยุดตามปฏิทินการทำงาน";
    }
    
    // ตรวจสอบจาก weekendData แบบเดิม (ถ้ามี)
    if (weekendData && Array.isArray(weekendData)) {
      const foundWeekend = weekendData.find(item => item.date === targetDateStr);
      if (foundWeekend) {
        switch (foundWeekend.type) {
          case 'weekend':
            return "วันหยุดเสาร์-อาทิตย์";
          case 'dayOffOnly':
            return foundWeekend.message || "วันหยุดนักขัตฤกษ์";
          case 'weekendAndDayOff':
            return "วันหยุดเสาร์-อาทิตย์ + วันหยุดนักขัตฤกษ์";
          default:
            return "วันหยุดตามปฏิทินการทำงาน";
        }
      }
    }
    return "";
  };
  
  // กำหนดสีพื้นหลัง
  let backgroundColor = {};
  let color = {};

  if (isSickLeave) {
    backgroundColor = { backgroundColor: "#c5eaebff", color: "black" }; // สีดำสำหรับวันลาป่วย
    console.log(`🖤 วันที่ ${day} เป็นวันลาป่วย - ระบายสีดำ`);
  } else if (isSpecialHoliday) {
    console.log(`🟢 วันที่ ${day} เป็นวันหยุดส่วนบุคคล - ระบายสีเขียว`);
  } else if (isDayoffWorkplace || isDayOffOnly) {
    backgroundColor = { backgroundColor: "#9e9e9e" }; // สีเทาสำหรับวันหยุดจาก dayoffWorkplace หรือ dayOffOnly
    if (isDayoffWorkplace) {
      console.log(`🔘 วันที่ ${day} เป็นวันหยุดจาก dayoffWorkplace - ระบายสีเทา`);
      backgroundColor = { backgroundColor: "#9e9e9e" }; // สีเทาสำหรับวันหยุดจาก dayoffWorkplace
    }
    if (isDayOffOnly) {
      console.log(`🔘 วันที่ ${day} เป็นวันหยุดนักขัตฤกษ์ (dayOffOnly) - ระบายสีเทา`);
    }
  } else if (!isWork ) {
    backgroundColor = { backgroundColor: "" };
  }

  if(specialIndividual) {
    backgroundColor = { backgroundColor: "#9e9e9e", color: "red" }; // สีเทาพื้นหลังและตัวอักษรสีเหลืองสำหรับวันหยุดพิเศษ
  }

  // Debug: แสดงข้อมูล weekendData ทั้งหมด (ทำครั้งเดียวพอ)
  if (day === dayNumbers[0]) { // แสดงเฉพาะวันแรกเพื่อไม่ให้ spam log
 
    
    // ตรวจสอบโครงสร้างข้อมูล weekendData ทั้งหมด
    if (Array.isArray(weekendData)) {
      weekendData.forEach((item, index) => {
     
      });
    }
  }
  
  // ตรวจสอบ workplaceId ของพนักงานคนนี้ทั้งหมด (เฉพาะ record ที่มี totalTime)
  const recordsWithTotalTime = record?.employee_record?.filter(item => item.totalTime && item.totalTime.trim() !== '') || [];
  const allWorkplaceIds = recordsWithTotalTime.map(item => item.workplaceId) || [];
  const uniqueWorkplaceIds = [...new Set(allWorkplaceIds)]; // เอาค่าที่ซ้ำออก
  const isSameWorkplace = uniqueWorkplaceIds.length <= 1; // ถ้ามีแค่ workplaceId เดียวหรือไม่มีเลย = เหมือนกันหมด
  
  // กำหนดค่าที่จะแสดง
  let displayValue = '';

  if (isSickLeave) {
    // ถ้าเป็นวันลาป่วย ให้แสดงตัวย่อตามประเภทการลา
    const sickLeaveItem = record?.addSalaryList?.find(salaryItem => {
      if (salaryItem.welfareType === "ลาป่วย" || 
          salaryItem.welfareType === "ลาคลอด" ||
          salaryItem.name?.includes("ลาป่วย") || 
          salaryItem.name?.includes("ป่วย") ||
          salaryItem.name?.includes("ลาพักร้อน") ||
          salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
        
        const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
        const currentDay = parseInt(day);
        return dates.some(dateStr => parseInt(dateStr) === currentDay);
      }
      return false;
    });
    
    // กำหนดตัวย่อตามชื่อการลา
    
  } else if (isWork) { // แสดงข้อมูลการทำงานทั้งวันปกติและวันหยุด
    // เปรียบเทียบ workplaceId ของ record กับ searchWorkplaceId ที่เลือก
    const recordWorkplaceId = found?.workplaceId;
    const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
    
    // ตรวจสอบว่าพนักงานคนนี้เป็นพนักงานข้ามหน่วยงานหรือไม่
    const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
    
    if (isCrossWorkplaceEmployee) {
      // ถ้าเป็นพนักงานข้ามหน่วยงาน ให้แสดง "1" เฉพาะวันที่มาทำงานที่หน่วยงานที่เลือกเท่านั้น
      if (isMatchSearchWorkplace) {
        displayValue = '1';
      }
      // ถ้าไม่ตรงกับ searchWorkplaceId = ไม่แสดงอะไร (วันที่ไม่ได้มาทำงานที่หน่วยงานนี้)
    } else {
      // พนักงานปกติที่สังกัดหน่วยงานนี้
      if (found?.shift === "cash_holiday" && found?.startTime) {
        // 🔥 ปรับปรุง: ตรวจสอบเวลาเริ่มงานสำหรับ cash_holiday
        const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
        if (startHour >= 6 && startHour <= 15) {
          // กะเช้า (06:00-15:00) - แสดงเลข 1 สีแดง
          displayValue = <span style={{ color: 'red' }}>1</span>;
        }
        // ถ้าไม่อยู่ในช่วงเวลาเช้า (06:00-15:00) ไม่แสดงอะไรในแถวเช้า
      } else if (found?.shift === "morning_shift") {
        // เฉพาะ morning_shift เท่านั้น
        displayValue = '1';
      }
    }
  }

  // เพิ่มเงื่อนไขพิเศษ: ถ้าเป็นวันหยุดส่วนบุคคลแต่มี totalTime ให้แสดงเลข 1
  // แต่ไม่แสดงถ้าเป็น cash_holiday กะดึก (startTime 18:00-03:00)
  if (specialIndividual && found?.totalTime && found.totalTime.trim() !== '') {
    // ตรวจสอบว่าเป็น cash_holiday กะดึกหรือไม่
    if (found?.shift === "cash_holiday" && found?.startTime) {
      const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
      // ถ้าเป็นกะดึก (18:00-03:00) ไม่แสดงในแถวเช้า
      if (!(startHour >= 18 || (startHour >= 0 && startHour <= 3))) {
        displayValue = "1";
      }
    } else {
      // ไม่ใช่ cash_holiday ให้แสดงปกติ
      displayValue = "1";
    }
  }

  
  return (
    <td 
      key={i} 
      className="text-center align-middle" 
      style={backgroundColor}
      title={isSickLeave ? getHolidayInfo(parseInt(day), parseInt(month), parseInt(year)) : isSpecialHoliday ? "วันหยุดส่วนบุคคล" : (isDayoffWorkplace || isDayOffOnly) ? getHolidayInfo(parseInt(day), parseInt(month), parseInt(year)) : (found?.workplaceName || "")}
    >
      {displayValue}
    </td>
  );
})}

                    <td className="text-center text-red align-middle">
                      {/* รวมวันทำงาน */}
                    {record.dayWorkCount || ''} 
                      </td>

                    <td className="text-center text-red align-middle" style={{backgroundColor:"#fcdfca"}}>
                       {/* รวมวันหยุด */}
                    {record.customizeDayoff || ''} 
                      
                      </td>

                      

                    <td className="text-center text-red align-middle">
                   {/* วันหยุดนักขัตฤกษ์ */}
                    {record.publicHolidayCount || ''} 
                    </td>

                    <td className="text-center text-red align-middle"> 
                      {/* วันหยุดนักขัตฤกษ์ชั่วโมง */}
                      {record.sumOtPublicHoliday || ''}
                    </td>

                   <td className="text-center text-red align-middle p-1">
    {(() => { 
      const originalValue = record.sumOt1p5;
   
      return originalValue || '';
    })()}
</td>
                    

                    <td className="text-center align-middle text-red p-1">
                      {/* ชม 3 เท่า */}
                    {record.sumOt3 || ''} 
                    </td>

                 

                   
  
                    {(() => {
                      const mergedItems = mergeWorkplaceAddsalary(workplaceAddsalary);
                      return mergedItems.map((item, i) => {
                        // สำหรับ item ที่ถูกรวมแล้ว ให้หาข้อมูลจากทั้ง sourceId1 และ sourceId2
                        let displayValue = "";
                        if (item.codeSpSalary === MERGE_CONFIG.displayId) {
                          const foundSourceId1 = record.addSalaryList.find(itemx => itemx.id === MERGE_CONFIG.sourceId1);
                          const foundSourceId2 = record.addSalaryList.find(itemx => itemx.id === MERGE_CONFIG.sourceId2);
                          const valueSourceId1 = foundSourceId1?.message && !isNaN(foundSourceId1.message) ? parseFloat(foundSourceId1.message) : 0;
                          const valueSourceId2 = foundSourceId2?.message && !isNaN(foundSourceId2.message) ? parseFloat(foundSourceId2.message) : 0;
                          displayValue = (valueSourceId1 + valueSourceId2) || "";
                        } else {
                          const found = record.addSalaryList.find(itemx => itemx.id === item.codeSpSalary);
                          const value = found?.message;
                          displayValue = value && !isNaN(value) ? parseFloat(value) : "";
                        }
                        
                        return (
                           <td key={i} className="text-center text-red p-1 align-middle">
                            {displayValue}
                          </td>
                        );
                      });
                    })()}
                      <td className="text-center text-red align-middle">{record.cash || ''}</td>
                      <td></td>
                      <td></td>
                      


                    
                    
            
                    
                    

            
                        </tr>

                    <tr>
                    <td></td>
                    
                    <td><span style={{ float: "right" }}>ดึก</span></td>
                    {dayNumbers.map((day, i) => {
                      // หา record ทั้งหมดของวันนี้
                      const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
                      
                      // 🔥 แก้ไข: สำหรับแถวดึก ให้หา night_shift record ก่อน และ cash_holiday กะดึก
                      const nightShiftRecord = allRecordsForDay.find(itemx => itemx.shift === "night_shift");
                      
                      // หา cash_holiday record สำหรับกะดึก (18:00-03:00)
                      const cashHolidayNightRecord = allRecordsForDay.find(itemx => {
                        if (itemx.shift === "cash_holiday" && itemx.startTime) {
                          const startHour = parseFloat(itemx.startTime.replace('.', ':').split(':')[0]);
                          return startHour >= 18 || (startHour >= 0 && startHour <= 3); // กะดึก 18:00-03:00
                        }
                        return false;
                      });
                      
                      const found = nightShiftRecord || cashHolidayNightRecord || allRecordsForDay.find(itemx => itemx.totalTime && itemx.totalTime.trim() !== '') || allRecordsForDay[0];
                      
                      // ตรวจสอบว่าเป็นการทำงานกะดึกหรือไม่
                      const isNightShiftWork = found?.dayType === "work" && found?.shift === "night_shift";
                      
                      // ตรวจสอบว่าวันนี้อยู่ใน stopDaysList หรือไม่
                      const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
                        const stopDayDate = parseInt(stopDay.date);
                        const currentDay = parseInt(day);
                        return stopDayDate === currentDay;
                      });

                      // ตรวจสอบทั้ง specialt_shift และ stopDaysList สำหรับกะดึก
                      const specialIndividualNight = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
                      const dayNum = parseInt(day);
                      let actualMonth, actualYear;
                      
                      // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
                      if (dayNum >= 21) {
                        // วันที่ 21-31 เป็นของเดือนก่อนหน้า
                        if (parseInt(month) === 1) {
                          actualMonth = 12;
                          actualYear = parseInt(year) - 1;
                        } else {
                          actualMonth = parseInt(month) - 1;
                          actualYear = parseInt(year);
                        }
                      } else {
                        // วันที่ 1-20 เป็นของเดือนปัจจุบัน
                        actualMonth = parseInt(month);
                        actualYear = parseInt(year);
                      }
                      
                      // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
                      const daysInActualMonth = new Date(actualYear, actualMonth, 0).getDate();
                      const isInvalidDate = dayNum > daysInActualMonth;

                      // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
                      const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                      
                      // ตรวจสอบจาก dayoffWorkplace
                      const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
                      const isSickLeave = record?.addSalaryList?.some(salaryItem => {
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
        salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      return isMatch;
    }
    return false;
  });
                      
                      // ตรวจสอบจาก dayOffOnly
                      const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
                      const isWork = found?.dayType === "work"
                      
                      // ตรวจสอบว่าเป็นวันหยุดพิเศษหรือไม่
                      const isSpecialHoliday = record?.personalDayOff?.some(personalDay => {
                        const personalDayDate = parseInt(personalDay.date);
                        const currentDay = parseInt(day);
                        return personalDayDate === currentDay;
                      }) || record?.stopDaysList?.some(stopDay => {
                        const stopDayDate = parseInt(stopDay.date);
                        const currentDay = parseInt(day);
                        return stopDayDate === currentDay;
                      });
                      
                      // กำหนดสีพื้นหลังและค่าที่จะแสดง
                      let backgroundColor = {};
                      let displayValue = '';
                      
                      if (isSpecialHoliday) {
                        backgroundColor = { backgroundColor: "#00ff00" }; // สีเขียวสำหรับวันหยุดพิเศษ
                        // ตรวจสอบเพิ่มเติม: ถ้าเป็น cash_holiday กะดึกให้แสดงเลข 1 สีแดง
                        if (found?.shift === "cash_holiday" && found?.startTime) {
                          const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                          if (startHour >= 18 || (startHour >= 0 && startHour <= 3)) {
                            displayValue = <span style={{ color: 'red' }}>1</span>; // เลข 1 สีแดงสำหรับ cash_holiday กะดึก
                          }
                        }
                      } else if (isDayOffOnly ) {
                        backgroundColor = { backgroundColor: "#9e9e9e" }; 
                        // แสดงเลข 1 ถ้ามี totalTime และเป็น night_shift
                        if (found?.totalTime && found.totalTime.trim() !== '' && found?.shift === "night_shift") {
                          displayValue = '1';
                        }
                        // แสดงเลข 1 ถ้าเป็น cash_holiday และ startTime อยู่ในช่วงกะดึก (18:00-03:00)
                        if (found?.shift === "cash_holiday" && found?.startTime) {
                          const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                          if (startHour >= 18 || (startHour >= 0 )) {
                            displayValue = <span style={{ color: 'red' }}>1</span>; // เลข 1 สีแดงสำหรับ cash_holiday กะดึก
                          }
                        }
                      } else if (isDayoffWorkplace || isInvalidDate ) {
                        backgroundColor = { backgroundColor: "#9e9e9e" }; // สีเทาสำหรับวันหยุดหรือวันที่ไม่มีอยู่จริง
                      } else if (isNightShiftWork) {
                        displayValue = '1'; // แสดงเลข 1 เมื่อมาทำงานกะดึก
                      } else if (found?.shift === "cash_holiday" && found?.startTime) {
                        // ถ้าเป็น cash_holiday และ startTime อยู่ในช่วงกะดึก (18:00-03:00) - ไม่ใช่วันหยุด
                        const startHour = parseFloat(found.startTime.replace('.', ':').split(':')[0]);
                        if (startHour >= 18 || (startHour >= 0 && startHour <= 3)) {
                          displayValue = <span style={{ color: 'red' }}>1</span>; // เลข 1 สีแดงสำหรับ cash_holiday กะดึก
                        }
                      }
                      if(isSickLeave) {
                        backgroundColor = { backgroundColor: "#c5eaebff", color: "black" }; // สีดำสำหรับวันลาป่วย
                      }

                      if(specialIndividualNight) {
                        backgroundColor = { backgroundColor: "#9e9e9e" }; // สีม่วงสำหรับวันหยุดพิเศษ
                      }
                      
                      return (
                        <td key={i} className="text-center align-middle" style={backgroundColor}>
                          {displayValue}
                        </td>
                      );
                    })}

                    <td  className="text-center align-middle">
                    {/* เงินวันทำงาน */}
                      {record.sumCashWork ? formatNumberWithComma(record.sumCashWork) : ''}
                      </td>

                    <td  className="text-center align-middle" style={{backgroundColor:"#fcdfca"}}>
                       {/* รวมเงินจ่ายนักขัต*/}
                      {record.cashcustomizeDayoff ? formatNumberWithComma(record.cashcustomizeDayoff) : ''}

                     
                      </td>

                      <td  className="text-center p-1 align-middle">
                      {/* รวมเงินทำงานนักขัติ */}
                      {record.publicHolidayCash ? formatNumberWithComma(record.publicHolidayCash) : ''}
                      </td>

                    <td className="p-1 align-middle">
                      {/* รวมเงินทำงานโอที2*/}
                      {record.sumCashWorkMul["2"] ? formatNumberWithComma(record.sumCashWorkMul["2"]) : ''}
                    </td>
                    {/* คำนวณเงินโอทีื3 */}
                    <td className="p-1 align-middle">
                      {record.sumCashWorkMul["1.5"] ? formatNumberWithComma(record.sumCashWorkMul["1.5"]) : ''} 
                      </td>
                   <td className="p-1 align-middle">
                      {
                        record.sumCashWorkMul["3"]
                          ? formatNumberWithComma(parseFloat(record.sumCashWorkMul["3"]).toFixed(2))
                          : ""
                      }
                    </td>
                    

                    
                    
                    {(() => {
                      const mergedItems = mergeWorkplaceAddsalary(workplaceAddsalary);
                      return mergedItems.map((item, i) => {
                        let value = 0;
                        if (item.codeSpSalary === MERGE_CONFIG.displayId) {
                          // รวมค่าจาก sourceId1 และ sourceId2
                          const foundSourceId1 = record.addSalaryList.find(itemx => itemx.id === MERGE_CONFIG.sourceId1);
                          const foundSourceId2 = record.addSalaryList.find(itemx => itemx.id === MERGE_CONFIG.sourceId2);
                          const valueSourceId1 = parseFloat(foundSourceId1?.SpSalary || 0);
                          const valueSourceId2 = parseFloat(foundSourceId2?.SpSalary || 0);
                          value = valueSourceId1 + valueSourceId2;
                        } else {
                          const found = record.addSalaryList.find(itemx => itemx.id === item.codeSpSalary);
                          value = parseFloat(found?.SpSalary || 0);
                        }
                        
                        const isZero = value === 0;

                        return (
                          <td
                            key={i}
                            className={`text-center p-1 align-middle ${isZero ? "bg-secondary text-white fw-bold" : ""}`}
                          >
                            {isZero ? "NO" : formatNumberWithComma(value.toFixed(2))}
                          </td>
                        );
                      });
                    })()}
                     <td className="text-center align-middle text-red p-1">
                      {/* จ่ายสด  */}
                    {(record.specialShiftTotalSalary && parseFloat(record.specialShiftTotalSalary) >= 50 ? formatNumberWithComma(parseFloat(record.specialShiftTotalSalary).toFixed(2)) : '') || (record.tax ? formatNumberWithComma(parseFloat(record.specialShiftTotalSalary).toFixed(2)) : '')} 

                    </td>
                      <td className="text-center align-middle text-red p-1">
                      {/* หักประกันสังคม  */}
                    {(record.tax && parseFloat(record.tax) > 0 ? formatNumberWithComma(parseFloat(record.tax).toFixed(2)) : '') || (record.socialSecurity && parseFloat(record.socialSecurity) >= 50 ? formatNumberWithComma(parseFloat(record.socialSecurity).toFixed(2)) : '')} 

                    </td>

                    <td className="text-center align-middle text-red p-1">
                      {/* เงินสงเคราะห์ลูกจ้าง  */}
                      {record.employeeAllowance ? formatNumberWithComma(parseFloat(record.employeeAllowance).toFixed(2)) : ''}
                    </td>


                    </tr>
                    {/*  */}
                    <tr>
                    <td></td>
                    <td className="text-right"><span >{record.employeeId} โอที 1.5 </span></td>


                    

                {dayNumbers.map((day, i) => {
                    // 🔧 แก้ไข: หา record ที่มี OT data ก่อน ไม่ใช่ record แรกที่เจอ
                    const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
                    
                    // หา record ที่มี OT data ก่อน (cashOtMul = "1.5" และมี totalOtTime > 0)
                    const foundWithOT = allRecordsForDay.find(itemx => 
                      itemx.cashOtMul === "1.5" && 
                      itemx.totalOtTime && 
                      parseFloat(itemx.totalOtTime) > 0
                    );
                    
                    // ถ้าไม่มี OT record ให้ใช้ record แรก
                    const found = foundWithOT || allRecordsForDay[0];
                    
                    const hasData = found && found.date; // ตรวจสอบว่ามีข้อมูลหรือไม่
                    
                    // ตรวจสอบว่าวันนี้อยู่ใน stopDaysList หรือไม่
                    const isInStopDaysList = record?.stopDaysList?.some(stopDay => {
                      const stopDayDate = parseInt(stopDay.date);
                      const currentDay = parseInt(day);
                      return stopDayDate === currentDay;
                    });
                    const isSickLeave2 = record?.addSalaryList?.some(salaryItem => {
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
       salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      return isMatch;
    }
    return false;
  });
                    // ตรวจสอบทั้ง specialt_shift และ stopDaysList สำหรับ OT 1.5
                    const specialIndividualOT15 = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
                    
                    // ตรวจสอบวันหยุดเหมือนกับแถวเช้า
                    const dayNum = parseInt(day);
                    let actualMonth, actualYear;
                    
                    // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
                    if (dayNum >= 21) {
                      // วันที่ 21-31 เป็นของเดือนก่อนหน้า
                      if (parseInt(month) === 1) {
                        actualMonth = 12;
                        actualYear = parseInt(year) - 1;
                      } else {
                        actualMonth = parseInt(month) - 1;
                        actualYear = parseInt(year);
                      }
                    } else {
                      // วันที่ 1-20 เป็นของเดือนปัจจุบัน
                      actualMonth = parseInt(month);
                      actualYear = parseInt(year);
                    }
                    
                    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
                    const daysInActualMonth = new Date(actualYear, actualMonth, 0).getDate();
                    const isInvalidDate = dayNum > daysInActualMonth;
                    
                    // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
                    const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                    
                    // ตรวจสอบจาก dayoffWorkplace
                    const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
                    
                    // ตรวจสอบจาก dayOffOnly
                    const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
                    
                    // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
                    const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
                    const recordWorkplaceId = found?.workplaceId;
                    const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
                    
                    // กำหนดเงื่อนไขการแสดงผล
                    let shouldShowData = false;
                    if (isCrossWorkplaceEmployee) {
                      // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก
                      shouldShowData = hasData && isMatchSearchWorkplace;
                    } else {
                      // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล
                      shouldShowData = hasData;
                    }
                    
                    // กำหนดสีพื้นหลัง (วันหยุดเป็นสีเทา)
                    const isHoliday = isDayoffWorkplace || isInvalidDate  || isDayOffOnly;
                    const isSickLeave = record?.addSalaryList?.some(salaryItem => {
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
        salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      return isMatch;
    }
    return false;
  });
                    let backgroundColor;
                    
                    
                    if (specialIndividualOT15) {
                      // ให้ความสำคัญกับ specialt_shift และ stopDaysList ก่อน
                      backgroundColor = { backgroundColor: "#9e9e9e" , color: "red" }; // สีเทาพื้นหลังและตัวอักษรสีแดงสำหรับวันหยุดพิเศษ
                    } else if (isHoliday) {
                      // ตรวจสอบว่ามี totalOtTime และ cashOtMul = "1.5" หรือไม่ - ถ้าไม่มีให้เป็นสีเทา
                      const hasTotalOtTime = found?.totalOtTime && parseFloat(found.totalOtTime) > 0 && found?.cashOtMul === "1.5";
                      backgroundColor = hasTotalOtTime ? { backgroundColor: "" } : { backgroundColor: "#9e9e9e" };
                    } else {
                      backgroundColor = {};
                    }
                    if(isSickLeave2) {
                      backgroundColor = { backgroundColor: "#c5eaebff", color: "black" }; // สีดำสำหรับวันลาป่วย
                    }

                    return (
                      <td key={i} className="text-center align-middle" style={backgroundColor}>
                        {shouldShowData && found?.cashOtMul?.trim() && found?.cashOtMul === "1.5" && found?.shift !== "specialt_shift"
                          ? (() => {
                              // รวม beforeTotalOtTime และ totalOtTime แทนการ join
                              const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
                              const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
                              const summedTime = beforeTime + totalTime;
                              return summedTime > 0 ? formatTimeValue(summedTime) : '';
                            })()
                          : (specialIndividualOT15 && found?.cashOtMul?.trim() && found?.cashOtMul === "1.5")
                            ? (() => {
                                // แสดง OT ในวันหยุดส่วนบุคคล
                                const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
                                const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
                                const summedTime = beforeTime + totalTime;
                                return summedTime > 0 ? formatTimeValue(summedTime) : '';
                              })()
                            : ''}
                      </td>
                    );
                  })}
                <td></td>
                <td style={{backgroundColor:"#fcdfca"}}></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                {workplaceAddsalary.map((item, i) => (
                        <td key={i} className="text-center"></td>
                    ))}
                    <td></td>
                    <td></td>
                    <td></td>
      
                    </tr>
                    {/*  */}
                    <tr>
                    <td></td>

                    <td className="text-right"><span >โอที 2</span></td>
                    {dayNumbers.map((day, i) => {
                    // 🔧 แก้ไข: หา record ที่มี data จริง ไม่ใช่ cash_holiday
                    const allRecordsForDay = record?.employee_record?.filter(itemx => itemx.date === day) || [];
                    
                    // หา record ที่ไม่ใช่ cash_holiday และมี totalTime ก่อน
                    const foundWithData = allRecordsForDay.find(itemx => 
                      itemx.shift !== "cash_holiday" && 
                      itemx.totalTime && 
                      itemx.totalTime.trim() !== ''
                    );
                    
                    // ถ้าไม่มี record ที่มีข้อมูล ให้ใช้ record แรกที่ไม่ใช่ cash_holiday
                    const foundNonCashHoliday = allRecordsForDay.find(itemx => itemx.shift !== "cash_holiday");
                    
                    // ใช้ record ที่มีข้อมูลก่อน ถ้าไม่มีก็ใช้ non-cash_holiday ถ้าไม่มีก็ใช้ record แรก
                    const found = foundWithData || foundNonCashHoliday || allRecordsForDay[0];

  // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
  const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
  const recordWorkplaceId = found?.workplaceId;
  const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
  const isSickLeave = record?.addSalaryList?.some(salaryItem => {
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
       salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      return isMatch;
    }
    return false;
  });
  
  // กำหนดเงื่อนไขการแสดงผล
  let shouldShowData = false;
  if (isCrossWorkplaceEmployee) {
    // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก และต้องเป็น dayType "stop" และมี totalTime
    shouldShowData = found && isMatchSearchWorkplace && found?.dayType === "stop" && found.totalTime;
  } else {
    // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล dayType "stop" และมี totalTime
    shouldShowData = found?.dayType === "stop" && found.totalTime;
  }

  // ตรวจสอบวันหยุดเหมือนกับแถวอื่นๆ (ถ้าไม่มีข้อมูลให้แสดงแล้ว)
  let backgroundColor = {};
  
  // ประกาศตัวแปรนอก if block เพื่อให้สามารถเข้าถึงได้จากภายนอก
  let isInStopDaysList = false;
  let specialIndividual = false;
  let isSpecialHoliday = false;
  
  if (!shouldShowData) {
    const dayNum = parseInt(day);
    let actualMonth, actualYear;
    
    // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
    if (dayNum >= 21) {
      // วันที่ 21-31 เป็นของเดือนก่อนหน้า
      if (parseInt(month) === 1) {
        actualMonth = 12;
        actualYear = parseInt(year) - 1;
      } else {
        actualMonth = parseInt(month) - 1;
        actualYear = parseInt(year);
      }
    } else {
      // วันที่ 1-20 เป็นของเดือนปัจจุบัน
      actualMonth = parseInt(month);
      actualYear = parseInt(year);
    }
    
    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
    const daysInActualMonth = new Date(actualYear, actualMonth, 0).getDate();
    const isInvalidDate = dayNum > daysInActualMonth;
    
    // ตรวจสอบว่า stopDaysList มีวันที่นี้หรือไม่
    isInStopDaysList = record?.stopDaysList?.some(stopDay => {
      const stopDayDate = parseInt(stopDay.date);
      const currentDay = parseInt(day);
      return stopDayDate === currentDay;
    });
    
    // ตรวจสอบเงื่อนไขพิเศษ: specialt_shift หรือ stopDaysList
    specialIndividual = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
    
    isSpecialHoliday = record?.dayType ==="stop"
    // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
    const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    
    // ตรวจสอบจาก dayoffWorkplace
    const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
    
    // ตรวจสอบจาก dayOffOnly
    const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
    
    const isAbsent = found?.dayType === "work"; // ตรวจสอบว่าเป็นวันขาดงานหรือไม่
    // ถ้าเป็นวันหยุดหรือวันที่ไม่มีอยู่จริง ให้เป็นสีเทา
    if (isDayoffWorkplace || isInvalidDate || isDayOffOnly) {
      backgroundColor = { backgroundColor: "#9e9e9e" };
    }
  } else {
    // ตรวจสอบ isDayOffOnly ก่อนกำหนดสีเหลือง
    const dayNum = parseInt(day);
    let actualMonth, actualYear;
    
    if (dayNum >= 21) {
      if (parseInt(month) === 1) {
        actualMonth = 12;
        actualYear = parseInt(year) - 1;
      } else {
        actualMonth = parseInt(month) - 1;
        actualYear = parseInt(year);
      }
    } else {
      actualMonth = parseInt(month);
      actualYear = parseInt(year);
    }
    
    const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    const isDayOffOnlyForYellow = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
    
    // ถ้ามีข้อมูลให้แสดงและเป็น dayOffOnly ใช้สีเหลืองตามเดิม
    if (isDayOffOnlyForYellow  && found?.cashOtMul ==="2") {
      backgroundColor = { backgroundColor: "yellow" };
    }
    else {
      backgroundColor = { backgroundColor: "#9e9e9e"};
    }
  }
  if (isSickLeave) {
    backgroundColor = { backgroundColor: "#c5eaebff" }; // สีฟ้าอ่อนสำหรับวันลาป่วย
  } 
  if(specialIndividual) { 
    backgroundColor = { backgroundColor: "#9e9e9e" , color: "red" }; // สีเทาพื้นหลังและตัวอักษรสีแดงสำหรับวันหยุดพิเศษ
  }

  // ตรวจสอบ isDayOffOnly สำหรับการแสดงข้อมูล
  const dayNum = parseInt(day);
  let actualMonth, actualYear;
  
  if (dayNum >= 21) {
    if (parseInt(month) === 1) {
      actualMonth = 12;
      actualYear = parseInt(year) - 1;
    } else {
      actualMonth = parseInt(month) - 1;
      actualYear = parseInt(year);
    }
  } else {
    actualMonth = parseInt(month);
    actualYear = parseInt(year);
  }
  
  const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
  const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');

  // เพิ่มเงื่อนไขให้ช่องที่เหมือนกันแต่ไม่ใช่ dayOffOnly เป็นสีเทา
  if (shouldShowData && !isDayOffOnly) {
    backgroundColor = { backgroundColor: "#9e9e9e" }; // สีเทาอ่อน
  }

  return (
    <td 
      key={i} 
      className="text-red align-middle text-center"
      style={backgroundColor}
    >
      {(shouldShowData && isDayOffOnly && found?.cashOtMul ==="2") ? formatTimeValue(found.totalTime) : 
       (specialIndividual && found?.dayType === "stop" && found.totalTime && isDayOffOnly) ? 
       formatTimeValue(found.totalTime) : ''}
    </td>
  );
})}       
<td></td>     
<td style={{backgroundColor:"#fcdfca"}}></td>     
<td></td>
<td></td>
<td></td>
<td></td>
{workplaceAddsalary.map((_, i) => (
                        <td key={i} className="text-center"></td>
                    ))}
                    <td></td>
                    <td></td>
                    <td></td>              
                    
                    </tr>
                    {/*  */}
                    {/* <tr>
                    <td style={{ borderTop:0, borderBottom: "none" }}className="bordered"></td>
                    <td><span style={{  paddingLeft:"75px" ,paddingBottom:"120px",display:"inline-block"}}>โอที 3 </span></td>
                    {Array.from({ length: 47 }).map((_, i) => (
                            <td key={i} className="text-center"></td>
                        ))}
                    </tr> */}

                    <tr className="" style={{ borderBottom: "3px solid #000" }}>
  <td></td>
  <td className="text-right"  ><span style={{ paddingLeft: "85px" }}>โอที3</span></td>
  {dayNumbers.map((day, i) => {
const found = record?.employee_record?.find(itemx => itemx.date === day);

  // 🆕 ตรวจสอบการลาก่อน
  const isSickLeave = record?.addSalaryList?.some(salaryItem => {
    // เช็คเฉพาะ welfare ที่เป็นการลาป่วย หรือ ลาพักร้อน
    if (salaryItem.welfareType === "ลาป่วย" || 
        salaryItem.welfareType === "ลาคลอด" ||
        salaryItem.name?.includes("ลาป่วย") || 
        salaryItem.name?.includes("ป่วย") ||
        salaryItem.name?.includes("ลาพักร้อน") ||
        salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")){
      
      // แปลง date string เป็น array ของวันที่
      const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
      const currentDay = parseInt(day);
      
      const isMatch = dates.some(dateStr => parseInt(dateStr) === currentDay);
      return isMatch;
    }
    return false;
  });

  // ถ้าเป็นวันลา ให้แสดงสัญลักษณ์การลา
  if (isSickLeave) {
    // หาข้อมูลการลาที่ตรงกับวันนี้
    const sickLeaveItem = record?.addSalaryList?.find(salaryItem => {
      if (salaryItem.welfareType === "ลาป่วย" || 
          salaryItem.welfareType === "ลาคลอด" ||
          salaryItem.name?.includes("ลาป่วย") || 
          salaryItem.name?.includes("ป่วย") ||
          salaryItem.name?.includes("ลาพักร้อน") ||
          salaryItem.name?.includes("ชดเชย") ||
                  salaryItem.name?.includes("ลากิจ")) {
        
        const dates = salaryItem.date ? salaryItem.date.split(',').map(d => d.trim()) : [];
        const currentDay = parseInt(day);
        return dates.some(dateStr => parseInt(dateStr) === currentDay);
      }
      return false;
    });
    
    // กำหนดตัวย่อตามชื่อการลา
    let leaveSymbol = '';
    if (sickLeaveItem) {
      const leaveName = sickLeaveItem.name || sickLeaveItem.welfareType || '';
      
      if (leaveName.includes("ลาพักร้อน") || leaveName.includes("ชดเชย")) {
        leaveSymbol = 'พร'; // พักร้อน
      } else if (leaveName.includes("ลาป่วย") || leaveName.includes("ป่วย")) {
        leaveSymbol = 'ป'; // ป่วย
      } else if (leaveName.includes("ลาคลอด") || leaveName.includes("คลอด")) {
        leaveSymbol = 'ค'; // คลอด
      } else if (leaveName.includes("ลากิจ") || leaveName.includes("กิจ")) {
        leaveSymbol = 'ก'; // กิจ
      } else if (leaveName.includes("ลาบวช")) {
        leaveSymbol = 'บ'; // บวช
      } else if (leaveName.includes("ลาทหาร")) {
        leaveSymbol = 'ท'; // ทหาร
      } else {
        leaveSymbol = 'ล'; // การลาทั่วไป
      }
    } else {
      leaveSymbol = 'ล'; // fallback
    }
    
    return (
      <td 
        key={i} 
        className="text-center align-middle"
        style={{ backgroundColor: "#c5eaebff", color: "black" }}
      >
        {leaveSymbol}
      </td>
    );
  }

  // ไม่ใช่วันลา ตรวจสอบข้อมูล OT 3 ตามปกติ
  // ตรวจสอบว่าเป็นพนักงานข้ามหน่วยงานหรือไม่
  const isCrossWorkplaceEmployee = record?.isCrossWorkplace || false;
  const recordWorkplaceId = found?.workplaceId;
  const isMatchSearchWorkplace = recordWorkplaceId === searchWorkplaceId;
  
  // กำหนดเงื่อนไขการแสดงผล
  let shouldShowData = false;
  if (isCrossWorkplaceEmployee) {
    // พนักงานข้ามหน่วยงาน: แสดงเฉพาะวันที่มาทำงานที่หน่วยงานที่เลือก และต้องเป็น dayType "stop" และมี cashOtMul "3"
    shouldShowData = found && isMatchSearchWorkplace && found?.dayType === "stop" && found?.cashOtMul?.trim() && found.cashOtMul === "3";
  } else {
    // พนักงานปกติ: แสดงทุกวันที่มีข้อมูล dayType "stop" และมี cashOtMul "3"
    shouldShowData = found?.dayType === "stop" && found?.cashOtMul?.trim() && found.cashOtMul === "3";
  }

  // ตรวจสอบวันหยุดเหมือนกับแถวอื่นๆ (ถ้าไม่มีข้อมูลให้แสดงแล้ว)
  let backgroundColor = {};
  
  // ประกาศตัวแปรนอก if block เพื่อให้สามารถเข้าถึงได้จากภายนอก
  let isInStopDaysList = false;
  let specialIndividualOT3 = false;
  
  if (!shouldShowData) {
    const dayNum = parseInt(day);
    let actualMonth, actualYear;
    
    // ตรวจสอบว่าเป็นวันไหนจากเดือนไหน (ตารางแสดงข้ามเดือน 21-31 เดือนก่อน และ 1-20 เดือนปัจจุบัน)
    if (dayNum >= 21) {
      // วันที่ 21-31 เป็นของเดือนก่อนหน้า
      if (parseInt(month) === 1) {
        actualMonth = 12;
        actualYear = parseInt(year) - 1;
      } else {
        actualMonth = parseInt(month) - 1;
        actualYear = parseInt(year);
      }
    } else {
      // วันที่ 1-20 เป็นของเดือนปัจจุบัน
      actualMonth = parseInt(month);
      actualYear = parseInt(year);
    }
    
    // ตรวจสอบว่าวันที่นี้มีอยู่จริงในเดือนนั้นหรือไม่
    const daysInTargetMonth = new Date(actualYear, actualMonth, 0).getDate();
    const isInvalidDate = dayNum > daysInTargetMonth;
    
    // ตรวจสอบว่า stopDaysList มีวันที่นี้หรือไม่
    isInStopDaysList = record?.stopDaysList?.some(stopDay => {
      const stopDayDate = parseInt(stopDay.date);
      const currentDay = parseInt(day);
      return stopDayDate === currentDay;
    });

    // ตรวจสอบเงื่อนไขพิเศษ: specialt_shift หรือ stopDaysList สำหรับ OT 3
    specialIndividualOT3 = (found?.dayType === "work" && found?.shift === "specialt_shift") || isInStopDaysList;
    
    if (isInvalidDate) {
      // วันที่ไม่มีอยู่จริง - สีเทา
      backgroundColor = { backgroundColor: "#9e9e9e" };
    } else {
      // สร้างวันที่ในรูปแบบ YYYY-MM-DD เพื่อเปรียบเทียบกับข้อมูลจาก API
      const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      
      // ตรวจสอบจาก dayoffWorkplace
      const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
      
      // ตรวจสอบจาก dayOffOnly
      const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
      const isAbsent = found?.dayType === "work"; // ตรวจสอบว่าเป็นวันขาดงานหรือไม่
      
      // ถ้าเป็นวันหยุด ให้เป็นสีเทา
      if (isDayoffWorkplace || isDayOffOnly  ) {
        backgroundColor = { backgroundColor: "#9e9e9e" };
      }
    }
  } else if( found?.cashOtMul ==="3") {
    backgroundColor = { backgroundColor: "#fae0f1" };
  }

  if(specialIndividualOT3) {
    backgroundColor = { backgroundColor: "#9e9e9e" , color: "red" }; // สีเทาพื้นหลังและตัวอักษรสีแดงสำหรับวันหยุดพิเศษ
  }

  return (
    <td 
      key={i} 
      className="text-center align-middle"
      style={backgroundColor}
    >
      {shouldShowData
        ? (() => {
            // รวม beforeTotalOtTime และ totalOtTime แทนการ join
            const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
            const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
            const summedTime = beforeTime + totalTime;
            return summedTime > 0 ? formatTimeValue(summedTime) : '';
          })()
        : (specialIndividualOT3 && found?.cashOtMul?.trim() && found?.cashOtMul === "3")
          ? (() => {
              // แสดง OT 3 ในวันหยุดส่วนบุคคล
              const beforeTime = found.beforeTotalOtTime ? parseFloat(found.beforeTotalOtTime) : 0;
              const totalTime = found.totalOtTime ? parseFloat(found.totalOtTime) : 0;
              const summedTime = beforeTime + totalTime;
              return summedTime > 0 ? formatTimeValue(summedTime) : '';
            })()
          : ''}
    </td>
  );
})}
  {/* Add empty cells for overtime and workplace columns */}
  <td></td>
  <td style={{backgroundColor:"#fcdfca"}}></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
    <td key={`ws-${i}`} className="text-center"></td>
  ))}
  <td></td>
  <td></td>
  <td></td>

</tr>

                    </React.Fragment>
                          );
                        } catch (error) {
                          console.error(`Error rendering employee at index ${idx}:`, error);
                          return (
                            <tr key={`error-${idx}`}>
                              <td colSpan={dayNumbers.length + 10} className="text-center text-danger p-2">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                เกิดข้อผิดพลาดในการแสดงข้อมูลพนักงาน ID: {record?.employeeId || 'Unknown'}
                              </td>
                            </tr>
                          );
                        }
                      }).filter(Boolean) : [] // กรองเอา null ออก
                    )}
                    <tr style={{borderTop: "2px solid #000" }}> 
                      <td className="text-bold p-1 align-middle" style={{ backgroundColor:"#fff7c2"}} colSpan={2}>รวมพนักงานทำงาน/วัน</td>
                      {dayNumbers.map((day, i) => {
                        const count = employeeCountPerDay[i] || 0;
                        const isZero = count === 0;
                        return (
                          <td 
                            key={i} 
                            className={`text-center text-bold align-middle ${isZero ? "" : ""}`}
                            style={isZero ? { backgroundColor: "#bfbdbf" } : {}}
                          >
                            {isZero ? "" : count}
                          </td>
                        );
                      })}
                        <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "  " }}>
                        {employeeCountPerDay.reduce((total, count) => total + (count || 0), 0)}
                      </td>
                      {/* เติมช่องสำหรับค่าล่วงเวลาและสวัสดิการ */}
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      {Array.from({ length: 5 - 1 }).map((_, i) => (
                        <td key={i} className="text-center" style={{ backgroundColor: "" }}></td>
                      ))}
                      {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                        <td key={`ws-${i}`} className="text-center" style={{ backgroundColor: "" }}></td>
                      ))}
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      
                    </tr>

                    {/* แถวรวมพนักงานตามสัญญา/วัน */}
                    <tr style={{borderTop: "2px solid #000" }}> 
                      <td className="text-bold p-1 align-middle" style={{ backgroundColor:"#fff7c2"}} colSpan={2}>รวมพนักงานตามสัญญา/วัน</td>
                      {dayNumbers.map((day, i) => {
                        const count = contractEmployeeCount || 0;
                        const isZero = count === 0;
                        return (
                          <td 
                            key={i} 
                            className={`text-center text-bold align-middle ${isZero ? "" : ""}`}
                            style={isZero ? { backgroundColor: "#bfbdbf" } : {}}
                          >
                            {isZero ? "" : count}
                          </td>
                        );
                      })}
                        <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "  " }}>
                        {contractEmployeeCount ? contractEmployeeCount * dayNumbers.filter(day => {
                          const dayNum = parseInt(day);
                          let actualMonth, actualYear;
                          if (dayNum >= 21) {
                            actualMonth = month === "01" ? 12 : parseInt(month) - 1;
                            actualYear = month === "01" ? parseInt(year) - 1 : parseInt(year);
                          } else {
                            actualMonth = parseInt(month);
                            actualYear = parseInt(year);
                          }
                          const daysInActualMonth = new Date(actualYear, actualMonth, 0).getDate();
                          const isInvalidDate = dayNum > daysInActualMonth;
                          const targetDateStr = `${actualYear}-${actualMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                          const isDayoffWorkplace = weekendData && weekendData.dayoffWorkplace && Array.isArray(weekendData.dayoffWorkplace) && weekendData.dayoffWorkplace.includes(targetDateStr);
                          const isDayOffOnly = weekendData && Array.isArray(weekendData) && weekendData.find(item => item.date === targetDateStr && item.type === 'dayOffOnly');
                          return !isInvalidDate && !isDayoffWorkplace && !isDayOffOnly;
                        }).length : 0}
                      </td>
                      {/* เติมช่องสำหรับค่าล่วงเวลาและสวัสดิการ */}
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      {Array.from({ length: 5 - 1 }).map((_, i) => (
                        <td key={i} className="text-center" style={{ backgroundColor: "" }}></td>
                      ))}
                      {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                        <td key={`ws-${i}`} className="text-center" style={{ backgroundColor: "" }}></td>
                      ))}
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      <td className="text-center" style={{ backgroundColor: "" }}></td>
                      
                    </tr>

                    <tr > 
                      <td className="text-bold p-1 align-middle text-red" style={{ backgroundColor:"#fff7c2"}} colSpan={2}>พนักงานขาดงาน</td>
                      {dayNumbers.map((day, i) => {
                        const absentCount = absentEmployeesPerDay[i] || 0;
                        const presentCount = employeeCountPerDay[i] || 0;
                        const isZero = absentCount === 0;
                        const isHoliday = presentCount === 0; // วันหยุดถ้าไม่มีคนมาทำงาน
                        
                        return (
                          <td 
                            key={i} 
                            className={`text-center text-bold align-middle ${isZero ? "" : "text-danger"}`}
                          >
                            {isZero ? "" : absentCount}
                          </td>
                        );
                      })}
                      
                      {/* ช่องรวมพนักงานขาดงานทั้งหมด */}
                     <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#dc3545" }}>
                        {absentEmployeesPerDay.reduce((total, count) => total + (count || 0), 0)}
                      </td>
                      <td></td>
                      <td></td>
                      <td id="sumofPublicHoliday" className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#1654a6" }}>
                          {formatTimeValue(totalOtPublicHoliday)}
                      </td>
                      <td id="sumofPublicHoliday" className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#1654a6" }}>
                          {formatTimeValue(totalOtWithOvertime1_5)}
                      </td>
                      <td id="sumofPublicHoliday" className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#1654a6" }}>
                          {formatTimeValue(totalOtWithOvertime3)}
                      </td>

                      {/* เติมช่องสำหรับสวัสดิการ */}
                      {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                        <td key={`ws-${i}`} className="text-center"></td>
                      ))}
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                      
                    </tr>



                    <tr> 
                        <td colSpan={2} className="text-right text-bold align-middle " style={{ backgroundColor:"#fff7c2",color:"#007500"}}>โอที 1.5 เท่า</td>
                        {dayNumbers.map((day, i) => {
                          const overtimeSum = overtimeSumPerDay[i] || 0;
                          const isZero = overtimeSum === 0;
                          return (
                            <td 
                              key={i} 
                              className={`text-center text-bold align-middle`}
                              style={isZero ? { backgroundColor: "#bfbdbf" , color: "" } : { color: "green" }}
                            >
                              {isZero ? "" : formatTimeValue(overtimeSum)}
                            </td>
                          );
                        })}
                         <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#000" }}>
                            {formatTimeValue(overtimeSumPerDay.reduce((total, sum) => total + (sum || 0), 0))}
                        </td>                        {/* เติมช่องสำหรับค่าล่วงเวลาและสวัสดิการ */}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                          <td key={`ws-${i}`} className="text-center"></td>
                        ))}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
 
                    </tr>

                    <tr> 
                        <td colSpan={2} className="text-right text-bold align-middle " style={{ backgroundColor:"#fff7c2",color:"#80801b"}}>โอที 2 เท่า</td>
                        {dayNumbers.map((day, i) => {
                          const overtime2Sum = overtime2SumPerDay[i] || 0;
                          
                          
                          const isZero = overtime2Sum === 0;
                          
                          
                          return (
                            <td 
                              key={i} 
                              className={`text-center text-bold align-middle`}
                              style={isZero ? { backgroundColor: "#bfbdbf" , color: "" } : { color: "green"  , backgroundColor: "yellow" }}
                            >
                              {isZero ? "" : formatTimeValue(overtime2Sum)}
                            </td>
                          );
                        })}
                        <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#000" }}>
                            {formatTimeValue(overtime2SumPerDay.reduce((total, sum) => total + (sum || 0), 0))}
                        </td>
                        {/* เติมช่องสำหรับค่าล่วงเวลาและสวัสดิการ */}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                          <td key={`ws-${i}`} className="text-center"></td>
                        ))}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                 
                    </tr>

                    <tr> 
                        <td colSpan={2} className="text-right text-bold align-middle " style={{ backgroundColor:"#fff7c2",color:"#e8a0e3"}}>โอที 3 เท่า</td>
                        {dayNumbers.map((day, i) => {
                          const overtime3Sum = overtime3SumPerDay[i] || 0;
                          const isZero = overtime3Sum === 0;
                          return (
                            <td 
                              key={i} 
                              className={`text-center text-bold align-middle`}
                              style={isZero ? { backgroundColor: "#bfbdbf" , color: "" } : { color: "green" , backgroundColor: "#fae0f1" }}
                            >
                              {isZero ? "" : formatTimeValue(overtime3Sum)}
                            </td>
                          );
                        })}
                        <td className="text-center text-bold align-middle" style={{ backgroundColor: "#fff7c2", color: "#000" }}>
                            {formatTimeValue(overtime3SumPerDay.reduce((total, sum) => total + (sum || 0), 0))}
                        </td>
                        {/* เติมช่องสำหรับค่าล่วงเวลาและสวัสดิการ */}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        {mergeWorkplaceAddsalary(workplaceAddsalary).map((_, i) => (
                          <td key={`ws-${i}`} className="text-center"></td>
                        ))}
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                        <td className="text-center"></td>
                 
                    </tr>
                 


                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {/* ปิด showTable */}

                      
                    </form>

                      {/* <button
                        onClick={generatePDFTest123}
                        type="button "
                        class="btn b_save"
                      >
                        <i class="nav-icon fas fa-search"></i>
                        พิมพ์รายงาน
                      </button> */}
                      
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* <div class="row">
              <div class="col-md-2">
            
                {result_data.map(
                  (employeerecord) =>
                    employeerecord.employeeId +
                    ": ชื่อพนักงาน " +
                    employeerecord.employeeName
                )}
              </div>
            </div> */}
            {/* <br /> */}
          {/* </section> */}


    </section>

          {/* <!-- /.content --> */}
        </div>
      </div>
      {/* {JSON.stringify(listDayOff,null,2)} */}
    {/* </body> */}
</div>
  );
  
  } catch (error) {
    // ถ้าเกิด error ในการ render
    console.error('Render Error in WorktimeSheetWorkplace:', error);
    handleError(error);
    
    // Return error fallback UI
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            เกิดข้อผิดพลาดในการแสดงผล
          </h4>
          <p className="mb-3">ไม่สามารถแสดงตารางเวลาทำงานได้</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-refresh me-1"></i>
            รีเฟรชหน้า
          </button>
        </div>
      </div>
    );
  }

function getMonthName(monthNumber) {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return months[monthNumber - 1] || "";
}

const getDateDayOfWeek = (dateString) => {
  // Create a Date object with the input date string in the format YYYY/mm/dd
  const date = new Date(dateString);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();
  // Return the day of the week (Sunday, Monday, etc.)
  // const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //overide
  const daysOfWeek = ["1", "2", "3", "4", "5", "6", "7"];
  return daysOfWeek[dayOfWeek];
  // console.log('dayOfWeek',dayOfWeek);
};
} 




export default WorktimeSheetWorkplace;