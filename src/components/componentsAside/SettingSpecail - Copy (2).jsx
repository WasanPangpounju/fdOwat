import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';
import Calendar from 'react-calendar';
import '../editwindowcss.css';
import EmployeeWorkDay from './componentsetting/EmployeeWorkDay';


function SettingSpecial() {


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

    // State for selected values
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [listEmployeeDay, setListEmployeeDay] = useState([]);


    const [selectedDay1, setSelectedDay1] = useState('');
    const [spWorkStart1, setSpWorkStart1] = useState('');
    const [spWorkEnd1, setSpWorkEnd1] = useState('');
    const [spWorkStart2, setSpWorkStart2] = useState('');
    const [spWorkEnd2, setSpWorkEnd2] = useState('');
    const [spWorkStart3, setSpWorkStart3] = useState('');
    const [spWorkEnd3, setSpWorkEnd3] = useState('');

    const [listSpecialWorktime, setListSpecialWorktime] = useState([]);

    const [listMonday, setListMonday] = useState([]);
    const [listTuesday, setListTuesday] = useState([]);
    const [listWednesday, setListWednesday] = useState([]);
    const [listThursday, setListThursday] = useState([]);
    const [listFriday, setListFriday] = useState([]);
    const [listSaturday, setListSaturday] = useState([]);
    const [listSunday, setListSunday] = useState([]);

    const [detail, setDetail] = useState('');

    // Options for dropdowns
    const daysOfWeek = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const positions = ['หัวหน้างาน', 'พนักงานทำความสะอาด'];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedDates && selectedPosition && numberOfEmployees !== '') {
            const newData = {
                day: selectedDay,
                position: selectedPosition,
                employees: numberOfEmployees,
            };

            setListEmployeeDay((prevData) => [...prevData, newData]);

            // Reset the form fields after submitting
            setSelectedDay('');
            setSelectedPosition('');
            setNumberOfEmployees('');
        }
    };

    //special work time day
    const [specialWorkTimeDay, setSpecialWorkTimeDay] = useState({
        day: '',
        shift: '',
        startTime: '',
        endTime: '',
        startTimeOT: '',
        endTimeOT: '',
        payment: '',
        paymentOT: '',
        workDetail: '',
        employees: [{
            positionWork: '',
            countPerson: ''
        }],
    });

    const [specailWorkTimeDayList, setSpecialWorkTimeDayList] = useState([]);

    const [workDate, setWorkDate] = useState(new Date());
    const handleWorkDateChange = (date) => {
            // Convert the date to a dd-mm-yyyy string format
    const day = date.getDate().toString().padStart(2, '0'); // Get the day and ensure it has leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (months are zero-based) and ensure it has leading zero if necessary
    const year = date.getFullYear().toString(); // Get the full year
    const dateString = `${day}-${month}-${year}`;

        setWorkDate(date);
        setSpecialWorkTimeDay(prevState => ({
            ...prevState,
            day: dateString
        }));
    };


    const [workTimeDay, setWorkTimeDay] = useState({
        startDay: '',
        endDay: '',
        workOrStop: '',
        allTimes: [{ shift: '', startTime: '', endTime: '', resultTime: '', startTimeOT: '', endTimeOT: '', resultTimeOT: '' }],
    });

    const [workTimeDayList, setWorkTimeDayList] = useState([]);

    // const daysOfWeekThai = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    const shiftWork = ['กะเช้า', 'กะบ่าย', 'กะดึก'];

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSpecialWorkTimeDay((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddTime = () => {
        setWorkTimeDay((prevData) => ({
            ...prevData,
            allTimes: [...prevData.allTimes, { shift: '', startTime: '', endTime: '', resultTime: '', startTimeOT: '', endTimeOT: '', resultTimeOT: '' }],
        }));
    };

    const handleRemoveTime = (indexToRemove) => {
        setWorkTimeDay((prevData) => ({
            ...prevData,
            allTimes: prevData.allTimes.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleAddTimeList = () => {
        setSpecialWorkTimeDayList((prevList) => [...prevList, specialWorkTimeDay]);

        //clean data
        setSpecialWorkTimeDay({
            day: '',
            shift: '',
            startTime: '',
            endTime: '',
            startTimeOT: '',
            endTimeOT: '',
            payment: '',
            paymentOT: '',
            workDetail: '',
            employees: [{
                positionWork: '',
                countPerson: ''
            }]
        });
    };

    const handleRemoveTimeList = (index) => {
        setSpecialWorkTimeDayList((prevList) => {
            const updatedList = [...prevList];
            updatedList.splice(index, 1);
            return updatedList;
        });
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
                    const resultTimeOT = calculateTimeDifference(startTimeOT, endTimeOT);
                    updatedTimes[index].resultTimeOT = resultTimeOT;

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

        // If resultHour is negative, adjust the minutes accordingly
        if (resultHour < 0) {
            resultHour += 24; // Assuming 24-hour time format
        }

        return `${resultHour.toString().padStart(2, '0')}.${resultMinute.toString().padStart(2, '0')}`;
    };


    const [workTimeDayPerson, setWorkTimeDayPerson] = useState({
        startDay: '',
        endDay: '',
        allTimesPerson: [{ shift: '', positionWork: '', countPerson: '' }],
    });

    const [workTimeDayPersonList, setWorkTimeDayPersonList] = useState([]);

    // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // const shiftWork = ['Shift 1', 'Shift 2', 'Shift 3'];
    const positionWork = ['หัวหน้า', 'ทำความสะอาด', 'กวาดพื้น'];


    const handleInputChangePerson = (e, index) => {
        const { name, value } = e.target;

        setSpecialWorkTimeDay((prevData) => {
            const updatedAllTimesPerson = [...prevData.employees];
            updatedAllTimesPerson[index] = {
                ...updatedAllTimesPerson[index],
                [name]: value,
            };
            return {
                ...prevData,
                employees: updatedAllTimesPerson,
            };
        });

    };

    const handleAddTimePerson = () => {
        setSpecialWorkTimeDay((prevData) => ({
            ...prevData,
            employees: [...prevData.employees, {
                positionWork: '',
                countPerson: ''
            }
            ],
        }));
    };


    const handleRemoveTimePerson = (indexToRemove) => {
        setSpecialWorkTimeDay((prevData) => ({
            ...prevData,
            employees: prevData.employees.filter((_, index) => index !== indexToRemove),
        }));
    };



    //set data to 7 day
    useEffect(() => {
        //clean data
        setListMonday([]);
        setListTuesday([]);
        setListWednesday([]);
        setListThursday([]);
        setListFriday([]);
        setListSaturday([]);
        setListSunday([]);

        listEmployeeDay.map((item) => {
            switch (item.day) {
                case 'จันทร์':
                    setListMonday((prevData) => [...prevData, item]);
                    break;
                case 'อังคาร':
                    setListTuesday((prevData) => [...prevData, item]);
                    break;
                case 'พุธ':
                    setListWednesday((prevData) => [...prevData, item]);
                    break;
                case 'พฤหัส':
                    setListThursday((prevData) => [...prevData, item]);
                    break;
                case 'ศุกร์':
                    setListFriday((prevData) => [...prevData, item]);
                    break;
                case 'เสาร์':
                    setListSaturday((prevData) => [...prevData, item]);
                    break;
                case 'อาทิตย์':
                    setListSunday((prevData) => [...prevData, item]);
                    break;
                default:
                    alert('not select day')
            }
        });

        //set special work time
        listSpecialWorktime.map((item) => {
            switch (item.day) {
                case 'จันทร์':
                    setListMonday((prevData) => [...prevData, item]);
                    break;
                case 'อังคาร':
                    setListTuesday((prevData) => [...prevData, item]);
                    break;
                case 'พุธ':
                    setListWednesday((prevData) => [...prevData, item]);
                    break;
                case 'พฤหัส':
                    setListThursday((prevData) => [...prevData, item]);
                    break;
                case 'ศุกร์':
                    setListFriday((prevData) => [...prevData, item]);
                    break;
                case 'เสาร์':
                    setListSaturday((prevData) => [...prevData, item]);
                    break;
                case 'อาทิตย์':
                    setListSunday((prevData) => [...prevData, item]);
                    break;
                default:
                    alert('not select data')
            }
        });

    }, [listEmployeeDay, listSpecialWorktime]);


    const styles = {
        th: {
            minWidth: "3rem"
        }
    };

    const [newWorkplace, setNewWorkplace] = useState(true);


    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('');

    const [employeeIdList, setEmployeeIdList] = useState([]); //รหัสพนักงาน
    const [employeeNameList, setEmployeeNameList] = useState([]); //ชื่อพนักงานที่สังกัด


    //Workplace data
    const [_id, set_id] = useState('');
    const [workplaceId, setWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [workplaceName, setWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [workplaceArea, setWorkplaceArea] = useState(''); //สถานที่ปฏิบัติงาน
    const [workOfWeek, setWorkOfWeek] = useState(''); //วันทำงานต่อสัปดาห์

    const [workStart1, setWorkStart1] = useState(''); //เวลาเริ่มกะเช้า
    const [workEnd1, setWorkEnd1] = useState(''); //เวลาออกกะเช้า
    const [workStart2, setWorkStart2] = useState(''); //เวลาเข้ากะบ่าย
    const [workEnd2, setWorkEnd2] = useState(''); //เวลาออกกะบ่าย
    const [workStart3, setWorkStart3] = useState(''); //เวลาเข้ากะเย็น
    const [workEnd3, setWorkEnd3] = useState(''); //เวลาออกกะเย็น
    ///start end OT
    const [workStartOt1, setWorkStartOt1] = useState(''); //เวลาเริ่มกะเช้า
    const [workEndOt1, setWorkEndOt1] = useState(''); //เวลาออกกะเช้า
    const [workStartOt2, setWorkStartOt2] = useState(''); //เวลาเข้ากะบ่าย
    const [workEndOt2, setWorkEndOt2] = useState(''); //เวลาออกกะบ่าย
    const [workStartOt3, setWorkStartOt3] = useState(''); //เวลาเข้ากะเย็น
    const [workEndOt3, setWorkEndOt3] = useState(''); //เวลาออกกะเย็น

    const [workOfHour, setWorkOfHour] = useState(''); //ชั่วโมงทำงานต่อสัปดาห์
    const [workOfOT, setWorkOfOT] = useState(''); //ชั่วโมง OT ต่อสัปดาห์

    const [workRate, setWorkRate] = useState(''); //ค่าจ้างต่อวัน
    const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
    const [workTotalPeople, setWorkTotalPeople] = useState(''); //จำนวนคนในหน่วยงาน
    const [dayoffRate, setDayoffRate] = useState(''); //ค่าจ้างวันหยุดรายวันต่อชั่วโมง
    const [dayoffRateOT, setDayoffRateOT] = useState(''); //ค่าจ้างวันหยุด OT ต่อชั่วโมง
    const [dayoffRateHour, setDayoffRateHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง
    const [holiday, setHoliday] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ 
    const [holidayOT, setHolidayOT] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ OT
    const [holidayHour, setHolidayHour] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง

    const [salaryadd1, setSalaryadd1] = useState(''); //ค่ารถ
    const [salaryadd2, setSalaryadd2] = useState(''); //ค่าอาหาร
    const [salaryadd3, setSalaryadd3] = useState(''); //เบี้ยขยัน
    const [salaryadd4, setSalaryadd4] = useState(''); //เงินพิเศษอื่นๆ
    const [salaryadd5, setSalaryadd5] = useState(''); //ค่าโทรศัพท์
    const [salaryadd6, setSalaryadd6] = useState(''); //เงินประจำตำแหน่ง
    const [personalLeave, setPersonalLeave] = useState(''); //วันลากิจ
    const [personalLeaveNumber, setPersonalLeaveNumber] = useState(''); //วันลากิจ
    const [personalLeaveRate, setPersonalLeaveRate] = useState(''); //จ่ายเงินลากิจ
    const [sickLeave, setSickLeave] = useState(''); //วันลาป่วย
    const [sickLeaveNumber, setSickLeaveNumber] = useState(''); //วันลาป่วย
    const [sickLeaveRate, setSickLeaveRate] = useState(''); //จ่ายเงินวันลาป่วย
    const [workRateDayoff, setWorkRateDayoff] = useState(''); //ค่าจ้างวันหยุด ต่อวัน
    const [workRateDayoffNumber, setWorkRateDayoffNumber] = useState(''); //ค่าจ้างวันหยุด ต่อวัน
    const [workRateDayoffRate, setworkRateDayoffRate] = useState('');
    // const [daysOff , setDaysOff] = useState([{ date: '' }]);
    const [workplaceAddress, setWorkplaceAddress] = useState(''); //ที่อยู่หน่วยงาน

    // const [workRateDayoffHour, setWorkRateDayoffHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง

    ///////////////////// 7 day work
    const [workday1, setWorkday1] = useState(false);
    const [workday2, setWorkday2] = useState(false);
    const [workday3, setWorkday3] = useState(false);
    const [workday4, setWorkday4] = useState(false);
    const [workday5, setWorkday5] = useState(false);
    const [workday6, setWorkday6] = useState(false);
    const [workday7, setWorkday7] = useState(false);

    const [workcount1, setWorkcount1] = useState('');
    const [workcount2, setWorkcount2] = useState('');
    const [workcount3, setWorkcount3] = useState('');
    const [workcount4, setWorkcount4] = useState('');
    const [workcount5, setWorkcount5] = useState('');
    const [workcount6, setWorkcount6] = useState('');
    const [workcount7, setWorkcount7] = useState('');
    // const [daysOff , setDaysOff] = useState([{ date: '' }]);


    const [formData, setFormData] = useState({
        addSalary: [
            { codeSpSalary: '', name: '', SpSalary: '', roundOfSalary: '', StaffType: '', nameType: '' }
        ]
    });
    const [showAdditionalInput, setShowAdditionalInput] = useState([]);

    // const handleSelectChange = (e, index) => {
    //     const selectedValue = e.target.value;
    //     handleChange(e, index, 'StaffType');

    //     // Check if "Option3" is selected, and then show the additional input
    //     const newShowAdditionalInput = [...showAdditionalInput];
    //     newShowAdditionalInput[index] = selectedValue === 'Option3';
    //     setShowAdditionalInput(newShowAdditionalInput);
    // };

    // const handleChangeSpSalary = (e, index, key) => {
    //     const newFormData = [...formData];
    //     newFormData[index] = {
    //         ...newFormData[index],
    //         [key]: e.target.value,
    //     };
    //     setFormData(newFormData);
    // };
    const handleChangeSpSalary = (e, index, key) => {
        const newAddSalary = [...formData.addSalary];
        newAddSalary[index] = {
            ...newAddSalary[index],
            [key]: e.target.value,
        };

        setFormData({
            ...formData,
            addSalary: newAddSalary
        });
    };

    // const handleAddInput = () => {
    //     setFormData([...formData, { name: '', SpSalary: '', StaffType: '', nameType: '' }]);
    //     setShowAdditionalInput([...showAdditionalInput, false]);
    // };
    const handleAddInput = () => {
        setFormData({
            ...formData,
            addSalary: [
                ...formData.addSalary,
                { codeSpSalary: '', name: '', SpSalary: '', roundOfSalary: '', StaffType: '', nameType: '' }
            ]
        });
        setShowAdditionalInput([...showAdditionalInput, false]);
    };



    const [showEmployeeListResult, setShowEmployeeListResult] = useState([]);

    //set data to form
    function handleClickResult(workplace) {
        setNewWorkplace(false);
        setShowEmployeeListResult(employeeListResult);
        set_id(workplace._id);
        setWorkplaceId(workplace.workplaceId);
        setWorkplaceName(workplace.workplaceName);
        setWorkplaceArea(workplace.workplaceArea);
        setWorkOfWeek(workplace.workOfWeek);

        setWorkStart1(workplace.workStart1);
        setWorkEnd1(workplace.workEnd1);
        setWorkStart2(workplace.workStart2);
        setWorkEnd2(workplace.workEnd2);
        setWorkStart3(workplace.workStart3);
        setWorkEnd3(workplace.workEnd3);

        setWorkStartOt1(workplace.workStartOt1);
        setWorkEndOt1(workplace.workEndOt1);
        setWorkStartOt2(workplace.workStartOt2);
        setWorkEndOt2(workplace.workEndOt2);
        setWorkStartOt3(workplace.workStartOt3);
        setWorkEndOt3(workplace.workEndOt3);

        setWorkOfHour(workplace.workOfHour);
        setWorkOfOT(workplace.workOfOT);
        setWorkRate(workplace.workRate);
        setWorkRateOT(workplace.workRateOT);
        setWorkTotalPeople(workplace.workTotalPeople);
        setDayoffRate(workplace.dayoffRate);
        setDayoffRateOT(workplace.dayoffRateOT);
        setDayoffRateHour(workplace.dayoffRateHour);
        setHoliday(workplace.holiday);
        setHolidayOT(workplace.holidayOT);
        setHolidayHour(workplace.holidayHour);
        setSalaryadd1(workplace.salaryadd1);
        setSalaryadd2(workplace.salaryadd2);
        setSalaryadd3(workplace.salaryadd3);
        setSalaryadd4(workplace.salaryadd4);
        setSalaryadd5(workplace.salaryadd5);
        setSalaryadd6(workplace.salaryadd6);
        setPersonalLeave(workplace.personalLeave);
        setPersonalLeaveNumber(workplace.personalLeaveNumber);
        setPersonalLeaveRate(workplace.personalLeaveRate);
        setSickLeave(workplace.sickLeave);
        setSickLeaveNumber(workplace.sickLeaveNumber);
        setSickLeaveRate(workplace.sickLeaveRate);
        setWorkRateDayoff(workplace.workRateDayoff);
        setWorkRateDayoffNumber(workplace.workRateDayoffNumber);
        setworkRateDayoffRate(workplace.workRateDayoffRate);
        setWorkplaceAddress(workplace.workplaceAddress);
        //setSelectedDates([...selectedDates, workplace.daysOff]);

        ////////work day
        if (workplace.workday1 == 'false') {
            setWorkday1(false)
        } else {
            setWorkday1(workplace.workday1);
        }
        if (workplace.workday2 == 'false') {
            setWorkday2(false)
        } else {
            setWorkday2(workplace.workday2);
        }
        if (workplace.workday3 == 'false') {
            setWorkday3(false)
        } else {
            setWorkday3(workplace.workday3);
        }
        if (workplace.workday4 == 'false') {
            setWorkday4(false)
        } else {
            setWorkday4(workplace.workday4);
        }
        if (workplace.workday5 == 'false') {
            setWorkday5(false)
        } else {
            setWorkday5(workplace.workday5);
        }
        if (workplace.workday6 == 'false') {
            setWorkday6(false)
        } else {
            setWorkday6(workplace.workday6);
        }
        if (workplace.workday7 == 'false') {
            setWorkday7(false)
        } else {
            setWorkday7(workplace.workday7);
        }

        setWorkcount1(workplace.workcount1);
        setWorkcount2(workplace.workcount2);
        setWorkcount3(workplace.workcount3);
        setWorkcount4(workplace.workcount4);
        setWorkcount5(workplace.workcount5);
        setWorkcount6(workplace.workcount6);
        setWorkcount7(workplace.workcount7);
        const dates = workplace.daysOff.map((dateString) => new Date(dateString));

        setSelectedDates(dates);
        setReason(workplace.reason);

        // employeeIdLists


        const initialFormData = {
            addSalary: workplace.addSalary.map((item) => ({
                name: item.name || '',
                codeSpSalary: item.codeSpSalary || '',
                SpSalary: item.SpSalary || '',
                roundOfSalary: item.roundOfSalary || '',
                StaffType: item.StaffType || '',
                nameType: item.nameType || '',
            })),
        };

        setFormData(initialFormData);
        // setFormData(workplace.addSalary);



        const employeeIdLists = workplace.employeeIdList.map((item) => [...item]);
        setEmployeeIdList(employeeIdLists);

        const employeeNameLists = workplace.employeeNameList.map((item) => [...item]);
        setEmployeeNameList(employeeNameLists);

        setListEmployeeDay(workplace.listEmployeeDay);
        setListSpecialWorktime(workplace.listSpecialWorktime);
        setWorkTimeDayList(workplace.workTimeDay);
        setWorkTimeDayPersonList(workplace.workTimeDayPerson);

        // console.log(workplace);
        // // console.log(initialFormData);
        // console.log("formData", formData);



    }

    //data for search
    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [searchResult, setSearchResult] = useState([]);
    const [employeeListResult, setEmployeeListResult] = useState([]);


    async function handleSearch(event) {
        event.preventDefault();

        //clean list employee
        setShowEmployeeListResult([]);

        //get value from form search        
        const data = {
            searchWorkplaceId: searchWorkplaceId,
            searchWorkplaceName: searchWorkplaceName
        };

        try {
            const response = await axios.post(endpoint + '/workplace/search', data);
            setSearchResult(response.data.workplaces);

            if (response.data.workplaces.length < 1) {
                window.location.reload();

            } else {
                const data1 = {
                    employeeId: '',
                    name: '',
                    idCard: '',
                    workPlace: searchWorkplaceId
                };

                const response1 = await axios.post(endpoint + '/employee/search', data1);
                await setEmployeeListResult(response1.data.employees);
                // await alert(JSON.stringify(response1.data.employees , null ,2));
                // alert(response1.data );
                // alert(employeeListResult.length);

            }

        } catch (error) {
            // setMessage('ไม่พบผลการค้นหา กรุณาตรวจสอบข้อมูลที่ใช้ในการค้นหาอีกครั้ง');
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            window.location.reload();

        }

    }

    async function handleManageWorkplace(event) {
        event.preventDefault();

        //get data from input in useState to data 
        const data = {
            workplaceId: workplaceId,
            workplaceName: workplaceName,
            workplaceArea: workplaceArea,
            workOfWeek: workOfWeek,

            workStart1: workStart1,
            workEnd1: workEnd1,
            workStart2: workStart2,
            workEnd2: workEnd2,
            workStart3: workStart3,
            workEnd3: workEnd3,

            workStartOt1: workStartOt1,
            workEndOt1: workEndOt1,
            workStartOt2: workStartOt2,
            workEndOt2: workEndOt2,
            workStartOt3: workStartOt3,
            workEndOt3: workEndOt3,

            workOfHour: workOfHour,
            workOfOT: workOfOT,
            workRate: workRate,
            workRateOT: workRateOT,
            workTotalPeople: workTotalPeople,
            dayoffRate: dayoffRate,
            dayoffRateOT: dayoffRateOT,
            dayoffRateHour: dayoffRateHour,
            holiday: holiday,
            holidayOT: holidayOT,
            holidayHour: holidayHour,
            salaryadd1: salaryadd1,
            salaryadd2: salaryadd2,
            salaryadd3: salaryadd3,
            salaryadd4: salaryadd4,
            salaryadd5: salaryadd5,
            salaryadd6: salaryadd6,
            personalLeave: personalLeave,
            personalLeaveNumber: personalLeaveNumber,
            personalLeaveRate: personalLeaveRate,
            sickLeave: sickLeave,
            sickLeaveNumber: sickLeaveNumber,
            sickLeaveRate: sickLeaveRate,
            workRateDayoff: workRateDayoff,
            workRateDayoffNumber: workRateDayoffNumber,
            workRateDayoffRate: workRateDayoffRate,
            workplaceAddress: workplaceAddress,
            daysOff: selectedDates,
            reason: reason,

            employeeIdList: employeeIdList,
            employeeNameList: employeeNameList,

            workday1: workday1 === true ? workday1 : false,
            workday2: workday2 === true ? workday2 : false,
            workday3: workday3 === true ? workday3 : false,
            workday4: workday4 === true ? workday4 : false,
            workday5: workday5 === true ? workday5 : false,
            workday6: workday6 === true ? workday6 : false,
            workday7: workday7 === true ? workday7 : false,

            workcount1: workcount1,
            workcount2: workcount2,
            workcount3: workcount3,
            workcount4: workcount4,
            workcount5: workcount5,
            workcount6: workcount6,
            workcount7: workcount7,
            addSalary: formData.addSalary,
            listEmployeeDay: listEmployeeDay,
            listSpecialWorktime: listSpecialWorktime,
            workTimeDay: workTimeDayList,
            workTimeDayPerson: workTimeDayPersonList
        };


        //check create or update Employee
        if (newWorkplace) {
            // alert('Create Workplace');
            try {
                const response = await axios.post(endpoint + '/workplace/create', data);
                // setEmployeesResult(response.data.employees);
                if (response) {
                    alert("บันทึกสำเร็จ");
                }
            } catch (error) {
                alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
                // window.location.reload();
            }
        } else {
            //update workplace data

            // Make the API call to update the resource by ID
            try {

                const response = await axios.put(endpoint + '/workplace/update/' + _id, data);
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
    }

    const bordertable = {
        borderLeft: '2px solid #000'
    };



    console.log(formData);
    // // console.log(showAdditionalInput);


    useEffect(() => {
        let d = holiday || 0;
        let h = workOfHour || 0;
        if (d < 10) {
            let wr = workRate || 0;
            d = wr * d;
        }
        let wrh = d / h;
        setHolidayHour(wrh);
    }, [holiday, workOfHour]);


    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">

                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
                        <li class="breadcrumb-item active">ตั้งค่าหน่วยงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตั้งค่าหน่วยงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ตั้งค่าหน่วยงาน</h2>
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
                            <h2 class="title">ตั้งค่าวันทํางานพิเศษ</h2>
                            <section class="Frame">
                                <form>
                                    <section class="Frame">
                                        <div class="row">
                                            <div class="col-md-2">
                                                เลือกวันที่
                                            </div>
                                            <div class="col-md-10">
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        กะ
                                                    </div>
                                                    <div class="col-md-1">
                                                        เวลาเข้า
                                                    </div>
                                                    <div class="col-md-1">
                                                        เวลาออก
                                                    </div>
                                                    <div class="col-md-2">
                                                        เวลาเข้าOT
                                                    </div>
                                                    <div class="col-md-2">
                                                        เวลาออกOT
                                                    </div>
                                                    <div class="col-md-2">
                                                        อัตราค่าจ้าง
                                                    </div>
                                                    <div class="col-md-2">
                                                        อัตราค่าจ้างOT
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="row">
                                            <div class="col-md-2">
                                                {/* <select name="startDay" className="form-control" value={workTimeDay.startDay} onChange={handleInputChange}>
                                                    <option value='' >
                                                        เลือก
                                                    </option>
                                                    {daysOfWeek.map((day, index) => (
                                                        <option key={index} value={day}>
                                                            {day}
                                                        </option>
                                                    ))}
                                                </select> */}
                                                <div style=
                                                    {{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="day"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={workDate}
                                                        onChange={handleWorkDateChange }
                                                        dateFormat="dd/MM/yyyy"
                                                    // showMonthYearPicker
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-md-10">

                                                {workTimeDay.allTimes.map((time, index) => (
                                                    <div key={index}>
                                                        <div class="row">
                                                            <div class="col-md-2">
                                                                <select name="shift" className="form-control" value={specialWorkTimeDay.shift}
                                                                    onChange={handleInputChange}>
                                                                    <option value="">เลือกกะ</option>
                                                                    {shiftWork.map((day, index) => (
                                                                        <option key={index} value={day}>
                                                                            {day}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div class="col-md-1">
                                                                <input
                                                                    type="text"
                                                                    name="startTime"
                                                                    class="form-control"
                                                                    placeholder={`Start Time `}
                                                                    value={specialWorkTimeDay.startTime}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            <div class="col-md-1">
                                                                <input
                                                                    type="text"
                                                                    name="endTime"
                                                                    class="form-control"
                                                                    placeholder={`End Time `}
                                                                    value={specialWorkTimeDay.endTime}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            {/* <span>Result Time: {time.resultTime}</span> */}
                                                            <div class="col-md-2">

                                                                <input
                                                                    type="text"
                                                                    name="startTimeOT"
                                                                    class="form-control"
                                                                    placeholder={`Start Time OT `}
                                                                    value={specialWorkTimeDay.startTimeOT}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            <div class="col-md-2">

                                                                <input
                                                                    type="text"
                                                                    name="endTimeOT"
                                                                    class="form-control"
                                                                    placeholder={`End Time OT `}
                                                                    value={specialWorkTimeDay.endTimeOT}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>


                                                            <div class="col-md-2">

                                                                <input
                                                                    type="text"
                                                                    name="payment"
                                                                    class="form-control"
                                                                    placeholder={`อัตราค่าจ้าง `}
                                                                    value={specialWorkTimeDay.payment}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                            <div class="col-md-2">

                                                                <input
                                                                    type="text"
                                                                    name="paymentOT"
                                                                    class="form-control"
                                                                    placeholder={`อัตราค่าจ้างOT `}
                                                                    value={specialWorkTimeDay.paymentOT}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>

                                                        </div>
                                                        <br />
                                                    </div>
                                                ))}

                                            </div>
                                        </div>

                                        <br />


                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        เลือกตำแหน่ง
                                                    </div>
                                                    <div class="col-md-2">
                                                        จำนวนคน
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <br />

                                        <div className="col-md-12">
                                            {specialWorkTimeDay.employees.map((time, index) => (
                                                <div key={index} className="row">
                                                    <div className="col-md-2">
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
                                                    <div className="col-md-2">
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
                                                            placeholder={`Person `}
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
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        รายละเอียดงาน
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <br />

                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    {/* <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Person ${index + 1}`}
                                                            value={time.countPerson}
                                                            onChange={(e) => handleInputChangePerson(e, index)}
                                                        /> */}
                                                    <input
                                                        type="text"
                                                        name="workDetail"
                                                        className="form-control"
                                                        placeholder={`รายละเอียดงาน`}
                                                        value={specialWorkTimeDay.workDetail}
                                                        onChange={handleInputChange}
                                                    />

                                                </div>

                                                <br />
                                                <br />
                                                <br />

                                            </div>
                                        </div>
                                        {/* <button onClick={() => console.log(workTimeDay)}>Submit</button> */}
                                        <div class="row">
                                            {/* ... (Your other components) ... */}
                                            <button type="button" aria-label="เพิ่มรายการวันทำงาน" className="btn btn-primary ml-auto"
                                                onClick={handleAddTimeList}
                                            >
                                                เพิ่ม
                                            </button>
                                        </div>
                                        <br />
                                        <br />


                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={headerCellStyle}>วันที่</th>
                                                    <th style={headerCellStyle}>ข้อมูล</th>
                                                    <th style={headerCellStyle}>รายละเอียดงาน</th>
                                                    <th style={headerCellStyle}>ลบ</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {specailWorkTimeDayList.map((item, index) => (
                                                    <tr>
                                                        <td style={cellStyle}>
                                                            {item.day}
                                                        </td>

                                                        <td style={cellStyle}>
                                                            {item.shift} เวลา {item.startTime} ถึง {item.endTime} เวลาทำงาน OT {item.startTimeOT} ถึง {item.endTimeOT}<br />
                                                            อัตราค่าจ้างทำงานพิเศษ {item.payment} OT {item.paymentOT}<br />

                                                            {item.employees.map((item1, index1) => (
                                                                <>
                                                                    {item1.positionWork} {item1.countPerson} คน<br />
                                                                </>
                                                            ))}
                                                        </td>

                                                        <td style={cellStyle}>
                                                            {item.workDetail}
                                                        </td>
                                                        <td style={cellStyle}>
                                                            <button type="button"
                                                                onClick={() => handleRemoveTimeList(index)}
                                                                className="btn btn-danger ml-auto" >
                                                                ลบ
                                                            </button>
                                                        </td>

                                                    </tr>

                                                )

                                                )}

                                            </tbody>
                                        </table>
                                    </section>
                                    <div class="line_btn">
                                        {newWorkplace ? (
                                            <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;สร้างหน่วยงานใหม่</button>
                                        ) : (
                                            <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>

                                        )}
                                        <button class="btn clean"><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
                                    </div>
                                </form>
                            </section>


                        </div >
                        {/* <!-- /.container-fluid --> */}
                    </section >
                    {/* <!-- /.content --> */}
                </div >

            </div >
            {/* {JSON.stringify(workTimeDayPersonList, null, 2)} */}
        </body >
    );
}

export default SettingSpecial