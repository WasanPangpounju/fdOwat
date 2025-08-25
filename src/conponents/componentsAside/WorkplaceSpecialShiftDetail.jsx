import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function WorkplaceSpecialShiftDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workplaceData, setWorkplaceData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  // Calculate total salary for employee
  const calculateEmployeeSalary = (employee) => {
    if (!employee || !employee.specialShiftDays) return { total: 0, totalOT: 0, grandTotal: 0 };
    
    const total = employee.specialShiftDays.reduce((sum, day) => {
      return sum + (parseFloat(day.specialtSalary) || 0);
    }, 0);
    
    const totalOT = employee.specialShiftDays.reduce((sum, day) => {
      return sum + (parseFloat(day.specialtSalaryOT) || 0);
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
  const handlePrint = () => {
    window.print();
  };

  // Handle employee click
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Close employee detail
  const closeEmployeeDetail = () => {
    setSelectedEmployee(null);
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
                            </div>
                        
                        <button className="btn bg-white ml-auto" onClick={handlePrint}>
                            <i className="fas fa-print me-1"></i> พิมพ์
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
                                    const specialSalary = parseFloat(day.specialtSalary) || 0;
                                    const otSalary = parseFloat(day.specialtSalaryOT) || 0;
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
