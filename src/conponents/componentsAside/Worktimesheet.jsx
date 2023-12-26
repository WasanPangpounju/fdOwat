import endpoint from '../../config';
// import React, { useRef } from 'react';

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import '../editwindowcss.css';
// import TestPDF from './TestPDF';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import { useTable } from 'react-table';


function Worktimesheet() {
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
    document.title = 'ใบลงเวลาการปฏิบัติงาน';
    // You can also return a cleanup function if needed
    // return () => { /* cleanup code */ };
  }, []);

  const styles = {
    th: {
      minWidth: "4rem"
    }
  };
  const [dataset, setDataset] = useState([]);

  const [workplaceList, setWorkplaceList] = useState([]);
  const [result_data, setResult_data] = useState([]);


  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + '/workplace/list')
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched data
        setWorkplaceList(data);
        // alert(data[0].workplaceName);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  console.log(workplaceList);

  const [employeelist, setEmployeelist] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [listDayOff, setListDayOff] = useState([]);
  const [y, setY] = useState('');
  const [m, setM] = useState('');
  const [m1, setM1] = useState('');


  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + '/employee/list')
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched data
        setEmployeelist(data);
        // alert(data[0].workplaceName);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // The empty array [] ensures that the effect runs only once after the initial render

  console.log('employeelist', employeelist);

  //data for show in table
  const [listTableDayoff, setListTableDayoff] = useState([]);
  //data for check list dayoff
  const [data_listDayoff, setData_listDayoff] = useState([]);
const [spDayoff , setSpDayoff] = useState(null);
const [lastName , setLastName] = useState('');


  useEffect(() => {
    setListDayOff({});
    const emp_workplace = employeelist.find(item => item.employeeId === result_data[0].employeeId);
    console.log('emp_workplace', emp_workplace);

    if (emp_workplace) {
      const wid = emp_workplace.workplace;
      const empWorkplace = workplaceList.find(item => item.workplaceId === wid);
      // alert(JSON.stringify(empWorkplace ,null,2));

      setLastName(emp_workplace.lastName);
      console.log('empWorkplace', empWorkplace);
      console.log('wid', wid);

      //get special dayoff
      setSpDayoff(empWorkplace.daysOff);
      // alert(new Date(empWorkplace.daysOff[0]).getDate() );

      const df = [];
      if (empWorkplace.workday7 !== "true") {
        df.push('1');
      }
      if (empWorkplace.workday6 !== "true") {
        df.push('7');
      }
      if (empWorkplace.workday5 !== "true") {
        df.push('6');
      }
      if (empWorkplace.workday4 !== "true") {
        df.push('5');
      }
      if (empWorkplace.workday3 !== "true") {
        df.push('4');
      }
      if (empWorkplace.workday2 !== "true") {
        df.push('3');
      }
      if (empWorkplace.workday1 !== "true") {
        df.push('2');
      }

      setListDayOff(df);

      //get totalday of month
      let m = parseInt(result_data[0].month, 10); // Convert month to integer and subtract 1
      // alert(result_data[0].month );
      let totalDay = new Date(result_data[0].timerecordId, m, 0).getDate()
      // alert(JSON.stringify(result_data , null,2));
      // alert(totalDay );
      let dateString = result_data[0].timerecordId + '/' + m + '/21';
      let dateObj = new Date(dateString);
      // alert(dateObj);
      let numstartDay = getDateDayOfWeek(dateObj);
      numstartDay = parseInt(numstartDay, 10);
      console.log('numstartDay', numstartDay);
      let dayoffTable = [];
      let dayoffCheck = [];
      // alert(numstartDay );

      for (let i = 21; i <= totalDay; i++) {
        if (numstartDay > 7) {
          numstartDay = 1;
        }

        if (df.includes(numstartDay.toString())) {
          // alert(i);
          dayoffTable.push({ [i]: "หยุด" });
          dayoffCheck.push(i);

        } else {
          dayoffTable.push({ [i]: " " });
        }

        //next day
        numstartDay = numstartDay + 1;
      } //end for

      //any month < 31 day , add to 31 day for show in table
      if (totalDay < 31) {
        for (let j = totalDay + 1; j <= 31; j++) {
          dayoffTable.push({ [j]: " " });
        }
      }
      // alert(dayoffTable.length);
      //next month 1 - 20 
      // m = m +1;
      m = parseInt(result_data[0].month, 10); // Convert month to integer and subtract 1

      // alert(m);
      let s = result_data[0].timerecordId + '/' + (m + 1) + '/1';
      let sObj = new Date(s);
      // alert(sObj);
      let numstartDay1 = getDateDayOfWeek(sObj);
      numstartDay1 = parseInt(numstartDay1, 10);
      // alert('x' + numstartDay1 );
      for (let l = 1; l <= 20; l++) {
        if (numstartDay1 > 7) {
          numstartDay1 = 1;
        }
        // alert("วันที่ " + l + "ตัวเลข" + numstartDay1  );  
        if (df.includes(numstartDay1.toString())) {
          // alert(i);
          dayoffTable.push({ [l]: "หยุด" });
          // alert(l + "หยุด")
          dayoffCheck.push(l);
          //next day
          numstartDay1 = numstartDay1 + 1;

        } else {
          dayoffTable.push({ [l]: " " });
          //next day
          numstartDay1 = numstartDay1 + 1;

        }

      } //end for
      // alert(dayoffTable.length);


      setData_listDayoff(dayoffCheck);
      setListTableDayoff(dayoffTable);

      // alert(df);
      // alert(dayoffCheck);

    }
    // const wid = emp_workplace.workplace;
    // const empWorkplace = workplaceList.find(item => item.workplaceId === wid);


  }, [result_data]);


  
  //count day work and dayoff and special dayoff
  const [dw , setDw] = useState(0); //รวมวันทำงาน
  const [doff , setDoff] = useState(0); //รวมทำวันหยุดในสัปดาห์
  const [dspe , setDspe] = useState(0); //รวมทำงานวันหยุดพิเศษ
const [ listDf , setListDf] = useState([]);
const [listSp , setListSp] = useState([]);



  //dayoff management
  useEffect(() => {
    // alert(JSON.stringify(listSp ,null,2));


    const calDayoff = async () => {
      //loop days of work.
const tempDW = [];

await result_data[0].employee_workplaceRecord.map(item => {
  // alert(item.date);
  tempDW.push(item.date);
  setDw(tempDW);
  });

// await alert(tempDW );
await setDw(tempDW);


      let temp = [];
      
      //get special dayoff to list
      await spDayoff.map(async item => {

        //check month and push special dayoff of month
  const parsedNumber = await parseInt(month, 10) ;
  
  // alert(parsedNumber + ' * ');
  // alert(new Date(item).getMonth() + ' ' + new Date(item).getDate() );
  
  if(parsedNumber  === new Date(item).getMonth() ) {
  await temp.push(new Date(item).getDate() );
  await setListSp(temp);
  } else {
  await setListSp([]);
  }
       } );
  
  // await alert(JSON.stringify(listSp ,null,2));
  //check special dayoff.
  
                    //filtered dayoff with special dayoff
      const filteredDayoff = await data_listDayoff.filter((element) => !temp.includes(element));
      await setListDf(filteredDayoff );
      // await alert(JSON.stringify(listDf, null,2) );
    };
  

if(result_data.length  > 0 ){

  if(spDayoff !== null ){
    
  calDayoff();

  }


}

  
  } , [spDayoff] );

  console.log('data_listDayoff', data_listDayoff);
  console.log('listTableDayoff', listTableDayoff);
  console.log('df', listDayOff);


  // Generate an array containing numbers from 21 to 31
  const range1 = Array.from({ length: 11 }, (_, i) => i + 21);

  // Generate an array containing numbers from 1 to 20
  const range2 = Array.from({ length: 20 }, (_, i) => i + 1);

  // Combine the two ranges into a single array
  const combinedRange = [...range1, ...range2];


  const [countWork, setCountWork] = useState(0);
  const [countWorkSTime, setCountWorkSTime] = useState(0);


  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [checked7, setChecked7] = useState(false);
  const [checked8, setChecked8] = useState(false);
  const [checked9, setChecked9] = useState(false);
  const [checked10, setChecked10] = useState(false);
  const [checked11, setChecked11] = useState(false);
  const [checked12, setChecked12] = useState(false);
  const [checked13, setChecked113] = useState(false);
  const [checked14, setChecked14] = useState(false);
  const [checked15, setChecked15] = useState(false);
  const [checked16, setChecked16] = useState(false);
  const [checked17, setChecked17] = useState(false);
  const [checked18, setChecked18] = useState(false);
  // const [checked1, setChecked1] = useState(false);
  // const [checked2, setChecked2] = useState(false);
  // const [checked3, setChecked3] = useState(false);
  // const [checked1, setChecked1] = useState(false);
  // const [checked2, setChecked2] = useState(false);
  // const [checked3, setChecked3] = useState(false);
  // const [checked1, setChecked1] = useState(false);
  // const [checked2, setChecked2] = useState(false);
  // const [checked3, setChecked3] = useState(false);

  const [checked28, setChecked28] = useState(false);
  const [checked31, setChecked31] = useState(false);


  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [workplaceIdList, setWorkplaceIdList] = useState([]);

  const [month, setMonth] = useState('');

  useEffect(() => {
    setMonth("01");
  }, []);

  const [searchWorkplaceId, setSearchWorkplaceId] = useState(''); //รหัสหน่วยงาน
  const [searchWorkplaceName, setSearchWorkplaceName] = useState(''); //ชื่อหน่วยงาน
  const [searchEmployeeId, setSearchEmployeeId] = useState('');
  const [searchEmployeeName, setSearchEmployeeName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [empId, setEmpId] = useState([]);

  const [searchResult1, setSearchResult1] = useState([]);

  const [woekplace, setWoekplace] = useState([]);

  const [calendarData1, setCalendarData1] = useState([]);
  const [calendarData2, setCalendarData2] = useState([]);
  const yeartest = 2023;
  const monthtest = 3; // 3 represents March using 1-based indexing
  async function handleSearch(event) {
    event.preventDefault();

    //clean value 
    setSpDayoff([]);

    setTableData (
      combinedRange.map((index) => ({
        isChecked: false, // Initial state of the checkbox
        textValue: '',    // Initial state of the text value
        workplaceId: index, // Store the workplaceId
        date: '', // Store the workplaceId
      }))
    );
  
    // get value from form search
    if (searchEmployeeId === '' && searchEmployeeName === '') {
      // Both employeeId and employeeName are null
      alert("กรุณากรอกรหัสหรือชื่อพนักงาน");
      // You can use window.location.reload() to reload the web page
      window.location.reload();
    } else {
      // At least one of them is not null
      console.log(searchEmployeeId);
    }
    const data = await {
      employeeId: searchEmployeeId,
      employeeName: searchEmployeeName,
      month: month
    };
     console.log(searchEmployeeId);

    const parsedNumber = await parseInt(month, 10) - 1;
    const formattedResult = await String(parsedNumber).padStart(2, '0');
    // await alert(formattedResult );

    const data1 = await {
      employeeId: searchEmployeeId,
      employeeName: searchEmployeeName,
      month: formattedResult
    };

    console.log('data1', data1.month);
    console.log('data2', data.month);


    // date day

    // Calculate the formatted month based on data1.month
    const parsedNumber1 = parseInt(data1.month, 10) - 1;
    const formattedResult1 = String(parsedNumber1).padStart(2, '0');

    // Calculate the formatted month based on data.month
    const parsedNumber2 = parseInt(data.month, 10) - 1;
    const formattedResult2 = String(parsedNumber2).padStart(2, '0');


    // Create a Date object for the first day of data1.month
    const firstDayOfMonth1 = new Date(yeartest, parsedNumber1, 1);

    // Create a Date object for the first day of data.month
    const firstDayOfMonth2 = new Date(yeartest, parsedNumber2, 1);

    console.log('formattedResult1', firstDayOfMonth1);
    console.log('formattedResult2', firstDayOfMonth2);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
      console.log('dates1', dates1);
      console.log('dates2', dates2);

    }

    // Set the calendar data in the state
    // setCalendarData1(dates1); 
    // setCalendarData2(dates2);
    // console.log('calendarData1', calendarData1);
    // console.log('calendarData2', calendarData2);
    const filteredDates1 = dates1.map((dayData) => ({
      ...dayData,
      dates: dayData.dates.filter((date) => date >= 21 && date <= 31), // Adjusted filtering condition
    })).filter((dayData) => dayData.dates.length > 0);


    const filteredDates2 = dates2.map((dayData) => ({
      ...dayData,
      dates: dayData.dates.filter((date) => date < 20), // Adjusted filtering condition
    })).filter((dayData) => dayData.dates.length > 0);

    //dddd
    console.log('calendarData1 filteredDates1:', filteredDates1);
    console.log('calendarData2 filteredDates2:', filteredDates2);
    setCalendarData1(filteredDates1); // Assuming you have a separate state for data1.month
    setCalendarData2(filteredDates2);

    //check reload page
    let check = 0;
    try {

      const response = await axios.post(endpoint + '/timerecord/searchemp', data);

      if (response.data.recordworkplace.length >= 1) {
        await setSearchResult(response.data.recordworkplace);
        await setResult_data(response.data.recordworkplace);
      } else {
        alert("ไม่พบข้อมูล 1 ถึง 20 " + getMonthName(data.month));
        check = check + 1;
        // window.location.reload();
      }



      const employeeWorkplaceRecords = await response.data.recordworkplace[0].employee_workplaceRecord || '';


      if (employeeWorkplaceRecords.length > 0) {
        const dates = employeeWorkplaceRecords.map(record => record.date);

        const allTimeA = employeeWorkplaceRecords.map((record) => record.allTime);

        const workplaceId = employeeWorkplaceRecords.map(record => record.workplaceId);

        const otTime = employeeWorkplaceRecords.map((record) => record.otTime);

        setTableData((prevState) => {
          const updatedData = [...prevState];
          dates.forEach((date, index) => {
            const dataIndex = parseInt(date, 10) - 1; // Subtract 1 because indices are zero-based
            if (dataIndex >= 0 && dataIndex < updatedData.length) {
              if (dataIndex <= 20) {
                // alert((dataIndex + 11));

                updatedData[(dataIndex + 11)].isChecked = true;
                updatedData[(dataIndex + 11)].otTime = otTime[index];
                updatedData[(dataIndex + 11)].allTime = allTimeA[index];
                updatedData[(dataIndex + 11)].workplaceId = workplaceId[index]; // Set otTime at the same index as dates
                updatedData[(dataIndex + 11)].date = dates[index]; // Set otTime at the same index as dates


                // Set otTime at the same index as dates
              }

            }
          });
          const filteredData = updatedData.filter((record) => record.isChecked == true);

          const workplaceIds = [...new Set(filteredData.map((record) => record.workplaceId))];

          setDataset(filteredData);
          return updatedData;
        });


        console.log('tableData', tableData);
        console.log('updatedData', dataset);

      }
      // console.log('Result:');
      // console.log(result);
      /////////

      // alert(response.data.recordworkplace.length);
      if (response.data.recordworkplace.length < 1) {
        window.location.reload();
        alert('ไม่พบข้อมูล');
        window.location.reload();
      } else {

        // Set search values
        await setEmployeeId(response.data.recordworkplace[0].employeeId);
        await setName(response.data.recordworkplace[0].employeeName);
        // console.log('Name', name);


        setSearchEmployeeId('');
        setSearchEmployeeName('');

      }


    } catch (error) {
      // alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา');
      // window.location.reload();
    }

    try {

      // if (data1.month == '00') {
      //   data1.month = '12';
      // }

      //check month 01 then skip data
if(data.month !== '01'){

      const response1 = await axios.post(endpoint + '/timerecord/searchemp', data1);
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
          alert('กรุณาตรวจสอบข้อมูลการลงเวลาของพนักงาน')
          window.location.reload();
        }

      }

      // await alert(data1.month + ' : '+ response1.data.recordworkplace.length )
      // await alert(data.month + ' : '+ response.data.recordworkplace.length )

      const employeeWorkplaceRecords1 = await response1.data.recordworkplace[0].employee_workplaceRecord || '';

      if (employeeWorkplaceRecords1.length > 0) {

        const dates1 = await employeeWorkplaceRecords1.map(record => record.date);
        // const otTime = employeeWorkplaceRecords.map(record => record.otTime);

        const allTimeA1 = await employeeWorkplaceRecords1.map((record) => record.allTime);

        const workplaceId1 = await employeeWorkplaceRecords1.map(record => record.workplaceId);

        const otTime1 = await employeeWorkplaceRecords1.map((record) => record.otTime);

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

              updatedData[(dataIndex1 - 20)].isChecked = true;
              updatedData[(dataIndex1 - 20)].otTime = otTime1[index];
              updatedData[(dataIndex1 - 20)].allTime = allTimeA1[index];
              updatedData[(dataIndex1 - 20)].workplaceId = workplaceId1[index]; // Set otTime at the same index as dates
              updatedData[(dataIndex1 - 20)].date = dates1[index]; // Set otTime at the same index as dates
              // updatedData[(dataIndex1 - 20)].month = month[index]; // Set otTime at the same index as dates


              // Set otTime at the same index as dates
            }

            // }

          });
          console.log('updatedData', updatedData);

          const filteredData = updatedData.filter((record) => record.isChecked == true);
          // console.log('updatedData', updatedData);

          const workplaceIds = [...new Set(filteredData.map((record) => record.workplaceId))];

          setDataset(filteredData);
          return updatedData;

        });
      }

    } else{
alert("งวดต้นปี");
      }

    }
    catch (error) {
      // alert('กรุณาตรวจสอบข้อมูลในช่องค้นหา', error);
      // window.location.reload();
    }
    //xx
    // alert(result_data[0].employeeId);
  }

  console.log('workplaceIdList', workplaceIdList);
  console.log('calendarData1 updated:', calendarData1);
  console.log('calendarData2 updated:', calendarData2);

  const [Datasetsec, setDatasetsec] = useState([]);

  useEffect(() => {
    // Create a mapping of date to dayoff from listTableDayoff
    const dayoffMap = listTableDayoff.reduce((acc, day) => {
      const date = Object.keys(day)[0];
      const dayoff = day[date].trim(); // Remove extra spaces
      if (dayoff !== '') {
        acc[date] = dayoff;
      }
      return acc;
    }, {});

    // Update the Dataset with the dayoff property for matching dates
    const updatedDataset = dataset.map(item => ({
      ...item,
      dayoff: dayoffMap[item.date] || '' // Add 'dayoff' property if the date exists in the map

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

        if (dayoff === 'หยุด' && !isNaN(allTimeAsNumber)) {
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
    const result = Object.entries(workplaceIdCounts).map(([workplaceId, count]) => ({
      workplaceId,
      count,
      allTime: workplaceIdAllTimes[workplaceId].toFixed(1),
      otTime: workplaceIdOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
      dayoffAllTime: workplaceIdDayoffAllTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
      dayoffOtTime: workplaceIdDayoffOtTimes[workplaceId].toFixed(2), // Format otTime to 2 decimal places
    }));

    // Calculate the total allTime
    const totalAllTime = Object.values(workplaceIdAllTimes).reduce((sum, allTime) => sum + allTime, 0).toFixed(1);

    console.log('listTableDayofflistTableDayoff:', listTableDayoff);

    console.log('Result:', result);
    console.log('Total AllTime:', totalAllTime);
    console.log('datasetdataset', dataset);

    const count = dataset.length;

    // Create a mapping of date to dayoff from listTableDayoff

    setCountWork((count));
    setCountWorkSTime(totalAllTime);
    setWorkplaceIdList(result);

    setDatasetsec(updatedDataset);
  }, [dataset, listTableDayoff]);

  console.log('datasetTest', Datasetsec);


  //set salaty calculate
  const [workRate, setWorkRate] = useState(''); //ค่าจ้างต่อวัน
  const [workRateOT, setWorkRateOT] = useState(''); //ค่าจ้าง OT ต่อชั่วโมง
  const [holiday, setHoliday] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ 
  const [holidayHour, setHolidayHour] = useState(''); //ค่าจ้างวันหยุดนักขัตฤกษ์ รายชั่วโมง
  const [addSalary, setAddSalary] = useState([]); //เงิ่นเพิ่มพิเศษ

  const [workplaceIdListSearch, setWorkplaceIdListSearch] = useState([]); //หน่วยงานที่ค้นหาและทำงาน
  const [calculatedValues, setCalculatedValues] = useState([]);


  console.log('searchResult', searchResult);
  // get employee data
  const [MinusSearch, setMinusSearch] = useState(0); // Example: February (you can set it dynamically)
  const [EmpData, setEmpData] = useState([]); // Example: February (you can set it dynamically)
  // const [EmpDataWorkplace, setEmpDataWorkplace] = useState([]); // Example: February (you can set it dynamically)

  useEffect(() => {
    // Extract employeeIds from searchResult
    const employeeIds = searchResult.map((obj) => obj.employeeId);

    // Filter employeelist based on employeeIds
    const filteredEmployeeList = employeelist.filter((employee) =>
      employeeIds.includes(employee.employeeId)
    );

    const selectedAddSalaryIds = filteredEmployeeList.map((obj) => obj.selectAddSalary).flat();
    const selectedMinus = filteredEmployeeList.map((obj) => obj.minus);
    const selectedaddSalary = filteredEmployeeList.map((obj) => obj.addSalary).flat();

    const updatedAddSalary = selectedaddSalary.map((salaryObject) => {
      const { SpSalary, roundOfSalary } = salaryObject;

      if (roundOfSalary === 'daily') {
        return {
          ...salaryObject,
          SpSalary: SpSalary * countWork,
        };
      }
      return salaryObject;
    });
    console.log('result123', updatedAddSalary);
    console.log('countWork', countWork);


    // const selectedMinus = filteredEmployeeList.map((obj) => obj.minus.toFixed(2));
    // const selectedMinus = filteredEmployeeList.map((obj) => parseFloat(obj.minus.toFixed(2)));
    console.log('selectedMinus', selectedMinus);

    const filteredAddSalary = [];

    // filteredEmployeeList.forEach((employee) => {
    //   employee.addSalary.forEach((salary) => {
    //     if (selectedAddSalaryIds.includes(salary._id)) {
    //       filteredAddSalary.push(salary);
    //     }
    //   });
    // });

    filteredEmployeeList.forEach((employee) => {
      employee.addSalary.forEach((salary) => {
        if (selectedAddSalaryIds.includes(salary._id)) {
          filteredAddSalary.push(salary);
        }
      });
    });
    // const testtest2 = filteredEmployeeList.map((item) => item.department);

    console.log('testtest', filteredEmployeeList);
    // console.log('testtest2', testtest2);

    setEmpData(filteredEmployeeList);
    // setEmpDataWorkplace(filteredEmployeeList.department);

    setMinusSearch(selectedMinus);
    // setAddSalary(filteredAddSalary);
    setAddSalary(updatedAddSalary);
  }, [searchResult, employeelist, countWork]);
  // console.log('employee', employee);
  console.log('addSalary123', addSalary);
  console.log('setEmpData', EmpData);
  // console.log('EmpData', EmpData);

  useEffect(() => {
    // Extract workplaceId values from workplaceIdList
    const selectedWorkplaceIds = workplaceIdList.map((item) => item.workplaceId);

    // Filter workplaceList based on selected workplaceIds
    const filteredWorkplaces = workplaceList.filter((workplace) =>
      selectedWorkplaceIds.includes(workplace.workplaceId)
    );

    // Extract the filtered workplaceIds
    // const filteredWorkplaceIds = filteredWorkplaces.map((workplace) => workplace.workplaceId);

    // Set the result in workplaceIdListSearch 

    setWorkplaceIdListSearch(filteredWorkplaces);

    // const EmpDatamain = EmpData.admoney1; // Declare EmpDatamain within the useEffect
    // const EmpDatamain = EmpData.map((item) => item.workplace);

    const EmpDatamain = EmpData.map((item) => item.workplace);
    // const matchingWorkplaceData = workplaceList.filter((w) => EmpDatamain.includes(w.workplaceId));


    // const workplaceData = workplaceList.find((w) => EmpDatamain.includes(w.workplaceId));
    // const workRate = workplaceData ? workplaceData.workRate : 0;
    // const workRateOT = workplaceData ? workplaceData.workRateOT : 0;
    // const workOfHour = workplaceData ? workplaceData.workOfHour : 0;

    // const holiday = workplaceData ? workplaceData.holiday : 0;
    // const holidayOT = workplaceData ? workplaceData.holidayOT : 0;

    const workplaceData = workplaceList.find((w) => EmpDatamain.includes(w.workplaceId));

    const workRate = workplaceData?.workRate ?? 0;
    const workRateOT = workplaceData?.workRateOT ?? 0;
    const workOfHour = workplaceData?.workOfHour ?? 0;

    const holiday = workplaceData?.holiday ?? 0;
    const holidayOT = workplaceData?.holidayOT ?? 0;


    // const workRate = workplaceData.workRate;
    // const workRateOT = workplaceData.workRateOT;
    // const workOfHour = workplaceData.workOfHour;
    // console.log('workplaceData', workplaceData);
    console.log('workRate', workRate);
    console.log('workRateOT', workRateOT);
    console.log('workOfHour', workOfHour);

    console.log('holiday', holiday);
    console.log('holidayOT', holidayOT);

    // console.log('EmpData', EmpData);
    console.log('EmpDatamain', EmpDatamain);
    // console.log('matchingWorkplaceData', matchingWorkplaceData);


    const calculatedResults = workplaceIdList.map((item) => {
      const workplaceId = item.workplaceId;
      const allTime = parseFloat(item.allTime) || 0; // Convert to a number
      const otTime = parseFloat(item.otTime) || 0; // Convert to a number
      const dayoffAllTime = parseFloat(item.dayoffAllTime) || 0; // Convert to a number
      const dayoffOtTime = parseFloat(item.dayoffOtTime) || 0; // Convert to a number

      const calculatedValue = workRate * allTime;
      const calculatedOT = (workRate / workOfHour) * workRateOT * otTime;
      const calculatedValueDayoff = (workRate / workOfHour) * holiday * dayoffAllTime;
      const calculatedValueDayoffOt = (workRate / workOfHour) * holidayOT * dayoffOtTime;

      return { workplaceId, calculatedValue, allTime, otTime, dayoffAllTime, dayoffOtTime, calculatedOT, calculatedValueDayoff, calculatedValueDayoffOt };
    });

    console.log('workplaceIdList', workplaceIdList);



    // Remove null values from the result
    const filteredResults = calculatedResults.filter((result) => result !== null);

    // Calculate the total sum
    const totalSum = filteredResults.reduce((sum, result) => sum + result.calculatedValue, 0);
    // const totalSum = filteredResults.reduce((sum, result) => sum + result.calculatedValue, 0);

    setWorkRate(totalSum);

    setCalculatedValues(filteredResults);
    console.log('Total Sum:', totalSum);
    console.log('Total Sum2:', filteredResults);
    console.log('Total Sum3:', calculatedResults);


  }, [workplaceList, workplaceIdList, EmpData]);
  console.log('workplaceList', workplaceList);
  console.log('workplaceIdList', workplaceIdList);
  console.log('EmpData', EmpData); // Can access EmpData here
  // console.log('EmpDatamain', EmpDatamain); // Can access EmpDatamain here

  // console.log('workRate', workplaceIdListSearch);
  // console.log('allworkRate', calculatedValues);


  // const handleCheckboxChange = (event) => {
  //   const { name, checked } = event.target;
  //   if (name === 'checked28') {
  //     setChecked28(checked);
  //   } else if (name === 'checked31') {
  //     setChecked31(checked);
  //   }
  // };



  const [tableData, setTableData] = useState(
    combinedRange.map((index) => ({
      isChecked: false, // Initial state of the checkbox
      textValue: '',    // Initial state of the text value
      workplaceId: index, // Store the workplaceId
      date: '', // Store the workplaceId
    }))
  );
  // const [tableData, setTableData] = useState(
  //   new Array(31).fill('').map((_, index) => ({
  //     isChecked: false,
  //     textValue: '',
  //   }))
  // );

  // useEffect(() => {
  //   const dates = ['28', '29']; // Example dates

  //   setTableData((prevState) => {
  //     const updatedData = [...prevState];
  //     dates.forEach((date) => {
  //       const index = parseInt(date, 10) - 1; // Subtract 1 because indices are zero-based
  //       if (index >= 0 && index < updatedData.length) {
  //         updatedData[index].isChecked = true;
  //       }
  //     });
  //     return updatedData;
  //   });
  // }, []); // The empty dependency array ensures this effect runs only once on component mount

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
  const [monthset, setMonthset] = useState(''); // Example: February (you can set it dynamically)

  const [MinusSS, setMinusSS] = useState(0); // Example: February (you can set it dynamically)

  const [result, setResult] = useState(''); // Example: February (you can set it dynamically)

  useEffect(() => {
    setMonthset(month);
    // const calculatedValuesAllTime = calculatedValues.map((value) => value.calculatedValue);
    // const calculatedValuesminus = EmployeeSearch.map((value) => parseFloat(value.minus));

    const calculatedValuesAllTime = calculatedValues.map((value) => parseFloat(value.calculatedValue));
    const calculatedValuesOtTime = calculatedValues.map((value) => parseFloat(value.calculatedOT));

    const calculatedValuesDayoffAllTime = calculatedValues.map((value) => parseFloat(value.calculatedValueDayoff));
    const calculatedValuesDayoffOtTime = calculatedValues.map((value) => parseFloat(value.calculatedValueDayoffOt));
    const calculatedValuesaddSalary = addSalary.map((value) => parseFloat(value.SpSalary));
    // const calculatedValuesaddSalary = addSalary.map((value) => {
    //   const salary = parseFloat(value.SpSalary);
    //   const roundOfSalary = value.roundOfSalary.toLowerCase(); // Assuming roundOfSalary is in lowercase

    //   if (roundOfSalary === 'monthly') {
    //     // Adjust for monthly salary (e.g., multiply by the number of days in a month)
    //     const daysInMonth = 30; // You can adjust this based on your requirements
    //     return salary * daysInMonth;
    //   } else if (roundOfSalary === 'daily') {
    //     // Leave daily salary unchanged
    //     return salary;
    //   } else {
    //     // Handle other cases or set a default behavior
    //     return salary;
    //   }
    // });


    const calculatedValuesminus = calculatedValues.map((value) => parseFloat(value.minus));

    // const testre = EmployeeSearch.map((value) => parseFloat(value.minus));

    const sumAlltime = calculatedValuesAllTime.reduce((total, currentValue) => total + currentValue, 0);
    const sumOtTime = calculatedValuesOtTime.reduce((total, currentValue) => total + currentValue, 0);

    const sumDayoffAlltime = calculatedValuesDayoffAllTime.reduce((total, currentValue) => total + currentValue, 0);
    const sumDayoffOtTime = calculatedValuesDayoffOtTime.reduce((total, currentValue) => total + currentValue, 0);

    const sumSalary = calculatedValuesaddSalary.reduce((total, currentValue) => total + currentValue, 0);
    // const summinus = calculatedValuesminus.reduce((total, currentValue) => total + currentValue, 0);

    const Sumall = sumAlltime + sumSalary + sumOtTime + sumDayoffAlltime + sumDayoffOtTime;
    const Minus = parseFloat((Sumall * (MinusSearch / 100)).toFixed(2));

    console.log('testRe11', calculatedValuesAllTime);


    console.log('testRe1', Sumall);
    console.log('testRe2', Minus);
    console.log('testRe3', MinusSearch);

    console.log('calculatedValuesaddSalary', calculatedValuesaddSalary);


    // console.log('all', calculatedValues);

    setMinusSS(Minus);
    setResult(Sumall - Minus);
    // countWork
    console.log('testcal ++', monthset);

  }, [month, calculatedValues, addSalary]);
  console.log('testcal', monthset);
  console.log('testRe', result);


  // useState(() => {
  //   const tableDataDate = tableData.filter(item => item.date !== null && item.date !== '');
  //   setDataset(tableDataDate);
  // }, [tableData]);

  // useState(() => {
  //   const filteredData = tableData.filter((record) => record.isChecked == false);
  //   setDataset(filteredData);
  // }, [tableData]);

  // setDataset(
  //   employeeWorkplaceRecords
  //     .filter((record) => record.date) // Filter out records with null or undefined dates
  //     .map((record) => {
  //       return record;
  //     })
  // );


  const [year, setYear] = useState(2023); // Example year (you can set it dynamically)
  // const [calendarData, setCalendarData] = useState([]);

  const [workMonth, setWorkMonth] = useState([]);

  const generateText = () => {
    return searchResult.map((employeerecord) => (
      'ประจำเดือน ' + getMonthName(employeerecord.month) +
      ' ตั้งแต่วันที่ 21 ' + getMonthName(parseInt(employeerecord.month, 10) - 1) +
      ' ถึง 20 ' + getMonthName(employeerecord.month) +
      ' ' + (parseInt(employeerecord.timerecordId, 10) + 543)
    )).join(' '); // Join the generated text into a single string
  };

  // Call generateText when the component mounts or when searchResult changes
  useEffect(() => {
    const text = generateText();
    setWorkMonth(text);
  }, [searchResult]);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF('landscape');

      // Load the Thai font
      const fontPath = '/assets/fonts/THSarabunNew.ttf';
      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, 'THSarabunNew', 'normal');

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: 'THSarabunNew',
        fontStyle: 'normal',
        fontSize: 10,
      };
      const tableOptions = {
        styles: stylestable,
        startY: 25,
        // margin: { top: 10 },
      };

      const title = ' ใบลงเวลาการปฏิบัติงาน';

      // Set title with the Thai font
      doc.setFont('THSarabunNew');
      doc.setFontSize(16);
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);

      const subTitle = workMonth; // Replace with your desired subtitle text
      doc.setFontSize(12); // You can adjust the font size for the subtitle
      const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const subTitleX = (pageWidth - subTitleWidth) / 2;
      doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Calculate the number of days in the month, considering February and leap years
      const daysInMonth = (monthset === '02' && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 :
        (monthset === '02') ? 28 :
          [4, 6, 9, 11].includes(monthset) ? 30 : 31;

      // Calculate the starting point for the table header
      let startingDay = 21;

      // Generate the header with a single cycle of "01" to "20" followed by "21" to the last day of the month
      const header = Array.from({ length: daysInMonth }, (_, index) => {
        const day = (index + startingDay) > daysInMonth ? (index + startingDay - daysInMonth) : (index + startingDay);

        // Add leading zeros for days 1 to 9
        const formattedDay = day < 10 ? `0${day}` : day.toString();

        return formattedDay;
      });

      // Assuming that 'date' contains values like '01', '02', ..., '28', '29', '30', '31'
      // You can replace 'date' with the actual field name containing the date information in your data
      const dateOt = ['25', '09', '10'];

      const dateFieldName = 'date';

      // Create an object to store data rows by date
      const rowDataByDate = {};

      // Organize the dataset into the rowDataByDate object
      Datasetsec.forEach((data) => {
        // dataset.forEach((data) => {

        const date = data[dateFieldName];
        if (!rowDataByDate[date]) {
          rowDataByDate[date] = { workplaceId: [], otTime: [], dateFieldName: [], allTime: [] };
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
            rowData.workplaceId.join(', '),
            rowData.allTime.join(', '),
            rowData.otTime.join(', '),
            // rowData.dateFieldName.join(', '),
          ];
        } else {
          return ['', '', ''];
        }
      });

      // Transpose the transposedTableData to sort horizontally
      const sortedTableData = Array.from({ length: 3 }, (_, index) =>
        transposedTableData.map((row) => row[index])
      );

      const textColumn = [name, 'เวลา ทำงาน', 'เวลา OT'];

      const sortedTableDataWithText = sortedTableData.map((data, index) => {
        const text = [textColumn[index]];
        return [...text, ...data];
      });

      // Now, sortedTableDataWithText contains the text column followed by sorted data columns.

      const customHeaders = [
        ['วันที่', ...header],
      ];


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
          if (data.cell.section === 'head' && shouldHighlightCell(data.cell.raw)) {
            // Set the background color for header cells with the location number found in dateOt
            doc.setFillColor(255, 255, 0); // Yellow background color
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        },
      });



      const additionalTableData = [
        ['เงินค่าจ้าง', '', '', '', '', '', '55'],
        ['Cell 4', 'Cell 5', 'Cell 6'],
        ['Cell 7', 'Cell 8', 'Cell 9'],
      ];

      // const calculatedValuesAllTime = calculatedValues.map((value) => [
      //   `รวมวันทำงาน:`, ` ${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      // ]);

      // const calculatedValuesOt = calculatedValues.map((value) => [
      //   `รวมวันทำงาน OT:`, ` ${value.calculatedOT} (${value.otTime})`
      // ]);
      // const combinedTableData = [...additionalTableData, ...calculatedValuesAllTime, ...calculatedValuesOt];
      // /////////////////////////////////////////////////////////////////
      // const calculatedValuesAllTime = calculatedValues.map((value) => [
      //   `รวมวันทำงาน:`, ` ${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`,
      // ]);

      const calculatedValuesAllTime = calculatedValues.map((value) =>
        `${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      );

      // Combine the calculated values into a single array
      const combinedCalculatedValues = ['รวมวันทำงาน:', ...calculatedValuesAllTime];

      const calculatedValuesOt = calculatedValues.map((value) => [
        `${value.calculatedOT} (${value.otTime})`,
      ]);

      const combinedCalculatedValuesOt = ['รวมวันทำงาน OT:', ...calculatedValuesOt];

      const combinedTableData = [...additionalTableData, combinedCalculatedValues, combinedCalculatedValuesOt];
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
      const textWithBackgroundColor = ['รวมวันทำงาน:', 'รวมวันทำงาน OT:'];

      // Add the additional table to the PDF
      doc.autoTable({
        body: combinedTableData,
        ...additionalTableOptions,
        didDrawCell: function (data) {
          if (data.cell.section === 'body') {
            // Check if the cell contains text that should have a background color
            const text = data.cell.raw;
            if (textWithBackgroundColor.includes(text)) {
              // Set the background color
              doc.setFillColor(255, 255, 0); // Yellow background color
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

              // Reset text color for better visibility
              doc.setTextColor(0, 0, 0);
            }
          }
        },
      });
      const titletest = 'รวมวันทำงาน:';
      const titletest2 = 'รวมวันทำงาน OT:';

      // Set title with the Thai font
      doc.setFont('THSarabunNew');
      doc.setFontSize(14);
      doc.text(titletest, 15, 108);
      doc.text(titletest2, 15, 115);


      doc.save('example.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // const tableRef = useRef(null);

  const tableRef = useRef(null);

  const generatePDFTest = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    const table = tableRef.current;
    const fontPath = '/assets/fonts/THSarabunNew.ttf';
    doc.addFileToVFS(fontPath);
    doc.addFont(fontPath, 'THSarabunNew', 'normal');

    // Override the default stylestable for jspdf-autotable
    const stylestable = {
      font: 'THSarabunNew',
      fontStyle: 'normal',
      fontSize: 10,
    };

    // Set title with the Thai font
    const title = ' ใบลงเวลาการปฏิบัติงาน';

    doc.setFont('THSarabunNew');
    doc.setFontSize(16);
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 10);

    const subTitle = workMonth; // Replace with your desired subtitle text
    doc.setFontSize(12); // You can adjust the font size for the subtitle
    const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const subTitleX = (pageWidth - subTitleWidth) / 2;
    doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

    // Convert the table to a PDF using jsPDF and jsPDF-AutoTable

    doc.autoTable({
      html: table,
      styles: stylestable,
      margin: { top: 30 },
    });

    // const tableRows = table.querySelectorAll('tr');
    // const cellWidth = 190 / 31; // Adjust cell width based on the number of columns
    // const cellHeight = 10; // Adjust cell height as needed

    // const yStart = 20; // Initial y position for the table
    // const yOffset = 10; // Space between rows

    // tableRows.forEach((row, i) => {
    //   const cells = row.querySelectorAll('th, td'); // Include both header and data cells
    //   const y = yStart + i * yOffset;

    //   cells.forEach((cell, j) => {
    //     const x = j * cellWidth * 1.5;
    //     doc.rect(x, y, cellWidth *1.5, cellHeight, 'S'); // Draw cell borders
    //     doc.text(cell.innerText, x + 2, y + cellHeight / 2); // Adjust cell text position
    //   });
    // });

    doc.save('your_table.pdf');
  };

  return (
    // <div>
    <body class="hold-transition sidebar-mini" className='editlaout'>
      <div class="wrapper">
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
            <li class="breadcrumb-item"><a href="#"> ระบบเงินเดือน</a></li>
            <li class="breadcrumb-item active">ใบลงเวลาการปฏิบัติงาน</li>
          </ol>
          <div class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ใบลงเวลาการปฏิบัติงาน</h1>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
<!-- Main content --> */}

          <section class="content">
            <div class="row">
              <div class="col-md-7">
                <section class="Frame">
                  <div class="col-md-12">
                    <h2 class="title">ค้นหา</h2>
                    <div class="col-md-12">
                      <form onSubmit={handleSearch}>
                        <div class="row">
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchEmployeeId">รหัสพนักงาน</label>
                              <input type="text" class="form-control" id="searchEmployeeId" placeholder="รหัสพนักงาน" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} />
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchname">ชื่อพนักงาน</label>
                              <input type="text" class="form-control" id="searchname" placeholder="ชื่อพนักงาน" value={searchEmployeeName} onChange={(e) => setSearchEmployeeName(e.target.value)} />
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group">
                              <label role="searchEmployeeId">เดือน</label>
                              <select className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} >
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
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group" style={{ position: 'absolute', bottom: '0' }}>
                                <button class="btn b_save"><i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div class="d-flex justify-content-center">
                        <h2 class="title">ผลลัพธ์ {result_data.length >0 ? ( '1') : ('0')} รายการ</h2>
                      </div>
                      <div class="d-flex justify-content-center">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="form-group">
                              <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                                { result_data.map((workplace , index)  => (
                                  <li
                                    key={workplace.employeeId}
                                    onClick={() => handleClickResult(workplace)}
                                  >
                                        {index === 0 ? (
      <span>
        รหัส {workplace.employeeId || ''} ชื่อพนักงาน {workplace.employeeName || ''}
      </span>
    ) : null}
                                    {/* รหัส {workplace.employeeId || ''} ชื่อพนักงาน {workplace.employeeName || ''} */}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

            </div>

            <div class="row">
              <div class="col-md-2">
                {result_data.slice(0, 1).map((
                  employeerecord) => (
                  employeerecord.employeeId + ': ' + employeerecord.employeeName + ' ' +  lastName )
                )}
              </div>
            </div>
            <br />

            <div class="row">
              {/* <div class="col-md-2">
                {result_data.slice(0, 1).map((
                  employeerecord) => (
                  '                ชื่อ :                   ' + employeerecord.employeeName)
                )}
              </div> */}
              {/* <div class="col-md-3"> */}
                {result_data.slice(0, 1).map((employeerecord) => {

if(getMonthName(month) == "มกราคม"){
return (
  <div class="col-md-5" key={employeerecord.timerecordId}>

  {'ประจำเดือน ' + getMonthName(month)}
  {' ตั้งแต่วันที่ 1 ' + getMonthName(parseInt(month, 10))}
  {' ถึง 20 ' + getMonthName(month)}
{'  ' + (parseInt(employeerecord.timerecordId, 10) + 543)}

</div>

);
} else {


return (
  <div class="col-md-5" key={employeerecord.timerecordId}>

  {'ประจำเดือน ' + getMonthName(month)}
  {' ตั้งแต่วันที่ 21 ' + getMonthName(parseInt(month, 10) - 1)}
   {' ถึง 20 ' + getMonthName(month)}
{'  ' + (parseInt(employeerecord.timerecordId, 10) + 543)}

</div>
);
}

                }

                )}
            </div>
            <br />
            <div class="row">
              <div class="col-md-3">
                วันทำงานทั้งหมด {countWork} วัน
              </div>
            </div>

            <form>
              <div class="row">
                <div class="col-md-9">
                  <section class="Frame">
                    <div class="container" style={{ overflowX: 'scroll' }}>
                      {/* <table class="table table-bordered "> */}
                      <button onClick={generatePDFTest}>Generate PDF</button>
                      <table ref={tableRef} className="table table-bordered">
                        <thead>
                          <tr>
                            <th style={styles.th}></th>
                            {combinedRange.map((number, index) => (
                              <th key={index} style={styles.th}>{number}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={verticalTextHeader} >วันทำงาน</td>
                            {tableData.map((data, index) => (
                              <td key={index}>
                                {/* <input
                                  type="checkbox"
                                  className="form-control custom-checkbox"
                                  checked={data.isChecked}
                                  disabled={true}
                                  onChange={() => handleCheckboxChange(index)}
                                  style={{ color: 'black' }}
                                /> */}
                                {/* {data.isChecked}<br/> */}
                                {/* {data.workplaceId} */}
                                {data.workplaceId <= 31 ? null : data.workplaceId}

                              </td>

                            ))}

                          </tr>
                          <tr>
                            <td></td>
                            {listTableDayoff.map((item, index) => {
                              const [day, s] = Object.entries(item)[0];

                              return (
                                <td key={index}>{s}</td>
                              )

                            }

                            )}
                          </tr>
                          <tr>
                            <td>ช.ม. ทำงาน</td>
                            {tableData.map((data, index) => (
                              <td key={index}>
                                {/* <input
                                  type="text"
                                  class="form-control"
                                  value={data.allTime}
                                  onChange={(event) => handleTextChange(index, event)}
                                /> */}
                                {data.allTime}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td>ช.ม. โอที</td>
                            {tableData.map((data, index) => (
                              <td key={index}>
                                {/* <input
                                  type="text"
                                  class="form-control"
                                  value={data.otTime}
                                  onChange={(event) => handleTextChange(index, event)}
                                /> */}
                                {data.otTime}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* <label>
                      <input
                        type="checkbox"
                        name="checked28"
                        checked={checked28}
                        onChange={handleCheckboxChange}
                      />
                      Checked 28
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="checked31"
                        checked={checked31}
                        onChange={handleCheckboxChange}
                      />
                      Checked 31
                    </label> */}
                    {/* Add more checkboxes as needed */}

                    {/* <ul>
                      {woekplace.map((date, index) => (
                        <li key={index}><input type="date" value={date}/></li>
                      ))}
                    </ul> */}

                  </section>
                </div>
                <div class="col-md-3">
                  {/* <div style={{
                    position: "absolute",
                    bottom: "2rem",
                    right: "0px"
                  }}>
                    <TestPDF />
                  </div> */}
                  <div>
                    {/* <button id="generatePdfButton" onClick={generatePDF}>Generate PDF</button> */}
                    {/* <TestPDF /> */}
                  </div>
                </div>
              </div>
            </form>
            {/* </form> */}
            <div class="row">
              <div class="col-md-9">
                <section class="Frame">
                  <div class="container" style={{ overflowX: 'scroll' }}>
                    <table class="table table-bordered ">
                      <thead>
                        <tr>
                          <th>เงินค่าจ้าง</th>
                          {calculatedValues.map((value, index) => (
                            <th>
                              {value.workplaceId}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            รวมวันทำงาน
                          </td>
                          {calculatedValues.map((value, index) => (
                            <td>
                              {value.calculatedValue} ({value.allTime} วัน)
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>
                            รวมวันทำงาน OT
                          </td>
                          {calculatedValues.map((value, index) => (
                            <td>
                              {value.calculatedOT} ({value.otTime} ช.ม.)
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th>เงินเพิ่มพิเศษ</th>
                        </tr>
                        {addSalary.map((value, index) => (
                          <tr key={index}>
                            <td>{value.name}</td>
                            <td>{value.SpSalary} บาท</td>
                          </tr>
                        ))}
                        <tr>
                          <td>วันหยุดนักขัตฤกษ์</td>
                          {calculatedValues.map((value, index) => (
                            <td>
                              {value.calculatedValueDayoff} ({value.dayoffAllTime} ช.ม.)
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>วันหยุดนักขัตฤกษ์ OT</td>
                          {calculatedValues.map((value, index) => (
                            <td>
                              {value.calculatedValueDayoffOt} ({value.dayoffOtTime} ช.ม.)
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td>จ่ายป่วย</td>
                        </tr>
                        <tr>
                          <td>ชดเชยพักร้อน</td>
                        </tr>
                        <tr>
                          <td>หักประกันสังคม</td>
                          <td>{MinusSS} ({MinusSearch} %)</td>

                        </tr>
                        <tr>
                          <td>เงินสุทธิ</td>
                          <td>{result}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table style={vertical1}>
                      <thead>
                        <tr>
                          <th style={verticalTextHeader}>Header 1</th>
                          <th style={verticalTextHeader}>Header 2</th>
                          {/* Add more header columns as needed */}
                        </tr>
                      </thead>
                      
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </section>
          {/* <!-- /.content --> */}
        </div >
      </div >

      {/* {JSON.stringify(listDayOff,null,2)} */}

    </body >
  )
}

function getMonthName(monthNumber) {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
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
  const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7'];
  return daysOfWeek[dayOfWeek];
  // console.log('dayOfWeek',dayOfWeek);
};
// console.log('',getDateDayOfWeek);


export default Worktimesheet