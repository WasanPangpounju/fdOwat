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
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);

                //cal OT
                let workRateOT = (((parseFloat(salary) / 8) * parseFloat(tmpWP.data.workRateOT)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + parseFloat(minutesTmp || '0')) / 60) ))).toFixed(3);
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
            // let otTime = ((parseFloat(hours1 || 0) *60) + parseFloat(scaledMinutes1 || 0) /60).toFixed(2) || 0;
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
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0) .toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);
                // let workRateOT = ((parseFloat(wpResponse1.data.workRateOT ?? 0) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction)) ).toFixed(3);

                //cal OT
                let workRateOT = (((parseFloat(salary) / 8) * parseFloat(tmpWP.data.workRateOT)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + parseFloat(minutesTmp || '0')) / 60) ))).toFixed(3);
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
            // let otTime = ((parseFloat(hours1 || 0) *60) + parseFloat(scaledMinutes1 || 0) /60).toFixed(2) || 0;
            let otTime = `${parseFloat(hours1 || 0)}.${parseFloat(scaledMinutes1 || 0 ) } `;

            
            tmp.otTimes = `${hours1}.${scaledMinutes1}` || 0;


            if (element.specialtSalary !== '' || element.specialtSalaryOT !== '') {
              tmp.workRate = element.specialtSalary || '';
              tmp.workRateMultiply = Number(element.specialtSalary || 0) / Number(wpResponse.data.workRate || 0);

              tmp.workRateOT = element.specialtSalaryOT || '';
              tmp.workRateOTMultiply = Number(element.specialtSalaryOT || 0) / (Number(wpResponse.data.workRate || 0) / 8);
              tmp.workType = 'specialtSalary';

              sumWorkHour += parseFloat(allTime) || 0;
              sumWorkRate += parseFloat(element.specialtSalary) || 0;
              sumWorkHourOt += parseFloat(otTime) || 0;
              sumWorkRateOt += parseFloat(element.specialtSalaryOT) || 0;

            } else {
              if (specialDayOff1.includes(Number(str1))) {
                if (salary === 0 || salary == upsalary  ) {
                  salary = parseFloat(wpResponse.data.workRate || '0') + parseFloat(upsalary   || '0');
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
                  // tmp.otTimes = workOfOT || 0;
                  tmp.otTimes = Math.floor(((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)/ 60) + '.' + ((workOfOT_subHour *60 + workOfOT_subMinute) - workOfOT_breakMinute)% 60;

                } else {
                  tmp.otTimes = otTime || 0;
                }

                let [hoursTmp, minutesTmp] = otTime.toString().split('.').map(Number);
                let decimalFraction = (minutesTmp || 0) .toFixed(2) / 60;
                // let workRateOT = ((parseFloat(tmpWP.data.dayoffRateOT) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction))).toFixed(2);
                // let workRateOT = ((parseFloat(wpResponse1.data.workRateOT ?? 0) * (salary / 8)) * (parseFloat(hoursTmp + decimalFraction)) ).toFixed(3);

                //cal OT
                let workRateOT = (((parseFloat(salary) / 8) * parseFloat(tmpWP.data.workRateOT)) * (parseFloat( (((parseFloat(hoursTmp || '0') * 60) + parseFloat(minutesTmp || '0')) / 60) ))).toFixed(3);
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
    totalWorkDays = concludeRecord.filter(record => {
  return parseFloat(record.workRate || 0) > 0 || parseFloat(record.allTimes || 0) > 0;
}).length;

console.log(`📊 จำนวนวันที่มี totalTime: ${totalWorkDays} วัน`);

    dataConclude.concludeRecord = concludeRecord|| [];

    // console.log('workplaceListTmp ' + workplaceListTmp);

    const sendData = await {
      wIdList: workplaceListTmp 
    }
    const responseWpList = await axios.post(sURL + '/workplace/getaddsalary', sendData );
    // await console.log('add salary = ' + JSON.stringify( responseWpList .data ));
    // await console.log('add salary = ' + responseWpList .data.ans.length );

    // ในฟังก์ชัน /calsalaryemp หลังจากสร้าง concludeRecord เสร็จแล้ว
// ประมาณบรรทัด 1250-1300

// เพิ่มการตรวจสอบ workOfWeek ก่อน
let isSpecialWorkplace7Days = false;

try {
  const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId1}`);
  const workOfWeek = workplaceResponse.data.workOfWeek || "5";
  
  if (workOfWeek === "7") {
    isSpecialWorkplace7Days = true;
    console.log(`\n✅ หน่วยงานพิเศษ 7 วัน - จะคิดเงินเพิ่มรายวันทุกวันที่มี allTimes > 0`);
  }
} catch (error) {
  console.error(`❌ ไม่สามารถตรวจสอบ workOfWeek ได้:`, error.message);
}

// นับจำนวนวันจริงที่มา (totalTime) สำหรับหน่วยงานพิเศษ 7 วัน
let totalWorkDays = 0;
if (isSpecialWorkplace7Days) {
  totalWorkDays = concludeRecord.filter(record => parseFloat(record.allTimes || 0) > 0).length;
  console.log(`📊 หน่วยงานพิเศษ 7 วัน - จำนวนวันทำงานจริง: ${totalWorkDays} วัน`);
}


// เพิ่ม log สรุปจำนวนวันที่มี allTimes
console.log(`\n📊 === สรุป addSalaryList สำหรับหน่วยงานพิเศษ 7 วัน ===`);
let countDaysWithAllTimes = 0;
let countAddSalaryWithItems = 0;

concludeRecord.forEach((record, index) => {
  if (parseFloat(record.allTimes || 0) > 0) {
    countDaysWithAllTimes++;
  }
  if (addSalaryList[index] && addSalaryList[index].length > 0) {
    countAddSalaryWithItems++;
  }
});

console.log(`📅 จำนวนวันที่มี allTimes > 0: ${countDaysWithAllTimes} วัน`);
console.log(`💵 จำนวนวันที่มี addSalaryList: ${countAddSalaryWithItems} วัน`);
console.log(`✅ ต้องตรงกัน: ${countDaysWithAllTimes === countAddSalaryWithItems ? 'ถูกต้อง' : 'ไม่ตรงกัน!'}`);

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

// เพิ่มส่วนรวมเงินพิเศษ
const addSalaryAggregated = {};

addSalaryList.forEach((dailySalaries) => {
  dailySalaries.forEach((salary) => {
    const id = salary.id;
    if (!addSalaryAggregated[id]) {
      addSalaryAggregated[id] = {
        ...salary,
        SpSalary: parseFloat(salary.SpSalary || 0),
        message: totalWorkDays.toString()
      };
    } else {
      addSalaryAggregated[id].SpSalary += parseFloat(salary.SpSalary || 0);
    }
  });
});

const finalAddSalaryList = Object.values(addSalaryAggregated).map(item => ({
  ...item,
  SpSalary: item.SpSalary.toFixed(0),
  message: totalWorkDays.toString()
}));

dataConclude.addSalaryList = finalAddSalaryList;    

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



// Helper: parse 'YYYY-MM-DD' or 'YYYY/MM/DD' as local date (force local, never UTC)
function parseLocalDate(str) {
  if (!str) return null;
  if (str instanceof Date) return str;
  if (typeof str === 'object' && str.date) str = str.date;
  if (typeof str === 'string') {
    
    // ถ้าเป็น ISO timestamp (เช่น 2025-06-02T17:00:00.000Z)
    if (str.includes('T') && (str.includes('Z') || str.includes('+'))) {
      console.log(`🔍 Parsing ISO timestamp: ${str}`);
      const isoDate = new Date(str);
      if (!isNaN(isoDate.getTime())) {
        // แปลง ISO date เป็น local date โดยใช้ local timezone
        const localYear = isoDate.getFullYear();
        const localMonth = isoDate.getMonth();
        const localDay = isoDate.getDate();
        
        // สร้าง Date object ใหม่แบบ local timezone
        const localDate = new Date(localYear, localMonth, localDay);
        console.log(`✅ ISO to local: ${str} -> ${localYear}-${String(localMonth + 1).padStart(2, '0')}-${String(localDay).padStart(2, '0')}`);
        return localDate;
      }
    }
    
    
    // force local for simple date string
    let parts = str.includes('-') ? str.split('-') : str.split('/');
    if (parts.length === 3) {
      // handle 'YYYY-MM-DD' or 'YYYY/MM/DD'
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // month index starts from 0
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const localDate = new Date(year, month, day);
        console.log(`✅ String to local: ${str} -> ${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        return localDate; // ✅ สร้างแบบ local timezone
      }
    }
  }
  
  // ❌ ไม่ใช้ new Date(str) เป็น fallback เพื่อป้องกัน timezone bug
  console.error(`❌ parseLocalDate: Cannot parse "${str}" - unsupported format`);
  return null;
}

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

    // วันหยุดหน่วยงาน (daysOff)
    const daysOff = workplace.daysOff || [];
    // วันหยุดนักขัตฤกษ์ (publicHoliday)
    const publicHoliday = workplace.publicHoliday || [];

    // daysOff: แปลงเป็น yyyy-mm-dd string เฉพาะที่อยู่ในช่วงเวลา (local date)
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

    // daysOff
    const daysOffDates = daysOff.map((d, index) => {
      try {
        console.log(`🔍 Processing daysOff ${index + 1}:`, d);
        const local = parseLocalDate(d);
        if (!local || isNaN(local.getTime())) {
          console.error(`❌ Invalid daysOff date: ${d}`);
          return null;
        }
        
        // Format เป็น YYYY-MM-DD แบบ local
        const formattedDate = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
        console.log(`✅ daysOff ${index + 1}: ${d} -> ${formattedDate}`);
        return formattedDate;
      } catch (err) {
        console.error(`❌ Error processing daysOff ${index + 1}:`, err);
        return null;
      }
    }).filter(dateStr => {
      if (!dateStr) return false;
      
      try {
        const d = parseLocalDate(dateStr);
        const inRange = d && !isNaN(d.getTime()) && d >= startDate && d <= endDate;
        console.log(`🔍 daysOff ${dateStr} in range: ${inRange}`);
        return inRange;
      } catch (err) {
        console.error(`❌ Error filtering daysOff:`, err);
        return false;
      }
    });

    // publicHoliday
    const publicHolidayDates = publicHoliday.map((h, index) => {
      try {
        const dateValue = h && h.date ? h.date : h;
        console.log(`🔍 Processing publicHoliday ${index + 1}:`, h, `-> dateValue:`, dateValue);
        
        const local = parseLocalDate(dateValue);
        if (!local || isNaN(local.getTime())) {
          console.error(`❌ Invalid publicHoliday date: ${dateValue}`);
          return null;
        }
        
        // Format เป็น YYYY-MM-DD แบบ local
        const formattedDate = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
        console.log(`✅ publicHoliday ${index + 1}: ${dateValue} -> ${formattedDate}`);
        return formattedDate;
      } catch (err) {
        console.error(`❌ Error processing publicHoliday ${index + 1}:`, err);
        return null;
      }
    }).filter(dateStr => {
      if (!dateStr) return false;
      
      try {
        const d = parseLocalDate(dateStr);
        const inRange = d && !isNaN(d.getTime()) && d >= startDate && d <= endDate;
        console.log(`🔍 publicHoliday ${dateStr} in range [${startDate.toISOString().slice(0,10)} - ${endDate.toISOString().slice(0,10)}]: ${inRange}`);
        return inRange;
      } catch (err) {
        console.error(`❌ Error filtering publicHoliday:`, err);
        return false;
      }
    });

    // ตรวจสอบวันเสาร์-อาทิตย์ในช่วงเวลา
    const weekendSet = new Set();
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day === 0 || day === 6) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        weekendSet.add(`${yyyy}-${mm}-${dd}`);
      }
    }

    // weekendAndDayOff: เฉพาะ daysOff ที่อยู่ในช่วงเวลา
    const weekendAndDayOff = [...daysOffDates].sort();
    // dayOffOnly: เฉพาะ publicHoliday ที่อยู่ในช่วงเวลา
    const dayOffOnly = [...publicHolidayDates].sort();
    // weekendOnly: วันเสาร์-อาทิตย์ในช่วงเวลา ที่ไม่อยู่ใน daysOff
    const daysOffSet = new Set(daysOffDates);
    const weekendOnly = Array.from(weekendSet).filter(dateStr => !daysOffSet.has(dateStr)).sort();

    console.log('📊 getWeekendDates Final Results:');
    console.log('   🏢 daysOff (weekendAndDayOff):', weekendAndDayOff);
    console.log('   🎉 publicHoliday (dayOffOnly):', dayOffOnly);
    console.log('   📅 weekendOnly:', weekendOnly);

    res.json({ weekendOnly, dayOffOnly, weekendAndDayOff });
  } catch (error) {
    console.error('❌ Error in /getWeekendDates:', error);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});

// ...existing code...

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

  // เรียกใช้ API เพื่อดึงข้อมูล workRate จาก endpoint ใหม่
  try {
    const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${workplaceId}`);
    const workplaceData = workplaceResponse.data;
    
    // ใช้ค่า workRate จาก API โดยตรง
    const workRateFromAPI = parseFloat(workplaceData.workRate || '0');
    console.log(`📊 ดึงค่าแรงจาก API สำหรับ workplace ${workplaceId}: ${workRateFromAPI}`);
    
    // เก็บค่าที่ได้จาก API ไว้ใน dataCal
    dataCal.workRateFromAPI = workRateFromAPI;
  } catch (error) {
    console.error(`❌ ไม่สามารถดึงข้อมูลจาก API ได้สำหรับ workplace ${workplaceId}:`, error.message);
    // กรณีที่เรียก API ไม่สำเร็จ จะใช้ค่าจากฐานข้อมูลต่อไป
  }

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
    // ถ้ามีค่า workRate จาก API ให้ใช้ค่านั้นแทน
    if (dataCal.workRateFromAPI) {
      dataCal.workRate = dataCal.workRateFromAPI / 8;
      console.log(`💰 ใช้ค่าแรงจาก API: ${dataCal.workRateFromAPI} (ค่าต่อชั่วโมง: ${dataCal.workRate})`);
    } else {
      dataCal.workRate = await parseFloat(workplaces?.[0]?.workRate || '0') / 8 || 0;
      console.log(`💰 ใช้ค่าแรงจากฐานข้อมูล: ${workplaces?.[0]?.workRate} (ค่าต่อชั่วโมง: ${dataCal.workRate})`);
    }
    
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

    // ตรวจสอบจาก API getWeekendDates
    try {
      const dateStr = date; // date is already in YYYY-MM-DD format
      const [year, monthWithZero, day] = dateStr.split('-');
      const month = parseInt(monthWithZero, 10); // ลบศูนย์นำหน้า
      const dayOfMonth = parseInt(day, 10);
      
      // สร้าง Date object เพื่อตรวจสอบว่าเป็นวันอะไรในสัปดาห์
      const dateObj = new Date(dateStr);
      const dayOfWeek = dateObj.getDay(); // 0 = อาทิตย์, ..., 6 = เสาร์
      
      // คำนวณเดือนที่ถูกต้องสำหรับการเรียก API ตามกฎการจ่ายเงินเดือน
      // ต้องตรวจสอบว่าวันที่อยู่ในรอบเงินเดือนไหน:
      // - วันที่ 21-31 ของเดือนก่อนหน้า (เช่น เมษายน) ต้องใช้ข้อมูลของเดือนถัดไป (เช่น พฤษภาคม)
      // - วันที่ 1-20 ของเดือนปัจจุบัน (เช่น พฤษภาคม) ต้องใช้ข้อมูลของเดือนปัจจุบัน (เช่น พฤษภาคม)
      let apiMonth, apiYear;
      
      if (dayOfMonth >= 21) {
        // วันที่ 21-31 ของเดือนนี้ (เช่น เมษายน)
        // ต้องใช้ข้อมูลของเดือนถัดไป (เช่น พฤษภาคม)
        if (month === 12) {
          apiMonth = "1";
          apiYear = (parseInt(year) + 1).toString();
        } else {
          apiMonth = (month + 1).toString();
          apiYear = year;
        }
      } else {
        // วันที่ 1-20 ของเดือนนี้ (เช่น พฤษภาคม)
        // ใช้ข้อมูลของเดือนนี้ (เช่น พฤษภาคม)
        apiMonth = month.toString().padStart(2, '0');
        apiYear = year;
      }
      
      // เรียก API โดยส่งค่า year และ month ที่ถูกต้อง
      const apiUrl = `http://10.10.110.7:3000/conclude/getWeekendDates?yyyy=${apiYear}&mm=${apiMonth}&workplaceId=${workplaceId}`;
      console.log(`🔍 เรียก API: ${apiUrl}`);
      console.log(`📅 วันที่ ${dayOfMonth} เดือน ${month} ปี ${year} ใช้ข้อมูลเดือน ${apiMonth} ปี ${apiYear}`);
      
      const weekendResponse = await axios.get(apiUrl);
      const weekendData = weekendResponse.data;
      
      // แสดงข้อมูลเพื่อตรวจสอบ
      console.log(`📅 วันที่ต้องการตรวจสอบ: ${dateStr} (รูปแบบ: YYYY-MM-DD)`);
      
      // ตรวจสอบ weekendAndDayOff ก่อน (วันหยุดสุดสัปดาห์และวันหยุดพิเศษ)
      if (weekendData.weekendAndDayOff && weekendData.weekendAndDayOff.length > 0) {
        console.log(`📅 วันใน weekendAndDayOff: ${JSON.stringify(weekendData.weekendAndDayOff)}`);
        
        if (weekendData.weekendAndDayOff.includes(dateStr)) {
          console.log(`✅ พบวันที่ ${dateStr} ใน weekendAndDayOff -> กำหนด dayType = stop`);
          dataCal.dayType = 'stop';
          return dataCal;
        }
      }
      
      // ตรวจสอบ dayOffOnly (วันหยุดพิเศษเท่านั้น)
      if (weekendData.dayOffOnly && weekendData.dayOffOnly.length > 0) {
        console.log(`📅 วันใน dayOffOnly: ${JSON.stringify(weekendData.dayOffOnly)}`);
        
        if (weekendData.dayOffOnly.includes(dateStr)) {
          console.log(`✅ พบวันที่ ${dateStr} ใน dayOffOnly -> กำหนด dayType = stop`);
          dataCal.dayType = 'stop';
          return dataCal;
        }
      }
      
      // ตรวจสอบ weekendOnly (วันหยุดสุดสัปดาห์เท่านั้น)
      if (weekendData.weekendOnly && weekendData.weekendOnly.length > 0) {
        console.log(`📅 วันใน weekendOnly: ${JSON.stringify(weekendData.weekendOnly)}`);
        
        if (weekendData.weekendOnly.includes(dateStr)) {
          // ตรวจสอบว่าเป็นวันเสาร์หรือวันอาทิตย์
          if (dayOfWeek === 6) { // วันเสาร์
            console.log(`✅ พบวันที่ ${dateStr} เป็นวันเสาร์ใน weekendOnly -> dayType = work`);
            dataCal.dayType = 'work';
            return dataCal;
          } else if (dayOfWeek === 0) { // วันอาทิตย์
            console.log(`✅ พบวันที่ ${dateStr} เป็นวันอาทิตย์ใน weekendOnly -> dayType = stop`);
            dataCal.dayType = 'stop';
            return dataCal;
          }
        }
      }
      
      // ตรวจสอบเพิ่มเติมสำหรับวันที่ 10 มิถุนายน 2025
     
      
      // ตรวจสอบว่าเป็นวันทำงานปกติหรือไม่ (จันทร์-ศุกร์)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 1 = จันทร์, 5 = ศุกร์
        console.log(`✅ วันที่ ${dateStr} เป็นวันทำงานปกติ (${['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][dayOfWeek]}) -> dayType = work`);
        dataCal.dayType = 'work';
        return dataCal;
      }
      
      // ถ้าไม่พบในรายการวันหยุดพิเศษและไม่ใช่วันทำงานปกติ
      console.log(`❌ ไม่พบวันที่ ${dateStr} ในรายการวันหยุดพิเศษ`);
      dataCal.dayType = 'work'; // กำหนดค่าเริ่มต้นเป็น work เมื่อไม่พบในรายการวันหยุดพิเศษ
      return dataCal; // ส่งค่ากลับทันที
      
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก API วันหยุด:', error.message);
      // ดำเนินการต่อหากการเรียก API ล้มเหลว
      dataCal.dayType = 'work'; // กำหนดค่าเริ่มต้นเป็น work กรณีมีข้อผิดพลาด
      return dataCal;
    }

    // กรณีไม่สามารถเรียก API ได้ หรือมีข้อผิดพลาดอื่นๆ จะทำงานส่วนนี้
    const [y, m, d] = date.split('-').map(Number);
    let paddedMonth = String(m - 1).padStart(2, '0');  
    let paddedDay = String(d).padStart(2, '0');  

    let dateString = y + '-' + paddedMonth + '-' + paddedDay + 'T00:00:00';

    let dateObj = await new Date(dateString);
    let dayNumberx = await dateObj.getDay(); // 0 = อาทิตย์, ..., 6 = เสาร์
    let dateOfMonth = await dateObj.getDate(); // 1 - 31

    // ตรวจสอบวันหยุดพิเศษ
    let isDayOff = false;
    for(let itemDay of workplaces?.[0]?.daysOff || []) {
      if(toBangkokDate(itemDay) === date) {
        console.log('special day off ' + toBangkokDate(itemDay) + ' = ' + date);
        isDayOff = true;
        break;  
      }
    }

    if(isDayOff == true) {
      dataCal.dayType = await 'specialDayOff';
    } else {
      // ตรวจสอบประเภทวัน
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


// ฟังก์ชันคำนวณสำหรับหน่วยงานพิเศษ 7 วัน
const calculateCashValuesSpecial7Days = async (employeeId, employee_record, month, year) => {
  console.log(`\n💼 === เริ่มคำนวณแบบหน่วยงานพิเศษ 7 วัน ===`);
  console.log(`👤 EmployeeId: ${employeeId}`);
  console.log(`📅 Month: ${month}, Year: ${year}`);
  
  const employeeProfile = await getEmployeeProfile(employeeId);
  const salaryTmp = parseFloat(employeeProfile[0].salary || '0') || 0;
  const workplaceId = employeeProfile[0].workplace;
  let salary = 0;

  // เรียก API เพื่อดึงข้อมูลวันหยุด
  let weekendData = {};
  try {
    const apiUrl = `http://10.10.110.7:3000/conclude/getWeekendDates?yyyy=${year}&mm=${month}&workplaceId=${workplaceId}`;
    console.log(`\n🔍 เรียก API วันหยุด: ${apiUrl}`);
    
    const weekendResponse = await axios.get(apiUrl);
    weekendData = weekendResponse.data;
    
    console.log(`📋 ข้อมูลวันหยุดที่ได้:`);
    console.log(`   - weekendAndDayOff: ${JSON.stringify(weekendData.weekendAndDayOff || [])}`);
    console.log(`   - dayOffOnly: ${JSON.stringify(weekendData.dayOffOnly || [])}`);
    
  } catch (error) {
    console.error(`❌ ไม่สามารถดึงข้อมูลวันหยุดได้:`, error.message);
  }

  // คำนวณค่าแรงต่อชั่วโมง
  if(parseFloat(salaryTmp || '0') > 1660) {
    salary = await ((parseFloat(salaryTmp || '0') / 30) / 8).toFixed(3);
    console.log(`💰 พนักงานเงินเดือน: ${salaryTmp} บาท/เดือน = ${salary} บาท/ชั่วโมง`);
  } else {
    salary = await (parseFloat(salaryTmp || '0') / 8).toFixed(3);
    console.log(`💰 พนักงานรายวัน: ${salaryTmp} บาท/วัน = ${salary} บาท/ชั่วโมง`);
  }

  return Promise.all(
    employee_record.map(async (record) => {
      // จัดการกรณีข้ามปี
      if((record.date >= 21 && record.date <= 31) && month == 1) {
        year = year - 1;
        month = 12;
      }

      // สร้างวันที่สำหรับตรวจสอบ
      let displayMonth, displayYear;
      
      if (record.date > 20) {
        if (parseInt(month) === 1) {
          displayMonth = "12";
          displayYear = (parseInt(year) - 1).toString();
        } else {
          displayMonth = (parseInt(month) - 1).toString().padStart(2, '0');
          displayYear = year;
        }
      } else {
        displayMonth = month.toString().padStart(2, '0');
        displayYear = year;
      }
      
      const paddedDay = record.date.toString().padStart(2, '0');
      const bangkokDate = `${displayYear}-${displayMonth}-${paddedDay}`;
      
      console.log(`\n📅 วันที่ ${bangkokDate} (วันที่ ${record.date})`);

      // เรียกใช้ checkDayRate เพื่อดึงข้อมูลอัตราค่าแรง
      const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate, record.date, 
        employeeProfile?.[0]?.customWorkplace);

      // ตรวจสอบว่ามีค่า workRate จาก API หรือไม่
      if (dataRate?.workRateFromAPI) {
        salary = parseFloat(dataRate.workRateFromAPI) / 8;
        console.log(`💰 ใช้ค่าแรงจาก API: ${dataRate.workRateFromAPI} บาท/วัน = ${salary} บาท/ชั่วโมง`);
      }

      // กำหนดตัวแปรสำหรับเก็บค่าต่างๆ
      let cashBeforeOt = 0;
      let cashWork = 0;
      let cashOt = 0;
      let cashBeforeOtMul = 0;
      let cashWorkMul = 0;
      let cashOtMul = 0;
      let dayType = '';
      let addSalaryDaily = [];

      // ตรวจสอบว่าเป็นวันหยุดหรือไม่
      const allHolidays = [
        ...(weekendData.weekendAndDayOff || []),
        ...(weekendData.dayOffOnly || [])
      ];
      
      const isHoliday = allHolidays.includes(bangkokDate);
      
      // ตรวจสอบว่าพนักงานมาทำงานหรือไม่ (มีเวลาทำงาน > 0)
      const hasWorked = record.totalTime && parseFloat(record.totalTime) > 0;
      
      if (isHoliday && hasWorked) {
        // ถ้าเป็นวันหยุดและพนักงานมาทำงาน
        console.log(`🎯 วันหยุดและพนักงานมาทำงาน -> dayType = stop`);
        dayType = 'stop';
        
        // คำนวณค่าแรงแบบวันหยุด
        cashBeforeOt = await (
          parseFloat(dataRate?.dayoffRateOT || '0') > 5
            ? parseFloat(dataRate?.dayoffRateOT || '0') || 0
            : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.dayoffRateOT || '0')) * salary || 0)) || 0
        );

        // คำนวณค่า OT แบบวันหยุด
        const tmpHour = Math.floor(record.totalOtTime || 0);
        const tmpRawDecimal = (record.totalOtTime || 0) - tmpHour;
        const tmpMinute = Math.round(tmpRawDecimal * 100);
        const totalDecimalHour = tmpHour + (tmpMinute / 60);

        cashOt = await (
          parseFloat(dataRate?.dayoffRateOT || '0') > 5
            ? parseFloat(dataRate?.dayoffRateOT || '0') || 0
            : ((totalDecimalHour || 0) * ((parseFloat(dataRate?.dayoffRateOT || '0')) * salary || 0)) || 0
        );

        // คำนวณค่าแรงปกติแบบวันหยุด
        cashWork = await (record.totalTime || 0) * (parseFloat(salary || '0') * parseFloat(dataRate?.dayoffRateHour || '0')) || 0;
        
        // กำหนดตัวคูณแบบวันหยุด
        cashBeforeOtMul = dataRate?.dayoffRateOT || 0;
        cashWorkMul = dataRate?.dayoffRateHour || 0;
        cashOtMul = dataRate?.dayoffRateOT || 0;
        
        console.log(`💰 คำนวณแบบวันหยุด:`);
        console.log(`   - อัตราค่าแรง: ${cashWorkMul}x`);
        console.log(`   - อัตรา OT: ${cashOtMul}x`);
        
      } else {
        // วันทำงานปกติหรือวันหยุดที่ไม่มาทำงาน
        console.log(`🏢 หน่วยงานพิเศษ 7 วัน: วันทำงานปกติ -> dayType = work`);
        dayType = 'work';
        
        // คำนวณค่าแรงแบบวันทำงานปกติ
        cashBeforeOt = await (
          parseFloat(dataRate?.workRateOT || '1.5') > 5
            ? parseFloat(dataRate?.workRateOT || '1.5') || 0
            : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.workRateOT || '1.5')) * salary || 0)) || 0
        );

        // คำนวณค่า OT
        const tmpHour = Math.floor(record.totalOtTime || 0);
        const tmpRawDecimal = (record.totalOtTime || 0) - tmpHour;
        const tmpMinute = Math.round(tmpRawDecimal * 100);
        const totalDecimalHour = tmpHour + (tmpMinute / 60);

        cashOt = await (
          parseFloat(dataRate?.workRateOT || '1.5') > 5
            ? parseFloat(dataRate?.workRateOT || '1.5') || 0
            : ((totalDecimalHour || 0) * ((parseFloat(dataRate?.workRateOT || '1.5')) * salary || 0)) || 0
        );

        // คำนวณค่าแรงปกติ
        cashWork = await (record.totalTime || 0) * parseFloat(salary || 0);
        
        // กำหนดตัวคูณ
        cashBeforeOtMul = dataRate?.workRateOT || 1.5;
        cashWorkMul = 1;
        cashOtMul = dataRate?.workRateOT || 1.5;
      }
      
      // *** แก้ไขส่วน addSalaryDaily ***
      // เงินเพิ่มพิเศษรายวัน - คิดทุกวันที่มี totalTime (ไม่ว่า dayType จะเป็นอะไร)
      if (hasWorked) {
        // ถ้ามีการทำงาน (totalTime > 0) ให้เพิ่มเงินพิเศษรายวัน
        addSalaryDaily = [...(employeeProfile[0].addSalary || [])
          .filter(salary => salary.roundOfSalary === "daily")
          .map(salary => ({
            ...salary,
            SpSalary: parseFloat(salary.SpSalary) > 100 ? 
              (parseFloat(salary.SpSalary) / 30).toFixed(2) : 
              salary.SpSalary
          }))
        ];
        console.log(`💵 เพิ่มเงินพิเศษรายวัน: ${addSalaryDaily.length} รายการ (เพราะมี totalTime)`);
      } else {
        // ถ้าไม่มีการทำงาน ไม่เพิ่มเงินพิเศษรายวัน
        addSalaryDaily = [];
        console.log(`❌ ไม่เพิ่มเงินพิเศษรายวัน (เพราะไม่มี totalTime)`);
      }

      // แสดงผลการคำนวณ
      console.log(`💰 ผลการคำนวณ:`);
      console.log(`   - ค่าแรงปกติ: ${cashWork.toFixed(2)} บาท`);
      console.log(`   - ค่า OT: ${cashOt.toFixed(2)} บาท`);
      console.log(`   - ประเภทวัน: ${dayType}`);
      console.log(`   - เป็นวันหยุด: ${isHoliday ? 'ใช่' : 'ไม่ใช่'}`);
      console.log(`   - มาทำงาน: ${hasWorked ? 'ใช่' : 'ไม่ใช่'}`);
      console.log(`   - จำนวนเงินเพิ่มรายวัน: ${addSalaryDaily.length} รายการ`);
      if (addSalaryDaily.length > 0) {
        addSalaryDaily.forEach(item => {
          console.log(`     • ${item.name}: ${item.SpSalary} บาท`);
        });
      }

      return {
        ...record,
        cashBeforeOt,
        cashWork,
        cashOt,
        cashBeforeOtMul,
        cashWorkMul,
        cashOtMul,
        dayType,
        addSalaryDaily,
      };
    })
  );
};

const calculateCashValues = async (employeeId, employee_record, month, year) => {
  const employeeProfile = await getEmployeeProfile(employeeId);
  const salaryTmp = parseFloat(employeeProfile[0].salary || '0') || 0;
  let addSalary = employeeProfile?.[0]?.addSalary || [];
  let salary = 0;

  if(parseFloat(salaryTmp || '0') > 1660) {
    salary = await ((parseFloat(salaryTmp || '0') / 30)/ 8).toFixed(3);
  } else {
    salary = await (parseFloat(salaryTmp || '0')/ 8).toFixed(3);
  }

  return Promise.all(
    employee_record.map(async (record) => {
      if((record.date >= 21 && record.date <= 31) && month == 1) {
        year = year - 1;
        month = 12;
      }

      const workplaceId = employeeProfile[0].workplace === "10105" ? "10105" : record.workplaceId;

      let displayMonth, displayYear;
      
      if (record.date > 20) {
        // วันที่ 21-31 ใช้เดือนก่อนหน้า
        if (parseInt(month) === 1) {
          displayMonth = "12";
          displayYear = (parseInt(year) - 1).toString();
        } else {
          displayMonth = (parseInt(month) - 1).toString().padStart(2, '0');
          displayYear = year;
        }
      } else {
        // วันที่ 1-20 ใช้เดือนปัจจุบัน
        displayMonth = month.toString().padStart(2, '0');
        displayYear = year;
      }
      
      const paddedDay = record.date.toString().padStart(2, '0');
      const bangkokDate = `${displayYear}-${displayMonth}-${paddedDay}`;
      
      console.log(`📅 ตรวจสอบวันที่: ${bangkokDate} (วันที่ ${record.date} เดือน ${displayMonth}/${displayYear})`);

      const dataRate = await checkDayRate(workplaceId, record.wGroup, bangkokDate, record.date, 
        employeeProfile?.[0]?.customWorkplace);

      let cashBeforeOt = 0;
      let cashWork = 0;
      let cashOt = 0;
      let cashBeforeOtMul = 0;
      let cashWorkMul = 0;
      let cashOtMul = 0;
      let dayType = '';
      let addSalaryDaily = [];

      // ถ้ามีค่า workRate จาก API ให้ใช้ค่านั้น
      if (dataRate?.workRateFromAPI) {
        salary = parseFloat(dataRate.workRateFromAPI) / 8;
        console.log(`💰 ใช้ค่าแรงจาก API สำหรับคำนวณ: ${dataRate.workRateFromAPI} (ค่าต่อชั่วโมง: ${salary})`);
      } else if (salaryTmp !== 0) {
        // ใช้เงินเดือนจาก profile
      } else if (dataRate?.workRate) {
        salary = parseFloat(dataRate.workRate || '0');
        console.log(`💰 ใช้ค่าแรงจากฐานข้อมูลสำหรับคำนวณ: ${dataRate.workRate}`);
      } else {
        salary = 0;
        console.log(`⚠️ ไม่พบค่าแรงสำหรับคำนวณ กำหนดเป็น 0`);
      }
      
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

          cashWork = await (record.totalTime || 0) * (parseFloat(salary || '0') * parseFloat(dataRate?.dayoffRateHour || '0')) || 0;
          dayType = await dataRate?.dayType || 0;
          cashBeforeOtMul = dataRate?.dayoffRateOT || 0;
          cashWorkMul = dataRate?.dayoffRateHour || 0;
          cashOtMul = dataRate?.dayoffRateOT || 0;
          addSalaryDaily = [];
        } else if(dataRate?.dayType === 'specialDayOff') {
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

          cashWork = await (parseFloat(record.totalTime || 0) * parseFloat(salary || 0) * parseFloat(dataRate?.holidayHour || 1)) || 0;
          console.log('totalTime ' + parseFloat(record.totalTime || 0) + ' salary ' + parseFloat(salary || 0) + ' dataRate ' + parseFloat(dataRate?.holidayHour || 1)); 
          
          dayType = await dataRate?.dayType || 0;
          cashBeforeOtMul = dataRate?.holidayOT || 0;
          cashWorkMul = dataRate?.holidayHour || 0;
          cashOtMul = dataRate?.holidayOT || 0;
          addSalaryDaily = [];
        } else if(dataRate?.dayType === "work") {
          // เพิ่มเงื่อนไขสำหรับวันทำงานปกติ (work)
          cashBeforeOt = await (
            parseFloat(dataRate?.workRateOT || '0') > 5
              ? parseFloat(dataRate?.workRateOT || '0') || 0
              : ((record.beforeTotalOtTime || 0) * ((parseFloat(dataRate?.workRateOT || '0')) * salary || 0)) || 0
          );

          // cashOt = await (
          //   parseFloat(dataRate?.workRateOT || '0') > 5
          //     ? parseFloat(dataRate?.workRateOT || '0') || 0
          //     : ((record.totalOtTime || 0) * ((parseFloat(dataRate?.workRateOT || '0')) * salary || 0)) || 0
          // );
//แก้ไขเวลา OT ให้คิดจากหน่วยนาที
const tmpHour = Math.floor(record.totalOtTime || 0); // ได้ค่า ชม.
const tmpRawDecimal = (record.totalOtTime || 0) - tmpHour; // ได้ค่า0.นาที
const tmpMinute = Math.round(tmpRawDecimal * 100); // x นาที (เพราะ *100 จาก .นาที)
const totalDecimalHour = tmpHour + (tmpMinute / 60); // 1 + 30/60 = 1.5

          cashOt = await (
            parseFloat(dataRate?.workRateOT || '0') > 5
              ? parseFloat(dataRate?.workRateOT || '0') || 0
              : ((totalDecimalHour || 0 ) * ((parseFloat(dataRate?.workRateOT || '0')) * salary || 0)) || 0 //คำนวนจากเวลาที่แปลงแล้ว
          );

          // คำนวณค่าแรงสำหรับวันทำงานปกติ
          cashWork = await (record.totalTime || 0) * parseFloat(salary || 0);
          dayType = await dataRate?.dayType || '';
          cashBeforeOtMul = await dataRate?.workRateOT || 0;
          cashWorkMul = 1; // ตัวคูณค่าแรงปกติเป็น 1
          cashOtMul = await dataRate?.workRateOT || 0;
          
          // เพิ่มเงินพิเศษรายวัน
          addSalaryDaily = [...(employeeProfile[0].addSalary || [])
            .filter(salary => salary.roundOfSalary === "daily")
            .map(salary => ({
              ...salary,
              SpSalary: parseFloat(salary.SpSalary) > 100 ? (parseFloat(salary.SpSalary) / 30).toFixed(2) : salary.SpSalary
            }))
          ];
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

      // แสดงข้อมูลเพื่อตรวจสอบ
      console.log(`💰 วันที่ ${record.date}: dayType=${dayType}, cashWork=${cashWork}, cashOt=${cashOt}`);

      return {
        ...record,
        cashBeforeOt,
        cashWork,
        cashOt,
        cashBeforeOtMul,
        cashWorkMul,
        cashOtMul,
        dayType,
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


router.post('/searchtimerecordemployee', async (req, res) => {
  try {
    const { employeeId, month, year } = await req.body;
    
    console.log(`\n🔍 === ตรวจสอบ workOfWeek สำหรับ employeeId: ${employeeId} ===`);
    
    // ดึงข้อมูลพนักงานเพื่อหา workplace
    const employeeProfile = await getEmployeeProfile(employeeId);
    if (!employeeProfile || employeeProfile.length === 0) {
      console.log(`❌ ไม่พบข้อมูลพนักงาน employeeId: ${employeeId}`);
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const workplaceId = employeeProfile[0].workplace;
    console.log(`📍 Workplace ID: ${workplaceId}`);
    
    // เรียก API เพื่อตรวจสอบ workOfWeek
    let isSpecialWorkplace = false;
    let workOfWeek = "5"; // default
    
    try {
      const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${workplaceId}`);
      const workplaceData = workplaceResponse.data;
      workOfWeek = workplaceData.workOfWeek || "5";
      
      console.log(`\n📊 === ผลการตรวจสอบ workOfWeek ===`);
      console.log(`👤 EmployeeId: ${employeeId}`);
      console.log(`🏢 WorkplaceId: ${workplaceId}`);
      console.log(`📅 Month: ${month}, Year: ${year}`);
      console.log(`🗓️ WorkOfWeek: ${workOfWeek}`);
      
      if (workOfWeek === "7") {
        console.log(`✅ เป็นหน่วยงานพิเศษ (ทำงาน 7 วัน)`);
        console.log(`⚠️ ต้องใช้ฟังก์ชันคำนวณแบบพิเศษ`);
        isSpecialWorkplace = true;
      } else {
        console.log(`✅ เป็นหน่วยงานปกติ (ทำงาน ${workOfWeek} วัน)`);
        console.log(`ℹ️ ใช้ฟังก์ชันคำนวณแบบปกติ`);
        isSpecialWorkplace = false;
      }
      console.log(`=====================================\n`);
      
    } catch (error) {
      console.error(`❌ ไม่สามารถดึงข้อมูล workplace ได้:`, error.message);
      console.log(`⚠️ ใช้ค่า default workOfWeek = ${workOfWeek}`);
    }
    
    // ดำเนินการต่อตามเดิม
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
    
    let updateNeeded = false;
    for (const doc of result) {
      // ข้ามเอกสารที่ status มีค่า (ไม่ว่าง)
      if (doc.status && doc.status.trim() !== "") {
        continue;
      }

      if (!doc || !Array.isArray(doc.employee_record) || doc.employee_record.length === 0) {
        console.warn(`Skipping invalid or empty document: ${JSON.stringify(doc)}`);
        continue;
      }
    
      try {
        // เลือกใช้ฟังก์ชันคำนวณตามประเภทหน่วยงาน
        let updatedRecords;
        
        if (isSpecialWorkplace) {
          console.log(`\n🔄 ใช้ฟังก์ชันคำนวณแบบหน่วยงานพิเศษ 7 วัน`);
          updatedRecords = await calculateCashValuesSpecial7Days(employeeId, doc.employee_record, month, year);
        } else {
          console.log(`\n🔄 ใช้ฟังก์ชันคำนวณแบบหน่วยงานปกติ`);
          updatedRecords = await calculateCashValues(employeeId, doc.employee_record, month, year);
        }
        
        if (JSON.stringify(updatedRecords) !== JSON.stringify(doc.employee_record)) {
          doc.employee_record = updatedRecords;
          await doc.save();
          updateNeeded = true;
          console.log(`✅ อัปเดตข้อมูลสำเร็จ`);
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

// API endpoint สำหรับอัปเดต publicHoliday จากข้อมูลวันหยุดนักขัตฤกษ์
router.post('/updateDayOffOnly', async (req, res) => {
  try {
    const { workplaceId, publicHolidays } = req.body;

    if (!workplaceId || !publicHolidays) {
      return res.status(400).json({ error: 'Missing required parameters: workplaceId, publicHolidays' });
    }

    console.log('🔍 Received publicHolidays in updateDayOffOnly:', JSON.stringify(publicHolidays, null, 2));

    // ตรวจสอบว่าหน่วยงานมีอยู่จริงหรือไม่
    const workplace = await Workplace.findOne({ workplaceId });
    if (!workplace) {
      return res.status(404).json({ error: `Workplace ${workplaceId} not found` });
    }

    // แปลงวันหยุดนักขัตฤกษ์เป็นรูปแบบ object {date, note}
    const holidayData = publicHolidays.map((holiday, index) => {
      console.log(`🔍 Processing holiday ${index + 1}:`, holiday);
      
      try {
        let dateStr = null;
        let note = '';
        
        if (typeof holiday === 'string') {
          // ถ้าเป็น string (format เก่า)
          dateStr = holiday;
          note = '';
          console.log(`📅 Holiday ${index + 1} is string: "${dateStr}"`);
        } else if (holiday && holiday.date) {
          // ถ้าเป็น object ที่มี date และ note
          dateStr = holiday.date;
          note = holiday.note || '';
          console.log(`📅 Holiday ${index + 1} is object: date="${dateStr}", note="${note}"`);
        } else {
          // fallback
          dateStr = holiday;
          note = '';
          console.log(`📅 Holiday ${index + 1} fallback: "${dateStr}"`);
        }
        
        // ✅ ใช้ parseLocalDate แทน new Date() เพื่อป้องกัน timezone shift
        const localDate = parseLocalDate(dateStr);
        if (!localDate) {
          console.error(`❌ Invalid date format: "${dateStr}"`);
          return null;
        }
        
        const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
        console.log(`✅ Holiday ${index + 1} final result: "${dateStr}" -> ${formattedDate}`);
        
        return {
          date: localDate,
          note: note
        };
      } catch (error) {
        console.error(`❌ Error parsing holiday ${index + 1}:`, error);
        return null;
      }
    }).filter(item => item !== null);

    console.log('✅ Final parsed holiday data count:', holidayData.length);
    console.log('📅 Holiday dates to save:', holidayData.map(h => 
      `${h.date.getFullYear()}-${String(h.date.getMonth() + 1).padStart(2, '0')}-${String(h.date.getDate()).padStart(2, '0')} (${h.note || 'no note'})`
    ));

    // อัปเดตข้อมูลในฐานข้อมูล (อัปเดต publicHoliday เท่านั้น)
    const updated = await Workplace.findOneAndUpdate(
      { workplaceId },
      { 
        publicHoliday: holidayData
      },
      { new: true }
    );

    console.log(`✅ Updated publicHoliday for workplace ${workplaceId}: ${holidayData.length} public holidays`);
    console.log('💾 Saved to database:', updated?.publicHoliday?.map(h => 
      `${h.date.getFullYear()}-${String(h.date.getMonth() + 1).padStart(2, '0')}-${String(h.date.getDate()).padStart(2, '0')} (${h.note || 'no note'})`
    ));

    res.json({
      message: 'อัปเดต publicHoliday สำเร็จ',
      workplaceId: workplaceId,
      publicHolidayCount: holidayData.length
    });
  } catch (error) {
    console.error('❌ Error in /updateDayOffOnly:', error);
    res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
});

// เพิ่มวันหยุดหน่วยงาน (daysOff)
router.post('/add-dayoff', async (req, res) => {
  const { workplaceId, date, note } = req.body;
  if (!workplaceId || !date) {
    return res.status(400).json({ error: 'workplaceId and date are required' });
  }
  try {
    const workplace = await Workplace.findOne({ workplaceId });
    if (!workplace) {
      return res.status(404).json({ error: 'Workplace not found' });
    }
    // daysOff เป็น array ของ string หรือ object (รองรับ note)
    let daysOff = workplace.daysOff || [];
    // ป้องกันซ้ำ
    const exists = daysOff.some(d => {
      if (typeof d === 'object' && d.date) {
        return new Date(d.date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10);
      }
      return new Date(d).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10);
    });
    if (exists) {
      return res.status(409).json({ error: 'Date already exists in daysOff' });
    }
    // เพิ่มใหม่
    if (note) {
      daysOff.push({ date: new Date(date), note });
    } else {
      daysOff.push(new Date(date));
    }
    workplace.daysOff = daysOff;
    await workplace.save();
    res.json({ success: true, daysOff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เพิ่มวันหยุดนักขัตฤกษ์ (publicHoliday)
router.post('/add-publicholiday', async (req, res) => {
  const { workplaceId, date, note } = req.body;
  if (!workplaceId || !date) {
    return res.status(400).json({ error: 'workplaceId and date are required' });
  }
  try {
    const workplace = await Workplace.findOne({ workplaceId });
    if (!workplace) {
      return res.status(404).json({ error: 'Workplace not found' });
    }
    let publicHoliday = workplace.publicHoliday || [];
    // ป้องกันซ้ำ
    const exists = publicHoliday.some(h => {
      if (typeof h === 'object' && h.date) {
        return new Date(h.date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10);
      }
      return new Date(h).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10);
    });
    if (exists) {
      return res.status(409).json({ error: 'Date already exists in publicHoliday' });
    }
    // เพิ่มใหม่
    if (note) {
      publicHoliday.push({ date: new Date(date), note });
    } else {
      publicHoliday.push({ date: new Date(date), note: '' });
    }
    workplace.publicHoliday = publicHoliday;
    await workplace.save();
    res.json({ success: true, publicHoliday });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;