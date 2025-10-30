import React, { useEffect, useState } from 'react';
import axios from 'axios';
import employeeWelfareService from '../../services/employeeWelfareService';
import endpoint from '../../config';
import EmployeesSelected from './EmployeesSelected';

function AddEditSalaryEmployeeNew() {
    const bordertable = {
        borderLeft: '2px solid #000'
    };

    // Employee search states
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    // Selected employee states
    const [employeeId, setEmployeeId] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    // Period selection states
    const [globalSelectedMonth, setGlobalSelectedMonth] = useState('');
    const [globalSelectedYear, setGlobalSelectedYear] = useState('');

    // Form states for adding salary items
    const [addSalaryId, setAddSalaryId] = useState('');
    const [addSalaryName, setAddSalaryName] = useState('');
    const [addSalary, setAddSalary] = useState('');
    const [roundOfSalary, setRoundOfSalary] = useState('');
    const [staffType, setStaffType] = useState('');
    const [message, setMessage] = useState('');

    // Form states for deduction items
    const [minusId, setMinusId] = useState('');
    const [misnusName, setMisnusName] = useState('');
    const [minusSalary, setMinusSalary] = useState('');
    const [payType, setPayType] = useState('');
    const [installment, setInstallment] = useState('1');
    const [minusStaffType, setMinusStaffType] = useState('');

    // Welfare data states
    const [currentWelfareData, setCurrentWelfareData] = useState(null);
    const [addList, setAddList] = useState([]);
    const [deductList, setDeductList] = useState([]);

    // Reference data
    const [searchAddSalaryList, setSearchAddSalaryList] = useState([]);
    const [searchDeductSalaryList, setSearchDeductSalaryList] = useState([]);

    // Initialize with current month/year
    useEffect(() => {
        const currentPeriod = employeeWelfareService.getCurrentPeriod();
        setGlobalSelectedMonth(currentPeriod.month);
        setGlobalSelectedYear(currentPeriod.year);

        // Get search data from localStorage
        const storedEmployeeId = localStorage.getItem('searchEmployeeId');
        setSearchEmployeeId(storedEmployeeId || '');

        // Load reference data for add/deduct salaries
        loadReferenceData();
    }, []);

    // Load reference data for dropdowns
    const loadReferenceData = async () => {
        try {
            // You can modify this to load your reference data from appropriate endpoints
            const addSalaryResponse = await axios.get(endpoint + '/basicsetting/addsalary');
            const deductSalaryResponse = await axios.get(endpoint + '/basicsetting/deductsalary');
            
            if (addSalaryResponse.data) {
                setSearchAddSalaryList(addSalaryResponse.data);
            }
            
            if (deductSalaryResponse.data) {
                setSearchDeductSalaryList(deductSalaryResponse.data);
            }
        } catch (error) {
            console.error('Error loading reference data:', error);
        }
    };

    // Load welfare data when employee and period change
    useEffect(() => {
        if (employeeId && globalSelectedMonth && globalSelectedYear) {
            loadWelfareData();
        }
    }, [employeeId, globalSelectedMonth, globalSelectedYear]);

    // Auto-fill name when ID is selected
    useEffect(() => {
        const foundObject = searchAddSalaryList.find(item => item.id === addSalaryId);
        if (foundObject) {
            setAddSalaryName(foundObject.name);
        }
    }, [addSalaryId, searchAddSalaryList]);

    useEffect(() => {
        const foundObject = searchDeductSalaryList.find(item => item.id === minusId);
        if (foundObject) {
            setMisnusName(foundObject.name);
        }
    }, [minusId, searchDeductSalaryList]);

    // Load welfare data for the selected employee and period
    const loadWelfareData = async () => {
        try {
            const welfareData = await employeeWelfareService.getSpecificWelfare(
                employeeId, 
                globalSelectedYear, 
                globalSelectedMonth
            );
            
            if (welfareData) {
                setCurrentWelfareData(welfareData);
                setAddList(welfareData.addList || []);
                setDeductList(welfareData.deductList || []);
            } else {
                // No data found for this period
                setCurrentWelfareData(null);
                setAddList([]);
                setDeductList([]);
            }
        } catch (error) {
            if (error.message.includes('404')) {
                // No welfare record found for this period - that's okay
                setCurrentWelfareData(null);
                setAddList([]);
                setDeductList([]);
            } else {
                console.error('Error loading welfare data:', error);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูลสวัสดิการ');
            }
        }
    };

    // Search employees
    const handleSearch = async (event) => {
        event.preventDefault();
        
        try {
            const searchData = {
                employeeId: searchEmployeeId,
                name: searchEmployeeName,
                idCard: '',
                workPlace: '',
            };

            const response = await axios.post(endpoint + '/employee/search', searchData);
            
            if (response.data && response.data.employees) {
                setSearchResult(response.data.employees);
            } else {
                setSearchResult([]);
                alert('ไม่พบข้อมูลพนักงาน');
            }
        } catch (error) {
            console.error('Error searching employees:', error);
            alert('เกิดข้อผิดพลาดในการค้นหาพนักงาน');
        }
    };

    // Handle employee selection from search results
    const handleClickResult = async (emp) => {
        setEmployeeId(emp.employeeId);
        setName(emp.name);
        setLastName(emp.lastName);
        setSearchResult([]); // Clear search results
    };

    // Add salary item
    const handleAddSalaryItem = async () => {
        if (!employeeId) {
            alert('กรุณาเลือกพนักงานก่อน');
            return;
        }

        if (!addSalaryId || !addSalaryName || !addSalary) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try {
            const newItem = {
                id: employeeWelfareService.generateItemId(),
                name: addSalaryName,
                amount: parseFloat(addSalary),
                roundOfSalary: roundOfSalary,
                staffType: staffType,
                message: message,
                effectiveMonth: globalSelectedMonth,
                effectiveYear: globalSelectedYear
            };

            if (currentWelfareData) {
                // Update existing welfare record
                await employeeWelfareService.addSalaryItem(
                    employeeId, 
                    globalSelectedYear, 
                    globalSelectedMonth, 
                    newItem
                );
            } else {
                // Create new welfare record
                const welfareData = {
                    employeeId: employeeId,
                    employeeName: `${name} ${lastName}`,
                    year: globalSelectedYear,
                    month: globalSelectedMonth,
                    createBy: 'system', // You can modify this to use actual user
                    addList: [newItem],
                    deductList: []
                };
                
                await employeeWelfareService.createOrUpdateWelfare(welfareData);
            }

            // Reload data and clear form
            await loadWelfareData();
            clearAddSalaryForm();
            alert('เพิ่มรายการเงินเพิ่มสำเร็จ');
            
        } catch (error) {
            console.error('Error adding salary item:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มรายการเงินเพิ่ม');
        }
    };

    // Add deduct item
    const handleAddDeductItem = async () => {
        if (!employeeId) {
            alert('กรุณาเลือกพนักงานก่อน');
            return;
        }

        if (!minusId || !misnusName || !minusSalary) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try {
            const newItem = {
                id: employeeWelfareService.generateItemId(),
                name: misnusName,
                amount: parseFloat(minusSalary),
                payType: payType,
                installment: parseInt(installment),
                message: minusStaffType,
                effectiveMonth: globalSelectedMonth,
                effectiveYear: globalSelectedYear
            };

            if (currentWelfareData) {
                // Update existing welfare record
                await employeeWelfareService.addDeductItem(
                    employeeId, 
                    globalSelectedYear, 
                    globalSelectedMonth, 
                    newItem
                );
            } else {
                // Create new welfare record
                const welfareData = {
                    employeeId: employeeId,
                    employeeName: `${name} ${lastName}`,
                    year: globalSelectedYear,
                    month: globalSelectedMonth,
                    createBy: 'system', // You can modify this to use actual user
                    addList: [],
                    deductList: [newItem]
                };
                
                await employeeWelfareService.createOrUpdateWelfare(welfareData);
            }

            // Reload data and clear form
            await loadWelfareData();
            clearDeductForm();
            alert('เพิ่มรายการเงินหักสำเร็จ');
            
        } catch (error) {
            console.error('Error adding deduct item:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มรายการเงินหัก');
        }
    };

    // Delete salary item
    const handleDeleteSalaryItem = async (itemId) => {
        if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
            return;
        }

        try {
            await employeeWelfareService.removeSalaryItem(
                employeeId, 
                globalSelectedYear, 
                globalSelectedMonth, 
                itemId
            );
            
            await loadWelfareData();
            alert('ลบรายการเงินเพิ่มสำเร็จ');
        } catch (error) {
            console.error('Error deleting salary item:', error);
            alert('เกิดข้อผิดพลาดในการลบรายการเงินเพิ่ม');
        }
    };

    // Delete deduct item
    const handleDeleteDeductItem = async (itemId) => {
        if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
            return;
        }

        try {
            await employeeWelfareService.removeDeductItem(
                employeeId, 
                globalSelectedYear, 
                globalSelectedMonth, 
                itemId
            );
            
            await loadWelfareData();
            alert('ลบรายการเงินหักสำเร็จ');
        } catch (error) {
            console.error('Error deleting deduct item:', error);
            alert('เกิดข้อผิดพลาดในการลบรายการเงินหัก');
        }
    };

    // Clear forms
    const clearAddSalaryForm = () => {
        setAddSalaryId('');
        setAddSalaryName('');
        setAddSalary('');
        setRoundOfSalary('');
        setStaffType('');
        setMessage('');
    };

    const clearDeductForm = () => {
        setMinusId('');
        setMisnusName('');
        setMinusSalary('');
        setPayType('');
        setInstallment('1');
        setMinusStaffType('');
    };

    // Handle input validation for numbers
    const handleNumberInput = (e, setter) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    return (
        <body className="hold-transition sidebar-mini editlaout">
            <div className="wrapper">
                <div className="content-wrapper">
                    {/* Breadcrumb */}
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <i className="fas fa-home"></i> <span>หน้าหลัก</span>
                        </li>
                        <li className="breadcrumb-item"><span> ระบบเงินเดือน</span></li>
                        <li className="breadcrumb-item active">จัดการสวัสดิการพนักงาน</li>
                    </ol>

                    {/* Content Header */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <h1 className="m-0">
                                    <i className="far fa-arrow-alt-circle-right"></i> จัดการสวัสดิการพนักงาน
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <section className="content">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {/* Employee Search Section */}
                                            <section className="Frame">
                                                <div className="col-md-12">
                                                    <form onSubmit={handleSearch}>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>รหัสพนักงาน</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="รหัสพนักงาน" 
                                                                        value={searchEmployeeId} 
                                                                        onChange={(e) => setSearchEmployeeId(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>ชื่อพนักงาน</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="ชื่อพนักงาน" 
                                                                        value={searchEmployeeName} 
                                                                        onChange={(e) => setSearchEmployeeName(e.target.value)} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center">
                                                            <button className="btn b_save">
                                                                <i className="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                                                            </button>
                                                        </div>
                                                    </form>

                                                    {/* Search Results */}
                                                    {searchResult.length > 0 && (
                                                        <>
                                                            <br />
                                                            <div className="d-flex justify-content-center">
                                                                <h2 className="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                                            </div>
                                                            <div className="d-flex justify-content-center">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="form-group">
                                                                            <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                                {searchResult.map(employee => (
                                                                                    <li
                                                                                        key={employee.id}
                                                                                        onClick={() => handleClickResult(employee)}
                                                                                        style={{ 
                                                                                            cursor: 'pointer', 
                                                                                            padding: '10px', 
                                                                                            marginBottom: '5px',
                                                                                            backgroundColor: '#f8f9fa',
                                                                                            borderRadius: '5px',
                                                                                            border: '1px solid #dee2e6'
                                                                                        }}
                                                                                    >
                                                                                        รหัส {employee.employeeId} ชื่อ {employee.name} {employee.lastName}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </section>

                                            {/* Selected Employee Info */}
                                            {employeeId && (
                                                <div className="d-flex justify-content-center">
                                                    <div className="col-md-6">
                                                        <div style={{ 
                                                            backgroundColor: '#f8f9fa', 
                                                            borderRadius: '10px', 
                                                            padding: '20px',
                                                            marginBottom: '25px',
                                                            border: '1px solid #dee2e6'
                                                        }}>
                                                            <div className="row align-items-center">
                                                                <div className="col-md-8">
                                                                    <h5 style={{ 
                                                                        margin: '0 0 5px 0',
                                                                        color: '#495057',
                                                                        fontWeight: '600'
                                                                    }}>
                                                                        {name && lastName ? `${name} ${lastName}` : 'ไม่พบข้อมูลพนักงาน'}
                                                                    </h5>
                                                                    <p style={{ 
                                                                        margin: '0',
                                                                        color: '#6c757d',
                                                                        fontSize: '0.9rem'
                                                                    }}>
                                                                        รหัสพนักงาน: <strong style={{ color: 'RGB(53,88,124)' }}>{employeeId || '-'}</strong>
                                                                    </p>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div style={{ textAlign: 'right' }}>
                                                                        <small style={{ 
                                                                            color: '#6c757d',
                                                                            fontSize: '0.8rem'
                                                                        }}>
                                                                            ข้อมูลพนักงาน
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Period Selection */}
                                            <div className="row mb-3" style={{ 
                                                backgroundColor: '#f8f9fa', 
                                                padding: '15px', 
                                                borderRadius: '8px', 
                                                border: '2px solid #007bff' 
                                            }}>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label style={{ fontWeight: 'bold', color: '#007bff' }}>เดือน</label>
                                                        <select 
                                                            className="form-control" 
                                                            value={globalSelectedMonth} 
                                                            onChange={(e) => setGlobalSelectedMonth(e.target.value)}
                                                            style={{ 
                                                                borderRadius: '6px', 
                                                                border: '2px solid #007bff', 
                                                                transition: 'border-color 0.15s ease-in-out' 
                                                            }}
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
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label style={{ fontWeight: 'bold', color: '#007bff' }}>ปี (พ.ศ.)</label>
                                                        <select 
                                                            className="form-control" 
                                                            value={globalSelectedYear} 
                                                            onChange={(e) => setGlobalSelectedYear(e.target.value)}
                                                            style={{ 
                                                                borderRadius: '6px', 
                                                                border: '2px solid #007bff', 
                                                                transition: 'border-color 0.15s ease-in-out' 
                                                            }}
                                                        >
                                                            {Array.from({ length: 10 }, (_, i) => {
                                                                const year = new Date().getFullYear() - 5 + i;
                                                                const buddhistYear = year + 543;
                                                                return (
                                                                    <option key={year} value={year.toString()}>
                                                                        {buddhistYear}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label style={{ fontWeight: 'bold', color: '#007bff' }}>&nbsp;</label>
                                                        <div className="d-flex align-items-end">
                                                            <span className="form-control-static" style={{ 
                                                                backgroundColor: '#e3f2fd', 
                                                                padding: '8px 12px', 
                                                                borderRadius: '6px', 
                                                                border: '2px solid #007bff',
                                                                color: '#1976d2',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {employeeWelfareService.getThaiMonthName(globalSelectedMonth)} พ.ศ. {employeeWelfareService.getBuddhistYear(globalSelectedYear)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Add Salary Section */}
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h3 style={{ 
                                                        color: '#28a745', 
                                                        fontWeight: 'bold', 
                                                        borderBottom: '3px solid #28a745', 
                                                        paddingBottom: '10px', 
                                                        marginBottom: '20px' 
                                                    }}>
                                                        เงินเพิ่ม
                                                    </h3>
                                                    <section className="Frame" style={{ 
                                                        backgroundColor: '#ffffff', 
                                                        borderRadius: '10px', 
                                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                                        border: '1px solid #e9ecef', 
                                                        overflow: 'hidden',
                                                        padding: '20px'
                                                    }}>
                                                        <div className="row" style={{ 
                                                            padding: '15px', 
                                                            backgroundColor: '#f8f9fa', 
                                                            borderRadius: '8px', 
                                                            marginBottom: '15px' 
                                                        }}>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>รหัส</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="รหัส" 
                                                                        value={addSalaryId} 
                                                                        onChange={(e) => setAddSalaryId(e.target.value)}
                                                                        onInput={(e) => handleNumberInput(e, setAddSalaryId)} 
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>ชื่อ</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="ชื่อ" 
                                                                        value={addSalaryName} 
                                                                        onChange={(e) => setAddSalaryName(e.target.value)} 
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>จำนวนเงิน</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="จำนวนเงิน" 
                                                                        value={addSalary} 
                                                                        onChange={(e) => handleNumberInput(e, setAddSalary)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>รายวัน/รายเดือน</label>
                                                                    <select
                                                                        className="form-control"
                                                                        value={roundOfSalary}
                                                                        onChange={(e) => setRoundOfSalary(e.target.value)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    >
                                                                        <option value="">เลือก</option>
                                                                        <option value="daily">รายวัน</option>    
                                                                        <option value="monthly">รายเดือน</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>ประเภทพนักงาน</label>
                                                                    <select
                                                                        className="form-control"
                                                                        value={staffType}
                                                                        onChange={(e) => setStaffType(e.target.value)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    >
                                                                        <option value="">เลือกประเภท</option>
                                                                        <option value="all">ทั้งหมด</option>
                                                                        <option value="หัวหน้าควบคุมงาน">หัวหน้าควบคุมงาน</option>
                                                                        <option value="ผู้ช่วยผู้ควบคุมงาน">ผู้ช่วยผู้ควบคุมงาน</option>
                                                                        <option value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</option>
                                                                        {/* Add more options as needed */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>หมายเหตุ</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="หมายเหตุ" 
                                                                        value={message} 
                                                                        onChange={(e) => setMessage(e.target.value)} 
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-3">
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                style={{ 
                                                                    backgroundColor: '#28a745', 
                                                                    color: 'white', 
                                                                    borderRadius: '8px', 
                                                                    padding: '8px 16px',
                                                                    border: 'none',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)',
                                                                    transition: 'all 0.15s ease-in-out'
                                                                }}
                                                                onClick={handleAddSalaryItem}
                                                            >
                                                                <i className="fas fa-plus"></i> &nbsp; เพิ่มรายการเงินเพิ่ม
                                                            </button>
                                                        </div>

                                                        {/* Display Add List */}
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h5 style={{ color: '#28a745', marginBottom: '15px' }}>รายการเงินเพิ่ม</h5>
                                                                {addList.length > 0 ? (
                                                                    addList.map((item, index) => (
                                                                        <div key={index} className="row" style={{ 
                                                                            marginBottom: '15px', 
                                                                            padding: '15px',
                                                                            backgroundColor: '#d4edda',
                                                                            borderRadius: '8px',
                                                                            border: '1px solid #c3e6cb',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                        }}>
                                                                            <div className="col-md-2">
                                                                                <strong>รหัส:</strong> {item.id}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>ชื่อ:</strong> {item.name}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>จำนวนเงิน:</strong> {employeeWelfareService.formatCurrency(item.amount)}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>ประเภท:</strong> {item.roundOfSalary === 'daily' ? 'รายวัน' : 'รายเดือน'}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>หมายเหตุ:</strong> {item.message}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <button 
                                                                                    className="btn btn-sm btn-danger"
                                                                                    onClick={() => handleDeleteSalaryItem(item.id)}
                                                                                >
                                                                                    <i className="fas fa-trash-alt"></i> ลบ
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-muted text-center">ไม่มีรายการเงินเพิ่ม</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>

                                            {/* Deduct Salary Section */}
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h3 style={{ 
                                                        color: '#dc3545', 
                                                        fontWeight: 'bold', 
                                                        borderBottom: '3px solid #dc3545', 
                                                        paddingBottom: '10px', 
                                                        marginBottom: '20px' 
                                                    }}>
                                                        เงินหัก
                                                    </h3>
                                                    <section className="Frame" style={{ 
                                                        backgroundColor: '#ffffff', 
                                                        borderRadius: '10px', 
                                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                                        border: '1px solid #e9ecef', 
                                                        overflow: 'hidden',
                                                        padding: '20px'
                                                    }}>
                                                        <div className="row" style={{ 
                                                            padding: '15px', 
                                                            backgroundColor: '#f8f9fa', 
                                                            borderRadius: '8px', 
                                                            marginBottom: '15px' 
                                                        }}>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>รหัส</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="รหัส" 
                                                                        value={minusId} 
                                                                        onChange={(e) => setMinusId(e.target.value)}
                                                                        onInput={(e) => handleNumberInput(e, setMinusId)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>ชื่อ</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="ชื่อ" 
                                                                        value={misnusName} 
                                                                        onChange={(e) => setMisnusName(e.target.value)} 
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>จำนวนเงิน</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="จำนวนเงิน" 
                                                                        value={minusSalary} 
                                                                        onChange={(e) => handleNumberInput(e, setMinusSalary)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>การหักเงิน</label>
                                                                    <select
                                                                        className="form-control"
                                                                        value={payType}
                                                                        onChange={(e) => setPayType(e.target.value)}
                                                                        style={{ borderRadius: '6px' }}
                                                                    >
                                                                        <option value="">เลือก</option>
                                                                        <option value="immediate">ทั้งหมด</option>
                                                                        <option value="installment">ผ่อนจ่าย</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>จำนวนงวด</label>
                                                                    {payType === "installment" ? (
                                                                        <select
                                                                            className="form-control"
                                                                            value={installment}
                                                                            onChange={(e) => setInstallment(e.target.value)}
                                                                            style={{ borderRadius: '6px' }}    
                                                                        >
                                                                            <option value="">เลือกจำนวนงวด</option>
                                                                            <option value="2">2 งวด {minusSalary && (parseFloat(minusSalary) / 2).toFixed(2)} บาท</option>
                                                                            <option value="3">3 งวด {minusSalary && (parseFloat(minusSalary) / 3).toFixed(2)} บาท</option>
                                                                            <option value="4">4 งวด {minusSalary && (parseFloat(minusSalary) / 4).toFixed(2)} บาท</option>
                                                                            <option value="5">5 งวด {minusSalary && (parseFloat(minusSalary) / 5).toFixed(2)} บาท</option>
                                                                            <option value="6">6 งวด {minusSalary && (parseFloat(minusSalary) / 6).toFixed(2)} บาท</option>
                                                                        </select>
                                                                    ) : (
                                                                        <select
                                                                            className="form-control"
                                                                            value="1"
                                                                            disabled
                                                                            style={{ borderRadius: '6px' }}
                                                                        >
                                                                            <option value="1">1 งวด {minusSalary || 0} บาท</option>
                                                                        </select>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>หมายเหตุ</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control" 
                                                                        placeholder="หมายเหตุ" 
                                                                        value={minusStaffType} 
                                                                        onChange={(e) => setMinusStaffType(e.target.value)} 
                                                                        style={{ borderRadius: '6px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center mb-3">
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                style={{ 
                                                                    backgroundColor: '#dc3545', 
                                                                    color: 'white', 
                                                                    borderRadius: '8px', 
                                                                    padding: '8px 16px',
                                                                    border: 'none',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
                                                                    transition: 'all 0.15s ease-in-out'
                                                                }}
                                                                onClick={handleAddDeductItem}
                                                            >
                                                                <i className="fas fa-minus"></i> &nbsp; เพิ่มรายการเงินหัก
                                                            </button>
                                                        </div>

                                                        {/* Display Deduct List */}
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h5 style={{ color: '#dc3545', marginBottom: '15px' }}>รายการเงินหัก</h5>
                                                                {deductList.length > 0 ? (
                                                                    deductList.map((item, index) => (
                                                                        <div key={index} className="row" style={{ 
                                                                            marginBottom: '15px', 
                                                                            padding: '15px',
                                                                            backgroundColor: '#f8d7da',
                                                                            borderRadius: '8px',
                                                                            border: '1px solid #f5c6cb',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                        }}>
                                                                            <div className="col-md-2">
                                                                                <strong>รหัส:</strong> {item.id}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>ชื่อ:</strong> {item.name}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>จำนวนเงิน:</strong> {employeeWelfareService.formatCurrency(item.amount)}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>การจ่าย:</strong> {item.payType === 'immediate' ? 'ทั้งหมด' : 'ผ่อนจ่าย'}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <strong>งวด:</strong> {item.installmentInfo || `${item.installment} งวด`}
                                                                            </div>
                                                                            <div className="col-md-2">
                                                                                <button 
                                                                                    className="btn btn-sm btn-danger"
                                                                                    onClick={() => handleDeleteDeductItem(item.id)}
                                                                                >
                                                                                    <i className="fas fa-trash-alt"></i> ลบ
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-muted text-center">ไม่มีรายการเงินหัก</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>

                                            {/* Summary Section */}
                                            {currentWelfareData && (
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h3 style={{ 
                                                            color: '#007bff', 
                                                            fontWeight: 'bold', 
                                                            borderBottom: '3px solid #007bff', 
                                                            paddingBottom: '10px', 
                                                            marginBottom: '20px' 
                                                        }}>
                                                            สรุปสวัสดิการ
                                                        </h3>
                                                        <section className="Frame" style={{ 
                                                            backgroundColor: '#ffffff', 
                                                            borderRadius: '10px', 
                                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                                            border: '1px solid #e9ecef', 
                                                            padding: '30px',
                                                            textAlign: 'center'
                                                        }}>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <h5 style={{ color: '#28a745' }}>รวมเงินเพิ่ม</h5>
                                                                    <h3 style={{ color: '#28a745', fontWeight: 'bold' }}>
                                                                        {employeeWelfareService.formatCurrency(currentWelfareData.getTotalAddAmount())}
                                                                    </h3>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <h5 style={{ color: '#dc3545' }}>รวมเงินหัก</h5>
                                                                    <h3 style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                                                        {employeeWelfareService.formatCurrency(currentWelfareData.getTotalDeductAmount())}
                                                                    </h3>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <h5 style={{ color: '#007bff' }}>ยอดรวมสุทธิ</h5>
                                                                    <h3 style={{ 
                                                                        color: currentWelfareData.getNetAmount() >= 0 ? '#28a745' : '#dc3545', 
                                                                        fontWeight: 'bold' 
                                                                    }}>
                                                                        {employeeWelfareService.formatCurrency(currentWelfareData.getNetAmount())}
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </body>
    );
}

export default AddEditSalaryEmployeeNew;
