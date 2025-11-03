import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../editwindowcss.css'; // CSS รวมของโปรเจกต์

// เพิ่ม Custom CSS สำหรับ Animation
const customStyles = `
  <style>
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translate3d(0, -20px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    .animated-popup {
      animation: fadeInDown 0.3s ease-out;
    }
    
    .success-popup {
      animation: pulse 0.5s ease-in-out;
    }
    
    .secret-key-input {
      animation: fadeInDown 0.5s ease-out;
    }
    
    .spinner-border {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .btn-custom-confirm {
      font-weight: 600;
      padding: 10px 30px !important;
      border-radius: 8px !important;
    }
    
    .btn-custom-cancel {
      font-weight: 600;
      padding: 10px 30px !important;
      border-radius: 8px !important;
    }
  </style>
`;

function Dashboard() {
  useEffect(() => {
    document.title = 'แดชบอร์ด';
    
    // เพิ่ม custom styles
    const styleElement = document.createElement('div');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      // Cleanup
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  // ฟังก์ชันปิดงวด - Lock ข้อมูล timerecord ตามหน่วยงาน เดือน ปี
  const closePeriod = async () => {
    try {
      // ขั้นตอนที่ 1: ขอ Secret Key
      const { value: secretKey } = await Swal.fire({
        title: '🔐 ยืนยันตัวตน',
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🔑</div>
            <p style="font-size: 1.1rem; color: #555; margin-bottom: 20px;">
              กรุณาใส่รหัสลับเพื่อดำเนินการต่อ
            </p>
          </div>
        `,
        input: 'password',
        inputPlaceholder: 'ใส่รหัสลับ',
        inputAttributes: {
          maxlength: 4,
          autocapitalize: 'off',
          autocorrect: 'off',
          style: 'font-size: 1.2rem; text-align: center; letter-spacing: 0.5rem; font-weight: bold;'
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        customClass: {
          popup: 'animated-popup',
          input: 'secret-key-input'
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('กรุณาใส่รหัสลับ');
            return false;
          }
          if (value !== '1234') {
            Swal.showValidationMessage('🚫 รหัสลับไม่ถูกต้อง');
            return false;
          }
          return value;
        }
      });

      if (!secretKey) {
        return; // ผู้ใช้กดยกเลิกหรือรหัสผิด
      }

      // ขั้นตอนที่ 2: เปิด popup ให้กรอกข้อมูล
      const { value: formValues } = await Swal.fire({
        title: '🔒 Lock ข้อมูลรายงานเวลา',
        html: `
          <style>
            .form-group-custom {
              text-align: left;
              margin-bottom: 20px;
            }
            .form-label-custom {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              color: #333;
              font-size: 1rem;
            }
            .form-label-custom i {
              margin-right: 8px;
              color: #007bff;
            }
            .swal2-input-custom {
              width: 100% !important;
              padding: 12px !important;
              border: 2px solid #e0e0e0 !important;
              border-radius: 8px !important;
              font-size: 1rem !important;
              transition: all 0.3s ease !important;
            }
            .swal2-input-custom:focus {
              border-color: #007bff !important;
              box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25) !important;
              outline: none !important;
            }
            .info-badge {
              display: inline-block;
              background: #e3f2fd;
              color: #1976d2;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.85rem;
              margin-top: 5px;
            }
          </style>
          <div style="padding: 10px;">
            <div class="form-group-custom">
              <label for="swal-workplace" class="form-label-custom">
                <i class="fas fa-building"></i>หน่วยงาน
              </label>
              <input 
                id="swal-workplace" 
                class="swal2-input-custom" 
                placeholder="กรอกรหัสหน่วยงาน"
                style="margin: 0;">
              <div class="info-badge">
                <i class="fas fa-info-circle"></i> ไม่ระบุ = ทุกหน่วยงาน
              </div>
            </div>
            
            <div class="form-group-custom">
              <label for="swal-month" class="form-label-custom">
                <i class="fas fa-calendar-alt"></i>เดือน <span style="color: red;">*</span>
              </label>
              <select id="swal-month" class="swal2-input-custom" style="margin: 0;">
                <option value="">-- เลือกเดือน --</option>
                <option value="01">มกราคม</option>
                <option value="02">กุมภาพันธ์</option>
                <option value="03">มีนาคม</option>
                <option value="04">เมษายน</option>
                <option value="05">พฤษภาคม</option>
                <option value="06">มิถุนายน</option>
                <option value="07">กรกฎาคม</option>
                <option value="08">สิงหาคม</option>
                <option value="09">กันยายน</option>
                <option value="10">ตุลาคม</option>
                <option value="11">พฤศจิกายน</option>
                <option value="12">ธันวาคม</option>
              </select>
            </div>
            
            <div class="form-group-custom">
              <label for="swal-year" class="form-label-custom">
                <i class="fas fa-calendar"></i>ปี พ.ศ. <span style="color: red;">*</span>
              </label>
              <input 
                id="swal-year" 
                class="swal2-input-custom" 
                type="number" 
                placeholder="เช่น 2568" 
                value="${new Date().getFullYear() + 543}"
                style="margin: 0;">
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px; margin-top: 20px;">
              <div style="display: flex; align-items: start;">
                <i class="fas fa-exclamation-triangle" style="color: #ffc107; margin-right: 10px; margin-top: 3px;"></i>
                <div style="text-align: left; font-size: 0.9rem; color: #856404;">
                  <strong>คำเตือน:</strong> เมื่อ Lock แล้วข้อมูลจะไม่เปลี่ยนแปลง<br>
                  แม้ว่าข้อมูลต้นทางจะถูกแก้ไข
                </div>
              </div>
            </div>
          </div>
        `,
        width: '550px',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="fas fa-lock"></i> Lock ข้อมูล',
        cancelButtonText: '<i class="fas fa-times"></i> ยกเลิก',
        focusConfirm: false,
        customClass: {
          popup: 'animated-popup',
          confirmButton: 'btn-custom-confirm',
          cancelButton: 'btn-custom-cancel'
        },
        preConfirm: () => {
          const workplaceId = document.getElementById('swal-workplace').value.trim();
          const month = document.getElementById('swal-month').value;
          const yearBE = document.getElementById('swal-year').value;

          if (!month || !yearBE) {
            Swal.showValidationMessage('⚠️ กรุณาเลือกเดือนและปี');
            return false;
          }

          // แปลง พ.ศ. เป็น ค.ศ.
          const year = (parseInt(yearBE) - 543).toString();

          return {
            workplaceId: workplaceId || undefined,
            month: month,
            year: year,
            yearBE: yearBE
          };
        }
      });

      if (!formValues) {
        return; // ผู้ใช้กดยกเลิก
      }

      // แสดง loading
      Swal.fire({
        title: '',
        html: `
          <div style="padding: 20px;">
            <div class="spinner-border text-danger" role="status" style="width: 4rem; height: 4rem; border-width: 0.3rem; margin-bottom: 20px;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h4 style="color: #333; margin-bottom: 15px;">
              <i class="fas fa-lock"></i> กำลัง Lock ข้อมูล...
            </h4>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0; color: #555;">
                <strong>🏢 หน่วยงาน:</strong> ${formValues.workplaceId || 'ทุกหน่วยงาน'}
              </p>
              <p style="margin: 5px 0; color: #555;">
                <strong>📅 เดือน/ปี:</strong> ${formValues.month}/${formValues.yearBE}
              </p>
            </div>
            <p style="color: #999; font-size: 0.9rem;">
              <i class="fas fa-clock"></i> กรุณารอสักครู่...
            </p>
          </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: {
          popup: 'animated-popup'
        }
      });

      // เรียก API Lock
      const requestData = {
        month: formValues.month,
        year: formValues.year
      };

      if (formValues.workplaceId) {
        requestData.workplaceId = formValues.workplaceId;
      }

      console.log('🔒 Sending lock request:', requestData);

      const response = await axios.post(
        'http://10.10.110.7:3000/accounting/searchtimerecordbyworkplace-locked',
        requestData
      );

      console.log('✅ Lock response:', response.data);

      // ปิด Loading popup ก่อน
      Swal.close();

      // แสดงผลลัพธ์
      if (response.data.isLocked) {
        const lockedDate = new Date(response.data.lockedAt);
        const lockedDateStr = lockedDate.toLocaleString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // นับจำนวนหน่วยงานและพนักงาน
        const groupedResult = response.data.groupedResult || {};
        const workplaceCount = Object.keys(groupedResult).length;
        let totalEmployees = 0;
        
        Object.values(groupedResult).forEach(employees => {
          totalEmployees += employees.length;
        });

        await Swal.fire({
          title: '',
          html: `
            <div style="padding: 20px;">
              <div style="font-size: 5rem; color: #28a745; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3 style="color: #28a745; margin-bottom: 20px; font-weight: bold;">
                🔒 Lock ข้อมูลสำเร็จ!
              </h3>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <h5 style="color: white; margin-bottom: 15px; font-weight: bold;">
                  <i class="fas fa-chart-bar"></i> สรุปข้อมูลที่ Lock
                </h5>
                <div style="text-align: left;">
                  <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <span><i class="fas fa-calendar-alt"></i> เดือน/ปี:</span>
                    <strong>${formValues.month}/${formValues.yearBE}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <span><i class="fas fa-building"></i> หน่วยงาน:</span>
                    <strong>${formValues.workplaceId || 'ทุกหน่วยงาน'}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <span><i class="fas fa-industry"></i> จำนวนหน่วยงาน:</span>
                    <strong>${workplaceCount} หน่วยงาน</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <span><i class="fas fa-users"></i> จำนวนพนักงาน:</span>
                    <strong>${totalEmployees} คน</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    <span><i class="fas fa-clock"></i> Lock เมื่อ:</span>
                    <strong style="font-size: 0.9rem;">${lockedDateStr}</strong>
                  </div>
                </div>
              </div>
              
              <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <p style="color: #0c5460; margin: 0; text-align: left;">
                  <i class="fas fa-info-circle"></i> <strong>${response.data.message}</strong>
                </p>
              </div>
              
              <div style="background: #f8d7da; border-left: 4px solid #721c24; padding: 15px; border-radius: 4px;">
                <p style="color: #721c24; margin: 0; text-align: left; font-size: 0.95rem;">
                  <i class="fas fa-exclamation-triangle"></i> <strong>สำคัญ:</strong> 
                  ข้อมูลนี้จะไม่เปลี่ยนแปลงแม้ข้อมูลต้นทางจะเปลี่ยน
                </p>
              </div>
            </div>
          `,
          confirmButtonColor: '#28a745',
          confirmButtonText: '<i class="fas fa-check"></i> เข้าใจแล้ว',
          width: '700px',
          customClass: {
            popup: ''
          }
        });
      } else {
        await Swal.fire({
          title: '',
          html: `
            <div style="padding: 20px;">
              <div style="font-size: 4rem; color: #ffc107; margin-bottom: 20px;">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <h3 style="color: #856404; margin-bottom: 15px;">
                ⚠️ ไม่สามารถ Lock ได้
              </h3>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                <p style="color: #856404; margin: 0;">
                  ${response.data.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
                </p>
              </div>
            </div>
          `,
          confirmButtonColor: '#ffc107',
          confirmButtonText: '<i class="fas fa-check"></i> ตกลง',
          customClass: {
            popup: 'animated-popup'
          }
        });
      }

    } catch (error) {
      console.error('❌ Error locking period:', error);
      
      // แสดงข้อความผิดพลาดแบบละเอียด
      let errorMessage = 'เกิดข้อผิดพลาดในการ Lock ข้อมูล';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }

      await Swal.fire({
        title: '',
        html: `
          <div style="padding: 20px;">
            <div style="font-size: 4rem; color: #dc3545; margin-bottom: 20px;">
              <i class="fas fa-times-circle"></i>
            </div>
            <h3 style="color: #dc3545; margin-bottom: 15px;">
              ❌ เกิดข้อผิดพลาด!
            </h3>
            <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
              <p style="color: #721c24; margin: 0; text-align: left;">
                <strong>รายละเอียด:</strong><br>
                ${errorMessage}
              </p>
            </div>
            <p style="color: #999; font-size: 0.9rem;">
              <i class="fas fa-redo"></i> กรุณาลองใหม่อีกครั้ง
            </p>
          </div>
        `,
        confirmButtonColor: '#dc3545',
        confirmButtonText: '<i class="fas fa-check"></i> ตกลง',
        customClass: {
          popup: 'animated-popup'
        }
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
                    className="btn btn-danger"
                    style={{ fontSize: '1.1rem', padding: '10px 30px' }}>
                    ปิดงวด
                  </button>
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
  { to: "/system-settings", icon: "fas fa-cog", text: "การตั้งค่า", color: "#aebece" },
  { to: "/gps-location", icon: "fas fa-map-marker-alt", text: "ตำแหน่ง GPS", color: "rgb(43,93,142)" },
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
