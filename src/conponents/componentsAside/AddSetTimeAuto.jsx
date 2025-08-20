import React, { useState, useEffect } from 'react';
import './addsettimeauto.css';
import "../editwindowcss.css";

function AddSetTimeAuto() {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedWorkplaceCode, setSelectedWorkplaceCode] = useState('');
    const [selectedWorkplaceName, setSelectedWorkplaceName] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
    const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
    const [staffId, setStaffId] = useState(""); //รหัสพนักงาน
    const [staffFullName, setStaffFullName] = useState(""); //ชื่อเต็มพนักงาน
    const [searchEmployeeId, setSearchEmployeeId] = useState("");
    const [searchEmployeeName, setSearchEmployeeName] = useState("");
    const [month, setMonth] = useState("01");
    const [year, setYear] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [files, setFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    
    // Mock data - คุณจะต้องแทนที่ด้วยข้อมูลจริงจาก API
    const [workplaceList, setWorkplaceList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    
    // Mock variables - ควรได้มาจาก props หรือ context
    const workplaceIdSend = "";
    const workplaceNameSend = "";
    
    const handleSearch = (workplaceId, workplaceName) => {
        // ฟังก์ชันค้นหา - ควรเชื่อมต่อกับ API
        console.log('Searching for:', { workplaceId, workplaceName });
    };

    const months = [
        { value: '01', label: 'มกราคม' },
        { value: '02', label: 'กุมภาพันธ์' },
        { value: '03', label: 'มีนาคม' },
        { value: '04', label: 'เมษายน' },
        { value: '05', label: 'พฤษภาคม' },
        { value: '06', label: 'มิถุนายน' },
        { value: '07', label: 'กรกฎาคม' },
        { value: '08', label: 'สิงหาคม' },
        { value: '09', label: 'กันยายน' },
        { value: '10', label: 'ตุลาคม' },
        { value: '11', label: 'พฤศจิกายน' },
        { value: '12', label: 'ธันวาคม' }
    ];
      useEffect(() => {
        // If either workplaceIdSend or workplaceNameSend is present, call handleSearch
        if (workplaceIdSend || workplaceNameSend) {
          setSearchWorkplaceId(workplaceIdSend || "");
          setSearchWorkplaceName(workplaceNameSend || "");
    
          // Call the handleSearch function
          handleSearch(workplaceIdSend, workplaceNameSend);
        }
      }, [workplaceIdSend, workplaceNameSend, handleSearch]);
    
    const handleStaffIdChange = (e) => {
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
      setStaffFullName("");
      setSearchEmployeeName("");
    }
  };


    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragOver(false);
    };
     const handleStaffNameChange = (e) => {
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

    const handleSubmit = () => {
        console.log('ข้อมูลที่ส่ง:', {
            month: selectedMonth,
            year: selectedYear,
            workplaceCode: selectedWorkplaceCode,
            workplaceName: selectedWorkplaceName,
            department: selectedDepartment,
            files: files
        });
    };

    return (
        <div className="editlaout">
            <div className="content-wrapper upload-content">
                <div className="data-form">
                    <h2 className="form-title">ข้อมูลไฟล์</h2>
                    <p className="form-subtitle">กรุณากรอกข้อมูลและเลือกไฟล์ที่ต้องการอัปโหลด</p>
                    
                    <div className="form-container">
                        {/* แถวที่ 1: ข้อมูลหน่วยงาน */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="workplaceCode">รหัสหน่วยงาน</label>
                                <input
                            type="text"
                            className="form-control"
                            id="searchWorkplaceId"
                            list="workplaceIds" // Associate the datalist with the input
                            placeholder="รหัสหน่วยงาน"
                            value={searchWorkplaceId}
                            onChange={(e) =>
                              setSearchWorkplaceId(e.target.value)
                            }
                            onInput={(e) => {
                              // Remove any non-digit characters
                            
                            }}
                          />
                          <datalist id="workplaceIds">
                            {workplaceList.map((workplace) => (
                              <option
                                key={workplace.workplaceId}
                                value={workplace.workplaceId}
                              >
                                {workplace.workplaceId}
                              </option>
                            ))}
                          </datalist>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="workplaceName">ชื่อหน่วยงาน</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchWorkplaceName"
                                    placeholder="ชื่อหน่วยงาน"
                                    value={searchWorkplaceName}
                                    onChange={(e) =>
                                      setSearchWorkplaceName(e.target.value)
                                    }
                                />
                            </div>
                            
                           
                        </div>

                        {/* แถวที่ 2: ข้อมูลวันที่ */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="month">เดือน</label>
                                <select 
                                    id="month"
                                    name="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">เลือกเดือน</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="year">ปี</label>
                                <select 
                                    id="year"
                                    name="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">เลือกปี</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year + 543}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ช่องว่างสำหรับจัดเรียง */}
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div className="upload-section">
                        <label className="upload-label">อัปโหลดไฟล์</label>
                        
                        <div 
                            className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="upload-icon-large">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="upload-text">ลากไฟล์มาวางที่นี่</h3>
                            <p className="upload-description">หรือคลิกเพื่อเลือกไฟล์ (สูงสุด 10 ไฟล์)</p>
                            <p className="upload-formats">รองรับ: XLS, XLSX</p>
                            
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                                onChange={handleFileSelect}
                                className="file-input"
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                        </div>

                        {files.length > 0 && (
                            <div className="file-list">
                                <h4>ไฟล์ที่เลือก:</h4>
                                {files.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button 
                            onClick={() => document.getElementById('file-upload').click()}
                            className="upload-button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSetTimeAuto;