import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import * as XLSX from 'xlsx';

import "jspdf-autotable";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data

// เพิ่ม CSS สำหรับ Modal
const modalStyles = `
  .modal.show {
    z-index: 1050;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-backdrop {
    z-index: 1040;
  }
  
  .edit-modal .modal-content {
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    width: 95vw !important;
    max-width: 1400px !important;
  }
  
  .edit-modal .modal-dialog {
    max-width: 95vw !important;
    width: 95vw !important;
    margin: 1rem auto;
  }
  
  .edit-modal .modal-header {
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    border-radius: 15px 15px 0 0;
    padding: 20px 25px;
    border: none;
  }
  
  .edit-modal .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .edit-modal .modal-body {
    padding: 25px;
    background-color: #f8f9fa;
  }
  
  .edit-modal .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .edit-modal .card-header {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
    padding: 15px 20px;
    border: none;
  }
  
  .edit-modal .form-group label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .edit-modal .form-control {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .edit-modal .form-control:focus {
    border-color: #17a2b8;
    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
  }
  
  .edit-modal .alert-info {
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    border-left: 4px solid #17a2b8;
    padding: 15px 20px;
  }
  
  .edit-modal .table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .edit-modal .table th {
    background: linear-gradient(135deg, #495057 0%, #343a40 100%);
    color: white;
    font-weight: 600;
    padding: 15px;
    border: none;
  }
  
  .edit-modal .table td {
    padding: 12px 15px;
    vertical-align: middle;
    border-color: #e9ecef;
  }
  
  .edit-modal .table-responsive {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .edit-modal .section-header {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    border-left: 4px solid;
  }
  
  .edit-modal .section-header.income {
    border-left-color: #28a745;
  }
  
  .edit-modal .section-header.deduction {
    border-left-color: #dc3545;
  }
  
  .edit-modal .section-header.special {
    border-left-color: #ffc107;
  }
  
  .edit-modal .btn {
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .edit-modal .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .edit-modal .modal-footer {
    background-color: #ffffff;
    border-top: 1px solid #e9ecef;
    padding: 20px 25px;
    border-radius: 0 0 15px 15px;
  }
  
  .btn-close-white {
    filter: invert(1) grayscale(100%) brightness(200%);
  }
  
  .employee-navigation {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .net-salary-display {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border: 2px solid #28a745;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
`;

// เพิ่ม styles เข้าไปใน head ถ้ายังไม่มี
if (typeof document !== 'undefined' && !document.getElementById('salary-slip-styles')) {
  const style = document.createElement('style');
  style.id = 'salary-slip-styles';
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

function SalarySlipPDF({ employeeList, workplaceList }) {
  // ...existing state variables...
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState("");
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  const [employeeListAll, setEmployeeListAll] = useState([]);

const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);

  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");

  const [responseDataAll, setResponseDataAll] = useState([]);
  const [cashWorkData, setCashWorkData] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [basicSettings, setBasicSettings] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");

  const [month, setMonth] = useState("01");
  const currentYear = new Date().getFullYear(); // 2024

  const [year, setYear] = useState(currentYear);
  const EndYear = 2010;
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  const [selectedOption, setSelectedOption] = useState("option1");

  // เพิ่ม state สำหรับ Modal แก้ไขข้อมูล
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployeeIndex, setEditingEmployeeIndex] = useState(0);
  const [editableData, setEditableData] = useState([]);

  // ฟังก์ชันสำหรับเปิด Modal แก้ไขข้อมูล
  const openEditModal = () => {
    if (!responseDataAll || responseDataAll.length === 0) {
      alert("กรุณารอให้ข้อมูลโหลดเสร็จก่อน หรือเลือกเงื่อนไขการค้นหา");
      return;
    }
    
    // สร้างสำเนาข้อมูลสำหรับแก้ไข
    const editableEmployees = responseDataAll.map(employee => ({
      ...employee,
      // เก็บข้อมูลที่อาจต้องแก้ไข
      editableFields: {
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        prefix: employee.prefix,
        sumCashWork: employee.sumCashWork || 0,
        sumCashOt: employee.sumCashOt || 0,
        publicHolidayCash: employee.publicHolidayCash || 0,
        publicHolidayCount: employee.publicHolidayCount || 0,
        sumOt1p5: employee.sumOt1p5 || 0,
        sumOtPublicHoliday: employee.sumOtPublicHoliday || 0,
        sumOt3: employee.sumOt3 || 0,
        tax: employee.tax || 0,
        socialSecurity: employee.socialSecurity || 0,
        advance: employee.deductSalaryList?.[0]?.amount || 0,
        // สำหรับ addSalaryList
        addSalaryList: employee.addSalaryList?.map(item => ({
          ...item,
          SpSalary: item.SpSalary || 0
        })) || []
      }
    }));
    
    setEditableData(editableEmployees);
    setEditingEmployeeIndex(0);
    setShowEditModal(true);
  };

  // ฟังก์ชันสำหรับปิด Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditableData([]);
    setEditingEmployeeIndex(0);
  };

  // ฟังก์ชันสำหรับอัพเดทข้อมูลในฟอร์ม
  const updateEditableField = (field, value) => {
    const updatedData = [...editableData];
    
    // Handle nested object for sumCashWorkMul
    if (field.startsWith('sumCashWorkMul.')) {
      const key = field.replace('sumCashWorkMul.', '');
      if (!updatedData[editingEmployeeIndex].editableFields.sumCashWorkMul) {
        updatedData[editingEmployeeIndex].editableFields.sumCashWorkMul = {};
      }
      updatedData[editingEmployeeIndex].editableFields.sumCashWorkMul[key] = value;
    } else {
      updatedData[editingEmployeeIndex].editableFields[field] = value;
    }
    
    setEditableData(updatedData);
  };

  // ฟังก์ชันสำหรับอัพเดทข้อมูล addSalaryList
  const updateAddSalaryField = (index, field, value) => {
    const updatedData = [...editableData];
    if (!updatedData[editingEmployeeIndex].editableFields.addSalaryList[index]) {
      return;
    }
    updatedData[editingEmployeeIndex].editableFields.addSalaryList[index][field] = value;
    setEditableData(updatedData);
  };

  // ฟังก์ชันสำหรับไปพนักงานคนต่อไป
  const nextEmployee = () => {
    if (editingEmployeeIndex < editableData.length - 1) {
      setEditingEmployeeIndex(editingEmployeeIndex + 1);
    }
  };

  // ฟังก์ชันสำหรับไปพนักงานคนก่อน
  const prevEmployee = () => {
    if (editingEmployeeIndex > 0) {
      setEditingEmployeeIndex(editingEmployeeIndex - 1);
    }
  };

  // ฟังก์ชันสำหรับสร้าง PDF ด้วยข้อมูลที่แก้ไขแล้ว
  const generatePDFWithEditedData = async () => {
    console.log("🚀 Starting generatePDFWithEditedData - จะเรียก generatePDF() แทน");
    
    try {
      setIsGeneratingPDF(true);
      
      // เรียกใช้ฟังก์ชัน generatePDF เดิมเลย
      await generatePDF();
      
      console.log("✅ PDF generation completed successfully using original generatePDF function!");
      
    } catch (error) {
      console.error("❌ Error in generatePDFWithEditedData:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF: " + error.message);
    } finally {
      setIsGeneratingPDF(false);
      closeEditModal();
    }
  };
  // ฟังก์ชันสร้าง PDF ที่รับข้อมูลเป็น parameter (คัดลอกจาก generatePDF เป๊ะๆ)
  const generatePDFWithData = async (dataToUse) => {
    try {
      console.log("🎯 START: generatePDFWithData function called");
      console.log("📊 DataToUse length:", dataToUse?.length);
      console.log("📊 DataToUse data:", dataToUse);
   
      // Create a new instance of jsPDF
      const pdf = new jsPDF();

      const fontPath = "/assets/fonts/THSarabunNew.ttf";
      pdf.addFileToVFS(fontPath);
      pdf.addFont(fontPath, "THSarabunNew", "normal");

      // Add bold font
      const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
      pdf.addFileToVFS(boldFontPath);
      pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };
      const tableOptions = {
        styles: stylestable,
        startY: 25,
      };

      // Set the initial position for text and frame
      let x = 20;

      pdf.setFont("THSarabunNew Bold");

      // ฟังก์ชันคำนวณเงินรับสุทธิ
      const calculateNetSalary = (employee) => {
        const incomeTotal = 
          parseFloat(employee?.sumCashWork || '0') + 
          parseFloat(employee?.sumCashOt || '0') +
          parseFloat(employee?.cashSpecialDay || '0') + 
          parseFloat(
            employee?.addSalaryList?.reduce(
              (total, item) => total + parseFloat(item.SpSalary || '0'),
              0
            ) || '0'
          );

        const deductionTotal =
          parseFloat(employee?.socialSecurity || '0') +
          parseFloat(employee?.tax || '0');

        const netTotal = incomeTotal - deductionTotal;

        return isNaN(netTotal) ? 0 : netTotal;
      };

      // Loop through the names and ages arrays to add content to the PDF
      for (let i = 0; i < dataToUse.length; i += 2) {
        console.log(`🔄 Processing employee loop iteration ${i}/${dataToUse.length}`);
        
        // Add a page for each pair of names
        if (i > 0) {
          pdf.addPage();
        }

        // ใช้ข้อมูลจาก employee_record แทน accountingRecord
        const currentEmployee = dataToUse[i];
      console.log(`� Processing employee ${i}:`, currentEmployee?.employeeId, currentEmployee?.name);

      // ใช้ข้อมูลที่แก้ไขแล้วจาก accountingRecord
      const accountingRecord = currentEmployee.accountingRecord?.[0] || {};
      const addSalaryList = currentEmployee.addSalaryList || currentEmployee.addSalary || [];

      console.log(`💰 Using modified accountingRecord for employee ${i}:`, accountingRecord);
      console.log(`💰 Using modified addSalaryList for employee ${i}:`, addSalaryList);

      let head2 = 30;

      pdf.setFontSize(16);
      pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);
      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);
      pdf.setFontSize(12);

      pdf.text(`รหัส`, 7, head2);
      pdf.text(`ชื่อ-สกุล`, 40, head2);
      pdf.text(`หน่วยงาน`, 80, head2);
      pdf.text(`${currentEmployee.workplace}`, 93, head2);

      const workplace = workplaceList.find(
        (item) => item.workplaceId === currentEmployee.workplace
      );
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";
      pdf.text(`${workplaceName}`, 103, head2);

      const banknumber = await getEmployeeBankNumber(currentEmployee.employeeId);
      pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head2);

      // วาดตาราง
      pdf.rect(7, head2 + 3, 155, 74);
      pdf.rect(7, head2 + 3, 155, 12);
      pdf.rect(7, head2 + 3, 155, 63);
      pdf.rect(7, head2 + 3, 44, 63);
      pdf.text(`รายได้`, 24, head2 + 9);
      pdf.text(`Earnings`, 22, head2 + 12);

      pdf.rect(7, head2 + 3, 62, 63);
      pdf.text(`จำนวน`, 56, head2 + 9);
      pdf.text(`Number`, 55, head2 + 12);

      pdf.rect(69, head2 + 3, 24, 74);
      pdf.text(`จำนวนเงิน`, 74, head2 + 9);
      pdf.text(`Amount`, 75, head2 + 12);

      pdf.rect(69, head2 + 3, 69, 74);
      pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9);

      pdf.text(`รวมเงินได้`, 28, head2 + 71);
      pdf.text(`Total Earning`, 23, head2 + 75);

      pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71);
      pdf.text(`Total Deduction`, 105, head2 + 75);

      pdf.text(`จำนวนเงิน`, 144, head2 + 9);
      pdf.text(`Amount`, 145, head2 + 12);

      // ตารางวันที่จ่าย
      pdf.rect(162 + 9, head2 + 3, 25, 25);
      pdf.rect(162 + 9, head2 + 3, 25, 15);
      pdf.text(`วันที่จ่าย`, 180, head2 + 9);
      pdf.text(`Payroll Date`, 177, head2 + 12);

      // ตารางเงินรับสุทธิ
      pdf.rect(162 + 9, head2 + 52, 25, 25);
      pdf.rect(162 + 9, head2 + 52, 25, 15);
      pdf.text(`เงินรับสุทธิ`, 178, head2 + 59);
      pdf.text(`Net To Pay`, 177, head2 + 62);

      // ตารางล่าง
      pdf.rect(7, head2 + 79, 155, 13);
      pdf.rect(7, head2 + 79, 155, 6.5);

      let x1 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(x1, head2 + 79, 31, 13);
        x1 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83);
      pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83);
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83);
      pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83);
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83);

      pdf.rect(112, head2 + 94, 50, 12);
      pdf.text(`ลงชื่อพนักงาน`, 125, head2 + 105);

      pdf.text(`${currentEmployee.employeeId}`, 13, head2);
      pdf.text(`${currentEmployee.name} ${currentEmployee.lastName}`, 50, head2);

      // แสดงรายการรายได้โดยใช้ข้อมูลที่แก้ไขแล้ว
      const textArray = [];
      const countArray = [];
      const valueArray = [];

      // เงินเดือนพื้นฐาน - ใช้ข้อมูลที่แก้ไขแล้ว
      const workDays = currentEmployee.employee_record?.filter(record => record.dayType === "work").length || 0;
      const totalCashWork = parseFloat(accountingRecord.amountDay || accountingRecord.sumCashWork || 0);
      
      if (totalCashWork > 0) {
        textArray.push("เงินเดือน");
        countArray.push(workDays.toString());
        valueArray.push(totalCashWork.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // วันหยุดนักขัตฤกษ์ - ใช้ข้อมูลที่แก้ไขแล้ว
      const pubDayCount = parseFloat(accountingRecord.publicHolidayCount || currentEmployee.publicHolidayCount || 0);
      const pubDayCash = parseFloat(accountingRecord.publicHolidayCash || accountingRecord.amountSpecialDay || 0);

      if (pubDayCount > 0 && pubDayCash > 0) {
        textArray.push("วันหยุดนักขัตฤกษ์");
        countArray.push(pubDayCount.toString());
        valueArray.push(pubDayCash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ค่าล่วงเวลา 1.5 เท่า - ใช้ข้อมูลที่แก้ไขแล้ว
      const ot15Hours = parseFloat(accountingRecord.sumOt1p5 || currentEmployee.sumOt1p5 || 0);
      const ot15Cash = parseFloat(currentEmployee.sumCashWorkMul?.["1.5"] || 0);

      if (ot15Hours > 0 && ot15Cash > 0) {
        textArray.push("ค่าล่วงเวลา 1.5 เท่า");
        countArray.push(ot15Hours.toFixed(2));
        valueArray.push(ot15Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ค่าล่วงเวลา 2 เท่า (วันหยุด) - ใช้ข้อมูลที่แก้ไขแล้ว
      const ot2Hours = parseFloat(accountingRecord.sumOtPublicHoliday || currentEmployee.sumOtPublicHoliday || 0);
      const ot2Cash = parseFloat(currentEmployee.sumCashWorkMul?.["2"] || 0);

      if (ot2Hours > 0 && ot2Cash > 0) {
        textArray.push("ค่าล่วงเวลา 2 เท่า");
        countArray.push(ot2Hours.toFixed(2));
        valueArray.push(ot2Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ค่าล่วงเวลา 3 เท่า - ใช้ข้อมูลที่แก้ไขแล้ว
      const ot3Hours = parseFloat(accountingRecord.sumOt3 || currentEmployee.sumOt3 || 0);
      const ot3Cash = parseFloat(currentEmployee.sumCashWorkMul?.["3"] || 0);

      if (ot3Hours > 0 && ot3Cash > 0) {
        textArray.push("ค่าล่วงเวลา 3 เท่า");
        countArray.push(ot3Hours.toFixed(2));
        valueArray.push(ot3Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // รายการเงินพิเศษที่แก้ไขแล้ว
      addSalaryList.forEach(item => {
        if (parseFloat(item.SpSalary || item.sumAddSalary || 0) > 0) {
          textArray.push(item.name);
          countArray.push("");
          valueArray.push(parseFloat(item.SpSalary || item.sumAddSalary || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
      });

      // กรองรายการตาม ID เหมือนในฟังก์ชันเดิม
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];
      const addSalaryFiltered = addSalaryList
        .filter((salary) => !excludedIds.includes(salary.id))
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0,
        }));

      // เบี้ยขยัน
      const hardWorkingItems = addSalaryList.filter((item) => item.id === "1410");
      const sumAmountHardWorking = hardWorkingItems.reduce((sum, item) => sum + parseFloat(item.SpSalary || 0), 0);
      
      if (sumAmountHardWorking > 0) {
        textArray.push("เบี้ยขยัน");
        countArray.push("");
        valueArray.push(sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ค่าเดินทาง
      const travelItems = addSalaryList.filter((item) => item.id === "1230");
      const sumAddSalaryTavel = travelItems.reduce((sum, item) => sum + parseFloat(item.SpSalary || 0), 0);
      
      if (sumAddSalaryTavel > 0) {
        textArray.push("ค่าเดินทาง(ไม่คิดประกัน)");
        countArray.push("");
        valueArray.push(sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ค่าอาหาร
      const foodItems = addSalaryList.filter((item) => item.id === "1350");
      const sumAddSalaryFood = foodItems.reduce((sum, item) => sum + parseFloat(item.SpSalary || 0), 0);
      
      if (sumAddSalaryFood > 0) {
        textArray.push("ค่าอาหาร");
        countArray.push("");
        valueArray.push(sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // จ่ายชดเชยวันลา
      const excludedIdsPayCompensation = [
        "1231", "1233", "1422", "1423", "1428", "1434", 
        "1435", "1429", "1427", "1234", "1426", "1425",
      ];
      const addSalaryPayCompensationFiltered = addSalaryList
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id));
      
      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + parseFloat(salary.SpSalary || 0), 0
      );

      if (totalSpSalaryCompensation > 0) {
        textArray.push("จ่ายชดเชยวันลา");
        countArray.push("");
        valueArray.push(totalSpSalaryCompensation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // แสดงรายการรายได้
      let y = 44;
      textArray.forEach((text, index) => {
        pdf.text(text, 10, y);
        pdf.text(countArray[index] || "", 56, y, { align: "right" });
        pdf.text(valueArray[index], 92, y, { align: "right" });
        y += 6;
      });

      // รายการหัก - ใช้ข้อมูลที่แก้ไขแล้ว
      const textDedustArray = [];
      const valueDedustArray = [];

      // ภาษีเงินได้ - ใช้ข้อมูลที่แก้ไขแล้ว
      const tax = parseFloat(accountingRecord.tax || currentEmployee.tax || 0);
      if (tax > 0) {
        textDedustArray.push("ภาษีเงินได้");
        valueDedustArray.push(tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // ประกันสังคม - ใช้ข้อมูลที่แก้ไขแล้ว
      const socialSecurity = parseFloat(accountingRecord.socialSecurity || currentEmployee.socialSecurity || 0);
      if (socialSecurity > 0) {
        textDedustArray.push("ประกันสังคม");
        valueDedustArray.push(socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // คืนเงินเบิกล่วงหน้า - ใช้ข้อมูลที่แก้ไขแล้ว
      const advance = parseFloat(accountingRecord.advance || 
        (currentEmployee.deductSalaryList && 
         currentEmployee.deductSalaryList[0] && 
         currentEmployee.deductSalaryList[0].amount) || 0);
      
      if (advance > 0) {
        textDedustArray.push("คืนเงินเบิกล่วงหน้า");
        valueDedustArray.push(advance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }

      // แสดงรายการหัก
      let deductionY = 44;
      textDedustArray.forEach((text, index) => {
        pdf.text(text, 100, deductionY);
        pdf.text(valueDedustArray[index], 160, deductionY, { align: "right" });
        deductionY += 6;
      });

      // คำนวณและแสดงยอดรวม - ใช้ข้อมูลที่แก้ไขแล้ว
      const totalIncome = valueArray.reduce((sum, val) => {
        const numVal = parseFloat(val.replace(/,/g, ''));
        return sum + (isNaN(numVal) ? 0 : numVal);
      }, 0);
      
      const totalDeduction = valueDedustArray.reduce((sum, val) => {
        const numVal = parseFloat(val.replace(/,/g, ''));
        return sum + (isNaN(numVal) ? 0 : numVal);
      }, 0);
      
      const netSalary = totalIncome - totalDeduction;

      pdf.text(totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 92, head2 + 71, { align: "right" });
      pdf.text(totalDeduction.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 160, head2 + 71, { align: "right" });
      pdf.text(netSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, head2 + 72, { align: "right" });

      console.log(`💰 Employee ${i} - Total Income: ${totalIncome}, Total Deduction: ${totalDeduction}, Net: ${netSalary}`);

      // ถ้ามีพนักงานคนที่สอง ทำเหมือนกัน
      if (i + 1 < dataToUse.length) {
        const nextEmployee = dataToUse[i + 1];
        console.log(`📝 Processing second employee ${i + 1}:`, nextEmployee);
        
        // ประมวลผลรายการเงินเดือนสำหรับพนักงานคนที่สอง
        const textArray2 = [];
        const valueArray2 = [];
        let totalIncome2 = 0;
        let totalDeduction2 = 0;

        // วันลาพักร้อนสำหรับพนักงานคนที่สอง
        const holidayDays2 = nextEmployee.holidaydays || 0;
        const holidayPay2 = nextEmployee.holiday_pay || 0;
        if (holidayDays2 > 0 && holidayPay2 > 0) {
          textArray2.push(`วันลาพักร้อน ${holidayDays2} วัน`);
          valueArray2.push(holidayPay2);
          totalIncome2 += holidayPay2;
        }

        // OT 1.5 เท่าสำหรับพนักงานคนที่สอง
        const ot15Hours2 = nextEmployee.ot_1_5_hours || 0;
        const ot15Rate2 = nextEmployee.ot_1_5_bath || 0;
        if (ot15Hours2 > 0 && ot15Rate2 > 0) {
          textArray2.push(`OT 1.5 เท่า ${ot15Hours2} ชม.`);
          valueArray2.push(ot15Rate2);
          totalIncome2 += ot15Rate2;
        }

        // OT 2 เท่าสำหรับพนักงานคนที่สอง
        const ot2Hours2 = nextEmployee.ot_2_hours || 0;
        const ot2Rate2 = nextEmployee.ot_2_bath || 0;
        if (ot2Hours2 > 0 && ot2Rate2 > 0) {
          textArray2.push(`OT 2 เท่า ${ot2Hours2} ชม.`);
          valueArray2.push(ot2Rate2);
          totalIncome2 += ot2Rate2;
        }

        // OT 3 เท่าสำหรับพนักงานคนที่สอง
        const ot3Hours2 = nextEmployee.ot_3_hours || 0;
        const ot3Rate2 = nextEmployee.ot_3_bath || 0;
        if (ot3Hours2 > 0 && ot3Rate2 > 0) {
          textArray2.push(`OT 3 เท่า ${ot3Hours2} ชม.`);
          valueArray2.push(ot3Rate2);
          totalIncome2 += ot3Rate2;
        }

        // เงินเดือนและค่าตอบแทนอื่นๆ สำหรับพนักงานคนที่สอง
        // เพิ่มเงินเดือนพื้นฐาน
        const baseSalary2 = nextEmployee.total_salary_calculation || 0;
        if (baseSalary2 > 0) {
          textArray2.push('เงินเดือน');
          valueArray2.push(baseSalary2);
          totalIncome2 += baseSalary2;
        }

        // เพิ่มรายการเงินเพิ่มพิเศษอื่นๆ จาก addSalaryList ถ้ามี
        if (nextEmployee.addSalaryList && Array.isArray(nextEmployee.addSalaryList)) {
          nextEmployee.addSalaryList.forEach(addSalaryItem => {
            const amount = parseFloat(addSalaryItem.SpSalary || 0);
            if (amount > 0) {
              textArray2.push(addSalaryItem.name || 'รายการพิเศษ');
              valueArray2.push(amount);
              totalIncome2 += amount;
            }
          });
        }

        // รายการหักเงินสำหรับพนักงานคนที่สอง
        const deductionItems2 = [];
        const socialSecurity2 = nextEmployee.total_salary_socialsecurity || 0;
        const tax2 = nextEmployee.total_salary_tex || 0;
        const providentFund2 = nextEmployee.total_salary_pvfund || 0;

        if (socialSecurity2 > 0) {
          deductionItems2.push(['เงินประกันสังคม', socialSecurity2]);
          totalDeduction2 += socialSecurity2;
        }
        if (tax2 > 0) {
          deductionItems2.push(['ภาษีเงินได้ บุคคลธรรมดา', tax2]);
          totalDeduction2 += tax2;
        }
        if (providentFund2 > 0) {
          deductionItems2.push(['เงินสำรองเลี้ยงชีพ', providentFund2]);
          totalDeduction2 += providentFund2;
        }

        // คำนวณเงินสุทธิสำหรับพนักงานคนที่สอง
        const netSalary2 = totalIncome2 - totalDeduction2;

        // ข้อมูลพนักงานคนที่สอง
        const empName2 = nextEmployee.name || 'ไม่ระบุ';
        const empId2 = nextEmployee.employeeid || 'ไม่ระบุ';
        const position2 = nextEmployee.position_name || 'ไม่ระบุ';
        const workPlace2 = nextEmployee.workplace_name || 'ไม่ระบุ';
        const workdays2 = nextEmployee.workdays || 0;

        // แสดงข้อมูลพนักงานคนที่สอง
        pdf.text(`ชื่อ : ${empName2}`, 110, head2 + 14);
        pdf.text(`รหัสพนักงาน : ${empId2}`, 110, head2 + 19);
        pdf.text(`ตำแหน่ง : ${position2}`, 110, head2 + 24);
        pdf.text(`สถานที่ปฏิบัติงาน : ${workPlace2}`, 110, head2 + 29);
        pdf.text(`วันทำงาน : ${workdays2} วัน`, 110, head2 + 34);

        // แสดงรายการรายได้สำหรับพนักงานคนที่สอง
        let yPos2 = head2 + 45;
        textArray2.forEach((text, index) => {
          if (yPos2 <= head2 + 65) {
            pdf.text(text, 110, yPos2);
            pdf.text(valueArray2[index].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, yPos2, { align: "right" });
            yPos2 += 4;
          }
        });

        // แสดงรายการหักเงินสำหรับพนักงานคนที่สอง
        deductionItems2.forEach(([text, value]) => {
          if (yPos2 <= head2 + 65) {
            pdf.text(text, 125, yPos2);
            pdf.text(value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, yPos2, { align: "right" });
            yPos2 += 4;
          }
        });

        // สรุปยอดสำหรับพนักงานคนที่สอง
        pdf.text(totalIncome2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, head2 + 71, { align: "right" });
        pdf.text(totalDeduction2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, head2 + 71, { align: "right" });
        pdf.text(netSalary2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 188, head2 + 72, { align: "right" });

        console.log(`💰 Employee ${i + 1} - Total Income: ${totalIncome2}, Total Deduction: ${totalDeduction2}, Net: ${netSalary2}`);

        i++; // ข้ามพนักงานคนที่สองเพราะประมวลผลแล้ว
      }
    }

    // บันทึกและแสดง PDF
    const fileName = `salary_slip_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
      // บันทึกและแสดง PDF
      window.open(pdf.output("bloburl"), "_blank");
      console.log("✅ PDF generation completed successfully with edited data!");
      
    } catch (error) {
      console.error("❌ Error in generatePDFWithData:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF: " + error.message);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลพนักงานจาก API
  const getEmployeeBankNumber = async (employeeId) => {
    console.log("🚀 START: getEmployeeBankNumber called with employeeId:", employeeId);
    
    try {
      console.log(`🏦 กำลังดึงเลขบัญชีสำหรับพนักงาน ID: ${employeeId}`);
      console.log("🌐 Sending request to API...");
      
      const response = await axios.post("http://10.10.110.7:3000/employee/search", {
        employeeId: employeeId
      });
      
      console.log("✅ API Response received:");
      console.log("📊 Response status:", response.status);
      console.log("📋 Response data:", response.data);
      
      // แก้ไข: ตรวจสอบ response.data.employees แทน response.data
      if (response.data && response.data.employees && response.data.employees.length > 0) {
        const employee = response.data.employees[0];
        console.log("👤 Employee data found:", employee);
        
        const banknumber = employee.banknumber || "Unknown";
        console.log(`🏦 พบเลขบัญชี: ${banknumber} สำหรับพนักงาน ${employeeId}`);
        console.log("✅ END: Returning banknumber:", banknumber);
        return banknumber;
      } else {
        console.log(`❌ ไม่พบข้อมูลพนักงาน ID: ${employeeId}`);
        console.log("🔍 Available data structure:", {
          hasData: !!response.data,
          hasEmployees: !!(response.data && response.data.employees),
          employeesLength: response.data?.employees?.length || 0
        });
        console.log("❌ END: Returning 'Unknown'");
        return "Unknown";
      }
    } catch (error) {
      console.error(`💥 Error fetching employee bank number for ${employeeId}:`, error);
      console.error("💥 Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      console.log("❌ END: Returning 'Unknown' due to error");
      return "Unknown";
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลการตั้งค่าพื้นฐานจาก API
  const getBasicSettings = async () => {
    console.log("🚀 START: getBasicSettings called");
    
    try {
      console.log("🌐 Sending request to basic settings API...");
      
      const response = await axios.get("http://10.10.110.7:3000/basicsetting");
      
      console.log("✅ Basic Settings API Response received:");
      console.log("📊 Response status:", response.status);
      console.log("📋 Response data:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setBasicSettings(response.data);
        console.log("✅ Basic settings data stored successfully");
        
        // หาข้อมูลที่มี paymentPeriod และ status = "active"
        const activeSettingWithPayment = response.data.find(setting => 
          setting.status === "active" && 
          setting.paymentPeriod && 
          setting.paymentPeriod.length > 0
        );
        
        if (activeSettingWithPayment) {
          console.log("🎯 Found active setting with payment period:", activeSettingWithPayment);
          
          // แปลงเดือนเป็นชื่อเดือนใน paymentPeriod
          const monthNames = {
            "01": "jan", "02": "feb", "03": "mar", "04": "apr",
            "05": "may", "06": "jun", "07": "jul", "08": "aug", 
            "09": "sep", "10": "oct", "11": "nov", "12": "dec"
          };
          
          const monthKey = monthNames[month];
          const paymentPeriod = activeSettingWithPayment.paymentPeriod[0];
          
          if (paymentPeriod && paymentPeriod[monthKey]) {
            const date = paymentPeriod[monthKey];
            const formattedDate = formatDateToThai(date);
            setPaymentDate(formattedDate);
            console.log(`💰 Payment date for month ${month}: ${date} -> ${formattedDate}`);
          } else {
            console.log(`❌ No payment date found for month ${month}`);
            setPaymentDate("");
          }
        } else {
          console.log("❌ No active setting with payment period found");
          setPaymentDate("");
        }
      } else {
        console.log("❌ Invalid response data format");
        setBasicSettings([]);
        setPaymentDate("");
      }
    } catch (error) {
      console.error("💥 Error fetching basic settings:", error);
      console.error("💥 Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setBasicSettings([]);
      setPaymentDate("");
    }
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateToThai = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    // Set setStaffId based on the selected option
    if (value === "option1") {
      setStaffId("");
      setSearchEmployeeId("");
      setStaffName("");
      setStaffFullName("");
      setSearchEmployeeName("");

      setResponseDataAll("");
    } else if (value === "option2") {
      // Set setStaffId to another value if needed
      setWorkplacrId("");
      setWorkplacrName("");

      setResponseDataAll("");
    }
  };




  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/employee/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setEmployeeListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // useEffect สำหรับดึงข้อมูลการตั้งค่าพื้นฐาน
  useEffect(() => {
    getBasicSettings();
  }, [month]); // เรียกใหม่เมื่อเดือนเปลี่ยน

 // แก้ไข useEffect เดิมที่เรียก /accounting/calsalarylist
useEffect(() => {
  const fetchData = async () => {
    const dataTest = {
      year: year.toString(),
      month: month.toString().padStart(2, '0'),
    };

    console.log("🚀 Sending POST request to API:", "http://10.10.110.7:3000/accounting/searchtimerecordemployee");
    console.log("📅 Request data:", dataTest);
    console.log("🔍 Selected option:", selectedOption);
    console.log("🏢 Search workplace ID:", searchWorkplaceId);
    console.log("👤 Search employee ID:", searchEmployeeId);

    // เปลี่ยนเป็น POST http://10.10.110.7:3000/accounting/searchtimerecordemployee
    try {
      const response = await axios.post("http://10.10.110.7:3000/accounting/searchtimerecordemployee", dataTest);
      
      console.log("✅ API Response received:", response.data);
      console.log("📊 Total records from API:", response.data?.result?.length || 0);
      
      if (selectedOption == "option1") {
        const responseData = response.data.result; // แก้ไข: เข้าถึง result array
        console.log("🔄 Processing Option 1 (Workplace filter)");

        // Filter data based on searchWorkplaceId if provided
        const filteredData = searchWorkplaceId
          ? responseData.filter((item) => {
              // กรองตาม workplaceId จาก employee_record
              return item.employee_record && item.employee_record.some(
                (record) => record.workplaceId === searchWorkplaceId
              );
            })
          : responseData;

          console.log("🏢 After workplace filter:", filteredData.length, "records");

          // เพิ่ม log เพื่อดูโครงสร้างข้อมูล
          if (filteredData.length > 0) {
            console.log("📋 Sample data structure:", filteredData[0]);
            console.log("👤 Employee data keys:", Object.keys(filteredData[0]));
            if (filteredData[0].employee_record) {
              console.log("🏢 Employee record structure:", filteredData[0].employee_record[0]);
            }
          }

          // กรองออกพนักงานที่มีหน่วยงานต้นสังกัดเป็น "10105" 
          const filteredExclude10105 = await Promise.all(
            filteredData.map(async (item) => {
              try {
                // เรียก API เพื่อเช็คหน่วยงานต้นสังกัดของพนักงาน
                const response = await axios.post("http://10.10.110.7:3000/employee/search", {
                  employeeId: item.employeeId
                });
                
                if (response.data && response.data.employees && response.data.employees.length > 0) {
                  const employee = response.data.employees[0];
                  
                  // เพิ่ม logging เพื่อดู structure ของ employee data
                  console.log(`🔍 Employee API Response for ${item.employeeId}:`, employee);
                  console.log(`🔑 Available keys:`, Object.keys(employee));
                  
                  const originalWorkplace = employee.workplace; // หน่วยงานต้นสังกัด
                  
                  console.log(`👤 Employee ${item.employeeId} (${item.employeeName}):`, {
                    originalWorkplace: originalWorkplace,
                    currentWork: item.employee_record?.[0]?.workplaceId,
                    fullEmployeeData: employee
                  });
                  
                  // ถ้าหน่วยงานต้นสังกัดเป็น 10105 ให้กรองออก
                  if (originalWorkplace === "10105") {
                    console.log(`🚫 Filtering out employee ${item.employeeId} - original workplace is 10105`);
                    return null; // กรองออก
                  }
                }
                return item; // เก็บไว้
              } catch (error) {
                console.error(`❌ Error checking employee ${item.employeeId}:`, error);
                return item; // ถ้า error ให้เก็บไว้
              }
            })
          ).then(results => results.filter(item => item !== null)); // กรองออก null values

          console.log("🚫 After excluding workplace 10105:", filteredExclude10105.length, "records");
          console.log("📋 Records excluded from 10105:", filteredData.length - filteredExclude10105.length);

          // Sort filteredExclude10105 by workplaceId in ascending order
          filteredExclude10105.sort((a, b) => {
            const workplaceA = a.employee_record[0]?.workplaceId || "";
            const workplaceB = b.employee_record[0]?.workplaceId || "";
            
            const workplaceNumA = Number(workplaceA);
            const workplaceNumB = Number(workplaceB);

            if (workplaceNumA < workplaceNumB) {
              return -1;
            }
            if (workplaceNumA > workplaceNumB) {
              return 1;
            }
            return 0;
          });

          // Filter by year and month
          const dateFilteredData = filteredExclude10105.filter(
            (item) => item.year === year.toString() && item.month === month.toString().padStart(2, '0')
          );

          console.log("📅 After date filter:", dateFilteredData.length, "records");
          console.log("📋 Final filtered data:", dateFilteredData);
          setResponseDataAll(dateFilteredData);
        } else if (selectedOption == "option2") {
          const responseData = response.data.result; // แก้ไข: เข้าถึง result array
          console.log("🔄 Processing Option 2 (Employee filter)");

          // Filter data based on searchEmployeeId if provided
          const filteredData = searchEmployeeId
            ? responseData.filter((item) => item.employeeId === searchEmployeeId)
            : responseData;

          console.log("👤 After employee filter:", filteredData.length, "records");

          // Sort filteredData by workplaceId in ascending order
          filteredData.sort((a, b) => {
            const workplaceA = a.employee_record?.[0]?.workplaceId || "";
            const workplaceB = b.employee_record?.[0]?.workplaceId || "";
            
            const workplaceNumA = Number(workplaceA);
            const workplaceNumB = Number(workplaceB);

            if (workplaceNumA < workplaceNumB) {
              return -1;
            }
            if (workplaceNumA > workplaceNumB) {
              return 1;
            }
            return 0;
          });

          // Filter by year and month
          const dateFilteredData = filteredData.filter(
            (item) => item.year === year.toString() && item.month === month.toString().padStart(2, '0')
          );

          console.log("📅 After date filter:", dateFilteredData.length, "records");
          console.log("📋 Final filtered data:", dateFilteredData);
          setResponseDataAll(dateFilteredData);
        }
      } catch (error) {
        console.error("❌ API Error:", error);
        console.error("❌ Error message:", error.message);
        if (error.response) {
          console.error("❌ Response status:", error.response.status);
          console.error("❌ Response data:", error.response.data);
        }
      }
  };

  // Call fetchData when year, month, or searchWorkplaceId changes
  fetchData();
}, [year, month, searchWorkplaceId, searchEmployeeId]);

  const handleStaffIdChange = (e) => {
    const selectWorkPlaceId = e.target.value;
    setWorkplacrId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(
      (workplace) => workplace.workplaceId == selectWorkPlaceId
    );
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setWorkplacrName(selectedWorkplace.workplaceName);
    } else {
      setWorkplacrName("");
    }
  };

  const handleStaffNameChange = (e) => {
    const selectWorkplaceName = e.target.value;

    // Find the corresponding employee and set the staffId and staffName
    const selectedEmployee = workplaceListAll.find(
      (workplace) => workplace.workplaceName == selectWorkplaceName
    );
    const selectedEmployeeFName = workplaceListAll.find(
      (workplace) => workplace.workplaceName === selectWorkplaceName
    );

    if (selectedEmployee) {
      setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      // setWorkplacrName(selectedEmployee.workplaceName);
    } else {
      setWorkplacrId("");
      // setSearchWorkplaceId('');
      // setWorkplacrName('');
    }
    setWorkplacrName(selectWorkplaceName);
  };

  const handleStaffIdChange2 = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);
    setSearchEmployeeId(selectedStaffId);
    // Find the corresponding employee and set the staffName
    const selectedEmployee = employeeList.find(
      (employee) => employee.employeeId === selectedStaffId
    );
    if (selectedEmployee) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setStaffFullName(selectedEmployee.name + " " + selectedEmployee.lastName);
    } else {
      setStaffName("");
      setStaffFullName("");
      setSearchEmployeeName("");
    }
  };

  const handleStaffNameChange2 = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(
      (employee) =>
        employee.name + " " + employee.lastName === selectedStaffName
    );
    const selectedEmployeeFName = employeeList.find(
      (employee) => employee.name === selectedStaffName
    );

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
    } else {
      setStaffId("");
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  // ...existing code after useEffects...

// เพิ่มฟังก์ชันใหม่
// แก้ไขฟังก์ชัน getSumCashWork ให้ใช้ responseDataAll แทน cashWorkData
const getSumCashWork = (employeeId) => {
  const employeeData = responseDataAll.find(item => item.employeeId === employeeId);
  return employeeData ? parseFloat(employeeData.sumCashWork || 0) : 0;
};

const generatePDF = async () => {
  // ADD - ป้องกันการกดซ้ำ
  if (isGeneratingPDF) return;
  
  // ADD - ตรวจสอบข้อมูล
  if (!responseDataAll || responseDataAll.length === 0) {
    alert("กรุณารอให้ข้อมูลโหลดเสร็จก่อน หรือเลือกเงื่อนไขการค้นหา");
    return;
  }
  
  try {
    setIsGeneratingPDF(true); // ADD - เริ่ม loading
    console.log("🎯 START: generatePDF function called");
    console.log("📊 ResponseDataAll length:", responseDataAll?.length);
    console.log("📊 ResponseDataAll data:", responseDataAll);
    console.log("✏️ EditableData:", editableData);
    console.log("🔄 Has edited data:", editableData && editableData.length > 0);
   
    // ฟังก์ชันสำหรับดึงข้อมูลที่แก้ไขแล้ว หรือข้อมูลเดิม
    const getEmployeeData = (originalEmployee, index) => {
      // ตรวจสอบว่ามีข้อมูลที่แก้ไขหรือไม่
      if (editableData && editableData.length > index && editableData[index]?.editableFields) {
        const editedFields = editableData[index].editableFields;
        console.log(`🔄 Using edited data for employee ${index}:`, editedFields);
        
        // ใช้ข้อมูลที่แก้ไขแล้ว
        return {
          ...originalEmployee,
          // แทนค่าที่แก้ไขใน employee_record
          employee_record: originalEmployee.employee_record?.map(record => ({
            ...record,
            cashWork: editedFields.sumCashWork / (originalEmployee.employee_record?.filter(r => r.dayType === "work").length || 1),
            cashOt: editedFields.sumCashOt / (originalEmployee.employee_record?.length || 1),
          })) || [],
          // แทนค่าใน accountingRecord
          sumCashWork: editedFields.sumCashWork || originalEmployee.sumCashWork || 0,
          sumCashOt: editedFields.sumCashOt || originalEmployee.sumCashOt || 0,
          cashSpecialDay: editedFields.publicHolidayCash || originalEmployee.cashSpecialDay || 0,
          tax: editedFields.tax || originalEmployee.tax || 0,
          socialSecurity: editedFields.socialSecurity || originalEmployee.socialSecurity || 0,
          advance: editedFields.advance || originalEmployee.advance || 0,
          // คำนวณเงิน OT แยกตามประเภทจากข้อมูลที่แก้ไข
          sumOt1p5: editedFields.sumOt1p5 || originalEmployee.sumOt1p5 || 0,
          sumOtPublicHoliday: editedFields.sumOtPublicHoliday || originalEmployee.sumOtPublicHoliday || 0,
          sumOt3: editedFields.sumOt3 || originalEmployee.sumOt3 || 0,
          // สร้าง sumCashWorkMul ใหม่จากข้อมูลที่แก้ไข
          sumCashWorkMul: {
            "1": editedFields.sumCashWork || originalEmployee.sumCashWorkMul?.["1"] || 0,
            "1.5": editedFields.sumCashWorkMul?.["1.5"] || 
                   (editedFields.sumOt1p5 || originalEmployee.sumOt1p5 || 0) * 
                   (originalEmployee.salaryPerHour || originalEmployee.dailyWage / 8 || 200) * 1.5,
            "2": editedFields.sumCashWorkMul?.["2"] || 
                 (editedFields.sumOtPublicHoliday || originalEmployee.sumOtPublicHoliday || 0) * 
                 (originalEmployee.salaryPerHour || originalEmployee.dailyWage / 8 || 200) * 2,
            "3": editedFields.sumCashWorkMul?.["3"] || 
                 (editedFields.sumOt3 || originalEmployee.sumOt3 || 0) * 
                 (originalEmployee.salaryPerHour || originalEmployee.dailyWage / 8 || 200) * 3
          },
          // แทนค่าใน addSalaryList
          addSalaryList: editedFields.addSalaryList || originalEmployee.addSalaryList || []
        };
      } else {
        console.log(`📋 Using original data for employee ${index}`);
        return originalEmployee;
      }
    };

  // Create a new instance of jsPDF
  const pdf = new jsPDF();

  const fontPath = "/assets/fonts/THSarabunNew.ttf";
  pdf.addFileToVFS(fontPath);
  pdf.addFont(fontPath, "THSarabunNew", "normal");

  // Add bold font
  const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
  pdf.addFileToVFS(boldFontPath);
  pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

  // Override the default stylestable for jspdf-autotable
  const stylestable = {
    font: "THSarabunNew",
    fontStyle: "normal",
    fontSize: 10,
  };
  const tableOptions = {
    styles: stylestable,
    startY: 25,
  };

  // Set the initial position for text and frame
  let x = 20;

  pdf.setFont("THSarabunNew Bold");

  // ฟังก์ชันคำนวณเงินรับสุทธิ
  const calculateNetSalary = (employee) => {
    const incomeTotal = 
      parseFloat(employee?.sumCashWork || '0') + 
      parseFloat(employee?.sumCashOt || '0') +
      parseFloat(employee?.cashSpecialDay || '0') + 
      parseFloat(
        employee?.addSalaryList?.reduce(
          (total, item) => total + parseFloat(item.SpSalary || '0'),
          0
        ) || '0'
      );

    const deductionTotal =
      parseFloat(employee?.socialSecurity || '0') +
      parseFloat(employee?.tax || '0');

    const netTotal = incomeTotal - deductionTotal;

    return isNaN(netTotal) ? 0 : netTotal;
  };

  // Loop through the names and ages arrays to add content to the PDF
  for (let i = 0; i < responseDataAll.length; i += 2) {
    console.log(`🔄 Processing employee loop iteration ${i}/${responseDataAll.length}`);
    
    // Add a page for each pair of names
    if (i > 0) {
      pdf.addPage();
    }

    // ใช้ข้อมูลที่แก้ไขแล้วสำหรับพนักงานคนแรก
    const originalEmployee = responseDataAll[i];
    const currentEmployee = getEmployeeData(originalEmployee, i);
    console.log(`👤 Processing employee ${i}:`, currentEmployee?.employeeId, currentEmployee?.employeeName);
    console.log(`📝 Using data for employee ${i}:`, currentEmployee);
    
    const employeeRecords = currentEmployee.employee_record || [];
    const addSalaryList = currentEmployee.addSalaryList || [];

    // คำนวณเงินรับสุทธิสำหรับพนักงานคนแรก
    const netSalary1 = calculateNetSalary(currentEmployee);

    // คำนวณจำนวนวันทำงาน (ใช้ข้อมูลที่แก้ไขแล้ว)
    const workDays = editableData && editableData.length > i && editableData[i]?.editableFields?.workDays ||
                     employeeRecords.filter(record => record.dayType === "work").length;

      // รวมเงินจาก cashWork (ใช้ข้อมูลที่แก้ไขแล้ว)
    const totalCashWork = currentEmployee.sumCashWork || employeeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.cashWork || 0);
    }, 0);

    // รวมเงิน OT (ใช้ข้อมูลที่แก้ไขแล้ว)
    const totalCashOt = currentEmployee.sumCashOt || employeeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.cashOt || 0);
    }, 0);
    // กรองเงินพิเศษตาม ID
    const excludedIds = ["1350", "1230", "1410", "1535", "1520",];
    const addSalaryFiltered = addSalaryList
      .filter((salary) => !excludedIds.includes(salary.id))
      .map((salary) => ({
        name: salary.name,
        SpSalary: Number(salary.SpSalary) || 0,
      }));

    // จ่างชดเชย
    const excludedIdsPayCompensation = [
      "1231", "1233", "1422", "1423", "1428", "1434", 
      "1435", "1429", "1427", "1234", "1426", "1425",
    ];

    const addSalaryPayCompensationFiltered = addSalaryList
      .filter((salary) => excludedIdsPayCompensation.includes(salary.id))
      .map((salary) => ({
        name: salary.name,
        SpSalary: Number(salary.SpSalary) || 0,
      }));

    // เบี้ยขยัน
    const formattedAmountHardWorking = addSalaryList.filter(
      (item) => item.id === "1410"
    );

    // ค่าเดินทาง(ไม่คิดประกัน)
    const formattedAddSalaryTavel = addSalaryList.filter(
      (item) => item.id === "1535"
    );

    const formattedAddSalaryFood = addSalaryList.filter(
      (item) => item.id === "1330"
    );

    const formattedAddSpeacialCash= addSalaryList.filter(
      (item) => item.id === "1560"
    );

    // Calculate the sum of SpSalary values in the filtered array
    const sumAmountHardWorking = formattedAmountHardWorking.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSalaryFood = formattedAddSalaryFood.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSpecialCash = formattedAddSpeacialCash.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    // วันหยุดนักขัติฤกษ์
    const specialDayOff = parseInt(currentEmployee.specialDayOff || 0);

    pdf.setFontSize(15);

    pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);
    pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);

    pdf.setFontSize(12);

    const head = 25;
    const head2 = 155;

    pdf.text(`รหัส`, 7, head);
    pdf.text(`ชื่อ-สกุล`, 30, head);
    pdf.text(`หน่วยงาน`, 80, head);

    // ใช้ workplaceId จาก employee_record
    const currentWorkplaceId = employeeRecords[0]?.workplaceId;
    pdf.text(`${currentWorkplaceId || ""}`, 93, head);

    const workplace = workplaceList.find(
      (item) => item.workplaceId === currentWorkplaceId
    );

    const workplaceName = workplace ? workplace.workplaceName : "Unknown";
    pdf.text(`${workplaceName}`, 103, head);

    // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
    console.log("📋 About to call getEmployeeBankNumber with:", currentEmployee?.employeeId);
    console.log("👤 Current employee data:", currentEmployee);
    console.log("🔍 Employee ID exists?", !!currentEmployee?.employeeId);
    
    if (!currentEmployee?.employeeId) {
      console.error("❌ No employeeId found in currentEmployee!");
      console.log("🔍 Available keys in currentEmployee:", Object.keys(currentEmployee || {}));
    }
    
    const banknumber = await getEmployeeBankNumber(currentEmployee.employeeId);
    console.log("💰 Final banknumber result:", banknumber);
    pdf.text(`เลขที่บัญชี ${banknumber}`, 168, head);

    // สวัสดิการหลัก
   const namesWithSpecificIds = addSalaryList
  .filter((item) => ["1230", "1350", "1535"].includes(item.id))
  .map((item) => {
    if (item.id === "1350") {
      return "โทรศัพท์";
    } else if (item.id === "1535") {
      return "ค่าเดินทาง";
    } else {
      return item.name;
    }
  });

  const nameWithExtraCash = addSalaryList 
   .filter((item) => ["1560", "1563"].includes(item.id))
  .map((item) => {
    if (item.id === "1560") {
      return "เงินเพิ่มพิเศษ";
    } else if (item.id === "1563") {
      return "เงินพิเศษวันหยุด";
    } else {
      return item.name;
    }
  });



   const specificIds = ["1230", "1350", "1535"];
const result = addSalaryList
  .filter((item) => specificIds.includes(item.id))
  .reduce(
    (acc, item) => {
      acc.names.push(item.id === "1350" ? "โทรศัพท์" : (item.id === "1535" ? "ค่าเดินทาง" : item.name));
      acc.sumSpSalary += Number(item.SpSalary) || 0;
      return acc;
    },
    { names: [], sumSpSalary: 0 }
  );

  const extraCashIds = ["1560", "1563"];
const resultExtraCash = addSalaryList
  .filter((item) => extraCashIds.includes(item.id))
  .reduce(
    (acc, item) => {
      acc.names.push(item.id === "1560" ? "เงินเพิ่มพิเศษ" : (item.id === "1563" ? "เงินพิเศษวันหยุด" : item.name));
      acc.sumSpSalary += Number(item.SpSalary) || 0;
      return acc;
    },
    { names: [], sumSpSalary: 0 }
  );


    const concatenatedNames =
      namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
      const concatenatedNamesExtraCash =
      nameWithExtraCash.length > 0 ? nameWithExtraCash.join("/") : "";

    // Draw tables and frames
    pdf.rect(7, 28, 155, 74); //ตารางหลัก
    pdf.rect(7, 28, 155, 12); //ตารางหลัก หัวตาราง
    pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
    pdf.rect(7, 28, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
    pdf.text(`รายได้`, 24, 34);
    pdf.text(`Earnings`, 22, 37);

    const textArray = [];
    const countArray = [];
    const valueArray = [];

    // เงินเดือนพื้นฐาน (ใช้ข้อมูลที่แก้ไขแล้ว)
    if (totalCashWork > 0) {
      textArray.push("เงินเดือน");
      countArray.push(workDays.toString());
      valueArray.push(totalCashWork);
    }
  const pubDayCount = parseFloat(currentEmployee.publicHolidayCount || 0);
  const pubDayCash = parseFloat(currentEmployee.publicHolidayCash || 0);

     if (pubDayCount > 0) {
      textArray.push("วันหยุดนักขัตฤกษ์");
      countArray.push(pubDayCount.toString());
      valueArray.push(
      currentEmployee.publicHolidayCash
      );
    }


const ot15Hours = parseFloat(currentEmployee.sumOt1p5 || 0);
const ot15Cash = parseFloat(currentEmployee.sumCashWorkMul?.["1.5"] || 0);

if (ot15Hours > 0 && ot15Cash > 0) {
  textArray.push("ค่าล่วงเวลา 1.5 เท่า");
  countArray.push(ot15Hours.toFixed(2));
  valueArray.push(
    ot15Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}


const ot2Hours = parseFloat(currentEmployee.sumOtPublicHoliday || 0);
const ot2Cash = parseFloat(currentEmployee.sumCashWorkMul?.["2"] || 0);

if (ot2Hours > 0 && ot2Cash > 0) {
  textArray.push("ค่าล่วงเวลา 2 เท่า");
  countArray.push(ot2Hours.toFixed(2));
  valueArray.push(
    ot2Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

// ค่าล่วงเวลา 3 เท่า
const ot3Hours = parseFloat(currentEmployee.sumOt3 || 0);
const ot3Cash = parseFloat(currentEmployee.sumCashWorkMul?.["3"] || 0);

if (ot3Hours > 0 && ot3Cash > 0) {
  textArray.push("ค่าล่วงเวลา 3 เท่า");
  countArray.push(ot3Hours.toFixed(2));
  valueArray.push(
    ot3Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}


    // สวัสดิการหลัก
    if (result.sumSpSalary > 0) {
      textArray.push(concatenatedNames);
      countArray.push("");
      valueArray.push(
        result.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    if (resultExtraCash.sumSpSalary > 0) {
  textArray.push(concatenatedNamesExtraCash);
  countArray.push("");
  valueArray.push(
    resultExtraCash.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

  

    // เบี้ยขยัน
    if (sumAmountHardWorking > 0) {
      textArray.push("เบี้ยขยัน");
      countArray.push("");
      valueArray.push(
        sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }



    // รวมเงินพิเศษ
    // const totalSpSalary = addSalaryFiltered.reduce(
    //   (sum, salary) => sum + salary.SpSalary,
    //   0
    // );

    if (sumAddSalaryFood > 0) {
      textArray.push("ค่าอาหาร");
      countArray.push("");
      valueArray.push(
        sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    if (sumAddSpecialCash > 0) {
      textArray.push("ค่าเงินพิเศษ");
      countArray.push("");
      valueArray.push(
        sumAddSpecialCash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // จ่ายชดเชยวันลา
    const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
      (sum, salary) => sum + salary.SpSalary,
      0
    );

    if (totalSpSalaryCompensation > 0) {
      textArray.push("จ่ายชดเชยวันลา");
      countArray.push("");
      valueArray.push(
        totalSpSalaryCompensation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // รายการหัก (ใช้ข้อมูลที่แก้ไขแล้ว)
    const textDedustArray = [];
    const valueDedustArray = [];

    // ภาษี (ใช้ข้อมูลที่แก้ไขแล้ว)
    const tax = parseFloat(currentEmployee.tax || 0);
    if (tax > 0) {
      textDedustArray.push("ภาษีเงินได้ บุคคลธรรมดา");
      valueDedustArray.push(tax);
    }

    // ประกันสังคม (ใช้ข้อมูลที่แก้ไขแล้ว)
    const socialSecurity = parseFloat(currentEmployee.socialSecurity || 0);
    if (socialSecurity > 0) {
      textDedustArray.push("เงินประกันสังคม");
      valueDedustArray.push(socialSecurity);
    }
    
    // คืนเงินเบิกล่วงหน้า (ใช้ข้อมูลที่แก้ไขแล้ว)
    const advance = parseFloat(currentEmployee.advance || 
      (currentEmployee.deductSalaryList && 
       currentEmployee.deductSalaryList[0] && 
       currentEmployee.deductSalaryList[0].amount) || 0);
    
    if (advance > 0) {
      textDedustArray.push("คืนเงินเบิกล่วงหน้า");
      valueDedustArray.push(advance);
    }

    // Draw table headers and content
    pdf.rect(7, 28, 62, 63);
    pdf.text(`จำนวน`, 56, 34);
    pdf.text(`Number`, 55, 37);

    pdf.rect(69, 28, 24, 74);
    pdf.text(`จำนวนเงิน`, 74, 34);
    pdf.text(`Amount`, 75, 37);

    pdf.rect(69, 28, 69, 74);
    pdf.text(`รายการหัก / รายการคืน`, 102, 34);

    pdf.text(`รวมเงินได้`, 28, 96);
    pdf.text(`Total Earning`, 23, 100);

    pdf.text(`รายการหัก / รายการคืน`, 100, 96);
    pdf.text(`Total Deduction`, 105, 100);

    pdf.text(`จำนวนเงิน`, 144, 34);
    pdf.text(`Amount`, 145, 37);

    pdf.rect(162 + 9, 28, 25, 25);
    pdf.rect(162 + 9, 28, 25, 15);
    pdf.text(`วันที่จ่าย`, 179, 35);
    pdf.text(`Payroll Date`, 176, 38);
    pdf.text(`${paymentDate || "N/A"}`, 176, 49);

    pdf.rect(162 + 9, 77, 25, 25);
    pdf.rect(162 + 9, 77, 25, 15);
    pdf.text(`เงินรับสุทธิ`, 178, 84);
    pdf.text(`Net To Pay`, 177, 87);

    pdf.rect(7, 104, 155, 13);
    pdf.rect(7, 104, 155, 6.5);

    let x1 = 31;
    for (let j = 0; j < 5; j++) {
      pdf.rect(7, 104, x1, 13);
      x1 += 31;
    }

    pdf.text(`เงินได้สะสมต่อปี`, 9, 108);
    pdf.text(`ภาษีสะสมต่อปี`, 40, 108);
    pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108);
    pdf.text(`เงินประกันสะสมต่อปี`, 102, 108);
    pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108);

    pdf.rect(112, 119, 50, 12);
    pdf.text(`ลงชื่อพนักงาน`, 130, 130);

    // แสดงข้อมูลพนักงาน
    pdf.text(`${currentEmployee.employeeId}`, 13, head);
    pdf.text(`${currentEmployee.prefix} ${currentEmployee.employeeName}`, 40, head);

    // แสดงรายการรายได้
    let y = 44;
    textArray.forEach((text) => {
      pdf.text(`${text}`, 8, y);
      y += 4.1;
    });

    let y2 = 44;
    countArray.forEach((text) => {
      pdf.text(`${text}`, 68, y2, { align: "right" });
      y2 += 4.1;
    });

    let y3 = 44;
    valueArray.forEach((text) => {
      pdf.text(`${text}`, 92, y3, { align: "right" });
      y3 += 4.1;
    });

    // แสดงรายการหัก
    let y4 = 44;
    textDedustArray.forEach((text) => {
      pdf.text(`${text}`, 94, y4);
      y4 += 4.1;
    });

    let y5 = 44;
    valueDedustArray.forEach((value) => {
      pdf.text(
        `${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        160, 
        y5, 
        { align: "right" }
      );
      y5 += 4.1;
    });

    // รวมรายได้ทั้งหมด
    const incomeTotal = 
      parseFloat(currentEmployee?.sumCashWork || '0') + 
      parseFloat(currentEmployee?.sumCashOt || '0') +
      parseFloat(currentEmployee?.publicHolidayCash || '0') + 
      parseFloat(
        currentEmployee?.addSalaryList?.reduce(
          (total, item) => total + parseFloat(item.SpSalary || '0'),
          0
        ) || '0'
      );

    pdf.text(
      `${incomeTotal.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      92,
      96,
      { align: "right" }
    );

    // รวมเงินหัก
    const totalDeductions = tax + socialSecurity + advance ;
    pdf.text(
      `${totalDeductions.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      160,
      96,
      { align: "right" }
    );
    const totalNet = incomeTotal - totalDeductions;

    // เงินรับสุทธิ (ใช้สูตรคำนวณใหม่)
    pdf.text(
      `${totalNet.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      190,
      98,
      { align: "right" }
    );

    // สำหรับพนักงานคนที่ 2 (ถ้ามี)
    if (i + 1 < responseDataAll.length) {
      // ใช้ข้อมูลที่แก้ไขแล้วสำหรับพนักงานคนที่สอง
      const originalEmployee2 = responseDataAll[i + 1];
      const currentEmployee2 = getEmployeeData(originalEmployee2, i + 1);
      console.log(`👤 Processing second employee ${i + 1}:`, currentEmployee2?.employeeId, currentEmployee2?.employeeName);
      console.log(`📝 Using data for second employee ${i + 1}:`, currentEmployee2);
      
      const employeeRecords2 = currentEmployee2.employee_record || [];
      const addSalaryList2 = currentEmployee2.addSalaryList || [];

      // คำนวณเงินรับสุทธิสำหรับพนักงานคนที่ 2
      const netSalary2 = calculateNetSalary(currentEmployee2);

      // คำนวณข้อมูลสำหรับพนักงานคนที่ 2 (ใช้ข้อมูลที่แก้ไขแล้ว)
      const workDays2 = editableData && editableData.length > (i + 1) && editableData[i + 1]?.editableFields?.workDays ||
                        employeeRecords2.filter(record => record.dayType === "work").length;
      
      // รวมเงินจาก cashWork (ใช้ข้อมูลที่แก้ไขแล้ว)
      const totalCashWork2 = currentEmployee2.sumCashWork || employeeRecords2.reduce((sum, record) => {
        return sum + parseFloat(record.cashWork || 0);
      }, 0);

      // รวมเงิน OT (ใช้ข้อมูลที่แก้ไขแล้ว)
      const totalCashOt2 = currentEmployee2.sumCashOt || employeeRecords2.reduce((sum, record) => {
        return sum + parseFloat(record.cashOt || 0);
      }, 0);


      const totalCashOt1p5 = parseFloat(currentEmployee2.sumCashWorkMul["1.5"] || 0);
      // สวัสดิการหลักสำหรับพนักงานคนที่ 2
      const result2 = addSalaryList2
        .filter((item) => ["1230", "1350", "1241"].includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name);
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );

      const concatenatedNames2 = result2.names.length > 0 ? result2.names.join("/") : "";

      // เบี้ยขยันสำหรับพนักงานคนที่ 2
      const sumAmountHardWorking2 = addSalaryList2
        .filter((item) => item.id === "1410")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      // ค่าเดินทางสำหรับพนักงานคนที่ 2
      const sumAddSalaryTavel2 = addSalaryList2
        .filter((item) => item.id === "1535")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      const sumAddSalaryFood = addSalaryList2
        .filter((item) => item.id === "1330")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      const sumAddSpecialCash = addSalaryList2
        .filter((item) => item.id === "1560")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      // วันหยุดนักขัติฤกษ์สำหรับพนักงานคนที่ 2
      const specialDayOff2 = parseInt(currentEmployee2.specialDayOff || 0);
      const specialDayAmount2 = parseFloat(currentEmployee2.cashSpecialDay || 0);

      // วาดส่วนของพนักงานคนที่ 2
      pdf.setFontSize(15);
      pdf.text(`ใบจ่ายเงินเดือน`, 73, 142);
      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 148);
      pdf.setFontSize(12);

      // แสดงข้อมูลพนักงานคนที่ 2
      const currentWorkplaceId2 = employeeRecords2[0]?.workplaceId;
      pdf.text(`รหัส`, 7, head2);
      pdf.text(`ชื่อ-สกุล`, 30, head2);
      pdf.text(`หน่วยงาน`, 80, head2);
      pdf.text(`${currentWorkplaceId2 || ""}`, 93, head2);

      const workplace2 = workplaceList.find(
        (item) => item.workplaceId === currentWorkplaceId2
      );

      const workplaceName2 = workplace2 ? workplace2.workplaceName : "Unknown";
      pdf.text(`${workplaceName2}`, 103, head2);

      // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck2 เดิม
      console.log("📋 About to call getEmployeeBankNumber (Employee 2) with:", currentEmployee2.employeeId);
      console.log("👤 Current employee2 data:", currentEmployee2);
      const banknumber2 = await getEmployeeBankNumber(currentEmployee2.employeeId);
      console.log("💰 Final banknumber2 result:", banknumber2);
      pdf.text(`เลขที่บัญชี ${banknumber2}`, 168, head2);

      // วาดตารางสำหรับพนักงานคนที่ 2
      pdf.rect(7, head2 + 3, 155, 74);
      pdf.rect(7, head2 + 3, 155, 12);
      pdf.rect(7, head2 + 3, 155, 63);
      pdf.rect(7, head2 + 3, 44, 63);
      pdf.text(`รายได้`, 24, head2 + 9);
      pdf.text(`Earnings`, 22, head2 + 12);

      pdf.rect(7, head2 + 3, 62, 63);
      pdf.text(`จำนวน`, 56, head2 + 9);
      pdf.text(`Number`, 55, head2 + 12);

      pdf.rect(69, head2 + 3, 24, 74);
      pdf.text(`จำนวนเงิน`, 74, head2 + 9);
      pdf.text(`Amount`, 75, head2 + 12);

      pdf.rect(69, head2 + 3, 69, 74);
      pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9);

      pdf.text(`รวมเงินได้`, 28, head2 + 71);
      pdf.text(`Total Earning`, 23, head2 + 75);

      pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71);
      pdf.text(`Total Deduction`, 105, head2 + 75);

      pdf.text(`จำนวนเงิน`, 144, head2 + 9);
      pdf.text(`Amount`, 145, head2 + 12);

      pdf.rect(162 + 9, head2 + 3, 25, 25);
      pdf.rect(162 + 9, head2 + 3, 25, 15);
      pdf.text(`วันที่จ่าย`, 179, head2 + 9);
      pdf.text(`Payroll Date`, 176, head2 + 12);

      pdf.rect(162 + 9, head2 + 52, 25, 25);
      pdf.rect(162 + 9, head2 + 52, 25, 15);
      pdf.text(`เงินรับสุทธิ`, 178, head2 + 59);
      pdf.text(`Net To Pay`, 177, head2 + 62);

      pdf.rect(7, head2 + 79, 155, 13);
      pdf.rect(7, head2 + 79, 155, 6.5);

      let x2 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, head2 + 79, x2, 13);
        x2 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83);
      pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83);
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83);
      pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83);
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83);

      pdf.rect(112, head2 + 94, 50, 12);
      pdf.text(`ลงชื่อพนักงาน`, 130, head2 + 105);

      pdf.text(`${currentEmployee2.employeeId}`, 13, head2);
      pdf.text(`${currentEmployee2.prefix} ${currentEmployee2.employeeName}`, 40, head2);

      // สร้างรายการรายได้สำหรับพนักงานคนที่ 2
      const textArray2 = [];
      const countArray2 = [];
      const valueArray2 = [];
 
      if (totalCashWork2 > 0) {
        textArray2.push("เงินเดือน");
        countArray2.push(workDays2.toString());
        valueArray2.push(
          totalCashWork2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
      const pubDayCount2 = parseFloat(currentEmployee2.publicHolidayCount || 0);
      const pubDayCash2 = parseFloat(currentEmployee2.publicHolidayCash || 0);

      if (pubDayCount2 > 0) {
        textArray2.push("วันหยุดนักขัตฤกษ์");
        countArray2.push(pubDayCount2.toFixed(2));
        valueArray2.push(
          pubDayCash2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
      
      if (totalCashOt1p5 > 0) {
        const otHours1p5 = parseFloat(currentEmployee2.sumOt1p5 || 0);

        textArray2.push("ค่าล่วงเวลา 1.5 เท่า");
        countArray2.push(otHours1p5.toFixed(2));
        valueArray2.push(
          totalCashOt1p5.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (totalCashOt2 > 0) {
        const otHours2 = parseFloat(currentEmployee2.sumOtPublicHoliday || 0);

        textArray2.push("ค่าล่วงเวลา 2 เท่า");
        countArray2.push(otHours2.toFixed(2));
        valueArray2.push(
          totalCashOt2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (totalCashOt3 > 0) {
        const otHours3 = parseFloat(currentEmployee2.sumOt3 || 0);

        textArray2.push("ค่าล่วงเวลา 3 เท่า");
        countArray2.push(otHours3.toFixed(2));
        valueArray2.push(
          totalCashOt3.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (result2.sumSpSalary > 0) {
        textArray2.push(concatenatedNames2);
        countArray2.push("");
        valueArray2.push(
          result2.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (sumAddSalaryTavel2 > 0) {
        textArray2.push("ค่าเดินทาง");
        countArray2.push("");
        valueArray2.push(
          sumAddSalaryTavel2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (sumAmountHardWorking2 > 0) {
        textArray2.push("เบี้ยขยัน");
        countArray2.push("");
        valueArray2.push(
          sumAmountHardWorking2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

       if (sumAddSalaryFood > 0) {
          // Push the text to textArray and the value to valueArray
          textArray2.push("ค่าอาหาร");
          countArray2.push("");
          valueArray2.push(
            sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
       if (sumAddSpecialCash > 0) {
          // Push the text to textArray and the value to valueArray
          textArray2.push("ค่าเงินพิเศษ");
          countArray2.push("");
          valueArray2.push(
            sumAddSpecialCash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
        

      

      // รายการหักสำหรับพนักงานคนที่ 2 (ใช้ข้อมูลที่แก้ไขแล้ว)
      const textDedustArray2 = [];
      const valueDedustArray2 = [];

      // ภาษี (ใช้ข้อมูลที่แก้ไขแล้ว)
      const tax2 = parseFloat(currentEmployee2.tax || 0);
      if (tax2 > 0) {
        textDedustArray2.push("ภาษีเงินได้ บุคคลธรรมดา");
        valueDedustArray2.push(tax2);
      }

      // ประกันสังคม (ใช้ข้อมูลที่แก้ไขแล้ว)
      const socialSecurity2 = parseFloat(currentEmployee2.socialSecurity || 0);
      console.log("Social Security for Employee 2:", socialSecurity2);
      
      if (socialSecurity2 > 0) {
        textDedustArray2.push("เงินประกันสังคม");
        valueDedustArray2.push(socialSecurity2);
      }

      // คืนเงินเบิกล่วงหน้า (ใช้ข้อมูลที่แก้ไขแล้ว)
      const advance2 = parseFloat(currentEmployee2.advance || 
        (currentEmployee2.deductSalaryList && 
         currentEmployee2.deductSalaryList[0] && 
         currentEmployee2.deductSalaryList[0].amount) || 0);
      
      if (advance2 > 0) {
        textDedustArray2.push("คืนเงินเบิกล่วงหน้า");
        valueDedustArray2.push(advance2);
      }

      // แสดงรายการสำหรับพนักงานคนที่ 2
      let y2_1 = 174;
      textArray2.forEach((text) => {
        pdf.text(`${text}`, 8, y2_1);
        y2_1 += 4.1;
      });

      let y2_2 = 174;
      countArray2.forEach((text) => {
        pdf.text(`${text}`, 68, y2_2, { align: "right" });
        y2_2 += 4.1;
      });

      let y2_3 = 174;
      valueArray2.forEach((text) => {
        pdf.text(`${text}`, 92, y2_3, { align: "right" });
        y2_3 += 4.1;
      });

      let y2_4 = 174;
      textDedustArray2.forEach((text) => {
        pdf.text(`${text}`, 94, y2_4);
        y2_4 += 4.1;
      });

      let y2_5 = 174;
      valueDedustArray2.forEach((value) => {
        pdf.text(
          `${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          160, 
          y2_5, 
          { align: "right" }
        );
        y2_5 += 4.1;
      });

      // รวมรายได้ทั้งหมดสำหรับพนักงานคนที่ 2
      const incomeTotal2 = 
        parseFloat(currentEmployee2?.sumCashWork || '0') + 
        parseFloat(currentEmployee2?.sumCashOt || '0') +
        parseFloat(currentEmployee2?.publicHolidayCash || '0') + 
        parseFloat(
          currentEmployee2?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );

      pdf.text(
        `${incomeTotal2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        92,
        head2 + 71,
        { align: "right" }
      );

      // รวมเงินหักสำหรับพนักงานคนที่ 2
      const totalDeductions2 = tax2 + socialSecurity2;
      
      pdf.text(
        `${totalDeductions2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        160,
        head2 + 71,
        { align: "right" }
      );

      // เงินรับสุทธิสำหรับพนักงานคนที่ 2 (ใช้สูตรคำนวณใหม่)
      pdf.text(
        `${netSalary2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        190,
        head2 + 72,
        { align: "right" }
      );
    }

    // Reset position for the next row
    x = 20;
  }

  // Open the generated PDF in a new tab
  window.open(pdf.output("bloburl"), "_blank");
  
  } catch (error) {
    console.error("❌ Error generating PDF:", error); // ADD - error handling  
    alert("เกิดข้อผิดพลาดในการสร้าง PDF"); // ADD - user notification
  } finally {
    setIsGeneratingPDF(false); // ADD - จบ loading
  }
};








const generateExcel = async () => {
  // ตรวจสอบข้อมูล
  if (!responseDataAll || responseDataAll.length === 0) {
    alert("กรุณารอให้ข้อมูลโหลดเสร็จก่อน หรือเลือกเงื่อนไขการค้นหา");
    return;
  }
  
  try {
    console.log("🎯 START: generateExcel function called");
    console.log("📊 ResponseDataAll length:", responseDataAll?.length);
    
    // สร้าง workbook ใหม่
    const wb = XLSX.utils.book_new();
    
    // ฟังก์ชันคำนวณเงินรับสุทธิ
    const calculateNetSalary = (employee) => {
      const incomeTotal = 
        parseFloat(employee?.sumCashWork || '0') + 
        parseFloat(employee?.sumCashOt || '0') +
        parseFloat(employee?.publicHolidayCash || '0') + 
        parseFloat(
          employee?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );

      const deductionTotal =
        parseFloat(employee?.socialSecurity || '0') +
        parseFloat(employee?.tax || '0') +
        parseFloat(
          employee?.deductSalaryList?.[0]?.amount || '0'
        );

      const netTotal = incomeTotal - deductionTotal;
      return isNaN(netTotal) ? 0 : netTotal;
    };

    // ฟังก์ชันจัดรูปแบบตัวเลข
    const formatNumber = (num) => {
      return parseFloat(num || 0).toFixed(2);
    };

    // วนลูปสร้าง sheet สำหรับแต่ละพนักงาน
    for (let i = 0; i < responseDataAll.length; i++) {
      const currentEmployee = responseDataAll[i];
      console.log(`👤 Processing employee ${i}:`, currentEmployee?.employeeId, currentEmployee?.employeeName);
      
      const employeeRecords = currentEmployee.employee_record || [];
      const addSalaryList = currentEmployee.addSalaryList || [];
      
      // คำนวณข้อมูลต่างๆ (ใช้ข้อมูลที่แก้ไขแล้ว)
      const workDays = editableData && editableData.length > i && editableData[i]?.editableFields?.workDays ||
                       employeeRecords.filter(record => record.dayType === "work").length;
      const currentWorkplaceId = employeeRecords[0]?.workplaceId;
      const workplace = workplaceList.find(item => item.workplaceId === currentWorkplaceId);
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";
      
      // ดึงเลขบัญชี
      const banknumber = await getEmployeeBankNumber(currentEmployee.employeeId);
      
      // กรองรายการเงินพิเศษ
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];
      const addSalaryFiltered = addSalaryList
        .filter((salary) => !excludedIds.includes(salary.id));
      
      // จ่ายชดเชย
      const excludedIdsPayCompensation = [
        "1231", "1233", "1422", "1423", "1428", "1434", 
        "1435", "1429", "1427", "1234", "1426", "1425",
      ];
      
      const addSalaryPayCompensationFiltered = addSalaryList
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id));
      
      // คำนวณรายการต่างๆ
      const sumAmountHardWorking = addSalaryList
        .filter(item => item.id === "1410")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSalaryTavel = addSalaryList
        .filter(item => item.id === "1535")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSalaryFood = addSalaryList
        .filter(item => item.id === "1330")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSpecialCash = addSalaryList
        .filter(item => item.id === "1560")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      // สวัสดิการหลัก
      const specificIds = ["1230", "1350", "1535"];
      const result = addSalaryList
        .filter((item) => specificIds.includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : (item.id === "1535" ? "ค่าเดินทาง" : item.name));
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );
      
      const concatenatedNames = result.names.length > 0 ? result.names.join("/") : "";
      
      // เงินพิเศษ
      const extraCashIds = ["1560", "1563"];
      const resultExtraCash = addSalaryList
        .filter((item) => extraCashIds.includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1560" ? "เงินเพิ่มพิเศษ" : (item.id === "1563" ? "เงินพิเศษวันหยุด" : item.name));
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );
      
      const concatenatedNamesExtraCash = resultExtraCash.names.length > 0 ? resultExtraCash.names.join("/") : "";
      
      // จ่ายชดเชยวันลา
      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + parseFloat(salary.SpSalary || 0),
        0
      );
      
      // รายการหัก
      const tax = parseFloat(currentEmployee.tax || 0);
      const socialSecurity = parseFloat(currentEmployee.socialSecurity || 0);
      const advance = parseFloat(currentEmployee.deductSalaryList?.[0]?.amount || 0);
      
      // คำนวณยอดรวม
      const incomeTotal = 
        parseFloat(currentEmployee?.sumCashWork || '0') + 
        parseFloat(currentEmployee?.sumCashOt || '0') +
        parseFloat(currentEmployee?.publicHolidayCash || '0') + 
        parseFloat(
          currentEmployee?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );
      
      const totalDeductions = tax + socialSecurity + advance;
      const netSalary = incomeTotal - totalDeductions;
      
      // สร้างข้อมูลสำหรับ Excel ตามรูปแบบใบจ่ายเงินเดือน
      const data = [];
      
      // Header 
      data.push(['ใบจ่ายเงินเดือน']);
      data.push(['บริษัท โอวาท โปร แอนด์ ควิก จำกัด']);
      data.push([]);
      
      // บรรทัดแรก: รหัส + พนักงาน + วันที่จ่าย  
      data.push(['รหัส', currentEmployee.employeeId, 'พนักงาน', `${currentEmployee.employeeId} ชาลีบัญชี`, 'เลขที่บัญชี', banknumber]);
      data.push([]);
      
      // Header ตาราง - ใช้รูปแบบตามรูปที่ให้มา
      data.push(['รายได้', 'จำนวน', 'จำนวนเงิน', 'รายการหัก / รายการคืน', 'จำนวนเงิน', 'วันที่จ่าย']);
      data.push(['Earnings', 'Number', 'Amount', '', 'Amount', 'Payroll Date']);
      
      // รายการรายได้ - จัดเรียงตามรูปแบบในภาพ
      const incomeRows = [];
      
      // เงินเดือน
      if (currentEmployee.sumCashWorkMul?.["1"] > 0) {
        incomeRows.push(['เงินเดือน', workDays, formatNumber(currentEmployee.sumCashWorkMul["1"]), '', '', paymentDate || '30/05/2025']);
      }
      
      // วันหยุดนักขัตฤกษ์
      const pubDayCount = parseFloat(currentEmployee.publicHolidayCount || 0);
      if (pubDayCount > 0) {
        incomeRows.push(['วันหยุดนักขัตฤกษ์ฤกษ์', '1', formatNumber(currentEmployee.publicHolidayCash), 'ภาษีเงินได้', '0.00', '']);
      }
      
      // ค่าล่วงเวลา 1.5 เท่า
      const ot15Hours = parseFloat(currentEmployee.sumOt1p5 || 0);
      if (ot15Hours > 0 && currentEmployee.sumCashWorkMul?.["1.5"] > 0) {
        incomeRows.push(['ค่าล่วงเวลา 1.5 เท่า', ot15Hours.toFixed(2), formatNumber(currentEmployee.sumCashWorkMul["1.5"]), 'สมทบประกันสังคม', formatNumber(socialSecurity), '']);
      }
      
      // ค่าล่วงเวลา 2 เท่า
      const ot2Hours = parseFloat(currentEmployee.sumOtPublicHoliday || 0);
      if (ot2Hours > 0 && currentEmployee.sumCashWorkMul?.["2"] > 0) {
        incomeRows.push(['ค่าล่วงเวลา 2 เท่า', ot2Hours.toFixed(2), formatNumber(currentEmployee.sumCashWorkMul["2"]), '', '', '']);
      }
      
      // ค่าล่วงเวลา 3 เท่า
      const ot3Hours = parseFloat(currentEmployee.sumOt3 || 0);
      if (ot3Hours > 0 && currentEmployee.sumCashWorkMul?.["3"] > 0) {
        incomeRows.push(['ค่าล่วงเวลา 3 เท่า', ot3Hours.toFixed(2), formatNumber(currentEmployee.sumCashWorkMul["3"]), '', '', '']);
      }
      
      // คาคิงทาง
      if (result.sumSpSalary > 0) {
        incomeRows.push(['คาคิงทาง', '', formatNumber(result.sumSpSalary), '', '', '']);
      }
      
      // เบี้ยขยัน
      if (sumAmountHardWorking > 0) {
        incomeRows.push(['เบี้ยขยัน', '', formatNumber(sumAmountHardWorking), '', '', '']);
      }
      
      // ค่าอาหาร
      if (sumAddSalaryFood > 0) {
        incomeRows.push(['ค่าอาหาร', '', formatNumber(sumAddSalaryFood), '', '', '']);
      }
      // เพิ่มรายการรายได้เพิ่มเติม
      
      // ค่าเงินพิเศษ
      if (sumAddSpecialCash > 0) {
        incomeRows.push(['ค่าเงินพิเศษ', '', formatNumber(sumAddSpecialCash), '', '', '']);
      }
      
      // จ่ายชดเชยวันลา
      if (totalSpSalaryCompensation > 0) {
        incomeRows.push(['จ่ายชดเชยวันลา', '', formatNumber(totalSpSalaryCompensation), '', '', '']);
      }
      
      // ใส่รายการรายได้ลงในตาราง
      incomeRows.forEach(row => {
        data.push(row);
      });
      
      // แถวรวม
      data.push(['', '', '', '', '', '']);
      data.push(['รวมเงินได้', '', formatNumber(incomeTotal), 'รายการหัก / รายการคืน', formatNumber(totalDeductions), 'เงินรับสุทธิ']);
      data.push(['Total Earning', '', '', 'Total Deduction', '', 'Net To Pay']);
      data.push(['', '', '', '', '', formatNumber(netSalary)]);
      
      data.push([]);
      
      // ตารางข้อมูลสะสม (ตามรูปภาพ)
      data.push(['เงินได้สะสมต่อปี', 'ภาษีสะสมต่อปี', 'เงินสะสมกองทุนต่อปี', 'เงินประกันสะสมต่อปี', 'ค่าลดหย่อนอื่นๆ']);
      data.push(['', '', '', '', '']);
      data.push([]);
      data.push(['', '', '', '', 'ลงชื่อพนักงาน']);
      
      // สร้าง worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // ได้ range ของ worksheet ก่อน
      const range = XLSX.utils.decode_range(ws['!ref']);
      
      // กำหนด style สำหรับ borders และรูปแบบตาราง (ย้ายมาไว้ด้านบน)
      const borderStyle = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
      
      // ตั้งค่าความกว้างคอลัมน์สำหรับ A4 แนวตั้ง
      const colWidths = [
        { wch: 22 }, // รายได้
        { wch: 10 }, // จำนวน
        { wch: 13 }, // จำนวนเงิน
        { wch: 22 }, // รายการหัก
        { wch: 13 }, // จำนวนเงิน  
        { wch: 13 }  // วันที่จ่าย/เงินรับสุทธิ
      ];
      ws['!cols'] = colWidths;
      
      // ตั้งค่า Page Setup สำหรับ A4 แนวตั้ง
      ws['!pageSetup'] = {
        paperSize: 9, // A4
        orientation: 'portrait', // แนวตั้ง
        scale: 100,
        fitToWidth: 1,
        fitToHeight: 0, // ให้ปรับความสูงอัตโนมัติ
        verticalDpi: 300,
        horizontalDpi: 300
      };
      
      // ตั้งค่า margins สำหรับ A4
      ws['!margins'] = {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3
      };
      
      // ตั้งค่าการพิมพ์
      ws['!printOptions'] = {
        headings: false,
        gridLines: true,
        gridLinesSet: true,
        horizontalCentered: true,
        verticalCentered: false
      };
      
      // Style สำหรับ header หลัก
      const mainHeaderStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true, size: 14 } // ลดขนาดตัวอักษรสำหรับ A4
      };
      
      // Style สำหรับ header ตาราง
      const tableHeaderStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true, size: 11 }, // ปรับขนาดตัวอักษร
        border: borderStyle,
        fill: { fgColor: { rgb: "F0F0F0" } }
      };
      
      // Style สำหรับตัวเลข (ชิดขวา)
      const numberStyle = {
        alignment: { horizontal: 'right', vertical: 'center' },
        font: { size: 10 }, // ปรับขนาดตัวอักษร
        border: borderStyle
      };
      
      // Style สำหรับข้อความทั่วไป
      const textStyle = {
        alignment: { horizontal: 'left', vertical: 'center' },
        font: { size: 10 }, // ปรับขนาดตัวอักษร
        border: borderStyle
      };
      
      // Style สำหรับข้อความกลาง
      const centerTextStyle = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { size: 10 }, // ปรับขนาดตัวอักษร
        border: borderStyle
      };
      
      // Style สำหรับแถวรวม
      const totalRowStyle = {
        alignment: { horizontal: 'right', vertical: 'center' },
        font: { bold: true, size: 10 }, // ปรับขนาดตัวอักษร
        border: borderStyle,
        fill: { fgColor: { rgb: "E0E0E0" } }
      };
      
      // ตั้งค่าความสูงของแถวให้เหมาะสมกับ A4
      const rowHeights = [];
      for (let i = 0; i <= range.e.r; i++) {
        if (i === 0 || i === 1) {
          rowHeights[i] = { hpt: 20 }; // Header หลัก
        } else if (i === 5 || i === 6) {
          rowHeights[i] = { hpt: 18 }; // Header ตาราง
        } else {
          rowHeights[i] = { hpt: 16 }; // แถวปกติ
        }
      }
      ws['!rows'] = rowHeights;
      
      // ใส่ style ให้กับ cells
      
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          
          if (!ws[cellAddress]) {
            ws[cellAddress] = { v: '', t: 's' };
          }
          
          // กำหนด base style ที่มี border สำหรับทุก cell
          let cellStyle = {
            border: borderStyle,
            alignment: { vertical: 'center' }
          };
          
          // Header บริษัท (2 แถวแรก)
          if (row === 0 || row === 1) {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'center', vertical: 'center' },
              font: { bold: true, size: 14 }
            };
          }
          // ข้อมูลพนักงาน (แถวที่ 3)
          else if (row === 3) {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'left', vertical: 'center' },
              font: { bold: true, size: 10 }
            };
          }
          // Header ตาราง (แถวที่ 5 และ 6)
          else if (row === 5 || row === 6) {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'center', vertical: 'center' },
              font: { bold: true, size: 11 },
              fill: { fgColor: { rgb: "F0F0F0" } }
            };
          }
          // ข้อมูลในตาราง
          else if (row >= 7 && row < range.e.r - 7) {
            // คอลัมน์ตัวเลข (จำนวน และ จำนวนเงิน)
            if (col === 1) {
              cellStyle = {
                ...cellStyle,
                alignment: { horizontal: 'center', vertical: 'center' },
                font: { size: 10 }
              };
            } else if (col === 2 || col === 4 || col === 5) {
              cellStyle = {
                ...cellStyle,
                alignment: { horizontal: 'right', vertical: 'center' },
                font: { size: 10 }
              };
            } else {
              cellStyle = {
                ...cellStyle,
                alignment: { horizontal: 'left', vertical: 'center' },
                font: { size: 10 }
              };
            }
          }
          // แถวรวม
          else if (row === range.e.r - 6 || row === range.e.r - 5 || row === range.e.r - 4) {
            if (col === 2 || col === 4 || col === 5) {
              cellStyle = {
                ...cellStyle,
                alignment: { horizontal: 'right', vertical: 'center' },
                font: { bold: true, size: 10 },
                fill: { fgColor: { rgb: "E0E0E0" } }
              };
            } else {
              cellStyle = {
                ...cellStyle,
                alignment: { horizontal: 'left', vertical: 'center' },
                font: { bold: true, size: 10 },
                fill: { fgColor: { rgb: "E0E0E0" } }
              };
            }
          }
          // ตารางข้อมูลสะสม
          else if (row === range.e.r - 3 || row === range.e.r - 2) {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'left', vertical: 'center' },
              font: { bold: true, size: 10 }
            };
          }
          // แถวลงชื่อ
          else if (row === range.e.r) {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'left', vertical: 'center' },
              font: { size: 10 }
            };
          }
          // แถวอื่นๆ ให้ใส่ style พื้นฐาน
          else {
            cellStyle = {
              ...cellStyle,
              alignment: { horizontal: 'left', vertical: 'center' },
              font: { size: 10 }
            };
          }
          
          // ใส่ style ให้ cell
          ws[cellAddress].s = cellStyle;
        }
      }
      
      // Merge cells สำหรับ header
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // ใบจ่ายเงินเดือน
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // บริษัท โอวาท โปร แอนด์ ควิก จำกัด
        { s: { r: range.e.r - 6, c: 4 }, e: { r: range.e.r - 6, c: 5 } }, // รายการหัก/เงินรับสุทธิ
        { s: { r: range.e.r, c: 4 }, e: { r: range.e.r, c: 5 } } // ลงชื่อพนักงาน
      ];
      
      // เพิ่ม worksheet เข้า workbook
      XLSX.utils.book_append_sheet(wb, ws, `${currentEmployee.employeeId}-${currentEmployee.employeeName}`);
    }
    
    // สร้างไฟล์ Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // แปลงเป็น blob
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    
    // ดาวน์โหลดไฟล์
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log("✅ Excel file generated successfully");
    
  } catch (error) {
    console.error("❌ Error generating Excel:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง Excel");
  }
};


  const generatePDFAudit = async () => {
    const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
    const ages = [25, 30, 22, 35, 28];

    // Create a new instance of jsPDF
    const pdf = new jsPDF();

    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, "THSarabunNew", "normal");

    // Add bold font
    const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

    // Override the default stylestable for jspdf-autotable
    const stylestable = {
      font: "THSarabunNew",
      fontStyle: "normal",
      fontSize: 10,
    };
    const tableOptions = {
      styles: stylestable,
      startY: 25,
      // margin: { top: 10 },
    };

    // Set the initial position for text and frame
    let x = 20;

    pdf.setFont('THSarabunNew');
    // pdf.setFont("THSarabunNew Bold");

    // Loop through the names and ages arrays to add content to the PDF
    for (let i = 0; i < responseDataAll.length; i += 2) {
      // Add a page for each pair of names
      if (i > 0) {
        pdf.addPage();
      }

      // เรียงarray
      const countSpecialDayListWork =
        responseDataAll[i].specialDayListWork?.length || 0;
      // const countcal = responseDataAll[i].accountingRecord[0].countDay - countSpecialDayListWork;
      // const countcal = responseDataAll[i].accountingRecord[0].countDayWork
      const countcal = responseDataAll[i].accountingRecord?.[0]?.countDayWork || 0;

      // 2.0
      const formattedAmountHoliday2_0 = Number(
        countSpecialDayListWork * (responseDataAll[i].specialDayRate ?? 0)
      );

      // รถโทรตำแหน่ง
      const formattedAddTel = Number(
        responseDataAll[i].accountingRecord?.[0]?.tel || 0
      );
      const formattedAddAmountPosition = Number(
        responseDataAll[i].accountingRecord?.[0]?.amountPosition || 0
      );
      const formattedAddTravel = Number(
        responseDataAll[i].accountingRecord?.[0]?.travel || 0
      );

      // The IDs you want to exclude
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryFiltered = (responseDataAll[i].addSalary || [])
        .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      // จ่างชดเชย
      const excludedIdsPayCompensation = [
        "1231",
        "1233",
        "1422",
        "1423",
        "1428",
        "1434",
        "1435",
        "1429",
        "1427",
        "1234",
        "1426",
        "1425",
      ];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryPayCompensationFiltered = (responseDataAll[i].addSalary || [])
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      const formattedAddTelAmountPositionTravel =
        formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

      // เบี้ยขยัน
      const formattedAmountHardWorking = (responseDataAll[i].addSalary || []).filter(
        (item) => item.id === "1410"
      );

      // ค่าเดินทาง(ไม่คิดประกัน)
      const formattedAddSalaryTavel = (responseDataAll[i].addSalary || []).filter(
        (item) => item.id === "1535"
      );
      // Calculate the sum of SpSalary values in the filtered array
      const sumAmountHardWorking = formattedAmountHardWorking.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );


      // Calculate the sum of SpSalary values in the filtered array
      const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );

      // นักขัติ
      const countSpecialDayWork = responseDataAll[i].countSpecialDay || 0;
      const formattedAmountHoliday = Number(
        (responseDataAll[i].countSpecialDay || 0) *
        (responseDataAll[i].specialDayRate ?? 0)
      );

      //เงินพิเศษ
      const formattedSumAddSalaryAfterTax = Number(
        responseDataAll[i].accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      //หัก
      // คืนเงินเบิกล่วงหน้า
      // const advancePayment = parseFloat(
      //   responseDataAll[i].accountingRecord[0].advancePayment || 0
      // ).toFixed(2);

      pdf.setFontSize(15);

      pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);

      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);

      pdf.setFontSize(12);

      const head = 25;
      const head2 = 155;

      pdf.text(`รหัส`, 7, head);
      pdf.text(`ชื่อ-สกุล`, 40, head);
      pdf.text(`หน่วยงาน`, 80, head);
      pdf.text(`${responseDataAll[i].workplace}`, 93, head);

      const workplace = workplaceList.find(
        (item) => item.workplaceId === responseDataAll[i].workplace
      );

      // Use the found workplaceName or a default value
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";

      // Add it to the PDF
      pdf.text(`${workplaceName}`, 103, head);

      // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
      const banknumber = await getEmployeeBankNumber(responseDataAll[i].employeeId);

      pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head);

      const namesWithSpecificIds = responseDataAll[i].addSalary
        .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
        .map((item) => {
          // Check if the item.id is 1350 and modify item.name
          if (item.id === "1350") {
            return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
          }
          return item.name; // Otherwise, keep the original name
        });


      const specificIds = ["1230", "1350", "1241"]; // ID ที่ต้องการกรอง

      const result = responseDataAll[i].addSalary
        .filter((item) => specificIds.includes(item.id)) // กรองเฉพาะ ID ที่ต้องการ
        .reduce(
          (acc, item) => {
            // คำนวณผลรวม SpSalary
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name); // เปลี่ยนชื่อสำหรับ ID 1350
            acc.sumSpSalary += Number(item.SpSalary) || 0; // รวมค่า SpSalary (กรณีไม่มีค่าให้ใช้ 0)
            return acc;
          },
          { names: [], sumSpSalary: 0 } // ค่าเริ่มต้น
        );

      console.log("Sum of SpSalary:", result.sumSpSalary);
      // Concatenate names if there are any
      const concatenatedNames =
        namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
      // Show concatenated names in the PDF

      // Draw a square frame around the first name
      pdf.rect(7, 28, 155, 74); //ตารางหลัก
      pdf.rect(7, 28, 155, 12); //ตารางหลัก หัวตาราง

      pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
      pdf.rect(7, 28, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
      pdf.text(`รายได้`, 24, 34); //ตารางหลัก รายได้
      pdf.text(`Earnings`, 22, 37); //ตารางหลัก Earnings

      const textArray = [];
      const countArray = [];
      const valueArray = [];

      if (
        responseDataAll[i].accountingRecord?.[0]?.amountDay != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountDay != null
      ) {

        const accountingRecord = responseDataAll[i].specialDayRate;

        if (accountingRecord) {
          const amountDay = parseFloat(accountingRecord);

          if (amountDay != 0 && amountDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("อัตรา");
            countArray.push("");
            valueArray.push(
              amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("1");
      }
      if (
        responseDataAll[i].accountingRecord?.[0]?.amountDay != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountDay != null
      ) {
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const amountCountDayWork = parseFloat(
            accountingRecord.amountCountDayWork
          );

          if (amountCountDayWork != 0 && amountCountDayWork != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("เงินเดือน");
            countArray.push(countcal);
            valueArray.push(
              amountCountDayWork
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("2");
      }
      if (0 != 0 && null != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าล่วงเวลา 1 เท่า");
        countArray.push("");
        valueArray.push(
          responseDataAll[i].accountingRecord.amountDay
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("3");
      }
      // if (responseDataAll[i].accountingRecord[0].amountOt != 0 && responseDataAll[i].accountingRecord[0].amountOt != null) {
      if (
        responseDataAll[i].accountingRecord?.[0]?.amountOneFive != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountOneFive != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourOneFive);
          const amountOt = parseFloat(accountingRecord.amountOneFive);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 1.5 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("4");
      }
      if (
        responseDataAll[i].accountingRecord?.[0]?.amountTwo != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountTwo != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {

          const countOtHour = parseFloat(accountingRecord.hourTwo);
          const amountOt = parseFloat(accountingRecord.amountTwo);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 2 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("5");
      }
      // if (0 != 0 && null != null) {
      if (
        responseDataAll[i].accountingRecord?.[0]?.amountThree != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountThree != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourThree);
          const amountOt = parseFloat(accountingRecord.amountThree);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 3 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("6");
      }
      //รถโทรตำแหน่ง
      // if (
      //   formattedAddTelAmountPositionTravel != 0 &&
      //   formattedAddTelAmountPositionTravel != null
      // ) {
      //   // Push the text to textArray and the value to valueArray
      //   textArray.push(concatenatedNames);
      //   countArray.push("");
      //   valueArray.push(
      //     formattedAddTelAmountPositionTravel
      //       .toFixed(2)
      //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      //   );
      if (
        result.sumSpSalary != 0 &&
        result.sumSpSalary != null
      ) {
        // Push the text to textArray and the value to valueArray
        textArray.push(concatenatedNames);
        countArray.push("");
        valueArray.push(
          result.sumSpSalary
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7");
      }

      //ค่าเดินทาง(ไม่คิดประกัน)
      if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าเดินทาง");
        countArray.push("");
        valueArray.push(
          sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7.1");
      }

      if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
        textArray.push("เบี้ยขยัน");
        countArray.push("");
        valueArray.push(
          sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("8");
      }

      if (
        responseDataAll[i].accountingRecord[0].amountSpecialDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountSpecialDay != null
      ) {
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];


        if (accountingRecord) {


          const amountSpecialDay = parseFloat(
            accountingRecord.amountSpecialDay
          );

          const specialDayListWorks = responseDataAll[i].specialDayListWork
            ? responseDataAll[i].specialDayListWork.length
            : 0;
          const countSpecialDay = parseFloat(
            responseDataAll[i].countSpecialDay
          );
          const countspecialDayF = countSpecialDay - specialDayListWorks;

          if (amountSpecialDay !== 0 && amountSpecialDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("วันหยุดนักขัติฤกษ์");
            countArray.push(
              countspecialDayF.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountSpecialDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }

        console.log("9");
      }

      const totalSpSalary = addSalaryFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalary = totalSpSalary
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensationNumber = parseFloat(
        formattedTotalSpSalaryCompensation.replace(/,/g, "")
      );

      if (totalSpSalary !== 0) {
        textArray.push("รวมเงินพิเศษ");
        countArray.push(""); // You can add the count if needed or leave it as an empty string
        valueArray.push(formattedTotalSpSalary);
      }

      // if (formattedTotalSpSalaryCompensation !== 0) {
      if (
        totalSpSalaryCompensationNumber !== 0 &&
        totalSpSalaryCompensationNumber != null
      ) {
        textArray.push("จ่ายชดเชยวันลา");
        countArray.push("");
        valueArray.push(formattedTotalSpSalaryCompensation);
        console.log("11");
      }

      const textDedustArray = [];
      const valueDedustArray = [];

      // if (advancePayment != 0 && advancePayment != null) {
      //   textDedustArray.push("คืนเงินเบิกล่วงหน้า");
      //   valueDedustArray.push(advancePayment);
      //   console.log("de1");
      // }
      if (
        responseDataAll[i].accountingRecord[0].tax != 0 &&
        responseDataAll[i].accountingRecord[0].tax != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const tax = parseFloat(accountingRecord.tax);

          if (tax !== 0 && !isNaN(tax)) {
            textDedustArray.push("ภาษีเงินได้");
            valueDedustArray.push(
              tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de2");
      }
      if (
        responseDataAll[i].accountingRecord[0].socialSecurity != 0 &&
        responseDataAll[i].accountingRecord[0].socialSecurity != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const socialSecurity = parseFloat(accountingRecord.socialSecurity);

          if (socialSecurity !== 0 && !isNaN(socialSecurity)) {
            textDedustArray.push("หักสมทบประกันสังคม");
            valueDedustArray.push(
              socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de3");
      }

      pdf.rect(7, 28, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
      pdf.text(`จำนวน`, 56, 34); //ตารางหลัก จำนวน
      pdf.text(`Number`, 55, 37); //ตารางหลัก Number

      pdf.rect(69, 28, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
      pdf.text(`จำนวนเงิน`, 74, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 75, 37); //ตารางหลัก Amount

      pdf.rect(69, 28, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 102, 34); //รายการหัก / รายการคืน
      // pdf.text(`Amount`, 75, 38);//ตารางหลัก

      ///////// รวมเงินได้
      pdf.text(`รวมเงินได้`, 28, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Earninng`, 23, 100); //ตารางหลัก Earnings

      /////  รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 100, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Deduction`, 105, 100); //ตารางหลัก Earnings

      pdf.text(`จำนวนเงิน`, 144, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 145, 37); //ตารางหลัก Amount

      pdf.rect(162 + 9, 28, 25, 25); //ตารางวันที่จ่าย
      pdf.rect(162 + 9, 28, 25, 15); //ตารางวันที่จ่าย
      pdf.text(`วันที่จ่าย`, 180, 35); //ตารางหลัก วันที่จ่าย
      pdf.text(`Payroll Date`, 177, 38); //ตารางหลัก Payroll Date

      pdf.rect(162 + 9, 77, 25, 25); //ตารางเงินรับสุทธิ
      pdf.rect(162 + 9, 77, 25, 15); //ตารางเงินรับสุทธิ
      pdf.text(`เงินรับสุทธิ`, 178, 84); //ตารางหลัก วันที่จ่าย
      pdf.text(`Net To Pay`, 177, 87); //ตารางหลัก Payroll Date

      pdf.rect(7, 104, 155, 13); //ตาราง 2
      pdf.rect(7, 104, 155, 6.5); //ตาราง 2 เส็นกลาง

      let x1 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, 104, x1, 13); //ตาราง 2
        x1 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, 108); //ตารางหลัก Earnings
      pdf.text(`ภาษีสะสมต่อปี`, 40, 108); //ตารางหลัก Earnings
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108); //ตารางหลัก Earnings
      pdf.text(`เงินประกันสะสมต่อปี`, 102, 108); //ตารางหลัก Earnings
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108); //ตารางหลัก Earnings


      pdf.rect(112, 119, 50, 12); //ตาราง 3
      pdf.text(`ลงชื่อพนักงาน`, 125, 130); //ตารางหลัก Earnings

      pdf.text(`${responseDataAll[i].employeeId}`, 13, head);
      pdf.text(
        `${responseDataAll[i].name} ${responseDataAll[i].lastName}`,
        50,
        head
      );

      let y = 44; // Initial y position

      textArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 8, y);

        // Increment y position for the next line
        y += 4.1;
      });

      let y2 = 44; // Initial y position

      countArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 68, y2, { align: "right" });

        // Increment y position for the next line
        y2 += 4.1;
      });

      let y3 = 44; // Initial y position

      valueArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 92, y3, { align: "right" });

        // Increment y position for the next line
        y3 += 4.1;
      });

      let y4 = 44; // Initial y position

      textDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 94, y4);

        // Increment y position for the next line
        y4 += 4.1;
      });
      let y5 = 44; // Initial y position

      valueDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 160, y5, { align: "right" });

        // Increment y position for the next line
        y5 += 4.1;
      });

      //รวมเงินได้
      const sumAddSalaryAfterTax = parseFloat(
        responseDataAll[i].accountingRecord.sumAddSalaryAfterTax ?? 0
      );
      const formattedSumAddSalaryAfterTax1 =
        sumAddSalaryAfterTax.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      // setWsTotalSum((Number(wsAmountDay || 0 ) + Number(wsAmountOt || 0) + Number(wsTax || 0 ) + Number(wsAmountSpecialDay || 0) + Number(sumAddSalaryList || 0)).toFixed(2) || 0);

      const amountDay =
        parseFloat(responseDataAll[i].accountingRecord[0].amountDay) || 0;
      const amountOt =
        parseFloat(responseDataAll[i].accountingRecord[0].amountOt) || 0;
      const sumAddSalary =
        parseFloat(responseDataAll[i].accountingRecord[0].sumAddSalary) || 0;
      const amountSpecialDay =
        parseFloat(responseDataAll[i].addSalary.amountSpecialDay) || 0;
      const specialDayRate = parseFloat(responseDataAll[i].specialDayRate) || 0;

      // const sumAddSalaryList = parseFloat(responseDataAll[i].addSalary.sumAddSalaryList) || 0;sumAddSalary

      // const sumSalary = amountDay + amountOt + sumAddSalary + specialDayRate;
      const total =
        parseFloat(responseDataAll[i].accountingRecord[0].total) || 0;

      const sumSalary = total;
      pdf.text(
        `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        92,
        96,
        { align: "right" }
      );

      //รวมเงินหัก

      const tax = parseFloat(responseDataAll[i].accountingRecord[0].tax) || 0;
      const socialSecurity =
        parseFloat(responseDataAll[i].accountingRecord[0].socialSecurity) || 0;
      // const advancePayment2 = parseFloat(advancePayment) || 0;

      // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

      // const sumDeductSalary = advancePayment2 + tax + socialSecurity;
      const sumDeductSalary = tax + socialSecurity;

      pdf.text(
        `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        160,
        96,
        { align: "right" }
      );

      pdf.text(
        `${(sumSalary - sumDeductSalary)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        188,
        98,
        { align: "right" }
      );

      // pdf.text(`Age: ${ages[i]}`, x + 10, 60);

      // Move to the next column
      // x += 80;

      // Draw a square frame around the second name if available
      if (i + 1 < responseDataAll.length) {
        pdf.setFontSize(15);

        // เรียงarray
        const countSpecialDayListWork =
          responseDataAll[i + 1].specialDayListWork.length;
        const countcal =
          responseDataAll[i + 1].accountingRecord[0].countDay -
          countSpecialDayListWork;

        // 2.0
        const formattedAmountHoliday2_0 = Number(
          countSpecialDayListWork * responseDataAll[i + 1].specialDayRate ?? 0
        );

        // รถโทรตำแหน่ง
        const formattedAddTel = Number(
          responseDataAll[i + 1].accountingRecord.tel || 0
        );
        const formattedAddAmountPosition = Number(
          responseDataAll[i + 1].accountingRecord.amountPosition || 0
        );
        const formattedAddTravel = Number(
          responseDataAll[i + 1].accountingRecord.travel || 0
        );

        const formattedAddTelAmountPositionTravel =
          formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

        // เบี้ยขยัน
        const formattedAmountHardWorking = responseDataAll[
          i + 1
        ].addSalary.filter((item) => item.id === "1410");

        // ค่าเดินทาง(ไม่คิดประกัน)
        const formattedAddSalaryTavel = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1535"
        );
        const formattedAddSalaryFood = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1330"
        );
        const formattedAddSpeacialCash = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1560"
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAmountHardWorking = formattedAmountHardWorking.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );
        const sumAddSalaryFood = formattedAddSalaryFood.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );
        const sumAddSpecialCash = formattedAddSpecialCash.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // นักขัติ
        const countSpecialDayWork = responseDataAll[i + 1].countSpecialDay;
        const formattedAmountHoliday = Number(
          responseDataAll[i + 1].countSpecialDay *
          responseDataAll[i + 1].specialDayRate ?? 0
        );


        // //เงินพิเศษ
        const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryFiltered = responseDataAll[i + 1].addSalary
          .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));

        const totalSpSalary = addSalaryFiltered.reduce(
          (sum, salary) => sum + salary.SpSalary,
          0
        );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalary = totalSpSalary
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // จ่างชดเชย
        const excludedIdsPayCompensation = [
          "1231",
          "1233",
          "1422",
          "1423",
          "1428",
          "1434",
          "1435",
          "1429",
          "1427",
          "1234",
          "1426",
          "1425",
        ];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryPayCompensationFiltered = responseDataAll[
          i + 1
        ].addSalary
          .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));


        const totalSpSalaryCompensation =
          addSalaryPayCompensationFiltered.reduce(
            (sum, salary) => sum + salary.SpSalary,
            0
          );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const totalSpSalaryCompensationNumber = parseFloat(
          formattedTotalSpSalaryCompensation.replace(/,/g, "")
        );

        const namesWithSpecificIds = responseDataAll[i + 1].addSalary
          .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
          .map((item) => {
            // Check if the item.id is 1350 and modify item.name
            if (item.id === "1350") {
              return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
            }
            return item.name; // Otherwise, keep the original name
          });

        // Concatenate names if there are any
        const concatenatedNames =
          namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
        // Show concatenated names in the PDF

        const specificIds = ["1230", "1350", "1241"]; // ID ที่ต้องการกรอง

        const result = responseDataAll[i + 1].addSalary
          .filter((item) => specificIds.includes(item.id)) // กรองเฉพาะ ID ที่ต้องการ
          .reduce(
            (acc, item) => {
              // คำนวณผลรวม SpSalary
              acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name); // เปลี่ยนชื่อสำหรับ ID 1350
              acc.sumSpSalary += Number(item.SpSalary) || 0; // รวมค่า SpSalary (กรณีไม่มีค่าให้ใช้ 0)
              return acc;
            },
            { names: [], sumSpSalary: 0 } // ค่าเริ่มต้น
          );

        console.log("Sum of SpSalary:321", result.sumSpSalary);

        //หัก
        // คืนเงินเบิกล่วงหน้า
        // const advancePayment = parseFloat(
        //   responseDataAll[i + 1].accountingRecord[0].advancePayment || 0
        // ).toFixed(2);

        const textArray = [];
        const countArray = [];
        const valueArray = [];


        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {

          const accountingRecord = responseDataAll[i + 1].specialDayRate;

          if (accountingRecord) {
            const amountDay = parseFloat(accountingRecord);

            if (amountDay != 0 && amountDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("อัตรา");
              countArray.push("");
              valueArray.push(
                amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("11");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.amountCountDayWork
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("เงินเดือน");
              countArray.push(countcal);
              valueArray.push(
                amountCountDayWork
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("22");
        }
        if (0 != 0 && null != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าล่วงเวลา 1 เท่า");
          countArray.push("");
          valueArray.push(
            responseDataAll[i + 1].accountingRecord.amountDay
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("33");
        }
        // if (responseDataAll[i + 1].accountingRecord[0].amountOt != 0 && responseDataAll[i + 1].accountingRecord[0].amountOt != null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const countOtHour = parseFloat(accountingRecord.hourOneFive);
            const amountOt = parseFloat(accountingRecord.amountOneFive);

            console.log("amountOt", amountOt);

            if (countOtHour != 0 && countOtHour != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 1.5 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("44");
        }

        if (
          responseDataAll[i + 1].accountingRecord[0].amountTwo != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountTwo != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            // const amountOt = parseFloat(accountingRecord.amountOt);
            // const countOtHour = parseFloat(accountingRecord.countOtHour);
            const countOtHour = parseFloat(accountingRecord.hourTwo);
            const amountOt = parseFloat(accountingRecord.amountTwo);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 2 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("55");
        }
        // if (0 != 0 && null != null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountThree != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountThree != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            // const amountOt = parseFloat(accountingRecord.amountOt);
            // const countOtHour = parseFloat(accountingRecord.countOtHour);
            const countOtHour = parseFloat(accountingRecord.hourThree);
            const amountOt = parseFloat(accountingRecord.amountThree);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 3 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("66");
        }
        //รถโทรตำแหน่ง
        // if (
        //   formattedAddTelAmountPositionTravel != 0 &&
        //   formattedAddTelAmountPositionTravel != null
        // ) {
        //   // Push the text to textArray and the value to valueArray
        //   textArray.push(concatenatedNames);
        //   countArray.push("");
        //   valueArray.push(
        //     formattedAddTelAmountPositionTravel
        //       .toFixed(2)
        //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //   );
        if (
          result.sumSpSalary != 0 &&
          result.sumSpSalary != null
        ) {
          // Push the text to textArray and the value to valueArray
          textArray.push(concatenatedNames);
          countArray.push("");
          valueArray.push(
            result.sumSpSalary
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77");
        }
        //ค่าเดินทาง(ไม่คิดประกัน)
        if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าเดินทาง");
          countArray.push("");
          valueArray.push(
            sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }

        if (sumAddSalaryFood != 0 && sumAddSalaryFood != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าอาหาร");
          countArray.push("");
          valueArray.push(
            sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }


        if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
          textArray.push("เบี้ยขยัน");
          countArray.push("");
          valueArray.push(
            sumAmountHardWorking
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("88");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];



          if (accountingRecord) {


            const amountSpecialDay = parseFloat(
              accountingRecord.amountSpecialDay
            );

            const specialDayListWorks = responseDataAll[i + 1]
              .specialDayListWork
              ? responseDataAll[i + 1].specialDayListWork.length
              : 0;
            const countSpecialDay = parseFloat(
              responseDataAll[i + 1].countSpecialDay
            );
            const countspecialDayF = countSpecialDay - specialDayListWorks;

            if (amountSpecialDay !== 0 && amountSpecialDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("วันหยุดนักขัติฤกษ์");
              countArray.push(
                countspecialDayF
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountSpecialDay
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }

          console.log("99");
        }


        if (formattedTotalSpSalary != 0 && formattedTotalSpSalary != null) {
          textArray.push("เงินเพิ่มพิเศษ");
          countArray.push("");
          valueArray.push(
            formattedTotalSpSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("1010");
        }


        if (
          totalSpSalaryCompensationNumber !== 0 &&
          totalSpSalaryCompensationNumber != null
        ) {
          textArray.push("จ่ายชดเชยวันลา");
          countArray.push("");
          valueArray.push(formattedTotalSpSalaryCompensation);
          console.log("1111");
        }

        const textDedustArray = [];
        const valueDedustArray = [];

        // if (advancePayment != 0 && advancePayment != null) {
        //   textDedustArray.push("คืนเงินเบิกล่วงหน้า");
        //   valueDedustArray.push(advancePayment);
        // }
        if (
          responseDataAll[i + 1].accountingRecord[0].tax != 0 &&
          responseDataAll[i + 1].accountingRecord[0].tax != null
        ) {
          textDedustArray.push("ภาษีเงินได้");
          valueDedustArray.push(
            responseDataAll[i + 1].accountingRecord.tax
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }

        if (
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != 0 &&
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.socialSecurity
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textDedustArray.push("หักสมทบประกันสังคม");
              valueDedustArray.push(amountCountDayWork);
            }
          }
          console.log("22");
        }



        pdf.text(`ใบจ่ายเงินเดือน`, 73, 142);
        pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 148);
        pdf.setFontSize(12);

        pdf.text(`รหัส`, 7, head2);
        pdf.text(`ชื่อ-สกุล`, 40, head2);
        pdf.text(`หน่วยงาน`, 80, head2);
        pdf.text(`${responseDataAll[i + 1].workplace}`, 93, head2);

        const workplace = workplaceList.find(
          (item) => item.workplaceId === responseDataAll[i + 1].workplace
        );

        // Use the found workplaceName or a default value
        const workplaceName = workplace ? workplace.workplaceName : "Unknown";

        // Add it to the PDF
        pdf.text(`${workplaceName}`, 103, head2);

        // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
        const banknumber = await getEmployeeBankNumber(responseDataAll[i + 1].employeeId);

        pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head2);

        // pdf.rect(7, 156, 60, 30);

        pdf.rect(7, head2 + 3, 155, 74); //ตารางหลัก
        pdf.rect(7, head2 + 3, 155, 12); //ตารางหลัก หัวตาราง
        pdf.rect(7, head2 + 3, 155, 63); //ตารางหลัก ล่าง
        pdf.rect(7, head2 + 3, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
        pdf.text(`รายได้`, 24, head2 + 9); //ตารางหลัก รายได้
        pdf.text(`Earnings`, 22, head2 + 12); //ตารางหลัก Earnings

        /////////////////

        //////////////////////// หัวข้อ


        pdf.rect(7, head2 + 3, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
        pdf.text(`จำนวน`, 56, head2 + 9); //ตารางหลัก จำนวน
        pdf.text(`Number`, 55, head2 + 12); //ตารางหลัก Number

        pdf.rect(69, head2 + 3, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
        pdf.text(`จำนวนเงิน`, 74, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 75, head2 + 12); //ตารางหลัก Amount

        pdf.rect(69, head2 + 3, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9); //รายการหัก / รายการคืน
        // pdf.text(`Amount`, 75, 38);//ตารางหลัก

        // /////////


        ///////// รวมเงินได้
        pdf.text(`รวมเงินได้`, 28, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Earninng`, 23, head2 + 75); //ตารางหลัก Earnings

        /////  รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Deduction`, 105, head2 + 75); //ตารางหลัก Earnings

        pdf.text(`จำนวนเงิน`, 144, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 145, head2 + 12); //ตารางหลัก Amount
        // pdf.rect(162 + 9, 28, 25, 25);//ตารางวันที่จ่าย

        // pdf.rect(162 + 9, 77, 25, 25);//ตารางเงินรับสุทธิ

        pdf.rect(162 + 9, head2 + 3, 25, 25); //ตารางวันที่จ่าย
        pdf.rect(162 + 9, head2 + 3, 25, 15); //ตารางวันที่จ่าย
        pdf.text(`วันที่จ่าย`, 180, head2 + 9); //ตารางหลัก วันที่จ่าย
        pdf.text(`Payroll Date`, 177, head2 + 12); //ตารางหลัก Payroll Date

        pdf.rect(162 + 9, head2 + 52, 25, 25); //ตารางเงินรับสุทธิ
        pdf.rect(162 + 9, head2 + 52, 25, 15); //ตารางเงินรับสุทธิ
        pdf.text(`เงินรับสุทธิ`, 178, head2 + 59); //ตารางหลัก เงินรับสุทธิ
        pdf.text(`Net To Pay`, 177, head2 + 62); //ตารางหลัก Net To Pay

        pdf.rect(7, head2 + 79, 155, 13); //ตาราง 2
        pdf.rect(7, head2 + 79, 155, 6.5); //ตาราง 2 เส็นกลาง

        let x1 = 31;
        for (let j = 0; j < 5; j++) {
          pdf.rect(7, head2 + 79, x1, 13); //ตาราง 2
          x1 += 31;
        }
        // 108
        // 83
        pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83); //ตารางหลัก Earnings


        pdf.rect(112, head2 + 94, 50, 12); //ตาราง 3
        pdf.text(`ลงชื่อพนักงาน`, 125, head2 + 105); //ตารางหลัก Earnings


        pdf.text(`${responseDataAll[i + 1].employeeId}`, 13, head2);
        pdf.text(
          `${responseDataAll[i + 1].name} ${responseDataAll[i + 1].lastName}`,
          50,
          head2
        );


        let y = 174; // Initial y position

        textArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 8, y);

          // Increment y position for the next line
          y += 4.1;
        });

        let y2 = 174; // Initial y position

        countArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 68, y2, { align: "right" });

          // Increment y position for the next line
          y2 += 4.1;
        });

        let y3 = 174; // Initial y position

        valueArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 92, y3, { align: "right" });

          // Increment y position for the next line
          y3 += 4.1;
        });

        let y4 = 174; // Initial y position

        textDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 94, y4);

          // Increment y position for the next line
          y4 += 4.1;
        });
        let y5 = 174; // Initial y position

        valueDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          // pdf.text(`${text}`, 160, y5, { align: "right" });
          pdf.text(`${text}`, 160, y5, { align: "right" });

          // Increment y position for the next line
          y5 += 4.1;
        });

        const amountDay =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountDay) || 0;
        const amountOt =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountOt) || 0;
        // const sumAddSalary = parseFloat(responseDataAll[i + 1].addSalary[0].sumAddSalary) || 0;

        const addSalary = responseDataAll[i + 1]?.addSalary;
        const sumAddSalary =
          addSalary && addSalary[0]
            ? parseFloat(addSalary[0].sumAddSalary) || 0
            : 0;

        // const sumSalary = amountDay + amountOt + sumAddSalary;

        // pdf.text(`${sumSalary.toFixed(2)}`, 92, head2 + 71, { align: 'right' });
        const total =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].total) || 0;

        const sumSalary = total;

        pdf.text(
          `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          92,
          head2 + 71,
          { align: "right" }
        );

        //รวมเงินหัก
        const tax =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].tax) || 0;
        const socialSecurity =
          parseFloat(
            responseDataAll[i + 1].accountingRecord[0].socialSecurity
          ) || 0;
        // const advancePayment2 = parseFloat(advancePayment) || 0;

        // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

        // const sumDeductSalary = advancePayment2 + tax + socialSecurity;
        const sumDeductSalary = tax + socialSecurity;


        pdf.text(
          `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          160,
          head2 + 71,
          { align: "right" }
        );

        // pdf.text(`${(sumSalary - sumDeductSalary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, 188, head2 + 72, { align: 'right' });
        pdf.text(
          `${(sumSalary - sumDeductSalary)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          188,
          head2 + 72,
          { align: "right" }
        );
      }

      // Reset position for the next row
      x = 20;
    }

    // Open the generated PDF in a new tab
    window.open(pdf.output("bloburl"), "_blank");
  };
  
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
              <a href="#"> ระบบเงินเดือน</a>
            </li>
            <li class="breadcrumb-item active">ออกสลิปเงินเดือน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ออกสลิปเงินเดือน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">สลิปเงินเดือน</h2>
              <section class="Frame">
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-3">
                      <select
                        className="form-control"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        {/* <option value="">Select Option</option> */}
                        <option value="option1">แบบหน่วยงาน</option>
                        <option value="option2">แบบพนักงาน</option>
                      </select>
                    </div>
                  </div>
                  <br />
                  {/* Conditionally render content based on the selected option */}
                  {selectedOption === "option1" && (
                    <div>
                      <h2>แบบหน่วยงาน</h2>
                      <div class="row">
                        <div class="col-md-3">
                          <label role="searchEmployeeId">รหัสหน่วยงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสหน่อยงาน"
                            value={workplacrId}
                            onChange={handleStaffIdChange}
                            onInput={(e) => {
                              // Remove any non-digit characters
                              e.target.value = e.target.value.replace(/\D/g, "");
                            }}
                            list="WorkplaceIdList"
                          />
                          <datalist id="WorkplaceIdList">
                            {workplaceListAll.map((workplace) => (
                              <option
                                key={workplace.workplaceId}
                                value={workplace.workplaceId}
                              />
                            ))}
                          </datalist>
                        </div>
                        <div class="col-md-3">
                          <label role="searchname">ชื่อหน่วยงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffName"
                            placeholder="ชื่อหน่วยงาน"
                            value={workplacrName}
                            onChange={handleStaffNameChange}
                            list="WorkplaceNameList"
                          />

                          <datalist id="WorkplaceNameList">
                            {workplaceListAll.map((workplace) => (
                              <option
                                key={workplace.workplaceId}
                                value={workplace.workplaceName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOption === "option2" && (
                    <div>
                      <h2>แบบพนักงาน</h2>
                      <div class="row">
                        <div class="col-md-3">
                          <label role="searchEmployeeId">รหัสพนักงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสพนักงาน"
                            value={staffId}
                            onChange={handleStaffIdChange2}
                            onInput={(e) => {
                              // Remove any non-digit characters
                              e.target.value = e.target.value.replace(/\D/g, "");
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
                        <div class="col-md-3">
                          <label role="searchname">ชื่อพนักงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffName"
                            placeholder="ชื่อพนักงาน"
                            value={staffFullName}
                            onChange={handleStaffNameChange2}
                            list="staffNameList"
                          />
                          <datalist id="staffNameList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.name + " " + employee.lastName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div class="row">
                                        <div class="col-md-3">
                                            <label role="searchEmployeeId">รหัสหน่อยงาน</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="staffId"
                                                placeholder="รหัสหน่อยงาน"
                                                value={workplacrId}
                                                onChange={handleStaffIdChange}
                                                list="WorkplaceIdList"
                                            />
                                            <datalist id="WorkplaceIdList">
                                                {workplaceListAll.map(workplace => (
                                                    <option key={workplace.workplaceId} value={workplace.workplaceId} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div class="col-md-3">
                                            <label role="searchname">ชื่อหน่วยงาน</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="staffName"
                                                placeholder="ชื่อพนักงาน"
                                                value={workplacrName}
                                                onChange={handleStaffNameChange}
                                                list="WorkplaceNameList"
                                            />

                                            <datalist id="WorkplaceNameList">
                                                {workplaceListAll.map(workplace => (
                                                    <option key={workplace.workplaceId} value={workplace.workplaceName} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div> */}
                  {/* <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="staffId"
                                                    placeholder="รหัสพนักงาน"
                                                    value={staffId}
                                                    onChange={handleStaffIdChange2}
                                                    list="staffIdList"
                                                />
                                                <datalist id="staffIdList">
                                                    {employeeList.map(employee => (
                                                        <option key={employee.employeeId} value={employee.employeeId} />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label role="searchname">ชื่อพนักงาน</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="staffName"
                                                    placeholder="ชื่อพนักงาน"
                                                    value={staffFullName}
                                                    onChange={handleStaffNameChange2}
                                                    list="staffNameList"
                                                />
                                                <datalist id="staffNameList">
                                                    {employeeList.map(employee => (
                                                        <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </div>
                                    </div> */}
                  <br />
                  <div class="row">
                    <div class="col-md-3">
                      <label role="agencyname">เดือน</label>
                      <select
                        className="form-control"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
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

                    <div class="col-md-3">
                      <label>ปี</label>

                      <select
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y + 543}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                      <div class="col-md-3">
                    <button 
                      onClick={openEditModal}
                      class="btn btn-info me-2"
                      disabled={!responseDataAll || responseDataAll.length === 0}
                    >
                      <i className="fas fa-edit me-1"></i>
                      แก้ไขก่อนพิมพ์
                    </button>
                    </div>
                    <div class="col-md-3">
                    <button 
                      onClick={() => {
                        console.log("🖱️ Generate PDF button clicked!");
                        console.log("📊 Current responseDataAll:", responseDataAll);
                        generatePDF();
                      }} 
                      class="btn b_save"
                      disabled={isGeneratingPDF || !responseDataAll || responseDataAll.length === 0}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          กำลังสร้างสลิป...
                        </>
                      ) : (
                        selectedOption === "option1"
                          ? "ออกสลิป"
                          : selectedOption === "option2"
                            ? "ออกสลิป"
                            : ""
                      )}
                    </button>
                    </div>
                    <div class="col-md-3">
                      {/* <button onClick={generatePDFAudit} class="btn b_save">
                        {selectedOption === "option1"
                          ? "ออกสลิปออดิท"
                          : selectedOption === "option2"
                            ? "ออกสลิปออดิท"
                            : ""}
                      </button> */}
                    </div>
                  </div>



              </section>
            </div>
          </section>
        </div>
      </div>

      {/* Modal สำหรับแก้ไขข้อมูลก่อนพิมพ์ */}
      {showEditModal && editableData.length > 0 && (
        <div className="modal fade show edit-modal" style={{ 
          display: 'block', 
          backgroundColor: 'rgba(0,0,0,0.6)',
          overflowY: 'auto',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}>
          <div className="modal-dialog" style={{ 
            maxWidth: '95vw', 
            width: '95vw',
            margin: '0 auto',
            position: 'relative',
            top: '0'
          }}>
            <div className="modal-content" style={{
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  แก้ไขข้อมูลก่อนพิมพ์สลิป
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
              </div>
              
              <div className="modal-body" style={{
                flex: '1',
                overflowY: 'auto',
                padding: '20px'
              }}>
                {/* Employee Navigation */}
                <div className="employee-navigation">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">
                        <i className="fas fa-user me-2"></i>
                        {editableData[editingEmployeeIndex]?.editableFields?.employeeId} - {editableData[editingEmployeeIndex]?.editableFields?.prefix} {editableData[editingEmployeeIndex]?.editableFields?.employeeName}
                      </h6>
                      <small className="text-muted">พนักงานคนที่ {editingEmployeeIndex + 1} จาก {editableData.length} คน</small>
                    </div>
                    <div>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={prevEmployee}
                        disabled={editingEmployeeIndex === 0}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={nextEmployee}
                        disabled={editingEmployeeIndex === editableData.length - 1}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          {/* ข้อมูลรายได้ */}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="section-header income">
                              <h6 className="text-success mb-0">
                                <i className="fas fa-plus-circle me-2"></i>ข้อมูลรายได้
                              </h6>
                            </div>
                            
                            <div className="form-group mb-3">
                              <label><i className="fas fa-calendar-check me-1"></i>จำนวนวันทำงาน</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.workDays ?? 
                                             responseDataAll[editingEmployeeIndex]?.employee_record?.filter(record => record.dayType === "work").length;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('workDays', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="1"
                              />
                            </div>
                            
                            <div className="form-group mb-3">
                              <label><i className="fas fa-money-bill-wave me-1"></i>เงินเดือนพื้นฐาน</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumCashWork ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumCashWork;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumCashWork', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-stopwatch me-1"></i>ชั่วโมง OT 1.5 เท่า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumOt1p5 ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumOt1p5;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumOt1p5', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-money-bill me-1"></i>เงิน OT 1.5 เท่า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumCashWorkMul?.["1.5"] ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumCashWorkMul?.["1.5"];
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumCashWorkMul.1.5', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-calendar-alt me-1"></i>ชั่วโมง OT วันหยุด (2 เท่า)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumOtPublicHoliday ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumOtPublicHoliday;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumOtPublicHoliday', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-money-bill me-1"></i>เงิน OT 2 เท่า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumCashWorkMul?.["2"] ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumCashWorkMul?.["2"];
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumCashWorkMul.2', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-business-time me-1"></i>ชั่วโมง OT 3 เท่า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumOt3 ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumOt3;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumOt3', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-money-bill me-1"></i>เงิน OT 3 เท่า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.sumCashWorkMul?.["3"] ?? 
                                             responseDataAll[editingEmployeeIndex]?.sumCashWorkMul?.["3"];
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('sumCashWorkMul.3', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-gift me-1"></i>เงินวันหยุดนักขัตฤกษ์</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.publicHolidayCash ?? 
                                             responseDataAll[editingEmployeeIndex]?.publicHolidayCash;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('publicHolidayCash', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-calendar-check me-1"></i>จำนวนวันหยุดนักขัตฤกษ์</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.publicHolidayCount ?? 
                                             responseDataAll[editingEmployeeIndex]?.publicHolidayCount;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('publicHolidayCount', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="1"
                              />
                            </div>
                          </div>

                          {/* รายการหัก */}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="section-header deduction">
                              <h6 className="text-danger mb-0">
                                <i className="fas fa-minus-circle me-2"></i>รายการหัก
                              </h6>
                            </div>
                            
                            <div className="form-group mb-3">
                              <label><i className="fas fa-receipt me-1"></i>ภาษีเงินได้</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.tax ?? 
                                             responseDataAll[editingEmployeeIndex]?.tax;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('tax', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-shield-alt me-1"></i>สมทบประกันสังคม</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.socialSecurity ?? 
                                             responseDataAll[editingEmployeeIndex]?.socialSecurity;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('socialSecurity', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label><i className="fas fa-hand-holding-usd me-1"></i>คืนเงินเบิกล่วงหน้า</label>
                              <input
                                type="number"
                                className="form-control"
                                value={(() => {
                                  const val = editableData[editingEmployeeIndex]?.editableFields?.advance ?? 
                                             responseDataAll[editingEmployeeIndex]?.advance;
                                  return val || val === 0 ? val : '';
                                })()}
                                onChange={(e) => updateEditableField('advance', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                step="0.01"
                              />
                            </div>
                          </div>

                          {/* เงินรับสุทธิ */}
                          <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="section-header">
                              <h6 className="text-info mb-0">
                                <i className="fas fa-calculator me-2"></i>สรุปผล
                              </h6>
                            </div>

                            <div className="net-salary-display">
                              <h6 className="text-success mb-2">
                                <i className="fas fa-coins me-2"></i>เงินรับสุทธิ
                              </h6>
                              <h4 className="text-success mb-0 fw-bold">
                                {(() => {
                                  const currentEmp = editableData[editingEmployeeIndex]?.editableFields;
                                  const income = 
                                    parseFloat(currentEmp?.sumCashWork || 0) + 
                                    parseFloat(currentEmp?.sumCashOt || 0) +
                                    parseFloat(currentEmp?.publicHolidayCash || 0) + 
                                    parseFloat(
                                      currentEmp?.addSalaryList?.reduce(
                                        (total, item) => total + parseFloat(item.SpSalary || 0),
                                        0
                                      ) || 0
                                    );
                                  const deduction = 
                                    parseFloat(currentEmp?.tax || 0) +
                                    parseFloat(currentEmp?.socialSecurity || 0) +
                                    parseFloat(currentEmp?.advance || 0);
                                  const net = income - deduction;
                                  return net.toLocaleString('th-TH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  });
                                })()}
                                <small> บาท</small>
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* รายการเงินพิเศษ */}
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="section-header special">
                              <h6 className="text-warning mb-0">
                                <i className="fas fa-star me-2"></i>รายการเงินพิเศษ/สวัสดิการ
                              </h6>
                            </div>
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th><i className="fas fa-list me-1"></i>รายการ</th>
                                    <th><i className="fas fa-dollar-sign me-1"></i>จำนวนเงิน</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    const currentList = editableData[editingEmployeeIndex]?.editableFields?.addSalaryList || [];
                                    
                                    // กลุ่มหลัก: ค่าเดินทาง/ค่าตำแหน่ง/โทรศัพท์
                                    const mainGroup = currentList.filter(item => ["1230", "1350", "1535"].includes(item.id));
                                    const mainGroupTotal = mainGroup.reduce((sum, item) => sum + parseFloat(item.SpSalary || 0), 0);
                                    const mainGroupNames = mainGroup.map(item => {
                                      if (item.id === "1350") return "โทรศัพท์";
                                      if (item.id === "1535") return "ค่าเดินทาง";
                                      return item.name;
                                    }).join("/");

                                    // กลุ่มเงินพิเศษ: เงินเพิ่มพิเศษ/เงินพิเศษวันหยุด
                                    const extraGroup = currentList.filter(item => ["1560", "1563"].includes(item.id));
                                    const extraGroupTotal = extraGroup.reduce((sum, item) => sum + parseFloat(item.SpSalary || 0), 0);
                                    const extraGroupNames = extraGroup.map(item => {
                                      if (item.id === "1560") return "เงินเพิ่มพิเศษ";
                                      if (item.id === "1563") return "เงินพิเศษวันหยุด";
                                      return item.name;
                                    }).join("/");

                                    // รายการอื่นๆ ที่ไม่อยู่ในกลุ่มข้างต้น
                                    const otherItems = currentList.filter(item => 
                                      !["1230", "1350", "1535", "1560", "1563"].includes(item.id)
                                    );

                                    return (
                                      <>
                                        {/* กลุ่มหลัก */}
                                        {mainGroup.length > 0 && (
                                          <tr>
                                            <td className="fw-medium">{mainGroupNames || "ค่าเดินทาง/ค่าตำแหน่ง/โทรศัพท์"}</td>
                                            <td>
                                              <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={mainGroupTotal}
                                                onChange={(e) => {
                                                  const newTotal = parseFloat(e.target.value) || 0;
                                                  const perItem = newTotal / mainGroup.length;
                                                  mainGroup.forEach((item, idx) => {
                                                    const actualIndex = currentList.findIndex(i => i.id === item.id);
                                                    updateAddSalaryField(actualIndex, 'SpSalary', perItem);
                                                  });
                                                }}
                                                step="0.01"
                                              />
                                            </td>
                                          </tr>
                                        )}

                                        {/* กลุ่มเงินพิเศษ */}
                                        {extraGroup.length > 0 && (
                                          <tr>
                                            <td className="fw-medium">{extraGroupNames || "เงินพิเศษ"}</td>
                                            <td>
                                              <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={extraGroupTotal}
                                                onChange={(e) => {
                                                  const newTotal = parseFloat(e.target.value) || 0;
                                                  const perItem = newTotal / extraGroup.length;
                                                  extraGroup.forEach((item, idx) => {
                                                    const actualIndex = currentList.findIndex(i => i.id === item.id);
                                                    updateAddSalaryField(actualIndex, 'SpSalary', perItem);
                                                  });
                                                }}
                                                step="0.01"
                                              />
                                            </td>
                                          </tr>
                                        )}

                                        {/* รายการอื่นๆ แยกรายการ */}
                                        {otherItems.map((item, index) => {
                                          const actualIndex = currentList.findIndex(i => i.id === item.id);
                                          return (
                                            <tr key={item.id || index}>
                                              <td className="fw-medium">{item.name}</td>
                                              <td>
                                                <input
                                                  type="number"
                                                  className="form-control form-control-sm"
                                                  value={item.SpSalary || 0}
                                                  onChange={(e) => updateAddSalaryField(actualIndex, 'SpSalary', parseFloat(e.target.value) || 0)}
                                                  step="0.01"
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </>
                                    );
                                  })()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer" style={{
                flexShrink: 0,
                borderTop: '1px solid #dee2e6',
                padding: '15px 20px'
              }}>
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <span className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      กำลังแก้ไขพนักงานคนที่ {editingEmployeeIndex + 1} จาก {editableData.length} คน
                    </span>
                  </div>
                  
                  <div>
                    <button type="button" className="btn btn-secondary me-2" onClick={closeEditModal}>
                      <i className="fas fa-times me-1"></i>ยกเลิก
                    </button>
                    <button type="button" className="btn btn-success" onClick={generatePDFWithEditedData}>
                      <i className="fas fa-print me-1"></i>
                      สร้าง PDF ด้วยข้อมูลที่แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Styles */}
      <style jsx>{`
        .edit-modal {
          z-index: 1050;
        }
        
        .modal-dialog {
          display: flex;
          align-items: center;
          min-height: calc(100vh - 40px);
        }
        
        .modal-content {
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px 10px 0 0;
          padding: 20px;
        }
        
        .employee-navigation {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          color: white;
        }
        
        .section-header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        
        .section-header.income {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        
        .section-header.deduction {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .section-header.special {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          color: #333;
        }
        
        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .net-salary-display {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        
        .btn {
          border-radius: 8px;
          padding: 8px 16px;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
        }
        
        @media (max-width: 768px) {
          .modal-dialog {
            margin: 10px;
            width: calc(100% - 20px);
            max-width: none;
          }
          
          .modal-content {
            max-height: calc(100vh - 20px);
          }
        }
      `}</style>

    {/* </body> */}
    </div>
  );
}


export default SalarySlipPDF;
