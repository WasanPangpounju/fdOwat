import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';

function AddsettimeOutsiderEmployee() {

    const bordertable = {
        borderLeft: '2px solid #000'
    };

    const [newWorkplace, setNewWorkplace] = useState(true);

    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [month, setMonth] = useState('');

    useEffect(() => {
        setMonth("01");
    }, []);

    const options = [];

    for (let i = 1; i <= 31; i++) {
        // Use padStart to add leading zeros to numbers less than 10
        const formattedValue = i.toString().padStart(2, '0');
        options.push(<option key={i} value={formattedValue}>{formattedValue}</option>);
    }

    //Workplace data
    const [employeeId, setEmployeeId] = useState(''); //รหัสหน่วยงาน
    const [name, setName] = useState(''); //ชื่อหน่วยงาน
    const [workplacestay, setWorkplacestay] = useState(''); //สังกัด
    const [workplaceArea, setWorkplaceArea] = useState(''); //สถานที่ปฏิบัติงาน
    const [workOfWeek, setWorkOfWeek] = useState(''); //วันทำงานต่อสัปดาห์
    const [workStart1, setWorkStart1] = useState(''); //เวลาเริ่มกะเช้า
    const [workEnd1, setWorkEnd1] = useState(''); //เวลาออกกะเช้า
    const [workStart2, setWorkStart2] = useState(''); //เวลาเข้ากะบ่าย
    const [workEnd2, setWorkEnd2] = useState(''); //เวลาออกกะบ่าย
    const [workStart3, setWorkStart3] = useState(''); //เวลาเข้ากะเย็น
    const [workEnd3, setWorkEnd3] = useState(''); //เวลาออกกะเย็น
    const [workOfHour, setWorkOfHour] = useState(''); //ชั่วโมงทำงานต่อสัปดาห์
    const [workOfOT, setWorkOfOT] = useState(''); //ชั่วโมง OT ต่อสัปดาห์

    const [workRate, setWorkRate] = useState(''); //ค่าจ้างต่อวัน
    const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
    const [workTotalPeople, setWorkTotalPeople] = useState(''); //จำนวนคนในหน่วยงาน
    const [workRateDayoff, setWorkRateDayoff] = useState(''); //ค่าจ้างวันหยุด ต่อวัน
    const [workRateDayoffHour, setWorkRateDayoffHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง
    const [workplaceAddress, setWorkplaceAddress] = useState(''); //ที่อยู่หน่วยงาน

    //////////////////////////////
    const [employeeList, setEmployeeList] = useState([]);
    const [workplaceList, setWorkplaceList] = useState([]);

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/workplace/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setWorkplaceList(data);
                // alert(data[0].workplaceName);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // The empty array [] ensures that the effect runs only once after the initial render

    console.log(workplaceList);

    //search employee name by employeeId
    // console.log(workplaceList);
    // console.log(workplaceList);



    /////////////////////////////////////////////
    const [wId, setWId] = useState('');
    const [wName, setWName] = useState('');
    const [wDate, setWDate] = useState('');
    const [wShift, setWShift] = useState('');
    const [wStartTime, setWStartTime] = useState('');
    const [wEndTime, setWEndTime] = useState('');
    const [wAllTime, setWAllTime] = useState('');
    const [wOtTime, setWOtTime] = useState('');
    const [wSelectOtTime, setWSelectOtTime] = useState('');
    const [wSelectOtTimeout, setWSelectOtTimeout] = useState('');


    // This useEffect listens for changes in wShift
    useEffect(() => {
        if (wId !== '' && wName !== '') {
            const workplacesearch = workplaceList.find(workplace => workplace.workplaceId === wId);
            if (workplacesearch) {
                switch (wShift) {
                    case 'morning_shift':
                        setWStartTime(workplacesearch.workStart1 || '');
                        setWEndTime(workplacesearch.workEnd1 || '');
                        setWAllTime(calTime(workplacesearch.workStart1 || '', workplacesearch.workEnd1 || '', workplacesearch.workOfHour) || '');
                        setWOtTime(calTime(workplacesearch.workStartOt1 || '', workplacesearch.workEndOt1 || '', workplacesearch.workOfOT || '') || '');
                        setWSelectOtTime(workplacesearch.workStartOt1 || '');
                        setWSelectOtTimeout(workplacesearch.workEndOt1 || '');
                        break;
                    case 'afternoon_shift':
                        setWStartTime(workplacesearch.workStart2 || '');
                        setWEndTime(workplacesearch.workEnd2 || '');
                        setWAllTime(calTime(workplacesearch.workStart2 || '', workplacesearch.workEnd2 || '', workplacesearch.workOfHour) || '');
                        setWOtTime(calTime(workplacesearch.workStartOt2 || '', workplacesearch.workEndOt2 || '', workplacesearch.workOfOT || '') || '');
                        setWSelectOtTime(workplacesearch.workStartOt2 || '');
                        setWSelectOtTimeout(workplacesearch.workEndOt2 || '');
                        break;
                    case 'night_shift':
                        setWStartTime(workplacesearch.workStart3 || '');
                        setWEndTime(workplacesearch.workEnd3 || '');
                        setWAllTime(calTime(workplacesearch.workStart3 || '', workplacesearch.workEnd3 || '', workplacesearch.workOfHour) || '');
                        setWOtTime(calTime(workplacesearch.workStartOt3 || '', workplacesearch.workEndOt3 || '', workplacesearch.workOfOT || '') || '');
                        setWSelectOtTime(workplacesearch.workStartOt3 || '');
                        setWSelectOtTimeout(workplacesearch.workEndOt1 || '');

                        break;
                    default:
                        setWStartTime('');
                        setWEndTime('');
                        setWAllTime('');
                        setWOtTime('');
                        setWSelectOtTime('');
                        setWSelectOtTimeout('');
                }
            }

        }


    }, [wShift]);


    //calculate time of work
    useEffect(() => {
        if (wStartTime !== '' && wEndTime !== '') {
            if (wId !== '' && wName !== '') {
                const workplacesearch = workplaceList.find(workplace => workplace.workplaceId === wId);
                if (workplacesearch) {
                    setWAllTime(calTime(wStartTime || '', wEndTime || '', workplacesearch.workOfHour || ''));
                }
            }

        } else {
            setWAllTime(0);
        }
    }, [wStartTime, wEndTime]);


    useEffect(() => {
        if (wSelectOtTime !== '' && wSelectOtTimeout !== '') {
            if (wId !== '' && wName !== '') {
                const workplacesearch = workplaceList.find(workplace => workplace.workplaceId === wId);
                if (workplacesearch) {
                    setWOtTime(calTime(wSelectOtTime || '', wSelectOtTimeout || '', workplacesearch.workOfOT || ''));
                }
            }

        } else {
            setWOtTime(0);
        }
    }, [wSelectOtTime, wSelectOtTimeout])


    //search employee Name by employeeId 
    useEffect(() => {
        if (wId !== '') {
            const workplacesearch = workplaceList.find(workplace => workplace.workplaceId === wId);
            if (workplacesearch) {
                setWName(workplacesearch.workplaceName);
            } else {
                setWName('');
            }


        }

    }, [wId]);

    //search employeeId by employeeName 
    useEffect(() => {
        //Search Employee  by name
        if (wName != '') {
            const workplacesearch = workplaceList.find(workplace => workplace.workplaceName === wName);
            if (workplacesearch) {
                setWId(workplacesearch.workplaceId);
            } else {
                setWId('');
            }
            console.log(workplacesearch);

        }
    }, [wName]);



    // const numberOfRows2 = 30; // Fixed number of rows
    const numberOfRows2 = 1; // Fixed number of rows

    const initialRowData2 = {
        workplaceId: '',
        workplaceName: '',
        date: '', // Use null as initial value for DatePicker
        shift: 'morning_shift',
        startTime: '',
        endTime: '',
        allTime: '',
        otTime: '',
        selectotTime: '',
        selectotTimeOut: '',
    };

    const [rowDataList2, setRowDataList2] = useState(new Array(numberOfRows2).fill(initialRowData2));

    const handleFieldChange2 = (index2, fieldName2, value) => {
        setRowDataList2(prevDataList => {
            const newDataList2 = [...prevDataList];
            newDataList2[index2] = {
                ...newDataList2[index2],
                [fieldName2]: value,
            };


            //Search workplace by id
            if (fieldName2 == 'workplaceId') {
                const workplaceIdSearch = workplaceList.find(workplace => workplace.workplaceId === value);
                //                 alert(JSON.stringify(workplaceList, null, 2));
                // alert( workplaceList.length);
                if (workplaceIdSearch) {
                    //   setEmployeeName(employee.name);
                    newDataList2[index2] = {
                        ...newDataList2[index2],
                        ['workplaceName']: workplaceIdSearch.workplaceName + '',
                        ['shift']: 'morning_shift',
                        ['startTime']: workplaceIdSearch.workStart1 + '',
                        ['endTime']: workplaceIdSearch.workEnd1 + '',
                        ['allTime']: workplaceIdSearch.workOfHour + '',
                        ['otTime']: workplaceIdSearch.workOfOT + '',
                        ['selectotTime']: workplaceIdSearch.workStartOt1 + '',
                        ['selectotTimeOut']: workplaceIdSearch.workEndOt1 + '',
                    };
                } else {
                    //   setEmployeeName('Employee not found');
                    newDataList2[index2] = {
                        ...newDataList2[index2],
                        ['workplaceName']: 'ไม่พบชื่อหน่วยงาน',
                    };
                }
            }

            //Search workplace by name
            if (fieldName2 == 'workplaceName') {
                const workplaceNameSearch = workplaceList.find(workplace => workplace.workplaceName === value);
                //                 alert(JSON.stringify(workplaceList, null, 2));
                // alert( workplaceList.length);
                if (workplaceNameSearch) {
                    //   setEmployeeName(employee.name);
                    newDataList2[index2] = {
                        ...newDataList2[index2],
                        ['workplaceId']: workplaceNameSearch.workplaceId + '',
                    };
                } else {
                    //   setEmployeeName('Employee not found');
                    newDataList2[index2] = {
                        ...newDataList2[index2],
                        ['workplaceId']: 'ไม่พบรหัสหน่วยงาน',
                    };
                }
            }


            //Select shift then set time of work 
            if (fieldName2 == 'shift') {
                // alert(value);
                //Check Selected workplace by workplaceId is notnull
                if (newDataList2[index2].workplaceId !== '') {
                    // alert(newDataList2[index2].workplaceId );
                    //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
                    const workplaceIdSearch = workplaceList.find(workplace => workplace.workplaceId === newDataList2[index2].workplaceId);
                    if (workplaceIdSearch) {
                        //check shift by switch case
                        switch (value) {
                            case 'morning_shift':
                                newDataList2[index2] = {
                                    ...newDataList2[index2],
                                    ['startTime']: workplaceIdSearch.workStart1 || '' + '',
                                    ['endTime']: workplaceIdSearch.workEnd1 || '' + '',
                                    ['allTime']: calTime(workplaceIdSearch.workStart1 || '', workplaceIdSearch.workEnd1 || '', workplaceIdSearch.workOfHour || '') || '' + '',
                                    ['otTime']: calTime(workplaceIdSearch.workStartOt1 || '', workplaceIdSearch.workEndOt1 || '', workplaceIdSearch.workOfOT || '') || '' + '',
                                    ['selectotTime']: workplaceIdSearch.workStartOt1 || '' + '',
                                    ['selectotTimeOut']: workplaceIdSearch.workEndOt1 || '' + '',
                                };
                                break;
                            case 'afternoon_shift':
                                newDataList2[index2] = {
                                    ...newDataList2[index2],
                                    ['startTime']: workplaceIdSearch.workStart2 || '' + '',
                                    ['endTime']: workplaceIdSearch.workEnd2 || '' + '',
                                    ['allTime']: calTime(workplaceIdSearch.workStart2 || '', workplaceIdSearch.workEnd2 || '', workplaceIdSearch.workOfHour || '') || '' + '',
                                    ['otTime']: calTime(workplaceIdSearch.workStartOt2 || '', workplaceIdSearch.workEndOt2 || '', workplaceIdSearch.workOfOT || '') || '' + '',
                                    ['selectotTime']: workplaceIdSearch.workStartOt2 || '' + '',
                                    ['selectotTimeOut']: workplaceIdSearch.workEndOt2 || '' + '',
                                };
                                break;
                            case 'night_shift':
                                newDataList2[index2] = {
                                    ...newDataList2[index2],
                                    ['startTime']: workplaceIdSearch.workStart3 || '' + '',
                                    ['endTime']: workplaceIdSearch.workEnd3 || '' + '',
                                    ['allTime']: calTime(workplaceIdSearch.workStart3 || '', workplaceIdSearch.workEnd3 || '', workplaceIdSearch.workOfHour || '') || '' + '',
                                    ['otTime']: calTime(workplaceIdSearch.workStartOt3 || '', workplaceIdSearch.workEndOt3 || '', workplaceIdSearch.workOfOT || '') || '' + '',
                                    ['selectotTime']: workplaceIdSearch.workStartOt3 || '' + '',
                                    ['selectotTimeOut']: workplaceIdSearch.workEndOt3 || '' + '',
                                };
                                break;
                            default:
                                newDataList2[index2] = {
                                    ...newDataList2[index2],
                                    ['startTime']: '',
                                    ['endTime']: '',
                                    ['allTime']: '',
                                    ['otTime']: '',
                                    ['selectotTime']: '',
                                    ['selectotTimeOut']: '',
                                };
                        } //end switch
                    }


                } else {
                    //emty workplaceId 
                    newDataList2[index2] = {
                        ...newDataList2[index2],
                        ['workplaceId']: 'กรุณาระบุหน่วยงาน',
                        ['workplaceName']: 'กรุณาระบุหน่วยงาน',
                    };
                }
            }

            //update time of work 
            if ((fieldName2 == 'startTime') ||
                (fieldName2 == 'endTime') ||
                (fieldName2 == 'selectotTime') ||
                (fieldName2 == 'selectotTimeOut')
            ) {
                //Check Selected workplace by workplaceId is notnull
                if (newDataList2[index2].workplaceId !== '') {
                    // alert(newDataList2[index2].workplaceId );
                    //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
                    const workplaceIdSearch = workplaceList.find(workplace => workplace.workplaceId === newDataList2[index2].workplaceId);
                    if (workplaceIdSearch) {
                        //check specialt_shift 
                        if (newDataList2[index2].shift !== 'specialt_shift') {
                            newDataList2[index2] = {
                                ...newDataList2[index2],
                                ['startTime']: newDataList2[index2].startTime + '',
                                ['endTime']: newDataList2[index2].endTime + '',
                                ['allTime']: calTime(newDataList2[index2].startTime, newDataList2[index2].endTime, workplaceIdSearch.workOfHour) + '',
                                ['otTime']: calTime(newDataList2[index2].selectotTime, newDataList2[index2].selectotTimeOut, workplaceIdSearch.workOfOT) + '',
                                ['selectotTime']: newDataList2[index2].selectotTime + '',
                                ['selectotTimeOut']: newDataList2[index2].selectotTimeOut + '',
                            };
                        } else {
                            newDataList2[index2] = {
                                ...newDataList2[index2],
                                ['startTime']: newDataList2[index2].startTime + '',
                                ['endTime']: newDataList2[index2].endTime + '',
                                ['allTime']: calTime(newDataList2[index2].startTime, newDataList2[index2].endTime, 24) + '',
                                ['otTime']: calTime(newDataList2[index2].selectotTime, newDataList2[index2].selectotTimeOut, 24) + '',
                                ['selectotTime']: newDataList2[index2].selectotTime + '',
                                ['selectotTimeOut']: newDataList2[index2].selectotTimeOut + '',
                            };
                        }

                    } else {
                        //emty workplaceId 
                        newDataList2[index2] = {
                            ...newDataList2[index2],
                            ['workplaceId']: 'กรุณาระบุหน่วยงาน',
                            ['workplaceName']: 'กรุณาระบุหน่วยงาน',
                        };
                    }

                }

            }

            return newDataList2;
        });
    };


    function calTime(start, end, limit) {

        const startHours = parseFloat(start.split('.')[0]);
        const startMinutes = parseFloat(start.split('.')[1] || 0);
        const endHours = parseFloat(end.split('.')[0]);
        const endMinutes = parseFloat(end.split('.')[1] || 0);
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
        //check employee working >= 5 hours 
        if (hours >= 5) {
            hours -= 1;
        }

        // Calculate the total time difference in minutes
        const totalMinutes = hours * 60 + minutes;
        // check employee working > 5 hours
        // Cap the time difference at the maximum work hours
        const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);
        // Convert the capped time difference back to hours and minutes
        const cappedHours = Math.floor(cappedTotalMinutes / 60);
        const cappedMinutes = cappedTotalMinutes % 60;
        const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
        if (isNaN(timeDiffFormatted)) {
            return '0';
        }

        return timeDiffFormatted;
    }



    const handleStartDateChange4 = (index2, date) => {
        alert(index2);
        handleFieldChange2(index2, 'date', date);
    };



    ///////////////////
    function handleClickResult(workplace) {
        // Populate all the startTime input fields with the search result value
        const updatedRowDataList = rowDataList.map(rowData => ({
            ...rowData,
            startTime: workplace.workStart1,
            endTime: workplace.workEnd1,
            selectotTime: workplace.workEnd1,
        }));

        // Update the state
        setRowDataList(updatedRowDataList);
    }


    //data for search
    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [searchResult, setSearchResult] = useState([]);

    async function handleSearch(event) {
        event.preventDefault();


        // get value from form search
        const data = {
            employeeId: searchEmployeeId,
            name: searchEmployeeName,
            idCard: '',
            workPlace: '',
        };

        try {
            const response = await axios.post(endpoint + '/employee/search', data);
            setSearchResult(response.data.employees);
            // alert(response.data.employees.length);
            if (response.data.employees.length < 1) {
                // window.location.reload();
                setEmployeeId('');
                setName('');
                alert('ไม่พบข้อมูล');
            } else {
                // alert(response.data.employees.length);

                //clean form 
                setSearchEmployeeId('');
                setSearchEmployeeName('');

                // Set search values
                setEmployeeId(response.data.employees[0].employeeId);
                setName(response.data.employees[0].name);

                // setSearchEmployeeId(response.data.employees[0].employeeId);
                // setSearchEmployeeName(response.data.employees[0].name);

                // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
                // console.log('workOfOT:', endTime);

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            // window.location.reload();
        }
    }



    async function handleManageWorkplace(event) {
        event.preventDefault();
        //get data from input in useState to data 

        const newRowData = await {
            workplaceId: wId || '',
            workplaceName: wName || '',
            date: wDate || '',
            shift: wShift || '',
            startTime: wStartTime || '',
            endTime: wEndTime || '',
            allTime: wAllTime || '',
            otTime: wOtTime || '',
            selectotTime: wSelectOtTime || '',
            selectotTimeOut: wSelectOtTimeout || '',
        };

        await addRow(newRowData);

        await setWId('');
        await setWName('');
        await setWStartTime('');
        await setWEndTime('');
        await setWAllTime('');
        await setWOtTime('');
        await setWSelectOtTime('');
        await setWSelectOtTimeout('');
    }


    // Function to add a new row to the rowDataList with specific values
    const addRow = (newRowData) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList2];
        // Push a new row with specific data
        // newDataList.push({ ...initialRowData, ...newRowData });
        newDataList.unshift(newRowData);
        // Update the state with the new data
        setRowDataList2(newDataList);
    };

    // Function to handle editing a row
    const handleEditRow = async (index) => {
        // You can implement the edit logic here, e.g., open a modal for editing
        // console.log('Edit row at index:', index);
        const tmp = await rowDataList2[index];
        // alert(tmp.staffId);
        await setWId(tmp.workplaceId);
        await setWName(tmp.workplaceName);

    };

    // Function to handle deleting a row
    const handleDeleteRow = (index) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList2];
        // Remove the row at the specified index
        newDataList.splice(index, 1);
        // Update the state with the new data
        setRowDataList2(newDataList);
    };


    async function handleCreateWorkplaceTimerecord(event) {
        event.preventDefault();
        // alert('test');

        //get data from input in useState to data 
        const data = {
            employeeId: employeeId,
            employeeName: name,
            month: month,
            employee_workplaceRecord: rowDataList2
        };


        try {
            const response = await axios.post(endpoint + '/timerecord/createemp', data);
            // setEmployeesResult(response.data.employees);
            if (response) {
                alert("บันทึกสำเร็จ");
            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            // window.location.reload();
        }

    }


    /////////////////
    const [selectedOption, setSelectedOption] = useState('agencytime');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmitForm1 = (event) => {
        event.preventDefault();
        // Handle submission for Form 1
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
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                        <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label role="searchname">ชื่อพนักงาน</label>
                                                        <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
                                            </div>
                                        </form>
                                        <br />
                                        <div class="d-flex justify-content-center">
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
                                                                    รหัส {workplace.employeeId} ชื่อ{workplace.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                            </div>
                        </div>
                        <form onSubmit={handleManageWorkplace}>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label role="agencynumber">รหัสพนักงาน</label>
                                        <input type="text" class="form-control" id="agencynumber" placeholder="รหัสพนักงาน" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label role="agencyname">ชื่อพนักงาน</label>
                                        <input type="text" class="form-control" id="agencyname" placeholder="ชื่อพนักงาน" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>

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
                                    <div class="d-flex align-items-end">
                                        <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ตรวจสอบ</button>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wId">รหัสหน่วยงาน</label>
                                        <br />
                                        <input type="text" class="form-control" id="wId" placeholder="รหัสหน่วยงาน" value={wId} onChange={(e) => setWId(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label role="wName">ชื่อหน่วยงาน</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wName" placeholder="ชื่อหน่วยงาน" value={wName} onChange={(e) => setWName(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <label role="wDate">วันที่</label>
                                    <br />
                                    <br />

                                    <select className="form-control" value={wDate} onChange={(e) => setWDate(e.target.value)} style={{ width: '5.5rem' }} >
                                        <option value="">เลือกวัน</option>
                                        {options}
                                    </select>
                                </div>

                                <div class="col-md-1">
                                    <label role="wShift">กะทำงาน</label>
                                    <br />
                                    <br />
                                    <select className="form-control" value={wShift} onChange={(e) => setWShift(e.target.value)} style={{ width: '5.5rem' }} >
                                        <option value="">เลือกกะ</option>
                                        <option value="morning_shift">กะเช้า</option>
                                        <option value="afternoon_shift">กะบ่าย</option>
                                        <option value="night_shift">กะดึก</option>
                                        <option value="specialt_shift">กะพิเศษ</option>
                                    </select>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wStartTime">เวลาเข้างาน</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wStartTime" placeholder="เวลาเข้างาน" value={wStartTime} onChange={(e) => setWStartTime(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wEndTime">เวลาออกงาน</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wEndTime" placeholder="เวลาออกงาน" value={wEndTime} onChange={(e) => setWEndTime(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wAllTime">ชั่วโมงทำงาน</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wAllTime" placeholder="ชั่วโมงทำงาน" value={wAllTime} onChange={(e) => setWAllTime(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wOtTime">ชั่วโมง OT</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wOtTime" placeholder="ชั่วโมง OT" value={wOtTime} onChange={(e) => setWOtTime(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wSelectOtTime">เวลาเข้า OT</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wSelectOtTime" placeholder="เวลาเข้า OT" value={wSelectOtTime} onChange={(e) => setWSelectOtTime(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <div class="form-group">
                                        <label role="wSelectOtTimeout">เวลาออก OT</label>
                                        <br />
                                        <br />
                                        <input type="text" class="form-control" id="wSelectOtTimeout" placeholder="เวลาออก OT" value={wSelectOtTimeout} onChange={(e) => setWSelectOtTimeout(e.target.value)} />
                                    </div>
                                </div>

                                <div class="col-md-1">
                                    <label role="button"></label>
                                    <br />
                                    <br />
                                    <div class="d-flex align-items-end">
                                        <button class="btn b_save"><i class="fas fa-check"></i> &nbsp; เพิ่ม</button>
                                    </div>
                                </div>

                            </div>


                            <section class="Frame">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div class="col-md-1"> รหัสหน่วยงาน</div>
                                            <div class="col-md-2"> ชื่อหน่วยงาน </div>
                                            <div class="col-md-1"> วันที่</div>
                                            <div class="col-md-1"> กะการทำงาน </div>
                                            <div class="col-md-1"> เวลาเข้างาน </div>
                                            <div class="col-md-1"> เวลาออกงาน </div>
                                            <div class="col-md-1"> ชั่วโมงทำงาน </div>
                                            <div class="col-md-1"> ชั่วโมง OT</div>
                                            <div class="col-md-1"> เวลาเข้า OT </div>
                                            <div class="col-md-1"> เวลาออก OT</div>

                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">

                                        {rowDataList2.map((rowData2, index) => (
                                            rowData2.workplaceId && (
                                                <div key={index}>
                                                    <div class="row" style={{ marginBottom: '1rem', borderBottom: '2px solid #000' }}>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.workplaceId}</div>
                                                        <div class="col-md-2" style={bordertable}> {rowData2.workplaceName} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.date} </div>
                                                        <div class="col-md-1" style={bordertable}>
                                                            {rowData2.shift === 'morning_shift' ? (
                                                                <p>กะเช้า</p>
                                                            ) : rowData2.shift === 'afternoon_shift' ? (
                                                                <p>กะบ่าย</p>
                                                            ) : rowData2.shift === 'night_shift' ? (
                                                                <p>กะดึก</p>
                                                            ) : rowData2.shift === 'specialt_shift' ? (
                                                                <p>กะพิเศษ</p>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.startTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.endTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.allTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.otTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.selectotTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData2.selectotTimeOut} </div>

                                                        <div class="col-md-1" style={bordertable}>
                                                            {/* <button onClick={() => handleEditRow(index)}>Edit</button> */}
                                                            <button class="btn btn-xs btn-danger" style={{ padding: '0.3rem ', width: '8rem' }} onClick={() => handleDeleteRow(index)}>Delete</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        ))}

                                    </div>
                                </div>
                            </section>


                            <div class="form-group">
                                <button class="btn b_save" onClick={handleCreateWorkplaceTimerecord}><i class="nav-icon fas fa-save"></i> &nbsp; บันทึก</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            {/* <!-- /.container-fluid --> */}
        </section>

    )
}

export default AddsettimeOutsiderEmployee