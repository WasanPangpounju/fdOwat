import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subYears, format, parse, addYears } from "date-fns";
import EmployeesSelected from "./EmployeesSelected";
import "../editwindowcss.css";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

function Salary() {
  useEffect(() => {
    document.title = "ข้อมูลเงินเดือน";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);

  const popupStyle = {
    position: "absolute",
    background: "white",
    border: "1px solid #ccc",
    // padding: "10px",
    // zIndex: 1000,
    width: "30rem",
    zIndex: 9999,      // Ensure it's in front of other elements
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",  // Optional: for a raised effect
  };

  const [showPopup, setShowPopup] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const popupRef = useRef(null);
  const [dateOfBirth, setDateOfBirth] = useState(""); //วดป เกิด
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [startjob, setStartjob] = useState(""); //วันที่เริ่มงาน
  const [exceptjob, setExceptjob] = useState(""); //วันที่บรรจุ

  const handleDateChange = () => {
    if (day && month && year) {
      const date = `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      setFormattedDate(date);
      setShowPopup(false);
      setDateOfBirth(date);
      setStartjob(date);
    }
  };

  //   const calculateExceptjob = (startjob) => {
  //     const parsedDate = parse(startjob, 'dd/MM/yyyy', new Date());
  //     const newDate = subYears(addDays(parsedDate, 119), 543);
  //     return format(newDate, 'dd/MM/yyyy');
  //   };

  const calculateExceptjob = (startjob) => {
    // Convert Buddhist year to Gregorian year
    const [d, m, y] = startjob.split("/").map(Number);
    const gregorianYear = y;
    const gregorianDateStr = `${d.toString().padStart(2, "0")}/${m
      .toString()
      .padStart(2, "0")}/${gregorianYear}`;

    // Parse the Gregorian date string
    const parsedDate = parse(gregorianDateStr, "dd/MM/yyyy", new Date());

    // Add 119 days and subtract 543 years
    const newDate = subYears(addDays(parsedDate, 119), 543);

    // Convert back to Buddhist year and format the date
    const buddhistDate = addYears(newDate, 543);
    return format(buddhistDate, "dd/MM/yyyy");
    // return buddhistDate;
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (day && month && year) {
      const dob = `${day}/${month}/${year}`;
      setDateOfBirth(dob);
      setStartjob(dob);
      console.log("dob", dob);

      const exceptDate = calculateExceptjob(dob);
      setExceptjob(exceptDate);
    }
  }, [day, month, year]);

  const [showAddSalaryButton, setShowAddSalaryButton] = useState(true);

  const [storedEmp, setStoredEmp] = useState([]);
  const [newEmp, setNewEmp] = useState(true);
  // const [employeeselection , setEmployeeselection] = useState([]);
  const [workplaceSelection, setWorkplaceSelection] = useState([]);
  const [employeeData, setEmployeeData] = useState({});

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
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const [workplaceSelectionSalary, setWorkplaceSelectionSalary] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data2) => {
        setWorkplaceSelectionSalary(data2);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = async (e, field) => {
    // if ((field == 'salaryadd1') || (field == 'salaryadd2') || (field == 'salaryadd3') || (field == 'salaryadd4') || (field == 'salaryadd5')) {
    //     const { checked } = await e.target;
    //     if (!checked) {
    //         checked = '';
    //     } else {
    //         checked = on;
    //     }
    //     alert(checked);

    //     await setEmployeeData(prevData => ({
    //         ...prevData,
    //         [field]: checked,
    //     }));
    // } else {
    setEmployeeData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));

    // }
  };

  //employee data
  const [workplaceId, setWorkplaceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState(""); //ตำแหน่ง
  const [department, setDepartment] = useState(""); //แผนก

  const [workplace, setWorkplace] = useState(""); //หน่วยงาน
  const [workplacearea, setWorkplacearea] = useState("");
  const [costtype, setCosttype] = useState(""); //ลงบัญชีเป็นค่าใช้จ่าย
  const [worktable, setWorktable] = useState(""); //ตารางงาน
  const [workexcept, setWorkexcept] = useState(""); //ผู้อนุมัต
  const [worktimerecord, setWorktimerecord] = useState(""); //ผู้บันทึกเวลา
  const [workrecord, setWorkrecord] = useState(""); //ผู้บันทึกข้อมูลแทน

  const [jobtype, setJobtype] = useState(""); //ประเภทการจ้าง
  //   const [startjob, setStartjob] = useState(""); //วันที่เริ่มงาน
  //   const [exceptjob, setExceptjob] = useState(""); //วันที่บรรจุ

  //Salary Data
  const [startcount, setStartcount] = useState(""); //วันเริ่มคำนวน
  const [salary, setSalary] = useState(""); //อัตราเงินเดือน
  const [salarytype, setSalarytype] = useState(""); //อัตราเงินเดือน
  const [money, setMoney] = useState(""); //หน่วยของเงิน
  const [salaryupdate, setSalaryupdate] = useState(""); //เงินเดือนปรับเมื่อ
  const [salaryout, setSalaryout] = useState(""); //เงินเดือนปรับเมื่อ
  const [salarypayment, setSalarypayment] = useState(""); //วิธีจ่ายเงิน
  const [salarybank, setSalarybank] = useState(""); //ธนาคาร 
  const [banknumber, setBanknumber] = useState(""); //เลขบัญชี

  const [salaryadd1, setSalaryadd1] = useState(false); //เงินเพิ่มพิเศษ ค่ารถ
  const [salaryadd2, setSalaryadd2] = useState(false); //เงินเพิ่มพิเศษ ค่าอาหาร
  const [salaryadd3, setSalaryadd3] = useState(false); //เงินเพิ่มพิเศษ เบี้ยขยัน
  const [salaryadd4, setSalaryadd4] = useState(false); //เงินเพิ่มพิเศษ โทรศัพท์
  // const initialSalaryAdd4 = salaryadd4 === "true";
  // const [salaryadd4, setSalaryadd4] = useState(initialSalaryAdd4);

  const [salaryadd5, setSalaryadd5] = useState(false); //เงินเพิ่มพิเศษ เงินประจำตำแหน่ง

  const [salaryaddtype, setSalaryaddtype] = useState(""); //เพิ่มพิเศษแบบ ต่อวัน ต่อเดือน
  const [salaryaddsum, setSalaryaddsum] = useState(""); //เพิ่มพิเศษแบบ ต่อวัน ต่อเดือน

  const [salaryadd1v, setSalaryadd1v] = useState(""); //จำนวนเงินเพิ่มพิเศษ ค่ารถ
  const [salaryadd2v, setSalaryadd2v] = useState(""); //จำนวนเงินเพิ่มพิเศษ ค่าอาหาร
  const [salaryadd3v, setSalaryadd3v] = useState(""); //จำนวนเงินเพิ่มพิเศษ เบี้ยขยัน
  const [salaryadd4v, setSalaryadd4v] = useState(""); //จำนวนเงินเพิ่มพิเศษ โทรศัพท์
  const [salaryadd5v, setSalaryadd5v] = useState(""); //จำนวนเงินเพิ่มพิเศษ เงินประจำตำแหน่ง
  //////
  const [remainbusinessleave, setRemainbusinessleave] = useState(""); //ลาคงเหลือ วันลากิจคงเหลือ
  const [businessleavesalary, setBusinessleavesalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน

  const [remainsickleave, setRemainsickleave] = useState(""); //ลาคงเหลือ วันลาป่วยคงเหลือ
  const [sickleavesalary, setSickleavesalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน

  const [remainvacation, setRemainvacation] = useState(""); //ลาคงเหลือ วันลาพักร้อนคงเหลือ
  const [vacationsalary, setVacationsalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน

  const [maternityleave, setMaternityLeave] = useState(""); //ลาคงเหลือ วันลาคลอดคงเหลือ
  const [maternityleavesalary, setMaternityleavesalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน
  const [militaryleave, setMilitaryleave] = useState(""); //ลาคงเหลือ วันลาเพื่อเกณฑ์ทหารคงเหลือ
  const [militaryleavesalary, setMilitaryleavesalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน
  const [sterilization, setSterilization] = useState(""); //ลาคงเหลือ วันลาเพื่อทำหมันคงเหลือ
  const [sterilizationsalary, setSterilizationsalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน
  const [leavefortraining, setLeavefortraining] = useState(""); //ลาคงเหลือ วันลาเพื่อฝึกอบรมคงเหลือ
  const [leavefortrainingsalary, setLeavefortrainingsalary] = useState(""); //ลาคงเหลือ จำนวนเงินต่อวัน

  const [prefix, setPrefix] = useState(""); //นำหน้าชื่อ
  const [name, setName] = useState(""); //ชื่อ
  const [lastName, setLastName] = useState(""); //นามสกุล
  const [nickName, setNickName] = useState(""); //ชื่อเล่น
  const [gender, setGender] = useState(""); //เพศ
  const [idCard, setIdCard] = useState(""); //บัตรประชาชน
  const [copyAddress, setCopyAddress] = useState(false);

  const [formData, setFormData] = useState([]);
  const [showAdditionalInput, setShowAdditionalInput] = useState([]);

  // const handleChangeSpSalary = (e, index, key) => {
  //   const newAddSalary = [...formData.addSalary];
  //   newAddSalary[index] = {
  //     ...newAddSalary[index],
  //     [key]: e.target.value,
  //   };

  //   setFormData({
  //     ...formData,
  //     addSalary: newAddSalary,
  //   });
  // };

  const handleChangeSpSalary = (e, index, key) => {
    const newAddSalary = [...formData.addSalary];
    const newValue = e.target.value;

    // Check for duplicates in codeSpSalary
    const isDuplicate = newAddSalary.some(
      (item, idx) => item.codeSpSalary === newValue && idx !== index
    );

    if (isDuplicate) {
      alert("Duplicate codeSpSalary value detected!");
      return; // Exit the function without updating the array
    }

    newAddSalary[index] = {
      ...newAddSalary[index],
      [key]: newValue,
    };

    setFormData({
      ...formData,
      addSalary: newAddSalary,
    });

  };


  const handleAddInput = () => {
    // alert(formData.length);

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

  //add salary
  const [addSalary, setAddSalary] = useState([]);
  const [addSalaryWorkplace, setAddSalaryWorkplace] = useState([]);
  const [addSalaryWorkplace1, setAddSalaryWorkplace1] = useState([]);

  // const handleAddToSalary = async (data) => {
  //   data.id = (await data.codeSpSalary) || "";
  //   await setAddSalary((prev) => [...prev, data]);
  //   // setAddSalaryWorkplace(prev => prev.filter(item => item.id !== data.id));
  // };

  const handleAddToSalary = async (data) => {
    // Check if `codeSpSalary` already exists in the array
    const isDuplicate = addSalary.some(
      (item) => item.codeSpSalary === data.codeSpSalary
    );

    if (isDuplicate) {
      alert("ให้สวัสดิการแล้ว");
      return; // Exit the function without adding to the array
    }

    // Add the new item to the array
    const newData = { ...data, id: data.codeSpSalary || "" };
    setAddSalary((prev) => [...prev, newData]);
  };


  const handleRemoveFromSalary = (item) => {
    setAddSalary((prev) => prev.filter((i) => i !== item));
  };

  const handleAddSalary = async (data) => {
    // alert(JSON.stringify(data, null, 2) );
    const isUnique = await !addSalary.some(
      (item) => JSON.stringify(item) === JSON.stringify(data)
    );

    if (isUnique || employeeData.addSalary.length <= 0) {
      await setAddSalary((prevState) => [...prevState, data]);
      // await alert(JSON.stringify(addSalary , null ,2));
      //             await setEmployeeData(prevData => ({
      //                 ...prevData,
      //                 ['addSalary']: addSalary
      //             }));

      // If data is unique, create a new array by adding the new salary data
      const updatedSalaries = [...employeeData.addSalary, data];

      // Update the state with the new array
      setEmployeeData((prevData) => ({
        ...prevData,
        addSalary: updatedSalaries,
      }));
    } else {
      console.log("Data is not unique.");
    }
  };

  // Function to remove data from the addSalary list
  const handleRemoveAddSalary = (dataIndex) => {
    const updatedSalaries = employeeData.addSalary.filter(
      (data) => data.name !== dataIndex
    );
    // Update the state with the new array
    setEmployeeData((prevData) => ({
      ...prevData,
      addSalary: updatedSalaries,
    }));
  };

  // const handleRemoveAddSalary = async dataIndex => {
  //     // alert(dataIndex);

  //     const updatedSalaries = [...employeeData.addSalary];
  //     const updatedSalariesFiltered = updatedSalaries.map((data) => {
  //       if (data.name !== dataIndex) {
  //         return data;
  //       } else {
  //         return null; // Exclude the item from the array
  //       }
  //     }).filter((data) => data !== null); // Filter out null values to remove excluded items

  //     // alert(JSON.stringify(updatedSalariesFiltered, null, 2));

  //     // Update the state with the new array
  //     setEmployeeData((prevData) => ({
  //         ...prevData,
  //         addSalary: updatedSalariesFiltered,
  //     }));

  // };

  const handleWorkplace = async (event) => {
    await setWorkplace(event.target.value);
    await setEmployeeData((prevData) => ({
      ...prevData,
      ["workplace"]: event.target.value,
    }));
    // alert(event.target.value);

    const filtered = workplaceSelection.filter(
      (wp) =>
        event.target.value === "" ||
        wp.workplaceId === event.target.value ||
        wp.workplaceName === event.target.value
    );
    // alert(JSON.stringify(filtered , null, 2) );
    // alert(filtered[0].workplaceArea );
    if (filtered !== "") {
      if (employeeData.workplace == "") {
        setWorkplacearea("");
      } else {
        setWorkplacearea(filtered[0].workplaceArea);
        //set add Salary from workplace
        setAddSalaryWorkplace(filtered[0].addSalary);

        setEmployeeData((prevData) => ({
          ...prevData,
          ["addSalary"]: [],
        }));

        const initialFormData = {
          addSalary: filtered[0].addSalary.map((item) => ({
            id: item.codeSpSalary || "",
            name: item.name || "",
            SpSalary: item.SpSalary || "",
            roundOfSalary: item.roundOfSalary || "",
            StaffType: item.StaffType || "",
            nameType: item.nameType || "",
          })),
        };

        setFormData(initialFormData);
      }
    } else {
      setWorkplacearea("");
    }

    // setWorkplacearea(filtered[0].workplaceArea );
  };


  const handleWorktable = (event) => {
    setWorktable(event.target.value);
  };

  const handleWorkexcept = (event) => {
    setWorkexcept(event.target.value);
  };

  const handleWorktimerecord = (event) => {
    setWorktimerecord(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartjob(date);

    //add new startjob to employeeData
    setEmployeeData((prevData) => ({
      ...prevData,
      ["startjob"]: date,
    }));
  };

  const handleExceptDateChange = (date) => {
    setExceptjob(date);
    //add new exceptjob to employeeData
    setEmployeeData((prevData) => ({
      ...prevData,
      ["exceptjob"]: date,
    }));
  };
  // const handleStartcount = (date) => {
  //   setStartcount(date);
  //   //add new startcount to employeeData
  //   setEmployeeData((prevData) => ({
  //     ...prevData,
  //     ["startcount"]: date,
  //   }));
  // };
  const [showDatePickerStartcount, setShowDatePickerStartcount] =
    useState(false);
  const [selectedDateStartcount, setSelectedDateStartcount] = useState('');
  const [formattedDate321Startcount, setFormattedDateStartcount] =
    useState(null);

  const handleDatePickerStartcountChange = (date) => {
    setSelectedDateStartcount(date);
    setShowDatePickerStartcount(false); // Hide date picker after selecting a date
    // const newDate = new Date(date);
    setStartcount(date);
    setEmployeeData((prevData) => ({
      ...prevData,
      ["salarystartcountupdate"]: date,
    }));
  };
  // useEffect(() => {
  //   if (selectedDateStartcount) {
  //     // Convert the string to a Date object
  //     const date = new Date(selectedDateStartcount);

  //     // Extract day, month, and year
  //     const daySelectedDate = date.getDate().toString().padStart(2, "0");
  //     const monthSelectedDate = (date.getMonth() + 1)
  //       .toString()
  //       .padStart(2, "0");
  //     const yearSelectedDate = (date.getFullYear() + 543).toString();

  //     // Format the date
  //     const formattedDate = `${daySelectedDate}/${monthSelectedDate}/${yearSelectedDate}`;
  //     setFormattedDateStartcount(formattedDate);
  //   }
  // }, [selectedDateStartcount]);

  useEffect(() => {
    if (selectedDateStartcount) {
      let formattedDate = "";

      // Check if the date is in the YYYY-MM-DD format
      if (selectedDateStartcount.includes("-")) {
        // Split the date string into year, month, day
        const [year, month, day] = selectedDateStartcount.split("-");

        // Format the date as DD/MM/YYYY
        formattedDate = `${day}/${month}/${year}`;
      } else {
        // Assume the date is already in DD/MM/YYYY format and split it
        const [day, month, year] = selectedDateStartcount.split("/");

        // Add 543 to the year for the Buddhist calendar
        const buddhistYear = (parseInt(year) + 543).toString();

        // Format the date with the Buddhist year
        formattedDate = `${day}/${month}/${buddhistYear}`;
      }

      setFormattedDateStartcount(formattedDate);
    }
  }, [selectedDateStartcount]);

  const toggleDatePickerStartcount = () => {
    setShowDatePickerStartcount(!showDatePickerStartcount);
  };

  // const handleSalaryupdate = (date) => {
  //   setSalaryupdate(date);
  //   //add new salaryupdate to employeeData
  //   setEmployeeData((prevData) => ({
  //     ...prevData,
  //     ["salaryupdate"]: date,
  //   }));
  // };
  const [showDatePickerSalaryupdate, setShowDatePickerSalaryupdate] =
    useState(false);
  const [selectedDateSalaryupdate, setSelectedDateSalaryupdate] =
    useState(null);
  const [formattedDate321Salaryupdate, setFormattedDateSalaryupdate] =
    useState(null);

  const handleDatePickerSalaryupdateChange = (date) => {
    setSelectedDateSalaryupdate(date);
    setShowDatePickerSalaryupdate(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setSalaryupdate(newDate);
    setEmployeeData((prevData) => ({
      ...prevData,
      ["salaryupdate"]: newDate,
    }));
  };

  useEffect(() => {
    if (selectedDateSalaryupdate) {
      // Convert the string to a Date object
      const date = new Date(selectedDateSalaryupdate);

      // Extract day, month, and year
      const daySelectedDate = date.getDate().toString().padStart(2, "0");
      const monthSelectedDate = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const yearSelectedDate = (date.getFullYear() + 543).toString();

      // Format the date
      const formattedDate = `${daySelectedDate}/${monthSelectedDate}/${yearSelectedDate}`;
      setFormattedDateSalaryupdate(formattedDate);
    }
  }, [selectedDateSalaryupdate]);

  const toggleDatePickerSalaryupdate = () => {
    setShowDatePickerSalaryupdate(!showDatePickerSalaryupdate);
  };

  async function handleManageSalary(event) {
    event.preventDefault();
    // alert(employeeData._id);
    // Make the API call to update the resource by ID
    //   if(){

    // try {
    //     const response = await axios.put(endpoint + '/employee/update/' + employeeData._id, employeeData);
    //     // setEmployeesResult(response.data.employees);
    //     if (response) {
    //         alert("บันทึกสำเร็จ");
    //         // localStorage.setItem('selectedEmployees' , JSON.stringify(response.data.employees));

    //         // window.location.reload();

    //     }
    // } catch (error) {
    //     alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
    //     alert(error);
    //     // window.location.reload();
    // }
    // // }
  }

  async function updateEmployee(_id) {
    // alert('hi');
    // Make the API call to update the resource by ID
    try {
      // alert(JSON.stringify(addSalary))
      employeeData.addSalary = await addSalary;
      const response = await axios.put(
        endpoint + "/employee/update/" + employeeData._id,
        employeeData
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");
        // localStorage.setItem('selectedEmployees' , JSON.stringify(response.data.employees));
        updateEmployeeLocal(response.data);

        // window.location.reload();
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      alert(error);
      // window.location.reload();
    }
  }

  // function formatDateToDMY(dateString) {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if necessary
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (note: months are zero-indexed)
  //   const year = date.getFullYear(); // Get full year

  //   return `${day}/${month}/${year + 543}`; // Return formatted date as day/month/year
  // }
  function formatDateToDMY(dateString) {
    let day, month, year;

    // Check if dateString is in the DD/MM/YYYY format
    if (dateString.includes("/")) {
      // Split the date string into day, month, year
      [day, month, year] = dateString.split("/");

      // Add 543 to the year for the Buddhist calendar
      year = parseInt(year) + 543;
    } else {
      // If the date is in YYYY-MM-DD format, use the Date object
      const date = new Date(dateString);
      day = String(date.getDate()).padStart(2, "0");
      month = String(date.getMonth() + 1).padStart(2, "0");
      year = date.getFullYear() + 543;
    }

    // Return the formatted date as day/month/year
    return `${day}/${month}/${year}`;
  }


  async function onEmployeeSelect(empSelect) {
    await setEmployeeData(empSelect);
    await setWorkplace(empSelect.workplace || "");
    await setAddSalary(empSelect.addSalary);
    // await alert(JSON.stringify(addSalary, null , 2));
    //set workplace to show
    const filtered = await workplaceSelection.filter(
      (wp) =>
        empSelect.workplace === "" ||
        wp.workplaceId === empSelect.workplace ||
        wp.workplaceName === empSelect.workplace
    );
    if (filtered !== "") {
      if (employeeData.workplace == "") {
        setWorkplacearea("");
      } else {
        setWorkplacearea(filtered[0].workplaceArea || "");
        setAddSalaryWorkplace(filtered[0].addSalary
          // .filter(
          //   (data) =>
          //     data?.StaffType === "all" || data?.StaffType === employeeData?.position 
          // )
         );
// alert(employeeData.position );
//เงินเพิ่มของหน่วยงาน เลือกตามประเภทพนักงาน และแบบให้ทั้งหมด

        const initialFormData = await {
          addSalary: filtered[0].addSalary.map((item) => ({
            id: item.codeSpSalary || "",
            name: item.name || "",
            SpSalary: item.SpSalary || "",
            roundOfSalary: item.roundOfSalary || "",
            StaffType: item.StaffType || "",
            nameType: item.nameType || "",
          })),
        };
        // await alert(JSON.stringify(initialFormData,null,2) );
        setFormData(initialFormData);
        // setFormData(workplace.addSalary);
      }
    } else {
      setWorkplacearea("");
    }
    if (empSelect.startjob) {
      // await setStartjob(new Date(empSelect.startjob || ""));
      const formattedDate = formatDateToDMY(empSelect.startjob);
      // Now set the formatted date
      await setStartjob(formattedDate);
    }

    if (empSelect.exceptjob) {
      // await setExceptjob(new Date(empSelect.exceptjob || ""));
      const formattedDate = formatDateToDMY(empSelect.exceptjob);
      // Now set the formatted date
      await setExceptjob(formattedDate);
    }
    if (empSelect.startcount) {
      await setStartcount(
        // empSelect.startcount ? new Date(empSelect.startcount) : ""
        empSelect.startcount ? empSelect.startcount : ""

      );

      await setFormattedDateStartcount(
        empSelect.startcount ? empSelect.startcount : ""
      );

      await setSelectedDateStartcount(
        empSelect.startcount ? empSelect.startcount : ""
      );
    }


    if (empSelect.salaryupdate) {
      await setSalaryupdate(
        empSelect.salaryupdate ? empSelect.salaryupdate : ""
      );
      await setFormattedDateSalaryupdate(
        empSelect.startcount ? empSelect.startcount : ""
      );
    }

    // await setExceptjob(new Date(empSelect.exceptjob || ''));
    // await setStartcount(empSelect.startcount ? new Date(empSelect.startcount) : '');
    // await setSalaryupdate(empSelect.salaryupdate ? new Date(empSelect.salaryupdate) : '');

    // setWorkplaceId(empSelect.employeeId);

    setSalaryadd1(empSelect.salaryadd1) || false;
    setSalaryadd1v(parseFloat(empSelect.salaryadd1v) || 0);
    setSalaryadd2(empSelect.salaryadd2 || false);
    setSalaryadd2v(parseFloat(empSelect.salaryadd2v) || 0);
    setSalaryadd3(empSelect.salaryadd3 || false);
    setSalaryadd3v(parseFloat(empSelect.salaryadd3v) || 0);
    setSalaryadd4(empSelect.salaryadd4 || false);
    setSalaryadd4v(parseFloat(empSelect.salaryadd4v) || 0);
    setSalaryadd5(empSelect.salaryadd5 || false);
    setSalaryadd5v(parseFloat(empSelect.salaryadd5v) || 0);
    // setSalaryadd5v("");
  }


  // const toggleCheckbox1 = () => {
  //     setSalaryadd1(prevValue => !prevValue); // Toggle the checkbox state
  //     handleChange({ target: { type: 'checkbox', checked: !employeeData.salaryadd1 } }, 'salaryadd1');
  //     // alert('1');
  // };



  const toggleCheckbox1 = () => {
    setSalaryadd1((prevValue) => {
      const newValue = !prevValue;
      setEmployeeData((prevData) => ({
        ...prevData,
        salaryadd1: newValue,
      }));
      return newValue;
    });
  };

  const toggleCheckbox2 = () => {
    setSalaryadd2((prevValue) => {
      const newValue = !prevValue;
      setEmployeeData((prevData) => ({
        ...prevData,
        salaryadd2: newValue,
      }));
      return newValue;
    });
  };

  const toggleCheckbox3 = () => {
    setSalaryadd3((prevValue) => {
      const newValue = !prevValue;
      setEmployeeData((prevData) => ({
        ...prevData,
        salaryadd3: newValue,
      }));
      return newValue;
    });
  };

  const toggleCheckbox4 = () => {
    setSalaryadd4((prevValue) => {
      const newValue = !prevValue;
      setEmployeeData((prevData) => ({
        ...prevData,
        salaryadd4: newValue,
      }));
      return newValue;
    });
  };

  const toggleCheckbox5 = () => {
    setSalaryadd5((prevValue) => {
      const newValue = !prevValue;
      setEmployeeData((prevData) => ({
        ...prevData,
        salaryadd5: newValue,
      }));
      return newValue;
    });
  };

  useEffect(() => {
    if (salaryadd1 == "false") {
      setSalaryadd1(false);
    }
    if (salaryadd2 == "false") {
      setSalaryadd2(false);
    }
    if (salaryadd3 == "false") {
      setSalaryadd3(false);
    }
    if (salaryadd4 == "false") {
      setSalaryadd4(false);
    }
    if (salaryadd5 == "false") {
      setSalaryadd5(false);
    }
  }, [salaryadd1, salaryadd2, salaryadd3, salaryadd4, salaryadd5]);

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

  return (
    <body class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> ระบบจัดการพนักงาน</a>
            </li>
            <li class="breadcrumb-item active">ข้อมูลเงินเดือน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ข้อมูลเงินเดือน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
                    <!-- Main content --> */}
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-9">
                  <form onSubmit={handleManageSalary}>
                    <h2 class="head-title">เงินเดือนและสวัสดิการ</h2>
                    <h2 class="title">ข้อมูลพนักงาน</h2>
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
                                    value={employeeData.employeeId || ""}
                                    onChange={(e) => handleChange(e, "employeeId")}
                                    onInput={(e) => {
                                      // Remove any non-digit characters
                                      e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
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
                                    value={employeeData.position || ""}
                                    onChange={(e) => handleChange(e, "position")}
                                  />
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="department">แผนก</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="department"
                                    placeholder="แผนก"
                                    value={employeeData.department || ""}
                                    onChange={(e) => handleChange(e, "department")}
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="workplace">หน่วยงาน</label>
                                  {/* <select id="workplace" name="workplace" class="form-control"
                                                                value={workplace} onChange={handleWorkplace}>
                                                                <option value="">ยังไม่ระบุหน่วยงาน</option>
                                                                {workplaceSelection.map(wp => (
                                                                    <option key={wp._id} value={wp.workplaceId}>{wp.workplaceName}</option>

                                                                ))}
                                                            </select> */}
                                  <input
                                    type="text"
                                    list="workplacelist"
                                    id="workplace"
                                    name="workplace"
                                    className="form-control"
                                    value={workplace}
                                    onChange={handleWorkplace}
                                  />

                                  <datalist id="workplacelist">
                                    <option value="">ยังไม่ระบุหน่วยงาน</option>
                                    {workplaceSelection.map((wp) => (
                                      <option key={wp._id} value={wp.workplaceId}>
                                        {wp.workplaceName}
                                      </option>
                                    ))}
                                  </datalist>

                                  {/* <input
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
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="workplacearea">
                                    สถานที่ปฏิบัติงาน
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="workplacearea"
                                    placeholder="สถานที่ปฏิบัติงาน"
                                    value={workplacearea}
                                    readonly
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
                                    value={employeeData.jobtype || ""}
                                    onChange={(e) => handleChange(e, "jobtype")}
                                  >
                                    {/* <option value="">ไม่ระบุ</option>
                                <option value="ประจำ">ประจำ</option>
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
                              <div class="col-md-12">
                                <div class="form-group">
                                  <label role="costtype">ลงบัญชีแบบ</label>
                                  <div class="" style={{ marginTop: "10px" }}>
                                    <div class="icheck-primary d-inline">
                                      <input
                                        type="radio"
                                        id="costtype"
                                        name="costtype"
                                        value="ภ.ง.ด.1"
                                        checked={
                                          employeeData.costtype === "ภ.ง.ด.1"
                                        }
                                        onChange={(e) =>
                                          handleChange(e, "costtype")
                                        }
                                      />{" "}
                                      ภ.ง.ด.1 (ภาษีเงินได้หักณที่จ่าย)
                                    </div>
                                    <div class="icheck-primary d-inline">
                                      <input
                                        type="radio"
                                        id="costtype"
                                        name="costtype"
                                        value="ภ.ง.ด.3"
                                        checked={
                                          employeeData.costtype === "ภ.ง.ด.3"
                                        }
                                        onChange={(e) =>
                                          handleChange(e, "costtype")
                                        }
                                      />{" "}
                                      ภ.ง.ด.3 (หัก ณ ที่จ่าย 3%)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--row--> */}
                          </div>
                        </section>
                      </div>
                      {/* <div class="col-md-3">
                    <section class="Frame">
                      <EmployeesSelected onEmployeeSelect={onEmployeeSelect} />
                    </section>
                  </div> */}
                    </div>
                    {/* <!--Frame--> */}
                    <h2 class="title">การบันทึกเวลาและการลา</h2>
                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div class="col-md-12">
                            <div class="row">
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="worktable">ตารางงาน</label>
                                  <select
                                    id="worktable"
                                    name="worktable"
                                    class="form-control"
                                    value={employeeData.worktable || ""}
                                    onChange={(e) => handleChange(e, "worktable")}
                                  >
                                    <option value="">ไม่ระบุ</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="workexcept">ผู้อนุมัติ</label>
                                  <select
                                    id="workexcept"
                                    name="workexcept"
                                    class="form-control"
                                    value={employeeData.workexcept || ""}
                                    onChange={(e) => handleChange(e, "workexcept")}
                                  >
                                    <option value="">ไม่ระบุ</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-4">
                                <div class="form-group">
                                  <label role="worktimerecord">ผู้บันทึกเวลา</label>
                                  <select
                                    id="worktimerecord"
                                    name="worktimerecord"
                                    class="form-control"
                                    value={employeeData.worktimerecord || ""}
                                    onChange={(e) =>
                                      handleChange(e, "worktimerecord")
                                    }
                                  >
                                    <option value="บันทึกผ่านเว็บ">
                                      บันทึกผ่านเว็บ
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            {/* <!--row--> */}
                            {/* <div class="row"><h2 class="title">             ปฏิบัติงาน</h2></div> */}
                            {/* <div class="row"> */}

                            {/* </div> */}
                            {/* <!--row--> */}
                          </div>
                          {/* <!--col-md-12--> */}
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div class="row">
                            <div class="col-md-5">
                              <div class="row">
                                <h2 class="title">วันที่เริ่มงาน</h2>
                              </div>
                              <div class="form-group row">
                                <label role="startjob">วันที่เริ่มงาน</label>
                                <div
                                // style={{ position: 'relative', zIndex: 9999, marginLeft: "2rem" }}
                                >
                                  {/* <DatePicker id="startjob" name="startjob"
                                                                className="form-control" // Apply Bootstrap form-control class
                                                                // popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                                selected={startjob}
                                                                onChange={handleStartDateChange}
                                                                dateFormat="dd/MM/yyyy" /> */}

                                  <input
                                    required
                                    type="text"
                                    className="form-control"
                                    // value={formattedDate}
                                    // value={dateOfBirth}
                                    value={startjob}
                                    placeholder="dd/mm/yyyy"
                                    readOnly
                                    onClick={() => setShowPopup(true)}
                                  />
                                  {showPopup && (
                                    <div
                                      className="date-popup"
                                      ref={popupRef}
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
                              <div class="form-group row">
                                <label role="exceptjob">วันที่บรรจุ</label>
                                <div
                                // style={{ position: 'relative', zIndex: 9999, marginLeft: "2rem" }}
                                >
                                  {/* <DatePicker
                                id="exceptjob"
                                name="exceptjob"
                                className="form-control" // Apply Bootstrap form-control class
                                // popperClassName="datepicker-popper" // Apply custom popper class if needed
                                selected={exceptjob}
                                onChange={handleExceptDateChange}
                                dateFormat="dd/MM/yyyy"
                              /> */}

                                  <input
                                    required
                                    type="text"
                                    className="form-control"
                                    // value={formattedDate}
                                    // value={dateOfBirth}
                                    value={exceptjob}
                                    placeholder="dd/mm/yyyy"
                                    readOnly
                                  // onClick={() => setShowPopup(true)}
                                  />
                                </div>
                              </div>
                              <div class="form-group row">
                                <label role="startcount">วันที่เริ่มต้นคำนวณ</label>
                                <div
                                // style={{ position: 'relative', zIndex: 9999, marginLeft: "2rem" }}
                                >
                                  {/* <DatePicker
                                id="startcount"
                                name="startcount"
                                className="form-control" // Apply Bootstrap form-control class
                                popperClassName="datepicker-popper" // Apply custom popper class if needed
                                selected={startcount}
                                onChange={handleStartcount}
                                dateFormat="dd/MM/yyyy"
                              /> */}
                                  <div
                                    onClick={toggleDatePickerStartcount}
                                    style={{
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <FaCalendarAlt size={20} />
                                    <span style={{ marginLeft: "8px" }}>
                                      {formattedDate321Startcount
                                        ? formattedDate321Startcount
                                        : "Select Date"}
                                    </span>
                                  </div>

                                  {showDatePickerStartcount && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        zIndex: 1000,
                                      }}
                                    >
                                      <ThaiDatePicker
                                        className="form-control"
                                        value={selectedDateStartcount}
                                        onChange={handleDatePickerStartcountChange}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <!--col-md-6--> */}
                            <div class="col-md-6">
                              <div class="row">
                                <h2 class="title">เงินเดือนปัจจุบัน</h2>
                              </div>
                              <div class="form-group row">
                                <label
                                  role="salary"
                                  class="col-sm-2 col-form-label"
                                >
                                  *อัตรา
                                </label>
                                <div class="col-sm-10">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="salary"
                                    placeholder="จำนวนเงิน"
                                    value={employeeData.salary || ""}
                                    onChange={(e) => handleChange(e, "salary")}
                                    onInput={(e) => {
                                      // Remove any non-digit characters
                                      e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
                                  />
                                </div>
                              </div>
                              <div class="form-group row">
                                <div class="col-md-6">
                                  <div class="row">
                                    <label
                                      role="salarytype"
                                      class="col-sm-3 col-form-label"
                                    >
                                      *ต่อ
                                    </label>
                                    <div class="col-sm-9">
                                      <select
                                        id="salarytype"
                                        name="salarytype"
                                        class="form-control"
                                        value={employeeData.salarytype || ""}
                                        onChange={(e) =>
                                          handleChange(e, "salarytype")
                                        }
                                      >
                                        <option value="">ไม่ระบุ</option>
                                        <option value="ต่อวัน">ต่อวัน</option>
                                        <option value="ต่อเดือน">ต่อเดือน</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="row">
                                    <label
                                      role="money"
                                      class="col-sm-4 col-form-label"
                                    >
                                      สกุลเงิน
                                    </label>
                                    <div class="col-sm-8">
                                      <select
                                        id="money"
                                        name="money"
                                        class="form-control"
                                        value={employeeData.money || ""}
                                        onChange={(e) => handleChange(e, "money")}
                                      >
                                        <option value="">ไม่ระบุ</option>
                                        <option value="บาท">บาท</option>
                                        <option value="จ๊าต">จ๊าต - พม่า</option>
                                        <option value="เรียล">
                                          เรียล - กัมพูชา
                                        </option>
                                        <option value="กีบ">กีบ - ลาว</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="form-group row">
                                <label
                                  role="salaryupdate"
                                  class="col-sm-3 col-form-label"
                                >
                                  วันที่ปรับปรุง
                                </label>
                                <div class="col-sm-9">
                                  <div
                                  // style={{ position: 'relative', zIndex: 9999 }}
                                  >
                                    {/* <DatePicker
                                  id="salaryupdate"
                                  name="salaryupdate"
                                  className="form-control" // Apply Bootstrap form-control class
                                  popperClassName="datepicker-popper" // Apply custom popper class if needed
                                  selected={salaryupdate}
                                  onChange={handleSalaryupdate}
                                  dateFormat="dd/MM/yyyy"
                                /> */}
                                    <div
                                      onClick={toggleDatePickerSalaryupdate}
                                      style={{
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <FaCalendarAlt size={20} />
                                      <span style={{ marginLeft: "8px" }}>
                                        {formattedDate321Salaryupdate
                                          ? formattedDate321Salaryupdate
                                          : "Select Date"}
                                      </span>
                                    </div>

                                    {showDatePickerSalaryupdate && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          zIndex: 1000,
                                        }}
                                      >
                                        <ThaiDatePicker
                                          className="form-control"
                                          value={selectedDateSalaryupdate}
                                          onChange={
                                            handleDatePickerSalaryupdateChange
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!--row--> */}
                          <div class="form-group row">
                            <label role="salaryout" class="col-sm-1">
                              งวดจ่ายเงิน
                            </label>
                            <div class="col-sm-9">
                              <select
                                id="salaryout"
                                name="salaryout"
                                class="form-control"
                                value={employeeData.salaryout || ""}
                                onChange={(e) => handleChange(e, "salaryout")}
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
                          {/* <!--row--> */}
                          <div class="form-group row">
                            <label role="salarypayment" class="col-sm-4">
                              วิธีจ่ายเงิน
                            </label>
                            <div class="col-sm-9">
                              <div class="icheck-primary d-inline">
                                <input
                                  type="radio"
                                  id="salarypayment"
                                  name="salarypayment"
                                  value="เงินสด"
                                  checked={employeeData.salarypayment === "เงินสด"}
                                  onChange={(e) => handleChange(e, "salarypayment")}
                                />{" "}
                                เงินสด
                              </div>
                              <div class="icheck-primary d-inline">
                                <input
                                  type="radio"
                                  id="salarypayment"
                                  name="salarypayment"
                                  value="โอนผ่านธนาคาร "
                                  checked={
                                    employeeData.salarypayment === "โอนผ่านธนาคาร "
                                  }
                                  onChange={(e) => handleChange(e, "salarypayment")}
                                />{" "}
                                โอนผ่านธนาคาร
                              </div>
                            </div>
                          </div>
                          {/* <!--row--> */}
                          <div class="row">
                            <div class="col-md-6">
                              <div class="form-group row">
                                <label
                                  role="salarybank"
                                  class="col-sm-3 col-form-label"
                                >
                                  ชื่อธนาคาร
                                </label>
                                <div class="col-sm-9">
                                  <select
                                    id="salarybank"
                                    name="salarybank"
                                    class="form-control"
                                    value={employeeData.salarybank || ""}
                                    onChange={(e) => handleChange(e, "salarybank")}
                                  >
                                    <option value="">ไม่ระบุ</option>
                                    <option value="ธนาคารกรุงเทพ">
                                      ธนาคาร กรุงเทพ
                                    </option>
                                    <option value="ธนาคารกสิกรไทย">
                                      ธนาคาร กสิกรไทย
                                    </option>
                                    <option value="ธนาคารกรุงไทย">
                                      ธนาคาร กรุงไทย
                                    </option>
                                    <option value="ธนาคารทหารไทยธนชาต">
                                      ธนาคาร ทหารไทยธนชาต
                                    </option>
                                    <option value="ธนาคารไทยพาณิชย์">
                                      ธนาคาร ไทยพาณิชย์
                                    </option>
                                    <option value="ธนาคารกรุงศรีอยุธยา">
                                      ธนาคาร กรุงศรีอยุธยา
                                    </option>
                                    <option value="ธนาคารเกียรตินาคินภัทร">
                                      ธนาคาร เกียรตินาคินภัทร
                                    </option>
                                    <option value="ธนาคารซีไอเอ็มบีไทย">
                                      ธนาคาร ซีไอเอ็มบีไทย
                                    </option>
                                    <option value="ธนาคาร ทิสโก้">
                                      ธนาคาร ทิสโก้
                                    </option>
                                    <option value="ธนาคารยูโอบี">
                                      ธนาคาร ยูโอบี
                                    </option>
                                    <option value="ธนาคารไทยเครดิตเพื่อรายย่อย">
                                      ธนาคาร ไทยเครดิตเพื่อรายย่อย
                                    </option>
                                    <option value="ธนาคารแลนด์ แอนด์ เฮ้าส์">
                                      ธนาคาร แลนด์ แอนด์ เฮ้าส์
                                    </option>
                                    <option value="ธนาคารไอซีบีซี (ไทย)">
                                      ธนาคาร ไอซีบีซี (ไทย)
                                    </option>
                                    <option value="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย">
                                      ธนาคาร พัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">
                                      ธนาคาร เพื่อการเกษตรและสหกรณ์การเกษตร
                                    </option>
                                    <option value="ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย">
                                      ธนาคาร เพื่อการส่งออกและนำเข้าแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารออมสิน">
                                      ธนาคาร ออมสิน
                                    </option>
                                    <option value="ธนาคารอาคารสงเคราะห์">
                                      ธนาคาร อาคารสงเคราะห์
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group row">
                                <label
                                  role="banknumber"
                                  class="col-sm-3 col-form-label"
                                >
                                  เลขที่บัญชี
                                </label>
                                <div class="col-sm-9">
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="banknumber"
                                    placeholder="เลขที่บัญชี"
                                    value={employeeData.banknumber || ""}
                                    onChange={(e) => handleChange(e, "banknumber")}
                                    onInput={(e) => {
                                      // Remove any non-digit characters
                                      e.target.value = e.target.value.replace(/\D/g, "");
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!--row--> */}
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <h2 class="title">เงินเพิ่มพิเศษ</h2>
                        <section class="Frame">
                          <section class="Frame">
                            <h4>เงินเพิ่มของหน่วยงาน</h4>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-3">
                                    <label role="salaryadd6">รหัส</label>
                                  </div>
                                  <div className="col-md-3">
                                    <label role="salaryadd6">ชื่อรายการ</label>
                                  </div>

                                  <div className="col-md-3">
                                    <label role="salaryadd6">จำนวนเงิน</label>
                                  </div>
                                  <div className="col-md-3">
                                    <label role="salaryadd6">ได้เป็นราย</label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-3">
                                    <label role="salaryadd6">ประเภทพนักงาน</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                            {addSalaryWorkplace
                            .map((data, index) => (
                              (data.StaffType === 'all' || data.StaffType === employeeData?.position) && (

                              <div className="row" key={index}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="row">
                                      <div className="col-md-3">
                                        {/* <label role="salaryadd6">จำนวนเงิน</label> */}
                                        <input
                                          type="text"
                                          name="SpSalary"
                                          className="form-control"
                                          value={data.codeSpSalary}
                                          onChange={(e) =>
                                            handleChangeSpSalary(
                                              e,
                                              index,
                                              "codeSpSalary"
                                            )
                                          }
                                          readOnly
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        {/* <label role="salaryadd6">ชื่อรายการ</label> */}
                                        <input
                                          type="text"
                                          name="name"
                                          className="form-control"
                                          value={data.name}
                                          onChange={(e) =>
                                            handleChangeSpSalary(e, index, "name")
                                          }
                                          readOnly
                                        />
                                      </div>

                                      <div className="col-md-3">
                                        {/* <label role="salaryadd6">จำนวนเงิน</label> */}
                                        <input
                                          type="text"
                                          name="SpSalary"
                                          className="form-control"
                                          value={data.SpSalary}
                                          onChange={(e) =>
                                            handleChangeSpSalary(
                                              e,
                                              index,
                                              "SpSalary"
                                            )
                                          }
                                          readOnly
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        {/* <label role="salaryadd6">ได้เป็นราย</label> */}
                                        <select
                                          name="roundOfSalary"
                                          className="form-control"
                                          value={data.roundOfSalary}
                                          onChange={(e) =>
                                            handleChangeSpSalary(
                                              e,
                                              index,
                                              "roundOfSalary"
                                            )
                                          }
                                          disabled
                                        >
                                          <option value="daily">รายวัน</option>
                                          <option value="monthly">รายเดือน</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="row">
                                      <div className="col-md-3">
                                        {/* <label role="salaryadd6">ประเภทพนักงาน</label> */}
                                        <select
                                          name="StaffType"
                                          className="form-control"
                                          value={data.StaffType}
                                          onChange={(e) =>
                                            handleChangeSpSalary(
                                              e,
                                              index,
                                              "StaffType"
                                            )
                                          }
                                          readonly
                                          disabled
                                        >
                                          <option value="">
                                            เลือกตำแหน่งที่จะมอบให้
                                          </option>
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

                                      {data.StaffType === "custom" && (
                                        <div className="col-md-3">
                                          {/* <label>ตำแหน่ง</label> */}
                                          <input
                                            type="text"
                                            name="additionalInput"
                                            className="form-control"
                                            value={data.nameType}
                                            onChange={(e) =>
                                              handleChangeSpSalary(
                                                e,
                                                index,
                                                "nameType"
                                              )
                                            }
                                            readOnly
                                          />
                                        </div>
                                      )}
                                      <div key={index} className="col-md-1">
                                        <div>
                                          <button
                                            onClick={() => handleAddToSalary(data)}
                                            className="btn btn-primary"
                                            style={{
                                              width: "8rem",
                                              position: "absolute",
                                              bottom: "0",
                                            }}
                                          >
                                            ให้สวัสดิการ
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <br />
                                <br />
                              </div>
                            )
                          )
                          )

                          }
                          </section>
                          <section class="Frame">
                            <h4>เงินเพิ่มที่ได้รับ</h4>
                            <div className="row">
                              <div className="col-md-2">
                                <label role="salaryadd6">ชื่อรายการ</label>
                              </div>
                              <div className="col-md-2">
                                <label role="salaryadd6">จำนวนเงิน</label>
                              </div>
                            </div>
                            {addSalary &&
                              addSalary.map(
                                (data, index) =>
                                  data.name !== "" && (
                                    <div className="row" key={index}>
                                      <div className="col-md-2">
                                        {/* <label role="salaryadd6">ชื่อรายการ</label> */}
                                        <input
                                          type="text"
                                          name="name"
                                          className="form-control"
                                          value={data.name}
                                          onChange={(e) =>
                                            handleChangeSpSalary(e, index, "name")
                                          }
                                          readOnly
                                        />
                                      </div>

                                      <div className="col-md-2">
                                        {/* <label role="salaryadd6">จำนวนเงิน</label> */}
                                        <input
                                          type="text"
                                          name="SpSalary"
                                          className="form-control"
                                          value={data.SpSalary}
                                          onChange={(e) =>
                                            handleChangeSpSalary(
                                              e,
                                              index,
                                              "SpSalary"
                                            )
                                          }
                                          readOnly
                                        />
                                      </div>
                                      {/* <div className="col-md-2">
                                                            <label role="salaryadd6">ได้เป็นราย</label>
                                                            <select
                                                                name="roundOfSalary"
                                                                className="form-control"
                                                                value={data.roundOfSalary}
                                                                onChange={(e) => handleChangeSpSalary(e, index, 'roundOfSalary')}

                                                            >
                                                                <option value="daily">รายวัน</option>
                                                                <option value="monthly">รายเดือน</option>
                                                            </select>
                                                        </div> */}
                                      {/* <div className="col-md-2">
                                                            <label role="salaryadd6">ประเภทพนักงาน</label>
                                                            <select
                                                                name="StaffType"
                                                                className="form-control"
                                                                value={data.StaffType}
                                                                onChange={(e) => handleChangeSpSalary(e, index, 'StaffType')}
                                                                readonly
                                                            >
                                                                <option value="">เลือกตำแหน่งที่จะมอบให้</option>
                                                                <option value="all">ทั้งหมด</option>
                                                                <option value="header">หัวหน้างาน</option>
                                                                <option value="custom">กำหนดเอง</option>
                                                            </select>
                                                        </div> */}

                                      {data.StaffType === "custom" && (
                                        <div className="col-md-2">
                                          {/* <label>ตำแหน่ง</label> */}
                                          <input
                                            type="text"
                                            name="additionalInput"
                                            className="form-control"
                                            value={data.nameType}
                                            onChange={(e) =>
                                              handleChangeSpSalary(
                                                e,
                                                index,
                                                "nameType"
                                              )
                                            }
                                            readOnly
                                          />
                                        </div>
                                      )}
                                      <br />
                                      <br />
                                      <div key={index} className="col-md-1">
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleRemoveFromSalary(data)
                                            }
                                            className="btn btn-danger"
                                            style={{
                                              width: "5rem",
                                              position: "absolute",
                                              bottom: "0",
                                            }}
                                          >
                                            นำออก
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                              )}
                          </section>
                          {/* < button type='button' onClick={handleAddInput} class="btn btn-primary" >เพิ่ม</button> */}
                          {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                          {/* m1 */}
                        </section>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-12">
                        <section class="Frame">
                          <div class="col-md-12">
                            <h2 class="title">สวัสดิการวันลา</h2>
                            <div class="row">
                              <div class="col-md-12">
                                <section class="Frame">
                                  <div class="col-md-12">
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="remainbusinessleave">
                                            วันลากิจคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="remainbusinessleave"
                                            placeholder="วันลากิจคงเหลือ"
                                            value={employeeData.remainbusinessleave}
                                            onChange={(e) =>
                                              handleChange(e, "remainbusinessleave")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="businessleavesalary">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="businessleavesalary"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.businessleavesalary}
                                            onChange={(e) =>
                                              handleChange(e, "businessleavesalary")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="remainsickleave">
                                            วันลาป่วยคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="remainsickleave"
                                            placeholder="วันลาป่วยคงเหลือ"
                                            value={employeeData.remainsickleave}
                                            onChange={(e) =>
                                              handleChange(e, "remainsickleave")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="sickleavesalary">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="sickleavesalary"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.sickleavesalary}
                                            onChange={(e) =>
                                              handleChange(e, "sickleavesalary")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="remainvacation">
                                            วันลาพักร้อนคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="remainvacation"
                                            placeholder="วันลาพักร้อนคงเหลือ"
                                            value={employeeData.remainvacation}
                                            onChange={(e) =>
                                              handleChange(e, "remainvacation")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="maternityleave">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="maternityleave"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.maternityleave}
                                            onChange={(e) =>
                                              handleChange(e, "maternityleave")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="maternityleavesalary">
                                            วันลาคลอดคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="maternityleavesalary"
                                            placeholder="วันลาคลอดคงเหลือ"
                                            value={
                                              employeeData.maternityleavesalary
                                            }
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                "maternityleavesalary"
                                              )
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="vacationsalary">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="vacationsalary"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.vacationsalary}
                                            onChange={(e) =>
                                              handleChange(e, "vacationsalary")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="militaryleave">
                                            วันลาเพื่อเกณฑ์ทหารคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="militaryleave"
                                            placeholder="วันลาเพื่อเกณฑ์ทหารคงเหลือ"
                                            value={employeeData.militaryleave}
                                            onChange={(e) =>
                                              handleChange(e, "militaryleave")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="militaryleavesalary">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="militaryleavesalary"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.militaryleavesalary}
                                            onChange={(e) =>
                                              handleChange(e, "militaryleavesalary")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="sterilization">
                                            วันลาเพื่อทำหมันคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="sterilization"
                                            placeholder="วันลาเพื่อทำหมันคงเหลือ"
                                            value={employeeData.sterilization}
                                            onChange={(e) =>
                                              handleChange(e, "sterilization")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="sterilizationsalary">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="sterilizationsalary"
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={employeeData.sterilizationsalary}
                                            onChange={(e) =>
                                              handleChange(e, "sterilizationsalary")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="leavefortraining">
                                            วันลาเพื่อฝึกอบรมคงเหลือ
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="leavefortraining"
                                            placeholder="วันลาเพื่อฝึกอบรมคงเหลือ"
                                            value={employeeData.leavefortraining}
                                            onChange={(e) =>
                                              handleChange(e, "leavefortraining")
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div class="col-md-6">
                                        <div class="form-group">
                                          <label role="[leavefortrainingsalary, ">
                                            จำนวนเงินต่อวัน
                                          </label>
                                          <input
                                            type="text"
                                            class="form-control"
                                            id="[leavefortrainingsalary, "
                                            placeholder="จำนวนเงินต่อวัน"
                                            value={
                                              employeeData.leavefortrainingsalary
                                            }
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                "leavefortrainingsalary"
                                              )
                                            }
                                            onInput={(e) => {
                                              // Remove any non-digit characters
                                              e.target.value = e.target.value.replace(/\D/g, "");
                                            }}
                                          />
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

                            {/* <!--row--> */}
                          </div>
                          {/* <!--col-md-12--> */}
                        </section>
                        {/* <!--Frame--> */}
                      </div>
                    </div>

                    <div class="line_btn">
                      <button
                        type="submit"
                        class="btn b_save"
                        onClick={updateEmployee}
                      >
                        <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                      </button>
                      <button type="reset" class="btn clean"
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
    </body>
  );
}

export default Salary;
