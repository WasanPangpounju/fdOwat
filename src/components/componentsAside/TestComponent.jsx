import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import ThaisarabunNewFont from '../../assets/fonts/THSarabunNew.ttf';



// ลงทะเบียน font ไทย
Font.register({
  family: 'THsarabunNew',
  src: ThaisarabunNewFont,
});

// กำหนด styles สำหรับ PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'THsarabunNew',
    padding: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 12,
    marginBottom: 5,
  },
  info2: {
    fontSize: 8,
    marginLeft: 20
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '5.5%',
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  tableColHeaderName: {
    width: '11%',
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    backgroundColor: '#f0f0f0',
    padding: 1,
  },
  tableColHeaderLast: {
    width: '5.5%',
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  tableCol: {
    width: '5.5%',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    padding: 3,
  },
  tableColName: {
    width: '11%',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    padding: 3,
  },
  tableColLast: {
    width: '5.5%',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    borderRight: '1px solid #000',
    padding: 3,
  },
  tableCellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 7,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    fontSize: 8,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 12,
  }
});

// สร้าง PDF Component
const TimeRecordPDF = ({ formData, thaiMonth, employees }) => (
  <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
      <Text style={styles.title}>รายงานการลงเวลาประจำเดือน</Text>
      
      <Text style={styles.info}>รหัสหน่วยงาน: {formData.workplaceId}</Text>
      <Text style={styles.info}>ชื่อหน่วยงาน: {formData.workplaceName}</Text>
      <Text style={styles.info}>ประจำเดือน: {thaiMonth(formData.month)} {formData.year}</Text>
      
      <Text style={styles.subtitle}>ตารางข้อมูลการทำงาน</Text>
      
      <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>รหัส</Text>
          </View>
          <View style={styles.tableColHeaderName}>
            <Text style={styles.tableCellHeader}>ชื่อ-สกุล</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>วัน</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>เงินเดือน</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>สาย/ออก</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ล่วงเวลา</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>เบี้ยขยัน</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>OT</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>บริการ</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ค่าวิชา</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>บริการ(วิชา)</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>OT(วิชา)</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>อื่นๆ</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>คืน ภงด</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>บริการ</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>สินค้า</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>ประกันสังคม</Text>
          </View>
          <View style={styles.tableColHeaderLast}>
            <Text style={styles.tableCellHeader}>รวม</Text>
          </View>
        </View>
        
        <Text style={styles.info2}>{formData.workplaceName}:{formData.workplaceId}</Text>

        {/* แสดงข้อมูลพนักงาน */}
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.employeeId || "-"}</Text>
              </View>
              <View style={styles.tableColName}>
                <Text style={styles.tableCell}>{`${employee.firstName || ""} ${employee.lastName || ""}`}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.dayWorkCount || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.sumCashWork || "0"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.late || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.overtime || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.diligenceAllowance || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.OT || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.service || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.subject || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.serviceSubject || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.otSubject || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.others || "0"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.taxReturn || "0"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.serviceCharge || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.product || "0.00"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{employee.socialSecurity || "0.00"}</Text>
              </View>
              <View style={styles.tableColLast}>
                <Text style={styles.tableCell}>{employee.total || "0.00"}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <View style={{ width: '100%', padding: 10, textAlign: 'center' }}>
              <Text>ไม่พบข้อมูลพนักงาน</Text>
            </View>
          </View>
        )}
      </View>
      
      <Text style={styles.footer}>
        พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}
      </Text>
    </Page>
  </Document>
);

const TestComponent = () => {
  // ใช้ useState เท่าที่จำเป็น
  const [workplaces, setWorkplaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workplacrId, setWorkplacrId] = useState('');
  const [workplacrName, setWorkplacrName] = useState('');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate321, setFormattedDate321] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [present, setPresent] = useState('');
  const [presentfilm, setPresentfilm] = useState('');
  const [workplaceListAll, setWorkplaceListAll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  // สร้างรายการปี (ย้อนหลัง 5 ปีจากปีปัจจุบัน) ใช้ useMemo เพื่อลดการคำนวณซ้ำ
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  // ลดการเรียกใช้ API ที่ไม่จำเป็น
  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://10.10.110.7:3000/timerecord/searchtimerecordmonthyear');
        
        let allEmployeeRecords = [];
        if (response.data && response.data.result && Array.isArray(response.data.result)) {
          response.data.result.forEach(item => {
            if (item.employee_record && Array.isArray(item.employee_record)) {
              allEmployeeRecords = [...allEmployeeRecords, ...item.employee_record];
            }
          });
          
          // ใช้ Set แทนการใช้ filter เพื่อเพิ่มประสิทธิภาพ
          const workplaceIds = new Set();
          const uniqueWorkplaces = [];
          
          allEmployeeRecords.forEach(record => {
            if (record.workplaceId && !workplaceIds.has(record.workplaceId)) {
              workplaceIds.add(record.workplaceId);
              uniqueWorkplaces.push({
                workplaceId: record.workplaceId,
                workplaceName: record.workplaceName
              });
            }
          });
          
          setWorkplaces(uniqueWorkplaces);
          setWorkplaceListAll(uniqueWorkplaces);
        }
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลหน่วยงานได้');
        setLoading(false);
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
      }
    };

    fetchWorkplaces();

    // ตั้งค่าเริ่มต้นของวันที่
    const today = new Date();
    const formattedToday = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 543}`;
    setFormattedDate321(formattedToday);
  }, []);

  // ใช้ useCallback เพื่อลดการสร้างฟังก์ชันใหม่ทุกครั้งที่ re-render
  const handleStaffIdChange = useCallback((e) => {
    const id = e.target.value;
    setWorkplacrId(id);
    
    const selectedWorkplace = workplaces.find(wp => wp.workplaceId === id);
    if (selectedWorkplace) {
      setWorkplacrName(selectedWorkplace.workplaceName);
    }
  }, [workplaces]);

  const handleStaffNameChange = useCallback((e) => {
    const name = e.target.value;
    setWorkplacrName(name);
    
    const selectedWorkplace = workplaces.find(wp => wp.workplaceName === name);
    if (selectedWorkplace) {
      setWorkplacrId(selectedWorkplace.workplaceId);
    }
  }, [workplaces]);

  const toggleDatePicker = useCallback(() => {
    setShowDatePicker(prev => !prev);
  }, []);

  const handleDatePickerChange = useCallback((date) => {
    setSelectedDate(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const thaiYear = date.getFullYear() + 543;
    setFormattedDate321(`${day}/${month}/${thaiYear}`);
    setShowDatePicker(false);
  }, []);

  // ฟังก์ชันจัดรูปแบบตัวเลข
  const formatNumber = useCallback((num) => {
    if (num === undefined || num === null) return "0.00";
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // แปลงชื่อเดือนภาษาไทย
  const getThaiMonth = useCallback((month) => {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 
      'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 
      'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return thaiMonths[parseInt(month) - 1] || '';
  }, []);

  // ฟังก์ชันดึงข้อมูลพนักงาน
  const fetchEmployeeData = useCallback(async () => {
    if (!workplacrId || !month || !year) {
      alert('กรุณากรอกรหัสหน่วยงาน เดือน และปี');
      return;
    }

    try {
      setLoadingEmployees(true);
      setPdfReady(false);
      
      const requestData = {
        workplaceId: workplacrId,
        month: month,
        year: year
      };
      
      const response = await axios.post(
        'http://10.10.110.7:3000/timerecord/searchtimerecordmonthyear', 
        requestData
      );
      
      let filteredEmployees = [];
      
      if (response.data && response.data.result && Array.isArray(response.data.result)) {
        // กรองเฉพาะข้อมูลที่ตรงกับเดือนและปี
        const formMonth = String(month || '').padStart(2, '0');
        
        const matchingResults = response.data.result.filter(item => {
          const itemMonth = String(item.month || '').padStart(2, '0');
          return itemMonth === formMonth && String(item.year || '') === String(year || '');
        });
        
        // ใช้ Map เพื่อเพิ่มประสิทธิภาพในการกรองและแปลงข้อมูล
        const employeeMap = new Map();
        
        matchingResults.forEach(result => {
          if (result.employee_record && Array.isArray(result.employee_record)) {
            const matchingEmployees = result.employee_record.filter(record => 
              String(record.workplaceId || '') === String(workplacrId || '')
            );
            
            matchingEmployees.forEach(emp => {
              const employeeId = result.employeeId || emp.employeeId || '';
              if (!employeeMap.has(employeeId)) {
                employeeMap.set(employeeId, {
                  ...emp,
                  employeeId,
                  firstName: (result.employeeName || '').split(' ')[0] || '',
                  lastName: (result.employeeName || '').split(' ')[1] || '',
                  dayWorkCount: result.dayWorkCount || emp.dayWorkCount || '',
                  sumCashWork: result.sumCashWork || emp.sumCashWork || '',
                });
              }
            });
          }
        });
        
        // แปลงข้อมูลจาก Map กลับเป็น Array
        filteredEmployees = Array.from(employeeMap.values());
      }
      
      // แปลงข้อมูลพนักงาน
      const formattedEmployees = filteredEmployees.map(emp => ({
        employeeId: emp.employeeId || '',
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        dayWorkCount: emp.dayWorkCount || '',
        sumCashWork: formatNumber(emp.sumCashWork || 0),
        late: formatNumber(emp.late || 0),
        overtime: formatNumber(emp.overtime || 0),
        diligenceAllowance: formatNumber(emp.diligenceAllowance || 0),
        OT: formatNumber(emp.OT || 0),
        service: formatNumber(emp.service || 0),
        subject: formatNumber(emp.subject || 0),
        serviceSubject: formatNumber(emp.serviceSubject || 0),
        otSubject: formatNumber(emp.otSubject || 0),
        others: emp.others || '0',
        taxReturn: emp.taxReturn || '0',
        serviceCharge: formatNumber(emp.serviceCharge || 0),
        product: formatNumber(emp.product || 0),
        socialSecurity: formatNumber(emp.socialSecurity || 0),
        total: formatNumber(emp.total || 0)
      }));
      
      setEmployees(formattedEmployees);
      setLoadingEmployees(false);
      setPdfReady(true);
      
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน:', err);
      setLoadingEmployees(false);
      setEmployees([]);
    }
  }, [workplacrId, month, year, formatNumber]);

  // ฟังก์ชันสร้าง PDF
 const generatePDF01 = useCallback(async () => {
  // ตรวจสอบข้อมูลว่าครบหรือไม่
  if (!workplacrId || !month || !year) {
    alert('กรุณากรอกรหัสหน่วยงาน เดือน และปี');
    return;
  }

  try {
    setLoadingEmployees(true);
    
    // ดึงข้อมูลพนักงาน
    await fetchEmployeeData();
    
    // เมื่อข้อมูลพร้อม (employees มีข้อมูล) ให้ดาวน์โหลด PDF
    setTimeout(() => {
      // ต้องรอให้ข้อมูลถูกอัปเดตก่อน
      if (pdfReady) {
        // คลิกที่ลิงก์ดาวน์โหลดโดยอัตโนมัติ
        document.getElementById('pdfDownloadLink').click();
      }
    }, 1000); // รอ 1 วินาทีเพื่อให้ข้อมูลถูกอัปเดตเรียบร้อย
    
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', err);
    setLoadingEmployees(false);
  }
}, [workplacrId, month, year, fetchEmployeeData, pdfReady]);

  const generatePDF02 = useCallback(() => {
    alert('คุณเลือกสร้าง PDF หน่วยงานทั้งหมด');
  }, []);

  const exportToExcel = useCallback(() => {
    alert('กำลังส่งออกข้อมูลเป็น Excel');
  }, []);

  // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
  const isFormComplete = workplacrId && workplacrName && month && year;

  // ใช้ useMemo ในการสร้าง datalist options เพื่อลด re-render
  const workplaceIdOptions = useMemo(() => {
    return workplaceListAll.map((workplace) => (
      <option key={workplace.workplaceId} value={workplace.workplaceId} />
    ));
  }, [workplaceListAll]);

  const workplaceNameOptions = useMemo(() => {
    return workplaceListAll.map((workplace) => (
      <option key={workplace.workplaceId} value={workplace.workplaceName} />
    ));
  }, [workplaceListAll]);

  const yearOptions = useMemo(() => {
    return years.map((y) => (
      <option key={y} value={y}>
        {parseInt(y) + 543}
      </option>
    ));
  }, [years]);

  return (
    <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="">
          <div className="content-wrapper">
            {/* <!-- Content Header (Page header) --> */}
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <i className="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#"> ระบบเงินเดือน</a>
              </li>
              <li className="breadcrumb-item active">ออกรายงานเงินเดือนพนักงาน </li>
            </ol>
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <h1 className="m-0">
                    <i className="far fa-arrow-alt-circle-right"></i>{" "}
                    ออกรายงานเงินเดือนพนักงาน
                  </h1>
                </div>
              </div>
            </div>
            <section className="content">
              <div className="container-fluid">
                <h2 className="title">ออกรายงานเงินเดือนพนักงาน </h2>
                <section className="Frame">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-3">
                        <label role="searchEmployeeId">รหัสหน่วยงาน</label>
                        {loading ? (
                          <p>กำลังโหลดข้อมูล...</p>
                        ) : error ? (
                          <p className="text-danger">{error}</p>
                        ) : (
                          <>
                            <input
                              type="text"
                              className="form-control"
                              id="workplaceId"
                              name="workplaceId"
                              placeholder="รหัสหน่วยงาน"
                              value={workplacrId}
                              onChange={handleStaffIdChange}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/\D/g, "");
                              }}
                              list="WorkplaceIdList"
                            />
                            <datalist id="WorkplaceIdList">
                              {workplaceIdOptions}
                            </datalist>
                          </>
                        )}
                      </div>
                      <div className="col-md-3">
                        <label role="searchname">ชื่อหน่วยงาน</label>
                        <input
                          type="text"
                          className="form-control"
                          id="workplaceName"
                          name="workplaceName"
                          placeholder="ชื่อหน่วยงาน"
                          value={workplacrName}
                          onChange={handleStaffNameChange}
                          list="WorkplaceNameList"
                        />
                        <datalist id="WorkplaceNameList">
                          {workplaceNameOptions}
                        </datalist>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label role="agencyname">เดือน</label>
                          <select
                            className="form-control"
                            name="month"
                            value={month}
                            onChange={(e) => {
                              setMonth(e.target.value);
                            }}
                          >
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
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>ปี</label>
                          <select
                            className="form-control"
                            name="year"
                            value={year}
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                          >
                            {yearOptions}
                          </select>
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                    <div className="row">
                      <div className="col-md-3">
                        <label role="datetime">พิมพ์วันที่</label>
                        <div
                          onClick={toggleDatePicker}
                          style={{
                            position: "relative",
                            zIndex: 9999,
                            marginLeft: "0rem",
                            cursor: "pointer",
                            padding: "5px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "#f8f9fa"
                          }}
                        >
                          <span>📅</span> {/* ใช้ emoji แทนไอคอน */}
                          <span style={{ marginLeft: "8px" }}>
                            {formattedDate321 ? formattedDate321 : "Select Date"}
                          </span>
                        </div>

                        {showDatePicker && (
                          <div style={{ position: "absolute", zIndex: 1000 }}>
                            {/* เปลี่ยนจาก ThaiDatePicker เป็น input type="date" เพื่อแก้ปัญหาเรื่องการค้าง */}
                            <input
                              type="date"
                              className="form-control"
                              value={selectedDate.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const date = new Date(e.target.value);
                                handleDatePickerChange(date);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-md-3">
                        <label role="datetime">ลงชื่อ</label>
                        <input
                          type="text"
                          className="form-control"
                          id="present"
                          placeholder="รายงานโดย"
                          value={present}
                          onChange={(e) => setPresent(e.target.value)}
                        />
                      </div>

                      <div className="col-md-3">
                        <label role="datetime">รหัส</label>
                        <input
                          type="text"
                          className="form-control"
                          id="presentfilm"
                          placeholder="แฟ้มรายงาน"
                          value={presentfilm}
                          onChange={(e) => setPresentfilm(e.target.value)}
                        />
                      </div>
                    </div>
                    <br />
                    <button
                      className="btn btn-success"
                      style={{ width: "10rem" }}
                      onClick={generatePDF01}
                      disabled={!isFormComplete || loadingEmployees}
                    >
                      {loadingEmployees ? 'กำลังโหลด...' : 'PDF รายหน่วยงาน'}
                    </button>
                    <button
                      className="btn btn-success"
                      style={{ marginLeft: "1rem", width: "11rem" }}
                      onClick={generatePDF02}
                      disabled={loadingEmployees}
                    >
                      PDF หน่วยงานทั้งหมด
                    </button>
                  </div>
                  <br />
                  <div className="col-md-12">
                    <button 
                      className="btn btn-success" 
                      onClick={exportToExcel}
                      disabled={!pdfReady || loadingEmployees}
                    >
                      Export to Excel
                    </button>
                  </div>

                  {/* แสดง PDF Download Link (ซ่อนไว้) */}
                  {pdfReady && (
                    <div style={{ display: 'none' }}>
  <PDFDownloadLink
    id="pdfDownloadLink"
    document={
      <TimeRecordPDF 
        formData={{ 
          workplaceId: workplacrId, 
          workplaceName: workplacrName, 
          month: month, 
          year: year 
        }} 
        thaiMonth={getThaiMonth} 
        employees={employees} 
      />
    }
    fileName={`รายงานหน่วยงาน_${workplacrId}_${month}_${year}.pdf`}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'
    }
  </PDFDownloadLink>
</div>
                  )}
                  
                  {/* แสดงผลลัพธ์การค้นหา */}
                  {loadingEmployees && (
                    <div className="alert alert-info">กำลังค้นหาข้อมูลพนักงาน...</div>
                  )}
                  
                  {employees.length > 0 && !loadingEmployees && (
                    <div className="mt-4">
                      <h4>ผลการค้นหา: พบพนักงานทั้งหมด {employees.length} คน</h4>
                    </div>
                  )}
                  
                  {employees.length === 0 && pdfReady && !loadingEmployees && (
                    <div className="alert alert-warning">ไม่พบข้อมูลพนักงานตามเงื่อนไขที่ระบุ</div>
                  )}
                </section>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;