import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
// import WorkplacePDFReport from '../PDF/WorkplacePDFReport';

function WorkplaceSpecialShiftDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workplaceData, setWorkplaceData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretVerified, setIsSecretVerified] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [isCheckingApproval, setIsCheckingApproval] = useState(true);

  useEffect(() => {
    // รับข้อมูลจาก URL parameters
    const params = new URLSearchParams(location.search);
    
    try {
      const data = {
        workplaceId: params.get('workplaceId'),
        workplaceName: params.get('workplaceName'),
        startDate: params.get('startDate'),
        endDate: params.get('endDate'),
        totalEmployees: parseInt(params.get('totalEmployees')),
        employees: JSON.parse(params.get('employeeData') || '[]')
      };
      
      setWorkplaceData(data);
      setEmployees(data.employees);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing workplace data:', error);
      setLoading(false);
    }
  }, [location.search]);

  // ตรวจสอบสิทธิ์ user
  useEffect(() => {
    // ตรวจสอบข้อมูล user จาก localStorage หรือ session
    const checkUserRole = () => {
      try {
        // ตัวอย่างการตรวจสอบจาก localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = localStorage.getItem('userRole') || '';
        
        setCurrentUser(userData);
        
        // ตรวจสอบว่าเป็น admin หรือไม่
        if (userRole === 'admin' || userData.role === 'admin' || userData.isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, []);

  // ตรวจสอบสถานะการอนุมัติ
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!workplaceData) return;
      
      setIsCheckingApproval(true);
      
      try {
        // ใช้ API ที่มีอยู่แล้ว โดยส่ง parameters เพิ่มเติม
        const startDateObj = new Date(workplaceData.startDate);
        const endDateObj = new Date(workplaceData.endDate);
        const month = String(startDateObj.getMonth() + 1).padStart(2, '0');
        const year = startDateObj.getFullYear().toString();
        
        const response = await fetch('http://10.10.110.7:3000/timerecord/checkspecialtshift', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            month: month,
            year: year,
            workplaceId: workplaceData.workplaceId,
            startDate: workplaceData.startDate,
            endDate: workplaceData.endDate,
            checkApproval: true // เพิ่ม flag เพื่อบอกให้ API ตรวจสอบ approval
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // ตรวจสอบว่ามี approval record หรือไม่
          if (data.approvalInfo) {
            setApprovalStatus(data.approvalInfo);
            setIsApproved(data.approvalInfo.status === 'approved');
          }
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      } finally {
        setIsCheckingApproval(false);
      }
    };

    checkApprovalStatus();
  }, [workplaceData]);

  // ฟังก์ชันสำหรับทดสอบ (ใช้ในการพัฒนาเท่านั้น)
  const toggleAdminMode = () => {
    const newAdminStatus = !isAdmin;
    setIsAdmin(newAdminStatus);
    
    // รีเซ็ต secret verification และ approval เมื่อเปลี่ยน admin status
    setIsSecretVerified(false);
    setIsApproved(false);
    
    // อัพเดท localStorage
    const userData = { ...currentUser, role: newAdminStatus ? 'admin' : 'user' };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRole', newAdminStatus ? 'admin' : 'user');
    setCurrentUser(userData);
  };

  // Calculate total salary for employee
  const calculateEmployeeSalary = (employee) => {
    if (!employee || !employee.specialShiftDays) return { total: 0, totalOT: 0, grandTotal: 0 };
    
    const total = employee.specialShiftDays.reduce((sum, day) => {
      return sum + (parseFloat(day.cashOfHoliday) || 0);
    }, 0);
    
    const totalOT = employee.specialShiftDays.reduce((sum, day) => {
      return sum + (parseFloat(day.cashOfHolidayOt) || 0);
    }, 0);
    
    return { total, totalOT, grandTotal: total + totalOT };
  };

  // Calculate workplace summary
  const calculateWorkplaceSummary = () => {
    if (!employees || employees.length === 0) return { totalSpecial: 0, totalOT: 0, grandTotal: 0, totalDays: 0 };
    
    let totalSpecial = 0;
    let totalOT = 0;
    let totalDays = 0;
    
    employees.forEach(employee => {
      const salary = calculateEmployeeSalary(employee);
      totalSpecial += salary.total;
      totalOT += salary.totalOT;
      totalDays += employee.specialShiftDays.length;
    });
    
    return { 
      totalSpecial, 
      totalOT, 
      grandTotal: totalSpecial + totalOT,
      totalDays 
    };
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle print
  const handlePrint = async () => {
    try {
      // Show loading
      const loadingSwal = Swal.fire({
        title: 'กำลังสร้าง PDF...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Generate PDF
      const doc = <WorkplacePDFReport 
        workplaceData={workplaceData} 
        employees={employees} 
        summary={calculateWorkplaceSummary()} 
      />;
      
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `รายงานการจ่ายเงินกะพิเศษ_${workplaceData.workplaceName}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close loading and show success
      loadingSwal.close();
      
      await Swal.fire({
        title: 'สำเร็จ!',
        text: 'ดาวน์โหลดไฟล์ PDF เรียบร้อยแล้ว',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างไฟล์ PDF ได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // Handle employee click
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Close employee detail
  const closeEmployeeDetail = () => {
    setSelectedEmployee(null);
  };

  // Handle approval confirmation
  const handleApprovalConfirmation = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบว่ามีการอนุมัติไปแล้วหรือไม่
    if (approvalStatus && approvalStatus.status === 'approved') {
      await Swal.fire({
        title: 'ไม่สามารถแก้ไขได้',
        html: `<div class="text-start">
          <p>ข้อมูลนี้ได้รับการอนุมัติไปแล้ว</p>
          <hr>
          <p><strong>ผู้อนุมัติ:</strong> ${approvalStatus.approved_by}</p>
          <p><strong>วันที่อนุมัติ:</strong> ${new Date(approvalStatus.approved_at).toLocaleString('th-TH')}</p>
          <p><strong>ยอดเงินรวม:</strong> ${approvalStatus.total_amount?.toLocaleString()} บาท</p>
        </div>`,
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      return;
    }
    
    // ตรวจสอบสิทธิ์ admin ก่อน
    if (!isAdmin) {
      await Swal.fire({
        title: 'ไม่มีสิทธิ์เข้าถึง',
        text: 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถอนุมัติการจ่ายเงินได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    // ถ้ายังไม่ได้ verify secret key ให้ขอรหัสก่อน
    if (!isSecretVerified) {
      const { value: secretKey } = await Swal.fire({
        title: 'ยืนยันตัวตน',
        text: 'กรุณาใส่รหัสลับเพื่อยืนยันการอนุมัติ',
        input: 'password',
        inputPlaceholder: 'ใส่รหัสลับ',
        inputAttributes: {
          maxlength: 10,
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d',
        inputValidator: (value) => {
          if (!value) {
            return 'กรุณาใส่รหัสลับ';
          }
          if (value !== '1234') {
            return 'รหัสลับไม่ถูกต้อง';
          }
        }
      });

      if (!secretKey) {
        return; // ยกเลิกการดำเนินการ
      }

      // รหัสถูกต้อง ตั้งค่า verified
      setIsSecretVerified(true);
      
      await Swal.fire({
        title: 'ยืนยันสำเร็จ!',
        text: 'รหัสลับถูกต้อง คุณสามารถอนุมัติได้แล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      return; // ออกจากฟังก์ชันเพื่อให้ผู้ใช้กดติ๊กอีกครั้ง
    }
    
    // ถ้า verified แล้ว ให้ทำการอนุมัติต่อไป
    const summary = calculateWorkplaceSummary();
    const result = await Swal.fire({
      title: 'ยืนยันการอนุมัติ',
      html: `<div class="text-start">
        <p>คุณต้องการอนุมัติการจ่ายเงินทั้งหมดใช่หรือไม่?</p>
        <hr>
        <p><strong>หน่วยงาน:</strong> ${workplaceData.workplaceName}</p>
        <p><strong>จำนวนพนักงาน:</strong> ${employees.length} คน</p>
        <p><strong>ยอดเงินรวม:</strong> ${summary.grandTotal.toLocaleString()} บาท</p>
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // บันทึกการอนุมัติลงฐานข้อมูล
        const approvalData = {
          workplaceId: workplaceData.workplaceId,
          workplaceName: workplaceData.workplaceName,
          startDate: workplaceData.startDate,
          endDate: workplaceData.endDate,
          totalAmount: summary.grandTotal,
          totalEmployees: employees.length,
          approvedBy: currentUser?.name || currentUser?.username || 'Admin',
          month: String(new Date(workplaceData.startDate).getMonth() + 1).padStart(2, '0'),
          year: new Date(workplaceData.startDate).getFullYear().toString(),
          employeeData: employees.map(emp => {
            const salary = calculateEmployeeSalary(emp);
            return {
              employeeId: emp.employeeId,
              employeeName: emp.employeeName,
              specialShiftAmount: salary.total,
              otAmount: salary.totalOT,
              totalAmount: salary.grandTotal,
              workDays: emp.specialShiftDays.length
            };
          })
        };

        // ส่งข้อมูลการอนุมัติไปยัง API
        const approvalResponse = await fetch('http://10.10.110.7:3000/timerecord/approve-special-shift', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(approvalData)
        });

        if (approvalResponse.ok) {
          const approvalResult = await approvalResponse.json();
          
          setIsApproved(true);
          setApprovalStatus({
            status: 'approved',
            approved_by: approvalData.approvedBy,
            approved_at: new Date().toISOString(),
            total_amount: approvalData.totalAmount
          });
          
          await Swal.fire({
            title: 'อนุมัติสำเร็จ!',
            text: 'การจ่ายเงินได้รับการอนุมัติและบันทึกเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });
        } else {
          const errorData = await approvalResponse.json();
          
          if (errorData.isOverlapping) {
            // แสดงข้อผิดพลาดสำหรับการซ้อนทับ
            const overlappingDates = errorData.overlappingApprovals.map(approval => {
              const startStr = new Date(approval.start_date).toLocaleDateString('th-TH');
              const endStr = new Date(approval.end_date).toLocaleDateString('th-TH');
              return `${startStr} - ${endStr} (อนุมัติโดย: ${approval.approved_by})`;
            }).join('<br>');

            await Swal.fire({
              title: 'ไม่สามารถอนุมัติได้',
              html: `<div class="text-start">
                <p>ช่วงวันที่ที่เลือกซ้อนทับกับการอนุมัติที่มีอยู่แล้ว:</p>
                <hr>
                <div class="alert alert-warning">
                  ${overlappingDates}
                </div>
                <p class="text-muted">
                  <i class="fas fa-info-circle me-2"></i>
                  กรุณาเลือกช่วงวันที่ที่ไม่ซ้อนทับกัน
                </p>
              </div>`,
              icon: 'warning',
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#dc3545'
            });
          } else {
            throw new Error(errorData.message || 'ไม่สามารถบันทึกการอนุมัติได้');
          }
        }
      } catch (error) {
        console.error('Error saving approval:', error);
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: error.message || 'ไม่สามารถบันทึกการอนุมัติได้ กรุณาลองใหม่',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    } else {
      // If user cancels, uncheck the checkbox
      setIsApproved(false);
    }
  };

  if (loading) {
    return (
      <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workplaceData) {
    return (
      <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="container-fluid">
              <div className="alert alert-danger">
                <h4>เกิดข้อผิดพลาด</h4>
                <p>ไม่สามารถโหลดข้อมูลหน่วยงานได้</p>
                <button className="btn btn-primary" onClick={handleBack}>
                  <i className="fas fa-arrow-left me-2"></i>
                  กลับหน้าก่อนหน้า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateWorkplaceSummary();
  const startDateObj = new Date(workplaceData.startDate);
  const endDateObj = new Date(workplaceData.endDate);

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-light rounded p-3 mb-4">
                  <li className="breadcrumb-item">
                    <i className="fas fa-home"></i>{" "}
                    <a href="index.php" className="text-decoration-none">
                      หน้าหลัก
                    </a>
                  </li>
                 
                   <li className="breadcrumb-item active" aria-current="page">
                    ระบบเงินสด
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    รายละเอียดหน่วยงาน
                  </li>
                </ol>
              </nav>

              {/* Header Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                        <div className="p-4 text-white py-3" style={{backgroundColor:"rgb(43,93,142)"}}>
                        <div className="d-flex align-items-center w-100">
                                                <div className="">
                            <h1 className="mb-0 fs-4 fw-bold text-white" style={{float:'none'}}>
                                <i className="fas fa-building me-3"></i>
                                {workplaceData.workplaceName}
                            </h1>
                            <p className="mb-0 opacity-75">
                                รหัสหน่วยงาน: {workplaceData.workplaceId} |
                                ช่วงวันที่ {startDateObj.getDate()}-{endDateObj.getDate()}
                                เดือน {String(startDateObj.getMonth()+1).padStart(2,'0')}
                                ปี {startDateObj.getFullYear()}
                            </p>
                            {currentUser && (
                              <p className="mb-0 opacity-75">
                                <i className="fas fa-user me-1"></i>
                                ผู้ใช้งาน: {currentUser.name || currentUser.username || 'ไม่ระบุ'}
                                {isAdmin && <span className="badge bg-warning text-dark ms-2">Admin</span>}
                                {isAdmin && isSecretVerified && <span className="badge bg-success ms-2">🔑 Verified</span>}
                              </p>
                            )}
                            </div>
                        
                        <button className="btn bg-white ml-auto" onClick={handlePrint}>
                            <i className="fas fa-file-pdf me-1"></i> ดาวน์โหลด PDF
                        </button>
                        
                        {/* ปุ่มทดสอบ Admin Mode (ลบออกเมื่อ deploy จริง) */}
                        <button 
                          className={`btn ms-2 ${isAdmin ? 'btn-success' : 'btn-secondary'}`} 
                          onClick={toggleAdminMode}
                          title="ทดสอบ Admin Mode"
                        >
                          <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user'} me-1`}></i>
                          {isAdmin ? 'Admin' : 'User'}
                        </button>
                    
                    
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Statistics */}
              {/* <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card border-0 shadow-sm h-100 text-white" style={{backgroundColor:"rgb(43,93,142)"}}>
                    <div className="card-body text-center">
                      <i className="fas fa-users fa-2x mb-3"></i>
                      <h4 className="card-title">{workplaceData.totalEmployees}</h4>
                      <p className="card-text">จำนวนพนักงาน</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card border-0 shadow-sm h-100 bg-warning text-dark">
                    <div className="card-body text-center">
                      <i className="fas fa-calendar-alt fa-2x mb-3"></i>
                      <h4 className="card-title">{summary.totalDays}</h4>
                      <p className="card-text">รวมวันทำงาน</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card border-0 shadow-sm h-100 bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-money-bill fa-2x mb-3"></i>
                      <h4 className="card-title">₿ {summary.totalSpecial.toLocaleString()}</h4>
                      <p className="card-text">เงินกะพิเศษรวม</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                  <div className="card border-0 shadow-sm h-100 bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-clock fa-2x mb-3"></i>
                      <h4 className="card-title">₿ {summary.totalOT.toLocaleString()}</h4>
                      <p className="card-text">เงิน OT รวม</p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Total Amount Card */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-white text-center py-4" style={{backgroundColor:"rgb(43,93,142)"}}>
                      <h2 className="mb-0">
                        <i className="fas fa-calculator me-3"></i>
                        ยอดรวมทั้งหมด <br /> {summary.grandTotal.toLocaleString()}
                      </h2>
                      <p className="mb-0 opacity-75">เงินกะพิเศษ + เงิน OT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Details Table */}
              <div className="row">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light border-bottom">
                      <h5 className="card-title mb-0 text-dark">
                        <i className="fas fa-users me-2"></i>
                        รายชื่อพนักงานทั้งหมด
                        <span className="badge ms-2 text-dark">{employees.length} คน</span>
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {employees.map((employee, index) => {
                          const salary = calculateEmployeeSalary(employee);
                          return (
                            <div key={index} className="col-lg-6 col-xl-4 mb-4">
                              <div 
                                className="card border-0 shadow-sm h-100 employee-card"
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                              
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-3px)';
                                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '';
                                }}
                              >
                                <div className="card-header  text-white" >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="card-title mb-0">
                                        <i className="fas fa-user me-2"></i>
                                        {employee.employeeName}
                                      </h6>
                                      <br />
                                      <small className='text-dark'>รหัส: {employee.employeeId}</small>
                                    </div>
                                   
                                  </div>
                                </div>
                                <div className="card-body">
                                  <div className="row text-center mb-3">
                                    <div className="col-6">
                                      <span className="badge bg-warning text-dark w-100">
                                        {employee.specialShiftDays.length} วัน
                                      </span>
                                      <small className="text-muted d-block mt-1">วันทำงาน</small>
                                    </div>
                                    <div className="col-6">
                                      <span className="badge bg-success w-100">
                                         {salary.grandTotal.toLocaleString()}
                                      </span>
                                      <small className="text-muted d-block mt-1">รวมทั้งหมด</small>
                                    </div>
                                  </div>
                                  
                                  <div className="row text-center">
                                    <div className="col-6">
                                      <small className="text-success fw-bold">
                                        <i className="fas fa-money-bill me-1"></i>
                                        {salary.total.toLocaleString()} บาท
                                      </small>
                                      <small className="text-muted d-block">กะพิเศษ</small>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-info fw-bold">
                                        <i className="fas fa-clock me-1"></i>
                                        {salary.totalOT.toLocaleString()} บาท
                                      </small>
                                      <small className="text-muted d-block">OT</small>
                                    </div>
                                  </div>
                                  
                                
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div>
                          
                          <h5 className='text-red'>กรุณาอ่าน!!</h5>
                          <h5>เมื่อกดอนุมัติแล้วจะไม่สามารถแก้ไขข้อมูลได้อีก</h5>
                          
                          {/* แสดง loading state */}
                          {isCheckingApproval && (
                            <div className="alert alert-info d-flex align-items-center mb-3">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              <span>กำลังตรวจสอบสถานะการอนุมัติ...</span>
                            </div>
                          )}
                          
                          {/* แสดงข้อมูลการอนุมัติหากมี */}
                          {approvalStatus && approvalStatus.status === 'approved' && (
                            <div className="alert alert-success mb-3">
                              <h6 className="alert-heading">
                                <i className="fas fa-check-circle me-2"></i>
                                ได้รับการอนุมัติแล้ว
                              </h6>
                              <p className="mb-1"><strong>ผู้อนุมัติ:</strong> {approvalStatus.approved_by}</p>
                              <p className="mb-1"><strong>วันที่อนุมัติ:</strong> {new Date(approvalStatus.approved_at).toLocaleString('th-TH')}</p>
                              <p className="mb-0"><strong>ยอดเงินที่อนุมัติ:</strong> {approvalStatus.total_amount?.toLocaleString()} บาท</p>
                            </div>
                          )}
                          
                          {!isAdmin && !approvalStatus && (
                            <div className="alert alert-warning d-flex align-items-center mb-3">
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              <span>เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถอนุมัติการจ่ายเงินได้</span>
                            </div>
                          )}
                          
                      
                          <div className={`d-flex align-items-center ${isApproved ? 'text-success' : ''} ${!isAdmin || (approvalStatus && approvalStatus.status === 'approved') ? 'opacity-50' : ''}`}>
                            <input 
                              type="checkbox" 
                              className='input me-2' 
                              id="approvalCheckbox"
                              checked={isApproved}
                              onChange={handleApprovalConfirmation}
                              disabled={!isAdmin || (approvalStatus && approvalStatus.status === 'approved')}
                              style={{ cursor: (isAdmin && (!approvalStatus || approvalStatus.status !== 'approved')) ? 'pointer' : 'not-allowed' }}
                            />
                            <label className='mb-0' htmlFor="approvalCheckbox" style={{ cursor: (isAdmin && (!approvalStatus || approvalStatus.status !== 'approved')) ? 'pointer' : 'not-allowed' }}>
                              {isApproved || (approvalStatus && approvalStatus.status === 'approved') ? (
                                <>
                                  <i className="fas fa-check-circle me-2"></i>
                                  อนุมัติการจ่ายเงินทั้งหมดแล้ว
                                </>
                              ) : (
                                <>
                                  {!isAdmin && <i className="fas fa-lock me-2 text-warning"></i>}
                                  {isAdmin && !isSecretVerified && <i className="fas fa-key me-2 text-info"></i>}
                                  {isAdmin && isSecretVerified && <i className="fas fa-shield-alt me-2 text-success"></i>}
                                  ยืนยันการอนุมัติการจ่ายเงินทั้งหมด
                                  {!isAdmin && <span className="text-muted ms-2">(เฉพาะ Admin)</span>}
                                  {isAdmin && !isSecretVerified && <span className="text-info ms-2">(ต้องใส่รหัสลับ)</span>}
                                  {isAdmin && isSecretVerified && <span className="text-success ms-2">(พร้อมอนุมัติ)</span>}
                                </>
                              )}
                            </label>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Detail Modal */}
              {selectedEmployee && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                          <i className="fas fa-user-circle me-2"></i>
                          รายละเอียดพนักงาน: {selectedEmployee.employeeName}
                        </h5>
                        <button 
                          type="button" 
                          className="btn-close btn-close-white" 
                          onClick={closeEmployeeDetail}
                        ></button>
                      </div>
                      <div className="modal-body">
                        {/* Employee Info */}
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <div className="card bg-light">
                              <div className="card-body">
                                <h6 className="card-title text-primary">
                                  <i className="fas fa-id-card me-2"></i>
                                  ข้อมูลพนักงาน
                                </h6>
                                <p className="mb-1"><strong>ชื่อ:</strong> {selectedEmployee.employeeName}</p>
                                <p className="mb-1"><strong>รหัส:</strong> {selectedEmployee.employeeId}</p>
                                <p className="mb-0"><strong>หน่วยงาน:</strong> {workplaceData.workplaceName}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card bg-light">
                              <div className="card-body">
                                <h6 className="card-title text-success">
                                  <i className="fas fa-calculator me-2"></i>
                                  สรุปเงินสด
                                </h6>
                                {(() => {
                                  const empSalary = calculateEmployeeSalary(selectedEmployee);
                                  return (
                                    <>
                                      <p className="mb-1">
                                        <strong>จำนวนวันทำกะพิเศษ:</strong> 
                                        <span className="badge bg-warning text-dark ms-2">
                                          {selectedEmployee.specialShiftDays.length} วัน
                                        </span>
                                      </p>
                                      <p className="mb-1">
                                        <strong>เงินกะพิเศษรวม:</strong> 
                                        <span className="badge bg-success ms-2">
                                          ₿ {empSalary.total.toLocaleString()}
                                        </span>
                                      </p>
                                      <p className="mb-0">
                                        <strong>เงิน OT รวม:</strong> 
                                        <span className="badge bg-info ms-2">
                                          ₿ {empSalary.totalOT.toLocaleString()}
                                        </span>
                                      </p>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Special Shift Days Detail */}
                        <div className="card">
                          <div className="card-header bg-gradient-primary text-white">
                            <h6 className="mb-0">
                              <i className="fas fa-calendar-alt me-2"></i>
                              รายละเอียดวันทำกะพิเศษ
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                  <tr>
                                    <th width="20%">
                                      <i className="fas fa-calendar me-1"></i>
                                      วันที่
                                    </th>
                                    <th width="30%">
                                      <i className="fas fa-money-bill me-1"></i>
                                      เงินกะพิเศษ
                                    </th>
                                    <th width="30%">
                                      <i className="fas fa-clock me-1"></i>
                                      เงิน OT
                                    </th>
                                    <th width="20%">
                                      <i className="fas fa-calculator me-1"></i>
                                      รวม
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedEmployee.specialShiftDays.map((day, index) => {
                                    const specialSalary = parseFloat(day.cashOfHoliday) || 0;
                                    const otSalary = parseFloat(day.cashOfHolidayOt) || 0;
                                    const totalDay = specialSalary + otSalary;
                                    
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <span className="badge bg-primary">
                                            {day.date}
                                          </span>
                                        </td>
                                        <td>
                                          {specialSalary > 0 ? (
                                            <span className="text-success fw-bold">
                                              ₿ {specialSalary.toLocaleString()}
                                            </span>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>
                                        <td>
                                          {otSalary > 0 ? (
                                            <span className="text-info fw-bold">
                                              ₿ {otSalary.toLocaleString()}
                                            </span>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>
                                        <td>
                                          <span className="badge bg-warning text-dark">
                                            ₿ {totalDay.toLocaleString()}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                <tfoot className="table-secondary">
                                  {(() => {
                                    const empSalary = calculateEmployeeSalary(selectedEmployee);
                                    return (
                                      <tr>
                                        <th>รวมทั้งหมด</th>
                                        <th>
                                          <span className="text-success fw-bold">
                                            ₿ {empSalary.total.toLocaleString()}
                                          </span>
                                        </th>
                                        <th>
                                          <span className="text-info fw-bold">
                                            ₿ {empSalary.totalOT.toLocaleString()}
                                          </span>
                                        </th>
                                        <th>
                                          <span className="badge bg-success fs-6">
                                            ₿ {empSalary.grandTotal.toLocaleString()}
                                          </span>
                                        </th>
                                      </tr>
                                    );
                                  })()}
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeEmployeeDetail}>
                          <i className="fas fa-times me-2"></i>
                          ปิด
                        </button>
                        <button type="button" className="btn btn-primary">
                          <i className="fas fa-print me-2"></i>
                          พิมพ์รายงาน
                        </button>
                      </div>
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

export default WorkplaceSpecialShiftDetail;
