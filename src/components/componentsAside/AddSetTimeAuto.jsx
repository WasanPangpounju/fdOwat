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
            <div className="content-wrapper">
                <div className="data-form modern-form">
                    {/* Header Section */}
                    <div className="form-header">
                        <div className="">
                            <div className="">
                               
                            </div>
                            <div className="">
                                <h2 className="form-title">อัปโหลดข้อมูลเวลาทำงาน</h2>
                                <p className="form-subtitle">กรุณากรอกข้อมูลหน่วยงานและเลือกไฟล์ Excel ที่ต้องการนำเข้า</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Content */}
                    <div className="form-content">
                        {/* Card 1: ข้อมูลหน่วยงาน */}
                        <div className="form-card">
                            <div className="card-header">
                                
                                <h3 className="card-title">ข้อมูลหน่วยงาน</h3>
                            </div>
                            
                            <div className="card-content">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="workplaceCode" className="form-label">
                                            <span className="label-text">รหัสหน่วยงาน</span>
                                            <span className="label-required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <div className="input-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-input"
                                                id="searchWorkplaceId"
                                                list="workplaceIds"
                                                placeholder="กรอกหรือเลือกรหัสหน่วยงาน"
                                                value={searchWorkplaceId}
                                                onChange={(e) => setSearchWorkplaceId(e.target.value)}
                                                onInput={(e) => {
                                                    // Remove any non-digit characters if needed
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
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="workplaceName" className="form-label">
                                            <span className="label-text">ชื่อหน่วยงาน</span>
                                            <span className="label-required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <div className="input-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-input"
                                                id="searchWorkplaceName"
                                                placeholder="กรอกชื่อหน่วยงาน"
                                                value={searchWorkplaceName}
                                                onChange={(e) => setSearchWorkplaceName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: ข้อมูลระยะเวลา */}
                        <div className="form-card">
                            <div className="card-header">
                                
                                <h3 className="card-title">ระยะเวลา</h3>
                            </div>
                            
                            <div className="card-content">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="month" className="form-label">
                                            <span className="label-text">เดือน</span>
                                            <span className="label-required">*</span>
                                        </label>
                                        <div className="select-wrapper">
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
                                            <div className="select-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="year" className="form-label">
                                            <span className="label-text">ปี พ.ศ.</span>
                                            <span className="label-required">*</span>
                                        </label>
                                        <div className="select-wrapper">
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
                                            <div className="select-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: อัปโหลดไฟล์ */}
                        <div className="form-card upload-card">
                            <div className="card-header">
                               
                                <h3 className="card-title">อัปโหลดไฟล์ Excel</h3>
                            </div>
                            
                            <div className="card-content">
                                <div 
                                    className={`upload-area ${isDragOver ? 'drag-over' : ''} ${files.length > 0 ? 'has-files' : ''}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <div className="upload-content">
                                        
                                        <h3 className="upload-title">ลากไฟล์มาวางที่นี่</h3>
                                        <p className="upload-subtitle">หรือคลิกเพื่อเลือกไฟล์จากเครื่องของคุณ</p>
                                        <div className="upload-info">
                                            <div className="upload-formats">
                                                <span className="format-badge">XLS</span>
                                                <span className="format-badge">XLSX</span>
                                            </div>
                                            <p className="upload-limit">สูงสุด 1 ไฟล์</p>
                                        </div>
                                    </div>
                                    
                                    <input
                                        type="file"
                                        multiple
                                        accept=".xls,.xlsx"
                                        onChange={handleFileSelect}
                                        className="file-input"
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="file-list">
                                        <div className="file-list-header">
                                            <h4 className="file-list-title">ไฟล์ที่เลือก ({files.length} ไฟล์)</h4>
                                            <button 
                                                className="clear-files-btn"
                                                onClick={() => setFiles([])}
                                            >
                                                ล้างทั้งหมด
                                            </button>
                                        </div>
                                        <div className="file-items">
                                            {files.map((file, index) => (
                                                <div key={index} className="file-item">
                                                    <div className="file-icon">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                    <div className="file-details">
                                                        <span className="file-name">{file.name}</span>
                                                        <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                    <button 
                                                        className="remove-file-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newFiles = files.filter((_, i) => i !== index);
                                                            setFiles(newFiles);
                                                        }}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button 
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSelectedMonth('');
                                    setSelectedYear('');
                                    setSearchWorkplaceId('');
                                    setSearchWorkplaceName('');
                                    setFiles([]);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                ล้างข้อมูล
                            </button>
                            <button 
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!selectedMonth || !selectedYear || !searchWorkplaceId || files.length === 0}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 14C19.5523 14 20 13.5523 20 13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13C18 13.5523 18.4477 14 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 10L2 6L6 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 18H12C10.8954 18 10 17.1046 10 16V13C10 11.8954 10.8954 11 12 11H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 6H12C13.1046 6 14 6.89543 14 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                นำเข้าข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSetTimeAuto;