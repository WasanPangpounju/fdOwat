import endpoint from "../../config";
import { json, Link } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";

function AddsettimeEmployee() {
  const [isDataTrue, setIsDataTrue] = useState(false);
  const linkRef = useRef(null);
  const [loading, setLoading] = useState(false); // Create loading state

  // Effect to auto-click the Link when data is true
  useEffect(() => {
    if (isDataTrue) {
      linkRef.current.click(); // Programmatically click the link when isDataTrue is true
    }
  }, [isDataTrue]);

  const bordertable = {
    borderLeft: "2px solid #000",
  };

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

  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  useEffect(() => {
    const event = new Event('submit'); // Creating a synthetic event object
    handleSearch(event); // Call handleSearch with the event

    if (name !== "") {
      setCheckaddData("");

      handleCheckTimerecord();
    }
  }, [month, year]);

  const [options , setOptions] = useState([]);
  const [lastDate , setLastDate] = useState(31);
  const [groupOptions , setGroupOptions ] = useState([]);
  const [groupOptions1 , setGroupOptions1 ] = useState();

  const getLastMonthLastDate = (year, month) => {
    let date = new Date(year, month - 1, 1); // JavaScript months are 0-based
    date.setDate(0); // Moves to the last day of the previous month
    return date.getDate();
};

const generateOptions = async (year, month) => {
    const lastDay = await getLastMonthLastDate(year, month);
let tmp = [];

setLastDate(lastDay);
    for (let i = 21; i <= lastDay; i++) {
      const formattedValue = await i.toString().padStart(2, "0");
      await tmp.push(
        <option key={i} value={formattedValue}>
          {formattedValue}
        </option>
      );
    }

      // Add 1 to 20 of the current month
  for (let j = 1; j <= 20; j++) {
    const formattedValue = await j.toString().padStart(2, "0");
    await tmp.push(
      <option key={j} value={formattedValue}>
        {formattedValue}
      </option>
    );

  }

await setOptions(tmp);
tmp = [];
};


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
  const [workplaceList, setWorkplaceList] = useState([]);

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

  console.log(workplaceList);

  /////////////////////////////////////////////
  const [tmpIndex, setTmpIndex] = useState(0);
  const [wId, setWId] = useState("");
  const [wName, setWName] = useState("");
  const [wGroup, setWGroup] = useState("");
  const [wDate, setWDate] = useState("");
  const [wShift, setWShift] = useState("morning_shift");
  const [wStartTime, setWStartTime] = useState("");
  const [wEndTime, setWEndTime] = useState("");
  const [wAllTime, setWAllTime] = useState("");
  const [wOtTime, setWOtTime] = useState("");
  const [wSelectOtTime, setWSelectOtTime] = useState("");
  const [wSelectOtTimeout, setWSelectOtTimeout] = useState("");

  //OT before time
  const [wBeforeSelectOtTime, setWBeforeSelectOtTime] = useState("");
  const [wBeforeSelectOtTimeout, setWBeforeSelectOtTimeout] = useState("");
  const [wBeforeOtTime, setWBeforeOtTime] = useState("");

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

    if (isNaN(timeDiffFormatted)) {
      return "0";
    }

    return timeDiffFormatted;
  }

  useEffect(() => {
    try {
      setWStartTime("");
      setWEndTime("");
      setWAllTime("");
      setWOtTime("");
      setWSelectOtTime("");
      setWSelectOtTimeout("");

      setWBeforeSelectOtTime("");
      setWBeforeSelectOtTimeout("");
      setWBeforeOtTime("");

      const timeOfWork = async () => {
        await setWStartTime("");
        await setWEndTime("");
        await setWAllTime("");
        await setWOtTime("");
        await setWSelectOtTime("");
        await setWSelectOtTimeout("");

        await setWBeforeSelectOtTime("");
        await setWBeforeSelectOtTimeout("");
        await setWBeforeOtTime("");

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
              ((searchResult[0].department !== "" && searchResult[0].department !== null) || wGroup !== "")
              && workplacesearch.workplaceGroup.length > 0
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


              // await workplacesearch.workplaceGroup[
              //   parseInt(searchResult[0].department || 0) - 1
              // ].workplaceComplexData.workTimeDay.map(async (item, index) => {
                
                const departmentIndex = wGroup !== "" ? parseInt(wGroup) - 1 : parseInt(searchResult[0].department || 0) - 1;

await workplacesearch.workplaceGroup[departmentIndex]
  .workplaceComplexData.workTimeDay.map(async (item, index) => {
    
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

                        await setWBeforeSelectOtTime(morningTimes[0].beforeStartTimeOT || "");
                        await setWBeforeSelectOtTimeout(morningTimes[0].beforeEndTimeOT || "");
                        await setWBeforeOtTime(
                          calTime(
                            morningTimes[0]?.beforeStartTimeOT || "",
                            morningTimes[0]?.beforeEndTimeOT || "",
                            workplacesearch?.beforeWorkOfOT || ""
                          ) || ""
                        );
  
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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(
                        afternoonTimes[0]?.beforeStartTimeOT || ""
                      );
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
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

                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(nightTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(
                        specialt_shift[0]?.beforeStartTimeOT || ""
                      );
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    default:
                      setWStartTime("");
                      setWEndTime("");
                      setWAllTime("");
                      setWOtTime("");
                      setWSelectOtTime("");
                      setWSelectOtTimeout("");
                      setWBeforeSelectOtTime("");
                      setWBeforeSelectOtTimeout("");
                      setWBeforeOtTime("");
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
                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(morningTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(afternoonTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
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

                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(nightTimes[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(specialt_shift[0]?.beforeEndTimeOT || "");
                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                      await setWBeforeOtTime("");

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
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
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

                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );
                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
                      await setWBeforeOtTime("");
                  }
                }

                // alert(dayMapping[item.startDay] );
              });

              // workplacesearch = await tmp;
              // await alert(JSON.stringify(tmp));
            } else {
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
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || ""
                      );

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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
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

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    default:
                      setWStartTime("");
                      setWEndTime("");
                      setWAllTime("");
                      setWOtTime("");
                      setWSelectOtTime("");
                      setWSelectOtTimeout("");
                      setWBeforeOtTime("");
                      setWBeforeSelectOtTime("");
                      setWBeforeSelectOtTimeout("");

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
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || ""
                      );

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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || ""
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

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || ""
                      );

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || ""
                      );

                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeOtTime("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
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
                      await setWSelectOtTimeout(
                        morningTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          morningTimes[0]?.beforeStartTimeOT || "",
                          morningTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        morningTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        morningTimes[0]?.beforeEndTimeOT || "");

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
                      await setWSelectOtTime(
                        afternoonTimes[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        afternoonTimes[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          afternoonTimes[0]?.beforeStartTimeOT || "",
                          afternoonTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        afternoonTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        afternoonTimes[0]?.beforeEndTimeOT || "");

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

                      await setWBeforeOtTime(
                        calTime(
                          nightTimes[0]?.beforeStartTimeOT || "",
                          nightTimes[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        nightTimes[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        nightTimes[0]?.beforeEndTimeOT || "");

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
                      await setWSelectOtTime(
                        specialt_shift[0].startTimeOT || ""
                      );
                      await setWSelectOtTimeout(
                        specialt_shift[0].endTimeOT || ""
                      );

                      await setWBeforeOtTime(
                        calTime(
                          specialt_shift[0]?.beforeStartTimeOT || "",
                          specialt_shift[0]?.beforeEndTimeOT || "",
                          workplacesearch?.beforeWorkOfOT || ""
                        ) || ""
                      );
                      await setWBeforeSelectOtTime(
                        specialt_shift[0]?.beforeStartTimeOT || "");
                      await setWBeforeSelectOtTimeout(
                        specialt_shift[0]?.beforeEndTimeOT || "");


                      break;
                    default:
                      await setWStartTime("");
                      await setWEndTime("");
                      await setWAllTime("");
                      await setWOtTime("");
                      await setWSelectOtTime("");
                      await setWSelectOtTimeout("");
                      await setWBeforeOtTime("");
                      await setWBeforeSelectOtTime("");
                      await setWBeforeSelectOtTimeout("");
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
    } catch (err) {
      console("err", err);
    }
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


  useEffect(() => {
    if (wBeforeSelectOtTime !== "" && wBeforeSelectOtTimeout !== "") {
      if (wId !== "" && wName !== "") {
        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId
        );
        if (workplacesearch) {
          if (wShift == "specialt_shift") {
            setWBeforeOtTime(
              calTime(wBeforeSelectOtTime || "", wBeforeSelectOtTimeout || "", 24)
            );
          } else {
            setWBeforeOtTime(
              calTime(
                wBeforeSelectOtTime || "",
                wBeforeSelectOtTimeout || "",
                workplacesearch.workOfOT || ""
              )
            );
          }
        }
      }
    } else {
      setWBeforeOtTime(0);
    }
  }, [wBeforeSelectOtTime, wBeforeSelectOtTimeout]);

  // search employee Name by employeeId
  useEffect(() => {
    if (wId !== "") {
      try {
        setGroupOptions1 (null);            

        const workplacesearch = workplaceList.find(
          (workplace) => workplace.workplaceId === wId);
        if (workplacesearch) {
          //department: employee department process
          if (
            searchResult[0].workplace === wId &&
            // searchResult[0].department !== "" &&
            workplacesearch.workplaceGroup.length > 0
          ) {
            // alert(searchResult[0].workplace );
            setGroupOptions1 (workplacesearch.workplaceGroup);            
            const newGroupOptions = workplacesearch.workplaceGroup.map(
              element => element.workplaceComplexName
            );
        
            setGroupOptions(newGroupOptions);
            // alert(workplacesearch.workplaceGroup.length  + ' ' + groupOptions[0].length);
// alert(JSON.stringify(groupOptions1));
            // alert(searchResult[0].department);
            // alert(workplacesearch.workplaceGroup[parseInt(searchResult[0].department || 0) -1].workplaceComplexName );

            // let dep =
            //   workplacesearch.workplaceGroup[
            //     parseInt(searchResult[0].department || 0) - 1
            //   ].workplaceComplexName || "";
            let dep =
              workplacesearch.workplaceGroup?.[
                parseInt(searchResult[0].department || 0) - 1
              ]?.workplaceComplexName || "";

            if (dep == "") {
              setWName(workplacesearch.workplaceName);
              setWGroup('');
            } else {
              setWName(dep);
              setWGroup(workplacesearch?.wGroup || '');
            }
          } else {
            setWName(workplacesearch.workplaceName);
            setWGroup('');
          }

          // Optional: Add work time to selection (as per your comment)
          // alert(JSON.stringify(workplacesearch.workTimeDay, null, 2));


        } else {
          setWName("");
        }
      } catch (error) {
        // alert(error);
        // alert(JSON.stringify(workplaceList,null,2) );

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
    wGroup: "",
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
            ["wGroup"]: workplaceIdSearch.wGroup + "",
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

  //     if (isNaN(timeDiffFormatted)) {
  //         return '0';
  //     }

  //     return timeDiffFormatted;
  // }

  const handleStartDateChange4 = (index2, date) => {
    // alert(index2);
    handleFieldChange2(index2, "date", date);
  };

  ///////////////////

  useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);

    const savedEmployeeId = localStorage.getItem("employeeId");
    console.log('savedEmployeeId', savedEmployeeId);
    const savedName = localStorage.getItem("name");
    const savedLastName = localStorage.getItem("lastName");
    const savedMonth = localStorage.getItem("month");
    const savedYear = localStorage.getItem("year");
    if (savedEmployeeId) {
      setSearchEmployeeId(savedEmployeeId);
      setEmployeeId(savedEmployeeId);
      const event = new Event('submit'); // Creating a synthetic event object
      handleSearch(event); // Call handleSearch with the event
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
      if (searchEmployeeId == '') {
        return;
      }
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
      year: year,
    };
    setRowDataList2([]);
    generateOptions(year , month);

    if (!checkaddData) {
      try {
        const response = await axios.post(
          endpoint + "/timerecord/searchtimerecordemployee",
          data
        );
        // alert(JSON.stringify(response ,null,2));

        if (response.data.result.length < 1) {
          alert("ไม่พบข้อมูล");
          // Set the state to false if no data is found
          setUpdateButton(false);
          setTimeRecord_id("");
          setRowDataList2([]);
        } else {
          // Set the state to true if data is found
          await setUpdateButton(true);
          // alert(response.data.recordworkplace[0].employee_workplaceRecord[1].workplaceId);
          await setTimeRecord_id(response.data.result[0]._id);

          // setRowDataList2(response.data.recordworkplace[0].employee_workplaceRecord);
          if (name != "") {
            
            setRowDataList2(
              response?.data?.result?.[0]?.employee_record
                .sort((a, b) => {
                  const dateA = parseInt(a.date, 10);
                  const dateB = parseInt(b.date, 10);
            
                  // Prioritize dates from 21-30 first, then 01-20
                  if ((dateA >= 21 && dateB >= 21) || (dateA <= 20 && dateB <= 20)) {
                    return dateA - dateB; // Sort normally within each group
                  }
                  return dateA >= 21 ? -1 : 1; // Move 21-30 to the front
                })
                .map((item, index) => ({
                  ...item,
                  tmpIndex: index,
                }))
            );
            
            // setRowDataList2(response.data.result[0].employee_record);
            // setRowDataList2(
            //   response.data.recordworkplace[0].employee_workplaceRecord.map(
            //     (item, index) => ({
            //       ...item,
            //       tmpIndex: index,
            //     })
            //   )
            // );
            //111
            // setRowDataList2(
            //   response.data.recordworkplace[0].employee_workplaceRecord
            //     .sort((a, b) => parseInt(a.date) - parseInt(b.date)) // Sort by date (ascending order)
            //     .map((item, index) => ({
            //       ...item,
            //       tmpIndex: index,
            //     }))
            // );
          } else {
            setRowDataList2([]);
          }

          // alert(JSON.stringify( rowDataList[0] ) );
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
      tmpIndex    : tmpIndex || "",
      year: year || "",
      workplaceId: wId || "",
      workplaceName: wName || "",
      wGroup: wGroup  || "",
      date: wDate || "",
      shift: wShift || "",
      startTime: wStartTime || "",
      endTime: wEndTime || "",
      totalTime: wAllTime || "",
      totalOtTime: wOtTime || "",
      startOtTime: wSelectOtTime || "",
      endOtTime: wSelectOtTimeout || "",
      beforeTotalOtTime: wOtTime || "",
      beforeStartOtTime: wBeforeSelectOtTime || "",
      beforeEndOtTime: wBeforeSelectOtTimeout || "",
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
    // const isDuplicate = newDataList.some(
    //   (row) => row.date === newRowData.date && row.startTime === newRowData.startTime && row.endTime === newRowData.endTime
    // );
    const isDuplicate = newDataList.some((row) => {
      const existingStart = parseTime(row.startTime); // Convert existing startTime to minutes
      const existingEnd = parseTime(row.endTime);     // Convert existing endTime to minutes
      const newStart = parseTime(newRowData.startTime); // Convert new startTime to minutes
      const newEnd = parseTime(newRowData.endTime);     // Convert new endTime to minutes
      const existingDate = row.date;
      const newDate = newRowData.date;     // Convert new endTime to minutes

      // Check for time overlap
      const isOverlapping =
        existingDate === newDate &&
        (newStart < existingEnd && newEnd > existingStart);

      return isOverlapping;
    });

    // Helper function to convert "HH.mm" time strings to minutes for easy comparison
    function parseTime(timeString) {
      const [hours, minutes] = timeString.split('.').map(Number);
      return hours * 60 + minutes; // Convert to total minutes
    }

    // if (isDuplicate) {
    //   alert("มีวันและกะที่ลงไว้แล้ว");
    //   return; // Exit the function to prevent adding the duplicate row
    // }

    // Push a new row with specific data
    newDataList.unshift(newRowData);
    
    // Update the state with the new data
    setRowDataList2(newDataList);

  
    const currentDate = parseInt(wDate, 10);
    let nextDate = currentDate + 1;


    if (nextDate > parseInt(lastDate) ) {
      nextDate = 1;
    }

    const formattedNextDate = nextDate.toString().padStart(2, "0");
    setWDate(formattedNextDate);
  };

  // Function to handle editing a row
  const handleEditRow = async (index) => {
    // You can implement the edit logic here, e.g., open a modal for editing
    // console.log('Edit row at index:', index);
    const tmp = await rowDataList2[index];
    // alert(tmp.staffId);
    await setWId(tmp.workplaceId);
    await setWName(tmp.workplaceName);
    await setWGroup(tmp.wGroup || '');
  };

  // Function to handle deleting a row
  const handleDeleteRow = (index) => {
    // Create a copy of the current state
    const newDataList = [...rowDataList2];
    // Remove the row at the specified index
    const updatedList = newDataList.filter((entry) => entry.tmpIndex !== index);
    // alert(index);
    newDataList.splice(index, 1);
    // Update the state with the new data
    setRowDataList2(updatedList);
  };

  async function handleCreateWorkplaceTimerecord(event) {
    setLoading(true); // Set loading to true to block the button

    event.preventDefault();
    // alert('test');

    //get data from input in useState to data
    const data = {
      year: year,
      employeeId: employeeId,
      employeeName: name,
      month: month,
      employee_record: rowDataList2,
    };

    try {
      const response = await axios.post(
        endpoint + "/timerecord/createtimerecordemployee",
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response) {
        alert("บันทึกสำเร็จ");
        // window.location.reload();
        handleCheckTimerecord();

      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
      // alert(error)
      // window.location.reload();
    } finally {
      setLoading(false); // Set loading to false to unblock the button
    }
  }

  async function handleUpdateWorkplaceTimerecord(event) {
    event.preventDefault();
    //get data from input in useState to data
    const data = {
      year: year,
      employeeId: employeeId,
      employeeName: name,
      month: month,
      employee_record: rowDataList2,
    };
    try {
      const response = await axios.put(
        endpoint + "/timerecord/updatetimerecordemployee/" + timeRecord_id,
        data
      );
      // setEmployeesResult(response.data.employees);
      if (response?.status === 201) {
        alert("บันทึกสำเร็จ");
// handleCheckTimerecord();
        setUpdateButton(true);
        // alert(response.data.recordworkplace[0].employee_workplaceRecord[1].workplaceId);
        setTimeRecord_id(response?.data?.employee_record._id);
        setRowDataList2(
          response?.data?.employee_record
            .sort((a, b) => {
              const dateA = parseInt(a.date, 10);
              const dateB = parseInt(b.date, 10);
        
              // Prioritize dates from 21-30 first, then 01-20
              if ((dateA >= 21 && dateB >= 21) || (dateA <= 20 && dateB <= 20)) {
                return dateA - dateB; // Sort normally within each group
              }
              return dateA >= 21 ? -1 : 1; // Move 21-30 to the front
            })
            .map((item, index) => ({
              ...item,
              tmpIndex: index,
            }))
        );
        
        // setRowDataList2(
        //   response?.data?.employee_record.sort((a, b) => parseInt(a.date) - parseInt(b.date)) // Sort by date (ascending order)
        //     .map((item, index) => ({
        //       ...item,
        //       tmpIndex: index,
        //     }))
        // );

      //   //get data from conclude data then check edit data
      //   const serchConclude = await {
      //     year: year,
      //     month: month,
      //     concludeDate: "",
      //     employeeId: searchEmployeeId,
      //     employeeName: searchEmployeeName,
      //   };

      //   try {
      //     const concludeResponse = await axios.post(
      //       endpoint + "/conclude/search",
      //       serchConclude
      //     );

      //     // await alert(JSON.stringify(concludeResponse ,null,2));
      //     if (concludeResponse.data.recordConclude.length < 1) {
      //       // await alert('conclude is null');
      //       window.location.reload();
      //     } else {
      //       // await alert('conclude is set');
      //       await localStorage.setItem("editConclude", searchEmployeeId);
      //       await localStorage.setItem("employeeId", searchEmployeeId);
      //       await localStorage.setItem("month", month);
      //       await localStorage.setItem("year", year);

      //       // await setIsDataTrue(true); // Set isDataTrue based on fetched data
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      //   // window.location.reload();
      }
      
    } catch (error) {
      alert("error" + error);
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
                      {/* <div class="row">
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
                                                        />
                                                        <datalist id="staffIdList">
                                                            {employeeList.map(employee => (
                                                                <option key={employee.employeeId} value={employee.employeeId} />
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
                                                            {employeeList.map(employee => (
                                                                <option key={employee.employeeId} value={employee.name + " " + employee.lastName} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                </div>
                                            </div> */}
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label role="searchEmployeeId">รหัสพนักงาน</label>
                            {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} /> */}
                            <input
                              type="text"
                              className="form-control"
                              id="staffId"
                              placeholder="รหัสพนักงาน"
                              value={staffId}
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
                              <option value="" />
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
                            <label role="searchname">ชื่อพนักงาน</label>
                            {/* <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} /> */}
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
                                  value={
                                    employee.name + " " + employee.lastName
                                  }
                                />
                              ))}
                            </datalist>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-center">
                        <button class="btn b_save" onClick={handleSearch()}>
                          <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                        </button>
                      </div>
                    </form>
                    <br />
                    {/* <div class="d-flex justify-content-center">
                                            <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                        </div>
                                        <div class="d-flex justify-content-center">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                                            {searchResult.map(workplace => (
                                                                <li
                                                                    key={workplace.id}
                                                                    onClick={() => handleClickResult(workplace)}
                                                                >
                                                                    รหัส {workplace.employeeId} ชื่อ{workplace.name} {workplace.lastName}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                  </div>
                </section>
                {/* <!--Frame--> */}
              </div>
            </div>
            <form onSubmit={handleManageWorkplace}>
              <input type="hidden" id="hiddenField" name="" value={tmpIndex} />

              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label role="agencynumber">รหัสพนักงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencynumber"
                      placeholder="รหัสพนักงาน"
                      value={employeeId !== "null" ? employeeId : ""}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label role="agencyname">ชื่อพนักงาน</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agencyname"
                      placeholder="ชื่อพนักงาน"
                      value={name + " " + lastName}
                      onChange={(e) => setName(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>

                <div class="col-md-2">
                  <div class="form-group">
                    <label role="agencyname">เดือน</label>
                    <select
                      className="form-control"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="01">มกราคม</option>
                      <option value="02">กุมภาพันธ์</option>
                      <option value="03">มีนาคม</option>
                      <option value="04">เมษายน</option>
                      <option value="05">พฤษภาคม</option>
                      <option value="06">มิถุนายน</option>
                      <option value="07">กรกฎาคม</option>
                      <option value="08">สิงหาคม</option>
                      <option value="09">กันยายน</option>
                      <option value="10">ตุลาคม</option>
                      <option value="11">พฤศจิกายน</option>
                      <option value="12">ธันวาคม</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label>ปี</label>
                    <select
                      className="form-control"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y + 543}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* <div class="col-md-2">
                                    <div class="form-group">
                                        <label role="datetime">วันที่</label>
                                        <div style={{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                            <DatePicker id="datetime" name="datetime"
                                                className="form-control" // Apply Bootstrap form-control class
                                                popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                selected={startjob}
                                                onChange={handleStartDateChange}
                                                dateFormat="dd/MM/yyyy" />
                                        </div>
                                    </div>

                                </div> */}
                <div class="col-md-3">
                  <label role="button"></label>
                  <div class="d-flex align-items-end">
                    <button
                      type="button"
                      class="btn b_save"
                      onClick={handleCheckTimerecord}
                    >
                      <i class="nav-icon fas fa-search"></i> &nbsp; ตรวจสอบ
                    </button>
                  </div>
                </div>
              </div>

              <section className="Frame">
                
  <div className="table-responsive">
    <table className="table table-bordered table-sm text-center align-middle">
      <thead>
        <tr>
          <th rowSpan="2">หน่วยงาน</th>
          <th rowSpan="2">ชื่อหน่วยงาน</th>
          <th rowSpan="2">กลุ่มที่</th>
          <th rowSpan="2">วันที่</th>
          <th rowSpan="2">กะ</th>
          <th colSpan="3">OT (ก่อนเวลาทำงาน)</th>
        <th colSpan="3">เวลาทำงาน</th>
        <th colSpan="3">OT (หลังเวลาทำงาน)</th>
        {wShift === "specialt_shift" && <th colSpan="3">ข้อมูลพิเศษ</th>}
        </tr>
      {/* Second Row - Detailed Headers */}
      <tr>

          <th>เข้า OT</th>
          <th>ออก OT</th>
          <th>ชั่วโมง OT</th>
          <th>เข้างาน</th>
          <th>ออกงาน</th>
          <th>ชั่วโมงทำงาน</th>
          <th>เข้า OT</th>
          <th>ออก OT</th>
          <th>ชั่วโมง OT</th>

          {wShift === "specialt_shift" && (
            <>
              <th>จ่ายสด</th>
              <th>เงิน</th>
              <th>เงิน OT</th>
              {/* <th>หมายเหตุ</th> */}
            </>
          )}
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Workplace ID */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wId"
              placeholder="รหัสหน่วยงาน"
              value={wId}
              onChange={(e) => setWId(e.target.value)}
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
          </td>

          {/* Workplace Name */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wName"
              placeholder="ชื่อหน่วยงาน"
              value={wName}
              onChange={(e) => setWName(e.target.value)}
            />
          </td>

          {/* Group */}
          <td>
            <select
              className="form-control"
              value={wGroup}
              onChange={(e) => setWGroup(e.target.value)}
            >
              <option value="">หน่วยงานหลัก</option>
              {groupOptions1?.map((item) => (
                <option key={item.workplaceComplexId} value={item.workplaceComplexId}>
                  {item.workplaceComplexName}
                </option>
              ))}
            </select>
          </td>

          {/* Date */}
          <td>
            <select
              className="form-control"
              value={wDate}
              onChange={(e) => setWDate(e.target.value)}
            >
              <option value="">เลือกวัน</option>
              {options}
            </select>
          </td>

          {/* Shift */}
          <td>
            <select
              className="form-control"
              value={wShift}
              onChange={(e) => setWShift(e.target.value)}
            >
              <option value="morning_shift">กะเช้า</option>
              <option value="afternoon_shift">กะบ่าย</option>
              <option value="night_shift">กะดึก</option>
              <option value="specialt_shift">กะพิเศษ</option>
            </select>
          </td>

          {/* OT Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wBeforeSelectOtTime"
              placeholder="เข้า OT"
              value={wBeforeSelectOtTime}
              onChange={(e) => setWBeforeSelectOtTime(e.target.value)}
            />
          </td>

          {/* OT End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wBeforeSelectOtTimeout"
              placeholder="ออก OT"
              value={wBeforeSelectOtTimeout}
              onChange={(e) => setWBeforeSelectOtTimeout(e.target.value)}
            />
          </td>

          {/* OT Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wOtTime"
              placeholder="ชั่วโมง OT"
              value={wBeforeOtTime}
              onChange={(e) => setBeforeWOtTime(e.target.value)}
            />
          </td>

          {/* Work Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wStartTime"
              placeholder="เข้างาน"
              value={wStartTime}
              onChange={(e) => setWStartTime(e.target.value)}
            />
          </td>

          {/* Work End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wEndTime"
              placeholder="ออกงาน"
              value={wEndTime}
              onChange={(e) => setWEndTime(e.target.value)}
            />
          </td>

          {/* Work Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wAllTime"
              placeholder="ชั่วโมงทำงาน"
              value={wAllTime}
              onChange={(e) => setWAllTime(e.target.value)}
            />
          </td>

          {/* OT Start Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wSelectOtTime"
              placeholder="เข้า OT"
              value={wSelectOtTime}
              onChange={(e) => setWSelectOtTime(e.target.value)}
            />
          </td>

          {/* OT End Time */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wSelectOtTimeout"
              placeholder="ออก OT"
              value={wSelectOtTimeout}
              onChange={(e) => setWSelectOtTimeout(e.target.value)}
            />
          </td>

          {/* OT Hours */}
          <td>
            <input
              type="text"
              className="form-control text-center"
              id="wOtTime"
              placeholder="ชั่วโมง OT"
              value={wOtTime}
              onChange={(e) => setWOtTime(e.target.value)}
            />
          </td>

          {/* Special Shift Salary Fields (Only for กะพิเศษ) */}
          {wShift === "specialt_shift" && (
            <>
              <td>
                <input
                  type="checkbox"
                  className="form-control"
                  checked={cashSalary}
                  onChange={handleCheckboxChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control text-center"
                  id="specialtSalary"
                  placeholder="เป็นเงิน"
                  value={specialtSalary}
                  onChange={(e) => setSpecialtSalary(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control text-center"
                  id="specialtSalaryOT"
                  placeholder="OT เป็นเงิน"
                  value={specialtSalaryOT}
                  onChange={(e) => setSpecialtSalaryOT(e.target.value)}
                />
              </td>
              {/* <td>
                <input
                  type="text"
                  className="form-control text-center"
                  id="messageSalary"
                  placeholder="หมายเหตุ"
                  value={messageSalary}
                  onChange={(e) => setMessageSalary(e.target.value)}
                />
              </td> */}
            </>
          )}
        </tr>
      </tbody>
    </table>
  </div>

  {/* Submit Button */}
  <div className="form-group mt-3">
    <button className="btn b_save">
      <i className="fas fa-check"></i> &nbsp; เพิ่ม
    </button>
  </div>
</section>
              
            </form>

            <form onSubmit={handleManageWorkplace}>
            <section className="Frame">
  <div className="table-responsive">
    <table className="table table-bordered table-sm text-center align-middle">
      <thead>
        <tr>
          {/* <th className="text-center" style={{ backgroundColor: "transparent" }}>หน่วยงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชื่อหน่วยงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>กลุ่มงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>วันที่</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>กะ</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาเข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>


          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้างาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออกงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมงทำงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เงินพิเศษ</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ลบ</th> */}

<th rowSpan="2" className="text-center">หน่วยงาน</th>
          <th rowSpan="2" className="text-center">ชื่อหน่วยงาน</th>
          <th rowSpan="2" className="text-center">กลุ่มงาน</th>
          <th rowSpan="2" className="text-center">วันที่</th>
          <th rowSpan="2" className="text-center">กะ</th>
          <th colSpan="3" className="text-center">OT (ก่อนเวลาทำงาน)</th>
        <th colSpan="3" className="text-center">เวลาทำงาน</th>
        <th colSpan="3" className="text-center">OT (หลังเวลาทำงาน)</th>
        <th rowSpan="2" className="text-center">เงินจ้าง</th>
        <th rowSpan="2" className="text-center">ลบ</th>

        </tr><tr>

          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาเข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เวลาออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>


          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้างาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออกงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมงทำงาน</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>เข้า OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ออก OT</th>
          <th className="text-center" style={{ backgroundColor: "transparent" }}>ชั่วโมง OT</th>

        </tr>
      </thead>
      <tbody>
        {rowDataList2.map(
          (rowData2, index) =>
            rowData2.workplaceId && (
              <tr key={index} className="align-middle text-center">
                <td>{rowData2.workplaceId}</td>
                <td>{rowData2.workplaceName}</td>
                 <td>{groupOptions[parseInt(rowData2.wGroup) -1 ] || ""}</td> 

                <td>{rowData2.date}</td>
                <td>
                  {rowData2.shift === "morning_shift"
                    ? "กะเช้า"
                    : rowData2.shift === "afternoon_shift"
                    ? "กะบ่าย"
                    : rowData2.shift === "night_shift"
                    ? "กะดึก"
                    : rowData2.shift === "specialt_shift"
                    ? "กะพิเศษ"
                    : ""}
                </td>
                <td>{rowData2.beforeStartOtTime}</td>
                <td>{rowData2.beforeEndOtTime}</td>
                <td>{rowData2.beforeTotalOtTime}</td>

                <td>{rowData2.startTime}</td>
                <td>{rowData2.endTime}</td>
                <td>{rowData2.totalTime}</td>
                <td>{rowData2.startOtTime}</td>
                <td>{rowData2.endOtTime}</td>
                <td>{rowData2.totalOtTime}</td>

                <td>
                  {rowData2.specialtSalary !== "" 
                    ? `${parseFloat(rowData2.specialtSalary || '0') + parseFloat(rowData2.specialtSalaryOT || '0')} บาท`
                    : ""}
                </td>
                <td className="text-center">
                  {/* <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ padding: "0.2rem", width: "6rem" }}
                    onClick={() => handleDeleteRow(rowData2.tmpIndex)}
                  >
                    Delete
                  </button> */}
                  <button 
  type="button"
  className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
  style={{ padding: "0.3rem", width: "3rem", display: "flex" }}
  onClick={() => handleDeleteRow(rowData2.tmpIndex)}

>
  <i className="fas fa-trash-alt"></i>
</button>
                </td>
              </tr>
            )
        )}
      </tbody>
    </table>
  </div>
</section>

              <div class="form-group">
                {/* <button class="btn b_save" onClick={handleCreateWorkplaceTimerecord}><i class="nav-icon fas fa-save"></i> &nbsp; บันทึก</button> */}
                {updateButton ? (
                  <button
                    class="btn b_save"
                    onClick={handleUpdateWorkplaceTimerecord}
                    disabled={loading} // Disable the button if loading is true
                  >
                    <i class="nav-icon fas fa-save"></i> &nbsp; อัพเดท
                  </button>
                ) : (
                  <button
                    class="btn b_save"
                    onClick={handleCreateWorkplaceTimerecord}
                    disabled={loading} // Disable the button if loading is true
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
      {/* {JSON.stringify(rowDataList2)} */}

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

export default AddsettimeEmployee;

