// ฟังก์ชัน generateExcel ที่ใช้ ExcelJS แทน XLSX
const generateExcelWithExcelJS = async (responseDataAll, editableData, workplaceList, getEmployeeBankNumber) => {
  // ตรวจสอบข้อมูล
  if (!responseDataAll || responseDataAll.length === 0) {
    alert("กรุณารอให้ข้อมูลโหลดเสร็จก่อน หรือเลือกเงื่อนไขการค้นหา");
    return;
  }
  
  try {
    console.log("🎯 START: generateExcel function called");
    console.log("📊 ResponseDataAll length:", responseDataAll?.length);
    
    // สร้าง workbook ใหม่ด้วย ExcelJS
    const ExcelJS = require('exceljs');
    const wb = new ExcelJS.Workbook();
    
    // ฟังก์ชันคำนวณเงินรับสุทธิ
    const calculateNetSalary = (employee) => {
      const incomeTotal = 
        parseFloat(employee?.sumCashWork || '0') + 
        parseFloat(employee?.sumCashOt || '0') +
        parseFloat(employee?.publicHolidayCash || '0') + 
        parseFloat(
          employee?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );

      const deductionTotal =
        parseFloat(employee?.socialSecurity || '0') +
        parseFloat(employee?.tax || '0') +
        parseFloat(
          employee?.deductSalaryList?.[0]?.amount || '0'
        );

      const netTotal = incomeTotal - deductionTotal;
      return isNaN(netTotal) ? 0 : netTotal;
    };

    // ฟังก์ชันจัดรูปแบบตัวเลข
    const formatNumber = (num) => {
      return parseFloat(num || 0).toFixed(2);
    };

    // วนลูปสร้าง sheet สำหรับแต่ละพนักงาน
    for (let i = 0; i < responseDataAll.length; i++) {
      const currentEmployee = responseDataAll[i];
      console.log(`👤 Processing employee ${i}:`, currentEmployee?.employeeId, currentEmployee?.employeeName);
      
      const employeeRecords = currentEmployee.employee_record || [];
      const addSalaryList = currentEmployee.addSalaryList || [];
      
      // คำนวณข้อมูลต่างๆ (ใช้ข้อมูลที่แก้ไขแล้ว)
      const workDays = editableData && editableData.length > i && editableData[i]?.editableFields?.workDays ||
                       employeeRecords.filter(record => record.dayType === "work").length;
      const currentWorkplaceId = employeeRecords[0]?.workplaceId;
      const workplace = workplaceList.find(item => item.workplaceId === currentWorkplaceId);
      const workplaceName = workplace ? workplace.workplaceName : "Unknown";
      
      // ดึงเลขบัญชี
      const banknumber = await getEmployeeBankNumber(currentEmployee.employeeId);
      
      // กรองรายการเงินพิเศษ
      const excludedIds = ["1350", "1230", "1410", "1535", "1520"];
      const addSalaryFiltered = addSalaryList
        .filter((salary) => !excludedIds.includes(salary.id));
      
      // จ่ายชดเชย
      const excludedIdsPayCompensation = [
        "1231", "1233", "1422", "1423", "1428", "1434", 
        "1435", "1429", "1427", "1234", "1426", "1425",
      ];
      
      const addSalaryPayCompensationFiltered = addSalaryList
        .filter((salary) => excludedIdsPayCompensation.includes(salary.id));
      
      // คำนวณรายการต่างๆ
      const sumAmountHardWorking = addSalaryList
        .filter(item => item.id === "1410")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSalaryTavel = addSalaryList
        .filter(item => item.id === "1535")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSalaryFood = addSalaryList
        .filter(item => item.id === "1330")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      const sumAddSpecialCash = addSalaryList
        .filter(item => item.id === "1560")
        .reduce((total, item) => total + parseFloat(item.SpSalary || 0), 0);
      
      // สวัสดิการหลัก
      const specificIds = ["1230", "1350", "1535"];
      const result = addSalaryList
        .filter((item) => specificIds.includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1350" ? "โทรศัพท์" : (item.id === "1535" ? "ค่าเดินทาง" : item.name));
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );
      
      const concatenatedNames = result.names.length > 0 ? result.names.join("/") : "";
      
      // เงินพิเศษ
      const extraCashIds = ["1560", "1563"];
      const resultExtraCash = addSalaryList
        .filter((item) => extraCashIds.includes(item.id))
        .reduce(
          (acc, item) => {
            acc.names.push(item.id === "1560" ? "เงินเพิ่มพิเศษ" : (item.id === "1563" ? "เงินพิเศษวันหยุด" : item.name));
            acc.sumSpSalary += Number(item.SpSalary) || 0;
            return acc;
          },
          { names: [], sumSpSalary: 0 }
        );
      
      const concatenatedNamesExtraCash = resultExtraCash.names.length > 0 ? resultExtraCash.names.join("/") : "";
      
      // จ่ายชดเชยวันลา
      const totalSpSalaryCompensation = addSalaryPayCompensationFiltered.reduce(
        (sum, salary) => sum + parseFloat(salary.SpSalary || 0),
        0
      );
      
      // รายการหัก
      const tax = parseFloat(currentEmployee.tax || 0);
      const socialSecurity = parseFloat(currentEmployee.socialSecurity || 0);
      const advance = parseFloat(currentEmployee.deductSalaryList?.[0]?.amount || 0);
      
      // คำนวณยอดรวม
      const incomeTotal = 
        parseFloat(currentEmployee?.sumCashWork || '0') + 
        parseFloat(currentEmployee?.sumCashOt || '0') +
        parseFloat(currentEmployee?.publicHolidayCash || '0') + 
        parseFloat(
          currentEmployee?.addSalaryList?.reduce(
            (total, item) => total + parseFloat(item.SpSalary || '0'),
            0
          ) || '0'
        );
      
      const totalDeductions = tax + socialSecurity + advance;
      const netSalary = incomeTotal - totalDeductions;
      
      // สร้าง worksheet ใหม่สำหรับพนักงานแต่ละคน
      const ws = wb.addWorksheet(`พนักงาน ${currentEmployee.employeeId}`);
      
      // ตั้งค่าความกว้างคอลัมน์
      ws.columns = [
        { width: 22 },   // A - รายได้
        { width: 10 },   // B - จำนวน
        { width: 13 },   // C - จำนวนเงิน
        { width: 22 },   // D - รายการหัก
        { width: 13 },   // E - จำนวนเงิน
        { width: 13 }    // F - วันที่จ่าย/เงินรับสุทธิ
      ];
      
      // ตั้งค่า Page Setup สำหรับ A4 แนวตั้ง
      ws.pageSetup = {
        paperSize: 9,
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0
      };
      
      // ตั้งค่า margins สำหรับ A4
      ws.margins = {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3
      };
      
      // Header - ใบจ่ายเงินเดือน
      const titleRow = ws.addRow(['ใบจ่ายเงินเดือน']);
      titleRow.height = 25;
      titleRow.getCell(1).font = { bold: true, size: 14 };
      titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      ws.mergeCells('A1:F1');
      
      // บริษัท
      const companyRow = ws.addRow(['บริษัท โอวาท โปร แอนด์ ควิก จำกัด']);
      companyRow.height = 25;
      companyRow.getCell(1).font = { bold: true, size: 14 };
      companyRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      ws.mergeCells('A2:F2');
      
      // เว้นบรรทัดว่าง
      ws.addRow([]);
      
      // บรรทัดแรก: รหัส + พนักงาน + วันที่จ่าย
      const infoRow = ws.addRow(['รหัส', currentEmployee.employeeId, 'พนักงาน', `${currentEmployee.employeeId} ชาลีบัญชี`, 'เลขที่บัญชี', banknumber]);
      infoRow.height = 25;
      for (let i = 1; i <= 6; i++) {
        const cell = infoRow.getCell(i);
        cell.font = { size: 11 };
        if (i % 2 === 0) { // ค่าของข้อมูล
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else { // หัวข้อ
          cell.font = { bold: true, size: 11 };
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      }
      
      // เว้นบรรทัดว่าง
      ws.addRow([]);
      
      // Header ตาราง - ใช้รูปแบบตามรูปที่ให้มา
      const headerRow = ws.addRow(['รายได้', 'จำนวน', 'จำนวนเงิน', 'รายการหัก / รายการคืน', 'จำนวนเงิน', 'วันที่จ่าย']);
      headerRow.height = 25;
      for (let i = 1; i <= 6; i++) {
        const cell = headerRow.getCell(i);
        cell.font = { bold: true, size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F0F0F0' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
      
      const headerRow2 = ws.addRow(['Earnings', 'Number', 'Amount', '', 'Amount', 'Payroll Date']);
      headerRow2.height = 25;
      for (let i = 1; i <= 6; i++) {
        const cell = headerRow2.getCell(i);
        cell.font = { bold: true, size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F0F0F0' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
      
      // สร้างรายการรายได้ในตาราง
      let rowIndex = 8; // เริ่มจากแถวที่ 8 (หลังจาก header)
      let deductRowIndex = 8; // แถวสำหรับรายการหัก
      
      // สร้างฟังก์ชันสำหรับเพิ่มแถว
      const addIncomeRow = (item, count, amount, deductItem = '', deductAmount = '', dateInfo = '') => {
        const row = ws.addRow([item, count, amount, deductItem, deductAmount, dateInfo]);
        row.height = 25;
        
        // จัดรูปแบบแถวรายได้
        for (let i = 1; i <= 6; i++) {
          const cell = row.getCell(i);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // จัดรูปแบบตามประเภทข้อมูล
          if (i === 1 || i === 4) { // ชื่อรายการ
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            cell.font = { size: 10 };
          } else if (i === 2) { // จำนวน
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { size: 10 };
          } else if (i === 3 || i === 5) { // จำนวนเงิน
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
            cell.font = { size: 10 };
          } else if (i === 6) { // วันที่จ่าย
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { size: 10 };
          }
        }
        
        rowIndex++;
        return row;
      };
      
      // เงินเดือน
      if (currentEmployee.sumCashWorkMul?.["1"] > 0) {
        addIncomeRow(
          'เงินเดือน', 
          workDays, 
          formatNumber(currentEmployee.sumCashWorkMul["1"]), 
          '', 
          '', 
          '30/05/2025'
        );
      }
      
      // วันหยุดนักขัตฤกษ์
      const pubDayCount = parseFloat(currentEmployee.publicHolidayCount || 0);
      if (pubDayCount > 0) {
        addIncomeRow(
          'วันหยุดนักขัตฤกษ์', 
          '1', 
          formatNumber(currentEmployee.publicHolidayCash), 
          'ภาษีเงินได้', 
          '0.00', 
          ''
        );
      }
      
      // ค่าล่วงเวลา 1.5 เท่า
      const ot15Hours = parseFloat(currentEmployee.sumOt1p5 || 0);
      if (ot15Hours > 0 && currentEmployee.sumCashWorkMul?.["1.5"] > 0) {
        addIncomeRow(
          'ค่าล่วงเวลา 1.5 เท่า', 
          ot15Hours.toFixed(2), 
          formatNumber(currentEmployee.sumCashWorkMul["1.5"]), 
          'สมทบประกันสังคม', 
          formatNumber(socialSecurity), 
          ''
        );
      }
      
      // ค่าล่วงเวลา 2 เท่า
      const ot2Hours = parseFloat(currentEmployee.sumOtPublicHoliday || 0);
      if (ot2Hours > 0 && currentEmployee.sumCashWorkMul?.["2"] > 0) {
        addIncomeRow(
          'ค่าล่วงเวลา 2 เท่า', 
          ot2Hours.toFixed(2), 
          formatNumber(currentEmployee.sumCashWorkMul["2"]), 
          '', 
          '', 
          ''
        );
      }
      
      // ค่าล่วงเวลา 3 เท่า
      const ot3Hours = parseFloat(currentEmployee.sumOt3 || 0);
      if (ot3Hours > 0 && currentEmployee.sumCashWorkMul?.["3"] > 0) {
        addIncomeRow(
          'ค่าล่วงเวลา 3 เท่า', 
          ot3Hours.toFixed(2), 
          formatNumber(currentEmployee.sumCashWorkMul["3"]), 
          '', 
          '', 
          ''
        );
      }
      
      // คาคิงทาง
      if (result.sumSpSalary > 0) {
        addIncomeRow(
          'คาคิงทาง', 
          '', 
          formatNumber(result.sumSpSalary), 
          '', 
          '', 
          ''
        );
      }
      
      // เบี้ยขยัน
      if (sumAmountHardWorking > 0) {
        addIncomeRow(
          'เบี้ยขยัน', 
          '', 
          formatNumber(sumAmountHardWorking), 
          '', 
          '', 
          ''
        );
      }
      
      // ค่าอาหาร
      if (sumAddSalaryFood > 0) {
        addIncomeRow(
          'ค่าอาหาร', 
          '', 
          formatNumber(sumAddSalaryFood), 
          '', 
          '', 
          ''
        );
      }
      
      // ค่าเงินพิเศษ
      if (sumAddSpecialCash > 0) {
        addIncomeRow(
          'ค่าเงินพิเศษ', 
          '', 
          formatNumber(sumAddSpecialCash), 
          '', 
          '', 
          ''
        );
      }
      
      // จ่ายชดเชยวันลา
      if (totalSpSalaryCompensation > 0) {
        addIncomeRow(
          'จ่ายชดเชยวันลา', 
          '', 
          formatNumber(totalSpSalaryCompensation), 
          '', 
          '', 
          ''
        );
      }
      
      // เพิ่มแถวว่าง
      ws.addRow([]);
      
      // แถวรวม
      const totalRow = ws.addRow(['รวมเงินได้', '', formatNumber(incomeTotal), 'รายการหัก / รายการคืน', formatNumber(totalDeductions), 'เงินรับสุทธิ']);
      totalRow.height = 25;
      
      // จัดรูปแบบแถวรวม
      for (let i = 1; i <= 6; i++) {
        const cell = totalRow.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        if (i === 1 || i === 4) { // หัวข้อ
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
          cell.font = { bold: true, size: 10 };
        } else if (i === 3 || i === 5) { // จำนวนเงิน
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.font = { bold: true, size: 10 };
        } else {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { size: 10 };
        }
      }
      
      // แถว Total Earning
      const totalRow2 = ws.addRow(['Total Earning', '', '', 'Total Deduction', '', 'Net To Pay']);
      totalRow2.height = 25;
      
      // จัดรูปแบบแถว Total Earning
      for (let i = 1; i <= 6; i++) {
        const cell = totalRow2.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        if (i === 1 || i === 4 || i === 6) { // หัวข้อ
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
          cell.font = { bold: true, size: 10 };
        } else {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { size: 10 };
        }
      }
      
      // แถวจำนวนเงินสุทธิ
      const netPayRow = ws.addRow(['', '', '', '', '', formatNumber(netSalary)]);
      netPayRow.height = 25;
      
      // จัดรูปแบบแถวเงินสุทธิ
      for (let i = 1; i <= 6; i++) {
        const cell = netPayRow.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        if (i === 6) { // จำนวนเงินสุทธิ
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.font = { bold: true, size: 10 };
        } else {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { size: 10 };
        }
      }
      
      // เพิ่มแถวว่าง
      ws.addRow([]);
      
      // ตารางข้อมูลสะสม (ตามรูปภาพ)
      const accumulatedRow = ws.addRow(['เงินได้สะสมต่อปี', 'ภาษีสะสมต่อปี', 'เงินสะสมกองทุนต่อปี', 'เงินประกันสะสมต่อปี', 'ค่าลดหย่อนอื่นๆ']);
      accumulatedRow.height = 25;
      
      // จัดรูปแบบแถวข้อมูลสะสม
      for (let i = 1; i <= 5; i++) {
        const cell = accumulatedRow.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { size: 10 };
      }
      
      // แถวข้อมูลสะสม (ค่าว่าง)
      const accumulatedValueRow = ws.addRow(['', '', '', '', '']);
      accumulatedValueRow.height = 25;
      
      // จัดรูปแบบแถวค่าว่าง
      for (let i = 1; i <= 5; i++) {
        const cell = accumulatedValueRow.getCell(i);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
      
      // เพิ่มแถวว่าง
      ws.addRow([]);
      
      // แถวลงชื่อพนักงาน
      const signatureRow = ws.addRow(['', '', '', '', 'ลงชื่อพนักงาน']);
      signatureRow.height = 25;
      signatureRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
      signatureRow.getCell(5).font = { size: 10 };
    }
    
    // สร้างและบันทึกไฟล์ Excel ด้วย ExcelJS
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // ดาวน์โหลดไฟล์
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log("✅ Excel file generated successfully");
    
  } catch (error) {
    console.error("❌ Error generating Excel:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง Excel");
  }
};

export default generateExcelWithExcelJS;
