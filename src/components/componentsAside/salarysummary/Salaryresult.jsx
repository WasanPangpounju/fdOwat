// import React from 'react'
import endpoint from '../../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from '../EmployeesSelected';
import Calendar from 'react-calendar';
import '../../editwindowcss.css';
import EmployeeWorkDay from '../componentsetting/EmployeeWorkDay';
function salaryresult() {

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };

  const cellStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
  };

  const [employeeId, setEmployeeId] = useState(''); //รหัสหน่วยงาน
  const [name, setName] = useState(''); //ชื่อหน่วยงาน
  const [lastName, setLastname] = useState(''); //ชื่อหน่วยงาน

  const [employeeList, setEmployeeList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);

  const [staffId, setStaffId] = useState(''); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(''); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(''); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(''); //รหัสหน่วยงาน

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
      setMonth("01");

      const currentYear = new Date().getFullYear();
      setYear(currentYear);
  }, []); // Run this effect only once on component mount
  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from({ length: currentYear - EndYear + 1 }, (_, index) => EndYear + index).reverse();


  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + '/employee/list')
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched data
        setEmployeeList(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  console.log(employeeList);


  const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
  const [searchResult, setSearchResult] = useState([]);
  const [employeeListResult, setEmployeeListResult] = useState([]);
  const [newWorkplace, setNewWorkplace] = useState(true);

  async function handleSearch(event) {
    event.preventDefault();


    // get value from form search
    const data = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      idCard: '',
      workPlace: '',
    };
    // alert(data.name);
    try {
      const response = await axios.post(endpoint + '/employee/search', data);
      setSearchResult(response.data.employees);
      // alert(response.data.employees.length);
      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId('');
        setName('');
        setLastname('');
        alert('ไม่พบข้อมูล');

      } else {
        // alert(response.data.employees.length);

        //clean form 
        setSearchEmployeeId('');
        setSearchEmployeeName('');

        // Set search values
        setEmployeeId(response.data.employees[0].employeeId);
        setName(response.data.employees[0].name);
        setLastname(response.data.employees[0].lastName);

        // setSearchEmployeeId(response.data.employees[0].employeeId);
        // setSearchEmployeeName(response.data.employees[0].name);

        // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
        // console.log('workOfOT:', endTime);

      }
    } catch (error) {
      alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
      // window.location.reload();
    }
  }

  const handleStaffIdChange = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);
    setSearchEmployeeId(selectedStaffId);
    // Find the corresponding employee and set the staffName
    const selectedEmployee = employeeList.find(employee => employee.employeeId === selectedStaffId);
    if (selectedEmployee) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setStaffFullName(selectedEmployee.name + ' ' + selectedEmployee.lastName);


    } else {
      setStaffName('');
      setStaffFullName('');
      setSearchEmployeeName('');
    }
  };

  const handleStaffNameChange = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(employee => (employee.name + " " + employee.lastName) === selectedStaffName);
    const selectedEmployeeFName = employeeList.find(employee => employee.name === selectedStaffName);

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
    } else {
      setStaffId('');
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  return (
    // <div>

    // </div>
    // <div>
    <body class="hold-transition sidebar-mini" className='editlaout'>
      <div class="wrapper">

        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
            <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
            <li class="breadcrumb-item active">สรุปเงินเดือน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> สรุปเงินเดือน</h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">สรุปเงินเดือน</h2>
              <section class="Frame">
                <div class="col-md-12">
                  <form >
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchEmployeeId">รหัสพนักงาน</label>
                          {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} /> */}
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสพนักงาน"
                            value={staffId}
                            onChange={handleStaffIdChange}
                            list="staffIdList"
                          />
                          <datalist id="staffIdList">
                            {employeeList.map(employee => (
                              <option key={employee.employeeId} value={employee.employeeId} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchname">ชื่อพนักงาน</label>
                          {/* <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} /> */}
                          <input
                            type="text"
                            className="form-control"
                            id="staffName"
                            placeholder="ชื่อพนักงาน"
                            value={staffFullName}
                            onChange={handleStaffNameChange}
                            list="staffNameList"
                          />
                          <datalist id="staffNameList">
                            {employeeList.map(employee => (
                              <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="agencyname">เดือน</label>
                          <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
                            <option value="01">มกราคม</option>
                            <option value="02">กุมภาพันธ์</option>
                            <option value="03">มีนาคม</option>
                            <option value="04">เมษายน</option>
                            <option value="05">พฤษภาคม</option>
                            <option value="06">มิถุนายน</option>
                            <option value="07">กรกฎาคม</option>
                            <option value="08">สิงหาคม</option>
                            <option value="09">กันยายน</option>
                            <option value="10">ตุลาคม</option>
                            <option value="11">พฤศจิกายน</option>
                            <option value="12">ธันวาคม</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label >ปี</label>
                          <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                            {years.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-center">
                      <button class="btn b_save" onClick={handleSearch()} ><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
                    </div>
                  </form>
                  <br />
                  <div class="d-flex justify-content-center">
                    <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                  </div>
                </div>
              </section>
              <h2 class="title">ตั้งค่าหน่วยงาน</h2>
              <section class="Frame">
                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>รวมวันทำงาน</th>
                          <th style={headerCellStyle}>รวมชั่วโมงทำงาน</th>
                          <th style={headerCellStyle}>รวใชั่วโมงOT</th>

                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={cellStyle}>25</td>
                          <td style={cellStyle}>205</td>
                          <td style={cellStyle}>50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-12">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>เงินค่าจ้างปกติ</th>
                          <th style={headerCellStyle}>เงินค่าล่วงเวลา</th>
                          <th style={headerCellStyle}>เงินเพิ่มพิเศษ</th>
                          <th style={headerCellStyle}>เงินบวกอื่นๆ</th>
                          <th style={headerCellStyle}>รวมเงินได้</th>
                          <th style={headerCellStyle}>แก้ไข</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <button>แก้ไข</button>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />

                <div class="row">
                  <div class="col-md-12">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>หักภาษี</th>
                          <th style={headerCellStyle}>หักประกันสังคม</th>
                          <th style={headerCellStyle}>ธรรมเนียมธนาคาร</th>
                          <th style={headerCellStyle}>หักอื่นๆ</th>
                          <th style={headerCellStyle}>รวมเงินหัก</th>
                          <th style={headerCellStyle}>แก้ไข</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <button>แก้ไข</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* <div class="col-md-2">
                    <button>แก้ไข</button>
                  </div> */}
                </div>
                <br />
                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>รวมเงินได้</th>
                          <th style={headerCellStyle}>รวมเงินหัก</th>
                          <th style={headerCellStyle}>เงิรสุทธิ</th>

                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td>25</td>
                          <td>205</td>
                          <td>50</td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

          </section>
        </div>
      </div>
    </body>
  )
}

export default salaryresult