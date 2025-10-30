import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const TestPDF = () => {
  const [data, setData] = useState([]);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF('landscape');

      // Load the Thai font
      const fontPath = '/assets/fonts/THSarabunNew.ttf';
      doc.addFileToVFS(fontPath);
      doc.addFont(fontPath, 'THSarabunNew', 'normal');

      // Override the default stylestable for jspdf-autotable
      const stylestable = {
        font: 'THSarabunNew',
        fontStyle: 'normal',
        fontSize: 10,
      };
      const tableOptions = {
        styles: stylestable,
        startY: 25,
        // margin: { top: 10 },
      };

      const title = ' ใบลงเวลาการปฏิบัติงาน';

      // Set title with the Thai font
      doc.setFont('THSarabunNew');
      doc.setFontSize(16);
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);

      const subTitle = workMonth; // Replace with your desired subtitle text
      doc.setFontSize(12); // You can adjust the font size for the subtitle
      const subTitleWidth = doc.getStringUnitWidth(subTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const subTitleX = (pageWidth - subTitleWidth) / 2;
      doc.text(subTitle, subTitleX, 20); // Adjust the vertical position as needed

      // Calculate the number of days in the month, considering February and leap years
      const daysInMonth = (monthset === '02' && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 :
        (monthset === '02') ? 28 :
          [4, 6, 9, 11].includes(monthset) ? 30 : 31;

      // Calculate the starting point for the table header
      let startingDay = 21;

      // Generate the header with a single cycle of "01" to "20" followed by "21" to the last day of the month
      const header = Array.from({ length: daysInMonth }, (_, index) => {
        const day = (index + startingDay) > daysInMonth ? (index + startingDay - daysInMonth) : (index + startingDay);

        // Add leading zeros for days 1 to 9
        const formattedDay = day < 10 ? `0${day}` : day.toString();

        return formattedDay;
      });

      // Assuming that 'date' contains values like '01', '02', ..., '28', '29', '30', '31'
      // You can replace 'date' with the actual field name containing the date information in your data
      const dateOt = ['25', '09', '10'];

      const dateFieldName = 'date';

      // Create an object to store data rows by date
      const rowDataByDate = {};

      // Organize the dataset into the rowDataByDate object
      dataset.forEach((data) => {
        // dataset.forEach((data) => {

        const date = data[dateFieldName];
        if (!rowDataByDate[date]) {
          rowDataByDate[date] = { workplaceId: [], otTime: [], dateFieldName: [], allTime: [] };
        }
        rowDataByDate[date].workplaceId.push(data.workplaceId);
        rowDataByDate[date].otTime.push(data.otTime);
        rowDataByDate[date].allTime.push(data.allTime);
        rowDataByDate[date].dateFieldName.push(data[dateFieldName]);
      });

      // Map the header to transposedTableData using the rowDataByDate object
      const transposedTableData = header.map((headerDay) => {
        const rowData = rowDataByDate[headerDay];

        if (rowData) {
          return [
            rowData.workplaceId.join(', '),
            rowData.allTime.join(', '),
            rowData.otTime.join(', '),
            // rowData.dateFieldName.join(', '),
          ];
        } else {
          return ['', '', ''];
        }
      });

      // Transpose the transposedTableData to sort horizontally
      const sortedTableData = Array.from({ length: 3 }, (_, index) =>
        transposedTableData.map((row) => row[index])
      );

      const textColumn = [name, 'เวลา ทำงาน', 'เวลา OT'];

      const sortedTableDataWithText = sortedTableData.map((data, index) => {
        const text = [textColumn[index]];
        return [...text, ...data];
      });

      // Now, sortedTableDataWithText contains the text column followed by sorted data columns.

      const customHeaders = [
        ['วันที่', ...header],
      ];


      // Add custom headers and data to the table
      // doc.autoTable({
      //   head: customHeaders,
      //   body: sortedTableDataWithText,
      //   ...tableOptions,
      // });
      // Create a function to check if the cell should have a background color
      function shouldHighlightCell(text) {
        return dateOt.includes(text);
      }

      doc.autoTable({
        head: customHeaders,
        body: sortedTableDataWithText,
        ...tableOptions,
        didDrawCell: function (data) {
          if (data.cell.section === 'head' && shouldHighlightCell(data.cell.raw)) {
            // Set the background color for header cells with the location number found in dateOt
            doc.setFillColor(255, 255, 0); // Yellow background color
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
        },
      });



      const additionalTableData = [
        ['เงินค่าจ้าง', '', '', '', '', '', '55'],
        ['Cell 4', 'Cell 5', 'Cell 6'],
        ['Cell 7', 'Cell 8', 'Cell 9'],
      ];

      // const calculatedValuesAllTime = calculatedValues.map((value) => [
      //   `รวมวันทำงาน:`, ` ${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      // ]);

      // const calculatedValuesOt = calculatedValues.map((value) => [
      //   `รวมวันทำงาน OT:`, ` ${value.calculatedOT} (${value.otTime})`
      // ]);
      // const combinedTableData = [...additionalTableData, ...calculatedValuesAllTime, ...calculatedValuesOt];
      // /////////////////////////////////////////////////////////////////
      // const calculatedValuesAllTime = calculatedValues.map((value) => [
      //   `รวมวันทำงาน:`, ` ${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`,
      // ]);

      const calculatedValuesAllTime = calculatedValues.map((value) =>
        `${value.workplaceId}, ${value.calculatedValue} (${value.allTime})`
      );

      // Combine the calculated values into a single array
      const combinedCalculatedValues = ['รวมวันทำงาน:', ...calculatedValuesAllTime];

      const calculatedValuesOt = calculatedValues.map((value) => [
        `${value.calculatedOT} (${value.otTime})`,
      ]);

      const combinedCalculatedValuesOt = ['รวมวันทำงาน OT:', ...calculatedValuesOt];

      const combinedTableData = [...additionalTableData, combinedCalculatedValues, combinedCalculatedValuesOt];
      // Combine the calculated values into a single array
      // const combinedCalculatedValues = calculatedValuesAllTime.map((value, index) => [value, calculatedValuesOt[index]]);

      // const combinedTableData = [...additionalTableData, ...combinedCalculatedValues, ...calculatedValuesOt];

      const firstColumnWidth = 30; // Adjust the width as needed

      // Define column styles, including the width of the first column
      const columnStyles = {
        0: { columnWidth: firstColumnWidth }, // Index 0 corresponds to the first column
      };

      // Define options for the additional table
      const additionalTableOptions = {
        startY: 80, // Adjust the vertical position as needed
        margin: { top: 10 },
        columnStyles: columnStyles, // Assign the column stylestable here
        styles: stylestable,
      };

      // Add the additional table to the PDF
      // doc.autoTable({
      //   body: combinedTableData,
      //   ...additionalTableOptions,
      // });

      // Define the text to add background color to
      const textWithBackgroundColor = ['รวมวันทำงาน:', 'รวมวันทำงาน OT:'];

      // Add the additional table to the PDF
      doc.autoTable({
        body: combinedTableData,
        ...additionalTableOptions,
        didDrawCell: function (data) {
          if (data.cell.section === 'body') {
            // Check if the cell contains text that should have a background color
            const text = data.cell.raw;
            if (textWithBackgroundColor.includes(text)) {
              // Set the background color
              doc.setFillColor(255, 255, 0); // Yellow background color
              doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

              // Reset text color for better visibility
              doc.setTextColor(0, 0, 0);
            }
          }
        },
      });
      const titletest = 'รวมวันทำงาน:';
      const titletest2 = 'รวมวันทำงาน OT:';

      // Set title with the Thai font
      doc.setFont('THSarabunNew');
      doc.setFontSize(14);
      doc.text(titletest, 15, 108);
      doc.text(titletest2, 15, 115);


      doc.save('example.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default TestPDF;
