import endpoint from '../../config';
// import React, { useRef } from 'react';

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import '../editwindowcss.css';
// import TestPDF from './TestPDF';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import { useTable } from 'react-table';

import th from 'date-fns/locale/th'; // Import Thai locale data from date-fns
import en from 'date-fns/locale/en-US';


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TestPDFResultSalay() {
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
        document.title = 'ใบลงเวลาการปฏิบัติงาน';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);

    const styles = {
        th: {
            minWidth: "4rem"
        }
    };
    const [dataset, setDataset] = useState([]);
    const [workplaceIdEMP, setWorkplaceIdEMP] = useState(''); //รหัสหน่วยงาน

    const [workplaceList, setWorkplaceList] = useState([]);
    const [workplaceDataList, setWorkplaceDataList] = useState([]);
    const [workplaceDataListDayOff, setWorkplaceDataListDayOff] = useState([]);
    const [workplaceDataListAddSalary, setWorkplaceDataListAddSalary] = useState([]);
    const [workplaceDataWorkTime, setWorkplaceDataWorkTime] = useState([]);
    const [workplaceDataWorkOfHour, setWorkplaceDataWorkOfHour] = useState('');
    const [workplaceDataListWorkRate, setWorkplaceDataListWorkRate] = useState();
    const [workplaceListAll, setWorkplaceListAll] = useState([]);

    const [workRateWorkplace, setWorkRateWorkplace] = useState(0); //ค่าจ้างต่อวัน
    const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
    const [holiday, setHoliday] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ 
    const [holidayHour, setHolidayHour] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง

    const [workRateWorkplaceStage1, setWorkRateWorkplaceStage1] = useState(0); //ค่าจ้างต่อวัน
    const [workRateWorkplaceStage2, setWorkRateWorkplaceStage2] = useState(0); //ค่าจ้างต่อวัน
    const [workRateWorkplaceStage3, setWorkRateWorkplaceStage3] = useState(0); //ค่าจ้างต่อวัน

    const [responseDataAll, setResponseDataAll] = useState([]);

    const [WName, setWName] = useState('');

    const [workDate, setWorkDate] = useState(new Date());

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
        return new Date(thaiYear, gregorianDate.getMonth(), gregorianDate.getDate());
    };

    const ThaiBuddhistToGregorian = (thaiDate) => {
        const gregorianYear = thaiDate.getFullYear() - 543;
        return new Date(gregorianYear, thaiDate.getMonth(), thaiDate.getDate());
    };

    const initialThaiDate = new Date();
    initialThaiDate.setFullYear(initialThaiDate.getFullYear() + 543); // Add 543 years to the current year

    const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
    const [selectedGregorianDate, setSelectedGregorianDate] = useState(new Date());

    const handleThaiDateChange = (date) => {
        setSelectedThaiDate(date);
        setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
        setWorkDate(date)
    };

    const handleGregorianDateChange = (date) => {
        setSelectedGregorianDate(date);
        setSelectedThaiDate(GregorianToThaiBuddhist(date));
    };

    const [daysOffArray, setDaysOffArray] = useState([]);
    const [result_data, setResult_data] = useState([]);
    const [conclude, setConclude] = useState([]);
    const [emploeeData, setEmploeeData] = useState([]);
    const [emploeeDataSearch, setEmploeeDataSearch] = useState([]);

    const [arraytestEmpAddSalary, setArraytestEmpAddSalary] = useState([]);

    const [empIDlist, setEmpIDlist] = useState([]);

    const getThaiMonthName = (month) => {
        const thaiMonths = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        // Ensure the month is a valid number between 1 and 12
        const monthNumber = parseInt(month, 10);
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return "Invalid Month";
        }

        return thaiMonths[monthNumber - 1];
    };
    const thaiToEnglishDayMap = {
        'จันทร์': ['Mon'],
        'อังคาร': ['Tue'],
        'พุธ': ['Wed'],
        'พฤหัส': ['Thu'],
        'ศุกร์': ['Fri'],
        'เสาร์': ['Sat'],
        'อาทิตย์': ['Sun'],
    };



    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/workplace/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setWorkplaceList(data);
                // alert(data[0].workplaceName);
                setWorkRateWorkplace(data[0].workRate);
                setWorkRateWorkplaceStage1(data[0].workRateOT);
                setWorkRateWorkplaceStage2(data[0].holiday);
                setWorkRateWorkplaceStage3(data[0].holidayOT);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // The empty array [] ensures that the effect runs only once after the initial render
    console.log('workplacelist123321', workplaceList);
    console.log('workRate123321', workRateWorkplace);

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
        // conclude / list
        // fetch(endpoint + '/timerecord/listemp')
        fetch(endpoint + '/conclude/list')

            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                if (Array.isArray(data) && data.length > 0) {
                    setConclude(data);
                } else {
                    // If data is empty or not found, set state to an empty array
                    setConclude([]);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


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

    console.log(workplaceList);

    const [employeelist, setEmployeelist] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [listDayOff, setListDayOff] = useState([]);
    const [y, setY] = useState('');
    const [m, setM] = useState('');
    const [m1, setM1] = useState('');


    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/employee/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setEmployeelist(data);
                // alert(data[0].workplaceName);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // The empty array [] ensures that the effect runs only once after the initial render

    useEffect(() => {
        const fetchData = () => {
            const dataTest = {
                timerecordId: '2024', // Specify the timerecordId here
                month: '03', // Specify the month here
            };
            axios.post(endpoint + '/timerecord/listemp', dataTest)
                .then(response => {
                    // Handle the response data here
                    console.log('test123', response.data);
                })
                .catch(error => {
                    // Handle errors here
                    console.error('Error fetching data:', error);
                });
        };

        fetchData(); // Call the fetchData function when component mounts or whenever needed
    }, []);

    console.log('employeelist', employeelist);


    //data for show in table
    const [listTableDayoff, setListTableDayoff] = useState([]);
    //data for check list dayoff
    const [data_listDayoff, setData_listDayoff] = useState([]);

    console.log('data_listDayoff', data_listDayoff);
    console.log('listTableDayoff', listTableDayoff);
    console.log('df', listDayOff);


    // Generate an array containing numbers from 21 to 31
    const range1 = Array.from({ length: 11 }, (_, i) => i + 21);

    // Generate an array containing numbers from 1 to 20
    const range2 = Array.from({ length: 20 }, (_, i) => i + 1);

    // Combine the two ranges into a single array
    const combinedRange = [...range1, ...range2];


    const [countWork, setCountWork] = useState(0);
    const [countWorkSTime, setCountWorkSTime] = useState(0);


    const [employeeId, setEmployeeId] = useState('');
    const [name, setName] = useState('');
    const [workplaceIdList, setWorkplaceIdList] = useState([]);

    const [month, setMonth] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1998 }, (_, index) => currentYear - index);

    const [year, setYear] = useState('');

    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [codePage, setCodePage] = useState('FM-HR-005-03'); //ชื่อหน่วยงาน

    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [empId, setEmpId] = useState([]);

    const [searchResult1, setSearchResult1] = useState([]);

    const [woekplace, setWoekplace] = useState([]);

    const [calendarData1, setCalendarData1] = useState([]);
    const [calendarData2, setCalendarData2] = useState([]);
    // const yeartest = 2023;
    const monthtest = 3; // 3 represents March using 1-based indexing


    // useEffect(() => {
    //     const fetchData = () => {
    //         const dataTest = {
    //             year: year,
    //             month: month,
    //         };

    //         // axios.get(endpoint + '/accounting/list', dataTest)
    //         axios.get(endpoint + '/accounting/calsalarylist', dataTest)

    //             .then(response => {
    //                 const responseData = response.data;

    //                 console.log('searchWorkplaceId', searchWorkplaceId);

    //                 console.log('responseData', responseData);
    //                 const filteredData = searchWorkplaceId ? responseData.filter(item => item.workplace === searchWorkplaceId) : responseData;

    //                 // Sort the filtered data by employeeId in ascending order
    //                 const sortedData = filteredData.sort((a, b) => a.employeeId - b.employeeId);

    //                 setResponseDataAll(sortedData);

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

            axios.post(endpoint + '/accounting/calsalarylist', dataTest)
                .then(response => {
                    const responseData = response.data;

                    console.log('searchWorkplaceId', searchWorkplaceId);

                    console.log('responseData', responseData);
                    const filteredData = searchWorkplaceId ? responseData.filter(item => item.workplace === searchWorkplaceId) : responseData;
                    const sortedData = filteredData.sort((a, b) => a.employeeId - b.employeeId);

                    setResponseDataAll(sortedData);

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };

        // Call fetchData when year or month changes
        fetchData();
    }, [year, month, searchWorkplaceId]);


    console.log('responseDataAll', responseDataAll);

    async function handleSearch(event) {
        event.preventDefault();
        // get value from form search
        if (searchWorkplaceId === '' && searchWorkplaceName === '') {
            // Both employeeId and employeeName are null
            alert("กรุณากรอกรหัสหรือชื่อพนักงาน");
            // You can use window.location.reload() to reload the web page
            // window.location.reload();
        } else {
            // At least one of them is not null
            console.log('searchWorkplaceId', searchWorkplaceId);
        }
        const data = await {
            // workplaceId: searchWorkplaceId,
            // workplaceName: searchWorkplaceName,
            month: month,
            'employee_workplaceRecord.workplaceId': searchWorkplaceId,
            // 'employee_workplaceRecord.workplaceName': searchWorkplaceName,

        }; console.log('searchWorkplaceId', searchWorkplaceId);

        const parsedNumber = await parseInt(month, 10) - 1;
        const formattedResult = await String(parsedNumber).padStart(2, '0');
        // await alert(formattedResult );

        const data1 = await {
            workplaceId: searchWorkplaceId,
            workplaceName: searchWorkplaceName,
            month: formattedResult
        };

        console.log('datadata', data);


        // date day

        // Calculate the formatted month based on data1.month
        const parsedNumber1 = parseInt(data1.month, 10) - 1;
        const formattedResult1 = String(parsedNumber1).padStart(2, '0');

        // Calculate the formatted month based on data.month
        const parsedNumber2 = parseInt(data.month, 10) - 1;
        const formattedResult2 = String(parsedNumber2).padStart(2, '0');


        // Create a Date object for the first day of data1.month
        const firstDayOfMonth1 = new Date(yeartest, parsedNumber1, 1);

        // Create a Date object for the first day of data.month
        const firstDayOfMonth2 = new Date(yeartest, parsedNumber2, 1);

        console.log('formattedResult1', firstDayOfMonth1);
        console.log('formattedResult2', firstDayOfMonth2);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
            console.log('dates1', dates1);
            console.log('dates2', dates2);

        }

        const filteredDates1 = dates1.map((dayData) => ({
            ...dayData,
            dates: dayData.dates.filter((date) => date >= 21 && date <= 31), // Adjusted filtering condition
        })).filter((dayData) => dayData.dates.length > 0);


        const filteredDates2 = dates2.map((dayData) => ({
            ...dayData,
            dates: dayData.dates.filter((date) => date < 20), // Adjusted filtering condition
        })).filter((dayData) => dayData.dates.length > 0);

        //dddd
        console.log('calendarData1 filteredDates1:', filteredDates1);
        console.log('calendarData2 filteredDates2:', filteredDates2);
        setCalendarData1(filteredDates1); // Assuming you have a separate state for data1.month
        setCalendarData2(filteredDates2);

        //check reload pag

        console.log(searchWorkplaceId);
        let check = 0;
        try {

            const response = await axios.post(endpoint + '/timerecord/searchemp', data);
            console.log('response123', response.data.recordworkplace);

            if (response.data.recordworkplace.length >= 1) {
                await setSearchResult(response.data.recordworkplace);
                await setResult_data(response.data.recordworkplace);
            } else {
                alert("ไม่พบข้อมูล 1 ถึง 20 " + getMonthName(data.month));
                check = check + 1;
                // window.location.reload();
            }

            const employeeWorkplaceRecords = await response.data.recordworkplace[0].employee_workplaceRecord || '';

            if (employeeWorkplaceRecords.length > 0) {
                const dates = employeeWorkplaceRecords.map(record => record.date);
                // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

                const allTimeA = employeeWorkplaceRecords.map((record) => record.allTime);

                const workplaceId = employeeWorkplaceRecords.map(record => record.workplaceId);

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

                                updatedData[(dataIndex + 11)].isChecked = true;
                                updatedData[(dataIndex + 11)].otTime = otTime[index];
                                updatedData[(dataIndex + 11)].allTime = allTimeA[index];
                                updatedData[(dataIndex + 11)].workplaceId = workplaceId[index]; // Set otTime at the same index as dates
                                updatedData[(dataIndex + 11)].date = dates[index]; // Set otTime at the same index as dates


                                // Set otTime at the same index as dates
                            }

                        }
                    });
                    const filteredData = updatedData.filter((record) => record.isChecked == true);

                    const workplaceIds = [...new Set(filteredData.map((record) => record.workplaceId))];


                    setDataset(filteredData);
                    return updatedData;
                });


                console.log('tableData', tableData);
                console.log('updatedData', dataset);

            }
            if (response.data.recordworkplace.length < 1) {
                // window.location.reload();
                alert('ไม่พบข้อมูล');
                // window.location.reload();
            } else {

                // Set search values
                await setEmployeeId(response.data.recordworkplace[0].employeeId);
                await setName(response.data.recordworkplace[0].employeeName);

                setSearchWorkplaceId('');
                setSearchWorkplaceName('');

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            // window.location.reload();
        }

        try {

            if (data1.month == '00') {
                data1.month = '12';
            }
            const response1 = await axios.post(endpoint + '/timerecord/searchemp', data1);
            if (response1.data.recordworkplace.length >= 1) {
                await setSearchResult1(response1.data.recordworkplace);
                // if (!result_data) {
                await setResult_data(response1.data.recordworkplace);
                // }

            } else {
                alert("ไม่พบข้อมูล 21 ถึง สิ้นเดือน " + getMonthName(data1.month));
                check = check + 1;
                if (check > 1) {
                    // alert('reload');
                    // window.location.reload();
                }

            }

            const employeeWorkplaceRecords1 = await response1.data.recordworkplace[0].employee_workplaceRecord || '';

            if (employeeWorkplaceRecords1.length > 0) {

                const dates1 = await employeeWorkplaceRecords1.map(record => record.date);
                // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

                const allTimeA1 = await employeeWorkplaceRecords1.map((record) => record.allTime);

                const workplaceId1 = await employeeWorkplaceRecords1.map(record => record.workplaceId);

                const otTime1 = await employeeWorkplaceRecords1.map((record) => record.otTime);

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

                            updatedData[(dataIndex1 - 20)].isChecked = true;
                            updatedData[(dataIndex1 - 20)].otTime = otTime1[index];
                            updatedData[(dataIndex1 - 20)].allTime = allTimeA1[index];
                            updatedData[(dataIndex1 - 20)].workplaceId = workplaceId1[index]; // Set otTime at the same index as dates
                            updatedData[(dataIndex1 - 20)].date = dates1[index]; // Set otTime at the same index as dates
                            // updatedData[(dataIndex1 - 20)].month = month[index]; // Set otTime at the same index as dates


                            // Set otTime at the same index as dates
                        }

                        // }

                    });
                    console.log('updatedData', updatedData);

                    const filteredData = updatedData.filter((record) => record.isChecked == true);
                    const workplaceIds = [...new Set(filteredData.map((record) => record.workplaceId))];
                    setDataset(filteredData);
                    return updatedData;

                });
                // setWoekplace(dates);
            }
        }

        catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);
            // window.location.reload();
        }
        //xx
        // alert(result_data[0].employeeId);
    }

    console.log('workplaceIdList', workplaceIdList);
    console.log('calendarData1 updated:', calendarData1);
    console.log('calendarData2 updated:', calendarData2);

    const [Datasetsec, setDatasetsec] = useState([]);

    useEffect(() => {
        // Create a mapping of date to dayoff from listTableDayoff
        const dayoffMap = listTableDayoff.reduce((acc, day) => {
            const date = Object.keys(day)[0];
            const dayoff = day[date].trim(); // Remove extra spaces
            if (dayoff !== '') {
                acc[date] = dayoff;
            }
            return acc;
        }, {});

        // Update the Dataset with the dayoff property for matching dates
        const updatedDataset = dataset.map(item => ({
            ...item,
            dayoff: dayoffMap[item.date] || '' // Add 'dayoff' property if the date exists in the map

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

                if (dayoff === 'หยุด' && !isNaN(allTimeAsNumber)) {
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
        const result = Object.entries(workplaceIdCounts).map(([workplaceId, count]) => ({
            workplaceId,
            count,
            allTime: workplaceIdAllTimes[workplaceId].toFixed(1),
            otTime: workplaceIdOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
            dayoffAllTime: workplaceIdDayoffAllTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
            dayoffOtTime: workplaceIdDayoffOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
        }));

        // Calculate the total allTime
        const totalAllTime = Object.values(workplaceIdAllTimes).reduce((sum, allTime) => sum + allTime, 0).toFixed(1);

        console.log('listTableDayofflistTableDayoff:', listTableDayoff);

        console.log('Result:', result);
        console.log('Total AllTime:', totalAllTime);
        console.log('datasetdataset', dataset);

        const count = dataset.length;

        // Create a mapping of date to dayoff from listTableDayoff

        setCountWork((count));
        setCountWorkSTime(totalAllTime);
        setWorkplaceIdList(result);

        setDatasetsec(updatedDataset);
    }, [dataset, listTableDayoff]);

    console.log('datasetTest', Datasetsec);

    useEffect(() => {
        if (searchWorkplaceId !== '') {
            const workplacesearch = workplaceList.find(workplace => workplace.workplaceId === searchWorkplaceId);
            if (workplacesearch) {
                setSearchWorkplaceName(workplacesearch.workplaceName);
            } else {
                setSearchWorkplaceName('');
            }
            console.log('workplacesearch', workplacesearch);

        }

    }, [searchWorkplaceId]);
    console.log('workplaceList', workplaceList);
    console.log('searchWorkplaceId', searchWorkplaceId);

    const [addSalary, setAddSalary] = useState([]); //เงิ่นเพิ่มพิเศษ

    const [workplaceIdListSearch, setWorkplaceIdListSearch] = useState([]); //หน่วยงานที่ค้นหาและทำงาน
    const [calculatedValues, setCalculatedValues] = useState([]);


    console.log('searchResult', searchResult);
    // get employee data
    const [MinusSearch, setMinusSearch] = useState(0); // Example: February (you can set it dynamically)
    const [EmpData, setEmpData] = useState([]); // Example: February (you can set it dynamically)
    // const [EmpDataWorkplace, setEmpDataWorkplace] = useState([]); // Example: February (you can set it dynamically)

    console.log('addSalary123', addSalary);
    console.log('setEmpData', EmpData);

    console.log('workplaceIdList', workplaceIdList);
    console.log('EmpData', EmpData); // Can access EmpData here

    const [tableData, setTableData] = useState(
        combinedRange.map((index) => ({
            isChecked: false, // Initial state of the checkbox
            textValue: '',    // Initial state of the text value
            workplaceId: index, // Store the workplaceId
            date: '', // Store the workplaceId
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


    ///PDF///////////////////////
    // const [dataset, setDataset] = useState([]);
    const [monthset, setMonthset] = useState(''); // Example: February (you can set it dynamically)

    const [MinusSS, setMinusSS] = useState(0); // Example: February (you can set it dynamically)

    const [result, setResult] = useState(''); // Example: February (you can set it dynamically)


    console.log('testcal', monthset);
    console.log('testRe', result);

    // const [calendarData, setCalendarData] = useState([]);

    const [workMonth, setWorkMonth] = useState([]);

    const generateText = () => {
        return searchResult.map((employeerecord) => (
            'ประจำเดือน ' + getMonthName(employeerecord.month) +
            ' ตั้งแต่วันที่ 21 ' + getMonthName(parseInt(employeerecord.month, 10) - 1) +
            ' ถึง 20 ' + getMonthName(employeerecord.month) +
            ' ' + (parseInt(employeerecord.timerecordId, 10) + 543)
        )).join(' '); // Join the generated text into a single string
    };

    // Call generateText when the component mounts or when searchResult changes
    useEffect(() => {
        const text = generateText();
        setWorkMonth(text);
    }, [searchResult]);

    const generatePDF = async () => {
        try {
            const doc = new jsPDF('landscape');

            // Load the Thai font
            const fontPath = '/assets/fonts/THSarabunNew.ttf';
            doc.addFileToVFS(fontPath);
            doc.addFont(fontPath, 'THSarabunNew', 'normal');

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

            const title = ' ใบลงเวลาการปฏิบัติงาน';

            // Set title with the Thai font
            doc.setFont('THSarabunNew');
            doc.setFontSize(16);
            const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const pageWidth = doc.internal.pageSize.getWidth();
            const titleX = (pageWidth - titleWidth) / 2;
            doc.text(title, titleX, 10);

            const subTitle = workMonth; // Replace with your desired subtitle text
            doc.setFontSize(12); // You can adjust the font size for the subtitle
            const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const subTitleX = (pageWidth - subTitleWidth) / 2;
            doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

            // Calculate the number of days in the month, considering February and leap years
            const daysInMonth = (monthset === '02' && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 :
                (monthset === '02') ? 28 :
                    [4, 6, 9, 11].includes(monthset) ? 30 : 31;

            // Calculate the starting point for the table header
            let startingDay = 21;

            // Generate the header with a single cycle of "01" to "20" followed by "21" to the last day of the month
            const header = Array.from({ length: daysInMonth }, (_, index) => {
                const day = (index + startingDay) > daysInMonth ? (index + startingDay - daysInMonth) : (index + startingDay);

                // Add leading zeros for days 1 to 9
                const formattedDay = day < 10 ? `0${day}` : day.toString();

                return formattedDay;
            });

            // Assuming that 'date' contains values like '01', '02', ..., '28', '29', '30', '31'
            // You can replace 'date' with the actual field name containing the date information in your data
            const dateOt = ['25', '09', '10'];

            const dateFieldName = 'date';

            // Create an object to store data rows by date
            const rowDataByDate = {};

            // Organize the dataset into the rowDataByDate object
            Datasetsec.forEach((data) => {
                // dataset.forEach((data) => {

                const date = data[dateFieldName];
                if (!rowDataByDate[date]) {
                    rowDataByDate[date] = { workplaceId: [], otTime: [], dateFieldName: [], allTime: [] };
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
                        rowData.workplaceId.join(', '),
                        rowData.allTime.join(', '),
                        rowData.otTime.join(', '),
                        // rowData.dateFieldName.join(', '),
                    ];
                } else {
                    return ['', '', ''];
                }
            });

            // Transpose the transposedTableData to sort horizontally
            const sortedTableData = Array.from({ length: 3 }, (_, index) =>
                transposedTableData.map((row) => row[index])
            );

            const textColumn = [name, 'เวลา ทำงาน', 'เวลา OT'];

            const sortedTableDataWithText = sortedTableData.map((data, index) => {
                const text = [textColumn[index]];
                return [...text, ...data];
            });

            // Now, sortedTableDataWithText contains the text column followed by sorted data columns.

            const customHeaders = [
                ['วันที่', ...header],
            ];


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
                    if (data.cell.section === 'head' && shouldHighlightCell(data.cell.raw)) {
                        // Set the background color for header cells with the location number found in dateOt
                        doc.setFillColor(255, 255, 0); // Yellow background color
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    }
                },
            });



            const additionalTableData = [
                ['เงินค่าจ้าง', '', '', '', '', '', '55'],
                ['Cell 4', 'Cell 5', 'Cell 6'],
                ['Cell 7', 'Cell 8', 'Cell 9'],
            ];


            const calculatedValuesAllTime = calculatedValues.map((value) =>
                `${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
            );

            // Combine the calculated values into a single array
            const combinedCalculatedValues = ['รวมวันทำงาน:', ...calculatedValuesAllTime];

            const calculatedValuesOt = calculatedValues.map((value) => [
                `${value.calculatedOT} (${value.otTime})`,
            ]);

            const combinedCalculatedValuesOt = ['รวมวันทำงาน OT:', ...calculatedValuesOt];

            const combinedTableData = [...additionalTableData, combinedCalculatedValues, combinedCalculatedValuesOt];
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
            const textWithBackgroundColor = ['รวมวันทำงาน:', 'รวมวันทำงาน OT:'];

            // Add the additional table to the PDF
            doc.autoTable({
                body: combinedTableData,
                ...additionalTableOptions,
                didDrawCell: function (data) {
                    if (data.cell.section === 'body') {
                        // Check if the cell contains text that should have a background color
                        const text = data.cell.raw;
                        if (textWithBackgroundColor.includes(text)) {
                            // Set the background color
                            doc.setFillColor(255, 255, 0); // Yellow background color
                            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

                            // Reset text color for better visibility
                            doc.setTextColor(0, 0, 0);
                        }
                    }
                },
            });
            const titletest = 'รวมวันทำงาน:';
            const titletest2 = 'รวมวันทำงาน OT:';

            // Set title with the Thai font
            doc.setFont('THSarabunNew');
            doc.setFontSize(14);
            doc.text(titletest, 15, 108);
            doc.text(titletest2, 15, 115);


            // doc.save('example.pdf');
            const pdfContent = doc.output('bloburl');
            window.open(pdfContent, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
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
    const firstPart = Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => startDay + index);

    // Create an array from 1 to 20
    const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

    // Concatenate the two arrays
    const resultArray = [...firstPart, ...secondPart];

    console.log('resultArrayresultArray', resultArray);

    function getDaysInMonth2(month, year) {
        // Months are 0-based, so we subtract 1 from the provided month
        return new Date(year, month, 0).getDate();
    }
    // Function to create an array of days for a given month and year
    function createDaysArray(month, year, endDay, filter) {
        const daysArray = {};

        for (let day = 1; day <= endDay; day++) {
            const date = new Date(year, month - 1, day);
            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

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
    const array1 = createDaysArray(CheckMonth, CheckYear, daysInMonth2, (day) => day <= 20);
    const array2 = createDaysArray(countdownMonth, CheckYear, daysInCountdownMonth, (day) => day >= 21);


    console.log('Array 1 (March):', array1);
    console.log('Array 2 (Countdown):', array2);


    // const arraytest = [[1001, 1, 1, 1, 1, '', 1, 1, 1, 1, '', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5],
    // [1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],];

    // // const sumArray = arraytest.map((subArray) => subArray.reduce((acc, val) => acc + val, 0));
    // const sumArray = arraytest.map(subArray =>
    //     subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    // );
    // console.log('sumArray', sumArray);

    // const arraytestOT = [[1, 2, 2, 2, 2, 2, 2, '', 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0.5],
    // [2, 2, 2, 2, 2, '', 2, '', 2],
    // [2, '', 2, 2, '', 2, 3, '', 3, 3],
    // [3, 3, 3, '', 3, 3, 3, 3],
    // [3, '', 3, '', 3, 3, 3, 1, '', 1],
    // [3, 3, '', 1, 1, '', 1, 3, 3],
    // [3, 3, '', 3, '', 3, 3, 3, 3, '', 1, '', 1, 0.5, 0.5, 1.5],
    // ];
    // const sumArrayOT = arraytestOT.map(subArray =>
    //     subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    // );

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
        const filteredData = workplaceList.filter(item => item.workplaceId === searchWorkplaceId);
        setWorkplaceDataList(filteredData);

        // Filter workplaceDataList to find items with dayOff
        // const dayOffData = filteredData.filter(item => item.daysOff); // Assuming 'dayOff' is a property in the items

        // const filteredDataAddSalary = workplaceDataList.filter(item => item.workplaceId === searchWorkplaceId);
        // setWorkplaceDataListAddSalary(filteredDataAddSalary);

        const workTime = filteredData.map(item => item.workOfHour);
        setWorkplaceDataWorkTime

        // const addSalaryArray = filteredData.map(item => item.addSalary).flat();
        const addSalaryArray = filteredData
            .map(item => item.addSalary.filter(salary => salary.SpSalary !== '' && salary.SpSalary !== null))
            .flat();

        setWorkplaceDataListAddSalary(addSalaryArray);

        const addSalaryArrayWorkOfHour = filteredData.map(item => item.workOfHour);
        setWorkplaceDataWorkOfHour(addSalaryArrayWorkOfHour);

        const addSalaryArrayWorkRate = filteredData.map(item => item.workRate);
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

    console.log('WorkplaceDataListAddSalary', workplaceDataListAddSalary);
    console.log('WorkplaceDataListDayOff', workplaceDataListDayOff);

    const addSalaryWorkplace = workplaceDataListAddSalary;

    // workplaceDataListAddSalary
    // วันหยุดนักขัต
    const filteredDaysOff = workplaceDataListDayOff
        .filter(item => {
            const date = new Date(item);
            return (
                date.getFullYear() === desiredTimerecordIdDaysOff &&
                date.getMonth() + 1 === desiredMonthDaysOff
            );
        })
        .map(item => {
            const date = new Date(item);
            return date.getDate(); // Extract day part of the date
        });

    const filteredDaysOff_lower21 = filteredDaysOff.filter(day => day < 21);

    console.log('filteredDaysOff_lower21', filteredDaysOff_lower21);


    console.log('desiredTimerecordIdDaysOff', desiredTimerecordIdDaysOff);
    console.log('desiredMonthDaysOff', desiredMonthDaysOff);

    const filteredDaysOff2 = workplaceDataListDayOff
        .filter(item => {
            const date = new Date(item);
            if (desiredMonthDaysOff === 1) { // If desired month is January
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
        .map(item => {
            const date = new Date(item);
            return date.getDate(); // Extract day part of the date
        });
    console.log('filteredDaysOff2', filteredDaysOff2);


    const filteredDaysOff2_upper20 = filteredDaysOff2.filter(day => day > 20);

    console.log('filteredDaysOff2_upper20', filteredDaysOff2_upper20);

    const allDayOff = [...filteredDaysOff2_upper20, ...filteredDaysOff_lower21];

    console.log('allDayOff', allDayOff);

    const holidayList = [];
    const falseWorkdays = [];

    // // Days of the week
    // // กรองวันที่ที่ในสัปดา
    // const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // // Loop through each day of the week
    // // for (let i = 1; i <= 7; i++) {
    // //     const workdayProperty = `workday${i}`;

    // //     // Check if the workday property is set to false
    // //     if (workplaceDataList.some(item => item[workdayProperty] === 'false')) {
    // //         falseWorkdays.push(daysOfWeek[i - 1]);
    // //     }
    // // }
    // for (let i = 1; i <= 7; i++) {
    //     const workdayProperty = `workday${i}`;

    //     // Check if workplaceDataList is not empty and has at least one item
    //     if (workplaceDataList.length > 0 && workplaceDataList.some(item => item.hasOwnProperty(workdayProperty) && item[workdayProperty] === 'false')) {
    //         falseWorkdays.push(daysOfWeek[i - 1]);
    //     }
    // }



    // const arrays = [array1, array2];
    // // กรองวันหยุดประจำสัปดา
    // falseWorkdays.forEach(day => {
    //     arrays.forEach(array => {
    //         if (array[day]) {
    //             holidayList.push(...array[day]);
    //         }
    //     });
    // });

    const workplace = workplaceList.find(workplace => workplace.workplaceId === searchWorkplaceId);

    console.log('workplace123', workplace);

    // const monthTest = "09"; // Assuming "09" represents September
    const commonNumbers123 = new Set();

    if (workplace && year) {
        const matchingDays = workplace.daysOff.filter(date => {
            const dateObj = new Date(date);
            return (dateObj.getMonth() + 1).toString().padStart(2, '0') === month; // +1 because getMonth() returns zero-based month index
        });

        console.log('matchingDays', matchingDays);
        // Iterate over matchingDays and add day numbers to commonNumbers set

        matchingDays.forEach(date => {
            const dateObj = new Date(date);
            const day = dateObj.getDate(); // Get the day number (1-31)
            commonNumbers123.add(day); // Add day number to the set
        });

        console.log('commonNumbers123', commonNumbers123);
    } else {
        console.error('Workplace not found');
    }

    const commonNumbers = new Set();

    if (workplace && year) {
        const stopWorkTimeDay = workplace.workTimeDay.find(day => day.workOrStop == "stop");

        console.log("stopWorkTimeDay", stopWorkTimeDay);

        if (stopWorkTimeDay) {
            const { startDay, endDay } = stopWorkTimeDay;
            console.log("Found stop workTimeDay:", startDay, endDay);

            const daysInBetween = getDaysInBetween(startDay, endDay);
            console.log("daysInBetween:", daysInBetween);

            daysInBetween.forEach(day => {
                const englishDayArray = thaiToEnglishDayMap[day];
                console.log("englishDayArray:", englishDayArray);

                englishDayArray.forEach(englishDay => {
                    // Use forEach to add each element to commonNumbers
                    // commonNumbers.add(...array1[englishDayArray]);
                    array1[englishDay].forEach(value => commonNumbers.add(value));
                    array2[englishDay].forEach(value => commonNumbers.add(value));
                });
                // englishDayArray.forEach(englishDay => {
                //     // Check if the key exists in array1 before attempting to access it
                //     if (array1.hasOwnProperty(englishDay)) {
                //         // Access the array and perform operations if the key exists
                //         array1[englishDay].forEach(value => commonNumbers.add(value));
                //     } else {
                //         console.log(`Key ${englishDay} does not exist in array1`);
                //     }
                // });
            });

            // setHoliday(commonNumbers);
            // console.log("Common Numbers:", commonNumbers);
        } else {
            console.log("No stop workTimeDay found.");
        }
    } else {
        console.log("Workplace not found.");
    }

    commonNumbers123.forEach(number => {
        commonNumbers.add(number);
    });

    commonNumbers.forEach(number => {
        holidayList.push(number);
    });

    // Adding elements from commonNumbers123 array to falseWorkdays
    commonNumbers.forEach(number => {
        falseWorkdays.push(number);
    });

    console.log("Common Numbers:", commonNumbers);

    const commonNumbersArray = [...commonNumbers].map(value => value.toString());


    function getDaysInBetween(startDay, endDay) {
        const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
        const startIndex = weekdays.indexOf(startDay);
        const endIndex = weekdays.indexOf(endDay);

        if (startIndex === -1 || endIndex === -1) {
            return [];
        }

        return weekdays.slice(startIndex, endIndex + 1);
    }

    // console.log('holidayList', holidayList);
    console.log('allDayOff', allDayOff);
    console.log('falseWorkdays', falseWorkdays);
    console.log('holidayList', holidayList);

    // console.log('Array 1 (March):', array1);
    // console.log('Array 2 (Countdown):', array2);

    console.log('workplaceDataList', workplaceDataList);
    console.log('WorkplaceDataListDayOff', workplaceDataListDayOff);
    // console.log('setDaysOffArray', dayOffData);



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
        desiredMonthLower = ((parseInt(desiredMonth, 10) - 1 + 12) % 12).toString().padStart(2, '0');
    }
    // Filter the entries based on the criteria

    const thaiMonthName = getThaiMonthName(desiredMonth);
    const thaiMonthNameLower = getThaiMonthName(desiredMonthLower);

    console.log('thaiMonthName', thaiMonthName); // Thai month name based on desiredMonth
    console.log('thaiMonthNameLower', thaiMonthNameLower); // Thai month name based on desiredMonthLower

    console.log('conclude', conclude); // Thai month name based on desiredMonthLower

    // const filteredEntries = timerecordAllList.filter(entry =>
    //     entry.timerecordId === desiredTimerecordId &&
    //     entry.month === desiredMonth &&
    //     entry.employee_workplaceRecord.date < 21 &&
    //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
    // );

    const filteredEntriesTest = conclude
        .filter(entry =>
            entry.year === desiredTimerecordId &&
            entry.month === desiredMonth
        );
    console.log('filteredEntriesTest', filteredEntriesTest);

    // Initialize objects to store the grouped times
    const allTimesByEmployee = {};
    const otTimesByEmployee = {};

    const allTimesByEmployee2 = {};
    const otTimesByEmployee2 = {};

    const allTimesByEmployee3 = {};
    const otTimesByEmployee3 = {};

    // Iterate over filteredEntriesTest to populate the objects
    filteredEntriesTest.forEach(entry => {
        // Initialize arrays to store the results for the current employeeId
        let allTimesArray = [];
        let otTimesArray = [];

        let allTimesArray2 = [];
        let otTimesArray2 = [];

        let allTimesArray3 = [];
        let otTimesArray3 = [];
        let test = 0;

        // Iterate over each concludeRecord
        entry.concludeRecord.forEach(record => {
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
            if (record.workRate / workRateWorkplace < workRateWorkplaceStage1) {
                // Push allTimes and otTimes to respective arrays
                allTimesArray.push(parseFloat(record.allTimes));
                otTimesArray.push(parseFloat(record.otTimes));
            } else {
                // Push empty strings if workRate and workRateOT do not exist
                allTimesArray.push('');
                otTimesArray.push('');
            }
            if (record.workRate / workRateWorkplace >= workRateWorkplaceStage1 &&
                record.workRate / workRateWorkplace <= workRateWorkplaceStage2
            ) {
                // Push allTimes and otTimes to respective arrays
                allTimesArray2.push(parseFloat(record.allTimes));
                otTimesArray2.push(parseFloat(record.otTimes));
            } else {
                // Push empty strings if workRate and workRateOT do not exist
                allTimesArray2.push('');
                otTimesArray2.push('');
            }
            if (record.workRate / workRateWorkplace >= workRateWorkplaceStage2) {
                // Push allTimes and otTimes to respective arrays
                allTimesArray3.push(parseFloat(record.allTimes));
                otTimesArray3.push(parseFloat(record.otTimes));
            } else {
                // Push empty strings if workRate and workRateOT do not exist
                allTimesArray3.push('');
                otTimesArray3.push('');
            }
        });

        // Store the arrays in the objects by employeeId
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
        // console.log("testtest123", test);
    });

    // Convert the objects to arrays of arrays
    const newAllTimes = Object.values(allTimesByEmployee).flat();
    const newOtTimes = Object.values(otTimesByEmployee).flat();

    const newAllTimes2 = Object.values(allTimesByEmployee2).flat();
    const newOtTimes2 = Object.values(otTimesByEmployee2).flat();

    const newAllTimes3 = Object.values(allTimesByEmployee3).flat();
    const newOtTimes3 = Object.values(otTimesByEmployee3).flat();

    // Log the results
    console.log('allTimes:', newAllTimes);
    console.log('otTimes:', newOtTimes);

    console.log('allTimes2:', newAllTimes2);
    console.log('otTimes2:', newOtTimes2);

    console.log('allTimes3:', newAllTimes3);
    console.log('otTimes3:', newOtTimes3);


    const filteredEntries = conclude
        .filter(entry =>
            entry.timerecordId === desiredTimerecordId &&
            entry.month === desiredMonth &&
            entry.employee_workplaceRecord.some(record => record.date < 21 && record.workplaceId === desiredWorkplaceId)
        )
        .map(entry => ({
            ...entry,
            employee_workplaceRecord: entry.employee_workplaceRecord.filter(record => record.date < 21 && record.workplaceId === desiredWorkplaceId)
        }));

    console.log('filteredEntries', filteredEntries);

    const employeeIds = filteredEntries.map(entry => entry.employeeId);

    // const filteredEntriesLower = timerecordAllList.filter(entry =>
    //     entry.timerecordId === desiredTimerecordId &&
    //     entry.month === desiredMonthLower
    //     &&
    //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
    // );

    const filteredEntriesLower = conclude
        .filter(entry =>
            entry.timerecordId === desiredTimerecordId &&
            entry.month === desiredMonthLower &&
            entry.employee_workplaceRecord.some(record => record.date > 20 && record.workplaceId === desiredWorkplaceId)
        )
        .map(entry => ({
            ...entry,
            employee_workplaceRecord: entry.employee_workplaceRecord.filter(record => record.date > 20 && record.workplaceId === desiredWorkplaceId)
        }));

    const employeeIdsLower = filteredEntriesLower.map(entry => entry.employeeId);


    // Create an object to store dates for each employee

    const datesByEmployee = {};
    const datesByEmployeeLow = {};


    const datesByEmployeeUpper = {};
    const datesByEmployeeLower = {};
    // Loop through employeeIds
    for (const employeeId of employeeIds) {
        // Filter entries for the current employee
        const employeeEntries = filteredEntries.filter(entry => entry.employeeId === employeeId);

        const entriesData = employeeEntries.map(entry =>
            entry.employee_workplaceRecord
                .filter(record => record.date <= 20)
                .map(record => ({
                    workplaceId: record.workplaceId,
                    dates: record.date,
                    allTimes: record.allTime,
                    otTimes: record.otTime,
                    specialtSalarys: record.specialtSalary,
                    shift: record.shift
                }))
        );

        datesByEmployee[employeeId] = entriesData;

    }
    console.log('datesByEmployee123', datesByEmployee);


    for (const employeeId of employeeIdsLower) {
        // Filter entries for the current employee
        const employeeEntries = filteredEntriesLower.filter(entry => entry.employeeId === employeeId);

        // Extract dates for the current employee
        // const dates = employeeEntries.flatMap(entry =>
        //     entry.employee_workplaceRecord.map(record => record.date)
        // );

        // // Remove duplicates (if any)
        // const uniqueDatesLower = [...new Set(dates)];

        const entriesDataLower = employeeEntries.map(entry =>
            entry.employee_workplaceRecord
                .filter(record => record.date >= 21)
                .map(record => ({
                    workplaceId: record.workplaceId,
                    dates: record.date,
                    allTimes: record.allTime,
                    otTimes: record.otTime,
                    specialtSalarys: record.specialtSalary,
                    shift: record.shift

                }))
        );

        // Store the unique dates for the current employee
        datesByEmployeeLow[employeeId] = entriesDataLower;
    }
    console.log('datesByEmployeeLower123', datesByEmployeeLow);

    const combinedArray = {};

    for (const employeeId of Object.keys(datesByEmployee)) {
        const entriesData = datesByEmployee[employeeId].flat();

        combinedArray[employeeId] = [...(combinedArray[employeeId] || []), ...entriesData];
    }

    for (const employeeId of Object.keys(datesByEmployeeLow)) {
        const entriesData = datesByEmployeeLow[employeeId].flat();

        combinedArray[employeeId] = [...(combinedArray[employeeId] || []), ...entriesData];
    }

    console.log('Combined Array:', combinedArray);

    // แยกวันทำงานของแต่ละคน
    const uniqueDatesArray = Object.keys(combinedArray).map(employeeId => {
        const entriesData = combinedArray[employeeId];
        const uniqueDatesSet = new Set(
            entriesData
                .map(entry => Number(entry.dates))
                .filter(date => date !== 0)
        );
        return [...uniqueDatesSet].sort((a, b) => a - b);
    });

    // Extract employee IDs
    // แยกemployee IDsของแต่ละคน
    const employeeIdsArray = Object.keys(combinedArray).map(Number).sort((a, b) => a - b);
    // setEmpIDlist(employeeIdsArray);
    // console.log('EmpIDlist',empIDlist);

    console.log('Unique Dates:', uniqueDatesArray);
    console.log('EmployeeIDs:', employeeIdsArray);

    const filteredUniqueDatesArray = uniqueDatesArray.map(subArray => {
        return subArray.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    });

    console.log('filteredUniqueDatesArray', filteredUniqueDatesArray);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/employee/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setEmploeeData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    // responseDataAll
    // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)));

    // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)))
    //     .sort((a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10));
    const filteredEmployees = responseDataAll.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)))
        .sort((a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10));

    //     // Do something with the filtered employees
    console.log('filteredEmployees', filteredEmployees);

    // const extractedData = filteredEmployees.map(employee => [
    //     employee.name + ' ' + employee.lastName,
    //     employee.employeeId,
    //     'กะเช้า',
    //     'กะดึก',
    // ]);

    const extractedData = filteredEmployees
        .map(employee => [
            employee.name + ' ' + employee.lastName,
            employee.employeeId,
            'กะเช้า',
            'กะดึก',
        ])
        .sort((a, b) => {
            const idA = parseInt(a[1], 10);
            const idB = parseInt(b[1], 10);
            return idA - idB;
        });

    console.log('extractedData123', extractedData);

    // const extractedDataAddSalary = filteredEmployees.map(employee => [
    //     employee.addSalary
    // ]);
    // console.log('extractedDataAddSalary', extractedDataAddSalary);

    console.log('EmploeeData', emploeeData);
    // console.log('EmploeeDataSearch', emploeeDataSearch);
    // console.log('arraytestEmpAddSalary', arraytestEmpAddSalary);

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
    Object.keys(combinedArray).forEach(employeeId => {
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

        const datesArray = combinedArray[employeeId].map(entry => Number(entry.dates));

        console.log('datesArray123', datesArray);
        // Filter only numeric values in datesArray

        const filteredEntriesSpecialt = combinedArray[employeeId].filter(entry =>
            entry.shift === "specialt_shift" && Number(entry.specialtSalarys) > 300
        );
        console.log('filteredEntriesSpecialt', filteredEntriesSpecialt);

        // Extract dates from the filtered entries
        // const datesArray321 = filteredEntriesSpecialt.map(entry => entry.dates).flat();
        // const daySpecialt = filteredEntriesSpecialt.map(entry => entry.dates.map(date => parseFloat(date))).flat();
        // console.log('datesArray321', datesArray321);

        const daySpecialt = filteredEntriesSpecialt.map(entry => parseInt(entry.dates, 10));

        console.log('datesArray321', daySpecialt);


        console.log(`Employee ID: ${employeeId}, Dates:`, datesArray);

        const numericDatesArray = datesArray.filter(date => !isNaN(date));

        const datesSet = new Set(datesArray);
        const uniqueDatesArray = Array.from(datesSet);

        // const employeeResultArray = resultArray.map(day => {
        //     const workplaceIdIndex = datesArray.indexOf(day);
        const employeeResultArray = resultArray.filter(day => !daySpecialt.includes(parseInt(day, 10))).map(day => {
            const workplaceIdIndex = datesArray.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
            //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;

                if (currentWorkplaceId === searchWorkplaceId) {
                    return 1;
                } else if (currentWorkplaceId === '') {
                    return '';
                } else {
                    return currentWorkplaceId;
                }
            } else {
                return '';
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
        const employeeResultArrayAllTime = resultArray.map(day => {
            const workplaceIdIndex = datesArray.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
            //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;

                if (currentWorkplaceId === '') {
                    return '';
                } else {
                    // return parseFloat(currentWorkplaceId, 10);
                    if (parseFloat(currentWorkplaceId, 10) == 0) {
                        return '';
                    } else {
                        return parseFloat(currentWorkplaceId, 10);
                    }
                }
            } else {
                return '';
            }
        });

        arrayAllTime.push(employeeResultArrayAllTime);
        console.log('arrayAllTime123', arrayAllTime);

        // รวมชั่วโมงทำงาน
        const employeeResultArrayOTAllTime = resultArray.map(day => {
            const workplaceIdIndex = datesArray.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
            //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;

                if (currentWorkplaceId === '') {
                    return '';
                } else {
                    // return parseFloat(currentWorkplaceId, 10);
                    if (parseFloat(currentWorkplaceId, 10) == 0) {
                        return '';
                    } else {
                        return parseFloat(currentWorkplaceId, 10);
                    }
                }
            } else {
                return '';
            }
        });

        arrayOTAllTime.push(employeeResultArrayOTAllTime);
        console.log('arrayOTAllTime', arrayOTAllTime);


        // combinedArray
        console.log('combinedArray', combinedArray);
        console.log('datesArray', datesArray);
        console.log('numericDatesArray', numericDatesArray);
        console.log('uniqueDatesArray', uniqueDatesArray);


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
        console.log('employeeResultArray', employeeResultArray);



        arraytest.push(employeeResultArray);
        console.log('arraytest123', arraytest);


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
        const commonDatesHoli = datesArray.filter(date =>
            holidayList.includes(date) && !allDayOff.includes(date)
        );
        const employeeResultArray2Holi = resultArray.map(day => {
            const workplaceIdIndex = commonDatesHoli.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
            //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;

                if (currentWorkplaceId === searchWorkplaceId) {
                    return 1;
                } else if (currentWorkplaceId === '') {
                    return '';
                } else {
                    // return parseFloat(currentWorkplaceId, 10);
                    if (parseFloat(currentWorkplaceId, 10) == 0) {
                        return '';
                    } else {
                        return parseFloat(currentWorkplaceId, 10);
                    }
                }
            } else {
                return '';
            }
        });
        arrayWorkHoli.push(employeeResultArray2Holi);

        // วันที่ทำงานในวันหยุดนักขัตฤกษ์(ช.ม.)
        const commonDates = datesArray.filter(date => allDayOff.includes(date) || daySpecialt.includes(parseInt(date)));
        // const commonDates = datesArray.filter(date => allDayOff.includes(date) && daySpecialt.includes(parseInt(date, 10)));

        // const commonDates = datesArray.filter(date => allDayOff.includes(date));


        console.log('commonDatestest', commonDates);


        const employeeResultArray2 = resultArray.map(day => {
            const workplaceIdIndex = commonDates.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
            //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
                // const currentWorkplaceId123 = combinedArray[employeeId][workplaceIdIndex].specialtSalarys;

                const specialtSalarys = combinedArray[employeeId][workplaceIdIndex]?.specialtSalarys ?? '';

                const currentWorkplaceId123 = specialtSalarys === "" ? '' : specialtSalarys;

                console.log('currentWorkplaceId123', currentWorkplaceId);
                // 12/06/2024
                // if (currentWorkplaceId === searchWorkplaceId) {
                //     return 1;
                // } else if (currentWorkplaceId === '') {
                //     return '';
                // } else {
                // return parseFloat(currentWorkplaceId, 10);
                if (parseFloat(currentWorkplaceId, 10) == 0) {
                    return '';
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
                return '';
            }
        });
        arrayWorkHoliday.push(employeeResultArray2);

        // วันที่ทำงานในวันหยุดนักขัตฤกษ์OT(ช.ม.)
        const commonDatesOT = datesArray.filter(date => allDayOff.includes(date) || daySpecialt.includes(parseInt(date)));
        // const employeeResultArray2OT = resultArray.map(day => {
        //     const workplaceIdIndex = commonDatesOT.indexOf(day);
        //     if (workplaceIdIndex !== -1) {
        //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;
        //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
        //     } else {
        //         return '';
        //     }
        // });
        const employeeResultArray2OT = resultArray.map(day => {
            const workplaceIdIndex = commonDatesOT.indexOf(day);

            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;

                if (currentWorkplaceId === searchWorkplaceId) {
                    return 1;
                } else if (currentWorkplaceId === '') {
                    return '';
                } else {
                    // return parseFloat(currentWorkplaceId, 10);
                    if (parseFloat(currentWorkplaceId, 10) == 0) {
                        return '';
                    } else {
                        return parseFloat(currentWorkplaceId, 10);
                    }
                }
            } else {
                return '';
            }
        });
        arrayWorkOTHoliday.push(employeeResultArray2OT);


        // วันที่ทำงานปกติ
        // const commonDates3 = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date)));
        // const employeeResultArray3 = resultArray.map(day => {
        //     const workplaceIdIndex = commonDates3.indexOf(day);
        //     if (workplaceIdIndex !== -1) {
        //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
        //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
        //     } else {
        //         return '';
        //     }
        // });
        // const commonDates3 = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date)));
        // console.log('commonDates3', commonDates3);

        const employeeResultArray3 = resultArray.map(day => {
            const workplaceIdIndex = datesArray.indexOf(day);
            // if (workplaceIdIndex !== -1) {
            //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
            //     return currentWorkplaceId === searchWorkplaceId ? 1 : currentWorkplaceId;
            // } else {
            //     return '';
            // }
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
                console.log('currentWorkplaceId', currentWorkplaceId);
                if (currentWorkplaceId === searchWorkplaceId) {
                    return 1;
                } else if (currentWorkplaceId === '') {
                    return '';
                } else {
                    return currentWorkplaceId;
                }
            } else {
                return '';
            }
        });

        arrayWorkNormalDay.push(employeeResultArray3);

        // วันที่ทำงานปกติ 1
        const commonDates3 = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date) || daySpecialt.includes(parseInt(date, 10))));
        const employeeResultArray3Old = resultArray.map(day => {
            const workplaceIdIndex = commonDates3.indexOf(day);
            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
                return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
            } else {
                return '';
            }
        });

        arrayWorkNormalDayOld.push(employeeResultArray3Old);

        // วันที่ทำงานปกติOT
        const commonDates3OT = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date) || daySpecialt.includes(parseInt(date, 10))));
        console.log('commonDates3OT', commonDates3OT);
        // const employeeResultArray3OT = resultArray.map(day => {
        //     const workplaceIdIndex = commonDates3OT.indexOf(day);
        //     if (workplaceIdIndex !== -1) {
        //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;
        //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseFloat(currentWorkplaceId, 10);
        //     } else {
        //         return '';
        //     }
        // });

        const employeeResultArray3OT = resultArray.map(day => {
            const workplaceIdIndex = commonDates3OT.indexOf(day);

            if (workplaceIdIndex !== -1) {
                const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;

                if (currentWorkplaceId === searchWorkplaceId) {
                    return 1;
                } else if (currentWorkplaceId === '') {
                    return '';
                } else {
                    if (parseFloat(currentWorkplaceId, 10) == 0) {
                        return '';
                    } else {
                        return parseFloat(currentWorkplaceId, 10);
                    }

                }
            } else {
                return '';
            }
        });


        arrayWorkOTNormalDay.push(employeeResultArray3OT);


    });

    console.log('Result Position Array:', arraytest);
    console.log('arrayWorkHoliday:', arrayWorkHoliday);
    console.log('arrayWorkNormalDay:', arrayWorkNormalDay);
    console.log('arrayWorkOTNormalDay:', arrayWorkOTNormalDay);
    console.log('arrayWorkHoli:', arrayWorkHoli);
    console.log('arrayWorkNormalDayOld:', arrayWorkNormalDayOld);
    console.log('arrayWorkOTHoliday:', arrayWorkOTHoliday);

    // const makePage = Math.ceil(arrayWorkNormalDay.length / 5);
    // console.log('makePage', makePage);

    // const sumArrayAllTime = arrayAllTime.map(subArray =>
    //     subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    // );

    // const sumArrayAllTime = arrayAllTime.map(subArray => {
    //     const totalMinutes = subArray.reduce((acc, val) => {
    //         if (typeof val === 'number') {
    //             // Convert the time to total minutes
    //             const hours = Math.floor(val);
    //             const minutes = (val - hours) * 60;
    //             return acc + (hours * 60) + minutes;
    //         }
    //         return acc;
    //     }, 0);

    //     // Convert total minutes back to hours and fractional hours
    //     const totalHours = Math.floor(totalMinutes / 60);
    //     const remainingMinutes = totalMinutes % 60;
    //     const fractionalHours = remainingMinutes / 60;

    //     return totalHours + fractionalHours;
    // });

    // console.log('sumArrayAllTime', sumArrayAllTime);

    const sumArrayAllTime = arrayAllTime.map(subArray => {
        let totalHours = 0;
        let totalMinutes = 0;

        subArray.forEach(val => {
            if (typeof val === 'number') {
                const [hours, minutes] = val.toString().split('.').map(Number);
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

    console.log('sumArrayAllTime', sumArrayAllTime);


    // WorkplaceDataWorkOfHour
    // const dividedArray = sumArrayAllTime.map(sum => sum / workplaceDataWorkOfHour);
    // console.log('dividedArray', dividedArray);

    const dividedArray = sumArrayAllTime.map(sum => (sum / workplaceDataWorkOfHour).toFixed(2));
    console.log('dividedArray', dividedArray);


    const sumArrayOTAllTime = arrayOTAllTime.map(subArray =>
        subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    );

    const sumArrayOT = arrayWorkOTNormalDay.map(subArray =>
        subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    );

    // วันหยุด
    const sumArrayHolid = arrayWorkHoli.map(subArray =>
        subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    );

    const sumArrayTotal = sumArrayOT.map((sumOT, index) => sumOT + (sumArrayHolid[index] || 0));


    const countSpecialDays = responseDataAll.map(item => Number(item.countSpecialDay) || 0);
    const specialDayListWorks = responseDataAll.map(item => (item.specialDayListWork ? item.specialDayListWork.length : 0));

    // const specialDayRate = responseDataAll.map(item => item.specialDayRate);
    const specialDayRate = responseDataAll.map(item => parseInt(item.specialDayRate, 10));
    // const amountSpecialDay = responseDataAll.map(item => parseInt(item.accountingRecord.amountSpecialDay, 10));
    const amountSpecialDay = responseDataAll.map(item => {
        const accountingRecord = item.accountingRecord?.[0];
        return accountingRecord ? parseInt(accountingRecord.amountSpecialDay, 10) : 0;
    });



    console.log('amountSpecialDay', amountSpecialDay);


    console.log('countSpecialDays', countSpecialDays);
    console.log('specialDayListWorks', specialDayListWorks);

    const sumArrayHoli = countSpecialDays.map((countSpecialDay, index) => countSpecialDay - specialDayListWorks[index]);
    console.log('differences', sumArrayHoli);


    const sumArrayHoliday = arrayWorkHoliday.map(subArray =>
        subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    );

    const sumArrayOTHoliday = arrayWorkOTHoliday.map(subArray =>
        subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    );

    // นับวันที่ทำในวันหยุดวันนักขัตฤกษ์
    const occurrencesCount = filteredUniqueDatesArray.map(subArray => {
        const count = subArray.filter(value => allDayOff.includes(value)).length;
        return count;
    });

    console.log('occurrencesCount', occurrencesCount);

    // นับวันที่ทำในวันหยุด ไม่รวมวันนักขัตฤกษ์
    const occurrencesCount2 = filteredUniqueDatesArray.map(subArray => {
        const count = subArray.filter(value => holidayList.includes(value) && !allDayOff.includes(value)).length;
        return count;
    });

    console.log('occurrencesCount2', occurrencesCount2);



    // const sumArray = arraytest.map(subArray =>
    //     subArray.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0)
    // );
    // const array = [
    //     [1001, 1, 12, 16, 31, 19, '', '', '', '', ''],
    //     [1001, 1, 16, 31, 19, '', '', '', '', ''],
    //     [1, 12, '', '', '', '', ''],
    //     // ... other subarrays
    // ];
    // const sumArray = arrayWorkNormalDay.map(subarray => subarray.map(item => (typeof item === 'number' ? 1 : item)).reduce((count, item) => (item === 1 ? count + 1 : count), 0));

    const sumArray = arrayWorkNormalDay.map(subarray =>
        subarray.reduce((count, item) => {
            if (typeof item === 'string') {
                const stringLength = item.length;

                if (stringLength >= 4) {
                    return count + 1;
                } else if (stringLength > 0) {
                    return count + parseFloat(item) || 0;
                }
            } else if (typeof item === 'number') {
                return count + item;
            }

            return count;
        }, 0)
    );

    console.log('sumArray', sumArray);

    const sumArrayOld = arrayWorkNormalDayOld.map(subarray => subarray.map(item => (typeof item === 'number' ? 1 : item)).reduce((count, item) => (item === 1 ? count + 1 : count), 0));


    console.log('sumArrayOld', sumArrayOld);

    console.log('sumArrayHoli', sumArrayHoli);
    console.log('sumArrayHoliday', sumArrayHoliday);
    console.log('sumArrayAllTime', sumArrayAllTime);
    console.log('sumArrayOTAllTime', sumArrayOTAllTime);
    console.log('sumArrayOTHoliday', sumArrayOTHoliday);
    console.log('sumArrayOT', sumArrayOT);

    const indexArray = Array.from({ length: sumArray.length }, (_, index) => index + 1);

    console.log('indexArray', indexArray);

    const sumHoliAllTime = sumArrayOT.map((value, index) => value + sumArrayHoli[index]);

    console.log('sumHoliAllTime', sumHoliAllTime);

    // workplaceDataWorkOfHour
    // sumArrayHoliday
    // sumArrayHoli

    const sumarrayAllHoloday = sumArrayHoli.map((valueHoli, index) => {
        const valueHoliday = sumArrayHoliday[index] || 0; // If undefined, treat as 0
        const sum = valueHoli + valueHoliday;
        return sum / workplaceDataWorkOfHour;
    });
    // addSalaryWorkplace
    const sumArraySumarrayAllHolioday = sumArray.map((value, index) => value + sumarrayAllHoloday[index]);

    const resultAllSalaryEmp = [];



    addSalaryWorkplace.sort((a, b) => a.name.localeCompare(b.name, 'th'));

    // const extractedDataAddSalary = filteredEmployees.flatMap(employee => [
    //     employee.addSalary
    // ]);
    // const extractedDataAddSalary = filteredEmployees.map(employee => [
    //     employee.addSalary
    // ]);
    const addSalaryNames = new Set(addSalaryWorkplace.map(item => item.name));

    // Map filteredEmployees to set SpSalary based on the position of the corresponding name in addSalaryWorkplace
    const extractedDataAddSalary = filteredEmployees.map(employee => {
        // Initialize an array to hold SpSalary values
        const spSalaryArray = [];
        // Iterate over addSalaryWorkplace
        addSalaryWorkplace.forEach(salaryItem => {
            // Find the position of salaryItem.name in employee.addSalary
            const index = employee.addSalary.findIndex(item => item.name === salaryItem.name);
            // If the name exists in employee.addSalary, push the SpSalary as an integer to spSalaryArray
            if (index !== -1) {
                spSalaryArray.push(parseInt(employee.addSalary[index].SpSalary));
            } else {
                // If the name doesn't exist in employee.addSalary, push 0 as an integer
                spSalaryArray.push('');
            }
        });
        return spSalaryArray;
    });

    console.log('extractedDataAddSalary', extractedDataAddSalary);

    // Filter extractedDataAddSalary to include only elements with 'daily' roundOfSalary
    // const dailyExtractedDataAddSalary = extractedDataAddSalary.map(salaryArray => {
    //     return salaryArray.map((value, index) => {
    //         // If roundOfSalary is 'daily', multiply the value by the corresponding element in sumArray
    //         return value !== '' && addSalaryWorkplace[index].roundOfSalary === 'daily' ? value * sumArray[index] : value;
    //     });
    // });
    // 
    // console.log('dailyExtractedDataAddSalary', dailyExtractedDataAddSalary);

    // Calculate the adjusted dailyExtractedDataAddSalary
    // const adjustedDailyExtractedDataAddSalary = extractedDataAddSalary.map((salaryArray, outerIndex) => {
    //     return salaryArray.map((value, innerIndex) => {
    //         // If the value is not an empty string and roundOfSalary is 'daily'
    //         if (value !== '' && addSalaryWorkplace[innerIndex].roundOfSalary === 'daily') {
    //             // Multiply the value by the corresponding count in sumArray
    //             return value * sumArray[outerIndex];
    //         } else {
    //             // Otherwise, keep the value unchanged
    //             return value;
    //         }
    //     });
    // });

    // console.log('adjustedDailyExtractedDataAddSalary', adjustedDailyExtractedDataAddSalary);
    const adjustedDailyExtractedDataAddSalary = extractedDataAddSalary.map((salaryArray, outerIndex) => {
        return salaryArray.map((value, innerIndex) => {
            // Find the corresponding salary item in employee.addSalary
            const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(item => item.name === addSalaryWorkplace[innerIndex].name);

            // Check if the value is not an empty string and roundOfSalary is 'daily' in both addSalaryWorkplace and employee.addSalary
            // if (value !== '' && addSalaryWorkplace[innerIndex].roundOfSalary === 'daily' && employeeSalaryItem && employeeSalaryItem.roundOfSalary === 'daily') {
            if (employeeSalaryItem && employeeSalaryItem.roundOfSalary === 'daily') {

                // Multiply the value by the corresponding count in sumArray
                // return value * sumArrayOld[outerIndex];
                // return $value * employeeSalaryItem.message;

                // const result = value * employeeSalaryItem.message;
                // // Construct the string template with placeholders and return
                // return `${value} * ${employeeSalaryItem.message} = ${result}`;

                return value;

            } else {
                // Otherwise, keep the value unchanged
                return value;
            }
        });
    });

    console.log('adjustedDailyExtractedDataAddSalary', adjustedDailyExtractedDataAddSalary);


    const adjustedDailyExtractedDataAddSalaryCount = extractedDataAddSalary.map((salaryArray, outerIndex) => {
        return salaryArray.map((value, innerIndex) => {
            // If the value is not an empty string and roundOfSalary is 'daily'
            const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(item => item.name === addSalaryWorkplace[innerIndex].name);

            if (value !== '' && addSalaryWorkplace[innerIndex].roundOfSalary === 'daily') {
                // Multiply the value by the corresponding count in sumArray
                // return sumArrayOld[outerIndex];
                return employeeSalaryItem.message;
            } else {
                // Otherwise, keep the value unchanged
                return '';
            }
        });
    });

    console.log('adjustedDailyExtractedDataAddSalaryCount', adjustedDailyExtractedDataAddSalaryCount);


    // for (let i = 0; i < sumArraySumarrayAllHoloday.length; i++) {
    //     const item = workplaceDataListAddSalary[i];
    //     const salaryValue = item.roundOfSalary === 'monthly' ? parseInt(item.SpSalary, 10) : parseInt(item.SpSalary, 10) * sumArraySumarrayAllHoloday[i];
    //     resultAllSalaryEmp.push([salaryValue]);
    //   }

    // for (let i = 0; i < sumArraySumarrayAllHoloday.length; i++) {
    //     const item = workplaceDataListAddSalary[i];
    //     const salaryValue = item.StaffType;
    //     resultAllSalaryEmp.push([salaryValue]);
    //     console.log('salaryValue', salaryValue);

    // }



    // รวมคำนวนสวัสดิการ
    const SpSalaryArray = workplaceDataListAddSalary.map(item => item.SpSalary);
    const roundOfSalaryArray = workplaceDataListAddSalary.map(item => item.roundOfSalary);

    console.log('SpSalaryArray', SpSalaryArray);
    console.log('roundOfSalaryArray', roundOfSalaryArray);

    const resultArraySumAddSalary = [];

    for (let i = 0; i < sumArraySumarrayAllHolioday.length; i++) {
        const calculatedValues = [];

        for (let j = 0; j < SpSalaryArray.length; j++) {
            const originalValue = parseInt(SpSalaryArray[j], 10);
            const roundOfSalary = roundOfSalaryArray[j];

            let calculatedValue;

            if (roundOfSalary === 'monthly') {
                calculatedValue = originalValue;
            } else if (roundOfSalary === 'daily') {
                calculatedValue = sumArraySumarrayAllHolioday[i] * originalValue;
            }

            calculatedValues.push(calculatedValue);
        }

        resultArraySumAddSalary.push(calculatedValues);
    }

    console.log('resultArraySum', resultArraySumAddSalary);

    console.log('resultAllSalaryEmp', resultAllSalaryEmp);

    console.log('sumarrayAllHoloday', sumarrayAllHoloday);

    console.log('sumArraySumarrayAllHolioday', sumArraySumarrayAllHolioday);


    // const arraytestEmpAddSalary = [[
    //     {
    //         name: "ค่าอาหาร",
    //         codeSpSalary: "2534",
    //         SpSalary: "100",
    //         roundOfSalary: "daily",
    //         StaffType: "all",
    //         nameType: "ทดลอง",
    //         _id: "656025d1fd5375965d5028a4"
    //     },
    //     {
    //         name: "ค่าตำแหน่ง",
    //         codeSpSalary: "4392",
    //         SpSalary: "800",
    //         roundOfSalary: "monthly",
    //         StaffType: "header",
    //         nameType: "",
    //         _id: "656025d1fd5375965d5028a6"
    //     }],
    // [{
    //     name: "ค่าเดินทาง",
    //     codeSpSalary: "1001",
    //     SpSalary: "1000",
    //     roundOfSalary: "monthly",
    //     StaffType: "all",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a3"
    // },
    // {
    //     name: "ค่าตำแหน่ง",
    //     codeSpSalary: "4392",
    //     SpSalary: "800",
    //     roundOfSalary: "monthly",
    //     StaffType: "header",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a6"
    // }],
    // [{
    //     name: "ค่าเดินทาง",
    //     codeSpSalary: "1001",
    //     SpSalary: "1000",
    //     roundOfSalary: "monthly",
    //     StaffType: "all",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a3"
    // },
    // {
    //     name: "ค่าอาหาร",
    //     codeSpSalary: "2534",
    //     SpSalary: "100",
    //     roundOfSalary: "daily",
    //     StaffType: "all",
    //     nameType: "ทดลอง",
    //     _id: "656025d1fd5375965d5028a4"
    // }],
    // [{
    //     name: "ค่าเดินทาง",
    //     codeSpSalary: "1001",
    //     SpSalary: "1000",
    //     roundOfSalary: "monthly",
    //     StaffType: "all",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a3"
    // },
    // {
    //     name: "ค่าอาหาร",
    //     codeSpSalary: "2534",
    //     SpSalary: "100",
    //     roundOfSalary: "daily",
    //     StaffType: "all",
    //     nameType: "ทดลอง",
    //     _id: "656025d1fd5375965d5028a4"
    // },
    // {
    //     name: "ค่าโทรศัพท์",
    //     codeSpSalary: "8467",
    //     SpSalary: "300",
    //     roundOfSalary: "daily",
    //     StaffType: "header",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a5"
    // }],
    // [{
    //     name: "ค่าเดินทาง",
    //     codeSpSalary: "1001",
    //     SpSalary: "1000",
    //     roundOfSalary: "monthly",
    //     StaffType: "all",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a3"
    // },
    // {
    //     name: "ค่าตำแหน่ง",
    //     codeSpSalary: "4392",
    //     SpSalary: "800",
    //     roundOfSalary: "monthly",
    //     StaffType: "header",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a6"
    // }],
    // [
    //     {
    //         name: "ค่าอาหาร",
    //         codeSpSalary: "2534",
    //         SpSalary: "100",
    //         roundOfSalary: "daily",
    //         StaffType: "all",
    //         nameType: "ทดลอง",
    //         _id: "656025d1fd5375965d5028a4"
    //     },
    //     {
    //         name: "ค่าโทรศัพท์",
    //         codeSpSalary: "8467",
    //         SpSalary: "300",
    //         roundOfSalary: "daily",
    //         StaffType: "header",
    //         nameType: "",
    //         _id: "656025d1fd5375965d5028a5"
    //     }],
    // [{
    //     name: "ค่าเดินทาง",
    //     codeSpSalary: "1001",
    //     SpSalary: "1000",
    //     roundOfSalary: "monthly",
    //     StaffType: "all",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a3"
    // },

    // {
    //     name: "ค่าโทรศัพท์",
    //     codeSpSalary: "8467",
    //     SpSalary: "300",
    //     roundOfSalary: "daily",
    //     StaffType: "header",
    //     nameType: "",
    //     _id: "656025d1fd5375965d5028a5"
    // }
    // ]
    // ];

    // const = workplaceDataList
    const yearThai = parseFloat(year, 10) + 543;
    // เริ่มฟังค์ชั่นpdf

    const generatePDFTest123 = (event) => {
        event.preventDefault();
        try {
            // Your code here
            // handleEmployeeFilter();
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });
            const table = tableRef.current;
            const fontPath = '/assets/fonts/THSarabunNew.ttf';

            doc.addFileToVFS(fontPath);
            doc.addFont(fontPath, 'THSarabunNew', 'normal');

            // Override the default stylestable for jspdf-autotable
            const stylestable = {
                font: 'THSarabunNew',
                fontStyle: 'normal',
                fontSize: 10,
            };

            // const arraytest = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5],
            // [1, 1, 1, 1, 1, 1, 1],
            // [1, 1, 1, 1, 1, 1, 1],
            // [1, 1, 1, 1, 1, 1, 1],
            // [1, 1, 1, 1, 1, 1, 1],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]];


            const arraytestSpSalary = [['', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0.5],
            [2, 2, 2, 2, 2, '', 2, '', 2],
            [2, '', 2, 2, '', 2, 3, '', 3, 3],
            [3, 3, 3, '', 3, 3, 3, 3],
            [3, '', 3, '', 3, 3, 3, 1, '', 1],
            [3, 3, '', 1, 1, '', 1, 3, 3],
            [3, 3, '', 3, '', 3, 3, 3, 3, '', 1, '', 1, 0.5, 0.5, 1.5],
            ];

            // const arraylistNameEmp = ['สมใจ', 'สมหมาย', 'สมมา', 'สมชาย', 'สมชัย','สมใจ', 'สมหมาย', 'สมมา', 'สมชาย', 'สมชัย','สมใจ', 'สมหมาย', 'สมมา', 'สมชาย', 'สมชัย','สมใจ', 'สมหมาย', 'สมมา', 'สมชาย', 'สมชัย', 'สนไหม'];
            // const arraylistNameEmp =
            //     [['ภัทรนก แซหว็อง', '612548', 'กะเช้า', 'กะดึก', '1001'],
            //     ['สมชาย ไม่มา', '165843', 'กะเช้า', 'กะดึก', '1201'],
            //     ['สมชาย ไม่อยู่', '162847', 'กะเช้า', 'กะดึก', '8401'],
            //     ['สมชาย กำลัง', '653298', 'กะเช้า', 'กะดึก', '1196'],
            //     ['สมชาย ไปริด', '7536241', 'กะเช้า', 'กะดึก', '2001'],
            //     ['สมชาย สมชาย', '999999', 'กะเช้า', 'กะดึก', '1921'],
            //     ['สมชาย ติดห', '1845270', 'กะเช้า', 'กะดึก', '1548'],
            //     ['สมชาย สมชาย', '1652305', 'กะเช้า', 'กะดึก', '1078'],
            //     ['สมชาย สมชาย', '9564832', 'กะเช้า', 'กะดึก', '1009'],
            //     ['สมชาย สมชาย', '1032568', 'กะเช้า', 'กะดึก', '1005']];


            const arraylistOT =
                [
                    parseFloat(workplaceList[0].dayoffRate),
                    parseFloat(workplaceList[0].holiday),
                    parseFloat(workplaceList[0].holidayOT)
                ];


            // const addSalaryWorkplace =
            //     [{
            //         name: "ค่าเดินทาง",
            //         codeSpSalary: "1001",
            //         SpSalary: "1000",
            //         roundOfSalary: "monthly",
            //         StaffType: "all",
            //         nameType: "",
            //         _id: "656025d1fd5375965d5028a3"
            //     },
            //     {
            //         name: "ค่าอาหาร",
            //         codeSpSalary: "2534",
            //         SpSalary: "100",
            //         roundOfSalary: "daily",
            //         StaffType: "all",
            //         nameType: "ทดลอง",
            //         _id: "656025d1fd5375965d5028a4"
            //     },
            //     {
            //         name: "ค่าโทรศัพท์",
            //         codeSpSalary: "8467",
            //         SpSalary: "300",
            //         roundOfSalary: "daily",
            //         StaffType: "header",
            //         nameType: "",
            //         _id: "656025d1fd5375965d5028a5"
            //     },
            //     {
            //         name: "ค่าตำแหน่ง",
            //         codeSpSalary: "4392",
            //         SpSalary: "800",
            //         roundOfSalary: "monthly",
            //         StaffType: "header",
            //         nameType: "",
            //         _id: "656025d1fd5375965d5028a6"
            //     },
            //     {
            //         name: "เบี้ยขยัน",
            //         codeSpSalary: "1358",
            //         SpSalary: "500",
            //         roundOfSalary: "monthly",
            //         StaffType: "all",
            //         nameType: "",
            //         _id: "656025d1fd5375965d5028a7"
            //     },
            //     ];
            // const arraylistNameEmp = ['สมใจ', 'สมหมาย', 'สมมา', 'สมชาย', 'สมชัย'];

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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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

                        doc.text("โอที " + cellText0, x + 46, y + 2.5 + (3.5 * 4), { align: 'center' }); // Use the entire cellText
                        doc.text("โอที " + cellText1, x + 46, y + 2.5 + (3.5 * 5), { align: 'center' }); // Use the entire cellText
                        doc.text("โอที " + cellText2, x + 46, y + 2.5 + (3.5 * 6), { align: 'center' }); // Use the entire cellText

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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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
            };
            // console.log('startXSpSalary:', startXSpSalary);
            // console.log('cellHeightSpSalary:', cellHeightSpSalary);

            // const startXSpSalary = 182; // Adjust the starting X-coordinate as needed
            // const startYSpSalary = 20; // Adjust the starting Y-coordinate as needed

            const drawTableSpSalary = (tableNumber) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColsSpSalary; j++) {
                        const x = startXSpSalary + j * cellWidthSpSalary + (cellWidthSpSalary * 8);
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
                        // drawCell(x, y, cellWidthSpSalary, cellHeight);
                        const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

                        if (i === 0) {
                            drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);

                        } else {
                            drawCell(x, y + cellHeight, cellWidthSpSalary, adjustedCellHeight);

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
            };
            const borderWidthMess = 0.5;
            const drawTableMess = (tableNumber, arraylistOT) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColsMess; j++) {
                        const x = startXMess + j * cellWidthMess;
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);

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
                let startYOT = 10;   // Adjust the starting Y-coordinate for the OT text
                const lineHeightOT = 10; // Adjust the vertical spacing between lines

                for (let k = 0; k < arraylistOT.length; k++) {
                    doc.text('โอที ' + arraylistOT[k], startXOT, startYOT);
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
            };
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
                        const x = startXSpSalary + j * cellWidthSpSalary + (cellWidthSpSalary * 8);
                        const y = startYTop + i * cellHeightTop;
                        drawCell(x, y, cellWidthSpSalary, cellHeightTop);
                    }
                }
            };
            const drawTableSpSalaryHeadTop = () => {
                for (let i = 0; i < numRowsTop; i++) {
                    for (let j = 0; j < numColsSpSalary - 2; j++) {
                        const x = (startXSpSalary + j * cellWidthSpSalary);
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
                const elementWidth = (element.toString().length * fontSize / doc.internal.scaleFactor);
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
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

                        if (textToDraw.length > 3) {
                            doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
                        } else {
                            doc.text(textToDraw, currentX + 1, 3 + currentY + i * verticalDistance, alignment);
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
                    let currentY = startY + (3.5 * 2);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

                        if (textToDraw.length > 3) {
                            doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
                        } else {
                            doc.text(textToDraw, currentX + 1, 3 + currentY + i * verticalDistance, alignment);
                        }
                        // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
                        // currentX += elementWidth + cellWidth; 
                        currentX += cellWidth;
                    }
                }
            };



            const drawArrayTextSumWorkAddSalary = (dataArray, sumArray, addSalaryWorkplace) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3;
                    let currentY = startY + i * verticalDistance + addmove;

                    const roundOfSalary = addSalaryWorkplace[i]?.roundOfSalary || ''; // Get roundOfSalary for the current index

                    // Check roundOfSalary and display the appropriate text
                    if (roundOfSalary === 'monthly') {
                        doc.text(addSalaryWorkplace[i].SpSalary, currentX + 2, 3 + currentY, { align: 'center' });
                    } else if (roundOfSalary === 'daily') {
                        // Calculate the product and convert it to a string
                        const product = (sumArray[i] * addSalaryWorkplace[i].SpSalary).toString();
                        doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                    } else {
                        // Handle other cases or set default text
                        doc.text('N/A', currentX + 2, 3 + currentY, { align: 'center' });
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
                const isHighlighted = holidayList.includes(currentNumber) || allDayOff.includes(currentNumber);

                // Draw a colored rectangle for each column
                if (isHighlighted) {
                    doc.setFillColor(255, 255, 0); // Set your desired color
                    doc.rect(currentX, currentY - cellHeight, cellWidth, (cellHeight * 8), 'F');
                }

                // Draw the text on top of the colored rectangle
                const textToDraw = dataArray[0].toString();
                const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

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
                    let currentY = startY + 3 + (cellHeight * 2);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        doc.text(dataArray[i][j].toString(), currentX + 2, 6 + currentY + i * verticalDistance, { align: 'left' });
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
                    let currentY = startY + (3 * 4);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 45, xOffset: 5 } : { align: 'left' };


                        doc.text(textToDraw, currentX + 2, 4 + currentY + i * verticalDistance, alignment);
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
                    let currentY = startY + (3 * 5);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 45, xOffset: 5 } : { align: 'left' };


                        doc.text(textToDraw, currentX + 2, 5 + currentY + i * verticalDistance, alignment);
                        // currentX += elementWidth + cellWidth; 
                        currentX += cellWidth;
                    }
                }
            };

            const drawArrayTextOTHoliday = (dataArray) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startX - 1;
                    let currentY = startY + (3 * 6);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        doc.text(dataArray[i][j].toString(), currentX + 2, 5 + currentY + i * verticalDistance, { align: 'left' });
                        // currentX += elementWidth + cellWidth; 
                        currentX += cellWidth;
                    }
                }
            };

            const drawArrayTextAddSalary = (dataArray) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
                    let currentY = startY + i * verticalDistance + addmove;

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        doc.text(dataArray[i][j].toString(), currentX + 2, 3 + currentY, { align: 'left' });
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
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 8);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArray[i] * countalldaywork).toString();

                    doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };


            const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 11);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

                    const position = addSalaryWorkplace.findIndex(
                        (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
                    );

                    doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };
            // ผลรวมวันทำงานวันหยุด
            const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 9);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoli[i] * (1.5 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoli[i].toString(), currentX + 2, 6.5 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };


            // นับเลขหัวตาราง

            const drawArrayNumHead = (dataArray, indexArray) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXNumHead + 3;
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (indexArray[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(indexArray[i].toString(), currentX + 2, currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };

            // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์

            const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 10);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoliday[i].toString(), currentX + 2, 10.5 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };
            // รวมช.ม.ทำงาน1.5
            const drawArrayTextSumWorkHoliday1q5 = (dataArray, sumArrayHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 10);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoliday[i].toString(), currentX + 2, 14 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };

            // รวมช.ม.ทำงาน2
            const drawArrayTextSumWorkHoliday2 = (dataArray, sumArrayHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 10);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoliday[i].toString(), currentX + 2, 17.5 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };

            // รวมช.ม.ทำงาน3
            const drawArrayTextSumWorkHoliday3 = (dataArray, sumArrayHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 10);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoliday[i].toString(), currentX + 2, 21 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };

            // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT
            const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 4);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayOTHoliday[i] * (3 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayOTHoliday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };


            // const drawArrayTextAddSalary = (dataArray) => {
            //     for (let i = 0; i < dataArray.length; i++) {
            //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
            //         let currentY = startY;

            //         for (let j = 0; j < dataArray[i].length; j++) {
            //             const item = dataArray[i][j];

            //             // Check if dataArray[i][j].name exists in addSalaryWorkplace
            //             const position = addSalaryWorkplace.findIndex(
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

            // const drawArrayTextAddSalary2 = (dataArray, addSalaryWorkplace, sumArraySumarrayAllHoloday) => {
            //     for (let i = 0; i < dataArray.length; i++) {
            //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
            //         let currentY = startY + addmove;

            //         for (let j = 0; j < dataArray[i].length; j++) {
            //             const item = dataArray[i][j];

            //             // Check if dataArray[i][j].name exists in addSalaryWorkplace
            //             const salaryItem = addSalaryWorkplace.find(salary => salary.name === item.name);

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
                            currentX + xAdjustment,  // Adjust the X-coordinate for the first row
                            yAdjustment + currentY + 3,  // Adjust the Y-coordinate for the second row
                            { align: 'left' }
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
            const title = 'บริษัท โอวาท โปร แอนด์ ควิก จำกัด';
            const subTitle = 'ใบแสดงเวลาปฏิบัติงาน'; // Replace with your desired subtitle text
            const TriTitle = 'หน่วยงาน ' + searchWorkplaceName; // Replace with your desired subtitle text

            const alldaywork = 'รวมวันทำงาน';
            const countalldaywork = '';

            const alldayworkHoliday = 'รวมชั่วโมงทำงาน';
            const countalldayworkHoliday = '';
            const workOt = '1.5';
            const workOt2 = '2';
            const workOt3 = '3';

            // if (daysInMonth === 28) {
            //     startXMess = 245.5;
            // } else if (daysInMonth === 29) {
            //     startXMess = 249.5;
            // } else if (daysInMonth === 30) {
            //     startXMess = 253.75;
            // } else if (daysInMonth === 31) {
            //     startXMess = 257.75;
            // };
            const countalldayworkX = '340';
            const countalldayworkY = '340';

            const startDay = 21;
            // Create an array from startDay to daysInMonth
            const firstPart = Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => startDay + index);

            // Create an array from 1 to 20
            const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

            // Concatenate the two arrays
            const resultArray = [...firstPart, ...secondPart];

            const spaceWidth = 10;

            const makePage = Math.ceil(arrayWorkNormalDay.length / 5);

            for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {


                doc.setFont('THSarabunNew');
                doc.setFontSize(16);
                const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const pageWidth = doc.internal.pageSize.getWidth();
                const titleX = (pageWidth - titleWidth) / 2;
                doc.text(title, titleX, 10);

                // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

                // doc.text(title, titleX, 30, { angle: 90 });

                doc.setFontSize(12); // You can adjust the font size for the subtitle
                const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const subTitleX = (pageWidth - subTitleWidth) / 2;
                doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

                doc.setFontSize(12); // You can adjust the font size for the subtitle
                const TriTitleWidth = doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
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
                const workplaceid = workplaceDataList.map(item => item.workplaceId);
                doc.text('แผนก ' + workplaceid, 250, 10);
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
                const pageEndIndexName = Math.min((pageIndex + 1) * 5, arrayWorkNormalDay.length);
                drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

                const squareColor = [255, 255, 0]; // Red
                doc.setFillColor(...squareColor);

                for (let i = 0; i < resultArray.length; i++) {
                    const currentNumber = resultArray[i];

                    if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
                        // Set loop position color
                        doc.rect(startX + i * cellWidth, startYTop, cellWidth - 0.2, cellHeightTop, 'F');
                    } else {
                        // Set default color or do nothing
                    }
                }

                for (let i = 0; i < resultArray.length; i++) {
                    const x = startX + i * cellWidth;
                    doc.text(resultArray[i].toString(), x + 1, cellHeightTop + startYTop - 2);
                }



                doc.text('ลำดับ', startXNumHead + 2, cellHeightTop + startYTop - 2);
                doc.text('ชื่อ - นามสกุล', startXLeftHead + 10, cellHeightTop + startYTop - 2);

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
                const period = 'งวดวันที่ 21 ' + thaiMonthNameLower + ' - 20 ' + thaiMonthName + ' พ.ศ. ' + yearThai;
                const periodWidth = doc.getStringUnitWidth(period) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const periodX = (pageWidth - periodWidth) / 2;
                doc.text(period, periodX, startYTop - 2); // Adjust the vertical position as needed
                // doc.text(period, (startXSpSalary - 10), startYTop - 2);
                doc.setFontSize(8);

                // doc.text('โอที', startXSpSalary + (cellWidthSpSalary * 2) + 3, startYTop + 3);
                // doc.text('สวัสดีการ', startXSpSalary + (cellWidthSpSalary * 5) + 3, startYTop + 3);

                // doc.text('หักประกันสังคม 5%', startXMess - 5, cellHeightTop + startYTop - 1, { angle: 90 });

                doc.text('หมายเหตุ', startXMess + 3, cellHeightTop + startYTop - 2);


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
                        doc.rect(startXSpSalary + (cellWidthSpSalary * 8), startYTop, (cellWidthSpSalary * numColsSpSalary) - 0.2, cellHeightTop, 'F');

                        doc.text(alldaywork + ' ' + countalldaywork, 5 + startXSpSalary + (cellWidthSpSalary * 8), 54.8, { angle: 90 });
                        doc.text(alldayworkHoliday + ' ' + countalldayworkHoliday, 5 + startXSpSalary + (cellWidthSpSalary * 9), 54.8, { angle: 90 });

                        doc.text('รวมชั่วโมงโอทีวันหยุด', 3 + startXSpSalary + (cellWidthSpSalary * 10), 54.8, { angle: 90 });
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

                        // doc.text(addSalaryWorkplace, 171, 54, { angle: 90 });
                        // addSalaryWorkplace.forEach((item, index) => {
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
                        drawTableLeftHead(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
                        drawTableNumHead(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
                        drawTableSpSalary(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
                        // drawTableMess(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
                        // drawArrayText(arraytest, dataIdx, dataIdx + 1);

                        // drawArrayText(arraytest.slice(dataIdx, dataIdx + 1));

                    }
                }
                // arrayAllTime

                // drawArrayText(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex));

                // drawArrayText(extractedDataAddSalary);
                // drawArrayTextAllTime

                drawArrayTextAllTime(arrayAllTime.slice(pageStartIndex, pageEndIndex));

                drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));

                drawArrayTextHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex));

                drawArrayTextHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex));
                drawArrayTextOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex));

                drawArrayNumHead(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), indexArray.slice(pageStartIndex, pageEndIndex));

                //วันเต็ม
                // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
                //วันหารชั่วโมง+สักอย่าง
                // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArraySumarrayAllHolioday.slice(pageStartIndex, pageEndIndex));

                //วันหารชั่วโมง //วันเต็มทั้งหมด
                drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), dividedArray.slice(pageStartIndex, pageEndIndex));

                // drawArrayTextSumWorkOT(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
                drawArrayTextSumWorkHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex), sumArrayAllTime.slice(pageStartIndex, pageEndIndex));
                drawArrayTextSumWorkHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTAllTime.slice(pageStartIndex, pageEndIndex));

                // 1.5
                drawArrayTextSumWorkHoliday1q5(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumHoliAllTime.slice(pageStartIndex, pageEndIndex));
                // 2
                drawArrayTextSumWorkHoliday2(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayHoliday.slice(pageStartIndex, pageEndIndex));
                // 3
                drawArrayTextSumWorkHoliday3(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex));
                // drawArrayTextSumWorkOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex));


                // resultArraySumAddSalary
                // drawArrayTextAddSalary(resultArraySumAddSalary.slice(pageStartIndex, pageEndIndex));

                // drawArrayTextSumWorkAddSalary(addSalaryWorkplace.slice(pageStartIndex, pageEndIndex));
                // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

                // drawArrayTextSumWorkTest(addSalaryWorkplace.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
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
                const formattedDate = workDate.toLocaleDateString('en-GB'); // Use 'en-GB' to get the "day/month/year" format

                doc.text(codePage + '' + formattedDate + '' + (pageIndex + 1) + ' of ' + makePage, 250, 210);

                if (pageIndex < makePage - 1) {
                    doc.addPage();

                }
                // doc.text('pageStartIndex', 10 + 10, 10 + 10 - 2);

                // doc.addPage();


            }
            // If an error occurs, throw an exception 
            // doc.save('your_table.pdf');
            const pdfContent = doc.output('bloburl');
            window.open(pdfContent, '_blank');
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
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });
            const table = tableRef.current;
            const fontPath = '/assets/fonts/THSarabunNew.ttf';

            doc.addFileToVFS(fontPath);
            doc.addFont(fontPath, 'THSarabunNew', 'normal');

            // Override the default stylestable for jspdf-autotable
            const stylestable = {
                font: 'THSarabunNew',
                fontStyle: 'normal',
                fontSize: 10,
            };


            const arraytestSpSalary = [['', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0.5],
            [2, 2, 2, 2, 2, '', 2, '', 2],
            [2, '', 2, 2, '', 2, 3, '', 3, 3],
            [3, 3, 3, '', 3, 3, 3, 3],
            [3, '', 3, '', 3, 3, 3, 1, '', 1],
            [3, 3, '', 1, 1, '', 1, 3, 3],
            [3, 3, '', 3, '', 3, 3, 3, 3, '', 1, '', 1, 0.5, 0.5, 1.5],
            ];

            // const arraylistOT =
            //     ['1.5', '2', '3'];
            // const arraylistOT = [
            //     workplaceList.dayoffRate,
            //     workplaceList.holiday,
            //     workplaceList.holidayOT
            // ];

            const arraylistOT =
                [
                    parseFloat(workplaceList[0].dayoffRate),
                    parseFloat(workplaceList[0].holiday),
                    parseFloat(workplaceList[0].holidayOT)
                ];

            console.log('arraylistOT', arraylistOT);


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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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
                    const product = (indexArray[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(indexArray[i].toString(), currentX + 2, currentY, { align: 'center' });
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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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

                        doc.text("โอที " + cellText0, x + 26, y - 1 + (3.5 * 4), { align: 'center' }); // Use the entire cellText
                        doc.text("โอที " + cellText1, x + 26, y - 1 + (3.5 * 5), { align: 'center' }); // Use the entire cellText
                        doc.text("โอที " + cellText2, x + 26, y - 1 + (3.5 * 6), { align: 'center' }); // Use the entire cellText

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
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
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
            const numColsSpSalary = 3 + 7 + 1;
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
            };
            // console.log('startXSpSalary:', startXSpSalary);
            // console.log('cellHeightSpSalary:', cellHeightSpSalary);

            // const startXSpSalary = 182; // Adjust the starting X-coordinate as needed
            // const startYSpSalary = 20; // Adjust the starting Y-coordinate as needed

            const drawTableSpSalary = (tableNumber) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColsSpSalary; j++) {
                        const x = startXSpSalary + j * cellWidthSpSalary;
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
                        // drawCell(x, y, cellWidthSpSalary, cellHeight);
                        const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

                        if (i === 0) {
                            drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);

                        } else {
                            drawCell(x, y + cellHeight, cellWidthSpSalary, adjustedCellHeight);

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
            };
            const borderWidthMess = 0.5;
            const drawTableMess = (tableNumber, arraylistOT) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColsMess; j++) {
                        const x = startXMess + j * cellWidthMess;
                        const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);

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
                let startYOT = 10;   // Adjust the starting Y-coordinate for the OT text
                const lineHeightOT = 10; // Adjust the vertical spacing between lines

                for (let k = 0; k < arraylistOT.length; k++) {
                    doc.text('โอที ' + arraylistOT[k], startXOT, startYOT);
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
            };

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
                        const x = startXSpSalary + j * cellWidthSpSalary;
                        const y = startYTop + i * cellHeightTop;
                        drawCell(x, y, cellWidthSpSalary, cellHeightTop);
                    }
                }
            };
            const drawTableSpSalaryHeadTop = () => {
                for (let i = 0; i < numRowsTop; i++) {
                    for (let j = 0; j < numColsSpSalary - 2; j++) {
                        const x = (startXSpSalary + j * cellWidthSpSalary);
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
                const elementWidth = (element.toString().length * fontSize / doc.internal.scaleFactor);
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
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

                        if (textToDraw.length > 3) {
                            doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
                        } else {
                            doc.text(textToDraw, currentX + 1, 3 + currentY + i * verticalDistance, alignment);
                        }
                        // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
                        // currentX += elementWidth + cellWidth; 
                        currentX += cellWidth;
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
                const isHighlighted = holidayList.includes(currentNumber) || allDayOff.includes(currentNumber);

                // Draw a colored rectangle for each column
                if (isHighlighted) {
                    doc.setFillColor(255, 255, 0); // Set your desired color
                    doc.rect(currentX, currentY - cellHeight, cellWidth, (cellHeight * 8), 'F');
                }

                // Draw the text on top of the colored rectangle
                const textToDraw = dataArray[0].toString();
                const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

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
                    let currentY = startY + (3 * 3);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        doc.text(dataArray[i][j].toString(), currentX + 2, 4 + currentY + i * verticalDistance, { align: 'left' });
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
                    let currentY = startY + (3 * 3);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 45, xOffset: 5 } : { align: 'left' };


                        doc.text(textToDraw, currentX + 2, 4 + currentY + i * verticalDistance, alignment);
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
                    let currentY = startY + (3 * 4);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();
                        const alignment = textToDraw.length > 3 ? { align: 'left', angle: 45, xOffset: 5 } : { align: 'left' };


                        doc.text(textToDraw, currentX + 2, 5 + currentY + i * verticalDistance, alignment);
                        // currentX += elementWidth + cellWidth; 
                        currentX += cellWidth;
                    }
                }
            };

            const drawArrayTextOTHoliday = (dataArray) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startX - 1;
                    let currentY = startY + (3 * 5);

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        doc.text(dataArray[i][j].toString(), currentX + 2, 5 + currentY + i * verticalDistance, { align: 'left' });
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
                    const product = (sumArray[i] * countalldaywork).toString();

                    doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };
            const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 3);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

                    const position = addSalaryWorkplace.findIndex(
                        (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
                    );

                    doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };
            // ผลรวมวันทำงานวันหยุด
            const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 1);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    // const product = (sumArrayHoli[i] * (1.5 * (countalldaywork / 8))).toString();
                    const product = (sumArrayHoli[i] * specialDayRate[i]).toString();

                    // responseDataAll

                    doc.text(sumArrayHoli[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                    doc.text(amountSpecialDay[i].toString(), currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };
            // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์

            const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 2);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayHoliday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };

            // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT
            const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
                for (let i = 0; i < dataArray.length; i++) {
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 4);
                    let currentY = startY + i * verticalDistance + addmove;

                    // Calculate the product and convert it to a string
                    const product = (sumArrayOTHoliday[i] * (3 * (countalldaywork / 8))).toString();

                    doc.text(sumArrayOTHoliday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
                    doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
                }
            };


            // const drawArrayTextAddSalary = (dataArray) => {
            //     for (let i = 0; i < dataArray.length; i++) {
            //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
            //         let currentY = startY;

            //         for (let j = 0; j < dataArray[i].length; j++) {
            //             const item = dataArray[i][j];

            //             // Check if dataArray[i][j].name exists in addSalaryWorkplace
            //             const position = addSalaryWorkplace.findIndex(
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
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
                    let currentY = startY + addmove;

                    for (let j = 0; j < dataArray[i].length; j++) {
                        const item = dataArray[i][j];

                        // Check if dataArray[i][j].name exists in addSalaryWorkplace
                        const position = addSalaryWorkplace.findIndex(
                            (salaryItem) => salaryItem.name === item.name
                        );

                        // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
                        const x = position !== -1 ? position : 0;

                        // If roundOfSalary is "daily", multiply SpSalary by the corresponding value in sumArray
                        // If roundOfSalary is "monthly", keep SpSalary as is
                        const adjustedSpSalary = item.roundOfSalary === 'daily' ? item.SpSalary * sumArray[i] : item.SpSalary;

                        const text = `${adjustedSpSalary}`;
                        doc.text(text, currentX + 2 + (cellWidthSpSalary * x), 3 + currentY + i * verticalDistance, { align: 'center' });
                        // currentX += cellWidthSpSalary;
                    }
                }
            };

            const drawArrayTextAddSalaryTestCount = (dataArray) => {
                for (let i = 0; i < dataArray.length; i++) {
                    // const arrayText = dataArray[i].join('      ');
                    // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
                    let currentY = startY + 3.7;

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();

                        // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

                        if (textToDraw.length > 3) {
                            doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, { align: 'center' });
                        } else {
                            doc.text(textToDraw, currentX + 1, 3 + currentY + i * verticalDistance, { align: 'center' });
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
                    let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
                    let currentY = startY + 3.7;

                    for (let j = 0; j < dataArray[i].length; j++) {
                        // const elementWidth = calculateElementWidth(dataArray[i][j]);
                        const textToDraw = dataArray[i][j].toString();

                        // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

                        if (textToDraw.length > 3) {
                            doc.text(textToDraw, currentX + 2, 6 + currentY + i * verticalDistance, { align: 'center' });
                        } else {
                            doc.text(textToDraw, currentX + 1, 6 + currentY + i * verticalDistance, { align: 'center' });
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
                            yAdjustment = 7;
                        }
                        doc.text(
                            dataArray[i][j].toString(),
                            // currentX + (j === 1 ? 0 : -10 || j === 0 ? -8 : 0 || j === 2 ? 5 : 0),  // Adjust the X-coordinate for the first row
                            // 3 + currentY + (j === 2 ? -3.5 : 0 || j === 3 ? -3.5 : 0),  // Adjust the Y-coordinate for the second row
                            currentX + xAdjustment,  // Adjust the X-coordinate for the first row
                            yAdjustment + currentY + 3,  // Adjust the Y-coordinate for the second row
                            { align: 'left' }
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
            const title = ' ใบลงเวลาการปฏิบัติงาน';
            const subTitle = 'ใบแสดงเวลาปฏิบัติงาน'; // Replace with your desired subtitle text
            const TriTitle = 'หน่วยงาน ' + searchWorkplaceName; // Replace with your desired subtitle text

            const alldaywork = 'รวมวันทำงาน';
            const countalldaywork = workplaceDataListWorkRate;

            const alldayworkHoliday = 'วันหยุด';
            const countalldayworkHoliday = workplaceDataListWorkRate;
            const workOt = '1.5';
            const workOt2 = '2';
            const workOt3 = '3';

            // if (daysInMonth === 28) {
            //     startXMess = 245.5;
            // } else if (daysInMonth === 29) {
            //     startXMess = 249.5;
            // } else if (daysInMonth === 30) {
            //     startXMess = 253.75;
            // } else if (daysInMonth === 31) {
            //     startXMess = 257.75;
            // };
            const countalldayworkX = '340';
            const countalldayworkY = '340';

            const startDay = 21;
            // Create an array from startDay to daysInMonth
            const firstPart = Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => startDay + index);

            // Create an array from 1 to 20
            const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

            // Concatenate the two arrays
            const resultArray = [...firstPart, ...secondPart];

            const spaceWidth = 10;

            // const makePage = Math.ceil(arrayWorkNormalDayOld.length / 5);
            const makePage = Math.ceil(newAllTimes.length / 5);

            for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {


                doc.setFont('THSarabunNew');
                doc.setFontSize(16);
                const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
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
                const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const subTitleX = (pageWidth - subTitleWidth) / 2;
                doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

                doc.setFontSize(12); // You can adjust the font size for the subtitle
                const TriTitleWidth = doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const TriTitleX = (pageWidth - TriTitleWidth) / 2;
                doc.text(TriTitle, TriTitleX, 20); // Adjust the vertical position as needed

                // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

                // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

                // doc.autoTable({
                //     html: table,
                //     styles: stylestable,
                //     margin: { top: 30 },
                // });

                const workplaceid = workplaceDataList.map(item => item.workplaceId);
                doc.text('แผนก ' + workplaceid, 250, 10);

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
                //     const rowData = arrayWorkNormalDayOld[i];
                //     const color = i % 2 === 0 ? [240, 240, 100] : [255, 255, 255]; // Alternate row colors

                //     drawArrayTextWithColor(rowData, color, i - pageStartIndex);

                // }

                const pageStartIndexName = pageIndex * 5;
                // const pageEndIndexName = Math.min((pageIndex + 1) * 5, arrayWorkNormalDayOld.length);
                const pageEndIndexName = Math.min((pageIndex + 1) * 5, newAllTimes.length);

                drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

                const squareColor = [255, 255, 0]; // Red
                doc.setFillColor(...squareColor);

                for (let i = 0; i < resultArray.length; i++) {
                    const currentNumber = resultArray[i];

                    if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
                        // Set loop position color
                        doc.rect(startX + i * cellWidth, startYTop, cellWidth - 0.2, cellHeightTop, 'F');
                    } else {
                        // Set default color or do nothing
                    }
                }

                for (let i = 0; i < resultArray.length; i++) {
                    const x = startX + i * cellWidth;
                    doc.text(resultArray[i].toString(), x + 1, cellHeightTop + startYTop - 2);
                }



                doc.text('ลำดับ', startXNumHead + 2, cellHeightTop + startYTop - 2);

                const period = 'งวดวันที่ 21 ' + thaiMonthNameLower + ' - 20 ' + thaiMonthName + ' พ.ศ. ' + yearThai;
                const periodWidth = doc.getStringUnitWidth(period) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                const periodX = (pageWidth - periodWidth) / 2;
                doc.text(period, periodX, startYTop - 2);

                doc.text('ชื่อ - นามสกุล', startXLeftHead + 10, cellHeightTop + startYTop - 2);
                doc.text('วันหยุด', startXSpSalary + 11, startYTop + 3);
                doc.text('โอที', startXSpSalary + (cellWidthSpSalary * 2) + 3, startYTop + 3);
                doc.text('สวัสดีการ', startXSpSalary + (cellWidthSpSalary * 5) + 3, startYTop + 3);

                doc.text('หักประกันสังคม 5%', startXMess - 5, cellHeightTop + startYTop - 1, { angle: 90 });

                doc.text('หมายเหตุ', startXMess + 3, cellHeightTop + startYTop - 2);


                // startXSpSalary + j * cellWidthSpSalary;
                // const y = startYTop

                for (let i = 0; i < 5; i++) {
                    const dataIdx = pageIndex * 5 + i;
                    // if (dataIdx < arrayWorkNormalDayOld.length) {
                    if (dataIdx < newAllTimes.length) {

                        // Set the color of the square (RGB values)
                        const squareColor = [255, 255, 0]; // Red

                        // Set the position where you want to place the square
                        const xPosition = 165.5;
                        const yPosition = 30;

                        // Set the fill color
                        doc.setFillColor(...squareColor);

                        // Draw a square with the specified size and color
                        doc.rect(startXSpSalary, startYTop, (cellWidthSpSalary * numColsSpSalary) - 0.2, cellHeightTop, 'F');

                        doc.text(alldaywork + ' ' + countalldaywork, 5 + startXSpSalary, 54.8, { angle: 90 });
                        doc.text(alldayworkHoliday + ' ' + countalldayworkHoliday, 5 + startXSpSalary + cellWidthSpSalary, 54.8, { angle: 90 });
                        doc.text('วันนักขัตฤกษ์' + ' ' + workOt2 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });
                        doc.text((workplaceDataListWorkRate * workOt2) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });

                        doc.text('โอที' + ' ' + workOt + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });
                        doc.text((workplaceDataListWorkRate * workOt) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });

                        doc.text('โอที' + ' ' + workOt3 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });
                        doc.text((workplaceDataListWorkRate * workOt3) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });

                        // doc.text(addSalaryWorkplace, 171, 54, { angle: 90 });
                        // addSalaryWorkplace.forEach((item, index) => {
                        //     const NameSp = `${item.name} ${item.SpSalary}`;
                        //     let roundOfSalaryText = '';

                        //     if (item.roundOfSalary === 'monthly') {
                        //         roundOfSalaryText = 'เดือน';
                        //     } else if (item.roundOfSalary === 'daily') {
                        //         roundOfSalaryText = 'วัน';
                        //     } doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
                        //     doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
                        // });

                        addSalaryWorkplace.sort((a, b) => a.name.localeCompare(b.name, 'th'));
                        console.log("addSalaryWorkplace", addSalaryWorkplace);
                        addSalaryWorkplace.forEach((item, index) => {
                            const NameSp = `${item.name} ${item.SpSalary}`;
                            const CodeSp = `${item.codeSpSalary}`;

                            let roundOfSalaryText = '';

                            if (item.roundOfSalary === 'monthly') {
                                roundOfSalaryText = 'เดือน';
                            } else if (item.roundOfSalary === 'daily') {
                                roundOfSalaryText = 'วัน';
                            }
                            doc.text(CodeSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 38, { align: 'center' });
                            doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
                            doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
                        });

                        drawTableTop();
                        drawTableTopHead();
                        drawTableLeftHeadTop();
                        drawTableNumHeadTop();
                        drawTableSpSalaryTop();
                        drawTableSpSalaryHeadTop();
                        drawTableMessTop();

                        // drawTableOT();
                        // drawTableOT(arraylistOT);

                        // drawTableOT(arraylistOT);

                        // for (let i = pageStartIndex; i < pageEndIndex; i++) {
                        // const rowData = arrayWorkNormalDayOld[i];
                        const rowData = newAllTimes[i];

                        // Draw text with color for each column
                        for (let j = 0; j < resultArray.length; j++) {
                            drawArrayTextWithColor([rowData[j]], j, i);
                        }
                        // }
                        // drawTable(i, arrayWorkNormalDayOld.slice(dataIdx, dataIdx + 1));
                        // drawTableLeftHead(i, arrayWorkNormalDayOld.slice(dataIdx, dataIdx + 1));
                        // drawTableNumHead(i, arrayWorkNormalDayOld.slice(dataIdx, dataIdx + 1));
                        // drawTableSpSalary(i, arrayWorkNormalDayOld.slice(dataIdx, dataIdx + 1));
                        // drawTableMess(i, arrayWorkNormalDayOld.slice(dataIdx, dataIdx + 1));
                        // drawArrayText(arraytest, dataIdx, dataIdx + 1);

                        drawTable(i, newAllTimes.slice(dataIdx, dataIdx + 1));
                        drawTableLeftHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
                        drawTableNumHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
                        drawTableSpSalary(i, newAllTimes.slice(dataIdx, dataIdx + 1));
                        drawTableMess(i, newAllTimes.slice(dataIdx, dataIdx + 1));

                        // drawArrayText(arraytest.slice(dataIdx, dataIdx + 1));

                    }
                }

                // drawArrayText(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex));
                drawArrayText(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex));

                //สวัสดิการ
                drawArrayTextAddSalaryTestCount(adjustedDailyExtractedDataAddSalaryCount.slice(pageStartIndex, pageEndIndex));
                drawArrayTextAddSalaryTest(adjustedDailyExtractedDataAddSalary.slice(pageStartIndex, pageEndIndex));

                //สวัสดิการ
                // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
                // drawArrayText(extractedDataAddSalary);

                drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));

                drawArrayTextHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex));

                drawArrayTextHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex));
                drawArrayTextOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex));
                // drawArrayTextOTHoliday(allTimes.slice(pageStartIndex, pageEndIndex));
                // drawArrayTextOTHoliday(otTimes.slice(pageStartIndex, pageEndIndex));

                // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

                // วันทำงาน
                // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOld.slice(pageStartIndex, pageEndIndex));
                drawArrayTextSumWork(newAllTimes.slice(pageStartIndex, pageEndIndex), sumArrayOld.slice(pageStartIndex, pageEndIndex));

                // ot 1.5
                // drawArrayTextSumWorkOT(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
                // drawArrayTextSumWorkOT(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayTotal.slice(pageStartIndex, pageEndIndex));
                drawArrayTextSumWorkOT(newAllTimes.slice(pageStartIndex, pageEndIndex), sumArrayTotal.slice(pageStartIndex, pageEndIndex));


                // วันหยุด เงินตรง
                drawArrayTextSumWorkHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex), sumArrayHoli.slice(pageStartIndex, pageEndIndex));

                drawArrayTextSumWorkHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayHoliday.slice(pageStartIndex, pageEndIndex));
                drawArrayTextSumWorkOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex));

                drawArrayNumHead(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), indexArray.slice(pageStartIndex, pageEndIndex));


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
            const pdfContent = doc.output('bloburl');
            window.open(pdfContent, '_blank');
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
        const upperDates = dates.filter(date => parseInt(date) <= 20);
        datesByEmployeeUpper[employeeId] = upperDates;
    }

    for (const employeeId in datesByEmployeeLower) {
        const dates = datesByEmployeeLower[employeeId];

        // Filter dates less than or equal to 20
        const lowerDates = dates.filter(date => parseInt(date) >= 21);
        datesByEmployeeLower[employeeId] = lowerDates;
    }
    console.log('datesByEmployeeUpper', datesByEmployeeUpper);
    console.log('datesByEmployeeLower', datesByEmployeeLower);


    function createArrayWithDates(datesArray, resultArray) {
        const newArray = resultArray.map(day => (datesArray.includes(day.toString()) ? day.toString() : ''));
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

    console.log('newDatesWork', newDatesWork);
    // Create new arrays for each employee
    const newDatesByEmployeeLower = {};
    // const newDatesByEmployeeUpper = {};

    for (const employeeId in newDatesWork) {
        const datesArrayLower = newDatesWork[employeeId];
        const newArrayLower = createArrayWithDates(datesArrayLower, resultArray);
        newDatesByEmployeeLower[employeeId] = newArrayLower;
    }

    // for (const employeeId in datesByEmployeeUpper) {
    //     const datesArrayUpper = datesByEmployeeUpper[employeeId];
    //     const newArrayUpper = createArrayWithDates(datesArrayUpper, resultArray);
    //     newDatesByEmployeeUpper[employeeId] = newArrayUpper;
    // }

    // console.log("Dates by Employee (Upper):", datesByEmployeeUpper);
    // console.log("Dates by Employee (Lower):", datesByEmployeeLower);

    console.log("New Dates by Employee (Lower):", newDatesByEmployeeLower);
    // console.log("New Dates by Employee (Upper):", newDatesByEmployeeUpper);

    console.log("Employee IDs:", employeeIds);
    console.log("Employee IDsLower:", employeeIdsLower);

    console.log("newDatesWork:", newDatesWork);


    console.log("desiredMonthLower:", desiredMonthLower);


    const handleStaffIdChange = (e) => {
        const selectWorkPlaceId = e.target.value;
        // setWorkplacrId(selectWorkPlaceId);
        // setSearchEmployeeId(selectWorkPlaceId);
        setSearchWorkplaceId(selectWorkPlaceId);
        // Find the corresponding employee and set the staffName
        const selectedWorkplace = workplaceListAll.find(workplace => workplace.workplaceId == selectWorkPlaceId);
        console.log('selectedWorkplace', selectedWorkplace);
        if (selectWorkPlaceId) {
            // setStaffName(selectedEmployee.name);
            // setStaffLastname(selectedEmployee.lastName);

            // setWorkplacrName(selectedWorkplace.workplaceName);
            setSearchWorkplaceName(selectedWorkplace.workplaceName);

        } else {
            // setWorkplacrName('');
            setSearchWorkplaceName('');

        }
    };

    const handleStaffNameChange = (e) => {
        const selectWorkplaceName = e.target.value;

        // Find the corresponding employee and set the staffId and staffName
        const selectedEmployee = workplaceListAll.find(workplace => workplace.workplaceName == selectWorkplaceName);
        const selectedEmployeeFName = workplaceListAll.find(workplace => workplace.workplaceName === selectWorkplaceName);

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


    return (
        // <div>
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบเงินเดือน</a></li>
                        <li class="breadcrumb-item active">ใบลงเวลาการปฏิบัติงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ใบลงเวลาการปฏิบัติงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
<!-- Main content --> */}

                    <section class="content">
                        <div class="row">
                            <div class="col-md-10">
                                <section class="Frame">
                                    <div class="col-md-12">
                                        <h2 class="title">ค้นหา</h2>
                                        <div class="col-md-12">
                                            {/* <form onSubmit={handleSearch}> */}
                                            <form >
                                                <div class="row">

                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchWorkplaceId">รหัสหน่วยงาน</label>
                                                            <input type="text" class="form-control" id="searchWorkplaceId"
                                                                placeholder="หน่วยงาน" value={searchWorkplaceId}
                                                                // onChange={(e) => setSearchWorkplaceId(e.target.value)}
                                                                onChange={handleStaffIdChange}
                                                                list="WorkplaceIdList"
                                                            />
                                                        </div>
                                                        <datalist id="WorkplaceIdList">
                                                            {workplaceListAll.map(workplace => (
                                                                <option key={workplace.workplaceId} value={workplace.workplaceId} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchWorkplaceName">ชื่อหน่วยงาน</label>
                                                            <input type="text" class="form-control" id="searchWorkplaceName"
                                                                placeholder="ชื่อหน่วยงาน" value={searchWorkplaceName}
                                                                // onChange={(e) => setSearchWorkplaceName(e.target.value)}
                                                                onChange={handleStaffNameChange}
                                                                list="WorkplaceNameList"
                                                            />
                                                        </div>
                                                        <datalist id="WorkplaceNameList">
                                                            {workplaceListAll.map(workplace => (
                                                                <option key={workplace.workplaceId} value={workplace.workplaceName} />
                                                            ))}
                                                        </datalist>
                                                    </div>
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
                                                            <label role="codePage">รหัสประดาษ</label>
                                                            <input type="text" class="form-control" id="codePage" placeholder="รหัสประดาษ" value={codePage} onChange={(e) => setCodePage(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="datetime">วันที่</label>
                                                            <div style=
                                                                {{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                                {/* <DatePicker id="datetime" name="datetime"
                                                                    className="form-control" // Apply Bootstrap form-control class
                                                                    popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                                    selected={workDate}
                                                                    onChange={handleWorkDateChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                // showMonthYearPicker
                                                                /> */}

                                                                <DatePicker
                                                                    className="form-control"
                                                                    selected={selectedThaiDate}
                                                                    onChange={handleThaiDateChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale={th}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div class="row">
                                                    <div class="col-md-12" style={{ marginTop: '5rem' }}>
                                                        <div class="form-group" style={{ position: 'absolute', bottom: '0' }}>
                                                            {/* <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button> */}
                                                            <br />
                                                            <button onClick={generatePDFTest123} type='button ' class="btn b_save"><i class="nav-icon fas fa-search"></i>พิมพ์รายงาน</button>
                                                            <button onClick={generatePDFTest123Old} style={{ marginLeft: '1rem', width: '10rem' }} class="btn b_save"><i class="nav-icon fas fa-search"></i>พิมพ์รายงานเก่า</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {/* <div class="d-flex justify-content-center">
                                                <h2 class="title">ผลลัพธ์ {result_data.length} รายการ</h2>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                {result_data.map(workplace => (
                                                                    <li
                                                                        key={workplace.employeeId}
                                                                        onClick={() => handleClickResult(workplace)}
                                                                    >
                                                                        รหัส {workplace.employeeId || ''} ชื่อพนักงาน {workplace.employeeName || ''}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </section>
                            </div>

                        </div>

                        <div class="row">
                            <div class="col-md-2">
                                {result_data.map((
                                    employeerecord) => (
                                    employeerecord.employeeId + ': ชื่อพนักงาน ' + employeerecord.employeeName)
                                )}
                            </div>
                        </div>
                        <br />

                        <div class="row">
                            <div class="col-md-2">
                                {result_data.map((
                                    employeerecord) => (
                                    '                ชื่อ :                   ' + employeerecord.employeeName)
                                )}
                            </div>
                            <div class="col-md-3">
                                {result_data.map((
                                    employeerecord) => (
                                        'ประจำเดือน ' + getMonthName(month)
                                        + 'ตั้งแต่วันที่ 21 ' + getMonthName(parseInt(month, 10) - 1)
                                        + ' ถึง 20 ' + getMonthName(month))
                                    + '  ' + (parseInt(employeerecord.timerecordId, 10) + 543)
                                )}
                            </div>
                        </div>
                        <br />



                    </section>
                    {/* <!-- /.content --> */}
                </div >
            </div >

            {/* {JSON.stringify(listDayOff,null,2)} */}

        </body >
    )
}

function getMonthName(monthNumber) {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    // Ensure the monthNumber is within a valid range (1-12)
    if (monthNumber >= 1 && monthNumber <= 12) {
        return months[monthNumber - 1]; // Months array is 0-based
    } else {
        // return 'Invalid Month';
        return months[12]; // Months array is 12 -based
    }
}

const getDateDayOfWeek = (dateString) => {
    // Create a Date object with the input date string in the format YYYY/mm/dd
    const date = new Date(dateString);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();
    // Return the day of the week (Sunday, Monday, etc.)
    // const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //overide
    const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7'];
    return daysOfWeek[dayOfWeek];
    // console.log('dayOfWeek',dayOfWeek);
};
// console.log('',getDateDayOfWeek);


export default TestPDFResultSalay