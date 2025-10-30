// Test script สำหรับทดสอบฟีเจอร์เลือกเดือนให้สวัสดิการ

// ทดสอบการแปลงข้อมูลเดิมที่ไม่มีเดือน
const testAddSalary = [
  {
    codeSpSalary: "1535",
    name: "ค่าดินทาง",
    SpSalary: 35,
    roundOfSalary: "รายวัน",
    StaffType: "พี่หมด",
    nameType: "",
    // ไม่มี selectedMonth
  },
  {
    codeSpSalary: "1210", 
    name: "ค่าทอร์ซ",
    SpSalary: 20,
    roundOfSalary: "รายวัน",
    StaffType: "พี่หมด",
    nameType: "",
    selectedMonth: 6 // มีข้อมูลเดือนอยู่แล้ว
  }
];

// ฟังก์ชันจัดการข้อมูลเดิม
function processOldData(addSalaryData) {
  return addSalaryData.map(item => ({
    ...item,
    selectedMonth: item.selectedMonth || 1  // เซ็ตเป็นเดือน 1 ถ้าไม่มีข้อมูล
  }));
}

// ทดสอบ
console.log("ข้อมูลก่อนแก้ไข:", JSON.stringify(testAddSalary, null, 2));
const processedData = processOldData(testAddSalary);
console.log("ข้อมูลหลังแก้ไข:", JSON.stringify(processedData, null, 2));

// ทดสอบการแปลงเลขเดือนเป็นชื่อเดือน
const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                   'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

processedData.forEach(item => {
  const monthName = monthNames[item.selectedMonth - 1];
  console.log(`${item.name} - เดือน: ${monthName}`);
});
