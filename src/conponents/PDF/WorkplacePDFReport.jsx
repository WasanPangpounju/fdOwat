import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  pdf
} from '@react-pdf/renderer';
import fontFile from '../../assets/fonts/THSarabunNew.ttf';
import logoFile from '../../assets/images/OwatIcon.png';


// ลงทะเบียนฟอนต์ไทยจากไฟล์ local
Font.register({
  family: 'THSarabunNew',
  src: fontFile
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12,
    fontFamily: 'THSarabunNew'
  },
  header: {
    marginBottom: 7,
    textAlign: 'center'
  },
  logo: {
    fontSize: 18,
    color: '#FF6600',
    marginBottom: 5
  },
  companyName: {
    fontSize: 16,
    marginBottom: 10
  },
  title: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center'
  },
  dateRange: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  tableCellHeader: {
    fontSize: 10,
    textAlign: 'center'
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center'
  },
  tableCellRight: {
    fontSize: 10,
    textAlign: 'right'
  },
  totalRow: {
    backgroundColor: '#e6e6e6'
  },
  grandTotal: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureBox: {
    width: '30%',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingTop: 5,
    fontSize: 10
  },
  dateHeader: {
    position: 'absolute',
    top: 30,
    right: 30,
    fontSize: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 5
  }
});

// Helper function to format date in Thai
const formatThaiDate = (date) => {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Convert to Buddhist year
  
  return `${day} ${month} ${year}`;
};

// Helper function to format date as dd/mm/yyyy in Buddhist year
const formatShortThaiDate = (dateString, month, year) => {
  if (!dateString || dateString === 'null' || dateString === 'undefined') {
    return '-';
  }
  
  // ✅ ถ้า dateString เป็น format dd/mm/yyyy อยู่แล้ว (มี "/" อยู่) ให้คืนค่ากลับไปเลย
  if (typeof dateString === 'string' && dateString.includes('/')) {
    return dateString;
  }
  
  // If dateString is just a day number (like "21", "27")
  if (typeof dateString === 'string' && dateString.length <= 2 && !isNaN(dateString)) {
    const day = parseInt(dateString);
    const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
    const yearNum = year ? parseInt(year) + 543 : new Date().getFullYear() + 543;
    
    return `${day}/${monthNum}/${yearNum}`;
  }
  
  // Try to parse as full date
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  const day = date.getDate();
  const monthNum = date.getMonth() + 1;
  const yearNum = date.getFullYear() + 543;
  
  return `${day}/${monthNum}/${yearNum}`;
};

const WorkplacePDFReport = ({ workplaceData, employees, summary }) => {
  const currentDate = new Date();
  const startDate = new Date(workplaceData.startDate);
  const endDate = new Date(workplaceData.endDate);
  
  // Extract month and year from workplaceData or current date
  const currentMonth = workplaceData.month || (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = workplaceData.year || currentDate.getFullYear().toString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date in top right corner */}
        <View style={styles.dateHeader}>
          <Text>วันที่ออกเอกสาร</Text>
          <Text>{formatThaiDate(currentDate)}</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image style={{ width: 210, height: 80, alignSelf: 'center', marginBottom: 0 }} src={logoFile} />
          <Text style={styles.companyName}>
            บริษัท โอวาทเมด จำกัด (OWAT PRO AND QUICK COMPANY LIMITED)
          </Text>
          <Text style={styles.companyName}>
            20,22,24,26 ซอยสีหบุรานุกิจ 4 ถนนสีหบุรานุกิจ แขวงมีนบุรี เขตมีนบุรี กรุงเทพฯ 10510
          </Text>
        </View>

        {/* Title and Date Range */}
        <View style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>
            รายงานสรุปการจ่ายค่าจ้างพิเศษในวันหยุด 
          </Text>
          <Text style={{ fontSize: 12 }}>
            รอบการทำงานของวันที่: {formatThaiDate(startDate)} ถึง {formatThaiDate(endDate)}
          </Text>
        </View>

        {/* Workplace Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>หน่วยงาน {workplaceData.workplaceId}:{workplaceData.workplaceName}</Text>
          
          {/* Employee Table */}
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>รหัสพนักงาน</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ชื่อ - นามสกุล</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>เงินทำงาน</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>OT</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ประจำวันที่</Text>
              </View>
            </View>

            {/* Employee Rows */}
            {employees.map((employee, index) => {
              const salary = calculateEmployeeSalary(employee);
              return employee.specialShiftDays.map((day, dayIndex) => (
                <View style={styles.tableRow} key={`${index}-${dayIndex}`}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{employee.employeeId}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{employee.employeeName}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellRight}>
                      {parseFloat(day.cashOfHoliday || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCellRight}>
                      {parseFloat(day.cashOfHolidayOt || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatShortThaiDate(day.date, currentMonth, currentYear)}</Text>
                  </View>
                </View>
              ));
            })}

            {/* Total Row */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>รวม</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}></Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCellHeader, styles.tableCellRight]}>
                  {(summary?.totalSpecial || 0).toLocaleString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={[styles.tableCellHeader, styles.tableCellRight]}>
                  {(summary?.totalOT || 0).toLocaleString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grand Total */}
        <Text style={styles.grandTotal}>
          ยอดเงินสุทธิทั้งสิ้น: {(summary?.grandTotal || 0).toLocaleString()} บาท
        </Text>

        {/* Note */}
        <Text style={{ fontSize: 10, marginTop: 20, textAlign: 'center', fontFamily: 'THSarabunNew' }}>
          หมายเหตุ: รายงานสรุปการจ่ายค่าจ้างพิเศษในวันหยุด (วันเสาร์) ถูกดำเนินการจ่าย {formatThaiDate(currentDate)} ครั้งนี้การแจกเงินจึงเรียบร้อยแล้ว
          เก็บไว้สำหรับรับการตรวจสอบเจ้าหน้าที่ยื่นสำหรับการกรอก เก็บไว้ให้สำคัญ
        </Text>

        {/* Signatures */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text style={{ marginBottom: 30 }}>...................................</Text>
            <Text>(นาย จิดก้ำ เอกสาร)</Text>
            <Text>ผู้จัดทำเอกสาร</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ marginBottom: 30 }}>...................................</Text>
            <Text>(นางสาว อนุสรา เอกสาร)</Text>
            <Text>ผู้ตรวจสอบเอกสาร</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ marginBottom: 30 }}>...................................</Text>
            <Text>(นาง ครวญสอน เอกสาร)</Text>
            <Text>ผู้อนุมัติเอกสาร</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Helper function (same as in the main component)
const calculateEmployeeSalary = (employee) => {
  if (!employee || !employee.specialShiftDays) return { total: 0, totalOT: 0, grandTotal: 0 };
  
  const total = employee.specialShiftDays.reduce((sum, day) => {
    return sum + (parseFloat(day.cashOfHoliday) || 0);
  }, 0);
  
  const totalOT = employee.specialShiftDays.reduce((sum, day) => {
    return sum + (parseFloat(day.cashOfHolidayOt) || 0);
  }, 0);
  
  return { total, totalOT, grandTotal: total + totalOT };
};

export default WorkplacePDFReport;
