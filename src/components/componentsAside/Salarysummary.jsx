import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../editwindowcss.css';


function Salarysummary() {
    useEffect(() => {
        document.title = 'สรุปเงินเดือน';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    const styles = {
        th: {
            minWidth: "5rem"
        }
    };

    const [employeeId, setEmployeeId] = useState('');
    const [name, setName] = useState('');


    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const [salary, setSalary] = useState(''); //อัตราเงินเดือน
    const [salaryadd1v, setSalaryadd1v] = useState(''); //เงินเพิ่มพิเศษ ค่ารถ
    const [salaryadd2v, setSalaryadd2v] = useState(''); //เงินเพิ่มพิเศษ ค่าอาหาร
    const [salaryadd3v, setSalaryadd3v] = useState(''); //เงินเพิ่มพิเศษ เบี้ยขยัน
    const [salaryadd4v, setSalaryadd4v] = useState(''); //เงินเพิ่มพิเศษ โทรศัพท์
    const [salaryadd5v, setSalaryadd5v] = useState(''); //เงินเพิ่มพิเศษ เงินประจำตำแหน่ง
    const [remainbusinessleave, setRemainbusinessleave] = useState(''); //ลาคงเหลือ วันลากิจคงเหลือ 
    const [secialany, setSecialany] = useState(''); //เงินพิเศษอื่นๆ	

    ///ประกันสังคม
    const [minus, setMinus] = useState('5'); //หัห
    const [minusemployer, setMinusEmployer] = useState('5'); //หัห


    async function handleSearch(event) {
        event.preventDefault();

        // get value from form search
        const data = {
            employeeId: searchEmployeeId,
            name: searchEmployeeName,
            idCard: '',
            workPlace: '',

            salary: salary,
            salaryadd1v: salaryadd1v,
            salaryadd2v: salaryadd2v,
            salaryadd3v: salaryadd3v,
            salaryadd4v: salaryadd4v,
            salaryadd5v: salaryadd5v,
            remainbusinessleave: remainbusinessleave,
            secialany: secialany,

            minus: minus,
            minusemployer: minusemployer,
        };

        try {
            const response = await axios.post(endpoint + '/employee/search', data);
            setSearchResult(response.data.employees);
            // alert(response.data.employees.length);
            if (response.data.employees.length < 1) {
                window.location.reload();
                alert('ไม่พบข้อมูล');
            } else {
                // alert(response.data.employees.length);


                // Set search values
                setEmployeeId(response.data.employees[0].employeeId);
                setName(response.data.employees[0].name);

                setSalary(response.data.employees[0].salary);
                setSalaryadd1v(response.data.employees[0].salaryadd1v);
                setSalaryadd2v(response.data.employees[0].salaryadd2v);
                setSalaryadd3v(response.data.employees[0].salaryadd3v);
                setSalaryadd4v(response.data.employees[0].salaryadd4v);
                setSalaryadd5v(response.data.employees[0].salaryadd5v);
                setRemainbusinessleave(response.data.employees[0].remainbusinessleave);
                setSecialany(response.data.employees[0].secialany);

                setMinus(response.data.employees[0].minus);
                setMinusEmployer(response.data.employees[0].minusemployer);

                setSearchEmployeeId(response.data.employees[0].employeeId);
                setSearchEmployeeName(response.data.employees[0].name);

                // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
                // console.log('workOfOT:', endTime);

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            window.location.reload();
        }
    }

    async function handleManageWorkplace(event) {
        event.preventDefault();

    }

    const [socialsecurity, setSocialSecurity] = useState(''); //หักประกันสังคม

    useEffect(() => {
        if (salary === '') {
            setSocialSecurity(0);
        } else {
            const parsedSalary = parseFloat(salary);
            const parsedMinus = parseFloat(minus) / 100; // Convert the minus percentage to a decimal
            if (parsedSalary < 1650) {
                setSocialSecurity(1650 * parsedMinus);
            } else if (parsedSalary >= 1650 && parsedSalary <= 15000) {
                setSocialSecurity(parsedSalary * parsedMinus);
            } else {
                setSocialSecurity(15000 * parsedMinus);
            }
        }
    }, [salary, minus]);
    return (
        // <div>
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบเงินเดือน</a></li>
                        <li class="breadcrumb-item active">สรุปเงินเดือน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> สรุปเงินเดือน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="row">
                            <div class="col-md-6">
                                <section class="Frame">
                                    <div class="col-md-12">
                                        <h2 class="title">ค้นหา</h2>
                                        <div class="col-md-12">
                                            <form onSubmit={handleSearch}>
                                                <div class="row">
                                                    {/* 
                                                        <div class="form-group">
                                                            <label role="formsettime">ค้นหาด้วย</label>
                                                            <select id="formsettime" name="formsettime" class="form-control" >
                                                                <option value="workplaceId">รหัสหน่วยงาน</option>
                                                                <option value="agencytime">ชื่อหน่วยงาน</option>
                                                                <option value="employeeId">รหัสพนักงาน</option>
                                                                <option value="persontime">ชื่อพนักงาน</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="formsettime">ชื่อ</label>
                                                            <input type="text" class="form-control" id="searchWorkplaceId" placeholder="รหัสหน่วยงาน" value={searchWorkplaceId} onChange={(e) => setSearchWorkplaceId(e.target.value)} />
                                                        </div>
                                                    </div> */}
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                            <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label role="searchname">ชื่อพนักงาน</label>
                                                            <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group">
                                                                <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้าหา</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>

                                            {/* <div class="d-flex justify-content-center">
                                                <h2 class="title">ผลลัพธ์</h2>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <div class="row">

                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                <li >
                                                                    ไทยยั่งยืน
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div class="d-flex justify-content-center">
                                                <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                            </div>
                                            <div class="d-flex justify-content-center">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                {searchResult.map(workplace => (
                                                                    <li
                                                                        key={workplace.id}
                                                                        onClick={() => handleClickResult(workplace)}
                                                                    >
                                                                        รหัส {workplace.workplaceId} หน่วยงาน {workplace.workplaceName}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                ชื่อ : ไทยยั่งยืน
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-2">
                                ทั้งหมด 0 วัน
                            </div>
                        </div>
                        <form onSubmit={handleManageWorkplace}>
                            <div class="row">
                                <div class="col-md-9">
                                    <section class="Frame">
                                        <div class="container" style={{ overflowX: 'scroll' }}>
                                            <table id="" class="table table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th} id="test">จำนวนวันทำงาน</th>
                                                        <th style={styles.th} id="test">เป็นเงิน</th>
                                                        <th style={styles.th} id="test">ค่ารถ</th>
                                                        <th style={styles.th} id="test">ค่าอาหาร</th>
                                                        <th style={styles.th} id="test">เบี้ยขยัน</th>
                                                        <th style={styles.th} id="test">นักขัติฤกษ์</th>
                                                        <th style={styles.th} id="test">เงินพิเศษอื่นๆ</th>
                                                        <th style={styles.th} id="test">ค่าโทรศัพท์</th>
                                                        <th style={styles.th} id="test">เงินประจำตำแหน่ง</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>22 วัน</td>
                                                        <td>{salary}</td>
                                                        <td>{salaryadd1v}</td>
                                                        <td>{salaryadd2v}</td>
                                                        <td>{salaryadd3v}</td>
                                                        <td>{remainbusinessleave}</td>
                                                        <td>{secialany}</td>
                                                        <td>{salaryadd4v}</td>
                                                        <td>{salaryadd5v}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>ot 0 ช.ม.</td>
                                                        <td>เงิน ot 0</td>
                                                    </tr>
                                                    <tr>
                                                        <td>เป็นเงินทั้งสิ้น</td>
                                                        <td>12800</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            </div>
                            หัก<br />
                            <div class="row">
                                <div class="col-md-9">
                                    <section class="Frame">
                                        <div class="container" style={{ overflowX: 'scroll' }}>
                                            <table id="" class="table table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th} id="test">หักอื่นๆ</th>
                                                        <th style={styles.th} id="test">หักภาษี</th>
                                                        <th style={styles.th} id="test">หัก ปกส</th>
                                                        <th style={styles.th} id="test">ธรรมเนียม ธ.</th>
                                                        <th style={styles.th} id="test">คืนเงินอื่นๆ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td>{socialsecurity} ({minus} %)</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>เป็นเงินทั้งสิ้น</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td>สุทธิ</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </form>
                        {/* </form> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div >
        </body >
    )
}

export default Salarysummary