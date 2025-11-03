import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

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

    // Loan Modal States
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [isEditingLoan, setIsEditingLoan] = useState(false);
    const [loanDate, setLoanDate] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanContractCode, setLoanContractCode] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanPeriod, setLoanPeriod] = useState('');
    const [loanNote, setLoanNote] = useState('');
    const [loanList, setLoanList] = useState([]);
    const [monthlyPayments, setMonthlyPayments] = useState([]);
    const [editingLoan, setEditingLoan] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

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

    // Handle ESC key for modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.keyCode === 27) {
                setShowLoanModal(false);
            }
        };

        if (showLoanModal) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showLoanModal]);


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
    const [socialSecurityType, setSocialSecurityType] = useState('');
    const [socialSecurityCheck, setSocialSecurityCheck] = useState(null); // null = ไม่ระบุ, true = คิด, false = ไม่คิด

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
    const [minusSocialSecurityType, setMinusSocialSecurityType] = useState('');
    const [minusSocialSecurityCheck, setMinusSocialSecurityCheck] = useState(null); // null = ไม่ระบุ, true = คิด, false = ไม่คิด

    // Toast Notification States
    const [toastList, setToastList] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState({
        title: '',
        message: '',
        onConfirm: null
    });
    
    // useRef เพื่อเก็บ timestamp ของ toast ล่าสุด
    const lastToastRef = useRef({ message: '', timestamp: 0 });

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
        socialSecurityCheck: null, // null = ไม่ระบุ
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
        socialSecurityCheck: null, // null = ไม่ระบุ

    };

    const [rowDataList, setRowDataList] = useState(new Array(numberOfRows).fill(initialRowData));
searchDeductSalaryList

    // Toast Notification Function
    const showToast = (message, type = 'success') => {
        const now = Date.now();
        
        // ป้องกัน toast ซ้ำ - ตรวจสอบว่าข้อความเดียวกันถูกเรียกภายใน 500ms หรือไม่
        if (lastToastRef.current.message === message && 
            (now - lastToastRef.current.timestamp) < 500) {
            return; // ไม่แสดง toast ถ้าเป็นข้อความเดียวกันภายในเวลา 500ms
        }
        
        // อัพเดต timestamp
        lastToastRef.current = { message, timestamp: now };
        
        const id = now;
        const newToast = { id, message, type };
        setToastList(prev => [...prev, newToast]);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            setToastList(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    // Confirm Modal Function
    const showConfirm = (title, message, onConfirm) => {
        setConfirmModalData({ title, message, onConfirm });
        setShowConfirmModal(true);
    };

    const handleConfirmYes = () => {
        if (confirmModalData.onConfirm) {
            confirmModalData.onConfirm();
        }
        setShowConfirmModal(false);
    };

    const handleConfirmNo = () => {
        setShowConfirmModal(false);
    };

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
    // ป้องกันการทำงานตอนแก้ไข loan
    if (isEditingLoan || isEditMode) {
        return;
    }
    
    const findObjectById = (id) => {
        // ค้นหาจาก searchDeductSalaryList ก่อน (master data)
        let foundItem = searchDeductSalaryList.find(item => item.id === id);
        
        // ถ้าไม่เจอ ค้นหาจาก rowDataList (รายการที่เพิ่มแล้ว)
        if (!foundItem) {
            foundItem = rowDataList.find(item => item.id === id);
        }
        
        return foundItem;
    }

    const foundObject = findObjectById(minusId);
    if (foundObject) {
        setMisnusName(foundObject.name);
    } else if (minusId === '') {
        // ถ้า minusId เป็นค่าว่าง ให้ clear ชื่อด้วย
        setMisnusName('');
    }
}, [minusId, searchDeductSalaryList, rowDataList, isEditingLoan, isEditMode]);

// เพิ่ม useEffect สำหรับจัดการ ESC key และ loan modal
useEffect(() => {
    const handleEscKey = (event) => {
        if (event.keyCode === 27) {
            setShowLoanModal(false);
        }
    };

    if (showLoanModal) {
        document.addEventListener('keydown', handleEscKey);
    }

    return () => {
        document.removeEventListener('keydown', handleEscKey);
    };
}, [showLoanModal]);


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
                showToast('ไม่พบข้อมูลพนักงาน', 'error');
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
                            // แปลงค่า socialSecurityCheck: null (ไม่ระบุ), true (คิด), false (ไม่คิด)
                            socialSecurityCheck: item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด" 
                                ? true 
                                : item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด"
                                ? false
                                : null
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
                            // แปลงค่า socialSecurityCheck: null (ไม่ระบุ), true (คิด), false (ไม่คิด)
                            socialSecurityCheck: item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด"
                                ? true
                                : item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด"
                                ? false
                                : null
                        }

                        // Push a new row with specific data
                        newDataList1.unshift(newRowData1);

                    });

                    // Update the state with the new data
                    setRowDataList(newDataList1);

                    // โหลดข้อมูลเงินกู้ (loanRecords)
                    if (response.data.employees[0].loanRecords && response.data.employees[0].loanRecords.length > 0) {
                        const loadedLoans = response.data.employees[0].loanRecords.map((loanRecord, index) => ({
                            id: loanRecord.loanId || `loan_${Date.now()}_${index}`,
                            date: loanRecord.loanDate ? new Date(loanRecord.loanDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            amount: loanRecord.loanAmount || 0,
                            contractCode: loanRecord.contractCode || '',
                            loanCode: loanRecord.deductSalaryId || '',
                            loanName: loanRecord.deductSalaryName || '',
                            period: loanRecord.loanPeriod || 0,
                            monthlyPayments: loanRecord.monthlyPayments ? loanRecord.monthlyPayments.map(payment => ({
                                id: payment.installmentId,
                                monthName: payment.monthName,
                                amount: payment.amount || 0
                            })) : [],
                            totalPaid: loanRecord.summary ? loanRecord.summary.totalPaid : 0,
                            remaining: loanRecord.summary ? loanRecord.summary.totalRemaining : loanRecord.loanAmount,
                            note: loanRecord.note || ''
                        }));
                        
                        setLoanList(loadedLoans);
                    } else {
                        setLoanList([]);
                    }


                    //x33

                }

            }
        } catch (error) {
            showToast('กรุณาตรวจสอบข้อมูลในช่องค้นหา', 'error');
            console.error(error);
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
            socialSecurityType: socialSecurityType || '',
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
        await setSocialSecurityType('');
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
        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!newRowData.id || !newRowData.name || !newRowData.SpSalary) {
            showToast('เพิ่มล้มเหลว กรุณาใส่ข้อมูลให้ครบถ้วน (รหัส, ชื่อ, จำนวนเงิน)', 'error');
            return;
        }

        // Check if the id already exists in the current list
        const idExists = rowDataList2.some((row) => row.id === newRowData.id);

        if (!idExists) {
            // Add socialSecurityCheck to newRowData
            const updatedRowData = {
                ...newRowData,
                socialSecurityCheck: socialSecurityCheck // Include the current checkbox state
            };
            
            // Add the new row to the start of the list
            const newDataList = [updatedRowData, ...rowDataList2];
            setRowDataList2(newDataList);
            setAddSalaryId('');
            setAddSalaryName('');
            setAddSalary('');
            setRoundOfSalary('');
            setStaffType('');
            setMessage('');
            setSocialSecurityCheck(null); // Reset เป็น null (ไม่ระบุ)
            showToast('เพิ่มรายการเงินเพิ่มสำเร็จ', 'success');
        } else {
            showToast(`เพิ่มล้มเหลว มีรหัส ${newRowData.id} ใช้งานแล้ว`, 'error');
        }
    };

    const addRow2 = (newRowData2) => {
        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!newRowData2.id || !newRowData2.name || !newRowData2.amount) {
            showToast('เพิ่มล้มเหลว กรุณาใส่ข้อมูลให้ครบถ้วน (รหัส, ชื่อ, จำนวนเงิน)', 'error');
            return;
        }

        // Check if the id already exists in the current list
        const idExists2 = rowDataList.some((row) => row.id === newRowData2.id);

        if (!idExists2) {
            // Add socialSecurityCheck to newRowData2
            const updatedRowData2 = {
                ...newRowData2,
                socialSecurityCheck: minusSocialSecurityCheck // Include the current checkbox state
            };
            
            // Add the new row to the start of the list
            const newDataList = [updatedRowData2, ...rowDataList];
            setRowDataList(newDataList);
            setMinusId('');
            setMisnusName('');
            setMinusSalary('');
            setPayType('');
            setInstallment('');
            setMinusmessage('');
            setMinusSocialSecurityCheck(null); // Reset เป็น null (ไม่ระบุ)
            showToast('เพิ่มรายการเงินหักสำเร็จ', 'success');
        } else {
            showToast(`เพิ่มล้มเหลว มีรหัส ${newRowData2.id} ใช้งานแล้ว`, 'error');
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
        const item = rowDataList2[index];
        showConfirm(
            'ยืนยันการลบ',
            `คุณต้องการลบรายการเงินเพิ่มนี้หรือไม่?\n\nรหัส: ${item.id}\nชื่อ: ${item.name}\nจำนวนเงิน: ${Number(item.SpSalary).toLocaleString()} บาท`,
            () => {
                // Create a copy of the current state
                const newDataList = [...rowDataList2];
                // Remove the row at the specified index
                newDataList.splice(index, 1);
                // Update the state with the new data
                setRowDataList2(newDataList);
                showToast('ลบรายการเงินเพิ่มสำเร็จ', 'success');
            }
        );
    };

    const handleDeleteRow2 = (index) => {
        const item = rowDataList[index];
        showConfirm(
            'ยืนยันการลบ',
            `คุณต้องการลบรายการเงินหักนี้หรือไม่?\n\nรหัส: ${item.id}\nชื่อ: ${item.name}\nจำนวนเงิน: ${Number(item.amount).toLocaleString()} บาท`,
            () => {
                // Create a copy of the current state
                const newDataList = [...rowDataList];
                // Remove the row at the specified index
                newDataList.splice(index, 1);
                // Update the state with the new data
                setRowDataList(newDataList);
                showToast('ลบรายการเงินหักสำเร็จ', 'success');
            }
        );
    };


    async function handleCreateAddSalary(event) {
        event.preventDefault();
        // alert(dataResult._id);
        // alert(dataResult.addSalary);
        // alert(rowDataList2);
        
        // 🆕 กรองเฉพาะรายการที่มีข้อมูล (ไม่รวมแถวว่าง)
        const validAddSalary = rowDataList2.filter(item => item.id && item.name);
        const validDeductSalary = rowDataList.filter(item => item.id && item.name);
        
        console.log('📝 validAddSalary:', validAddSalary);
        console.log('📝 validDeductSalary:', validDeductSalary);
        
        // 🆕 บันทึกลง newAddSalary และ newDeductSalary (รองรับ socialSecurityCheck)
        dataResult.newAddSalary = validAddSalary;
        dataResult.newDeductSalary = validDeductSalary;
        
        // เก็บข้อมูลเดิมไว้ด้วย (backward compatibility)
        dataResult.addSalary = validAddSalary;
        dataResult.deductSalary = validDeductSalary;
        
        // เพิ่มการบันทึกข้อมูลเงินกู้
        if (loanList && loanList.length > 0) {
            // แปลงข้อมูล loanList ให้ตรงกับ schema ของ database
            const loanRecords = loanList.map(loan => ({
                contractCode: loan.contractCode,
                loanDate: new Date(loan.date),
                loanAmount: Number(loan.amount),
                loanPeriod: Number(loan.period),
                interestRate: 0, // ถ้ามีระบบดอกเบี้ยให้เพิ่มตรงนี้
                deductSalaryId: loan.loanCode,
                deductSalaryName: loan.loanName,
                status: 'active',
                note: loan.note || '',
                monthlyPayments: loan.monthlyPayments ? loan.monthlyPayments.map((payment, index) => ({
                    installmentId: payment.id,
                    monthYear: payment.monthName,
                    monthName: payment.monthName,
                    dueDate: new Date(),
                    amount: Number(payment.amount) || 0,
                    status: 'pending'
                })) : [],
                summary: {
                    totalAmount: Number(loan.amount),
                    totalPaid: Number(loan.totalPaid) || 0,
                    totalRemaining: Number(loan.remaining) || Number(loan.amount),
                    completedInstallments: 0,
                    remainingInstallments: Number(loan.period),
                    progressPercent: loan.amount > 0 ? Math.round(((loan.totalPaid || 0) / loan.amount) * 100) : 0
                }
            }));
            
            dataResult.loanRecords = loanRecords;
            console.log('Loan records to save:', loanRecords); // Debug log
        }

        console.log('Data to send to API:', dataResult); // Debug log

        try {
            const response = await axios.put(endpoint + '/employee/update/' + dataResult._id, dataResult);
            // setEmployeesResult(response.data.employees);
            if (response) {
                // แสดงรายละเอียดการบันทึก
                let saveMessage = "บันทึกสำเร็จ!";
                if (dataResult.loanRecords && dataResult.loanRecords.length > 0) {
                    saveMessage += `\n- บันทึกข้อมูลเงินกู้ ${dataResult.loanRecords.length} รายการ`;
                }
                if (dataResult.addSalary && dataResult.addSalary.length > 0) {
                    saveMessage += `\n- บันทึกข้อมูลเงินเพิ่ม ${dataResult.addSalary.length} รายการ`;
                }
                if (dataResult.deductSalary && dataResult.deductSalary.length > 0) {
                    saveMessage += `\n- บันทึกข้อมูลเงินหัก ${dataResult.deductSalary.length} รายการ`;
                }
                
                showToast(saveMessage, 'success');
                // localStorage.setItem('selectedEmployees' , JSON.stringify(response.data.employees));

                // window.location.reload();

            }
        } catch (error) {
            console.error('Error saving data:', error);
            if (error.response) {
                showToast(`เกิดข้อผิดพลาดในการบันทึก: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`, 'error');
            } else {
                showToast('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล', 'error');
            }
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

// ...existing code...

const handleAddLoan = () => {
    // ตรวจสอบข้อมูลพื้นฐาน
    if (!loanAmount || !loanContractCode || !minusId || !misnusName || !interestRate) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน:\n- จำนวนเงิน\n- รหัสสัญญาเงินกู้\n- รหัสเงินหัก\n- ชื่อรายการเงินหัก\n- ระยะเวลา', 'error');
        return;
    }

    // ตรวจสอบว่ามีการใส่ยอดเงินในเดือนใดเดือนหนึ่งอย่างน้อง
    if (!monthlyPayments || monthlyPayments.length === 0) {
        showToast('กรุณาเลือกระยะเวลาผ่อนชำระก่อน', 'error');
        return;
    }

    const hasAmount = monthlyPayments.some(month => month.amount && Number(month.amount) > 0);
    if (!hasAmount) {
        showToast('กรุณาใส่ยอดเงินอย่างน้อยหนึ่งเดือน', 'error');
        return;
    }

    const amount = Number(loanAmount);
    const period = Number(interestRate); // ใช้ interestRate เป็นระยะเวลา
    const totalPaid = calculateTotalPaid(monthlyPayments);
    const remaining = calculateRemaining(amount, totalPaid);

    if (isEditMode && editingLoan) {
        // แก้ไขรายการเดิม
        const updatedLoan = {
            ...editingLoan,
            amount: amount,
            contractCode: loanContractCode,
            loanCode: minusId,
            loanName: misnusName,
            period: period,
            monthlyPayments: [...monthlyPayments],
            totalPaid: totalPaid,
            remaining: remaining,
            note: loanNote
        };

        setLoanList(loanList.map(loan => 
            loan.id === editingLoan.id ? updatedLoan : loan
        ));
        showToast('แก้ไขรายการเงินกู้เรียบร้อยแล้ว', 'success');
    } else {
        // เพิ่มรายการใหม่
        const newLoan = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            amount: amount,
            contractCode: loanContractCode,
            loanCode: minusId,
            loanName: misnusName,
            period: period,
            monthlyPayments: [...monthlyPayments],
            totalPaid: totalPaid,
            remaining: remaining,
            note: loanNote
        };

        setLoanList([...loanList, newLoan]);
        showToast('เพิ่มรายการเงินกู้เรียบร้อยแล้ว', 'success');
    }
    
    // Reset form
    resetLoanForm();
    setShowLoanModal(false);
};



const handleEditLoan = (loan) => {
    try {
        // ตรวจสอบข้อมูล loan object
        if (!loan || !loan.id) {
            showToast('ข้อมูลรายการเงินกู้ไม่ถูกต้อง', 'error');
            return;
        }

        // ตั้งสถานะก่อนเพื่อป้องกัน useEffect
        setIsEditingLoan(true);
        setIsEditMode(true);
        setEditingLoan(loan);
        
        // ตั้งค่าข้อมูลพื้นฐาน
        setLoanAmount(loan.amount ? loan.amount.toString() : '');
        setLoanContractCode(loan.contractCode || '');
        setInterestRate(loan.period ? loan.period.toString() : '');
        setLoanNote(loan.note || '');
        
        // ตั้งค่า monthlyPayments และตรวจสอบให้แน่ใจว่าเป็น array
        const payments = loan.monthlyPayments || [];
        if (Array.isArray(payments)) {
            setMonthlyPayments([...payments]);
        } else {
            setMonthlyPayments([]);
        }
        
        // ตั้งค่ารหัสและชื่อเงินหักในลำดับสุดท้าย
        // และใช้ setTimeout เพื่อให้ isEditingLoan ได้ set ก่อน
        setTimeout(() => {
            const loanCode = loan.loanCode || '';
            const loanName = loan.loanName || '';
            
            setMinusId(loanCode);
            setMisnusName(loanName);
            
            setShowLoanModal(true);
            
            // รอให้ modal เปิดสมบูรณ์แล้วค่อย reset flag
            setTimeout(() => {
                setIsEditingLoan(false);
            }, 1000);
        }, 100);
        
    } catch (error) {
        console.error('Error in handleEditLoan:', error);
        showToast('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
};

    // ฟังก์ชันสำหรับ reset form data
const resetLoanForm = () => {
    setIsEditingLoan(true); // ป้องกัน useEffect ตอน reset
    
    setLoanAmount('');
    setLoanContractCode('');
    setMinusId('');
    setMisnusName('');
    setInterestRate('');
    setLoanNote('');
    setMonthlyPayments([]);
    setIsEditMode(false);
    setEditingLoan(null);
    
    // รอสักครู่แล้วค่อย reset flag
    setTimeout(() => {
        setIsEditingLoan(false);
    }, 100);
};

    const handleDeleteLoan = (id) => {
        const loanToDelete = loanList.find(loan => loan.id === id);
        showConfirm(
            'ยืนยันการลบเงินกู้',
            `คุณต้องการลบรายการเงินกู้นี้หรือไม่?\n\nรหัสสัญญา: ${loanToDelete?.contractCode || ''}\nจำนวนเงิน: ${Number(loanToDelete?.amount || 0).toLocaleString()} บาท\n\n(ต้องกดบันทึกเพื่อยืนยันการลบ)`,
            () => {
                // แค่ลบออกจาก state ในหน้า UI เท่านั้น 
                // การลบจริงจะเกิดขึ้นเมื่อกดปุ่ม "บันทึก"
                setLoanList(loanList.filter(loan => loan.id !== id));
                
                // แสดงข้อความแจ้งเตือน
                showToast('ลบรายการออกจากหน้าจอแล้ว กรุณากดปุ่ม "บันทึก" เพื่อยืนยันการลบข้อมูลในระบบ', 'success');
            }
        );
    };

    // ...existing code...

// ฟังก์ชันสำหรับคำนวณยอดรวมที่จ่ายแล้ว
const calculateTotalPaid = (monthlyPayments) => {
    if (!monthlyPayments || !Array.isArray(monthlyPayments)) return 0;
    return monthlyPayments.reduce((sum, payment) => {
        return sum + (Number(payment.amount) || 0);
    }, 0);
};

// ฟังก์ชันสำหรับคำนวณยอดคงเหลือ
const calculateRemaining = (totalAmount, totalPaid) => {
    return Math.max(0, Number(totalAmount) - Number(totalPaid));
};

// ...existing code...

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
        <div class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <span>หน้าหลัก</span></li>
                        <li class="breadcrumb-item"><span> ระบบเงินเดือน</span></li>
                        <li class="breadcrumb-item active">ใบลงเวลาการปฏิบัติงาน</li>
                    </ol>
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-12">
                                    <h1 className="m-0 ">
                                        <i className="fas fa-money-bill-wave mr-2"></i> 
                                        เงินเพิ่ม เงินหักพนักงาน
                                    </h1>
                                    <p className="text-muted mb-0 mt-2 ml-4">จัดการเงินเพิ่มและเงินหักสำหรับพนักงาน</p>
                                </div>
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
                                            <section className="card shadow-sm ">
                                                <div className="card-header bg-light border-bottom">
                                                    <h5 className="card-title mb-0 text-dark">
                                                        <i className="fas fa-search me-2"></i>
                                                        ค้นหาพนักงาน
                                                    </h5>
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={handleSearch}>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-id-card mr-1"></i>
                                                                        รหัสพนักงาน
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchEmployeeId" 
                                                                        placeholder="กรอกรหัสพนักงาน" 
                                                                        value={searchEmployeeId} 
                                                                        onChange={(e) => setSearchEmployeeId(e.target.value)}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(/\D/g, "");
                                                                        }} 
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-user mr-1"></i>
                                                                        ชื่อพนักงาน
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchname" 
                                                                        placeholder="กรอกชื่อพนักงาน" 
                                                                        value={searchEmployeeName} 
                                                                        onChange={(e) => setSearchEmployeeName(e.target.value)} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <button className="btn  btn-lg px-5"
                                                            style={{ backgroundColor: 'rgb(56, 92, 130)', color: 'white' }} type="submit">
                                                                <i className="fas fa-search mr-2"></i> 
                                                                ค้นหา
                                                            </button>
                                                        </div>
                                                    </form>
                                                    
                                                    {/* ผลลัพธ์การค้นหา */}
                                                    {searchResult.length > 0 && (
                                                        <div className="mt-4">
                                                            
                                                            <div className="list-group">
                                                                {searchResult.map(employee => (
                                                                    <button
                                                                        key={employee.id}
                                                                        type="button"
                                                                        className="list-group-item list-group-item-action d-flex align-items-center"
                                                                        onClick={() => handleClickResult(employee)}
                                                                    >
                                                                        <i className="fas fa-user-circle text-primary mr-3 fa-2x"></i>
                                                                        <div>
                                                                            <h6 className="mb-1">รหัส: {employee.employeeId}</h6>
                                                                            <p className="mb-0 text-muted">ชื่อ: {employee.name}</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                            {/* <!--Frame--> */}
                                        </div>
                                    </div>
                                    <form onSubmit={handleManageWorkplace}>

                                        
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
                                                        {/* <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">ประกันสังคม</label>
                                                            </div>
                                                        </div> */}
                                                        <div class="col-md-2">
                                                            <div class="form-group">
                                                                <label role="">ประเภทพนักงาน</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
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
                                                        {/* <div class="col-md-2">
                                                            <select
                                                                name="socialSecurityType"
                                                                className="form-control"
                                                                value={socialSecurityCheck === null ? "" : (socialSecurityCheck ? "yes" : "no")}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "") {
                                                                        setSocialSecurityCheck(null);
                                                                    } else {
                                                                        setSocialSecurityCheck(value === "yes");
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">เลือก</option>
                                                                <option value="yes">คิดประกันสังคม</option>
                                                                <option value="no">ไม่คิดประกันสังคม</option>
                                                            </select>
                                                        </div> */}
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
                                                    </div>

                                                    <div class="row" style={{ marginTop: '-5px' }}>
                                                        <div className="col-md-12">
                                                            <div className="d-flex justify-content-end">
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
                                                                            socialSecurityCheck: socialSecurityCheck,
                                                                        };
                                                                        addRow(newRowData);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-check"></i> &nbsp; เพิ่ม
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* ตารางแสดงข้อมูลเงินเพิ่ม */}
                                                    <div className="card shadow-sm bg-light mt-3">
                                                        <div className="card-header text-dark" style={{ backgroundColor: '#d4edda' }}>
                                                            <h6 className="mb-0" style={{ color: '#000' }}>
                                                                <i className="fas fa-plus-circle mr-2"></i>
                                                                รายการเงินเพิ่ม
                                                            </h6>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            {rowDataList2.length > 0 && rowDataList2.some(item => item.name) ? (
                                                                <div className="table-responsive">
                                                                    <table className="table table-hover table-striped mb-0">
                                                                        <thead className="thead-light">
                                                                            <tr>
                                                                                <th className="text-center" width="10%">
                                                                                    <i className="fas fa-hashtag mr-1"></i>รหัส
                                                                                </th>
                                                                                <th width="20%">
                                                                                 รายการเงินเพิ่ม
                                                                                </th>
                                                                                <th className="text-center" width="15%">
                                                                                    <i className="fas fa-money-bill mr-1"></i>จำนวนเงิน
                                                                                </th>
                                                                                <th className="text-center" width="12%">
                                                                                    <i className="fas fa-calendar-alt mr-1"></i>รายวัน/รายเดือน
                                                                                </th>
                                                                                {/* <th className="text-center" width="15%">
                                                                                    <i className="fas fa-shield-alt mr-1"></i>ประกันสังคม
                                                                                </th> */}
                                                                                <th className="text-center" width="20%">
                                                                                    <i className="fas fa-users mr-1"></i>ประเภทพนักงาน
                                                                                </th>
                                                                                <th className="text-center" width="15%">
                                                                                    <i className="fas fa-sticky-note mr-1"></i>หมายเหตุ
                                                                                </th>
                                                                                <th className="text-center" width="10%">
                                                                                    <i className="fas fa-cogs mr-1"></i>จัดการ
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rowDataList2.map((item, index) => (
                                                                                item.name && (
                                                                                    <tr key={index}>
                                                                                        <td className="text-center p-3 font-weight-bold text-primary">
                                                                                            {item.id}
                                                                                        </td>
                                                                                        <td className="p-3">
                                                                                         
                                                                                            {item.name}
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            <span className="">
                                                                                               {Number(item.SpSalary).toLocaleString()} บาท
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            {item.roundOfSalary === "daily" && (
                                                                                                <span className="text-bold">รายวัน</span>
                                                                                            )}
                                                                                            {item.roundOfSalary === "monthly" && (
                                                                                                <span className="text-bold">รายเดือน</span>
                                                                                            )}
                                                                                        </td>
                                                                                        {/* <td className="text-center p-3">
                                                                                          
                                                                                            {(item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด") && (
                                                                                                <span className="badge badge-success">คิดประกันสังคม</span>
                                                                                            )}
                                                                                            {(item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด") && (
                                                                                                <span className="badge badge-danger">ไม่คิดประกันสังคม</span>
                                                                                            )}
                                                                                            {(item.socialSecurityCheck === null || item.socialSecurityCheck === undefined || item.socialSecurityCheck === "") && (
                                                                                                <span className="badge badge-secondary">ไม่ระบุ</span>
                                                                                            )}
                                                                                        </td> */}
                                                                                        <td className="text-center p-3">
                                                                                            {item.StaffType === "header" && (
                                                                                                <span className="">หัวหน้างาน</span>
                                                                                            )}
                                                                                            {item.StaffType === "all" && (
                                                                                                <span className="">พนักงาน</span>
                                                                                            )}
                                                                                            {item.StaffType !== "header" && item.StaffType !== "all" && item.StaffType && (
                                                                                                <span className="">{item.StaffType}</span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            <small className="">
                                                                                                {item.message || '-'}
                                                                                            </small>
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            <button 
                                                                                                type="button"
                                                                                                className="btn btn-danger btn-sm"
                                                                                                onClick={() => handleDeleteRow(index)}
                                                                                                title="ลบรายการ"
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-4">
                                                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                                                    <p className="text-muted">ยังไม่มีข้อมูลเงินเพิ่ม</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
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
                                                                <label role="">ประกันสังคม</label>
                                                            </div>
                                                        </div> */}
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
                                                        {/* <div class="col-md-2">
                                                            <select
                                                                name="minusSocialSecurityType"
                                                                className="form-control"
                                                                value={minusSocialSecurityCheck === null ? "" : (minusSocialSecurityCheck ? "yes" : "no")}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === "") {
                                                                        setMinusSocialSecurityCheck(null);
                                                                    } else {
                                                                        setMinusSocialSecurityCheck(value === "yes");
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">เลือก</option>
                                                                <option value="yes">คิดประกันสังคม</option>
                                                                <option value="no">ไม่คิดประกันสังคม</option>
                                                            </select>
                                                        </div> */}
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
                                                    </div>

                                                    <div class="row" style={{ marginTop: '-10px' }}>
                                                        <div className="col-md-12">
                                                            <div className="d-flex justify-content-end">
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
                                                                            socialSecurityCheck: minusSocialSecurityCheck, // Boolean value
                                                                        };
                                                                        addRow2(newRowData2);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-check"></i> &nbsp; เพิ่ม
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* ตารางแสดงข้อมูลเงินหัก */}
                                                    <div className="card shadow-sm bg-light mt-3">
                                                        <div className="card-header text-dark" style={{ backgroundColor: '#d4edda' }}>
                                                            <h6 className="mb-0" style={{ color: '#000' }}>
                                                                <i className="fas fa-minus-circle mr-2"></i>
                                                                รายการเงินหัก
                                                            </h6>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            {rowDataList.length > 0 && rowDataList.some(item => item.name) ? (
                                                                <div className="table-responsive">
                                                                    <table className="table table-hover table-striped mb-0">
                                                                        <thead className="thead-light">
                                                                            <tr>
                                                                                <th className="text-center" width="10%">
                                                                                    <i className="fas fa-hashtag mr-1"></i>รหัส
                                                                                </th>
                                                                                <th width="20%">
                                                                                    รายการเงินหัก
                                                                                </th>
                                                                                <th className="text-center" width="15%">
                                                                                    <i className="fas fa-money-bill mr-1"></i>จำนวนเงิน
                                                                                </th>
                                                                                <th className="text-center" width="15%">
                                                                                    <i className="fas fa-credit-card mr-1"></i>การหักเงิน
                                                                                </th>
                                                                                {/* <th className="text-center" width="20%">
                                                                                    <i className="fas fa-shield-alt mr-1"></i>ประกันสังคม
                                                                                </th> */}
                                                                                <th className="text-center" width="17%">
                                                                                    <i className="fas fa-sticky-note mr-1"></i>หมายเหตุ
                                                                                </th>
                                                                                <th className="text-center" width="10%">
                                                                                    <i className="fas fa-cogs mr-1"></i>จัดการ
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rowDataList.map((item, index) => (
                                                                                item.name && (
                                                                                    <tr key={index}>
                                                                                        <td className="text-center font-weight-bold text-primary p-3">
                                                                                            {item.id}
                                                                                        </td>
                                                                                        <td className="p-3">
                                                                                            {item.name}
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            <span className="">
                                                                                                - {Number(item.amount).toLocaleString()} บาท
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="text-center p-3">
                                                                                            {item.payType === "immedate" && (
                                                                                                <span className="">จ่ายทั้งหมด</span>
                                                                                            )}
                                                                                            {item.payType === "installment" && (
                                                                                                <span className="">ผ่อนจ่าย</span>
                                                                                            )}
                                                                                        </td>
                                                                                        {/* <td className="text-center p-3">
                                                                                           
                                                                                            {(item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด") && (
                                                                                                <span className="badge badge-success">คิดประกันสังคม</span>
                                                                                            )}
                                                                                            {(item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด") && (
                                                                                                <span className="badge badge-danger">ไม่คิดประกันสังคม</span>
                                                                                            )}
                                                                                            {(item.socialSecurityCheck === null || item.socialSecurityCheck === undefined || item.socialSecurityCheck === "") && (
                                                                                                <span className="badge badge-secondary">ไม่ระบุ</span>
                                                                                            )}
                                                                                        </td> */}
                                                                                        <td className="text-center p-3">
                                                                                            <small className="">
                                                                                                {item.message || '-'}
                                                                                            </small>
                                                                                        </td>
                                                                                        <td className="text-center p-2">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-danger btn-sm"
                                                                                                onClick={() => handleDeleteRow2(index)}
                                                                                                title="ลบรายการ"
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <div className="text-center py-4">
                                                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                                                    <p className="text-muted">ยังไม่มีข้อมูลเงินหัก</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                        
<div class="row">
    <div class="col-md-12">
        <h3>รายการเงินกู้</h3>
        <section className="Frame">
            {/* ปุ่มเพิ่มรายการเงินกู้ */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <p className="text-muted mb-0">จัดการรายการเงินกู้ของพนักงาน</p>
                </div>
                <button 
                    type="button"
                    className="btn btn-warning btn-lg"
                    onClick={() => {
                        resetLoanForm();
                        setShowLoanModal(true);
                    }}
                    style={{
                        borderRadius: '10px',
                        padding: '10px 25px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(255,193,7,0.3)'
                    }}
                >
                    <i className="fas fa-plus-circle mr-2"></i>
                    เพิ่มรายการเงินกู้
                </button>
            </div>

            {/* แสดงรายการเงินกู้ในรูปแบบ Cards */}
            {loanList && loanList.length > 0 ? (
                <div className="row">
                    {loanList.map((loan) => (
                        <div key={loan.id} className="col-md-6 col-lg-4 mb-4">
                            <div 
                                className="card shadow-lg h-100"
                                style={{
                                    borderRadius: '15px',
                                    border: '3px solid #ffc107',
                                    background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)',
                                    transition: 'transform 0.3s, box-shadow 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,193,7,0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Header */}
                                <div 
                                    className="card-header text-white text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffc107, #ff8f00)',
                                        borderRadius: '12px 12px 0 0',
                                        padding: '20px'
                                    }}
                                >
                                    <h5 className="mb-1" style={{ fontWeight: 'bold' }}>
                                        <i className="fas fa-hand-holding-usd mr-2"></i>
                                        {loan.loanName || 'รายการเงินกู้'}
                                    </h5>
                                    <small style={{ opacity: 0.9 }}>
                                        รหัสสัญญา: {loan.contractCode} | รหัสหัก: {loan.loanCode} | วันที่: {new Date(loan.date).toLocaleDateString('th-TH')}
                                    </small>
                                </div>

                                {/* Body */}
                                <div className="card-body" style={{ padding: '25px' }}>
                                    {/* ข้อมูลหลัก */}
                                    <div className="row text-center mb-4">
                                        <div className="col-12">
                                            <div className="bg-light p-3 rounded-lg mb-3">
                                                <small className="text-muted d-block">ยอดเงินกู้ทั้งหมด</small>
                                                <h4 className="mb-0 text-primary font-weight-bold">
                                                    ฿{Number(loan.amount || 0).toLocaleString()}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* สถานะการผ่อน */}
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <div className="text-center p-2 bg-success text-white rounded">
                                                <small>จ่ายแล้ว</small>
                                                <div className="font-weight-bold">
                                                    ฿{Number(loan.totalPaid || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="text-center p-2 bg-danger text-white rounded">
                                                <small>คงเหลือ</small>
                                                <div className="font-weight-bold">
                                                    ฿{Number(loan.remaining || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">ความคืบหน้า</small>
                                            <small className="font-weight-bold text-success">
                                                {loan.amount > 0 ? Math.round((loan.totalPaid / loan.amount) * 100) : 0}%
                                            </small>
                                        </div>
                                        <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                                            <div 
                                                className="progress-bar bg-success"
                                                style={{
                                                    width: `${loan.amount > 0 ? (loan.totalPaid / loan.amount) * 100 : 0}%`,
                                                    borderRadius: '10px'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* รายละเอียดการผ่อน */}
                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-2">
                                            <i className="fas fa-calendar-alt mr-1"></i>
                                            รายการผ่อนชำระ ({loan.period} เดือน)
                                        </small>
                                        <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {loan.monthlyPayments && loan.monthlyPayments.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-sm table-borderless mb-0">
                                                        <tbody>
                                                            {loan.monthlyPayments.map((payment, index) => (
                                                                <tr key={index}>
                                                                    <td className="py-1 px-2" style={{ fontSize: '12px' }}>
                                                                        งวด {payment.id}
                                                                    </td>
                                                                    <td className="py-1 px-2" style={{ fontSize: '12px' }}>
                                                                        {payment.monthName}
                                                                    </td>
                                                                    <td className="text-right py-1 px-2" style={{ fontSize: '12px' }}>
                                                                        {payment.amount ? (
                                                                            <span className="text-success font-weight-bold">
                                                                                ฿{Number(payment.amount).toLocaleString()}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-muted">-</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <small className="text-muted">ยังไม่มีรายการผ่อนชำระ</small>
                                            )}
                                        </div>
                                    </div>

                                    {/* หมายเหตุ */}
                                    {loan.note && (
                                        <div className="mb-3">
                                            <small className="text-muted d-block mb-1">
                                                <i className="fas fa-sticky-note mr-1"></i>
                                                หมายเหตุ
                                            </small>
                                            <small className="text-dark bg-light p-2 rounded d-block">
                                                {loan.note}
                                            </small>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div 
                                    className="card-footer bg-transparent text-center"
                                    style={{ padding: '15px 25px', borderTop: '1px solid #dee2e6' }}
                                >
                                    <div className="btn-group w-100">
                                        <button
                                            type="button"
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleEditLoan(loan)}
                                            style={{ borderRadius: '8px 0 0 8px' }}
                                            title="แก้ไข"
                                        >
                                            <i className="fas fa-edit mr-1"></i>
                                            แก้ไข
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteLoan(loan.id)}
                                            style={{ borderRadius: '0 8px 8px 0' }}
                                            title="ลบ"
                                        >
                                            <i className="fas fa-trash mr-1"></i>
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div 
                        className="card"
                        style={{
                            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                            border: '2px dashed #dee2e6',
                            borderRadius: '15px'
                        }}
                    >
                        <div className="card-body py-5">
                            <i className="fas fa-hand-holding-usd fa-4x text-muted mb-3"></i>
                            <h5 className="text-muted mb-2 mt-3">ยังไม่มีรายการเงินกู้</h5>
                            <p className="text-muted mb-4">เริ่มต้นสร้างรายการเงินกู้สำหรับพนักงาน</p>
                            <button 
                                type="button"
                                className="btn btn-warning btn-lg"
                                onClick={() => {
                                    resetLoanForm();
                                    setShowLoanModal(true);
                                }}
                                style={{
                                    borderRadius: '10px',
                                    padding: '12px 30px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <i className="fas fa-plus-circle mr-2"></i>
                                เพิ่มรายการแรก
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                
                {/* Loan Modal */}
                {showLoanModal && (
                    <div 
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            zIndex: 1050,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowLoanModal(false);
                            }
                        }}
                    >
                        <div 
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                width: '90vw',
                                maxWidth: '1000px',
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <div 
                                style={{
                                    background: 'linear-gradient(135deg, #ffc107, #ff8f00)',
                                    color: 'white',
                                    padding: '25px 30px',
                                    borderRadius: '15px 15px 0 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <h4 style={{ margin: 0, fontWeight: 'bold' }}>
                                    <i className="fas fa-hand-holding-usd mr-3"></i>
                                    {isEditMode ? 'แก้ไขรายการเงินกู้' : 'เพิ่มรายการเงินกู้'}
                                </h4>
                                <button 
                                    onClick={() => {
                                        setShowLoanModal(false);
                                        resetLoanForm();
                                    }}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        color: 'white',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="ปิด"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Body */}
                            <div 
                                style={{
                                    padding: '40px',
                                    overflowY: 'auto',
                                    flex: 1
                                }}
                            >
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-calendar-alt mr-2 text-warning"></i>
                                                วันที่สร้าง
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd',
                                                    backgroundColor: '#f8f9fa'
                                                }}
                                                value={isEditMode && editingLoan ? new Date(editingLoan.date).toLocaleDateString('th-TH') : new Date().toLocaleDateString('th-TH')}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-dollar-sign mr-2 text-success"></i>
                                                จำนวนเงิน (บาท)
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                placeholder="กรอกจำนวนเงิน"
                                                value={loanAmount}
                                                onChange={(e) => setLoanAmount(e.target.value)}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-file-contract mr-2 text-primary"></i>
                                                รหัสสัญญาเงินกู้ <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                placeholder="กรอกรหัสสัญญาเงินกู้"
                                                value={loanContractCode}
                                                onChange={(e) => setLoanContractCode(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-calendar mr-2 text-info"></i>
                                                ระยะเวลา (เดือน) <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                value={interestRate}
                                                onChange={(e) => {
                                                    const period = Number(e.target.value);
                                                    setInterestRate(e.target.value);
                                                    
                                                    if (period > 0) {
                                                        const currentDate = new Date();
                                                        const payments = [];
                                                        
                                                        for (let i = 0; i < period; i++) {
                                                            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
                                                            const monthName = nextMonth.toLocaleDateString('th-TH', { 
                                                                month: 'long', 
                                                                year: 'numeric' 
                                                            });
                                                            
                                                            payments.push({
                                                                id: i + 1,
                                                                monthName: monthName,
                                                                amount: ''
                                                            });
                                                        }
                                                        
                                                        setMonthlyPayments(payments);
                                                    } else {
                                                        setMonthlyPayments([]);
                                                    }
                                                }}
                                            >
                                                <option value="">เลือกระยะเวลา</option>
                                                <option value="1">1 เดือน</option>
                                                <option value="2">2 เดือน</option>
                                                <option value="3">3 เดือน</option>
                                                <option value="4">4 เดือน</option>
                                                <option value="5">5 เดือน</option>
                                                <option value="6">6 เดือน</option>
                                                <option value="7">7 เดือน</option>
                                                <option value="8">8 เดือน</option>
                                                <option value="9">9 เดือน</option>
                                                <option value="10">10 เดือน</option>
                                                <option value="11">11 เดือน</option>
                                                <option value="12">12 เดือน</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-hashtag mr-2 text-info"></i>
                                                รหัสเงินหัก
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                placeholder="กรอกรหัสเงินหัก"
                                                value={minusId}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setMinusId(value);
                                                    
                                                    // หาชื่อรายการจากรหัสที่กรอก (ยกเว้นในโหมดแก้ไขและกำลังโหลดข้อมูล)
                                                    if (value && rowDataList && rowDataList.length > 0) {
                                                        const foundItem = rowDataList.find(item => item.id && item.id.toString() === value.toString());
                                                        
                                                        if (foundItem && foundItem.name) {
                                                            setMisnusName(foundItem.name);
                                                        } else if (!isEditMode) {
                                                            // ถ้าไม่เจอและไม่ได้อยู่ในโหมดแก้ไข ให้เคลียร์ชื่อ
                                                            setMisnusName('');
                                                        }
                                                    } else if (!isEditMode) {
                                                        // ถ้าไม่มีรหัสและไม่ได้อยู่ในโหมดแก้ไข ให้เคลียร์ชื่อ
                                                        setMisnusName('');
                                                    }
                                                }}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D/g, '');
                                                }}
                                            />
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-tag mr-2 text-primary"></i>
                                                ชื่อรายการเงินหัก
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                placeholder="ชื่อรายการจะแสดงอัตโนมัติ"
                                                value={misnusName}
                                                onChange={(e) => setMisnusName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                                <i className="fas fa-calendar mr-2 text-info"></i>
                                                ระยะเวลา (เดือน)
                                            </label>
                                            <select 
                                                className="form-control form-control-lg"
                                                style={{
                                                    fontSize: '16px',
                                                    padding: '12px 15px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                                value={interestRate}
                                                onChange={(e) => {
                                                    const months = parseInt(e.target.value);
                                                    setInterestRate(e.target.value);
                                                    
                                                    // สร้างรายการเดือน
                                                    if (months > 0) {
                                                        const monthList = [];
                                                        const currentDate = new Date();
                                                        
                                                        for (let i = 0; i < months; i++) {
                                                            const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
                                                            const monthName = targetDate.toLocaleDateString('th-TH', { 
                                                                year: 'numeric', 
                                                                month: 'long' 
                                                            });
                                                            
                                                            monthList.push({
                                                                id: i + 1,
                                                                monthName: monthName,
                                                                amount: ''
                                                            });
                                                        }
                                                        setMonthlyPayments(monthList);
                                                    } else {
                                                        setMonthlyPayments([]);
                                                    }
                                                }}
                                            >
                                                <option value="">เลือกระยะเวลา</option>
                                                <option value="1">1 เดือน</option>
                                                <option value="2">2 เดือน</option>
                                                <option value="3">3 เดือน</option>
                                                <option value="4">4 เดือน</option>
                                                <option value="5">5 เดือน</option>
                                                <option value="6">6 เดือน</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                
                                {/* รายการผ่อนชำระรายเดือน */}
                                {monthlyPayments && monthlyPayments.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h5 style={{ color: '#333', fontWeight: 'bold', marginBottom: '20px' }}>
                                            <i className="fas fa-calendar-check mr-2 text-info"></i>
                                            รายการผ่อนชำระรายเดือน
                                        </h5>
                                        <div className="card" style={{ border: '2px solid #007bff', borderRadius: '10px' }}>
                                            <div className="card-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-hover mb-0">
                                                        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                                                            <tr>
                                                                <th className="text-center" style={{ padding: '15px' }}>งวดที่</th>
                                                                <th style={{ padding: '15px' }}>เดือน/ปี</th>
                                                                <th className="text-center" style={{ padding: '15px' }}>ยอดเงิน (บาท)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {monthlyPayments.map((month) => (
                                                                <tr key={month.id}>
                                                                    <td className="text-center" style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>
                                                                        {month.id}
                                                                    </td>
                                                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                                                        {month.monthName}
                                                                    </td>
                                                                    <td style={{ padding: '8px' }}>
                                                                        <input 
                                                                            type="text"
                                                                            className="form-control text-center"
                                                                            style={{
                                                                                fontSize: '16px',
                                                                                fontWeight: 'bold',
                                                                                borderRadius: '6px',
                                                                                border: '2px solid #ddd'
                                                                            }}
                                                                            placeholder="0"
                                                                            value={month.amount}
                                                                            onChange={(e) => {
                                                                                const newPayments = monthlyPayments.map(item => 
                                                                                    item.id === month.id 
                                                                                        ? { ...item, amount: e.target.value }
                                                                                        : item
                                                                                );
                                                                                setMonthlyPayments(newPayments);
                                                                            }}
                                                                            onInput={(e) => {
                                                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot style={{ backgroundColor: '#f8f9fa' }}>
                                                            <tr>
                                                                <td colSpan="2" className="text-right" style={{ padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                                                                    รวมทั้งหมด:
                                                                </td>
                                                                <td className="text-center" style={{ padding: '15px' }}>
                                                                    <strong style={{ fontSize: '18px', color: '#28a745' }}>
                                                                        ฿{monthlyPayments.reduce((sum, month) => sum + (Number(month.amount) || 0), 0).toLocaleString()}
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="form-group mb-4">
                                    <label style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                                        <i className="fas fa-sticky-note mr-2 text-secondary"></i>
                                        หมายเหตุ
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        rows="4"
                                        style={{
                                            fontSize: '16px',
                                            padding: '12px 15px',
                                            borderRadius: '8px',
                                            border: '2px solid #ddd',
                                            resize: 'vertical'
                                        }}
                                        placeholder="กรอกหมายเหตุ (ถ้ามี)"
                                        value={loanNote}
                                        onChange={(e) => setLoanNote(e.target.value)}
                                    ></textarea>
                                </div>
                                
                                {/* สรุปการคำนวณ */}
                                {loanAmount && interestRate && loanPeriod && (
                                    <div 
                                        style={{
                                            backgroundColor: '#e8f5e8',
                                            border: '2px solid #28a745',
                                            borderRadius: '10px',
                                            padding: '25px',
                                            marginTop: '20px'
                                        }}
                                    >
                                        <h5 style={{ color: '#155724', fontWeight: 'bold', marginBottom: '20px' }}>
                                            <i className="fas fa-calculator mr-2"></i>
                                            สรุปการคำนวณ
                                        </h5>
                                        <div className="row text-center">
                                            <div className="col-md-4">
                                                <div style={{ marginBottom: '15px' }}>
                                                    <small style={{ color: '#666', fontSize: '14px' }}>จำนวนเงินกู้:</small><br/>
                                                    <strong style={{ fontSize: '18px', color: '#007bff' }}>
                                                        ฿{Number(loanAmount || 0).toLocaleString()}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div style={{ marginBottom: '15px' }}>
                                                    <small style={{ color: '#666', fontSize: '14px' }}>ดอกเบี้ยรวม:</small><br/>
                                                    <strong style={{ fontSize: '18px', color: '#ffc107' }}>
                                                        ฿{Number((Number(loanAmount) * Number(interestRate) / 100) || 0).toLocaleString()}
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div style={{ marginBottom: '15px' }}>
                                                    <small style={{ color: '#666', fontSize: '14px' }}>ยอดผ่อนต่อเดือน:</small><br/>
                                                    <strong style={{ fontSize: '18px', color: '#dc3545' }}>
                                                        ฿{Number(((Number(loanAmount) + (Number(loanAmount) * Number(interestRate) / 100)) / Number(loanPeriod)) || 0).toLocaleString()}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div 
                                style={{
                                    padding: '25px 30px',
                                    borderTop: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '15px'
                                }}
                            >
                                <button 
                                    onClick={() => {
                                        setShowLoanModal(false);
                                        resetLoanForm();
                                    }}
                                    style={{
                                        padding: '12px 30px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        border: '2px solid #6c757d',
                                        borderRadius: '8px',
                                        backgroundColor: 'white',
                                        color: '#6c757d',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#6c757d';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = '#6c757d';
                                    }}
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    ยกเลิก
                                </button>
                                <button 
                                    onClick={handleAddLoan}
                                    style={{
                                        padding: '12px 30px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        border: '2px solid #ffc107',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffc107',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#e0a800';
                                        e.target.style.borderColor = '#e0a800';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#ffc107';
                                        e.target.style.borderColor = '#ffc107';
                                    }}
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {isEditMode ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Toast Notifications Container */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {toastList.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            minWidth: '300px',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            backgroundColor: toast.type === 'success' ? '#28a745' : '#dc3545',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            animation: 'slideIn 0.3s ease-out',
                            fontSize: '15px',
                            fontWeight: '500'
                        }}
                    >
                        <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} 
                           style={{ fontSize: '20px' }}></i>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        minWidth: '400px',
                        maxWidth: '500px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            <i className="fas fa-exclamation-triangle" 
                               style={{ fontSize: '28px', color: '#ff9800' }}></i>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '22px', 
                                fontWeight: 'bold',
                                color: '#333'
                            }}>
                                {confirmModalData.title}
                            </h3>
                        </div>
                        <p style={{ 
                            fontSize: '16px', 
                            lineHeight: '1.6',
                            color: '#666',
                            marginBottom: '30px',
                            whiteSpace: 'pre-line'
                        }}>
                            {confirmModalData.message}
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleConfirmNo}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    border: '2px solid #6c757d',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    color: '#6c757d',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#6c757d';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.color = '#6c757d';
                                }}
                            >
                                <i className="fas fa-times mr-2"></i>
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirmYes}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    border: '2px solid #dc3545',
                                    borderRadius: '8px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#c82333';
                                    e.target.style.borderColor = '#c82333';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#dc3545';
                                    e.target.style.borderColor = '#dc3545';
                                }}
                            >
                                <i className="fas fa-trash-alt mr-2"></i>
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>

        </div>

    )
}

export default AddEditSalaryEmployee