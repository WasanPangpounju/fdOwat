import { useState } from 'react';
import jwt_decode from 'jwt-decode';

import React, { Component } from 'react'
import Navitems from './Navitems'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function AsideLeft() {
  
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenu2, setShowSubMenu2] = useState(false);
  const [showSubMenu3, setShowSubMenu3] = useState(false);
  const [showSubMenu3_2, setShowSubMenu3_2] = useState(false);
  const [showSubMenu3_3, setShowSubMenu3_3] = useState(false);
  const [showSubMenu4, setShowSubMenu4] = useState(false);


  const token = localStorage.getItem('token');

  let storedUser;
  try {
    storedUser = JSON.parse(localStorage.getItem('user'));

  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.setItem('loggedIn', 'false');

    setLoggedIn(false);

    window.location.reload();
  }

  const [user, setUser] = useState(storedUser || null);


  const [isEmployeeLinkDisabled, setIsEmployeeLinkDisabled] = useState(false);

  function toggleSubMenu() {
    setShowSubMenu(!showSubMenu);
setShowSubMenu2(false);
setShowSubMenu3(false);
setShowSubMenu3_2(false);
setShowSubMenu3_3(false);
setShowSubMenu4(false);
  }

  function toggleSubMenu2() {
    setShowSubMenu2(!showSubMenu2);
    setShowSubMenu(false);
setShowSubMenu3(false);
setShowSubMenu3_2(false);
setShowSubMenu3_3(false);
setShowSubMenu4(false);
  }

  function toggleSubMenu3() {
    setShowSubMenu3(!showSubMenu3);
    setShowSubMenu(false);
setShowSubMenu2(false);
setShowSubMenu3_2(false);
setShowSubMenu3_3(false);
setShowSubMenu4(false);
  }
  function toggleSubMenu3_2() {
    setShowSubMenu3_2(!showSubMenu3_2);
    setShowSubMenu(false);
setShowSubMenu2(false);
setShowSubMenu3(false);
setShowSubMenu3_3(false);
setShowSubMenu4(false);
  }
  function toggleSubMenu3_3() {
    setShowSubMenu3_3(!showSubMenu3_3);
    setShowSubMenu(false);
setShowSubMenu2(false);
setShowSubMenu3(false);
setShowSubMenu3_2(false);
setShowSubMenu4(false);
  }
  function toggleSubMenu4() {
    setShowSubMenu4(!showSubMenu4);
    setShowSubMenu(false);
setShowSubMenu2(false);
setShowSubMenu3(false);
setShowSubMenu3_2(false);
setShowSubMenu3_3(false);
  }

  return (
    <>
      <aside class="main-sidebar sidebar-dark-primary elevation-4" style={{ width: '13rem' }}>
        <div class="sidebar">
          <div class="Logo-w">
            <a href="dashboard.php" class="brand-link logo-switch">
              <img src="assets/images/logo-xs.png" alt="Logo Small" class="brand-image-xl logo-xs" />
              <img src="assets/images/logo.png" alt=" Docs Logo Large" class="brand-image-xl logo-xl" style={{ borderRadius: "8px", width: '92%' }} />
            </a>
          </div>
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="assets/images/admin.jpg" class="img-circle" alt="User Image" />
            </div>
            <div class="info">
              <a href="#" class="d-block">
                <p>{user.name}</p><i class="nav-icon fas fa-solid fa-user" style={{ fontSsize: "11px", paddingRight: "5px" }}></i> {user.role}
              </a>
            </div>
          </div>
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li class="nav-item">
                <Link to="/dashboard" className="nav-link"><i class="nav-icon fas fa-tachometer-alt"></i> หน้าหลัก</Link>
              </li>
              <li class="nav-item">
                <Link to="/addsettime" className="nav-link"><i class="nav-icon fas fa-business-time"></i> ระบบลงเวลา</Link>
              </li>

              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu3}>
                  <i class="nav-icon fas fa-file-invoice-dollar"></i>
                  <p> ระบบเงินเดือน
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu3 ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu3 && (
                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <>
                      {/* <li class="nav-item">
                        <Link to="/worktimesheet" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ใบลงเวลาการปฏิบัติงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/salarysummary" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> สรุปเงินเดือน</Link>
                      </li> */}
                      <li class="nav-item">
                        <Link to="/examine" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> เวลาทำงานรายบุคคล</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/compensation" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ค่าตอบแทนรายบุคคล</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/salaryresult" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> เงินเดือนรายบุคคล</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/salaryAllresult" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ออกรายงานเงินเดือนพนักงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/worktimesheetworkplace" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ตารางเวลาทำงานพนักงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/worktimesheetworkplaceSpace" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ตารางเวลาทำงานพนักงานหน่วยพิเศษ</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/salarySlipPDF" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ออกสลิปเงินเดือน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/backReport" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ออกรายงานธนาคาร</Link>
                      </li>
                    </>
                  </ul>
                )}
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu3_2}>
                  <i class="nav-icon fas fa-file-invoice-dollar"></i>
                  <p> รายงาน ออดิท
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu3_2 ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu3_2 && (
                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <>
                      <li class="nav-item">
                        <Link to="/salaryAllresultAudit" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ออกรายงานเงินเดือนพนักงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/worktimesheetworkplace" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ตารางเวลาทำงานพนักงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/salarySlipPDF" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ออกสลิปเงินเดือน</Link>
                      </li>
                    </>
                  </ul>
                )}
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu3_3}>
                  <i class="nav-icon fas fa-file-invoice-dollar"></i>
                  <p> แทนพนักงาน
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu3_3 ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu3_3 && (
                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <>
                    <li class="nav-item">
                        <Link to="/addsettimereplace" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i>ลงเวลา</Link>
                      </li>

                      <li class="nav-item">
                        <Link to="/replaceWorkplaceReport" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i>ตรวจสอบ</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/replaceEmployeeReport" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i>จ่ายเงิน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/replaceReport" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i>รายงาน</Link>
                      </li>
                    </>
                  </ul>
                )}
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu4}><i class="nav-icon fas fa-file-import"></i>
                  <p> ระบบออกเอกสาร
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu4 ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu4 && (
                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <>
                      <li class="nav-item">
                        <Link to="/listsendemployee" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ใบส่งตัว</Link>
                      </li>
                    </>
                  </ul>
                )}
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"><i class="nav-icon fas fa-file-alt"></i>
                  <p> ระบบรายงานผู้บริหาร</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu}>
                  <i class="nav-icon fas fa-network-wired"></i>
                  <p> ระบบจัดการพนักงาน
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu && (
                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li class="nav-item">
                      <Link to="/search" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ค้นหาพนักงาน</Link>
                    </li>
                    {isEmployeeLinkDisabled ? (
                      <>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลพนักงาน</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเงินเดือน</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ภาษีเงินได้</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> คำนวณภาษี</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> คำนวณหักลดหย่อนภาษี</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ค่าใช้จ่ายอื่นๆ</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ประกันสังคม</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> กองทุนสำรอง</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> เงินค้ำประกัน</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเอกสาร</span>
                        </li>
                        <li class="nav-item">
                          <span className="nav-link disabled"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> กรอกใบสมัคร</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li class="nav-item">
                          <Link to="/employee" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลพนักงาน</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/salary" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเงินเดือน</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/income_tax" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ภาษีเงินได้</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/calculate_tax" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> คำนวณภาษี</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/calculate_tax_deductions" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> คำนวณหักลดหย่อนภาษี</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/other_expenses" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ค่าใช้จ่ายอื่นๆ</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/social_security" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ประกันสังคม</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/provident_fund" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> กองทุนสำรอง</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/collateral" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> เงินค้ำประกัน</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/document" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเอกสาร</Link>
                        </li>
                        <li class="nav-item">
                          <Link to="/application" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> กรอกใบสมัคร</Link>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link" onClick={toggleSubMenu2}>
                  <i class="nav-icon fas fa-shopping-cart"></i>
                  <p> การตั้งค่า
                    {/* <i class="right fas fa-angle-left"></i><i class=""></i> */}
                    <i
                      className={`right fas ${showSubMenu2 ? "fa-angle-down" : "fa-angle-left"
                        }`}
                    ></i>
                  </p>
                </a>
                {showSubMenu2 && (

                  <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <>
                      <li class="nav-item">
                        <Link to="/basicsetting" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ตั้งค่าระบบ</Link>
                      </li>

                      <li class="nav-item">
                        <Link to="/systemuser" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ผู้ใช้งานระบบ</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/setting" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ตั้งค่าหน่วยงาน</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/settingcomplex" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ตั้งค่าหน่วยงานพิเศษ</Link>
                      </li>

                      <li class="nav-item">
                        <Link to="/settingAllList" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> หน่วยงานทั้งหมด</Link>
                      </li>
                      <li class="nav-item">
                        <Link to="/settingspecial" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px", marginLeft: '1rem' }}></i> ตั้งค่าวันทำงานพิเศษ</Link>
                      </li>
                    </>
                  </ul>
                )}

              </li>
              <li class="nav-item">
                <Link to="/" className="nav-link"><i class="nav-icon fas fa fa-cog" style={{ fontSize: "14px" }}></i> การแจ้งเตือน</Link>
              </li>
              {/*  <li class="nav-item"> testPDF
                <Link to="/testPDFSalary" className="nav-link"><i class="nav-icon fas fa fa-cog" style={{ fontSize: "14px" }}></i> การแจ้งเตือน2</Link>
              </li> */}
              {/* <li class="nav-item">
                <Link to="/testPDFResultSalay" className="nav-link"><i class="nav-icon fas fa fa-cog" style={{ fontSize: "14px" }}></i> การแจ้งเตือน3</Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default AsideLeft