const connectionString = require('../config');
const sURL = 'http://localhost:3000';

//require timerecordEmployee 
const timerecordEmployee = require('./models/periodtimerecordModel');
//require Workplace 
const {Workplace} = require('./models/workplaceModel');
const Employee = require('./models/employeeModel');


const axios = require('axios');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { months } = require('moment');


//Connect mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true, useUnifiedTopology:
    true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Define time record schema for workplace
const concludeSchema = new mongoose.Schema({
  year: String,
  month: String,
  concludeDate: String,
  employeeId: String,
  concludeRecord: [{
    day: String,
    workplaceId: String,
    allTimes: String,
    workRate: String,
    workRateMultiply: String,
    otTimes: String,
    workRateOT: String,
    workRateOTMultiply: String,
    addSalaryDay: String,
    shift: String,
    workType: String
  }],
  addSalary: [
  ],
  createBy: String,
  sumWorkHour: String,
  sumWorkRate: String,
  sumWorkHourOt: String,
  sumWorkRateOt: String
});

// Create the conclude record time model based on the schema
const conclude = mongoose.model('conclude', concludeSchema);

router.post('/autocreate', async (req, res) => {
  const {
    year,
    month,
    employeeId } = await req.body;

  sumWorkHour = 0;
  sumWorkRate = 0;
  sumWorkHourOt = 0;
  sumWorkRateOt = 0;

const workplaceListTmp = [];
let upsalary = 0;
let upSalary_year = '';
let upSalary_month  = '';

  try {

    const dataConclude = {};
    const concludeRecord = [];

    const addSalaryDaily = [];

    //get employee add salary data
    const searchEmp = await {
      employeeId: employeeId,
      name: '',
      idCard: '',
      workPlace: ''
    };
    const responseEmp = await axios.post(sURL + '/employee/search', searchEmp);
    const dataEmp = await responseEmp.data;

    // console.log('*x ' + JSON.stringify(dataEmp.employees[0].addSalary ,null ,2) );
    // if(dataEmp.employees.length !== 0){
    if (dataEmp && dataEmp.employees && Array.isArray(dataEmp.employees) && dataEmp.employees.length !== 0) {
      await dataEmp.employees[0].addSalary.forEach(item => {
        if (item.roundOfSalary == 'daily') {
          addSalaryDaily.push(item);
        }
      });
    }
    let addSalaryList = [];


    dataConclude.year = await year;
    dataConclude.month = await month;

    const today = await new Date();
    const dd = await String(today.getDate()).padStart(2, '0');
    const mm = await String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = await today.getFullYear();
    const hh = await String(today.getHours()).padStart(2, '0');
    const min = await String(today.getMinutes()).padStart(2, '0');
    const concludeDate = await `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    await console.log(concludeDate); // Example output: "20-06-2024 14:30"

    dataConclude.concludeDate = await concludeDate || '';
    dataConclude.employeeId = await employeeId;

    // data.concludeRecord.day = '';
    // data.concludeRecord.workplaceId = '';
    // data.concludeRecord.allTimes = '';
    // data.concludeRecord.workRate = '';
    // data.concludeRecord.workRateMultiply = '';
    // data.concludeRecord.otTimes = '';
    // data.concludeRecord.workRateOT = '';
    // data.concludeRecord.workRateOTMultiply = '';
    // data.concludeRecord.addSalaryDay = '';

    // dataConclude.addSalary = [];

    
    let year1 = await Number(year);
    // Convert the month string to an integer
    let monthInt = await parseInt(month, 10);

    // Subtract one to get the previous month
    let prevMonthInt = await monthInt - 1;

    // Handle the case where the month is January
    if (prevMonthInt === 0) {
      prevMonthInt = await 12;
      year1 = await year1 - 1;
    }

    // Convert the result back to a two-digit string
    let prevMonth = await prevMonthInt.toString().padStart(2, '0');
    const lastday = await new Date(year1, prevMonth, 0).getDate();

    // console.log('Previous month:', prevMonth); // Output: "02"
    const searchData1 = await {
      employeeId: employeeId || '',
      month: prevMonth || '',
      timerecordId: year1 || ''
    };
    const response1 = await axios.post(sURL + '/timerecord/searchemp', searchData1);
    // console.log(JSON.stringify( response.data, null,2) );
    const data1 = await response1.data;
    // console.log(JSON.stringify( data.recordworkplace) );

    // await console.log('*x ' + JSON.stringify(data1.recordworkplace , null ,2) );
    if (data1.recordworkplace.length !== 0) {
      
      //get workplaceId in first employee_workplaceRecord
      // let wpId1 = await data1.recordworkplace[0].employee_workplaceRecord[0].workplaceId;
      let wpId1 = dataEmp?.employees?.[0]?.workplace || '';
      let salary = dataEmp.employees[0].salary || 0;
      let tmpSalary = dataEmp.employees[0].salary || 0;

      console.log('salary ' + salary );
//check employee type is month
if(parseFloat(salary ) >= 1660) {
  salary  = parseFloat(salary) / 30;
  tmpSalary  = parseFloat(salary) / 30;
}

const wsSearch  = {
  searchWorkplaceId: wpId1 , 
  searchWorkplaceName  : ''
}
try {
  const empWpResponse = await axios.post(`${sURL}/workplace/getupsalary`, wsSearch );
  if (empWpResponse.data.workplaces) {
    upsalary = await empWpResponse?.data?.workplaces?.[0]?.addWorkRate || 0;
    const workRateChange = await empWpResponse?.data?.workplaces?.[0]?.workRateChange || 0;
// console.log(workRateChange );
// Convert the string to a Date object
const date = await new Date(workRateChange);

// Get the year
upSalary_year = await date.getFullYear(); // Use getFullYear() for local time
// Get the month (0-based index, so add 1 for the correct month)
upSalary_month = await date.getMonth() + 1; // Use getMonth() for local time
//check up Salary with month and year
if((prevMonth  == upSalary_month ) && (year1  == upSalary_year ) ) {
  salary  = await parseFloat(salary)   + parseFloat(upsalary  || '0');
  tmpSalary = await parseFloat(tmpSalary)  + salary   + parseFloat(upsalary  || '0');
}
  } else {
  }

} catch (error) {

  }



      const wCalList1 = [];

      //check employee working in multi workplace
      const wGroup1 = await groupByWorkplaceId(data1.recordworkplace[0].employee_workplaceRecord);
      // await console.log('wGroup1  :' + JSON.stringify(wGroup1,2,null));
      await console.log('count :' + Object.keys(wGroup1).length);


      // if (wGroup1) {
      const keys = await Object.keys(wGroup1);
      console.log('wGroup keys:', keys); // Log the keys of wGroup
      console.log('wGroup keys length:', keys.length); // Log the length of the keys

//check working multi workplace and not 399-105
      if (keys.length > 1 && dataEmp.employees[0].workplace  !== '10105') {
        console.log('process : 21 - '+ lastday);

        for (const workplaceId of Object.keys(wGroup1)) {
          const group1 = wGroup1[workplaceId];
          // console.log(`Workplace ID: ${group.workplaceId}, Workplace Name: ${group.workplaceName}`);
          const wpDataCalculator1 = {
            month: month || '',
            year: year1 || '',
            workplaceId: group1.workplaceId
          };

          try {
            const wpResponse1 = await axios.post(`${sURL}/workplace/caldata`, wpDataCalculator1);
            await wCalList1.push({
              'workplaceId': group1.workplaceId,
              'data': wpResponse1.data
            });

            workplaceListTmp.push(group1.workplaceId);
          } catch (error) {
            console.error(`Error processing workplace ID ${group1.workplaceId}:`, error);
          }
        }

        // Do something with wCalList after all promises have been resolved
        // console.log('Workplace Calculation List:', wCalList1);
        for (const element of data1.recordworkplace[0].employee_workplaceRecord) {
          const tmp = {};

          const tmpWP = wCalList1.find(item => item.workplaceId === element.workplaceId);
          // console.log('workRateOT : ' + JSON.stringify(tmpWP.data.workRateOT ,2 ,null) );
          const workOfHour = await (tmpWP?.data?.workOfHour) ?? 0;
          const workOfOT = await parseFloat(tmpWP?.data?.workOfOT) ?? 0;
          const workOfOT_subHour = parseFloat(tmpWP?.data?.workOfOT_subHour) ?? 0;
          const workOfOT_subMinute = await parseFloat(tmpWP?.data?.workOfOT_subMinute) ?? 0;
          const workOfOT_breakMinute = await parseFloat(tmpWP?.data?.workOfOT_breakMinute) ?? 0;

          const dayOff = await tmpWP?.data?.workplaceDayOffList ?? [];
          const specialDayOff = await tmpWP?.data?.specialDaylist ?? [];
          const dayOffCheck = [];

          if (dayOff.length !== 0) {
            dayOff.forEach(item => {
              let dateoffParts = item.split('-');
              let str2 = parseInt(dateoffParts[2], 10);
              dayOffCheck.push(str2);
            });
            // console.log('dayOffCheck  '+ dayOffCheck );
          }


          let dateParts = element.date.split('/');
          let str1 = parseInt(dateParts[0], 10);

          if (str1 > 20 && str1 <= lastday) {

            tmp.day = str1 + '/' + prevMonth + '/' + year;
            tmp.workplaceId = element.workplaceId || '';
            let parts = element.allTime.split('.');

            let hours = parseInt(parts[0], 10) || 0;
            let minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

            let scaledMinutes = (minutes * 100) / 60;
            let allTime = `${hours}.${scaledMinutes}` || 0;

            tmp.allTimes = `${hours}.${scaledMinutes}` || 0;

            let parts1 = element.otTime.split('.');

            let hours1 = parseInt(parts1[0], 10) || 0;
            let minutes1 = parts1.length > 1 ? parseInt(parts1[1], 10) : 0;

            // let scaledMinutes1 = (minutes1 * 100) / 60;
            // let otTime = parseFloat(`${hours1}.${scaledMinutes1}`).toFixed(2) || 0;
            let scaledMinutes1 = minutes1;
            let otTime = `${parseFloat(hours1 || 0)}.${parseFloat(scaledMinutes1 || 0 ) } `;

            if (element.specialtSalary !== '' || element.specialtSalaryOT !== '') {
              tmp.workRate = element.specialtSalary || '';
              tmp.workRateMultiply = Number(element.specialtSalary || 0) / Number(wpResponse.data.workRate || 0);

              tmp.otTimes = otTime || 0;

              tmp.workRateOT = element.specialtSalaryOT || '';
              tmp.workRateOTMultiply = Number(element.specialtSalaryOT || 0) / (Number(wpResponse.data.workRate || 0) / 8);
              tmp.workType = 'specialtSalary';

              sumWorkHour += parseFloat(allTime) || 0;
              sumWorkRate += parseFloat(element.specialtSalary) || 0;
              sumWorkHourOt += parseFloat(otTime) || 0;
              sumWorkRateOt += parseFloat(element.specialtSalaryOT) || 0;

            } else {
              if (specialDayOff.includes(Number(str1))) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = tmpWP.data.workRate + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(tmpWP.data.holidayHour) * (salary / 8)) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = tmpWP.data.holidayHour || 0;
console.log(workRate + ' workRate ');
                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(tmpWP.data.holidayOT) * (salary / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || '';
                tmp.workRateOTMultiply = tmpWP.data.holidayOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'specialDayOff';

              } else if (dayOffCheck.includes(str1)) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = tmpWP.data.workRate + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(tmpWP.data.dayoffRateHour ?? 0) * (parseFloat(salary || 0) / 8)) * parseFloat(allTime)).toFixed(2);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = tmpWP.data.dayoffRateHour || '0';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }
                
                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (parseFloat(salary || '0') / 8)) * (parseFloat(otTime ))).toFixed(3);

                //cal OT
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = tmpWP.data.dayoffRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {
                  // salary = parseFloat(dataEmp.employees[0].salary);
                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'dayOff';

              } else {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0')+ parseFloat(upsalary   || '0');
                }

                if(parseFloat(allTime || 0 ) >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                // let workRate = ((salary / 8) * (parseFloat(otTime) * 1.111) ).toFixed(2);
                let workRate = ((parseFloat(salary) / 8) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = '1';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0 ).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(3);

                //cal OT
                let workRateOT = (((parseFloat(salary || '0') / 8) * parseFloat(tmpWP.data.workRateOT ?? 0)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + (parseFloat(minutesTmp || '0') )) / 60) ))).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = tmpWP.data.workRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {
// salary = parseFloat(dataEmp.employees[0].salary) 
                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'workDay';

              }
            }
            tmp.addSalaryDay = '';
            tmp.shift = element.shift || 0;

            concludeRecord.push(tmp);

          } //
        } //end for
        // }
        console.log('1x');
      } else {
console.log('2x');

if(wpId1 !== '10105'){
  wpId1 = keys[0]
}

const         wpDataCalculator1 = await {
  month: month || '',
  year: year1 || '',
  workplaceId: wpId1
  // workplaceId: keys[0]
};


        //get workplace data for calculator
        const wpResponse1 = await axios.post(sURL + '/workplace/caldata', wpDataCalculator1);
        // console.log(JSON.stringify( wpResponse1.data, null,2) );
        const workOfHour = await wpResponse1.data.workOfHour || 0;
        const workOfOT = await parseFloat(wpResponse1.data.workOfOT) || 0;
        const workOfOT_subHour = await parseFloat(wpResponse1.data.workOfOT_subHour) || 0;
        const workOfOT_subMinute = await parseFloat(wpResponse1.data.workOfOT_subMinute) || 0;
        const workOfOT_breakMinute = await parseFloat(wpResponse1.data.workOfOT_breakMinute ) || 0;

        const dayOff1 = await wpResponse1.data.workplaceDayOffList || [];
        // console.log('dayOff1 ' + dayOff1 );
        const specialDayOff1 = await wpResponse1.data.specialDaylist || [];
        const dayOffCheck1 = [];
        if (dayOff1.length !== 0) {
          await dayOff1.forEach(item => {
            let dateoffParts = item.split('-');
            let str2 = parseInt(dateoffParts[2], 10);
            // console.log(str2 );
            dayOffCheck1.push(str2);
          });
          // console.log('dayOffCheck1' + JSON.stringify(dayOffCheck1,null,2));
        }

        for (const element of data1.recordworkplace[0].employee_workplaceRecord) {
          const tmp = {};

          let dateParts = element.date.split('/');
          let str1 = parseInt(dateParts[0], 10);
          // console.log('*str1 ' + str1);

          if (str1 > 20 && str1 <= lastday) {

            tmp.day = str1 + '/' + prevMonth + '/' + year1;
            tmp.workplaceId = element.workplaceId || '';
            let parts = element.allTime.split('.');

            let hours = parseInt(parts[0], 10) || 0;
            let minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

            let scaledMinutes = (minutes * 100) / 60;
            let allTime = Number(`${hours}.${scaledMinutes}`) || 0;

            tmp.allTimes = `${hours}.${scaledMinutes}` || '0';

            let parts1 = element.otTime.split('.');

            let hours1 = parseInt(parts1[0], 10) || 0;
            let minutes1 = parts1.length > 1 ? parseInt(parts1[1], 10) : 0;

            // let scaledMinutes1 = (minutes1 * 100) / 60;
            let scaledMinutes1 = minutes1;

            // let otTime = parseFloat(`${hours1}.${scaledMinutes1}`).toFixed(2) || 0;
            // let otTime = ((parseFloat(hours1 || 0) *60) + parseFloat(scaledMinutes1 || 0 ) /60).toFixed(2) || 0;
            let otTime = `${parseFloat(hours1 || 0)}.${parseFloat(scaledMinutes1 || 0 ) } `;

            
            tmp.otTimes = `${hours1}.${scaledMinutes1}` || 0;


            if (element.specialtSalary !== '' || element.specialtSalaryOT !== '') {
              // console.log('special rate')
              tmp.workRate = element.specialtSalary || '';
              tmp.workRateMultiply = Number(element.specialtSalary || 0) / Number(wpResponse1.data.workRate || 0);

              tmp.workRateOT = element.specialtSalaryOT || '';
              tmp.workRateOTMultiply = Number(element.specialtSalaryOT || 0) / (Number(wpResponse1.data.workRate || 0) / 8);
              tmp.workType = 'specialtSalary';

              sumWorkHour += parseFloat(allTime) || 0;
              sumWorkRate += parseFloat(element.specialtSalary) || 0;
              sumWorkHourOt += parseFloat(otTime) || 0;
              sumWorkRateOt += parseFloat(element.specialtSalaryOT) || 0;

            } else {
              if (specialDayOff1.includes(Number(str1))) {
// console.log('special day off rate');                

                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(wpResponse1.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTime = workOfHour;
                } else {
                  tmp.allTime = allTime;
                }

                let workRate = ((parseFloat(tmpWP.data.holidayHour) * (salary / 8)) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = wpResponse1.data.holidayHour || 0;
                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(wpResponse1.data.holidayOT) * (salary / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60)  )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = wpResponse1.data.holidayOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;
                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'specialDayOff';

              } else if (dayOffCheck1.includes(str1)) {
                console.log('day off rate');

                if (salary === 0 || salary == upsalary  ) {
                  salary = wpResponse1.data.workRate + parseFloat(upsalary   || '0');
                }


                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTime = workOfHour;
                } else {
                  tmp.allTime = allTime;
                }

                let workRate = ((parseFloat(wpResponse1.data.dayoffRateHour ) * (salary  / 8)) * parseFloat(allTime));
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = wpResponse1.data.dayoffRateHour || 0;

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(wpResponse1.data.dayoffRateOT ?? 0) * (salary / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = wpResponse1.data.dayoffRateOT || 0;

                
                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;
                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'dayOff';

              } else {
                // console.log('default rate');
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(wpResponse1.data.workRate || '0') + parseFloat(upsalary   || '0');
                }


                if (parseFloat(allTime || '0') >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTime = workOfHour || 0;
                } else {
                  tmp.allTime = allTime || 0;
                }

                let workRate = ((parseFloat(salary || '0') / 8) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = '1';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = (((workOfOT_subHour * 60)+ workOfOT_subMinute ) - workOfOT_breakMinute) / 60;
                  // tmp.otTimes = ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60;
                  // (((workOfOT_subHour * 60)+ workOfOT_subMinute ) - workOfOT_breakMinute) / 60;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0 ).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);
                // let workRateOT = ((parseFloat(wpResponse1.data.workRateOT ?? 0) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction)) ).toFixed(3);

                //cal OT
                let workRateOT = (((parseFloat(salary) / 8) * parseFloat(wpResponse1.data.workRateOT || '0') ) * parseFloat( (((parseFloat(hoursTmp || '0') * 60) + (parseFloat(minutesTmp || '0') )) / 60) ) ).toFixed(3);
                // let workRateOT = (((salary / 8) * parseFloat(wpResponse1.data.workRateOT ?? 0)) * (parseFloat(hoursTmp + decimalFraction)) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = wpResponse1.data.workRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;
                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'workDay';

              }
            }
            tmp.addSalaryDay = '';
            tmp.shift = element.shift || 0;

            concludeRecord.push(tmp);
          }
        }

      }

    }


        // Check day is null and place data for days 21 to last day of the previous month
        for (let i = 21; i <= lastday; i++) {
          let d = i + '/' + prevMonth + '/' + year1;
          let x = concludeRecord.some(record => record.day === d);
    
          if (!x) {
            await concludeRecord.push({
              'day': d,
              'workplaceId': '',
              'allTimes': '0',
              'workRate': '0',
              'otTimes': '0',
              'workRateOT': '0',
              'addSalaryDay': '0'
            });
          }
        }
    
        // Sort the array by date directly in the main code
        concludeRecord.sort((a, b) => {
          const dateA = new Date(a.day.split('/').reverse().join('/'));
          const dateB = new Date(b.day.split('/').reverse().join('/'));
          return dateA - dateB;
        });
    
    
    //=========


    const searchData = {
      employeeId: employeeId || '',
      month: month || '',
      timerecordId: year || ''
    };

    const response = await axios.post(sURL + '/timerecord/searchemp', searchData);
    // console.log(JSON.stringify( response.data, null,2) );
    const data = await response.data;
    // console.log(JSON.stringify( data.recordworkplace) );

    if(data.recordworkplace.length !== 0) {
      const wCalList = [];

      //check employee working in multi workplace
      const wGroup = await groupByWorkplaceId(data.recordworkplace[0].employee_workplaceRecord);
      // await console.log('wGroup  :' + JSON.stringify(wGroup,2,null));
      // await console.log('count :' + Object.keys(wGroup).length);

      //get workplaceId in first employee_workplaceRecord
      // let wpId = data.recordworkplace[0].employee_workplaceRecord[0].workplaceId;
      let wpId = await dataEmp.employees[0].workplace || '';
      let salary = await dataEmp.employees[0].salary || 0;
      let temSalary = await dataEmp.employees[0].salary || 0;

      if(parseFloat(salary ) >= 1660) {
        salary  = parseFloat(salary) / 30;
        temSalary = parseFloat(salary) / 30;
      }
      console.log('s1 ' + salary);

      //check up Salary and up Salary
//check data with workplace 

//check up Salary with month and year
if((month == upSalary_month ) && (year == upSalary_year ) ) {
  salary  = await parseFloat(salary)   + parseFloat(upsalary  || '9');
  temSalary = await parseFloat(temSalary )  + salary   + parseFloat(upsalary  || '9');
}

      // console.log('wGroup X ' + JSON.stringify(wGroup    ,2,null))
      // console.log('wGroup X ' + Object.keys(wGroup).length)
      // if (wGroup) {
      const keys = await Object.keys(wGroup);
      // console.log('wGroup keys:', keys); // Log the keys of wGroup
      // console.log('wGroup keys length:', keys.length); // Log the length of the keys

      if (keys.length > 1 && dataEmp.employees[0].workplace  !== '10105') {
        console.log('process 2');

        for (const workplaceId of Object.keys(wGroup)) {
          const group = wGroup[workplaceId];
          // console.log(`Workplace ID: ${group.workplaceId}, Workplace Name: ${group.workplaceName}`);
          const wpDataCalculator = {
            month: month || '',
            year: year || '',
            workplaceId: group.workplaceId
          };

          try {
            const wpResponse = await axios.post(`${sURL}/workplace/caldata`, wpDataCalculator);
            wCalList.push({
              'workplaceId': group.workplaceId,
              'data': wpResponse.data
            });

            workplaceListTmp.push(group.workplaceId);
          } catch (error) {
            console.error(`Error processing workplace ID ${group.workplaceId}:`, error);
          }
        }

        // Do something with wCalList after all promises have been resolved
        // console.log('Workplace Calculation List:', wCalList);
        for (const element of data.recordworkplace[0].employee_workplaceRecord) {
          const tmp = {};

          const tmpWP = wCalList.find(item => item.workplaceId === element.workplaceId);
          // console.log('workRateOT : ' + JSON.stringify(tmpWP.data.workRateOT ,2 ,null) );

          // const workOfHour = await tmpWP.data.workOfHour || 0;
          // const workOfOT = await parseFloat(tmpWP.data.workOfOT) || 0;
          // const dayOff = tmpWP.data.workplaceDayOffList || [];
          // const specialDayOff = tmpWP.data.specialDaylist || [];

          const workOfHour = await (tmpWP?.data?.workOfHour) ?? 0;
          const workOfOT = await parseFloat(tmpWP?.data?.workOfOT) ?? 0;
          const workOfOT_subHour = parseFloat(tmpWP?.data?.workOfOT_subHour) ?? 0;
          const workOfOT_subMinute = await parseFloat(tmpWP?.data?.workOfOT_subMinute) ?? 0;
          const workOfOT_breakMinute = await parseFloat(tmpWP?.data?.workOfOT_breakMinute) ?? 0;
  
          const dayOff = await tmpWP?.data?.workplaceDayOffList ?? [];
          const specialDayOff = await tmpWP?.data?.specialDaylist ?? [];
          const dayOffCheck = [];

          if (dayOff.length !== 0) {
            dayOff.forEach(item => {
              let dateoffParts = item.split('-');
              let str2 = parseInt(dateoffParts[2], 10);
              dayOffCheck.push(str2);
            });
          }


          let dateParts = element.date.split('/');
          let str1 = parseInt(dateParts[0], 10);

          if (str1 > 0 && str1 <= 20) {
            
            // console.log('str1  : ' + str1 )
            // console.log('tmpWP.data.workRate ' + tmpWP.data.workRate);
            tmp.day = str1 + '/' + month + '/' + year;
            tmp.workplaceId = element.workplaceId || '';
            let parts = element.allTime.split('.');

            let hours = parseInt(parts[0], 10) || 0;
            let minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

            let scaledMinutes = (minutes * 100) / 60;
            let allTime = `${hours}.${scaledMinutes}` || 0;

            tmp.allTimes = `${hours}.${scaledMinutes}` || 0;

            let parts1 = element.otTime.split('.');

            let hours1 = parseInt(parts1[0], 10) || 0;
            let minutes1 = parts1.length > 1 ? parseInt(parts1[1], 10) : 0;

            // let scaledMinutes1 = (minutes1 * 100) / 60;
            // let otTime = parseFloat(`${hours1}.${scaledMinutes1}`).toFixed(2) || 0;
            let scaledMinutes1 = minutes1;
            let otTime = `${parseFloat(hours1 || 0)}.${parseFloat(scaledMinutes1 || 0 ) } `;
            if (element.specialtSalary !== '' || element.specialtSalaryOT !== '') {
              tmp.workRate = element.specialtSalary || '';
              tmp.workRateMultiply = Number(element.specialtSalary || 0) / Number(wpResponse.data.workRate || 0);

              tmp.otTimes = otTime || 0;

              tmp.workRateOT = element.specialtSalaryOT || '';
              tmp.workRateOTMultiply = Number(element.specialtSalaryOT || 0) / (Number(wpResponse.data.workRate || 0) / 8);
              tmp.workType = 'specialtSalary';

              sumWorkHour += parseFloat(allTime) || 0;
              sumWorkRate += parseFloat(element.specialtSalary) || 0;
              sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
              sumWorkRateOt += parseFloat(element.specialtSalaryOT) || 0;

            } else {
              if (specialDayOff.includes(Number(str1))) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(wpResponse.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(tmpWP.data.holidayHour) * (salary / 8)) * parseFloat(allTime)).toFixed(3);
                // console.log(' test ' + tmpWP.data.holidayHour + ' ' + specialDayOff);

                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = tmpWP.data.holiday || 0;

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0 ).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT 
                let workRateOT = ((parseFloat(tmpWP.data.holidayOT) * (salary / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp  )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || '';
                tmp.workRateOTMultiply = tmpWP.data.holidayOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'specialDayOff';

              } else if (dayOffCheck.includes(str1)) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(tmpWP.data.dayoffRateHour || 0) * (parseFloat(salary || 0) / 8)) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = tmpWP.data.dayoffRateHour || '';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = tmpWP.data.dayoffRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'dayOff';

              } else {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

// console.log('tmpWP.data.workRate ' + tmpWP.data.workRate + 'salary '+ salary);

                if (parseFloat(allTime || '0') >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(salary) / 8) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = '1';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0) .toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = (((parseFloat(salary || '0') / 8) * parseFloat(tmpWP.data.workRateOT)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + (parseFloat(minutesTmp || '0') )) / 60)  )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = tmpWP.data.workRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;
                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'workDay';

              }
            }
            tmp.addSalaryDay = '';
            tmp.shift = element.shift || 0;

            concludeRecord.push(tmp);

          } //
        } //end for
        // }
      } else {

        if(wpId !== '10105'){
          wpId = keys[0]
        }
      

        const wpDataCalculator = {
          month: month || '',
          year: year || '',
          workplaceId: wpId
        };


        const wpResponse = await axios.post(`${sURL}/workplace/caldata`, wpDataCalculator);
        const workOfHour = await wpResponse.data.workOfHour || 0;
        const workOfOT = await parseFloat(wpResponse.data.workOfOT) || 0;
        const workOfOT_subHour = await parseFloat(wpResponse.data.workOfOT_subHour) || 0;
        const workOfOT_subMinute = await parseFloat(wpResponse.data.workOfOT_subMinute) || 0;
        const workOfOT_breakMinute = await parseFloat(wpResponse.data.workOfOT_breakMinute ) || 0;

        const dayOff = wpResponse.data.workplaceDayOffList || [];
        const specialDayOff = wpResponse.data.specialDaylist || [];
        const dayOffCheck = [];

        if (dayOff.length !== 0) {
          dayOff.forEach(item => {
            let dateoffParts = item.split('-');
            let str2 = parseInt(dateoffParts[2], 10);
            dayOffCheck.push(str2);
          });
        }

        for (const element of data.recordworkplace[0].employee_workplaceRecord) {
          const tmp = {};

          let dateParts = element.date.split('/');
          let str1 = parseInt(dateParts[0], 10);
          // console.log('*str1 ' + str1);


          if (str1 > 0 && str1 <= 20) {
            tmp.day = str1 + '/' + month + '/' + year;
            tmp.workplaceId = element.workplaceId || '';
            let parts = element.allTime.split('.');

            let hours = parseInt(parts[0], 10) || 0;
            let minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

            let scaledMinutes = (minutes * 100) / 60;
            let allTime = `${hours}.${scaledMinutes}` || 0;

            tmp.allTimes = `${hours}.${scaledMinutes}` || 0;

            let parts1 = element.otTime.split('.');

            let hours1 = parseInt(parts1[0], 10) || 0;
            let minutes1 = parts1.length > 1 ? parseInt(parts1[1], 10) : 0;

            // let scaledMinutes1 = (minutes1 * 100) / 60;
            // let otTime = parseFloat(`${hours1}.${scaledMinutes1}`).toFixed(4) || 0;
            let scaledMinutes1 = minutes1;
            let otTime = `${parseFloat(hours1 || 0)}.${parseFloat(scaledMinutes1 || 0 ) } `;

            tmp.otTimes = otTime || '0';

            if (element.specialtSalary !== '' || element.specialtSalaryOT !== '') {
              tmp.workRate = element.specialtSalary || '';
              tmp.workRateMultiply = Number(element.specialtSalary || 0) / Number(wpResponse.data.workRate || 0);

              tmp.otTimes = otTime || 0;

              tmp.workRateOT = element.specialtSalaryOT || '';
              tmp.workRateOTMultiply = Number(element.specialtSalaryOT || 0) / (Number(wpResponse.data.workRate || 0) / 8);
              tmp.workType = 'specialtSalary';

              sumWorkHour += parseFloat(allTime) || 0;
              sumWorkRate += parseFloat(element.specialtSalary) || 0;
              sumWorkHourOt += parseFloat(otTime) || 0;
              sumWorkRateOt += parseFloat(element.specialtSalaryOT) || 0;

            } else {
              if (specialDayOff.includes(Number(str1))) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(tmpWP.data.holidayHour) * (salary / 8)) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = wpResponse.data.holidayHour || 0;

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(wpResponse.data.holidayOT) * (parseFloat(salary || '0') / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60)  )) ).toFixed(3);
                tmp.workRateOT = workRateOT || '';
                tmp.workRateOTMultiply = wpResponse.data.holidayOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;
                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'specialDayOff';

              } else if (dayOffCheck.includes(str1)) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (allTime >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(wpResponse.data.dayoffRateHour || 0) * (parseFloat(salary || 0) / 8)) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = wpResponse.data.dayoffRateHour || '';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = ((parseFloat(wpResponse.data.dayoffRateOT) * (parseFloat(salary || '0') / 8)) * (parseFloat( (((hoursTmp * 60) + (minutesTmp )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = wpResponse.data.dayoffRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'dayOff';

              } else {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(tmpWP.data.workRate || '0') + parseFloat(upsalary   || '0');
                }

                if (parseFloat(allTime || '0') >= workOfHour) {
                  allTime = workOfHour;
                  tmp.allTimes = workOfHour || 0;
                } else {
                  tmp.allTimes = allTime || 0;
                }

                let workRate = ((parseFloat(salary || '0') / 8) * parseFloat(allTime)).toFixed(3);
                tmp.workRate = workRate || 0;
                tmp.workRateMultiply = '1';

                if (otTime >= workOfOT) {
                  otTime = workOfOT;
                                    // tmp.otTimes = workOfOT || 0;

                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;
                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0).toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = (((parseFloat(salary || '0') / 8) * parseFloat(wpResponse.data.workRateOT)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + (parseFloat(minutesTmp || '0') )) / 60) )) ).toFixed(3);
                tmp.workRateOT = workRateOT || 0;
                tmp.workRateOTMultiply = wpResponse.data.workRateOT || 0;

                sumWorkHour += parseFloat(allTime) || 0;
                sumWorkRate += parseFloat(workRate) || 0;
                sumWorkHourOt += parseFloat((parseFloat(hoursTmp + decimalFraction))) || 0;
                sumWorkRateOt += parseFloat(workRateOT) || 0;

                if(dataEmp.employees[0].salary && parseFloat(dataEmp.employees[0].salary) > 0 ) {

                } else {
                  salary = 0;
                }

                workRate = 0;
                workRateOT = 0;
                tmp.workType = 'workDay';

              }
            }
            tmp.addSalaryDay = '';
            tmp.shift = element.shift || 0;

            concludeRecord.push(tmp);
          }
        }
      }

    }




    // Check day is null and place data for days 1 to 20 of the current month
    for (let i = 1; i <= 20; i++) {
      let d = i + '/' + month + '/' + year;
      let x = concludeRecord.some(record => record.day === d);

      if (!x) {
        concludeRecord.push({
          'day': d,
          'workplaceId': '',
          'allTimes': '0',
          'workRate': '0',
          'otTimes': '0',
          'workRateOT': '0',
          'addSalaryDay': '0'
        });
      }
    }


    
    // Sort the array by date directly in the main code
    concludeRecord.sort((a, b) => {
      const dateA = new Date(a.day.split('/').reverse().join('/'));
      const dateB = new Date(b.day.split('/').reverse().join('/'));
      return dateA - dateB;
    });


    // console.log('Sorted concludeRecord:', concludeRecord);

    dataConclude.concludeRecord = concludeRecord|| [];

    // console.log('workplaceListTmp ' + workplaceListTmp);

    const sendData = await {
      wIdList: workplaceListTmp 
    }
    const responseWpList = await axios.post(sURL + '/workplace/getaddsalary', sendData );
    // await console.log('add salary = ' + JSON.stringify( responseWpList .data ));
    // await console.log('add salary = ' + responseWpList .data.ans.length );

    for (let c = 0; c < concludeRecord.length; c++) {
      // console.log('concludeRecord ' + concludeRecord [c].workplaceId);

      
      if(parseFloat(concludeRecord [c].workRateMultiply || 0) <= 1) {
      if(responseWpList .data.ans && concludeRecord [c].workplaceId !== '10105' && dataEmp.employees[0].workplace  !== '30001') {
        // console.log('*wid : ' + concludeRecord [c].workplaceId  + 'workplace: ' + dataEmp.employees[0].workplace  )
      const testx = responseWpList .data.ans.find(item  => item.workplaceId == concludeRecord [c].workplaceId)
if(testx ) {
  // console.log('testx ' + JSON.stringify(testx.addSalary,null,2) )
  await addSalaryList.push(testx.addSalary );
} else {
  await addSalaryList.push(addSalaryDaily);
}

} else {

  // remove 1012 when shift is morning_shift
if(concludeRecord [c].shift === 'morning_shift') {
let addSalaryDailyx = await addSalaryDaily.filter(item1 => item1.id !== '1210');
  await addSalaryList.push(addSalaryDailyx);
  // console.log(JSON.stringify(addSalaryDailyx) )
} else {
  await addSalaryList.push(addSalaryDaily);
  // console.log('*any xxx ' + concludeRecord [c].shift + ' ' + JSON.stringify(addSalaryDaily,null,2) );
}

}

      } else{
        console.log(concludeRecord [c].day + 'workRateMultiply ' + parseFloat(concludeRecord [c].workRateMultiply) )
        await addSalaryList.push([]);

      }

      // await addSalaryList.push(addSalaryDaily);
    }
    
    dataConclude.addSalary = await addSalaryList;

    dataConclude.sumWorkHour = sumWorkHour || 0;
    dataConclude.sumWorkRate = sumWorkRate || 0;
    dataConclude.sumWorkHourOt = sumWorkHourOt || 0;
    dataConclude.sumWorkRateOt = sumWorkRateOt || 0;

    try {
      // Delete all documents matching the year, month, and employeeId
      const result = await conclude.deleteMany({
        year: dataConclude.year,
        month: dataConclude.month,
        employeeId: dataConclude.employeeId
      });

      if (result.deletedCount > 0) {
        // res.status(200).send(`${result.deletedCount} record(s) deleted`);
        console.log('Existing record deleted' + result.deletedCount);
      } else {
        // res.status(404).send('No matching records found');
      }
      // Find the existing document by year, month, and employeeId
      // const existingRecord = await conclude.findOne({
      //   year: dataConclude.year,
      //   month: dataConclude.month,
      //   employeeId: dataConclude.employeeId
      // });

      // If an existing record is found, delete it
      // if (existingRecord) {
      //   await conclude.deleteOne({
      //     _id: existingRecord._id
      //   });
      //   console.log('Existing record deleted');
      // }

      if (concludeRecord.length !== 0) {

        //check emty new record
        if (data1.recordworkplace.length !== 0 || data.recordworkplace.length !== 0) {

          // Create a new Conclude document
          const newConclude = new conclude(dataConclude);

          // Save the new document to the database
          const savedConclude = await newConclude.save();
          // console.log('New record saved successfully:', savedConclude);
        }

            
        await res.json(dataConclude);
      }
      // res.json(dataConclude);

    } catch (error) {
      console.error('Error processing record:', error);
    }

    // res.json(dataConclude);

    // await   console.log('Employee Time Record:', data[0].month);
  } catch (e) {
    console.log(e);
  }

  const concludeData = await conclude.find();
  // res.json(concludeData );
});


router.get('/getWeekendDates', async (req, res) => {
  const { yyyy, mm, workplaceId } = req.query;

  if (!yyyy || !mm || !workplaceId) {
    return res.status(400).json({ error: 'Missing required query parameters: yyyy, mm, workplaceId' });
  }

  try {
    const workplace = await Workplace.findOne({ workplaceId });
    if (!workplace) {
      return res.status(404).json({ error: 'Workplace not found' });
    }

    const daysOff = workplace.daysOff || [];
    const grouped = getWeekendDatesGrouped(yyyy, mm, daysOff);

    res.json(grouped);
  } catch (error) {
    console.error('❌ Error in /getWeekendDates:', error);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});

function getWeekendDatesGrouped(yyyy, mm, daysOff = []) {
  const year = Number(yyyy);
  const month = Number(mm);

  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  const startDate = new Date(prevYear, prevMonth - 1, 21);
  const endDate = new Date(year, month - 1, 20);

  const weekendSet = new Set();
  const dayOffSet = new Set();

  // สร้าง Set ของวันหยุดพิเศษ (ในช่วงเวลาเท่านั้น)
  for (const item of daysOff) {
    const d = new Date(item);
    if (d >= startDate && d <= endDate) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dayOffSet.add(`${yyyy}-${mm}-${dd}`);
    }
  }

  // ตรวจสอบวันเสาร์-อาทิตย์ในช่วงเวลา
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 = อาทิตย์, 6 = เสาร์
    if (day === 0 || day === 6) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekendSet.add(`${yyyy}-${mm}-${dd}`);
    }
  }

  // แยกกลุ่ม
  const weekendOnly = [];
  const dayOffOnly = [];
  const weekendAndDayOff = [];

  const allDates = new Set([...weekendSet, ...dayOffSet]);
  for (const date of allDates) {
    const isWeekend = weekendSet.has(date);
    const isDayOff = dayOffSet.has(date);

    if (isWeekend && isDayOff) {
      weekendAndDayOff.push(date);
    } else if (isWeekend) {
      weekendOnly.push(date);
    } else if (isDayOff) {
      dayOffOnly.push(date);
    }
  }

  // เรียงลำดับทั้งหมดก่อนคืนค่า
  return {
    weekendOnly: weekendOnly.sort(),
    dayOffOnly: dayOffOnly.sort(),
    weekendAndDayOff: weekendAndDayOff.sort(),
  };
}

// Get list of conclude 
router.get('/list', async (req, res) => {

  const concludeData = await conclude.find();
  res.json(concludeData);
});


router.get('/concludedelete', async (req, res) => {
  const { year, month, employeeId } = req.query;

  if (!year || !month || !employeeId) {
    return res.status(400).send({ message: 'year, month, and employeeId are required.' });
  }

  try {
    // Delete documents based on the provided year, month, and employeeId
    const result = await conclude.deleteMany({ year, month, employeeId });

    // Fetch the remaining documents to send back in the response
    const remainingData = await conclude.find();

    res.json({
      message: `${result.deletedCount} document(s) were deleted.`,
      remainingData
    });
  } catch (err) {
    console.error('Error deleting documents:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/listdelete', async (req, res) => {

  try {
    // const concludeData = await conclude.find();
    await conclude.deleteMany();
    const concludeData = await conclude.find();

    res.json(concludeData);

    // const concludeData = await Conclude.find();

    // Delete all documents in the collection
    // await Conclude.deleteMany();

    // Respond with the fetched data
    // res.json(concludeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get  conclude record by conclude Id
router.get('/:month/:employeeId', async (req, res) => {
  try {
    const concludeData = await conclude.findOne({
      employeeId: req.params.employeeId,
      month: req.params.month
    });

    if (concludeData) {
      res.json(concludeData);
    } else {
      res.status(404).json({ error: 'workplace not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});
// Get  conclude record by conclude month
router.get('/:month', async (req, res) => {
  try {
    const concludeData = await conclude.findOne({
      month: req.params.month
    });

    if (concludeData) {
      res.json(concludeData);
    } else {
      res.status(404).json({ error: 'workplace not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});


// Get conclude record by conclude Id
router.post('/search', async (req, res) => {
  try {
    const {
      year,
      month,
      concludeDate,
      employeeId
    } = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId && employeeId !== '') {
      query.employeeId = employeeId;
    }

    if (year && year !== '') {
      query.year = year;
    }

    if (month && month !== '') {
      query.month = month;
    }

    if (concludeDate && concludeDate !== '') {
      query.concludeDate = concludeDate;
    }

    // Log the constructed query for debugging
    console.log('Constructed Query:', query);

    if (!year && !month && !employeeId && !concludeDate) {
      console.log('Empty query parameters, returning empty response');
      return res.status(200).json({});
    }

    // Query the conclude collection for matching documents
    const recordConclude = await conclude.find(query);

    // Log the search results
    console.log('Search Results:', recordConclude);

    res.status(200).json({ recordConclude });
  } catch (error) {
    console.error('Error occurred during search:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// // Get  conclude record by conclude Id
// router.post('/search', async (req, res) => {
//   try {
//     const { 
//       year,
//       month,
//       concludeDate,
//       employeeId } = req.body;

//     // Construct the search query based on the provided parameters
//     const query = {};

//     if (employeeId !== '') {
//       query.employeeId = employeeId ;
//     }

//     if (year !== '') {
//       query.year = year;
//       // query.year= { $regex: new RegExp(workplaceName, 'i') };
//     }

//     if (month !== '') {
//       query.month = month;
//     }
//     if (concludeDate !== '') {
//       query.concludeDate = concludeDate;
//     }

// // console.log('query.date ' + query.date);
//     // console.log('Constructed Query:');
//     // console.log(query);

//     if (month== '' && year == '' && employeeId== '' && concludeDate == '') {
//       res.status(200).json({});
//     }

//     // Query the workplace collection for matching documents
//     const recordConclude  = await conclude.find(query);

//     // await console.log('Search Results:');
//     // await console.log(recordworkplace  );
//     let textSearch = 'conclude';
//     // await res.status(200).json({ recordConclude  });
//     return res.status(200).json({});
//   } catch (error) {
//     console.error(error);
//     // res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Create new conclude
router.post('/create', async (req, res) => {
  const {
    year,
    month,
    concludeDate,
    employeeId,
    createBy,
    sumWorkHour,
    sumWorkRate,
    sumWorkHourOt,
    sumWorkRateOt,
    concludeRecord,
    addSalary } = req.body;


  try {
    //create conclude record
    const recordConclude = new conclude({
      year,
      month,
      concludeDate,
      employeeId,
      concludeRecord,
      addSalary,
      createBy,
      sumWorkHour,
      sumWorkRate,
      sumWorkHourOt,
      sumWorkRateOt
    });

    const ans = await recordConclude.save();
    if (ans) {
      console.log('Create workplace time record success');
    }

    res.json(recordConclude);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// Update existing records in workplaceTimerecordEmp
router.put('/update/:concludeRecordId', async (req, res) => {
  const concludeIdToUpdate = req.params.concludeRecordId;
  const updateFields = req.body;

  try {
    // Find the resource by ID and update it
    const updatedResource = await conclude.findByIdAndUpdate(
      concludeIdToUpdate,
      updateFields,
      { new: true } // To get the updated document as the result
    );
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }


    // Send the updated resource as the response
    res.json(updatedResource);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/delete-records', async (req, res) => {
  const dataConclude = req.body;

  try {
    // Delete all documents matching the year, month, and employeeId
    const result = await conclude.deleteMany({
      year: dataConclude.year,
      month: dataConclude.month,
      employeeId: dataConclude.employeeId
    });

    if (result.deletedCount > 0) {
      res.status(200).send(`${result.deletedCount} record(s) deleted`);
    } else {
      res.status(404).send('No matching records found');
    }
  } catch (error) {
    res.status(500).send('Error deleting records: ' + error.message);
  }
});



function groupByWorkplaceId(records) {
  return records.reduce((acc, record) => {
    const { workplaceId, workplaceName } = record;

    if (!acc[workplaceId]) {
      acc[workplaceId] = {
        workplaceId,
        workplaceName,
        // records: []
      };
    }
    // acc[workplaceId].records.push(record);
    return acc;
  }, {});
}



//========== latest code


function getWeekendDates(yyyy, mm, daysOff = []) {
  const year = Number(yyyy);
  const month = Number(mm);

  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  const startDate = new Date(prevYear, prevMonth - 1, 21);
  const endDate = new Date(year, month - 1, 20);

  const resultMap = new Map(); // ใช้ Map เพื่อเก็บวันไม่ซ้ำและระบุประเภท

  // ✅ สร้าง Set ของ daysOff ที่แปลงเป็น yyyy-mm-dd แล้ว
  const daysOffSet = new Set(
    daysOff
      .map(d => {
        const date = new Date(d);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
      })
      .filter(dateStr => {
        const d = new Date(dateStr);
        return d >= startDate && d <= endDate;
      })
  );

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dd}`;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isDayOff = daysOffSet.has(dateStr);

    if (isWeekend && isDayOff) {
      resultMap.set(dateStr, 'weekend+dayOff');
    } else if (isWeekend) {
      resultMap.set(dateStr, 'weekend');
    } else if (isDayOff) {
      resultMap.set(dateStr, 'dayOff');
    }
  }

  // แปลงเป็น array
  return Array.from(resultMap.entries()).map(([date, type]) => ({
    date,
    type
  })).sort((a, b) => a.date.localeCompare(b.date));
}

const checkdayType = (startText , endText , dayNumber ) => {
const dayList = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
const start = dayList.indexOf(startText);
const end = dayList.indexOf(endText);
// console.log(start , end , dayNumber)

if((start == end) && (end == dayNumber) ) {
return true;
} else {
  if((start <= dayNumber )  && (dayNumber <= end)) {
    return true;
  } else 
  if(((0 <= dayNumber) &&   (dayNumber <= start)) && ((end <= dayNumber) && (dayNumber <= 6)) ) {
    // return true;
  } else {
    return false;
  }
}

}

const createBangkokDate = (yyyyMMdd) => {
  // สร้าง Date โดยระบุว่าเป็นเวลาเที่ยงคืนของไทย
  const [year, month, day] = yyyyMMdd.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // ใช้ UTC เพื่อความแม่นยำ แล้วค่อยแปลง
};

const toBangkokDate = (input) => {
  const utcDate = new Date(input);
  const utcTime = utcDate.getTime();
  const bangkokOffset = 7 * 60 * 60 * 1000; // UTC+7 in milliseconds

  // Add the Bangkok offset to the UTC time
  const bangkokTime = utcTime + bangkokOffset;

  // Convert to a Date object and extract the date in Bangkok time
  const bangkokDateObj = new Date(bangkokTime);
  const y = bangkokDateObj.getUTCFullYear();
  const m = String(bangkokDateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(bangkokDateObj.getUTCDate()).padStart(2, '0');

  // Return a string in yyyy-mm-dd format
  return `${y}-${m}-${d}`;
};



const checkDayRate = async (workplaceId, wGroup, date, dayNumber, customWorkplace = null) => {
  //data for cal
  let dataCal = {};

  // Construct the search query based on the provided parameters
  let query = {};
  if (workplaceId !== '') {
    query.workplaceId = workplaceId;
  }
  if (wGroup !== '') {
    query.wGroup = wGroup;
  }

  let workplaces = [];

  // ✅ ถ้า customWorkplace ถูกส่งมาและไม่ว่าง → ใช้แทนการ query
  if (customWorkplace && Object.keys(customWorkplace).length > 0) {
    workplaces = [customWorkplace];
  } else {
    workplaces = await Workplace.find(query);
  }

  if(workplaces.length > 0) {
    dataCal.workRate = await parseFloat(workplaces?.[0]?.workRate || '0') / 8 || 0;
    dataCal.worktTime = await parseFloat(workplaces?.[0]?.workOfHour_subHour || '0') + parseFloat(workplaces?.[0]?.workOfHour_subMinute || '0');
    dataCal.workRateOT = await workplaces?.[0]?.workRateOT || 0;
    let tmp_OT = await (parseFloat(workplaces?.[0]?.workOfOT_subHour || '0')* 60 + parseFloat(workplaces?.[0]?.workOfOT_subMinute || '0')) -
    (parseFloat(workplaces?.[0]?.workOfOT_breakHour || '0')* 60 + parseFloat(workplaces?.[0]?.workOfOT_breakMinute || '0'));

    dataCal.worktTimeOT = await Math.floor(tmp_OT / 60) + tmp_OT % 60;
    dataCal.worktTimeStartOT = await parseFloat(workplaces?.[0]?.startWorkOfOT_subHour || '0') + parseFloat(workplaces?.[0]?.startWorkOfOT_subMinute || '0');

    dataCal.dayoffRateHour = await workplaces?.[0]?.dayoffRateHour || 1;
    dataCal.dayoffRateOT = await workplaces?.[0]?.dayoffRateOT || 1;
    dataCal.holidayHour= await workplaces?.[0]?.holidayHour|| 1;
    dataCal.holidayOT = await workplaces?.[0]?.holidayOT || 1;

    // Check against getWeekendDates API
    try {
      const dateStr = date; // date is already in YYYY-MM-DD format
      const [year, monthWithZero, day] = dateStr.split('-');
      const month = parseInt(monthWithZero, 10); // ลบศูนย์นำหน้า
      const dayOfMonth = parseInt(day, 10);
      
      // คำนวณเดือนและปีสำหรับการเรียก API ตามกฎการจ่ายเงินเดือน
      // - วันที่ 21-31: ต้องดึงข้อมูลของเดือนถัดไป
      // - วันที่ 1-20: ต้องดึงข้อมูลของเดือนปัจจุบัน
      let payrollMonth, payrollYear;
      
      if (dayOfMonth >= 21) {
        // วันที่ 21-31 จะอยู่ในรอบเงินเดือนของเดือนถัดไป
        if (month === 12) {
          payrollMonth = 1;
          payrollYear = parseInt(year) + 1;
        } else {
          payrollMonth = month + 1;
          payrollYear = parseInt(year);
        }
      } else {
        // วันที่ 1-20 จะอยู่ในรอบเงินเดือนของเดือนนั้นๆ
        payrollMonth = month;
        payrollYear = parseInt(year);
      }
      
      // แปลงกลับเป็น string สำหรับเรียก API
      const apiMonth = payrollMonth.toString();
      const apiYear = payrollYear.toString();
      
      // เรียก API โดยส่งค่า year และ month ตามรอบเงินเดือน
      const apiUrl = `http://10.10.110.7:3000/conclude/getWeekendDates?yyyy=${apiYear}&mm=${apiMonth}&workplaceId=${workplaceId}`;
      console.log(`🔍 เรียก API รอบเงินเดือน: ${apiUrl}`);
      console.log(`📅 วันที่ ${dayOfMonth} เดือน ${month} ปี ${year} อยู่ในรอบเงินเดือนเดือน ${payrollMonth} ปี ${payrollYear}`);
      
      const weekendResponse = await axios.get(apiUrl);
      const weekendData = weekendResponse.data;
      
      // แสดงข้อมูลเพื่อตรวจสอบ
      console.log(`📅 วันที่ต้องการตรวจสอบ: ${dateStr} (รูปแบบ: YYYY-MM-DD)`);
      
      if (weekendData.dayOffOnly && weekendData.dayOffOnly.length > 0) {
        console.log(`📅 วันแรกใน dayOffOnly: ${weekendData.dayOffOnly[0]}`);
        
        // ตรวจสอบว่าวันที่อยู่ใน dayOffOnly หรือไม่
        if (weekendData.dayOffOnly.includes(dateStr)) {
          console.log(`✅ พบวันที่ ${dateStr} ใน dayOffOnly`);
          dataCal.dayType = 'stop';
          return dataCal;
        }
      }
      
      if (weekendData.weekendAndDayOff && weekendData.weekendAndDayOff.length > 0) {
        console.log(`📅 วันแรกใน weekendAndDayOff: ${weekendData.weekendAndDayOff[0]}`);
        
        // ตรวจสอบว่าวันที่อยู่ใน weekendAndDayOff หรือไม่
        if (weekendData.weekendAndDayOff.includes(dateStr)) {
          console.log(`✅ พบวันที่ ${dateStr} ใน weekendAndDayOff`);
          dataCal.dayType = 'stop';
          return dataCal;
        }
      }
      
      console.log(`❌ ไม่พบวันที่ ${dateStr} ในรายการวันหยุดพิเศษ`);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก API วันหยุด:', error.message);
      // ดำเนินการต่อหากการเรียก API ล้มเหลว
    }

    const [y, m, d] = date.split('-').map(Number);
    let paddedMonth = String(m - 1).padStart(2, '0');  
    let paddedDay = String(d).padStart(2, '0');  

    let dateString = y + '-' + paddedMonth + '-' + paddedDay + 'T00:00:00';

    let dateObj = await new Date(dateString);
    let dayNumberx = await dateObj.getDay(); // 0 = อาทิตย์, ..., 6 = เสาร์
    let dateOfMonth = await dateObj.getDate(); // 1 - 31

    // Check for special day off
    let isDayOff = false;
    for(let itemDay of workplaces?.[0]?.daysOff || []) {
      if(toBangkokDate(itemDay) === dateString) {
        console.log('special day off ' + toBangkokDate(itemDay) + ' = ' + date);
        isDayOff = true;
        break;  
      }
    }

    if(isDayOff == true) {
      dataCal.dayType = await 'specialDayOff';
    } else {
      // Check day type
      for(const workTimeDay of workplaces[0].workTimeDay) {
        let check = await checkdayType(workTimeDay.startDay, workTimeDay.endDay, dayNumberx);

        if(check === true) {
          dataCal.dayType = await workTimeDay.workOrStop;
          break;
        } else {
          dataCal.dayType = 'work';
        }
      }
    }
  }
  
  return dataCal;
}

// Helper function to determine date format
function determineFormat(dateString) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return 'YYYY-MM-DD';
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return 'DD-MM-YYYY';
  } else {
    return 'unknown format';
  }
}


//get employee profile
const getEmployeeProfile = async (employeeId) => {
  try {
    const query = {};
    if (employeeId) {
      query.employeeId = employeeId;
    }

        // Query the employee collection for matching documents
        const employees = await Employee.find(query);

        if(employees ) {
          return employees ;
        } else {
          return null;
        }

  } catch (error) {
    console.error(error);
  }

}

const calculateCashValues = async (employeeId, employee_record, month, year) => {
  const employeeProfile = await getEmployeeProfile(employeeId);
const salaryTmp = parseFloat(employeeProfile[0].salary || '0') || 0;
let addSalary = employeeProfile?.[0]?.addSalary || [];
let salary = 0;

if(parseFloat(salaryTmp || '0')  > 1660) {
  salary = await ((parseFloat(salaryTmp || '0') / 30)/ 8).toFixed(3);
} else {
  salary = await (parseFloat(salaryTmp || '0')/ 8).toFixed(3);
}

  return Promise.all(
    employee_record.map(async (record) => {
if((record.date >= 21 && record.date <= 31) && month == 1) {
year = year -1;
month = 12;
}

//check workplace 10105
// console.log('employee workplace' + employeeProfile[0].workplace);
const workplaceId = employeeProfile[0].workplace === "10105" ? "10105" : record.workplaceId;

      // const dataRate = await checkDayRate(workplaceId,  record.wGroup, new Date(year, month - 1, record.date));
// const rawDate = new Date(year, month - 1, record.date); // สร้างวันที่จากปี/เดือน/วัน
// const bangkokDate = toBangkokDate(rawDate); // ปรับให้ตรงกับเวลาไทย
// const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate , record.date );

let rawDate;
if (record.date > 20) {
  rawDate = new Date(year, month - 1, record.date); // เดือนเริ่มที่ 0
} else {
  rawDate = new Date(year, month - 1, record.date); // เดือนเริ่มที่ 0 เช่นกัน
}
const bangkokDate = toBangkokDate(rawDate);
// const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate, record.date);
const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate, record.date , 
  employeeProfile?.[0]?.customWorkplace);

// test
// if(record.date == 30 || record.date == 20 ) {
//   console.log(record.date + ' ' + dataRate?.dayType )
//   console.log('bangkokDate  ' + bangkokDate )
//   console.log('rawDate  ' + rawDate )
// }

// console.log(record.date );
// console.log(employeeId + JSON.stringify(employeeProfile[0].salary,null,2))
// console.log('add salary' + JSON.stringify(addSalary,null,2) );


      let cashBeforeOt = 0;
      let cashWork = 0;
      let cashOt = 0;
      let cashBeforeOtMul = 0;
      let cashWorkMul = 0;
      let cashOtMul = 0;
      let dayType = '';
let addSalaryDaily = [];

                //check salary custom with profile or use with workplace
                if(salaryTmp !== 0 ) {
                  // salary = parseFloat(salary || '0') / 8;
                  // console.log(salary)
                            } else {
                              if(dataRate?.workRate ){
                              salary = parseFloat(dataRate.workRate || '0');
                            } else {
                              salary = 0;
                            }
                            }
                  
      //check dayType
        if (dataRate?.dayType !== '') {
        if (dataRate?.dayType === 'stop') {
          cashBeforeOt = await (
  parseFloat(dataRate?.dayoffRateOT || '0') > 5
    ? parseFloat(dataRate?.dayoffRateOT || '0') || 0
    : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.dayoffRateOT || '0')) * salary || 0)) || 0
);

cashOt = await (
  parseFloat(dataRate?.dayoffRateOT || '0') > 5
    ? parseFloat(dataRate?.dayoffRateOT || '0') || 0
    : ((record.totalOtTime || 0) * ((parseFloat(dataRate?.dayoffRateOT || '0')) * salary || 0)) || 0
);

        //  cashBeforeOt = await ((record.beforeTotalOtTime || 0) * (parseFloat(dataRate?.dayoffRateOT || '0') * salary || 0)) || 0;
         cashWork = await (record.totalTime || 0) * (parseFloat(salary || '0') * parseFloat(dataRate?.dayoffRateHour || '0')) || 0;
        //  cashOt = await (record.totalOtTime || 0) * (parseFloat(dataRate?.dayoffRateOT || '0') * salary ) || 0;
         dayType = await dataRate?.dayType || 0;
          cashBeforeOtMul = dataRate?.dayoffRateOT ||  0;
          cashWorkMul = dataRate?.dayoffRateHour || 0;
          cashOtMul = dataRate?.dayoffRateOT || 0;
          addSalaryDaily  = [];
    }else 
    if(dataRate?.dayType === 'specialDayOff') {
      cashBeforeOt = await (
  parseFloat(dataRate?.holidayOT || '0') > 5
    ? parseFloat(dataRate?.holidayOT || '0') || 0
    : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.holidayOT || '0')) * salary || 0)) || 0
);

cashOt = await (
  parseFloat(dataRate?.holidayOT || '0') > 5
    ? parseFloat(dataRate?.holidayOT || '0') || 0
    : ((record.totalOtTime || 0) * ((parseFloat(dataRate?.holidayOT || '0')) * salary || 0)) || 0
);

      // cashBeforeOt = await ((record.beforeTotalOtTime || 0) * (parseFloat(dataRate?.holidayOT || '0') * salary  || 0)) || 0;
      cashWork = await (parseFloat(record.totalTime || 0) * parseFloat(salary || 0) * parseFloat(dataRate?.holidayHour || 1)) || 0;
      console.log('totalTime ' + parseFloat(record.totalTime || 0) + ' salary ' +   parseFloat(salary || 0) + ' dataRate ' + parseFloat(dataRate?.holidayHour || 1)) 
      // cashOt = await (record.totalOtTime || 0) * (parseFloat(dataRate?.holidayOT || '0') * salary ) || 0;
      dayType = await dataRate?.dayType || 0;
       cashBeforeOtMul = dataRate?.holidayOT ||  0;
       cashWorkMul = dataRate?.holiday || 0;
       cashOtMul = dataRate?.holidayOT || 0;
       addSalaryDaily  = [];
    } else {

      if(dataRate?.dayType === "work") {
        cashBeforeOt = await (
  parseFloat(dataRate?.workRateOT || '0') > 5
    ? parseFloat(dataRate?.workRateOT || '0') || 0
    : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.workRateOT || '0')) * salary || 0)) || 0
);

cashOt = await (
  parseFloat(dataRate?.workRateOT || '0') > 5
    ? parseFloat(dataRate?.workRateOT || '0') || 0
    : ((record.totalOtTime || 0) * ((parseFloat(dataRate?.workRateOT || '0')) * salary || 0)) || 0
);

      //  cashBeforeOt = await (record.beforeTotalOtTime || 0) * (parseFloat(dataRate?.workRateOT || '0') * salary ) || 0;
       cashWork = await (record.totalTime || 0) * salary;
      //  cashOt = await (record.totalOtTime || 0) * (parseFloat(dataRate?.workRateOT || '0') * salary ) || 0;
       dayType = await dataRate?.dayType || '';
       cashBeforeOtMul = await dataRate?.workRateOT ||  0;
       cashWorkMul = 1;
       cashOtMul = await dataRate?.workRateOT || 0;
      //  addSalaryDaily = [...(employeeProfile[0].addSalary || [])];
      // addSalaryDaily = [...(employeeProfile[0].addSalary || []).filter(salary => salary.roundOfSalary === "daily")];
      addSalaryDaily  = [];
      addSalaryDaily = [...(employeeProfile[0].addSalary || [])
      .filter(salary => salary.roundOfSalary === "daily")
      .map(salary => ({
        ...salary,
        SpSalary: parseFloat(salary.SpSalary) > 100 ? (parseFloat(salary.SpSalary) / 30).toFixed(2) : salary.SpSalary
      }))
    ];
    
// console.log("addsalary " + JSON.stringify( employeeProfile[0].addSalary ,null,2));
  } else {
    cashBeforeOt = '';
    cashWork = '';
    cashOt = '';
    dayType = await dataRate?.dayType || '';
    cashBeforeOtMul = '';
    cashWorkMul = '';
    cashOtMul = '';
    addSalaryDaily = [];

  }
    }
    
  }

      return {
        ...record,
        cashBeforeOt,
        cashWork,
        cashOt,
        cashBeforeOtMul,
        cashWorkMul,
        cashOtMul,
        dayType ,
        addSalaryDaily,
      };
    })
  );

};


// Function to calculate cash values
const calculateCashValues_back = (employee_record, month, year ) => {

 return employee_record.map(async (record) => {
// console.log(record.workplaceId|| 0);
// console.log(record.wGroup || '');
// console.log(record.date || '');
// const dataRate = await checkDayRate(record.workplaceId, record.wGroup , new Date(year, month -1, record.date ));
const rawDate = new Date(year, month - 1, record.date); // สร้างวันที่จากปี/เดือน/วัน
const bangkokDate = toBangkokDate(rawDate); // ปรับให้ตรงกับเวลาไทย

// const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate , record.date );
const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate , record.date ,
  employeeProfile?.[0]?.customWorkplace );


// await console.log(JSON.stringify(dataRate ,null,2))

let cashBeforeOt = await (record.beforeTotalOtTime || 0) * parseFloat(dataRate.workRateOT || '0');
let cashWork = await (record.totalTime || 0) * parseFloat(dataRate.workRate || '0');
let cashOt = await (record.totalOtTime || 0) * parseFloat(dataRate.workRateOT || '0');

  return {
      ...record.toObject(), // Convert Mongoose document to plain object

      cashBeforeOt: cashBeforeOt ,
      cashWork: cashWork,
      cashOt: cashOt,
    };
    
  });
};

// Search timerecordEmployee
router.post('/searchtimerecordemployee', async (req, res) => {
  try {
    const { employeeId, month, year } = await req.body;
    const query = {};

    if (employeeId) {
      query.employeeId = await employeeId;
    }

    if (month) {
      query.month = await { $regex: new RegExp(month, 'i') };
    }

    if (year) {
      query.year = await { $regex: new RegExp(year, 'i') };
    }

    if (!employeeId && !month && !year) {
      return await res.status(200).json({});
    }

    // Query the collection
    const result = await timerecordEmployee.find(query);
// console.log("result  " , result[0].employee_record.length)
    // Check if any record has missing cash values
    // let updateNeeded = false;
    // for (const doc of result) {
    //   const updatedRecords = await calculateCashValues(doc.employee_record, month, year );
    //   if (JSON.stringify(updatedRecords) !== JSON.stringify(doc.employee_record)) {
    //     doc.employee_record = await updatedRecords;
    //     await doc.save(); // Save only if changes are made
    //     updateNeeded = true;
    //   }
    // }
    let updateNeeded = false;

    for (const doc of result) {
        // ข้ามเอกสารที่ status มีค่า (ไม่ว่าง)
  if (doc.status && doc.status.trim() !== "") {
    // console.log(`⏩ Skipping calculation for employeeId=${doc.employeeId} because status="${doc.status}"`);
    continue;
  }

      if (!doc || !Array.isArray(doc.employee_record) || doc.employee_record.length === 0) {
        console.warn(`Skipping invalid or empty document: ${JSON.stringify(doc)}`);
        continue;
      }
    
      // Debug: ดูค่า record แรกก่อนเรียก calculateCashValues
      // console.log("🚀 Checking first record:", JSON.stringify(doc.employee_record[0], null, 2));
    
      try {
        const updatedRecords = await calculateCashValues(employeeId, doc.employee_record, month, year);
        
        if (JSON.stringify(updatedRecords) !== JSON.stringify(doc.employee_record)) {
          doc.employee_record = updatedRecords;
          await doc.save();
          updateNeeded = true;
        }
      } catch (error) {
        console.error("❌ Error in calculateCashValues:", error);
      }
    }
    await res.status(200).json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update1/:id', async (req, res) => {
  try {
    const updated = await timerecordEmployee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // ให้คืนค่าหลังอัปเดต
    );

    if (!updated) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' });
    }

    res.status(200).json({ message: 'อัปเดตสำเร็จ', data: updated });
  } catch (err) {
    console.error('❌ PUT /conclude/update Error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});
module.exports = router;