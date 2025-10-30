// import React from 'react'
import React, { useState, useEffect } from 'react';
import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';


function Document() {
    useEffect(() => {
        document.title = 'เอกสาร';
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
                        <li class="breadcrumb-item"><span> ระบบจัดการพนักงาน</span></li>
                        <li class="breadcrumb-item active">เอกสาร</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> เอกสาร</h1>
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
                                        <h2 class="title">เงินค้ำประกัน</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดบัตรประชาชน/หนังสือเดินทาง</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดบัตรคนพิการ</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดทะเบียนบ้าน</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดหลักฐานด้านการศึกษา</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดสัญญาจ้าง</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดหน้าสมุดบัญชี</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดใบเกณฑ์ทหาร</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดใบอนุญาตทำงาน</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดเอกสารอื่นๆ</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                            {/* <div class="col-md-3">
                                                <section class="Frame"><EmployeesSelected /></section>

                                            </div> */}
                                        </div>
                                        <h2 class="title">เงินค้ำประกันสำหรับชาติต่างด้าว</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดบัตรประชาชน/หนังสือเดินทาง</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดบัตรคนพิการ</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดทะเบียนบ้าน</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดหลักฐานด้านการศึกษา</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดสัญญาจ้าง</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดหน้าสมุดบัญชี</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดใบเกณฑ์ทหาร</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดใบอนุญาตทำงาน</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>อัพโหลดเอกสารอื่นๆ</label>
                                                                <div class="custom-file">
                                                                    <input type="file" class="custom-file-input" id="customFile" />
                                                                    <label class="custom-file-label" for="customFile">เลือกไฟล์</label>
                                                                </div>
                                                            </div>
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

export default Document