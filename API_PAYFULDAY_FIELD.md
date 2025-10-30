# API Field Documentation: payFullDay

## สรุปการเพิ่ม Field payFullDay

### 📍 ตำแหน่งของข้อมูล
Field `payFullDay` จะถูกส่งไปใน **`employee_record`** array

---

## 🔹 API Endpoints ที่รับข้อมูล

### 1. สร้างข้อมูลใหม่ (Create)
```
POST /timerecord/createtimerecordemployee
```

### 2. อัพเดทข้อมูล (Update)
```
PUT /timerecord/updatetimerecordemployee/:id
```

---

## 📦 โครงสร้างข้อมูลที่ส่งไป

```json
{
  "year": "2024",
  "employeeId": "1001",
  "employeeName": "ชื่อพนักงาน",
  "month": "10",
  "employee_record": [
    {
      "tmpIndex": 0,
      "year": "2024",
      "workplaceId": "1001",
      "workplaceName": "หน่วยงาน A",
      "wGroup": "1",
      "date": "1",
      "shift": "morning_shift",
      "startTime": "08.00",
      "endTime": "14.00",
      "totalTime": "6",
      "totalOtTime": "0",
      "startOtTime": "",
      "endOtTime": "",
      "beforeTotalOtTime": "",
      "beforeStartOtTime": "",
      "beforeEndOtTime": "",
      "cashSalary": "",
      "specialtSalary": "",
      "specialtSalaryOT": "",
      "cashOfHoliday": "",
      "cashOfHolidayOt": "",
      "payFullDay": true,          // ⭐ Field ใหม่
      "messageSalary": ""
    }
  ],
  "specialShiftTotalSalary": "0"
}
```

---

## 🎯 Field ที่ต้องเพิ่มในหลังบ้าน

### Field Name: `payFullDay`

| Property | Value |
|----------|-------|
| **ชื่อ Field** | `payFullDay` |
| **ชนิดข้อมูล** | Boolean |
| **ค่า Default** | `false` |
| **ตำแหน่ง** | อยู่ใน `employee_record` array |
| **วัตถุประสงค์** | เก็บสถานะว่าพนักงานควรได้รับเงินเต็มวันหรือไม่ (แม้ว่าจะทำงานน้อยกว่า 8 ชั่วโมง) |

---

## 💾 Schema Definition (MongoDB/Mongoose)

```javascript
const timeRecordSchema = new mongoose.Schema({
  year: String,
  employeeId: String,
  employeeName: String,
  month: String,
  employee_record: [{
    tmpIndex: Number,
    year: String,
    workplaceId: String,
    workplaceName: String,
    wGroup: String,
    date: String,
    shift: String,
    startTime: String,
    endTime: String,
    totalTime: String,
    totalOtTime: String,
    startOtTime: String,
    endOtTime: String,
    beforeTotalOtTime: String,
    beforeStartOtTime: String,
    beforeEndOtTime: String,
    cashSalary: String,
    specialtSalary: String,
    specialtSalaryOT: String,
    cashOfHoliday: String,
    cashOfHolidayOt: String,
    payFullDay: { type: Boolean, default: false }, // ⭐ เพิ่ม field นี้
    messageSalary: String
  }],
  specialShiftTotalSalary: String
});
```

---

## 📝 ตัวอย่างการใช้งาน

### เมื่อไหร่ที่ `payFullDay` จะเป็น `true`?
- เมื่อพนักงานทำงานน้อยกว่า 8 ชั่วโมง และผู้ใช้เลือก checkbox "จ่ายเต็มวัน"

### ตัวอย่าง:
```javascript
{
  "date": "15",
  "startTime": "08.00",
  "endTime": "14.00",
  "totalTime": "6",        // ทำงาน 6 ชั่วโมง (น้อยกว่า 8)
  "payFullDay": true       // แต่จ่ายเต็มวัน
}
```

---

## 🔧 การนำไปใช้ในหลังบ้าน

### ตัวอย่างโค้ดใน API Handler

```javascript
router.post('/createtimerecordemployee', async (req, res) => {
  try {
    const { employee_record } = req.body;
    
    // ตัวอย่างการใช้งาน payFullDay
    employee_record.forEach(record => {
      const workHours = parseFloat(record.totalTime);
      
      if (record.payFullDay && workHours < 8) {
        // กรณีทำงานน้อยกว่า 8 ชั่วโมง แต่จ่ายเต็มวัน
        console.log(`วันที่ ${record.date}: ทำงาน ${workHours} ชม. แต่จ่ายเต็มวัน (8 ชม.)`);
        // คำนวณเงินเดือนแบบเต็ม 8 ชั่วโมง
      } else {
        // คำนวณเงินเดือนตามชั่วโมงจริง
        console.log(`วันที่ ${record.date}: ทำงาน ${workHours} ชม. จ่ายตามจริง`);
      }
    });
    
    // บันทึกข้อมูลลง database
    const timeRecord = new TimeRecord(req.body);
    await timeRecord.save();
    
    res.status(201).json({ success: true, data: timeRecord });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## ✅ Checklist สำหรับ Backend Developer

- [ ] เพิ่ม field `payFullDay` (Boolean) ใน Schema/Model
- [ ] ตั้งค่า default เป็น `false`
- [ ] รับค่า `payFullDay` จาก request body
- [ ] บันทึกค่า `payFullDay` ลง database
- [ ] ใช้ค่า `payFullDay` ในการคำนวณเงินเดือน (ถ้า `payFullDay = true` และ `totalTime < 8` ให้จ่ายเต็ม 8 ชั่วโมง)
- [ ] Test API ทั้ง Create และ Update

---

## 📌 หมายเหตุ
- Field นี้จะถูกส่งมาทุกครั้งที่มีการสร้างหรืออัพเดทข้อมูล timerecord
- ไม่จำเป็นต้องเพิ่ม field อื่นๆ นอกจาก `payFullDay`
- ข้อมูลอยู่ใน array `employee_record` ซึ่งแต่ละ object คือข้อมูล 1 วัน

---

**สร้างเมื่อ:** 25 ตุลาคม 2568  
**เวอร์ชัน:** 1.0
