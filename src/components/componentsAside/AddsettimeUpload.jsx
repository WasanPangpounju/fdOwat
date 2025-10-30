import endpoint from "../../config";
import { json, Link } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";

function AddsettimeUpload({ workplaceList }) {
  //file upload
  const [file, setFile] = useState(null);

  const [isDataTrue, setIsDataTrue] = useState(false);
  const linkRef = useRef(null);

  // Effect to auto-click the Link when data is true
  useEffect(() => {
    if (isDataTrue) {
      linkRef.current.click(); // Programmatically click the link when isDataTrue is true
    }
  }, [isDataTrue]);

  const bordertable = {
    borderLeft: "2px solid #000",
  };

  // console.log("workplaceList", workplaceList);
  const [cashSalary, setCashSalary] = useState(false);
  const [specialtSalary, setSpecialtSalary] = useState("");
  const [specialtSalaryOT, setSpecialtSalaryOT] = useState("");

  const [messageSalary, setMessageSalary] = useState("");

  const handleCheckboxChange = () => {
    setCashSalary(!cashSalary); // Toggle the checkbox state
  };

  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [updateButton, setUpdateButton] = useState(false); // Initially, set to false
  const [timeRecord_id, setTimeRecord_id] = useState("");

  const [newWorkplace, setNewWorkplace] = useState(true);

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);

    const savedEmployeeId = localStorage.getItem("employeeId");
    const savedName = localStorage.getItem("name");
    const savedLastName = localStorage.getItem("lastName");
    const savedMonth = localStorage.getItem("month");
    const savedYear = localStorage.getItem("year");
    if (savedEmployeeId) {
      setSearchEmployeeId(savedEmployeeId);
      setEmployeeId(savedEmployeeId);
      // const event = new Event('submit'); // Creating a synthetic event object
      // handleSearch(event); // Call handleSearch with the event
      localStorage.removeItem("employeeId");
    }
    if (savedName) {
      setName(savedName);
      localStorage.removeItem("name");
    }
    if (savedLastName) {
      setLastname(savedLastName);
      localStorage.removeItem("lastName");
    }
    if (savedMonth) {
      setMonth(savedMonth);
      localStorage.removeItem("month");
    }
    if (savedYear) {
      setYear(savedYear);
      localStorage.removeItem("year");
    }
  }, []); // Run this effect only once on component mount

  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  useEffect(() => {
    if (name !== "") {
      setCheckaddData("");

      handleCheckTimerecord();
    }
  }, [month, year]);

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

  const [checkaddData, setCheckaddData] = useState("");

  //Workplace data
  const [employeeId, setEmployeeId] = useState(""); //รหัสหน่วยงาน
  const [name, setName] = useState(""); //ชื่อหน่วยงาน
  const [lastName, setLastname] = useState(""); //ชื่อหน่วยงาน
  const [workplacestay, setWorkplacestay] = useState(""); //สังกัด
  const [workplaceArea, setWorkplaceArea] = useState(""); //สถานที่ปฏิบัติงาน
  const [workOfWeek, setWorkOfWeek] = useState(""); //วันทำงานต่อสัปดาห์
  const [workStart1, setWorkStart1] = useState(""); //เวลาเริ่มกะเช้า
  const [workEnd1, setWorkEnd1] = useState(""); //เวลาออกกะเช้า
  const [workStart2, setWorkStart2] = useState(""); //เวลาเข้ากะบ่าย
  const [workEnd2, setWorkEnd2] = useState(""); //เวลาออกกะบ่าย
  const [workStart3, setWorkStart3] = useState(""); //เวลาเข้ากะเย็น
  const [workEnd3, setWorkEnd3] = useState(""); //เวลาออกกะเย็น
  const [workOfHour, setWorkOfHour] = useState(""); //ชั่วโมงทำงานต่อสัปดาห์
  const [workOfOT, setWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์

  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [workTotalPeople, setWorkTotalPeople] = useState(""); //จำนวนคนในหน่วยงาน
  const [workRateDayoff, setWorkRateDayoff] = useState(""); //ค่าจ้างวันหยุด ต่อวัน
  const [workRateDayoffHour, setWorkRateDayoffHour] = useState(""); //ค่าจ้างวันหยุดต่อชั่วโมง
  const [workplaceAddress, setWorkplaceAddress] = useState(""); //ที่อยู่หน่วยงาน
  const [department, setDepartment] = useState("");

  //////////////////////////////
  const [employeeList, setEmployeeList] = useState([]);
  // const [workplaceList, setWorkplaceList] = useState([]);

  const [fileName, setFileName] = useState("เลือกไฟล์");

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name to display in the label
      setFile(e.target.files[0]);
    } else {
      alert("กรุณาเลือกไฟล์ลงเวลา");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(endpoint + "/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
      // If upload is successful, alert success
      if (response.status === 200) {
        alert("Upload ไฟล์สำเร็จ");
        window.location.reload(); // Reload the page to reset the form and state
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/employee/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setEmployeeList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  console.log(employeeList);

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/workplace/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setWorkplaceList(data);
  //       // alert(data[0].workplaceName);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []); // The empty array [] ensures that the effect runs only once after the initial render

  // console.log(workplaceList);

  //search employee name by employeeId
  // console.log(workplaceList);
  // console.log(workplaceList);

  /////////////////////////////////////////////
  const [tmpIndex, setTmpIndex] = useState(0);
  const [wId, setWId] = useState("");
  const [wName, setWName] = useState("");
  const [wDate, setWDate] = useState("");
  const [wShift, setWShift] = useState("morning_shift");
  const [wStartTime, setWStartTime] = useState("");
  const [wEndTime, setWEndTime] = useState("");
  const [wAllTime, setWAllTime] = useState("");
  const [wOtTime, setWOtTime] = useState("");
  const [wSelectOtTime, setWSelectOtTime] = useState("");
  const [wSelectOtTimeout, setWSelectOtTimeout] = useState("");

  // Get the number of days in the specified month
  const numberOfDaysInMonth = new Date(2024, 2, 0).getDate();

  // Create an array containing numbers from 1 to the number of days in the month
  const daysOfMonth = Array.from(
    { length: numberOfDaysInMonth },
    (_, index) => index + 1
  );

  // Create an array containing the day of the week (0 to 6) for each day in the month
  const daysOfWeek = daysOfMonth.map((day) => {
    const dayOfWeek = new Date(2024, 2, day).getDay();
    return dayOfWeek;
  });
  //cczz
  // This useEffect listens for changes in wShift

  function calTime(start, end, limit) {
    const startHours = parseFloat(start.split(".")[0]);
    const startMinutes = parseFloat(start.split(".")[1] || 0);
    const endHours = parseFloat(end.split(".")[0]);
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

    // Check if employee worked >= 5 hours and subtract 1 hour
    if (hours >= 5) {
      hours -= 1;
    }

    // Calculate the total time difference in minutes
    const totalMinutes = hours * 60 + minutes;

    // Cap the time difference at the maximum work hours
    const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);

    // Convert the capped time difference back to hours and minutes
    const cappedHours = Math.floor(cappedTotalMinutes / 60);
    const cappedMinutes = cappedTotalMinutes % 60;

    // Check if the original total minutes exceed the limit
    if (totalMinutes > limit * 60) {
      const limitTotalMinutes = Math.round(limit * 60);
      const limitHours = Math.floor(limitTotalMinutes / 60);
      const limitMinutes = limitTotalMinutes % 60;
      return `${limitHours}.${limitMinutes.toString().padStart(2, "0")}`;
    }

    const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;

    console.log("cappedHours", cappedHours);
    console.log("cappedMinutes", cappedMinutes);
    console.log("timeDiffFormatted", timeDiffFormatted);
    console.log("limit", limit);

    if (isNaN(timeDiffFormatted)) {
      return "0";
    }

    return timeDiffFormatted;
  }

  useEffect(() => {
    setWStartTime("");
    setWEndTime("");
    setWAllTime("");
    setWOtTime("");
    setWSelectOtTime("");
    setWSelectOtTimeout("");

    const timeOfWork = async () => {
      await setWStartTime("");
      await setWEndTime("");
      await setWAllTime("");
      await setWOtTime("");
      await setWSelectOtTime("");
      await setWSelectOtTimeout("");
      const workplaceUsed = await {};

      if (wId !== "" && wName !== "") {
        const workplacesearch = await workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          // alert('wId ' + wId);
          // alert(workplacesearch.workplaceGroup.length);

          //department: employee department process
          if (
            searchResult[0].workplace === wId &&
            searchResult[0].department !== "" &&
            workplacesearch.workplaceGroup.length > 0
          ) {
            // alert(searchResult[0].workplace );
            // alert(searchResult[0].department);
            // alert(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName );
            // let dep = workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName || '';

            // setWName(workplacesearch.workplaceName + ': ' + dep );
            // workplaceUsed = await workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexData;
            // alert(JSON.stringify(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexData) );

            //add work time with select day
            const dayMapping = await {
              อาทิตย์: 0,
              จันทร์: 1,
              อังคาร: 2,
              พุธ: 3,
              พฤหัส: 4,
              ศุกร์: 5,
              เสาร์: 6,
            };
            let date = await new Date(year, month - 1, wDate); // Subtract 1 from the month since months are zero-indexed
            let dayOfWeek = await date.getDay(); // This will give you the day of the week, where 0 is Sunday, 1 is

            await workplacesearch.workplaceGroup[
              parseInt(searchResult[0].department || 0) - 1
            ].workplaceComplexData.workTimeDay.map(async (item, index) => {
              //    alert(JSON.stringify(item.allTimes));
              // const morningTimes = await item.allTimes.filter(time => time.shift === "กะเช้า");
              // await alert(morningTimes[0].startTime );

              //case start day = end day
              if (
                dayMapping[item.startDay] == dayMapping[item.endDay] &&
                dayMapping[item.startDay] == dayOfWeek
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );

                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // setWStartTime("");
                    // setWEndTime("");
                    // setWAllTime(calTime("0", "0", "24") || "");
                    // setWOtTime(calTime("0", "0", "24") || "");
                    // setWSelectOtTime("");
                    // setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );

                    break;
                  default:
                    setWStartTime("");
                    setWEndTime("");
                    setWAllTime("");
                    setWOtTime("");
                    setWSelectOtTime("");
                    setWSelectOtTimeout("");
                }
              }

              //case start day < end day
              if (
                dayMapping[item.startDay] < dayMapping[item.endDay] &&
                dayOfWeek >= dayMapping[item.startDay] &&
                dayOfWeek <= dayMapping[item.endDay]
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    // await alert(morningTimes[0].startTime );
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // await setWAllTime(calTime("0", "0", "24") || "");

                    // await setWStartTime("");
                    // await setWEndTime("");
                    // await setWOtTime(calTime("0", "0", "24") || "");
                    // await setWSelectOtTime("");
                    // await setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );
                    break;
                  default:
                    await setWStartTime("");
                    await setWEndTime("");
                    await setWAllTime("");
                    await setWOtTime("");
                    await setWSelectOtTime("");
                    await setWSelectOtTimeout("");
                }
              }

              //case start day > end day
              if (
                dayMapping[item.startDay] > dayMapping[item.endDay] &&
                dayOfWeek >= dayMapping[item.startDay] &&
                dayOfWeek <= 6 &&
                dayOfWeek <= dayMapping[item.endDay] &&
                dayOfWeek >= 0
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    // await alert(morningTimes[0].startTime );
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // await setWAllTime(calTime("0", "0", "24") || "");

                    // await setWStartTime("");
                    // await setWEndTime("");
                    // await setWOtTime(calTime("0", "0", "24") || "");
                    // await setWSelectOtTime("");
                    // await setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );
                    break;
                  default:
                    await setWStartTime("");
                    await setWEndTime("");
                    await setWAllTime("");
                    await setWOtTime("");
                    await setWSelectOtTime("");
                    await setWSelectOtTimeout("");
                }
              }

              // alert(dayMapping[item.startDay] );
            });

            // workplacesearch = await tmp;
            // await alert(JSON.stringify(tmp));
          } else {
            console.log("");
            // setWName(workplacesearch.workplaceName);
            // workplaceUsed  = await workplacesearch;
            // alert(JSON.stringify('hi2') );

            //add work time with select day
            const dayMapping = await {
              อาทิตย์: 0,
              จันทร์: 1,
              อังคาร: 2,
              พุธ: 3,
              พฤหัส: 4,
              ศุกร์: 5,
              เสาร์: 6,
            };
            let date = await new Date(year, month - 1, wDate); // Subtract 1 from the month since months are zero-indexed
            let dayOfWeek = await date.getDay(); // This will give you the day of the week, where 0 is Sunday, 1 is

            // alert(JSON.stringify('hi') );

            await workplacesearch.workTimeDay.map(async (item, index) => {
              //    alert(JSON.stringify(item.allTimes));
              // const morningTimes = await item.allTimes.filter(time => time.shift === "กะเช้า");
              // await alert(morningTimes[0].startTime );

              //case start day = end day
              if (
                dayMapping[item.startDay] == dayMapping[item.endDay] &&
                dayMapping[item.startDay] == dayOfWeek
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );

                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // setWStartTime("");
                    // setWEndTime("");
                    // setWAllTime(calTime("0", "0", "24") || "");
                    // setWOtTime(calTime("0", "0", "24") || "");
                    // setWSelectOtTime("");
                    // setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );
                    break;
                  default:
                    setWStartTime("");
                    setWEndTime("");
                    setWAllTime("");
                    setWOtTime("");
                    setWSelectOtTime("");
                    setWSelectOtTimeout("");
                }
              }

              //case start day < end day
              if (
                dayMapping[item.startDay] < dayMapping[item.endDay] &&
                dayOfWeek >= dayMapping[item.startDay] &&
                dayOfWeek <= dayMapping[item.endDay]
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    // await alert(morningTimes[0].startTime );
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // await setWAllTime(calTime("0", "0", "24") || "");

                    // await setWStartTime("");
                    // await setWEndTime("");
                    // await setWOtTime(calTime("0", "0", "24") || "");
                    // await setWSelectOtTime("");
                    // await setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );
                    break;
                  default:
                    await setWStartTime("");
                    await setWEndTime("");
                    await setWAllTime("");
                    await setWOtTime("");
                    await setWSelectOtTime("");
                    await setWSelectOtTimeout("");
                }
              }

              //case start day > end day
              if (
                dayMapping[item.startDay] > dayMapping[item.endDay] &&
                dayOfWeek >= dayMapping[item.startDay] &&
                dayOfWeek <= 6 &&
                dayOfWeek <= dayMapping[item.endDay] &&
                dayOfWeek >= 0
              ) {
                switch (wShift) {
                  case "morning_shift":
                    const morningTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    // await alert(morningTimes[0].startTime );
                    await setWAllTime(
                      calTime(
                        morningTimes[0].startTime || "",
                        morningTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(morningTimes[0].startTime || "");
                    await setWEndTime(morningTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        morningTimes[0].startTimeOT || "",
                        morningTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(morningTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(morningTimes[0].endTimeOT || "");
                    break;
                  case "afternoon_shift":
                    const afternoonTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะบ่าย"
                    );
                    await setWAllTime(
                      calTime(
                        afternoonTimes[0].startTime || "",
                        afternoonTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(afternoonTimes[0].startTime || "");
                    await setWEndTime(afternoonTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        afternoonTimes[0].startTimeOT || "",
                        afternoonTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(afternoonTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      afternoonTimes[0].endTimeOT || ""
                    );

                    break;
                  case "night_shift":
                    const nightTimes = await item.allTimes.filter(
                      (time) => time.shift === "กะดึก"
                    );
                    await setWAllTime(
                      calTime(
                        nightTimes[0].startTime || "",
                        nightTimes[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );

                    await setWStartTime(nightTimes[0].startTime || "");
                    await setWEndTime(nightTimes[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        nightTimes[0].startTimeOT || "",
                        nightTimes[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(nightTimes[0].startTimeOT || "");
                    await setWSelectOtTimeout(nightTimes[0].endTimeOT || "");

                    break;
                  case "specialt_shift":
                    // await setWAllTime(calTime("0", "0", "24") || "");

                    // await setWStartTime("");
                    // await setWEndTime("");
                    // await setWOtTime(calTime("0", "0", "24") || "");
                    // await setWSelectOtTime("");
                    // await setWSelectOtTimeout("");
                    const specialt_shift = await item.allTimes.filter(
                      (time) => time.shift === "กะเช้า"
                    );
                    await setWAllTime(
                      calTime(
                        specialt_shift[0].startTime || "",
                        specialt_shift[0].endTime || "",
                        workplacesearch.workOfHour
                      ) || ""
                    );
                    await setWStartTime(specialt_shift[0].startTime || "");
                    await setWEndTime(specialt_shift[0].endTime || "");
                    await setWOtTime(
                      calTime(
                        specialt_shift[0].startTimeOT || "",
                        specialt_shift[0].endTimeOT || "",
                        workplacesearch.workOfOT || ""
                      ) || ""
                    );
                    await setWSelectOtTime(specialt_shift[0].startTimeOT || "");
                    await setWSelectOtTimeout(
                      specialt_shift[0].endTimeOT || ""
                    );
                    break;
                  default:
                    await setWStartTime("");
                    await setWEndTime("");
                    await setWAllTime("");
                    await setWOtTime("");
                    await setWSelectOtTime("");
                    await setWSelectOtTimeout("");
                }
              }

              // alert(dayMapping[item.startDay] );
            });
          }
          // await alert(dayOfWeek )
          //                     await alert(wDate);
          //                     await alert(JSON.stringify(workplacesearch.workTimeDay, null,2))
        }
      }
    };

    timeOfWork();
  }, [wShift, wDate]);

  //calculate time of work
  useEffect(() => {
    if (wStartTime !== "" && wEndTime !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          setWAllTime(
            calTime(
              wStartTime || "",
              wEndTime || "",
              workplacesearch.workOfHour || ""
            )
          );
          if (wShift == "specialt_shift") {
            setWAllTime(calTime(wStartTime || "", wEndTime || "", 24));
          } else {
            setWAllTime(
              calTime(
                wStartTime || "",
                wEndTime || "",
                workplacesearch.workOfHour || ""
              )
            );
          }
        }
      }
    } else {
      setWAllTime(0);
    }
  }, [wStartTime, wEndTime]);

  useEffect(() => {
    if (wSelectOtTime !== "" && wSelectOtTimeout !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          if (wShift == "specialt_shift") {
            setWOtTime(
              calTime(wSelectOtTime || "", wSelectOtTimeout || "", 24)
            );
          } else {
            setWOtTime(
              calTime(
                wSelectOtTime || "",
                wSelectOtTimeout || "",
                workplacesearch.workOfOT || ""
              )
            );
          }
        }
      }
    } else {
      setWOtTime(0);
    }
  }, [wSelectOtTime, wSelectOtTimeout]);

  // search employee Name by employeeId

  useEffect(() => {
    if (wId !== "") {
      const workplacesearch = workplaceList.find(
        (workplace) => workplace.workplaceId === wId
      );
      if (workplacesearch) {
        //department: employee department process
        if (
          searchResult[0].workplace === wId &&
          searchResult[0].department !== "" &&
          workplacesearch.workplaceGroup.length > 0
        ) {
          // alert(searchResult[0].workplace );
          // alert(searchResult[0].department);
          // alert(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName );
          let dep =
            workplacesearch.workplaceGroup[
              parseInt(searchResult[0].department || 0) - 1
            ].workplaceComplexName || "";

          setWName(workplacesearch.workplaceName + ": " + dep);

          setWName(workplacesearch.workplaceName + ": " + dep);
        } else {
          setWName(workplacesearch.workplaceName);
        }

        // Optional: Add work time to selection (as per your comment)
        // alert(JSON.stringify(workplacesearch.workTimeDay, null, 2));
      } else {
        setWName("");
      }
    }
  }, [wId]);

  //search employeeId by employeeName
  // useEffect(() => {
  //     //Search Employee  by name
  //     if (wName != '') {
  //         const workplacesearch = workplaceList.find(workplace => workplace.workplaceName === wName);
  //         if (workplacesearch) {
  //             setWId(workplacesearch.workplaceId);
  //         } else {
  //             setWId('');
  //         }
  //         console.log(workplacesearch);

  //     }
  // }, [wName]);

  // const numberOfRows2 = 30; // Fixed number of rows
  const numberOfRows2 = 1; // Fixed number of rows

  const initialRowData2 = {
    workplaceId: "",
    workplaceName: "",
    date: "", // Use null as initial value for DatePicker
    shift: "morning_shift",
    startTime: "",
    endTime: "",
    allTime: "",
    otTime: "",
    selectotTime: "",
    selectotTimeOut: "",
    cashSalary: "",
    specialtSalary: "",
    specialtSalaryOT: "",
    messageSalary: "",
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

      //Search workplace by id
      if (fieldName2 == "workplaceId") {
        const workplaceIdSearch = workplaceList.find(
          (workplace) => workplace.workplaceId === value
        );
        //                 alert(JSON.stringify(workplaceList, null, 2));
        // alert( workplaceList.length);
        if (workplaceIdSearch) {
          //   setEmployeeName(employee.name);
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceName"]: workplaceIdSearch.workplaceName + "",
            ["shift"]: "morning_shift",
            ["startTime"]: workplaceIdSearch.workStart1 + "",
            ["endTime"]: workplaceIdSearch.workEnd1 + "",
            ["allTime"]: workplaceIdSearch.workOfHour + "",
            ["otTime"]: workplaceIdSearch.workOfOT + "",
            ["selectotTime"]: workplaceIdSearch.workStartOt1 + "",
            ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 + "",
          };
        } else {
          //   setEmployeeName('Employee not found');
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceName"]: "ไม่พบชื่อหน่วยงาน",
          };
        }
      }

      //Search workplace by name
      if (fieldName2 == "workplaceName") {
        const workplaceNameSearch = workplaceList.find(
          (workplace) => workplace.workplaceName === value
        );
        //                 alert(JSON.stringify(workplaceList, null, 2));
        // alert( workplaceList.length);
        if (workplaceNameSearch) {
          //   setEmployeeName(employee.name);
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: workplaceNameSearch.workplaceId + "",
          };
        } else {
          //   setEmployeeName('Employee not found');
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: "ไม่พบรหัสหน่วยงาน",
          };
        }
      }

      //Select shift then set time of work
      if (fieldName2 == "shift") {
        // alert(value);
        //Check Selected workplace by workplaceId is notnull
        if (newDataList2[index2].workplaceId !== "") {
          // alert(newDataList2[index2].workplaceId );
          //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
          const workplaceIdSearch = workplaceList.find(
            (workplace) =>
              workplace.workplaceId === newDataList2[index2].workplaceId
          );
          if (workplaceIdSearch) {
            //check shift by switch case
            switch (value) {
              case "morning_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart1 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd1 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart1 || "",
                      workplaceIdSearch.workEnd1 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt1 || "",
                      workplaceIdSearch.workEndOt1 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt1 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 || "" + "",
                };
                break;
              case "afternoon_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart2 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd2 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart2 || "",
                      workplaceIdSearch.workEnd2 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt2 || "",
                      workplaceIdSearch.workEndOt2 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt2 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt2 || "" + "",
                };
                break;
              case "night_shift":
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart3 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd3 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart3 || "",
                      workplaceIdSearch.workEnd3 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt3 || "",
                      workplaceIdSearch.workEndOt3 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt3 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt3 || "" + "",
                };
                break;
              case "specialt_shift":
                // newDataList2[index2] = {
                //   ...newDataList2[index2],
                //   ["startTime"]: "" + "",
                //   ["endTime"]: "" + "",
                //   ["allTime"]: calTime("0", "0", "24") || "" + "",
                //   ["otTime"]: calTime("0", "0", "24") || "" + "",
                //   ["selectotTime"]: "" + "",
                //   ["selectotTimeOut"]: "" + "",
                // };
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: workplaceIdSearch.workStart1 || "" + "",
                  ["endTime"]: workplaceIdSearch.workEnd1 || "" + "",
                  ["allTime"]:
                    calTime(
                      workplaceIdSearch.workStart1 || "",
                      workplaceIdSearch.workEnd1 || "",
                      workplaceIdSearch.workOfHour || ""
                    ) || "" + "",
                  ["otTime"]:
                    calTime(
                      workplaceIdSearch.workStartOt1 || "",
                      workplaceIdSearch.workEndOt1 || "",
                      workplaceIdSearch.workOfOT || ""
                    ) || "" + "",
                  ["selectotTime"]: workplaceIdSearch.workStartOt1 || "" + "",
                  ["selectotTimeOut"]: workplaceIdSearch.workEndOt1 || "" + "",
                };
                break;
              default:
                newDataList2[index2] = {
                  ...newDataList2[index2],
                  ["startTime"]: "",
                  ["endTime"]: "",
                  ["allTime"]: "",
                  ["otTime"]: "",
                  ["selectotTime"]: "",
                  ["selectotTimeOut"]: "",
                };
            } //end switch
          }
        } else {
          //emty workplaceId
          newDataList2[index2] = {
            ...newDataList2[index2],
            ["workplaceId"]: "กรุณาระบุหน่วยงาน",
            ["workplaceName"]: "กรุณาระบุหน่วยงาน",
          };
        }
      }

      //update time of work
      if (
        fieldName2 == "startTime" ||
        fieldName2 == "endTime" ||
        fieldName2 == "selectotTime" ||
        fieldName2 == "selectotTimeOut"
      ) {
        //Check Selected workplace by workplaceId is notnull
        if (newDataList2[index2].workplaceId !== "") {
          // alert(newDataList2[index2].workplaceId );
          //get workplace data by  workplaceId from select workplace and search workplace then set worktime to row of table
          const workplaceIdSearch = workplaceList.find(
            (workplace) =>
              workplace.workplaceId === newDataList2[index2].workplaceId
          );
          if (workplaceIdSearch) {
            //check specialt_shift
            if (newDataList2[index2].shift !== "specialt_shift") {
              //     newDataList2[index2] = {
              //         ...newDataList2[index2],
              //         ['startTime']: newDataList2[index2].startTime + '',
              //         ['endTime']: newDataList2[index2].endTime + '',
              //         ['allTime']: calTime(newDataList2[index2].startTime, newDataList2[index2].endTime, workplaceIdSearch.workOfHour) + '',
              //         ['otTime']: calTime(newDataList2[index2].selectotTime, newDataList2[index2].selectotTimeOut, workplaceIdSearch.workOfOT) + '',
              //         ['selectotTime']: newDataList2[index2].selectotTime + '',
              //         ['selectotTimeOut']: newDataList2[index2].selectotTimeOut + '',
              //     };
              // }
              // else {
              newDataList2[index2] = {
                ...newDataList2[index2],
                ["startTime"]: newDataList2[index2].startTime + "",
                ["endTime"]: newDataList2[index2].endTime + "",
                ["allTime"]:
                  calTime(
                    newDataList2[index2].startTime,
                    newDataList2[index2].endTime,
                    24
                  ) + "",
                ["otTime"]:
                  calTime(
                    newDataList2[index2].selectotTime,
                    newDataList2[index2].selectotTimeOut,
                    24
                  ) + "",
                ["selectotTime"]: newDataList2[index2].selectotTime + "",
                ["selectotTimeOut"]: newDataList2[index2].selectotTimeOut + "",
              };
            }
          } else {
            //emty workplaceId
            newDataList2[index2] = {
              ...newDataList2[index2],
              ["workplaceId"]: "กรุณาระบุหน่วยงาน",
              ["workplaceName"]: "กรุณาระบุหน่วยงาน",
            };
          }
        }
      }

      return newDataList2;
    });
  };

  // function calTime(start, end, limit) {

  //     const startHours = parseFloat(start.split('.')[0]);
  //     const startMinutes = parseFloat(start.split('.')[1] || 0);
  //     const endHours = parseFloat(end.split('.')[0]);
  //     const endMinutes = parseFloat(end.split('.')[1] || 0);
  //     let hours = endHours - startHours;
  //     let minutes = endMinutes - startMinutes;
  //     if (minutes < 0) {
  //         hours -= 1;
  //         minutes += 60;
  //     }
  //     // Handle cases where endTime is on the next day
  //     if (hours < 0) {
  //         hours += 24;
  //     }
  //     //check employee working >= 5 hours
  //     if (hours >= 5) {
  //         hours -= 1;
  //     }

  //     // Calculate the total time difference in minutes
  //     const totalMinutes = hours * 60 + minutes;
  //     // check employee working > 5 hours
  //     // Cap the time difference at the maximum work hours
  //     const cappedTotalMinutes = Math.min(totalMinutes, limit * 60);
  //     // Convert the capped time difference back to hours and minutes
  //     const cappedHours = Math.floor(cappedTotalMinutes / 60);
  //     const cappedMinutes = cappedTotalMinutes % 60;
  //     const timeDiffFormatted = `${cappedHours}.${cappedMinutes}`;
  //     console.log('cappedHours', cappedHours);
  //     console.log('cappedMinutes', cappedMinutes);
  //     console.log('timeDiffFormatted', timeDiffFormatted);
  //     console.log('limit', limit);

  //     if (isNaN(timeDiffFormatted)) {
  //         return '0';
  //     }

  //     return timeDiffFormatted;
  // }

  const handleStartDateChange4 = (index2, date) => {
    alert(index2);
    handleFieldChange2(index2, "date", date);
  };

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

  async function handleSearch(event) {
    event.preventDefault();

    // get value from form search
    const data = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      idCard: "",
      workPlace: "",
    };
    // alert(data.name);
    try {
      const response = await axios.post(endpoint + "/employee/search", data);
      setSearchResult(response.data.employees);
      // alert(response.data.employees.length);
      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId("");
        setName("");
        setLastname("");
        alert("ไม่พบข้อมูล");
      } else {
        // alert(response.data.employees.length);

        //clean form
        // setSearchEmployeeId('');
        // setSearchEmployeeName('');

        // Set search values
        setEmployeeId(response.data.employees[0].employeeId);
        setName(response.data.employees[0].name);
        setLastname(response.data.employees[0].lastName);

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

  async function handleCheckTimerecord() {
    const data = {
      employeeId: employeeId,
      employeeName: name,
      month: month,
      timerecordId: year,
    };

    if (!checkaddData) {
      try {
        const response = await axios.post(
          endpoint + "/timerecord/searchemp",
          data
        );
        // alert(JSON.stringify(response ,null,2));

        if (response.data.recordworkplace.length < 1) {
          alert("ไม่พบข้อมูล");
          // Set the state to false if no data is found
          setUpdateButton(false);
          setTimeRecord_id("");
          setRowDataList2([]);
        } else {
          // Set the state to true if data is found
          setUpdateButton(true);
          // alert(response.data.recordworkplace[0].employee_workplaceRecord[1].workplaceId);
          setTimeRecord_id(response.data.recordworkplace[0]._id);

          // setRowDataList2(response.data.recordworkplace[0].employee_workplaceRecord);
          if (name != "") {
            // setRowDataList2(response.data.recordworkplace[0].employee_workplaceRecord);
            setRowDataList2(
              response.data.recordworkplace[0].employee_workplaceRecord.map(
                (item, index) => ({
                  ...item,
                  tmpIndex: index,
                })
              )
            );
            //111
          } else {
            setRowDataList2([]);
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
  }

  async function handleManageWorkplace(event) {
    event.preventDefault();
    //get data from input in useState to data

    const newRowData = await {
      tmpIndex: tmpIndex || "",
      timerecordId: year || "",
      workplaceId: wId || "",
      workplaceName: wName || "",
      date: wDate || "",
      shift: wShift || "",
      startTime: wStartTime || "",
      endTime: wEndTime || "",
      allTime: wAllTime || "",
      otTime: wOtTime || "",
      selectotTime: wSelectOtTime || "",
      selectotTimeOut: wSelectOtTimeout || "",
      cashSalary: cashSalary || "",
      specialtSalary: specialtSalary || "",
      specialtSalaryOT: specialtSalaryOT || "",

      messageSalary: messageSalary || "",
    };

    await addRow(newRowData);

    await setTmpIndex(tmpIndex + 1);
    // await setWId('');
    // await setWName('');
    // await setWStartTime('');
    // await setWEndTime('');
    // await setWAllTime('');
    // await setWOtTime('');
    // await setWSelectOtTime('');
    // await setWSelectOtTimeout('');
    // await setCashSalary("");
    // await setSpecialtSalary("");
    // await setSpecialtSalaryOT("");
    // await setMessageSalary("");
  }

  // Function to add a new row to the rowDataList with specific values
  //   const addRow = (newRowData) => {
  //     setCheckaddData(true);

  //     // Create a copy of the current state
  //     const newDataList = [...rowDataList2];
  //     // Push a new row with specific data
  //     // newDataList.push({ ...initialRowData, ...newRowData });
  //     newDataList.unshift(newRowData);
  //     // Update the state with the new data
  //     setRowDataList2(newDataList);
  //   };

  const addRow = (newRowData) => {
    setCheckaddData(true);

    // Create a copy of the current state
    const newDataList = [...rowDataList2];

    // Check for duplicates
    const isDuplicate = newDataList.some(
      (row) => row.date === newRowData.date && row.shift === newRowData.shift
    );

    if (isDuplicate) {
      alert("มีวันและกะที่ลงไว้แล้ว");
      return; // Exit the function to prevent adding the duplicate row
    }

    // Push a new row with specific data
    newDataList.unshift(newRowData);

    // Update the state with the new data
    setRowDataList2(newDataList);

    const currentDate = parseInt(wDate, 10);
    let nextDate = currentDate + 1;

    if (nextDate > 31) {
      nextDate = 1;
    }

    const formattedNextDate = nextDate.toString().padStart(2, "0");
    setWDate(formattedNextDate);
  };

  console.log("rowDataList2", rowDataList2);
  // Function to handle editing a row
  const handleEditRow = async (index) => {
    // You can implement the edit logic here, e.g., open a modal for editing
    // console.log('Edit row at index:', index);
    const tmp = await rowDataList2[index];
    // alert(tmp.staffId);
    await setWId(tmp.workplaceId);
    await setWName(tmp.workplaceName);
  };

  // Function to handle deleting a row
  const handleDeleteRow = (index) => {
    // Create a copy of the current state
    const newDataList = [...rowDataList2];
    // Remove the row at the specified index
    const updatedList = newDataList.filter((entry) => entry.tmpIndex !== index);
    // alert(index);
    // newDataList.splice(index, 1);
    // Update the state with the new data
    setRowDataList2(updatedList);
  };

  async function handleCreateWorkplaceTimerecord(event) {
    event.preventDefault();
    // alert('test');

    //get data from input in useState to data
    const data = {
      timerecordId: year,
      employeeId: employeeId,
      employeeName: name,
      month: month,
      employee_workplaceRecord: rowDataList2,
    };

    try {
      const response = await axios.post(
        endpoint + "/timerecord/createemp",
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // window.location.reload();
    }
  }

  async function handleUpdateWorkplaceTimerecord(event) {
    event.preventDefault();
    // alert('hi');
    //get data from input in useState to data

    const data = {
      timerecordId: year,
      employeeId: employeeId,
      employeeName: name,
      month: month,
      employee_workplaceRecord: rowDataList2,
    };

    try {
      const response = await axios.put(
        endpoint + "/timerecord/updateemp/" + timeRecord_id,
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");

        //get data from conclude data then check edit data
        const serchConclude = await {
          year: year,
          month: month,
          concludeDate: "",
          employeeId: searchEmployeeId,
          employeeName: searchEmployeeName,
        };

        try {
          const concludeResponse = await axios.post(
            endpoint + "/conclude/search",
            serchConclude
          );

          // await alert(JSON.stringify(concludeResponse ,null,2));
          if (concludeResponse.data.recordConclude.length < 1) {
            // await alert('conclude is null');
            window.location.reload();
          } else {
            // await alert('conclude is set');
            await localStorage.setItem("editConclude", searchEmployeeId);
            await localStorage.setItem("employeeId", searchEmployeeId);
            await localStorage.setItem("month", month);
            await localStorage.setItem("year", year);

            await setIsDataTrue(true); // Set isDataTrue based on fetched data
          }
        } catch (e) {
          console.log(e);
        }
        // window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // window.location.reload();
    }
  }

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
    setSearchEmployeeId(selectedStaffId);
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
      setSearchEmployeeName("");
    }
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
    } else {
      setStaffId("");
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedStaffName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  console.log("SearchEmployeeName", searchEmployeeName);
  console.log("SearchEmployeeId", searchEmployeeId);

  const handleWorkplaceIdChange = (value) => {
    setSearchWorkplaceId(value);

    // Find corresponding workplace name based on workplace ID
    const selectedWorkplace = workplaceList.find(
      (wp) => wp.workplaceId === value
    );
    if (selectedWorkplace) {
      setSearchWorkplaceName(selectedWorkplace.workplaceName);
    } else {
      setSearchWorkplaceName(""); // Clear if not found
    }
  };

  const handleWorkplaceNameChange = (value) => {
    setSearchWorkplaceName(value);

    // Find corresponding workplace ID based on workplace name
    const selectedWorkplace = workplaceList.find(
      (wp) => wp.workplaceName === value
    );
    if (selectedWorkplace) {
      setSearchWorkplaceId(selectedWorkplace.workplaceId);
    } else {
      setSearchWorkplaceId(""); // Clear if not found
    }
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
                            <input
                              type="text"
                              className="form-control"
                              id="searchWorkplaceId"
                              placeholder="รหัสหน่วยงาน"
                              value={searchWorkplaceId}
                              onChange={(e) =>
                                handleWorkplaceIdChange(e.target.value)
                              }
                              onInput={(e) => {
                                // Remove any non-digit characters
                                e.target.value = e.target.value.replace(/\D/g, "");
                              }}
                              list="workplaces"
                            />
                            <datalist id="workplaces">
                              <option value="">ยังไม่ระบุหน่วยงาน</option>
                              {workplaceList.map((wp) => (
                                <option key={wp._id} value={wp.workplaceId}>
                                  {wp.workplaceName}
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
                            <input
                              type="text"
                              className="form-control"
                              id="searchWorkplaceName"
                              placeholder="ชื่อหน่วยงาน"
                              value={searchWorkplaceName}
                              onChange={(e) =>
                                handleWorkplaceNameChange(e.target.value)
                              }
                            />
                            <datalist id="workplaces">
                              <option value="">ยังไม่ระบุหน่วยงาน</option>
                              {workplaceList.map((wp) => (
                                <option key={wp._id} value={wp.workplaceName}>
                                  {wp.workplaceId}
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
                  </div>
                </section>
                {/* <!--Frame--> */}
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <section class="Frame">
                  <form onSubmit={handleSubmit}>
                    <div class="row">
                      <div class="col-md-6">
                        <div className="custom-file">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            onChange={handleFileChange} // Add onChange event handler
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="customFile"
                          >
                            {fileName} {/* Display the file name here */}
                          </label>
                          <button type="submit">Upload</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}

      {/* Hidden Link to /test */}
      <Link to="/compensation" style={{ display: "none" }} ref={linkRef}>
        Go to Test
      </Link>
      {/* <div>
      <h2>Days of the Month: {month + 1}/{year}</h2>
      <ul>
        {daysOfMonth.map((day, index) => (
          <li key={day}>
            {day} ({daysOfWeek[index]})
          </li>
        ))}
      </ul>
    </div> */}
    </section>
  );
}

export default AddsettimeUpload;
