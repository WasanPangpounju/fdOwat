import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import AllWorkplacesSummaryPDFReport from '../PDF/AllWorkplacesSummaryPDFReport';
import Swal from 'sweetalert2';

function CashComponent() {
  const navigate = useNavigate();
  // State variables
  const [staffId, setStaffId] = useState('');
  const [staffFullName, setStaffFullName] = useState('');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for checkbox and search
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [approvedEmployees, setApprovedEmployees] = useState(new Set());
  const [approveAll, setApproveAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApprovedHistory, setShowApprovedHistory] = useState(false);
  const [approvedHistory, setApprovedHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Generate years array (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  // Handle search function
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('กรุณาระบุวันที่เริ่มต้นและวันที่สิ้นสุด');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // แปลงวันที่ให้อยู่ในรูปแบบ dd/mm และ พ.ศ.
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      // แปลงเป็น format dd/mm สำหรับ API
      const startDay = String(startDateObj.getDate()).padStart(2, '0');
      const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDateObj.getDate()).padStart(2, '0');
      const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
      
      // แปลงปี ค.ศ. เป็น พ.ศ.
      const yearBE = (endDateObj.getFullYear() + 543).toString();
      
      console.log('Searching with:', { 
        startDate: `${startDay}/${startMonth}`,
        endDate: `${endDay}/${endMonth}`,
        year: yearBE
      });

      const response = await fetch('http://10.10.110.7:3000/timerecord/checkcashholiday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: `${startDay}/${startMonth}`,
          endDate: `${endDay}/${endMonth}`,
          year: yearBE
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && data.data && data.data.length > 0) {
          // จัดกลุ่มข้อมูลตามหน่วยงาน (workplace)
          const workplaceMap = new Map();
          
          data.data.forEach(record => {
            const workplaceKey = record.workplaceId;
            
            if (!workplaceMap.has(workplaceKey)) {
              workplaceMap.set(workplaceKey, {
                workplaceId: record.workplaceId,
                workplaceName: record.workplaceName,
                employees: new Map()
              });
            }
            
            const workplace = workplaceMap.get(workplaceKey);
            const employeeKey = record.employeeId;
            
            if (!workplace.employees.has(employeeKey)) {
              workplace.employees.set(employeeKey, {
                employeeId: record.employeeId,
                employeeName: record.employeeName,
                specialShiftDays: []
              });
            }
            
            // เพิ่มข้อมูลวันทำงาน
            workplace.employees.get(employeeKey).specialShiftDays.push({
              date: record.date,
              day: record.day,
              month: record.month,
              year: record.year,
              shift: record.shift,
              startTime: record.startTime,
              endTime: record.endTime,
              totalTime: record.totalTime,
              startOtTime: record.startOtTime,
              endOtTime: record.endOtTime,
              totalOtTime: record.totalOtTime,
              cashOfHoliday: record.cashOfHoliday,
              cashOfHolidayOt: record.cashOfHolidayOt,
              messageSalary: record.messageSalary,
              totalCash: record.totalCash
            });
          });
          
          // แปลง Map เป็น Array
          const workplaces = Array.from(workplaceMap.values()).map(workplace => ({
            workplaceId: workplace.workplaceId,
            workplaceName: workplace.workplaceName,
            employees: Array.from(workplace.employees.values()),
            totalEmployeesWithSpecialShift: workplace.employees.size
          }));
          
          // สร้างข้อมูลสรุป
          const totalWorkplaces = workplaces.length;
          const totalEmployees = data.summary.totalEmployees;
          const totalRecords = data.summary.totalRecords;
          
          const formattedData = {
            success: true,
            workplaces: workplaces,
            totalWorkplacesWithSpecialShift: totalWorkplaces,
            totalEmployeesWithSpecialShift: totalEmployees,
            totalRecords: totalRecords,
            summary: `ช่วงวันที่ ${startDay}/${startMonth} - ${endDay}/${endMonth} ปี ${yearBE} มี ${totalWorkplaces} หน่วยงานที่มีการจ่ายสด รวม ${totalEmployees} คน (${totalRecords} รายการ)`,
            grandTotal: data.summary.grandTotal,
            totalCashOfHoliday: data.summary.totalCashOfHoliday,
            totalCashOfHolidayOt: data.summary.totalCashOfHolidayOt,
            searchCriteria: data.searchCriteria
          };
          
          setSearchResults(formattedData);
          console.log('Formatted results:', formattedData);
        } else {
          // ไม่มีข้อมูล
          setSearchResults({
            success: true,
            workplaces: [],
            totalWorkplacesWithSpecialShift: 0,
            totalEmployeesWithSpecialShift: 0,
            summary: `ช่วงวันที่ ${startDay}/${startMonth} - ${endDay}/${endMonth} ปี ${yearBE} ไม่มีการจ่ายสด`,
            grandTotal: '0.00'
          });
        }
      } else {
        throw new Error('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
      }
    } catch (error) {
      console.error('Error searching:', error);
      setError('เกิดข้อผิดพลาดในการค้นหาข้อมูล: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle staff name change
  const handleStaffNameChange = (e) => {
    const selectedName = e.target.value;
    setStaffFullName(selectedName);
    
    // Find the employee by name and set the staffId
    const selectedEmployee = employeeList.find(
      emp => (emp.name + " " + emp.lastName) === selectedName
    );
    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
    }
  };

  // Fetch employee list on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://10.10.110.7:3000/employee/list');
        if (response.ok) {
          const data = await response.json();
          setEmployeeList(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle workplace card click - navigate to workplace detail page
  const handleWorkplaceClick = async (workplace) => {
    try {
      // ตรวจสอบสถานะการอนุมัติก่อน
      const startDateObj = new Date(startDate);
      const month = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const year = String(startDateObj.getFullYear() + 543);
      
      navigate(`/special-shift-detail/${workplace.workplaceId}`, {
        state: {
          workplaceData: workplace,
          month: month,
          year: year,
          startDate: startDate,
          endDate: endDate
        }
      });
    } catch (error) {
      console.error('Error handling workplace click:', error);
    }
  };

  // Handle checkbox functions
  const handleSelectAll = () => {
    if (!searchResults?.workplaces) return;
    
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      // Select all employees
      const allEmployeeKeys = new Set();
      searchResults.workplaces.forEach((workplace) => {
        workplace.employees.forEach((employee) => {
          employee.specialShiftDays.forEach((day, dayIndex) => {
            const key = `${workplace.workplaceId}-${employee.employeeId}-${dayIndex}`;
            allEmployeeKeys.add(key);
          });
        });
      });
      setSelectedEmployees(allEmployeeKeys);
    } else {
      // Deselect all
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (workplaceId, employeeId, dayIndex) => {
    const key = `${workplaceId}-${employeeId}-${dayIndex}`;
    const newSelected = new Set(selectedEmployees);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    
    setSelectedEmployees(newSelected);
    
    // Update selectAll state
    if (searchResults?.workplaces) {
      let totalRows = 0;
      searchResults.workplaces.forEach((workplace) => {
        workplace.employees.forEach((employee) => {
          totalRows += employee.specialShiftDays.length;
        });
      });
      setSelectAll(newSelected.size === totalRows);
    }
  };

  // Handle approve checkbox functions
  const handleApproveAll = () => {
    if (!searchResults?.workplaces) return;
    
    const newApproveAll = !approveAll;
    setApproveAll(newApproveAll);
    
    if (newApproveAll) {
      // Approve all employees
      const allEmployeeKeys = new Set();
      searchResults.workplaces.forEach((workplace) => {
        workplace.employees.forEach((employee) => {
          employee.specialShiftDays.forEach((day, dayIndex) => {
            const key = `${workplace.workplaceId}-${employee.employeeId}-${dayIndex}`;
            allEmployeeKeys.add(key);
          });
        });
      });
      setApprovedEmployees(allEmployeeKeys);
    } else {
      // Deselect all
      setApprovedEmployees(new Set());
    }
  };

  const handleApproveEmployee = (workplaceId, employeeId, dayIndex) => {
    const key = `${workplaceId}-${employeeId}-${dayIndex}`;
    const newApproved = new Set(approvedEmployees);
    
    if (newApproved.has(key)) {
      newApproved.delete(key);
    } else {
      newApproved.add(key);
    }
    
    setApprovedEmployees(newApproved);
    
    // Update approveAll state
    if (searchResults?.workplaces) {
      let totalRows = 0;
      searchResults.workplaces.forEach((workplace) => {
        workplace.employees.forEach((employee) => {
          totalRows += employee.specialShiftDays.length;
        });
      });
      setApproveAll(newApproved.size === totalRows);
    }
  };

  // Filter data based on search text
  const getFilteredData = () => {
    if (!searchResults?.workplaces || !searchText.trim()) {
      return searchResults?.workplaces || [];
    }

    const searchLower = searchText.toLowerCase().trim();
    
    return searchResults.workplaces
      .map(workplace => ({
        ...workplace,
        employees: workplace.employees.filter(employee => 
          employee.employeeId.toLowerCase().includes(searchLower) ||
          employee.employeeName.toLowerCase().includes(searchLower)
        )
      }))
      .filter(workplace => workplace.employees.length > 0);
  };

  // Calculate deducted amount (3%)
  const calculateDeduction = (amount) => {
    return amount * 0.03;
  };

  // Calculate total with deduction
  const calculateTotalWithDeduction = () => {
    if (!searchResults?.workplaces) return { total: 0, deduction: 0, net: 0 };
    
    let total = 0;
    let deduction = 0;
    
    searchResults.workplaces.forEach((workplace) => {
      workplace.employees.forEach((employee) => {
        employee.specialShiftDays.forEach((day, dayIndex) => {
          const key = `${workplace.workplaceId}-${employee.employeeId}-${dayIndex}`;
          const dayTotal = parseFloat(day.totalCash || 0);
          total += dayTotal;
          
          if (selectedEmployees.has(key)) {
            deduction += calculateDeduction(dayTotal);
          }
        });
      });
    });
    
    return {
      total: total,
      deduction: deduction,
      net: total - deduction
    };
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    // Check if any items are approved
    if (approvedEmployees.size === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'ไม่มีรายการที่อนุมัติ',
        text: 'กรุณาเลือกรายการที่ต้องการอนุมัติจ่ายก่อน',
        confirmButtonColor: '#2b5d8e'
      });
      return;
    }

    // Request Secret Key
    const { value: secretKey } = await Swal.fire({
      title: 'ยืนยันตัวตน',
      html: `
        <div class="text-start">
          <p class="mb-3">กรุณาป้อน Secret Key เพื่อยืนยันการเบิกจ่าย</p>
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>รายการที่จะยืนยัน:</strong> ${approvedEmployees.size} รายการ
          </div>
        </div>
      `,
      input: 'password',
      inputPlaceholder: 'ป้อน Secret Key',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off',
        maxlength: 4
      },
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#2b5d8e',
      cancelButtonColor: '#6c757d',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณาป้อน Secret Key';
        }
        if (value !== '8888') {
          return 'Secret Key ไม่ถูกต้อง';
        }
      }
    });

    if (secretKey === '8888') {
      setIsProcessing(true);
      
      try {
        // Collect approved items data
        const approvedItems = [];
        searchResults.workplaces.forEach((workplace) => {
          workplace.employees.forEach((employee) => {
            employee.specialShiftDays.forEach((day, dayIndex) => {
              const key = `${workplace.workplaceId}-${employee.employeeId}-${dayIndex}`;
              if (approvedEmployees.has(key)) {
                const isDeducted = selectedEmployees.has(key);
                const totalCash = parseFloat(day.totalCash || 0);
                const deduction = isDeducted ? calculateDeduction(totalCash) : 0;
                
                approvedItems.push({
                  workplaceId: workplace.workplaceId,
                  workplaceName: workplace.workplaceName,
                  employeeId: employee.employeeId,
                  employeeName: employee.employeeName,
                  date: day.date,
                  totalCash: totalCash,
                  deduction: deduction,
                  netAmount: totalCash - deduction,
                  messageSalary: day.messageSalary || ''
                });
              }
            });
          });
        });

        // Calculate totals
        const totalAmount = approvedItems.reduce((sum, item) => sum + item.totalCash, 0);
        const totalDeduction = approvedItems.reduce((sum, item) => sum + item.deduction, 0);
        const netAmount = totalAmount - totalDeduction;

        // Show confirmation summary
        const confirmResult = await Swal.fire({
          title: 'ยืนยันการเบิกจ่าย',
          html: `
            <div class="text-start">
              <h6 class="mb-3">สรุปรายการที่จะยืนยัน:</h6>
              <table class="table table-sm table-bordered">
                <tr>
                  <td><strong>จำนวนรายการ:</strong></td>
                  <td class="text-end">${approvedItems.length} รายการ</td>
                </tr>
                <tr>
                  <td><strong>ยอดเงินรวม:</strong></td>
                  <td class="text-end">${totalAmount.toLocaleString()} บาท</td>
                </tr>
                <tr class="table-danger">
                  <td><strong>หัก 3%:</strong></td>
                  <td class="text-end">-${totalDeduction.toLocaleString()} บาท</td>
                </tr>
                <tr class="table-success">
                  <td><strong>ยอดสุทธิ:</strong></td>
                  <td class="text-end"><strong>${netAmount.toLocaleString()} บาท</strong></td>
                </tr>
              </table>
              <p class="text-danger mt-3 mb-0">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>คำเตือน:</strong> การยืนยันจะไม่สามารถแก้ไขได้
              </p>
            </div>
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'ยืนยันการเบิกจ่าย',
          cancelButtonText: 'ยกเลิก',
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#6c757d'
        });

        if (confirmResult.isConfirmed) {
          // ส่งข้อมูลไป API เพื่อบันทึกการเบิกจ่าย
          const response = await fetch('http://10.10.110.7:3000/timerecord/confirmcashpayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: approvedItems,
              totalAmount,
              totalDeduction,
              netAmount,
              startDate,
              endDate,
              approvedBy: 'Admin', // TODO: ควรได้จาก session/token
              note: ''
            })
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || 'ไม่สามารถบันทึกการอนุมัติได้');
          }

          await Swal.fire({
            icon: 'success',
            title: 'ยืนยันการเบิกจ่ายสำเร็จ',
            html: `
              <div class="text-start">
                <p>ยืนยันการเบิกจ่ายเรียบร้อยแล้ว</p>
                <ul class="list-unstyled mt-3">
                  <li><strong>เลขที่อนุมัติ:</strong> ${result.approvalId}</li>
                  <li><strong>จำนวน:</strong> ${approvedItems.length} รายการ</li>
                  <li><strong>ยอดสุทธิ:</strong> ${netAmount.toLocaleString()} บาท</li>
                </ul>
              </div>
            `,
            confirmButtonColor: '#2b5d8e'
          });

          // Reset selections
          setApprovedEmployees(new Set());
          setApproveAll(false);
          setSelectedEmployees(new Set());
          setSelectAll(false);
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถยืนยันการเบิกจ่ายได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonColor: '#dc3545'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // ดึงข้อมูลประวัติการอนุมัติ
  const fetchApprovedHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('http://10.10.110.7:3000/timerecord/getcashpaymentapprovals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          year: year ? (parseInt(year) + 543).toString() : undefined
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setApprovedHistory(result);
        setShowApprovedHistory(true);
      } else {
        throw new Error(result.message || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching approved history:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถดึงข้อมูลประวัติการอนุมัติได้',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const checkApprovalStatus = async (workplace) => {
    try {
      const startDateObj = new Date(startDate);
      const month = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const year = startDateObj.getFullYear().toString();
      
      const approvalCheck = await fetch('http://10.10.110.7:3000/timerecord/checkspecialtshift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: month,
          year: year,
          workplaceId: workplace.workplaceId,
          startDate: startDate,
          endDate: endDate,
          checkApproval: true
        })
      });

      if (approvalCheck.ok) {
        const approvalData = await approvalCheck.json();
        
        // ตรวจสอบการซ้อนทับช่วงวันที่
        if (approvalData.overlappingApprovals && approvalData.overlappingApprovals.length > 0) {
          await Swal.fire({
            title: 'ไม่สามารถอนุมัติได้',
            html: `<div class="text-start">
              <p>ช่วงวันที่ที่เลือก (${new Date(startDate).toLocaleDateString('th-TH')} - ${new Date(endDate).toLocaleDateString('th-TH')}) ซ้อนทับกับการอนุมัติที่มีอยู่แล้ว</p>
              <hr>
              <p><strong>หน่วยงาน:</strong> ${workplace.workplaceName}</p>
              <p><strong>ช่วงวันที่ที่ซ้อนทับ:</strong></p>
              <ul>
                ${approvalData.overlappingApprovals.map(approval => `
                  <li>${new Date(approval.start_date).toLocaleDateString('th-TH')} - ${new Date(approval.end_date).toLocaleDateString('th-TH')} (อนุมัติโดย: ${approval.approved_by})</li>
                `).join('')}
              </ul>
              <p class="text-warning"><i class="fas fa-exclamation-triangle me-2"></i>กรุณาเลือกช่วงวันที่ที่ไม่ซ้อนทับกัน</p>
            </div>`,
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
          return;
        }
      }
      
      // สร้าง URL สำหรับหน้ารายละเอียดหน่วยงาน
      const params = new URLSearchParams({
        workplaceId: workplace.workplaceId,
        workplaceName: workplace.workplaceName,
        startDate: startDate,
        endDate: endDate,
        employeeData: JSON.stringify(workplace.employees),
        totalEmployees: workplace.totalEmployeesWithSpecialShift.toString()
      });
      
      navigate(`/workplace-special-shift-detail?${params.toString()}`);
      
    } catch (error) {
      console.error('Error checking approval status:', error);
      // หากเกิดข้อผิดพลาดในการตรวจสอบ ให้ไปหน้ารายละเอียดปกติ
      const params = new URLSearchParams({
        workplaceId: workplace.workplaceId,
        workplaceName: workplace.workplaceName,
        startDate: startDate,
        endDate: endDate,
        employeeData: JSON.stringify(workplace.employees),
        totalEmployees: workplace.totalEmployeesWithSpecialShift.toString()
      });
      
      navigate(`/workplace-special-shift-detail?${params.toString()}`);
    }
  };


  const handleGenerateSummaryPDF = async () => {
    if (!searchResults || !searchResults.workplaces || searchResults.workplaces.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่มีข้อมูล',
        text: 'กรุณาค้นหาข้อมูลก่อนออกรายงาน',
        confirmButtonColor: '#2b5d8e'
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: 'กำลังสร้างรายงาน PDF...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      // Generate PDF
      const blob = await pdf(
        <AllWorkplacesSummaryPDFReport 
          searchResults={searchResults}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with date range
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const payrollMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
      const payrollYear = endDateObj.getFullYear();
      const filename = `รายงานสรุปกะพิเศษทุกหน่วยงาน_${startDateObj.getDate()}-${endDateObj.getDate()}_${payrollMonth}_${payrollYear}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close loading and show success
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'ออกรายงาน PDF เรียบร้อยแล้ว',
        confirmButtonColor: '#2b5d8e'
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างรายงาน PDF ได้',
        confirmButtonColor: '#2b5d8e'
      });
    }
  };

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          {/* Header Section */}
          <div className="content-header">
            <div className="container-fluid">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-light rounded p-3 mb-4">
                  <li className="breadcrumb-item">
                    <i className="fas fa-home "></i>{" "}
                    <a href="index.php" className="text-decoration-none">
                      หน้าหลัก
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    ระบบเงินสด
                  </li>
                </ol>
              </nav>

              {/* Page Title */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-gradient text-white py-3">
                      <h1 className="card-title mb-0 fs-4 fw-bold">
                        <i className="fas fa-money-bill-wave me-3"></i>
                        ข้อมูลการจ่ายสด (Cash Holiday)
                      </h1>
                      <p className="mb-0 mt-2 text-white-50" style={{ fontSize: '0.9rem' }}>
                        <i className="fas fa-info-circle me-2"></i>
                        ระบบตรวจสอบการจ่ายเงินสดในวันหยุด (shift: cash_holiday)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Form Section */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-light border-bottom">
                      <h5 className="card-title mb-0 text-dark">
                        <i className="fas fa-search me-2 "></i>
                        ค้นหาข้อมูล
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      {/* คำอธิบายการใช้งาน */}
                      <div className="alert alert-light border-start border-4 border-primary mb-4">
                        <h6 className="alert-heading text-primary">
                          <i className="fas fa-lightbulb me-2"></i>
                          วิธีการค้นหา
                        </h6>
                        <ul className="mb-0 ps-3">
                          <li className="mb-1">
                            <strong>รอบการจ่ายเงิน:</strong> วันที่ 21 ของเดือนก่อนหน้า ถึงวันที่ 20 ของเดือนปัจจุบัน
                          </li>
                          <li className="mb-1">
                            <strong>ตัวอย่าง:</strong> 21 กันยายน - 20 ตุลาคม 2568 = รอบเดือนตุลาคม 2568
                          </li>
                          <li className="mb-1">
                            <strong>ข้อมูลที่แสดง:</strong> พนักงานที่มี shift: "cash_holiday" เท่านั้น
                          </li>
                        </ul>
                      </div>
                      
                      <form onSubmit={handleSearch}>
                        {/* Employee Information Row */}
                        <div className="row mb-4">
                          
                        </div>

                        {/* Date Selection Row */}
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="startDate" className="form-label fw-semibold text-dark">
                                <i className="fas fa-calendar-plus me-2"></i>
                                วันที่เริ่มต้น
                              </label>
                              <input
                                type="date"
                                id="startDate"
                                className="form-control form-control-lg border-2"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="เลือกวันที่เริ่มต้น"
                              />
                              <div className="form-text">
                                <small className="text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  ตัวอย่าง: 3 สิงหาคม 2567
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="endDate" className="form-label fw-semibold text-dark">
                                <i className="fas fa-calendar-minus me-2"></i>
                                วันที่สิ้นสุด
                              </label>
                              <input
                                type="date"
                                id="endDate"
                                className="form-control form-control-lg border-2"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                placeholder="เลือกวันที่สิ้นสุด"
                              />
                              <div className="form-text">
                                <small className="text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  ตัวอย่าง: 5 สิงหาคม 2567
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Period Selection */}
                        

                        {/* Search Button */}
                        <div className="row">
                          <div className="col-12">
                            {error && (
                              <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                              </div>
                            )}
                            <div className="d-grid gap-2  justify-content-md-center">
                              <button 
                                type="submit" 
                                className="btn btn-primary me-2"
                                style={{backgroundColor:"rgb(43,93,142)"}}
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    กำลังค้นหา...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-search me-2"></i>
                                    ค้นหาข้อมูล
                                  </>
                                )}
                              </button>
                              
                              {searchResults && searchResults.workplaces && searchResults.workplaces.length > 0 && (
                                <>
                                  <button 
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleGenerateSummaryPDF}
                                    style={{backgroundColor:"#28a745"}}
                                  >
                                    <i className="fas fa-file-pdf me-2"></i>
                                    ออกรายงาน PDF สรุปทุกหน่วยงาน
                                  </button>
                                  
                                  <button 
                                    type="button"
                                    className="btn btn-warning text-white ms-2"
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing || approvedEmployees.size === 0}
                                    style={{backgroundColor:"#ff9800"}}
                                  >
                                    {isProcessing ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        กำลังดำเนินการ...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-check-circle me-2"></i>
                                        ยืนยันการเบิกจ่าย
                                        {approvedEmployees.size > 0 && (
                                          <span className="badge bg-light text-dark ms-2">
                                            {approvedEmployees.size}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </button>
                                </>
                              )}
                             
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              {searchResults && searchResults.workplaces && searchResults.workplaces.length > 0 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card shadow-sm border-0">
                      <div className="card-header bg-white border-bottom-0 pt-3 pb-0">
                        <ul className="nav nav-tabs card-header-tabs" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button 
                              className={`nav-link ${!showApprovedHistory ? 'active' : ''}`}
                              onClick={() => setShowApprovedHistory(false)}
                              type="button"
                              role="tab"
                            >
                              <i className="fas fa-list me-2"></i>
                              รายการรอการอนุมัติ
                              {searchResults.totalWorkplacesWithSpecialShift > 0 && (
                                <span className="badge bg-warning text-dark ms-2">
                                  {searchResults.totalWorkplacesWithSpecialShift}
                                </span>
                              )}
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button 
                              className={`nav-link ${showApprovedHistory ? 'active' : ''}`}
                              onClick={() => {
                                setShowApprovedHistory(true);
                                if (!approvedHistory) {
                                  fetchApprovedHistory();
                                }
                              }}
                              type="button"
                              role="tab"
                              disabled={loadingHistory}
                            >
                              {loadingHistory ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  กำลังโหลด...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-history me-2"></i>
                                  ประวัติการอนุมัติ
                                  {approvedHistory && approvedHistory.summary && (
                                    <span className="badge bg-success ms-2">
                                      {approvedHistory.summary.totalApprovals}
                                    </span>
                                  )}
                                </>
                              )}
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Tab Content - Approved History */}
                      {showApprovedHistory && approvedHistory && (
                        <div className="card-body">
                          {/* Summary */}
                          <div className="alert alert-info mb-4">
                          <h6 className="alert-heading">
                            <i className="fas fa-chart-bar me-2"></i>
                            สรุปข้อมูลการอนุมัติ
                          </h6>
                          <div className="row mt-3">
                            <div className="col-md-3">
                              <strong>จำนวนครั้งที่อนุมัติ:</strong>
                              <div className="text-primary fs-4">{approvedHistory.summary.totalApprovals} ครั้ง</div>
                            </div>
                            <div className="col-md-3">
                              <strong>จำนวนรายการ:</strong>
                              <div className="text-secondary fs-4">{approvedHistory.summary.totalItems} รายการ</div>
                            </div>
                            <div className="col-md-2">
                              <strong>ยอดรวม:</strong>
                              <div className="text-success fs-5">{approvedHistory.summary.totalAmount.toLocaleString()} บาท</div>
                            </div>
                            <div className="col-md-2">
                              <strong>หัก 3%:</strong>
                              <div className="text-danger fs-5">-{approvedHistory.summary.totalDeduction.toLocaleString()} บาท</div>
                            </div>
                            <div className="col-md-2">
                              <strong>ยอดสุทธิ:</strong>
                              <div className="text-success fw-bold fs-4">{approvedHistory.summary.totalNetAmount.toLocaleString()} บาท</div>
                            </div>
                          </div>
                        </div>

                        {/* Workplaces Group */}
                        {approvedHistory.workplaces && approvedHistory.workplaces.length > 0 ? (
                          <div className="accordion" id="workplaceAccordion">
                            {approvedHistory.workplaces.map((workplace, index) => (
                              <div className="accordion-item" key={workplace.workplaceId}>
                                <h2 className="accordion-header" id={`heading${index}`}>
                                  <button 
                                    className="accordion-button collapsed" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${index}`}
                                  >
                                    <div className="w-100">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <i className="fas fa-building me-2 text-info"></i>
                                          <strong>{workplace.workplaceName}</strong>
                                          <small className="text-muted ms-2">({workplace.workplaceId})</small>
                                        </div>
                                        <div className="me-3">
                                          <span className="badge bg-secondary me-2">{workplace.itemCount} รายการ</span>
                                          <span className="badge bg-success">{workplace.netAmount.toLocaleString()} บาท</span>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </h2>
                                <div 
                                  id={`collapse${index}`} 
                                  className="accordion-collapse collapse" 
                                  aria-labelledby={`heading${index}`}
                                  data-bs-parent="#workplaceAccordion"
                                >
                                  <div className="accordion-body">
                                    <div className="row mb-3">
                                      <div className="col-md-4">
                                        <strong>ยอดรวม:</strong> {workplace.totalAmount.toLocaleString()} บาท
                                      </div>
                                      <div className="col-md-4">
                                        <strong className="text-danger">หัก 3%:</strong> -{workplace.totalDeduction.toLocaleString()} บาท
                                      </div>
                                      <div className="col-md-4">
                                        <strong className="text-success">ยอดสุทธิ:</strong> {workplace.netAmount.toLocaleString()} บาท
                                      </div>
                                    </div>

                                    {/* Approval List */}
                                    <h6 className="mt-3 mb-2">
                                      <i className="fas fa-list me-2"></i>
                                      ประวัติการอนุมัติ
                                    </h6>
                                    {workplace.approvals.map((approval, aIndex) => {
                                      const fullApproval = approvedHistory.approvals.find(
                                        a => a._id.toString() === approval.approvalId.toString()
                                      );
                                      
                                      if (!fullApproval) return null;

                                      const workplaceItems = fullApproval.items.filter(
                                        item => item.workplaceId === workplace.workplaceId
                                      );

                                      return (
                                        <div key={aIndex} className="card mb-3 border-success">
                                          <div className="card-header bg-light">
                                            <div className="row">
                                              <div className="col-md-6">
                                                <small className="text-muted">
                                                  <i className="fas fa-calendar me-1"></i>
                                                  อนุมัติเมื่อ: {new Date(approval.approvedAt).toLocaleString('th-TH')}
                                                </small>
                                              </div>
                                              <div className="col-md-6 text-end">
                                                <small className="text-muted">
                                                  <i className="fas fa-user me-1"></i>
                                                  โดย: {approval.approvedBy}
                                                </small>
                                                <span className={`badge ms-2 ${
                                                  approval.status === 'approved' ? 'bg-success' :
                                                  approval.status === 'paid' ? 'bg-primary' : 'bg-secondary'
                                                }`}>
                                                  {approval.status}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="card-body">
                                            <div className="table-responsive">
                                              <table className="table table-sm table-hover mb-0">
                                                <thead className="table-light">
                                                  <tr>
                                                    <th style={{width: '10%'}}>รหัส</th>
                                                    <th style={{width: '25%'}}>ชื่อพนักงาน</th>
                                                    <th style={{width: '15%'}}>วันที่</th>
                                                    <th className="text-end" style={{width: '15%'}}>ยอดเงิน</th>
                                                    <th className="text-end" style={{width: '15%'}}>หัก 3%</th>
                                                    <th className="text-end" style={{width: '15%'}}>สุทธิ</th>
                                                    <th style={{width: '5%'}}>หมายเหตุ</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {workplaceItems.map((item, itemIndex) => (
                                                    <tr key={itemIndex}>
                                                      <td>
                                                        <span className="badge bg-secondary">{item.employeeId}</span>
                                                      </td>
                                                      <td>{item.employeeName}</td>
                                                      <td>
                                                        <small>{item.date}</small>
                                                      </td>
                                                      <td className="text-end">{item.totalCash.toLocaleString()}</td>
                                                      <td className="text-end text-danger">
                                                        {item.deduction > 0 ? `-${item.deduction.toLocaleString()}` : '-'}
                                                      </td>
                                                      <td className="text-end text-success fw-bold">
                                                        {item.netAmount.toLocaleString()}
                                                      </td>
                                                      <td>
                                                        {item.messageSalary && (
                                                          <small className="text-muted">{item.messageSalary}</small>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                                <tfoot className="table-light">
                                                  <tr className="fw-bold">
                                                    <td colSpan="3" className="text-end">รวม:</td>
                                                    <td className="text-end">
                                                      {workplaceItems.reduce((sum, item) => sum + item.totalCash, 0).toLocaleString()}
                                                    </td>
                                                    <td className="text-end text-danger">
                                                      -{workplaceItems.reduce((sum, item) => sum + item.deduction, 0).toLocaleString()}
                                                    </td>
                                                    <td className="text-end text-success">
                                                      {workplaceItems.reduce((sum, item) => sum + item.netAmount, 0).toLocaleString()}
                                                    </td>
                                                    <td></td>
                                                  </tr>
                                                </tfoot>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">ไม่พบประวัติการอนุมัติ</h5>
                            <p className="text-muted">ในช่วงเวลาที่เลือก</p>
                          </div>
                        )}
                        </div>
                      )}

                      {/* Tab Content - Results Section */}
                      {!showApprovedHistory && searchResults && (
                        <div className="card-body">
                          <div>
                    {/* Summary Section */}
                    <div className="alert alert-info mb-4">
                            <h6 className="alert-heading">
                              <i className="fas fa-info-circle me-2"></i>
                              สรุปข้อมูล
                            </h6>
                            <p className="mb-2">{searchResults.summary}</p>
                            {searchResults.grandTotal && (
                              <div className="mt-3 pt-3 border-top">
                                <div className="row">
                                  <div className="col-md-3 mb-2">
                                    <strong>ค่าแรงรวม:</strong>{' '}
                                    <span className="text-primary">
                                      {parseFloat(searchResults.totalCashOfHoliday || 0).toLocaleString()} บาท
                                    </span>
                                  </div>
                                  <div className="col-md-3 mb-2">
                                    <strong>ค่าล่วงเวลารวม:</strong>{' '}
                                    <span className="text-warning">
                                      {parseFloat(searchResults.totalCashOfHolidayOt || 0).toLocaleString()} บาท
                                    </span>
                                  </div>
                                  <div className="col-md-3 mb-2">
                                    <strong className="text-success">ยอดรวมทั้งหมด:</strong>{' '}
                                    <span className="text-success fw-bold fs-5">
                                      {parseFloat(searchResults.grandTotal || 0).toLocaleString()} บาท
                                    </span>
                                  </div>
                                  <div className="col-md-3 mb-2">
                                    <strong className="text-danger">หัก 3% ({selectedEmployees.size} รายการ):</strong>{' '}
                                    <span className="text-danger fw-bold">
                                      -{calculateTotalWithDeduction().deduction.toLocaleString()} บาท
                                    </span>
                                    <div className="mt-1">
                                      <small className="text-success">
                                        <strong>คงเหลือ:</strong> {calculateTotalWithDeduction().net.toLocaleString()} บาท
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Search Box */}
                          <div className="mb-3">
                            <div className="input-group">
                              <span className="input-group-text bg-white">
                                <i className="fas fa-search text-muted"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="ค้นหา รหัสพนักงาน, ชื่อ หรือ นามสกุล..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                              />
                              {searchText && (
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => setSearchText('')}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Checkbox Controls */}
                          <div className="d-flex gap-4 mb-3 p-3 bg-light border rounded">
                            <div className="form-check">
                              <input 
                                type="checkbox" 
                                className="form-check-input" 
                                id="selectAllCheckbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="selectAllCheckbox">
                                <i className="fas fa-check-square me-2 text-danger"></i>
                                เลือกหัก 3% ทั้งหมด
                                {selectedEmployees.size > 0 && (
                                  <span className="badge bg-danger ms-2">{selectedEmployees.size}</span>
                                )}
                              </label>
                            </div>
                            
                            <div className="form-check">
                              <input 
                                type="checkbox" 
                                className="form-check-input" 
                                id="approveAllCheckbox"
                                checked={approveAll}
                                onChange={handleApproveAll}
                              />
                              <label className="form-check-label fw-semibold" htmlFor="approveAllCheckbox">
                                <i className="fas fa-check-circle me-2 text-success"></i>
                                อนุมัติทั้งหมด
                                {approvedEmployees.size > 0 && (
                                  <span className="badge bg-success ms-2">{approvedEmployees.size}</span>
                                )}
                              </label>
                            </div>
                          </div>

                          {/* Table Section */}
                          {(() => {
                            const filteredData = getFilteredData();
                            return filteredData && filteredData.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-hover align-middle mb-0" style={{
                                fontSize: '14px',
                                fontFamily: 'Sarabun, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                              }}>
                                <thead className="table-dark">
                                  <tr style={{ height: '60px' }}>
                                    <th className="text-center" style={{ width: '4%' }}>ลำดับ</th>
                                    <th className="text-center" style={{ width: '6%' }}>รหัสพนักงาน</th>
                                    <th style={{ width: '14%' }}>ชื่อ-นามสกุล</th>
                                    <th style={{ width: '15%' }}>หน่วยงาน</th>
                                    <th className="text-center" style={{ width: '5%' }}>วันที่</th>
                                    <th className="text-center" style={{ width: '5%' }}>เวลา</th>
                                    <th className="text-end" style={{ width: '9%' }}>ยอดเงิน (บาท)</th>
                                    <th className="text-end" style={{ width: '9%' }}>หลังหัก 3% (บาท)</th>
                                    <th className='text-center' style={{ width: '13%' }}>หมายเหตุ</th>
                                    <th className="text-center" style={{ width: '5%' }}>หัก 3%</th>
                                    <th className="text-center" style={{ width: '5%' }}>อนุมัติ</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    let rowNumber = 0;
                                    return filteredData.flatMap((workplace) =>
                                      workplace.employees.flatMap((employee) =>
                                        employee.specialShiftDays.map((day, dayIndex) => {
                                          rowNumber++;
                                          const totalCash = parseFloat(day.cashOfHoliday || 0) + parseFloat(day.cashOfHolidayOt || 0);
                                          const key = `${workplace.workplaceId}-${employee.employeeId}-${dayIndex}`;
                                          const isChecked = selectedEmployees.has(key);
                                          const isApproved = approvedEmployees.has(key);
                                          const deduction = isChecked ? calculateDeduction(totalCash) : 0;
                                          const netAmount = totalCash - deduction;
                                          
                                          return (
                                            <tr key={key}>
                                              <td className="text-center">{rowNumber}</td>
                                              <td className="text-center">
                                                <span className="badge bg-secondary">{employee.employeeId}</span>
                                              </td>
                                              <td>{employee.employeeName}</td>
                                              <td>
                                                {workplace.workplaceName}
                                                <br />
                                                <small className="text-muted">รหัส: {workplace.workplaceId}</small>
                                              </td>
                                              <td className="text-center">{day.date}</td>
                                              <td className="text-center">
                                                <small>
                                                  {(() => {
                                                    const cashHoliday = parseFloat(day.cashOfHoliday || 0);
                                                    const cashHolidayOt = parseFloat(day.cashOfHolidayOt || 0);
                                                    if (cashHoliday > 0 && cashHolidayOt > 0) {
                                                      return 'ปกติ + OT';
                                                    } else if (cashHolidayOt > 0) {
                                                      return 'OT';
                                                    } else {
                                                      return 'ปกติ';
                                                    }
                                                  })()}
                                                </small>
                                              </td>
                                              <td className="text-end">
                                                {totalCash.toLocaleString('th-TH', { 
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2 
                                                })}
                                                {(parseFloat(day.cashOfHoliday || 0) > 0 && parseFloat(day.cashOfHolidayOt || 0) > 0) && (
                                                  <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                    <div>ปกติ: {parseFloat(day.cashOfHoliday).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
                                                    <div>OT: {parseFloat(day.cashOfHolidayOt).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</div>
                                                  </div>
                                                )}
                                              </td>
                                              <td className="text-end">
                                                {isChecked ? (
                                                  <>
                                                    <span className="text-success fw-bold">
                                                      {netAmount.toLocaleString('th-TH', { 
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2 
                                                      })}
                                                    </span>
                                                    {deduction > 0 && (
                                                      <div style={{ fontSize: '11px', color: '#dc3545' }}>
                                                        หัก: {deduction.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                                      </div>
                                                    )}
                                                  </>
                                                ) : (
                                                  <span className="text-muted"></span>
                                                )}
                                              </td>
                                              <td className="text-center">
                                                <small className="text-center">
                                                  {day.remark || day.messageSalary || '-'}
                                                </small>
                                              </td>
                                              <td className="text-center">
                                                <input 
                                                  type="checkbox" 
                                                  className="form-check-input" 
                                                  checked={isChecked}
                                                  onChange={() => handleSelectEmployee(workplace.workplaceId, employee.employeeId, dayIndex)}
                                                />
                                              </td>
                                              <td className="text-center">
                                                <input 
                                                  type="checkbox" 
                                                  className="form-check-input" 
                                                  checked={isApproved}
                                                  onChange={() => handleApproveEmployee(workplace.workplaceId, employee.employeeId, dayIndex)}
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })
                                      )
                                    );
                                  })()}
                                </tbody>
                                <tfoot className="table-light">
                                  <tr>
                                    <td colSpan="6" className="text-end fw-bold">รวมทั้งหมด:</td>
                                    <td className="text-end fw-bold text-primary">
                                      {parseFloat(searchResults.grandTotal || 0).toLocaleString('th-TH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })}
                                    </td>
                                    <td className="text-end fw-bold text-success">
                                      {calculateTotalWithDeduction().net.toLocaleString('th-TH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })}
                                      {selectedEmployees.size > 0 && (
                                        <div style={{ fontSize: '11px', color: '#dc3545' }}>
                                          (-{calculateTotalWithDeduction().deduction.toLocaleString('th-TH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                          })})
                                        </div>
                                      )}
                                    </td>
                                    <td></td>
                                    <td className="text-center">
                                      <small className="text-danger">{selectedEmployees.size}</small>
                                    </td>
                                    <td className="text-center">
                                      <small className="text-success">{approvedEmployees.size}</small>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-5">
                              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                              <h5 className="text-muted">ไม่พบข้อมูลการจ่ายสด</h5>
                              <p className="text-muted">
                                {searchText 
                                  ? `ไม่พบข้อมูลที่ตรงกับ "${searchText}"`
                                  : 'ไม่มีหน่วยงานที่มีพนักงานรับเงินสด (cash_holiday) ในช่วงเวลาที่เลือก'
                                }
                              </p>
                            </div>
                          );
                          })()}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
          
  );
}

export default CashComponent;
