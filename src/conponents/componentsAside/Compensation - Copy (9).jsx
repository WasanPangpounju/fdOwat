import endpoint from "../../config";
import { Link } from "react-router-dom";

import axios from "axios";
import React, { useEffect, useState } from "react";

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

        const event = await new Event("submit"); // Creating a synthetic event object
        await handleSearch(event); // Call handleSearch with the event

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

  console.error("workplaceList", workplaceList);

  console.log(employeeList);

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
  const firstPart = Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, index) =>
      startDay +
      index +
      "/" +
      countdownMonth +
      "/" +
      (parseInt(countdownYear, 10) + parseInt(base, 10))
  );

  // Create an array from 1 to 20
  const secondPart = Array.from(
    { length: 20 },
    (_, index) =>
      index +
      1 +
      "/" +
      CheckMonth +
      "/" +
      (parseInt(CheckYear, 10) + parseInt(base, 10))
  );

  // Concatenate the two arrays
  const resultArray = [...firstPart, ...secondPart];

  const firstPart2 = Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, index) => startDay + index
  );

  // Create an array from 1 to 20
  const secondPart2 = Array.from({ length: 20 }, (_, index) => index + 1);

  // Concatenate the two arrays
  const resultArray2 = [...firstPart2, ...secondPart2];
  console.log("resultArray2", resultArray2);
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
    const serchConclude = await {
      year: year,
      month: month,
      concludeDate: "",
      employeeId: searchEmployeeId,
      employeeName: searchEmployeeName,
    };
    // alert(serchConclude .month)
    try {
      //create conclude
      const response = await axios.post(
        endpoint + "/conclude/autocreate",
        serchConclude
      );
      // alert(response .data);
      alert("กำลังประมวลผล กรุณาค้นหาอีกครั้งหากยังไม่พบกรุณาตรวจสอบการลงเวลา");
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }

  async function handleSearch(event) {
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

  useEffect(() => {
    setDataTable(concludeResult);
    setAddSalaryList(addSalaryResult || []);
    // alert(JSON.stringify(addSalaryResult ,null,2));

    let ans = 0;
    let ans1 = 0;

    const s = concludeResult.map((item, index) => {
      if (!isNaN(item.workRate)) {
        ans = ans + parseFloat(item.workRate, 10) || 0;
        // ans1 = ans1 + parseFloat(item.workRateOT, 10) || 0;
        // setSumRateOT(ans1);
      }
      if (item.workRateOT && !isNaN(item.workRateOT) && item.workRateOT !== 0) {
        ans1 = ans1 + parseFloat(item.workRateOT, 10);
        setSumRateOT(ans1);
      }
      return ans;
    });
    //ccss
    setSumRate(ans);
    // setSumRateOT(ans1);
    // alert(sumRateOT);
  }, [concludeResult]);
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

  useEffect(() => {
    // alert(employee?.addSalary?.length );

    const getAddSalaryDay = async () => {
      await setAddSalaryDay(0);
      await setAddSalaryDayList([]);

      if (employee?.addSalary?.length > 0) {
        let tmpAddSalaryList = [];

        const sum = await employee.addSalary.reduce(
          async (accumulator, item) => {
            if (item.roundOfSalary === "daily") {
              await tmpAddSalaryList.push(item);
              if (parseFloat(item.SpSalary) < 100) {
                return (await accumulator) + parseFloat(item.SpSalary, 10);
              } else {
                let r = (await accumulator) + parseFloat(item.SpSalary, 10);
                r = (await r) / 30;
                return await r;
              }
            } else {
              return accumulator;
            }
          },
          0
        );
        await setAddSalaryDayList(tmpAddSalaryList);

        await setAddSalaryDay(sum);

        // Create addSalaryList array
        const addSalaryList = Array(dataTable.length).fill(tmpAddSalaryList);

        // Update state with the created addSalaryList
        if (loadStatus !== "load") {
          setAddSalaryList(addSalaryList);
        }
      }
    };

    if (addSalaryList != []) {
      getAddSalaryDay();
    }

    if (employee) {
      setWorkplaceIdEMP(employee.workplace ? employee.workplace : "");
    }
  }, [employee]);

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

  const allwork = [...alldayworkLower, ...alldaywork];

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
  const allworkFlattened = allwork.flat();

  // Filter unique entries based on 'workplaceId' and 'dates'
  const uniqueEntries = allworkFlattened.reduce((acc, curr) => {
    const key = `${curr.workplaceId}-${curr.dates}`;
    if (!acc[key]) {
      acc[key] = curr;
    }
    return acc;
  }, {});

  // Extract values from the object to get the final array
  const resultAllwork = Object.values(uniqueEntries);

  const resultArrayWithWorkplaceRecords = resultArray2.map((date) => {
    const matchingRecord = resultAllwork.find((record) => record.dates == date);
    return matchingRecord ? { ...matchingRecord } : "";
  });

  console.log(
    "resultArrayWithWorkplaceRecords",
    resultArrayWithWorkplaceRecords
  );

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

  // const monthTest = "09"; // Assuming "09" represents September
  const commonNumbers123 = new Set();

  if (workplace) {
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
  } else {
    console.error("Workplace not found");
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
  } else {
    console.error("Workplace not found");
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
      console.log("No stop workTimeDay found.");
    }
  } else {
    console.log("Workplace not found.");
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
  const [loadStatus, setLoadStatus] = useState(null);

  const handleInputChange = (e) => {
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

  const calculatedArray = resultArrayWithWorkplaceRecords.map((record) => {
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

  useEffect(() => {
    let ans = 0;
    let ans1 = 0;
    let ans2 = 0;

    const updatedDataTable = calculatedArray.map((item, index) => {
      let addSalaryDay1 = "";
      if (item !== "") {
        // if (addSalaryDay < 100) {
        addSalaryDay1 = addSalaryDay;
        // } else {
        // addSalaryDay1 = (addSalaryDay / 30).toFixed(2);
        // }
      }
      // commonNumbersArray

      // const workRateOT2 = !isNaN(item.workRate) && !isNaN(item.workOfHour) && !isNaN(item.workRateOT) ?
      //     `${(((item.workRate / item.workOfHour) * item.workRateOT) * item.otTimes).toFixed(2)} (${item.workRateOT})` : '';

      let workRateOT2 = "";
      if (item.shift == "specialt_shift" && item.cashSalary == "") {
        // Apply special shift logic if needed
        // workRateOT2 = !isNaN(item.workRate) && !isNaN(item.workOfHour) && !isNaN(item.workRateOT) ?
        //     `${item.specialtSalaryOT.toFixed(2)} (${item.workRateOT})` : '';
        workRateOT2 =
          !isNaN(item.specialtSalaryOT) && !isNaN(item.workRateOT)
            ? `${parseFloat(item.specialtSalaryOT).toFixed(2)}`
            : "";
      } else {
        // Apply regular shift logic
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

      // const workRateOT2 = !isNaN(item.workRate) && !isNaN(item.workOfHour) && !isNaN(item.workRateOT) ?
      //     `${(((item.workRate / item.workOfHour) * item.workRateOT) * item.otTimes).toFixed(2)} (${item.workRateOT})` :
      //     ''; // If any of the values are not numbers, workRateOT will be an empty string

      const hasCalculatedValues =
        typeof item === "object" && "calculatedValue" in item;
      const hasCalculatedValuesOT =
        typeof item === "object" && "calculatedValueOT" in item;

      // if (item.cashSalary == '' && item.shift == 'specialt_shift') {

      // }
      // Update workRate and workRateOT based on the presence of calculated values
      // const workRate = hasCalculatedValues ? item.calculatedValue : item.workRate;
      let workRate = "";
      if (item.shift == "specialt_shift" && item.cashSalary == "") {
        // Apply special shift logic if needed
        workRate = item.specialtSalary;
      } else {
        workRate = hasCalculatedValues ? item.calculatedValue : item.workRate;
      }
      let workRateOT = "";

      if (commonNumbers123.has(parseInt(item.dates, 10))) {
        // Check if commonNumbers123 contains the date from item holidayOT
        workRateOT = hasCalculatedValuesOT
          ? item.calculatedValueOT + " (" + item.holidayOT + ")"
          : workRateOT2;
      } else {
        workRateOT = hasCalculatedValuesOT
          ? item.calculatedValueOT + " (" + item.dayoffRateOT + ")"
          : workRateOT2;
      }
      // const workRateOT = hasCalculatedValuesOT ? item.calculatedValueOT + ' ' + '(' + item.dayoffRateOT + ')' : workRateOT2;

      const tmp = {
        day: resultArray[index],
        workplaceId: item.workplaceId,
        allTimes: item.allTimes,
        // workRate: item.workRate,
        workRate: workRate,
        otTimes: item.otTimes,
        workRateOT: workRateOT,
        // workRateOT: item.workRateOT,
        addSalaryDay: addSalaryDay1,
      };
      // console.log('tmp',tmp);
      if (!isNaN(item.workRate)) {
        ans = ans + parseFloat(workRate);
        // parseFloat(item.workRate, 10);
        ans1 = ans1 + parseFloat(workRateOT, 10);
        ans2 = ans2 + parseFloat(addSalaryDay1, 10);
      }

      return tmp;
    });

    if (loadStatus == null) {
      setSumRate(ans);
      setSumRateOT(ans1);
      setSumAddSalary(ans2);
      setDataTable(updatedDataTable);
    }

    console.log("updatedDataTable", updatedDataTable);
    console.log("sumAddSalary", sumAddSalary);

    //ccaa
  }, [resultArrayWithWorkplaceRecords]);

  // console.log("sumRate", sumRate);
  console.log("dataTable", dataTable);

  const extractDayNumber = (dateString) => {
    const [day] = dateString.split("/");
    return parseInt(day, 10);
  };

  const resultArray22 = dataTable.map((entry) => extractDayNumber(entry.day));

  console.log("resultArray22", resultArray22);

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
      concludeRecord: dataTable,
      addSalary: addSalaryList,
      createBy: jsonObject.name,
      sumWorkHour: sumWorkHourX,
      sumWorkRate: sumWorkRateX,
      sumWorkHourOt: sumWorkHourOtX,
      sumWorkRateOt: sumWorkRateOtX,
    };

    //ccc
    if (update == null && editStatus == "") {
      //create new conclude record
      try {
        const response = await axios.post(endpoint + "/conclude/create", data);

        if (response) {
          alert("บันทึกสำเร็จ");
        }
      } catch (e) {
        alert("บันทึกไม่สำเร็จ");
        alert(e);
      }
    } else {
      try {
        const response = await axios.put(
          endpoint + "/conclude/update/" + update,
          data
        );
        if (response) {
          alert("บันทึกสำเร็จ");
          window.location.reload();
        }
      } catch (error) {
        alert("กรุณาตรวจสอบข้อมูลในช่องกรอกข้อมูล");
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

  return (
    // <div>
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
            <li class="breadcrumb-item active">ตารางค่าตอบแทน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ตารางค่าตอบแทน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">ตารางค่าตอบแทน</h2>
              <section class="Frame">
                <div class="col-md-12">
                  <form onSubmit={handleSearch}>
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

                    <div class="row">
                      <div class="col-md-6">
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
                      <div class="col-md-6">
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
              <section class="Frame">
                {staffFullName ? (
                  <div class="row">
                    <div class="col-md-12">ชื่อ: {staffFullName}</div>
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

                <div class="row">
                  <div class="col-md-2">
                    ตั้งแต่วันที่ 21 {thaiMonthLowerName} - 20 {thaiMonthName}{" "}
                    ปี {parseInt(year, 10) + 543}
                  </div>
                  <div class="col-md-8"></div>
                  <div class="col-md-2">
                    <div class="d-flex justify-content-center">
                      <button type="button" onClick={recal} class="btn b_save">
                        {" "}
                        คำนวณใหม่
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <table border="1" style={tableStyle}>
                        <thead>
                          <tr>
                            <th style={headerCellStyle}>วันที่</th>
                            <th style={headerCellStyle}>หน่วยงาน</th>
                            <th style={headerCellStyle}>กะ</th>
                            <th style={headerCellStyle}>ชั่วโมงทำงาน</th>
                            <th style={headerCellStyle}>ค่าจ้างปกติ</th>
                            <th style={headerCellStyle}>ชั่วโมง OT</th>
                            <th style={headerCellStyle}>ค่าล่วงเวลา OT</th>
                            <th style={headerCellStyle}>เงินเพิ่ม</th>
                            <th style={headerCellStyle}>แก้/ลบ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataTable.map((workplaceRecord, index) => (
                            <tr key={index}>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData.day}
                                    onChange={handleInputChange}
                                    name="day"
                                    readOnly
                                  />
                                ) : (
                                  workplaceRecord.day
                                )}
                              </td>
                              {/* <td style={commonNumbers.has(resultArray2[index]) ? { ...cellStyle, backgroundColor: 'yellow' } : cellStyle}>
                                                                {editIndex === index ?
                                                                    <input type="text" className="form-control" value={formData.day} onChange={handleInputChange} name="day" readOnly /> :
                                                                    workplaceRecord.shift}
                                                            </td> */}
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData.workplaceId}
                                    onChange={handleInputChange}
                                    name="workplaceId"
                                    readOnly
                                  />
                                ) : (
                                  workplaceRecord.workplaceId
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData.shift}
                                    onChange={handleInputChange}
                                    name="shift"
                                  />
                                ) : (
                                  // workplaceRecord.shift
                                  shiftMapping[workplaceRecord.shift] ||
                                  workplaceRecord.shift
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData.allTimes}
                                    onChange={handleInputChange}
                                    name="allTimes"
                                  />
                                ) : (
                                  workplaceRecord.allTimes
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formData.workRate}
                                      onChange={handleInputChange}
                                      name="workRate"
                                    />
                                    <input
                                      type="hidden"
                                      className="form-control"
                                      value={formData.workRateMultiply}
                                      onChange={handleInputChange}
                                      name="workRateMultiply"
                                    />
                                    <input
                                      type="hidden"
                                      className="form-control"
                                      value={formData.shift}
                                      onChange={handleInputChange}
                                      name="shift"
                                    />
                                    <input
                                      type="hidden"
                                      className="form-control"
                                      value={formData.workType}
                                      onChange={handleInputChange}
                                      name="workType"
                                    />
                                  </>
                                ) : (
                                  workplaceRecord.workRate
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData.otTimes}
                                    onChange={handleInputChange}
                                    name="otTimes"
                                  />
                                ) : (
                                  workplaceRecord.otTimes
                                )}
                              </td>

                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={formData.workRateOT}
                                      onChange={handleInputChange}
                                      name="workRateOT"
                                    />
                                    <input
                                      type="hidden"
                                      className="form-control"
                                      value={formData.workRateOTMultiply}
                                      onChange={handleInputChange}
                                      name="workRateOTMultiply"
                                    />{" "}
                                  </>
                                ) : (
                                  workplaceRecord.workRateOT
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {editIndex === index ? (
                                  <div className="popup">
                                    <h4>รายการเงินเพิ่ม</h4>
                                    <ul
                                      style={{
                                        listStyleType: "none",
                                        padding: 0,
                                        margin: 0,
                                      }}
                                    >
                                      {addSalaryList[index] &&
                                        addSalaryList[index].map(
                                          (addsalary, index1) =>
                                            addsalary.name !== "" && (
                                              <li
                                                key={index1}
                                                style={{ marginBottom: "10px" }}
                                              >
                                                {addsalary.name} - จำนวน:{" "}
                                                {addsalary.SpSalary > 100
                                                  ? (
                                                      addsalary.SpSalary / 30
                                                    ).toFixed(2)
                                                  : addsalary.SpSalary}{" "}
                                                {addsalary.roundOfSalary ==
                                                  "daily" && (
                                                  <>/ {addsalary.message} วัน</>
                                                )}
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleRemoveAddSalaryArray(
                                                      index,
                                                      index1
                                                    )
                                                  }
                                                >
                                                  ลบ
                                                </button>
                                              </li>
                                            )
                                        )}
                                    </ul>
                                  </div>
                                ) : // workplaceRecord.addSalaryDay
                                addSalaryList[index] &&
                                  addSalaryList[index].length > 0 &&
                                  workplaceRecord.workplaceId !== "" &&
                                  workplaceRecord.workplaceId !== undefined ? (
                                  addSalaryList[index].reduce(
                                    (acc, addsalary) => {
                                      if (
                                        addsalary.name !== "" &&
                                        addsalary.roundOfSalary === "daily"
                                      ) {
                                        if (addsalary.SpSalary > 100) {
                                          acc += parseFloat(
                                            (addsalary.SpSalary / 30).toFixed(2)
                                          );
                                        } else {
                                          acc += parseFloat(addsalary.SpSalary);
                                        }
                                      }
                                      return acc;
                                    },
                                    0
                                  )
                                ) : (
                                  0
                                )}
                              </td>
                              <td
                                style={
                                  commonNumbers.has(resultArray22[index])
                                    ? {
                                        ...cellStyle,
                                        backgroundColor: "yellow",
                                      }
                                    : cellStyle
                                }
                              >
                                {/* <a href="https://example.com" class="link1" style={{ color: 'red' }}><b>ลบ</b></a> / <a href="#" class="link2" style={{ color: 'blue' }} onClick={openModal}><b>แก้ไข</b></a> */}

                                {editIndex === index ? (
                                  <button
                                    class="btn btn-info"
                                    style={{ width: "4rem" }}
                                    onClick={saveFormData}
                                  >
                                    Save
                                  </button>
                                ) : (
                                  // <button class="btn btn-danger" style={{ width: '3rem' }} onClick={() => editData(index)}>แก้ไข</button>
                                  <button
                                    class="btn btn-danger"
                                    style={{
                                      width: "4rem",
                                      textAlign: "center",
                                    }}
                                    onClick={() => editData(index)}
                                  >
                                    แก้ไข
                                  </button>
                                )}

                                <Modal
                                  isOpen={modalIsOpen}
                                  onRequestClose={closeModal}
                                  contentLabel="Example Modal"
                                  style={{
                                    overlay: {
                                      backgroundColor:
                                        "rgba(100, 100, 100, 0.5)",
                                      zIndex: 10,
                                    },
                                    content: {
                                      width: "50rem",
                                      margin: "auto",
                                      borderRadius: "8px",
                                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                                    },
                                  }}
                                >
                                  {/* Your form content goes here */}
                                  <form>
                                    {/* <label>
                                      Form Input:
                                      <input type="text" />
                                    </label>
                                    <button type="submit">Submit</button> */}
                                    {workTimeDayPerson.allTimesPerson.map(
                                      (time, index) => (
                                        <div key={index} className="row">
                                          <div className="col-md-3">
                                            <select
                                              name="CodeSalary"
                                              className="form-control"
                                              value={time.CodeSalary}
                                              onChange={(e) =>
                                                handleInputChangePerson(
                                                  e,
                                                  index
                                                )
                                              }
                                            >
                                              <option value="">
                                                เลือกตำแหน่ง
                                              </option>

                                              {positionWork.map(
                                                (position, positionIndex) => (
                                                  <option
                                                    key={positionIndex}
                                                    value={position}
                                                  >
                                                    {position}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>

                                          <div className="col-md-3">
                                            <select
                                              name="positionWork"
                                              className="form-control"
                                              value={time.positionWork}
                                              onChange={(e) =>
                                                handleInputChangePerson(
                                                  e,
                                                  index
                                                )
                                              }
                                            >
                                              <option value="">
                                                เลือกตำแหน่ง
                                              </option>

                                              {positionWork.map(
                                                (position, positionIndex) => (
                                                  <option
                                                    key={positionIndex}
                                                    value={position}
                                                  >
                                                    {position}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                          <div className="col-md-3">
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
                                              placeholder={`Person ${
                                                index + 1
                                              }`}
                                              name="countPerson" // Make sure the name attribute is set to "countPerson"
                                              value={time.countPerson}
                                              onChange={(e) =>
                                                handleInputChangePerson(
                                                  e,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                          <div class="col-md-2">
                                            {index >= 1 ? (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveTimePerson(index)
                                                }
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
                                      )
                                    )}
                                    <button
                                      type="button"
                                      class="btn btn-secondary"
                                      style={{ width: "3rem" }}
                                      onClick={closeModal}
                                    >
                                      Close
                                    </button>
                                  </form>
                                </Modal>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td style={cellStyle}>สรุป</td>
                            <td></td>
                            <td></td>
                            <td style={cellStyle}>
                              {statusEditSum ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={sumWorkHourX}
                                  onChange={handleChangeSumWorkHourX}
                                  name=""
                                />
                              ) : (
                                Number(sumWorkHourX).toFixed(2) || 0
                              )}
                            </td>
                            <td style={cellStyle}>
                              {statusEditSum ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={sumWorkRateX}
                                  onChange={handleChangeSumWorkRateX}
                                  name=""
                                />
                              ) : (
                                Number(sumWorkRateX).toFixed(2) || 0
                              )}
                            </td>
                            <td style={cellStyle}>
                              {statusEditSum ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={sumWorkHourOtX}
                                  onChange={handleChangeSumWorkHourOtX}
                                  name=""
                                />
                              ) : (
                                Number(sumWorkHourOtX).toFixed(2) || 0
                              )}
                            </td>
                            <td style={cellStyle}>
                              {statusEditSum ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={sumWorkRateOtX}
                                  onChange={handleChangeSumWorkRateOtX}
                                  name=""
                                />
                              ) : (
                                Number(sumWorkRateOtX).toFixed(2) || 0
                              )}
                            </td>
                            <td style={cellStyle}>
                              {/* {sumAddSalary} */}
                              {calculateTotalSalary().toFixed(2)}
                            </td>
                            <td style={cellStyle}>
                              {statusEditSum ? (
                                <button
                                  class="btn btn-info"
                                  style={{ width: "4rem", textAlign: "center" }}
                                  onClick={handleClickEditSum}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  class="btn btn-danger"
                                  style={{ width: "4rem", textAlign: "center" }}
                                  onClick={handleClickEditSum}
                                >
                                  แก้ไข
                                </button>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <br />
                    </div>
                  </div>
                </div>

                <div class="line_btn">
                  <button
                    type="button"
                    onClick={saveconclude}
                    class="btn b_save"
                  >
                    <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                  </button>

                  <Link to="/Salaryresult">
                    <button type="button" class="btn clean">
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
    </body>
    // </div>  )
  );
}
export default Compensation;
