const mongoose = require('mongoose');

// Define locked timerecord schema - สำหรับเก็บข้อมูลที่ถูก lock แล้ว
const lockedTimerecordSchema = new mongoose.Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  workplaceId: { type: String, required: true },
  lockedAt: { type: Date, default: Date.now }, // เวลาที่ทำการ lock
  lockedBy: { type: String }, // ผู้ที่ทำการ lock (optional)
  groupedResult: { type: Object, required: true }, // ข้อมูลที่ถูก lock ไว้
}, {
  timestamps: true // เพิ่ม createdAt และ updatedAt อัตโนมัติ
});

// สร้าง index เพื่อค้นหาได้เร็วขึ้น
lockedTimerecordSchema.index({ year: 1, month: 1, workplaceId: 1 });

const LockedTimerecord = mongoose.model('LockedTimerecord', lockedTimerecordSchema);

module.exports = LockedTimerecord;
