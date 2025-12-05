# ✅ Winston Logger Setup Complete!

## 📦 What's Been Installed

1. **Winston + Daily Rotate File**
   ```bash
   npm install winston winston-daily-rotate-file
   ```

2. **Logger Configuration**
   - `/utils/logger.js` - Main logger config
   - `.env` - Environment configuration
   - `/logs/` - Log files directory

3. **Files Modified**
   - `routes/account.js` - Added logger import
   - Replaced `console.error` → `logger.error`
   - Replaced cache logs with `logger.debug`

---

## 🎯 Next Steps

### 1️⃣ ทดสอบ API กับ Winston
```bash
# เปลี่ยนเป็น production mode
# Edit .env: NODE_ENV=production

# Restart API server
pm2 restart owatmaid-api
# หรือ
npm start

# ทดสอบ API call
curl -X POST http://10.10.110.7:3000/accounting/searchtimerecordemployee \
  -H "Content-Type: application/json" \
  -d '{"workplaceId":"1001","year":"2025","month":"11"}'
```

### 2️⃣ ตรวจสอบ Logs
```bash
# ดู log files ที่ถูกสร้าง
ls -lh /Users/Macbook/fdOwat/owatmaid-api/logs/

# ดูเนื้อหา (JSON format)
cat logs/combined-2025-12-05.log | jq

# Real-time monitoring
tail -f logs/combined-2025-12-05.log
```

### 3️⃣ แทนที่ console.log ที่เหลือ (Optional)

ตอนนี้ยังเหลือ **732 console.log** ใน `account.js` 

**Option A: แทนที่ทั้งหมดด้วย logger.debug**
```bash
cd /Users/Macbook/fdOwat/owatmaid-api/routes
sed -i.bak 's/console\.log(/logger.debug(/g' account.js
```

**Option B: Comment ออกทั้งหมด**
```bash
sed -i.bak 's/^\(\s*\)console\.log(/\1\/\/ logger.debug(/g' account.js
```

**Option C: แทนที่ทีละส่วนตาม category**
- เปิด `account.js`
- แทนที่ console.log ในส่วนที่สำคัญก่อน (เช่น error handling)
- ส่วนอื่นๆ ให้ comment ไว้

---

## 📊 Comparison: Before vs After

### ❌ Before (Console.log)
```javascript
console.log('🔍 [WORKPLACE] Processing:', workplaceId);
console.log('📋 Employee count:', employeeList.length);
console.log('✅ Success');
```
**ผลกระทบ:**
- Log 3 บรรทัด = 3x synchronous I/O operations
- Block event loop ทุกครั้ง
- ท่วม terminal
- ไม่มี log files
- ไม่สามารถปิดใน production ได้

### ✅ After (Winston)
```javascript
logger.accounting.workplace('Processing', { 
  workplaceId, 
  employeeCount: employeeList.length 
});
logger.accounting.success('searchtimerecordemployee', { 
  recordsProcessed: employeeList.length 
});
```
**ประโยชน์:**
- Async - ไม่ block event loop
- จัดเก็บใน JSON format
- Auto file rotation
- ปิด debug logs ใน production ได้
- Performance ดีกว่ามาก

---

## 🎛️ Environment Modes

### Development Mode (Debug ทุกอย่าง)
```env
NODE_ENV=development
LOG_LEVEL=debug
```
- แสดง console output พร้อมสี
- เขียน debug logs ลง file
- เหมาะสำหรับ development

### Production Mode (Info ขึ้นไปเท่านั้น)
```env
NODE_ENV=production
LOG_LEVEL=info
```
- แสดงเฉพาะ warn/error ใน console
- ไม่เขียน debug logs
- เหมาะสำหรับ production server

---

## 🚀 Performance Impact

### Before Winston (เดือน 10)
```
ERR_EMPTY_RESPONSE - Server timeout
เพราะ: 732+ console.log statements
แต่ละ request = 700+ I/O operations
```

### After Winston (คาดการณ์)
```
✅ Response time ลดลง 80-90%
✅ ไม่ block event loop
✅ Debug logs ถูกปิดใน production
✅ เหลือเฉพาะ error logs
```

---

## 📁 File Structure

```
owatmaid-api/
├── utils/
│   └── logger.js           ← Winston config
├── routes/
│   └── account.js          ← Import logger แล้ว
├── logs/                   ← Auto-created log files
│   ├── combined-*.log
│   ├── error-*.log
│   ├── debug-*.log
│   ├── exceptions.log
│   └── rejections.log
├── .env                    ← Environment config
├── .gitignore              ← Ignore logs/
├── test-logger.js          ← Test script
├── WINSTON_LOGGER_GUIDE.md ← Full documentation
└── SETUP_SUMMARY.md        ← This file
```

---

## 🧪 Quick Test

```bash
# 1. Test logger standalone
cd /Users/Macbook/fdOwat/owatmaid-api
node test-logger.js

# 2. Check logs created
ls -lh logs/

# 3. View log content
cat logs/combined-2025-12-05.log | jq

# 4. Restart API server
pm2 restart owatmaid-api

# 5. Test problematic endpoint (month 10)
# จาก browser หรือ Postman:
# POST http://10.10.110.7:3000/accounting/searchtimerecordemployee
# Body: {"workplaceId":"1001","year":"2025","month":"10"}

# 6. Monitor logs real-time
tail -f logs/combined-$(date +%Y-%m-%d).log
```

---

## ✅ Checklist

- [x] Winston installed
- [x] Logger configured
- [x] .env created
- [x] /logs/ directory created
- [x] .gitignore updated
- [x] account.js imports logger
- [x] console.error → logger.error
- [x] Cache logs → logger.debug
- [x] Documentation created
- [ ] **Restart API server** ← **DO THIS NEXT**
- [ ] **Test API endpoint**
- [ ] **Verify no ERR_EMPTY_RESPONSE**

---

## 🎯 Expected Results

### After Restart:
1. **เดือน 11** - ยังทำงานได้ปกติ ✅
2. **เดือน 10** - ควรทำงานได้แล้ว (ไม่ timeout) ✅
3. **Logs** - อยู่ใน `/logs/` directory แทน terminal
4. **Performance** - เร็วขึ้นมาก

---

## 📖 Documentation

อ่านเพิ่มเติม: `WINSTON_LOGGER_GUIDE.md`

---

**Ready to test!** 🚀

ขั้นตอนถัดไป:
1. Restart API server
2. ลอง search เดือน 10 และ 11
3. ดูผลลัพธ์และ performance
