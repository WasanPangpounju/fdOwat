import endpoint from "../../config";
import axios from "axios";
import { useEffect, useState, Suspense, lazy,useMemo } from "react";
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; 
import * as XLSX from "xlsx";
import { PDFViewer, Document, Page, Text, View, StyleSheet as PDFStyleSheet, pdf } from '@react-pdf/renderer';
import "moment/locale/th"; 




import { Font } from '@react-pdf/renderer';
Font.register({
  family: 'THSarabunNew',
  fonts: [
    { src: '/assets/fonts/THSarabunNew.ttf' },
    { src: '/assets/fonts/THSarabunNew-Bold.ttf', fontWeight: 'bold' },
    { src: '/assets/fonts/THSarabunNew-Italic.ttf', fontStyle: 'italic' },
  ]
});
Font.register({
  family: 'CourierPrime',
  fonts: [
    { src: '/assets/fonts/CourierPrime-Regular.ttf' },
    { src: '/assets/fonts/CourierPrime-Bold.ttf', fontWeight: 'bold' },
    { src: '/assets/fonts/CourierPrime-Italic.ttf', fontStyle: 'italic' },
  ]
});

function BankReport({ employeeList, workplaceList }) {

  const filteredEmployeeList = useMemo(() => {
    if (!employeeList || !Array.isArray(employeeList)) {
      return [];
    }
    return employeeList.map(
      ({ name, lastName, employeeId, branchBank, salarybank }) => ({
        name,
        lastName,
        employeeId,
        branchBank,
        salarybank // เพิ่ม salarybank ด้วย
      })
    );
  }, [employeeList]);
const [bankFullName, setBankFullName] = useState("");
const [allBankNames, setAllBankNames] = useState([]);
const [timeRecordData, setTimeRecordData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  
  // คงค่า state เดิมไว้



  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [bankEmployees, setBankEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completeEmployeeData, setCompleteEmployeeData] = useState([]); // State to hold complete employee data

  const [dataAccounting, setDataAccounting] = useState([]); //แก้ไขจาก "" เป็น []
  const [workplacrId, setWorkplacrId] = useState(""); //รหัสหน่วยงาน
  const [workplacrName, setWorkplacrName] = useState(""); //รหัสหน่วยงาน
  
  // State สำหรับ checkbox ภ.ง.ด
  const [isPhangD3Checked, setIsPhangD3Checked] = useState(false);
  const [isPhangD1Checked, setIsPhangD1Checked] = useState(false);
  
  // ฟังก์ชันจัดการการเปลี่ยนแปลง checkbox
  const handlePhangD3Change = (e) => {
    setIsPhangD3Checked(e.target.checked);
    // ทำการกรองข้อมูลใหม่
    if (selectedBank) {
      handleChange({ target: { value: selectedBank } });
    }
  };
  
  const handlePhangD1Change = (e) => {
    setIsPhangD1Checked(e.target.checked);
    // ทำการกรองข้อมูลใหม่
    if (selectedBank) {
      handleChange({ target: { value: selectedBank } });
    }
  };
  console.log('filteredEmployeeList', filteredEmployeeList);

  const extractBankNames = (list) => {
    const bankNames = list
      .map((employee) => {
        // ใช้ salarybank แทน branchBank
        if (employee.salarybank) {
          return employee.salarybank.trim();
        }
        return null; // Return null for invalid entries
      })
    .filter((name) => name !== null); // Remove null entries

  return [...new Set(bankNames)]; // Remove duplicates
};

  const uniqueBankNames = extractBankNames(filteredEmployeeList);

  console.log('uniqueBankNames', uniqueBankNames);


  const [selectedBank, setSelectedBank] = useState("");
  // ฟังก์ชันจัดการการเปลี่ยนค่า
  // const handleChange = (event) => {
  //   setSelectedBank(event.target.value);
  // };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const [startShowDatePicker, setStartShowDatePicker] = useState(false);
  const [startSelectedDate, setStartSelectedDate] = useState(null);
  const [startFormattedDate321, setStartFormattedDate] = useState(null);

  const [endShowDatePicker, setEndShowDatePicker] = useState(false);
  const [endSelectedDate, setEndSelectedDate] = useState(null);
  const [endFormattedDate321, setEndFormattedDate] = useState(null);
// เพิ่ม state สำหรับเก็บข้อมูลที่กรองแล้ว
const [filteredByBankAndDate, setFilteredByBankAndDate] = useState([]);
  const [workDate, setWorkDate] = useState(new Date());

  // console.log("selectedDate", selectedDate + " " + formattedDate321);
  // console.log("startSelectedDate", startSelectedDate + " " + startFormattedDate321);
  // console.log("endSelectedDate", endSelectedDate + " " + endFormattedDate321);

  // console.log("endSelectedDate", endSelectedDate + " " + endFormattedDate321);


  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
  };

  const handleDatePickerStartChange = (date) => {
    setStartSelectedDate(date);
    setStartShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
  };

  const handleDatePickerEndChange = (date) => {
    setEndSelectedDate(date);
    setEndShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
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

    if (startSelectedDate) {
      // Convert the selected date string to a Date object and format it
      const datestart = new Date(startSelectedDate);
      const formattedDateStart = formatDate(datestart);
      setStartFormattedDate(formattedDateStart);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setStartFormattedDate(formattedCurrentDate);
      setStartSelectedDate(currentDate); // Set the initial selected date to the current date
    }

    if (endSelectedDate) {
      // Convert the selected date string to a Date object and format it
      const dateend = new Date(endSelectedDate);
      const formattedDateEnd = formatDate(dateend);
      setEndFormattedDate(formattedDateEnd);
    } else {
      // If selectedDate is null, use the current date
      const currentDate = new Date();
      const formattedCurrentDate = formatDate(currentDate);
      setEndFormattedDate(formattedCurrentDate);
      setEndSelectedDate(currentDate); // Set the initial selected date to the current date
    }
  }, [selectedDate, startSelectedDate, endSelectedDate]);

  const [responseDataAll, setResponseDataAll] = useState(filteredEmployeeList);
  const [present, setPresent] = useState("DATAOWAT");
  const [presentfilm, setPresentfilm] = useState(
    "\\10.10.110.251\payrolldata\Report\System\PRRPT011.V7.RPT"
  );

  const [month, setMonth] = useState("01");
  const currentYear = new Date().getFullYear(); // 2024

  const [year, setYear] = useState(currentYear);
  const EndYear = 2010;
  const years = Array.from(
    { length: currentYear - EndYear + 1 },
    (_, index) => EndYear + index
  ).reverse();

  const filteredEmployees = filteredEmployeeList.filter(
    (employee) => employee.branchBank === selectedBank
  );



useEffect(() => {
  const fetchTimeRecordData = async () => {
    if (!year || !month) {
        setIsLoading(false);
      return;
    }
    
    try {
      // แสดง log เพื่อตรวจสอบการส่งค่า
      console.log("กำลังดึงข้อมูล timerecord สำหรับปี", year, "เดือน", month);
      console.log("ค่า selectedBank ใน useEffect:", selectedBank);
      
      const response = await axios.get(endpoint + "/timerecord/listempdeletexx");
      console.log("ข้อมูลที่ได้จาก API:", response.data);
      
      if (response.data) {
        // กรองข้อมูลตามเดือนและปีที่เลือก
        const filteredData = response.data.filter(record => {
          // แปลงให้เป็น string ทั้งหมดเพื่อเปรียบเทียบ
          const recordYear = String(record.year || "");
          const recordMonth = String(record.month || "");
          const paramYear = String(year);
          const paramMonth = String(month);
          
          // เปรียบเทียบโดยไม่สนใจ type
          return recordYear == paramYear && recordMonth == paramMonth;
        });
        
        console.log("พบข้อมูลพนักงานในเดือน", month, "ปี", year, "จำนวน", filteredData.length, "คน");
        setTimeRecordData(filteredData);
        
        // ถ้าเลือก "เลือกธนาคาร" (Null) ให้แสดงข้อมูลทุกธนาคาร
        if (selectedBank === "Null" || !selectedBank) {
          console.log("แสดงข้อมูลทุกธนาคาร หรือยังไม่มีการเลือกธนาคาร");
          
          // เรียกใช้ API employee/search เพื่อดึงข้อมูลพนักงานทั้งหมด
          const employeeResponse = await axios.post(endpoint + "/employee/search", {});
          
          if (employeeResponse.data && employeeResponse.data.employees) {
            console.log("พบข้อมูลพนักงานทั้งหมด:", employeeResponse.data.employees.length, "คน");
            
            // กรองเฉพาะพนักงานที่มีธนาคาร (มี salarybank)
            let employeesWithBank = employeeResponse.data.employees.filter(employee => {
              const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
              return empSalaryBank !== "";
            });
            
            // เพิ่มเงื่อนไขการกรองตาม costtype
            if (isPhangD3Checked || isPhangD1Checked) {
              employeesWithBank = employeesWithBank.filter(employee => {
                if (isPhangD3Checked && isPhangD1Checked) {
                  // ถ้าเลือกทั้งสอง ให้แสดงทั้ง ภ.ง.ด.3 และ ภ.ง.ด.1
                  return employee.costtype === "ภ.ง.ด.3" || employee.costtype === "ภ.ง.ด.1";
                } else if (isPhangD3Checked) {
                  // ถ้าเลือกเฉพาะ ภ.ง.ด.3
                  return employee.costtype === "ภ.ง.ด.3";
                } else if (isPhangD1Checked) {
                  // ถ้าเลือกเฉพาะ ภ.ง.ด.1
                  return employee.costtype === "ภ.ง.ด.1";
                }
                return true;
              });
            }
            
            console.log("พนักงานที่มีข้อมูลธนาคาร:", employeesWithBank.length, "คน");
            
            // กรองข้อมูล timerecord ตามพนักงานที่มีธนาคาร
            const employeeIds = employeesWithBank.map(emp => emp.employeeId);
            
            const filteredByDateAndBank = filteredData.filter(record => {
              return employeeIds.includes(record.employeeId);
            });
            
            setFilteredByBankAndDate(filteredByDateAndBank);
            
            console.log("พนักงานทุกธนาคารที่มีข้อมูลในเดือน/ปีที่เลือก:", filteredByDateAndBank.length, "คน");
            
            // เรียกใช้ฟังก์ชันดึงข้อมูลละเอียดของพนักงาน
            const fetchEmployeeDetails = async () => {
              try {
                const completeEmployeeData = [];
                
                for (const record of filteredByDateAndBank) {
                  const response = await axios.get(`${endpoint}/employee/${record.employeeId}`);
                  
                  if (response.data) {
                    completeEmployeeData.push({
                      ...record,
                      employeeDetails: response.data
                    });
                  }
                }
                
                setCompleteEmployeeData(completeEmployeeData);
                console.log("ข้อมูลพนักงานทุกธนาคารที่สมบูรณ์:", completeEmployeeData.length, "คน");
                setIsLoading(false);

              } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลละเอียดของพนักงาน:", error);
                setIsLoading(false);
              }
            };

            if (filteredByDateAndBank.length > 0) {
              fetchEmployeeDetails();
            } else {
              setIsLoading(false);
            }
          }
        } else {
          console.log("มีการเลือกธนาคาร:", selectedBank);
          
          // เรียกใช้ API employee/search เพื่อดึงข้อมูลพนักงานทั้งหมด
          const employeeResponse = await axios.post(endpoint + "/employee/search", {});
          
          if (employeeResponse.data && employeeResponse.data.employees) {
            console.log("ตรวจสอบค่า salarybank ของพนักงานแต่ละคน:");
            
            // ตรวจสอบค่า salarybank ของพนักงานแต่ละคน
            employeeResponse.data.employees.forEach(employee => {
              const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
              const selectedBankTrimmed = selectedBank ? selectedBank.trim() : "";
              
              console.log(`พนักงาน: ${employee.name} (${employee.employeeId})`);
              console.log(`- salarybank: "${empSalaryBank}"`);
              console.log(`- selectedBank: "${selectedBankTrimmed}"`);
              console.log(`- ตรงกัน: ${empSalaryBank === selectedBankTrimmed}`);
              console.log(`- ความยาว salarybank: ${empSalaryBank.length}`);
              console.log(`- ความยาว selectedBank: ${selectedBankTrimmed.length}`);
              console.log("----------------------------------------");
            });
            
            // กรองพนักงานที่มีธนาคารตรงกับที่เลือก
            let filteredByBank = employeeResponse.data.employees.filter(employee => {
              const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
              const selectedBankTrimmed = selectedBank ? selectedBank.trim() : "";
              return empSalaryBank === selectedBankTrimmed;
            });
            
            // เพิ่มเงื่อนไขการกรองตาม costtype
            if (isPhangD3Checked || isPhangD1Checked) {
              filteredByBank = filteredByBank.filter(employee => {
                if (isPhangD3Checked && isPhangD1Checked) {
                  // ถ้าเลือกทั้งสอง ให้แสดงทั้ง ภ.ง.ด.3 และ ภ.ง.ด.1
                  return employee.costtype === "ภ.ง.ด.3" || employee.costtype === "ภ.ง.ด.1";
                } else if (isPhangD3Checked) {
                  // ถ้าเลือกเฉพาะ ภ.ง.ด.3
                  return employee.costtype === "ภ.ง.ด.3";
                } else if (isPhangD1Checked) {
                  // ถ้าเลือกเฉพาะ ภ.ง.ด.1
                  return employee.costtype === "ภ.ง.ด.1";
                }
                return true;
              });
            }
            
            console.log(`พบพนักงานที่ใช้ธนาคาร "${selectedBank}" จำนวน ${filteredByBank.length} คน จากทั้งหมด ${employeeResponse.data.employees.length} คน`);
            
            // เพิ่มกรณีที่มีการเลือกทั้งเดือน/ปี และธนาคาร
            if (year && month && selectedBank) {
              console.log(`กำลังกรองข้อมูลตามเดือน ${month}/${year} และธนาคาร ${selectedBank}`);
              
              // กรองข้อมูล timerecord ตามพนักงานที่มีธนาคารตรงกับที่เลือก
              const employeeIds = filteredByBank.map(emp => emp.employeeId);
              
              // กรองข้อมูล timerecord เฉพาะพนักงานที่มีธนาคารตรงกับที่เลือก
              // กรองข้อมูล timerecord เฉพาะพนักงานที่มีธนาคารตรงกับที่เลือก
const filteredByBankAndDate = filteredData.filter(record => {
  // ตรวจสอบว่า employeeId ของ record อยู่ในรายการ employeeIds หรือไม่
  return employeeIds.includes(record.employeeId);
});
  setFilteredByBankAndDate(filteredByBankAndDate);

  // เพิ่มฟังก์ชันนี้ใน useEffect หลังจากได้ filteredByBankAndDate
const fetchEmployeeDetails = async () => {
  try {
    // สร้าง array เพื่อเก็บข้อมูลพนักงานที่สมบูรณ์
    const completeEmployeeData = [];
    
    // วนลูปตามรายการพนักงานใน filteredByBankAndDate
    for (const record of filteredByBankAndDate) {
      // เรียก API เพื่อดึงข้อมูลละเอียดของพนักงานแต่ละคน
      const response = await axios.get(`${endpoint}/employee/${record.employeeId}`);
      
      if (response.data) {
        console.log(`ข้อมูลละเอียดของพนักงาน ${record.employeeId}:`, response.data);
        
        // เพิ่มข้อมูลลงใน array
        completeEmployeeData.push({
          ...record,
          employeeDetails: response.data
        });
      }
    }
    
    // อัปเดต state หรือใช้ข้อมูลนี้แทน filteredByBankAndDate
    setCompleteEmployeeData(completeEmployeeData);
    console.log("ข้อมูลพนักงานที่สมบูรณ์:", completeEmployeeData);
    setIsLoading(false);

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลละเอียดของพนักงาน:", error);
    setIsLoading(false);
  }
};

// เรียกใช้ฟังก์ชันหลังจากได้ filteredByBankAndDate
if (filteredByBankAndDate.length > 0) {
  fetchEmployeeDetails();
} else {
  setIsLoading(false);
}

// แสดงข้อมูล filteredByBankAndDate ในรูปแบบ Array
console.log("----------- ข้อมูล filteredByBankAndDate ในรูปแบบ Array -----------");
console.log(filteredByBankAndDate); // แสดงข้อมูลทั้ง array
console.log(`จำนวนข้อมูลทั้งหมด: ${filteredByBankAndDate.length} รายการ`);

// แสดงข้อมูลในรูปแบบตารางเพื่อให้อ่านง่ายขึ้น
console.table(filteredByBankAndDate.map(record => ({
  employeeId: record.employeeId,
  name: record.employeeName,
  month: record.month,
  year: record.year,
  sumCashWork: record.sumCashWork || 0
})));

              // สร้างข้อมูลรวมสำหรับแสดงผล - รวมข้อมูลพนักงานกับข้อมูล timerecord
              const combinedData = filteredByBankAndDate.map(record => {
                // หาข้อมูลพนักงานที่ตรงกับ record
                const matchingEmployee = filteredByBank.find(emp => emp.employeeId === record.employeeId);
                
                // ข้อมูลบัญชีที่ตรงกัน (ถ้ามี)
                const accounting = dataAccounting.find(acc => acc.employeeId === record.employeeId);
                
                // รวมข้อมูล
                return {
                  ...record,
                  employee: matchingEmployee || {},
                  accounting: accounting || {}
                };
              });
              
              console.log("----------- ข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข -----------");
              combinedData.forEach((item, index) => {
                console.log(`${index + 1}. ชื่อ: ${item.name || item.employee.name} (${item.employeeId})`);
                console.log(`   - ธนาคาร: ${item.employee.salarybank}`);
                console.log(`   - เดือน/ปี: ${item.month}/${item.year}`);
                console.log(`   - มีข้อมูลบัญชี: ${item.accounting ? 'มี' : 'ไม่มี'}`);
                console.log("----------------------------------------");
              });
              
              // แก้ไขการ log ในส่วนของข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข
console.log("----------- ข้อมูลพนักงานที่ผ่านทั้ง 3 เงื่อนไข -----------");
console.log("ข้อมูลทั้งหมด (Array):", combinedData); // Log array ทั้งหมดออกมา
console.log(`รวมพนักงานที่ผ่านทั้ง 3 เงื่อนไข: ${combinedData.length} คน`);

// เพิ่ม log แสดงรายละเอียดเฉพาะข้อมูลสำคัญของแต่ละพนักงาน
console.log("รายละเอียดพนักงานที่ผ่านทั้ง 3 เงื่อนไข:");
const simplifiedData = combinedData.map(item => ({
  employeeId: item.employeeId,
  name: item.name || item.employee.name,
  bank: item.employee.salarybank,
  month: item.month,
  year: item.year,
  sumCashWork: item.sumCashWork || 0
}));
console.table(simplifiedData); // แสดงในรูปแบบตาราง
            }
          }
        }
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล timerecord:", error);
    }
  };

  fetchTimeRecordData();
}, [year, month, selectedBank, dataAccounting, isPhangD3Checked, isPhangD1Checked]);
// แก้ไขฟังก์ชัน handleChange เพื่อกรองข้อมูลเมื่อมีการเลือกธนาคาร
// แก้ไขฟังก์ชัน handleChange เพื่อกรองข้อมูลตามธนาคารที่เลือก
const handleChange = async (event) => {
  const selectedValue = event.target.value.trim();
  setSelectedBank(selectedValue);
  setBankFullName(selectedValue);
  setIsLoading(true);

  // เพิ่ม log เพื่อตรวจสอบว่าผู้ใช้เลือกธนาคารไหน
  console.log("ผู้ใช้เลือกธนาคาร:", selectedValue);

  try {
    // ถ้าเลือก "เลือกธนาคาร" (Null) ให้แสดงข้อมูลทุกธนาคาร
    if (selectedValue === "Null") {
      console.log("แสดงข้อมูลทุกธนาคาร");
      
      // เรียกใช้ API เพื่อดึงข้อมูลพนักงานทั้งหมด
      const response = await axios.post(endpoint + "/employee/search", {});
      
      if (response.data && response.data.employees) {
        console.log("พบข้อมูลพนักงานทั้งหมด:", response.data.employees.length, "คน");
        
        // กรองเฉพาะพนักงานที่มีธนาคาร (มี salarybank)
        let filteredEmployees = response.data.employees.filter(employee => {
          const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
          return empSalaryBank !== "";
        });
        
        // เพิ่มเงื่อนไขการกรองตาม costtype
        if (isPhangD3Checked || isPhangD1Checked) {
          filteredEmployees = filteredEmployees.filter(employee => {
            if (isPhangD3Checked && isPhangD1Checked) {
              // ถ้าเลือกทั้งสอง ให้แสดงทั้ง ภ.ง.ด.3 และ ภ.ง.ด.1
              return employee.costtype === "ภ.ง.ด.3" || employee.costtype === "ภ.ง.ด.1";
            } else if (isPhangD3Checked) {
              // ถ้าเลือกเฉพาะ ภ.ง.ด.3
              return employee.costtype === "ภ.ง.ด.3";
            } else if (isPhangD1Checked) {
              // ถ้าเลือกเฉพาะ ภ.ง.ด.1
              return employee.costtype === "ภ.ง.ด.1";
            }
            return true;
          });
        }
        
        console.log("พนักงานที่มีข้อมูลธนาคาร:", filteredEmployees.length, "คน");
        
        // รวมข้อมูลพนักงานกับข้อมูลจาก timerecord API
        const mergedEmployeeData = filteredEmployees.map((employee) => {
          // หาข้อมูลบัญชีที่ตรงกัน - เพิ่มการตรวจสอบว่า dataAccounting เป็น array
          const accounting = Array.isArray(dataAccounting)
            ? dataAccounting.find((record) => record.employeeId === employee.employeeId)
            : null;
          
          // หาข้อมูลจาก timerecord โดยใช้ชื่อหรือ ID พนักงาน
          const timeRecord = timeRecordData.find(
            (record) => 
              record.employeeId === employee.employeeId || 
              record.name === employee.name || 
              (record.name && employee.name && 
              record.name.trim().toLowerCase() === employee.name.trim().toLowerCase())
          );
          
          // หากไม่พบข้อมูล timeRecord ให้ log แสดง
          if (!timeRecord) {
            console.log(`ไม่พบข้อมูล timeRecord สำหรับพนักงาน ${employee.name} (${employee.employeeId})`);
          }
          
          return { 
            ...employee, 
            accountingRecord: accounting ? accounting.accountingRecord : [],
            timeRecordData: timeRecord || null 
          };
        });

        // กรองเฉพาะพนักงานที่มีข้อมูล timeRecord
        const employeesWithTimeRecord = mergedEmployeeData.filter(employee => employee.timeRecordData !== null);
        console.log("พนักงานที่มีข้อมูล timeRecord:", employeesWithTimeRecord.length, "คน");
        
        setResponseDataAll(mergedEmployeeData);
        console.log("รวมข้อมูลพนักงานทุกธนาคาร เรียบร้อยแล้ว:", mergedEmployeeData.length, "คน");
      } else {
        setResponseDataAll([]);
        console.log("ไม่พบข้อมูลพนักงาน");
      }
    } else {
      // กรณีเลือกธนาคารเฉพาะ
      const searchData = {
        salarybank: selectedValue
      };

      console.log("กำลังค้นหาพนักงานที่มีธนาคาร:", selectedValue);
      
      // เรียกใช้ API employee/search เพื่อค้นหาพนักงานที่มีธนาคารตรงกับที่เลือก
      const response = await axios.post(endpoint + "/employee/search", searchData);
      
      if (response.data && response.data.employees) {
        // ตรวจสอบโครงสร้างข้อมูลที่ได้จาก API
        console.log("ตัวอย่างข้อมูลพนักงานแรก:", response.data.employees[0]);
        
        // กรองพนักงานที่มีธนาคารตรงกับที่เลือก - ปรับปรุงให้ตรวจสอบค่า undefined
        let filteredEmployees = response.data.employees.filter(employee => {
          // ตรวจสอบว่า salarybank มีค่าหรือไม่
          const empSalaryBank = employee.salarybank ? employee.salarybank.trim() : "";
          
          // เพิ่ม log เพื่อตรวจสอบค่า salarybank ของพนักงานแต่ละคน
          console.log(`พนักงาน ${employee.name} (${employee.employeeId}) มีค่า salarybank:`, 
            employee.salarybank === undefined ? "undefined" : empSalaryBank);
          console.log(`เปรียบเทียบกับ selectedBank (${selectedValue}):`, empSalaryBank === selectedValue);
          
          return empSalaryBank === selectedValue;
        });
        
        // เพิ่มเงื่อนไขการกรองตาม costtype
        if (isPhangD3Checked || isPhangD1Checked) {
          filteredEmployees = filteredEmployees.filter(employee => {
            if (isPhangD3Checked && isPhangD1Checked) {
              // ถ้าเลือกทั้งสอง ให้แสดงทั้ง ภ.ง.ด.3 และ ภ.ง.ด.1
              return employee.costtype === "ภ.ง.ด.3" || employee.costtype === "ภ.ง.ด.1";
            } else if (isPhangD3Checked) {
              // ถ้าเลือกเฉพาะ ภ.ง.ด.3
              return employee.costtype === "ภ.ง.ด.3";
            } else if (isPhangD1Checked) {
              // ถ้าเลือกเฉพาะ ภ.ง.ด.1
              return employee.costtype === "ภ.ง.ด.1";
            }
            return true;
          });
        }
        
        console.log("พบพนักงานที่มีธนาคาร", selectedValue, "จำนวน", filteredEmployees.length, "คน");
        
        // รวมข้อมูลพนักงานกับข้อมูลจาก timerecord API
        const mergedEmployeeData = filteredEmployees.map((employee) => {
          // หาข้อมูลบัญชีที่ตรงกัน
          const accounting = dataAccounting.find(
            (record) => record.employeeId === employee.employeeId
          );
          
          // หาข้อมูลจาก timerecord โดยใช้ชื่อหรือ ID พนักงาน
          const timeRecord = timeRecordData.find(
            (record) => 
              record.employeeId === employee.employeeId || 
              record.name === employee.name || 
              (record.name && employee.name && 
              record.name.trim().toLowerCase() === employee.name.trim().toLowerCase())
          );
          
          // หากไม่พบข้อมูล timeRecord ให้ log แสดง
          if (!timeRecord) {
            console.log(`ไม่พบข้อมูล timeRecord สำหรับพนักงาน: ${employee.name} (${employee.employeeId})`);
          }
          
          return { 
            ...employee, 
            accountingRecord: accounting ? accounting.accountingRecord : [],
            timeRecordData: timeRecord || null 
          };
        });

        // กรองเฉพาะพนักงานที่มีข้อมูล timeRecord
        const employeesWithTimeRecord = mergedEmployeeData.filter(employee => employee.timeRecordData !== null);
        console.log("พนักงานที่มีข้อมูล timeRecord:", employeesWithTimeRecord.length, "คน");
        
        setResponseDataAll(mergedEmployeeData);
        console.log("รวมข้อมูลพนักงานธนาคาร", selectedValue, "เรียบร้อยแล้ว:", mergedEmployeeData.length, "คน");
      } else {
        setResponseDataAll([]);
        console.log("ไม่พบพนักงานที่มีธนาคาร", selectedValue);
      }
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    setResponseDataAll([]);
  } finally {
    setIsLoading(false);
  }
};


  const startToggleDatePicker = () => {
    setStartShowDatePicker(!startShowDatePicker);
  };
  const enDToggleDatePicker = () => {
    setEndShowDatePicker(!endShowDatePicker);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };



  console.log('responseDataAll', responseDataAll);

  // Merge the two arrays
  const mergedData = responseDataAll
    .map((employee) => {
      // เพิ่มการตรวจสอบว่า dataAccounting เป็น array
      const accounting = Array.isArray(dataAccounting)
        ? dataAccounting.find((record) => record.employeeId === employee.employeeId)
        : null;
        
      if (accounting) {
        return { ...employee, accountingRecord: accounting.accountingRecord };
      }
      return employee; // คืนค่า employee แทนที่จะคืน null
    })
    .filter((item) => item !== null); // Remove null values

  console.log(mergedData);

  console.log('mergedData', mergedData);


  const exportToExcel = () => {
    // Define the headers
    const headers = ["ลำดับ", "เลขบัญชี", "รหัสพนักงาน", "ชื่อ-นามสกุล", "ยอดเงิน"];

    // Prepare the data
    const data = mergedData.map((item, index) => [
      index + 1, // ลำดับ
      item.banknumber, // เลขบัญชี
      item.employee, // รหัสพนักงาน
      `${item.name} ${item.lastName}`, // ชื่อ-นามสกุล
      item.total, // ยอดเงิน
    ]);

    // Combine headers and data
    const worksheetData = [headers, ...data];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Data");

    // Export to Excel file
    XLSX.writeFile(workbook, "SalaryData.xlsx");
  };


const handleDownloadPDF = async () => {
  try {
    // ตรวจสอบเงื่อนไขที่จำเป็นก่อนสร้าง PDF
    if (!month || !year) {
      alert("กรุณาเลือกเดือน และปีให้ครบถ้วน");
      return;
    }
    
    if (completeEmployeeData.length === 0) {
      alert("ไม่พบข้อมูลพนักงานที่ตรงตามเงื่อนไข");
      return;
    }
    
    // แสดงสถานะกำลังโหลด
    setIsLoading(true);

    console.log("กำลังสร้าง PDF...");
    const blob = await pdf(<BankReportPDF />).toBlob();
    console.log("สร้าง PDF Blob สำเร็จ");
    
    // สร้างลิงก์สำหรับดาวน์โหลด
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // กำหนดชื่อไฟล์ PDF
    const bankName = selectedBank === "Null" || !selectedBank ? "ทุกธนาคาร" : selectedBank.replace(/[\/\\:*?"<>|]/g, '_');
    const filename = `รายงานธนาคาร_${bankName}_${month}_${year}.pdf`;
    link.download = filename;
    
    // กระตุ้นการดาวน์โหลด
    document.body.appendChild(link);
    link.click();
    
    // ล้างลิงก์หลังจากดาวน์โหลด
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 100);
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF:", error);
    alert(`เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ${error.message}`);
    setIsLoading(false);
  }
};

const handlePreviewPDF = async () => {
  try {
    // ตรวจสอบเงื่อนไขที่จำเป็นก่อนสร้าง PDF
    if (!month || !year) {
      alert("กรุณาเลือกเดือน และปีให้ครบถ้วน");
      return;
    }
    
    if (completeEmployeeData.length === 0) {
      alert("ไม่พบข้อมูลพนักงานที่ตรงตามเงื่อนไข");
      return;
    }
    
    // แสดงสถานะกำลังโหลด
    setIsLoading(true);
    
    // สร้าง PDF blob จากฟังก์ชัน BankReportPDF
    console.log("กำลังสร้าง PDF...");
    const blob = await pdf(<BankReportPDF />).toBlob();
    console.log("สร้าง PDF Blob สำเร็จ");
    
    // สร้าง URL สำหรับการเปิดในแท็บใหม่
    const url = URL.createObjectURL(blob);
    
    // เปิด PDF ในแท็บใหม่
    window.open(url, '_blank');
    
    // ทำความสะอาด URL หลังจากเปิดแท็บใหม่
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 100);
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF:", error);
    alert(`เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ${error.message}`);
    setIsLoading(false);
  }
};

const handleMonthChange = (e) => {
  // แสดงสถานะกำลังโหลด
  setIsLoading(true);
  // เปลี่ยนค่าเดือน
  setMonth(e.target.value);
  // ล้างข้อมูลเดิม (ถ้าต้องการ)
  setCompleteEmployeeData([]);
};


const BankReportPDF = () => {
  console.log("ข้อมูลพนักงานที่สมบูรณ์:", completeEmployeeData.length);

  // ถ้าไม่มีข้อมูลหลังการกรอง แสดงหน้า PDF ว่างพร้อมข้อความแจ้ง
  if (completeEmployeeData.length === 0) {
    const bankDisplayName = selectedBank === "Null" || !selectedBank ? "ทุกธนาคาร" : selectedBank;
    return (
      <Document>
        <Page size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', fontFamily: 'THSarabunNew-Bold'}}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
            <Text style={{fontSize: 14 ,fontWeight: 'bold'}}>รายงานโอนเงินเข้าธนาคาร {bankDisplayName}</Text>
            <Text style={{fontSize: 12}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
            <Text style={{fontSize: 14, marginTop: 30, textAlign: 'center'}}>
              ไม่พบข้อมูลพนักงานที่มีธนาคาร {bankDisplayName} ในเดือน {month} ปี {year}
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  // ถ้าเลือก "เลือกธนาคาร" ให้จัดกลุ่มข้อมูลตามธนาคาร
  if (selectedBank === "Null" || !selectedBank) {
    // จัดกลุ่มข้อมูลตามธนาคาร
    const groupedByBank = {};
    
    completeEmployeeData.forEach(item => {
      const bankName = item.employeeDetails?.salarybank || 'ไม่ระบุธนาคาร';
      if (!groupedByBank[bankName]) {
        groupedByBank[bankName] = [];
      }
      groupedByBank[bankName].push(item);
    });

    // สร้าง PDF แยกตามธนาคาร
    return (
      <Document>
        {Object.entries(groupedByBank).map(([bankName, bankEmployees]) => {
          // คำนวณยอดรวมของธนาคารนี้
          const bankTotalAmount = bankEmployees.reduce((sum, item) => {
            const incomeTotal = 
              Number(item.sumCashWork || '0') + 
              Number(item.sumCashOt || '0') +
              Number(item.cashSpecialDay || '0') + 
              Number(item.publicHolidayCash || '0') + 
              Number(
                item.addSalaryList?.reduce(
                  (total, addItem) => total + Number(addItem.SpSalary || '0'),
                  0
                ) || '0'
              );

            const deductionTotal =
              Number(item.socialSecurity || '0') +
              Number(item.tax || '0') +
              Number(
                item.deductSalaryList?.reduce(
                  (total, deductItem) => total + Number(deductItem.amount || '0'),
                  0
                ) || '0'
              );

            const netTotal = Math.round((incomeTotal - deductionTotal) * 100) / 100;
            return Math.round((sum + (isNaN(netTotal) ? 0 : netTotal)) * 100) / 100;
          }, 0);

          // คำนวณจำนวนหน้าสำหรับธนาคารนี้
          const itemsPerPage = 35;
          const totalPages = Math.ceil(bankEmployees.length / itemsPerPage);
          const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

          return pages.map((pageNum) => {
            const startIndex = (pageNum - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, bankEmployees.length);
            const pageItems = bankEmployees.slice(startIndex, endIndex);
            const isLastPage = pageNum === totalPages;

            return (
              <Page key={`${bankName}-${pageNum}`} size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
                <View style={{marginBottom: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                  <View>
                    <Text style={{fontSize: 16,fontStyle:'italic', fontFamily: 'THSarabunNew' }}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
                    <Text style={{fontSize: 14,  fontWeight: 'bold', fontFamily: 'THSarabunNew' }}>รายงานโอนเงินเข้า {bankName}</Text>
                    <Text style={{fontSize: 10}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
                  </View>
                  <Text style={{fontSize: 10}}>หน้าที่ {pageNum}/{totalPages}</Text>
                </View>
                
                <View>
                  <View style={{flexDirection: 'row', fontWeight:'bold', borderBottomWidth: 1, borderTopWidth: 1.5, fontSize: 12, padding: 5}}>
                    <Text style={{width: '10%'}}>ลำดับ</Text>
                    <Text style={{width: '18%'}}>เลขที่บัญชี</Text>
                    <Text style={{width: '20%'}}>รหัสพนักงาน</Text>
                    <Text style={{width: '45%'}}>ชื่อ-นามสกุล</Text>
                    <Text style={{width: '7%', textAlign: 'right'}}>ยอดเงิน</Text>
                  </View>
                  
                  {pageItems.map((item, index) => {
                    const employeeDetails = item.employeeDetails;
                    const employeeName = employeeDetails?.name || 'N/A';
                    const employeeLastName = employeeDetails?.lastName || 'N/A';
                    
                    const bankAccount = 
                      employeeDetails?.banknumber || 
                      employeeDetails?.bankaccount || 
                      employeeDetails?.bankNumber || 
                      employeeDetails?.bankAccount || 
                      (employeeDetails?.branchBank && 
                        employeeDetails.branchBank.match(/\d{3}-\d{1}-\d{5}-\d{1}/)?.[0]) || 
                      'N/A';
                    
                    const actualIndex = startIndex + index;
                    
                    return (
                      <View key={index} style={{flexDirection: 'row', fontSize: 12, borderBottomColor: '#000', padding: 1}}>
                        <Text style={{width: '10%', paddingLeft: '10px'}}>{actualIndex + 1}</Text>
                        <Text style={{width: '18%', paddingLeft: '3px'}}>{bankAccount}</Text>
                        <Text style={{width: '20%', paddingLeft: '3px'}}>{item.employeeId || 'N/A'}</Text>
                        <Text style={{width: '45%'}}>
                          {employeeName} {employeeLastName} 
                        </Text>
                        <Text style={{width: '7%', textAlign: 'right', paddingRight: '5px'}}>
                          {item.employeeDetails ? 
                            (() => {
                              const incomeTotal = 
                                Number(item.sumCashWork || '0') + 
                                Number(item.sumCashOt || '0') +
                                Number(item.cashSpecialDay || '0') + 
                                Number(item.publicHolidayCash || '0') +
                                Number(
                                  item.addSalaryList?.reduce(
                                    (total, addItem) => total + Number(addItem.SpSalary || '0'),
                                    0
                                  ) || '0'
                                );

                              const deductionTotal =
                                Number(item.socialSecurity || '0') +
                                Number(item.tax || '0') +
                                Number(
                                  item.deductSalaryList?.reduce(
                                    (total, deductItem) => total + Number(deductItem.amount || '0'),
                                    0
                                  ) || '0'
                                );

                              const netTotal = Math.round((incomeTotal - deductionTotal) * 100) / 100;

                              return isNaN(netTotal)
                                ? '0.00'
                                : netTotal.toLocaleString('th-TH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  });
                            })() 
                            : (item.sumCashWork 
                                ? Number(item.sumCashWork).toLocaleString('th-TH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })
                                : '0.00')}
                        </Text>
                      </View>
                    );
                  })}
                  
                  {/* แสดงยอดรวมเฉพาะหน้าสุดท้ายของแต่ละธนาคาร */}
                  {isLastPage && (
                    <View style={{flexDirection: 'row', fontSize: 12, borderTopWidth: 1, borderTopColor: '#000', padding: 1, marginTop: 5}}>
                      <Text style={{width: '10%'}}></Text>
                      <Text style={{width: '13%', fontWeight: 'bold'}}>รวมพนักงาน</Text>
                      <Text style={{width: '20%', fontWeight: 'bold'}}>{bankEmployees.length} คน</Text>
                      <Text style={{width: '50%', fontWeight: 'bold'}}></Text>
                      <Text style={{width: '7%', fontWeight: 'bold', textAlign: 'right', paddingRight: '5px'}}>
                        {bankTotalAmount.toLocaleString('th-TH', {
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2
                        })}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={{position: 'absolute',borderTop:'1', bottom: 30, left: 30, right: 30}}>
                  <Text style={{fontSize: 10 }}>พิมพ์วันที่ {formattedDate321}                                   รายงานโดย {present}                         แฟ้มรายงาน {presentfilm}</Text>
                </View>
              </Page>
            );
          });
        })}
      </Document>
    );
  }

  // กรณีเลือกธนาคารเฉพาะ (โค้ดเดิม)
  const totalCashAmount = completeEmployeeData.reduce((sum, item) => {
    const incomeTotal = 
      Number(item.sumCashWork || '0') + 
      Number(item.sumCashOt || '0') +
      Number(item.cashSpecialDay || '0') + 
      Number(item.publicHolidayCash || '0') + 
      Number(
        item.addSalaryList?.reduce(
          (total, addItem) => total + Number(addItem.SpSalary || '0'),
          0
        ) || '0'
      );

    const deductionTotal =
      Number(item.socialSecurity || '0') +
      Number(item.tax || '0') +
      Number(
        item.deductSalaryList?.reduce(
          (total, deductItem) => total + Number(deductItem.amount || '0'),
          0
        ) || '0'
      );

    const netTotal = Math.round((incomeTotal - deductionTotal) * 100) / 100;
    return Math.round((sum + (isNaN(netTotal) ? 0 : netTotal)) * 100) / 100;
  }, 0);

  const itemsPerPage = 35;
  const totalPages = Math.ceil(completeEmployeeData.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Document>
      {pages.map((pageNum) => {
        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, completeEmployeeData.length);
        const pageItems = completeEmployeeData.slice(startIndex, endIndex);
        const isLastPage = pageNum === totalPages;
        const bankDisplayName = selectedBank === "Null" || !selectedBank ? "ทุกธนาคาร" : selectedBank;
        
        return (
          <Page key={pageNum} size="A4" style={{padding: 30, fontFamily: 'THSarabunNew'}}>
            <View style={{marginBottom: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <View>
                <Text style={{fontSize: 16,fontStyle:'italic', fontFamily: 'THSarabunNew' }}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด</Text>
                <Text style={{fontSize: 14,  fontWeight: 'bold', fontFamily: 'THSarabunNew' }}>รายงานโอนเงินเข้า {bankDisplayName}</Text>
                <Text style={{fontSize: 10}}>สำหรับงวดวันที่ {startFormattedDate321} ถึง {endFormattedDate321}</Text>
              </View>
              <Text style={{fontSize: 10}}>หน้าที่ {pageNum}/{totalPages}</Text>
            </View>
            
            <View>
              <View style={{flexDirection: 'row', fontWeight:'bold', borderBottomWidth: 1, borderTopWidth: 1.5, fontSize: 12, padding: 5}}>
                <Text style={{width: '10%'}}>ลำดับ</Text>
                <Text style={{width: '18%'}}>เลขที่บัญชี</Text>
                <Text style={{width: '20%'}}>รหัสพนักงาน</Text>
                <Text style={{width: '45%'}}>ชื่อ-นามสกุล</Text>
                <Text style={{width: '7%', textAlign: 'right'}}>ยอดเงิน</Text>
              </View>
              
              {pageItems.map((item, index) => {
                const employeeDetails = item.employeeDetails;
                const employeeprefix = employeeDetails?.prefix || 'N/A';
                const employeeName = employeeDetails?.name || 'N/A';
                const employeeLastName = employeeDetails?.lastName || 'N/A';
                
                const bankAccount = 
                  employeeDetails?.banknumber || 
                  employeeDetails?.bankaccount || 
                  employeeDetails?.bankNumber || 
                  employeeDetails?.bankAccount || 
                  (employeeDetails?.branchBank && 
                    employeeDetails.branchBank.match(/\d{3}-\d{1}-\d{5}-\d{1}/)?.[0]) || 
                  'N/A';
                
                const actualIndex = startIndex + index;
                
                return (
                  <View key={index} style={{flexDirection: 'row', fontSize: 12, borderBottomColor: '#000', padding: 1}}>
                    <Text style={{width: '10%', paddingLeft: '10px'}}>{actualIndex + 1}</Text>
                    <Text style={{width: '18%', paddingLeft: '3px'}}>{bankAccount}</Text>
                    <Text style={{width: '20%', paddingLeft: '3px'}}>{item.employeeId || 'N/A'}</Text>
                    <Text style={{width: '45%'}}>
                      {employeeName} {employeeLastName} 
                    </Text>
                   <Text style={{width: '7%', textAlign: 'right', paddingRight: '5px'}}>
  {item.employeeDetails ? 
    (() => {
      const incomeTotal = 
        Number(item.sumCashWork || '0') + 
        Number(item.sumCashOt || '0') +
        Number(item.cashSpecialDay || '0') + 
        Number(item.publicHolidayCash || '0') +
        Number(
          item.addSalaryList?.reduce(
            (total, addItem) => total + Number(addItem.SpSalary || '0'),
            0
          ) || '0'
        );

      const deductionTotal =
        Number(item.socialSecurity || '0') +
        Number(item.tax || '0') +
        Number(
          item.deductSalaryList?.reduce(
            (total, deductItem) => total + Number(deductItem.amount || '0'),
            0
          ) || '0'
        );

      const netTotal = Math.round((incomeTotal - deductionTotal) * 100) / 100;

      return isNaN(netTotal)
        ? '0.00'
        : netTotal.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
    })() 
    : (item.sumCashWork 
        ? Number(item.sumCashWork).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : '0.00')}
</Text>
                    
                  </View>
                );
              })}
              
              {/* แสดงยอดรวมเฉพาะหน้าสุดท้าย */}
              {isLastPage && (
                <View style={{flexDirection: 'row', fontSize: 12, borderTopWidth: 1, borderTopColor: '#000', padding: 1, marginTop: 5}}>
                  <Text style={{width: '10%'}}></Text>
                  <Text style={{width: '13%', fontWeight: 'bold'}}>รวมพนักงาน</Text>
                  <Text style={{width: '20%', fontWeight: 'bold'}}>{completeEmployeeData.length} คน</Text>
                  <Text style={{width: '50%', fontWeight: 'bold'}}></Text>
                  <Text style={{width: '7%', fontWeight: 'bold', textAlign: 'right', paddingRight: '5px'}}>
                    {totalCashAmount.toLocaleString('th-TH', {
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2
                    })}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{position: 'absolute',borderTop:'1', bottom: 30, left: 30, right: 30}}>
              <Text style={{fontSize: 10 }}>พิมพ์วันที่ {formattedDate321}                                   รายงานโดย {present}                         แฟ้มรายงาน {presentfilm}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

  return (
  <div className="hold-transition sidebar-mini editlaout">
    <div className="wrapper">
      <div className="content-wrapper">
        {/* <!-- Content Header (Page header) --> */}
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <i className="fas fa-home"></i> <span>หน้าหลัก</span>
          </li>
          <li className="breadcrumb-item">
            <span> ระบบเงินเดือน</span>
          </li>
          <li className="breadcrumb-item active">ออกรายงานธนาคาร</li>
        </ol>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <h1 className="m-0">
                <i className="far fa-arrow-alt-circle-right"></i> ออกรายงานธนาคาร
              </h1>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <h2 className="title">ออกรายงานธนาคาร</h2>
            <section className="Frame">
              <div className="form-group">
                {/* Conditionally render content based on the selected option */}
                <div>
                  <div className="row">
                    <div className="col-md-3">
                      <label role="searchEmployeeId">ธนาคาร</label>
                       <select
                      className="form-control"
                      value={selectedBank}
                      onChange={handleChange}
                    >
                    <option value="Null">
                                      เลือกธนาคาร
                                    </option>   
                    <option value="ธนาคารกรุงเทพ (มหาชน)">
                                      ธนาคาร กรุงเทพ (มหาชน)
                                    </option>
                                    <option value="ธนาคารกสิกรไทย (มหาชน)">
                                      ธนาคาร กสิกรไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารกรุงไทย (มหาชน)">
                                      ธนาคาร กรุงไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารทหารไทยธนชาต (มหาชน)">
                                      ธนาคาร ทหารไทยธนชาต (มหาชน)
                                    </option>
                                    <option value="ธนาคารไทยพาณิชย์ (มหาชน)">
                                      ธนาคาร ไทยพาณิชย์ (มหาชน)
                                    </option>
                                    <option value="ธนาคารกรุงศรีอยุธยา (มหาชน)">
                                      ธนาคาร กรุงศรีอยุธยา (มหาชน)
                                    </option>
                                    <option value="ธนาคารเกียรตินาคินภัทร (มหาชน)">
                                      ธนาคาร เกียรตินาคินภัทร (มหาชน)
                                    </option>
                                    <option value="ธนาคารซีไอเอ็มบีไทย (มหาชน)">
                                      ธนาคาร ซีไอเอ็มบีไทย (มหาชน)
                                    </option>
                                    <option value="ธนาคารทิสโก้ (มหาชน)">
                                      ธนาคาร ทิสโก้ (มหาชน)
                                    </option>
                                    <option value="ธนาคารยูโอบี (มหาชน)">
                                      ธนาคาร ยูโอบี (มหาชน)
                                    </option>
                                    <option value="ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)">
                                      ธนาคารไทยเครดิตเพื่อรายย่อย (มหาชน)
                                    </option>
                                    <option value="ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)">
                                      ธนาคารแลนด์แอนด์เฮ้าส์ (มหาชน)
                                    </option>
                                    <option value="ธนาคารไอซีบีซี (ไทย)">
                                      ธนาคาร ไอซีบีซี (ไทย)
                                    </option>
                                    <option value="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย">
                                      ธนาคาร พัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">
                                      ธนาคาร เพื่อการเกษตรและสหกรณ์การเกษตร
                                    </option>
                                    <option value="ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย">
                                      ธนาคาร เพื่อการส่งออกและนำเข้าแห่งประเทศไทย
                                    </option>
                                    <option value="ธนาคารออมสิน">
                                      ธนาคาร ออมสิน
                                    </option>
                                    <option value="ธนาคารอาคารสงเคราะห์">
                                      ธนาคาร อาคารสงเคราะห์
                                    </option>
                    </select>
                    </div>
                    
                    <div className="col-md-4">
                      <label>ประเภทภาษี</label>
                      <div className="form-group">
                        <style jsx>{`
                          .custom-checkbox {
                            position: relative;
                            display: inline-flex;
                            align-items: center;
                            margin-right: 20px;
                            margin-bottom: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            user-select: none;
                          }
                          
                          .custom-checkbox input {
                            position: absolute;
                            opacity: 0;
                            cursor: pointer;
                            height: 0;
                            width: 0;
                          }
                          
                          .custom-checkbox .checkmark {
                            position: relative;
                            height: 20px;
                            width: 20px;
                            background-color: #fff;
                            border: 2px solid gray;
                            border-radius: 4px;
                            margin-right: 8px;
                            transition: all 0.3s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          }
                          
                          .custom-checkbox:hover .checkmark {
                            background-color: #f8f9fa;
                            box-shadow: 0 2px 4px rgba(0,123,255,0.2);
                          }
                          
                          .custom-checkbox input:checked ~ .checkmark {
                            background-color: #007bff;
                            border-color: #007bff;
                          }
                          
                          .custom-checkbox .checkmark:after {
                            content: "";
                            position: absolute;
                            display: none;
                            left: 6px;
                            top: 2px;
                            width: 6px;
                            height: 10px;
                            border: solid white;
                            border-width: 0 2px 2px 0;
                            transform: rotate(45deg);
                          }
                          
                          .custom-checkbox input:checked ~ .checkmark:after {
                            display: block;
                          }
                          
                          .custom-checkbox:active .checkmark {
                            transform: scale(0.95);
                          }
                          
                          .checkbox-label {
                            font-weight: 500;
                            color: #495057;
                            transition: color 0.3s ease;
                          }
                          
                          .custom-checkbox:hover .checkbox-label {
                            color: #007bff;
                          }
                        `}</style>
                        
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="phangD3"
                            checked={isPhangD3Checked}
                            onChange={handlePhangD3Change}
                          />
                          <span className="checkmark"></span>
                          <span className="checkbox-label">ภ.ง.ด.3</span>
                        </label>
                        
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            id="phangD1"
                            checked={isPhangD1Checked}
                            onChange={handlePhangD1Change}
                          />
                          <span className="checkmark"></span>
                          <span className="checkbox-label">ภ.ง.ด.1</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3">
                    <label role="agencyname">เดือน</label>
                    <select
                      className="form-control"
                      value={month}
                      onChange={handleMonthChange}
                      disabled={isLoading}
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

                  <div className="col-md-3">
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
              <br />
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label role="datetime">งวด</label>
                  <div
                    onClick={startToggleDatePicker}
                    style={{
                      position: "relative",
                      zIndex: 9999,
                      marginLeft: "0rem",
                    }}
                  >
                    <FaCalendarAlt size={20} />
                    <span style={{ marginLeft: "8px" }}>
                      {startFormattedDate321 ? startFormattedDate321 : "Select Date"}
                    </span>
                  </div>

                  {startShowDatePicker && (
                    <div style={{ position: "absolute", zIndex: 1000 }}>
                      <ThaiDatePicker
                        className="form-control"
                        value={startSelectedDate}
                        onChange={handleDatePickerStartChange}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-1">ถึง</div>
                <div className="col-md-3">
                  <label role="datetime"></label>
                  <div
                    onClick={enDToggleDatePicker}
                    style={{
                      position: "relative",
                      zIndex: 9999,
                      marginLeft: "0rem",
                    }}
                  >
                    <FaCalendarAlt size={20} />
                    <span style={{ marginLeft: "8px" }}>
                      {endFormattedDate321 ? endFormattedDate321 : "Select Date"}
                    </span>
                  </div>

                  {endShowDatePicker && (
                    <div style={{ position: "absolute", zIndex: 1000 }}>
                      <ThaiDatePicker
                        className="form-control"
                        value={endSelectedDate}
                        onChange={handleDatePickerEndChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                  <label role="datetime">พิมพ์วันที่</label>
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
                <div className="col-md-3">
                  <label role="datetime">ลงชื่อ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchWorkplaceId"
                    placeholder="รายงานโดย"
                    value={present}
                    onChange={(e) => setPresent(e.target.value)}
                  />
                </div>
                

                <div className="col-md-3">
                  <label role="datetime">รหัส</label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchWorkplaceId"
                    placeholder="แฟ้มรายงาน"
                    value={presentfilm}
                    onChange={(e) => setPresentfilm(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                   <button 
        onClick={handlePreviewPDF}
        className="btn b_save "
        disabled={isLoading}
      >
        {isLoading ? "กำลังสร้างไฟล์..." : "ออกรายงานธนาคาร"}
      </button>
                </div>
                <div className="col-md-3">
                  <button className="btn b_save">
                    ออกรายงานธนาคาร(ออดิท)
                  </button>


                </div>
                
              </div>
              <br />
              
              
              {/* เพิ่มส่วนแสดงตัวอย่าง PDF */}
              {showPdfPreview && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">ตัวอย่างรายงาน PDF</h3>
                      </div>
                      <div className="card-body">
                        <div style={{ height: '600px', border: '1px solid #dee2e6', borderRadius: '0.25rem' }}>
                          <PDFViewer width="100%" height="100%">
                            <BankReportPDF />
                          </PDFViewer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  </div>
);
}

export default BankReport;
