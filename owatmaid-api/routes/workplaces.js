const connectionString = require('../config');

const {Workplace} = require('./models/workplaceModel');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { months } = require('moment');
const { el, ca, it } = require('date-fns/locale');
const axios = require('axios');

//Connect mongodb
mongoose.connect(connectionString, {
    useNewUrlParser: true, useUnifiedTopology:
        true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Get list of workplaces
router.get('/list', async (req, res) => {
    const workplaces = await Workplace.find();
    res.json(workplaces);
});

// Get list id name and address of workplaces
router.get('/listselect', async (req, res) => {
    try {
        const workplaces = await Workplace.find({}, 'workplaceId workplaceName workplaceArea addSalary');
        res.json(workplaces);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


// Get  workplace by Id
router.get('/:workplaceId', async (req, res) => {
    try {
        const workplace = await Workplace.findOne({ workplaceId: req.params.workplaceId });
        if (workplace) {
            res.json(workplace);
        } else {
            res.status(404).json({ error: 'workplace not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }

});


router.post('/getaddsalary', async (req, res) => {
    const ans = [];

    try {
        const { wIdList } = await req.body;

        let uniqueArray = await [...new Set(wIdList)];

        if (uniqueArray.length <= 0) {
            return res.status(200).json({});
        }

        for (let i = 0; i < uniqueArray.length; i++) {
            const query = { workplaceId: uniqueArray[i] };

            // Query the workplace collection for matching documents
            const workplaces = await Workplace.find(query);

            if (workplaces && workplaces.length > 0) {
                // Filter the addSalary array by roundOfSalary = 'daily'
                const filteredWorkplace = workplaces[0];
                filteredWorkplace.addSalary = filteredWorkplace.addSalary.filter(salary => salary.roundOfSalary === 'daily');

                // Only push to ans if addSalary has at least one item after filtering
                if (filteredWorkplace.addSalary.length > 0) {
                    await ans.push(filteredWorkplace);
                }
            }
        }

        if (ans.length > 0) {
            return res.status(200).json({ ans });
        } else {
            return res.status(200).json({});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// router.post('/getaddsalary', async (req, res) => {
//     const ans = [];

//     try {
//         const {wIdList} = await req.body;

//         // await console.log('wIdList : ' + wIdList);
//         let uniqueArray = await [...new Set(wIdList)];

// // console.log('wIdList : ' + uniqueArray); // Output: ['123', '456']
// if(uniqueArray.length <= 0) {
//     res.status(200).json({});
// }


// for (let i = 0; i < uniqueArray.length; i++) {
//     // await console.log(uniqueArray[i]);
//     const query = {};
// query.workplaceId = await uniqueArray[i];

//         // Query the workplace collection for matching documents
//         const workplaces = await Workplace.find(query);
// if(workplaces ) {

//     await ans.push(workplaces[0] );

// }

// } //end for

// if(ans.length > 0 ) {
//     await res.status(200).json({ ans});
// } else{
//     await res.status(200).json();

// }

//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ message: 'Internal server error' });
//     }


// });


//get upSalary
router.post('/getupsalary', async (req, res) => {
    try {
        const { searchWorkplaceId, searchWorkplaceName } = req.body;

        // Construct the search query based on the provided parameters
        const query = {};

        if (searchWorkplaceId !== '') {
            query.workplaceId = searchWorkplaceId;
        }


        if (searchWorkplaceName !== '') {
            query.workplaceName = { $regex: new RegExp(searchWorkplaceName, 'i') };
            //{ $regex: name, $options: 'i' };
        }
        //    query.searchWorkplaceId = '1001';
        //    console.log({ employeeId, name, idCard, workPlace });

        console.log('Constructed Query:');
        console.log(query);
        if (searchWorkplaceId == '' && searchWorkplaceName == '') {
            res.status(200).json({});
        }

        // Query the workplace collection for matching documents
        const workplaces = await Workplace.find(query);

        // await console.log('Search Results:');
        // await console.log(workplaces);
        let textSearch = 'workplace';
        await res.status(200).json({ workplaces });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { searchWorkplaceId, searchWorkplaceName } = req.body;

        // Construct the search query based on the provided parameters
        const query = {};

        if (searchWorkplaceId !== '') {
            query.workplaceId = searchWorkplaceId;
        }


        if (searchWorkplaceName !== '') {
            query.workplaceName = { $regex: new RegExp(searchWorkplaceName, 'i') };
            //{ $regex: name, $options: 'i' };
        }
        //    query.searchWorkplaceId = '1001';
        //    console.log({ employeeId, name, idCard, workPlace });

        console.log('Constructed Query:');
        console.log(query);
        if (searchWorkplaceId == '' && searchWorkplaceName == '') {
            res.status(200).json({});
        }

        // Query the workplace collection for matching documents
        const workplaces = await Workplace.find(query);

        // await console.log('Search Results:');
        // await console.log(workplaces);
        let textSearch = 'workplace';
        await res.status(200).json({ workplaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Create new workplace 
router.post('/create', async (req, res) => {

    const {
        workplaceId,
        workplaceName,
        workplaceArea,
        workOfWeek,
        workStart1,
        workEnd1,
        workStart2,
        workEnd2,
        workStart3,
        workEnd3,
        workStartOt1,
        workEndOt1,
        workStartOt2,
        workEndOt2,
        workStartOt3,
        workEndOt3,
        workOfHour,
        workOfOT,
        workOfHour_subHour,
        workOfHour_subMinute,
        startWorkOfOT_subHour,
        startWorkOfOT_subMinute,
        workOfOT_subHour,
        workOfOT_subMinute,
        workOfOT_breakHour,
        workOfOT_breakMinute,
        workRate,
        addWorkRate,
        workRateOT,
        workTotalPeople,
        dayoffRate,
        dayoffRateOT,
        dayoffRateHour,
        holiday,
        holidayOT,
        holidayHour,
        workRateChange,
        salaryadd1,
        salaryadd2,
        salaryadd3,
        salaryadd4,
        salaryadd5,
        salaryadd6,
        personalLeave,
        personalLeaveNumber,
        personalLeaveRate,
        sickLeave,
        sickLeaveNumber,
        sickLeaveRate,
        workRateDayoff,
        workRateDayoffNumber,
        workRateDayoffRate,
        daysOff,
        daysOffMap,
        publicHoliday, 
        workplaceAddress,
        reason,
        employeeIdList,
        employeeNameList,
        workday1,
        workday2,
        workday3,
        workday4,
        workday5,
        workday6,
        workday7,

        workcount1,
        workcount2,
        workcount3,
        workcount4,
        workcount5,
        workcount6,
        workcount7,
        addSalary,
        listEmployeeDay,
        listSpecialWorktime,
        workTimeDay,
        workTimeDayPerson,
        specialWorkTimeDay,
    } = req.body;


    // Create workplace
    const workplace = new Workplace({
        workplaceId,
        workplaceName,
        workplaceArea,
        workOfWeek,
        workStart1,
        workEnd1,
        workStart2,
        workEnd2,
        workStart3,
        workEnd3,
        workStartOt1,
        workEndOt1,
        workStartOt2,
        workEndOt2,
        workStartOt3,
        workEndOt3,
        workOfHour,
        workOfOT,
        workOfHour_subHour,
        workOfHour_subMinute,
        startWorkOfOT_subHour,
        startWorkOfOT_subMinute,
        workOfOT_subHour,
        workOfOT_subMinute,
        workOfOT_breakHour,
        workOfOT_breakMinute,
        workRate,
        addWorkRate,
        workRateOT,
        workTotalPeople,
        dayoffRate,
        dayoffRateOT,
        dayoffRateHour,
        holiday,
        holidayOT,
        holidayHour,
        workRateChange,
        salaryadd1,
        salaryadd2,
        salaryadd3,
        salaryadd4,
        salaryadd5,
        salaryadd6,
        personalLeave,
        personalLeaveNumber,
        personalLeaveRate,
        sickLeave,
        sickLeaveNumber,
        sickLeaveRate,
        workRateDayoff,
        workRateDayoffNumber,
        workRateDayoffRate,
        daysOff,
        daysOffMap,
        publicHoliday: [], // เพิ่มฟิลด์ publicHoliday
        workplaceAddress,
        reason,
        employeeIdList,
        employeeNameList,
        addSalary,
        listEmployeeDay,
        listSpecialWorktime,
        workTimeDay,
        workTimeDayPerson,
        specialWorkTimeDay
    });

    try {
        await workplace.save();
        res.json(workplace);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }

});



// Update a workplace by its workplaceId
router.put('/update/:workplaceId', async (req, res) => {
    //    console.log('hello');
    const workplaceIdToUpdate = req.params.workplaceId;
    const updateFields = req.body;

    try {
        // Find the resource by ID and update it
        const updatedResource = await Workplace.findByIdAndUpdate(
            workplaceIdToUpdate,
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


//get data for calculator day off
router.post('/caldata', async (req, res) => {
    try {
        const { year, month, workplaceId } = req.body;
const data = {};

        const workplace = await Workplace.findOne({ workplaceId });
        if (workplace) {
            const dayOffList = [];
            const workplaceDayOffList = [];
            const specialDayOffList = [];
const specialDaylist = [];

            let dayOffSum = 0;

            // Parse workTimeDay to get day off list
            if (workplace.workTimeDay) {
                workplace.workTimeDay.forEach(item => {
                    if (item.workOrStop === 'stop') {
                        try {
                            let startDay = getDayNumber(item.startDay) ;
                            let endDay = getDayNumber(item.endDay);
                            console.log('startDay ' + startDay);
                            console.log('endDay ' + endDay);

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
                });
                console.log('dayOffList: ', dayOffList);
            }

            // Convert the month string to an integer
            const monthInteger = parseInt(month, 10);

            // Format the new month as a two-digit string (e.g. "01", "02", ...)
            const newMonthStringX = (monthInteger - 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });

            // Calculate the previous month
            let previousMonthX;
            if (monthInteger === 1) {
                previousMonthX = 12;
            } else {
                previousMonthX = monthInteger - 1;
            }

            // Convert the previous month to a two-digit string (e.g. "03")
            const previousMonthStringX = previousMonthX.toLocaleString('en-US', { minimumIntegerDigits: 2 });

            // Get the number of days in the previous month
            let endM1 = new Date(year, previousMonthX, 0).getDate();

            // console.log(`Processing dates for the period: ${year}-${month} (previous month: ${previousMonthStringX}, end day: ${endM1})`);

            for (let m1 = 21; m1 <= endM1; m1++) {
                let dateString = `${year}-${previousMonthStringX}-${m1.toString().padStart(2, '0')}`;
                let dayNumber = new Date(dateString).getDay();
                // console.log(`m1 loop: dateString ${dateString}, dayNumber ${dayNumber}`);
                if (dayOffList.includes(dayNumber)) {
                    // console.log(`*Adding day off for date ${dateString} with dayNumber ${dayNumber}`);
                    dayOffSum += 1;
                    workplaceDayOffList.push(dateString);
                }
                // console.log('dayOffSum after m1 loop ' + dayOffSum);
            }

            for (let m2 = 1; m2 <= 20; m2++) {
                let dateString = `${year}-${monthInteger.toString().padStart(2, '0')}-${m2.toString().padStart(2, '0')}`;
                let dayNumber = new Date(dateString).getDay();
                // console.log(`m2 loop: dateString ${dateString}, dayNumber ${dayNumber}`);
                if (dayOffList.includes(dayNumber)) {
                    // console.log(`Adding day off for date ${dateString} with dayNumber ${dayNumber}`);
                    dayOffSum += 1;
                    workplaceDayOffList.push(dateString);

                }
                // console.log('dayOffSum after m2 loop ' + dayOffSum);
            }

            // console.log('final dayOffSum ' + dayOffSum);
            // console.log('workplaceDayOffList' + workplaceDayOffList);
// console.log('daysOff '+ workplace.daysOff);
            // Process daysOff
            await Promise.all(workplace.daysOff.map(async item => {
                const day1 = new Date(item);
                day1.setDate(day1.getDate() );
                const month1 = day1.getMonth();
                const month1String = (month1 + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });
                const year1 = day1.getFullYear();
                const lastDayOfMonth = new Date(year1, month1 + 1, 0).getDate();

                if (day1.getDate() > lastDayOfMonth) {
                    day1.setDate(day1.getDate() - lastDayOfMonth);
                }

                const monthInteger = parseInt(month, 10);
                const newMonthString = (monthInteger - 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });

                let previousMonth;
                if (newMonthString === "0") {
                    previousMonth = 12;
                } else {
                    previousMonth = newMonthString;
                }

                const previousMonthString = previousMonth.toLocaleString('en-US', { minimumIntegerDigits: 2 });

                if (month !== "01" && month !== "12" && year == year1) {
                    if (month == month1String && year == year1 && day1.getDate() <= 20) {
                        specialDaylist.push(day1.getDate());
                    } else {
                        if (previousMonthString == month1String && day1.getDate() >= 21) {
                            specialDaylist.push(day1.getDate());
                        }
                    }
                } else {
                    if (month == "01") {
                        if (year1 == year - 1 && month1String == "12" && day1.getDate() >= 21) {
                            specialDaylist.push(day1.getDate());
                        }
                        if (year1 == year && month1String == "01" && day1.getDate() <= 20) {
                            specialDaylist.push(day1.getDate());
                        }
                    }
                    if (month == "12") {
                        if (year1 == year && month1String == "12" && day1.getDate() <= 20) {
                            specialDaylist.push(day1.getDate());
                        }
                    }
                }
            }));

            // console.log('specialDaylist: ', specialDaylist);



            //set value for return API
data.workplaceDayOffList = workplaceDayOffList || [];
data.specialDaylist = specialDaylist || [];

data.workRate = workplace.workRate || 0;
data.addWorkRate = workplace.addWorkRate || 0;
data.workRateOT = workplace.workRateOT || 0;
data.dayoffRateHour = workplace.dayoffRateHour || 0;
data.dayoffRateOT = workplace.dayoffRateOT  || 0;
data.holiday = workplace.holiday ||0;
data.holidayOT = workplace.holidayOT ||0;
data.holidayHour = workplace.holidayHour;

data.workOfHour= workplace.workOfHour||0;
data.workOfOT = workplace.workOfOT||0;
data.workOfHour_subHour = workplace.workOfHour_subHour || 0;
data.workOfHour_subMinute = workplace.workOfHour_subMinute || 0;
data.startWorkOfOT_subHour = workplace.startWorkOfOT_subHour || 0;
data.startWorkOfOT_subMinute = workplace.startWorkOfOT_subMinute || 0;
data.workOfOT_subHour = workplace.workOfOT_subHour || 0;
data.workOfOT_subMinute = workplace.workOfOT_subMinute || 0;
data.workOfOT_breakHour = workplace.workOfOT_breakHour  || 0;
data.workOfOT_breakMinute = workplace.workOfOT_breakMinute || 0;
data.workRateChange = workplace.workRateChange;

            res.json(data);

            // res.json({ workplace, dayOffSum });
        } else {
            res.status(404).json({ error: 'Workplace not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

  // ✅ Add Special Work Schedule to a Workplace
router.post("/add-work-schedule/:workplaceId", async (req, res) => {
    try {
      const workplace = await Workplace.findOne({ workplaceId: req.params.workplaceId });
      if (!workplace) return res.status(404).json({ message: "Workplace Not Found" });
  
      workplace.specialWorkTimeDay.push(req.body); // Add new work schedule
      await workplace.save();
      res.status(201).json({ message: "Work Schedule Added Successfully", data: workplace });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ✅ Get All Work Schedules for a Workplace
  router.get("/work-schedule/:workplaceId", async (req, res) => {
    try {
      const workplace = await Workplace.findOne({ workplaceId: req.params.workplaceId });
      if (!workplace) return res.status(404).json({ message: "Workplace Not Found" });
  
      res.status(200).json(workplace.specialWorkTimeDay);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ✅ Delete a Work Schedule Entry
  router.delete("/work-schedule/:workplaceId/:scheduleId", async (req, res) => {
    try {
      const workplace = await Workplace.findOne({ workplaceId: req.params.workplaceId });
      if (!workplace) return res.status(404).json({ message: "Workplace Not Found" });
  
      workplace.specialWorkTimeDay = workplace.specialWorkTimeDay.filter(
        (schedule) => schedule._id.toString() !== req.params.scheduleId
      );
  
      await workplace.save();
      res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// API endpoint สำหรับอัปเดต PublicHoliday จาก dayOffOnly
router.post('/update-public-holidays/:workplaceId', async (req, res) => {
    try {
        const { workplaceId } = req.params;
        const { year } = req.body;

        if (!workplaceId || !year) {
            return res.status(400).json({ error: 'ต้องระบุ workplaceId และ year' });
        }

        // ตรวจสอบว่าหน่วยงานมีอยู่จริงหรือไม่
        const workplace = await Workplace.findOne({ workplaceId });
        if (!workplace) {
            return res.status(404).json({ error: `ไม่พบหน่วยงานรหัส ${workplaceId}` });
        }

        // 1. เรียก API getWeekendDates เพื่อดึงข้อมูล dayOffOnly
        const publicHolidays = [];
        const failedMonths = [];
        
        // สำหรับทุกเดือนในปี
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            // เรียกใช้งาน API conclude/getWeekendDates
            try {
                // ใช้ server URL จากตัวแปร config
                const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
                const response = await axios.get(`${baseUrl}/conclude/getWeekendDates?yyyy=${year}&mm=${monthStr}&workplaceId=${workplaceId}`);
                
                if (response.data && response.data.dayOffOnly) {
                    // แปลง string date เป็น object {date, note}
                    const monthHolidays = response.data.dayOffOnly.map(dateStr => ({
                        date: new Date(dateStr),
                        note: '' // ไม่มีหมายเหตุสำหรับข้อมูลจาก dayOffOnly
                    }));
                    publicHolidays.push(...monthHolidays);
                    console.log(`✅ เดือน ${monthStr}: ดึง ${monthHolidays.length} วันหยุดสำเร็จ`);
                }
            } catch (error) {
                console.error(`❌ Error getting weekend dates for ${year}-${monthStr}:`, error.message);
                failedMonths.push(monthStr);
                // ไม่ return error ในลูป แต่ทำต่อไปเพื่อรวบรวมข้อมูลให้ได้มากที่สุด
            }
        }

        // 2. อัปเดตข้อมูล publicHoliday ในหน่วยงาน
        const updatedWorkplace = await Workplace.findOneAndUpdate(
            { workplaceId: workplaceId },
            { publicHoliday: publicHolidays },
            { new: true }
        );

        // สร้าง response
        const response = {
            message: 'อัปเดต PublicHoliday สำเร็จ',
            publicHolidayCount: publicHolidays.length,
            publicHolidayDates: publicHolidays.map(holiday => holiday.date.toISOString().split('T')[0]), // แสดงวันที่ในรูปแบบ YYYY-MM-DD
            workplace: updatedWorkplace
        };

        // ถ้ามีเดือนที่ไม่สามารถดึงข้อมูลได้ ให้แสดงเตือน
        if (failedMonths.length > 0) {
            response.warning = `ไม่สามารถดึงข้อมูลวันหยุดจากเดือน: ${failedMonths.join(', ')}`;
        }

        res.json(response);
    } catch (error) {
        console.error('Error updating public holidays:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดต PublicHoliday', details: error.message });
    }
});

// API endpoint สำหรับส่งข้อมูลวันหยุดนักขัตฤกษ์ไปอัปเดตใน dayOffOnly
router.post('/sync-public-holidays/:workplaceId', async (req, res) => {
    try {
        const { workplaceId } = req.params;
        const { publicHoliday } = req.body;

        if (!workplaceId) {
            return res.status(400).json({ error: 'ต้องระบุ workplaceId' });
        }

        // แปลง ISO date string เป็น Date objects
        const parsedPublicHoliday = publicHoliday.map(holiday => {
            try {
                return {
                    date: new Date(holiday.date),
                    note: holiday.note || ""
                };
            } catch (error) {
                console.error('Error parsing date:', error);
                return {
                    date: new Date(),
                    note: holiday.note || ""
                };
            }
        }).filter(h => !isNaN(h.date.getTime()));

        console.log('Received and parsed publicHoliday:', parsedPublicHoliday);

        // ตรวจสอบว่าหน่วยงานมีอยู่จริงหรือไม่
        const workplace = await Workplace.findOne({ workplaceId });
        if (!workplace) {
            return res.status(404).json({ error: `ไม่พบหน่วยงานรหัส ${workplaceId}` });
        }

        // อัปเดต publicHoliday ในฐานข้อมูล
        await Workplace.findOneAndUpdate(
            { workplaceId: workplaceId },
            { publicHoliday: parsedPublicHoliday || [] },
            { new: true }
        );

        // ส่งข้อมูลไปอัปเดตใน conclude API
        if (parsedPublicHoliday && parsedPublicHoliday.length > 0) {
            try {
                // เรียกใช้ API conclude/updateDayOffOnly เพื่ออัปเดตข้อมูล
                const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
                const apiUrl = baseUrl.includes('localhost') 
                    ? 'http://localhost:3000/conclude/updateDayOffOnly'
                    : `${baseUrl}/conclude/updateDayOffOnly`;

                console.log('Syncing publicHoliday to conclude API at:', apiUrl);
                
                const updateResponse = await axios.post(apiUrl, {
                    workplaceId: workplaceId,
                    publicHolidays: parsedPublicHoliday
                });

                console.log('✅ Successfully synced public holidays to conclude API:', updateResponse.data);
            } catch (error) {
                console.error('❌ Error syncing to conclude API:', error.message);
                // ไม่ return error เพราะอัปเดตฐานข้อมูลสำเร็จแล้ว
            }
        }

        res.json({
            message: 'อัปเดตวันหยุดนักขัตฤกษ์สำเร็จ',
            publicHolidayCount: publicHoliday ? publicHoliday.length : 0,
            workplaceId: workplaceId
        });
    } catch (error) {
        console.error('Error syncing public holidays:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตวันหยุดนักขัตฤกษ์', details: error.message });
    }
});

module.exports = router;
