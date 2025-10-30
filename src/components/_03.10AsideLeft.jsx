// import React from 'react'
import React, { Component } from 'react'
import Navitems from './Navitems'
// import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function AsideLeft() {
  
  return (
    
    <>

      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        {/* <p>351351</p>
      <a href='app.php'>popopo</a> */}
        <div class="sidebar">
          <div class="Logo-w">
            <a href="dashboard.php" class="brand-link logo-switch">
              <img src="assets/images/logo-xs.png" alt="Logo Small" class="brand-image-xl logo-xs" />
              <img src="assets/images/logo.png" alt=" Docs Logo Large" class="brand-image-xl logo-xl" style={{ borderRadius: "8px" }} />
            </a>
          </div>
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="assets/images/admin.jpg" class="img-circle" alt="User Image" />
            </div>
            <div class="info">
              <a href="#" class="d-block">
                <p>คุณสมศรี รักสะอาด</p><i class="nav-icon fas fa-solid fa-user" style={{ fontSsize: "11px", paddingRight: "5px" }}></i> Super Admin
              </a>
            </div>
          </div>
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li class="nav-item">
                {/* <a href="index.php" class="nav-link"><i class="nav-icon fas fa-tachometer-alt"></i>
                  <p> หน้าหลัก</p>
                </a> */}
                <Link to="/dashboard" className="nav-link"><i class="nav-icon fas fa-tachometer-alt"></i> หน้าหลัก</Link>
              </li>
              <li class="nav-item">
                {/* <a href="#" class="nav-link"><i class="nav-icon fas fa-business-time"></i>
                  <p> ระบบลงเวลา</p>
                </a> */}
                <Link to="../content/about.jsx" className="nav-link"><i class="nav-icon fas fa-business-time"></i> ระบบลงเวลา</Link>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"><i class="nav-icon fas fa-file-invoice-dollar"></i>
                  <p> ระบบเงินเดือน</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"><i class="nav-icon fas fa-file-import"></i>
                  <p> ระบบออกเอกสาร</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link"><i class="nav-icon fas fa-file-alt"></i>
                  <p> ระบบรายงานผู้บริหาร</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-network-wired"></i>
                  <p> ระบบจัดการพนักงาน <i class="right fas fa-angle-left"></i><i class=""></i></p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    {/* <a href="search.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ค้นหาพนักงาน</p>
                    </a> */}
                    <Link to="/search" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ค้นหาพนักงาน</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="employee.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ข้อมูลพนักงาน</p>
                    </a> */}
                    <Link to="/employee" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลพนักงาน</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="salary.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ข้อมูลเงินเดือน</p>
                    </a> */}
                    <Link to="/salary" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเงินเดือน</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="income_tax.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ภาษีเงินได้</p>
                    </a> */}
                    <Link to="/income_tax" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ภาษีเงินได้</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="social_security.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ประกันสังคม</p>
                    </a> */}
                    <Link to="/social_security" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ประกันสังคม</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="provident_fund.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>กองทุนสำรอง</p>
                    </a> */}
                    <Link to="/provident_fund" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> กองทุนสำรอง</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="collateral.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>เงินค้ำประกัน - เงินกู้</p>
                    </a> */}
                    <Link to="/collateral" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> เงินค้ำประกัน</Link>
                  </li>
                  <li class="nav-item">
                    {/* <a href="document.php" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ข้อมูลเอกสาร</p>
                    </a> */}
                    <Link to="/document" className="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i> ข้อมูลเอกสาร</Link>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-shopping-cart"></i>
                  <p> การตั้งค่า <i class="right fas fa-angle-left"></i><i class=""></i></p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="#" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>ผู้ใช้งานระบบ</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link"><i class="nav-icon far fa-dot-circle" style={{ fontSize: "14px" }}></i>
                      <p>กำหนดสิทธิ์ใช้งาน</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon fas fa fa-cog"></i>
                <p> การแจ้งเตือน</p>
              </a></li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default AsideLeft