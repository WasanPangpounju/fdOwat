import endpoint from "../../config";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "../editwindowcss.css";

function BasicSetting() {
  const [settings, setSettings] = useState([]);
  const [editSetting, setEditSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      await setLoading(true);
      const response = await axios.get(endpoint + "/basicsetting");
      if (response.status === 200) {
        const allData = response.data;
        let data = null;

        if (Array.isArray(allData) && allData.length > 0) {
          data = allData[allData.length - 1];
        }

        setSettings(data);

        // Update individual states
        setMaxSalary(data?.social?.[0]?.maxSalary || "");
        setMaxSocial(data?.social?.[0]?.maxSocial || "");
        setSocialPercent(data?.social?.[0]?.socialPercent || "");
        setComSocial(data?.social?.[0]?.comSocial || "");
        setComSocialPercent(data?.social?.[0]?.comSocialPercent || "");

        setSalaryStandard(data?.salary?.[0]?.salaryStandard || "");

        setSickLeave(data?.leave?.[0]?.sickLeave || "");
        setPersonalLeave(data?.leave?.[0]?.personalLeave || "");
        setVacationLeave(data?.leave?.[0]?.vacationLeave || "");

        // Payment period
        if (data?.paymentPeriod?.[0]) {
          setPaymentPeriod({
            jan: data.paymentPeriod[0].jan || "",
            feb: data.paymentPeriod[0].feb || "",
            mar: data.paymentPeriod[0].mar || "",
            apr: data.paymentPeriod[0].apr || "",
            may: data.paymentPeriod[0].may || "",
            jun: data.paymentPeriod[0].jun || "",
            jul: data.paymentPeriod[0].jul || "",
            aug: data.paymentPeriod[0].aug || "",
            sep: data.paymentPeriod[0].sep || "",
            oct: data.paymentPeriod[0].oct || "",
            nov: data.paymentPeriod[0].nov || "",
            dec: data.paymentPeriod[0].dec || "",
          });
        }

        // NEW: Payment codes - รวมรหัส hardcode จาก SalaryAllResult
        if (data?.paymentCodes?.[0]) {
          setPaymentCodes(data.paymentCodes[0]);
        }

        // Hospitals
        if (data?.hospitals?.[0]) {
          setSelectedLocalHospital(data.hospitals[0].province || "");
          setTmpLocalHospitalList(data.hospitals[0].hospitals || []);
        }
      }
      await setLoading(false);
    } catch (err) {
      await setError(err.message);
      await setLoading(false);
    }
  };

  // Social Insurance
  const [maxSalary, setMaxSalary] = useState("");
  const [maxSocial, setMaxSocial] = useState("");
  const [socialPercent, setSocialPercent] = useState("");
  const [comSocial, setComSocial] = useState("");
  const [comSocialPercent, setComSocialPercent] = useState("");

  // Salary
  const [salaryStandard, setSalaryStandard] = useState("");

  // Leave
  const [sickLeave, setSickLeave] = useState("");
  const [personalLeave, setPersonalLeave] = useState("");
  const [vacationLeave, setVacationLeave] = useState("");

  // Payment Period
  const [paymentPeriod, setPaymentPeriod] = useState({
    jan: "",
    feb: "",
    mar: "",
    apr: "",
    may: "",
    jun: "",
    jul: "",
    aug: "",
    sep: "",
    oct: "",
    nov: "",
    dec: "",
  });

  // Hospital Selection
  const [selectedLocalHospital, setSelectedLocalHospital] = useState("");
  const [tmpLocalHospitalList, setTmpLocalHospitalList] = useState([]);
  const [tmpHospital, setTmpHospital] = useState([]);
  const [newHospital, setNewHospital] = useState("");

  // NEW: Payment Code Settings
  const [paymentCodes, setPaymentCodes] = useState({
      // ค่าขนส่ง
    transportAllowanceIds: [],
    // ปรับปรุงค่าจ้าง
    wageReviseIdsPlus: [],
    wageReviseIdsMinus: [],
    // ชดเชยวันลา
    leaveInLieuIdsPlus: [],
    leaveInLieuIdsMinus: [],
    // หักอื่นๆ ก่อนภาษี
    otherDeductIds: [],
    // บวกอื่นๆ ก่อนภาษี
    plusOtherIds: [],
    // ตำแหน่ง/ค่าตำแหน่ง
    positionAndTransportationWithSocialIdsPlus: [],
    positionAndTransportationWithSocialIdsMinus: [],
    // ค่าล่วงเวลา
    overtimeIdsPlus: [],
    // สวัสดิการพิเศษ
    welfareIdsPlus: [],
    // นักขัติ/วันหยุด
    publicHolidayCashIds: [],
    // บวกอื่นๆ หลังภาษี
    additionalAfterTaxIds: [],
    // หักอื่นๆ หลังภาษี
    deductionAfterTaxIds: [],
    // หักภาษี
    taxIdsDeduct: [],
    // หัก ปกส
    socialSecurityIdsDeduct: [],
    // รหัสเดี่ยว
    diligenceAllowanceIds: [],           // เบี้ยขยัน
    advancePaymentIds: [],               // เงินล่วงหน้า
    // สุทธิ
    totalIds: []
  });

  const [newPaymentCode, setNewPaymentCode] = useState({
    type: "wageReviseIdsPlus",
    code: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [paymentCodesBackup, setPaymentCodesBackup] = useState({});

  // NEW: Master Employee (0001) Data - Copy from AddEditSalaryEmployee
  const [employeeId, setEmployeeId] = useState('0001');
  const [name, setName] = useState('');
  const [dataResult, setDataResult] = useState([]);
  
  // Add Salary States
  const [addSalaryId, setAddSalaryId] = useState('');
  const [addSalaryName, setAddSalaryName] = useState('');
  const [roundOfSalary, setRoundOfSalary] = useState('');
  const [staffType, setStaffType] = useState('');
  const [socialSecurityCheck, setSocialSecurityCheck] = useState(null);
  const [addSalary, setAddSalary] = useState('');
  const [message, setMessage] = useState('');

  // Deduct Salary States
  const [minusId, setMinusId] = useState('');
  const [misnusName, setMisnusName] = useState('');
  const [minusSalary, setMinusSalary] = useState('');
  const [payType, setPayType] = useState('');
  const [installment, setInstallment] = useState('1');
  const [minusStaffType, setMinusStaffType] = useState('');
  const [minusSocialSecurityCheck, setMinusSocialSecurityCheck] = useState(null);

  // Row Data Lists
  const initialRowData2 = {
    id: '',
    name: '',
    SpSalary: '',
    roundOfSalary: '',
    StaffType: '',
    message: '',
    socialSecurityCheck: null,
  };

  const initialRowData = {
    id: '',
    name: '',
    amount: '',
    payType: '',
    installment: '',
    message: '',
    socialSecurityCheck: null,
  };

  const [rowDataList2, setRowDataList2] = useState([]);
  const [rowDataList, setRowDataList] = useState([]);
  const [searchAddSalaryList, setSearchAddSalaryList] = useState([]);
  const [searchDeductSalaryList, setSearchDeductSalaryList] = useState([]);

  // Editing States
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingRowIndex2, setEditingRowIndex2] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [editingData2, setEditingData2] = useState(null);

  // Hospital Data
  const localHospitalList = [
    { value: "Bangkok", label: "กรุงเทพ" },
    { value: "BangkokPrivate", label: "เอกชนกรุงเทพ" },
    { value: "LopBuri", label: "ลพบุรี" },
    { value: "NakhonPathom", label: "นครปฐม" },
    { value: "Nonthaburi", label: "นนทบุรี" },
    { value: "SamutSakhon", label: "สมุทรสาคร" },
    { value: "Chachoengsao", label: "ฉะเชิงเทรา" },
    { value: "Rayong", label: "ระยอง" },
    { value: "SamutPrakan", label: "สมุทรปราการ" },
    { value: "Saraburi", label: "สระบุรี" },
    { value: "PrachinBuri", label: "ปราจีนบุรี" },
    { value: "KamphaengPhet", label: "กำแพงเพชร" },
    { value: "Ayutthaya", label: "อยุธยา" },
  ];
 
  const hospital = {
    Bangkok: [
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
      "รพ.ลาดกระบัง กรุงเทพมหานคร",
    ],
    BangkokPrivate: [
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
      "รพ.ไอเอ็มเอช ธนบุรี โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    LopBuri: ["รพ.บ้านหมี่(สธ)", "รพ.พระนารายณ์มหาราช", "รพ.อานันทมหิดล"],
    NakhonPathom: [
      "รพ.จันทรุเบกษา",
      "รพ.นครปฐม(สธ)",
      "รพ.เมตตาประชารักษ์ วัดไร่ขิง(สธ)",
      "รพ.เทพากรโรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    Nonthaburi: [
      "รพ.พระนั่งเกล้า(สธ)",
      "รพ.ศูนย์การแพทย์ปัญญานันทภิกขุ ชลประทาน",
      "รพ.สถาบันบำราศนราดูร",
      "รพ.กรุงไทยโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่เกษมราษฎร์ รัตนาธิเบศร์",
      "รพ.วิภารามปากเกร็ด โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    SamutSakhon: [
      "รพ.กระทุ่มแบน(สธ)",
      "รพ.บ้านแพ้ว(สธ)",
      "รพ.สมุทรสาคร(สธ)",
      "รพ.มหาชัย 2 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.มหาชัย 3 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.วิภาราม สมุทรสาครโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ อ้อมน้อย",
      "รพ.ทั่วไปขนาดใหญ่วิชัยเวช ฯ สมุทรสาคร",
    ],
    Chachoengsao: [
      "รพ.พุทธโสธร(สธ)",
      "รพ.เกษมราษฎร์ ฉะเชิงเทราโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.จุฬารัตน์ 11 อินเตอร์โรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    Rayong: [
      "รพ.ระยอง(สธ)",
      "รพ.เฉลิมพระเกียรติสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี ระยอง(สธ)",
      "รพ.มงกุฎระยอง",
      "รพ.จุฬารัตน์ระยองโรงพยาบาลทั่วไปขนาดกลาง",
    ],
    SamutPrakan: [
      "รพ.พ.บางบ่อ(สธ)",
      "รพ.บางพลี(สธ)",
      "รพ..สมุทรปราการ(สธ)",
      "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 3 อินเตอร์",
      "รพ.ทั่วไปขนาดใหญ่จุฬารัตน์ 9 แอร์พอร์ต",
      "รพ.ทั่วไปขนาดใหญ่โรงพยาบาลเซ็นทรัล ปาร์ค",
      "รพ.ทั่วไปขนาดใหญ่บางนา 2",
      "รพ.ทั่วไปขนาดใหญ่บางนา 5",
      "รพ..บางปะกอก 3 โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่เปาโล สมุทรปราการ",
      "รพ..เมืองสมุทรปากน าโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ..เมืองสมุทรปู่เจ้าฯ โรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ทั่วไปขนาดใหญ่รวมชัยประชารักษ์",
      "รพ.ทั่วไปขนาดใหญ่ศิครินทร์ สมุทรปราการ",
      "รพ.ทั่วไปขนาดใหญ่ส าโรงการแพทย์",
      "รพ.รามาธิบดีจักรีนฤบดินทร์",
      "รพ..เปาโล พระประแดงโรงพยาบาลทั่วไปขนาดกลาง",
    ],
    Saraburi: [
      "รพ.พระพุทธบาท(สธ)",
      "รพ.สระบุรี(สธ)",
      "รพ.เกษมราษฎร์ สระบุรีโรงพยาบาลทั่วไปขนาดใหญ่",
    ],
    PrachinBuri: [
      "รพ.กบินทร์บุรี(สธ)",
      "รพ.เกษมราษฎร์ ปราจีนบุรีโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ค่ายจักรพงษ์",
      "รพ.เจ้าพระยาอภัยภูเบศร(สธ)",
      "รพ.ทั่วไปขนาดกลางจุฬารัตน์ 304 อินเตอร์",
    ],
    KamphaengPhet: ["รพ.กำแพงเพชร(สธ)"],
    Ayutthaya: [
      "รพ.พระนครศรีอยุธยา(สธ)",
      "รพ.เสนา(สธ)",
      "รพ.การุญเวช อยุธยาโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ราชธานีโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.ราชธานี โรจนะโรงพยาบาลทั่วไปขนาดใหญ่",
      "รพ.เอเชียอินเตอร์เนชั่นแนล โรงพยาบาลทั่วไปขนาดกลาง",
    ],
  };

  // NEW: Payment Code Types
  const paymentCodeTypes = {
    wageReviseIdsPlus: "ปรับปรุงค่าจ้าง",
    leaveInLieuIdsPlus: "ชดเชยวันลา",
    overtimeIdsPlus: "ค่าล่วงเวลา",
    welfareIdsPlus: "สวัสดิการพิเศษ",
    positionAndTransportationWithSocialIdsPlus: "ตำแหน่ง",
    diligenceAllowanceIds: "เบี้ยขยัน",
    publicHolidayCashIds: "นักขัติ/วันหยุด",
    plusOtherIds: "บวกอื่นๆ",
    otherDeductIds: "หักอื่นๆ",
    taxIdsDeduct: "หักภาษี",
    socialSecurityIdsDeduct: "หัก ปกส",
    additionalAfterTaxIds: "บวกอื่นๆ",
    deductionAfterTaxIds: "หักอื่นๆ",
    advancePaymentIds: "เบิกล่วงหน้า",
    totalIds: "สุทธิ",
  };

  useEffect(() => {
    document.title = "ตั้งค่าระบบ";
    fetchSettings();
    fetchMasterEmployeeData();
  }, []);

  // Fetch Master Employee (0001) data
  const fetchMasterEmployeeData = async () => {
    try {
      const data = {
        employeeId: '0001',
        name: '',
        idCard: '',
        workPlace: '',
      };
      const response = await axios.post(endpoint + '/employee/search', data);
      if (response.data && response.data.employees && response.data.employees.length > 0) {
        const employee = response.data.employees[0];
        setName(employee.name);
        setDataResult(employee);
        await setSearchAddSalaryList(employee.addSalary || []);
        await setSearchDeductSalaryList(employee.deductSalary || []);

        // Process addSalary
        const newDataList = [];
        if (employee.addSalary) {
          employee.addSalary.forEach(item => {
            let newRowData = {
              id: item.id,
              name: item.name,
              SpSalary: item.SpSalary,
              roundOfSalary: item.roundOfSalary,
              StaffType: item.StaffType,
              nameType: item.nameType,
              message: item.message,
              socialSecurityCheck: item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด" 
                ? true 
                : item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด"
                ? false
                : null
            };
            newDataList.unshift(newRowData);
          });
        }
        setRowDataList2(newDataList);

        // Process deductSalary
        const newDataList1 = [];
        if (employee.deductSalary) {
          employee.deductSalary.forEach(item => {
            let newRowData1 = {
              id: item.id,
              name: item.name,
              amount: item.amount,
              payType: item.payType,
              installment: item.installment,
              nameType: item.nameType,
              message: item.message,
              socialSecurityCheck: item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด"
                ? true
                : item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด"
                ? false
                : null
            };
            newDataList1.unshift(newRowData1);
          });
        }
        setRowDataList(newDataList1);
      }
    } catch (error) {
      console.error('Error fetching master employee data:', error);
    }
  };

  // Functions from AddEditSalaryEmployee
  const addRow = (newRowData) => {
    const idExists = rowDataList2.some((row) => row.id === newRowData.id);
    if (!idExists) {
      const newDataList = [newRowData, ...rowDataList2];
      setRowDataList2(newDataList);
      alert('เพิ่มรายการเงินเพิ่มสำเร็จ');
      // ล้างข้อมูลฟอร์ม
      setAddSalaryId('');
      setAddSalaryName('');
      setAddSalary('');
      setRoundOfSalary('');
      setStaffType('');
      setMessage('');
      setSocialSecurityCheck(null);
    } else {
      alert(`มีรหัส ${newRowData.id} ใช้งานแล้ว`);
    }
  };

  const addRow2 = (newRowData2) => {
    const idExists2 = rowDataList.some((row) => row.id === newRowData2.id);
    if (!idExists2) {
      const newDataList = [newRowData2, ...rowDataList];
      setRowDataList(newDataList);
      alert('เพิ่มรายการเงินหักสำเร็จ');
      // ล้างข้อมูลฟอร์ม
      setMinusId('');
      setMisnusName('');
      setMinusSalary('');
      setPayType('');
      setInstallment('');
      setMinusStaffType('');
      setMinusSocialSecurityCheck(null);
    } else {
      alert(`มีรหัส ${newRowData2.id} ใช้งานแล้ว`);
    }
  };

  const handleEditRow = (index) => {
    setEditingRowIndex2(index);
    setEditingData2({...rowDataList2[index]});
  };

  const handleSaveEdit2 = (index) => {
    const newDataList = [...rowDataList2];
    newDataList[index] = editingData2;
    setRowDataList2(newDataList);
    setEditingRowIndex2(null);
    setEditingData2(null);
    alert('แก้ไขรายการเงินเพิ่มสำเร็จ');
  };

  const handleCancelEdit2 = () => {
    setEditingRowIndex2(null);
    setEditingData2(null);
  };

  const handleDeleteRow = (index) => {
    const item = rowDataList2[index];
    if (window.confirm(`คุณต้องการลบรายการเงินเพิ่มนี้หรือไม่?\n\nรหัส: ${item.id}\nชื่อ: ${item.name}\nจำนวนเงิน: ${Number(item.SpSalary).toLocaleString()} บาท`)) {
      const newDataList = rowDataList2.filter((_, i) => i !== index);
      setRowDataList2(newDataList);
      alert('ลบรายการเงินเพิ่มสำเร็จ');
    }
  };

  const handleDeleteRow2 = (index) => {
    const item = rowDataList[index];
    if (window.confirm(`คุณต้องการลบรายการเงินหักนี้หรือไม่?\n\nรหัส: ${item.id}\nชื่อ: ${item.name}\nจำนวนเงิน: ${Number(item.amount).toLocaleString()} บาท`)) {
      const newDataList = rowDataList.filter((_, i) => i !== index);
      setRowDataList(newDataList);
      alert('ลบรายการเงินหักสำเร็จ');
    }
  };

  const handleEditRow2 = (index) => {
    setEditingRowIndex(index);
    setEditingData({...rowDataList[index]});
  };

  const handleSaveEdit = (index) => {
    const newDataList = [...rowDataList];
    newDataList[index] = editingData;
    setRowDataList(newDataList);
    setEditingRowIndex(null);
    setEditingData(null);
    alert('แก้ไขรายการเงินหักสำเร็จ');
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditingData(null);
  };

  // Save Master Employee Data
  const handleSaveMasterEmployee = async (event) => {
    event.preventDefault();
    
    const updatedEmployee = {
      ...dataResult,
      addSalary: rowDataList2,
      deductSalary: rowDataList,
    };

    try {
      const response = await axios.put(endpoint + '/employee/update', updatedEmployee);
      if (response.status === 200) {
        console.log('บันทึกข้อมูลสำเร็จ!');
        fetchMasterEmployeeData();
      }
    } catch (error) {
      console.error('Error saving employee data:', error);
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // Auto-fill name when ID changes
  React.useEffect(() => {
    const findObjectById = (id) => {
      return searchAddSalaryList.find(item => item.id === id);
    };
    const foundObject = findObjectById(addSalaryId);
    if (foundObject) {
      setAddSalaryName(foundObject.name);
    }
  }, [addSalaryId, searchAddSalaryList]);

  React.useEffect(() => {
    const findObjectById = (id) => {
      let foundItem = searchDeductSalaryList.find(item => item.id === id);
      if (!foundItem) {
        foundItem = rowDataList.find(item => item.id === id);
      }
      return foundItem;
    };
    const foundObject = findObjectById(minusId);
    if (foundObject) {
      setMisnusName(foundObject.name);
    } else if (minusId === '') {
      setMisnusName('');
    }
  }, [minusId, searchDeductSalaryList, rowDataList]);

  const handlePaymentPeriodChange = (month, value) => {
    setPaymentPeriod((prev) => ({
      ...prev,
      [month]: value,
    }));
  };

  // NEW: Payment Code Functions
  const handleEditMode = () => {
    if (!editMode) {
      // เข้าสู่โหมดแก้ไข - backup ข้อมูลปัจจุบัน
      setPaymentCodesBackup({ ...paymentCodes });
      setEditMode(true);
    } else {
      // ยกเลิกแก้ไข - restore ข้อมูลจาก backup
      setPaymentCodes({ ...paymentCodesBackup });
      setEditMode(false);
    }
  };

  const handleSavePaymentEdit = () => {
    // บันทึกการเปลี่ยนแปลง - ออกจากโหมดแก้ไข
    setEditMode(false);
    setPaymentCodesBackup({});
    // Add save to server logic here if needed
  };

  const handleAddPaymentCode = () => {
    const codeToAdd = newPaymentCode.code.trim();
    if (codeToAdd === "") {
      console.warn("กรุณากรอกรหัส");
      return;
    }
    // Prevent duplicate code in all types
    const allCodes = Object.values(paymentCodes).flat();
    if (allCodes.includes(codeToAdd)) {
      alert("รหัสได้ถูกใช้งานแล้ว กรุณากรอกรหัสใหม่");
      return;
    }
    // Check if the selected type exists in paymentCodes
    if (!Object.prototype.hasOwnProperty.call(paymentCodes, newPaymentCode.type)) {
      alert("ไม่สามารถเพิ่มรหัสในหมวดนี้ได้ กรุณาเลือกหมวดที่ถูกต้อง");
      return;
    }
    setPaymentCodes((prev) => ({
      ...prev,
      [newPaymentCode.type]: [
        ...prev[newPaymentCode.type],
        codeToAdd,
      ],
    }));
    setNewPaymentCode((prev) => ({ ...prev, code: "" }));
  };

  const handleRemovePaymentCode = (type, index) => {
    setPaymentCodes((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handlePaymentCodeTypeChange = (event) => {
    setNewPaymentCode((prev) => ({
      ...prev,
      type: event.target.value,
    }));
  };

  const handlePaymentCodeChange = (event) => {
    setNewPaymentCode((prev) => ({
      ...prev,
      code: event.target.value,
    }));
  };

  const handleSelectionLocalHospotalChange = (event) => {
    setSelectedLocalHospital(event.target.value);
    setTmpLocalHospitalList(hospital[event.target.value] || []);
  };

  const handleSelectionHospotalChange = (event) => {
    setTmpHospital(event.target.value);
  };

  // Hospital Management Functions
  const handleAddHospital = () => {
    if (newHospital.trim() === "") {
      alert("กรุณากรอกชื่อโรงพยาบาล");
      return;
    }
    setTmpLocalHospitalList((prev) => [...prev, newHospital.trim()]);
    setNewHospital("");
  };

  const handleDeleteHospital = (index) => {
    setTmpLocalHospitalList((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleManageSetting(event) {
    event.preventDefault();

    const settingData = {
      social: [
        {
          maxSalary,
          maxSocial,
          socialPercent,
          comSocial,
          comSocialPercent,
        },
      ],
      salary: [
        {
          salaryStandard,
        },
      ],
      leave: [
        {
          sickLeave,
          personalLeave,
          vacationLeave,
        },
      ],
      paymentPeriod: [paymentPeriod],
      // NEW: Add payment codes to data
      paymentCodes: [paymentCodes],
      hospitals: [
        {
          province: selectedLocalHospital,
          hospitals: tmpLocalHospitalList,
        },
      ],
      year: new Date().getFullYear().toString(),
      month: new Date().toLocaleString("default", { month: "long" }),
      createDate: new Date().toISOString(),
      createBy: "Admin",
      status: "active",
    };

    try {
      // Save basic settings
      const response = await axios.post(
        endpoint + "/basicsetting",
        settingData
      );
      
      if (response.status === 201) {
        // Save master employee data only if dataResult exists with _id
        if (dataResult && dataResult._id && dataResult.employeeId) {
          try {
            // กรองเฉพาะรายการที่มีข้อมูล
            const validAddSalary = rowDataList2.filter(item => item.id && item.name);
            const validDeductSalary = rowDataList.filter(item => item.id && item.name);
            
            const updatedEmployee = {
              ...dataResult,
              addSalary: validAddSalary,
              deductSalary: validDeductSalary,
              newAddSalary: validAddSalary,
              newDeductSalary: validDeductSalary,
            };
            
            // ใช้ endpoint ที่ถูกต้อง: /employee/update/:id
            const employeeResponse = await axios.put(
              endpoint + '/employee/update/' + dataResult._id,
              updatedEmployee
            );
            
            if (employeeResponse.status === 200) {
              alert("บันทึกข้อมูลสำเร็จ!");
            }
          } catch (empError) {
            console.error("Error saving employee data:", empError);
            const empErrorMsg = empError.response?.data?.message || empError.message;
            alert(`บันทึกการตั้งค่าสำเร็จ แต่ไม่สามารถบันทึกข้อมูลเงินเพิ่ม เงินหักได้\n\nError: ${empErrorMsg}`);
          }
        } else {
          alert("บันทึกข้อมูลสำเร็จ!");
        }
        
        fetchSettings();
        if (dataResult && dataResult._id && dataResult.employeeId) {
          fetchMasterEmployeeData();
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMsg = error.response?.data?.message || error.message || "ไม่สามารถบันทึกข้อมูลได้";
      alert(`ไม่สามารถบันทึกข้อมูลได้\n\nError: ${errorMsg}\n\nกรุณาลองใหม่อีกครั้ง`);
    }
  }

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <a href="#">หน้าหลัก</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#"> ระบบจัดการพนักงาน</a>
            </li>
            <li className="breadcrumb-item ">ข้อมูลเงินเดือน</li>
          </ol>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="far fa-arrow-alt-circle-right"></i> ตั้งค่าระบบ
                </h1>
              </div>
              <div className="row mb-8 justify-content-center align-items-center">
                <div className="col-md-6 text-center">
                  {loading && <p>Loading...</p>}
                  {error && <p>Error: {error}</p>}
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <form onSubmit={handleManageSetting}>
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="title">เงินเพิ่ม</h2>
                            <section className="Frame">

                                <div className="row">
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <label>รหัส</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>ชื่อ</label>
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <label>จำนวนเงิน</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>รายวัน/รายเดือน</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>ประกันสังคม</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>ประเภทพนักงาน</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>หมายเหตุ</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="addSalaryId" placeholder="รหัส" value={addSalaryId} onChange={(e) => setAddSalaryId(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="addSalaryName" placeholder="ชื่อ" value={addSalaryName} onChange={(e) => setAddSalaryName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-md-1">
                                        <input type="text" className="form-control" id="addSalary" placeholder="จำนวนเงิน" value={addSalary} onChange={(e) => setAddSalary(e.target.value)}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                                const parts = e.target.value.split(".");
                                                if (parts.length > 2) {
                                                    e.target.value = `${parts[0]}.${parts[1]}`;
                                                }
                                            }} />
                                    </div>
                                    <div className="col-md-2">
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
                                            <option value="หัวหน้าควบคุมงาน">หัวหน้าควบคุมงาน</option>
                                            <option value="ผู้ช่วยผู้ควบคุมงาน">ผู้ช่วยผู้ควบคุมงาน</option>
                                            <option value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</option>
                                            <option value="พนักงานทำความสะอาดรอบนอก">พนักงานทำความสะอาดรอบนอก</option>
                                            <option value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</option>
                                            <option value="พนักงานคนสวน">พนักงานคนสวน</option>
                                            <option value="พนักงานแรงงานชาย">พนักงานแรงงานชาย</option>
                                            <option value="กรรมการผู้จัดการ">กรรมการผู้จัดการ</option>
                                            <option value="ผู้จัดการทั่วไป">ผู้จัดการทั่วไป</option>
                                            <option value="ผู้จัดการฝ่ายการตลาด">ผู้จัดการฝ่ายการตลาด</option>
                                            <option value="ผู้จัดการฝ่ายบัญชี/การเงิน">ผู้จัดการฝ่ายบัญชี/การเงิน</option>
                                            <option value="ผู้จัดการฝ่ายบุคคล">ผู้จัดการฝ่ายบุคคล</option>
                                            <option value="เจ้าหน้าที่ฝ่ายบัญชี/การเงิน">เจ้าหน้าที่ฝ่ายบัญชี/การเงิน</option>
                                            <option value="เจ้าหน้าที่ฝ่ายบุคคล">เจ้าหน้าที่ฝ่ายบุคคล</option>
                                            <option value="เจ้าหน้าที่ฝ่ายจัดซื้อ">เจ้าหน้าที่ฝ่ายจัดซื้อ</option>
                                            <option value="เจ้าหน้าที่ธุรการฝ่ายขาย">เจ้าหน้าที่ธุรการฝ่ายขาย</option>
                                            <option value="เจ้าหน้าที่ฝ่ายการตลาด">เจ้าหน้าที่ฝ่ายการตลาด</option>
                                            <option value="เจ้าหน้าที่ฝ่ายปฏิบัติการ">เจ้าหน้าที่ฝ่ายปฏิบัติการ</option>
                                            <option value="เจ้าหน้าที่ฝ่ายปฏิบัติการ(สายตรวจ)">เจ้าหน้าที่ฝ่ายปฏิบัติการ(สายตรวจ)</option>
                                            <option value="เจ้าหน้าที่ฝ่ายยานพาหนะ">เจ้าหน้าที่ฝ่ายยานพาหนะ</option>
                                            <option value="เจ้าหน้าที่ฝ่ายไอที">เจ้าหน้าที่ฝ่ายไอที</option>
                                            <option value="เจ้าหน้าที่ฝ่ายสโตร์">เจ้าหน้าที่ฝ่ายสโตร์</option>
                                            <option value="เจ้าหน้าที่ความปลอดภัยในการทำงาน(จป)">เจ้าหน้าที่ความปลอดภัยในการทำงาน(จป)</option>
                                            <option value="ธุรการทั่วไป">ธุรการทั่วไป</option>
                                            <option value="หัวหน้าฝ่ายปฏิบัติการ">หัวหน้าฝ่ายปฏิบัติการ</option>
                                            <option value="หัวหน้าฝ่ายบัญชี/การเงิน">หัวหน้าฝ่ายบัญชี/การเงิน</option>
                                            <option value="หัวหน้าฝ่ายสโตร์">หัวหน้าฝ่ายสโตร์</option>
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <input type="text" className="form-control" id="message" placeholder="หมายเหตุ" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row" style={{ marginTop: '-5px' }}>
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
                                                            <th className="text-center" width="15%">
                                                                <i className="fas fa-shield-alt mr-1"></i>ประกันสังคม
                                                            </th>
                                                            <th className="text-center" width="15%">
                                                                <i className="fas fa-users mr-1"></i>ประเภทพนักงาน
                                                            </th>
                                                            <th className="text-center" width="10%">
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
                                                                    {editingRowIndex2 === index ? (
                                                                        <>
                                                                            <td className="text-center p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm text-center"
                                                                                    value={editingData2?.id || ''}
                                                                                    readOnly
                                                                                    style={{ backgroundColor: '#f0f0f0' }}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.name || ''}
                                                                                    onChange={(e) => setEditingData2({...editingData2, name: e.target.value})}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.SpSalary || ''}
                                                                                    onChange={(e) => setEditingData2({...editingData2, SpSalary: e.target.value})}
                                                                                    onInput={(e) => {
                                                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <select
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.roundOfSalary || ''}
                                                                                    onChange={(e) => setEditingData2({...editingData2, roundOfSalary: e.target.value})}
                                                                                >
                                                                                    <option value="">เลือก</option>
                                                                                    <option value="daily">รายวัน</option>
                                                                                    <option value="monthly">รายเดือน</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <select
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.socialSecurityCheck === true ? "yes" : editingData2?.socialSecurityCheck === false ? "no" : ""}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value === "yes" ? true : e.target.value === "no" ? false : null;
                                                                                        setEditingData2({...editingData2, socialSecurityCheck: value});
                                                                                    }}
                                                                                >
                                                                                    <option value="">เลือก</option>
                                                                                    <option value="yes">คิดประกันสังคม</option>
                                                                                    <option value="no">ไม่คิดประกันสังคม</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <select
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.StaffType || ''}
                                                                                    onChange={(e) => setEditingData2({...editingData2, StaffType: e.target.value})}
                                                                                >
                                                                                    <option value="">เลือก</option>
                                                                                    <option value="all">ทั้งหมด</option>
                                                                                    <option value="header">หัวหน้างาน</option>
                                                                                    <option value="หัวหน้าควบคุมงาน">หัวหน้าควบคุมงาน</option>
                                                                                    <option value="พนักงานทำความสะอาด">พนักงานทำความสะอาด</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData2?.message || ''}
                                                                                    onChange={(e) => setEditingData2({...editingData2, message: e.target.value})}
                                                                                    placeholder="หมายเหตุ"
                                                                                />
                                                                            </td>
                                                                            <td className="text-center p-2">
                                                                                <div className="btn-group-vertical btn-group-sm" role="group">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-success btn-sm mb-1"
                                                                                        onClick={() => handleSaveEdit2(index)}
                                                                                        title="บันทึก"
                                                                                    >
                                                                                        <i className="fas fa-check"></i>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-secondary btn-sm"
                                                                                        onClick={handleCancelEdit2}
                                                                                        title="ยกเลิก"
                                                                                    >
                                                                                        <i className="fas fa-times"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </>
                                                                    ) : (
                                                                        <>
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
                                                                    <td className="text-center p-3">
                                                                        {(item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด") && (
                                                                            <span className="badge badge-success">คิดประกันสังคม</span>
                                                                        )}
                                                                        {(item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด") && (
                                                                            <span className="badge badge-danger">ไม่คิดประกันสังคม</span>
                                                                        )}
                                                                        {(item.socialSecurityCheck === null || item.socialSecurityCheck === undefined || item.socialSecurityCheck === "") && (
                                                                            <span className="badge badge-secondary">ไม่ระบุ</span>
                                                                        )}
                                                                    </td> 
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
                                                                        <div className="btn-group" role="group">
                                                                            <button 
                                                                                type="button"
                                                                                className="btn btn-info btn-sm"
                                                                                onClick={() => handleEditRow(index)}
                                                                                title="แก้ไขรายการ"
                                                                            >
                                                                                <i className="fas fa-edit"></i>
                                                                            </button>
                                                                            <button 
                                                                                type="button"
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() => handleDeleteRow(index)}
                                                                                title="ลบรายการ"
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                    </>
                                                                    )}
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

                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="title">เงินหัก</h2>
                            <section className="Frame">
                                <div className="row">
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <label>รหัส</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>ชื่อ</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>จำนวนเงิน</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>การหักเงิน</label>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label>ประกันสังคม</label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label>หมายเหตุ</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="addSalaryId" placeholder="รหัส" value={minusId} onChange={(e) => setMinusId(e.target.value)}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/\D/g, "");
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <input type="text" className="form-control" id="addSalaryName" placeholder="ชื่อ" value={misnusName} onChange={(e) => setMisnusName(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <input type="text" className="form-control" id="addSalaryName" placeholder="จำนวนเงิน" value={minusSalary} onChange={(e) => setMinusSalary(e.target.value)}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                                const parts = e.target.value.split(".");
                                                if (parts.length > 2) {
                                                    e.target.value = `${parts[0]}.${parts[1]}`;
                                                }
                                            }} />
                                    </div>

                                    <div className="col-md-2">
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
                                    <div className="col-md-2">
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
                                    </div>
                                    <div className="col-md-2">
                                        {payType === "installment" ? (
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
                                    </div>

                                    <div className="col-md-2">
                                        <input type="text" className="form-control" id="minusStaffType" placeholder="หมายเหตุ" value={minusStaffType} onChange={(e) => setMinusStaffType(e.target.value)} />
                                    </div>
                                </div>

                                <div className="row" style={{ marginTop: '-10px' }}>
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
                                                        message: minusStaffType || '',
                                                        socialSecurityCheck: minusSocialSecurityCheck,
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
                                                            <th className="text-center" width="20%">
                                                                <i className="fas fa-shield-alt mr-1"></i>ประกันสังคม
                                                            </th>
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
                                                                    {editingRowIndex === index ? (
                                                                        <>
                                                                            <td className="text-center p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm text-center"
                                                                                    value={editingData?.id || ''}
                                                                                    readOnly
                                                                                    style={{ backgroundColor: '#f0f0f0' }}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData?.name || ''}
                                                                                    onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData?.amount || ''}
                                                                                    onChange={(e) => setEditingData({...editingData, amount: e.target.value})}
                                                                                    onInput={(e) => {
                                                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <select
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData?.payType || ''}
                                                                                    onChange={(e) => setEditingData({...editingData, payType: e.target.value})}
                                                                                >
                                                                                    <option value="">เลือก</option>
                                                                                    <option value="immedate">ทั้งหมด</option>
                                                                                    <option value="installment">ผ่อนจ่าย</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <select
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData?.socialSecurityCheck || ''}
                                                                                    onChange={(e) => setEditingData({...editingData, socialSecurityCheck: e.target.value})}
                                                                                >
                                                                                    <option value="">ไม่ระบุ</option>
                                                                                    <option value="yes">คิดประกันสังคม</option>
                                                                                    <option value="no">ไม่คิดประกันสังคม</option>
                                                                                </select>
                                                                            </td>
                                                                            <td className="p-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={editingData?.message || ''}
                                                                                    onChange={(e) => setEditingData({...editingData, message: e.target.value})}
                                                                                    placeholder="หมายเหตุ"
                                                                                />
                                                                            </td>
                                                                            <td className="text-center p-2">
                                                                                <div className="btn-group-vertical btn-group-sm" role="group">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-success btn-sm mb-1"
                                                                                        onClick={() => handleSaveEdit(index)}
                                                                                        title="บันทึก"
                                                                                    >
                                                                                        <i className="fas fa-check"></i>
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-secondary btn-sm"
                                                                                        onClick={handleCancelEdit}
                                                                                        title="ยกเลิก"
                                                                                    >
                                                                                        <i className="fas fa-times"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </>
                                                                    ) : (
                                                                        <>
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
                                                                    <td className="text-center p-3">
                                                                        {(item.socialSecurityCheck === true || item.socialSecurityCheck === "yes" || item.socialSecurityCheck === "คิด") && (
                                                                            <span className="badge badge-success">คิดประกันสังคม</span>
                                                                        )}
                                                                        {(item.socialSecurityCheck === false || item.socialSecurityCheck === "no" || item.socialSecurityCheck === "ไม่คิด") && (
                                                                            <span className="badge badge-danger">ไม่คิดประกันสังคม</span>
                                                                        )}
                                                                        {(item.socialSecurityCheck === null || item.socialSecurityCheck === undefined || item.socialSecurityCheck === "") && (
                                                                            <span className="badge badge-secondary">ไม่ระบุ</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="text-center p-3">
                                                                        <small className="">
                                                                            {item.message || '-'}
                                                                        </small>
                                                                    </td>
                                                                    <td className="text-center p-2">
                                                                        <div className="btn-group" role="group">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-info btn-sm"
                                                                                onClick={() => handleEditRow2(index)}
                                                                                title="แก้ไขรายการ"
                                                                            >
                                                                                <i className="fas fa-edit"></i>
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() => handleDeleteRow2(index)}
                                                                                title="ลบรายการ"
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                        </>
                                                                    )}
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

                    {/* Existing Social Insurance Section */}
                    <h2 className="title">รายละเอียดประกันสังคม</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              เงินเดือนมากกว่า
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินเดือน"
                                value={maxSalary}
                                onChange={(e) => setMaxSalary(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">
                              หักสูงสุด
                            </label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินหัก"
                                value={maxSocial}
                                onChange={(e) => setMaxSocial(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">฿</label>
                          </div>

                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              เงินเดือนน้อยกว่า
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินเดือน"
                                value={maxSalary}
                                readOnly
                              />
                            </div>
                            <label className="col-md-1 col-form-label">
                              เปอร์เซ็นต์หัก
                            </label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="หัก"
                                value={socialPercent}
                                onChange={(e) =>
                                  setSocialPercent(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-md-1 col-form-label">%</label>
                          </div>
                          <h5>นายจ้าง</h5>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              สมทบประกันสังคมไม่เกิน
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เงินสมทบ"
                                value={comSocial}
                                onChange={(e) => setComSocial(e.target.value)}
                              />
                            </div>
                            <label className="col-md-1 col-form-label">฿</label>
                            <div className="col-md-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="เปอร์เซ็นต์"
                                value={comSocialPercent}
                                onChange={(e) =>
                                  setComSocialPercent(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-md-1 col-form-label">%</label>
                          </div>
                        </section>
                      </div>
                    </div>
                    {/* NEW: Payment Code Settings Section - อยู่ด้านบนของ Payment Period */}
                    <h2 className="title">ตั้งค่ารหัสการจ่ายเงินแต่ละประเภท</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-2 col-form-label">
                              ประเภทรหัส
                            </label>
                          </div>

                          {/* Display Added Payment Codes */}
                          {/* ฟอร์มแถวบน */}
                          <div className="d-flex mb-4" style={{ gap: "16px" }}>
                            <select
                              className="form-control"
                              style={{ maxWidth: "260px" }}
                              value={newPaymentCode.type}
                              onChange={handlePaymentCodeTypeChange}
                            >
                              {Object.entries(paymentCodeTypes).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              className="form-control"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              style={{ maxWidth: "220px" }}
                              value={newPaymentCode.code}
                              onChange={e => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                handlePaymentCodeChange({ target: { value: val } });
                              }}
                              placeholder="กรอกรหัส"
                            />
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              style={{ minWidth: "100px", maxWidth: "140px", padding: "6px 18px" }}
                              onClick={handleAddPaymentCode}
                            >
                              เพิ่มรหัส
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${editMode ? 'btn-secondary' : 'btn-warning'}`}
                              style={{ minWidth: "80px", padding: "6px 18px" }}
                              onClick={handleEditMode}
                            >
                              {editMode ? 'ยกเลิก' : 'แก้ไข'}
                            </button>
                            {editMode && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ minWidth: "80px", padding: "6px 18px" }}
                                onClick={handleSavePaymentEdit}
                              >
                                บันทึก
                              </button>
                            )}
                          </div>

                          {/* ตารางรหัสแต่ละประเภท */}
                          <div style={{ overflowX: "auto" }}>
                            <table className="table table-bordered table-sm" style={{ fontSize: "0.95rem", minWidth: "900px" }}>
                              <thead>
                                <tr>
                                  {Object.entries(paymentCodeTypes).map(([type, label]) => (
                                    <th key={type} style={{ whiteSpace: "nowrap", textAlign: "center", verticalAlign: "middle" }}>{label}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {Object.entries(paymentCodeTypes).map(([type]) => (
                                    <td key={type} style={{ verticalAlign: "top", minWidth: "80px" }}>
                                      {paymentCodes[type]?.map((code, idx) => (
                                        <div key={idx} className={`d-flex ${editMode ? 'justify-content-between' : 'justify-content-center'} align-items-center mb-1 p-1 border rounded`} style={{ fontSize: "0.95rem" }}>
                                          <span>{code}</span>
                                          {editMode && (
                                            <button
                                              type="button"
                                              className="btn btn-danger"
                                              style={{ borderRadius: 16, width:22, minHeight: 28, fontSize: 14, padding: '0 6px', lineHeight: 1 }}
                                              onClick={() => handleRemovePaymentCode(type, idx)}
                                              title="ลบรหัสนี้"
                                            >
                                              &times;
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Payment Period Section - อยู่ด้านล่างของ Payment Codes */}
                    <h2 className="title">
                      ตั้งค่ารอบการจ่ายเงินในการออกสลิปเงินเดือนในแต่ละเดือน
                    </h2>
                    <div className="form-group d-flex align-items-center justify-content-center">
                      <div className="col-md-12">
                        <section className="Frame d-flex row justify-content-center align-items-center">
                          <div className="row">
                            {/* แถวที่ 1 */}
                            <div className="col-md-6 mb-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มกราคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jan}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jan",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กุมภาพันธ์
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.feb}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "feb",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 2 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มีนาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.mar}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "mar",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  เมษายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.apr}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "apr",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 3 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  พฤษภาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.may}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "may",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  มิถุนายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jun}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jun",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 4 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กรกฎาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.jul}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "jul",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  สิงหาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.aug}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "aug",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 5 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  กันยายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.sep}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "sep",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  ตุลาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.oct}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "oct",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>

                            {/* แถวที่ 6 */}
                            <div className="col-md-6 mb-3 pt-3 px-5">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  พฤศจิกายน
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.nov}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "nov",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-3 pt-3">
                              <div className="d-flex align-items-center">
                                <label
                                  className="col-form-label me-3"
                                  style={{
                                    minWidth: "100px",
                                    fontWeight: "500",
                                  }}
                                >
                                  ธันวาคม
                                </label>
                                <input
                                  className="form-control"
                                  type="date"
                                  value={paymentPeriod.dec}
                                  onChange={(e) =>
                                    handlePaymentPeriodChange(
                                      "dec",
                                      e.target.value
                                    )
                                  }
                                  style={{ maxWidth: "200px" }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* ปุ่มตั้งค่าวันที่เหมือนกันทั้งหมด */}
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <div className="d-flex align-items-center justify-content-center">
                                <label className="col-form-label me-3">
                                  ตั้งค่าวันที่เดียวกันทั้งหมด:
                                </label>
                                <input
                                  className="form-control me-3"
                                  type="date"
                                  id="allMonthsDate"
                                  style={{ maxWidth: "200px" }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    const selectedDate =
                                      document.getElementById(
                                        "allMonthsDate"
                                      ).value;
                                    if (selectedDate) {
                                      const dateObj = new Date(selectedDate);
                                      const day = dateObj
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0");
                                      const year = dateObj.getFullYear();

                                      setPaymentPeriod({
                                        jan: `${year}-01-${day}`,
                                        feb: `${year}-02-${day}`,
                                        mar: `${year}-03-${day}`,
                                        apr: `${year}-04-${day}`,
                                        may: `${year}-05-${day}`,
                                        jun: `${year}-06-${day}`,
                                        jul: `${year}-07-${day}`,
                                        aug: `${year}-08-${day}`,
                                        sep: `${year}-09-${day}`,
                                        oct: `${year}-10-${day}`,
                                        nov: `${year}-11-${day}`,
                                        dec: `${year}-12-${day}`,
                                      });

                                      alert(
                                        `ตั้งค่าวันที่ ${day} สำหรับทุกเดือนเรียบร้อยแล้ว`
                                      );
                                    } else {
                                      alert("กรุณาเลือกวันที่ก่อน");
                                    }
                                  }}
                                >
                                  ใช้วันที่นี้ทั้งหมด
                                </button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Hospital Section */}
                    <h2 className="title">
                      รหัสสถานรักษาพยาบาลที่รองรับพนักงาน
                    </h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              รายชื่อสถานรักษาพยาบาล
                            </label>
                            <div className="col-md-9">
                              <div className="row">
                                <div className="col-md-6">
                                  <select
                                    value={selectedLocalHospital || ""}
                                    onChange={
                                      handleSelectionLocalHospotalChange
                                    }
                                    className="form-control"
                                  >
                                    <option value="" disabled>
                                      เลือกจังหวัด
                                    </option>
                                    {localHospitalList.map((hospital) => (
                                      <option
                                        key={hospital.value}
                                        value={hospital.value}
                                      >
                                        {hospital.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="col-md-6">
                                  <select
                                    value={tmpHospital || ""}
                                    onChange={handleSelectionHospotalChange}
                                    className="form-control"
                                  >
                                    <option value="" disabled>
                                      เลือกสถานรักษาพยาบาล
                                    </option>
                                    {tmpLocalHospitalList.map(
                                      (hospital, index) => (
                                        <option key={index} value={hospital}>
                                          {hospital}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-md-3 col-form-label"></label>
                            <div className="col-md-9">
                              <div className="row">
                                {tmpLocalHospitalList.map((item, index) => (
                                  <div key={index} className="col-md-12 mb-2">
                                    <div className="d-flex align-items-center border rounded p-2">
                                      <div className="flex-grow-1">
                                        <p className="mb-0">{item}</p>
                                      </div>
                                      <button
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() =>
                                          handleDeleteHospital(index)
                                        }
                                      >
                                        ลบ
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-8">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรอกชื่อโรงพยาบาลใหม่"
                                    value={newHospital}
                                    onChange={(e) =>
                                      setNewHospital(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-md-4">
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleAddHospital}
                                  >
                                    เพิ่มโรงพยาบาล
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Salary Standard Section */}
                    <h2 className="title">อัตราค่าจ้าง</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ค่าจ้างขั้นต่ำ
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="ค่าจ้างขั้นต่ำ"
                                value={salaryStandard}
                                onChange={(e) =>
                                  setSalaryStandard(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Leave Section */}
                    <h2 className="title">วันลา</h2>
                    <div className="form-group row">
                      <div className="col-md-12">
                        <section className="Frame">
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลาป่วย
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันลาป่วย"
                                value={sickLeave}
                                onChange={(e) => setSickLeave(e.target.value)}
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลากิจ
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันลากิจ"
                                value={personalLeave}
                                onChange={(e) =>
                                  setPersonalLeave(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-3 col-form-label">
                              ลาพักร้อน
                            </label>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="วันพักร้อน"
                                value={vacationLeave}
                                onChange={(e) =>
                                  setVacationLeave(e.target.value)
                                }
                              />
                            </div>
                            <label className="col-form-label">วัน</label>
                          </div>
                        </section>
                      </div>
                    </div>

                    <div className="line_btn">
                      <button type="submit" className="btn b_save">
                        <i className="nav-icon fas fa-save"></i> &nbsp;บันทึก
                      </button>
                      <button
                        type="button"
                        className="btn clean"
                        onClick={() => window.location.reload()}
                      >
                        <i className="far fa-window-close"></i> &nbsp;ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BasicSetting;
