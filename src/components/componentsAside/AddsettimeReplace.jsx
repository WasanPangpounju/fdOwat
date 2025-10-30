import endpoint from "../../config";
import { useParams } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";

import AddsettimeWorkplace from "./AddsettimeWorkplace";
import AddsettimeWorkplaceReplace from "./AddsettimeWorkplaceReplace";
import AddsettimeEmployee from "./AddsettimeEmployee";
import AddsettimeUpload from "./AddsettimeUpload";
import AddsettimeOutsiderEmployee from "./AddsettimeOutsiderEmployee";
import AddsettimeOutsiderWorkplace from "./AddsettimeOutsiderWorkplace";
import "../editwindowcss.css";

function AddsettimeReplace({ workplaceList, employeeList }) {
  const [selectedOption, setSelectedOption] = useState("workplace");
  // const [selectedOption, setSelectedOption] = useState("workplaceReplace");
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    document.title = "ระบบลงเวลา";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
    setSelectedOption('workplaceReplace');

    const savedEmployeeId = localStorage.getItem("employeeId");
    localStorage.setItem("employeeId", savedEmployeeId);

    const savedSelect = localStorage.getItem("select");
    if (savedSelect) {
      setSelectedOption(savedSelect);
      localStorage.removeItem("select");
    }
  }, []);

  return (
    <body class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item active">ระบบลงเวลา</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ระบบบันทึกเวลาการทำงานของพนักงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
                    <!-- Main content --> */}

          <section class="content">
            <div class="row">
              <div class="col-md-12">
                <div class="container-fluid">
                  <h2 class="title">ข้อมูลการลงเวลาทำงานของพนักงาน</h2>
                  <div class="row">
                    <div class="col-md-12"></div>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group">
                          <label role="formsettime">รูปแบบการลงเวลา</label>
                          <select
                            id="selectOption"
                            class="form-control"
                            value={selectedOption}
                            onChange={handleOptionChange}
                           >
                            {/* <option value="workplace">รูปแบบหน่วยงาน</option>
                            <option value="employee">รูปแบบบุคคล</option> */}
                            <option value="workplaceReplace">แทนงานพนักงาน</option>
                            {/* <option value="upload">อัพโหลดไฟล์ลงเวลา</option> */}
                            {/* <option value="Outsiderworkplace">รูปแบบหน่วยงาน(บุคคลภายนอก)</option>
                                                        <option value="Outsideremployee">รูปแบบบุคคล(บุคคลภายนอก)</option> */}
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
                  {selectedOption === "workplace" && (
                    <AddsettimeWorkplace
                      workplaceList={workplaceList}
                      employeeList={employeeList}
                    />
                  )}
                  {selectedOption === "employee" && <AddsettimeEmployee />}
                  {selectedOption === "workplaceReplace" && (
                    <AddsettimeWorkplaceReplace
                      workplaceList={workplaceList}
                      employeeList={employeeList}
                    />
                  )}
                  {/* {selectedOption === "upload" && <AddsettimeUpload />} */}
                  {selectedOption === "upload" && (
                    <AddsettimeUpload workplaceList={workplaceList} />
                  )}

                  {selectedOption === "Outsiderworkplace" && (
                    <AddsettimeOutsiderWorkplace />
                  )}
                  {selectedOption === "Outsideremployee" && (
                    <AddsettimeOutsiderEmployee />
                  )}
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
      </div>
    </body>
  );
}

export default AddsettimeReplace;
