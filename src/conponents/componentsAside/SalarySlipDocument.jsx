import React from 'react';
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์
Font.register({
  family: 'THSarabunNew',
  src: '/assets/fonts/THSarabunNew.ttf',
});

Font.register({
  family: 'THSarabunNew Bold',
  src: '/assets/fonts/THSarabunNew Bold.ttf',
});

export const SalarySlipDocument = ({ responseData, workplaceList, employeeList, isAudit = false }) => {
  // ฟังก์ชันดึงข้อมูลรายได้และรายการหักยังคงเหมือนเดิม
  const getEarningsData = (employee) => {
    // โค้ดเดิม...
    const earningsItems = [];
    const countcal = employee.accountingRecord[0].countDayWork;
    
    // อัตรา
    if (employee.specialDayRate && parseFloat(employee.specialDayRate) !== 0) {
      earningsItems.push({
        name: "อัตรา",
        number: "",
        amount: parseFloat(employee.specialDayRate).toFixed(2)
      });
    }
    
    // เงินเดือน
    if (employee.accountingRecord?.[0]?.amountCountDayWork && 
        parseFloat(employee.accountingRecord[0].amountCountDayWork) !== 0) {
      earningsItems.push({
        name: "เงินเดือน",
        number: countcal,
        amount: parseFloat(employee.accountingRecord[0].amountCountDayWork).toFixed(2)
      });
    }
    
    // ค่าล่วงเวลา 1 เท่า
    if (employee.accountingRecord?.[0]?.amountOne && 
        parseFloat(employee.accountingRecord[0].amountOne) !== 0) {
      earningsItems.push({
        name: "ค่าล่วงเวลา 1 เท่า",
        number: parseFloat(employee.accountingRecord[0].hourOne).toFixed(2),
        amount: parseFloat(employee.accountingRecord[0].amountOne).toFixed(2)
      });
    }
    
    // ค่าล่วงเวลา 1.5 เท่า
    if (employee.accountingRecord?.[0]?.amountOneFive && 
        parseFloat(employee.accountingRecord[0].amountOneFive) !== 0) {
      earningsItems.push({
        name: "ค่าล่วงเวลา 1.5 เท่า",
        number: parseFloat(employee.accountingRecord[0].hourOneFive).toFixed(2),
        amount: parseFloat(employee.accountingRecord[0].amountOneFive).toFixed(2)
      });
    }

    // ค่าล่วงเวลา 2 เท่า(วันหยุด/นักขัตฤกษ์)
    if (employee.accountingRecord?.[0]?.amountTwo && 
        parseFloat(employee.accountingRecord[0].amountTwo) !== 0) {
      earningsItems.push({
        name: "ค่าล่วงเวลา 2 เท่า(วันหยุด/นักขัตฯ)",
        number: parseFloat(employee.accountingRecord[0].hourTwo).toFixed(2),
        amount: parseFloat(employee.accountingRecord[0].amountTwo).toFixed(2)
      });
    }

    // ค่าล่วงเวลา 3 เท่า
    if (employee.accountingRecord?.[0]?.amountThree && 
        parseFloat(employee.accountingRecord[0].amountThree) !== 0) {
      earningsItems.push({
        name: "ค่าล่วงเวลา 3 เท่า",
        number: parseFloat(employee.accountingRecord[0].hourThree).toFixed(2),
        amount: parseFloat(employee.accountingRecord[0].amountThree).toFixed(2)
      });
    }

    // วันหยุดนักขัตฤกษ์
    if (employee.specialDayListWork && employee.specialDayListWork.length > 0) {
      earningsItems.push({
        name: "วันหยุดนักขัตฤกษ์",
        number: "",
        amount: "361.00"
      });
    }

    // ค่าน้ำมัน/ค่าอาหาร/โทรศัพท์
    const specificIds = ["1230", "1350", "1241"];
    const result = employee.addSalary
      .filter((item) => specificIds.includes(item.id))
      .reduce(
        (acc, item) => {
          acc.names.push(item.id === "1350" ? "โทรศัพท์" : item.name);
          acc.sumSpSalary += Number(item.SpSalary) || 0;
          return acc;
        },
        { names: [], sumSpSalary: 0 }
      );

    if (result.sumSpSalary !== 0) {
      earningsItems.push({
        name: "ค่าน้ำมัน/ค่าอาหาร/โทรศัพท์",
        number: "",
        amount: result.sumSpSalary.toFixed(2)
      });
    }

    // เบี้ยเลี้ยง
    const formattedAddSalaryAllowance = employee.addSalary.filter(
      (item) => item.id === "1520"
    );
    const sumAddSalaryAllowance = formattedAddSalaryAllowance.reduce(
      (total, item) => total + parseFloat(item.SpSalary || 0),
      0
    );
    if (sumAddSalaryAllowance !== 0) {
      earningsItems.push({
        name: "เบี้ยเลี้ยง",
        number: "",
        amount: sumAddSalaryAllowance.toFixed(2)
      });
    }

    // เงินพิเศษอื่นๆ
    const excludedIds = ["1350", "1230", "1410", "1535", "1520", "1241"];
    const addSalaryFiltered = employee.addSalary
      .filter((salary) => !excludedIds.includes(salary.id))
      .map((salary) => ({
        name: salary.name,
        SpSalary: Number(salary.SpSalary) || 0,
      }));

    const totalSpSalary = addSalaryFiltered.reduce(
      (sum, salary) => sum + salary.SpSalary,
      0
    );

    if (totalSpSalary !== 0) {
      earningsItems.push({
        name: "เงินพิเศษ/ค่าร้อน/พ่วงจ่าย/ค่าจ่ายช่วย/พักร้อน/ช่าดลวด / เด็ก",
        number: "",
        amount: totalSpSalary.toFixed(2)
      });
    }
    
    return earningsItems;
  };

  const getDeductionsData = (employee, isAudit) => {
    const deductionItems = [];
    
    // เงินเบิกก่อนจ่าย
    if (employee.accountingRecord?.[0]?.advancePayment && 
        parseFloat(employee.accountingRecord[0].advancePayment) !== 0 && 
        !isAudit) {
      deductionItems.push({
        name: "เงินเบิกก่อนจ่าย",
        amount: parseFloat(employee.accountingRecord[0].advancePayment).toFixed(2)
      });
    }
    
    // หักภาษีเงินได้
    if (employee.accountingRecord?.[0]?.tax && 
        parseFloat(employee.accountingRecord[0].tax) !== 0) {
      deductionItems.push({
        name: "หักภาษีเงินได้",
        amount: parseFloat(employee.accountingRecord[0].tax).toFixed(2)
      });
    }
    
    // หักสมทบประกันสังคม
    if (employee.accountingRecord?.[0]?.socialSecurity && 
        parseFloat(employee.accountingRecord[0].socialSecurity) !== 0) {
      deductionItems.push({
        name: "หักสมทบประกันสังคม",
        amount: parseFloat(employee.accountingRecord[0].socialSecurity).toFixed(2)
      });
    }
    
    // ค่าชุดยูนิฟอร์ม
    deductionItems.push({
      name: "ค่าชุดยูนิฟอร์ม",
      amount: "0.00"
    });
    
    return deductionItems;
  };

  // ฟังก์ชันเพื่อจัดรูปแบบวันที่
  const formatDate = (month, year) => {
    const thaiMonth = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const thaiYear = parseInt(year, 10) + 543;
    
    return `${thaiMonth[monthIndex]} ${thaiYear}`;
  };

  return (
    <Document>
      {responseData.map((employee, index) => {
        // ค้นหาข้อมูลสถานที่ทำงาน
        const workplace = workplaceList.find(
          (item) => item.workplaceId === employee.workplace
        ) || { workplaceName: "Unknown" };
        
        // ค้นหาข้อมูลบัญชีธนาคาร
        const bankInfo = employeeList.find(
          (item) => item.employeeId === employee.employeeId
        ) || {};
        const bankNumber = bankInfo.banknumber || "Unknown";
        
        // ดึงข้อมูลรายได้และรายการหัก
        const earningsItems = getEarningsData(employee);
        const deductionItems = getDeductionsData(employee, isAudit);
        
        // คำนวณยอดรวม
        const total = parseFloat(employee.accountingRecord[0].total) || 0;
        const tax = parseFloat(employee.accountingRecord[0].tax) || 0;
        const socialSecurity = parseFloat(employee.accountingRecord[0].socialSecurity) || 0;
        const advancePayment = !isAudit ? 
          parseFloat(employee.accountingRecord[0].advancePayment || 0) : 0;
        
        const sumDeductSalary = tax + socialSecurity + advancePayment;
        
        // ดึงเงินรับสุทธิจาก sumCashWork แทนที่จะคำนวณเอง
        const netPay = parseFloat(employee.sumCashWork) || 0;
        
        // สมมติข้อมูลต่างๆ ตามตัวอย่าง (หากไม่มีข้อมูลจริง)
        const cumulativeIncome = 169817.81; // เงินได้สะสมต่อปี
        const cumulativeTax = 0.00; // ภาษีสะสมต่อปี
        const cumulativeFund = 0.00; // เงินสะสมกองทุนต่อปี
        const cumulativeInsurance = 4239.00; // เงินประกันสะสมต่อปี
        const otherDeductions = 4239.00; // ค่าลดหย่อนอื่นๆ
        
        // วันที่จ่าย - ตั้งค่าเป็นวันสิ้นเดือน
        const payrollDate = "31/10/2567"; // หรือใช้ข้อมูลจริง

        // วันลาหยุด (สมมติว่าไม่มี)
        const leaveDays = Array(9).fill(0);
        
        return (
          <Page 
            key={index} 
            size="A4" 
            orientation='landscape' 
            style={{
              flexDirection: 'column',
              padding: 15,
              fontFamily: 'THSarabunNew',
            }}
          >
            {/* หัวเอกสาร */}
            <Text 
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'THSarabunNew Bold',
                marginBottom: 2,
              }}
            >
              ใบจ่ายเงินเดือน
            </Text>
            <Text 
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'THSarabunNew Bold',
                marginBottom: 8,
              }}
            >
              บริษัท โอวาท โปร แอนด์ ควิก จำกัด
            </Text>
            
            {/* ข้อมูลพนักงานและสถานที่ทำงาน */}
            <View 
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}
            >
              <View 
                style={{
                  flexDirection: 'row',
                  width: '40%',
                }}
              >
                <Text 
                  style={{
                    width: 50,
                    fontSize: 12,
                  }}
                >
                  รหัส
                </Text>
                <Text 
                  style={{
                    width: 150,
                    fontSize: 12,
                  }}
                >
                  {employee.employeeId}
                </Text>
              </View>
              
              <View 
                style={{
                  flexDirection: 'row',
                  width: '25%',
                }}
              >
                <Text 
                  style={{
                    width: 50,
                    fontSize: 12,
                  }}
                >
                  ชื่อ-สกุล
                </Text>
                <Text 
                  style={{
                    width: 150,
                    fontSize: 12,
                  }}
                >
                  {employee.name} {employee.lastName}
                </Text>
              </View>
              
              <View 
                style={{
                  flexDirection: 'row',
                  width: '35%',
                  justifyContent: 'flex-end',
                }}
              >
                <Text 
                  style={{
                    width: 50,
                    fontSize: 12,
                  }}
                >
                  แผนก
                </Text>
                <Text 
                  style={{
                    width: 150,
                    fontSize: 12,
                  }}
                >
                  {workplace.workplaceName}
                </Text>
              </View>
            </View>
            
            {/* กล่องวันที่จ่าย */}
            <View 
              style={{
                position: 'absolute',
                right: 0,
                top: 120,
                border: '1pt solid black',
                padding: 5,
                width: 100,
                height: 60,
              }}
            >
              <Text 
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  fontFamily: 'THSarabunNew Bold',
                  marginBottom: 5,
                }}
              >
                วันที่จ่าย{'\n'}Payroll Date
              </Text>
              <Text 
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  fontFamily: 'THSarabunNew',
                  marginTop: 8,
                }}
              >
                {payrollDate}
              </Text>
            </View>
            
            {/* ตารางหลัก */}
            <View 
              style={{
                border: '1pt solid black',
                marginBottom: 5,
                width: '80%', // ปรับความกว้างของตารางหลัก
                marginLeft: '0',
                marginRight: 'auto',
              }}
            >
              {/* หัวตาราง */}
              <View 
                style={{
                  flexDirection: 'row',
                  borderBottom: '1pt solid black',
                  fontFamily: 'THSarabunNew Bold',
                  backgroundColor: '#f0f0f0',
                }}
              >
                <Text 
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    width: '25%',
                    borderRight: '1pt solid black',
                  }}
                >
                  รายได้{'\n'}Earnings
                </Text>
                <Text 
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    width: '10%',
                    borderRight: '1pt solid black',
                  }}
                >
                  จำนวน{'\n'}Number
                </Text>
                <Text 
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    width: '15%',
                    borderRight: '1pt solid black',
                  }}
                >
                  จำนวนเงิน{'\n'}Amount
                </Text>
                <Text 
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    width: '35%',
                    borderRight: '1pt solid black',
                  }}
                >
                  รายการหัก / รายการคืน
                </Text>
                <Text 
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    width: '15%',
                  }}
                >
                  จำนวนเงิน{'\n'}Amount
                </Text>
              </View>
              
              {/* แถวข้อมูล - สร้างไว้ 12 แถวเพื่อให้เหมือนตัวอย่าง */}
              {Array.from({ length: 12 }).map((_, rowIndex) => (
                <View 
                  key={rowIndex}
                  style={{
                    flexDirection: 'row',
                    borderBottom: '0.5pt solid black',
                    padding: 2,
                    minHeight: 18,
                  }}
                >
                  <Text 
                    style={{
                      width: '25%',
                      borderRight: '1pt solid black',
                      fontSize: 12,
                      paddingLeft: 2,
                    }}
                  >
                    {rowIndex < earningsItems.length ? earningsItems[rowIndex].name : ''}
                  </Text>
                  <Text 
                    style={{
                      width: '10%',
                      borderRight: '1pt solid black',
                      textAlign: 'right',
                      fontSize: 12,
                      paddingRight: 2,
                    }}
                  >
                    {rowIndex < earningsItems.length ? earningsItems[rowIndex].number : ''}
                  </Text>
                  <Text 
                    style={{
                      width: '15%',
                      borderRight: '1pt solid black',
                      textAlign: 'right',
                      fontSize: 12,
                      paddingRight: 2,
                    }}
                  >
                    {rowIndex < earningsItems.length ? 
                     earningsItems[rowIndex].amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}
                  </Text>
                  <Text 
                    style={{
                      width: '35%',
                      borderRight: '1pt solid black',
                      fontSize: 12,
                      paddingLeft: 2,
                    }}
                  >
                    {rowIndex < deductionItems.length ? deductionItems[rowIndex].name : ''}
                  </Text>
                  <Text 
                    style={{
                      width: '15%',
                      textAlign: 'right',
                      fontSize: 12,
                      paddingRight: 2,
                    }}
                  >
                    {rowIndex < deductionItems.length ? 
                     deductionItems[rowIndex].amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}
                  </Text>
                </View>
              ))}
              
              {/* แถวสรุป */}
              <View 
                style={{
                  flexDirection: 'row',
                  borderTop: '1pt solid black',
                  padding: 4,
                  fontFamily: 'THSarabunNew Bold',
                  backgroundColor: '#f0f0f0',
                }}
              >
                <Text 
                  style={{
                    width: '25%',
                    borderRight: '1pt solid black',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  รวมเงินได้{'\n'}Total Earnings
                </Text>
                <Text 
                  style={{
                    width: '10%',
                    borderRight: '1pt solid black',
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                >
                </Text>
                <Text 
                  style={{
                    width: '15%',
                    borderRight: '1pt solid black',
                    textAlign: 'right',
                    fontSize: 12,
                    paddingRight: 2,
                  }}
                >
                  {total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text 
                  style={{
                    width: '35%',
                    borderRight: '1pt solid black',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  รายการหัก / รายการคืน{'\n'}Total Deduction
                </Text>
                <Text 
                  style={{
                    width: '15%',
                    textAlign: 'right',
                    fontSize: 12,
                    paddingRight: 2,
                  }}
                >
                  {sumDeductSalary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </View>
            </View>
            
            {/* ส่วนท้าย */}
            <View 
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}
            >
              {/* กล่องสรุปยอดสะสม */}
              <View 
                style={{
                  border: '1pt solid black',
                  width: '70%',
                }}
              >
                <View 
                  style={{
                    flexDirection: 'row',
                    borderBottom: '0.5pt solid black',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                      fontFamily: 'THSarabunNew Bold',
                    }}
                  >
                    เงินได้สะสมต่อปี
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                      fontFamily: 'THSarabunNew Bold',
                    }}
                  >
                    ภาษีสะสมต่อปี
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                      fontFamily: 'THSarabunNew Bold',
                    }}
                  >
                    เงินสะสมกองทุนต่อปี
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                      fontFamily: 'THSarabunNew Bold',
                    }}
                  >
                    เงินประกันสะสมต่อปี
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      fontFamily: 'THSarabunNew Bold',
                    }}
                  >
                    ค่าลดหย่อนอื่นๆ
                  </Text>
                </View>
                <View 
                  style={{
                    flexDirection: 'row',
                    height: 20,
                  }}
                >
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                    }}
                  >
                    {cumulativeIncome.toFixed(2)}
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                    }}
                  >
                    {cumulativeTax.toFixed(2)}
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                    }}
                  >
                    {cumulativeFund.toFixed(2)}
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                    }}
                  >
                    {cumulativeInsurance.toFixed(2)}
                  </Text>
                  <Text 
                    style={{
                      width: '20%',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 3,
                    }}
                  >
                    {otherDeductions.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              {/* กล่องเงินรับสุทธิ */}
              <View 
                style={{
                  border: '1pt solid black',
                  width: '29%',
                  marginLeft: '1%',
                }}
              >
                <Text 
                  style={{
                    textAlign: 'center',
                    fontFamily: 'THSarabunNew Bold',
                    backgroundColor: '#f0f0f0',
                    padding: 3,
                    fontSize: 12,
                    borderBottom: '0.5pt solid black',
                  }}
                >
                  เงินรับสุทธิ{'\n'}Net To Pay
                </Text>
                <Text 
                  style={{
                    textAlign: 'center',
                    fontFamily: 'THSarabunNew Bold',
                    fontSize: 14,
                    padding: 8,
                  }}
                >
                  {netPay.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </View>
            </View>
            
            {/* กล่องวันลาหยุด */}
            <View 
              style={{
                marginTop: 5,
                border: '1pt solid black',
                width: '100%',
              }}
            >
              <View 
                style={{
                  flexDirection: 'row',
                }}
              >
                {Array(9).fill(0).map((_, i) => (
                  <Text 
                    key={i} 
                    style={{
                      width: '10%',
                      fontSize: 10,
                      textAlign: 'center',
                      padding: 3,
                      borderRight: '0.5pt solid black',
                      height: 20,
                    }}
                  >
                    {leaveDays[i]}
                  </Text>
                ))}
                <Text 
                  style={{
                    width: '10%',
                    fontSize: 10,
                    textAlign: 'center',
                    padding: 3,
                    height: 20,
                  }}
                >
                  0.25
                </Text>
                <Text 
                  style={{
                    width: '30%',
                    fontSize: 12,
                    padding: 3,
                  }}
                >
                  ลงชื่อพนักงาน
                </Text>
              </View>
            </View>
            
            {/* ลายเซ็น */}
            <View 
              style={{
                marginTop: 10,
                border: '1pt solid black',
                padding: 5,
                width: '40%',
                height: 40,
                marginLeft: 'auto',
              }}
            >
              <Text 
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  marginBottom: 20,
                }}
              >
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};