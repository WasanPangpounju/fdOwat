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
  };
  console.log("formattedDate", formattedDate);
  useEffect(() => {
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const popupStyle = {
    position: "absolute",
    background: "white",
    border: "1px solid #ccc",
    padding: "10px",
    zIndex: 1000,
    width: "30rem",
  };
  const [storedEmp, setStoredEmp] = useState([]);

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

  // เมื่อมีการเลือกพนักงานใน Tab 1 จะส่งไปให้ Tab 2
  const handleEmployeeSelectForTab2 = async (employee) => {
    console.log('🎯 Selected employee for Tab 2:', employee);
    setSelectedEmployeeForTab2(employee);
    setActiveTab("tab2"); // เปลี่ยนไป Tab 2 อัตโนมัติ
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
        setSalary(fullEmployeeData.salary || '');
        setStartjob(fullEmployeeData.startjob || '');
        setExceptjob(fullEmployeeData.exceptjob || '');
        
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
  const [employeeData, setEmployeeData] = useState({});
  const [jobtype, setJobtype] = useState(""); //ประเภทการจ้าง
  const [salary, setSalary] = useState(""); //เงินจ้าง

  const [startjob, setStartjob] = useState(""); //วันที่เริ่มงาน
  const [endjob, setEndjob] = useState(""); //วันที่ลาออก
  const [exceptjob, setExceptjob] = useState(""); //วันที่บรรจุ
  
  // Salary Tab 2 States
  const [paymentMethod, setPaymentMethod] = useState(""); //วิธีจ่ายเงิน
  const [bank, setBank] = useState(""); //ธนาคาร
  const [accountNumber, setAccountNumber] = useState(""); //เลขบัญชี
  
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
  const [sickLeave, setSickLeave] = useState(""); //วันลาป่วย
  const [vacationLeave, setVacationLeave] = useState(""); //วันลาพักร้อน
  const [maternityLeave, setMaternityLeave] = useState(""); //วันลาคลอด
  
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
  const [workplacearea, setWorkplacearea] = useState(""); //

  const [workplaceSelection, setWorkplaceSelection] = useState([]);
  const [addSalaryWorkplace, setAddSalaryWorkplace] = useState([]);

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
    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();
    let ageNow = today.getFullYear() - birthDate.getFullYear() + 543;
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
      const dob = `${day}/${month}/${year}`;
      //   setDateOfBirth(dob);
      calculateAge(dob);
    }
  }, [day, month, year]);

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

  async function handleManageEmployee(event) {
    event.preventDefault();
    
    // ป้องกันการส่งฟอร์มซ้ำขณะ loading
    if (isLoading) {
      return;
    }
    
    // ตรวจสอบช่องที่บังคับกรอก
    const requiredFields = [
      { field: employeeId, name: 'รหัสพนักงาน' },
      { field: workplace, name: 'หน่วยงาน' },
      { field: position, name: 'ตำแหน่ง' },
      { field: jobtype, name: 'ประเภทการจ้าง' },
      { field: prefix, name: 'คำนำหน้า' },
      { field: name, name: 'ชื่อ' },
      { field: lastName, name: 'นามสกุล' },
      { field: formattedDate, name: 'วันเกิด' },
      { field: idCard, name: 'เลขบัตรประชาชน' },
      { field: ethnicity, name: 'เชื้อชาติ' },
      { field: religion, name: 'ศาสนา' },
      { field: maritalStatus, name: 'สถานภาพการสมรส' },
      { field: address, name: 'ที่อยู่ตามบัตรประชาชน' },
      { field: currentAddress, name: 'ที่อยู่ปัจจุบัน' }
    ];

    const missingFields = requiredFields.filter(item => !item.field || item.field.trim() === '');
    
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(item => item.name).join(', ');
      
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        html: `<div style="text-align: left;">
          <p>ช่องที่ยังไม่ได้กรอก:</p>
          <ul style="color: #dc3545; font-weight: bold;">
            ${missingFields.map(item => `<li>${item.name}</li>`).join('')}
          </ul>
        </div>`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f0ad4e'
      });
      return;
    }

    // ตรวจสอบความถูกต้องของเลขบัตรประชาชน
    if (idCard && idCard.length !== 13) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'เลขบัตรประชาชนต้องมี 13 หลัก',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    // ตรวจสอบเบอร์โทรศัพท์
    if (phoneNumber && (phoneNumber.length < 9 || phoneNumber.length > 10)) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'เบอร์โทรศัพท์ต้องมี 9-10 หลัก',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    // ตรวจสอบบัตรประชาชนซ้ำก่อนบันทึก (เฉพาะการสร้างพนักงานใหม่)
    if (newEmp && idCard) {
      try {
        // แสดง loading สำหรับการตรวจสอบ
        setIsLoading(true);
        Swal.fire({
          title: 'กำลังตรวจสอบข้อมูล...',
          html: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const checkIdResponse = await axios.get(`${endpoint}/employee/check-idcard/${idCard}`);
        
        if (checkIdResponse.data.exists) {
          const existingEmployee = checkIdResponse.data.employee;
          
          setIsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'เลขบัตรประชาชนซ้ำ',
            html: `<div style="text-align: left;">
              <p><strong>เลขบัตรประชาชน "${idCard}" ถูกใช้แล้วโดย:</strong></p>
              <ul style="color: #dc3545; font-weight: bold; margin: 10px 0;">
                <li>ชื่อ: ${existingEmployee.name} ${existingEmployee.lastName || ''}</li>
                <li>รหัสพนักงาน: ${existingEmployee.employeeId}</li>
                <li>หน่วยงาน: ${existingEmployee.workplace || '-'}</li>
              </ul>
              <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบเลขบัตรประชาชนและลองใหม่อีกครั้ง</p>
            </div>`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
          return;
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error checking ID Card:", error);
        // หากเกิดข้อผิดพลาดในการตรวจสอบ ให้ดำเนินการต่อไป
        // แต่แสดงคำเตือน
        if (error.response?.status !== 404) {
          Swal.fire({
            icon: 'warning',
            title: 'ไม่สามารถตรวจสอบบัตรประชาชนได้',
            text: 'ระบบจะดำเนินการบันทึกต่อไป แต่อาจมีการตรวจสอบซ้ำในขั้นตอนถัดไป',
            confirmButtonText: 'ดำเนินการต่อ',
            confirmButtonColor: '#f0ad4e'
          });
        }
      }
    }

    // ตรวจสอบรหัสพนักงานซ้ำก่อนบันทึก (เฉพาะการสร้างพนักงานใหม่)
    if (newEmp && employeeId) {
      try {
        // หาก loading ยังไม่ถูกเปิดจากการตรวจสอบบัตรประชาชน
        if (!isLoading) {
          setIsLoading(true);
          Swal.fire({
            title: 'กำลังตรวจสอบข้อมูล...',
            html: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }

        const checkEmpResponse = await axios.get(`${endpoint}/employee/check-employeeid/${employeeId}`);
        
        if (checkEmpResponse.data.exists) {
          const existingEmployee = checkEmpResponse.data.employee;
          
          setIsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'รหัสพนักงานซ้ำ',
            html: `<div style="text-align: left;">
              <p><strong>รหัสพนักงาน "${employeeId}" ถูกใช้แล้วโดย:</strong></p>
              <ul style="color: #dc3545; font-weight: bold; margin: 10px 0;">
                <li>ชื่อ: ${existingEmployee.name} ${existingEmployee.lastName || ''}</li>
                <li>เลขบัตรประชาชน: ${existingEmployee.idCard || '-'}</li>
                <li>หน่วยงาน: ${existingEmployee.workplace || '-'}</li>
              </ul>
              <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบรหัสพนักงานและลองใหม่อีกครั้ง</p>
            </div>`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
          return;
        }
      } catch (error) {
        console.error("Error checking Employee ID:", error);
        // หากไม่มี API นี้หรือเกิดข้อผิดพลาด ให้ดำเนินการต่อไป
        if (error.response?.status !== 404 && error.response?.status !== 501) {
          console.warn("Employee ID check API not available or error occurred");
        }
      }
    }

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
    };
    console.log(data);

    //check create or update Employee
    if (newEmp) {
      // แสดง loading (หาก loading ยังไม่ถูกเปิดจากการตรวจสอบข้อมูล)
      if (!isLoading) {
        setIsLoading(true);
        Swal.fire({
          title: 'กำลังบันทึกข้อมูล...',
          html: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      } else {
        // อัปเดตข้อความ loading
        Swal.update({
          title: 'กำลังบันทึกข้อมูล...',
          html: 'กรุณารอสักครู่'
        });
      }

      try {
        const response = await axios.post(endpoint + "/employee/create", data);
        
        setIsLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ!',
          text: 'ข้อมูลพนักงานถูกบันทึกเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#28a745'
        }).then(() => {
          window.location.reload();
        });

      } catch (error) {
        setIsLoading(false);
        console.error("Error:", error);
        console.error("Response Data:", error.response?.data);
        
        let errorMessage = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
        let errorDetails = [];

        if (error.response?.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          
          if (error.response.data.errors) {
            errorDetails = Object.entries(error.response.data.errors).map(([field, msg]) => `${field}: ${msg}`);
          }
          
          if (error.response.data.code === 11000) {
            errorMessage = 'ข้อมูลซ้ำในระบบ';
            if (error.response.data.keyPattern?.employeeId) {
              errorDetails.push('รหัสพนักงานนี้มีอยู่ในระบบแล้ว');
            }
            if (error.response.data.keyPattern?.idCard) {
              errorDetails.push('เลขบัตรประชาชนนี้มีอยู่ในระบบแล้ว');
            }
            
            // หากมีข้อมูลพนักงานที่ซ้ำ
            if (error.response.data.conflictData) {
              const conflictEmp = error.response.data.conflictData;
              if (conflictEmp.employeeId === employeeId) {
                errorDetails.push(`รหัสพนักงาน "${employeeId}" ถูกใช้โดย: ${conflictEmp.name} ${conflictEmp.lastName || ''}`);
              }
              if (conflictEmp.idCard === idCard) {
                errorDetails.push(`เลขบัตรประชาชน "${idCard}" ถูกใช้โดย: ${conflictEmp.name} ${conflictEmp.lastName || ''} (รหัส: ${conflictEmp.employeeId})`);
              }
            }
          }
          
          // จัดการข้อผิดพลาดอื่นๆ
          if (error.response.data.details) {
            errorDetails.push(...error.response.data.details);
          }
          
          // จัดการกรณี validation error จาก API
          if (error.response.data.validationErrors) {
            errorDetails.push(...error.response.data.validationErrors);
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          html: `<div style="text-align: left;">
            <p><strong>สาเหตุ:</strong> ${errorMessage}</p>
            ${errorDetails.length > 0 ? `
              <p><strong>รายละเอียด:</strong></p>
              <ul style="color: #dc3545;">
                ${errorDetails.map(detail => `<li>${detail}</li>`).join('')}
              </ul>
            ` : ''}
            <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง</p>
          </div>`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#dc3545'
        });
      }
    } else {
      if (buttonValue == "save") {
        // เพิ่มการตรวจสอบข้อมูลก่อนอัปเดต
        const updateRequiredFields = [
          { field: employeeId, name: 'รหัสพนักงาน' },
          { field: workplace, name: 'หน่วยงาน' },
          { field: position, name: 'ตำแหน่ง' },
          { field: jobtype, name: 'ประเภทการจ้าง' },
          { field: prefix, name: 'คำนำหน้า' },
          { field: name, name: 'ชื่อ' },
          { field: lastName, name: 'นามสกุล' },
          { field: formattedDate, name: 'วันเกิด' },
          { field: idCard, name: 'เลขบัตรประชาชน' },
          { field: ethnicity, name: 'เชื้อชาติ' },
          { field: religion, name: 'ศาสนา' },
          { field: maritalStatus, name: 'สถานภาพการสมรส' },
          { field: address, name: 'ที่อยู่ตามบัตรประชาชน' },
          { field: currentAddress, name: 'ที่อยู่ปัจจุบัน' }
        ];

        const missingUpdateFields = updateRequiredFields.filter(item => !item.field || item.field.trim() === '');
        
        if (missingUpdateFields.length > 0) {
          const missingFieldNames = missingUpdateFields.map(item => item.name).join(', ');
          
          Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนอัปเดต',
            html: `<div style="text-align: left;">
              <p>ช่องที่ยังไม่ได้กรอก:</p>
              <ul style="color: #dc3545; font-weight: bold;">
                ${missingUpdateFields.map(item => `<li>${item.name}</li>`).join('')}
              </ul>
            </div>`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#f0ad4e'
          });
          return;
        }

        // ตรวจสอบความถูกต้องของข้อมูลก่อนอัปเดต
        if (idCard && idCard.length !== 13) {
          Swal.fire({
            icon: 'error',
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'เลขบัตรประชาชนต้องมี 13 หลัก',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
          return;
        }

        if (phoneNumber && (phoneNumber.length < 9 || phoneNumber.length > 10)) {
          Swal.fire({
            icon: 'error',
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'เบอร์โทรศัพท์ต้องมี 9-10 หลัก',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#dc3545'
          });
          return;
        }

        // ตรวจสอบบัตรประชาชนซ้ำก่อนอัปเดต
        if (idCard) {
          try {
            // แสดง loading สำหรับการตรวจสอบ
            setIsLoading(true);
            Swal.fire({
              title: 'กำลังตรวจสอบข้อมูล...',
              html: 'กรุณารอสักครู่',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

            const checkIdResponse = await axios.get(`${endpoint}/employee/check-idcard/${idCard}`);
            
            if (checkIdResponse.data.exists) {
              const existingEmployee = checkIdResponse.data.employee;
              
              // ตรวจสอบว่าเป็นพนักงานคนเดียวกันหรือไม่
              if (existingEmployee._id !== _id) {
                setIsLoading(false);
                Swal.fire({
                  icon: 'error',
                  title: 'เลขบัตรประชาชนซ้ำ',
                  html: `<div style="text-align: left;">
                    <p><strong>เลขบัตรประชาชน "${idCard}" ถูกใช้แล้วโดย:</strong></p>
                    <ul style="color: #dc3545; font-weight: bold; margin: 10px 0;">
                      <li>ชื่อ: ${existingEmployee.name} ${existingEmployee.lastName || ''}</li>
                      <li>รหัสพนักงาน: ${existingEmployee.employeeId}</li>
                      <li>หน่วยงาน: ${existingEmployee.workplace || '-'}</li>
                    </ul>
                    <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบเลขบัตรประชาชนและลองใหม่อีกครั้ง</p>
                  </div>`,
                  confirmButtonText: 'ตกลง',
                  confirmButtonColor: '#dc3545'
                });
                return;
              }
            }
          } catch (error) {
            setIsLoading(false);
            console.error("Error checking ID Card:", error);
            // หากเกิดข้อผิดพลาดในการตรวจสอบ ให้ดำเนินการต่อไป
            if (error.response?.status !== 404) {
              const result = await Swal.fire({
                icon: 'warning',
                title: 'ไม่สามารถตรวจสอบบัตรประชาชนได้',
                text: 'ต้องการดำเนินการอัปเดตต่อไปหรือไม่?',
                showCancelButton: true,
                confirmButtonText: 'ดำเนินการต่อ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f0ad4e',
                cancelButtonColor: '#6c757d'
              });
              
              if (!result.isConfirmed) {
                return;
              }
            }
          }
        }

        // ตรวจสอบรหัสพนักงานซ้ำก่อนอัปเดต
        if (employeeId) {
          try {
            // หาก loading ยังไม่ถูกเปิดจากการตรวจสอบบัตรประชาชน
            if (!isLoading) {
              setIsLoading(true);
              Swal.fire({
                title: 'กำลังตรวจสอบข้อมูล...',
                html: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                  Swal.showLoading();
                }
              });
            }

            const checkEmpResponse = await axios.get(`${endpoint}/employee/check-employeeid/${employeeId}`);
            
            if (checkEmpResponse.data.exists) {
              const existingEmployee = checkEmpResponse.data.employee;
              
              // ตรวจสอบว่าเป็นพนักงานคนเดียวกันหรือไม่
              if (existingEmployee._id !== _id) {
                setIsLoading(false);
                Swal.fire({
                  icon: 'error',
                  title: 'รหัสพนักงานซ้ำ',
                  html: `<div style="text-align: left;">
                    <p><strong>รหัสพนักงาน "${employeeId}" ถูกใช้แล้วโดย:</strong></p>
                    <ul style="color: #dc3545; font-weight: bold; margin: 10px 0;">
                      <li>ชื่อ: ${existingEmployee.name} ${existingEmployee.lastName || ''}</li>
                      <li>เลขบัตรประชาชน: ${existingEmployee.idCard || '-'}</li>
                      <li>หน่วยงาน: ${existingEmployee.workplace || '-'}</li>
                    </ul>
                    <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบรหัสพนักงานและลองใหม่อีกครั้ง</p>
                  </div>`,
                  confirmButtonText: 'ตกลง',
                  confirmButtonColor: '#dc3545'
                });
                return;
              }
            }
          } catch (error) {
            console.error("Error checking Employee ID:", error);
            // หากไม่มี API นี้หรือเกิดข้อผิดพลาด ให้ดำเนินการต่อไป
            if (error.response?.status !== 404 && error.response?.status !== 501) {
              console.warn("Employee ID check API not available or error occurred");
            }
          }
        }

        // แสดง loading สำหรับการอัปเดต
        if (!isLoading) {
          setIsLoading(true);
          Swal.fire({
            title: 'กำลังอัปเดตข้อมูล...',
            html: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        } else {
          // อัปเดตข้อความ loading
          Swal.update({
            title: 'กำลังอัปเดตข้อมูล...',
            html: 'กรุณารอสักครู่'
          });
        }

        try {
          const response = await axios.put(
            endpoint + "/employee/update/" + _id,
            data
          );
          
          if (response) {
            setIsLoading(false);
            Swal.fire({
              icon: 'success',
              title: 'อัปเดตสำเร็จ!',
              text: 'ข้อมูลพนักงานถูกอัปเดตเรียบร้อยแล้ว',
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#28a745'
            }).then(() => {
              window.location.reload();
            });
          }
        } catch (error) {
          setIsLoading(false);
          console.error("Error:", error);
          console.error("Response Data:", error.response?.data);
          
          let errorMessage = 'เกิดข้อผิดพลาดในการอัปเดต';
          let errorDetails = [];

          if (error.response?.data) {
            if (error.response.data.message) {
              errorMessage = error.response.data.message;
            }
            
            // จัดการข้อผิดพลาดเกี่ยวกับการตรวจสอบความถูกต้อง
            if (error.response.data.errors) {
              if (Array.isArray(error.response.data.errors)) {
                errorDetails = error.response.data.errors;
              } else {
                errorDetails = Object.entries(error.response.data.errors).map(([field, msg]) => `${field}: ${msg}`);
              }
            }
            
            // จัดการข้อผิดพลาดเกี่ยวกับข้อมูลซ้ำ (MongoDB duplicate key error)
            if (error.response.data.code === 11000 || error.response.status === 409) {
              errorMessage = 'ข้อมูลซ้ำในระบบ';
              
              if (error.response.data.keyPattern?.employeeId) {
                errorDetails.push('รหัสพนักงานนี้มีอยู่ในระบบแล้ว');
              }
              if (error.response.data.keyPattern?.idCard) {
                errorDetails.push('เลขบัตรประชาชนนี้มีอยู่ในระบบแล้ว');
              }
              
              // หากมีข้อมูลพนักงานที่ซ้ำ
              if (error.response.data.conflictData) {
                const conflictEmp = error.response.data.conflictData;
                if (conflictEmp.employeeId === employeeId) {
                  errorDetails.push(`รหัสพนักงาน "${employeeId}" ถูกใช้โดย: ${conflictEmp.name} ${conflictEmp.lastName || ''}`);
                }
                if (conflictEmp.idCard === idCard) {
                  errorDetails.push(`เลขบัตรประชาชน "${idCard}" ถูกใช้โดย: ${conflictEmp.name} ${conflictEmp.lastName || ''} (รหัส: ${conflictEmp.employeeId})`);
                }
              }
            }
            
            // จัดการข้อผิดพลาดอื่นๆ
            if (error.response.data.details) {
              errorDetails.push(...error.response.data.details);
            }
            
            // จัดการกรณี validation error จาก API
            if (error.response.data.validationErrors) {
              errorDetails.push(...error.response.data.validationErrors);
            }
          }
          
          // หากไม่มีรายละเอียดเฉพาะ ให้แสดงสถานะ HTTP
          if (errorDetails.length === 0 && error.response?.status) {
            switch (error.response.status) {
              case 400:
                errorDetails.push('ข้อมูลที่ส่งไม่ถูกต้อง');
                break;
              case 401:
                errorDetails.push('ไม่มีสิทธิ์ในการเข้าถึง');
                break;
              case 403:
                errorDetails.push('ไม่อนุญาตให้ทำการดำเนินการนี้');
                break;
              case 404:
                errorDetails.push('ไม่พบข้อมูลพนักงานที่ต้องการอัปเดต');
                break;
              case 500:
                errorDetails.push('เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์');
                break;
              default:
                errorDetails.push(`รหัสข้อผิดพลาด: ${error.response.status}`);
            }
          }
          
          Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถอัปเดตข้อมูลได้',
            html: `<div style="text-align: left;">
              <p><strong>สาเหตุ:</strong> ${errorMessage}</p>
              ${errorDetails.length > 0 ? `
                <p><strong>รายละเอียด:</strong></p>
                <ul style="color: #dc3545;">
                  ${errorDetails.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
              ` : ''}
              <p style="color: #6c757d; font-size: 0.9em;">กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง</p>
            </div>`,
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
            <li class="breadcrumb-item active">ระบบ เพิ่ม/ลบ พนักงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ระบบ เพิ่ม/ลบ
                  พนักงาน
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
                  <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
                  อื่นๆ
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
                      <section class="Frame">
                        <div class="col-md-12">
                          <form onSubmit={handleSearch}>
                            {/* Row 1: รหัสพนักงาน | หน่วยงาน */}
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchEmployeeId">
                                    รหัสพนักงาน
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchEmployeeId"
                                    placeholder="รหัสพนักงาน"
                                    value={searchEmployeeId}
                                    onChange={(e) =>
                                      setSearchEmployeeId(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchWorkPlace">หน่วยงาน</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchWorkPlace"
                                    placeholder="หน่วยงาน"
                                    value={searchWorkPlace}
                                    onChange={(e) =>
                                      setSearchWorkPlace(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Row 2: ชื่อ | นามสกุล */}
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchFirstName">ชื่อ</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchFirstName"
                                    placeholder="ชื่อ"
                                    value={searchFirstName}
                                    onChange={(e) =>
                                      setSearchFirstName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchLastName">นามสกุล</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchLastName"
                                    placeholder="นามสกุล"
                                    value={searchLastName}
                                    onChange={(e) =>
                                      setSearchLastName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Row 3: เบอร์โทรศัพท์ | หมายเลขบัตรประชาชน */}
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchPhone">เบอร์โทรศัพท์</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchPhone"
                                    placeholder="เบอร์โทรศัพท์"
                                    value={searchPhone}
                                    onChange={(e) =>
                                      setSearchPhone(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label role="searchIdCard">
                                    หมายเลขบัตรประชาชน
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="searchIdCard"
                                    placeholder="หมายเลขบัตรประชาชน"
                                    value={searchIdCard}
                                    onChange={(e) =>
                                      setSearchIdCard(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="d-flex justify-content-center">
                              <button class="btn b_save">
                                <i class="nav-icon fas fa-search"></i> &nbsp;
                                ค้นหา
                              </button>
                            </div>
                          </form>
                          <br />
                          <div class="d-flex justify-content-center">
                            <h2 class="title">
                              ผลลัพธ์ {searchResult.length} รายการ
                            </h2>
                          </div>
                          <div class="d-flex justify-content-center">
                            <div class="row">
                              <div class="col-md-12">
                                <div class="form-group">
                                  {/* <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                                        {searchResult.map(workplace => (
                                                                            <li
                                                                                key={workplace.id}
                                                                                onClick={() => handleClickResult(workplace)}
                                                                            >
                                                                                รหัส {workplace.employeeId} ชื่อ{workplace.name}
                                                                                <button type="button" name="delete" value="delete" onClick={() => deleteEmployee('create')} class="btn b_save"> &nbsp;ลบ</button>

                                                                            </li>
                                                                        ))}
                                                                    </ul> */}
                                  <ul
                                    style={{
                                      listStyle: "none",
                                      marginLeft: "-2rem",
                                    }}
                                  >
                                    {searchResult.map((workplace) => (
                                      <li
                                        key={workplace.id}
                                        style={{ cursor: "pointer", marginBottom: "10px" }}
                                      >
                                        รหัส {workplace.employeeId} ชื่อ{" "}
                                        {workplace.name} {workplace.lastName}
                                        <button
                                          type="button"
                                          onClick={() => handleEmployeeSelectForTab2(workplace)}
                                          className="btn btn-success"
                                          style={{
                                            width: "5rem",
                                            marginLeft: "1rem",
                                          }}
                                        >
                                          เลือก
                                        </button>
                                        <button
                                          type="button"
                                          name="delete"
                                          value="delete"
                                          onClick={() =>
                                            handleDelete(workplace._id)
                                          } // Pass the actual employeeId
                                          className="btn btn-danger"
                                          style={{
                                            width: "5rem",
                                            marginLeft: "1rem",
                                          }}
                                        >
                                          &nbsp;ลบ
                                        </button>
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
            <section class="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    {/* Header with selected employee info */}
                    {selectedEmployeeForTab2 && (
                      <div className="alert alert-info" style={{ 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                          กำลังแสดงข้อมูลพนักงาน: <strong>{selectedEmployeeForTab2.name} {selectedEmployeeForTab2.lastName}</strong> 
                          <span style={{ 
                            marginLeft: '10px',
                            padding: '4px 12px',
                            background: '#007bff',
                            color: 'white',
                            borderRadius: '15px',
                            fontSize: '13px'
                          }}>
                            รหัส: {selectedEmployeeForTab2.employeeId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('createEdit')}
                          className="btn btn-sm btn-secondary"
                        >
                          <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i>
                          กลับไปค้นหา
                        </button>
                      </div>
                    )}

                    {/* Employee Component */}
                    <Employee preSelectedEmployee={selectedEmployeeForTab2} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 3 Content */}
          {activeTab === 'tab3' && (
          <section class="content">
            <div class="row">
              <div class="col-md-12">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-md-12">
                      <section class="Frame">
                        <div class="col-md-12">
                          <h3>แท็บที่ 3 - เนื้อหาเพิ่มเติม</h3>
                          <p>สามารถเพิ่มฟอร์มหรือเนื้อหาอื่นๆ ได้ที่นี่</p>
                          
                          {/* ตัวอย่างฟอร์ม */}
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group">
                                <label>ข้อมูลตัวอย่าง 1</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="กรอกข้อมูล"
                                />
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                <label>ข้อมูลตัวอย่าง 2</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="กรอกข้อมูล"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-md-12">
                              <button type="button" class="btn btn-primary">
                                บันทึก
                              </button>
                              <button type="button" class="btn btn-secondary ml-2">
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

        </div>
      </div>
    {/* </body> */}
    </div>
  );
}

export default AddEditEmployee;