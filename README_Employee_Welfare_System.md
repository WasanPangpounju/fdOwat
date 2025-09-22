# Employee Welfare Management System - README

## ภาพรวมของระบบ

ระบบจัดการสวัสดิการพนักงานที่ได้รับการปรับปรุงใหม่ โดยใช้ Model Context Protocol (MCP) และโครงสร้างข้อมูลที่เป็นระเบียบมากขึ้น

## โครงสร้างข้อมูลใหม่

### EmployeeWelfare Model

```javascript
{
  employeeId: String,        // รหัสพนักงาน
  employeeName: String,      // ชื่อพนักงาน
  year: String,              // ปี (ค.ศ.)
  month: String,             // เดือน (01-12)
  createDate: String,        // วันที่สร้าง
  updateDate: String,        // วันที่อัปเดต
  createBy: String,          // ผู้สร้าง
  status: String,            // สถานะ (active, inactive, deleted)
  
  // รายการเงินเพิ่ม
  addList: [{
    id: String,              // ID ของรายการ
    name: String,            // ชื่อรายการ
    amount: Number,          // จำนวนเงิน
    roundOfSalary: String,   // รายวัน/รายเดือน (daily/monthly)
    staffType: String,       // ประเภทพนักงาน
    message: String,         // หมายเหตุ
    effectiveMonth: String,  // เดือนที่มีผล
    effectiveYear: String,   // ปีที่มีผล
    createdDate: String      // วันที่สร้างรายการ
  }],
  
  // รายการเงินหัก
  deductList: [{
    id: String,              // ID ของรายการ
    name: String,            // ชื่อรายการ
    amount: Number,          // จำนวนเงิน
    payType: String,         // การจ่าย (immediate/installment)
    installment: Number,     // จำนวนงวด
    installmentInfo: String, // ข้อมูลการผ่อน
    message: String,         // หมายเหตุ
    effectiveMonth: String,  // เดือนที่มีผล
    effectiveYear: String,   // ปีที่มีผล
    createdDate: String,     // วันที่สร้างรายการ
    
    // ตารางผ่อนชำระ
    installmentSchedule: [{
      month: String,         // เดือนที่ต้องจ่าย
      year: String,          // ปีที่ต้องจ่าย
      amountDue: Number,     // จำนวนเงินที่ต้องจ่าย
      status: String         // สถานะ (pending/paid/overdue)
    }]
  }]
}
```

## API Endpoints

### Employee Welfare Routes (`/employee-welfare`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list` | ได้ข้อมูลสวัสดิการทั้งหมด |
| GET | `/period/:year/:month` | ได้ข้อมูลสวัสดิการตามช่วงเวลา |
| GET | `/employee/:employeeId` | ได้ข้อมูลสวัสดิการตามรหัสพนักงาน |
| GET | `/:employeeId/:year/:month` | ได้ข้อมูลสวัสดิการเฉพาะ |
| POST | `/create` | สร้างหรืออัปเดตข้อมูลสวัสดิการ |
| POST | `/:employeeId/:year/:month/add-salary` | เพิ่มรายการเงินเพิ่ม |
| POST | `/:employeeId/:year/:month/add-deduct` | เพิ่มรายการเงินหัก |
| DELETE | `/:employeeId/:year/:month/remove-salary/:itemId` | ลบรายการเงินเพิ่ม |
| DELETE | `/:employeeId/:year/:month/remove-deduct/:itemId` | ลบรายการเงินหัก |
| PUT | `/update/:employeeId/:year/:month` | อัปเดตข้อมูลสวัสดิการ |
| DELETE | `/:employeeId/:year/:month` | ลบข้อมูลสวัสดิการ (soft delete) |
| GET | `/summary/:employeeId` | ได้สรุปสวัสดิการของพนักงาน |
| POST | `/search` | ค้นหาข้อมูลสวัสดิการ |

## การใช้งาน Frontend Service

### EmployeeWelfareService

```javascript
import employeeWelfareService from '../services/employeeWelfareService';

// ได้ข้อมูลสวัสดิการเฉพาะ
const welfareData = await employeeWelfareService.getSpecificWelfare(
  employeeId, 
  year, 
  month
);

// เพิ่มรายการเงินเพิ่ม
const salaryItem = {
  name: 'เงินเพิ่มพิเศษ',
  amount: 1000,
  roundOfSalary: 'monthly',
  staffType: 'all',
  message: 'เงินเพิ่มประจำเดือน'
};

await employeeWelfareService.addSalaryItem(
  employeeId, 
  year, 
  month, 
  salaryItem
);

// เพิ่มรายการเงินหัก
const deductItem = {
  name: 'เงินกู้',
  amount: 5000,
  payType: 'installment',
  installment: 5,
  message: 'เงินกู้ฉุกเฉิน'
};

await employeeWelfareService.addDeductItem(
  employeeId, 
  year, 
  month, 
  deductItem
);
```

## การทำงานของระบบใหม่

### 1. การจัดการข้อมูลตามเดือน

- ข้อมูลสวัสดิการจะถูกจัดเก็บแยกตามปี-เดือน
- เมื่อเลือกเดือนและกดเพิ่ม จะเพิ่มข้อมูลเฉพาะเดือนนั้นๆ
- ระบบจะสร้างข้อมูลใหม่หากยังไม่มีข้อมูลสำหรับเดือนที่เลือก

### 2. การผ่อนชำระ

- ระบบจะสร้างตารางผ่อนชำระอัตโนมัติเมื่อเลือกการผ่อนจ่าย
- คำนวณจำนวนเงินต่องวดและกำหนดการจ่ายแต่ละเดือน
- ติดตามสถานะการจ่ายเงินแต่ละงวด

### 3. การคำนวณและสรุป

- คำนวณยอดรวมเงินเพิ่มและเงินหัก
- แสดงยอดสุทธิ (เงินเพิ่ม - เงินหัก)
- สรุปข้อมูลสวัสดิการรายพนักงาน

## ความแตกต่างจากระบบเดิม

### ระบบเดิม
- เก็บข้อมูลแบบรวมทั้งหมด
- ไม่มีการจัดแยกตามเดือน
- ข้อมูลยุ่งเหยิงและซ้ำซ้อน

### ระบบใหม่
- จัดเก็บข้อมูลแยกตามปี-เดือน
- มีโครงสร้างข้อมูลที่ชัดเจน
- รองรับการผ่อนชำระอย่างเป็นระบบ
- มีการติดตามสถานะและประวัติ

## การติดตั้งและใช้งาน

### 1. Backend Setup

```bash
# ติดตั้ง dependencies
npm install

# เริ่มต้น server
npm start
```

### 2. Frontend Setup

```bash
# ติดตั้ง dependencies
npm install

# เริ่มต้น development server
npm run dev
```

### 3. Database Setup

ระบบใช้ MongoDB โดยจะสร้าง collection `employeewelfares` อัตโนมัติ

## ตัวอย่างการใช้งาน

### 1. เพิ่มเงินเพิ่มสำหรับพนักงาน

```javascript
// เลือกพนักงาน
handleClickResult(employee);

// เลือกเดือน-ปี
setGlobalSelectedMonth('03'); // มีนาคม
setGlobalSelectedYear('2024');

// กรอกข้อมูลเงินเพิ่ม
setAddSalaryName('เงินเพิ่มขยัน');
setAddSalary('1500');
setRoundOfSalary('monthly');

// กดเพิ่ม
handleAddSalaryItem();
```

### 2. เพิ่มเงินหักแบบผ่อนชำระ

```javascript
// กรอกข้อมูลเงินหัก
setMisnusName('เงินกู้ฉุกเฉิน');
setMinusSalary('10000');
setPayType('installment');
setInstallment('5'); // 5 งวด

// กดเพิ่ม
handleAddDeductItem();
```

## การบำรุงรักษาและการพัฒนาต่อ

### 1. การเพิ่มฟีเจอร์ใหม่

- เพิ่มระบบรายงาน
- เพิ่มระบบแจ้งเตือนการชำระเงิน
- เพิ่มระบบอนุมัติ

### 2. การปรับปรุงประสิทธิภาพ

- เพิ่ม caching
- ปรับปรุง database indexing
- เพิ่ม pagination

### 3. การรักษาความปลอดภัย

- เพิ่มระบบ authentication
- เพิ่มระบบ authorization
- เพิ่มระบบ audit logging

## การแก้ไขปัญหาที่อาจเกิดขึ้น

### 1. ข้อมูลไม่แสดง

```javascript
// ตรวจสอบการเชื่อมต่อ API
console.log('API Endpoint:', endpoint);

// ตรวจสอบ response
const data = await employeeWelfareService.getSpecificWelfare(
  employeeId, year, month
);
console.log('Welfare data:', data);
```

### 2. ข้อผิดพลาดในการบันทึก

```javascript
// ตรวจสอบข้อมูลก่อนส่ง
if (!employeeId || !name || !amount) {
  alert('กรุณากรอกข้อมูลให้ครบถ้วน');
  return;
}
```

### 3. ปัญหาการผ่อนชำระ

```javascript
// ตรวจสอบตารางผ่อนชำระ
const installmentSchedule = deductItem.installmentSchedule;
console.log('Installment schedule:', installmentSchedule);
```

## สรุป

ระบบจัดการสวัสดิการพนักงานใหม่นี้ได้รับการออกแบบให้มีโครงสร้างที่ชัดเจน ใช้งานง่าย และรองรับการขยายตัวในอนาคต โดยเน้นการจัดเก็บข้อมูลแยกตามช่วงเวลา และรองรับระบบการผ่อนชำระที่เป็นมาตรฐาน
