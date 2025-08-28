const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const connectionString = require('../config');

// เชื่อมต่อ MongoDB (ใช้ connection ที่มีอยู่แล้ว)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// Schema สำหรับการอนุมัติ
const approvalDetailSchema = new mongoose.Schema({
  employeeId: String,
  employeeName: String,
  specialShiftAmount: { type: Number, default: 0 },
  otAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  workDays: { type: Number, default: 0 }
});

const workplaceApprovalSchema = new mongoose.Schema({
  workplaceId: { type: String, required: true },
  workplaceName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  approvedBy: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  totalEmployees: { type: Number, required: true },
  month: String,
  year: String,
  status: { type: String, enum: ['approved', 'cancelled'], default: 'approved' },
  employeeDetails: [approvalDetailSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// สร้าง compound index เพื่อป้องกันการอนุมัติซ้ำ
workplaceApprovalSchema.index({ workplaceId: 1, startDate: 1, endDate: 1 }, { unique: true });

const WorkplaceApproval = mongoose.model('WorkplaceApproval', workplaceApprovalSchema);

// API สำหรับบันทึกการอนุมัติ
router.post('/approve-special-shift', async (req, res) => {
  try {
    const {
      workplaceId,
      workplaceName,
      startDate,
      endDate,
      totalAmount,
      totalEmployees,
      approvedBy,
      month,
      year,
      employeeData
    } = req.body;
    
    // Validate required fields
    if (!workplaceId || !startDate || !endDate || !totalAmount || !totalEmployees || !approvedBy) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบข้อมูลที่ส่งมา'
      });
    }
    
    // ตรวจสอบว่ามีการอนุมัติแล้วหรือไม่
    const existingApproval = await WorkplaceApproval.findOne({
      workplaceId: workplaceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'approved'
    });
    
    if (existingApproval) {
      return res.status(409).json({
        success: false,
        message: 'ช่วงเวลานี้ได้รับการอนุมัติไปแล้ว',
        isAlreadyApproved: true,
        existingApproval: {
          id: existingApproval._id,
          approved_by: existingApproval.approvedBy,
          approved_at: existingApproval.approvedAt
        }
      });
    }
    
    // สร้างข้อมูลการอนุมัติใหม่
    const approvalData = {
      workplaceId,
      workplaceName: workplaceName || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      approvedBy,
      totalAmount: parseFloat(totalAmount),
      totalEmployees: parseInt(totalEmployees),
      month: month || '',
      year: year || '',
      employeeDetails: []
    };
    
    // เพิ่มรายละเอียดพนักงาน (ถ้ามีข้อมูล)
    if (employeeData && Array.isArray(employeeData) && employeeData.length > 0) {
      approvalData.employeeDetails = employeeData.map(employee => ({
        employeeId: employee.employeeId || '',
        employeeName: employee.employeeName || '',
        specialShiftAmount: parseFloat(employee.specialShiftAmount || 0),
        otAmount: parseFloat(employee.otAmount || 0),
        totalAmount: parseFloat(employee.totalAmount || 0),
        workDays: parseInt(employee.workDays || 0)
      }));
    }
    
    // บันทึกการอนุมัติ
    const newApproval = new WorkplaceApproval(approvalData);
    const savedApproval = await newApproval.save();
    
    res.json({
      success: true,
      message: 'บันทึกการอนุมัติเรียบร้อยแล้ว',
      approvalId: savedApproval._id,
      data: {
        workplaceId,
        workplaceName,
        startDate,
        endDate,
        approvedBy,
        totalAmount,
        totalEmployees
      }
    });
    
  } catch (error) {
    console.error('Error saving approval:', error);
    
    if (error.code === 11000) { // MongoDB duplicate key error
      res.status(409).json({
        success: false,
        message: 'ช่วงเวลานี้ได้รับการอนุมัติไปแล้ว',
        isAlreadyApproved: true
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกการอนุมัติ',
        error: error.message
      });
    }
  }
});

// API สำหรับตรวจสอบสถานะการอนุมัติ
router.post('/check-approval', async (req, res) => {
  try {
    const { workplaceId, startDate, endDate } = req.body;
    
    if (!workplaceId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ workplaceId, startDate และ endDate'
      });
    }
    
    const approval = await WorkplaceApproval.findOne({
      workplaceId: workplaceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'approved'
    });
    
    if (approval) {
      res.json({
        success: true,
        isApproved: true,
        approvalInfo: {
          id: approval._id,
          workplace_id: approval.workplaceId,
          workplace_name: approval.workplaceName,
          start_date: approval.startDate,
          end_date: approval.endDate,
          approved_by: approval.approvedBy,
          approved_at: approval.approvedAt,
          total_amount: approval.totalAmount,
          total_employees: approval.totalEmployees,
          month: approval.month,
          year: approval.year,
          status: approval.status,
          employeeDetails: approval.employeeDetails
        }
      });
    } else {
      res.json({
        success: true,
        isApproved: false,
        approvalInfo: null
      });
    }
    
  } catch (error) {
    console.error('Error checking approval:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะการอนุมัติ',
      error: error.message
    });
  }
});

// API สำหรับดึงรายการการอนุมัติทั้งหมด
router.get('/list-approvals', async (req, res) => {
  try {
    const { page = 1, limit = 20, workplaceId, month, year } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // สร้าง filter conditions
    let filter = { status: 'approved' };
    
    if (workplaceId) {
      filter.workplaceId = workplaceId;
    }
    
    if (month) {
      filter.month = month;
    }
    
    if (year) {
      filter.year = year;
    }
    
    // ดึงข้อมูลการอนุมัติ
    const approvals = await WorkplaceApproval
      .find(filter)
      .sort({ approvedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-employeeDetails'); // ไม่รวมรายละเอียดพนักงานในรายการ
    
    // นับจำนวนทั้งหมด
    const total = await WorkplaceApproval.countDocuments(filter);
    
    // แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ
    const formattedApprovals = approvals.map(approval => ({
      id: approval._id,
      workplace_id: approval.workplaceId,
      workplace_name: approval.workplaceName,
      start_date: approval.startDate,
      end_date: approval.endDate,
      approved_by: approval.approvedBy,
      approved_at: approval.approvedAt,
      total_amount: approval.totalAmount,
      total_employees: approval.totalEmployees,
      month: approval.month,
      year: approval.year,
      status: approval.status
    }));
    
    res.json({
      success: true,
      approvals: formattedApprovals,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total,
        total_pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการอนุมัติ',
      error: error.message
    });
  }
});

// API สำหรับยกเลิกการอนุมัติ (สำหรับ Admin เท่านั้น)
router.post('/cancel/:approvalId', async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { cancelledBy, reason } = req.body;
    
    if (!cancelledBy) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุผู้ยกเลิก'
      });
    }
    
    const approval = await WorkplaceApproval.findByIdAndUpdate(
      approvalId,
      { 
        status: 'cancelled',
        updatedAt: new Date(),
        cancelledBy: cancelledBy,
        cancelReason: reason || ''
      },
      { new: true }
    );
    
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลการอนุมัติ'
      });
    }
    
    res.json({
      success: true,
      message: 'ยกเลิกการอนุมัติเรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error cancelling approval:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยกเลิกการอนุมัติ',
      error: error.message
    });
  }
});

module.exports = router;
