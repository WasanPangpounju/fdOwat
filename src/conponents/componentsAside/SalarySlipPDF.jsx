import endpoint from "../../config";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import "jspdf-autotable";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import "moment/locale/th"; // Import the Thai locale data

function SalarySlipPDF({ employeeList, workplaceList }) {
  // ...existing state variables...
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
  const [cashWorkData, setCashWorkData] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [basicSettings, setBasicSettings] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");

  const [month, setMonth] = useState("01");
  const currentYear = new Date().getFullYear(); // 2024

  const [year, setYear] = useState(currentYear);
  const EndYear = 2010;
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  const [selectedOption, setSelectedOption] = useState("option1");

  // ฟังก์ชันสำหรับดึงข้อมูลพนักงานจาก API
  const getEmployeeBankNumber = async (employeeId) => {
    console.log("🚀 START: getEmployeeBankNumber called with employeeId:", employeeId);
    
    try {
      console.log(`🏦 กำลังดึงเลขบัญชีสำหรับพนักงาน ID: ${employeeId}`);
      console.log("🌐 Sending request to API...");
      
      const response = await axios.post("http://10.10.110.7:3000/employee/search", {
        employeeId: employeeId
      });
      
      console.log("✅ API Response received:");
      console.log("📊 Response status:", response.status);
      console.log("📋 Response data:", response.data);
      
      // แก้ไข: ตรวจสอบ response.data.employees แทน response.data
      if (response.data && response.data.employees && response.data.employees.length > 0) {
        const employee = response.data.employees[0];
        console.log("👤 Employee data found:", employee);
        
        const banknumber = employee.banknumber || "Unknown";
        console.log(`🏦 พบเลขบัญชี: ${banknumber} สำหรับพนักงาน ${employeeId}`);
        console.log("✅ END: Returning banknumber:", banknumber);
        return banknumber;
      } else {
        console.log(`❌ ไม่พบข้อมูลพนักงาน ID: ${employeeId}`);
        console.log("🔍 Available data structure:", {
          hasData: !!response.data,
          hasEmployees: !!(response.data && response.data.employees),
          employeesLength: response.data?.employees?.length || 0
        });
        console.log("❌ END: Returning 'Unknown'");
        return "Unknown";
      }
    } catch (error) {
      console.error(`💥 Error fetching employee bank number for ${employeeId}:`, error);
      console.error("💥 Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      console.log("❌ END: Returning 'Unknown' due to error");
      return "Unknown";
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลการตั้งค่าพื้นฐานจาก API
  const getBasicSettings = async () => {
    console.log("🚀 START: getBasicSettings called");
    
    try {
      console.log("🌐 Sending request to basic settings API...");
      
      const response = await axios.get("http://10.10.110.7:3000/basicsetting");
      
      console.log("✅ Basic Settings API Response received:");
      console.log("📊 Response status:", response.status);
      console.log("📋 Response data:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setBasicSettings(response.data);
        console.log("✅ Basic settings data stored successfully");
        
        // หาข้อมูลที่มี paymentPeriod และ status = "active"
        const activeSettingWithPayment = response.data.find(setting => 
          setting.status === "active" && 
          setting.paymentPeriod && 
          setting.paymentPeriod.length > 0
        );
        
        if (activeSettingWithPayment) {
          console.log("🎯 Found active setting with payment period:", activeSettingWithPayment);
          
          // แปลงเดือนเป็นชื่อเดือนใน paymentPeriod
          const monthNames = {
            "01": "jan", "02": "feb", "03": "mar", "04": "apr",
            "05": "may", "06": "jun", "07": "jul", "08": "aug", 
            "09": "sep", "10": "oct", "11": "nov", "12": "dec"
          };
          
          const monthKey = monthNames[month];
          const paymentPeriod = activeSettingWithPayment.paymentPeriod[0];
          
          if (paymentPeriod && paymentPeriod[monthKey]) {
            const date = paymentPeriod[monthKey];
            const formattedDate = formatDateToThai(date);
            setPaymentDate(formattedDate);
            console.log(`💰 Payment date for month ${month}: ${date} -> ${formattedDate}`);
          } else {
            console.log(`❌ No payment date found for month ${month}`);
            setPaymentDate("");
          }
        } else {
          console.log("❌ No active setting with payment period found");
          setPaymentDate("");
        }
      } else {
        console.log("❌ Invalid response data format");
        setBasicSettings([]);
        setPaymentDate("");
      }
    } catch (error) {
      console.error("💥 Error fetching basic settings:", error);
      console.error("💥 Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setBasicSettings([]);
      setPaymentDate("");
    }
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateToThai = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };

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

  // useEffect สำหรับดึงข้อมูลการตั้งค่าพื้นฐาน
  useEffect(() => {
    getBasicSettings();
  }, [month]); // เรียกใหม่เมื่อเดือนเปลี่ยน

 // แก้ไข useEffect เดิมที่เรียก /accounting/calsalarylist
useEffect(() => {
  const fetchData = async () => {
    const dataTest = {
      year: year.toString(),
      month: month.toString().padStart(2, '0'),
    };

    console.log("🚀 Sending POST request to API:", "http://10.10.110.7:3000/accounting/searchtimerecordemployee");
    console.log("📅 Request data:", dataTest);
    console.log("🔍 Selected option:", selectedOption);
    console.log("🏢 Search workplace ID:", searchWorkplaceId);
    console.log("👤 Search employee ID:", searchEmployeeId);

    // เปลี่ยนเป็น POST http://10.10.110.7:3000/accounting/searchtimerecordemployee
    try {
      const response = await axios.post("http://10.10.110.7:3000/accounting/searchtimerecordemployee", dataTest);
      
      console.log("✅ API Response received:", response.data);
      console.log("📊 Total records from API:", response.data?.result?.length || 0);
      
      if (selectedOption == "option1") {
        const responseData = response.data.result; // แก้ไข: เข้าถึง result array
        console.log("🔄 Processing Option 1 (Workplace filter)");

        // Filter data based on searchWorkplaceId if provided
        const filteredData = searchWorkplaceId
          ? responseData.filter((item) => {
              // กรองตาม workplaceId จาก employee_record
              return item.employee_record && item.employee_record.some(
                (record) => record.workplaceId === searchWorkplaceId
              );
            })
          : responseData;

          console.log("🏢 After workplace filter:", filteredData.length, "records");

          // เพิ่ม log เพื่อดูโครงสร้างข้อมูล
          if (filteredData.length > 0) {
            console.log("📋 Sample data structure:", filteredData[0]);
            console.log("👤 Employee data keys:", Object.keys(filteredData[0]));
            if (filteredData[0].employee_record) {
              console.log("🏢 Employee record structure:", filteredData[0].employee_record[0]);
            }
          }

          // กรองออกพนักงานที่มีหน่วยงานต้นสังกัดเป็น "10105" 
          const filteredExclude10105 = await Promise.all(
            filteredData.map(async (item) => {
              try {
                // เรียก API เพื่อเช็คหน่วยงานต้นสังกัดของพนักงาน
                const response = await axios.post("http://10.10.110.7:3000/employee/search", {
                  employeeId: item.employeeId
                });
                
                if (response.data && response.data.employees && response.data.employees.length > 0) {
                  const employee = response.data.employees[0];
                  
                  // เพิ่ม logging เพื่อดู structure ของ employee data
                  console.log(`🔍 Employee API Response for ${item.employeeId}:`, employee);
                  console.log(`🔑 Available keys:`, Object.keys(employee));
                  
                  const originalWorkplace = employee.workplace; // หน่วยงานต้นสังกัด
                  
                  console.log(`👤 Employee ${item.employeeId} (${item.employeeName}):`, {
                    originalWorkplace: originalWorkplace,
                    currentWork: item.employee_record?.[0]?.workplaceId,
                    fullEmployeeData: employee
                  });
                  
                  // ถ้าหน่วยงานต้นสังกัดเป็น 10105 ให้กรองออก
                  if (originalWorkplace === "10105") {
                    console.log(`🚫 Filtering out employee ${item.employeeId} - original workplace is 10105`);
                    return null; // กรองออก
                  }
                }
                return item; // เก็บไว้
              } catch (error) {
                console.error(`❌ Error checking employee ${item.employeeId}:`, error);
                return item; // ถ้า error ให้เก็บไว้
              }
            })
          ).then(results => results.filter(item => item !== null)); // กรองออก null values

          console.log("🚫 After excluding workplace 10105:", filteredExclude10105.length, "records");
          console.log("📋 Records excluded from 10105:", filteredData.length - filteredExclude10105.length);

          // Sort filteredExclude10105 by workplaceId in ascending order
          filteredExclude10105.sort((a, b) => {
            const workplaceA = a.employee_record[0]?.workplaceId || "";
            const workplaceB = b.employee_record[0]?.workplaceId || "";
            
            const workplaceNumA = Number(workplaceA);
            const workplaceNumB = Number(workplaceB);

            if (workplaceNumA < workplaceNumB) {
              return -1;
            }
            if (workplaceNumA > workplaceNumB) {
              return 1;
            }
            return 0;
          });

          // Filter by year and month
          const dateFilteredData = filteredExclude10105.filter(
            (item) => item.year === year.toString() && item.month === month.toString().padStart(2, '0')
          );

          console.log("📅 After date filter:", dateFilteredData.length, "records");
          console.log("📋 Final filtered data:", dateFilteredData);
          setResponseDataAll(dateFilteredData);
        } else if (selectedOption == "option2") {
          const responseData = response.data.result; // แก้ไข: เข้าถึง result array
          console.log("🔄 Processing Option 2 (Employee filter)");

          // Filter data based on searchEmployeeId if provided
          const filteredData = searchEmployeeId
            ? responseData.filter((item) => item.employeeId === searchEmployeeId)
            : responseData;

          console.log("👤 After employee filter:", filteredData.length, "records");

          // Sort filteredData by workplaceId in ascending order
          filteredData.sort((a, b) => {
            const workplaceA = a.employee_record?.[0]?.workplaceId || "";
            const workplaceB = b.employee_record?.[0]?.workplaceId || "";
            
            const workplaceNumA = Number(workplaceA);
            const workplaceNumB = Number(workplaceB);

            if (workplaceNumA < workplaceNumB) {
              return -1;
            }
            if (workplaceNumA > workplaceNumB) {
              return 1;
            }
            return 0;
          });

          // Filter by year and month
          const dateFilteredData = filteredData.filter(
            (item) => item.year === year.toString() && item.month === month.toString().padStart(2, '0')
          );

          console.log("📅 After date filter:", dateFilteredData.length, "records");
          console.log("📋 Final filtered data:", dateFilteredData);
          setResponseDataAll(dateFilteredData);
        }
      } catch (error) {
        console.error("❌ API Error:", error);
        console.error("❌ Error message:", error.message);
        if (error.response) {
          console.error("❌ Response status:", error.response.status);
          console.error("❌ Response data:", error.response.data);
        }
      }
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

  // ...existing code after useEffects...

// เพิ่มฟังก์ชันใหม่
// แก้ไขฟังก์ชัน getSumCashWork ให้ใช้ responseDataAll แทน cashWorkData
const getSumCashWork = (employeeId) => {
  const employeeData = responseDataAll.find(item => item.employeeId === employeeId);
  return employeeData ? parseFloat(employeeData.sumCashWork || 0) : 0;
};

const generatePDF = async () => {
  // ADD - ป้องกันการกดซ้ำ
  if (isGeneratingPDF) return;
  
  // ADD - ตรวจสอบข้อมูล
  if (!responseDataAll || responseDataAll.length === 0) {
    alert("กรุณารอให้ข้อมูลโหลดเสร็จก่อน หรือเลือกเงื่อนไขการค้นหา");
    return;
  }
  
  try {
    setIsGeneratingPDF(true); // ADD - เริ่ม loading
    console.log("🎯 START: generatePDF function called");
  console.log("📊 ResponseDataAll length:", responseDataAll?.length);
  console.log("📊 ResponseDataAll data:", responseDataAll);
   

  
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
  };

  // Set the initial position for text and frame
  let x = 20;

  pdf.setFont("THSarabunNew Bold");

  // ฟังก์ชันคำนวณเงินรับสุทธิ
  const calculateNetSalary = (employee) => {
    const incomeTotal = 
      parseFloat(employee?.sumCashWork || '0') + 
      parseFloat(employee?.sumCashOt || '0') +
      parseFloat(employee?.cashSpecialDay || '0') + 
      parseFloat(
        employee?.addSalaryList?.reduce(
          (total, item) => total + parseFloat(item.SpSalary || '0'),
          0
        ) || '0'
      );

    const deductionTotal =
      parseFloat(employee?.socialSecurity || '0') +
      parseFloat(employee?.tax || '0');

    const netTotal = incomeTotal - deductionTotal;

    return isNaN(netTotal) ? 0 : netTotal;
  };

  // Loop through the names and ages arrays to add content to the PDF
  for (let i = 0; i < responseDataAll.length; i += 2) {
    console.log(`🔄 Processing employee loop iteration ${i}/${responseDataAll.length}`);
    
    // Add a page for each pair of names
    if (i > 0) {
      pdf.addPage();
    }

    // ใช้ข้อมูลจาก employee_record แทน accountingRecord
    const currentEmployee = responseDataAll[i];
    console.log(`👤 Processing employee ${i}:`, currentEmployee?.employeeId, currentEmployee?.employeeName);
    const employeeRecords = currentEmployee.employee_record || [];
    const addSalaryList = currentEmployee.addSalaryList || [];

    // คำนวณเงินรับสุทธิสำหรับพนักงานคนแรก
    const netSalary1 = calculateNetSalary(currentEmployee);

    // คำนวณจำนวนวันทำงาน
    const workDays = employeeRecords.filter(record => record.dayType === "work").length;

    // รวมเงินจาก cashWork
    const totalCashWork = employeeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.cashWork || 0);
    }, 0);

    // รวมเงิน OT
    const totalCashOt = employeeRecords.reduce((sum, record) => {
      return sum + parseFloat(record.cashOt || 0);
    }, 0);

    // กรองเงินพิเศษตาม ID
    const excludedIds = ["1350", "1230", "1410", "1535", "1520",];
    const addSalaryFiltered = addSalaryList
      .filter((salary) => !excludedIds.includes(salary.id))
      .map((salary) => ({
        name: salary.name,
        SpSalary: Number(salary.SpSalary) || 0,
      }));

    // จ่างชดเชย
    const excludedIdsPayCompensation = [
      "1231", "1233", "1422", "1423", "1428", "1434", 
      "1435", "1429", "1427", "1234", "1426", "1425",
    ];

    const addSalaryPayCompensationFiltered = addSalaryList
      .filter((salary) => excludedIdsPayCompensation.includes(salary.id))
      .map((salary) => ({
        name: salary.name,
        SpSalary: Number(salary.SpSalary) || 0,
      }));

    // เบี้ยขยัน
    const formattedAmountHardWorking = addSalaryList.filter(
      (item) => item.id === "1410"
    );

    // ค่าเดินทาง(ไม่คิดประกัน)
    const formattedAddSalaryTavel = addSalaryList.filter(
      (item) => item.id === "1535"
    );

    const formattedAddSalaryFood = addSalaryList.filter(
      (item) => item.id === "1330"
    );

    const formattedAddSpeacialCash= addSalaryList.filter(
      (item) => item.id === "1560"
    );

    // Calculate the sum of SpSalary values in the filtered array
    const sumAmountHardWorking = formattedAmountHardWorking.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSalaryTavel = formattedAddSalaryTavel.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSalaryFood = formattedAddSalaryFood.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    const sumAddSpecialCash = formattedAddSpeacialCash.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );

    // วันหยุดนักขัติฤกษ์
    const specialDayOff = parseInt(currentEmployee.specialDayOff || 0);

    pdf.setFontSize(15);

    pdf.text(`ใบจ่ายเงินเดือน`, 73, 12);
    pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 18);

    pdf.setFontSize(12);

    const head = 25;
    const head2 = 155;

    pdf.text(`รหัส`, 7, head);
    pdf.text(`ชื่อ-สกุล`, 30, head);
    pdf.text(`หน่วยงาน`, 80, head);

    // ใช้ workplaceId จาก employee_record
    const currentWorkplaceId = employeeRecords[0]?.workplaceId;
    pdf.text(`${currentWorkplaceId || ""}`, 93, head);

    const workplace = workplaceList.find(
      (item) => item.workplaceId === currentWorkplaceId
    );

    const workplaceName = workplace ? workplace.workplaceName : "Unknown";
    pdf.text(`${workplaceName}`, 103, head);

    // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
    console.log("📋 About to call getEmployeeBankNumber with:", currentEmployee?.employeeId);
    console.log("👤 Current employee data:", currentEmployee);
    console.log("🔍 Employee ID exists?", !!currentEmployee?.employeeId);
    
    if (!currentEmployee?.employeeId) {
      console.error("❌ No employeeId found in currentEmployee!");
      console.log("🔍 Available keys in currentEmployee:", Object.keys(currentEmployee || {}));
    }
    
    const banknumber = await getEmployeeBankNumber(currentEmployee.employeeId);
    console.log("💰 Final banknumber result:", banknumber);
    pdf.text(`เลขที่บัญชี ${banknumber}`, 168, head);

    // สวัสดิการหลัก
   const namesWithSpecificIds = addSalaryList
  .filter((item) => ["1230", "1350", "1535"].includes(item.id))
  .map((item) => {
    if (item.id === "1350") {
      return "โทรศัพท์";
    } else if (item.id === "1535") {
      return "ค่าเดินทาง";
    } else {
      return item.name;
    }
  });

  const nameWithExtraCash = addSalaryList 
   .filter((item) => ["1560", "1563"].includes(item.id))
  .map((item) => {
    if (item.id === "1560") {
      return "เงินเพิ่มพิเศษ";
    } else if (item.id === "1563") {
      return "เงินพิเศษวันหยุด";
    } else {
      return item.name;
    }
  });



   const specificIds = ["1230", "1350", "1535"];
const result = addSalaryList
  .filter((item) => specificIds.includes(item.id))
  .reduce(
    (acc, item) => {
      acc.names.push(item.id === "1350" ? "โทรศัพท์" : (item.id === "1535" ? "ค่าเดินทาง" : item.name));
      acc.sumSpSalary += Number(item.SpSalary) || 0;
      return acc;
    },
    { names: [], sumSpSalary: 0 }
  );

  const extraCashIds = ["1560", "1563"];
const resultExtraCash = addSalaryList
  .filter((item) => extraCashIds.includes(item.id))
  .reduce(
    (acc, item) => {
      acc.names.push(item.id === "1560" ? "เงินเพิ่มพิเศษ" : (item.id === "1563" ? "เงินพิเศษวันหยุด" : item.name));
      acc.sumSpSalary += Number(item.SpSalary) || 0;
      return acc;
    },
    { names: [], sumSpSalary: 0 }
  );


    const concatenatedNames =
      namesWithSpecificIds.length > 0 ? namesWithSpecificIds.join("/") : "";
      const concatenatedNamesExtraCash =
      nameWithExtraCash.length > 0 ? nameWithExtraCash.join("/") : "";

    // Draw tables and frames
    pdf.rect(7, 28, 155, 74); //ตารางหลัก
    pdf.rect(7, 28, 155, 12); //ตารางหลัก หัวตาราง
    pdf.rect(7, 28, 155, 63); //ตารางหลัก ล่าง
    pdf.rect(7, 28, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
    pdf.text(`รายได้`, 24, 34);
    pdf.text(`Earnings`, 22, 37);

    const textArray = [];
    const countArray = [];
    const valueArray = [];

    // เงินเดือนพื้นฐาน
    if (totalCashWork > 0) {
      textArray.push("เงินเดือน");
      countArray.push(workDays.toString());
      valueArray.push(
      currentEmployee.sumCashWorkMul["1"].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }
  const pubDayCount = parseFloat(currentEmployee.publicHolidayCount || 0);
  const pubDayCash = parseFloat(currentEmployee.publicHolidayCash || 0);

     if (pubDayCount > 0) {
      textArray.push("วันหยุดนักขัตฤกษ์");
      countArray.push(pubDayCount.toString());
      valueArray.push(
      currentEmployee.publicHolidayCash
      );
    }


const ot15Hours = parseFloat(currentEmployee.sumOt1p5 || 0);
  


const ot15Cash = parseFloat(currentEmployee.sumCashOt || 0);

if (ot15Hours > 0 && ot15Cash > 0) {
  textArray.push("ค่าล่วงเวลา 1.5 เท่า");
  countArray.push(ot15Hours.toFixed(2));
  valueArray.push(
    currentEmployee.sumCashWorkMul["1.5"].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}


const ot2Hours = parseFloat(currentEmployee.sumOtPublicHoliday || 0);

const ot2Cash = parseFloat(currentEmployee.sumCashWorkMul?.["2"] || 0);

if (ot2Hours > 0 && ot2Cash > 0) {
  textArray.push("ค่าล่วงเวลา 2 เท่า");
  countArray.push(ot2Hours.toFixed(2));
  valueArray.push(
    ot2Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

// ค่าล่วงเวลา 3 เท่า
const ot3Hours = parseFloat(currentEmployee.sumOt3 || 0);

const ot3Cash = parseFloat(currentEmployee.sumCashWorkMul?.["3"] || 0);

if (ot3Hours > 0 && ot3Cash > 0) {
  textArray.push("ค่าล่วงเวลา 3 เท่า");
  countArray.push(ot3Hours.toFixed(2));
  valueArray.push(
    ot3Cash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}


    // สวัสดิการหลัก
    if (result.sumSpSalary > 0) {
      textArray.push(concatenatedNames);
      countArray.push("");
      valueArray.push(
        result.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    if (resultExtraCash.sumSpSalary > 0) {
  textArray.push(concatenatedNamesExtraCash);
  countArray.push("");
  valueArray.push(
    resultExtraCash.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

  

    // เบี้ยขยัน
    if (sumAmountHardWorking > 0) {
      textArray.push("เบี้ยขยัน");
      countArray.push("");
      valueArray.push(
        sumAmountHardWorking.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }



    // รวมเงินพิเศษ
    // const totalSpSalary = addSalaryFiltered.reduce(
    //   (sum, salary) => sum + salary.SpSalary,
    //   0
    // );

    if (sumAddSalaryFood > 0) {
      textArray.push("ค่าอาหาร");
      countArray.push("");
      valueArray.push(
        sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    if (sumAddSpecialCash > 0) {
      textArray.push("ค่าเงินพิเศษ");
      countArray.push("");
      valueArray.push(
        sumAddSpecialCash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // จ่ายชดเชยวันลา
    const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
      (sum, salary) => sum + salary.SpSalary,
      0
    );

    if (totalSpSalaryCompensation > 0) {
      textArray.push("จ่ายชดเชยวันลา");
      countArray.push("");
      valueArray.push(
        totalSpSalaryCompensation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // รายการหัก
    const textDedustArray = [];
    const valueDedustArray = [];



    // ภาษี
    const tax = parseFloat(currentEmployee.tax || 0);
    if (tax >= 0) {
      textDedustArray.push("ภาษีเงินได้");
      valueDedustArray.push(
        tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }
    
    // คืนเงินเบิกล่วงหน้า - เพิ่มการตรวจสอบ safety
    const advance = parseFloat(
      currentEmployee.deductSalaryList && 
      currentEmployee.deductSalaryList[0] && 
      currentEmployee.deductSalaryList[0].amount || 0
    );
    if (advance > 0) {
      textDedustArray.push("คืนเงินเบิกล่วงหน้า");
      valueDedustArray.push(
        advance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // ประกันสังคม
    const socialSecurity = parseFloat(currentEmployee.socialSecurity || 0);
    if (socialSecurity > 0) {
      textDedustArray.push("สมทบประกันสังคม");
      valueDedustArray.push(
        socialSecurity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }

    // Draw table headers and content
    pdf.rect(7, 28, 62, 63);
    pdf.text(`จำนวน`, 56, 34);
    pdf.text(`Number`, 55, 37);

    pdf.rect(69, 28, 24, 74);
    pdf.text(`จำนวนเงิน`, 74, 34);
    pdf.text(`Amount`, 75, 37);

    pdf.rect(69, 28, 69, 74);
    pdf.text(`รายการหัก / รายการคืน`, 102, 34);

    pdf.text(`รวมเงินได้`, 28, 96);
    pdf.text(`Total Earning`, 23, 100);

    pdf.text(`รายการหัก / รายการคืน`, 100, 96);
    pdf.text(`Total Deduction`, 105, 100);

    pdf.text(`จำนวนเงิน`, 144, 34);
    pdf.text(`Amount`, 145, 37);

    pdf.rect(162 + 9, 28, 25, 25);
    pdf.rect(162 + 9, 28, 25, 15);
    pdf.text(`วันที่จ่าย`, 179, 35);
    pdf.text(`Payroll Date`, 176, 38);
    pdf.text(`${paymentDate || "N/A"}`, 176, 49);

    pdf.rect(162 + 9, 77, 25, 25);
    pdf.rect(162 + 9, 77, 25, 15);
    pdf.text(`เงินรับสุทธิ`, 178, 84);
    pdf.text(`Net To Pay`, 177, 87);

    pdf.rect(7, 104, 155, 13);
    pdf.rect(7, 104, 155, 6.5);

    let x1 = 31;
    for (let j = 0; j < 5; j++) {
      pdf.rect(7, 104, x1, 13);
      x1 += 31;
    }

    pdf.text(`เงินได้สะสมต่อปี`, 9, 108);
    pdf.text(`ภาษีสะสมต่อปี`, 40, 108);
    pdf.text(`เงินสะสมกองทุนต่อปี`, 71, 108);
    pdf.text(`เงินประกันสะสมต่อปี`, 102, 108);
    pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, 108);

    pdf.rect(112, 119, 50, 12);
    pdf.text(`ลงชื่อพนักงาน`, 130, 130);

    // แสดงข้อมูลพนักงาน
    pdf.text(`${currentEmployee.employeeId}`, 13, head);
    pdf.text(`${currentEmployee.prefix} ${currentEmployee.employeeName}`, 40, head);

    // แสดงรายการรายได้
    let y = 44;
    textArray.forEach((text) => {
      pdf.text(`${text}`, 8, y);
      y += 4.1;
    });

    let y2 = 44;
    countArray.forEach((text) => {
      pdf.text(`${text}`, 68, y2, { align: "right" });
      y2 += 4.1;
    });

    let y3 = 44;
    valueArray.forEach((text) => {
      pdf.text(`${text}`, 92, y3, { align: "right" });
      y3 += 4.1;
    });

    // แสดงรายการหัก
    let y4 = 44;
    textDedustArray.forEach((text) => {
      pdf.text(`${text}`, 94, y4);
      y4 += 4.1;
    });

    let y5 = 44;
    valueDedustArray.forEach((text) => {
      pdf.text(`${text}`, 160, y5, { align: "right" });
      y5 += 4.1;
    });

    // รวมรายได้ทั้งหมด
    const incomeTotal = 
      parseFloat(currentEmployee?.sumCashWork || '0') + 
      parseFloat(currentEmployee?.sumCashOt || '0') +
      parseFloat(currentEmployee?.publicHolidayCash || '0') + 
      parseFloat(
        currentEmployee?.addSalaryList?.reduce(
          (total, item) => total + parseFloat(item.SpSalary || '0'),
          0
        ) || '0'
      );

    pdf.text(
      `${incomeTotal.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      92,
      96,
      { align: "right" }
    );

    // รวมเงินหัก
    const totalDeductions = tax + socialSecurity + advance ;
    pdf.text(
      `${totalDeductions.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      160,
      96,
      { align: "right" }
    );
    const totalNet = incomeTotal - totalDeductions;

    // เงินรับสุทธิ (ใช้สูตรคำนวณใหม่)
    pdf.text(
      `${totalNet.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      190,
      98,
      { align: "right" }
    );

    // สำหรับพนักงานคนที่ 2 (ถ้ามี)
    if (i + 1 < responseDataAll.length) {
      const currentEmployee2 = responseDataAll[i + 1];
      const employeeRecords2 = currentEmployee2.employee_record || [];
      const addSalaryList2 = currentEmployee2.addSalaryList || [];

      // คำนวณเงินรับสุทธิสำหรับพนักงานคนที่ 2
      const netSalary2 = calculateNetSalary(currentEmployee2);

      // คำนวณข้อมูลสำหรับพนักงานคนที่ 2
      const workDays2 = employeeRecords2.filter(record => record.dayType === "work").length;
      const totalCashWork2 = parseFloat(currentEmployee.sumCashWorkMul["1"] || 0);


      const totalCashOt1p5 = parseFloat(currentEmployee2.sumCashWorkMul["1.5"] || 0);
      const totalCashOt2 = parseFloat(currentEmployee2.sumCashWorkMul["2"] || 0);
      const totalCashOt3 = parseFloat(currentEmployee2.sumCashWorkMul["3"] || 0);


      // สวัสดิการหลักสำหรับพนักงานคนที่ 2
      const result2 = addSalaryList2
        .filter((item) => ["1230", "1350", "1241"].includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name);
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );

      const concatenatedNames2 = result2.names.length > 0 ? result2.names.join("/") : "";

      // เบี้ยขยันสำหรับพนักงานคนที่ 2
      const sumAmountHardWorking2 = addSalaryList2
        .filter((item) => item.id === "1410")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      // ค่าเดินทางสำหรับพนักงานคนที่ 2
      const sumAddSalaryTavel2 = addSalaryList2
        .filter((item) => item.id === "1535")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      const sumAddSalaryFood = addSalaryList2
        .filter((item) => item.id === "1330")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      const sumAddSpecialCash = addSalaryList2
        .filter((item) => item.id === "1560")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);

      // วันหยุดนักขัติฤกษ์สำหรับพนักงานคนที่ 2
      const specialDayOff2 = parseInt(currentEmployee2.specialDayOff || 0);
      const specialDayAmount2 = parseFloat(currentEmployee2.cashSpecialDay || 0);

      // วาดส่วนของพนักงานคนที่ 2
      pdf.setFontSize(15);
      pdf.text(`ใบจ่ายเงินเดือน`, 73, 142);
      pdf.text(`บริษัท โอวาท โปร แอนด์ ควิก จำกัด`, 55, 148);
      pdf.setFontSize(12);

      // แสดงข้อมูลพนักงานคนที่ 2
      const currentWorkplaceId2 = employeeRecords2[0]?.workplaceId;
      pdf.text(`รหัส`, 7, head2);
      pdf.text(`ชื่อ-สกุล`, 30, head2);
      pdf.text(`หน่วยงาน`, 80, head2);
      pdf.text(`${currentWorkplaceId2 || ""}`, 93, head2);

      const workplace2 = workplaceList.find(
        (item) => item.workplaceId === currentWorkplaceId2
      );

      const workplaceName2 = workplace2 ? workplace2.workplaceName : "Unknown";
      pdf.text(`${workplaceName2}`, 103, head2);

      // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck2 เดิม
      console.log("📋 About to call getEmployeeBankNumber (Employee 2) with:", currentEmployee2.employeeId);
      console.log("👤 Current employee2 data:", currentEmployee2);
      const banknumber2 = await getEmployeeBankNumber(currentEmployee2.employeeId);
      console.log("💰 Final banknumber2 result:", banknumber2);
      pdf.text(`เลขที่บัญชี ${banknumber2}`, 168, head2);

      // วาดตารางสำหรับพนักงานคนที่ 2
      pdf.rect(7, head2 + 3, 155, 74);
      pdf.rect(7, head2 + 3, 155, 12);
      pdf.rect(7, head2 + 3, 155, 63);
      pdf.rect(7, head2 + 3, 44, 63);
      pdf.text(`รายได้`, 24, head2 + 9);
      pdf.text(`Earnings`, 22, head2 + 12);

      pdf.rect(7, head2 + 3, 62, 63);
      pdf.text(`จำนวน`, 56, head2 + 9);
      pdf.text(`Number`, 55, head2 + 12);

      pdf.rect(69, head2 + 3, 24, 74);
      pdf.text(`จำนวนเงิน`, 74, head2 + 9);
      pdf.text(`Amount`, 75, head2 + 12);

      pdf.rect(69, head2 + 3, 69, 74);
      pdf.text(`รายการหัก / รายการคืน`, 102, head2 + 9);

      pdf.text(`รวมเงินได้`, 28, head2 + 71);
      pdf.text(`Total Earning`, 23, head2 + 75);

      pdf.text(`รายการหัก / รายการคืน`, 100, head2 + 71);
      pdf.text(`Total Deduction`, 105, head2 + 75);

      pdf.text(`จำนวนเงิน`, 144, head2 + 9);
      pdf.text(`Amount`, 145, head2 + 12);

      pdf.rect(162 + 9, head2 + 3, 25, 25);
      pdf.rect(162 + 9, head2 + 3, 25, 15);
      pdf.text(`วันที่จ่าย`, 179, head2 + 9);
      pdf.text(`Payroll Date`, 176, head2 + 12);

      pdf.rect(162 + 9, head2 + 52, 25, 25);
      pdf.rect(162 + 9, head2 + 52, 25, 15);
      pdf.text(`เงินรับสุทธิ`, 178, head2 + 59);
      pdf.text(`Net To Pay`, 177, head2 + 62);

      pdf.rect(7, head2 + 79, 155, 13);
      pdf.rect(7, head2 + 79, 155, 6.5);

      let x2 = 31;
      for (let j = 0; j < 5; j++) {
        pdf.rect(7, head2 + 79, x2, 13);
        x2 += 31;
      }

      pdf.text(`เงินได้สะสมต่อปี`, 9, head2 + 83);
      pdf.text(`ภาษีสะสมต่อปี`, 40, head2 + 83);
      pdf.text(`เงินสะสมกองทุนต่อปี`, 71, head2 + 83);
      pdf.text(`เงินประกันสะสมต่อปี`, 102, head2 + 83);
      pdf.text(`ค่าลดหย่อนอื่นๆ`, 133, head2 + 83);

      pdf.rect(112, head2 + 94, 50, 12);
      pdf.text(`ลงชื่อพนักงาน`, 130, head2 + 105);

      pdf.text(`${currentEmployee2.employeeId}`, 13, head2);
      pdf.text(`${currentEmployee2.prefix} ${currentEmployee2.employeeName}`, 40, head2);

      // สร้างรายการรายได้สำหรับพนักงานคนที่ 2
      const textArray2 = [];
      const countArray2 = [];
      const valueArray2 = [];
 
      if (totalCashWork2 > 0) {
        textArray2.push("เงินเดือน");
        countArray2.push(workDays2.toString());
        valueArray2.push(
          totalCashWork2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
      const pubDayCount2 = parseFloat(currentEmployee2.publicHolidayCount || 0);
      const pubDayCash2 = parseFloat(currentEmployee2.publicHolidayCash || 0);

      if (pubDayCount2 > 0) {
        textArray2.push("วันหยุดนักขัตฤกษ์");
        countArray2.push(pubDayCount2.toFixed(2));
        valueArray2.push(
          pubDayCash2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
      
      if (totalCashOt1p5 > 0) {
        const otHours1p5 = parseFloat(currentEmployee2.sumOt1p5 || 0);

        textArray2.push("ค่าล่วงเวลา 1.5 เท่า");
        countArray2.push(otHours1p5.toFixed(2));
        valueArray2.push(
          totalCashOt1p5.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (totalCashOt2 > 0) {
        const otHours2 = parseFloat(currentEmployee2.sumOtPublicHoliday || 0);

        textArray2.push("ค่าล่วงเวลา 2 เท่า");
        countArray2.push(otHours2.toFixed(2));
        valueArray2.push(
          totalCashOt2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (totalCashOt3 > 0) {
        const otHours3 = parseFloat(currentEmployee2.sumOt3 || 0);

        textArray2.push("ค่าล่วงเวลา 3 เท่า");
        countArray2.push(otHours3.toFixed(2));
        valueArray2.push(
          totalCashOt3.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (result2.sumSpSalary > 0) {
        textArray2.push(concatenatedNames2);
        countArray2.push("");
        valueArray2.push(
          result2.sumSpSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (sumAddSalaryTavel2 > 0) {
        textArray2.push("ค่าเดินทาง");
        countArray2.push("");
        valueArray2.push(
          sumAddSalaryTavel2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      if (sumAmountHardWorking2 > 0) {
        textArray2.push("เบี้ยขยัน");
        countArray2.push("");
        valueArray2.push(
          sumAmountHardWorking2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

       if (sumAddSalaryFood > 0) {
          // Push the text to textArray and the value to valueArray
          textArray2.push("ค่าอาหาร");
          countArray2.push("");
          valueArray2.push(
            sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
       if (sumAddSpecialCash > 0) {
          // Push the text to textArray and the value to valueArray
          textArray2.push("ค่าเงินพิเศษ");
          countArray2.push("");
          valueArray2.push(
            sumAddSpecialCash.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
          console.log("77.1");
        }
        

      

      // รายการหักสำหรับพนักงานคนที่ 2
      const textDedustArray2 = [];
      const valueDedustArray2 = [];

      const tax2 = parseFloat(currentEmployee2.tax || 0);
      if (tax2 >= 0) {
        textDedustArray2.push("หักภาษีเงินได้");
        valueDedustArray2.push(
          tax2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
 


      const socialSecurity2 = parseFloat(currentEmployee2.socialSecurity || 0);
      console.log("Social Security for Employee 2:", socialSecurity2);
      
      if (socialSecurity2 > 0) {
        textDedustArray2.push("หักสมทบประกันสังคม");
        valueDedustArray2.push(
          socialSecurity2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      // แสดงรายการสำหรับพนักงานคนที่ 2
      let y2_1 = 174;
      textArray2.forEach((text) => {
        pdf.text(`${text}`, 8, y2_1);
        y2_1 += 4.1;
      });

      let y2_2 = 174;
      countArray2.forEach((text) => {
        pdf.text(`${text}`, 68, y2_2, { align: "right" });
        y2_2 += 4.1;
      });

      let y2_3 = 174;
      valueArray2.forEach((text) => {
        pdf.text(`${text}`, 92, y2_3, { align: "right" });
        y2_3 += 4.1;
      });

      let y2_4 = 174;
      textDedustArray2.forEach((text) => {
        pdf.text(`${text}`, 94, y2_4);
        y2_4 += 4.1;
      });

      let y2_5 = 174;
      valueDedustArray2.forEach((text) => {
        pdf.text(`${text}`, 160, y2_5, { align: "right" });
        y2_5 += 4.1;
      });

      // รวมรายได้ทั้งหมดสำหรับพนักงานคนที่ 2
      const incomeTotal2 = 
        parseFloat(currentEmployee2?.sumCashWork || '0') + 
        parseFloat(currentEmployee2?.sumCashOt || '0') +
        parseFloat(currentEmployee2?.publicHolidayCash || '0') + 
        parseFloat(
          currentEmployee2?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );

      pdf.text(
        `${incomeTotal2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        92,
        head2 + 71,
        { align: "right" }
      );

      // รวมเงินหักสำหรับพนักงานคนที่ 2
      const totalDeductions2 = tax2 + socialSecurity2;
      
      pdf.text(
        `${totalDeductions2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        160,
        head2 + 71,
        { align: "right" }
      );

      // เงินรับสุทธิสำหรับพนักงานคนที่ 2 (ใช้สูตรคำนวณใหม่)
      pdf.text(
        `${netSalary2.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        190,
        head2 + 72,
        { align: "right" }
      );
    }

    // Reset position for the next row
    x = 20;
  }

  // Open the generated PDF in a new tab
  window.open(pdf.output("bloburl"), "_blank");
  
  } catch (error) {
    console.error("❌ Error generating PDF:", error); // ADD - error handling  
    alert("เกิดข้อผิดพลาดในการสร้าง PDF"); // ADD - user notification
  } finally {
    setIsGeneratingPDF(false); // ADD - จบ loading
  }
};


  const generatePDFAudit = async () => {
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
        responseDataAll[i].specialDayListWork?.length || 0;
      // const countcal = responseDataAll[i].accountingRecord[0].countDay - countSpecialDayListWork;
      // const countcal = responseDataAll[i].accountingRecord[0].countDayWork
      const countcal = responseDataAll[i].accountingRecord?.[0]?.countDayWork || 0;

      // 2.0
      const formattedAmountHoliday2_0 = Number(
        countSpecialDayListWork * (responseDataAll[i].specialDayRate ?? 0)
      );

      // รถโทรตำแหน่ง
      const formattedAddTel = Number(
        responseDataAll[i].accountingRecord?.[0]?.tel || 0
      );
      const formattedAddAmountPosition = Number(
        responseDataAll[i].accountingRecord?.[0]?.amountPosition || 0
      );
      const formattedAddTravel = Number(
        responseDataAll[i].accountingRecord?.[0]?.travel || 0
      );

      // The IDs you want to exclude
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];

      // Assuming responseDataAll[i].addSalary is an array of salary objects
      const addSalaryFiltered = (responseDataAll[i].addSalary || [])
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
      const addSalaryPayCompensationFiltered = (responseDataAll[i].addSalary || [])
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id)) // Filter out the objects with excluded IDs
        .map((salary) => ({
          name: salary.name,
          SpSalary: Number(salary.SpSalary) || 0, // Convert SpSalary to number
        }));

      const formattedAddTelAmountPositionTravel =
        formattedAddTel + formattedAddAmountPosition + formattedAddTravel;

      // เบี้ยขยัน
      const formattedAmountHardWorking = (responseDataAll[i].addSalary || []).filter(
        (item) => item.id === "1410"
      );

      // ค่าเดินทาง(ไม่คิดประกัน)
      const formattedAddSalaryTavel = (responseDataAll[i].addSalary || []).filter(
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
      const countSpecialDayWork = responseDataAll[i].countSpecialDay || 0;
      const formattedAmountHoliday = Number(
        (responseDataAll[i].countSpecialDay || 0) *
        (responseDataAll[i].specialDayRate ?? 0)
      );

      //เงินพิเศษ
      const formattedSumAddSalaryAfterTax = Number(
        responseDataAll[i].accountingRecord?.[0]?.sumAddSalaryAfterTax ?? 0
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

      // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
      const banknumber = await getEmployeeBankNumber(responseDataAll[i].employeeId);

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


      const specificIds = ["1230", "1350", "1241"]; // ID ที่ต้องการกรอง

      const result = responseDataAll[i].addSalary
        .filter((item) => specificIds.includes(item.id)) // กรองเฉพาะ ID ที่ต้องการ
        .reduce(
          (acc, item) => {
            // คำนวณผลรวม SpSalary
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name); // เปลี่ยนชื่อสำหรับ ID 1350
            acc.sumSpSalary += Number(item.SpSalary) || 0; // รวมค่า SpSalary (กรณีไม่มีค่าให้ใช้ 0)
            return acc;
          },
          { names: [], sumSpSalary: 0 } // ค่าเริ่มต้น
        );

      console.log("Sum of SpSalary:", result.sumSpSalary);
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
        responseDataAll[i].accountingRecord?.[0]?.amountDay != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountDay != null
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
        responseDataAll[i].accountingRecord?.[0]?.amountDay != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountDay != null
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
        responseDataAll[i].accountingRecord?.[0]?.amountOneFive != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountOneFive != null
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
        responseDataAll[i].accountingRecord?.[0]?.amountTwo != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountTwo != null
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
        responseDataAll[i].accountingRecord?.[0]?.amountThree != 0 &&
        responseDataAll[i].accountingRecord?.[0]?.amountThree != null
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
      // if (
      //   formattedAddTelAmountPositionTravel != 0 &&
      //   formattedAddTelAmountPositionTravel != null
      // ) {
      //   // Push the text to textArray and the value to valueArray
      //   textArray.push(concatenatedNames);
      //   countArray.push("");
      //   valueArray.push(
      //     formattedAddTelAmountPositionTravel
      //       .toFixed(2)
      //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      //   );
      if (
        result.sumSpSalary != 0 &&
        result.sumSpSalary != null
      ) {
        // Push the text to textArray and the value to valueArray
        textArray.push(concatenatedNames);
        countArray.push("");
        valueArray.push(
          result.sumSpSalary
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
            textDedustArray.push("ภาษีเงินได้");
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

      // const sumSalary = amountDay + amountOt + sumAddSalary + specialDayRate;
      const total =
        parseFloat(responseDataAll[i].accountingRecord[0].total) || 0;

      const sumSalary = total;
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
        const formattedAddSalaryFood = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1330"
        );
        const formattedAddSpeacialCash = responseDataAll[i + 1].addSalary.filter(
          (item) => item.id === "1560"
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
        const sumAddSalaryFood = formattedAddSalaryFood.reduce(
          (total, item) => total + parseFloat(item.SpSalary || 0),
          0
        );
        const sumAddSpecialCash = formattedAddSpecialCash.reduce(
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

        const specificIds = ["1230", "1350", "1241"]; // ID ที่ต้องการกรอง

        const result = responseDataAll[i + 1].addSalary
          .filter((item) => specificIds.includes(item.id)) // กรองเฉพาะ ID ที่ต้องการ
          .reduce(
            (acc, item) => {
              // คำนวณผลรวม SpSalary
              acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name); // เปลี่ยนชื่อสำหรับ ID 1350
              acc.sumSpSalary += Number(item.SpSalary) || 0; // รวมค่า SpSalary (กรณีไม่มีค่าให้ใช้ 0)
              return acc;
            },
            { names: [], sumSpSalary: 0 } // ค่าเริ่มต้น
          );

        console.log("Sum of SpSalary:321", result.sumSpSalary);

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
        // if (
        //   formattedAddTelAmountPositionTravel != 0 &&
        //   formattedAddTelAmountPositionTravel != null
        // ) {
        //   // Push the text to textArray and the value to valueArray
        //   textArray.push(concatenatedNames);
        //   countArray.push("");
        //   valueArray.push(
        //     formattedAddTelAmountPositionTravel
        //       .toFixed(2)
        //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //   );
        if (
          result.sumSpSalary != 0 &&
          result.sumSpSalary != null
        ) {
          // Push the text to textArray and the value to valueArray
          textArray.push(concatenatedNames);
          countArray.push("");
          valueArray.push(
            result.sumSpSalary
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

        if (sumAddSalaryFood != 0 && sumAddSalaryFood != null) {
          // Push the text to textArray and the value to valueArray
          textArray.push("ค่าอาหาร");
          countArray.push("");
          valueArray.push(
            sumAddSalaryFood.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
          textDedustArray.push("ภาษีเงินได้");
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

        // ดึงเลขบัญชีจาก API แทนการใช้ bankCheck เดิม
        const banknumber = await getEmployeeBankNumber(responseDataAll[i + 1].employeeId);

        pdf.text(`เลขที่บัญชี ${banknumber}`, 155, head2);

        // pdf.rect(7, 156, 60, 30);

        pdf.rect(7, head2 + 3, 155, 74); //ตารางหลัก
        pdf.rect(7, head2 + 3, 155, 12); //ตารางหลัก หัวตาราง
        pdf.rect(7, head2 + 3, 155, 63); //ตารางหลัก ล่าง
        pdf.rect(7, head2 + 3, 44, 63); //ตารางหลัก บน ซ้าย ช่อง1 รายได้
        pdf.text(`รายได้`, 24, head2 + 9); //ตารางหลัก รายได้
        pdf.text(`Earnings`, 22, head2 + 12); //ตารางหลัก Earnings

        /////////////////

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

        // const sumSalary = amountDay + amountOt + sumAddSalary;

        // pdf.text(`${sumSalary.toFixed(2)}`, 92, head2 + 71, { align: 'right' });
        const total =
          parseFloat(responseDataAll[i + 1].accountingRecord[0].total) || 0;

        const sumSalary = total;

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
    // <body class="hold-transition sidebar-mini" className="editlaout">
    //   <div class="wrapper">
    //     <div class="content-wrapper">
    <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">

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
                  <br />
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
                    <button 
                      onClick={() => {
                        console.log("🖱️ Generate PDF button clicked!");
                        console.log("📊 Current responseDataAll:", responseDataAll);
                        generatePDF();
                      }} 
                      class="btn b_save"
                      disabled={isGeneratingPDF || !responseDataAll || responseDataAll.length === 0}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i>
                          กำลังสร้างสลิป...
                        </>
                      ) : (
                        selectedOption === "option1"
                          ? "ออกสลิป"
                          : selectedOption === "option2"
                            ? "ออกสลิป"
                            : ""
                      )}
                    </button>
                    </div>
                    <div class="col-md-3">
                      {/* <button onClick={generatePDFAudit} class="btn b_save">
                        {selectedOption === "option1"
                          ? "ออกสลิปออดิท"
                          : selectedOption === "option2"
                            ? "ออกสลิปออดิท"
                            : ""}
                      </button> */}
                    </div>
                  </div>



              </section>
            </div>
          </section>
        </div>
      </div>
    {/* </body> */}
    </div>
  );
}


export default SalarySlipPDF;
