// import React from 'react'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import '../editwindowcss.css';


function application() {
    useEffect(() => {
        document.title = 'กรอกข้อมูลสมัครงาน';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    const [showInput, setShowInput] = useState(false);

    const handleCheckboxChange = (event) => {
        setShowInput(event.target.checked);
    };
    return (
        <div class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                        <li class="breadcrumb-item active">กรอกข้อมูลสมัครงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> กรอกข้อมูลสมัครงาน</h1>
                            </div>
                        </div>
                    </div>
                    <section class="content">
                        <div class="container-fluid">
                            <form id="myForm" action="#">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>วันที่เริ่มงาน</label>
                                            <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate" />
                                                <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                    <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>ตำแหน่งงาน</label>
                                            <input type="" class="form-control" id="" placeholder="ตำแหน่งงาน" />
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>แผนก</label>
                                            <input type="" class="form-control" id="" placeholder="แผนก" />
                                        </div>
                                    </div>
                                </div>
                                <h2 class="title">ทราบข่าวการสมัคร</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingTop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label txt-control" style={{ width: "100%" }} for="inlineRadio2">ใบปลิว</label>
                                            </div>
                                        </div>
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingTop: "5px" }}>
                                                <input onChange={handleCheckboxChange} checked={showInput} class="form-check-input" type="checkbox" id="no1"/>
                                                <label class="form-check-label txt-control" style={{ width: "100 %", marginRight: "10px" }} for="inlineRadio2">เพื่อนหรือเจ้าหน้าที่แนะนำ</label>
                                                {showInput ? (
                                                    <input type="text" class="form-control form-check-label" id="choose_hospital1" placeholder="" />
                                                ) : null}

                                            </div>

                                        </div>
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingTop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label txt-control" style={{ width: "100%" }} for="inlineRadio2">ป้ายหน้าออฟฟิศ</label>
                                            </div>
                                        </div>
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingTop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label txt-control" style={{ width: "100%" }} for="inlineRadio2">โซเชียลมีเดีย</label>
                                            </div>
                                        </div>
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingtop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label txt-control" style={{ width: "50%" }} for="inlineRadio2">อื่นๆ</label>
                                                <input type="" class="form-control form-check-label" id="" placeholder="อื่นๆ" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <h2 class="title">บัตรประกันสังคม</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingtop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="no" value="" />
                                                <label class="form-check-label txt-control" style={{ width: "100%", marginRight: "10px" }} for="inlineRadio2">ไม่มีประกันสังคม</label>
                                                <select class="form-control" id="choose_hospital">
                                                    <option>โรงพยาบาล</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="">
                                            <div class="form-check form-check-inline" style={{ paddingtop: "5px" }}>
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label" style={{ width: "100%" }} for="inlineRadio2">มีประกันสังคม</label>
                                                <input type="" class="form-control form-check-label" id="" placeholder="ระบุโรงพยาบาล" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <h2 class="title">ประวัติข้อมูลส่วนตัว</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>คำนำหน้า</label>
                                                <select class="form-control">
                                                    <option>ชาย</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ชื่อจริง</label>
                                                <input type="" class="form-control" id="" placeholder="ชื่อจริง" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>นามสกุล</label>
                                                <input type="" class="form-control" id="" placeholder="นามสกุล" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>บัตรประจำตัวประชาชน</label>
                                                <input type="" class="form-control" id="" placeholder="บัตรประจำตัวประชาชน" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>สัญชาติ</label>
                                                <input type="" class="form-control" id="" placeholder="สัญชาติ" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เชื้อชาติ</label>
                                                <input type="" class="form-control" id="" placeholder="เชื้อชาติ" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ศาสนา</label>
                                                <input type="" class="form-control" id="" placeholder="ศาสนา" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>วันเดือนปีเกิด</label>
                                                <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" />
                                                    <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label>อายุ</label>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <div class="mb-3 row">
                                                        <div class="col-sm-9">
                                                            <input type="" class="form-control" id="" placeholder="ปี" />
                                                        </div>
                                                        <label for="" class="col-sm-2 col-form-label">ปี</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3 row">
                                                        <div class="col-sm-9">
                                                            <input type="" class="form-control" id="" placeholder="เดือน" />
                                                        </div>
                                                        <label for="" class="col-sm-2 col-form-label">เดือน</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>สถานที่เกิด</label>
                                                <input type="" class="form-control" id="" placeholder="สถานที่เกิด" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                {/* <!--Frame--> */}
                                <div class="line_btn">
                                    {/* <button type="submit" formaction="application1.php" class="btn btn-secondary"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></button> */}
                                    <Link to="/application1" class="btn btn-secondary"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></Link>
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </div>
    )
}

export default application