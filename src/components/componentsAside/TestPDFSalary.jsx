import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react'; import { jsPDF } from 'jspdf';

import 'jspdf-autotable';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import 'moment/locale/th'; // Import the Thai locale data

function TestPDFSalary() {

  const [workplacrId, setWorkplacrId] = useState(''); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(''); //รหัสหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState('');
  const [workplaceListAll, setWorkplaceListAll] = useState([]);

  const [responseDataAll, setResponseDataAll] = useState([]);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');


  const [workDate, setWorkDate] = useState(new Date());
  const formattedWorkDate = moment(workDate).format('DD/MM/YYYY');
  const handleWorkDateChange = (date) => {
    setWorkDate(date);
  };
  const [present, setPresent] = useState('DATAOWAT');
  const [presentfilm, setPresentfilm] = useState("\\10.10.110.20\payrolldata\Report\User\PRUSR101.RPT");

  moment.locale('th');

  const formattedWorkDateDD = moment(workDate).format('DD');
  const formattedWorkDateMM = moment(workDate).format('MM');
  const formattedWorkDateYYYY = moment(workDate).format('YYYY');

  const formattedDate = workDate.toLocaleString('en-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Bangkok', // Thailand timezone
  });

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + '/workplace/list')
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched data
        setWorkplaceListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log('workplaceListAll', workplaceListAll);


  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from({ length: currentYear - EndYear + 1 }, (_, index) => EndYear + index).reverse();

  // const dataTest = {
  //   year: "2024",
  //   month: "03",
  // };
  // // const x = axios.post(endpoint + '/accounting/calsalarylist', dataTest);
  // axios.post(endpoint + '/accounting/calsalarylist', dataTest)
  //   .then(response => {
  //     const responseData = response.data;

  //     console.log('responseData', responseData);
  //     // setResponseDataAll(responseData); 
  //     // Now you can use the data as needed
  //     // For example, you can iterate over the array of data

  //     // responseData.forEach(item => {
  //     //   console.log(item);
  //     //   // Your logic with each item
  //     // });
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });


  // const dataTest = {
  //   year: "2024",
  //   month: "03",
  // };

  const fetchData = () => {

    // const dataTest = {
    //   year: "2024",
    //   month: "03",
    // };

    const dataTest = {
      year: year,
      month: month,
    };



    axios.post(endpoint + '/accounting/calsalarylist', dataTest)
      .then(response => {
        const responseData = response.data;

        console.log('responseData', responseData);
        setResponseDataAll(responseData);

        // Now you can use the data as needed
        // For example, you can iterate over the array of data
        // responseData.forEach(item => {
        //   console.log(item);
        //   // Your logic with each item
        // });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  console.log('responseDataAll', responseDataAll);


  // const responseDataAll = [
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1001', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1005', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1006', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1004', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1009', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1007', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1012', workplace: 'WorkplaceA', accountingRecord: { amountDay: 3883, /* ... */ } },


  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1123', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3813,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1112', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },

  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1159', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1666', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1989', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1111', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1326', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3783,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1123', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3813,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1112', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },

  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1159', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1666', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1989', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1111', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1326', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3783,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1123', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3813,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1112', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },

  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1159', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1666', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1989', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1111', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1326', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3783,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1123', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3813,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1112', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },

  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1159', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1666', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1989', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1111', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3883,/* ... */ } },
  //   { year: '2024', month: '03', name: 'pop', createDate: '07/03/2024', employeeId: '1326', workplace: 'WorkplaceB', accountingRecord: { amountDay: 3783,/* ... */ } },

  //   // ... other data
  // ];

  const generatePDF01 = () => {

    const pdf = new jsPDF({ orientation: 'landscape' });

    const fontPath = '/assets/fonts/THSarabunNew.ttf';
    const fontName = 'THSarabunNew';

    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, fontName, 'normal');

    // Set the font for the document
    pdf.setFont(fontName);

    const pageWidth = pdf.internal.pageSize.width;


    const numRows = 7;
    const numCols = 1;
    const cellWidth = 15;
    const cellHeight = 3.5;
    const startX = 5; // Adjust the starting X-coordinate as needed
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
      pdf.setFontSize(12);

      pdf.text(text, centerX, centerY, { align: 'center', valign: 'middle' });
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


    const cellWidthName = 40;
    const startXName = 20; // Adjust the starting X-coordinate as needed
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

    const cellWidthAllDay = 10;
    const startXAllDay = 60; // Adjust the starting X-coordinate as needed
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

    const cellWidthSalary = 15;
    const startXSalary = 70; // Adjust the starting X-coordinate as needed
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

    const cellWidthOT = 15;
    const startXOT = 70 + (cellWidthOT * 1); // Adjust the starting X-coordinate as needed
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

    const cellWidthWelfare = 15;
    // const startXWelfare = 110; // Adjust the starting X-coordinate as needed
    const startXWelfare = 70 + (cellWidthOT * 2)
    const startYWelfare = 55; // Adjust the starting Y-coordinate as needed

    const drawWelfare = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXWelfare + j * cellWidthWelfare;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `สวัสดิการ\nพิเศษ`;
          drawCell(x, y, cellWidthWelfare, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthRoleWork = 15;
    // const startXRoleWork = 130; // Adjust the starting X-coordinate as needed
    const startXRoleWork = 70 + (cellWidthOT * 3)
    const startYRoleWork = 55; // Adjust the starting Y-coordinate as needed

    const drawRoleWork = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXRoleWork + j * cellWidthRoleWork;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าตำแหน่ง`;
          drawCell(x, y, cellWidthRoleWork, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDiligenceAllowance = 15;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXDiligenceAllowance = 70 + (cellWidthOT * 4)
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

    const cellWidthHoliday = 15;
    // const startXHoliday = 150; // Adjust the starting X-coordinate as needed
    const startXHoliday = 70 + (cellWidthOT * 5)
    const startYHoliday = 55; // Adjust the starting Y-coordinate as needed

    const drawHoliday = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXHoliday + j * cellWidthHoliday;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `นักขัตฤกษ์`;
          drawCell(x, y, cellWidthHoliday, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddBeforeDeductTax = 15;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 70 + (cellWidthOT * 6)
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\nก่อนหัก`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 15;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax = 70 + (cellWidthOT * 7)
    const startYMinusBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXMinusBeforeDeductTax + j * cellWidthMinusBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\nก่อนภาษี`;
          drawCell(x, y, cellWidthMinusBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };


    const cellWidthDeductTax = 15;
    // const startXDeductTax = 210; // Adjust the starting X-coordinate as needed
    const startXDeductTax = 70 + (cellWidthOT * 8)
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

    const cellWidthDeductTaxSocialSecurity = 15;
    // const startXDeductTaxSocialSecurity = 230; // Adjust the starting X-coordinate as needed
    const startXDeductTaxSocialSecurity = 70 + (cellWidthOT * 9)
    const startYDeductTaxSocialSecurity = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTaxSocialSecurity = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDeductTaxSocialSecurity + j * cellWidthDeductTaxSocialSecurity;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หัก ปกส`;
          drawCell(x, y, cellWidthDeductTaxSocialSecurity, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddAfterDeductTax = 15;
    // const startXAddAfterDeductTax = 250; // Adjust the starting X-coordinate as needed
    const startXAddAfterDeductTax = 70 + (cellWidthOT * 10)
    const startYAddAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddAfterDeductTax + j * cellWidthAddAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\nหลังภาษี`;
          drawCell(x, y, cellWidthAddAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAdvancePayment = 15;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 70 + (cellWidthOT * 11)
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

    const cellWidthMinusAfterDeductTax = 15;
    // const startXMinusAfterDeductTax = 290; // Adjust the starting X-coordinate as needed
    const startXMinusAfterDeductTax = 70 + (cellWidthOT * 12)
    const startYMinusAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinusAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXMinusAfterDeductTax + j * cellWidthMinusAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\nหลังภาษี`;
          drawCell(x, y, cellWidthMinusAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthBank = 15;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 70 + (cellWidthOT * 13)
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

    const cellWidthResult = 15;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 70 + (cellWidthOT * 14)
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
        employees: [], totalSalary: 0, totalAmountOt: 0,
        totalAmountSpecial: 0, totalAmountPosition: 0
        , totalAmountHardWorking: 0, totalAmountHoliday: 0, totalDeductBeforeTax: 0, totalAddAmountBeforeTax: 0,
        totalTax: 0, totalSocialSecurity: 0, totalAddAmountAfterTax: 0, totalAdvancePayment: 0
        , totalDeductAfterTax: 0, totalBank: 0, totalTotal: 0, totalEmp: 0
      };
      acc[workplace].employees.push(employee);
      // acc[workplace].name.push(employee.name);

      // Adjust this line based on your specific structure to get the salary or any other relevant data
      acc[workplace].totalSalary += parseFloat(employee.accountingRecord.amountDay || 0);
      acc[workplace].totalAmountOt += parseFloat(employee.accountingRecord.amountOt || 0);
      acc[workplace].totalAmountSpecial += parseFloat(employee.accountingRecord.amountSpecial || 0);
      acc[workplace].totalAmountPosition += parseFloat(employee.accountingRecord.amountPosition || 0);
      acc[workplace].totalAmountHardWorking += parseFloat(employee.accountingRecord.amountHardWorking || 0);
      acc[workplace].totalAmountHoliday += parseFloat(employee.accountingRecord.amountHoliday || 0);
      acc[workplace].totalDeductBeforeTax += parseFloat(employee.accountingRecord.deductBeforeTax || 0);
      acc[workplace].totalAddAmountBeforeTax += parseFloat(employee.accountingRecord.addAmountBeforeTax || 0);
      acc[workplace].totalTax += parseFloat(employee.accountingRecord.tax || 0);
      acc[workplace].totalSocialSecurity += parseFloat(employee.accountingRecord.socialSecurity || 0);
      acc[workplace].totalAddAmountAfterTax += parseFloat(employee.accountingRecord.addAmountAfterTax || 0);
      acc[workplace].totalAdvancePayment += parseFloat(employee.accountingRecord.advancePayment || 0);
      acc[workplace].totalDeductAfterTax += parseFloat(employee.accountingRecord.deductAfterTax || 0);
      acc[workplace].totalBank += parseFloat(employee.accountingRecord.bank || 0);
      acc[workplace].totalTotal += parseFloat(employee.accountingRecord.total ?? 0);

      acc[workplace].totalEmp += 1;

      return acc;
    }, {});

    // Loop through the grouped data and add content to the PDF
    let currentY = 20;

    // Loop through the grouped data and add content to the PDF
    // Object.keys(groupedByWorkplace).forEach((workplaceKey, index) => {
    //   const { employees, totalSalary, totalAmountOt, totalAmountSpecial, totalAmountPosition,
    //     totalAmountHardWorking, totalAmountHoliday, totalAddAmountBeforeTax, totalDeductBeforeTax, totalTax, totalSocialSecurity,
    //     totalAddAmountAfterTax, totalAdvancePayment, totalDeductAfterTax, totalBank, totalTotal, totalEmp } = groupedByWorkplace[workplaceKey];

    //   const workplaceDetails = workplaceListAll.find(w => w.workplaceId == workplaceKey) || { name: 'Unknown' };
    //   const workplaceName = workplaceDetails.name;
    //   // Display workplace heading
    //   pdf.setFontSize(12);
    //   pdf.text(`${workplaceName} : ${workplaceKey}`, 25, currentY);
    //   currentY += 5;
    Object.keys(groupedByWorkplace).forEach((workplaceKey, index) => {
      const {
        employees, totalSalary, totalAmountOt, totalAmountSpecial, totalAmountPosition,
        totalAmountHardWorking, totalAmountHoliday, totalAddAmountBeforeTax, totalDeductBeforeTax,
        totalTax, totalSocialSecurity, totalAddAmountAfterTax, totalAdvancePayment,
        totalDeductAfterTax, totalBank, totalTotal, totalEmp
      } = groupedByWorkplace[workplaceKey];

      const workplaceDetails = workplaceListAll.find(w => w.workplaceId == workplaceKey) || { name: 'Unknown' };
      console.log('workplaceDetails', workplaceDetails);
      const workplaceName = workplaceDetails.workplaceName || 'Unknown'; // Use a default value if 'name' is not available

      // Display workplace heading
      pdf.setFontSize(12);
      pdf.text(`${workplaceName} : ${workplaceKey}`, 25, currentY);
      currentY += 5;

      // Display employee information
      employees.forEach(({ employeeId, lastName, name, accountingRecord }) => {

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
        drawDeductTax();
        drawDeductTaxSocialSecurity();
        drawAddAfterDeductTax();
        drawAdvancePayment();
        drawMinusAfterDeductTax();
        drawBank();
        drawResult();

        pdf.text(`${employeeId}`, 10, currentY);
        pdf.text(`${name} ${lastName}`, 25, currentY);
        pdf.text(`${accountingRecord.countDay} `, 66, currentY, { align: 'right' });


        // เงินเดือน
        const formattedAmountDay = Number(accountingRecord.amountDay ?? 0).toFixed(2);
        // pdf.text(`${formattedAmountDay}`, pdf.internal.pageSize.width - 10, currentY, { align: 'right' });
        pdf.text(`${formattedAmountDay}`, 84, currentY, { align: 'right' });
        // ค่าล่วงเวลา
        const formattedAmountOt = Number(accountingRecord.amountOt ?? 0).toFixed(2);
        pdf.text(`${formattedAmountOt}`, 98, currentY, { align: 'right' });
        // สวัสดิการพิเศษ
        const formattedAmountSpecial = Number(accountingRecord.amountSpecial ?? 0).toFixed(2);
        pdf.text(`${formattedAmountSpecial}`, 113, currentY, { align: 'right' });
        // ค่าตำแหน่ง
        const formattedAmountPosition = Number(accountingRecord.amountPosition ?? 0).toFixed(2);
        pdf.text(`${formattedAmountPosition}`, 128, currentY, { align: 'right' });
        // เบี้ยขยัน
        const formattedAmountHardWorking = Number(accountingRecord.amountHardWorking ?? 0).toFixed(2);
        pdf.text(`${formattedAmountHardWorking}`, 143, currentY, { align: 'right' });
        // นักขัติ
        const formattedAmountHoliday = Number(accountingRecord.amountHoliday ?? 0).toFixed(2);
        pdf.text(`${formattedAmountHoliday}`, 158, currentY, { align: 'right' });
        // บวกก่อนหัก
        const formattedDeductBeforeTax = Number(accountingRecord.deductBeforeTax ?? 0).toFixed(2);
        pdf.text(`${formattedDeductBeforeTax}`, 173, currentY, { align: 'right' });
        // หักก่อนหัก
        const formattedAddAmountBeforeTax = Number(accountingRecord.addAmountBeforeTax ?? 0).toFixed(2);
        pdf.text(`${formattedAddAmountBeforeTax}`, 188, currentY, { align: 'right' });
        // หักภาษี
        const formattedTax = Number(accountingRecord.tax ?? 0).toFixed(2);
        pdf.text(`${formattedTax}`, 203, currentY, { align: 'right' });
        // หัก ปกส
        const formattedSocialSecurity = Number(accountingRecord.socialSecurity ?? 0).toFixed(2);
        pdf.text(`${formattedSocialSecurity}`, 218, currentY, { align: 'right' });
        // บวกหลังหัก
        const formattedAddAmountAfterTax = Number(accountingRecord.addAmountAfterTax ?? 0).toFixed(2);
        pdf.text(`${formattedAddAmountAfterTax}`, 233, currentY, { align: 'right' });
        // เบิกล่วงหน้า
        const formattedAdvancePayment = Number(accountingRecord.advancePayment ?? 0).toFixed(2);
        pdf.text(`${formattedAdvancePayment}`, 248, currentY, { align: 'right' });
        // หักหลังภาษี
        const formattedDeductAfterTax = Number(accountingRecord.deductAfterTax ?? 0).toFixed(2);
        pdf.text(`${formattedDeductAfterTax}`, 263, currentY, { align: 'right' });
        // ธ โอน/
        const formattedBank = Number(accountingRecord.bank ?? 0).toFixed(2);
        pdf.text(`${formattedBank}`, 278, currentY, { align: 'right' });
        // สุทธิ
        const formattedTotal = Number(accountingRecord.total ?? 0).toFixed(2);
        pdf.text(`${formattedTotal}`, 293, currentY, { align: 'right' });

        // const formattedAmountOt = accountingRecord.amountOt.toFixed(2);
        // pdf.text(`${formattedAmountOt}`, 102, currentY, { align: 'right' });


        currentY += 5;

        // Check if there's not enough space on the current page
        if (currentY > pdf.internal.pageSize.height - 20) {
          // Add a new page
          pdf.addPage({ orientation: 'landscape' });
          // Reset Y coordinate
          currentY = 20;
        }


      });

      // Display total salary
      pdf.text(`${totalEmp}`, 66, currentY, { align: 'right' });

      pdf.text(`${totalSalary.toFixed(2)}`, 84, currentY, { align: 'right' });
      pdf.text(`${totalAmountOt.toFixed(2)}`, 98, currentY, { align: 'right' });
      pdf.text(`${totalAmountSpecial.toFixed(2)}`, 113, currentY, { align: 'right' });
      pdf.text(`${totalAmountPosition.toFixed(2)}`, 128, currentY, { align: 'right' });
      pdf.text(`${totalAmountHardWorking.toFixed(2)}`, 143, currentY, { align: 'right' });
      pdf.text(`${totalAmountHoliday.toFixed(2)}`, 158, currentY, { align: 'right' });
      pdf.text(`${totalAddAmountBeforeTax.toFixed(2)}`, 173, currentY, { align: 'right' });
      pdf.text(`${totalDeductBeforeTax.toFixed(2)}`, 188, currentY, { align: 'right' });
      pdf.text(`${totalTax.toFixed(2)}`, 203, currentY, { align: 'right' });
      pdf.text(`${totalSocialSecurity.toFixed(2)}`, 218, currentY, { align: 'right' });
      pdf.text(`${totalAddAmountAfterTax.toFixed(2)}`, 233, currentY, { align: 'right' });
      pdf.text(`${totalAdvancePayment.toFixed(2)}`, 248, currentY, { align: 'right' });
      pdf.text(`${totalDeductAfterTax.toFixed(2)}`, 263, currentY, { align: 'right' });
      pdf.text(`${totalBank.toFixed(2)}`, 278, currentY, { align: 'right' });
      pdf.text(`${totalTotal.toFixed(2)}`, 293, currentY, { align: 'right' });

      currentY += 5;

      // Add some space between workplaces
      pdf.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 10, 200);
      pdf.text(`รายงานโดย ${present}`, 100, 200);
      pdf.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);

      // Add a new page for the next workplace, if any
      // if (index < Object.keys(groupedByWorkplace).length - 1) {
      //   pdf.addPage({ orientation: 'landscape' });
      //   currentY = 20;
      // }

    });

    // Save or display the PDF
    window.open(pdf.output('bloburl'), '_blank');
  };

  const handleStaffIdChange = (e) => {
    const selectWorkPlaceId = e.target.value;
    setWorkplacrId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(employee => employee.workplaceId == selectWorkPlaceId);
    console.log('selectedWorkplace', selectedWorkplace);
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setWorkplacrName(selectedWorkplace.workplaceName);
    } else {
      setWorkplacrName('');

    }
  };

  const handleStaffNameChange = (e) => {
    const selectWorkPlaceId = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = workplaceListAll.find(employee => employee.workplaceName == selectWorkPlaceId);
    const selectedEmployeeFName = workplaceListAll.find(employee => employee.workplaceName === selectWorkPlaceId);

    if (selectedEmployee) {
      setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      setWorkplacrName(selectedEmployee.workplaceName);

    } else {
      setStaffId('');
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  const generatePDF = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva'];
    const ages = [25, 30, 22, 35, 28];

    // Create a new instance of jsPDF
    const pdf = new jsPDF();

    const fontPath = '/assets/fonts/THSarabunNew.ttf';
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, 'THSarabunNew', 'normal');

    // Add bold font
    const boldFontPath = '/assets/fonts/THSarabunNew Bold.ttf';
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, 'THSarabunNew Bold', 'normal');

    // const boldFontPath = '/assets/fonts/THSarabunNew Bold.ttf';
    // pdf.addFileToVFS(boldFontPath);
    // pdf.addFont(boldFontPath, 'THSarabunNew Bold', 'normal');

    // Override the default stylestable for jspdf-autotable
    const stylestable = {
      font: 'THSarabunNew',
      fontStyle: 'normal',
      fontSize: 10,
    };
    const tableOptions = {
      styles: stylestable,
      startY: 25,
      // margin: { top: 10 },
    };

    // Set the initial position for text and frame
    let x = 20;

    // pdf.setFont('THSarabunNew');
    pdf.setFont('THSarabunNew Bold');


    // Loop through the names and ages arrays to add content to the PDF
    for (let i = 0; i < names.length; i += 2) {
      // Add a page for each pair of names
      if (i > 0) {
        pdf.addPage();
      }
      pdf.setFontSize(15);

      pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);

      // pdf.text(`ใบจ่ายเงินเดือน`, 73.05, 12);
      // pdf.text(`ใบจ่ายเงินเดือน`, 72.95, 12);
      // pdf.text(`ใบจ่ายเงินเดือน`, 73, 12.05);
      // pdf.text(`ใบจ่ายเงินเดือน`, 73, 11.95);

      pdf.text(`บริษัท โอวาท โปร แอนด์ คริก จำกัด`, 55, 18);

      pdf.setFontSize(12);

      const head = 25;
      const head2 = 150;

      pdf.text(`รหัส`, 7, head);
      pdf.text(`ชื่อ-สกุล`, 50, head);
      pdf.text(`แผนก`, 110, head);
      pdf.text(`เลขที่บัญชี`, 165, head);

      // Draw a square frame around the first name
      pdf.rect(7, 28, 155, 74);//ตารางหลัก
      pdf.rect(7, 28, 155, 12);//ตารางหลัก หัวตาราง

      pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
      pdf.rect(7, 28, 44, 63);//ตารางหลัก บน ซ้าย ช่อง1 รายได้
      pdf.text(`รายได้`, 24, 34);//ตารางหลัก รายได้
      pdf.text(`Earnings`, 22, 37);//ตารางหลัก Earnings
      //////////////////////// หัวข้อ
      pdf.text(`อัตรา`, 8, 44);//ตารางหลัก 
      pdf.text(`เงินเดือน`, 8, 48.1);//ตารางหลัก Earnings
      pdf.text(`ค่าล่วงเวลา 1 เท่า`, 8, 52.2);//ตารางหลัก 
      pdf.text(`ค่าล่วงเวลา 1.5 เท่า`, 8, 56.3);//ตารางหลัก Earnings
      pdf.text(`ค่าล่วงเวลา 2 เท่า(วันหยุด/นักขัติ)`, 8, 60.4);//ตารางหลัก 
      pdf.text(`ค่าล่วงเวลา 3 เท่า`, 8, 64.5);//ตารางหลัก Earnings
      pdf.text(`วันหยุดนักขัติฤกษ์`, 8, 68.6);//ตารางหลัก 
      pdf.text(`ค่าเดินทาง/ตำแหน่ง/โทรศัพท์`, 8, 72.7);//ตารางหลัก Earnings
      pdf.text(`เบี้ยขยัน`, 8, 76.8);//ตารางหลัก Earnings
      pdf.text(`เงินเพิ่มพิเศษ/ค่าร้อน/หุงข้าว/ค่ากะ`, 8, 80.9);//ตารางหลัก 
      pdf.text(`จ่าย่วย/พักร้อน/ลาคลอด/เลิกจ้าง/อื่นๆ`, 8, 85);//ตารางหลัก Earnings
      // pdf.text(`อัตรา`, 8, 44);//ตารางหลัก 


      pdf.rect(7, 28, 62, 63);//ตารางหลัก บน ซ้าย ช่อง1 จำนวน
      pdf.text(`จำนวน`, 56, 34);//ตารางหลัก จำนวน
      pdf.text(`Number`, 55, 37);//ตารางหลัก Number

      pdf.rect(69, 28, 24, 74);//ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
      pdf.text(`จำนวนเงิน`, 74, 34);//ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 75, 37);//ตารางหลัก Amount

      pdf.rect(69, 28, 69, 74);//ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 102, 34);//รายการหัก / รายการคืน
      // pdf.text(`Amount`, 75, 38);//ตารางหลัก 

      /////////
      pdf.text(`คืนเงินเบิกล่วงหน้า`, 94, 76.8);//ตารางหลัก Earnings
      pdf.text(`หักภาษีเงินได้`, 94, 80.9);//ตารางหลัก 
      pdf.text(`หักสมทบประกันสังคม`, 94, 85);//ตารางหลัก Earnings
      pdf.text(`ค่าทำเนียมโอน`, 94, 89.1);//ตารางหลัก Earnings

      ///////// รวมเงินได้
      pdf.text(`รวมเงินได้`, 28, 96);//ตารางหลัก Earnings
      pdf.text(`Tatol Earninng`, 23, 100);//ตารางหลัก Earnings

      /////  รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 100, 96);//ตารางหลัก Earnings
      pdf.text(`Tatol Deduction`, 105, 100);//ตารางหลัก Earnings


      pdf.text(`จำนวนเงิน`, 144, 34);//ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 145, 37);//ตารางหลัก Amount

      pdf.rect(162 + 9, 28, 25, 25);//ตารางวันที่จ่าย
      pdf.rect(162 + 9, 28, 25, 15);//ตารางวันที่จ่าย
      pdf.text(`วันที่จ่าย`, 180, 35);//ตารางหลัก วันที่จ่าย
      pdf.text(`Payroll Date`, 177, 38);//ตารางหลัก Payroll Date

      pdf.rect(162 + 9, 77, 25, 25);//ตารางเงินรับสุทธิ
      pdf.rect(162 + 9, 77, 25, 15);//ตารางเงินรับสุทธิ
      pdf.text(`เงินรับสุทธิ`, 178, 84);//ตารางหลัก วันที่จ่าย
      pdf.text(`Net To Pay`, 177, 87);//ตารางหลัก Payroll Date

      pdf.rect(7, 104, 155, 13);//ตาราง 2 
      pdf.rect(7, 104, 155, 6.5);//ตาราง 2 เส็นกลาง

      let x1 = 31
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, 104, x1, 13);//ตาราง 2 
        x1 += 31
      };

      pdf.text(`เงินได้สะสมต่อปี`, 9, 108);//ตารางหลัก Earnings
      pdf.text(`ภาษีสะสมต่อปี`, 40, 108);//ตารางหลัก Earnings
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108);//ตารางหลัก Earnings
      pdf.text(`เงินประกันสะสมต่อปี`, 102, 108);//ตารางหลัก Earnings
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108);//ตารางหลัก Earnings


      pdf.rect(7, 119, 155, 12);//ตาราง 3
      pdf.rect(7, 119, 97, 6);//ตาราง 3
      let x2 = 9.7
      for (let b = 0; b < 10; b++) {
        pdf.rect(7, 119, x2, 12);//ตาราง 2 
        x2 += 9.7
      };
      pdf.text(`ลงชื่อพนักงาน`, 125, 130);//ตารางหลัก Earnings

      // เรียงarray 
      pdf.text(`Name: ${names[i]}`, x + 10, 50);
      pdf.text(`Age: ${ages[i]}`, x + 10, 60);

      // Move to the next column
      // x += 80;

      // Draw a square frame around the second name if available
      if (i + 1 < names.length) {
        pdf.setFontSize(15);

        pdf.text(`ใบจ่ายเงินเดือน`, 73, 137);
        pdf.text(`บริษัท โอวาท โปร แอนด์ คริก จำกัด`, 55, 143);
        pdf.setFontSize(12);

        pdf.text(`รหัส`, 7, head2);
        pdf.text(`ชื่อ-สกุล`, 50, head2);
        pdf.text(`แผนก`, 110, head2);
        pdf.text(`เลขที่บัญชี`, 165, head2);

        // pdf.rect(7, 156, 60, 30);


        pdf.rect(7, head2 + 3, 155, 74);//ตารางหลัก
        pdf.rect(7, head2 + 3, 155, 12);//ตารางหลัก หัวตาราง
        pdf.rect(7, head2 + 3, 155, 63); //ตารางหลัก ล่าง
        pdf.rect(7, head2 + 3, 44, 63);//ตารางหลัก บน ซ้าย ช่อง1 รายได้
        pdf.text(`รายได้`, 24, head2 + 9);//ตารางหลัก รายได้
        pdf.text(`Earnings`, 22, head2 + 12);//ตารางหลัก Earnings

        /////////////////
        //////////////////////// หัวข้อ
        pdf.text(`อัตรา`, 8, head2 + 19);//ตารางหลัก 
        pdf.text(`เงินเดือน`, 8, head2 + 23.1);//ตารางหลัก Earnings
        pdf.text(`ค่าล่วงเวลา 1 เท่า`, 8, head2 + 27.2);//ตารางหลัก 
        pdf.text(`ค่าล่วงเวลา 1.5 เท่า`, 8, head2 + 31.3);//ตารางหลัก Earnings
        pdf.text(`ค่าล่วงเวลา 2 เท่า(วันหยุด/นักขัติ)`, 8, head2 + 35.4);//ตารางหลัก 
        pdf.text(`ค่าล่วงเวลา 3 เท่า`, 8, head2 + 39.5);//ตารางหลัก Earnings
        pdf.text(`วันหยุดนักขัติฤกษ์`, 8, head2 + 43.6);//ตารางหลัก 
        pdf.text(`ค่าเดินทาง/ตำแหน่ง/โทรศัพท์`, 8, head2 + 47.7);//ตารางหลัก Earnings
        pdf.text(`เบี้ยขยัน`, 8, head2 + 51.8);//ตารางหลัก Earnings
        pdf.text(`เงินเพิ่มพิเศษ/ค่าร้อน/หุงข้าว/ค่ากะ`, 8, head2 + 55.9);//ตารางหลัก 
        pdf.text(`จ่าย่วย/พักร้อน/ลาคลอด/เลิกจ้าง/อื่นๆ`, 8, head2 + 60);//ตารางหลัก Earnings

        pdf.rect(7, head2 + 3, 62, 63);//ตารางหลัก บน ซ้าย ช่อง1 จำนวน
        pdf.text(`จำนวน`, 56, head2 + 9);//ตารางหลัก จำนวน
        pdf.text(`Number`, 55, head2 + 12);//ตารางหลัก Number

        pdf.rect(69, head2 + 3, 24, 74);//ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
        pdf.text(`จำนวนเงิน`, 74, head2 + 9);//ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 75, head2 + 12);//ตารางหลัก Amount

        pdf.rect(69, head2 + 3, 69, 74);//ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9);//รายการหัก / รายการคืน
        // pdf.text(`Amount`, 75, 38);//ตารางหลัก 

        /////////
        pdf.text(`คืนเงินเบิกล่วงหน้า`, 94, head2 + 51.8);//ตารางหลัก Earnings
        pdf.text(`หักภาษีเงินได้`, 94, head2 + 55.9);//ตารางหลัก 
        pdf.text(`หักสมทบประกันสังคม`, 94, head2 + 60);//ตารางหลัก Earnings
        pdf.text(`ค่าทำเนียมโอน`, 94, head2 + 64.1);//ตารางหลัก Earnings

        ///////// รวมเงินได้
        pdf.text(`รวมเงินได้`, 28, head2 + 71);//ตารางหลัก Earnings
        pdf.text(`Tatol Earninng`, 23, head2 + 75);//ตารางหลัก Earnings

        /////  รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71);//ตารางหลัก Earnings
        pdf.text(`Tatol Deduction`, 105, head2 + 75);//ตารางหลัก Earnings

        pdf.text(`จำนวนเงิน`, 144, head2 + 9);//ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 145, head2 + 12);//ตารางหลัก Amount
        // pdf.rect(162 + 9, 28, 25, 25);//ตารางวันที่จ่าย

        // pdf.rect(162 + 9, 77, 25, 25);//ตารางเงินรับสุทธิ

        pdf.rect(162 + 9, head2 + 3, 25, 25);//ตารางวันที่จ่าย
        pdf.rect(162 + 9, head2 + 3, 25, 15);//ตารางวันที่จ่าย
        pdf.text(`วันที่จ่าย`, 180, head2 + 9);//ตารางหลัก วันที่จ่าย
        pdf.text(`Payroll Date`, 177, head2 + 12);//ตารางหลัก Payroll Date

        pdf.rect(162 + 9, head2 + 52, 25, 25);//ตารางเงินรับสุทธิ
        pdf.rect(162 + 9, head2 + 52, 25, 15);//ตารางเงินรับสุทธิ
        pdf.text(`เงินรับสุทธิ`, 178, head2 + 59);//ตารางหลัก เงินรับสุทธิ
        pdf.text(`Net To Pay`, 177, head2 + 62);//ตารางหลัก Net To Pay

        pdf.rect(7, head2 + 79, 155, 13);//ตาราง 2 
        pdf.rect(7, head2 + 79, 155, 6.5);//ตาราง 2 เส็นกลาง

        let x1 = 31
        for (let j = 0; j < 5; j++) {
          pdf.rect(7, head2 + 79, x1, 13);//ตาราง 2 
          x1 += 31
        };
        // 108
        // 83
        pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83);//ตารางหลัก Earnings
        pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83);//ตารางหลัก Earnings
        pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83);//ตารางหลัก Earnings
        pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83);//ตารางหลัก Earnings
        pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83);//ตารางหลัก Earnings

        pdf.rect(7, head2 + 94, 155, 12);//ตาราง 3
        pdf.rect(7, head2 + 94, 97, 6);//ตาราง 3
        let x2 = 9.7
        for (let b = 0; b < 10; b++) {
          pdf.rect(7, head2 + 94, x2, 12);//ตาราง 2 
          x2 += 9.7
        };

        pdf.text(`ลงชื่อพนักงาน`, 125, head2 + 105);//ตารางหลัก Earnings

        // เรียงarray 
        pdf.text(`Name: ${names[i + 1]}`, 7, 166);
        pdf.text(`Age: ${ages[i + 1]}`, 7, 176);
      }

      // Reset position for the next row
      x = 20;
    }

    // Open the generated PDF in a new tab
    window.open(pdf.output('bloburl'), '_blank');
  };


  const workplaceList = [
    { name: 'Thai', workplaceId: '1001-25' },
    { name: 'Total', workplaceId: '1021-25' },
    { name: 'Miliral', workplaceId: '1031-25' },
    { name: 'Raimon', workplaceId: '1801-25' },
  ];

  const employees = [
    { name: 'pop', empID: '1525', workplaceId: '1001-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '201' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },
    { name: 'popsd', empID: '1585', workplaceId: '1021-25', salary: '200' },

    { name: 'pffff', empID: '1425', workplaceId: '1021-25', salary: '200' },
    { name: 'plkioij', empID: '1625', workplaceId: '1021-25', salary: '200' },
    { name: 'bvcde', empID: '1595', workplaceId: '1021-25', salary: '200' },
    { name: 'wsxd', empID: '1425', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'dodod', empID: '15225', workplaceId: '1031-25', salary: '200' },
    { name: 'maassaa', empID: '1575', workplaceId: '1031-25', salary: '200' },
    { name: 'maakksj', empID: '15995', workplaceId: '1801-25', salary: '200' },
    { name: 'ywywy', empID: '1225', workplaceId: '1801-25', salary: '200' },
  ];

  // Grouping logic

  // const groupedByWorkplace = responseDataAll.reduce((acc, employee) => {
  //   const { accountingRecord } = employee;
  //   const workplaceId = accountingRecord.workplaceId;

  //   acc[workplaceId] = acc[workplaceId] || { employees: [], totalSalary: 0 };
  //   acc[workplaceId].employees.push(employee);
  //   // Adjust this line based on your specific structure to get the salary or any other relevant data
  //   acc[workplaceId].totalSalary += parseFloat(accountingRecord.amountDay);

  //   return acc;
  // }, {});

  // Now groupedByWorkplace contains the grouped data
  // console.log('groupedByWorkplace',groupedByWorkplace);

  // // Grouping employees by workplace
  // const groupedByWorkplace = employees.reduce((acc, employee) => {
  //     const { workplace } = employee;
  //     acc[workplace] = acc[workplace] || [];
  //     acc[workplace].push(employee);
  //     return acc;
  // }, {});

  // // Now 'groupedByWorkplace' contains the employees grouped by workplace
  // console.log('groupedByWorkplace', groupedByWorkplace);

  const generatePDFTest = () => {
    // const groupedByWorkplace = employees.reduce((acc, employee) => {
    //     const { workplace, salary } = employee;
    //     acc[workplace] = acc[workplace] || { employees: [], totalSalary: 0 };
    //     acc[workplace].employees.push(employee);
    //     acc[workplace].totalSalary += parseInt(salary);
    //     return acc;
    //   }, {});

    //   const doc = new jsPDF({ orientation: 'landscape' });

    //   Object.keys(groupedByWorkplace).forEach((workplace, index) => {
    //     const { employees, totalSalary } = groupedByWorkplace[workplace];

    //     const startY = index === 0 ? 10 : doc.previousAutoTable.finalY + 15;

    //     doc.text(`Workplace: ${workplace}`, 10, startY);

    //     // Set the cellStyles option to customize cell styles, including cellHeight
    //     doc.autoTable({
    //       head: [['Name', 'Employee ID', 'Salary']],
    //       body: employees.map(({ name, empID, salary }) => [name, empID, salary]),
    //       startY: startY + 10,
    //       cellStyles: { cellHeight: 2 }, // Set the cellHeight
    //     });

    //     const totalRow = ['Total Salary', '', totalSalary.toString()];

    //     // Set the cellStyles option to customize cell styles, including cellHeight
    //     doc.autoTable({
    //       body: [totalRow],
    //       startY: doc.previousAutoTable.finalY + 10,
    //       margin: { left: 10 },
    //       cellStyles: { cellHeight: 2 }, // Set the cellHeight
    //     });

    //     doc.text(`Total Salary: ${totalSalary}`, 10, doc.previousAutoTable.finalY + 10);
    //   });

    //   window.open(doc.output('bloburl'), '_blank');


    ///////////////////////////////////////////////////////

    const groupedByWorkplace = employees.reduce((acc, employee) => {
      const { workplaceId, salary } = employee;
      acc[workplaceId] = acc[workplaceId] || { employees: [], totalSalary: 0 };
      acc[workplaceId].employees.push(employee);
      acc[workplaceId].totalSalary += parseInt(salary);
      return acc;
    }, {});

    const doc = new jsPDF({ orientation: 'landscape' });

    let currentY = 20;

    const fontPath = '/assets/fonts/THSarabunNew.ttf';
    const fontName = 'THSarabunNew';

    doc.addFileToVFS(fontPath);
    doc.addFont(fontPath, fontName, 'normal');

    // Set the font for the document
    doc.setFont(fontName);

    const numRows = 7;
    const numCols = 1;
    const cellWidth = 15;
    const cellHeight = 3.5;
    const startX = 5; // Adjust the starting X-coordinate as needed
    const startY = 55; // Adjust the starting Y-coordinate as needed
    const borderWidth = 0.5; // Adjust the border width as needed

    // Function to draw a cell with borders
    // const drawCell = (x, y, width, height) => {
    //     doc.rect(x, y, width, height);
    // };
    const drawCell = (x, y, width, height, text) => {
      // Draw the cell border
      doc.rect(x, y, width, height);

      // Calculate the center of the cell
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // Add text to the center of the cell
      doc.setFontSize(12);

      doc.text(text, centerX, centerY, { align: 'center', valign: 'middle' });
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


    const cellWidthName = 40;
    const startXName = 20; // Adjust the starting X-coordinate as needed
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

    const cellWidthAllDay = 10;
    const startXAllDay = 60; // Adjust the starting X-coordinate as needed
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

    const cellWidthSalary = 15;
    const startXSalary = 70; // Adjust the starting X-coordinate as needed
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

    const cellWidthOT = 15;
    const startXOT = 70 + (cellWidthOT * 1); // Adjust the starting X-coordinate as needed
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

    const cellWidthWelfare = 15;
    // const startXWelfare = 110; // Adjust the starting X-coordinate as needed
    const startXWelfare = 70 + (cellWidthOT * 2)
    const startYWelfare = 55; // Adjust the starting Y-coordinate as needed

    const drawWelfare = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXWelfare + j * cellWidthWelfare;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `สวัสดิการ\nพิเศษ`;
          drawCell(x, y, cellWidthWelfare, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthRoleWork = 15;
    // const startXRoleWork = 130; // Adjust the starting X-coordinate as needed
    const startXRoleWork = 70 + (cellWidthOT * 3)
    const startYRoleWork = 55; // Adjust the starting Y-coordinate as needed

    const drawRoleWork = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXRoleWork + j * cellWidthRoleWork;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `ค่าตำแหน่ง`;
          drawCell(x, y, cellWidthRoleWork, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthDiligenceAllowance = 15;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXDiligenceAllowance = 70 + (cellWidthOT * 4)
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

    const cellWidthHoliday = 15;
    // const startXHoliday = 150; // Adjust the starting X-coordinate as needed
    const startXHoliday = 70 + (cellWidthOT * 5)
    const startYHoliday = 55; // Adjust the starting Y-coordinate as needed

    const drawHoliday = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXHoliday + j * cellWidthHoliday;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `นักขัตฤกษ์`;
          drawCell(x, y, cellWidthHoliday, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddBeforeDeductTax = 15;
    // const startXAddBeforeDeductTax = 170; // Adjust the starting X-coordinate as needed
    const startXAddBeforeDeductTax = 70 + (cellWidthOT * 6)
    const startYAddBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddBeforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddBeforeDeductTax + j * cellWidthAddBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\nก่อนหัก`;
          drawCell(x, y, cellWidthAddBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthMinusBeforeDeductTax = 15;
    // const startXMinusBeforeDeductTax = 190; // Adjust the starting X-coordinate as needed
    const startXMinusBeforeDeductTax = 70 + (cellWidthOT * 7)
    const startYMinusBeforeDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinuseforeDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXMinusBeforeDeductTax + j * cellWidthMinusBeforeDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\nก่อนภาษี`;
          drawCell(x, y, cellWidthMinusBeforeDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };


    const cellWidthDeductTax = 15;
    // const startXDeductTax = 210; // Adjust the starting X-coordinate as needed
    const startXDeductTax = 70 + (cellWidthOT * 8)
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

    const cellWidthDeductTaxSocialSecurity = 15;
    // const startXDeductTaxSocialSecurity = 230; // Adjust the starting X-coordinate as needed
    const startXDeductTaxSocialSecurity = 70 + (cellWidthOT * 9)
    const startYDeductTaxSocialSecurity = 55; // Adjust the starting Y-coordinate as needed

    const drawDeductTaxSocialSecurity = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXDeductTaxSocialSecurity + j * cellWidthDeductTaxSocialSecurity;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หัก ปกส`;
          drawCell(x, y, cellWidthDeductTaxSocialSecurity, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAddAfterDeductTax = 15;
    // const startXAddAfterDeductTax = 250; // Adjust the starting X-coordinate as needed
    const startXAddAfterDeductTax = 70 + (cellWidthOT * 10)
    const startYAddAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawAddAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXAddAfterDeductTax + j * cellWidthAddAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `บวกอื่นๆ\nหลังภาษี`;
          drawCell(x, y, cellWidthAddAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthAdvancePayment = 15;
    // const startXAdvancePayment = 270; // Adjust the starting X-coordinate as needed
    const startXAdvancePayment = 70 + (cellWidthOT * 11)
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

    const cellWidthMinusAfterDeductTax = 15;
    // const startXMinusAfterDeductTax = 290; // Adjust the starting X-coordinate as needed
    const startXMinusAfterDeductTax = 70 + (cellWidthOT * 12)
    const startYMinusAfterDeductTax = 55; // Adjust the starting Y-coordinate as needed

    const drawMinusAfterDeductTax = () => {
      for (let i = 0; i < numRowsTop; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = startXMinusAfterDeductTax + j * cellWidthMinusAfterDeductTax;
          const y = startYTop + i * cellHeightTop;

          // Add text for each cell
          const cellText = `หักอื่นๆ\nหลังภาษี`;
          drawCell(x, y, cellWidthMinusAfterDeductTax, cellHeightTop, cellText);
          const cellText2 = ``;
          // drawCell(x, 195, cellWidth, cellHeightTop, cellText2);
        }
      }
    };

    const cellWidthBank = 15;
    // const startXBank = 290; // Adjust the starting X-coordinate as needed
    const startXBank = 70 + (cellWidthOT * 13)
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

    const cellWidthResult = 15;
    // const startXResult = 310; // Adjust the starting X-coordinate as needed
    const startXResult = 70 + (cellWidthOT * 14)
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

    Object.keys(groupedByWorkplace).forEach((workplaceKey, index) => {
      const { employees, totalSalary } = groupedByWorkplace[workplaceKey];

      // Find the corresponding workplace from workplaceList
      const workplaceDetails = workplaceList.find(w => w.workplaceId === workplaceKey) || { name: 'Unknown' };
      const workplaceName = workplaceDetails.name;

      // Display workplace heading
      doc.setFontSize(12);

      doc.text(`Workplace: ${workplaceKey}`, 25, currentY);
      currentY += 5;

      // Display employee information
      employees.forEach(({ name, empID, salary }) => {

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
        drawDeductTax();
        drawDeductTaxSocialSecurity();
        drawAddAfterDeductTax();
        drawAdvancePayment();
        drawMinusAfterDeductTax();
        drawBank();
        drawResult();

        doc.text(`${empID}`, 10, currentY);
        doc.text(` ${name}`, 25, currentY);
        doc.text(`${salary}`, 70, currentY);

        currentY += 5;

        // Check if there's not enough space on the current page
        if (currentY > doc.internal.pageSize.height - 20) {
          // Add a new page
          doc.addPage({ orientation: 'landscape' });
          // Reset Y coordinate
          currentY = 20;
        }
      });

      // Display total salary
      doc.text(`Total Salary: ${totalSalary}   ${workplaceName}`, 10, currentY);
      currentY += 5;

      // Add some space between workplaces
      // currentY += 5;
      doc.text(`พิมพ์วันที่ ${formattedWorkDateDD}/${formattedWorkDateMM}/${parseInt(formattedWorkDateYYYY, 10) + 543}`, 10, 200);
      doc.text(`รายงานโดย ${present}`, 100, 200);
      doc.text(`แฟ้มรายงาน ${presentfilm}`, 200, 200);

    });

    window.open(doc.output('bloburl'), '_blank');
  };



  return (
    <div>
      <div class="form-group">
        <div class="col-md-2">
          <div class="form-group">
            <label role="agencyname">เดือน</label>
            <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
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
            <label >ปี</label>
            <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={fetchData}>Fetch Data</button>
        <br />
        <label role="searchEmployeeId">รหัสหน่อยงาน</label>
        {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchWorkplaceId(e.target.value)} /> */}
        <input
          type="text"
          className="form-control"
          id="staffId"
          placeholder="รหัสหน่อยงาน"
          value={workplacrId}
          onChange={handleStaffIdChange}
          list="WorkplaceIdList"
        />
        <datalist id="WorkplaceIdList">
          {workplaceListAll.map(workplace => (
            <option key={workplace.workplaceId} value={workplace.workplaceId} />
          ))}
        </datalist>
      </div>

      <div class="form-group">
        <label role="searchname">ชื่อหน่วยงาน</label>
        {/* <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} /> */}
        <input
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
        </datalist>

      </div>
      <button onClick={generatePDF}>Generate PDF</button>
      <br />
      <br />
      <label role="datetime">พิมพ์วันที่</label>
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
      </div>
      <div class="row">
        <div class="col-md-3">
          <input type="text" class="form-control" id="searchWorkplaceId" placeholder="รายงานโดย" value={present} onChange={(e) => setPresent(e.target.value)} />

        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <input type="text" class="form-control" id="searchWorkplaceId" placeholder="แฟ้มรายงาน" value={presentfilm} onChange={(e) => setPresentfilm(e.target.value)} />

        </div>
      </div>

      <button onClick={generatePDFTest}>Generate PDFTest</button>
      <br />
      <button onClick={generatePDF01}>Generate PDFTest01</button>


    </div>
  )
}

export default TestPDFSalary