import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {
  format,
  addYears,
  subYears,
  getYear,
  setYear,
  getMonth,
} from "date-fns";
// Register the Thai locale
registerLocale("th", th);
setDefaultLocale("th");
import EmployeesSelected from "./EmployeesSelected";
import Employee from "./Employee";
import locationData from "./LocationData/locationData";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import { useLocation } from "react-router-dom";
// const toBuddhistYear = (date, formatString) => {
//     const christianYear = getYear(date);
//     console.log('christianYear',christianYear);
//     const buddhistYear = christianYear + 543;
//     return format(date, formatString).replace(christianYear.toString(), buddhistYear.toString());
// };

// const locationData = {
//   Bangkok: {
//     districts: {
//       "District 1": ["SubDistrict 1-1", "SubDistrict 1-2"],
//       "District 2": ["SubDistrict 2-1", "SubDistrict 2-2"],
//     },
//   },
//   ChiangMai: {
//     districts: {
//       "District 3": ["SubDistrict 3-1", "SubDistrict 3-2"],
//       "District 4": ["SubDistrict 4-1", "SubDistrict 4-2"],
//     },
//   },
// };

import provincesData from "./LocationData/json/thai_provinces.json";
import districtsData from "./LocationData/json/thai_amphures.json";
import subDistrictsData from "./LocationData/json/thai_tambons.json";

function AddEditEmployee() {
  const [activeTab, setActiveTab] = useState('createEdit');
  const [showPopup, setShowPopup] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const popupRef = useRef(null);
  const [dateOfBirth, setDateOfBirth] = useState(""); //วดป เกิด

  // Date pickers for วันที่เริ่มงาน
  const [showStartJobPopup, setShowStartJobPopup] = useState(false);
  const [startJobDay, setStartJobDay] = useState("");
  const [startJobMonth, setStartJobMonth] = useState("");
  const [startJobYear, setStartJobYear] = useState("");
  const startJobPopupRef = useRef(null);

  // Date pickers for วันที่บรรจุ
  const [showExceptJobPopup, setShowExceptJobPopup] = useState(false);
  const [exceptJobDay, setExceptJobDay] = useState("");
  const [exceptJobMonth, setExceptJobMonth] = useState("");
  const [exceptJobYear, setExceptJobYear] = useState("");
  const exceptJobPopupRef = useRef(null);

  const handleDateChange = () => {
    if (day && month && year) {
      const date = `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      setFormattedDate(date);
      setShowPopup(false);
      setDateOfBirth(date);
    }
  };

  const handleStartJobDateChange = () => {
    if (startJobDay && startJobMonth && startJobYear) {
      const date = `${startJobDay.toString().padStart(2, "0")}/${startJobMonth
        .toString()
        .padStart(2, "0")}/${startJobYear}`;
      setStartjob(date);
      setShowStartJobPopup(false);
    }
  };

  const handleExceptJobDateChange = () => {
    if (exceptJobDay && exceptJobMonth && exceptJobYear) {
      const date = `${exceptJobDay.toString().padStart(2, "0")}/${exceptJobMonth
        .toString()
        .padStart(2, "0")}/${exceptJobYear}`;
      setExceptjob(date);
      setShowExceptJobPopup(false);
    }
  };

  // const handleDateChange = () => {
  //     if (day && month && year) {
  //       const buddhistYear = parseInt(year);
  //       const gregorianYear = buddhistYear - 543;
  //       const dateStr = `${day.toString().padStart(2, "0")}/${month
  //         .toString()
  //         .padStart(2, "0")}/${year}`;
  //       const isoDate = new Date(
  //         gregorianYear,
  //         parseInt(month) - 1,
  //         parseInt(day)
  //       );
  //       setFormattedDate(dateStr);
  //       setShowPopup(false);
  //       setDateOfBirth(isoDate); // Set the dateOfBirth to a Date object
  //       console.log("ISO Date:", isoDate); // To check the converted date format
  //     }
  //   };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
    if (startJobPopupRef.current && !startJobPopupRef.current.contains(event.target)) {
      setShowStartJobPopup(false);
    }
    if (exceptJobPopupRef.current && !exceptJobPopupRef.current.contains(event.target)) {
      setShowExceptJobPopup(false);
    }
  };
  console.log("formattedDate", formattedDate);
  useEffect(() => {
    if (showPopup || showStartJobPopup || showExceptJobPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup, showStartJobPopup, showExceptJobPopup]);

  const popupStyle = {
    position: "absolute",
    background: "white",
    border: "1px solid #ccc",
    padding: "10px",
    zIndex: 1000,
    width: "30rem",
  };
  const [storedEmp, setStoredEmp] = useState([]);
  const [employeesResult, setEmployeesResult] = useState([]);

  const [buttonValue, setButtonValue] = useState("");
  const [newEmp, setNewEmp] = useState(true);
  const [employeeselection, setEmployeeselection] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // สำหรับจัดการสถานะ loading

  const bordertable = {
    borderLeft: "2px solid #000",
  };

  // Tab State for Salary (removed duplicate - already declared at line 54)
  // const [activeTab, setActiveTab] = useState("tab1");
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState(null);
  const [selectedEmployeeForTab2, setSelectedEmployeeForTab2] = useState(null);

  // เมื่อมีการเลือกพนักงานใน Tab 1 จะถามว่าจะไปแท็บไหน
  const handleEmployeeSelectForTab2 = async (employee) => {
    console.log('🎯 Selected employee for Tab 2:', employee);

    // ถามว่าจะไปแท็บไหน
    const result = await Swal.fire({
      title: 'เลือกแท็บที่ต้องการ',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 20px; font-size: 16px; color: #5a5c69;">
            พนักงาน: <strong>${employee.name} ${employee.lastName}</strong>
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="tab2Btn" class="swal2-confirm swal2-styled" style="background-color: #3085d6; margin: 0;">
              <i class="fas fa-user-circle"></i> แท็บ 2 - ข้อมูลพนักงาน
            </button>
            <button id="tab3Btn" class="swal2-confirm swal2-styled" style="background-color: #28a745; margin: 0;">
              <i class="fas fa-money-bill"></i> แท็บ 3 - เงินเดือน
            </button>
            <button id="tab4Btn" class="swal2-confirm swal2-styled" style="background-color: #f6c23e; color: #000; margin: 0;">
              <i class="fas fa-user-cog"></i> แท็บ 4 - จัดการเวลาทำงาน
            </button>
            <button id="cancelBtn" class="swal2-cancel swal2-styled" style="background-color: #d33; margin: 0;">
              <i class="fas fa-times"></i> ยกเลิก
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      didOpen: () => {
        const tab2Btn = document.getElementById('tab2Btn');
        const tab3Btn = document.getElementById('tab3Btn');
        const tab4Btn = document.getElementById('tab4Btn');
        const cancelBtn = document.getElementById('cancelBtn');

        if (tab2Btn) {
          tab2Btn.addEventListener('click', async () => {
            Swal.close();
            setSelectedEmployeeForTab2(employee);
            await handleEmployeeSelectForSalary(employee);
            setActiveTab("tab2");
          });
        }

        if (tab3Btn) {
          tab3Btn.addEventListener('click', async () => {
            Swal.close();
            setSelectedEmployeeForTab2(employee);
            await handleEmployeeSelectForSalary(employee);
            setActiveTab("tab3");
          });
        }

        if (tab4Btn) {
          tab4Btn.addEventListener('click', async () => {
            Swal.close();
            setSelectedEmployeeForTab2(employee);
            await handleEmployeeSelectForSalary(employee);
            setActiveTab("tab4");
          });
        }

        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            Swal.close();
          });
        }
      }
    });
  };

  const handleEmployeeSelectForSalary = async (employee) => {
    setSelectedEmployeeForSalary(employee);

    // ดึงข้อมูลพนักงานแบบเต็มจาก API
    try {
      const response = await axios.post(endpoint + "/employee/search", {
        employeeId: employee.employeeId,
        name: '',
        idCard: '',
        workPlace: ''
      });

      if (response.data && response.data.employees && response.data.employees.length > 0) {
        const fullEmployeeData = response.data.employees[0];
        setEmployeeData(fullEmployeeData);

        // Set ข้อมูลต่างๆ
        setEmployeeId(fullEmployeeData.employeeId || '');
        setName(fullEmployeeData.name || '');
        setLastName(fullEmployeeData.lastName || '');
        setPosition(fullEmployeeData.position || '');
        setWorkplace(fullEmployeeData.workplace || '');
        setJobtype(fullEmployeeData.jobtype || '');
        setCosttype(fullEmployeeData.costtype || '');
        setSalary(fullEmployeeData.salary || '');
        setStartjob(fullEmployeeData.startjob || '');
        setExceptjob(fullEmployeeData.exceptjob || '');

        // ดึงสถานที่ปฏิบัติงานจาก workplace
        if (fullEmployeeData.workplace) {
          try {
            // เรียก API เพื่อดึงข้อมูล workplace
            const workplaceResponse = await axios.get(endpoint + "/workplace/listselect");
            console.log('📍 Workplace list:', workplaceResponse.data);

            const matchedWorkplace = workplaceResponse.data.find(
              wp => wp.workplaceId === fullEmployeeData.workplace
            );

            if (matchedWorkplace) {
              setWorkplacearea(matchedWorkplace.workplaceArea || '');
              console.log('✅ Set workplacearea:', matchedWorkplace.workplaceArea);
            } else {
              console.log('⚠️ No matching workplace found for:', fullEmployeeData.workplace);
              console.log('Available workplaces:', workplaceResponse.data.map(w => w.workplaceId));
            }
          } catch (error) {
            console.error('Error fetching workplace area:', error);
          }
        }

        // Tab 3 Salary fields
        setStartcount(fullEmployeeData.startcount || '');
        setSalarytype(fullEmployeeData.salarytype || '');
        setMoney(fullEmployeeData.money || '');
        setSalaryupdate(fullEmployeeData.salaryupdate || '');
        setSalaryout(fullEmployeeData.salaryout || '');
        setSalarypayment(fullEmployeeData.salarypayment || '');
        setSalarybank(fullEmployeeData.salarybank || '');
        setBanknumber(fullEmployeeData.banknumber || '');

        // Leave balances
        setBusinessLeave(fullEmployeeData.remainbusinessleave || '');
        setBusinessLeaveSalary(fullEmployeeData.businessleavesalary || '');
        setSickLeave(fullEmployeeData.remainsickleave || '');
        setSickLeaveSalary(fullEmployeeData.sickleavesalary || '');
        setVacationLeave(fullEmployeeData.remainvacation || '');
        setVacationSalary(fullEmployeeData.vacationsalary || '');
        setMaternityLeave(fullEmployeeData.maternityleave || '');
        setMaternityleaveSalary(fullEmployeeData.maternityleavesalary || '');
        setMilitaryLeave(fullEmployeeData.militaryleave || '');
        setMilitaryLeaveSalary(fullEmployeeData.militaryleavesalary || '');
        setSterilizationLeave(fullEmployeeData.sterilization || '');
        setSterilizationLeaveSalary(fullEmployeeData.sterilizationsalary || '');

        // Benefits
        if (fullEmployeeData.addSalary && Array.isArray(fullEmployeeData.addSalary)) {
          setAddSalary(fullEmployeeData.addSalary);
        }

        // แยกวันที่เริ่มงาน
        if (fullEmployeeData.startjob) {
          const [d, m, y] = fullEmployeeData.startjob.split('/');
          setStartJobDay(d);
          setStartJobMonth(m);
          setStartJobYear(y);
        }

        // แยกวันที่บรรจุ
        if (fullEmployeeData.exceptjob) {
          const [d, m, y] = fullEmployeeData.exceptjob.split('/');
          setExceptJobDay(d);
          setExceptJobMonth(m);
          setExceptJobYear(y);
        }

        console.log('Loaded employee data for salary:', fullEmployeeData);
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
    }

    setActiveTab("tab2"); // เปลี่ยนไป Tab 2 อัตโนมัติ
  };

  const [newWorkplace, setNewWorkplace] = useState(true);

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchIdCard, setSearchIdCard] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchWorkPlace, setSearchWorkPlace] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);

  const options = [];

  for (let i = 1; i <= 31; i++) {
    // Use padStart to add leading zeros to numbers less than 10
    const formattedValue = i.toString().padStart(2, "0");
    options.push(
      <option key={i} value={formattedValue}>
        {formattedValue}
      </option>
    );
  }

  // Fetch all employees for frontend filtering
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await axios.get(endpoint + "/employee/list");
        if (response.data) {
          setAllEmployees(response.data);
          console.log("Loaded employees:", response.data.length);
          // Debug: Check phone field name
          if (response.data.length > 0) {
            console.log("Sample employee data:", response.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching all employees:", error);
      }
    };
    fetchAllEmployees();
  }, []);

  const [_id, set_id] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(""); //ตำแหน่ง
  const [department, setDepartment] = useState(""); //แผนก
  const [workplace, setWorkplace] = useState(""); //หน่วยงาน
  const [workplacearea, setWorkplacearea] = useState(""); //สถานที่ปฏิบัติงาน
  const [employeeData, setEmployeeData] = useState({});
  const [jobtype, setJobtype] = useState(""); //ประเภทการจ้าง
  const [costtype, setCosttype] = useState(""); //ลงบัญชีแบบ (ภ.ง.ด.1 / ภ.ง.ด.3)
  const [salary, setSalary] = useState(""); //เงินจ้าง

  const [startjob, setStartjob] = useState(""); //วันที่เริ่มงาน
  const [endjob, setEndjob] = useState(""); //วันที่ลาออก
  const [exceptjob, setExceptjob] = useState(""); //วันที่บรรจุ

  // Salary Tab 2 States
  const [paymentMethod, setPaymentMethod] = useState(""); //วิธีจ่ายเงิน
  const [bank, setBank] = useState(""); //ธนาคาร
  const [accountNumber, setAccountNumber] = useState(""); //เลขบัญชี

  // Tab 3 - Additional Salary States
  const [startcount, setStartcount] = useState(""); //วันเริ่มคำนวณ
  const [salarytype, setSalarytype] = useState(""); //ประเภทเงินเดือน
  const [money, setMoney] = useState(""); //หน่วยของเงิน
  const [salaryupdate, setSalaryupdate] = useState(""); //เงินเดือนปรับเมื่อ
  const [salaryout, setSalaryout] = useState(""); //เงินเดือนออก
  const [salarypayment, setSalarypayment] = useState(""); //วิธีจ่ายเงิน (Tab 3)
  const [salarybank, setSalarybank] = useState(""); //ธนาคาร (Tab 3)
  const [banknumber, setBanknumber] = useState(""); //เลขบัญชี (Tab 3)

  // Benefits States
  const [salaryadd1, setSalaryadd1] = useState(false); //ค่ารถ
  const [salaryadd1Value, setSalaryadd1Value] = useState(""); //จำนวนค่ารถ
  const [salaryadd2, setSalaryadd2] = useState(false); //ค่าอาหาร
  const [salaryadd2Value, setSalaryadd2Value] = useState(""); //จำนวนค่าอาหาร
  const [salaryadd3, setSalaryadd3] = useState(false); //เบี้ยขยัน
  const [salaryadd3Value, setSalaryadd3Value] = useState(""); //จำนวนเบี้ยขยัน
  const [salaryadd4, setSalaryadd4] = useState(false); //ค่าโทรศัพท์
  const [salaryadd4Value, setSalaryadd4Value] = useState(""); //จำนวนค่าโทรศัพท์
  const [salaryadd5, setSalaryadd5] = useState(false); //เงินประจำตำแหน่ง
  const [salaryadd5Value, setSalaryadd5Value] = useState(""); //จำนวนเงินประจำตำแหน่ง

  // Leave Balance States
  const [businessLeave, setBusinessLeave] = useState(""); //วันลากิจ
  const [businessLeaveSalary, setBusinessLeaveSalary] = useState(""); //หักเงินลากิจต่อวัน
  const [sickLeave, setSickLeave] = useState(""); //วันลาป่วย
  const [sickLeaveSalary, setSickLeaveSalary] = useState(""); //หักเงินลาป่วยต่อวัน
  const [vacationLeave, setVacationLeave] = useState(""); //วันลาพักร้อน
  const [vacationSalary, setVacationSalary] = useState(""); //หักเงินลาพักร้อนต่อวัน
  const [maternityLeave, setMaternityLeave] = useState(""); //วันลาคลอด
  const [maternityleaveSalary, setMaternityleaveSalary] = useState(""); //หักเงินลาคลอดต่อวัน
  const [militaryLeave, setMilitaryLeave] = useState(""); //วันลาเกณฑ์ทหาร
  const [militaryLeaveSalary, setMilitaryLeaveSalary] = useState(""); //หักเงินลาเกณฑ์ทหารต่อวัน
  const [sterilizationLeave, setSterilizationLeave] = useState(""); //วันลาทำหมัน
  const [sterilizationLeaveSalary, setSterilizationLeaveSalary] = useState(""); //หักเงินลาทำหมันต่อวัน
  const [trainingLeave, setTrainingLeave] = useState(""); //วันลาฝึกอบรม
  const [trainingLeaveSalary, setTrainingLeaveSalary] = useState(""); //หักเงินลาฝึกอบรมต่อวัน

  // สวัสดิการ - เงินเพิ่มพิเศษ
  const [addSalary, setAddSalary] = useState([]); // เงินเพิ่มที่ได้รับ
  const [addSalaryWorkplace, setAddSalaryWorkplace] = useState([]); // เงินเพิ่มของหน่วยงาน
  const [workplaceSelectionSalary, setWorkplaceSelectionSalary] = useState([]);

  const [prefix, setPrefix] = useState(""); //นำหน้าชื่อ
  const [name, setName] = useState(""); //ชื่อ
  const [lastName, setLastName] = useState(""); //นามสกุล
  const [nickName, setNickName] = useState(""); //ชื่อเล่น
  const [gender, setGender] = useState(""); //เพศ
  //   const [dateOfBirth, setDateOfBirth] = useState(""); //วดป เกิด
  const [age, setAge] = useState(""); //อายุ
  const [idCard, setIdCard] = useState(""); //บัตรประชาชน
  const [ethnicity, setEthnicity] = useState(""); //เชื้อชาติ
  const [religion, setReligion] = useState(""); //ศาสนา
  const [maritalStatus, setMaritalStatus] = useState(""); //สถานภาพการสมรส
  const [militaryStatus, setMilitaryStatus] = useState(""); //สถานภาพทางการทหาร
  const [address, setAddress] = useState(""); //ที่อยู่ตามบัตรประชาชน
  const [currentAddress, setCurrentAddress] = useState(""); //ที่อยู่ปัจจุบัน

  const [province, setProvince] = useState(""); //จังหวัด
  const [district, setDistrict] = useState(""); //อำเภอ
  const [subDistrict, setSubDistrict] = useState(""); //ตำบล
  const [postalCode, setPostalCode] = useState(""); //ตำบล
  const [houseNumber, setHouseNumber] = useState(""); //ตำบล

  const [province2, setProvince2] = useState(""); // จังหวัด
  const [district2, setDistrict2] = useState(""); // อำเภอ
  const [subDistrict2, setSubDistrict2] = useState(""); // ตำบล
  const [postalCode2, setPostalCode2] = useState(""); // ไปรษณีย์
  const [houseNumber2, setHouseNumber2] = useState(""); //ตำบล

  const [districtOptions, setDistrictOptions] = useState([]); // Options for district
  const [districtOptions2, setDistrictOptions2] = useState([]); // Options for district

  const [subDistrictOptions, setSubDistrictOptions] = useState([]); // Options for sub-district
  const [subDistrictOptions2, setSubDistrictOptions2] = useState([]); // Options for sub-district

  const [isChecked, setIsChecked] = useState(false); // Checkbox state

  // When province changes, update district options and reset selections
  // useEffect(() => {
  //   if (province) {
  //     const districts = locationData[province]?.districts || {};
  //     setDistrictOptions(Object.keys(districts));
  //     setDistrict(""); // Reset district when province changes
  //     setSubDistrict(""); // Reset sub-district when province changes
  //     setSubDistrictOptions([]); // Clear sub-district options
  //   }
  // }, [province]);
  useEffect(() => {
    if (province) {
      const filteredDistricts = districtsData.filter(
        (district) => district.province_id === parseInt(province)
      );
      setDistrictOptions(filteredDistricts);
      // setDistrict(""); // Reset district selection
      // setSubDistrict(""); // Reset sub-district selection
      setSubDistrictOptions([]); // Clear sub-district options
    }
  }, [province]);
  useEffect(() => {
    if (province2) {
      const filteredDistricts = districtsData.filter(
        (district) => district.province_id === parseInt(province2)
      );
      setDistrictOptions2(filteredDistricts);
      // setDistrict2(""); // Reset district selection
      // setSubDistrict2(""); // Reset sub-district selection
      setSubDistrictOptions2([]); // Clear sub-district options
    }
  }, [province2]);
  // When district changes, update sub-district options
  // useEffect(() => {
  //   if (district && province) {
  //     const subDistricts = locationData[province]?.districts[district] || [];
  //     setSubDistrictOptions(subDistricts);
  //     setSubDistrict(""); // Reset sub-district when district changes
  //   }
  // }, [district, province]);
  useEffect(() => {
    if (district) {
      const filteredSubDistricts = subDistrictsData.filter(
        (subDistrict) => subDistrict.amphure_id === parseInt(district)
      );
      setSubDistrictOptions(filteredSubDistricts);
      // setSubDistrict(""); // Reset sub-district selection
      console.log("filteredSubDistricts", filteredSubDistricts);
    }
  }, [district]);
  useEffect(() => {
    if (district2) {
      const filteredSubDistricts = subDistrictsData.filter(
        (subDistrict) => subDistrict.amphure_id === parseInt(district2)
      );
      setSubDistrictOptions2(filteredSubDistricts);
      // setSubDistrict2(""); // Reset sub-district selection
      console.log("filteredSubDistricts", filteredSubDistricts);
    }
  }, [district2]);

  useEffect(() => {
    if (subDistrict) {
      // Find the selected sub-district from the data
      const selectedSubDistrict = subDistrictsData.find(
        (subDist) => subDist.id === parseInt(subDistrict)
      );

      if (selectedSubDistrict) {
        // Set the postal code based on the sub-district's zip code
        setPostalCode(selectedSubDistrict.zip_code);
      } else {
        setPostalCode(""); // Reset postal code if no match
      }
    }
  }, [subDistrict, subDistrictsData]);

  useEffect(() => {
    if (subDistrict2) {
      // Find the selected sub-district from the data
      const selectedSubDistrict = subDistrictsData.find(
        (subDist) => subDist.id === parseInt(subDistrict2)
      );

      if (selectedSubDistrict) {
        // Set the postal code based on the sub-district's zip code
        setPostalCode2(selectedSubDistrict.zip_code);
      } else {
        setPostalCode2(""); // Reset postal code if no match
      }
    }
  }, [subDistrict2, subDistrictsData]);

  // Handle checkbox toggle to copy values
  const handleCheckboxToggle = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      // Copy values from primary fields to secondary fields
      setProvince2(province);
      setDistrict2(district);
      setSubDistrict2(subDistrict);
      setPostalCode2(postalCode);
      setHouseNumber2(houseNumber);
      setCurrentAddress(address);
    } else {
      // Allow manual editing if unchecked
      setProvince2("");
      setDistrict2("");
      setSubDistrict2("");
      setPostalCode2("");
      setHouseNumber2("");
      setCurrentAddress("");
    }
  };

  const [phoneNumber, setPhoneNumber] = useState(""); //เบอร์โทรศัพท์
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(""); //เบอร์ติดต่อกรณีฉุกเฉิน
  const [emergencyRelationship, setEmergencyRelationship] = useState(""); //ความสัมพันธ์
  const [emergencyName, setEmergencyName] = useState(""); //ผู้ติดต่อฉุกเฉิน
  const [idLine, setIdLine] = useState(""); //ไอดีไลน์
  const [vaccination, setVaccination] = useState([]); //การรับวัคซีน
  const [treatmentRights, setTreatmentRights] = useState(""); //สิทธิการรักษาพยาบาล

  const [workplaceSelection, setWorkplaceSelection] = useState([]);

  useEffect(() => {
    const storedValue = sessionStorage.getItem("empSelect");
    if (storedValue) {
      // setEmployeeselection(storedValue);
    }

    //get all Workplace from API
    fetch(endpoint + "/workplace/listselect") // Update with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setWorkplaceSelection(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // useEffect สำหรับ Tab 2 - ดึงข้อมูล workplace เมื่อเปิด Tab 2
  useEffect(() => {
    if (selectedEmployeeForSalary && activeTab === "tab2") {
      // ดึงข้อมูล workplace ต่างๆ
      const fetchWorkplaceData = async () => {
        try {
          const workplaceResponse = await axios.get(endpoint + "/employee/workplaceSelection");
          if (workplaceResponse.data) {
            setWorkplaceSelection(workplaceResponse.data);
          }

          const addSalaryResponse = await axios.get(endpoint + "/employee/addSalaryWorkplace");
          if (addSalaryResponse.data) {
            setAddSalaryWorkplace(addSalaryResponse.data);
          }

          console.log('Workplace data loaded for Tab 2');
        } catch (error) {
          console.error('Error loading workplace data:', error);
        }
      };

      fetchWorkplaceData();
    }
  }, [selectedEmployeeForSalary, activeTab]);

  // useEffect สำหรับโหลด benefits เมื่อมี workplace และ addSalaryWorkplace
  useEffect(() => {
    if (workplace && addSalaryWorkplace.length > 0 && activeTab === "tab2") {
      handleWorkplaceForSalary(workplace);
    }
  }, [workplace, addSalaryWorkplace, activeTab]);

  // Handle Change function for updating employee data in Tab 2
  const handleChange = (field, value) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle Workplace function for benefits in Tab 2
  const handleWorkplaceForSalary = async (selectedWorkplace) => {
    console.log('handleWorkplaceForSalary called with:', selectedWorkplace);

    if (!selectedWorkplace) {
      console.log('No workplace selected');
      return;
    }

    try {
      const matchedWorkplace = addSalaryWorkplace.find(
        (place) => place.workPlace === selectedWorkplace
      );

      if (matchedWorkplace) {
        console.log('Matched workplace found:', matchedWorkplace);

        // Set benefits based on workplace
        setSalaryadd1(matchedWorkplace.salaryadd1 || false);
        setSalaryadd2(matchedWorkplace.salaryadd2 || false);
        setSalaryadd3(matchedWorkplace.salaryadd3 || false);
        setSalaryadd4(matchedWorkplace.salaryadd4 || false);
        setSalaryadd5(matchedWorkplace.salaryadd5 || false);

        console.log('Benefits set successfully');
      } else {
        console.log('No matching workplace found in addSalaryWorkplace');
      }
    } catch (error) {
      console.error('Error in handleWorkplaceForSalary:', error);
    }
  };

  //   const handleDateOfBirth = (date) => {
  //     setDateOfBirth(date);
  //   };

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  //   const [dateOfBirth, setDateOfBirth] = useState('');
  //   const [age, setAge] = useState('');

  const calculateAge = (dob) => {
    const [dd, mm, yyyy] = dob.split("/");
    // แปลงจาก พ.ศ. เป็น ค.ศ.
    const gregorianYear = parseInt(yyyy) - 543;
    const birthDate = new Date(gregorianYear, parseInt(mm) - 1, parseInt(dd));
    const today = new Date();
    let ageNow = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageNow--;
    }
    setAge(ageNow);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (day && month && year) {
      const dob = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
      setFormattedDate(dob);
      setDateOfBirth(dob);
      calculateAge(dob);
    }
  }, [day, month, year]);

  useEffect(() => {
    if (startJobDay && startJobMonth && startJobYear) {
      handleStartJobDateChange();
    }
  }, [startJobDay, startJobMonth, startJobYear]);

  useEffect(() => {
    if (exceptJobDay && exceptJobMonth && exceptJobYear) {
      handleExceptJobDateChange();
    }
  }, [exceptJobDay, exceptJobMonth, exceptJobYear]);

  // ดึงข้อมูลสวัสดิการจากหน่วยงาน (ใช้ endpoint เดียวกับ Salary.jsx)
  useEffect(() => {
    const fetchWorkplaceSalary = async () => {
      try {
        const response = await axios.get(endpoint + "/workplace/list");
        const workplaceData = response.data;
        setWorkplaceSelectionSalary(workplaceData);

        console.log('📦 Loaded workplace data for benefits:', workplaceData);
      } catch (error) {
        console.error("Error fetching workplace salary data:", error);
      }
    };

    fetchWorkplaceSalary();
  }, []);

  // กรองสวัสดิการตามหน่วยงานของพนักงาน
  useEffect(() => {
    if (workplace && workplaceSelectionSalary.length > 0) {
      const matchedWorkplace = workplaceSelectionSalary.find(
        wp => wp.workplaceId === workplace
      );

      if (matchedWorkplace && matchedWorkplace.addSalary) {
        const benefits = matchedWorkplace.addSalary.map(benefit => ({
          ...benefit,
          workplaceId: matchedWorkplace.workplaceId,
          workplaceName: matchedWorkplace.workplaceName
        }));
        setAddSalaryWorkplace(benefits);
        console.log('✅ Filtered benefits for workplace:', workplace, benefits);
      } else {
        setAddSalaryWorkplace([]);
        console.log('⚠️ No benefits found for workplace:', workplace);
      }
    }
  }, [workplace, workplaceSelectionSalary]);

  // ฟังก์ชันบันทึกข้อมูลพนักงานสำหรับ Tab 3 (เหมือน Salary.jsx)
  async function updateEmployeeTab3() {
    try {
      // สร้าง employeeData object จากข้อมูล Tab 3
      const updatedData = {
        _id: employeeId,
        employeeId: employeeId,
        name: name,
        position: position,
        workplace: workplace,
        workplacearea: workplacearea,
        jobtype: jobtype,
        costtype: costtype,
        startcount: startcount,
        salarytype: salarytype,
        money: money,
        salaryupdate: salaryupdate,
        salaryout: salaryout,
        salarypayment: salarypayment,
        salarybank: salarybank,
        banknumber: banknumber,
        addSalary: addSalary,
        remainbusinessleave: businessLeave,
        businessleavesalary: businessLeaveSalary,
        remainsickleave: sickLeave,
        sickleavesalary: sickLeaveSalary,
        remainvacation: vacationLeave,
        vacationsalary: vacationSalary,
        maternityleave: maternityLeave,
        maternityleavesalary: maternityLeaveSalary,
        militaryleave: militaryLeave,
        militaryleavesalary: militaryLeaveSalary,
        sterilization: sterilizationLeave,
        sterilizationsalary: sterilizationLeaveSalary,
      };

      const response = await axios.put(
        endpoint + "/employee/update/" + employeeId,
        updatedData
      );

      if (response) {
        alert("บันทึกสำเร็จ");
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      console.error(error);
    }
  }

  const handleMilitaryStatus = (event) => {
    setMilitaryStatus(event.target.value);
  };
  const [copyAddress, setCopyAddress] = useState(false);

  const handleCheckboxChange = () => {
    setCopyAddress(!copyAddress); // Toggle the value of copyAddress
    if (!copyAddress) {
      setCurrentAddress(address); // Copy address to currentAddress
    } else {
      setCurrentAddress(""); // Reset currentAddress
    }
  };

  const handleWorkplace = (event) => {
    setWorkplace(event.target.value);
    setEmployeeData((prevData) => ({
      ...prevData,
      ["workplace"]: event.target.value,
    }));

    const filtered = workplaceSelection.filter(
      (wp) =>
        event.target.value === "" || wp.workplaceName === event.target.value
    );
    // alert(JSON.stringify(filtered , null, 2) );
    // alert(filtered[0].workplaceArea );
    // if (filtered !== '') {
    //     if (employeeData.workplace == '') {
    //         setWorkplacearea('');
    //     } else {
    //         setWorkplacearea(filtered[0].workplaceArea);
    //     }

    // } else {
    //     setWorkplacearea('');
    // }

    // setWorkplacearea(filtered[0].workplaceArea );
  };

  //////////////////////////////
  const [employeeList, setEmployeeList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceList(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  console.log("dateOfBirth", dateOfBirth);

  //Update localStorage
  function updateEmployeeLocal(emp) {
    let employeeLocal = JSON.parse(localStorage.getItem("selectedEmployees"));

    if (employeeLocal) {
      const employeeLocalUpdate = employeeLocal.map((item) => {
        if (item._id === emp._id) {
          return emp;
        }
        return item;
      });

      localStorage.setItem(
        "selectedEmployees",
        JSON.stringify(employeeLocalUpdate)
      );
    }
  }

  //setup file upload
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    const headers = {
      "Content-Type": "multipart/form-data",
      "Employee-Id": employeeId,
    };

    axios
      .post(endpoint + "/imgemployee/upload", formData, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function handleManageEmployee(event) {
    event.preventDefault();

    const data = {
      employeeId: employeeId,
      position: position,
      department: department,
      workplace: workplace,
      jobtype: jobtype,
      salary: salary,
      startjob: startjob,
      endjob: endjob,
      exceptjob: exceptjob,
      prefix: prefix,
      name: name,
      lastName: lastName,
      nickName: nickName,
      gender: gender,
      dateOfBirth: dateOfBirth,
      age: age,
      idCard: idCard,
      ethnicity: ethnicity,
      religion: religion,
      maritalStatus: maritalStatus,
      militaryStatus: militaryStatus,
      address: address,

      province: province,
      district: district,
      subDistrict: subDistrict,
      postalCode: postalCode,
      houseNumber: houseNumber,

      province2: province2,
      district2: district2,
      subDistrict2: subDistrict2,
      postalCode2: postalCode2,
      houseNumber2: houseNumber2,

      currentAddress: currentAddress,
      phoneNumber: phoneNumber,
      emergencyContactNumber: emergencyContactNumber,
      emergencyName: emergencyName,
      emergencyRelationship: emergencyRelationship,
      idLine: idLine,
      vaccination: vaccination,
      treatmentRights: treatmentRights,
    };

    //check create or update Employee
    if (newEmp) {
      if (buttonValue == "create") {
        try {
          const response = await axios.post(
            endpoint + "/employee/create",
            data
          );
          setEmployeesResult(response.data.employees);
          handleUpload();

          Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ!',
            html: `<div style="text-align: center;">
              <p style="font-size: 16px; margin: 10px 0;">ข้อมูลพนักงานถูกบันทึกเรียบร้อยแล้ว</p>
              <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="color: #155724; margin: 5px 0;"><strong>รหัสพนักงาน:</strong> ${employeeId}</p>
                <p style="color: #155724; margin: 5px 0;"><strong>ชื่อ-นามสกุล:</strong> ${prefix} ${name} ${lastName}</p>
                <p style="color: #155724; margin: 5px 0;"><strong>หน่วยงาน:</strong> ${workplace}</p>
              </div>
            </div>`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#28a745',
            timer: 3000,
            timerProgressBar: true
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถบันทึกได้',
            text: 'กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    } else {
      if (buttonValue == "save") {
        try {
          const response = await axios.put(
            endpoint + "/employee/update/" + _id,
            data
          );

          if (response) {
            handleUpload();
            updateEmployeeLocal(response.data);

            Swal.fire({
              icon: 'success',
              title: 'บันทึกสำเร็จ!',
              html: `<div style="text-align: center;">
                <p style="font-size: 16px; margin: 10px 0;">ข้อมูลพนักงานถูกบันทึกเรียบร้อยแล้ว</p>
                <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin-top: 15px;">
                  <p style="color: #155724; margin: 5px 0;"><strong>รหัสพนักงาน:</strong> ${employeeId}</p>
                  <p style="color: #155724; margin: 5px 0;"><strong>ชื่อ-นามสกุล:</strong> ${prefix} ${name} ${lastName}</p>
                  <p style="color: #155724; margin: 5px 0;"><strong>หน่วยงาน:</strong> ${workplace}</p>
                </div>
              </div>`,
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#28a745',
              timer: 3000,
              timerProgressBar: true
            }).then(() => {
              window.location.reload();
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถบันทึกได้',
            text: 'กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
        }
      }
    }
  }

  //search employee name by employeeId
  // console.log(workplaceList);
  // console.log(workplaceList);

  /////////////////////////////////////////////
  const [wId, setWId] = useState("");
  const [wName, setWName] = useState("");
  const [wDate, setWDate] = useState("");
  const [wShift, setWShift] = useState("");
  const [wStartTime, setWStartTime] = useState("");
  const [wEndTime, setWEndTime] = useState("");
  const [wAllTime, setWAllTime] = useState("");
  const [wOtTime, setWOtTime] = useState("");
  const [wSelectOtTime, setWSelectOtTime] = useState("");
  const [wSelectOtTimeout, setWSelectOtTimeout] = useState("");

  ///////////////////
  function handleClickResult(workplace) {
    // Populate all the startTime input fields with the search result value
    const updatedRowDataList = rowDataList.map((rowData) => ({
      ...rowData,
      startTime: workplace.workStart1,
      endTime: workplace.workEnd1,
      selectotTime: workplace.workEnd1,
    }));

    // Update the state
    setRowDataList(updatedRowDataList);
  }

  //data for search
  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [searchResult, setSearchResult] = useState([]);

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handlePrefix = (event) => {
    setPrefix(event.target.value);
  };

  const handleEthnicity = (event) => {
    setEthnicity(event.target.value);
  };
  const handleReligion = (event) => {
    setReligion(event.target.value);
  };

  // Functions สำหรับจัดการสวัสดิการ
  const handleAddToSalary = async (data) => {
    try {
      data.id = data.codeSpSalary || "";
      await setAddSalary((prev) => [...prev, data]);

      Swal.fire({
        icon: 'success',
        title: 'เพิ่มสวัสดิการสำเร็จ',
        text: `เพิ่ม ${data.name} จำนวน ${data.SpSalary} บาท`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error adding salary:", error);
    }
  };

  const handleRemoveFromSalary = (item) => {
    setAddSalary(prev => prev.filter(salary => salary.id !== item.id));

    Swal.fire({
      icon: 'info',
      title: 'นำสวัสดิการออกแล้ว',
      text: `นำ ${item.name} ออกจากรายการ`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleMaritalStatus = (event) => {
    setMaritalStatus(event.target.value);
  };
  async function handleSearch(event) {
    event.preventDefault();

    // Frontend filtering when using phoneNumber, lastName, or workPlace
    if (searchPhone || searchLastName || searchWorkPlace) {
      let filtered = [...allEmployees];

      if (searchEmployeeId) {
        filtered = filtered.filter(emp =>
          emp.employeeId && emp.employeeId.includes(searchEmployeeId)
        );
      }

      if (searchFirstName) {
        filtered = filtered.filter(emp =>
          emp.name && emp.name.toLowerCase().includes(searchFirstName.toLowerCase())
        );
      }

      if (searchLastName) {
        filtered = filtered.filter(emp =>
          emp.lastName && emp.lastName.toLowerCase().includes(searchLastName.toLowerCase())
        );
      }

      if (searchWorkPlace) {
        filtered = filtered.filter(emp =>
          emp.workplace && emp.workplace.toLowerCase().includes(searchWorkPlace.toLowerCase())
        );
      }

      if (searchPhone) {
        filtered = filtered.filter(emp =>
          emp.phoneNumber && emp.phoneNumber.includes(searchPhone)
        );
      }

      if (searchIdCard) {
        filtered = filtered.filter(emp =>
          emp.idCard && emp.idCard.includes(searchIdCard)
        );
      }

      if (filtered.length === 0) {
        setEmployeeId("");
        setName("");
        alert("ไม่พบข้อมูล");
        return;
      }

      // Use first result from filtered list
      setSearchResult(filtered);
      const employee = filtered[0];

      //clean form
      setSearchEmployeeId("");
      setSearchEmployeeName("");
      setSearchFirstName("");
      setSearchLastName("");
      setSearchIdCard("");
      setSearchPhone("");
      setSearchWorkPlace("");
      set_id(employee._id);

      // Set search values
      setEmployeeId(employee.employeeId);
      setWorkplace(employee.workplace);
      setPosition(employee.position);
      setSalary(employee.salary);
      setJobtype(employee.jobtype);
      setPrefix(employee.prefix);
      setName(employee.name);
      setLastName(employee.lastName);
      setNickName(employee.nickName);
      setGender(employee.gender === "male" ? "ชาย" : "หญิง");
      setFormattedDate(employee.dateOfBirth);

      // แยกวันเกิด
      if (employee.dateOfBirth) {
        const [d, m, y] = employee.dateOfBirth.split('/');
        setDay(d);
        setMonth(m);
        setYear(y);
      }

      // แยกวันที่เริ่มงาน
      if (employee.startjob) {
        setStartjob(employee.startjob);
        const [d, m, y] = employee.startjob.split('/');
        setStartJobDay(d);
        setStartJobMonth(m);
        setStartJobYear(y);
      }

      // แยกวันที่บรรจุ
      if (employee.exceptjob) {
        setExceptjob(employee.exceptjob);
        const [d, m, y] = employee.exceptjob.split('/');
        setExceptJobDay(d);
        setExceptJobMonth(m);
        setExceptJobYear(y);
      }

      setAge(employee.age);
      setIdCard(employee.idCard);
      setEthnicity(employee.ethnicity);
      setReligion(employee.religion);
      setMaritalStatus(employee.maritalStatus);
      setMilitaryStatus(employee.militaryStatus);
      setAddress(employee.address);
      setProvince(employee.province);
      setDistrict(employee.district);
      setSubDistrict(employee.subDistrict);
      setPostalCode(employee.postalCode);
      setHouseNumber(employee.houseNumber);
      setProvince2(employee.province2);
      setDistrict2(employee.district2);
      setSubDistrict2(employee.subDistrict2);
      setPostalCode2(employee.postalCode2);
      setHouseNumber2(employee.houseNumber2);
      setCopyAddress(employee.copyAddress);
      setCurrentAddress(employee.currentAddress);
      setPhoneNumber(employee.phoneNumber);
      setEmergencyContactNumber(employee.emergencyContactNumber);
      setEmergencyRelationship(employee.emergencyRelationship);
      setEmergencyName(employee.emergencyName);
      setIdLine(employee.idLine);
      setNewEmp(false);
      return;
    }

    // Original API search when using only basic fields
    const data = {
      employeeId: searchEmployeeId,
      name: searchFirstName || searchEmployeeName,
      idCard: searchIdCard,
      workPlace: "",
    };

    try {
      const response = await axios.post(endpoint + "/employee/search", data);
      setSearchResult(response.data.employees);
      // alert(response.data.employees.length);
      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId("");
        setName("");
        alert("ไม่พบข้อมูล");
      } else {
        // alert(response.data.employees.length);

        //clean form
        setSearchEmployeeId("");
        setSearchEmployeeName("");
        setSearchFirstName("");
        setSearchLastName("");
        setSearchIdCard("");
        setSearchPhone("");
        setSearchWorkPlace("");
        set_id(response.data.employees[0]._id);

        // Set search values
        setEmployeeId(response.data.employees[0].employeeId);
        setWorkplace(response.data.employees[0].workplace);

        setPosition(response.data.employees[0].position);
        setSalary(response.data.employees[0].salary);
        setJobtype(response.data.employees[0].jobtype);
        setPrefix(response.data.employees[0].prefix);

        setName(response.data.employees[0].name);
        setLastName(response.data.employees[0].lastName);
        setNickName(response.data.employees[0].nickName);
        // setGender(response.data.employees[0].gender);
        setGender(
          response.data.employees[0].gender === "male" ? "ชาย" : "หญิง"
        );

        // setDateOfBirth(response.data.employees[0].dateOfBirth);
        // const isoDate = response.data.employees[0].dateOfBirth;
        // Convert ISO date to JavaScript Date object
        // const dateObject = new Date(isoDate);
        // Set the formatted date to the state

        // setDateOfBirth(response.data.employees[0].dateObject);
        setFormattedDate(response.data.employees[0].dateOfBirth);

        // แยกวันเกิด
        if (response.data.employees[0].dateOfBirth) {
          const [d, m, y] = response.data.employees[0].dateOfBirth.split('/');
          setDay(d);
          setMonth(m);
          setYear(y);
        }

        // แยกวันที่เริ่มงาน
        if (response.data.employees[0].startjob) {
          setStartjob(response.data.employees[0].startjob);
          const [d, m, y] = response.data.employees[0].startjob.split('/');
          setStartJobDay(d);
          setStartJobMonth(m);
          setStartJobYear(y);
        }

        // แยกวันที่บรรจุ
        if (response.data.employees[0].exceptjob) {
          setExceptjob(response.data.employees[0].exceptjob);
          const [d, m, y] = response.data.employees[0].exceptjob.split('/');
          setExceptJobDay(d);
          setExceptJobMonth(m);
          setExceptJobYear(y);
        }

        // console.log("321",response.data.employees[0].dateObject);
        setAge(response.data.employees[0].age);
        setIdCard(response.data.employees[0].idCard);
        setEthnicity(response.data.employees[0].ethnicity);
        setReligion(response.data.employees[0].religion);
        setMaritalStatus(response.data.employees[0].maritalStatus);

        setMilitaryStatus(response.data.employees[0].militaryStatus);
        setAddress(response.data.employees[0].address);

        setProvince(response.data.employees[0].province);
        setDistrict(response.data.employees[0].district);
        setSubDistrict(response.data.employees[0].subDistrict);
        setPostalCode(response.data.employees[0].postalCode);
        setHouseNumber(response.data.employees[0].houseNumber);

        setProvince2(response.data.employees[0].province2);
        setDistrict2(response.data.employees[0].district2);
        setSubDistrict2(response.data.employees[0].subDistrict2);
        setPostalCode2(response.data.employees[0].postalCode2);
        setHouseNumber2(response.data.employees[0].houseNumber2);

        setCopyAddress(response.data.employees[0].copyAddress);
        setCurrentAddress(response.data.employees[0].currentAddress);
        setPhoneNumber(response.data.employees[0].phoneNumber);
        setEmergencyContactNumber(
          response.data.employees[0].emergencyContactNumber
        );
        setEmergencyRelationship(response.data.employees[0].emergencyRelationship);
        setEmergencyName(response.data.employees[0].emergencyName);
        setIdLine(response.data.employees[0].idLine);

        setNewEmp(false);

        // setSearchEmployeeId(response.data.employees[0].employeeId);
        // setSearchEmployeeName(response.data.employees[0].name);

        // console.log('workOfOT:', response.data.workplaces[0].workOfOT);
        // console.log('workOfOT:', endTime);
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
      // window.location.reload();
    }
  }

  // const deleteEmployee = async (employeeId) => {
  //     try {
  //         const response = await axios.delete(`http://your-api-url/delete/${employeeId}`);

  //         // Handle success
  //         console.log(response.data); // This will contain the success message and deleted employee details
  //     } catch (error) {
  //         // Handle error
  //         console.error('Error deleting employee:', error.message);
  //     }
  // };
  // const deleteEmployee = async (_id) => {
  //     try {
  //         const response = await axios.delete(`${endpoint}/employee/delete/${_id}`);

  //         // Handle success
  //         console.log(response.data); // This will contain the success message and deleted employee details
  //     } catch (error) {
  //         // Handle error
  //         console.error('Error deleting employee:', error.message);
  //     }
  // };

  // const handleDelete = async (_id) => {
  //     try {
  //         const response = await axios.delete(`${endpoint}/employee/delete_id/${_id}`);

  //         // Check the response status
  //         if (response.status === 200) {
  //             console.log('Employee deleted successfully:', response.data);
  //             setDeleted(true);
  //             // Optionally, update your UI or state after successful deletion
  //         } else {
  //             console.error('Error deleting employee:', response.data.error);
  //         }
  //     } catch (error) {
  //         console.error('Error deleting employee:', error.message);
  //     }
  //     alert('ทำการลบเรียบร้อย');
  //     window.location.reload();
  // };
  const handleDelete = async (_id) => {
    // Show confirmation dialog with SweetAlert2
    const result = await Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลพนักงานนี้?',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });

    // If user confirms, proceed with deletion
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${endpoint}/employee/delete_id/${_id}`
        );

        // Check the response status
        if (response.status === 200) {
          console.log("Employee deleted successfully:", response.data);
          setDeleted(true);

          Swal.fire({
            icon: 'success',
            title: 'ลบสำเร็จ!',
            text: 'ข้อมูลพนักงานถูกลบเรียบร้อยแล้ว',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#28a745'
          }).then(() => {
            window.location.reload();
          });
        } else {
          console.error("Error deleting employee:", response.data.error);

          Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถลบได้',
            text: 'เกิดข้อผิดพลาดในการลบข้อมูล',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
        }
      } catch (error) {
        console.error("Error deleting employee:", error.message);

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  useEffect(() => {
    // setNewEmp(true);
    if (employeeselection.length > 0) {
      setNewEmp(true);
    } else {
      setNewEmp(false);
    }
  }, [employeeselection]);

  useEffect(() => {
    const storedItem = localStorage.getItem("selectedEmployees");
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
      console.log("Item does not exist");
      setNewEmp(true);
    }
  }, []);
  useEffect(() => {
    // Listen for the custom event when selectedEmployees change in localStorage
    const handleSelectedEmployeesChange = (event) => {
      const { selectedEmployees } = event.detail;
      setStoredEmp(selectedEmployees);
    };

    window.addEventListener(
      "selectedEmployeesChanged",
      handleSelectedEmployeesChange
    );

    return () => {
      window.removeEventListener(
        "selectedEmployeesChanged",
        handleSelectedEmployeesChange
      );
    };
  }, []);

  //   console.log(workplaceList);

  /////////////////
  const [selectedOption, setSelectedOption] = useState("agencytime");

  return (
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">

          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            {/* <li class="breadcrumb-item"><a href="#"> ระบบเงินเดือน</a></li> */}
            <li class="breadcrumb-item active">ระบบจัดการพนักงาน</li> 
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ระบบจัดการพนักงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
<!-- Main content --> */}

          {/* Tab Navigation */}
          <div className="container-fluid" style={{ marginBottom: '20px' }}>
            <ul className="nav nav-tabs" role="tablist" style={{
              borderBottom: '2px solid #dee2e6'
            }}>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'createEdit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('createEdit')}
                  type="button"
                  style={{
                    border: 'none',
                    borderBottom: activeTab === 'createEdit' ? '3px solid #007bff' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTab === 'createEdit' ? '#007bff' : '#6c757d',
                    cursor: 'pointer',
                    padding: '12px 25px',
                    fontWeight: activeTab === 'createEdit' ? 'bold' : '500',
                    fontSize: '15px',
                    marginRight: '5px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== 'createEdit') {
                      e.target.style.color = '#007bff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== 'createEdit') {
                      e.target.style.color = '#6c757d';
                    }
                  }}
                >
                  <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                  ค้นหาพนักงาน
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab2')}
                  type="button"
                  style={{
                    border: 'none',
                    borderBottom: activeTab === 'tab2' ? '3px solid #007bff' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTab === 'tab2' ? '#007bff' : '#6c757d',
                    cursor: 'pointer',
                    padding: '12px 25px',
                    fontWeight: activeTab === 'tab2' ? 'bold' : '500',
                    fontSize: '15px',
                    marginRight: '5px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== 'tab2') {
                      e.target.style.color = '#007bff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== 'tab2') {
                      e.target.style.color = '#6c757d';
                    }
                  }}
                >
                  <i className="fas fa-user-circle" style={{ marginRight: '8px' }}></i>
                  ข้อมูลพนักงาน
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab3')}
                  type="button"
                  style={{
                    border: 'none',
                    borderBottom: activeTab === 'tab3' ? '3px solid #007bff' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTab === 'tab3' ? '#007bff' : '#6c757d',
                    cursor: 'pointer',
                    padding: '12px 25px',
                    fontWeight: activeTab === 'tab3' ? 'bold' : '500',
                    fontSize: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== 'tab3') {
                      e.target.style.color = '#007bff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== 'tab3') {
                      e.target.style.color = '#6c757d';
                    }
                  }}
                >
                  <i className="fas fa-money-bill" style={{ marginRight: '8px' }}></i>
                  เงินเดือน
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'tab4' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab4')}
                  type="button"
                  style={{
                    border: 'none',
                    borderBottom: activeTab === 'tab4' ? '3px solid #007bff' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTab === 'tab4' ? '#007bff' : '#6c757d',
                    cursor: 'pointer',
                    padding: '12px 25px',
                    fontWeight: activeTab === 'tab4' ? 'bold' : '500',
                    fontSize: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== 'tab4') {
                      e.target.style.color = '#007bff';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== 'tab4') {
                      e.target.style.color = '#6c757d';
                    }
                  }}
                >
                  <i className="fas fa-user-cog" style={{ marginRight: '8px' }}></i>
                  จัดการเวลาทำงาน
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {activeTab === 'createEdit' && (
            <section class="content">
              <div class="row">
                <div class="col-md-12">
                  <div class="container-fluid">
                    {/* <h2 class="title">ข้อมูลการลงเวลาทำงานของพนักงาน</h2> */}
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
                                                        {/* Row 1: รหัสพนักงาน | หน่วยงาน */}
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
                                                                        <i className="fas fa-building mr-1"></i>
                                                                        หน่วยงาน
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchWorkPlace" 
                                                                        placeholder="กรอกหน่วยงาน" 
                                                                        value={searchWorkPlace} 
                                                                        onChange={(e) => setSearchWorkPlace(e.target.value)} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Row 2: ชื่อ | นามสกุล */}
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-user mr-1"></i>
                                                                        ชื่อ
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchFirstName" 
                                                                        placeholder="กรอกชื่อ" 
                                                                        value={searchFirstName} 
                                                                        onChange={(e) => setSearchFirstName(e.target.value)} 
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-user mr-1"></i>
                                                                        นามสกุล
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchLastName" 
                                                                        placeholder="กรอกนามสกุล" 
                                                                        value={searchLastName} 
                                                                        onChange={(e) => setSearchLastName(e.target.value)} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Row 3: เบอร์โทรศัพท์ | หมายเลขบัตรประชาชน */}
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-phone mr-1"></i>
                                                                        เบอร์โทรศัพท์
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchPhoneNumber" 
                                                                        placeholder="กรอกเบอร์โทรศัพท์" 
                                                                        value={searchPhone} 
                                                                        onChange={(e) => setSearchPhone(e.target.value)}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(/\D/g, "");
                                                                        }} 
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="font-weight-bold">
                                                                        <i className="fas fa-id-card mr-1"></i>
                                                                        หมายเลขบัตรประชาชน
                                                                    </label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-lg" 
                                                                        id="searchIdCard" 
                                                                        placeholder="กรอกหมายเลขบัตรประชาชน" 
                                                                        value={searchIdCard} 
                                                                        onChange={(e) => setSearchIdCard(e.target.value)}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(/\D/g, "");
                                                                        }} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mt-4">
                                                            <button
                                                                className="btn btn-lg px-5 b_save"
                                                                style={{ 
                                                                  
                                                                    color: "white", 
                                                                    borderRadius: '50px', 
                                                                    border: 'none',
                                                                    padding: '10px 40px',
                                                                    fontSize: '1rem',
                                                                    fontWeight: '500',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                type="submit"
                                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                            >
                                                                <i className="fas fa-search mr-2 "></i>
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
                                                                        onClick={() => handleEmployeeSelectForTab2(employee)}
                                                                    >
                                                                        <i className="fas fa-user-circle text-primary mr-3 fa-2x"></i>
                                                                        <div>
                                                                            <h6 className="mb-1">รหัส: {employee.employeeId}</h6>
                                                                            <p className="mb-0 text-muted">ชื่อ: {employee.name} {employee.lastName}</p>
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
                    <form onSubmit={handleManageEmployee}>
                      <h2 class="title">ข้อมูลส่วนบุคคลพนักงาน</h2>
                      <div class="row">
                        <div class="col-md-12">
                          <section class="Frame">
                            <div class="col-md-12">
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="prefix">รหัส <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <input
                                      required
                                      type="number"
                                      class="form-control"
                                      id="employeeId"
                                      placeholder="รหัสพนักงาน"
                                      value={employeeId}
                                      onChange={(e) =>
                                        setEmployeeId(e.target.value)
                                      }
                                      style={{ appearance: "textfield" }}
                                    />
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="name">หน่วยงาน <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <input
                                      required
                                      type="text"
                                      id="workplace"
                                      name="workplace"
                                      list="workplaces"
                                      className="form-control"
                                      value={workplace}
                                      onChange={handleWorkplace}
                                    />
                                    {/* workplaceList */}
                                    <datalist id="workplaces">
                                      <option value="">ยังไม่ระบุหน่วยงาน</option>
                                      {workplaceSelection.map((wp) => (
                                        <option
                                          key={wp._id}
                                          value={wp.workplaceId}
                                        >
                                          {wp.workplaceName}
                                        </option>
                                      ))}
                                    </datalist>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="lastName">ตำแหน่ง <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <input
                                      required
                                      type="text"
                                      class="form-control"
                                      id="position"
                                      placeholder="ตำแหน่ง"
                                      value={position}
                                      onChange={(e) =>
                                        setPosition(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="prefix">เงินจ้าง</label>
                                    <input
                                      type="text"
                                      name="salary"
                                      class="form-control"
                                      id="name"
                                      placeholder="เงินจ้าง"
                                      value={salary}
                                      onChange={(e) => setSalary(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="name">ประเภทการจ้าง <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    {/* <input type="text" name="jobtype" class="form-control" id="jobtype" placeholder="ประเภทการจ้าง"  /> */}
                                    <select
                                      required
                                      name="jobtype"
                                      className="form-control"
                                      value={jobtype}
                                      onChange={(e) => setJobtype(e.target.value)}
                                    >
                                      {/* <option value="">เลือกวัน</option>
                                    <option value="daily">รายวัน</option>
                                    <option value="monthly">รายเดือน</option> */}
                                      <option value="">ไม่ระบุ</option>
                                      {/* <option value="ประจำ">ประจำ</option>
                                    <option value="ไม่ประจำ">ไม่ประจำ</option>
                                    <option value="รายวัน">รายวัน</option>
                                    <option value="รายครั้ง">รายครั้ง</option> */}
                                      <option value="รายวัน">รายวัน</option>
                                      <option value="รายเดือน">รายเดือน</option>
                                      <option value="รายครั้ง">รายครั้ง</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="prefix">คำนำหน้า <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    {/* <input
                                    required
                                    type="text"
                                    name="prefix"
                                    class="form-control"
                                    id="name"
                                    placeholder="คำนำหน้า"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                  /> */}
                                    <select
                                      required
                                      name="prefix"
                                      id="prefix"
                                      class="form-control"
                                      value={prefix}
                                      onChange={handlePrefix}
                                    >
                                      <option value="">ระบุ</option>
                                      <option value="นาย">นาย</option>
                                      <option value="นาง">นาง</option>
                                      <option value="นางสาว">นางสาว</option>
                                      <option value="Mr.">Mr.</option>
                                      <option value="Mrs.">Mrs.</option>
                                      <option value="Miss">Miss</option>
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="name">ชื่อ <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <input
                                      required
                                      type="text"
                                      name="name"
                                      class="form-control"
                                      id="name"
                                      placeholder="ชื่อ"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="lastName">นามสกุล <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    <input
                                      required
                                      type="text"
                                      name="lastName"
                                      class="form-control"
                                      id="lastName"
                                      placeholder="นามสกุล"
                                      value={lastName}
                                      onChange={(e) =>
                                        setLastName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="nickName">ชื่อเล่น</label>
                                    <input
                                      type="text"
                                      name="nickName"
                                      class="form-control"
                                      id="nickName"
                                      placeholder="ชื่อเล่น"
                                      value={nickName}
                                      onChange={(e) =>
                                        setNickName(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  <label role="dateOfBirth">เพศ</label>
                                </div>

                                <div class="col-md-3">
                                  <label role="dateOfBirth">วันเดือนปีเกิด <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                </div>
                                <div class="col-md-3">
                                  <label role="dateOfBirth">อายุ</label>
                                </div>
                                {/* <div class="col-md-2">
                                <label role="dateOfBirth">ปีเกิด</label>
                              </div> */}
                                <div class="col-md-3">
                                  {" "}
                                  <label role="age">เลขบัตรประจำตัวประชาชน <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <select
                                      name="gender"
                                      id="gender"
                                      class="form-control"
                                      value={gender}
                                      onChange={handleGender}
                                    >
                                      <option value="">ระบุ</option>
                                      <option value="ชาย">ชาย</option>
                                      <option value="หญิง">หญิง</option>
                                    </select>
                                  </div>
                                </div>

                                {/* <div class="col-md-2">
                                <div class="form-group">
                        
                                  <select
                                    name="day"
                                    className="form-control mr-1"
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                  >
                                    <option value="">วัน</option>
                                    {days.map((d) => (
                                      <option key={d} value={d}>
                                        {d}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-2">
                                <select
                                  name="month"
                                  className="form-control mr-1"
                                  value={month}
                                  onChange={(e) => setMonth(e.target.value)}
                                >
                                  <option value="">เดือน</option>
                                  {months.map((m) => (
                                    <option key={m} value={m}>
                                      {m}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div class="col-md-2">
                                <select
                                  name="year"
                                  className="form-control"
                                  value={year}
                                  onChange={(e) => setYear(e.target.value)}
                                >
                                  <option value="">ปี</option>
                                  {years.map((y) => (
                                    <option key={y} value={y + 543}>
                                      {y + 543}
                                    </option>
                                  ))}
                                </select>
                              </div> */}
                                <div className="col-md-3">
                                  <div className="form-group">
                                    {/* <label htmlFor="date">วันเกิด</label> */}
                                    <input
                                      required
                                      type="text"
                                      className="form-control"
                                      value={formattedDate}
                                      placeholder="dd/mm/yyyy"
                                      readOnly
                                      onClick={() => setShowPopup(true)}
                                    />
                                    {showPopup && (
                                      <div
                                        className="date-popup"
                                        style={popupStyle}
                                      >
                                        <div className="row">
                                          <div className="col-md-4">วัน</div>
                                          <div className="col-md-4">เดือน</div>
                                          <div className="col-md-4">ปี</div>
                                        </div>
                                        <div className="row">
                                          <div className="col-md-4">
                                            <select
                                              name="day"
                                              className="form-control mr-1"
                                              value={day}
                                              onChange={(e) =>
                                                setDay(e.target.value)
                                              }
                                            >
                                              <option value="">วัน</option>
                                              {days.map((d) => (
                                                <option key={d} value={d}>
                                                  {d}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="col-md-4">
                                            <select
                                              name="month"
                                              className="form-control mr-1"
                                              value={month}
                                              onChange={(e) =>
                                                setMonth(e.target.value)
                                              }
                                            >
                                              <option value="">เดือน</option>
                                              {months.map((m) => (
                                                <option key={m} value={m}>
                                                  {m}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="col-md-4">
                                            <select
                                              name="year"
                                              className="form-control"
                                              value={year}
                                              onChange={(e) =>
                                                setYear(e.target.value)
                                              }
                                            >
                                              <option value="">ปี</option>
                                              {years.map((y) => (
                                                <option key={y} value={y + 543}>
                                                  {y + 543}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                        <button
                                          onClick={handleDateChange}
                                          className="btn btn-primary mt-2"
                                        >
                                          ตกลง
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    {/* <label role="age">อายุ</label> */}
                                    <input
                                      type="text"
                                      name="age"
                                      class="form-control"
                                      id="age"
                                      placeholder="อายุ"
                                      value={age}
                                      onChange={(e) => setAge(e.target.value)}
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    {/* <label role="idCard">
                                    เลขบัตรประจำตัวประชาชน
                                  </label> */}
                                    <input
                                      required
                                      type="text"
                                      name="idCard"
                                      class="form-control"
                                      id="idCard"
                                      placeholder="เลขบัตรประจำตัวประชาชน"
                                      value={idCard}
                                      onChange={(e) => setIdCard(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="row"></div>
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="ethnicity">เชื้อชาติ <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    {/* <input
                                    type="text"
                                    name="ethnicity"
                                    class="form-control"
                                    id="ethnicity"
                                    placeholder="เชื้อชาติ"
                                    value={ethnicity}
                                    onChange={(e) =>
                                      setEthnicity(e.target.value)
                                    }
                                  /> */}
                                    <select
                                      required
                                      name="ethnicity"
                                      id="ethnicity"
                                      class="form-control"
                                      value={ethnicity}
                                      onChange={handleEthnicity}
                                    >
                                      <option value="">ระบุ</option>
                                      <option value="ไทย">ไทย</option>
                                      <option value="พม่า">พม่า</option>
                                      <option value="ลาว">ลาว</option>
                                      <option value="กัมพูชา">กัมพูชา</option>
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="religion">ศาสนา <span style={{ color: 'red', fontWeight: 'bold' }}>*</span></label>
                                    {/* <input
                                    type="text"
                                    name="religion"
                                    class="form-control"
                                    id="religion"
                                    placeholder="ศาสนา"
                                    value={religion}
                                    onChange={(e) =>
                                      setReligion(e.target.value)
                                    }
                                  /> */}
                                    <select
                                      required
                                      name="religion"
                                      id="religion"
                                      class="form-control"
                                      value={religion}
                                      onChange={handleReligion}
                                    >
                                      <option value="">ระบุ</option>
                                      <option value="ไทย">พุทธ</option>
                                      <option value="พม่า">คริสต์</option>
                                      <option value="ลาว">อิสลาม</option>
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="maritalStatus">
                                      สถานภาพการสมรส <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                    </label>
                                    {/* <input
                                    required
                                    type="text"
                                    name="maritalStatus"
                                    class="form-control"
                                    id="maritalStatus"
                                    placeholder="สถานภาพการสมรส"
                                    value={maritalStatus}
                                    onChange={(e) =>
                                      setMaritalStatus(e.target.value)
                                    }
                                  /> */}
                                    <select
                                      required
                                      name="maritalStatus"
                                      id="maritalStatus"
                                      class="form-control"
                                      value={maritalStatus}
                                      onChange={handleMaritalStatus}
                                    >
                                      <option value="">ระบุ</option>
                                      <option value="โสด">โสด</option>
                                      <option value="แต่งงานและอยู่ด้วยกัน">
                                        แต่งงานและอยู่ด้วยกัน
                                      </option>
                                      <option value="แต่งงานแต่ไม่ได้อยู่ด้วยกัน">
                                        แต่งงานแต่ไม่ได้อยู่ด้วยกัน
                                      </option>
                                      <option value="ไม่แต่งงานแต่อยู่ด้วยกัน">
                                        ไม่แต่งงานแต่อยู่ด้วยกัน
                                      </option>
                                      <option value="หม้าย">หม้าย</option>
                                      <option value="หย่าร้าง/แยกทาง/เลิกกัน">
                                        หย่าร้าง/แยกทาง/เลิกกัน
                                      </option>
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="militaryStatus">
                                      สถานภาพทางการทหาร
                                    </label>
                                    <select
                                      name="militaryStatus"
                                      id="militaryStatus"
                                      class="form-control"
                                      value={militaryStatus}
                                      onChange={handleMilitaryStatus}
                                    >
                                      <option value="ยกเว้นการเกณฑ์ทหาร">
                                        ยกเว้นการเกณฑ์ทหาร
                                      </option>
                                      <option value="ผ่านการเกณฑ์ทหารแล้ว">
                                        ผ่านการเกณฑ์ทหารแล้ว
                                      </option>
                                      <option value="ไม่ผ่านการเกณฑ์ทหาร">
                                        ไม่ผ่านการเกณฑ์ทหาร
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-12">
                                  <div class="form-group">
                                    <label role="address">
                                      ที่อยู่ตามบัตรประชาชน <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                    </label>
                                    <textarea
                                      required
                                      name="address"
                                      id="address"
                                      class="form-control"
                                      rows="3"
                                      value={address}
                                      onChange={(e) => setAddress(e.target.value)}
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  {/* <div class="form-group">
                                  <label role="address">
                                    ที่อยู่ตามบัตรประชาชน
                                  </label>
                                  <textarea
                                    name="address"
                                    id="address"
                                    class="form-control"
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                  ></textarea>
                                </div> */}
                                  <div>
                                    <label htmlFor="province">จังหวัด </label>
                                    <select
                                      id="province"
                                      value={province}
                                      onChange={(e) =>
                                        setProvince(e.target.value)
                                      }
                                      class="form-control"
                                    >
                                      {/* <option value="">Select Province</option>
                                    {Object.keys(locationData).map((prov) => (
                                      <option key={prov} value={prov}>
                                        {prov}
                                      </option>
                                    ))} */}
                                      <option value="">Select Province</option>
                                      {provincesData.map((prov) => (
                                        <option key={prov.id} value={prov.id}>
                                          {prov.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="district">อำเภอ </label>
                                    <select
                                      id="district"
                                      value={district}
                                      onChange={(e) =>
                                        setDistrict(e.target.value)
                                      }
                                      disabled={!province}
                                      class="form-control"
                                    >
                                      {/* <option value="">Select District</option>
                                    {districtOptions.map((dist) => (
                                      <option key={dist} value={dist}>
                                        {dist}
                                      </option>
                                    ))} */}
                                      <option value="">Select District</option>
                                      {districtOptions.map((dist) => (
                                        <option key={dist.id} value={dist.id}>
                                          {dist.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="subDistrict">ตำบล </label>
                                    <select
                                      id="subDistrict"
                                      value={subDistrict}
                                      onChange={(e) =>
                                        setSubDistrict(e.target.value)
                                      }
                                      disabled={!district}
                                      class="form-control"
                                    >
                                      {/* <option value="">
                                      Select Sub-District
                                    </option>
                                    {subDistrictOptions.map((subDist) => (
                                      <option key={subDist} value={subDist}>
                                        {subDist}
                                      </option>
                                    ))} */}
                                      <option value="">
                                        Select Sub-District
                                      </option>
                                      {subDistrictOptions.map((subDist) => (
                                        <option
                                          key={subDist.id}
                                          value={subDist.id}
                                        >
                                          {subDist.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="subDistrict">
                                      เลขไปรษณีย์{" "}
                                    </label>
                                    <div class="form-group">
                                      {/* <label role="idCard">
                                    เลขบัตรประจำตัวประชาชน
                                  </label> */}
                                      <input
                                        // required
                                        type="text"
                                        name="postalCode"
                                        class="form-control"
                                        id="postalCode"
                                        placeholder="เลขไปรษณีย์"
                                        value={postalCode}
                                        onChange={(e) =>
                                          setPostalCode(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* <div class="col-md-6">
                                <div class="form-group">
                                  <label role="currentAddress">
                                    ที่อยู่ปัจจุบัน
                                  </label>
                                  <div class="icheck-primary d-inline">
                                    <input
                                      type="checkbox"
                                      checked={copyAddress}
                                      id=""
                                      name="radio1"
                                      onChange={handleCheckboxChange}
                                    />{" "}
                                    ใช้ที่อยู่ตามบัตรประชาชน
                                  </div>
                                  <textarea
                                    name="currentAddress"
                                    id="currentAddress"
                                    class="form-control"
                                    rows="3"
                                    value={currentAddress}
                                    onChange={(e) =>
                                      setCurrentAddress(e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div> */}
                              </div>
                              <div class="row">
                                {/* <div class="col-md-3">
                            <div>
                              <label htmlFor="subDistrict">บ้านเลขที่-หมู่</label>
                              <div class="form-group">
                                <input
                                  // required
                                  type="text"
                                  name="postalCode2"
                                  class="form-control"
                                  id="postalCode2"
                                  placeholder="เลขไปรษณีย์"
                                  value={houseNumber}
                                  onChange={(e) =>
                                    setHouseNumber(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div> */}
                              </div>
                              <div>
                                <input
                                  type="checkbox"
                                  id="copyCheckbox"
                                  checked={isChecked}
                                  onChange={handleCheckboxToggle}
                                />
                                <label htmlFor="copyCheckbox">
                                  ใช้ที่อยู่ตามบัตรประชาชน
                                </label>
                              </div>
                              <div class="row">
                                <div class="col-md-12">
                                  <div class="form-group">
                                    <label role="address">
                                      ที่อยู่ปัจจุบัน <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>
                                    </label>
                                    <textarea
                                      required
                                      name="address"
                                      id="address"
                                      class="form-control"
                                      rows="3"
                                      value={currentAddress}
                                      // onChange={(e) => setAddress(e.target.value)}
                                      onChange={(e) =>
                                        setCurrentAddress(e.target.value)
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  {/* <div class="form-group">
                                  <label role="address">
                                    ที่อยู่ตามบัตรประชาชน
                                  </label>
                                  <textarea
                                    name="address"
                                    id="address"
                                    class="form-control"
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                  ></textarea>
                                </div> */}
                                  <div>
                                    <label htmlFor="province">จังหวัด </label>
                                    <select
                                      id="province2"
                                      value={province2}
                                      onChange={(e) =>
                                        setProvince2(e.target.value)
                                      }
                                      class="form-control"
                                    >
                                      {/* <option value="">Select Province</option>
                                    {Object.keys(locationData).map((prov) => (
                                      <option key={prov} value={prov}>
                                        {prov}
                                      </option> */}
                                      <option value="">Select Province</option>
                                      {provincesData.map((prov) => (
                                        <option key={prov.id} value={prov.id}>
                                          {prov.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="district">อำเภอ </label>
                                    <select
                                      id="district2"
                                      value={district2}
                                      onChange={(e) =>
                                        setDistrict2(e.target.value)
                                      }
                                      disabled={!province2}
                                      class="form-control"
                                    >
                                      {/* <option value="">Select District</option>
                                    {districtOptions.map((dist) => (
                                      <option key={dist} value={dist}>
                                        {dist}
                                      </option>
                                    ))} */}
                                      <option value="">Select District</option>
                                      {districtOptions2.map((dist) => (
                                        <option key={dist.id} value={dist.id}>
                                          {dist.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="subDistrict">ตำบล </label>
                                    <select
                                      id="subDistrict"
                                      value={subDistrict2}
                                      onChange={(e) =>
                                        setSubDistrict2(e.target.value)
                                      }
                                      disabled={!district2}
                                      class="form-control"
                                    >
                                      {/* <option value="">
                                      Select Sub-District
                                    </option>
                                    {subDistrictOptions.map((subDist) => (
                                      <option key={subDist} value={subDist}>
                                        {subDist}
                                      </option>
                                    ))} */}
                                      <option value="">
                                        Select Sub-District
                                      </option>
                                      {subDistrictOptions2.map((subDist) => (
                                        <option
                                          key={subDist.id}
                                          value={subDist.id}
                                        >
                                          {subDist.name_th}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div>
                                    <label htmlFor="subDistrict">
                                      เลขไปรษณีย์{" "}
                                    </label>
                                    <div class="form-group">
                                      {/* <label role="idCard">
                                    เลขบัตรประจำตัวประชาชน
                                  </label> */}
                                      <input
                                        // required
                                        type="text"
                                        name="postalCode2"
                                        class="form-control"
                                        id="postalCode2"
                                        placeholder="เลขไปรษณีย์"
                                        value={postalCode2}
                                        onChange={(e) =>
                                          setPostalCode2(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                {/* <div class="col-md-3">
                            <div>
                              <label htmlFor="subDistrict">บ้านเลขที่-หมู่</label>
                              <div class="form-group">
                                <input
                                  // required
                                  type="text"
                                  name="postalCode2"
                                  class="form-control"
                                  id="postalCode2"
                                  placeholder="เลขไปรษณีย์"
                                  value={houseNumber2}
                                  onChange={(e) =>
                                    setHouseNumber2(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div> */}
                              </div>
                              <br />
                              {/* <!--row--> */}
                              <div class="row">
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="phoneNumber">
                                      เบอร์โทรศัพท์
                                    </label>
                                    <input
                                      type="text"
                                      name="phoneNumber"
                                      class="form-control"
                                      id="phoneNumber"
                                      placeholder="เบอร์โทรศัพท์"
                                      value={phoneNumber}
                                      onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="form-group">
                                    <label role="idLine">ไอดีไลน์</label>
                                    <input
                                      type="text"
                                      name="idLine"
                                      class="form-control"
                                      id="idLine"
                                      placeholder="ไอดีไลน์"
                                      value={idLine}
                                      onChange={(e) => setIdLine(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <br />
                                <div class="col-md-3">

                                </div>


                              </div>
                              <div className="row">
                                <div class="form-group col-md-3">
                                  <label role="emergencyName">
                                    ผู้ติดต่อฉุกเฉิน
                                  </label>
                                  <input
                                    // required
                                    type="text"
                                    name="emergencyName"
                                    class="form-control"
                                    id="emergencyName"
                                    placeholder="ผู้ติดต่อฉุกเฉิน"
                                    value={emergencyName}
                                    onChange={(e) =>
                                      setEmergencyName(e.target.value)
                                    }
                                  />
                                </div>
                                <div class="form-group col-md-3">
                                  <label role="emergencyContactNumber">
                                    เบอร์ติดต่อกรณีฉุกเฉิน
                                  </label>
                                  <input
                                    // required
                                    type="text"
                                    name="emergencyContactNumber"
                                    class="form-control"
                                    id="emergencyContactNumber"
                                    placeholder="เบอร์ติดต่อกรณีฉุกเฉิน"
                                    value={emergencyContactNumber}
                                    onChange={(e) =>
                                      setEmergencyContactNumber(e.target.value)
                                    }
                                  />
                                </div>
                                <div class="form-group col-md-3">
                                  <label role="emergencyRelationship">
                                    ความสัมพันธ์
                                  </label>
                                  <select
                                    // required
                                    name="emergencyRelationship"
                                    class="form-control"
                                    id="emergencyRelationship"
                                    value={emergencyRelationship}
                                    onChange={(e) =>
                                      setEmergencyRelationship(e.target.value)
                                    }
                                  >
                                    <option value="">เลือกความสัมพันธ์</option>
                                    <option value="คู่สมรส">คู่สมรส</option>
                                    <option value="บิดา">บิดา</option>
                                    <option value="มารดา">มารดา</option>
                                    <option value="บุตร">บุตร</option>
                                    <option value="เพื่อน">เพื่อน</option>
                                    <option value="พี่น้อง">พี่น้อง</option>
                                  </select>
                                </div>



                              </div>
                            </div>
                            {/* <!--col-md-12--> */}
                          </section>
                          {/* <!--Frame--> */}
                        </div>
                      </div>

                      <div class="form-group">
                        {newEmp ? (
                          <button
                            type="submit"
                            name="save"
                            value="create"
                            onClick={() => setButtonValue("create")}
                            class="btn b_save"
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                          >
                            {isLoading ? (
                              <>
                                <i class="fas fa-spinner fa-spin"></i> &nbsp;กำลังบันทึก...
                              </>
                            ) : (
                              <>
                                <i class="nav-icon fas fa-save"></i> &nbsp;สร้างพนักงานใหม่
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="submit"
                            name="save"
                            value="save"
                            onClick={() => setButtonValue("save")}
                            class="btn b_save"
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                          >
                            {isLoading ? (
                              <>
                                <i class="fas fa-spinner fa-spin"></i> &nbsp;กำลังอัปเดต...
                              </>
                            ) : (
                              <>
                                <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                              </>
                            )}
                          </button>
                        )}
                        <button class="btn clean" disabled={isLoading} style={{ opacity: isLoading ? 0.6 : 1 }}>
                          <i class="far fa-window-close"></i> &nbsp;ยกเลิก
                        </button>{" "}
                      </div>
                    </form>
                    {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="date">วันเกิด</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formattedDate}
                        placeholder="dd/mm/yyyy"
                        readOnly
                        onClick={() => setShowPopup(true)}
                      />
                      {showPopup && (
                        <div className="date-popup" style={popupStyle}>
                          <div className="row">
                            <div className="col-md-4">
                              <select
                                name="day"
                                className="form-control mr-1"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                              >
                                <option value="">วัน</option>
                                {days.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                name="month"
                                className="form-control mr-1"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                              >
                                <option value="">เดือน</option>
                                {months.map((m) => (
                                  <option key={m} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                name="year"
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                              >
                                <option value="">ปี</option>
                                {years.map((y) => (
                                  <option key={y} value={y + 543}>
                                    {y + 543}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={handleDateChange}
                            className="btn btn-primary mt-2"
                          >
                            ตกลง
                          </button>
                        </div>
                      )}
                    </div>
                  </div> */}

                    {/* ///////////////////////////// */}
                  </div>
                </div>
              </div>
              {/* <!-- /.container-fluid --> */}
            </section>
          )}

          {/* Tab 2 Content - Employee Component */}
          {activeTab === 'tab2' && (
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <form onSubmit={handleManageEmployee}>
                      <h2 className="title">ข้อมูลพนักงาน</h2>

                      {/* Section 1: ข้อมูลการทำงาน */}
                      <section className="Frame">
                        <div className="col-md-12">
                          <h3 className="title " style={{ fontSize: '18px', marginBottom: '20px', color: 'rgb(43,93,142)' }}>
                            <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
                            ข้อมูลการทำงาน
                          </h3>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>รหัสพนักงาน <span style={{ color: 'red' }}>*</span></label>
                                <input
                                  required
                                  type="number"
                                  className="form-control"
                                  placeholder="รหัสพนักงาน"
                                  value={employeeId}
                                  onChange={(e) => setEmployeeId(e.target.value)}
                                  style={{ appearance: "textfield" }}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>หน่วยงาน <span style={{ color: 'red' }}>*</span></label>
                                <input
                                  required
                                  type="text"
                                  list="workplaces"
                                  className="form-control"
                                  value={workplace}
                                  onChange={handleWorkplace}
                                />
                                <datalist id="workplaces">
                                  <option value="">ยังไม่ระบุหน่วยงาน</option>
                                  {workplaceSelection.map((wp) => (
                                    <option key={wp._id} value={wp.workplaceId}>
                                      {wp.workplaceName}
                                    </option>
                                  ))}
                                </datalist>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>ตำแหน่ง <span style={{ color: 'red' }}>*</span></label>
                                <input
                                  required
                                  type="text"
                                  className="form-control"
                                  placeholder="ตำแหน่ง"
                                  value={position}
                                  onChange={(e) => setPosition(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>แผนก</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="แผนก"
                                  value={department}
                                  onChange={(e) => setDepartment(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>ประเภทการจ้าง</label>
                                <select
                                  className="form-control"
                                  value={jobtype}
                                  onChange={(e) => setJobtype(e.target.value)}
                                >
                                  <option value="">เลือกประเภทการจ้าง</option>
                                  <option value="รายวัน">รายวัน</option>
                                  <option value="รายเดือน">รายเดือน</option>
                                  <option value="พนักงานประจำ">พนักงานประจำ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>วันที่เริ่มงาน</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="dd/mm/yyyy"
                                  value={startjob}
                                  readOnly
                                  onClick={() => setShowStartJobPopup(true)}
                                />
                                {showStartJobPopup && (
                                  <div
                                    ref={startJobPopupRef}
                                    className="date-popup"
                                    style={popupStyle}
                                  >
                                    <div className="row">
                                      <div className="col-md-4">วัน</div>
                                      <div className="col-md-4">เดือน</div>
                                      <div className="col-md-4">ปี</div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={startJobDay}
                                          onChange={(e) => setStartJobDay(e.target.value)}
                                        >
                                          <option value="">วัน</option>
                                          {days.map((d) => (
                                            <option key={d} value={d}>
                                              {d}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={startJobMonth}
                                          onChange={(e) => setStartJobMonth(e.target.value)}
                                        >
                                          <option value="">เดือน</option>
                                          {months.map((m) => (
                                            <option key={m} value={m}>
                                              {m}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={startJobYear}
                                          onChange={(e) => setStartJobYear(e.target.value)}
                                        >
                                          <option value="">ปี</option>
                                          {years.map((y) => (
                                            <option key={y} value={y + 543}>
                                              {y + 543}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="row mt-2">
                                      <div className="col-md-12">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-block"
                                          onClick={handleStartJobDateChange}
                                        >
                                          ตกลง
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>วันที่บรรจุ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="dd/mm/yyyy"
                                  value={exceptjob}
                                  readOnly
                                  onClick={() => setShowExceptJobPopup(true)}
                                />
                                {showExceptJobPopup && (
                                  <div
                                    ref={exceptJobPopupRef}
                                    className="date-popup"
                                    style={popupStyle}
                                  >
                                    <div className="row">
                                      <div className="col-md-4">วัน</div>
                                      <div className="col-md-4">เดือน</div>
                                      <div className="col-md-4">ปี</div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={exceptJobDay}
                                          onChange={(e) => setExceptJobDay(e.target.value)}
                                        >
                                          <option value="">วัน</option>
                                          {days.map((d) => (
                                            <option key={d} value={d}>
                                              {d}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={exceptJobMonth}
                                          onChange={(e) => setExceptJobMonth(e.target.value)}
                                        >
                                          <option value="">เดือน</option>
                                          {months.map((m) => (
                                            <option key={m} value={m}>
                                              {m}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          className="form-control"
                                          value={exceptJobYear}
                                          onChange={(e) => setExceptJobYear(e.target.value)}
                                        >
                                          <option value="">ปี</option>
                                          {years.map((y) => (
                                            <option key={y} value={y + 543}>
                                              {y + 543}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="row mt-2">
                                      <div className="col-md-12">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-block"
                                          onClick={handleExceptJobDateChange}
                                        >
                                          ตกลง
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>วันที่ลาออก</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="dd/mm/yyyy"
                                  value={endjob}
                                  onChange={(e) => setEndjob(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Section 2: ข้อมูลส่วนบุคคล */}
                      <section className="Frame">
                        <div className="col-md-12">
                          <h3 className="title" style={{ fontSize: '18px', marginBottom: '20px', color: 'rgb(43,93,142)' }}>
                            <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                            ข้อมูลส่วนบุคคล
                          </h3>
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>คำนำหน้า</label>
                                <select
                                  className="form-control"
                                  value={prefix}
                                  onChange={handlePrefix}
                                >
                                  <option value="">ระบุ</option>
                                  <option value="นาย">นาย</option>
                                  <option value="นาง">นาง</option>
                                  <option value="นางสาว">นางสาว</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>ชื่อ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ชื่อ"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>นามสกุล</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="นามสกุล"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>ชื่อเล่น</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ชื่อเล่น"
                                  value={nickName}
                                  onChange={(e) => setNickName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>เพศ</label>
                                <select
                                  className="form-control"
                                  value={gender}
                                  onChange={handleGender}
                                >
                                  <option value="">เลือกเพศ</option>
                                  <option value="ชาย">ชาย</option>
                                  <option value="หญิง">หญิง</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>วัน/เดือน/ปีเกิด</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="dd/mm/yyyy"
                                  value={formattedDate}
                                  readOnly
                                  onClick={() => setShowPopup(true)}
                                />
                                {showPopup && (
                                  <div
                                    ref={popupRef}
                                    className="date-popup"
                                    style={popupStyle}
                                  >
                                    <div className="row">
                                      <div className="col-md-4">วัน</div>
                                      <div className="col-md-4">เดือน</div>
                                      <div className="col-md-4">ปี</div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <select
                                          name="day"
                                          className="form-control mr-1"
                                          value={day}
                                          onChange={(e) => setDay(e.target.value)}
                                        >
                                          <option value="">วัน</option>
                                          {days.map((d) => (
                                            <option key={d} value={d}>
                                              {d}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          name="month"
                                          className="form-control mr-1"
                                          value={month}
                                          onChange={(e) => setMonth(e.target.value)}
                                        >
                                          <option value="">เดือน</option>
                                          {months.map((m) => (
                                            <option key={m} value={m}>
                                              {m}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="col-md-4">
                                        <select
                                          name="year"
                                          className="form-control"
                                          value={year}
                                          onChange={(e) => setYear(e.target.value)}
                                        >
                                          <option value="">ปี</option>
                                          {years.map((y) => (
                                            <option key={y} value={y + 543}>
                                              {y + 543}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="row mt-2">
                                      <div className="col-md-12">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-block"
                                          onClick={handleDateChange}
                                        >
                                          ตกลง
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>อายุ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="อายุ"
                                  value={age}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>เลขบัตรประชาชน</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="เลขบัตรประชาชน"
                                  value={idCard}
                                  onChange={(e) => setIdCard(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>เชื้อชาติ</label>
                                <select
                                  className="form-control"
                                  value={ethnicity}
                                  onChange={handleEthnicity}
                                >
                                  <option value="">เลือกเชื้อชาติ</option>
                                  <option value="ไทย">ไทย</option>
                                  <option value="จีน">จีน</option>
                                  <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-group">
                                <label>ศาสนา</label>
                                <select
                                  className="form-control"
                                  value={religion}
                                  onChange={handleReligion}
                                >
                                  <option value="">เลือกศาสนา</option>
                                  <option value="พุทธ">พุทธ</option>
                                  <option value="คริสต์">คริสต์</option>
                                  <option value="อิสลาม">อิสลาม</option>
                                  <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>สถานภาพการสมรส</label>
                                <select
                                  className="form-control"
                                  value={maritalStatus}
                                  onChange={handleMaritalStatus}
                                >
                                  <option value="">เลือกสถานภาพ</option>
                                  <option value="โสด">โสด</option>
                                  <option value="สมรส">สมรส</option>
                                  <option value="หย่า">หย่า</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>สถานภาพทางทหาร</label>
                                <select
                                  className="form-control"
                                  value={militaryStatus}
                                  onChange={handleMilitaryStatus}
                                >
                                  <option value="">เลือกสถานภาพ</option>
                                  <option value="ผ่านการเกณฑ์ทหาร">ผ่านการเกณฑ์ทหาร</option>
                                  <option value="ยังไม่ผ่านการเกณฑ์ทหาร">ยังไม่ผ่านการเกณฑ์ทหาร</option>
                                  <option value="ได้รับการยกเว้น">ได้รับการยกเว้น</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Section 3: ที่อยู่ */}
                      <section className="Frame">
                        <div className="col-md-12">
                          <h3 className="title" style={{ fontSize: '18px', marginBottom: '20px', color: 'rgb(43,93,142)' }}>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                            ที่อยู่
                          </h3>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>ที่อยู่ตามบัตรประชาชน</label>
                                <textarea
                                  className="form-control"
                                  rows="2"
                                  placeholder="ที่อยู่ตามบัตรประชาชน"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>จังหวัด</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="จังหวัด"
                                  value={province}
                                  onChange={(e) => setProvince(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>อำเภอ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="อำเภอ"
                                  value={district}
                                  onChange={(e) => setDistrict(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>ตำบล</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ตำบล"
                                  value={subDistrict}
                                  onChange={(e) => setSubDistrict(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label>รหัสไปรษณีย์</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="รหัสไปรษณีย์"
                                  value={postalCode}
                                  onChange={(e) => setPostalCode(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>ที่อยู่ปัจจุบัน</label>
                                <textarea
                                  className="form-control"
                                  rows="2"
                                  placeholder="ที่อยู่ปัจจุบัน"
                                  value={currentAddress}
                                  onChange={(e) => setCurrentAddress(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Section 4: ข้อมูลติดต่อ */}
                      <section className="Frame">
                        <div className="col-md-12">
                          <h3 className="title" style={{ fontSize: '18px', marginBottom: '20px', color: 'rgb(43,93,142)' }}>
                            <i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                            ข้อมูลติดต่อ
                          </h3>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>เบอร์โทรศัพท์</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="เบอร์โทรศัพท์"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>ไอดีไลน์</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ไอดีไลน์"
                                  value={idLine}
                                  onChange={(e) => setIdLine(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label>เบอร์ติดต่อฉุกเฉิน</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="เบอร์ติดต่อฉุกเฉิน"
                                  value={emergencyContactNumber}
                                  onChange={(e) => setEmergencyContactNumber(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>ชื่อผู้ติดต่อฉุกเฉิน</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ชื่อผู้ติดต่อฉุกเฉิน"
                                  value={emergencyName}
                                  onChange={(e) => setEmergencyName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>ความสัมพันธ์</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="ความสัมพันธ์"
                                  value={emergencyRelationship}
                                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Section 5: ข้อมูลสุขภาพ */}
                      <section className="Frame">
                        <div className="col-md-12">
                          <h3 className="title" style={{ fontSize: '18px', marginBottom: '20px', color: 'rgb(43,93,142)' }}>
                            <i className="fas fa-heartbeat" style={{ marginRight: '8px' }}></i>
                            ข้อมูลสุขภาพ
                          </h3>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>สิทธิการรักษาพยาบาล</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="สิทธิการรักษาพยาบาล"
                                  value={treatmentRights}
                                  onChange={(e) => setTreatmentRights(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Buttons */}
                      <div className="row" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <div className="col-md-12">
                          <button
                            type="submit"
                            className="btn "
                            style={{ marginRight: '10px', backgroundColor: 'rgb(43,93,142)' }}
                            onClick={() => setButtonValue(newEmp ? "create" : "save")}
                          >
                            <i className="fas fa-save " style={{ marginRight: '8px' }}></i>
                            บันทึก
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('createEdit')}
                            className="btn btn-secondary"
                          >
                            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                            กลับไปค้นหา
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 3 Content - Salary Information */}
          {activeTab === 'tab3' && (
            <section class="content">
              <div class="row">
                <div class="col-md-12">
                  <section class="Frame">
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="employeeId">รหัสพนักงาน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="employeeId"
                              placeholder="รหัสพนักงาน"
                              value={employeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              readOnly
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="employeeName">ชื่อพนักงาน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="employeeName"
                              placeholder="ชื่อพนักงาน"
                              value={`${name || ""} ${lastName || ""}`}
                              readOnly
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="position">ตำแหน่ง</label>
                            <input
                              type="text"
                              class="form-control"
                              id="position"
                              placeholder="ตำแหน่ง"
                              value={position}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="workplace">หน่วยงาน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="workplace"
                              placeholder="หน่วยงาน"
                              value={workplace}

                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="workplacearea">สถานที่ปฏิบัติงาน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="workplacearea"
                              placeholder="สถานที่ปฏิบัติงาน"
                              value={workplacearea}

                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label role="jobtype">ประเภทการจ้าง</label>
                            <select
                              id="jobtype"
                              name="jobtype"
                              class="form-control"
                              value={jobtype}
                              onChange={(e) => setJobtype(e.target.value)}
                            >
                              <option value="">ไม่ระบุ</option>
                              <option value="รายวัน">รายวัน</option>
                              <option value="รายเดือน">รายเดือน</option>
                              <option value="รายครั้ง">รายครั้ง</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label role="costtype">ลงบัญชีแบบ</label>
                            <div class="" style={{ marginTop: "10px" }}>
                              <div class="icheck-primary d-inline">
                                <input
                                  type="radio"
                                  id="costtype1"
                                  name="costtype"
                                  value="ภ.ง.ด.1"
                                  checked={costtype === "ภ.ง.ด.1"}
                                  onChange={(e) => setCosttype(e.target.value)}
                                />{" "}
                                ภ.ง.ด.1 (ภาษีเงินได้หักณที่จ่าย)
                              </div>
                              <div class="icheck-primary d-inline" style={{ marginLeft: '20px' }}>
                                <input
                                  type="radio"
                                  id="costtype2"
                                  name="costtype"
                                  value="ภ.ง.ด.3"
                                  checked={costtype === "ภ.ง.ด.3"}
                                  onChange={(e) => setCosttype(e.target.value)}
                                />{" "}
                                ภ.ง.ด.3 (หัก ณ ที่จ่าย 3%)
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
                <div class="col-md-12">
                  <section class="Frame" style={{
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    marginBottom: '20px',
                    border: '1px solid #e3e6f0',
                    background: '#ffffff'
                  }}>
                    <div class="col-md-12">
                      <h3 style={{
                        fontSize: '18px',
                        marginBottom: '20px',
                        color: 'rgb(43,93,142)',
                        borderBottom: '2px solid #4e73df',
                        paddingBottom: '10px',
                        fontWeight: '600'
                      }}>
                        <i class="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
                        ข้อมูลเงินเดือน
                      </h3>

                      {/* ซ่อนส่วนวันเริ่มคำนวณ */}
                      {/* <div class="row">
                      <div class="col-md-6">
                        <div style={{ 
                          background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          boxShadow: '0 2px 8px rgba(78, 115, 223, 0.3)'
                        }}>
                          <h4 style={{ 
                            color: 'white',
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <i class="far fa-calendar-alt" style={{ marginRight: '8px', fontSize: '16px' }}></i>
                            วันเริ่มคำนวณ
                          </h4>
                        </div>
                        <div class="form-group" style={{ marginBottom: '20px' }}>
                          <label role="startcount" style={{ 
                            fontWeight: '500',
                            color: '#5a5c69',
                            marginBottom: '8px',
                            display: 'block'
                          }}>
                            วันเริ่มคำนวณ
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="startcount"
                            placeholder="dd/mm/yyyy"
                            value={startcount}
                            onChange={(e) => setStartcount(e.target.value)}
                            style={{ 
                              borderRadius: '8px', 
                              border: '1px solid #d1d3e2',
                              padding: '10px 15px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div> */}

                      {/* เงินเดือนปัจจุบัน */}
                      <div class="row">
                        <div class="col-md-12">
                          <div style={{
                        backgroundColor: 'rgb(43,93,142)',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(78, 115, 223, 0.3)'
                          }}>
                            <h4 style={{
                              color: 'white',
                              margin: 0,
                              fontSize: '15px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <i class="fas fa-money-bill-wave" style={{ marginRight: '8px', fontSize: '16px' }}></i>
                              เงินเดือนปัจจุบัน
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group" style={{ marginBottom: '15px' }}>
                            <label role="salary" style={{
                              fontWeight: '500',
                              color: '#5a5c69',
                              marginBottom: '8px',
                              display: 'block'
                            }}>
                              *อัตรา
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="salary"
                              placeholder="จำนวนเงิน"
                              value={salary}
                              onChange={(e) => setSalary(e.target.value)}
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #d1d3e2',
                                padding: '10px 15px',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group" style={{ marginBottom: '15px' }}>
                            <label role="salarytype" style={{
                              fontWeight: '500',
                              color: '#5a5c69',
                              marginBottom: '8px',
                              display: 'block',
                              fontSize: '14px'
                            }}>
                              *ต่อ
                            </label>
                            <select
                              id="salarytype"
                              name="salarytype"
                              class="form-control"
                              value={salarytype}
                              onChange={(e) => setSalarytype(e.target.value)}
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #d1d3e2',
                                padding: '10px 15px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">ไม่ระบุ</option>
                              <option value="ต่อวัน">ต่อวัน</option>
                              <option value="ต่อเดือน">ต่อเดือน</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group" style={{ marginBottom: '15px' }}>
                            <label role="money" style={{
                              fontWeight: '500',
                              color: '#5a5c69',
                              marginBottom: '8px',
                              display: 'block',
                              fontSize: '14px'
                            }}>
                              สกุลเงิน
                            </label>
                            <select
                              id="money"
                              name="money"
                              class="form-control"
                              value={money}
                              onChange={(e) => setMoney(e.target.value)}
                              style={{
                                borderRadius: '8px',
                                border: '1px solid #d1d3e2',
                                padding: '10px 15px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">ไม่ระบุ</option>
                              <option value="บาท">บาท</option>
                              <option value="จ๊าต">จ๊าต - พม่า</option>
                              <option value="เรียล">เรียล - กัมพูชา</option>
                              <option value="กีบ">กีบ - ลาว</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ซ่อนส่วนวันที่ปรับปรุง
                    <div class="form-group" style={{ marginBottom: '15px' }}>
                      <label role="salaryupdate" style={{ 
                        fontWeight: '500',
                        color: '#5a5c69',
                        marginBottom: '8px',
                        display: 'block'
                      }}>
                        วันที่ปรับปรุง
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="salaryupdate"
                        placeholder="dd/mm/yyyy"
                        value={salaryupdate}
                        onChange={(e) => setSalaryupdate(e.target.value)}
                        style={{ 
                          borderRadius: '8px', 
                          border: '1px solid #d1d3e2',
                          padding: '10px 15px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    */}

                    {/* ซ่อนส่วนงวดจ่ายเงิน
                    <div class="row" style={{ marginTop: '20px' }}>
                      <div class="col-md-6">
                        <div class="form-group" style={{ marginBottom: '15px' }}>
                          <label role="salaryout" style={{ 
                            fontWeight: '500',
                            color: '#5a5c69',
                            marginBottom: '8px',
                            display: 'block'
                          }}>
                            งวดจ่ายเงิน
                          </label>
                          <select
                            id="salaryout"
                            name="salaryout"
                            class="form-control"
                            value={salaryout}
                            onChange={(e) => setSalaryout(e.target.value)}
                            style={{ 
                              borderRadius: '8px', 
                              border: '1px solid #d1d3e2',
                              padding: '10px 15px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">ไม่ระบุ</option>
                            <option value="เดือน">เดือน</option>
                            <option value="ครึ่งเดือน">ครึ่งเดือน</option>
                            <option value="สัปดาห์">สัปดาห์</option>
                            <option value="10 วัน">10 วัน</option>
                            <option value="งวดพิเศษ">งวดพิเศษ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    */}

                    {/* วิธีจ่ายเงินและธนาคาร */}
                    <div class="row" style={{ marginTop: '20px' }}>
                      <div class="col-md-6">
                        <div class="form-group" style={{ marginBottom: '15px' }}>
                          <label role="salarypayment" style={{
                            fontWeight: '500',
                            color: '#5a5c69',
                            marginBottom: '8px',
                            display: 'block'
                          }}>
                            วิธีจ่ายเงิน
                          </label>
                          <div style={{ display: 'flex', gap: '20px', paddingTop: '8px' }}>
                            <div class="icheck-primary d-inline">
                              <input
                                type="radio"
                                id="salarypayment1"
                                name="salarypayment"
                                value="เงินสด"
                                checked={salarypayment === "เงินสด"}
                                onChange={(e) => setSalarypayment(e.target.value)}
                              />{" "}
                              <label htmlFor="salarypayment1" style={{ marginLeft: '5px', cursor: 'pointer' }}>เงินสด</label>
                            </div>
                            <div class="icheck-primary d-inline">
                              <input
                                type="radio"
                                id="salarypayment2"
                                name="salarypayment"
                                value="โอนผ่านธนาคาร "
                                checked={salarypayment === "โอนผ่านธนาคาร "}
                                onChange={(e) => setSalarypayment(e.target.value)}
                              />{" "}
                              <label htmlFor="salarypayment2" style={{ marginLeft: '5px', cursor: 'pointer' }}>โอนผ่านธนาคาร</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลธนาคาร */}
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group" style={{ marginBottom: '15px' }}>
                          <label role="salarybank" style={{
                            fontWeight: '500',
                            color: '#5a5c69',
                            marginBottom: '8px',
                            display: 'block'
                          }}>
                            ชื่อธนาคาร
                          </label>
                          <select
                            id="salarybank"
                            name="salarybank"
                            class="form-control"
                            value={salarybank}
                            onChange={(e) => setSalarybank(e.target.value)}
                            style={{
                              borderRadius: '8px',
                              border: '1px solid #d1d3e2',
                              padding: '10px 15px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="">ไม่ระบุ</option>
                            <option value="ธนาคารกรุงเทพ (มหาชน)">ธนาคาร กรุงเทพ (มหาชน)</option>
                            <option value="ธนาคารกสิกรไทย (มหาชน)">ธนาคาร กสิกรไทย (มหาชน)</option>
                            <option value="ธนาคารกรุงไทย (มหาชน)">ธนาคาร กรุงไทย (มหาชน)</option>
                            <option value="ธนาคารทหารไทยธนชาต (มหาชน)">ธนาคาร ทหารไทยธนชาต (มหาชน)</option>
                            <option value="ธนาคารไทยพาณิชย์ (มหาชน)">ธนาคาร ไทยพาณิชย์ (มหาชน)</option>
                            <option value="ธนาคารกรุงศรีอยุธยา (มหาชน)">ธนาคาร กรุงศรีอยุธยา (มหาชน)</option>
                            <option value="ธนาคารเกียรตินาคินภัทร (มหาชน)">ธนาคาร เกียรตินาคินภัทร (มหาชน)</option>
                            <option value="ธนาคารซีไอเอ็มบีไทย (มหาชน)">ธนาคาร ซีไอเอ็มบีไทย (มหาชน)</option>
                            <option value="ธนาคารทิสโก้ (มหาชน)">ธนาคาร ทิสโก้ (มหาชน)</option>
                            <option value="ธนาคารยูโอบี (มหาชน)">ธนาคาร ยูโอบี (มหาชน)</option>
                            <option value="ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)">ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)</option>
                            <option value="ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)">ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)</option>
                            <option value="ธนาคารไอซีบีซี (ไทย)">ธนาคาร ไอซีบีซี (ไทย)</option>
                            <option value="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย">ธนาคาร พัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย</option>
                            <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">ธนาคาร เพื่อการเกษตรและสหกรณ์การเกษตร</option>
                            <option value="ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย">ธนาคาร เพื่อการส่งออกและนำเข้าแห่งประเทศไทย</option>
                            <option value="ธนาคารออมสิน">ธนาคาร ออมสิน</option>
                            <option value="ธนาคารอาคารสงเคราะห์">ธนาคาร อาคารสงเคราะห์</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group" style={{ marginBottom: '15px' }}>
                          <label role="banknumber" style={{
                            fontWeight: '500',
                            color: '#5a5c69',
                            marginBottom: '8px',
                            display: 'block'
                          }}>
                            เลขที่บัญชี
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="banknumber"
                            placeholder="เลขที่บัญชี"
                            value={banknumber}
                            onChange={(e) => setBanknumber(e.target.value)}
                            style={{
                              borderRadius: '8px',
                              border: '1px solid #d1d3e2',
                              padding: '10px 15px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <h2 class="title">เงินเพิ่มพิเศษ</h2>
                  <section class="Frame">
                    <section class="Frame">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">เงินเพิ่มของหน่วยงาน</h4>
                      </div>

                      {console.log('🔍 Debug Benefits:', {
                        addSalaryWorkplace,
                        workplace,
                        position,
                        workplaceSelectionSalary
                      })}

                      {/* Header Row */}
                      <div className="row mb-2 d-none d-md-flex font-weight-bold text-secondary">
                        <div className="col-md-2">รหัส</div>
                        <div className="col-md-3">ชื่อรายการ</div>
                        <div className="col-md-2">จำนวนเงิน</div>
                        <div className="col-md-1">ได้เป็นราย</div>
                        <div className="col-md-3 text-center">การจัดการ</div>
                      </div>

                      {addSalaryWorkplace && addSalaryWorkplace.length > 0 ? (
                        addSalaryWorkplace.map((data, index) => (
                          (data.StaffType === 'all' ||
                            data.StaffType === position ||
                            data.StaffType === '' ||
                            !data.StaffType) && (
                            <div className="card mb-3 shadow-sm border-0" key={index}>
                              <div className="card-body p-3">
                                <div className="row align-items-center">
                                  {/* Code */}
                                  <div className="col-md-2 mb-2 mb-md-0">
                                    <label className="d-md-none font-weight-bold">รหัส: </label>
                                    <input
                                      type="text"
                                      className="form-control bg-white"
                                      value={data.codeSpSalary || ''}
                                      readOnly
                                      style={{ border: '1px solid #e3e6f0' }}
                                    />
                                  </div>

                                  {/* Name */}
                                  <div className="col-md-3 mb-2 mb-md-0">
                                    <label className="d-md-none font-weight-bold">ชื่อรายการ: </label>
                                    <input
                                      type="text"
                                      className="form-control bg-white"
                                      value={data.name || ''}
                                      readOnly
                                      style={{ border: '1px solid #e3e6f0' }}
                                    />
                                  </div>

                                  {/* Amount */}
                                  <div className="col-md-2 mb-2 mb-md-0">
                                    <label className="d-md-none font-weight-bold">จำนวนเงิน: </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={data.SpSalary ? Number(data.SpSalary).toLocaleString() : ''}
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        if (!isNaN(rawValue) || rawValue === '') {
                                          const updatedData = { ...data };
                                          updatedData.SpSalary = rawValue;
                                          const updatedSalaryWorkplace = [...addSalaryWorkplace];
                                          updatedSalaryWorkplace[index] = updatedData;
                                          setAddSalaryWorkplace(updatedSalaryWorkplace);
                                        }
                                      }}
                                    />
                                  </div>

                                  {/* Round of Salary */}
                                  <div className="col-md-2 mb-2 mb-md-0">
                                    <label className="d-md-none font-weight-bold">ได้เป็นราย: </label>
                                    <select
                                      className="form-control"
                                      value={data.roundOfSalary || 'monthly'}
                                      onChange={(e) => {
                                        const updatedData = { ...data };
                                        updatedData.roundOfSalary = e.target.value;
                                        const updatedSalaryWorkplace = [...addSalaryWorkplace];
                                        updatedSalaryWorkplace[index] = updatedData;
                                        setAddSalaryWorkplace(updatedSalaryWorkplace);
                                      }}
                                    >
                                      <option value="daily">รายวัน</option>
                                      <option value="monthly">รายเดือน</option>
                                    </select>
                                  </div>

                                  {/* Action Button */}
                                  <div className="col-md-3 text-center">
                                    <button
                                      onClick={() => handleAddToSalary(data)}
                                      className="btn btn-primary btn-block shadow-sm"
                                      style={{ transition: 'all 0.2s' }}
                                    >
                                      <i className="fas fa-plus-circle mr-2"></i>
                                      ให้สวัสดิการ
                                    </button>
                                  </div>
                                </div>

                                {/* Hidden StaffType for logic but visible if needed for debugging, currently hidden as per design simplification */}
                                {data.StaffType === "custom" && (
                                  <div className="row mt-2">
                                    <div className="col-12">
                                      <small className="text-muted">Type: {data.nameType}</small>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        ))
                      ) : (
                        <div className="text-center p-5 bg-light rounded border border-light">
                          <i className="fas fa-inbox fa-3x text-gray-300 mb-3"></i>
                          <p className="text-gray-500 mb-0">ไม่มีรายการสวัสดิการสำหรับหน่วยงานนี้</p>
                        </div>
                      )}
                    </section>

                    <section class="Frame">
                      {/* Helper function for formatting numbers with commas */}
                      {/* Note: In a real app, this should be defined outside the render or in a utility file. 
                          Placing it here for immediate access within the map scope or we can define it at component level.
                          For now, I will use inline logic or a simple function if I could, but since I am replacing a block, 
                          I will assume the helper is available or I will implement the logic inline for now to be safe and consistent.
                          Actually, I will add the helper function at the top of the component in a separate edit if needed, 
                          but for now I will implement the formatting logic directly in the onChange and value.
                      */}

                      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                        <h4 className="mb-0">เงินเพิ่มที่ได้รับ</h4>
                      </div>

                      {/* Header Row */}
                      <div className="row mb-2 d-none d-md-flex font-weight-bold text-secondary">
                        <div className="col-md-3">ชื่อรายการ</div>
                        <div className="col-md-2">จำนวนเงิน</div>
                        <div className="col-md-1">ได้เป็นราย</div>
                        {/* <div className="col-md-2">ประเภท</div> */}
                        <div className="col-md-3 text-center">การจัดการ</div>
                      </div>

                      {addSalary.map((data, index) => (
                        <div className="card mb-3 shadow-sm border-0" key={index}>
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              {/* Name */}
                              <div className="col-md-3 mb-2 mb-md-0">
                                <label className="d-md-none font-weight-bold">ชื่อรายการ: </label>
                                <input
                                  type="text"
                                  className="form-control bg-white"
                                  value={data.name || ''}
                                  readOnly
                                  style={{ border: '1px solid #e3e6f0' }}
                                />
                              </div>

                              {/* Amount */}
                              <div className="col-md-2 mb-2 mb-md-0">
                                <label className="d-md-none font-weight-bold">จำนวนเงิน: </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={data.SpSalary ? Number(data.SpSalary).toLocaleString() : ''}
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(/,/g, '');
                                    if (!isNaN(rawValue) || rawValue === '') {
                                      const updatedData = { ...data };
                                      updatedData.SpSalary = rawValue;
                                      const updatedAddSalary = [...addSalary];
                                      updatedAddSalary[index] = updatedData;
                                      setAddSalary(updatedAddSalary);
                                    }
                                  }}
                              
                                />
                              </div>

                              {/* Round of Salary */}
                              <div className="col-md-2 mb-2 mb-md-0">
                                <label className="d-md-none font-weight-bold">ได้เป็นราย: </label>
                                <input
                                  type="text"
                                  className="form-control bg-white"
                                  value={data.roundOfSalary === 'daily' ? 'รายวัน' : 'รายเดือน'}
                                  readOnly
                                  style={{ border: '1px solid #e3e6f0' }}
                                />
                              </div>

                              {/* Staff Type (Custom) */}
                              {/* <div className="col-md-2 mb-2 mb-md-0">
                                {data.StaffType === "custom" ? (
                                  <>
                                    <label className="d-md-none font-weight-bold">ประเภท: </label>
                                    <input
                                      type="text"
                                      className="form-control bg-white"
                                      value={data.nameType || ''}
                                      readOnly
                                      style={{ border: '1px solid #e3e6f0' }}
                                    />
                                  </>
                                ) : (
                                  <span className="d-none d-md-block text-muted">-</span>
                                )}
                              </div> */}

                              {/* Action Button */}
                              <div className="col-md-3 text-center">
                                <button
                                  onClick={() => handleRemoveFromSalary(data)}
                                  className="btn btn-danger btn-block shadow-sm"
                                  style={{ transition: 'all 0.2s' }}
                                >
                                  <i className="fas fa-trash-alt mr-2"></i>
                                  นำออก
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </section>
                  </section>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <h2 class="title">สวัสดิการวันลา</h2>
                  <section class="Frame">
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="businessLeave">วันลากิจคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="businessLeave"
                              placeholder="วันลากิจคงเหลือ"
                              value={businessLeave}
                              onChange={(e) => setBusinessLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="businessLeaveSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="businessLeaveSalary"
                              placeholder="จำนวนเงินต่อวัน"
                              value={businessLeaveSalary}
                              onChange={(e) => setBusinessLeaveSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="sickLeave">วันลาป่วยคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="sickLeave"
                              placeholder="วันลาป่วยคงเหลือ"
                              value={sickLeave}
                              onChange={(e) => setSickLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="sickLeaveSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="sickLeaveSalary"
                              placeholder="จำนวนเงินต่อวัน" 
                              value={sickLeaveSalary}
                              onChange={(e) => setSickLeaveSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="vacationLeave">วันลาพักร้อนคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="vacationLeave"
                              placeholder="วันลาพักร้อนคงเหลือ"
                              value={vacationLeave}
                              onChange={(e) => setVacationLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="vacationSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="vacationSalary"
                              placeholder="จำนวนเงินต่อวัน"
                              value={vacationSalary}
                              onChange={(e) => setVacationSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="maternityLeave">วันลาคลอดคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="maternityLeave"
                              placeholder="วันลาคลอดคงเหลือ"
                              value={maternityLeave}
                              onChange={(e) => setMaternityLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="maternityleaveSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="maternityleaveSalary"
                              placeholder="จำนวนเงินต่อวัน"
                              value={maternityleaveSalary}
                              onChange={(e) => setMaternityleaveSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="militaryLeave">วันลาเกณฑ์ทหารคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="militaryLeave"
                              placeholder="วันลาเกณฑ์ทหารคงเหลือ"
                              value={militaryLeave}
                              onChange={(e) => setMilitaryLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="militaryLeaveSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="militaryLeaveSalary"
                              placeholder="จำนวนเงินต่อวัน"
                              value={militaryLeaveSalary}
                              onChange={(e) => setMilitaryLeaveSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="sterilizationLeave">วันลาทำหมันคงเหลือ</label>
                            <input
                              type="text"
                              class="form-control"
                              id="sterilizationLeave"
                              placeholder="วันลาทำหมันคงเหลือ"
                              value={sterilizationLeave}
                              onChange={(e) => setSterilizationLeave(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="sterilizationLeaveSalary">จำนวนเงินต่อวัน</label>
                            <input
                              type="text"
                              class="form-control"
                              id="sterilizationLeaveSalary"
                              placeholder="จำนวนเงินต่อวัน"
                              value={sterilizationLeaveSalary}
                              onChange={(e) => setSterilizationLeaveSalary(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* ปุ่มบันทึกและยกเลิก */}
              <div class="line_btn">
                <button
                  type="button"
                  class="btn b_save"
                  onClick={updateEmployeeTab3}
                >
                  <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                </button>
                <button
                  type="button"
                  class="btn clean"
                  onClick={() => {
                    // Reset Tab 3 เหมือน Salary.jsx
                    setEmployeeId('');
                    setName('');
                    setPosition('');
                    setWorkplace('');
                    setWorkplacearea('');
                    setJobtype('');
                    setCosttype('');
                    setStartcount('');
                    setSalarytype('');
                    setMoney('');
                    setSalaryupdate('');
                    setSalaryout('');
                    setSalarypayment('');
                    setSalarybank('');
                    setBanknumber('');
                    setAddSalary([]);
                    setBusinessLeave('');
                    setBusinessLeaveSalary('');
                    setSickLeave('');
                    setSickLeaveSalary('');
                    setVacationLeave('');
                    setVacationSalary('');
                    setMaternityLeave('');
                    setMaternityLeaveSalary('');
                    setMilitaryLeave('');
                    setMilitaryLeaveSalary('');
                    setSterilizationLeave('');
                    setSterilizationLeaveSalary('');
                  }}
                >
                  <i class="far fa-window-close"></i> &nbsp;ยกเลิก
                </button>
              </div>
            </section>
          )}
          {activeTab === 'tab4' && (
            <SettingTab 
              workplaceList={workplaceSelection} 
              employeeList={allEmployees} 
              selectedEmployee={selectedEmployeeForTab2}
            />
          )}
        </div>
      </div>
      {/* </body> */}
    </div>
  );
}

export default AddEditEmployee;

function SettingTab({ workplaceList, employeeList, selectedEmployee }) {
  // Use useLocation hook to access query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workplaceIdSend = queryParams.get("workplaceId");
  const workplaceNameSend = queryParams.get("workplaceName");

  // console.log("workplaceId123", workplaceIdSend);
  // console.log("workplaceName123", workplaceNameSend);
  console.log("workplaceList", workplaceList);
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: "#f2f2f2",
  };

  // ✅ Auto-populate when selectedEmployee is passed
  useEffect(() => {
    if (selectedEmployee) {
      console.log("🔄 Auto-populating SettingTab with:", selectedEmployee);
      
      // 1. Set Search Fields
      setStaffId(selectedEmployee.employeeId || "");
      setStaffName(selectedEmployee.name || "");
      setStaffLastname(selectedEmployee.lastName || "");
      setSearchWorkPlace(selectedEmployee.workplace || "");
      setSearchPhoneNumber(selectedEmployee.phoneNumber || "");
      setSearchIdCard(selectedEmployee.idCard || "");
      setSearchEmployeeId(selectedEmployee.employeeId || ""); // Important for logic

      // 2. Load Settings Logic
      const loadSettings = async () => {
        let finalWorkplace = {};

        // Check for custom workplace
        if (selectedEmployee.customWorkplace && Object.keys(selectedEmployee.customWorkplace).length > 0) {
          finalWorkplace = selectedEmployee.customWorkplace;
          console.log("✅ ใช้การตั้งค่าเฉพาะบุคคล (Auto)");
        } else {
          // Fetch standard workplace
          if (selectedEmployee.workplace) {
            try {
              const wpRes = await axios.get(`${endpoint}/workplace/${selectedEmployee.workplace}`);
              finalWorkplace = wpRes.data || {};
              console.log("✅ ใช้การตั้งค่าหน่วยงานปกติ (Auto)");
            } catch (err) {
              console.error("❌ Error loading workplace (Auto):", err);
            }
          }
        }

        // 3. Update UI with Workplace Data
        if (Object.keys(finalWorkplace).length > 0) {
          handleClickResult(finalWorkplace);
        }

        // 4. Set Employee Result List
        const employeeWithWorkplace = {
          ...selectedEmployee,
          effectiveWorkplace: finalWorkplace,
        };
        setShowEmployeeListResult([employeeWithWorkplace]);
      };

      loadSettings();
    }
  }, [selectedEmployee]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // State for selected values
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [listEmployeeDay, setListEmployeeDay] = useState([]);

  const [selectedDay1, setSelectedDay1] = useState("");
  const [spWorkStart1, setSpWorkStart1] = useState("");
  const [spWorkEnd1, setSpWorkEnd1] = useState("");
  const [spWorkStart2, setSpWorkStart2] = useState("");
  const [spWorkEnd2, setSpWorkEnd2] = useState("");
  const [spWorkStart3, setSpWorkStart3] = useState("");
  const [spWorkEnd3, setSpWorkEnd3] = useState("");

  // Employee compensation states
  const [currentEmployeeCompensation, setCurrentEmployeeCompensation] = useState("");
  const [addEmployeeCompensation, setAddEmployeeCompensation] = useState("");
  const [employeeCompensation, setEmployeeCompensation] = useState("");
  const [employeeCompensationStartDate, setEmployeeCompensationStartDate] = useState("");
  
  // New dual-rate employee compensation states
  const [employeeCompensationRate21_30_31, setEmployeeCompensationRate21_30_31] = useState(""); // อัตราเงินสงเคราะห์ลูกจ้าง วันที่ 21-30/31
  const [employeeCompensationRate1_20, setEmployeeCompensationRate1_20] = useState(""); // อัตราเงินสงเคราะห์ลูกจ้าง วันที่ 1-20

  const [listSpecialWorktime, setListSpecialWorktime] = useState([]);

  const [listMonday, setListMonday] = useState([]);
  const [listTuesday, setListTuesday] = useState([]);
  const [listWednesday, setListWednesday] = useState([]);
  const [listThursday, setListThursday] = useState([]);
  const [listFriday, setListFriday] = useState([]);
  const [listSaturday, setListSaturday] = useState([]);
  const [listSunday, setListSunday] = useState([]);

  // Options for dropdowns
  const daysOfWeek = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
    "เสาร์",

  ];
  const positions = ["หัวหน้างาน", "พนักงานทำความสะอาด"];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDay && selectedPosition && numberOfEmployees !== "") {
      const newData = {
        day: selectedDay,
        position: selectedPosition,
        employees: numberOfEmployees,
      };

      setListEmployeeDay((prevData) => [...prevData, newData]);

      // Reset the form fields after submitting
      setSelectedDay("");
      setSelectedPosition("");
      setNumberOfEmployees("");
    }
  };

  const [workTimeDay, setWorkTimeDay] = useState({
    startDay: "",
    endDay: "",
    workOrStop: "",
    allTimes: [
      {
        shift: "",
        beforeStartTimeOT: "", // เข้า OT ก่อน
        beforeEndTimeOT: "", // ออก OT ก่อน
        beforeResultTimeOT: "", // ✅ เปลี่ยนเป็น beforeResultTimeOT
        startTime: "",
        endTime: "",
        resultTime: "",
        startTimeOT: "",
        endTimeOT: "",
        resultTimeOT: "",
        numberOfPeople: "",
        Remark: "",
      },
    ],
  });

  const [workTimeDayList, setWorkTimeDayList] = useState([]);
  const [editingTimeListIndex, setEditingTimeListIndex] = useState(null); // เก็บ index ของรายการที่กำลังแก้ไข

  // const daysOfWeekThai = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const shiftWork = ["กะเช้า", "กะบ่าย", "กะดึก"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setWorkTimeDay((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [selectShift, setSelectShift] = useState("");

  const handleAddTime = () => {
    setWorkTimeDay((prevData) => ({
      ...prevData,
      allTimes: [
        ...prevData.allTimes,
        {
          shift: "",
          beforeStartTimeOT: "", // เข้า OT ก่อน
          beforeEndTimeOT: "", // ออก OT ก่อน
          beforeResultTimeOT: "", // ✅ เปลี่ยนเป็น beforeResultTimeOT
          startTime: "",
          endTime: "",
          resultTime: "",
          startTimeOT: "",
          endTimeOT: "",
          resultTimeOT: "",
          numberOfPeople: "",
          Remark: "",
        },
      ],
    }));
  };

  const handleRemoveTime = (indexToRemove) => {
    setWorkTimeDay((prevData) => ({
      ...prevData,
      allTimes: prevData.allTimes.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddTimeList = () => {
    // ถ้าอยู่ในโหมดแก้ไข
    if (editingTimeListIndex !== null) {
      setWorkTimeDayList((prevList) => {
        const updatedList = [...prevList];
        updatedList[editingTimeListIndex] = workTimeDay;
        return updatedList;
      });
      setEditingTimeListIndex(null);
      
      Swal.fire({
        title: "แก้ไขสำเร็จ",
        text: "แก้ไขข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      // เพิ่มใหม่
      setWorkTimeDayList((prevList) => [...prevList, workTimeDay]);
    }

    //clean data
    setWorkTimeDay({
      startDay: "",
      endDay: "",
      workOrStop: "",
      allTimes: [
        {
          shift: "",
          beforeStartTimeOT: "", // เข้า OT ก่อน
          beforeEndTimeOT: "", // ออก OT ก่อน
          beforeResultTimeOT: "", // ✅ เปลี่ยนเป็น beforeResultTimeOT
          startTime: "",
          endTime: "",
          resultTime: "",
          startTimeOT: "",
          endTimeOT: "",
          resultTimeOT: "",
          numberOfPeople: "",
          Remark: "",
        },
      ],
    });
  };

  const handleRemoveTimeList = (index) => {
    setWorkTimeDayList((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  const handleEditTimeList = (index) => {
    const itemToEdit = workTimeDayList[index];
    setWorkTimeDay(itemToEdit);
    setEditingTimeListIndex(index);
    
    // เลื่อนหน้าจอไปที่ฟอร์ม
    const formElement = document.getElementById('workTimeDayForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTimeChange = (index, timeType, value) => {
    setWorkTimeDay((prevData) => {
      const updatedTimes = prevData.allTimes.map((time, i) =>
        i === index ? { ...time, [timeType]: value } : time
      );

      // Calculate resultTime and resultOT when both startTime and endTime are provided
      if (
        timeType === "startTime" ||
        timeType === "endTime" ||
        timeType === "startTimeOT" ||
        timeType === "endTimeOT" ||
        timeType === "beforeStartTimeOT" ||
        timeType === "beforeEndTimeOT"
      ) {
        const startTime = updatedTimes[index].startTime;
        const endTime = updatedTimes[index].endTime;
        const startTimeOT = updatedTimes[index].startTimeOT;
        const endTimeOT = updatedTimes[index].endTimeOT;
        const beforeStartTimeOT = updatedTimes[index].beforeStartTimeOT;
        const beforeEndTimeOT = updatedTimes[index].beforeEndTimeOT;

        if (startTime && endTime) {
          const resultTime = calculateTimeDifference(startTime, endTime);
          updatedTimes[index].resultTime = resultTime;
        }

        if (startTimeOT && endTimeOT) {
          const resultTimeOT = calculateTimeDifference(startTimeOT, endTimeOT);
          updatedTimes[index].resultTimeOT = resultTimeOT;
        }

        if (beforeStartTimeOT && beforeEndTimeOT) {
          const beforeResultTimeOT = calculateTimeDifference(beforeStartTimeOT, beforeEndTimeOT);
          updatedTimes[index].beforeResultTimeOT = beforeResultTimeOT;
        }
      }

      return {
        ...prevData,
        allTimes: updatedTimes,
      };
    });
  };

  const calculateTimeDifference = (startTime, endTime) => {
    // รองรับทั้งรูปแบบ HH.MM และ HH:MM
    const separator = startTime.includes(':') ? ':' : '.';
    const [startHour, startMinute] = startTime.split(separator).map(Number);
    const [endHour, endMinute] = endTime.split(separator).map(Number);

    let resultHour = endHour - startHour;
    let resultMinute = endMinute - startMinute;

    if (resultMinute < 0) {
      resultHour -= 1;
      resultMinute += 60;
    }

    // If resultHour is negative, adjust the minutes accordingly
    if (resultHour < 0) {
      resultHour += 24; // Assuming 24-hour time format
    }

    // ใช้ separator เดียวกันกับ input
    return `${resultHour.toString().padStart(2, "0")}${separator}${resultMinute
      .toString()
      .padStart(2, "0")}`;
  };

  const [workTimeDayPerson, setWorkTimeDayPerson] = useState({
    startDay: "",
    endDay: "",
    allTimesPerson: [{ shift: "", positionWork: "", countPerson: "" }],
  });

  const [workTimeDayPersonList, setWorkTimeDayPersonList] = useState([]);

  // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // const shiftWork = ['Shift 1', 'Shift 2', 'Shift 3'];
  const positionWork = ["หัวหน้า", "ผู้ช่วยหัวหน้า", "ทำความสะอาด", "กวาดพื้น"];

  const handleInputPersonChange = (e) => {
    const { name, value } = e.target;

    setWorkTimeDayPerson((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInlineEdit_specialwork = (listIndex, empIndex, newValue) => {
  const updatedList = [...workTimeDayList_specialwork];
  updatedList[listIndex].employees_specialwork[empIndex].countPerson_specialwork = newValue;
  setWorkTimeDayList_specialwork(updatedList);
};


  const handleInputChangePerson = (e, index) => {
    const { name, value } = e.target;

    setWorkTimeDayPerson((prevData) => {
      const updatedAllTimesPerson = [...prevData.allTimesPerson];
      updatedAllTimesPerson[index] = {
        ...updatedAllTimesPerson[index],
        [name]: value,
      };
      return {
        ...prevData,
        allTimesPerson: updatedAllTimesPerson,
      };
    });
  };

  const handleAddTimePerson = () => {
    setWorkTimeDayPerson((prevData) => ({
      ...prevData,
      allTimesPerson: [
        ...prevData.allTimesPerson,
        { shift: "", positionWork: "", countPerson: "" },
      ],
    }));
  };

  const handleRemoveTimePerson = (indexToRemove) => {
    setWorkTimeDayPerson((prevData) => ({
      ...prevData,
      allTimesPerson: prevData.allTimesPerson.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleAddTimePersonList = () => {
    setWorkTimeDayPersonList((prevList) => [...prevList, workTimeDayPerson]);
    //clean data
    setWorkTimeDayPerson({
      startDay: "",
      endDay: "",
      allTimesPerson: [{ shift: "", positionWork: "", countPerson: "" }],
    });
  };

  const handleRemoveTimePersonList = (index) => {
    setWorkTimeDayPersonList((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  // Handle form submission
  const handleAddSpecialWorktime = (e) => {
    e.preventDefault();

    if (selectedDay1 !== "") {
      if (
        spWorkStart1 ||
        spWorkEnd1 ||
        spWorkStart2 ||
        spWorkEnd2 ||
        spWorkStart3 ||
        spWorkEnd3 !== ""
      ) {
        const newData = {
          day: selectedDay1,
          spWorkStart1: spWorkStart1,
          spWorkEnd1: spWorkEnd1,
          spWorkStart2: spWorkStart2,
          spWorkEnd2: spWorkEnd2,
          spWorkStart3: spWorkStart3,
          spWorkEnd3: spWorkEnd3,
        };

        setListSpecialWorktime((prevData) => [...prevData, newData]);

        // Reset the form fields after submitting
        setSelectedDay1("");
        setSpWorkStart1("");
        setSpWorkEnd1("");
        setSpWorkStart2("");
        setSpWorkEnd2("");
        setSpWorkStart3("");
        setSpWorkEnd3("");
      } else {
        alert("กรุณากรอกข้อมูลเวลาปฏิบัติงานที่ต้องการเพิ่ม");
      }
    }
  };

  const [searchAddSalaryList, setSearchAddSalaryList] = useState([]);
  const [searchDeductSalaryList, setSearchDeductSalaryList] = useState([]);

  //First load component
  useEffect(() => {
    const getMaster = async () => {
      const data = await {
        employeeId: "0001",
        name: "",
        idCard: "",
        workPlace: "",
      };

      try {
        const response = await axios.post(endpoint + "/employee/search", data);
        if (response) {
          await setSearchAddSalaryList(response.data.employees[0].addSalary);
          await setSearchDeductSalaryList(
            response.data.employees[0].deductSalary
          );
        }
        // await alert(JSON.stringify(response.data.employees[0].addSalary ,null,2 ));
        // await alert(JSON.stringify(response.data.employees[0].deductSalary ,null,2 ));
      } catch (e) { }
    };

    getMaster();
  }, []);

  //set data to 7 day
  useEffect(() => {
    //clean data
    setListMonday([]);
    setListTuesday([]);
    setListWednesday([]);
    setListThursday([]);
    setListFriday([]);
    setListSaturday([]);
    setListSunday([]);

    listEmployeeDay.map((item) => {
      switch (item.day) {
        case "จันทร์":
          setListMonday((prevData) => [...prevData, item]);
          break;
        case "อังคาร":
          setListTuesday((prevData) => [...prevData, item]);
          break;
        case "พุธ":
          setListWednesday((prevData) => [...prevData, item]);
          break;
        case "พฤหัส":
          setListThursday((prevData) => [...prevData, item]);
          break;
        case "ศุกร์":
          setListFriday((prevData) => [...prevData, item]);
          break;
        case "เสาร์":
          setListSaturday((prevData) => [...prevData, item]);
          break;
        case "อาทิตย์":
          setListSunday((prevData) => [...prevData, item]);
          break;
        default:
          alert("not select day");
      }
    });

    //set special work time
    listSpecialWorktime.map((item) => {
      switch (item.day) {
        case "จันทร์":
          setListMonday((prevData) => [...prevData, item]);
          break;
        case "อังคาร":
          setListTuesday((prevData) => [...prevData, item]);
          break;
        case "พุธ":
          setListWednesday((prevData) => [...prevData, item]);
          break;
        case "พฤหัส":
          setListThursday((prevData) => [...prevData, item]);
          break;
        case "ศุกร์":
          setListFriday((prevData) => [...prevData, item]);
          break;
        case "เสาร์":
          setListSaturday((prevData) => [...prevData, item]);
          break;
        case "อาทิตย์":
          setListSunday((prevData) => [...prevData, item]);
          break;
        default:
          alert("not select data");
      }
    });
  }, [listEmployeeDay, listSpecialWorktime]);

  const handleSearchAndDelete = (searchDay, searchPosition) => {
    const updatedList = listEmployeeDay.filter(
      (entry) => entry.day !== searchDay || entry.position !== searchPosition
    );
    setListEmployeeDay(updatedList);
  };

  const handleDeleteSpecialWorktime = (searchDay) => {
    const updatedList = listSpecialWorktime.filter(
      (entry) => entry.day !== searchDay
    );
    setListSpecialWorktime(updatedList);
  };

  //test

  const styles = {
    th: {
      minWidth: "3rem",
    },
  };

  const [newWorkplace, setNewWorkplace] = useState(true);
  const [selectedDaysOff, setSelectedDaysOff] = useState([]); // New state for Multiple Days Off workflow

  const [selectedDates, setSelectedDates] = useState([]);
  const [publicHolidayDates, setPublicHolidayDates] = useState([]); // วันหยุดนักขัตฤกษ์
  const [reason, setReason] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // ตัวแปรสำหรับวันหยุดนักขัตฤกษ์
  const [publicHolidayDay, setPublicHolidayDay] = useState("");
  const [publicHolidayMonth, setPublicHolidayMonth] = useState("");
  const [publicHolidayYear, setPublicHolidayYear] = useState(new Date().getFullYear());
  const [publicHolidayNote, setPublicHolidayNote] = useState(""); // เพิ่มสำหรับหมายเหตุ
  const [editingPublicHolidayIndex, setEditingPublicHolidayIndex] = useState(null); // เก็บ index ของรายการที่กำลังแก้ไข

  const [workRateChange, setWorkRateChange] = useState('');
  const [workRateDayChange, setWorkRateDayChange] = useState("");
  const [workRateMonthChange, setWorkRateMonthChange] = useState("");
  const [workRateYearChange, setWorkRateYearChange] = useState(new Date().getFullYear());

  //set day month year to WorkRate change
  useEffect(() => {
    if (workRateDayChange && workRateMonthChange && workRateYearChange) {
      // ตรวจสอบว่าวันที่ถูกต้องสำหรับเดือนนั้นๆ
      const daysInMonth = new Date(workRateYearChange, workRateMonthChange, 0).getDate();
      const validDay = Math.min(parseInt(workRateDayChange), daysInMonth);
      
      const selectedDate = new Date(`${workRateMonthChange}/${validDay}/${workRateYearChange}`);
      
      // ตรวจสอบว่าวันที่ถูกต้องก่อนอัปเดต state
      if (!isNaN(selectedDate.getTime())) {
        // ถ้าวันที่ถูกปรับ ให้อัปเดต state ของวัน
        if (validDay !== parseInt(workRateDayChange)) {
          setWorkRateDayChange(validDay.toString());
        }
        setWorkRateChange(selectedDate);
      }
    }
  }, [workRateDayChange, workRateMonthChange, workRateYearChange]);


  const handleAddDate = () => {
    if (day && month && year) {
      const selectedDate = new Date(`${month}/${day}/${year}`);
      // Check if the selected date is a valid date
      if (!isNaN(selectedDate.getTime())) {
        // Check if the selected date already exists in the array
        if (
          !selectedDates.find(
            (date) => date.getTime() === selectedDate.getTime()
          ) 
        ) {
          setSelectedDates((prevDates) => [...prevDates, selectedDate]);
        } else {
          // Show alert for duplicate date selection
          alert(
            day +
            "/" +
            month +
            "/" +
            year +
            "  Selected date already exists in the list."
          );
        }
        // setDay('');
        // setMonth('');
        setYear(new Date().getFullYear());
      } else {
        // Show alert for invalid date selection
        alert(
          day / month / year +
          "Invalid date selection. Please select a valid day, month, and year."
        );
      }
    } else {
      // Show alert for invalid date selection
      alert("Invalid date selection. Please select a day, month, and year.");
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates((prevDates) =>
      prevDates.filter((date) => date !== dateToRemove)
    );
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // ฟังก์ชันสำหรับวันหยุดนักขัตฤกษ์ - แก้ไขให้เก็บข้อมูลไว้ใน state เหมือนวันหยุดหน่วยงาน
  const handleAddPublicHoliday = () => {
    if (publicHolidayDay && publicHolidayMonth && publicHolidayYear) {
      const selectedDate = new Date(`${publicHolidayMonth}/${publicHolidayDay}/${publicHolidayYear}`);
      if (!isNaN(selectedDate.getTime())) {
        
        // ถ้าอยู่ในโหมดแก้ไข
        if (editingPublicHolidayIndex !== null) {
          const updatedDates = [...publicHolidayDates];
          updatedDates[editingPublicHolidayIndex] = {
            date: selectedDate,
            note: publicHolidayNote || ""
          };
          setPublicHolidayDates(updatedDates);
          setEditingPublicHolidayIndex(null);
          
          // ล้างค่า
          setPublicHolidayNote("");
          setPublicHolidayDay("");
          setPublicHolidayMonth("");
          setPublicHolidayYear(new Date().getFullYear());
          
          Swal.fire({
            title: "แก้ไขสำเร็จ",
            text: "แก้ไขวันหยุดนักขัตฤกษ์เรียบร้อยแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          
          return;
        }
        
        // ตรวจสอบว่ามีวันที่นี้อยู่แล้วหรือไม่ (สำหรับการเพิ่มใหม่)
        const isDuplicate = publicHolidayDates.some((holiday) => {
          try {
            const existingDate = holiday.date || holiday; // รองรับทั้งแบบ object และ Date
            if (existingDate instanceof Date && !isNaN(existingDate.getTime())) {
              return existingDate.getDate() === selectedDate.getDate() && 
                     existingDate.getMonth() === selectedDate.getMonth() && 
                     existingDate.getFullYear() === selectedDate.getFullYear();
            }
            return false;
          } catch (error) {
            console.error("Error comparing dates:", error);
            return false;
          }
        });
        
        if (!isDuplicate) {
          // เพิ่มข้อมูลแบบ object ที่มีทั้งวันที่และหมายเหตุ (เก็บไว้ใน state เท่านั้น)
          const newHoliday = {
            date: selectedDate,
            note: publicHolidayNote || ""
          };
          
          const updatedDates = [...publicHolidayDates, newHoliday];
          setPublicHolidayDates(updatedDates);
          
          // ล้างค่าหลังเพิ่มใน state แล้ว
          setPublicHolidayNote("");
          setPublicHolidayDay("");
          setPublicHolidayMonth("");
          setPublicHolidayYear(new Date().getFullYear());
          
          // แสดงข้อความสำเร็จ (ไม่ส่ง API ทันที)
          
        
        }
      } else {
        Swal.fire({
          title: "ข้อมูลไม่ถูกต้อง",
          text: "วันที่ไม่ถูกต้อง กรุณาเลือกวัน เดือน และปีที่ถูกต้อง",
          icon: "error"
        });
      }
    } else {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกวัน เดือน และปี สำหรับวันหยุดนักขัตฤกษ์",
        icon: "warning"
      });
    }
  };

  // ฟังก์ชันสำหรับแก้ไขวันหยุดนักขัตฤกษ์
  const handleEditPublicHoliday = (holiday, index) => {
    const date = holiday.date || holiday;
    if (date instanceof Date && !isNaN(date.getTime())) {
      setPublicHolidayDay(date.getDate().toString());
      setPublicHolidayMonth((date.getMonth() + 1).toString());
      setPublicHolidayYear(date.getFullYear());
      setPublicHolidayNote(holiday.note || "");
      setEditingPublicHolidayIndex(index);
      
      // เลื่อนหน้าจอไปที่ฟอร์มเพิ่มวันหยุด
      const formElement = document.getElementById('publicHolidayForm');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

const handleRemovePublicHoliday = async (holidayToRemove) => {
  try {
    // กรองออกเฉพาะรายการที่ไม่ใช่รายการที่ต้องการลบ
    const updatedDates = publicHolidayDates.filter(holiday => {
      if (holidayToRemove === holiday) return false;
      
      // ถ้าต้องเปรียบเทียบวันที่ (ในกรณีที่อาจมีการอ้างอิงวัตถุใหม่แต่เป็นวันที่เดียวกัน)
      if (holiday.date && holidayToRemove.date) {
        const date1 = holiday.date;
        const date2 = holidayToRemove.date;
        return !(date1.getDate() === date2.getDate() && 
                date1.getMonth() === date2.getMonth() && 
                date1.getFullYear() === date2.getFullYear() &&
                holiday.note === holidayToRemove.note);
      }
      
      return true;
    });
    
    setPublicHolidayDates(updatedDates);
    
    // ส่งข้อมูลไป API
    await updatePublicHolidayToAPI(updatedDates);
    
  } catch (error) {
    console.error("Error removing public holiday:", error);
    // แสดงข้อความ error เฉพาะเมื่อเกิดข้อผิดพลาดจริง ๆ เท่านั้น
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "เกิดข้อผิดพลาดในการลบวันหยุดนักขัตฤกษ์",
      icon: "error"
    });
  }
};

  // ฟังก์ชันส่งข้อมูลวันหยุดนักขัตฤกษ์ไป API
  const updatePublicHolidayToAPI = async (holidayDates) => {
    if (!workplaceId) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกหน่วยงานก่อน",
        icon: "warning"
      });
      return;
    }

    try {
      // แปลงข้อมูลให้เป็นรูปแบบที่ API ต้องการ
      const formattedDates = holidayDates
        .filter(holiday => {
          // กรองข้อมูลวันที่ไม่ถูกต้องออก
          const date = holiday.date || holiday;
          return date instanceof Date && !isNaN(date.getTime());
        })
        .map(holiday => {
          try {
            if (holiday.date) {
              // ข้อมูลใหม่ที่มีทั้ง date และ note
              const date = holiday.date;
              if (date instanceof Date && !isNaN(date.getTime())) {
                // แปลงเป็น string เพื่อส่งไป API
                return {
                  date: date.toISOString(),
                  note: holiday.note || ""
                };
              }
              return null;
            } else {
              // ข้อมูลเก่าที่เป็นแค่วันที่
              if (holiday instanceof Date && !isNaN(holiday.getTime())) {
                return {
                  date: holiday.toISOString(),
                  note: ""
                };
              }
              return null;
            }
          } catch (error) {
            console.error("Error formatting holiday date:", error);
            return null;
          }
        })
        .filter(item => item !== null);

      console.log("วันหยุดนักขัตฤกษ์ที่กำลังส่งไป API:", formattedDates);
      
      // ตรวจสอบว่ามีหมายเหตุถูกส่งไปหรือไม่
      const holidaysWithNotes = formattedDates.filter(h => h.note && h.note.trim() !== "");
      console.log(`มีวันหยุด ${holidaysWithNotes.length} รายการที่มีหมายเหตุ`);

      const data = {
        workplaceId: workplaceId,
        publicHoliday: formattedDates
      };

      // ใช้ endpoint ใหม่ที่จะส่งข้อมูลไปอัปเดตใน dayOffOnly
      const response = await axios.post(
        `${endpoint}/workplace/sync-public-holidays/${workplaceId}`,
        data
      );

      if (response.status === 200) {
        console.log("อัปเดตวันหยุดนักขัตฤกษ์สำเร็จ และซิงค์ไป dayOffOnly แล้ว", response.data);
        
        // หลังจากอัปเดตสำเร็จ เรียกข้อมูลใหม่จาก server เพื่อให้ข้อมูลที่แสดงตรงกับฐานข้อมูล
        try {
          const workplace = await axios.get(`${endpoint}/workplace/${workplaceId}`);
          if (workplace.data && workplace.data.publicHoliday) {
            // อัปเดต state ด้วยข้อมูลล่าสุด
            const freshPublicHolidays = workplace.data.publicHoliday
              .map(holiday => {
                try {
                  if (typeof holiday === 'object' && holiday.date) {
                    console.log("โหลดข้อมูลวันหยุด:", holiday.date, "หมายเหตุ:", holiday.note || "(ไม่มี)");
                    return {
                      date: new Date(holiday.date),
                      note: holiday.note || ""
                    };
                  } else {
                    return {
                      date: new Date(holiday),
                      note: ""
                    };
                  }
                } catch (err) {
                  console.error("Error parsing fresh public holiday:", err);
                  return null;
                }
              })
              .filter(h => h !== null && h.date instanceof Date && !isNaN(h.date.getTime()));
            
            console.log("ข้อมูลวันหยุดนักขัตฤกษ์หลังอัปเดต:", 
              freshPublicHolidays.map(h => ({
                วันที่: `${h.date.getDate()}/${h.date.getMonth() + 1}/${h.date.getFullYear()}`,
                หมายเหตุ: h.note || "(ไม่มี)"
              }))
            );
            
            setPublicHolidayDates(freshPublicHolidays);
          }
        } catch (refreshError) {
          console.error("ไม่สามารถดึงข้อมูลล่าสุดหลังอัปเดต:", refreshError);
        }
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตวันหยุดนักขัตฤกษ์:", error);
      
    }
  };

  // const [daysOff, setDaysOff] = useState(Array(10).fill(''));
  const [holidayComment, setHolidayComment] = useState("");

  const [employeeIdList, setEmployeeIdList] = useState([]); //รหัสพนักงาน
  const [employeeNameList, setEmployeeNameList] = useState([]); //ชื่อพนักงานที่สังกัด

  const [newEmployeeIdList, setNewEmployeeIdList] = useState("");
  const [newEmployeeNameList, setNewEmployeeNameList] = useState("");

  const handleVaccination = (event) => {
    setNewEmployeeIdList(event.target.value);
  };

  const handleVaccination2 = (event) => {
    setNewEmployeeNameList(event.target.value);
  };

  const handleAddVaccination = () => {
    if (newEmployeeIdList.trim() !== "") {
      setEmployeeIdList([...employeeIdList, newEmployeeIdList]);
      setNewEmployeeIdList("");
    }

    if (newEmployeeNameList.trim() !== "") {
      setEmployeeNameList([...employeeNameList, newEmployeeNameList]);
      setNewEmployeeNameList("");
    }
  };

  const handleRemoveVaccination = (vaccinationToRemove) => {
    setEmployeeIdList((prevVaccination) =>
      prevVaccination.filter((v) => v !== vaccinationToRemove)
    );

    setEmployeeNameList((prevVaccination2) =>
      prevVaccination2.filter((v) => v !== vaccinationToRemove)
    );
  };

  //Workplace data
  const [_id, set_id] = useState("");
  const [workplaceId, setWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [workplaceName, setWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [workplaceArea, setWorkplaceArea] = useState(""); //สถานที่ปฏิบัติงาน
  const [workOfWeek, setWorkOfWeek] = useState(""); //วันทำงานต่อสัปดาห์

  const [workStart1, setWorkStart1] = useState(""); //เวลาเริ่มกะเช้า
  const [workEnd1, setWorkEnd1] = useState(""); //เวลาออกกะเช้า
  const [workStart2, setWorkStart2] = useState(""); //เวลาเข้ากะบ่าย
  const [workEnd2, setWorkEnd2] = useState(""); //เวลาออกกะบ่าย
  const [workStart3, setWorkStart3] = useState(""); //เวลาเข้ากะเย็น
  const [workEnd3, setWorkEnd3] = useState(""); //เวลาออกกะเย็น
  ///start end OT
  const [workStartOt1, setWorkStartOt1] = useState(""); //เวลาเริ่มกะเช้า
  const [workEndOt1, setWorkEndOt1] = useState(""); //เวลาออกกะเช้า
  const [workStartOt2, setWorkStartOt2] = useState(""); //เวลาเข้ากะบ่าย
  const [workEndOt2, setWorkEndOt2] = useState(""); //เวลาออกกะบ่าย
  const [workStartOt3, setWorkStartOt3] = useState(""); //เวลาเข้ากะเย็น
  const [workEndOt3, setWorkEndOt3] = useState(""); //เวลาออกกะเย็น

  const [workOfHour, setWorkOfHour] = useState(""); //ชั่วโมงทำงานต่อสัปดาห์
  const [workOfMinute, setWorkOfMinute] = useState(""); //ชั่วโมงทำงานต่อสัปดาห์
  const [startWorkOfOT, setStartWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์
  const [startWorkOfOTMinute, setStartWorkOfOTMinute] = useState(""); //ชั่วโมง OT ต่อสัปดาห์
  const [workOfOT, setWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์
  const [workOfOTMinute, setWorkOfOTMinute] = useState(""); //ชั่วโมง OT ต่อสัปดาห์
  const [breakOfOT, setBreakOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์
  const [isCustom, setIsCustom] = useState(false); // Tracks if custom input is active

  const handleRadioChange = (value) => {
    if (value === "customset") {
      setIsCustom(true);
      setBreakOfOT(""); // Reset breakOfOT for custom input
    } else {
      setIsCustom(false);
      setBreakOfOT(value); // Update breakOfOT with selected value
    }
  };

  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [addWorkRate, setAddWorkRate] = useState(""); //ค่าจ้างที่จะเพิ่ม
  const [newWorkRate, setNewWorkRate] = useState(""); // ค่าจ้างใหม่ทั้งหมด
  const [workRateEffectiveDate, setWorkRateEffectiveDate] = useState(""); // วันที่มีผลบังคับใช้

  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [workTotalPeople, setWorkTotalPeople] = useState(""); //จำนวนคนในหน่วยงาน
  const [dayoffRate, setDayoffRate] = useState(""); //ค่าจ้างวันหยุดรายวันต่อชั่วโมง
  const [dayoffRateOT, setDayoffRateOT] = useState(""); //ค่าจ้างวันหยุด OT ต่อชั่วโมง
  const [dayoffRateHour, setDayoffRateHour] = useState(""); //ค่าจ้างวันหยุดต่อชั่วโมง
  const [holiday, setHoliday] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์
  const [holidayOT, setHolidayOT] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์ OT
  const [holidayHour, setHolidayHour] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง

  const [salaryadd1, setSalaryadd1] = useState(""); //ค่ารถ
  const [salaryadd2, setSalaryadd2] = useState(""); //ค่าอาหาร
  const [salaryadd3, setSalaryadd3] = useState(""); //เบี้ยขยัน
  const [salaryadd4, setSalaryadd4] = useState(""); //เงินพิเศษอื่นๆ
  const [salaryadd5, setSalaryadd5] = useState(""); //ค่าโทรศัพท์
  const [salaryadd6, setSalaryadd6] = useState(""); //เงินประจำตำแหน่ง
  const [personalLeave, setPersonalLeave] = useState(""); //วันลากิจ
  const [personalLeaveNumber, setPersonalLeaveNumber] = useState(""); //วันลากิจ
  const [personalLeaveRate, setPersonalLeaveRate] = useState(""); //จ่ายเงินลากิจ
  const [sickLeave, setSickLeave] = useState(""); //วันลาป่วย
  const [sickLeaveNumber, setSickLeaveNumber] = useState(""); //วันลาป่วย
  const [sickLeaveRate, setSickLeaveRate] = useState(""); //จ่ายเงินวันลาป่วย
  const [workRateDayoff, setWorkRateDayoff] = useState(""); //ค่าจ้างวันหยุด ต่อวัน
  const [workRateDayoffNumber, setWorkRateDayoffNumber] = useState(""); //ค่าจ้างวันหยุด ต่อวัน
  const [workRateDayoffRate, setworkRateDayoffRate] = useState("");
  // const [daysOff , setDaysOff] = useState([{ date: '' }]);
  const [workplaceAddress, setWorkplaceAddress] = useState(""); //ที่อยู่หน่วยงาน

  // const [workRateDayoffHour, setWorkRateDayoffHour] = useState(''); //ค่าจ้างวันหยุดต่อชั่วโมง

  ///////////////////// 7 day work
  const [workday1, setWorkday1] = useState(false);
  const [workday2, setWorkday2] = useState(false);
  const [workday3, setWorkday3] = useState(false);
  const [workday4, setWorkday4] = useState(false);
  const [workday5, setWorkday5] = useState(false);
  const [workday6, setWorkday6] = useState(false);
  const [workday7, setWorkday7] = useState(false);

  const [workcount1, setWorkcount1] = useState("");
  const [workcount2, setWorkcount2] = useState("");
  const [workcount3, setWorkcount3] = useState("");
  const [workcount4, setWorkcount4] = useState("");
  const [workcount5, setWorkcount5] = useState("");
  const [workcount6, setWorkcount6] = useState("");
  const [workcount7, setWorkcount7] = useState("");
  // const [daysOff , setDaysOff] = useState([{ date: '' }]);

  const [formData, setFormData] = useState({
    addSalary: [
      {
        codeSpSalary: "",
        name: "",
        SpSalary: "",
        roundOfSalary: "",
        StaffType: "",
        nameType: "",
      },
    ],
  });
  const [showAdditionalInput, setShowAdditionalInput] = useState([]);

  const handleChangeSpSalary = async (e, index, key) => {
    const tmpId = await e.target.value;

    const newAddSalary = await [...formData.addSalary];
    if (key === "codeSpSalary") {
      let tmp = await searchAddSalaryList.find((item) => item.id === tmpId);
      if (tmp) {
        newAddSalary[index] = await {
          ...newAddSalary[index],
          [key]: tmpId,
          name: tmp.name,
        };
      } else {
        newAddSalary[index] = await {
          ...newAddSalary[index],
          [key]: tmpId,
          name: "",
        };
      }
    } else {
      newAddSalary[index] = await {
        ...newAddSalary[index],
        [key]: tmpId,
      };
    }

    await setFormData({
      ...formData,
      addSalary: newAddSalary,
    });
  };

  // const handleAddInput = () => {
  //     setFormData([...formData, { name: '', SpSalary: '', StaffType: '', nameType: '' }]);
  //     setShowAdditionalInput([...showAdditionalInput, false]);
  // };
  const handleAddInput = () => {
    setFormData({
      ...formData,
      addSalary: [
        ...formData.addSalary,
        {
          codeSpSalary: "",
          name: "",
          SpSalary: "",
          roundOfSalary: "",
          StaffType: "",
          nameType: "",
        },
      ],
    });
    setShowAdditionalInput([...showAdditionalInput, false]);
  };

  // const handleDeleteInput = (index) => {
  //     const newFormData = [...formData];
  //     newFormData.splice(index, 1);
  //     setFormData(newFormData);

  //     const newShowAdditionalInput = [...showAdditionalInput];
  //     newShowAdditionalInput.splice(index, 1);
  //     setShowAdditionalInput(newShowAdditionalInput);
  // };

  const handleDeleteInput = (index) => {
    const newAddSalary = [...formData.addSalary];
    newAddSalary.splice(index, 1);

    setFormData({
      ...formData,
      addSalary: newAddSalary,
    });

    const newShowAdditionalInput = [...showAdditionalInput];
    newShowAdditionalInput.splice(index, 1);
    setShowAdditionalInput(newShowAdditionalInput);
  };

  const [employeeListResult, setEmployeeListResult] = useState([]);
  const [showEmployeeListResult, setShowEmployeeListResult] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  // async function handleSearch(event) {
  //   event.preventDefault();

  //   //clean list employee
  //   setShowEmployeeListResult([]);

  //   //get value from form search
  //   const data = {
  //     searchWorkplaceId: searchWorkplaceId,
  //     searchWorkplaceName: searchWorkplaceName,
  //   };

  //   try {
  //     const response = await axios.post(endpoint + "/workplace/search", data);
  //     setSearchResult(response.data.workplaces);
  //     console.log("response", response);

  //     if (response.data.workplaces.length < 1) {
  //       window.location.reload();
  //     } else {
  //       const data1 = {
  //         employeeId: "",
  //         name: "",
  //         idCard: "",
  //         //   workPlace: searchWorkplaceId,
  //         workPlace: searchResult.workplaceId,
  //       };

  //       const response1 = await axios.post(
  //         endpoint + "/employee/search",
  //         data1
  //       );

  //       const filteredEmployees = response1.data.employees.filter(
  //         (employee) => employee.workplace === searchWorkplaceId
  //       );

  //       // await setEmployeeListResult(response1.data.employees);
  //       await setEmployeeListResult(filteredEmployees);

  //       // await alert(JSON.stringify(response1.data.employees , null ,2));
  //       // alert(response1.data );
  //       // alert(employeeListResult.length);
  //     }
  //   } catch (error) {
  //     // setMessage('ไม่พบผลการค้นหา กรุณาตรวจสอบข้อมูลที่ใช้ในการค้นหาอีกครั้ง');
  //     alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
  //     window.location.reload();
  //   }
  // }
  const [filteredWorkplaceList, setFilteredWorkplaceList] = useState([]);
  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  
  async function handleSearch(event) {
    event.preventDefault();
    //clean list employee
    setShowEmployeeListResult([]);
    // setWorkTimeDay_specialwork([]);

    // Frontend filtering when using new search fields
    if (searchPhoneNumber || searchIdCard || searchWorkPlace || staffName || staffLastname) {
      let filtered = [...employeeList];

      if (searchEmployeeId) {
        filtered = filtered.filter(emp => 
          emp.employeeId && emp.employeeId.includes(searchEmployeeId)
        );
      }

      if (staffName) {
        filtered = filtered.filter(emp => 
          emp.name && emp.name.toLowerCase().includes(staffName.toLowerCase())
        );
      }

      if (staffLastname) {
        filtered = filtered.filter(emp => 
          emp.lastName && emp.lastName.toLowerCase().includes(staffLastname.toLowerCase())
        );
      }

      if (searchWorkPlace) {
        filtered = filtered.filter(emp => 
          emp.workplace && emp.workplace.toLowerCase().includes(searchWorkPlace.toLowerCase())
        );
      }

      if (searchPhoneNumber) {
        filtered = filtered.filter(emp => 
          emp.phoneNumber && emp.phoneNumber.includes(searchPhoneNumber)
        );
      }

      if (searchIdCard) {
        filtered = filtered.filter(emp => 
          emp.idCard && emp.idCard.includes(searchIdCard)
        );
      }

      if (filtered.length === 0) {
        alert('ไม่พบพนักงานตามเงื่อนไขที่ค้นหา');
        return;
      }

      // Load first result
      const employee = filtered[0];
      
      let finalWorkplace = {};

      // ✅ ถ้ามี customWorkplace → ใช้เลย
      if (employee.customWorkplace && Object.keys(employee.customWorkplace).length > 0) {
        finalWorkplace = employee.customWorkplace;
        console.log("✅ ใช้การตั้งค่าเฉพาะบุคคล");
      } else {
        // 🔁 ไม่มี custom → ดึง workplace ปกติ
        if (!employee.workplace) {
          alert("พนักงานไม่มีข้อมูล workplace");
          return;
        }

        try {
          const wpRes = await axios.get(`${endpoint}/workplace/${employee.workplace}`);
          finalWorkplace = wpRes.data || {};
          console.log("✅ ใช้การตั้งค่าหน่วยงานปกติ");
        } catch (err) {
          console.error("❌ Error loading workplace:", err);
          alert('เกิดข้อผิดพลาดในการโหลดข้อมูลหน่วยงาน');
          return;
        }
      }

      const employeeWithWorkplace = {
        ...employee,
        effectiveWorkplace: finalWorkplace,
      };

      handleClickResult(finalWorkplace);
      setShowEmployeeListResult([employeeWithWorkplace]);
      return;
    }

    // Original search by employeeId only
    if (!searchEmployeeId) {
      alert('กรุณากรอกข้อมูลการค้นหาอย่างน้อย 1 ช่อง');
      return;
    }

    try {
      // 🔍 ค้นหาพนักงานจาก employeeId เท่านั้น
      const empRes = await axios.post(endpoint + "/employee/search", {
        employeeId: searchEmployeeId,
        name: "",
        idCard: "",
        workPlace: "",
      });

      const employee = empRes.data.employees?.[0];

      if (!employee) {
        alert('ไม่พบพนักงานรหัส: ' + searchEmployeeId);
        return;
      }

      let finalWorkplace = {};

      // ✅ ถ้ามี customWorkplace → ใช้เลย
      if (employee.customWorkplace && Object.keys(employee.customWorkplace).length > 0) {
        finalWorkplace = employee.customWorkplace;
        console.log("✅ ใช้การตั้งค่าเฉพาะบุคคล");
      } else {
        // 🔁 ไม่มี custom → ดึง workplace ปกติ
        if (!employee.workplace) {
          alert("พนักงานไม่มีข้อมูล workplace");
          return;
        }

        const wpRes = await axios.get(`${endpoint}/workplace/${employee.workplace}`);
        finalWorkplace = wpRes.data || {};
        console.log("✅ ใช้การตั้งค่าหน่วยงานปกติ");
      }

      // 🧾 รวมข้อมูลกลับเป็นชุดเดียว
      const employeeWithWorkplace = {
        ...employee,
        effectiveWorkplace: finalWorkplace,
      };

      // แสดงข้อมูลวันหยุดใน console
      console.log("📅 วันหยุดของพนักงาน:", finalWorkplace.daysOff);
      console.log("✅ ข้อมูลพนักงาน:", employeeWithWorkplace);

      // โหลดข้อมูลไปยังฟอร์ม
      handleClickResult(finalWorkplace);
      setShowEmployeeListResult([employeeWithWorkplace]);

    } catch (err) {
      console.error("❌ handleSearch error:", err);
      alert('เกิดข้อผิดพลาดในการค้นหา: ' + err.message);
    }

  }

  //set data to form
  function handleClickResult(workplace) {
    setNewWorkplace(false);

    set_id(workplace._id);
    setWorkplaceId(workplace.workplaceId);

    const filteredEmployees = employeeList.filter(
      (employee) => employee.workplace === searchWorkplaceId
    );
    console.log("searchWorkplaceId", searchWorkplaceId);
    setEmployeeListResult(filteredEmployees);

    setShowEmployeeListResult(filteredEmployees);
    setWorkplaceName(workplace.workplaceName);
    setWorkplaceArea(workplace.workplaceArea);
    setWorkOfWeek(workplace.workOfWeek);

    setWorkStart1(workplace.workStart1);
    setWorkEnd1(workplace.workEnd1);
    setWorkStart2(workplace.workStart2);
    setWorkEnd2(workplace.workEnd2);
    setWorkStart3(workplace.workStart3);
    setWorkEnd3(workplace.workEnd3);

    setWorkStartOt1(workplace.workStartOt1);
    setWorkEndOt1(workplace.workEndOt1);
    setWorkStartOt2(workplace.workStartOt2);
    setWorkEndOt2(workplace.workEndOt2);
    setWorkStartOt3(workplace.workStartOt3);
    setWorkEndOt3(workplace.workEndOt3);

    setWorkOfHour(workplace.workOfHour_subHour || workplace.workOfHour);
    setWorkOfMinute(workplace.workOfHour_subMinute || 0);
    setStartWorkOfOT(workplace.startWorkOfOT_subHour || 0);
    setStartWorkOfOTMinute(workplace.startWorkOfOT_subMinute || 0);
    setWorkOfOT(workplace.workOfOT_subHour || workplace.workOfOT);
    setWorkOfOTMinute(workplace.workOfOT_subMinute || 0);
    setBreakOfOT(workplace.workOfOT_breakMinute || 0);
    if (parseInt(workplace.workOfOT_breakMinute) == 20 || parseInt(workplace.workOfOT_breakMinute) == 30) {
      setIsCustom(false);
    } else {
      setIsCustom(true);
    }
    setWorkRate(workplace.workRate);
    setAddWorkRate(workplace.addWorkRate);
    setNewWorkRate(workplace.newWorkRate || (parseFloat(workplace.addWorkRate || '0') + parseFloat(workplace.workRate || '0')));
    setWorkRateEffectiveDate(workplace.workRateEffectiveDate || "");
    setWorkRateOT(workplace.workRateOT);
    setWorkTotalPeople(workplace.workTotalPeople);
    setDayoffRate(workplace.dayoffRate);
    setDayoffRateOT(workplace.dayoffRateOT);
    setDayoffRateHour(workplace.dayoffRateHour);
    setHoliday(workplace.holiday);
    setHolidayOT(workplace.holidayOT);
    setHolidayHour(workplace.holidayHour);
    setSalaryadd1(workplace.salaryadd1);
    setSalaryadd2(workplace.salaryadd2);
    setSalaryadd3(workplace.salaryadd3);
    setSalaryadd4(workplace.salaryadd4);
    setSalaryadd5(workplace.salaryadd5);
    setSalaryadd6(workplace.salaryadd6);
    setPersonalLeave(workplace.personalLeave);
    setPersonalLeaveNumber(workplace.personalLeaveNumber);
    setPersonalLeaveRate(workplace.personalLeaveRate);
    setSickLeave(workplace.sickLeave);
    setSickLeaveNumber(workplace.sickLeaveNumber);
    setSickLeaveRate(workplace.sickLeaveRate);
    setWorkRateDayoff(workplace.workRateDayoff);
    setWorkRateDayoffNumber(workplace.workRateDayoffNumber);
    setworkRateDayoffRate(workplace.workRateDayoffRate);
    setWorkplaceAddress(workplace.workplaceAddress);
    //setSelectedDates([...selectedDates, workplace.daysOff]);
setWorkTimeDayList_specialwork(workplace.specialWorkTimeDay || []);
// alert(JSON.stringify(workplace.specialWorkTimeDay ))

    ////////work day
    if (workplace.workday1 == "false") {
      setWorkday1(false);
    } else {
      setWorkday1(workplace.workday1);
    }
    if (workplace.workday2 == "false") {
      setWorkday2(false);
    } else {
      setWorkday2(workplace.workday2);
    }
    if (workplace.workday3 == "false") {
      setWorkday3(false);
    } else {
      setWorkday3(workplace.workday3);
    }
    if (workplace.workday4 == "false") {
      setWorkday4(false);
    } else {
      setWorkday4(workplace.workday4);
    }
    if (workplace.workday5 == "false") {
      setWorkday5(false);
    } else {
      setWorkday5(workplace.workday5);
    }
    if (workplace.workday6 == "false") {
      setWorkday6(false);
    } else {
      setWorkday6(workplace.workday6);
    }
    if (workplace.workday7 == "false") {
      setWorkday7(false);
    } else {
      setWorkday7(workplace.workday7);
    }

    setWorkcount1(workplace.workcount1);
    setWorkcount2(workplace.workcount2);
    setWorkcount3(workplace.workcount3);
    setWorkcount4(workplace.workcount4);
    setWorkcount5(workplace.workcount5);
    setWorkcount6(workplace.workcount6);
    setWorkcount7(workplace.workcount7);
    const dates = workplace.daysOff.map((dateString) => new Date(dateString));
    setSelectedDates(dates);
    
    // ดึงข้อมูลวันหยุดนักขัตฤกษ์จาก workplace
    if (workplace.publicHoliday && workplace.publicHoliday.length > 0) {
      try {
        console.log("กำลังโหลดข้อมูลวันหยุดนักขัตฤกษ์:", workplace.publicHoliday);
        
        const publicHolidayDatesFromDB = workplace.publicHoliday
          .map((holiday) => {
            try {
              if (typeof holiday === 'object' && holiday.date) {
                // ข้อมูลใหม่ที่มีทั้ง date และ note
                const dateStr = typeof holiday.date === 'string' ? holiday.date : holiday.date;
                const dateObj = new Date(dateStr);
                
                console.log("วันหยุดที่โหลด:", dateStr, "หมายเหตุ:", holiday.note || "(ไม่มี)");
                
                if (!isNaN(dateObj.getTime())) {
                  return {
                    date: dateObj,
                    note: holiday.note || ""
                  };
                }
                console.warn('วันที่ไม่ถูกต้องใน publicHoliday:', holiday.date);
                return null;
              } else if (holiday instanceof Date) {
                // ถ้าเป็น Date object อยู่แล้ว
                console.log("วันหยุดที่เป็น Date object:", holiday);
                return {
                  date: holiday,
                  note: ""
                };
              } else {
                // ข้อมูลเก่าที่เป็นแค่วันที่ (string)
                const dateObj = new Date(holiday);
                console.log("วันหยุดที่เป็น string:", holiday);
                if (!isNaN(dateObj.getTime())) {
                  return {
                    date: dateObj,
                    note: ""
                  };
                }
                console.warn('วันที่ไม่ถูกต้องใน publicHoliday:', holiday);
                return null;
              }
            } catch (error) {
              console.error('Error parsing holiday date:', error, holiday);
              return null;
            }
          })
          .filter(item => item !== null); // กรองข้อมูลวันที่ไม่ถูกต้องออก
        
        console.log("วันหยุดนักขัตฤกษ์ที่แปลงแล้ว:", 
          publicHolidayDatesFromDB.map(h => ({
            วันที่: `${h.date.getDate()}/${h.date.getMonth() + 1}/${h.date.getFullYear()}`,
            หมายเหตุ: h.note || "(ไม่มี)"
          }))
        );
        
        setPublicHolidayDates(publicHolidayDatesFromDB);
      } catch (error) {
        console.error('Error processing public holidays:', error);
        setPublicHolidayDates([]);
      }
    } else {
      setPublicHolidayDates([]);
    }
    
    setReason(workplace.reason);

    // employeeIdLists

    const initialFormData = {
      addSalary: workplace.addSalary.map((item) => ({
        name: item.name || "",
        codeSpSalary: item.codeSpSalary || "",
        SpSalary: item.SpSalary || "",
        roundOfSalary: item.roundOfSalary || "",
        StaffType: item.StaffType || "",
        nameType: item.nameType || "",
      })),
    };

    setFormData(initialFormData);
    // setFormData(workplace.addSalary);

    const employeeIdLists = workplace.employeeIdList.map((item) => [...item]);
    setEmployeeIdList(employeeIdLists);

    const employeeNameLists = workplace.employeeNameList.map((item) => [
      ...item,
    ]);
    setEmployeeNameList(employeeNameLists);

    setListEmployeeDay(workplace.listEmployeeDay);
    setListSpecialWorktime(workplace.listSpecialWorktime);
    setWorkTimeDayList(workplace.workTimeDay);
    setWorkTimeDayPersonList(workplace.workTimeDayPerson);
    
    // ตั้งค่า workRateChange และแยก day, month, year
    if (workplace.workRateChange) {
      const rateChangeDate = new Date(workplace.workRateChange);
      if (!isNaN(rateChangeDate.getTime())) {
        setWorkRateChange(rateChangeDate);
        setWorkRateDayChange(rateChangeDate.getDate());
        setWorkRateMonthChange(rateChangeDate.getMonth() + 1);
        setWorkRateYearChange(rateChangeDate.getFullYear());
      }
    }

    // ✅ โหลดข้อมูลเงินสงเคราะห์ลูกจ้าง
    if (workplace.employeeCompensation) {
      // Load new dual-rate structure
      if (workplace.employeeCompensation.Rate1_20 !== undefined || workplace.employeeCompensation.Rate21_30_31 !== undefined) {
        setEmployeeCompensationRate1_20((workplace.employeeCompensation.Rate1_20 * 100) || '');
        setEmployeeCompensationRate21_30_31((workplace.employeeCompensation.Rate21_30_31 * 100) || '');
      } else {
        // Backward compatibility with old structure
        setCurrentEmployeeCompensation(workplace.employeeCompensation.current || '');
        setAddEmployeeCompensation(workplace.employeeCompensation.adjustment || '');
        
        // คำนวณค่าจ้างใหม่
        const current = parseFloat(workplace.employeeCompensation.current || 0);
        const adjustment = parseFloat(workplace.employeeCompensation.adjustment || 0);
        const newRate = current + (current * adjustment / 100);
        setEmployeeCompensation(newRate.toString());
      }
      
      setEmployeeCompensationStartDate(
        workplace.employeeCompensation.effectiveDate 
          ? new Date(workplace.employeeCompensation.effectiveDate).toISOString().split('T')[0] 
          : ''
      );
    } else {
      // ล้างข้อมูลถ้าไม่มี
      setCurrentEmployeeCompensation('');
      setAddEmployeeCompensation('');
      setEmployeeCompensation('');
      setEmployeeCompensationStartDate('');
      // ล้างข้อมูล dual-rate ใหม่
      setEmployeeCompensationRate1_20('');
      setEmployeeCompensationRate21_30_31('');
    }

    // console.log(workplace);
    // // console.log(initialFormData);
    // console.log("formData", formData);
  }
  console.log("showEmployeeListResult", showEmployeeListResult);

  const handleCheckboxChange1 = () => {
    setWorkday1(!workday1);
  };
  const handleCheckboxChange2 = () => {
    setWorkday2(!workday2);
  };
  const handleCheckboxChange3 = () => {
    setWorkday3(!workday3);
  };
  const handleCheckboxChange4 = () => {
    setWorkday4(!workday4);
  };
  const handleCheckboxChange5 = () => {
    setWorkday5(!workday5);
  };
  const handleCheckboxChange6 = () => {
    setWorkday6(!workday6);
  };
  const handleCheckboxChange7 = () => {
    setWorkday7(!workday7);
  };

  // ฟังก์ชันสำหรับล้างข้อมูล form ทั้งหมด
  const clearForm = () => {
    // ล้างข้อมูลหลัก
    setWorkplaceId("");
    setWorkplaceName("");
    setWorkplaceArea("");
    setWorkOfWeek("");
    setWorkOfHour("");
    setWorkRate("");
    
    // ล้างข้อมูลเงินสงเคราะห์ลูกจ้าง
    setCurrentEmployeeCompensation("");
    setAddEmployeeCompensation("");
    setEmployeeCompensation("");
    setEmployeeCompensationStartDate("");
    // ล้างข้อมูล dual-rate ใหม่
    setEmployeeCompensationRate1_20("");
    setEmployeeCompensationRate21_30_31("");
    
    // ล้างข้อมูลวันทำงาน
    setWorkday1(false);
    setWorkday2(false);
    setWorkday3(false);
    setWorkday4(false);
    setWorkday5(false);
    setWorkday6(false);
    setWorkday7(false);
    
    // ล้างข้อมูลจำนวนคน
    setWorkcount1("");
    setWorkcount2("");
    setWorkcount3("");
    setWorkcount4("");
    setWorkcount5("");
    setWorkcount6("");
    setWorkcount7("");
    
    // ล้างข้อมูลการปรับเงินเดือน
    setFormData({
      addSalary: []
    });
    
    // ล้างข้อมูลรายการต่างๆ
    setListEmployeeDay([]);
    setListSpecialWorktime([]);
    setWorkTimeDayList([]);
    setWorkTimeDayPersonList([]);
    
    // ล้างข้อมูลวันหยุด
    setPublicHolidayDates([]);
    setVaccinationDates([]);
    
    // ล้างข้อมูลวันเริ่มต้นคำนวณ
    setWorkRateChange(null);
    setWorkRateDayChange("");
    setWorkRateMonthChange("");
    setWorkRateYearChange(new Date().getFullYear());
    
    console.log("Form cleared successfully");
  };

  //data for search

  // const [employeeListResult, setEmployeeListResult] = useState([]);

  // useEffect(() => {
  //   if (workplaceIdSend && workplaceNameSend) {
  //     setSearchWorkplaceId(workplaceIdSend);
  //     setSearchWorkplaceName(workplaceNameSend);
  //   } else {
  //     setSearchWorkplaceId("");
  //     setSearchWorkplaceName("");
  //   }
  // }, [workplaceIdSend, workplaceNameSend]); // Depend on the URL parameter

  useEffect(() => {
    // If either workplaceIdSend or workplaceNameSend is present, call handleSearch
    if (workplaceIdSend || workplaceNameSend) {
      setSearchWorkplaceId(workplaceIdSend || "");
      setSearchWorkplaceName(workplaceNameSend || "");

      // Call the handleSearch function
      handleSearch(workplaceIdSend, workplaceNameSend);
    }
  }, [workplaceIdSend, workplaceNameSend, handleSearch]);

  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting on Enter key press
  }

  async function handleManageWorkplace(event) {
    event.preventDefault();
//set WorkRateChange


    //get data from input in useState to data
    const data = {
      workplaceId: workplaceId,
      workplaceName: workplaceName,
      workplaceArea: workplaceArea,
      workOfWeek: workOfWeek,

      workStart1: workStart1,
      workEnd1: workEnd1,
      workStart2: workStart2,
      workEnd2: workEnd2,
      workStart3: workStart3,
      workEnd3: workEnd3,

      workStartOt1: workStartOt1,
      workEndOt1: workEndOt1,
      workStartOt2: workStartOt2,
      workEndOt2: workEndOt2,
      workStartOt3: workStartOt3,
      workEndOt3: workEndOt3,

      workOfHour: (parseInt(workOfHour || '0') + (parseFloat(workOfMinute || '0') / 60)),
      // workOfOT: (parseInt(workOfOT || '0') + ((parseFloat(workOfOTMinute || '0')- parseInt(breakOfOT || '0')) / 60)),
      workOfOT: parseFloat(workOfOTMinute || '0') === 0
        ? ((parseInt(workOfOT || '0') * 60 - parseInt(breakOfOT || '0')) / 60).toFixed(4)
        : (parseInt(workOfOT || '0') + (parseFloat(workOfOTMinute || '0') - parseInt(breakOfOT || '0')) / 60).toFixed(4),

      workOfHour_subHour: workOfHour || 0,
      workOfHour_subMinute: workOfMinute || 0,
      startWorkOfOT_subHour: startWorkOfOT || 0,
      startWorkOfOT_subMinute: startWorkOfOTMinute || 0,
      workOfOT_subHour: workOfOT || 0,
      workOfOT_subMinute: workOfOTMinute || 0,
      workOfOT_breakHour: '',
      workOfOT_breakMinute: breakOfOT || 0,

      workRate: workRate,
      addWorkRate: addWorkRate,
      newWorkRate: parseFloat(addWorkRate || '0') + parseFloat(workRate || '0'), // ค่าจ้างใหม่รวม
      workRateEffectiveDate: workRateEffectiveDate, // วันที่มีผลบังคับใช้
      workRateOT: workRateOT,
      workTotalPeople: workTotalPeople,
      countEmployee: showEmployeeListResult.length.toString(),
      dayoffRate: dayoffRate,
      dayoffRateOT: dayoffRateOT,
      dayoffRateHour: dayoffRateHour,
      holiday: holiday,
      holidayOT: holidayOT,
      holidayHour: holidayHour,
      salaryadd1: salaryadd1,
      salaryadd2: salaryadd2,
      salaryadd3: salaryadd3,
      salaryadd4: salaryadd4,
      salaryadd5: salaryadd5,
      salaryadd6: salaryadd6,
      personalLeave: personalLeave,
      personalLeaveNumber: personalLeaveNumber,
      personalLeaveRate: personalLeaveRate,
      sickLeave: sickLeave,
      sickLeaveNumber: sickLeaveNumber,
      sickLeaveRate: sickLeaveRate,
      workRateDayoff: workRateDayoff,
      workRateDayoffNumber: workRateDayoffNumber,
      workRateDayoffRate: workRateDayoffRate,
      // workplaceAddress: workplaceAddress,
      // แก้ไขการส่งข้อมูลวันที่ไป API เพื่อให้วันที่ตรงกับหน้าบ้าน
      daysOff: selectedDates.map(date => {
        // แปลง Date เป็น ISO string ที่เวลาเป็น 00:00:00 ตาม local timezone
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(Date.UTC(year, month, day));
      }),
      // เพิ่มข้อมูลวันหยุดนักขัตฤกษ์
      publicHoliday: publicHolidayDates
        .filter(holiday => {
          const date = holiday.date || holiday;
          return date instanceof Date && !isNaN(date.getTime());
        })
        .map(holiday => {
          try {
            const date = holiday.date || holiday;
            if (date instanceof Date && !isNaN(date.getTime())) {
              return {
                date: date.toISOString(), // แปลงเป็น ISO string เพื่อส่งไป API
                note: holiday.note || ""
              };
            }
            return null;
          } catch (error) {
            console.error("Error converting date for API:", error);
            return null;
          }
        })
        .filter(item => item !== null),
      workRateChange: workRateChange,
      reason: reason,

      // ✅ เพิ่มข้อมูลเงินสงเคราะห์ลูกจ้าง
      employeeCompensation: {
        Rate21_30_31: parseFloat(employeeCompensationRate21_30_31 || 0) / 100,
        Rate1_20: parseFloat(employeeCompensationRate1_20 || 0) / 100,
        effectiveDate: employeeCompensationStartDate ? new Date(employeeCompensationStartDate) : null,
        // เพิ่มประวัติเมื่อมีการเปลี่ยนแปลง
        ...(employeeCompensationRate1_20 || employeeCompensationRate21_30_31 ? {
          $push: {
            history: {
              Rate21_30_31: parseFloat(employeeCompensationRate21_30_31 || 0) / 100,
              Rate1_20: parseFloat(employeeCompensationRate1_20 || 0) / 100,
              effectiveDate: employeeCompensationStartDate ? new Date(employeeCompensationStartDate) : new Date(),
              updatedBy: 'admin', // หรือ user ID ที่ login อยู่
              updatedAt: new Date()
            }
          }
        } : {})
      },

      employeeIdList: employeeIdList,
      employeeNameList: employeeNameList,

      workday1: workday1 === true ? workday1 : false,
      workday2: workday2 === true ? workday2 : false,
      workday3: workday3 === true ? workday3 : false,
      workday4: workday4 === true ? workday4 : false,
      workday5: workday5 === true ? workday5 : false,
      workday6: workday6 === true ? workday6 : false,
      workday7: workday7 === true ? workday7 : false,

      workcount1: workcount1,
      workcount2: workcount2,
      workcount3: workcount3,
      workcount4: workcount4,
      workcount5: workcount5,
      workcount6: workcount6,
      workcount7: workcount7,
      addSalary: formData.addSalary,
      listEmployeeDay: listEmployeeDay,
      listSpecialWorktime: listSpecialWorktime,
      workTimeDay: workTimeDayList,
      workTimeDayPerson: workTimeDayPersonList,
      specialWorkTimeDay: workTimeDayList_specialwork || []
    };

    // if (file) {
    //     data.append('reason', file);
    // }
    // await alert(JSON.stringify(formData.addSalary,null,2));

    //check create or update Employee
    //check create or update Employee
if (newWorkplace) {
  // เพิ่มก่อน try block
  const requiredFields = {
    workplaceId: "รหัสหน่วยงาน",
    workplaceName: "ชื่อหน่วยงาน", 
    workplaceArea: "สถานที่ปฏิบัติงาน",
    workOfWeek: "จำนวนวันทำงานต่อสัปดาห์",
    workOfHour: "ชั่วโมงทำงาน",
    workRate: "ค่าจ้างรายวัน"
  };

  const missingFields = [];
  Object.entries(requiredFields).forEach(([key, label]) => {
    if (!data[key] || data[key].toString().trim() === "") {
      missingFields.push(label);
    }
  });

  // ตรวจสอบข้อมูล Employee Compensation (dual-rate structure)
  if (employeeCompensationRate1_20 && employeeCompensationRate1_20.trim() !== "") {
    if (isNaN(parseFloat(employeeCompensationRate1_20))) {
      missingFields.push("Rate สำหรับวันที่ 1-20 ต้องเป็นตัวเลข");
    }
  }
  
  if (employeeCompensationRate21_30_31 && employeeCompensationRate21_30_31.trim() !== "") {
    if (isNaN(parseFloat(employeeCompensationRate21_30_31))) {
      missingFields.push("Rate สำหรับวันที่ 21-30/31 ต้องเป็นตัวเลข");
    }
  }
  
  // ตรวจสอบวันที่มีผลบังคับใช้สำหรับ employee compensation
  if ((employeeCompensationRate1_20 || employeeCompensationRate21_30_31) && 
      (!employeeCompensationStartDate || employeeCompensationStartDate.trim() === "")) {
    missingFields.push("วันที่เริ่มใช้อัตราใหม่");
  }
  
  // ตรวจสอบข้อมูล Employee Compensation (old structure - backward compatibility)
  if (currentEmployeeCompensation && currentEmployeeCompensation.trim() !== "") {
    const compensationValidation = {
      currentRate: currentEmployeeCompensation,
      adjustmentPercentage: addEmployeeCompensation || "0",
      newRate: employeeCompensation || "0",
      effectiveDate: employeeCompensationStartDate
    };

    // ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
    if (isNaN(parseFloat(compensationValidation.currentRate))) {
      missingFields.push("ค่าจ้างปัจจุบันต้องเป็นตัวเลข");
    }
    if (isNaN(parseFloat(compensationValidation.adjustmentPercentage))) {
      missingFields.push("เปอร์เซ็นต์การปรับต้องเป็นตัวเลข");
    }
    if (isNaN(parseFloat(compensationValidation.newRate))) {
      missingFields.push("ค่าจ้างใหม่ต้องเป็นตัวเลข");
    }
    
    // ตรวจสอบวันที่มีผลบังคับใช้
    if (!compensationValidation.effectiveDate || compensationValidation.effectiveDate.trim() === "") {
      missingFields.push("วันที่เริ่มใช้อัตราใหม่");
    }
  }

  if (missingFields.length > 0) {
  Swal.fire({
    icon: "error",
    title: "บันทึกไม่สำเร็จ",
    text: `กรุณากรอกข้อมูลต่อไปนี้: ${missingFields.join(", ")}`,
    footer: '<a href="#" id="scroll-to-missing-field">คลิกที่นี่เพื่อไปยังฟิลด์ที่ขาดหายไป</a>',
    didOpen: () => {
      const footerLink = document.getElementById('scroll-to-missing-field');
      if (footerLink) {
        footerLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          const requiredFieldKeys = Object.keys(requiredFields);
          for (const fieldKey of requiredFieldKeys) {
            if (!data[fieldKey] || data[fieldKey].toString().trim() === "") {
              // ลองหาด้วย id ก่อน
              let element = document.getElementById(fieldKey);
              
              // ถ้าไม่เจอ ลองหาด้วย name attribute
              if (!element) {
                element = document.querySelector(`input[name="${fieldKey}"]`);
              }
              
              // ถ้ายังไม่เจอ ลองหาด้วย placeholder
              if (!element) {
                const placeholderMap = {
                  workplaceId: "รหัสหน่วยงาน",
                  workplaceName: "ชื่อหน่วยงาน",
                  workplaceArea: "สถานที่ปฏิบัติงาน",
                  workOfWeek: "จำนวนวันทำงานต่อสัปดาห์",
                  workOfHour: "ชั่วโมงทำงาน",
                  workRate: "บาท"
                };
                element = document.querySelector(`input[placeholder="${placeholderMap[fieldKey]}"]`);
              }
              
              console.log(`Field: ${fieldKey}, Element found:`, element);
              
              if (element) {
                element.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
                
                setTimeout(() => {
                  element.focus();
                  element.style.border = '3px solid red';
                  element.style.backgroundColor = '#ffe6e6';
                  
                  setTimeout(() => {
                    element.style.border = '';
                    element.style.backgroundColor = '';
                  }, 3000);
                }, 500);
                
                break;
              }
            }
          }
          
          Swal.close();
        });
      }
    }
  });
  return;
}

  // ตรวจสอบรหัสหน่วยงานซ้ำ
  const existingWorkplace = workplaceList.find(workplace => 
    workplace.workplaceId === data.workplaceId
  );
  
  if (existingWorkplace) {
    alert(`รหัสหน่วยงาน ${data.workplaceId} มีอยู่แล้วในระบบ กรุณาใช้รหัสอื่น`);
    return;
  }

  // แสดงข้อมูลสรุปก่อนบันทึก
  let summaryText = `
    หน่วยงาน: ${data.workplaceName}
    รหัส: ${data.workplaceId}
    สถานที่: ${data.workplaceArea}
    จำนวนวันทำงาน: ${data.workOfWeek} วัน/สัปดาห์
    ชั่วโมงทำงาน: ${data.workOfHour} ชั่วโมง
    ค่าจ้างรายวัน: ${data.workRate} บาท
  `;

  // เพิ่มข้อมูลเงินสงเคราะห์ลูกจ้างถ้ามี (dual-rate structure)
  if ((employeeCompensationRate1_20 && employeeCompensationRate1_20.trim() !== "") || 
      (employeeCompensationRate21_30_31 && employeeCompensationRate21_30_31.trim() !== "")) {
    summaryText += `
    
    ข้อมูลเงินสงเคราะห์ลูกจ้าง:
    Rate สำหรับวันที่ 1-20: ${employeeCompensationRate1_20 || 0}%
    Rate สำหรับวันที่ 21-30/31: ${employeeCompensationRate21_30_31 || 0}%
    วันที่เริ่มใช้: ${employeeCompensationStartDate ? new Date(employeeCompensationStartDate).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
    `;
  }
  
  // เพิ่มข้อมูลเงินสงเคราะห์ลูกจ้างถ้ามี (old structure - backward compatibility)
  if (currentEmployeeCompensation && currentEmployeeCompensation.trim() !== "") {
    summaryText += `
    
    ข้อมูลเงินสงเคราะห์ลูกจ้าง (รูปแบบเก่า):
    ค่าจ้างปัจจุบัน: ${parseFloat(currentEmployeeCompensation).toLocaleString()} บาท
    เปอร์เซ็นต์การปรับ: ${addEmployeeCompensation}%
    ค่าจ้างใหม่: ${parseFloat(employeeCompensation || 0).toLocaleString()} บาท
    วันที่เริ่มใช้: ${new Date(employeeCompensationStartDate).toLocaleDateString('th-TH')}
    `;
  }

  const confirmResult = await Swal.fire({
    title: "ยืนยันการบันทึกข้อมูล",
    html: `<pre style="text-align: left; white-space: pre-wrap;">${summaryText}</pre>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    reverseButtons: true
  });

  if (!confirmResult.isConfirmed) {
    return;
  }
      
  // แสดงข้อมูลที่จะส่งไป API สำหรับ debugging
  console.log("Data being sent to API:", JSON.stringify(data, null, 2));
  
  try {
    const response = await axios.post(endpoint + "/workplace/create", data);
    if (response) {
      let successMessage = `ข้อมูลหน่วยงาน "${data.workplaceName}" ถูกบันทึกเรียบร้อยแล้ว`;
      
      // เพิ่มข้อความสำหรับเงินสงเคราะห์ลูกจ้างถ้ามีการบันทึก (dual-rate structure)
      if ((employeeCompensationRate1_20 && employeeCompensationRate1_20.trim() !== "") || 
          (employeeCompensationRate21_30_31 && employeeCompensationRate21_30_31.trim() !== "")) {
        successMessage += `\n\nรวมถึงข้อมูลเงินสงเคราะห์ลูกจ้าง:\n• Rate สำหรับวันที่ 1-20: ${employeeCompensationRate1_20 || 0}%\n• Rate สำหรับวันที่ 21-30/31: ${employeeCompensationRate21_30_31 || 0}%`;
      }
      
      // เพิ่มข้อความสำหรับเงินสงเคราะห์ลูกจ้างถ้ามีการบันทึก (old structure - backward compatibility)
      if (currentEmployeeCompensation && currentEmployeeCompensation.trim() !== "") {
        successMessage += `\n\nรวมถึงข้อมูลเงินสงเคราะห์ลูกจ้าง (รูปแบบเก่า):\n• ค่าจ้างปัจจุบัน: ${parseFloat(currentEmployeeCompensation || 0).toLocaleString()} บาท\n• ปรับเพิ่ม: ${addEmployeeCompensation}%\n• ค่าจ้างใหม่: ${parseFloat(employeeCompensation || 0).toLocaleString()} บาท`;
      }

      Swal.fire({
        title: "บันทึกสำเร็จ",
        html: successMessage.replace(/\n/g, '<br>'),
        icon: "success",
        draggable: true
      });
      
      // ล้างข้อมูล form หลังจากบันทึกสำเร็จ
      clearForm();
      
      // sync วันหยุดนักขัตฤกษ์ไป API หลังจากสร้างหน่วยงานสำเร็จ
      if (publicHolidayDates.length > 0) {
        await updatePublicHolidayToAPI(publicHolidayDates);
      }
    }
  } catch (error) {
    console.error("Error details:", error);
    console.log("Response data:", error.response?.data);
    console.log("Status code:", error.response?.status);
    
    // แสดง error message จาก API response (ถ้ามี)
    if (error.response && error.response.data) {
      const apiErrorMessage = error.response.data.message || 
                             error.response.data.error || 
                             error.response.data.details ||
                             JSON.stringify(error.response.data);
      
      // ตรวจสอบ duplicate key error
      if (apiErrorMessage.includes("E11000") && apiErrorMessage.includes("workplaceId")) {
        alert(`รหัสหน่วยงาน ${data.workplaceId} มีอยู่แล้วในระบบ กรุณาใช้รหัสอื่น`);
      } else {
        alert(`เกิดข้อผิดพลาดจาก Server: ${apiErrorMessage}`);
      }
      
      // ถ้า API ส่ง validation errors มา (เช่น required fields)
      if (error.response.data.validationErrors) {
        console.log("Validation errors:", error.response.data.validationErrors);
        const validationErrors = error.response.data.validationErrors;
        const errorList = Object.keys(validationErrors).map(key => 
          `${key}: ${validationErrors[key]}`
        ).join('\n');
        alert(`ข้อมูลที่จำเป็นต้องกรอก:\n${errorList}`);
      }
    } else {
      // Network error หรือ error อื่นๆ
    
    }
    
    // แสดงข้อมูลที่ส่งไปให้ API เพื่อช่วยในการ debug
    console.log("Data sent to API:", data);
  }
} else {
  //update workplace data

  // Make the API call to update the resource by ID
  try {
    const response = await axios.put(
      endpoint + "/workplace/update/" + _id,
      data
    );
    // setEmployeesResult(response.data.employees);
    if (response) {
      Swal.fire({
        title: "บันทึกสำเร็จ",
        text: "ข้อมูลหน่วยงานถูกบันทึกเรียบร้อยแล้ว",
        icon: "success",
        draggable: true
      });
      
      // sync วันหยุดนักขัตฤกษ์ไป API หลังจากอัปเดตหน่วยงานสำเร็จ
      if (publicHolidayDates.length > 0) {
        await updatePublicHolidayToAPI(publicHolidayDates);
      }
      
      // Clear the query parameters
      const newUrl = window.location.origin + window.location.pathname; // Removes the query string

      // Update the URL without reloading the page
      window.history.replaceState({}, document.title, newUrl);
      window.location.reload();
    }
      } catch (error) {
        alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
        window.location.reload();
      }
    }
  }

  console.log("selectedDates", selectedDates);

  const bordertable = {
    borderLeft: "2px solid #000",
  };

  console.log(formData);

  useEffect(() => {
    let d = holiday || 0;
    let h = workOfHour || 0;
    let wr = workRate || 0;

    if (d < 10) {
      d = wr * d;
    }

    let wrh = h !== 0 ? d / h : 0; // Avoid division by zero

    if (isNaN(wrh)) {
      wrh = 0; // If result is NaN, set it to 0
    }

    // setHolidayHour(wrh);
  }, [holiday, workOfHour, workRate]);

  function handleChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  // async function handleUpload() {
  //     if (!file) {
  //         alert('Please select a file first.');
  //         return;
  //     }

  //     const formData = new FormData();
  //     formData.append('image', file);

  //     try {
  //         const response = await axios.post(endpoint + '/workplace/search', formData, {
  //             headers: {
  //                 'Content-Type': 'multipart/form-data',
  //             },
  //         });
  //         console.log('Upload success:', response.data);
  //     } catch (error) {
  //         console.error('Upload error:', error);
  //     }
  // }

  //Special work - Added beforeStartTimeOT_specialwork and beforeEndTimeOT_specialwork fields
  const [workDate_specialwork, setWorkDate_specialwork] = useState(null);
  const [workTimeDay_specialwork, setWorkTimeDay_specialwork] = useState({
    shift_specialwork: "",
    beforeStartTimeOT_specialwork: "", // เข้า OT ก่อน
    beforeEndTimeOT_specialwork: "", // ออก OT ก่อน  
    startTime_specialwork: "",
    endTime_specialwork: "",
    startTimeOT_specialwork: "",
    endTimeOT_specialwork: "",
    payment_specialwork: "",
    paymentOT_specialwork: "",
    workDetail_specialwork: "",
    employees_specialwork: [],
  });

  const [workTimeDayList_specialwork, setWorkTimeDayList_specialwork] = useState([]);
  const shiftWork_specialwork = ["กะเช้า", "กะบ่าย", "กะดึก", "กะพิเศษ"];
  const positionWork_specialwork = [
    "ทั้งหมด",
"หัวหน้าควบคุมงาน",
"ผู้ช่วยผู้ควบคุมงาน",
"พนักงานทำความสะอาด",
"พนักงานทำความสะอาดรอบนอก",
"พนักงานเสิร์ฟ",
"พนักงานคนสวน",
"พนักงานแรงงานชาย",
"กรรมการผู้จัดการ",
"ผู้จัดการทั่วไป",
"ผู้จัดการฝ่ายการตลาด",
"ผู้จัดการฝ่ายบัญชี/การเงิน",
"ผู้จัดการฝ่ายบุคคล",
"เจ้าหน้าที่ฝ่ายบัญชี/การเงิน",
"เจ้าหน้าที่ฝ่ายบุคคล",
"เจ้าหน้าที่ฝ่ายจัดซื้อ",
"เจ้าหน้าที่ธุรการฝ่ายขาย",
"เจ้าหน้าที่ฝ่ายการตลาด",
"เจ้าหน้าที่ฝ่ายปฏิบัติการ",
"เจ้าหน้าที่ฝ่ายปฏิบัติการ(สายตรวจ)",
"เจ้าหน้าที่ฝ่ายยานพาหนะ",
"เจ้าหน้าที่ฝ่ายไอที",
"เจ้าหน้าที่ฝ่ายสโตร์",
"เจ้าหน้าที่ความปลอดภัยในการทำงาน(จป)",
"ธุรการทั่วไป",
"หัวหน้าฝ่ายปฏิบัติการ",
"หัวหน้าฝ่ายบัญชี/การเงิน",
"หัวหน้าฝ่ายสโตร์"
];

  // Handle input changes for the main form
  const handleInputChange_specialwork = (e) => {
    const { name, value } = e.target;
    setWorkTimeDay_specialwork((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for employees
  const handleInputChangePerson_specialwork = (e, index) => {
    const { name, value } = e.target;
    const updatedEmployees_specialwork = [...workTimeDay_specialwork.employees_specialwork];
    updatedEmployees_specialwork[index][name] = value;
    setWorkTimeDay_specialwork((prev) => ({ ...prev, employees_specialwork: updatedEmployees_specialwork }));
  };
   // ฟังก์ชั่นแก้ไขข้อมูลใน workTimeDayPersonList
  const handleEditTimePersonList = (index) => {
    // ดึงข้อมูลที่ต้องการแก้ไขจาก list
    const itemToEdit = workTimeDayPersonList[index];
    // นำข้อมูลไปใส่ใน state หลักเพื่อให้ฟอร์มกรอกข้อมูลแสดงข้อมูลเดิม
    setWorkTimeDayPerson({ ...itemToEdit });
    // ลบรายการเดิมออกจาก list เพื่อรอการบันทึกใหม่
    setWorkTimeDayPersonList(function(prevList) {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  // Add a new employee row
  const handleAddTimePerson_specialwork = () => {
    setWorkTimeDay_specialwork((prev) => ({
      ...prev,
      employees_specialwork: [...prev.employees_specialwork, { positionWork_specialwork: "", countPerson_specialwork: "" }],
    }));
  };

  // Remove an employee row
  const handleRemoveTimePerson_specialwork = (index) => {
    const updatedEmployees_specialwork = workTimeDay_specialwork.employees_specialwork.filter((_, i) => i !== index);
    setWorkTimeDay_specialwork((prev) => ({ ...prev, employees_specialwork: updatedEmployees_specialwork }));
  };

  // ✅ Add work time to the list (FIXED ISSUE)
  
    const handleAddTimeList_specialwork = () => {
  if (!workDate_specialwork) {
    alert("กรุณาเลือกวันที่ก่อนเพิ่มรายการ");
    return;
  }

    // ✅ Ensure data is properly saved before updating state
    const newEntry = {
      ...workTimeDay_specialwork,
      day_specialwork: workDate_specialwork.toLocaleDateString("th-TH"),
      // ✅ Use workRate as default if payment_specialwork is empty
      payment_specialwork: workTimeDay_specialwork.payment_specialwork || workRate || 0,
      // ✅ Use calculated OT rate as default if paymentOT_specialwork is empty
      paymentOT_specialwork: workTimeDay_specialwork.paymentOT_specialwork || 
        ((parseFloat(workRate || 0) / 8) * parseFloat(workRateOT || 1.5)) || 0,
      employees_specialwork: [...workTimeDay_specialwork.employees_specialwork], // ✅ Copy employees list
    };

    setWorkTimeDayList_specialwork((prev) => [...prev, newEntry]);

    // Reset input fields to default values after adding to list
    setWorkTimeDay_specialwork((prev) => ({
      shift_specialwork: "",
      beforeStartTimeOT_specialwork: "", // เข้า OT ก่อน
      beforeEndTimeOT_specialwork: "", // ออก OT ก่อน  
      startTime_specialwork: "",
      endTime_specialwork: "",
      startTimeOT_specialwork: "",
      endTimeOT_specialwork: "",
      payment_specialwork: "",
      paymentOT_specialwork: "",
      workDetail_specialwork: "",
      employees_specialwork: [], // Only reset employees list
    }));
    setWorkDate_specialwork(null); // Only reset date
  };

  // ✅ Remove a work time row
  const handleRemoveTimeList_specialwork = (index) => {
    setWorkTimeDayList_specialwork((prev) => prev.filter((_, i) => i !== index));
  };

//===== โค้ดเพิ่มเติมสำหรับการทำงานเฉพาะบุคคล
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [staffId, setStaffId] = useState(""); //รหัสพนักงาน
  const [staffName, setStaffName] = useState(""); //ชื่อ
  const [staffLastname, setStaffLastname] = useState(""); //นามสกุล
  const [staffFullName, setStaffFullName] = useState(""); //ชื่อเต็ม
  const [searchWorkPlace, setSearchWorkPlace] = useState(""); //หน่วยงาน
  const [searchPhoneNumber, setSearchPhoneNumber] = useState(""); //เบอร์โทรศัพท์
  const [searchIdCard, setSearchIdCard] = useState(""); //บัตรประชาชน


  const handleStaffIdChange = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);
    setSearchEmployeeId(selectedStaffId);

    // Find the corresponding employee and set the staffName

    const selectedEmployee = employeeList.find(
      (employee) => employee.employeeId === selectedStaffId
    );
    if (selectedEmployee) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setStaffFullName(selectedEmployee.name + " " + selectedEmployee.lastName);
      setWorkplaceIdEMP(selectedEmployee.workplace);
    } else {
      setStaffName("");
      setStaffFullName("");
      setSearchEmployeeName("");
    }
  };

  const callHandleStaffNameChangeWithEmployeeId = async (employeeId) => {
    // Assuming you have access to the event object or you can create a synthetic event
    // You can create a synthetic event using `new Event('change')`
    const syntheticEvent = await new Event("change");

    // You need to attach a `target` property to the synthetic event
    // with a `value` property containing the employeeId
    syntheticEvent.target = await { value: employeeId };

    // Call handleStaffNameChange with the synthetic event
    await handleStaffIdChange(syntheticEvent);
  };

  const handleStaffNameChange = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(
      (employee) =>
        employee.name + " " + employee.lastName === selectedStaffName
    );
    const selectedEmployeeFName = employeeList.find(
      (employee) => employee.name === selectedStaffName
    );

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
      setWorkplaceIdEMP(selectedEmployee.workplace);
    } else {
      setStaffId("");
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedStaffName);
  };

  const handleStaffFirstNameChange = (e) => {
    const selectedFirstName = e.target.value;
    setStaffName(selectedFirstName);

    // Find employee by first name
    const selectedEmployee = employeeList.find(
      (employee) => employee.name === selectedFirstName
    );

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
      setStaffLastname(selectedEmployee.lastName);
      setWorkplaceIdEMP(selectedEmployee.workplace);
    }
  };

  const handleStaffLastNameChange = (e) => {
    const selectedLastName = e.target.value;
    setStaffLastname(selectedLastName);

    // Find employee by last name
    const selectedEmployee = employeeList.find(
      (employee) => employee.lastName === selectedLastName
    );

    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
      setSearchEmployeeId(selectedEmployee.employeeId);
      setStaffName(selectedEmployee.name);
      setWorkplaceIdEMP(selectedEmployee.workplace);
    }
  };

  const handleWorkPlaceChange = (e) => {
    setSearchWorkPlace(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setSearchPhoneNumber(e.target.value);
  };

  const handleIdCardChange = (e) => {
    setSearchIdCard(e.target.value);
  };


async function handleSaveCustomWorkplace() {
  if (!showEmployeeListResult || showEmployeeListResult.length === 0) {
    alert("ไม่พบพนักงานที่ต้องการบันทึก");
    return;
  }

  const employeeId = showEmployeeListResult[0].employeeId;

  // ✅ เตรียม customWorkplace จาก state ทั้งหมด (เหมือนใน handleManageWorkplace)
  const customWorkplace = {
          workplaceId: workplaceId,
      workplaceName: workplaceName,
      workplaceArea: workplaceArea,
      workOfWeek: workOfWeek,

      workStart1: workStart1,
      workEnd1: workEnd1,
      workStart2: workStart2,
      workEnd2: workEnd2,
      workStart3: workStart3,
      workEnd3: workEnd3,

      workStartOt1: workStartOt1,
      workEndOt1: workEndOt1,
      workStartOt2: workStartOt2,
      workEndOt2: workEndOt2,
      workStartOt3: workStartOt3,
      workEndOt3: workEndOt3,

      workOfHour: (parseInt(workOfHour || '0') + (parseFloat(workOfMinute || '0') / 60)),
      // workOfOT: (parseInt(workOfOT || '0') + ((parseFloat(workOfOTMinute || '0')- parseInt(breakOfOT || '0')) / 60)),
      workOfOT: parseFloat(workOfOTMinute || '0') === 0
        ? ((parseInt(workOfOT || '0') * 60 - parseInt(breakOfOT || '0')) / 60).toFixed(4)
        : (parseInt(workOfOT || '0') + (parseFloat(workOfOTMinute || '0') - parseInt(breakOfOT || '0')) / 60).toFixed(4),

      workOfHour_subHour: workOfHour || 0,
      workOfHour_subMinute: workOfMinute || 0,
      startWorkOfOT_subHour: startWorkOfOT || 0,
      startWorkOfOT_subMinute: startWorkOfOTMinute || 0,
      workOfOT_subHour: workOfOT || 0,
      workOfOT_subMinute: workOfOTMinute || 0,
      workOfOT_breakHour: '',
      workOfOT_breakMinute: breakOfOT || 0,

      workRate: workRate,
      addWorkRate: addWorkRate,
      newWorkRate: parseFloat(addWorkRate || '0') + parseFloat(workRate || '0'), // ค่าจ้างใหม่รวม
      workRateEffectiveDate: workRateEffectiveDate, // วันที่มีผลบังคับใช้
      workRateOT: workRateOT,
      workTotalPeople: workTotalPeople,
      countEmployee: showEmployeeListResult.length.toString(),
      dayoffRate: dayoffRate,
      dayoffRateOT: dayoffRateOT,
      dayoffRateHour: dayoffRateHour,
      holiday: holiday,
      holidayOT: holidayOT,
      holidayHour: holidayHour,
      salaryadd1: salaryadd1,
      salaryadd2: salaryadd2,
      salaryadd3: salaryadd3,
      salaryadd4: salaryadd4,
      salaryadd5: salaryadd5,
      salaryadd6: salaryadd6,
      personalLeave: personalLeave,
      personalLeaveNumber: personalLeaveNumber,
      personalLeaveRate: personalLeaveRate,
      sickLeave: sickLeave,
      sickLeaveNumber: sickLeaveNumber,
      sickLeaveRate: sickLeaveRate,
      workRateDayoff: workRateDayoff,
      workRateDayoffNumber: workRateDayoffNumber,
      workRateDayoffRate: workRateDayoffRate,
      // workplaceAddress: workplaceAddress,
      // แก้ไขการส่งข้อมูลวันที่ไป API เพื่อให้วันที่ตรงกับหน้าบ้าน
      daysOff: selectedDates.map(date => {
        // แปลง Date เป็น ISO string ที่เวลาเป็น 00:00:00 ตาม local timezone
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(Date.UTC(year, month, day));
      }),
      // เพิ่มข้อมูลวันหยุดนักขัตฤกษ์
      publicHoliday: publicHolidayDates
        .filter(holiday => {
          const date = holiday.date || holiday;
          return date instanceof Date && !isNaN(date.getTime());
        })
        .map(holiday => {
          try {
            const date = holiday.date || holiday;
            if (date instanceof Date && !isNaN(date.getTime())) {
              return {
                date: date.toISOString(), // แปลงเป็น ISO string เพื่อส่งไป API
                note: holiday.note || ""
              };
            }
            return null;
          } catch (error) {
            console.error("Error converting date for API:", error);
            return null;
          }
        })
        .filter(item => item !== null),
      workRateChange: workRateChange,
      reason: reason,

      // ✅ เพิ่มข้อมูลเงินสงเคราะห์ลูกจ้าง
      employeeCompensation: {
        Rate21_30_31: parseFloat(employeeCompensationRate21_30_31 || 0) / 100,
        Rate1_20: parseFloat(employeeCompensationRate1_20 || 0) / 100,
        effectiveDate: employeeCompensationStartDate ? new Date(employeeCompensationStartDate) : null,
        // เพิ่มประวัติเมื่อมีการเปลี่ยนแปลง
        ...(employeeCompensationRate1_20 || employeeCompensationRate21_30_31 ? {
          $push: {
            history: {
              Rate21_30_31: parseFloat(employeeCompensationRate21_30_31 || 0) / 100,
              Rate1_20: parseFloat(employeeCompensationRate1_20 || 0) / 100,
              effectiveDate: employeeCompensationStartDate ? new Date(employeeCompensationStartDate) : new Date(),
              updatedBy: 'admin', // หรือ user ID ที่ login อยู่
              updatedAt: new Date()
            }
          }
        } : {})
      },

      employeeIdList: employeeIdList,
      employeeNameList: employeeNameList,

      workday1: workday1 === true ? workday1 : false,
      workday2: workday2 === true ? workday2 : false,
      workday3: workday3 === true ? workday3 : false,
      workday4: workday4 === true ? workday4 : false,
      workday5: workday5 === true ? workday5 : false,
      workday6: workday6 === true ? workday6 : false,
      workday7: workday7 === true ? workday7 : false,

      workcount1: workcount1,
      workcount2: workcount2,
      workcount3: workcount3,
      workcount4: workcount4,
      workcount5: workcount5,
      workcount6: workcount6,
      workcount7: workcount7,
      addSalary: formData.addSalary,
      listEmployeeDay: listEmployeeDay,
      listSpecialWorktime: listSpecialWorktime,
      workTimeDay: workTimeDayList,
      workTimeDayPerson: workTimeDayPersonList,
      specialWorkTimeDay: workTimeDayList_specialwork || []
  };

  try {
    console.log("🔍 [DEBUG] กำลังบันทึก customWorkplace สำหรับพนักงาน:", employeeId);
    console.log("📦 [DEBUG] ข้อมูลวันหยุดที่จะบันทึก:");
    console.log("   - dayoffRate:", customWorkplace.dayoffRate);
    console.log("   - dayoffRateOT:", customWorkplace.dayoffRateOT);
    console.log("   - dayoffRateHour:", customWorkplace.dayoffRateHour);
    console.log("   - holiday:", customWorkplace.holiday);
    console.log("   - holidayOT:", customWorkplace.holidayOT);
    console.log("   - holidayHour:", customWorkplace.holidayHour);
    console.log("   - publicHoliday:", customWorkplace.publicHoliday);
    console.log("   - daysOff:", customWorkplace.daysOff);
    
    const res = await axios.put(`${endpoint}/employee/${employeeId}/custom-workplace`, {
      customWorkplace,
    });

    alert("✅ บันทึก ตั้งค่าการทำงานเฉพาะบุคคลสำเร็จ");
    console.log("📦 บันทึกแล้ว:", res.data.customWorkplace);
  } catch (err) {
    console.error("❌ บันทึก customWorkplace ล้มเหลว:", err);
    alert("เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูล");
  }
}

async function handleDeleteCustomWorkplace() {
  if (!showEmployeeListResult || showEmployeeListResult.length === 0) {
    alert("ไม่พบพนักงานที่ต้องการลบ customWorkplace");
    return;
  }

  const employeeId = showEmployeeListResult[0].employeeId;

  const confirmDelete = window.confirm(
    `คุณแน่ใจหรือไม่ว่าต้องการลบ customWorkplace ของพนักงานรหัส ${employeeId}?`
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`${endpoint}/employee/${employeeId}/custom-workplace`);
    alert("✅ ลบ การตั้งค่าเฉพาะบุคคลสำเร็จ");

    // 🌀 รีโหลดใหม่ เพื่อให้กลับไปใช้ workplace ปกติ
    await handleSearch({ preventDefault: () => {} }); // 👈 reuse การค้นหาปัจจุบัน
  } catch (error) {
    console.error("❌ ลบ customWorkplace ไม่สำเร็จ:", error);
    alert("เกิดข้อผิดพลาดในการลบ");
  }
}


  return (
    <div className="tab-setting-content" style={{ padding: '20px', backgroundColor: '#f4f6f9' }}>
      <section className="content">
            <div className="container-fluid">
              <div className="card shadow-sm" style={{ borderRadius: '10px', border: 'none' }}>
                <div className="card-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', padding: '20px', borderRadius: '10px 10px 0 0' }}>
                  <h3 className="card-title" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#333', margin: 0 }}>
                    <i className="fas fa-user-cog mr-2" style={{ color: 'rgb(43,93,142)' }}></i>
                    ตั้งค่าการทำงานเฉพาะบุคคล
                  </h3>
                </div>
                <div className="card-body" style={{ padding: '30px' }}>
              {/* <section className="Frame" style={{ border: 'none', padding: 0, margin: 0 }}>
                <div class="col-md-12">
                  <form onSubmit={handleSearch}>
                
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchEmployeeId">รหัสพนักงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสพนักงาน"
                            value={staffId == "null" ? "" : staffId}
                            onChange={handleStaffIdChange}
                            onInput={(e) => {
                              // Remove any non-digit characters
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                            }}
                            list="staffIdList"
                          />
                          <datalist id="staffIdList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.employeeId}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchWorkPlace">หน่วยงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="searchWorkPlace"
                            placeholder="หน่วยงาน"
                            value={searchWorkPlace}
                            onChange={handleWorkPlaceChange}
                            list="workPlaceList"
                          />
                          <datalist id="workPlaceList">
                            {[...new Set(employeeList.map((employee) => employee.workplace))].map((workplace, index) => (
                              <option key={index} value={workplace} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>

    
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchFirstName">ชื่อ</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffFirstName"
                            placeholder="ชื่อ"
                            value={staffName}
                            onChange={handleStaffFirstNameChange}
                            list="staffFirstNameList"
                          />
                          <datalist id="staffFirstNameList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.name}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchLastName">นามสกุล</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffLastName"
                            placeholder="นามสกุล"
                            value={staffLastname}
                            onChange={handleStaffLastNameChange}
                            list="staffLastNameList"
                          />
                          <datalist id="staffLastNameList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.lastName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>

     
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchPhoneNumber">เบอร์โทรศัพท์</label>
                          <input
                            type="text"
                            className="form-control"
                            id="searchPhoneNumber"
                            placeholder="เบอร์โทรศัพท์"
                            value={searchPhoneNumber}
                            onChange={handlePhoneNumberChange}
                            list="phoneNumberList"
                          />
                          <datalist id="phoneNumberList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.phoneNumber}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchIdCard">หมายเลขบัตรประชาชน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="searchIdCard"
                            placeholder="หมายเลขบัตรประชาชน"
                            value={searchIdCard}
                            onChange={handleIdCardChange}
                            list="idCardList"
                          />
                          <datalist id="idCardList">
                            {employeeList.map((employee) => (
                              <option
                                key={employee.employeeId}
                                value={employee.idCard}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>


                    <div class="d-flex justify-content-center">
                      <button class="btn b_save">
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button>
                    </div>
                  </form>
                  <br />
              
                  <div class="d-flex justify-content-center">
                    {searchResult.length > 0 ? (
                      <h2 class="title">
                        ผลลัพธ์ {searchResult.length} รายการ
                      </h2>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div class="d-flex justify-content-center">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <ul
                            style={{ listStyle: "none", marginLeft: "-2rem" }}
                          >
                            {searchResult.map((workplace) => (
                              <li
                                key={workplace.id}
                                onClick={() => handleClickResult(workplace)}
                                style={{ cursor: "pointer" }}
                              >
                                รหัส {workplace.workplaceId} หน่วยงาน{" "}
                                {workplace.workplaceName}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}
              {/* <!--Frame--> */}
              {/* <form onSubmit={handleManageWorkplace}> */}
              <form onSubmit={handleFormSubmit}>
                {/* <h2 class="title">ตั้งค่าหน่วยงาน</h2> */}
                {/* <section class="Frame">
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="workplaceId">รหัสหน่วยงาน<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            id="workplaceId"
                            placeholder="รหัสหน่วยงาน"
                            value={workplaceId}
                            onChange={(e) => setWorkplaceId(e.target.value)}
                            onInput={(e) => {
                      
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="workplaceName">ชื่อหน่วยงาน<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            id="workplaceName"
                            placeholder="ชื่อหน่วยงาน"
                            value={workplaceName}
                            onChange={(e) => setWorkplaceName(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="workplaceArea">สถานที่ปฏิบัติงาน<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            id="workplaceArea"
                            placeholder="สถานที่ปฏิบัติงาน"
                            value={workplaceArea}
                            onChange={(e) => setWorkplaceArea(e.target.value)}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="workOfWeek">
                            จำนวนวันทำงานต่อสัปดาห์<span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="workOfWeek"
                            placeholder="จำนวนวันทำงานต่อสัปดาห์"
                            value={workOfWeek}
                            onChange={(e) => setWorkOfWeek(e.target.value)}
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
                    </div>
                  </div>
                </section> */}
                {/* <!--Frame--> */}

                {/* <h2 class="title">เวลาทำงาน</h2> */}
                {/* <section class="Frame">
                <div class="row align-items-end">
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="startOT">ชั่วโมงทำงาน OT ก่อนเริ่มงาน</label>
                        <input
                          type="text"
                          class="form-control"
                          id="startOT"
                          placeholder="ชั่วโมงทำงาน OT"
                          value={startWorkOfOT}
                          onChange={(e) => setStartWorkOfOT(e.target.value)}
                          onInput={(e) => {
                           
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                    
                        <input
                          type="text"
                          class="form-control"
                          id="startOT"
                          placeholder="นาที"
                          value={startWorkOfOTMinute}
                          onChange={(e) => setStartWorkOfOTMinute(e.target.value)}
                          onInput={(e) => {
                       
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
</div>

                  <div class="row align-items-end">
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="workOfHour">ชั่วโมงทำงาน<span style={{ color: "red" }}>*</span></label>
                        <input
                          type="text"
                          class="form-control"
                          id="workOfHour"
                          placeholder="ชั่วโมงทำงาน"
                          value={workOfHour}
                          onChange={(e) => setWorkOfHour(e.target.value)}
                          onInput={(e) => {
                           
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                
                        <input
                          type="text"
              
                          class="form-control "
                          id="workOfHour"
                          placeholder="นาที"
                          value={workOfMinute}
                          onChange={(e) => setWorkOfMinute(e.target.value)}
                          onInput={(e) => {
                            
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row align-items-end">
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="endOT">ชั่วโมงทำงาน OT</label>
                        <input
                          type="text"
                          class="form-control"
                          id="endOT"
                          placeholder="ชั่วโมงทำงาน OT"
                          value={workOfOT}
                          onChange={(e) => setWorkOfOT(e.target.value)}
                          onInput={(e) => {
                            
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                    
                        <input
                          type="text"
                          class="form-control"
                          id="endOT"
                          placeholder="นาที"
                          value={workOfOTMinute}
                          onChange={(e) => setWorkOfOTMinute(e.target.value)}
                          onInput={(e) => {
                            
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">

                        <div class="row align-items-end">
                          <label>เวลาพัก</label>
                          <div class="col-md-4">

                            <label>
                              <input
                                type="radio"
                                value="20"
                                checked={breakOfOT === "20"}
                                onChange={(e) => handleRadioChange(e.target.value)}
                              />
                              20
                            </label>
                            <label style={{ marginLeft: "10px" }}>
                              <input
                                type="radio"
                                value="30"
                                checked={breakOfOT === "30"}
                                onChange={(e) => handleRadioChange(e.target.value)}
                              />
                              30
                            </label>
                            <label style={{ marginLeft: "10px" }}>
                              <input
                                type="radio"
                                value="customset"
                                checked={isCustom}
                                onChange={(e) => handleRadioChange(e.target.value)}
                              />
                              ปรับเอง
                            </label>
                          </div>
                          <div class="col-md-6">
                       
                            {isCustom && (
                              <input
                                type="text"
                                className="form-control"
                                style={{ marginTop: "10px", width: "200px" }}
                                placeholder="นาที"
                                value={breakOfOT}
                                onChange={(e) => setBreakOfOT(e.target.value)}
                                onInput={(e) => {
                                  // Remove any non-digit characters, including '.'
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}
                {/* <!--Frame--> */}
                {/* <h2 class="title">ค่าจ้าง</h2> */}
                {/* <section class="Frame">
                <div class="row">
                <div class="col-md-3">
                      <div class="form-group">
                        <label role="workRate">ค่าจ้าง รายวัน<span style={{ color: "red" }}>*</span></label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRate"
                          placeholder="บาท"
                          value={workRate}
                          onChange={(e) => setWorkRate(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="workRate">รายชั่วโมง</label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRate"
                          placeholder="บาท"
                          value={(parseFloat(workRate ||  0) /8) || ''} readOnly />
                      </div>
                    </div>

                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="workRateOT">
                          OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRateOT"
                          placeholder="กี่เท่า"
                          value={workRateOT}
                          onChange={(e) => setWorkRateOT(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="workRateOT">
                          OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRateOT"
                          placeholder="กี่บาท"
                          value={ ((parseFloat(workRate || '0')/ 8)* parseFloat(workRateOT || '0')) || '' }
                        readOnly/>
                      </div>
                    </div>
                </div>

                <div class="row">
                <div class="col-md-3">
                      <div class="form-group">
                        <label role="dayoffRateHour">
                          วันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateHour"
                          placeholder="กี่เท่า"
                          value={dayoffRateHour}
                          onChange={(e) => setDayoffRateHour(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="dayoffRateHour">
                          วันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateHour"
                          placeholder="กี่บาท"
                          value={ ((parseFloat(workRate || '0')/ 8)* parseFloat(dayoffRateHour || '0')) || '' }
                                                readOnly />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="dayoffRateOT">
                          OT วันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateOT"
                          placeholder="กี่เท่า"
                          value={dayoffRateOT}
                          onChange={(e) => setDayoffRateOT(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="dayoffRateOT">
                          OT วันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateOT"
                          placeholder="กี่บาท"
                          value={ ((parseFloat(workRate || '0')/ 8)* parseFloat(dayoffRateOT || '0')) || '' }
                        readOnly />
                      </div>
                    </div>
                </div>

                <div class="row">
                <div class="col-md-3">
                      <div class="form-group">
                        <label role="holidayHour">
                          วันหยุดนักขัตฤกษ์ รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayHour"
                          placeholder=""
                          value={holidayHour}
                          onChange={(e) => setHolidayHour(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="holidayHour">
                          วันหยุดนักขัตฤกษ์ รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayHour"
                          placeholder=""
                          value={ ((parseFloat(workRate || '0')/ 8)* parseFloat(holidayHour || '0')) || '' }
                        readOnly />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="holidayOT">
                          วันหยุดนักขัตฤกษ์ OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayOT"
                          placeholder="กี่เท่า"
                          value={holidayOT}
                          onChange={(e) => setHolidayOT(e.target.value)}
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
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="holidayOT">
                          วันหยุดนักขัตฤกษ์ OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayOT"
                          placeholder="กี่บาท"
                          value={ ((parseFloat(workRate || '0')/ 8)* parseFloat(holidayOT || '0')) || '' }
                        readOnly />
                      </div>
                    </div>
                </div>
                <br/>

                <div class="row">
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="addWorkRate">ปรับเพิ่ม</label>
                        <input
                          type="text"
                          class="form-control"
                          id="addWorkRate"
                          placeholder="บาท"
                          value={addWorkRate}
                          onChange={(e) => setAddWorkRate(e.target.value)}
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
                          }}
                        />
                        <small className="text-muted">เช่น: ปรับเพิ่ม 28 บาท</small>
                      </div>
                
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="addWorkRate">ค่าจ้างใหม่</label>
                        <input
                          type="text"
                          class="form-control"
                          id="newWorkRate"
                          placeholder="บาท"
                          value={parseFloat(addWorkRate || '0')+ parseFloat(workRate || '0') }
                          readOnly
                        />
                        <small className="text-muted">จะเป็น: {parseFloat(workRate || '0')} + {parseFloat(addWorkRate || '0')} = {parseFloat(addWorkRate || '0')+ parseFloat(workRate || '0')}</small>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label role="workRateEffectiveDate">วันที่มีผลบังคับใช้</label>
                        <input
                          type="date"
                          class="form-control"
                          id="workRateEffectiveDate"
                          value={workRateEffectiveDate}
                          onChange={(e) => setWorkRateEffectiveDate(e.target.value)}
                        />
                        <small className="text-warning">⚠️ การคำนวณเงินเดือนจะใช้อัตราใหม่ตั้งแต่วันที่นี้</small>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        <label> </label>
                        <div class="form-control-static">
                          <small className="text-info">
                            📝 <strong>หมายเหตุ:</strong><br/>
                            • รอบเงินเดือน: 21 เดือนก่อน - 20 เดือนปัจจุบัน<br/>
                            • การปรับค่าจ้างจะมีผลในรอบถัดไป<br/>
                            • ต้องทำ Re-calculate ข้อมูลเงินเดือนใหม่
                          </small>
                        </div>
                      </div>
                    </div>
                 </div>

<div class="col-md-6">

<div>
                    <label>วันเริ่มต้นคำนวณ:</label>

                    <div>
                      <div className="row">
                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={workRateDayChange}
                            onChange={(e) => setWorkRateDayChange(e.target.value)}
                          >
                            <option value="">Select day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (workRateDayChange) => (
                                <option key={workRateDayChange} value={workRateDayChange}>
                                  {workRateDayChange}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={workRateMonthChange}
                            onChange={(e) => setWorkRateMonthChange(e.target.value)}
                          >
                            <option value="">Select month</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (workRateMonthChange) => (
                                <option key={workRateMonthChange} value={workRateMonthChange}>
                                  {workRateMonthChange}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={workRateYearChange}
                            onChange={(e) => setWorkRateYearChange(e.target.value)}
                          >
                            <option value="">Select year</option>
                            {Array.from(
                              { length: 7 },
                              (_, i) => new Date().getFullYear() + 3 - i
                            ).map((workRateYearChange) => (
                              <option key={workRateYearChange} value={workRateYearChange}>
                                {workRateYearChange + 543}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div></div>
                      </div>
                      </div>
                      


             

          
                </section> */}

                 {/* <h2 className="title">เงินสงเคราะห์ลูกจ้าง</h2> */}
                {/* <section className="Frame">
                  <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Rate สำหรับวันที่ 21-30/31</label>
                            <div className="input-group">
                              <input type="text"
                              className="form-control"
                              id="employeeCompensationRate21_30_31"
                              placeholder="เช่น 0.25"
                              value={employeeCompensationRate21_30_31 || ""}
                              onChange={(e) => setEmployeeCompensationRate21_30_31(e.target.value)}
                              onInput={(e) => {
                                // Remove any non-digit characters except decimal point
                                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                // Ensure only one '.' is allowed
                                const parts = e.target.value.split(".");
                                if (parts.length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1]}`;
                                }
                                // Limit to 2 decimal places
                                if (parts[1] && parts[1].length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1].substring(0, 2)}`;
                                }
                              }}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">%</span>
                            </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Rate สำหรับวันที่ 1-20</label>
                            <div className="input-group">
                              <input type="text"
                              className="form-control"
                              id="employeeCompensationRate1_20"
                              placeholder="เช่น 0.25"
                              value={employeeCompensationRate1_20 || ""}
                              onChange={(e) => setEmployeeCompensationRate1_20(e.target.value)}
                              onInput={(e) => {
                                // Remove any non-digit characters except decimal point
                                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                // Ensure only one '.' is allowed
                                const parts = e.target.value.split(".");
                                if (parts.length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1]}`;
                                }
                                // Limit to 2 decimal places
                                if (parts[1] && parts[1].length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1].substring(0, 2)}`;
                                }
                              }}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">%</span>
                            </div>
                            </div>
                          </div>
                        </div>
                      
                      </div>
                </section> */}

                {/* <!--Frame--> */}
                {/* <h2 class="title">สวัสดิการเงินเพิ่มพนักงาน</h2>
                <section class="Frame">
                  {formData.addSalary &&
                    formData.addSalary.length > 0 &&
                    formData.addSalary.map((data, index) => (
                      <div key={index}>
                        <div className="row">
                          <div className="col-md-1">
                            <label role="codeSpSalary">รหัส</label>
                            <input
                              type="text"
                              name="codeSpSalary"
                              className="form-control"
                              value={data.codeSpSalary}
                              onChange={(e) =>
                                handleChangeSpSalary(e, index, "codeSpSalary")
                              }
                              onInput={(e) => {
                            

                                // Ensure only one '.' is allowed
                                const parts = e.target.value.split(".");
                                if (parts.length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1]}`; // Keep only the first two parts
                                }
                              }}
                            />
                          </div>
                           <div className="col-md-1">
                                                <label role="SpSalary">จำนวนเงิน</label>
                                                <input
                                                    type="text"
                                                    name="SpSalary"
                                                    className="form-control"
                                                    value={data.SpSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'SpSalary')}
                                                />
                                            </div> 
                          <div className="col-md-2">
                            <label role="name">ชื่อรายการ</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={data.name}
                              onChange={(e) =>
                                handleChangeSpSalary(e, index, "name")
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <label role="SpSalary">จำนวนเงิน</label>
                            <input
                              type="text"
                              name="SpSalary"
                              className="form-control"
                              value={data.SpSalary}
                              onChange={(e) =>
                                handleChangeSpSalary(e, index, "SpSalary")
                              }
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
                              }}
                            />
                          </div>
                          <div className="col-md-2">
                            <label role="roundOfSalary">รายวัน/เดือน</label>
                            <select
                              name="roundOfSalary"
                              className="form-control"
                              value={data.roundOfSalary}
                              onChange={(e) =>
                                handleChangeSpSalary(e, index, "roundOfSalary")
                              }
                            >
                              <option value="">เลือก</option>
                              <option value="daily">รายวัน</option>
                              <option value="monthly">รายเดือน</option>
                            </select>
                          </div>
                          <div className="col-md-2">
                            <label role="StaffType">ประเภทพนักงาน</label>
                            <select
                              name="StaffType"
                              className="form-control"
                              value={data.StaffType}
                              onChange={(e) =>
                                handleChangeSpSalary(e, index, "StaffType")
                              }
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
                                     <option value="พนักงานคัดแยกขยะ">
                                       พนักงานคัดแยกขยะ
                                     </option>
                              <option value="พนักงานคัดแยกสารเคมี">
                                      พนักงานคัดแยกสารเคมี
                              </option>

                            </select>
                          </div>
                          {data.StaffType === "custom" && (
                            <div className="col-md-2">
                              <label>ตำแหน่ง</label>
                              <input
                                type="text"
                                name="additionalInput"
                                className="form-control"
                                value={data.nameType}
                                onChange={(e) =>
                                  handleChangeSpSalary(e, index, "nameType")
                                }
                              />
                            </div>
                          )}
                          <div className="col-md-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteInput(index)}
                              className="btn btn-danger"
                              style={{
                                width: "8rem",
                                position: "absolute",
                                bottom: "0",
                              }}
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  <br />
                  <button
                    type="button"
                    onClick={handleAddInput}
                    class="btn btn-primary"
                  >
                    เพิ่ม
                  </button>
                  <pre>{JSON.stringify(formData, null, 2)}</pre>
                </section> */}

                {/* <!--Frame--> */}
                {/* <h2 class="title"> สวัสดิการวันหยุดพนักงาน</h2>
                <div class="row">
                  <div class="col-md-12">
                    <section class="Frame">
                      <div class="col-md-12">
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="personalLeaveNumber">รหัส</label>
                              <input
                                type="text"
                                class="form-control"
                                id="personalLeaveNumber"
                                placeholder="รหัส"
                                value={personalLeaveNumber}
                                onChange={(e) =>
                                  setPersonalLeaveNumber(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="personalLeave">วันลากิจ</label>
                              <input
                                type="text"
                                class="form-control"
                                id="personalLeave"
                                placeholder="วันลากิจ"
                                value={personalLeave}
                                onChange={(e) =>
                                  setPersonalLeave(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="personalLeaveRate">
                                จำนวนเงินต่อวัน
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="personalLeaveRate"
                                placeholder="จำนวนเงินต่อวัน"
                                value={personalLeaveRate}
                                onChange={(e) =>
                                  setPersonalLeaveRate(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>
                        </div>
                    
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="SickLeaveNumber">รหัส</label>
                              <input
                                type="text"
                                class="form-control"
                                id="SickLeaveNumber"
                                placeholder="รหัส"
                                value={sickLeaveNumber}
                                onChange={(e) =>
                                  setSickLeaveNumber(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="sickLeave">วันลาป่วย</label>
                              <input
                                type="text"
                                class="form-control"
                                id="sickLeave"
                                placeholder="วันลาป่วย"
                                value={sickLeave}
                                onChange={(e) => setSickLeave(e.target.value)}
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="sickLeaveRate">
                                จำนวนเงินต่อวัน
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="sickLeaveRate"
                                placeholder="จำนวนเงินต่อวัน"
                                value={sickLeaveRate}
                                onChange={(e) =>
                                  setSickLeaveRate(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>
                        </div>
                    
                        <div class="row">
                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="setWorkRateDayoffNumber">รหัส</label>
                              <input
                                type="text"
                                class="form-control"
                                id="setWorkRateDayoffNumber"
                                placeholder="รหัส"
                                value={workRateDayoffNumber}
                                onChange={(e) =>
                                  setWorkRateDayoffNumber(e.target.value)
                                  
                                }
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="workRateDayoff">วันลาพักร้อน</label>
                              <input
                                type="text"
                                class="form-control"
                                id="workRateDayoff"
                                placeholder="วันลาพักร้อน"
                                value={workRateDayoff}
                                onChange={(e) =>
                                  setWorkRateDayoff(e.target.value)
                                }
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
                                }}
                              />
                            </div>
                          </div>

                          <div class="col-md-4">
                            <div class="form-group">
                              <label role="workRateDayoffRate">
                                จำนวนเงินต่อวัน
                              </label>
                              <input
                                  type="text"
                                  className="form-control"
                                  id="workRateDayoffRate"
                                  placeholder="จำนวนเงินต่อวัน"
                                  value={workRateDayoffRate}
                                  onChange={(e) => {
                                    let input = e.target.value;

                                    // Remove characters that are not digits or "."
                                    input = input.replace(/[^0-9.]/g, '');

                                    // Ensure only one "." is allowed
                                    const parts = input.split('.');
                                    if (parts.length > 2) {
                                      input = `${parts[0]}.${parts[1]}`;
                                    }

                                    setworkRateDayoffRate(input);
                                  }}
                                />

                            </div>
                          </div>
                        </div>
          
                      </div>
                    </section>
                  
                  </div>
                </div> */}

                <h2 class="title">ตั้งค่าวันทํางาน</h2>
                <section class="Frame" id="workTimeDayForm">
                  {/* New Card-Based Layout with Multiple Days Off Workflow */}
                  <div className="card mb-4" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                    <div className="card-body p-4">
                      
                      {/* 1. Multiple Days Off Selection */}
                      <div className="row mb-4">
                        <div className="col-md-12 mb-3">
                          <label className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>เลือกวันหยุดประจำสัปดาห์ (สามารถเลือกได้หลายวัน)</label>
                          <div className="d-flex flex-wrap gap-2">
                            {daysOfWeek.map((day, index) => {
                              const isSelected = selectedDaysOff.includes(day);
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  className={`btn mr-2 mb-2 ${isSelected ? 'shadow-sm' : ''}`}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedDaysOff(selectedDaysOff.filter(d => d !== day));
                                    } else {
                                      setSelectedDaysOff([...selectedDaysOff, day]);
                                    }
                                  }}
                                  style={{ 
                                    borderRadius: '50px', 
                                    padding: '8px 20px', 
                                    minWidth: '100px',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    border: isSelected ? 'none' : '1px solid #cbd5e0',
                                    backgroundColor: isSelected ? 'rgb(43,93,142)' : '#ffffff', // Theme Blue if selected, White if not
                                    color: isSelected ? '#ffffff' : '#6c757d', // White text if selected, Gray if not
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {isSelected && <i className="fas fa-check mr-2"></i>}
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="col-md-12">
                          <div className="p-3 bg-light rounded d-flex align-items-center" style={{ border: '1px solid #e2e8f0' }}>
                            <span className="text-muted mr-2">วันทำงาน:</span>
                            <span className=" font-weight-bold" style={{ fontSize: '1.1rem', color: 'rgb(43,93,142)' }}>
                              {(() => {
                                if (selectedDaysOff.length === 7) return "ไม่มีวันทำงาน";
                                if (selectedDaysOff.length === 0) return "ทำงานทุกวัน";
                                
                                const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
                                const offIndices = selectedDaysOff.map(d => days.indexOf(d));
                                const workIndices = [0, 1, 2, 3, 4, 5, 6].filter(i => !offIndices.includes(i));
                                
                                // Group into intervals
                                const intervals = [];
                                if (workIndices.length > 0) {
                                    let currentInterval = [workIndices[0]];
                                    for (let i = 1; i < workIndices.length; i++) {
                                        if (workIndices[i] === workIndices[i-1] + 1) {
                                            currentInterval.push(workIndices[i]);
                                        } else {
                                            intervals.push(currentInterval);
                                            currentInterval = [workIndices[i]];
                                        }
                                    }
                                    intervals.push(currentInterval);
                                }

                                return intervals.map(interval => {
                                  if (interval.length === 1) return days[interval[0]];
                                  return `${days[interval[0]]} - ${days[interval[interval.length - 1]]}`;
                                }).join(", ");
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" style={{ borderTop: '1px dashed #cbd5e0' }} />

                      {/* 2. Time Slots List (Applied to Work Days) */}
                      <label className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>กำหนดเวลาทำงาน (สำหรับวันทำงาน)</label>
                      
                      {workTimeDay.allTimes.map((time, index) => (
                        <div key={index} className="card mb-3 border-0 bg-light" style={{ borderRadius: '10px' }}>
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex align-items-center">
                                <span className="badge  mr-2" style={{ fontSize: '0.9rem', padding: '8px 12px', borderRadius: '8px',backgroundColor: 'rgb(43,93,142)' }}>#{index + 1}</span>
                                <select
                                  name="shift"
                                  className="form-control form-control-sm border-0 bg-white shadow-sm"
                                  value={time.shift}
                                  onChange={(e) => handleTimeChange(index, "shift", e.target.value)}
                                  style={{ width: '150px', fontWeight: '600' }}
                                >
                                  <option value="">เลือกกะ</option>
                                  {shiftWork.map((day, idx) => (
                                    <option key={idx} value={day}>{day}</option>
                                  ))}
                                </select>
                              </div>
                              {index >= 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm border-0 bg-danger"
                                  onClick={() => handleRemoveTime(index)}
                                  title="ลบรายการนี้"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              )}
                            </div>

                            <div className="row">
                              {/* Regular Time */}
                              <div className="col-md-3 border-right">
                                <small className="text-muted d-block mb-2 font-weight-bold">เวลาทำงานปกติ</small>
                                <div className="d-flex align-items-center mb-2">
                                  <i className="far fa-clock text-muted mr-2"></i>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                    placeholder="เข้า"
                                    value={time.startTime}
                                    onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                      const parts = e.target.value.split(".");
                                      if (parts.length > 2) e.target.value = `${parts[0]}.${parts[1]}`;
                                    }}
                                  />
                                  <span className="mx-1">-</span>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                    placeholder="ออก"
                                    value={time.endTime}
                                    onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                                    onInput={(e) => {
                                      const parts = e.target.value.split(".");
                                      if (parts.length > 2) e.target.value = `${parts[0]}.${parts[1]}`;
                                    }}
                                  />
                                </div>
                              </div>

                              {/* OT Time */}
                              <div className="col-md-3 border-right">
                                <small className="text-muted d-block mb-2 font-weight-bold">เวลา OT</small>
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-muted mr-2" style={{ fontSize: '0.8rem' }}>OT</span>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                    placeholder="เข้า"
                                    value={time.startTimeOT}
                                    onChange={(e) => handleTimeChange(index, "startTimeOT", e.target.value)}
                                    onInput={(e) => {
                                      const parts = e.target.value.split(".");
                                      if (parts.length > 2) e.target.value = `${parts[0]}.${parts[1]}`;
                                    }}
                                  />
                                  <span className="mx-1">-</span>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                    placeholder="ออก"
                                    value={time.endTimeOT}
                                    onChange={(e) => handleTimeChange(index, "endTimeOT", e.target.value)}
                                    onInput={(e) => {
                                      const parts = e.target.value.split(".");
                                      if (parts.length > 2) e.target.value = `${parts[0]}.${parts[1]}`;
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Before/After OT */}
                              <div className="col-md-3 border-right">
                                <small className="text-muted d-block mb-2 font-weight-bold">OT ก่อน/หลัง</small>
                                <div className="row no-gutters">
                                  <div className="col-6 pr-1">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm border-0 bg-white shadow-sm"
                                      placeholder="เข้าก่อน"
                                      value={time.beforeStartTimeOT || ""}
                                      onChange={(e) => handleTimeChange(index, "beforeStartTimeOT", e.target.value)}
                                      onInput={(e) => {
                                        // รองรับทั้งรูปแบบ HH:MM และ HH.MM
                                        const value = e.target.value.replace(/[^0-9:.]/g, "");
                                        e.target.value = value;
                                      }}
                                    />
                                  </div>
                                  <div className="col-6 pl-1">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm border-0 bg-white shadow-sm"
                                      placeholder="ออกก่อน"
                                      value={time.beforeEndTimeOT || ""}
                                      onChange={(e) => handleTimeChange(index, "beforeEndTimeOT", e.target.value)}
                                      onInput={(e) => {
                                        // รองรับทั้งรูปแบบ HH:MM และ HH.MM
                                        const value = e.target.value.replace(/[^0-9:.]/g, "");
                                        e.target.value = value;
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="col-md-3">
                                <small className="text-muted d-block mb-2 font-weight-bold">รายละเอียด</small>
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm mb-1"
                                    placeholder="จำนวนคน"
                                    value={time.numberOfPeople || ""}
                                    onChange={(e) => handleTimeChange(index, "numberOfPeople", e.target.value)}
                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")}
                                  />
                                  <input
                                    type="text"
                                    className="form-control form-control-sm border-0 bg-white shadow-sm"
                                    placeholder="หมายเหตุ"
                                    value={time.Remark || ""}
                                    onChange={(e) => handleTimeChange(index, "Remark", e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn  btn-block border-dashed mt-4"
                        onClick={handleAddTime}
                        style={{ borderWidth: '2px', borderRadius: '40px', padding: '10px' ,color: 'grey' }}
                      >
                        <i className="fas fa-plus mr-2"></i> เพิ่มกะ
                      </button>

                    </div>
                  </div>
                  {/* <button onClick={() => console.log(workTimeDay)}>Submit</button> */}
                  <div class="row">
                    {/* ... (Your other components) ... */}
                    <button
                      type="button"
                      aria-label="เพิ่มรายการวันทำงาน"
                      className="btn btn-primary ml-auto"
                      style={{ backgroundColor: 'rgb(43,93,142)', borderColor: 'rgb(43,93,142)' }}
                      onClick={() => {
                        if (selectedDaysOff.length === 0) {
                           // Optional: Confirm if no days off
                        }

                        const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
                        let newSchedule = [];

                        // 1. Add Stop Days
                        selectedDaysOff.forEach(day => {
                            newSchedule.push({
                                startDay: day,
                                endDay: day,
                                workOrStop: "stop",
                                allTimes: [{ shift: "", startTime: "", endTime: "", resultTime: "0", startTimeOT: "", endTimeOT: "", resultTimeOT: "0", numberOfPeople: "", Remark: "วันหยุดประจำสัปดาห์" }]
                            });
                        });

                        // 2. Add Work Days
                        const offIndices = selectedDaysOff.map(d => days.indexOf(d));
                        const workIndices = [0, 1, 2, 3, 4, 5, 6].filter(i => !offIndices.includes(i));
                        
                        // Group into intervals
                        const intervals = [];
                        if (workIndices.length > 0) {
                            let currentInterval = [workIndices[0]];
                            for (let i = 1; i < workIndices.length; i++) {
                                if (workIndices[i] === workIndices[i-1] + 1) {
                                    currentInterval.push(workIndices[i]);
                                } else {
                                    intervals.push(currentInterval);
                                    currentInterval = [workIndices[i]];
                                }
                            }
                            intervals.push(currentInterval);
                        }

                        intervals.forEach(interval => {
                            newSchedule.push({
                                startDay: days[interval[0]],
                                endDay: days[interval[interval.length - 1]],
                                workOrStop: "work",
                                allTimes: JSON.parse(JSON.stringify(workTimeDay.allTimes)) // Deep copy
                            });
                        });

                        setWorkTimeDayList(newSchedule);
                      }}
                    >
                      สร้างตารางเวลาอัตโนมัติ
                    </button>
                    {editingTimeListIndex !== null && (
                      <button
                        type="button"
                        className="btn btn-secondary ml-2"
                        onClick={() => {
                          setEditingTimeListIndex(null);
                          setWorkTimeDay({
                            startDay: "",
                            endDay: "",
                            workOrStop: "",
                            allTimes: [
                              {
                                shift: "",
                                beforeStartTimeOT: "",
                                beforeEndTimeOT: "",
                                beforeResultTimeOT: "", // ✅ เปลี่ยนเป็น beforeResultTimeOT
                                startTime: "",
                                endTime: "",
                                resultTime: "",
                                startTimeOT: "",
                                endTimeOT: "",
                                resultTimeOT: "",
                                numberOfPeople: "",
                                Remark: "",
                              },
                            ],
                          });
                        }}
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                  <br />
                  <br />

                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>ตั้งแต่</th>
                        <th style={headerCellStyle}>ถึง</th>
                        <th style={headerCellStyle}>ทำงาน/หยุด</th>
                        <th style={headerCellStyle}>กะ</th>
                      
                        <th style={headerCellStyle}>เวลาเข้า</th>
                        <th style={headerCellStyle}>เวลาออก</th>
                        <th style={headerCellStyle}>ชม.</th>
                        <th style={headerCellStyle}>เวลาเข้า OT ก่อน</th>
                        <th style={headerCellStyle}>เวลาออก OT ก่อน</th>
                        <th style={headerCellStyle}>ชม. OT ก่อน</th>
                        <th style={headerCellStyle}>เวลาเข้าOT</th>
                        <th style={headerCellStyle}>เวลาออกOT</th>
                        <th style={headerCellStyle}>ชม.OT</th>
                        <th style={headerCellStyle}>จำนวนคน</th>
                        <th style={headerCellStyle}>หมายเหตุ</th>
                        <th style={headerCellStyle}>ลบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workTimeDayList.map((item, index) =>
                        item.allTimes.map((item1, index1) => (
                          <tr key={index}>
                            {index1 > 0 ? (
                              <>
                                {/* <td style={cellStyle}></td> */}
                                <td style={cellStyle}></td>
                                <td style={cellStyle}></td>
                              </>
                            ) : (
                              <>
                                {/* <td style={cellStyle}>
                                                                    <button type="button"
                                                                        onClick={() => handleRemoveTimeList(index)}
                                                                        className="btn btn-danger ml-auto" >
                                                                        ลบ
                                                                    </button>
                                                                </td> */}
                                <td style={cellStyle}>{item.startDay}</td>
                                <td style={cellStyle}>{item.endDay}</td>
                              </>
                            )}

                            {item.workOrStop == "work" ? (
                              <td style={cellStyle}>ทำงาน</td>
                            ) : (
                              <td style={cellStyle}>หยุด</td>
                            )}

                            <td style={cellStyle}>{item1.shift}</td>
                            <td style={cellStyle}>{item1.startTime}</td>
                            <td style={cellStyle}>{item1.endTime}</td>
                            <td style={cellStyle}>{item1.resultTime}</td>
                            <td style={cellStyle}>{item1.beforeStartTimeOT}</td>
                            <td style={cellStyle}>{item1.beforeEndTimeOT}</td>
                            <td style={cellStyle}>{item1.beforeResultTimeOT}</td>
                            <td style={cellStyle}>{item1.startTimeOT}</td>
                            <td style={cellStyle}>{item1.endTimeOT}</td>
                            <td style={cellStyle}>{item1.resultTimeOT}</td>
                            <td style={cellStyle}>{item1.numberOfPeople}</td>
                            <td style={cellStyle}>{item1.Remark}</td>
                            
                            {index1 > 0 ? (
                              <>
                                <td style={cellStyle}></td>
                              </>
                            ) : (
                              <>
                                <td style={cellStyle}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleEditTimeList(index)}
                                      className="btn btn-warning"
                                    >
                                      แก้ไข
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTimeList(index)}
                                      className="btn btn-danger"
                                    >
                                      ลบ
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )}

                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </section>

                {/* <h2 class="title">ตั้งค่าคนทํางาน</h2>
                <section class="Frame">
                  <div class="row">
                    <div class="col-md-1">ตั้งแต่</div>
                    <div class="col-md-1">ถึงวันที่</div>
                    <div class="col-md-9">
                      <div class="row">
                        <div class="col-md-2">กะ</div>
                        <div class="col-md-2">ตำแหน่ง</div>
                        <div class="col-md-2">จำนวนคน</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-1">
                      <select
                        name="startDay"
                        className="form-control"
                        value={workTimeDayPerson.startDay}
                        onChange={handleInputPersonChange}
                      >
                        <option value="">เลือกวัน</option>
                        {daysOfWeek.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-1">
                      <select
                        name="endDay"
                        className="form-control"
                        value={workTimeDayPerson.endDay}
                        onChange={handleInputPersonChange}
                      >
                        <option value="">เลือกวัน</option>

                        {daysOfWeek.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-9">
                      {workTimeDayPerson.allTimesPerson.map((time, index) => (
                        <div key={index} className="row">
                          <div className="col-md-2">
                            <select
                              name="shift"
                              className="form-control"
                              value={time.shift}
                              onChange={(e) =>
                                handleInputChangePerson(e, index)
                              }
                            >
                              <option value="">เลือกกะ</option>

                              {shiftWork.map((shift, shiftIndex) => (
                                <option key={shiftIndex} value={shift}>
                                  {shift}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-2">
                            <select
                              name="positionWork"
                              className="form-control"
                              value={time.positionWork}
                              onChange={(e) =>
                                handleInputChangePerson(e, index)
                              }
                            >
                              <option value="">เลือกตำแหน่ง</option>

                              {positionWork.map((position, positionIndex) => (
                                <option key={positionIndex} value={position}>
                                  {position}
                                </option>
                              ))}
                              <option value="" disabled>
                                เลือกตำแหน่ง
                              </option>
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
                              <option value="พนักงานคนสวน">พนักงานคนสวน</option>
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
                              <option value="ธุรการทั่วไป">ธุรการทั่วไป</option>
                              <option value="หัวหน้าฝ่ายปฏิบัติการ">
                                หัวหน้าฝ่ายปฏิบัติการ
                              </option>
                              <option value="หัวหน้าฝ่ายบัญชี/การเงิน">
                                หัวหน้าฝ่ายบัญชี/การเงิน
                              </option>
                              <option value="หัวหน้าฝ่ายสโตร์">
                                หัวหน้าฝ่ายสโตร์
                              </option>
                              <option value="แม่บ้านจุดล้างจาน">
                                แม่บ้านจุดล้างจาน
                              </option>
                              <option value="เจ้าหน้าที่ซ่อมบำรุง">
                                เจ้าหน้าที่ซ่อมบำรุง
                              </option>
                            </select>
                          </div>
                          <div className="col-md-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`Person ${index + 1}`}
                              name="countPerson" // Make sure the name attribute is set to "countPerson"
                              value={time.countPerson}
                              onChange={(e) =>
                                handleInputChangePerson(e, index)
                              }
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
                              }}
                            />
                          </div>
                          <div class="col-md-2">
                            {index >= 1 ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveTimePerson(index)}
                                style={{ width: "2.5rem" }}
                                className="btn btn-danger ml-auto"
                              >
                                ลบ
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  aria-label="เพิ่ม"
                                  onClick={handleAddTimePerson}
                                  className="btn btn-primary"
                                  style={{ width: "2.5rem" }}
                                >
                                  <i className="fa">&#xf067;</i>
                                </button>
                              </>
                            )}
                          </div>
                          <br />
                          <br />
                          <br />
                        </div>
                      ))}
                    </div>
                  </div>
                  <br />

                  <div class="row">
           
                    <button
                      type="button"
                      aria-label="เพิ่มรายการ"
                      onClick={handleAddTimePersonList}
                      className="btn btn-primary ml-auto"
                      style={{ marginLeft: "auto", display: "block" }}
                    >
                      เพิ่ม
                    </button>
                  </div>
                  <br />
                  <br />

                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>ตั้งแต่</th>
                        <th style={headerCellStyle}>ถึง</th>
                        <th style={headerCellStyle}>กะ</th>
                        <th style={headerCellStyle}>ตำแหน่ง</th>
                        <th style={headerCellStyle}>จำนวนคน</th>
                   
                        <th style={{ ...headerCellStyle, width: "5rem" }}>
                          ลบ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workTimeDayPersonList.map((item, index) =>
                        item.allTimesPerson.map((item1, index1) => (
                          <tr>
                            {index1 == 0 ? (
                              <>
                                <td style={cellStyle}>{item.startDay}</td>
                                <td style={cellStyle}>{item.endDay}</td>
                              </>
                            ) : (
                              <>
                                <td style={cellStyle}></td>
                                <td style={cellStyle}></td>
                              </>
                            )}

                            <td style={cellStyle}>{item1.shift}</td>
                            <td style={cellStyle}>{item1.positionWork}</td>
                            <td style={cellStyle}>{item1.countPerson}</td>
                            {index1 > 0 ? (
                              <>
                                <td style={cellStyle}></td>
                              </>
                            ) : (
                              <>
                                <td style={cellStyle}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveTimePersonList(index)
                                    }
                               
                                    className="btn btn-danger mb-2"
                                  >
                                    ลบ
                                  </button>
                                  <button
                                    className="btn btn-warning"
                                    type="button"
                                    onClick={() => handleEditTimePersonList(index)}
                                  >
                                    แก้ไข
                                  </button>
 
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )}
        
                    </tbody>
                  </table>
                </section> */}

                {/* จัดวันหยุดทั้งสองประเภทให้อยู่ข้างกัน */}
                <div className="row">
                  {/* <div className="col-md-6">
                    <h2 className="title" >
                      วันหยุดหน่วยงาน
                    </h2>
                    <section className="Frame" style={{ minHeight: '450px' }}>
                      <div>
                        <label>เลือกวันหยุดของหน่วยงาน:</label>

                        <div>
                          <div className="row">
                            <div className="col-md-4">
                              <label style={{ margin: "0.5rem", fontWeight: 'bold' }}>วันที่:</label>
                            </div>
                            <div className="col-md-4">
                              <label style={{ marginRight: "0.5rem", fontWeight: 'bold' }}>
                                เดือน:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <label style={{ margin: "0.5rem", fontWeight: 'bold' }}>ปี:</label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกวันที่</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                  (day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกเดือน</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                  (month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกปี</option>
                                {Array.from(
                                  { length: 7 },
                                  (_, i) => new Date().getFullYear() + 3 - i
                                ).map((year) => (
                                  <option key={year} value={year}>
                                    {year + 543}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <br />

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddDate}
                          >
                             เพิ่ม
                          </button>
                        </div>

                        <br />
                        
                    
                        {selectedDates.length > 0 && (
  <div >
    <h5>รายการวันหยุดหน่วยงาน (วัน/เดือน/ปี)</h5>
    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
      {selectedDates
        .sort((a, b) => new Date(a) - new Date(b))
        .map((date, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            padding: '10px', 
            marginBottom: '8px', 
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {`${index + 1}. `}
              {date instanceof Date && !isNaN(date.getTime())
                ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`
                : "วันที่ไม่ถูกต้อง"}
            </span>
            <button
              type="button"
              onClick={() => handleRemoveDate(date)}
              className="btn btn-danger"
            >
              ลบ
            </button>
          </div>
        ))}
    </div>
  </div>
)}
                      </div>
                    </section>
                  </div> */}

                  {/* <div className="col-md-6">
                    <h2 className="title">
                      วันหยุดนักขัตฤกษ์
                    </h2>
                    <section className="Frame" style={{ minHeight: '450px' }}>
                      <div id="publicHolidayForm">
                        <label >เลือกวันหยุดนักขัตฤกษ์:</label>

                        <div >
                          <div className="row">
                            <div className="col-md-4">
                              <label style={{ margin: "0.5rem", fontWeight: 'bold' }}>วันที่:</label>
                            </div>
                            <div className="col-md-4">
                              <label style={{ marginRight: "0.5rem", fontWeight: 'bold' }}>
                                เดือน:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <label style={{ margin: "0.5rem", fontWeight: 'bold' }}>ปี:</label>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={publicHolidayDay}
                                onChange={(e) => setPublicHolidayDay(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกวันที่</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                  (day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={publicHolidayMonth}
                                onChange={(e) => setPublicHolidayMonth(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกเดือน</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                  (month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={publicHolidayYear}
                                onChange={(e) => setPublicHolidayYear(e.target.value)}
                                style={{ borderRadius: '6px' }}
                              >
                                <option value="">เลือกปี</option>
                                {Array.from(
                                  { length: 7 },
                                  (_, i) => new Date().getFullYear() + 3 - i
                                ).map((year) => (
                                  <option key={year} value={year}>
                                    {year + 543}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <br />
                            <div className="col-md-12 mt-2">
                                <b className="">หมายเหตุ:</b>
                                <input 
                                  className="form-control container mt-2" 
                                  placeholder="เช่น วันแม่แห่งชาติ" 
                                  type="text" 
                                  value={publicHolidayNote}
                                  onChange={(e) => setPublicHolidayNote(e.target.value)}
                                />
                            </div>
                            
                          </div>
                          <br />

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddPublicHoliday}
                            
                          >
                          {editingPublicHolidayIndex !== null ? 'บันทึกการแก้ไข' : 'เพิ่ม'}
                          </button>
                          {editingPublicHolidayIndex !== null && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setEditingPublicHolidayIndex(null);
                                setPublicHolidayDay("");
                                setPublicHolidayMonth("");
                                setPublicHolidayYear(new Date().getFullYear());
                                setPublicHolidayNote("");
                              }}
                              style={{ marginLeft: '8px' }}
                            >
                              ยกเลิก
                            </button>
                          )}
                        </div>

                        <br />
          
                        {publicHolidayDates.length > 0 && (
                          <div>
                            <h5>รายการวันหยุดนักขัตฤกษ์ (วัน/เดือน/ปี)</h5>
                            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                              {publicHolidayDates
                                .filter(holiday => {
                                  // กรองเฉพาะข้อมูลที่ถูกต้อง
                                  const date = holiday.date || holiday;
                                  return date instanceof Date && !isNaN(date.getTime());
                                })
                                .sort((a, b) => {
                                  const dateA = a.date || a;
                                  const dateB = b.date || b;
                                  return dateA - dateB;
                                })
                                .map((holiday, index) => (
                                  <div key={index} style={{ 
                                    backgroundColor: 'white', 
                                    padding: '10px', 
                                    marginBottom: '8px', 
                                    borderRadius: '6px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                      {`${index + 1}. `}
                                      {(() => {
                                        try {
                                          const date = holiday.date || holiday;
                                          if (date instanceof Date && !isNaN(date.getTime())) {
                                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
                                          } else {
                                            return "วันที่ไม่ถูกต้อง";
                                          }
                                        } catch (error) {
                                          console.error("Error formatting date:", error);
                                          return "วันที่ไม่ถูกต้อง";
                                        }
                                      })()}
                                      {holiday.note && (
                                        <span style={{ color: '#666', marginLeft: '8px' }}>
                                          - {holiday.note}
                                        </span>
                                      )}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleEditPublicHoliday(holiday, index)}
                                        className="btn btn-warning"
                                      >
                                        แก้ไข
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePublicHoliday(holiday)}
                                        className="btn btn-danger"
                                      >
                                        ลบ
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </div> */}
                </div>

{/* Special work                   */}
{/* <h2 class="title">ตั้งค่าวันทํางานพิเศษ</h2>
<section className="Frame">
  
      <div className="row mb-3 align-items-center">
    <div className="col-md-2">เลือกวันที่</div>
    <div className="col-md-2">
      <DatePicker
        selected={workDate_specialwork}
        onChange={setWorkDate_specialwork}
        dateFormat="dd/MM/yyyy"
        className="form-control"
      />
    </div>
    
    
    <div className="col-md-2">
      <select className="form-control">
        <option value="clear">เคลียร์</option>
        <option value="job">จ๊อบ</option>
        <option value="job-speacial">OT จ้างเสริมนอกเวลาสัญญา</option>
      </select>
    </div>

   
  </div>

  <div className="row text-center font-weight-bold mb-2">
    <div className="col-md-1">กะ</div>
    <div className="col-md-1">เข้า OT ก่อน</div>
    <div className="col-md-1">ออก OT ก่อน</div>
    <div className="col-md-1">เวลาเข้า</div>
    <div className="col-md-1">เวลาออก</div>
    <div className="col-md-1">เวลาเข้า OT</div>
    <div className="col-md-1">เวลาออก OT</div>
    <div className="col-md-1">ค่าจ้าง</div>
    <div className="col-md-1">ค่าจ้าง OT</div>
    <div className="col-md-2">รายละเอียดงาน</div>
  </div>

  <div className="row align-items-center mb-3">
    <div className="col-md-1">
      <select
        name="shift_specialwork"
        className="form-control"
        value={workTimeDay_specialwork.shift_specialwork}
        onChange={handleInputChange_specialwork}
      >
        <option value="">เลือกกะ</option>
        {shiftWork_specialwork.map((shift, index) => (
          <option key={index} value={shift}>
            {shift}
          </option>
        ))}
      </select>
    </div>

    {["beforeStartTimeOT_specialwork","beforeEndTimeOT_specialwork", "startTime_specialwork", "endTime_specialwork", "startTimeOT_specialwork", "endTimeOT_specialwork", "payment_specialwork", "paymentOT_specialwork"].map((field, idx) => (
      <div key={idx} className="col-md-1">
        <input
          type="text"
          name={field}
          className="form-control"
          placeholder={field.includes("Time") ? "เช่น 08:30" : 
            field.includes("payment_specialwork") && !field.includes("paymentOT") ? `บาท (ค่าเริ่มต้น: ${workRate || 0})` : 
            field.includes("paymentOT_specialwork") ? `บาท (ค่าเริ่มต้น: ${((parseFloat(workRate || 0) / 8) * parseFloat(workRateOT || 1.5)).toFixed(2)})` : 
            "บาท"}
          value={workTimeDay_specialwork[field] || 
            (field === "payment_specialwork" && workRate ? workRate : 
             field === "paymentOT_specialwork" && workRate && workRateOT ? 
             ((parseFloat(workRate) / 8) * parseFloat(workRateOT)).toFixed(2) : 
             workTimeDay_specialwork[field] || "")}
          onChange={handleInputChange_specialwork}
          onInput={(e) => {
            // For time fields, format the input as HH:MM
            if (field.includes("Time")) {
              let value = e.target.value.replace(/[^0-9]/g, "");
              if (value.length >= 3) {
                value = value.substring(0, 2) + "." + value.substring(2, 4);
              }
              e.target.value = value;
            } else if (field.includes("payment")) {
              // For payment fields, allow only numbers and decimal
              e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              const parts = e.target.value.split(".");
              if (parts.length > 2) {
                e.target.value = `${parts[0]}.${parts[1]}`;
              }
            }
          }}
        />
      </div>
    ))}

    <div className="col-md-3">
      <input
        type="text"
        name="workDetail_specialwork"
        className="form-control"
        placeholder="รายละเอียดงาน"
        value={workTimeDay_specialwork.workDetail_specialwork}
        onChange={handleInputChange_specialwork}
      />
    </div>
  </div>


     
      <h5 className="mt-4">ตำแหน่งและจำนวนคน</h5>
      <div className="d-flex justify-content-start mt-3 mb-4">
      <button type="button" className="btn btn-success mb-2" onClick={handleAddTimePerson_specialwork}>
        + เพิ่มตำแหน่ง
      </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead>
            <tr>
              <th>ตำแหน่ง</th>
              <th>จำนวนคน</th>
              <th>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {workTimeDay_specialwork.employees_specialwork.map((emp, index) => (
              <tr key={index}>
                <td>
                  <select name="positionWork_specialwork" className="form-control" value={emp.positionWork_specialwork} onChange={(e) => handleInputChangePerson_specialwork(e, index)}>
                    <option value="">เลือกตำแหน่ง</option>
                    {positionWork_specialwork.map((position, posIndex) => (
                      <option key={posIndex} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="text" name="countPerson_specialwork" className="form-control" placeholder="จำนวนคน" value={emp.countPerson_specialwork} onChange={(e) => handleInputChangePerson_specialwork(e, index)} />
                </td>
                <td>
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveTimePerson_specialwork(index)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  <div className="d-flex justify-content-start mt-3 mb-5">
  <button
    type="button"
    className="btn btn-primary"
    onClick={handleAddTimeList_specialwork}
  >
    ➕ เพิ่มรายการ
  </button>
</div>


{workTimeDayList_specialwork.length > 0 && (
  <div className="table-responsive mt-4">
    <h5>📌 ตารางเวลาทำงาน</h5>
    <table className="table table-bordered text-center align-middle">
      <thead>
        <tr>
          <th>วันที่</th>
          <th>กะ</th>
          <th>เข้า OT ก่อน</th>
          <th>ออก OT ก่อน</th>
          <th>เวลาเข้า</th>
          <th>เวลาออก</th>
          <th>เวลาเข้า OT</th>
          <th>เวลาออก OT</th>
          <th>อัตราค่าจ้าง</th>
          <th>อัตราค่าจ้าง OT</th>
          <th>รายละเอียดงาน</th>
          <th>ตำแหน่งและจำนวนคน</th>
          <th>ลบ</th>
        </tr>
      </thead>
      <tbody>
        {workTimeDayList_specialwork.map((item, index) => (
          <tr key={index}>
            <td>{item.day_specialwork}</td>
            <td>{item.shift_specialwork}</td>
            <td>{item.beforeStartTimeOT_specialwork}</td>
            <td>{item.beforeEndTimeOT_specialwork}</td>
            <td>{item.startTime_specialwork}</td>
            <td>{item.endTime_specialwork}</td>
            <td>{item.startTimeOT_specialwork}</td>
            <td>{item.endTimeOT_specialwork}</td>
            <td>{item.payment_specialwork} บาท</td>
            <td>{item.paymentOT_specialwork} บาท</td>
            <td>{item.workDetail_specialwork}</td>
            <td>
  {item.employees_specialwork.length > 0 ? (
    item.employees_specialwork.map((emp, i) => (
      <div key={i} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{emp.positionWork_specialwork} - </span>
        <input
          type="text"
          value={emp.countPerson_specialwork}
          onChange={(e) => handleInlineEdit_specialwork(index, i, e.target.value)}
          onInput={(e) => {
            // Allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          style={{
            width: '30px',
            padding: '2px 5px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            textAlign: 'center'
          }}
        />
        <span>คน</span>
      </div>
    ))
  ) : (
    <span>-</span>
  )}
</td>
            <td>
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveTimeList_specialwork(index)}>
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

     
      {workTimeDayList_specialwork.length > 0 && (
        <div className="table-responsive mt-4">
          <h5>📌 ตารางเวลาทำงาน</h5>
          <table className="table table-bordered text-center align-middle">
            <tbody>
              {workTimeDayList_specialwork.map((item, index) => (
                <tr key={index}>
                  <td>{item.day_specialwork}</td>
                  <td>{item.shift_specialwork}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section> */}
                {/* <section class="Frame">
                  <div>
                    {showEmployeeListResult.length > 0 && (
                      <>
                        <h3>
                          พนักงานในหน่วยงาน {showEmployeeListResult.length} คน
                        </h3>
                        <ul>
                          {showEmployeeListResult.map((employee, index) => (
                            <li key={index}>
                              {employee.employeeId}: {employee.name}{" "}
                              {employee.lastName}
                            </li>
                            // Replace "name" with the property you want to display for each employee
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </section> */}
           
                                <div class="line_btn">
                  {newWorkplace ? (
                    <p></p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveCustomWorkplace}
                      class="btn b_save"
                    >
                      <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                    </button>
                  )}
                  {/* <button class="btn clean">
                    <i class="far fa-window-close" onClick={handleDeleteCustomWorkplace}></i> &nbsp;ล้างการตั้งค่า
                  </button> */}
                </div>

              </form>
              </div> 
              </div> 
            </div>
          
          </section>
       
    </div>
  );
}

