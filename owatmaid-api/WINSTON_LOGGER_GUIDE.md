# 📝 Winston Logger Usage Guide

## 🎯 Overview
Winston logger ได้ถูกติดตั้งและกำหนดค่าแล้วเพื่อแทนที่ `console.log` ทั้งหมด ช่วยเพิ่มประสิทธิภาพและควบคุม logging ได้ดีขึ้น

---

## 🚀 Quick Start

### Import Logger
```javascript
const logger = require('../utils/logger');
```

### Basic Usage
```javascript
// แทนที่ console.log ด้วย
logger.debug('Debug message');  // สำหรับ development
logger.info('Info message');    // ข้อมูลทั่วไป
logger.warn('Warning message'); // คำเตือน
logger.error('Error message');  // ข้อผิดพลาด

// แทนที่ console.error ด้วย
logger.error('Error occurred', { error: error.message, stack: error.stack });
```

---

## 📊 Log Levels

| Level | Production | Development | Use Case |
|-------|-----------|-------------|----------|
| `error` | ✅ Show | ✅ Show | ข้อผิดพลาดที่ต้องแก้ไข |
| `warn` | ✅ Show | ✅ Show | คำเตือน |
| `info` | ✅ Show | ✅ Show | ข้อมูลทั่วไป |
| `debug` | ❌ Hidden | ✅ Show | ข้อมูล debug สำหรับ dev |

---

## 🏢 Accounting Helper Methods

Logger มี helper methods พิเศษสำหรับ accounting module:

```javascript
// เริ่มต้น API call
logger.accounting.start('searchtimerecordemployee', { 
  workplaceId: '1001', 
  year: '2025', 
  month: '11' 
});

// Log workplace operations
logger.accounting.workplace('Processing workplace 1001', { 
  employeeCount: 23 
});

// Log employee operations
logger.accounting.employee('Calculating salary', { 
  employeeId: '1001',
  name: 'ทดสอบ ทด' 
});

// Log welfare operations
logger.accounting.welfare('Processing welfare', { 
  welfareId: '1410',
  amount: 5000 
});

// Log sync operations
logger.accounting.sync('Syncing addSalary list', { 
  totalItems: 15 
});

// Log conclude operations
logger.accounting.conclude('Concluding records', { 
  recordCount: 23 
});

// Success message
logger.accounting.success('searchtimerecordemployee', { 
  recordsProcessed: 23,
  duration: '2.5s' 
});

// Error message
logger.accounting.error('searchtimerecordemployee', error);
```

---

## ⚙️ Configuration (.env)

```env
# Development Mode - แสดง debug logs ทั้งหมด
NODE_ENV=development
LOG_LEVEL=debug

# Production Mode - ซ่อน debug logs
NODE_ENV=production
LOG_LEVEL=info
```

---

## 📁 Log Files

Log files จะถูกสร้างอัตโนมัติใน `/logs/` directory:

| File | Content | Retention |
|------|---------|-----------|
| `combined-YYYY-MM-DD.log` | All logs | 7 days |
| `error-YYYY-MM-DD.log` | Error logs only | 14 days |
| `debug-YYYY-MM-DD.log` | Debug logs (dev only) | 3 days |
| `exceptions.log` | Uncaught exceptions | Permanent |
| `rejections.log` | Unhandled promise rejections | Permanent |

**Features:**
- ✅ Auto rotation ทุกวัน
- ✅ Auto delete logs เก่าตามเวลาที่กำหนด
- ✅ Max file size: 20MB per file
- ✅ JSON format สำหรับ analysis

---

## 🔍 View Logs

### Terminal
```bash
# ดู combined logs
cat logs/combined-2025-12-05.log | jq

# ดู error logs
cat logs/error-2025-12-05.log | jq

# ดู debug logs
cat logs/debug-2025-12-05.log | jq

# Real-time monitoring
tail -f logs/combined-2025-12-05.log
```

### JSON Output Example
```json
{
  "level": "info",
  "message": "✅ [ACCOUNTING] Success searchtimerecordemployee",
  "recordsProcessed": 23,
  "duration": "2.5s",
  "timestamp": "2025-12-05 22:14:10"
}
```

---

## 🔄 Migration from console.log

### ❌ Before (console.log)
```javascript
console.log('Processing employee:', employeeId);
console.log('Workplace data:', workplaceData);
console.error('Error:', error);
```

### ✅ After (Winston)
```javascript
logger.debug('Processing employee', { employeeId });
logger.debug('Workplace data', { workplaceData });
logger.error('Error occurred', { error: error.message, stack: error.stack });

// หรือใช้ helper
logger.accounting.employee('Processing employee', { employeeId });
logger.accounting.workplace('Workplace data', { workplaceData });
logger.accounting.error('searchtimerecordemployee', error);
```

---

## 📈 Performance Benefits

### Console.log Issues
- ❌ Blocks event loop (synchronous)
- ❌ ไม่มี log levels
- ❌ ไม่มี log rotation
- ❌ ยาก search/filter
- ❌ ท่วม terminal ใน production

### Winston Benefits
- ✅ Async (non-blocking)
- ✅ มี log levels (debug/info/warn/error)
- ✅ Auto file rotation
- ✅ JSON format - ง่ายต่อการ search
- ✅ ควบคุม output ได้ (dev vs production)
- ✅ Performance ดีกว่ามาก

---

## 🧪 Testing

```bash
# Run test
cd /Users/Macbook/fdOwat/owatmaid-api
node test-logger.js

# Check logs created
ls -lh logs/
```

---

## 🛠️ Troubleshooting

### ปัญหา: Log ไม่แสดงใน console
**วิธีแก้:** ตรวจสอบ `.env` ว่า `NODE_ENV=development`

### ปัญหา: Log files ไม่ถูกสร้าง
**วิธีแก้:** ตรวจสอบว่า `/logs/` directory มีสิทธิ์ write

### ปัญหา: Debug logs ไม่แสดง
**วิธีแก้:** ตั้งค่า `LOG_LEVEL=debug` ใน `.env`

---

## 📚 Best Practices

1. **ใช้ log levels ที่เหมาะสม:**
   - `debug` - ข้อมูลสำหรับ development
   - `info` - ข้อมูลทั่วไป (API success, user actions)
   - `warn` - คำเตือน (deprecated features, slow queries)
   - `error` - ข้อผิดพลาด (crashes, exceptions)

2. **แนบ metadata:**
   ```javascript
   // ❌ Bad
   logger.info('Processing employee');
   
   // ✅ Good
   logger.info('Processing employee', { employeeId: '1001', workplace: '1001' });
   ```

3. **ใช้ helper methods:**
   ```javascript
   // แทนที่จะเขียนเอง
   logger.debug('🏢 [WORKPLACE] Processing workplace', { workplaceId });
   
   // ใช้ helper
   logger.accounting.workplace('Processing workplace', { workplaceId });
   ```

4. **Error logging:**
   ```javascript
   try {
     // code
   } catch (error) {
     logger.error('Failed to process', { 
       error: error.message, 
       stack: error.stack,
       context: { employeeId, workplaceId }
     });
   }
   ```

---

## 🔒 Security Notes

- ❗ **ห้ามใส่ข้อมูลส่วนตัวใน logs** (passwords, tokens, credit cards)
- ✅ Log files ถูกเพิ่มใน `.gitignore` แล้ว
- ✅ `.env` ถูกเพิ่มใน `.gitignore` แล้ว

---

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ `/logs/error-*.log`
2. ตรวจสอบ `/logs/exceptions.log`
3. ตรวจสอบ `.env` configuration

---

**Created:** December 5, 2025  
**Version:** 1.0.0
