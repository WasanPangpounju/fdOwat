// import React from 'react'
import React, { useState, useEffect } from 'react';
import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';


function Collateral() {
    useEffect(() => {
        document.title = 'กองทุนสำรองเลี้ยงชีพ';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    return (
        <>
            <div class="hold-transition sidebar-mini" className='editlaout'>
                <div class="wrapper">
                    <div class="content-wrapper">
                        {/* <!-- Content Header (Page header) --> */}
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                            <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                            <li class="breadcrumb-item active">เงินค้ำประกัน-เงินกู้</li>
                        </ol>
                        <div class="content-header">
                            <div class="container-fluid">
                                <div class="row mb-2">
                                    <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> เงินค้ำประกัน-เงินกู้</h1>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /.content-header -->
                        <!-- Main content --> */}
                        <section class="content">
                            <div class="container-fluid">
                                <form action="">
                                    <h2 class="title">เงินค้ำประกัน</h2>
                                    <div class="form-group row">
                                        <div class="col-md-9">
                                            <section class="Frame">
                                                <div class="form-group row">
                                                    <label class="col-form-label col-md-2">ยอดเงินค้ำประกัน</label>
                                                    <div class="col-md-6">
                                                        <input type="" class="form-control" id="" placeholder="ยอดเงินค้ำประกัน" />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label class="col-form-label col-md-2">ยอดเงินค้ำประกันชำระแล้ว</label>
                                                    <div class="col-md-6">
                                                        <input type="" class="form-control" id="" placeholder="ยอดเงินค้ำประกันชำระแล้ว" />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label class="col-form-label col-md-2">ยอดเงินค้ำประกันที่เหลือ</label>
                                                    <div class="col-md-6">
                                                        <input type="" class="form-control" id="" placeholder="ยอดเงินค้ำประกันที่เหลือ" />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label class="col-form-label col-md-2">ส่วนที่เหลือหักครั้งละ</label>
                                                    <div class="col-md-6">
                                                        <input type="" class="form-control" id="" placeholder="ส่วนที่เหลือหักครั้งละ" />
                                                    </div>
                                                </div>
                                                <div class="form-group row">
                                                    <label class="col-form-label col-md-2">ยอดเงินค้ำประกันจ่ายคืน</label>
                                                    <div class="col-md-6">
                                                        <input type="" class="form-control" id="" placeholder="ยอดเงินค้ำประกันจ่ายคืน" />
                                                    </div>
                                                </div>
                                            </section>
                                            {/* <!--Frame--> */}
                                        </div>
                                        <div class="col-md-3">
                                            <section class="Frame"><EmployeesSelected /></section>
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
                    {/* <?php include("include/footer.php");?> */}
                </div>
            </div>
        </>
    )
}

export default Collateral