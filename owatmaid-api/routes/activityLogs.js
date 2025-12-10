const express = require('express');
const router = express.Router();
const db = require('../config');

/**
 * @route   POST /api/activity-logs
 * @desc    บันทึกกิจกรรมของผู้ใช้
 * @access  Private (ต้อง login)
 */
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      username,
      action_type, // view, create, update, delete, login, logout
      page_path,
      page_name,
      activity_description,
      duration_seconds = 0,
      additional_data = null
    } = req.body;

    // Validation
    if (!user_id || !action_type || !page_path) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ user_id, action_type และ page_path'
      });
    }

    // Get client info
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('user-agent');
    const referrer = req.get('referer') || req.get('referrer');

    const query = `
      INSERT INTO activity_logs 
      (user_id, username, action_type, page_path, page_name, 
       activity_description, duration_seconds, ip_address, user_agent, 
       referrer, additional_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
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
      additional_data ? JSON.stringify(additional_data) : null
    ];

    const [result] = await db.query(query, values);

    res.json({
      success: true,
      message: 'บันทึกกิจกรรมสำเร็จ',
      data: {
        log_id: result.insertId,
        user_id,
        action_type,
        page_path,
        timestamp: new Date()
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
 * @route   PUT /api/activity-logs/:id/duration
 * @desc    อัพเดทระยะเวลาที่ใช้ในหน้านั้น (เมื่อออกจากหน้า)
 * @access  Private
 */
router.put('/:id/duration', async (req, res) => {
  try {
    const { id } = req.params;
    const { duration_seconds } = req.body;

    const query = `
      UPDATE activity_logs 
      SET duration_seconds = ? 
      WHERE id = ?
    `;

    await db.query(query, [duration_seconds, id]);

    res.json({
      success: true,
      message: 'อัพเดทระยะเวลาสำเร็จ'
    });

  } catch (error) {
    console.error('Error updating duration:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทระยะเวลา',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/activity-logs
 * @desc    ดึงรายการ activity logs พร้อม filter
 * @access  Private (Admin)
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
      order_by = 'created_at',
      order_dir = 'DESC'
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Build WHERE clause
    if (user_id) {
      whereConditions.push('user_id = ?');
      queryParams.push(user_id);
    }
    if (action_type) {
      whereConditions.push('action_type = ?');
      queryParams.push(action_type);
    }
    if (page_path) {
      whereConditions.push('page_path LIKE ?');
      queryParams.push(`%${page_path}%`);
    }
    if (start_date) {
      whereConditions.push('created_at >= ?');
      queryParams.push(start_date);
    }
    if (end_date) {
      whereConditions.push('created_at <= ?');
      queryParams.push(end_date);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Count total records
    const countQuery = `SELECT COUNT(*) as total FROM activity_logs ${whereClause}`;
    const [[{ total }]] = await db.query(countQuery, queryParams);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM activity_logs 
      ${whereClause}
      ORDER BY ${order_by} ${order_dir}
      LIMIT ? OFFSET ?
    `;
    
    const [logs] = await db.query(dataQuery, [...queryParams, parseInt(limit), parseInt(offset)]);

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
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/activity-logs/user/:user_id
 * @desc    ดึงกิจกรรมของผู้ใช้คนใดคนหนึ่ง
 * @access  Private
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 50 } = req.query;

    const query = `
      SELECT * FROM activity_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const [logs] = await db.query(query, [user_id, parseInt(limit)]);

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/activity-logs/stats/summary
 * @desc    สรุปสถิติการใช้งาน
 * @access  Private (Admin)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    let whereClause = '';
    let queryParams = [];

    if (start_date && end_date) {
      whereClause = 'WHERE created_at BETWEEN ? AND ?';
      queryParams = [start_date, end_date];
    }
    if (user_id) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' user_id = ?';
      queryParams.push(user_id);
    }

    // สรุปตาม action type
    const actionStatsQuery = `
      SELECT 
        action_type,
        COUNT(*) as count,
        SUM(duration_seconds) as total_duration
      FROM activity_logs
      ${whereClause}
      GROUP BY action_type
      ORDER BY count DESC
    `;
    const [actionStats] = await db.query(actionStatsQuery, queryParams);

    // หน้าที่เข้าชมมากที่สุด
    const topPagesQuery = `
      SELECT 
        page_path,
        page_name,
        COUNT(*) as visit_count,
        AVG(duration_seconds) as avg_duration,
        SUM(duration_seconds) as total_duration
      FROM activity_logs
      ${whereClause}
      GROUP BY page_path, page_name
      ORDER BY visit_count DESC
      LIMIT 10
    `;
    const [topPages] = await db.query(topPagesQuery, queryParams);

    // ผู้ใช้ที่ active มากที่สุด
    const topUsersQuery = `
      SELECT 
        user_id,
        username,
        COUNT(*) as activity_count,
        SUM(duration_seconds) as total_duration
      FROM activity_logs
      ${whereClause}
      GROUP BY user_id, username
      ORDER BY activity_count DESC
      LIMIT 10
    `;
    const [topUsers] = await db.query(topUsersQuery, queryParams);

    // กิจกรรมรายชั่วโมง (24 ชั่วโมง)
    const hourlyActivityQuery = `
      SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as count
      FROM activity_logs
      ${whereClause}
      GROUP BY HOUR(created_at)
      ORDER BY hour
    `;
    const [hourlyActivity] = await db.query(hourlyActivityQuery, queryParams);

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
      message: 'เกิดข้อผิดพลาดในการดึงสถิติ',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/activity-logs/stats/daily
 * @desc    สรุปกิจกรรมรายวัน
 * @access  Private (Admin)
 */
router.get('/stats/daily', async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_activities,
        COUNT(DISTINCT user_id) as unique_users,
        SUM(duration_seconds) as total_duration
      FROM activity_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const [dailyStats] = await db.query(query, [parseInt(days)]);

    res.json({
      success: true,
      data: dailyStats
    });

  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงสถิติรายวัน',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/activity-logs/old
 * @desc    ลบ logs เก่าที่เกินกำหนด (cleanup)
 * @access  Private (Admin)
 */
router.delete('/old', async (req, res) => {
  try {
    const { days = 90 } = req.query; // default: ลบที่เก่ากว่า 90 วัน

    const query = `
      DELETE FROM activity_logs 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `;

    const [result] = await db.query(query, [parseInt(days)]);

    res.json({
      success: true,
      message: `ลบ activity logs เก่าสำเร็จ`,
      deleted_count: result.affectedRows
    });

  } catch (error) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
      error: error.message
    });
  }
});

module.exports = router;
