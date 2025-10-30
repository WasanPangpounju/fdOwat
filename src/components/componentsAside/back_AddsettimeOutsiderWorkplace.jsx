import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import EmployeesSelected from './EmployeesSelected';

function AddsettimeOutsiderWorkplace() {
    const bordertable = {
        borderLeft: '2px solid #000'
    };
    const [updateButton, setUpdateButton] = useState(false); // Initially, set to false
    const [newWorkplace, setNewWorkplace] = useState(true);

    //Workplace Record data
    const [workDate, setWorkDate] = useState(new Date());
    const formattedWorkDate = moment(workDate).format('DD/MM/YYYY');

    const [timeRecord_id, setTimeRecord_id] = useState('');

    //Workplace data
    const [workplaceId, setWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [workplaceName, setWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [workplacestay, setWorkplacestay] = useState(''); //สังกัด
    const [workplaceArea, setWorkplaceArea] = useState(''); //สถานที่ปฏิบัติงาน
    const [workOfWeek, setWorkOfWeek] = useState(''); //วันทำงานต่อสัปดาห์
    const [workStart1, setWorkStart1] = useState(''); //เวลาเริ่มกะเช้า
    const [workEnd1, setWorkEnd1] = useState(''); //เวลาออกกะเช้า
    const [workStart2, setWorkStart2] = useState(''); //เวลาเข้ากะบ่าย
    const [workEnd2, setWorkEnd2] = useState(''); //เวลาออกกะบ่าย
    const [workStart3, setWorkStart3] = useState(''); //เวลาเข้ากะเย็น
    const [workEnd3, setWorkEnd3] = useState(''); //เวลาออกกะเย็น
    const [workOfHour, setWorkOfHour] = useState(0); //ชั่วโมงทำงานต่อสัปดาห์
    const [workOfOT, setWorkOfOT] = useState(''); //ชั่วโมง OT ต่อสัปดาห์

    const [workRate, setWorkRate] = useState(''); //ค่าจ้างต่อวัน
    const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
    const [workTotalPeople, setWorkTotalPeople] = useState(''); //จำนวนคนในหน่วยงาน
    const [workRateDayoff, setWorkRateDayoff] = useState(''); //ค่าจ้างวันหยุด ต่อวัน
    const [workRateDayoffHour, setWorkRateDayoffHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง
    const [workplaceAddress, setWorkplaceAddress] = useState(''); //ที่อยู่หน่วยงาน

    //////////////////////////////

    const [workStartOt1, setWorkStartOt1] = useState('18.00'); //เวลาเริ่มกะเช้า
    const [workEndOt1, setWorkEndOt1] = useState('21.00'); //เวลาออกกะเช้า
    const [workStartOt2, setWorkStartOt2] = useState('22.00'); //เวลาเข้ากะบ่าย
    const [workEndOt2, setWorkEndOt2] = useState('01.00'); //เวลาออกกะบ่าย
    const [workStartOt3, setWorkStartOt3] = useState('19.00'); //เวลาเข้ากะเย็น
    const [workEndOt3, setWorkEndOt3] = useState('22.00'); //เวลาออกกะเย็น



    /////////////////////////////////
    const [employeeList, setEmployeeList] = useState([]);

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

    /////////////////////////////////////////////
    const [staffId, setStaffId] = useState(''); //รหัสหน่วยงาน
    const [staffName, setStaffName] = useState(''); //รหัสหน่วยงาน
    const [shift, setShift] = useState('');
    const [startTime, setStartTime] = useState(''); //รหัสหน่วยงาน
    const [endTime, setEndTime] = useState(''); //รหัสหน่วยงาน
    const [allTime, setAllTime] = useState(''); //รหัสหน่วยงาน
    const [otTime, setOtTime] = useState(''); //รหัสหน่วยงาน
    const [selectotTime, setSelectotTime] = useState('');
    const [selectotTimeOut, setSelectotTimeOut] = useState('');

    const [shift1start, setShift1start] = useState('');
    const [shift2start, setShift2start] = useState('');
    const [shift3start, setShift3start] = useState('');
    const [shift4start, setShift4start] = useState('');
    const [shift1end, setShift1end] = useState('');
    const [shift2end, setShift2end] = useState('');
    const [shift3end, setShift3end] = useState('');
    const [shift4end, setShift4end] = useState('');
    const [startTimeOt1, setStartTimeOt1] = useState('');
    const [endTimeOt1, setEndTimeOt1] = useState('');
    const [startTimeOt2, setStartTimeOt2] = useState('');
    const [endTimeOt2, setEndTimeOt2] = useState('');
    const [startTimeOt3, setStartTimeOt3] = useState('');
    const [endTimeOt3, setEndTimeOt3] = useState('');


    //search employee name by employeeId
    useEffect(() => {
        //Search Employee  by id
        if (staffId != '') {
            const employeesearch = employeeList.find(employee => employee.employeeId === staffId);
            if (employeesearch) {
                setStaffName(employeesearch.name);
            } else {
                setStaffName('');
            }
        }
    }, [staffId]);


    //search employeeId by employeeName 
    useEffect(() => {
        //Search Employee  by name
        if (staffName != '') {
            const employeesearch = employeeList.find(employee => employee.name === staffName);
            if (employeesearch) {
                setStaffId(employeesearch.employeeId);
            } else {
                setStaffId('');
            }
        }
    }, [staffName])


    //check ship and set time of work to start time and end time
    useEffect(() => {
        switch (shift) {
            case 'morning_shift':
                setStartTime(shift1start || '');
                setEndTime(shift1end || '');
                setAllTime(calTime(shift1start || '', shift1end || '', workOfHour || '') || '');
                setOtTime(calTime(startTimeOt1 || '', endTimeOt1 || '', workOfOT || '') || '');
                setSelectotTime(startTimeOt1 || '');
                setSelectotTimeOut(endTimeOt1 || '');
                break;
            case 'afternoon_shift':
                setStartTime(shift2start || '');
                setEndTime(shift2end || '');
                setAllTime(calTime(shift2start || '', shift2end || '', workOfHour || '') || '');
                setOtTime(calTime(startTimeOt2 || '', endTimeOt2 || '', workOfOT || '') || '');
                setSelectotTime(startTimeOt2 || '');
                setSelectotTimeOut(endTimeOt2 || '');
                break;
            case 'night_shift':
                setStartTime(shift3start || '');
                setEndTime(shift3end || '');
                setAllTime(calTime(shift3start || '', shift3end || '', workOfHour || '') || '');
                setOtTime(calTime(startTimeOt3 || '', endTimeOt3 || '', workOfOT || '') || '');
                setSelectotTime(startTimeOt3 || '');
                setSelectotTimeOut(endTimeOt3 || '');
                break;
            default:
                setStartTime('');
                setEndTime('');
                setAllTime('');
                setOtTime('');
                setSelectotTime('');
                setSelectotTimeOut('');
        }
    }, [shift]);

    useEffect(() => {

        // const startHours = parseFloat(startTime.split('.')[0]);
        // const startMinutes = parseFloat(startTime.split('.')[1] || 0);
        // const endHours = parseFloat(endTime.split('.')[0]);
        // const endMinutes = parseFloat(endTime.split('.')[1] || 0);
        // let hours = endHours - startHours;
        // let minutes = endMinutes - startMinutes;
        // if (minutes < 0) {
        //     hours -= 1;
        //     minutes += 60;
        // }
        // // Handle cases where endTime is on the next day
        // if (hours < 0) {
        //     hours += 24;
        // }
        // // Check if the employee worked >= 5 hours 
        // if (hours >= 5) {
        //     hours -= 1;
        // }

        // // Calculate the total time difference in minutes
        // const totalMinutes = hours * 60 + minutes;
        // // Check if the employee worked > 5 hours
        // // Cap the time difference at the maximum work hours
        // const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);
        // // Convert the capped time difference back to hours and minutes
        // const cappedHours = Math.floor(cappedTotalMinutes / 60);
        // const cappedMinutes = cappedTotalMinutes % 60;
        // const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
        // if (isNaN(timeDiffFormatted)) {
        //     setAllTime('0');
        // } else {
        //     setAllTime(timeDiffFormatted);
        // }

        try {
            if(shift == 'night_shift' ||
shift == 'afternoon_shift' ||
shift == 'morning_shift' ) {
    const allt = calTime(startTime || 0, endTime || 0, workOfHour || 0) || 0;
    setAllTime(allt);

}else {
    const allt = calTime(startTime || 0, endTime || 0, 24) || 0;
    setAllTime(allt);

}

          } catch (error) {
            // Handle the error here, you can log it or show an error message.
            console.error(error);
          //   alert(error);
          }
  
    }, [startTime, endTime, workOfHour]);

    useEffect(() => {
        try {
            if(shift == 'night_shift' ||
shift == 'afternoon_shift' ||
shift == 'morning_shift' ) {
    const ot = calTime(selectotTime || 0, selectotTimeOut || 0, workOfOT || 0) || 0;
    setOtTime(ot);

} else {
    const ot = calTime(selectotTime || 0, selectotTimeOut || 0, 24) || 0;
    setOtTime(ot);

}
        } catch (error) {
          // Handle the error here, you can log it or show an error message.
          console.error(error);
        //   alert(error);
        }
      }, [selectotTime, selectotTimeOut, workOfOT]);
      
//     useEffect(() => {
// const ot = calTime( selectotTime || 0, selectotTimeOut || 0 , workOfOT  || 0) || 0;
// setOtTime(ot );
        // const startHours = parseFloat(selectotTime.split('.')[0]);
        // const startMinutes = parseFloat(selectotTime.split('.')[1] || 0);
        // const endHours = parseFloat(selectotTimeOut.split('.')[0]);
        // const endMinutes = parseFloat(selectotTimeOut.split('.')[1] || 0);
        // let hours = endHours - startHours;
        // let minutes = endMinutes - startMinutes;
        // if (minutes < 0) {
        //     hours -= 1;
        //     minutes += 60;
        // }
        // // Handle cases where endTime is on the next day
        // if (hours < 0) {
        //     hours += 24;
        // }
        // // Check if the employee worked >= 5 hours 
        // if (hours >= 5) {
        //     hours -= 1;
        // }

        // // Calculate the total time difference in minutes
        // const totalMinutes = hours * 60 + minutes;
        // // Check if the employee worked > 5 hours
        // // Cap the time difference at the maximum work hours
        // const cappedTotalMinutes = Math.min(totalMinutes, otTime * 60);
        // // Convert the capped time difference back to hours and minutes
        // const cappedHours = Math.floor(cappedTotalMinutes / 60);
        // const cappedMinutes = cappedTotalMinutes % 60;

        // const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
        // // alert(timeDiffFormatted);
        // if (isNaN(timeDiffFormatted)) {
        //     setOtTime('0');
        // } else {
        //     setOtTime(timeDiffFormatted);
        // }
    // }, [selectotTime, selectotTimeOut, otTime]);




    function calTime(start, end, limit) {
        const startHours = parseFloat(start.split('.')[0] || 0);
        const startMinutes = parseFloat(start.split('.')[1] || 0);
        const endHours = parseFloat(end.split('.')[0] || 0);
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


    // Function to add a new row to the rowDataList with specific values
    const addRow = (newRowData) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList];
        // Push a new row with specific data
        // newDataList.push({ ...initialRowData, ...newRowData });
        newDataList.unshift(newRowData);

        // Update the state with the new data
        setRowDataList(newDataList);
    };


    // Function to handle editing a row
    const handleEditRow = async (index) => {
        // You can implement the edit logic here, e.g., open a modal for editing
        // console.log('Edit row at index:', index);
        const tmp = await rowDataList[index];
        alert(tmp.staffId);
        await setStaffId(tmp.staffId);
        await setStaffName(tmp.staffName);

    };

    // Function to handle deleting a row
    const handleDeleteRow = (index) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList];
        // Remove the row at the specified index
        newDataList.splice(index, 1);
        // Update the state with the new data
        setRowDataList(newDataList);
    };


    const handleWorkDateChange = (date) => {
        setWorkDate(date);
    };


    const [startjob1, setStartjob1] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange1 = (date) => {
        setStartjob1(date);
    };
    const [startjob2, setStartjob2] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange2 = (date) => {
        setStartjob2(date);
    };
    const [startjob3, setStartjob3] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange3 = (date) => {
        setStartjob3(date);
    };



    // const numberOfRows = 30; // Fixed number of rows
    const numberOfRows = 1; // Fixed number of rows

    const initialRowData = {
        staffId: '',
        staffName: '',
        shift: '',
        startTime: '',
        endTime: '',
        allTime: '',
        otTime: '',
        selectotTime: '',
        selectotTimeOut: '',
    };

    const [rowDataList, setRowDataList] = useState(new Array(numberOfRows).fill(initialRowData));


    const handleFieldChange = (index, fieldName, value) => {

        setRowDataList(prevDataList => {
            const newDataList = [...prevDataList];

            newDataList[index] = {
                ...newDataList[index],
                [fieldName]: value,
            };


            //Search Employee  by id
            if (fieldName == 'staffId') {

                const employeesearch = employeeList.find(employee => employee.employeeId === value);
                if (employeesearch) {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['staffName']: employeesearch.name + '',
                    };
                } else {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['staffName']: 'ไม่พบชื่อพนักงาน',
                    };
                }
            }

            //Search Employee  by name
            if (fieldName == 'staffName') {
                const employeesearch = employeeList.find(employee => employee.name === value);
                if (employeesearch) {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['staffId']: employeesearch.employeeId + '',
                    };
                } else {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['staffId']: 'ไม่พบรหัสพนักงาน',
                    };
                }
            }


            if (fieldName === 'startTime' || fieldName === 'endTime' || fieldName === 'shift') {
                if (value == 'morning_shift' && shift1start != null) {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['startTime']: shift1start + '',
                        ['endTime']: shift1end + '',
                        ['selectotTime']: shift1end + '',
                        // allTime: timeDiffFormatted,
                        // otTime: otTimeFormatted2 + '2222',
                    };
                }

                //check shift is afternoon
                if (value == 'afternoon_shift' && shift2start != null) {
                    newDataList[index] = {
                        ...newDataList[index],
                        ['startTime']: shift2start + '',
                        ['endTime']: shift2end + '',
                        ['selectotTime']: shift2end + '',
                        // allTime: timeDiffFormatted,
                        // otTime: otTimeFormatted2 + '2222',
                    };
                }

                //Check shift is night
                if (value == 'night_shift' && shift3start != null) {

                    newDataList[index] = {
                        ...newDataList[index],
                        ['startTime']: shift3start + '',
                        ['endTime']: shift3end + '',
                        ['selectotTime']: '' + '',
                        ['selectotTimeOut']: workEndOt3 + '',
                    };
                }

                if (value == 'specialt_shift' && shift4start != null) {
                    const workOfHour = parseFloat(newDataList[index].workOfHour);
                    const startHours = parseFloat(newDataList[index].startTime.split('.')[0]);
                    const startMinutes = parseFloat(newDataList[index].startTime.split('.')[1] || 0);
                    const endHours = parseFloat(newDataList[index].endTime.split('.')[0]);
                    const endMinutes = parseFloat(newDataList[index].endTime.split('.')[1] || 0);

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

                    const timeDiffFormatted = `${hours}.${minutes}`;

                    // Calculate otTime based on selectotTimeOut and endTime
                    const otselectHours = parseFloat(newDataList[index].selectotTime.split('.')[0]);
                    const otselectMinutes = parseFloat(newDataList[index].selectotTime.split('.')[1] || 0);
                    const otHours = parseFloat(newDataList[index].selectotTimeOut.split('.')[0]);
                    const otMinutes = parseFloat(newDataList[index].selectotTimeOut.split('.')[1] || 0);

                    let otHoursDiff = otHours - otselectHours;
                    let otMinutesDiff = otMinutes - otselectMinutes;

                    if (otMinutesDiff < 0) {
                        otHoursDiff -= 1;
                        otMinutesDiff += 60;
                    }

                    // Handle cases where otTime is on the next day
                    if (otHoursDiff < 0) {
                        otHoursDiff += 24;
                    }
                    const otTimeFormatted1 = `${otHoursDiff}.${otMinutesDiff}`;
                    const maxOTHours = parseFloat(newDataList[index].workOfOT);
                    const maxOTMinutes = 0; // If maxOTHours is always whole numbers

                    const totalOTMinutes = otHoursDiff * 60 + otMinutesDiff;
                    if (totalOTMinutes > maxOTHours * 60) {
                        otHoursDiff = maxOTHours;
                        otMinutesDiff = maxOTMinutes;
                    }
                    const otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;
                    newDataList[index] = {
                        ...newDataList[index],
                        ['startTime']: shift4start + '',
                        ['endTime']: shift4end + '',
                        ['selectotTime']: shift4end + '',
                        maxOTHours: '',
                        allTime: timeDiffFormatted, // Assign your custom allTime value here
                        otTime: otTimeFormatted2 + '2222', // Assign your custom otTime value here
                    };
                }

                //specialt_shift
            }



            const startHours = parseFloat(newDataList[index].startTime.split('.')[0]);
            const startMinutes = parseFloat(newDataList[index].startTime.split('.')[1] || 0);
            const endHours = parseFloat(newDataList[index].endTime.split('.')[0]);
            const endMinutes = parseFloat(newDataList[index].endTime.split('.')[1] || 0);


            let hours = endHours - startHours;
            let minutes = endMinutes - startMinutes;

            if (minutes < 0) {
                hours -= 1;
                minutes += 60;
            }

            // Handle cases where endTime is on the next day
            if (hours < 0) {
                hours = hours + 24;
            }

            // Calculate the total time difference in minutes
            const totalMinutes = hours * 60 + minutes;

            // Cap the time difference at the maximum work hours
            console.log(workOfOT);

            const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);
            // alert(workOfHour );
            // Convert the capped time difference back to hours and minutes
            const cappedHours = Math.floor(cappedTotalMinutes / 60);
            const cappedMinutes = cappedTotalMinutes % 60;

            const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;



            // Calculate otTime based on selectotTimeOut and endTime
            const otselectHours = parseFloat(newDataList[index].selectotTime.split('.')[0]);
            const otselectMinutes = parseFloat(newDataList[index].selectotTime.split('.')[1] || 0);
            const otHours = parseFloat(newDataList[index].selectotTimeOut.split('.')[0]);
            const otMinutes = parseFloat(newDataList[index].selectotTimeOut.split('.')[1] || 0);

            let otHoursDiff = otHours - otselectHours;
            let otMinutesDiff = otMinutes - otselectMinutes;




            if (otMinutesDiff < 0) {
                otHoursDiff -= 1;
                otMinutesDiff += 60;
            }

            // Handle cases where otTime is on the next day
            if (otHoursDiff < 0) {
                otHoursDiff += 24;
            }


            const otTimeFormatted1 = `${otHoursDiff}.${otMinutesDiff}`;

            const cappedTotalMinutes2 = Math.min(totalMinutes, workOfOT * 60);
            const maxOTHours = Math.floor(cappedTotalMinutes2 / 60);
            const maxOTMinutes = cappedTotalMinutes2 % 60;

            // const maxOTHours = parseFloat(newDataList[index].workOfOT);
            // const maxOTMinutes = 0; // If maxOTHours is always whole numbers

            const totalOTMinutes = otHoursDiff * 60 + otMinutesDiff;
            if (totalOTMinutes > maxOTHours * 60) {
                otHoursDiff = maxOTHours;
                otMinutesDiff = maxOTMinutes;
            }
            // const otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;

            let otTimeFormatted2;

            if (!isNaN(otHoursDiff) && !isNaN(otMinutesDiff) && (otHoursDiff !== 0 || otMinutesDiff !== 0)) {
                otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;
            } else {
                otTimeFormatted2 = '0';
            }


            newDataList[index] = {
                ...newDataList[index],
                allTime: timeDiffFormatted,
                otTime: otTimeFormatted2,
            };


            return newDataList;
        });
    };

    const numberOfRows2 = 30; // Fixed number of rows
    const initialRowData2 = {
        staffId: '',
        staffName: '',
        startjob: null, // Use null as initial value for DatePicker
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
            return newDataList2;
        });
    };

    const handleStartDateChange4 = (index2, date) => {
        handleFieldChange2(index2, 'startjob', date);
    };



    ///////////////////
    function handleClickResult(workplace) {
        setSearchWorkplaceId(workplace.workplaceId);
        setSearchWorkplaceName(workplace.workplaceName);
        //
        setWorkplaceId(workplace.workplaceId);
        setWorkplaceName(workplace.workplaceName);
        // alert(workplace.workOfHour);

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
            searchWorkplaceId: searchWorkplaceId,
            searchWorkplaceName: searchWorkplaceName,
        };

        try {
            const response = await axios.post(endpoint + '/workplace/search', data);
            setSearchResult(response.data.workplaces);
            if (response.data.workplaces.length < 1) {
                window.location.reload();
            } else {
                // Calculate the time difference
                setWorkOfHour(response.data.workplaces[0].workOfHour);
                setWorkOfOT(response.data.workplaces[0].workOfOT);

                const startTime = response.data.workplaces[0].workStart1;
                const endTime = response.data.workplaces[0].workEnd1;
                const workOfHour = response.data.workplaces[0].workOfHour;
                const selectotTime = response.data.workplaces[0].workEnd1;
                const workOfOT = response.data.workplaces[0].workOfOT;
                //get start time and end time for afternoon and night
                const startTime2 = response.data.workplaces[0].workStart2;
                const endTime2 = response.data.workplaces[0].workEnd2;
                const startTime3 = response.data.workplaces[0].workStart3;
                const endTime3 = response.data.workplaces[0].workEnd3;
                const startTime4 = '';
                const endTime4 = '';

                setStartTimeOt1(response.data.workplaces[0].workStartOt1);
                setEndTimeOt1(response.data.workplaces[0].workEndOt1);
                setStartTimeOt2(response.data.workplaces[0].workStartOt1);
                setEndTimeOt2(response.data.workplaces[0].workEndOt1);
                setStartTimeOt3(response.data.workplaces[0].workStartOt1);
                setEndTimeOt3(response.data.workplaces[0].workEndOt1);


                setShift1start(startTime);
                setShift1end(endTime);
                setShift2start(startTime2);
                setShift2end(endTime2);
                setShift3start(startTime3);
                setShift3end(endTime3);

                setShift4start(startTime4);
                setShift4end(endTime4);

                const [startHours, startMinutes] = startTime.split('.').map(parseFloat);
                const [endHours, endMinutes] = endTime.split('.').map(parseFloat);

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
                const totalMinutes = hours * 60 + minutes;

                // Cap the time difference at the maximum work hours
                const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);

                // Convert the capped time difference back to hours and minutes
                const cappedHours = Math.floor(cappedTotalMinutes / 60);
                const cappedMinutes = cappedTotalMinutes % 60;

                const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

                // const timeDiffFormatted = `${hours}.${minutes}`;

                // Populate all the startTime input fields with the search result value
                const updatedRowDataList = rowDataList.map(rowData => ({
                    ...rowData,
                    startTime: startTime,
                    endTime: endTime,
                    workOfHour: workOfHour,
                    selectotTime: selectotTime,
                    allTime: timeDiffFormatted,
                    workOfOT: workOfOT,
                    startTime2: startTime2,
                    endTime2: endTime2,
                    startTime3: startTime3,
                    endTime3: endTime3,

                    startTimeOt1: startTimeOt1,
                    endTimeOt1: endTimeOt1,
                    startTimeOt2: startTimeOt2,
                    endTimeOt2: endTimeOt2,
                    startTimeOt3: startTimeOt3,
                    endTimeOt3: endTimeOt3,
                }));
                // setRowDataList(updatedRowDataList);

                // Set search values
                setWorkplaceId(response.data.workplaces[0].workplaceId);
                setWorkplaceName(response.data.workplaces[0].workplaceName);

                setSearchWorkplaceId(response.data.workplaces[0].workplaceId);
                setSearchWorkplaceName(response.data.workplaces[0].workplaceName);

                // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
                // console.log('workOfOT:', endTime);

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            window.location.reload();
        }
    }


    // async function handleCheckTimerecord() {

    //     const data = {
    //         workplaceId: searchWorkplaceId,
    //         workplaceName: searchWorkplaceName,
    //         date: workDate
    //     };

    //     try {
    //         const response = await axios.post(endpoint + '/timerecord/search', data);
    //         // setSearchResult(response.data.workplacesTimeRecord );
    //         // alert(response.data.recordworkplace[0].employeeRecord.length);
    //         // alert(response.data.recordworkplace.length);
    //         if (response.data.recordworkplace.length < 1) {
    //             alert('no data');
    //             //                 window.location.reload();
    //         } else {
    //             // alert(response.data.recordworkplace.length);
    //             // alert(response.data.recordworkplace[0].employeeRecord.length);

    //             setRowDataList(response.data.recordworkplace[0].employeeRecord);

    //         }
    //     } catch (error) {
    //         alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
    //         alert(error.message);
    //         window.location.reload();
    //     }

    // }

    async function handleCheckTimerecord() {
        const data = {
            workplaceId: searchWorkplaceId,
            workplaceName: searchWorkplaceName,
            date: formattedWorkDate,
        };

        try {
            const response = await axios.post(endpoint + '/timerecord/search', data);

            if (response.data.recordworkplace.length < 1) {
                alert('ไม่พบข้อมูล');
                // Set the state to false if no data is found
                setUpdateButton(false);
                setTimeRecord_id('');
            } else {
                // Set the state to true if data is found
                setUpdateButton(true);
                setTimeRecord_id(response.data.recordworkplace[0]._id);
                setRowDataList(response.data.recordworkplace[0].employeeRecord);

                // alert(JSON.stringify( rowDataList[0] ) );
                //count work of time and set to table 
                // for (let i = 0; i < response.data.recordworkplace[0].employeeRecord.length; i++) {
                // alert(response.data.recordworkplace[0].employeeRecord[i].shift );
                // handleFieldChange(i, 'shift', response.data.recordworkplace[0].employeeRecord[i].shift);
                // }

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            alert(error.message);
            window.location.reload();
        }
    }



    async function handleCreateWorkplaceTimerecord(event) {
        // event.preventDefault();
        // alert('test');
        // alert(formattedWorkDate);

        //get data from input in useState to data 
        const data = {
            workplaceId: workplaceId,
            workplaceName: workplaceName,
            date: formattedWorkDate,
            employeeRecord: rowDataList
        };


        //check create or update Employee
        // if (newWorkplace) {
        // alert('Create Workplace');
        try {
            const response = await axios.post(endpoint + '/timerecord/create', data);
            // setEmployeesResult(response.data.employees);
            if (response) {
                alert("บันทึกสำเร็จ");
            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            // window.location.reload();
        }
        // } else {
        //update workplace data

        // Make the API call to update the resource by ID
        //         try {

        //             const response = await axios.put(endpoint + '/workplace/update/' + _id, data);
        //             // setEmployeesResult(response.data.employees);
        //             if (response) {
        //                 alert("บันทึกสำเร็จ");
        //                 window.location.reload();

        //             }
        //         } catch (error) {
        //             alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
        //             // window.location.reload();
        //         }

        //     }
    }


    async function handleUpdateWorkplaceTimerecord(event) {
        event.preventDefault();
        // alert('hi');
        //get data from input in useState to data 
        
        const data = {
            workplaceId: workplaceId,
            workplaceName: workplaceName,
            date: formattedWorkDate,
            employeeRecord: rowDataList
        };

        try {

            const response = await axios.put(endpoint + '/timerecord/update/' + timeRecord_id, data);
            // setEmployeesResult(response.data.employees);
            if (response) {
                alert("บันทึกสำเร็จ");
                window.location.reload();

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            // window.location.reload();
        }


    }



    async function handleManageWorkplace(event) {
        event.preventDefault();

        const newRowData = {
            staffId: staffId || '',
            staffName: staffName || '',
            shift: shift || '',
            startTime: startTime || '',
            endTime: endTime || '',
            allTime: allTime || '',
            otTime: otTime || '',
            selectotTime: selectotTime || '',
            selectotTimeOut: selectotTimeOut || '',
        };

        addRow(newRowData);

        //clean form
        setStaffId('');
        setShift('');
        setStaffName('');
        setStartTime('');
        setEndTime('');
        setAllTime('');
        setOtTime('');
        setSelectotTime('');
        setSelectotTimeOut('');
        // alert(rowDataList.length);

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


    // console.log(workOfOT);
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
                                                        <label role="searchWorkplaceId">รหัสหน่วยงาน</label>
                                                        <input type="text" class="form-control" id="searchWorkplaceId" placeholder="รหัสหน่วยงาน" value={searchWorkplaceId} onChange={(e) => setSearchWorkplaceId(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label role="searchWorkplaceName">ชื่อหน่วยงาน</label>
                                                        <input type="text" class="form-control" id="searchWorkplaceName" placeholder="ชื่อหน่วยงาน" value={searchWorkplaceName} onChange={(e) => setSearchWorkplaceName(e.target.value)} />
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
                                                                    รหัส {workplace.workplaceId} หน่วยงาน {workplace.workplaceName}
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
                                        <label role="agencynumber">รหัสหน่วยงาน</label>
                                        <input type="text" class="form-control" id="agencynumber" placeholder="รหัสหน่วยงาน" value={workplaceId} onChange={(e) => setWorkplaceId(e.target.value)} />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label role="agencyname">ชื่อหน่วยงาน</label>
                                        <input type="text" class="form-control" id="agencyname" placeholder="ชื่อหน่วยงาน" value={workplaceName} onChange={(e) => setWorkplaceName(e.target.value)} />
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label role="datetime">วันที่</label>
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
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label role="button"></label>
                                    <div class="d-flex align-items-end">
                                        <button class="btn b_save" onClick={handleCheckTimerecord}><i class="nav-icon fas fa-search"></i> &nbsp; ตรวจสอบ</button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <form onSubmit={handleManageWorkplace}>

                            <section class="Frame">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label role="staffId">รหัสพนักงาน</label>
                                            <input type="text" class="form-control" id="staffId" placeholder="รหัสพนักงาน" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label role="staffName">ชื่อพนักงาน</label>
                                            <input type="text" class="form-control" id="staffName" placeholder="ชื่อพนักงาน" value={staffName} onChange={(e) => setStaffName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label role="shift">กะการทำงาน</label>
                                            <select className="form-control" value={shift} onChange={(e) => setShift(e.target.value)}  >
                                                <option value="">เลือกกะการทำงาน</option>
                                                <option value="morning_shift">กะเช้า</option>
                                                <option value="afternoon_shift">กะบ่าย</option>
                                                <option value="night_shift">กะดึก</option>
                                                <option value="specialt_shift">กะพิเศษ</option>
                                            </select>

                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="startTime">เวลาเข้างาน</label>
                                            <input type="text" class="form-control" id="startTime" placeholder="เวลาเข้างาน" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="endTime">เวลาออกงาน</label>
                                            <input type="text" class="form-control" id="endTime" placeholder="เวลาออกงาน" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="allTime">ชั่วโมงทำงาน</label>
                                            <input type="text" class="form-control" id="allTime" placeholder="ชั่วโมงทำงาน" value={allTime} onChange={(e) => setAllTime(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="selectotTime">เวลาเข้า OT</label>
                                            <input type="text" class="form-control" id="selectotTime" placeholder="เวลาเข้า OT" value={selectotTime} onChange={(e) => setSelectotTime(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="selectotTimeOut">เวลาออก OT</label>
                                            <input type="text" class="form-control" id="selectotTimeOut" placeholder="เวลาออก OT" value={selectotTimeOut} onChange={(e) => setSelectotTimeOut(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-1">
                                        <div class="form-group">
                                            <label role="otTime">ชั่วโมง OT</label>
                                            <input type="text" class="form-control" id="otTime" placeholder="ชั่วโมง OT" value={otTime} onChange={(e) => setOtTime(e.target.value)} />
                                        </div>
                                    </div>

                                </div>

                            </section>

                            <div class="form-group">
                                <button class="btn b_save" >
                                    <i class="fas fa-check"></i> &nbsp; เพิ่ม
                                </button>
                            </div>

                        </form>

                        <form onSubmit={handleManageWorkplace}>

                            <section class="Frame">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div class="col-md-1"> รหัสพนักงาน </div>
                                            <div class="col-md-2"> ชื่อพนักงาน </div>
                                            <div class="col-md-1"> กะการทำงาน </div>
                                            <div class="col-md-1"> เวลาเข้างาน </div>
                                            <div class="col-md-1"> เวลาออกงาน </div>
                                            <div class="col-md-1"> ชั่วโมงทำงาน </div>
                                            <div class="col-md-1"> เวลาเข้า OT </div>
                                            <div class="col-md-1"> เวลาออก OT</div>
                                            <div class="col-md-1"> ชั่วโมง OT</div>

                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">

                                        {rowDataList.map((rowData, index) => (
                                            rowData.staffId && ( // Check if staffId is set (truthy)
                                                <div key={index}>
                                                    <div class="row" style={{ marginBottom: '1rem', borderBottom: '2px solid #000' }}>
                                                        <div class="col-md-1" style={bordertable}> {rowData.staffId} </div>
                                                        <div class="col-md-2" style={bordertable}> {rowData.staffName} </div>
                                                        <div class="col-md-1" style={bordertable}>
                                                            {rowData.shift === 'morning_shift' ? (
                                                                <p>กะเช้า</p>
                                                            ) : rowData.shift === 'afternoon_shift' ? (
                                                                <p>กะบ่าย</p>
                                                            ) : rowData.shift === 'night_shift' ? (
                                                                <p>กะดึก</p>
                                                            ) : rowData.shift === 'specialt_shift' ? (
                                                                <p>กะพิเศษ</p>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.startTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.endTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.allTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.selectotTime} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.selectotTimeOut} </div>
                                                        <div class="col-md-1" style={bordertable}> {rowData.otTime} </div>

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
                                {/* <button class="btn b_save" onClick={handleCreateWorkplaceTimerecord}><i class="nav-icon fas fa-save"></i> &nbsp; บันทึก</button> */}
                                {updateButton ? (
                                    <button class="btn b_save" onClick={handleUpdateWorkplaceTimerecord} >
                                        <i class="nav-icon fas fa-save"></i> &nbsp; อัพเดท
                                    </button>
                                ) : (
                                    <button class="btn b_save" onClick={handleCreateWorkplaceTimerecord}>
                                        <i class="nav-icon fas fa-save"></i> &nbsp; บันทึก
                                    </button>
                                )}
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            {/* <!-- /.container-fluid --> */}
        </section>
    )
}

export default AddsettimeOutsiderWorkplace
