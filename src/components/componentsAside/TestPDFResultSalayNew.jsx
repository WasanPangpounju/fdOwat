import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import "jspdf-autotable";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import employeeData from "./accounting.json"; // นำเข้าไฟล์ JSON

import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data
function TestPDFResultSalayNew({ employeeList, workplaceList }) {
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน

  const [searchWorkplaceId, setSearchWorkplaceId] = useState("");
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  const [employeeListAll, setEmployeeListAll] = useState([]);

  const [staffId, setStaffId] = useState(""); //รหัสหน่วยงาน
  const [staffName, setStaffName] = useState(""); //รหัสหน่วยงาน
  const [staffLastname, setStaffLastname] = useState(""); //รหัสหน่วยงาน
  const [staffFullName, setStaffFullName] = useState(""); //รหัสหน่วยงาน

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");

  const [responseDataAll, setResponseDataAll] = useState([]);

  const [month, setMonth] = useState("01");
  const currentYear = new Date().getFullYear(); // 2024

  const [year, setYear] = useState(currentYear);
  const EndYear = 2010;
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  const [selectedOption, setSelectedOption] = useState("option1");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    // Set setStaffId based on the selected option
    if (value === "option1") {
      setStaffId("");
      setSearchEmployeeId("");
      setStaffName("");
      setStaffFullName("");
      setSearchEmployeeName("");

      setResponseDataAll("");
    } else if (value === "option2") {
      // Set setStaffId to another value if needed
      setWorkplacrId("");
      setWorkplacrName("");

      setResponseDataAll("");
    }
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/employee/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setEmployeeListAll(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchData = () => {
      const dataTest = {
        year: year,
        month: month,
      };


      axios
        .post(endpoint + "/accounting/calsalarylist", dataTest)
        .then((response) => {

          if (selectedOption == "option1") {
            // const responseData = response.data;
            const responseData = employeeData;
            console.log('responseData', responseData);
            // Filter data based on searchWorkplaceId if provided
            const filteredData = searchWorkplaceId
              ? responseData.filter(
                (item) => item.workplace === searchWorkplaceId
              )
              : responseData;

            // Sort filteredData by workplace in ascending order
            filteredData.sort((a, b) => {
              // Convert workplace values to numbers for comparison
              const workplaceA = Number(a.workplace);
              const workplaceB = Number(b.workplace);

              // Compare workplace values
              if (workplaceA < workplaceB) {
                return -1; // a should come before b
              }
              if (workplaceA > workplaceB) {
                return 1; // a should come after b
              }
              return 0; // workplace values are equal
            });
            // searchEmployeeId
            const updatedData = filteredData.map(item => {
              const matchingEmployee = employeeList.find(emp => emp.employeeId === item.employeeId);

              if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
                // Modify the workplace by changing the first digit to '2'
                item.workplace = "2" + item.workplace.slice(1);
              }

              return item;
            });

            setResponseDataAll(updatedData);
          } else if (selectedOption == "option2") {
            // const responseData = response.data;
            const responseData = employeeData;
            console.log('responseData', responseData);

            // Filter data based on searchWorkplaceId if provided
            const filteredData = searchEmployeeId
              ? responseData.filter(
                (item) => item.employeeId === searchEmployeeId
              )
              : responseData;

            // Sort filteredData by workplace in ascending order
            filteredData.sort((a, b) => {
              // Convert workplace values to numbers for comparison
              const workplaceA = Number(a.workplace);
              const workplaceB = Number(b.workplace);

              // Compare workplace values
              if (workplaceA < workplaceB) {
                return -1; // a should come before b
              }
              if (workplaceA > workplaceB) {
                return 1; // a should come after b
              }
              return 0; // workplace values are equal
            });

            const updatedData = filteredData.map(item => {
              const matchingEmployee = employeeList.find(emp => emp.employeeId === item.employeeId);

              if (matchingEmployee && matchingEmployee.costtype === "ภ.ง.ด.3") {
                // Modify the workplace by changing the first digit to '2'
                item.workplace = "2" + item.workplace.slice(1);
              }

              return item;
            });

            setResponseDataAll(updatedData);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    // Call fetchData when year, month, or searchWorkplaceId changes
    fetchData();
  }, [year, month, searchWorkplaceId, searchEmployeeId]);

  const handleStaffIdChange = (e) => {
    const selectWorkPlaceId = e.target.value;
    setWorkplacrId(selectWorkPlaceId);
    setSearchWorkplaceId(selectWorkPlaceId);
    // Find the corresponding employee and set the staffName
    const selectedWorkplace = workplaceListAll.find(
      (workplace) => workplace.workplaceId == selectWorkPlaceId
    );
    if (selectWorkPlaceId) {
      // setStaffName(selectedEmployee.name);
      // setStaffLastname(selectedEmployee.lastName);
      setWorkplacrName(selectedWorkplace.workplaceName);
    } else {
      setWorkplacrName("");
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
      setWorkplacrId(selectedEmployee.workplaceId);
      setSearchWorkplaceId(selectedEmployee.workplaceId);
      // setWorkplacrName(selectedEmployee.workplaceName);
    } else {
      setWorkplacrId("");
      // setSearchWorkplaceId('');
      // setWorkplacrName('');
    }
    setWorkplacrName(selectWorkplaceName);
  };

  const handleStaffIdChange2 = (e) => {
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

  const handleStaffNameChange2 = (e) => {
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

  const generatePDF = () => {
    const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
    const ages = [25, 30, 22, 35, 28];

    // Create a new instance of jsPDF
    const pdf = new jsPDF();

    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, "THSarabunNew", "normal");

    // Add bold font
    const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

    // const boldFontPath = '/assets/fonts/THSarabunNew Bold.ttf';
    // pdf.addFileToVFS(boldFontPath);
    // pdf.addFont(boldFontPath, 'THSarabunNew Bold', 'normal');

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

    // Set the initial position for text and frame
    let x = 20;

    // pdf.setFont('THSarabunNew');
    pdf.setFont("THSarabunNew Bold");

    // Loop through the names and ages arrays to add content to the PDF
    for (let i = 0; i < responseDataAll.length; i += 2) {
      // Add a page for each pair of names
      if (i > 0) {
        pdf.addPage();
      }

      // เรียงarray
      const countSpecialDayListWork =
        responseDataAll[i].specialDayListWork.length;
      // const countcal = responseDataAll[i].accountingRecord[0].countDay - countSpecialDayListWork;
      // const countcal = responseDataAll[i].accountingRecord[0].countDayWork
      const countcal = responseDataAll[i].accountingRecord[0].countDayWork;

      // 2.0
      const formattedAmountHoliday2_0 = Number(
        countSpecialDayListWork * responseDataAll[i].specialDayRate ?? 0
      );

      // รถโทรตำแหน่ง
      const formattedAddTel = Number(
        responseDataAll[i].accountingRecord[0].tel || 0
      );
      const formattedAddAmountPosition = Number(
        responseDataAll[i].accountingRecord[0].amountPosition || 0
      );
      const formattedAddTravel = Number(
        responseDataAll[i].accountingRecord[0].travel || 0
      );

      // The IDs you want to exclude
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryFiltered = responseDataAll[i].addSalary
        .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      // จ่างชดเชย
      const excludedIdsPayCompensation = [
        "1231",
        "1233",
        "1422",
        "1423",
        "1428",
        "1434",
        "1435",
        "1429",
        "1427",
        "1234",
        "1426",
        "1425",
      ];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryPayCompensationFiltered = responseDataAll[i].addSalary
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));


      const formattedAddTelAmountPositionTravel =
        formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

      // เบี้ยขยัน
      const formattedAmountHardWorking = responseDataAll[i].addSalary.filter(
        (item) => item.id === "1410"
      );

      // ค่าเดินทาง(ไม่คิดประกัน)
      const formattedAddSalaryTavel = responseDataAll[i].addSalary.filter(
        (item) => item.id === "1535"
      );
      // Calculate the sum of SpSalary values in the filtered array
      const sumAmountHardWorking = formattedAmountHardWorking.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );


      // Calculate the sum of SpSalary values in the filtered array
      const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );

      // นักขัติ
      const countSpecialDayWork = responseDataAll[i].countSpecialDay;
      const formattedAmountHoliday = Number(
        responseDataAll[i].countSpecialDay *
        responseDataAll[i].specialDayRate ?? 0
      );

      //เงินพิเศษ
      const formattedSumAddSalaryAfterTax = Number(
        responseDataAll[i].accountingRecord[0].sumAddSalaryAfterTax ?? 0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      //หัก
      // คืนเงินเบิกล่วงหน้า
      const advancePayment = parseFloat(
        responseDataAll[i].accountingRecord[0].advancePayment || 0
      ).toFixed(2);

      pdf.setFontSize(15);

      pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);

      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);

      pdf.setFontSize(12);

      const head = 25;
      const head2 = 155;

      pdf.text(`รหัส`, 7, head);
      pdf.text(`ชื่อ-สกุล`, 40, head);
      pdf.text(`หน่วยงาน`, 80, head);
      pdf.text(`${responseDataAll[i].workplace}`, 93, head);

      const workplace = workplaceList.find(
        (item) => item.workplaceId === responseDataAll[i].workplace
      );

      // Use the found workplaceName or a default value
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";

      // Add it to the PDF
      pdf.text(`${workplaceName}`, 103, head);

      // const bankCheck = employeeList.find(
      //   (item) => item.workplace === responseDataAll[i].workplace
      // );

      // const banknumber = banknumber ? bankCheck.banknumber : "Unknown";

      const bankCheck = employeeList.find(
        (item) => item.workplace === responseDataAll[i].workplace
      );

      // กำหนดค่า banknumber โดยตรวจสอบว่ามีค่าใน bankCheck หรือไม่
      const banknumber = bankCheck && bankCheck.banknumber ? bankCheck.banknumber : "Unknown";

      // เพิ่มข้อมูล banknumber ลงใน PDF
      pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head);


      // const namesWithSpecificIds = responseDataAll[i].addSalary
      //   // "1230" || item.id === "1520" || item.id === "1350"
      //   // .filter((item) => ["1230", "1520", "1350"].includes(item.id)) // Filter based on specific IDs
      //   .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
      //   .map((item) => item.name); // Extract names

      const namesWithSpecificIds = responseDataAll[i].addSalary
        .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
        .map((item) => {
          // Check if the item.id is 1350 and modify item.name
          if (item.id === "1350") {
            return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
          }
          return item.name; // Otherwise, keep the original name
        });


      // Concatenate names if there are any
      const concatenatedNames =
        namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
      // Show concatenated names in the PDF

      // Draw a square frame around the first name
      pdf.rect(7, 28, 155, 74); //ตารางหลัก
      pdf.rect(7, 28, 155, 12); //ตารางหลัก หัวตาราง

      pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
      pdf.rect(7, 28, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
      pdf.text(`รายได้`, 24, 34); //ตารางหลัก รายได้
      pdf.text(`Earnings`, 22, 37); //ตารางหลัก Earnings

      const textArray = [];
      const countArray = [];
      const valueArray = [];

      if (
        responseDataAll[i].accountingRecord[0].amountDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountDay != null
      ) {
        // Push the text to textArray and the value to valueArray
        // textArray.push('อัตรา');
        // countArray.push('');
        // valueArray.push(responseDataAll[i].accountingRecord.amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].specialDayRate;

        if (accountingRecord) {
          const amountDay = parseFloat(accountingRecord);

          if (amountDay != 0 && amountDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("อัตรา");
            countArray.push("");
            valueArray.push(
              amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("1");
      }
      if (
        responseDataAll[i].accountingRecord.amountDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountDay != null
      ) {
        // Push the text to textArray and the value to valueArray
        // textArray.push('เงินเดือน');
        // countArray.push(countcal);
        // valueArray.push(responseDataAll[i].accountingRecord?.[0].amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const amountCountDayWork = parseFloat(
            accountingRecord.amountCountDayWork
          );

          if (amountCountDayWork != 0 && amountCountDayWork != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("เงินเดือน");
            countArray.push(countcal);
            valueArray.push(
              amountCountDayWork
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("2");
      }
      if (0 != 0 && null != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าล่วงเวลา 1 เท่า");
        countArray.push("");
        valueArray.push(
          responseDataAll[i].accountingRecord.amountDay
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("3");
      }
      // if (responseDataAll[i].accountingRecord[0].amountOt != 0 && responseDataAll[i].accountingRecord[0].amountOt != null) {
      if (
        responseDataAll[i].accountingRecord[0].amountOneFive != 0 &&
        responseDataAll[i].accountingRecord[0].amountOneFive != null
      ) {
        // Push the text to textArray and the value to valueArray
        // textArray.push('ค่าล่วงเวลา 1.5 เท่า');
        // countArray.push(responseDataAll[i].accountingRecord[0].countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        // valueArray.push(responseDataAll[i].accountingRecord[0].amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourOneFive);
          const amountOt = parseFloat(accountingRecord.amountOneFive);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 1.5 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("4");
      }
      // if (countSpecialDayListWork !== 0 && countSpecialDayListWork !== null) {
      if (
        responseDataAll[i].accountingRecord[0].amountTwo != 0 &&
        responseDataAll[i].accountingRecord[0].amountTwo != null
      ) {
        // Push the text to textArray and the value to valueArray
        // textArray.push('ค่าล่วงเวลา 2 เท่า');
        // countArray.push('');
        // valueArray.push(formattedAmountHoliday2_0.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourTwo);
          const amountOt = parseFloat(accountingRecord.amountTwo);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 2 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("5");
      }
      // if (0 != 0 && null != null) {
      if (
        responseDataAll[i].accountingRecord[0].amountThree != 0 &&
        responseDataAll[i].accountingRecord[0].amountThree != null
      ) {
        // Push the text to textArray and the value to valueArray
        // textArray.push('ค่าล่วงเวลา 3 เท่า');
        // countArray.push('');
        // valueArray.push(responseDataAll[i].accountingRecord.amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourThree);
          const amountOt = parseFloat(accountingRecord.amountThree);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 3 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("6");
      }
      //รถโทรตำแหน่ง
      if (
        formattedAddTelAmountPositionTravel != 0 &&
        formattedAddTelAmountPositionTravel != null
      ) {
        // Push the text to textArray and the value to valueArray
        textArray.push(concatenatedNames);
        countArray.push("");
        valueArray.push(
          formattedAddTelAmountPositionTravel
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7");
      }

      //ค่าเดินทาง(ไม่คิดประกัน)
      if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าเดินทาง");
        countArray.push("");
        valueArray.push(
          sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7.1");
      }

      if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
        textArray.push("เบี้ยขยัน");
        countArray.push("");
        valueArray.push(
          sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("8");
      }

      if (
        responseDataAll[i].accountingRecord[0].amountSpecialDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountSpecialDay != null
      ) {
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);

          const amountSpecialDay = parseFloat(
            accountingRecord.amountSpecialDay
          );

          const specialDayListWorks = responseDataAll[i].specialDayListWork
            ? responseDataAll[i].specialDayListWork.length
            : 0;
          const countSpecialDay = parseFloat(
            responseDataAll[i].countSpecialDay
          );
          const countspecialDayF = countSpecialDay - specialDayListWorks;

          if (amountSpecialDay !== 0 && amountSpecialDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("วันหยุดนักขัติฤกษ์");
            countArray.push(
              countspecialDayF.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountSpecialDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }

        console.log("9");
      }

      const totalSpSalary = addSalaryFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalary = totalSpSalary
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensationNumber = parseFloat(
        formattedTotalSpSalaryCompensation.replace(/,/g, "")
      );


      if (totalSpSalary !== 0) {
        textArray.push("รวมเงินพิเศษ");
        countArray.push(""); // You can add the count if needed or leave it as an empty string
        valueArray.push(formattedTotalSpSalary);
      }

      // if (formattedTotalSpSalaryCompensation !== 0) {
      if (
        totalSpSalaryCompensationNumber !== 0 &&
        totalSpSalaryCompensationNumber != null
      ) {
        textArray.push("จ่ายชดเชยวันลา");
        countArray.push("");
        valueArray.push(formattedTotalSpSalaryCompensation);
        console.log("11");
      }

      const textDedustArray = [];
      const valueDedustArray = [];

      if (advancePayment != 0 && advancePayment != null) {
        textDedustArray.push("คืนเงินเบิกล่วงหน้า");
        valueDedustArray.push(advancePayment);
        console.log("de1");
      }
      if (
        responseDataAll[i].accountingRecord[0].tax != 0 &&
        responseDataAll[i].accountingRecord[0].tax != null
      ) {
        // textDedustArray.push('หักภาษีเงินได้');
        // valueDedustArray.push(responseDataAll[i].accountingRecord.tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const tax = parseFloat(accountingRecord.tax);

          if (tax !== 0 && !isNaN(tax)) {
            textDedustArray.push("หักภาษีเงินได้");
            valueDedustArray.push(
              tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de2");
      }
      if (
        responseDataAll[i].accountingRecord[0].socialSecurity != 0 &&
        responseDataAll[i].accountingRecord[0].socialSecurity != null
      ) {
        // textDedustArray.push('หักสมทบประกันสังคม');
        // valueDedustArray.push(responseDataAll[i].accountingRecord[0].socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const socialSecurity = parseFloat(accountingRecord.socialSecurity);

          if (socialSecurity !== 0 && !isNaN(socialSecurity)) {
            textDedustArray.push("หักสมทบประกันสังคม");
            valueDedustArray.push(
              socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de3");
      }

      pdf.rect(7, 28, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
      pdf.text(`จำนวน`, 56, 34); //ตารางหลัก จำนวน
      pdf.text(`Number`, 55, 37); //ตารางหลัก Number

      pdf.rect(69, 28, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
      pdf.text(`จำนวนเงิน`, 74, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 75, 37); //ตารางหลัก Amount

      pdf.rect(69, 28, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 102, 34); //รายการหัก / รายการคืน
      // pdf.text(`Amount`, 75, 38);//ตารางหลัก

      ///////// รวมเงินได้
      pdf.text(`รวมเงินได้`, 28, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Earninng`, 23, 100); //ตารางหลัก Earnings

      /////  รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 100, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Deduction`, 105, 100); //ตารางหลัก Earnings

      pdf.text(`จำนวนเงิน`, 144, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 145, 37); //ตารางหลัก Amount

      pdf.rect(162 + 9, 28, 25, 25); //ตารางวันที่จ่าย
      pdf.rect(162 + 9, 28, 25, 15); //ตารางวันที่จ่าย
      pdf.text(`วันที่จ่าย`, 180, 35); //ตารางหลัก วันที่จ่าย
      pdf.text(`Payroll Date`, 177, 38); //ตารางหลัก Payroll Date

      pdf.rect(162 + 9, 77, 25, 25); //ตารางเงินรับสุทธิ
      pdf.rect(162 + 9, 77, 25, 15); //ตารางเงินรับสุทธิ
      pdf.text(`เงินรับสุทธิ`, 178, 84); //ตารางหลัก วันที่จ่าย
      pdf.text(`Net To Pay`, 177, 87); //ตารางหลัก Payroll Date

      pdf.rect(7, 104, 155, 13); //ตาราง 2
      pdf.rect(7, 104, 155, 6.5); //ตาราง 2 เส็นกลาง

      let x1 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, 104, x1, 13); //ตาราง 2
        x1 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, 108); //ตารางหลัก Earnings
      pdf.text(`ภาษีสะสมต่อปี`, 40, 108); //ตารางหลัก Earnings
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108); //ตารางหลัก Earnings
      pdf.text(`เงินประกันสะสมต่อปี`, 102, 108); //ตารางหลัก Earnings
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108); //ตารางหลัก Earnings

      pdf.rect(112, 119, 50, 12); //ตาราง 3
      pdf.text(`ลงชื่อพนักงาน`, 125, 130); //ตารางหลัก Earnings

      pdf.text(`${responseDataAll[i].employeeId}`, 13, head);
      pdf.text(
        `${responseDataAll[i].name} ${responseDataAll[i].lastName}`,
        50,
        head
      );


      let y = 44; // Initial y position

      textArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 8, y);

        // Increment y position for the next line
        y += 4.1;
      });

      let y2 = 44; // Initial y position

      countArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 68, y2, { align: "right" });

        // Increment y position for the next line
        y2 += 4.1;
      });

      let y3 = 44; // Initial y position

      valueArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 92, y3, { align: "right" });

        // Increment y position for the next line
        y3 += 4.1;
      });

      let y4 = 44; // Initial y position

      textDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 94, y4);

        // Increment y position for the next line
        y4 += 4.1;
      });
      let y5 = 44; // Initial y position

      valueDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 160, y5, { align: "right" });

        // Increment y position for the next line
        y5 += 4.1;
      });

      //รวมเงินได้
      const sumAddSalaryAfterTax = parseFloat(
        responseDataAll[i].accountingRecord.sumAddSalaryAfterTax ?? 0
      );
      const formattedSumAddSalaryAfterTax1 =
        sumAddSalaryAfterTax.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      // setWsTotalSum((Number(wsAmountDay || 0 ) + Number(wsAmountOt || 0) + Number(wsTax || 0 ) + Number(wsAmountSpecialDay || 0) + Number(sumAddSalaryList || 0)).toFixed(2) || 0);

      const amountDay =
        parseFloat(responseDataAll[i].accountingRecord[0].amountDay) || 0;
      const amountOt =
        parseFloat(responseDataAll[i].accountingRecord[0].amountOt) || 0;
      const sumAddSalary =
        parseFloat(responseDataAll[i].accountingRecord[0].sumAddSalary) || 0;
      const amountSpecialDay =
        parseFloat(responseDataAll[i].addSalary.amountSpecialDay) || 0;
      const specialDayRate = parseFloat(responseDataAll[i].specialDayRate) || 0;

      // const sumAddSalaryList = parseFloat(responseDataAll[i].addSalary.sumAddSalaryList) || 0;sumAddSalary

      const sumSalary = amountDay + amountOt + sumAddSalary + specialDayRate;
      pdf.text(
        `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        92,
        96,
        { align: "right" }
      );

      //รวมเงินหัก

      const tax = parseFloat(responseDataAll[i].accountingRecord[0].tax) || 0;
      const socialSecurity =
        parseFloat(responseDataAll[i].accountingRecord[0].socialSecurity) || 0;
      const advancePayment2 = parseFloat(advancePayment) || 0;

      // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

      const sumDeductSalary = advancePayment2 + tax + socialSecurity;

      pdf.text(
        `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        160,
        96,
        { align: "right" }
      );

      pdf.text(
        `${(sumSalary - sumDeductSalary)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        188,
        98,
        { align: "right" }
      );

      // pdf.text(`Age: ${ages[i]}`, x + 10, 60);

      // Move to the next column
      // x += 80;

      // Draw a square frame around the second name if available
      if (i + 1 < responseDataAll.length) {
        pdf.setFontSize(15);

        // เรียงarray
        const countSpecialDayListWork =
          responseDataAll[i + 1].specialDayListWork.length;
        const countcal =
          responseDataAll[i + 1].accountingRecord[0].countDay -
          countSpecialDayListWork;

        // 2.0
        const formattedAmountHoliday2_0 = Number(
          countSpecialDayListWork * responseDataAll[i + 1].specialDayRate ?? 0
        );

        // รถโทรตำแหน่ง
        const formattedAddTel = Number(
          responseDataAll[i + 1].accountingRecord.tel || 0
        );
        const formattedAddAmountPosition = Number(
          responseDataAll[i + 1].accountingRecord.amountPosition || 0
        );
        const formattedAddTravel = Number(
          responseDataAll[i + 1].accountingRecord.travel || 0
        );

        const formattedAddTelAmountPositionTravel =
          formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

        // เบี้ยขยัน
        const formattedAmountHardWorking = responseDataAll[
          i + 1
        ].addSalary.filter((item) => item.id === "1410");

        // ค่าเดินทาง(ไม่คิดประกัน)
        const formattedAddSalaryTavel = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1535"
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAmountHardWorking = formattedAmountHardWorking.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // นักขัติ
        const countSpecialDayWork = responseDataAll[i + 1].countSpecialDay;
        const formattedAmountHoliday = Number(
          responseDataAll[i + 1].countSpecialDay *
          responseDataAll[i + 1].specialDayRate ?? 0
        );

        // //เงินพิเศษ
        const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryFiltered = responseDataAll[i + 1].addSalary
          .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));

        const totalSpSalary = addSalaryFiltered.reduce(
          (sum, salary) => sum + salary.SpSalary,
          0
        );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalary = totalSpSalary
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // จ่างชดเชย
        const excludedIdsPayCompensation = [
          "1231",
          "1233",
          "1422",
          "1423",
          "1428",
          "1434",
          "1435",
          "1429",
          "1427",
          "1234",
          "1426",
          "1425",
        ];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryPayCompensationFiltered = responseDataAll[
          i + 1
        ].addSalary
          .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));

        const totalSpSalaryCompensation =
          addSalaryPayCompensationFiltered.reduce(
            (sum, salary) => sum + salary.SpSalary,
            0
          );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const totalSpSalaryCompensationNumber = parseFloat(
          formattedTotalSpSalaryCompensation.replace(/,/g, "")
        );

        //หัก
        // คืนเงินเบิกล่วงหน้า
        const advancePayment = parseFloat(
          responseDataAll[i + 1].accountingRecord[0].advancePayment || 0
        ).toFixed(2);

        const textArray = [];
        const countArray = [];
        const valueArray = [];

        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {

          const accountingRecord = responseDataAll[i + 1].specialDayRate;

          if (accountingRecord) {
            const amountDay = parseFloat(accountingRecord);

            if (amountDay != 0 && amountDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("อัตรา");
              countArray.push("");
              valueArray.push(
                amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("11");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.amountCountDayWork
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("เงินเดือน");
              countArray.push(countcal);
              valueArray.push(
                amountCountDayWork
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("22");
        }
        if (0 != 0 && null != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าล่วงเวลา 1 เท่า");
          countArray.push("");
          valueArray.push(
            responseDataAll[i + 1].accountingRecord.amountDay
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("33");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != null
        ) {

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const countOtHour = parseFloat(accountingRecord.hourOneFive);
            const amountOt = parseFloat(accountingRecord.amountOneFive);

            if (countOtHour != 0 && countOtHour != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 1.5 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("44");
        }

        // if (countSpecialDayListWork !== 0 && countSpecialDayListWork !== null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountTwo != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountTwo != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {

            const countOtHour = parseFloat(accountingRecord.hourTwo);
            const amountOt = parseFloat(accountingRecord.amountTwo);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 2 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("55");
        }
        // if (0 != 0 && null != null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountThree != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountThree != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            // const amountOt = parseFloat(accountingRecord.amountOt);
            // const countOtHour = parseFloat(accountingRecord.countOtHour);
            const countOtHour = parseFloat(accountingRecord.hourThree);
            const amountOt = parseFloat(accountingRecord.amountThree);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 3 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("66");
        }
        //รถโทรตำแหน่ง
        if (
          formattedAddTelAmountPositionTravel != 0 &&
          formattedAddTelAmountPositionTravel != null
        ) {
          // Push the text to textArray and the value to valueArray
          textArray.push(concatenatedNames);
          countArray.push("");
          valueArray.push(
            formattedAddTelAmountPositionTravel
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77");
        }
        //ค่าเดินทาง(ไม่คิดประกัน)
        if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าเดินทาง");
          countArray.push("");
          valueArray.push(
            sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
        if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
          textArray.push("เบี้ยขยัน");
          countArray.push("");
          valueArray.push(
            sumAmountHardWorking
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("88");
        }
        // if (countSpecialDayListWork !== 0 && countSpecialDayListWork !== null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];


          if (accountingRecord) {

            const amountSpecialDay = parseFloat(
              accountingRecord.amountSpecialDay
            );

            const specialDayListWorks = responseDataAll[i + 1]
              .specialDayListWork
              ? responseDataAll[i + 1].specialDayListWork.length
              : 0;
            const countSpecialDay = parseFloat(
              responseDataAll[i + 1].countSpecialDay
            );
            const countspecialDayF = countSpecialDay - specialDayListWorks;

            if (amountSpecialDay !== 0 && amountSpecialDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("วันหยุดนักขัติฤกษ์");
              countArray.push(
                countspecialDayF
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountSpecialDay
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }

          console.log("99");
        }


        if (formattedTotalSpSalary != 0 && formattedTotalSpSalary != null) {
          textArray.push("เงินเพิ่มพิเศษ");
          countArray.push("");
          valueArray.push(
            formattedTotalSpSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("1010");
        }

        if (
          totalSpSalaryCompensationNumber !== 0 &&
          totalSpSalaryCompensationNumber != null
        ) {
          textArray.push("จ่ายชดเชยวันลา");
          countArray.push("");
          valueArray.push(formattedTotalSpSalaryCompensation);
          console.log("1111");
        }

        const textDedustArray = [];
        const valueDedustArray = [];

        if (advancePayment != 0 && advancePayment != null) {
          textDedustArray.push("คืนเงินเบิกล่วงหน้า");
          valueDedustArray.push(advancePayment);
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].tax != 0 &&
          responseDataAll[i + 1].accountingRecord[0].tax != null
        ) {
          textDedustArray.push("หักภาษีเงินได้");
          valueDedustArray.push(
            responseDataAll[i + 1].accountingRecord.tax
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }

        if (
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != 0 &&
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.socialSecurity
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textDedustArray.push("หักสมทบประกันสังคม");
              valueDedustArray.push(amountCountDayWork);
            }
          }
          console.log("22");
        }


        pdf.text(`ใบจ่ายเงินเดือน`, 73, 142);
        pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 148);
        pdf.setFontSize(12);

        pdf.text(`รหัส`, 7, head2);
        pdf.text(`ชื่อ-สกุล`, 40, head2);
        pdf.text(`หน่วยงาน`, 80, head2);
        pdf.text(`${responseDataAll[i + 1].workplace}`, 93, head2);

        const workplace = workplaceList.find(
          (item) => item.workplaceId === responseDataAll[i + 1].workplace
        );

        // Use the found workplaceName or a default value
        const workplaceName = workplace ? workplace.workplaceName : "Unknown";

        // Add it to the PDF
        pdf.text(`${workplaceName}`, 103, head2);

        const bankCheck = employeeList.find(
          (item) => item.workplace === responseDataAll[i + 1].workplace
        );

        // กำหนดค่า banknumber โดยตรวจสอบว่ามีค่าใน bankCheck หรือไม่
        const banknumber = bankCheck && bankCheck.banknumber ? bankCheck.banknumber : "Unknown";

        pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head2);

        // pdf.rect(7, 156, 60, 30);

        pdf.rect(7, head2 + 3, 155, 74); //ตารางหลัก
        pdf.rect(7, head2 + 3, 155, 12); //ตารางหลัก หัวตาราง
        pdf.rect(7, head2 + 3, 155, 63); //ตารางหลัก ล่าง
        pdf.rect(7, head2 + 3, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
        pdf.text(`รายได้`, 24, head2 + 9); //ตารางหลัก รายได้
        pdf.text(`Earnings`, 22, head2 + 12); //ตารางหลัก Earnings

        /////////////////


        const namesWithSpecificIds = responseDataAll[i + 1].addSalary
          .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
          .map((item) => {
            // Check if the item.id is 1350 and modify item.name
            if (item.id === "1350") {
              return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
            }
            return item.name; // Otherwise, keep the original name
          });

        // Concatenate names if there are any
        const concatenatedNames =
          namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
        // Show concatenated names in the PDF

        //////////////////////// หัวข้อ

        pdf.rect(7, head2 + 3, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
        pdf.text(`จำนวน`, 56, head2 + 9); //ตารางหลัก จำนวน
        pdf.text(`Number`, 55, head2 + 12); //ตารางหลัก Number

        pdf.rect(69, head2 + 3, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
        pdf.text(`จำนวนเงิน`, 74, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 75, head2 + 12); //ตารางหลัก Amount

        pdf.rect(69, head2 + 3, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9); //รายการหัก / รายการคืน
        // pdf.text(`Amount`, 75, 38);//ตารางหลัก

        ///////// รวมเงินได้
        pdf.text(`รวมเงินได้`, 28, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Earninng`, 23, head2 + 75); //ตารางหลัก Earnings

        /////  รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Deduction`, 105, head2 + 75); //ตารางหลัก Earnings

        pdf.text(`จำนวนเงิน`, 144, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 145, head2 + 12); //ตารางหลัก Amount
        // pdf.rect(162 + 9, 28, 25, 25);//ตารางวันที่จ่าย

        // pdf.rect(162 + 9, 77, 25, 25);//ตารางเงินรับสุทธิ

        pdf.rect(162 + 9, head2 + 3, 25, 25); //ตารางวันที่จ่าย
        pdf.rect(162 + 9, head2 + 3, 25, 15); //ตารางวันที่จ่าย
        pdf.text(`วันที่จ่าย`, 180, head2 + 9); //ตารางหลัก วันที่จ่าย
        pdf.text(`Payroll Date`, 177, head2 + 12); //ตารางหลัก Payroll Date

        pdf.rect(162 + 9, head2 + 52, 25, 25); //ตารางเงินรับสุทธิ
        pdf.rect(162 + 9, head2 + 52, 25, 15); //ตารางเงินรับสุทธิ
        pdf.text(`เงินรับสุทธิ`, 178, head2 + 59); //ตารางหลัก เงินรับสุทธิ
        pdf.text(`Net To Pay`, 177, head2 + 62); //ตารางหลัก Net To Pay

        pdf.rect(7, head2 + 79, 155, 13); //ตาราง 2
        pdf.rect(7, head2 + 79, 155, 6.5); //ตาราง 2 เส็นกลาง

        let x1 = 31;
        for (let j = 0; j < 5; j++) {
          pdf.rect(7, head2 + 79, x1, 13); //ตาราง 2
          x1 += 31;
        }
        // 108
        // 83
        pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83); //ตารางหลัก Earnings

        pdf.rect(112, head2 + 94, 50, 12); //ตาราง 3
        pdf.text(`ลงชื่อพนักงาน`, 125, head2 + 105); //ตารางหลัก Earnings

        pdf.text(`${responseDataAll[i + 1].employeeId}`, 13, head2);
        pdf.text(
          `${responseDataAll[i + 1].name} ${responseDataAll[i + 1].lastName}`,
          50,
          head2
        );

        let y = 174; // Initial y position

        textArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 8, y);

          // Increment y position for the next line
          y += 4.1;
        });

        let y2 = 174; // Initial y position

        countArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 68, y2, { align: "right" });

          // Increment y position for the next line
          y2 += 4.1;
        });

        let y3 = 174; // Initial y position

        valueArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 92, y3, { align: "right" });

          // Increment y position for the next line
          y3 += 4.1;
        });

        let y4 = 174; // Initial y position

        textDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 94, y4);

          // Increment y position for the next line
          y4 += 4.1;
        });
        let y5 = 174; // Initial y position

        valueDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          // pdf.text(`${text}`, 160, y5, { align: "right" });
          pdf.text(`${text}`, 160, y5, { align: "right" });

          // Increment y position for the next line
          y5 += 4.1;
        });

        const amountDay =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountDay) || 0;
        const amountOt =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountOt) || 0;
        // const sumAddSalary = parseFloat(responseDataAll[i + 1].addSalary[0].sumAddSalary) || 0;

        const addSalary = responseDataAll[i + 1]?.addSalary;
        const sumAddSalary =
          addSalary && addSalary[0]
            ? parseFloat(addSalary[0].sumAddSalary) || 0
            : 0;

        const sumSalary = amountDay + amountOt + sumAddSalary;

        // pdf.text(`${sumSalary.toFixed(2)}`, 92, head2 + 71, { align: 'right' });
        pdf.text(
          `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          92,
          head2 + 71,
          { align: "right" }
        );

        //รวมเงินหัก
        const tax =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].tax) || 0;
        const socialSecurity =
          parseFloat(
            responseDataAll[i + 1].accountingRecord[0].socialSecurity
          ) || 0;
        const advancePayment2 = parseFloat(advancePayment) || 0;

        // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

        const sumDeductSalary = advancePayment2 + tax + socialSecurity;

        pdf.text(
          `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          160,
          head2 + 71,
          { align: "right" }
        );

        // pdf.text(`${(sumSalary - sumDeductSalary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, 188, head2 + 72, { align: 'right' });
        pdf.text(
          `${(sumSalary - sumDeductSalary)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          188,
          head2 + 72,
          { align: "right" }
        );
      }

      // Reset position for the next row
      x = 20;
    }

    // Open the generated PDF in a new tab
    window.open(pdf.output("bloburl"), "_blank");
  };


  const generatePDFAudit = () => {
    const names = ["Alice", "Bob", "Charlie", "David", "Eva"];
    const ages = [25, 30, 22, 35, 28];

    // Create a new instance of jsPDF
    const pdf = new jsPDF();

    const fontPath = "/assets/fonts/THSarabunNew.ttf";
    pdf.addFileToVFS(fontPath);
    pdf.addFont(fontPath, "THSarabunNew", "normal");

    // Add bold font
    const boldFontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    pdf.addFileToVFS(boldFontPath);
    pdf.addFont(boldFontPath, "THSarabunNew Bold", "normal");

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

    // Set the initial position for text and frame
    let x = 20;

    pdf.setFont('THSarabunNew');
    // pdf.setFont("THSarabunNew Bold");

    // Loop through the names and ages arrays to add content to the PDF
    for (let i = 0; i < responseDataAll.length; i += 2) {
      // Add a page for each pair of names
      if (i > 0) {
        pdf.addPage();
      }

      // เรียงarray
      const countSpecialDayListWork =
        responseDataAll[i].specialDayListWork.length;
      // const countcal = responseDataAll[i].accountingRecord[0].countDay - countSpecialDayListWork;
      // const countcal = responseDataAll[i].accountingRecord[0].countDayWork
      const countcal = responseDataAll[i].accountingRecord[0].countDayWork;

      // 2.0
      const formattedAmountHoliday2_0 = Number(
        countSpecialDayListWork * responseDataAll[i].specialDayRate ?? 0
      );

      // รถโทรตำแหน่ง
      const formattedAddTel = Number(
        responseDataAll[i].accountingRecord[0].tel || 0
      );
      const formattedAddAmountPosition = Number(
        responseDataAll[i].accountingRecord[0].amountPosition || 0
      );
      const formattedAddTravel = Number(
        responseDataAll[i].accountingRecord[0].travel || 0
      );

      // The IDs you want to exclude
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryFiltered = responseDataAll[i].addSalary
        .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      // จ่างชดเชย
      const excludedIdsPayCompensation = [
        "1231",
        "1233",
        "1422",
        "1423",
        "1428",
        "1434",
        "1435",
        "1429",
        "1427",
        "1234",
        "1426",
        "1425",
      ];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryPayCompensationFiltered = responseDataAll[i].addSalary
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      const formattedAddTelAmountPositionTravel =
        formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

      // เบี้ยขยัน
      const formattedAmountHardWorking = responseDataAll[i].addSalary.filter(
        (item) => item.id === "1410"
      );

      // ค่าเดินทาง(ไม่คิดประกัน)
      const formattedAddSalaryTavel = responseDataAll[i].addSalary.filter(
        (item) => item.id === "1535"
      );
      // Calculate the sum of SpSalary values in the filtered array
      const sumAmountHardWorking = formattedAmountHardWorking.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );


      // Calculate the sum of SpSalary values in the filtered array
      const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
        (total, item) => total + parseFloat(item.SpSalary || 0),
        0
      );

      // นักขัติ
      const countSpecialDayWork = responseDataAll[i].countSpecialDay;
      const formattedAmountHoliday = Number(
        responseDataAll[i].countSpecialDay *
        responseDataAll[i].specialDayRate ?? 0
      );

      //เงินพิเศษ
      const formattedSumAddSalaryAfterTax = Number(
        responseDataAll[i].accountingRecord[0].sumAddSalaryAfterTax ?? 0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      //หัก
      // คืนเงินเบิกล่วงหน้า
      // const advancePayment = parseFloat(
      //   responseDataAll[i].accountingRecord[0].advancePayment || 0
      // ).toFixed(2);

      pdf.setFontSize(15);

      pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);

      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);

      pdf.setFontSize(12);

      const head = 25;
      const head2 = 155;

      pdf.text(`รหัส`, 7, head);
      pdf.text(`ชื่อ-สกุล`, 40, head);
      pdf.text(`หน่วยงาน`, 80, head);
      pdf.text(`${responseDataAll[i].workplace}`, 93, head);

      const workplace = workplaceList.find(
        (item) => item.workplaceId === responseDataAll[i].workplace
      );

      // Use the found workplaceName or a default value
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";

      // Add it to the PDF
      pdf.text(`${workplaceName}`, 103, head);

      const bankCheck = employeeList.find(
        (item) => item.workplace === responseDataAll[i].workplace
      );

      // กำหนดค่า banknumber โดยตรวจสอบว่ามีค่าใน bankCheck หรือไม่
      const banknumber = bankCheck && bankCheck.banknumber ? bankCheck.banknumber : "Unknown";

      pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head);

      const namesWithSpecificIds = responseDataAll[i].addSalary
        .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
        .map((item) => {
          // Check if the item.id is 1350 and modify item.name
          if (item.id === "1350") {
            return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
          }
          return item.name; // Otherwise, keep the original name
        });


      // Concatenate names if there are any
      const concatenatedNames =
        namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
      // Show concatenated names in the PDF

      // Draw a square frame around the first name
      pdf.rect(7, 28, 155, 74); //ตารางหลัก
      pdf.rect(7, 28, 155, 12); //ตารางหลัก หัวตาราง

      pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
      pdf.rect(7, 28, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
      pdf.text(`รายได้`, 24, 34); //ตารางหลัก รายได้
      pdf.text(`Earnings`, 22, 37); //ตารางหลัก Earnings

      const textArray = [];
      const countArray = [];
      const valueArray = [];

      if (
        responseDataAll[i].accountingRecord[0].amountDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountDay != null
      ) {

        const accountingRecord = responseDataAll[i].specialDayRate;

        if (accountingRecord) {
          const amountDay = parseFloat(accountingRecord);

          if (amountDay != 0 && amountDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("อัตรา");
            countArray.push("");
            valueArray.push(
              amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("1");
      }
      if (
        responseDataAll[i].accountingRecord.amountDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountDay != null
      ) {
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const amountCountDayWork = parseFloat(
            accountingRecord.amountCountDayWork
          );

          if (amountCountDayWork != 0 && amountCountDayWork != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("เงินเดือน");
            countArray.push(countcal);
            valueArray.push(
              amountCountDayWork
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("2");
      }
      if (0 != 0 && null != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าล่วงเวลา 1 เท่า");
        countArray.push("");
        valueArray.push(
          responseDataAll[i].accountingRecord.amountDay
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("3");
      }
      // if (responseDataAll[i].accountingRecord[0].amountOt != 0 && responseDataAll[i].accountingRecord[0].amountOt != null) {
      if (
        responseDataAll[i].accountingRecord[0].amountOneFive != 0 &&
        responseDataAll[i].accountingRecord[0].amountOneFive != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourOneFive);
          const amountOt = parseFloat(accountingRecord.amountOneFive);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 1.5 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("4");
      }
      if (
        responseDataAll[i].accountingRecord[0].amountTwo != 0 &&
        responseDataAll[i].accountingRecord[0].amountTwo != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {

          const countOtHour = parseFloat(accountingRecord.hourTwo);
          const amountOt = parseFloat(accountingRecord.amountTwo);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 2 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("5");
      }
      // if (0 != 0 && null != null) {
      if (
        responseDataAll[i].accountingRecord[0].amountThree != 0 &&
        responseDataAll[i].accountingRecord[0].amountThree != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          // const amountOt = parseFloat(accountingRecord.amountOt);
          // const countOtHour = parseFloat(accountingRecord.countOtHour);
          const countOtHour = parseFloat(accountingRecord.hourThree);
          const amountOt = parseFloat(accountingRecord.amountThree);

          if (amountOt !== 0 && amountOt != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("ค่าล่วงเวลา 3 เท่า");
            countArray.push(
              countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }
        console.log("6");
      }
      //รถโทรตำแหน่ง
      if (
        formattedAddTelAmountPositionTravel != 0 &&
        formattedAddTelAmountPositionTravel != null
      ) {
        // Push the text to textArray and the value to valueArray
        textArray.push(concatenatedNames);
        countArray.push("");
        valueArray.push(
          formattedAddTelAmountPositionTravel
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7");
      }

      //ค่าเดินทาง(ไม่คิดประกัน)
      if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
        // Push the text to textArray and the value to valueArray
        textArray.push("ค่าเดินทาง");
        countArray.push("");
        valueArray.push(
          sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("7.1");
      }

      if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
        textArray.push("เบี้ยขยัน");
        countArray.push("");
        valueArray.push(
          sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        console.log("8");
      }

      if (
        responseDataAll[i].accountingRecord[0].amountSpecialDay != 0 &&
        responseDataAll[i].accountingRecord[0].amountSpecialDay != null
      ) {
        const accountingRecord = responseDataAll[i].accountingRecord?.[0];


        if (accountingRecord) {


          const amountSpecialDay = parseFloat(
            accountingRecord.amountSpecialDay
          );

          const specialDayListWorks = responseDataAll[i].specialDayListWork
            ? responseDataAll[i].specialDayListWork.length
            : 0;
          const countSpecialDay = parseFloat(
            responseDataAll[i].countSpecialDay
          );
          const countspecialDayF = countSpecialDay - specialDayListWorks;

          if (amountSpecialDay !== 0 && amountSpecialDay != null) {
            // Push the text to textArray and the value to valueArray
            textArray.push("วันหยุดนักขัติฤกษ์");
            countArray.push(
              countspecialDayF.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            valueArray.push(
              amountSpecialDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
        }

        console.log("9");
      }

      const totalSpSalary = addSalaryFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalary = totalSpSalary
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + salary.SpSalary,
        0
      );

      // Format the totalSpSalary with commas for thousand separators
      const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const totalSpSalaryCompensationNumber = parseFloat(
        formattedTotalSpSalaryCompensation.replace(/,/g, "")
      );

      if (totalSpSalary !== 0) {
        textArray.push("รวมเงินพิเศษ");
        countArray.push(""); // You can add the count if needed or leave it as an empty string
        valueArray.push(formattedTotalSpSalary);
      }

      // if (formattedTotalSpSalaryCompensation !== 0) {
      if (
        totalSpSalaryCompensationNumber !== 0 &&
        totalSpSalaryCompensationNumber != null
      ) {
        textArray.push("จ่ายชดเชยวันลา");
        countArray.push("");
        valueArray.push(formattedTotalSpSalaryCompensation);
        console.log("11");
      }

      const textDedustArray = [];
      const valueDedustArray = [];

      // if (advancePayment != 0 && advancePayment != null) {
      //   textDedustArray.push("คืนเงินเบิกล่วงหน้า");
      //   valueDedustArray.push(advancePayment);
      //   console.log("de1");
      // }
      if (
        responseDataAll[i].accountingRecord[0].tax != 0 &&
        responseDataAll[i].accountingRecord[0].tax != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const tax = parseFloat(accountingRecord.tax);

          if (tax !== 0 && !isNaN(tax)) {
            textDedustArray.push("หักภาษีเงินได้");
            valueDedustArray.push(
              tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de2");
      }
      if (
        responseDataAll[i].accountingRecord[0].socialSecurity != 0 &&
        responseDataAll[i].accountingRecord[0].socialSecurity != null
      ) {

        const accountingRecord = responseDataAll[i].accountingRecord?.[0];

        if (accountingRecord) {
          const socialSecurity = parseFloat(accountingRecord.socialSecurity);

          if (socialSecurity !== 0 && !isNaN(socialSecurity)) {
            textDedustArray.push("หักสมทบประกันสังคม");
            valueDedustArray.push(
              socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
            console.log("de3");
          }
        }
        console.log("de3");
      }

      pdf.rect(7, 28, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
      pdf.text(`จำนวน`, 56, 34); //ตารางหลัก จำนวน
      pdf.text(`Number`, 55, 37); //ตารางหลัก Number

      pdf.rect(69, 28, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
      pdf.text(`จำนวนเงิน`, 74, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 75, 37); //ตารางหลัก Amount

      pdf.rect(69, 28, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 102, 34); //รายการหัก / รายการคืน
      // pdf.text(`Amount`, 75, 38);//ตารางหลัก

      ///////// รวมเงินได้
      pdf.text(`รวมเงินได้`, 28, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Earninng`, 23, 100); //ตารางหลัก Earnings

      /////  รายการหัก / รายการคืน
      pdf.text(`รายการหัก / รายการคืน`, 100, 96); //ตารางหลัก Earnings
      pdf.text(`Tatol Deduction`, 105, 100); //ตารางหลัก Earnings

      pdf.text(`จำนวนเงิน`, 144, 34); //ตารางหลัก จำนวนเงิน
      pdf.text(`Amount`, 145, 37); //ตารางหลัก Amount

      pdf.rect(162 + 9, 28, 25, 25); //ตารางวันที่จ่าย
      pdf.rect(162 + 9, 28, 25, 15); //ตารางวันที่จ่าย
      pdf.text(`วันที่จ่าย`, 180, 35); //ตารางหลัก วันที่จ่าย
      pdf.text(`Payroll Date`, 177, 38); //ตารางหลัก Payroll Date

      pdf.rect(162 + 9, 77, 25, 25); //ตารางเงินรับสุทธิ
      pdf.rect(162 + 9, 77, 25, 15); //ตารางเงินรับสุทธิ
      pdf.text(`เงินรับสุทธิ`, 178, 84); //ตารางหลัก วันที่จ่าย
      pdf.text(`Net To Pay`, 177, 87); //ตารางหลัก Payroll Date

      pdf.rect(7, 104, 155, 13); //ตาราง 2
      pdf.rect(7, 104, 155, 6.5); //ตาราง 2 เส็นกลาง

      let x1 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, 104, x1, 13); //ตาราง 2
        x1 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, 108); //ตารางหลัก Earnings
      pdf.text(`ภาษีสะสมต่อปี`, 40, 108); //ตารางหลัก Earnings
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108); //ตารางหลัก Earnings
      pdf.text(`เงินประกันสะสมต่อปี`, 102, 108); //ตารางหลัก Earnings
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108); //ตารางหลัก Earnings


      pdf.rect(112, 119, 50, 12); //ตาราง 3
      pdf.text(`ลงชื่อพนักงาน`, 125, 130); //ตารางหลัก Earnings

      pdf.text(`${responseDataAll[i].employeeId}`, 13, head);
      pdf.text(
        `${responseDataAll[i].name} ${responseDataAll[i].lastName}`,
        50,
        head
      );

      let y = 44; // Initial y position

      textArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 8, y);

        // Increment y position for the next line
        y += 4.1;
      });

      let y2 = 44; // Initial y position

      countArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 68, y2, { align: "right" });

        // Increment y position for the next line
        y2 += 4.1;
      });

      let y3 = 44; // Initial y position

      valueArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 92, y3, { align: "right" });

        // Increment y position for the next line
        y3 += 4.1;
      });

      let y4 = 44; // Initial y position

      textDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 94, y4);

        // Increment y position for the next line
        y4 += 4.1;
      });
      let y5 = 44; // Initial y position

      valueDedustArray.forEach((text) => {
        // Output each element of the textArray at the current y position
        pdf.text(`${text}`, 160, y5, { align: "right" });

        // Increment y position for the next line
        y5 += 4.1;
      });

      //รวมเงินได้
      const sumAddSalaryAfterTax = parseFloat(
        responseDataAll[i].accountingRecord.sumAddSalaryAfterTax ?? 0
      );
      const formattedSumAddSalaryAfterTax1 =
        sumAddSalaryAfterTax.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      // setWsTotalSum((Number(wsAmountDay || 0 ) + Number(wsAmountOt || 0) + Number(wsTax || 0 ) + Number(wsAmountSpecialDay || 0) + Number(sumAddSalaryList || 0)).toFixed(2) || 0);

      const amountDay =
        parseFloat(responseDataAll[i].accountingRecord[0].amountDay) || 0;
      const amountOt =
        parseFloat(responseDataAll[i].accountingRecord[0].amountOt) || 0;
      const sumAddSalary =
        parseFloat(responseDataAll[i].accountingRecord[0].sumAddSalary) || 0;
      const amountSpecialDay =
        parseFloat(responseDataAll[i].addSalary.amountSpecialDay) || 0;
      const specialDayRate = parseFloat(responseDataAll[i].specialDayRate) || 0;

      // const sumAddSalaryList = parseFloat(responseDataAll[i].addSalary.sumAddSalaryList) || 0;sumAddSalary

      const sumSalary = amountDay + amountOt + sumAddSalary + specialDayRate;
      pdf.text(
        `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        92,
        96,
        { align: "right" }
      );

      //รวมเงินหัก

      const tax = parseFloat(responseDataAll[i].accountingRecord[0].tax) || 0;
      const socialSecurity =
        parseFloat(responseDataAll[i].accountingRecord[0].socialSecurity) || 0;
      // const advancePayment2 = parseFloat(advancePayment) || 0;

      // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

      // const sumDeductSalary = advancePayment2 + tax + socialSecurity;
      const sumDeductSalary = tax + socialSecurity;

      pdf.text(
        `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        160,
        96,
        { align: "right" }
      );

      pdf.text(
        `${(sumSalary - sumDeductSalary)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        188,
        98,
        { align: "right" }
      );

      // pdf.text(`Age: ${ages[i]}`, x + 10, 60);

      // Move to the next column
      // x += 80;

      // Draw a square frame around the second name if available
      if (i + 1 < responseDataAll.length) {
        pdf.setFontSize(15);

        // เรียงarray
        const countSpecialDayListWork =
          responseDataAll[i + 1].specialDayListWork.length;
        const countcal =
          responseDataAll[i + 1].accountingRecord[0].countDay -
          countSpecialDayListWork;

        // 2.0
        const formattedAmountHoliday2_0 = Number(
          countSpecialDayListWork * responseDataAll[i + 1].specialDayRate ?? 0
        );

        // รถโทรตำแหน่ง
        const formattedAddTel = Number(
          responseDataAll[i + 1].accountingRecord.tel || 0
        );
        const formattedAddAmountPosition = Number(
          responseDataAll[i + 1].accountingRecord.amountPosition || 0
        );
        const formattedAddTravel = Number(
          responseDataAll[i + 1].accountingRecord.travel || 0
        );

        const formattedAddTelAmountPositionTravel =
          formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

        // เบี้ยขยัน
        const formattedAmountHardWorking = responseDataAll[
          i + 1
        ].addSalary.filter((item) => item.id === "1410");

        // ค่าเดินทาง(ไม่คิดประกัน)
        const formattedAddSalaryTavel = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1535"
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAmountHardWorking = formattedAmountHardWorking.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // Calculate the sum of SpSalary values in the filtered array
        const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );

        // นักขัติ
        const countSpecialDayWork = responseDataAll[i + 1].countSpecialDay;
        const formattedAmountHoliday = Number(
          responseDataAll[i + 1].countSpecialDay *
          responseDataAll[i + 1].specialDayRate ?? 0
        );


        // //เงินพิเศษ
        const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryFiltered = responseDataAll[i + 1].addSalary
          .filter((salary) => !excludedIds.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));

        const totalSpSalary = addSalaryFiltered.reduce(
          (sum, salary) => sum + salary.SpSalary,
          0
        );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalary = totalSpSalary
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // จ่างชดเชย
        const excludedIdsPayCompensation = [
          "1231",
          "1233",
          "1422",
          "1423",
          "1428",
          "1434",
          "1435",
          "1429",
          "1427",
          "1234",
          "1426",
          "1425",
        ];

        // Assuming responseDataAll[i].addSalary is an array of salary objects
        const addSalaryPayCompensationFiltered = responseDataAll[
          i + 1
        ].addSalary
          .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
          .map((salary) => ({
            name: salary.name,
            SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
          }));


        const totalSpSalaryCompensation =
          addSalaryPayCompensationFiltered.reduce(
            (sum, salary) => sum + salary.SpSalary,
            0
          );

        // Format the totalSpSalary with commas for thousand separators
        const formattedTotalSpSalaryCompensation = totalSpSalaryCompensation
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const totalSpSalaryCompensationNumber = parseFloat(
          formattedTotalSpSalaryCompensation.replace(/,/g, "")
        );

        //หัก
        // คืนเงินเบิกล่วงหน้า
        // const advancePayment = parseFloat(
        //   responseDataAll[i + 1].accountingRecord[0].advancePayment || 0
        // ).toFixed(2);

        const textArray = [];
        const countArray = [];
        const valueArray = [];


        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {

          const accountingRecord = responseDataAll[i + 1].specialDayRate;

          if (accountingRecord) {
            const amountDay = parseFloat(accountingRecord);

            if (amountDay != 0 && amountDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("อัตรา");
              countArray.push("");
              valueArray.push(
                amountDay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("11");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountDay != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.amountCountDayWork
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("เงินเดือน");
              countArray.push(countcal);
              valueArray.push(
                amountCountDayWork
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("22");
        }
        if (0 != 0 && null != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าล่วงเวลา 1 เท่า");
          countArray.push("");
          valueArray.push(
            responseDataAll[i + 1].accountingRecord.amountDay
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("33");
        }
        // if (responseDataAll[i + 1].accountingRecord[0].amountOt != 0 && responseDataAll[i + 1].accountingRecord[0].amountOt != null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountOneFive != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const countOtHour = parseFloat(accountingRecord.hourOneFive);
            const amountOt = parseFloat(accountingRecord.amountOneFive);

            console.log("amountOt", amountOt);

            if (countOtHour != 0 && countOtHour != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 1.5 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("44");
        }

        if (
          responseDataAll[i + 1].accountingRecord[0].amountTwo != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountTwo != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            // const amountOt = parseFloat(accountingRecord.amountOt);
            // const countOtHour = parseFloat(accountingRecord.countOtHour);
            const countOtHour = parseFloat(accountingRecord.hourTwo);
            const amountOt = parseFloat(accountingRecord.amountTwo);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 2 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("55");
        }
        // if (0 != 0 && null != null) {
        if (
          responseDataAll[i + 1].accountingRecord[0].amountThree != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountThree != null
        ) {
          // Push the text to textArray and the value to valueArray

          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            // const amountOt = parseFloat(accountingRecord.amountOt);
            // const countOtHour = parseFloat(accountingRecord.countOtHour);
            const countOtHour = parseFloat(accountingRecord.hourThree);
            const amountOt = parseFloat(accountingRecord.amountThree);

            if (amountOt !== 0 && amountOt != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("ค่าล่วงเวลา 3 เท่า");
              countArray.push(
                countOtHour.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountOt.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }
          console.log("66");
        }
        //รถโทรตำแหน่ง
        if (
          formattedAddTelAmountPositionTravel != 0 &&
          formattedAddTelAmountPositionTravel != null
        ) {
          // Push the text to textArray and the value to valueArray
          textArray.push(concatenatedNames);
          countArray.push("");
          valueArray.push(
            formattedAddTelAmountPositionTravel
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77");
        }
        //ค่าเดินทาง(ไม่คิดประกัน)
        if (sumAddSalaryTavel != 0 && sumAddSalaryTavel != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าเดินทาง");
          countArray.push("");
          valueArray.push(
            sumAddSalaryTavel.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
        if (sumAmountHardWorking != 0 && sumAmountHardWorking != null) {
          textArray.push("เบี้ยขยัน");
          countArray.push("");
          valueArray.push(
            sumAmountHardWorking
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("88");
        }
        if (
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != 0 &&
          responseDataAll[i + 1].accountingRecord[0].amountSpecialDay != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];



          if (accountingRecord) {


            const amountSpecialDay = parseFloat(
              accountingRecord.amountSpecialDay
            );

            const specialDayListWorks = responseDataAll[i + 1]
              .specialDayListWork
              ? responseDataAll[i + 1].specialDayListWork.length
              : 0;
            const countSpecialDay = parseFloat(
              responseDataAll[i + 1].countSpecialDay
            );
            const countspecialDayF = countSpecialDay - specialDayListWorks;

            if (amountSpecialDay !== 0 && amountSpecialDay != null) {
              // Push the text to textArray and the value to valueArray
              textArray.push("วันหยุดนักขัติฤกษ์");
              countArray.push(
                countspecialDayF
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
              valueArray.push(
                amountSpecialDay
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }
          }

          console.log("99");
        }


        if (formattedTotalSpSalary != 0 && formattedTotalSpSalary != null) {
          textArray.push("เงินเพิ่มพิเศษ");
          countArray.push("");
          valueArray.push(
            formattedTotalSpSalary.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("1010");
        }


        if (
          totalSpSalaryCompensationNumber !== 0 &&
          totalSpSalaryCompensationNumber != null
        ) {
          textArray.push("จ่ายชดเชยวันลา");
          countArray.push("");
          valueArray.push(formattedTotalSpSalaryCompensation);
          console.log("1111");
        }

        const textDedustArray = [];
        const valueDedustArray = [];

        // if (advancePayment != 0 && advancePayment != null) {
        //   textDedustArray.push("คืนเงินเบิกล่วงหน้า");
        //   valueDedustArray.push(advancePayment);
        // }
        if (
          responseDataAll[i + 1].accountingRecord[0].tax != 0 &&
          responseDataAll[i + 1].accountingRecord[0].tax != null
        ) {
          textDedustArray.push("หักภาษีเงินได้");
          valueDedustArray.push(
            responseDataAll[i + 1].accountingRecord.tax
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }

        if (
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != 0 &&
          responseDataAll[i + 1].accountingRecord[0].socialSecurity != null
        ) {
          const accountingRecord = responseDataAll[i + 1].accountingRecord?.[0];

          if (accountingRecord) {
            const amountCountDayWork = parseFloat(
              accountingRecord.socialSecurity
            );

            if (amountCountDayWork != 0 && amountCountDayWork != null) {
              // Push the text to textArray and the value to valueArray
              textDedustArray.push("หักสมทบประกันสังคม");
              valueDedustArray.push(amountCountDayWork);
            }
          }
          console.log("22");
        }



        pdf.text(`ใบจ่ายเงินเดือน`, 73, 142);
        pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 148);
        pdf.setFontSize(12);

        pdf.text(`รหัส`, 7, head2);
        pdf.text(`ชื่อ-สกุล`, 40, head2);
        pdf.text(`หน่วยงาน`, 80, head2);
        pdf.text(`${responseDataAll[i + 1].workplace}`, 93, head2);

        const workplace = workplaceList.find(
          (item) => item.workplaceId === responseDataAll[i + 1].workplace
        );

        // Use the found workplaceName or a default value
        const workplaceName = workplace ? workplace.workplaceName : "Unknown";

        // Add it to the PDF
        pdf.text(`${workplaceName}`, 103, head2);

        const bankCheck = employeeList.find(
          (item) => item.workplace === responseDataAll[i + 1].workplace
        );

        // กำหนดค่า banknumber โดยตรวจสอบว่ามีค่าใน bankCheck หรือไม่
        const banknumber = bankCheck && bankCheck.banknumber ? bankCheck.banknumber : "Unknown";

        pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head2);

        // pdf.rect(7, 156, 60, 30);

        pdf.rect(7, head2 + 3, 155, 74); //ตารางหลัก
        pdf.rect(7, head2 + 3, 155, 12); //ตารางหลัก หัวตาราง
        pdf.rect(7, head2 + 3, 155, 63); //ตารางหลัก ล่าง
        pdf.rect(7, head2 + 3, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
        pdf.text(`รายได้`, 24, head2 + 9); //ตารางหลัก รายได้
        pdf.text(`Earnings`, 22, head2 + 12); //ตารางหลัก Earnings

        /////////////////



        const namesWithSpecificIds = responseDataAll[i + 1].addSalary
          .filter((item) => ["1230", "1350", "1241"].includes(item.id)) // Filter based on specific IDs
          .map((item) => {
            // Check if the item.id is 1350 and modify item.name
            if (item.id === "1350") {
              return "โทรศัพท์"; // Set to "โทรศัพท์" when item.id is 1350
            }
            return item.name; // Otherwise, keep the original name
          });

        // Concatenate names if there are any
        const concatenatedNames =
          namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
        // Show concatenated names in the PDF

        //////////////////////// หัวข้อ


        pdf.rect(7, head2 + 3, 62, 63); //ตารางหลัก บน ซ้าย ช่อง1 จำนวน
        pdf.text(`จำนวน`, 56, head2 + 9); //ตารางหลัก จำนวน
        pdf.text(`Number`, 55, head2 + 12); //ตารางหลัก Number

        pdf.rect(69, head2 + 3, 24, 74); //ตารางหลัก บน ซ้าย ช่อง1 จำนวนเงิน
        pdf.text(`จำนวนเงิน`, 74, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 75, head2 + 12); //ตารางหลัก Amount

        pdf.rect(69, head2 + 3, 69, 74); //ตารางหลัก บน ซ้าย ช่อง1 รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9); //รายการหัก / รายการคืน
        // pdf.text(`Amount`, 75, 38);//ตารางหลัก

        // /////////


        ///////// รวมเงินได้
        pdf.text(`รวมเงินได้`, 28, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Earninng`, 23, head2 + 75); //ตารางหลัก Earnings

        /////  รายการหัก / รายการคืน
        pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71); //ตารางหลัก Earnings
        pdf.text(`Tatol Deduction`, 105, head2 + 75); //ตารางหลัก Earnings

        pdf.text(`จำนวนเงิน`, 144, head2 + 9); //ตารางหลัก จำนวนเงิน
        pdf.text(`Amount`, 145, head2 + 12); //ตารางหลัก Amount
        // pdf.rect(162 + 9, 28, 25, 25);//ตารางวันที่จ่าย

        // pdf.rect(162 + 9, 77, 25, 25);//ตารางเงินรับสุทธิ

        pdf.rect(162 + 9, head2 + 3, 25, 25); //ตารางวันที่จ่าย
        pdf.rect(162 + 9, head2 + 3, 25, 15); //ตารางวันที่จ่าย
        pdf.text(`วันที่จ่าย`, 180, head2 + 9); //ตารางหลัก วันที่จ่าย
        pdf.text(`Payroll Date`, 177, head2 + 12); //ตารางหลัก Payroll Date

        pdf.rect(162 + 9, head2 + 52, 25, 25); //ตารางเงินรับสุทธิ
        pdf.rect(162 + 9, head2 + 52, 25, 15); //ตารางเงินรับสุทธิ
        pdf.text(`เงินรับสุทธิ`, 178, head2 + 59); //ตารางหลัก เงินรับสุทธิ
        pdf.text(`Net To Pay`, 177, head2 + 62); //ตารางหลัก Net To Pay

        pdf.rect(7, head2 + 79, 155, 13); //ตาราง 2
        pdf.rect(7, head2 + 79, 155, 6.5); //ตาราง 2 เส็นกลาง

        let x1 = 31;
        for (let j = 0; j < 5; j++) {
          pdf.rect(7, head2 + 79, x1, 13); //ตาราง 2
          x1 += 31;
        }
        // 108
        // 83
        pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83); //ตารางหลัก Earnings
        pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83); //ตารางหลัก Earnings


        pdf.rect(112, head2 + 94, 50, 12); //ตาราง 3
        pdf.text(`ลงชื่อพนักงาน`, 125, head2 + 105); //ตารางหลัก Earnings


        pdf.text(`${responseDataAll[i + 1].employeeId}`, 13, head2);
        pdf.text(
          `${responseDataAll[i + 1].name} ${responseDataAll[i + 1].lastName}`,
          50,
          head2
        );


        let y = 174; // Initial y position

        textArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 8, y);

          // Increment y position for the next line
          y += 4.1;
        });

        let y2 = 174; // Initial y position

        countArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 68, y2, { align: "right" });

          // Increment y position for the next line
          y2 += 4.1;
        });

        let y3 = 174; // Initial y position

        valueArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 92, y3, { align: "right" });

          // Increment y position for the next line
          y3 += 4.1;
        });

        let y4 = 174; // Initial y position

        textDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          pdf.text(`${text}`, 94, y4);

          // Increment y position for the next line
          y4 += 4.1;
        });
        let y5 = 174; // Initial y position

        valueDedustArray.forEach((text) => {
          // Output each element of the textArray at the current y position
          // pdf.text(`${text}`, 160, y5, { align: "right" });
          pdf.text(`${text}`, 160, y5, { align: "right" });

          // Increment y position for the next line
          y5 += 4.1;
        });

        const amountDay =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountDay) || 0;
        const amountOt =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].amountOt) || 0;
        // const sumAddSalary = parseFloat(responseDataAll[i + 1].addSalary[0].sumAddSalary) || 0;

        const addSalary = responseDataAll[i + 1]?.addSalary;
        const sumAddSalary =
          addSalary && addSalary[0]
            ? parseFloat(addSalary[0].sumAddSalary) || 0
            : 0;

        const sumSalary = amountDay + amountOt + sumAddSalary;

        // pdf.text(`${sumSalary.toFixed(2)}`, 92, head2 + 71, { align: 'right' });
        pdf.text(
          `${sumSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          92,
          head2 + 71,
          { align: "right" }
        );

        //รวมเงินหัก
        const tax =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].tax) || 0;
        const socialSecurity =
          parseFloat(
            responseDataAll[i + 1].accountingRecord[0].socialSecurity
          ) || 0;
        // const advancePayment2 = parseFloat(advancePayment) || 0;

        // const sumAddSalary = parseFloat(responseDataAll[i].addSalary[0].sumAddSalary) || 0;

        // const sumDeductSalary = advancePayment2 + tax + socialSecurity;
        const sumDeductSalary = tax + socialSecurity;


        pdf.text(
          `${sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          160,
          head2 + 71,
          { align: "right" }
        );

        // pdf.text(`${(sumSalary - sumDeductSalary).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, 188, head2 + 72, { align: 'right' });
        pdf.text(
          `${(sumSalary - sumDeductSalary)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
          188,
          head2 + 72,
          { align: "right" }
        );
      }

      // Reset position for the next row
      x = 20;
    }

    // Open the generated PDF in a new tab
    window.open(pdf.output("bloburl"), "_blank");
  };
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
              <a href="#"> ระบบเงินเดือน</a>
            </li>
            <li class="breadcrumb-item active">ออกสลิปเงินเดือน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0">
                  <i class="far fa-arrow-alt-circle-right"></i> ออกสลิปเงินเดือน
                </h1>
              </div>
            </div>
          </div>
          <section class="content">
            <div class="container-fluid">
              <h2 class="title">สลิปเงินเดือน</h2>
              <section class="Frame">
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-3">
                      <select
                        className="form-control"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        {/* <option value="">Select Option</option> */}
                        <option value="option1">แบบหน่วยงาน</option>
                        <option value="option2">แบบพนักงาน</option>
                      </select>
                    </div>
                  </div>
                  <br />
                  {/* Conditionally render content based on the selected option */}
                  {selectedOption === "option1" && (
                    <div>
                      <h2>แบบหน่วยงาน</h2>
                      <div class="row">
                        <div class="col-md-3">
                          <label role="searchEmployeeId">รหัสหน่วยงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสหน่อยงาน"
                            value={workplacrId}
                            onChange={handleStaffIdChange}
                            onInput={(e) => {
                              // Remove any non-digit characters
                              e.target.value = e.target.value.replace(/\D/g, "");
                            }}
                            list="WorkplaceIdList"
                          />
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
                          <label role="searchname">ชื่อหน่วยงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffName"
                            placeholder="ชื่อหน่วยงาน"
                            value={workplacrName}
                            onChange={handleStaffNameChange}
                            list="WorkplaceNameList"
                          />

                          <datalist id="WorkplaceNameList">
                            {workplaceListAll.map((workplace) => (
                              <option
                                key={workplace.workplaceId}
                                value={workplace.workplaceName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOption === "option2" && (
                    <div>
                      <h2>แบบพนักงาน</h2>
                      <div class="row">
                        <div class="col-md-3">
                          <label role="searchEmployeeId">รหัสพนักงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffId"
                            placeholder="รหัสพนักงาน"
                            value={staffId}
                            onChange={handleStaffIdChange2}
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
                        <div class="col-md-3">
                          <label role="searchname">ชื่อพนักงาน</label>
                          <input
                            type="text"
                            className="form-control"
                            id="staffName"
                            placeholder="ชื่อพนักงาน"
                            value={staffFullName}
                            onChange={handleStaffNameChange2}
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
                  )}
                  {/* <div class="row">
                                        <div class="col-md-3">
                                            <label role="searchEmployeeId">รหัสหน่อยงาน</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="staffId"
                                                placeholder="รหัสหน่อยงาน"
                                                value={workplacrId}
                                                onChange={handleStaffIdChange}
                                                list="WorkplaceIdList"
                                            />
                                            <datalist id="WorkplaceIdList">
                                                {workplaceListAll.map(workplace => (
                                                    <option key={workplace.workplaceId} value={workplace.workplaceId} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div class="col-md-3">
                                            <label role="searchname">ชื่อหน่วยงาน</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="staffName"
                                                placeholder="ชื่อพนักงาน"
                                                value={workplacrName}
                                                onChange={handleStaffNameChange}
                                                list="WorkplaceNameList"
                                            />

                                            <datalist id="WorkplaceNameList">
                                                {workplaceListAll.map(workplace => (
                                                    <option key={workplace.workplaceId} value={workplace.workplaceName} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div> */}
                  {/* <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label role="searchEmployeeId">รหัสพนักงาน</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="staffId"
                                                    placeholder="รหัสพนักงาน"
                                                    value={staffId}
                                                    onChange={handleStaffIdChange2}
                                                    list="staffIdList"
                                                />
                                                <datalist id="staffIdList">
                                                    {employeeList.map(employee => (
                                                        <option key={employee.employeeId} value={employee.employeeId} />
                                                    ))}
                                                </datalist>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label role="searchname">ชื่อพนักงาน</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="staffName"
                                                    placeholder="ชื่อพนักงาน"
                                                    value={staffFullName}
                                                    onChange={handleStaffNameChange2}
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
                    <div class="col-md-3">
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

                    <div class="col-md-3">
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
                <div class="row">
                  <div class="col-md-3">
                    <button onClick={generatePDF} class="btn b_save">
                      {selectedOption === "option1"
                        ? "ออกสลิป"
                        : selectedOption === "option2"
                          ? "ออกสลิป"
                          : ""}
                    </button>
                  </div>
                  <div class="col-md-3">
                    <button onClick={generatePDFAudit} class="btn b_save">
                      {selectedOption === "option1"
                        ? "ออกสลิปออดิท"
                        : selectedOption === "option2"
                          ? "ออกสลิปออดิท"
                          : ""}
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

export default TestPDFResultSalayNew;
