import endpoint from "../../config";
import Swal from 'sweetalert2'
import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import { useLocation } from "react-router-dom";

function Setting({ workplaceList, employeeList }) {
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
  const [editingRow, setEditingRow] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

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
    setWorkTimeDayList((prevList) => [...prevList, workTimeDay]);

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
          startTime: "",
          endTime: "",
          resultTime: "",
          startTimeOT: "",
          endTimeOT: "",
          resultTimeOT: "",
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
    
    // Reset editing state
    if (editingRow === index) {
      setEditingRow(null);
      setEditingItem(null);
    }
  };

  const handleEditClick = (index, item1) => {
    setEditingRow(index);
    setEditingItem({
      ...item1,
      startDay: workTimeDayList[index].startDay,
      endDay: workTimeDayList[index].endDay,
      workOrStop: workTimeDayList[index].workOrStop
    });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingItem(null);
  };

  const handleSaveEdit = (index, rowIndex) => {
    setWorkTimeDayList(prevList => {
      const newList = [...prevList];
      // อัพเดทข้อมูลของวันและสถานะ
      newList[index] = {
        ...newList[index],
        startDay: editingItem.startDay || "",
        endDay: editingItem.endDay || "",
        workOrStop: editingItem.workOrStop || ""
      };

      // คำนวณเวลาทำงานและ OT
      let resultTime = "";
      if (editingItem.startTime && editingItem.endTime) {
        const start = parseFloat(editingItem.startTime);
        const end = parseFloat(editingItem.endTime);
        if (!isNaN(start) && !isNaN(end)) {
          resultTime = (end - start).toFixed(2);
        }
      }

      let resultTimeOT = "";
      if (editingItem.startTimeOT && editingItem.endTimeOT) {
        const startOT = parseFloat(editingItem.startTimeOT);
        const endOT = parseFloat(editingItem.endTimeOT);
        if (!isNaN(startOT) && !isNaN(endOT)) {
          resultTimeOT = (endOT - startOT).toFixed(2);
        }
      }

      // อัพเดทข้อมูลของเวลาทำงาน
      newList[index].allTimes[rowIndex] = {
        shift: editingItem.shift || "",
        startTime: editingItem.startTime || "",
        endTime: editingItem.endTime || "",
        resultTime: resultTime,
        startTimeOT: editingItem.startTimeOT || "",
        endTimeOT: editingItem.endTimeOT || "",
        resultTimeOT: resultTimeOT,
        numberOfPeople: editingItem.numberOfPeople || "",
        Remark: editingItem.Remark || ""
      };
      return newList;
    });
    setEditingRow(null);
    setEditingItem(null);
  };

  const handleEditChange = (field, value) => {
    setEditingItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // คำนวณ resultTime เมื่อมีการเปลี่ยนแปลงเวลาเข้าหรือออก
      if (field === 'startTime' || field === 'endTime') {
        if (updated.startTime && updated.endTime) {
          const startHour = parseFloat(updated.startTime);
          const endHour = parseFloat(updated.endTime);
          if (!isNaN(startHour) && !isNaN(endHour)) {
            let diff = endHour - startHour;
            if (diff < 0) diff += 24; // กรณีข้ามวัน
            updated.resultTime = diff.toFixed(2);
          }
        }
      }
      
      // คำนวณ resultTimeOT เมื่อมีการเปลี่ยนแปลงเวลา OT
      if (field === 'startTimeOT' || field === 'endTimeOT') {
        if (updated.startTimeOT && updated.endTimeOT) {
          const startHour = parseFloat(updated.startTimeOT);
          const endHour = parseFloat(updated.endTimeOT);
          if (!isNaN(startHour) && !isNaN(endHour)) {
            let diff = endHour - startHour;
            if (diff < 0) diff += 24; // กรณีข้ามวัน
            updated.resultTimeOT = diff.toFixed(2);
          }
        }
      }

      return updated;
    });
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

        if (startTime && endTime) {
          const resultTime = calculateTimeDifference(startTime, endTime);
          updatedTimes[index].resultTime = resultTime;
        }

        if (startTimeOT && endTimeOT) {
          const resultTimeOT = calculateTimeDifference(startTimeOT, endTimeOT);
          updatedTimes[index].resultTimeOT = resultTimeOT;
        }
      }

      return {
        ...prevData,
        allTimes: updatedTimes,
      };
    });
  };

  const calculateTimeDifference = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(".").map(Number);
    const [endHour, endMinute] = endTime.split(".").map(Number);

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

    return `${resultHour.toString().padStart(2, "0")}.${resultMinute
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

  const [workRateChange, setWorkRateChange] = useState('');
  const [workRateDayChange, setWorkRateDayChange] = useState("");
  const [workRateMonthChange, setWorkRateMonthChange] = useState("");
  const [workRateYearChange, setWorkRateYearChange] = useState(new Date().getFullYear());

  //set day month year to WorkRate change
  useEffect(() => {
    if (workRateDayChange && workRateMonthChange && workRateYearChange) {
      const selectedDate = new Date(`${workRateMonthChange }/${workRateDayChange }/${workRateYearChange}`);
      setWorkRateChange(selectedDate || null);
    }
  }, [ workRateDayChange , workRateMonthChange , workRateYearChange] );

  useEffect(() => {
    const currentDate = new Date(workRateChange); // Get the workRateChange date

    setWorkRateDayChange(currentDate.getDate()); // Day of the month (1-31) 
   setWorkRateMonthChange(currentDate.getMonth() + 1); // Month (0-11) - Add 1 to get 1-12
   setWorkRateYearChange( currentDate.getFullYear()); // Year (e.g., 2025)
}, [workRateChange ] );


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
        // ตรวจสอบว่ามีวันที่นี้อยู่แล้วหรือไม่
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
  const [dateStartContract, setDateStartContract] = useState(""); //วันที่เริ่มสัญญาจ้าง
  const [dateEndContract, setDateEndContract] = useState(""); //วันที่สิ้นสุดสัญญาจ้าง
  const [serviceFeePerMonth, setServiceFeePerMonth] = useState(""); //ค่าบริการรายเดือน


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
        ...(formData.addSalary || []),
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

    //get value from form search
    const data = {
      searchWorkplaceId: searchWorkplaceId,
      searchWorkplaceName: searchWorkplaceName,
    };

    try {
      const response = await axios.post(endpoint + "/workplace/search", data);
      setSearchResult(response.data.workplaces);
      // console.log("response", response);
      const filteredList = workplaceList.filter((workplace) => {
        const idMatch = workplace.workplaceId
          .toString()
          .includes(searchWorkplaceId);
        const nameMatch = workplace.workplaceName
          .toLowerCase()
          .includes(searchWorkplaceName.toLowerCase());
        return idMatch && nameMatch;
      });
      setSearchResult(filteredList);
      setFilteredWorkplaceList(filteredList);
      console.log("filteredList", filteredList);
      if (response.data.workplaces.length < 1) {
        window.location.reload();
      } else {
        const data1 = {
          employeeId: "",
          name: "",
          idCard: "",
          //   workPlace: searchWorkplaceId,
          workPlace: searchResult.workplaceId,
        };

        // const response1 = await axios.post(
        //   endpoint + "/employee/search",
        //   data1
        // );

        // const filteredEmployees = response1.data.employees.filter(
        //   (employee) => employee.workplace === searchWorkplaceId
        // );

        // await setEmployeeListResult(response1.data.employees);
        // employeeList
        // searchWorkplaceId
        const filteredEmployees = employeeList.filter(
          (employee) => employee.workplace === searchWorkplaceId
        );
        // console.log('searchWorkplaceId',searchWorkplaceId);
        await setEmployeeListResult(filteredEmployees);

        // await alert(JSON.stringify(response1.data.employees , null ,2));
        // alert(response1.data );
        // alert(employeeListResult.length);
      }
    } catch (error) {
      // setMessage('ไม่พบผลการค้นหา กรุณาตรวจสอบข้อมูลที่ใช้ในการค้นหาอีกครั้ง');
      // alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา" , error);
      // window.location.reload();
    }
  }
  // console.log("EmployeeListResult", employeeListResult);

  // Function to send workRate to employees
  const sendWorkRate = async () => {
    try {
      // Show loading alert
      Swal.fire({
        title: 'กำลังส่งค่าแรง...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Get all employees from the current workplace
      const searchData = {
        employeeId: "",
        name: "",
        idCard: "",
        workPlace: workplaceId,
      };

      const employeeResponse = await axios.post(endpoint + "/employee/search", searchData);
      const employees = employeeResponse.data.employees;

      if (!employees || employees.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่พบพนักงาน',
          text: 'ไม่พบพนักงานในหน่วยงานนี้'
        });
        return;
      }

      // Filter employees with jobtype "รายวัน" and salary < workRate
      const targetEmployees = employees.filter(employee => {
        const currentSalary = parseFloat(employee.salary || '0');
        const newWorkRate = parseFloat(workRate || '0');
        return employee.jobtype === "รายวัน" && currentSalary < newWorkRate;
      });

      if (targetEmployees.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'ไม่มีการเปลี่ยนแปลง',
          text: 'ไม่พบพนักงานรายวันที่มีค่าแรงต่ำกว่าค่าแรงที่ต้องการส่ง'
        });
        return;
      }

      // Prepare updates
      let successCount = 0;
      let errorCount = 0;

      for (const employee of targetEmployees) {
        try {
          // Update employee salary
          const updateData = {
            employeeId: employee.employeeId,
            salary: workRate
          };

          await axios.post(endpoint + "/employee/updateemployees", updateData);
          successCount++;
        } catch (error) {
          console.error(`Error updating employee ${employee.employeeId}:`, error);
          errorCount++;
        }
      }

      // Show result
      if (errorCount === 0) {
        Swal.fire({
          icon: 'success',
          title: 'ส่งค่าแรงสำเร็จ',
          text: `อัพเดตค่าแรงของพนักงาน ${successCount} คน เป็น ${parseFloat(workRate).toLocaleString()} บาท`
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'ส่งค่าแรงบางส่วน',
          html: `
            <p>สำเร็จ: ${successCount} คน</p>
            <p>ไม่สำเร็จ: ${errorCount} คน</p>
          `
        });
      }

    } catch (error) {
      console.error('Error sending work rate:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งค่าแรงได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  };

  // Function to reset customWorkplace and sync workplace settings to all employees
  const syncWorkplaceToAllEmployees = async () => {
    try {
      // ตรวจสอบว่ามีข้อมูลหน่วยงาน
      if (!workplaceId || !_id) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่พบข้อมูลหน่วยงาน',
          text: 'กรุณาเลือกหน่วยงานก่อนทำการซิงค์'
        });
        return;
      }

      // กรองพนักงานจาก employeeList ที่อยู่ในหน่วยงานเดียวกัน
      const employees = employeeList.filter(
        (employee) => employee.workplace === workplaceId
      );

      if (!employees || employees.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่พบพนักงาน',
          text: 'ไม่พบพนักงานในหน่วยงานนี้'
        });
        return;
      }

      // สร้าง HTML สำหรับ checkbox list
      const employeeCheckboxHTML = `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
            <label style="cursor: pointer; font-weight: bold;">
              <input type="checkbox" id="selectAll" style="margin-right: 8px; cursor: pointer;" />
              เลือกทั้งหมด (${employees.length} คน)
            </label>
          </div>
          ${employees.map((emp, index) => `
            <div style="padding: 8px; border-bottom: 1px solid #eee;">
              <label style="cursor: pointer; display: block;">
                <input 
                  type="checkbox" 
                  class="employee-checkbox" 
                  value="${emp.employeeId}" 
                  style="margin-right: 8px; cursor: pointer;"
                  ${emp.customWorkplace ? 'checked' : ''}
                />
                <strong>${emp.employeeId}</strong> - ${emp.name} ${emp.lastname || ''}
                ${emp.customWorkplace ? '<span style="color: orange; font-size: 12px;"> (มีการตั้งค่าเฉพาะบุคคล)</span>' : '<span style="color: green; font-size: 12px;"> (ใช้ค่าหน่วยงาน)</span>'}
              </label>
            </div>
          `).join('')}
        </div>
      `;

      // แสดง confirmation dialog พร้อม checkbox
      const confirmResult = await Swal.fire({
        title: 'เลือกพนักงานที่ต้องการซิงค์',
        html: `
          <div style="text-align: left;">
            <p>หน่วยงาน: <strong>${workplaceName}</strong> (${workplaceId})</p>
            <p style="color: red; font-weight: bold;">⚠️ การดำเนินการนี้จะลบการตั้งค่าเฉพาะบุคคลของพนักงานที่เลือกและใช้ค่าจากหน่วยงานแทน</p>
            <hr style="margin: 15px 0;" />
            ${employeeCheckboxHTML}
          </div>
        `,
        icon: 'question',
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'ยืนยันการซิงค์',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        reverseButtons: true,
        didOpen: () => {
          // จัดการ Select All checkbox
          const selectAllCheckbox = document.getElementById('selectAll');
          const employeeCheckboxes = document.querySelectorAll('.employee-checkbox');
          
          selectAllCheckbox.addEventListener('change', (e) => {
            employeeCheckboxes.forEach(cb => {
              cb.checked = e.target.checked;
            });
          });

          // อัพเดท Select All เมื่อมีการเปลี่ยนแปลง checkbox แต่ละตัว
          employeeCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
              const allChecked = Array.from(employeeCheckboxes).every(checkbox => checkbox.checked);
              const someChecked = Array.from(employeeCheckboxes).some(checkbox => checkbox.checked);
              selectAllCheckbox.checked = allChecked;
              selectAllCheckbox.indeterminate = someChecked && !allChecked;
            });
          });

          // ตั้งค่าเริ่มต้นของ Select All
          const initialAllChecked = Array.from(employeeCheckboxes).every(checkbox => checkbox.checked);
          const initialSomeChecked = Array.from(employeeCheckboxes).some(checkbox => checkbox.checked);
          selectAllCheckbox.checked = initialAllChecked;
          selectAllCheckbox.indeterminate = initialSomeChecked && !initialAllChecked;
        },
        preConfirm: () => {
          const selectedCheckboxes = document.querySelectorAll('.employee-checkbox:checked');
          const selectedEmployeeIds = Array.from(selectedCheckboxes).map(cb => cb.value);
          
          if (selectedEmployeeIds.length === 0) {
            Swal.showValidationMessage('กรุณาเลือกพนักงานอย่างน้อย 1 คน');
            return false;
          }
          
          return selectedEmployeeIds;
        }
      });

      if (!confirmResult.isConfirmed || !confirmResult.value) {
        return;
      }

      const selectedEmployeeIds = confirmResult.value;

      // Show loading
      Swal.fire({
        title: 'กำลังซิงค์ข้อมูล...',
        text: `กำลังซิงค์ข้อมูลให้กับพนักงาน ${selectedEmployeeIds.length} คน`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      // Loop through selected employees only
      const selectedEmployees = employees.filter(emp => selectedEmployeeIds.includes(emp.employeeId));
      
      for (const employee of selectedEmployees) {
        try {
          // ลบ customWorkplace (ส่ง null หรือ empty object)
          await axios.delete(`${endpoint}/employee/${employee.employeeId}/custom-workplace`);
          successCount++;
        } catch (error) {
          // ถ้าไม่มี customWorkplace อยู่แล้ว ให้ skip
          if (error.response && error.response.status === 404) {
            skippedCount++;
          } else {
            console.error(`Error resetting employee ${employee.employeeId}:`, error);
            errorCount++;
          }
        }
      }

      // Show result
      Swal.fire({
        icon: errorCount === 0 ? 'success' : 'warning',
        title: 'ซิงค์ข้อมูลเสร็จสิ้น',
        html: `
          <p>ผลการซิงค์ (เลือก ${selectedEmployeeIds.length} คน):</p>
          <p>✅ ลบการตั้งค่าเฉพาะบุคคลสำเร็จ: <strong>${successCount}</strong> คน</p>
          <p>⏭️ ไม่มีการตั้งค่าเฉพาะบุคคลอยู่แล้ว: <strong>${skippedCount}</strong> คน</p>
          ${errorCount > 0 ? `<p style="color: red;">❌ ไม่สำเร็จ: <strong>${errorCount}</strong> คน</p>` : ''}
          <br>
          <p style="color: green;">พนักงานที่เลือกจะใช้ค่าการตั้งค่าจากหน่วยงาน <strong>${workplaceName}</strong></p>
        `,
        confirmButtonText: 'ตกลง'
      });

    } catch (error) {
      console.error('Error syncing workplace to employees:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถซิงค์ข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  };

  // Function to sync wage rates (OT, dayoff, holiday) to employees
  const syncWageRatesToEmployees = async () => {
    try {
      // Step 1: Ask for secret key
      const secretKeyResult = await Swal.fire({
        title: '🔐 ยืนยันตัวตน',
        html: '<p>กรุณาใส่รหัสลับเพื่อใช้งานฟีเจอร์นี้</p>',
        input: 'password',
        inputPlaceholder: 'ใส่รหัสลับ',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
          if (!value) {
            return 'กรุณาใส่รหัสลับ!';
          }
          if (value !== '8888') {
            return 'รหัสลับไม่ถูกต้อง!';
          }
        }
      });

      if (!secretKeyResult.isConfirmed) {
        return;
      }

      // ตรวจสอบว่ามีข้อมูลหน่วยงาน
      if (!workplaceId || !_id) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่พบข้อมูลหน่วยงาน',
          text: 'กรุณาเลือกหน่วยงานก่อนทำการซิงค์'
        });
        return;
      }

      // กรองพนักงานจาก employeeList ที่อยู่ในหน่วยงานเดียวกัน
      const employees = employeeList.filter(
        (employee) => employee.workplace === workplaceId
      );

      if (!employees || employees.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่พบพนักงาน',
          text: 'ไม่พบพนักงานในหน่วยงานนี้'
        });
        return;
      }

      // Step 2: Select which fields to sync
      const fieldsResult = await Swal.fire({
        title: '📋 เลือกข้อมูลที่ต้องการซิงค์',
        html: `
          <div style="text-align: left; padding: 15px;">
            <p style="margin-bottom: 15px; color: #666;">
              <i class="fas fa-info-circle"></i> เลือกข้อมูลที่ต้องการส่งให้พนักงาน
            </p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <div style="margin-bottom: 12px;">
                <label style="cursor: pointer; display: flex; align-items: center; padding: 8px;">
                  <input type="checkbox" id="sync_workRateOT" class="field-checkbox" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;" checked />
                  <div>
                    <strong>OT รายชั่วโมง (กี่เท่า)</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 3px;">ค่า: ${workRateOT || 'ไม่ได้กำหนด'} เท่า</div>
                  </div>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="cursor: pointer; display: flex; align-items: center; padding: 8px;">
                  <input type="checkbox" id="sync_dayoffRateHour" class="field-checkbox" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;" checked />
                  <div>
                    <strong>วันหยุดประจำสัปดาห์รายชั่วโมง (กี่เท่า)</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 3px;">ค่า: ${dayoffRateHour || 'ไม่ได้กำหนด'} เท่า</div>
                  </div>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="cursor: pointer; display: flex; align-items: center; padding: 8px;">
                  <input type="checkbox" id="sync_dayoffRateOT" class="field-checkbox" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;" checked />
                  <div>
                    <strong>OT วันหยุดประจำสัปดาห์รายชั่วโมง (กี่เท่า)</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 3px;">ค่า: ${dayoffRateOT || 'ไม่ได้กำหนด'} เท่า</div>
                  </div>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="cursor: pointer; display: flex; align-items: center; padding: 8px;">
                  <input type="checkbox" id="sync_holidayHour" class="field-checkbox" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;" checked />
                  <div>
                    <strong>วันหยุดนักขัตฤกษ์ รายชั่วโมง (กี่เท่า)</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 3px;">ค่า: ${holidayHour || 'ไม่ได้กำหนด'} เท่า</div>
                  </div>
                </label>
              </div>
              <div style="margin-bottom: 12px;">
                <label style="cursor: pointer; display: flex; align-items: center; padding: 8px;">
                  <input type="checkbox" id="sync_holidayOT" class="field-checkbox" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;" checked />
                  <div>
                    <strong>วันหยุดนักขัตฤกษ์ OT รายชั่วโมง (กี่เท่า)</strong>
                    <div style="color: #666; font-size: 13px; margin-top: 3px;">ค่า: ${holidayOT || 'ไม่ได้กำหนด'} เท่า</div>
                  </div>
                </label>
              </div>
            </div>
            <div style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; border-radius: 4px;">
              <small style="color: #856404;">
                <i class="fas fa-exclamation-triangle"></i> ค่าที่เลือกจะถูกส่งไปแทนที่ค่าเดิมของพนักงานที่เลือก
              </small>
            </div>
          </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: 'ถัดไป',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
          const selectedFields = {};
          const checkboxes = document.querySelectorAll('.field-checkbox:checked');
          
          if (checkboxes.length === 0) {
            Swal.showValidationMessage('กรุณาเลือกข้อมูลอย่างน้อย 1 รายการ');
            return false;
          }
          
          checkboxes.forEach(cb => {
            const fieldName = cb.id.replace('sync_', '');
            selectedFields[fieldName] = true;
          });
          
          return selectedFields;
        }
      });

      if (!fieldsResult.isConfirmed || !fieldsResult.value) {
        return;
      }

      const selectedFields = fieldsResult.value;

      // Step 3: Select employees
      const employeeCheckboxHTML = `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 15px;">
          <div style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
            <label style="cursor: pointer; font-weight: bold;">
              <input type="checkbox" id="selectAll" style="margin-right: 8px; cursor: pointer; width: 18px; height: 18px;" />
              เลือกทั้งหมด (${employees.length} คน)
            </label>
          </div>
          ${employees.map((emp, index) => `
            <div style="padding: 8px; border-bottom: 1px solid #eee;">
              <label style="cursor: pointer; display: block;">
                <input 
                  type="checkbox" 
                  class="employee-checkbox" 
                  value="${emp.employeeId}" 
                  style="margin-right: 8px; cursor: pointer; width: 18px; height: 18px;"
                  checked
                />
                <strong>${emp.employeeId}</strong> - ${emp.name} ${emp.lastname || ''}
                <span style="color: #6c757d; font-size: 12px;"> (${emp.jobtype || 'ไม่ระบุ'})</span>
              </label>
            </div>
          `).join('')}
        </div>
      `;

      const employeesResult = await Swal.fire({
        title: '👥 เลือกพนักงาน',
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 10px;">หน่วยงาน: <strong>${workplaceName}</strong></p>
            <div style="background-color: #e7f3ff; padding: 10px; border-left: 4px solid #2196F3; border-radius: 4px; margin-bottom: 15px;">
              <strong>ข้อมูลที่จะส่ง:</strong>
              <ul style="margin: 8px 0; padding-left: 20px;">
                ${selectedFields.workRateOT ? `<li>OT รายชั่วโมง: <strong>${workRateOT}</strong> เท่า</li>` : ''}
                ${selectedFields.dayoffRateHour ? `<li>วันหยุดประจำสัปดาห์: <strong>${dayoffRateHour}</strong> เท่า</li>` : ''}
                ${selectedFields.dayoffRateOT ? `<li>OT วันหยุดประจำสัปดาห์: <strong>${dayoffRateOT}</strong> เท่า</li>` : ''}
                ${selectedFields.holidayHour ? `<li>วันหยุดนักขัตฤกษ์: <strong>${holidayHour}</strong> เท่า</li>` : ''}
                ${selectedFields.holidayOT ? `<li>OT วันหยุดนักขัตฤกษ์: <strong>${holidayOT}</strong> เท่า</li>` : ''}
              </ul>
            </div>
            ${employeeCheckboxHTML}
          </div>
        `,
        icon: 'question',
        width: '700px',
        showCancelButton: true,
        confirmButtonText: 'ยืนยันและส่งข้อมูล',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        reverseButtons: true,
        didOpen: () => {
          // จัดการ Select All checkbox
          const selectAllCheckbox = document.getElementById('selectAll');
          const employeeCheckboxes = document.querySelectorAll('.employee-checkbox');
          
          selectAllCheckbox.addEventListener('change', (e) => {
            employeeCheckboxes.forEach(cb => {
              cb.checked = e.target.checked;
            });
          });

          // อัพเดท Select All เมื่อมีการเปลี่ยนแปลง checkbox แต่ละตัว
          employeeCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
              const allChecked = Array.from(employeeCheckboxes).every(checkbox => checkbox.checked);
              const someChecked = Array.from(employeeCheckboxes).some(checkbox => checkbox.checked);
              selectAllCheckbox.checked = allChecked;
              selectAllCheckbox.indeterminate = someChecked && !allChecked;
            });
          });

          // ตั้งค่าเริ่มต้นของ Select All
          selectAllCheckbox.checked = true;
        },
        preConfirm: () => {
          const selectedCheckboxes = document.querySelectorAll('.employee-checkbox:checked');
          const selectedEmployeeIds = Array.from(selectedCheckboxes).map(cb => cb.value);
          
          if (selectedEmployeeIds.length === 0) {
            Swal.showValidationMessage('กรุณาเลือกพนักงานอย่างน้อย 1 คน');
            return false;
          }
          
          return selectedEmployeeIds;
        }
      });

      if (!employeesResult.isConfirmed || !employeesResult.value) {
        return;
      }

      const selectedEmployeeIds = employeesResult.value;

      // Show loading
      Swal.fire({
        title: 'กำลังส่งข้อมูล...',
        html: `กำลังซิงค์ข้อมูลให้กับพนักงาน <strong>${selectedEmployeeIds.length}</strong> คน`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare update data for customWorkplace
      const customWorkplaceData = {};
      if (selectedFields.workRateOT) customWorkplaceData.workRateOT = workRateOT;
      if (selectedFields.dayoffRateHour) customWorkplaceData.dayoffRateHour = dayoffRateHour;
      if (selectedFields.dayoffRateOT) customWorkplaceData.dayoffRateOT = dayoffRateOT;
      if (selectedFields.holidayHour) customWorkplaceData.holidayHour = holidayHour;
      if (selectedFields.holidayOT) customWorkplaceData.holidayOT = holidayOT;

      let successCount = 0;
      let errorCount = 0;
      let createdCount = 0;
      let updatedCount = 0;

      // Update selected employees
      for (const employeeId of selectedEmployeeIds) {
        try {
          // Step 1: ดึง customWorkplace ที่มีอยู่ หรือสร้างจาก workplace
          let existingCustomWorkplace = {};
          let isNewlyCreated = false;

          try {
            // พยายามดึง customWorkplace ที่มีอยู่
            const getResponse = await axios.get(`${endpoint}/employee/${employeeId}/custom-workplace`);
            existingCustomWorkplace = getResponse.data.customWorkplace || {};
          } catch (getError) {
            // ถ้าไม่มี customWorkplace ให้สร้างจาก workplace
            if (getError.response && getError.response.status === 404) {
              // ไม่มี customWorkplace ยัง - ให้ส่งข้อมูลว่างๆ ไปก่อน แล้ว API จะ merge เอง
              isNewlyCreated = true;
              existingCustomWorkplace = {};
            } else {
              throw getError; // ถ้าเป็น error อื่นให้ throw ต่อ
            }
          }

          // Step 2: Merge ข้อมูลเดิมกับข้อมูลใหม่
          const mergedCustomWorkplace = {
            ...existingCustomWorkplace,
            ...customWorkplaceData
          };

          // Step 3: บันทึก customWorkplace ที่ merge แล้ว
          await axios.put(`${endpoint}/employee/${employeeId}/custom-workplace`, {
            customWorkplace: mergedCustomWorkplace
          });

          successCount++;
          if (isNewlyCreated) {
            createdCount++;
          } else {
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error updating employee ${employeeId}:`, error);
          errorCount++;
        }
      }

      // Show result
      Swal.fire({
        icon: errorCount === 0 ? 'success' : 'warning',
        title: 'ซิงค์ข้อมูลเสร็จสิ้น',
        html: `
          <div style="text-align: left; padding: 15px;">
            <p style="font-size: 16px; margin-bottom: 15px;">
              <strong>ผลการซิงค์:</strong> (เลือก ${selectedEmployeeIds.length} คน)
            </p>
            <div style="background-color: #d4edda; padding: 12px; border-left: 4px solid #28a745; border-radius: 4px; margin-bottom: 10px;">
              <p style="margin: 0; color: #155724;">
                <i class="fas fa-check-circle"></i> <strong>สำเร็จ:</strong> ${successCount} คน
              </p>
              ${createdCount > 0 ? `
                <p style="margin: 5px 0 0 0; color: #155724; font-size: 14px;">
                  <i class="fas fa-plus-circle"></i> สร้างการตั้งค่าส่วนบุคคลใหม่: ${createdCount} คน
                </p>
              ` : ''}
              ${updatedCount > 0 ? `
                <p style="margin: 5px 0 0 0; color: #155724; font-size: 14px;">
                  <i class="fas fa-edit"></i> อัพเดทการตั้งค่าส่วนบุคคลที่มีอยู่: ${updatedCount} คน
                </p>
              ` : ''}
            </div>
            ${errorCount > 0 ? `
              <div style="background-color: #f8d7da; padding: 12px; border-left: 4px solid #dc3545; border-radius: 4px; margin-bottom: 10px;">
                <p style="margin: 0; color: #721c24;">
                  <i class="fas fa-times-circle"></i> <strong>ไม่สำเร็จ:</strong> ${errorCount} คน
                </p>
              </div>
            ` : ''}
            <div style="background-color: #fff3cd; padding: 12px; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 10px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <i class="fas fa-info-circle"></i> พนักงานที่อัพเดทจะมี<strong>การตั้งค่าส่วนบุคคล</strong> และไม่ได้รับผลกระทบจากการเปลี่ยนค่าที่หน่วยงาน
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; margin-top: 15px;">
              <p style="margin: 0; font-size: 14px; color: #495057;">
                <strong>ข้อมูลที่ถูกอัพเดทใน customWorkplace:</strong>
              </p>
              <ul style="margin: 8px 0; padding-left: 20px; font-size: 14px;">
                ${selectedFields.workRateOT ? `<li>OT รายชั่วโมง → <strong>${workRateOT}</strong> เท่า</li>` : ''}
                ${selectedFields.dayoffRateHour ? `<li>วันหยุดประจำสัปดาห์ → <strong>${dayoffRateHour}</strong> เท่า</li>` : ''}
                ${selectedFields.dayoffRateOT ? `<li>OT วันหยุดประจำสัปดาห์ → <strong>${dayoffRateOT}</strong> เท่า</li>` : ''}
                ${selectedFields.holidayHour ? `<li>วันหยุดนักขัตฤกษ์ → <strong>${holidayHour}</strong> เท่า</li>` : ''}
                ${selectedFields.holidayOT ? `<li>OT วันหยุดนักขัตฤกษ์ → <strong>${holidayOT}</strong> เท่า</li>` : ''}
              </ul>
            </div>
          </div>
        `,
        width: '600px',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#28a745'
      });

    } catch (error) {
      console.error('Error syncing wage rates to employees:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถซิงค์ข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  };

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
    setDateStartContract(workplace.dateStartContract);
    setDateEndContract(workplace.dateEndContract);
    setServiceFeePerMonth(workplace.serviceFeePerMonth);

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
setWorkRateChange(workplace.workRateChange)

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
    setDateStartContract("");
    setDateEndContract("");
    setServiceFeePerMonth("");
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
    workRate: "ค่าจ้างรายวัน",
    dateStartContract: "วันเริ่มสัญญา",
    dateEndContract: "วันสิ้นสุดสัญญา",
    serviceFeePerMonth: "ค่าบริการรายเดือน"
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

  return (
    <div class="hold-transition sidebar-mini" className="editlaout">
      <div class="wrapper">
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#"> การตั้งค่า</a>
            </li>
            <li class="breadcrumb-item active">ตั้งค่าหน่วยงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ตั้งค่าหน่วยงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
                    <!-- Main content --> */}
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ตั้งค่าหน่วยงาน</h2>
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
                            onChange={(e) =>
                              setSearchWorkplaceId(e.target.value)
                            }
                          /> */}
                          <input
                            type="text"
                            className="form-control"
                            id="searchWorkplaceId"
                            list="workplaceIds" // Associate the datalist with the input
                            placeholder="รหัสหน่วยงาน"
                            value={searchWorkplaceId}
                            onChange={(e) =>
                              setSearchWorkplaceId(e.target.value)
                            }
                            onInput={(e) => {
                              // Remove any non-digit characters
                            
                            }}
                          />
                          <datalist id="workplaceIds">
                            {workplaceList.map((workplace) => (
                              <option
                                key={workplace.workplaceId}
                                value={workplace.workplaceId}
                              >
                                {workplace.workplaceId}
                              </option>
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="searchWorkplaceName">ชื่อหน่วยงาน</label>
                          <input
                            type="text"
                            class="form-control"
                            id="searchWorkplaceName"
                            placeholder="ชื่อหน่วยงาน"
                            value={searchWorkplaceName}
                            onChange={(e) =>
                              setSearchWorkplaceName(e.target.value)
                            }
                          />
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
                  {/* <div class="d-flex justify-content-center">
                                        <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                                    </div> */}
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
              </section>
              {/* <!--Frame--> */}
              {/* <form onSubmit={handleManageWorkplace}> */}
              <form onSubmit={handleFormSubmit}>
                <h2 class="title">ตั้งค่าหน่วยงาน</h2>
                <section class="Frame">
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
                              // Remove any non-digit characters
                             
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

                      <div class="col-md-4">
                        <div class="form-group">
                          <label role="dateStartContract">วันเริ่มสัญญา<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="date"
                            class="form-control"
                            id="dateStartContract"
                            placeholder="วันเริ่มสัญญา"
                            value={dateStartContract}
                            onChange={(e) => setDateStartContract(e.target.value)}
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label role="dateEndContract">วันสิ้นสุดสัญญา<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="date"
                            class="form-control"
                            id="dateEndContract"
                            placeholder="วันสิ้นสุดสัญญา"
                            value={dateEndContract}
                            onChange={(e) => setDateEndContract(e.target.value)}
                          />
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group">
                          <label role="serviceFeePerMonth">ค่าบริการต่อเดือน<span style={{ color: "red" }}>*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            id="serviceFeePerMonth"
                            placeholder="ค่าบริการต่อเดือน"
                            value={serviceFeePerMonth ? Number(serviceFeePerMonth).toLocaleString('en-US') : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '' || !isNaN(value)) {
                                setServiceFeePerMonth(value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {/* <!--Frame--> */}

                <h2 class="title">เวลาทำงาน</h2>
                <section class="Frame">
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
                            // Remove any non-digit characters, including '.'
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        {/* <label role="workOfOT">-</label> */}
                        <input
                          type="text"
                          class="form-control"
                          id="startOTMinute"
                          placeholder="นาที"
                          value={startWorkOfOTMinute}
                          onChange={(e) => setStartWorkOfOTMinute(e.target.value)}
                          onInput={(e) => {
                            // Remove any non-digit characters, including '.'
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
                            // Remove any non-digit characters, including '.'
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        {/* <label role="workOfOT">-</label> */}
                        <input
                          type="text"
                          // style={{ marginBottom: "0rem" }}
                          class="form-control "
                          id="workOfMinute"
                          placeholder="นาที"
                          value={workOfMinute}
                          onChange={(e) => setWorkOfMinute(e.target.value)}
                          onInput={(e) => {
                            // Remove any non-digit characters, including '.'
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
                            // Remove any non-digit characters, including '.'
                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group">
                        {/* <label role="workOfOT">-</label> */}
                        <input
                          type="text"
                          class="form-control"
                          id="endOTMinute"
                          placeholder="นาที"
                          value={workOfOTMinute}
                          onChange={(e) => setWorkOfOTMinute(e.target.value)}
                          onInput={(e) => {
                            // Remove any non-digit characters, including '.'
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
                            {/* Show input if customset is selected */}
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
                </section>
                {/* <!--Frame--> */}
                <h2 class="title">ค่าจ้าง</h2>
                <section class="Frame">
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
                          id="workRateHourly"
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
                          id="workRateOTBaht"
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
                          id="dayoffRateHourBaht"
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
                          id="dayoffRateOTBaht"
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
                          id="holidayHourBaht"
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
                          id="holidayOTBaht"
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
                 <label>ส่งค่าแรงไปยังพนักงานในหน่วยงาน</label>
                    <div className="row">
                       <div className="col-md-3">
                           <input
                          type="text"
                          class="form-control"
                          id="currentWorkRateDisplay"
                          placeholder="บาท"
                          value={parseFloat(workRate || '0')}
                          readOnly
                        />
                        </div>
                        <div className="col-md-3">
                          
                          <button className="btn btn-primary" 
                          onClick={() => sendWorkRate()}> <i className="fas fa-paper-plane"></i>  ส่งค่าแรง
                           
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button 
                            className="btn btn-warning" 
                            onClick={() => syncWorkplaceToAllEmployees()}
                            title="ส่งการตั้งค่าหน่วยงานใหม่ให้พนักงานทั้งหมด (ลบการตั้งค่าเฉพาะบุคคล)"
                          >
                            <i className="fas fa-sync-alt"></i> ซิงค์การตั้งค่าหน่วยงาน
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button 
                            className="btn btn-success" 
                            onClick={() => syncWageRatesToEmployees()}
                            title="ส่งค่าเท่าต่างๆ (OT, วันหยุด) ไปให้พนักงานในหน่วยงาน"
                          >
                            <i className="fas fa-sync"></i> ซิงค์ค่าเท่าต่างๆ
                          </button>
                        </div>
                    </div>
                  <div>
                    
                  </div>

<div class="col-md-4">

<div>


                      
                    {/* <label>วันเริ่มต้นคำนวณ:</label> */}
                    

                    <div class="form-control-static">
                      
                      <div className="row">
                        
                       
                        
                        {/* <div className="col-md-3">
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
                        </div> */}
                        {/* <div className="col-md-3">
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
                        </div> */}

                        {/* <div className="col-md-3">
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
                        </div> */}
                      </div></div>
                      </div>
                      </div>
                      


             

          
                </section>

                 <h2 className="title">เงินสงเคราะห์ลูกจ้าง</h2>
                <section className="Frame">
                  <div className="row">
                        {/* <div className="col-md-3">
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
                        </div> */}
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Rate สำหรับเงินสงเคราะห์ลูกจ้าง</label>
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
                </section>

                {/* <!--Frame--> */}
                <h2 class="title">สวัสดิการเงินเพิ่มพนักงาน</h2>
                <section class="Frame">
                  {formData.addSalary &&
                    formData.addSalary.length > 0 &&
                    formData.addSalary.map((data, index) => {
                      
                      if (data.codeSpSalary === ".") {
                        return null;
                      }
                      
                      return (
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
                                // Check for restricted codes (leave-related welfare codes)
                                const restrictedCodes = [
                                  "1428", // ลากิจธุระจำเป็น(ประกันสังคม)
                                  "1429", // ลากิจธุระจำเป็น(ปกส)รับล่วงหน้า
                                  "1231", // จ่ายลาป่วยมีใบแพทย์
                                  "1234", // จ่ายลาป่วยมีใบรับรองแพทย์(รับล่วงหน้า)
                                  "1235", // ค่าจ้างวันลาป่วย
                                  "1422", // จ่ายคืนพักร้อน(ครบปี/ใช้สิทธิไม่หมด)
                                  "1423", // ชดเชยวันลาพักร้อน (ประกันสังคม)
                                  "1425", // ค่าจ้างในวันลาพักร้อน
                                  "1426", // จ่ายคืนค่าจ้างพักร้อน(ครบปี/ใช้สิทธิไม่หมด)
                                  "1427", // ชดเชยวันลาพักร้อน(ประกันสังคม)รับล่วงหน้า
                                  "1435", // จ่ายคืนพักร้อน(ครบปี/ใช้สิทธิไม่หมด)รับล่วงหน้า
                                  "1233", // ชดเชยค่าแรงลาคลอด
                                ];
                                if (restrictedCodes.includes(e.target.value)) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "ไม่อนุญาตให้กรอกรหัสนี้",
                                    text: "เป็นสวัสดิการเช็คตามคนอยู่แล้ว",
                                    confirmButtonText: "รับทราบ",
                                  });
                                  e.target.value = ""; // Clear the input
                                  return;
                                }

                                // Ensure only one '.' is allowed
                                const parts = e.target.value.split(".");
                                if (parts.length > 2) {
                                  e.target.value = `${parts[0]}.${parts[1]}`; // Keep only the first two parts
                                }
                              }}
                            />
                          </div>
                          {/* <div className="col-md-1">
                                                <label role="SpSalary">จำนวนเงิน</label>
                                                <input
                                                    type="text"
                                                    name="SpSalary"
                                                    className="form-control"
                                                    value={data.SpSalary}
                                                    onChange={(e) => handleChangeSpSalary(e, index, 'SpSalary')}
                                                />
                                            </div> */}
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
                        {/* <div className="row">
                                                <div className="col-md-6">
                                                    <label role="codeSpSalary">New</label>
                                                    <input
                                                        type="text"
                                                        name="codeSpSalary"
                                                        className="form-control"
                                                        value={data.codeSpSalary}
                                                        onChange={(e) => handleChangeSpSalary(e, index, 'codeSpSalary')}
                                                    />
                                                </div>
                                            </div> */}
                      </div>
                      );
                    })}
                  <br />
                  <button
                    type="button"
                    onClick={handleAddInput}
                    className="btn btn-primary"
                  >
                    เพิ่ม
                  </button>
                  {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                </section>

                {/* <!--Frame--> */}
                <h2 class="title"> สวัสดิการวันหยุดพนักงาน</h2>
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
                        {/* <!--row--> */}
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
                        {/* <!--row--> */}
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
                        {/* <!--row--> */}
                      </div>
                    </section>
                    {/* <!--Frame--> */}
                  </div>
                </div>

                <h2 class="title">ตั้งค่าวันทํางาน</h2>
                <section class="Frame">
                  <div class="row">
                    <div class="col-md-1">ตั้งแต่</div>
                    <div class="col-md-1">ถึงวันที่</div>
                    <div class="col-md-1">ทำงาน/หยุด</div>
                    <div class="col-md-9">
                      <div class="row">
                        <div class="col-md-1">กะ</div>
                
                        <div class="col-md-1">เข้า OT ก่อน</div>
                        <div class="col-md-1">ออก OT ก่อน</div>
                        <div class="col-md-1">เวลาเข้า</div>
                        <div class="col-md-1">เวลาออก</div>
                        <div class="col-md-1">เวลาเข้าOT</div>
                        <div class="col-md-1">เวลาออกOT</div>
                        <div class="col-md-1">จำนวนคน</div>
                        <div class="col-md-2">หมายเหตุ</div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-1">
                      <select
                        name="startDay"
                        className="form-control"
                        value={workTimeDay.startDay}
                        onChange={handleInputChange}
                      >
                        <option value="">เลือก</option>
                        {daysOfWeek.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-md-1">
                      <select
                        name="endDay"
                        className="form-control"
                        value={workTimeDay.endDay}
                        onChange={handleInputChange}
                      >
                        <option value="">เลือก</option>
                        {daysOfWeek.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-md-1">
                      <select
                        name="workOrStop"
                        className="form-control"
                        value={workTimeDay.workOrStop}
                        onChange={handleInputChange}
                      >
                        <option value="">เลือก</option>
                        <option value="work">ทำงาน</option>
                        <option value="stop">หยุด</option>
                      </select>
                    </div>
                    <div class="col-md-9">
                      {workTimeDay.allTimes.map((time, index) => (
                        <div key={index}>
                          <div class="row">
                            <div class="col-md-1">
                              <select
                                name="shift"
                                className="form-control"
                                value={time.shift}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "shift",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">เลือกกะ</option>
                                {shiftWork.map((day, index) => (
                                  <option key={index} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="เช่น 06:00"
                                value={time.beforeStartTimeOT || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "beforeStartTimeOT",
                                    e.target.value
                                  )
                                }
                                onInput={(e) => {
                                  // Format as HH:MM
                                  let value = e.target.value.replace(/[^0-9]/g, "");
                                  if (value.length >= 3) {
                                    value = value.substring(0, 2) + ":" + value.substring(2, 4);
                                  }
                                  e.target.value = value;
                                }}
                              />
                            </div>
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="เช่น 08:00"
                                value={time.beforeEndTimeOT || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "beforeEndTimeOT",
                                    e.target.value
                                  )
                                }
                                onInput={(e) => {
                                  // Format as HH:MM
                                  let value = e.target.value.replace(/[^0-9]/g, "");
                                  if (value.length >= 3) {
                                    value = value.substring(0, 2) + ":" + value.substring(2, 4);
                                  }
                                  e.target.value = value;
                                }}
                              />
                            </div>
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder={`Start Time ${index + 1}`}
                                value={time.startTime}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
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
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder={`End Time ${index + 1}`}
                                value={time.endTime}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
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
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder={`Start Time OT ${index + 1}`}
                                value={time.startTimeOT}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "startTimeOT",
                                    e.target.value
                                  )
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
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder={`End Time OT ${index + 1}`}
                                value={time.endTimeOT}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "endTimeOT",
                                    e.target.value
                                  )
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
                            <div class="col-md-1">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="จำนวนคน"

                                value={time.numberOfPeople || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "numberOfPeople",
                                    e.target.value
                                  )
                                }
                                onInput={(e) => {
                                  // Allow only numbers
                                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }}
                              />
                            </div>
                            <div class="col-md-2">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="หมายเหตุ"
                                value={time.Remark || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    "Remark",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {/* <span>Result OT: {time.resultOT}</span> */}
                            <div class="col-md-1">
                              {index >= 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-danger ml-auto"
                                  style={{ width: "2.5rem" }}
                                  onClick={() => handleRemoveTime(index)}
                                >
                                  ลบ
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    aria-label="เพิ่มเวลาทำงาน"
                                    onClick={handleAddTime}
                                    className="btn btn-primary"
                                    style={{ width: "2.5rem" }}
                                  >
                                    <i class="fa">&#xf067;</i>
                                  </button>
                                </>
                              )}
                            </div>
                            {/* <span>Result OT: {time.resultOT}</span> */}
                          </div>
                          <br />
                        </div>
                      ))}
                    </div>
                    {/* <div class="col-md-1">
                                            <button type="button" aria-label="เพิ่มเวลาทำงาน" onClick={handleAddTime} className="btn btn-primary" style={{ width: '2rem' }}>
                                                <i class="fa">&#xf067;</i>
                                            </button>
                                        </div> */}
                  </div>
                  <br />
                  {/* <button onClick={() => console.log(workTimeDay)}>Submit</button> */}
                  <div class="row">
                    {/* ... (Your other components) ... */}
                    <button
                      type="button"
                      aria-label="เพิ่มรายการวันทำงาน"
                      className="btn btn-primary ml-auto"
                      onClick={handleAddTimeList}
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
                        <th style={headerCellStyle}>ทำงาน/หยุด</th>
                        <th style={headerCellStyle}>กะ</th>
                      
                        <th style={headerCellStyle}>เวลาเข้า</th>
                        <th style={headerCellStyle}>เวลาออก</th>
                        <th style={headerCellStyle}>ชม.</th>
                        <th style={headerCellStyle}>เวลาเข้าOT</th>
                        <th style={headerCellStyle}>เวลาออกOT</th>
                        <th style={headerCellStyle}>ชม.OT</th>
                        <th style={headerCellStyle}>จำนวนคน</th>
                        <th style={headerCellStyle}>หมายเหตุ</th>
                        <th style={headerCellStyle}>แก้ไข</th>
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
                                <td style={cellStyle}>
                                  {editingRow === index ? (
                                    <select
                                      className="form-control mx-auto "
                                      value={editingItem?.startDay || item.startDay}
                                      onChange={(e) => handleEditChange('startDay', e.target.value)}
                                      style={{ width: '50px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                    >
                                      <option value="">เลือก</option>
                                      {daysOfWeek.map((day, idx) => (
                                        <option key={idx} value={day}>{day}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    item.startDay
                                  )}
                                </td>
                                <td style={cellStyle}>
                                  {editingRow === index ? (
                                    <select
                                      className="form-control mx-auto "
                                      value={editingItem?.endDay || item.endDay}
                                      onChange={(e) => handleEditChange('endDay', e.target.value)}
                                    >
                                      <option value="">เลือก</option>
                                      {daysOfWeek.map((day, idx) => (
                                        <option key={idx} value={day}>{day}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    item.endDay
                                  )}
                                </td>
                              </>
                            )}

                            <td style={cellStyle}>
                              {editingRow === index ? (
                                <select
                                  className="form-control mx-auto "
                                  value={editingItem?.workOrStop || item.workOrStop}
                                  onChange={(e) => handleEditChange('workOrStop', e.target.value)}
                                >
                                  <option value="">เลือก</option>
                                  <option value="work">ทำงาน</option>
                                  <option value="stop">หยุด</option>
                                </select>
                              ) : (
                                item.workOrStop === "work" ? "ทำงาน" : "หยุด"
                              )}
                            </td>

                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <select
                                  className="form-control mx-auto "
                                  value={editingItem.shift}
                                  onChange={(e) => handleEditChange('shift', e.target.value)}
                                >
                                  <option value="">เลือกกะ</option>
                                  {shiftWork.map((shift, idx) => (
                                    <option key={idx} value={shift}>{shift}</option>
                                  ))}
                                </select>
                              ) : (
                                item1.shift
                              )}
                            </td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control mx-auto "
                                  value={editingItem.startTime}
                                  onChange={(e) => handleEditChange('startTime', e.target.value)}
                                  style={{ width: '50px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                />
                              ) : (
                                item1.startTime
                              )}
                            </td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control mx-auto "
                                  value={editingItem.endTime}
                                  onChange={(e) => handleEditChange('endTime', e.target.value)}
                                  style={{ width: '55px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                />
                              ) : (
                                item1.endTime
                              )}
                            </td>
                            <td style={cellStyle}>{item1.resultTime}</td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control mx-auto "
                                  value={editingItem.startTimeOT}
                                  onChange={(e) => handleEditChange('startTimeOT', e.target.value)}
                                  style={{ width: '70px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                />
                              ) : (
                                item1.startTimeOT
                              )}
                            </td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control mx-auto "
                                  value={editingItem.endTimeOT}
                                  onChange={(e) => handleEditChange('endTimeOT', e.target.value)}
                                  style={{ width: '80px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                />
                              ) : (
                                item1.endTimeOT
                              )}
                            </td>
                            <td style={cellStyle}>{item1.resultTimeOT}</td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control mx-auto "
                                  value={editingItem.numberOfPeople}
                                  style={{ width: '50px', height: '35px', padding: '2px',  textAlign: 'center' }}
                                  onChange={(e) => handleEditChange('numberOfPeople', e.target.value)}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                  }}
                                />
                              ) : (
                                item1.numberOfPeople
                              )}
                            </td>
                            <td style={cellStyle}>
                              {editingRow === index && editingItem ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingItem.Remark}
                                  onChange={(e) => handleEditChange('Remark', e.target.value)}
                                />
                              ) : (
                                item1.Remark
                              )}
                            </td>
                            {index1 > 0 ? (
                              <>
                                <td style={cellStyle}></td>
                              </>
                            ) : (
                              <>
                                <td style={cellStyle}>
                                  {editingRow === index ? (
                                    <div className="btn-group">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(index, index1)}
                                        className="btn btn-success" style={{ fontSize: '12px', padding: '2px 8px', width: '55px' }}
                                      >
                                        แก้
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '50px', height: '24px', marginLeft: '4px' }}
                                      >
                                        ยกเลิก
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleEditClick(index, {...item1})}
                                      className="btn btn-warning"
                                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', width: '50px', height: '24px' }}
                                    >
                                      แก้ไข
                                    </button>
                                  )}
                                </td>
                              </>
                            )}
                            {index1 > 0 ? (
                              <>
                                <td style={cellStyle}></td>
                              </>
                            ) : (
                              <>
                                <td style={cellStyle}>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTimeList(index)}
                                    className="btn btn-danger ml-auto" 
                                    style={{ fontSize: '14px', padding: '2px 8px', width: '50px' }}
                                    disabled={editingRow === index}
                                  >
                                    ลบ
                                  </button>
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

                <h2 class="title">ตั้งค่าคนทํางาน</h2>
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

                              {/* {positionWork.map((position, positionIndex) => (
                                <option key={positionIndex} value={position}>
                                  {position}
                                </option>
                              ))} */}
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
                            {/* <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={`Person ${index + 1}`}
                                                            value={time.countPerson}
                                                            onChange={(e) => handleInputChangePerson(e, index)}
                                                        /> */}
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
                                className="btn btn-danger"
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
                    {/* ... (Your other components) ... */}
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
                        {/* <th style={headerCellStyle, { width: '5rem' }}>ลบ</th> */}
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
                               
                                    className="btn btn-danger" style={{ fontSize: '14px', padding: '2px 8px', width: '50px' }}
                                  >
                                    ลบ
                                  </button>
                                <button
                                  className="btn btn-warning"
                                  type="button"
                                  onClick={() => handleEditTimePersonList(index)}
                                  style={{ fontSize: '14px', padding: '2px 8px', marginLeft: '4px' }}
                                >
                                  แก้ไข
                                </button>                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )}
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </section>

                {/* จัดวันหยุดทั้งสองประเภทให้อยู่ข้างกัน */}
                <div className="row">
                  {/* วันหยุดหน่วยงาน */}
                  <div className="col-md-6">
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
                        
                        {/* แสดงรายการวันหยุดหน่วยงาน */}
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
                  </div>

                  {/* วันหยุดนักขัตฤกษ์ */}
                  <div className="col-md-6">
                    <h2 className="title">
                      วันหยุดนักขัตฤกษ์
                    </h2>
                    <section className="Frame" style={{ minHeight: '450px' }}>
                      <div>
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
                          เพิ่ม
                          </button>
                        </div>

                        <br />
                        
                        {/* แสดงรายการวันหยุดนักขัตฤกษ์ */}
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
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePublicHoliday(holiday)}
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
                  </div>
                </div>

{/* Special work                   */}
<h2 class="title">ตั้งค่าวันทํางานพิเศษ</h2>
<section className="Frame">
      {/* Date Selection */}
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
    
    {/* Selection Dropdown */}
    <div className="col-md-2">
      <select className="form-control">
        <option value="clear">เคลียร์</option>
        <option value="job">จ๊อบ</option>
        <option value="job-speacial">OT จ้างเสริมนอกเวลาสัญญา</option>
      </select>
    </div>

    {/* Textbox */}
   
  </div>

  {/* Work Time Inputs using Bootstrap Grid */}
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


      {/* ✅ Employees Input Section */}
      <h5 className="mt-4">ตำแหน่งและจำนวนคน</h5>
      <div className="d-flex justify-content-start mt-3 mb-4">
      <button type="button" className="btn btn-success" style={{ fontSize: '14px', padding: '2px 8px' }} onClick={handleAddTimePerson_specialwork}>
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


{/* ✅ Display Work Schedule List */}
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

      {/* ✅ Display Work Schedule List */}
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
    </section>
                <section class="Frame">
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
                </section>
                {/* </section> */}

                {/* <h2>Add Image:</h2>
                                <input type="file" onChange={handleChange} />
                                {preview && <img src={preview} style={{ width: '300px', height: '200px' }} alt="Selected" />} */}
                {/* <button onClick={handleUpload}>Upload</button> */}
                {/* <!--Frame--> */}
                <div class="line_btn">
                  {newWorkplace ? (
                    <button
                      type="button"
                      onClick={handleManageWorkplace}
                      class="btn b_save"
                    >
                      <i class="nav-icon fas fa-save"></i>{" "}
                      &nbsp;สร้างหน่วยงานใหม่
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleManageWorkplace}
                      class="btn b_save"
                    >
                      <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                    </button>
                  )}
                  <button class="btn clean">
                    <i class="far fa-window-close" onClick={() => window.location.reload()}></i> &nbsp;ยกเลิก
                  </button>
                </div>
              </form>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
      </div>
      {/* {JSON.stringify(workTimeDayPersonList, null, 2)} */}
    </div>
  );
}

export default Setting;