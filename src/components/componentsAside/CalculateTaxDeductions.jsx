// import React from 'react'
import React, { useState, useEffect } from 'react';

import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';


function Calculate_tax_deductions() {
    useEffect(() => {
        document.title = 'ภาษีเงินได้';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    return (
        <div class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                        <li class="breadcrumb-item active">ภาษีเงินได้หักลดหย่อนภาษี</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ภาษีเงินได้-หักลดหย่อนภาษี</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-9">
                                    <form action="">
                                        <div class="form-group row">
                                            <label class="col-md-2 col-form-label"> หักลดหย่อนคู่สมรส</label>
                                            <div class="col-md-6 col-form-label" style={{ marginLeft: "-5em" }}>
                                                <input class="form-check-input check1" type="checkbox" value="" id="" />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <h2 class="title">สภาพสมรสที่ต้องการแสดงในแบบ ภ.ง.ด. 91</h2>
                                                        <section class="Frame">
                                                            <div class="form-group">
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n1" />
                                                                    <label class="form-check-label" for="">
                                                                        1. ไม่มีคู่สมรส
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n2" />
                                                                    <label class="form-check-label" for="">
                                                                        2.คู่สมรสรวมคำนวณภาษี
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n3" />
                                                                    <label class="form-check-label" for="">
                                                                        3. คู่สมรสแยกคำนวณฯ
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n4" />
                                                                    <label class="form-check-label" for="">
                                                                        4. คู่สมรสไม่มีเงินได้
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n5" />
                                                                    <label class="form-check-label" for="">
                                                                        5. คู่สมรสมีเงินได้แต่สมรสระหว่างปี
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n6" />
                                                                    <label class="form-check-label" for="">
                                                                        6. คู่สมรสมีเงินได้แต่หย่าระหว่างปี
                                                                    </label>
                                                                </div>
                                                                <div class="form-check">
                                                                    <input class="form-check-input" type="radio" name="NN" id="n7" />
                                                                    <label class="form-check-label" for="">
                                                                        7. คู่สมรสมีเงินได้แต่ตายระหว่างปี
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {/* <!--row--> */}
                                                        </section>
                                                    </div>
                                                    {/* <!--col-md-5--> */}
                                                    <div class="col-md-7">
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <h2 class="title">อุปการะเลี้ยงดูบิดามารดาผู้มีเงินได้</h2>
                                                                <section class="Frame">
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">บิดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">มารดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <h2 class="title">อุปการะเลี้ยงดูบิดามารดาคู่สมรส</h2>
                                                                <section class="Frame">
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">บิดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">มารดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </div>
                                                        {/* <!--row--> */}
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <h2 class="title">เบี้ยประกันสุขภาพบิดามารดาผู้มีเงินได้</h2>
                                                                <section class="Frame">
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">บิดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">มารดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">รวมเบี้ยประกันสุขภาพ</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input type="" class="form-control" id="" placeholder="" />
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <h2 class="title">เบี้ยประกันสุขภาพบิดามารดาคู่สมรส</h2>
                                                                <section class="Frame">
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">บิดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">มารดา</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input class="form-check-input check2" type="checkbox" value="" id="" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <label class="col-md-7 col-form-label">รวมเบี้ยประกันสุขภาพ</label>
                                                                        <div class="col-md-5 col-form-label">
                                                                            <input type="" class="form-control" id="" placeholder="" />
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            </div>
                                                        </div>
                                                        {/* <!--row--> */}
                                                    </div>
                                                    {/* <!--col-md-7--> */}
                                                </div>
                                                {/* <!--row--> */}
                                            </div>

                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <h2 class="title">ค่าฝากครรภ์หรือค่าคลอดบุตรในปี</h2>
                                                        <section class="Frame">
                                                            <div class="form-group row">
                                                                <label class="col-md-5 col-form-label">ปีก่อน</label>
                                                                <div class="col-md-7">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                            </div>
                                                            {/* <!--row--> */}
                                                            <div class="form-group row">
                                                                <label class="col-md-5 col-form-label"> ปีปัจจุบัน</label>
                                                                <div class="col-md-7">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                            </div>
                                                            {/* <!--row--> */}
                                                        </section>
                                                    </div>
                                                    {/* <!--col-md-5--> */}
                                                    <div class="col-md-7">
                                                        <div class="">
                                                            <h2 class="title">เฉพาะกรณีโสดหรือแยกยื่น</h2>
                                                            <section class="Frame">
                                                                <div class="form-group row">
                                                                    <div class="col-md-4">

                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <div class="text-center">ผู้มีเงินได้</div>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <div class="text-center">คู่สมรส</div>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-4">
                                                                        <label class="col-form-label label-txt">เบี้ยประกันชีวิตผู้มีเงินได้</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-4">
                                                                        <label class="col-form-label label-txt">เบี้ยประกันชีวิตแบบบำนาญ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-4">
                                                                        <label class="col-form-label label-txt">ดอกเบี้ยเงินกู้เพื่อที่อยู่อาศัย</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        </div>
                                                        {/* <!--row--> */}
                                                    </div>
                                                    {/* <!--col-md-7--> */}
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-5">
                                                        <h2 class="title">จำนวนบุตรลดหย่อนและอัตรา</h2>
                                                        <section class="Frame">
                                                            <div class="form-group row">
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                            </div>
                                                            <div class="form-group row">
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" />
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>
                                                    {/* <!--col-md-5--> */}
                                                    <div class="col-md-7">
                                                        <div class="">
                                                            <h2 class="title">รายการลดหย่อนและยกเว้นหลังหักค่าใช้จ่าย</h2>
                                                            <section class="Frame">
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">อุปการะเลี้ยงดูคนพิการ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">ค่าซื้อหน่วยลงทุนในกองทุนรวมเพื่อการเลี้ยงชีพ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">ค่าซื้อหน่วยลงทุนในกองทุนรวมหุ้นระยะยาว</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">เงินได้ที่จ่ายต่อปีเพื่ออสังหาริมทรัพย์</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">มูลค่าอสังหาริมทรัพย์</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">ค่าการเดินทางท่องเที่ยวในประเทศ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">ค่าซื้อสินค้าหรือบริการในประเทศ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row">
                                                                    <div class="col-md-8">
                                                                        <label class="col-form-label label-txt">อื่นๆ</label>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <input type="" class="form-control" id="" placeholder="00.00" />
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        </div>
                                                        {/* <!--row--> */}
                                                    </div>
                                                    {/* <!--col-md-7--> */}
                                                </div>
                                                {/* <!--row--> */}
                                            </div>
                                        </div>
                                        <div class="line_btn">
                                            <button type="submit" class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                            <button type="reset" class="btn clean"><i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-md-3">
                                    <section class="Frame"><EmployeesSelected /></section>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </div>
    )
}

export default Calculate_tax_deductions