import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, Font, BlobProvider } from '@react-pdf/renderer';
import { FileEarmarkPdf, Download, Eye } from 'react-bootstrap-icons';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';

Font.register({
  family: 'THSarabunNew',
  src: './public/assets/fonts/THSarabunNew.ttf'
});
// Create styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'THSarabunNew' 
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #CCCCCC',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    paddingVertical: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 5
  },
  tableCell: {
    flex: 1,
    padding: 5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666'
  }
});

// Create Bank Report PDF Document Component
const BankReportPDF = ({ bankData = {} }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles}>บริษัท โอวาท โปร แอนด์ ควิก จำกัด{'\n'}
          <Text style={pdfStyles.header}>รายงานโอนเงินเข้าบัญชี </Text>
        </Text>
    
      </View>
      
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>ข้อมูลบัญชี</Text>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableCell}>หมายเลขบัญชี:</Text>
          <Text style={pdfStyles.tableCell}>{bankData.accountNumber || 'N/A'}</Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableCell}>ชื่อเจ้าของบัญชี:</Text>
          <Text style={pdfStyles.tableCell}>{bankData.accountHolder || 'N/A'}</Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableCell}>ยอดเงินคงเหลือ:</Text>
          <Text style={pdfStyles.tableCell}>{bankData.balance || '฿0.00'}</Text>
        </View>
      </View>
      
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>รายการเดินบัญชีล่าสุด</Text>
        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.tableCell}>วันที่</Text>
          <Text style={pdfStyles.tableCell}>รายละเอียด</Text>
          <Text style={pdfStyles.tableCell}>จำนวนเงิน</Text>
        </View>
        {(bankData.transactions || []).map((transaction, index) => (
          <View key={index} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableCell}>{transaction.date || 'N/A'}</Text>
            <Text style={pdfStyles.tableCell}>{transaction.description || 'N/A'}</Text>
            <Text style={pdfStyles.tableCell}>{transaction.amount || '฿0.00'}</Text>
          </View>
        ))}
      </View>
      
      <View style={pdfStyles.footer}>
        <Text>สร้างเมื่อ {new Date().toLocaleDateString('th-TH')} - เอกสารนี้ใช้เพื่อการอ้างอิงเท่านั้น</Text>
      </View>
    </Page>
  </Document>
);

// Main Component with Preview Button
const BankReportComponent = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data - replace with your actual data
  const bankData = {
    accountNumber: '1234567890',
    accountHolder: 'นายสมชาย ใจดี',
    balance: '฿5,432.10',
    transactions: [
      { date: '25/05/2568', description: 'เงินเดือนเข้าบัญชี', amount: '+฿3,000.00' },
      { date: '24/05/2568', description: 'ซุปเปอร์มาร์เก็ต', amount: '-฿85.75' },
      { date: '22/05/2568', description: 'ค่าไฟฟ้า', amount: '-฿120.00' },
      { date: '18/05/2568', description: 'ร้านอาหาร', amount: '-฿45.50' },
      { date: '15/05/2568', description: 'ถอนเงินจากตู้ ATM', amount: '-฿200.00' }
    ]
  };

  // ฟังก์ชันสำหรับการแสดงตัวอย่าง PDF
  const handleTogglePreview = () => {
    if (!showPreview) {
      setIsLoading(true);
      // ใช้ setTimeout เพื่อให้ UI มีเวลาอัปเดตก่อนที่จะโหลด PDF Viewer
      setTimeout(() => {
        setShowPreview(true);
        setIsLoading(false);
      }, 500);
    } else {
      setShowPreview(false);
    }
  };

  // ฟังก์ชันสำหรับการดาวน์โหลด PDF
  const handleDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'รายงานบัญชีธนาคาร.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content-wrapper" style={{ marginLeft: 'auto', paddingLeft: '1rem', paddingRight: '1rem', maxWidth: 'calc(100% - 250px)' }}>
      <Container fluid className="my-4">
        <Card className="shadow">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0"><FileEarmarkPdf className="me-2" />รายงานรายการบัญชีธนาคาร</h4>
          </Card.Header>
          
          <Card.Body>
            <Row className="mb-4">
              <Col>
                <p className="lead">สร้างและดูรายงานสรุปบัญชีของคุณในรูปแบบ PDF</p>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h5>ข้อมูลบัญชี</h5>
                    <p><strong>หมายเลขบัญชี:</strong> {bankData.accountNumber}</p>
                    <p><strong>ชื่อเจ้าของบัญชี:</strong> {bankData.accountHolder}</p>
                    <p><strong>ยอดเงินคงเหลือ:</strong> {bankData.balance}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100">
                  <Card.Body>
                    <h5>ตัวเลือกรายงาน</h5>
                    <p>สร้างรายงาน PDF ที่มีรายการเดินบัญชีล่าสุดและสรุปข้อมูลบัญชีของคุณ</p>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={handleTogglePreview}
                        className="mb-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            กำลังโหลด...
                          </>
                        ) : (
                          <>
                            <Eye className="me-2" /> 
                            {showPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง PDF'}
                          </>
                        )}
                      </Button>
                      
                      <BlobProvider document={<BankReportPDF bankData={bankData} />}>
                        {({ blob, url, loading, error }) => (
                          <Button 
                            variant="success"
                            disabled={loading || error}
                            onClick={() => blob && handleDownload(blob)}
                          >
                            {loading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                กำลังโหลดเอกสาร...
                              </>
                            ) : (
                              <><Download className="me-2" /> ดาวน์โหลด PDF</>
                            )}
                          </Button>
                        )}
                      </BlobProvider>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {showPreview && (
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <PDFViewer width="100%" height="500px" className="border rounded">
                        <BankReportPDF bankData={bankData} />
                      </PDFViewer>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default BankReportComponent;