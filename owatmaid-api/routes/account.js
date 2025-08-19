const sURL = 'http://localhost:3000';

//require timerecordEmployee 
const timerecordEmployee = require('./models/periodtimerecordModel');
//require Workplace 
const {Workplace} = require('./models/workplaceModel');
const Employee = require('./models/employeeModel');


const accounting = require('./models/accountingModel');
const welfare = require('./models/welfareModel');


const axios = require('axios');



const getDayNumberFromName = (dayName) => {
  const daysMap = {
    'อาทิตย์': 0,
    'จันทร์': 1,
    'อังคาร': 2,
    'พุธ': 3,
    'พฤหัส': 4,
    'ศุกร์': 5,
    'เสาร์': 6
  };
  return daysMap[dayName] !== undefined ? daysMap[dayName] : -1;
};

var express = require('express');
var router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { months } = require('moment');
const { el, ca, it } = require('date-fns/locale');


// Get list of accounting
router.get('/list', async (req, res) => {

  try{
const acount = await accounting.find();
 res.status(200).send(acount );

  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
  
});

router.get('/listdelete', async (req, res) => {

  try {
    const result = await accounting.deleteMany({});
    res.status(200).send({ message: `${result.deletedCount} document(s) were deleted.` });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }  
});

//delete account record by id year and month
router.get('/accountdelete', async (req, res) => {
  const { year, month, employeeId } = req.query;

  if (!year || !month || !employeeId) {
    return res.status(400).send({ message: 'year, month, and employeeId are required.' });
  }

  try {
    const result = await accounting.deleteMany({ year, month, employeeId });
    res.status(200).send({ message: `${result.deletedCount} document(s) were deleted.` });
  } catch (e) {
    console.error('Error deleting documents:', e);
    res.status(500).send({ message: 'An error occurred while deleting documents.' });
  }
});

// Get  accounting record by accounting Id
router.get('/:employeeId', async (req, res) => {
try {
  const dataTest = await {
    year: "2025", 
        month: req.params.employeeId,
        // employeeId : "1001"
      };
      const x = await axios.post(sURL + '/accounting/calsalarylist', dataTest);
res.json(x.data);
  
  
} catch (e) {

}

});

//get accounting by id
router.post('/calsalaryemp', async (req, res) => {
  try {
    const { year, month ,   employeeId , updateStatus} = await req.body;
    const workplaceList = await axios.get(sURL + '/workplace/list');
const settingResult = await axios.get(sURL + '/basicsetting/');

    const dataSearch = await {
      year: year, 
      month: month,
      concludeDate: "",
      employeeId: employeeId
    };

    
    //check accounting record in database
const accountData = await accounting.findOne({year , month , employeeId});
const dataList = [];

  //check update or save accounting
  if(updateStatus !== '') {

    if(accountData ) {
      // await accounting.deleteOne({ _id: accountData._id });
      await accounting.deleteMany({year , month , employeeId});
// accountData  = false;
    }

  }


if(accountData ) {
  // console.log(JSON.stringify(accountData ,null,2));
  await console.log('* isset accounting');
  // await console.log(accountData );
await dataList .push(accountData );
    await res.json(dataList );

} else {
  await console.log('* accounting not save');

    const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);

    const dataList = [];
  
    if (responseConclude.data.recordConclude.length > 0) {

      for (let c = 0; c < responseConclude.data.recordConclude.length; c++) {
        const data = {}; // Initialize data object inside the loop


        data.year = responseConclude.data.recordConclude[c].year;
        data.month = responseConclude.data.recordConclude[c].month;
        // data.createDate = new Date().toLocaleDateString('en-GB');
        const now = new Date();

        // Format the date and time
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // This makes sure the time is in 24-hour format
        };
        
        data.createDate = now.toLocaleString('en-GB', options);
        data.employeeId = responseConclude.data.recordConclude[c].employeeId;
        data.accountingRecord = {};

        let salary = 0;
        let countDay = 0;
        let countHour = 0;
        let countOtHour = 0;
        let amountDay = 0;
        let amountOt = 0;
        let amountSpecial = 0;
let sumCalTax = 0;
let sumCalTaxNonSalary = 0;
let sumNonTaxNonSalary = 0;
let sumDeductUncalculateTax = 0;
let sumDeductWithTax = 0;

let upsalary  = 0;
let upSalary_year  = '';
let upSalary_month  = '';

//value for report

let sumAddSalaryBeforeTaxNonSocial = 0;
let sumDeductBeforeTaxWithSocial = 0;
let sumAddSalaryBeforeTax = 0;
let sumDeductBeforeTax = 0;

let sumSocial = 0;
let tax = 0;
let costtype = '';

let sumAddSalaryAfterTax = 0;
let sumDeductAfterTax = 0;

let total = 0;

let holidayRate = 0;
let workDaylist = [];

let specialDaylist = [];
let countSpecialDay = 0;
let amountSpecialDay = 0;
let x1230 =0; let x1350 =0; let x1520 = 0; let x1535 = 0;
let addSalaryDayArray = [];
let dayOffList = [];
let dayOffSum = 0;
let dayOffSumWork = 0;
let dayOffWork = 0;
let sumAddSalary = 0;
let sumAmountDayWork = 0;
let countHourWork = 0;
let countOtHourWork = 0;

let amountOne = 0;
let amountOneFive = 0;
let amountTwo = 0;
let amountTwoFive = 0;
let amountThree = 0;
let hourOne = 0;
let hourOneFive = 0;
let hourTwo = 0;
let hourTwoFive = 0;
let hourThree = 0;
const dayW = [];


// Get employee data by employeeId
const response = await axios.get(sURL + '/employee/' + responseConclude.data.recordConclude[c].employeeId);
if (response) {
    data.workplace = await response.data.workplace;
    data.accountingRecord.tax = await response.data.tax ||0;
tax = await response.data.tax ||0; 
costtype = await response.data.costtype  ||0; 

salary = await response.data.salary || 0;

// await console.log(response.data);

//ss
// console.log(response.data.workplace );
    // Find the workplace with the matching ID
    const foundWorkplace = await workplaceList.data.find(workplace => workplace.workplaceId === response.data.workplace );

    if (foundWorkplace) {
      upsalary = await foundWorkplace.addWorkRate || 0;
      const workRateChange = await foundWorkplace.workRateChange || 0;
// Convert the string to a Date object
const date = await new Date(workRateChange);

// Get the year
upSalary_year = await date.getFullYear(); // Use getFullYear() for local time
// Get the month (0-based index, so add 1 for the correct month)
upSalary_month = await date.getMonth() + 1; // Use getMonth() for local time
//check up Salary with month and year

      amountSpecial = await foundWorkplace.holiday || 0;
      // await console.log("workTimeDay " + JSON.stringify(foundWorkplace.workTimeDay ) );

      //employee salary is not set use with workplace
      if(salary === 0 ) {
        salary = await parseFloat(foundWorkplace.workRate || 0) + parseFloat(upsalary );
      }
      
      // Found the workplace
      // await console.log('Found workplace:', foundWorkplace);
      
      // console.log(JSON.stringify( foundWorkplace.workTimeDay,null,2));
      if(foundWorkplace.workTimeDay ){
        await foundWorkplace.workTimeDay.map(item => {
          if(item.workOrStop === 'stop'){
            // console.log(JSON.stringify( item.workOrStop ,null,2));

            //get day off of week
try {
let startDay = getDayNumber(item.startDay);
let endDay = getDayNumber(item.endDay);
  // console.log('startDay '+ startDay );
  // console.log('endDay ' + endDay );

  if (startDay <= endDay) {
    for (let i = startDay; i <= endDay; i++) {
      dayOffList.push(i);
    }
} else {

    for (let j = startDay; j <= 6; j++) {
      dayOffList.push(j);
    }

    for (let k = 0; k <= endDay; k++) {
      dayOffList.push(k);
    }

}
} catch (error) {
  console.error(error.message);
}
          }
        })
      }

      console.log('dayOffList ' + dayOffList);
          // Format the new month as a two-digit string (e.g. "01", "02", ...)
    const newMonthStringX = (month -1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });
  
  // Calculate the previous month
  let previousMonthX;
  if (newMonthStringX === 0) {
      // If newMonth is January (0), the previous month is December (12)
      previousMonthX = 12;
  } else {
      // Otherwise, subtract 1 from the current month
      previousMonthX = newMonthStringX;
  }
  
  // Convert the previous month to a two-digit string (e.g. "03")
  const previousMonthStringX = previousMonthX.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });

  let endM1 = new Date(year, previousMonthStringX, 0).getDate();

      // console.log(year + '-' + month + ' ' + previousMonthStringX  + endM1);
for(m1 = 21; m1 <= endM1; m1 ++){
  let dateString = `${year}-${previousMonthStringX}-${m1.toString().padStart(2, '0')}`;
  // console.log(dateString);

  let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

  // console.log('m1 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

  if (dayOffList.includes(dayNumber)) {
      dayOffSum += 1;
  }

}

for(m2 = 1; m2 <= 20; m2 ++){
  let dateString = `${year}-${month}-${m2.toString().padStart(2, '0')}`;
  // console.log(dateString);

  let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

  // console.log('m2 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

  if (dayOffList.includes(dayNumber)) {
      dayOffSum += 1;
  }


}

console.log('dayOffSum ' + dayOffSum);
      // console.log(foundWorkplace.daysOff);

      await Promise.all( foundWorkplace.daysOff.map(async item => {

  // Parse the date string and create a Date object
  const day1 = new Date(item);
  
  // Increment the date by one day
  day1.setDate(day1.getDate() + 1);
  
  // Determine the month and year of the incremented date
  const month1= day1.getMonth();
  const month1String = (month1+ 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2, // Ensures a two-digit month (e.g. "01", "02", ...)
  });

  const  year1 = day1.getFullYear();
  
  // Create a Date object for the last day of the incremented date's month
  const lastDayOfMonth = new Date(year1, month1+ 1, 0).getDate();
  
  // Compare the incremented date with the last day of the month
  if (day1.getDate() > lastDayOfMonth) {
    // If the incremented date exceeds the last day of the month, adjust it
    day1.setDate(day1.getDate() - lastDayOfMonth);
  }
  
  // Log the adjusted date (in the format: "day/month")
  // console.log(`${day1.getDate()}/${month1String }`);

    // Format the new month as a two-digit string (e.g. "01", "02", ...)
    const newMonthString = (month -1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });
  
  // Calculate the previous month
  let previousMonth;
  if (newMonthString === 0) {
      // If newMonth is January (0), the previous month is December (12)
      previousMonth = 12;
  } else {
      // Otherwise, subtract 1 from the current month
      previousMonth = newMonthString ;
  }
  
  // Convert the previous month to a two-digit string (e.g. "03")
  const previousMonthString = previousMonth.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });

if(month !== "01" && month !== "12" && year == year1 ) {
// console.log(month + ' x ' + month1String )

  if(month == month1String && year == year1 && day1.getDate()  <= 20) {
    // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

    await specialDaylist.push(day1.getDate() );
    holidayRate = await parseFloat(response.data.salary || '0') + upsalary || parseFloat(foundWorkplace.workRate || '0') + upsalary ;
  } else {
    if(previousMonthString  == month1String && day1.getDate() >= 21) {
      console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

      await specialDaylist.push(day1.getDate() );
// holidayRate = await response.data.salary || foundWorkplace.workRate;
holidayRate = await parseFloat(response.data.salary || '0') + upsalary || parseFloat(foundWorkplace.workRate || '0') + upsalary ;
    }
  }

       } else {
        // month is 01
        if(month == "01" ) {
          if(year1 == year -1 && month1String == "12" && day1 >= 21 ) {
            await specialDaylist.push(day1.getDate() );
            // holidayRate = await response.data.salary || foundWorkplace.workRate;
            holidayRate = await parseFloat(response.data.salary || '0') + upsalary || parseFloat(foundWorkplace.workRate || '0') + upsalary ;
          }
          if(year1 == year  && month1String == "01" && day1 <= 20 ) {
            await specialDaylist.push(day1.getDate() );
            // holidayRate = await response.data.salary || foundWorkplace.workRate;
            holidayRate = await parseFloat(response.data.salary || '0') + upsalary || parseFloat(foundWorkplace.workRate || '0') + upsalary ;
          }

        }
        // month is 12
        if(month == "12" ){
          if(year1 == year  && month1String == "12" && day1 <= 20 ) {
            await specialDaylist.push(day1.getDate() );
            // holidayRate = await response.data.salary || foundWorkplace.workRate;
            holidayRate = await parseFloat(response.data.salary || '0') + upsalary || parseFloat(foundWorkplace.workRate || '0') + upsalary ;
          }

        }

       }


// console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
      })
    );

// Format the components as desired
// const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

    } else {
      // Workplace with the given ID not found
      // await console.log('Workplace not found');
    }

    // data.employeeId = responseConclude.data.recordConclude[c].employeeId;
    data.name = await response.data.name;
    data.lastName = await response.data.lastName;


    //check cal social 
    let promises = [];
    let promises1 = [];
    let promisesDeduct = [];
let addSalaryList = [];
let deductSalaryList = [];


    for (let k = 0; k < (response?.data?.addSalary?.length || 0); k++) {
      //check addSalary with tax and cal social
        const promise1 = await checkCalTax(response.data.addSalary[k].id || '0');
        const promise = await checkCalSocial(response.data.addSalary[k].id || '0');
        
        await promises.push(promise);
        await promises1.push(promise1);

        //check tax 
        if(response.data.addSalary[k].SpSalary !== ""){
        if(promise1) {
          //data cal tax

          //check cal social
if(promise) {
//data cal social
// sumAddSalaryBeforeTax = sumAddSalaryBeforeTax + parseFloat(response.data.addSalary[k].SpSalary || 0);
} else {
//data non social
// sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial  + parseFloat(response.data.addSalary[k].SpSalary || 0);
}
          // console.log('tax' + response.data.addSalary[k].id || '0'); 

        } else {
          // console.log('non tax' + response.data.addSalary[k].id || '0');
          // sumAddSalaryAfterTax  = sumAddSalaryAfterTax  + parseFloat(response.data.addSalary[k].SpSalary || 0);
        }
      }

        //push addSalary to account
        if(response.data.addSalary[k].roundOfSalary == "daily" ) {
        //   if( response.data.addSalary[k].SpSalary !== "") {
        //     let dailyTmp = await response.data.addSalary[k];
        //     dailyTmp.message = await countDay;
        //     await addSalaryList.push(dailyTmp);
        //   }

        } else {
          if( response.data.addSalary[k].SpSalary !== "") {
            //add addSalary monthly to list 
          await addSalaryList.push(response.data.addSalary[k]);
          }

        }
// console.log(response.data.addSalary[k].roundOfSalary );
    }

    for (let l = 0; l < (response?.data?.deductSalary?.length || 0); l++) {
      const promisesDeduct1 = await checkCalTax(response.data.deductSalary[l].id || '0');
      const promisesDeduct2 = await checkCalSocial(response.data.deductSalary[l].id || '0');

      await promisesDeduct.push(promisesDeduct1 );
await deductSalaryList.push(response.data.deductSalary[l] );

        //check tax 
          if(promisesDeduct1 ) {
            //data cal tax
  
            //check cal social
  if(promisesDeduct2 ) {
  //data cal social
  sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial + parseFloat(response.data.deductSalary[l].amount || 0);

  } else {
  //data non social
  sumDeductBeforeTax = sumDeductBeforeTax + parseFloat(response.data.deductSalary[l].amount || 0);

  }
  
          } else {
            sumDeductAfterTax = sumDeductAfterTax + parseFloat(response.data.deductSalary[l].amount || 0);

          }
        
  
  }

    await Promise.all(promises)
        .then(results => {
            // let sumSocial = 0;
            results.forEach((result, k) => {
                if (result === true) {
                    sumSocial += parseFloat(response.data.addSalary[k].SpSalary || 0);
                    // console.log(`Promise ${k} is resolved`);
                    // console.log(response.data.addSalary[k].SpSalary);
                }
            });
            // console.log(sumSocial);
        })
        .catch(error => {
            console.error('Error occurred while processing promises:', error);
        });
    


//check cal tax
await Promise.all(promises1)
.then(results => {
    // let sumSocial = 0;
    results.forEach((result, k) => {
        if (result === true) {
          if(response.data.addSalary[k].roundOfSalary === "daily") {
            sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
            sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0) *countDay;

          } else {
            sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0);
            sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0);

          }

            // console.log(`Promise ${k} is resolved`);
            // console.log(response.data.addSalary[k].SpSalary);
        }  else {
          if(response.data.addSalary[k].roundOfSalary === "daily") {
            sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
          } else {
            sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
          }

        }
    });
    // console.log(sumCalTax);
})
.catch(error => {
    console.error('Error occurred while processing promises:', error);
});

//check deduct calculate tax
await Promise.all(promisesDeduct)
.then(results => {
    // let sumSocial = 0;
    results.forEach((result, k) => {
        if (result === true) {
            sumDeductWithTax += parseFloat(response.data.deductSalary[k].amount || 0);

        }  else {
          // sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
          sumDeductUncalculateTax += parseFloat(response.data.deductSalary[k].amount || 0);

        }
    });
    // console.log(sumCalTax);
})
.catch(error => {
    console.error('Error occurred while processing promises:', error);
});

addSalaryDayArray = [];  

// console.log('responseConclude.data.recordConclude[c].concludeRecord' + responseConclude.data.recordConclude[0].concludeRecord);
let x  = '';
//ss1
for (let i = 0; i < responseConclude.data.recordConclude[c].concludeRecord.length; i++) {
  x=   response.data.workplace || '';
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workType == 'specialtSalary' || x[0] == '3') {
    // console.log('* ' + x[0] + JSON.stringify(responseConclude.data.recordConclude[c].concludeRecord[i]));
    amountDay += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0);
    amountOt += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT || 0);
    countHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
    countOtHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);

    if(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate ) > 0) {
      countDay += 1;
      countHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);

      let [hoursTmp, minutesTmp] = (responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || '0.0').toString().split('.').map(Number);
      let decimalFraction = (parseFloat(minutesTmp) || 0 ).toFixed(2) / 60;
    
      countOtHourWork += parseFloat(hoursTmp + decimalFraction);
  
      workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );
//count day work
dayOffWork += 1;
      console.log('process x');
    }




  }  else {

  amountDay += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0);
  amountOt += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT || 0);
  amountSpecial += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].addSalaryDay || 0);
  countHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  countOtHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);

  //convert minit to 10 base
  let [hoursTmp, minutesTmp] = (responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || '0.0').toString().split('.').map(Number);
  let decimalFraction = (parseFloat(minutesTmp) || 0).toFixed(2) / 60;

  countOtHourWork += parseFloat(hoursTmp + decimalFraction || 0);

  //get hour rate
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1') {
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1'){
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1.5') {
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
    
  }

  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1.5'){
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    // hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
    let t1 =     await Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
    let [integerPart, fractionalPart] = await t1.toString().split('.');
    let t2 = await Number(fractionalPart || 0) * 100 /60;
    hourOneFive = await Number(hourOneFive) + parseFloat(Number(integerPart || 0) + '.' + Number(t2 || 0));

  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2') {
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2'){
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2.5') {
    amountTwoFive = Number(amountTwoFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2.5'){
    amountTwoFive = Number(amountTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '3') {
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '3'){
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }

  // console.log('work rate '+ parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate ) + 'salary ' + parseFloat(salary) );

  //check work rate is not standard day
  // if(((parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) == parseFloat(salary)) || (parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) == parseFloat(salary) + parseFloat(upsalary) ) ) || parseFloat(salary) > 1660 ) {
    if (
      Math.abs(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) - parseFloat(salary)) < 0.00001 || // Check workRate == salary
      Math.abs(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) - (parseFloat(salary) + parseFloat(upsalary))) < 0.00001 || // Check workRate == salary + upsalary
      parseFloat(salary) > 1660 // Check if salary > 1660
    ) {

    
    // console.log('responseConclude.data.recordConclude[c].concludeRecord[i].workRate ' + responseConclude.data.recordConclude[c].concludeRecord[i].workRate + ' salary ' + salary)
    if(parseInt(responseConclude.data.recordConclude[c].concludeRecord[i].day) <=   20) {
      // console.log('day ' + responseConclude.data.recordConclude[c].concludeRecord[i].day);
      // console.log('responseConclude.data.recordConclude[c].concludeRecord[i].workRate ' + responseConclude.data.recordConclude[c].concludeRecord[i].workRate + ' salary ' + salary)
  
    }
  
      if(! workDaylist.includes(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] ) && responseConclude.data.recordConclude[c].concludeRecord[i].workplaceId !== '') {
        workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0]);
      dayOffWork = await dayOffWork  + 1;
    }
// dayOffWork += 1;
countHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);

// console.log('*work rate '+ parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate ) + 'salary ' + parseFloat(salary) );

  } else {
    let [hoursTmp, minutesTmp] = (responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || '0.0').toString().split('.').map(Number);
    let decimalFraction = (parseFloat(minutesTmp) || 0 ).toFixed(2) / 60;
  
    countOtHourWork += parseFloat(hoursTmp + decimalFraction);

  }

  
  if (responseConclude.data.recordConclude[c].concludeRecord[i].workRate !== undefined) {
    countDay++;

    if(dayOffList.includes( getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) ) ) {
// console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
dayOffSumWork += 1;      
    }
// console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );

    // workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );
if( parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) > 0 ) {
  workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );
}

    //check addSalary day from conclude
    // console.log("addSalary "+ JSON.stringify( responseConclude.data.recordConclude[c].addSalary ,null,2) );
// console.log(responseConclude.data.recordConclude[c].addSalary[i].length );
if(responseConclude.data.recordConclude[c].addSalary[i]) {

  let c = 0;
await responseConclude.data.recordConclude[c].addSalary[i].map( async (item, index) => {
  
  let checkAddSalaryDay  = false;
  addSalaryDayArray.map(tmp => {
if(tmp.id === item.id) {
  checkAddSalaryDay   = true;
  
  if(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate) > 0) {
    
    if(parseFloat(item.SpSalary) >= 363) {
      if((tmp.message || 0) >= 1) {
        tmp.SpSalary = (parseFloat(tmp.SpSalary) + (parseFloat(item.SpSalary)/ 30)).toFixed(2);
      } else {
        tmp.SpSalary = ((parseFloat(item.SpSalary)/ 30)*2).toFixed(2);

      }


    } else {
      tmp.SpSalary = parseFloat(tmp.SpSalary) + parseFloat(item.SpSalary);

    }
  // tmp.SpSalary = parseFloat(tmp.SpSalary) + parseFloat(item.SpSalary);
  tmp.message = parseFloat(tmp.message || 1) + 1;
  
  }

}
  })

  if (! checkAddSalaryDay ) {
    // await console.log(" push " + item.id );
    await addSalaryDayArray.push(item);
  } else {
    // await console.log('update"' + item.id );
  }

if(item.id == '1230') {
  x1230 += parseFloat(item.SpSalary);
} else
if(item.id == '1350') {
  x1350 += parseFloat(item.SpSalary);
} else
if(item.id == '1520') {
  x1520 += parseFloat(item.SpSalary);
} else
if(item.id == '1535') {
  x1535 += parseFloat(item.SpSalary);
} else {
  // console.log(item.SpSalary);
  
}

});

  }

  }

}
// await console.log('addSalaryDayArray '+ JSON.stringify(addSalaryDayArray ,null,2));

//set data to position , tel , travel
if(x1230 >0 ) {
  data.accountingRecord.amountPosition = await x1230;
}
if(x1350 >0 ) {
  data.accountingRecord.tel = x1350;
}
if(x1520 >0 ) {
  data.accountingRecord.travel = x1520;
}
if(x1535 >0 ) {
  data.accountingRecord.benefitNonSocial = x1535;
}

} //end before set value

// ในฟังก์ชัน /calsalaryemp หลังจากสร้าง concludeRecord เสร็จแล้ว
// เพิ่มการตรวจสอบ workOfWeek ก่อน
let isSpecialWorkplace7Days = false;
try {
  const wpId1 = response?.data?.workplace || '';
  const workplaceResponse = await axios.get(`${sURL}/workplace/${wpId1}`);
  const workOfWeek = workplaceResponse.data.workOfWeek || "5";
  
  if (workOfWeek === "7") {
    isSpecialWorkplace7Days = true;
    console.log(`\n✅ หน่วยงานพิเศษ 7 วัน - จะคิดเงินเพิ่มรายวันทุกวันที่มี allTimes > 0`);
  }
} catch (error) {
  console.error(`❌ ไม่สามารถตรวจสอบ workOfWeek ได้:`, error.message);
}

let totalWorkDays = 0;
if (isSpecialWorkplace7Days) {
  // นับวันที่มี totalTime (ไม่ใช่ allTimes)
  totalWorkDays = responseConclude.data.recordConclude[c].concludeRecord.filter(record => {
    // ตรวจสอบว่ามี totalTime และไม่ใช่ค่าว่าง
    return record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
  }).length;
  
  console.log(`📊 หน่วยงานพิเศษ 7 วัน - จำนวนวันทำงานจริง (จาก totalTime): ${totalWorkDays} วัน`);
  
  // แสดงรายละเอียดการนับเพื่อตรวจสอบ
  console.log(`📋 รายละเอียดการนับวัน:`);
  responseConclude.data.recordConclude[c].concludeRecord.forEach((record, index) => {
    const hasTotalTime = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
    console.log(`   วันที่ ${record.day}: totalTime = "${record.totalTime || 'ไม่มี'}" ${hasTotalTime ? '✅ นับ' : '❌ ไม่นับ'}`);
  });
}

if (isSpecialWorkplace7Days) {
  addSalaryDayArray = addSalaryDayArray.map(item => ({
    ...item,
    message: totalWorkDays.toString()  // อัปเดต message เป็นจำนวนวันจริงที่มา
  }));
  console.log(`🔧 อัปเดต addSalaryDayArray message เป็น: ${totalWorkDays}`);
}

// เพิ่มการตรวจสอบเพิ่มเติม:

// เพิ่ม log สรุปจำนวนวันที่มี totalTime (แทน allTimes)
console.log(`\n📊 === สรุป addSalaryList สำหรับหน่วยงานพิเศษ 7 วัน ===`);
let countDaysWithTotalTime = 0;

responseConclude.data.recordConclude[c].concludeRecord.forEach((record, index) => {
  if (record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0) {
    countDaysWithTotalTime++;
  }
});

console.log(`📅 จำนวนวันที่มี totalTime > 0: ${countDaysWithTotalTime} วัน`);
console.log(`💵 จำนวน addSalaryDayArray: ${addSalaryDayArray.length} รายการ`);
console.log(`✅ ต้องตรงกัน: ${countDaysWithTotalTime === totalWorkDays ? 'ถูกต้อง' : 'ไม่ตรงกัน!'}`);

// ตรวจสอบค่า message หลังจากอัปเดต
if (isSpecialWorkplace7Days && addSalaryDayArray.length > 0) {
  console.log(`\n📝 ตรวจสอบค่า message หลังอัปเดต:`);
  addSalaryDayArray.forEach((item, index) => {
    console.log(`   - ${item.name} (ID: ${item.id}): message = "${item.message}"`);
  });
}

responseConclude.data.recordConclude[c].concludeRecord.forEach((record, index) => {
  if (parseFloat(record.allTimes || 0) > 0) {
    countDaysWithAllTimes++;
  }
});

console.log(`📅 จำนวนวันที่มี totalTime > 0: ${countDaysWithTotalTime} วัน`);
console.log(`💵 จำนวน addSalaryDayArray: ${addSalaryDayArray.length} รายการ`);
console.log(`✅ ต้องตรงกัน: ${countDaysWithTotalTime === totalWorkDays ? 'ถูกต้อง' : 'ไม่ตรงกัน!'}`);

// ตรวจสอบค่า message หลังจากอัปเดต
if (isSpecialWorkplace7Days && addSalaryDayArray.length > 0) {
  console.log(`\n📝 ตรวจสอบค่า message หลังอัปเดต:`);
  addSalaryDayArray.forEach((item, index) => {
    console.log(`   - ${item.name} (ID: ${item.id}): message = "${item.message}"`);
  });
}

data.accountingRecord.countDay = countDay;
data.accountingRecord.countHour = countHour;
data.accountingRecord.countOtHour = countOtHour;

data.accountingRecord.amountDay = amountDay;
data.accountingRecord.amountOt = amountOt;


// sumSocial = await sumSocial + amountDay;
sumCalTax = await sumCalTax + amountDay;
sumCalTax = await sumCalTax + amountOt;
console.log(addSalaryDayArray.length);

//concat addSalary
addSalaryList  = await addSalaryList .concat(addSalaryDayArray);
console.log(addSalaryList .length);
// Variables for summation
let sumAddSalaryBeforeTaxTmp = 0;
let sumAddSalaryBeforeTaxNonSocialTmp = 0;
let sumAddSalaryAfterTaxTmp = 0;

await addSalaryList.forEach(item => {
total = total + parseFloat( item.SpSalary || 0);
sumAddSalary = sumAddSalary + parseFloat( item.SpSalary || 0);

});

//check addSalary with cal tax and social 
await (async () => {
  await Promise.all(addSalaryList.map(async item => {

    if(item.id === '1230' || item.id === '1350' || item.id === '1520' || item.id === '1535' || item.id === '1410') {
      if(item.id === '1230') {
          data.accountingRecord.amountPosition = await item.SpSalary || 0;
      }  else {
        // data.accountingRecord.amountPosition =  await 0;
      }
          if(item.id === '1350' ) {
  data.accountingRecord.tel = await item.SpSalary || 0;
          }  else {
            // data.accountingRecord.tel = await 0;
          }
if(item.id === '1520') {
  data.accountingRecord.travel = await item.SpSalary || 0;
}  else {
  // data.accountingRecord.travel =  await 0;
}
if(item.id === '1535') {
  data.accountingRecord.benefitNonSocial = await item.SpSalary || 0;
} else {
  // data.accountingRecord.benefitNonSocial = await 0;
}
if(item.id === '1410') {
  data.accountingRecord.amountHardWorking = await item.SpSalary || 0;
} else {
  // data.accountingRecord.benefitNonSocial = await 0;
}

    } else {

    let taxStatus = await checkCalTax(item.id);
    // console.log('taxStatus ' + item.id + ' ' + taxStatus + ' ' + item.SpSalary);

    if (taxStatus) {
      // Calculate tax
      let socialStatus = await checkCalSocial(item.id);
      // console.log('socialStatus ' + item.id + ' ' + socialStatus + ' ' + item.SpSalary);

      if (socialStatus) {
        // Calculate social
        sumAddSalaryBeforeTaxTmp += parseFloat(item.SpSalary);
      } else {
        // Non-social
        sumAddSalaryBeforeTaxNonSocialTmp += parseFloat(item.SpSalary);
      }
    } else {
      // Non-tax
      sumAddSalaryAfterTaxTmp += parseFloat(item.SpSalary);
    }
  }

  }));

  sumAddSalaryBeforeTax = sumAddSalaryBeforeTaxTmp;
  sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocialTmp;
  sumAddSalaryAfterTax = sumAddSalaryAfterTaxTmp;
  // console.log('sumAddSalaryBeforeTax ' + sumAddSalaryBeforeTax);
  // console.log('sumAddSalaryBeforeTaxNonSocial ' + sumAddSalaryBeforeTaxNonSocial);
  // console.log('sumAddSalaryAfterTax ' + sumAddSalaryAfterTax);

})();

//check isset amountPosition , tel, travel and benefitNonSocial
if (data?.accountingRecord?.amountPosition ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is false
    data.accountingRecord.amountPosition =  await 0;
}
if (data?.accountingRecord?.tel ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.tel =  await 0;
}
if (data?.accountingRecord?.travel ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.travel =  await 0;
}
if (data?.accountingRecord?.benefitNonSocial ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.benefitNonSocial =  await 0;
}
if (data?.accountingRecord?.amountHardWorking ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.amountHardWorking =  await 0;
}

// await console.log(sumSocial );

const intersection = await workDaylist.filter(day => specialDaylist.includes(Number(day) ));
// console.log('workDaylist :' + workDaylist );
console.log('');
console.log('specialDaylist ' + JSON.stringify(specialDaylist,null,2) );

await console.log(data.employeeId + ' ' + month);
// await console.log('workDaylist' + JSON.stringify(workDaylist,null,2))
await console.log('specialDaylist' + JSON.stringify(specialDaylist,null,2));

await console.log('intersection: ' + intersection); // Output: ['2', '3', '4']
await console.log('total ' + total );
// console.log('specialDaylist.length ' + specialDaylist.length + 'intersection.length '+ intersection.length + 'holidayRate '+ holidayRate )
let s1 = await specialDaylist.length ||0;
let s2 = await intersection.length || 0;
let calSP = await ((s1 - s2) * parseFloat(holidayRate) );
console.log('s1 ' + s1);
console.log('s2 ' + s2);

console.log('calSP '+ calSP );
// sumSocial  = await sumSocial  + calSP ;

let workDaySocial = await countDay - dayOffSum - s2;


if(salary > 1660 ){
  sumSocial = await sumSocial  + (dayOffWork * (salary /30 )) + calSP ;
  sumAmountDayWork  = await parseFloat(dayOffWork) * (parseFloat(salary) /30);
  let  calOtWork = await amountOt;

  data.accountingRecord.amountSpecialDay= await 0;
data.accountingRecord.amountCountDayWorkOt = await calOtWork ||0;

//salary 
data.accountingRecord.amountCountDayWork = await salary ||0;

} else {
  sumSocial = await sumSocial  + (dayOffWork * salary) + calSP ;
  if(x[0] == '3') {
  sumAmountDayWork  = await amountDay;
    data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;

  } else {
  sumAmountDayWork  = await parseFloat(dayOffWork) * parseFloat(salary);
    data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;
    
  }

  // sumAmountDayWork  = await parseFloat(dayOffWork) * parseFloat(salary);
  let  calOtWork = await (parseFloat(amountDay) - parseFloat(sumAmountDayWork ) ) + parseFloat(amountOt) || 0;

  data.accountingRecord.amountSpecialDay= await calSP ||0;
  data.accountingRecord.amountCountDayWorkOt = await calOtWork ||0;

  //non salary     
  // data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;
    // data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;

}

await console.log('countDay '+ countDay + ' dayOffSumWork ' + dayOffSumWork  + ' s2 '  +s2 + 'workDaySocial ' + workDaySocial );
console.log('workDaySocial '+ (workDaySocial * salary) + 'sumSocial '+ sumSocial );



    // Other properties
    // data.accountingRecord.amountSpecialDay= await calSP ||0;
    data.accountingRecord.countDayWork = await dayOffWork ||0;
    // data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;
    // data.accountingRecord.amountCountDayWorkOt = await calOtWork ||0;
    data.accountingRecord.countHourWork = await countHourWork ||0;
    data.accountingRecord.countOtHourWork = await countOtHourWork || 0;

    //data for hour amount
    data.accountingRecord.amountOne = await amountOne ||0;
    data.accountingRecord.hourOne = await hourOne ||0;
    data.accountingRecord.amountOneFive = await amountOneFive ||0;
    data.accountingRecord.hourOneFive = await hourOneFive ||0;
    data.accountingRecord.amountTwo = await amountTwo ||0;
    data.accountingRecord.hourTwo = await hourTwo ||0;
    data.accountingRecord.amountTwoFive = await amountTwoFive ||0;
    data.accountingRecord.hourTwoFive = await hourTwoFive ||0;
    data.accountingRecord.amountThree = await amountThree ||0;
    data.accountingRecord.hourThree = await hourThree ||0;


    data.accountingRecord.amountHoliday = 0;
    data.accountingRecord.addAmountBeforeTax = sumCalTaxNonSalary || 0;
    data.accountingRecord.deductBeforeTax = sumDeductWithTax || 0;
    // data.accountingRecord.tax = sumCalTax || 0;
    // Assuming sumSocial is defined somewhere before this code
// Check if sumSocial is greater than 15000
if (sumSocial > 15000) {
  sumSocial = await 15000; // Set sumSocial to 15000
}
if (sumSocial < 1650) {
  sumSocial = await 83; // Set sumSocial to 83
}

// Calculate socialSecurity based on sumSocial
// data.accountingRecord.socialSecurity = Math.ceil((sumSocial * 0.05)) || 0;

//คำนวนหัก ณ ที่จ่าย 3 %
if( costtype === "ภ.ง.ด.3"){
tax = await (total  + amountDay + amountOt + calSP ) * 0.03;
data.accountingRecord.tax = await tax|| 0;
data.accountingRecord.socialSecurity = 0;

//total
await total  + amountDay + amountOt + calSP -(Math.ceil((sumSocial * 0.05) || 0)) ;
data.accountingRecord.total = await total || 0;

} else {
  // data.accountingRecord.socialSecurity = Math.ceil((sumSocial * 0.05)) || 0;
  // data.accountingRecord.socialSecurity = Math.ceil((sumSocial * (parseFloat(settingResult?.data?.[settingResult.data.length -1]?.social?.[0]?.socialPercent || '5')/ 100 ) )) || 0;
  data.accountingRecord.socialSecurity = Math.round(
    sumSocial * (parseFloat(settingResult?.data?.[settingResult.data.length - 1]?.social?.[0]?.socialPercent || '5') / 100)
  ) || 0;
  
//total
total = await total  + amountDay + amountOt + calSP -(Math.ceil((sumSocial * 0.05) || 0)) - tax;
data.accountingRecord.total = await total || 0;

}

    // data.accountingRecord.socialSecurity = (sumSocial * 0.05) || 0;
    data.accountingRecord.addAmountAfterTax = sumNonTaxNonSalary || 0;
    // data.accountingRecord.advancePayment = 0;
    data.accountingRecord.deductAfterTax = sumDeductUncalculateTax || 0;
    data.accountingRecord.bank = 0;
    // data.accountingRecord.total = total || 0;

    data.accountingRecord.sumAddSalaryBeforeTax = sumAddSalaryBeforeTax || 0;
    data.accountingRecord.sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial || 0;
    data.accountingRecord.sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial || 0;
    data.accountingRecord.sumDeductBeforeTax = sumDeductBeforeTax || 0;
    data.accountingRecord.sumAddSalaryAfterTax = sumAddSalaryAfterTax || 0;
    data.accountingRecord.sumDeductAfterTax = sumDeductAfterTax || 0;

    data.accountingRecord.sumSalaryForTax = sumCalTax || 0;

    data.accountingRecord.sumAddSalary = await sumAddSalary ||0;

    data.addSalary = await addSalaryList || [];

data.deductSalary = deductSalaryList || [];

data.specialDayRate = await holidayRate || 0;
data.countSpecialDay = await specialDaylist.length || 0;
data.specialDayListWork = await intersection || [];
//end point


}

//check emty data 
if(1 == 1 ||  data.accountingRecord.countDayWork > 0 || data.accountingRecord.total  > 0) {
const salaryRecord = new accounting(data);
await salaryRecord.save();
// await console.log(salaryRecord);

        dataList.push(data);
}  else {
  dataList.push([]);
  console.log('emty data not save');
}

// console.log('upsalary ' + upsalary);
console.log('upsalary year' + upSalary_year + ' month ' + upSalary_month);

      }
    } else {
      console.log('no data conclude');
    }

    // console.log(JSON.stringify(dataList, null, 2));

    if (dataList.length > 0) {
      res.json(dataList);
    } else {
      res.status(404).json({ error: 'accounting not found' });
    }
  }     //check accounting record in database

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }


});



  router.post('/calsalary', async (req, res) => {
    // router.get('/:employeeId', async (req, res) => {

const data = await {};

  try {
    const {
      year, 
      month,
      employeeId 
    } = await req.body;

    const dataSearch = await {
      year: year, 
      month: month,
      concludeDate: "",
      employeeId : employeeId 
      // req.params.employeeId
    };
await console.log(dataSearch);

//get data from conclude record
    const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);
    await console.log(responseConclude.data.recordConclude.length );
    if(responseConclude.data.recordConclude.length > 0 ) {
      // console.log(responseConclude.data.recordConclude.length );
// await console.log(JSON.stringify(responseConclude.data,null,2) );

data.year = await responseConclude.data.recordConclude[0].year; 
data.month = await responseConclude.data.recordConclude[0].month;
data.createDate = await new Date().toLocaleDateString('en-GB');
data.employeeId = await responseConclude.data.recordConclude[0].employeeId;
data.accountingRecord  = await {};

// data.accountingRecord.countDay = await responseConclude.data.recordConclude[0].concludeRecord.length;

let countDay  = await 0;
let amountDay = await 0;
let amountOt = await 0;
let amountSpecial  = await 0;
//loop count data
// await console.log(responseConclude.data.recordConclude[0].concludeRecord);
for(let i =0; i < responseConclude.data.recordConclude[0].concludeRecord.length; i++) {
  amountDay  = await amountDay + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].workRate || 0 );
  amountOt = await amountOt + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].workRateOT || 0 );
  amountSpecial = await amountSpecial + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].addSalaryDay || 0 );


  if(responseConclude.data.recordConclude[0].concludeRecord[i].workRate !== '' ){
    countDay  = await countDay   + 1;
  }
}
// await console.log(amountSpecial );

data.accountingRecord.countDay = await countDay;
data.accountingRecord.amountDay = await amountDay  ;
data.accountingRecord.amountOt = await amountOt;
data.accountingRecord.amountSpecial = await amountSpecial;

// await console.log(responseConclude.data.recordConclude[0].concludeRecord.length);

//xxxx
    } else {
console.log('no data conclude');
    }

    //get employee data by employeeId
      const response = await axios.get(sURL + '/employee/'+ employeeId);
      if(response) {
        data.workplace = await response.data.workplace;
console.log(response.data.addSalary.length);

let position1230 = await '1230';
const addSalary = await response.data.addSalary.find(salary => salary.id === position1230 );

if (addSalary) {
  // console.log('Found addSalary:', addSalary);
  data.accountingRecord.amountPosition = await addSalary.SpSalary;
  // Handle addSalary found
} else {
  // console.log('No addSalary found with the provided ID.');
  data.accountingRecord.amountPosition = await 0;
  // Handle no addSalary found
}

let hardwork1410 = await '1410';
const addSalary1 = await response.data.addSalary.find(salary => salary.id === hardwork1410 );

if (addSalary1) {
  data.accountingRecord.amountHardWorking= await addSalary1.SpSalary;
} else {
  data.accountingRecord.amountHardWorking= await 0;
}

//xxxx
data.accountingRecord.amountHoliday = await 0;
data.accountingRecord.addAmountBeforeTax = await 0;
data.accountingRecord.tax = await 0;
data.accountingRecord.socialSecurity = await 0;
data.accountingRecord.addAmountAfterTax = await 0;
data.accountingRecord.advancePayment = await 0;
data.accountingRecord.deductAfterTax = await 0;
data.accountingRecord.deductBeforeTax = await 10;

data.accountingRecord.bank = await 0;
data.accountingRecord.total = await 0;

      }
    // await console.log(response.data.workplace );
    // console.log(data);

    // const accountingData = await accounting.findOne({ employeeId: req.params.employeeId});


    // if (accountingData ) {
      if (data) {

      res.json(data);
    } else {
      res.status(404).json({ error: 'accounting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});

//======


//get all accounting
router.post('/calsalarylist', async (req, res) => {
  try {
    const { year, month } = req.body;
    const workplaceList = await axios.get(sURL + '/workplace/list');
    const settingResult = await axios.get(sURL + '/basicsetting/');
    
    if(year == '' ) {
      year = new Date().getFullYear();
    }

    const dataSearch = await
    {
      year: year || new Date().getFullYear(), 
      month: month,
      concludeDate: "",
      employeeId: ''
    };

        const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);
    
        const dataList = [];
    
        if (responseConclude.data.recordConclude && Array.isArray(responseConclude.data.recordConclude) && responseConclude.data.recordConclude.length > 0) {
    

          for (let c = 0; c < responseConclude.data.recordConclude.length; c++) {
    //check accounting record in database
    // let empId = await responseConclude.data.recordConclude[c].employeeId;
    let empId = await '';
    console.log('x'+ responseConclude.data.recordConclude[c].employeeId);

    if (responseConclude.data.recordConclude[c].employeeId == '' ) {
      continue;
    }    else {
      empId = await responseConclude.data.recordConclude[c].employeeId;

    }
          // Log the values to debug
          console.log(`Searching for year: ${year}, month: ${month}, empId: ${empId}`);

    // const accountData = await accounting.findOne({year , month , empId});
      // Ensure empId is used correctly in the query
      const accountData = await accounting.findOne({ year: year, month: month, employeeId: empId });

      // Log the result to debug
      // console.log('accountData:', accountData);

    if(accountData ) {
      // console.log(JSON.stringify(accountData ,null,2));
      await console.log('* isset accounting');
      // await console.log(accountData );
    await dataList .push(accountData );
    
    } else {
      await console.log('* accounting not save');

            const data = {}; // Initialize data object inside the loop
    
    
            data.year = responseConclude.data.recordConclude[c].year;
            data.month = responseConclude.data.recordConclude[c].month;
            // data.createDate = new Date().toLocaleDateString('en-GB');
            const now = new Date();
    
            // Format the date and time
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // This makes sure the time is in 24-hour format
            };
            
            data.createDate = now.toLocaleString('en-GB', options);
            data.employeeId = responseConclude.data.recordConclude[c].employeeId || '';
            data.accountingRecord = {};
    
            let salary = 0;
            let countDay = 0;
            let countHour = 0;
            let countOtHour = 0;
            let amountDay = 0;
            let amountOt = 0;
            let amountSpecial = 0;
    let sumCalTax = 0;
    let sumCalTaxNonSalary = 0;
    let sumNonTaxNonSalary = 0;
    let sumDeductUncalculateTax = 0;
    let sumDeductWithTax = 0;
    
    //value for report
    
    let sumAddSalaryBeforeTaxNonSocial = 0;
    let sumDeductBeforeTaxWithSocial = 0;
    let sumAddSalaryBeforeTax = 0;
    let sumDeductBeforeTax = 0;
    
    let sumSocial = 0;
    let tax = 0;
    
    let sumAddSalaryAfterTax = 0;
    let sumDeductAfterTax = 0;
    
    let total = 0;
    
    let holidayRate = 0;
    let workDaylist = [];
    
    let specialDaylist = [];
    let countSpecialDay = 0;
    let amountSpecialDay = 0;
    let x1230 =0; let x1350 =0; let x1520 = 0; let x1535 = 0;
    let addSalaryDayArray = [];
    let dayOffList = [];
    let dayOffSum = 0;
    let dayOffSumWork = 0;
    let dayOffWork = 0;
    let sumAddSalary = 0;
    let sumAmountDayWork = 0;
    let countHourWork = 0;
    let countOtHourWork = 0;
    
    let amountOne = 0;
let amountOneFive = 0;
let amountTwo = 0;
let amountTwoFive = 0;
let amountThree = 0;
let hourOne = 0;
let hourOneFive = 0;
let hourTwo = 0;
let hourTwoFive = 0;
let hourThree = 0;
const dayW = [];

const response = '';

    // Get employee data by employeeId
    if(responseConclude.data.recordConclude[c].employeeId === '') {
      const response = null;
    } else {
      const response = await axios.get(sURL + '/employee/' + responseConclude.data.recordConclude[c].employeeId);
    }

    // const response = await axios.get(sURL + '/employee/' + responseConclude.data.recordConclude[c].employeeId);
    if (response) {
        data.workplace = await response.data.workplace || '';
        data.accountingRecord.tax = await response.data.tax ||0;
    tax = await response.data.tax ||0; 
    salary = await response.data.salary || 0;
    
    // await console.log(response.data);
    
    //ss
    // console.log(response.data.workplace );
        // Find the workplace with the matching ID
        const foundWorkplace = await workplaceList.data.find(workplace => workplace.workplaceId === response.data.workplace );
    
        if (foundWorkplace) {
          amountSpecial = await foundWorkplace.holiday || 0;
          // await console.log("workTimeDay " + JSON.stringify(foundWorkplace.workTimeDay ) );
    
          //employee salary is not set use with workplace
          if(salary === 0 ) {
            salary = await parseFloat(foundWorkplace.workRate|| 0);
          }
          
          // Found the workplace
          // await console.log('Found workplace:', foundWorkplace);
          
          // console.log(JSON.stringify( foundWorkplace.workTimeDay,null,2));
          if(foundWorkplace.workTimeDay ){
            await foundWorkplace.workTimeDay.map(item => {
              if(item.workOrStop === 'stop'){
                // console.log(JSON.stringify( item.workOrStop ,null,2));
    
                //get day off of week
    try {
    let startDay = getDayNumber(item.startDay);
    let endDay = getDayNumber(item.endDay);
      console.log('startDay '+ startDay );
      console.log('endDay ' + endDay );
    
      if(startDay <= endDay) {
        if(startDay === endDay) {
          dayOffList.push(startDay);
        } else {
          for(let i = startDay; i <= endDay; i++) {
            dayOffList.push(i);
          }
        }
      
      } else {
        for(let i = endDay; i <= 6; i++){
          dayOffList.push(i);
        }
        for(let j = 0; j <= startDay ; j++){
          dayOffList.push(j);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
              }
            })
          }
    
          // console.log('dayOffList ' + dayOffList);
              // Format the new month as a two-digit string (e.g. "01", "02", ...)
        const newMonthStringX = (month -1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
      });
      
      // Calculate the previous month
      let previousMonthX;
      if (newMonthStringX === 0) {
          // If newMonth is January (0), the previous month is December (12)
          previousMonthX = 12;
      } else {
          // Otherwise, subtract 1 from the current month
          previousMonthX = newMonthStringX;
      }
      
      // Convert the previous month to a two-digit string (e.g. "03")
      const previousMonthStringX = previousMonthX.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
      });
    
      let endM1 = new Date(year, previousMonthStringX, 0).getDate();
    
          // console.log(year + '-' + month + ' ' + previousMonthStringX  + endM1);
    for(m1 = 21; m1 <= endM1; m1 ++){
      let dateString = `${year}-${previousMonthStringX}-${m1.toString().padStart(2, '0')}`;
      // console.log(dateString);
    
      let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)
    
      // console.log('m1 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));
    
      if (dayOffList.includes(dayNumber)) {
          dayOffSum += 1;
      }
    
    }
    
    for(m2 = 1; m2 <= 20; m2 ++){
      let dateString = `${year}-${month}-${m2.toString().padStart(2, '0')}`;
      // console.log(dateString);
    
      let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)
    
      // console.log('m2 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));
    
      if (dayOffList.includes(dayNumber)) {
          dayOffSum += 1;
      }
    
    
    }
    
    console.log('dayOffSum ' + dayOffSum);
          // console.log(foundWorkplace.daysOff);
    
          await Promise.all( foundWorkplace.daysOff.map(async item => {
    
      // Parse the date string and create a Date object
      const day1 = new Date(item);
      
      // Increment the date by one day
      day1.setDate(day1.getDate() + 1);
      
      // Determine the month and year of the incremented date
      const month1= day1.getMonth();
      const month1String = (month1+ 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2, // Ensures a two-digit month (e.g. "01", "02", ...)
      });
    
      const  year1 = day1.getFullYear();
      
      // Create a Date object for the last day of the incremented date's month
      const lastDayOfMonth = new Date(year1, month1+ 1, 0).getDate();
      
      // Compare the incremented date with the last day of the month
      if (day1.getDate() > lastDayOfMonth) {
        // If the incremented date exceeds the last day of the month, adjust it
        day1.setDate(day1.getDate() - lastDayOfMonth);
      }
      
      // Log the adjusted date (in the format: "day/month")
      // console.log(`${day1.getDate()}/${month1String }`);
    
        // Format the new month as a two-digit string (e.g. "01", "02", ...)
        const newMonthString = (month -1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
      });
      
      // Calculate the previous month
      let previousMonth;
      if (newMonthString === 0) {
          // If newMonth is January (0), the previous month is December (12)
          previousMonth = 12;
      } else {
          // Otherwise, subtract 1 from the current month
          previousMonth = newMonthString ;
      }
      
      // Convert the previous month to a two-digit string (e.g. "03")
      const previousMonthString = previousMonth.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
      });
    
    if(month !== "01" && month !== "12" && year == year1 ) {
    // console.log(month + ' x ' + month1String )
    
      if(month == month1String && year == year1 && day1.getDate()  <= 20) {
        // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
    
        await specialDaylist.push(day1.getDate() );
        holidayRate = await response.data.salary || foundWorkplace.workRate;
      } else {
        if(previousMonthString  == month1String && day1.getDate() >= 21) {
          console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
    
          await specialDaylist.push(day1.getDate() );
    holidayRate = await response.data.salary || foundWorkplace.workRate;
        }
      }
    
           } else {
            // month is 01
            if(month == "01" ) {
              if(year1 == year -1 && month1String == "12" && day1 >= 21 ) {
                await specialDaylist.push(day1.getDate() );
                holidayRate = await response.data.salary || foundWorkplace.workRate;
              }
              if(year1 == year  && month1String == "01" && day1 <= 20 ) {
                await specialDaylist.push(day1.getDate() );
                holidayRate = await response.data.salary || foundWorkplace.workRate;
              }
    
            }
            // month is 12
            if(month == "12" ){
              if(year1 == year  && month1String == "12" && day1 <= 20 ) {
                await specialDaylist.push(day1.getDate() );
                holidayRate = await response.data.salary || foundWorkplace.workRate;
              }
    
            }
    
           }
    
    
    // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
          })
        );
    
    // Format the components as desired
    // const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    
        } else {
          // Workplace with the given ID not found
          // await console.log('Workplace not found');
        }
    
        // data.employeeId = responseConclude.data.recordConclude[c].employeeId;
        data.name = await response.data.name;
        data.lastName = await response.data.lastName;
    
    
        //check cal social 
        let promises = [];
        let promises1 = [];
        let promisesDeduct = [];
    let addSalaryList = [];
    let deductSalaryList = [];
    
    
        for (let k = 0; k < response.data.addSalary.length; k++) {
          //check addSalary with tax and cal social
            const promise1 = await checkCalTax(response.data.addSalary[k].id || '0');
            const promise = await checkCalSocial(response.data.addSalary[k].id || '0');
            
            await promises.push(promise);
            await promises1.push(promise1);
    
            //check tax 
            if(response.data.addSalary[k].SpSalary !== ""){
            if(promise1) {
              //data cal tax
    
              //check cal social
    if(promise) {
    //data cal social
    // sumAddSalaryBeforeTax = sumAddSalaryBeforeTax + parseFloat(response.data.addSalary[k].SpSalary || 0);
    } else {
    //data non social
    // sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial  + parseFloat(response.data.addSalary[k].SpSalary || 0);
    }
              // console.log('tax' + response.data.addSalary[k].id || '0'); 
    
            } else {
              // console.log('non tax' + response.data.addSalary[k].id || '0');
              // sumAddSalaryAfterTax  = sumAddSalaryAfterTax  + parseFloat(response.data.addSalary[k].SpSalary || 0);
            }
          }
    
            //push addSalary to account
            if(response.data.addSalary[k].roundOfSalary == "daily" ) {
            //   if( response.data.addSalary[k].SpSalary !== "") {
            //     let dailyTmp = await response.data.addSalary[k];
            //     dailyTmp.message = await countDay;
            //     await addSalaryList.push(dailyTmp);
            //   }
    
            } else {
              if( response.data.addSalary[k].SpSalary !== "") {
                //add addSalary monthly to list 
              await addSalaryList.push(response.data.addSalary[k]);
              }
    
            }
    // console.log(response.data.addSalary[k].roundOfSalary );
        }
    
        for (let l = 0; l < response.data.deductSalary.length; l++) {
          const promisesDeduct1 = await checkCalTax(response.data.deductSalary[l].id || '0');
          const promisesDeduct2 = await checkCalSocial(response.data.deductSalary[l].id || '0');
    
          await promisesDeduct.push(promisesDeduct1 );
    await deductSalaryList.push(response.data.deductSalary[l] );
    
            //check tax 
              if(promisesDeduct1 ) {
                //data cal tax
      
                //check cal social
      if(promisesDeduct2 ) {
      //data cal social
      sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial + parseFloat(response.data.deductSalary[l].amount || 0);
    
      } else {
      //data non social
      sumDeductBeforeTax = sumDeductBeforeTax + parseFloat(response.data.deductSalary[l].amount || 0);
    
      }
      
              } else {
                sumDeductAfterTax = sumDeductAfterTax + parseFloat(response.data.deductSalary[l].amount || 0);
    
              }
            
      
      }
    
        await Promise.all(promises)
            .then(results => {
                // let sumSocial = 0;
                results.forEach((result, k) => {
                    if (result === true) {
                        sumSocial += parseFloat(response.data.addSalary[k].SpSalary || 0);
                        // console.log(`Promise ${k} is resolved`);
                        // console.log(response.data.addSalary[k].SpSalary);
                    }
                });
                // console.log(sumSocial);
            })
            .catch(error => {
                console.error('Error occurred while processing promises:', error);
            });
        
    
    
    //check cal tax
    await Promise.all(promises1)
    .then(results => {
        // let sumSocial = 0;
        results.forEach((result, k) => {
            if (result === true) {
              if(response.data.addSalary[k].roundOfSalary === "daily") {
                sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
                sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0) *countDay;
    
              } else {
                sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0);
                sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0);
    
              }
    
                // console.log(`Promise ${k} is resolved`);
                // console.log(response.data.addSalary[k].SpSalary);
            }  else {
              if(response.data.addSalary[k].roundOfSalary === "daily") {
                sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
              } else {
                sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
              }
    
            }
        });
        // console.log(sumCalTax);
    })
    .catch(error => {
        console.error('Error occurred while processing promises:', error);
    });
    
    //check deduct calculate tax
    await Promise.all(promisesDeduct)
    .then(results => {
        // let sumSocial = 0;
        results.forEach((result, k) => {
            if (result === true) {
                sumDeductWithTax += parseFloat(response.data.deductSalary[k].amount || 0);
    
            }  else {
              // sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
              sumDeductUncalculateTax += parseFloat(response.data.deductSalary[k].amount || 0);
    
            }
        });
        // console.log(sumCalTax);
    })
    .catch(error => {
        console.error('Error occurred while processing promises:', error);
    });
    
    addSalaryDayArray = [];  
    
    //ss1
    for (let i = 0; i < responseConclude.data.recordConclude[c].concludeRecord.length; i++) {
      amountDay += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0);
      amountOt += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT || 0);
      amountSpecial += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].addSalaryDay || 0);
      countHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
      countOtHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);

      let [hoursTmp, minutesTmp] = responseConclude.data.recordConclude[c].concludeRecord[i].otTimes.toString().split('.').map(Number);
      let decimalFraction = parseFloat(minutesTmp).toFixed(2) / 60;
    
      countOtHourWork += parseFloat(hoursTmp + decimalFraction);

      let checkDaywork = 0;

  //get hour rate
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1') {
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
    checkDaywork = Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1'){
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1.5') {
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1.5'){
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2') {
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2'){
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2.5') {
    amountTwoFive = Number(amountTwoFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2.5'){
    amountTwoFive = Number(amountTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '3') {
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '3'){
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }

      //check work rate is not standard day
      // if(Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0) == Number(salary) ) {
        if(checkDaywork !== 0) {
if(! dayW.includes( getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) )){
    dayOffWork += 1;
    dayW.push(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
  } 

  
    countHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);

    console.log('work rate '+ parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate ) + 'salary ' + parseFloat(salary) );
    
      } else {
        let [hoursTmp, minutesTmp] = responseConclude.data.recordConclude[c].concludeRecord[i].otTimes.toString().split('.').map(Number);
        let decimalFraction = parseFloat(minutesTmp).toFixed(2) / 60;
      
        countOtHourWork += parseFloat(hoursTmp + decimalFraction);
      }
    
    
      if (responseConclude.data.recordConclude[c].concludeRecord[i].workRate !== undefined) {
        countDay++;
    
        if(dayOffList.includes( getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) ) ) {
    // console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
    dayOffSumWork += 1;      
        }
    // console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
    
        workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );
    
        //check addSalary day from conclude
        // console.log("addSalary "+ JSON.stringify( responseConclude.data.recordConclude[c].addSalary ,null,2) );
    // console.log(responseConclude.data.recordConclude[c].addSalary[i].length );
    if(responseConclude.data.recordConclude[c].addSalary[i]) {
    
    await responseConclude.data.recordConclude[c].addSalary[i].map( async (item, index) => {
    
      let checkAddSalaryDay  = false;
      addSalaryDayArray.map(tmp => {
    if(tmp.id === item.id) {
      checkAddSalaryDay   = true;
      tmp.SpSalary = parseFloat(tmp.SpSalary) + parseFloat(item.SpSalary);
      tmp.message = parseFloat(tmp.message || 1) + 1;
    
    }
      })
    
      if (! checkAddSalaryDay ) {
        // await console.log(" push " + item.id );
        await addSalaryDayArray.push(item);
      } else {
        // await console.log('update"' + item.id );
      }
    
    if(item.id == '1230') {
      x1230 += parseFloat(item.SpSalary);
    } else
    if(item.id == '1350') {
      x1350 += parseFloat(item.SpSalary);
    } else
    if(item.id == '1520') {
      x1520 += parseFloat(item.SpSalary);
    } else
    if(item.id == '1535') {
      x1535 += parseFloat(item.SpSalary);
    } else {
      // console.log(item.SpSalary);
      
    }
    
    });
    
      }
    
      }
    
    }
    // await console.log('addSalaryDayArray '+ JSON.stringify(addSalaryDayArray ,null,2));
    
    //set data to position , tel , travel
    if(x1230 >0 ) {
      data.accountingRecord.amountPosition = await x1230;
    }
    if(x1350 >0 ) {
      data.accountingRecord.tel = x1350;
    }
    if(x1520 >0 ) {
      data.accountingRecord.travel = x1520;
    }
    if(x1535 >0 ) {
      data.accountingRecord.benefitNonSocial = x1535;
    }
    
    
    data.accountingRecord.countDay = countDay;
    data.accountingRecord.countHour = countHour;
    data.accountingRecord.countOtHour = countOtHour;
    
    data.accountingRecord.amountDay = amountDay;
    data.accountingRecord.amountOt = amountOt;
    
    
    // sumSocial = await sumSocial + amountDay;
    sumCalTax = await sumCalTax + amountDay;
    sumCalTax = await sumCalTax + amountOt;
    console.log(addSalaryDayArray.length);
    
    //concat addSalary
    addSalaryList  = await addSalaryList .concat(addSalaryDayArray);
    console.log(addSalaryList .length);
    // Variables for summation
    let sumAddSalaryBeforeTaxTmp = 0;
    let sumAddSalaryBeforeTaxNonSocialTmp = 0;
    let sumAddSalaryAfterTaxTmp = 0;
    
    await addSalaryList.forEach(item => {
    total = total + parseFloat( item.SpSalary || 0);
    sumAddSalary = sumAddSalary + parseFloat( item.SpSalary || 0);

    });
    
    //check addSalary with cal tax and social 
    await (async () => {
      await Promise.all(addSalaryList.map(async item => {
    
        if(item.id === '1230' || item.id === '1350' || item.id === '1520' || item.id === '1535' || item.id === '1410') {
          if(item.id === '1230') {
              data.accountingRecord.amountPosition = await item.SpSalary || 0;
          }  else {
            // data.accountingRecord.amountPosition =  await 0;
          }
              if(item.id === '1350' ) {
      data.accountingRecord.tel = await item.SpSalary || 0;
              }  else {
                // data.accountingRecord.tel = await 0;
              }
    if(item.id === '1520') {
      data.accountingRecord.travel = await item.SpSalary || 0;
    }  else {
      // data.accountingRecord.travel =  await 0;
    }
    if(item.id === '1535') {
      data.accountingRecord.benefitNonSocial = await item.SpSalary || 0;
    } else {
      // data.accountingRecord.benefitNonSocial = await 0;
    }
    if(item.id === '1410') {
      data.accountingRecord.amountHardWorking = await item.SpSalary || 0;
    } else {
      // data.accountingRecord.benefitNonSocial = await 0;
    }
    
        } else {
    
        let taxStatus = await checkCalTax(item.id);
        // console.log('taxStatus ' + item.id + ' ' + taxStatus + ' ' + item.SpSalary);
    
        if (taxStatus) {
          // Calculate tax
          let socialStatus = await checkCalSocial(item.id);
          // console.log('socialStatus ' + item.id + ' ' + socialStatus + ' ' + item.SpSalary);
    
          if (socialStatus) {
            // Calculate social
            sumAddSalaryBeforeTaxTmp += parseFloat(item.SpSalary);
          } else {
            // Non-social
            sumAddSalaryBeforeTaxNonSocialTmp += parseFloat(item.SpSalary);
          }
        } else {
          // Non-tax
          sumAddSalaryAfterTaxTmp += parseFloat(item.SpSalary);
        }
      }
    
      }));
    
      sumAddSalaryBeforeTax = sumAddSalaryBeforeTaxTmp;
      sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocialTmp;
      sumAddSalaryAfterTax = sumAddSalaryAfterTaxTmp;
      // console.log('sumAddSalaryBeforeTax ' + sumAddSalaryBeforeTax);
      // console.log('sumAddSalaryBeforeTaxNonSocial ' + sumAddSalaryBeforeTaxNonSocial);
      // console.log('sumAddSalaryAfterTax ' + sumAddSalaryAfterTax);
    
    })();
    
    //check isset amountPosition , tel, travel and benefitNonSocial
    if (data?.accountingRecord?.amountPosition ?? false) {
      // The property is set and truthy
    } else {
      // The property is not set or it is falsy
        data.accountingRecord.amountPosition =  await 0;
    }
    if (data?.accountingRecord?.tel ?? false) {
      // The property is set and truthy
    } else {
      // The property is not set or it is falsy
        data.accountingRecord.tel =  await 0;
    }
    if (data?.accountingRecord?.travel ?? false) {
      // The property is set and truthy
    } else {
      // The property is not set or it is falsy
        data.accountingRecord.travel =  await 0;
    }
    if (data?.accountingRecord?.benefitNonSocial ?? false) {
      // The property is set and truthy
    } else {
      // The property is not set or it is falsy
        data.accountingRecord.benefitNonSocial =  await 0;
    }
    if (data?.accountingRecord?.amountHardWorking ?? false) {
      // The property is set and truthy
    } else {
      // The property is not set or it is falsy
        data.accountingRecord.amountHardWorking =  await 0;
    }
    
    // await console.log(sumSocial );
    
    const intersection = await workDaylist.filter(day => specialDaylist.includes(parseInt(day)));
    
    await console.log(data.employeeId + ' ' + month);
    // await console.log('workDaylist' + JSON.stringify(workDaylist,null,2))
    await console.log('specialDaylist' + JSON.stringify(specialDaylist,null,2));
    
    await console.log('intersection: ' + intersection); // Output: ['2', '3', '4']
    await console.log('total ' + total );
    // console.log('specialDaylist.length ' + specialDaylist.length + 'intersection.length '+ intersection.length + 'holidayRate '+ holidayRate )
    let s1 = await specialDaylist.length ||0;
    let s2 = await intersection.length || 0;
    let calSP = await ((s1 - s2) * holidayRate );
    
    // console.log('calSP '+ calSP );
    // sumSocial  = await sumSocial  + calSP ;
    
    let workDaySocial = await countDay - dayOffSum - s2;
    
    sumSocial = await sumSocial  + (dayOffWork * salary) + calSP ;
    
    await console.log('countDay '+ countDay + ' dayOffSumWork ' + dayOffSumWork  + ' s2 '  +s2 + 'workDaySocial ' + workDaySocial );
    
    console.log('workDaySocial '+ (workDaySocial * salary) + 'sumSocial '+ sumSocial );
    
    sumAmountDayWork  = await Number(dayOffWork) * Number(salary);
    let  calOtWork = await (Number(amountDay) - Number(sumAmountDayWork ) ) + Number(amountOt) || 0;

        // Other properties
        data.accountingRecord.amountSpecialDay= await calSP ||0;
        data.accountingRecord.countDayWork = await dayOffWork ||0;
        data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;
        data.accountingRecord.amountCountDayWorkOt = await calOtWork ||0;
        data.accountingRecord.countHourWork = await countHourWork ||0;
        data.accountingRecord.countOtHourWork = await countOtHourWork ||0;
    
              //data for hour amount
    data.accountingRecord.amountOne = await amountOne ||0;
    data.accountingRecord.hourOne = await hourOne ||0;
    data.accountingRecord.amountOneFive = await amountOneFive ||0;
    data.accountingRecord.hourOneFive = await hourOneFive ||0;
    data.accountingRecord.amountTwo = await amountTwo ||0;
    data.accountingRecord.hourTwo = await hourTwo ||0;
    data.accountingRecord.amountTwoFive = await amountTwoFive ||0;
    data.accountingRecord.hourTwoFive = await hourTwoFive ||0;
    data.accountingRecord.amountThree = await amountThree ||0;
    data.accountingRecord.hourThree = await hourThree ||0;

        data.accountingRecord.amountHoliday = 0;
        data.accountingRecord.addAmountBeforeTax = sumCalTaxNonSalary || 0;
        data.accountingRecord.deductBeforeTax = sumDeductWithTax || 0;
        // data.accountingRecord.tax = sumCalTax || 0;
        // Assuming sumSocial is defined somewhere before this code
    // Check if sumSocial is greater than 15000
    if (sumSocial > 15000) {
      sumSocial = await 15000; // Set sumSocial to 15000
    }
    if (sumSocial < 1650) {
      sumSocial = await 83; // Set sumSocial to 83
    }
            
    // Calculate socialSecurity based on sumSocial
    // data.accountingRecord.socialSecurity = Math.ceil((sumSocial * 0.05)) || 0;
    data.accountingRecord.socialSecurity = Math.round(
      sumSocial * (parseFloat(settingResult?.data?.[settingResult.data.length - 1]?.social?.[0]?.socialPercent || '5') / 100)
    ) || 0;
      
    //total
    total = await total  + amountDay + amountOt + calSP -(Math.ceil((sumSocial * 0.05) || 0)) - tax;
    
        // data.accountingRecord.socialSecurity = (sumSocial * 0.05) || 0;
        data.accountingRecord.addAmountAfterTax = sumNonTaxNonSalary || 0;
        // data.accountingRecord.advancePayment = 0;
        data.accountingRecord.deductAfterTax = sumDeductUncalculateTax || 0;
        data.accountingRecord.bank = 0;
        data.accountingRecord.total = total || 0;
    
        data.accountingRecord.sumAddSalaryBeforeTax = sumAddSalaryBeforeTax || 0;
        data.accountingRecord.sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial || 0;
        data.accountingRecord.sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial || 0;
        data.accountingRecord.sumDeductBeforeTax = sumDeductBeforeTax || 0;
        data.accountingRecord.sumAddSalaryAfterTax = sumAddSalaryAfterTax || 0;
        data.accountingRecord.sumDeductAfterTax = sumDeductAfterTax || 0;
    
        data.accountingRecord.sumSalaryForTax = sumCalTax || 0;

        data.accountingRecord.sumAddSalary = sumAddSalary || 0;

        data.addSalary = await addSalaryList || [];
    
    data.deductSalary = deductSalaryList || [];
    
    data.specialDayRate = await holidayRate || 0;
    data.countSpecialDay = await specialDaylist.length || 0;
    data.specialDayListWork = await intersection || [];
    //end point
    
    
    }
    
    const salaryRecord = new accounting(data);
    await salaryRecord.save();
    // await console.log(salaryRecord);
    
            dataList.push(data);
          }     //check accounting record in database

          }
        } else {
          console.log('no data conclude');
        }
    
        // console.log(JSON.stringify(dataList, null, 2));
    
        if (dataList.length > 0) {
          await res.json(dataList);
        } else {
          await res.status(404).json({ error: 'accounting not found' });
        }
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    
    
    });
    
    
//     const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);

//     const dataList = [];

//     if (responseConclude.data.recordConclude.length > 0) {

//       for (let c = 0; c < responseConclude.data.recordConclude.length; c++) {
//         const data = {}; // Initialize data object inside the loop


//         data.year = responseConclude.data.recordConclude[c].year;
//         data.month = responseConclude.data.recordConclude[c].month;
//         data.createDate = new Date().toLocaleDateString('en-GB');
//         data.employeeId = responseConclude.data.recordConclude[c].employeeId;
//         data.accountingRecord = {};

//         let salary = 0;
//         let countDay = 0;
//         let countHour = 0;
//         let countOtHour = 0;
//         let amountDay = 0;
//         let amountOt = 0;
//         let amountSpecial = 0;
// let sumCalTax = 0;
// let sumCalTaxNonSalary = 0;
// let sumNonTaxNonSalary = 0;
// let sumDeductUncalculateTax = 0;
// let sumDeductWithTax = 0;

// //value for report

// let sumAddSalaryBeforeTaxNonSocial = 0;
// let sumDeductBeforeTaxWithSocial = 0;
// let sumAddSalaryBeforeTax = 0;
// let sumDeductBeforeTax = 0;

// let sumSocial = 0;
// let tax = 0;

// let sumAddSalaryAfterTax = 0;
// let sumDeductAfterTax = 0;

// let total = 0;

// let holidayRate = 0;
// let workDaylist = [];

// let specialDaylist = [];
// let countSpecialDay = 0;
// let amountSpecialDay = 0;
// let x1230 =0; let x1350 =0; let x1520 = 0; let x1535 = 0;
// let addSalaryDayArray = [];
// let dayOffList = [];
// let dayOffSum = 0;
// let dayOffSumWork = 0;
// let dayOffWork = 0;

// // Get employee data by employeeId
// const response = await axios.get(sURL + '/employee/' + responseConclude.data.recordConclude[c].employeeId);
// if (response) {
//     data.workplace = await response.data.workplace;
//     data.accountingRecord.tax = await response.data.tax ||0;
// tax = await response.data.tax ||0; 
// salary = await response.data.salary || 0;

// // await console.log(response.data);

// //ss
// // console.log(response.data.workplace );
//     // Find the workplace with the matching ID
//     const foundWorkplace = await workplaceList.data.find(workplace => workplace.workplaceId === response.data.workplace );

//     if (foundWorkplace) {
//       amountSpecial = await foundWorkplace.holiday || 0;
//       // await console.log("workTimeDay " + JSON.stringify(foundWorkplace.workTimeDay ) );

//       //employee salary is not set use with workplace
//       if(salary === 0 ) {
//         salary = await parseFloat(foundWorkplace.workRate|| 0);
//       }
      
//       // Found the workplace
//       // await console.log('Found workplace:', foundWorkplace);
      
//       // console.log(JSON.stringify( foundWorkplace.workTimeDay,null,2));
//       if(foundWorkplace.workTimeDay ){
//         await foundWorkplace.workTimeDay.map(item => {
//           if(item.workOrStop === 'stop'){
//             // console.log(JSON.stringify( item.workOrStop ,null,2));

//             //get day off of week
// try {
// let startDay = getDayNumber(item.startDay);
// let endDay = getDayNumber(item.endDay);
//   console.log('startDay '+ startDay );
//   console.log('endDay ' + endDay );

//   if(startDay <= endDay) {
//     if(startDay === endDay) {
//       dayOffList.push(startDay);
//     } else {
//       for(let i = startDay; i <= endDay; i++) {
//         dayOffList.push(i);
//       }
//     }
  
//   } else {
//     for(let i = endDay; i <= 6; i++){
//       dayOffList.push(i);
//     }
//     for(let j = 0; j <= startDay ; j++){
//       dayOffList.push(j);
//     }
//   }
// } catch (error) {
//   console.error(error.message);
// }
//           }
//         })
//       }

//       console.log('dayOffList ' + dayOffList);
//           // Format the new month as a two-digit string (e.g. "01", "02", ...)
//     const newMonthStringX = (month -1).toLocaleString('en-US', {
//       minimumIntegerDigits: 2,
//   });
  
//   // Calculate the previous month
//   let previousMonthX;
//   if (newMonthStringX === 0) {
//       // If newMonth is January (0), the previous month is December (12)
//       previousMonthX = 12;
//   } else {
//       // Otherwise, subtract 1 from the current month
//       previousMonthX = newMonthStringX;
//   }
  
//   // Convert the previous month to a two-digit string (e.g. "03")
//   const previousMonthStringX = previousMonthX.toLocaleString('en-US', {
//       minimumIntegerDigits: 2,
//   });

//   let endM1 = new Date(year, previousMonthStringX, 0).getDate();

//       // console.log(year + '-' + month + ' ' + previousMonthStringX  + endM1);
// for(m1 = 21; m1 <= endM1; m1 ++){
//   let dateString = `${year}-${previousMonthStringX}-${m1.toString().padStart(2, '0')}`;
//   // console.log(dateString);

//   let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

//   // console.log('m1 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

//   if (dayOffList.includes(dayNumber)) {
//       dayOffSum += 1;
//   }

// }

// for(m2 = 1; m2 <= 20; m2 ++){
//   let dateString = `${year}-${month}-${m2.toString().padStart(2, '0')}`;
//   // console.log(dateString);

//   let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

//   // console.log('m2 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

//   if (dayOffList.includes(dayNumber)) {
//       dayOffSum += 1;
//   }


// }

// console.log('dayOffSum ' + dayOffSum);
//       // console.log(foundWorkplace.daysOff);

//       await Promise.all( foundWorkplace.daysOff.map(async item => {

//   // Parse the date string and create a Date object
//   const day1 = new Date(item);
  
//   // Increment the date by one day
//   day1.setDate(day1.getDate() + 1);
  
//   // Determine the month and year of the incremented date
//   const month1= day1.getMonth();
//   const month1String = (month1+ 1).toLocaleString('en-US', {
//     minimumIntegerDigits: 2, // Ensures a two-digit month (e.g. "01", "02", ...)
//   });

//   const  year1 = day1.getFullYear();
  
//   // Create a Date object for the last day of the incremented date's month
//   const lastDayOfMonth = new Date(year1, month1+ 1, 0).getDate();
  
//   // Compare the incremented date with the last day of the month
//   if (day1.getDate() > lastDayOfMonth) {
//     // If the incremented date exceeds the last day of the month, adjust it
//     day1.setDate(day1.getDate() - lastDayOfMonth);
//   }
  
//   // Log the adjusted date (in the format: "day/month")
//   // console.log(`${day1.getDate()}/${month1String }`);

//     // Format the new month as a two-digit string (e.g. "01", "02", ...)
//     const newMonthString = (month -1).toLocaleString('en-US', {
//       minimumIntegerDigits: 2,
//   });
  
//   // Calculate the previous month
//   let previousMonth;
//   if (newMonthString === 0) {
//       // If newMonth is January (0), the previous month is December (12)
//       previousMonth = 12;
//   } else {
//       // Otherwise, subtract 1 from the current month
//       previousMonth = newMonthString ;
//   }
  
//   // Convert the previous month to a two-digit string (e.g. "03")
//   const previousMonthString = previousMonth.toLocaleString('en-US', {
//       minimumIntegerDigits: 2,
//   });

// if(month !== "01" && month !== "12" && year == year1 ) {
// // console.log(month + ' x ' + month1String )

//   if(month == month1String && year == year1 && day1.getDate()  <= 20) {
//     // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

//     await specialDaylist.push(day1.getDate() );
//     holidayRate = await response.data.salary || foundWorkplace.workRate;
//   } else {
//     if(previousMonthString  == month1String && day1.getDate() >= 21) {
//       console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

//       await specialDaylist.push(day1.getDate() );
// holidayRate = await response.data.salary || foundWorkplace.workRate;
//     }
//   }

//        } else {
//         // month is 01
//         if(month == "01" ) {
//           if(year1 == year -1 && month1String == "12" && day1 >= 21 ) {
//             await specialDaylist.push(day1.getDate() );
//             holidayRate = await response.data.salary || foundWorkplace.workRate;
//           }
//           if(year1 == year  && month1String == "01" && day1 <= 20 ) {
//             await specialDaylist.push(day1.getDate() );
//             holidayRate = await response.data.salary || foundWorkplace.workRate;
//           }

//         }
//         // month is 12
//         if(month == "12" ){
//           if(year1 == year  && month1String == "12" && day1 <= 20 ) {
//             await specialDaylist.push(day1.getDate() );
//             holidayRate = await response.data.salary || foundWorkplace.workRate;
//           }

//         }

//        }


// // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
//       })
//     );

// // Format the components as desired
// // const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

//     } else {
//       // Workplace with the given ID not found
//       // await console.log('Workplace not found');
//     }

//     // data.employeeId = responseConclude.data.recordConclude[c].employeeId;
//     data.name = await response.data.name;
//     data.lastName = await response.data.lastName;


//     //check cal social 
//     let promises = [];
//     let promises1 = [];
//     let promisesDeduct = [];
// let addSalaryList = [];
// let deductSalaryList = [];


//     for (let k = 0; k < response.data.addSalary.length; k++) {
//       //check addSalary with tax and cal social
//         const promise1 = await checkCalTax(response.data.addSalary[k].id || '0');
//         const promise = await checkCalSocial(response.data.addSalary[k].id || '0');
        
//         await promises.push(promise);
//         await promises1.push(promise1);

//         //check tax 
//         if(response.data.addSalary[k].SpSalary !== ""){
//         if(promise1) {
//           //data cal tax

//           //check cal social
// if(promise) {
// //data cal social
// // sumAddSalaryBeforeTax = sumAddSalaryBeforeTax + parseFloat(response.data.addSalary[k].SpSalary || 0);
// } else {
// //data non social
// // sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial  + parseFloat(response.data.addSalary[k].SpSalary || 0);
// }
//           // console.log('tax' + response.data.addSalary[k].id || '0'); 

//         } else {
//           // console.log('non tax' + response.data.addSalary[k].id || '0');
//           // sumAddSalaryAfterTax  = sumAddSalaryAfterTax  + parseFloat(response.data.addSalary[k].SpSalary || 0);
//         }
//       }

//         //push addSalary to account
//         if(response.data.addSalary[k].roundOfSalary == "daily" ) {
//         //   if( response.data.addSalary[k].SpSalary !== "") {
//         //     let dailyTmp = await response.data.addSalary[k];
//         //     dailyTmp.message = await countDay;
//         //     await addSalaryList.push(dailyTmp);
//         //   }

//         } else {
//           if( response.data.addSalary[k].SpSalary !== "") {
//             //add addSalary monthly to list 
//           await addSalaryList.push(response.data.addSalary[k]);
//           }

//         }
// // console.log(response.data.addSalary[k].roundOfSalary );
//     }

//     for (let l = 0; l < response.data.deductSalary.length; l++) {
//       const promisesDeduct1 = await checkCalTax(response.data.deductSalary[l].id || '0');
//       const promisesDeduct2 = await checkCalSocial(response.data.deductSalary[l].id || '0');

//       await promisesDeduct.push(promisesDeduct1 );
// await deductSalaryList.push(response.data.deductSalary[l] );

//         //check tax 
//           if(promisesDeduct1 ) {
//             //data cal tax
  
//             //check cal social
//   if(promisesDeduct2 ) {
//   //data cal social
//   sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial + parseFloat(response.data.deductSalary[l].amount || 0);

//   } else {
//   //data non social
//   sumDeductBeforeTax = sumDeductBeforeTax + parseFloat(response.data.deductSalary[l].amount || 0);

//   }
  
//           } else {
//             sumDeductAfterTax = sumDeductAfterTax + parseFloat(response.data.deductSalary[l].amount || 0);

//           }
        
  
//   }

//     await Promise.all(promises)
//         .then(results => {
//             // let sumSocial = 0;
//             results.forEach((result, k) => {
//                 if (result === true) {
//                     sumSocial += parseFloat(response.data.addSalary[k].SpSalary || 0);
//                     // console.log(`Promise ${k} is resolved`);
//                     // console.log(response.data.addSalary[k].SpSalary);
//                 }
//             });
//             // console.log(sumSocial);
//         })
//         .catch(error => {
//             console.error('Error occurred while processing promises:', error);
//         });
    


// //check cal tax
// await Promise.all(promises1)
// .then(results => {
//     // let sumSocial = 0;
//     results.forEach((result, k) => {
//         if (result === true) {
//           if(response.data.addSalary[k].roundOfSalary === "daily") {
//             sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
//             sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0) *countDay;

//           } else {
//             sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0);
//             sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0);

//           }

//             // console.log(`Promise ${k} is resolved`);
//             // console.log(response.data.addSalary[k].SpSalary);
//         }  else {
//           if(response.data.addSalary[k].roundOfSalary === "daily") {
//             sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
//           } else {
//             sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
//           }

//         }
//     });
//     // console.log(sumCalTax);
// })
// .catch(error => {
//     console.error('Error occurred while processing promises:', error);
// });

// //check deduct calculate tax
// await Promise.all(promisesDeduct)
// .then(results => {
//     // let sumSocial = 0;
//     results.forEach((result, k) => {
//         if (result === true) {
//             sumDeductWithTax += parseFloat(response.data.deductSalary[k].amount || 0);

//         }  else {
//           // sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
//           sumDeductUncalculateTax += parseFloat(response.data.deductSalary[k].amount || 0);

//         }
//     });
//     // console.log(sumCalTax);
// })
// .catch(error => {
//     console.error('Error occurred while processing promises:', error);
// });

// addSalaryDayArray = [];  

// //ss1
// for (let i = 0; i < responseConclude.data.recordConclude[c].concludeRecord.length; i++) {
//   amountDay += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0);
//   amountOt += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT || 0);
//   amountSpecial += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].addSalaryDay || 0);
//   countHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
//   countOtHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);

//   //check work rate is not standard day
//   if(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0) == parseFloat(salary) ) {
// dayOffWork += 1;
//   }

//   if (responseConclude.data.recordConclude[c].concludeRecord[i].workRate !== undefined) {
//     countDay++;

//     if(dayOffList.includes( getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) ) ) {
// // console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
// dayOffSumWork += 1;      
//     }
// // console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );

//     workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );

//     //check addSalary day from conclude
//     // console.log("addSalary "+ JSON.stringify( responseConclude.data.recordConclude[c].addSalary ,null,2) );
// // console.log(responseConclude.data.recordConclude[c].addSalary[i].length );
// if(responseConclude.data.recordConclude[c].addSalary[i]) {

// await responseConclude.data.recordConclude[c].addSalary[i].map( async (item, index) => {

//   let checkAddSalaryDay  = false;
//   addSalaryDayArray.map(tmp => {
// if(tmp.id === item.id) {
//   checkAddSalaryDay   = true;
//   tmp.SpSalary = parseFloat(tmp.SpSalary) + parseFloat(item.SpSalary);
//   tmp.message = parseFloat(tmp.message || 1) + 1;

// }
//   })

//   if (! checkAddSalaryDay ) {
//     // await console.log(" push " + item.id );
//     await addSalaryDayArray.push(item);
//   } else {
//     // await console.log('update"' + item.id );
//   }

// if(item.id == '1230') {
//   x1230 += parseFloat(item.SpSalary);
// } else
// if(item.id == '1350') {
//   x1350 += parseFloat(item.SpSalary);
// } else
// if(item.id == '1520') {
//   x1520 += parseFloat(item.SpSalary);
// } else
// if(item.id == '1535') {
//   x1535 += parseFloat(item.SpSalary);
// } else {
//   // console.log(item.SpSalary);
  
// }

// });

//   }

//   }

// }
// // await console.log('addSalaryDayArray '+ JSON.stringify(addSalaryDayArray ,null,2));

// //set data to position , tel , travel
// if(x1230 >0 ) {
//   data.accountingRecord.amountPosition = await x1230;
// }
// if(x1350 >0 ) {
//   data.accountingRecord.tel = x1350;
// }
// if(x1520 >0 ) {
//   data.accountingRecord.travel = x1520;
// }
// if(x1535 >0 ) {
//   data.accountingRecord.benefitNonSocial = x1535;
// }


// data.accountingRecord.countDay = countDay;
// data.accountingRecord.countHour = countHour;
// data.accountingRecord.countOtHour = countOtHour;

// data.accountingRecord.amountDay = amountDay;
// data.accountingRecord.amountOt = amountOt;


// // sumSocial = await sumSocial + amountDay;
// sumCalTax = await sumCalTax + amountDay;
// sumCalTax = await sumCalTax + amountOt;
// console.log(addSalaryDayArray.length);

// //concat addSalary
// addSalaryList  = await addSalaryList .concat(addSalaryDayArray);
// console.log(addSalaryList .length);
// // Variables for summation
// let sumAddSalaryBeforeTaxTmp = 0;
// let sumAddSalaryBeforeTaxNonSocialTmp = 0;
// let sumAddSalaryAfterTaxTmp = 0;

// await addSalaryList.forEach(item => {
// total = total + parseFloat( item.SpSalary || 0);
// });

// //check addSalary with cal tax and social 
// await (async () => {
//   await Promise.all(addSalaryList.map(async item => {

//     if(item.id === '1230' || item.id === '1350' || item.id === '1520' || item.id === '1535' || item.id === '1410') {
//       if(item.id === '1230') {
//           data.accountingRecord.amountPosition = await item.SpSalary || 0;
//       }  else {
//         // data.accountingRecord.amountPosition =  await 0;
//       }
//           if(item.id === '1350' ) {
//   data.accountingRecord.tel = await item.SpSalary || 0;
//           }  else {
//             // data.accountingRecord.tel = await 0;
//           }
// if(item.id === '1520') {
//   data.accountingRecord.travel = await item.SpSalary || 0;
// }  else {
//   // data.accountingRecord.travel =  await 0;
// }
// if(item.id === '1535') {
//   data.accountingRecord.benefitNonSocial = await item.SpSalary || 0;
// } else {
//   // data.accountingRecord.benefitNonSocial = await 0;
// }
// if(item.id === '1410') {
//   data.accountingRecord.amountHardWorking = await item.SpSalary || 0;
// } else {
//   // data.accountingRecord.benefitNonSocial = await 0;
// }

//     } else {

//     let taxStatus = await checkCalTax(item.id);
//     // console.log('taxStatus ' + item.id + ' ' + taxStatus + ' ' + item.SpSalary);

//     if (taxStatus) {
//       // Calculate tax
//       let socialStatus = await checkCalSocial(item.id);
//       // console.log('socialStatus ' + item.id + ' ' + socialStatus + ' ' + item.SpSalary);

//       if (socialStatus) {
//         // Calculate social
//         sumAddSalaryBeforeTaxTmp += parseFloat(item.SpSalary);
//       } else {
//         // Non-social
//         sumAddSalaryBeforeTaxNonSocialTmp += parseFloat(item.SpSalary);
//       }
//     } else {
//       // Non-tax
//       sumAddSalaryAfterTaxTmp += parseFloat(item.SpSalary);
//     }
//   }

//   }));

//   sumAddSalaryBeforeTax = sumAddSalaryBeforeTaxTmp;
//   sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocialTmp;
//   sumAddSalaryAfterTax = sumAddSalaryAfterTaxTmp;
//   // console.log('sumAddSalaryBeforeTax ' + sumAddSalaryBeforeTax);
//   // console.log('sumAddSalaryBeforeTaxNonSocial ' + sumAddSalaryBeforeTaxNonSocial);
//   // console.log('sumAddSalaryAfterTax ' + sumAddSalaryAfterTax);

// })();

// //check isset amountPosition , tel, travel and benefitNonSocial
// if (data?.accountingRecord?.amountPosition ?? false) {
//   // The property is set and truthy
// } else {
//   // The property is not set or it is falsy
//     data.accountingRecord.amountPosition =  await 0;
// }
// if (data?.accountingRecord?.tel ?? false) {
//   // The property is set and truthy
// } else {
//   // The property is not set or it is falsy
//     data.accountingRecord.tel =  await 0;
// }
// if (data?.accountingRecord?.travel ?? false) {
//   // The property is set and truthy
// } else {
//   // The property is not set or it is falsy
//     data.accountingRecord.travel =  await 0;
// }
// if (data?.accountingRecord?.benefitNonSocial ?? false) {
//   // The property is set and truthy
// } else {
//   // The property is not set or it is falsy
//     data.accountingRecord.benefitNonSocial =  await 0;
// }
// if (data?.accountingRecord?.amountHardWorking ?? false) {
//   // The property is set and truthy
// } else {
//   // The property is not set or it is falsy
//     data.accountingRecord.amountHardWorking =  await 0;
// }

// // await console.log(sumSocial );

// const intersection = await workDaylist.filter(day => specialDaylist.includes(parseInt(day)));

// await console.log(data.employeeId + ' ' + month);
// // await console.log('workDaylist' + JSON.stringify(workDaylist,null,2))
// await console.log('specialDaylist' + JSON.stringify(specialDaylist,null,2));

// await console.log('intersection: ' + intersection); // Output: ['2', '3', '4']
// await console.log('total ' + total );
// // console.log('specialDaylist.length ' + specialDaylist.length + 'intersection.length '+ intersection.length + 'holidayRate '+ holidayRate )
// let s1 = await specialDaylist.length ||0;
// let s2 = await intersection.length || 0;
// let calSP = await ((s1 - s2) * holidayRate );

// // console.log('calSP '+ calSP );
// // sumSocial  = await sumSocial  + calSP ;

// let workDaySocial = await countDay - dayOffSum - s2;

// sumSocial = await sumSocial  + (dayOffWork * salary) + calSP ;

// await console.log('countDay '+ countDay + ' dayOffSumWork ' + dayOffSumWork  + ' s2 '  +s2 + 'workDaySocial ' + workDaySocial );

// console.log('workDaySocial '+ (workDaySocial * salary) + 'sumSocial '+ sumSocial );

//     // Other properties
//     data.accountingRecord.amountSpecialDay= await calSP ||0;
//     data.accountingRecord.countDayWork = await dayOffWork ||0;

//     data.accountingRecord.amountHoliday = 0;
//     data.accountingRecord.addAmountBeforeTax = sumCalTaxNonSalary || 0;
//     data.accountingRecord.deductBeforeTax = sumDeductWithTax || 0;
//     // data.accountingRecord.tax = sumCalTax || 0;
//     // Assuming sumSocial is defined somewhere before this code
// // Check if sumSocial is greater than 15000
// if (sumSocial > 15000) {
//   sumSocial = await 15000; // Set sumSocial to 15000
// }

// // Calculate socialSecurity based on sumSocial
// data.accountingRecord.socialSecurity = Math.ceil((sumSocial * 0.05)) || 0;

// //total
// total = await total  + amountDay + amountOt + calSP -(Math.ceil((sumSocial * 0.05) || 0)) - tax;

//     // data.accountingRecord.socialSecurity = (sumSocial * 0.05) || 0;
//     data.accountingRecord.addAmountAfterTax = sumNonTaxNonSalary || 0;
//     // data.accountingRecord.advancePayment = 0;
//     data.accountingRecord.deductAfterTax = sumDeductUncalculateTax || 0;
//     data.accountingRecord.bank = 0;
//     data.accountingRecord.total = total || 0;

//     data.accountingRecord.sumAddSalaryBeforeTax = sumAddSalaryBeforeTax || 0;
//     data.accountingRecord.sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial || 0;
//     data.accountingRecord.sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial || 0;
//     data.accountingRecord.sumDeductBeforeTax = sumDeductBeforeTax || 0;
//     data.accountingRecord.sumAddSalaryAfterTax = sumAddSalaryAfterTax || 0;
//     data.accountingRecord.sumDeductAfterTax = sumDeductAfterTax || 0;

//     data.accountingRecord.sumSalaryForTax = sumCalTax || 0;

//     data.addSalary = await addSalaryList || [];

// data.deductSalary = deductSalaryList || [];

// data.specialDayRate = await holidayRate || 0;
// data.countSpecialDay = await specialDaylist.length || 0;
// data.specialDayListWork = await intersection || [];
// //end point


// }

//         dataList.push(data);
//       }
//     } else {
//       console.log('no data conclude');
//     }

//     // console.log(JSON.stringify(dataList, null, 2));

//     if (dataList.length > 0) {
//       res.json(dataList);
//     } else {
//       res.status(404).json({ error: 'accounting not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


  router.post('/calsalary', async (req, res) => {
    // router.get('/:employeeId', async (req, res) => {

const data = await {};

  try {
    const {
      year, 
      month,
      employeeId 
    } = await req.body;

    const dataSearch = await {
      year: year, 
      month: month,
      concludeDate: "",
      employeeId : employeeId 
      // req.params.employeeId
    };
await console.log(dataSearch);

//get data from conclude record
    const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);
    await console.log(responseConclude.data.recordConclude.length );
    if(responseConclude.data.recordConclude.length > 0 ) {
      // console.log(responseConclude.data.recordConclude.length );
// await console.log(JSON.stringify(responseConclude.data,null,2) );

data.year = await responseConclude.data.recordConclude[0].year; 
data.month = await responseConclude.data.recordConclude[0].month;
data.createDate = await new Date().toLocaleDateString('en-GB');
data.employeeId = await responseConclude.data.recordConclude[0].employeeId;
data.accountingRecord  = await {};

// data.accountingRecord.countDay = await responseConclude.data.recordConclude[0].concludeRecord.length;

let countDay  = await 0;
let amountDay = await 0;
let amountOt = await 0;
let amountSpecial  = await 0;
//loop count data
// await console.log(responseConclude.data.recordConclude[0].concludeRecord);
for(let i =0; i < responseConclude.data.recordConclude[0].concludeRecord.length; i++) {
  amountDay  = await amountDay + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].workRate || 0 );
  amountOt = await amountOt + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].workRateOT || 0 );
  amountSpecial = await amountSpecial + parseFloat(responseConclude.data.recordConclude[0].concludeRecord[i].addSalaryDay || 0 );

  if(responseConclude.data.recordConclude[0].concludeRecord[i].workRate !== '' ){
    countDay  = await countDay   + 1;
  }
}
// await console.log(amountSpecial );

data.accountingRecord.countDay = await countDay;
data.accountingRecord.amountDay = await amountDay  ;
data.accountingRecord.amountOt = await amountOt;
data.accountingRecord.amountSpecial = await amountSpecial;

// await console.log(responseConclude.data.recordConclude[0].concludeRecord.length);

//xxxx
    } else {
console.log('no data conclude');
    }

    //get employee data by employeeId
      const response = await axios.get(sURL + '/employee/'+ employeeId);
      if(response) {
        data.workplace = await response.data.workplace;
console.log(response.data.addSalary.length);

let position1230 = await '1230';
const addSalary = await response.data.addSalary.find(salary => salary.id === position1230 );

if (addSalary) {
  // console.log('Found addSalary:', addSalary);
  data.accountingRecord.amountPosition = await addSalary.SpSalary;
  // Handle addSalary found
} else {
  // console.log('No addSalary found with the provided ID.');
  data.accountingRecord.amountPosition = await 0;
  // Handle no addSalary found
}

let hardwork1410 = await '1410';
const addSalary1 = await response.data.addSalary.find(salary => salary.id === hardwork1410 );

if (addSalary1) {
  data.accountingRecord.amountHardWorking= await addSalary1.SpSalary;
} else {
  data.accountingRecord.amountHardWorking= await 0;
}

//xxxx
data.accountingRecord.amountHoliday = await 0;
data.accountingRecord.addAmountBeforeTax = await 0;
data.accountingRecord.tax = await 0;
data.accountingRecord.socialSecurity = await 0;
data.accountingRecord.addAmountAfterTax = await 0;
data.accountingRecord.advancePayment = await 0;
data.accountingRecord.deductAfterTax = await 0;
data.accountingRecord.deductBeforeTax = await 10;

data.accountingRecord.bank = await 0;
data.accountingRecord.total = await 0;

      }
    // await console.log(response.data.workplace );
    // console.log(data);

    // const accountingData = await accounting.findOne({ employeeId: req.params.employeeId});


    // if (accountingData ) {
      if (data) {

      res.json(data);
    } else {
      res.status(404).json({ error: 'accounting not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

});


// Get  accounting record by accounting Id
router.post('/search', async (req, res) => {
  try {
    const { 
      year,
      month,
      createDate,
      employeeId } = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId !== '') {
      query.employeeId = employeeId ;
    }

    if (year !== '') {
      query.year = year;
      // query.year= { $regex: new RegExp(workplaceName, 'i') };
    }

    if (month !== '') {
      query.month = month;
    }
    if (createDate !== '') {
      query.createDate = createDate;
    }

// console.log('query.date ' + query.date);
    // console.log('Constructed Query:');
    // console.log(query);

    if (month== '' && year == '' && employeeId== '') {
      res.status(200).json({});
    }

    // Query the workplace collection for matching documents
    const recordAccounting = await accounting.find(query);

    // await console.log('Search Results:');
    // await console.log(recordworkplace  );
    let textSearch = 'accounting';
    await res.status(200).json({ recordAccounting  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create new accounting
router.post('/create', async (req, res) => {
  const { 
    year,
    month,
    createDate,
    employeeId,
    workplace,
    createBy,
    accountingRecord } = req.body;


  try {
      //create conclude record
      const recordAccounting = new accounting({
        year,
        month,
        createDate,
        employeeId,
        workplace,
        accountingRecord,
        createBy });

    const ans = await recordAccounting.save();
    if (ans) {
      console.log('Create accounting record success');
    }

    res.json(recordAccounting);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// Update existing records in accounting
router.put('/update/:accountingRecordId', async (req, res) => {
  const accountingIdToUpdate = req.params.accountingRecordId;
  const updateFields = req.body;

  try {
    // Find the resource by ID and update it
    const updatedResource = await accounting.findByIdAndUpdate(
      accountingIdToUpdate,
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


async function getEmployeeData(id) {
  try {
    const response = await axios.get(sURL + '/employee/'+ id);
  // await console.log(response.data.workplace );
  return response.data;
  } catch (e) {
    console.log(e);
  }
}


async function checkCalSocial(id) {
  const idList = await ["1230","1231","1233","1241","1242","1350","1423","1428","1434","1520","1522","1524","1525","1526","1529","1531","1533","1534","1429","1427","1245","1234","2111","2116","2120","2124"];

  
  const idToCheck = await id;
  
  if (idList.includes(idToCheck)) {
      // console.log(`ID ${idToCheck} is included in the list.`);
      return await true;
  } else {
      // console.log(`ID ${idToCheck} is not included in the list.`);
      return await false;
  }
  
}

// async function checkCalTax(id) {
//   const idList = await ["1110","1120","1130","1140","1150","1210","1230","1231","1233","1241","1242","1251","1330","1350","1410","1422","1423","1428","1434","1440","1441","1444","1445","1446","1520","1522","1524","1525","1526","1528","1535","1540","1541","1550","1560","1447","1613","1561","1542","1536","1529","1531","1532","1533","1534","1442","1435","1429","1427","1412","1245","1234","1159","2111","2113","2116","2117","2120","2124","2160","2430","1190","1211","1212","1214","1235","1236","1243","1351","1411","1425","1426","1431","1448","1449","1527","1562","2114","2123","1543","1443","1544"];
  
//   const idToCheck = await id;
  
//   if (idList.includes(idToCheck)) {
//       // console.log(`ID ${idToCheck} is included in the list.`);
//       return await true;
//   } else {
//       // console.log(`ID ${idToCheck} is not included in the list.`);
//       return await false;
//   }
// }

async function checkCalTax(id) {
  const idList = await ["1110","1120","1130","1140","1150","1230","1231","1233","1241","1242","1251","1350","1422","1423","1428","1434","1440","1441","1444","1445","1446","1520","1522","1524","1525","1526","1528","1540","1541","1550","1447","1613","1561","1542","1536","1529","1531","1532","1533","1534","1435","1429","1427","1412","1245","1234","1159","2111","2113","2116","2117","2120","2124","2160","2430","1190","1211","1212","1214","1235","1236","1243","1351","1411","1425","1426","1431","1448","1449","1527","1562","2114","2123","1543","1443","1544"];
  
  const idToCheck = await id;
  
  if (idList.includes(idToCheck)) {
      // console.log(`ID ${idToCheck} is included in the list.`);
      return await true;
  } else {
      // console.log(`ID ${idToCheck} is not included in the list.`);
      return await false;
  }
}

// Function to get the day number from a date string in YYYY-MM-DD format
async function getDayNumberFromDate(dateString) {
  // Create a Date object from the date string
  const date = await new Date(dateString);

  // Check if the date is valid
  if (isNaN(date)) {
      // throw new Error('Invalid date');
  }
  
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayNumber = await date.getDay();
  
  return await dayNumber;
}

// Create a mapping of day names to their corresponding numbers
const daysOfWeek = {
  'อาทิตย์': 0,
  'จันทร์': 1,
  'อังคาร': 2,
  'พุธ': 3,
  'พฤหัส': 4,
  'ศุกร์': 5,
  'เสาร์': 6
};

// Function to get the number of the day in the week by name of the day
function getDayNumber(dayName) {
  const dayNumber = daysOfWeek[dayName];
  if (dayNumber === undefined) {
      throw new Error('Invalid day name');
  }
  return dayNumber;
}

//==========x
//get all accounting
router.post('/calsalarytest', async (req, res) => {
  try {
    const { year, month } = req.body;
    const workplaceList = await axios.get(sURL + '/workplace/list');
    const settingResult = await axios.get(sURL + '/basicsetting/');
    
    const dataSearch = {
      year: year, 
      month: month,
      concludeDate: "",
      employeeId: ''
    };

    const responseConclude = await axios.post(sURL + '/conclude/search', dataSearch);

    const dataList = [];

    if (responseConclude.data.recordConclude.length > 0) {

      for (let c = 0; c < responseConclude.data.recordConclude.length; c++) {
        const data = {}; // Initialize data object inside the loop


        data.year = responseConclude.data.recordConclude[c].year;
        data.month = responseConclude.data.recordConclude[c].month;
        data.createDate = new Date().toLocaleDateString('en-GB');
        data.employeeId = responseConclude.data.recordConclude[c].employeeId;
        data.accountingRecord = {};

        let salary = 0;
        let countDay = 0;
        let countHour = 0;
        let countOtHour = 0;
        let amountDay = 0;
        let amountOt = 0;
        let amountSpecial = 0;
let sumCalTax = 0;
let sumCalTaxNonSalary = 0;
let sumNonTaxNonSalary = 0;
let sumDeductUncalculateTax = 0;
let sumDeductWithTax = 0;

//value for report

let sumAddSalaryBeforeTaxNonSocial = 0;
let sumDeductBeforeTaxWithSocial = 0;
let sumAddSalaryBeforeTax = 0;
let sumDeductBeforeTax = 0;

let sumSocial = 0;
let tax = 0;

let sumAddSalaryAfterTax = 0;
let sumDeductAfterTax = 0;

let total = 0;

let holidayRate = 0;
let workDaylist = [];

let specialDaylist = [];
let countSpecialDay = 0;
let amountSpecialDay = 0;
let x1230 =0; let x1350 =0; let x1520 = 0; let x1535 = 0;
let addSalaryDayArray = [];
let dayOffList = [];
let dayOffSum = 0;
let dayOffSumWork = 0;
let dayOffWork = 0;
let sumAddSalary = 0;
let sumAmountDayWork = 0;
let countHourWork = 0;
let countOtHourWork = 0;

let amountOne = 0;
let amountOneFive = 0;
let amountTwo = 0;
let amountTwoFive = 0;
let amountThree = 0;
let hourOne = 0;
let hourOneFive = 0;
let hourTwo = 0;
let hourTwoFive = 0;
let hourThree = 0;
const dayW = [];


// Get employee data by employeeId
const response = await axios.get(sURL + '/employee/' + responseConclude.data.recordConclude[c].employeeId);
if (response) {
    data.workplace = await response.data.workplace;
    data.accountingRecord.tax = await response.data.tax ||0;
tax = await response.data.tax ||0; 
salary = await response.data.salary || 0;

// await console.log(response.data);

//ss
// console.log(response.data.workplace );
    // Find the workplace with the matching ID
    const foundWorkplace = await workplaceList.data.find(workplace => workplace.workplaceId === response.data.workplace );

    if (foundWorkplace) {
      amountSpecial = await foundWorkplace.holiday || 0;
      // await console.log("workTimeDay " + JSON.stringify(foundWorkplace.workTimeDay ) );

      //employee salary is not set use with workplace
      if(salary === 0 ) {
        salary = await parseFloat(foundWorkplace.workRate|| 0);
      }
      
      // Found the workplace
      // await console.log('Found workplace:', foundWorkplace);
      
      // console.log(JSON.stringify( foundWorkplace.workTimeDay,null,2));
      if(foundWorkplace.workTimeDay ){
        await foundWorkplace.workTimeDay.map(item => {
          if(item.workOrStop === 'stop'){
            // console.log(JSON.stringify( item.workOrStop ,null,2));

            //get day off of week
try {
let startDay = getDayNumber(item.startDay);
let endDay = getDayNumber(item.endDay);
  console.log('startDay '+ startDay );
  console.log('endDay ' + endDay );

  if(startDay <= endDay) {
    if(startDay === endDay) {
      dayOffList.push(startDay);
    } else {
      for(let i = startDay; i <= endDay; i++) {
        dayOffList.push(i);
      }
    }
  
  } else {
    for(let i = endDay; i <= 6; i++){
      dayOffList.push(i);
    }
    for(let j = 0; j <= startDay ; j++){
      dayOffList.push(j);
    }
  }
} catch (error) {
  console.error(error.message);
}
          }
        })
      }

      console.log('dayOffList ' + dayOffList);
          // Format the new month as a two-digit string (e.g. "01", "02", ...)
    const newMonthStringX = (month -1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });
  
  // Calculate the previous month
  let previousMonthX;
  if (newMonthStringX === 0) {
      // If newMonth is January (0), the previous month is December (12)
      previousMonthX = 12;
  } else {
      // Otherwise, subtract 1 from the current month
      previousMonthX = newMonthStringX;
  }
  
  // Convert the previous month to a two-digit string (e.g. "03")
  const previousMonthStringX = previousMonthX.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });

  let endM1 = new Date(year, previousMonthStringX, 0).getDate();

      // console.log(year + '-' + month + ' ' + previousMonthStringX  + endM1);
for(m1 = 21; m1 <= endM1; m1 ++){
  let dateString = `${year}-${previousMonthStringX}-${m1.toString().padStart(2, '0')}`;
  // console.log(dateString);

  let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

  // console.log('m1 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

  if (dayOffList.includes(dayNumber)) {
      dayOffSum += 1;
  }

}

for(m2 = 1; m2 <= 20; m2 ++){
  let dateString = `${year}-${month}-${m2.toString().padStart(2, '0')}`;
  // console.log(dateString);

  let dayNumber = new Date(dateString).getDay(); // getDay() returns the day of the week (0-6)

  // console.log('m2 ' + dayNumber + ' ' + JSON.stringify(dayNumber, null, 2));

  if (dayOffList.includes(dayNumber)) {
      dayOffSum += 1;
  }


}

console.log('dayOffSum ' + dayOffSum);
      // console.log(foundWorkplace.daysOff);

      await Promise.all( foundWorkplace.daysOff.map(async item => {

  // Parse the date string and create a Date object
  const day1 = new Date(item);
  
  // Increment the date by one day
  day1.setDate(day1.getDate() + 1);
  
  // Determine the month and year of the incremented date
  const month1= day1.getMonth();
  const month1String = (month1+ 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2, // Ensures a two-digit month (e.g. "01", "02", ...)
  });

  const  year1 = day1.getFullYear();
  
  // Create a Date object for the last day of the incremented date's month
  const lastDayOfMonth = new Date(year1, month1+ 1, 0).getDate();
  
  // Compare the incremented date with the last day of the month
  if (day1.getDate() > lastDayOfMonth) {
    // If the incremented date exceeds the last day of the month, adjust it
    day1.setDate(day1.getDate() - lastDayOfMonth);
  }
  
  // Log the adjusted date (in the format: "day/month")
  // console.log(`${day1.getDate()}/${month1String }`);

    // Format the new month as a two-digit string (e.g. "01", "02", ...)
    const newMonthString = (month -1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });
  
  // Calculate the previous month
  let previousMonth;
  if (newMonthString === 0) {
      // If newMonth is January (0), the previous month is December (12)
      previousMonth = 12;
  } else {
      // Otherwise, subtract 1 from the current month
      previousMonth = newMonthString ;
  }
  
  // Convert the previous month to a two-digit string (e.g. "03")
  const previousMonthString = previousMonth.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
  });

if(month !== "01" && month !== "12" && year == year1 ) {
// console.log(month + ' x ' + month1String )

  if(month == month1String && year == year1 && day1.getDate()  <= 20) {
    // console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

    await specialDaylist.push(day1.getDate() );
    holidayRate = await response.data.salary || foundWorkplace.workRate;
  } else {
    if(previousMonthString  == month1String && day1.getDate() >= 21) {
      console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);

      await specialDaylist.push(day1.getDate() );
holidayRate = await response.data.salary || foundWorkplace.workRate;
    }
  }

       } else {
        // month is 01
        if(month == "01" ) {
          if(year1 == year -1 && month1String == "12" && day1 >= 21 ) {
            await specialDaylist.push(day1.getDate() );
            holidayRate = await response.data.salary || foundWorkplace.workRate;
          }
          if(year1 == year  && month1String == "01" && day1 <= 20 ) {
            await specialDaylist.push(day1.getDate() );
            holidayRate = await response.data.salary || foundWorkplace.workRate;
          }

        }
        // month is 12
        if(month == "12" ){
          if(year1 == year  && month1String == "12" && day1 <= 20 ) {
            await specialDaylist.push(day1.getDate() );
            holidayRate = await response.data.salary || foundWorkplace.workRate;
          }

        }

       }


// console.log(year + ' ' + year1 + ' ' + month + ' ' + month1String);
      })
    );

// Format the components as desired
// const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

    } else {
      // Workplace with the given ID not found
      // await console.log('Workplace not found');
    }

    // data.employeeId = responseConclude.data.recordConclude[c].employeeId;
    data.name = await response.data.name;
    data.lastName = await response.data.lastName;


    //check cal social 
    let promises = [];
    let promises1 = [];
    let promisesDeduct = [];
let addSalaryList = [];
let deductSalaryList = [];


    for (let k = 0; k < response.data.addSalary.length; k++) {

      //check addSalary with tax and cal social
        const promise1 = await checkCalTax(response.data.addSalary[k].id || '0');
        const promise = await checkCalSocial(response.data.addSalary[k].id || '0');
        
        await promises.push(promise);
        await promises1.push(promise1);

        //check tax 
        if(response.data.addSalary[k].SpSalary !== ""){
        if(promise1) {
          //data cal tax

          //check cal social
if(promise) {
//data cal social
// sumAddSalaryBeforeTax = sumAddSalaryBeforeTax + parseFloat(response.data.addSalary[k].SpSalary || 0);
} else {
//data non social
// sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial  + parseFloat(response.data.addSalary[k].SpSalary || 0);
}
          // console.log('tax' + response.data.addSalary[k].id || '0'); 

        } else {
          // console.log('non tax' + response.data.addSalary[k].id || '0');
          // sumAddSalaryAfterTax  = sumAddSalaryAfterTax  + parseFloat(response.data.addSalary[k].SpSalary || 0);
        }
      }

        //push addSalary to account
        if(response.data.addSalary[k].roundOfSalary == "daily" ) {
        //   if( response.data.addSalary[k].SpSalary !== "") {
        //     let dailyTmp = await response.data.addSalary[k];
        //     dailyTmp.message = await countDay;
        //     await addSalaryList.push(dailyTmp);
        //   }

        } else {
          if( response.data.addSalary[k].SpSalary !== "") {
            //add addSalary monthly to list 
          await addSalaryList.push(response.data.addSalary[k]);
          }

        }
// console.log(response.data.addSalary[k].roundOfSalary );
    }

    for (let l = 0; l < response.data.deductSalary.length; l++) {
      const promisesDeduct1 = await checkCalTax(response.data.deductSalary[l].id || '0');
      const promisesDeduct2 = await checkCalSocial(response.data.deductSalary[l].id || '0');

      await promisesDeduct.push(promisesDeduct1 );
await deductSalaryList.push(response.data.deductSalary[l] );

        //check tax 
          if(promisesDeduct1 ) {
            //data cal tax
  
            //check cal social
  if(promisesDeduct2 ) {
  //data cal social
  sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial + parseFloat(response.data.deductSalary[l].amount || 0);

  } else {
  //data non social
  sumDeductBeforeTax = sumDeductBeforeTax + parseFloat(response.data.deductSalary[l].amount || 0);

  }
  
          } else {
            sumDeductAfterTax = sumDeductAfterTax + parseFloat(response.data.deductSalary[l].amount || 0);

          }
        
  
  }

    await Promise.all(promises)
        .then(results => {
            // let sumSocial = 0;
            results.forEach((result, k) => {
                if (result === true) {
                    sumSocial += parseFloat(response.data.addSalary[k].SpSalary || 0);
                    // console.log(`Promise ${k} is resolved`);
                    // console.log(response.data.addSalary[k].SpSalary);
                }
            });
            // console.log(sumSocial);
        })
        .catch(error => {
            console.error('Error occurred while processing promises:', error);
        });
    


//check cal tax
await Promise.all(promises1)
.then(results => {
    // let sumSocial = 0;
    results.forEach((result, k) => {
        if (result === true) {
          if(response.data.addSalary[k].roundOfSalary === "daily") {
            sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
            sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0) *countDay;

          } else {
            sumCalTax+= parseFloat(response.data.addSalary[k].SpSalary || 0);
            sumCalTaxNonSalary += parseFloat(response.data.addSalary[k].SpSalary || 0);

          }

            // console.log(`Promise ${k} is resolved`);
            // console.log(response.data.addSalary[k].SpSalary);
        }  else {
          if(response.data.addSalary[k].roundOfSalary === "daily") {
            sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0) * countDay;
          } else {
            sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
          }

        }
    });
    // console.log(sumCalTax);
})
.catch(error => {
    console.error('Error occurred while processing promises:', error);
});

//check deduct calculate tax
await Promise.all(promisesDeduct)
.then(results => {
    // let sumSocial = 0;
    results.forEach((result, k) => {
        if (result === true) {
            sumDeductWithTax += parseFloat(response.data.deductSalary[k].amount || 0);

        }  else {
          // sumNonTaxNonSalary+= parseFloat(response.data.addSalary[k].SpSalary || 0);
          sumDeductUncalculateTax += parseFloat(response.data.deductSalary[k].amount || 0);

        }
    });
    // console.log(sumCalTax);
})
.catch(error => {
    console.error('Error occurred while processing promises:', error);
});

addSalaryDayArray = [];  

//ss1
for (let i = 0; i < responseConclude.data.recordConclude[c].concludeRecord.length; i++) {
  amountDay += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0);
  amountOt += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT || 0);
  amountSpecial += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].addSalaryDay || 0);
  countHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  countOtHour += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  countOtHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);

  //get hour rate
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1') {
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1'){
    amountOne = Number(amountOne ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourOne = Number(hourOne) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '1.5') {
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '1.5'){
    amountOneFive = Number(amountOneFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourOneFive = Number(hourOneFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2') {
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2'){
    amountTwo = Number(amountTwo ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwo = Number(hourTwo) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '2.5') {
    amountTwoFive = Number(amountTwoFive ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '2.5'){
    amountTwoFive = Number(amountTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourTwoFive = Number(hourTwoFive) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateMultiply === '3') {
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRate);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }
  if(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOTMultiply === '3'){
    amountThree = Number(amountThree ) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].workRateOT);
    hourThree = Number(hourThree) + Number(responseConclude.data.recordConclude[c].concludeRecord[i].otTimes || 0);
  }
  
  //check work rate is not standard day
  if(parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate || 0) == parseFloat(salary) ) {
dayOffWork += 1;
countHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);

console.log('work rate '+ parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].workRate ) + 'salary ' + parseFloat(salary) );

  } else {
    countOtHourWork += parseFloat(responseConclude.data.recordConclude[c].concludeRecord[i].allTimes || 0);
  }

  
  if (responseConclude.data.recordConclude[c].concludeRecord[i].workRate !== undefined) {
    countDay++;

    if(dayOffList.includes( getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) ) ) {
// console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );
dayOffSumWork += 1;      
    }
// console.log(getDayNumberFromDate( responseConclude.data.recordConclude[c].concludeRecord[i].day) );

    workDaylist.push(responseConclude.data.recordConclude[c].concludeRecord[i].day.split("/")[0] );

    //check addSalary day from conclude
    // console.log("addSalary "+ JSON.stringify( responseConclude.data.recordConclude[c].addSalary ,null,2) );
// console.log(responseConclude.data.recordConclude[c].addSalary[i].length );
if(responseConclude.data.recordConclude[c].addSalary[i]) {

await responseConclude.data.recordConclude[c].addSalary[i].map( async (item, index) => {

  let checkAddSalaryDay  = false;
  addSalaryDayArray.map(tmp => {
if(tmp.id === item.id) {
  checkAddSalaryDay   = true;
  tmp.SpSalary = parseFloat(tmp.SpSalary) + parseFloat(item.SpSalary);
  tmp.message = parseFloat(tmp.message || 1) + 1;

}
  })

  if (! checkAddSalaryDay ) {
    // await console.log(" push " + item.id );
    await addSalaryDayArray.push(item);
  } else {
    // await console.log('update"' + item.id );
  }

if(item.id == '1230') {
  x1230 += parseFloat(item.SpSalary);
} else
if(item.id == '1350') {
  x1350 += parseFloat(item.SpSalary);
} else
if(item.id == '1520') {
  x1520 += parseFloat(item.SpSalary);
} else
if(item.id == '1535') {
  x1535 += parseFloat(item.SpSalary);
} else {
  // console.log(item.SpSalary);
  
}

});

  }

  }

}
// await console.log('addSalaryDayArray '+ JSON.stringify(addSalaryDayArray ,null,2));

//set data to position , tel , travel
if(x1230 >0 ) {
  data.accountingRecord.amountPosition = await x1230;
}
if(x1350 >0 ) {
  data.accountingRecord.tel = x1350;
}
if(x1520 >0 ) {
  data.accountingRecord.travel = x1520;
}
if(x1535 >0 ) {
  data.accountingRecord.benefitNonSocial = x1535;
}


data.accountingRecord.countDay = countDay;
data.accountingRecord.countHour = countHour;
data.accountingRecord.countOtHour = countOtHour;

data.accountingRecord.amountDay = amountDay;
data.accountingRecord.amountOt = amountOt;


// sumSocial = await sumSocial + amountDay;
sumCalTax = await sumCalTax + amountDay;
sumCalTax = await sumCalTax + amountOt;
console.log(addSalaryDayArray.length);

//concat addSalary
addSalaryList  = await addSalaryList .concat(addSalaryDayArray);
console.log(addSalaryList .length);
// Variables for summation
let sumAddSalaryBeforeTaxTmp = 0;
let sumAddSalaryBeforeTaxNonSocialTmp = 0;
let sumAddSalaryAfterTaxTmp = 0;

await addSalaryList.forEach(item => {
total = total + parseFloat( item.SpSalary || 0);
sumAddSalary = sumAddSalary + parseFloat( item.SpSalary || 0);

});

//check addSalary with cal tax and social 
await (async () => {
  await Promise.all(addSalaryList.map(async item => {

    if(item.id === '1230' || item.id === '1350' || item.id === '1520' || item.id === '1535' || item.id === '1410') {
      if(item.id === '1230') {
          data.accountingRecord.amountPosition = await item.SpSalary || 0;
      }  else {
        // data.accountingRecord.amountPosition =  await 0;
      }
          if(item.id === '1350' ) {
  data.accountingRecord.tel = await item.SpSalary || 0;
          }  else {
            // data.accountingRecord.tel = await 0;
          }
if(item.id === '1520') {
  data.accountingRecord.travel = await item.SpSalary || 0;
}  else {
  // data.accountingRecord.travel =  await 0;
}
if(item.id === '1535') {
  data.accountingRecord.benefitNonSocial = await item.SpSalary || 0;
} else {
  // data.accountingRecord.benefitNonSocial = await 0;
}
if(item.id === '1410') {
  data.accountingRecord.amountHardWorking = await item.SpSalary || 0;
} else {
  // data.accountingRecord.benefitNonSocial = await 0;
}

    } else {

    let taxStatus = await checkCalTax(item.id);
    // console.log('taxStatus ' + item.id + ' ' + taxStatus + ' ' + item.SpSalary);

    if (taxStatus) {
      // Calculate tax
      let socialStatus = await checkCalSocial(item.id);
      // console.log('socialStatus ' + item.id + ' ' + socialStatus + ' ' + item.SpSalary);

      if (socialStatus) {
        // Calculate social
        sumAddSalaryBeforeTaxTmp += parseFloat(item.SpSalary);
      } else {
        // Non-social
        sumAddSalaryBeforeTaxNonSocialTmp += parseFloat(item.SpSalary);
      }
    } else {
      // Non-tax
      sumAddSalaryAfterTaxTmp += parseFloat(item.SpSalary);
    }
  }

  }));

  sumAddSalaryBeforeTax = sumAddSalaryBeforeTaxTmp;
  sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocialTmp;
  sumAddSalaryAfterTax = sumAddSalaryAfterTaxTmp;
  // console.log('sumAddSalaryBeforeTax ' + sumAddSalaryBeforeTax);
  // console.log('sumAddSalaryBeforeTaxNonSocial ' + sumAddSalaryBeforeTaxNonSocial);
  // console.log('sumAddSalaryAfterTax ' + sumAddSalaryAfterTax);

})();

//check isset amountPosition , tel, travel and benefitNonSocial
if (data?.accountingRecord?.amountPosition ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.amountPosition =  await 0;
}
if (data?.accountingRecord?.tel ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.tel =  await 0;
}
if (data?.accountingRecord?.travel ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.travel =  await 0;
}
if (data?.accountingRecord?.benefitNonSocial ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.benefitNonSocial =  await 0;
}
if (data?.accountingRecord?.amountHardWorking ?? false) {
  // The property is set and truthy
} else {
  // The property is not set or it is falsy
    data.accountingRecord.amountHardWorking =  await 0;
}

// await console.log(sumSocial );

const intersection = await workDaylist.filter(day => specialDaylist.includes(parseInt(day)));

await console.log(data.employeeId + ' ' + month);
// await console.log('workDaylist' + JSON.stringify(workDaylist,null,2))
await console.log('specialDaylist' + JSON.stringify(specialDaylist,null,2));

await console.log('intersection: ' + intersection); // Output: ['2', '3', '4']
await console.log('total ' + total );
// console.log('specialDaylist.length ' + specialDaylist.length + 'intersection.length '+ intersection.length + 'holidayRate '+ holidayRate )
let s1 = await specialDaylist.length ||0;
let s2 = await intersection.length || 0;
let calSP = await ((s1 - s2) * holidayRate );

// console.log('calSP '+ calSP );
// sumSocial  = await sumSocial  + calSP ;

let workDaySocial = await countDay - dayOffSum - s2;

sumSocial = await sumSocial  + (dayOffWork * salary) + calSP ;

await console.log('countDay '+ countDay + ' dayOffSumWork ' + dayOffSumWork  + ' s2 '  +s2 + 'workDaySocial ' + workDaySocial );

console.log('workDaySocial '+ (workDaySocial * salary) + 'sumSocial '+ sumSocial );

sumAmountDayWork  = await Number(dayOffWork) * Number(salary);
let  calOtWork = await (Number(amountDay) - Number(sumAmountDayWork ) ) + Number(amountOt) || 0;

    // Other properties
    data.accountingRecord.amountSpecialDay= await calSP ||0;
    data.accountingRecord.countDayWork = await dayOffWork ||0;
    data.accountingRecord.amountCountDayWork = await sumAmountDayWork ||0;
    data.accountingRecord.amountCountDayWorkOt = await calOtWork ||0;
    data.accountingRecord.countHourWork = await countHourWork ||0;
    data.accountingRecord.countOtHourWork = await countOtHourWork ||0;


        //data for hour amount
        data.accountingRecord.amountOne = await amountOne ||0;
        data.accountingRecord.hourOne = await hourOne ||0;
        data.accountingRecord.amountOneFive = await amountOneFive ||0;
        data.accountingRecord.hourOneFive = await hourOneFive ||0;
        data.accountingRecord.amountTwo = await amountTwo ||0;
        data.accountingRecord.hourTwo = await hourTwo ||0;
        data.accountingRecord.amountTwoFive = await amountTwoFive ||0;
        data.accountingRecord.hourTwoFive = await hourTwoFive ||0;
        data.accountingRecord.amountThree = await amountThree ||0;
        data.accountingRecord.hourThree = await hourThree ||0;
    
    
    data.accountingRecord.amountHoliday = 0;
    data.accountingRecord.addAmountBeforeTax = sumCalTaxNonSalary || 0;
    data.accountingRecord.deductBeforeTax = sumDeductWithTax || 0;
    // data.accountingRecord.tax = sumCalTax || 0;
    // Assuming sumSocial is defined somewhere before this code
// Check if sumSocial is greater than 15000
if (sumSocial > 15000) {
  sumSocial = await 15000; // Set sumSocial to 15000
}
if (sumSocial < 1650) {
  sumSocial = await 83; // Set sumSocial to 83
}


// Calculate socialSecurity based on sumSocial
// data.accountingRecord.socialSecurity = Math.ceil((sumSocial * 0.05)) || 0;
data.accountingRecord.socialSecurity = Math.round(
  sumSocial * (parseFloat(settingResult?.data?.[settingResult.data.length - 1]?.social?.[0]?.socialPercent || '5') / 100)
) || 0;

//total
total = await total  + amountDay + amountOt + calSP -(Math.ceil((sumSocial * 0.05) || 0)) - tax;

    // data.accountingRecord.socialSecurity = (sumSocial * 0.05) || 0;
    data.accountingRecord.addAmountAfterTax = sumNonTaxNonSalary || 0;
    // data.accountingRecord.advancePayment = 0;
    data.accountingRecord.deductAfterTax = sumDeductUncalculateTax || 0;
    data.accountingRecord.bank = 0;
    data.accountingRecord.total = total || 0;

    data.accountingRecord.sumAddSalaryBeforeTax = sumAddSalaryBeforeTax || 0;
    data.accountingRecord.sumAddSalaryBeforeTaxNonSocial = sumAddSalaryBeforeTaxNonSocial || 0;
    data.accountingRecord.sumDeductBeforeTaxWithSocial = sumDeductBeforeTaxWithSocial || 0;
    data.accountingRecord.sumDeductBeforeTax = sumDeductBeforeTax || 0;
    data.accountingRecord.sumAddSalaryAfterTax = sumAddSalaryAfterTax || 0;
    data.accountingRecord.sumDeductAfterTax = sumDeductAfterTax || 0;

    data.accountingRecord.sumSalaryForTax = sumCalTax || 0;

    data.accountingRecord.sumAddSalary = sumAddSalary || 0;

    data.addSalary = await addSalaryList || [];

data.deductSalary = deductSalaryList || [];

data.specialDayRate = await holidayRate || 0;
data.countSpecialDay = await specialDaylist.length || 0;
data.specialDayListWork = await intersection || [];
//end point


}

        dataList.push(data);
      }
    } else {
      console.log('no data conclude');
    }

    // console.log(JSON.stringify(dataList, null, 2));

    if (dataList.length > 0) {
      res.json(dataList);
    } else {
      res.status(404).json({ error: 'accounting not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/update/:_id', async (req, res) => {
  const accountingIdToUpdate = req.params._id;
  const updateFields = req.body;

  try {
    // Find the resource by ID and update it
    const updatedResource = await accounting.findByIdAndUpdate(
      accountingIdToUpdate ,
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

// Update amountSpecialDay endpoint
router.post('/updateSpecialDay', async (req, res) => {
  const { id, amountSpecialDay } = req.body;

  try {
    const accountingRecord = await accounting.findById(id);
    if (!accountingRecord) {
      return res.status(404).send({ error: 'Accounting record not found' });
    }

    // Update the amountSpecialDay field
    if (Array.isArray(accountingRecord.accountingRecord)) {
      accountingRecord.accountingRecord[0].amountSpecialDay = amountSpecialDay;
    } else {
      accountingRecord.accountingRecord.amountSpecialDay = amountSpecialDay;
    }

    // Save the updated record
    await accountingRecord.save();

    res.status(200).send({ message: 'amountSpecialDay updated successfully', accountingRecord });
  } catch (error) {
    console.error('Error updating amountSpecialDay:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});


//latest code


router.post('/updatetimerecord', async (req, res) => {
  try {
    const { _id, updates } = req.body;

    if (!_id || !updates) {
      return res.status(400).json({ message: 'Missing required fields (_id or updates)' });
    }

    const updatedRecord = await timerecordEmployee.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true } // ส่งค่าที่อัปเดตกลับมา
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', updatedRecord });

  } catch (error) {
    console.error('Error updating time record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/searchtimerecordbyworkplace', async (req, res) => {
  try {
    const { month, year, workplaceId } = req.body;
    
    console.log(`🔍 [WORKPLACE] API called with parameters:`, { month, year, workplaceId });

    if (!month || !year) {
      console.log(`❌ [WORKPLACE] Missing month or year parameters`);
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // Step 1: Fetch all matching time records
    const records = await timerecordEmployee.find({
      month: { $regex: new RegExp(month, 'i') },
      year: { $regex: new RegExp(year, 'i') },
    });
    
    console.log(`🔍 [WORKPLACE] Found ${records.length} total records for month=${month}, year=${year}`);

    if (!records.length) {
      console.log(`❌ [WORKPLACE] No records found, returning empty result`);
      return res.status(200).json({ groupedResult: {}, message: 'No records found' });
    }

    // Step 2: Fetch all employee profiles to avoid repeated queries
    const employeeIds = records.map(r => r.employeeId);
    console.log(`🔍 [WORKPLACE] Employee IDs from records: ${employeeIds.join(', ')}`);
    
    const employees = await Employee.find({ employeeId: { $in: employeeIds } });
    console.log(`🔍 [WORKPLACE] Found ${employees.length} employee profiles`);

    const employeeMap = {};
    employees.forEach(emp => {
      if (emp.employeeId) {
        employeeMap[emp.employeeId] = emp;
        console.log(`🔍 [WORKPLACE] Employee ${emp.employeeId} -> workplace: ${emp.workplace}`);
      }
    });

    // Step 3: Group and filter by workplaceId (if provided)
    const groupedResult = {};

    for (const record of records) {
      const employee = employeeMap[record.employeeId];
      
      console.log(`🔍 [WORKPLACE] Processing record for employeeId: ${record.employeeId}`);

      if (!employee) {
        console.log(`❌ [WORKPLACE] No employee profile found for employeeId: ${record.employeeId}`);
        continue;
      }
      
      if (!employee.workplace) {
        console.log(`❌ [WORKPLACE] Employee ${record.employeeId} has no workplace assigned`);
        continue;
      }

      const empWorkplaceId = employee.workplace;
      console.log(`🔍 [WORKPLACE] Employee ${record.employeeId} workplace: ${empWorkplaceId}, target: ${workplaceId || 'ALL'}`);

      // ตรวจสอบว่าพนักงานทำงานในหน่วยงานที่ต้องการหรือไม่
      let shouldInclude = false;

      if (!workplaceId) {
        // ถ้าไม่ระบุ workplaceId ให้แสดงทั้งหมด
        shouldInclude = true;
        console.log(`✅ [WORKPLACE] Include all - employee ${record.employeeId}`);
      } else {
        // เช็คว่าพนักงานสังกัดหน่วยงานที่ต้องการ
        if (empWorkplaceId === workplaceId) {
          shouldInclude = true;
          console.log(`✅ [WORKPLACE] Match direct workplace - employee ${record.employeeId}`);
        } else {
          // เช็คว่าพนักงานจากหน่วยงานอื่นมาทำงานที่หน่วยงานนี้หรือไม่
          if (record.employee_record && Array.isArray(record.employee_record)) {
            const worksAtTargetWorkplace = record.employee_record.some(rec => 
              rec.workplaceId === workplaceId
            );
            if (worksAtTargetWorkplace) {
              shouldInclude = true;
              console.log(`🔄 พบพนักงานข้ามหน่วยงาน: ${record.employeeId} (สังกัด ${empWorkplaceId}) มาทำงานที่ ${workplaceId}`);
            }
          }
        }
      }

      if (!shouldInclude) continue;

            // 🔥 เพิ่มเช็ค dayWorkCount หรือ dayOffCount และดึง personalDayOff
            if (!isRecursiveCall && (!record.dayWorkCount || !record.dayOffCount || !record.personalDayOff)) {
              console.log(`🔍 Missing data for employeeId=${record.employeeId} month ${record.month} year ${record.year}`);
              console.log(`  - dayWorkCount: ${record.dayWorkCount || 'ไม่มี'}`);
              console.log(`  - dayOffCount: ${record.dayOffCount || 'ไม่มี'}`);
              console.log(`  - personalDayOff: ${record.personalDayOff ? 'มี' : 'ไม่มี'}`);
              console.log(`  - stopDaysList: ${record.stopDaysList ? 'มี' : 'ไม่มี'}`);
      
              try {
                const apiRes = await axios.post(sURL + '/conclude/searchtimerecordemployee', {
                  employeeId: record.employeeId,
                  month: record.month,
                  year: record.year,
                });
                
                const apiRes1 = await axios.post(sURL + '/accounting/searchtimerecordemployee', {
                  employeeId: record.employeeId,
                  month: record.month,
                  year: record.year,
                  isRecursiveCall: true  // เพิ่ม flag เพื่อป้องกัน recursive call
                });
            
                // ดึง personalDayOff จาก conclude API response
                if (apiRes.data && apiRes.data.result && apiRes.data.result.length > 0) {
                  const concludeData = apiRes.data.result[0];
                  if (concludeData.personalDayOff) {
                    record.personalDayOff = concludeData.personalDayOff;
                    record.stopDaysList = concludeData.personalDayOff; // ความเข้ากันได้ย้อนหลัง
                    console.log(`🟢 ได้ personalDayOff สำหรับ ${record.employeeId}: ${record.personalDayOff.length} วัน`);
                  } else if (concludeData.stopDaysList) {
                    // fallback ถ้าไม่มี personalDayOff แต่มี stopDaysList
                    record.personalDayOff = concludeData.stopDaysList;
                    record.stopDaysList = concludeData.stopDaysList;
                    console.log(`🟢 ได้ stopDaysList สำหรับ ${record.employeeId}: ${record.stopDaysList.length} วัน`);
                  }
                  if (concludeData.cashcustomizeDayoff) {
                    record.cashcustomizeDayoff = concludeData.cashcustomizeDayoff;
                    console.log(`💎 ได้ cashcustomizeDayoff สำหรับ ${record.employeeId}: ${record.cashcustomizeDayoff} บาท`);
                  }
                }
      
              } catch (error) {
                console.error(`❌ Error fetching updated timerecord for employeeId=${record.employeeId}`, error.message);
              }
            }

           if (!groupedResult[empWorkplaceId]) {
        groupedResult[empWorkplaceId] = [];
      }

      // กำหนด workplace สำหรับการจัดกลุ่ม
      let targetWorkplaceForGrouping = empWorkplaceId;
      
      // ถ้าเป็นพนักงานข้ามหน่วยงาน ให้จัดกลุ่มตาม workplaceId ที่ทำงานจริง
      if (workplaceId && empWorkplaceId !== workplaceId) {
        targetWorkplaceForGrouping = workplaceId;
        if (!groupedResult[workplaceId]) {
          groupedResult[workplaceId] = [];
        }
      }

      const processedRecord = record.toObject();
      
      // คำนวณค่าเงินใหม่โดยใช้ฟังก์ชัน calculateCashValues
      try {
        const calculatedValues = await calculateCashValues(
          record.employeeId,
          record.employee_record,
          record.month,
          record.year
        );
        
        // อัปเดตค่าที่คำนวณใหม่
        processedRecord.sumCashWorkMul = calculatedValues.sumCashWorkMul;
        processedRecord.sumOt1p5 = calculatedValues.sumOt1p5;
        processedRecord.sumOt3 = calculatedValues.sumOt3;
        processedRecord.sumCashOt = calculatedValues.sumCashOt;
        processedRecord.sumCashWork = calculatedValues.sumCashWork;
        processedRecord.dayWorkCount = calculatedValues.dayWorkCount;
        processedRecord.dayOffCount = calculatedValues.dayOffCount;
        processedRecord.employeeCompensation = calculatedValues.employeeCompensation;
        processedRecord.sumCashWork1_20 = calculatedValues.sumCashWork1_20;
        processedRecord.sumCashWork21_30_31 = calculatedValues.sumCashWork21_30_31;
        
        console.log(`🔄 คำนวณค่าเงินใหม่สำหรับพนักงาน ${record.employeeId}:`);
        console.log(`   - sumCashWorkMul["1.5"]: ${calculatedValues.sumCashWorkMul["1.5"]} บาท`);
        console.log(`   - sumOt1p5: ${calculatedValues.sumOt1p5} ชั่วโมง`);
        console.log(`   - dayWorkCount: ${calculatedValues.dayWorkCount} วัน`);
        console.log(`   - dayOffCount: ${calculatedValues.dayOffCount} วัน`);
        console.log(`   - employeeCompensation: ${calculatedValues.employeeCompensation} บาท`);
        console.log(`   - sumCashWork1_20: ${calculatedValues.sumCashWork1_20} บาท`);
        console.log(`   - sumCashWork21_30_31: ${calculatedValues.sumCashWork21_30_31} บาท`);
        
      } catch (error) {
        console.error(`❌ Error calculating cash values for ${record.employeeId}:`, error);
        
        // Fallback: คำนวณ sumOt1p5 แบบเดิม
        let recalculatedSumOt1p5 = 0;
        let workDays = 0;
        
        if (processedRecord.employee_record && Array.isArray(processedRecord.employee_record)) {
          processedRecord.employee_record.forEach(rec => {
            if (rec.totalOtTime) {
              let decimalOt = 0;
              if (typeof rec.totalOtTime === 'string' && rec.totalOtTime.endsWith('.50')) {
                const hours = parseInt(rec.totalOtTime.split('.')[0]);
                decimalOt = hours + 0.5;
                rec.totalOtTime = decimalOt.toFixed(2);
              } else {
                const [hours, minutes] = String(rec.totalOtTime).split('.').map(Number);
                decimalOt = (hours || 0) + ((minutes || 0) / 60);
                rec.totalOtTime = decimalOt.toFixed(2);
              }
            }
            
            if (rec.dayType === "work") {
              workDays++;
              if (rec.totalOtTime) {
                let decimalOt = 0;
                if (typeof rec.totalOtTime === 'string' && rec.totalOtTime.endsWith('.50')) {
                  const hours = parseInt(rec.totalOtTime.split('.')[0]);
                  decimalOt = hours + 0.5;
                } else {
                  const [hours, minutes] = String(rec.totalOtTime).split('.').map(Number);
                  decimalOt = (hours || 0) + ((minutes || 0) / 60);
                }
                recalculatedSumOt1p5 += decimalOt;
              }
            }
          });
        }
        
        processedRecord.sumOt1p5 = recalculatedSumOt1p5.toFixed(2);
        console.log(`🔄 Fallback: คำนวณ sumOt1p5 ใหม่สำหรับพนักงาน ${record.employeeId}: ${processedRecord.sumOt1p5} ชั่วโมง`);
      }

      // Debug: ตรวจสอบข้อมูล personalDayOff และ cashcustomizeDayoff
      console.log(`📊 Debug ข้อมูล employee ${record.employeeId}:`);
      console.log(`  - personalDayOff จาก DB:`, record.personalDayOff);
      console.log(`  - stopDaysList จาก DB:`, record.stopDaysList);
      console.log(`  - cashcustomizeDayoff จาก DB:`, record.cashcustomizeDayoff);
      console.log(`  - status จาก DB:`, record.status);
      console.log(`  - month: ${record.month}, year: ${record.year}`);

      groupedResult[targetWorkplaceForGrouping].push({
        ...processedRecord,
        employeeName: employee.name + ' ' + (employee.lastName || ''),
        workplaceName: employee.workplaceName || '', // if available
        // เพิ่มข้อมูลเพื่อระบุว่าเป็นพนักงานข้ามหน่วยงาน
        originalWorkplace: empWorkplaceId,
        isCrossWorkplace: empWorkplaceId !== targetWorkplaceForGrouping,
        // เพิ่ม personalDayOff และ stopDaysList เพื่อให้แน่ใจว่าถูกส่งไปยัง frontend
        personalDayOff: record.personalDayOff || [],
        stopDaysList: record.stopDaysList || record.personalDayOff || [], // ความเข้ากันได้ย้อนหลัง
        cashcustomizeDayoff: record.cashcustomizeDayoff || 0
      });
      
      // Debug log เพื่อตรวจสอบข้อมูลที่ส่งกลับ
      const crossWorkplaceInfo = empWorkplaceId !== targetWorkplaceForGrouping ? 
        ` (ข้ามหน่วยงานจาก ${empWorkplaceId} มาทำงานที่ ${targetWorkplaceForGrouping})` : '';
      console.log(`📤 ส่งข้อมูลกลับสำหรับ ${record.employeeId}${crossWorkplaceInfo}:`);
      console.log(`  - personalDayOff: ${record.personalDayOff ? `${record.personalDayOff.length} วัน` : 'ไม่มี'}`);
      console.log(`  - stopDaysList: ${record.stopDaysList ? `${record.stopDaysList.length} วัน` : 'ไม่มี'}`);
      console.log(`  - cashcustomizeDayoff: ${record.cashcustomizeDayoff || 'ไม่มี'} บาท`);
    }

    return res.status(200).json({ groupedResult });

  } catch (error) {
    console.error("❌ Error in searchtimerecordbyworkplace:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST API endpoint to get records by year and month
router.post('/searchtimerecord', async (req, res) => {
  const { year, month } = req.body;

  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required." });
  }

  try {
    const records = await timerecordEmployee.find({ year, month });
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

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


router.post('/searchtimerecordemployee', async (req, res) => {
  try {
    const { employeeId, month, year, isRecursiveCall } = req.body;
    const query = {};

    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = { $regex: new RegExp(month, 'i') };
    if (year) query.year = { $regex: new RegExp(year, 'i') };

    if (!employeeId && !month && !year) {
      return res.status(200).json({ result: [], message: 'No query parameters provided' });
    }

    const records = await timerecordEmployee.find(query);

    if (!records.length) {
      return res.status(200).json({ result: [], message: 'No records found' });
    }

    // เพิ่มข้อมูล welfare/leave ลงใน addSalaryList ก่อนการประมวลผล
    console.log(`🔍 [ACCOUNTING] เริ่มค้นหาข้อมูล welfare สำหรับ ${records.length} records`);
    
    for (let record of records) {
      try {
        console.log(`🔍 [ACCOUNTING] ค้นหา welfare สำหรับพนักงาน: ${record.employeeId}`);
        
        // ค้นหาข้อมูล welfare ของพนักงาน
        const welfareQuery = { employeeId: record.employeeId };
        
        // ถ้ามีการระบุ year ให้กรองตามปี
        if (year && year !== '') {
          welfareQuery.year = year;
          console.log(`🔍 [ACCOUNTING] กรองตามปี: ${year}`);
        }
        
        const welfareRecords = await welfare.find(welfareQuery);
        console.log(`🔍 [ACCOUNTING] พบข้อมูล welfare: ${welfareRecords.length} records สำหรับพนักงาน ${record.employeeId}`);
        
        // รวม addSalaryList จากข้อมูล welfare ทั้งหมด
        let addSalaryFromWelfare = [];
        // สำหรับ id เฉพาะที่จะใช้ logic รวมตาม startDay
        const targetIds = new Set(['1423', '1234']);
        // ใช้ Map สำหรับรวมรายการของ id เฉพาะ: อนุญาต id ซ้ำได้ แต่ถ้า startDay ซ้ำจะไม่รวม; ถ้า startDay ต่างกันให้รวมและบวกเงิน
        const welfareAgg = new Map(); // key = welfareId, value = { item, seenDates: Set<string> }

        const normalizeStartDay = (d) => {
          if (!d) return '';
          const dt = new Date(d);
          return isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 10);
        };
        
        welfareRecords.forEach(welfareRecord => {
          if (welfareRecord.record && Array.isArray(welfareRecord.record)) {
            console.log(`🔍 [ACCOUNTING] ประมวลผล welfare record: ${welfareRecord.record.length} items`);
            welfareRecord.record.forEach(welfareItem => {
              // 🎯 กรองเฉพาะ records ที่อยู่ในรอบเงินเดือน (21 เดือนก่อน - 20 เดือนปัจจุบัน)
              let shouldInclude = true;
              
              if (month && month !== '' && welfareItem.startDay) {
                const recordStartDate = new Date(welfareItem.startDay);
                
                // คำนวณรอบเงินเดือน: 21 เดือนก่อน - 20 เดือนปัจจุบัน
                const currentYear = parseInt(year) || new Date().getFullYear();
                const currentMonth = parseInt(month);
                
                // วันที่เริ่มรอบ: 21 ของเดือนก่อน
                let startYear = currentYear;
                let startMonth = currentMonth - 1;
                if (startMonth < 1) {
                  startMonth = 12;
                  startYear--;
                }
                const periodStartDate = new Date(startYear, startMonth - 1, 21); // month - 1 เพราะ JS month เริ่มจาก 0
                
                // วันที่สิ้นสุดรอบ: 20 ของเดือนปัจจุบัน
                const periodEndDate = new Date(currentYear, currentMonth - 1, 20, 23, 59, 59); // สิ้นสุดวัน
                
                // ตรวจสอบว่า startDay อยู่ในรอบเงินเดือนหรือไม่
                shouldInclude = recordStartDate >= periodStartDate && recordStartDate <= periodEndDate;
                
                console.log(`🔍 [ACCOUNTING] กรองตามรอบเงินเดือน:`);
                console.log(`   - เดือนที่เลือก: ${month}/${year}`);
                console.log(`   - รอบเงินเดือน: ${periodStartDate.toISOString().slice(0,10)} ถึง ${periodEndDate.toISOString().slice(0,10)}`);
                console.log(`   - startDay: ${welfareItem.startDay}`);
                console.log(`   - recordDate: ${recordStartDate.toISOString().slice(0,10)}`);
                console.log(`   - include: ${shouldInclude}`);
              }
              
              if (!shouldInclude) return;

              const welfareId = welfareItem.id || welfareItem.welfareType || "";
              const amount = parseFloat(welfareItem.SpSalary || '0') || 0;

              if (targetIds.has(welfareId)) {
                // ใช้ logic เฉพาะ: รวมหลาย startDay เป็น 1 รายการต่อ id, เก็บข้อมูลวันที่ทั้งหมด
                const startKey = normalizeStartDay(welfareItem.startDay);
                if (!welfareAgg.has(welfareId)) {
                  const baseItem = {
                    id: welfareId,
                    name: welfareItem.name || welfareItem.welfareTypeEn || "",
                    SpSalary: String(amount),
                    roundOfSalary: welfareItem.roundOfSalary || "monthly",
                    StaffType: welfareItem.StaffType || "all",
                    nameType: welfareItem.nameType || "",
                    message: welfareItem.comment || welfareItem.message || "",
                    welfareType: welfareItem.welfareType || "",
                    startDay: startKey || "",
                    endDay: welfareItem.endDay || "",
                    welfareMonth: welfareRecord.month || "",
                    welfareYear: welfareRecord.year || "",
                    // เพิ่ม date/month/year ตามที่ขอ
                    date: startKey ? startKey.split('-')[2] : (welfareRecord.month ? '01' : ''),
                    month: startKey ? startKey.split('-')[1] : (welfareRecord.month || ''),
                    year: startKey ? startKey.split('-')[0] : (welfareRecord.year || ''),
                  };
                  welfareAgg.set(welfareId, { item: baseItem, seenDates: new Set(startKey ? [startKey] : []) });
                  console.log(`✅ [ACCOUNTING] (target) สร้างกลุ่ม id=${welfareId}, startDay=${startKey}, amount=${amount}`);
                } else {
                  const agg = welfareAgg.get(welfareId);
                  if (startKey && agg.seenDates.has(startKey)) {
                    console.log(`🚫 [ACCOUNTING] (target) ข้าม (id ซ้ำ + startDay ซ้ำ) id=${welfareId}, startDay=${startKey}, amount=${amount}`);
                  } else {
                    const current = parseFloat(agg.item.SpSalary || '0') || 0;
                    agg.item.SpSalary = String(current + amount);
                    if (startKey) {
                      agg.seenDates.add(startKey);
                      // รวมวันที่ในฟิลด์ date โดยคั่นด้วย comma
                      const currentDate = agg.item.date || '';
                      const newDate = startKey.split('-')[2];
                      if (currentDate && !currentDate.split(',').includes(newDate)) {
                        agg.item.date = currentDate + ',' + newDate;
                      } else if (!currentDate) {
                        agg.item.date = newDate;
                      }
                      
                      // อัปเดต startDay เป็นวันที่เก่าสุด
                      if (!agg.item.startDay) {
                        agg.item.startDay = startKey;
                        agg.item.month = startKey.split('-')[1];
                        agg.item.year = startKey.split('-')[0];
                      } else {
                        const existing = new Date(agg.item.startDay);
                        const incoming = new Date(startKey);
                        if (!isNaN(incoming.getTime()) && !isNaN(existing.getTime()) && incoming < existing) {
                          agg.item.startDay = startKey;
                          agg.item.month = startKey.split('-')[1];
                          agg.item.year = startKey.split('-')[0];
                        }
                      }
                    }
                    console.log(`🔄 [ACCOUNTING] (target) รวม id=${welfareId}, +${amount} ⇒ ${agg.item.SpSalary}, dates=${agg.item.date}`);
                  }
                }
              } else {
                // 🎯 สำหรับ id อื่นๆ: ใช้ logic รวม SpSalary ถ้า id เดียวกัน
                const existingIndex = addSalaryFromWelfare.findIndex(existingItem => existingItem.id === welfareId);
                
                if (existingIndex !== -1) {
                  // ถ้ามี id เดียวกันแล้ว ให้รวม SpSalary
                  const existingAmount = parseFloat(addSalaryFromWelfare[existingIndex].SpSalary || '0') || 0;
                  const newTotal = existingAmount + amount;
                  addSalaryFromWelfare[existingIndex].SpSalary = String(newTotal);
                  
                  // รวมวันที่ในฟิลด์ date
                  const currentStartDay = normalizeStartDay(welfareItem.startDay);
                  if (currentStartDay) {
                    const existingDate = addSalaryFromWelfare[existingIndex].date || '';
                    const newDate = currentStartDay.split('-')[2];
                    if (existingDate && !existingDate.split(',').includes(newDate)) {
                      addSalaryFromWelfare[existingIndex].date = existingDate + ',' + newDate;
                    } else if (!existingDate) {
                      addSalaryFromWelfare[existingIndex].date = newDate;
                    }
                  }
                  
                  console.log(`🔄 [ACCOUNTING] (normal) รวม id=${welfareId}, ${existingAmount} + ${amount} ⇒ ${newTotal}`);
                } else {
                  // ถ้าไม่มี id เดียวกัน ให้เพิ่มใหม่
                  addSalaryFromWelfare.push({
                    id: welfareId,
                    name: welfareItem.name || welfareItem.welfareTypeEn || "",
                    SpSalary: welfareItem.SpSalary || "0",
                    roundOfSalary: welfareItem.roundOfSalary || "monthly",
                    StaffType: welfareItem.StaffType || "all",
                    nameType: welfareItem.nameType || "",
                    message: welfareItem.comment || welfareItem.message || "",
                    welfareType: welfareItem.welfareType || "",
                    startDay: welfareItem.startDay || "",
                    endDay: welfareItem.endDay || "",
                    welfareMonth: welfareRecord.month || "",
                    welfareYear: welfareRecord.year || "",
                    // เพิ่ม date/month/year ตามที่ขอ
                    date: welfareItem.startDay ? normalizeStartDay(welfareItem.startDay).split('-')[2] : (welfareRecord.month ? '01' : ''),
                    month: welfareItem.startDay ? normalizeStartDay(welfareItem.startDay).split('-')[1] : (welfareRecord.month || ''),
                    year: welfareItem.startDay ? normalizeStartDay(welfareItem.startDay).split('-')[0] : (welfareRecord.year || ''),
                  });
                  console.log(`✅ [ACCOUNTING] (normal) เพิ่ม welfare item ใหม่: ${welfareItem.name} (${welfareItem.SpSalary})`);
                }
              }
            });
          }
        });

        // รวมผลของกลุ่ม target ids เข้ากับรายการปกติ
        const targetMergedItems = Array.from(welfareAgg.values()).map(v => v.item); // กลับมาใช้ .map(v => v.item) เพราะใช้ structure แบบเดิม
        addSalaryFromWelfare = [...addSalaryFromWelfare, ...targetMergedItems];
        console.log(`� [ACCOUNTING] สรุป welfare หลังประมวลผล: normal=${addSalaryFromWelfare.length - targetMergedItems.length} + target=${targetMergedItems.length} → total=${addSalaryFromWelfare.length}`);

        console.log(`📊 [ACCOUNTING] สำหรับพนักงาน ${record.employeeId}:`);
        console.log(`   - addSalaryList เดิม: ${record.addSalaryList ? record.addSalaryList.length : 0} items`);
        console.log(`   - welfare items: ${addSalaryFromWelfare.length} items`);

        // รวม addSalaryList เดิมกับข้อมูลจาก welfare
        if (!record.addSalaryList) {
          record.addSalaryList = [];
        }

        // 🎯 ลบข้อมูล welfare เดิมออกก่อนเพิ่มใหม่ เพื่อป้องกันการซ้ำ และ sync กับ DB
        const originalLength = record.addSalaryList ? record.addSalaryList.length : 0;
        
        // สร้าง Set ของ welfare IDs ที่มีอยู่จริงใน welfare database
        const validWelfareIds = new Set();
        addSalaryFromWelfare.forEach(item => {
          if (item.id) validWelfareIds.add(item.id);
        });
        
        console.log(`🔍 [ACCOUNTING] validWelfareIds จาก DB:`, Array.from(validWelfareIds));
        
        // Debug: แสดงข้อมูล addSalaryList ก่อนกรอง
        console.log(`🔍 [ACCOUNTING] addSalaryList ก่อนกรอง:`, record.addSalaryList.map(item => ({
          id: item.id,
          name: item.name,
          welfareType: item.welfareType || 'undefined',
          hasWelfareType: !!item.welfareType,
          inValidIds: validWelfareIds.has(item.id)
        })));
        
        // สร้าง list ของ welfare IDs ที่เป็นไปได้ - รวมทุก welfare ID ที่อาจปรากฏ
        const potentialWelfareIds = new Set([
      '1235', '1234', '1230', '1350', '1410', '1520', '1535', 
          '1423', '1242', '1233', '1243', // welfare IDs ที่พบในระบบ
          '1231', '1422', '1428', '1434', '1435', '1429', '1427', '1426', '1425', // welfare IDs เพิ่มเติม
          ...Array.from(validWelfareIds) // และ IDs ที่มีใน welfare database
        ]);
        
        console.log(`🔍 [ACCOUNTING] potentialWelfareIds ทั้งหมด:`, Array.from(potentialWelfareIds));
        
        // 🎯 กรองออกเฉพาะ welfare ID ที่มีใน validWelfareIds เพื่อป้องกันการซ้ำ
        // ⚠️ แก้ไข: ไม่ลบ welfare ที่มีอยู่แล้ว แต่ลบเฉพาะที่จะมีการอัปเดตใหม่
        record.addSalaryList = record.addSalaryList.filter(item => {
          const hasWelfareType = !!item.welfareType;
          const isPotentialWelfare = potentialWelfareIds.has(item.id);
          const isValidWelfare = validWelfareIds.has(item.id);
          
          // 🎯 Logic ใหม่: เก็บทุก item ที่ไม่ได้อยู่ใน validWelfareIds (ที่จะมีการอัปเดตใหม่)
          // เก็บ item ถ้า:
          // 1. ไม่ใช่ welfare ID ที่จะมีการอัปเดตใหม่จาก database
          const shouldKeep = !isValidWelfare;
          
          // 🔍 Enhanced debug logging สำหรับ welfare IDs
          if (isPotentialWelfare) {
            console.log(`🎯 [WELFARE DEBUG] ID ${item.id} Analysis:`);
            console.log(`   - name: ${item.name}`);
            console.log(`   - hasWelfareType: ${hasWelfareType}`);
            console.log(`   - isPotentialWelfare: ${isPotentialWelfare}`);
            console.log(`   - isValidWelfare: ${isValidWelfare}`);
            console.log(`   - shouldKeep: ${shouldKeep}`);
            console.log(`   - welfareType: ${item.welfareType || 'undefined'}`);
            
            if (!shouldKeep) {
              console.log(`   🗑️ -> จะถูกลบ เพราะจะถูกอัปเดตใหม่จาก welfare database`);
            } else {
              console.log(`   ✅ -> จะถูกเก็บไว้ เพราะไม่มีการอัปเดตใหม่`);
            }
          }
          
          if (!shouldKeep) {
            console.log(`🗑️ [ACCOUNTING] ลบ welfare item เพื่ออัปเดตใหม่: id=${item.id}, name=${item.name}, isValidWelfare=${isValidWelfare}`);
          }
          
          return shouldKeep;
        });
        
        console.log(`🧹 [ACCOUNTING] ลบข้อมูล welfare ที่จะมีการอัปเดตใหม่: ${originalLength} → ${record.addSalaryList.length} items`);
        
        // เพิ่ม welfare data ใหม่ที่อัปเดตแล้ว (เฉพาะที่มีอยู่จริงใน welfare database)
        record.addSalaryList = [...record.addSalaryList, ...addSalaryFromWelfare];
        console.log(`📝 [ACCOUNTING] เพิ่ม welfare data ใหม่จาก DB: ${addSalaryFromWelfare.length} items`);
        
        console.log(`   - รวมแล้ว: ${record.addSalaryList.length} items`);
        
      } catch (welfareError) {
        console.error('❌ [ACCOUNTING] Error fetching welfare data for employee:', record.employeeId, welfareError);
        // ถ้ามีข้อผิดพลาดในการดึงข้อมูล welfare ก็ให้ใช้ addSalaryList เดิม
        if (!record.addSalaryList) {
          record.addSalaryList = [];
        }
      }
    }

    const updatedRecords = [];

    for (const doc of records) {
      if (!doc || !Array.isArray(doc.employee_record) || doc.employee_record.length === 0) {
        console.warn(`Skipping invalid or empty document: ${doc._id}`);
        continue;
      }

      try {
        // ดึงข้อมูล prefix และ employeeName จาก Employee model
        let employeePrefix = '';
        let employeeName = '';
        try {
          const employee = await Employee.findOne({ employeeId: doc.employeeId });
          employeePrefix = employee?.prefix || '';
          employeeName = `${employee?.name || ''} ${employee?.lastName || ''}`.trim();
          console.log(`🔍 Found prefix for ${doc.employeeId}: ${employeePrefix}`);
          console.log(`🔍 Found employeeName for ${doc.employeeId}: ${employeeName}`);
        } catch (prefixError) {
          console.warn(`⚠️ Could not fetch prefix and employeeName for employee ${doc.employeeId}:`, prefixError.message);
        }

        const calculatedValues = await calculateCashValues(
          doc.employeeId,
          doc.employee_record,
          doc.month,
          doc.year,
          doc.addSalaryList // ส่ง addSalaryList ที่มี welfare data แล้วจากการประมวลผลข้างต้น
        );

        // Log ค่าที่ได้จาก calculateCashValues
        console.log(`\n🎯 === ค่าที่ได้รับจาก calculateCashValues ===`);
        console.log(`🎯 calculatedValues.countAllowance: ${calculatedValues.countAllowance}`);
        console.log(`🎯 calculatedValues.dayWorkCount: ${calculatedValues.dayWorkCount}`);
        console.log(`🎯 calculatedValues.addSalaryList.length: ${calculatedValues.addSalaryList?.length || 0}`);
        
        // แสดงรายละเอียด addSalaryList ที่ได้รับมา
        if (Array.isArray(calculatedValues.addSalaryList) && calculatedValues.addSalaryList.length > 0) {
          console.log(`🎯 รายละเอียด addSalaryList ที่ได้รับมา:`);
          calculatedValues.addSalaryList.forEach((item, idx) => {
            console.log(`   [${idx}] id=${item.id}, name=${item.name}, SpSalary=${item.SpSalary}, message=${item.message}, roundOfSalary=${item.roundOfSalary || 'N/A'}`);
          });
        }
        console.log(`🎯 =============================`);
        
        // คำนวณ totalDeductSalary จาก deductSalaryList
        const totalDeductSalary = calculatedValues.deductSalaryList.reduce((total, item) => {
          return total + (parseFloat(item.amount) || 0);
        }, 0);
        
        // ตรวจสอบว่าเป็นหน่วยงาน 7 วัน และใช้ค่า customizeDayoff จาก Employee collection
        let finalCustomizeDayoff = calculatedValues.customizeDayoff || 0;
        try {
          const employee = await Employee.findOne({ employeeId: doc.employeeId });
          const wpId = employee?.workplace || '';
          
          if (wpId) {
            const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId}`);
            const workOfWeek = workplaceResponse.data.workOfWeek || "5";
            
            if (workOfWeek === "7") {
              // สำหรับหน่วยงาน 7 วัน: ลองใช้ MongoDB โดยตรงเพราะ Mongoose schema อาจไม่รู้จัก field
              try {
                const db = Employee.db;
                const employeeCollection = db.collection('employees');
                const rawEmployee = await employeeCollection.findOne({ employeeId: doc.employeeId });
                
                finalCustomizeDayoff = rawEmployee?.customizeDayoff || 0;
                console.log(`🎯 หน่วยงาน 7 วัน - ใช้ customizeDayoff จาก MongoDB โดยตรง: ${finalCustomizeDayoff}`);
              } catch (directError) {
                console.warn(`⚠️ ไม่สามารถใช้ MongoDB โดยตรงได้, ใช้ค่าจาก Mongoose: ${employee?.customizeDayoff || 0}`);
                finalCustomizeDayoff = employee?.customizeDayoff || 0;
              }
            } else {
              console.log(`📅 หน่วยงานปกติ - ใช้ customizeDayoff จาก calculateCashValues: ${finalCustomizeDayoff}`);
            }
          }
        } catch (workplaceError) {
          console.warn(`⚠️ ไม่สามารถตรวจสอบ workplace ได้:`, workplaceError.message);
        }
        
        // ตรวจสอบว่าเป็นหน่วยงาน 7 วัน และใช้ค่า cashcustomizeDayoff จาก timerecordEmployee document
        let finalCashcustomizeDayoff = calculatedValues.cashSpecialDay || 0;
        try {
          const employee = await Employee.findOne({ employeeId: doc.employeeId });
          const wpId = employee?.workplace || '';
          
          if (wpId) {
            const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId}`);
            const workOfWeek = workplaceResponse.data.workOfWeek || "5";
            
            if (workOfWeek === "7") {
              // สำหรับหน่วยงาน 7 วัน: ใช้ cashcustomizeDayoff จาก document ที่คำนวณใน conclude.js
              if (doc.cashcustomizeDayoff !== undefined) {
                finalCashcustomizeDayoff = doc.cashcustomizeDayoff;
                console.log(`💎 หน่วยงาน 7 วัน - ใช้ cashcustomizeDayoff จาก document: ${finalCashcustomizeDayoff} บาท`);
              } else {
                console.log(`⚠️ หน่วยงาน 7 วัน - ไม่พบ cashcustomizeDayoff ใน document, ใช้ค่าจาก calculateCashValues: ${finalCashcustomizeDayoff}`);
              }
            } else {
              console.log(`📅 หน่วยงานปกติ - ใช้ cashSpecialDay จาก calculateCashValues: ${finalCashcustomizeDayoff}`);
            }
          }
        } catch (workplaceError) {
          console.warn(`⚠️ ไม่สามารถตรวจสอบ workplace สำหรับ cashcustomizeDayoff ได้:`, workplaceError.message);
        }
        
        const updateData = await {
          prefix: employeePrefix, // เพิ่ม prefix ใหม่
          employeeName: employeeName, // เพิ่ม employeeName
          dayWorkCount: String(calculatedValues.dayWorkCount),
          dayOffCount: String(calculatedValues.dayOffCount),
          specialDayOff: String(calculatedValues.specialDayOff),
          customizeDayoff: String(finalCustomizeDayoff), // ใช้ค่าที่ปรับแล้ว
          cashcustomizeDayoff: String(finalCashcustomizeDayoff || 0), // ใช้ค่าที่คำนวณจาก totalWorkerWage สำหรับหน่วยงาน 7 วัน
          publicHolidayCount: String(calculatedValues.publicHolidayCount || 0), // เพิ่มบรรทัดนี้
          publicHolidayCash: String(calculatedValues.publicHolidayCash || 0), // เพิ่มบรรทัดนี้
          sumTimeWork: String(calculatedValues.sumTimeWork),
          sumTimeOt: String(calculatedValues.sumTimeOt),
          sumCashWork: String(calculatedValues.sumCashWork),
          sumCashOt: String(calculatedValues.sumCashOt),
          sumcashDayOffCount: String(calculatedValues.sumcashDayOffCount),
          totalDeductSalary: String(totalDeductSalary), // เพิ่มฟิลด์ totalDeductSalary
          socialSecurity: String(calculatedValues.socialSecurity),
          tax: String(calculatedValues.tax),
          cashSpecialDay: String(finalCashcustomizeDayoff), // ใช้ค่าเดียวกันกับ cashcustomizeDayoff เพื่อ backward compatibility
          sumOt1p5: String(calculatedValues.sumOt1p5 || 0), // เพิ่มบรรทัดนี้
          sumOt3: String(calculatedValues.sumOt3 || 0), // เพิ่มบรรทัดนี้
          sumOtPublicHoliday: String(calculatedValues.sumOtPublicHoliday || 0), // 
          employeeCompensation: String(calculatedValues.employeeCompensation || 0), // เงินสงเคราะห์ลูกจ้าง
          sumCashWork1_20: String(calculatedValues.sumCashWork1_20 || 0), // เงินเดือนวันที่ 1-20
          sumCashWork21_30_31: String(calculatedValues.sumCashWork21_30_31 || 0), // เงินเดือนวันที่ 21-30/31


          // clearly ensure all SpSalary are numbers
          // addSalaryList: calculatedValues.addSalaryList.map(item => ({
          //   ...item,
          //   SpSalary: parseFloat(item.SpSalary) || 0,
          //   message : parseF item.message,
          // })),
          addSalaryList: calculatedValues.addSalaryList,
           deductSalaryList: calculatedValues.deductSalaryList,
          sumCashWorkMul: calculatedValues.sumCashWorkMul,
          // เพิ่ม stopDaysList สำหรับหน่วยงาน 7 วัน
          stopDaysList: doc.stopDaysList || [],
        };

        // 🎯 อัปเดต message และ SpSalary สำหรับ items ที่มี roundOfSalary: "daily" ให้เป็น dayWorkCount + dayOffCount
        if (updateData.addSalaryList && Array.isArray(updateData.addSalaryList)) {
          const totalDays = parseInt(calculatedValues.dayWorkCount) + parseInt(calculatedValues.dayOffCount);
          console.log(`🎯 อัปเดต message และ SpSalary สำหรับ ${doc.employeeId} (dayWorkCount: ${calculatedValues.dayWorkCount} + dayOffCount: ${calculatedValues.dayOffCount} = ${totalDays})`);
          updateData.addSalaryList.forEach((item, itemIndex) => {
            if (item.roundOfSalary === "daily") {
              const oldMessage = item.message;
              const oldSpSalary = item.SpSalary;
              
              // อัปเดต message เป็น dayWorkCount + dayOffCount
              item.message = totalDays;
              
              // คำนวณ SpSalary ใหม่: (เงินเดิม / วันเดิม) * วันใหม่
              if (oldMessage && oldMessage > 0) {
                const dailyRate = parseFloat(oldSpSalary) / parseFloat(oldMessage);
                item.SpSalary = dailyRate * totalDays;
                console.log(`🎯   Item[${itemIndex}] (${item.name}):`);
                console.log(`       message: ${oldMessage} → ${item.message}`);
                console.log(`       SpSalary: ${oldSpSalary} → ${parseFloat(item.SpSalary).toFixed(2)} (rate: ${dailyRate.toFixed(2)}/วัน)`);
              } else {
                console.log(`🎯   Item[${itemIndex}] (${item.name}): message ${oldMessage} → ${item.message} (ไม่สามารถคำนวณ SpSalary ได้)`);
              }
            }
          });
        }
        
        // 🎯 คำนวณ totalAddSalary หลังจากปรับค่า dailyRows แล้ว
        const totalAddSalary = updateData.addSalaryList.reduce((total, item) => {
          return total + (parseFloat(item.SpSalary) || 0);
        }, 0);
        
        console.log(`💰 totalAddSalary หลังปรับค่า: ${totalAddSalary}`);
        
        // เพิ่ม totalAddSalary เข้าไปใน updateData
        updateData.totalAddSalary = String(totalAddSalary);

        // 🔄 Recompute tax using adjusted totals when costtype is ภ.ง.ด.3
        try {
          const empForTax = await Employee.findOne({ employeeId: doc.employeeId });
          const empCosttype = empForTax?.costtype || '';
          if (empCosttype === "ภ.ง.ด.3") {
            const totalIncomeForTaxNew = (parseFloat(updateData.sumCashWork) || 0)
              + (parseFloat(updateData.sumCashOt) || 0)
              + (parseFloat(updateData.totalAddSalary) || 0)
              + (parseFloat(updateData.cashSpecialDay) || 0)
              + (parseFloat(updateData.cashcustomizeDayoff) || 0)
              + (parseFloat(updateData.publicHolidayCash) || 0);
            const taxNew = totalIncomeForTaxNew * 0.03;
            console.log(`🎯 Recomputed tax after daily adjustments: base=${totalIncomeForTaxNew} → tax=${taxNew}`);
            updateData.tax = String(taxNew);
          }
        } catch (recalcErr) {
          console.warn(`⚠️ Unable to recompute tax after adjustments for ${doc.employeeId}:`, recalcErr.message);
        }
        
        // แสดงข้อมูลสำคัญที่จะบันทึก
        console.log(`\n📝 ข้อมูลที่จะบันทึกสำหรับพนักงาน ${doc.employeeId}:`);
        console.log(`🏷️ prefix: ${updateData.prefix}`);
        console.log(`🔍 dayWorkCount: ${updateData.dayWorkCount}`);
        console.log(`🔍 customizeDayoff: ${updateData.customizeDayoff}`);
        console.log(`💰 cashcustomizeDayoff: ${updateData.cashcustomizeDayoff}`);
        console.log(`⏱️ sumOt1p5: ${updateData.sumOt1p5}`); 
        console.log(`🟢 stopDaysList: ${updateData.stopDaysList ? `${updateData.stopDaysList.length} วัน` : 'ไม่มี'}`);
        if (updateData.stopDaysList && updateData.stopDaysList.length > 0) {
          console.log(`  วันหยุดพิเศษ: ${JSON.stringify(updateData.stopDaysList)}`);
        }
        
        // ตรวจสอบว่ามีรายการ addSalaryList หรือไม่
        if (calculatedValues.addSalaryList && calculatedValues.addSalaryList.length > 0) {
          console.log(`📋 จำนวนรายการ addSalaryList: ${calculatedValues.addSalaryList.length}`);
          console.log(`📋 ตัวอย่างรายการแรก: ${JSON.stringify(calculatedValues.addSalaryList[0].SpSalary, null, 2)}`);
        } else {
          console.log(`⚠️ ไม่มีรายการ addSalaryList`);
        }
        // ✅ Log BEFORE update
        // console.log(`🔍 BEFORE update (doc ${doc._id}):`, JSON.stringify(doc.addSalaryList, null, 2));
    
        // Update and get updated document
        const updatedDoc = await timerecordEmployee.findByIdAndUpdate(
          doc._id,
          { $set: updateData },
          { new: true, upsert: true }
        );
    
        // ✅ Log AFTER update
        // console.log(`🚀 AFTER update (doc ${doc._id}):`, JSON.stringify(updatedDoc.addSalaryList, null, 2));
    
        await updatedRecords.push(updatedDoc);
    
        // console.log(`✅ Document ${doc._id} updated successfully`);
    
// console.log('updatedDoc ' + JSON.stringify(updatedDoc))
      } catch (error) {
        console.error("❌ Error updating document:", error);
      }
    }

    res.status(200).json({ result: updatedRecords });

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const convertTimeToDecimal = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return 0;
  }
  
  if (timeString.includes('.')) {
    const [hours, minutes] = timeString.split('.').map(Number);
    const decimalMinutes = (minutes || 0) / 60;
    return (hours || 0) + decimalMinutes;
  }
  
  return parseFloat(timeString) || 0;
};



const calculateCashValues = async (employeeId, employee_record, month, year, welfareAddSalaryList = null) => {
  // ดึงข้อมูลการตั้งค่าพื้นฐานของระบบ
  const settingResult = await axios.get(sURL + '/basicsetting/');
  
  // ดึงข้อมูลพนักงานเพื่อหา workplace และ jobtype
  let employeeCompensationRate = 0;
  let employeeCompensationRate1_20 = 0;
  let employeeCompensationRate21_30_31 = 0;
  let typeOfemployee = '';
  try {
    const employeeResponse = await axios.get(sURL + '/employee/' + employeeId);
    
    // ตรวจสอบว่ามีข้อมูลพนักงานหรือไม่
    if (!employeeResponse || !employeeResponse.data) {
      console.error(`⚠️ [employeeCompensation] ไม่พบข้อมูลพนักงาน ${employeeId}`);
      typeOfemployee = '';
    } else {
      // ดึงข้อมูล jobtype สำหรับ typeOfemployee
      typeOfemployee = employeeResponse.data.jobtype || '';
      console.log(`🔍 [typeOfemployee] ดึงข้อมูล jobtype สำหรับพนักงาน ${employeeId}: ${typeOfemployee}`);
    }
    
    const workplaceId = employeeResponse?.data?.workplace;
    
    if (workplaceId) {
      // ดึงข้อมูล workplace เพื่อหา employeeCompensation rates
      const workplaceResponse = await axios.get(sURL + '/workplace/' + workplaceId);
      
      // รองรับโครงสร้างใหม่ (dual rates)
      if (workplaceResponse.data.employeeCompensation?.Rate1_20 !== undefined || 
          workplaceResponse.data.employeeCompensation?.Rate21_30_31 !== undefined) {
        employeeCompensationRate1_20 = workplaceResponse.data.employeeCompensation?.Rate1_20 || 0;
        employeeCompensationRate21_30_31 = workplaceResponse.data.employeeCompensation?.Rate21_30_31 || 0;
        console.log(`🔍 [employeeCompensation] ใช้โครงสร้างใหม่ - Rate1_20: ${employeeCompensationRate1_20}, Rate21_30_31: ${employeeCompensationRate21_30_31}`);
      } else {
        // รองรับโครงสร้างเก่า (backward compatibility)
        employeeCompensationRate = workplaceResponse.data.employeeCompensation?.newRate || 0;
        console.log(`🔍 [employeeCompensation] ใช้โครงสร้างเก่า - employeeCompensationRate: ${employeeCompensationRate}`);
      }
      console.log(`🔍 [employeeCompensation] ดึงข้อมูล workplace ${workplaceId} สำหรับพนักงาน ${employeeId}`);
    }
  } catch (error) {
    console.error(`⚠️ [employeeCompensation] ไม่สามารถดึงข้อมูลพนักงาน ${employeeId}:`, error.message);
    // ตั้งค่าเริ่มต้นกรณี error
    typeOfemployee = '';
  }
  
  let socialSecurity = 0;
  let addSalarySocialSecurity = 0;
  let socialSecurityP = 0;
  let tax = 0;
  let specialDay = 0;
  let cashSpecialDay = 0;
    let customizeDayoff = 0; // เพิ่มตัวแปรสำหรับเก็บจำนวนวันหยุดที่กำหนดเอง
  let cashcustomizeDayoff = 0; // เพิ่มตัวแปรสำหรับคำนวณเงินสำหรับวันหยุดที่กำหนดเอง
  let dayOffOnlyDates = []; // เก็บวันที่เป็นวันหยุดนักขัตฤกษ์เท่านั้น
  let transformedDayOffOnlyDates = []; // เก็บวันที่เป็นวันหยุดนักขัตฤกษ์ในรูปแบบวันที่เดียว
  let publicHolidayCount = 0; // สำหรับนับจำนวนวันหยุดนักขัตฤกษ์ที่พนักงานไม่มาทำงาน
  let sumOt1p5 = 0; // เพิ่มตัวแปรใหม่สำหรับเก็บผลรวมของ totalOtTime ในวันทำงานปกติ
  let sumOt3 = 0; // เพิ่มตัวแปรใหม่สำหรับเก็บผลรวมของ totalOtTime ในวันทำงานปกติ
  let sumOtPublicHoliday = 0; 
  let countAllowance = 0; // เพิ่มตัวแปรเก็บค่า countAllowance ไว้ใน scope หลักของฟังก์ชัน 
  let holidayOT = "3";



  let sumCashWorkMul = {
  "1": 0,
  "1.5": 0,
  "2": 0, 
  "3": 0
};
let timeCashWorkMul = {
  "1": 0,
  "1.5": 0,
  "2": 0, 
  "3": 0
};
  





  if (settingResult) {
    socialSecurityP = parseFloat(settingResult?.data?.[settingResult.data.length - 1]?.social?.[0]?.socialPercent || '5') / 100;
  }

  const employeeProfile = await getEmployeeProfile(employeeId);
  const salaryTmp = parseFloat(employeeProfile[0].salary || '0') || 0;
  const costtype = employeeProfile[0].costtype || '';


  try {
    const employee = await Employee.findOne({ employeeId: employeeId });
    const wpId = employee?.workplace || '';
    
    if (wpId) {
      const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId}`);
      holidayOT = workplaceResponse.data.holidayOT || "3";
      
      console.log(`\n🔍 === ตรวจสอบค่า holidayOT ===`);
      console.log(`🏢 Workplace ID: ${wpId}`);
      console.log(`📊 holidayOT: ${holidayOT}`);
      console.log(`🔍 จะปรับ cashOtMul ของ dayType="stop" เป็น: ${holidayOT === "1.5" ? "1.5" : "3"}`);
    }
  } catch (error) {
    console.error(`❌ Error checking holidayOT:`, error.message);
    console.log(`⚠️ ใช้ค่า default holidayOT = 3`);
  }

  // 🎯 ดึงข้อมูล workplace และ workRate
  let workRate = 0;
  try {
    const employee = await Employee.findOne({ employeeId: employeeId });
    const wpId = employee?.workplace || '';
    
    if (wpId) {
      const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId}`);
      workRate = parseFloat(workplaceResponse.data.workRate || 0);
      console.log(`🏢 ดึงข้อมูล workplace ${wpId}: workRate = ${workRate}`);
    } else {
      console.log(`⚠️ ไม่พบ workplace สำหรับพนักงาน ${employeeId}`);
    }
  } catch (workplaceError) {
    console.warn(`⚠️ ไม่สามารถดึงข้อมูล workplace ได้:`, workplaceError.message);
  }
  

  let addSalary = employeeProfile?.[0]?.addSalary || [];
  
  // 🎯 ถ้ามี welfare data ส่งมา ให้ใช้แทน addSalary เดิม
  if (welfareAddSalaryList && Array.isArray(welfareAddSalaryList) && welfareAddSalaryList.length > 0) {
    addSalary = welfareAddSalaryList;
    console.log(`🎯 [calculateCashValues] ใช้ welfare addSalaryList: ${addSalary.length} items`);
    
    // แสดงรายละเอียด welfare items ที่จะใช้ในการคำนวณ
    addSalary.forEach((item, idx) => {
      console.log(`🎯   [${idx}] ${item.name}: ${item.SpSalary} (${item.roundOfSalary})`);
    });
  } else {
    console.log(`🎯 [calculateCashValues] ใช้ addSalary เดิม: ${addSalary.length} items`);
  }
  
  let deductSalary = employeeProfile?.[0]?.deductSalary || [];
  let salary = 0;
  let salaryMonth = 0;
  let dailyWage = 0; // ค่าแรงต่อวัน สำหรับคำนวณ cashcustomizeDayoff

  let dayWorkCount = 0;
  let dayOffCount = 0;
  let specialDayOff = 0;

  let sumTimeWork = 0;
  let sumTimeOt = 0;
  let sumCashWork = 0;
  let sumCashOt = 0;
  let sumcashDayOffCount = 0;
  
  // เพิ่มตัวแปรสำหรับแบ่งเงินเดือนตามช่วงวันที่
  let sumCashWork1_20 = 0;      // เงินเดือนวันที่ 1-20
  let sumCashWork21_30_31 = 0;  // เงินเดือนวันที่ 21-30/31

  let weekendData = {}; // เพิ่มตัวแปรเก็บข้อมูลวันหยุด
  let publicHolidayCash = 0;
  

  // ตัวแปรเก็บข้อมูลวันหยุดที่กำหนดเอง
  let weekendAndDayOffDates = [];
  
  // Initialize sumAddSalaryDaily as an object and addSalaryDailyList as an array at the top:
  let sumAddSalaryDaily = {};
  let addSalaryDailyList = [];
  let monthlySalaries = [];
  let addSalaryList = [];
  let selectedSpecialDays = [];
    let deductSalaryList = [];

  if (parseFloat(salaryTmp || '0') > 1660) {
    salaryMonth = parseFloat(salaryTmp || '0');
    salary = await ((parseFloat(salaryTmp || '0') / 30) / 8).toFixed(3);
    dailyWage = salaryMonth / 30; // กรณีเงินเดือน
  } else {
    salary = await (parseFloat(salaryTmp || '0') / 8).toFixed(3);
    dailyWage = parseFloat(salaryTmp || '0'); // กรณีรายวัน
  }

  if (employeeProfile[0].workplace) {
    // Construct the search query based on the provided parameters
    const query = {};
    query.workplaceId = await employeeProfile[0].workplace;
    if (employeeProfile[0].department && employeeProfile[0].department !== '') {
      query.wGroup = await employeeProfile[0].department || '';
    }

    // Query the workplace collection for matching documents
    const workplaces = await Workplace.find(query);
     try {
      const workplaceResponse = await axios.get(`${sURL}/workplace/${employeeProfile[0].workplace}`);
      const workOfWeek = workplaceResponse?.data?.workOfWeek || "5";
      
      if (workOfWeek === "7") {
        console.log(`\n🔍 === ตรวจสอบวันหยุดสำหรับหน่วยงานพิเศษ 7 วัน (${employeeId}) ===`);
        
        // ดึงข้อมูล customWorkplace และ workTimeDay
        const customWorkplace = employeeProfile[0].customWorkplace;
        const workTimeDay = customWorkplace?.workTimeDay || [];
        
        console.log(`📋 จำนวนกฎการทำงาน: ${workTimeDay.length} รายการ`);
        
        // หาวันหยุดจาก workTimeDay
        const monthInt = parseInt(month);
        const yearInt = parseInt(year);
        const stopDaysList = [];
        
        // ตรวจสอบวันที่ 21-31 ของเดือนก่อนหน้า
        let prevMonth = monthInt - 1;
        let prevYear = yearInt;
        if (prevMonth === 0) {
          prevMonth = 12;
          prevYear = yearInt - 1;
        }
        
        const lastDayOfPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
        
        // เก็บวันหยุดทั้งหมดในรอบเงินเดือน
        // วันที่ 21-31 ของเดือนก่อนหน้า
        for (let day = 21; day <= lastDayOfPrevMonth; day++) {
          const date = new Date(prevYear, prevMonth - 1, day);
          const dayOfWeek = date.getDay();
          
          // ตรวจสอบว่าเป็นวันหยุดหรือไม่
          for (const schedule of workTimeDay) {
            if (schedule.workOrStop === 'stop') {
              const startDayNum = getDayNumberFromName(schedule.startDay);
              const endDayNum = getDayNumberFromName(schedule.endDay);
              
              let isStopDay = false;
              
              // กรณีวันเดียว
              if (startDayNum === endDayNum && dayOfWeek === startDayNum) {
                isStopDay = true;
              }
              // กรณีช่วงวันปกติ
              else if (startDayNum <= endDayNum && dayOfWeek >= startDayNum && dayOfWeek <= endDayNum) {
                isStopDay = true;
              }
              // กรณีช่วงวันข้ามสัปดาห์
              else if (startDayNum > endDayNum && (dayOfWeek >= startDayNum || dayOfWeek <= endDayNum)) {
                isStopDay = true;
              }
              
              if (isStopDay) {
                stopDaysList.push({
                  date: day,
                  month: prevMonth,
                  year: prevYear
                });
                break;
              }
            }
          }
        }
        
        // วันที่ 1-20 ของเดือนปัจจุบัน
        for (let day = 1; day <= 20; day++) {
          const date = new Date(yearInt, monthInt - 1, day);
          const dayOfWeek = date.getDay();
          
          // ตรวจสอบว่าเป็นวันหยุดหรือไม่
          for (const schedule of workTimeDay) {
            if (schedule.workOrStop === 'stop') {
              const startDayNum = getDayNumberFromName(schedule.startDay);
              const endDayNum = getDayNumberFromName(schedule.endDay);
              
              let isStopDay = false;
              
              // กรณีวันเดียว
              if (startDayNum === endDayNum && dayOfWeek === startDayNum) {
                isStopDay = true;
              }
              // กรณีช่วงวันปกติ
              else if (startDayNum <= endDayNum && dayOfWeek >= startDayNum && dayOfWeek <= endDayNum) {
                isStopDay = true;
              }
              // กรณีช่วงวันข้ามสัปดาห์
              else if (startDayNum > endDayNum && (dayOfWeek >= startDayNum || dayOfWeek <= endDayNum)) {
                isStopDay = true;
              }
              
              if (isStopDay) {
                stopDaysList.push({
                  date: day,
                  month: monthInt,
                  year: yearInt
                });
                break;
              }
            }
          }
        }
        
        console.log(`📅 จำนวนวันหยุดที่กำหนดทั้งหมด: ${stopDaysList.length} วัน`);
        
        // ตรวจสอบการมาทำงานในวันหยุด
        let workedOnStopDays = 0;
        
        stopDaysList.forEach(stopDay => {
          // หาข้อมูลการทำงานของวันนั้น
          const recordForDay = employee_record.find(record => {
            const recordDate = parseInt(record.date);
            
            // ตรวจสอบว่าตรงกับวันหยุดหรือไม่
            if (stopDay.month === prevMonth && stopDay.date >= 21) {
              // วันที่ 21-31 ของเดือนก่อนหน้า
              return recordDate === stopDay.date;
            } else if (stopDay.month === monthInt && stopDay.date <= 20) {
              // วันที่ 1-20 ของเดือนปัจจุบัน
              return recordDate === stopDay.date;
            }
            return false;
          });
          
          if (recordForDay) {
            // ตรวจสอบว่ามีการทำงานหรือไม่
            const hasWorked = recordForDay.totalTime && 
                             recordForDay.totalTime.trim() !== '' && 
                             parseFloat(recordForDay.totalTime) > 0;
            
            if (hasWorked) {
              workedOnStopDays++;
              console.log(`✅ วันที่ ${stopDay.date}/${stopDay.month}/${stopDay.year} - มาทำงาน (${recordForDay.totalTime} ชม.)`);
            } else {
              console.log(`❌ วันที่ ${stopDay.date}/${stopDay.month}/${stopDay.year} - ไม่มาทำงาน`);
            }
          } else {
            console.log(`⚠️ วันที่ ${stopDay.date}/${stopDay.month}/${stopDay.year} - ไม่มีข้อมูล`);
          }
        });
        
        // กำหนดค่า customizeDayoff
        customizeDayoff = workedOnStopDays;
        
        console.log(`\n📊 === สรุปการมาทำงานในวันหยุด ===`);
        console.log(`📅 จำนวนวันหยุดทั้งหมด: ${stopDaysList.length} วัน`);
        console.log(`✅ มาทำงานในวันหยุด: ${workedOnStopDays} วัน`);
        console.log(`🔢 กำหนดค่า customizeDayoff = ${customizeDayoff}`);
        
        // สำหรับหน่วยงาน 7 วัน: ปรับ dayWorkCount โดยหัก workedOnStopDays
        if (workOfWeek === "7") {
          const originalDayWorkCount = dayWorkCount;
          dayWorkCount = dayWorkCount - workedOnStopDays;
          console.log(`\n🔄 === ปรับ dayWorkCount สำหรับหน่วยงาน 7 วัน ===`);
          console.log(`📊 dayWorkCount เดิม: ${originalDayWorkCount} วัน`);
          console.log(`📊 workedOnStopDays: ${workedOnStopDays} วัน`);
          console.log(`📊 dayWorkCount ใหม่: ${dayWorkCount} วัน`);
          console.log(`📝 สูตร: dayWorkCount - workedOnStopDays = ${originalDayWorkCount} - ${workedOnStopDays} = ${dayWorkCount}`);
        }
        
        // คำนวณค่าแรงสำหรับวันหยุดที่มาทำงาน (ถ้าต้องการ)
        // const dailyWage = salaryTmp > 1660 ? (salaryTmp / 30) : salaryTmp;
        // cashcustomizeDayoff = customizeDayoff * dailyWage;
      }
    } catch (error) {
      console.error(`❌ Error checking workplace 7 days:`, error.message);
    }

    if (workplaces.length > 0) {
      if (workplaces?.[0]?.daysOff.length > 1) {
        // Convert to Thailand time and get parts
        const options = { timeZone: "Asia/Bangkok" };

        workplaces[0].daysOff.forEach((tmpSpeDate) => {
          let date = new Date(tmpSpeDate);
          const yearTmp = parseInt(date.toLocaleString("en-CA", { year: "numeric" }), 10);
          const monthTmp = parseInt(date.toLocaleString("en-CA", { month: "2-digit" }), 10);
          const dayTmp = parseInt(date.toLocaleString("en-CA", { day: "2-digit" }), 10);

          const yearInt = parseInt(year, 10);
          const monthInt = parseInt(month, 10);

          // Determine previous month and year
          let prevMonth = monthInt - 1;
          let prevYear = yearInt;
          if (monthInt === 1) {
            prevMonth = 12;
            prevYear = yearInt - 1;
          }

          const isCurrentMonth = monthTmp === monthInt && yearTmp === yearInt;
          const isPreviousMonth = monthTmp === prevMonth && yearTmp === prevYear;

          // Check day ranges clearly as per your condition:
          if (
            (isPreviousMonth && dayTmp > 20 && dayTmp <= 31) ||
            (isCurrentMonth && dayTmp >= 1 && dayTmp <= 20)
          ) {
            selectedSpecialDays.push(dayTmp);
          }
        });
      }
    } //end if
  } //end if

  //set count specialday
  specialDay = await selectedSpecialDays.length;

// เพิ่มการเรียก API เพื่อดึงข้อมูลวันหยุดที่กำหนดเอง
try {
  // ดึงข้อมูลเดือนและปีจากพารามิเตอร์
  const currentDate = new Date();
  const apiMonth = month || String(currentDate.getMonth() + 1).padStart(2, '0');
  const apiYear = year || String(currentDate.getFullYear());
  const wpId = employeeProfile[0].workplace || '';

  // เรียก API
  const apiUrl = `http://10.10.110.7:3000/conclude/getWeekendDates?yyyy=${apiYear}&mm=${apiMonth}&workplaceId=${wpId}`;
  console.log(`🔍 เรียก API วันหยุด: ${apiUrl}`);

  const weekendResponse = await axios.get(apiUrl);
  weekendData = weekendResponse.data; // เก็บข้อมูลวันหยุดในตัวแปร

  // แสดงข้อมูลวันหยุดทั้งหมดที่ได้จาก API
  console.log(`📋 ข้อมูลวันหยุดทั้งหมด:`, JSON.stringify(weekendData, null, 2));
  
  // กำหนดค่า dayOffOnlyDates จาก API
  dayOffOnlyDates = weekendData.dayOffOnly || [];
  
  // ไม่กำหนดค่า publicHolidayCount ที่นี่ เพราะจะคำนวณหลังจากตรวจสอบการมาทำงานแล้ว
  // publicHolidayCount = dayOffOnlyDates.length;
  
  transformedDayOffOnlyDates = dayOffOnlyDates.map(date => {
    const parts = date.split('-');
    return parts.length === 3 ? parts[2] : date;
  });
  
  console.log(`📅 วันหยุดนักขัตฤกษ์ทั้งหมด: ${dayOffOnlyDates.length} วัน`);
  console.log(`📅 รายการวันหยุดนักขัตฤกษ์: ${JSON.stringify(dayOffOnlyDates)}`);

  // นับจำนวนวันหยุดที่กำหนดเอง
  if (weekendData.weekendAndDayOff && Array.isArray(weekendData.weekendAndDayOff)) {
    customizeDayoff = weekendData.weekendAndDayOff.length;
    weekendAndDayOffDates = weekendData.weekendAndDayOff;
    
    console.log(`📅 พบวันหยุดที่กำหนดเอง ${customizeDayoff} วัน: ${JSON.stringify(weekendData.weekendAndDayOff)}`);
    console.log(`ℹ️ จำนวนวันหยุดที่กำหนดเองเริ่มต้น: ${customizeDayoff} วัน`);

    // เก็บสถานะการมาทำงานในวันหยุดที่กำหนดเอง
    let customDayoffStatus = [];
    
    // แสดงรายละเอียดของแต่ละวันที่กำหนดให้เป็นวันหยุด
    weekendData.weekendAndDayOff.forEach((dateStr, index) => {
      console.log(`🗓️ วันหยุดที่กำหนดเอง #${index + 1}: ${dateStr} (ประเภท: ${typeof dateStr}, ความยาว: ${dateStr.length})`);

      // ตรวจสอบว่าวันหยุดอยู่ในรูปแบบใด
      if (dateStr.includes("-")) {
        // รูปแบบ YYYY-MM-DD
        const parts = dateStr.split("-");
        console.log(`  📆 รูปแบบวันที่: YYYY-MM-DD (ปี=${parts[0]}, เดือน=${parts[1]}, วัน=${parts[2]})`);
      } else {
        // รูปแบบอื่นๆ (อาจเป็นเลขวันที่เท่านั้น)
        console.log(`  📆 รูปแบบวันที่: อื่นๆ (${dateStr})`);
      }
    });

    // ตรวจสอบว่ามีวันที่ 18 อยู่ในรายการวันหยุดหรือไม่
    const has18 = weekendData.weekendAndDayOff.some(d => d.endsWith("-18") || d === "18");
    console.log(`🔍 วันที่ 18 อยู่ในรายการวันหยุดที่กำหนดเอง: ${has18 ? 'ใช่' : 'ไม่ใช่'}`);
  }
} catch (error) {
  console.error('❌ เกิดข้อผิดพลาดในการเรียก API วันหยุด:', error.message);
  // กำหนดค่าเริ่มต้นเมื่อเกิดข้อผิดพลาด
  dayOffOnlyDates = [];
  transformedDayOffOnlyDates = [];
  publicHolidayCount = 0;
}



  // ตัวแปรเพื่อนับจำนวนวันที่พนักงานไม่มาทำงานในวันหยุดที่กำหนดเอง
  let daysNotComeToWork = 0;

  const countedWorkDates = new Set();
  await Promise.all(
    employee_record.map(async (record) => {
      //check workplace 10105
      const workplaceId = employeeProfile[0].workplace === "10105" ? "10105" : record.workplaceId;

      if (!sumCashWorkMul[record?.cashWorkMul]) {
        sumCashWorkMul[record?.cashWorkMul] = 0;
      }
      if (!timeCashWorkMul[record?.cashWorkMul]) {
        timeCashWorkMul[record?.cashWorkMul] = 0;
      }

      //check dayType
      if (record?.dayType !== '') {
        if (selectedSpecialDays.includes(Number(record?.date))) {
          specialDay = specialDay - 1;
          console.log(JSON.stringify(selectedSpecialDays, null, 2))
          console.log("2วัน", record?.date)
        }

        // ตรวจสอบว่าเป็นวันหยุดที่กำหนดเองหรือไม่
        try {
          // ใช้ค่า year และ month จากระดับรากของออบเจกต์ (ไม่ใช่จาก record)
          const recordYear = year; // ใช้ year ที่ส่งเข้ามาในฟังก์ชัน calculateCashValues
          const recordMonth = month; // ใช้ month ที่ส่งเข้ามาในฟังก์ชัน calculateCashValues
          const recordDate = record.date;

          console.log(`🔄 ข้อมูลวันที่: year=${recordYear}, month=${recordMonth}, date=${recordDate}`);

          // สร้างวันที่ในรูปแบบ YYYY-MM-DD
          const dateStr = `${recordYear}-${String(recordMonth).padStart(2, '0')}-${String(recordDate).padStart(2, '0')}`;
          console.log(`🔄 วันที่ที่สร้างขึ้น: ${dateStr}`);

          // ตรวจสอบว่ามีวันนี้อยู่ใน customizeDayoff หรือไม่
          let isCustomDayoff = false;

          // แก้ไขส่วนที่ตรวจสอบวันหยุด
          if (weekendData?.weekendAndDayOff) {
            // แสดงรายการวันหยุดที่กำหนดเอง
            console.log(`📋 รายการวันหยุดที่กำหนดเอง: ${JSON.stringify(weekendData.weekendAndDayOff)}`);

            // ตรวจสอบว่าวันนี้เป็นวันหยุดที่กำหนดเองหรือไม่
            isCustomDayoff = weekendData.weekendAndDayOff.includes(dateStr);

            // กรณีพิเศษสำหรับวันที่ 18 ของเดือน
            if (recordDate === "18") {
              console.log(`🔍 พบวันที่ 18: dayType=${record.dayType}, totalTime=${record.totalTime}, isCustomDayoff=${isCustomDayoff}`);

              // ตรวจสอบว่ามีวันที่ 18 อยู่ในวันหยุดหรือไม่ ด้วยการค้นหาจากส่วนหลังของวันที่
              const has18 = weekendData.weekendAndDayOff.some(d => d.endsWith(`-18`));
              if (has18) {
                console.log(`✅ พบวันที่ 18 ในรายการวันหยุดที่กำหนดเอง`);
                isCustomDayoff = true;
              }
            }
          }

          console.log(`📆 วันที่ ${recordDate} (${dateStr}) เป็นวันหยุดที่กำหนดเอง: ${isCustomDayoff ? 'ใช่' : 'ไม่ใช่'}`);

          if (isCustomDayoff) {
            // ตรวจสอบว่าพนักงานมาทำงานโดยดูจาก totalTime
            const hasTotalTime = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;

            console.log(`🕒 วันที่ ${recordDate} เป็นวันหยุดที่กำหนดเอง - ค่า totalTime: "${record.totalTime || 'ไม่มีค่า'}"`);

            if (hasTotalTime) {
              // พนักงานมาทำงานในวันหยุดที่กำหนดเอง
              console.log(`🔍 พนักงานมาทำงานในวันหยุดที่กำหนดเอง: วันที่ ${recordDate} (totalTime: ${record.totalTime})`);
            } else {
              // พนักงานไม่มาทำงานในวันหยุดที่กำหนดเอง
              console.log(`ℹ️ วันที่ ${recordDate} เป็นวันหยุดที่กำหนดเอง และพนักงานไม่ได้มาทำงาน (ไม่มีค่า totalTime)`);
              daysNotComeToWork++;
            }
          }

          if (dayOffOnlyDates.includes(dateStr)) {
            // ตรวจสอบว่าพนักงานมาทำงานหรือไม่
            const hasWorked = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
            
            if (!hasWorked) {
              // พนักงานไม่มาทำงานในวันหยุดนักขัตฤกษ์ ให้นับเป็น publicHolidayCount
              publicHolidayCount++;
              console.log(`📅 วันที่ ${recordDate} เป็นวันหยุดนักขัตฤกษ์และพนักงานไม่มาทำงาน`);
            } else {
              console.log(`⚠️ วันที่ ${recordDate} เป็นวันหยุดนักขัตฤกษ์แต่พนักงานมาทำงาน`);
            }
          }


        } catch (error) {
          console.error(`❌ เกิดข้อผิดพลาดในการตรวจสอบวันหยุดที่กำหนดเอง:`, error.message);
        }
        if (record?.dayType === 'stop') {
          console.log(record?.dayType);
          dayOffCount += 1;
          
          // ตรวจสอบ specialt_shift - ถ้าเป็น specialt_shift ให้ cashWork, cashOt, cashOtMul = 0
          if (record.shift === "specialt_shift") {
            console.log(`🚫 พบ specialt_shift ในวันหยุด (วันที่ ${record.date}) - บังคับ cashWork, cashOt, cashOtMul เป็น 0`);
            console.log(`   - cashWork เดิม: ${record.cashWork}, cashOt เดิม: ${record.cashOt}, cashOtMul เดิม: ${record.cashOtMul}`);
            record.cashWork = "0";
            record.cashOt = "0";
            record.cashOtMul = "0";
            record.totalOtTime = "0";
            record.cashOtMul = "0";
            record.beforeTotalOtTime = "0";
            record.totalTime = "0";
            console.log(`   - totalTime ปรับเป็น: ${record.totalTime}, cashOt ปรับเป็น: ${record.totalTime}, cashOtMul ปรับเป็น: ${record.cashOtMul}`);
           
 

          }
          
          // เก็บค่าเดิมก่อนที่จะเปลี่ยนแปลง
          const originalCashOtMul = record.cashOtMul;
          const originalCashWorkMul = record.cashWorkMul;
          
          if (holidayOT === "1.5") {
            if (record.cashOtMul === "3") {
              console.log(`🔄 ปรับ cashOtMul จาก "3" เป็น "1.5" สำหรับวันที่ ${record.date} (dayType=stop)`);
              console.log(`   - cashOt ที่จะถูกโอนไปยัง multiplier 1.5: ${record.cashOt} บาท`);
              record.cashOtMul = "1.5";
            }
            if (record.cashWorkMul === "3") {
              console.log(`🔄 ปรับ cashWorkMul จาก "3" เป็น "1.5" สำหรับวันที่ ${record.date} (dayType=stop)`);
              console.log(`   - cashWork ที่จะถูกโอนไปยัง multiplier 1.5: ${record.cashWork} บาท`);
              record.cashWorkMul = "1.5";
            }
          }
          
          sumcashDayOffCount = parseFloat(sumcashDayOffCount || 0) + parseFloat(record?.cashBeforeOt || '0') + parseFloat(record?.cashWork || '0') + parseFloat(record?.cashOt || '0')

          sumTimeOt += convertTimeToDecimal(record.beforeTotalOtTime) + convertTimeToDecimal(record.totalTime) + convertTimeToDecimal(record.totalOtTime);
          // sumCashOt = parseFloat(sumCashOt || 0) + parseFloat(record?.cashBeforeOt || '0') + parseFloat(record?.cashWork || '0') + parseFloat(record?.cashOt || '0') // ลบการคำนวณแบบเก่า
          
          // คำนวณ OT time โดยใช้ค่าที่ปรับแล้ว
          if (holidayOT === "1.5") {
            sumOt1p5 += convertTimeToDecimal(record.totalOtTime);
            console.log(`➕ เพิ่ม OT ใน sumOt1p5: ${convertTimeToDecimal(record.totalOtTime)} ชม. (วันที่ ${record.date})`);
          } else {
            sumOt3 += convertTimeToDecimal(record.totalOtTime);
            console.log(`➕ เพิ่ม OT ใน sumOt3: ${convertTimeToDecimal(record.totalOtTime)} ชม. (วันที่ ${record.date})`);
          }
          
          sumOtPublicHoliday += convertTimeToDecimal(record.totalTime); // เพิ่มผลรวมของ totalOtTime ในวันหยุดนักขัตฤกษ์
          
          // คำนวณ sumCashWorkMul และ timeCashWorkMul โดยใช้ค่าที่ปรับแล้ว
          if (record?.cashWorkMul && sumCashWorkMul[record.cashWorkMul] !== undefined) {
            const cashWorkAmount = parseFloat(record?.cashWork || '0');
            sumCashWorkMul[record.cashWorkMul] += cashWorkAmount;
            console.log(`   - เพิ่ม cashWork ${cashWorkAmount} ไปยัง sumCashWorkMul[${record.cashWorkMul}] (รวม: ${sumCashWorkMul[record.cashWorkMul]})`);
          }
          if (record?.cashOtMul && sumCashWorkMul[record.cashOtMul] !== undefined) {
            const cashOtAmount = parseFloat(record?.cashBeforeOt || '0') + parseFloat(record?.cashOt || '0');
            sumCashWorkMul[record.cashOtMul] += cashOtAmount;
            console.log(`   - เพิ่ม cashOt ${cashOtAmount} ไปยัง sumCashWorkMul[${record.cashOtMul}] (รวม: ${sumCashWorkMul[record.cashOtMul]})`);
          }

          if (record?.cashWorkMul && timeCashWorkMul[record.cashWorkMul] !== undefined) {
            timeCashWorkMul[record.cashWorkMul] += convertTimeToDecimal(record.totalTime);
          }
          if (record?.cashOtMul && timeCashWorkMul[record.cashOtMul] !== undefined) {
            timeCashWorkMul[record.cashOtMul] += convertTimeToDecimal(record.beforeTotalOtTime) + convertTimeToDecimal(record.totalOtTime);
          }
          
          console.log(`📊 วันที่ ${record.date} (dayType=stop): cashWork=${record.cashWork}, cashWorkMul=${record.cashWorkMul}, cashOt=${record.cashOt}, cashOtMul=${record.cashOtMul}`);

        } else
          if (record?.dayType === 'specialDayOff') {
            specialDayOff += 1;
            sumTimeOt += convertTimeToDecimal(record.beforeTotalOtTime) + convertTimeToDecimal(record.totalTime) + convertTimeToDecimal(record.totalOtTime);
            // sumCashOt = parseFloat(sumCashOt || 0) + parseFloat(record?.cashBeforeOt || '0') + parseFloat(record?.cashWork || '0') + parseFloat(record?.cashOt || '0') // ลบการคำนวณแบบเก่า


            timeCashWorkMul[record?.cashOtMul] += convertTimeToDecimal(record.beforeTotalOtTime) + convertTimeToDecimal(record.totalOtTime);

          } else {

       // ในฟังก์ชัน calculateCashValues
// หาส่วนที่ประมวลผล record ที่มี dayType === "work"

if (record?.dayType === "work") {
  console.log(`\n--- 🔁 กำลังประมวลผลวันที่: ${record.date}, workplace: ${record.workplaceId}, ประเภท: ${record.dayType} ---`);
  
  // ตรวจสอบว่ามีเวลาทำงานปกติหรือไม่
  const hasRegularWork = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
  
  // ตรวจสอบว่ามี OT ก่อนเวลาหรือไม่
  const hasBeforeOT = record.beforeTotalOtTime && record.beforeTotalOtTime.trim() !== '' && parseFloat(convertTimeToDecimal(record.beforeTotalOtTime)) > 0;
  
  // ตรวจสอบว่ามี OT หลังเวลาหรือไม่
  const hasAfterOT = record.totalOtTime && record.totalOtTime.trim() !== '' && parseFloat(convertTimeToDecimal(record.totalOtTime)) > 0;
  
  // ถ้า record ไม่มีข้อมูล cashBeforeOt แต่มี beforeTotalOtTime ให้คำนวณเงิน
  if (hasBeforeOT && (!record.cashBeforeOt || record.cashBeforeOt === "")) {
    // คำนวณเงิน OT ก่อนเวลา (1.5 เท่า)
    const beforeOtHours = convertTimeToDecimal(record.beforeTotalOtTime);
    const otRate = 69.75; // อัตรา OT ต่อชั่วโมง
    record.cashBeforeOt = (beforeOtHours * otRate).toFixed(2);
    record.cashBeforeOtMul = "1.5";
    console.log(`🔧 คำนวณ OT ก่อนเวลาสำหรับวันที่ ${record.date}: ${beforeOtHours} ชม. x ${otRate} = ${record.cashBeforeOt} บาท`);
  }
  
  // นับวันทำงานเฉพาะ record ที่มีเวลาทำงานปกติ และยังไม่เคยนับวันนี้
  if (hasRegularWork && !countedWorkDates.has(record.date)) {
    dayWorkCount += 1;
    countedWorkDates.add(record.date);
    console.log(`✅ นับวันที่ ${record.date} เป็นวันทำงาน (dayWorkCount = ${dayWorkCount})`);
  } else if (countedWorkDates.has(record.date)) {
    console.log(`⚠️ วันที่ ${record.date} ถูกนับแล้ว ข้ามการนับวัน`);
  } else if (!hasRegularWork && (hasBeforeOT || hasAfterOT)) {
    console.log(`⚠️ วันที่ ${record.date} ไม่มีเวลาทำงานปกติ (มีแค่ OT) ไม่นับเป็นวันทำงาน`);
  }

  // คำนวณเวลาทำงานปกติ
  if (hasRegularWork) {
    sumTimeWork += convertTimeToDecimal(record.totalTime);
    
    // ตรวจสอบ specialt_shift - ถ้าเป็น specialt_shift ให้ cashWork, cashOt, cashOtMul = 0
    let cashWorkAmount = parseFloat(record?.cashWork || '0');
    if (record.shift === "specialt_shift") {
      console.log(`🚫 พบ specialt_shift ในวันที่ ${record.date} - บังคับ cashWork, cashOt, cashOtMul เป็น 0`);
      console.log(`   - cashWork เดิม: ${cashWorkAmount}, cashOt เดิม: ${record.cashOt}, cashOtMul เดิม: ${record.cashOtMul}`);
      cashWorkAmount = 0;
      record.cashWork = "0";
      record.cashOt = "0";
      record.cashOtMul = "0";
       record.totalOtTime = "0";
      record.cashOtMul = "0";
      record.totalTime = "0"; 
      console.log(`   - totalTime ถูกปรับเป็น: ${record.totalTime}`);

    }
    
    sumCashWork += cashWorkAmount;
    
    // 🔢 แบ่งเงินเดือนตามช่วงวันที่
    const dateNumber = parseInt(record.date);
    if (dateNumber >= 1 && dateNumber <= 20) {
      sumCashWork1_20 += cashWorkAmount;
      console.log(`   📅 วันที่ ${record.date}: เพิ่ม ${cashWorkAmount} บาท ไปยัง sumCashWork1_20 (รวม: ${sumCashWork1_20})`);
    } else if (dateNumber >= 21 && dateNumber <= 31) {
      sumCashWork21_30_31 += cashWorkAmount;
      console.log(`   📅 วันที่ ${record.date}: เพิ่ม ${cashWorkAmount} บาท ไปยัง sumCashWork21_30_31 (รวม: ${sumCashWork21_30_31})`);
    }
    
    // อัปเดต sumCashWorkMul สำหรับเวลาทำงานปกติ
    if (record?.cashWorkMul && sumCashWorkMul[record.cashWorkMul] !== undefined) {
      sumCashWorkMul[record.cashWorkMul] += cashWorkAmount;
    }
    if (record?.cashWorkMul && timeCashWorkMul[record.cashWorkMul] !== undefined) {
      timeCashWorkMul[record.cashWorkMul] += convertTimeToDecimal(record.totalTime);
    }
  }
  
  // คำนวณ OT ทั้งหมด (ก่อนและหลังเวลาทำงาน)
  let totalOtTime = 0;
  let totalOtCash = 0;
  
  // OT ก่อนเวลาทำงาน
  if (hasBeforeOT) {
    const beforeOtTime = convertTimeToDecimal(record.beforeTotalOtTime);
    const beforeOtCash = parseFloat(record?.cashBeforeOt || '0');
    
    totalOtTime += beforeOtTime;
    totalOtCash += beforeOtCash;
    
    // อัปเดต sumCashWorkMul สำหรับ OT ก่อนเวลา
    const otMul = record?.cashBeforeOtMul || record?.cashOtMul || "1.5";
    if (!sumCashWorkMul[otMul]) {
      sumCashWorkMul[otMul] = 0;
    }
    if (!timeCashWorkMul[otMul]) {
      timeCashWorkMul[otMul] = 0;
    }
    sumCashWorkMul[otMul] += beforeOtCash;
    timeCashWorkMul[otMul] += beforeOtTime;
    
    console.log(`   - OT ก่อนเวลาทำงาน: ${beforeOtTime} ชม. (${beforeOtCash} บาท) - Rate: ${otMul}`);
  }
  
  // OT หลังเวลาทำงาน
  if (hasAfterOT) {
    const afterOtTime = convertTimeToDecimal(record.totalOtTime || '0') + convertTimeToDecimal(record.beforeTotalOtTime || '0'); ;
    const afterOtCash = parseFloat(record?.cashOt || '0');
    
    totalOtTime += afterOtTime;
    totalOtCash += afterOtCash;
    sumOt1p5 += afterOtTime; // นับเฉพาะ OT หลังเวลาทำงาน
    
    // อัปเดต sumCashWorkMul สำหรับ OT หลังเวลา
    const otMul = record?.cashOtMul || "1.5";
    if (!sumCashWorkMul[otMul]) {
      sumCashWorkMul[otMul] = 0;
    }
    if (!timeCashWorkMul[otMul]) {
      timeCashWorkMul[otMul] = 0;
    }
    sumCashWorkMul[otMul] += afterOtCash;
    timeCashWorkMul[otMul] += afterOtTime;
    
    console.log(`   - OT หลังเวลาทำงาน: ${afterOtTime} ชม. (${afterOtCash} บาท) - Rate: ${otMul}`);
  }
  
  // อัปเดตผลรวม OT - คอมเมนต์เพราะจะคำนวณจาก sumCashWorkMul แทน
  if (totalOtTime > 0) {
    sumTimeOt += totalOtTime;
    // sumCashOt += totalOtCash; // ลบการคำนวณแบบเก่า
    console.log(`   - รวม OT ทั้งหมด: ${totalOtTime} ชม. (${totalOtCash} บาท)`);
  }

  // จัดการ addSalaryDaily (เหมือนเดิม)
  if (record.addSalaryDaily && record.addSalaryDaily.length > 0) {
    record.addSalaryDaily.forEach((salaryItem) => {
      const cleanSalaryItemId = String(salaryItem.id).trim();
      const amount = parseFloat(salaryItem.SpSalary || 0);

      const existingItem = addSalaryList.find(
        item => String(item.id).trim() === cleanSalaryItemId
      );

      if (existingItem) {
        existingItem.SpSalary = parseFloat(existingItem.SpSalary || 0) + amount;
        existingItem.message = parseFloat(existingItem.message || 0) + 1;

        const index = addSalaryList.findIndex(item => item.id === existingItem.id);
        if (index !== -1) {
          addSalaryList[index] = existingItem;
        }
      } else {
        salaryItem.message = 1; 
        addSalaryList.push(salaryItem);
      }
    });
  }
}
          }
      }
    })
  );

console.log(`\n📊 === คำนวณ sumCashOt จาก sumCashWorkMul ===`);
console.log(`🔍 sumCashWorkMul ทั้งหมด:`, sumCashWorkMul);

// เปลี่ยน logic ใหม่: sumCashOt = sumCashWorkMul["1.5"] + ["2"] + ["3"]
sumCashOt = (parseFloat(sumCashWorkMul["1.5"]) || 0) + 
            (parseFloat(sumCashWorkMul["2"]) || 0) + 
            (parseFloat(sumCashWorkMul["3"]) || 0);

console.log(`💰 sumCashWorkMul["1.5"]: ${sumCashWorkMul["1.5"] || 0} บาท`);
console.log(`💰 sumCashWorkMul["2"]: ${sumCashWorkMul["2"] || 0} บาท`);
console.log(`💰 sumCashWorkMul["3"]: ${sumCashWorkMul["3"] || 0} บาท`);
console.log(`💰 sumCashOt (รวมใหม่): ${sumCashOt} บาท`);

console.log(`\n📊 === สรุปการนับวันทำงาน ===`);
console.log(`📅 วันที่ถูกนับ: ${Array.from(countedWorkDates).sort().join(', ')}`);
console.log(`📊 จำนวนวันทำงานทั้งหมด: ${dayWorkCount} วัน`);
console.log(`💰 เงินค่าแรงรวม: ${sumCashWork} บาท`);
console.log(`💰 เงิน OT รวม: ${sumCashOt} บาท`);
console.log(`💰 รวมทั้งหมด: ${sumCashWork + sumCashOt} บาท`);

  // คำนวณ countAllowance จาก employee_record โดยนับทั้ง stop และ work ที่มี totalTime
  console.log(`\n🔍 === คำนวณ countAllowance จาก employee_record (ทั้ง stop และ work) ===`);
  console.log(`🔍 จำนวน records ทั้งหมด: ${employee_record.length}`);
  
  countAllowance = employee_record.filter(record => {
    // ตรวจสอบว่ามี totalTime และไม่ใช่ค่าว่าง โดยไม่สนใจ dayType
    const hasTotalTime = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
    
    // เพิ่ม log เพื่อตรวจสอบ
    console.log(`   วันที่ ${record.date}: dayType="${record.dayType}", totalTime="${record.totalTime || 'ไม่มี'}" ${hasTotalTime ? '✅ นับ' : '❌ ไม่นับ'}`);
    
    return hasTotalTime;
  }).length;
  
  console.log(`🔍 countAllowance ที่คำนวณได้ (ทั้ง stop และ work): ${countAllowance} วัน`);

  // Log สรุปข้อมูลที่สำคัญ
  console.log(`\n📊 === สรุปข้อมูลการคำนวณ ===`);
  console.log(`👤 employeeId: ${employeeId}`);
  console.log(`📅 เดือน/ปี: ${month}/${year}`);
  console.log(`📋 จำนวน employee_record ทั้งหมด: ${employee_record.length}`);
  console.log(`🔢 countAllowance: ${countAllowance} วัน`);
  console.log(`📊 dayWorkCount: ${dayWorkCount} วัน`);
  console.log(`📊 dayOffCount: ${dayOffCount} วัน`);
  console.log(`📊 specialDayOff: ${specialDayOff} วัน`);
  console.log(`💰 sumCashWork: ${sumCashWork} บาท`);
  console.log(`💰 sumCashOt: ${sumCashOt} บาท`);
  console.log(`📋 จำนวนรายการ addSalaryList: ${addSalaryList.length}`);
  
  if (addSalaryList.length > 0) {
    console.log(`📋 รายละเอียด addSalaryList:`);
    addSalaryList.forEach((item, idx) => {
      console.log(`   [${idx}] id=${item.id}, name=${item.name}, SpSalary=${item.SpSalary}, message=${item.message}, roundOfSalary=${item.roundOfSalary || 'N/A'}`);
    });
  }
  console.log(`📊 =============================`);

  // คำนวณค่า cashcustomizeDayoff
  // ค่าแรงต่อวันคูณจำนวนวันที่ไม่มาทำงาน
  console.log(`\n💰 คำนวณ cashcustomizeDayoff สำหรับพนักงาน ${employeeId}`);
  
  // ถ้าไม่ได้กำหนดค่า dailyWage ตั้งแต่ต้น ให้คำนวณค่าแรงต่อวันจากข้อมูลที่มี
  if (dailyWage === 0 && dayWorkCount > 0) {
    dailyWage = sumCashWork / dayWorkCount;
    console.log(`💰 คำนวณค่าแรงต่อวันจากข้อมูล sumCashWork (${sumCashWork}) / dayWorkCount (${dayWorkCount})`);
  }
  
  // เก็บจำนวนวันที่ไม่มาทำงานในตัวแปร daysNotComeToWork เพื่อใช้คำนวณต่อไป
  console.log(`💰 ค่าแรงต่อวัน: ${dailyWage.toFixed(2)} บาท`);
  console.log(`💰 จำนวนวันที่ไม่มาทำงานในวันหยุดที่กำหนดเอง: ${daysNotComeToWork} วัน`);
  
  // ค่า customizeDayoff คือจำนวนวันที่ไม่มาทำงานในวันหยุดที่กำหนดเอง
  // หมายเหตุ: เราจะกำหนดค่า customizeDayoff อีกครั้งหลังจากการคำนวณแบบละเอียดในขั้นตอนถัดไป

  // การคำนวณค่าปกติไม่จำเป็นต้องใช้ await
  const sumCashSpecialDay = sumCashWork / dayWorkCount;
  const totalsumCashSpecialDay = sumCashSpecialDay * specialDay

  
 

  console.log('cashSpecialDay  ' + cashSpecialDay);
  console.log('dayWorkCount : ' + dayWorkCount);
  console.log('dayOffCount : ' + dayOffCount);
  console.log('specialDayOff  : ' + specialDayOff);
  console.log('customizeDayoff : ' + customizeDayoff); // แสดงค่าวันหยุดที่กำหนดเอง
  console.log('cashcustomizeDayoff : ' + cashcustomizeDayoff); // แสดงค่าเงินสำหรับวันหยุดที่กำหนดเอง

  // สร้างรายงานสรุปเกี่ยวกับการตรวจสอบวันหยุดที่กำหนดเอง
  console.log(`\n📊 === รายงานสรุปวันหยุดที่กำหนดเอง ===`);
  console.log(`🔍 จำนวนวันหยุดที่กำหนดเองทั้งหมด: ${weekendData?.weekendAndDayOff?.length || 0} วัน`);
  console.log(`🔍 วันหยุดที่กำหนดเองทั้งหมด: ${JSON.stringify(weekendData?.weekendAndDayOff || [])}`);
  console.log(`🔍 จำนวนวันหยุดที่พนักงานมาทำงาน: ${weekendData?.customizeDayoff?.length - customizeDayoff || 0} วัน`);
  console.log(`🔍 จำนวนวันหยุดที่นับได้ (หลังหักวันที่มาทำงาน): ${customizeDayoff} วัน`);
  console.log(`ℹ️ หมายเหตุ: การตรวจสอบว่าพนักงานมาทำงานดูจากการมีค่า totalTime ไม่ว่า dayType จะเป็นอะไร`);
  console.log(`📝 ข้อสังเกต: ค่า totalTime ต้องไม่เป็นค่าว่าง เช่น "8.0", "7.5" ถึงจะถือว่าพนักงานมาทำงาน`);

  // ตรวจสอบการเปรียบเทียบวันที่อีกครั้ง โดยแสดงรายละเอียดทุกรายการใน employee_record
 // ตรวจสอบการเปรียบเทียบวันที่อีกครั้ง โดยแสดงรายละเอียดทุกรายการใน employee_record
console.log(`\n🔍 === ตรวจสอบรายการวันที่ทั้งหมดในบันทึก ===`);
console.log(`| วันที่        | ประเภทวัน | เวลาทำงาน | เป็นวันหยุด customizeDayoff | มาทำงาน |`);
console.log(`|-------------|----------|----------|--------------------------|--------|`);

employee_record.forEach(record => {
  try {
    // ใช้ค่า year และ month จากระดับรากของออบเจกต์
    const recordYear = year;
    const recordMonth = month;
    const recordDate = record.date;

    // สร้างวันที่ในรูปแบบ YYYY-MM-DD
    const dateStr = `${recordYear}-${String(recordMonth).padStart(2, '0')}-${String(recordDate).padStart(2, '0')}`;

    // ตรวจสอบว่าเป็นวันหยุดที่กำหนดเองหรือไม่
    const isCustomDayoff = weekendData?.weekendAndDayOff?.includes(dateStr);
    
    // ตรวจสอบว่าพนักงานมาทำงานหรือไม่ โดยดูจาก totalTime
    const hasWorked = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
    
    // แสดงข้อมูลในรูปแบบตาราง
    console.log(`| ${recordDate} (${dateStr}) | ${record.dayType || 'ไม่ระบุ'} | ${record.totalTime || '0'} | ${isCustomDayoff ? 'ใช่' : 'ไม่ใช่'} | ${hasWorked ? 'ใช่' : 'ไม่ใช่'} |`);
    
    // แสดงข้อมูลเพิ่มเติมสำหรับวันหยุดที่กำหนดเอง
    if (isCustomDayoff) {
      console.log(`  - 📅 วันที่ ${recordDate} เป็นวันหยุดที่กำหนดเอง`);
      if (hasWorked) {
        console.log(`  - ⚠️ พนักงานมาทำงานในวันหยุดที่กำหนดเอง (totalTime: ${record.totalTime})`);
      } else {
        console.log(`  - ✅ พนักงานไม่ได้มาทำงานในวันหยุดที่กำหนดเอง`);
      }
    }
  } catch (error) {
    console.error(`❌ ไม่สามารถตรวจสอบวันที่ ${record.date} ได้:`, error.message);
  }
});
const totalPublicHolidays = dayOffOnlyDates.length;
const daysWorkedOnPublicHolidays = employee_record.filter(record => {
  try {
    const recordDate = record.date;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(recordDate).padStart(2, '0')}`;
    const isPublicHoliday = dayOffOnlyDates.includes(dateStr);
    const hasWorked = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
    return isPublicHoliday && hasWorked;
  } catch (error) {
    return false;
  }
}).length;

// คำนวณ publicHolidayCount ใหม่ โดยหักจำนวนวันที่มาทำงานออก
publicHolidayCount = totalPublicHolidays - daysWorkedOnPublicHolidays;

console.log(`\n📊 === สรุปการตรวจสอบวันหยุดนักขัตฤกษ์ ===`);
console.log(`📅 จำนวนวันหยุดนักขัตฤกษ์ทั้งหมด: ${totalPublicHolidays} วัน`);
console.log(`🔍 พนักงานมาทำงานในวันหยุดนักขัตฤกษ์: ${daysWorkedOnPublicHolidays} วัน`);
console.log(`🔍 พนักงานไม่ได้มาทำงานในวันหยุดนักขัตฤกษ์: ${publicHolidayCount} วัน`);
console.log(`🔍 ค่า publicHolidayCount ที่จะบันทึก: ${publicHolidayCount}`);

console.log(`\n💰 คำนวณ publicHolidayCash สำหรับพนักงาน ${employeeId}`);

  // ตรวจสอบว่าเป็นพนักงานเงินเดือนหรือไม่
  if (salaryMonth !== 0) {
    // สำหรับพนักงานเงินเดือน: ได้เงินเฉพาะวันหยุดนักขัตฤกษ์ที่มาทำงาน
    console.log(`💰 ✅ พนักงานเงินเดือน - คำนวณ publicHolidayCash`);
    
    if (daysWorkedOnPublicHolidays > 0) {
      const dailyRateFromSalary = salaryMonth / 30; // เงินเดือนต่อวัน
      publicHolidayCash = dailyRateFromSalary * daysWorkedOnPublicHolidays;
      publicHolidayCount = daysWorkedOnPublicHolidays; // นับเฉพาะวันที่มาทำงาน
      
      console.log(`💰 เงินเดือนต่อวัน (${salaryMonth} / 30): ${dailyRateFromSalary.toFixed(2)} บาท`);
      console.log(`💰 จำนวนวันหยุดนักขัตฤกษ์ที่มาทำงาน: ${daysWorkedOnPublicHolidays} วัน`);
      console.log(`💰 เงินสำหรับวันหยุดนักขัตฤกษ์ (publicHolidayCash): ${publicHolidayCash.toFixed(2)} บาท`);
    } else {
      publicHolidayCash = 0;
      publicHolidayCount = 0;
      console.log(`💰 ไม่มาทำงานในวันหยุดนักขัตฤกษ์ - ไม่ได้เงิน (publicHolidayCash = 0 บาท)`);
    }
  } else {
    // สำหรับพนักงานรายวัน: ใช้ logic เดิม
    console.log(`💰 ✅ พนักงานรายวัน - คำนวณ publicHolidayCash`);
    
    // ตรวจสอบว่า publicHolidayCount เป็น 0 หรือไม่
    if (publicHolidayCount === 0) {
      // ถ้าไม่มีวันหยุดนักขัตฤกษ์ที่พนักงานไม่มาทำงาน ก็ไม่ต้องจ่ายเงิน
      publicHolidayCash = 0;
      console.log(`💰 publicHolidayCount เป็น 0 จึงกำหนด publicHolidayCash = 0 บาท`);
    } else {
      // ตรวจสอบว่ามีข้อมูลที่จำเป็นสำหรับการคำนวณหรือไม่
      if (sumCashWorkMul["1"] && dayWorkCount > 0) {
        // คำนวณค่าแรงต่อวันจาก sumCashWorkMul["1"] / dayWorkCount
        const dailyRate = sumCashWorkMul["1"] / dayWorkCount;
        publicHolidayCash = dailyRate * publicHolidayCount;
        
        console.log(`💰 ค่าแรงต่อวัน (sumCashWorkMul["1"] / dayWorkCount): ${dailyRate.toFixed(2)} บาท`);
        console.log(`💰 จำนวนวันหยุดนักขัตฤกษ์ที่ไม่มาทำงาน: ${publicHolidayCount} วัน`);
        console.log(`💰 เงินสำหรับวันหยุดนักขัตฤกษ์ (publicHolidayCash): ${publicHolidayCash.toFixed(2)} บาท`);
      } else {
        // กรณีไม่มีข้อมูล sumCashWorkMul["1"] หรือ dayWorkCount เป็น 0
        publicHolidayCash = 0;
        console.log(`⚠️ ไม่สามารถคำนวณ publicHolidayCash ได้ (sumCashWorkMul["1"]=${sumCashWorkMul["1"] || 0}, dayWorkCount=${dayWorkCount})`);
        console.log(`💰 กำหนด publicHolidayCash = 0 บาท`);
      }
    }
  }

  // แสดงสรุปค่า publicHolidayCash ที่คำนวณได้
  console.log(`💰 ค่า publicHolidayCash ที่จะบันทึก: ${publicHolidayCash.toFixed(2)} บาท`);

  // ❌ ลบส่วนที่เขียนทับค่า sumCashWorkMul["1.5"] ออกเพื่อให้ใช้ค่าที่คำนวณจาก Loop แทน
  // console.log(`\n💰 คำนวณค่า sumCashWorkMul["1.5"] สำหรับพนักงาน ${employeeId}`);
  // console.log(`💰 sumCashOt: ${sumCashOt} บาท`);
  // console.log(`💰 sumcashDayOffCount: ${sumcashDayOffCount} บาท`);
  // if (sumCashOt >= sumcashDayOffCount) {
  //   sumCashWorkMul["1.5"] = sumCashOt - sumcashDayOffCount;
  // } else {
  //   sumCashWorkMul["1.5"] = 0;
  // }
  // console.log(`💰 sumCashWorkMul["1.5"] ที่คำนวณได้: ${sumCashWorkMul["1.5"].toFixed(2)} บาท`);

  console.log(`\n💰 === ค่า sumCashWorkMul ที่คำนวณได้จากการวนลูป ===`);
  console.log(`💰 sumCashWorkMul["1"]: ${sumCashWorkMul["1"]} บาท`);
  console.log(`💰 sumCashWorkMul["1.5"]: ${sumCashWorkMul["1.5"]} บาท`);
  console.log(`💰 sumCashWorkMul["2"]: ${sumCashWorkMul["2"]} บาท`);
  console.log(`💰 sumCashWorkMul["3"]: ${sumCashWorkMul["3"]} บาท`);

  // สรุปผลการตรวจสอบวันหยุดที่กำหนดเอง
const totalCustomDayoff = weekendData?.weekendAndDayOff?.length || 0;
const daysWorkedOnCustomDayoff = employee_record.filter(record => {
  try {
    const recordDate = record.date;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(recordDate).padStart(2, '0')}`;
    const isCustomDayoff = weekendData?.weekendAndDayOff?.includes(dateStr);
    const hasWorked = record.totalTime && record.totalTime.trim() !== '' && parseFloat(record.totalTime) > 0;
    return isCustomDayoff && hasWorked;
  } catch (error) {
    return false;
  }
}).length;

// คำนวณ customizeDayoff ใหม่ โดยหักจำนวนวันที่มาทำงานออก
customizeDayoff = totalCustomDayoff - daysWorkedOnCustomDayoff;

// คำนวณ cashcustomizeDayoff ตามสูตร
// ถ้า customizeDayoff เป็น 0 ให้ cashcustomizeDayoff เป็น 0
// ถ้า customizeDayoff ไม่เป็น 0 ให้คำนวณจากค่าแรงเฉลี่ยต่อวันคูณจำนวนวันหยุดที่ไม่ได้มาทำงาน
if (customizeDayoff === 0) {
  cashcustomizeDayoff = 0;
} else {
  // ตรวจสอบว่ามีค่า dayWorkCount และ sumCashWorkMul["1"] หรือไม่
  if (dayWorkCount > 0 && sumCashWorkMul["1"] !== undefined) {
    // คำนวณค่าแรงเฉลี่ยต่อวัน
    const avgDailyWage = sumCashWorkMul["1"] / dayWorkCount;
    cashcustomizeDayoff = avgDailyWage * customizeDayoff;
    console.log(`💰 คำนวณ cashcustomizeDayoff = ค่าแรงเฉลี่ยต่อวัน (${avgDailyWage.toFixed(2)}) × จำนวนวันหยุดที่ไม่ได้มาทำงาน (${customizeDayoff})`);
  } else {
    // กรณีไม่มีข้อมูลพอสำหรับการคำนวณ ใช้ dailyWage ที่คำนวณไว้ก่อนหน้า
    cashcustomizeDayoff = dailyWage * customizeDayoff;
    console.log(`⚠️ ไม่พบข้อมูล sumCashWorkMul["1"] หรือ dayWorkCount = 0 ใช้ dailyWage แทน: ${dailyWage.toFixed(2)} บาท`);
  }
}

// แสดงผล
console.log(`\n📊 === สรุปการตรวจสอบวันหยุดที่กำหนดเอง ===`);
console.log(`📅 จำนวนวันหยุดที่กำหนดเองทั้งหมด: ${totalCustomDayoff} วัน`);
console.log(`🔍 พนักงานมาทำงานในวันหยุดที่กำหนดเอง: ${daysWorkedOnCustomDayoff} วัน`);
console.log(`🔍 พนักงานไม่ได้มาทำงานในวันหยุดที่กำหนดเอง: ${customizeDayoff} วัน`);
console.log(`🔍 ค่า customizeDayoff ที่จะบันทึก: ${customizeDayoff}`);
console.log(`💰 เงินสำหรับวันหยุดที่กำหนดเอง (cashcustomizeDayoff): ${cashcustomizeDayoff.toFixed(2)} บาท`);

  if (addSalary && addSalary.length > 0) {
    monthlySalaries = await addSalary.filter(salary => salary.roundOfSalary === 'monthly');
  }
     if (deductSalary&& deductSalary.length > 0) {
//เพิ่มเงินหักลงในรายการเงินหัก
      deductSalaryList = deductSalary;
  }

  addSalaryList = await addSalaryList.concat(monthlySalaries);

  console.log(`\n🔍 === การตรวจสอบเงินพิเศษที่คิดประกันสังคม ===`);
  console.log(`🔍 จำนวนรายการเงินพิเศษทั้งหมด: ${addSalaryList.length} รายการ`);
  console.log(`🔍 รายการเงินพิเศษทั้งหมด:`, JSON.stringify(addSalaryList, null, 2));
  
  for (const element of addSalaryList) {
    console.log(`\n🔍 ตรวจสอบรายการ:`);
    console.log(`🔍 - ID: ${element.id}`);
    console.log(`🔍 - ชื่อ: ${element.name}`);
    console.log(`🔍 - จำนวนเงิน (SpSalary): ${element.SpSalary} บาท`);
    console.log(`🔍 - roundOfSalary: ${element.roundOfSalary}`);
    
    let check = await checkCalTax(element.id);
    console.log(`🔍 - checkCalTax(${element.id}): ${check ? '✅ คิดประกันสังคม' : '❌ ไม่คิดประกันสังคม'}`);
    
    if (check) {
      const beforeAdd = addSalarySocialSecurity;
      addSalarySocialSecurity = parseFloat(addSalarySocialSecurity || 0) + parseFloat(element.SpSalary);
      console.log(`🔍 - เพิ่มเงินพิเศษ: ${beforeAdd} + ${element.SpSalary} = ${addSalarySocialSecurity} บาท`);
    } else {
      console.log(`🔍 - ไม่นำไปคิดประกันสังคม`);
    }
  }
  
  console.log(`\n🔍 === สรุปเงินพิเศษที่คิดประกันสังคม ===`);
  console.log(`🔍 ยอดรวมเงินพิเศษที่คิดประกันสังคม: ${addSalarySocialSecurity} บาท`);
  
  console.log(`\n🔍 === รายการ ID ที่คิดประกันสังคม ===`);
  const taxableIds = ["1110","1120","1130","1140","1150","1210","1230","1231","1233","1241","1242","1251","1350","1422","1423","1428","1434","1440","1441","1444","1445","1446","1520","1522","1524","1525","1526","1528","1540","1541","1550","1447","1613","1561","1542","1536","1529","1531","1532","1533","1534","1435","1429","1427","1412","1245","1234","1159","2111","2113","2116","2117","2120","2124","2160","2430","1190","1211","1212","1214","1235","1236","1243","1351","1411","1425","1426","1431","1448","1449","1527","1562","2114","2123","1543","1443","1544"];
  console.log(`🔍 ID ที่คิดประกันสังคม: ${taxableIds.join(', ')}`);
  console.log(`🔍 ===============================================\n`);

  // แสดงข้อมูลที่จะใช้ในการคำนวณประกันสังคม
  console.log(`\n💰 === การคำนวณประกันสังคม (socialSecurity) ===`);
  console.log(`💰 STEP 1: ข้อมูลพื้นฐานของพนักงาน`);
  console.log(`💰 - employeeId: ${employeeId}`);
  console.log(`💰 - costtype: ${costtype}`);
  console.log(`💰 - salaryMonth: ${salaryMonth} บาท`);
  console.log(`💰 - sumCashWork: ${sumCashWork} บาท`);
  console.log(`💰 - sumCashOt: ${sumCashOt} บาท`);
  console.log(`💰 - addSalarySocialSecurity: ${addSalarySocialSecurity} บาท`);
  console.log(`💰 - cashSpecialDay: ${cashSpecialDay} บาท`);
  console.log(`💰 - cashcustomizeDayoff: ${cashcustomizeDayoff} บาท`);
  console.log(`💰 - publicHolidayCash: ${publicHolidayCash} บาท`);
  console.log(`💰 - อัตราการหักประกันสังคม (socialSecurityP): ${socialSecurityP * 100}%`);

  console.log(`\n💰 STEP 2: ตัดสินใจประเภทพนักงาน`);
  //พนักงานเงินเดือน
  if (salaryMonth !== 0) {
    console.log(`💰 ✅ พนักงานเงินเดือน (salaryMonth = ${salaryMonth} ≠ 0)`);
    sumCashWork = salaryMonth;
    const dayPerHour = sumCashWork / 30 / 8; 
    const dayPerHourByWorkplace = workRate / 8; 
    const dayPerHour1p5 = dayPerHour * 1.5; 
    const dayPerHour2 = dayPerHour * 2;
    const dayPerHour3 = dayPerHour * 3; 
    sumCashWorkMul["1.5"] = (dayPerHour1p5 * sumOt1p5).toFixed(2)
    sumCashWorkMul["2"] = (dayPerHour2 * sumOtPublicHoliday).toFixed(2)
    sumCashWorkMul["3"] = (dayPerHour3 * sumOt3).toFixed(2)
    


    console.log(`💰 - คำนวณค่าแรงต่อชั่วโมงจากเงินเดือน: ${dayPerHour} บาท/ชม.`);
    
    console.log(`\n💰 STEP 3: คำนวณรายได้รวมสำหรับประกันสังคม`);
    const totalIncome = parseFloat(salaryMonth || 0) + 
                       parseFloat(addSalarySocialSecurity || 0) + 
                       parseFloat(publicHolidayCash || 0);
    
    console.log(`💰 - เงินเดือนพื้นฐาน: ${parseFloat(salaryMonth || 0)} บาท`);
    console.log(`💰 - เงินพิเศษที่คิดประกันสังคม: ${parseFloat(addSalarySocialSecurity || 0)} บาท`);
    console.log(`💰 - เงินวันหยุดกำหนดเอง: ${parseFloat(cashcustomizeDayoff || 0)} บาท`);
    console.log(`💰 - เงินวันหยุดนักขัติฤกษ์: ${parseFloat(publicHolidayCash || 0)} บาท`);
    console.log(`💰 - รวมรายได้ที่คิดประกันสังคม: ${totalIncome} บาท`);
    
    console.log(`\n💰 STEP 4: คำนวณประกันสังคม`);
    const socialSecurityBeforeCeil = totalIncome * socialSecurityP;
    console.log(`💰 - ${totalIncome} × ${socialSecurityP} = ${socialSecurityBeforeCeil} บาท`);
    
    // คำนวณประกันสังคมสำหรับพนักงานเงินเดือน (รวมเงินพิเศษทุกประเภทในการคำนวณ)
    socialSecurity = Math.ceil(socialSecurityBeforeCeil);
    console.log(`💰 - Math.ceil(${socialSecurityBeforeCeil}) = ${socialSecurity} บาท`);
    console.log(`💰 ✅ ประกันสังคมสำหรับพนักงานเงินเดือน: ${socialSecurity} บาท`);
  } else {
    console.log(`💰 ✅ พนักงานรายวัน (salaryMonth = ${salaryMonth} = 0)`);
    
    //กรณีหักภาษี ณ ที่จ่าย 3% (ภ.ง.ด.)
    if (costtype === "ภ.ง.ด.3") {
      console.log(`💰 ✅ พนักงานประเภท ภ.ง.ด.3 - ไม่คิดประกันสังคม แต่คิดภาษี 3%`);
      socialSecurity = 0;
      
      console.log(`\n💰 STEP 3: คำนวณรายได้รวมสำหรับภาษี 3%`);
      // Compute totalAddSalary locally from addSalaryList to avoid referencing undefined variables
      const totalAddSalaryLocal = (addSalaryList || []).reduce((acc, item) => acc + (parseFloat(item?.SpSalary) || 0), 0);
      const totalIncomeForTax = (parseFloat(sumCashWork) || 0) + 
                               (parseFloat(sumCashOt) || 0) + 
                               (totalAddSalaryLocal || 0) + 
                               (parseFloat(cashSpecialDay) || 0) + 
                               (parseFloat(cashcustomizeDayoff) || 0) + 
                               (parseFloat(publicHolidayCash) || 0);
      
      console.log(`💰 - เงินค่าแรงปกติ: ${parseFloat(sumCashWork || 0)} บาท`);
      console.log(`💰 - เงินค่าล่วงเวลา: ${parseFloat(sumCashOt || 0)} บาท`);
      console.log(`💰 - เงินพิเศษรวมทั้งเดือน: ${totalAddSalaryLocal} บาท`);
      console.log(`💰 - เงินวันหยุดนักขัติฤกษ์: ${parseFloat(cashSpecialDay || 0)} บาท`);
      console.log(`💰 - เงินวันหยุดกำหนดเอง: ${parseFloat(cashcustomizeDayoff || 0)} บาท`);
      console.log(`💰 - เงินวันหยุดนักขัติฤกษ์ (public): ${parseFloat(publicHolidayCash || 0)} บาท`);
      console.log(`💰 - รวมรายได้ที่คิดภาษี: ${totalIncomeForTax} บาท`);
      
      console.log(`\n💰 STEP 4: คำนวณภาษี ณ ที่จ่าย 3%`);
      const taxBeforeCeil = totalIncomeForTax * 0.03;
      console.log(`💰 - ${totalIncomeForTax} × 0.03 = ${taxBeforeCeil} บาท`);
      
      // คำนวณภาษีหัก ณ ที่จ่าย รวมเงินพิเศษทุกประเภท
      tax = taxBeforeCeil
      console.log(`💰 - Math.ceil(${taxBeforeCeil}) = ${tax} บาท`);
      console.log(`💰 ✅ ภาษีหัก ณ ที่จ่าย 3%: ${tax} บาท`);
      console.log(`💰 ✅ ประกันสังคม: ${socialSecurity} บาท (ไม่คิด)`);
    } else {
      console.log(`💰 ✅ พนักงานรายวันปกติ - คิดประกันสังคม`);
      
      console.log(`\n💰 STEP 3: คำนวณรายได้รวมสำหรับประกันสังคม`);
      const totalIncome = parseFloat(sumCashWork || 0) + 
                         parseFloat(addSalarySocialSecurity || 0) + 
                 
                     
                         parseFloat(publicHolidayCash || 0);
      
      console.log(`💰 - เงินค่าแรงปกติ: ${parseFloat(sumCashWork || 0)} บาท`);
      console.log(`💰 - เงินพิเศษที่คิดประกันสังคม: ${parseFloat(addSalarySocialSecurity || 0)} บาท`);
      console.log(`💰 - เงินวันหยุดนักขัติฤกษ์: ${parseFloat(cashSpecialDay || 0)} บาท`);
      console.log(`💰 - เงินวันหยุดกำหนดเอง: ${parseFloat(cashcustomizeDayoff || 0)} บาท`);
      console.log(`💰 - เงินวันหยุดนักขัติฤกษ์ (public): ${parseFloat(publicHolidayCash || 0)} บาท`);
      console.log(`💰 - รวมรายได้ที่คิดประกันสังคม: ${totalIncome} บาท`);
      
      console.log(`\n💰 STEP 4: คำนวณประกันสังคม`);
      const socialSecurityBeforeCeil = totalIncome * socialSecurityP;
      console.log(`💰 - ${totalIncome} × ${socialSecurityP} = ${socialSecurityBeforeCeil} บาท`);
      
      // คำนวณประกันสังคมสำหรับพนักงานรายวัน (รวมเงินพิเศษทุกประเภทในการคำนวณ)
      socialSecurity = Math.round(socialSecurityBeforeCeil);
      console.log(`💰 - Math.round(${socialSecurityBeforeCeil}) = ${socialSecurity} บาท`);
      console.log(`💰 ✅ ประกันสังคมสำหรับพนักงานรายวัน: ${socialSecurity} บาท`);
    }
  }

  // ตรวจสอบและปรับค่าประกันสังคมตามเงื่อนไข
  console.log(`\n💰 STEP 5: ตรวจสอบและปรับค่าประกันสังคมตามเงื่อนไข`);
  console.log(`💰 - ค่าประกันสังคมก่อนปรับ: ${socialSecurity} บาท`);

  //check socialSecurity != 0 and < 83 set to 83
  if (socialSecurity !== 0 && socialSecurity < 83) {
    console.log(`💰 ⚠️  เงื่อนไข: ประกันสังคม ${socialSecurity} บาท ≠ 0 และ < 83`);
    console.log(`💰 ✅ ปรับค่าประกันสังคมจาก ${socialSecurity} เป็น 83 บาท (ขั้นต่ำ)`);
    socialSecurity = 83;
  } else if (socialSecurity === 0) {
    console.log(`💰 ✅ ประกันสังคม = 0 บาท (ไม่ต้องปรับ)`);
  } else if (socialSecurity >= 83) {
    console.log(`💰 ✅ ประกันสังคม ${socialSecurity} บาท >= 83 (ผ่านเงื่อนไขขั้นต่ำ)`);
  }
  
  //check max socialSecurity   
  if (socialSecurity !== 0 && socialSecurity > 750) {
    console.log(`💰 ⚠️  เงื่อนไข: ประกันสังคม ${socialSecurity} บาท > 750`);
    console.log(`💰 ✅ ปรับค่าประกันสังคมจาก ${socialSecurity} เป็น 750 บาท (ขั้นสูง)`);
    socialSecurity = 750;
  } else if (socialSecurity <= 750 && socialSecurity !== 0) {
    console.log(`💰 ✅ ประกันสังคม ${socialSecurity} บาท <= 750 (ผ่านเงื่อนไขขั้นสูง)`);
  }

  console.log(`\n💰 === ผลลัพธ์สุดท้าย ===`);
  console.log(`💰 ✅ ประกันสังคมสุดท้าย: ${socialSecurity} บาท`);
  console.log(`💰 ✅ ภาษี: ${tax} บาท`);
  console.log(`💰 ==========================================\n`);

  console.log(`💰 ค่าประกันสังคมที่จะบันทึก: ${socialSecurity} บาท`);

  console.log(`\n✅ --- สรุปการคำนวณ sumOt1p5 ---`);
  console.log(`   - ผลรวมสุดท้ายของ sumOt1p5: ${sumOt1p5}`);

  sumTimeOt = sumTimeOt.toFixed(2);
  sumTimeWork = sumTimeWork.toFixed(2);
  sumOt1p5 = sumOt1p5.toFixed(2);
  sumOt3 = sumOt3.toFixed(2);
  sumOtPublicHoliday = sumOtPublicHoliday.toFixed(2);
  cashcustomizeDayoff = (cashcustomizeDayoff || 0).toFixed(2);
  publicHolidayCash = (publicHolidayCash || 0).toFixed(2);
  cashSpecialDay = (cashSpecialDay || 0).toFixed(2);

  // 🎯 คำนวณ sumCashWorkMul["1"] ใหม่จาก workRate * dayWorkCount
  if (workRate > 0 && dayWorkCount > 0) {
    const newSumCashWorkMul1 = workRate * dayWorkCount;
    console.log(`\n🎯 === การคำนวณ sumCashWorkMul["1"] ใหม่ ===`);
    console.log(`🎯 workRate: ${workRate} บาท`);
    console.log(`🎯 dayWorkCount: ${dayWorkCount} วัน`);
    console.log(`🎯 sumCashWorkMul["1"] เดิม: ${sumCashWorkMul["1"]}`);
    console.log(`🎯 sumCashWorkMul["1"] ใหม่: ${newSumCashWorkMul1} (${workRate} × ${dayWorkCount})`);
    
    sumCashWorkMul["1"] = newSumCashWorkMul1;
  } else {
    console.log(`\n⚠️ ไม่สามารถคำนวณ sumCashWorkMul["1"] ใหม่ได้:`);
    console.log(`   workRate: ${workRate}, dayWorkCount: ${dayWorkCount}`);
  }
  try {
    const employee = await Employee.findOne({ employeeId: employeeId });
    const wpId = employee?.workplace || '';
    
    if (wpId) {
      const workplaceResponse = await axios.get(`http://10.10.110.7:3000/workplace/${wpId}`);
      holidayOT = workplaceResponse.data.holidayOT || "3";
      
      console.log(`\n🔍 === ตรวจสอบค่า holidayOT ===`);
      console.log(`🏢 Workplace ID: ${wpId}`);
      console.log(`📊 holidayOT: ${holidayOT}`);
      
      // ตรวจสอบเงื่อนไข holidayOT
      if (holidayOT === "1.5") {
        console.log(`\n🔄 === ปรับค่าตาม holidayOT = 1.5 ===`);
        
        // 1. เอาค่า sumOt3 ไปเพิ่มใน sumOt1p5
        const oldSumOt1p5 = parseFloat(sumOt1p5) || 0;
        const oldSumOt3 = parseFloat(sumOt3) || 0;
        sumOt1p5 = (oldSumOt1p5 + oldSumOt3).toFixed(2);
        
        console.log(`📊 sumOt1p5 เดิม: ${oldSumOt1p5}`);
        console.log(`📊 sumOt3: ${oldSumOt3}`);
        console.log(`📊 sumOt1p5 ใหม่: ${sumOt1p5} (${oldSumOt1p5} + ${oldSumOt3})`);
        
        // 2. เอาเงินจาก sumCashWorkMul["3"] ไปใส่ sumCashWorkMul["1.5"]
        const cashFrom3 = parseFloat(sumCashWorkMul["3"]) || 0;
        const oldCash1p5 = parseFloat(sumCashWorkMul["1.5"]) || 0;
        
        sumCashWorkMul["1.5"] = oldCash1p5 + cashFrom3;
        sumCashWorkMul["3"] = 0;
        
        console.log(`\n💰 === ปรับค่า sumCashWorkMul ===`);
        console.log(`💰 sumCashWorkMul["3"] เดิม: ${cashFrom3} บาท`);
        console.log(`💰 sumCashWorkMul["1.5"] เดิม: ${oldCash1p5} บาท`);
        console.log(`💰 sumCashWorkMul["1.5"] ใหม่: ${sumCashWorkMul["1.5"]} บาท`);
        console.log(`💰 sumCashWorkMul["3"] ใหม่: ${sumCashWorkMul["3"]} บาท`);
        
        // 3. ปรับค่า timeCashWorkMul เช่นเดียวกัน
        const timeFrom3 = parseFloat(timeCashWorkMul["3"]) || 0;
        const oldTime1p5 = parseFloat(timeCashWorkMul["1.5"]) || 0;
        
        timeCashWorkMul["1.5"] = oldTime1p5 + timeFrom3;
        timeCashWorkMul["3"] = 0;
        
        console.log(`\n⏱️ === ปรับค่า timeCashWorkMul ===`);
        console.log(`⏱️ timeCashWorkMul["3"] เดิม: ${timeFrom3} ชั่วโมง`);
        console.log(`⏱️ timeCashWorkMul["1.5"] เดิม: ${oldTime1p5} ชั่วโมง`);
        console.log(`⏱️ timeCashWorkMul["1.5"] ใหม่: ${timeCashWorkMul["1.5"]} ชั่วโมง`);
        console.log(`⏱️ timeCashWorkMul["3"] ใหม่: ${timeCashWorkMul["3"]} ชั่วโมง`);
        
      } else if (holidayOT === "3") {
        console.log(`✅ holidayOT = 3 - ใช้ค่าปกติ ไม่ต้องปรับ`);
      } else {
        console.log(`⚠️ holidayOT = ${holidayOT} - ค่าที่ไม่รู้จัก ใช้ค่าปกติ`);
      }
      
    } else {
      console.log(`⚠️ ไม่พบ workplace สำหรับพนักงาน ${employeeId}`);
    }
  } catch (error) {
    console.error(`❌ Error checking holidayOT:`, error.message);
    console.log(`⚠️ ใช้ค่า default holidayOT = 3`);
  }

  // แสดงค่าสุดท้ายก่อน return
  console.log(`\n📊 === ค่าสุดท้ายหลังปรับตาม holidayOT ===`);
  console.log(`📊 sumOt1p5: ${sumOt1p5}`);
  console.log(`📊 sumOt3: ${sumOt3}`);
  console.log(`💰 sumCashWorkMul:`, JSON.stringify(sumCashWorkMul, null, 2));
  console.log(`⏱️ timeCashWorkMul:`, JSON.stringify(timeCashWorkMul, null, 2));

  // 🎯 คำนวณ sumCashOt ใหม่จาก sumCashWorkMul ก่อน return
  console.log(`\n🎯 === คำนวณ sumCashOt ใหม่ก่อน return ===`);
  console.log(`🎯 sumCashOt เดิม: ${sumCashOt}`);
  
  sumCashOt = (parseFloat(sumCashWorkMul["1.5"]) || 0) + 
              (parseFloat(sumCashWorkMul["2"]) || 0) + 
              (parseFloat(sumCashWorkMul["3"]) || 0);
  
  console.log(`🎯 sumCashWorkMul["1.5"]: ${sumCashWorkMul["1.5"] || 0}`);
  console.log(`🎯 sumCashWorkMul["2"]: ${sumCashWorkMul["2"] || 0}`);
  console.log(`🎯 sumCashWorkMul["3"]: ${sumCashWorkMul["3"] || 0}`);
  console.log(`🎯 sumCashOt ใหม่: ${sumCashOt}`);

  // 🎯 คำนวณ employeeCompensation (เงินสงเคราะห์ลูกจ้าง) ด้วยหลักการใหม่
  let employeeCompensation = 0;
  
  // ตรวจสอบว่าใช้โครงสร้างใหม่หรือเก่า
  if (employeeCompensationRate1_20 > 0 || employeeCompensationRate21_30_31 > 0) {
    // หลักการใหม่: คำนวณแยกตามช่วงวันที่
    
    // คำนวณจำนวนวันในเดือนสำหรับช่วง 21-30/31
    const daysInMonth = new Date(year, month, 0).getDate(); // จำนวนวันทั้งหมดในเดือน
    const daysFor21_30_31 = daysInMonth - 20; // วันที่ 21 ถึงสิ้นเดือน (30 หรือ 31)
    
    // คำนวณ Rate1_20: Rate ÷ 19 × sumCashWork1_20
    const compensation1_20 = (employeeCompensationRate1_20 / 19) * sumCashWork1_20;
    
    // คำนวณ Rate21_30_31: Rate ÷ (30 หรือ 31) × sumCashWork21_30_31
    const compensation21_30_31 = (employeeCompensationRate21_30_31 / daysFor21_30_31) * sumCashWork21_30_31;
    
    // รวมทั้ง 2 ค่า
    employeeCompensation = compensation1_20 + compensation21_30_31;
    
    console.log(`\n💰 === คำนวณเงินสงเคราะห์ลูกจ้าง (หลักการใหม่) ===`);
    console.log(`💰 เดือน ${month}/${year} มี ${daysInMonth} วัน`);
    console.log(`💰 วันที่ 21-${daysInMonth} มี ${daysFor21_30_31} วัน`);
    console.log(`💰 Rate1_20: ${employeeCompensationRate1_20} ÷ 19 × ${sumCashWork1_20} = ${compensation1_20.toFixed(2)} บาท`);
    console.log(`💰 Rate21_30_31: ${employeeCompensationRate21_30_31} ÷ ${daysFor21_30_31} × ${sumCashWork21_30_31} = ${compensation21_30_31.toFixed(2)} บาท`);
    console.log(`💰 employeeCompensation รวม: ${compensation1_20.toFixed(2)} + ${compensation21_30_31.toFixed(2)} = ${employeeCompensation.toFixed(2)} บาท`);
    console.log(`💰 ===================================================`);
  } else {
    // หลักการเก่า: sumCashWork × employeeCompensationRate
    employeeCompensation = sumCashWork * employeeCompensationRate;
    console.log(`\n💰 === คำนวณเงินสงเคราะห์ลูกจ้าง (หลักการเก่า) ===`);
    console.log(`💰 sumCashWork: ${sumCashWork} บาท`);
    console.log(`💰 employeeCompensationRate: ${employeeCompensationRate}`);
    console.log(`💰 employeeCompensation: ${sumCashWork} × ${employeeCompensationRate} = ${employeeCompensation} บาท`);
    console.log(`💰 ===============================================`);
  }

  // 📅 แสดงผลการแบ่งเงินเดือนตามช่วงวันที่
  console.log(`\n📅 === การแบ่งเงินเดือนตามช่วงวันที่ ===`);
  console.log(`📅 sumCashWork1_20 (วันที่ 1-20): ${sumCashWork1_20} บาท`);
  console.log(`📅 sumCashWork21_30_31 (วันที่ 21-30/31): ${sumCashWork21_30_31} บาท`);
  console.log(`📅 รวมทั้งหมด: ${sumCashWork1_20 + sumCashWork21_30_31} บาท (ตรวจสอบ: ${sumCashWork})`);
  console.log(`📅 =========================================`);

  return await {
    dayWorkCount,
    dayOffCount,
    specialDayOff,
    customizeDayoff, // เพิ่มฟิลด์ customizeDayoff
    cashcustomizeDayoff, // เพิ่มฟิลด์ cashcustomizeDayoff
    publicHolidayCount, // เพิ่มฟิลด์ publicHolidayCount
    publicHolidayCash, // เพิ่มฟิลด์ publicHolidayCash
    sumTimeWork,
    sumTimeOt,
    sumCashWork,
    sumCashOt,
    sumcashDayOffCount,
    sumAddSalaryDaily,
    sumCashWorkMul,
    timeCashWorkMul,
    addSalaryList,
    socialSecurity,
    tax,
    cashSpecialDay,
    deductSalaryList,
    sumOt1p5,
    sumOt3,
    sumOtPublicHoliday,
    countAllowance, // เพิ่ม countAllowance เพื่อใช้ในการตั้งค่า message
    employeeCompensation, // เพิ่มเงินสงเคราะห์ลูกจ้าง
    sumCashWork1_20, // เงินเดือนวันที่ 1-20
    sumCashWork21_30_31, // เงินเดือนวันที่ 21-30/31
    typeOfemployee, // เพิ่ม typeOfemployee (jobtype จาก employee)
  };
  
  
  // Log ค่า countAllowance ก่อน return
  console.log(`\n🔍 === ค่าที่จะ return จาก calculateCashValues ===`);
  console.log(`🔍 countAllowance: ${countAllowance}`);
  console.log(`🔍 dayWorkCount: ${dayWorkCount}`);
  console.log(`🔍 dayOffCount: ${dayOffCount}`);
  console.log(`🔍 addSalaryList.length: ${addSalaryList.length}`);
  console.log(`🔍 socialSecurity: ${socialSecurity}`);
  console.log(`🔍 tax: ${tax}`);
  console.log(`🔍 typeOfemployee: ${typeOfemployee}`);
  console.log(`🔍 =============================`);
};


module.exports = router;