// import React from 'react'
import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react'; import { jsPDF } from 'jspdf';

import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';
import TestPDF from './TestPDF';

function IncomeTax() {
    const [income, setIncome] = useState('');//เงินได้รวม
    const [taxDeduction, setTaxDeduction] = useState('');//ลดหย่อน
    const [taxPaid, setTaxPaid] = useState('');//ภาษีต้อง
    const [taxPaidToMonth, setTaxPaidToMonth] = useState('');//ภาษีต้องแต่ละเดือน

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
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <span>หน้าหลัก</span></li>
                        <li class="breadcrumb-item"><span>ระบบจัดการพนักงาน</span></li>
                        <li class="breadcrumb-item active">ภาษีเงินได้</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ภาษีเงินได้</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title"> ภาษีเงินได้</h2>
                            <div class="row">
                                <div class="col-md-9">
                                    <section class="Frame">
                                        <div class="col-md-12">
                                            <form action="">
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
                                                            <label>วันที่บรรจุงาน</label>
                                                            <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" />
                                                                <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                    <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label>อัตราเงินจ้าง</label>
                                                            <input type="" class="form-control" id="" placeholder="อัตราเงินจ้าง" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!-- row --> */}
                                                <div class="line_btn_search">
                                                    <button type="submit" value="Submit" class="btn_search"><i class="fa fa-search"></i>  &nbsp;ค้นหา</button>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                    <section class="Frame">
                                        <div class="col-md-12">
                                            <form action="">
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <label role="datetime">เงินได้รวม</label>

                                                        <input type="text" class="form-control" id="income" placeholder="เงินได้รวม" value={income} onChange={(e) => setIncome(e.target.value)} />
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label role="datetime">ลดหย่อน</label>

                                                        <input type="text" class="form-control" id="taxPaid" placeholder="ลดหย่อน" value={taxDeduction} onChange={(e) => setTaxDeduction(e.target.value)} />
                                                    </div>
                                                </div>
                                                <br />
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <label role="datetime">ภาษีต้องจ่าย</label>

                                                        <input type="text" class="form-control" id="income" placeholder="ภาษีต้องจ่าย" value={taxPaid} onChange={(e) => setTaxPaid(e.target.value)} />
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label role="datetime">ภาษีต้องแต่ละเดือน</label>

                                                        <input type="text" class="form-control" id="taxPaid" placeholder="ภาษีต้องแต่ละเดือน" value={taxPaidToMonth} onChange={(e) => setTaxPaidToMonth(e.target.value)} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                </div>
                                <div class="col-md-3">
                                    <section class="Frame"><EmployeesSelected /></section>
                                    {/* <TestPDF /> */}
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

export default IncomeTax