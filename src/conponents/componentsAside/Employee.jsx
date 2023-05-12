import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Employee() {
    return (
        // <? php include("include/header.php");?>
        <body class="hold-transition sidebar-mini">
            <div class="wrapper">
                {/* <!-- Navbar -->
                <?php include("include/top.php");?>
                <!-- /.navbar -->
                <!-- Main Sidebar Container -->
                <?php include("include/aside_left.php");?> */}
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบบริหารจัดการข้อมูล</a></li>
                        <li class="breadcrumb-item active">ข้อมูลส่วนบุคคลพนักงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ข้อมูลส่วนบุคคลพนักงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ข้อมูลพนักงาน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>รหัสพนักงาน</label>
                                                <input type="" class="form-control" id="" placeholder="รหัสพนักงาน" value="5240499001264"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ตำแหน่ง</label>
                                                <input type="" class="form-control" id="" placeholder="ตำแหน่ง" value="พนักงานทำความสะอาด" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>แผนก</label>
                                                <select class="form-control">
                                                    <option>แผนก 1</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>หน่วยงาน</label>
                                                <input type="" class="form-control" id="" placeholder="หน่วยงาน" value="1"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ประเภทการจ้าง</label>
                                                <select class="form-control">
                                                    <option>ประจำ</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>วันที่เริ่มงาน</label>
                                                <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate" value="25/05/2023" />
                                                    <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>วันที่บรรจุ</label>
                                                <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" value="20/05/2023"/>
                                                    <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>อัพโหลดลายนิ้วมือ</label>
                                                <div class="custom-file">
                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>อัพโหลดใบหน้า</label>
                                                <div class="custom-file">
                                                    <input type="file" class="custom-file-input " id="customFile" />
                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <!--Frame--> */}
                            <h2 class="title">ข้อมูลส่วนบุคคลพนักงาน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>คำนำหน้า</label>
                                                <select class="form-control">
                                                    <option>นาย</option>
                                                    <option>นาง</option>
                                                    <option>นางสาว</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ชื่อ</label>
                                                <input type="" class="form-control" id="" placeholder="ชื่อ" value="ชุติมณฑน์"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>นามสกุล</label>
                                                <input type="" class="form-control" id="" placeholder="นามสกุล" value="จอมนก"/>
                                            </div>
                                        </div>

                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ชื่อเล่น</label>
                                                <input type="" class="form-control" id="" placeholder="ชื่อเล่น" value="สา"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เพศ</label>
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
                                                <label>วันเดือนปีเกิด</label>
                                                <div class="input-group date" id="reservationdate3" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate3" value="16/08/30" />
                                                    <div class="input-group-append" data-target="#reservationdate3" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>อายุ</label>
                                                <input type="" class="form-control" id="" placeholder="อายุ" value="36"/>
                                            </div>
                                        </div>

                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เลขบัตรประจำตัวประชาชน</label>
                                                <input type="" class="form-control" id="" placeholder="เลขบัตรประจำตัวประชาชน" value="5240499001264"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เชื้อชาติ</label>
                                                <input type="" class="form-control" id="" placeholder="เชื้อชาติ" value="ไทย"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ศาสนา</label>
                                                <input type="" class="form-control" id="" placeholder="ศาสนา" value="พุทธ"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>สถานภาพการสมรส</label>
                                                <input type="" class="form-control" id="" placeholder="สถานภาพการสมรส" value="โสด"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>สถานภาพทางการทหาร</label>
                                                <select class="form-control">
                                                    <option>เกณฑ์ทหารแล้ว</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>ที่อยู่ตามบัตรประชาชน</label>
                                                <textarea class="form-control" rows="3" value="152/183  ถ.ริมคลองท่าไข่  ต.หน้าเมือง  อ.เมืองฉะเชิงเทรา"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>ที่อยู่ปัจจุบัน</label>
                                                <div class="icheck-primary d-inline">
                                                    <input type="radio" id="radio" name="radio1" /> ใช้ที่อยู่ตามบัตรประชาชน
                                                </div>
                                                <textarea class="form-control" rows="3" value="152/183  ถ.ริมคลองท่าไข่  ต.หน้าเมือง  อ.เมืองฉะเชิงเทรา"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เบอร์โทรศัพท์</label>
                                                <input type="" class="form-control" id="" placeholder="เบอร์โทรศัพท์" value="0926513824"/>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เบอร์ติดต่อกรณีฉุกเฉิน</label>
                                                <input type="" class="form-control" id="" placeholder="เบอร์ติดต่อกรณีฉุกเฉิน" value="0958461372" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ไอดีไลน์</label>
                                                <input type="" class="form-control" id="" placeholder="ไอดีไลน์" value="opowow"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!--col-md-12--> */}
                            </section>
                            {/* <!--Frame--> */}
                            <h2 class="title">ข้อมูลสุขภาพ</h2>
                            <section class="Frame">
                                <div class="row">
                                    <div class="form-group">
                                        <label style={{ paddingLeft: "10px" }}>การรับวัคซีน</label>
                                        <div class="col-md-12" style={{ marginTop: "10px" }}>
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="radioPrimary1" name="r1" checked="" /> ได้รับวัคซีนแล้ว
                                            </div>
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="radioPrimary2" name="r1" />  ยังไม่ได้รับวัคซีนแล้ว
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>สิทธิการรักษาพยาบาล</label>
                                            <input type="" class="form-control" id="" placeholder="สิทธิการรักษาพยาบาล" value=""/>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <!--Frame--> */}
                            <div class="line_btn">
                                <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                <button class="btn clean"><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
                            </div>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
                {/* <?php include("include/footer.php");?> */}
            </div>
        </body>

    )
}

export default Employee