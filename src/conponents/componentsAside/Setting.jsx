import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';

// import { DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
// import "./CalendarStyles.css";
import Calendar from 'react-calendar';


function Setting() {
    const [newWorkplace, setNewWorkplace] = useState(true);


    const [daysOff, setDaysOff] = useState(Array(10).fill(''));
    const [holidayComment, setHolidayComment] = useState('');
    const handleDayOffChange = (index, value) => {
        const updatedDaysOff = [...daysOff];
        updatedDaysOff[index] = value;
        setDaysOff(updatedDaysOff);
    };

    const handleAddDayOff = () => {
        setDaysOff([...daysOff, '']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform any necessary actions with the daysOff and holidayComment data
        console.log(daysOff);
        console.log(holidayComment);
    };


    //Workplace data
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
    const [workOfHour, setWorkOfHour] = useState(''); //ชั่วโมงทำงานต่อสัปดาห์
    const [workOfOT, setWorkOfOT] = useState(''); //ชั่วโมง OT ต่อสัปดาห์

    const [workRate, setWorkRate] = useState(''); //ค่าจ้างต่อวัน
    const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
    const [workTotalPeople, setWorkTotalPeople] = useState(''); //จำนวนคนในหน่วยงาน
    const [holiday, setHoliday] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ 
    const [holidayHour, setHolidayHour] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง
    const [salaryadd1, setSalaryadd1] = useState(''); //ค่ารถ
    const [salaryadd2, setSalaryadd2] = useState(''); //ค่าอาหาร
    const [salaryadd3, setSalaryadd3] = useState(''); //เบี้ยขยัน
    const [salaryadd4, setSalaryadd4] = useState(''); //เงินพิเศษอื่นๆ
    const [salaryadd5, setSalaryadd5] = useState(''); //ค่าโทรศัพท์
    const [salaryadd6, setSalaryadd6] = useState(''); //เงินประจำตำแหน่ง
    const [personalLeave, setPersonalLeave] = useState(''); //วันลากิจ
    const [personalLeaveRate, setPersonalLeaveRate] = useState(''); //จ่ายเงินลากิจ
    const [sickLeave, setSickLeave] = useState(''); //วันลาป่วย
    const [sickLeaveRate, setSickLeaveRate] = useState(''); //จ่ายเงินวันลาป่วย
    const [workRateDayoff, setWorkRateDayoff] = useState(''); //ค่าจ้างวันหยุด ต่อวัน
    const [workRateDayoffRate, setworkRateDayoffRate] = useState('');
    // const [daysOff , setDaysOff] = useState([{ date: '' }]);
    const [workplaceAddress, setWorkplaceAddress] = useState(''); //ที่อยู่หน่วยงาน

    // const [workRateDayoffHour, setWorkRateDayoffHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง

    const [holidaycomment, setHolidaycomment] = useState(''); //วันหยุด
    const [holidaycomment2, setHolidaycomment2] = useState(''); //วันหยุด
    const [holidaycomment3, setHolidaycomment3] = useState(''); //วันหยุด
    const [holidaycomment4, setHolidaycomment4] = useState(''); //วันหยุด
    const [holidaycomment5, setHolidaycomment5] = useState(''); //วันหยุด
    const [holidaycomment6, setHolidaycomment6] = useState(''); //วันหยุด
    const [holidaycomment7, setHolidaycomment7] = useState(''); //วันหยุด
    const [holidaycomment8, setHolidaycomment8] = useState(''); //วันหยุด
    const [holidaycomment9, setHolidaycomment9] = useState(''); //วันหยุด
    const [holidaycomment10, setHolidaycomment10] = useState(''); //วันหยุด


    // const [travelRate, setTravelRate] = useState(''); //ค่ารถ
    // const [mealRate, setMealRate] = useState(''); //ค่าอาหาร
    // const [workOT, setWorkOT] = useState(''); //เบี้ยขยัน
    // const [workanything, setWorkanything] = useState(''); //เงินพิเศษอื่นๆ
    // const [phonebill, setPhoneBill] = useState(''); //ค่าโทรศัพท์
    // const [workPosition, setWorkPosition] = useState(''); //เงินประจำตำแนหง

    // const [remainbusinessleave, setRemainbusinessleave] = useState(''); //ลาคงเหลือ วันลากิจคงเหลือ 
    // const [businessleavesalary, setBusinessleavesalary] = useState(''); //ลาคงเหลือ จำนวนเงินต่อวัน

    // const [remainsickleave, setRemainsickleave] = useState(''); //ลาคงเหลือ วันลาป่วยคงเหลือ 
    // const [sickleavesalary, setSickleavesalary] = useState(''); //ลาคงเหลือ จำนวนเงินต่อวัน

    // const [remainvacation, setRemainvacation] = useState(''); //ลาคงเหลือ วันลาพักร้อนคงเหลือ 
    // const [vacationsalary, setVacationsalary] = useState(''); //ลาคงเหลือ จำนวนเงินต่อวัน 




    const [startjob, setStartjob] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange = (date) => {
        setStartjob(date);
    };
    const [startjob2, setStartjob2] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange2 = (date) => {
        setStartjob2(date);
    };
    const [startjob3, setStartjob3] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange3 = (date) => {
        setStartjob3(date);
    };
    const [startjob4, setStartjob4] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange4 = (date) => {
        setStartjob4(date);
    };
    const [startjob5, setStartjob5] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange5 = (date) => {
        setStartjob5(date);
    };
    const [startjob6, setStartjob6] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange6 = (date) => {
        setStartjob6(date);
    };
    const [startjob7, setStartjob7] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange7 = (date) => {
        setStartjob7(date);
    };
    const [startjob8, setStartjob8] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange8 = (date) => {
        setStartjob8(date);
    };
    const [startjob9, setStartjob9] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange9 = (date) => {
        setStartjob9(date);
    };
    const [startjob10, setStartjob10] = useState(''); //วันที่เริ่มงาน
    const handleStartDateChange10 = (date) => {
        setStartjob10(date);
    };

    //set data to form
    function handleClickResult(workplace) {
        setNewWorkplace(false);

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
        setWorkOfHour(workplace.workOfHour);
        setWorkOfOT(workplace.workOfOT);
        setWorkRate(workplace.workRate);
        setWorkRateOT(workplace.workRateOT);
        setWorkTotalPeople(workplace.workTotalPeople);
        setHoliday(workplace.holiday);
        setHolidayHour(workplace.holidayHour);
        setSalaryadd1(workplace.salaryadd1);
        setSalaryadd2(workplace.salaryadd2);
        setSalaryadd3(workplace.salaryadd3);
        setSalaryadd4(workplace.salaryadd4);
        setSalaryadd5(workplace.salaryadd5);
        setSalaryadd6(workplace.salaryadd6);
        setPersonalLeave(workplace.personalLeave);
        setPersonalLeaveRate(workplace.personalLeaveRate);
        setSickLeave(workplace.sickLeave);
        setSickLeaveRate(workplace.sickLeaveRate);
        setWorkRateDayoff(workplace.workRateDayoff);
        setworkRateDayoffRate(workplace.workRateDayoffRate);
        // setDaysOff(workplace.daysOff );
        setWorkplaceAddress(workplace.workplaceAddress);


        // setWorkplaceId(workplace.workplaceId);
        // setWorkplaceName(workplace.workplaceName);
        // setWorkplaceArea(workplace.workplaceArea);
        // setWorkOfWeek(workplace.workOfWeek);
        // setWorkStart1(workplace.workkStart1);
        // setWorkEnd1(workplace.workEnd1);

        // setWorkStart2(workplace.workkStart2);
        // setWorkEnd2(workplace.workEnd2);
        // setWorkStart3(workplace.workStart3);
        // setWorkEnd3(workplace.workEnd3);
        // setWorkOfHour(workplace.workOfHour);
        // setWorkOfOT(workplace.workOfOT);

        // setWorkRate(workplace.workRate);
        // setWorkRateOT(workplace.workRateOT);
        // setWorkTotalPeople(workplace.workTotalPeople);
        // setWorkRateDayoff(workplace.workRateDayoff);
        // setWorkRateDayoffHour(workplace.workRateDayoffHour);
        // setWorkplaceAddress(workplace.workplaceAddress);

        // setHolidaycomment(workplace.holidaycomment);
        // setHolidaycomment2(workplace.holidaycomment2);
        // setHolidaycomment3(workplace.holidaycomment3);
        // setHolidaycomment4(workplace.holidaycomment4);
        // setHolidaycomment5(workplace.holidaycomment5);
        // setHolidaycomment6(workplace.holidaycomment6);
        // setHolidaycomment7(workplace.holidaycomment7);
        // setHolidaycomment8(workplace.holidaycomment8);
        // setHolidaycomment9(workplace.holidaycomment9);
        // setHolidaycomment10(workplace.holidaycomment10);

    }

    //data for search
    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [searchResult, setSearchResult] = useState([]);

    async function handleSearch(event) {
        event.preventDefault();
        // alert(searchWorkplaceId);
        // alert(searchWorkplaceName);

        //get value from form search        
        const data = {
            searchWorkplaceId: searchWorkplaceId,
            searchWorkplaceName: searchWorkplaceName
        };

        try {
            const response = await axios.post(endpoint + '/workplace/search', data);
            setSearchResult(response.data.workplaces);
            // setMessage(`ผลการค้นหา ${response.data.employees.length} รายการ`);
            // alert(response.data.workplaces.length);
            if (response.data.workplaces.length < 1) {
                window.location.reload();

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
            workOfHour: workOfHour,
            workOfOT: workOfOT,
            workRate: workRate,
            workRateOT: workRateOT,
            workTotalPeople: workTotalPeople,
            holiday: holiday,
            holidayHour: holidayHour,
            salaryadd1: salaryadd1,
            salaryadd2: salaryadd2,
            salaryadd3: salaryadd3,
            salaryadd4: salaryadd4,
            salaryadd5: salaryadd5,
            salaryadd6: salaryadd6,
            personalLeave: personalLeave,
            personalLeaveRate: personalLeaveRate,
            sickLeave: sickLeave,
            sickLeaveRate: sickLeaveRate,
            workRateDayoff: workRateDayoff,
            workRateDayoffRate: workRateDayoffRate,
            // daysOff : daysOff ,
            workplaceAddress: workplaceAddress

            // workplaceId: workplaceId,
            // workplaceName: workplaceName,
            // workplaceArea: workplaceArea,
            // workOfWeek: workOfWeek,
            // workStart1: workStart1,
            // workEnd1: workEnd1,
            // workStart2: workStart2,
            // workEnd2: workEnd2,
            // workStart3: workStart3,
            // workEnd3: workEnd3,
            // workOfHour: workOfHour,
            // workOfOT: workOfOT,
            // workRate: workRate,
            // workRateOT: workRateOT,
            // workTotalPeople: workTotalPeople,
            // workRateDayoff: workRateDayoff,
            // workRateDayoffHour: workRateDayoffHour,
            // workplaceAddress: workplaceAddress,

            // holidaycomment: holidaycomment
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

        }

    }

    return (
        <body class="hold-transition sidebar-mini">
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
                                            {/* <!--col-md-12--> */}
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
                                            {/* <!--col-md-12--> */}
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
                                    </div>
                                </section>
                                {/* <!--Frame--> */}

                                <h2 class="title">สวัสดิการเงินเพิ่มพนักงาน</h2>
                                <section class="Frame">
                                    <div class="row">
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
                                    </div>
                                </section>
                                {/* <!--Frame--> */}

                                <h2 class="title">สวัสดิการวันหยุดพนักงาน</h2>
                                <div class="row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="personalLeave">วันลากิจ</label>
                                                            <input type="text" class="form-control" id="personalLeave" placeholder="วันลากิจ" value={personalLeave} onChange={(e) => setPersonalLeave(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="personalLeaveRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="personalLeaveRate" placeholder="จำนวนเงินต่อวัน" value={personalLeaveRate} onChange={(e) => setPersonalLeaveRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="sickLeave">วันลาป่วย</label>
                                                            <input type="text" class="form-control" id="sickLeave" placeholder="วันลาป่วย" value={sickLeave} onChange={(e) => setSickLeave(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="sickLeaveRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="sickLeaveRate" placeholder="จำนวนเงินต่อวัน" value={sickLeaveRate} onChange={(e) => setSickLeaveRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workRateDayoff">วันลาพักร้อน</label>
                                                            <input type="text" class="form-control" id="workRateDayoff" placeholder="วันลาพักร้อน" value={workRateDayoff} onChange={(e) => setWorkRateDayoff(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="workRateDayoffRate">จำนวนเงินต่อวัน</label>
                                                            <input type="text" class="form-control" id="workRateDayoffRate" placeholder="จำนวนเงินต่อวัน" value={workRateDayoffRate} onChange={(e) => setworkRateDayoffRate(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                            {/* <!--col-md-12--> */}
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>


                                <h2 class="title">ที่อยู่หน่วยงาน</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="workplaceAddress">ที่อยู่หน่วยงาน</label>
                                                <input type="text" class="form-control" id="workplaceAddress" placeholder="ที่อยู่หน่วยงาน" value={workplaceAddress} onChange={(e) => setWorkplaceAddress(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}


                                <h2 class="title">วันหยุดหน่วยงาน</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 1 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob}
                                                        onChange={handleStartDateChange}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment" placeholder="หมายเหตุ" value={holidaycomment} onChange={(e) => setHolidaycomment(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 2 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob2}
                                                        onChange={handleStartDateChange2}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment2">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment2" placeholder="หมายเหตุ" value={holidaycomment2} onChange={(e) => setHolidaycomment2(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 3 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob3}
                                                        onChange={handleStartDateChange3}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment3">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment3" placeholder="หมายเหตุ" value={holidaycomment3} onChange={(e) => setHolidaycomment3(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 4 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob4}
                                                        onChange={handleStartDateChange4}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment4">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment4" placeholder="หมายเหตุ" value={holidaycomment4} onChange={(e) => setHolidaycomment4(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 5 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob5}
                                                        onChange={handleStartDateChange5}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment5">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment5" placeholder="หมายเหตุ" value={holidaycomment5} onChange={(e) => setHolidaycomment5(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 6 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob6}
                                                        onChange={handleStartDateChange6}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment6">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment6" placeholder="หมายเหตุ" value={holidaycomment6} onChange={(e) => setHolidaycomment6(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 7 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob7}
                                                        onChange={handleStartDateChange7}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment7">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment7" placeholder="หมายเหตุ" value={holidaycomment7} onChange={(e) => setHolidaycomment7(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 8 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob8}
                                                        onChange={handleStartDateChange8}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment8">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment8" placeholder="หมายเหตุ" value={holidaycomment8} onChange={(e) => setHolidaycomment8(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 9 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob9}
                                                        onChange={handleStartDateChange9}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment9">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment9" placeholder="หมายเหตุ" value={holidaycomment9} onChange={(e) => setHolidaycomment9(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label role="workplaceAddress">วันที่ 10 </label>
                                                <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                    <DatePicker id="datetime" name="datetime"
                                                        className="form-control" // Apply Bootstrap form-control class
                                                        popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                        selected={startjob10}
                                                        onChange={handleStartDateChange10}
                                                        dateFormat="dd/MM/yyyy" />

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label role="holidaycomment10">หมายเหตุ </label>
                                                <input type="text" class="form-control" id="holidaycomment10" placeholder="หมายเหตุ" value={holidaycomment10} onChange={(e) => setHolidaycomment10(e.target.value)} />

                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <button class="btn b_save">เพิ่มวัน</button>
                                            </div>
                                        </div>
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

                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>

            </div>
        </body>
    );
}

export default Setting