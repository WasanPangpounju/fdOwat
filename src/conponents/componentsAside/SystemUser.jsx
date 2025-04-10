import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';

import Calendar from 'react-calendar';


function SystemUser() {
    const [storedEmp, setStoredEmp] = useState([]);
    const [newEmp, setNewEmp] = useState(true);
    const [employeeselection, setEmployeeselection] = useState([]);
    const [buttonValue, setButtonValue] = useState('');

    //register data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    function onEmployeeSelect(empSelect) {
        alert(empSelect.dateOfBirth);
        setEmployeeselection(empSelect);
        setEmployeeId(empSelect.employeeId);
        setPosition(empSelect.position);
        setDepartment(empSelect.department);
        setWorkplace(empSelect.workplace);
        setJobtype(empSelect.jobtype);
        setStartjob(new Date(empSelect.startjob));
        setExceptjob(new Date(empSelect.exceptjob));
        setPrefix(empSelect.prefix);
        setName(empSelect.name);
        setLastName(empSelect.lastName);
        setNickName(empSelect.nickName);
        setGender(empSelect.gender);

        setDateOfBirth(new Date(empSelect.dateOfBirth));
        setAge(empSelect.age);
        setIdCard(empSelect.idCard);
        setEthnicity(empSelect.ethnicity);
        setReligion(empSelect.religion);
        setMaritalStatus(empSelect.maritalStatus);
        setMilitaryStatus(empSelect.militaryStatus);
        setAddress(empSelect.address);
        setCurrentAddress(empSelect.currentAddress);
        setPhoneNumber(empSelect.phoneNumber);
        setEmergencyContactNumber(empSelect.emergencyContactNumber);
        setIdLine(empSelect.idLine);
        setVaccination(empSelect.vaccination);
        setTreatmentRights(empSelect.treatmentRights);

    }

    async function handleRegister(event) {
        event.preventDefault();

        const data = {
            name: name,
            email: email,
            username: username,
            password: password,
            role: role,
        };


        //check create or update Employee
        if (newEmp) {
            try {
                const response = await axios.post(endpoint + '/users/create', data);
            } catch (error) {
                alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            }

        } else {
            if (buttonValue == 'save') {
                alert('update user');
            }
        }
    }


    const handleWorkplace = (event) => {
        setRole(event.target.value);
    };
    const handleJobtype = (event) => {
        setJobtype(event.target.value);
    };
    const handlePrefix = (event) => {
        setPrefix(event.target.value);
    };
    const handleGender = (event) => {
        setGender(event.target.value);
    };
    const handleMilitaryStatus = (event) => {
        setMilitaryStatus(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartjob(date);
    };
    const handleExceptDateChange = (date) => {
        setExceptjob(date);
    };
    const handleDateOfBirth = (date) => {
        setDateOfBirth(date);
    };

    //check create employee or update employee by click select employee
    useEffect(() => {
        // setNewEmp(true);
        if (employeeselection.length > 0) {
            setNewEmp(true);
        } else {
            setNewEmp(false);
        }

    }, [employeeselection]);

    useEffect(() => {
        const storedItem = localStorage.getItem('selectedEmployees');
        if (storedItem) {
            // Item exists in localStorage
            // setStoredEmp(storedItem);
            const parsedData = JSON.parse(storedItem);
            setStoredEmp(parsedData);
            //      console.log('Item exists:', storedItem);
            setNewEmp(true);

            // setNewEmp(false);
        } else {
            // Item does not exist in localStorage
            console.log('Item does not exist');
            setNewEmp(true);
        }
    }, []);

    useEffect(() => {
        // Listen for the custom event when selectedEmployees change in localStorage
        const handleSelectedEmployeesChange = (event) => {
            const { selectedEmployees } = event.detail;
            setStoredEmp(selectedEmployees);
        };
        window.addEventListener('selectedEmployeesChanged', handleSelectedEmployeesChange);

        return () => {
            window.removeEventListener('selectedEmployeesChanged', handleSelectedEmployeesChange);
        };
    }, []);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint + '/users/list');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the function to fetch data when the component mounts
    }, []);

    return (
        // <body class="hold-transition sidebar-mini" className='editlaout'>
        //     <div class="wrapper">

        //         <div class="content-wrapper">
        <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
        
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> การตั้งค่า</a></li>
                        <li class="breadcrumb-item active">ตั้งค่าผู้ใช้งาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตั้งค่าผู้ใช้งาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="title">ตั้งค่าผู้ใช้งาน</h2>
                            <section class="Frame">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">ชื่อ</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">ตำแหน่ง</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                {/* Add more table data cells as needed */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                            {/* <!--Frame--> */}
                            <form onSubmit={handleRegister}>
                                <h2 class="title">เพิ่มผู้ใช้งานระบบ</h2>
                                <section class="Frame">
                                    <div class="col-md-12">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="fname">ชื่อ</label>
                                                    <input type="text" class="form-control" id="fname" placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="Email">E-mail</label>
                                                    <input type="text" class="form-control" id="Email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="User">User</label>
                                                    <input type="text" class="form-control" id="User" placeholder="User" value={username} onChange={(e) => setUsername(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="Passwork">Password</label>
                                                    <input type="text" class="form-control" id="Passwork" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="role">Role</label>
                                                    <select id="role" name="role" class="form-control" value={role} onChange={handleWorkplace}>
                                                        <option value="admin">แอดมิน</option>
                                                        <option value="employee">พนักงาน</option>
                                                        <option value="manager">ผู้จัดการ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="line_btn">

                                        {newEmp ? (
                                            <button class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;เพิ่มผู้ใช้งานระบบ</button>
                                        ) : (
                                            <button type="submit" name="save" value="save" onClick={() => setButtonValue('save')} class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                        )}
                                        <button class="btn clean"><i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก</button>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>

            </div>
        {/* </body> */}
        </div>
    );
}
export default SystemUser
