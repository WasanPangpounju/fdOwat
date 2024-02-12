import endpoint from '../../config';
import axios from 'axios';


export const getMonthName= (monthNumber) => {
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
  
  export const getDateDayOfWeek = (dateString) => {
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
  

  //get number of day by mapping
function getNumberOfDay(dn){
      // Convert dayName to lowercase
      const lowerCaseDayName = dn.toLowerCase();
    
  const dayMapping = {
    อาทิตย์: 0,
    จันทร์: 1,
    อังคาร: 2,
    พุธ: 3,
    พฤหัส: 4,
    ศุกร์: 5,
    เสาร์: 6
  };

      // Return the corresponding day number or null if dayName is invalid
      return dayMapping[lowerCaseDayName] !== undefined ? dayMapping[lowerCaseDayName] : null;
}


  //get time of work by workplace and day
  export const getWorkTime = async (workplace , dw) => {
// alert(JSON.stringify(workplace,null,2));
// alert(dw);
const worktimeList = {};

const workTime = await {
  shift: '',
  startTime: '',
  endTime: '',
  resultTime: '',
  startTimeOT: '',
  endTimeOT: '',
  resultTimeOT: ''
};

// alert(workplace[0].workTimeDay);
// alert(workplace.workTimeDay.length);
await workplace[0].workTimeDay.map( async (item, index) => {
  // alert(JSON.stringify(item,null,2));
// alert('start' +getNumberOfDay(item.startDay) );
// alert('end' + getNumberOfDay(item.endDay) );

if(getNumberOfDay(item.startDay) ==  getNumberOfDay(item.endDay) ){
  worktimeList[getNumberOfDay(item.startDay)] = item.allTimes;
} else {
for(let i = getNumberOfDay(item.startDay); i <= getNumberOfDay(item.endDay); i++ ) {
  worktimeList[i] = item.allTimes;
}
}

});

// alert(JSON.stringify(worktimeList, null ,2) );
// alert(dw);
let dateString = await dw;
const [day, month, year] = await dateString.split('/');

// Create a new Date object using the year, month (0-indexed), and day
const date = await new Date(year, month - 1, day);

// Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
const dayNumber = await date.getDay();
// const dayNumber = dw.getDay();
// await alert(dayNumber );
// await alert(JSON.stringify(worktimeList[dayNumber] ,null,2));
return await worktimeList[dayNumber];
  };
