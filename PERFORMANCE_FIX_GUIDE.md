# 🚀 Performance Optimization - Quick Start Guide

## ✅ การแก้ไขที่ทำไปแล้ว

### 1. Frontend (React)
- ✅ **src/App.jsx**: ลบ double state update ที่ทำให้ re-render 2 ครั้ง
  - เปลี่ยนจาก `setWorkplaceList([])` + `setTimeout` → `setWorkplaceList(sortedData)` ครั้งเดียว

### 2. Backend API (Node.js)
- ✅ **owatmaid-api/routes/conclude.js**: เพิ่ม safety check ใน date loops (3 จุด)
  - ป้องกัน infinite loop ด้วย max iterations = 400 วัน
  - Lines: 1548, 1596, 2037

- ✅ **owatmaid-api/routes/timerecords.js**: แก้ N+1 query problem
  - เปลี่ยนจาก query ทีละ record → batch query + bulkWrite
  - ลด query time จาก O(n) → O(1) + O(n/100)

### 3. Database
- ✅ สร้าง script สำหรับเพิ่ม indexes: `scripts/add_database_indexes.js`

---

## 📝 ขั้นตอนถัดไป

### 1. ติดตั้ง Database Indexes (สำคัญมาก!)

```bash
cd /home/owatmaid/reactOwat/owatmaid-api
node scripts/add_database_indexes.js
```

**ผลลัพธ์ที่คาดหวัง:**
- Query เร็วขึ้น 5-10 เท่า
- CPU ลดลง 30-40%

### 2. Restart Application

```bash
# หยุด server เดิม
pm2 stop owatmaid-api

# Start ใหม่
pm2 start owatmaid-api
pm2 save

# ดู logs
pm2 logs owatmaid-api
```

### 3. Monitor Performance

```bash
# ดู CPU/Memory real-time
pm2 monit

# หรือใช้ clinic.js อีกรอบ
cd /home/owatmaid/reactOwat
clinic doctor -- node owatmaid-api/app.js
```

---

## 📊 ผลลัพธ์ที่คาดหวัง

### ก่อนแก้ไข
- CPU: 72-90%
- Response time: 2-5 วินาที
- Memory: สูง

### หลังแก้ไข
- CPU: 30-50% ⬇️ **ลด 40-50%**
- Response time: 0.5-1 วินาที ⬇️ **เร็วขึ้น 4-5 เท่า**
- Memory: ปกติ ✅

---

## 🔧 Troubleshooting

### ถ้ายัง CPU สูงอยู่

1. **ตรวจสอบ Migration Endpoint**
   ```bash
   # ตรวจสอบว่า migration เสร็จหรือยัง
   curl http://localhost:3000/timerecord/migrate-typeofemployee
   ```
   - ถ้ายังไม่เสร็จ ให้รอ migration ทำงานเสร็จก่อน
   - หลังเสร็จแล้ว ไม่ควรเรียก endpoint นี้อีก

2. **ตรวจสอบ Database Connection Pool**
   - ตรวจสอบว่า MongoDB connections ไม่เกิน limit
   ```javascript
   // ใน config.js หรือ connection file
   mongoose.connect(connectionString, {
     maxPoolSize: 10, // เพิ่มบรรทัดนี้
     minPoolSize: 2
   });
   ```

3. **ตรวจสอบ Slow Queries**
   ```bash
   # เปิด MongoDB profiler
   mongo
   use <your_database_name>
   db.setProfilingLevel(1, { slowms: 100 })
   
   # ดู slow queries
   db.system.profile.find().limit(10).sort({ ts: -1 }).pretty()
   ```

---

## 📈 การ Monitor ต่อเนื่อง

### 1. ตั้งค่า PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. ใช้ MongoDB Atlas Monitoring (ถ้าใช้ Atlas)
- เข้า MongoDB Atlas Dashboard
- ดู Performance tab
- ตรวจสอบ slow queries

### 3. ติดตั้ง New Relic หรือ DataDog (แนะนำสำหรับ Production)

---

## ⚡ Performance Tips เพิ่มเติม

### 1. Enable Compression
```javascript
// ใน app.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Redis Cache (ในอนาคต)
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache workplace list (ไม่ค่อยเปลี่ยน)
router.get('/workplace/list', async (req, res) => {
  const cacheKey = 'workplace:list';
  
  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  // If not cached, query database
  const data = await Workplace.find();
  await client.setEx(cacheKey, 300, JSON.stringify(data)); // Cache 5 min
  res.json(data);
});
```

### 3. Pagination สำหรับ Large Data
```javascript
// แทนที่จะโหลดทั้งหมด
router.get('/timerecords/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  
  const data = await TimeRecord.find()
    .limit(limit)
    .skip(skip);
  
  res.json({ data, page, limit });
});
```

---

## 📞 ติดต่อ

หากยังมีปัญหา หรือต้องการปรับแต่งเพิ่มเติม:
1. ดู logs: `pm2 logs owatmaid-api`
2. ดู error report ที่ `CPU_PERFORMANCE_ISSUES.md`
3. Run clinic.js อีกครั้ง เพื่อเปรียบเทียบผลลัพธ์

---

**Created:** October 30, 2025  
**Updated:** October 30, 2025  
**Status:** ✅ Ready to Deploy
