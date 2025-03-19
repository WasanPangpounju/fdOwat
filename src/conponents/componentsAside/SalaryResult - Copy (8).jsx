import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmployeesSelected from "./EmployeesSelected";
import Calendar from "react-calendar";
import "../editwindowcss.css";
import EmployeeWorkDay from "./componentsetting/EmployeeWorkDay";
import "./salarysummary/styleCom.css";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library
import th from "date-fns/locale/th"; // Import Thai locale data from date-fns

function Salaryresult() {
  document.title = "เงินเดือนรายบุคคล";

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

  //variable
  // const [socialSecurity, setSocialSecurity] = useState(0); // ประกันสังคม
  // const [tax, setTax] = useState(0); //ภาษี

  const [bankCustom, setBankCustom] = useState(0); //ค่าทำเนียม
  const [sumDeduct, setSumDeduct] = useState(0); //sum deduct immedate
  const [sumDeductInstallment, setSumDeductInstallment] = useState(0); //sum deduct installment

  const [employeeId, setEmployeeId] = useState(""); //รหัสหน่วยงาน
  const [name, setName] = useState(""); //ชื่อหน่วยงาน
  const [lastName, setLastname] = useState(""); //ชื่อหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState(""); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(""); //ชื่อหน่วยงาน

  const [searchResult, setSearchResult] = useState([]);
  const [searchResultLower, setSearchResultLower] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [overallAllTimesSum, setOverallAllTimesSum] = useState(0);
  const [overallOtTimesSum, setOverallOtTimesSum] = useState(0);
  const [overWorkRateSum, setOverWorkRateSum] = useState(0);
  const [overWorkRateOTSum, setOverWorkRateOTSum] = useState(0);
  const [overAddSalaryDaySum, setOverAddSalaryDaySum] = useState(0);
  const [sumSpSalaryResult, setSumSpSalaryResult] = useState(0);

  const [anySpSalary, setAnySpSalary] = useState(0);
  const [anyMinus, setAnyMinus] = useState(0);

  const [employeeListResult, setEmployeeListResult] = useState([]);
  const [newWorkplace, setNewWorkplace] = useState(true);
  const [timerecordAllList, setTimerecordAllList] = useState([]);
  const [calsalaryAlllist, setSalsalaryAlllist] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);
  const [workplaceList, setWorkplaceList] = useState([]);
  const [concludeList, setConcludeList] = useState([]);
  const [calsalarylist, setCalsalarylist] = useState([]);

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
  const getThaiMonthName = (monthNumber) => {
    return thaiMonthNames[monthNumber - 1];
  };

  const initialThaiDate = new Date();
  initialThaiDate.setFullYear(initialThaiDate.getFullYear()); // Add 543 years to the current year

  // ใช้ลา
  const [remainArray, setRemainArray] = useState([]);
  const [selectedThaiDate, setSelectedThaiDate] = useState(initialThaiDate);
  const [remainCode, setRemainCode] = useState("");
  const [remainName, setRemainName] = useState("");
  const [remainSalary, setRemainSalary] = useState(""); //
  const [remainComment, setRemainComment] = useState(""); //

  useEffect(() => {
    setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);

    const getdata = async () => {
      const savedEmployeeId = await localStorage.getItem("employeeId");
      const savedEmployeeName =
        (await localStorage.getItem("employeeName")) || "";
      const savedMonth = await localStorage.getItem("month");
      const savedYear = await localStorage.getItem("year");
      if (savedEmployeeId) {
        await setSearchEmployeeId(savedEmployeeId);
        await setSearchEmployeeName(savedEmployeeName);
        await setStaffId(savedEmployeeId);
        // setStaffFullName(savedEmployeeName);

        const event = await new Event("submit"); // Creating a synthetic event object
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
    };

    getdata();
  }, []); // Run this effect only once on component mount

  // const handleThaiDateChange = (date) => {
  //   setSelectedThaiDate(date);
  //   setSelectedGregorianDate(ThaiBuddhistToGregorian(date));
  //   setWorkDate(ThaiBuddhistToGregorian(date));
  // };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setSelectedThaiDate(newDate);
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

  const handleRemainCodeChange = (event) => {
    setRemainCode(event.target.value);
  };

  const handleRemainNameChange = (event) => {
    setRemainName(event.target.value);
  };

  const handleRemainSalaryChange = (event) => {
    setRemainSalary(event.target.value);
  };

  const handleRemainCommentChange = (event) => {
    setRemainComment(event.target.value);
  };

  const handleAddData = () => {
    // alert(selectedName2.name )
    // Create a new object with the input values
    const newData = {
      startDay: selectedThaiDate || "",
      endDay: selectedThaiDate || "",
      welfareType: selectedName2.id || "",
      welfareTypeEn: selectedName2.name || "",
      id: remainCode || "",
      name: remainName || "",
      SpSalary: remainSalary || "",
      roundOfSalary: "monthly",
      StaffType: "",
      nameType: "",
      message: "",
      comment: remainComment || "",

      // thaiDate: selectedThaiDate || '',
      // selectedName2      : selectedName2.id || '',
      // selectedId      : selectedName2.name || '',
      // code: remainCode || '',
      // name: remainName || '',
      // salary: remainSalary || '',
      // comment: remainComment || '',
    };

    // Add the new data object to the dataArray state
    setRemainArray([...remainArray, newData]);

    // Reset input fields after adding the data
    // setSelectedThaiDate('');
    setRemainCode("");
    setRemainName("");
    setRemainSalary("");
    setRemainComment("");
  };

  const handleDeleteData = (index) => {
    alert(index);
    const newDataArray = [...remainArray];
    newDataArray.splice(index, 1);
    setRemainArray(newDataArray);

    // Save after ensuring state update
    setTimeout(() => handleSaveWelfare(), 0); // Use a small delay
  };

  const [yearWelfare, setYearWelfare] = useState("");
  const [monthWelfare, setMonthWelfare] = useState("");
  async function handleSaveWelfare() {
    try {
      if (remainArray.length === 0) {
        // alert("กรุณาตรวจสอบรายการลา และข้อมูลพนักงาน");
        alert("ลบรายการวันลาหมดแล้ว");
        // return;
      }
      if (!yearWelfare || !monthWelfare) {
        alert("กรุณากรอกข้อมูลปีและเดือนให้ครบถ้วน");
        return;
      }

      const welfareSave = {
        year: yearWelfare,
        month: monthWelfare,
        createDate: "",
        employeeId: staffId,
        workplace: "",
        createBy: "",
        status: "",
        record: remainArray || [],
      };

      const response = await axios.post(endpoint + "/leave/create", welfareSave);
      if (response.data) {
        alert("บันทึกสำเร็จ");
      }
    } catch (e) {
      alert("save welfare error is " + e);
    }
  }

  // async function handleSaveWelfare() {
  //   // alert('handleSaveWelfare');
  //   try {
  //     if (remainArray.length > 0 && yearWelfare !== "" && monthWelfare !== "") {
  //       const welfareSave = await {
  //         year: yearWelfare,
  //         month: monthWelfare,
  //         createDate: "",
  //         employeeId: staffId,
  //         workplace: "",
  //         createBy: "",
  //         status: "",
  //         record: remainArray,
  //       };

  //       //save welfare
  //       await axios
  //         .post(endpoint + "/leave/create", welfareSave)
  //         .then(async (response) => {
  //           const responseData = await response.data;
  //           if (responseData) {
  //             alert("บันทึกสำเร็จ");
  //           }
  //         });
  //     } else {
  //       alert("กรุณาตรวจสอบรายการลา และข้อมูลพนักงาน");
  //     }
  //   } catch (e) {
  //     alert("save welfare error is " + e);
  //   }
  // }

  //all leave usede
  const [sumLeave, setSumLeave] = useState([]);

  useEffect(() => {
    // get welfare record with year and month
    const getWelfare = async () => {
      // if (yearWelfare !== "" && monthWelfare !== "" && staffId !== "") {
      if (staffId !== "") {
        const welfareSearch = await {
          // year: yearWelfare,
          // month: monthWelfare,
          employeeId: staffId,
        };

        // try {
        //   const result = await axios.post(
        //     endpoint + "/leave/searchsummary",
        //     welfareSearch
        //   );
        //   if (result && result.data.length > 0) {
        //     // await alert(JSON.stringify(result .data[0].record));
        //     setSumLeave(result.data[0].record);
        //   }
        // } catch (e) {
        //   // alert('get welfare error is' + e)
        // }

        //     try {
        //       const result = await axios.post(
        //         endpoint + "/leave/search",
        //         welfareSearch
        //       );
        //       console.log("testresult",result.data[0].record);
        //       // setRemainArray([]);
        //       if (result && result.data.length > 0) {
        //         // await alert(JSON.stringify(result .data[0].record));
        //         setRemainArray(result.data[0].record);
        //       }else{
        //         console.log("testresult2");

        //       }
        //     } catch (e) {
        //       // alert('get welfare error is' + e)
        //     }
        //   }
        // };

        try {
          const result = await axios.post(
            endpoint + "/leave/searchsummary",
            welfareSearch
          );

          if (result && result.data.length > 0) {
            console.log("testresult", result.data[0].record);
            setRemainArray([]);

            const tmpRemainArray = [];
            result.data.map(item => {
              tmpRemainArray.push(...item.record);
            });
            setRemainArray(tmpRemainArray);
            // alert(tmpRemainArray.length  )
            // setRemainArray(result.data[0].record);
          } else {
            // If no records found, set remainArray to empty
            console.log("No records found, setting remainArray to empty.");
            setRemainArray([]);
          }
        } catch (e) {
          console.error("Error fetching welfare records:", e);
          // Set remainArray to empty on error
          setRemainArray([]);
        }
      } else {
        // If yearWelfare, monthWelfare, or staffId is empty, set remainArray to empty
        // setRemainArray([]);
      }
    };

    getWelfare();
  }, [yearWelfare, monthWelfare, staffId]);

  let test = sumLeave.filter((item) => item.welfareType == "ลาป่วย");
  //

  const welfareTypeCountMap = remainArray.reduce((acc, item) => {
    acc[item.welfareTypeEn] = (acc[item.welfareTypeEn] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    // setMonth("01");

    const currentYear = new Date().getFullYear();
    setYear(currentYear);
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
      setStaffFullName(selectedEmployee.employeeName);
    } else {
      setStaffId("");
      // searchEmployeeId('');
    }

    // setStaffName(selectedStaffName);
    setStaffFullName(selectedEmployeeFName);
    setSearchEmployeeName(selectedEmployeeFName);
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/conclude/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setConcludeList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [accountingData, setAccountingData] = useState([]);
  const [addSalaryList, setAddSalaryList] = useState([]);
  const [deductSalaryList, setDeductSalaryList] = useState([]);
  const [sumAddSalaryList, setSumAddSalaryList] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("");
  const [wsAmountSpecialDay, setWsAmountSpecialDay] = useState(0);
  const [wsAmountDay, setWsAmountDay] = useState(0);
  const [wsAmountOt, setWsAmountOt] = useState(0);
  const [wsSocialSecurity, setWsSocialSecurity] = useState(0);
  const [wsTax, setWsTax] = useState(0);
  const [wsTotal, setWsTotal] = useState(0);
  const [wsTotalSum, setWsTotalSum] = useState(0);
  const [wsTotalSumDeduct, setWsTotalSumDeduct] = useState(0);

  const [wsCountDayWork, setWsCountDayWork] = useState(0);
  const [wsAmountCountDayWork, setWsAmountCountDayWork] = useState(0);
  const [wsAmountCountDayWorkOt, setWsAmountCountDayWorkOt] = useState(0);
  const [wsCountHourWork, setWsCountHourWork] = useState(0);
  const [wsCountOtHourWork, setWsCountOtHourWork] = useState(0);

  //tmp for cal social
  const [wsAmountSpecialDayx, setWsAmountSpecialDayx] = useState(0);
  const [wsSocialSecurityX, setWsSocialSecurityX] = useState(0);
  const [empDataSelect, setEmpDataSelect] = useState();

  //master addSalary and deDuctSalary
  const [searchAddSalaryList, setSearchAddSalaryList] = useState([]);
  const [searchDeductSalaryList, setSearchDeductSalaryList] = useState([]);
  const [addSalaryId, setAddSalaryId] = useState("");
  const [addSalaryName, setAddSalaryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (year !== "" && month !== "" && staffId !== "") {
        let tmp = employeeList.find(
          (employee) => employee.employeeId === staffId
        );

        if (tmp) {
          setEmpDataSelect(tmp);
        }
        setYearWelfare(year || "");
        setMonthWelfare(month || "");
        const dataTest = await {
          employeeId: staffId || "",
          year: year || "",
          month: month || "",
          updateStatus: updateStatus || "",
        };

        await setAddSalaryList([]);
        
        await axios
          .post(endpoint + "/accounting/calsalaryemp", dataTest)
          .then(async (response) => {
            const responseData = await response.data;
            // alert(JSON.stringify(responseData ,null,2));

            if (response.data) {
              if (updateStatus !== "") {
                alert("ระบบทำการคำนวนใหม่แล้ว กรุณากดค้นหาอีกครั้ง");
                handleReLoad();
              }
              setUpdateStatus("");
              await setAccountingData(response.data[0]);
              await setWsAmountSpecialDay(
                response.data[0].accountingRecord.amountSpecialDay ||
                response.data[0].accountingRecord[0].amountSpecialDay
              );
              await setWsAmountSpecialDayx(
                response.data[0].accountingRecord.amountSpecialDay ||
                response.data[0].accountingRecord[0].amountSpecialDay
              );

              await setWsAmountDay(
                parseFloat(response.data[0].accountingRecord.amountDay) ||
                parseFloat(response.data[0].accountingRecord[0].amountDay)
              );
              await setWsAmountOt(
                response.data[0].accountingRecord.amountOt ||
                response.data[0].accountingRecord[0].amountOt
              );
              await setWsSocialSecurity(
                response.data[0].accountingRecord.socialSecurity ||
                response.data[0].accountingRecord[0].socialSecurity
              );
              await setWsSocialSecurityX(
                response.data[0].accountingRecord.socialSecurity ||
                response.data[0].accountingRecord[0].socialSecurity
              );

              await setWsTax(
                response.data[0].accountingRecord.tax ||
                response.data[0].accountingRecord[0].tax
              );
              await setWsTotal(
                response.data[0].accountingRecord.total ||
                response.data[0].accountingRecord[0].total
              );

              await setWsCountDayWork(
                response.data[0].accountingRecord.countDayWork ||
                response.data[0].accountingRecord[0].countDayWork
              );
              await setWsAmountCountDayWork(
                response.data[0].accountingRecord.amountCountDayWork ||
                response.data[0].accountingRecord[0].amountCountDayWork
              );
              await setWsAmountCountDayWorkOt(
                response.data[0].accountingRecord.amountCountDayWorkOt ||
                response.data[0].accountingRecord[0].amountCountDayWorkOt
              );
              await setWsCountHourWork(
                response.data[0].accountingRecord.countHourWork ||
                response.data[0].accountingRecord[0].countHourWork
              );
              await setWsCountOtHourWork(
                response.data[0].accountingRecord.countOtHourWork ||
                response.data[0].accountingRecord[0].countOtHourWork
              );

              await setAddSalaryList(response.data[0].addSalary);
              // if (response.data[0].addSalary) {
              //   let tmp = 0;
              //   response.data[0].addSalary.map((item) => {
              //     tmp += parseFloat(item.SpSalary);
              //   });
              //   setSumAddSalaryList(tmp);
              // }

              if (response.data[0].addSalary) {
                let tmp = 0;

                // Calculate the sum of SpSalary from response data
                response.data[0].addSalary.map((item) => {
                  tmp += parseFloat(item.SpSalary);
                });
                setSumAddSalaryList(tmp);

                // Merge addSalaryList with remainArray
                const mergedAddSalaryList = [
                  ...response.data[0].addSalary,
                  ...remainArray.map((remain) => ({
                    id: remain.id, // or generate a unique ID if needed
                    name: remain.welfareType,
                    SpSalary: remain.SpSalary,
                    roundOfSalary: remain.roundOfSalary,
                    StaffType: "", // If you need to add StaffType or other fields
                  })),
                ];

                // Set the updated addSalaryList
                setAddSalaryList(mergedAddSalaryList);

                // Recalculate the sum for the merged list
                let totalSalary = mergedAddSalaryList.reduce((acc, item) => acc + parseFloat(item.SpSalary || 0), 0);
                setSumAddSalaryList(totalSalary);
              }

              // alert(response.data[0].addSalary.length);
              // await setDeductSalaryList(response.data[0].deductSalary);
              if (response.data[0].deductSalary) {
                let tmp1 = 0;
                let tmpList = [];
                response.data[0].deductSalary.map((item) => {
                  tmp1 += parseFloat(item.amount || 0);
                  if (item.id !== "") {
                    tmpList.push(item);
                  }
                });
                setDeductSalaryList(tmpList);
              }
            }
            const filteredData = responseData.filter(
              (item) => item.employeeId === staffId
            );
            setCalsalarylist(filteredData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

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

    // Call fetchData when year or month changes
    fetchData();
  }, [year, month, staffId, updateStatus]);

  useEffect(() => {
    const getAddSalary = async () => {
      const findObjectById = (id) => {
        return searchAddSalaryList.find((item) => item.id === id);
      };

      if (remainCode !== "") {
        setRemainName("");
        const foundObject = await findObjectById(remainCode);
        if (foundObject) {
          setAddSalaryName(foundObject.name); // Set only the name property
          setRemainName(foundObject.name); // Set only the name property

          let tmp = employeeList.find(
            (employee) => employee.employeeId === remainCode
          );
          if (tmp && value in tmp) {
            // setSelectedName(tmp[value]);
            // setRemainSalary();
            alert(tmp[value]);
          }

          // alert(addSalaryName);
        }
      }
    };

    getAddSalary();
  }, [remainCode, searchAddSalaryList]);

  const handleTmpamountChange = (e) => {
    setWsAmountSpecialDay(Number(e.target.value));
  };

  const handleUpdateStatus = (updateStatus) => {
    setUpdateStatus(updateStatus);
    // alert(updateStatus );
  };

  //sum salary before deduct
  useEffect(() => {
    setWsTotalSum(
      (
        Number(wsAmountDay || 0) +
        Number(wsAmountOt || 0) +
        Number(wsTax || 0) +
        Number(wsAmountSpecialDay || 0) +
        Number(sumAddSalaryList || 0)
      ).toFixed(2) || 0
    );

    const calSocial = async () => {
      if (Number(wsSocialSecurity) >= 0) {
        const tmp = (await Number(wsAmountSpecialDayx)) * 0.05;
        const tmp1 = (await Number(wsAmountSpecialDay)) * 0.05;
        if (tmp < tmp1) {
          let ans = await (Number(wsSocialSecurityX) +
            (Number(tmp1) - Number(tmp)));
          if (ans < 83) {
            ans = await 83;
          }
          await setWsSocialSecurity(ans);
        } else {
          let t = Number(tmp) - Number(tmp1);
          let ans = (await Number(wsSocialSecurityX)) - Number(t);
          if (ans < 83) {
            ans = await 83;
          }

          await setWsSocialSecurity(ans);
        }
        // await alert('tmp ' + tmp);

        // await alert('tmp1 ' + tmp1);

        // await setWsSocialSecurity(tmp1);
      }
    };

    calSocial();
    //  setWsTotal(Number(wsTotalSum) - Number(wsTotalSumDeduct) );
  }, [wsAmountSpecialDay]);

  //sum deduct
  useEffect(() => {
    setWsTotalSumDeduct(Number(wsSocialSecurity) + Number(wsTax));
  }, [wsSocialSecurity, wsTax]);


  const createDate = calsalarylist ? calsalarylist[0]?.createDate : null;

  const countDay = calsalarylist
    ? calsalarylist[0]?.accountingRecord.countDay
    : null;

  // 07/06/2024
  // const amountDay = calsalarylist ? calsalarylist[0]?.accountingRecord.amountDay : null;
  // const amountOt = calsalarylist ? calsalarylist[0]?.accountingRecord.amountOt : null;
  // const tax = calsalarylist ? calsalarylist[0]?.accountingRecord.tax : null;
  // const amountPosition = calsalarylist ? calsalarylist[0]?.accountingRecord.amountPosition : null;
  // const amountHardWorking = calsalarylist ? calsalarylist[0]?.accountingRecord.amountHardWorking : null;
  // const amountSpecial = calsalarylist ? calsalarylist[0]?.accountingRecord.amountSpecial : null;
  // const advancePayment = calsalarylist ? calsalarylist[0]?.accountingRecord.advancePayment : null;
  // const amountHoliday = calsalarylist ? calsalarylist[0]?.accountingRecord.amountHoliday : null;
  // const addAmountBeforeTax = calsalarylist ? calsalarylist[0]?.accountingRecord.addAmountBeforeTax : null;
  // const deductBeforeTax = calsalarylist ? calsalarylist[0]?.accountingRecord.deductBeforeTax : null;
  // const socialSecurity = calsalarylist ? calsalarylist[0]?.accountingRecord.socialSecurity : null;
  // const addAmountAfterTax = calsalarylist ? calsalarylist[0]?.accountingRecord.addAmountAfterTax : null;
  // const deductAfterTax = calsalarylist ? calsalarylist[0]?.accountingRecord.deductAfterTax : null;
  // const bank = calsalarylist ? calsalarylist[0]?.accountingRecord.bank : null;
  // const total = calsalarylist ? calsalarylist[0]?.accountingRecord.total : null;
  // const sumSalaryForTax = calsalarylist ? calsalarylist[0]?.accountingRecord.sumSalaryForTax : null;

  // const countSpecialDay = calsalarylist ? calsalarylist[0]?.countSpecialDay : null;
  // // const specialDayListWork = calsalarylist ? calsalarylist[0]?.specialDayListWork.length : null;
  // const specialDayListWork = calsalarylist[0]?.specialDayListWork || 0;

  // const specialDayRate = calsalarylist ? calsalarylist[0]?.specialDayRate : null;

  // const amountSpecialDay = calsalarylist ? calsalarylist[0]?.accountingRecord.amountSpecialDay : null;
  // const countDayWork = calsalarylist ? calsalarylist[0]?.accountingRecord.countDayWork : null;

  const amountDay = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountDay ?? 0
  );
  const amountOt = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountOt ?? 0
  );

  const tax = Number(calsalarylist?.[0]?.accountingRecord?.[0]?.tax ?? null);
  const amountPosition = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountPosition ?? null
  );
  const amountHardWorking = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountHardWorking ?? null
  );
  const amountSpecial = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountSpecial ?? null
  );
  const advancePayment = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.advancePayment ?? null
  );
  const amountHoliday = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountHoliday ?? null
  );
  const addAmountBeforeTax = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.addAmountBeforeTax ?? null
  );
  const deductBeforeTax = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.deductBeforeTax ?? null
  );
  const socialSecurity = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.socialSecurity ?? null
  );
  const addAmountAfterTax = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.addAmountAfterTax ?? null
  );
  const deductAfterTax = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.deductAfterTax ?? null
  );
  const bank = Number(calsalarylist?.[0]?.accountingRecord?.[0]?.bank ?? null);
  const total = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.total ?? null
  );
  const sumSalaryForTax = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.sumSalaryForTax ?? null
  );

  const countSpecialDay = Number(
    calsalarylist?.[0]?.countSpecialDay?.[0] ?? null
  );
  // const specialDayListWork = calsalarylist ? calsalarylist[0]?.specialDayListWork.length : null);
  const specialDayListWork = Number(
    calsalarylist?.[0]?.specialDayListWork?.[0] ?? null
  );

  const specialDayRate = Number(
    calsalarylist?.[0]?.specialDayRate?.[0] ?? null
  );

  const amountSpecialDay = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.amountSpecialDay ?? null
  );
  const countDayWork = Number(
    calsalarylist?.[0]?.accountingRecord?.[0]?.countDayWork ?? null
  );

  const totalAmount = amountDay + amountOt + sumAddSalaryList;

  const [amountSpecialDayReadyUpDate, setAmountSpecialDayReadyUpDate] =
    useState(amountSpecialDay === "null" ? "" : amountSpecialDay);
  // Update state when amountSpecialDay changes
  useEffect(() => {
    setAmountSpecialDayReadyUpDate(
      amountSpecialDay === "null" ? "" : amountSpecialDay
    );
  }, [amountSpecialDay]);

  // Handle input change
  const handleAmountSpecialDayChange = (e) => {
    setAmountSpecialDayReadyUpDate(e.target.value);
  };

  // console.error('workplaceList', workplaceList);


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAnySpSalaryChange = (event) => {
    const newValue = parseFloat(event.target.value) || 0;
    setAnySpSalary(newValue);
  };

  const handleAnyMinusChange = (event) => {
    const newValue = parseFloat(event.target.value) || 0;
    setAnyMinus(newValue);
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
    //xxss
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



  const CheckMonth = parseInt(month, 10);
  const CheckYear = year;

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


  const commonNumbers = new Set([...array2.Mon, ...array1.Mon]);

  // const commonNumbers = [...new Set([...array1.Mon, ...array2.Mon])];

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
  monthLower;

  const thaiMonthName = getThaiMonthName(parseInt(CheckMonth, 10));
  const thaiMonthLowerName = getThaiMonthName(parseInt(countdownMonth, 10));

  async function handleSearchAccounting() {
    let tmp = await staffId;
    await setStaffId("");
    setTimeout(async () => {
      await setStaffId(tmp);
      // alert('Hi');
    }, 1000); // Adjust the delay time as needed (1000 ms = 1 second)
  }

  async function handleSearch(event) {
    event.preventDefault();

    const data = await {
      employeeId: searchEmployeeId,
      // name: searchEmployeeName,
      // employeeName: searchEmployeeName,
      month: month,
      timerecordId: year,
    };
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

      // const response = await axios.post(endpoint + '/timerecord/listemp', data);
      // const responseLower = await axios.post(endpoint + '/timerecord/listemp', dataLower);

      const filteredEntries = concludeList.filter(
        (entry) =>
          entry.employeeId === searchEmployeeId &&
          entry.month === month &&
          entry.year == year
      );

      setSearchResult(filteredEntries);

      const concludeRecordArray = filteredEntries.map(
        (entry) => entry.concludeRecord
      );
      setAlldaywork(concludeRecordArray);

      const workplaceIdCounts = {};



      concludeRecordArray.forEach((recordArray) => {
        recordArray.forEach((record) => {
          if (record.workplaceId) {
            const workplaceId = record.workplaceId;
            workplaceIdCounts[workplaceId] =
              (workplaceIdCounts[workplaceId] || 0) + 1;
          }
        });
      });

      const totalCount = Object.values(workplaceIdCounts).reduce(
        (sum, count) => sum + count,
        0
      );
      setTotalCount(totalCount);


      const filteredEntriesCalsalary = calsalarylist.filter(
        (entry) =>
          entry.employeeId === searchEmployeeId &&
          entry.month === month &&
          entry.year == year
      );

      const filteredEntriesEmp = employeeList.filter(
        (entry) => entry.employeeId === searchEmployeeId
      );


      // Assuming filteredEntriesEmp is an array with one element
      if (filteredEntriesEmp.length > 0) {
        const addSalaryMonthly = filteredEntriesEmp[0].addSalary.filter(
          (salary) => salary.roundOfSalary === "monthly"
        );


        // Now addSalaryMonthly contains only the items with roundOfSalary === "monthly"
        // You can access SpSalary values from addSalaryMonthly array
      }

      if (filteredEntriesEmp.length > 0) {
        const addSalaryMonthly = filteredEntriesEmp[0].addSalary.filter(
          (salary) => salary.roundOfSalary === "monthly"
        );

        //get deduct data with immedate
        const deductSalary = filteredEntriesEmp[0].deductSalary.filter(
          (deduct) => deduct.payType === "immedate"
        );
        let sum = 0;
        //loop forget socialSecurity and tax
        deductSalary.map((item, index) => {
          //check 0001 is social security
          if (item.id == "0001") {
            // alert(item.amount);
            if (item.amount.includes("%")) {
              let tmp = item.amount.replace(/%/g, "");
              tmp = tmp / 100;
              setSocialSecurity(tmp);
            } else {
              setSocialSecurity(item.amount);
            }
          }
          //check 0002 is tax
          else if (item.id == "0002") {
            // alert(item.amount);
            if (item.amount.includes("%")) {
              let tmp = item.amount.replace(/%/g, "");
              tmp = tmp / 100;
              setTax(tmp);
            } else {
              setTax(item.amount);
            }
          }
          //check 0003 is bank custom
          else if (item.id == "0003") {
            // alert(item.amount);\
            // setBankCustom(item.amount);
            setBankCustom(0);
          } else {
            sum = sum + parseFloat(item.amount);
          }
        });
        setSumDeduct(sum);
        // alert(deductSalary.length);

        //get deduct data with installment
        const deductSalaryInstallment =
          filteredEntriesEmp[0].deductSalary.filter(
            (deduct) => deduct.payType === "installment"
          );
        let sumInstallment = 0;
        //loop forget socialSecurity and tax
        deductSalaryInstallment.map((item, index) => {
          let amount = parseFloat(item.amount);
          let installment = parseFloat(item.installment);
          sumInstallment =
            sumInstallment + parseFloat((amount / installment).toFixed(2));
        });
        setSumDeductInstallment(sumInstallment);


        // Now addSalaryMonthly contains only the items with roundOfSalary === "monthly"

        // Summing SpSalary values using reduce
        const sumSpSalary = addSalaryMonthly.reduce(
          (sum, salary) => sum + parseFloat(salary.SpSalary || 0),
          0
        );


        setSumSpSalaryResult(sumSpSalary);
      }

      const entriesData = filteredEntries.map((entry) =>
        entry.concludeRecord
          .filter((record) => record.date <= 20)
          .map((record) => {
            const matchedWorkplace = workplaceList.find(
              (workplace) => workplace.workplaceId === record.workplaceId
            );
            return {
              workplaceId: record.workplaceId,
              dates: record.date,
              workOfHour: matchedWorkplace ? matchedWorkplace.workOfHour : "", // Default value if not found
              workRate: matchedWorkplace ? matchedWorkplace.workRate : "", // Default value if not found
              workRateOT: matchedWorkplace ? matchedWorkplace.workRateOT : "",
              allTimes: record.allTime,
              otTimes: record.otTime,
              startTime: record.startTime,
              endTime: record.endTime,
              selectotTime: record.selectotTime,
              selectotTimeOut: record.selectotTimeOut,
            };
          })
      );

      const overallOtTimesSum = Object.values(sumCountsByWorkplace).reduce(
        (sum, workplaceData) => {
          return sum + workplaceData.otTimes;
        },
        0
      );

      setOverallOtTimesSum(overallOtTimesSum);

      const overWorkRateSum = Object.values(sumCountsByWorkplace).reduce(
        (sum, workplaceData) => {
          return sum + workplaceData.workRate;
        },
        0
      );

      setOverWorkRateSum(overWorkRateSum);

      const overWorkRateOTSum = Object.values(sumCountsByWorkplace).reduce(
        (sum, workplaceData) => {
          return sum + workplaceData.workRateOT;
        },
        0
      );

      setOverWorkRateOTSum(overWorkRateOTSum);

      const overAddSalaryDaySum = Object.values(sumCountsByWorkplace).reduce(
        (sum, workplaceData) => {
          return sum + workplaceData.addSalaryDay;
        },
        0
      );

      setOverAddSalaryDaySum(overAddSalaryDaySum);

      setAlldaywork(sumCounts);

      if (response.data.employees.length < 1) {
        // window.location.reload();
        setEmployeeId("");
        setName("");
        setLastname("");
        alert("ไม่พบข้อมูล");
      } else {
        // alert(response.data.employees.length);

        //clean form
        setSearchEmployeeId("");
        setSearchEmployeeName("");

        // Set search values
        setEmployeeId(response.data.employees[0].employeeId);
        setName(response.data.employees[0].name);
        setLastname(response.data.employees[0].lastName);
      }
    } catch (error) {
      // alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);
      // alert(error);
      // window.location.reload();
    }
  }

  const flattenedArray = alldaywork.flat();

  // Sum up allTimes property
  const overallAllTimesSum123 = flattenedArray.reduce((sum, record) => {
    const allTimesValue = parseFloat(record.allTimes) || 0;
    return sum + allTimesValue;
  }, 0);
  // setOverallAllTimesSum(overallAllTimesSum123);

  const overallOtTimesSum123 = flattenedArray.reduce((sum, record) => {
    const otTimesValue = parseFloat(record.otTimes) || 0;
    return sum + otTimesValue;
  }, 0);
  // overallOtTimesSum(overallOtTimesSum123);

  const groupedRecords = alldaywork.reduce((groups, record) => {
    const workplaceId = record.workplaceId || "default"; // Use a default key if workplaceId is not available

    if (!groups[workplaceId]) {
      groups[workplaceId] = [];
    }

    groups[workplaceId].push(record);
    return groups;
  }, {});


  const sumCountsByWorkplace = {};

  Object.keys(groupedRecords).forEach((workplaceId) => {
    sumCountsByWorkplace[workplaceId] = groupedRecords[workplaceId].reduce(
      (accumulator, record) => {
        const allTimesValue = parseFloat(record.allTimes) || 0;
        const workRateValue = parseFloat(record.workRate) || 0;
        const otTimesValue = parseFloat(record.otTimes) || 0;

        // const workRateOTMatch = record.workRateOT.match(/\((.*?)\)/);
        // const workRateOTValue = workRateOTMatch ? parseFloat(workRateOTMatch[1]) || 0 : 0;

        // const workRateOTMatch = record.workRateOT.match(/(\d+\.?\d*)/);
        let workRateOTValue = 0;
        if (record.workRateOT) {
          const workRateOTMatch = record.workRateOT.match(/(\d+\.?\d*)/);
          workRateOTValue = workRateOTMatch
            ? parseFloat(workRateOTMatch[1]) || 0
            : 0;
        }
        // const workRateOTValue = workRateOTMatch ? parseFloat(workRateOTMatch[0]) || 0 : 0;

        const addSalaryDayValue = parseFloat(record.addSalaryDay) || 0;

        accumulator.allTimes += allTimesValue;
        accumulator.workRate += workRateValue;
        // accumulator.workRate = workRateValue;
        accumulator.otTimes += otTimesValue;
        // accumulator.workRateOT += workRateOTValue;
        accumulator.workRateOT += workRateOTValue;
        accumulator.addSalaryDay += addSalaryDayValue;
        accumulator.count += 1;

        return accumulator;
      },
      {
        allTimes: 0,
        workRate: 0,
        otTimes: 0,
        workRateOT: 0,
        addSalaryDay: 0,
      }
    );
  });


  const findEmployeeById = (id) => {
    return employeeList.find((employee) => employee.employeeId === id);
  };

  const [addSalaryDay, setAddSalaryDay] = useState(0);
  useEffect(() => {
    setAddSalaryDay(0);

    if (employee?.addSalary?.length > 0) {
      // alert(employee.addSalary.length);
      //cal addSalary day
      const ans = 0;
      for (let i = 0; i < employee.addSalary.length; i++) {
        // alert(employee.addSalary[i].roundOfSalary || '');
        let tmp = employee.addSalary[i].roundOfSalary || "";
        if (tmp == "daily") {
          // alert(employee.addSalary[i].SpSalary || 0);
          let tmp1 = employee.addSalary[i].SpSalary || 0;
          // alert(tmp1);
          setAddSalaryDay(
            addSalaryDay + parseInt(employee.addSalary[i].SpSalary || 0)
          );
        }
      }
      // setAddSalaryDay(ans);
    }
  }, [employee]);



  const callHandleStaffNameChangeWithEmployeeId = (employeeId) => {
    // Assuming you have access to the event object or you can create a synthetic event
    // You can create a synthetic event using `new Event('change')`
    const syntheticEvent = new Event("change");

    // You need to attach a `target` property to the synthetic event
    // with a `value` property containing the employeeId
    syntheticEvent.target = { value: employeeId };

    // Call handleStaffNameChange with the synthetic event
    handleStaffNameChange(syntheticEvent);
  };

  const Compensation = ({ staffId, month, year }) => {
    setStaffId(staffId);
    setMonth(month);
    setYear(year);
  };

  const totalSumSalary =
    parseFloat(amountDay) +
    parseFloat(amountOt) +
    parseFloat(amountPosition) +
    parseFloat(amountHardWorking) +
    parseFloat(amountHoliday) +
    parseFloat(addAmountAfterTax) +
    parseFloat(amountSpecial);

  // amountDay + amountOt + addAmountBeforeTax + addAmountAfterTax
  //   overWorkRateSum + overWorkRateOTSum + overAddSalaryDaySum + sumSpSalaryResult

  const totalSumDeduct =
    // parseInt(anyMinus) +
    // parseInt(tax) +
    // (parseInt(overWorkRateSum) + parseFloat(overWorkRateOTSum) + parseFloat(overAddSalaryDaySum) + parseFloat(sumSpSalaryResult) + parseInt(anySpSalary)) * parseFloat(socialSecurity) +
    // parseInt(bankCustom) +
    // parseInt(sumDeduct) +
    // parseInt(sumDeductInstallment);
    parseFloat(deductBeforeTax) +
    parseFloat(deductAfterTax) +
    parseFloat(tax) +
    parseFloat(socialSecurity) +
    parseFloat(bank);

  const namelist = [];

  // const namelist = [
  //   { name: 'pop', empID: '1525', workplaceId: '1001-25', salary: '123' },
  //   { name: 'top', empID: '1585', workplaceId: '1021-25', salary: '498' },
  //   { name: 'cop', empID: '1585', workplaceId: '1021-25', salary: '753' },
  // ];

  const [showPopup, setShowPopup] = useState(false);
  const [color, setColor] = useState("blue");

  const sumSalary = namelist.reduce(
    (acc, curr) => acc + parseInt(curr.salary),
    0
  );

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setColor(color === "blue" ? "red" : "blue");
  };

  const sumwork = isNaN(amountDay + amountOt + sumAddSalaryList)
    ? 0.0
    : (amountDay + amountOt + sumAddSalaryList).toFixed(2);

  const workHoliday = isNaN(
    (countSpecialDay - specialDayListWork) * specialDayRate
  )
    ? 0.0
    : ((countSpecialDay - specialDayListWork) * specialDayRate).toFixed(2);

  const totalSum = (parseFloat(sumwork) + parseFloat(workHoliday)).toFixed(2);

  const handleAddSalary = () => {
    localStorage.setItem("searchEmployeeId", staffId);
    window.location.href = "/addEdit_SalaryEmployee";
  };

  //save data in accounting
  const handleSaveAccounting = async () => {
    if (accountingData && accountingData.accountingRecord) {
      if (Array.isArray(accountingData.accountingRecord)) {
        accountingData.accountingRecord[0].amountSpecialDay =
          wsAmountSpecialDay;
        accountingData.accountingRecord[0].socialSecurity = wsSocialSecurity;
      } else {
        accountingData.accountingRecord.amountSpecialDay = wsAmountSpecialDay;
        accountingData.accountingRecord.socialSecurity = wsSocialSecurity;
      }
      // await alert(accountingData.accountingRecord[0].amountSpecialDay);

      try {
        const response = await axios.put(
          endpoint + "/accounting/update/" + accountingData._id,
          accountingData
        );
        // setEmployeesResult(response.data.employees);
        if (response) {
          alert("บันทึกสำเร็จ");
          // localStorage.setItem('selectedEmployees' , JSON.stringify(response.data.employees));
        }

        // const id = accountingData.accountingRecord[0]._id;
        // const updatedValue = tmpamountSpecialDay;
        // await axios.post(endpoint + '/accounting/updateSpecialDay', { id, amountSpecialDay: updatedValue });
        // setUpdateStatus(''); // Trigger fetchData to refresh the data
        // alert('Updated amountSpecialDay to: ' + updatedValue);
      } catch (error) {
        console.error("Error updating amountSpecialDay:", error);
      }
    }

    // const id = await accountingData._id;
    // await alert(accountingData.accountingRecord[0].amountSpecialDay);
    // await alert(id);
  };

  function handleReLoad() {
    const fetchData = async () => {
      if (year !== "" && month !== "" && staffId !== "") {
        const dataTest = await {
          employeeId: staffId || "",
          year: year || "",
          month: month || "",
          updateStatus: updateStatus || "",
        };

        await setAddSalaryList([]);
        await axios
          .post(endpoint + "/accounting/calsalaryemp", dataTest)
          .then(async (response) => {
            const responseData = await response.data;
            // alert(JSON.stringify(responseData ,null,2));

            if (response.data) {
              if (updateStatus !== "") {
                alert("ระบบทำการคำนวนใหม่แล้ว กรุณากดค้นหาอีกครั้ง");
              }
              setUpdateStatus("");
              await setAccountingData(response.data[0]);
              await setWsAmountSpecialDay(
                response.data[0].accountingRecord.amountSpecialDay ||
                response.data[0].accountingRecord[0].amountSpecialDay
              );
              await setWsAmountSpecialDayx(
                response.data[0].accountingRecord.amountSpecialDay ||
                response.data[0].accountingRecord[0].amountSpecialDay
              );

              await setWsAmountDay(
                parseFloat(response.data[0].accountingRecord.amountDay) ||
                parseFloat(response.data[0].accountingRecord[0].amountDay)
              );
              await setWsAmountOt(
                response.data[0].accountingRecord.amountOt ||
                response.data[0].accountingRecord[0].amountOt
              );
              await setWsSocialSecurity(
                response.data[0].accountingRecord.socialSecurity ||
                response.data[0].accountingRecord[0].socialSecurity
              );
              await setWsSocialSecurityX(
                response.data[0].accountingRecord.socialSecurity ||
                response.data[0].accountingRecord[0].socialSecurity
              );

              await setWsTax(
                response.data[0].accountingRecord.tax ||
                response.data[0].accountingRecord[0].tax
              );
              await setWsTotal(
                response.data[0].accountingRecord.total ||
                response.data[0].accountingRecord[0].total
              );

              await setWsCountDayWork(
                response.data[0].accountingRecord.countDayWork ||
                response.data[0].accountingRecord[0].countDayWork
              );
              await setWsAmountCountDayWork(
                response.data[0].accountingRecord.amountCountDayWork ||
                response.data[0].accountingRecord[0].amountCountDayWork
              );
              await setWsAmountCountDayWorkOt(
                response.data[0].accountingRecord.amountCountDayWorkOt ||
                response.data[0].accountingRecord[0].amountCountDayWorkOt
              );
              await setWsCountHourWork(
                response.data[0].accountingRecord.countHourWork ||
                response.data[0].accountingRecord[0].countHourWork
              );
              await setWsCountOtHourWork(
                response.data[0].accountingRecord.countOtHourWork ||
                response.data[0].accountingRecord[0].countOtHourWork
              );

              await setAddSalaryList(response.data[0].addSalary);
              // if (response.data[0].addSalary) {
              //   let tmp = 0;
              //   response.data[0].addSalary.map((item) => {
              //     tmp += parseFloat(item.SpSalary);
              //   });
              //   setSumAddSalaryList(tmp);
              // }

              if (response.data[0].addSalary) {
                let tmp = 0;

                // Calculate the sum of SpSalary from response data
                response.data[0].addSalary.map((item) => {
                  tmp += parseFloat(item.SpSalary);
                });
                setSumAddSalaryList(tmp);

                // Merge addSalaryList with remainArray
                const mergedAddSalaryList = [
                  ...response.data[0].addSalary,
                  ...remainArray.map((remain) => ({
                    id: remain.id, // or generate a unique ID if needed
                    name: remain.welfareType,
                    SpSalary: remain.SpSalary,
                    roundOfSalary: remain.roundOfSalary,
                    StaffType: "", // If you need to add StaffType or other fields
                  })),
                ];

                // Set the updated addSalaryList
                setAddSalaryList(mergedAddSalaryList);

                // Recalculate the sum for the merged list
                let totalSalary = mergedAddSalaryList.reduce((acc, item) => acc + parseFloat(item.SpSalary || 0), 0);
                setSumAddSalaryList(totalSalary);
              }

              // alert(response.data[0].addSalary.length);
              setDeductSalaryList(response.data[0].deductSalary);
              // alert(JSON.stringify(response.data[0].addSalary,null,2));
            }
            const filteredData = responseData.filter(
              (item) => item.employeeId === staffId
            );
            setCalsalarylist(filteredData);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };

    // Call fetchData when year or month changes
    fetchData();
  }

  const options = [
    { id: "ลากิจ", name: "remainbusinessleave" },
    { id: "ลาป่วย", name: "remainsickleave" },
    { id: "ลาพักร้อน", name: "remainvacation" },
    { id: "ลาคลอด", name: "maternityleavesalary" },
    { id: "ลาเกณฑ์ทหาร", name: "militaryleave" },
    { id: "ลาเพื่อทำหมัน", name: "sterilization" },
    { id: "ลาเพื่อฝึกอบรม", name: "leavefortraining" },
  ];

  const [remainbusinessleave, setRemainbusinessleave] = useState("");
  const [remainsickleave, setRemainsickleave] = useState("");
  const [remainvacation, setRemainvacation] = useState("");
  const [maternityleavesalary, setMaternityleavesalary] = useState("");
  const [militaryleave, setMilitaryleave] = useState("");
  const [sterilization, setSterilization] = useState("");
  const [leavefortraining, setLeavefortraining] = useState("");

  // const options = [
  //   { id: "1231", name: "จ่ายลาป่วยมีใบแพทย์" },
  //   { id: "1233", name: "ชดเชยค่าแรงลาคลอด" },
  //   { id: "1422", name: "จ่ายคืนพักร้อน(ครบปี/ใช้สิทธิไม่หมด)" },
  //   { id: "1423", name: "ชดเชยวันลาพักร้อน(ประกันสังคม)" },
  //   { id: "1428", name: "ลากิจธุระจำเป็น (ประกันสังคม)" },
  //   { id: "1434", name: "วันหยุดตามประเพณี (ประกันสังคม)" },
  //   { id: "1435", name: "จ่ายคืนพักร้อน(ครบปี/ใช้สิทธิไม่หมด)รับล่วงหน้า" },
  //   { id: "1429", name: "ลากิจธุระจำเป็น (ประกันสังคม) รับล่วงหน้า" },
  //   { id: "1427", name: "ชดเชยวันลาพักร้อน (ประกันสังคม )รับล่วงหน้า" },
  //   { id: "1234", name: "จ่ายลาป่วยมีใบรับรองแพทย์(รับล่วงหน้า)" },
  //   { id: "1426", name: "จ่ายคืนค่าจ้างพักร้อน(ครบปี/ใช้สิทธิไม่หมด)" },
  //   { id: "1425", name: "ค่าจ้างในวันลาพักร้อน" },
  // ];
  const [selectedName, setSelectedName] = useState("");
  const [welfareUse, setWelfareUse] = useState(0);

  const handleSelectChange = (event) => {
    const value = String(event.target.value);
    let tmp = employeeList.find((employee) => employee.employeeId === staffId);
    if (tmp && value in tmp) {
      setSelectedName(tmp[value]);
    }

    // const selectedOption = options.find(
    //   (option) => option.id === event.target.value
    // );
    // setSelectedName(selectedOption ? selectedOption.name : "");
  };

  const [selectedName2, setSelectedName2] = useState("");

  const handleSelectChange2 = (event) => {
    const selectedOption = options.find(
      (option) => option.name === event.target.value
    );
    setSelectedName2(selectedOption ? selectedOption : "");
    // alert(selectedOption.name );
  };
  return (
    // <div>

    // </div>
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
            <li class="breadcrumb-item active">เงินเดือนรายบุคคล</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> เงินเดือนรายบุคคล
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">เงินเดือนรายบุคคล</h2>
              <section class="Frame">
                <div class="col-md-12">
                  {/* <form onSubmit={handleSearch}> */}
                  <form>
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
                              e.target.value = e.target.value.replace(/\D/g, "");
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
                            value={staffFullName == "null" ? "" : staffFullName}
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
                      <button
                        type="button"
                        class="btn b_save"
                        onClick={handleSearchAccounting}
                      >
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button>
                    </div>
                  </form>
                  <br />
                  {/* <div class="d-flex justify-content-center">
                    <h2 class="title">ผลลัพธ์ {searchResult.length} รายการ</h2>
                  </div> */}
                </div>
              </section>

              <h2 class="title">สรุปเงินเดือน</h2>
              <section class="Frame">
                {staffFullName ? (
                  <div class="row">
                    <div class="col-md-10">ชื่อ: {staffFullName}</div>
                    <div class="col-md-2">คำนวณเมื่อ {createDate}</div>
                  </div>
                ) : (
                  <div>
                    {/* Content to show when staffFullName is not set */}
                  </div>
                )}

                {/* {month ? (
                                    <div class="row">
                                        <div class="col-md-12">
                                            ตั้งแต่วันที่ 20 {thaiMonthLowerName} - 21 {thaiMonthName} ปี {year}
                                        </div>
                                    </div>) : (
                                    <div>
                                    </div>
                                )} */}

                <div class="row">
                  <div class="col-md-12">
                    ตั้งแต่วันที่ 21 {thaiMonthLowerName} - 20 {thaiMonthName}{" "}
                    ปี {parseInt(year, 10) + 543}
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>รวมวันทำงาน</th>
                          <th style={headerCellStyle}>รวมชั่วโมงทำงาน</th>
                          <th style={headerCellStyle}>รวมชั่วโมงOT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={cellStyle}>{wsCountDayWork}</td>
                          <td style={cellStyle}>
                            {Number(wsCountHourWork).toFixed(2)}
                          </td>
                          <td style={cellStyle}>
                            {Number(wsCountOtHourWork).toFixed(2)}
                          </td>

                          {/* <td style={cellStyle}>{(overallAllTimesSum123).toFixed(2)}</td> */}
                          {/* <td style={cellStyle}>{(overallOtTimesSum123).toFixed(2)}</td> */}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-12">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>เงินค่าจ้างปกติ</th>
                          <th style={headerCellStyle}>เงินค่าล่วงเวลา</th>
                          <th style={headerCellStyle}>เงินเพิ่ม</th>
                          {/* <th style={headerCellStyle}>เงินบวกอื่นๆ</th> */}
                          <th style={headerCellStyle}>รวมเงินได้</th>
                          <th style={headerCellStyle}>แก้ไข</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* sumSpSalary */}
                        <tr>
                          {/* <td style={cellStyle}>{(overWorkRateSum).toFixed(2)}</td>
                          <td style={cellStyle}>{(overWorkRateOTSum).toFixed(2)}</td> */}

                          <td style={cellStyle}>
                            {/* {isNaN(Number(wsAmountCountDayWork))
                              ? 0.0
                              : Number(wsAmountCountDayWork).toFixed(2)} */}
                            {
                              isNaN(Number(wsAmountCountDayWork))
                                ? "0.00"
                                : Number(wsAmountCountDayWork)
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                          </td>
                          <td style={cellStyle}>
                            {isNaN(Number(wsAmountCountDayWorkOt))
                              ? 0.0
                              : Number(wsAmountCountDayWorkOt).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>

                          {/* <td style={cellStyle}>{(overAddSalaryDaySum).toFixed(2) + (sumSpSalary).toFixed(2)}</td> */}
                          {/* <td style={cellStyle}>{(overAddSalaryDaySum + sumSpSalaryResult).toFixed(2) + `(` + (overAddSalaryDaySum).toFixed(2) + `+` + (sumSpSalaryResult).toFixed(2) + `)`}</td> */}
                          <td style={cellStyle}>
                            <span
                              onClick={togglePopup}
                              style={{ color: color, cursor: "pointer" }}
                            >
                              {/* {isNaN(Number(addAmountBeforeTax + addAmountAfterTax)) ? 0.00 : Number(addAmountBeforeTax + addAmountAfterTax).toFixed(2)}  */}
                              {sumAddSalaryList.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                            {showPopup && (
                              <div className="popup">
                                <h4>รายการเงินเพิ่ม</h4>
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  {addSalaryList &&
                                    addSalaryList.map(
                                      (addsalary, index) =>
                                        addsalary.name !== "" && (
                                          <li
                                            key={index}
                                            style={{ marginBottom: "10px" }}
                                          >
                                            {addsalary.name} - จำนวน:{" "}
                                            {addsalary.SpSalary}{" "}
                                            {addsalary.roundOfSalary ==
                                              "daily" && (
                                                <>* {addsalary.message} วัน</>
                                              )}
                                          </li>
                                        )
                                    )}
                                </ul>
                                <button onClick={togglePopup}>Close</button>
                              </div>
                            )}

                            {/* {(overAddSalaryDaySum + sumSpSalaryResult).toFixed(2)} */}

                            {/* {namelist.map((employee, index) => (
                              <tr key={index}>
                                <th style={headerCellStyle}>{employee.name}</th>
                                <td style={cellStyle}>{employee.salary}</td>
                              </tr>
                            ))} */}
                            {/* {isNaN(Number(addAmountBeforeTax + addAmountAfterTax)) ? 0.00 : Number(addAmountBeforeTax + addAmountAfterTax).toFixed(2)} */}
                          </td>
                          {/* <td style={cellStyle}>
                            <input
                              type="text"
                              className="form-control"
                              id="anySpSalary"
                              placeholder="เงินบวกอื่นๆ"
                              value={anySpSalary}
                              style={{ width: '50%' }}
                              onChange={handleAnySpSalaryChange}
                            />
                          </td> */}
                          {/* <td style={cellStyle}>{(overWorkRateSum + overWorkRateOTSum + overAddSalaryDaySum + sumSpSalaryResult).toFixed(2)}</td> */}
                          <td style={cellStyle}>
                            {/* {(amountDay + amountOt + addAmountBeforeTax + addAmountAfterTax).toFixed(2)} */}
                            {/* {isNaN( Number(wsAmountDay) + Number(wsAmountOt) + Number(wsAmountSpecialDay) +  Number(sumAddSalaryList)) ?
                              '0' :
                              (Number(wsAmountDay) + Number(wsAmountOt) + Number(wsAmountSpecialDay) + Number(sumAddSalaryList)).toFixed(2)

                            } */}
                            {isNaN(
                              Number(wsAmountDay) +
                              Number(wsAmountOt) +
                              Number(sumAddSalaryList)
                            )
                              ? "0"
                              : (
                                Number(wsAmountDay) +
                                Number(wsAmountOt) +
                                Number(sumAddSalaryList)
                              ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>

                          <td style={cellStyle}>
                            <button
                              type="button"
                              onClick={handleAddSalary}
                              class="btn btn-danger"
                              style={{ width: "4rem" }}
                            >
                              แก้ไข
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />

                <div class="row">
                  <div class="col-md-12">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>หักภาษี</th>
                          <th style={headerCellStyle}>หักประกันสังคม</th>
                          {/* <th style={headerCellStyle}>ธรรมเนียมธนาคาร</th> */}
                          <th style={headerCellStyle}>เงินหัก</th>
                          <th style={headerCellStyle}>รวมเงินหัก</th>
                          <th style={headerCellStyle}>แก้ไข</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={cellStyle}>
                            {isNaN(Number(wsTax))
                              ? 0.0
                              : Number(wsTax).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          {/* <td style={cellStyle}>{((overWorkRateSum + overWorkRateOTSum + overAddSalaryDaySum + sumSpSalaryResult + anySpSalary) * socialSecurity).toFixed(2)}</td> */}
                          {/* <td style={cellStyle}>{isNaN(Number(socialSecurity)) ? 0 : Number(socialSecurity).toFixed(0)}</td> */}
                          <td style={cellStyle}>
                            {isNaN(Number(wsSocialSecurity))
                              ? 0
                              : Math.ceil(Number(wsSocialSecurity))}
                          </td>
                          {/* <td style={cellStyle}>{isNaN(Number(bank)) ? 0.00 : Number(bank).toFixed(2)}</td> */}
                          {/* <td style={cellStyle}>
                            <input
                              type="text"
                              className="form-control"
                              id="anyMinus"
                              placeholder="หักอื่นๆ"
                              value={anyMinus}
                              style={{ width: '50%' }}
                              onChange={handleAnyMinusChange}
                            />
                          </td> */}
                          <td style={cellStyle}>
                            <span
                              onClick={togglePopup}
                              style={{ color: color, cursor: "pointer" }}
                            >
                              {isNaN(
                                Number(deductBeforeTax) + Number(deductAfterTax)
                              )
                                ? 0.0
                                : (
                                  Number(deductBeforeTax) +
                                  Number(deductAfterTax)
                                ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                            {showPopup && (
                              <div className="popup">
                                <h4>รายการเงินหัก</h4>
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  {deductSalaryList &&
                                    deductSalaryList.map(
                                      (deductSalary, index2) =>
                                        deductSalary.name !== "" && (
                                          <li
                                            key={index2}
                                            style={{ marginBottom: "10px" }}
                                          >
                                            {deductSalary.name} - จำนวน:{" "}
                                            {deductSalary.amount}
                                          </li>
                                        )
                                    )}
                                </ul>
                                {/* <button onClick={togglePopup}>Close</button> */}
                              </div>
                            )}
                            {/* {isNaN(Number(deductBeforeTax) + Number(deductAfterTax)) ? 0.00 : (Number(deductBeforeTax) + Number(deductAfterTax)).toFixed(2)} */}
                          </td>
                          <td style={cellStyle}>
                            {" "}
                            {isNaN(
                              Number(wsTax) +
                              Number(wsSocialSecurity) +
                              Number(deductBeforeTax) +
                              Number(deductAfterTax)
                            )
                              ? 0.0
                              : Math.ceil(
                                Number(wsTax) +
                                Number(wsSocialSecurity) +
                                Number(deductBeforeTax) +
                                Number(deductAfterTax)
                              ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          {/* <td style={cellStyle}>({anyMinus} + {tax} + {((overWorkRateSum + overWorkRateOTSum + overAddSalaryDaySum + sumSpSalaryResult + anySpSalary) * socialSecurity).toFixed()} + {bankCustom} + {sumDeduct} + {sumDeductInstallment})</td> */}
                          <td style={cellStyle}>
                            <button
                              type="button"
                              onClick={handleAddSalary}
                              class="btn btn-danger"
                              style={{ width: "4rem" }}
                            >
                              แก้ไข
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* <div class="col-md-2">
                    <button>แก้ไข</button>
                  </div> */}
                </div>
                <br />

                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>วันหยุดนักขัตฤกษ์</th>
                          <th style={headerCellStyle}>สวัสดิการ</th>
                          <th style={headerCellStyle}>ยอดรวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td style={cellStyle}>{isNaN((countSpecialDay - specialDayListWork) * specialDayRate) ? 0.00 : ((countSpecialDay - specialDayListWork) * specialDayRate).toFixed(2)}</td> */}
                          {/* <td style={cellStyle}>{workHoliday}</td> */}
                          <td style={cellStyle}>
                            {/* {amountSpecialDay} */}
                            <div class="row">
                              <div class="col-md-6">
                                <input
                                  type="number"
                                  className="form-control"
                                  id="staffId"
                                  placeholder=""
                                  value={wsAmountSpecialDay || ""}
                                  onChange={handleTmpamountChange}
                                />
                              </div>
                            </div>
                          </td>
                          <td style={cellStyle}></td>
                          <td style={cellStyle}>
                            {isNaN(Number(wsAmountSpecialDay))
                              ? 0.0
                              : Number(wsAmountSpecialDay).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />

                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>รวมเงินได้</th>
                          <th style={headerCellStyle}>รวมเงินหัก</th>
                          <th style={headerCellStyle}>เงินสุทธิ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* <td style={cellStyle}>{(totalSumSalary).toFixed(2)}</td>
                          <td style={cellStyle}>{isNaN( Number(wsAmountSpecialDay ) ) ? 3.00 : (Number(wsAmountSpecialDay) ).toFixed(2)}</td>
                          <td style={cellStyle}>{(totalSumSalary - totalSumDeduct).toFixed(2)}</td> */}

                          {/* <td style={cellStyle}>{isNaN(amountDay + amountOt + sumAddSalaryList) ? 0.00 : (amountDay + amountOt + sumAddSalaryList).toFixed(2)}</td>
                          <td style={cellStyle}>{isNaN(totalSumDeduct) ? 0.00 : (totalSumDeduct).toFixed(2)}</td>
                          <td style={cellStyle}>{isNaN(amountDay + amountOt + sumAddSalaryList - totalSumDeduct) ? 0.00 : (amountDay + amountOt + sumAddSalaryList - totalSumDeduct).toFixed(2)}</td> */}

                          <td style={cellStyle}>{wsTotalSum}</td>
                          {/* <td style={cellStyle}>{Math.ceil(wsTotalSumDeduct) }</td> */}
                          <td style={cellStyle}>
                            {isNaN(
                              Number(wsTax) +
                              Number(wsSocialSecurity) +
                              Number(deductBeforeTax) +
                              Number(deductAfterTax)
                            )
                              ? 0.0
                              : Math.ceil(
                                Number(wsTax) +
                                Number(wsSocialSecurity) +
                                Number(deductBeforeTax) +
                                Number(deductAfterTax)
                              ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          {/* <td style={cellStyle}>{totalSum - totalSumDeduct}</td> */}
                          <td style={cellStyle}>
                            {/* {isNaN(Number(total)) ? 0.00 : Number(total).toFixed(2)} */}
                            {/* {isNaN(Number(total)) ? 0.00 : (Math.ceil(Number(total) * 100) / 100).toFixed(2)} */}
                            {/* {isNaN(Number(wsTotal)) ? 0.00 : (Number(wsTotal)).toFixed(2)} */}
                            {/* {(Number(wsTotalSum) - Math.ceil(Number(wsTotalSumDeduct)) ).toFixed(2) || 0} */}
                            {(
                              Number(wsTotalSum) -
                              (isNaN(
                                Number(wsTax) +
                                Number(wsSocialSecurity) +
                                Number(deductBeforeTax) +
                                Number(deductAfterTax)
                              )
                                ? 0.0
                                : Math.ceil(
                                  Number(wsTax) +
                                  Number(wsSocialSecurity) +
                                  Number(deductBeforeTax) +
                                  Number(deductAfterTax)
                                ).toFixed(2))
                            ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-10"></div>
                  <div class="col-md-2">
                    <div class="line_btn">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("update")}
                        class="btn b_save"
                      >
                        <i class=""></i> &nbsp;คำนวณใหม่
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <div class="line_btn">
                <button
                  type="button"
                  onClick={handleSaveAccounting}
                  class="btn b_save"
                >
                  <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
                </button>

                {/* <Link to="/Salaryresult"> */}
                <button type="button" onClick={handleReLoad} class="btn clean">
                  <i class="far fa-window-close"></i> &nbsp;ยกเลิก
                </button>
                {/* </Link > */}
              </div>
              {/* {JSON.stringify(employee.addSalary,null,2)} */}
              <h2 class="title">สรุปวันลา</h2>
              <section class="Frame">
                <div class="row">
                  <div class="col-md-8">
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={headerCellStyle}>สิทธิการลา</th>
                          <th style={headerCellStyle}>จำนวนวัน</th>
                          <th style={headerCellStyle}>ใช้สิทธิแล้ว</th>
                          <th style={headerCellStyle}>สิทธิคงเหลือ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {options.map((option) => (
                          
                          <tr key={option.id}>
                            <td style={cellStyle}>{option.id}</td>
                            <td style={cellStyle}>
                              {empDataSelect &&
                              empDataSelect[option.name] !== undefined
                                ? empDataSelect[option.name]
                                : "0"}
                            </td>

                            <td style={cellStyle}>
                              {welfareTypeCountMap[option.name] || 0}
                            </td>
                            <td style={cellStyle}>
                            </td>
                          </tr>
                        ))} */}
                        {options.map((option) => {
                          const empDataValue =
                            empDataSelect &&
                              empDataSelect[option.name] !== undefined
                              ? empDataSelect[option.name]
                              : 0;
                          const welfareTypeCount =
                            welfareTypeCountMap[option.name] || 0;

                          return (
                            <tr key={option.id}>
                              <td style={cellStyle}>{option.id}</td>
                              <td style={cellStyle}>{empDataValue}</td>
                              <td style={cellStyle}>{welfareTypeCount}</td>
                              <td style={cellStyle}>
                                {/* Display the subtraction result */}
                                {empDataValue - welfareTypeCount}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-2">
                    <label role="agencyname">วันที่</label>
                  </div>
                  <div class="col-md-2">
                    <label role="agencyname">ประเภทการลา</label>
                  </div>
                  <div class="col-md-2">
                    <label role="">รหัสเงินเพิ่มเงินหัก</label>
                  </div>
                  <div class="col-md-2">
                    <label role="">ชื่อ</label>
                  </div>

                  <div class="col-md-2">
                    <label role="agencyname">จำนวนเงิน</label>
                  </div>
                  <div class="col-md-2">
                    <label role="agencyname"></label>
                  </div>
                  <div class="col-md-2">
                    <label role="agencyname">หมายเหตุ</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <div
                      style={{
                        position: "relative",
                        zIndex: 9999,
                        marginLeft: "0rem",
                      }}
                    >
                      {/* <DatePicker
                        className="form-control"
                        selected={selectedThaiDate}
                        onChange={handleThaiDateChange}
                        dateFormat="dd/MM/yyyy"
                        locale={th}
                      /> */}
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
                          {formattedDate321 ? formattedDate321 : "Select Date"}
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
                  <div class="col-md-2">
                    <select
                      onChange={handleSelectChange2}
                      className="form-control"
                    >
                      <option value="">เลือกตัวเลือก</option>
                      {options.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={remainCode}
                      onChange={handleRemainCodeChange}
                      placeholder="รหัส"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={remainName}
                      onChange={handleRemainNameChange}
                      placeholder="ชื่อ"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={remainSalary}
                      onChange={handleRemainSalaryChange}
                      placeholder="บาท"
                    />
                  </div>
                  <div class="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={remainComment}
                      onChange={handleRemainCommentChange}
                      placeholder="หมายเหตุ"
                    />
                  </div>
                </div>
                <br />
                <div class="row">
                  <div class="col-md-2"></div>
                  <div class="col-md-2"></div>
                  <div class="col-md-2"></div>
                  <div class="col-md-2"></div>
                  <div class="col-md-2"></div>
                  <div class="col-md-2">
                    <button
                      type="button"
                      onClick={handleAddData}
                      class="btn b_save"
                    >
                      <i class="custom-icon-font"> + </i>เพิ่ม
                    </button>
                  </div>
                </div>
                <br />
                <table border="1" style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={headerCellStyle}>No.</th>
                      <th style={headerCellStyle}>วันที่</th>
                      <th style={headerCellStyle}>รายการ</th>
                      <th style={headerCellStyle}>รหัสเงินเพิ่มเงินหัก</th>
                      <th style={headerCellStyle}>ชื่อ</th>
                      <th style={headerCellStyle}>จำนวนเงิน</th>
                      <th style={headerCellStyle}>หมายเหตุ</th>
                      <th style={headerCellStyle}>ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {remainArray.map((data, index) => (
                      <tr key={index}>
                        <td style={cellStyle}>{index + 1}</td>
                        <td style={cellStyle}>
                          {/* {data.startDay.toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} */}
                          {new Date(data.startDay)
                            .toLocaleDateString("th-TH", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/(\d{4})/, (match) => parseInt(match, 10))}
                        </td>
                        <td style={cellStyle}>{data.welfareType}</td>

                        <td style={cellStyle}>{data.id}</td>
                        <td style={cellStyle}>{data.name}</td>
                        <td style={cellStyle}>{data.SpSalary}</td>
                        <td style={cellStyle}>{data.comment}</td>
                        <td style={cellStyle}>
                          <button
                            class="btn btn-danger"
                            style={{ width: "4rem" }}
                            onClick={() => handleDeleteData(index)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <br />
                <div class="row">
                  <div class="col-md-6"></div>
                  <div class="col-md-6">
                    <button
                      type="button"
                      class="btn b_save"
                      style={{ width: "8rem" }}
                      onClick={handleSaveWelfare}
                    >
                      บันทึกการลา
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </body>
  );
}

export default Salaryresult;
