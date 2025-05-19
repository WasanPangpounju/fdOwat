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
    // e.preventDefault();
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

    setInput1(""); // Clear the input1 field after adding
    setInput2(""); // Clear the input2 field after adding

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
  const generatePDF2 = () => {
    // const doc = new jsPDF();
    const doc = new jsPDF({
      orientation: "portrait", // 'portrait' or 'landscape'
      unit: "mm", // measurement unit (you can choose from 'pt', 'mm', 'cm', or 'in')
      format: "a4", // sets the document format to A4
    });
    // const fontPath = '/assets/fonts/THSarabunNew.ttf';
    // doc.addFileToVFS(fontPath);
    // doc.addFont(fontPath, 'THSarabunNew', 'normal');
    const fontPath = "/assets/fonts/THSarabunNew Bold.ttf";
    doc.addFileToVFS(fontPath);
    doc.addFont(fontPath, "THSarabunNew-Bold", "normal");
    doc.setFont("THSarabunNew-Bold");
    doc.setFontSize(14);

    const OwatAddress = "/assets/images/new/OwatAddress.png"; // Replace with the path to your PNG file
    const OwatIcon = "/assets/images/new/OwatIcon.png"; // Replace with the path to your PNG file
    // const OwatSupport = "/assets/images/OwatSupport.png"; // Replace with the path to your PNG file
    const OwatSupport = "/assets/images/new/icon_under.png"; // Replace with the path to your PNG file

    const xx = 140; // X-coordinate
    const yy = 10; // Y-coordinate

    // Add the image to the PDF document
    // doc.addImage(OwatAddress, 'PNG', xx, yy, 615, 284);
    // doc.addImage(OwatIcon, 'PNG', xx, yy, 612, 270);
    // doc.addImage(OwatSupport, 'PNG', xx, yy, 1130, 164);

    doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
    doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
    doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);

    // doc.setFont('THSarabunNew');
    // const formatDateThai = (dateOfBirth) => {
    //   if (!dateOfBirth) {
    //     return "";
    //   }
    //   const thaiMonthNames = new Intl.DateTimeFormat("th-TH", { month: "long" })
    //     .format;
    //   const formattedDate = new Date(dateOfBirth);

    //   const day = formattedDate.getDate();
    //   const month = thaiMonthNames(formattedDate);
    //   const year = formattedDate.getFullYear();

    //   return `${day} ${month} ${year}`;
    // };

    // const formatDateThaiFirst = (workDate) => {
    //   const thaiMonthNames = new Intl.DateTimeFormat("th-TH", { month: "long" })
    //     .format;
    //   const formattedDate = new Date(workDate);

    //   const day = formattedDate.getDate();
    //   const month = thaiMonthNames(formattedDate);
    //   const year = formattedDate.getFullYear();

    //   return `${day} ${month} ${year + 543}`;
    // };

    // doc.addPage(); // Add a new page for each set of inputs after the first
    const maxWidth = 150; // Define the maximum width for the text
    // const invite = 'This is a long text that needs to be wrapped to a new line when it reaches the maximum width to ensure readability and proper formatting.';
    // const inviteLines = doc.splitTextToSize(`เรื่อง: ThisThability and proper formatting. is a lnd proper formatting. is a long text thong text thato ensure readability and proper formatting.     ` + invite, maxWidth);
    // const titleLines = doc.splitTextToSize(`เรียน:  บริษัทฯ จึงขอรับรองตำแหน่องทำความสะอาดทดแทนงาน พนักงานมีประสบการณ์ทำงานด้สนทำความสะอาดไม่ต่ำกว่า 1 ปี สามารถใช้อุปกรณ์การทำความสะอาดได้เป็นอย่างดีและสามารถอ่านและเขียนภาษาไทยได้ดี    ` + title, maxWidth);
    // const contentLines = doc.splitTextToSize(`This iThiadability and proper formattind proper formattihe maximum width the maximum width to ensure readability and proper formatt` + content, maxWidth);

    // const invite = 'This is a long text that needs to be wrapped to a new line when it reaches the maximum width to ensure readability and proper formatting.';
    const inviteLines = doc.splitTextToSize(`เรื่อง:     ` + title, maxWidth);
    const titleLines = doc.splitTextToSize(`เรียน:     ` + invite, maxWidth);
    const contentLines = doc.splitTextToSize(content, maxWidth);
    // const inviteLines = doc.splitTextToSize(`เรื่อง:  and proper formatting.     ` + invite, maxWidth);
    // const inviteLines = doc.splitTextToSize(`เรื่อง:  and proper formatting.     ` + invite, maxWidth);
    // const titleLines = doc.splitTextToSize(`เรียน:  This iThiadabilityformatting.    ` + title, maxWidth);

    // Set the initial coordinates
    let x = 30;
    let y = 60;
    // Loop through each line and draw it on the PDF
    inviteLines.forEach((line, index) => {
      if (index > 0) {
        x = 20; // For lines after the first line, start at x = 10
      }
      doc.text(line, x, y);
      y += 8; // Increase the Y-coordinate for the next line
    });
    x = 30;
    titleLines.forEach((line, index) => {
      if (index > 0) {
        x = 20; // For lines after the first line, start at x = 10
      }
      doc.text(line, x, y + inviteLines.length);
      y += 8; // Increase the Y-coordinate for the next line
    });
    x = 30;
    contentLines.forEach((line, index) => {
      if (index > 0) {
        x = 20; // For lines after the first line, start at x = 10
      }
      doc.text(line, x, y + inviteLines.length + titleLines.length);
      y += 8; // Increase the Y-coordinate for the next line
    });
    // const y = 50;
    x = 40;

    doc.text(
      `บริษัทฯ ใคร่ขอแจ้งให้ท่านทรบว่าพนักงานมรามีรายชื่อดั้งต่อไปนี้`,
      x,
      y + inviteLines.length + titleLines.length
    ); // Adding 30 to the Y-coordinate

    // doc.text(`วันที่ : ${formatDateThaiFirst(workDate)}`, 130, 50); // Adding 30 to the Y-coordinate
    doc.text(`วันที่ : ${formattedDate321}`, 130, 50); // Adding 30 to the Y-coordinate
    doc.text(codeClose, 160, 290);

    // doc.text(`เรีอง:      ${invite}`, 40, 50); // Adding 30 to the Y-coordinate
    // doc.text(`เรียน:      ${title}`, 40, 60); // Adding 30 to the Y-coordinate

    inputValuesFirst.forEach((value, index) => {
      if (index < 15) {
        // To skip the first array
        const x = 40; // X-coordinate for starting point
        const y =
          70 +
          10 * (titleLines.length + inviteLines.length + contentLines.length) +
          index * 10; // Y-coordinate, with 20 pixels separation for each item
        // const y2 = 65 + (10 * (titleLines.length + inviteLines.length + contentLines.length)) + (index) * 15; // Y-coordinate, with 20 pixels separation for each item

        doc.setFontSize(14);
        doc.text(`${index + 1}. ${value.Name}`, x, y);
        doc.text(`ตำแหน่ง               ${value.position}`, x + 60, y);
        doc.text(codeClose, 160, 290);

        // doc.text(`ประวัติการศึกษา: ${value.educational}`, x, y2); // Adding 30 to the Y-coordinate
      }
    });

    // const autoText1 = doc.splitTextToSize(`จากการสอบถามพนักงานแจ้งว่าได้จบการศึกษาตามที่บริษัทฯ แจ้งให้ทราบแล้วนั้น สืบเนื่องมาจาก พนักงานได้จบการศึกษา มานานแล้วทำให้เอกสารสูญหาย`, maxWidth);
    // const autoText2 = doc.splitTextToSize(`บริษัทฯ จึงขอรับรองตำแหน่องทำความสะอาดทดแทนงาน พนักงานมีประสบการณ์ทำงานด้านทำความสะอาด ไม่ต่ำกว่า 1 ปี สามารถใช้อุปกรณ์การทำความสะอาดได้เป็นอย่างดีและสามารถอ่านและเขียนภาษาไทยได้ดี`, maxWidth);
    // const autoText3 = doc.splitTextToSize(`จึงเรียนมาเพื่อพิจารณาอนุญาต`, maxWidth);
    const autoContent2 = doc.splitTextToSize(content2, maxWidth);

    // if (inputValuesFirst.length === 1) {
    if (inputValuesFirst.length < 16) {
      const lengthFirst = inputValuesFirst.length;
      x = 30;
      // autoText1.forEach((line, index) => {
      //     if (index > 0) {
      //         x = 20; // For lines after the first line, start at x = 10
      //     }
      //     doc.text(line, x, y + (5 * ((titleLines.length + inviteLines.length + contentLines.length) + lengthFirst * 3)));
      //     y += 8; // Increase the Y-coordinate for the next line
      // });
      // x = 30;
      // autoText2.forEach((line, index) => {
      //     if (index > 0) {
      //         x = 20; // For lines after the first line, start at x = 10
      //     }
      //     doc.text(line, x, y + (5 * ((titleLines.length + inviteLines.length + contentLines.length) + lengthFirst * 3)));
      //     y += 8; // Increase the Y-coordinate for the next line
      // });
      // x = 30;
      // autoText3.forEach((line, index) => {
      //     if (index > 0) {
      //         x = 20; // For lines after the first line, start at x = 10
      //     }
      //     doc.text(line, x, y + (5 * ((titleLines.length + inviteLines.length + contentLines.length) + lengthFirst * 3)));
      //     y += 8; // Increase the Y-coordinate for the next line
      // });
      // doc.text('ขอแสดงความนับถือ', 100 + x, 15 + y + (4 * ((titleLines.length + inviteLines.length + contentLines.length + autoText1.length + autoText2.length + autoText3.length) + lengthFirst * 3)));
      // doc.text('(' + signature + ')', 100 + x, 35 + y + (4 * ((titleLines.length + inviteLines.length + contentLines.length + autoText1.length + autoText2.length + autoText3.length) + lengthFirst * 3)));
      // doc.text(positionHead, 100 + x, 40 + y + (4 * ((titleLines.length + inviteLines.length + contentLines.length + autoText1.length + autoText2.length + autoText3.length) + lengthFirst * 3)));
      if (inputValuesFirst.length + autoContent2.length > 10) {
        doc.addPage(); // Add a new page for each set of inputs after the first
        doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
        doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
        doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
        y = 50;
        autoContent2.forEach((line, index) => {
          if (index > 0) {
            x = 20; // For lines after the first line, start at x = 10
          }
          doc.text(line, x, y);
          // doc.text(line, x, y + (5 * ((titleLines.length + inviteLines.length + contentLines.length) + lengthFirst * 3)));

          y += 10; // Increase the Y-coordinate for the next line
        });

        doc.text(
          "ขอแสดงความนับถือ",
          100 + x,
          15 + y + 10 * autoContent2.length
        );
        doc.text(
          "(" + signature + ")",
          100 + x,
          35 + y + 10 * autoContent2.length
        );
        doc.text(positionHead, 100 + x, 40 + y + 10 * autoContent2.length);
        doc.text(codeClose, 160, 290);
        doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
      } else {
        autoContent2.forEach((line, index) => {
          if (index > 0) {
            x = 20; // For lines after the first line, start at x = 10
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
          // doc.text(line, x, y + (5 * ((titleLines.length + inviteLines.length + contentLines.length) + lengthFirst * 3)));

          y += 10; // Increase the Y-coordinate for the next line
        });
        doc.text(
          "ขอแสดงความนับถือ",
          100 + x,
          15 +
          y +
          10 *
          (titleLines.length +
            inviteLines.length +
            contentLines.length +
            lengthFirst +
            autoContent2.length -
            2)
        );
        doc.text(
          "(" + signature + ")",
          100 + x,
          35 +
          y +
          10 *
          (titleLines.length +
            inviteLines.length +
            contentLines.length +
            lengthFirst +
            autoContent2.length -
            2)
        );
        doc.text(
          positionHead,
          100 + x,
          40 +
          y +
          10 *
          (titleLines.length +
            inviteLines.length +
            contentLines.length +
            lengthFirst +
            autoContent2.length -
            2)
        );
        doc.text(codeClose, 160, 290);
        doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
      }
    } else {
      // doc.addPage(); // Add a new page for each set of inputs after the first
      // doc.addImage(OwatAddress, 'PNG', 140, 10, 61.5, 28.4);
      // doc.addImage(OwatIcon, 'PNG', 10, 10, 68, 30);
      // doc.addImage(OwatSupport, 'PNG', 85, 275, 113.0, 16.4);
      doc.addPage(); // Add a new page for each set of inputs after the first
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
        x = 40; // X-coordinate for starting point
        const y = 50 + index * 10;
        // const y2 = 30 + index * 20;

        doc.setFontSize(14);
        const currentIndex = index + initialIndex + pageIndex * chunkSize;
        doc.text(`${currentIndex + 1}. ${value.Name}`, x, y);
        doc.text(`ตำแหน่ง: ${value.position}`, x + 60, y);
        doc.text(codeClose, 160, 290);
        // doc.text(`ประวัติการศึกษา: ${value.educational}`, x, y2);

        // Check if it's the last page and the last element in the chunk
        const isLastPage = pageIndex === arrayChunks.length - 1;
        const isLastElement = index === chunk.length - 1;

        if (isLastPage && isLastElement) {
          if (chunk.length > 15) {
            const yMultiplier = 10; // Adjust this multiplier as needed
            let y = 30; // Initialize y as a variable
            doc.addPage();
            autoContent2.forEach((line, index) => {
              if (index > 0) {
                x = 20; // For lines after the first line, start at x = 10
              }

              // Adjust the Y-coordinate calculation
              doc.text(line, x, y + yMultiplier * index);

              y += yMultiplier; // Increase the Y-coordinate for the next line
            });

            y = 30;
            doc.text(
              "ขอแสดงความนับถือ",
              100 + x,
              y + yMultiplier * autoContent2.length
            );
            doc.text(
              "(" + signature + ")",
              100 + x,
              20 + y + yMultiplier * autoContent2.length
            );
            doc.text(
              positionHead,
              100 + x,
              30 + y + yMultiplier * autoContent2.length
            );
            doc.text(codeClose, 160, 290);
            doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
          } else {
            const yMultiplier = 10; // Adjust this multiplier as needed
            let y = 50; // Initialize y as a variable
            autoContent2.forEach((line, index) => {
              if (index > 0) {
                x = 20; // For lines after the first line, start at x = 10
              }

              // Adjust the Y-coordinate calculation
              doc.text(line, x, y + yMultiplier * chunk.length);

              y += yMultiplier; // Increase the Y-coordinate for the next line
            });

            doc.text(
              "ขอแสดงความนับถือ",
              100 + x,
              y + yMultiplier * chunk.length
            );
            doc.text(
              "(" + signature + ")",
              100 + x,
              20 + y + yMultiplier * chunk.length
            );
            doc.text(
              positionHead,
              100 + x,
              30 + y + yMultiplier * chunk.length
            );
            doc.text(codeClose, 160, 290);
            doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);
          }
        }
      });
    });

    doc.addPage(); // Add a new page for each set of inputs after the first

    inputValuesTest.forEach((value, index) => {
      if (index > 0) {
        doc.addPage(); // Add a new page for each set of inputs after the first
      }
      const x = 55;
      const x2 = 95;
      const y = 60;
      const y2 = 10;
      doc.addImage(OwatAddress, "PNG", 140, 10, 61.5, 28.4);
      doc.addImage(OwatIcon, "PNG", 10, 10, 68, 30);
      doc.addImage(OwatSupport, "PNG", 10, 270, 190, 16.4);

      const maxWidth = 70; // Adjust the width as needed
      // const text = 'Some text that might be really long and is intended to exceed the maximum width, causing it to be split into multiple lines because it is too long to fit on a single line.';
      // const textLines2 = doc.splitTextToSize(text + 'Extra long string', maxWidth);
      // console.log(textLines2.length);
      // doc.text(`${textLines2.length}`, x2, y + 10);
      const textLines = doc.splitTextToSize(value.address + "", maxWidth);
      const textLines2 = doc.splitTextToSize(
        value.currentAddress + "",
        maxWidth
      );

      // const textLines = doc.splitTextToSize(value.address , maxWidth);

      // doc.text(textLines.length, x, y + 10);

      textLines.forEach((line, index) => {
        doc.text(line, x2, y + y2 * 7 + index * 10); // Use appropriate Y positioning for each line
      });
      textLines2.forEach((line, index) => {
        doc.text(line, x2, y + y2 * (7 + textLines.length) + index * 10); // Use appropriate Y positioning for each line
      });

      doc.setFontSize(20);
      // doc.setFontStyle('bold');
      doc.setLineWidth(1); // Increase line width for boldness
      doc.rect(45, 50, 130, 120 + y2 * (textLines.length + textLines2.length)); // (x, y, width, height)กรอบข้อความ

      doc.text(`ประวัติพนักงาน`, 95, y);

      const textWidth =
        (doc.getStringUnitWidth("ประวัติพนักงาน") *
          doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      // Add an underline
      doc.setLineWidth(0.1);
      doc.line(95, y + 3, 125, y + 3);

      doc.setFontSize(14);
      // doc.text(textLines.length, x, y + 10);
      doc.text(codeClose, 160, 290);
      doc.text(`ไอดี: `, x, y + y2 * 2);
      doc.text(`ชื่อ/นามสกุล: `, x, y + y2 * 3);
      doc.text(`อายุ: `, x, y + y2 * 4);
      doc.text(`วัน/เดือน/ปี เกิด: `, x, y + y2 * 5);
      doc.text(`เลขบัตรประชาชน: `, x, y + y2 * 6);
      doc.text(`ที่อยู่(ตามบัตรประชาชน): `, x, y + y2 * 7);
      doc.text(
        `ที่อยู่(ที่สามารถติดต่อได้): `,
        x,
        y + y2 * (7 + textLines.length)
      );
      doc.text(
        `เบอร์โทรศัพท์: `,
        x,
        y + y2 * (7 + textLines.length + textLines2.length)
      );
      doc.text(
        `สถานะภาพ: `,
        x,
        y + y2 * (8 + textLines.length + textLines2.length)
      );
      doc.text(
        `กรณีฉุกเฉินติดต่อได้: `,
        x,
        y + y2 * (9 + textLines.length + textLines2.length)
      );

      doc.text(`${value.Id}`, x2, y + y2 * 2);
      doc.text(`${value.Name}`, x2, y + y2 * 3);
      doc.text(`${value.age}`, x2, y + y2 * 4);
      // const formattedDate = formatDateThai(value.dateOfBirth);

      // doc.text(`${formatDateThai(value.dateOfBirth)}`, x2, y + (y2 * 5));
      // doc.text(`${formattedDate}`, x2, y + y2 * 5);
      doc.text(`${formattedDate321}`, x2, y + y2 * 5);

      doc.text(`${value.idCard}`, x2, y + y2 * 6);
      // doc.text(`${value.address}`, x2, y + 70);
      // doc.text(`${value.currentAddress}`, x2, y + (y2 * (7 + textLines.length)));
      doc.text(
        `${value.phoneNumber}`,
        x2,
        y + y2 * (7 + textLines.length + textLines2.length)
      );
      doc.text(
        `${value.maritalStatus}`,
        x2,
        y + y2 * (8 + textLines.length + textLines2.length)
      );
      doc.text(
        `${value.emergencyContactNumber}`,
        x2,
        y + y2 * (9 + textLines.length + textLines2.length)
      );
    });

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
                    <div className="col-md-3">
                        <label>ตำเเหน่ง:</label>
                        <input type="text" className="form-control" value={position} onChange={(e) => setPosition(e.target.value)} />
                        
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
                        className="col-md-4"
                        style={{ borderRight: "1px solid #000" }}
                      >
                        {value.Id}
                      </div>
                      <div
                        className="col-md-4"
                        style={{ borderRight: "1px solid #000" }}
                      >
                        {value.Name}
                      </div>
                      <div className="col-md-2">
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
