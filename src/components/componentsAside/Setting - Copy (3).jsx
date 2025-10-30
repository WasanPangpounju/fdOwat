import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import { useLocation } from "react-router-dom";

function Setting({ workplaceList ,employeeList}) {
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
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัส",
    "ศุกร์",
    "เสาร์",
    "อาทิตย์",
  ];
  const positions = ["หัวหน้างาน", "พนักงานทำความสะอาด"];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedDates && selectedPosition && numberOfEmployees !== "") {
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
        startTime: "",
        endTime: "",
        resultTime: "",
        startTimeOT: "",
        endTimeOT: "",
        resultTimeOT: "",
      },
    ],
  });

  const [workTimeDayList, setWorkTimeDayList] = useState([]);

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
          startTime: "",
          endTime: "",
          resultTime: "",
          startTimeOT: "",
          endTimeOT: "",
          resultTimeOT: "",
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
        timeType === "endTimeOT"
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
      } catch (e) {}
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
  const [reason, setReason] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // const handleDateChange = (date) => {
  //     setSelectedDates((prevDates) => [...prevDates, date]);
  // };
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
  const [workOfOT, setWorkOfOT] = useState(""); //ชั่วโมง OT ต่อสัปดาห์

  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
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

  async function handleSearch(event) {
    event.preventDefault();

    //clean list employee
    setShowEmployeeListResult([]);

    //get value from form search
    const data = {
      searchWorkplaceId: searchWorkplaceId,
      searchWorkplaceName: searchWorkplaceName,
    };

    try {
      // const response = await axios.post(endpoint + "/workplace/search", data);
      // setSearchResult(response.data.workplaces);
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
      // alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา", error);
      // window.location.reload();
    }
  }
  // console.log("EmployeeListResult", employeeListResult);

  //set data to form
  function handleClickResult(workplace) {
    setNewWorkplace(false);
    
    set_id(workplace._id);
    setWorkplaceId(workplace.workplaceId);

    const filteredEmployees = employeeList.filter(
      (employee) => employee.workplace === searchWorkplaceId
    );
    console.log('searchWorkplaceId',searchWorkplaceId);
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

    setWorkOfHour(workplace.workOfHour);
    setWorkOfOT(workplace.workOfOT);
    setWorkRate(workplace.workRate);
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

  //data for search
  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  // const [employeeListResult, setEmployeeListResult] = useState([]);

  useEffect(() => {
    if (workplaceIdSend && workplaceNameSend) {
      setSearchWorkplaceId(workplaceIdSend);
      setSearchWorkplaceName(workplaceNameSend);
    } else {
      setSearchWorkplaceId("");
      setSearchWorkplaceName("");
    }
  }, [workplaceIdSend, workplaceNameSend]); // Depend on the URL parameter

  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from submitting on Enter key press
  }

  async function handleManageWorkplace(event) {
    event.preventDefault();

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

      workOfHour: workOfHour,
      workOfOT: workOfOT,
      workRate: workRate,
      workRateOT: workRateOT,
      workTotalPeople: workTotalPeople,
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
      daysOff: selectedDates,
      reason: reason,

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
    };

    // if (file) {
    //     data.append('reason', file);
    // }
    // await alert(JSON.stringify(formData.addSalary,null,2));

    //check create or update Employee
    if (newWorkplace) {
      // alert('Create Workplace');
      try {
        const response = await axios.post(endpoint + "/workplace/create", data);
        // setEmployeesResult(response.data.employees);
        if (response) {
          alert("บันทึกสำเร็จ");
        }
      } catch (error) {
        alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
        // window.location.reload();
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
          alert("บันทึกสำเร็จ");
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

    setHolidayHour(wrh);
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
                          />
                          <datalist id="workplaceIds">
                            {workplaceList.map((workplace) => (
                              <option key={workplace.workplaceId} value={workplace.workplaceId}>
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
                          <label role="workplaceId">รหัสหน่วยงาน</label>
                          <input
                            type="text"
                            class="form-control"
                            id="workplaceId"
                            placeholder="รหัสหน่วยงาน"
                            value={workplaceId}
                            onChange={(e) => setWorkplaceId(e.target.value)}
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label role="workplaceName">ชื่อหน่วยงาน</label>
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
                          <label role="workplaceArea">สถานที่ปฏิบัติงาน</label>
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
                            จำนวนวันทำงานต่อสัปดาห์
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="workOfWeek"
                            placeholder="จำนวนวันทำงานต่อสัปดาห์"
                            value={workOfWeek}
                            onChange={(e) => setWorkOfWeek(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {/* <!--Frame--> */}

                <h2 class="title">เวลาทำงาน</h2>
                <section class="Frame">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label role="workOfHour">ชั่วโมงทำงาน</label>
                        <input
                          type="text"
                          class="form-control"
                          id="workOfHour"
                          placeholder="ชั่วโมงทำงาน"
                          value={workOfHour}
                          onChange={(e) => setWorkOfHour(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label role="workOfOT">ชั่วโมง OT</label>
                        <input
                          type="text"
                          class="form-control"
                          id="workOfOT"
                          placeholder="ชั่วโมง OT"
                          value={workOfOT}
                          onChange={(e) => setWorkOfOT(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
                {/* <!--Frame--> */}
                <h2 class="title">ค่าจ้าง</h2>
                <section class="Frame">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="workRate">อัตราค่าจ้าง รายวัน</label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRate"
                          placeholder="บาท"
                          value={workRate}
                          onChange={(e) => setWorkRate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="workRateOT">
                          อัตราค่าจ้าง OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="workRateOT"
                          placeholder="กี่เท่า"
                          value={workRateOT}
                          onChange={(e) => setWorkRateOT(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="workTotalPeople">
                          จำนวนพนักงานที่ปฏิบัติงาน
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="workTotalPeople"
                          placeholder="คน"
                          value={workTotalPeople}
                          onChange={(e) => setWorkTotalPeople(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    {/* <div class="col-md-4">
                      <div class="form-group">
                        <label role="dayoffRate">
                          อัตราค่าจ้างวันหยุดประจำสัปดาห์
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRate"
                          placeholder="บาท"
                          value={dayoffRate}
                          onChange={(e) => setDayoffRate(e.target.value)}
                        />
                      </div>
                    </div> */}
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="dayoffRateHour">
                          อัตราค่าจ้างวันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateHour"
                          placeholder="กี่เท่า"
                          value={dayoffRateHour}
                          onChange={(e) => setDayoffRateHour(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="dayoffRateOT">
                          อัตราค่าจ้าง OT วันหยุดประจำสัปดาห์รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="dayoffRateOT"
                          placeholder="กี่เท่า"
                          value={dayoffRateOT}
                          onChange={(e) => setDayoffRateOT(e.target.value)}
                        />
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="holiday">
                          อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายวัน
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holiday"
                          placeholder="กี่เท่า"
                          value={holiday}
                          onChange={(e) => setHoliday(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="holidayHour">
                          อัตราค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayHour"
                          placeholder=""
                          value={holidayHour}
                          onChange={(e) => setHolidayHour(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label role="holidayOT">
                          อัตราค่าจ้างวันหยุดนักขัตฤกษ์ OT รายชั่วโมง
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="holidayOT"
                          placeholder="กี่เท่า"
                          value={holidayOT}
                          onChange={(e) => setHolidayOT(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
                {/* <!--Frame--> */}
                <h2 class="title">สวัสดิการเงินเพิ่มพนักงาน</h2>
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
                              <option value="header">หัวหน้างาน</option>
                              <option value="headerTa">
                                ผู้ช่วยหัวหน้างาน
                              </option>
                              <option value="custom">กำหนดเอง</option>
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
                                width: "3rem",
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
                    ))}
                  <br />
                  <button
                    type="button"
                    onClick={handleAddInput}
                    class="btn btn-primary"
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
                                class="form-control"
                                id="workRateDayoffRate"
                                placeholder="จำนวนเงินต่อวัน"
                                value={workRateDayoffRate}
                                onChange={(e) =>
                                  setworkRateDayoffRate(e.target.value)
                                }
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
                    <div class="col-md-8">
                      <div class="row">
                        <div class="col-md-2">กะ</div>
                        <div class="col-md-2">เวลาเข้า</div>
                        <div class="col-md-2">เวลาออก</div>
                        <div class="col-md-2">เวลาเข้าOT</div>
                        <div class="col-md-2">เวลาออกOT</div>
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
                    <div class="col-md-8">
                      {workTimeDay.allTimes.map((time, index) => (
                        <div key={index}>
                          <div class="row">
                            <div class="col-md-2">
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
                            <div class="col-md-2">
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
                              />
                            </div>
                            <div class="col-md-2">
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
                              />
                            </div>
                            {/* <span>Result Time: {time.resultTime}</span> */}
                            <div class="col-md-2">
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
                              />
                            </div>
                            <div class="col-md-2">
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
                            <td style={cellStyle}>{item1.startTimeOT}</td>
                            <td style={cellStyle}>{item1.endTimeOT}</td>
                            <td style={cellStyle}>{item1.resultTimeOT}</td>

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

                              {positionWork.map((position, positionIndex) => (
                                <option key={positionIndex} value={position}>
                                  {position}
                                </option>
                              ))}
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
                                    style={{ width: "3rem" }}
                                    className="btn btn-danger ml-auto"
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

                <h2 class="title">วันหยุดหน่วยงาน</h2>
                <section class="Frame">
                  <div>
                    <label>เลือกวันหยุดของหน่วยงาน:</label>

                    <div>
                      <div className="row">
                        <div className="col-md-3">
                          <label style={{ margin: "0.5rem" }}>วันที่:</label>
                        </div>
                        <div className="col-md-3">
                          <label style={{ marginRight: "0.5rem" }}>
                            เดือน:
                          </label>
                        </div>

                        <div className="col-md-3">
                          <label style={{ margin: "0.5rem" }}>ปี:</label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                          >
                            <option value="">Select day</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                          >
                            <option value="">Select month</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <select
                            className="form-control"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                          >
                            <option value="">Select year</option>
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
                    {/* {selectedDates.length > 0 && (
                      <div>
                        วันหยุดหน่วยงาน (เดือน/วัน/ปี)
                        <br />
                        <ol>
                          {selectedDates.map((date, index) => (
                            <li key={index}>
                              <div className="row">
                                <div
                                  className="col-md-1"
                                  style={{ borderTop: "2px solid black" }}
                                >
                                  {date instanceof Date &&
                                  !isNaN(date.getTime())
                                    ? date.toLocaleDateString()
                                    : `${day}/${month}/${year} (Invalid Date)`}{" "}
                                </div>
                                <div
                                  className="col-md-1"
                                  style={{ borderTop: "2px solid black" }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDate(date)}
                                    className="btn clean"
                                    style={{ margin: "0.5rem", width: "6rem" }}
                                  >
                                    ลบออก
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )} */}

                    {selectedDates.length > 0 && (
                      <div>
                        วันหยุดหน่วยงาน (เดือน/วัน/ปี)
                        <br />
                        <ol>
                          {selectedDates.map((date, index) => (
                            <li key={index}>
                              <div className="row">
                                <div
                                  className="col-md-1"
                                  style={{ borderTop: "2px solid black" }}
                                >
                                  {date instanceof Date &&
                                  !isNaN(date.getTime())
                                    ? `${date.getDate()}/${
                                        date.getMonth() + 1
                                      }/${date.getFullYear() + 543}`
                                    : `${day}/${month}/${
                                        year + 543
                                      } (Invalid Date)`}
                                </div>
                                <div
                                  className="col-md-1"
                                  style={{ borderTop: "2px solid black" }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDate(date)}
                                    className="btn clean"
                                    style={{ margin: "0.5rem", width: "6rem" }}
                                  >
                                    ลบออก
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                  <div>
                    <label>หมายเหตุ:</label>
                    <input
                      type="text"
                      class="form-control"
                      value={reason}
                      onChange={handleReasonChange}
                    />
                  </div>
                </section>
                {/* <section class="Frame">
                  <h2 class="title">พนักงานในสังกัด</h2> */}
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
                    <i class="far fa-window-close"></i> &nbsp;ยกเลิก
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
    </body>
  );
}

export default Setting;
