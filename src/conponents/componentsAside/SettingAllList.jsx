import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import { Link } from "react-router-dom";

function SettingAllList({ workplaceList, employeeList }) {
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: "#f2f2f2",
  };
  const [searchTerm, setSearchTerm] = useState("");
  //   console.log("employeeList", employeeList);
  //   console.log("workplaceList", workplaceList);

  //   useEffect(() => {
  //     // Fetch data from the API when the component mounts
  //     fetch(endpoint + "/workplace/list")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Update the state with the fetched data
  //         setWorkplaceList(data);
  //         // alert(data[0].workplaceName);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }, []);

  //   const [employeeList, setEmployeeList] = useState([]);

  //   useEffect(() => {
  //     // Fetch data from the API when the component mounts
  //     fetch(endpoint + "/employee/list")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Update the state with the fetched data
  //         setEmployeeList(data);
  //         // alert(data[0].workplaceName);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }, []); // The empty array [] ensures that the effect runs only once after the initial render

  const extractedData = workplaceList.map((item) => ({
    workplaceId: item.workplaceId,
    workplaceName: item.workplaceName,
  }));

  //   console.log(extractedData);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the extracted data based on search term
  const filteredData = extractedData.filter(
    (data) =>
      data.workplaceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.workplaceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData.sort((a, b) => a.workplaceId.localeCompare(b.workplaceId));

  // Check if employeeList is defined and is an array
  //   const employeeCountMap = {};
  //   employeeList.forEach((employee) => {
  //     // Check if 'workplace' exists and is not null/undefined
  //     if (employee.workplace) {
  //       if (!employeeCountMap[employee.workplace]) {
  //         employeeCountMap[employee.workplace] = 1;
  //       } else {
  //         employeeCountMap[employee.workplace]++;
  //       }
  //     }
  //   });

  // Assuming employeeList is initially an object
  const employeeCountMap = {};

  employeeList.forEach((employee) => {
    // Check if 'workplace' exists and is not null/undefined/empty string
    if (employee.workplace) {
      // Initialize or increment the count for the workplace
      if (!employeeCountMap[employee.workplace]) {
        employeeCountMap[employee.workplace] = 1;
      } else {
        employeeCountMap[employee.workplace]++;
      }
    }
    // If 'workplace' doesn't exist, skip that employee
  });

  console.error("employeeCountMap", employeeCountMap);

  const totalEmployees = Object.values(employeeCountMap).reduce(
    (sum, count) => sum + count,
    0
  );

  console.log("Total Employees:", totalEmployees);

  const countData = filteredData.length;

  const filteredWorkplaceIds = filteredData.map(data => data.workplaceId);

// Check for workplace IDs in employeeCountMap that are not in filteredData
const unmatchedWorkplaceIds = Object.keys(employeeCountMap).filter(
  (workplaceId) => !filteredWorkplaceIds.includes(workplaceId)
);

// Log or handle unmatched workplace IDs
if (unmatchedWorkplaceIds.length > 0) {
  console.warn("Workplace IDs in employeeCountMap not found in filteredData:", unmatchedWorkplaceIds);
} else {
  console.log("All workplace IDs match between employeeCountMap and filteredData");
}

  return (
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">


          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> การตั้งค่า</a>
            </li>
            <li class="breadcrumb-item active">ตั้งค่าหน่วยงานที่หมด</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ตั้งค่าหน่วยงานทั้งหมด
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
                    <!-- Main content --> */}
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ตั้งค่าหน่วยงานที่หมด</h2>
              <section class="Frame">
                <div class="col-md-12">
                  <form>
                    {/* <h2>รายชื่อหน่วยงานทั้งหมด</h2>
                                        <ul>
                                            {extractedData.map((data, index) => (
                                                <li key={index}>
                                                    <strong>รหัส:</strong> {data.workplaceId}
                                                    <span> </span> {data.workplaceName}
                                                </li>
                                            ))}
                                        </ul> */}
                    {/* Input for filtering */}
                    <label>ค้นหา</label>
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <br />
                    <ul>
                    

                      <div>จำนวนหน่วยงานทั้งหมด {countData}</div>
                      <br />

                      <table border="1" style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={headerCellStyle}>รหัสหน่วยงาน</th>
                            <th style={headerCellStyle}>ชื่อหน่วยงาน</th>
                            <th style={headerCellStyle}>จำนวนคน</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {filteredData.map((data, index) => (
                                                        <tr key={index}>
                                                            <td style={cellStyle}>
                                                                <Link to={`/setting?workplaceId=${data.workplaceId}&workplaceName=${data.workplaceName}`}>
                                                                    {data.workplaceId}
                                                                </Link>
                                                            </td>
                                                            <td style={cellStyle}>
                                                                <Link to={`/setting?workplaceId=${data.workplaceId}&workplaceName=${data.workplaceName}`}>
                                                                    {data.workplaceName}
                                                                </Link>
                                                            </td>
                                                            <td style={cellStyle}>
                                                                <Link to={`/setting?workplaceId=${data.workplaceId}&workplaceName=${data.workplaceName}`}>
                                                                    {data.workplaceName}
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))} */}

                          {filteredData.map((data, index) => (
                            <tr key={index}>
                              <td style={cellStyle}>
                                <Link
                                  to={`/settingEdit?workplaceId=${data.workplaceId}&workplaceName=${data.workplaceName}`}
                                >
                                  {data.workplaceId}
                                </Link>
                              </td>
                              <td style={cellStyle}>
                                <Link
                                  to={`/settingEdit?workplaceId=${data.workplaceId}&workplaceName=${data.workplaceName}`}
                                >
                                  {data.workplaceName}
                                </Link>
                              </td>
                              <td style={cellStyle}>
                                {/* {employeeCountMap[data.workplaceId] || 0} */}
                                {employeeCountMap[data.workplaceId] || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                    </ul>
                  </form>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    {/* </body> */}
    </div>
  );
}

export default SettingAllList;
