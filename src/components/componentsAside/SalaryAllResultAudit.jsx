import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
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

import { addYears } from "date-fns";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function SalaryAllResultAudit({ employeeList, workplaceList }) {
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState("");
  const [workplaceListAll, setWorkplaceListAll] = useState([workplaceList]);

  const [responseDataAll, setResponseDataAll] = useState([]);

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
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
  const [formattedDate321, setFormattedDate] = useState(null);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setWorkDate(newDate);
  };

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

  console.log("selectedDate", selectedDate);
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formattedWorkDateDD = moment(workDate).format("DD");
  const formattedWorkDateMM = moment(workDate).format("MM");
  const formattedWorkDateYYYY = moment(workDate).format("YYYY");

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

  useEffect(() => {
    const fetchData = () => {
      const dataTest = {
        year: year,
        month: month,
      };

      axios
        .post(endpoint + "/accounting/calsalarylist", dataTest)
        .then((response) => {
          const responseData = response.data;

          console.log("searchWorkplaceId", searchWorkplaceId);
          console.log("responseData", responseData);

          // Filter the data by workplace and also ensure name and lastName exist
          const filteredData = responseData
            .filter((item) =>
              searchWorkplaceId ? item.workplace === searchWorkplaceId : true
            )
            .filter((item) => item.name && item.lastName); // Only include items with both name and lastName

          // const updatedData = filteredData.map((item) => {
          //   const matchingEmployee = employeeList.find(
          //     (emp) => emp.employeeId === item.employeeId
          //   );

          //   if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
          //     // Modify the workplace by changing the first digit to '2'
          //     item.workplace = "2" + item.workplace.slice(1);
          //   }

          //   return item;
          // });
          setResponseDataAll(filteredData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    fetchData();
  }, [year, month, searchWorkplaceId]);

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

  console.log("responseDataAll", responseDataAll);

  const generatePDF01 = () => {
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

    const cellWidthSalary = 17;
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

    const cellWidthOT = 17;
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

    const cellWidthWelfare = 17;
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

    const cellWidthRoleWork = 17;
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

    const cellWidthDiligenceAllowance = 17;
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

    const cellWidthHoliday = 17;
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

    const cellWidthAddBeforeDeductTax = 17;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 41 + cellWidthOT * 6;
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(ก่อนหัก ปกส)`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 17;
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
          const cellText = `หักอื่นๆ\n(ก่อนหัก ปกส)`;
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

    const cellWidthAddBeforeDeductTax2nd = 17;
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
          const cellText = `บวกอื่นๆ\n(หลังหัก ปกส)`;
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

    const cellWidthMinusBeforeDeductTax2nd = 17;
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
          const cellText = `หักอื่นๆ\n(หลังหัก ปกส)`;
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

    const cellWidthDeductTax = 17;
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

    const cellWidthDeductTaxSocialSecurity = 17;
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

    const cellWidthAddAfterDeductTax = 17;
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

    const cellWidthMinusAfterDeductTax = 17;
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

    const cellWidthAdvancePayment = 17;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 41 + cellWidthOT * 13;
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

    const cellWidthBank = 17;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 41 + cellWidthOT * 14;
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

    const cellWidthResult = 17;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 41 + cellWidthOT * 14;
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

    const groupedByWorkplace = responseDataAll.reduce((acc, employee) => {
      const { workplace } = employee;
      acc[workplace] = acc[workplace] || {
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
      acc[workplace].employees.push(employee);
      // acc[workplace].name.push(employee.name);

      const addSalary = employee.addSalary || [];
      const spSalarySum = addSalary.reduce((total, item) => {
        if (item.id === "1230" || item.id === "1520" || item.id === "1350") {
          return total + parseFloat(item.SpSalary || 0);
        }
        return total;
      }, 0);

      // Adjust this line based on your specific structure to get the salary or any other relevant data
      acc[workplace].totalCountDay += parseFloat(
        employee.accountingRecord?.[0]?.countDay || 0
      );
      acc[workplace].totalSalary += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWork || 0
      );

      acc[workplace].totalAmountPosition += parseFloat(
        employee.accountingRecord?.[0]?.amountPosition || 0
      );
      acc[workplace].totalTel += parseFloat(
        employee.accountingRecord?.[0]?.tel || 0
      );
      acc[workplace].totalTravel += parseFloat(
        employee.accountingRecord?.[0]?.travel || 0
      );

      // acc[workplace].totalAllAddSalary += parseFloat(employee.accountingRecord?.[0]?.amountPosition + employee.accountingRecord?.[0]?.tel + employee.accountingRecord?.[0]?.travel || 0);

      acc[workplace].totalBenefitNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.benefitNonSocial || 0
      );

      acc[workplace].totalAmountSpecialDay += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecialDay || 0
      );

      acc[workplace].totalAmountOt += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplace].totalAmountSpecial += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecial || 0
      );
      // acc[workplace].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);

      // acc[workplace].totalAmountHardWorking += parseFloat(employee.accountingRecord?.[0]?.amountHardWorking || 0);

      acc[workplace].totalAmountHoliday += parseFloat(
        employee.accountingRecord?.[0]?.amountHoliday || 0
      );

      acc[workplace].totalDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.deductBeforeTax || 0
      );
      acc[workplace].totalAddAmountBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
      );
      acc[workplace].totalTax += parseFloat(
        employee.accountingRecord?.[0]?.tax || 0
      );
      acc[workplace].totalSocialSecurity += parseFloat(
        employee.accountingRecord?.[0]?.socialSecurity || 0
      );
      acc[workplace].totalAddAmountAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountAfterTax || 0
      );
      acc[workplace].totalAdvancePayment += parseFloat(
        employee.accountingRecord?.[0]?.advancePayment || 0
      );
      acc[workplace].totalDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.deductAfterTax || 0
      );
      acc[workplace].totalBank += parseFloat(
        employee.accountingRecord?.[0]?.bank || 0
      );
      acc[workplace].totalTotal += parseFloat(
        employee.accountingRecord?.[0]?.total ?? 0
      );

      acc[workplace].totalSpSalary += parseFloat(
        employee.sumAddSalaryBeforeTax ?? 0
      ); // Add the sum to totalSpSalary

      acc[workplace].totalSumAddSalaryBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTax ?? 0
      );
      acc[workplace].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial ?? 0
      );
      acc[workplace].totalSumDeductBeforeTaxWithSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial ?? 0
      );
      acc[workplace].totalSumDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTax ?? 0
      );
      acc[workplace].totalSumAddSalaryAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
      );
      acc[workplace].totalSumDeductAfterTax += parseFloat(
        employee.accountingRecordsumDeductAfterTax ?? 0
      );

      // ((countSpecialDay - countSpecialDayListWork) * specialDayRate)
      const sum = parseFloat(
        Number(
          (employee.countSpecialDay - employee.specialDayListWork.length) *
          employee.specialDayRate
        ) || 0
      );
      acc[workplace].totalSumtest += sum;

      // const sumOT = parseFloat(employee.accountingRecord?.[0]?.amountOt + (employee.specialDayListWork * employee.specialDayRate) || 0);
      const sumOT = parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplace].totalSumOT += sumOT;

      const spSalaryHardWorkSum = addSalary.reduce((total, item) => {
        if (item.id === "1410") {
          return total + parseFloat(item.SpSalary || 0);
        }
        return total;
      }, 0);
      acc[workplace].totalAmountHardWorking += spSalaryHardWorkSum;

      // acc[workplace].totalSumOT += sumOT;

      // Parse and calculate the value
      // const countSpecialDay = Number(employee.countSpecialDay);
      // const specialDayRate = Number(employee.specialDayRate);

      // console.log('countSpecialDay',countSpecialDay);
      // console.log('specialDayRate',specialDayRate);

      // // Check if countSpecialDay and specialDayRate are valid numbers, otherwise default to 0
      // const parsedCountSpecialDay = isNaN(countSpecialDay) ? 0 : countSpecialDay;
      // const parsedSpecialDayRate = isNaN(specialDayRate) ? 0 : specialDayRate;

      // // Calculate the product and add to the totalCountSpecialDaySumSpecialDayRate
      // acc[workplace].totalCountSpecialDaySumSpecialDayRate += parsedCountSpecialDay * parsedSpecialDayRate;

      // acc[workplace].totalCountSpecialDaySumSpecialDayRate += parseFloat((Number(employee.countSpecialDay) * Number(employee.specialDayRate)) ?? 0); // Add the sum to totalSpSalary

      acc[workplace].totalEmp += 1;

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
    // Object.keys(groupedByWorkplace).forEach((workplaceKey, index) => {
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
            // drawAdvancePayment();
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

            // หักภาษี
            const formattedTax = Number(
              accountingRecord?.[0]?.tax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
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
            // const formattedAddAmountAfterTax = Number(accountingRecord.addAmountAfterTax ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // pdf.text(`${formattedAddAmountAfterTax}`,
            //     startXAddAfterDeductTax + cellWidthAddAfterDeductTax, currentY, { align: 'right' });
            const formattedSumAddSalaryAfterTax = Number(
              accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            pdf.text(
              `${formattedSumAddSalaryAfterTax}`,
              startXAddAfterDeductTax + cellWidthAddAfterDeductTax,
              currentY,
              { align: "right" }
            );

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
            // const formattedAdvancePayment = Number(
            //   accountingRecord?.[0]?.advancePayment ?? 0
            // ).toLocaleString("en-US", {
            //   minimumFractionDigits: 2,
            //   maximumFractionDigits: 2,
            // });
            // pdf.text(
            //   `${formattedAdvancePayment}`,
            //   startXAdvancePayment + cellWidthAdvancePayment,
            //   currentY,
            //   { align: "right" }
            // );

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
              `พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543
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
        // const formattedTotalAdvancePayment = totalAdvancePayment.toLocaleString(
        //   "en-US",
        //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        // );
        // pdf.text(
        //   `${formattedTotalAdvancePayment}`,
        //   startXAdvancePayment + cellWidthAdvancePayment,
        //   currentY,
        //   { align: "right" }
        // );

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  const generatePDF02 = () => {
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

    const cellWidthSalary = 17;
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

    const cellWidthOT = 17;
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

    const cellWidthWelfare = 17;
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

    const cellWidthRoleWork = 17;
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

    const cellWidthDiligenceAllowance = 17;
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

    const cellWidthHoliday = 17;
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

    const cellWidthAddBeforeDeductTax = 17;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 39 + cellWidthOT * 6;
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\n(ก่อนหัก ปกส)`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 17;
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
          const cellText = `หักอื่นๆ\n(ก่อนหัก ปกส)`;
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

    const cellWidthAddBeforeDeductTax2nd = 17;
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
          const cellText = `บวกอื่นๆ\n(หลังหัก ปกส)`;
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

    const cellWidthMinusBeforeDeductTax2nd = 17;
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
          const cellText = `หักอื่นๆ\n(หลังหัก ปกส)`;
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

    const cellWidthDeductTax = 17;
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

    const cellWidthDeductTaxSocialSecurity = 17;
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

    const cellWidthAddAfterDeductTax = 17;
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

    const cellWidthMinusAfterDeductTax = 17;
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
          const cellText = `เบิกล่วงหน้า`;
          drawCell(x, y, cellWidthMinusAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAdvancePayment = 17;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 39 + cellWidthOT * 13;
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

    const cellWidthBank = 17;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 39 + cellWidthOT * 14;
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

    const cellWidthResult = 17;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 39 + cellWidthOT * 14;
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

    const groupedByWorkplace = responseDataAll.reduce((acc, employee) => {
      const { workplace } = employee;
      acc[workplace] = acc[workplace] || {
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
      acc[workplace].employees.push(employee);
      // acc[workplace].name.push(employee.name);

      // Adjust this line based on your specific structure to get the salary or any other relevant data
      acc[workplace].totalSalary += parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWork || 0
      );
      // acc[workplace].totalAmountOt += parseFloat(employee.accountingRecord?.[0]?.amountOt || 0);
      const sumOT = parseFloat(
        employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
      );
      acc[workplace].totalAmountOt += sumOT;

      // acc[workplace].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);
      // acc[workplace].totalTel += parseFloat(employee.accountingRecord?.[0]?.tel || 0);
      // acc[workplace].totalTravel += parseFloat(employee.accountingRecord?.[0]?.travel || 0);
      const totalAmountPositio = parseFloat(
        employee.accountingRecord?.[0]?.amountPosition || 0
      );
      const totalTel = parseFloat(employee.accountingRecord?.[0]?.tel || 0);
      const totalTravel = parseFloat(
        employee.accountingRecord?.[0]?.travel || 0
      );

      acc[workplace].totalAmountPositio += totalAmountPositio;
      acc[workplace].totalTel += totalTel;
      acc[workplace].totalTravel += totalTravel;
      acc[workplace].totalAddSalary +=
        totalAmountPositio + totalTel + totalTravel;

      acc[workplace].totalAmountSpecial += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecial || 0
      );
      acc[workplace].totalAmountPosition += parseFloat(
        employee.accountingRecord?.[0]?.benefitNonSocial || 0
      );
      acc[workplace].totalAmountHardWorking += parseFloat(
        employee.accountingRecord?.[0]?.amountHardWorking || 0
      );
      acc[workplace].totalAmountHoliday += parseFloat(
        employee.accountingRecord?.[0]?.amountHoliday || 0
      );
      acc[workplace].totalAmountSpecialDay += parseFloat(
        employee.accountingRecord?.[0]?.amountSpecialDay || 0
      );

      acc[workplace].totalDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.deductBeforeTax || 0
      );
      acc[workplace].totalAddAmountBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
      );
      acc[workplace].totalTax += parseFloat(
        employee.accountingRecord?.[0]?.tax || 0
      );
      acc[workplace].totalSocialSecurity += parseFloat(
        employee.accountingRecord?.[0]?.socialSecurity || 0
      );
      acc[workplace].totalAddAmountAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.addAmountAfterTax || 0
      );
      acc[workplace].totalAdvancePayment += parseFloat(
        employee.accountingRecord?.[0]?.advancePayment || 0
      );
      acc[workplace].totalDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.deductAfterTax || 0
      );
      acc[workplace].totalBank += parseFloat(
        employee.accountingRecord?.[0]?.bank || 0
      );
      acc[workplace].totalTotal += parseFloat(
        employee.accountingRecord?.[0]?.total ?? 0
      );

      acc[workplace].totalSumAddSalaryBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
      );
      acc[workplace].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
      );
      acc[workplace].totalSumDeductBeforeTaxWithSocial += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial || 0
      );
      acc[workplace].totalSumDeductBeforeTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductBeforeTax || 0
      );
      acc[workplace].totalSumAddSalaryAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumAddSalaryAfterTax || 0
      );
      acc[workplace].totalSumDeductAfterTax += parseFloat(
        employee.accountingRecord?.[0]?.sumDeductAfterTax || 0
      );
      // amountSpecialDay

      acc[workplace].totalEmp += 1;

      return acc;
    }, {});

    console.log("groupedByWorkplace", groupedByWorkplace);

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
        const {
          employees,
          totalSalary,
          totalAmountOt,
          totalAmountSpecial,
          // totalAmountPosition,

          totalAmountPosition,
          totalTel,
          totalTravel,
          totalAddSalary,

          totalAmountHardWorking,
          totalAmountHoliday,
          totalAmountSpecialDay,
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
          totalSumAddSalaryBeforeTax,
          totalSumAddSalaryBeforeTaxNonSocial,
          totalSumDeductBeforeTaxWithSocial,
          totalSumDeductBeforeTax,
          totalSumAddSalaryAfterTax,
          totalSumDeductAfterTax,
        } = groupedByWorkplace[workplaceKey];

        const workplaceDetails = workplaceListAll.find(
          (w) => w.workplaceId == workplaceKey
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
            // drawMinusAfterDeductTax();
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
          `${totalTax.toFixed(0)}`,
          startXDeductTax + cellWidthDeductTax,
          currentY,
          { align: "right" }
        );

        // หักปกส
        pdf.text(
          `${totalSocialSecurity.toFixed(0)}`,
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

        // // เบิกล่วงหน้า
        // pdf.text(
        //   `${totalAdvancePayment.toFixed(2)}`,
        //   startXAdvancePayment + cellWidthAdvancePayment,
        //   currentY,
        //   { align: "right" }
        // );

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
      `${totalTaxSum.toFixed(0)}`,
      startXDeductTax + cellWidthDeductTax,
      currentY,
      { align: "right" }
    ); // Adjust coordinates as needed

    // หักปกส
    pdf.text(
      `${totalSocialSecuritySum.toFixed(0)}`,
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
    // pdf.text(
    //   `${totalAdvancePaymentSum.toFixed(2)}`,
    //   startXAdvancePayment + cellWidthAdvancePayment,
    //   currentY,
    //   { align: "right" }
    // ); // Adjust coordinates as needed
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
  const handleStaffIdChange = (e) => {
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
      setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      // setWorkplacrName(selectedEmployee.workplaceName);
    } else {
      setWorkplacrId("");
      // setSearchWorkplaceId('');
      // setWorkplacrName('');
    }
    setWorkplacrName(selectWorkplaceName);
  };

  const groupedByWorkplace = responseDataAll.reduce((acc, employee) => {
    const { workplace } = employee;
    const matchingWorkplace = workplaceList.find((w) => w.workplaceId === workplace);

    acc[workplace] = acc[workplace] || {
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
    acc[workplace].employees.push(employee);
    // acc[workplace].name.push(employee.name);

    // Adjust this line based on your specific structure to get the salary or any other relevant data
    acc[workplace].totalSalary += parseFloat(
      employee.accountingRecord?.[0]?.amountCountDayWork || 0
    );
    // acc[workplace].totalAmountOt += parseFloat(employee.accountingRecord?.[0]?.amountOt || 0);
    const sumOT = parseFloat(
      employee.accountingRecord?.[0]?.amountCountDayWorkOt || 0
    );
    acc[workplace].totalAmountOt += sumOT;

    // acc[workplace].totalAmountPosition += parseFloat(employee.accountingRecord?.[0]?.amountPosition || 0);
    // acc[workplace].totalTel += parseFloat(employee.accountingRecord?.[0]?.tel || 0);
    // acc[workplace].totalTravel += parseFloat(employee.accountingRecord?.[0]?.travel || 0);
    const totalAmountPositio = parseFloat(
      employee.accountingRecord?.[0]?.amountPosition || 0
    );
    const totalTel = parseFloat(employee.accountingRecord?.[0]?.tel || 0);
    const totalTravel = parseFloat(employee.accountingRecord?.[0]?.travel || 0);

    acc[workplace].totalAmountPositio += totalAmountPositio;
    acc[workplace].totalTel += totalTel;
    acc[workplace].totalTravel += totalTravel;
    acc[workplace].totalAddSalary +=
      totalAmountPositio + totalTel + totalTravel;

    acc[workplace].totalAmountSpecial += parseFloat(
      employee.accountingRecord?.[0]?.amountSpecial || 0
    );
    acc[workplace].totalAmountPosition += parseFloat(
      employee.accountingRecord?.[0]?.benefitNonSocial || 0
    );
    acc[workplace].totalAmountHardWorking += parseFloat(
      employee.accountingRecord?.[0]?.amountHardWorking || 0
    );
    acc[workplace].totalAmountHoliday += parseFloat(
      employee.accountingRecord?.[0]?.amountHoliday || 0
    );
    acc[workplace].totalAmountSpecialDay += parseFloat(
      employee.accountingRecord?.[0]?.amountSpecialDay || 0
    );

    acc[workplace].totalDeductBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.deductBeforeTax || 0
    );
    acc[workplace].totalAddAmountBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.addAmountBeforeTax || 0
    );
    acc[workplace].totalTax += parseFloat(
      employee.accountingRecord?.[0]?.tax || 0
    );
    acc[workplace].totalSocialSecurity += parseFloat(
      employee.accountingRecord?.[0]?.socialSecurity || 0
    );
    acc[workplace].totalAddAmountAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.addAmountAfterTax || 0
    );
    acc[workplace].totalAdvancePayment += parseFloat(
      employee.accountingRecord?.[0]?.advancePayment || 0
    );
    acc[workplace].totalDeductAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.deductAfterTax || 0
    );
    acc[workplace].totalBank += parseFloat(
      employee.accountingRecord?.[0]?.bank || 0
    );
    acc[workplace].totalTotal += parseFloat(
      employee.accountingRecord?.[0]?.total ?? 0
    );

    acc[workplace].totalSumAddSalaryBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
    );
    acc[workplace].totalSumAddSalaryBeforeTaxNonSocial += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryBeforeTaxNonSocial || 0
    );
    acc[workplace].totalSumDeductBeforeTaxWithSocial += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductBeforeTaxWithSocial || 0
    );
    acc[workplace].totalSumDeductBeforeTax += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductBeforeTax || 0
    );
    acc[workplace].totalSumAddSalaryAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.sumAddSalaryAfterTax || 0
    );
    acc[workplace].totalSumDeductAfterTax += parseFloat(
      employee.accountingRecord?.[0]?.sumDeductAfterTax || 0
    );
    // amountSpecialDay

    acc[workplace].totalEmp += 1;

    return acc;
  }, {});

  console.log("groupedByWorkplace", groupedByWorkplace);

  const exportToExcel = () => {
    const headers = [
      "รหัส",
      "หน่วยงาน",
      "เงินเดือน",
      "ค่าล่วงเวลา",
      "ค่ารถ/โทร/ตน.",
      "สวัสดิการ(ไม่คิด ปกส.)",
      "เบี้ยขยัน",
      "นักขัติ",
      "บวกอื่นๆ(ก่อนหัก ปกส)",
      "หักอื่นๆ(ก่อนหัก ปกส",
      "บวกอื่นๆ(หลังหัก ปกส)",
      "หักอื่นๆ(หลังหัก ปกส)",
      "หักภาษี",
      "หักปกส",
      "บวกอื่นๆ",
      "เบิกล่วงหน้า",
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
        "บวกอื่นๆ(ก่อนหัก ปกส)": Number(item.totalSumAddSalaryBeforeTax.toFixed(2) || 0),
        "หักอื่นๆ(ก่อนหัก ปกส)":
          Number(item.totalSumDeductBeforeTaxWithSocial.toFixed(2) || 0),
        "บวกอื่นๆ(หลังหัก ปกส)": Number(item.totalSumAddSalaryBeforeTaxNonSocial.toFixed(2) || 0),
        "หักอื่นๆ(หลังหัก ปกส)": Number(item.totalSumDeductBeforeTax.toFixed(2) || 0),
        "หักภาษี": Number(item.totalTax.toFixed(0) || 0),
        "หักปกส": Number(item.totalSocialSecurity.toFixed(0) || 0),
        "บวกอื่นๆ": Number(item.totalSumAddSalaryAfterTax.toFixed(2) || 0),
        "เบิกล่วงหน้า": Number(item.totalAdvancePayment.toFixed(2) || 0),
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
      "หักภาษี": totals.totalTax.toFixed(0),
      "หักปกส": totals.totalSocialSecurity.toFixed(0),
      "บวกอื่นๆ": totals.totalSumAddSalaryAfterTax.toFixed(2),
      "เบิกล่วงหน้า": totals.totalAdvancePayment.toFixed(2),
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
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <span>หน้าหลัก</span>
            </li>
            <li class="breadcrumb-item">
              <span> รายงาน ออดิท</span>
            </li>
            <li class="breadcrumb-item active">สรุปหน่วยงานทั้งหมด</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  สรุปหน่วยงานทั้งหมด
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">สรุปหน่วยงานทั้งหมด</h2>
              <section class="Frame">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-3">
                      <label role="searchEmployeeId">รหัสหน่วยงาน</label>
                      {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchWorkplaceId(e.target.value)} /> */}
                      <input
                        type="text"
                        className="form-control"
                        id="staffId"
                        placeholder="รหัสหน่วยงาน"
                        value={workplacrId}
                        onChange={handleStaffIdChange}
                        onInput={(e) => {
                          // Remove any non-digit characters
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        list="WorkplaceIdList"
                      />
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
                        id="staffName"
                        placeholder="ชื่อหน่วยงาน"
                        value={workplacrName}
                        onChange={handleStaffNameChange}
                        list="WorkplaceNameList"
                      />

                      <datalist id="WorkplaceNameList">
                        {workplaceListAll.map((workplace) => (
                          <option
                            key={workplace.workplaceId}
                            value={workplace.workplaceName}
                          />
                        ))}
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
                    class="btn btn-success"
                    style={{ width: "10rem" }}
                    onClick={generatePDF01}
                  >
                    PDF รายหน่วยงาน
                  </button>
                  <button
                    class="btn btn-success"
                    style={{ marginLeft: "1rem", width: "11rem" }}
                    onClick={generatePDF02}
                  >
                    PDF หน่วยงานทั้งหมด
                  </button>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-12">
                    <button class="btn btn-success" style={{ width: "10rem" }}
                      onClick={exportToExcel}>Export to Excel</button>
                  </div>
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
    </div>
    // </div>
  );
}

export default SalaryAllResultAudit;
