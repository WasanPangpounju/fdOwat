import endpoint from "../../config";

import axios from "axios";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { registerLocale } from 'react-datepicker';
import { ThaiDatePicker } from "thaidatepicker-react";
import { FaCalendarAlt } from "react-icons/fa"; // You can use any icon library

const SendEmployeePDF2 = ({ employeeList }) => {
  // const [input1, setInput1] = useState('');
  // const [input2, setInput2] = useState('');

  // const [inputValuesTest, setInputValuesTest] = useState([
  //     { input1: '', input2: '' } // Initial object structure
  // ]);

  // const handleInputChangeTest = (index, inputField, value) => {
  //     const newInputValues = [...inputValuesTest];
  //     newInputValues[index][inputField] = value;
  //     setInputValuesTest(newInputValues);
  // };

  // const addInput = () => {
  //     setInputValuesTest([...inputValuesTest, { input1: '', input2: '' }]);
  // };

  // const deleteInput = (index) => {
  //     const newInputValues = [...inputValuesTest];
  //     newInputValues.splice(index, 1);
  //     setInputValuesTest(newInputValues);
  // };
  const absoluteBottomStyle = {
    position: "absolute",
    bottom: "0rem",
    // Add other styles as needed
  };

  const [title, setTitle] = useState(
    "ชี้แจงหนังสือรับรองวุฒิการศึกษาทำงานพนักงานทำความสะอาด"
  );
  const [invite, setInvite] = useState(
    "ประธานกรรมการตรวจรับ สัญญาเลขที่ C40180001342(OP) ลงวันที่ 1 กุมภาพันธ์ 2566"
  );
  const [content, setContent] = useState(
    "บริษัท โอวาท โปร แอนด์ ควิก จำกัด ขอขอบพระคุณเป็นอย่างยิ่งที่ท่านได้ไว้วางใจให้บริษัท ฯ ได้รับใช้ทำความสะอาดด้วยดีเสมอมา"
  );
  const [content2, setContent2] = useState(
    "เพื่อเข้าปฏิบัตหน้าที่พนักงานประจำอาคารสถาบันวิจัยจุฬาภรณ์ เป็นต้นไป"
  );

  const [signature, setSignature] = useState("นางสาวอสีดะห์ ยาบ");
  const [positionHead, setPositionHead] = useState("ผู้จัดการฝ่ายบุคคล");

  const [codeClose, setCodeClose] = useState("FM-HR-024-03-01/07/63");

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const [prefix, setPrefix] = useState("");

  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idCard, setIdCard] = useState("");
  const [address, setAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [position, setPosition] = useState("");
  const [educational, setEducational] = useState("");

  const [inputValuesTest, setInputValuesTest] = useState([]);
  const [inputValuesFirst, setInputValuesFirst] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
const [signatureFile, setSignatureFile] = useState(null);

  const [workDate, setWorkDate] = useState(new Date());
  // const formattedWorkDate = moment(workDate).format('DD/MM/YYYY');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formattedDate321, setFormattedDate] = useState(null);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false); // Hide date picker after selecting a date
    const newDate = new Date(date);
    setWorkDate(newDate);
  };

  useEffect(() => {
    if (selectedDate) {
      // Convert the string to a Date object
      const date = new Date(selectedDate);

      // Extract day, month, and year
      const daySelectedDate = date.getDate().toString().padStart(2, "0");
      const monthSelectedDate = (date.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const yearSelectedDate = (date.getFullYear() + 543).toString();

      // Format the date
      const formattedDate = `${daySelectedDate}/${monthSelectedDate}/${yearSelectedDate}`;
      console.log("formattedDate", formattedDate);
      setFormattedDate(formattedDate);
    }
  }, [selectedDate]);

  console.log("selectedDate", selectedDate);
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handletitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handlesignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleCodeCloseChange = (event) => {
    setCodeClose(event.target.value);
  };
  const handlepositionHeadChange = (event) => {
    setPositionHead(event.target.value);
  };

  const handleinviteChange = (event) => {
    setInvite(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const handleContent2Change = (event) => {
    setContent2(event.target.value);
  };
  // const handleWorkDateChange = (date) => {
  //     setWorkDate(date);
  // };

  // registerLocale('th', th);

  useEffect(() => {
    if (input1 && employeeList.length > 0) {
      const employee = employeeList.find((emp) => emp.employeeId === input1);
      if (employee) {
        setInput2(employee.name || "");

        setPrefix(employee.prefix || "");
        setLastName(employee.lastName || "");
        setAge(employee.age || "");
        // setDateOfBirth(employee.dateOfBirth || '');
        if (employee.dateOfBirth) {
          setDateOfBirth(employee.dateOfBirth);
        } else {
          employee.dateOfBirth = null;
          setDateOfBirth("");
        }
        setIdCard(employee.idCard || "");
        setAddress(employee.address || "");
        setCurrentAddress(employee.currentAddress || "");
        setPhoneNumber(employee.phoneNumber || "");
        setMaritalStatus(employee.maritalStatus || "");
        setEmergencyContactNumber(employee.emergencyContactNumber || "");

        setPosition(employee.position || "");
      }
    }
  }, [input1, employeeList]);

  const addInput = () => {
  setInputValuesTest([
    ...inputValuesTest,
    {
      Id: input1,
      Name: prefix + input2 + " " + lastName,
      age: age,
      dateOfBirth: dateOfBirth,
      idCard: idCard,
      address: address,
      currentAddress: currentAddress,
      phoneNumber: phoneNumber,
      maritalStatus: maritalStatus,
      emergencyContactNumber: emergencyContactNumber,
      profileImage: profilePicture // เก็บข้อมูลรูปภาพ
    },
  ]);
  
  setInputValuesFirst([
    ...inputValuesFirst,
    {
      Id: input1,
      Name: prefix + input2 + " " + lastName,
      position: position,
      educational: educational,
    },
  ]);


  setInput1("");
  setInput2("");
  setPrefix("");
  setLastName("");
  setAge("");
  setDateOfBirth("");
  setIdCard("");
  setAddress("");
  setCurrentAddress("");
  setPhoneNumber("");
  setMaritalStatus("");
  setEmergencyContactNumber("");
  setPosition("");
  setProfilePicture(null);
};

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        addInput();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [addInput]);

  const deleteInput = (index) => {
    const newInputValues = inputValuesTest.filter((_, i) => i !== index);
    setInputValuesTest(newInputValues);

    const newInputValuesFirst = inputValuesFirst.filter((_, i) => i !== index);
    setInputValuesFirst(newInputValuesFirst);
  };

  console.log("formattedDate321", formattedDate321);
const generatePDF2 = async () => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  

  const fontPath = "/assets/fonts/THSarabunNew Bold.ttf";
  doc.addFileToVFS(fontPath);
  doc.addFont(fontPath, "THSarabunNew-Bold", "normal");
  doc.setFont("THSarabunNew-Bold");
  doc.setFontSize(14);

  const OwatAddress = "/assets/images/new/OwatAddress.png";
  const OwatIcon = "/assets/images/new/OwatIcon.png";
  const OwatSupport = "/assets/images/new/icon_under.png";
  

  const getImageData = (file) => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  // สร้างหน้าแรกของ PDF
  const maxWidth = 150;
  const inviteLines = doc.splitTextToSize(`เรื่อง:     ` + title, maxWidth);
  const titleLines = doc.splitTextToSize(`เรียน:     ` + invite, maxWidth);
  const contentLines = doc.splitTextToSize(content, maxWidth);

  // Set the initial coordinates
  let x = 30;
  let y = 60;
  
  doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
  doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
  doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);

  

  
  

  inviteLines.forEach((line, index) => {
    if (index > 0) {
      x = 20;
    }
    doc.text(line, x, y);
    y += 8;
  });
  
  x = 30;
  titleLines.forEach((line, index) => {
    if (index > 0) {
      x = 20;
    }
    doc.text(line, x, y + inviteLines.length);
    y += 8;
  });
  
  x = 30;
  contentLines.forEach((line, index) => {
    if (index > 0) {
      x = 20;
    }
    doc.text(line, x, y + inviteLines.length + titleLines.length);
    y += 8;
  });
  
  x = 40;
  doc.text(
    `บริษัทฯ ใคร่ขอแจ้งให้ท่านทรบว่าพนักงานมรามีรายชื่อดั้งต่อไปนี้`,
    x,
    y + inviteLines.length + titleLines.length
  );
  
  doc.text(`วันที่ : ${formattedDate321}`, 130, 50);
  doc.text(codeClose, 160, 290);


  inputValuesFirst.forEach((value, index) => {
    if (index < 15) {
      const x = 40;
      const y =
        70 +
        10 * (titleLines.length + inviteLines.length + contentLines.length) +
        index * 10;
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${value.Name}`, x, y);
      doc.text(`ตำแหน่ง               ${value.position}`, x + 60, y);
      doc.text(codeClose, 160, 290);
    }
  });


  const autoContent2 = doc.splitTextToSize(content2, maxWidth);
  

if (inputValuesFirst.length < 16) {
  const lengthFirst = inputValuesFirst.length;
  
  if (inputValuesFirst.length + autoContent2.length > 10) {
    doc.addPage();
    doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
    doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
    doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
    y = 50;
    x = 30;
    
    autoContent2.forEach((line, index) => {
      if (index > 0) {
        x = 20;
      }
      doc.text(line, x, y);
      y += 10;
    });


    doc.text("ขอแสดงความนับถือ", 100 + x, 15 + y + 10 * autoContent2.length);
  

if (signatureFile) {
  try {
    const signatureData = await getImageData(signatureFile);
    if (signatureData) {
      doc.addImage(signatureData, "JPEG", 95 + x, 20 + y + 10 * autoContent2.length, 40, 20);
      doc.text("(" + signature + ")", 100 + x, 40 + y + 10 * autoContent2.length);
      doc.text(positionHead, 100 + x, 45 + y + 10 * autoContent2.length);
    } else {

      doc.text("(" + signature + ")", 100 + x, 35 + y + 10 * autoContent2.length);
      doc.text(positionHead, 100 + x, 40 + y + 10 * autoContent2.length);
    }
  } catch (error) {
    console.error("Error adding signature to PDF:", error);

    doc.text("(" + signature + ")", 100 + x, 35 + y + 10 * autoContent2.length);
    doc.text(positionHead, 100 + x, 40 + y + 10 * autoContent2.length);
  }
} else {
  
  doc.text("(" + signature + ")", 100 + x, 35 + y + 100 * autoContent2.length);
  doc.text(positionHead, 100 + x, 40 + y + 10 * autoContent2.length);
}
    
    doc.text(codeClose, 160, 290);
  } else {
    x = 30;
    autoContent2.forEach((line, index) => {
      if (index > 0) {
        x = 20;
      }
      doc.text(
        line,
        x,
        y +
        10 *
        (titleLines.length +
          inviteLines.length +
          contentLines.length +
          lengthFirst -
          2)
      );
      y += 10;
    });
    
    
    const signatureY = 15 + y + 10 * (titleLines.length + inviteLines.length + contentLines.length + lengthFirst + autoContent2.length - 2);
    
    doc.text(
      "ขอแสดงความนับถือ",
      100 + x,
      signatureY
    );
    
    
    if (signatureFile) {
      try {
        const signatureData = await getImageData(signatureFile);
          if (signatureData) {
          
            doc.addImage(signatureData, "JPEG", 95 + x, signatureY + 5, 40, 20);
            

            doc.text("(" + signature + ")", 100 + x, signatureY + 30);
            

            doc.text(
              positionHead,
              103 + x,
              signatureY + 35
            );
          } else {
       
          doc.text(
            "(" + signature + ")",
            100 + x,
            signatureY + 20
          );
          doc.text(
            positionHead,
            100 + x,
            signatureY + 25
          );
        }
      } catch (error) {
        console.error("Error adding signature to PDF:", error);
      
        doc.text(
          "(" + signature + ")",
          100 + x,
          signatureY + 20
        );
        doc.text(
          positionHead,
          100 + x,
          signatureY + 25
        );
      }
    } else {

      doc.text(
        "(" + signature + ")",
        100 + x,
        signatureY + 20
      );
      doc.text(
        positionHead,
        100 + x,
        signatureY + 25
      );
    }
  }
} else {
  doc.addPage();
}


  const arrayChunks = [];
  const chunkSize = 20;
  const initialIndex = 15;

  for (let i = initialIndex; i < inputValuesFirst.length; i += chunkSize) {
    arrayChunks.push(inputValuesFirst.slice(i, i + chunkSize));
  }

  arrayChunks.forEach((chunk, pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage();
    }
    doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
    doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
    doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
    
    chunk.forEach((value, index) => {
      x = 40;
      const y = 50 + index * 10;
      
      doc.setFontSize(14);
      const currentIndex = index + initialIndex + pageIndex * chunkSize;
      doc.text(`${currentIndex + 1}. ${value.Name}`, x, y);
      doc.text(`ตำแหน่ง: ${value.position}`, x + 60, y);
      doc.text(codeClose, 160, 290);
      
      const isLastPage = pageIndex === arrayChunks.length - 1;
      const isLastElement = index === chunk.length - 1;

      if (isLastPage && isLastElement) {
        if (chunk.length > 15) {
          const yMultiplier = 10;
          let y = 30;
          doc.addPage();
          autoContent2.forEach((line, index) => {
            if (index > 0) {
              x = 20;
            }
            doc.text(line, x, y + yMultiplier * index);
            y += yMultiplier;
          });

          y = 30;
          doc.text("ขอแสดงความนับถือ", 100 + x, y + yMultiplier * autoContent2.length);
          doc.text("(" + signature + ")", 100 + x, 20 + y + yMultiplier * autoContent2.length);
          doc.text(positionHead, 100 + x, 30 + y + yMultiplier * autoContent2.length);
          doc.text(codeClose, 160, 290);
          doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
        } else {
          const yMultiplier = 10;
          let y = 50;
          autoContent2.forEach((line, index) => {
            if (index > 0) {
              x = 20;
            }
            doc.text(line, x, y + yMultiplier * chunk.length);
            y += yMultiplier;
          });

          doc.text("ขอแสดงความนับถือ", 100 + x, y + yMultiplier * chunk.length);
          doc.text("(" + signature + ")", 100 + x, 20 + y + yMultiplier * chunk.length);
          doc.text(positionHead, 100 + x, 30 + y + yMultiplier * chunk.length);
          doc.text(codeClose, 160, 290);
          doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
        }
      }
    });
  });

  doc.addPage();

 
  for (let i = 0; i < inputValuesTest.length; i++) {
    const value = inputValuesTest[i];
    
    if (i > 0) {
      doc.addPage();
    }
    
    const x = 55;
    const x2 = 95;
    const y = 60;
    const y2 = 10;
    
    doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
    doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
    doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
    
    const maxWidth = 70;
    const textLines = doc.splitTextToSize(value.address + "", maxWidth);
    const textLines2 = doc.splitTextToSize(value.currentAddress + "", maxWidth);
    
    
        if (value.profileImage) {
          try {
            const imgData = await getImageData(value.profileImage);
            if (imgData) {
              doc.addImage(imgData, "JPEG", 145, 60, 32.5, 25);
              
            }
          } catch (error) {
            console.error("Error adding image to PDF:", error);
          }
        }
    
    doc.setFontSize(20);
    doc.setLineWidth(1);
    doc.rect(45, 50, 130, 120 + y2 * (textLines.length + textLines2.length));
    
    doc.text(`ประวัติพนักงาน`, 95, y);
    const textWidth = (doc.getStringUnitWidth("ประวัติพนักงาน") * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.setLineWidth(0.1);
    doc.line(95, y + 3, 125, y + 3);
    
    doc.setFontSize(14);
    doc.text(codeClose, 160, 290);
    doc.text(`ไอดี: `, x, y + y2 * 2);
    doc.text(`ชื่อ/นามสกุล: `, x, y + y2 * 3);
    doc.text(`อายุ: `, x, y + y2 * 4);
    doc.text(`วัน/เดือน/ปี เกิด: `, x, y + y2 * 5);
    doc.text(`เลขบัตรประชาชน: `, x, y + y2 * 6);
    doc.text(`ที่อยู่(ตามบัตรประชาชน): `, x, y + y2 * 7);
    doc.text(`ที่อยู่(ที่สามารถติดต่อได้): `, x, y + y2 * (7 + textLines.length));
    doc.text(`เบอร์โทรศัพท์: `, x, y + y2 * (7 + textLines.length + textLines2.length));
    doc.text(`สถานะภาพ: `, x, y + y2 * (8 + textLines.length + textLines2.length));
    doc.text(`กรณีฉุกเฉินติดต่อได้: `, x, y + y2 * (9 + textLines.length + textLines2.length));
    
    doc.text(`${value.Id}`, x2, y + y2 * 2);
    doc.text(`${value.Name}`, x2, y + y2 * 3);
    doc.text(`${value.age}`, x2, y + y2 * 4);
    doc.text(`${formattedDate321}`, x2, y + y2 * 5);
    doc.text(`${value.idCard}`, x2, y + y2 * 6);
    
    textLines.forEach((line, index) => {
      doc.text(line, x2, y + y2 * 7 + index * 10);
    });
    
    textLines2.forEach((line, index) => {
      doc.text(line, x2, y + y2 * (7 + textLines.length) + index * 10);
    });
    
    doc.text(`${value.phoneNumber}`, x2, y + y2 * (7 + textLines.length + textLines2.length));
    doc.text(`${value.maritalStatus}`, x2, y + y2 * (8 + textLines.length + textLines2.length));
    doc.text(`${value.emergencyContactNumber}`, x2, y + y2 * (9 + textLines.length + textLines2.length));
  }
  
  // แสดง PDF
  const pdfContent = doc.output("bloburl");
  window.open(pdfContent, "_blank");
};

  // Handle employeeId input change
  const handleEmployeeIdChange = (e) => {
    const id = e.target.value.replace(/\D/g, ""); // Remove non-digit chars
    setInput1(id);

    // Find the employee by id
    const employee = employeeList.find((emp) => emp.employeeId === id);
    if (employee) {
      setInput2(`${employee.name} ${employee.lastName}`); // Update name
    } else {
      setInput2(""); // Clear name if not found
    }
  };

  // Handle employeeName input change
  const handleEmployeeNameChange = (e) => {
    const name = e.target.value;
    setInput2(name);

    // Find the employee by name
    const employee = employeeList.find(
      (emp) => `${emp.name} ${emp.lastName}` === name
    );
    if (employee) {
      setInput1(employee.employeeId); // Update employeeId
    } else {
      setInput1(""); // Clear employeeId if not found
    }
  };

  return (
    <div>
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <section class="Frame">
              <div class="col-md-12">
                <div class="col-md-12">
                  {/* {inputValuesTest.map((value, index) => (
                                                    <div className="row" key={index}>
                                                        <div className="col-md-3">
                                                            <label style={{ position: 'absolute', bottom: '0' }}>{index + 1}.</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={value.input1}
                                                                style={{ marginLeft: '1rem' }}
                                                                onChange={(e) => handleInputChangeTest(index, 'input1', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label style={{ position: 'absolute', bottom: '0' }}>{index + 1}.</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={value.input2}
                                                                style={{ marginLeft: '1rem' }}
                                                                onChange={(e) => handleInputChangeTest(index, 'input2', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <button className="btn btn-danger" onClick={() => deleteInput(index)}>Delete</button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <br />
                                                <button className="btn b_save" onClick={addInput}>Add Input</button> */}
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname" style={absoluteBottomStyle} className="mb-3">
                        วันที่
                      </label>
                    </div>
                    <div className="col-md-3">
                      {/* <div style=
                                                {{ position: 'relative', zIndex: 9999, marginLeft: "0rem" }}>
                                                <DatePicker id="datetime" name="datetime"
                                                    className="form-control" // Apply Bootstrap form-control class
                                                    popperClassName="datepicker-popper" // Apply custom popper class if needed
                                                    selected={workDate}
                                                    onChange={handleWorkDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                // showMonthYearPicker
                                                />
                                            </div> */}
                      <div
                        onClick={toggleDatePicker}
                        style={{
                          position: "relative",
                          zIndex: 9999,
                          marginLeft: "0rem",
                        }}
                      >
                        <FaCalendarAlt size={20} />
                        <span style={{ marginLeft: "8px" }}>
                          {formattedDate321 ? formattedDate321 : "Select Date"}
                        </span>
                      </div>

                      {showDatePicker && (
                        <div style={{ position: "absolute", zIndex: 1000 }}>
                          <ThaiDatePicker
                            className="form-control"
                            value={selectedDate}
                            onChange={handleDatePickerChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <br />
                  {/*<div className="row">
                    <div className="col-md-2">
                      <label role="searchname" style={absoluteBottomStyle}>
                        แสดงความนับถือ
                      </label>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        value={signature}
                        onChange={handlesignatureChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        value={positionHead}
                        onChange={handlepositionHeadChange}
                      />
                    </div>
                  </div>*/}
                  <br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname" style={absoluteBottomStyle}>
                        เรื่อง
                      </label>
                    </div>

                    <div className="col-md-10">
                      <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={handletitleChange}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname" style={absoluteBottomStyle}>
                        เรียน
                      </label>
                    </div>

                    <div className="col-md-10">
                      <input
                        type="text"
                        className="form-control"
                        value={invite}
                        onChange={handleinviteChange}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname">เนื้อหา</label>
                    </div>
                    <div className="col-md-10">
                      <textarea
                        name="input5"
                        class="form-control"
                        value={content}
                        onChange={handleContentChange}
                        rows="4" // Set the number of visible rows (adjust as needed)
                        cols="50" // Set the number of visible columns (adjust as needed)
                      ></textarea>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-2">
                      <label>รหัสพนักงาน:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input1}
                        onChange={handleEmployeeIdChange}
                        onInput={(e) => {
                          // Remove any non-digit characters
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        list="staffIdList"
                      />
                      <datalist id="staffIdList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.employeeId}
                          />
                        ))}
                      </datalist>
                    </div>

                    <div className="col-md-2">
                      <label>ชื่อ:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input2}
                        onChange={handleEmployeeNameChange}
                        list="staffNameList"
                      />
                      <datalist id="staffNameList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={`${employee.name} ${employee.lastName}`}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-2">
                        <label>ตำเเหน่ง:</label>
                        <input type="text" className="form-control" value={position} onChange={(e) => setPosition(e.target.value)} />

                    </div>
                    <div className="col-md-3">
                        <label>รูปประจำตัว:</label>
                        <input type="file" className="form-control" onChange={(e) => setProfilePicture(e.target.files[0])} />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn b_save"
                        style={{ position: "absolute", bottom: "0rem" }}
                        type="submit"
                        onClick={addInput}
                      >
                        Add Input
                      </button>
                    </div>
                  </div>
                  <br /><br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname">เนื้อหาส่วนท้าย</label>
                    </div>
                    <div className="col-md-10">
                      <textarea
                        name="input5"
                        class="form-control"
                        value={content2}
                        onChange={handleContent2Change}
                        rows="4" // Set the number of visible rows (adjust as needed)
                        cols="50" // Set the number of visible columns (adjust as needed)
                      ></textarea>
                    </div>
                  </div>
                  <br /><br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname" style={absoluteBottomStyle} className="mb-3">
                        แสดงความนับถือ
                      </label>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        value={signature}
                        onChange={handlesignatureChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        value={positionHead}
                        onChange={handlepositionHeadChange}
                      />
                    </div>
                  </div>
                  <br /><br />
                  <div className="row">
                    <div className="col-md-2">
                      <label role="searchname">รหัสท้ายกระดาษ</label>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        value={codeClose}
                        onChange={handleCodeCloseChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input type="file" className="form-control" onChange={(e) => setSignatureFile(e.target.files[0])} />
                    </div>
                  </div>
                  <br />
                  {/*<div className="row">
                    {/* <div className="col-md-3">
                      <label>รหัสพนักงาน:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                        onInput={(e) => {
                          // Remove any non-digit characters
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        list="staffIdList"
                      />
                      <datalist id="staffIdList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.employeeId}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-3">
                      <label>ชื่อ:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input2}
                        onChange={(e) => setInput2(e.target.value)}
                        list="staffNameList"
                      />
                      <datalist id="staffNameList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.name + " " + employee.lastName}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-3">
                      <label>รหัสพนักงาน:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input1}
                        onChange={handleEmployeeIdChange}
                        onInput={(e) => {
                          // Remove any non-digit characters
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        list="staffIdList"
                      />
                      <datalist id="staffIdList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={employee.employeeId}
                          />
                        ))}
                      </datalist>
                    </div>

                    <div className="col-md-3">
                      <label>ชื่อ:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={input2}
                        onChange={handleEmployeeNameChange}
                        list="staffNameList"
                      />
                      <datalist id="staffNameList">
                        {employeeList.map((employee) => (
                          <option
                            key={employee.employeeId}
                            value={`${employee.name} ${employee.lastName}`}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="btn b_save"
                        style={{ position: "absolute", bottom: "0rem" }}
                        type="submit"
                        onClick={addInput}
                      >
                        Add Input
                      </button>
                    </div>
                  </div> */}
                  <br />
                  {inputValuesTest.map((value, index) => (
                        <div
                          className="row"
                          key={index}
                          style={{
                            border: "1px solid #000",
                            padding: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          <div
                            className="col-md-1"
                            style={{ borderRight: "1px solid #000" }}
                          >
                            {index + 1}
                          </div>
                          <div
                            className="col-md-2"
                            style={{ borderRight: "1px solid #000" }}
                          >
                            {value.Id}
                          </div>
                          <div
                            className="col-md-3"
                            style={{ borderRight: "1px solid #000" }}
                          >
                            {value.Name}
                          </div>
                          <div
                            className="col-md-3"
                            style={{ borderRight: "1px solid #000" }}
                          >
                            {value.profileImage ? (
                              <img 
                                src={URL.createObjectURL(value.profileImage)} 
                                alt="Profile" 
                                style={{ width: "50px", height: "50px" }} 
                              />
                            ) : "ไม่มีรูปภาพ"}
                          </div>
                          <div className="col-md-3 text-center">
                            <button
                              className="btn b_save"
                              style={{ width: "5rem" }}
                              onClick={() => deleteInput(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  <br />
                  <br />
                  <div className="row">
                    {/* Your content */}
                    <div
                      className="col-md-6"
                      style={{ position: "absolute", bottom: "0rem" }}
                    >
                      <button className="btn b_save" onClick={generatePDF2}>
                        Generate PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SendEmployeePDF2;