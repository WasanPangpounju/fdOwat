import React, { useState, useEffect } from 'react';

function SpecialShiftCash() {
  // State variables
  const [staffId, setStaffId] = useState('');
  const [staffFullName, setStaffFullName] = useState('');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeList, setEmployeeList] = useState([]);

  // Generate years array (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  // Handle search function
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', { staffId, staffFullName, startDate, endDate });
    // Add your search logic here
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
                            <div className="d-grid gap-2  justify-content-md-center">
                              <button 
                                type="submit" 
                                className="btn btn-primary "
                                style={{backgroundColor:"rgb(43,93,142)"}}
                              >
                                <i className="fas fa-search me-2"></i>
                                ค้นหาข้อมูล
                              </button>
                             
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section (Placeholder) */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-light border-bottom">
                      <h5 className="card-title mb-0 text-dark">
                        <i className="fas fa-list me-2 text-success"></i>
                        ผลการค้นหา
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="text-center py-5">
                        <i className="fas fa-search fa-3x text-muted mb-3"></i>
                        <p className="text-muted fs-5">กรุณาค้นหาข้อมูลเพื่อแสดงผลลัพธ์</p>
                      </div>
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
