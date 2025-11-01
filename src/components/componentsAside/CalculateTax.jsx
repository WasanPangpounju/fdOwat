// import React from 'react'
import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';
import React, { useState, useEffect } from 'react';


function Calculate_tax() {
    useEffect(() => {
        document.title = 'ภาษีเงินได้-หักลดหย่อนภาษี';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    return (
        <div class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i><span> หน้าหลัก</span></li>
                        <li class="breadcrumb-item"><span> ระบบจัดการพนักงาน</span></li>
                        <li class="breadcrumb-item active">คำนวณภาษี</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> คำนวณภาษี</h1>
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
                                        <h2 class="title">วิธีการคำนวณ</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label"><span class="txt-red">*</span> วิธีคำนวณภาษี</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control">
                                                                <option>หักภาษี ณ ที่จ่าย</option>
                                                                <option>option 2</option>
                                                                <option>option 3</option>
                                                                <option>option 4</option>
                                                                <option>option 5</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label"><span class="txt-red">*</span> วิธียื่นแบบ</label>
                                                        <div class="col-md-3">
                                                            <select class="form-control">
                                                                <option>ฟอร์ม ภงด.91</option>
                                                                <option>option 2</option>
                                                                <option>option 3</option>
                                                                <option>option 4</option>
                                                                <option>option 5</option>
                                                            </select>
                                                        </div>

                                                    </div>
                                                </section>
                                            </div>
                                            {/* <div class="col-md-3">
                                                <section class="Frame"><EmployeesSelected /></section>
                                            </div> */}
                                        </div>
                                        {/* <!--row--> */}
                                        <h2 class="title">เงินสนับสนุน</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินสนับสนุนเพื่อการศึกษา</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินบริจาค</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">หักภาษีเงินได้ที่ได้รับยกเว้นจากการซื้ออสังหาริมทรัพย์</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">หักภาษีเงินได้ที่ได้รับการยกเว้น</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">มูลค่าอสังหาริมทรัพย์</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">รายการเงินที่ได้ที่ได้รับการยกเว้น</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">กองทุนบำเหน็จบำนาญข้าราชการ</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">กองทุนสงเคราะห์ครูโรงเรียนเอกชน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินสะสมกองทุนการออมแห่งชาติ</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ผู้มีเงินได้ตั้งแต่อายุ 65 ปี</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">คู่สมรสอายุตั้งแต่ 65 ปี</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินค่าชดเชยที่ได้รับตามกฎหมายแรงงาน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">เฉพาะกรณีไม่ได้เป็นพนักงานตั้งแต่ต้นปี</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">จำนวนเดือนที่ต้องจ่ายภาษี (ต่อปี)</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินได้ก่อนเข้าเป็นพนักงาน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ภาษีที่ถูกหักออกก่อนเข้าเป็นพนักงาน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">เฉพาะกรณีไม่ได้ใช้โปรแกรมคำนวณตั้งแต่ต้นปี</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">จำนวนเดือนที่ต้องจ่ายภาษี (ต่อปี)</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">เงินได้ก่อนเข้าเป็นพนักงาน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ภาษีที่ถูกหักออกก่อนเข้าเป็นพนักงาน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="00.00" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">เฉพาะกรณีต้องการแก้ไขภาษีนำส่งเอง</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">งวดระหว่างปี</label>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ต้องการแก้ไข</label>
                                                        <div class="col-md-5">
                                                            <input 
                                                                class="form-check-input" 
                                                                style={{ 
                                                                    marginLeft: "0px",
                                                                    marginTop: "10px",
                                                                    position: "relative",
                                                                }} 
                                                                type="checkbox" value="" id="" 
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ต้องการนำส่งไม่เกิน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">งวดปลายปี</label>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ต้องการแก้ไข</label>
                                                        <div class="col-md-7">
                                                            <input 
                                                                class="form-check-input" 
                                                                style={{ 
                                                                    marginLeft: "0px",
                                                                    marginTop: "10px",
                                                                    position: "relative",
                                                                }} 
                                                                type="checkbox" value="" id="" 
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">ต้องการนำส่งไม่เกิน</label>
                                                        <div class="col-md-5">
                                                            <input type="" class="form-control" id="" placeholder="" />
                                                        </div>
                                                    </div>
                                                    {/* <!--row--> */}
                                                </section>
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
                {/* <?php include("include/footer.php");?> */}
            </div>
        </div>
    )
}

export default Calculate_tax