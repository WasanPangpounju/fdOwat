import endpoint from '../../config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../editwindowcss.css';


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
        // Note: Employee selection is not used in user creation
        // This function seems to be inherited from another component
    }

    async function handleRegister(event) {
        event.preventDefault();

        // Validate required fields
        if (!name.trim()) {
            alert('กรุณากรอกชื่อ');
            return;
        }
        if (!email.trim()) {
            alert('กรุณากรอก Email');
            return;
        }
        if (!username.trim()) {
            alert('กรุณากรอก Username');
            return;
        }
        if (!password.trim()) {
            alert('กรุณากรอก Password');
            return;
        }
        if (!role) {
            alert('กรุณาเลือก Role');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('รูปแบบ Email ไม่ถูกต้อง');
            return;
        }

        const data = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            username: username.trim(),
            password: password,
            role: role,
        };

        console.log('Sending data:', data); // Debug log

        //check create or update Employee
        if (newEmp) {
            try {
                const response = await axios.post(endpoint + '/users/create', data);
                console.log('Success:', response.data);
                alert('เพิ่มผู้ใช้งานสำเร็จ');
                
                // Reset form
                setName('');
                setEmail('');
                setUsername('');
                setPassword('');
                setRole('');
                
                // Refresh users list by fetching again
                const usersResponse = await fetch(endpoint + '/users/list');
                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    setUsers(usersData);
                }
                
            } catch (error) {
                console.error('Error creating user:', error);
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMessage = error.response.data.error;
                    if (errorMessage.includes('duplicate key error') || errorMessage.includes('E11000')) {
                        if (errorMessage.includes('email')) {
                            alert('Email นี้มีอยู่ในระบบแล้ว กรุณาใช้ Email อื่น');
                        } else if (errorMessage.includes('username')) {
                            alert('Username นี้มีอยู่ในระบบแล้ว กรุณาใช้ Username อื่น');
                        } else {
                            alert('ข้อมูลซ้ำในระบบ กรุณาตรวจสอบ Email และ Username');
                        }
                    } else {
                        alert('เกิดข้อผิดพลาด: ' + errorMessage);
                    }
                } else {
                    alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล หรือตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์');
                }
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
                                                    <label role="fname">ชื่อ <span style={{color: 'red'}}>*</span></label>
                                                    <input type="text" class="form-control" id="fname" placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label role="Email">E-mail <span style={{color: 'red'}}>*</span></label>
                                                    <input type="email" class="form-control" id="Email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="User">User <span style={{color: 'red'}}>*</span></label>
                                                    <input type="text" class="form-control" id="User" placeholder="User" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="Passwork">Password <span style={{color: 'red'}}>*</span></label>
                                                    <input type="password" class="form-control" id="Passwork" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label role="role">Role <span style={{color: 'red'}}>*</span></label>
                                                    <select id="role" name="role" class="form-control" value={role} onChange={handleWorkplace} required>
                                                        <option value="">เลือก Role</option>
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
