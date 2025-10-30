import endpoint from '../../config';
import { Link } from 'react-router-dom';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import '../editwindowcss.css';
import Modal from 'react-modal';
import './salarysummary/styleCom.css';
Modal.setAppElement('#root'); // Set the root element for accessibility

function Compensation() {
//design
document.title = ' ตารางค่าตอบแทน';
const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
};

const cellStyle = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
};

const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
};

//variable
const thaiMonthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const thaiToEnglishDayMap = {
    'จันทร์': ['Mon'],
    'อังคาร': ['Tue'],
    'พุธ': ['Wed'],
    'พฤหัส': ['Thu'],
    'ศุกร์': ['Fri'],
    'เสาร์': ['Sat'],
    'อาทิตย์': ['Sun'],
};
const getThaiMonthName = (monthNumber) => {
    return thaiMonthNames[monthNumber - 1];
};


const [month, setMonth] = useState('01');
const [year, setYear] = useState(new Date().getFullYear());

const EndYear = 2010;
const currentYear = new Date().getFullYear(); // 2024
const years = Array.from({ length: currentYear - EndYear + 1 }, (_, index) => EndYear + index).reverse();


const [staffId, setStaffId] = useState(''); //รหัสหน่วยงาน
const [staffName , setStaffName] = useState(''); //รหัสหน่วยงาน
const [staffLastname ,setStaffLastname] = useState(''); //รหัสหน่วยงาน
const [staffFullName, setStaffFullName] = useState(''); //รหัสหน่วยงาน
const [employeeList, setEmployeeList] = useState([]);
const [concludeResult , setConcludeResult] = useState(null);

//first load
useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);
        // Fetch data from the API when the component mounts
        fetch(endpoint + '/employee/list')
            .then(response => response.json())
            .then(data => {
                // Update the state with the fetched data
                setEmployeeList(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

} , [] );

//event
useEffect(() => {
    const tableData = async () => {
        if(concludeResult !== null){
alert('data');
        }

    }

    tableData ();
}, [concludeResult]);

//function

async function handleSearch(event) {
    event.preventDefault();
    setConcludeResult(null);

        //get data from conclude data 
        const serchConclude = await {
            year: year,
            month: month,
            concludeDate: '',
            employeeId: staffId,
            employeeName: staffName
        };

        try {
            const response = await axios.post(endpoint + '/conclude/search', serchConclude);

            if (response.data.recordConclude.length < 1) {
                                // alert('conclude is null');
            } else {
                await setConcludeResult(response.data.recordConclude[0].concludeRecord);
// await alert(concludeResult);

            }

        } catch (e) {
            // alert(e);
        }

}

const handleStaffIdChange = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);
    // setSearchEmployeeId(selectedStaffId);
    // Find the corresponding employee and set the staffName
    const selectedEmployee = employeeList.find(employee => employee.employeeId === selectedStaffId);
    if (selectedEmployee) {
        setStaffName(selectedEmployee.name);
        setStaffLastname(selectedEmployee.lastName);
        setStaffFullName(selectedEmployee.name + ' ' + selectedEmployee.lastName);
        // setWorkplaceIdEMP(selectedEmployee.workplace);


    } else {
        setStaffName('');
        setStaffFullName('');
        // setSearchEmployeeName('');
    }
};


const callHandleStaffNameChangeWithEmployeeId = async (employeeId) => {
    // Assuming you have access to the event object or you can create a synthetic event
    // You can create a synthetic event using `new Event('change')`
    const syntheticEvent = await new Event('change');

    // You need to attach a `target` property to the synthetic event
    // with a `value` property containing the employeeId
    syntheticEvent.target = await { value: employeeId };

    // Call handleStaffNameChange with the synthetic event
    await handleStaffIdChange(syntheticEvent);
};

const handleStaffNameChange = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(employee => (employee.name + " " + employee.lastName) === selectedStaffName);
    const selectedEmployeeFName = employeeList.find(employee => employee.name === selectedStaffName);

    if (selectedEmployee) {
        setStaffId(selectedEmployee.employeeId);

    } else {
        setStaffId('');
    }

    setStaffFullName(selectedStaffName);
    // setSearchEmployeeName(selectedStaffName);

};


    //view

    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">

                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
                        <li class="breadcrumb-item active">ตารางค่าตอบแทน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตารางค่าตอบแทน</h1>
                            </div>
                        </div>
                    </div>

                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ตารางค่าตอบแทน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <form onSubmit={handleSearch}>
                                    <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="staffId"
                                                        placeholder="รหัสพนักงาน"
                                                        value={staffId == "null" ? '' : staffId}
                                                        onChange={handleStaffIdChange}
                                                        list="staffIdList"
                                                    />
                                                    <datalist id="staffIdList">
                                                        {employeeList.map(employee => (
                                                            <option key={employee.employeeId} value={employee.employeeId} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="searchname">ชื่อพนักงาน</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="staffName"
                                                        placeholder="ชื่อพนักงาน"
                                                        value={staffFullName}
                                                        onChange={handleStaffNameChange}
                                                        list="staffNameList"
                                                    />
                                                    <datalist id="staffNameList">
                                                        {employeeList.map(employee => (
                                                            <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="agencyname">เดือน</label>
                                                    <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
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
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label >ปี</label>
                                                    <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                                                        {years.map((y) => (
                                                            <option key={y} value={y}>
                                                                {y + 543}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-center">
                                            <button class="btn b_save" onClick={handleSearch()} ><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
                                        </div>
                                    </form>
                                    
                                    <br />
                                    
                                </div>
                            </section>
                            <section class="Frame">
                                {staffFullName ? (
                                    <div class="row">
                                        <div class="col-md-12">
                                            ชื่อ: {staffFullName}
                                        </div>
                                    </div>) : (
                                    <div>
                                        {/* Content to show when staffFullName is not set */}
                                    </div>
                                )}

                                <div class="row">
                                    <div class="col-md-12">
                                        ตั้งแต่วันที่ 20 { getThaiMonthName((month === '01') ? '12' : month -1 ) } - 21 {getThaiMonthName(month) } ปี {parseInt(year, 10) + 543}
                                    </div>
                                </div>
                                <br />
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">

                                            <table border="1" style={tableStyle}>
                                                <thead>
                                                    <tr>
                                                        <th style={headerCellStyle}>วันที่</th>
                                                        <th style={headerCellStyle}>หน่วยงาน</th>
                                                        <th style={headerCellStyle}>ชั่วโมงทำงาน</th>
                                                        <th style={headerCellStyle}>ค่าจ้างปกติ</th>
                                                        <th style={headerCellStyle}>ชั่วโมง OT</th>
                                                        <th style={headerCellStyle}>ค่าล่วงเวลา OT</th>
                                                        <th style={headerCellStyle}>เงินเพิ่ม</th>
                                                        <th style={headerCellStyle}>แก้/ลบ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                </tbody>
                                            </table>

                                            <br />

                                        </div>

                                    </div>
                                </div>

                                <div class="line_btn">

                                    {/* <button type="button" onClick={saveconclude} class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button> */}

                                    <Link to="/Salaryresult">
                                        {/* <button type="button" class="btn clean"><i>&gt;</i> &nbsp;ถัดไป</button> */}
                                    </Link >

                                </div>
                                {/* {JSON.stringify(employee.addSalary,null,2)} */}
                            </section>
                        </div>
                    </section>


                </div>
            </div>
            {JSON.stringify(concludeResult, null ,2)}
            
        </body>
    )

}

export default Compensation
