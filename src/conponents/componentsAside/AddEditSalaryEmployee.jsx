import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import EmployeesSelected from './EmployeesSelected';

function AddEditSalaryEmployee() {

    const bordertable = {
        borderLeft: '2px solid #000'
    };


    const [newWorkplace, setNewWorkplace] = useState(true);

    const [searchEmployeeId, setSearchEmployeeId] = useState('');
    const [searchEmployeeName, setSearchEmployeeName] = useState('');
    const [month, setMonth] = useState('');


    const [searchAddSalaryList, setSearchAddSalaryList] = useState([]);
    const [searchDeductSalaryList, setSearchDeductSalaryList] = useState([]);


    useEffect(() => {
        //get searchEmployeeId from localStorage
        const tmp = localStorage.getItem('searchEmployeeId');
        setSearchEmployeeId(tmp || '');

        setMonth("01");
        //get data from master employee

        const getMaster = async () => {
            const data = await {
                employeeId: '0001',
                name: '',
                idCard: '',
                workPlace: '',
            };

            try {
                const response = await axios.post(endpoint + '/employee/search', data);
                if (response) {
                    await setSearchAddSalaryList(response.data.employees[0].addSalary);
                    await setSearchDeductSalaryList(response.data.employees[0].deductSalary);
                }
                // await alert(JSON.stringify(response.data.employees[0].addSalary ,null,2 ));
                // await alert(JSON.stringify(response.data.employees[0].deductSalary ,null,2 ));

            } catch (e) {
            }
        }

        getMaster();
    }, []);


    const options = [];

    for (let i = 1; i <= 31; i++) {
        // Use padStart to add leading zeros to numbers less than 10
        const formattedValue = i.toString().padStart(2, '0');
        options.push(<option key={i} value={formattedValue}>{formattedValue}</option>);
    }

    //employeedata
    const [employeeId, setEmployeeId] = useState(''); //รหัสพนักงาน
    const [name, setName] = useState(''); //ชื่อพนักงาน
    const [lastName, setLastName] = useState(''); //นามสกุลพนักงาน
    const [dataResult, setDataResult] = useState([]);



    //////////////////////////////
    const [employeeList, setEmployeeList] = useState([]);
    const [workplaceList, setWorkplaceList] = useState([]);
    const [currentDate, setCurrentDate] = useState('');

    // useEffect(() => {
    //     // Fetch data from the API when the component mounts
    //     fetch(endpoint + '/workplace/list')
    //         .then(response => response.json())
    //         .then(data => {
    //             // Update the state with the fetched data
    //             setWorkplaceList(data);
    //             // alert(data[0].workplaceName);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });

    //     const currentDate = new Date();
    //     const day = currentDate.getDate();
    //     const month = currentDate.getMonth() + 1; // Months are zero-based
    //     const year = currentDate.getFullYear();

    //     // Formatting the date to dd/mm/yyyy format
    //     const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

    //     setCurrentDate(formattedDate);
    // }, []); // The empty array [] ensures that the effect runs only once after the initial render

    // console.log(workplaceList);



    //x1
    /////////////////////////////////////////////
    const [addSalaryId, setAddSalaryId] = useState('');
    const [addSalaryName, setAddSalaryName] = useState('');

    const [roundOfSalary, setRoundOfSalary] = useState('');
    const [staffType, setStaffType] = useState('');

    const [addSalary, setAddSalary] = useState('');
    const [message, setMessage] = useState('');

    const [minusId, setMinusId] = useState('');
    const [misnusName, setMisnusName] = useState('');
    const [minusSalary, setMinusSalary] = useState('');
    const [minusmessage, setMinusmessage] = useState('');
    const [payType, setPayType] = useState('');
    const [installment, setInstallment] = useState('1');

    const [minusRoundOfSalary, setMinusRoundOfSalary] = useState('');
    const [minusStaffType, setMinusStaffType] = useState('');




    // const numberOfRows2 = 30; // Fixed number of rows
    const numberOfRows2 = 1; // Fixed number of rows

    const initialRowData2 = {
        id: '',
        name: '',
        SpSalary: '',
        roundOfSalary: '',
        StaffType: '',
        nameType: '',
        message: '',
    };

    const [rowDataList2, setRowDataList2] = useState(new Array(numberOfRows2).fill(initialRowData2));

    const numberOfRows = 1; // Fixed number of rows

    const initialRowData = {
        id: '',
        name: '',
        amount: '',
        payType: '',
        installment: '',
        nameType: '',
        message: '',

    };

    const [rowDataList, setRowDataList] = useState(new Array(numberOfRows).fill(initialRowData));


    useEffect(() => {
        const findObjectById = (id) => {
            return searchAddSalaryList.find(item => item.id === id);
        }

        const foundObject = findObjectById(addSalaryId);
        if (foundObject) {
            setAddSalaryName(foundObject.name); // Set only the name property
        }
    }, [addSalaryId, searchAddSalaryList]);

    useEffect(() => {
        const findObjectById = (id) => {
            return searchDeductSalaryList.find(item => item.id === id);
        }

        const foundObject = findObjectById(minusId);
        if (foundObject) {
            setMisnusName(foundObject.name); // Set only the name property
        }
    }, [minusId, searchDeductSalaryList]);


    ///////////////////
    function handleClickResult(emp) {
        // Populate all the startTime input fields with the search result value
        // alert(emp.employeeId);
        setEmployeeId(emp.employeeId);
        setName(emp.name);

        //select employee
    }


    //data for search
    const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
    const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
    const [searchResult, setSearchResult] = useState([]);

    async function handleSearch(event) {
        event.preventDefault();
        setRowDataList2([]);
        setRowDataList([]);

        // get value from form search
        const data = {
            employeeId: searchEmployeeId,
            name: searchEmployeeName,
            idCard: '',
            workPlace: '',
        };
        // alert(JSON.stringify(data,null,2));

        try {
            const response = await axios.post(endpoint + '/employee/search', data);
            await setSearchResult(response.data.employees);
            // alert(response.data.employees.length);
            if (response.data.employees.length < 1) {
                // window.location.reload();
                setEmployeeId('');
                setName('');
                alert('ไม่พบข้อมูล');
            } else {
                // alert(response.data.employees.length);

                //clean form 
                setSearchEmployeeId('');
                setSearchEmployeeName('');

                //result = 1 
                if (response.data.employees.length > 0) {
                    // Set search values
                    setEmployeeId(response.data.employees[0].employeeId);
                    setName(response.data.employees[0].name);
                    setLastName(response.data.employees[0].lastName);
                    setDataResult(response.data.employees[0]);
                    //  alert(response.data.employees[0].addSalary.length );
                    const newDataList = [];

                    response.data.employees[0].addSalary.map(item => {
                        let newRowData = {
                            id: item.id,
                            name: item.name,
                            SpSalary: item.SpSalary,
                            roundOfSalary: item.roundOfSalary,
                            StaffType: item.StaffType,
                            nameType: item.nameType,
                            message: item.message,
                        }


                        // Push a new row with specific data
                        newDataList.unshift(newRowData);

                    });

                    // Update the state with the new data
                    setRowDataList2(newDataList);

                    //deduct salary
                    const newDataList1 = [];
                    // alert(JSON.stringify(response.data.employees[0].deductSalary,null,2));

                    response.data.employees[0].deductSalary.map(item => {
                        let newRowData1 = {
                            id: item.id,
                            name: item.name,
                            amount: item.amount,
                            payType: item.payType,
                            installment: item.installment,
                            nameType: item.nameType,
                            message: item.message,
                        }

                        // Push a new row with specific data
                        newDataList1.unshift(newRowData1);

                    });

                    // Update the state with the new data
                    setRowDataList(newDataList1);


                    //x33

                }

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
            alert(error)
            // window.location.reload();
        }
    }



    async function handleManageWorkplace(event) {
        event.preventDefault();
        //get data from input in useState to data 
        const newRowData = await {
            id: addSalaryId || '',
            name: addSalaryName || '',
            SpSalary: addSalary || '',
            roundOfSalary: roundOfSalary || '',
            StaffType: staffType || '',
            nameType: '',
            message: message || '',
        };

        const newRowData2 = await {
            id: minusId || '',
            name: misnusName || '',
            amount: minusSalary || '',
            payType: payType || '',
            installment: installment || '',
            nameType: '',
            message: minusStaffType || '',
        };
        await addRow(newRowData);
        await addRow2(newRowData2);


        await setAddSalaryId('');
        await setAddSalaryName('');
        await setAddSalary('');
        await setRoundOfSalary('');
        await setStaffType('');
        await setMessage('');

        await setMinusId('');
        await setMisnusName('');
        await setMinusSalary('');
        await setPayType('');
        await setInstallment('');
        await setMinusmessage('');

    }


    // Function to add a new row to the rowDataList with specific values
    // const addRow = (newRowData) => {
    //     // Create a copy of the current state
    //     const newDataList = [...rowDataList2];
    //     // Push a new row with specific data
    //     // newDataList.push({ ...initialRowData, ...newRowData });
    //     newDataList.unshift(newRowData);
    //     // Update the state with the new data
    //     setRowDataList2(newDataList);
    // };

    // const addRow = (newRowData) => {
    //     // Check if the id already exists in the current list
    //     const idExists = rowDataList2.some((row) => row.id === newRowData.id);

    //     if (!idExists) {
    //         // If the id doesn't exist, add the new row to the start of the list
    //         const newDataList = [newRowData, ...rowDataList2];
    //         setRowDataList2(newDataList);
    //     } else {
    //         // Optionally, handle the case when the id already exists
    //         alert(`มีรหัส ${newRowData.id} ใช้งานแล้ว11111111`);
    //     }
    // };

    // const addRow2 = (newRowData2) => {
    //     // // Create a copy of the current state
    //     // const newDataList = [...rowDataList];
    //     // // Push a new row with specific data
    //     // // newDataList.push({ ...initialRowData, ...newRowData });
    //     // newDataList.unshift(newRowData2);
    //     // // Update the state with the new data
    //     // setRowDataList(newDataList);

    //     // Check if the id already exists in the current list
    //     const idExists2 = rowDataList.some((row) => row.id === newRowData2.id);

    //     if (!idExists2) {
    //         // If the id doesn't exist, add the new row to the start of the list
    //         const newDataList = [newRowData2, ...rowDataList];
    //         setRowDataList(newDataList);
    //     } else {
    //         // Optionally, handle the case when the id already exists
    //         alert(`มีรหัส ${newRowData2.id} ใช้งานแล้ว22222222222`);
    //     }
    // };

    const addRow = (newRowData) => {
        // Check if the id already exists in the current list
        const idExists = rowDataList2.some((row) => row.id === newRowData.id);

        if (!idExists) {
            // Add the new row to the start of the list
            const newDataList = [newRowData, ...rowDataList2];
            setRowDataList2(newDataList);
            setAddSalaryId('');
            setAddSalaryName('');
            setAddSalary('');
            setRoundOfSalary('');
            setStaffType('');
            setMessage('');
        } else {
            alert(`มีรหัส ${newRowData.id} ใช้งานแล้ว`);
            setAddSalaryId('');
            setAddSalaryName('');
            setAddSalary('');
            setRoundOfSalary('');
            setStaffType('');
            setMessage('');
        }
    };

    const addRow2 = (newRowData2) => {
        // Check if the id already exists in the current list
        const idExists2 = rowDataList.some((row) => row.id === newRowData2.id);

        if (!idExists2) {
            // Add the new row to the start of the list
            const newDataList = [newRowData2, ...rowDataList];
            setRowDataList(newDataList);
            setMinusId('');
            setMisnusName('');
            setMinusSalary('');
            setPayType('');
            setInstallment('');
            setMinusmessage('');
        } else {
            alert(`มีรหัส ${newRowData2.id} ใช้งานแล้ว`);
            setMinusId('');
            setMisnusName('');
            setMinusSalary('');
            setPayType('');
            setInstallment('');
            setMinusmessage('');
        }
    };

    // Function to handle editing a row
    const handleEditRow = async (index) => {
        // You can implement the edit logic here, e.g., open a modal for editing
        // console.log('Edit row at index:', index);
        const tmp = await rowDataList2[index];
        // alert(tmp.staffId);
        await setAddSalaryId(tmp.workplaceId);
        await setAddSalaryName(tmp.workplaceName);

    };


    // Function to handle deleting a row
    const handleDeleteRow = (index) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList2];
        // Remove the row at the specified index
        newDataList.splice(index, 1);
        // Update the state with the new data
        setRowDataList2(newDataList);
    };

    const handleDeleteRow2 = (index) => {
        // Create a copy of the current state
        const newDataList = [...rowDataList];
        // Remove the row at the specified index
        newDataList.splice(index, 1);
        // Update the state with the new data
        setRowDataList(newDataList);
    };


    async function handleCreateAddSalary(event) {
        event.preventDefault();
        // alert(dataResult._id);
        // alert(dataResult.addSalary);
        // alert(rowDataList2);
        dataResult.addSalary = await rowDataList2;
        dataResult.deductSalary = await rowDataList;

        try {
            const response = await axios.put(endpoint + '/employee/update/' + dataResult._id, dataResult);
            // setEmployeesResult(response.data.employees);
            if (response) {
                alert("บันทึกสำเร็จ");
                // localStorage.setItem('selectedEmployees' , JSON.stringify(response.data.employees));

                // window.location.reload();

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            alert(error);
            // window.location.reload();
        }

        // //get data from input in useState to data 
        // const data = {
        //     employeeId: employeeId,
        //     employeeName: name,
        //     onUpdate: currentDate || '',
        //     addSalary: rowDataList2,
        //     minusSalary: rowDataList,
        // };


        // try {
        // const response = await axios.post(endpoint + '/addsalary/create', data);
        // setEmployeesResult(response.data.employees);
        // if (response) {
        // alert("บันทึกสำเร็จ");
        // window.location.reload();

        // }
        // } catch (error) {
        // alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
        // window.location.reload();
        // }

    }
    console.log("rowDataList2", rowDataList2);

    console.log("rowDataList", rowDataList);

    /////////////////
    const [selectedOption, setSelectedOption] = useState('agencytime');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmitForm1 = (event) => {
        event.preventDefault();
        // Handle submission for Form 1
    };

    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบเงินเดือน</a></li>
                        <li class="breadcrumb-item active">ใบลงเวลาการปฏิบัติงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> เงินเพิ่ม เงินหักพนักงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
<!-- Main content --> */}
                    <section class="content">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <section class="Frame">
                                                <div class="col-md-12">
                                                    <form onSubmit={handleSearch}>
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <div class="form-group">
                                                                    <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                                    <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)}
                                                                        onInput={(e) => {
                                                                            // Remove any non-digit characters
                                                                            e.target.value = e.target.value.replace(
                                                                                /\D/g,
                                                                                ""
                                                                            );
                                                                        }} />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <div class="form-group">
                                                                    <label role="searchname">ชื่อพนักงาน</label>
                                                                    <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="d-flex justify-content-center">
                                                            <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
                                                        </div>
                                                    </form>
                                                    <br />
                                                    <div class="d-flex justify-content-center">
                                                        <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                                    </div>
                                                    <div class="d-flex justify-content-center">
                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <div class="form-group">
                                                                    <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                        {searchResult.map(employee => (
                                                                            <li
                                                                                key={employee.id}
                                                                                onClick={() => handleClickResult(employee)}
                                                                            >
                                                                                รหัส {employee.employeeId} ชื่อ{employee.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            {/* <!--Frame--> */}
                                        </div>
                                    </div>
                                    <form onSubmit={handleManageWorkplace}>

                                        <div class="row">
                                            <div class="col-md-12">
                                                <h3>ข้อมูลพนักงาน</h3>
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <div class="form-group">
                                                            <label role="addSalaryId">{employeeId}</label>
                                                        </div>
                                                    </div>

                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="addSalaryName">{name} {lastName} </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <div class="form-group">
                                                            <label role="addSalary">ปรับปรุงเงินเพิ่ม/เงินหักเมื่อ 01/01/2024</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="message"> พบข้อมูลเงินเพิ่มเงินหัก </label>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <h3>เงินเพิ่ม</h3>
                                                <section class="Frame">

                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <label role="addSalaryId">รหัส</label>
                                                            </div>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="addSalaryName">ชื่อ</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <label role="addSalary">จำนวนเงิน</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">รายวัน/รายเดือน</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">ประเภทพนักงาน</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <div class="form-group">
                                                                <label role="message">หมายเหตุ</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="addSalaryId" placeholder="รหัส" value={addSalaryId} onChange={(e) => setAddSalaryId(e.target.value)}
                                                                    onInput={(e) => {
                                                                        // Remove any non-digit characters
                                                                        e.target.value = e.target.value.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        );
                                                                    }} />
                                                            </div>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="addSalaryName" placeholder="ชื่อ" value={addSalaryName} onChange={(e) => setAddSalaryName(e.target.value)} />
                                                            </div>
                                                        </div>

                                                        <div class="col-md-1">
                                                            <input type="text" class="form-control" id="addSalary" placeholder="จำนวนเงิน" value={addSalary} onChange={(e) => setAddSalary(e.target.value)}
                                                                onInput={(e) => {
                                                                    // Remove any non-digit characters
                                                                    e.target.value = e.target.value.replace(
                                                                        /[^0-9.]/g,
                                                                        ""
                                                                    );

                                                                    // Ensure only one '.' is allowed
                                                                    const parts = e.target.value.split(".");
                                                                    if (parts.length > 2) {
                                                                        e.target.value = `${parts[0]}.${parts[1]}`; // Keep only the first two parts
                                                                    }
                                                                }} />
                                                        </div>
                                                        <div class="col-md-2">
                                                            <select
                                                                name="roundOfSalary"
                                                                className="form-control"
                                                                value={roundOfSalary}
                                                                onChange={(e) => setRoundOfSalary(e.target.value)}
                                                            >
                                                                <option value="">เลือก</option>
                                                                <option value="daily">รายวัน</option>
                                                                <option value="monthly">รายเดือน</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select
                                                                name="StaffType"
                                                                className="form-control"
                                                                value={staffType}
                                                                onChange={(e) => setStaffType(e.target.value)}
                                                            >
                                                                <option value="">เลือกตำแหน่งที่จะมอบให้</option>
                                                                <option value="all">ทั้งหมด</option>

                                                                <option value="หัวหน้าควบคุมงาน">
                                      หัวหน้าควบคุมงาน
                                    </option>
                                    <option value="ผู้ช่วยผู้ควบคุมงาน">
                                      ผู้ช่วยผู้ควบคุมงาน
                                    </option>
                                    <option value="พนักงานทำความสะอาด">
                                      พนักงานทำความสะอาด
                                    </option>
                                    <option value="พนักงานทำความสะอาดรอบนอก">
                                      พนักงานทำความสะอาดรอบนอก
                                    </option>
                                    <option value="พนักงานเสิร์ฟ">
                                      พนักงานเสิร์ฟ
                                    </option>
                                    <option value="พนักงานคนสวน">
                                      พนักงานคนสวน
                                    </option>
                                    <option value="พนักงานแรงงานชาย">
                                      พนักงานแรงงานชาย
                                    </option>
                                    <option value="กรรมการผู้จัดการ">
                                      กรรมการผู้จัดการ
                                    </option>
                                    <option value="ผู้จัดการทั่วไป">
                                      ผู้จัดการทั่วไป
                                    </option>
                                    <option value="ผู้จัดการฝ่ายการตลาด">
                                      ผู้จัดการฝ่ายการตลาด
                                    </option>
                                    <option value="ผู้จัดการฝ่ายบัญชี/การเงิน">
                                      ผู้จัดการฝ่ายบัญชี/การเงิน
                                    </option>
                                    <option value="ผู้จัดการฝ่ายบุคคล">
                                      ผู้จัดการฝ่ายบุคคล
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายบัญชี/การเงิน">
                                      เจ้าหน้าที่ฝ่ายบัญชี/การเงิน
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายบุคคล">
                                      เจ้าหน้าที่ฝ่ายบุคคล
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายจัดซื้อ">
                                      เจ้าหน้าที่ฝ่ายจัดซื้อ
                                    </option>
                                    <option value="เจ้าหน้าที่ธุรการฝ่ายขาย">
                                      เจ้าหน้าที่ธุรการฝ่ายขาย
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายการตลาด">
                                      เจ้าหน้าที่ฝ่ายการตลาด
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายปฏิบัติการ">
                                      เจ้าหน้าที่ฝ่ายปฏิบัติการ
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายปฏิบัติการ(สายตรวจ)">
                                      เจ้าหน้าที่ฝ่ายปฏิบัติการ(สายตรวจ)
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายยานพาหนะ">
                                      เจ้าหน้าที่ฝ่ายยานพาหนะ
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายไอที">
                                      เจ้าหน้าที่ฝ่ายไอที
                                    </option>
                                    <option value="เจ้าหน้าที่ฝ่ายสโตร์">
                                      เจ้าหน้าที่ฝ่ายสโตร์
                                    </option>
                                    <option value="เจ้าหน้าที่ความปลอดภัยในการทำงาน(จป)">
                                      เจ้าหน้าที่ความปลอดภัยในการทำงาน(จป)
                                    </option>
                                    <option value="ธุรการทั่วไป">
                                      ธุรการทั่วไป
                                    </option>
                                    <option value="หัวหน้าฝ่ายปฏิบัติการ">
                                      หัวหน้าฝ่ายปฏิบัติการ
                                    </option>
                                    <option value="หัวหน้าฝ่ายบัญชี/การเงิน">
                                      หัวหน้าฝ่ายบัญชี/การเงิน
                                    </option>
                                    <option value="หัวหน้าฝ่ายสโตร์">
                                      หัวหน้าฝ่ายสโตร์
                                    </option>

                                                            </select>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="message" placeholder="หมายเหตุ" value={message} onChange={(e) => setMessage(e.target.value)} />
                                                        </div>
                                                        {/* <div class="col-md-2">
                                                            <div class="d-flex align-items-end">
                                                                <button class="btn b_save"><i class="fas fa-check"
                                                                onClick={() => {                                            
                                                                    // Call the addRow function
                                                                    addRow(newRowData);
                                                                  }}
                                                                ></i> &nbsp; เพิ่ม</button>
                                                            </div>
                                                        </div> */}
                                                        <div className="col-md-2">
                                                            <div className="d-flex align-items-end">
                                                                <button
                                                                    type="button"
                                                                    className="btn b_save"
                                                                    onClick={() => {
                                                                        const newRowData = {
                                                                            id: addSalaryId || '',
                                                                            name: addSalaryName || '',
                                                                            SpSalary: addSalary || '',
                                                                            roundOfSalary: roundOfSalary || '',
                                                                            StaffType: staffType || '',
                                                                            nameType: '',
                                                                            message: message || '',
                                                                        };
                                                                        addRow(newRowData);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-check"></i> &nbsp; เพิ่ม
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>


                                                    <section class="Frame">
                                                        <div class="row">
                                                            <div class="col-md-1">
                                                                <div class="form-group">
                                                                    <label role="addSalaryId">รหัส</label>
                                                                </div>
                                                            </div>

                                                            <div class="col-md-2">
                                                                <div class="form-group">
                                                                    <label role="addSalaryName">ชื่อ</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-1">
                                                                <div class="form-group">
                                                                    <label role="addSalary">จำนวนเงิน</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-2">
                                                                <div class="form-group">
                                                                    <label role="">รายวัน/รายเดือน</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-2">
                                                                <div class="form-group">
                                                                    <label role="">ประเภทพนักงาน</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-3">
                                                                <div class="form-group">
                                                                    <label role="message">หมายเหตุ</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-12">

                                                                {rowDataList2.map((item, index) => (
                                                                    item.name && (
                                                                        <div key={index}>
                                                                            <div class="row" style={{ marginBottom: '1rem', borderBottom: '2px solid #000' }}>
                                                                                <div class="col-md-1" style={bordertable}> {item.id}</div>
                                                                                <div class="col-md-2" style={bordertable}> {item.name} </div>
                                                                                <div class="col-md-1" style={bordertable}> {item.SpSalary} </div>

                                                                                {item.roundOfSalary == "daily" && (
                                                                                    <div class="col-md-2" style={bordertable}>รายวัน</div>
                                                                                )}
                                                                                {item.roundOfSalary == "monthly" && (
                                                                                    <div class="col-md-2" style={bordertable}>รายเดือน</div>
                                                                                )}

                                                                                {item.StaffType == "header" && (
                                                                                    <div class="col-md-2" style={bordertable}>หัวหน้างาน</div>
                                                                                )}

                                                                                {item.StaffType == "all" && (
                                                                                    <div class="col-md-2" style={bordertable}>พนักงาน</div>
                                                                                )}

                                                                                <div class="col-md-2" style={bordertable}> {item.message} </div>
                                                                                <div class="col-md-2" style={bordertable}>
                                                                                    {/* <button onClick={() => handleEditRow(index)}>Edit</button> */}
                                                                                    <button class="btn btn-xs btn-danger" style={{ padding: '0.3rem ', addSalaryIdth: '8rem' }} onClick={() => handleDeleteRow(index)}>ลบ</button>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    )
                                                                ))}

                                                            </div>
                                                        </div>
                                                    </section>
                                                </section>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <h3>เงินหัก</h3>
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <label role="addSalaryId">รหัส</label>
                                                            </div>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="addSalaryName">ชื่อ</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="addSalary">จำนวนเงิน</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">การหักเงิน</label>
                                                            </div>
                                                        </div>
                                                        {/* <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">จำนวนงวด</label>
                                                            </div>
                                                        </div> */}
                                                        <div class="col-md-3">
                                                            <div class="form-group">
                                                                <label role="message">หมายเหตุ</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="addSalaryId" placeholder="รหัส" value={minusId} onChange={(e) => setMinusId(e.target.value)}
                                                                    onInput={(e) => {
                                                                        // Remove any non-digit characters
                                                                        e.target.value = e.target.value.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <input type="text" class="form-control" id="addSalaryName" placeholder="ชื่อ" value={misnusName} onChange={(e) => setMisnusName(e.target.value)} />
                                                            </div>
                                                        </div>

                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="addSalaryName" placeholder="จำนวนเงิน" value={minusSalary} onChange={(e) => setMinusSalary(e.target.value)}
                                                                onInput={(e) => {
                                                                    // Remove any non-digit characters
                                                                    e.target.value = e.target.value.replace(
                                                                        /[^0-9.]/g,
                                                                        ""
                                                                    );

                                                                    // Ensure only one '.' is allowed
                                                                    const parts = e.target.value.split(".");
                                                                    if (parts.length > 2) {
                                                                        e.target.value = `${parts[0]}.${parts[1]}`; // Keep only the first two parts
                                                                    }
                                                                }} />
                                                        </div>

                                                        <div class="col-md-2">
                                                            <select
                                                                name="roundOfSalary"
                                                                className="form-control"
                                                                value={payType}
                                                                onChange={(e) => setPayType(e.target.value)}
                                                            >
                                                                <option value="">เลือก</option>
                                                                <option value="immedate">ทั้งหมด</option>
                                                                <option value="installment">ผ่อนจ่าย</option>
                                                            </select>
                                                        </div>
                                                        {/* <div className="col-md-2">

                                                            {payType == "installment" ? (
                                                                <select
                                                                    name="StaffType"
                                                                    className="form-control"
                                                                    value={installment}
                                                                    onChange={(e) => setInstallment(e.target.value)}
                                                                >
                                                                    <option value="">เลือกจำนวนงวด</option>
                                                                    <option value="2">2 งวด {minusSalary / 2}</option>
                                                                    <option value="3">3 งวด {minusSalary / 3}</option>
                                                                    <option value="4">4 งวด {minusSalary / 4}</option>
                                                                    <option value="5">5 งวด {minusSalary / 5}</option>
                                                                    <option value="6">6 งวด {minusSalary / 6}</option>
                                                                </select>
                                                            ) : (
                                                                <select
                                                                    name="StaffType"
                                                                    className="form-control"
                                                                    value={installment}
                                                                    onChange={(e) => setInstallment(e.target.value)}
                                                                >
                                                                    <option value="1">1 งวด {minusSalary}</option>
                                                                </select>
                                                            )}

                                                        </div> */}

                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="minusStaffType" placeholder="หมายเหตุ" value={minusStaffType} onChange={(e) => setMinusStaffType(e.target.value)} />
                                                        </div>
                                                        {/* <div class="col-md-2">
                                                            <div class="d-flex align-items-end">
                                                                <button class="btn b_save"><i class="fas fa-check"
                                                                onClick={() => {                                            
                                                                    // Call the addRow function
                                                                    addRow2(newRowData2);
                                                                  }}
                                                                ></i> &nbsp; เพิ่ม</button>
                                                            </div>
                                                        </div> */}
                                                        <div className="col-md-2">
                                                            <div className="d-flex align-items-end">
                                                                <button
                                                                    type="button"
                                                                    className="btn b_save"
                                                                    onClick={() => {
                                                                        const newRowData2 = {
                                                                            id: minusId || '',
                                                                            name: misnusName || '',
                                                                            amount: minusSalary || '',
                                                                            payType: payType || '',
                                                                            installment: installment || '',
                                                                            nameType: '',
                                                                            message: minusStaffType || '',
                                                                        };
                                                                        addRow2(newRowData2);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-check"></i> &nbsp; เพิ่ม
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <section class="Frame">
                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <div class="row">
                                                                    <div class="col-md-1">
                                                                        <div class="form-group">
                                                                            <label role="addSalaryId">รหัส</label>
                                                                        </div>
                                                                    </div>

                                                                    <div class="col-md-2">
                                                                        <div class="form-group">
                                                                            <label role="addSalaryName">ชื่อ</label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-2">
                                                                        <div class="form-group">
                                                                            <label role="addSalary">จำนวนเงิน</label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-2">
                                                                        <div class="form-group">
                                                                            <label role="">การหักเงิน</label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="col-md-2">
                                                                        <div class="form-group">
                                                                            <label role="">จำนวนงวด</label>
                                                                        </div>
                                                                    </div> */}
                                                                    <div class="col-md-3">
                                                                        <div class="form-group">
                                                                            <label role="message">หมายเหตุ</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-12">


                                                                {rowDataList.map((item, index) => (
                                                                    item.name && (
                                                                        <div key={index}>
                                                                            <div class="row" style={{ marginBottom: '1rem', borderBottom: '2px solid #000' }}>
                                                                                {/* <div class="col-md-1" style={bordertable}> {item.id}</div>
                                                                                <div class="col-md-2" style={bordertable}> {item.name} </div>
                                                                                <div class="col-md-2" style={bordertable}> {item.SpSalary} </div>

                                                                                <div class="col-md-2" style={bordertable}> {item.SpSalary} </div>
                                                                                <div class="col-md-2" style={bordertable}> {item.SpSalary} </div>

                                                                                <div class="col-md-2" style={bordertable}> {item.message} </div> */}

                                                                                <div class="col-md-1" style={bordertable}> {item.id}</div>
                                                                                <div class="col-md-2" style={bordertable}> {item.name} </div>
                                                                                <div class="col-md-2" style={bordertable}> {item.amount} </div>

                                                                                {item.payType == "immedate" && (
                                                                                    <div class="col-md-2" style={bordertable}>จ่ายทั้งหมด</div>
                                                                                )}
                                                                                {item.payType == "installment" && (
                                                                                    <div class="col-md-2" style={bordertable}>ผ่อนจ่าย</div>
                                                                                )}

                                                                                {/* <div class="col-md-2" style={bordertable}>{item.installment}</div> */}

                                                                                <div class="col-md-2" style={bordertable}> {item.message} </div>

                                                                                {/* <div class="col-md-2" style={bordertable}>
                                                                                    <button class="btn btn-xs btn-danger" style={{ padding: '0.3rem ', addSalaryIdth: '8rem' }} onClick={() => handleDeleteRow2(index)}>ลบ</button>
                                                                                </div> */}
                                                                                <button
                                                                                    className="btn btn-xs btn-danger"
                                                                                    style={{ padding: '0.3rem', width: '8rem' }}
                                                                                    onClick={() => handleDeleteRow2(index)}
                                                                                >
                                                                                    ลบ
                                                                                </button>

                                                                            </div>
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </section>
                                                </section>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h3>เงินคงค้าง</h3>
                                                <section class="Frame">
                                                    0
                                                </section>
                                            </div>
                                        </div>






                                        <div class="form-group">

                                            <button class="btn b_save" onClick={handleCreateAddSalary}><i class="nav-icon fas fa-save"></i> &nbsp; บันทึก</button>

                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                </div>

            </div>
            {/* {JSON.stringify(rowDataList2, null, 2)} */}
        </body>

    )
}

export default AddEditSalaryEmployee