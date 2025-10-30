const axios = require('axios');
const mongoose = require('mongoose');
const sURL = 'http://localhost:3000';

// สร้าง utility สำหรับการคำนวณค่าต่างๆ สำหรับหน่วยงานพิเศษที่ทำงานทุกวัน (workOfWeek = "7")
const calculateCashValuesForSpecialWorkplace = async (employeeId, employee_record, month, year) => {
  console.log(`\n🟡 [specialWorkplaceUtils.calculateCashValuesForSpecialWorkplace] เริ่มต้นการคำนวณสำหรับหน่วยงานพิเศษ พนักงาน ${employeeId} (${month}/${year})`);
  console.log(`🟡 [specialWorkplaceUtils] จำนวน employee_record ที่รับเข้ามา: ${employee_record.length} รายการ`);
  
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
      let adjustedYear = year;
      let adjustedMonth = month;
      
      if((record.date >= 21 && record.date <= 31) && month == 1) {
        adjustedYear = year - 1;
        adjustedMonth = 12;
      }

      const rawDate = new Date(adjustedYear, adjustedMonth - 1, record.date);
      const bangkokDate = toBangkokDate(rawDate);
      
      // ค้นหาข้อมูลหน่วยงาน (workplace)
      const workplaceObjectId = new mongoose.Types.ObjectId(record.workplaceId);
      const {Workplace} = require('../routes/models/workplaceModel');
      const workplace = await Workplace.findOne({ _id: workplaceObjectId });
      
      if (!workplace) {
        console.log(`⚠️  [specialWorkplaceUtils] ไม่พบข้อมูล workplace สำหรับ ID: ${record.workplaceId}`);
        return record;
      }

      console.log(`📌 [specialWorkplaceUtils] ประมวลผลวันที่ ${record.date}/${adjustedMonth}/${adjustedYear} - workplaceId: ${record.workplaceId}`);
      console.log(`📌 [specialWorkplaceUtils] workplace.workOfWeek: ${workplace.workOfWeek}, workplace.workRate: ${workplace.workRate}`);
      console.log(`📌 [specialWorkplaceUtils] totalTime: ${record.totalTime}, dayType: ${record.dayType}, cashWork: ${record.cashWork}, cashWorkMul: ${record.cashWorkMul}`);

      // สำหรับหน่วยงานพิเศษที่ทำงานทุกวัน (workOfWeek = "7")
      if (workplace.workOfWeek === "7") {
        console.log(`🟢 [specialWorkplaceUtils] หน่วยงานพิเศษที่ทำงานทุกวัน - กำลังปรับปรุง dayType และ cashWork`);
        
        // เช็คว่าเป็นวันที่มีการทำงานจริง
        const totalTime = parseFloat(record.totalTime || '0');
        const cashWork = parseFloat(record.cashWork || '0');
        
        if (totalTime > 0 || cashWork > 0) {
          console.log(`🟢 [specialWorkplaceUtils] วันที่ ${record.date}: มีงาน (totalTime: ${totalTime}, cashWork: ${cashWork})`);
          
          // เปลี่ยน dayType จาก "stop" เป็น "work" สำหรับวันที่มีงาน
          if (record.dayType === "stop") {
            console.log(`🔄 [specialWorkplaceUtils] เปลี่ยน dayType จาก "stop" เป็น "work"`);
            record.dayType = "work";
          }
          
          // คำนวณ cashWork ใหม่โดยใช้ workRate (per day) สำหรับหน่วยงานพิเศษ
          const workRate = parseFloat(workplace.workRate || '0');
          const recalculatedCashWork = workRate; // ใช้ workRate เป็นค่าต่อวัน ไม่คูณด้วยชั่วโมง
          
          console.log(`🔄 [specialWorkplaceUtils] คำนวณ cashWork ใหม่สำหรับหน่วยงานพิเศษ: workRate = ${workRate} (per day)`);
          record.cashWork = recalculatedCashWork.toFixed(2);
          
          // สำหรับวันทำงานปกติใน special workplace ให้ใช้ multiplier = 1
          if (record.cashWorkMul === "2") {
            console.log(`🔄 [specialWorkplaceUtils] เปลี่ยน cashWorkMul จาก "2" เป็น "1" สำหรับวันทำงานปกติ`);
            record.cashWorkMul = "1";
          }
          
          console.log(`✅ [specialWorkplaceUtils] อัพเดตแล้ว - dayType: ${record.dayType}, cashWork: ${record.cashWork}, cashWorkMul: ${record.cashWorkMul}`);
        } else {
          console.log(`⚪ [specialWorkplaceUtils] วันที่ ${record.date}: ไม่มีงาน (totalTime: ${totalTime}, cashWork: ${cashWork})`);
        }
      } else {
        console.log(`⚫ [specialWorkplaceUtils] หน่วยงานปกติ (workOfWeek: ${workplace.workOfWeek}) - ไม่ต้องปรับปรุง`);
      }

      // คำนวณค่าต่างๆ สำหรับ addSalary
      const addSalaryDaily = [];
      
      if (addSalary && addSalary.length > 0) {
        for (const item of addSalary) {
          const itemMonth = parseInt(item.month);
          const itemYear = parseInt(item.year);
          const currentMonth = parseInt(adjustedMonth);
          const currentYear = parseInt(adjustedYear);

          if (itemMonth === currentMonth && itemYear === currentYear) {
            const itemDayType = item.dayType === "0" ? "work" : "stop";
            const recordDayType = record.dayType;

            if (itemDayType === recordDayType) {
              const amount = parseFloat(item.amount || '0');
              const addSalaryPerDay = amount / 30;
              
              addSalaryDaily.push({
                topic: item.topic,
                amount: addSalaryPerDay.toFixed(2),
                dayType: itemDayType
              });
            }
          }
        }
      }

      return {
        ...record,
        addSalaryDaily,
      };
    })
  );
};

// Helper function สำหรับแปลงเวลาเป็นทศนิยม
const timeToDecimal = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};

// Helper function สำหรับแปลงวันที่เป็น Bangkok timezone
const toBangkokDate = (date) => {
  return new Date(date.getTime() + (7 * 60 * 60 * 1000));
};

// Helper function สำหรับดึงข้อมูลพนักงาน
const getEmployeeProfile = async (employeeId) => {
  try {
    const searchEmp = {
      employeeId: employeeId,
      name: '',
      idCard: '',
      workPlace: ''
    };
    const responseEmp = await axios.post(sURL + '/employee/search', searchEmp);
    return responseEmp.data?.employees || [];
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return [];
  }
};

module.exports = {
  calculateCashValuesForSpecialWorkplace,
  timeToDecimal,
  toBangkokDate,
  getEmployeeProfile
};
