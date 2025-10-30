import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmployeesSelected from "./EmployeesSelected";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../editwindowcss.css";

import locationData from "./LocationData/locationData";
import provincesData from "./LocationData/json/thai_provinces.json";
import districtsData from "./LocationData/json/thai_amphures.json";
import subDistrictsData from "./LocationData/json/thai_tambons.json";

function Employee() {
  // const locationData = {
  //   กรุงเทพ: {
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

  useEffect(() => {
    document.title = "ข้อมูลพนักงาน";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);

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
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

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

  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [formattedDate321, setFormattedDateStart] = useState("");

  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [formattedDate321End, setFormattedDateEnd] = useState("");

  const [showDatePickerExceptjob, setShowDatePickerExceptjob] = useState(false);
  const [selectedDateExceptjob, setSelectedDateExceptjob] = useState(null);
  const [formattedDate321Exceptjob, setFormattedDateExceptjob] = useState("");

  const [storedEmp, setStoredEmp] = useState([]);
  const [newEmp, setNewEmp] = useState(true);
  const [employeeselection, setEmployeeselection] = useState([]);
  const [buttonValue, setButtonValue] = useState("");

  const [workplaceSelection, setWorkplaceSelection] = useState([]);

  useEffect(() => {
    const storedValue = sessionStorage.getItem("empSelect");
    if (storedValue) {
      // setEmployeeselection(storedValue);
    }

    //get all Workplace from API
    // fetch(endpoint + "/workplace/listselect") // Update with your API endpoint
    fetch(endpoint + "/workplace/list") // Update with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setWorkplaceSelection(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  console.log("workplaceSelection", workplaceSelection);
  //employee data
  const [_id, set_id] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(""); //ตำแหน่ง
  const [department, setDepartment] = useState(""); //แผนก
  const handleWorkplaceGroup = (event) => {
    setDepartment(event.target.value);
  };
  const [filteredWorkplaceGroups, setFilteredWorkplaceGroups] = useState([]);

  const [workplace, setWorkplace] = useState(""); //หน่วยงาน
  const [employeeData, setEmployeeData] = useState({});
  const [jobtype, setJobtype] = useState(""); //ประเภทการจ้าง
  const [startjob, setStartjob] = useState(""); //วันที่เริ่มงาน
  const [endjob, setEndjob] = useState(""); //วันที่ลาออก
  const [exceptjob, setExceptjob] = useState(""); //วันที่บรรจุ
  const [prefix, setPrefix] = useState(""); //นำหน้าชื่อ
  const [name, setName] = useState(""); //ชื่อ
  const [lastName, setLastName] = useState(""); //นามสกุล
  const [nickName, setNickName] = useState(""); //ชื่อเล่น
  const [gender, setGender] = useState(""); //เพศ
  // const [dateOfBirth, setDateOfBirth] = useState(""); //วดป เกิด
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
  const [houseNumber, setHouseNumber] = useState(""); //บ้านเลขที่

  const [province2, setProvince2] = useState(""); // จังหวัด
  const [district2, setDistrict2] = useState(""); // อำเภอ
  const [subDistrict2, setSubDistrict2] = useState(""); // ตำบล
  const [postalCode2, setPostalCode2] = useState(""); // ไปรษณีย์
  const [houseNumber2, setHouseNumber2] = useState(""); //บ้านเลขที่

  const [districtOptions, setDistrictOptions] = useState([]); // Options for district
  const [districtOptions2, setDistrictOptions2] = useState([]); // Options for district

  const [subDistrictOptions, setSubDistrictOptions] = useState([]); // Options for sub-district
  const [subDistrictOptions2, setSubDistrictOptions2] = useState([]); // Options for sub-district

  const [tempDistrict, setTempDistrict] = useState(""); // Temporary district
  const [tempSubDistrict, setTempSubDistrict] = useState(""); // Temporary sub-district

  const [isChecked, setIsChecked] = useState(false); // Checkbox state

  // When province changes, update district options and reset selections
  // useEffect(() => {
  //   if (province) {
  //     const districts = locationData[province]?.districts || {};
  //     setDistrictOptions(Object.keys(districts));
  //     setDistrict(""); // Reset district when province changes
  //     setSubDistrict(""); // Reset sub-district when province changes
  //     setSubDistrictOptions([]); // Clear sub-district options
  //     if (tempDistrict) {
  //       setDistrict(tempDistrict);
  //       setTempDistrict(""); // Clear tempDistrict
  //     }
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
      // setSubDistrictOptions([]); // Clear sub-district options
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
      // setSubDistrictOptions2([]); // Clear sub-district options
    }
  }, [province2]);
  // console.log('province',province);
  // console.log('districtOptions',districtOptions);
  // console.log('district',district);
  // console.log('subDistrict',subDistrict);
  // console.log('subDistrictOptions',subDistrictOptions);

  // When district changes, update sub-district options
  // useEffect(() => {
  //   if (district && province) {
  //     const subDistricts = locationData[province]?.districts[district] || [];
  //     setSubDistrictOptions(subDistricts);
  //     setSubDistrict(""); // Reset sub-district when district changes
  //     if (tempSubDistrict) {
  //       setSubDistrict(tempSubDistrict);
  //       setTempSubDistrict(""); // Clear tempSubDistrict
  //     }
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
  const [idLine, setIdLine] = useState(""); //ไอดีไลน์
  const [vaccination, setVaccination] = useState([]); //การรับวัคซีน
  const [treatmentRights, setTreatmentRights] = useState(""); //สิทธิการรักษาพยาบาล

  const [images, setImages] = useState([]); //อัพรูป
  const [imageURLs, setImageURLs] = useState([]);

  //setup file upload
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    //set image and employeeId for upload then employeeId.imageType
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
      setDateOfBirth(dob);
      calculateAge(dob);
    }
  }, [day, month, year]);

  //Update localStorage
  function updateEmployeeLocal(emp) {
    let employeeLocal = JSON.parse(localStorage.getItem("selectedEmployees"));
    // alert(JSON.stringify(employeeLocal, null, 2));

    const employeeLocalUpdate = employeeLocal.map((item) => {
      if (item._id === emp._id) {
        // Update the item here
        return emp;
      }

      return item;
    });

    localStorage.setItem(
      "selectedEmployees",
      JSON.stringify(employeeLocalUpdate)
    );
  }

  const handleChange = (e, field) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));

    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    setImages([...e.target.files]);
    setSelectedFile(e.target.files[0]);
  }

  const [newVaccination, setNewVaccination] = useState("");
  const handleVaccination = (event) => {
    setNewVaccination(event.target.value);
  };

  const handleAddVaccination = () => {
    if (newVaccination.trim() !== "") {
      setVaccination([...vaccination, newVaccination]);
      setNewVaccination("");
    }
  };

  const handleRemoveVaccination = (vaccinationToRemove) => {
    setVaccination((prevVaccination) =>
      prevVaccination.filter((v) => v !== vaccinationToRemove)
    );
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

  function formatDateToDMY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (note: months are zero-indexed)
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year + 543}`; // Return formatted date as day/month/year
  }

  function onEmployeeSelect(empSelect) {
    // alert(empSelect.dateOfBirth);
    set_id(empSelect._id);
    setEmployeeselection(empSelect);
    setEmployeeId(empSelect.employeeId);
    setPosition(empSelect.position);
    setDepartment(empSelect.department);
    setWorkplace(empSelect.workplace);
    setJobtype(empSelect.jobtype);

    setStartjob(empSelect.startjob ? empSelect.startjob : "");
    setSelectedDateStart(empSelect.startjob ? empSelect.startjob : "");
    setEndjob(empSelect.endjob ? empSelect.endjob : "");
    setSelectedDateEnd(empSelect.endjob ? empSelect.endjob : "");

    setExceptjob(empSelect.exceptjob ? empSelect.exceptjob : "");
    // setSelectedDateExceptjob(empSelect.exceptjob ? empSelect.exceptjob : "");
    const startJobDate = empSelect.startjob ? empSelect.startjob : "";
    if (startJobDate) {
      // Split the exceptJobDate into day, month, year
      const [day, month, year] = startJobDate.split("/");

      // Add 543 to the year
      const buddhistYear = parseInt(year).toString();

      // Format the date as YYYY-MM-DD in Buddhist calendar
      const formattedDate = `${buddhistYear}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      // Set the formatted date
      setSelectedDateStart(formattedDate);
    } else {
      // Set an empty string if there's no exceptjob date
      setSelectedDateStart("");
    }
    const endJobDate = empSelect.endjob ? empSelect.endjob : "";
    if (endJobDate) {
      // Split the exceptJobDate into day, month, year
      const [day, month, year] = endJobDate.split("/");

      // Add 543 to the year
      const buddhistYear = parseInt(year).toString();

      // Format the date as YYYY-MM-DD in Buddhist calendar
      const formattedDate = `${buddhistYear}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      // Set the formatted date
      setSelectedDateEnd(formattedDate);
    } else {
      // Set an empty string if there's no exceptjob date
      setSelectedDateEnd("");
    }
    const exceptJobDate = empSelect.exceptjob ? empSelect.exceptjob : "";
    if (exceptJobDate) {
      // Split the exceptJobDate into day, month, year
      const [day, month, year] = exceptJobDate.split("/");

      // Add 543 to the year
      const buddhistYear = parseInt(year).toString();

      // Format the date as YYYY-MM-DD in Buddhist calendar
      const formattedDate = `${buddhistYear}-${month}-${day}`;
      console.log("formattedDate", formattedDate);
      // Set the formatted date
      setSelectedDateExceptjob(formattedDate);
    } else {
      // Set an empty string if there's no exceptjob date
      setSelectedDateExceptjob("");
    }
    // setFormattedDateStart
    // setFormattedDateEnd
    // setFormattedDateExceptjob
    // setPrefix(empSelect.prefix);
    setPrefix(empSelect.prefix === "น.ส." ? "นางสาว" : empSelect.prefix);
    // console.log("startjob", startjob);
    // console.log("endjob", endjob);
    // console.log("exceptjob", exceptjob);
    console.log(
      "startjob",
      empSelect.startjob,
      "Length:",
      empSelect.startjob ? empSelect.startjob.length : 0
    );
    console.log(
      "endjob",
      empSelect.endjob,
      "Length:",
      empSelect.endjob ? empSelect.endjob.length : 0
    );
    console.log(
      "exceptjob",
      empSelect.exceptjob,
      "Length:",
      empSelect.exceptjob ? empSelect.exceptjob.length : 0
    );

    // setShowDatePickerStart(false);
    // setShowDatePickerEnd(false);
    // setShowDatePickerExceptjob(false);
    setName(empSelect.name);
    setLastName(empSelect.lastName);
    setNickName(empSelect.nickName);

    if (
      empSelect.prefix == "น.ส." ||
      empSelect.prefix == "นางสาว" ||
      empSelect.prefix == "นาง"
    ) {
      setGender("หญิง");
      // } else if (empSelect.prefix == "นาย") {
      //   setGender("ชาย");
      // }
    } else {
      setGender("ชาย");
    }
    // setGender(empSelect.gender);
    // setDateOfBirth(new Date(empSelect.dateOfBirth));
    // setDateOfBirth(empSelect.dateOfBirth);
    // const formattedDate = formatDateToDMY(empSelect.dateOfBirth);
    // // Now set the formatted date
    // setDateOfBirth(formattedDate);
    // const isValidDate = !isNaN(new Date(empSelect.dateOfBirth).getTime());

    // if (isValidDate) {
    //   // Format the date if it's a valid Date object
    //   const formattedDate = formatDateToDMY(empSelect.dateOfBirth);
    //   // Set the formatted date
    //   setDateOfBirth(formattedDate);
    // } else {
    //   // Handle case where dateOfBirth is already in the correct format or is not a date
    //   setDateOfBirth(empSelect.dateOfBirth);
    // }
    setDateOfBirth(empSelect.dateOfBirth);

    setAge(empSelect.age);
    setIdCard(empSelect.idCard);
    setEthnicity(empSelect.ethnicity);
    setReligion(empSelect.religion);
    setMaritalStatus(empSelect.maritalStatus);
    setMilitaryStatus(empSelect.militaryStatus);
    setAddress(empSelect.address);

    setProvince(empSelect.province);
    setDistrict(empSelect.district);
    setSubDistrict(empSelect.subDistrict);
    setPostalCode(empSelect.postalCode);
    setHouseNumber(empSelect.houseNumber);

    setProvince2(empSelect.province2);
    setDistrict2(empSelect.district2);
    setSubDistrict2(empSelect.subDistrict2);
    setPostalCode2(empSelect.postalCode2);
    setHouseNumber2(empSelect.houseNumber2);

    setCurrentAddress(empSelect.currentAddress);
    setPhoneNumber(empSelect.phoneNumber);
    setEmergencyContactNumber(empSelect.emergencyContactNumber);
    setIdLine(empSelect.idLine);
    // setVaccination(empSelect.vaccination);
    // const temp = empSelect.vaccination.map((item) => [...item]);
    const temp = (empSelect.vaccination || []).map((item) => [...item]);
    //        alert(temp);
    setVaccination(temp);
    setTreatmentRights(empSelect.treatmentRights);

    set_id(empSelect._id);
    console.log("_id", _id);
  }

  // useEffect(() => {
  //   console.log('_id', _id);
  // }, [_id]);

  async function handleManageEmployee(event) {
    event.preventDefault();

    const data = {
      employeeId: employeeId,
      position: position,
      department: department,
      workplace: workplace,
      jobtype: jobtype,
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
      idLine: idLine,
      vaccination: vaccination,
      treatmentRights: treatmentRights,
    };
    //check create or update Employee
    if (newEmp) {
      // alert('create employee');

      if (buttonValue == "create") {
        try {
          const response = await axios.post(
            endpoint + "/employee/create",
            data
          );
          setEmployeesResult(response.data.employees);
          handleUpload();
        } catch (error) {
          alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
          // window.location.reload();
        }
      }
    } else {
      if (buttonValue == "save") {
        // Make the API call to update the resource by ID
        try {
          const response = await axios.put(
            endpoint + "/employee/update/" + _id,
            data
          );
          // setEmployeesResult(response.data.employees);
          if (response) {
            handleUpload();

            alert("บันทึกสำเร็จ");
            updateEmployeeLocal(response.data);

            window.location.reload();
          }
        } catch (error) {
          alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
          alert(error);
          window.location.reload();
        }
      }
    }
  }

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
    if (filtered !== "") {
      if (employeeData.workplace == "") {
        setWorkplacearea("");
      } else {
        setWorkplacearea(filtered[0].workplaceArea);
      }
    } else {
      setWorkplacearea("");
    }

    // setWorkplacearea(filtered[0].workplaceArea );
  };
  console.log("filteredWorkplaceGroups", filteredWorkplaceGroups);
  const handleJobtype = (event) => {
    setJobtype(event.target.value);
  };
  const handlePrefix = (event) => {
    setPrefix(event.target.value);
  };
  const handleGender = (event) => {
    setGender(event.target.value);
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

  const handleMilitaryStatus = (event) => {
    setMilitaryStatus(event.target.value);
  };

  // const handleStartDateChange = (date) => {
  //   setStartjob(date);
  // };
  // const handleEndDateChange = (date) => {
  //   setEndjob(date);
  // };

  const handleDatePickerStartChange = (date) => {
    setSelectedDateStart(date);
    setShowDatePickerStart(false); // Hide date picker after selecting a date
    // const newDate = new Date(date);
    const [year, month, day] = date.split("-");

    // Format the date as DD/MM/YYYY
    const formattedDate = `${day}/${month}/${year}`;

    setStartjob(formattedDate);
  };

  // useEffect(() => {
  //   if (selectedDateStart) {
  //     // Split the date string into day, month, and year
  //     const [day, month, year] = selectedDateStart.split("/");

  //     // Add 543 to the year
  //     const buddhistYear = (parseInt(year) + 543).toString();

  //     // Format the date with +543 appended
  //     const formattedDate = `${day}/${month}/${buddhistYear}`;

  //     console.log("formattedDate", formattedDate);
  //     setFormattedDateStart(formattedDate);
  //   }
  // }, [selectedDateStart]);
  useEffect(() => {
    if (selectedDateStart) {
      let formattedDate = "";

      // Check if the date is in the YYYY-MM-DD format
      if (selectedDateStart.includes("-")) {
        // Split the date string into year, month, day
        const [year, month, day] = selectedDateStart.split("-");

        // Convert the year to the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date as DD/MM/YYYY with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      } else {
        // Assume the date is already in DD/MM/YYYY format and split it
        const [day, month, year] = selectedDateStart.split("/");

        // Add 543 to the year for the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      }

      console.log("selectedDateExceptjob", selectedDateStart);
      setFormattedDateStart(formattedDate);
    }
  }, [selectedDateStart]);

  console.log("selectedDateStart", selectedDateStart);

  const toggleDatePickerStart = () => {
    setShowDatePickerStart(!showDatePickerStart);
  };

  const handleDatePickerEndChange = (date) => {
    setSelectedDateEnd(date);
    setShowDatePickerEnd(false); // Hide date picker after selecting a date
    const newDate = new Date(date);

    const [year, month, day] = date.split("-");

    // Format the date as DD/MM/YYYY
    const formattedDate = `${day}/${month}/${year}`;

    setEndjob(formattedDate);
  };

  // useEffect(() => {
  //   if (selectedDateEnd) {
  //     // Split the date string into day, month, and year
  //     const [day, month, year] = selectedDateEnd.split("/");

  //     // Add 543 to the year
  //     const buddhistYear = (parseInt(year) + 543).toString();

  //     // Format the date with +543 appended
  //     const formattedDate = `${day}/${month}/${buddhistYear}`;

  //     console.log("formattedDate", formattedDate);
  //     setFormattedDateEnd(formattedDate);
  //   }
  // }, [selectedDateEnd]);
  useEffect(() => {
    if (selectedDateEnd) {
      let formattedDate = "";

      // Check if the date is in the YYYY-MM-DD format
      if (selectedDateEnd.includes("-")) {
        // Split the date string into year, month, day
        const [year, month, day] = selectedDateEnd.split("-");

        // Format the date as DD/MM/YYYY
        formattedDate = `${day}/${month}/${year}`;
      } else {
        // Assume the date is already in DD/MM/YYYY format and split it
        const [day, month, year] = selectedDateEnd.split("/");

        // Add 543 to the year for the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      }

      console.log("selectedDateExceptjob", selectedDateEnd);
      setFormattedDateEnd(formattedDate);
    }
  }, [selectedDateEnd]);
  useEffect(() => {
    if (selectedDateEnd) {
      let formattedDate = "";

      // Check if the date is in the YYYY-MM-DD format
      if (selectedDateEnd.includes("-")) {
        // Split the date string into year, month, day
        const [year, month, day] = selectedDateEnd.split("-");

        // Convert the year to the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date as DD/MM/YYYY with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      } else {
        // Assume the date is already in DD/MM/YYYY format and split it
        const [day, month, year] = selectedDateEnd.split("/");

        // Add 543 to the year for the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      }
      setFormattedDateEnd(formattedDate);
    }
  }, [selectedDateEnd]);

  const toggleDatePickerEnd = () => {
    setShowDatePickerEnd(!showDatePickerEnd);
  };

  const handleDatePickerExceptjobChange = (date) => {
    setSelectedDateExceptjob(date);
    setShowDatePickerExceptjob(false); // Hide date picker after selecting a date
    const newDate = new Date(date);

    const [year, month, day] = date.split("-");

    // Format the date as DD/MM/YYYY
    const formattedDate = `${day}/${month}/${year}`;

    setExceptjob(formattedDate);
  };

  // useEffect(() => {
  //   if (selectedDateExceptjob) {
  //     // Split the date string into day, month, and year
  //     const [day, month, year] = selectedDateExceptjob.split("/");

  //     // Add 543 to the year
  //     const buddhistYear = (parseInt(year) + 543).toString();

  //     // Format the date with +543 appended
  //     const formattedDate = `${day}/${month}/${buddhistYear}`;

  //     console.log("selectedDateExceptjob", selectedDateExceptjob);
  //     setFormattedDateExceptjob(formattedDate);
  //   }
  // }, [selectedDateExceptjob]);
  useEffect(() => {
    if (selectedDateExceptjob) {
      let formattedDate = "";

      // Check if the date is in the YYYY-MM-DD format
      if (selectedDateExceptjob.includes("-")) {
        // Split the date string into year, month, day
        const [year, month, day] = selectedDateExceptjob.split("-");

        // Format the date as DD/MM/YYYY
        formattedDate = `${day}/${month}/${year}`;
      } else {
        // Assume the date is already in DD/MM/YYYY format and split it
        const [day, month, year] = selectedDateExceptjob.split("/");

        // Add 543 to the year for the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      }

      console.log("selectedDateExceptjob", selectedDateExceptjob);
      setFormattedDateExceptjob(formattedDate);
    }
  }, [selectedDateExceptjob]);

  const toggleDatePickerExceptjob = () => {
    try {
      // Toggle the state of the date picker
      setShowDatePickerExceptjob(!showDatePickerExceptjob);

      // Optionally add more logic here if needed
      console.log("Date picker toggled:", showDatePickerExceptjob);
    } catch (error) {
      // Catch and log any errors
      console.error("An error occurred while toggling the date picker:", error);
    }
  };

  // console.log('startjob',startjob);
  // console.log('endjob',endjob);

  // const handleExceptDateChange = (date) => {
  //   setExceptjob(date);
  // };
  // const handleDateOfBirth = (date) => {
  //   setDateOfBirth(date);
  // };

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

  console.log(vaccination);
  const allWorkplaceGroups = workplaceSelection.flatMap(
    (wp) => wp.workplaceGroup
  );

  console.log("allWorkplaceGroups", allWorkplaceGroups);

  useEffect(() => {
    const selectedWorkplace = workplaceSelection.find(
      (wp) => wp.workplaceId === workplace
    );
    if (selectedWorkplace) {
      setFilteredWorkplaceGroups(selectedWorkplace.workplaceGroup);
    } else {
      setFilteredWorkplaceGroups([]);
    }
  }, [workplace, workplaceSelection]);

  console.log("province", province);
  console.log("district", district);
  console.log("subDistrict", subDistrict);

  return (
    <div class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <span>หน้าหลัก</span>
            </li>
            <li class="breadcrumb-item">
              <span> ระบบจัดการพนักงาน</span>
            </li>
            <li class="breadcrumb-item active">ข้อมูลส่วนบุคคลพนักงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ข้อมูลส่วนบุคคลพนักงาน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-9">
                  <form onSubmit={handleManageEmployee}>
                    <h2 class="title">ข้อมูลพนักงาน</h2>
                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div class="col-md-12">
                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="employeeId">รหัสพนักงาน <span style={{color: 'red'}}>*</span></label>
                                  <input
                                    required
                                    type="number"
                                    class="form-control"
                                    id="employeeId"
                                    placeholder="รหัสพนักงาน"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    style={{ appearance: "textfield" }}
                                  />
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="position">ตำแหน่ง <span style={{color: 'red'}}>*</span></label>
                                  {/* <input
                                required
                                type="text"
                                class="form-control"
                                id="position"
                                placeholder="ตำแหน่ง"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                              /> */}
                                  <select
                                    required
                                    className="form-control"
                                    id="position"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                  >
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
                              </div>
                              <div class="col-md-3">
                                <div class="form-group">
                                  {/* <label role="department">แผนก</label>
                                                            <input type="text" class="form-control" id="department" placeholder="แผนก" value={department} onChange={(e) => setDepartment(e.target.value)} /> */}
                                  <label role="workplace">หน่วยงาน</label>
                                  <input
                                    type="text"
                                    id="workplace"
                                    name="workplace"
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
                              <div class="col-md-3">
                                <div class="form-group">
                                  {/* <label role="workplace">หน่วยงาน</label>
                                                            <input
                                                                type="text"
                                                                id="workplace"
                                                                name="workplace"
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
                                                            </datalist> */}
                                  <label role="department">แผนก</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="department"
                                    placeholder="แผนก"
                                    value={department}
                                    list="workplaceGroups"
                                    // onChange={(e) => setDepartment(e.target.value)}
                                    onChange={handleWorkplaceGroup}
                                    autocomplete="off"
                                  />
                                  {/* <datalist id="workplaceGroup">
                                <option value="">ยังไม่ระบุหน่วยงาน</option>
                                {workplaceSelection.workplaceGroup.map((wp) => (
                                  <option key={wp._id} value={wp.workplaceComplexId}>
                                    {wp.workplaceComplexName}
                                  </option>
                                ))}
                              </datalist> */}
                                  <datalist id="workplaceGroups">
                                    <option value="">ยังไม่ระบุหน่วยงาน</option>
                                    {/* {allWorkplaceGroups.map((group) => (
                                  <option
                                    key={group._id}
                                    value={group.workplaceComplexId}
                                  >
                                    {group.workplaceComplexName}
                                  </option>
                                ))} */}
                                    {filteredWorkplaceGroups.map((group) => (
                                      <option
                                        key={group._id}
                                        value={group.workplaceComplexId}
                                      >
                                        {group.workplaceComplexName}
                                      </option>
                                    ))}
                                  </datalist>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="jobtype">ประเภทการจ้าง</label>
                                  <select
                                    id="jobtype"
                                    name="jobtype"
                                    class="form-control"
                                    value={jobtype}
                                    onChange={handleJobtype}
                                  >
                                    {/* <option value="ประจำ">ประจำ</option>
                                <option value="ไม่ประจำ">ไม่ประจำ</option>
                                <option value="รายวัน">รายวัน</option>
                                <option value="รายครั้ง">รายครั้ง</option> */}
                                    <option value="">ไม่ระบุ</option>

                                    <option value="รายวัน">รายวัน</option>
                                    <option value="รายเดือน">รายเดือน</option>
                                    <option value="รายครั้ง">รายครั้ง</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="startjob">วันที่เริ่มงาน</label>
                                  <div
                                    style={{ position: "relative", zIndex: 9999 }}
                                  >
                                    {/* <DatePicker
                                  id="startjob"
                                  name="startjob"
                                  className="form-control"
                                  popperClassName="datepicker-popper"
                                  selected={startjob}
                                  onChange={handleStartDateChange}
                                  dateFormat="dd/MM/yyyy"
                                /> */}
                                    <div
                                      onClick={toggleDatePickerStart}
                                      style={{
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <FaCalendarAlt size={20} />
                                      <span style={{ marginLeft: "8px" }}>
                                        {formattedDate321
                                          ? formattedDate321
                                          : "Select Date"}
                                      </span>
                                    </div>

                                    {showDatePickerStart && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          zIndex: 1000,
                                        }}
                                      >
                                        <ThaiDatePicker
                                          className="form-control"
                                          value={selectedDateStart}
                                          onChange={handleDatePickerStartChange}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="endjob">วันที่ลาออก/หมดสัญญา</label>
                                  <div
                                    style={{ position: "relative", zIndex: 9999 }}
                                  >
                                    {/* <DatePicker
                                  id="endjob"
                                  name="endjob"
                                  className="form-control"
                                  popperClassName="datepicker-popper"
                                  selected={endjob}
                                  onChange={handleEndDateChange}
                                  dateFormat="dd/MM/yyyy"
                                /> */}
                                    <div
                                      onClick={toggleDatePickerEnd}
                                      style={{
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <FaCalendarAlt size={20} />
                                      <span style={{ marginLeft: "8px" }}>
                                        {formattedDate321End
                                          ? formattedDate321End
                                          : "Select Date"}
                                      </span>
                                    </div>

                                    {showDatePickerEnd && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          zIndex: 1000,
                                        }}
                                      >
                                        <ThaiDatePicker
                                          className="form-control"
                                          value={selectedDateEnd}
                                          onChange={handleDatePickerEndChange}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="exceptjob">วันที่บรรจุ</label>
                                  {/* <div
                                style={{ position: "relative", zIndex: 9999 }}
                              >
                                <DatePicker
                                  id="exceptjob"
                                  name="exceptjob"
                                  className="form-control"
                                  popperClassName="datepicker-popper"
                                  selected={exceptjob}
                                  onChange={handleExceptDateChange}
                                  dateFormat="dd/MM/yyyy"
                                />
                              </div> */}
                                  <div
                                    style={{ position: "relative", zIndex: 9999 }}
                                  >
                                    {/* <DatePicker
                                  id="startjob"
                                  name="startjob"
                                  className="form-control"
                                  popperClassName="datepicker-popper"
                                  selected={startjob}
                                  onChange={handleStartDateChange}
                                  dateFormat="dd/MM/yyyy"
                                /> */}
                                    <div
                                      onClick={toggleDatePickerExceptjob}
                                      style={{
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <FaCalendarAlt size={20} />
                                      <span style={{ marginLeft: "8px" }}>
                                        {formattedDate321Exceptjob
                                          ? formattedDate321Exceptjob
                                          : "Select Date"}
                                      </span>
                                    </div>

                                    {showDatePickerExceptjob && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          zIndex: 1000,
                                        }}
                                      >
                                        <ThaiDatePicker
                                          className="form-control"
                                          value={selectedDateExceptjob}
                                          onChange={handleDatePickerExceptjobChange}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>อัพโหลดลายนิ้วมือ</label>
                                  <div class="custom-file">
                                    <input
                                      type="file"
                                      class="custom-file-input"
                                      id="customFile"
                                    />
                                    <label
                                      class="custom-file-label"
                                      for="customFile"
                                    >
                                      เลือกไฟล์
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                  <label>อัพโหลดใบหน้า</label>
                                  <div class="custom-file">
                                    {/* <input type="file" onChange={handleFileChange} /> */}
                                    <input
                                      type="file"
                                      class="custom-file-input "
                                      id="customFile"
                                      multiple
                                      accept="image/*"
                                      onChange={onImageChange}
                                    />
                                    <label
                                      class="custom-file-label"
                                      for="customFile"
                                    >
                                      เลือกไฟล์
                                    </label>
                                  </div>
                                </div>
                                {imageURLs.map((imageSrc, idx) => (
                                  <img
                                    key={idx}
                                    width="150rem"
                                    height="250rem"
                                    src={imageSrc}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                      {/* <div class="col-md-3">
                        <section class="Frame">
                          <EmployeesSelected onEmployeeSelect={onEmployeeSelect} />
                        </section>
                      </div> */}
                    </div>
                    <h2 class="title">ข้อมูลส่วนบุคคลพนักงาน</h2>
                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div class="col-md-12">
                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="prefix">คำนำหน้า <span style={{color: 'red'}}>*</span></label>
                                  <select
                                    required
                                    id="prefix"
                                    name="prefix"
                                    class="form-control"
                                    value={prefix}
                                    onChange={handlePrefix}
                                  >
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="name">ชื่อ <span style={{color: 'red'}}>*</span></label>
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
                                  <label role="lastName">นามสกุล <span style={{color: 'red'}}>*</span></label>
                                  <input
                                    required
                                    type="text"
                                    name="lastName"
                                    class="form-control"
                                    id="lastName"
                                    placeholder="นามสกุล"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="nickName">ชื่อเล่น</label>
                                  <input
                                    // required
                                    type="text"
                                    name="nickName"
                                    class="form-control"
                                    id="nickName"
                                    placeholder="ชื่อเล่น"
                                    value={nickName}
                                    onChange={(e) => setNickName(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-3">
                                <label role="dateOfBirth">เพศ <span style={{color: 'red'}}>*</span></label>
                              </div>

                              <div class="col-md-3">
                                <label role="dateOfBirth">วันเดือนปีเกิด <span style={{color: 'red'}}>*</span></label>
                              </div>
                              <div class="col-md-3">
                                <label role="dateOfBirth">อายุ</label>
                              </div>
                              <div class="col-md-3">
                                <label role="dateOfBirth">
                                  เลขบัตรประจำตัวประชาชน <span style={{color: 'red'}}>*</span>
                                </label>
                              </div>
                              {/* <div class="col-md-3">
                            {" "}
                            <label role="age">อายุ</label> 
                          </div>*/}
                            </div>
                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  {/* <label role="gender">เพศ</label> */}
                                  {/* <input type="text" name="gender" class="form-control" id="gender" placeholder="เพศ" value={gender} onChange={(e) => setGender(e.target.value)} /> */}
                                  <select
                                    required
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
                                  {/* <input
                                required
                                type="text"
                                className="form-control"
                                // value={formattedDate}
                                value={dateOfBirth}
                                placeholder="dd/mm/yyyy"
                                readOnly
                              /> */}
                                  <input
                                    required
                                    type="text"
                                    className="form-control"
                                    // value={formattedDate}
                                    value={dateOfBirth}
                                    placeholder="dd/mm/yyyy"
                                    readOnly
                                    onClick={() => setShowPopup(true)}
                                  />
                                  {showPopup && (
                                    <div className="date-popup" style={popupStyle}>
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
                                      <button
                                        onClick={() => setShowPopup(false)}
                                        className="btn btn-secondary mt-2 ml-2"
                                      >
                                        ปิด
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="dateOfBirth">วันเดือนปีเกิด</label>
                                                            <DatePicker id="dateOfBirth" name="dateOfBirth"
                                                                selected={dateOfBirth}
                                                                onChange={handleDateOfBirth}
                                                                dateFormat="dd/MM/yyyy" />
                                                        </div>
                                                    </div> */}

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

                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="ethnicity">เชื้อชาติ <span style={{color: 'red'}}>*</span></label>
                                  {/* <input
                                type="text"
                                name="ethnicity"
                                class="form-control"
                                id="ethnicity"
                                placeholder="เชื้อชาติ"
                                value={ethnicity}
                                onChange={(e) => setEthnicity(e.target.value)}
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
                                  <label role="religion">ศาสนา</label>
                                  {/* <input
                                type="text"
                                name="religion"
                                class="form-control"
                                id="religion"
                                placeholder="ศาสนา"
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                              /> */}
                                  <select
                                    // required
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
                                  <label role="maritalStatus">สถานภาพการสมรส <span style={{color: 'red'}}>*</span></label>
                                  {/* <input
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
                                    สถานภาพทางการทหาร <span style={{color: 'red'}}>*</span>
                                  </label>
                                  <select
                                    required
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
                                    ที่อยู่ตามบัตรประชาชน
                                  </label>
                                  <textarea
                                    // required
                                    name="address"
                                    id="address"
                                    class="form-control"
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                  ></textarea>
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
                          </div>*/}
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
                                    onChange={(e) => setProvince(e.target.value)}
                                    class="form-control"
                                  >
                                    {/* <option value="">Select Province</option>
                                {Object.keys(locationData).map((prov) => (
                                  <option key={prov} value={prov}>
                                    {prov}
                                  </option>
                                ))} */}
                                    {/* <option value="">Select Province</option>
                                {provincesData.map((prov) => (
                                  <option key={prov.id} value={prov.id}>
                                    {prov.name_th}
                                  </option>
                                ))} */}
                                    <option value="">Select Province</option>
                                    {provincesData
                                      .sort((a, b) =>
                                        a.name_th.localeCompare(b.name_th)
                                      ) // Sort by name_th
                                      .map((prov) => (
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
                                    onChange={(e) => setDistrict(e.target.value)}
                                    disabled={!province}
                                    class="form-control"
                                  >
                                    {/* <option value="">Select District</option>
                                {districtOptions.map((dist) => (
                                  <option key={dist} value={dist}>
                                    {dist}
                                  </option>
                                ))} */}
                                    {/* <option value="">Select District</option>
                                {districtOptions.map((dist) => (
                                  <option key={dist.id} value={dist.id}>
                                    {dist.name_th}
                                  </option>
                                ))} */}
                                    <option value="">Select District</option>
                                    {districtOptions
                                      .sort((a, b) =>
                                        a.name_th.localeCompare(b.name_th)
                                      ) // Sort by name_th
                                      .map((dist) => (
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
                                    onChange={(e) => setSubDistrict(e.target.value)}
                                    disabled={!district}
                                    class="form-control"
                                  >
                                    {/* <option value="">Select Sub-District</option>
                                {subDistrictOptions.map((subDist) => (
                                  <option key={subDist} value={subDist}>
                                    {subDist}
                                  </option>
                                ))} */}
                                    {/* <option value="">Select Sub-District</option>
                                {subDistrictOptions.map((subDist) => (
                                  <option key={subDist.id} value={subDist.id}>
                                    {subDist.name_th}
                                  </option>
                                ))} */}
                                    <option value="">Select Sub-District</option>
                                    {subDistrictOptions
                                      .sort((a, b) =>
                                        a.name_th.localeCompare(b.name_th)
                                      ) // Sort by name_th
                                      .map((subDist) => (
                                        <option key={subDist.id} value={subDist.id}>
                                          {subDist.name_th}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div>
                                  <label htmlFor="subDistrict">เลขไปรษณีย์ </label>
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
                            {/* <div class="row">
                          <div class="col-md-3">
                            <div>
                              <label htmlFor="subDistrict">
                                บ้านเลขที่-หมู่ที่{" "}
                              </label>
                              <div class="form-group">
                                <input
                                  // required
                                  type="text"
                                  name="postalCode"
                                  class="form-control"
                                  id="postalCode"
                                  placeholder="เลขไปรษณีย์"
                                  value={houseNumber}
                                  onChange={(e) =>
                                    setHouseNumber(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div> */}
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
                                    ที่อยู่ตามบัตรประชาชน
                                  </label>
                                  <textarea
                                    // required
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
                                    onChange={(e) => setProvince2(e.target.value)}
                                    class="form-control"
                                  >
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
                                    onChange={(e) => setDistrict2(e.target.value)}
                                    disabled={!province2}
                                    class="form-control"
                                  >
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
                                    <option value="">Select Sub-District</option>
                                    {subDistrictOptions2.map((subDist) => (
                                      <option key={subDist.id} value={subDist.id}>
                                        {subDist.name_th}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div>
                                  <label htmlFor="subDistrict">เลขไปรษณีย์ </label>
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
                            {/* <div class="row">
                          <div class="col-md-3">
                            <div>
                              <label htmlFor="subDistrict">
                                บ้านเลขที่-หมู่
                              </label>
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
                          </div>
                        </div>
                        <br /> */}

                            {/* <!--row--> */}
                            <div class="row">
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="phoneNumber">เบอร์โทรศัพท์</label>
                                  <input
                                    type="text"
                                    name="phoneNumber"
                                    class="form-control"
                                    id="phoneNumber"
                                    placeholder="เบอร์โทรศัพท์"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div class="col-md-3">
                                <div class="form-group">
                                  <label role="emergencyContactNumber">
                                    เบอร์ติดต่อกรณีฉุกเฉิน
                                  </label>
                                  <input
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
                            </div>
                          </div>
                          {/* <!--col-md-12--> */}
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                    </div>
                    <h2 class="title">ข้อมูลสุขภาพ</h2>
                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div>
                            <label role="vaccination">การรับวัคซีน:</label>
                            <input
                              class="form-control"
                              type="text"
                              name="vaccination"
                              id="vaccination"
                              value={newVaccination}
                              onChange={handleVaccination}
                              placeholder="เพิ่มวัคซีนที่ได้รับ"
                            />
                            <br />
                            <button
                              type="button"
                              class="btn btn-primary"
                              onClick={handleAddVaccination}
                            >
                              เพิ่มวัคซีน
                            </button>
                            <br />
                            <br />
                            {/* <h2 class="title">วัคซีนที่ได้รับ</h2> */}
                            <label style={{ paddingLeft: "10px" }}>
                              วัคซีนที่ได้รับ
                            </label>

                            <ul>
                              {vaccination.map((item, index) => (
                                <li key={index}>
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVaccination(item)}
                                    class="btn btn-info"
                                    style={{ margin: "0.5rem", width: "4rem" }}
                                  >
                                    ลบ
                                  </button>
                                </li>
                                // <li key={index}>{item}<button class="btn btn-info" style={{ margin: '0.5rem', width: "4rem" }}>ลบ</button></li>
                                // <li key={index}>{item}<button class="btn btn-info" style={{ margin: '0.5rem', width: "4rem" }}>ลบ</button></li>
                              ))}
                            </ul>
                          </div>

                          {/* <div class="row">
                                                <div class="form-group">
                                                    <label style={{ paddingLeft: "10px" }}>การรับวัคซีน</label>
                                                    <div class="col-md-12" style={{ marginTop: "10px" }}>
                                                        <div class="icheck-primary d-inline">
                                                            <input type="radio" id="radioPrimary1" name="r1" /> ได้รับวัคซีนแล้ว
                                                        </div>
                                                        <div class="icheck-primary d-inline">
                                                            <input type="radio" id="radioPrimary2" name="r1" />  ยังไม่ได้รับวัคซีน
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group">
                                <label>สิทธิการรักษาพยาบาล</label>
                                <input
                                  type="text"
                                  name="treatmentRights"
                                  class="form-control"
                                  id="treatmentRights"
                                  placeholder="สิทธิการรักษาพยาบาล"
                                  value={treatmentRights}
                                  onChange={(e) =>
                                    setTreatmentRights(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                    </div>
                    <div class="line_btn">
                      {newEmp ? (
                        <button
                          type="submit"
                          name="save"
                          value="create"
                          onClick={() => setButtonValue("create")}
                          class="btn b_save"
                        >
                          <i class="nav-icon fas fa-save"></i>{" "}
                          &nbsp;สร้างพนักงานใหม่
                        </button>
                      ) : (
                        <button
                          type="submit"
                          name="save"
                          value="save"
                          onClick={() => setButtonValue("save")}
                          class="btn b_save"
                        >
                          <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                        </button>
                      )}
                      <button class="btn clean"
                        onClick={() => window.location.reload()}
                      >
                        <i class="far fa-window-close"></i> &nbsp;ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
                <div class="col-md-3">
                  <section class="Frame">
                    <EmployeesSelected onEmployeeSelect={onEmployeeSelect} />
                  </section>
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>

          {/* <!-- /.content --> */}
        </div>
      </div>
    </div>
  );
}

export default Employee;
