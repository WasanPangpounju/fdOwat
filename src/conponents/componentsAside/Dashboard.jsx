import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../editwindowcss.css'; // CSS รวมของโปรเจกต์

function Dashboard() {
  useEffect(() => {
    document.title = 'แดชบอร์ด';
  }, []);

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
  { to: "/addsettime", icon: "fas fa-business-time", text: "ระบบลงเวลา", color: "#ff6c60" },
  { to: "/addEdit_Employee", icon: "fas fa-people-arrows", text: "เพิ่ม/ลบ พนักงาน", color: "#9DBAEA" },
  { to: "/addEdit_SalaryEmployee", icon: "fas fa-money-bill-wave", text: "เงินเพิ่ม/เงินหัก", color: "#A2B4D2" },
  { to: "#", icon: "fas fa-file-invoice-dollar", text: "ระบบเงินเดือน", color: "#58c9f3" },
  { to: "#", icon: "fas fa-paste", text: "ระบบออกเอกสาร", color: "#41cac0" },
  { to: "#", icon: "fas fa-file-alt", text: "รายงานผู้บริหาร", color: "#8175c7" },
  { to: "/search", icon: "fas fa-network-wired", text: "จัดการพนักงาน", color: "#ffc107" },
  { to: "#", icon: "fas fa-cog", text: "การตั้งค่า", color: "#aebece" }
];

// Component ปุ่มแต่ละอัน
function DashboardButton({ to, icon, text, color }) {
  return (
    <div className="col-6 col-md-3 mb-3 d-flex justify-content-center">
      <Link
        to={to}
        className="d-block text-white text-center rounded shadow-sm p-2 text-decoration-none h-100"
        style={{
          background: color,
          minHeight: '90px',
          maxWidth: '190px', // ✅ กว้างขึ้น
          width: '100%',
          fontSize: '1rem',
          lineHeight: 1.4,
        }}
      >
        <i className={`${icon} fa-2x mb-2 d-block`}></i>
        {text}
      </Link>
    </div>
  );
}

export default Dashboard;
