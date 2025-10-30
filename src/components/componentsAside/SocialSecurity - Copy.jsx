import endpoint from '../../config';

// import React from 'react'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import EmployeesSelected from './EmployeesSelected';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../editwindowcss.css';

function SocialSecurity() {

    // save

    // const [workplaceId, setWorkplaceId] = useState('');
    // const [workplaceSelection, setWorkplaceSelection] = useState([]);
    // const [filteredWorkplaces, setFilteredWorkplaces] = useState([]);
    // const targetWorkplace = '1001'; // Replace with your target workplace value

    // useEffect(() => {
    //     const storedValue = sessionStorage.getItem('empSelect');
    //     if (storedValue) {
    //         // setEmployeeselection(storedValue);
    //     }

    //     // Get all Workplace from API
    //     fetch(endpoint + '/workplace/list') // Update with your API endpoint
    //         .then(response => response.json())
    //         .then(data => {
    //             setWorkplaceSelection(data);
    //         })
    //         .catch(error => console.error('Error fetching workplaces:', error));
    // }, []);

    // useEffect(() => {
    //     // Filter the workplaceSelection array based on the target workplace
    //     const filteredWorkplaces = workplaceSelection.filter(workplace => workplace.workplaceId === workplaceId);
    //     setFilteredWorkplaces(filteredWorkplaces);
    //     if (filteredWorkplaces.length > 0) {
    //         const firstFilteredWorkplace = filteredWorkplaces[0];
    //         setSalaryadd1vSec(parseFloat(firstFilteredWorkplace.salaryadd1) || 0);
    //         setSalaryadd2vSec(parseFloat(firstFilteredWorkplace.salaryadd2) || 0);
    //         setSalaryadd3vSec(parseFloat(firstFilteredWorkplace.salaryadd3) || 0);
    //         setSalaryadd4vSec(parseFloat(firstFilteredWorkplace.salaryadd4) || 0);
    //         setSalaryadd5vSec(parseFloat(firstFilteredWorkplace.salaryadd5) || 0);
    //     }
    // }, [workplaceId, workplaceSelection]);
    // console.log(workplaceSelection);
    // console.log(filteredWorkplaces);

    // save

    const [buttonValue, setButtonValue] = useState('');
    const [employeeData, setEmployeeData] = useState({});
    const options = [
        { value: 'พนักงานนำส่งเอง', label: 'พนักงานนำส่งเอง' },
        { value: 'บริษัทหักนำส่งให้', label: 'บริษัทหักนำส่งให้' },
        { value: 'ฝากบริษัทนำส่ง', label: 'ฝากบริษัทนำส่ง' },
        // Add more options as needed
    ];

    ///////เงินพิเศษ
    const [jobtype, setJobtype] = useState(''); //ประเภทการจ้าง

    const [salaryadd1Sec, setSalaryadd1Sec] = useState(false); //เงินเพิ่มพิเศษ ค่ารถ
    const [salaryadd2Sec, setSalaryadd2Sec] = useState(false); //เงินเพิ่มพิเศษ ค่าอาหาร
    const [salaryadd3Sec, setSalaryadd3Sec] = useState(false); //เงินเพิ่มพิเศษ เบี้ยขยัน
    const [salaryadd4Sec, setSalaryadd4Sec] = useState(false); //เงินเพิ่มพิเศษ โทรศัพท์
    const [salaryadd5Sec, setSalaryadd5Sec] = useState(false); //เงินเพิ่มพิเศษ เงินประจำตำแหน่ง




    // const [salaryadd1vSec, setSalaryadd1vSec] = useState(100); //จำนวนเงินเพิ่มพิเศษ ค่ารถ 
    // const [salaryadd2vSec, setSalaryadd2vSec] = useState(200); //จำนวนเงินเพิ่มพิเศษ ค่าอาหาร
    // const [salaryadd3vSec, setSalaryadd3vSec] = useState(300); //จำนวนเงินเพิ่มพิเศษ เบี้ยขยัน 
    // const [salaryadd4vSec, setSalaryadd4vSec] = useState(400); //จำนวนเงินเพิ่มพิเศษ โทรศัพท์
    // const [salaryadd5vSec, setSalaryadd5vSec] = useState(500); //จำนวนเงินเพิ่มพิเศษ เงินประจำตำแหน่ง 

    const [salaryadd1vSec, setSalaryadd1vSec] = useState(''); //จำนวนเงินเพิ่มพิเศษ ค่ารถ 
    const [salaryadd2vSec, setSalaryadd2vSec] = useState(''); //จำนวนเงินเพิ่มพิเศษ ค่าอาหาร
    const [salaryadd3vSec, setSalaryadd3vSec] = useState(''); //จำนวนเงินเพิ่มพิเศษ เบี้ยขยัน 
    const [salaryadd4vSec, setSalaryadd4vSec] = useState(''); //จำนวนเงินเพิ่มพิเศษ โทรศัพท์
    const [salaryadd5vSec, setSalaryadd5vSec] = useState(''); //จำนวนเงินเพิ่มพิเศษ เงินประจำตำแหน่ง 

    const [salaryaddtypeSec, setSalaryaddtypeSec] = useState(''); //เพิ่มพิเศษแบบ ต่อวัน ต่อเดือน
    // const [salaryaddsumSec, setSalaryaddsumSec] = useState(0); //เพิ่มพิเศษแบบ ต่อวัน ต่อเดือน
    const salaryaddsumSec = () => {
        let total = 0;
        if (salaryadd1Sec) total += salaryadd1vSec;
        if (salaryadd2Sec) total += salaryadd2vSec;
        if (salaryadd3Sec) total += salaryadd3vSec;
        if (salaryadd4Sec) total += salaryadd4vSec;
        if (salaryadd5Sec) total += salaryadd5vSec;
        return total;
    };

    // Step 4: Use useState to manage the selected option
    const Bangkok = ['คณะแพทยศาสตร์วชิรพยาบาล', 'รพ.กลาง', 'รพ.จุฬาลงกรณ์', 'รพ.เจริญกรุงประชารักษ์', 'รพ.ตากสิน', 'รพ.ตำรวจ ', 'รพ.ทัณฑสถานโรงพยาบาลราชทัณฑ์', 'รพ.นพรัตนราชธานี(สธ)', 'รพ.พระมงกุฎเกล้า', 'รพ.ภูมิพลอดุลยเดช', 'รพ.ราชวิถี(สธ)', 'รพ.รามาธิบดี', 'รพ.ราชพิพัฒน์', 'รพ.เลิดสิน(สธ)', 'รพ.เวชการุณย์รัศมิ์', 'รพ.ศิริราช', 'รพ.สมเด็จพระปิ่นเกล้า', 'รพ.สมเด็จพระปิ่นเกล้า', 'รพ.หลวงพ่อทวีศักดิ์ ชุตินฺธโร อุทิศ', 'รพ.ลาดกระบัง กรุงเทพมหานคร']
    const BangkokPrivate = ['รพ.ทั่วไปขนาดใหญ่กล้วยน้ำไท', 'รพ.เกษมราษฎร์ บางแคโรงพยาบาล ทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ประชาชื่น', 'รพ..เกษมราษฎร์ รามคำแหงโรงพยาบาลทั่วไปขนาดใหญ่', 'นวมินทร์โรงพยาบาลทั่วไปขนาดใหญ่', 'นวมินทร์ 9 โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่บางนา 1', 'รพ.บางปะกอก 8 โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.บางไผ่โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.บางมดโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่ บี.แคร์ เมดิคอลเซ็นเตอร์', 'รพ.ทั่วไปขนาดใหญ่ เปาโล โชคชัย 4', 'รพ.ทั่วไปขนาดใหญ่เปาโล เกษตร', 'รพ.ทั่วไปขนาดใหญ่ พีเอ็มจี', 'รพ.พญาไท นวมินทร์ โรงพยาบาลทั่วไป ขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่มิตรประชา', 'รพ.เพชรเวชโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่แพทย์ปัญญา', 'รพ.มเหสักข์โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.มงกุฎวัฒนะ', 'รพ.มิชชั่นโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่ราษฎร์บูรณะ', 'รพ.ทั่วไปขนาดใหญ่ลาดพร้าว', 'วิภาราม โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่ศิครินทร์', 'รพ.ซีจีเอช สายไหม โรงพยาบาล ทั่วไปขนาดใหญ่', 'รพ.สุขสวัสดิ์อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.หัวเฉียวโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ไอเอ็มเอช ธนบุรี โรงพยาบาลทั่วไปขนาดใหญ่']
    const LopBuri = ['รพ.บ้านหมี่(สธ)', 'รพ.พระนารายณ์มหาราช', 'รพ.อานันทมหิดล']
    const NakhonPathom = ['รพ.จันทรุเบกษา', 'รพ.นครปฐม(สธ)', 'รพ.เมตตาประชารักษ์ วัดไร่ขิง(สธ)', 'รพ.เทพากรโรงพยาบาลทั่วไปขนาดใหญ่']
    const Nonthaburi = ['รพ.พระนั่งเกล้า(สธ)', 'รพ.ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน', 'รพ.สถาบันบำราศนราดูร', 'รพ.กรุงไทยโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.กรุงไทยโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ รัตนาธิเบศร์', 'รพ.วิภารามปากเกร็ด โรงพยาบาลทั่วไปขนาดใหญ่']
    const SamutSakhon = ['รพ.กระทุ่มแบน(สธ)', 'รพ.บ้านแพ้ว(สธ)', 'รพ.สมุทรสาคร(สธ)', 'รพ.มหาชัย 2 โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.มหาชัย 3 โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.วิภาราม สมุทรสาครโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ อ้อมน้อย', 'รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ สมุทรสาคร']
    const Chachoengsao = ['รพ.พุทธโสธร(สธ)', 'รพ.เกษมราษฎร์ ฉะเชิงเทราโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.จุฬารัตน์ 11 อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่']
    const Rayong = ['รพ.ระยอง(สธ)', 'รพ.เฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี ระยอง(สธ)', 'รพ.มงกุฎระยอง', 'รพ.จุฬารัตน์ระยองโรงพยาบาลทั่วไปขนาดกลาง']
    const SamutPrakan = ['รพ.พ.บางบ่อ(สธ)', 'รพ.บางพลี(สธ)', 'รพ..สมุทรปราการ(สธ)', 'รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 3 อินเตอร์', 'รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 9 แอร์พอร์ต', 'รพ.ทั่วไปขนาดใหญ่โรงพยาบาลเซ็นทรัล ปาร์ค', 'รพ.ทั่วไปขนาดใหญ่บางนา 2', 'รพ.ทั่วไปขนาดใหญ่บางนา 5', 'รพ..บางปะกอก 3 โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่เปาโล สมุทรปราการ', 'รพ..เมืองสมุทรปากน าโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ..เมืองสมุทรปู่เจ้าฯ โรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ทั่วไปขนาดใหญ่รวมชัยประชารักษ์', 'รพ.ทั่วไปขนาดใหญ่ศิครินทร์ สมุทรปราการ', 'รพ.ทั่วไปขนาดใหญ่ส าโรงการแพทย์', 'รพ.รามาธิบดีจักรีนฤบดินทร์', 'รพ..เปาโล พระประแดงโรงพยาบาลทั่วไปขนาดกลาง']
    const Saraburi = ['รพ.พระพุทธบาท(สธ)', 'รพ.สระบุรี(สธ)', 'รพ.เกษมราษฎร์ สระบุรีโรงพยาบาลทั่วไปขนาดใหญ่']
    const PrachinBuri = ['รพ.กบินทร์บุรี(สธ)', 'รพ.เกษมราษฎร์ ปราจีนบุรีโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ค่ายจักรพงษ์', 'รพ.เจ้าพระยาอภัยภูเบศร(สธ)', 'รพ.ทั่วไปขนาดกลางจุฬารัตน์ 304 อินเตอร์']
    const KamphaengPhet = ['รพ.กำแพงเพชร(สธ)']
    const Ayutthaya = ['รพ.พระนครศรีอยุธยา(สธ)', 'รพ.เสนา(สธ)', 'รพ.การุญเวช อยุธยาโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ราชธานีโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.ราชธานี โรจนะโรงพยาบาลทั่วไปขนาดใหญ่', 'รพ.เอเชียอินเตอร์เนชั่นแนล โรงพยาบาลทั่วไปขนาดกลาง']
    const [inputValue, setInputValue] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Bangkok');

    const [selectedHospDFSelect, setSelectedHospDFSelect] = useState('');
    const [selectedHospSelect1, setSelectedHospSelect1] = useState('');
    const [selectedHospSelect2, setSelectedHospSelect2] = useState('');
    const [selectedHospSelect3, setSelectedHospSelect3] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
    };

    const handleSelectLocation = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);
    };

    const filteredHospitals = selectedLocation === 'Bangkok'
        ? Bangkok.filter(hospital => hospital.includes(inputValue))
        : selectedLocation === 'BangkokPrivate'
            ? BangkokPrivate.filter(hospital => hospital.includes(inputValue))
            : selectedLocation === 'LopBuri'
                ? LopBuri.filter(hospital => hospital.includes(inputValue))
                : selectedLocation === 'NakhonPathom'
                    ? NakhonPathom.filter(hospital => hospital.includes(inputValue))
                    : selectedLocation === 'Nonthaburi'
                        ? Nonthaburi.filter(hospital => hospital.includes(inputValue))
                        : selectedLocation === 'SamutSakhon'
                            ? SamutSakhon.filter(hospital => hospital.includes(inputValue))
                            : selectedLocation === 'Chachoengsao'
                                ? Chachoengsao.filter(hospital => hospital.includes(inputValue))
                                : selectedLocation === 'Rayong'
                                    ? Rayong.filter(hospital => hospital.includes(inputValue))
                                    : selectedLocation === 'SamutPrakan'
                                        ? SamutPrakan.filter(hospital => hospital.includes(inputValue))
                                        : selectedLocation === 'Saraburi'
                                            ? Saraburi.filter(hospital => hospital.includes(inputValue))
                                            : selectedLocation === 'PrachinBuri'
                                                ? PrachinBuri.filter(hospital => hospital.includes(inputValue))
                                                : selectedLocation === 'KamphaengPhet'
                                                    ? KamphaengPhet.filter(hospital => hospital.includes(inputValue))
                                                    : selectedLocation === 'Ayutthaya'
                                                        ? Ayutthaya.filter(hospital => hospital.includes(inputValue))
                                                        : [];



    //////////
    const [beforebecomeEmployee, setBeforebecomeEmployee] = useState('');
    const [wagesbeforeusingProgram, setWagesbeforeusingProgram] = useState('');
    const [wagesafterusingProgram, setWagesafterusingProgram] = useState('');
    const [companybeforeusingProgram, setCompanybeforeusingProgram] = useState('');
    // Step 4: Use useState to manage the selected option
    const [selectedOption, setSelectedOption] = useState('');
    const [startjob, setStartjob] = useState(''); //วันที่เริ่มงาน
    const [idPerson, setIdPerson] = useState(''); //เลขบัตรประชาชน
    const [name, setName] = useState(''); //ชื่อ
    const [salary, setSalary] = useState(''); //เงินเดือน
    const [minus, setMinus] = useState('5'); //หัห
    const [socialsecurity, setSocialSecurity] = useState(''); //หักประกันสังคม

    // parsedSalaryFinal
    const [parsedSalaryFinalv, setParsedSalaryFinal] = useState(0); //หักประกันสังคม


    const [employeeselection, setEmployeeselection] = useState([]);

    const [minusemployer, setMinusEmployer] = useState('5'); //หัห
    const [socialsecurityemployer, setSocialSecurityEmployer] = useState(''); //หักประกันสังคม


    ///////select hospitel
    const [selectedHospDf, setSelectedHospDf] = useState('');
    const [selectedHosp1, setSelectedHosp1] = useState('');
    const [selectedHosp2, setSelectedHosp2] = useState('');
    const [selectedHosp3, setSelectedHosp3] = useState('');

    const handleselectedHospDfChange = (event) => {
        const value = event.target.value;
        setSelectedHospDf(value);
    };
    const handleselectedHosp1Change = (event) => {
        const value = event.target.value;
        setSelectedHosp1(value);
    };
    const handleselectedHosp2Change = (event) => {
        const value = event.target.value;
        setSelectedHosp2(value);
    };
    const handleselectedHosp3Change = (event) => {
        const value = event.target.value;
        setSelectedHosp3(value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleStartDateChange = (date) => {
        setStartjob(date);
    };

    // function onEmployeeSelect(empSelect) {
    //     setStartjob(new Date(empSelect.startjob));
    // }

    async function updateEmployee(_id) {
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
        // setEmployeeselection(empSelect);
        await setEmployeeData(empSelect);
        setStartjob(empSelect.startjob ? new Date(empSelect.startjob) : '');
        setIdPerson(empSelect.idCard);

        setName(empSelect.name);
        // setName(parseFloat(empSelect.salaryadd3v) || 0);

        setSalary(empSelect.salary);
        setMinus(empSelect.minus);
        // setWorkplaceId(empSelect.workplace);

        // setSalaryadd1vSec(parseFloat(empSelect.salaryadd1v) || 0);
        // setSalaryadd2vSec(parseFloat(empSelect.salaryadd2v) || 0);
        // setSalaryadd3vSec(parseFloat(empSelect.salaryadd3v) || 0);
        // setSalaryadd4vSec(parseFloat(empSelect.salaryadd4v) || 0);
        // setSalaryadd5vSec(parseFloat(empSelect.salaryadd5v) || 0);

        // setSalaryadd1vSec(empSelect.salaryadd1v || 0);
        setSalaryadd1vSec(empSelect.workplace);

        setSalaryadd2vSec(empSelect.salaryadd2v || 0);
        setSalaryadd3vSec(empSelect.salaryadd3v || 0);
        setSalaryadd4vSec(empSelect.salaryadd4v || 0);
        setSalaryadd5vSec(empSelect.salaryadd5v || 0);

        setJobtype(empSelect.jobtype);
        // alert(empSelect._id);
        console.log(employeeData);
    }
    async function handleManageEmployee(event) {
        event.preventDefault();

        const data = {
            selectedOption: selectedOption,
            startjob: startjob,
            idPerson: idPerson,
            name: name,
            salary: salary,
            minus: minus,
            socialsecurity: socialsecurity,
            socialsecurityemployer: socialsecurityemployer,
            minusemployer: minusemployer,
            selectedHospDf: selectedHospDf,
            selectedHosp1: selectedHosp1,
            selectedHosp2: selectedHosp2,
            selectedHosp3: selectedHosp3,

            salaryadd1Sec: salaryadd1Sec,
            salaryadd2Sec: salaryadd2Sec,
            salaryadd3Sec: salaryadd3Sec,
            salaryadd4Sec: salaryadd4Sec,
            salaryadd5Sec: salaryadd5Sec,

            salaryaddtypeSec: salaryaddtypeSec,
            salaryaddsumSec: salaryaddsumSec,

            salaryadd1vSec: salaryadd1vSec,
            salaryadd2vSec: salaryadd2vSec,
            salaryadd3vSec: salaryadd3vSec,
            salaryadd4vSec: salaryadd4vSec,
            salaryadd5vSec: salaryadd5vSec,

        };

        //check create or update Employee
        // if (newEmp) {
        //     // alert('create employee');

        //     try {
        //         const response = await axios.post(endpoint + '/employee/create', data);
        //         // setEmployeesResult(response.data.employees);

        //     } catch (error) {
        //         alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
        //         // window.location.reload();

        //     }

        // } else {
        // if (buttonValue == 'save') {
        //     // Make the API call to update the resource by ID
        //     try {
        //         const response = await axios.put(endpoint + '/employee/update/' + _id, data);
        //         // setEmployeesResult(response.data.employees);
        //         if (response) {
        //             alert("บันทึกสำเร็จ");
        //             window.location.reload();

        //         }
        //     } catch (error) {
        //         alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
        //         alert(error);
        //         window.location.reload();
        //     }


        // }

        // }

    }

    useEffect(() => {
        const storedValue = sessionStorage.getItem('empSelect');
        if (storedValue) {
            // setEmployeeselection(storedValue);
        }

        //get all Workplace from API
        // fetch(endpoint + '/workplace/listselect') // Update with your API endpoint
        //     .then(response => response.json())
        //     .then(data => {
        //         setWorkplaceSelection(data);
        //     }
        //     )
        //     .catch(error => console.error('Error fetching employees:', error));

    }, []);

    const [storedEmp, setStoredEmp] = useState([]);

    useEffect(() => {
        if (employeeData.salary === '') {
            setSocialSecurity(0);
            setParsedSalaryFinal(0);
        } else {
            const parsedSalary = parseFloat(employeeData.salary);
            const parsedSalarySS = parseFloat(salaryaddsumSec());
            const parsedSalaryFinal = parsedSalary + parsedSalarySS;
            const parsedMinus = parseFloat(employeeData.minus) / 100; // Convert the minus percentage to a decimal
            // console.log(parsedSalarySS);
            if (parsedSalaryFinal < 1650) {
                setSocialSecurity(1650 * parsedMinus);
                setParsedSalaryFinal(parsedSalaryFinal);
            } else if (parsedSalaryFinal >= 1650 && parsedSalaryFinal <= 15000) {
                setSocialSecurity(parsedSalaryFinal * parsedMinus);
                setParsedSalaryFinal(parsedSalaryFinal);
            } else {
                setSocialSecurity(15000 * parsedMinus);
                setParsedSalaryFinal(parsedSalaryFinal);
            }
        }
    }, [employeeData.salary, employeeData.minus, salaryaddsumSec]);

    useEffect(() => {
        if (employeeData.salary === '') {
            setSocialSecurityEmployer(0);
        } else {
            const parsedSalary = parseFloat(employeeData.salary);
            const parsedMinusEmpoyor = parseFloat(employeeData.minusemployer) / 100; // Convert the minus percentage to a decimal
            if (parsedSalary < 1650) {
                setSocialSecurityEmployer(1650 * parsedMinusEmpoyor);
            } else if (parsedSalary >= 1650 && parsedSalary <= 15000) {
                setSocialSecurityEmployer(parsedSalary * parsedMinusEmpoyor);
            } else {
                setSocialSecurityEmployer(15000 * parsedMinusEmpoyor);
            }
        }
    }, [employeeData.salary, employeeData.minusemployer]);

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


    // const handleChange = (e, field) => {
    //     setEmployeeData(prevData => ({
    //         ...prevData,
    //         [field]: e.target.value,
    //     }));
    // };

    const handleChange = (e, field) => {
        const newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setEmployeeData(prevData => ({
            ...prevData,
            [field]: newValue,
        }));
    };

    // const handleChange = (e, field) => {
    //     switch (field) {
    //         case 'salaryadd1Sec':
    //         case 'salaryadd2Sec':
    //         case 'salaryadd3Sec':
    //         case 'salaryadd4Sec':
    //         case 'salaryadd5Sec':
    //             setEmployeeData(prevData => ({
    //                 ...prevData,
    //                 [field]: !prevData[field],
    //             }));
    //             break;
    //         default:
    //             setEmployeeData(prevData => ({
    //                 ...prevData,
    //                 [field]: e.target.value,
    //             }));
    //             break;
    //     }
    // };

    // Step 5: Event handler to update the selected option

    const toggleCheckbox1 = () => {
        setSalaryadd1Sec(prevValue => !prevValue); // Toggle the checkbox state
        handleChange({ target: { type: 'checkbox', checked: !salaryadd1Sec } }, 'salaryadd1Sec');
    };

    const toggleCheckbox2 = () => {
        setSalaryadd2Sec(prevValue => !prevValue); // Toggle the checkbox state
        handleChange({ target: { type: 'checkbox', checked: !salaryadd2Sec } }, 'salaryadd2Sec');
    };

    const toggleCheckbox3 = () => {
        setSalaryadd3Sec(prevValue => !prevValue); // Toggle the checkbox state
        handleChange({ target: { type: 'checkbox', checked: !salaryadd3Sec } }, 'salaryadd3Sec');
    };

    const toggleCheckbox4 = () => {
        setSalaryadd4Sec(prevValue => !prevValue); // Toggle the checkbox state
        handleChange({ target: { type: 'checkbox', checked: !salaryadd4Sec } }, 'salaryadd4Sec');
    };

    const toggleCheckbox5 = () => {
        setSalaryadd5Sec(prevValue => !prevValue); // Toggle the checkbox state
        handleChange({ target: { type: 'checkbox', checked: !salaryadd5Sec } }, 'salaryadd5Sec');
    };



    console.log(employeeData);
    console.log("เงิน" + salaryadd1vSec);
    console.log(salaryadd1Sec);

    console.log(name);



    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบบริหารจัดการข้อมูล</a></li>
                        <li class="breadcrumb-item active">ข้อมูลเงินเดือน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ประกันสังคม</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <form onSubmit={handleManageEmployee}>
                                <h2 class="title">รายละเอียดประกันสังคม</h2>
                                <div class="form-group row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-md-3 ">หักประกันสังคม</label>
                                                <div class="col-md-5">
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary1" name="r1" value="หักประกันสังคม" checked={employeeData.SocialSecurityCheck === "หักประกันสังคม"} onChange={(e) => handleChange(e, 'SocialSecurityCheck')} /> หักประกันสังคม
                                                    </div>
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary2" name="r1" value="ไม่หักประกันสังคม" checked={employeeData.SocialSecurityCheck === "ไม่หักประกันสังคม"} onChange={(e) => handleChange(e, 'SocialSecurityCheck')} /> ไม่หักประกันสังคม
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">วิธีหัก</label>
                                                <div class="col-md-5">
                                                    <select class="form-control" value={selectedOption} onChange={handleOptionChange}>
                                                    <option value="">เลือกวิธีการ</option>
                                                        {options.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">วันที่เริ่มงาน</label>
                                                <div class="col-md-5">
                                                    <div style={{ position: 'relative', zIndex: 9999 }}>
                                                        <DatePicker id="startjob" name="startjob"
                                                            className="form-control"
                                                            popperClassName="datepicker-popper"
                                                            selected={startjob}
                                                            onChange={handleStartDateChange}
                                                            dateFormat="dd/MM/yyyy" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">เลขที่บัตรประชาชน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="เลขที่บัตรประชาชน" value={idPerson} onChange={(e) => setIdPerson(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ชื่อ - นามสกุล</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="ชื่อ - นามสกุล" value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="เงินเดือน" value={employeeData.salary} onChange={(e) => handleChange(e, 'salary')} />
                                                </div>
                                                <label class="col-md-1 col-form-label">หัก%</label>
                                                <div class="col-md-2">
                                                    <input type="" class="form-control" id="" placeholder="เงินเดือน" value={employeeData.minus} onChange={(e) => handleChange(e, 'minus')} />
                                                </div>
                                                <label class="col-md-1 col-form-label">%</label>
                                            </div>
                                            {jobtype === "รายวัน" && (
                                                <div>
                                                    พนักงานแบบรายวัน + รายได้เพิ่มเติม
                                                </div>
                                            )}
                                            <h2 class="title">เงินเพิ่มพิเศษ</h2>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <section class="Frame">

                                                        <div class="col-md-12">
                                                            <div class="row">
                                                                <div class="col-md-12">
                                                                    <div class="form-group">
                                                                        

                                                                        <label>รายการเงินเพิ่มพิเศษ</label>
                                                                        <button onClick={() => toggleCheckbox1('salaryadd1Sec')} style={{ margin: '0.5rem' }}>ค่ารถ</button>
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                id="salaryadd1Sec"
                                                                                checked={salaryadd1Sec}
                                                                                onChange={e => handleChange(e, 'salaryadd1Sec')}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                        </label>
                                                                        <button onClick={() => toggleCheckbox2('salaryadd2Sec')} style={{ margin: '0.5rem' }}>ค่าอาหาร</button>
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                id="salaryadd2Sec"
                                                                                checked={salaryadd2Sec}
                                                                                onChange={e => handleChange(e, 'salaryadd2Sec')}
                                                                                style={{ display: 'none' }} />
                                                                        </label>
                                                                        <button onClick={() => toggleCheckbox3('salaryadd3Sec')} style={{ margin: '0.5rem' }}>เบี้ยขยัน</button>
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                id="salaryadd3Sec"
                                                                                checked={salaryadd3Sec}
                                                                                onChange={e => handleChange(e, 'salaryadd3Sec')}
                                                                                style={{ display: 'none' }} />
                                                                        </label>
                                                                        <button onClick={() => toggleCheckbox4('salaryadd4Sec')} style={{ margin: '0.5rem' }}>ค่าโทรศัพท์</button>

                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                id="salaryadd4Sec"
                                                                                checked={salaryadd4Sec}
                                                                                onChange={e => handleChange(e, 'salaryadd4Sec')}
                                                                                style={{ display: 'none' }}
                                                                            />
                                                                        </label>

                                                                        <button onClick={() => toggleCheckbox5('salaryadd5Sec')} style={{ margin: '0.5rem' }}>เงินประจำตำแหน่ง</button>

                                                                        <label >
                                                                            <input
                                                                                type="checkbox"
                                                                                id="salaryadd5Sec"
                                                                                checked={salaryadd5Sec}
                                                                                onChange={e => handleChange(e, 'salaryadd5Sec')}
                                                                                style={{ display: 'none' }} />
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryaddtypeSec">เพิ่มพิเศษแบบ</label>
                                                                        <select id="salaryaddtypeSec" name="salaryaddtypeSec" class="form-control"
                                                                            value={employeeData.salaryaddtypeSec || ''} onChange={(e) => handleChange(e, 'salaryaddtypeSec')} >
                                                                            <option value="">ไม่ระบุ</option>
                                                                            <option value="ต่อเดือน">ต่อเดือน</option>
                                                                            <option value="ต่อวัน">ต่อวัน</option>
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {/* {employeeData.salaryadd1Sec && ( */}
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryadd1vSec">เงินเพิ่มค่ารถ</label>
                                                                        <label htmlFor="salaryadd1Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd1Sec ? 'checked' : ''}`}>
                                                                                <i className={`fa ${salaryadd1Sec ? 'fa-check' : 'fa-times'}`} />
                                                                            </div>
                                                                        </label>
                                                                        <input type="text" class="form-control" id="salaryadd1vSec" placeholder="ค่ารถ" value={salaryadd1vSec} onChange={(e) => handleChange(e, 'salaryadd1vSec')}
                                                                            readOnly />
                                                                    </div>
                                                                </div>
                                                                {/* )} */}

                                                                {/* {employeeData.salaryadd2Sec && ( */}
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryadd2vSec">เงินเพิ่มค่าอาหาร</label>
                                                                        <label htmlFor="salaryadd2Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd2Sec ? 'checked' : ''}`}>
                                                                                <i className={`fa ${salaryadd2Sec ? 'fa-check' : 'fa-times'}`} />
                                                                            </div>
                                                                        </label>
                                                                        <input type="text" class="form-control" id="salaryadd2vSec" placeholder="ค่าอาหาร" value={salaryadd2vSec} onChange={(e) => handleChange(e, 'salaryadd2vSec')}
                                                                            readOnly />
                                                                    </div>
                                                                </div>
                                                                {/* )} */}

                                                                {/* {employeeData.salaryadd3Sec && ( */}
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryadd3vSec">ค่าเบี้ยขยัน</label>
                                                                        <label htmlFor="salaryadd3Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd3Sec ? 'checked' : ''}`}>
                                                                                <i className={`fa ${salaryadd3Sec ? 'fa-check' : 'fa-times'}`} />
                                                                            </div>
                                                                        </label>
                                                                        <input type="text" class="form-control" id="salaryadd3vSec" placeholder="ค่าเบี้ยขยัน" value={salaryadd3vSec} onChange={(e) => handleChange(e, 'salaryadd3vSec')}
                                                                            readOnly />
                                                                    </div>
                                                                </div>
                                                                {/* )} */}

                                                                {/* {employeeData.salaryadd4Sec && ( */}
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryadd4vSec">ค่าโทรศัพท์</label>
                                                                        <label htmlFor="salaryadd4Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd4Sec ? 'checked' : ''}`}>
                                                                                <i className={`fa ${salaryadd4Sec ? 'fa-check' : 'fa-times'}`} />
                                                                            </div>
                                                                        </label>
                                                                        <label htmlFor="salaryadd4Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd4Sec ? 'checked' : ''}`}>
                                                                                {/* {salaryadd4Sec ? ( */}
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="salaryadd4vSec"
                                                                                    placeholder="ค่ารถ"
                                                                                    value={salaryadd4vSec}
                                                                                    onChange={(e) => handleChange(e, 'salaryadd4vSec')}
                                                                                    readOnly
                                                                                />
                                                                                {/* ) : null} */}
                                                                            </div>
                                                                        </label>

                                                                    </div>
                                                                </div>
                                                                {/* )} */}

                                                                {/* {employeeData.salaryadd5Sec && ( */}
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryadd5vSec">เงินประจำตำแหน่ง</label>
                                                                        <label htmlFor="salaryadd5Sec" style={{ cursor: 'pointer' }}>
                                                                            <div className={`custom-checkbox ${salaryadd5Sec ? 'checked' : ''}`}>
                                                                                <i className={`fa ${salaryadd5Sec ? 'fa-check' : 'fa-times'}`} />
                                                                            </div>
                                                                        </label>
                                                                        <input type="text" class="form-control" id="salaryadd5vSec" placeholder="เงินประจำตำแหน่ง" value={salaryadd5vSec} onChange={(e) => handleChange(e, 'salaryadd5vSec')}
                                                                            readOnly />
                                                                    </div>
                                                                </div>
                                                                {/* )} */}

                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryaddsumSec">เงินเพิ่มพิเศษรวม</label>
                                                                        <input type="text" class="form-control" id="salaryaddsumSec" placeholder="จำนวนเงิน" value={salaryaddsumSec()} readOnly />
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <div class="form-group">
                                                                        <label role="salaryaddsumSec">เงินสุทธิทั้งหมด</label>
                                                                        <input type="text" class="form-control" id="salaryaddsumSec" placeholder="จำนวนเงิน" value={parsedSalaryFinalv} readOnly />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {/* <!--row--> */}
                                                        </div>
                                                        {/* <!--col-md-12--> */}
                                                    </section>
                                                    {/* <!--Frame--> */}
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">หักประกันสังคม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="หักประกันสังคม" value={socialsecurity} onChange={(e) => handleChange(e, 'socialsecurity')} readOnly />
                                                </div>
                                            </div>
                                            <h5>นายจ้าง</h5>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">หักประกันสังคม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="หักประกันสังคม" value={socialsecurityemployer} onChange={(e) => handleChange(e, 'socialsecurityemployer')} readOnly />
                                                </div>
                                                <label class="col-md-1 col-form-label">หัก%</label>
                                                <div class="col-md-2">
                                                    <input type="" class="form-control" id="" placeholder="เงินเดือน" value={employeeData.minusemployer} onChange={(e) => handleChange(e, 'minusemployer')} />
                                                </div>
                                                <label class="col-md-1 col-form-label">%</label>
                                            </div>

                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                    <div class="col-md-3">
                                        <section class="Frame"><EmployeesSelected onEmployeeSelect={onEmployeeSelect} /></section>
                                    </div>
                                </div>

                                <h2 class="title">รหัสสถานรักษาพยาบาลที่พนักงานต้องการ</h2>
                                <div class="form-group row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ชื่อสถานรักษาพยาลบาลปัจจุบัน</label>
                                                <div class="col-md-9">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <select
                                                                value={employeeData.selectedHospDFSelect || ''}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'selectedHospDFSelect');
                                                                    handleSelectLocation(e);
                                                                }}
                                                                class="form-control">
                                                                <option value="">ไม่ระบุ</option>
                                                                <option value="Bangkok">กรุงเทพ</option>
                                                                <option value="BangkokPrivate">เอกชนกรุงเทพ</option>
                                                                <option value="LopBuri">ลพบุรี</option>
                                                                <option value="NakhonPathom">นครปฐม</option>
                                                                <option value="Nonthaburi">นนทบุรี</option>
                                                                <option value="SamutSakhon">สมุทรสาคร</option>
                                                                <option value="Chachoengsao">ฉะเชิงเทรา</option>
                                                                <option value="Rayong">ระยอง</option>
                                                                <option value="SamutPrakan">สมุทรปราการ</option>
                                                                <option value="Saraburi">สระบุรี</option>
                                                                <option value="PrachinBuri">ปราจีนบุรี</option>
                                                                <option value="KamphaengPhet">กำแพงเพชร</option>
                                                                <option value="Ayutthaya">อยุธยา</option>
                                                                {/* Add options for other locations if needed */}
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <input
                                                                type="text" class="form-control"
                                                                value={employeeData.selectedHospDf}
                                                                onInput={handleselectedHospDfChange}
                                                                onChange={(e) => handleChange(e, 'selectedHospDf')}
                                                                list="hospitalList"
                                                            />
                                                        </div>
                                                        {selectedLocation === 'Bangkok' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'BangkokPrivate' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'LopBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'NakhonPathom' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Nonthaburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutSakhon' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Chachoengsao' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Rayong' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutPrakan' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Saraburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'PrachinBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'KamphaengPhet' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Ayutthaya' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ต้องการเลือกลำดับที่ 1</label>
                                                <div class="col-md-9">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <select
                                                                value={employeeData.selectedHospSelect1 || ''}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'selectedHospSelect1');
                                                                    handleSelectLocation(e);
                                                                }} class="form-control">
                                                                <option value="">ไม่ระบุ</option>
                                                                <option value="Bangkok">กรุงเทพ</option>
                                                                <option value="BangkokPrivate">เอกชนกรุงเทพ</option>
                                                                <option value="LopBuri">ลพบุรี</option>
                                                                <option value="NakhonPathom">นครปฐม</option>
                                                                <option value="Nonthaburi">นนทบุรี</option>
                                                                <option value="SamutSakhon">สมุทรสาคร</option>
                                                                <option value="Chachoengsao">ฉะเชิงเทรา</option>
                                                                <option value="Rayong">ระยอง</option>
                                                                <option value="SamutPrakan">สมุทรปราการ</option>
                                                                <option value="Saraburi">สระบุรี</option>
                                                                <option value="PrachinBuri">ปราจีนบุรี</option>
                                                                <option value="KamphaengPhet">กำแพงเพชร</option>
                                                                <option value="Ayutthaya">อยุธยา</option>
                                                                {/* Add options for other locations if needed */}
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <input
                                                                type="text" class="form-control"
                                                                value={employeeData.selectedHosp1}
                                                                onInput={handleselectedHosp1Change}
                                                                onChange={(e) => handleChange(e, 'selectedHosp1')}
                                                                list="hospitalList"
                                                            />
                                                        </div>
                                                        {selectedLocation === 'Bangkok' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'BangkokPrivate' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'LopBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'NakhonPathom' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Nonthaburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutSakhon' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Chachoengsao' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Rayong' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutPrakan' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Saraburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'PrachinBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'KamphaengPhet' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Ayutthaya' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ต้องการเลือกลำดับที่ 2</label>
                                                <div class="col-md-9">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <select
                                                                value={employeeData.selectedHospSelect2 || ''}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'selectedHospSelect2');
                                                                    handleSelectLocation(e);
                                                                }}
                                                                class="form-control">
                                                                <option value="">ไม่ระบุ</option>
                                                                <option value="Bangkok">กรุงเทพ</option>
                                                                <option value="BangkokPrivate">เอกชนกรุงเทพ</option>
                                                                <option value="LopBuri">ลพบุรี</option>
                                                                <option value="NakhonPathom">นครปฐม</option>
                                                                <option value="Nonthaburi">นนทบุรี</option>
                                                                <option value="SamutSakhon">สมุทรสาคร</option>
                                                                <option value="Chachoengsao">ฉะเชิงเทรา</option>
                                                                <option value="Rayong">ระยอง</option>
                                                                <option value="SamutPrakan">สมุทรปราการ</option>
                                                                <option value="Saraburi">สระบุรี</option>
                                                                <option value="PrachinBuri">ปราจีนบุรี</option>
                                                                <option value="KamphaengPhet">กำแพงเพชร</option>
                                                                <option value="Ayutthaya">อยุธยา</option>
                                                                {/* Add options for other locations if needed */}
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <input
                                                                type="text" class="form-control"
                                                                value={employeeData.selectedHosp2}
                                                                onInput={handleselectedHosp2Change}
                                                                onChange={(e) => handleChange(e, 'selectedHosp2')}
                                                                list="hospitalList"
                                                            />
                                                        </div>
                                                        {selectedLocation === 'Bangkok' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'BangkokPrivate' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'LopBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'NakhonPathom' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Nonthaburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutSakhon' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Chachoengsao' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Rayong' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutPrakan' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Saraburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'PrachinBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'KamphaengPhet' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Ayutthaya' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ต้องการเลือกลำดับที่ 3</label>
                                                <div class="col-md-9">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <select
                                                                // value={employeeData.selectedHospSelect3} onChange={(e) => handleChange(e, "selectedHospSelect3")} // Pass the field name as an argument
                                                                value={employeeData.selectedHospSelect3 || ''}
                                                                onChange={(e) => {
                                                                    handleChange(e, 'selectedHospSelect3');
                                                                    handleSelectLocation(e);
                                                                }} class="form-control"
                                                            >
                                                                <option value="">ไม่ระบุ</option>
                                                                <option value="Bangkok">กรุงเทพ</option>
                                                                <option value="BangkokPrivate">เอกชนกรุงเทพ</option>
                                                                <option value="LopBuri">ลพบุรี</option>
                                                                <option value="NakhonPathom">นครปฐม</option>
                                                                <option value="Nonthaburi">นนทบุรี</option>
                                                                <option value="SamutSakhon">สมุทรสาคร</option>
                                                                <option value="Chachoengsao">ฉะเชิงเทรา</option>
                                                                <option value="Rayong">ระยอง</option>
                                                                <option value="SamutPrakan">สมุทรปราการ</option>
                                                                <option value="Saraburi">สระบุรี</option>
                                                                <option value="PrachinBuri">ปราจีนบุรี</option>
                                                                <option value="KamphaengPhet">กำแพงเพชร</option>
                                                                <option value="Ayutthaya">อยุธยา</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <input
                                                                type="text" class="form-control"
                                                                value={employeeData.selectedHosp3}
                                                                onInput={handleselectedHosp3Change}
                                                                onChange={(e) => handleChange(e, 'selectedHosp3')}
                                                                list="hospitalList"
                                                            />
                                                        </div>
                                                        {selectedLocation === 'Bangkok' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'BangkokPrivate' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'LopBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'NakhonPathom' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Nonthaburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutSakhon' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Chachoengsao' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Rayong' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'SamutPrakan' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Saraburi' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'PrachinBuri' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'KamphaengPhet' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                        {selectedLocation === 'Ayutthaya' && (
                                                            <datalist id="hospitalList">
                                                                {filteredHospitals.map((hospital, index) => (
                                                                    <option key={index} value={hospital} />
                                                                ))}
                                                            </datalist>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>
                                {/* <h2 class="title">เฉพาะกรณีพนักงานและบริษัทสมทบอัตราต่างกัน</h2>
                                <div class="form-group row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">อัตราพนักงานหักเข้ากองทุนประกันสังคม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" value='5' />
                                                </div>
                                                <label class="col-form-label">%</label>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">อัตราบริษัทสมทบกองทุนประกันสังคม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" />
                                                </div>
                                                <label class="col-form-label">%</label>
                                            </div>
                                        </section>
                                    </div>
                                </div> */}
                                <h2 class="title">เฉพาะกรณีไม่ได้เป็นพนักงานตั้งแต่ต้นปี</h2>
                                <div class="form-group row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ยอดเงินประกันสังคมถูกหักก่อนเป็นพนักงาน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" value={beforebecomeEmployee} onChange={(e) => setBeforebecomeEmployee(e.target.value)} />
                                                </div>
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>
                                <h2 class="title">เฉพาะกรณีที่ไม่ได้ใช้โปรแกรมคำนวณเงินเดือนตั้งแต่ต้นปี</h2>
                                <div class="form-group row">
                                    <div class="col-md-9">
                                        <section class="Frame">
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ค่าจ้างก่อนใช้โปรแกรม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" value={wagesbeforeusingProgram} onChange={(e) => setWagesafterusingProgram(e.target.value)} />
                                                </div>
                                                <label class="col-form-label">%</label>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ยอดเงินประกันสังคมถูกหักก่อนใช้โปรแกรม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" value={wagesafterusingProgram} onChange={(e) => setWagesafterusingProgram(e.target.value)} />
                                                </div>
                                                <label class="col-form-label">%</label>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-3 col-form-label">ยอดเงินประกันสังคมบริษัทสมทบก่อนใช้โปรแกรม</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="" value={companybeforeusingProgram} onChange={(e) => setCompanybeforeusingProgram(e.target.value)} />
                                                </div>
                                                <label class="col-form-label">%</label>
                                            </div>
                                        </section>
                                        {/* <!--Frame--> */}
                                    </div>
                                </div>
                                <div class="line_btn">
                                    <button type="submit" class="btn b_save" onClick={updateEmployee}><i class="nav-icon fas fa-save" onClick={() => setButtonValue('save')}></i> &nbsp;บันทึก</button>
                                    <button type="reset" class="btn clean"><i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก</button>
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </body>
    )


}

export default SocialSecurity