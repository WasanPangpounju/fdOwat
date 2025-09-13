import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
// import AllWorkplacesSummaryPDFReport from '../PDF/AllWorkplacesSummaryPDFReport';
import Swal from 'sweetalert2';

function SpecialShiftCash() {
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
      // แปลงวันที่ให้อยู่ในรูปแบบ month/year
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const startYear = startDateObj.getFullYear().toString();
      
      // สร้าง array ของวันที่ในช่วงที่เลือก
      const selectedDates = [];
      const currentDate = new Date(startDate);
      const endDateCheck = new Date(endDate);
      
      while (currentDate <= endDateCheck) {
        selectedDates.push(String(currentDate.getDate()));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log('Searching with:', { 
        startDate, 
        endDate,
        month: startMonth,
        year: startYear,
        selectedDates: selectedDates
      });

      const response = await fetch('http://10.10.110.7:3000/timerecord/checkspecialtshift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: startMonth,
          year: startYear
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // กรองข้อมูลตามช่วงวันที่ที่เลือก
        if (data.workplaces && data.workplaces.length > 0) {
          const filteredWorkplaces = data.workplaces.map(workplace => {
            const filteredEmployees = workplace.employees.map(employee => {
              const filteredDays = employee.specialShiftDays.filter(day => {
                // แยกวันที่จาก format "21/07/2568" เพื่อเปรียบเทียบ
                const dayNumber = day.date.split('/')[0];
                return selectedDates.includes(dayNumber);
              });
              
              return {
                ...employee,
                specialShiftDays: filteredDays
              };
            }).filter(employee => employee.specialShiftDays.length > 0); // เก็บเฉพาะพนักงานที่มีวันทำงานในช่วงที่เลือก
            
            return {
              ...workplace,
              employees: filteredEmployees,
              totalEmployeesWithSpecialShift: filteredEmployees.length
            };
          }).filter(workplace => workplace.employees.length > 0); // เก็บเฉพาะหน่วยงานที่มีพนักงานทำงานในช่วงที่เลือก
          
          // อัปเดตข้อมูลสรุป
          const totalEmployees = filteredWorkplaces.reduce((sum, wp) => sum + wp.totalEmployeesWithSpecialShift, 0);
          const filteredData = {
            ...data,
            workplaces: filteredWorkplaces,
            totalWorkplacesWithSpecialShift: filteredWorkplaces.length,
            totalEmployeesWithSpecialShift: totalEmployees,
            summary: filteredWorkplaces.length > 0 
              ? `ช่วงวันที่ ${startDateObj.getDate()}-${endDateObj.getDate()} เดือน ${startMonth} ปี ${startYear} มี ${filteredWorkplaces.length} หน่วยงานที่มีกะพิเศษ รวม ${totalEmployees} คน`
              : `ช่วงวันที่ ${startDateObj.getDate()}-${endDateObj.getDate()} เดือน ${startMonth} ปี ${startYear} ไม่มีหน่วยงานที่มีกะพิเศษ`
          };
          
          setSearchResults(filteredData);
        } else {
          setSearchResults(data);
        }
        
        console.log('Filtered search results:', data);
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
        
        if (approvalData.approvalInfo && approvalData.approvalInfo.status === 'approved') {
          // แสดง modal แจ้งเตือนว่าได้รับการอนุมัติแล้ว
          const result = await Swal.fire({
            title: 'ข้อมูลได้รับการอนุมัติแล้ว',
            html: `<div class="text-start">
              <p>ข้อมูลช่วงวันที่นี้ได้รับการอนุมัติไปแล้ว</p>
              <hr>
              <p><strong>หน่วยงาน:</strong> ${workplace.workplaceName}</p>
              <p><strong>ผู้อนุมัติ:</strong> ${approvalData.approvalInfo.approved_by}</p>
              <p><strong>วันที่อนุมัติ:</strong> ${new Date(approvalData.approvalInfo.approved_at).toLocaleString('th-TH')}</p>
              <p><strong>ยอดเงินที่อนุมัติ:</strong> ${approvalData.approvalInfo.total_amount?.toLocaleString()} บาท</p>
            </div>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'ดูรายละเอียดแบบอ่านอย่างเดียว',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#2b5d8e',
            cancelButtonColor: '#6c757d'
          });
          
          if (!result.isConfirmed) {
            return; // ถ้าผู้ใช้ยกเลิก ไม่ต้องไปหน้ารายละเอียด
          }
        }

        // ตรวจสอบการซ้อนทับช่วงวันที่
        if (approvalData.overlappingApprovals && approvalData.overlappingApprovals.length > 0) {
          const overlappingDates = approvalData.overlappingApprovals.map(approval => {
            const startStr = new Date(approval.start_date).toLocaleDateString('th-TH');
            const endStr = new Date(approval.end_date).toLocaleDateString('th-TH');
            return `${startStr} - ${endStr}`;
          }).join(', ');

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

  // Handle generate summary PDF for all workplaces
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
      const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const startYear = startDateObj.getFullYear();
      const filename = `รายงานสรุปกะพิเศษทุกหน่วยงาน_${startDateObj.getDate()}-${endDateObj.getDate()}_${startMonth}_${startYear}.pdf`;
      
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
                        ข้อมูลการจ่ายเงินสด
                      </h1>
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
                                <button 
                                  type="button"
                                  className="btn btn-success"
                                  onClick={handleGenerateSummaryPDF}
                                  style={{backgroundColor:"#28a745"}}
                                >
                                  <i className="fas fa-file-pdf me-2"></i>
                                  ออกรายงาน PDF สรุปทุกหน่วยงาน
                                </button>
                              )}
                             
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-light border-bottom">
                      <h5 className="card-title mb-0 text-dark">
                        <i className="fas fa-list me-2 text-success"></i>
                        ผลการค้นหา
                        {searchResults && (
                          <span className="badge text-black ms-2">
                            {searchResults.totalWorkplacesWithSpecialShift} หน่วยงาน
                          </span>
                        )}
                      </h5>
                    </div>
                    <div className="card-body">
                      {!searchResults ? (
                        <div className="text-center py-5">
                          <i className="fas fa-search fa-3x text-muted mb-3"></i>
                          <p className="text-muted fs-5">กรุณาค้นหาข้อมูลเพื่อแสดงผลลัพธ์</p>
                        </div>
                      ) : (
                        <div>
                          {/* Summary Section */}
                          <div className="alert alert-info mb-4">
                            <h6 className="alert-heading">
                              <i className="fas fa-info-circle me-2"></i>
                              สรุปข้อมูล
                            </h6>
                            <p className="mb-0">{searchResults.summary}</p>
                          </div>

                          {/* Inventory Cards */}
                          {searchResults.workplaces && searchResults.workplaces.length > 0 ? (
                            <div className="row">
                              {searchResults.workplaces.map((workplace, workplaceIndex) => (
                                <div key={workplaceIndex} className="col-lg-6 col-xl-4 mb-5">
                                  <div 
                                    className="card border-0 shadow-sm h-100 workplace-card"
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onClick={() => handleWorkplaceClick(workplace)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-5px)';
                                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = '';
                                    }}
                                  >
                                    <div 
                                      className="card-header text-white"
                                      style={{ 
                                        background: 'linear-gradient(135deg, rgb(43,93,142) 0%, rgb(60,110,160) 100%)',
                                        borderRadius: '0.375rem 0.375rem 0 0'
                                      }}
                                    >
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div style={{ flex: 1, minWidth: 0, paddingRight: '15px' }}>
                                          <h6 
                                            className="card-title mb-2" 
                                            title={workplace.workplaceName}
                                            style={{ 
                                              fontSize: '1rem',
                                              fontWeight: '600',
                                              color: '#ffffff',
                                              lineHeight: '1.3',
                                              wordWrap: 'break-word',
                                              overflowWrap: 'break-word'
                                            }}
                                          >
                                            <i className="fas fa-building me-2"></i>
                                            {workplace.workplaceName}
                                          </h6>
                                          <small 
                                            className='text-white-50'
                                            style={{ 
                                              fontSize: '0.85rem',
                                              opacity: '0.9'
                                            }}
                                          >
                                            หน่วยงาน: {workplace.workplaceId}
                                          </small>
                                        </div>
                                        <div style={{ flexShrink: 0 }}>
                                          <i 
                                            className="fas fa-arrow-right" 
                                            style={{ 
                                              fontSize: '1.2rem',
                                              color: '#ffffff',
                                              opacity: '0.8'
                                            }}
                                          ></i>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="card-body">
                                      <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted">พนักงานกะพิเศษ</span>
                                        <span className="badge text-dark fs-6">
                                          {workplace.totalEmployeesWithSpecialShift} คน
                                        </span>
                                      </div>

                                      {/* Employee Summary List */}
                                      <div className="employee-summary">
                                        <h6 className=" mb-3" style={{ color: 'rgb(43,93,142)' }}>
                                          <i className="fas fa-users me-2"></i>
                                          รายชื่อพนักงาน
                                        </h6>
                                        {workplace.employees && workplace.employees.slice(0, 3).map((employee, empIndex) => (
                                          <div key={empIndex} className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                              <small className="fw-bold text-dark">
                                                <i className="fas fa-user me-1 " style={{color: 'rgb(43,93,142)'}}></i>
                                                {employee.employeeName}
                                              </small>
                                              <br />
                                              <small className="text-muted">
                                                รหัส: {employee.employeeId}
                                              </small>
                                            </div>
                                            <small className="badge text-dark" >
                                              {employee.specialShiftDays.length} วัน
                                            </small>
                                          </div>
                                        ))}
                                        
                                        {workplace.employees && workplace.employees.length > 3 && (
                                          <div className="text-center mt-3">
                                            <small className="text-primary">
                                              <i className="fas fa-ellipsis-h me-1"></i>
                                              และอีก {workplace.employees.length - 3} คน
                                            </small>
                                          </div>
                                        )}
                                        
                                        <div className="text-center mt-3">
                                          <small className="fw-bold">
                                            <i className="fas fa-mouse-pointer me-1"></i>
                                            คลิกเพื่อดูรายละเอียดทั้งหมด
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-5">
                              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                              <h5 className="text-muted">ไม่พบข้อมูลกะพิเศษ</h5>
                              <p className="text-muted">ไม่มีหน่วยงานที่มีพนักงานทำกะพิเศษในช่วงเวลาที่เลือก</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
          
  );
}

export default SpecialShiftCash;
