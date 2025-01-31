import endpoint from "../../config";
import { getWorkTime, getMonthName, getDateDayOfWeek } from "./library";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import EmployeesSelected from "./EmployeesSelected";

import th from "date-fns/locale/th"; // Import Thai locale data from date-fns
import en from "date-fns/locale/en-US";

function AddsettimeWorkplace({ workplaceList, employeeList }) {
  const bordertable = {
    borderLeft: "2px solid #000",
  };
  const [updateButton, setUpdateButton] = useState(false); // Initially, set to false
  const [newWorkplace, setNewWorkplace] = useState(true);

  //Workplace Record data
  const [workDate, setWorkDate] = useState(new Date());
  const formattedWorkDate = moment(workDate).format("DD/MM/YYYY");

  const [timeRecord_id, setTimeRecord_id] = useState("");
  const [loading, setLoading] = useState(false); // Create loading state
  const [groupOptions1 , setGroupOptions1 ] = useState();


  //Workplace data
  const [workplaceId, setWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [workplaceName, setWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [wGroup , setWGroup] = useState('');
  const [workplacestay, setWorkplacestay] = useState(""); //สังกัด
  const [workplaceArea, setWorkplaceArea] = useState(""); //สถานที่ปฏิบัติงาน
  const [workOfWeek, setWorkOfWeek] = useState(""); //วันทำงานต่อสัปดาห์
  const [workStart1, setWorkStart1] = useState(""); //เวลาเริ่มกะเช้า
  const [workEnd1, setWorkEnd1] = useState(""); //เวลาออกกะเช้า
  const [workStart2, setWorkStart2] = useState(""); //เวลาเข้ากะบ่าย
  const [workEnd2, setWorkEnd2] = useState(""); //เวลาออกกะบ่าย
  const [workStart3, setWorkStart3] = useState(""); //เวลาเข้ากะเย็น
  const [workEnd3, setWorkEnd3] = useState(""); //เวลาออกกะเย็น
  const [workOfHour, setWorkOfHour] = useState(0); //ชั่วโมงทำงานต่อสัปดาห์
  const [workOfOT, setWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์

  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [workTotalPeople, setWorkTotalPeople] = useState(""); //จำนวนคนในหน่วยงาน
  const [workRateDayoff, setWorkRateDayoff] = useState(""); //ค่าจ้างวันหยุด ต่อวัน
  const [workRateDayoffHour, setWorkRateDayoffHour] = useState(""); //ค่าจ้างวันหยุดต่อชั่วโมง
  const [workplaceAddress, setWorkplaceAddress] = useState(""); //ที่อยู่หน่วยงาน

  //////////////////////////////

  const [workStartOt1, setWorkStartOt1] = useState("18.00"); //เวลาเริ่มกะเช้า
  const [workEndOt1, setWorkEndOt1] = useState("21.00"); //เวลาออกกะเช้า
  const [workStartOt2, setWorkStartOt2] = useState("22.00"); //เวลาเข้ากะบ่าย
  const [workEndOt2, setWorkEndOt2] = useState("01.00"); //เวลาออกกะบ่าย
  const [workStartOt3, setWorkStartOt3] = useState("19.00"); //เวลาเข้ากะเย็น
  const [workEndOt3, setWorkEndOt3] = useState("22.00"); //เวลาออกกะเย็น

  /////////////////////////////////

  //auto check time record
  useEffect(() => {
    if (workplaceName !== "") {
      handleCheckTimerecord();
    }
  }, [workDate]);

  /////////////////////////////////////////////
  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [shift, setShift] = useState("");
  const [startTime, setStartTime] = useState(""); //รหัสหน่วยงาน
  const [endTime, setEndTime] = useState(""); //รหัสหน่วยงาน
  const [allTime, setAllTime] = useState(""); //รหัสหน่วยงาน
  const [otTime, setOtTime] = useState(""); //รหัสหน่วยงาน
  const [selectotTime, setSelectotTime] = useState("");
  const [selectotTimeOut, setSelectotTimeOut] = useState("");

  const [cashSalary, setCashSalary] = useState(false);
  const [specialtSalary, setSpecialtSalary] = useState("");
  const [specialtSalaryOT, setSpecialtSalaryOT] = useState("");

  const [messageSalary, setMessageSalary] = useState("");

  const [shift1start, setShift1start] = useState("");
  const [shift2start, setShift2start] = useState("");
  const [shift3start, setShift3start] = useState("");
  const [shift4start, setShift4start] = useState("");
  const [shift1end, setShift1end] = useState("");
  const [shift2end, setShift2end] = useState("");
  const [shift3end, setShift3end] = useState("");
  const [shift4end, setShift4end] = useState("");
  const [startTimeOt1, setStartTimeOt1] = useState("");
  const [endTimeOt1, setEndTimeOt1] = useState("");
  const [startTimeOt2, setStartTimeOt2] = useState("");
  const [endTimeOt2, setEndTimeOt2] = useState("");
  const [startTimeOt3, setStartTimeOt3] = useState("");
  const [endTimeOt3, setEndTimeOt3] = useState("");

  //data for search
  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [searchResult, setSearchResult] = useState([]);

  async function handleSearch(event) {
    try {
      event.preventDefault();
      // get value from form search
      const data = {
        searchWorkplaceId: searchWorkplaceId,
        // searchWorkplaceName: searchWorkplaceName,
        // workplaceId: searchWorkplaceId,
        // workplaceName: searchWorkplaceName,
      };

      try {
        const response = await axios.post(endpoint + "/workplace/search", data);
        // setSearchResult(response.data.workplaces);
        // alert(JSON.stringify(response ,null,2));
        console.log("searchResult", searchResult);
        if (response.data.workplaces.length < 1) {
          window.location.reload();
        } else {
          await setSearchResult(response.data.workplaces);
await setGroupOptions1(response.data?.workplaces?.[0]?.workplaceGroup || []);

          // Calculate the time difference
          setWorkOfHour(response.data.workplaces[0].workOfHour);
          setWorkOfOT(response.data.workplaces[0].workOfOT);

          const startTime = response.data.workplaces[0].workStart1 || "";
          const endTime = response.data.workplaces[0].workEnd1 || "";
          const workOfHour = response.data.workplaces[0].workOfHour || "";
          const selectotTime = response.data.workplaces[0].workEnd1 || "";
          const workOfOT = response.data.workplaces[0].workOfOT || "";
          //get start time and end time for afternoon and night
          const startTime2 = response.data.workplaces[0].workStart2 || "";
          const endTime2 = response.data.workplaces[0].workEnd2 || "";
          const startTime3 = response.data.workplaces[0].workStart3 || "";
          const endTime3 = response.data.workplaces[0].workEnd3 || "";
          const startTime4 = "";
          const endTime4 = "";

          setShift("morning_shift");
          setShift1start("");
          setShift1end("");
          setShift2start("");
          setShift2end("");
          setShift3start("");
          setShift3end("");

          setStartTimeOt1("");
          setEndTimeOt1("");
          setStartTimeOt2("");
          setEndTimeOt2("");
          setStartTimeOt3("");
          setEndTimeOt3("");

          const [startHours, startMinutes] = startTime
            .split(".")
            .map(parseFloat);
          const [endHours, endMinutes] = endTime.split(".").map(parseFloat);

          let hours = endHours - startHours;
          let minutes = endMinutes - startMinutes;

          if (minutes < 0) {
            hours -= 1;
            minutes += 60;
          }

          // Handle cases where endTime is on the next day
          if (hours < 0) {
            hours += 24;
          }
          const totalMinutes = hours * 60 + minutes;

          // Cap the time difference at the maximum work hours
          const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);

          // Convert the capped time difference back to hours and minutes
          const cappedHours = Math.floor(cappedTotalMinutes / 60);
          const cappedMinutes = cappedTotalMinutes % 60;

          const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

          // const timeDiffFormatted = `${hours}.${minutes}`;

          // Populate all the startTime input fields with the search result value
          const updatedRowDataList = rowDataList.map((rowData) => ({
            ...rowData,
            startTime: startTime,
            endTime: endTime,
            workOfHour: workOfHour,
            selectotTime: selectotTime,
            allTime: timeDiffFormatted,
            workOfOT: workOfOT,
            startTime2: startTime2,
            endTime2: endTime2,
            startTime3: startTime3,
            endTime3: endTime3,

            startTimeOt1: startTimeOt1,
            endTimeOt1: endTimeOt1,
            startTimeOt2: startTimeOt2,
            endTimeOt2: endTimeOt2,
            startTimeOt3: startTimeOt3,
            endTimeOt3: endTimeOt3,
          }));
          // setRowDataList(updatedRowDataList);

          // Set search values
          setWorkplaceId(response.data.workplaces[0].workplaceId);
          setWorkplaceName(response.data.workplaces[0].workplaceName);

          // setSearchWorkplaceId(response.data.workplaces[0].workplaceId);
          // setSearchWorkplaceName(response.data.workplaces[0].workplaceName);

          // setSearchWorkplaceId("");
          // setSearchWorkplaceName("");
        }
      } catch (error) {
        alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา" + error);
        // window.location.reload();
      }
    } catch (err) {
      console("err", err);
    }
  }

  //search employee name by employeeId
  useEffect(() => {
    //Search Employee  by id
    if (staffId != "") {
      const employeesearch = employeeList.find(
        (employee) => employee.employeeId === staffId
      );
      if (employeesearch) {
        setStaffName(employeesearch.name);
        setStaffLastname(employeesearch.lastName);
      } else {
        setStaffName("");
        setStaffLastname("");
      }
    }
  }, [staffId]);

  const handleCheckboxChange = () => {
    setCashSalary(!cashSalary); // Toggle the checkbox state
  };

  function formatThaiBuddhistYear(d) {
    const thaiYear = d.getFullYear() + 543; // Add 543 to convert to Thai Buddhist year
    return thaiYear;
  }

  function convertToThaiBuddhistDate(date) {
    const thaiYear = date.getFullYear() + 543;
    return new Date(thaiYear, date.getMonth(), date.getDate());
  }

  const thaiWorkDate = convertToThaiBuddhistDate(workDate);

  const GregorianToThaiBuddhist = (gregorianDate) => {
    const thaiYear = gregorianDate.getFullYear();
    return new Date(
      thaiYear,
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    );
  };

  const ThaiBuddhistToGregorian = (thaiDate) => {
    const gregorianYear = thaiDate.getFullYear();
    return new Date(gregorianYear, thaiDate.getMonth(), thaiDate.getDate());
  };

  const initialThaiDate = new Date();
  initialThaiDate.setFullYear(initialThaiDate.getFullYear()); // Add 543 years to the current year

  const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
  const [selectedGregorianDate, setSelectedGregorianDate] = useState(
    new Date()
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    const newDate = new Date(date);
    setSelectedThaiDate(newDate);
    setShowDatePicker(false); // Hide date picker after selecting a date
  };
  useEffect(() => {
    if (selectedDate) {
      // Convert the string to a Date object
      const date = new Date(selectedDate);

      // Extract day, month, and year
      const daySelectedDate = date.getDate().toString().padStart(2, "0");
      const monthSelectedDate = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const yearSelectedDate = (date.getFullYear() + 543).toString();

      // Format the date
      const formattedDate = `${daySelectedDate}/${monthSelectedDate}/${yearSelectedDate}`;
      setFormattedDate(formattedDate);
    }
  }, [selectedDate]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleThaiDateChange = (date) => {
    setSelectedThaiDate(date);
    setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
    setWorkDate(ThaiBuddhistToGregorian(date));
  };

  const handleGregorianDateChange = (date) => {
    setSelectedGregorianDate(date);
    setSelectedThaiDate(GregorianToThaiBuddhist(date));
  };

  //search employeeId by employeeName
  // useEffect(() => {
  //     //Search Employee  by name
  //     if (staffName != '') {
  //         const employeesearch = employeeList.find(employee => employee.name === staffName);
  //         if (employeesearch) {
  //             setStaffId(employeesearch.employeeId);
  //         } else {
  //             setStaffId('');
  //         }
  //     }
  // }, [staffName])

  //check ship and set time of work to start time and end time

  function calTime(start, end, limit) {
    const startHours = parseFloat(start.split(".")[0] || 0);
    const startMinutes = parseFloat(start.split(".")[1] || 0);
    const endHours = parseFloat(end.split(".")[0] || 0);
    const endMinutes = parseFloat(end.split(".")[1] || 0);
    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    // Handle cases where endTime is on the next day
    if (hours < 0) {
      hours += 24;
    }
    //check employee working >= 5 hours
    if (hours >= 5) {
      hours -= 1;
    }

    // Calculate the total time difference in minutes
    const totalMinutes = hours * 60 + minutes;
    // check employee working > 5 hours
    // Cap the time difference at the maximum work hours
    const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);
    // Convert the capped time difference back to hours and minutes
    const cappedHours = Math.floor(cappedTotalMinutes / 60);
    const cappedMinutes = cappedTotalMinutes % 60;
    const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
    if (isNaN(timeDiffFormatted)) {
      return "0";
    }

    return timeDiffFormatted;
  }

  useEffect(() => {
    // alert(shift);
    switch (shift) {
      case "morning_shift":
        setStartTime(shift1start || "");
        setEndTime(shift1end || "");
        setAllTime(
          calTime(shift1start || "", shift1end || "", workOfHour || "") || ""
        );
        setOtTime(
          calTime(startTimeOt1 || "", endTimeOt1 || "", workOfOT || "") || ""
        );
        setSelectotTime(startTimeOt1 || "");
        setSelectotTimeOut(endTimeOt1 || "");
        break;
      case "afternoon_shift":
        setStartTime(shift2start || "");
        setEndTime(shift2end || "");
        setAllTime(
          calTime(shift2start || "", shift2end || "", workOfHour || "") || ""
        );
        setOtTime(
          calTime(startTimeOt2 || "", endTimeOt2 || "", workOfOT || "") || ""
        );
        setSelectotTime(startTimeOt2 || "");
        setSelectotTimeOut(endTimeOt2 || "");
        break;
      case "night_shift":
        setStartTime(shift3start || "");
        setEndTime(shift3end || "");
        setAllTime(
          calTime(shift3start || "", shift3end || "", workOfHour || "") || ""
        );
        setOtTime(
          calTime(startTimeOt3 || "", endTimeOt3 || "", workOfOT || "") || ""
        );
        setSelectotTime(startTimeOt3 || "");
        setSelectotTimeOut(endTimeOt3 || "");
        break;
      default:
        setStartTime("");
        setEndTime("");
        setAllTime("");
        setOtTime("");
        setSelectotTime("");
        setSelectotTimeOut("");
    }
  }, [shift]);

  useEffect(() => {
    // const startHours = parseFloat(startTime.split('.')[0]);
    // const startMinutes = parseFloat(startTime.split('.')[1] || 0);
    // const endHours = parseFloat(endTime.split('.')[0]);
    // const endMinutes = parseFloat(endTime.split('.')[1] || 0);
    // let hours = endHours - startHours;
    // let minutes = endMinutes - startMinutes;
    // if (minutes < 0) {
    //     hours -= 1;
    //     minutes += 60;
    // }
    // // Handle cases where endTime is on the next day
    // if (hours < 0) {
    //     hours += 24;
    // }
    // // Check if the employee worked >= 5 hours
    // if (hours >= 5) {
    //     hours -= 1;
    // }

    // // Calculate the total time difference in minutes
    // const totalMinutes = hours * 60 + minutes;
    // // Check if the employee worked > 5 hours
    // // Cap the time difference at the maximum work hours
    // const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);
    // // Convert the capped time difference back to hours and minutes
    // const cappedHours = Math.floor(cappedTotalMinutes / 60);
    // const cappedMinutes = cappedTotalMinutes % 60;
    // const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
    // if (isNaN(timeDiffFormatted)) {
    //     setAllTime('0');
    // } else {
    //     setAllTime(timeDiffFormatted);
    // }

    try {
      if (
        shift == "night_shift" ||
        shift == "afternoon_shift" ||
        shift == "morning_shift"
      ) {
        const allt =
          calTime(startTime || 0, endTime || 0, workOfHour || 0) || 0;
        setAllTime(allt);
      } else {
        const allt = calTime(startTime || 0, endTime || 0, 24) || 0;
        setAllTime(allt);
      }
    } catch (error) {
      // Handle the error here, you can log it or show an error message.
      console.error(error);
      //   alert(error);
    }
  }, [startTime, endTime, workOfHour]);

  useEffect(() => {
    try {
      if (
        shift == "night_shift" ||
        shift == "afternoon_shift" ||
        shift == "morning_shift"
      ) {
        const ot =
          calTime(selectotTime || 0, selectotTimeOut || 0, workOfOT || 0) || 0;
        setOtTime(ot);
      } else {
        const ot = calTime(selectotTime || 0, selectotTimeOut || 0, 24) || 0;
        setOtTime(ot);
      }
    } catch (error) {
      // Handle the error here, you can log it or show an error message.
      console.error(error);
      //   alert(error);
    }
  }, [selectotTime, selectotTimeOut, workOfOT]);

  //     useEffect(() => {
  // const ot = calTime( selectotTime || 0, selectotTimeOut || 0 , workOfOT  || 0) || 0;
  // setOtTime(ot );
  // const startHours = parseFloat(selectotTime.split('.')[0]);
  // const startMinutes = parseFloat(selectotTime.split('.')[1] || 0);
  // const endHours = parseFloat(selectotTimeOut.split('.')[0]);
  // const endMinutes = parseFloat(selectotTimeOut.split('.')[1] || 0);
  // let hours = endHours - startHours;
  // let minutes = endMinutes - startMinutes;
  // if (minutes < 0) {
  //     hours -= 1;
  //     minutes += 60;
  // }
  // // Handle cases where endTime is on the next day
  // if (hours < 0) {
  //     hours += 24;
  // }
  // // Check if the employee worked >= 5 hours
  // if (hours >= 5) {
  //     hours -= 1;
  // }

  // // Calculate the total time difference in minutes
  // const totalMinutes = hours * 60 + minutes;
  // // Check if the employee worked > 5 hours
  // // Cap the time difference at the maximum work hours
  // const cappedTotalMinutes = Math.min(totalMinutes, otTime * 60);
  // // Convert the capped time difference back to hours and minutes
  // const cappedHours = Math.floor(cappedTotalMinutes / 60);
  // const cappedMinutes = cappedTotalMinutes % 60;

  // const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
  // // alert(timeDiffFormatted);
  // if (isNaN(timeDiffFormatted)) {
  //     setOtTime('0');
  // } else {
  //     setOtTime(timeDiffFormatted);
  // }
  // }, [selectotTime, selectotTimeOut, otTime]);

  // Function to add a new row to the rowDataList with specific values
  const addRow = (newRowData) => {
    // Create a copy of the current state
    const newDataList = [...rowDataList];
    // Push a new row with specific data
    // newDataList.push({ ...initialRowData, ...newRowData });




    
    newDataList.unshift(newRowData);

    // Update the state with the new data
    setRowDataList(newDataList);
  };




  // Function to handle editing a row
  const handleEditRow = async (index) => {
    // You can implement the edit logic here, e.g., open a modal for editing
    // console.log('Edit row at index:', index);
    const tmp = await rowDataList[index];
    alert(tmp.staffId);
    await setStaffId(tmp.staffId);
    await setStaffName(tmp.staffName);
  };

  // Function to handle deleting a row
  const handleDeleteRow = (index) => {
    // Create a copy of the current state
    const newDataList = [...rowDataList];
    // Remove the row at the specified index
    newDataList.splice(index, 1);
    // Update the state with the new data
    setRowDataList(newDataList);
  };

  const handleWorkDateChange = (date) => {
    setWorkDate(date);
  };

  const [startjob1, setStartjob1] = useState(""); //วันที่เริ่มงาน
  const handleStartDateChange1 = (date) => {
    setStartjob1(date);
  };
  const [startjob2, setStartjob2] = useState(""); //วันที่เริ่มงาน
  const handleStartDateChange2 = (date) => {
    setStartjob2(date);
  };
  const [startjob3, setStartjob3] = useState(""); //วันที่เริ่มงาน
  const handleStartDateChange3 = (date) => {
    setStartjob3(date);
  };

  // const numberOfRows = 30; // Fixed number of rows
  const numberOfRows = 1; // Fixed number of rows

  const initialRowData = {
    staffId: "",
    staffName: "",
    shift: "",
    startTime: "",
    endTime: "",
    allTime: "",
    otTime: "",
    selectotTime: "",
    selectotTimeOut: "",
  };

  const [rowDataList, setRowDataList] = useState(
    new Array(numberOfRows).fill(initialRowData)
  );

  const handleFieldChange = (index, fieldName, value) => {
    setRowDataList((prevDataList) => {
      const newDataList = [...prevDataList];

      newDataList[index] = {
        ...newDataList[index],
        [fieldName]: value,
      };

      //Search Employee  by id
      if (fieldName == "staffId") {
        const employeesearch = employeeList.find(
          (employee) => employee.employeeId === value
        );
        if (employeesearch) {
          newDataList[index] = {
            ...newDataList[index],
            ["staffName"]: employeesearch.name + "",
          };
        } else {
          newDataList[index] = {
            ...newDataList[index],
            ["staffName"]: "ไม่พบชื่อพนักงาน",
          };
        }
      }

      //Search Employee  by name
      if (fieldName == "staffName") {
        const employeesearch = employeeList.find(
          (employee) => employee.name === value
        );
        if (employeesearch) {
          newDataList[index] = {
            ...newDataList[index],
            ["staffId"]: employeesearch.employeeId + "",
          };
        } else {
          newDataList[index] = {
            ...newDataList[index],
            ["staffId"]: "ไม่พบรหัสพนักงาน",
          };
        }
      }

      if (
        fieldName === "startTime" ||
        fieldName === "endTime" ||
        fieldName === "shift"
      ) {
        if (value == "morning_shift" && shift1start != null) {
          newDataList[index] = {
            ...newDataList[index],
            ["startTime"]: shift1start + "",
            ["endTime"]: shift1end + "",
            ["selectotTime"]: shift1end + "",
            // allTime: timeDiffFormatted,
            // otTime: otTimeFormatted2 + '2222',
          };
        }

        //check shift is afternoon
        if (value == "afternoon_shift" && shift2start != null) {
          newDataList[index] = {
            ...newDataList[index],
            ["startTime"]: shift2start + "",
            ["endTime"]: shift2end + "",
            ["selectotTime"]: shift2end + "",
            // allTime: timeDiffFormatted,
            // otTime: otTimeFormatted2 + '2222',
          };
        }

        //Check shift is night
        if (value == "night_shift" && shift3start != null) {
          newDataList[index] = {
            ...newDataList[index],
            ["startTime"]: shift3start + "",
            ["endTime"]: shift3end + "",
            ["selectotTime"]: "" + "",
            ["selectotTimeOut"]: workEndOt3 + "",
          };
        }

        if (value == "specialt_shift" && shift4start != null) {
          const workOfHour = parseFloat(newDataList[index].workOfHour);
          const startHours = parseFloat(
            newDataList[index].startTime.split(".")[0]
          );
          const startMinutes = parseFloat(
            newDataList[index].startTime.split(".")[1] || 0
          );
          const endHours = parseFloat(newDataList[index].endTime.split(".")[0]);
          const endMinutes = parseFloat(
            newDataList[index].endTime.split(".")[1] || 0
          );

          let hours = endHours - startHours;
          let minutes = endMinutes - startMinutes;

          if (minutes < 0) {
            hours -= 1;
            minutes += 60;
          }

          // Handle cases where endTime is on the next day
          if (hours < 0) {
            hours += 24;
          }

          const timeDiffFormatted = `${hours}.${minutes}`;

          // Calculate otTime based on selectotTimeOut and endTime
          const otselectHours = parseFloat(
            newDataList[index].selectotTime.split(".")[0]
          );
          const otselectMinutes = parseFloat(
            newDataList[index].selectotTime.split(".")[1] || 0
          );
          const otHours = parseFloat(
            newDataList[index].selectotTimeOut.split(".")[0]
          );
          const otMinutes = parseFloat(
            newDataList[index].selectotTimeOut.split(".")[1] || 0
          );

          let otHoursDiff = otHours - otselectHours;
          let otMinutesDiff = otMinutes - otselectMinutes;

          if (otMinutesDiff < 0) {
            otHoursDiff -= 1;
            otMinutesDiff += 60;
          }

          // Handle cases where otTime is on the next day
          if (otHoursDiff < 0) {
            otHoursDiff += 24;
          }
          const otTimeFormatted1 = `${otHoursDiff}.${otMinutesDiff}`;
          const maxOTHours = parseFloat(newDataList[index].workOfOT);
          const maxOTMinutes = 0; // If maxOTHours is always whole numbers

          const totalOTMinutes = otHoursDiff * 60 + otMinutesDiff;
          if (totalOTMinutes > maxOTHours * 60) {
            otHoursDiff = maxOTHours;
            otMinutesDiff = maxOTMinutes;
          }
          const otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;
          newDataList[index] = {
            ...newDataList[index],
            ["startTime"]: shift4start + "",
            ["endTime"]: shift4end + "",
            ["selectotTime"]: shift4end + "",
            maxOTHours: "",
            allTime: timeDiffFormatted, // Assign your custom allTime value here
            otTime: otTimeFormatted2 + "2222", // Assign your custom otTime value here
          };
        }

        //specialt_shift
      }

      const startHours = parseFloat(newDataList[index].startTime.split(".")[0]);
      const startMinutes = parseFloat(
        newDataList[index].startTime.split(".")[1] || 0
      );
      const endHours = parseFloat(newDataList[index].endTime.split(".")[0]);
      const endMinutes = parseFloat(
        newDataList[index].endTime.split(".")[1] || 0
      );

      let hours = endHours - startHours;
      let minutes = endMinutes - startMinutes;

      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }

      // Handle cases where endTime is on the next day
      if (hours < 0) {
        hours = hours + 24;
      }

      // Calculate the total time difference in minutes
      const totalMinutes = hours * 60 + minutes;

      // Cap the time difference at the maximum work hours

      const cappedTotalMinutes = Math.min(totalMinutes, workOfHour * 60);
      // alert(workOfHour );
      // Convert the capped time difference back to hours and minutes
      const cappedHours = Math.floor(cappedTotalMinutes / 60);
      const cappedMinutes = cappedTotalMinutes % 60;

      const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

      // Calculate otTime based on selectotTimeOut and endTime
      const otselectHours = parseFloat(
        newDataList[index].selectotTime.split(".")[0]
      );
      const otselectMinutes = parseFloat(
        newDataList[index].selectotTime.split(".")[1] || 0
      );
      const otHours = parseFloat(
        newDataList[index].selectotTimeOut.split(".")[0]
      );
      const otMinutes = parseFloat(
        newDataList[index].selectotTimeOut.split(".")[1] || 0
      );

      let otHoursDiff = otHours - otselectHours;
      let otMinutesDiff = otMinutes - otselectMinutes;

      if (otMinutesDiff < 0) {
        otHoursDiff -= 1;
        otMinutesDiff += 60;
      }

      // Handle cases where otTime is on the next day
      if (otHoursDiff < 0) {
        otHoursDiff += 24;
      }

      const otTimeFormatted1 = `${otHoursDiff}.${otMinutesDiff}`;

      const cappedTotalMinutes2 = Math.min(totalMinutes, workOfOT * 60);
      const maxOTHours = Math.floor(cappedTotalMinutes2 / 60);
      const maxOTMinutes = cappedTotalMinutes2 % 60;

      // const maxOTHours = parseFloat(newDataList[index].workOfOT);
      // const maxOTMinutes = 0; // If maxOTHours is always whole numbers

      const totalOTMinutes = otHoursDiff * 60 + otMinutesDiff;
      if (totalOTMinutes > maxOTHours * 60) {
        otHoursDiff = maxOTHours;
        otMinutesDiff = maxOTMinutes;
      }
      // const otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;

      let otTimeFormatted2;

      if (
        !isNaN(otHoursDiff) &&
        !isNaN(otMinutesDiff) &&
        (otHoursDiff !== 0 || otMinutesDiff !== 0)
      ) {
        otTimeFormatted2 = `${otHoursDiff}.${otMinutesDiff}`;
      } else {
        otTimeFormatted2 = "0";
      }

      newDataList[index] = {
        ...newDataList[index],
        allTime: timeDiffFormatted,
        otTime: otTimeFormatted2,
      };

      return newDataList;
    });
  };

  const numberOfRows2 = 30; // Fixed number of rows
  const initialRowData2 = {
    staffId: "",
    staffName: "",
    startjob: null, // Use null as initial value for DatePicker
    shift: "morning_shift",
    startTime: "",
    endTime: "",
    allTime: "",
    otTime: "",
    selectotTime: "",
    selectotTimeOut: "",
  };

  const [rowDataList2, setRowDataList2] = useState(
    new Array(numberOfRows2).fill(initialRowData2)
  );

  const handleFieldChange2 = (index2, fieldName2, value) => {
    setRowDataList2((prevDataList) => {
      const newDataList2 = [...prevDataList];
      newDataList2[index2] = {
        ...newDataList2[index2],
        [fieldName2]: value,
      };
      return newDataList2;
    });
  };

  const handleStartDateChange4 = (index2, date) => {
    handleFieldChange2(index2, "startjob", date);
  };

  ///////////////////
  function handleClickResult(workplace) {
    setSearchWorkplaceId(workplace.workplaceId);
    setSearchWorkplaceName(workplace.workplaceName);
    //
    setWorkplaceId(workplace.workplaceId);
    setWorkplaceName(workplace.workplaceName);
    // alert(workplace.workOfHour);

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

  const convertBuddhistToGregorian = (buddhistDate) => {
    // Split the Buddhist date into day, month, and year
    const [day, month, buddhistYear] = buddhistDate.split("/");

    // Subtract 543 to convert Buddhist year to Gregorian year
    const gregorianYear = buddhistYear - 543;

    // Return the new formatted date as day/month/gregorianYear
    return `${day}/${month}/${gregorianYear}`;
  };

  async function handleCheckTimerecord() {
    await setRowDataList([]); //Clean data

    const data = {
      workplaceId: searchWorkplaceId,
      workplaceName: searchWorkplaceName,
      // date: formattedDate,
      date: convertBuddhistToGregorian(formattedDate),
    };

    // alert(convertBuddhistToGregorian (formattedDate) )
    let dateString = await convertBuddhistToGregorian(formattedDate);
    const [day, month, year] = await dateString.split("/");

    // Create a new Date object using the year, month (0-indexed), and day
    const date = await new Date(year, month - 1, day);

    // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayNumber = await date.getDay();

    // alert(dayNumber );

    const dayMapping = await {
      อาทิตย์: 0,
      จันทร์: 1,
      อังคาร: 2,
      พุธ: 3,
      พฤหัส: 4,
      ศุกร์: 5,
      เสาร์: 6,
    };

    searchResult[0].workTimeDay.map(async (item, index) => {
      // await alert(dayMapping[item.startDay] + ' ' + dayMapping [item.endDay] );
      // await alert(item.allTimes[0].shift);

      if (dayMapping[item.startDay] <= dayNumber <= dayMapping[item.endDay]) {
        if (item.allTimes[0].shift == "กะเช้า") {
          setShift1start(item.allTimes[0].startTime);
          setShift1end(item.allTimes[0].endTime);
          setStartTimeOt1(item.allTimes[0].startTimeOT);
          setEndTimeOt1(item.allTimes[0].endTimeOT);
        } else if (item.allTimes[0].shift == "กะบ่าย") {
          setShift2start(item.allTimes[0].startTime);
          setShift2end(item.allTimes[0].endTime);
          setStartTimeOt2(item.allTimes[0].startTimeOT);
          setEndTimeOt2(item.allTimes[0].endTimeOT);
        } else if (item.allTimes[0].shift == "กะดึก") {
          setShift3start(item.allTimes[0].startTime);
          setShift3end(item.allTimes[0].endTime);
          setStartTimeOt3(item.allTimes[0].startTimeOT);
          setEndTimeOt3(item.allTimes[0].endTimeOT);
        }
      } else {
        dayMapping[item.startDay] <= dayNumber <= dayMapping[item.endDay];
        if (
          dayMapping[item.startDay] <= dayNumber <= 6 ||
          0 <= dayNumber <= dayMapping[item.endDay]
        ) {
          if (item.allTimes[0].shift == "กะเช้า") {
            // alert(item.startTime);
            setShift1start(item.allTimes[0].startTime);
            setShift1end(item.allTimes[0].endTime);
            setStartTimeOt1(item.allTimes[0].startTimeOT);
            setEndTimeOt1(item.allTimes[0].endTimeOT);
          } else if (item.allTimes[0].shift == "กะบ่าย") {
            setShift2start(item.allTimes[0].startTime);
            setShift2end(item.allTimes[0].endTime);
            setStartTimeOt2(item.allTimes[0].startTimeOT);
            setEndTimeOt2(item.allTimes[0].endTimeOT);
          } else if (item.allTimes[0].shift == "กะดึก") {
            setShift3start(item.allTimes[0].startTime);
            setShift3end(item.allTimes[0].endTime);
            setStartTimeOt3(item.allTimes[0].startTimeOT);
            setEndTimeOt3(item.allTimes[0].endTimeOT);
          }
        } else {
          setShift1start("");
          setShift1end("");
          setStartTimeOt1("");
          setEndTimeOt1("");
          setShift2start("");
          setShift2end("");
          setStartTimeOt2("");
          setEndTimeOt2("");
          setShift3start("");
          setShift3end("");
          setStartTimeOt3("");
          setEndTimeOt3("");
        }
      }
    });

    // workplaceWorkTime.map((item) => {
    //   // alert(item.shift);
    //   if (item.shift == "กะเช้า") {
    //     // alert(item.startTime);
    //     setShift1start(item.startTime);
    //     setShift1end(item.endTime);
    //     setStartTimeOt1(item.startTimeOT);
    //     setEndTimeOt1(item.endTimeOT);
    //   } else if (item.shift == "กะบ่าย") {
    //     setShift2start(item.startTime);
    //     setShift2end(item.endTime);
    //     setStartTimeOt2(item.startTimeOT);
    //     setEndTimeOt2(item.endTimeOT);
    //   } else if (item.shift == "กะดึก") {
    //     setShift3start(item.startTime);
    //     setShift3end(item.endTime);
    //     setStartTimeOt3(item.startTimeOT);
    //     setEndTimeOt3(item.endTimeOT);
    //   }
    // });

    await setShift("");
    await setShift("morning");

    try {
      const response = await axios.post(endpoint + "/timerecord/search", data);

      if (response.data.recordworkplace.length < 1) {
        // alert('ไม่พบข้อมูล');
        // Set the state to false if no data is found
        setUpdateButton(false);
        setTimeRecord_id("");
        setRowDataList([]);
      } else {
        // Set the state to true if data is found
        await setUpdateButton(true);
        await setTimeRecord_id(response.data.recordworkplace[0]._id);
        await setWGroup(response.data.recordworkplace[0].wGroup || '');
        if (workplaceName != "") {
          await setRowDataList(response.data.recordworkplace[0].employeeRecord);
        } else {
          await setRowDataList([]);
        }

        // alert(JSON.stringify( rowDataList[0] ) );
        //count work of time and set to table
        // for (let i = 0; i < response.data.recordworkplace[0].employeeRecord.length; i++) {
        // alert(response.data.recordworkplace[0].employeeRecord[i].shift );
        // handleFieldChange(i, 'shift', response.data.recordworkplace[0].employeeRecord[i].shift);
        // }
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
      alert(error.message);
      window.location.reload();
    }
  }

  async function handleCreateWorkplaceTimerecord(event) {
    setLoading(true); // Set loading to true to block the button

    // event.preventDefault();
    // alert('test');
    // alert(formattedWorkDate);

    const dateObject = new Date(formattedWorkDate);

    // Extract the year from the dateObject
    const year = dateObject.getFullYear();
    //get data from input in useState to data
    const date = new Date(selectedDate);

    // Extract day, month, and year
    const daySelectedDate = date.getDate().toString().padStart(2, "0");
    const monthSelectedDate = (date.getMonth() + 1).toString().padStart(2, "0");
    const yearSelectedDate = date.getFullYear().toString();
    const data = {
      workplaceId: workplaceId,
      workplaceName: workplaceName,
      date: convertBuddhistToGregorian(formattedDate),
      employeeRecord: rowDataList,
      timerecordId: yearSelectedDate.toString(),
    };

    //check create or update Employee
    // if (newWorkplace) {
    // alert('Create Workplace');
    try {
      const response = await axios.post(endpoint + "/timerecord/create", data);
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");
        // window.location.reload();
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // window.location.reload();
    } finally {
      setLoading(false); // Set loading to false to unblock the button
    }
    // } else {
    //update workplace data

    // Make the API call to update the resource by ID
    //         try {

    //             const response = await axios.put(endpoint + '/workplace/update/' + _id, data);
    //             // setEmployeesResult(response.data.employees);
    //             if (response) {
    //                 alert("บันทึกสำเร็จ");
    //                 window.location.reload();

    //             }
    //         } catch (error) {
    //             alert('กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล');
    //             // window.location.reload();
    //         }

    //     }
  }

  async function handleUpdateWorkplaceTimerecord(event) {
    event.preventDefault();
    // alert('hi');
    //get data from input in useState to data

    const data = {
      workplaceId: workplaceId,
      workplaceName: workplaceName,
      date: convertBuddhistToGregorian(formattedDate),
      employeeRecord: rowDataList,
    };

    try {
      const response = await axios.put(
        endpoint + "/timerecord/update/" + timeRecord_id,
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");
        // window.location.reload();
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // window.location.reload();
    }
  }

  async function handleManageWorkplace(event) {
    event.preventDefault();

    const newRowData = {
      staffId: staffId || "",
      staffName: staffName + " " + staffLastname || "",
      shift: shift || "",
      startTime: startTime || "",
      endTime: endTime || "",
      allTime: allTime || "",
      otTime: otTime || "",
      selectotTime: selectotTime || "",
      selectotTimeOut: selectotTimeOut || "",
      cashSalary: cashSalary || "",
      specialtSalary: specialtSalary || "",
      specialtSalaryOT: specialtSalaryOT || "",

      messageSalary: messageSalary || "",
    };

    addRow(newRowData);

    //clean form
    setStaffId("");
    // setShift('');
    setStaffName("");
    setStaffLastname("");
    setStaffFullName("");
    // setStartTime('');
    // setEndTime('');
    // setAllTime('');
    // setOtTime('');
    // setSelectotTime('');
    // setSelectotTimeOut('');
    setCashSalary(!cashSalary);
    setSpecialtSalary("");
    setSpecialtSalaryOT("");
    setMessageSalary("");
    setCashSalary(""); // Toggle the checkbox state
    setShift("morning_shift");

    // alert(rowDataList.length);
  }

  const [showInputs, setShowInputs] = useState(false);

  const handleShiftChange = (e) => {
    const selectedShift = e.target.value;
    setShift(selectedShift);

    // Show the inputs when "specialt_shift" is selected
    if (selectedShift === "specialt_shift") {
      setShowInputs(true);
    } else {
      setShowInputs(false);
    }
  };
  useEffect(() => {
    //Search Employee  by id
    if (staffId != "") {
      const employeesearch = employeeList.find(
        (employee) => employee.employeeId === staffId
      );
      if (employeesearch) {
        setStaffName(employeesearch.name);
      } else {
        setStaffName("");
      }
    }
  }, [staffId]);

  /////////////////
  const [selectedOption, setSelectedOption] = useState("agencytime");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitForm1 = (event) => {
    event.preventDefault();
    // Handle submission for Form 1
  };

  const handleStaffIdChange = (e) => {
    const selectedStaffId = e.target.value;
    setStaffId(selectedStaffId);

    // Find the corresponding employee and set the staffName
    const selectedEmployee = employeeList.find(
      (employee) => employee.employeeId === selectedStaffId
    );
    if (selectedEmployee) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setStaffFullName(selectedEmployee.name + " " + selectedEmployee.lastName);
    } else {
      setStaffName("");
      setStaffFullName("");
    }
  };

  const handleStaffNameChange = (e) => {
    const selectedStaffName = e.target.value;

    // Find the corresponding employee and set the staffId
    const selectedEmployee = employeeList.find(
      (employee) =>
        employee.name + " " + employee.lastName === selectedStaffName
    );
    if (selectedEmployee) {
      setStaffId(selectedEmployee.employeeId);
    } else {
      setStaffId("");
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
  };

  return (
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
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="searchWorkplaceId">รหัสหน่วยงาน</label>
                            {/* <input
                              type="text"
                              class="form-control"
                              id="searchWorkplaceId"
                              placeholder="รหัสหน่วยงาน"
                              value={searchWorkplaceId}
                              onInput={(e) => {
                                // Remove any non-digit characters
                                e.target.value = e.target.value.replace(/\D/g, "");
                              }}
                              onChange={(e) =>
                                setSearchWorkplaceId(e.target.value)
                              }
                            />  */}
                            <input
                              type="text"
                              className="form-control"
                              id="searchWorkplaceId"
                              placeholder="รหัสหน่วยงาน"
                              value={searchWorkplaceId}
                              list="workplaceIdList"
                              onInput={(e) => {
                                // Remove any non-digit characters
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                              }}
                              onChange={(e) => {
                                setSearchWorkplaceId(e.target.value);
                                // Auto-fill searchWorkplaceName based on the selected workplaceId
                                const selectedWorkplace = workplaceList.find(
                                  (workplace) =>
                                    workplace.workplaceId === e.target.value
                                );
                                if (selectedWorkplace) {
                                  setSearchWorkplaceName(
                                    selectedWorkplace.workplaceName
                                  );
                                }
                              }}
                            />
                            <datalist id="workplaceIdList">
                              {workplaceList.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceId}
                                >
                                  {workplace.workplaceName}
                                </option>
                              ))}
                            </datalist>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="searchWorkplaceName">
                              ชื่อหน่วยงาน
                            </label>
                            {/* <input
                              type="text"
                              class="form-control"
                              id="searchWorkplaceName"
                              placeholder="ชื่อหน่วยงาน"
                              value={searchWorkplaceName}
                              onChange={(e) =>
                                setSearchWorkplaceName(e.target.value)
                              }
                            /> */}
                            <input
                              type="text"
                              className="form-control"
                              id="searchWorkplaceName"
                              placeholder="ชื่อหน่วยงาน"
                              value={searchWorkplaceName}
                              list="workplaceNameList"
                              onChange={(e) => {
                                setSearchWorkplaceName(e.target.value);
                                // Auto-fill searchWorkplaceId based on the selected workplaceName
                                const selectedWorkplace = workplaceList.find(
                                  (workplace) =>
                                    workplace.workplaceName === e.target.value
                                );
                                if (selectedWorkplace) {
                                  setSearchWorkplaceId(
                                    selectedWorkplace.workplaceId
                                  );
                                }
                              }}
                            />
                            <datalist id="workplaceNameList">
                              {workplaceList.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceName}
                                >
                                  {workplace.workplaceId}
                                </option>
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
                      <h2 class="title">
                        ผลลัพธ์ {searchResult.length} รายการ
                      </h2>
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
                </section>
                {/* <!--Frame--> */}
              </div>
            </div>
            <form onSubmit={handleManageWorkplace}>
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label role="agencynumber">รหัสหน่วยงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencynumber"
                      placeholder="รหัสหน่วยงาน"
                      value={workplaceId}
                      onChange={(e) => setWorkplaceId(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label role="agencyname">ชื่อหน่วยงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencyname"
                      placeholder="ชื่อหน่วยงาน"
                      value={workplaceName}
                      onChange={(e) => setWorkplaceName(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div class="col-md-2">
                <div class="form-group">
                    <label role="agencynumber">กลุ่มงาน</label>
                    
                    <select
                      className="form-control"
                      value={wGroup}
                      onChange={(e) => setWGroup(e.target.value)}
                      style={{ width: "10rem" }}
                    >
                      <option value="">หน่วยงานหลัก</option>

                      {groupOptions1 && groupOptions1.map((item) => (
      <option key={item.workplaceComplexId} value={item.workplaceComplexId}>
        {item.workplaceComplexName}
      </option>
    ))}
                    </select>
                    </div>
                  </div> 

                <div class="col-md-2">
                  <div class="form-group">
                    <label role="datetime">วันที่</label>
                    {/* <div style=
                                            {{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                            <DatePicker
                                                className="form-control"
                                                selected={selectedThaiDate}
                                                onChange={handleThaiDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                locale={th}
                                            />
                                        </div> */}
                    <div
                      onClick={toggleDatePicker}
                      style={{
                        position: "relative",
                        zIndex: 9999,
                        marginLeft: "0rem",
                      }}
                    >
                      <FaCalendarAlt size={20} />
                      <span style={{ marginLeft: "8px" }}>
                        {formattedDate ? formattedDate : "Select Date"}
                      </span>
                    </div>

                    {showDatePicker && (
                      <div style={{ position: "absolute", zIndex: 1000 }}>
                        <ThaiDatePicker
                          className="form-control"
                          value={selectedDate}
                          onChange={handleDatePickerChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div class="col-md-3">
                  <label role="button"></label>
                  <div class="d-flex align-items-end">
                    <button class="btn b_save" onClick={handleCheckTimerecord}>
                      <i class="nav-icon fas fa-search"></i> &nbsp; ตรวจสอบ
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <form onSubmit={handleManageWorkplace}>
              <section class="Frame">
                <div class="row">
                  <div class="col-md-2">
                    <div class="form-group">
                      <label role="staffId">รหัสพนักงาน</label>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="form-group">
                      <label role="staffName">ชื่อพนักงาน</label>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="form-group">
                      <label role="shift">กะการทำงาน</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="startTime">เวลาเข้างาน</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="endTime">เวลาออกงาน</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="allTime">ชั่วโมงทำงาน</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="selectotTime">เวลาเข้า OT</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="selectotTimeOut">เวลาออก OT</label>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      <label role="otTime">ชั่วโมง OT</label>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="staffId"
                        placeholder="รหัสพนักงาน"
                        value={staffId}
                        onChange={handleStaffIdChange}
                        list="staffIdList"
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
                  <div className="col-md-2">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="staffName"
                        placeholder="ชื่อพนักงาน"
                        value={staffFullName}
                        onChange={handleStaffNameChange}
                        list="staffNameList"
                      />
                      <datalist id="staffNameList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.name + " " + employee.lastName}
                          />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  {/* <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id="staffId" placeholder="รหัสพนักงาน" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="text" class="form-control" id="staffName" placeholder="ชื่อพนักงาน" value={(staffName + " " + staffLastname)} onChange={(e) => setStaffName(e.target.value)} />
                                        </div>
                                    </div> */}
                  <div class="col-md-2">
                    <div class="form-group">
                      {/* <label role="shift">กะการทำงาน</label> */}
                      {/* <select className="form-control" value={shift} onChange={(e) => setShift(e.target.value)}  > */}
                      {/* <select className="form-control" value={shift} onChange={(e) => handleShiftChange(e.target.value)}> */}
                      <select
                        className="form-control"
                        value={shift}
                        onChange={handleShiftChange}
                      >
                        {/* <option value="">เลือกกะการทำงาน</option> */}
                        <option value="morning_shift">กะเช้า</option>
                        <option value="afternoon_shift">กะบ่าย</option>
                        <option value="night_shift">กะดึก</option>
                        <option value="specialt_shift">กะพิเศษ</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="startTime">เวลาเข้างาน</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="startTime"
                        placeholder="เวลาเข้างาน"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
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
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="endTime">เวลาออกงาน</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="endTime"
                        placeholder="เวลาออกงาน"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
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
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="allTime">ชั่วโมงทำงาน</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="allTime"
                        placeholder="ชั่วโมงทำงาน"
                        value={allTime}
                        onChange={(e) => setAllTime(e.target.value)}
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
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="selectotTime">เวลาเข้า OT</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="selectotTime"
                        placeholder="เวลาเข้า OT"
                        value={selectotTime}
                        onChange={(e) => setSelectotTime(e.target.value)}
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
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="selectotTimeOut">เวลาออก OT</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="selectotTimeOut"
                        placeholder="เวลาออก OT"
                        value={selectotTimeOut}
                        onChange={(e) => setSelectotTimeOut(e.target.value)}
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
                  <div class="col-md-1">
                    <div class="form-group">
                      {/* <label role="otTime">ชั่วโมง OT</label> */}
                      <input
                        type="text"
                        class="form-control"
                        id="otTime"
                        placeholder="ชั่วโมง OT"
                        value={otTime}
                        onChange={(e) => setOtTime(e.target.value)}
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
                {showInputs && shift === "specialt_shift" && (
                  <div>
                    <div class="row">
                      <div class="col-md-1">
                        <label>จ่ายสด</label>
                      </div>
                      <div class="col-md-2">
                        <label role="specialtSalary">เป็นเงิน</label>
                      </div>
                      <div class="col-md-2">
                        <label role="specialtSalaryOT">เป็นเงินOT</label>
                      </div>
                      <div class="col-md-2">
                        <label role="messageSalary">หมายเหตุ</label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-1">
                        <input
                          type="checkbox"
                          class="form-control"
                          checked={cashSalary}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div class="col-md-2">
                        <input
                          type="text"
                          class="form-control"
                          id="specialtSalary"
                          placeholder="เป็นเงิน"
                          value={specialtSalary}
                          onChange={(e) => setSpecialtSalary(e.target.value)}
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
                        <input
                          type="text"
                          class="form-control"
                          id="specialtSalaryOT"
                          placeholder="เป็นเงิน"
                          value={specialtSalaryOT}
                          onChange={(e) => setSpecialtSalaryOT(e.target.value)}
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
                        <input
                          type="text"
                          class="form-control"
                          id="messageSalary"
                          placeholder="หมายเหตุ"
                          value={messageSalary}
                          onChange={(e) => setMessageSalary(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <div class="form-group">
                <button class="btn b_save">
                  <i class="fas fa-check"></i> &nbsp; เพิ่ม
                </button>
              </div>
            </form>

            <form onSubmit={handleManageWorkplace}>
              <section class="Frame">
                <div class="row">
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-1"> รหัสพนักงาน </div>
                      <div class="col-md-2"> ชื่อพนักงาน </div>
                      <div class="col-md-1"> กะการทำงาน </div>
                      <div class="col-md-1"> เวลาเข้างาน </div>
                      <div class="col-md-1"> เวลาออกงาน </div>
                      <div class="col-md-1"> ชั่วโมงทำงาน </div>
                      <div class="col-md-1"> เวลาเข้า OT </div>
                      <div class="col-md-1"> เวลาออก OT</div>
                      <div class="col-md-1"> ชั่วโมง OT</div>
                      <div class="col-md-1"> จ่ายเงินสด</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    {rowDataList.map(
                      (rowData, index) =>
                        rowData.staffId !== "" && ( // Check if staffId is set (truthy)
                          <div key={index}>
                            <div
                              class="row"
                              style={{
                                marginBottom: "1rem",
                                borderBottom: "2px solid #000",
                              }}
                            >
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.staffId}{" "}
                              </div>
                              <div class="col-md-2" style={bordertable}>
                                {" "}
                                {rowData.staffName}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {rowData.shift === "morning_shift" ? (
                                  <p>กะเช้า</p>
                                ) : rowData.shift === "afternoon_shift" ? (
                                  <p>กะบ่าย</p>
                                ) : rowData.shift === "night_shift" ? (
                                  <p>กะดึก</p>
                                ) : rowData.shift === "specialt_shift" ? (
                                  <p>กะพิเศษ</p>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.startTime}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.endTime}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.allTime}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.selectotTime}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.selectotTimeOut}{" "}
                              </div>
                              <div class="col-md-1" style={bordertable}>
                                {" "}
                                {rowData.otTime}{" "}
                              </div>

                              {rowData.cashSalary === "true" ||
                              rowData.cashSalary === true ? (
                                <div class="col-md-1" style={bordertable}>
                                  {rowData.specialtSalary} บาท
                                </div>
                              ) : (
                                <div class="col-md-1"></div>
                              )}

                              <div class="col-md-1" style={bordertable}>
                                {/* <button onClick={() => handleEditRow(index)}>Edit</button> */}
                                <button
                                  class="btn btn-xs btn-danger"
                                  style={{ padding: "0.3rem ", width: "8rem" }}
                                  onClick={() => handleDeleteRow(index)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </section>

              <div class="form-group">
                {/* <button class="btn b_save" onClick={handleCreateWorkplaceTimerecord}><i class="nav-icon fas fa-save"></i> &nbsp; บันทึก</button> */}
                {updateButton ? (
                  <button
                    class="btn b_save"
                    disabled={loading} // Disable the button if loading is true
                    onClick={handleUpdateWorkplaceTimerecord}
                  >
                    <i class="nav-icon fas fa-save"></i> &nbsp; อัพเดท
                  </button>
                ) : (
                  <button
                    class="btn b_save"
                    disabled={loading} // Disable the button if loading is true
                    onClick={handleCreateWorkplaceTimerecord}
                  >
                    <i class="nav-icon fas fa-save"></i> &nbsp; บันทึก
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}
    </section>
  );
}

export default AddsettimeWorkplace;
