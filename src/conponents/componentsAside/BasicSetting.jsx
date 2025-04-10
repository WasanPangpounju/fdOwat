import endpoint from '../../config';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

import EmployeesSelected from './EmployeesSelected';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../editwindowcss.css';

function BasicSetting() {

    const [settings, setSettings] = useState([]);
    const [editSetting, setEditSetting] = useState(null); // Track setting being edited
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
  // Fetch all BasicSettings
  const fetchSettings = async () => {
    try {
      await setLoading(true);
      const response = await axios.get(endpoint  + '/basicsetting'); // Update with your API endpoint
      if(response.status === 200 ) {
        // const data = response.data[0]; // Assuming the data structure has the required object in the first index
        const allData = response.data; // Fetch all data
        let data = null;
  
        // 1. If latest data is the last item
        if (Array.isArray(allData) && allData.length > 0) {
            data = allData[allData.length - 1];
        }
  
        setSettings(data);

                    // Update individual states
                    setMaxSalary(data?.social?.[0]?.maxSalary || '');
                    setMaxSocial(data?.social?.[0]?.maxSocial || '');
                    setSocialPercent(data?.social?.[0]?.socialPercent || '');
                    setComSocial(data?.social?.[0]?.comSocial || '');
                    setComSocialPercent(data?.social?.[0]?.comSocialPercent || '');
        
                    setSalaryStandard(data?.salary?.[0]?.salaryStandard || '');
        
                    setSickLeave(data?.leave?.[0]?.sickLeave || '');
                    setPersonalLeave(data?.leave?.[0]?.personalLeave || '');
                    setVacationLeave(data?.leave?.[0]?.vacationLeave || '');
      }
      await setLoading(false);
    } catch (err) {
        await setError(err.message);
        await setLoading(false);
    }
  };

    const [maxSalary , setMaxSalary] = useState('');
    const [maxSocial, setMaxSocial] = useState('');
const [socialPercent , setSocialPercent] = useState('');
const [comSocial , setComSocial] = useState('');
const [comSocialPercent , setComSocialPercent] = useState('');

const [salaryStandard , setSalaryStandard] = useState('');
const [sickLeave , setSickLeave] = useState('');
const[personalLeave , setPersonalLeave] = useState('');
const [vacationLeave , setVacationLeave] = useState('');


//  เลือกจังหวัด
const [selectedLocalHospital, setSelectedLocalHospital] = useState("");
//รายชื่อโรงพยาบาลรายจังหวัด
const [tmpLocalHospitalList , setTmpLocalHospitalList ] = useState([]);
//โรงพยาบาลที่เลือก
const [tmpHospital , setTmpHospital ] = useState([]);
//เพิ่มโรงพยาบาลใหม่
const [newHospital,setNewHospital] = useState('');


//โรงพยาบาลใหม่
const [addHospotal , setAddHospotal] = useState('');

//ตัวเลือกจังหวัดของโรงพยาบาลประกันสังคม
const localHospitalList = [
    { value: 'Bangkok', label: 'กรุงเทพ' },
    { value: 'BangkokPrivate', label: 'เอกชนกรุงเทพ' },
    { value: 'LopBuri', label: 'ลพบุรี' },
    { value: 'NakhonPathom', label: 'นครปฐม' },
    { value: 'Nonthaburi', label: 'นนทบุรี' },
    { value: 'SamutSakhon', label: 'สมุทรสาคร' },
    { value: 'Chachoengsao', label: 'ฉะเชิงเทรา' },
    { value: 'Rayong', label: 'ระยอง' },
    { value: 'SamutPrakan', label: 'สมุทรปราการ' },
    { value: 'Saraburi', label: 'สระบุรี' },
    { value: 'PrachinBuri', label: 'ปราจีนบุรี' },
    { value: 'KamphaengPhet', label: 'กำแพงเพชร' },
    { value: 'Ayutthaya', label: 'อยุธยา' },
];

//รายชื่อโรงพยาบาล
const hospital = {
    "Bangkok": [
        "คณะแพทยศาสตร์วชิรพยาบาล",
        "รพ.กลาง",
        "รพ.จุฬาลงกรณ์",
        "รพ.เจริญกรุงประชารักษ์",
        "รพ.ตากสิน",
        "รพ.ตำรวจ ",
        "รพ.ทัณฑสถานโรงพยาบาลราชทัณฑ์",
        "รพ.นพรัตนราชธานี(สธ)",
        "รพ.พระมงกุฎเกล้า",
        "รพ.ภูมิพลอดุลยเดช",
        "รพ.ราชวิถี(สธ)",
        "รพ.รามาธิบดี",
        "รพ.ราชพิพัฒน์",
        "รพ.เลิดสิน(สธ)",
        "รพ.เวชการุณย์รัศมิ์",
        "รพ.ศิริราช",
        "รพ.สมเด็จพระปิ่นเกล้า",
        "รพ.หลวงพ่อทวีศักดิ์ ชุตินฺธโร อุทิศ",
        "รพ.ลาดกระบัง กรุงเทพมหานคร"
      ],
      "BangkokPrivate": [
        "รพ.ทั่วไปขนาดใหญ่กล้วยน้ำไท",
        "รพ.เกษมราษฎร์ บางแคโรงพยาบาล ทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ประชาชื่น",
        "รพ..เกษมราษฎร์ รามคำแหงโรงพยาบาลทั่วไปขนาดใหญ่",
        "นวมินทร์โรงพยาบาลทั่วไปขนาดใหญ่",
        "นวมินทร์ 9 โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่บางนา 1",
        "รพ.บางปะกอก 8 โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.บางไผ่โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.บางมดโรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่ บี.แคร์ เมดิคอลเซ็นเตอร์",
        "รพ.ทั่วไปขนาดใหญ่ เปาโล โชคชัย 4",
        "รพ.ทั่วไปขนาดใหญ่เปาโล เกษตร",
        "รพ.ทั่วไปขนาดใหญ่ พีเอ็มจี",
        "รพ.พญาไท นวมินทร์ โรงพยาบาลทั่วไป ขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่มิตรประชา",
        "รพ.เพชรเวชโรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่แพทย์ปัญญา",
        "รพ.มเหสักข์โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.มงกุฎวัฒนะ",
        "รพ.มิชชั่นโรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่ราษฎร์บูรณะ",
        "รพ.ทั่วไปขนาดใหญ่ลาดพร้าว",
        "วิภาราม โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ทั่วไปขนาดใหญ่ศิครินทร์",
        "รพ.ซีจีเอช สายไหม โรงพยาบาล ทั่วไปขนาดใหญ่",
        "รพ.สุขสวัสดิ์อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.หัวเฉียวโรงพยาบาลทั่วไปขนาดใหญ่",
        "รพ.ไอเอ็มเอช ธนบุรี โรงพยาบาลทั่วไปขนาดใหญ่"
      ],
    
    "LopBuri": ["รพ.บ้านหมี่(สธ)", "รพ.พระนารายณ์มหาราช", "รพ.อานันทมหิดล"],
    "NakhonPathom": ["รพ.จันทรุเบกษา", "รพ.นครปฐม(สธ)", "รพ.เมตตาประชารักษ์ วัดไร่ขิง(สธ)", "รพ.เทพากรโรงพยาบาลทั่วไปขนาดใหญ่"],
    "Nonthaburi": ["รพ.พระนั่งเกล้า(สธ)", "รพ.ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน", "รพ.สถาบันบำราศนราดูร", "รพ.กรุงไทยโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ รัตนาธิเบศร์", "รพ.วิภารามปากเกร็ด โรงพยาบาลทั่วไปขนาดใหญ่"],
    "SamutSakhon": ["รพ.กระทุ่มแบน(สธ)", "รพ.บ้านแพ้ว(สธ)", "รพ.สมุทรสาคร(สธ)", "รพ.มหาชัย 2 โรงพยาบาลทั่วไปขนาดใหญ่", "รพ.มหาชัย 3 โรงพยาบาลทั่วไปขนาดใหญ่", "รพ.วิภาราม สมุทรสาครโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ อ้อมน้อย", "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ สมุทรสาคร"],
    "Chachoengsao": ["รพ.พุทธโสธร(สธ)", "รพ.เกษมราษฎร์ ฉะเชิงเทราโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.จุฬารัตน์ 11 อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่"],
    "Rayong": ["รพ.ระยอง(สธ)", "รพ.เฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี ระยอง(สธ)", "รพ.มงกุฎระยอง", "รพ.จุฬารัตน์ระยองโรงพยาบาลทั่วไปขนาดกลาง"],
    "SamutPrakan": ["รพ.พ.บางบ่อ(สธ)", "รพ.บางพลี(สธ)", "รพ..สมุทรปราการ(สธ)", "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 3 อินเตอร์", "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 9 แอร์พอร์ต", "รพ.ทั่วไปขนาดใหญ่โรงพยาบาลเซ็นทรัล ปาร์ค", "รพ.ทั่วไปขนาดใหญ่บางนา 2", "รพ.ทั่วไปขนาดใหญ่บางนา 5", "รพ..บางปะกอก 3 โรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ทั่วไปขนาดใหญ่เปาโล สมุทรปราการ", "รพ..เมืองสมุทรปากน าโรงพยาบาลทั่วไปขนาดใหญ่", "รพ..เมืองสมุทรปู่เจ้าฯ โรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ทั่วไปขนาดใหญ่รวมชัยประชารักษ์", "รพ.ทั่วไปขนาดใหญ่ศิครินทร์ สมุทรปราการ", "รพ.ทั่วไปขนาดใหญ่ส าโรงการแพทย์", "รพ.รามาธิบดีจักรีนฤบดินทร์", "รพ..เปาโล พระประแดงโรงพยาบาลทั่วไปขนาดกลาง"],
    "Saraburi": ["รพ.พระพุทธบาท(สธ)", "รพ.สระบุรี(สธ)", "รพ.เกษมราษฎร์ สระบุรีโรงพยาบาลทั่วไปขนาดใหญ่"],
    "PrachinBuri": ["รพ.กบินทร์บุรี(สธ)", "รพ.เกษมราษฎร์ ปราจีนบุรีโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ค่ายจักรพงษ์", "รพ.เจ้าพระยาอภัยภูเบศร(สธ)", "รพ.ทั่วไปขนาดกลางจุฬารัตน์ 304 อินเตอร์"],
    "KamphaengPhet": ["รพ.กำแพงเพชร(สธ)"],
    "Ayutthaya": ["รพ.พระนครศรีอยุธยา(สธ)", "รพ.เสนา(สธ)", "รพ.การุญเวช อยุธยาโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ราชธานีโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.ราชธานี โรจนะโรงพยาบาลทั่วไปขนาดใหญ่", "รพ.เอเชียอินเตอร์เนชั่นแนล โรงพยาบาลทั่วไปขนาดกลาง"]
  }
  
    //ตัวเลือกเงื่อนไขคิดประกันสังคม
const Socialoptions = [
    { value: 'พนักงานผ่านทดลองงาน', label: 'พนักงานผ่านทดลองงาน' },
    { value: 'มีประกันสังคมจากที่ทำงานเก่า', label: 'มีประกันสังคมจากที่ทำงานเก่า' },
    { value: 'อื่นๆ', label: 'อื่นๆ' },
];


    useEffect(() => {
        document.title = 'ตั้งค่าระบบ';

        // You can also return a cleanup function if needed
        // return () => { /* cleanup code */ };
        
        fetchSettings();
    }, []);


    const handleSelectionLocalHospotalChange = (event) => {
        setSelectedLocalHospital(event.target.value);
        //set local hospital to list
setTmpLocalHospitalList(hospital [event.target.value]);
      };

      const handleSelectionHospotalChange = (event) => {
        setTmpHospital(event.target.value);
        // alert(event.target.value)
      };

    async function handleManageSetting(event) {
        event.preventDefault();
    
        const settingData = {
            social: [{
            maxSalary,
            maxSocial,
            socialPercent,
            comSocial,
            comSocialPercent,
        }],
            salary: [{
            salaryStandard 
        }],
            leave: [{
            sickLeave,
            personalLeave,
            vacationLeave,
        }],
                // Add metadata or additional fields as needed
                year: new Date().getFullYear().toString(),
                month: new Date().toLocaleString('default', { month: 'long' }),
                createDate: new Date().toISOString(),
                createBy: 'Admin', // Replace with dynamic user info if available
                status: 'active',
        };

        try {
            const response = await axios.post(endpoint + '/basicsetting', settingData);
            if (response.status === 201) {
                alert('Data saved successfully!');
                // Optionally fetch updated settings to display
                fetchSettings();
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }

    }

    
    //view 

    return (
        // <body class="hold-transition sidebar-mini" className='editlaout'>
        //     <div class="wrapper">
        //         <div class="content-wrapper">
        <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
        
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="#">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบจัดการพนักงาน</a></li>
                        <li class="breadcrumb-item ">ข้อมูลเงินเดือน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">

                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ตั้งค่าระบบ</h1>
                            </div>
                            <div className="row mb-8 justify-content-center align-items-center">
                            <div className="col-md-6 text-center">
                                                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        </div>
                        </div>

                        </div>
                            
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-12">
                                    <form onSubmit={handleManageSetting

                                    }>
                                        <h2 class="title">รายละเอียดประกันสังคม</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">

                                                    <div class="form-group row">
                                                        <label role='maxSalary' class="col-md-3 col-form-label">เงินเดือนมากกว่า</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="maxSalary" 
                                                            placeholder="เงินเดือน" 
                                                            value={maxSalary} 
                                                            onChange={(e) => setMaxSalary(e.target.value)} />
                                                        </div>
                                                        <label role='maxSocial' class="col-md-1 col-form-label">หักสูงสุด</label>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="maxSocial" 
                                                            placeholder="เงินหัก" 
                                                            value={maxSocial} 
                                                            onChange={(e) => setMaxSocial(e.target.value)}  />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">฿</label>
                                                    </div>
                                                    
                                                    <div class="form-group row">
                                                        <label role='minSalary' class="col-md-3 col-form-label">เงินเดือนน้อยกว่า</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="minSalary" placeholder="เงินเดือน" value={maxSalary} readOnly />
                                                        </div>
                                                        <label role='socialPercent' class="col-md-1 col-form-label">เปอร์เซ็นต์หัก</label>
                                                        <div class="col-md-2">
                                                            <input type="text" class="form-control" id="socialPercent" 
                                                            placeholder="หัก" 
                                                            value={socialPercent} 
                                                            onChange={(e) => setSocialPercent(e.target.value)}  />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">%</label>

                                                    </div>
                                                    <h5>นายจ้าง</h5>
                                                    <div class="form-group row">
                                                        <label role='comSocial' class="col-md-3 col-form-label">สมทบประกันสังคมไม่เกิน</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="comSocial" 
                                                            placeholder="เงินสมทบ" 
                                                            value={comSocial} 
                                                            onChange={(e) => setComSocial(e.target.value)} />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">฿</label>
                                                        <div class="col-md-2">
                                                        <input type="text" class="form-control" id="" placeholder="เปอร์เซ็นต์" value={comSocialPercent} onChange={(e) => setComSocialPercent(e.target.value)} />
                                                        </div>
                                                        <label class="col-md-1 col-form-label">%</label>
                                                    </div>

                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>

                                        <h2 class="title">รหัสสถานรักษาพยาบาลที่รองรับพนักงาน</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label">รายชื่อสถานรักษาพยาบาล</label>
                                                        <div class="col-md-9">
                                                            <div class="row">
                                                                <div class="col-md-6">
                                                                    <select
                                                                        value={selectedLocalHospital || ''}
                                                                        onChange={handleSelectionLocalHospotalChange }
                                                                        class="form-control">
                                                                        <option value="" disabled>เลือกจังหวัด</option>

                                                                        {localHospitalList.map((hospital) => (
          <option key={hospital.value} value={hospital.value}>
            {hospital.label}
          </option>
        ))}
                                                                        {/* Add options for other locations if needed */}
                                                                    </select>
                                                                </div>
                                                                <div class="col-md-6">
                                                                    <select
                                                                        value={tmpHospital || ''}
                                                                        onChange={handleSelectionHospotalChange }
                                                                        class="form-control">
                                                                        <option value="" disabled>เลือกสถานรักษาพยาบาล</option>

                                                                        {tmpLocalHospitalList.map((hospital , index) => (
          <option key={hospital.value} value={hospital.value}>
            {hospital}
          </option>
        ))}
                                                                        {/* Add options for other locations if needed */}
                                                                    </select>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label"></label>
                                                        <div class="col-md-9">
                                                            <div class="row">
                                                            {tmpLocalHospitalList.map((item, index) => (
                <><div
                    key={index}
                    class="col-md-8"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        marginBottom: "5px",
                        textAlign: "center",
                    }}
                >
                    <p>{item}</p>
                    </div>
                    <div
                    key={index}
                    class="col-md-4"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        marginBottom: "5px",
                        textAlign: "center",
                    }}
                >

<button
                        class="btn btn-danger btn-lg"
                        style={{
                            padding: "5px 10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        onClick={() => handleDelete(index)}
                    >
                        Delete
                    </button>
                                    </div>
                </>
            ))}
</div>

<div class="row">
                <div
                    class="col-md-8"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        marginBottom: "5px",
                        textAlign: "center",
                    }}
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter hospital name"
                        value={newHospital}
                        onChange={(e) => setNewHospital(e.target.value)}
                    />
                    </div>
                    <div
                    class="col-md-4"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        marginBottom: "5px",
                        textAlign: "center",
                    }}
                >

<button
                        class="btn btn-danger btn-lg"
                        style={{
                            padding: "5px 10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        onClick={() => handleAdd(index)}
                    >
                        Add
                    </button>
                                    </div>
</div>


</div>
</div>

                                                </section>

                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>

                                        <h2 class="title">อัตราค่าจ้าง</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label role='salaryStandard' class="col-md-3 col-form-label">ค่าจ้างขั้นต่ำ</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="salaryStandard" 
                                                            placeholder="ค่าจ้างขั้นต่ำ" 
                                                            value={salaryStandard} 
                                                            onChange={(e) => setSalaryStandard(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <h2 class="title">วันลา</h2>
                                        <div class="form-group row">
                                            <div class="col-md-12">
                                                <section class="Frame">
                                                    <div class="form-group row">
                                                        <label role='sickLeave' class="col-md-3 col-form-label">ลาป่วย</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="sickLeave" placeholder="วันลาป่วย" value={sickLeave} 
                                                                                                                        onChange={(e) => setSickLeave(e.target.value)} 
/>
                                                        </div>
                                                        <label class="col-form-label">วัน</label>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label role='personalLeave' class="col-md-3 col-form-label">ลากิจ</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="personalLeave" placeholder="วันลากิจ" value={personalLeave} 
                                                                                                                                                                                    onChange={(e) => setPersonalLeave(e.target.value)} 
/>
                                                        </div>
                                                        <label class="col-form-label">วัน</label>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label role='vacationLeave' class="col-md-3 col-form-label">ลาพักร้อน</label>
                                                        <div class="col-md-5">
                                                            <input type="text" class="form-control" id="vacationLeave" placeholder="วันพักร้อน" value={vacationLeave} 
                                                                                                                                                                                                                                                onChange={(e) => setVacationLeave(e.target.value)} 
/>
                                                        </div>
                                                        <label class="col-form-label">วัน</label>
                                                    </div>
                                                </section>
                                                {/* <!--Frame--> */}
                                            </div>
                                        </div>
                                        <div class="line_btn">
                                            <button type="submit" class="btn b_save" 
                                            onClick=""><i class="nav-icon fas fa-save" onClick={() => setButtonValue('save')}></i> &nbsp;บันทึก</button>
                                            <button type="reset" class="btn clean" onClick={() => {
        window.location.reload(); // Reload the page
    }}><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        {/* </body> */}
        </div>
    )

}

export default BasicSetting