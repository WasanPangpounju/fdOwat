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
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
    textAlign: 'center'
  },
  workplaceTitle: {
    fontSize: 11,
    marginBottom: 8,
    backgroundColor: '#e6f3ff',
    padding: 4,
    color: '#2b5d8e'
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    display: 'table-row'
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    backgroundColor: '#f0f0f0',
    padding: 4,
    display: 'table-cell'
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    display: 'table-cell'
  },
  tableColWide: {
    width: '35%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    display: 'table-cell'
  },
  tableColNarrow: {
    width: '18%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    display: 'table-cell'
  },
  tableColCode: {
    width: '12%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#000000',
    padding: 4,
    display: 'table-cell'
  },
  tableCellHeader: {
    fontSize: 9,
    textAlign: 'center'
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center'
  },
  tableCellLeft: {
    fontSize: 9,
    textAlign: 'left'
  },
  tableCellRight: {
    fontSize: 9,
    textAlign: 'right'
  },
  totalRow: {
    backgroundColor: '#e6e6e6'
  },
  workplaceTotalRow: {
    backgroundColor: '#d4edda'
  },
  grandTotalRow: {
    backgroundColor: '#f8d7da'
  },
  summaryTable: {
    marginTop: 15,
    marginBottom: 15
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
  },
  pageBreak: {
    marginTop: 20,
    pageBreakBefore: 'always'
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
  
  // ถ้า dateString มาในรูปแบบ "21/07/2568" แล้ว ก็ส่งกลับไปตามเดิม
  if (typeof dateString === 'string' && dateString.includes('/')) {
    // ตรวจสอบว่าปีถูกต้องหรือไม่ ถ้าเป็น 3xxx ให้แก้ไข
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const monthPart = parts[1];
      let yearPart = parseInt(parts[2]);
      
      // แก้ไขปีที่ผิดรูปแบบ
      if (yearPart > 3000) {
        yearPart = yearPart - 543; // แปลงกลับเป็น ค.ศ. แล้วบวก 543 ใหม่
        yearPart = yearPart + 543;
      } else if (yearPart < 2500) {
        yearPart = yearPart + 543; // ถ้าเป็น ค.ศ. ให้แปลงเป็น พ.ศ.
      }
      
      return `${day}/${monthPart}/${yearPart}`;
    }
    return dateString;
  }
  
  // If dateString is just a day number (like "21", "27")
  if (typeof dateString === 'string' && dateString.length <= 2 && !isNaN(dateString)) {
    const day = parseInt(dateString);
    const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
    const yearNum = year ? parseInt(year) + 543 : new Date().getFullYear() + 543;
    
    return `${day.toString().padStart(2, '0')}/${monthNum.toString().padStart(2, '0')}/${yearNum}`;
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
  
  return `${day.toString().padStart(2, '0')}/${monthNum.toString().padStart(2, '0')}/${yearNum}`;
};

// Helper function to calculate employee salary
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

// Helper function to calculate workplace total
const calculateWorkplaceTotal = (employees) => {
  return employees.reduce((total, employee) => {
    const salary = calculateEmployeeSalary(employee);
    return total + salary.grandTotal;
  }, 0);
};

const AllWorkplacesSummaryPDFReport = ({ searchResults, startDate, endDate }) => {
  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  // Extract month and year from searchResults or current date
  const currentMonth = searchResults?.month || (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = searchResults?.year || currentDate.getFullYear().toString();

  // Calculate grand total for all workplaces
  const grandTotal = searchResults?.workplaces?.reduce((total, workplace) => {
    return total + calculateWorkplaceTotal(workplace.employees);
  }, 0) || 0;

  // Create summary data for each workplace
  const workplaceSummary = searchResults?.workplaces?.map(workplace => ({
    id: workplace.workplaceId,
    name: workplace.workplaceName,
    employeeCount: workplace.totalEmployeesWithSpecialShift,
    totalAmount: calculateWorkplaceTotal(workplace.employees)
  })) || [];

  // แบ่งตารางสรุปเป็นหลายหน้า (แต่ละหน้าไม่เกิน 15 หน่วยงาน)
  const itemsPerPage = 15;
  const summaryPages = [];
  for (let i = 0; i < workplaceSummary.length; i += itemsPerPage) {
    summaryPages.push(workplaceSummary.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {/* Summary Pages */}
      {summaryPages.map((pageWorkplaces, pageIndex) => (
        <Page size="A4" style={styles.page} key={`summary-${pageIndex}`}>
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
              20,22,24,26 ซอยสีพระยาสุเรนทร์ 4 ถนนสีพระยาสุเรนทร์ แขวงบางโพ เขตบางโพ กรุงเทพมหานคร 10510
            </Text>
          </View>

          {/* Title and Date Range */}
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              รายงานสรุปการจ่ายค่าจ้างพิเศษในวันหยุดทุกหน่วยงาน {summaryPages.length > 1 ? `(หน้า ${pageIndex + 1}/${summaryPages.length})` : ''}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 20 }}>
              รอบการทำงานของวันที่: {formatThaiDate(startDateObj)} ถึง {formatThaiDate(endDateObj)}
            </Text>
          </View>

          {/* Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>สรุปภาพรวมทุกหน่วยงาน</Text>
            
            {/* Summary Table */}
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableRow}>
                <View style={styles.tableColCode}>
                  <Text style={styles.tableCellHeader}>รหัสหน่วยงาน</Text>
                </View>
                <View style={styles.tableColWide}>
                  <Text style={styles.tableCellHeader}>ชื่อหน่วยงาน</Text>
                </View>
                <View style={styles.tableColNarrow}>
                  <Text style={styles.tableCellHeader}>จำนวนพนักงาน</Text>
                </View>
                <View style={styles.tableColWide}>
                  <Text style={styles.tableCellHeader}>ยอดเงินรวม (บาท)</Text>
                </View>
              </View>

              {/* Workplace Summary Rows */}
              {pageWorkplaces.map((workplace, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableColCode}>
                    <Text style={styles.tableCell}>{workplace.id}</Text>
                  </View>
                  <View style={styles.tableColWide}>
                    <Text style={styles.tableCellLeft}>{workplace.name}</Text>
                  </View>
                  <View style={styles.tableColNarrow}>
                    <Text style={styles.tableCell}>{workplace.employeeCount}</Text>
                  </View>
                  <View style={styles.tableColWide}>
                    <Text style={styles.tableCellRight}>{workplace.totalAmount.toLocaleString()}</Text>
                  </View>
                </View>
              ))}

              {/* Total Row - แสดงเฉพาะหน้าสุดท้าย */}
              {pageIndex === summaryPages.length - 1 && (
                <View style={[styles.tableRow, styles.grandTotalRow]}>
                  <View style={styles.tableColCode}>
                    <Text style={styles.tableCellHeader}>รวมทั้งสิ้น</Text>
                  </View>
                  <View style={styles.tableColWide}>
                    <Text style={styles.tableCellHeader}>{workplaceSummary.length} หน่วยงาน</Text>
                  </View>
                  <View style={styles.tableColNarrow}>
                    <Text style={styles.tableCellHeader}>{searchResults?.totalEmployeesWithSpecialShift || 0} คน</Text>
                  </View>
                  <View style={styles.tableColWide}>
                    <Text style={[styles.tableCellHeader, styles.tableCellRight]}>{grandTotal.toLocaleString()}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Grand Total - แสดงเฉพาะหน้าสุดท้าย */}
          {pageIndex === summaryPages.length - 1 && (
            <>
              <Text style={styles.grandTotal}>
                ยอดเงินสุทธิทั้งสิ้นทุกหน่วยงาน: {grandTotal.toLocaleString()} บาท
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
            </>
          )}
        </Page>
      ))}

      {/* Detailed Pages for Each Workplace */}
      {searchResults?.workplaces?.map((workplace, workplaceIndex) => (
        <Page size="A4" style={styles.page} key={workplaceIndex}>
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
              20,22,24,26 ซอยสีพระยาสุเรนทร์ 4 ถนนสีพระยาสุเรนทร์ แขวงบางโพ เขตบางโพ กรุงเทพมหานคร 10510
            </Text>
          </View>

          {/* Title and Date Range */}
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              รายงานสรุปการจ่ายค่าจ้างพิเศษในวันหยุด
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 20 }}>
              รอบการทำงานของวันที่: {formatThaiDate(startDateObj)} ถึง {formatThaiDate(endDateObj)}
            </Text>
          </View>

          {/* Workplace Section */}
          <View style={styles.section}>
            <Text style={styles.workplaceTitle}>
              หน่วยงาน {workplace.workplaceId}: {workplace.workplaceName}
            </Text>
            
            {/* Employee Table */}
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>รหัสพนักงาน</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>ชื่อ - นามสกุล</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>ยอดเงิน</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>ประจำวันที่</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>หมายเหตุ</Text>
                </View>
              </View>

              {/* Employee Rows */}
              {workplace.employees.map((employee, empIndex) => {
                return employee.specialShiftDays.map((day, dayIndex) => (
                  <View style={styles.tableRow} key={`${empIndex}-${dayIndex}`}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{employee.employeeId}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellLeft}>{employee.employeeName}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellRight}>
                        {(parseFloat(day.cashOfHoliday) + parseFloat(day.cashOfHolidayOt)).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{formatShortThaiDate(day.date, currentMonth, currentYear)}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{day.remark || '-'}</Text>
                    </View>
                  </View>
                ));
              })}

              {/* Workplace Total Row */}
              <View style={[styles.tableRow, styles.workplaceTotalRow]}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>รวม</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}>{workplace.totalEmployeesWithSpecialShift} คน</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCellHeader, styles.tableCellRight]}>
                    {calculateWorkplaceTotal(workplace.employees).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}></Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCellHeader}></Text>
                </View>
              </View>
            </View>
          </View>

          {/* Workplace Total */}
          <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10, padding: 8, backgroundColor: '#e6f3ff' }}>
            ยอดเงินรวมหน่วยงาน {workplace.workplaceName}: {calculateWorkplaceTotal(workplace.employees).toLocaleString()} บาท
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default AllWorkplacesSummaryPDFReport;
