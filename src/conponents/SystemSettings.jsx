import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './editwindowcss.css';

// Custom Styles
const customStyles = `
  <style>
    .stats-card {
      background: linear-gradient(135deg, rgb(43,93,142) 0%, rgb(33,73,112) 100%);
      border-radius: 15px;
      padding: 25px;
      color: white;
      box-shadow: 0 10px 30px rgba(43,93,142,0.2);
      margin-bottom: 30px;g
      animation: fadeInUp 0.5s ease;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .stat-item {
      background: rgba(255,255,255,0.2);
      padding: 15px;
      border-radius: 10px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.95;
    }
    
    .workplace-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(43,93,142,0.1);
      transition: all 0.3s ease;
      animation: fadeInUp 0.5s ease;
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .workplace-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(43,93,142,0.2);
    }
    
    .workplace-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(43,93,142,0.15);
    }
    
    .workplace-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .workplace-id-badge {
      background: linear-gradient(135deg, rgb(43,93,142) 0%, rgb(33,73,112) 100%);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .workplace-name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
    
    .employee-count-badge {
      background: rgb(43,93,142);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 1rem;
    }
    
    .info-section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: bold;
      color: #555;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-title i {
      color: rgb(43,93,142);
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .info-item {
      background: #F5F5F5;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid rgb(43,93,142);
    }
    
    .info-label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 5px;
    }
    
    .info-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }
    
    .salary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      background: white;
    }
    
    .salary-table th {
      background: rgb(43,93,142);
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    .salary-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(43,93,142,0.1);
    }
    
    .salary-table tr:hover {
      background: rgba(43,93,142,0.05);
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .badge-daily {
      background: rgba(43,93,142,0.8);
      color: white;
    }
    
    .badge-monthly {
      background: rgb(43,93,142);
      color: white;
    }
    
    .badge-all {
      background: rgba(43,93,142,0.2);
      color: rgb(43,93,142);
      font-weight: bold;
    }
    
    .worktime-schedule {
      background: rgba(43,93,142,0.05);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .day-badge {
      background: rgb(43,93,142);
      color: white;
      padding: 5px 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .status-badge-work {
      background: #4CAF50;
      color: white;
      padding: 5px 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .status-badge-stop {
      background: #E0E0E0;
      color: #666;
      padding: 5px 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .shift-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    
    .holiday-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    
    .holiday-item {
      background: white;
      border: 2px solid rgb(43,93,142);
      padding: 8px 15px;
      border-radius: 8px;
      font-weight: 600;
      color: rgb(43,93,142);
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.3rem;
      border-color: rgb(43,93,142);
      border-right-color: transparent;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .filter-section {
      background: white;
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(43,93,142,0.08);
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .search-box {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .search-input {
      flex: 1;
      padding: 12px 20px;
      border: 2px solid rgba(43,93,142,0.2);
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: rgb(43,93,142);
      box-shadow: 0 0 0 0.2rem rgba(43,93,142,0.15);
    }
    
    .no-data {
      text-align: center;
      padding: 50px;
      color: #999;
      font-size: 1.2rem;
    }
  </style>
`;

function SystemSettings({ workplaceList }) {
  const [workplaces, setWorkplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    document.title = 'การตั้งค่าระบบ';
    
    // เพิ่ม custom styles
    const styleElement = document.createElement('div');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    if (workplaceList && workplaceList.length > 0) {
      fetchWorkplaceData();
    }
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [workplaceList]);

  const fetchWorkplaceData = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);
      
      console.log('📋 Fetching data for workplaces:', workplaceList.map(w => w.workplaceId));
      
      // เรียก API ทีละหน่วยงาน
      const promises = workplaceList.map(async (workplace, index) => {
        try {
          const response = await axios.get(`http://10.10.110.7:3000/workplace/${workplace.workplaceId}`);
          
          // อัพเดท progress
          setLoadingProgress(Math.round(((index + 1) / workplaceList.length) * 100));
          
          console.log(`✅ Loaded workplace ${workplace.workplaceId}:`, response.data);
          return response.data;
        } catch (error) {
          console.error(`❌ Error loading workplace ${workplace.workplaceId}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      
      // กรองข้อมูลที่ไม่ null
      const validWorkplaces = results.filter(wp => wp !== null);
      
      console.log('✅ All workplace data loaded:', validWorkplaces);
      
      setWorkplaces(validWorkplaces);
      
      // คำนวณจำนวนพนักงานทั้งหมด
      const total = validWorkplaces.reduce((sum, wp) => {
        return sum + (parseInt(wp.countEmployee) || 0);
      }, 0);
      setTotalEmployees(total);
      
    } catch (error) {
      console.error('❌ Error fetching workplace data:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลหน่วยงานได้',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  // กรองข้อมูลตาม search term
  const filteredWorkplaces = workplaces.filter(wp => 
    wp.workplaceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wp.workplaceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ตรวจสอบว่ามี workplaceList หรือไม่
  if (!workplaceList || workplaceList.length === 0) {
    return (
      <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="loading-container">
              <div style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h4 style={{ color: '#999' }}>
                กำลังโหลดข้อมูลหน่วยงาน...
              </h4>
              <p style={{ color: '#ccc', marginTop: '10px' }}>
                กรุณารอสักครู่
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format วันที่แบบไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="hold-transition sidebar-mini editlaout">
        <div className="wrapper">
          <div className="content-wrapper">
            <div className="loading-container">
              <div className="spinner-border" role="status"></div>
              <h4 style={{ marginTop: '20px', color: 'rgb(43,93,142)' }}>
                <i className="fas fa-sync-alt fa-spin"></i> กำลังโหลดข้อมูล...
              </h4>
              {loadingProgress > 0 && (
                <div style={{ width: '300px', marginTop: '20px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '20px', 
                    background: 'rgba(43,93,142,0.1)', 
                    borderRadius: '10px', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{
                      width: `${loadingProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgb(43,93,142) 0%, rgb(33,73,112) 100%)',
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {loadingProgress}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          
          {/* Breadcrumb */}
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <Link to="/">หน้าหลัก</Link>
            </li>
            <li className="breadcrumb-item active">การตั้งค่าระบบ</li>
          </ol>

          {/* Header */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="fas fa-cog"></i> การตั้งค่าระบบ
                </h1>
              </div>
            </div>
          </div>

          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              
              {/* สถิติภาพรวม */}
              <div className="stats-card">
                <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-chart-line"></i> ภาพรวมระบบ
                </h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">
                      {workplaces.length}
                    </div>
                    <div className="stat-label">หน่วยงานทั้งหมด</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {totalEmployees}
                    </div>
                    <div className="stat-label">พนักงานทั้งหมด</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {workplaces.reduce((sum, wp) => sum + (wp.addSalary?.length || 0), 0)}
                    </div>
                    <div className="stat-label">รายการเงินเพิ่ม/หัก</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {workplaces.reduce((sum, wp) => sum + (wp.publicHoliday?.length || 0), 0)}
                    </div>
                    <div className="stat-label">วันหยุดนักขัตฤกษ์</div>
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className="filter-section">
                <div className="search-box">
                  <i className="fas fa-search" style={{ color: 'rgb(43,93,142)', fontSize: '1.2rem' }}></i>
                  <input 
                    type="text"
                    className="search-input"
                    placeholder="ค้นหาด้วยรหัสหน่วยงานหรือชื่อหน่วยงาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setSearchTerm('')}
                      style={{ borderRadius: '10px' }}
                    >
                      <i className="fas fa-times"></i> ล้าง
                    </button>
                  )}
                </div>
              </div>

              {/* รายการหน่วยงาน */}
              {filteredWorkplaces.length === 0 ? (
                <div className="no-data">
                  <i className="fas fa-inbox fa-3x" style={{ color: '#ccc', marginBottom: '20px' }}></i>
                  <p>ไม่พบข้อมูลหน่วยงาน</p>
                </div>
              ) : (
                filteredWorkplaces.map((workplace) => (
                  <div key={workplace._id} className="workplace-card">
                    
                    {/* Header */}
                    <div className="workplace-header">
                      <div className="workplace-title">
                        <span className="workplace-id-badge">
                          <i className="fas fa-building"></i> {workplace.workplaceId}
                        </span>
                        <span className="workplace-name">{workplace.workplaceName}</span>
                      </div>
                      <span className="employee-count-badge">
                        <i className="fas fa-users"></i> {workplace.countEmployee || 0} คน
                      </span>
                    </div>

                    {/* ข้อมูลการทำงาน */}
                    <div className="info-section">
                      <div className="section-title">
                        <i className="fas fa-briefcase"></i> ข้อมูลการทำงาน
                      </div>
                      <div className="info-grid">
                        <div className="info-item">
                          <div className="info-label">จำนวนวันทำงาน/สัปดาห์</div>
                          <div className="info-value">{workplace.workOfWeek || '-'} วัน</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">ชั่วโมงทำงาน/วัน</div>
                          <div className="info-value">{workplace.workOfHour || '-'} ชม.</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">ชั่วโมง OT</div>
                          <div className="info-value">{workplace.workOfOT || '-'} ชม.</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">อัตราค่าแรง/วัน</div>
                          <div className="info-value">{workplace.workRate || '-'} บาท</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">อัตรา OT</div>
                          <div className="info-value">{workplace.workRateOT || '-'} เท่า</div>
                        </div>
                      </div>
                    </div>

                    {/* ข้อมูลวันหยุด */}
                    <div className="info-section">
                      <div className="section-title">
                        <i className="fas fa-calendar-times"></i> ข้อมูลวันหยุด
                      </div>
                      <div className="info-grid">
                        <div className="info-item">
                          <div className="info-label">อัตราวันหยุด</div>
                          <div className="info-value">{workplace.dayoffRate || '-'} บาท</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">อัตรา OT วันหยุด</div>
                          <div className="info-value">{workplace.dayoffRateOT || '-'} เท่า</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">ชั่วโมงวันหยุด</div>
                          <div className="info-value">{workplace.dayoffRateHour || '-'} ชม.</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">อัตรานักขัตฤกษ์</div>
                          <div className="info-value">{workplace.holiday || '-'} เท่า</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">อัตรา OT นักขัตฤกษ์</div>
                          <div className="info-value">{workplace.holidayOT || '-'} เท่า</div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">ชั่วโมงนักขัตฤกษ์</div>
                          <div className="info-value">{parseFloat(workplace.holidayHour || 0).toFixed(2)} ชม.</div>
                        </div>
                      </div>
                    </div>

                    {/* รายการเงินเพิ่ม/หัก */}
                    {workplace.addSalary && workplace.addSalary.length > 0 && (
                      <div className="info-section">
                        <div className="section-title">
                          <i className="fas fa-money-bill-wave"></i> รายการเงินเพิ่ม/หัก
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                          <table className="salary-table">
                            <thead>
                              <tr>
                                <th>ชื่อรายการ</th>
                                <th>รหัส</th>
                                <th>จำนวนเงิน</th>
                                <th>ประเภท</th>
                                <th>ใช้กับ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workplace.addSalary
                                .filter(salary => salary.name) // กรองเฉพาะที่มีชื่อ
                                .map((salary, idx) => (
                                <tr key={idx}>
                                  <td>{salary.name}</td>
                                  <td><strong>{salary.codeSpSalary}</strong></td>
                                  <td>{salary.SpSalary ? `${salary.SpSalary} บาท` : '-'}</td>
                                  <td>
                                    {salary.roundOfSalary === 'daily' && <span className="badge badge-daily">รายวัน</span>}
                                    {salary.roundOfSalary === 'monthly' && <span className="badge badge-monthly">รายเดือน</span>}
                                    {!salary.roundOfSalary && '-'}
                                  </td>
                                  <td>
                                    {salary.StaffType === 'all' ? <span className="badge badge-all">ทุกคน</span> : (salary.nameType || '-')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ตารางเวลาทำงาน */}
                    {workplace.workTimeDay && workplace.workTimeDay.length > 0 && (
                      <div className="info-section">
                        <div className="section-title">
                          <i className="fas fa-clock"></i> ตารางเวลาทำงาน
                        </div>
                        {workplace.workTimeDay.map((schedule, idx) => (
                          <div key={idx} className="worktime-schedule">
                            <div className="schedule-header">
                              <span className="day-badge">
                                {schedule.startDay} {schedule.startDay !== schedule.endDay && `- ${schedule.endDay}`}
                              </span>
                              <span className={schedule.workOrStop === 'work' ? 'status-badge-work' : 'status-badge-stop'}>
                                {schedule.workOrStop === 'work' ? 'วันทำงาน' : 'วันหยุด'}
                              </span>
                            </div>
                            {schedule.workOrStop === 'work' && schedule.allTimes && schedule.allTimes.length > 0 && (
                              <div className="shift-info">
                                {schedule.allTimes
                                  .filter(time => time.shift) // แสดงเฉพาะที่มีกะ
                                  .map((time, timeIdx) => (
                                  <div key={timeIdx} className="info-item">
                                    <div className="info-label">{time.shift}</div>
                                    <div className="info-value" style={{ fontSize: '0.95rem' }}>
                                      {time.startTime} - {time.endTime}
                                      {time.resultTime && <div style={{ fontSize: '0.8rem', color: '#666' }}>({time.resultTime} ชม.)</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* วันหยุดประจำสัปดาห์ */}
                    {workplace.dayoffWorkplace && workplace.dayoffWorkplace.length > 0 && (
                      <div className="info-section">
                        <div className="section-title">
                          <i className="fas fa-calendar-check"></i> วันหยุดประจำสัปดาห์
                        </div>
                        <div className="holiday-list">
                          {workplace.dayoffWorkplace.map((day, idx) => (
                            <div key={idx} className="holiday-item">
                              {formatThaiDate(day)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* วันหยุดนักขัตฤกษ์ */}
                    {workplace.publicHoliday && workplace.publicHoliday.length > 0 && (
                      <div className="info-section">
                        <div className="section-title">
                          <i className="fas fa-star"></i> วันหยุดนักขัตฤกษ์
                        </div>
                        <div className="holiday-list">
                          {workplace.publicHoliday.map((holiday, idx) => (
                            <div key={idx} className="holiday-item">
                              {formatThaiDate(holiday.date)}
                              {holiday.note && <div style={{ fontSize: '0.8rem', marginTop: '3px' }}>{holiday.note}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ข้อมูลอัตราค่าแรงใหม่ */}
                    {workplace.workRateChange && (
                      <div className="info-section">
                        <div className="section-title">
                          <i className="fas fa-exchange-alt"></i> การเปลี่ยนแปลงอัตราค่าแรง
                        </div>
                        <div className="info-grid">
                          <div className="info-item">
                            <div className="info-label">วันที่มีผล</div>
                            <div className="info-value">{formatThaiDate(workplace.workRateEffectiveDate)}</div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">อัตราใหม่</div>
                            <div className="info-value">{workplace.newWorkRate || '-'} บาท</div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
