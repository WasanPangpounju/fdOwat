import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../editwindowcss.css'; // CSS รวมของโปรเจกต์

function Dashboard() {
  useEffect(() => {
    document.title = 'แดชบอร์ด';
  }, []);

  // ฟังก์ชันปิดงวด - เคลียร์ addSalary และ deductSalary
  const closePeriod = async () => {
    try {
      // ยืนยันการกระทำด้วย SweetAlert2
      const result = await Swal.fire({
        title: 'ยืนยันการปิดงวด',
        text: 'คุณต้องการปิดงวด ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ปิดงวด!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        // แสดง loading
        Swal.fire({
          title: 'กำลังปิดงวด...',
          text: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // เรียก API เพื่อค้นหาข้อมูลพนักงาน ID 660075
        const response = await axios.post('http://10.10.110.7:3000/employee/search', {
          employeeId: "660075"
        });

        if (response.data && response.data.employees && response.data.employees.length > 0) {
          const employee = response.data.employees[0];
          
          // อัปเดตข้อมูลโดยเคลียร์ addSalary และ deductSalary
          const updateData = {
            ...employee,
            addSalary: [],
            deductSalary: []
          };

          // เรียก API เพื่ออัปเดตข้อมูล
          await axios.put(`http://10.10.110.7:3000/employee/update/${employee._id}`, updateData);
          
          // แสดงข้อความสำเร็จ
          await Swal.fire({
            title: 'ปิดงวดสำเร็จ!',
            text: 'เรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'ตกลง'
          });
          
          window.location.reload();
        } else {
          // แสดงข้อความไม่พบข้อมูล
          await Swal.fire({
            title: 'ไม่พบข้อมูล!',
            text: 'ไม่พบข้อมูลพนักงาน ID 660075',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'ตกลง'
          });
        }
      }
    } catch (error) {
      console.error('Error closing period:', error);
      
      // แสดงข้อความผิดพลาด
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'เกิดข้อผิดพลาดในการปิดงวด กรุณาลองใหม่อีกครั้ง',
        icon: 'error',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          
          {/* Breadcrumb */}
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <Link to="/">หน้าหลัก</Link>
            </li>
            <li className="breadcrumb-item active">แดชบอร์ด</li>
          </ol>

          {/* Header */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="far fa-arrow-alt-circle-right"></i> แดชบอร์ด
                </h1>
              </div>
            </div>
          </div>

          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="row gy-4">
                {dashboardItems.map((item, idx) => (
                  <DashboardButton key={idx} {...item} />
                ))}
                <div className='d-flex justify-content-center align-items-center col-12'>
                  <button 
                    onClick={closePeriod}
                    className="btn btn-danger">ปิดงวด</button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// รายการปุ่มในแดชบอร์ด
const dashboardItems = [
  { to: "/addsettimeauto", icon: "fas fa-business-time", text: "ระบบลงเวลาอัตโมมัติ", color: "#ff6c60" },
  { to: "/addEdit_Employee", icon: "fas fa-people-arrows", text: "เพิ่ม/ลบ พนักงาน", color: "#9DBAEA" },
  { to: "/addEdit_SalaryEmployee", icon: "fas fa-money-bill-wave", text: "เงินเพิ่ม/เงินหัก", color: "#A2B4D2" },
  { to: "/speacialshiftcash", icon: "fas fa-file-invoice-dollar", text: "ระบบเอกสารจ่ายสด", color: "#58c9f3" },
  { to: "#", icon: "fas fa-paste", text: "ระบบออกเอกสาร", color: "#41cac0" },
  { to: "#", icon: "fas fa-file-alt", text: "รายงานผู้บริหาร", color: "#8175c7" },
  { to: "/search", icon: "fas fa-network-wired", text: "จัดการพนักงาน", color: "#ffc107" },
  { to: "#", icon: "fas fa-cog", text: "การตั้งค่า", color: "#aebece" },
];


// Component ปุ่มแต่ละอัน
function DashboardButton({ to, icon, text, color, disabled }) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      Swal.fire({
        title: 'ปิดปรับปรุงชั่วคราว',
        text: 'ระบบนี้อยู่ระหว่างการปรับปรุง กรุณาลองใหม่อีกครั้งในภายหลัง',
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="col-6 col-md-3 mb-3 d-flex justify-content-center">
      <Link
        to={to}
        onClick={handleClick}
        className={`d-block text-white text-center rounded shadow-sm p-2 text-decoration-none h-100 ${disabled ? 'disabled-link' : ''}`}
        style={{
          background: disabled ? '#6c757d' : color,
          minHeight: '90px',
          maxWidth: '190px', // ✅ กว้างขึ้น
          width: '100%',
          fontSize: '1rem',
          lineHeight: 1.4,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <i className={`${icon} fa-2x mb-2 d-block`}></i>
        {text}
      </Link>
    </div>
  );
}

export default Dashboard;
