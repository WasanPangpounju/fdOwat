import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data

import th from "date-fns/locale/th"; // Import Thai locale data from date-fns
import en from "date-fns/locale/en-US";

import { addYears } from "date-fns";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import employeeData from "./timerecord.json"; // นำเข้าไฟล์ JSON

function ReplaceReport({ employeeList, workplaceList }) {
  const [workDate, setWorkDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);
  console.log('formattedDate321', formattedDate321);
  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setWorkDate(newDate);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  useEffect(() => {
    // Function to format a given date
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = (date.getFullYear() + 543).toString();
      return `${day}/${month}/${year}`;
    };

    if (selectedDate) {
      // Convert the selected date string to a Date object and format it
      const date = new Date(selectedDate);
      const formattedDate = formatDate(date);
      setFormattedDate(formattedDate);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setFormattedDate(formattedCurrentDate);
      setSelectedDate(currentDate); // Set the initial selected date to the current date
    }
  }, [selectedDate]);

  const randomWorkplace = ["10154", "10175", "10751"];
  const [data, setData] = useState([
    { date: "12/06/2567", workplace: "10751", name: "กาวิสา ไพรวิกา", replace: "วิสากา พิวาการ", salary: 500, update: "12/06/2567", bank: "กาวิสา ไพรวิกา 123-4-56789-0 ttb", isChecked: false },
    { date: "17/06/2567", workplace: "10751", name: "ไตรศรีมา มิโวหาร", replace: "สารี ยิมานี", salary: 600, update: "12/06/2567", bank: "ไตรศรีมา มิโวหารไพ 234-5-67890-1 ttb", isChecked: false },
    { date: "19/06/2567", workplace: "10751", name: "ไลการี พีโวกา", replace: "ศรีวมา ยกรึกา", salary: 700, update: "12/06/2567", bank: "ไตรศรีมา มิโวหาร 345-6-78901-2 ttb", isChecked: false },
    { date: "12/08/2567", workplace: "10796", name: "ไตรศรีมา มิโวหารไพ", replace: "ไหรมา นิณารี", salary: 811, update: "12/06/2567", bank: "ไลการีการี พีโวกา 234-5-67890-3 ttb", isChecked: false },
    { date: "19/08/2567", workplace: "10796", name: "ไลการี พีโวกาฟฟ", replace: "โนรากา ชนการ", salary: 625, update: "12/06/2567", bank: "ไตรศรีมา มิโวหาร 345-6-78901-4 ttb", isChecked: false },
    { date: "20/12/2567", workplace: "10796", name: "ไตรศรีมาดา มิโวหาร", replace: "นขชัย วัดโพสัย", salary: 450, update: "12/06/2567", bank: "ไตรศรีมา มิโวหาร 234-5-67890-5 ttb", isChecked: false },
    { date: "30/12/2567", workplace: "10796", name: "ไลการีการี พีโวกา", replace: "ไปรึณี ขนรณี", salary: 900, update: "12/06/2567", bank: "ไตรศรีมาดา มิโวหาร 345-6-78901-6 ttb", isChecked: false },
  ]);
  
  const handleCheckboxChange = (index) => {
    const updatedData = data.map((item, i) => {
      if (i === index) {
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });

    setData(updatedData);
  };

  const calculateSalary = (item) => {
    if (item.isChecked) {
      return item.salary; // Cancel the deduction
    }
    return item.salary - item.salary * 0.03; // Apply the deduction
  };

  const [analysisResult, setAnalysisResult] = useState([]);

  useEffect(() => {
    const analyzeData = () => {
      const groupedData = {};

      // จัดกลุ่มข้อมูลตาม employeeId
      employeeData.forEach((record) => {
        const { employeeId, month, employee_workplaceRecord } = record;

        if (!groupedData[employeeId]) {
          groupedData[employeeId] = {
            employeeId,
            months: [],
            hasDuplicateMonths: false,
            duplicateMonths: {}, // ใช้เก็บเดือนที่ซ้ำและจำนวน
            hasWorkplaceRecords: false,
          };
        }

        // เพิ่ม month ลงในกลุ่ม
        groupedData[employeeId].months.push(month);

        // เพิ่มจำนวนเดือนที่ซ้ำ
        if (groupedData[employeeId].duplicateMonths[month]) {
          groupedData[employeeId].duplicateMonths[month]++;
        } else {
          groupedData[employeeId].duplicateMonths[month] = 1;
        }

        // ตรวจสอบ workplace records
        if (employee_workplaceRecord.length > 0) {
          groupedData[employeeId].hasWorkplaceRecords = true;
        }
      });

      // ตรวจสอบ month ซ้ำ
      Object.values(groupedData).forEach((data) => {
        const uniqueMonths = [...new Set(data.months)];
        data.hasDuplicateMonths = uniqueMonths.length !== data.months.length;
        data.months = uniqueMonths;
      });

      return Object.values(groupedData);
    };

    setAnalysisResult(analyzeData());
  }, []);


  //////////////////////////////////////////////////////////////////////
  const handleExport = () => {
    // กำหนดหัวตาราง
    const headers = [
      "No",
      "ชื่อ-สกุล",
      "หน่วยงาน",
      "รายละเอียด",
      "โอนเข้า",
      "ยอดรวม",
      "หักภาษี ณ ที่จ่าย",
      "ยอดสุทธิ",
    ];

    // คำนวณข้อมูลตาราง
    let totalSalary = 0;
    let totalTax = 0;
    let totalNetSalary = 0;

    const tableData = data.map((item, index) => {
      const tax = item.isChecked ? 0 : item.salary * 0.03; // หาก isChecked เป็น true ไม่หักภาษี
      const netSalary = item.salary - tax; // คำนวณยอดสุทธิ

      // รวมค่า
      totalSalary += item.salary;
      totalTax += tax;
      totalNetSalary += netSalary;

      return [
        index + 1, // No
        item.name, // ชื่อ-สกุล
        item.workplace, // หน่วยงาน
        item.salary, // รายละเอียด
        item.bank, // โอนเข้า
        item.salary, // ยอดรวม
        tax, // หักภาษี ณ ที่จ่าย
        netSalary, // ยอดสุทธิ
      ];
    });

    // เพิ่มบรรทัดรวมท้ายตาราง
    tableData.push([
      "รวมทั้งหมด", // No
      "", // ชื่อ-สกุล
      "", // หน่วยงาน
      "", // รายละเอียด
      "", // โอนเข้า
      totalSalary, // ยอดรวม
      totalTax, // หักภาษี ณ ที่จ่าย
      totalNetSalary, // ยอดสุทธิ
    ]);

    // เพิ่มหัวข้อและวันที่
    const title = [
      ["รายงานแทนงานพนักงาน"], // A1
      [`${formattedDate321}`], // A2
      [], // เว้น 1 บรรทัด
      headers, // หัวตาราง
    ];

    // รวมข้อมูลทั้งหมด
    const finalData = [...title, ...tableData];

    // สร้างเวิร์กชีต
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // สร้างเวิร์กบุ๊ก
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงาน");

    // เขียนไฟล์ Excel
    XLSX.writeFile(workbook, `รายงานแทนงานพนักงาน_${formattedDate321}.xlsx`);
  };


  console.log('data', data);

  return (
    <div class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> แทนพนักงาน</a>
            </li>
            <li class="breadcrumb-item active">ออกรายงาน แทนพนักงาน </li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ออกรายงาน แทนพนักงาน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ออกรายงาน แทนพนักงาน </h2>
              <section class="Frame">
                <div class="col-md-12">
                  <div class="row align-items-end">
                    <div class="col-md-3">
                      <label role="datetime">พิมพ์วันที่</label>
                      <div
                        onClick={toggleDatePicker}
                        style={{
                          position: "relative",
                          zIndex: 9999,
                          marginLeft: "0rem",
                        }}
                      >
                        <FaCalendarAlt size={20} />
                        <span style={{ marginLeft: "8px" }}>
                          {formattedDate321 ? formattedDate321 : "Select Date"}
                        </span>
                      </div>
                      {showDatePicker && (
                        <div style={{ position: "absolute", zIndex: 1000 }}>
                          <ThaiDatePicker
                            className="form-control"
                            value={selectedDate}
                            onChange={handleDatePickerChange}
                          />
                        </div>
                      )}
                    </div>
                    <div class="col-md-3">
                      <button class="btn b_save">ค้นหา</button>
                    </div>
                    <button class="btn b_save" onClick={handleExport}>
                      สร้างไฟล์ Excel
                    </button>
                  </div>
                  <br />
                </div>
                <br />
              </section>

              <section class="Frame">
                {/* <table className="table table-bordered">
                  <thead>
                    <tr>
                      {randomWorkplace.map((workplace, index) => (
                        <th key={index}>
                          {workplace}
                          <br />
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(workplace)}
                            checked={selectedWorkplaces.includes(workplace)}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table> */}
                <div class="col-md-12">
                  {/* <div class="row">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>ชื่อ-นามสกุล</th>
                          <th>หน่วยงาน</th>
                          <th>โอน</th>
                          <th>รายละเอียด</th>
                          <th>คำนวณหลังหัก</th>
                          <th>ยอดรวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.workplace}
                              <br />
                              <input type="checkbox" />
                            </td>
                            <td><input style={{ width: "100%" }} value={item.bank} /></td>
                            <td>{item.salary}</td>
                            <td>{item.salaryCalculate}</td>
                            <td>{item.result}</td>
                            <td><button class="btn b_save" style={{ width: "4rem" }}>แก้ไข</button></td>
                            <td><button class="btn clean" style={{ width: "4rem" }}>ลบ</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div> */}
                  <table className="table table-bordered ">
                    <thead>
                      <tr>
                        <th>หน่วยงาน</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>เงิน</th>
                        <th>โอน</th>
                        <th>รายละเอียด</th>
                        <th>สุทธิ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.workplace}</td>
                          <td>{item.name}</td>
                          <td>{item.salary}</td>
                          <td>
                            <input style={{ width: "100%" }} value={item.bank} readOnly />
                          </td>
                          <td>{calculateSalary(item).toFixed(2)}
                            <br />
                            <input
                              type="checkbox"
                              checked={item.isChecked}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            {item.isChecked ? " ไม่หัก 3 %" : " หัก 3 %"}
                          </td>
                          <td>{calculateSalary(item).toFixed(2)}
                          </td>
                          <td><button class="btn b_save" style={{ width: "4rem" }}>แก้ไข</button></td>
                          <td><button class="btn clean" style={{ width: "4rem" }}>ลบ</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
            {/* <div>
              <h1>ผลการวิเคราะห์ข้อมูล Employee</h1>
              {analysisResult.map((employee) => (
                <div key={employee.employeeId} style={{ marginBottom: "1rem" }}>
                  <h3>Employee ID: {employee.employeeId}</h3>
                  <p>Months: {employee.months.join(", ")}</p>
                  <p>มีเดือนซ้ำกันไหม: {employee.hasDuplicateMonths ? "มี" : "ไม่มี"}</p>

                  {employee.hasDuplicateMonths && (
                    <div>
                      <h4>เดือนที่ซ้ำและจำนวน:</h4>
                      <ul>
                        {Object.entries(employee.duplicateMonths)
                          .filter(([month, count]) => count > 1)
                          .map(([month, count]) => (
                            <li key={month}>
                              เดือน {month} ซ้ำ {count} ครั้ง
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  <p>
                    มี workplace records ไหม:{" "}
                    {employee.hasWorkplaceRecords ? "มี" : "ไม่มี"}
                  </p>
                </div>
              ))}
            </div> */}
          </section>
        </div>

      </div>
    </div>
    // </div>
  );
}

export default ReplaceReport;
