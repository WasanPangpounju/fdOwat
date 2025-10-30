// import React from 'react'
import React, { useState, useEffect } from 'react';
import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';

function provident_fund() {
    useEffect(() => {
        document.title = 'กองทุนสำรองเลี้ยงชีพ';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                        <li class="breadcrumb-item active">กองทุนสำรองเลี้ยงชีพ</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> กองทุนสำรองเลี้ยงชีพ</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <form action="">
                                <h2 class="title">รายละเอียดกองทุน</h2>
                                <div class="row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>เลขที่บัญชีกองทุนฯ</label>
                                                        <input type="" class="form-control" id="" placeholder="เลขที่บัญชีกองทุนฯ" />
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>วันที่หัก</label>
                                                        <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate" />
                                                            <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!--row--> */}
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-3">
                                        <section class="Frame"><EmployeesSelected /></section>
                                    </div>
                                </div>
                                <h2 class="title">กรณีไม่ได้เป็นพนักงานตั้งแต่ต้นปี</h2>
                                <div class="row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-form-label label-txt">เงินสะสมเข้ากองทุนพนักงาน</label>
                                                <div class="col-md-6">
                                                    <input type="" class="form-control" id="" placeholder="เงินสะสมเข้ากองทุนพนักงาน" />
                                                </div>
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-9">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h2 class="title">กรณีไม่ได้เป็นพนักงานตั้งแต่ต้นปี</h2>
                                                <section class="Frame">
                                                    <div class="form-group">
                                                        <label>วิธีสะสม</label>
                                                        <select class="form-control">
                                                            <option>พนักงานจ่ายเอง</option>
                                                            <option>option 2</option>
                                                            <option>option 3</option>
                                                            <option>option 4</option>
                                                            <option>option 5</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>จำนวนสะสม</label>
                                                        <input type="" class="form-control" id="" placeholder="จำนวนสะสม" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label>วันที่เริ่มสะสม</label>
                                                        <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" />
                                                            <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>เงินสะสมเข้ากองทุนก่อนปีปัจจุบัน</label>
                                                        <input type="" class="form-control" id="" placeholder="" />
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                            {/* <!--col-md-6--> */}
                                            <div class="col-md-6">
                                                <h2 class="title">บริษัทสมทบกองทุน</h2>
                                                <section class="Frame">
                                                    <div class="form-group">
                                                        <label>วิธีสมทบกองทุน</label>
                                                        <select class="form-control">
                                                            <option>ไม่สมทบ</option>
                                                            <option>option 2</option>
                                                            <option>option 3</option>
                                                            <option>option 4</option>
                                                            <option>option 5</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>จำนวนสะสม</label>
                                                        <input type="" class="form-control" id="" placeholder="จำนวนสะสม" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label>วันที่เริ่มสะสม</label>
                                                        <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                            <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" />
                                                            <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label>เงินบริษัทสมทบเข้ากองทุนก่อนปีปัจจุบัน</label>
                                                        <input type="" class="form-control" id="" placeholder="" />
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                            {/* <!--col-md-6--> */}
                                        </div>
                                    </div>
                                </div>
                                <h2 class="title">รูปแบบการลงทุนกองทุนย่อย</h2>
                                <div class="row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-form-label label-txt">รหัสรูปแบบการลงทุน</label>
                                                <div class="col-md-6">
                                                    <input type="" class="form-control" id="" placeholder="เงินสะสมเข้ากองทุนพนักงาน" />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-2">

                                                </div>
                                                <div class="col-md-3">
                                                    <div class="text-center">รหัสกองทุนย่อย</div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="text-center">%สะสม</div>
                                                </div>
                                                <div class="col-md-3">
                                                    <div class="text-center">%สมทบ</div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-2">
                                                    <label class="col-form-label label-txt">กองทุนย่อยที่ 1</label>
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-2">
                                                    <label class="col-form-label label-txt">กองทุนย่อยที่ 2</label>
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-2">
                                                    <label class="col-form-label label-txt">กองทุนย่อยที่ 3</label>
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <div class="col-md-3">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>

                                <div class="line_btn">
                                    <button type="submit" class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                    <button type="reset" class="btn clean"><i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก</button>
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </body>

    )
}

export default provident_fund