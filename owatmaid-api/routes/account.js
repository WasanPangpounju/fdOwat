const sURL = 'http://localhost:3000';
const accounting = require('./models/accountingModel');
const welfare = require('./models/welfareModel');


const axios = require('axios');

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
    year: "2024", 
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
      console.log('day ' + responseConclude.data.recordConclude[c].concludeRecord[i].day);
      console.log('responseConclude.data.recordConclude[c].concludeRecord[i].workRate ' + responseConclude.data.recordConclude[c].concludeRecord[i].workRate + ' salary ' + salary)
  
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
  const idList = await ["1230","1231","1233","1241","1242","1350","1422","1423","1428","1434","1520","1522","1524","1525","1526","1529","1531","1533","1534","1429","1427","1245","1234","2111","2116","2120","2124"];

  
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
  const idList = await ["1110","1120","1130","1140","1150","1210","1230","1231","1233","1241","1242","1251","1330","1350","1410","1422","1423","1428","1434","1440","1441","1444","1445","1446","1520","1522","1524","1525","1526","1528","1535","1540","1541","1550","1560","1447","1613","1561","1542","1536","1529","1531","1532","1533","1534","1442","1435","1429","1427","1412","1245","1234","1159","2111","2113","2116","2117","2120","2124","2160","2430","1190","1211","1212","1214","1235","1236","1243","1351","1411","1425","1426","1431","1448","1449","1527","1562","2114","2123","1543","1443","1544"];
  
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


module.exports = router;