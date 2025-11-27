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

        // NEW: Payment codes
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
    // นักขัติ/วันหยุด
    publicHolidayCashIds: [],
    // บวกอื่นๆ หลังภาษี
    additionalAfterTaxIds: [],
    // หักอื่นๆ หลังภาษี
    deductionAfterTaxIds: [],
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
    positionIdsPlus: "ตำแหน่ง",
    diligenceIdsPlus: "เบี้ยขยัน",
    holidayIdsPlus: "นักขัติ/วันหยุด",
    additionalBeforeTaxIdsPlus: "บวกอื่นๆ ก่อนหักภาษี",
    additionalAfterTaxIdsPlus: "บวกอื่นๆ หลังหักภาษี",
    deductionBeforeTaxIdsPlus: "หักอื่นๆ ก่อนหักภาษี",
    deductionAfterTaxIdsPlus: "หักอื่นๆ หลังหักภาษี",
    taxIdsDeduct: "หักภาษี",
    socialSecurityIdsDeduct: "หัก ปกส",
    advancePaymentIdsDeduct: "เบิกล่วงหน้า",
    totalIds: "สุทธิ",
  };

  useEffect(() => {
    document.title = "ตั้งค่าระบบ";
    fetchSettings();
  }, []);

  const handlePaymentPeriodChange = (month, value) => {
    setPaymentPeriod((prev) => ({
      ...prev,
      [month]: value,
    }));
  };

  // NEW: Payment Code Functions
  const handleAddPaymentCode = () => {
    if (newPaymentCode.code.trim() === "") {
      alert("กรุณากรอกรหัส");
      return;
    }

    setPaymentCodes((prev) => ({
      ...prev,
      [newPaymentCode.type]: [
        ...prev[newPaymentCode.type],
        newPaymentCode.code.trim(),
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
      const response = await axios.post(
        endpoint + "/basicsetting",
        settingData
      );
      if (response.status === 201) {
        alert("Data saved successfully!");
        fetchSettings();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
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
                            <div className="col-md-3">
                              <select
                                className="form-control"
                                value={newPaymentCode.type}
                                onChange={handlePaymentCodeTypeChange}
                              >
                                {Object.entries(paymentCodeTypes).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <label className="col-md-1 col-form-label">
                              รหัส
                            </label>
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control"
                                value={newPaymentCode.code}
                                onChange={handlePaymentCodeChange}
                                placeholder="กรอกรหัส"
                              />
                            </div>
                            <div className="col-md-3">
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleAddPaymentCode}
                              >
                                เพิ่มรหัส
                              </button>
                            </div>
                          </div>

                          {/* Display Added Payment Codes */}
                          <div className="form-group row">
                            <div className="col-md-12">
                              <h5>รหัสที่ตั้งค่าแล้ว:</h5>
                              <div className="row">
                                {Object.entries(paymentCodeTypes).map(
                                  ([type, label]) =>
                                    paymentCodes[type]?.length > 0 && (
                                      <div key={type} className="col-md-6 mb-3">
                                        <div className="card">
                                          <div className="card-header bg-primary text-white">
                                            <strong>{label}</strong>
                                          </div>
                                          <div className="card-body">
                                            {paymentCodes[type].map(
                                              (code, index) => (
                                                <div
                                                  key={index}
                                                  className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                                                >
                                                  <span>{code}</span>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                      handleRemovePaymentCode(
                                                        type,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    &times;
                                                  </button>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
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
