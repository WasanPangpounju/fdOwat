import endpoint from '../../config';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EmployeesSelected from './EmployeesSelected';
import '../editwindowcss.css';

function OtherExpenses() {
    useEffect(() => {
        document.title = 'ค่าใช้จ่ายอื่นๆ';
        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
    }, []);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [agency, setAgency] = useState('');
    const [employeeData, setEmployeeData] = useState({});

    //////////////////////////////////
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [sum, setSum] = useState(0);

    // const handleNumber1Change = (event) => {
    //     const value = Number(event.target.value);
    //     setNumber1(value);
    //     calculateSum(value, number2);
    // };

    // const handleNumber2Change = (event) => {
    //     const value = Number(event.target.value);
    //     setNumber2(value);
    //     calculateSum(number1, value);
    // };

    // const calculateSum = (num1, num2) => {
    //     const result = num1 * num2;
    //     setSum(result);
    // };
    ////////////////////////////////////
    const [input1, setInput1] = useState(0);
    const [input2, setInput2] = useState(0);
    const [input3, setInput3] = useState(0);
    const [anything, setAnything] = useState('');
    const [sum2, setSum2] = useState(0);


    const handleInputChange1 = (event) => {
        setInput1(Number(event.target.value));
        calculateSum2(Number(event.target.value), input2, input3);
    };

    const handleInputChange2 = (event) => {
        setInput2(Number(event.target.value));
        calculateSum2(input1, Number(event.target.value), input3);
    };

    const handleInputChange3 = (event) => {
        setInput3(Number(event.target.value));
        calculateSum2(input1, input2, Number(event.target.value));
    };

    const calculateSum2 = (num11, num22, num33) => {
        const result2 = num11 + num22 + num33;
        setSum2(result2);
    };
    ////////////////////////////////////
    const [crimeinvestigation, setCrimeinvestigation] = useState(0);
    // const [inputValue, setInputValue] = useState('');

    const handleInputCrimeChange = (event) => {
        setCrimeinvestigation(event.target.value);
    };
    ////////////////////////////////////
    const [shirt, setShirt] = useState(0);
    const [shirtcount, setShirtcount] = useState(0);
    const [trousers, setTrousers] = useState(0);
    const [trouserscount, setTrouserscount] = useState(0);
    const [wholeset, setWholeset] = useState(0);
    const [wholesetcount, setWholesetcount] = useState(0);
    const [saveftyShoes, setSaveftyShoes] = useState(0);
    const [saveftyShoescount, setSaveftyShoescount] = useState(0);
    const [apron, setApron] = useState(0);
    const [aproncount, setAproncount] = useState(0);
    const [hat, setHat] = useState(0);
    const [hatcount, setHatcount] = useState(0);
    const [custom, setcustom] = useState(0);

    const handlesetShirt = (event) => {
        const newShirt = Number(event.target.value);
        setShirt(newShirt);
        setcustom((prevCustom) =>
            calculateCostume(newShirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetShirtcount = (event) => {
        const newShirtcount = Number(event.target.value);
        setShirtcount(newShirtcount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, newShirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetTrousers = (event) => {
        const newTrousers = Number(event.target.value);
        setTrousers(newTrousers);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, newTrousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetTrouserscount = (event) => {
        const newTrouserscount = Number(event.target.value);
        setTrouserscount(newTrouserscount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, newTrouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetWholeset = (event) => {
        const newWholeset = Number(event.target.value);
        setWholeset(newWholeset);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, newWholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetWholesetcount = (event) => {
        const newWholesetcount = Number(event.target.value);
        setWholesetcount(newWholesetcount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, newWholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };
    const handlesetSaveftyShoes = (event) => {
        const newSaveftyShoes = Number(event.target.value);
        setSaveftyShoes(newSaveftyShoes);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, newSaveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetSaveftyShoescount = (event) => {
        const newSaveftyShoescount = Number(event.target.value);
        setSaveftyShoescount(newSaveftyShoescount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, newSaveftyShoescount, apron, aproncount, hat, hatcount)
        );
    };

    const handlesetApron = (event) => {
        const newApron = Number(event.target.value);
        setApron(newApron);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, newApron, aproncount, hat, hatcount)
        );
    };

    const handlesetAproncount = (event) => {
        const newAproncount = Number(event.target.value);
        setAproncount(newAproncount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, newAproncount, hat, hatcount)
        );
    };

    const handlesetHat = (event) => {
        const newHat = Number(event.target.value);
        setHat(newHat);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, newHat, hatcount)
        );
    };

    const handlesetHatcount = (event) => {
        const newHatcount = Number(event.target.value);
        setHatcount(newHatcount);
        setcustom((prevCustom) =>
            calculateCostume(shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, newHatcount)
        );
    };

    const calculateCostume = (shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount) => {
        return (
            shirt * shirtcount +
            trousers * trouserscount +
            wholeset * wholesetcount +
            saveftyShoes * saveftyShoescount +
            apron * aproncount +
            hat * hatcount
        );
    };
    /////////////////////////////////////////////
    const [admoney1, setAdmoney1] = useState(0);
    const [admoney2, setAdmoney2] = useState(0);
    const [admoney3, setAdmoney3] = useState(0);

    const [commentadmoney1, setCommentAdmoney1] = useState('');
    const [commentadmoney2, setCommentAdmoney2] = useState('');
    const [commentadmoney3, setCommentAdmoney3] = useState('');

    const [sumadmoney, setSumAdmoney] = useState(0);
    const handleAdmoney1 = (event) => {
        setAdmoney1(Number(event.target.value));
        calculateSumAdmoney(Number(event.target.value), admoney2, admoney3);
    };

    const handleAdmoney2 = (event) => {
        setAdmoney2(Number(event.target.value));
        calculateSumAdmoney(admoney1, Number(event.target.value), admoney3);
    };

    const handleAdmoney3 = (event) => {
        setAdmoney3(Number(event.target.value));
        calculateSumAdmoney(admoney1, admoney2, Number(event.target.value));
    };

    const calculateSumAdmoney = (num11, num22, num33) => {
        const resultAdmoney = num11 + num22 + num33;
        setSumAdmoney(resultAdmoney);
    };
    //////////////////////////////////////////////

    async function updateEmployee(_id) {
        alert('hi');
        // Make the API call to update the resource by ID
        try {
            const response = await axios.put(endpoint + '/employee/update/' + employeeData._id, employeeData);
            // setEmployeesResult(response.data.employees);
            if (response) {
                alert("บันทึกสำเร็จ");
                window.location.reload();

            }
        } catch (error) {
            alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
            alert(error);
            window.location.reload();
        }

    }

    async function onEmployeeSelect(empSelect) {
        await setEmployeeData(empSelect);
        setId(empSelect.employeeId);
        setName(empSelect.name);
        setAgency(empSelect.workplace);

        setNumber1(empSelect.number1);
        setNumber2(empSelect.number2);
        setInput1(empSelect.input1);
        setInput2(empSelect.input2);
        setInput3(empSelect.input3);
        setAnything(empSelect.anything);
        setCrimeinvestigation(empSelect.crimeinvestigation);
        setShirt(empSelect.shirt);
        setShirtcount(empSelect.shirtcount);
        setTrousers(empSelect.trousers);
        setTrouserscount(empSelect.trouserscount);
        setWholeset(empSelect.wholeset);
        setWholesetcount(empSelect.wholesetcount);
        setSaveftyShoes(empSelect.saveftyShoes);
        setSaveftyShoescount(empSelect.saveftyShoescount);
        setApron(empSelect.apron);
        setAproncount(empSelect.aproncount);
        setHat(empSelect.hat);
        setHatcount(empSelect.hatcount);
        setcustom(empSelect.custom);
        setAdmoney1(empSelect.admoney1);
        setAdmoney2(empSelect.workplace);
        setAdmoney3(empSelect.admoney3);
        setCommentAdmoney1(empSelect.commentadmoney1);
        setCommentAdmoney2(empSelect.commentadmoney2);
        setCommentAdmoney3(empSelect.commentadmoney3);
        setDivide(empSelect.divide);

    }

    async function handleManageEmployee(event) {
        event.preventDefault();
    }
    //////////////////////////////////////////////
    const [sumall, setSumAll] = useState(0);
    const [sumall2, setSumAll2] = useState(0);
    const [divide, setDivide] = useState(0);
    const [divideall, setDivideAll] = useState(0);

    useEffect(() => {
        const number1 = parseFloat(employeeData.number1) || 0;
        const number2 = parseFloat(employeeData.number2) || 0;

        if (!isNaN(number1) || !isNaN(number2)) {
            setSum(number1 * number2);
        } else {
            setSum(0); // or any other default value you prefer
        }
    }, [employeeData.number1, employeeData.number2]);
    useEffect(() => {
        const number1 = parseFloat(employeeData.input1) || 0;
        const number2 = parseFloat(employeeData.input2) || 0;
        const number3 = parseFloat(employeeData.input3) || 0;

        // if (number1 > 0 || number2 > 0 || number3 > 0) {
        if (!isNaN(number1) && !isNaN(number2) && !isNaN(number3)) {
            setSum2(number1 + number2 + number3);
        } else {
            setSum2(0); // or any other default value you prefer
        }
    }, [employeeData.input1, employeeData.input2, employeeData.input3]);

    useEffect(() => {
        const shirt = parseFloat(employeeData.shirt) || 0;
        const shirtcount = parseFloat(employeeData.shirtcount) || 0;
        const trousers = parseFloat(employeeData.trousers) || 0;
        const trouserscount = parseFloat(employeeData.trouserscount) || 0;
        const wholeset = parseFloat(employeeData.wholeset) || 0;
        const wholesetcount = parseFloat(employeeData.wholesetcount) || 0;
        const saveftyShoes = parseFloat(employeeData.saveftyShoes) || 0;
        const saveftyShoescount = parseFloat(employeeData.saveftyShoescount) || 0;
        const apron = parseFloat(employeeData.apron) || 0;
        const aproncount = parseFloat(employeeData.aproncount) || 0;
        const hat = parseFloat(employeeData.hat) || 0;
        const hatcount = parseFloat(employeeData.hatcount) || 0;

        if (!isNaN(shirt) || !isNaN(shirtcount) || !isNaN(trousers) ||
            !isNaN(trouserscount) || !isNaN(wholeset) || !isNaN(wholesetcount) ||
            !isNaN(saveftyShoes) || !isNaN(saveftyShoescount) || !isNaN(apron) ||
            !isNaN(aproncount) || !isNaN(hat) || !isNaN(hatcount)) {
            setcustom(shirt * shirtcount +
                trousers * trouserscount +
                wholeset * wholesetcount +
                saveftyShoes * saveftyShoescount +
                apron * aproncount +
                hat * hatcount);
        } else {
            setcustom(0); // or any other default value you prefer
        }

    }, [shirt, shirtcount, trousers, trouserscount, wholeset, wholesetcount, saveftyShoes, saveftyShoescount, apron, aproncount, hat, hatcount]);

    useEffect(() => {
        const admoney1 = parseFloat(employeeData.admoney1) || 0;
        const admoney2 = parseFloat(employeeData.admoney2) || 0;
        const admoney3 = parseFloat(employeeData.admoney3) || 0;

        if (!isNaN(admoney1) || !isNaN(admoney2) || !isNaN(admoney3)) {
            setSumAdmoney(admoney1 + admoney2 + admoney3);
        } else {
            setSumAdmoney(0); // or any other default value you prefer
        }
    }, [employeeData.admoney1, employeeData.admoney2, employeeData.admoney3]);


    useEffect(() => {
        const sumall = Number(sum) + Number(sum2) + Number(crimeinvestigation) + Number(custom);
        setSumAll(sumall);
    }, [sum, sum2, crimeinvestigation, custom]);

    useEffect(() => {
        const sumall2 = Number(sum) + Number(sum2) + Number(crimeinvestigation) + Number(custom) + Number(sumadmoney);
        setSumAll2(sumall2);
    }, [sum, sum2, crimeinvestigation, custom, sumadmoney]);

    useEffect(() => {
        const divideAllValue = sumall2 / divide;
        setDivideAll(divideAllValue);
    }, [sumall, divide]);

    const handleChange = (e, field) => {
        setEmployeeData(prevData => ({
            ...prevData,
            [field]: e.target.value
        }));
    };
    //  useEffect(() => {
    //         const sumall2 = parseFloat(employeeData.sumall2);
    //         const divide = parseFloat(employeeData.divide);
    //         setDivideAll(sumall2 / divide);
    //     }, [employeeData.sumall2, employeeData.divide]);
    return (
        <div class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                        <li class="breadcrumb-item active">ค่าใช้จ่ายอื่นๆ</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ค่าใช้จ่ายอื่นๆ</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-9">
                                    <form onSubmit={handleManageEmployee}>
                                        <h2 class="title">ข้อมูลพนักงาน</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <div class="form-group row">
                                                                <div class="col-md-2 col-form-label"><span class="txt-w">รหัส </span></div>
                                                                <div class="col-md-10">
                                                                    <input type="text" class="form-control" id="id" placeholder="รหัส" value={id} onChange={(e) => setId(e.target.value)} />
                                                                    {/* <input type="number" pattern="[0-9]*" value={number2} onChange={handleNumber2Change} /> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="form-group row">
                                                                <div class="col-md-2 col-form-label"><span class="txt-w">ชื่อ </span></div>
                                                                <div class="col-md-10">
                                                                    <input type="text" class="form-control" id="name" placeholder="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} />
                                                                    {/* <input type="number" pattern="[0-9]*" value={number2} onChange={handleNumber2Change} /> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="form-group row">
                                                                <div class="col-md-2 col-form-label"><span class="txt-w">หน่วยงาน </span></div>
                                                                <div class="col-md-10">
                                                                    <input type="text" class="form-control" id="agency" placeholder="หน่วยงาน" value={agency} onChange={(e) => setAgency(e.target.value)} />
                                                                    {/* <input type="number" pattern="[0-9]*" value={number2} onChange={handleNumber2Change} /> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                            {/* <div class="col-md-3">
                                                <section class="Frame"><EmployeesSelected onEmployeeSelect={onEmployeeSelect} /></section>
                                            </div> */}
                                        </div>
                                        <h2 class="title">บัตรพนักงาน</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-4 col-form-label"><span class="txt-w">ทำบัตรใหม่ </span><span class="txt-label">อันละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="number" class="form-control" pattern="[0-9]*" value={employeeData.number1}
                                                                        //  onChange={handleNumber1Change} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'number1');
                                                                            handleNumber1Change(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="number" class="form-control" pattern="[0-9]*" value={employeeData.number2}
                                                                        //  onChange={handleNumber2Change} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'number2');
                                                                            handleNumber2Change(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">อัน</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <h2 class="title">สุขภาพ</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row form-group">
                                                        <label class="col-md-4 col-form-label">ตรวจสุขภาพก่อนเริ่มงาน</label>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" value={employeeData.input1}
                                                                // onChange={handleInputChange1} 
                                                                onChange={(e) => {
                                                                    handleChange(e, 'input1');
                                                                    handleInputChange1(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">บาท</label>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-4 col-form-label">ตรวจสุขภาพประจำปี</label>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" value={employeeData.input2}
                                                                //  onChange={handleInputChange2}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'input2');
                                                                    handleInputChange2(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">บาท</label>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-2 col-form-label">อื่นๆ</label>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="salaryadd1v" placeholder="อื่นๆ" value={employeeData.anything}
                                                                //  onChange={(e) => setAnything(e.target.value)} 
                                                                onChange={(e) => {
                                                                    handleChange(e, 'anything');
                                                                    setAnything(e.target.value);
                                                                }}
                                                            />

                                                        </div>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" value={employeeData.input3}
                                                                //  onChange={handleInputChange3}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'input3');
                                                                    handleInputChange3(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">บาท</label>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <h2 class="title">ค่าตรวจสอบอาชญากรรม</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row form-group">
                                                        <label class="col-md-2 col-form-label">รวมเป็นเงิน</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.crimeinvestigation}
                                                                // onChange={handleInputCrimeChange}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'crimeinvestigation');
                                                                    handleInputCrimeChange(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                        <h2 class="title">เครื่องแต่งกาย</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">เสื้อ </span><span class="txt-label">ตัวละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.shirt}
                                                                        //  onChange={handlesetShirt}
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'shirt');
                                                                            handlesetShirt(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.shirtcount}
                                                                        // onChange={handlesetShirtcount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'shirtcount');
                                                                            handlesetShirtcount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">ตัว</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">กางเกง </span><span class="txt-label">ตัวละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.trousers}
                                                                        // onChange={handlesetTrousers} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'trousers');
                                                                            handlesetTrousers(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.trouserscount}
                                                                        //  onChange={handlesetTrouserscount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'trouserscount');
                                                                            handlesetTrouserscount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">ตัว</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">ทั้งชุด </span><span class="txt-label">ชุดละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.wholeset}
                                                                        // onChange={handlesetWholeset} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'wholeset');
                                                                            handlesetWholeset(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.wholesetcount}
                                                                        // onChange={handlesetWholesetcount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'wholesetcount');
                                                                            handlesetWholesetcount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">ชุด</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">รองเท้า Savefty </span><span class="txt-label">คู่ละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.saveftyShoes}
                                                                        // onChange={handlesetSaveftyShoes} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'saveftyShoes');
                                                                            handlesetSaveftyShoes(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.saveftyShoescount}
                                                                        // onChange={handlesetSaveftyShoescount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'saveftyShoescount');
                                                                            handlesetSaveftyShoescount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">คู่</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">ผ้ากันเปื้อน </span><span class="txt-label">ชุดละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.apron}
                                                                        // onChange={handlesetApron} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'apron');
                                                                            handlesetApron(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.aproncount}
                                                                        //  onChange={handlesetAproncount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'aproncount');
                                                                            handlesetAproncount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">ชุด</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-5 col-form-label"><span class="txt-w">หมวก </span><span class="txt-label">ใบละ</span></div>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.hat}
                                                                        //  onChange={handlesetHat} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'hat');
                                                                            handlesetHat(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-2 col-form-label">จำนวน</label>
                                                                <div class="col-md-3">
                                                                    <input type="" class="form-control" id="" placeholder="00.00" value={employeeData.hatcount}
                                                                        // onChange={handlesetHatcount} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'hatcount');
                                                                            handlesetHatcount(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">ใบ
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <h2 class="title">เงินเบิกล่วงหน้า</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-3 col-form-label">รายการที่ 1</div>
                                                                <div class="col-md-8">
                                                                    <input type="text" class="form-control" id="commentadmoney1" placeholder="อื่นๆ" value={employeeData.commentadmoney1}
                                                                        //  onChange={(e) => setCommentAdmoney1(e.target.value)} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'commentadmoney1');
                                                                            setCommentAdmoney1(e.target.value);
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-3 col-form-label">เป็นจำนวนเงิน</label>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" placeholder="00.00" value={employeeData.admoney1}
                                                                        // onChange={handleAdmoney1} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'admoney1');
                                                                            handleAdmoney1(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-3 col-form-label">รายการที่ 2</div>
                                                                <div class="col-md-8">
                                                                    <input type="text" class="form-control" id="commentadmoney2" placeholder="รายการที่ 2" value={employeeData.commentadmoney2}
                                                                        // onChange={(e) => setCommentAdmoney2(e.target.value)} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'commentadmoney2');
                                                                            setCommentAdmoney2(e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-3 col-form-label">เป็นจำนวนเงิน</label>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" placeholder="00.00" value={employeeData.admoney2}
                                                                        // onChange={handleAdmoney2} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'admoney2');
                                                                            handleAdmoney2(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="form-group row">
                                                                <div class="col-md-3 col-form-label">รายการที่ 3</div>
                                                                <div class="col-md-8">
                                                                    <input type="text" class="form-control" id="commentadmoney3" placeholder="รายการที่ 3" value={employeeData.commentadmoney3}
                                                                        // onChange={(e) => setCommentAdmoney3(e.target.value)} 
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'commentadmoney3');
                                                                            setCommentAdmoney3(e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="row">
                                                                <label class="col-md-3 col-form-label">เป็นจำนวนเงิน</label>
                                                                <div class="col-md-4">
                                                                    <input type="" class="form-control" placeholder="00.00" value={employeeData.admoney3}
                                                                        //  onChange={handleAdmoney3}
                                                                        onChange={(e) => {
                                                                            handleChange(e, 'admoney3');
                                                                            handleAdmoney3(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <label class="col-md-1 col-form-label">บาท</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <h2 class="title">การชำระ</h2>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">ค่าบัตรพนักงานรวมเป็นเงิน</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={sum} onChange={(e) => handleChange(e, 'sum')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">ค่าตรวจสุขภาพรวมเป็นเงิน</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={sum2} onChange={(e) => handleChange(e, 'sum2')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">ค่าตรวจสอบอาชญากรรมรวมเป็นเงิน</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={crimeinvestigation} onChange={(e) => handleChange(e, 'crimeinvestigation')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">ค่าเครื่องแต่งกายรวมเป็นเงิน</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={custom} onChange={(e) => handleChange(e, 'custom')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">รวมเป็นเงินทั้งหมด</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={sumall} onChange={(e) => handleChange(e, 'sumall')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">จำนวนเงินเบิก</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={sumadmoney} onChange={(e) => handleChange(e, 'sumadmoney')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <label class="col-md-3 col-form-label">เป็นเงินทั้งสิทธิ</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" id="" placeholder="00.00" value={sumall2} onChange={(e) => handleChange(e, 'sumall2')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label">บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        {/* <input type="radio" class="form-check-input" style={{ marginLeft: "8px" }} id="radio1" name="optradio" value="option1" /> */}
                                                        <input type="radio" class="form-input" style={{ marginLeft: "8px" }} id="radioPrimary1" name="r1" value="จ่ายจำนวนเต็ม" checked={employeeData.PriceType === "จ่ายจำนวนเต็ม"} onChange={(e) => handleChange(e, 'PriceType')} />
                                                        <label class="form-label col-md-3" style={{ paddingLeft: "20px", paddingTop: "10px" }} for="radio1">จ่ายจำนวนเต็ม</label>
                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" style={{ marginLeft: "-21px" }} id="" placeholder="00.00" value={sumall2} onChange={(e) => handleChange(e, 'sumall2')} readOnly />
                                                        </div>
                                                        <div class="col-md-1 col-form-label" style={{ marginLeft: "-21px" }}>บาท</div>
                                                    </div>
                                                    <div class="row form-group">
                                                        {/* <input type="radio" class="form-check-input" style={{ marginLeft: "8px" }} id="radio1" name="optradio" value="option1" /> */}
                                                        <input type="radio" class="form-input" style={{ marginLeft: "8px" }} id="radioPrimary1" name="r1" value="หักเป็นจำนวน" checked={employeeData.PriceType === "หักเป็นจำนวน"} onChange={(e) => handleChange(e, 'PriceType')} />

                                                        <label class="form-check-label col-md-3 col" style={{ paddingLeft: "20px", paddingTop: "10px" }} for="radio1">หักเป็นจำนวน</label>

                                                        <div class="col-md-3">
                                                            <input type="" class="form-control" style={{ marginLeft: "-21px" }} placeholder="00.00" value={employeeData.divide}
                                                                // onChange={(event) => setDivide(Number(event.target.value))} 
                                                                onChange={(e) => {
                                                                    handleChange(e, 'divide');
                                                                    setDivide(Number(e.target.value));
                                                                }}
                                                            />
                                                        </div>
                                                        <div class="col-md-1 col-form-label" style={{ marginLeft: "-21px" }}>ครั้ง</div>
                                                        <label class="form-check-label col-md-2 col" style={{ marginLeft: "-10px" }} for="radio1">เป็นจำนวนครั้งละ</label>
                                                        <div class="col-md-2">
                                                            <input type="" class="form-control" placeholder="00.00" value={divideall} onChange={(e) => handleChange(e, 'divideall')} />
                                                        </div>
                                                        <div class="col-md-1 col-form-label" >บาท</div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <div class="line_btn">
                                            <button type="submit" class="btn b_save" onClick={updateEmployee}><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                                            <button type="reset" class="btn clean"><i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-md-3">
                                    <section class="Frame"><EmployeesSelected /></section>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </div>

    )
}

export default OtherExpenses