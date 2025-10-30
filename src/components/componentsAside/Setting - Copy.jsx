import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';
import Calendar from 'react-calendar';
import '../editwindowcss.css';
import EmployeeWorkDay from './componentsetting/EmployeeWorkDay';


function Setting() {
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


    // Handle form submission
    const handleAddSpecialWorktime = (e) => {
        e.preventDefault();

        if (selectedDay1 !== '') {
            if (spWorkStart1 || spWorkEnd1 || spWorkStart2 || spWorkEnd2 || spWorkStart3 || spWorkEnd3 !== '') {
                const newData = {
                    day: selectedDay1,
                    spWorkStart1: spWorkStart1,
                    spWorkEnd1: spWorkEnd1,
                    spWorkStart2: spWorkStart2,
                    spWorkEnd2: spWorkEnd2,
                    spWorkStart3: spWorkStart3,
                    spWorkEnd3: spWorkEnd3,
                };

                setListSpecialWorktime((prevData) => [...prevData, newData]);

                // Reset the form fields after submitting
                setSelectedDay1('');
                setSpWorkStart1('');
                setSpWorkEnd1('');
                setSpWorkStart2('');
                setSpWorkEnd2('');
                setSpWorkStart3('');
                setSpWorkEnd3('');

            } else {
                alert("กรุณากรอกข้อมูลเวลาปฏิบัติงานที่ต้องการเพิ่ม");
            }

        }

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

    const handleSearchAndDelete = (searchDay, searchPosition) => {
        const updatedList = listEmployeeDay.filter(
            (entry) => entry.day !== searchDay || entry.position !== searchPosition
        );
        setListEmployeeDay(updatedList);
    };

    const handleDeleteSpecialWorktime = (searchDay) => {
        const updatedList = listSpecialWorktime.filter(
            (entry) => entry.day !== searchDay);
        setListSpecialWorktime(updatedList);
    };

    //test 

    const styles = {
        th: {
            minWidth: "3rem"
        }
    };

    const [newWorkplace, setNewWorkplace] = useState(true);



    const [selectedDates, setSelectedDates] = useState([]);
    const [reason, setReason] = useState('');

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    // const handleDateChange = (date) => {
    //     setSelectedDates((prevDates) => [...prevDates, date]);
    // };
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
                    alert(day + '/' + month + '/' + year + '  Selected date already exists in the list.');
                }
                setDay('');
                setMonth('');
                setYear(new Date().getFullYear());
            } else {
                // Show alert for invalid date selection
                alert(day / month / year + 'Invalid date selection. Please select a valid day, month, and year.');
            }
        } else {
            // Show alert for invalid date selection
            alert('Invalid date selection. Please select a day, month, and year.');
        }
    };

    const handleRemoveDate = (dateToRemove) => {
        setSelectedDates((prevDates) =>
            prevDates.filter((date) => date !== dateToRemove)
        );
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    // const [daysOff, setDaysOff] = useState(Array(10).fill(''));
    const [holidayComment, setHolidayComment] = useState('');
    // const handleDayOffChange = (index, value) => {
    //     const updatedDaysOff = [...daysOff];
    //     updatedDaysOff[index] = value;
    //     setDaysOff(updatedDaysOff);
    // };

    // const handleAddDayOff = () => {
    //     setDaysOff([...daysOff, '']);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Perform any necessary actions with the daysOff and holidayComment data
    //     console.log(daysOff);
    //     console.log(holidayComment);
    // };

    const [employeeIdList, setEmployeeIdList] = useState([]); //รหัสพนักงาน
    const [employeeNameList, setEmployeeNameList] = useState([]); //ชื่อพนักงานที่สังกัด

    const [newEmployeeIdList, setNewEmployeeIdList] = useState('');
    const [newEmployeeNameList, setNewEmployeeNameList] = useState('');

    const handleVaccination = (event) => {
        setNewEmployeeIdList(event.target.value);
    };

    const handleVaccination2 = (event) => {
        setNewEmployeeNameList(event.target.value);
    };

    const handleAddVaccination = () => {
        if (newEmployeeIdList.trim() !== '') {
            setEmployeeIdList([...employeeIdList, newEmployeeIdList]);
            setNewEmployeeIdList('');
        };

        if (newEmployeeNameList.trim() !== '') {
            setEmployeeNameList([...employeeNameList, newEmployeeNameList]);
            setNewEmployeeNameList('');
        }
    };




    const handleRemoveVaccination = (vaccinationToRemove) => {
        setEmployeeIdList((prevVaccination) =>
            prevVaccination.filter((v) => v !== vaccinationToRemove)
        );

        setEmployeeNameList((prevVaccination2) =>
            prevVaccination2.filter((v) => v !== vaccinationToRemove)
        );
    };






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

    // const handleDeleteInput = (index) => {
    //     const newFormData = [...formData];
    //     newFormData.splice(index, 1);
    //     setFormData(newFormData);

    //     const newShowAdditionalInput = [...showAdditionalInput];
    //     newShowAdditionalInput.splice(index, 1);
    //     setShowAdditionalInput(newShowAdditionalInput);
    // };

    const handleDeleteInput = (index) => {
        const newAddSalary = [...formData.addSalary];
        newAddSalary.splice(index, 1);

        setFormData({
            ...formData,
            addSalary: newAddSalary
        });

        const newShowAdditionalInput = [...showAdditionalInput];
        newShowAdditionalInput.splice(index, 1);
        setShowAdditionalInput(newShowAdditionalInput);
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

        // console.log(workplace);
        // // console.log(initialFormData);
        // console.log("formData", formData);



    }

    const handleCheckboxChange1 = () => {
        setWorkday1(!workday1);
    };
    const handleCheckboxChange2 = () => {
        setWorkday2(!workday2);
    };
    const handleCheckboxChange3 = () => {
        setWorkday3(!workday3);
    };
    const handleCheckboxChange4 = () => {
        setWorkday4(!workday4);
    };
    const handleCheckboxChange5 = () => {
        setWorkday5(!workday5);
    };
    const handleCheckboxChange6 = () => {
        setWorkday6(!workday6);
    };
    const handleCheckboxChange7 = () => {
        setWorkday7(!workday7);
    };

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

    // const [formData, setFormData] = useState([]);
    // const [showAdditionalInput, setShowAdditionalInput] = useState([]);

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

    // const handleAddInput = () => {
    //     setFormData([...formData, { name: '', SpSalary: '', StaffType: '', nameType: '' }]);
    //     setShowAdditionalInput([...showAdditionalInput, false]);
    // };

    // const handleDeleteInput = (index) => {
    //     const newFormData = [...formData];
    //     newFormData.splice(index, 1);
    //     setFormData(newFormData);

    //     const newShowAdditionalInput = [...showAdditionalInput];
    //     newShowAdditionalInput.splice(index, 1);
    //     setShowAdditionalInput(newShowAdditionalInput);
    // };

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
                            <form onSubmit={handleManageWorkplace}>
                                <h2 class="title">ตั้งค่าหน่วยงาน</h2>
                                <section class="Frame">
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="workplaceId">รหัสหน่วยงาน</label>
                                                    <input type="text" class="form-control" id="workplaceId" placeholder="รหัสหน่วยงาน" value={workplaceId} onChange={(e) => setWorkplaceId(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="workplaceName">ชื่อหน่วยงาน</label>
                                                    <input type="text" class="form-control" id="workplaceName" placeholder="ชื่อหน่วยงาน" value={workplaceName} onChange={(e) => setWorkplaceName(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="workplaceArea">สถานที่ปฏิบัติงาน</label>
                                                    <input type="text" class="form-control" id="workplaceArea" placeholder="สถานที่ปฏิบัติงาน" value={workplaceArea} onChange={(e) => setWorkplaceArea(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="workOfWeek">จำนวนวันทำงานต่อสัปดาห์</label>
                                                    <input type="text" class="form-control" id="workOfWeek" placeholder="จำนวนวันทำงานต่อสัปดาห์" value={workOfWeek} onChange={(e) => setWorkOfWeek(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <h2 class="title">เวลา เข้า-ออก งาน</h2>
                                <div class="row">
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>กะเช้า</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStart1">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStart1" placeholder="เวลาเข้างาน" value={workStart1} onChange={(e) => setWorkStart1(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEnd1">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEnd1" placeholder="เวลาออกงาน" value={workEnd1} onChange={(e) => setWorkEnd1(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                            {/* <!--col-md-12--> */}
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>กะบ่าย</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStart2">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStart2" placeholder="เวลาเข้างาน" value={workStart2} onChange={(e) => setWorkStart2(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEnd2">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEnd2" placeholder="เวลาออกงาน" value={workEnd2} onChange={(e) => setWorkEnd2(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>กะดึก</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStart3">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStart3" placeholder="เวลาเข้างาน" value={workStart3} onChange={(e) => setWorkStart3(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEnd3">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEnd3" placeholder="เวลาออกงาน" value={workEnd3} onChange={(e) => setWorkEnd3(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>
                                <h2 class="title">เวลา เข้า-ออก งาน OT</h2>
                                <div class="row">
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>OT กะเช้า</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStartOt1">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStartOt1" placeholder="เวลาเข้างาน" value={workStartOt1} onChange={(e) => setWorkStartOt1(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEndOt1">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEndOt1" placeholder="เวลาออกงาน" value={workEndOt1} onChange={(e) => setWorkEndOt1(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                            {/* <!--col-md-12--> */}
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>OT กะบ่าย</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStartOt2">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStartOt2" placeholder="เวลาเข้างาน" value={workStartOt2} onChange={(e) => setWorkStartOt2(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEndOt2">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEndOt2" placeholder="เวลาออกงาน" value={workEndOt2} onChange={(e) => setWorkEndOt2(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-4">
                                        <section class="Frame">
                                            <label>OT กะดึก</label>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workStartOt3">เวลาเข้างาน</label>
                                                            <input type="text" class="form-control" id="workStartOt3" placeholder="เวลาเข้างาน" value={workStartOt3} onChange={(e) => setWorkStartOt3(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workEndOt3">เวลาออกงาน</label>
                                                            <input type="text" class="form-control" id="workEndOt3" placeholder="เวลาออกงาน" value={workEndOt3} onChange={(e) => setWorkEndOt3(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>

                                <h2 class="title">เวลาทำงาน</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="workOfHour">ชั่วโมงทำงาน</label>
                                                <input type="text" class="form-control" id="workOfHour" placeholder="ชั่วโมงทำงาน" value={workOfHour} onChange={(e) => setWorkOfHour(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="workOfOT">ชั่วโมง OT</label>
                                                <input type="text" class="form-control" id="workOfOT" placeholder="ชั่วโมง OT" value={workOfOT} onChange={(e) => setWorkOfOT(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <h2 class="title">ค่าจ้าง</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="workRate">อัตราค่าจ้าง รายวัน</label>
                                                <input type="text" class="form-control" id="workRate" placeholder="อัตราค่าจ้าง รายวัน" value={workRate} onChange={(e) => setWorkRate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="workRateOT">อัตราค่าจ้าง OT รายชั่วโมง</label>
                                                <input type="text" class="form-control" id="workRateOT" placeholder="อัตราค่าจ้าง OT รายชั่วโมง" value={workRateOT} onChange={(e) => setWorkRateOT(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="workTotalPeople">จำนวนพนักงานที่ปฏิบัติงาน</label>
                                                <input type="text" class="form-control" id="workTotalPeople" placeholder="จำนวนพนักงานที่ปฏิบัติงาน" value={workTotalPeople} onChange={(e) => setWorkTotalPeople(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="dayoffRate">อัตราค่าจ้างวันหยุดประจำสัปดาห์</label>
                                                <input type="text" class="form-control" id="dayoffRate" placeholder="อัตราค่าจ้างวันหยุดประจำสัปดาห์" value={dayoffRate} onChange={(e) => setDayoffRate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="dayoffRateHour">อัตราค่าจ้างวันหยุดประจำสัปดาห์รายชั่วโมง</label>
                                                <input type="text" class="form-control" id="dayoffRateHour" placeholder="อัตราค่าจ้างวันหยุดประจำสัปดาห์รายชั่วโมง" value={dayoffRateHour} onChange={(e) => setDayoffRateHour(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="dayoffRateOT">อัตราค่าจ้าง OT วันหยุดประจำสัปดาห์รายชั่วโมง</label>
                                                <input type="text" class="form-control" id="dayoffRateOT" placeholder="อัตราค่าจ้าง OT วันหยุดประจำสัปดาห์รายชั่วโมง" value={dayoffRateOT} onChange={(e) => setDayoffRateOT(e.target.value)} />
                                            </div>
                                        </div>

                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="holiday">อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายวัน</label>
                                                <input type="text" class="form-control" id="holiday" placeholder="อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายวัน" value={holiday} onChange={(e) => setHoliday(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="holidayHour">อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง</label>
                                                <input type="text" class="form-control" id="holidayHour" placeholder="อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง" value={holidayHour} onChange={(e) => setHolidayHour(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="holidayOT">อัตราค่าจ้างวันหยุดนักขัตฤกษ์ OT รายชั่วโมง</label>
                                                <input type="text" class="form-control" id="holidayOT" placeholder="อัตราค่าจ้างวันหยุดนักขัตฤกษ์ OT รายชั่วโมง" value={holidayOT} onChange={(e) => setHolidayOT(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <h2 class="title">สวัสดิการเงินเพิ่มพนักงาน</h2>
                                <section class="Frame">
                                    {/* <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd1">ค่ารถ</label>
                                                <input type="text" class="form-control" id="salaryadd1" placeholder="ค่ารถ" value={salaryadd1} onChange={(e) => setSalaryadd1(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd2">ค่าอาหาร</label>
                                                <input type="text" class="form-control" id="salaryadd2" placeholder="ค่าอาหาร" value={salaryadd2} onChange={(e) => setSalaryadd2(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd3">เบี้ยขยัน</label>
                                                <input type="text" class="form-control" id="salaryadd3" placeholder="เบี้ยขยัน" value={salaryadd3} onChange={(e) => setSalaryadd3(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd4">เงินพิเศษอื่นๆ</label>
                                                <input type="text" class="form-control" id="salaryadd4" placeholder="เงินพิเศษอื่นๆ" value={salaryadd4} onChange={(e) => setSalaryadd4(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd5">ค่าโทรศัพท์</label>
                                                <input type="text" class="form-control" id="salaryadd5" placeholder="ค่าโทรศัพท์" value={salaryadd5} onChange={(e) => setSalaryadd5(e.target.value)} />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label role="salaryadd6">เงินประจำตำแหน่ง</label>
                                                <input type="text" class="form-control" id="salaryadd6" placeholder="เงินประจำตำแหน่ง" value={salaryadd6} onChange={(e) => setSalaryadd6(e.target.value)} />
                                            </div>
                                        </div>
                                    </div> */}

                                    {formData.addSalary && formData.addSalary.length > 0 && formData.addSalary.map((data, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-md-1">
                                                <label role="codeSpSalary">รหัส</label>
                                                <input
                                                    type="text"
                                                    name="codeSpSalary"
                                                    className="form-control"
                                                    value={data.codeSpSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'codeSpSalary')}
                                                />
                                            </div>
                                            {/* <div className="col-md-1">
                                                <label role="SpSalary">จำนวนเงิน</label>
                                                <input
                                                    type="text"
                                                    name="SpSalary"
                                                    className="form-control"
                                                    value={data.SpSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'SpSalary')}
                                                />
                                            </div> */}
                                            <div className="col-md-2">
                                                <label role="name">ชื่อรายการ</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={data.name}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'name')}
                                                />
                                            </div>
                                            <div className="col-md-1">
                                                <label role="SpSalary">จำนวนเงิน</label>
                                                <input
                                                    type="text"
                                                    name="SpSalary"
                                                    className="form-control"
                                                    value={data.SpSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'SpSalary')}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label role="roundOfSalary">ประเภทพนักงาน</label>
                                                <select
                                                    name="roundOfSalary"
                                                    className="form-control"
                                                    value={data.roundOfSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'roundOfSalary')}
                                                >
                                                    <option value="">เลือก</option>
                                                    <option value="daily">รายวัน</option>
                                                    <option value="monthly">รายเดือน</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2">
                                                <label role="StaffType">ประเภทพนักงาน</label>
                                                <select
                                                    name="StaffType"
                                                    className="form-control"
                                                    value={data.StaffType}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'StaffType')}
                                                >
                                                    <option value="">เลือกตำแหน่งที่จะมอบให้</option>
                                                    <option value="all">ทั้งหมด</option>
                                                    <option value="header">หัวหน้างาน</option>
                                                    <option value="custom">กำหนดเอง</option>
                                                </select>
                                            </div>
                                            {data.StaffType === 'custom' && (
                                                <div className="col-md-2">
                                                    <label>ตำแหน่ง</label>
                                                    <input
                                                        type="text"
                                                        name="additionalInput"
                                                        className="form-control"
                                                        value={data.nameType}
                                                        onChange={(e) => handleChangeSpSalary(e, index, 'nameType')}
                                                    />
                                                </div>
                                            )}
                                            <div className="col-md-1">
                                                <button onClick={() => handleDeleteInput(index)} className="btn btn-danger" style={{ width: "3rem", position: 'absolute', bottom: '0' }}>ลบ</button>
                                            </div>
                                        </div>

                                    ))}
                                    <br />
                                    < button type='button' onClick={handleAddInput} class="btn btn-primary" >เพิ่ม</button>
                                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                                </section>
                                {/* <!--Frame--> */}
                                <h2 class="title">สวัสดิการวันหยุดพนักงาน</h2>
                                <div class="row">
                                    <div class="col-md-12">
                                        <section class="Frame">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="personalLeaveNumber">รหัส</label>
                                                            <input type="text" class="form-control" id="personalLeaveNumber" placeholder="รหัส" value={personalLeaveNumber} onChange={(e) => setPersonalLeaveNumber(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="personalLeave">วันลากิจ</label>
                                                            <input type="text" class="form-control" id="personalLeave" placeholder="วันลากิจ" value={personalLeave} onChange={(e) => setPersonalLeave(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="personalLeaveRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="personalLeaveRate" placeholder="จำนวนเงินต่อวัน" value={personalLeaveRate} onChange={(e) => setPersonalLeaveRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="SickLeaveNumber">รหัส</label>
                                                            <input type="text" class="form-control" id="SickLeaveNumber" placeholder="รหัส" value={sickLeaveNumber} onChange={(e) => setSickLeaveNumber(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="sickLeave">วันลาป่วย</label>
                                                            <input type="text" class="form-control" id="sickLeave" placeholder="วันลาป่วย" value={sickLeave} onChange={(e) => setSickLeave(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="sickLeaveRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="sickLeaveRate" placeholder="จำนวนเงินต่อวัน" value={sickLeaveRate} onChange={(e) => setSickLeaveRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="setWorkRateDayoffNumber">รหัส</label>
                                                            <input type="text" class="form-control" id="setWorkRateDayoffNumber" placeholder="รหัส" value={workRateDayoffNumber} onChange={(e) => setWorkRateDayoffNumber(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="workRateDayoff">วันลาพักร้อน</label>
                                                            <input type="text" class="form-control" id="workRateDayoff" placeholder="วันลาพักร้อน" value={workRateDayoff} onChange={(e) => setWorkRateDayoff(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label role="workRateDayoffRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="workRateDayoffRate" placeholder="จำนวนเงินต่อวัน" value={workRateDayoffRate} onChange={(e) => setworkRateDayoffRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}

                                    </div >


                                </div >

                                <section class="Frame">

                                    <div class="col-md-12">
                                        <div class="col-md-12">

                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <h2 class="title">ตั้งค่ารายวัน</h2>
                                                        <div class="row">
                                                            <div class="col-md-3">
                                                                <section class="Frame">

                                                                    <div class="row">

                                                                        <label>วันในสัปดาห์:</label>

                                                                        <div class="col-md-6">

                                                                            <select className="form-control" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                                                                                <option value="">เลือกวัน</option>
                                                                                {daysOfWeek.map((day) => (
                                                                                    <option key={day} value={day}>
                                                                                        {day}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div class="row">

                                                                        <label>ตำแหน่งงาน:</label>
                                                                        <div class="col-md-6">

                                                                            <select className="form-control" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                                                                                <option value="">เลือกตำแหน่ง</option>
                                                                                {positions.map((position) => (
                                                                                    <option key={position} value={position}>
                                                                                        {position}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div>
                                                                        <label>Number of Employees:</label>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="number"
                                                                            value={numberOfEmployees}
                                                                            className="form-control"
                                                                            onChange={(e) => setNumberOfEmployees(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <br />
                                                                    <button type="button" class="btn btn-primary" onClick={handleSubmit} >เพิ่ม</button>
                                                                </section>
                                                            </div>
                                                            <div class="col-md-9">
                                                                <section class="Frame">
                                                                    <label>วันในสัปดาห์:</label>
                                                                    <div class="row">
                                                                        <div class="col-md-6">

                                                                            <select className="form-control" value={selectedDay1} onChange={(e) => setSelectedDay1(e.target.value)}>
                                                                                <option value="">เลือกวัน</option>
                                                                                {daysOfWeek.map((day) => (
                                                                                    <option key={day} value={day}>
                                                                                        {day}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div class="col-md-6">

                                                                            <button type="button" class="btn btn-primary" onClick={handleAddSpecialWorktime}>เพิ่มเวลาทำงาน</button>

                                                                        </div>
                                                                    </div>


                                                                    <br />

                                                                    <div class="row">

                                                                        <div class="col-md-4">

                                                                            <section class="Frame">
                                                                                <label>กะเช้า</label>
                                                                                <div class="col-md-12">
                                                                                    <div class="row">
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkStart1">เวลาเข้างาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkStart1" placeholder="เวลาเข้างาน" value={spWorkStart1} onChange={(e) => setSpWorkStart1(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkEnd1">เวลาออกงาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkEnd1" placeholder="เวลาออกงาน" value={spWorkEnd1} onChange={(e) => setSpWorkEnd1(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* <!--row--> */}
                                                                                </div>
                                                                                {/* <!--col-md-12--> */}
                                                                            </section>
                                                                            {/* <!--Frame--> */}
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <section class="Frame">
                                                                                <label>กะบ่าย</label>
                                                                                <div class="col-md-12">
                                                                                    <div class="row">
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkStart2">เวลาเข้างาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkStart2" placeholder="เวลาเข้างาน" value={spWorkStart2} onChange={(e) => setSpWorkStart2(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkEnd2">เวลาออกงาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkEnd2" placeholder="เวลาออกงาน" value={spWorkEnd2} onChange={(e) => setSpWorkEnd2(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* <!--row--> */}
                                                                                </div>
                                                                            </section>
                                                                            {/* <!--Frame--> */}
                                                                        </div>
                                                                        <div class="col-md-4">
                                                                            <section class="Frame">
                                                                                <label>กะดึก</label>
                                                                                <div class="col-md-12">
                                                                                    <div class="row">
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkStart3">เวลาเข้างาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkStart3" placeholder="เวลาเข้างาน" value={spWorkStart3} onChange={(e) => setSpWorkStart3(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="col-md-6">
                                                                                            <div class="form-group">
                                                                                                <label role="spWorkEnd3">เวลาออกงาน</label>
                                                                                                <input type="text" class="form-control" id="spWorkEnd3" placeholder="เวลาออกงาน" value={spWorkEnd3} onChange={(e) => setSpWorkEnd3(e.target.value)} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {/* <!--row--> */}
                                                                                </div>
                                                                            </section>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </div>
                                                        <div class="row">

                                                        </div>
                                                        <br />
                                                        <label role="personalLeave">วันทำงาน</label>
                                                        <div class="container" style={{ overflowX: 'scroll' }}>
                                                            <table id="" class="table table-bordered ">
                                                                <thead>
                                                                    <tr>
                                                                        <th style={styles.th} id="test">วันจันทร์</th>
                                                                        <th style={styles.th} id="test">อังคาร</th>
                                                                        <th style={styles.th} id="test">พุธ</th>
                                                                        <th style={styles.th} id="test">พฤหัส</th>
                                                                        <th style={styles.th} id="test">ศุกร์</th>
                                                                        <th style={styles.th} id="test">เสาร์</th>
                                                                        <th style={styles.th} id="test">อาทิตย์</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday1} onChange={handleCheckboxChange1} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday2} onChange={handleCheckboxChange2} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday3} onChange={handleCheckboxChange3} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday4} onChange={handleCheckboxChange4} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday5} onChange={handleCheckboxChange5} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday6} onChange={handleCheckboxChange6} /></td>
                                                                        <td><input type="checkbox" class="form-control" name='' checked={workday7} onChange={handleCheckboxChange7} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            {listMonday.length >= 1 ? (
                                                                                listMonday.map(item => (

                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-danger"
                                                                                                style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                        </div>

                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br />
                                                                                            </span>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-danger"
                                                                                                style={{ height: '3rem', width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                        </div>

                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listTuesday.length >= 1 ? (
                                                                                listTuesday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>

                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))


                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listWednesday.length >= 1 ? (
                                                                                listWednesday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>


                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listThursday.length >= 1 ? (
                                                                                listThursday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>


                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listFriday.length >= 1 ? (
                                                                                listFriday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>


                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listSaturday.length >= 1 ? (
                                                                                listSaturday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>

                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {listSunday.length >= 1 ? (
                                                                                listSunday.map(item => (
                                                                                    (item.position ? (
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <span>{item.position}: {item.employees}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleSearchAndDelete(item.day, item.position)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="d-flex justify-content-between align-items-end">
                                                                                            <span>
                                                                                                เช้า:{item.spWorkStart1} - {item.spWorkEnd1}<br />
                                                                                                บ่าย:{item.spWorkStart2} - {item.spWorkEnd2}<br />
                                                                                                ดึก:{item.spWorkStart3} - {item.spWorkEnd13}<br /></span>


                                                                                            <button
                                                                                                type="button"
                                                                                                class="btn btn-danger" style={{ width: '3rem' }}
                                                                                                onClick={() => handleDeleteSpecialWorktime(item.day)}
                                                                                            >
                                                                                                ลบ
                                                                                            </button>
                                                                                            <br />

                                                                                        </div>
                                                                                    ))

                                                                                )
                                                                                )
                                                                            ) : (
                                                                                <td></td>
                                                                            )}
                                                                        </td>

                                                                    </tr>

                                                                    {/* <tr>
                                                                            <td><input type="text" class="form-control" name='' value={workcount1} onChange={(e) => setWorkcount1(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount2} onChange={(e) => setWorkcount2(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount3} onChange={(e) => setWorkcount3(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount4} onChange={(e) => setWorkcount4(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount5} onChange={(e) => setWorkcount5(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount6} onChange={(e) => setWorkcount6(e.target.value)} /></td>
                                                                            <td><input type="text" class="form-control" name='' value={workcount7} onChange={(e) => setWorkcount7(e.target.value)} /></td>
                                                                        </tr> */}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!--row--> */}
                                        </div>
                                        {/* <!--Frame--> */}
                                    </div>
                                </section>
                                <h2 class="title">วันหยุดหน่วยงาน</h2>
                                <section class="Frame">
                                    <div>
                                        <label>เลือกวันหยุดของหน่วยงาน:</label>
                                        {/* <DatePicker
                                            className="form-control"
                                            popperClassName="datepicker-popper"
                                            selected={null}
                                            onChange={handleDateChange}
                                            // dateFormat="MMMM d, yyyy"
                                            dateFormat="dd/mm/YYYY"
                                            isClearable
                                            placeholderText="Select a date"
                                        /> */}
                                        <div>
                                            <label style={{ marginRight: '0.5rem' }}>เดือน:</label>
                                            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                                                <option value="">Select month</option>
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                    <option key={month} value={month}>
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                            <label style={{ margin: '0.5rem' }}>วันที่:</label>
                                            <select value={day} onChange={(e) => setDay(e.target.value)}>
                                                <option value="">Select day</option>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                    <option key={day} value={day}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>
                                            <label style={{ margin: '0.5rem' }}>ปี:</label>
                                            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ margin: '0.5rem' }}>
                                                <option value="">Select year</option>
                                                {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() + 3 - i).map(
                                                    (year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <button type="button" className="btn btn-primary" onClick={handleAddDate}>
                                                เพิ่ม
                                            </button>
                                        </div>
                                        {/* {selectedDates.length > 0 && (
                                            <div>
                                                <h3>วันหยุดหน่วยงาน</h3>
                                                <ul>
                                                    {selectedDates.map((date) => (
                                                        <li key={date.toString()}>
                                                            {date.toLocaleDateString()}{' '}
                                                            <button type="button" onClick={() => handleRemoveDate(date)} class="btn clean" style={{ margin: '0.5rem' }}>
                                                                ลบออก
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )} */}
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
                                    <div>
                                        <label>หมายเหตุ:</label>
                                        <input type="text" class="form-control" value={reason} onChange={handleReasonChange} />
                                    </div>
                                </section>

                                <h2 class="title">พนักงานในสังกัด</h2>
                                <section class="Frame">
                                    <div>
                                        {/* <div class="row">
                                            <div class="col-md-6">
                                                <label role="vaccination">รหัสพนักงาน:</label>
                                                <input
                                                    class="form-control"
                                                    type="text"
                                                    name="vaccination"
                                                    id="vaccination"
                                                    value={newEmployeeIdList}
                                                    onChange={handleVaccination}
                                                    placeholder="รหัสพนักงาน"
                                                />
                                            </div>
                                            <div class="col-md-6">
                                                <label role="vaccination">ชื่อพนักงานที่สังกัด:</label>
                                                <input
                                                    class="form-control"
                                                    type="text"
                                                    name="EmployeeNameList"
                                                    id="EmployeeNameList"
                                                    value={newEmployeeNameList}
                                                    onChange={handleVaccination2}
                                                    placeholder="ชื่อพนักงานที่สังกัด"
                                                />
                                            </div>
                                        </div>
                                        <br />
                                        <button type="button" class="btn btn-primary" onClick={handleAddVaccination}>เพิ่ม</button>
                                        <br />
                                        <br /> */}
                                        {/* {showEmployeeListResult.length > 0 && (
                                            <h2>พนักงานในหน่วยงาน {showEmployeeListResult.length} คน</h2>

                                        )

                                        } */}
                                        {showEmployeeListResult.length > 0 && (
                                            <>
                                                <h2>พนักงานในหน่วยงาน {showEmployeeListResult.length} คน</h2>
                                                <ul>
                                                    {showEmployeeListResult.map((employee, index) => (
                                                        <li key={index}>{employee.employeeId}: {employee.name} {employee.lastName}</li>
                                                        // Replace "name" with the property you want to display for each employee
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {/* {employeeIdList.length > 0 && (
                                        <h2>รายการที่เพิ่ม</h2>
                                        <ul>
                                            {employeeIdList.map((employeeId, index) => (
                                                <li key={index}>
                                                    {employeeId} - {employeeNameList[index]}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVaccination(employeeId)}
                                                        className="btn btn-info"
                                                        style={{ margin: '0.5rem', width: "4rem" }}
                                                    >
                                                        ลบ
                                                    </button>
                                                </li>
                                            ))}

                                        </ul>
                                        )} */}
                                        {/* 
                                        {employeeIdList.length > 0 && (
                                            <div>
                                                <h2>รายการที่เพิ่ม</h2>
                                                <ul>
                                                    {employeeIdList.map((employeeId, index) => (
                                                        <li key={index}>
                                                            {employeeId} - {employeeNameList[index]}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveVaccination(employeeId)}
                                                                className="btn btn-info"
                                                                style={{ margin: '0.5rem', width: "4rem" }}
                                                            >
                                                                ลบ
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )} */}
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <div class="line_btn">
                                    {newWorkplace ? (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;สร้างหน่วยงานใหม่</button>
                                    ) : (
                                        <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>

                                    )}
                                    <button class="btn clean"><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
                                </div>

                            </form >

                        </div >
                        {/* <!-- /.container-fluid --> */}
                    </section >
                    {/* <!-- /.content --> */}
                </div >

            </div >

        </body >
    );
}

export default Setting