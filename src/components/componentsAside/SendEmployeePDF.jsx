import endpoint from '../../config';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SendEmployeePDF2 from './SendEmployeePDF2';
import SendEmployeePDF3 from './SendEmployeePDF3';
import jsPDF from 'jspdf';

const SendEmployeePDF = ({employeeList}) => {
    const [selectedOption, setSelectedOption] = useState('SendEmployeePDF2');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    useEffect(() => {
        document.title = 'ใบส่งตัว';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
      }, []); 
    return (
        <div>
            <div class="hold-transition sidebar-mini" className='editlaout'>
                <div class="wrapper">
                    <div class="content-wrapper">
                        {/* <!-- Content Header (Page header) --> */}
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                            <li class="breadcrumb-item"><a href="#"> ระบบออกเอกสาร</a></li>
                            <li class="breadcrumb-item active">ใบส่งตัว</li>
                        </ol>
                        <div class="content-header">
                            <div class="container-fluid">
                                <div class="row mb-2">
                                    <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ใบส่งตัว</h1>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /.content-header -->
                        <!-- Main content --> */}

                        <section class="content">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="container-fluid">
                                        <h2 class="title">ใบส่งตัวพนักงาน</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label role="formsettime">รูปแบบการลงเวลา</label>
                                                        <select id="selectOption" class="form-control" value={selectedOption} onChange={handleOptionChange}>
                                                            <option value="SendEmployeePDF2">รูปแบบหน่วยงาน</option>
                                                            <option value="SendEmployeePDF3">รูปแบบบุคคล</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* {selectedOption && (
                                        <div>
                                            {formToShow}
                                        </div>
                                    )} */}
                                        {selectedOption === 'SendEmployeePDF2' && <SendEmployeePDF2 employeeList={employeeList}/>}
                                        {selectedOption === 'SendEmployeePDF3' && <SendEmployeePDF3 employeeList={employeeList}/>}
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /.container-fluid --> */}
                        </section>
                        {/* <!-- /.content --> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SendEmployeePDF;
