import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import EmployeesSelected from './EmployeesSelected';

import jsPDF from 'jspdf';

const dataArrayName = [
    { name: 'ที่ไหน', code: '233158', },
    { name: 'ที่ไหนpgghh', code: '243978', }
];
const dataArray = [
    [
        // 1
        { name: 'John', prime: 'Yes', no: '10000.00' },
        { name: 'Jane', prime: 'No', no: '20' },
        { name: 'John', prime: 'Yes', no: '30' },
        { name: 'Jane', prime: 'No', no: '50' },
        { name: 'John', prime: 'Yes', no: '90' },
        { name: 'Jane', prime: 'No', no: '10' },
        { name: 'John', prime: 'Yes', no: '40' },
        { name: 'Jane', prime: 'No', no: '10' },
        { name: 'John', prime: 'Yes', no: '60' },
        { name: 'Jane', prime: 'No', no: '80' },
        // 2
        { name: 'John', prime: 'Yes', no: '20' },
        { name: 'Jane', prime: 'No', no: '60' },
        { name: 'John', prime: 'Yes', no: '80' },
        { name: 'Jane', prime: 'No', no: '60' },
        { name: 'John', prime: 'Yes', no: '10' },
        { name: 'Jane', prime: 'No', no: '20' },
        { name: 'John', prime: 'Yes', no: '40' },
        { name: 'Jane', prime: 'No', no: '60' },
        { name: 'John', prime: 'Yes', no: '70' },
        { name: 'Jane', prime: 'No', no: '30' },

    ],
    // create footer
    // sum 'no'
    // ... other arrays
    [
        { name: 'Jane', prime: 'No', no: '90' },
        { name: 'John', prime: 'Yes', no: '120' },
        { name: 'Jane', prime: 'No', no: '100' },
        { name: 'John', prime: 'Yes', no: '104' },
        { name: 'Jane', prime: 'No', no: '110' },
        { name: 'John', prime: 'Yes', no: '150' },
        { name: 'qwqwqw', prime: '1232132132', no: '190' },
    ],
    // create footer
    // sum 'no'
];

const subarrayLengths = dataArray.map(subarray => subarray.length);

console.log('subarrayLengths', subarrayLengths);

function Test() {
    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('');

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    // const handleDateChange = (date) => {
    //     setSelectedDates((prevDates) => [...prevDates, date]);
    // };

    const testData = [
        {
            _id: '64d46a67f811c14a70d4b3d7',
            workplaceId: '9999',
            workplaceName: 'ทดสอบการทำงาน101',
            workplaceArea: 'นครปฐม',
            workOfWeek: '5',

        },
        {
            _id: '64d46a67f811c14a70d4b3d7',
            workplaceId: '9999',
            workplaceName: 'ทดสอบการทำงาน101',
            workplaceArea: 'นครปฐม',
            workOfWeek: '5',
            workDay1:
            {
                position: 'head',
                time: '210.00',
                timeEnd: '211.00',
                time2: '213.00',
                timeEnd2: '214.00',
                time3: '219.00',
                timeEnd3: '220.00',
            },
            workDay2:
            {
                position: 'head',
                time: '210.01',
                timeEnd: '211.01',
                time2: '213.01',
                timeEnd2: '214.01',
                time3: '219.01',
                timeEnd3: '220.01',
            },
            workDay3:
            {
                position: 'head',
                time: '210.02',
                timeEnd: '211.02',
                time2: '213.02',
                timeEnd2: '214.02',
                time3: '219.02',
                timeEnd3: '220.02',
            },
            workDay4:
            {
                position: 'head',
                time: '210.03',
                timeEnd: '211.03',
                time2: '213.03',
                timeEnd2: '214.03',
                time3: '219.03',
                timeEnd3: '220.03',
            },
            workDay5:
            {
                position: 'head',
                time: '210.04',
                timeEnd: '211.04',
                time2: '213.04',
                timeEnd2: '214.04',
                time3: '219.04',
                timeEnd3: '220.04',
            },
            workDay6:
            {
                position: 'head',
                time: '210.05',
                timeEnd: '211.05',
                time2: '213.05',
                timeEnd2: '214.05',
                time3: '219.05',
                timeEnd3: '220.05',
            },
            workDay7:
            {
                position: 'head',
                time: '210.06',
                timeEnd: '211.06',
                time2: '213.06',
                timeEnd2: '214.06',
                time3: '219.06',
                timeEnd3: '220.06',
            },
        },
        {
            _id: '64d46a67f811c14a70d4b3d7',
            workplaceId: '9999',
            workplaceName: 'ทดสอบการทำงาน101',
            workplaceArea: 'นครปฐม',
            workOfWeek: '5'
        }
    ];

    const handleDateChange = (date) => {
        // Check if the selected date already exists in the array
        if (!selectedDates.includes(date)) {
            setSelectedDates((prevDates) => [...prevDates, date]);
        } else {
            // Alert that the date already exists
            alert('This date is already selected. Please choose a different date.');
        }
    };



    const handleAddDate = () => {
        if (day && month && year) {
            const selectedDate = new Date(`${month}/${day}/${year}`);
            // Check if the selected date is a valid date
            if (!isNaN(selectedDate.getTime())) {
                // Check if the selected date already exists in the array
                if (!selectedDates.find((date) => date.getTime() === selectedDate.getTime())) {
                    setSelectedDates((prevDates) => [...prevDates, selectedDate]);
                } else {
                    // Show alert for duplicate date selection
                    alert('Selected date already exists in the list.');
                }
                setDay('');
                setMonth('');
                setYear('');
            } else {
                // Show alert for invalid date selection
                alert('Invalid date selection. Please select a valid day, month, and year.');
            }
        } else {
            // Show alert for invalid date selection
            alert('Invalid date selection. Please select a day, month, and year.');
        }
    };

    const handleRemoveDate = (dateToRemove) => {
        setSelectedDates((prevDates) =>
            prevDates.filter((date) => date.getTime() !== dateToRemove.getTime())
        );
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    ////////////////////////////////////////////////////////


    const [workTimeDay, setWorkTimeDay] = useState({
        startDay: '',
        endDay: '',
        allTimes: [],
    });

    const daysOfWeek = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorkTimeDay((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddTime = () => {
        setWorkTimeDay((prevData) => ({
            ...prevData,
            allTimes: [...prevData.allTimes, { startTime: '', endTime: '', resultTime: '', startTimeOT: '', endTimeOT: '', resultTimeOT: '' }],
        }));
    };

    const handleTimeChange = (index, timeType, value) => {
        setWorkTimeDay((prevData) => {
            const updatedTimes = prevData.allTimes.map((time, i) =>
                i === index ? { ...time, [timeType]: value } : time
            );

            // Calculate resultTime and resultOT when both startTime and endTime are provided
            if (timeType === 'startTime' || timeType === 'endTime' || timeType === 'startTimeOT' || timeType === 'endTimeOT') {
                const startTime = updatedTimes[index].startTime;
                const endTime = updatedTimes[index].endTime;
                const startTimeOT = updatedTimes[index].startTimeOT;
                const endTimeOT = updatedTimes[index].endTimeOT;

                if (startTime && endTime) {
                    const resultTime = calculateTimeDifference(startTime, endTime);
                    updatedTimes[index].resultTime = resultTime;
                }

                if (startTimeOT && endTimeOT) {
                    const resultOT = calculateTimeDifference(startTimeOT, endTimeOT);
                    updatedTimes[index].resultOT = resultOT;
                }
            }

            return {
                ...prevData,
                allTimes: updatedTimes,
            };
        });
    };

    const calculateTimeDifference = (startTime, endTime) => {
        const [startHour, startMinute] = startTime.split('.').map(Number);
        const [endHour, endMinute] = endTime.split('.').map(Number);

        let resultHour = endHour - startHour;
        let resultMinute = endMinute - startMinute;

        if (resultMinute < 0) {
            resultHour -= 1;
            resultMinute += 60;
        }

        return `${resultHour.toString().padStart(2, '0')}.${resultMinute.toString().padStart(2, '0')}`;
    };


    const arraysPerPage = 10;

    const generatePDF = () => {
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        // Load the Thai font
        const fontPath = '/assets/fonts/THSarabunNew.ttf';
        const fontName = 'THSarabunNew';

        pdf.addFileToVFS(fontPath);
        pdf.addFont(fontPath, fontName, 'normal');

        // Set the font for the document
        pdf.setFont(fontName);

        const numRows = 7;
        const numCols = 1;
        const cellWidth = 15;
        const cellHeight = 3.5;
        const startX = 5; // Adjust the starting X-coordinate as needed
        const startY = 55; // Adjust the starting Y-coordinate as needed
        const borderWidth = 0.5; // Adjust the border width as needed

        // Function to draw a cell with borders
        // const drawCell = (x, y, width, height) => {
        //     pdf.rect(x, y, width, height);
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
        const startYTop = 35; // Adjust the starting Y-coordinate as needed
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);

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
                    drawCell(x, 195, cellWidthName, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidthAllDay, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
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
                    drawCell(x, 195, cellWidth, cellHeightTop,cellText2);
                }
            }
        };


        //     const subarrayLengths = dataArray.map(subarray => subarray.length);

        //     dataArray.forEach((innerArray, index) => {
        //         const pageCount = Math.ceil(subarrayLengths[index] / arraysPerPage);
        //         let sumNo = 0;

        //         for (let page = 0; page < pageCount; page++) {
        //             let yOffset = 20;

        //             const startIdx = page * arraysPerPage;
        //             const endIdx = Math.min((page + 1) * arraysPerPage, subarrayLengths[index]);

        //             // pdf.text(`รายชื่อทั้งหมด`, 10, 10);
        //             if (page === pageCount) {
        //                 pdf.text(`Page ${page + 1}/${pageCount} - Sum 'no': ${sumNo}`, 20, 10);
        //             }

        //             for (let i = startIdx; i < endIdx; i++) {
        //                 const currentArray = innerArray[i];

        //                 if (currentArray) {
        //                     pdf.text(`Name: ${currentArray.name}, Prime: ${currentArray.prime}, No: ${currentArray.no}`, 20, yOffset);
        //                     yOffset += 10;
        //                     sumNo += parseInt(currentArray.no, 10);
        //                 }
        //             }

        //             if (page === pageCount - 1) {
        //                 pdf.text(`Page ${page + 1}/${pageCount} - Sum 'no': ${sumNo}`, 200, 200);
        //             }

        //             if (page < pageCount) {
        //                 pdf.addPage();
        //             }
        //         }
        //     });

        //     // Save or display the PDF
        //     const pdfContent = pdf.output('bloburl');
        //     window.open(pdfContent, '_blank');
        // };
        const subarrayLengths = dataArray.map(subarray => subarray.length);

        dataArray.forEach((innerArray, index) => {
            // Display dataArrayName on the first page
            // pdf.addPage();
            pdf.text(`รายชื่อทั้งหมด: ${dataArrayName[index].name}`, 10, 10);
            pdf.text(`ตั้งแต่วันที่30/08/2567 ถึง 20/09/2667`, 10, 20);
            pdf.text(`แผนก: ${dataArrayName[index].code}`, 10, 30);

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

            const pageCount = Math.ceil(subarrayLengths[index] / arraysPerPage);
            let sumNo = 0;

            for (let page = 0; page < pageCount; page++) {
                let yOffset = 50;

                const startIdx = page * arraysPerPage;
                const endIdx = Math.min((page + 1) * arraysPerPage, subarrayLengths[index]);

                for (let i = startIdx; i < endIdx; i++) {
                    const currentArray = innerArray[i];

                    if (currentArray) {
                        pdf.text(`Name: ${currentArray.name}, Prime: ${currentArray.prime}, No: ${currentArray.no}`, 35, yOffset);
                        yOffset += 10;
                        sumNo += parseInt(currentArray.no, 10);
                    }
                }

                // pdf.text(`Page ${page + 1}/${pageCount} - Sum 'no': ${sumNo}`, 200, 200);
                if (page === pageCount - 1) {
                    pdf.text(`Page ${page + 1}/${pageCount} - Sum 'no': ${sumNo}`, 200, 200);
                }
                if (page < pageCount) {
                    pdf.addPage();
                }
            }

        });

        // Save or display the PDF
        const pdfContent = pdf.output('bloburl');
        window.open(pdfContent, '_blank');
    };



    return (
        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="container-fluid">
                        <form >
                            <section class="Frame">
                                <div class="row">
                                    <div>
                                        <label>เดือน:</label>
                                        <select value={month} onChange={(e) => setMonth(e.target.value)}>
                                            <option value="">Select month</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                        <label>วันที่:</label>
                                        <select value={day} onChange={(e) => setDay(e.target.value)}>
                                            <option value="">Select day</option>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                        <label>ปี:</label>
                                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                                            <option value="">Select year</option>
                                            {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i).map(
                                                (year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <button type="button" onClick={handleAddDate}>
                                            เพิ่ม
                                        </button>
                                    </div>
                                    {selectedDates.length > 0 && (
                                        <div>
                                            <h3>วันหยุดหน่วยงาน</h3>
                                            <ol>
                                                {selectedDates.map((date, index) => (
                                                    <li key={index}>
                                                        {date instanceof Date && !isNaN(date.getTime())
                                                            ? date.toLocaleDateString()
                                                            : `${day}/${month}/${year} (Invalid Date)`}{' '}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveDate(date)}
                                                            className="btn clean"
                                                            style={{ margin: '0.5rem' }}
                                                        >
                                                            ลบออก
                                                        </button>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}
                                </div>
                            </section>

                        </form>

                    </div>
                </div>
            </div>

            {/* /////////////////////////////// */}

            <div class="row">
                <div class="col-md-1">
                    <select name="startDay" value={workTimeDay.startDay} onChange={handleInputChange}>
                        {daysOfWeek.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <div class="col-md-1">
                    <select name="endDay" value={workTimeDay.endDay} onChange={handleInputChange}>
                        {daysOfWeek.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <div class="col-md-6">
                    {workTimeDay.allTimes.map((time, index) => (
                        <div key={index}>
                            <div class="row">
                                <div class="col-md-2">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder={`Start Time ${index + 1}`}
                                        value={time.startTime}
                                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                                    />
                                </div>
                                <div class="col-md-2">
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder={`End Time ${index + 1}`}
                                        value={time.endTime}
                                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                                    />
                                </div>
                                <span>Result Time: {time.resultTime}</span>
                                <div class="col-md-2">

                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder={`Start Time OT ${index + 1}`}
                                        value={time.startTimeOT}
                                        onChange={(e) => handleTimeChange(index, 'startTimeOT', e.target.value)}
                                    />
                                </div>
                                <div class="col-md-2">

                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder={`End Time OT ${index + 1}`}
                                        value={time.endTimeOT}
                                        onChange={(e) => handleTimeChange(index, 'endTimeOT', e.target.value)}
                                    />
                                </div>
                                <span>Result OT: {time.resultOT}</span>
                            </div>
                        </div>
                    ))}

                </div>
                <div class="col-md-1">
                    <button onClick={handleAddTime}>
                        <i class="fa">&#xf067;</i>
                    </button>
                </div>
            </div>
            <button onClick={() => console.log(workTimeDay)}>Submit</button>
            {/* <button onClick={() => console.log(workTimeDay)}>Submit</button> */}
            {/* ////////////////////////////// */}

            <div>
                <button onClick={generatePDF}>Generate PDF</button>
            </div>
        </section>


    )
}

export default Test
