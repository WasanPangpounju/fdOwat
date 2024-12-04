import endpoint from "../../config";

//import React, { useState } from 'react';
import React, { useEffect, useState } from "react";
import EmployeesSelected from "./EmployeesSelected";
import axios from "axios";
import "../editwindowcss.css";

function Search({ workplaceList, employeeList }) {
  //   const endpoint = 'YOUR_API_ENDPOINT'; // Replace with your API endpoint
  useEffect(() => {
    document.title = "ข้อมูลเงินเดือน";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);
  const [employeeName, setEmployeeName] = useState("");
  const [message, setMessage] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const [workPlace, setWorkPlace] = useState("");
  const [employeesResult, setEmployeesResult] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  employeeList.sort((a, b) => a.employeeId - b.employeeId);
  console.log("Sorted employeeList by employeeId:", employeeList);
  
  const filteredEmployee = employeeList.filter(employee => employee.employeeId === '480020');


  console.log("filteredEmployee", filteredEmployee);

  //working when start component
  useEffect(() => {
    // localStorage.clear();

    const updatedEmployeeList =
      JSON.parse(localStorage.getItem("selectedEmployees")) || [];
    setSelectedEmployees(updatedEmployeeList);
  }, []);

  useEffect(() => {
    // Listen for the custom event when selectedEmployees change in localStorage
    const handleSelectedEmployeesChange = (event) => {
      const { selectedEmployees } = event.detail;
      setSelectedEmployees(selectedEmployees);
      localStorage.setItem(
        "selectedEmployees",
        JSON.stringify(selectedEmployees)
      );
    };

    window.addEventListener(
      "selectedEmployeesChanged",
      handleSelectedEmployeesChange
    );

    return () => {
      window.removeEventListener(
        "selectedEmployeesChanged",
        handleSelectedEmployeesChange
      );
    };
  }, [selectedEmployees]);

  async function handleClickResult(employee) {
    const updatedEmployeeList =
      (await JSON.parse(localStorage.getItem("selectedEmployees"))) || [];
    await setSelectedEmployees(updatedEmployeeList);
    // alert(selectedEmployees.length);

    const updatedSelectedEmployees = await [...selectedEmployees, employee];
    await setSelectedEmployees(updatedSelectedEmployees);
    await localStorage.setItem(
      "selectedEmployees",
      JSON.stringify(updatedSelectedEmployees)
    );

    // const test = await JSON.parse(localStorage.getItem('selectedEmployees')) || [];
    // alert(test.length);

    // Dispatch a custom event to notify other components about the change
    const event = new CustomEvent("selectedEmployeesChanged", {
      detail: { selectedEmployees: updatedSelectedEmployees },
    });
    window.dispatchEvent(event);
    // Do any additional processing or redirection as needed
  }

  async function handleSearch(event) {
    event.preventDefault();

    const data = {
      employeeId: employeeId,
      name: name,
      idCard: idCard,
      workPlace: workPlace,
    };

    try {
      const response = await axios.post(endpoint + "/employee/search", data);
      setEmployeesResult(response.data.employees);
      setMessage(`ผลการค้นหา ${response.data.employees.length} รายการ`);
    } catch (error) {
      setMessage("ไม่พบผลการค้นหา กรุณาตรวจสอบข้อมูลที่ใช้ในการค้นหาอีกครั้ง");
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
      window.location.reload();
    }
  }

  // function handleEmployeeIdChange(event) {
  //   setEmployeeId(event.target.value);
  // }
  const handleEmployeeIdChange = (e) => {
    const id = e.target.value;
    setEmployeeId(id);

    // Find the employee with this ID
    const employee = employeeList.find((emp) => emp.employeeId === id);
    if (employee) {
      setEmployeeName(`${employee.name} ${employee.lastName}`);
    } else {
      setEmployeeName(""); // Clear if not found
    }
  };

  // function handleNameChange(event) {
  //   setName(event.target.value);
  // }
  const handleNameChange = (e) => {
    const name = e.target.value;
    setEmployeeName(name);

    // Find the employee matching the name input
    const employee = employeeList.find(
      (emp) => `${emp.name} ${emp.lastName}` === name
    );
    if (employee) {
      setEmployeeId(employee.employeeId);
    } else {
      setEmployeeId(""); // Clear if not found
    }
  };

  function handleIdCardChange(event) {
    setIdCard(event.target.value);
  }

  function handleWorkPlaceChange(event) {
    setWorkPlace(event.target.value);
  }

  function handleBack() {
    setEmployeesResult([]);
    setSelectedCount(0);
    setMessage("");
    setSelectedEmployees([]);
    localStorage.removeItem("selectedEmployeeCount");
    localStorage.removeItem("selectedEmployees");
  }

  return (
    <body class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> ระบบจัดการพนักงาน</a>
            </li>
            <li class="breadcrumb-item active">ค้นหาพนักงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ค้นหาพนักงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
          <!-- Main content --> */}
          <section class="content">
            <div class="container-fluid">
              <h2 class="title"> ค้นหาพนักงาน</h2>
              <div class="row">
                <div class="col-md-9">
                  <section class="Frame">
                    <div class="col-md-10 offset-md-1">
                      <form onSubmit={handleSearch}>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label role="employeeId">รหัสพนักงาน</label>
                              <input
                                type="text"
                                name="employeeId"
                                class="form-control"
                                id="employeeId"
                                placeholder="รหัสพนักงาน"
                                onChange={handleEmployeeIdChange}
                                value={employeeId}
                                onInput={(e) => {
                                  // Remove any non-digit characters
                                  e.target.value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                }}
                                list="staffIdList"
                              />
                              <datalist id="staffIdList">
                                {employeeList.map((employee) => (
                                  <option
                                    key={employee.employeeId}
                                    value={employee.employeeId}
                                  />
                                ))}
                              </datalist>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label role="name">ชื่อพนักงาน</label>
                              <input
                                type="text"
                                name="name"
                                class="form-control"
                                id="name"
                                placeholder="ชื่อพนักงาน"
                                value={employeeName}
                                onChange={handleNameChange}
                                list="staffNameList"
                              />
                              <datalist id="staffNameList">
                                {employeeList.map((employee) => (
                                  <option
                                    key={employee.employeeId}
                                    value={
                                      employee.name + " " + employee.lastName
                                    }
                                  />
                                ))}
                              </datalist>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <label role="idCard">หมายเลขบัตรประชาชน</label>
                              <input
                                type="text"
                                name="idCard"
                                class="form-control"
                                id="idCard"
                                placeholder="หมายเลขบัตรประชาชน"
                                onChange={handleIdCardChange}
                                onInput={(e) => {
                                  // Remove any non-digit characters
                                  e.target.value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <label role="workPlace">หน่วยงาน</label>
                              <input
                                type="text"
                                name="workPlace"
                                class="form-control"
                                id="workPlace"
                                placeholder="หน่วยงาน"
                                onChange={handleWorkPlaceChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div class="line_btn_search">
                          <button
                            type="submit"
                            value="Submit"
                            class="btn_search"
                          >
                            <i class="fa fa-search"></i> &nbsp;ค้นหา
                          </button>
                        </div>
                      </form>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <h2>{message}</h2>

                      <ul style={{ listStyle: "none" }}>
                        {employeesResult.map((employee) => (
                          <li
                            key={employee.id}
                            onClick={() => handleClickResult(employee)}
                            style={{ cursor: "pointer" }}
                          >
                            {employee.employeeId} : {employee.name} -{" "}
                            {employee.lastName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
                <div class="col-md-3">
                  <section class="Frame">
                    <EmployeesSelected />
                  </section>
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

export default Search;
