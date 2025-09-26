import endpoint from "../../config";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../editwindowcss.css";

import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";

// import { PencilSquare } from "react-bootstrap-icons"; // Bootstrap icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import Modal from "react-modal";
import "./salarysummary/styleCom.css";
Modal.setAppElement("#root"); // Set the root element for accessibility

function Compensation() {
  document.title = " ตารางค่าตอบแทน";
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

  const [sumWorkHourX, setSumWorkHourX] = useState(0);
  const [sumWorkRateX, setSumWorkRateX] = useState(0);
  const [sumWorkHourOtX, setSumWorkHourOtX] = useState(0);
  const [sumWorkRateOtX, setSumWorkRateOtX] = useState(0);

  const [statusEditSum, setStatusEditSum] = useState(false);
  const [loadStatus, setLoadStatus] = useState(null);

  const [dataTable, setDataTable] = useState([]);

  const handleClickEditSum = () => {
    // Toggle the status between true and false
    setStatusEditSum((prevStatus) => !prevStatus);
  };

  const handleChangeSumWorkHourX = (e) => {
    const value = e.target.value;

    // Ensure that the value is a number and not empty
    if (!isNaN(value) && value !== "") {
      setSumWorkHourX(parseFloat(value));
    } else {
      setSumWorkHourX(0);
    }
  };
  const handleChangeSumWorkRateX = (e) => {
    const value = e.target.value;

    // Ensure that the value is a number and not empty
    if (!isNaN(value) && value !== "") {
      setSumWorkRateX(parseFloat(value));
    } else {
      setSumWorkRateX(0);
    }
  };

  const handleChangeSumWorkHourOtX = (e) => {
    const value = e.target.value;

    // Ensure that the value is a number and not empty
    if (!isNaN(value) && value !== "") {
      setSumWorkHourOtX(parseFloat(value));
    } else {
      setSumWorkHourOtX(0);
    }
  };

  const handleChangeSumWorkRateOtX = (e) => {
    const value = e.target.value;

    // Ensure that the value is a number and not empty
    if (!isNaN(value) && value !== "") {
      setSumWorkRateOtX(parseFloat(value));
    } else {
      setSumWorkRateOtX(0);
    }
  };

  const [employeeId, setEmployeeId] = useState(""); //รหัสหน่วยงาน
  const [name, setName] = useState(""); //ชื่อหน่วยงาน
  const [lastName, setLastname] = useState(""); //ชื่อหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน

  const [searchResult, setSearchResult] = useState([]);
  const [searchResultLower, setSearchResultLower] = useState([]);
  const [workplaceIdEMP, setWorkplaceIdEMP] = useState(""); //รหัสหน่วยงาน

  const [employeeListResult, setEmployeeListResult] = useState([]);
  const [newWorkplace, setNewWorkplace] = useState(true);
  const [timerecordAllList, setTimerecordAllList] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [alldaywork, setAlldaywork] = useState([]);
  const [alldayworkLower, setAlldayworkLower] = useState([]);
  //   const [month, setMonth] = useState('');
  //   const [year, setYear] = useState('');
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(new Date().getFullYear());
  const [employee, setEmployee] = useState({});
  const [editStatus, setEditStatus] = useState("");

  const thaiMonthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const thaiToEnglishDayMap = {
    จันทร์: ["Mon"],
    อังคาร: ["Tue"],
    พุธ: ["Wed"],
    พฤหัส: ["Thu"],
    ศุกร์: ["Fri"],
    เสาร์: ["Sat"],
    อาทิตย์: ["Sun"],
  };
  const getThaiMonthName = (monthNumber) => {
    return thaiMonthNames[monthNumber - 1];
  };

  const [addSalaryDay, setAddSalaryDay] = useState(0);
  const [addSalaryDayList, setAddSalaryDayList] = useState([]);
  const [addSalaryList, setAddSalaryList] = useState([]);

  useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);

    const getdata = async () => {
      const savedEditConclude =
        (await localStorage.getItem("editConclude")) || "";
      if (savedEditConclude) {
        await setEditStatus(savedEditConclude);
        await localStorage.removeItem("editConclude");
      }

      const savedEmployeeId = await localStorage.getItem("employeeId");
      const savedEmployeeFullName =
        (await localStorage.getItem("staffFullName")) || "";
      const savedMonth = await localStorage.getItem("month");
      const savedYear = await localStorage.getItem("year");
      if (savedEmployeeId) {
        await setSearchEmployeeId(savedEmployeeId);
        // await setSearchEmployeeName(savedEmployeeName);
        await setStaffId(savedEmployeeId);
        // setStaffFullName(savedEmployeeName);

        // const event = await new Event("submit"); // Creating a synthetic event object
        // await handleSearch(event); // Call handleSearch with the event

        await localStorage.removeItem("employeeId");
      }
      if (savedMonth) {
        await setMonth(savedMonth);
        await localStorage.removeItem("month");
      }
      if (savedYear) {
        await setYear(savedYear);
        await localStorage.removeItem("year");
      }
      if (savedEmployeeFullName) {
        await setStaffFullName(savedEmployeeFullName);
        await localStorage.removeItem("staffFullName");
      }
    };

    getdata();
  }, []); // Run this effect only once on component mount

  const EndYear = 2010;
  const currentYear = new Date().getFullYear(); // 2024
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

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

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // console.error("workplaceList", workplaceList);

  // console.log(employeeList);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [workTimeDayPerson, setWorkTimeDayPerson] = useState({
    // startDay: '',
    // endDay: '',
    allTimesPerson: [{ CodeSalary: "", positionWork: "", countPerson: "" }],
  });

  const [workTimeDayPersonList, setWorkTimeDayPersonList] = useState([]);

  // const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  // const shiftWork = ['Shift 1', 'Shift 2', 'Shift 3'];
  const positionWork = ["หัวหน้า", "ทำความสะอาด", "กวาดพื้น"];

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
        { CodeSalary: "", positionWork: "", countPerson: "" },
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
      // startDay: '',
      // endDay: '',
      allTimesPerson: [{ CodeSalary: "", positionWork: "", countPerson: "" }],
    });
  };

  const handleRemoveTimePersonList = (index) => {
    setWorkTimeDayPersonList((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/timerecord/listemp")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setTimerecordAllList(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const CheckMonth = parseInt(month, 10);
  const CheckYear = year;
  // const CheckMonth = 5;
  // const CheckYear = 2023;

  let countdownMonth;
  let countdownYear;

  if (CheckMonth === 1) {
    countdownMonth = 12;
    countdownYear = CheckYear - 1;
  } else {
    countdownMonth = CheckMonth - 1;
    countdownYear = CheckYear;
  }
  const base = 543;
  function getDaysInMonth(month, year) {
    // Months are 0-based, so we subtract 1 from the provided month
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    return lastDayOfMonth;
  }

  const daysInMonth = getDaysInMonth(countdownMonth, CheckYear);
  const startDay = 21;
  // Create an array from startDay to daysInMonth
  const firstPart = useMemo(() => Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, index) =>
      startDay +
      index +
      "/" +
      countdownMonth +
      "/" +
      (parseInt(countdownYear, 10) + parseInt(base, 10))
  ), [daysInMonth, startDay, countdownMonth, countdownYear, base]);

  // Create an array from 1 to 20
  const secondPart = useMemo(() => Array.from(
    { length: 20 },
    (_, index) =>
      index +
      1 +
      "/" +
      CheckMonth +
      "/" +
      (parseInt(CheckYear, 10) + parseInt(base, 10))
  ), [CheckMonth, CheckYear, base]);

  // Concatenate the two arrays
  const resultArray = useMemo(() => [...firstPart, ...secondPart], [firstPart, secondPart]);

  const firstPart2 = useMemo(() => Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, index) => startDay + index
  ), [daysInMonth, startDay]);

  // Create an array from 1 to 20
  const secondPart2 = useMemo(() => Array.from({ length: 20 }, (_, index) => index + 1), []);

  // Concatenate the two arrays
  const resultArray2 = useMemo(() => [...firstPart2, ...secondPart2], [firstPart2, secondPart2]);
  // console.log("resultArray2", resultArray2);
  function getDaysInMonth2(month, year) {
    // Months are 0-based, so we subtract 1 from the provided month
    return new Date(year, month, 0).getDate();
  }
  // Function to create an array of days for a given month and year
  function createDaysArray(month, year, endDay, filter) {
    const daysArray = {};

    for (let day = 1; day <= endDay; day++) {
      const date = new Date(year, month - 1, day);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!daysArray[weekday]) {
        daysArray[weekday] = [];
      }

      if (filter(day)) {
        daysArray[weekday].push(day);
      }
    }

    return daysArray;
  }

  let monthLower;
  let timerecordIdLower;
  // get value from form search
  if (month == "01") {
    monthLower = "12";
    timerecordIdLower = year - 1;
  } else {
    const monthNumber = parseInt(month, 10);
    monthLower = (monthNumber - 1).toString().padStart(2, "0"); // Convert back to string, pad with leading zero if needed
    // monthLower = month - 1;
    timerecordIdLower = year;
  }

  const thaiMonthName = getThaiMonthName(parseInt(CheckMonth, 10));
  const thaiMonthLowerName = getThaiMonthName(parseInt(countdownMonth, 10));

  const [concludeResult, setConcludeResult] = useState([]);
  const [addSalaryResult, setAddSalaryResult] = useState([]);

  //recreate conclude
  async function recal() {
    const data = await {
      employeeId: searchEmployeeId, 
      month: month, 
      year: year 
    };
      
    try {
      const response = await axios.post(endpoint + "/conclude/searchtimerecordemployee/", data);
      alert('hi')

      if (response) {
        alert("บันทึกสำเร็จ");
      }

    } catch (e) {
      alert("บันทึกไม่สำเร็จ");
      alert(e);
    }

    // const serchConclude = await {
    //   year: year,
    //   month: month,
    //   concludeDate: "",
    //   employeeId: searchEmployeeId,
    //   employeeName: searchEmployeeName,
    // };
    // // alert(serchConclude .month)
    // try {
    //   //create conclude
    //   const response = await axios.post(
    //     endpoint + "/conclude/autocreate",
    //     serchConclude
    //   );
    //   // alert(response .data);
    //   alert("กำลังประมวลผล กรุณาค้นหาอีกครั้งหากยังไม่พบกรุณาตรวจสอบการลงเวลา");
    // } catch (e) {
    //   console.log(e);
    //   alert(e);
    // }
  }

  async function backup_handleSearch(event) {
    event.preventDefault();
    await localStorage.setItem("employeeId", searchEmployeeId);
    await localStorage.setItem("employeeName", searchEmployeeName);
    await localStorage.setItem("month", month);
    await localStorage.setItem("year", year);
    let searchStatus = null;
    await setConcludeResult([]);
    await setLoadStatus(null);

    const data = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      // employeeName: searchEmployeeName,
      month: month,
      timerecordId: year,
    };

    //get data from conclude data
    const serchConclude = await {
      year: year,
      month: month,
      concludeDate: "",
      employeeId: searchEmployeeId,
      employeeName: searchEmployeeName,
    };

    try {
      const response = await axios.post(
        endpoint + "/conclude/search",
        serchConclude
      );
      // await alert(response.data.recordConclude.length);
      // await alert(JSON.stringify(response,null,2));

      if (response.data.recordConclude.length < 1) {
        // alert('conclude is null');
        //create conclude
        const response = await axios.post(
          endpoint + "/conclude/autocreate",
          serchConclude
        );
        alert(
          "กำลังประมวลผล กรุณาค้นหาอีกครั้งหากยังไม่พบกรุณาตรวจสอบการลงเวลา"
        );
      } else {
        //check update time record then reset data conclude
        // await alert(editStatus);
        if (editStatus !== "") {
          await setLoadStatus(null);
          await setUpdate(response.data.recordConclude[0]._id);
        } else {
          await setSumWorkHourX(response.data.recordConclude[0].sumWorkHour);
          await setSumWorkRateX(response.data.recordConclude[0].sumWorkRate);
          await setSumWorkHourOtX(
            response.data.recordConclude[0].sumWorkHourOt
          );
          await setSumWorkRateOtX(
            response.data.recordConclude[0].sumWorkRateOt
          );

          await setConcludeResult(
            response.data.recordConclude[0].concludeRecord
          );
          await setAddSalaryResult(response.data.recordConclude[0].addSalary);
          // setStaffFullName(response.data.recordConclude[0].);
          await setLoadStatus("load");
          await setUpdate(response.data.recordConclude[0]._id);
        }
      }
    } catch (e) {
      // alert(e);
    }

    const dataLower = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      // employeeName: searchEmployeeName,
      month: monthLower,
      timerecordId: timerecordIdLower,
    };
    // alert(data.name);
    try {
      //get employee data
      await setEmployee(findEmployeeById(searchEmployeeId));
      setStaffFullName(employee.name);

      const filteredEntries = await timerecordAllList.filter(
        (entry) =>
          entry.employeeId === searchEmployeeId &&
          entry.month === month &&
          entry.timerecordId == year
      );
      const filteredEntriesLower = await timerecordAllList.filter(
        (entry) =>
          entry.employeeId === searchEmployeeId &&
          entry.month === monthLower &&
          entry.timerecordId == timerecordIdLower
      );

      // alert(filteredEntriesLower);

      await setSearchResult(filteredEntries);
      await setSearchResultLower(filteredEntriesLower);

      const entriesData = filteredEntries.map((entry) =>
        entry.employee_workplaceRecord
          .filter((record) => record.date <= 20)
          .map((record) => {
            const matchedWorkplace = workplaceList.find(
              (workplace) => workplace.workplaceId == record.workplaceId
            );

            // const workRate = record ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? record.specialtSalary : matchedWorkplace.workRate) : '';

            // const workRateOT = record ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? record.specialtSalaryOT : matchedWorkplace.workRateOT) : '';

            let workRate = "";
            let workRateOT = "";

            if (record.shift === "specialt_shift" && record.cashSalary === "") {
              workRate = record.specialtSalary || 0;
              workRateOT = record.specialtSalaryOT || 0;
            } else if (
              record.shift === "specialt_shift" &&
              record.cashSalary === "true"
            ) {
              workRate = 0;
              workRateOT = 0;
            } else if (matchedWorkplace) {
              workRate = matchedWorkplace.workRate || 0;
              workRateOT = matchedWorkplace.workRateOT || 0;
            }

            return {
              workplaceId: record.workplaceId,
              dates: record.date,
              workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : "", // Default value if not found
              // workRate: matchedWorkplace ? matchedWorkplace.workRate : '', // Default value if not found
              // workRateOT: matchedWorkplace ? matchedWorkplace.workRateOT : '',
              workRate: workRate,
              workRateOT: workRateOT,
              allTimes: record.allTime,
              otTimes: record.otTime,
              startTime: record.startTime,
              endTime: record.endTime,
              selectotTime: record.selectotTime,
              selectotTimeOut: record.selectotTimeOut,
              dayoffRateHour: matchedWorkplace
                ? matchedWorkplace.dayoffRateHour
                : "",
              dayoffRateOT: matchedWorkplace
                ? matchedWorkplace.dayoffRateOT
                : "",
              holiday: matchedWorkplace ? matchedWorkplace.holiday : "",
              holidayOT: matchedWorkplace ? matchedWorkplace.holidayOT : "",
              shift: record.shift,
              specialtSalary: record.specialtSalary,
              specialtSalaryOT: record.specialtSalaryOT,
              cashSalary: record.cashSalary,
            };
          })
      );

      // console.log(entriesData);

      // const entriesDataLower = filteredEntriesLower.map(entry =>
      //     entry.employee_workplaceRecord
      //         .filter(record => record.date >= 21)
      //         .map(record => {
      //             const matchedWorkplace = workplaceList.find(workplace => workplace.workplaceId === record.workplaceId);
      //             return {
      //                 workplaceId: record.workplaceId,
      //                 dates: record.date,
      //                 workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : '', // Default value if not found
      //                 workRate: matchedWorkplace ? matchedWorkplace.workRate : '', // Default value if not found
      //                 workRateOT: matchedWorkplace ? matchedWorkplace.workRateOT : '',
      //                 allTimes: record.allTime,
      //                 otTimes: record.otTime,
      //                 startTime: record.startTime,
      //                 endTime: record.endTime,
      //                 selectotTime: record.selectotTime,
      //                 selectotTimeOut: record.selectotTimeOut,
      //                 dayoffRateHour: matchedWorkplace ? matchedWorkplace.dayoffRateHour : '',
      //                 dayoffRateOT: matchedWorkplace ? matchedWorkplace.dayoffRateOT : '',
      //                 holiday: matchedWorkplace ? matchedWorkplace.holiday : '',
      //                 holidayOT: matchedWorkplace ? matchedWorkplace.holidayOT : '',
      //             };
      //         })
      // );

      const entriesDataLower = filteredEntriesLower.map((entry) =>
        entry.employee_workplaceRecord
          .filter((record) => record.date >= 21)
          .map((record) => {
            const matchedWorkplace = workplaceList.find(
              (workplace) => workplace.workplaceId == record.workplaceId
            );

            // const workRate = matchedWorkplace ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? matchedWorkplace.shift : matchedWorkplace.shift) : '';

            // const workRateOT = matchedWorkplace ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? matchedWorkplace.shift : matchedWorkplace.shift) : '';

            const test123 = record.date;

            // if (record.shift == 'specialt_shift' && record.cashSalary == '') {
            //     console.log('specialt_shift : true', test123);
            //     const workRate = matchedWorkplace.specialtSalary;
            // } else {
            //     console.log('specialt_shift : false', test123);
            //     const workRate = matchedWorkplace.workRate;
            // }
            // const workRate = record ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? record.specialtSalary : 0) : '';

            // const workRateOT = record ?
            //     (record.shift == 'specialt_shift' && record.cashSalary == '' ? record.specialtSalaryOT : 0) : '';

            let workRate = "";
            let workRateOT = "";

            if (record.shift === "specialt_shift" && record.cashSalary === "") {
              workRate = record.specialtSalary || 0;
              workRateOT = record.specialtSalaryOT || 0;
            } else if (
              record.shift === "specialt_shift" &&
              record.cashSalary === "true"
            ) {
              workRate = 0;
              workRateOT = 0;
            } else if (matchedWorkplace) {
              workRate = matchedWorkplace.workRate || 0;
              workRateOT = matchedWorkplace.workRateOT || 0;
            }
            return {
              workplaceId: record.workplaceId,
              dates: record.date,
              workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : "", // Default value if not found
              workRate: workRate,
              workRateOT: workRateOT,
              allTimes: record.allTime,
              otTimes: record.otTime,
              startTime: record.startTime,
              endTime: record.endTime,
              selectotTime: record.selectotTime,
              selectotTimeOut: record.selectotTimeOut,
              dayoffRateHour: matchedWorkplace
                ? matchedWorkplace.dayoffRateHour
                : "",
              dayoffRateOT: matchedWorkplace
                ? matchedWorkplace.dayoffRateOT
                : "",
              holiday: matchedWorkplace ? matchedWorkplace.holiday : "",
              holidayOT: matchedWorkplace ? matchedWorkplace.holidayOT : "",
              shift: record.shift,
              specialtSalary: record.specialtSalary,
              specialtSalaryOT: record.specialtSalaryOT,
              cashSalary: record.cashSalary,
            };
          })
      );

      setAlldaywork(entriesData);
      setAlldayworkLower(entriesDataLower);
      // alert(response.data.employees.length);

      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId("");
        await setName("");
        await setLastname("");
        alert("ไม่พบข้อมูล");
      } else {
        // alert(response.data.employees.length);

        //clean form
        await setSearchEmployeeId("");
        await setSearchEmployeeName("");

        // Set search values
        await setEmployeeId(response.data.employees[0].employeeId);
        await setName(response.data.employees[0].name);
        await setLastname(response.data.employees[0].lastName);
        await setStaffFullName(response.data.employees[0].name);
        // setSearchEmployeeId(response.data.employees[0].employeeId);
        // setSearchEmployeeName(response.data.employees[0].name);
      }
    } catch (error) {
      // alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);
      // alert(error);
      // window.location.reload();
    }
  }

  const concludeResultData = useMemo(() => {
    let ans = 0;
    let ans1 = 0;

    const calculatedResults = concludeResult.map((item, index) => {
      if (!isNaN(item.workRate)) {
        ans = ans + parseFloat(item.workRate, 10) || 0;
      }
      if (item.workRateOT && !isNaN(item.workRateOT) && item.workRateOT !== 0) {
        ans1 = ans1 + parseFloat(item.workRateOT, 10);
      }
      return ans;
    });

    return {
      dataTable: concludeResult,
      addSalaryList: addSalaryResult || [],
      sumRate: ans,
      sumRateOT: ans1
    };
  }, [concludeResult, addSalaryResult]);

  useEffect(() => {
    if (concludeResultData) {
      setDataTable(concludeResultData.dataTable);
      setAddSalaryList(concludeResultData.addSalaryList);
      setSumRate(concludeResultData.sumRate);
      setSumRateOT(concludeResultData.sumRateOT);
    }
  }, [concludeResultData]);
  // console.log("dataTable", dataTable);

  const findEmployeeById = (id) => {
    return employeeList.find((employee) => employee.employeeId === id);
  };

  const calculateTotalSalary = () => {
    let total = 0;
    addSalaryList.forEach((day, dayIndex) => {
      if (dataTable[dayIndex]) {
        if (
          dataTable[dayIndex].workplaceId !== undefined &&
          dataTable[dayIndex].workplaceId !== ""
        ) {
          day.forEach((salary) => {
            if (salary.SpSalary > 100) {
              total += parseFloat((salary.SpSalary / 30).toFixed(2));
            } else {
              total += parseFloat(salary.SpSalary);
            }
          });
        }
      }
    });
    return total;
  };

  const addSalaryDayData = useMemo(() => {
    if (!employee?.addSalary?.length) {
      return {
        addSalaryDay: 0,
        addSalaryDayList: [],
        addSalaryList: []
      };
    }

    let tmpAddSalaryList = [];
    let sum = 0;

    employee.addSalary.forEach((item) => {
      if (item.roundOfSalary === "daily") {
        tmpAddSalaryList.push(item);
        if (parseFloat(item.SpSalary) < 100) {
          sum += parseFloat(item.SpSalary, 10);
        } else {
          sum += parseFloat(item.SpSalary, 10) / 30;
        }
      }
    });

    // Create addSalaryList array
    const addSalaryList = Array(dataTable.length).fill(tmpAddSalaryList);

    return {
      addSalaryDay: sum,
      addSalaryDayList: tmpAddSalaryList,
      addSalaryList: addSalaryList
    };
  }, [employee?.addSalary, dataTable.length]);

  useEffect(() => {
    if (addSalaryDayData) {
      setAddSalaryDay(addSalaryDayData.addSalaryDay);
      setAddSalaryDayList(addSalaryDayData.addSalaryDayList);
      
      // Only update addSalaryList if loadStatus is not "load"
      if (loadStatus !== "load") {
        setAddSalaryList(addSalaryDayData.addSalaryList);
      }
    }

    if (employee) {
      setWorkplaceIdEMP(employee.workplace ? employee.workplace : "");
    }
  }, [addSalaryDayData, employee, loadStatus]);

  // Function to remove an addSalary array from addSalaryList
  const removeAddSalaryArray = async (listIndex, subArrayIndex) => {
    const newAddSalaryList = await [...addSalaryList];
    if (
      newAddSalaryList[listIndex] &&
      subArrayIndex < newAddSalaryList[listIndex].length
    ) {
      const tmpObj = await [...newAddSalaryList[listIndex]];
      const removedElement = await tmpObj.filter(
        (item, index) => index !== subArrayIndex
      );

      newAddSalaryList[listIndex] = await removedElement;
      // alert(listIndex+ ' x ' +  subArrayIndex);
      // await alert(JSON.stringify( newAddSalaryList[listIndex],null,2));
      await setAddSalaryList(newAddSalaryList);
    }
  };

  // Example usage of removeAddSalaryArray function
  const handleRemoveAddSalaryArray = (listIndex, subArrayIndex) => {
    removeAddSalaryArray(listIndex, subArrayIndex);
  };

  const allwork = useMemo(() => [...alldayworkLower, ...alldaywork], [alldayworkLower, alldaywork]);

  const result = resultArray2.map((number) => {
    const matchingEntry = alldaywork.find(
      (entry) => entry.dates === (number < 10 ? "0" + number : "" + number)
    );

    if (matchingEntry) {
      return `${number}, workplaceId: '${matchingEntry.workplaceId}', allTimes: '${matchingEntry.allTimes}', otTimes: '${matchingEntry.otTimes}'`;
    } else {
      return `${number}, workplaceId: '', allTimes: '', otTimes: ''`;
    }
  });

  // Convert 'dates' to numbers
  // const allworkWithNumberDates = allwork.map(item => ({
  //     ...item,
  //     dates: parseInt(item.dates, 10)
  // }));
  const allworkFlattened = useMemo(() => allwork.flat(), [allwork]);

  // Filter unique entries based on 'workplaceId' and 'dates'
  const uniqueEntries = useMemo(() => {
    return allworkFlattened.reduce((acc, curr) => {
      const key = `${curr.workplaceId}-${curr.dates}`;
      if (!acc[key]) {
        acc[key] = curr;
      }
      return acc;
    }, {});
  }, [allworkFlattened]);

  // Extract values from the object to get the final array
  const resultAllwork = useMemo(() => {
    return Object.values(uniqueEntries);
  }, [uniqueEntries]);

  const resultArrayWithWorkplaceRecords = useMemo(() => {
    return resultArray2.map((date) => {
      const matchingRecord = resultAllwork.find((record) => record.dates == date);
      return matchingRecord ? { ...matchingRecord } : "";
    });
  }, [resultArray2, resultAllwork]);

  // console.log(
  //   "resultArrayWithWorkplaceRecords",
  //   resultArrayWithWorkplaceRecords
  // );

  const combinedArray = resultArray.map((date, index) => {
    const workplaceRecord = resultArrayWithWorkplaceRecords[index];
    return [workplaceRecord, date];
  });

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

  const daysInMonth2 = getDaysInMonth(CheckMonth, CheckYear);
  const daysInCountdownMonth = getDaysInMonth2(countdownMonth, countdownYear);

  // const array1 = createDaysArray(CheckMonth, CheckYear, daysInMonth2, (day) => day <= 20);
  // const array2 = createDaysArray(countdownMonth, CheckYear, daysInCountdownMonth, (day) => day > 21);
  const array1 = createDaysArray(
    CheckMonth,
    CheckYear,
    daysInMonth2,
    (day) => day <= 20
  );
  const array2 = createDaysArray(
    countdownMonth,
    countdownYear,
    daysInCountdownMonth,
    (day) => day >= 21
  );

  // const commonNumbers = new Set([...array2.Mon, ...array1.Mon]);

  // const commonNumbers = [...new Set([...array1.Mon, ...array2.Mon])];
  // console.log('commonNumbers', commonNumbers);

  const workplace = workplaceList.find(
    (workplace) => workplace.workplaceId === workplaceIdEMP
  );

  function getDaysInBetween(startDay, endDay) {
    const weekdays = [
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัส",
      "ศุกร์",
      "เสาร์",
      "อาทิตย์",
    ];
    const startIndex = weekdays.indexOf(startDay);
    const endIndex = weekdays.indexOf(endDay);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    return weekdays.slice(startIndex, endIndex + 1);
  }

  // const monthTest = "09"; // Assuming "09" represents September
  const { commonNumbers123, commonNumbers123_2nd, commonNumbers, commonNumbersArray } = useMemo(() => {
    const commonNumbers123 = new Set();

    if (workplace && workplace.daysOff && Array.isArray(workplace.daysOff)) {
      const matchingDays = workplace.daysOff.filter((date) => {
        const dateObj = new Date(date);
        return (dateObj.getMonth() + 1).toString().padStart(2, "0") === month; // +1 because getMonth() returns zero-based month index
      });

      // Iterate over matchingDays and add day numbers to commonNumbers set
      matchingDays.forEach((date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate(); // Get the day number (1-31)
        commonNumbers123.add(day); // Add day number to the set
      });

      const filteredNumbers = new Set();

      // Filter day numbers less than 20 and add them to filteredNumbers set
      commonNumbers123.forEach((day) => {
        if (day < 21) {
          filteredNumbers.add(day);
        }
      });

      // Update commonNumbers123_2nd with filtered day numbers
      commonNumbers123.clear(); // Clear the original set
      filteredNumbers.forEach((day) => {
        commonNumbers123.add(day); // Add filtered day numbers back to commonNumbers123_2nd
      });
    }

    const commonNumbers123_2nd = new Set();

    let monthSet;
    if (workplace) {
      const matchingDays = workplace.daysOff.filter((date) => {
        if (month == "01") {
          monthSet == "12";
        } else {
          // Convert the month string to a number, subtract 1, and convert it back to a string
          const currentMonthNumber = parseInt(month, 10); // Parse month string to integer
          const previousMonthNumber = currentMonthNumber - 1;

          // Handle the case when previousMonthNumber is 0 (transition from January to December)
          if (previousMonthNumber === 0) {
            monthSet = "12"; // Set monthSet to '12' for December
          } else {
            // Convert the previous month number back to a string with leading zero if necessary
            monthSet = previousMonthNumber.toString().padStart(2, "0");
          }
        }
        const dateObj = new Date(date);
        return (dateObj.getMonth() + 1).toString().padStart(2, "0") === monthSet; // +1 because getMonth() returns zero-based month index
      });

      // Iterate over matchingDays and add day numbers to commonNumbers set
      matchingDays.forEach((date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate(); // Get the day number (1-31)
        commonNumbers123_2nd.add(day); // Add day number to the set
      });

      // Create a new Set to store filtered day numbers (< 20)
      const filteredNumbers = new Set();

      // Filter day numbers less than 20 and add them to filteredNumbers set
      commonNumbers123_2nd.forEach((day) => {
        if (day > 20) {
          filteredNumbers.add(day);
        }
      });

      // Update commonNumbers123_2nd with filtered day numbers
      commonNumbers123_2nd.clear(); // Clear the original set
      filteredNumbers.forEach((day) => {
        commonNumbers123_2nd.add(day); // Add filtered day numbers back to commonNumbers123_2nd
      });
    }

    const commonNumbers = new Set();

    if (workplace) {
      const stopWorkTimeDay = workplace.workTimeDay.find(
        (day) => day.workOrStop === "stop"
      );

      if (stopWorkTimeDay) {
        const { startDay, endDay } = stopWorkTimeDay;

        const daysInBetween = getDaysInBetween(startDay, endDay);

        daysInBetween.forEach((day) => {
          const englishDayArray = thaiToEnglishDayMap[day];

          englishDayArray.forEach((englishDay) => {
            // Use forEach to add each element to commonNumbers
            // commonNumbers.add(...array1[englishDayArray]);
            array1[englishDay].forEach((value) => commonNumbers.add(value));
            array2[englishDay].forEach((value) => commonNumbers.add(value));
          });
        });

        // setHoliday(commonNumbers);
        // console.log("Common Numbers:", commonNumbers);
      } else {
        // console.log("No stop workTimeDay found.");
      }
    } else {
      // console.log("Workplace not found.");
    }

    commonNumbers123.forEach((number) => {
      commonNumbers.add(number);
    });

    commonNumbers123_2nd.forEach((number) => {
      commonNumbers.add(number);
    });

    // const commonNumbersArray = [...commonNumbers];
    const commonNumbersArray = [...commonNumbers].map((value) =>
      value.toString()
    );

    return { commonNumbers123, commonNumbers123_2nd, commonNumbers, commonNumbersArray };
  }, [workplace, month, array1, array2]);

  function getDaysInBetween(startDay, endDay) {
    const weekdays = [
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัส",
      "ศุกร์",
      "เสาร์",
      "อาทิตย์",
    ];
    const startIndex = weekdays.indexOf(startDay);
    const endIndex = weekdays.indexOf(endDay);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    return weekdays.slice(startIndex, endIndex + 1);
  }

  const sumWorkRate = resultArrayWithWorkplaceRecords.reduce(
    (accumulator, workplaceRecord) => {
      const workRateValue = parseFloat(workplaceRecord.workRate);
      return !isNaN(workRateValue) ? accumulator + workRateValue : accumulator;
    },
    0
  );

  const sumWorkRateOT = resultArrayWithWorkplaceRecords.reduce(
    (accumulator, workplaceRecord) => {
      const workRateValue = parseFloat(workplaceRecord.workRate); //352
      const workRateOTValue = parseFloat(workplaceRecord.workRateOT); //1.5
      const workTimeValue = parseFloat(workplaceRecord.workOfHour); //8 work
      const workTimeOTValue = parseFloat(workplaceRecord.otTimes); //3 workot

      return !isNaN(workRateValue)
        ? accumulator +
            (workRateValue / workTimeValue) * workRateOTValue * workTimeOTValue
        : accumulator;
    },
    0
  );

  const Compensation = ({ staffId, month, year }) => {
    setStaffId(staffId);
    setMonth(month);
    setYear(year);
  };

  const sumWorkRate1 = resultArrayWithWorkplaceRecords.reduce(
    (accumulator, workplaceRecord) => {
      const workRateValue = parseFloat(workplaceRecord.workRate);
      if (!isNaN(workRateValue)) {
        accumulator.sum += workRateValue;
        accumulator.count++;
      }
      return accumulator;
    },
    { sum: 0, count: 0 }
  );

  if (sumWorkRate.sum) {
    alert(sumWorkRate.sum);
  }

  //edit data table
  const [formData, setFormData] = useState({
    day: "",
    workplaceId: "",
    allTimes: "",
    workRate: "",
    workRateMultiply: "",
    otTimes: "",
    workRateOT: "",
    workRateOTMultiply: "",
    addSalaryDay: "",
    shift: "",
    workType: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange_back = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function roundToNearestHalf(num) {
    return Math.round(num * 2) / 2;
  }

  const saveFormData = async () => {
    if (editIndex !== null) {
      await setLoadStatus("load");

      const updatedDataTable = await [...dataTable];
      updatedDataTable[editIndex] = formData;
      await setDataTable(updatedDataTable);
      await setEditIndex(null);
    } else {
      await setDataTable([...dataTable, formData]);
    }
    await setFormData({ id: "", name: "", lastname: "" });
  };

  const editData = (index) => {
    setEditIndex(index);
    const {
      day,
      workplaceId,
      allTimes,
      workRate,
      workRateMultiply,
      otTimes,
      workRateOT,
      workRateOTMultiply,
      addSalaryDay,
      shift,
      workType,
    } = dataTable[index];
    setFormData({
      day,
      workplaceId,
      allTimes,
      workRate,
      workRateMultiply,
      otTimes,
      workRateOT,
      workRateOTMultiply,
      addSalaryDay,
      shift,
      workType,
    });
  };

  const [sumRate, setSumRate] = useState(0);
  const [sumRateOT, setSumRateOT] = useState(0);
  const [sumAddSalary, setSumAddSalary] = useState(0);

  const calculatedArray = useMemo(() => {
    return resultArrayWithWorkplaceRecords.map((record) => {
      const numericDate = parseInt(record.dates, 10);
      if (
        !isNaN(numericDate) &&
        commonNumbersArray.includes(numericDate.toString())
      ) {
        if (commonNumbers123.has(numericDate)) {
          // const workOfHour = parseFloat(record.workOfHour) || 0;
          const workOfHour = parseFloat(record.workOfHour) || 0;

        const workRate = parseFloat(record.workRate) || 0;
        const otTimes = parseFloat(record.otTimes) || 0;
        const workRateOT = parseFloat(record.workRateOT) || 0;
        const holiday = parseFloat(record.holiday) || 0;
        const holidayOT = parseFloat(record.holidayOT) || 0;

        // const calculatedValue = workRate * holiday;
        // const calculatedValueOT = ((workRate / workOfHour) * holidayOT) * otTimes;

        //calculator Rate
        if (record.shift == "specialt_shift" && record.cashSalary == "") {
          const calculatedValue = parseFloat(record.specialtSalary) || 0;
          const calculatedValueOT = parseFloat(record.specialtSalaryOT) || 0;
          const workRateMultiply = roundToNearestHalf(
            (parseFloat(record.specialtSalary) || 0) / workRate
          );
          const workRateOTMultiply = roundToNearestHalf(
            (parseFloat(record.specialtSalaryOT) || 0) / workRate
          );

          return {
            ...record,
            calculatedValue,
            calculatedValueOT,
            workRateMultiply,
            workRateOTMultiply,
          };
        } else {
          const calculatedValue = workRate * holiday;
          const calculatedValueOT =
            (workRate / workOfHour) * holidayOT * otTimes;
          const workRateMultiply = holiday;
          const workRateOTMultiply = holidayOT;

          // alert('workRate ' + workRate )
          // alert('holidayOT ' + holidayOT);
          return {
            ...record,
            calculatedValue,
            calculatedValueOT,
            workRateMultiply,
            workRateOTMultiply,
          };
        }

        // return {
        //     ...record,
        //     calculatedValue,
        //     calculatedValueOT,
        // };
      } else {
        // const workOfHour = parseFloat(record.workOfHour) || 0;

        const workOfHour = parseFloat(record.workOfHour) || 0;

        const workRate = parseFloat(record.workRate) || 0;
        const otTimes = parseFloat(record.otTimes) || 0;
        const workRateOT = parseFloat(record.workRateOT) || 0;
        const dayoffRateHour = parseFloat(record.dayoffRateHour) || 0;
        const dayoffRateOT = parseFloat(record.dayoffRateOT) || 0;

        // const calculatedValue = workRate * dayoffRateHour;
        // const calculatedValueOT = ((workRate / workOfHour) * dayoffRateOT) * otTimes;

        if (record.shift == "specialt_shift" && record.cashSalary == "") {
          const calculatedValue = parseFloat(record.specialtSalary) || 0;
          const calculatedValueOT = parseFloat(record.specialtSalaryOT) || 0;
          const workRateMultiply = roundToNearestHalf(
            (parseFloat(record.specialtSalary) || 0) / workRate
          );
          const workRateOTMultiply = roundToNearestHalf(
            (parseFloat(record.specialtSalaryOT) || 0) / workRate
          );

          return {
            ...record,
            calculatedValue,
            calculatedValueOT,
            workRateMultiply,
            workRateOTMultiply,
          };
        } else {
          const calculatedValue = workRate * dayoffRateHour;
          const calculatedValueOT =
            (workRate / workOfHour) * dayoffRateOT * otTimes;
          const workRateMultiply = dayoffRateHour;
          const workRateOTMultiply = dayoffRateOT;
          // alert('dayoffRateHour ' + dayoffRateHour)
          // alert('workRate day off' + workRate )
          // alert('dayoffRateOT' + dayoffRateOT);

          return {
            ...record,
            calculatedValue,
            calculatedValueOT,
            workRateMultiply,
            workRateOTMultiply,
          };
        }

        // return {
        //     ...record,
        //     calculatedValue,
        //     calculatedValueOT,
        // };
      }
    }

    // If the condition is not met, return the original object
    return record;
  });
  }, [resultArrayWithWorkplaceRecords, commonNumbers123, commonNumbersArray]);

  const processedDataTable = useMemo(() => {
    let ans = 0;
    let ans1 = 0;
    let ans2 = 0;

    const updatedDataTable = calculatedArray.map((item, index) => {
      let addSalaryDay1 = "";
      if (item !== "") {
        addSalaryDay1 = addSalaryDay;
      }

      let workRateOT2 = "";
      if (item.shift == "specialt_shift" && item.cashSalary == "") {
        workRateOT2 =
          !isNaN(item.specialtSalaryOT) && !isNaN(item.workRateOT)
            ? `${parseFloat(item.specialtSalaryOT).toFixed(2)}`
            : "";
      } else {
        workRateOT2 =
          !isNaN(item.workRate) &&
          !isNaN(item.workOfHour) &&
          !isNaN(item.workRateOT)
            ? `${(
                (item.workRate / item.workOfHour) *
                item.workRateOT *
                item.otTimes
              ).toFixed(2)} (${item.workRateOT})`
            : "";
      }

      const hasCalculatedValues =
        typeof item === "object" && "calculatedValue" in item;
      const hasCalculatedValuesOT =
        typeof item === "object" && "calculatedValueOT" in item;

      let workRate = "";
      if (item.shift == "specialt_shift" && item.cashSalary == "") {
        workRate = item.specialtSalary;
      } else {
        workRate = hasCalculatedValues ? item.calculatedValue : item.workRate;
      }
      
      let workRateOT = "";
      if (commonNumbers123.has(parseInt(item.dates, 10))) {
        workRateOT = hasCalculatedValuesOT
          ? item.calculatedValueOT + " (" + item.holidayOT + ")"
          : workRateOT2;
      } else {
        workRateOT = hasCalculatedValuesOT
          ? item.calculatedValueOT + " (" + item.dayoffRateOT + ")"
          : workRateOT2;
      }

      const tmp = {
        day: resultArray[index],
        workplaceId: item.workplaceId,
        allTimes: item.allTimes,
        workRate: workRate,
        otTimes: item.otTimes,
        workRateOT: workRateOT,
        addSalaryDay: addSalaryDay1,
      };
      
      if (!isNaN(item.workRate)) {
        ans = ans + parseFloat(workRate);
        ans1 = ans1 + parseFloat(workRateOT, 10);
        ans2 = ans2 + parseFloat(addSalaryDay1, 10);
      }

      return tmp;
    });

    return {
      dataTable: updatedDataTable,
      sumRate: ans,
      sumRateOT: ans1,
      sumAddSalary: ans2
    };
  }, [calculatedArray, addSalaryDay, resultArray, commonNumbers123]);

  useEffect(() => {
    if (loadStatus == null && processedDataTable) {
      setSumRate(processedDataTable.sumRate);
      setSumRateOT(processedDataTable.sumRateOT);
      setSumAddSalary(processedDataTable.sumAddSalary);
      setDataTable(processedDataTable.dataTable);
    }
  }, [processedDataTable, loadStatus]);

  // console.log("sumRate", sumRate);
  // console.log("dataTable", dataTable);

  const extractDayNumber = useCallback((dateString) => {
    const [day] = dateString.split("/");
    return parseInt(day, 10);
  }, []);

  const resultArray22 = useMemo(() => 
    dataTable.map((entry) => extractDayNumber(entry.day)), 
    [dataTable, extractDayNumber]
  );

  // console.log("resultArray22", resultArray22);

  const createBy = localStorage.getItem("user");
  const [update, setUpdate] = useState(null);

  const saveconclude = async () => {
    const jsonObject = await JSON.parse(createBy);
    const tmpcurrentDate = new Date();
    const tmpday = tmpcurrentDate.getDate().toString().padStart(2, "0");
    const tmpmonth = (tmpcurrentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Note: Month starts from 0
    const tmpyear = tmpcurrentDate.getFullYear();
    const formattedDate = `${tmpday}-${tmpmonth}-${tmpyear}`;

    // ใช้ข้อมูลจาก concludeResultx ที่มีการแก้ไขแล้ว แทนที่จะใช้ dataTable
    let concludeRecord = [];
    
    console.log("🔍 === การสร้าง concludeRecord ===");
    console.log("📊 ConcludeResultx.length:", concludeResultx.length);
    console.log("📊 EditedData keys:", Object.keys(editedData));
    console.log("📊 EditedData content:", JSON.stringify(editedData, null, 2));
    
    if (concludeResultx.length > 0) {
      console.log("📋 Using concludeResultx data");
      console.log("📋 Original employee_record count:", concludeResultx[0].employee_record.length);
      
      // ใช้ข้อมูลที่แก้ไขแล้วจาก concludeResultx ที่ได้ผ่านการอัพเดทจาก handleSave
      concludeRecord = concludeResultx[0].employee_record;
      
      // ไม่ต้องทำการแก้ไขซ้ำ เพราะ handleSave ได้อัพเดทข้อมูลใน concludeResultx แล้ว
      // แต่ถ้ามีข้อมูลใน editedData ที่ยังไม่ได้บันทึก ให้อัพเดทเพิ่มเติม
      concludeRecord = concludeRecord.map((record, recordIndex) => {
        const updatedRecord = { ...record };
        
        console.log(`🔍 Processing record ${recordIndex}:`, {
          workplaceId: record.workplaceId,
          date: record.date,
          originalAddSalaryDaily: record.addSalaryDaily?.length || 0,
          originalSalaryValue: record.addSalaryDaily?.[0]?.SpSalary
        });
        
        // ค้นหาข้อมูลที่แก้ไขสำหรับ record นี้
        Object.keys(editedData).forEach((key) => {
          const match = key.match(/^(\d+)-(\d+)-(\d+)_(.+)_table$/);
          if (match) {
            const [, index, subIndex, idx, field] = match;
            
            // Debug: แสดงข้อมูลการจับคู่
            console.log(`🔍 Matching key: ${key}, idx: ${idx}, recordIndex: ${recordIndex}, field: ${field}`, editedData[key]);
            
            // ตรวจสอบว่าเป็น record ที่ถูกต้องหรือไม่ โดยเทียบ idx กับ recordIndex
            if (parseInt(idx) === recordIndex && editedData[key] !== undefined) {
              console.log(`✅ Applying edit for record ${recordIndex}, field: ${field}`, editedData[key]);
              if (field === 'addSalaryDaily') {
                // สำหรับ addSalaryDaily ให้ใช้ข้อมูลจาก editedData
                updatedRecord[field] = Array.isArray(editedData[key]) ? editedData[key] : [];
                console.log(`💾 Updated addSalaryDaily for record ${recordIndex}:`, updatedRecord[field]);
              } else {
                // สำหรับฟิลด์อื่นๆ
                updatedRecord[field] = editedData[key];
                console.log(`💾 Updated ${field} for record ${recordIndex}:`, updatedRecord[field]);
              }
            }
          }
        });
        
        console.log(`✅ Final record ${recordIndex} addSalaryDaily:`, updatedRecord.addSalaryDaily?.[0]?.SpSalary);
        return updatedRecord;
      });
    } else {
      console.log("📋 Using dataTable as fallback");
      // ถ้าไม่มี concludeResultx ให้ใช้ dataTable แทน
      concludeRecord = dataTable;
    }
    
    console.log("🎯 Final concludeRecord count:", concludeRecord.length);
    concludeRecord.forEach((record, index) => {
      console.log(`🎯 Final record ${index} addSalaryDaily:`, record.addSalaryDaily?.[0]?.SpSalary);
    });
    console.log("================================");

    await dataTable.map(async (item, index) => {
      if (!item.workplaceId) {
        // alert(index);
        const tmp = await [...addSalaryList];
        tmp[index] = await [];
        await setAddSalaryList(tmp);
      }
    });

    const data = await {
      year: year,
      month: month,
      concludeDate: formattedDate,
      employeeId: staffId,
      concludeRecord: concludeRecord, // ใช้ข้อมูลที่แก้ไขแล้ว
      addSalary: addSalaryList,
      createBy: jsonObject.name,
      sumWorkHour: sumWorkHourX,
      sumWorkRate: sumWorkRateX,
      sumWorkHourOt: sumWorkHourOtX,
      sumWorkRateOt: sumWorkRateOtX,
      status: editStatus,
    };

    // Debug: แสดงข้อมูลที่จะส่งไปยัง API
    console.log("🔍 EditedData before save:", JSON.stringify(editedData, null, 2));
    console.log("🔍 ConcludeResultx before processing:", JSON.stringify(concludeResultx, null, 2));
    
    // ตรวจสอบข้อมูล concludeRecord แต่ละ record
    console.log("🔍 ConcludeRecord details:", concludeRecord.length, "records");
    concludeRecord.forEach((record, index) => {
      console.log(`📋 Record ${index}:`, {
        addSalaryDaily: record.addSalaryDaily,
        workplaceId: record.workplaceId,
        date: record.date
      });
      
      if (record.addSalaryDaily && record.addSalaryDaily.length > 0) {
        console.log(`💰 Record ${index} salary details:`, record.addSalaryDaily[0]);
      }
    });
    
    console.log("🔍 Final data to be sent to server:", JSON.stringify(data, null, 2));
    console.log("🔍 ConcludeRecord being sent:", JSON.stringify(concludeRecord, null, 2));
    
    // ตรวจสอบข้อมูลแต่ละ record ที่จะส่งไป
    console.log("📝 === การตรวจสอบข้อมูลก่อนส่ง ===");
    if (concludeRecord && concludeRecord.length > 0) {
      concludeRecord.forEach((record, index) => {
        console.log(`📋 Record ${index}:`, {
          workplaceId: record.workplaceId,
          date: record.date,
          hasAddSalaryDaily: !!record.addSalaryDaily,
          addSalaryCount: record.addSalaryDaily?.length || 0
        });
        
        if (record.addSalaryDaily && record.addSalaryDaily.length > 0) {
          record.addSalaryDaily.forEach((item, itemIndex) => {
            console.log(`  💰 Salary item ${itemIndex}:`, {
              id: item.id,
              name: item.name,
              SpSalary: item.SpSalary,
              valueType: typeof item.SpSalary,
              isOriginalValue: item.SpSalary === "30",
              isEditedValue: item.SpSalary !== "30"
            });
          });
        }
      });
    } else {
      console.log("⚠️ Warning: No concludeRecord data to send!");
    }
    console.log("===============================");
    // console.log("🔍 Data to save:", JSON.stringify(data, null, 2));
    // console.log("🔍 Conclude Record:", JSON.stringify(concludeRecord, null, 2));
    // console.log("🔍 Original concludeResultx:", JSON.stringify(concludeResultx, null, 2));
    // console.log("🔍 EditedData:", JSON.stringify(editedData, null, 2));
    // console.log("🔍 Update ID:", update);
    // console.log("🔍 Edit Status:", editStatus);

    //ccc
    if (update == null && editStatus == "") {
      //create new conclude record
      try {
        console.log("📤 Creating new conclude record...");
        const response = await axios.post(endpoint + "/conclude/create", data);

        if (response) {
          console.log("✅ Create response:", response.data);
          
          // รอสักครู่ให้เซิร์ฟเวอร์ประมวลผลข้อมูลเสร็จก่อน
          console.log("⏳ Waiting 2 seconds for server to process...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // ล้างข้อมูลที่แก้ไขใน localStorage หลังบันทึกสำเร็จ
          const editedDataKey = `editedData_${staffId}_${month}_${year}`;
          localStorage.removeItem(editedDataKey);
          console.log("🧹 Cleared localStorage key:", editedDataKey);
          setEditedData({}); // ล้างข้อมูลที่แก้ไขใน state ด้วย
          console.log("🧹 Cleared editedData state");
          
          // โหลดข้อมูลใหม่หลังบันทึกสำเร็จ
          console.log("🔄 Calling refreshData after create...");
          await refreshData();
          
          alert("บันทึกสำเร็จ");
        }
      } catch (e) {
        console.error("❌ Create error:", e);
        alert("บันทึกไม่สำเร็จ");
        alert(e);
      }
    } else {
      try {
        console.log("📤 Updating conclude record with ID:", update);
        console.log("🔍 Data being sent for update:", JSON.stringify(data, null, 2));
        
        // ตรวจสอบข้อมูล addSalaryDaily ในแต่ละ record ก่อนส่ง
        if (data.concludeRecord && data.concludeRecord.length > 0) {
          console.log("🔍 Records to update:", data.concludeRecord.length);
          data.concludeRecord.forEach((record, index) => {
            if (record.addSalaryDaily) {
              console.log(`💰 Update Record ${index} addSalaryDaily:`, record.addSalaryDaily);
              // ตรวจสอบค่าแต่ละ item ในรายละเอียด
              record.addSalaryDaily.forEach((salaryItem, salaryIndex) => {
                console.log(`  💸 Salary item ${salaryIndex} being sent to server:`, {
                  id: salaryItem.id,
                  name: salaryItem.name,
                  SpSalary: salaryItem.SpSalary,
                  valueType: typeof salaryItem.SpSalary,
                  isString: typeof salaryItem.SpSalary === 'string',
                  numericValue: parseFloat(salaryItem.SpSalary),
                  originalExpected: "30",
                  hasBeenModified: salaryItem.SpSalary !== "30",
                  entireObject: JSON.stringify(salaryItem)
                });
              });
            }
          });
          
          // แสดง Raw JSON ที่จะส่งไป
          console.log("📄 Raw JSON payload for server:");
          console.log(JSON.stringify(data.concludeRecord, null, 2));
        }
        
        const response = await axios.put(
          endpoint + "/conclude/update1/" + update,
          data
        );

        const updatedDoc = response?.data?.data;
        if (updatedDoc) {
          console.log("✅ ข้อมูลหลังอัปเดต:", updatedDoc);
          console.log("🔍 Server response analysis:");
          console.log("  - Response status:", response.status);
          console.log("  - Response data:", JSON.stringify(response.data, null, 2));
          
          // ตรวจสอบข้อมูลที่เซิร์ฟเวอร์ส่งกลับมา
          if (updatedDoc.concludeRecord && updatedDoc.concludeRecord.length > 0) {
            console.log("📊 Updated records from server:", updatedDoc.concludeRecord.length);
            
            let shouldRetry = false;
            
            updatedDoc.concludeRecord.forEach((record, index) => {
              if (record.addSalaryDaily) {
                console.log(`🎯 Server returned record ${index} addSalaryDaily:`, record.addSalaryDaily);
                
                // ตรวจสอบว่าค่าที่ server ส่งกลับตรงกับที่เราส่งไปหรือไม่
                record.addSalaryDaily.forEach((salaryItem, salaryIndex) => {
                  const sentItem = data.concludeRecord[index]?.addSalaryDaily?.[salaryIndex];
                  
                  if (sentItem && salaryItem.SpSalary !== sentItem.SpSalary) {
                    console.log(`⚠️ Mismatch in record ${index}, salary ${salaryIndex}:`);
                    console.log(`  - Sent: ${sentItem.SpSalary}`);
                    console.log(`  - Received: ${salaryItem.SpSalary}`);
                    shouldRetry = true;
                  }
                });
              }
            });
            
            // ถ้าพบความไม่ตรงกัน ให้ retry
            if (shouldRetry) {
              console.log("🔄 Server data doesn't match sent data. Attempting retry...");
              await new Promise(resolve => setTimeout(resolve, 2000)); // รอ 2 วินาที
              
              const retryResponse = await axios.put(
                endpoint + "/conclude/update1/" + update,
                data
              );
              
              console.log("🔄 Retry response:", JSON.stringify(retryResponse.data, null, 2));
            }
          }
          
          // ตรวจสอบทันทีว่าข้อมูลถูกบันทึกจริงหรือไม่
          console.log("🔍 Verifying save operation...");
          try {
            const verifyData = {
              employeeId: searchEmployeeId,
              month: month,
              year: year,
              _verify: Date.now()
            };
            
            const verifyResponse = await axios.post(
              endpoint + "/conclude/searchtimerecordemployee",
              verifyData
            );
            
            if (verifyResponse.data?.result?.length > 0) {
              const verifyRecord = verifyResponse.data.result[0]?.employee_record[0];
              console.log("✅ Verification: Data immediately after save:", verifyRecord?.addSalaryDaily);
              
              if (verifyRecord?.addSalaryDaily?.[0]?.SpSalary) {
                console.log("🎯 Verification: Server has salary value:", verifyRecord.addSalaryDaily[0].SpSalary);
              }
            }
          } catch (verifyError) {
            console.warn("⚠️ Could not verify save operation:", verifyError);
          }
          
          // รอสักครู่ให้เซิร์ฟเวอร์ประมวลผลข้อมูลเสร็จก่อน
          console.log("⏳ Waiting 2 seconds for server to process...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // ล้างข้อมูลที่แก้ไขใน localStorage หลังบันทึกสำเร็จ
          const editedDataKey = `editedData_${staffId}_${month}_${year}`;
          localStorage.removeItem(editedDataKey);
          console.log("🧹 Cleared localStorage key:", editedDataKey);
          setEditedData({}); // ล้างข้อมูลที่แก้ไขใน state ด้วย
          console.log("🧹 Cleared editedData state");
          
          // โหลดข้อมูลใหม่หลังบันทึกสำเร็จ
          console.log("🔄 Calling refreshData after update...");
          await refreshData();
          
          alert("บันทึกสำเร็จ");
          // window.location.reload(); // หรือเรียก fetch ใหม่แทน reload
        } else {
          alert("❌ บันทึกล้มเหลว: ไม่พบข้อมูลที่อัปเดต");
        }
        // if (response) {
        //   alert("บันทึกสำเร็จ");
        //   // window.location.reload();
        // }
      } catch (error) {
        console.error("❌ Axios PUT error:", error.response?.data || error.message);
        
        // ตรวจสอบ error type
        if (error.response?.status === 404) {
          console.log("🔍 404 Error - Record not found. Checking if ID is correct...");
          console.log("🔍 Current update ID:", update);
          console.log("🔍 ConcludeResultx ID:", concludeResultx[0]?._id);
          
          // พยายามใช้ ID จาก concludeResultx แทน
          if (concludeResultx[0]?._id && concludeResultx[0]._id !== update) {
            console.log("🔄 Trying with correct ID from concludeResultx...");
            try {
              const retryResponse = await axios.put(
                endpoint + "/conclude/update1/" + concludeResultx[0]._id,
                dataToSend
              );
              console.log("✅ Retry with correct ID successful:", retryResponse.data);
              
              // อัปเดต state ด้วย ID ที่ถูกต้อง
              setUpdate(concludeResultx[0]._id);
              
              alert("บันทึกสำเร็จ (ใช้ ID ที่ถูกต้อง)");
              await refreshData();
              return;
            } catch (retryError) {
              console.error("❌ Retry with correct ID also failed:", retryError.response?.data || retryError.message);
            }
          }
        }
        
        alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล\nError: " + (error.response?.data?.message || error.message));
        // window.location.reload();
      }
    }
    // else {
    //     alert('บันทึกไม่สำเร็จ');
    // }
  };

  const shiftMapping = {
    morning_shift: "กะเช้า",
    afternoon_shift: "กะบ่าย",
    night_shift: "กะดึก",
    special_shift: "กะพิเศษ",
    specialt_shift: "กะพิเศษ",
  };


  //latest code
  const [concludeResultx, setConcludeResultx] = useState([]); // Store search results
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Store errors

  // ฟังก์ชันสำหรับรีเฟรชข้อมูลหลังบันทึกสำเร็จ
  const refreshData = useCallback(async () => {
    console.log("🔄 Starting refreshData...", { searchEmployeeId, month, year });
    
    if (!searchEmployeeId || !month || !year) {
      console.log("❌ RefreshData cancelled - missing search parameters");
      return;
    }

    const data = {
      employeeId: searchEmployeeId,
      month: month,
      year: year,
      _timestamp: Date.now() // เพิ่ม timestamp เพื่อป้องกัน cache
    };

    try {
      console.log("📡 Refreshing data with:", data);
      
      // ดึงข้อมูลพนักงานเพื่อเช็ค salary และ workplace
      const employeeSearchData = {
        employeeId: searchEmployeeId
      };
      
      const employeeResponse = await axios.post(
        endpoint + "/employee/search",
        employeeSearchData
      );
      
      let employeeSalary = 0;
      let isMonthlyEmployee = false;
      
      if (employeeResponse.data?.employees?.length > 0) {
        const employee = employeeResponse.data.employees[0];
        employeeSalary = parseFloat(employee.salary) || 0;
        isMonthlyEmployee = employeeSalary > 1680;
      }

      // ใช้ POST temporarily until backend is restarted
      const response = await axios.post(
        endpoint + "/conclude/searchtimerecordemployee",
        data
      );

      if (response.data?.result?.length > 0) {
        console.log("📦 Fresh data received:", response.data.result[0]?.employee_record[0]?.addSalaryDaily);
        console.log("🔍 Full employee_record structure:", JSON.stringify(response.data.result[0]?.employee_record[0], null, 2));
        console.log("🔍 All employee_records:", response.data.result[0]?.employee_record?.length, "records");
        
        // ตรวจสอบ addSalaryDaily ในทุก record
        response.data.result[0]?.employee_record?.forEach((record, index) => {
          console.log(`📋 Record ${index} addSalaryDaily:`, record.addSalaryDaily);
        });
        
        // ตรวจสอบว่าข้อมูลที่ได้รับกลับมาตรงกับที่เราแก้ไขหรือไม่
        const firstRecord = response.data.result[0]?.employee_record[0];
        if (firstRecord?.addSalaryDaily?.length > 0) {
          const firstSalaryItem = firstRecord.addSalaryDaily[0];
          console.log("🔍 Server returned salary value:", firstSalaryItem?.SpSalary);
          
          // ถ้าข้อมูลยังเป็นค่าเดิม (30) แทนที่จะเป็นค่าที่แก้ไข ให้แสดงคำเตือน
          if (firstSalaryItem?.SpSalary === "30") {
            console.warn("⚠️ Warning: Server returned original value (30) instead of edited value. This might indicate:");
            console.warn("  1. Save operation was not successful");
            console.warn("  2. Server database was not actually updated");
            console.warn("  3. Server is returning cached data");
            console.warn("  4. There's a delay in database update propagation");
          }
        }
        
        // เพิ่มข้อมูล salary ลงใน employee_record ของแต่ละ record
        const updatedResult = response.data.result.map(record => ({
          ...record,
          employee_record: record.employee_record.map(empRecord => ({
            ...empRecord,
            salary: employeeSalary,
            isMonthlyEmployee: isMonthlyEmployee
          }))
        }));
        
        setConcludeResultx(updatedResult);
        setUpdate(response.data?.result[0]?._id);
        console.log("🔄 ข้อมูลถูกรีเฟรชเรียบร้อยแล้ว - Updated concludeResultx");
        console.log("🎯 New addSalaryDaily values:", updatedResult[0]?.employee_record[0]?.addSalaryDaily);
        console.log("🎯 Total records after refresh:", updatedResult[0]?.employee_record?.length);
        console.log("✅ Data successfully refreshed with", updatedResult.length, "records");
      } else {
        console.log("❌ No data received from API during refresh");
      }
    } catch (e) {
      console.error("❌ Error refreshing data:", e);
    }
  }, [searchEmployeeId, month, year]);

  // Monitor concludeResultx changes for debugging
  useEffect(() => {
    if (concludeResultx.length > 0) {
      console.log("🔔 ConcludeResultx state updated:", {
        totalRecords: concludeResultx.length,
        firstRecordEmployeeRecords: concludeResultx[0]?.employee_record?.length,
        firstEmployeeRecord: concludeResultx[0]?.employee_record[0]?.addSalaryDaily?.length,
        timestamp: new Date().toISOString()
      });
    }
  }, [concludeResultx]);

  async function handleSearch(event) {
    event.preventDefault();

    // Save search values in localStorage
    localStorage.setItem("employeeId", searchEmployeeId);
    localStorage.setItem("employeeName", searchEmployeeName);
    localStorage.setItem("month", month);
    localStorage.setItem("year", year);

    // Reset previous results
    setConcludeResultx([]);
    setLoading(true);
    setError(null);

    const data = {
      employeeId: searchEmployeeId,
      month: month,
      year: year,
    };

    try {
      // ดึงข้อมูลพนักงานเพื่อเช็ค salary และ workplace
      const employeeSearchData = {
        employeeId: searchEmployeeId
      };
      
      const employeeResponse = await axios.post(
        endpoint + "/employee/search",
        employeeSearchData
      );
      
      let employeeSalary = 0;
      let isMonthlyEmployee = false;
      
      if (employeeResponse.data?.employees?.length > 0) {
        const employee = employeeResponse.data.employees[0];
        employeeSalary = parseFloat(employee.salary) || 0;
        isMonthlyEmployee = employeeSalary > 1680;
        // console.log("salary from employee/search:", employeeSalary);
      }

      const response = await axios.post(
        endpoint + "/conclude/searchtimerecordemployee",
        data
      );

      if (response.data?.result?.length > 0) {
        // เพิ่มข้อมูล salary ลงใน employee_record ของแต่ละ record
        const updatedResult = response.data.result.map(record => ({
          ...record,
          employee_record: record.employee_record.map(empRecord => ({
            ...empRecord,
            salary: employeeSalary,
            isMonthlyEmployee: isMonthlyEmployee
          }))
        }));
        
        await setConcludeResultx(updatedResult);
        await setUpdate(response.data?.result[0]?._id)
        // alert(JSON.stringify(response.data?.result[0]?.employee_record[0].addSalaryDaily, null, 2));
      } else {
        // alert("Conclude is null");
      }
    } catch (e) {
      setError("An error occurred while fetching data.");
      console.error(e);
    } finally {
      setLoading(false);
      
    }
  }


  //sum concludeResultx
  const [dataTotals , setDataTotals ] = useState({});

  //edit table 
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedData, setEditedData] = useState({});

  const dataTotalsCalculation = useMemo(() => {
    const sum = (data) => {
      if (!data || !data.employee_record) return {
        totalTime: 0,
        beforeTotalOtTime: 0,
        totalOtTime: 0,
        cashBeforeOt: 0,
        cashWork: 0,
        cashOt: 0,
        addSalaryTotal: 0
      };
  
      return data.employee_record.reduce((acc, record, recordIndex) => {
        // Check for edited data for this specific record
        const getEditedValue = (field) => {
          // Find edited data that matches this record
          for (const key of Object.keys(editedData)) {
            const match = key.match(/^(\d+)-(\d+)-(\d+)_(.+)_table$/);
            if (match) {
              const [, index, subIndex, idx, editedField] = match;
              if (parseInt(idx) === recordIndex && editedField === field) {
                return editedData[key];
              }
            }
          }
          return record[field]; // Return original if no edited value found
        };

        // Use edited values if available, otherwise use original values
        const totalTime = parseFloat(getEditedValue('totalTime')) || 0;
        const beforeTotalOtTime = parseFloat(getEditedValue('beforeTotalOtTime')) || 0;
        const totalOtTime = parseFloat(getEditedValue('totalOtTime')) || 0;
        const cashBeforeOt = parseFloat(getEditedValue('cashBeforeOt')) || 0;
        const cashWork = parseFloat(getEditedValue('cashWork')) || 0;
        const cashOt = parseFloat(getEditedValue('cashOt')) || 0;

        // Sum the values
        acc.totalTime += totalTime;
        acc.beforeTotalOtTime += beforeTotalOtTime;
        acc.totalOtTime += totalOtTime;
        acc.cashBeforeOt += cashBeforeOt;
        acc.cashWork += cashWork;
        acc.cashOt += cashOt;

        // Calculate addSalaryDaily sum
        let addSalarySum = 0;
        
        // Check for edited addSalaryDaily first
        for (const key of Object.keys(editedData)) {
          const match = key.match(/^(\d+)-(\d+)-(\d+)_addSalaryDaily_table$/);
          if (match) {
            const [, index, subIndex, idx] = match;
            if (parseInt(idx) === recordIndex) {
              const editedSalaryData = editedData[key] || [];
              addSalarySum = editedSalaryData.reduce((sum, salary) => sum + parseFloat(salary.SpSalary || 0), 0);
              break; // Found edited data, stop looking
            }
          }
        }
        
        // If no edited data found, use original addSalaryDaily
        if (addSalarySum === 0 && record.addSalaryDaily) {
          addSalarySum = record.addSalaryDaily.reduce((sum, salary) => sum + parseFloat(salary.SpSalary || 0), 0);
        }
        
        acc.addSalaryTotal += addSalarySum;

        return acc; 
      }, {
        totalTime: 0,
        beforeTotalOtTime: 0,
        totalOtTime: 0,
        cashBeforeOt: 0,
        cashWork: 0,
        cashOt: 0,
        addSalaryTotal: 0
      });
    };
  
    if (concludeResultx.length > 0) {
      return sum(concludeResultx[0]);
    }
    return {
      totalTime: 0,
      beforeTotalOtTime: 0,
      totalOtTime: 0,
      cashBeforeOt: 0,
      cashWork: 0,
      cashOt: 0,
      addSalaryTotal: 0
    };
  }, [concludeResultx, editedData]);

  useEffect(() => {
    // เปรียบเทียบด้วย JSON.stringify เพื่อป้องกัน infinite loop
    const newTotals = dataTotalsCalculation;
    const currentTotalsString = JSON.stringify(dataTotals);
    const newTotalsString = JSON.stringify(newTotals);
    
    if (currentTotalsString !== newTotalsString) {
      setDataTotals(newTotals);
    }
  }, [dataTotalsCalculation, dataTotals]);

  
// โหลดข้อมูลที่แก้ไขจาก localStorage เมื่อ component mount
useEffect(() => {
  const editedDataKey = `editedData_${staffId}_${month}_${year}`;
  const savedEditedData = localStorage.getItem(editedDataKey);
  if (savedEditedData && staffId && month && year) {
    try {
      const parsedData = JSON.parse(savedEditedData);
      setEditedData(parsedData);
      // console.log("🔄 Loaded edited data from localStorage:", parsedData);
    } catch (e) {
      console.error("❌ Error parsing saved edited data:", e);
    }
  }
}, [staffId, month, year]); // เพิ่ม dependency array

// Save editedData to localStorage when it changes
useEffect(() => {
  if (staffId && month && year && Object.keys(editedData).length > 0) {
    const editedDataKey = `editedData_${staffId}_${month}_${year}`;
    localStorage.setItem(editedDataKey, JSON.stringify(editedData));
  }
}, [editedData, staffId, month, year]);

// Handle input change
const handleInputChange = useCallback((event, field, index, subIndex, idx) => {
  const newValue = event.target.value;
  const key = `${index}-${subIndex}-${idx}_${field}_table`;

  setEditedData((prev) => ({
    ...prev,
    [key]: newValue,
  }));
}, []);

// Handle input change for addSalaryDaily items
const handleAddSalaryInputChange = useCallback((index, subIndex, idx, salaryIndex, field, value) => {
  const key = `${index}-${subIndex}-${idx}_addSalaryDaily_table`;
  
  setEditedData(prev => {
    const updatedSalaries = [...(prev[key] || [])];
    if (!updatedSalaries[salaryIndex]) {
      updatedSalaries[salaryIndex] = {};
    }
    updatedSalaries[salaryIndex] = {
      ...updatedSalaries[salaryIndex],
      [field]: value
    };
    
    return {
      ...prev,
      [key]: updatedSalaries
    };
  });
}, []);


// Handle delete for salary items
const handleDeleteSalary = (index, subIndex, idx, salaryIndex) => {
  // alert(" index " + index + " subIndex " + " idx " + idx + " salaryIndex " + salaryIndex)
  setEditedData((prev) => {
    const key = `${index}-${subIndex}-${idx}_addSalaryDaily_table`;
    const updatedSalaries = [...(prev[key] || [])];
    updatedSalaries.splice(salaryIndex, 1);
    return {
      ...prev,
      [key]: updatedSalaries,
    };
  });
};

// Handle add new salary item
const handleAddSalaryItem = (index, subIndex, idx) => {
  const key = `${index}-${subIndex}-${idx}_addSalaryDaily_table`;
  setEditedData(prev => {
    const updatedSalaries = [...(prev[key] || [])];
    updatedSalaries.push({ 
      id: "", 
      name: "", 
      SpSalary: "0",
      roundOfSalary: "daily",
      StaffType: "",
      nameType: "",
      _id: ""
    });
    return {
      ...prev,
      [key]: updatedSalaries
    };
  });
};
const handleSave = (index, subIndex, idx) => {
  setEditStatus("update");
  // console.log("🔍 Before save - editedData:", JSON.stringify(editedData, null, 2));
  
  setConcludeResultx((prevData) => {
    const updatedData = JSON.parse(JSON.stringify(prevData));

    const updatedRecord = updatedData[index]?.employee_record?.[idx];
    if (updatedRecord) {
      // console.log("🔍 Original record before update:", JSON.stringify(updatedRecord, null, 2));
      
      Object.keys(editedData).forEach((key) => {
        const match = key.match(/^(\d+)-(\d+)-(\d+)_(.+)_table$/);
        if (match) {
          const [, i, j, k, field] = match;

          if (`${i}-${j}-${k}` === `${index}-${subIndex}-${idx}`) {
            // console.log(`🔄 Updating field ${field} with value:`, editedData[key]);
            
            // Special handling for addSalaryDaily field
            if (field === "addSalaryDaily") {
              // Ensure we have valid data structure
              const editedSalaryData = editedData[key] || [];
              
              // Map the edited data back to the proper addSalaryDaily structure
              updatedRecord["addSalaryDaily"] = editedSalaryData.map((item, salaryIndex) => ({
                id: item.id || (updatedRecord.addSalaryDaily[salaryIndex]?.id || ""),
                name: item.name || "",
                SpSalary: item.SpSalary || "0",
                roundOfSalary: item.roundOfSalary || "daily",
                StaffType: item.StaffType || "",
                nameType: item.nameType || "",
                _id: item._id || (updatedRecord.addSalaryDaily[salaryIndex]?._id || "")
              }));
              
              // console.log("💰 Updated addSalaryDaily:", updatedRecord["addSalaryDaily"]);
            } else {
              // Map other fields normally
              updatedRecord[field] = editedData[key];
            }
          }
        }
      });
      
      // console.log("🔍 Record after update:", JSON.stringify(updatedRecord, null, 2));
    }

    // console.log("🔍 Full updated data:", JSON.stringify(updatedData, null, 2));
    
    return updatedData;
  });

  setEditingIndex(null); // Exit edit mode
};

// Handle save and update concludeResultx
const handleSave_back = (index, subIndex, idx) => {
  setConcludeResultx((prevData) => {
    // Clone the array to trigger a re-render
    const updatedData = JSON.parse(JSON.stringify(prevData));

    // Find the correct record
    const updatedRecord = updatedData[index]?.employee_record?.[idx];
    if (updatedRecord) {
      Object.keys(editedData).forEach((key) => {
        const field = key.replace(/_\d+-\d+-sd+_table/, ""); // Remove index and "_table" suffix
        if (updatedRecord[field] !== undefined) {
          updatedRecord[field] = editedData[key]; // Update modified fields
        }
      });
    }
// alert(JSON.stringify(updatedData,null,2))
    return updatedData; // Return the new state
  });

  setEditingIndex(null); // Exit edit mode
};

  return (
    // <div>
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#"> การตั้งค่า</a>
            </li>
            <li className="breadcrumb-item active">ตารางค่าตอบแทน</li>
          </ol>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="far fa-arrow-alt-circle-right"></i> ตารางค่าตอบแทน
                </h1>
              </div>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <h2 className="title">ตารางค่าตอบแทน</h2>
              <section className="Frame">
                <div className="col-md-12">
                  <form onSubmit={handleSearch}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label role="searchEmployeeId">รหัสพนักงาน</label>
                          {/* <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} /> */}
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
                      <div className="col-md-6">
                        <div className="form-group">
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
                                value={employee.name + " " + employee.lastName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
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
                      <div className="col-md-6">
                        <div className="form-group">
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
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="btn b_save" type="submit">
                        <i className="nav-icon fas fa-search"></i> &nbsp; ค้นหา
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
                                                                รหัส {workplace.workplaceId} หน่วยงาน {workplace.workplaceName}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                </div>
              </section>
              <section className="Frame">
                {staffFullName ? (
                  <div className="row">
                    <div className="col-md-12">ชื่อ: {staffFullName}</div>
                  </div>
                ) : (
                  <div>
                    {/* Content to show when staffFullName is not set */}
                  </div>
                )}

                {/* {month ? (
                                    <div class="row">
                                        <div class="col-md-12">
                                            ตั้งแต่วันที่ 21 {thaiMonthLowerName} - 20 {thaiMonthName} ปี {year}
                                        </div>
                                    </div>) : (
                                    <div>
                                    </div>
                                )} */}

                <div className="d-flex justify-content-between ">
                  <td className="">
                    ตั้งแต่วันที่ 21 {thaiMonthLowerName} - 20 {thaiMonthName}{" "}
                    ปี {parseInt(year, 10) + 543}
                  </td>
                  <div className=""></div>
                  <div className="">
                    <div className="">
                      <button type="button" onClick={recal} className="btn b_save " >
                        {" "}
                        คำนวณใหม่
                      </button>
                    </div>
                  </div>
                </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div className="mt-3 alert alert-info">Loading data...</div>}

{/* Results Table */}
{concludeResultx.length > 0 && (

      <div className="mt-4">
      <div className="table-responsive">
        <table className="table table-bordered fw text-center">
          <thead>
            <tr >
              <th >วันที่</th>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>กลุ่ม</th>
              <th>กะ</th>
              <th>OT ก่อน</th>
              <th>ค่าจ้าง</th>
              <th>เวลาทำงาน</th>
              <th>ค่าจ้าง</th>
              <th>OT หลัง</th>
              <th>ค่าจ้าง</th>
              {/* <th>เงินเพิ่ม</th>  */}
              {/* <th>แก้ไข</th>  */}
            </tr>
          </thead>
          <tbody className="">
          
            {concludeResultx.map((record, index) => (
              <>
                {dataTable.map((workplaceRecord, subIndex) => {
                  const day = workplaceRecord.day.split("/")[0];
                  const matchedRecords = record.employee_record.filter((item) => item.date === day);

                  return matchedRecords.length > 0 ? (
                    matchedRecords.map((matchedRecord, idx) => {
                      const isEditing = editingIndex === `${index}-${subIndex}-${idx}`;

                      return (
                        <tr className="fw-normal" key={`${index}-${subIndex}-${idx}`}>
                          <th className="fw-normal" >{day}</th>
                          <th className="fw-normal">{matchedRecord.workplaceId}</th>
                          <th className="fw-normal">{matchedRecord.workplaceName}</th>
                          <th className="fw-normal">{matchedRecord.wGroup}</th>
                          <th className="fw-normal">{shiftMapping[matchedRecord.shift]}</th>

                          {/* Editable Fields */}
                          {["beforeTotalOtTime", "cashBeforeOt", "totalTime", "cashWork", "totalOtTime", "cashOt"].map(
                            (field) => {
                              // เช็คว่าเป็นพนักงานเงินเดือนหรือไม่จากข้อมูล salary ที่ดึงมา
                              const isMonthlyEmployee = matchedRecord.isMonthlyEmployee;
                              const employeeSalary = parseFloat(matchedRecord.salary) || 0;
                              
                              // คำนวณค่าสำหรับพนักงานเงินเดือน
                              let displayValue = matchedRecord[field];
                              
                              // ตรวจสอบว่ามีค่าที่แก้ไขแล้วหรือไม่ (ลำดับความสำคัญสูงสุด)
                              const editedKey = `${index}-${subIndex}-${idx}_${field}_table`;
                              if (editedData[editedKey] !== undefined && !isEditing) {
                                // ใช้ค่าที่แก้ไขแล้ว โดยไม่คำนวณใหม่
                                displayValue = editedData[editedKey];
                                
                                // Format ค่าที่แก้ไขแล้วให้เป็นทศนิยม 2 ตำแหน่ง
                                if (field === 'cashBeforeOt' || field === 'cashWork' || field === 'cashOt') {
                                  displayValue = parseFloat(displayValue || 0).toFixed(2);
                                } else if (field === 'beforeTotalOtTime' || field === 'totalTime' || field === 'totalOtTime') {
                                  displayValue = parseFloat(displayValue || 0).toFixed(2);
                                }
                              } else if (!isEditing) {
                                // เฉพาะเมื่อไม่มีการแก้ไขและไม่ได้อยู่ในโหมดแก้ไข ถึงจะคำนวณใหม่
                                
                                // Format time fields to 2 decimal places
                                if (field === 'beforeTotalOtTime' || field === 'totalTime' || field === 'totalOtTime') {
                                  displayValue = parseFloat(displayValue || 0).toFixed(2);
                                }
                                
                                // Format cash fields to 2 decimal places และคำนวณสำหรับพนักงานเงินเดือน
                                if (field === 'cashBeforeOt' || field === 'cashWork' || field === 'cashOt') {
                                  // เช็คกะพิเศษก่อน
                                  if (field === 'cashWork' && matchedRecord.shift === 'cash_holiday') {
                                    // ถ้าเป็นกะพิเศษ ให้ใช้ specialtSalary
                                    displayValue = parseFloat(matchedRecord.cashOfHoliday || 0).toFixed(2);
                                  } else if (field === 'cashOt' && matchedRecord.shift === 'cash_holiday') {
                                    // ถ้าเป็นกะพิเศษ ให้ใช้ specialtSalaryOT
                                    displayValue = parseFloat(matchedRecord.cashOfHolidayOt || 0).toFixed(2);
                                  } else if (isMonthlyEmployee && employeeSalary > 1680) {
                                    if (field === 'cashWork') {
                                      // สำหรับพนักงานเงินเดือน แสดง salary/30
                                      displayValue = (employeeSalary / 30).toFixed(2);
                                    } else if (field === 'cashBeforeOt') {
                                      // คำนวณ cashBeforeOt สำหรับพนักงานเงินเดือน
                                      const workRate = employeeSalary; // ใช้ salary จาก API employee/search
                                      // ตรวจสอบประเภทพนักงาน: ถ้าเงินเดือน > 1680 = พนักงานเงินเดือน, ถ้าไม่ = พนักงานรายวัน
                                      const dayPerHour = employeeSalary > 1680 ? (workRate / 30) / 8 : workRate / 8;
                                      const beforeTotalOtTime = parseFloat(matchedRecord.beforeTotalOtTime) || 0;
                                      
                                      // ตรวจสอบประเภทวันหยุดหรือการทำงานล่วงเวลา
                                      let otRate = 1.5; // ค่าเริ่มต้น 1.5 เท่า
                                      
                                      if (matchedRecord.isPublicHoliday) {
                                        otRate = 2; // วันหยุดนักขัตฤกษ์ 2 เท่า
                                      } else if (matchedRecord.isSpecialHoliday) {
                                        otRate = 3; // วันหยุดพิเศษ 3 เท่า
                                      }
                                      
                                      const dayPerHourOt = dayPerHour * otRate;
                                      displayValue = (dayPerHourOt * beforeTotalOtTime).toFixed(2);
                                    } else if (field === 'cashOt') {
                                      // คำนวณ cashOt สำหรับพนักงานเงินเดือน
                                      const workRate = employeeSalary; // ใช้ salary จาก API employee/search
                                      // ตรวจสอบประเภทพนักงาน: ถ้าเงินเดือน > 1680 = พนักงานเงินเดือน, ถ้าไม่ = พนักงานรายวัน
                                      const dayPerHour = employeeSalary > 1680 ? (workRate / 30) / 8 : workRate / 8;
                                      const totalOtTime = parseFloat(matchedRecord.totalOtTime) || 0;
                                      
                                      // ตรวจสอบประเภทวันหยุดหรือการทำงานล่วงเวลา
                                      let otRate = 1.5; // ค่าเริ่มต้น 1.5 เท่า
                                      
                                      if (matchedRecord.isPublicHoliday) {
                                        otRate = 2; // วันหยุดนักขัตฤกษ์ 2 เท่า
                                      } else if (matchedRecord.isSpecialHoliday) {
                                        otRate = 3; // วันหยุดพิเศษ 3 เท่า
                                      }
                                      
                                      const dayPerHourOt = dayPerHour * otRate;
                                      displayValue = (dayPerHourOt * totalOtTime).toFixed(2);
                                    }
                                  } else {
                                    // สำหรับพนักงานรายวัน ใช้ค่าเดิม
                                    displayValue = parseFloat(displayValue || 0).toFixed(2);
                                  }
                                }
                              }
                              
                              return (
                                <th className="fw-normal" key={field}>
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="form-control " 
                                      style={{ width: "6rem", margin: "0 auto" }} 
            
                                      value={
                                        editedData[`${index}-${subIndex}-${idx}_${field}_table`] ??
                                        displayValue
                                      }
                                      onChange={(e) => handleInputChange(e, field, index, subIndex, idx)}
                                    />
                                  ) : (
                                    <span style={{ cursor: "pointer" }} title="กดปุ่มแก้ไขเพื่อแก้ไขค่านี้">
                                      {displayValue}
                                    </span>
                                  )}
                                </th>
                              );
                            }
                          )}

                          {/* เงินเพิ่ม (Show sum or detailed list) */}
                          {/* ช่องนี้แสดงรายการเงินเพิ่มรายวัน สามารถแก้ไขเพิ่ม/ลบรายการได้ */}
                          {/* <th className="fw-normal">
                          {matchedRecord.shift === 'cash_holiday' ? (
                            <span>รวมแล้ว</span>
                          ) : (
                            isEditing ? (
                              <div>
                                <p>รายการเงินเพิ่ม</p>
                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                  {(editedData[`${index}-${subIndex}-${idx}_addSalaryDaily_table`] || []).map((addSalaryDay, salaryIndex) => (
                                    <li key={salaryIndex} style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          style={{ width: "120px", fontSize: "12px" }}
                                          value={addSalaryDay.name || ""}
                                          onChange={(e) => handleAddSalaryInputChange(index, subIndex, idx, salaryIndex, 'name', e.target.value)}
                                          placeholder="ชื่อรายการ"
                                        />
                                        <input
                                          type="number"
                                          step="0.01"
                                          className="form-control form-control-sm"
                                          style={{ width: "80px", fontSize: "12px" }}
                                          value={addSalaryDay.SpSalary || ""}
                                          onChange={(e) => handleAddSalaryInputChange(index, subIndex, idx, salaryIndex, 'SpSalary', e.target.value)}
                                          placeholder="จำนวน"
                                        />
                                        <span style={{ fontSize: "12px" }}>บาท</span>
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          style={{ padding: "2px 6px", fontSize: "10px" }}
                                          onClick={() => handleDeleteSalary(index, subIndex, idx, salaryIndex)}
                                        >
                                          <i className="bi bi-trash3"></i>
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm mt-2"
                                  style={{ padding: "2px 8px", fontSize: "11px" }}
                                  onClick={() => handleAddSalaryItem(index, subIndex, idx)}
                                >
                                  + เพิ่มรายการ
                                </button>
                              </div>
                            ) : (
                              (() => {
                                // Check if there's edited data for addSalaryDaily
                                const editedKey = `${index}-${subIndex}-${idx}_addSalaryDaily_table`;
                                const salaryData = editedData[editedKey] || matchedRecord.addSalaryDaily || [];
                                
                                // Calculate sum using the most current data (edited or original)
                                const totalSum = salaryData.reduce(
                                  (sum, salary) => sum + parseFloat(salary.SpSalary || 0),
                                  0
                                );
                                
                                // If no items, show only the total
                                if (salaryData.length === 0) {
                                  return totalSum.toFixed(2) + " บาท";
                                }
                                
                                // Show detailed list with subtotal
                                return (
                                  <div style={{ textAlign: 'left', fontSize: '12px' }}>
                                    {salaryData.map((item, i) => (
                                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                        <span>{item.name || 'ไม่ระบุชื่อ'}</span>
                                        <span>{parseFloat(item.SpSalary || 0).toFixed(2)} บาท</span>
                                      </div>
                                    ))}
                                    <div style={{ 
                                      borderTop: '1px solid #ddd', 
                                      marginTop: '4px', 
                                      paddingTop: '4px', 
                                      fontWeight: 'bold',
                                      display: 'flex',
                                      justifyContent: 'space-between'
                                    }}>
                                      <span>รวม:</span>
                                      <span>{totalSum.toFixed(2)} บาท</span>
                                    </div>
                                  </div>
                                );
                              })()
                            )
                          )}
                          </th> */}

                          {/* แก้ไข / บันทึก */}
                          {/* ปุ่มสำหรับเข้าสู่โหมดแก้ไข (ดินสอ) หรือบันทึกการแก้ไข (✅) */}
                          {/* <th className="fw-normal">
                            {isEditing ? (
                              <>
                                <button className="btn btn-success btn-sm"  style={{ padding: "0.3rem", width: "3rem" }} onClick={() => handleSave(index, subIndex, idx)}>
                                  ✅
                                </button>
                              
                              </>
                            ) : (
                              
                              <button
                                className="btn btn-warning btn-sm"
                                style={{ padding: "0.3rem", width: "3rem" }}
                                onClick={() => {
                                  setEditingIndex(`${index}-${subIndex}-${idx}`);
                                  setEditedData((prev) => ({
                                    ...prev,
                                    [`${index}-${subIndex}-${idx}_beforeTotalOtTime_table`]: matchedRecord.beforeTotalOtTime,
                                    [`${index}-${subIndex}-${idx}_cashBeforeOt_table`]: matchedRecord.cashBeforeOt,
                                    [`${index}-${subIndex}-${idx}_totalTime_table`]: matchedRecord.totalTime,
                                    [`${index}-${subIndex}-${idx}_cashWork_table`]: matchedRecord.cashWork,
                                    [`${index}-${subIndex}-${idx}_totalOtTime_table`]: matchedRecord.totalOtTime,
                                    [`${index}-${subIndex}-${idx}_cashOt_table`]: matchedRecord.cashOt,
                                    [`${index}-${subIndex}-${idx}_addSalaryDaily_table`]: matchedRecord.addSalaryDaily,
                                  }));
                                }}
                              >
                               <i className="bi bi-pencil-square"></i>
                              </button>
                            )}
                          </th> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr key={`${index}-${subIndex}-no-record`}>
                      <th className="fw-normal">{day}</th>
                      
                  
                      <th className="fw-normal">
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: "4rem", margin: "0 auto" }}
                          placeholder="รหัส"
                          value={editedData[`${index}-${subIndex}-no-record_workplaceId_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_workplaceId_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      <th className="fw-normal">
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="ชื่อ"
                          value={editedData[`${index}-${subIndex}-no-record_workplaceName_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_workplaceName_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      <th className="fw-normal">
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: "4rem", margin: "0 auto" }}
                          placeholder="กลุ่ม"
                          value={editedData[`${index}-${subIndex}-no-record_wGroup_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_wGroup_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      <th className="fw-normal">
                        <select
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          value={editedData[`${index}-${subIndex}-no-record_shift_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_shift_table`]: e.target.value
                          }))}
                        >
                          <option value="">เลือกกะ</option>
                          <option value="morning_shift">กะเช้า</option>
                          <option value="afternoon_shift">กะบ่าย</option>
                          <option value="night_shift">กะดึก</option>
                          <option value="special_shift">กะพิเศษ</option>
                        </select>
                      </th>
                      
                      {/* OT ก่อน */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_beforeTotalOtTime_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_beforeTotalOtTime_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* ค่าจ้าง OT ก่อน */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_cashBeforeOt_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_cashBeforeOt_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* เวลาทำงาน */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_totalTime_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_totalTime_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* ค่าจ้างทำงาน */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_cashWork_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_cashWork_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* OT หลัง */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_totalOtTime_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_totalOtTime_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* ค่าจ้าง OT หลัง */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_cashOt_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_cashOt_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      {/* เงินเพิ่ม */}
                      <th className="fw-normal">
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          style={{ width: "6rem", margin: "0 auto" }}
                          placeholder="0.00"
                          value={editedData[`${index}-${subIndex}-no-record_addSalaryDaily_table`] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [`${index}-${subIndex}-no-record_addSalaryDaily_table`]: e.target.value
                          }))}
                        />
                      </th>
                      
                      <th className="fw-normal">
                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: "0.3rem", width: "3rem" }}
                          onClick={() => {
                            // สร้างข้อมูลใหม่สำหรับวันที่ไม่มีข้อมูล
                            const newRecord = {
                              date: day,
                              workplaceId: editedData[`${index}-${subIndex}-no-record_workplaceId_table`] || "",
                              workplaceName: editedData[`${index}-${subIndex}-no-record_workplaceName_table`] || "",
                              wGroup: editedData[`${index}-${subIndex}-no-record_wGroup_table`] || "",
                              shift: editedData[`${index}-${subIndex}-no-record_shift_table`] || "",
                              beforeTotalOtTime: editedData[`${index}-${subIndex}-no-record_beforeTotalOtTime_table`] || "0",
                              cashBeforeOt: editedData[`${index}-${subIndex}-no-record_cashBeforeOt_table`] || "0",
                              totalTime: editedData[`${index}-${subIndex}-no-record_totalTime_table`] || "0",
                              cashWork: editedData[`${index}-${subIndex}-no-record_cashWork_table`] || "0",
                              totalOtTime: editedData[`${index}-${subIndex}-no-record_totalOtTime_table`] || "0",
                              cashOt: editedData[`${index}-${subIndex}-no-record_cashOt_table`] || "0",
                              addSalaryDaily: []
                            };
                            
                            // เพิ่มข้อมูลใหม่เข้าไปใน concludeResultx
                            setConcludeResultx(prevData => {
                              const updatedData = JSON.parse(JSON.stringify(prevData));
                              if (updatedData[index]) {
                                updatedData[index].employee_record.push(newRecord);
                              }
                              return updatedData;
                            });
                            
                            // ล้างข้อมูลในฟอร์ม
                            setEditedData(prev => {
                              const newData = { ...prev };
                              Object.keys(newData).forEach(key => {
                                if (key.includes(`${index}-${subIndex}-no-record`)) {
                                  delete newData[key];
                                }
                              });
                              return newData;
                            });
                            
                            setEditStatus("update");
                          }}
                        >
                          ✅
                        </button>
                      </th>
                    </tr>
                  );
                })}
              </>
            ))}

<tr>
<th colSpan={3} style={{ textAlign: "center", verticalAlign: "middle" }}> รวม </th>


<th style={{ textAlign: "center", verticalAlign: "middle" }}></th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}></th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.beforeTotalOtTime || 0).toFixed(2))} ชั่วโมง</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.cashBeforeOt || 0).toFixed(2))} บาท</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.totalTime || 0).toFixed(2))} ชั่วโมง</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.cashWork || 0).toFixed(2))} บาท</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.totalOtTime || 0).toFixed(2))} ชั่วโมง</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.cashOt || 0).toFixed(2))} บาท</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}>{(parseFloat(dataTotals.addSalaryTotal || 0).toFixed(2))} บาท</th>
<th style={{ textAlign: "center", verticalAlign: "middle" }}></th>

</tr>

          </tbody>
        </table>
      </div>
    </div>

)}

                <br />

                
                <div className="line_btn">
                {! loading && 
                  <button
                    type="button"
                    onClick={saveconclude}
                    className="btn b_save"
                  >
                    <i className="nav-icon fas fa-save"></i> &nbsp;บันทึก
                  </button>
}

                  <Link to="/Salaryresult">
                    <button type="button" className="btn clean">
                      <i>&gt;</i> &nbsp;ถัดไป
                    </button>
                  </Link>
                </div>
                {/* {JSON.stringify(employee.addSalary,null,2)} */}
              </section>
            </div>
          </section>
        </div>
      </div>
      {/* {JSON.stringify( dataTable[30])}{dataTable.length} */}
    {/* </body> */}
</div>
    // </div>  )
  );
}
export default Compensation;
 