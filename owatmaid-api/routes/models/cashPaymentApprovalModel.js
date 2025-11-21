const mongoose = require('mongoose');

const cashPaymentApprovalSchema = new mongoose.Schema({
  // ข้อมูลช่วงเวลา
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  
  // ข้อมูลการอนุมัติ
  approvedBy: {
    type: String,
    required: true
  },
  approvedAt: {
    type: Date,
    default: Date.now
  },
  
  // สรุปยอดเงิน
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalDeduction: {
    type: Number,
    required: true,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true,
    default: 0
  },
  
  // รายการที่อนุมัติ
  items: [{
    workplaceId: {
      type: String,
      required: true
    },
    workplaceName: {
      type: String,
      required: true
    },
    employeeId: {
      type: String,
      required: true
    },
    employeeName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    totalCash: {
      type: Number,
      required: true
    },
    deduction: {
      type: Number,
      default: 0
    },
    netAmount: {
      type: Number,
      required: true
    },
    messageSalary: {
      type: String,
      default: ''
    }
  }],
  
  // สถานะ
  status: {
    type: String,
    enum: ['approved', 'paid', 'cancelled'],
    default: 'approved'
  },
  
  // หมายเหตุ
  note: {
    type: String,
    default: ''
  },
  
  // ข้อมูลเพิ่มเติม
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
cashPaymentApprovalSchema.index({ startDate: 1, endDate: 1 });
cashPaymentApprovalSchema.index({ approvedAt: -1 });
cashPaymentApprovalSchema.index({ status: 1 });
cashPaymentApprovalSchema.index({ 'items.workplaceId': 1 });

const CashPaymentApproval = mongoose.model('CashPaymentApproval', cashPaymentApprovalSchema, 'cashpaymentapprovals');

module.exports = CashPaymentApproval;
