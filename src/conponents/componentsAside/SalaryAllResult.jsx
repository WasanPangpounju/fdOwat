import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react'; import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import 'moment/locale/th'; // Import the Thai locale data
function SalaryAllResult() {
    const [workplacrId, setWorkplacrId] = useState(''); //รหัสหน่วยงาน
    const [workplacrName, setWorkplacrName] = useState(''); //รหัสหน่วยงาน

    const [searchWorkplaceId, setSearchWorkplaceId] = useState('');
    const [workplaceListAll, setWorkplaceListAll] = useState([]);

    const [responseDataAll, setResponseDataAll] = useState([]);

    const [month, setMonth] = useState('01');
    // const [year, setYear] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString()); // Set the year initially to the current year

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

    useEffect(() => {
        const fetchData = () => {
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

        // Call fetchData when year or month changes
        fetchData();
    }, [year, month]);

    console.log('responseDataAll', responseDataAll);

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
        Object.keys(groupedByWorkplace)
            .sort((a, b) => a.localeCompare(b)) // Sort keys in ascending order
            .forEach((workplaceKey, index) => {
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

                    pdf.text(`${employeeId}`, 5, currentY);
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

                pdf.text(`รวมแผนก`, 5, currentY);

                pdf.text(`${workplaceName} : ${workplaceKey}`, 25, currentY);

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
    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">

                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> สรุปเงินเดือน</a></li>
                        <li class="breadcrumb-item active">สรุปหน่วยงานทั้งหมด</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> สรุปหน่วยงานทั้งหมด</h1>
                            </div>
                        </div>
                    </div>
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">สรุปหน่วยงานทั้งหมด</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <div class="row">
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
                                    </div>
                                    {/* <button class="btn btn-secondary" onClick={fetchData}>Fetch Data</button> */}
                                    <br />
                                    <br />

                                    <button class="btn btn-success" onClick={generatePDF01}>Generate PDF</button>

                                </div>
                            </section>

                        </div>
                    </section>
                </div>
            </div>
        </body>
        // </div> 
    )
}

export default SalaryAllResult