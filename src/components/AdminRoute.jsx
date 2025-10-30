import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element, ...rest }) => {
  // ตรวจสอบ role ของ user จาก localStorage
  const userRole = localStorage.getItem('userRole');
  
  // ถ้าไม่มี userRole ให้ลองอ่านจาก user object
  let role = userRole;
  if (!role) {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        role = user.role;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  const isAdmin = role === 'admin';

  // Debug logs
  console.log('=== AdminRoute Debug ===');
  console.log('userRole from localStorage:', userRole);
  console.log('role from user object:', role);
  console.log('isAdmin:', isAdmin);
  console.log('=======================');

  // ถ้าไม่ใช่ admin ให้ redirect ไปหน้า dashboard พร้อมแสดง alert
  if (!isAdmin) {
    alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (ต้องเป็น Admin เท่านั้น)');
    return <Navigate to="/dashboard" replace />;
  }

  // ถ้าเป็น admin ให้แสดง component ปกติ
  return element;
};

export default AdminRoute;
