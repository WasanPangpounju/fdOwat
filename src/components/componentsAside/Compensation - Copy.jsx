import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';
import Calendar from 'react-calendar';
import '../editwindowcss.css';
import EmployeeWorkDay from './componentsetting/EmployeeWorkDay';
import Modal from 'react-modal';
import './salarysummary/styleCom.css';
Modal.setAppElement('#root'); // Set the root element for accessibility


function Compensation() {
    document.title = ' ตารางค่าตอบแทน';
    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
    };

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
    };

    const headerCellStyle = {
        ...cellStyle,
        backgroundColor: '#f2f2f2',
    };

    const [employeeId, setEmployeeId] = useState(''); //รหัสหน่วยงาน
    const [name, setName] = useState(''); //ชื่อหน่วยงาน
    const [lastName, setLastname] = useState(''); //ชื่อหน่วยงาน

    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน

    const [searchResult, setSearchResult] = useState([]);
    const [searchResultLower, setSearchResultLower] = useState([]);

    const [employeeListResult, setEmployeeListResult] = useState([]);
    const [newWorkplace, setNewWorkplace] = useState(true);
    const [timerecordAllList, setTimerecordAllList] = useState([]);

    const [employeeList, setEmployeeList] = useState([]);
    const [workplaceList, setWorkplaceList] = useState([]);
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [staffId, setStaffId] = useState(''); //รหัสหน่วยงาน
    const [staffName, setStaffName] = useState(''); //รหัสหน่วยงาน
    const [staffLastname, setStaffLastname] = useState(''); //รหัสหน่วยงาน
    const [staffFullName, setStaffFullName] = useState(''); //รหัสหน่วยงาน

    const [alldaywork, setAlldaywork] = useState([]);
    const [alldayworkLower, setAlldayworkLower] = useState([]);
    //   const [month, setMonth] = useState('');
    //   const [year, setYear] = useState('');
    const [month, setMonth] = useState('01');
    const [year, setYear] = useState(new Date().getFullYear());
    const [employee, setEmployee] = useState({});

    const thaiMonthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const getThaiMonthName = (monthNumber) => {
        return thaiMonthNames[monthNumber - 1];
    };

    useEffect(() => {
        setMonth("01");

        const currentYear = new Date().getFullYear();
        setYear(currentYear);
        const savedEmployeeId = localStorage.getItem('employeeId');
        const savedMonth = localStorage.getItem('month');
        const savedYear = localStorage.getItem('year');
        if (savedEmployeeId) {
            setSearchEmployeeId(savedEmployeeId);
            setStaffId(savedEmployeeId);
            const event = new Event('submit'); // Creating a synthetic event object
            handleSearch(event); // Call handleSearch with the event
        }
        if (savedMonth) {
            setMonth(savedMonth);
        }
        if (savedYear) {
            setYear(savedYear);
        }

    }, []); // Run this effect only once on component mount
    const EndYear = 2010;
    const currentYear = new Date().getFullYear(); // 2024
    const years = Array.from({ length: currentYear - EndYear + 1 }, (_, index) => EndYear + index).reverse();

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/employee/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setEmployeeList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // The empty array [] ensures that the effect runs only once after the initial render

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/workplace/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setWorkplaceList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    console.error('workplaceList', workplaceList);

    console.log(employeeList);


    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const [workTimeDayPerson, setWorkTimeDayPerson] = useState({
        // startDay: '',
        // endDay: '',
        allTimesPerson: [{ CodeSalary: '', positionWork: '', countPerson: '' }],
    });

    const [workTimeDayPersonList, setWorkTimeDayPersonList] = useState([]);

    // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // const shiftWork = ['Shift 1', 'Shift 2', 'Shift 3'];
    const positionWork = ['หัวหน้า', 'ทำความสะอาด', 'กวาดพื้น'];


    const handleInputPersonChange = (e) => {
        const { name, value } = e.target;

        setWorkTimeDayPerson((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleInputChangePerson = (e, index) => {
        const { name, value } = e.target;

        setWorkTimeDayPerson((prevData) => {
            const updatedAllTimesPerson = [...prevData.allTimesPerson];
            updatedAllTimesPerson[index] = {
                ...updatedAllTimesPerson[index],
                [name]: value,
            };
            return {
                ...prevData,
                allTimesPerson: updatedAllTimesPerson,
            };
        });

    };

    const handleAddTimePerson = () => {
        setWorkTimeDayPerson((prevData) => ({
            ...prevData,
            allTimesPerson: [...prevData.allTimesPerson, { CodeSalary: '', positionWork: '', countPerson: '' }],
        }));
    };


    const handleRemoveTimePerson = (indexToRemove) => {
        setWorkTimeDayPerson((prevData) => ({
            ...prevData,
            allTimesPerson: prevData.allTimesPerson.filter((_, index) => index !== indexToRemove),
        }));
    };


    const handleAddTimePersonList = () => {
        setWorkTimeDayPersonList((prevList) => [...prevList, workTimeDayPerson]);
        //xxss
        //clean data
        setWorkTimeDayPerson({
            // startDay: '',
            // endDay: '',
            allTimesPerson: [{ CodeSalary: '', positionWork: '', countPerson: '' }],
        });
    };

    const handleRemoveTimePersonList = (index) => {
        setWorkTimeDayPersonList((prevList) => {
            const updatedList = [...prevList];
            updatedList.splice(index, 1);
            return updatedList;
        });
    };

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/employee/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setEmployeeList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // The empty array [] ensures that the effect runs only once after the initial render

    console.log(employeeList);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/timerecord/listemp')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setTimerecordAllList(data);
                // alert(data[0].workplaceName);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const CheckMonth = parseInt(month, 10);
    const CheckYear = year;
    // const CheckMonth = 5;
    // const CheckYear = 2023;
    console.log('CheckMonth', CheckMonth);
    console.log('CheckYear', CheckYear);

    let countdownMonth;
    let countdownYear;

    if (CheckMonth === 1) {
        countdownMonth = 12;
        countdownYear = CheckYear - 1;
    } else {
        countdownMonth = CheckMonth - 1;
        countdownYear = CheckYear;

    }
    const base = 543;
    function getDaysInMonth(month, year) {
        // Months are 0-based, so we subtract 1 from the provided month
        const lastDayOfMonth = new Date(year, month, 0).getDate();
        return lastDayOfMonth;
    }

    const daysInMonth = getDaysInMonth(countdownMonth, CheckYear);
    const startDay = 21;
    // Create an array from startDay to daysInMonth
    const firstPart = Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => (startDay + index) + '/' + countdownMonth + '/' + (parseInt(countdownYear, 10) + parseInt(base, 10)));

    // Create an array from 1 to 20
    const secondPart = Array.from({ length: 20 }, (_, index) => index + 1 + '/' + CheckMonth + '/' + (parseInt(CheckYear, 10) + parseInt(base, 10)));

    // Concatenate the two arrays
    const resultArray = [...firstPart, ...secondPart];

    const firstPart2 = Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => (startDay + index));

    // Create an array from 1 to 20
    const secondPart2 = Array.from({ length: 20 }, (_, index) => index + 1);

    // Concatenate the two arrays
    const resultArray2 = [...firstPart2, ...secondPart2];

    console.log('resultArrayresultArray', resultArray);
    console.log('resultArrayresultArray2', resultArray2);


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
    const daysInCountdownMonth = getDaysInMonth2(countdownMonth, countdownYear);

    // const array1 = createDaysArray(CheckMonth, CheckYear, daysInMonth2, (day) => day <= 20);
    // const array2 = createDaysArray(countdownMonth, CheckYear, daysInCountdownMonth, (day) => day > 21);
    const array1 = createDaysArray(CheckMonth, CheckYear, daysInMonth2, (day) => day <= 20);
    const array2 = createDaysArray(countdownMonth, countdownYear, daysInCountdownMonth, (day) => day >= 21);


    console.log('Array 1 (March):', array1);
    console.log('Array 2 (Countdown):', array2);

    const commonNumbers = new Set([...array2.Mon, ...array1.Mon]);

    // const commonNumbers = [...new Set([...array1.Mon, ...array2.Mon])];
    console.log('commonNumbers', commonNumbers);


    let monthLower;
    let timerecordIdLower;
    // get value from form search
    if (month == "01") {
        monthLower = "12";
        timerecordIdLower = year - 1;
    } else {
        const monthNumber = parseInt(month, 10);
        monthLower = (monthNumber - 1).toString().padStart(2, '0');  // Convert back to string, pad with leading zero if needed
        // monthLower = month - 1;
        timerecordIdLower = year
    }
    monthLower
    console.log('monthLower', monthLower);
    console.log('month', month);
    console.log('year', year);
    console.log('timerecordIdLower', timerecordIdLower);

    const thaiMonthName = getThaiMonthName(parseInt(CheckMonth, 10));
    const thaiMonthLowerName = getThaiMonthName(parseInt(countdownMonth, 10));

    async function handleSearch(event) {
        event.preventDefault();

        const data = await {
            employeeId: searchEmployeeId,
            // name: searchEmployeeName,
            // employeeName: searchEmployeeName,
            month: month,
            timerecordId: year,

        };
        const dataLower = await {
            employeeId: searchEmployeeId,
            // name: searchEmployeeName,
            // employeeName: searchEmployeeName,
            month: monthLower,
            timerecordId: timerecordIdLower,
        };
        // alert(data.name);
        try {
            //get employee data
            await setEmployee(findEmployeeById(searchEmployeeId));

            // const response = await axios.post(endpoint + '/timerecord/listemp', data);
            // const responseLower = await axios.post(endpoint + '/timerecord/listemp', dataLower);
            const filteredEntries = timerecordAllList.filter(entry =>
                entry.employeeId === searchEmployeeId &&
                entry.month === month
                &&
                entry.timerecordId == year
            );
            const filteredEntriesLower = timerecordAllList.filter(entry =>
                entry.employeeId === searchEmployeeId &&
                entry.month === monthLower
                &&
                entry.timerecordId == timerecordIdLower
            );


            // alert(filteredEntriesLower);


            setSearchResult(filteredEntries);
            setSearchResultLower(filteredEntriesLower);

            // const entriesData = filteredEntries.map(entry =>
            //     entry.employee_workplaceRecord
            //         .filter(record => record.date <= 20)
            //         .map(record => ({
            //             workplaceId: record.workplaceId,
            //             dates: record.date,
            //             allTimes: record.allTime,
            //             otTimes: record.otTime,

            //             startTime: record.startTime,
            //             endTime: record.endTime,
            //             selectotTime: record.selectotTime,
            //             selectotTimeOut: record.selectotTimeOut,
            //         }))
            // );

            const entriesData = filteredEntries.map(entry =>
                entry.employee_workplaceRecord
                    .filter(record => record.date <= 20)
                    .map(record => {
                        const matchedWorkplace = workplaceList.find(workplace => workplace.workplaceId === record.workplaceId);
                        return {
                            workplaceId: record.workplaceId,
                            dates: record.date,
                            workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : '', // Default value if not found
                            workRate: matchedWorkplace ? matchedWorkplace.workRate : '', // Default value if not found
                            workRateOT: matchedWorkplace ? matchedWorkplace.workRateOT : '',
                            allTimes: record.allTime,
                            otTimes: record.otTime,
                            startTime: record.startTime,
                            endTime: record.endTime,
                            selectotTime: record.selectotTime,
                            selectotTimeOut: record.selectotTimeOut,
                        };
                    })
            );

            // console.log(entriesData);

            // const entriesDataLower = filteredEntriesLower.map(entry =>
            //     entry.employee_workplaceRecord
            //         .filter(record => record.date >= 21)
            //         .map(record => ({
            //             workplaceId: record.workplaceId,
            //             dates: record.date,
            //             allTimes: record.allTime,
            //             otTimes: record.otTime,

            //             startTime: record.startTime,
            //             endTime: record.endTime,
            //             selectotTime: record.selectotTime,
            //             selectotTimeOut: record.selectotTimeOut,
            //         }))
            // );

            const entriesDataLower = filteredEntriesLower.map(entry =>
                entry.employee_workplaceRecord
                    .filter(record => record.date >= 21)
                    .map(record => {
                        const matchedWorkplace = workplaceList.find(workplace => workplace.workplaceId === record.workplaceId);
                        return {
                            workplaceId: record.workplaceId,
                            dates: record.date,
                            workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : '', // Default value if not found
                            workRate: matchedWorkplace ? matchedWorkplace.workRate : '', // Default value if not found
                            workRateOT: matchedWorkplace ? matchedWorkplace.workRateOT : '',
                            allTimes: record.allTime,
                            otTimes: record.otTime,
                            startTime: record.startTime,
                            endTime: record.endTime,
                            selectotTime: record.selectotTime,
                            selectotTimeOut: record.selectotTimeOut,
                        };
                    })
            );

            setAlldaywork(entriesData);
            setAlldayworkLower(entriesDataLower);
            // alert(response.data.employees.length);

            if (response.data.employees.length < 1) {
                // window.location.reload();
                setEmployeeId('');
                setName('');
                setLastname('');
                alert('ไม่พบข้อมูล');

            } else {
                // alert(response.data.employees.length);

                //clean form 
                setSearchEmployeeId('');
                setSearchEmployeeName('');

                // Set search values
                setEmployeeId(response.data.employees[0].employeeId);
                setName(response.data.employees[0].name);
                setLastname(response.data.employees[0].lastName);

                // setSearchEmployeeId(response.data.employees[0].employeeId);
                // setSearchEmployeeName(response.data.employees[0].name);

                // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
                // console.log('workOfOT:', endTime);

            }
        } catch (error) {
            // alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);

            // alert(error);

            // window.location.reload();
        }

    }


    const findEmployeeById = (id) => {
        return employeeList.find(employee => employee.employeeId === id);
    };


    const [addSalaryDay, setAddSalaryDay] = useState(0);
    useEffect(() => {

        setAddSalaryDay(0);

        if (employee?.addSalary?.length > 0) {
            // alert(employee.addSalary.length);
            //cal addSalary day
            const ans = 0;
            for (let i = 0; i < employee.addSalary.length; i++) {
                // alert(employee.addSalary[i].roundOfSalary || '');
                let tmp = employee.addSalary[i].roundOfSalary || '';
                if (tmp == 'daily') {
                    // alert(employee.addSalary[i].SpSalary || 0);
                    let tmp1 = employee.addSalary[i].SpSalary || 0;
                    // alert(tmp1);
                    setAddSalaryDay(addSalaryDay + parseInt(employee.addSalary[i].SpSalary || 0));
                }
            }
            // setAddSalaryDay(ans);

        }

    }, [employee]);

    console.log('searchResult', searchResult);
    console.log('searchResultLower', searchResultLower);

    console.log('alldaywork', alldaywork);
    console.log('alldayworkLower', alldayworkLower);

    const allwork = [...alldayworkLower, ...alldaywork];
    console.log('allwork', allwork);

    const result = resultArray2.map((number) => {
        const matchingEntry = alldaywork.find((entry) => entry.dates === (number < 10 ? '0' + number : '' + number));

        if (matchingEntry) {
            return `${number}, workplaceId: '${matchingEntry.workplaceId}', allTimes: '${matchingEntry.allTimes}', otTimes: '${matchingEntry.otTimes}'`;
        } else {
            return `${number}, workplaceId: '', allTimes: '', otTimes: ''`;
        }
    });
    console.log('result', result);


    // Convert 'dates' to numbers
    // const allworkWithNumberDates = allwork.map(item => ({
    //     ...item,
    //     dates: parseInt(item.dates, 10)
    // }));
    const allworkFlattened = allwork.flat();

    console.log(allworkFlattened);

    // Filter unique entries based on 'workplaceId' and 'dates'
    const uniqueEntries = allworkFlattened.reduce((acc, curr) => {
        const key = `${curr.workplaceId}-${curr.dates}`;
        if (!acc[key]) {
            acc[key] = curr;
        }
        return acc;
    }, {});

    // Extract values from the object to get the final array
    const resultAllwork = Object.values(uniqueEntries);

    console.log('resultAllwork', resultAllwork);

    const resultArrayWithWorkplaceRecords = resultArray2.map(date => {
        const matchingRecord = resultAllwork.find(record => record.dates == date);
        return matchingRecord ? { ...matchingRecord } : '';
    });

    console.log('resultArrayWithWorkplaceRecords', resultArrayWithWorkplaceRecords);

    const combinedArray = resultArray.map((date, index) => {
        const workplaceRecord = resultArrayWithWorkplaceRecords[index];
        return [workplaceRecord, date];
    });

    console.log('combinedArray', combinedArray);

    const handleStaffIdChange = (e) => {
        const selectedStaffId = e.target.value;
        setStaffId(selectedStaffId);
        setSearchEmployeeId(selectedStaffId);
        // Find the corresponding employee and set the staffName
        const selectedEmployee = employeeList.find(employee => employee.employeeId === selectedStaffId);
        if (selectedEmployee) {
            // setStaffName(selectedEmployee.name);
            // setStaffLastname(selectedEmployee.lastName);
            setStaffFullName(selectedEmployee.name + ' ' + selectedEmployee.lastName);


        } else {
            setStaffName('');
            setStaffFullName('');
            setSearchEmployeeName('');
        }
    };

    const handleStaffNameChange = (e) => {
        const selectedStaffName = e.target.value;

        // Find the corresponding employee and set the staffId
        const selectedEmployee = employeeList.find(employee => (employee.name + " " + employee.lastName) === selectedStaffName);
        const selectedEmployeeFName = employeeList.find(employee => employee.name === selectedStaffName);

        if (selectedEmployee) {
            setStaffId(selectedEmployee.employeeId);
            setSearchEmployeeId(selectedEmployee.employeeId);
        } else {
            setStaffId('');
            // searchEmployeeId('');
        }

        // setStaffName(selectedStaffName);
        setStaffFullName(selectedStaffName);
        setSearchEmployeeName(selectedEmployeeFName);
    };


    const sumWorkRate = resultArrayWithWorkplaceRecords.reduce((accumulator, workplaceRecord) => {
        const workRateValue = parseFloat(workplaceRecord.workRate);
        return !isNaN(workRateValue) ? accumulator + workRateValue : accumulator;
    }, 0);
    const sumWorkRateOT = resultArrayWithWorkplaceRecords.reduce((accumulator, workplaceRecord) => {
        const workRateValue = parseFloat(workplaceRecord.workRate);//352
        const workRateOTValue = parseFloat(workplaceRecord.workRateOT);//1.5
        const workTimeValue = parseFloat(workplaceRecord.workOfHour);//8 work
        const workTimeOTValue = parseFloat(workplaceRecord.otTimes);//3 workot

        return !isNaN(workRateValue) ? accumulator + (((workRateValue / workTimeValue) * workRateOTValue) * workTimeOTValue) : accumulator;
    }, 0);

    const Compensation = ({ staffId, month, year }) => {
        setStaffId(staffId);
        setMonth(month);
        setYear(year);
    };

    const sumWorkRate1 = resultArrayWithWorkplaceRecords.reduce((accumulator, workplaceRecord) => {
        const workRateValue = parseFloat(workplaceRecord.workRate);
        if (!isNaN(workRateValue)) {
            accumulator.sum += workRateValue;
            accumulator.count++;
        }
        return accumulator;
    }, { sum: 0, count: 0 });

    console.log("Sum:", sumWorkRate.sum);
    console.log("Count:", sumWorkRate.count);

//edit data table
    const [formData, setFormData] = useState({ id: '', name: '', lastname: '' });
    const [dataTable, setDataTable] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const saveFormData = () => {
        if (editIndex !== null) {
          const updatedDataTable = dataTable.map((item, index) => {
            if (index === editIndex) {
              return formData;
            }
            return item;
          });
          setDataTable(updatedDataTable);
          setEditIndex(null);
        } else {
          setDataTable([...dataTable, formData]);
        }
        setFormData({ id: '', name: '', lastname: '' });
      };
    
      const editData = (index) => {
        setEditIndex(index);
        const { id, name, lastname } = dataTable[index];
        setFormData({ id, name, lastname });
      };
      
    return (
        // <div>
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">

                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
                        <li class="breadcrumb-item active">ตารางค่าตอบแทน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตารางค่าตอบแทน</h1>
                            </div>
                        </div>
                    </div>
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ตารางค่าตอบแทน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <form onSubmit={handleSearch}>
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
                                                        value={staffId == "null" ? '' : staffId }
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
                                                        {employeeList.map(employee => (
                                                            <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-6">
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
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label >ปี</label>
                                                    <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                                                        {years.map((y) => (
                                                            <option key={y} value={y}>
                                                                {y + 543}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-center">
                                            <button class="btn b_save" onClick={handleSearch()} ><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
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
                                                                รหัส {workplace.workplaceId} หน่วยงาน {workplace.workplaceName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </section>
                            <section class="Frame">
                                {staffFullName ? (
                                    <div class="row">
                                        <div class="col-md-12">
                                            ชื่อ: {staffFullName}
                                        </div>
                                    </div>) : (
                                    <div>
                                        {/* Content to show when staffFullName is not set */}
                                    </div>
                                )}

                                {/* {month ? (
                                    <div class="row">
                                        <div class="col-md-12">
                                            ตั้งแต่วันที่ 20 {thaiMonthLowerName} - 21 {thaiMonthName} ปี {year}
                                        </div>
                                    </div>) : (
                                    <div>
                                    </div>
                                )} */}

                                <div class="row">
                                    <div class="col-md-12">
                                        ตั้งแต่วันที่ 20 {thaiMonthLowerName} - 21 {thaiMonthName} ปี {parseInt(year, 10) + 543}
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <table border="1" style={tableStyle}>
                                                <thead>
                                                    <tr>
                                                        <th style={headerCellStyle}>วันที่</th>
                                                        <th style={headerCellStyle}>หน่วยงาน</th>
                                                        <th style={headerCellStyle}>ชั่วโมงทำงาน</th>
                                                        <th style={headerCellStyle}>ค่าจ้างปกติ</th>
                                                        <th style={headerCellStyle}>ชั่วโมง OT</th>
                                                        <th style={headerCellStyle}>ค่าล่วงเวลา OT</th>
                                                        <th style={headerCellStyle}>เงินเพิ่ม</th>
                                                        {/* <th style={headerCellStyle}>เงินหัก</th> */}
                                                        <th style={headerCellStyle}>แก้/ลบ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {resultArray.map((value, index) => (
                                             // <tr key={index}>
                                             //     <td>{resultArray{$index}}</td>
                                             // </tr>
                                             <tr key={index}>
                                                 <td style={cellStyle}>{value}</td>
                                             </tr>
                                         ))} */}

                                                    {/* {resultArray.map((value, index) => ( */}



                                                    {resultArrayWithWorkplaceRecords.map((workplaceRecord, index) => (

                                                        <tr key={index}>
                                                            {/* <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {value}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                399-689
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                8
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                350
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                1
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                65
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                1000
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>

                                                            </td> */}


                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {resultArray[index]}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.workplaceId}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.allTimes}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.workRate}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.otTimes}
                                                            </td>

                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {/* {(workplaceRecord.workRate / workplaceRecord.workOfHour) * workplaceRecord.workRateOT}({workplaceRecord.workRateOT}) */}
                                                                {!isNaN(workplaceRecord.workRate) && !isNaN(workplaceRecord.workOfHour) && !isNaN(workplaceRecord.workRateOT) && (
                                                                    `${((workplaceRecord.workRate / workplaceRecord.workOfHour) * workplaceRecord.workRateOT).toFixed(2)} (${workplaceRecord.workRateOT})`
                                                                )}
                                                            </td>
                                                            {workplaceRecord !== "" ? (
                                                                <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                    {(addSalaryDay / 30).toFixed(2)}
                                                                </td>
                                                            ) : (
                                                                <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                </td>
                                                            )}
                                                            {/* <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                            </td> */}
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                <a href="https://example.com" class="link1" style={{ color: 'red' }}><b>ลบ</b></a> / <a href="#" class="link2" style={{ color: 'blue' }} onClick={openModal}><b>แก้ไข</b></a>

                                                                {/* <button onClick={handleButtonClick}>แก้ไข</button> */}
                                                                {/* <button onClick={openModal}>แก้ไข</button> */}

                                                                <Modal
                                                                    isOpen={modalIsOpen}
                                                                    onRequestClose={closeModal}
                                                                    contentLabel="Example Modal"
                                                                    style={{
                                                                        overlay: {
                                                                            backgroundColor: 'rgba(100, 100, 100, 0.5)',
                                                                            zIndex: 10,
                                                                        },
                                                                        content: {
                                                                            width: '50rem',
                                                                            margin: 'auto',
                                                                            borderRadius: '8px',
                                                                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                                                                        },
                                                                    }}
                                                                >
                                                                    {/* Your form content goes here */}
                                                                    <form>
                                                                        {/* <label>
                                      Form Input:
                                      <input type="text" />
                                    </label>
                                    <button type="submit">Submit</button> */}
                                                                        {workTimeDayPerson.allTimesPerson.map((time, index) => (
                                                                            <div key={index} className="row">

                                                                                <div className="col-md-3">
                                                                                    <select
                                                                                        name="CodeSalary"
                                                                                        className="form-control"
                                                                                        value={time.CodeSalary}
                                                                                        onChange={(e) => handleInputChangePerson(e, index)}
                                                                                    >
                                                                                        <option value="">เลือกตำแหน่ง</option>

                                                                                        {positionWork.map((position, positionIndex) => (
                                                                                            <option key={positionIndex} value={position}>
                                                                                                {position}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>

                                                                                <div className="col-md-3">
                                                                                    <select
                                                                                        name="positionWork"
                                                                                        className="form-control"
                                                                                        value={time.positionWork}
                                                                                        onChange={(e) => handleInputChangePerson(e, index)}
                                                                                    >
                                                                                        <option value="">เลือกตำแหน่ง</option>

                                                                                        {positionWork.map((position, positionIndex) => (
                                                                                            <option key={positionIndex} value={position}>
                                                                                                {position}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                                <div className="col-md-3">
                                                                                    {/* <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Person ${index + 1}`}
                                                            value={time.countPerson}
                                                            onChange={(e) => handleInputChangePerson(e, index)}
                                                        /> */}
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder={`Person ${index + 1}`}
                                                                                        name="countPerson" // Make sure the name attribute is set to "countPerson"
                                                                                        value={time.countPerson}
                                                                                        onChange={(e) => handleInputChangePerson(e, index)}
                                                                                    />

                                                                                </div>
                                                                                <div class="col-md-2">
                                                                                    {index >= 1 ? (
                                                                                        <button type='button'
                                                                                            onClick={() => handleRemoveTimePerson(index)}
                                                                                            style={{ width: '2.5rem' }}
                                                                                            className="btn btn-danger ml-auto"

                                                                                        >
                                                                                            ลบ
                                                                                        </button>
                                                                                    ) : (

                                                                                        <>
                                                                                            <button type="button" aria-label="เพิ่ม"
                                                                                                onClick={handleAddTimePerson} className="btn btn-primary" style={{ width: '2.5rem' }}>
                                                                                                <i className="fa">&#xf067;</i>
                                                                                            </button>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <br />
                                                                                <br />
                                                                                <br />

                                                                            </div>
                                                                        ))}
                                                                        <button type="button" onClick={closeModal}>
                                                                            Close
                                                                        </button>
                                                                    </form>
                                                                </Modal>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td style={cellStyle}>สรุป</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={cellStyle}>{sumWorkRate}</td>
                                                        <td></td>
                                                        <td style={cellStyle}>{sumWorkRateOT.toFixed(2)}</td>
                                                        <td style={cellStyle}>{(sumWorkRate1.count * (addSalaryDay / 30)).toFixed(2)}</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <br />

                                        </div>

                                    </div>
                                </div>

                                <div class="line_btn">
                                    {newWorkplace ? (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                    ) : (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึกx</button>

                                    )}
                                    <button class="btn clean"><i class="far fa-window-close"></i> &nbsp;ถัดไป</button>
                                </div>
                                {/* {JSON.stringify(employee.addSalary,null,2)} */}
                            </section>
                        </div>
                    </section>
                </div>
            </div>
        </body>
        // </div>  )
    )
}
export default Compensation