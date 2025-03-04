import endpoint from "../../config";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "../editwindowcss.css";
// import TestPDF from './TestPDF';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";
import { useTable } from "react-table";

import th from "date-fns/locale/th"; // Import Thai locale data from date-fns
import en from "date-fns/locale/en-US";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function WorktimeSheetWorkplace({ employeeList }) {

  const vertical1 = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const verticalText = {
    writingMode: "vertical-rl",
    textAlign: "center", // Adjust as needed
    whiteSpace: "nowrap", // Prevent text wrapping
  };
  const verticalTextHeader = {
    writingMode: "vertical-rl",
    textAlign: "center",
    whiteSpace: "nowrap",
    transform: "rotate(180deg)", // Rotate the text 180 degrees
  };

  useEffect(() => {
    document.title = "ตารางเวลาทำงานพนักงาน";
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);

  const styles = {
    th: {
      minWidth: "4rem",
    },
  };
  const [dataset, setDataset] = useState([]);
  const [workplaceIdEMP, setWorkplaceIdEMP] = useState(""); //รหัสหน่วยงาน

  const [workplaceList, setWorkplaceList] = useState([]);
  const [workplaceDataList, setWorkplaceDataList] = useState([]);
  const [workplaceDataListDayOff, setWorkplaceDataListDayOff] = useState([]);
  const [workplaceDataListAddSalary, setWorkplaceDataListAddSalary] = useState(
    []
  );
  const [workplaceDataWorkTime, setWorkplaceDataWorkTime] = useState([]);
  const [workplaceDataWorkOfHour, setWorkplaceDataWorkOfHour] = useState("");
  const [workplaceDataListWorkRate, setWorkplaceDataListWorkRate] = useState();
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  const [conclude, setConclude] = useState([]);

  const [responseDataAll, setResponseDataAll] = useState([]);
  const [leaveSalary, setLeaveSalary] = useState([]);

  const [WName, setWName] = useState("");

  const [workDate, setWorkDate] = useState(new Date());

  const [workRateWorkplace, setWorkRateWorkplace] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage1, setWorkRateWorkplaceStage1] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage2, setWorkRateWorkplaceStage2] = useState(0); //ค่าจ้างต่อวัน
  const [workRateWorkplaceStage3, setWorkRateWorkplaceStage3] = useState(0);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");


  // const handleWorkDateChange = (date) => {
  //     setWorkDate(date);
  // };

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
    const thaiYear = gregorianDate.getFullYear() + 543;
    return new Date(
      thaiYear,
      gregorianDate.getMonth(),
      gregorianDate.getDate()
    );
  };

  const ThaiBuddhistToGregorian = (thaiDate) => {
    const gregorianYear = thaiDate.getFullYear() - 543;
    return new Date(gregorianYear, thaiDate.getMonth(), thaiDate.getDate());
  };

  const initialThaiDate = new Date();
  initialThaiDate.setFullYear(initialThaiDate.getFullYear() + 543); // Add 543 years to the current year

  const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
  const [selectedGregorianDate, setSelectedGregorianDate] = useState(
    new Date()
  );

  const handleThaiDateChange = (date) => {
    setSelectedThaiDate(date);
    setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
    // setWorkDate(date);
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setWorkDate(newDate);
  };

  useEffect(() => {
    // Function to format a given date
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = (date.getFullYear() + 543).toString();
      return `${day}/${month}/${year}`;
    };

    if (selectedDate) {
      // Convert the selected date string to a Date object and format it
      const date = new Date(selectedDate);
      const formattedDate = formatDate(date);
      setFormattedDate(formattedDate);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setFormattedDate(formattedCurrentDate);
      setSelectedDate(currentDate); // Set the initial selected date to the current date
    }
  }, [selectedDate]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleGregorianDateChange = (date) => {
    setSelectedGregorianDate(date);
    setSelectedThaiDate(GregorianToThaiBuddhist(date));
  };

  const [daysOffArray, setDaysOffArray] = useState([]);
  const [result_data, setResult_data] = useState([]);
  const [timerecordAllList, setTimerecordAllList] = useState([]);
  const [emploeeData, setEmploeeData] = useState([]);
  const [emploeeDataSearch, setEmploeeDataSearch] = useState([]);

  const [arraytestEmpAddSalary, setArraytestEmpAddSalary] = useState([]);

  const [empIDlist, setEmpIDlist] = useState([]);

  const getThaiMonthName = (month) => {
    const thaiMonths = [
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

    // Ensure the month is a valid number between 1 and 12
    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return "Invalid Month";
    }

    return thaiMonths[monthNumber - 1];
  };
  const thaiToEnglishDayMap = {
    จันทร์: ["Mon"],
    อังคาร: ["Tue"],
    พุธ: ["Wed"],
    พฤหัส: ["Thu"],
    ศุกร์: ["Fri"],
    เสาร์: ["Sat"],
    อาทิตย์: ["Sun"],
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceList(data);
        setWorkplaceListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  // useEffect(() => {
  //     // Fetch data from the API when the component mounts
  //     fetch(endpoint + '/timerecord/listemp')
  //         .then(response => response.json())
  //         .then(data => {
  //             // Update the state with the fetched data
  //             setTimerecordAllList(data);
  //             // alert(data[0].workplaceName);
  //         })
  //         .catch(error => {
  //             console.error('Error fetching data:', error);
  //         });
  // }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/timerecord/listemp")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        if (Array.isArray(data) && data.length > 0) {
          setTimerecordAllList(data);
        } else {
          // If data is empty or not found, set state to an empty array
          setTimerecordAllList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/leave/list")
      .then((response) => response.json())
      .then((data) => {
        // Filter the data based on year, month, and employeeId array
        const filteredData = data.filter((item) =>
          item.year === year &&
          item.month === month &&
          responseDataAll.some((employee) => employee.employeeId === item.employeeId)
        );

        // Update the state with the filtered data
        setLeaveSalary(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [year, month, responseDataAll]);

  const [employeelist, setEmployeelist] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [listDayOff, setListDayOff] = useState([]);
  const [y, setY] = useState("");
  const [m, setM] = useState("");
  const [m1, setM1] = useState("");

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/employee/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setEmployeelist(data);
  //       // alert(data[0].workplaceName);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []); // The empty array [] ensures that the effect runs only once after the initial render

  useEffect(() => {
    const fetchData = () => {
      const dataTest = {
        timerecordId: "2024", // Specify the timerecordId here
        month: "03", // Specify the month here
      };
      axios
        .post(endpoint + "/timerecord/listemp", dataTest)
        .then((response) => {
          // Handle the response data here
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error fetching data:", error);
        });
    };

    fetchData(); // Call the fetchData function when component mounts or whenever needed
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    // conclude / list
    // fetch(endpoint + '/timerecord/listemp')
    fetch(endpoint + "/conclude/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        if (Array.isArray(data) && data.length > 0) {
          setConclude(data);
        } else {
          // If data is empty or not found, set state to an empty array
          setConclude([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //data for show in table
  const [listTableDayoff, setListTableDayoff] = useState([]);
  //data for check list dayoff
  const [data_listDayoff, setData_listDayoff] = useState([]);

  // Generate an array containing numbers from 21 to 31
  const range1 = Array.from({ length: 11 }, (_, i) => i + 21);

  // Generate an array containing numbers from 1 to 20
  const range2 = Array.from({ length: 20 }, (_, i) => i + 1);

  // Combine the two ranges into a single array
  const combinedRange = [...range1, ...range2];

  const [countWork, setCountWork] = useState(0);
  const [countWorkSTime, setCountWorkSTime] = useState(0);

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [workplaceIdList, setWorkplaceIdList] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1998 },
    (_, index) => currentYear - index
  );


  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน
  const [codePage, setCodePage] = useState("FM-HR-005-03"); //ชื่อหน่วยงาน

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [empId, setEmpId] = useState([]);

  const [searchResult1, setSearchResult1] = useState([]);

  const [woekplace, setWoekplace] = useState([]);

  const [calendarData1, setCalendarData1] = useState([]);
  const [calendarData2, setCalendarData2] = useState([]);
  // const yeartest = 2023;
  const monthtest = 3; // 3 represents March using 1-based indexing

  useEffect(() => {
    const fetchData = () => {
      const dataTest = {
        year: year,
        month: month,
      };

      axios
        .post(endpoint + "/accounting/calsalarylist", dataTest)
        .then((response) => {
          const responseData = response.data;
          // const filteredData = searchWorkplaceId
          //   ? responseData.filter(
          //       (item) => item.workplace === searchWorkplaceId
          //     )
          //   : responseData;

          // const filteredData = responseData.filter((item) => item.workplace);
          const filteredData = searchWorkplaceId
            ? responseData.filter((item) => item.workplace === searchWorkplaceId)
            : responseData; // If no searchWorkplaceId, return all data

          const sortedData = filteredData.sort(
            (a, b) => a.employeeId - b.employeeId
          );

          setResponseDataAll(sortedData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    // Call fetchData when year or month changes
    fetchData();
  }, [year, month, searchWorkplaceId]);

  async function handleSearch(event) {
    event.preventDefault();
    // get value from form search
    if (searchWorkplaceId === "" && searchWorkplaceName === "") {
      // Both employeeId and employeeName are null
      alert("กรุณากรอกรหัสหรือชื่อพนักงาน");
      // You can use window.location.reload() to reload the web page
      // window.location.reload();
    } else {
      // At least one of them is not null
    }
    const data = await {
      // workplaceId: searchWorkplaceId,
      // workplaceName: searchWorkplaceName,
      month: month,
      "employee_workplaceRecord.workplaceId": searchWorkplaceId,
      // 'employee_workplaceRecord.workplaceName': searchWorkplaceName,
    };

    const parsedNumber = (await parseInt(month, 10)) - 1;
    const formattedResult = await String(parsedNumber).padStart(2, "0");
    // await alert(formattedResult );

    const data1 = await {
      workplaceId: searchWorkplaceId,
      workplaceName: searchWorkplaceName,
      month: formattedResult,
    };

    // date day

    // Calculate the formatted month based on data1.month
    const parsedNumber1 = parseInt(data1.month, 10) - 1;
    const formattedResult1 = String(parsedNumber1).padStart(2, "0");

    // Calculate the formatted month based on data.month
    const parsedNumber2 = parseInt(data.month, 10) - 1;
    const formattedResult2 = String(parsedNumber2).padStart(2, "0");

    // Create a Date object for the first day of data1.month
    const firstDayOfMonth1 = new Date(yeartest, parsedNumber1, 1);

    // Create a Date object for the first day of data.month
    const firstDayOfMonth2 = new Date(yeartest, parsedNumber2, 1);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dates1 = [];
    const dates2 = [];

    // Loop through the days of the week
    for (let i = 0; i < 7; i++) {
      const day = daysOfWeek[i];
      const dayDates1 = [];
      const dayDates2 = [];

      // Start from the first day of data1.month
      let currentDate1 = new Date(firstDayOfMonth1);
      let currentDate2 = new Date(firstDayOfMonth2);

      // Find the first day of the week
      while (currentDate1.getDay() !== i) {
        currentDate1.setDate(currentDate1.getDate() + 1);
      }
      while (currentDate2.getDay() !== i) {
        currentDate2.setDate(currentDate2.getDate() + 1);
      }

      // Continue adding dates while still in the same month for data1.month
      while (currentDate1.getMonth() === parsedNumber1) {
        dayDates1.push(currentDate1.getDate());
        currentDate1.setDate(currentDate1.getDate() + 7); // Move to the next occurrence of the day
      }

      // Continue adding dates while still in the same month for data.month
      while (currentDate2.getMonth() === parsedNumber2) {
        dayDates2.push(currentDate2.getDate());
        currentDate2.setDate(currentDate2.getDate() + 7); // Move to the next occurrence of the day
      }

      dates1.push({ day, dates: dayDates1 });
      dates2.push({ day, dates: dayDates2 });
    }

    const filteredDates1 = dates1
      .map((dayData) => ({
        ...dayData,
        dates: dayData.dates.filter((date) => date >= 21 && date <= 31), // Adjusted filtering condition
      }))
      .filter((dayData) => dayData.dates.length > 0);

    const filteredDates2 = dates2
      .map((dayData) => ({
        ...dayData,
        dates: dayData.dates.filter((date) => date < 20), // Adjusted filtering condition
      }))
      .filter((dayData) => dayData.dates.length > 0);

    //dddd
    setCalendarData1(filteredDates1); // Assuming you have a separate state for data1.month
    setCalendarData2(filteredDates2);

    //check reload pag

    let check = 0;
    try {
      const response = await axios.post(
        endpoint + "/timerecord/searchemp",
        data
      );

      if (response.data.recordworkplace.length >= 1) {
        await setSearchResult(response.data.recordworkplace);
        await setResult_data(response.data.recordworkplace);
      } else {
        alert("ไม่พบข้อมูล 1 ถึง 20 " + getMonthName(data.month));
        check = check + 1;
        // window.location.reload();
      }

      const employeeWorkplaceRecords =
        (await response.data.recordworkplace[0].employee_workplaceRecord) || "";

      if (employeeWorkplaceRecords.length > 0) {
        const dates = employeeWorkplaceRecords.map((record) => record.date);
        // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

        const allTimeA = employeeWorkplaceRecords.map(
          (record) => record.allTime
        );

        const workplaceId = employeeWorkplaceRecords.map(
          (record) => record.workplaceId
        );

        const otTime = employeeWorkplaceRecords.map((record) => record.otTime);

        setTableData((prevState) => {
          const updatedData = [...prevState];
          dates.forEach((date, index) => {
            const dataIndex = parseInt(date, 10) - 1; // Subtract 1 because indices are zero-based
            // alert(index);
            if (dataIndex >= 0 && dataIndex < updatedData.length) {
              if (dataIndex <= 20) {
                // setCountWork((countWork + 1));
                // alert((dataIndex + 11));

                updatedData[dataIndex + 11].isChecked = true;
                updatedData[dataIndex + 11].otTime = otTime[index];
                updatedData[dataIndex + 11].allTime = allTimeA[index];
                updatedData[dataIndex + 11].workplaceId = workplaceId[index]; // Set otTime at the same index as dates
                updatedData[dataIndex + 11].date = dates[index]; // Set otTime at the same index as dates

                // Set otTime at the same index as dates
              }
            }
          });
          const filteredData = updatedData.filter(
            (record) => record.isChecked == true
          );

          const workplaceIds = [
            ...new Set(filteredData.map((record) => record.workplaceId)),
          ];

          setDataset(filteredData);
          return updatedData;
        });
      }
      if (response.data.recordworkplace.length < 1) {
        // window.location.reload();
        alert("ไม่พบข้อมูล");
        // window.location.reload();
      } else {
        // Set search values
        await setEmployeeId(response.data.recordworkplace[0].employeeId);
        await setName(response.data.recordworkplace[0].employeeName);

        setSearchWorkplaceId("");
        setSearchWorkplaceName("");
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา");
      // window.location.reload();
    }

    try {
      if (data1.month == "00") {
        data1.month = "12";
      }
      const response1 = await axios.post(
        endpoint + "/timerecord/searchemp",
        data1
      );
      if (response1.data.recordworkplace.length >= 1) {
        await setSearchResult1(response1.data.recordworkplace);
        // if (!result_data) {
        await setResult_data(response1.data.recordworkplace);
        // }
      } else {
        alert("ไม่พบข้อมูล 21 ถึง สิ้นเดือน " + getMonthName(data1.month));
        check = check + 1;
        if (check > 1) {
          // alert('reload');
          // window.location.reload();
        }
      }

      const employeeWorkplaceRecords1 =
        (await response1.data.recordworkplace[0].employee_workplaceRecord) ||
        "";

      if (employeeWorkplaceRecords1.length > 0) {
        const dates1 = await employeeWorkplaceRecords1.map(
          (record) => record.date
        );
        // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

        const allTimeA1 = await employeeWorkplaceRecords1.map(
          (record) => record.allTime
        );

        const workplaceId1 = await employeeWorkplaceRecords1.map(
          (record) => record.workplaceId
        );

        const otTime1 = await employeeWorkplaceRecords1.map(
          (record) => record.otTime
        );

        await setTableData((prevState) => {
          const updatedData = [...prevState];
          dates1.forEach((date1, index) => {
            const dataIndex1 = parseInt(date1, 10) - 1; // Subtract 1 because indices are zero-based
            // if (dataIndex1 >= 0 && dataIndex1 < updatedData.length) {
            // alert(index);
            if (dataIndex1 >= 20 && dataIndex1 <= 31) {
              // alert(dataIndex1 +' .');
              // setCountWork((countWork + 1));
              // alert((dataIndex1 - 20));

              updatedData[dataIndex1 - 20].isChecked = true;
              updatedData[dataIndex1 - 20].otTime = otTime1[index];
              updatedData[dataIndex1 - 20].allTime = allTimeA1[index];
              updatedData[dataIndex1 - 20].workplaceId = workplaceId1[index]; // Set otTime at the same index as dates
              updatedData[dataIndex1 - 20].date = dates1[index]; // Set otTime at the same index as dates
              // updatedData[(dataIndex1 - 20)].month = month[index]; // Set otTime at the same index as dates

              // Set otTime at the same index as dates
            }

            // }
          });

          const filteredData = updatedData.filter(
            (record) => record.isChecked == true
          );
          const workplaceIds = [
            ...new Set(filteredData.map((record) => record.workplaceId)),
          ];
          setDataset(filteredData);
          return updatedData;
        });
        // setWoekplace(dates);
      }
    } catch (error) {
      alert("กรุณาตรวจสอบข้อมูลในช่องค้นหา", error);
      // window.location.reload();
    }
    //xx
    // alert(result_data[0].employeeId);
  }

  const [Datasetsec, setDatasetsec] = useState([]);

  useEffect(() => {
    // Create a mapping of date to dayoff from listTableDayoff
    const dayoffMap = listTableDayoff.reduce((acc, day) => {
      const date = Object.keys(day)[0];
      const dayoff = day[date].trim(); // Remove extra spaces
      if (dayoff !== "") {
        acc[date] = dayoff;
      }
      return acc;
    }, {});

    // Update the Dataset with the dayoff property for matching dates
    const updatedDataset = dataset.map((item) => ({
      ...item,
      dayoff: dayoffMap[item.date] || "", // Add 'dayoff' property if the date exists in the map

      // test set time ot
    }));
    const workplaceIdCounts = {};
    const workplaceIdAllTimes = {};
    const workplaceIdOtTimes = {};

    const workplaceIdDayoffAllTimes = {};
    const workplaceIdDayoffOtTimes = {};

    updatedDataset.forEach((record) => {
      if (record.isChecked) {
        const { workplaceId, otTime, allTime, dayoff } = record;
        const allTimeAsNumber = parseFloat(allTime); // Parse allTime to a number
        const otTimeAsNumber = parseFloat(otTime); // Parse otTime to a number

        if (!workplaceIdCounts[workplaceId]) {
          workplaceIdCounts[workplaceId] = 0;
          workplaceIdAllTimes[workplaceId] = 0;
          workplaceIdOtTimes[workplaceId] = 0;
          workplaceIdDayoffAllTimes[workplaceId] = 0;
          workplaceIdDayoffOtTimes[workplaceId] = 0;
        }

        workplaceIdCounts[workplaceId]++;

        if (dayoff === "หยุด" && !isNaN(allTimeAsNumber)) {
          workplaceIdDayoffAllTimes[workplaceId] += allTimeAsNumber;
          workplaceIdDayoffOtTimes[workplaceId] += otTimeAsNumber;
        } else {
          if (!isNaN(allTimeAsNumber)) {
            if (allTimeAsNumber > 5.0) {
              workplaceIdAllTimes[workplaceId] += 1;
            } else {
              workplaceIdAllTimes[workplaceId] += 0.5;
            }
          }
          if (!isNaN(otTimeAsNumber)) {
            workplaceIdOtTimes[workplaceId] += otTimeAsNumber;
          }
        }
      }
    });
    const result = Object.entries(workplaceIdCounts).map(
      ([workplaceId, count]) => ({
        workplaceId,
        count,
        allTime: workplaceIdAllTimes[workplaceId].toFixed(1),
        otTime: workplaceIdOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
        dayoffAllTime: workplaceIdDayoffAllTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
        dayoffOtTime: workplaceIdDayoffOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
      })
    );

    // Calculate the total allTime
    const totalAllTime = Object.values(workplaceIdAllTimes)
      .reduce((sum, allTime) => sum + allTime, 0)
      .toFixed(1);

    const count = dataset.length;

    // Create a mapping of date to dayoff from listTableDayoff

    setCountWork(count);
    setCountWorkSTime(totalAllTime);
    setWorkplaceIdList(result);

    setDatasetsec(updatedDataset);
  }, [dataset, listTableDayoff]);

  useEffect(() => {
    if (searchWorkplaceId !== "") {
      const workplacesearch = workplaceList.find(
        (workplace) => workplace.workplaceId === searchWorkplaceId
      );
      if (workplacesearch) {
        setSearchWorkplaceName(workplacesearch.workplaceName);
      } else {
        setSearchWorkplaceName("");
      }
    }
  }, [searchWorkplaceId]);

  //set salaty calculate
  const [workRate, setWorkRate] = useState(""); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(""); //ค่าจ้าง OT ต่อชั่วโมง
  const [holiday, setHoliday] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์
  const [holidayHour, setHolidayHour] = useState(""); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง
  const [addSalary, setAddSalary] = useState([]); //เงิ่นเพิ่มพิเศษ

  const [workplaceIdListSearch, setWorkplaceIdListSearch] = useState([]); //หน่วยงานที่ค้นหาและทำงาน
  const [calculatedValues, setCalculatedValues] = useState([]);

  // get employee data
  const [MinusSearch, setMinusSearch] = useState(0); // Example: February (you can set it dynamically)
  const [EmpData, setEmpData] = useState([]); // Example: February (you can set it dynamically)
  // const [EmpDataWorkplace, setEmpDataWorkplace] = useState([]); // Example: February (you can set it dynamically)

  const [tableData, setTableData] = useState(
    combinedRange.map((index) => ({
      isChecked: false, // Initial state of the checkbox
      textValue: "", // Initial state of the text value
      workplaceId: index, // Store the workplaceId
      date: "", // Store the workplaceId
    }))
  );
  const handleCheckboxChange = (index) => {
    setTableData((prevState) => {
      const updatedData = [...prevState];
      updatedData[index].isChecked = !updatedData[index].isChecked;
      return updatedData;
    });
  };

  const handleTextChange = (index, event) => {
    const { value } = event.target;
    setTableData((prevState) => {
      const updatedData = [...prevState];
      updatedData[index].textValue = value;
      return updatedData;
    });
  };

  ///PDF///////////////////////
  // const [dataset, setDataset] = useState([]);
  const [monthset, setMonthset] = useState(""); // Example: February (you can set it dynamically)

  const [MinusSS, setMinusSS] = useState(0); // Example: February (you can set it dynamically)

  const [result, setResult] = useState(""); // Example: February (you can set it dynamically)

  // const [calendarData, setCalendarData] = useState([]);

  const [workMonth, setWorkMonth] = useState([]);

  const generateText = () => {
    return searchResult
      .map(
        (employeerecord) =>
          "ประจำเดือน " +
          getMonthName(employeerecord.month) +
          " ตั้งแต่วันที่ 21 " +
          getMonthName(parseInt(employeerecord.month, 10) - 1) +
          " ถึง 20 " +
          getMonthName(employeerecord.month) +
          " " +
          (parseInt(employeerecord.timerecordId, 10) + 543)
      )
      .join(" "); // Join the generated text into a single string
  };

  // Call generateText when the component mounts or when searchResult changes
  useEffect(() => {
    const text = generateText();
    setWorkMonth(text);
  }, [searchResult]);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF("landscape");

      // Load the Thai font
      const fontPath = "/assets/fonts/THSarabunNew.ttf";
      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };
      const tableOptions = {
        styles: stylestable,
        startY: 25,
        // margin: { top: 10 },
      };

      const title = " ใบลงเวลาการปฏิบัติงาน";

      // Set title with the Thai font
      doc.setFont("THSarabunNew");
      doc.setFontSize(16);
      const titleWidth =
        (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);

      const subTitle = workMonth; // Replace with your desired subtitle text
      doc.setFontSize(12); // You can adjust the font size for the subtitle
      const subTitleWidth =
        (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const subTitleX = (pageWidth - subTitleWidth) / 2;
      doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Calculate the number of days in the month, considering February and leap years
      const daysInMonth =
        monthset === "02" &&
          ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
          ? 29
          : monthset === "02"
            ? 28
            : [4, 6, 9, 11].includes(monthset)
              ? 30
              : 31;

      // Calculate the starting point for the table header
      let startingDay = 21;

      // Generate the header with a single cycle of "01" to "20" followed by "21" to the last day of the month
      const header = Array.from({ length: daysInMonth }, (_, index) => {
        const day =
          index + startingDay > daysInMonth
            ? index + startingDay - daysInMonth
            : index + startingDay;

        // Add leading zeros for days 1 to 9
        const formattedDay = day < 10 ? `0${day}` : day.toString();

        return formattedDay;
      });

      // Assuming that 'date' contains values like '01', '02', ..., '28', '29', '30', '31'
      // You can replace 'date' with the actual field name containing the date information in your data
      const dateOt = ["25", "09", "10"];

      const dateFieldName = "date";

      // Create an object to store data rows by date
      const rowDataByDate = {};

      // Organize the dataset into the rowDataByDate object
      Datasetsec.forEach((data) => {
        // dataset.forEach((data) => {

        const date = data[dateFieldName];
        if (!rowDataByDate[date]) {
          rowDataByDate[date] = {
            workplaceId: [],
            otTime: [],
            dateFieldName: [],
            allTime: [],
          };
        }
        rowDataByDate[date].workplaceId.push(data.workplaceId);
        rowDataByDate[date].otTime.push(data.otTime);
        rowDataByDate[date].allTime.push(data.allTime);
        rowDataByDate[date].dateFieldName.push(data[dateFieldName]);
      });

      // Map the header to transposedTableData using the rowDataByDate object
      const transposedTableData = header.map((headerDay) => {
        const rowData = rowDataByDate[headerDay];

        if (rowData) {
          return [
            rowData.workplaceId.join(", "),
            rowData.allTime.join(", "),
            rowData.otTime.join(", "),
            // rowData.dateFieldName.join(', '),
          ];
        } else {
          return ["", "", ""];
        }
      });

      // Transpose the transposedTableData to sort horizontally
      const sortedTableData = Array.from({ length: 3 }, (_, index) =>
        transposedTableData.map((row) => row[index])
      );

      const textColumn = [name, "เวลา ทำงาน", "เวลา OT"];

      const sortedTableDataWithText = sortedTableData.map((data, index) => {
        const text = [textColumn[index]];
        return [...text, ...data];
      });

      // Now, sortedTableDataWithText contains the text column followed by sorted data columns.

      const customHeaders = [["วันที่", ...header]];

      // Add custom headers and data to the table
      // doc.autoTable({
      //   head: customHeaders,
      //   body: sortedTableDataWithText,
      //   ...tableOptions,
      // });
      // Create a function to check if the cell should have a background color
      function shouldHighlightCell(text) {
        return dateOt.includes(text);
      }

      doc.autoTable({
        head: customHeaders,
        body: sortedTableDataWithText,
        ...tableOptions,
        didDrawCell: function (data) {
          if (
            data.cell.section === "head" &&
            shouldHighlightCell(data.cell.raw)
          ) {
            // Set the background color for header cells with the location number found in dateOt
            doc.setFillColor(255, 255, 0); // Yellow background color
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              "F"
            );
          }
        },
      });

      const additionalTableData = [
        ["เงินค่าจ้าง", "", "", "", "", "", "55"],
        ["Cell 4", "Cell 5", "Cell 6"],
        ["Cell 7", "Cell 8", "Cell 9"],
      ];

      const calculatedValuesAllTime = calculatedValues.map(
        (value) =>
          `${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      );

      // Combine the calculated values into a single array
      const combinedCalculatedValues = [
        "รวมวันทำงาน:",
        ...calculatedValuesAllTime,
      ];

      const calculatedValuesOt = calculatedValues.map((value) => [
        `${value.calculatedOT} (${value.otTime})`,
      ]);

      const combinedCalculatedValuesOt = [
        "รวมวันทำงาน OT:",
        ...calculatedValuesOt,
      ];

      const combinedTableData = [
        ...additionalTableData,
        combinedCalculatedValues,
        combinedCalculatedValuesOt,
      ];
      // Combine the calculated values into a single array
      // const combinedCalculatedValues = calculatedValuesAllTime.map((value, index) => [value, calculatedValuesOt[index]]);

      // const combinedTableData = [...additionalTableData, ...combinedCalculatedValues, ...calculatedValuesOt];

      const firstColumnWidth = 30; // Adjust the width as needed

      // Define column styles, including the width of the first column
      const columnStyles = {
        0: { columnWidth: firstColumnWidth }, // Index 0 corresponds to the first column
      };

      // Define options for the additional table
      const additionalTableOptions = {
        startY: 80, // Adjust the vertical position as needed
        margin: { top: 10 },
        columnStyles: columnStyles, // Assign the column stylestable here
        styles: stylestable,
      };

      // Add the additional table to the PDF
      // doc.autoTable({
      //   body: combinedTableData,
      //   ...additionalTableOptions,
      // });

      // Define the text to add background color to
      const textWithBackgroundColor = ["รวมวันทำงาน:", "รวมวันทำงาน OT:"];

      // Add the additional table to the PDF
      doc.autoTable({
        body: combinedTableData,
        ...additionalTableOptions,
        didDrawCell: function (data) {
          if (data.cell.section === "body") {
            // Check if the cell contains text that should have a background color
            const text = data.cell.raw;
            if (textWithBackgroundColor.includes(text)) {
              // Set the background color
              doc.setFillColor(255, 255, 0); // Yellow background color
              doc.rect(
                data.cell.x,
                data.cell.y,
                data.cell.width,
                data.cell.height,
                "F"
              );

              // Reset text color for better visibility
              doc.setTextColor(0, 0, 0);
            }
          }
        },
      });
      const titletest = "รวมวันทำงาน:";
      const titletest2 = "รวมวันทำงาน OT:";

      // Set title with the Thai font
      doc.setFont("THSarabunNew");
      doc.setFontSize(14);
      doc.text(titletest, 15, 108);
      doc.text(titletest2, 15, 115);

      // doc.save('example.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // const tableRef = useRef(null);

  const tableRef = useRef(null);

  const CheckMonth = parseInt(month, 10);
  const CheckYear = year;
  // const CheckMonth = 5;
  // const CheckYear = 2023;

  let countdownMonth;
  if (CheckMonth === 1) {
    countdownMonth = 12;
  } else {
    countdownMonth = CheckMonth - 1;
  }
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
    (_, index) => startDay + index
  );

  // Create an array from 1 to 20
  const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

  // Concatenate the two arrays
  const resultArray = [...firstPart, ...secondPart];

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

  const daysInMonth2 = getDaysInMonth(CheckMonth, CheckYear);
  const daysInCountdownMonth = getDaysInMonth2(countdownMonth, CheckYear);

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
    CheckYear,
    daysInCountdownMonth,
    (day) => day >= 21
  );

  // เริ่มระบุวันที่
  const desiredWorkplaceId = searchWorkplaceId;
  const desiredTimerecordId = year;
  const desiredMonth = month;

  // const desiredTimerecordId = 2023;
  // const desiredMonth = 3;
  const desiredTimerecordIdDaysOff = parseInt(year, 10);

  const desiredMonthDaysOff = parseInt(month, 10);

  useEffect(() => {
    // Filter data based on searchWorkplaceId and set it to workplaceDataList
    const filteredData = workplaceList.filter(
      (item) => item.workplaceId === searchWorkplaceId
    );
    setWorkplaceDataList(filteredData);

    if (filteredData.length > 0) {
      setWorkRateWorkplace(filteredData[0].workRate);
      setWorkRateWorkplaceStage1(filteredData[0].workRateOT);
      setWorkRateWorkplaceStage2(filteredData[0].holiday);
      setWorkRateWorkplaceStage3(filteredData[0].holidayOT);
    }

    // Filter workplaceDataList to find items with dayOff
    // const dayOffData = filteredData.filter(item => item.daysOff); // Assuming 'dayOff' is a property in the items

    // const filteredDataAddSalary = workplaceDataList.filter(item => item.workplaceId === searchWorkplaceId);
    // setWorkplaceDataListAddSalary(filteredDataAddSalary);

    const workTime = filteredData.map((item) => item.workOfHour);
    setWorkplaceDataWorkTime;

    // const addSalaryArray = filteredData.map(item => item.addSalary).flat();
    const addSalaryArray = filteredData
      .map((item) =>
        item.addSalary.filter(
          (salary) => salary.SpSalary !== "" && salary.SpSalary !== null
        )
      )
      .flat();

    setWorkplaceDataListAddSalary(addSalaryArray);

    const addSalaryArrayWorkOfHour = filteredData.map(
      (item) => item.workOfHour
    );
    setWorkplaceDataWorkOfHour(addSalaryArrayWorkOfHour);

    const addSalaryArrayWorkRate = filteredData.map((item) => item.workRate);
    setWorkplaceDataListWorkRate(addSalaryArrayWorkRate);

    // Filter workplaceDataList to find items with dayOff
    const dayOffData = filteredData.reduce((acc, item) => {
      if (item.daysOff && Array.isArray(item.daysOff)) {
        acc.push(...item.daysOff);
      }
      return acc;
    }, []);
    // วันหยุดนัก
    setWorkplaceDataListDayOff(dayOffData);
  }, [searchWorkplaceId, workplaceList]);

  const addSalaryWorkplace = workplaceDataListAddSalary;

  // workplaceDataListAddSalary
  // วันหยุดนักขัต
  const filteredDaysOff = workplaceDataListDayOff
    .filter((item) => {
      const date = new Date(item);
      return (
        date.getFullYear() === desiredTimerecordIdDaysOff &&
        date.getMonth() + 1 === desiredMonthDaysOff
      );
    })
    .map((item) => {
      const date = new Date(item);
      return date.getDate(); // Extract day part of the date
    });

  const filteredDaysOff_lower21 = filteredDaysOff.filter((day) => day < 21);

  const filteredDaysOff2 = workplaceDataListDayOff
    .filter((item) => {
      const date = new Date(item);
      if (desiredMonthDaysOff === 1) {
        // If desired month is January
        return (
          date.getFullYear() === desiredTimerecordIdDaysOff - 1 && // Previous year
          date.getMonth() + 1 === 12 // December
        );
      } else {
        return (
          date.getFullYear() === desiredTimerecordIdDaysOff && // Previous year
          date.getMonth() + 1 === desiredMonthDaysOff - 1 // December
        );
      }
    })
    .map((item) => {
      const date = new Date(item);
      return date.getDate(); // Extract day part of the date
    });

  const filteredDaysOff2_upper20 = filteredDaysOff2.filter((day) => day > 20);

  const allDayOff = [...filteredDaysOff2_upper20, ...filteredDaysOff_lower21];

  const holidayList = [];
  const falseWorkdays = [];

  const workplace = workplaceList.find(
    (workplace) => workplace.workplaceId === searchWorkplaceId
  );

  // const monthTest = "09"; // Assuming "09" represents September
  const commonNumbers123 = new Set();

  if (workplace && year) {
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
  } else {
    console.error("Workplace not found");
  }

  const commonNumbers = new Set();

  if (workplace && year) {
    const stopWorkTimeDay = workplace.workTimeDay.find(
      (day) => day.workOrStop == "stop"
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
        // englishDayArray.forEach(englishDay => {
        //     // Check if the key exists in array1 before attempting to access it
        //     if (array1.hasOwnProperty(englishDay)) {
        //         // Access the array and perform operations if the key exists
        //         array1[englishDay].forEach(value => commonNumbers.add(value));
        //     } else {
        //     }
        // });
      });
    } else {
      console.log("No stop workTimeDay found.");
    }
  } else {
    console.log("Workplace not found.");
  }

  commonNumbers123.forEach((number) => {
    commonNumbers.add(number);
  });

  commonNumbers.forEach((number) => {
    holidayList.push(number);
  });

  // Adding elements from commonNumbers123 array to falseWorkdays
  commonNumbers.forEach((number) => {
    falseWorkdays.push(number);
  });

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

  // const desiredMonthInt = parseInt(month, 10);

  // Function to check if a given date falls within the desired month and year
  const isDateInDesiredMonth = (dateString, year, month) => {
    const date = new Date(dateString);
    return date.getFullYear() === year && date.getMonth() + 1 === month; // Note: month is 0-indexed
  };

  let desiredMonthLower;

  if (desiredMonth === "01") {
    desiredMonthLower = "12";
  } else {
    // Convert desiredMonth to a number, subtract 1, add 12, take modulo 12, and format as a two-digit string
    desiredMonthLower = ((parseInt(desiredMonth, 10) - 1 + 12) % 12)
      .toString()
      .padStart(2, "0");
  }
  // Filter the entries based on the criteria

  const thaiMonthName = getThaiMonthName(desiredMonth);
  const thaiMonthNameLower = getThaiMonthName(desiredMonthLower);

  // const filteredEntries = timerecordAllList.filter(entry =>
  //     entry.timerecordId === desiredTimerecordId &&
  //     entry.month === desiredMonth &&
  //     entry.employee_workplaceRecord.date < 21 &&
  //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
  // );

  const filteredEntries = timerecordAllList
    .filter(
      (entry) =>
        entry.timerecordId === desiredTimerecordId &&
        entry.month === desiredMonth &&
        entry.employee_workplaceRecord.some(
          (record) =>
            record.date < 21 && record.workplaceId === desiredWorkplaceId
        )
    )
    .map((entry) => ({
      ...entry,
      employee_workplaceRecord: entry.employee_workplaceRecord.filter(
        (record) =>
          record.date < 21 && record.workplaceId === desiredWorkplaceId
      ),
    }));

  const employeeIds = filteredEntries.map((entry) => entry.employeeId);

  // const filteredEntriesLower = timerecordAllList.filter(entry =>
  //     entry.timerecordId === desiredTimerecordId &&
  //     entry.month === desiredMonthLower
  //     &&
  //     entry.employee_workplaceRecord.some(record => record.workplaceId === desiredWorkplaceId)
  // );

  const filteredEntriesLower = timerecordAllList
    .filter(
      (entry) =>
        entry.timerecordId === desiredTimerecordId &&
        entry.month === desiredMonthLower &&
        entry.employee_workplaceRecord.some(
          (record) =>
            record.date > 20 && record.workplaceId === desiredWorkplaceId
        )
    )
    .map((entry) => ({
      ...entry,
      employee_workplaceRecord: entry.employee_workplaceRecord.filter(
        (record) =>
          record.date > 20 && record.workplaceId === desiredWorkplaceId
      ),
    }));

  const employeeIdsLower = filteredEntriesLower.map(
    (entry) => entry.employeeId
  );

  // Create an object to store dates for each employee

  const datesByEmployee = {};
  const datesByEmployeeLow = {};

  const datesByEmployeeUpper = {};
  const datesByEmployeeLower = {};
  // Loop through employeeIds
  for (const employeeId of employeeIds) {
    // Filter entries for the current employee
    const employeeEntries = filteredEntries.filter(
      (entry) => entry.employeeId === employeeId
    );

    const entriesData = employeeEntries.map((entry) =>
      entry.employee_workplaceRecord
        .filter((record) => record.date <= 20)
        .map((record) => ({
          workplaceId: record.workplaceId,
          dates: record.date,
          allTimes: record.allTime,
          otTimes: record.otTime,
          specialtSalarys: record.specialtSalary,
          shift: record.shift,
        }))
    );

    datesByEmployee[employeeId] = entriesData;
  }

  for (const employeeId of employeeIdsLower) {
    // Filter entries for the current employee
    const employeeEntries = filteredEntriesLower.filter(
      (entry) => entry.employeeId === employeeId
    );

    // Extract dates for the current employee
    // const dates = employeeEntries.flatMap(entry =>
    //     entry.employee_workplaceRecord.map(record => record.date)
    // );

    // // Remove duplicates (if any)
    // const uniqueDatesLower = [...new Set(dates)];

    const entriesDataLower = employeeEntries.map((entry) =>
      entry.employee_workplaceRecord
        .filter((record) => record.date >= 21)
        .map((record) => ({
          workplaceId: record.workplaceId,
          dates: record.date,
          allTimes: record.allTime,
          otTimes: record.otTime,
          specialtSalarys: record.specialtSalary,
          shift: record.shift,
        }))
    );

    // Store the unique dates for the current employee
    datesByEmployeeLow[employeeId] = entriesDataLower;
  }

  const combinedArray = {};

  for (const employeeId of Object.keys(datesByEmployee)) {
    const entriesData = datesByEmployee[employeeId].flat();

    combinedArray[employeeId] = [
      ...(combinedArray[employeeId] || []),
      ...entriesData,
    ];
  }

  for (const employeeId of Object.keys(datesByEmployeeLow)) {
    const entriesData = datesByEmployeeLow[employeeId].flat();

    combinedArray[employeeId] = [
      ...(combinedArray[employeeId] || []),
      ...entriesData,
    ];
  }

  // แยกวันทำงานของแต่ละคน
  const uniqueDatesArray = Object.keys(combinedArray).map((employeeId) => {
    const entriesData = combinedArray[employeeId];
    const uniqueDatesSet = new Set(
      entriesData
        .map((entry) => Number(entry.dates))
        .filter((date) => date !== 0)
    );
    return [...uniqueDatesSet].sort((a, b) => a - b);
  });

  // Extract employee IDs
  // แยกemployee IDsของแต่ละคน
  const employeeIdsArray = Object.keys(combinedArray)
    .map(Number)
    .sort((a, b) => a - b);
  // setEmpIDlist(employeeIdsArray);
  // console.log('EmpIDlist',empIDlist);

  const filteredUniqueDatesArray = uniqueDatesArray.map((subArray) => {
    return subArray.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  });

  // useEffect(() => {
  //   // Fetch data from the API when the component mounts
  //   fetch(endpoint + "/employee/list")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Update the state with the fetched data
  //       setEmploeeData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);
  // responseDataAll
  // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)));

  // const filteredEmployees = emploeeData.filter(employee => employeeIdsArray.includes(parseInt(employee.employeeId, 10)))
  //     .sort((a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10));
  const filteredEmployees = responseDataAll.sort(
    (a, b) => parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10)
  );

  // Assuming `employeeList` is an array containing employee data
  filteredEmployees.forEach((employee) => {
    // Find the matching employee in the employeeList by employeeId
    const matchingEmployee = employeeList.find(
      (emp) => emp.employeeId === employee.employeeId
    );

    // If a matching employee is found and has "costtype" == "ภ.ง.ด.3"
    if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
      // Add the costtype information to the filteredEmployees array
      employee.costtype = "ภ.ง.ด.3";
    }
  });

  //     // Do something with the filtered employees

  // const extractedData = filteredEmployees.map((employee) => ({
  //   name: employee.name + " " + employee.lastName,
  //   employeeId: employee.employeeId,
  //   costtype: employee.costtype,
  // }));
  const extractedData = filteredEmployees
    .filter(
      (employee) =>
        employee.year === year &&
        employee.month === month &&
        employee.workplace === searchWorkplaceId
    )
    .map((employee) => ({
      name: employee.name + " " + employee.lastName,
      employeeId: employee.employeeId,
      costtype: employee.costtype,
    }));

  console.log('extractedData', extractedData);

  // console.log('filteredEmployees', filteredEmployees);


  const arraylistNameEmp = extractedData;
  const arraytest = [];

  const arrayAllTime = [];

  const arraytestOT = [];

  const arrayOTAllTime = [];

  const arrayWorkNormalDay = [];
  const arrayWorkNormalDayOld = [];

  const arrayWorkOTNormalDay = [];

  const arrayWorkHoli = [];

  const arrayWorkHoliday = [];
  const arrayWorkOTHoliday = [];

  const daySpecialts = [];

  Object.keys(combinedArray).forEach((employeeId) => {
    // วันที่ทำงานทั้งหมด
    // const datesArray = combinedArray[employeeId].map(entry => Number(entry.dates));
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }
    // });

    const datesArray = combinedArray[employeeId].map((entry) =>
      Number(entry.dates)
    );

    // Filter only numeric values in datesArray

    const filteredEntriesSpecialt = combinedArray[employeeId].filter(
      (entry) =>
        entry.shift === "specialt_shift" && Number(entry.specialtSalarys) > 300
    );

    const daySpecialt = filteredEntriesSpecialt.map((entry) =>
      parseInt(entry.dates, 10)
    );

    daySpecialts.push(daySpecialt);

    const numericDatesArray = datesArray.filter((date) => !isNaN(date));

    const datesSet = new Set(datesArray);
    const uniqueDatesArray = Array.from(datesSet);

    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    const employeeResultArray = resultArray
      .filter((day) => !daySpecialt.includes(parseInt(day, 10)))
      .map((day) => {
        const workplaceIdIndex = datesArray.indexOf(day);
        // if (workplaceIdIndex !== -1) {
        //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
        //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
        // } else {
        //     return '';
        // }
        if (workplaceIdIndex !== -1) {
          const currentWorkplaceId =
            combinedArray[employeeId][workplaceIdIndex].workplaceId;

          if (currentWorkplaceId === searchWorkplaceId) {
            return 1;
          } else if (currentWorkplaceId === "") {
            return "";
          } else {
            return currentWorkplaceId;
          }
        } else {
          return "";
        }
      });
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
    //     } else {
    //         return '';
    //     }
    // });

    // รวมชั่วโมงทำงาน
    const employeeResultArrayAllTime = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
      //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;

        if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayAllTime.push(employeeResultArrayAllTime);

    // รวมชั่วโมงทำงาน
    const employeeResultArrayOTAllTime = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
      //     return currentWorkplaceId === searchWorkplaceId ? '1' : currentWorkplaceId;
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayOTAllTime.push(employeeResultArrayOTAllTime);

    // const datesArray = combinedArray[employeeId].map(entry => Number(entry.dates));
    // const employeeResultArray = resultArray.map(day => {
    //     const workplaceIdIndex = datesArray.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].workplaceId;
    //         return currentWorkplaceId.includes(searchWorkplaceId) ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }

    // });

    arraytest.push(employeeResultArray);

    // const commonDates = datesArray.filter(date => allDayOff.includes(date) || holidayList.includes(date));
    // const employeeResultArray2 = resultArray.map(day => {
    //     const workplaceIdIndex = commonDates.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
    //         return Number.isInteger(parseFloat(currentWorkplaceId));

    //     } else {
    //         return '';
    //     }
    // });

    // วันที่ทำงานในวันหยุดธรรมดา(ช.ม.)
    const commonDatesHoli = datesArray.filter(
      (date) => holidayList.includes(date) && !allDayOff.includes(date)
    );
    const employeeResultArray2Holi = resultArray.map((day) => {
      const workplaceIdIndex = commonDatesHoli.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
      //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });
    arrayWorkHoli.push(employeeResultArray2Holi);

    // วันที่ทำงานในวันหยุดนักขัตฤกษ์(ช.ม.)
    const commonDates = datesArray.filter(
      (date) => allDayOff.includes(date) || daySpecialt.includes(parseInt(date))
    );
    // const commonDates = datesArray.filter(date => allDayOff.includes(date) && daySpecialt.includes(parseInt(date, 10)));

    // const commonDates = datesArray.filter(date => allDayOff.includes(date));

    const employeeResultArray2 = resultArray.map((day) => {
      const workplaceIdIndex = commonDates.indexOf(day);
      // if (workplaceIdIndex !== -1) {
      //     const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].allTimes;
      //     return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
      // } else {
      //     return '';
      // }
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].allTimes;
        // const currentWorkplaceId123 = combinedArray[employeeId][workplaceIdIndex].specialtSalarys;

        const specialtSalarys =
          combinedArray[employeeId][workplaceIdIndex]?.specialtSalarys ?? "";

        const currentWorkplaceId123 =
          specialtSalarys === "" ? "" : specialtSalarys;

        // 12/06/2024
        // if (currentWorkplaceId === searchWorkplaceId) {
        //     return 1;
        // } else if (currentWorkplaceId === '') {
        //     return '';
        // } else {
        // return parseFloat(currentWorkplaceId, 10);
        if (parseFloat(currentWorkplaceId, 10) == 0) {
          return "";
        } else {
          // if (currentWorkplaceId123 == "") {
          //     return '';
          // } else {
          return parseFloat(currentWorkplaceId, 10);
          // }
          // return parseFloat(currentWorkplaceId123, 10);
        }
        // }
      } else {
        return "";
      }
    });
    arrayWorkHoliday.push(employeeResultArray2);

    // วันที่ทำงานในวันหยุดนักขัตฤกษ์OT(ช.ม.)
    const commonDatesOT = datesArray.filter(
      (date) => allDayOff.includes(date) || daySpecialt.includes(parseInt(date))
    );
    // const employeeResultArray2OT = resultArray.map(day => {
    //     const workplaceIdIndex = commonDatesOT.indexOf(day);
    //     if (workplaceIdIndex !== -1) {
    //         const currentWorkplaceId = combinedArray[employeeId][workplaceIdIndex].otTimes;
    //         return currentWorkplaceId === searchWorkplaceId ? 1 : parseInt(currentWorkplaceId, 10);
    //     } else {
    //         return '';
    //     }
    // });
    const employeeResultArray2OT = resultArray.map((day) => {
      const workplaceIdIndex = commonDatesOT.indexOf(day);

      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          // return parseFloat(currentWorkplaceId, 10);
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });
    arrayWorkOTHoliday.push(employeeResultArray2OT);

    // วันที่ทำงานปกติ

    // datesArray
    const employeeResultArray3 = resultArray.map((day) => {
      const workplaceIdIndex = datesArray.indexOf(day);
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].workplaceId;
        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          return currentWorkplaceId;
        }
      } else {
        return "";
      }
    });

    arrayWorkNormalDay.push(employeeResultArray3);

    // วันที่ทำงานปกติ
    // const commonDates3 = datesArray.filter(date => !(allDayOff.includes(date) || holidayList.includes(date) || daySpecialt.includes(parseInt(date, 10))));
    const commonDates3 = datesArray.filter(
      (date) => !(allDayOff.includes(date) || holidayList.includes(date))
    );

    const employeeResultArray3Old = resultArray.map((day) => {
      const workplaceIdIndex = commonDates3.indexOf(day);
      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].workplaceId;
        return currentWorkplaceId === searchWorkplaceId
          ? 1
          : parseInt(currentWorkplaceId, 10);
      } else {
        return "";
      }
    });
    arrayWorkNormalDayOld.push(employeeResultArray3Old);

    // วันที่ทำงานปกติOT
    const commonDates3OT = datesArray.filter(
      (date) =>
        !(
          allDayOff.includes(date) ||
          holidayList.includes(date) ||
          daySpecialt.includes(parseInt(date, 10))
        )
    );

    const employeeResultArray3OT = resultArray.map((day) => {
      const workplaceIdIndex = commonDates3OT.indexOf(day);

      if (workplaceIdIndex !== -1) {
        const currentWorkplaceId =
          combinedArray[employeeId][workplaceIdIndex].otTimes;

        if (currentWorkplaceId === searchWorkplaceId) {
          return 1;
        } else if (currentWorkplaceId === "") {
          return "";
        } else {
          if (parseFloat(currentWorkplaceId, 10) == 0) {
            return "";
          } else {
            return parseFloat(currentWorkplaceId, 10);
          }
        }
      } else {
        return "";
      }
    });

    arrayWorkOTNormalDay.push(employeeResultArray3OT);
  });

  const filteredEntriesTest = conclude
    // Filter by year and month
    .filter((entry) =>
      entry.year === desiredTimerecordId && entry.month === desiredMonth
    )
    // Filter by employeeId that exists in employeeList
    .filter((entry) => {
      const employeeInList = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );
      return employeeInList !== undefined;
    })
    // Filter by searchWorkplaceId, either matching employeeList.workplace or concludeRecord.workplaceId
    .filter((entry) => {
      const employeeInList = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );

      // Check if the employee's workplace matches searchWorkplaceId
      if (employeeInList && employeeInList.workplace === searchWorkplaceId) {
        return true;
      }

      // Check if any of the concludeRecord's workplaceId matches searchWorkplaceId
      const workplaceMatch = entry.concludeRecord.some(
        (record) => record.workplaceId === searchWorkplaceId
      );

      return workplaceMatch;
    });


  filteredEntriesTest.sort((a, b) => {
    // Assuming employeeId is a string, convert it to a number for numerical comparison
    return Number(a.employeeId) - Number(b.employeeId);
  });


  // Step 1: Extract employeeId values from responseDataAll
  const employeeIdss = responseDataAll.map((entry) => entry.employeeId);

  // Step 2: Filter filteredEntriesTest based on employeeId
  const filteredEntriesqw = filteredEntriesTest.filter((entry) =>
    employeeIdss.includes(entry.employeeId)
  );

  // Step 3: Sort the filtered entries
  filteredEntriesqw.sort((a, b) => Number(a.employeeId) - Number(b.employeeId));

  const groupedByEmployeeId = {};

  filteredEntriesqw.forEach((entry) => {
    const employeeId = entry.employeeId;

    if (!groupedByEmployeeId[employeeId]) {
      groupedByEmployeeId[employeeId] = {
        addSalary: [],
        concludeDate: entry.concludeDate,
        concludeRecord: [],
        employeeId: employeeId,
        month: entry.month,
        year: entry.year,
        __v: entry.__v,
        _id: entry._id,
      };
    }

    entry.concludeRecord.forEach((record) => {
      const day = record.day;

      if (!groupedByEmployeeId[employeeId].concludeRecord[day]) {
        groupedByEmployeeId[employeeId].concludeRecord[day] = {
          day: day,
          workplaceId: [],
          allTimes: [],
          workRate: [],
          workRateMultiply: [],
          otTimes: [],
          workRateOT: [],
          workRateOTMultiply: [],
          addSalaryDay: [],
          shift: [],
          _id: [],
        };
      }

      groupedByEmployeeId[employeeId].concludeRecord[day].workplaceId.push(
        record.workplaceId
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].allTimes.push(
        parseFloat(record.allTimes) || 0
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRate.push(
        record.workRate
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRateMultiply.push(
        record.workRateMultiply
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].otTimes.push(
        parseFloat(record.otTimes) || 0
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].workRateOT.push(
        record.workRateOT
      );
      groupedByEmployeeId[employeeId].concludeRecord[
        day
      ].workRateOTMultiply.push(record.workRateOTMultiply);
      groupedByEmployeeId[employeeId].concludeRecord[day].addSalaryDay.push(
        record.addSalaryDay
      );
      groupedByEmployeeId[employeeId].concludeRecord[day].shift.push(
        record.shift
      );
      groupedByEmployeeId[employeeId].concludeRecord[day]._id.push(record._id);
    });

    groupedByEmployeeId[employeeId].addSalary.push(entry.addSalary);
  });

  // Transform the grouped data into the desired array structure
  const shiftOrder = [
    "morning_shift",
    "afternoon_shift",
    "night_shift",
    "specialt_shift",
  ];
  const resultArrayNew = [];

  Object.values(groupedByEmployeeId).forEach((group) => {
    const groupedDays = [];

    Object.values(group.concludeRecord).forEach((groupDay) => {
      const sortedIndices = groupDay.shift
        .map((shift, index) => ({ shift, index }))
        .sort(
          (a, b) => shiftOrder.indexOf(a.shift) - shiftOrder.indexOf(b.shift)
        )
        .map(({ index }) => index);

      const sortArrayByIndices = (array) =>
        sortedIndices.map((index) => array[index]);

      const sortedWorkplaceId = sortArrayByIndices(groupDay.workplaceId);
      const sortedWorkRate = sortArrayByIndices(groupDay.workRate);
      const sortedWorkRateOT = sortArrayByIndices(groupDay.workRateOT);
      const sortedWorkRateMultiply = sortArrayByIndices(
        groupDay.workRateMultiply
      );
      const sortedWorkRateOTMultiply = sortArrayByIndices(
        groupDay.workRateOTMultiply
      );
      const sortedAddSalaryDay = sortArrayByIndices(groupDay.addSalaryDay);
      const sortedShift = sortArrayByIndices(groupDay.shift);
      const sortedId = sortArrayByIndices(groupDay._id);

      const sumAllTimes = groupDay.allTimes.reduce(
        (sum, time) => sum + time,
        0
      );
      const sumOtTimes = groupDay.otTimes.reduce((sum, time) => sum + time, 0);

      groupedDays.push({
        day: groupDay.day,
        workplaceId: sortedWorkplaceId[0], // Taking the first element after sorting
        allTimes: sumAllTimes,
        workRate: sortedWorkRate[0], // Taking the first element after sorting
        workRateMultiply: sortedWorkRateMultiply[0], // Taking the first element after sorting
        otTimes: sumOtTimes,
        workRateOT: sortedWorkRateOT[0], // Taking the first element after sorting
        workRateOTMultiply: sortedWorkRateOTMultiply[0], // Taking the first element after sorting
        addSalaryDay: sortedAddSalaryDay[0], // Taking the first element after sorting
        shift: sortedShift,
        _id: sortedId,
      });
    });

    resultArrayNew.push({
      addSalary: group.addSalary,
      concludeDate: group.concludeDate,
      concludeRecord: groupedDays,
      employeeId: group.employeeId,
      month: group.month,
      year: group.year,
      __v: group.__v,
      _id: group._id,
    });
  });

  // Initialize objects to store the grouped times
  const dayWorkMorningAndSS = {};
  const dayWorkAfternoon = {};
  const dayWorkNight = {};

  const allTimesByEmployee = {};
  const otTimesByEmployee = {};

  const allTimesByEmployee2 = {};
  const otTimesByEmployee2 = {};

  const allTimesByEmployee3 = {};
  const otTimesByEmployee3 = {};

  // Iterate over filteredEntriesTest to populate the objects
  //   filteredEntriesTest.forEach((entry) => { old
  resultArrayNew.forEach((entry) => {
    // Initialize arrays to store the results for the current employeeId
    let dayWorkMorningAndSSArray = [];
    let dayWorkAfternoonArray = [];
    let dayWorkNightArray = [];

    const uniqueDaysMorningAndSS = new Set();
    const uniqueDaysAfternoon = new Set();
    const uniqueDaysNight = new Set();

    const MorningAndSSShiftDayCount = {};
    const nightShiftDayCount = {};

    let allTimesArray = [];
    let otTimesArray = [];

    let allTimesArray2 = [];
    let otTimesArray2 = [];

    let allTimesArray3 = [];
    let otTimesArray3 = [];
    let test = 0;

    // Iterate over each concludeRecord
    entry.concludeRecord.forEach((record) => {
      const matchingEmployee = employeeList.find(
        (emp) => emp.employeeId === entry.employeeId
      );

      // Check if workRate or workRateOT exists
      // const
      // if (record.workRate || record.workRateOT) {
      //     // Push allTimes and otTimes to respective arrays
      //     allTimesArray.push(parseFloat(record.allTimes));
      //     otTimesArray.push(parseFloat(record.otTimes));
      //     test += 1;
      // } else {
      //     // Push empty strings if workRate and workRateOT do not exist
      //     allTimesArray.push('');
      //     otTimesArray.push('');
      // }
      // const day = parseInt(record.day.split('/')[0]);
      ///////////////////////วันที่ทำงาน
      if (
        (record.workRate != 0 &&
          record.workRate != null &&
          //   (record.shift === "specialt_shift" || record.shift === "morning_shift")
          record.shift.includes("morning_shift")) ||
        record.shift.includes("specialt_shift")
        // (record.shift != "afternoon_shift" || record.shift != "night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays

        // dayWorkMorningAndSSArray.push(parseFloat(record.day));
        if (!uniqueDaysMorningAndSS.has(parseFloat(record.day))) {
          dayWorkMorningAndSSArray.push(record.workplaceId);
          uniqueDaysMorningAndSS.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        dayWorkMorningAndSSArray.push("");
      }

      if (
        record.workRate != 0 &&
        record.workRate != null &&
        //   record.shift == "afternoon_shift"
        record.shift.includes("afternoon_shift")
        // (record.shift != "specialt_shift" ||
        //   record.shift != "morning_shift" ||
        //   record.shift != "night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays
        // dayWorkAfternoonArray.push(parseFloat(record.day));

        if (!uniqueDaysAfternoon.has(parseFloat(record.day))) {
          dayWorkAfternoonArray.push(parseFloat(record.allTimes));
          uniqueDaysAfternoon.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        dayWorkAfternoonArray.push("");
      }

      if (
        record.workRate != 0 &&
        record.workRate != null &&
        record.shift.includes("night_shift")
      ) {
        // Push allTimes and otTimes to respective arrays
        // dayWorkNightArray.push(parseFloat(record.allTimes));
        if (!uniqueDaysNight.has(parseFloat(record.day))) {
          dayWorkNightArray.push(record.workplaceId);
          uniqueDaysNight.add(parseFloat(record.day));
        }

        // const day = parseInt(record.day.split('/')[0]);
      } else {
        dayWorkNightArray.push("");
      }
      /////////////////วันที่ทำงาน
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        // allTimesArray.push(parseFloat(record.allTimes).toFixed(1)); // Push empty string if workplace starts with "3"
        if (parseFloat(record.allTimes) == 0) {
          allTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        }
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) <= 1 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        // allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        if (parseFloat(record.allTimes) == 0) {
          allTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          // Push allTimes to array if it's not 0
          allTimesArray.push(parseFloat(record.allTimes).toFixed(1));
        }
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        // otTimesArray.push(parseFloat(record.otTimes).toFixed(1)); // Push empty string if workplace starts with "3"
        if (parseFloat(record.otTimes) == 0) {
          otTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        }
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) <= 1.5 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        // otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        if (parseFloat(record.otTimes) == 0) {
          otTimesArray.push(""); // Push empty string if allTimes is 0
        } else {
          // Push allTimes to array if it's not 0
          otTimesArray.push(parseFloat(record.otTimes).toFixed(1));
        }
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray.push("");
        // dayWorkArray.push('');
      }
      // 22
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        allTimesArray2.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) > 1.5 && // Convert workRateMultiply to float
        parseFloat(record.workRateMultiply) <= 2
      ) {
        // Push allTimes and otTimes to respective arrays
        allTimesArray2.push(parseFloat(record.allTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray2.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        otTimesArray2.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) < 3 &&
        parseFloat(record.workRateOTMultiply) > 2
      ) {
        // Push allTimes and otTimes to respective arrays
        otTimesArray2.push(parseFloat(record.otTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray2.push("");
        // dayWorkArray.push('');
      }

      // 33
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        allTimesArray3.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateMultiply) >= 3 // Convert workRateMultiply to float
      ) {
        // Push allTimes and otTimes to respective arrays
        allTimesArray3.push(parseFloat(record.allTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        allTimesArray3.push("");
        // dayWorkArray.push('');
      }
      if (matchingEmployee && matchingEmployee.workplace.startsWith("3")) {
        otTimesArray3.push(""); // Push empty string if workplace starts with "3"
      } else if (
        record.workRate != 0 &&
        record.workRate != null &&
        // record.workRate / workRateWorkplace < workRateWorkplaceStage1
        parseFloat(record.workRateOTMultiply) >= 3
      ) {
        // Push allTimes and otTimes to respective arrays
        otTimesArray3.push(parseFloat(record.otTimes).toFixed(1));
      } else {
        // Push empty strings if workRate and workRateOT do not exist
        otTimesArray3.push("");
        // dayWorkArray.push('');
      }

      // if (
      //   record.workRate != 0 &&
      //   record.workRate != null &&
      //   record.workRate / workRateWorkplace >= workRateWorkplaceStage1 &&
      //   record.workRate / workRateWorkplace < workRateWorkplaceStage2
      // ) {
      //   // Push allTimes and otTimes to respective arrays
      //   allTimesArray2.push(parseFloat(record.allTimes).toFixed(1));
      //   otTimesArray2.push(parseFloat(record.otTimes).toFixed(1));
      // } else {
      //   // Push empty strings if workRate and workRateOT do not exist
      //   allTimesArray2.push("");
      //   otTimesArray2.push("");
      // }
      // if (
      //   record.workRate != 0 &&
      //   record.workRate != null &&
      //   record.workRate / workRateWorkplace >= workRateWorkplaceStage2
      // ) {
      //   // Push allTimes and otTimes to respective arrays
      //   allTimesArray3.push(parseFloat(record.allTimes).toFixed(1));
      //   otTimesArray3.push(parseFloat(record.otTimes).toFixed(1));
      // } else {
      //   // Push empty strings if workRate and workRateOT do not exist
      //   allTimesArray3.push("");
      //   otTimesArray3.push("");
      // }
    });

    // Store the arrays in the objects by employeeId

    if (!dayWorkMorningAndSS[entry.employeeId]) {
      dayWorkMorningAndSS[entry.employeeId] = [];
    }
    dayWorkMorningAndSS[entry.employeeId].push(dayWorkMorningAndSSArray);

    if (!dayWorkAfternoon[entry.employeeId]) {
      dayWorkAfternoon[entry.employeeId] = [];
    }
    dayWorkAfternoon[entry.employeeId].push(dayWorkAfternoonArray);

    if (!dayWorkNight[entry.employeeId]) {
      dayWorkNight[entry.employeeId] = [];
    }
    dayWorkNight[entry.employeeId].push(dayWorkNightArray);

    if (!allTimesByEmployee[entry.employeeId]) {
      allTimesByEmployee[entry.employeeId] = [];
    }
    if (!otTimesByEmployee[entry.employeeId]) {
      otTimesByEmployee[entry.employeeId] = [];
    }
    allTimesByEmployee[entry.employeeId].push(allTimesArray);
    otTimesByEmployee[entry.employeeId].push(otTimesArray);

    //
    if (!allTimesByEmployee2[entry.employeeId]) {
      allTimesByEmployee2[entry.employeeId] = [];
    }
    if (!otTimesByEmployee2[entry.employeeId]) {
      otTimesByEmployee2[entry.employeeId] = [];
    }
    allTimesByEmployee2[entry.employeeId].push(allTimesArray2);
    otTimesByEmployee2[entry.employeeId].push(otTimesArray2);

    //
    if (!allTimesByEmployee3[entry.employeeId]) {
      allTimesByEmployee3[entry.employeeId] = [];
    }
    if (!otTimesByEmployee3[entry.employeeId]) {
      otTimesByEmployee3[entry.employeeId] = [];
    }
    allTimesByEmployee3[entry.employeeId].push(allTimesArray3);
    otTimesByEmployee3[entry.employeeId].push(otTimesArray3);
  });

  // Convert the objects to arrays of arrays
  const dayWorkMorningAndSSs = Object.values(dayWorkMorningAndSS).flat();
  console.log('dayWorkMorningAndSS', dayWorkMorningAndSS);

  const dayWorkAfternoons = Object.values(dayWorkAfternoon).flat();
  const dayWorkNights = Object.values(dayWorkNight).flat();

  const newAllTimes = Object.values(allTimesByEmployee).flat();
  const newOtTimes = Object.values(otTimesByEmployee).flat();

  const newAllTimes2 = Object.values(allTimesByEmployee2).flat();
  const newOtTimes2 = Object.values(otTimesByEmployee2).flat();

  const newAllTimes3 = Object.values(allTimesByEmployee3).flat();
  const newOtTimes3 = Object.values(otTimesByEmployee3).flat();

  const singleArrayOfDates = daySpecialts.flat();

  const updateDayWorks = (
    dayWorkMorningAndSSs,
    allDayOff,
    holidayList,
    singleArrayOfDates
  ) => {
    return dayWorkMorningAndSSs.map((subArray) =>
      subArray.map((day) =>
        allDayOff.includes(day) ||
          holidayList.includes(day) ||
          singleArrayOfDates.includes(day)
          ? ""
          : day
      )
    );
  };

  const updatedDaysWorkMorningAndSS = updateDayWorks(
    dayWorkMorningAndSSs,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );
  console.log('dayWorkMorningAndSSs', dayWorkMorningAndSSs);
  console.log('allDayOff', allDayOff);
  console.log('holidayList', holidayList);
  console.log('singleArrayOfDates', singleArrayOfDates);

  console.log('updatedDaysWorkMorningAndSS', updatedDaysWorkMorningAndSS);


  const updatedDaysWorkAfternoon = updateDayWorks(
    dayWorkAfternoons,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );

  const updatedDaysWorkNight = updateDayWorks(
    dayWorkNights,
    allDayOff,
    holidayList,
    singleArrayOfDates
  );

  const changeNumbersToOne = (array, searchWorkplaceId) => {
    return array.map((subArray) =>
      subArray.map((day) =>
        typeof day === "string" && day === searchWorkplaceId ? "1" : day
      )
    );
  };

  const changeNumbersToOne2 = (array) => {
    return array.map((subArray) =>
      subArray.map((day) => {
        if (typeof day === "string" && day === searchWorkplaceId) {
          return "1";
        } else if (typeof day === "string" && day !== "") {
          return "";
        } else {
          return day;
        }
      })
    );
  };

  // const searchWorkplaceId = '399-664';



  const finalUpdatedDayWorksWorkMorningAndSS = changeNumbersToOne(
    updatedDaysWorkMorningAndSS,
    searchWorkplaceId
  );

  console.log('searchWorkplaceId', searchWorkplaceId);
  console.log('finalUpdatedDayWorksWorkMorningAndSS', finalUpdatedDayWorksWorkMorningAndSS);

  const updatedFinalMorningAndSS = finalUpdatedDayWorksWorkMorningAndSS.map(
    (subArray) =>
      subArray.map((value) =>
        typeof value === "string" && value.length < 3 ? "" : value
      )
  );

  const finalUpdatedDayWorksWorkAfternoon = changeNumbersToOne2(
    updatedDaysWorkAfternoon
  );

  const finalUpdatedDayWorksWorkNight =
    changeNumbersToOne2(updatedDaysWorkNight);


  // const consolidateArrays = (
  //   morningArray,
  //   afternoonArray,
  //   nightArray
  // ) => {
  //   return morningArray.map((subArray, rowIndex) =>
  //     subArray.map((value, colIndex) => {
  //       // Check if "1" exists in any of the arrays at the same position
  //       return ["1"].includes(morningArray[rowIndex][colIndex]) ||
  //         ["1"].includes(afternoonArray[rowIndex][colIndex]) ||
  //         ["1"].includes(nightArray[rowIndex][colIndex])
  //         ? "1"
  //         : ""; // Set to "1" if found, else ""
  //     })
  //   );
  // };
  const consolidateArrays = (
    morningArray,
    afternoonArray,
    nightArray
  ) => {
    return morningArray.map((subArray, rowIndex) =>
      subArray.map((_, colIndex) => {
        // Check if any of the arrays have a non-empty value at the same position
        return morningArray[rowIndex][colIndex] ||
          afternoonArray[rowIndex][colIndex] ||
          nightArray[rowIndex][colIndex]
          ? "1"
          : ""; // Set to "1" if any value exists, otherwise an empty string
      })
    );
  };

  // Combine the arrays
  const finalConsolidatedArray = consolidateArrays(
    finalUpdatedDayWorksWorkMorningAndSS,
    finalUpdatedDayWorksWorkAfternoon,
    finalUpdatedDayWorksWorkNight
  );
  console.log('finalConsolidatedArray', finalConsolidatedArray);
  console.log('finalUpdatedDayWorksWorkMorningAndSS', finalUpdatedDayWorksWorkMorningAndSS);
  console.log('finalUpdatedDayWorksWorkAfternoon', finalUpdatedDayWorksWorkAfternoon);
  console.log('finalUpdatedDayWorksWorkNight', finalUpdatedDayWorksWorkNight);


  const sumArrayAllTime = arrayAllTime.map((subArray) => {
    let totalHours = 0;
    let totalMinutes = 0;

    subArray.forEach((val) => {
      if (typeof val === "number") {
        const [hours, minutes] = val.toString().split(".").map(Number);
        totalHours += hours;
        totalMinutes += minutes ? minutes * 10 : 0; // 0.1 hour is 6 minutes
      }
    });

    // Convert total minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Convert remaining minutes back to hours (fractional hours)
    totalHours += totalMinutes / 60;

    return totalHours;
  });

  const dividedArray = sumArrayAllTime.map((sum) =>
    (sum / workplaceDataWorkOfHour).toFixed(2)
  );

  const sumArrayOTAllTime = arrayOTAllTime.map((subArray) =>
    subArray.reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0)
  );

  const sumArray321 = (array) => {
    return array.map((subArray) =>
      subArray.reduce(
        (acc, val) => acc + (typeof val === "number" ? val : 0),
        0
      )
    );
  };

  // Ensure all values are numbers
  const convertToNumbers = (array) => {
    return array.map((subArray) =>
      subArray.map((val) => (val === "" ? 0 : parseFloat(val)))
    );
  };

  // Sum corresponding elements of two arrays
  const sumArraysElementWise = (array1, array2) => {
    return array1.map((subArray, i) =>
      subArray.map((val, j) => val + array2[i][j])
    );
  };

  // Convert to numbers
  // 1.5
  const newAllTimesNumbers = convertToNumbers(newAllTimes);

  const newAllTimes2Numbers = convertToNumbers(newAllTimes2);
  const newOtTimesNumbers = convertToNumbers(newOtTimes);

  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArray1_5 = sumArraysElementWise(
    newAllTimes2Numbers,
    newOtTimesNumbers
  );

  const summedArray = sumArray321(newAllTimes2Numbers);
  // Sum each sub-array

  const sumArrayOT = sumArray321(combinedArray1_5);

  const sumArrayTotal = sumArrayOT;
  // 2
  const newAllTimes3Numbers = convertToNumbers(newAllTimes3);
  const newOtTimes2Numbers = convertToNumbers(newOtTimes2);

  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArray2 = sumArraysElementWise(
    newAllTimes3Numbers,
    newOtTimes2Numbers
  );

  // Sum each sub-array
  const sumArrayHoliday = sumArray321(combinedArray2);

  // รวมช.ม.ที่งานไม่รวมOT
  const convertToHoursMinutes = (total) => {
    const hours = Math.floor(total);
    const minutes = Math.round((total - hours) * 60);
    return `${hours}.${minutes < 10 ? "0" : ""}${minutes}`;
  };
  // Sum corresponding elements of newAllTimes2Numbers and newOtTimesNumbers
  const combinedArrayAll = sumArraysElementWise(
    newAllTimes3Numbers,
    newAllTimesNumbers,
    newAllTimes2Numbers
  );

  // Sum each sub-array
  const sumArrayAllHourWork = sumArray321(combinedArrayAll);

  console.log('responseDataAll', responseDataAll);

  const filteredResponseDataAll = responseDataAll.filter((response) =>
    extractedData.some((employee) => employee.employeeId === response.employeeId)
  );

  const countSpecialDays = filteredResponseDataAll.map(
    (item) => Number(item.countSpecialDay) || 0
  );
  const specialDayListWorks = filteredResponseDataAll.map((item) =>
    item.specialDayListWork ? item.specialDayListWork.length : 0
  );

  // const specialDayRate = filteredResponseDataAll.map(item => item.specialDayRate);
  const specialDayRate = filteredResponseDataAll.map((item) =>
    parseInt(item.specialDayRate, 10)
  );
  // const amountSpecialDay = filteredResponseDataAll.map(item => parseInt(item.accountingRecord.amountSpecialDay, 10));
  const amountSpecialDay = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseInt(accountingRecord.amountSpecialDay, 10)
      : 0;
  });

  const countHour = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countHour, 10) : 0;
  });

  const countDay = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countDay, 10) : 0;
  });

  const countDayWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countDayWork, 10) : 0;
  });
  console.log('countDayWork', countDayWork);

  const countHourWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord ? parseInt(accountingRecord.countHourWork, 10) : 0;
  });

  const amountCountDayWork = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountCountDayWork).toFixed(2)
      : 0;
  });

  const hourOneFive = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];

    // Check if the workplace starts with "3"
    if (item.workplace.startsWith("3")) {
      // Return `countOtHour` if workplace starts with "3"
      return accountingRecord
        ? parseFloat(accountingRecord.countOtHour).toFixed(2)
        : "0.00";
    } else {
      // Otherwise, return `hourOneFive`
      return accountingRecord
        ? parseFloat(accountingRecord.hourOneFive).toFixed(2)
        : "0.00";
    }
  });

  const amountOneFive = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];

    // Check if the workplace starts with "3"
    if (item.workplace.startsWith("3")) {
      // Return `countOtHour` if workplace starts with "3"
      return accountingRecord
        ? parseFloat(accountingRecord.amountOt).toFixed(2)
        : "0.00";
    } else {
      // Otherwise, return `hourOneFive`
      return accountingRecord
        ? parseFloat(accountingRecord.amountOneFive).toFixed(2)
        : "0.00";
    }
  });


  const hourTwo = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.hourTwo).toFixed(2)
      : "0.00";
  });

  const amountTwo = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountTwo).toFixed(2)
      : "0.00";
  });

  const hourThree = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.hourThree).toFixed(2)
      : "0.00";
  });

  const amountThree = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.amountThree).toFixed(2)
      : "0.00";
  });

  const saveCash = filteredResponseDataAll.map((item) =>
    item.workplace.startsWith("3") ? "สแปร์เงินสด" : ""
  );

  const sumArrayHoli = countSpecialDays.map(
    (countSpecialDay, index) => countSpecialDay - specialDayListWorks[index]
  );

  const socialSecurity = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.socialSecurity)
      : "0";
  });

  const tax = filteredResponseDataAll.map((item) => {
    const accountingRecord = item.accountingRecord?.[0];
    return accountingRecord
      ? parseFloat(accountingRecord.tax)
      : "0";
  });

  const adjustedAmountSpecialDay = amountSpecialDay.map((amount, index) => {
    if (isNaN(amount) || amount === 0) {
      sumArrayHoli[index] = 0;
      return 0;
    }
    return amount;
  });

  const sumArrayOTHoliday = newOtTimes3.map((subArray) =>
    subArray
      .reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0)
      .toFixed(2)
  );

  // นับวันที่ทำในวันหยุดวันนักขัตฤกษ์
  const occurrencesCount = filteredUniqueDatesArray.map((subArray) => {
    const count = subArray.filter((value) => allDayOff.includes(value)).length;
    return count;
  });

  // นับวันที่ทำในวันหยุด ไม่รวมวันนักขัตฤกษ์
  const occurrencesCount2 = filteredUniqueDatesArray.map((subArray) => {
    const count = subArray.filter(
      (value) => holidayList.includes(value) && !allDayOff.includes(value)
    ).length;
    return count;
  });

  const sumArray = arrayWorkNormalDay.map((subarray) =>
    subarray.reduce((count, item) => {
      if (typeof item === "string") {
        const stringLength = item.length;

        if (stringLength >= 4) {
          return count + 1;
        } else if (stringLength > 0) {
          return count + parseFloat(item) || 0;
        }
      } else if (typeof item === "number") {
        return count + item;
      }

      return count;
    }, 0)
  );

  const sumArrayOld = arrayWorkNormalDayOld.map((subarray) =>
    subarray
      .map((item) => (typeof item === "number" ? 1 : item))
      .reduce((count, item) => (item === 1 ? count + 1 : count), 0)
  );

  const indexArray = Array.from(
    { length: sumArray.length },
    (_, index) => index + 1
  );

  const sumHoliAllTime = sumArrayOT.map(
    (value, index) => value + sumArrayHoli[index]
  );

  // workplaceDataWorkOfHour
  // sumArrayHoliday
  // sumArrayHoli

  const sumarrayAllHoloday = sumArrayHoli.map((valueHoli, index) => {
    const valueHoliday = sumArrayHoliday[index] || 0; // If undefined, treat as 0
    const sum = valueHoli + valueHoliday;
    return sum / workplaceDataWorkOfHour;
  });
  // addSalaryWorkplace
  const sumArraySumarrayAllHolioday = sumArray.map(
    (value, index) => value + sumarrayAllHoloday[index]
  );

  const resultAllSalaryEmp = [];

  addSalaryWorkplace.sort((a, b) => a.name.localeCompare(b.name, "th"));


  const getUniqueEntriesWithLowestSpSalary = (entries) => {
    const uniqueEntriesMap = new Map();

    entries.forEach((entry) => {
      const { codeSpSalary, SpSalary } = entry;
      const currentEntry = uniqueEntriesMap.get(codeSpSalary);

      if (
        !currentEntry ||
        parseFloat(SpSalary) < parseFloat(currentEntry.SpSalary)
      ) {
        uniqueEntriesMap.set(codeSpSalary, entry);
      }
    });

    return Array.from(uniqueEntriesMap.values());
  };

  const filteredAddSalaryWorkplace =
    getUniqueEntriesWithLowestSpSalary(addSalaryWorkplace);

  console.log('filteredAddSalaryWorkplace', filteredAddSalaryWorkplace);

  const addSalaryNames = new Set(
    filteredAddSalaryWorkplace.map((item) => item.name)
  );

  // Map filteredEmployees to set SpSalary based on the position of the corresponding name in filteredAddSalaryWorkplace
  console.log('filteredEmployees', filteredEmployees);

  // ช่วงที่เพิ่มเงินลา
  const responseDataAllLeaveSalary = filteredEmployees.map((employee) => {
    // Find matching leaveSalary for the employee
    const matchingLeave = leaveSalary.find(
      (leave) => leave.employeeId === employee.employeeId
    );

    // Sum SpSalary from leaveSalary.record if it exists
    const totalSpSalary = matchingLeave?.record?.reduce((sum, record) => {
      return sum + (parseFloat(record.SpSalary) || 0);
    }, 0) || 0;

    // Prepare the "เงินลา" object to add to addSalary
    const leaveSalaryEntry = {
      SpSalary: totalSpSalary,
      StaffType: "all",
      id: "-",
      name: "เงินลา",
      nameType: "",
      roundOfSalary: "daily",
    };

    // Add the leaveSalaryEntry to addSalary array (initialize if needed)
    const updatedAddSalary = [
      ...(employee.addSalary || []), // Keep existing addSalary entries
      leaveSalaryEntry, // Add the new leaveSalary entry
    ];

    // Add the summed SpSalary to addAmountAfterTax
    // return {
    //   ...employee,
    //   accountingRecord: {
    //     ...employee.accountingRecord,
    //     addAmountAfterTax:
    //       (employee.accountingRecord?.addAmountAfterTax || 0) + totalSpSalary,
    //   },
    //   addSalary: updatedAddSalary, // Update the addSalary array
    // };
    return {
      ...employee,
      accountingRecord: {
        ...employee.accountingRecord,
        addAmountAfterTax:
          ((employee.accountingRecord?.addAmountAfterTax || 0) + totalSpSalary)
            .toString(), // Convert addAmountAfterTax to a string
      },
      addSalary: updatedAddSalary, // Update the addSalary array
    };
  });

  console.log("responseDataAllLeaveSalary", responseDataAllLeaveSalary);

  // const extractedDataAddSalary = responseDataAllLeaveSalary.map((employee) => {
  //   // Initialize an array to hold SpSalary values
  //   const spSalaryArray = [];
  //   // Iterate over filteredAddSalaryWorkplace
  //   filteredAddSalaryWorkplace.forEach((salaryItem) => {
  //     // Find the position of salaryItem.name in employee.addSalary
  //     const index = employee.addSalary.findIndex(
  //       (item) => item.id === salaryItem.codeSpSalary
  //     );
  //     // If the name exists in employee.addSalary, push the SpSalary as an integer to spSalaryArray
  //     if (index !== -1 || employee.addSalary[index].id == '-') {
  //       spSalaryArray.push(parseInt(employee.addSalary[index].SpSalary));
  //     } else {
  //       // If the name doesn't exist in employee.addSalary, push 0 as an integer
  //       spSalaryArray.push("");
  //     }
  //   });
  //   return spSalaryArray;
  // });

  const extractedDataAddSalary = responseDataAllLeaveSalary.map((employee) => {
    // Initialize an array to hold SpSalary values
    const spSalaryArray = [];

    // Track if we find an entry with `id === '-'`
    let lastSpSalary = null;

    // Iterate over filteredAddSalaryWorkplace
    filteredAddSalaryWorkplace.forEach((salaryItem) => {
      // Find the position of salaryItem.name in employee.addSalary
      const index = employee.addSalary.findIndex(
        (item) => item.id === salaryItem.codeSpSalary
      );

      if (index !== -1) {
        // If the salary item exists, push the SpSalary value
        spSalaryArray.push(parseInt(employee.addSalary[index].SpSalary) || 0);
      } else {
        // If the salary item doesn't exist, check for `id === '-'`
        const dashIndex = employee.addSalary.findIndex(
          (item) => item.id == '-'
        );

        if (dashIndex !== -1) {
          // If `id === '-'` is found, store the SpSalary to be added at the end
          lastSpSalary = parseInt(employee.addSalary[dashIndex].SpSalary) || 0;
        } else {
          // If no matching salary item or `id === '-'`, push an empty value
          spSalaryArray.push("");
        }
      }
    });

    // If we found a `'-'`, push its SpSalary to the last position of the array
    if (lastSpSalary !== null) {
      spSalaryArray.push(lastSpSalary);
    }

    return spSalaryArray;
  });


  console.log('extractedDataAddSalary', extractedDataAddSalary);

  const adjustedDailyExtractedDataAddSalary = extractedDataAddSalary.map(
    (salaryArray, outerIndex) => {
      return salaryArray.map((value, innerIndex) => {
        // Find the corresponding salary item in employee.addSalary
        const employeeSalaryItem = responseDataAllLeaveSalary[outerIndex].addSalary.find(
          (item) => item.name === filteredAddSalaryWorkplace[innerIndex].name
        );

        if (
          employeeSalaryItem &&
          employeeSalaryItem.roundOfSalary === "daily"
        ) {
          return value;
        } else {
          // Otherwise, keep the value unchanged
          return value;
        }
      });
    }
  );


  // const adjustedDailyExtractedDataAddSalaryCount = extractedDataAddSalary.map(
  //   (salaryArray, outerIndex) => {
  //     return salaryArray.map((value, innerIndex) => {
  //       // If the value is not an empty string and roundOfSalary is 'daily'
  //       // const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(item => item.name === filteredAddSalaryWorkplace[innerIndex].name);
  //       const employeeSalaryItem = filteredEmployees[outerIndex].addSalary.find(
  //         (item) =>
  //           item.id === filteredAddSalaryWorkplace[innerIndex].codeSpSalary
  //       );

  //       if (
  //         value !== "" &&
  //         filteredAddSalaryWorkplace[innerIndex].roundOfSalary === "daily"
  //       ) {
  //         // Multiply the value by the corresponding count in sumArray
  //         // return sumArrayOld[outerIndex];
  //         return employeeSalaryItem.message;
  //       } else {
  //         // Otherwise, keep the value unchanged
  //         return "";
  //       }
  //     });
  //   }
  // );

  const adjustedDailyExtractedDataAddSalaryCount = extractedDataAddSalary.map(
    (salaryArray, outerIndex) => {
      return salaryArray.map((value, innerIndex) => {
        // Find the corresponding employee salary item
        const employeeSalaryItem = responseDataAllLeaveSalary[outerIndex].addSalary.find(
          (item) =>
            item.id === filteredAddSalaryWorkplace[innerIndex].codeSpSalary
        );

        if (
          value !== "" &&
          filteredAddSalaryWorkplace[innerIndex].roundOfSalary === "daily"
        ) {
          // If employeeSalaryItem is found, return its message, else return empty string
          return employeeSalaryItem ? employeeSalaryItem.message : "";
        } else {
          // Otherwise, return an empty string
          return "";
        }
      }).map((cell) => cell === undefined ? "" : cell); // Map again to replace undefined with ""
    }
  );

  console.log('adjustedDailyExtractedDataAddSalaryCount', adjustedDailyExtractedDataAddSalaryCount);
  // รวมคำนวนสวัสดิการ
  const SpSalaryArray = workplaceDataListAddSalary.map((item) => item.SpSalary);
  const roundOfSalaryArray = workplaceDataListAddSalary.map(
    (item) => item.roundOfSalary
  );

  const resultArraySumAddSalary = [];

  for (let i = 0; i < sumArraySumarrayAllHolioday.length; i++) {
    const calculatedValues = [];

    for (let j = 0; j < SpSalaryArray.length; j++) {
      const originalValue = parseInt(SpSalaryArray[j], 10);
      const roundOfSalary = roundOfSalaryArray[j];

      let calculatedValue;

      if (roundOfSalary === "monthly") {
        calculatedValue = originalValue;
      } else if (roundOfSalary === "daily") {
        calculatedValue = sumArraySumarrayAllHolioday[i] * originalValue;
      }

      calculatedValues.push(calculatedValue);
    }

    resultArraySumAddSalary.push(calculatedValues);
  }

  const yearThai = parseFloat(year, 10) + 543;
  // เริ่มฟังค์ชั่นpdf

  const generatePDFTest123 = (event) => {
    event.preventDefault();
    try {
      // Your code here
      // handleEmployeeFilter();
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const table = tableRef.current;
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };

      const arraytestSpSalary = [
        [
          "",
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          0.5,
        ],
        [2, 2, 2, 2, 2, "", 2, "", 2],
        [2, "", 2, 2, "", 2, 3, "", 3, 3],
        [3, 3, 3, "", 3, 3, 3, 3],
        [3, "", 3, "", 3, 3, 3, 1, "", 1],
        [3, 3, "", 1, 1, "", 1, 3, 3],
        [3, 3, "", 3, "", 3, 3, 3, 3, "", 1, "", 1, 0.5, 0.5, 1.5],
      ];

      const arraylistOT = ["1.5", "2", "3"];

      const arrayLength = 9;
      // Set title with the Thai font
      // const makePage = Math.ceil(arrayLength / 6);
      let roundpage = 0;

      // for (let page = 0; page < makePage; page++) {
      // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      // doc.autoTable({
      //     html: table,
      //     styles: stylestable,
      //     margin: { top: 30 },
      // });

      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      doc.setFontSize(8);
      // doc.text(title, 171, 55, { angle: 90 });

      // const CheckMonth = 2;
      // const CheckYear = 2023;

      // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);
      // const daysInMonth = 30;
      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      const numRows = 7;
      const numCols = daysInMonth;
      const cellWidth = 6.5;
      const cellHeight = 3.5;
      const startX = 55; // Adjust the starting X-coordinate as needed
      const startY = 55; // Adjust the starting Y-coordinate as needed
      const borderWidth = 0.5; // Adjust the border width as needed

      // Function to draw a cell with borders
      const drawCell = (x, y, width, height) => {
        doc.rect(x, y, width, height);
      };

      // Function to draw the entire table
      // const drawTable = () => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight;
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };

      // const drawTable = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2);
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };
      // const additionalHeight = 3;

      const drawTable = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // Increase the height for the first row
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            // const adjustedCellY = i === 0 ? y : y * 2;

            if (i === 0) {
              drawCell(x, y, cellWidth, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidth, adjustedCellHeight);
            }
            // drawCell(x, y , cellWidth, adjustedCellHeight);
          }
        }
      };

      const numRowsLeftHead = 1;
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 50;
      const cellHeightLeftHead = 3.5;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed
      // const startYLeftHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthLeftHead = 0.5; // Adjust the border width as needed

      const drawTableLeftHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthLeftHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // if (i >= numRows - 3) {
            //     const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text("โอที " + cellText, x + 46, y + 2.5, { align: 'center' }); // Use the entire cellText
            //     }
            // }
            const cellText0 = arraylistOT[0].toString(); // Convert to string if needed
            const cellText1 = arraylistOT[1].toString(); // Convert to string if needed
            const cellText2 = arraylistOT[2].toString(); // Convert to string if needed

            doc.text("โอที " + cellText0, x + 46, y + 2.5 + 3.5 * 4, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText1, x + 46, y + 2.5 + 3.5 * 5, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText2, x + 46, y + 2.5 + 3.5 * 6, {
              align: "center",
            }); // Use the entire cellText
          }
        }
      };

      const numRowsNumHead = 7;
      const numColsNumHead = 1;
      const cellWidthNumHead = 8;
      const cellHeightNumHead = 3.5;
      const startXNumHead = 5; // Adjust the starting X-coordinate as needed
      // const startYNumHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthNumHead = 0.5; // Adjust the border width as needed

      // const drawTableNumHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsNumHead; j++) {
      //             const x = startXNumHead + j * cellWidthNumHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthNumHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

      //             }
      //         }
      //     }
      // };
      const drawTableNumHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthNumHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthNumHead, adjustedCellHeight);
          }
        }
      };

      const numRowsSpSalary = 7;
      const numColsSpSalary = 3;
      const cellWidthSpSalary = 10;
      const cellHeightSpSalary = 3.5;
      const borderWidthSpSalary = 0.5; // Adjust the border width as needed

      let startXSpSalary; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXSpSalary = 157;
      } else if (daysInMonth === 29) {
        startXSpSalary = 163.5;
      } else if (daysInMonth === 30) {
        startXSpSalary = 170;
      } else if (daysInMonth === 31) {
        startXSpSalary = 176.5;
      }

      const drawTableSpSalary = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            const x =
              startXSpSalary + j * cellWidthSpSalary + cellWidthSpSalary * 8;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthSpSalary, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);
            } else {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary,
                adjustedCellHeight
              );
            }
          }
        }
      };

      const numRowsMess = 7;
      const numColsMess = 1;
      const cellWidthMess = 25;
      const cellHeightMess = 3.5;
      let startXMess; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXMess = 247;
      } else if (daysInMonth === 29) {
        startXMess = 253.5;
      } else if (daysInMonth === 30) {
        startXMess = 260;
      } else if (daysInMonth === 31) {
        startXMess = 266.5;
      }
      const borderWidthMess = 0.5;
      const drawTableMess = (tableNumber, arraylistOT) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);

            // Draw the cell
            // drawCell(x, y, cellWidthMess, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthMess, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidthMess, adjustedCellHeight);
            }

            // Add text below the last two cells
            // if (i >= numRows - 2) {
            //     const arrayIndex = i - (numRows - 2); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text(cellText, x, y + cellHeight * (arrayIndex + 1), { align: 'center' });
            //     }
            // }
          }
        }
      };

      // const drawTableOT = (tableNumber, arraylistOT) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let k = 0; k < arraylistOT.length; k++) {
      //             const x = startXMess; // Adjust the starting X-coordinate as needed
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2) + k * lineHeight;

      //             doc.text('โอที ' + arraylistOT[k], x, y, { align: 'left' });
      //         }
      //     }
      // };

      const drawTableOT = (arraylistOT) => {
        const startXOT = 10; // Adjust the starting X-coordinate for the OT text
        let startYOT = 10; // Adjust the starting Y-coordinate for the OT text
        const lineHeightOT = 10; // Adjust the vertical spacing between lines

        for (let k = 0; k < arraylistOT.length; k++) {
          doc.text("โอที " + arraylistOT[k], startXOT, startYOT);
          startYOT += lineHeightOT; // Adjust the vertical spacing if needed
        }
      };

      // Draw the table
      // drawTable();
      // for (let i = 0; i < arrayLength; i++) {

      //     drawTable(i);
      //     drawTableLeftHead(i);
      //     drawTableNumHead(i);
      //     drawTableSpSalary(i);
      //     drawTableMess(i);
      //     if ((i + 1) % 6 === 0 && i + 1 < arrayLength) {
      //         doc.addPage(); // Add a new page after every 6 iterations
      //     }
      // }

      // body table//////////////////////////////////////////////////////////////////////////////////////////////////////

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;

      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 262;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 268.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 275;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 281.5;
      }
      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };

      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };
      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            const x =
              startXSpSalary + j * cellWidthSpSalary + cellWidthSpSalary * 8;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 2; j++) {
            const x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
          }
        }
      };

      const drawTableMessTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthMess, cellHeightTop);
          }
        }
      };
      const verticalDistance = 24.7 + cellHeight; // Set your desired vertical distance

      // const drawArrayText = (dataArray) => {
      //     const arrayText = dataArray.map(row => row.join(' ')).join('\n');
      //     doc.text(arrayText, startX, startY, { align: 'left' });
      // };

      const calculateElementWidth = (element) => {
        const fontSize = doc.internal.getFontSize();
        const elementWidth =
          (element.toString().length * fontSize) / doc.internal.scaleFactor;
        return elementWidth;
      };

      // แสดงตารางวันทำงานธรรมดา
      const drawArrayText = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานธรรมดาช.ใ.
      const drawArrayTextAllTime = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.5 * 2;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            // const textToDraw = dataArray[i][j].toString();
            const textToDraw = newAllTimes[i][j].toString();

            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextSumWorkAddSalary = (
        dataArray,
        sumArray,
        filteredAddSalaryWorkplace
      ) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3;
          let currentY = startY + i * verticalDistance + addmove;

          const roundOfSalary =
            filteredAddSalaryWorkplace[i]?.roundOfSalary || ""; // Get roundOfSalary for the current index

          // Check roundOfSalary and display the appropriate text
          if (roundOfSalary === "monthly") {
            doc.text(
              filteredAddSalaryWorkplace[i].SpSalary,
              currentX + 2,
              3 + currentY,
              { align: "center" }
            );
          } else if (roundOfSalary === "daily") {
            // Calculate the product and convert it to a string
            const product = (
              sumArray[i] * filteredAddSalaryWorkplace[i].SpSalary
            ).toString();
            doc.text(product, currentX + 2, 3 + currentY + 3, {
              align: "center",
            });
          } else {
            // Handle other cases or set default text
            doc.text("N/A", currentX + 2, 3 + currentY, { align: "center" });
          }
        }
      };

      // const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
      //     const currentX = startX + columnIndex * cellWidth;
      //     const currentY = startY + 3.7 + rowIndex * verticalDistance;

      //     // Set color based on holidayList and allDayOff
      //     const currentNumber = resultArray[rowIndex];
      //     const isHighlighted = holidayList.includes(currentNumber) || allDayOff.includes(currentNumber);

      //     // Draw a colored rectangle for each column
      //     if (isHighlighted) {
      //         doc.setFillColor(255, 0, 0); // Set your desired color
      //         doc.rect(currentX, currentY, cellWidth, cellHeight, 'F');
      //     }

      //     // Draw the text on top of the colored rectangle
      //     for (let i = 0; i < dataArray.length; i++) {
      //         const textToDraw = dataArray[i].toString();
      //         const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

      //         if (textToDraw.length > 3) {
      //             doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
      //         } else {
      //             doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
      //         }
      //     }
      // };

      const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
        const currentX = startX + columnIndex * cellWidth;
        const currentY = startY + 3.7 + rowIndex * verticalDistance;

        // Set color based on holidayList and allDayOff
        const currentNumber = resultArray[columnIndex];
        const isHighlighted =
          holidayList.includes(currentNumber) ||
          allDayOff.includes(currentNumber);

        // Draw a colored rectangle for each column
        if (isHighlighted) {
          doc.setFillColor(255, 255, 0); // Set your desired color
          doc.rect(
            currentX,
            currentY - cellHeight,
            cellWidth,
            cellHeight * 8,
            "F"
          );
        }

        // Draw the text on top of the colored rectangle
        const textToDraw = dataArray[0].toString();
        const alignment =
          textToDraw.length > 3
            ? { align: "left", angle: 90, xOffset: 5 }
            : { align: "left" };

        if (textToDraw.length > 3) {
          doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
        } else {
          doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
        }
      };

      // const squareColor2 = [255, 255, 190]; // Red

      // doc.setFillColor(...squareColor2);

      // // Draw a square with the specified size and color
      // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

      // for (let i = 0; i < resultArray.length; i++) {
      //     const currentNumber = resultArray[i];

      //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
      //         // Set loop position color
      //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
      //     } else {
      //         // Set default color or do nothing
      //     }
      // }

      const drawArrayTextOT = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 + cellHeight * 2;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              6 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดธรรมดา
      const drawArrayTextHoli = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 4;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              4 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดนักขัตฤกษ์
      const drawArrayTextHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 5;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              5 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextOTHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 * 6;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              5 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextAddSalary = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 5;
          let currentY = startY + i * verticalDistance + addmove;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(dataArray[i][j].toString(), currentX + 2, 3 + currentY, {
              align: "left",
            });
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      // const drawArrayTextSumWork = (dataArray, sumArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3;
      //         let currentY = startY + i * verticalDistance;
      //         doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(sumArray[i].toString() * countalldaywork, currentX + 2, 3 + currentY +3, { align: 'center' });
      //     }
      // };

      const addmove = 3;
      // ผลรวมวันทำงานวันธรรรมดา
      const drawArrayTextSumWork = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 8;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (sumArray[i] * countalldaywork).toString();

          doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 11;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

          const position = filteredAddSalaryWorkplace.findIndex(
            (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
          );

          doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          doc.text(product, currentX + 2, 3 + currentY + 3, {
            align: "center",
          });
        }
      };
      // ผลรวมวันทำงานวันหยุด
      const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 9;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoli[i] *
            (1.5 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoli[i].toString(), currentX + 2, 6.5 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // นับเลขหัวตาราง

      const drawArrayNumHead = (dataArray, indexArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXNumHead + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            indexArray[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(indexArray[i].toString(), currentX + 2, currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์

      const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayHoliday[i].toString(),
            currentX + 2,
            10.5 + currentY,
            { align: "center" }
          );
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };
      // รวมช.ม.ทำงาน1.5
      const drawArrayTextSumWorkHoliday1q5 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoliday[i].toString(), currentX + 2, 14 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // รวมช.ม.ทำงาน2
      const drawArrayTextSumWorkHoliday2 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayHoliday[i].toString(),
            currentX + 2,
            17.5 + currentY,
            { align: "center" }
          );
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // รวมช.ม.ทำงาน3
      const drawArrayTextSumWorkHoliday3 = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 10;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayHoliday[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(sumArrayHoliday[i].toString(), currentX + 2, 21 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT
      const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 4;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            sumArrayOTHoliday[i] *
            (3 * (countalldaywork / 8))
          ).toString();

          doc.text(
            sumArrayOTHoliday[i].toString(),
            currentX + 2,
            3 + currentY,
            { align: "center" }
          );
          doc.text(product, currentX + 2, 3 + currentY + 3, {
            align: "center",
          });
        }
      };

      // const drawArrayTextAddSalary = (dataArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const position = filteredAddSalaryWorkplace.findIndex(
      //                 (salaryItem) => salaryItem.name === item.name
      //             );

      //             // const product = (sumArray[i] * countalldaywork).toString();

      //             // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
      //             const x = position !== -1 ? position : 0;

      //             const text = `${item.SpSalary}`;
      //             doc.text(text, currentX + 2 + (cellWidthSpSalary * x), 3 + currentY + i * verticalDistance, { align: 'center' });
      //             // currentX += cellWidthSpSalary;
      //         }
      //     }
      // };

      // const drawArrayTextSumWorkTest = (dataArray, sumArraySumarrayAllHoloday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY + i * verticalDistance + addmove;

      //         // Calculate the product and convert it to a string
      //         doc.text(sumArraySumarrayAllHoloday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //     }
      // };

      // sumArrayHoliday
      // sumArrayHoli
      // sumArray

      // const drawArrayTextAddSalary2 = (dataArray, filteredAddSalaryWorkplace, sumArraySumarrayAllHoloday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY + addmove;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const salaryItem = filteredAddSalaryWorkplace.find(salary => salary.name === item.name);

      //             if (salaryItem) {
      //                 // If roundOfSalary is "daily", multiply SpSalary by the corresponding value in sumArraySumarrayAllHoloday
      //                 // If roundOfSalary is "monthly", keep SpSalary as is
      //                 const adjustedSpSalary = salaryItem.roundOfSalary === 'daily' ?
      //                     salaryItem.SpSalary * sumArraySumarrayAllHoloday[i] :
      //                     salaryItem.SpSalary;

      //                 const text = `${adjustedSpSalary}`;
      //                 doc.text(text, currentX + 2, 3 + currentY + i * verticalDistance, { align: 'center' });
      //             }

      //             currentX += cellWidthSpSalary;
      //         }
      //     }
      // };

      // Use drawArrayTextAddSalary2 with the appropriate slices

      const drawArrayTextName = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 20;
          let currentY = startY + i * verticalDistance;

          for (let j = 0; j < dataArray[i].length; j++) {
            let xAdjustment = 0;
            let yAdjustment = 0;

            if (j === 0) {
              xAdjustment = -20;
            }
            if (j === 1) {
              xAdjustment = +10;
              yAdjustment = -3.5;
            }
            if (j === 2) {
              xAdjustment = +15;
              // yAdjustment = -3.5;
            }
            if (j === 3) {
              xAdjustment = +15;
              // yAdjustment = -3.5;
            }

            if (j === 4) {
              yAdjustment = 10.5;
            }
            doc.text(
              dataArray[i][j].toString(),
              // currentX + (j === 1 ? 0 : -10 || j === 0 ? -8 : 0 || j === 2 ? 5 : 0),  // Adjust the X-coordinate for the first row
              // 3 + currentY + (j === 2 ? -3.5 : 0 || j === 3 ? -3.5 : 0),  // Adjust the Y-coordinate for the second row
              currentX + xAdjustment, // Adjust the X-coordinate for the first row
              yAdjustment + currentY + 3, // Adjust the Y-coordinate for the second row
              { align: "left" }
            );
            currentY += 3.5;
          }
        }
      };

      // doc.addPage();
      // const lineHeight = 10;

      // const drawArray = (array, startY) => {
      //     for (let i = 0; i < array.length; i++) {
      //         if (i === 0) {
      //             const text = array[i].join(' ');
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         } else {
      //             const text = '(' + array[i].join(')') + '(';
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         }
      //     }
      // };

      // drawArray(arraylistNameEmp, startY);

      // drawArrayText(arraytest);
      // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {

      //     const title = ' ใบลงเวลาการปฏิบัติงาน';

      //     doc.setFont('THSarabunNew');
      //     doc.setFontSize(16);
      //     const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const pageWidth = doc.internal.pageSize.getWidth();
      //     const titleX = (pageWidth - titleWidth) / 2;
      //     doc.text(title, titleX, 10);

      //     // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

      //     doc.text(title, titleX, 30, { angle: 90 });

      //     const subTitle = workMonth; // Replace with your desired subtitle text
      //     doc.setFontSize(12); // You can adjust the font size for the subtitle
      //     const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const subTitleX = (pageWidth - subTitleWidth) / 2;
      //     // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      //     // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      //     // doc.autoTable({
      //     //     html: table,
      //     //     styles: stylestable,
      //     //     margin: { top: 30 },
      //     // });
      //     doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      //     // const CheckMonth = 2;
      //     // const CheckYear = 2023;

      //     // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

      //     // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      //     doc.setFontSize(8);
      //     doc.text(title, 171, 55, { angle: 90 });

      //     const pageStartIndex = dataarray;
      //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);

      //     for (let i = 0; i < 6; i++) {
      //         drawTableTop();
      //         drawTableLeftHeadTop();
      //         drawTableNumHeadTop();
      //         drawTableSpSalaryTop();
      //         drawTableMessTop();

      //         // drawTable(i);
      //         drawTableLeftHead(i);
      //         drawTableNumHead(i);
      //         drawTableSpSalary(i);
      //         drawTableMess(i);
      //         // roundpage++
      //     }
      //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
      //     doc.addPage();
      // }
      const title = "บริษัท โอวาท โปร แอนด์ ควิก จำกัด";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = "";

      const alldayworkHoliday = "รวมชั่วโมงทำงาน";
      const countalldayworkHoliday = "";
      const workOt = "1.5";
      const workOt2 = "2";
      const workOt3 = "3";

      // if (daysInMonth === 28) {
      //     startXMess = 245.5;
      // } else if (daysInMonth === 29) {
      //     startXMess = 249.5;
      // } else if (daysInMonth === 30) {
      //     startXMess = 253.75;
      // } else if (daysInMonth === 31) {
      //     startXMess = 257.75;
      // };
      const countalldayworkX = "340";
      const countalldayworkY = "340";

      const startDay = 21;
      // Create an array from startDay to daysInMonth
      const firstPart = Array.from(
        { length: daysInMonth - startDay + 1 },
        (_, index) => startDay + index
      );

      // Create an array from 1 to 20
      const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

      // Concatenate the two arrays
      const resultArray = [...firstPart, ...secondPart];

      const spaceWidth = 10;

      const makePage = Math.ceil(arrayWorkNormalDay.length / 5);

      for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {
        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

        // doc.text(title, titleX, 30, { angle: 90 });

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20); // Adjust the vertical position as needed

        // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

        // doc.autoTable({
        //     html: table,
        //     styles: stylestable,
        //     margin: { top: 30 },
        // });
        function getDaysInMonth(month, year) {
          // Months are 0-based, so we subtract 1 from the provided month
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          return lastDayOfMonth;
        }

        // const CheckMonth = 2;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
        doc.setFontSize(12);
        // doc.text(title, 171, 55, { angle: 90 });

        // const CheckMonth = 3;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // workplaceDataListAddSalary.map(item => item.SpSalary);
        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);
        doc.setFontSize(8);

        const pageStartIndex = pageIndex * 5;
        const pageEndIndex = Math.min((pageIndex + 1) * 5, arraytest.length);

        const squareColor2 = [255, 255, 190]; // Red

        doc.setFillColor(...squareColor2);

        // Draw a square with the specified size and color
        // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

        // for (let i = 0; i < resultArray.length; i++) {
        //     const currentNumber = resultArray[i];

        //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
        //         // Set loop position color
        //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
        //     } else {
        //         // Set default color or do nothing
        //     }
        // }

        // for (let i = pageStartIndex; i < pageEndIndex; i++) {
        //     const rowData = arrayWorkNormalDay[i];
        //     const color = i % 2 === 0 ? [240, 240, 100] : [255, 255, 255]; // Alternate row colors

        //     drawArrayTextWithColor(rowData, color, i - pageStartIndex);

        // }

        const pageStartIndexName = pageIndex * 5;
        const pageEndIndexName = Math.min(
          (pageIndex + 1) * 5,
          arrayWorkNormalDay.length
        );
        drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

        const squareColor = [255, 255, 0]; // Red
        doc.setFillColor(...squareColor);

        for (let i = 0; i < resultArray.length; i++) {
          const currentNumber = resultArray[i];

          if (
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber)
          ) {
            // Set loop position color
            doc.rect(
              startX + i * cellWidth,
              startYTop,
              cellWidth - 0.2,
              cellHeightTop,
              "F"
            );
          } else {
            // Set default color or do nothing
          }
        }

        for (let i = 0; i < resultArray.length; i++) {
          const x = startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        doc.text("ลำดับ", startXNumHead + 2, cellHeightTop + startYTop - 2);
        doc.text(
          "ชื่อ - นามสกุล",
          startXLeftHead + 10,
          cellHeightTop + startYTop - 2
        );

        doc.setFontSize(12);
        // let startXHeadTable; // Declare startXSpSalary before using it

        // if (daysInMonth === 28) {
        //     startXHeadTable = 0;
        // } else if (daysInMonth === 29) {
        //     startXHeadTable = 3;
        // } else if (daysInMonth === 30) {
        //     startXHeadTable = 6;
        // } else if (daysInMonth === 31) {
        //     startXHeadTable = 9;
        // };
        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2); // Adjust the vertical position as needed
        // doc.text(period, (startXSpSalary - 10), startYTop - 2);
        doc.setFontSize(8);

        // doc.text('โอที', startXSpSalary + (cellWidthSpSalary * 2) + 3, startYTop + 3);
        // doc.text('สวัสดีการ', startXSpSalary + (cellWidthSpSalary * 5) + 3, startYTop + 3);

        // doc.text('หักประกันสังคม 5%', startXMess - 5, cellHeightTop + startYTop - 1, { angle: 90 });

        doc.text("หมายเหตุ", startXMess + 3, cellHeightTop + startYTop - 2);

        // startXSpSalary + j * cellWidthSpSalary;
        // const y = startYTop

        for (let i = 0; i < 5; i++) {
          const dataIdx = pageIndex * 5 + i;
          if (dataIdx < arrayWorkNormalDay.length) {
            // Set the color of the square (RGB values)
            const squareColor = [255, 255, 0]; // Red

            // Set the position where you want to place the square
            const xPosition = 165.5;
            const yPosition = 30;

            // Set the fill color
            doc.setFillColor(...squareColor);

            // Draw a square with the specified size and color
            doc.rect(
              startXSpSalary + cellWidthSpSalary * 8,
              startYTop,
              cellWidthSpSalary * numColsSpSalary - 0.2,
              cellHeightTop,
              "F"
            );

            doc.text(
              alldaywork + " " + countalldaywork,
              5 + startXSpSalary + cellWidthSpSalary * 8,
              54.8,
              { angle: 90 }
            );
            doc.text(
              alldayworkHoliday + " " + countalldayworkHoliday,
              5 + startXSpSalary + cellWidthSpSalary * 9,
              54.8,
              { angle: 90 }
            );

            doc.text(
              "รวมชั่วโมงโอทีวันหยุด",
              3 + startXSpSalary + cellWidthSpSalary * 10,
              54.8,
              { angle: 90 }
            );
            // doc.text('รวมชั่วโมงโอที' + ' ' + workOt2 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 10), 54.8, { angle: 90 });

            // doc.text('วันนักขัตฤกษ์' + ' ' + workOt2 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });

            // for (let i = 0; i < workplaceDataListAddSalary.length; i++) {
            //     let currentX = startXSpSalary + 5 + (cellWidthSpSalary * 5) + (i * cellWidthSpSalary);
            //     let currentY = startY + verticalDistance + addmove;

            //     const item = workplaceDataListAddSalary[i];

            //     // Display the name and SpSalary
            //     doc.text(`${item.name}`, currentX + 2, 54.8, { align: 'center', angle: 90 });
            //     doc.text(`${item.SpSalary} .-`, currentX + 5, 54.8, { align: 'center', angle: 90 });

            // }
            // doc.text((340 * workOt2) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 2), 54.8, { angle: 90 });

            // doc.text('โอที' + ' ' + workOt + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });
            // doc.text((340 * workOt) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 3), 54.8, { angle: 90 });

            // doc.text('โอที' + ' ' + workOt3 + 'เท่า', 3 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });
            // doc.text((340 * workOt3) / 8 + ' .-', 7 + startXSpSalary + (cellWidthSpSalary * 4), 54.8, { angle: 90 });

            // doc.text(filteredAddSalaryWorkplace, 171, 54, { angle: 90 });
            // filteredAddSalaryWorkplace.forEach((item, index) => {
            //     const NameSp = `${item.name} ${item.SpSalary}`;
            //     let roundOfSalaryText = '';

            //     if (item.roundOfSalary === 'monthly') {
            //         roundOfSalaryText = 'เดือน';
            //     } else if (item.roundOfSalary === 'daily') {
            //         roundOfSalaryText = 'วัน';
            //     } doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            //     doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            // });

            drawTableTop();
            drawTableTopHead();
            drawTableLeftHeadTop();
            drawTableNumHeadTop();
            drawTableSpSalaryTop();
            // drawTableSpSalaryHeadTop();
            // drawTableMessTop();

            // drawTableOT();
            // drawTableOT(arraylistOT);

            // drawTableOT(arraylistOT);

            // for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const rowData = arrayWorkNormalDay[i];

            // Draw text with color for each column
            for (let j = 0; j < resultArray.length; j++) {
              drawArrayTextWithColor([rowData[j]], j, i);
            }
            // }
            drawTable(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
            drawTableLeftHead(
              i,
              arrayWorkNormalDay.slice(dataIdx, dataIdx + 1)
            );
            drawTableNumHead(i, arrayWorkNormalDay.slice(dataIdx, dataIdx + 1));
            drawTableSpSalary(
              i,
              arrayWorkNormalDay.slice(dataIdx, dataIdx + 1)
            );

          }
        }

        drawArrayTextAllTime(arrayAllTime.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));
        // 1.5
        drawArrayTextHoli(newAllTimes2.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoli(newOtTimes.slice(pageStartIndex, pageEndIndex));

        // 2
        drawArrayTextHoliday(newAllTimes3.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoliday(newOtTimes2.slice(pageStartIndex, pageEndIndex));
        // 3
        drawArrayTextOTHoliday(newOtTimes3.slice(pageStartIndex, pageEndIndex));

        drawArrayNumHead(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          indexArray.slice(pageStartIndex, pageEndIndex)
        );
        //วันเต็ม
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        //วันหารชั่วโมง+สักอย่าง
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArraySumarrayAllHolioday.slice(pageStartIndex, pageEndIndex));

        //วันหารชั่วโมง //วันเต็มทั้งหมด
        // drawArrayTextSumWork(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), dividedArray.slice(pageStartIndex, pageEndIndex));
        // countDay
        drawArrayTextSumWork(
          arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex),
          countDay.slice(pageStartIndex, pageEndIndex)
        );

        // drawArrayTextSumWorkOT(arrayWorkNormalDay.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
        // // รวมช.ม.ที่งานไม่รวมOT
        // drawArrayTextSumWorkHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex), sumArrayAllTime.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkHoli(
          arrayWorkHoli.slice(pageStartIndex, pageEndIndex),
          sumArrayAllHourWork.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayTextSumWorkHoliday(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTAllTime.slice(pageStartIndex, pageEndIndex)
        );

        // 1.5
        // drawArrayTextSumWorkHoliday1q5(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumHoliAllTime.slice(pageStartIndex, pageEndIndex));
        // sumArrayTotal
        drawArrayTextSumWorkHoliday1q5(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayTotal.slice(pageStartIndex, pageEndIndex)
        );

        // 2
        // drawArrayTextSumWorkHoliday2(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex), sumArrayHoliday.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkHoliday2(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayHoliday.slice(pageStartIndex, pageEndIndex)
        );

        // 3
        drawArrayTextSumWorkHoliday3(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex)
        );
        // drawArrayTextSumWorkOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex), sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex));

        // resultArraySumAddSalary
        // drawArrayTextAddSalary(resultArraySumAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextSumWorkAddSalary(filteredAddSalaryWorkplace.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextSumWorkTest(filteredAddSalaryWorkplace.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextSumWorkTest(sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // สวัสดิการ
        // drawArrayTextSumWorkTest(sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex), sumArraySumarrayAllHoloday.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextAddSalary(arraytest.slice(pageStartIndex, pageEndIndex), extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayText(arraytest, pageIndex * 6, Math.min((pageIndex + 1) * 6, arraytest.length));

        // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {
        //     const pageStartIndex = dataarray;
        //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);
        //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
        // }

        // for (let pageIndex = 0; pageIndex < makePage; pageIndex++)
        const formattedDate = workDate.toLocaleDateString("en-GB"); // Use 'en-GB' to get the "day/month/year" format

        doc.text(
          codePage +
          "" +
          formattedDate +
          "" +
          (pageIndex + 1) +
          " of " +
          makePage,
          250,
          210
        );

        if (pageIndex < makePage - 1) {
          doc.addPage();
        }
        // doc.text('pageStartIndex', 10 + 10, 10 + 10 - 2);

        // doc.addPage();
      }
      // If an error occurs, throw an exception
      // doc.save('your_table.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      // Display an alert with the error message
      alert(`Error: ${error.message}`);

      // Optionally, log the error to the console
      console.error(error);

      // If you want to prevent the page from reloading, you can return or throw the error
      // throw error;
      // return;
    }
  };

  //////////////////////////////////////////////////

  const generatePDFTest123Old = (event) => {
    event.preventDefault();
    try {
      // Your code here
      // handleEmployeeFilter();
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const table = tableRef.current;
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: "THSarabunNew",
        fontStyle: "normal",
        fontSize: 10,
      };

      const arraytestSpSalary = [
        [
          "",
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          2,
          0.5,
        ],
        [2, 2, 2, 2, 2, "", 2, "", 2],
        [2, "", 2, 2, "", 2, 3, "", 3, 3],
        [3, 3, 3, "", 3, 3, 3, 3],
        [3, "", 3, "", 3, 3, 3, 1, "", 1],
        [3, 3, "", 1, 1, "", 1, 3, 3],
        [3, 3, "", 3, "", 3, 3, 3, 3, "", 1, "", 1, 0.5, 0.5, 1.5],
      ];

      const arraylistOT = ["1.5", "2", "3"];

      // const arrayLength = arraylistNameEmp.length;
      const arrayLength = 9;
      // Set title with the Thai font
      // const makePage = Math.ceil(arrayLength / 6);
      let roundpage = 0;

      // for (let page = 0; page < makePage; page++) {
      // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      // doc.autoTable({
      //     html: table,
      //     styles: stylestable,
      //     margin: { top: 30 },
      // });

      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      doc.setFontSize(8);
      // doc.text(title, 171, 55, { angle: 90 });

      // const CheckMonth = 2;
      // const CheckYear = 2023;

      // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);
      // const daysInMonth = 30;
      // doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      const numRows = 7;
      const numCols = daysInMonth;
      const cellWidth = 4.125;
      const cellHeight = 3.5;
      const startX = 35; // Adjust the starting X-coordinate as needed
      const startY = 55; // Adjust the starting Y-coordinate as needed
      const borderWidth = 0.5; // Adjust the border width as needed

      // Function to draw a cell with borders
      const drawCell = (x, y, width, height) => {
        doc.rect(x, y, width, height);
      };

      // Function to draw the entire table
      // const drawTable = () => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight;
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };

      // const drawTable = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numCols; j++) {
      //             const x = startX + j * cellWidth;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2);
      //             drawCell(x, y, cellWidth, cellHeight);
      //         }
      //     }
      // };
      // const additionalHeight = 3;

      const drawTable = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // Increase the height for the first row
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            // const adjustedCellY = i === 0 ? y : y * 2;

            if (i === 0) {
              drawCell(x, y, cellWidth, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidth, adjustedCellHeight);
            }
            // drawCell(x, y , cellWidth, adjustedCellHeight);
          }
        }
      };

      const drawArrayNumHead = (dataArray, indexArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXNumHead + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          const product = (
            indexArray[i] *
            (2 * (countalldaywork / 8))
          ).toString();

          doc.text(indexArray[i].toString(), currentX + 2, currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
        }
      };

      const numRowsLeftHead = 7;
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 30;
      const cellHeightLeftHead = 3.5;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed
      // const startYLeftHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthLeftHead = 0.5; // Adjust the border width as needed

      // 02/04/2024
      // const drawTableLeftHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsLeftHead; j++) {
      //             const x = startXLeftHead + j * cellWidthLeftHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthLeftHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

      //             }

      //             if (i >= numRows - 3) {
      //                 const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
      //                 if (arraylistOT[arrayIndex]) {
      //                     const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
      //                     doc.text("โอที " + cellText, x + 26, y - 1, { align: 'center' }); // Use the entire cellText
      //                 }
      //             }
      //         }
      //     }
      // };

      const drawTableLeftHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthLeftHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthLeftHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthLeftHead, adjustedCellHeight);

            // if (i >= numRows - 3) {
            //     const arrayIndex = i - (numRows - 3); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text("โอที " + cellText, x + 46, y + 2.5, { align: 'center' }); // Use the entire cellText
            //     }
            // }
            const cellText0 = arraylistOT[0].toString(); // Convert to string if needed
            const cellText1 = arraylistOT[1].toString(); // Convert to string if needed
            const cellText2 = arraylistOT[2].toString(); // Convert to string if needed

            doc.text("โอที " + cellText0, x + 26, y - 1 + 3.5 * 5, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText1, x + 26, y - 1 + 3.5 * 6, {
              align: "center",
            }); // Use the entire cellText
            doc.text("โอที " + cellText2, x + 26, y - 1 + 3.5 * 7, {
              align: "center",
            }); // Use the entire cellText
          }
        }
      };

      const numRowsNumHead = 7;
      const numColsNumHead = 1;
      const cellWidthNumHead = 8;
      const cellHeightNumHead = 3.5;
      const startXNumHead = 5; // Adjust the starting X-coordinate as needed
      // const startYNumHead = 20; // Adjust the starting Y-coordinate as needed
      const borderWidthNumHead = 0.5; // Adjust the border width as needed

      //02/04/2024
      // const drawTableNumHead = (tableNumber) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let j = 0; j < numColsNumHead; j++) {
      //             const x = startXNumHead + j * cellWidthNumHead;
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 3.7);
      //             // drawCell(x, y, cellWidthNumHead, cellHeight);
      //             const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

      //             if (i === 0) {
      //                 drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

      //             } else {
      //                 drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

      //             }
      //         }
      //     }
      // };

      const drawTableNumHead = (tableNumber) => {
        for (let i = 0; i < 1; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            // drawCell(x, y, cellWidthNumHead, cellHeight);
            // const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;
            const adjustedCellHeight = cellHeight * 8;

            // if (i === 0) {
            //     drawCell(x, y, cellWidthNumHead, adjustedCellHeight);

            // } else {
            //     drawCell(x, y + cellHeight, cellWidthNumHead, adjustedCellHeight);

            // }
            drawCell(x, y, cellWidthNumHead, adjustedCellHeight);
          }
        }
      };

      const numRowsSpSalary = 7;
      const numColsSpSalary = 12;
      const cellWidthSpSalary = 10;
      const cellHeightSpSalary = 3.5;
      const borderWidthSpSalary = 0.5; // Adjust the border width as needed

      let startXSpSalary; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXSpSalary = 150.5;
      } else if (daysInMonth === 29) {
        startXSpSalary = 154.5;
      } else if (daysInMonth === 30) {
        startXSpSalary = 158.75;
      } else if (daysInMonth === 31) {
        startXSpSalary = 162.75;
      }

      const drawTableSpSalary = (tableNumber) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (j > 2) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }

            if (i === 0 && j < 2) {
              drawCell(x, y, cellWidthSpSalary, cellHeight * 2);
            } else if (i === 0 && j === 2) {
              drawCell(x, y, cellWidthSpSalary + 5, adjustedCellHeight);
            } else if (j === 2) {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary + 5,
                adjustedCellHeight
              );
            } else if (i === 0 && j > 2) {
              drawCell(x, y, cellWidthSpSalary, adjustedCellHeight);
            } else {
              drawCell(
                x,
                y + cellHeight,
                cellWidthSpSalary,
                adjustedCellHeight
              );
            }
          }
        }
      };

      const numRowsMess = 7;
      const numColsMess = 1;
      const cellWidthMess = 15;
      const cellHeightMess = 3.5;
      let startXMess; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXMess = 260.5;
      } else if (daysInMonth === 29) {
        startXMess = 264.5;
      } else if (daysInMonth === 30) {
        startXMess = 268.75;
      } else if (daysInMonth === 31) {
        startXMess = 272.75;
      }
      const borderWidthMess = 0.5;
      const drawTableMess = (tableNumber, arraylistOT) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y =
              startY +
              i * cellHeight +
              tableNumber * (numRows * cellHeight + 3.7);

            // Draw the cell
            // drawCell(x, y, cellWidthMess, cellHeight);
            const adjustedCellHeight = i === 0 ? cellHeight * 2 : cellHeight;

            if (i === 0) {
              drawCell(x, y, cellWidthMess, adjustedCellHeight);
            } else {
              drawCell(x, y + cellHeight, cellWidthMess, adjustedCellHeight);
            }

            // Add text below the last two cells
            // if (i >= numRows - 2) {
            //     const arrayIndex = i - (numRows - 2); // 0 for the last row, 1 for the second last row
            //     if (arraylistOT[arrayIndex]) {
            //         const cellText = arraylistOT[arrayIndex].toString(); // Convert to string if needed
            //         doc.text(cellText, x, y + cellHeight * (arrayIndex + 1), { align: 'center' });
            //     }
            // }
          }
        }
      };

      // const drawTableOT = (tableNumber, arraylistOT) => {
      //     for (let i = 0; i < numRows; i++) {
      //         for (let k = 0; k < arraylistOT.length; k++) {
      //             const x = startXMess; // Adjust the starting X-coordinate as needed
      //             const y = startY + i * cellHeight + tableNumber * (numRows * cellHeight + 0.2) + k * lineHeight;

      //             doc.text('โอที ' + arraylistOT[k], x, y, { align: 'left' });
      //         }
      //     }
      // };

      const drawTableOT = (arraylistOT) => {
        const startXOT = 10; // Adjust the starting X-coordinate for the OT text
        let startYOT = 10; // Adjust the starting Y-coordinate for the OT text
        const lineHeightOT = 10; // Adjust the vertical spacing between lines

        for (let k = 0; k < arraylistOT.length; k++) {
          doc.text("โอที " + arraylistOT[k], startXOT, startYOT);
          startYOT += lineHeightOT; // Adjust the vertical spacing if needed
        }
      };

      // Draw the table
      // drawTable();
      // for (let i = 0; i < arrayLength; i++) {

      //     drawTable(i);
      //     drawTableLeftHead(i);
      //     drawTableNumHead(i);
      //     drawTableSpSalary(i);
      //     drawTableMess(i);
      //     if ((i + 1) % 6 === 0 && i + 1 < arrayLength) {
      //         doc.addPage(); // Add a new page after every 6 iterations
      //     }
      // }

      // body table//////////////////////////////////////////////////////////////////////////////////////////////////////

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;
      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numCols; j++) {
            const x = startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 270.5;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 274.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 278.5;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 282.5;
      }

      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };
      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };
      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * cellHeightTop;

            if (j > 2) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }

            if (j == 2) {
              drawCell(x, y, cellWidthSpSalary + 5, cellHeightTop);
            } else {
              drawCell(x, y, cellWidthSpSalary, cellHeightTop);
            }
            // drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 2; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            // drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            if (j > 1) {
              x += 5; // Adjust x coordinate for columns after the 4th column
            }
            if (j == 1) {
              drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary + 5, 6);
            } else {
              drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            }
          }
        }
      };

      const drawTableMessTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsMess; j++) {
            const x = startXMess + j * cellWidthMess;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthMess, cellHeightTop);
          }
        }
      };
      const verticalDistance = 24.7 + cellHeight; // Set your desired vertical distance

      // const drawArrayText = (dataArray) => {
      //     const arrayText = dataArray.map(row => row.join(' ')).join('\n');
      //     doc.text(arrayText, startX, startY, { align: 'left' });
      // };

      const calculateElementWidth = (element) => {
        const fontSize = doc.internal.getFontSize();
        const elementWidth =
          (element.toString().length * fontSize) / doc.internal.scaleFactor;
        return elementWidth;
      };

      // แสดงตารางวันทำงานธรรมดา
      const drawArrayText = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextAfternoon = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7 * 1.8;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextNight = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX;
          let currentY = startY + 3.7 * 2.8;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 90, xOffset: 5 }
                : { align: "left" };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                alignment
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                alignment
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextWithColor = (dataArray, columnIndex, rowIndex) => {
        const currentX = startX + columnIndex * cellWidth;
        const currentY = startY + 3.7 + rowIndex * verticalDistance;

        // Set color based on holidayList and allDayOff
        const currentNumber = resultArray[columnIndex];
        const isHighlighted =
          holidayList.includes(currentNumber) ||
          allDayOff.includes(currentNumber);

        // Draw a colored rectangle for each column
        if (isHighlighted) {
          doc.setFillColor(255, 255, 0); // Set your desired color
          doc.rect(
            currentX,
            currentY - cellHeight,
            cellWidth,
            cellHeight * 8,
            "F"
          );
        }

        // Draw the text on top of the colored rectangle
        const textToDraw = dataArray[0].toString();
        const alignment =
          textToDraw.length > 3
            ? { align: "left", angle: 90, xOffset: 5 }
            : { align: "left" };

        // if (textToDraw.length > 3) {
        //     doc.text(textToDraw, currentX + 2, 3 + currentY, alignment);
        // } else {
        //     doc.text(textToDraw, currentX + 1, 3 + currentY, alignment);
        // }
      };

      // const squareColor2 = [255, 255, 190]; // Red

      // doc.setFillColor(...squareColor2);

      // // Draw a square with the specified size and color
      // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

      // for (let i = 0; i < resultArray.length; i++) {
      //     const currentNumber = resultArray[i];

      //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
      //         // Set loop position color
      //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
      //     } else {
      //         // Set default color or do nothing
      //     }
      // }

      const drawArrayTextOT = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          // let currentY = startY + 3 + cellHeight;
          let currentY = startY + 3 * 4;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              4 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดธรรมดา
      const drawArrayTextHoli = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 3;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              4 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // แสดงตารางวันทำงานหยุดนักขัตฤกษ์
      const drawArrayTextHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startX - 1;
          let currentY = startY + 3 * 5;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();
            const alignment =
              textToDraw.length > 3
                ? { align: "left", angle: 45, xOffset: 5 }
                : { align: "left" };

            doc.text(
              textToDraw,
              currentX + 2,
              5 + currentY + i * verticalDistance,
              alignment
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      const drawArrayTextOTHoliday = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 1;
          let currentY = startY + 3 * 6;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            doc.text(
              dataArray[i][j].toString(),
              currentX + 2,
              5 + currentY + i * verticalDistance,
              { align: "left" }
            );
            // currentX += elementWidth + cellWidth;
            currentX += cellWidth;
          }
        }
      };

      // const drawArrayTextSumWork = (dataArray, sumArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3;
      //         let currentY = startY + i * verticalDistance;
      //         doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(sumArray[i].toString() * countalldaywork, currentX + 2, 3 + currentY +3, { align: 'center' });
      //     }
      // };

      const addmove = 3;
      // ผลรวมวันทำงานวันธรรรมดา
      const drawArrayTextSumWork = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArray[i] * countalldaywork).toString();
          // doc.text(sumArray[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });

          // const product = (countDayWork[i] * countalldaywork).toString();

          doc.text(countDayWork[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });

          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
          doc.text(
            amountCountDayWork[i].toString(),
            currentX + 2,
            3 + currentY + 3,
            { align: "center" }
          );
        }
      };
      // 1.5
      const drawArrayTextSumWorkOT = (dataArray, sumArrayOT) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayOT[i] * (countalldaywork / 8)).toString();

          // const product = (
          //   parseFloat(sumArrayOT[i]) *
          //   (workRateWorkplaceStage1 * (countalldaywork / 8))
          // ).toFixed(2);

          // const position = filteredAddSalaryWorkplace.findIndex(
          //   (item) => item.codeSpSalary === dataArray[i][0].codeSpSalary
          // );

          //   doc.text(sumArrayOT[i].toString(), currentX + 2, 3 + currentY, {
          //     align: "center",
          //   });
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourOneFive[i].toString(), currentX + 2, 3 + currentY, {
          //   align: "center",
          // });
          // doc.text(
          //   amountOneFive[i].toString(),
          //   currentX + 2,
          //   3 + currentY + 3,
          //   {
          //     align: "center",
          //   }
          // );

          doc.text(
            `${amountOneFive[i].toString()} (${hourOneFive[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 4,
            {
              align: "center",
            }
          );
        }
      };
      // ผลรวมวันทำงานวันหยุด
      const drawArrayTextSumWorkHoli = (dataArray, sumArrayHoli) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 1;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayHoli[i] * (1.5 * (countalldaywork / 8))).toString();
          const product = (sumArrayHoli[i] * specialDayRate[i]).toString();

          // responseDataAll

          doc.text(sumArrayHoli[i].toString(), currentX + 2, 3 + currentY, {
            align: "center",
          });
          // doc.text(product, currentX + 2, 3 + currentY + 3, { align: 'center' });
          // doc.text(amountSpecialDay[i].toString(), currentX + 2, 3 + currentY + 3, { align: 'center' });
          // adjustedAmountSpecialDay
          doc.text(
            adjustedAmountSpecialDay[i].toString(),
            currentX + 2,
            3 + currentY + 3,
            { align: "center" }
          );
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์
      // 2 เท่า
      const drawArrayTextSumWorkHoliday = (dataArray, sumArrayHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and convert it to a string
          // const product = (sumArrayHoliday[i] * (2 * (countalldaywork / 8))).toString();
          // const product = (
          //   parseFloat(sumArrayHoliday[i]) *
          //   (workRateWorkplaceStage2 * (countalldaywork / 8))
          // ).toFixed(2);

          //   doc.text(sumArrayHoliday[i].toString(), currentX + 2, 3 + currentY, {
          //     align: "center",
          //   });
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourTwo[i].toString()`(`amountTwo[i].toString()`)`, currentX + 2, 3 + currentY+(3*4), {
          //   align: "center",
          // });
          // doc.text(amountTwo[i].toString(), currentX + 2, 3 + currentY + 3, {
          //   align: "center",
          // });
          doc.text(
            `${amountTwo[i].toString()} (${hourTwo[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 5,
            {
              align: "center",
            }
          );
        }
      };

      // ผลรวมวันทำงานวันหยุดนักขัตฤกษ์OT 3เท่า
      // const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 4);
      //         let currentY = startY + i * verticalDistance + addmove;

      //         // Calculate the product and convert it to a string
      //         const product = (sumArrayOTHoliday[i] * (3 * (countalldaywork / 8))).toString();

      //         doc.text(sumArrayOTHoliday[i].toString(), currentX + 2, 3 + currentY, { align: 'center' });
      //         doc.text(product.toFixed(2), currentX + 2, 3 + currentY + 3, { align: 'center' });
      //     }
      // };

      // 3 เท่า
      const drawArrayTextSumWorkOTHoliday = (dataArray, sumArrayOTHoliday) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 2;
          let currentY = startY + i * verticalDistance + addmove;

          // Calculate the product and format it to two decimal places
          // const product = (
          //   parseFloat(sumArrayOTHoliday[i]) *
          //   (workRateWorkplaceStage3 * (countalldaywork / 8))
          // ).toFixed(2);
          // Draw the sum and product, both formatted to two decimal places

          //   doc.text(
          //     parseFloat(sumArrayOTHoliday[i]).toFixed(2),
          //     currentX + 2,
          //     3 + currentY,
          //     { align: "center" }
          //   );
          //   doc.text(product, currentX + 2, 3 + currentY + 3, {
          //     align: "center",
          //   });

          // doc.text(hourThree[i].toString(), currentX + 2, 3 + currentY, {
          //   align: "center",
          // });
          // doc.text(amountThree[i].toString(), currentX + 2, 3 + currentY + 3, {
          //   align: "center",
          // });
          doc.text(
            `${amountThree[i].toString()} (${hourThree[i].toString()})`,
            currentX + 5,
            2 + currentY + 3 * 6,
            {
              align: "center",
            }
          );
        }
      };

      // const drawArrayTextAddSalary = (dataArray) => {
      //     for (let i = 0; i < dataArray.length; i++) {
      //         let currentX = startXSpSalary + 3 + (cellWidthSpSalary * 5);
      //         let currentY = startY;

      //         for (let j = 0; j < dataArray[i].length; j++) {
      //             const item = dataArray[i][j];

      //             // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
      //             const position = filteredAddSalaryWorkplace.findIndex(
      //                 (salaryItem) => salaryItem.name === item.name
      //             );

      //             // const product = (sumArray[i] * countalldaywork).toString();

      //             // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
      //             const x = position !== -1 ? position : 0;

      //             const text = `${item.SpSalary}`;
      //             doc.text(text, currentX + 2 + (cellWidthSpSalary * x), 3 + currentY + i * verticalDistance, { align: 'center' });
      //             // currentX += cellWidthSpSalary;
      //         }
      //     }
      // };
      const drawArrayTextAddSalary = (dataArray, sumArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startXSpSalary + 3 + cellWidthSpSalary * 5;
          let currentY = startY + addmove;

          for (let j = 0; j < dataArray[i].length; j++) {
            const item = dataArray[i][j];

            // Check if dataArray[i][j].name exists in filteredAddSalaryWorkplace
            const position = filteredAddSalaryWorkplace.findIndex(
              (salaryItem) => salaryItem.name === item.name
            );

            // If the position is found, use it as x; otherwise, use a default value (e.g., 0)
            const x = position !== -1 ? position : 0;

            // If roundOfSalary is "daily", multiply SpSalary by the corresponding value in sumArray
            // If roundOfSalary is "monthly", keep SpSalary as is
            const adjustedSpSalary =
              item.roundOfSalary === "daily"
                ? item.SpSalary * sumArray[i]
                : item.SpSalary;

            const text = `${adjustedSpSalary}`;
            doc.text(
              text,
              currentX + 2 + cellWidthSpSalary * x,
              3 + currentY + i * verticalDistance,
              { align: "center" }
            );
            // currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextAddSalaryTestCount = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startXSpSalary + cellWidthSpSalary * 4;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();

            // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                3 + currentY + i * verticalDistance,
                { align: "center" }
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                3 + currentY + i * verticalDistance,
                { align: "center" }
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextAddSalaryTest = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          // const arrayText = dataArray[i].join('      ');
          // const arrayText = dataArray[i].join('     '); // Use spaces to mimic the width
          let currentX = startXSpSalary + cellWidthSpSalary * 4;
          let currentY = startY + 3.7;

          for (let j = 0; j < dataArray[i].length; j++) {
            // const elementWidth = calculateElementWidth(dataArray[i][j]);
            const textToDraw = dataArray[i][j].toString();

            // const alignment = textToDraw.length > 3 ? { align: 'left', angle: 90, xOffset: 5 } : { align: 'left' };

            if (textToDraw.length > 3) {
              doc.text(
                textToDraw,
                currentX + 2,
                6 + currentY + i * verticalDistance,
                { align: "center" }
              );
            } else {
              doc.text(
                textToDraw,
                currentX + 1,
                6 + currentY + i * verticalDistance,
                { align: "center" }
              );
            }
            // doc.text(textToDraw, currentX + 2, 3 + currentY + i * verticalDistance, alignment);
            // currentX += elementWidth + cellWidth;
            currentX += cellWidthSpSalary;
          }
        }
      };

      const drawArrayTextName = (dataArray) => {
        for (let i = 0; i < dataArray.length; i++) {
          let currentX = startX - 13;
          let currentY = startY + i * verticalDistance;

          for (let j = 0; j < dataArray[i].length; j++) {
            let xAdjustment = 0;
            let yAdjustment = 0;

            if (j === 0) {
              xAdjustment = -8;
            }
            if (j === 1) {
              xAdjustment = -8;
            }
            if (j === 2) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }
            if (j === 3) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }
            if (j === 4) {
              xAdjustment = 8;
              yAdjustment = -3.5;
            }

            if (j === 5) {
              yAdjustment = 7;
            }
            doc.text(
              dataArray[i][j].toString(),
              // currentX + (j === 1 ? 0 : -10 || j === 0 ? -8 : 0 || j === 2 ? 5 : 0),  // Adjust the X-coordinate for the first row
              // 3 + currentY + (j === 2 ? -3.5 : 0 || j === 3 ? -3.5 : 0),  // Adjust the Y-coordinate for the second row
              currentX + xAdjustment, // Adjust the X-coordinate for the first row
              yAdjustment + currentY + 3, // Adjust the Y-coordinate for the second row
              { align: "left" }
            );
            currentY += 3.5;
          }
        }
      };

      // doc.addPage();
      // const lineHeight = 10;

      // const drawArray = (array, startY) => {
      //     for (let i = 0; i < array.length; i++) {
      //         if (i === 0) {
      //             const text = array[i].join(' ');
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         } else {
      //             const text = '(' + array[i].join(')') + '(';
      //             const y = startY + i * lineHeight;
      //             doc.text(text, 10, y);
      //         }
      //     }
      // };

      // drawArray(arraylistNameEmp, startY);

      // drawArrayText(arraytest);
      // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {

      //     const title = ' ใบลงเวลาการปฏิบัติงาน';

      //     doc.setFont('THSarabunNew');
      //     doc.setFontSize(16);
      //     const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const pageWidth = doc.internal.pageSize.getWidth();
      //     const titleX = (pageWidth - titleWidth) / 2;
      //     doc.text(title, titleX, 10);

      //     // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

      //     doc.text(title, titleX, 30, { angle: 90 });

      //     const subTitle = workMonth; // Replace with your desired subtitle text
      //     doc.setFontSize(12); // You can adjust the font size for the subtitle
      //     const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      //     const subTitleX = (pageWidth - subTitleWidth) / 2;
      //     // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      //     // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

      //     // doc.autoTable({
      //     //     html: table,
      //     //     styles: stylestable,
      //     //     margin: { top: 30 },
      //     // });
      //     doc.text('จำนวนวัน' + daysInMonth, 10, 10);

      //     // const CheckMonth = 2;
      //     // const CheckYear = 2023;

      //     // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

      //     // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
      //     doc.setFontSize(8);
      //     doc.text(title, 171, 55, { angle: 90 });

      //     const pageStartIndex = dataarray;
      //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);

      //     for (let i = 0; i < 6; i++) {
      //         drawTableTop();
      //         drawTableLeftHeadTop();
      //         drawTableNumHeadTop();
      //         drawTableSpSalaryTop();
      //         drawTableMessTop();

      //         // drawTable(i);
      //         drawTableLeftHead(i);
      //         drawTableNumHead(i);
      //         drawTableSpSalary(i);
      //         drawTableMess(i);
      //         // roundpage++
      //     }
      //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
      //     doc.addPage();
      // }
      const title = " ใบลงเวลาการปฏิบัติงาน";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = workplaceDataListWorkRate;

      const alldayworkHoliday = "วันหยุด";
      const countalldayworkHoliday = workplaceDataListWorkRate;
      const workOt = "1.5";
      const workOt2 = "2";
      const workOt3 = "3";
      // if (daysInMonth === 28) {
      //     startXMess = 245.5;
      // } else if (daysInMonth === 29) {
      //     startXMess = 249.5;
      // } else if (daysInMonth === 30) {
      //     startXMess = 253.75;
      // } else if (daysInMonth === 31) {
      //     startXMess = 257.75;
      // };
      const countalldayworkX = "340";
      const countalldayworkY = "340";

      const startDay = 21;
      // Create an array from startDay to daysInMonth
      const firstPart = Array.from(
        { length: daysInMonth - startDay + 1 },
        (_, index) => startDay + index
      );

      // Create an array from 1 to 20
      const secondPart = Array.from({ length: 20 }, (_, index) => index + 1);

      // Concatenate the two arrays
      const resultArray = [...firstPart, ...secondPart];

      const spaceWidth = 10;

      const makePage = Math.ceil(newAllTimes.length / 5);

      for (let pageIndex = 0; pageIndex < makePage; pageIndex++) {
        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        // const titleY = (doc.internal.pageSize.getHeight() - titleWidth) / 2;

        // doc.text(title, titleX, 30, { angle: 90 });

        // const subTitle = workMonth; // Replace with your desired subtitle text
        // doc.setFontSize(12); // You can adjust the font size for the subtitle
        // const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        // const subTitleX = (pageWidth - subTitleWidth) / 2;

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20); // Adjust the vertical position as needed

        // doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

        // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

        // doc.autoTable({
        //     html: table,
        //     styles: stylestable,
        //     margin: { top: 30 },
        // });

        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);

        function getDaysInMonth(month, year) {
          // Months are 0-based, so we subtract 1 from the provided month
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          return lastDayOfMonth;
        }

        // const CheckMonth = 2;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน' + daysInMonth, 10, 10);
        doc.setFontSize(8);
        doc.text(title, 171, 55, { angle: 90 });

        // const CheckMonth = 3;
        // const CheckYear = 2023;

        // const daysInMonth = getDaysInMonth(CheckMonth, CheckYear);

        // doc.text('จำนวนวัน ' + daysInMonth, 10, 10);

        const pageStartIndex = pageIndex * 5;
        const pageEndIndex = Math.min((pageIndex + 1) * 5, newAllTimes.length);

        const squareColor2 = [255, 255, 190]; // Red

        doc.setFillColor(...squareColor2);

        // Draw a square with the specified size and color
        // doc.rect(startX, startYTop, cellWidth - 0.2, cellHeightTop, 'F');

        // for (let i = 0; i < resultArray.length; i++) {
        //     const currentNumber = resultArray[i];

        //     if (holidayList.includes(currentNumber) || allDayOff.includes(currentNumber)) {
        //         // Set loop position color
        //         doc.rect(startX + i * cellWidth, startYTop + 80, cellWidth - 0.2, cellHeightTop, 'F');
        //     } else {
        //         // Set default color or do nothing
        //     }
        // }

        // for (let i = pageStartIndex; i < pageEndIndex; i++) {
        //     const rowData = arrayWorkNormalDayOld[i];
        //     const color = i % 2 === 0 ? [240, 240, 100] : [255, 255, 255]; // Alternate row colors

        //     drawArrayTextWithColor(rowData, color, i - pageStartIndex);

        // }

        const pageStartIndexName = pageIndex * 5;
        const pageEndIndexName = Math.min(
          (pageIndex + 1) * 5,
          newAllTimes.length
        );
        drawArrayTextName(arraylistNameEmp.slice(pageStartIndex, pageEndIndex));

        const squareColor = [255, 255, 0]; // Red
        doc.setFillColor(...squareColor);

        for (let i = 0; i < resultArray.length; i++) {
          const currentNumber = resultArray[i];

          if (
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber)
          ) {
            // Set loop position color
            doc.rect(
              startX + i * cellWidth,
              startYTop,
              cellWidth - 0.2,
              cellHeightTop,
              "F"
            );
          } else {
            // Set default color or do nothing
          }
        }

        for (let i = 0; i < resultArray.length; i++) {
          const x = startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        doc.text("ลำดับ", startXNumHead + 2, cellHeightTop + startYTop - 2);

        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2);

        doc.text(
          "ชื่อ - นามสกุล",
          startXLeftHead + 10,
          cellHeightTop + startYTop - 2
        );
        doc.text("วันหยุด", startXSpSalary + 11, startYTop + 3);
        doc.text(
          "โอที",
          startXSpSalary + cellWidthSpSalary * 2 + 3,
          startYTop + 3
        );
        doc.text(
          "สวัสดีการ",
          startXSpSalary + cellWidthSpSalary * 5 + 3,
          startYTop + 3
        );

        doc.text(
          "หักประกันสังคม 5%",
          startXMess - 5,
          cellHeightTop + startYTop - 1,
          { angle: 90 }
        );

        doc.text("หมายเหตุ", startXMess + 3, cellHeightTop + startYTop - 2);

        // startXSpSalary + j * cellWidthSpSalary;
        // const y = startYTop

        for (let i = 0; i < 5; i++) {
          const dataIdx = pageIndex * 5 + i;
          if (dataIdx < newAllTimes.length) {
            // Set the color of the square (RGB values)
            const squareColor = [255, 255, 0]; // Red

            // Set the position where you want to place the square
            const xPosition = 165.5;
            const yPosition = 30;

            // Set the fill color
            doc.setFillColor(...squareColor);

            // Draw a square with the specified size and color
            doc.rect(
              startXSpSalary,
              startYTop,
              cellWidthSpSalary * numColsSpSalary - 0.2 + 5,
              cellHeightTop,
              "F"
            );

            doc.text(
              alldaywork + " " + countalldaywork,
              5 + startXSpSalary,
              54.8,
              { angle: 90 }
            );
            doc.text(
              alldayworkHoliday + " " + countalldayworkHoliday,
              5 + startXSpSalary + cellWidthSpSalary,
              54.8,
              { angle: 90 }
            );
            // doc.text(
            //   "วันนักขัตฤกษ์" + " " + workRateWorkplaceStage2 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 2,
            //   54.8,
            //   { angle: 90 }
            // );
            doc.text(
              "เงินโอที",
              3 + startXSpSalary + cellWidthSpSalary * 2,
              54.8,
              { angle: 90 }
            );
            // doc.text(
            //   (workplaceDataListWorkRate * workRateWorkplaceStage2) / 8 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 2,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(
            //   "โอที" + " " + workRateWorkplaceStage1 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 3,
            //   54.8,
            //   { angle: 90 }
            // );
            // doc.text(
            //   (workplaceDataListWorkRate * workRateWorkplaceStage1) / 8 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 3,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(
            //   "โอที" + " " + workRateWorkplaceStage3 + "เท่า",
            //   3 + startXSpSalary + cellWidthSpSalary * 4,
            //   54.8,
            //   { angle: 90 }
            // );
            // doc.text(
            //   (workplaceDataListWorkRate / 8) * workRateWorkplaceStage3 + " .-",
            //   7 + startXSpSalary + cellWidthSpSalary * 4,
            //   54.8,
            //   { angle: 90 }
            // );

            // doc.text(filteredAddSalaryWorkplace, 171, 54, { angle: 90 });
            // filteredAddSalaryWorkplace.forEach((item, index) => {
            //     const NameSp = `${item.name} ${item.SpSalary}`;
            //     let roundOfSalaryText = '';

            //     if (item.roundOfSalary === 'monthly') {
            //         roundOfSalaryText = 'เดือน';
            //     } else if (item.roundOfSalary === 'daily') {
            //         roundOfSalaryText = 'วัน';
            //     } doc.text(NameSp, 5 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            //     doc.text('ต่อ ' + roundOfSalaryText, 8 + (cellWidthSpSalary * 5) + startXSpSalary + index * (cellWidthSpSalary), 54.8, { angle: 90 });
            // });

            filteredAddSalaryWorkplace.sort((a, b) =>
              a.name.localeCompare(b.name, "th")
            );

            let uniqueSalaries = [];

            // Create a Map to keep track of the lowest SpSalary for each codeSpSalary
            let salaryMap = new Map();

            // Iterate over the sorted array and populate the salaryMap
            for (let item of filteredAddSalaryWorkplace) {
              const { codeSpSalary, SpSalary } = item;
              const currentSpSalary = parseFloat(SpSalary);
              if (
                !salaryMap.has(codeSpSalary) ||
                currentSpSalary < salaryMap.get(codeSpSalary).SpSalary
              ) {
                salaryMap.set(codeSpSalary, {
                  ...item,
                  SpSalary: currentSpSalary,
                });
              }
            }

            // Convert the Map values to an array
            uniqueSalaries = Array.from(salaryMap.values());

            uniqueSalaries.forEach((item, index) => {
              const cleanedName = item.name
                .replace(/\(ไม่คิดปกส.\)/g, "")
                .trim();
              const NameSp = `${cleanedName} ${item.SpSalary}`;
              const CodeSp = `${item.codeSpSalary}`;

              let roundOfSalaryText = "";

              if (item.roundOfSalary === "monthly") {
                roundOfSalaryText = "เดือน";
              } else if (item.roundOfSalary === "daily") {
                roundOfSalaryText = "วัน";
              }
              doc.text(
                CodeSp,
                9 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                38,
                { align: "center" }
              );
              doc.text(
                NameSp,
                9 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                54.8,
                { angle: 90 }
              );
              doc.text(
                "ต่อ " + roundOfSalaryText,
                12 +
                cellWidthSpSalary * 3 +
                startXSpSalary +
                index * cellWidthSpSalary,
                54.8,
                { angle: 90 }
              );
            });

            drawTableTop();
            drawTableTopHead();
            drawTableLeftHeadTop();
            drawTableNumHeadTop();
            drawTableSpSalaryTop();
            drawTableSpSalaryHeadTop();
            // drawTableMessTop();

            // drawTableOT();
            // drawTableOT(arraylistOT);

            // drawTableOT(arraylistOT);

            // for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const rowData = newAllTimes[i];

            // Draw text with color for each column
            for (let j = 0; j < resultArray.length; j++) {
              drawArrayTextWithColor([rowData[j]], j, i);
            }
            // }

            drawTable(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableLeftHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableNumHead(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            drawTableSpSalary(i, newAllTimes.slice(dataIdx, dataIdx + 1));
            // drawTableMess(i, newAllTimes.slice(dataIdx, dataIdx + 1));

            // drawArrayText(arraytest, dataIdx, dataIdx + 1);

            // drawArrayText(arraytest.slice(dataIdx, dataIdx + 1));
          }
        }

        // drawArrayText(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex));

        //20/06/2024 drawArrayText(dayWorks.slice(pageStartIndex, pageEndIndex));
        drawArrayText(
          finalUpdatedDayWorksWorkMorningAndSS.slice(
            pageStartIndex,
            pageEndIndex
          )
        );

        drawArrayTextAfternoon(
          finalUpdatedDayWorksWorkAfternoon.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayTextNight(
          finalUpdatedDayWorksWorkNight.slice(pageStartIndex, pageEndIndex)
        );

        //สวัสดิการ
        drawArrayTextAddSalaryTestCount(
          adjustedDailyExtractedDataAddSalaryCount.slice(
            pageStartIndex,
            pageEndIndex
          )
        );
        drawArrayTextAddSalaryTest(
          adjustedDailyExtractedDataAddSalary.slice(
            pageStartIndex,
            pageEndIndex
          )
        );

        //สวัสดิการ
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));
        // drawArrayText(extractedDataAddSalary);

        // save17/06/2027
        // drawArrayTextOT(arrayWorkOTNormalDay.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoli(arrayWorkHoli.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoliday(arrayWorkHoliday.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextOTHoliday(arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex));

        // 1.5
        drawArrayTextOT(newAllTimes2.slice(pageStartIndex, pageEndIndex));
        drawArrayTextOT(newOtTimes.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextOT(newOtTimes2.slice(pageStartIndex, pageEndIndex));

        // drawArrayTextHoli(newOtTimes2.slice(pageStartIndex, pageEndIndex));

        // 2
        drawArrayTextHoliday(newAllTimes3.slice(pageStartIndex, pageEndIndex));
        drawArrayTextHoliday(newOtTimes2.slice(pageStartIndex, pageEndIndex));
        // 3
        drawArrayTextOTHoliday(newOtTimes3.slice(pageStartIndex, pageEndIndex));
        //
        // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArray.slice(pageStartIndex, pageEndIndex));

        // วันทำงาน
        // drawArrayTextSumWork(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOld.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextSumWork(newAllTimes.slice(pageStartIndex, pageEndIndex), countDayWork.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWork(
          newAllTimes.slice(pageStartIndex, pageEndIndex),
          amountCountDayWork.slice(pageStartIndex, pageEndIndex)
        );

        // ot 1.5
        // drawArrayTextSumWorkOT(arrayWorkNormalDayOld.slice(pageStartIndex, pageEndIndex), sumArrayOT.slice(pageStartIndex, pageEndIndex));
        drawArrayTextSumWorkOT(
          // newAllTimes.slice(pageStartIndex, pageEndIndex),
          sumArrayTotal.slice(pageStartIndex, pageEndIndex)
        );

        // วันหยุด เงินตรง
        drawArrayTextSumWorkHoli(
          arrayWorkHoli.slice(pageStartIndex, pageEndIndex),
          sumArrayHoli.slice(pageStartIndex, pageEndIndex)
        );
        // 2
        drawArrayTextSumWorkHoliday(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayHoliday.slice(pageStartIndex, pageEndIndex)
        );
        // 3
        drawArrayTextSumWorkOTHoliday(
          arrayWorkOTHoliday.slice(pageStartIndex, pageEndIndex),
          sumArrayOTHoliday.slice(pageStartIndex, pageEndIndex)
        );

        drawArrayNumHead(
          arrayWorkHoliday.slice(pageStartIndex, pageEndIndex),
          indexArray.slice(pageStartIndex, pageEndIndex)
        );

        // drawArrayTextAddSalary(arraytest.slice(pageStartIndex, pageEndIndex), extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));
        // drawArrayTextAddSalary(extractedDataAddSalary.slice(pageStartIndex, pageEndIndex));

        // drawArrayText(arraytest, pageIndex * 6, Math.min((pageIndex + 1) * 6, arraytest.length));

        // for (let dataarray = 0; dataarray < arraytest.length; dataarray += 6) {
        //     const pageStartIndex = dataarray;
        //     const pageEndIndex = Math.min(dataarray + 6, arraytest.length);
        //     drawArrayText(arraytest.slice(pageStartIndex, pageEndIndex));
        // }

        doc.addPage();
      }
      // If an error occurs, throw an exception
      // doc.save('your_table.pdf');
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      // Display an alert with the error message
      alert(`Error: ${error.message}`);

      // Optionally, log the error to the console
      console.error(error);

      // If you want to prevent the page from reloading, you can return or throw the error
      // throw error;
      // return;
    }
  };

  // const count = timerecordAllList.filter(employee =>
  //     employee.employee_workplaceRecord.some(record => record.workplaceId === "9999")
  // ).length;

  for (const employeeId in datesByEmployee) {
    const dates = datesByEmployee[employeeId];

    // Filter dates greater than or equal to 21
    const upperDates = dates.filter((date) => parseInt(date) <= 20);
    datesByEmployeeUpper[employeeId] = upperDates;
  }

  for (const employeeId in datesByEmployeeLower) {
    const dates = datesByEmployeeLower[employeeId];

    // Filter dates less than or equal to 20
    const lowerDates = dates.filter((date) => parseInt(date) >= 21);
    datesByEmployeeLower[employeeId] = lowerDates;
  }

  function createArrayWithDates(datesArray, resultArray) {
    const newArray = resultArray.map((day) =>
      datesArray.includes(day.toString()) ? day.toString() : ""
    );
    return newArray;
  }

  const newDatesWork = {};

  // Loop through each employee ID
  // for (const employeeId in datesByEmployeeLower) {
  //     // Concatenate the arrays for the current employee
  //     newDatesWork[employeeId] = [
  //         ...(datesByEmployeeUpper[employeeId] || []), // Handle the case where there is no upper array
  //         ...(datesByEmployeeLower[employeeId] || []), // Handle the case where there is no lower array
  //     ];
  // }

  for (const employeeId in datesByEmployeeLower) {
    // Concatenate the arrays for the current employee
    newDatesWork[employeeId] = [
      ...(datesByEmployee[employeeId] || []), // Handle the case where there is no upper array
      ...(datesByEmployeeLow[employeeId] || []), // Handle the case where there is no lower array
    ];
  }

  // Create new arrays for each employee
  const newDatesByEmployeeLower = {};
  // const newDatesByEmployeeUpper = {};

  for (const employeeId in newDatesWork) {
    const datesArrayLower = newDatesWork[employeeId];
    const newArrayLower = createArrayWithDates(datesArrayLower, resultArray);
    newDatesByEmployeeLower[employeeId] = newArrayLower;
  }

  const handleStaffIdChange = (e) => {
    const selectWorkPlaceId = e.target.value;
    // setWorkplacrId(selectWorkPlaceId);
    // setSearchEmployeeId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(
      (workplace) => workplace.workplaceId == selectWorkPlaceId
    );
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);

      // setWorkplacrName(selectedWorkplace.workplaceName);
      setSearchWorkplaceName(selectedWorkplace.workplaceName);
    } else {
      // setWorkplacrName('');
      setSearchWorkplaceName("");
    }
  };

  const handleStaffNameChange = (e) => {
    const selectWorkplaceName = e.target.value;

    // Find the corresponding employee and set the staffId and staffName
    const selectedEmployee = workplaceListAll.find(
      (workplace) => workplace.workplaceName == selectWorkplaceName
    );
    const selectedEmployeeFName = workplaceListAll.find(
      (workplace) => workplace.workplaceName === selectWorkplaceName
    );

    if (selectedEmployee) {
      // setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      // setWorkplacrName(selectedEmployee.workplaceName);
    } else {
      // setWorkplacrId('');
      // setSearchWorkplaceId('');
      // setWorkplacrName('');
    }
    // setWorkplacrName(selectWorkplaceName);
    setSearchWorkplaceName(selectWorkplaceName);
  };

  //////////////////////////////ทดลองตาราง8ใหม่//////////////////////////////////////////

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Helper function to generate a random employee ID in the format number1-3"-"number1-3
  const generateRandomEmployeeId = () => {
    const part1 = getRandomInt(1, 999).toString();
    const part2 = getRandomInt(1, 999).toString();
    return `${part1}-${part2}`;
  };

  // Arrays of sample names and last names
  const sampleNames = [
    "John",
    "Jane",
    "Alex",
    "Emily",
    "Chris",
    "Kate",
    "Michael",
    "Sarah",
    "David",
    "Laura",
    "Robert",
    "Olivia",
  ];

  const sampleLastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Wilson",
  ];

  // Helper function to generate a random name
  const generateRandomName = () => {
    const randomFirstName =
      sampleNames[getRandomInt(0, sampleNames.length - 1)];
    const randomLastName =
      sampleLastNames[getRandomInt(0, sampleLastNames.length - 1)];
    return randomFirstName + " " + randomLastName;
  };

  // Generate random employee data
  const generateRandomEmployeeData = (numEmployees) => {
    const employees = [];
    for (let i = 0; i < numEmployees; i++) {
      employees.push({
        name: generateRandomName(),
        employeeId: generateRandomEmployeeId(),
      });
    }
    return employees;
  };

  // Usage: Generate 5 random employees
  const extractedDatatest = generateRandomEmployeeData(10);

  const generateTestArray = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "1" : ""))
    );
  };
  const generateTestArrayspace = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "" : ""))
    );
  };

  const setEmptyArrays = (arrayData, numEmptyArrays = 2) => {
    const indexes = [...Array(arrayData.length).keys()];
    // Randomly select indices
    for (let i = 0; i < numEmptyArrays; i++) {
      if (indexes.length === 0) break; // Safety check
      const randomIndex = Math.floor(Math.random() * indexes.length);
      const indexToEmpty = indexes.splice(randomIndex, 1)[0];
      arrayData[indexToEmpty] = arrayData[indexToEmpty].map(() => "");
    }
  };

  const randomlyReplaceOnes = (arrayData, numToReplace = 2) => {
    // Flatten the array data into a single list
    const flatArray = arrayData.flat();

    // Get indices of all '1's in the flattened array
    const onesIndices = flatArray
      .map((val, index) => (val === "1" ? index : -1))
      .filter((index) => index !== -1);

    // Shuffle the indices to ensure random selection
    for (let i = onesIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [onesIndices[i], onesIndices[j]] = [onesIndices[j], onesIndices[i]];
    }

    // Replace a random number of '1's
    const indicesToReplace = onesIndices.slice(
      0,
      Math.min(numToReplace, onesIndices.length)
    );
    indicesToReplace.forEach((index) => {
      flatArray[index] = "399-158";
    });

    // Map the changes back to the original array structure
    let flatIndex = 0;
    arrayData.forEach((subArray, subArrayIndex) => {
      subArray.forEach((_, itemIndex) => {
        subArray[itemIndex] = flatArray[flatIndex++];
      });
    });
  };

  const generateTestTimeArray = (numArrays, arraySize) => {
    return Array.from({ length: numArrays }, () =>
      Array.from({ length: arraySize }, () => (Math.random() > 0.5 ? "8" : ""))
    );
  };

  const createEmptyArray = (numRows, numCols) => {
    return Array.from({ length: numRows }, () => Array(numCols).fill(""));
  };

  // Usage
  const numRows = 1; // Number of sub-arrays
  const numCols = 13; // Number of columns in each sub-array
  const emptyArray = createEmptyArray(numRows, numCols);

  console.log("emptyArray", emptyArray);

  // Define the size of each sub-array (e.g., days in a month)
  //   const daysInMonth = 29; // Adjust as necessary for your needs
  const numTestArrays = 10; // Number of test arrays to create

  // Generate test arrays for MorningAndSS, Afternoon, and Night shifts
  const finalUpdatedDayWorksWorkMorningAndSSTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );
  const finalUpdatedDayWorksWorkAfternoonTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );
  const finalUpdatedDayWorksWorkNightTest = generateTestArray(
    numTestArrays,
    daysInMonth
  );

  const newOtTimesTest = generateTestTimeArray(numTestArrays, daysInMonth);
  const newOtTimes2Test = generateTestTimeArray(numTestArrays, daysInMonth);
  const newOtTimes3Test = generateTestTimeArray(numTestArrays, daysInMonth);

  const newOtTimes3Testspace = generateTestArrayspace(
    numTestArrays,
    daysInMonth
  );

  setEmptyArrays(finalUpdatedDayWorksWorkMorningAndSSTest, 2);
  setEmptyArrays(finalUpdatedDayWorksWorkAfternoonTest, 2);
  setEmptyArrays(finalUpdatedDayWorksWorkNightTest, 2);

  setEmptyArrays(newOtTimesTest, 6);
  setEmptyArrays(newOtTimes2Test, 6);
  setEmptyArrays(newOtTimes3Test, 6);

  randomlyReplaceOnes(finalUpdatedDayWorksWorkMorningAndSSTest, 2);
  randomlyReplaceOnes(finalUpdatedDayWorksWorkAfternoonTest, 2);
  randomlyReplaceOnes(finalUpdatedDayWorksWorkNightTest, 2);

  const getRandomTwoDigitNumber = () => {
    return Math.floor(Math.random() * 90) + 10; // Random number between 10 and 99
  };

  // Function to generate the HourWork and SalaryWork arrays
  const generateHourAndSalaryData = (numEntries) => {
    const HourWork = [];
    const SalaryWork = [];

    const HourWork1 = [];
    const SalaryWork1 = [];
    const HourWork2 = [];
    const SalaryWork2 = [];
    const HourWork3 = [];
    const SalaryWork3 = [];

    for (let i = 0; i < numEntries; i++) {
      const hour = getRandomTwoDigitNumber();
      HourWork.push(hour);
      SalaryWork.push(hour * 2);
      HourWork1.push(hour);
      SalaryWork1.push(hour * 2);
      HourWork2.push(hour);
      SalaryWork2.push(hour * 2);
      HourWork3.push(hour);
      SalaryWork3.push(hour * 2);
    }

    return {
      HourWork,
      SalaryWork,
      HourWork1,
      SalaryWork1,
      HourWork2,
      SalaryWork2,
      HourWork3,
      SalaryWork3,
    };
  };

  // Generate the data for 10 entries
  const {
    HourWork,
    SalaryWork,
    HourWork1,
    SalaryWork1,
    HourWork2,
    SalaryWork2,
    HourWork3,
    SalaryWork3,
  } = generateHourAndSalaryData(10);


  //////////////////
  const countSpecificStrings = (row, lengthThreshold = 3) => {
    // Return true if any string in the row exceeds the length threshold
    return row.some((cell) => cell.length > lengthThreshold);
  };

  const generatePDF987New = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");
      doc.setFont("THSarabunNew");
      doc.setFontSize(8);

      const title = " ใบลงเวลาการปฏิบัติงาน";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = workplaceDataListWorkRate;

      const alldayworkHoliday = "วันหยุด";

      // Page and cell settings
      const pageHeight = 150; // Adjusted A4 page height in mm
      const cellWidth = 6.5;
      const cellHeight = 3.5;
      const startX = 35;
      const startY = 55;
      let currentY = startY; // Starting Y position
      let pageNumber = 1;

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;

      //   const drawTableTop = () => {
      //     for (let i = 0; i < numRowsTop; i++) {
      //       for (let j = 0; j < daysInMonth; j++) {
      //         const x = startX + j * cellWidth;
      //         const y = startYTop + i * cellHeightTop;
      //         drawCell(x, y, cellWidth, cellHeightTop);
      //       }
      //     }
      //   };
      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < daysInMonth; j++) {
            const x = 10 + startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            const currentNumber = resultArray[j]; // Get the number from resultArray

            // Check if the currentNumber is in holidayList or allDayOff
            const isHighlighted =
              holidayList.includes(currentNumber) ||
              allDayOff.includes(currentNumber);

            // Set the background color if the cell is highlighted
            if (isHighlighted) {
              doc.setFillColor(255, 255, 0); // Set your desired color (yellow)
              doc.rect(x, y, cellWidth, cellHeightTop, "F"); // Draw the filled rectangle
            }

            // Draw the cell border (or other content as needed)
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 257;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 263.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 267.5;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 271.5;
      }

      const startXNumHead = 5; // Adjust the starting X-coordinate as needed

      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 30;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed

      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };

      const numColsNumHead = 1;
      const cellWidthNumHead = 8;

      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };

      const numColsSpSalary = 3;
      const cellWidthSpSalary = 10;

      let startXSpSalary; // Declare startXSpSalary before using it

      // if (daysInMonth === 28) {
      //   startXSpSalary = 150.5;
      // } else if (daysInMonth === 29) {
      //   startXSpSalary = 154.6;
      // } else if (daysInMonth === 30) {
      //   startXSpSalary = 158.75;
      // } else if (daysInMonth === 31) {
      //   startXSpSalary = 162.75;
      // }
      if (daysInMonth === 28) {
        startXSpSalary = daysInMonth * cellWidth + 35;
      } else if (daysInMonth === 29) {
        startXSpSalary = daysInMonth * cellWidth + 35;
      } else if (daysInMonth === 30) {
        startXSpSalary = daysInMonth * cellWidth + 35;
      } else if (daysInMonth === 31) {
        startXSpSalary = daysInMonth * cellWidth + 35;
      }

      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = 10 + startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * cellHeightTop;

            // if (j > 2) {
            //   x += 5; // Adjust x coordinate for columns after the 4th column
            // }
            //
            // if (j == 2) {
            //   drawCell(x, y, cellWidthSpSalary + 5, cellHeightTop);
            // } else {
            //   drawCell(x, y, cellWidthSpSalary, cellHeightTop);
            // }
            drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 2; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            // if (j > 1) {
            //   x += 5; // Adjust x coordinate for columns after the 4th column
            // }
            // if (j == 1) {
            //   drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary + 5, 6);
            // } else {
            //   drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            // }
          }
        }
      };

      // Function to draw a cell with optional text rotation
      //   const drawCell = (x, y, width, height, content = "", rotate = false) => {
      //     doc.rect(x, y, width, height); // Draw the cell border

      //     if (rotate && content !== "") {
      //       // Save the graphics state to restore later
      //       doc.saveGraphicsState();

      //       // Translate the canvas to the center of the cell and rotate it
      //       doc.text(content, x + width + 2, y + height, {
      //         align: "center",
      //         angle: 90,
      //       });

      //       // Restore the previous graphics state
      //       doc.restoreGraphicsState();
      //     } else if (content !== "") {
      //       doc.text(content, x + width / 2, y + height / 2, { align: "center" });
      //     }
      //   };

      const drawCell = (
        x,
        y,
        width,
        height,
        content = "",
        rotate = false,
        drawBorder = true
      ) => {
        if (drawBorder) {
          doc.rect(x, y, width, height); // Draw the cell border
        }

        if (rotate && content !== "") {
          // Save the graphics state to restore later
          doc.saveGraphicsState();

          // Translate the canvas to the center of the cell and rotate it
          doc.text(content, x + width + 2, y + height, {
            align: "center",
            angle: 90,
          });

          // Restore the previous graphics state
          doc.restoreGraphicsState();
        } else if (content !== "") {
          doc.text(content, x + width / 2, y + height / 2, { align: "center" });
        }
      };

      const drawTableNumber = (
        tableNumber,
        y,
        height,
        label = "",
        countNumber
      ) => {
        const numberWidth = 40; // Width of the table number column
        const numberX = startX - cellWidthLeftHead; // Position for table number
        const content = label || tableNumber.toString();

        // Draw the cell without filling in text
        drawCell(numberX, y, numberWidth, height);

        // Text options
        const textOptions = {
          align: "left", // Align text to the left
          baseline: "top", // Set the baseline to the top
        };

        // Draw the count number at the top-left
        if (countNumber !== undefined) {
          doc.text(countNumber.toString(), numberX + 2, y + 2, textOptions);
        }

        // Position the label text within the cell
        doc.text(content, numberX + 9, y, textOptions); // Adjust x and y offsets for padding
      };

      const drawTableNumber123 = (tableNumber, y, height, label = "") => {
        const numberWidth = 30; // Width of the table number column
        const numberX = 10 + startX - cellWidthLeftHead; // Position for table number
        const content = label || tableNumber.toString();

        // Directly draw the text at the calculated position without a border
        if (content !== "") {
          doc.text(content, numberWidth + 12, y + height / 2 + 1, {
            align: "center",
          });
        }
      };

      // Function to check if a new page is needed
      const checkPageOverflow = (neededHeight) => {
        if (currentY + neededHeight > pageHeight) {
          doc.addPage();
          currentY = startY; // Reset the Y position on a new page
          pageNumber += 1;
        }
      };

      // Function to draw a row of data with rotation applied to long strings
      // const drawRow = (data, y, rowHeight) => {
      //   for (let j = 0; j < data.length; j++) {
      //     const x = startX + j * cellWidth;
      //     const rotate = data[j].length > 5; // Apply rotation if string length > 3
      //     drawCell(x, y, cellWidth, rowHeight, data[j], rotate);
      //   }
      // };
      //   const drawRow = (data, y, rowHeight) => {
      //     for (let j = 0; j < data.length; j++) {
      //       const x = startX + j * cellWidth;
      //       const rotate = data[j] && data[j].length > 5; // Check if data exists and length > 5
      //       drawCell(x, y, cellWidth, rowHeight, data[j] || "", rotate); // Use empty string if data[j] is undefined
      //     }
      //   };
      const drawRow = (data, y, rowHeight, rowIndex) => {
        for (let j = 0; j < data.length; j++) {
          const x = 10 + startX + j * cellWidth;
          const cellData = data[j] || ""; // Use empty string if data[j] is undefined
          const currentNumber = resultArray[j]; // Get the number from resultArray

          // Check if the currentNumber is in holidayList or allDayOff
          const isHighlighted =
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber);

          // Set the background color if the cell is highlighted
          if (isHighlighted) {
            doc.setFillColor(255, 255, 0); // Set your desired color (yellow)
            doc.rect(x, y, cellWidth, rowHeight, "F"); // Draw the filled rectangle
          }

          // Check if rotation is needed (if the text is longer than 5 characters)
          const rotate = cellData.length > 3;

          // Draw the text on top of the colored rectangle
          drawCell(x, y, cellWidth, rowHeight, cellData, rotate);
        }
      };

      // const drawSalaryRow = (data, y, rowHeight) => {
      //   for (let j = 0; j < data.length; j++) {
      //     const x = startX + daysInMonth * cellWidth;
      //     const rotate = data[j].length > 3; // Apply rotation if string length > 3
      //     drawCell(x, y, cellWidthSpSalary, rowHeight, data[j], rotate);
      //   }
      // };

      const drawSalaryRow = (data, y, rowHeight) => {
        const totalColumns = 3; // Number of columns to draw
        const offsetX = 10 + startX + daysInMonth * cellWidth; // Initial offset for salary cells

        for (let j = 0; j < totalColumns; j++) {
          const x = offsetX + j * cellWidthSpSalary; // Calculate x position for each cell
          const rotate = data[j] && data[j].length > 3; // Apply rotation if string length > 3
          drawCell(x, y, cellWidthSpSalary, rowHeight, data[j] || "", rotate);
        }
      };

      //   const drawAddSalaryCountRow = (data, y, rowHeight) => {
      //     // Set the x position to start at 5
      //     const startXPosition = startX + daysInMonth * cellWidth;
      //     for (let j = 0; j < data.length; j++) {
      //       // Calculating x position for each cell based on index
      //       const x = startXPosition + j * cellWidthSpSalary; // cellWidthSpSalary is width of salary cells
      //       const rotate = data[j].length > 20; // Apply rotation if string length > 3
      //       drawCell(
      //         x + cellWidthSpSalary * 2,
      //         y,
      //         cellWidthSpSalary,
      //         rowHeight,
      //         data[j],
      //         rotate
      //       );
      //     }
      //   };
      //   const drawAddSalaryRow = (data, y, rowHeight) => {
      //     // Set the x position to start at 5
      //     const startXPosition = startX + daysInMonth * cellWidth;
      //     for (let j = 0; j < data.length; j++) {
      //       // Calculating x position for each cell based on index
      //       const x = startXPosition + j * cellWidthSpSalary; // cellWidthSpSalary is width of salary cells
      //       const rotate = data[j].length > 20; // Apply rotation if string length > 3
      //       drawCell(
      //         x + cellWidthSpSalary * 2,
      //         y,
      //         cellWidthSpSalary,
      //         rowHeight,
      //         data[j],
      //         rotate
      //       );
      //     }
      //   };

      const drawAddSalaryCountRow = (data, y, rowHeight) => {
        const startXPosition = startX + daysInMonth * cellWidth;
        for (let j = 0; j < data.length; j++) {
          const x = startXPosition + j * cellWidthSpSalary;
          const rotate = data[j].length > 20;

          // Draw the text only, without borders
          drawCell(
            x + cellWidthSpSalary * 2,
            y + 1,
            cellWidthSpSalary,
            rowHeight,
            data[j],
            rotate,
            false // Pass a parameter to indicate no border
          );
        }
      };

      const drawAddSalaryRow = (data, y, rowHeight) => {
        const startXPosition = startX + daysInMonth * cellWidth;
        for (let j = 0; j < data.length; j++) {
          const x = startXPosition + j * cellWidthSpSalary;
          const rotate = data[j].length > 20;

          // Draw the text only, without borders
          drawCell(
            x + cellWidthSpSalary * 2,
            y,
            cellWidthSpSalary,
            rowHeight,
            data[j],
            rotate,
            false // Pass a parameter to indicate no border
          );
        }
      };

      const drawCellRight = (x, y, content) => {
        doc.text(content, x + 10, y, { align: "center" });
      };

      // Function to check if a row is empty
      const isRowEmpty = (row) => row.every((cell) => cell === "");

      // Get the maximum number of rows from all datasets
      const maxRows = Math.max(
        // finalUpdatedDayWorksWorkMorningAndSSTest.length,
        // finalUpdatedDayWorksWorkAfternoonTest.length,
        // finalUpdatedDayWorksWorkNightTest.length,
        // newOtTimesTest.length,
        // newOtTimes2Test.length,
        // newOtTimes3Test.length
        finalConsolidatedArray.length,
        finalUpdatedDayWorksWorkMorningAndSS.length,
        finalUpdatedDayWorksWorkAfternoon.length,
        finalUpdatedDayWorksWorkNight.length,
        newOtTimes.length,
        newOtTimes2.length,
        newOtTimes3.length,

        newAllTimes.length,
        newAllTimes2.length,
        newAllTimes3.length
      );

      let tableCounter = 1; // Initialize table number counter

      for (let i = 0; i < maxRows; i++) {
        const employeeData = arraylistNameEmp[i] || {
          name: "",
          employeeId: "",
        };
        const employeeInfo = `${employeeData.name}\n${employeeData.employeeId}`;

        // const morningData = finalUpdatedDayWorksWorkMorningAndSSTest[i] || Array(numCols).fill("");
        // const afternoonData = finalUpdatedDayWorksWorkAfternoonTest[i] || Array(numCols).fill("");
        // const nightData = finalUpdatedDayWorksWorkNightTest[i] || Array(numCols).fill("");
        // const newOtTimes = newOtTimesTest[i] || Array(numCols).fill("");
        // const newOtTimes2 = newOtTimes2Test[i] || Array(numCols).fill("");
        // const newOtTimes3 = newOtTimes3Test[i] || Array(numCols).fill("");

        const allDayWork =
          finalConsolidatedArray[i] || Array(numCols).fill("");
        const morningData =
          finalUpdatedDayWorksWorkMorningAndSS[i] || Array(numCols).fill("");
        const afternoonData =
          finalUpdatedDayWorksWorkAfternoon[i] || Array(numCols).fill("");
        const nightData =
          finalUpdatedDayWorksWorkNight[i] || Array(numCols).fill("");
        const OtTimes = newOtTimes[i] || Array(numCols).fill("");
        const OtTimes2 = newOtTimes2[i] || Array(numCols).fill("");
        const OtTimes3 = newOtTimes3[i] || Array(numCols).fill("");

        const AllTimes = newAllTimes[i] || Array(numCols).fill("");
        const AllTimes2 = newAllTimes2[i] || Array(numCols).fill("");
        const AllTimes3 = newAllTimes3[i] || Array(numCols).fill("");

        const newOtTimesspace =
          newOtTimes3Testspace[i] || Array(numCols).fill("");
        const emptyArraytest = emptyArray[i] || Array(numCols).fill("");

        const salaryCountData =
          adjustedDailyExtractedDataAddSalaryCount[i] ||
          Array(numCols).fill("");
        // const salaryData = adjustedDailyExtractedDataAddSalary[i] || Array(numCols).fill("");
        const salaryData = (
          adjustedDailyExtractedDataAddSalary[i] || Array(numCols).fill("")
        ).map((item) => {
          // Check if the item is a number, convert it to a string
          return item !== "" ? item.toString() : item;
        });
        const isAllDayWorkRowEmpty = isRowEmpty(allDayWork);
        const isMorningRowEmpty = isRowEmpty(morningData);
        const isAfternoonRowEmpty = isRowEmpty(afternoonData);
        const isNightRowEmpty = isRowEmpty(nightData);
        const isNewOtTimesTestRowEmpty = isRowEmpty(OtTimes);
        const isNewOtTimes2TestRowEmpty = isRowEmpty(OtTimes2);
        const isNewOtTimes3TestRowEmpty = isRowEmpty(OtTimes3);

        const isNewAllTimesTestRowEmpty = isRowEmpty(AllTimes);
        const isNewAllTimes2TestRowEmpty = isRowEmpty(AllTimes2);
        const isNewAllTimes3TestRowEmpty = isRowEmpty(AllTimes3);

        const isNewOtTimes3TestspaceRowEmpty = isRowEmpty(newOtTimesspace);
        const isEmptyArraytestRowEmpty = isRowEmpty(emptyArraytest);

        const isSalaryCountRowEmpty = isRowEmpty(salaryCountData);
        const isSalaryRowEmpty = isRowEmpty(salaryData);

        if (
          isAllDayWorkRowEmpty &&
          isMorningRowEmpty &&
          isAfternoonRowEmpty &&
          isNightRowEmpty &&
          isNewOtTimesTestRowEmpty &&
          isNewOtTimes2TestRowEmpty &&
          isNewOtTimes3TestRowEmpty &&
          isNewOtTimes3TestspaceRowEmpty
        ) {
          continue; // Skip empty rows
        }

        // Determine row heights based on content length
        const morningRowHeight = countSpecificStrings(morningData)
          ? cellHeight * 2
          : cellHeight;
        const afternoonRowHeight = countSpecificStrings(afternoonData)
          ? cellHeight * 2
          : cellHeight;
        const nightRowHeight = countSpecificStrings(nightData)
          ? cellHeight * 2
          : cellHeight;

        // Calculate the total height needed for this set of rows
        // const totalHeightNeeded =
        //   // (isMorningRowEmpty ? 0 : morningRowHeight ) +
        //   (isMorningRowEmpty ? 0 : morningRowHeight + cellHeight) +
        //   (isAfternoonRowEmpty ? 0 : afternoonRowHeight) +
        //   (isNightRowEmpty ? 0 : nightRowHeight) +
        //   (isNewOtTimesTestRowEmpty ? 0 : cellHeight * 2) +
        //   (isNewOtTimes2TestRowEmpty ? 0 : cellHeight * 2) +
        //   (isNewOtTimes3TestRowEmpty ? 0 : cellHeight * 2);

        const totalHeightNeeded =

          (isMorningRowEmpty ? 0 : morningRowHeight + cellHeight) +
          // (isAllDayWorkRowEmpty ? 0 : afternoonRowHeight) +
          (isAfternoonRowEmpty ? 0 : afternoonRowHeight) +
          (isNightRowEmpty ? 0 : nightRowHeight) +
          // Add height only if both conditions for each row are false
          (isNewOtTimesTestRowEmpty && isNewAllTimesTestRowEmpty
            ? 0
            : cellHeight * 2) +
          (isNewOtTimes2TestRowEmpty && isNewAllTimes2TestRowEmpty
            ? 0
            : cellHeight * 2) +
          (isNewOtTimes3TestRowEmpty && isNewAllTimes3TestRowEmpty
            ? 0
            : cellHeight * 2);

        // Check if we need to start a new page
        checkPageOverflow(totalHeightNeeded);

        // Draw table number for the entire set of rows
        // drawTableNumber("", currentY, totalHeightNeeded);
        // drawTableNumber("", currentY, totalHeightNeeded, employeeInfo);
        drawTableNumber("", currentY, totalHeightNeeded, employeeInfo, i + 1); // Pass the count number

        // if (!isMorningRowEmpty) {
        //   drawTableNumber123("", currentY, morningRowHeight, "กะเช้า");

        //   drawRow(morningData, currentY, morningRowHeight);
        //   currentY += morningRowHeight;
        // }

        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20);

        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2);

        // สี
        doc.setFontSize(8);
        const squareColor = [255, 255, 0]; // Red

        doc.setFillColor(...squareColor);

        // Draw a square with the specified size and color
        doc.rect(
          startXSpSalary + 10,
          startYTop,
          cellWidthSpSalary * numColsSpSalary - 0.2,
          cellHeightTop,
          "F"
        );

        doc.text(
          "รวมวันทำงาน " + workplaceDataListWorkRate,
          15 + startXSpSalary,
          54.8,
          { angle: 90 }
        );

        doc.text(
          "รวมชั่วโมงทำงาน ",
          15 + startXSpSalary + cellWidthSpSalary,
          54.8,
          { angle: 90 }
        );
        doc.text(
          "รวมชั่วโมงโอที ",
          15 + startXSpSalary + cellWidthSpSalary * 2,
          54.8,
          { angle: 90 }
        );

        let uniqueSalaries = [];

        // Create a Map to keep track of the lowest SpSalary for each codeSpSalary
        let salaryMap = new Map();

        // Iterate over the sorted array and populate the salaryMap
        for (let item of filteredAddSalaryWorkplace) {
          const { codeSpSalary, SpSalary } = item;
          const currentSpSalary = parseFloat(SpSalary);
          if (
            !salaryMap.has(codeSpSalary) ||
            currentSpSalary < salaryMap.get(codeSpSalary).SpSalary
          ) {
            salaryMap.set(codeSpSalary, {
              ...item,
              SpSalary: currentSpSalary,
            });
          }
        }

        drawTableTop();
        drawTableTopHead();
        // drawTableLeftHeadTop();
        drawTableNumHeadTop();
        drawTableSpSalaryTop();
        // drawTableSpSalaryHeadTop();

        for (let i = 0; i < resultArray.length; i++) {
          const x = 10 + startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        const rightX = 200; // Adjust this value based on your PDF width and margins

        // if (!isRowEmpty(salaryCountData)) {
        //   // Drawing salary data
        //   drawAddSalaryCountRow(salaryCountData, currentY, cellHeight);
        // }

        // if (!isRowEmpty(salaryData)) {
        //   // Drawing salary data
        //   drawAddSalaryRow(salaryData, currentY + morningRowHeight, cellHeight);
        // }

        // if (!isMorningRowEmpty) {
        drawTableNumber123("", currentY, cellHeight, "กะเช้า");
        //   drawRow(morningData, currentY, morningRowHeight);
        drawRow(morningData, currentY, morningRowHeight, i);
        drawCellRight(
          cellWidth * daysInMonth + 40,
          currentY + cellHeight / 2 + 1,
          countDayWork[i].toString()
        );
        // drawCellRight(
        //   cellWidth * daysInMonth + 59+cellWidthSpSalary,
        //   currentY + cellHeight / 2 + 1,
        //   sumArrayHoli[i].toString()
        // );
        drawSalaryRow(emptyArraytest, currentY, morningRowHeight);
        currentY += morningRowHeight;
        drawRow(newOtTimesspace, currentY, cellHeight);
        drawSalaryRow(emptyArraytest, currentY, cellHeight);
        drawCellRight(
          cellWidth * daysInMonth + 40 + cellWidthSpSalary,
          currentY + cellHeight / 2 + 1,
          countHourWork[i].toString()
        );
        // drawCellRight(
        //   cellWidth * daysInMonth + 59 + cellWidthSpSalary,
        //   currentY + cellHeight / 2 + 1,
        //   adjustedAmountSpecialDay[i].toString()
        // );
        currentY += cellHeight;
        // }

        if (!isAfternoonRowEmpty) {
          // drawTableNumber(tableCounter, currentY, afternoonRowHeight, "กะบ่าย");
          drawTableNumber123("", currentY, cellHeight, "กะบ่าย");

          drawRow(afternoonData, currentY, afternoonRowHeight);
          drawSalaryRow(emptyArraytest, currentY, afternoonRowHeight);

          currentY += afternoonRowHeight;
        }

        if (!isNightRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "กะดึก");

          drawRow(nightData, currentY, nightRowHeight);
          drawSalaryRow(emptyArraytest, currentY, nightRowHeight);

          currentY += nightRowHeight;
        }

        if (!isNewOtTimesTestRowEmpty || !isNewAllTimesTestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "1.5");

          // drawRow(newOtTimes, currentY, cellHeight);
          drawRow(OtTimes, currentY, cellHeight);
          // drawRow(AllTimes2, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellWidth * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourOneFive[i].toString()
          );
          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          // drawCellRight(
          //   cellWidth * daysInMonth + 59,
          //   currentY + cellHeight / 2 + 1,
          //   amountOneFive[i].toString()
          // );
          currentY += cellHeight;
        }

        if (!isNewOtTimes2TestRowEmpty || !isNewAllTimes2TestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "2");

          // drawRow(newOtTimes2, currentY, cellHeight);
          drawRow(OtTimes2, currentY, cellHeight);
          drawRow(AllTimes3, currentY, cellHeight);
          drawRow(AllTimes2, currentY, cellHeight);

          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellWidth * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourTwo[i].toString()
          );

          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          // drawCellRight(
          //   cellWidth * daysInMonth + 59,
          //   currentY + cellHeight / 2 + 1,
          //   amountTwo[i].toString()
          // );
          currentY += cellHeight;
        }

        if (!isNewOtTimes3TestRowEmpty || !isNewAllTimes3TestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "3");

          // drawRow(newOtTimes3, currentY, cellHeight);
          drawRow(OtTimes3, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellWidth * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourThree[i].toString()
          );

          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          // drawCellRight(
          //   cellWidth * daysInMonth + 59,
          //   currentY + cellHeight / 2 + 1,
          //   amountThree[i].toString()
          // );
          currentY += cellHeight;
        }

        tableCounter++; // Increment table number counter
      }

      // Output the PDF
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error(error);
    }
  };

  const generatePDF987 = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const fontPath = "/assets/fonts/THSarabunNew.ttf";

      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, "THSarabunNew", "normal");
      doc.setFont("THSarabunNew");
      doc.setFontSize(8);

      const title = " ใบลงเวลาการปฏิบัติงาน";
      const subTitle = "ใบแสดงเวลาปฏิบัติงาน"; // Replace with your desired subtitle text
      const TriTitle = "หน่วยงาน " + searchWorkplaceName; // Replace with your desired subtitle text

      const alldaywork = "รวมวันทำงาน";
      const countalldaywork = workplaceDataListWorkRate;

      const alldayworkHoliday = "วันหยุด";

      // Page and cell settings
      const pageHeight = 150; // Adjusted A4 page height in mm
      const cellWidth = 4.125;
      const cellHeight = 3.5;
      const startX = 35;
      const startY = 55;
      let currentY = startY; // Starting Y position
      let pageNumber = 1;

      const numRowsTop = 1;
      const startXTop = 50; // Adjust the starting X-coordinate as needed
      const startYTop = 30; // Adjust the starting Y-coordinate as needed
      const cellHeightTop = 25;

      //   const drawTableTop = () => {
      //     for (let i = 0; i < numRowsTop; i++) {
      //       for (let j = 0; j < daysInMonth; j++) {
      //         const x = startX + j * cellWidth;
      //         const y = startYTop + i * cellHeightTop;
      //         drawCell(x, y, cellWidth, cellHeightTop);
      //       }
      //     }
      //   };
      const drawTableTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < daysInMonth; j++) {
            const x = startX + j * cellWidth;
            const y = startYTop + i * cellHeightTop;
            const currentNumber = resultArray[j]; // Get the number from resultArray

            // Check if the currentNumber is in holidayList or allDayOff
            const isHighlighted =
              holidayList.includes(currentNumber) ||
              allDayOff.includes(currentNumber);

            // Set the background color if the cell is highlighted
            if (isHighlighted) {
              doc.setFillColor(255, 255, 0); // Set your desired color (yellow)
              doc.rect(x, y, cellWidth, cellHeightTop, "F"); // Draw the filled rectangle
            }

            // Draw the cell border (or other content as needed)
            drawCell(x, y, cellWidth, cellHeightTop);
          }
        }
      };

      const numRowsTopHead = 1;
      const startXTopHead = 1; // Adjust the starting X-coordinate as needed
      const startYTopHead = 24; // Adjust the starting Y-coordinate as needed
      const cellHeightTopHead = 6;
      // const cellWidthTopHead = 200;
      let cellWidthTopHead;
      if (daysInMonth === 28) {
        // 267
        cellWidthTopHead = 275.5;
      } else if (daysInMonth === 29) {
        cellWidthTopHead = 279.5;
      } else if (daysInMonth === 30) {
        cellWidthTopHead = 283.5;
      } else if (daysInMonth === 31) {
        cellWidthTopHead = 287.5;
      }

      const startXNumHead = 5; // Adjust the starting X-coordinate as needed

      const drawTableTopHead = () => {
        for (let i = 0; i < numRowsTopHead; i++) {
          // for (let j = 0; j < numCols; j++) {
          const x = startXNumHead + i * cellWidth;
          const y = startYTopHead + i * cellHeightTopHead;
          drawCell(x, y, cellWidthTopHead, cellHeightTopHead);
          // }
        }
      };
      const numColsLeftHead = 1;
      const cellWidthLeftHead = 30;
      const startXLeftHead = 5; // Adjust the starting X-coordinate as needed

      const drawTableLeftHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsLeftHead; j++) {
            const x = startXLeftHead + j * cellWidthLeftHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthLeftHead, cellHeightTop);
          }
        }
      };

      const numColsNumHead = 1;
      const cellWidthNumHead = 8;

      const drawTableNumHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsNumHead; j++) {
            const x = startXNumHead + j * cellWidthNumHead;
            const y = startYTop + i * cellHeightTop;
            drawCell(x, y, cellWidthNumHead, cellHeightTop);
          }
        }
      };

      const numColsSpSalary = 13;
      const cellWidthSpSalary = 10;

      let startXSpSalary; // Declare startXSpSalary before using it

      if (daysInMonth === 28) {
        startXSpSalary = 150.5;
      } else if (daysInMonth === 29) {
        startXSpSalary = 154.6;
      } else if (daysInMonth === 30) {
        startXSpSalary = 158.75;
      } else if (daysInMonth === 31) {
        startXSpSalary = 162.75;
      }

      const drawTableSpSalaryTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * cellHeightTop;

            // if (j > 2) {
            //   x += 5; // Adjust x coordinate for columns after the 4th column
            // }
            //
            // if (j == 2) {
            //   drawCell(x, y, cellWidthSpSalary + 5, cellHeightTop);
            // } else {
            //   drawCell(x, y, cellWidthSpSalary, cellHeightTop);
            // }
            drawCell(x, y, cellWidthSpSalary, cellHeightTop);
          }
        }
      };
      const drawTableSpSalaryHeadTop = () => {
        for (let i = 0; i < numRowsTop; i++) {
          for (let j = 0; j < numColsSpSalary - 3; j++) {
            let x = startXSpSalary + j * cellWidthSpSalary;
            const y = startYTop + i * 6;
            drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            // if (j > 1) {
            //   x += 5; // Adjust x coordinate for columns after the 4th column
            // }
            // if (j == 1) {
            //   drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary + 5, 6);
            // } else {
            //   drawCell(x + cellWidthSpSalary, y + 4, cellWidthSpSalary, 6);
            // }
          }
        }
      };

      // Function to draw a cell with optional text rotation
      //   const drawCell = (x, y, width, height, content = "", rotate = false) => {
      //     doc.rect(x, y, width, height); // Draw the cell border

      //     if (rotate && content !== "") {
      //       // Save the graphics state to restore later
      //       doc.saveGraphicsState();

      //       // Translate the canvas to the center of the cell and rotate it
      //       doc.text(content, x + width + 2, y + height, {
      //         align: "center",
      //         angle: 90,
      //       });

      //       // Restore the previous graphics state
      //       doc.restoreGraphicsState();
      //     } else if (content !== "") {
      //       doc.text(content, x + width / 2, y + height / 2, { align: "center" });
      //     }
      //   };

      const drawCell = (
        x,
        y,
        width,
        height,
        content = "",
        rotate = false,
        drawBorder = true
      ) => {
        if (drawBorder) {
          doc.rect(x, y, width, height); // Draw the cell border
        }

        if (rotate && content !== "") {
          // Save the graphics state to restore later
          doc.saveGraphicsState();

          // Translate the canvas to the center of the cell and rotate it
          doc.text(content, x + width + 2, y + height, {
            align: "center",
            angle: 90,
          });

          // Restore the previous graphics state
          doc.restoreGraphicsState();
        } else if (content !== "") {
          doc.text(content, x + width / 2, y + height / 2, { align: "center" });
        }
      };

      // const drawTableNumber = (tableNumber, y, height, label = "") => {
      //   const numberWidth = 30; // Width of the table number column
      //   const numberX = startX - cellWidthLeftHead; // Position for table number
      //   const content = label || tableNumber.toString();

      //   // Draw the cell without filling in text
      //   drawCell(numberX, y, numberWidth, height);

      //   // Text options
      //   const textOptions = {
      //     align: "left", // Align text to the left
      //     baseline: "top", // Set the baseline to the top
      //   };

      //   // Position the text within the cell
      //   doc.text(content, numberX + 9, y, textOptions); // Adjust x and y offsets for padding
      // };

      const drawTableNumber = (
        tableNumber,
        y,
        height,
        label = "",
        countNumber
      ) => {
        const numberWidth = 30; // Width of the table number column
        const numberX = startX - cellWidthLeftHead; // Position for table number
        const content = label || tableNumber.toString();

        // Draw the cell without filling in text
        drawCell(numberX, y, numberWidth, height);

        // Text options
        const textOptions = {
          align: "left", // Align text to the left
          baseline: "top", // Set the baseline to the top
        };

        // Draw the count number at the top-left
        if (countNumber !== undefined) {
          doc.text(countNumber.toString(), numberX + 2, y + 2, textOptions);
        }

        // Position the label text within the cell
        doc.text(content, numberX + 9, y, textOptions); // Adjust x and y offsets for padding
      };

      const drawTableNumber123 = (tableNumber, y, height, label = "") => {
        const numberWidth = 30; // Width of the table number column
        const numberX = startX - cellWidthLeftHead; // Position for table number
        const content = label || tableNumber.toString();

        // Directly draw the text at the calculated position without a border
        if (content !== "") {
          doc.text(content, numberWidth + 2, y + height / 2 + 1, {
            align: "center",
          });
        }
      };

      // Function to check if a new page is needed
      const checkPageOverflow = (neededHeight) => {
        if (currentY + neededHeight > pageHeight) {
          doc.addPage();
          currentY = startY; // Reset the Y position on a new page
          pageNumber += 1;
        }
      };

      // Function to draw a row of data with rotation applied to long strings
      // const drawRow = (data, y, rowHeight) => {
      //   for (let j = 0; j < data.length; j++) {
      //     const x = startX + j * cellWidth;
      //     const rotate = data[j].length > 5; // Apply rotation if string length > 3
      //     drawCell(x, y, cellWidth, rowHeight, data[j], rotate);
      //   }
      // };
      //   const drawRow = (data, y, rowHeight) => {
      //     for (let j = 0; j < data.length; j++) {
      //       const x = startX + j * cellWidth;
      //       const rotate = data[j] && data[j].length > 5; // Check if data exists and length > 5
      //       drawCell(x, y, cellWidth, rowHeight, data[j] || "", rotate); // Use empty string if data[j] is undefined
      //     }
      //   };
      const drawRow = (data, y, rowHeight, rowIndex) => {
        for (let j = 0; j < data.length; j++) {
          const x = startX + j * cellWidth;
          const cellData = data[j] || ""; // Use empty string if data[j] is undefined
          const currentNumber = resultArray[j]; // Get the number from resultArray

          // Check if the currentNumber is in holidayList or allDayOff
          const isHighlighted =
            holidayList.includes(currentNumber) ||
            allDayOff.includes(currentNumber);

          // Set the background color if the cell is highlighted
          if (isHighlighted) {
            doc.setFillColor(255, 255, 0); // Set your desired color (yellow)
            doc.rect(x, y, cellWidth, rowHeight, "F"); // Draw the filled rectangle
          }

          // Check if rotation is needed (if the text is longer than 5 characters)
          const rotate = cellData.length > 3;

          // Draw the text on top of the colored rectangle
          drawCell(x, y, cellWidth, rowHeight, cellData, rotate);
        }
      };

      // const drawSalaryRow = (data, y, rowHeight) => {
      //   for (let j = 0; j < data.length; j++) {
      //     const x = startX + daysInMonth * cellWidth;
      //     const rotate = data[j].length > 3; // Apply rotation if string length > 3
      //     drawCell(x, y, cellWidthSpSalary, rowHeight, data[j], rotate);
      //   }
      // };

      const drawSalaryRow = (data, y, rowHeight) => {
        const totalColumns = 13; // Number of columns to draw
        const offsetX = startX + daysInMonth * cellWidth; // Initial offset for salary cells

        for (let j = 0; j < totalColumns; j++) {
          const x = offsetX + j * cellWidthSpSalary - 0.1; // Calculate x position for each cell
          const rotate = data[j] && data[j].length > 3; // Apply rotation if string length > 3
          drawCell(x, y, cellWidthSpSalary, rowHeight, data[j] || "", rotate);
        }
      };

      //   const drawAddSalaryCountRow = (data, y, rowHeight) => {
      //     // Set the x position to start at 5
      //     const startXPosition = startX + daysInMonth * cellWidth;
      //     for (let j = 0; j < data.length; j++) {
      //       // Calculating x position for each cell based on index
      //       const x = startXPosition + j * cellWidthSpSalary; // cellWidthSpSalary is width of salary cells
      //       const rotate = data[j].length > 20; // Apply rotation if string length > 3
      //       drawCell(
      //         x + cellWidthSpSalary * 2,
      //         y,
      //         cellWidthSpSalary,
      //         rowHeight,
      //         data[j],
      //         rotate
      //       );
      //     }
      //   };
      //   const drawAddSalaryRow = (data, y, rowHeight) => {
      //     // Set the x position to start at 5
      //     const startXPosition = startX + daysInMonth * cellWidth;
      //     for (let j = 0; j < data.length; j++) {
      //       // Calculating x position for each cell based on index
      //       const x = startXPosition + j * cellWidthSpSalary; // cellWidthSpSalary is width of salary cells
      //       const rotate = data[j].length > 20; // Apply rotation if string length > 3
      //       drawCell(
      //         x + cellWidthSpSalary * 2,
      //         y,
      //         cellWidthSpSalary,
      //         rowHeight,
      //         data[j],
      //         rotate
      //       );
      //     }
      //   };

      const drawAddSalaryCountRow = (data, y, rowHeight) => {
        const startXPosition = startX + daysInMonth * cellWidth;
        for (let j = 0; j < data.length; j++) {
          const x = startXPosition + j * cellWidthSpSalary;
          const rotate = data[j].length > 20;

          // Draw the text only, without borders
          drawCell(
            x + cellWidthSpSalary * 2,
            y + 1,
            cellWidthSpSalary,
            rowHeight,
            data[j],
            rotate,
            false // Pass a parameter to indicate no border
          );
        }
      };

      const drawAddSalaryRow = (data, y, rowHeight) => {
        const startXPosition = startX + daysInMonth * cellWidth;
        for (let j = 0; j < data.length; j++) {
          const x = startXPosition + j * cellWidthSpSalary;
          const rotate = data[j].length > 20;

          // Draw the text only, without borders
          drawCell(
            x + cellWidthSpSalary * 2,
            y,
            cellWidthSpSalary,
            rowHeight,
            data[j],
            rotate,
            false // Pass a parameter to indicate no border
          );
        }
      };

      const drawCellRight = (x, y, content) => {
        doc.text(content, x, y, { align: "center" });
      };


      // Function to check if a row is empty
      const isRowEmpty = (row) => row.every((cell) => cell === "");

      // Get the maximum number of rows from all datasets
      const maxRows = Math.max(
        // finalUpdatedDayWorksWorkMorningAndSSTest.length,
        // finalUpdatedDayWorksWorkAfternoonTest.length,
        // finalUpdatedDayWorksWorkNightTest.length,
        // newOtTimesTest.length,
        // newOtTimes2Test.length,
        // newOtTimes3Test.length
        finalUpdatedDayWorksWorkMorningAndSS.length,
        finalUpdatedDayWorksWorkAfternoon.length,
        finalUpdatedDayWorksWorkNight.length,
        newOtTimes.length,
        newOtTimes2.length,
        newOtTimes3.length,

        newAllTimes.length,
        newAllTimes2.length,
        newAllTimes3.length
      );
      console.log('maxRows', maxRows);

      let tableCounter = 1; // Initialize table number counter

      for (let i = 0; i < maxRows; i++) {
        console.log('arraylistNameEmp[i]', arraylistNameEmp[i]);

        const employeeData = arraylistNameEmp[i] || {
          name: "",
          employeeId: "",
          costtype: "",
        };
        employeeData.costtype = employeeData.costtype || "";

        const employeeInfo = `${employeeData.name}\n${employeeData.employeeId}\n${employeeData.costtype}`;

        // const morningData = finalUpdatedDayWorksWorkMorningAndSSTest[i] || Array(numCols).fill("");
        // const afternoonData = finalUpdatedDayWorksWorkAfternoonTest[i] || Array(numCols).fill("");
        // const nightData = finalUpdatedDayWorksWorkNightTest[i] || Array(numCols).fill("");
        // const newOtTimes = newOtTimesTest[i] || Array(numCols).fill("");
        // const newOtTimes2 = newOtTimes2Test[i] || Array(numCols).fill("");
        // const newOtTimes3 = newOtTimes3Test[i] || Array(numCols).fill("");

        const allDayWork =
          finalConsolidatedArray[i] || Array(numCols).fill("");
        // console.log('allDayWork', allDayWork);
        const morningData =
          finalUpdatedDayWorksWorkMorningAndSS[i] || Array(numCols).fill("");
        updatedFinalMorningAndSS
        const morningDataUpdate =
          updatedFinalMorningAndSS[i] || Array(numCols).fill("");
        const afternoonData =
          finalUpdatedDayWorksWorkAfternoon[i] || Array(numCols).fill("");
        const nightData =
          finalUpdatedDayWorksWorkNight[i] || Array(numCols).fill("");
        const OtTimes = newOtTimes[i] || Array(numCols).fill("");
        const OtTimes2 = newOtTimes2[i] || Array(numCols).fill("");
        const OtTimes3 = newOtTimes3[i] || Array(numCols).fill("");

        const AllTimes = newAllTimes[i] || Array(numCols).fill("");
        const AllTimes2 = newAllTimes2[i] || Array(numCols).fill("");
        const AllTimes3 = newAllTimes3[i] || Array(numCols).fill("");

        const newOtTimesspace =
          newOtTimes3Testspace[i] || Array(numCols).fill("");
        const emptyArraytest = emptyArray[i] || Array(numCols).fill("");

        // const salaryCountData =
        //   adjustedDailyExtractedDataAddSalaryCount[i] ||
        //   Array(numCols).fill("");
        const salaryCountData =
          adjustedDailyExtractedDataAddSalaryCount[i] && adjustedDailyExtractedDataAddSalaryCount[i] !== undefined
            ? adjustedDailyExtractedDataAddSalaryCount[i]
            : Array(numCols).fill("");

        console.log('salaryCountData', salaryCountData);
        // const salaryData = adjustedDailyExtractedDataAddSalary[i] || Array(numCols).fill("");
        const salaryData = (
          adjustedDailyExtractedDataAddSalary[i] || Array(numCols).fill("")
        ).map((item) => {
          // Check if the item is a number, convert it to a string
          return item !== "" ? item.toString() : item;
        });
        console.log('salaryData', salaryData);
        const isAllDayWorkRowEmpty = isRowEmpty(allDayWork);
        const isMorningRowEmpty = isRowEmpty(morningData);
        const isAfternoonRowEmpty = isRowEmpty(afternoonData);
        const isNightRowEmpty = isRowEmpty(nightData);
        const isNewOtTimesTestRowEmpty = isRowEmpty(OtTimes);
        const isNewOtTimes2TestRowEmpty = isRowEmpty(OtTimes2);
        const isNewOtTimes3TestRowEmpty = isRowEmpty(OtTimes3);

        const isNewAllTimesTestRowEmpty = isRowEmpty(AllTimes);
        const isNewAllTimes2TestRowEmpty = isRowEmpty(AllTimes2);
        const isNewAllTimes3TestRowEmpty = isRowEmpty(AllTimes3);

        const isNewOtTimes3TestspaceRowEmpty = isRowEmpty(newOtTimesspace);
        const isEmptyArraytestRowEmpty = isRowEmpty(emptyArraytest);

        const isSalaryCountRowEmpty = isRowEmpty(salaryCountData);
        const isSalaryRowEmpty = isRowEmpty(salaryData);

        if (
          isAllDayWorkRowEmpty &&
          isMorningRowEmpty &&
          isAfternoonRowEmpty &&
          isNightRowEmpty &&
          isNewOtTimesTestRowEmpty &&
          isNewOtTimes2TestRowEmpty &&
          isNewOtTimes3TestRowEmpty &&
          isNewOtTimes3TestspaceRowEmpty
        ) {
          continue; // Skip empty rows
        }

        // Determine row heights based on content length
        const morningRowHeight = countSpecificStrings(morningData)
          ? cellHeight * 2
          : cellHeight;
        const allDayWorkRowHeight = countSpecificStrings(allDayWork)
          ? cellHeight * 2
          : cellHeight;
        const afternoonRowHeight = countSpecificStrings(afternoonData)
          ? cellHeight * 2
          : cellHeight;
        const nightRowHeight = countSpecificStrings(nightData)
          ? cellHeight * 2
          : cellHeight;

        // Calculate the total height needed for this set of rows
        // const totalHeightNeeded =
        //   // (isMorningRowEmpty ? 0 : morningRowHeight ) +
        //   (isMorningRowEmpty ? 0 : morningRowHeight + cellHeight) +
        //   (isAfternoonRowEmpty ? 0 : afternoonRowHeight) +
        //   (isNightRowEmpty ? 0 : nightRowHeight) +
        //   (isNewOtTimesTestRowEmpty ? 0 : cellHeight * 2) +
        //   (isNewOtTimes2TestRowEmpty ? 0 : cellHeight * 2) +
        //   (isNewOtTimes3TestRowEmpty ? 0 : cellHeight * 2);

        const totalHeightNeeded =
          (isMorningRowEmpty ? 0 : morningRowHeight + cellHeight) +
          (afternoonRowHeight) +
          (isAfternoonRowEmpty ? 0 : afternoonRowHeight) +
          (isNightRowEmpty ? 0 : nightRowHeight) +
          // Add height only if both conditions for each row are false
          (isNewOtTimesTestRowEmpty && isNewAllTimesTestRowEmpty
            ? 0
            : cellHeight * 2) +
          (isNewOtTimes2TestRowEmpty && isNewAllTimes2TestRowEmpty
            ? 0
            : cellHeight * 2) +
          (isNewOtTimes3TestRowEmpty && isNewAllTimes3TestRowEmpty
            ? 0
            : cellHeight * 2);

        // Check if we need to start a new page
        checkPageOverflow(totalHeightNeeded);
        console.log('totalHeightNeeded', totalHeightNeeded);
        console.log('isMorningRowEmpty', isMorningRowEmpty);
        console.log('isAllDayWorkRowEmpty', isAllDayWorkRowEmpty);
        console.log('isAfternoonRowEmpty', isAfternoonRowEmpty);
        console.log('isNightRowEmpty', isNightRowEmpty);

        console.log('isNewOtTimesTestRowEmpty', isNewOtTimesTestRowEmpty);
        console.log('isNewOtTimes2TestRowEmpty', isNewOtTimes2TestRowEmpty);
        console.log('isNewOtTimes3TestRowEmpty', isNewOtTimes3TestRowEmpty);

        console.log('isNewAllTimesTestRowEmpty', isNewAllTimes2TestRowEmpty);
        console.log('isNewAllTimes2TestRowEmpty', isNewAllTimes2TestRowEmpty);
        console.log('isNewAllTimes3TestRowEmpty', isNewAllTimes3TestRowEmpty);

        // Draw table number for the entire set of rows
        // drawTableNumber("", currentY, totalHeightNeeded);
        // drawTableNumber("", currentY, totalHeightNeeded, employeeInfo);
        drawTableNumber("", currentY, totalHeightNeeded, employeeInfo, i + 1); // Pass the count number

        // if (!isMorningRowEmpty) {
        //   drawTableNumber123("", currentY, morningRowHeight, "กะเช้า");

        //   drawRow(morningData, currentY, morningRowHeight);
        //   currentY += morningRowHeight;
        // }

        doc.setFont("THSarabunNew");
        doc.setFontSize(16);
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);

        doc.setFontSize(12); // You can adjust the font size for the subtitle
        const subTitleWidth =
          (doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const subTitleX = (pageWidth - subTitleWidth) / 2;
        doc.text(subTitle, subTitleX, 15); // Adjust the vertical position as needed

        const workplaceid = workplaceDataList.map((item) => item.workplaceId);
        doc.text("แผนก " + workplaceid, 250, 10);
        const TriTitleWidth =
          (doc.getStringUnitWidth(TriTitle) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const TriTitleX = (pageWidth - TriTitleWidth) / 2;
        doc.text(TriTitle, TriTitleX, 20);

        const period =
          "งวดวันที่ 21 " +
          thaiMonthNameLower +
          " - 20 " +
          thaiMonthName +
          " พ.ศ. " +
          yearThai;
        const periodWidth =
          (doc.getStringUnitWidth(period) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const periodX = (pageWidth - periodWidth) / 2;
        doc.text(period, periodX, startYTop - 2);

        // สี
        doc.setFontSize(8);
        const squareColor = [255, 255, 0]; // Red

        doc.setFillColor(...squareColor);

        // Draw a square with the specified size and color
        doc.rect(
          startXSpSalary,
          startYTop,
          cellWidthSpSalary * numColsSpSalary - 0.2,
          cellHeightTop,
          "F"
        );

        doc.text(
          "วันหยุด " + workplaceDataListWorkRate,
          5 + startXSpSalary + cellWidthSpSalary,
          54.8,
          { angle: 90 }
        );
        doc.text(
          "ประกันสังคม ",
          5 + startXSpSalary + cellWidthSpSalary * 11,
          54.8,
          { angle: 90 }
        );
        doc.text(
          "ภาษี ",
          5 + startXSpSalary + cellWidthSpSalary * 12,
          54.8,
          { angle: 90 }
        );

        let uniqueSalaries = [];

        // Create a Map to keep track of the lowest SpSalary for each codeSpSalary
        let salaryMap = new Map();

        // Iterate over the sorted array and populate the salaryMap
        // for (let item of filteredAddSalaryWorkplace) {
        //   const { codeSpSalary, SpSalary } = item;
        //   const currentSpSalary = parseFloat(SpSalary);
        //   if (
        //     !salaryMap.has(codeSpSalary) ||
        //     currentSpSalary < salaryMap.get(codeSpSalary).SpSalary
        //   ) {
        //     salaryMap.set(codeSpSalary, {
        //       ...item,
        //       SpSalary: currentSpSalary,
        //     });
        //   }
        // }
        for (let item of filteredAddSalaryWorkplace) {
          const { codeSpSalary, SpSalary } = item;

          // Parse the current SpSalary value
          const currentSpSalary = parseFloat(SpSalary);

          // Standard salary comparison logic
          if (
            !salaryMap.has(codeSpSalary) ||
            currentSpSalary < salaryMap.get(codeSpSalary).SpSalary
          ) {
            salaryMap.set(codeSpSalary, {
              ...item,
              SpSalary: currentSpSalary,
            });
          }
        }

        // Check if leaveSalary exists and push the placeholder entry at the end
        if (leaveSalary) {
          salaryMap.set("1235", {
            SpSalary: "-",
            StaffType: "all",
            codeSpSalary: "1235",
            name: "เงินลา",
            nameType: "",
            roundOfSalary: "daily",
          });
        }

        // Convert the salaryMap back to an array to retain order
        const salaryArray = Array.from(salaryMap.values());

        // Ensure "เงินลา" is pushed to the end of the array
        if (leaveSalary) {
          salaryArray.push({
            SpSalary: "-",
            StaffType: "all",
            codeSpSalary: "1235",
            name: "เงินลา",
            nameType: "",
            roundOfSalary: "daily",
          });
        }

        // Convert the Map values to an array
        uniqueSalaries = Array.from(salaryMap.values());
        console.log('uniqueSalaries', uniqueSalaries);

        uniqueSalaries.forEach((item, index) => {
          const cleanedName = item.name.replace(/\(ไม่คิดปกส.\)/g, "").trim();
          const NameSp = `${cleanedName} ${item.SpSalary}`;
          const CodeSp = `${item.codeSpSalary}`;

          let roundOfSalaryText = "";

          if (item.roundOfSalary === "monthly") {
            roundOfSalaryText = "เดือน";
          } else if (item.roundOfSalary === "daily") {
            roundOfSalaryText = "วัน";
          }
          const fontSize = NameSp.length > 30 ? 4 : 8;
          doc.setFontSize(8);

          doc.text(
            CodeSp,
            4 +
            cellWidthSpSalary * 2 +
            startXSpSalary +
            index * cellWidthSpSalary,
            38,
            { align: "center" }
          );
          doc.setFontSize(fontSize);
          doc.text(
            NameSp,
            4 +
            cellWidthSpSalary * 2 +
            startXSpSalary +
            index * cellWidthSpSalary,
            54.8,
            { angle: 90 }
          );
          doc.text(
            "ต่อ " + roundOfSalaryText,
            7 +
            cellWidthSpSalary * 2 +
            startXSpSalary +
            index * cellWidthSpSalary,
            54.8,
            { angle: 90 }
          );
        });
        doc.setFontSize(8);

        drawTableTop();
        drawTableTopHead();
        drawTableLeftHeadTop();
        drawTableNumHeadTop();
        drawTableSpSalaryTop();
        drawTableSpSalaryHeadTop();

        for (let i = 0; i < resultArray.length; i++) {
          const x = startX + i * cellWidth;
          doc.text(
            resultArray[i].toString(),
            x + 1,
            cellHeightTop + startYTop - 2
          );
        }

        const rightX = 200; // Adjust this value based on your PDF width and margins


        // if (!isMorningRowEmpty) {
        drawTableNumber123("", currentY, cellHeight, "กะเช้า");
        //   drawRow(morningData, currentY, morningRowHeight);

        // drawRow(morningData, currentY, morningRowHeight, i);
        drawRow(morningDataUpdate, currentY, morningRowHeight, i);

        // drawCellRight(
        //   cellHeight * daysInMonth + 59,
        //   currentY + cellHeight / 2 + 1,
        //   countDayWork[i].toString()
        // );

        drawCellRight(
          cellHeight * daysInMonth + 59 + cellWidthSpSalary * 12,
          currentY + cellHeight / 2 + 1,
          saveCash[i].toString()
        );

        drawSalaryRow(emptyArraytest, currentY, morningRowHeight);
        // drawCellRight(
        //   cellHeight * daysInMonth + 59 + cellWidthSpSalary*12,
        //   currentY + cellHeight / 2 + 1,
        //   tax[i].toString()
        // );
        currentY += morningRowHeight;

        if (!isRowEmpty(salaryCountData)) {
          // Drawing salary data
          drawAddSalaryCountRow(salaryCountData, currentY, cellHeight);
        }

        // จำนวนเงินเพิ่ม
        if (!isRowEmpty(salaryData)) {
          // Drawing salary data
          drawAddSalaryRow(salaryData, currentY + morningRowHeight + 1, cellHeight);
        }

        drawCellRight(
          cellHeight * daysInMonth + 59 + cellWidthSpSalary,
          currentY + cellHeight / 2 + 1,
          sumArrayHoli[i].toString()
        );

        drawRow(allDayWork, currentY, cellHeight);
        drawSalaryRow(emptyArraytest, currentY, cellHeight);
        // drawCellRight(
        //   cellHeight * daysInMonth + 59,
        //   currentY + cellHeight / 2 + 1,
        //   amountCountDayWork[i].toString()
        // );

        drawCellRight(
          cellHeight * daysInMonth + 59,
          currentY + cellHeight / 2 + 1,
          countDayWork[i].toString()
        );

        // ประกันสังคม
        drawCellRight(
          cellHeight * daysInMonth + 59 + (cellWidthSpSalary * 11),
          currentY + cellHeight / 2 + 1,
          socialSecurity[i].toString()
        );

        drawCellRight(
          cellHeight * daysInMonth + 59 + (cellWidthSpSalary * 12),
          currentY + cellHeight / 2 + 1,
          tax[i].toString()
        );

        // drawCellRight(
        //   cellHeight * daysInMonth + 59 + cellWidthSpSalary,
        //   currentY + cellHeight / 2 + 1,
        //   adjustedAmountSpecialDay[i].toString()
        // );
        currentY += cellHeight;

        drawRow(newOtTimesspace, currentY, cellHeight);
        drawSalaryRow(emptyArraytest, currentY, cellHeight);

        drawCellRight(
          cellHeight * daysInMonth + 59,
          currentY + cellHeight / 2 + 1,
          amountCountDayWork[i].toString()
        );

        drawCellRight(
          cellHeight * daysInMonth + 59 + cellWidthSpSalary,
          currentY + cellHeight / 2 + 1,
          adjustedAmountSpecialDay[i].toString()
        );
        currentY += cellHeight;
        // }

        if (!isAfternoonRowEmpty) {
          // drawTableNumber(tableCounter, currentY, afternoonRowHeight, "กะบ่าย");
          drawTableNumber123("", currentY, cellHeight, "กะบ่าย");

          drawRow(afternoonData, currentY, afternoonRowHeight);
          drawSalaryRow(emptyArraytest, currentY, afternoonRowHeight);

          currentY += afternoonRowHeight;
        }

        if (!isNightRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "กะดึก");

          drawRow(nightData, currentY, nightRowHeight);
          drawSalaryRow(emptyArraytest, currentY, nightRowHeight);

          currentY += nightRowHeight;
        }

        if (!isNewOtTimesTestRowEmpty || !isNewAllTimesTestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "1.5");

          // drawRow(newOtTimes, currentY, cellHeight);
          drawRow(OtTimes, currentY, cellHeight);
          // drawRow(AllTimes2, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourOneFive[i].toString()
          );

          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            amountOneFive[i].toString()
          );
          currentY += cellHeight;
        }

        if (!isNewOtTimes2TestRowEmpty || !isNewAllTimes2TestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "2");

          // drawRow(newOtTimes2, currentY, cellHeight);
          drawRow(OtTimes2, currentY, cellHeight);
          drawRow(AllTimes3, currentY, cellHeight);
          drawRow(AllTimes2, currentY, cellHeight);

          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourTwo[i].toString()
          );

          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);
          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            amountTwo[i].toString()
          );

          currentY += cellHeight;
        }

        if (!isNewOtTimes3TestRowEmpty || !isNewAllTimes3TestRowEmpty) {
          drawTableNumber123("", currentY, cellHeight, "3");

          // drawRow(newOtTimes3, currentY, cellHeight);
          drawRow(OtTimes3, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            hourThree[i].toString()
          );

          currentY += cellHeight;
          drawRow(newOtTimesspace, currentY, cellHeight);
          drawSalaryRow(emptyArraytest, currentY, cellHeight);

          drawCellRight(
            cellHeight * daysInMonth + 59,
            currentY + cellHeight / 2 + 1,
            amountThree[i].toString()
          );
          currentY += cellHeight;
        }

        tableCounter++; // Increment table number counter
      }

      // Output the PDF
      const pdfContent = doc.output("bloburl");
      window.open(pdfContent, "_blank");
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error(error);
    }
  };

  //////////////////////
  const [date, setDate] = useState("");

  const handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    // Add slashes at the appropriate positions
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    }

    setDate(value);
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
              <a href="#"> ระบบเงินเดือน</a>
            </li>
            <li class="breadcrumb-item active">ตารางเวลาทำงานพนักงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i>{" "}
                  ตารางเวลาทำงานพนักงาน
                </h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
<!-- Main content --> */}

          <section class="content">
            <div class="row">
              <div class="col-md-10">
                <section class="Frame">
                  <div class="col-md-12">
                    <h2 class="title">ค้นหา</h2>
                    <div class="col-md-12">
                      {/* <form onSubmit={handleSearch}> */}
                      <form>
                        <div class="row">
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchWorkplaceId">
                                รหัสหน่วยงาน
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="searchWorkplaceId"
                                placeholder="หน่วยงาน"
                                value={searchWorkplaceId}
                                // onChange={(e) => setSearchWorkplaceId(e.target.value)}
                                onChange={handleStaffIdChange}
                                onInput={(e) => {
                                  // Remove any non-digit characters
                                  e.target.value = e.target.value.replace(/\D/g, "");
                                }}
                                list="WorkplaceIdList"
                              />
                            </div>
                            <datalist id="WorkplaceIdList">
                              {workplaceListAll.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceId}
                                />
                              ))}
                            </datalist>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchWorkplaceName">
                                ชื่อหน่วยงาน
                              </label>
                              <input
                                type="text"
                                class="form-control"
                                id="searchWorkplaceName"
                                placeholder="ชื่อหน่วยงาน"
                                value={searchWorkplaceName}
                                // onChange={(e) => setSearchWorkplaceName(e.target.value)}
                                onChange={handleStaffNameChange}
                                list="WorkplaceNameList"
                              />
                            </div>
                            <datalist id="WorkplaceNameList">
                              {workplaceListAll.map((workplace) => (
                                <option
                                  key={workplace.workplaceId}
                                  value={workplace.workplaceName}
                                />
                              ))}
                            </datalist>
                          </div>
                          {/* {workRateWorkplaceStage1}
                                                    {workRateWorkplaceStage2}
                                                    {workRateWorkplaceStage3} */}
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchEmployeeId">เดือน</label>
                              <select
                                className="form-control"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                              >
                                <option value="">เลือกเดือน</option>
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
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchEmployeeId">ปี</label>
                              <select
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                              >
                                <option value="">เลือกปี</option>
                                {years.map((y) => (
                                  <option key={y} value={y}>
                                    {y + 543}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* <div class="row">
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchEmployeeId">เดือน</label>
                                                            <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
                                                                <option value="">เลือกเดือน</option>
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
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label role="searchEmployeeId">ปี</label>
                                                            <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)} >
                                                                <option value="" >เลือกปี</option>
                                                                {years.map((y) => (
                                                                    <option key={y} value={y}>
                                                                        {y + 543}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>


                                                </div> */}

                        <div class="row">
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="codePage">รหัสกระดาษ</label>
                              <input
                                type="text"
                                class="form-control"
                                id="codePage"
                                placeholder="รหัสกระดาษ"
                                value={codePage}
                                onChange={(e) => setCodePage(e.target.value)}
                              />
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              {/* <div
                                style={{
                                  position: "relative",
                                  zIndex: 9999,
                                  marginLeft: "0rem",
                                }}
                              > */}
                              {/* <DatePicker id="datetime" name="datetime"
                                                                    className="form-control" // Apply Bootstrap form-control class
                                                                    popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                                    selected={workDate}
                                                                    onChange={handleWorkDateChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                // showMonthYearPicker
                                                                /> */}

                              {/* <DatePicker
                                  className="form-control"
                                  selected={selectedThaiDate}
                                  onChange={handleThaiDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  locale={th}
                                />
                              </div> */}
                              <label role="datetime">วันที่</label>
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
                                  {formattedDate321
                                    ? formattedDate321
                                    : "Select Date"}
                                </span>
                              </div>

                              {showDatePicker && (
                                <div
                                  style={{ position: "absolute", zIndex: 1000 }}
                                >
                                  <ThaiDatePicker
                                    className="form-control"
                                    value={selectedDate}
                                    onChange={handleDatePickerChange}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-12" style={{ marginTop: "5rem" }}>
                            <div
                              class="form-group"
                              style={{ position: "absolute", bottom: "0" }}
                            >
                              {/* <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button> */}
                              <br />
                              {/* <button
                                onClick={generatePDFTest123}
                                type="button "
                                class="btn b_save"
                              >
                                <i class="nav-icon fas fa-search"></i>
                                พิมพ์รายงาน
                              </button>
                              <button
                                onClick={generatePDFTest123Old}
                                style={{ marginLeft: "1rem", width: "10rem" }}
                                class="btn b_save"
                              >
                                <i class="nav-icon fas fa-search"></i>
                                พิมพ์รายงานเก่า
                              </button> */}
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* <button
                        onClick={generatePDFTest123}
                        type="button "
                        class="btn b_save"
                      >
                        <i class="nav-icon fas fa-search"></i>
                        พิมพ์รายงาน
                      </button> */}
                      <button
                        onClick={generatePDF987New}
                        type="button "
                        class="btn b_save"
                      >
                        <i class="nav-icon fas fa-search"></i>
                        พิมพ์รายงาน
                      </button>
                      <button
                        onClick={generatePDF987}
                        style={{ marginLeft: "1rem", width: "10rem" }}
                        class="btn b_save"
                      >
                        <i class="nav-icon fas fa-search"></i>
                        พิมพ์รายงานเก่า
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div class="row">
              <div class="col-md-2">
                {result_data.map(
                  (employeerecord) =>
                    employeerecord.employeeId +
                    ": ชื่อพนักงาน " +
                    employeerecord.employeeName
                )}
              </div>
            </div>
            <br />
          </section>
          {/* <!-- /.content --> */}
        </div>
      </div>

      {/* {JSON.stringify(listDayOff,null,2)} */}
    </body>
  );
}

function getMonthName(monthNumber) {
  const months = [
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

  // Ensure the monthNumber is within a valid range (1-12)
  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1]; // Months array is 0-based
  } else {
    // return 'Invalid Month';
    return months[12]; // Months array is 12 -based
  }
}

const getDateDayOfWeek = (dateString) => {
  // Create a Date object with the input date string in the format YYYY/mm/dd
  const date = new Date(dateString);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();
  // Return the day of the week (Sunday, Monday, etc.)
  // const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //overide
  const daysOfWeek = ["1", "2", "3", "4", "5", "6", "7"];
  return daysOfWeek[dayOfWeek];
  // console.log('dayOfWeek',dayOfWeek);
};
// console.log('',getDateDayOfWeek);

export default WorktimeSheetWorkplace;
