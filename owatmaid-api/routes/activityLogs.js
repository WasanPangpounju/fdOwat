const express = require('express');
const router = express.Router();
const ActivityLog = require('./models/activityLogModel');
const mongoose = require('mongoose');

/**
 * @route   POST /activity-logs
 * @desc    บันทึกกิจกรรมของผู้ใช้
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      username,
      action_type,
      page_path,
      page_name,
      activity_description,
      duration_seconds = 0,
      additional_data = null
    } = req.body;

    if (!user_id || !action_type || !page_path) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ user_id, action_type และ page_path'
      });
    }

    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('user-agent');
    const referrer = req.get('referer') || req.get('referrer');

    const activityLog = new ActivityLog({
      user_id,
      username,
      action_type,
      page_path,
      page_name,
      activity_description,
      duration_seconds,
      ip_address,
      user_agent,
      referrer,
      additional_data
    });

    await activityLog.save();

    res.json({
      success: true,
      message: 'บันทึกกิจกรรมสำเร็จ',
      data: {
        log_id: activityLog._id,
        user_id,
        action_type,
        page_path,
        timestamp: activityLog.createdAt
      }
    });

  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกกิจกรรม',
      error: error.message
    });
  }
});

/**
 * @route   PUT /activity-logs/:id/duration
 * @desc    อัพเดทระยะเวลา
 * @access  Private
 */
router.put('/:id/duration', async (req, res) => {
  try {
    const { id } = req.params;
    const { duration_seconds } = req.body;

    await ActivityLog.findByIdAndUpdate(id, { duration_seconds });

    res.json({
      success: true,
      message: 'อัพเดทระยะเวลาสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating duration:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

/**
 * @route   GET /activity-logs
 * @desc    ดึงรายการ activity logs
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const {
      user_id,
      action_type,
      page_path,
      start_date,
      end_date,
      limit = 100,
      offset = 0,
      order_by = 'createdAt',
      order_dir = 'DESC'
    } = req.query;

    let query = {};

    if (user_id) query.user_id = user_id;
    if (action_type) query.action_type = action_type;
    if (page_path) query.page_path = new RegExp(page_path, 'i');
    
    if (start_date || end_date) {
      query.createdAt = {};
      if (start_date) query.createdAt.$gte = new Date(start_date);
      if (end_date) query.createdAt.$lte = new Date(end_date);
    }

    const total = await ActivityLog.countDocuments(query);
    
    const sortOrder = order_dir === 'DESC' ? -1 : 1;
    const logs = await ActivityLog.find(query)
      .sort({ [order_by]: sortOrder })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

/**
 * @route   GET /activity-logs/user/:user_id
 * @desc    ดึงกิจกรรมของผู้ใช้
 * @access  Private
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 50 } = req.query;

    const logs = await ActivityLog.find({ user_id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

/**
 * @route   GET /activity-logs/stats/summary
 * @desc    สรุปสถิติการใช้งาน
 * @access  Private
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    let matchStage = {};
    if (start_date && end_date) {
      matchStage.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      };
    }
    if (user_id) {
      matchStage.user_id = user_id;
    }

    // สรุปตาม action type
    const actionStats = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$action_type',
          count: { $sum: 1 },
          total_duration: { $sum: '$duration_seconds' }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          action_type: '$_id',
          count: 1,
          total_duration: 1
        }
      }
    ]);

    // หน้าที่เข้าชมมากที่สุด
    const topPages = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { page_path: '$page_path', page_name: '$page_name' },
          visit_count: { $sum: 1 },
          total_duration: { $sum: '$duration_seconds' },
          avg_duration: { $avg: '$duration_seconds' }
        }
      },
      { $sort: { visit_count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          page_path: '$_id.page_path',
          page_name: '$_id.page_name',
          visit_count: 1,
          total_duration: 1,
          avg_duration: 1
        }
      }
    ]);

    // ผู้ใช้ที่ active มากที่สุด
    const topUsers = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { user_id: '$user_id', username: '$username' },
          activity_count: { $sum: 1 },
          total_duration: { $sum: '$duration_seconds' }
        }
      },
      { $sort: { activity_count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          user_id: '$_id.user_id',
          username: '$_id.username',
          activity_count: 1,
          total_duration: 1
        }
      }
    ]);

    // กิจกรรมรายชั่วโมง
    const hourlyActivity = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        action_statistics: actionStats,
        top_pages: topPages,
        top_users: topUsers,
        hourly_activity: hourlyActivity
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

/**
 * @route   GET /activity-logs/stats/daily
 * @desc    สรุปกิจกรรมรายวัน
 * @access  Private
 */
router.get('/stats/daily', async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const dailyStats = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total_activities: { $sum: 1 },
          unique_users: { $addToSet: '$user_id' },
          total_duration: { $sum: '$duration_seconds' }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total_activities: 1,
          unique_users: { $size: '$unique_users' },
          total_duration: 1
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json({
      success: true,
      data: dailyStats
    });

  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /activity-logs/old
 * @desc    ลบ logs เก่า
 * @access  Private (Admin)
 */
router.delete('/old', async (req, res) => {
  try {
    const { days = 90 } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: 'ลบ activity logs เก่าสำเร็จ',
      deleted_count: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: error.message
    });
  }
});

module.exports = router;
