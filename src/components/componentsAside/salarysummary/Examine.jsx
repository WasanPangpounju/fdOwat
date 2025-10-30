// import React from 'react'
import endpoint from '../../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from '../EmployeesSelected';
import Calendar from 'react-calendar';
import '../../editwindowcss.css';
import EmployeeWorkDay from '../componentsetting/EmployeeWorkDay';

function examine() {

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


    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');

    const [searchResult, setSearchResult] = useState([]);
    const [searchResultLower, setSearchResultLower] = useState([]);

    const [alldaywork, setAlldaywork] = useState([]);
    const [alldayworkLower, setAlldayworkLower] = useState([]);

    const [timerecordAllList, setTimerecordAllList] = useState([]);
    const [employeeListResult, setEmployeeListResult] = useState([]);
    const [newWorkplace, setNewWorkplace] = useState(true);

    const [employeeList, setEmployeeList] = useState([]);
    const [workplaceList, setWorkplaceList] = useState([]);

    const [staffId, setStaffId] = useState(''); //รหัสหน่วยงาน
    const [staffName, setStaffName] = useState(''); //รหัสหน่วยงาน
    const [staffLastname, setStaffLastname] = useState(''); //รหัสหน่วยงาน
    const [staffFullName, setStaffFullName] = useState(''); //รหัสหน่วยงาน

    const [month, setMonth] = useState('01');
    const [year, setYear] = useState(new Date().getFullYear());

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
            // const response = await axios.post(endpoint + '/timerecord/listemp', data);
            // const responseLower = await axios.post(endpoint + '/timerecord/listemp', dataLower);
            const filteredEntries = timerecordAllList.filter(entry =>
                entry.employeeId === searchEmployeeId &&
                entry.month === month
                &&
                entry.timerecordId === year
            );
            const filteredEntriesLower = timerecordAllList.filter(entry =>
                entry.employeeId === searchEmployeeId &&
                entry.month === monthLower
                &&
                entry.timerecordId === timerecordIdLower
            );


            alert(filteredEntriesLower);


            setSearchResult(filteredEntries);
            setSearchResultLower(filteredEntriesLower);

            const entriesData = filteredEntries.map(entry =>
                entry.employee_workplaceRecord
                    .filter(record => record.date <= 20)
                    .map(record => ({
                        workplaceId: record.workplaceId,
                        dates: record.date,
                        allTimes: record.allTime,
                        otTimes: record.otTime,

                        startTime: record.startTime,
                        endTime: record.endTime,
                        selectotTime: record.selectotTime,
                        selectotTimeOut: record.selectotTimeOut,
                    }))
            );

            const entriesDataLower = filteredEntriesLower.map(entry =>
                entry.employee_workplaceRecord
                    .filter(record => record.date >= 21)
                    .map(record => ({
                        workplaceId: record.workplaceId,
                        dates: record.date,
                        allTimes: record.allTime,
                        otTimes: record.otTime,

                        startTime: record.startTime,
                        endTime: record.endTime,
                        selectotTime: record.selectotTime,
                        selectotTimeOut: record.selectotTimeOut,
                    }))
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
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);
            // alert(error);

            // window.location.reload();
        }
    }
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


    return (
        // <div>
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">

                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
                        <li class="breadcrumb-item active">ตรวจการทำงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตรวจการทำงาน</h1>
                            </div>
                        </div>
                    </div>
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ตรวจการทำงาน</h2>
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
                                                                {y}
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
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <table border="1" style={tableStyle}>
                                                <thead>
                                                    <tr>
                                                        <th style={headerCellStyle}>วันที่</th>
                                                        <th style={headerCellStyle}>หน่วงงาน</th>
                                                        <th style={headerCellStyle}>เวลาเข้า</th>
                                                        <th style={headerCellStyle}>เวลาออก</th>
                                                        <th style={headerCellStyle}>เวลาเข้า OT</th>
                                                        <th style={headerCellStyle}>เวลาออก OT</th>
                                                        <th style={headerCellStyle}>ชั่วโมงทำงาน</th>
                                                        <th style={headerCellStyle}>ชั่วโมง OT</th>
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

                                                    {/* {resultArray.map((value, index) => (
                                                        <tr key={index}>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {value}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                399-689
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                07.00
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                16.00
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                16.00
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                17.00
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                8
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                1
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                ลบ/แก้ไข
                                                            </td>
                                                        </tr>
                                                    ))} */}
                                                    {resultArrayWithWorkplaceRecords.map((workplaceRecord, index) => (
                                                        <tr key={index}>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {resultArray[index]}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.workplaceId}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.startTime}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.endTime}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.selectotTime}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.selectotTimeOut}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.allTimes}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {workplaceRecord.otTimes}
                                                            </td>
                                                            <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                <a href="https://example.com" class="link1" style={{ color: 'red' }}><b>ลบ</b></a> / <a href="https://example2.com" class="link2" style={{ color: 'blue' }}><b>แก้ไข</b></a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>

                                <div class="line_btn">
                                    {newWorkplace ? (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;สร้างหน่วยงานใหม่</button>
                                    ) : (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>

                                    )}
                                    <button class="btn clean"><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
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

export default examine