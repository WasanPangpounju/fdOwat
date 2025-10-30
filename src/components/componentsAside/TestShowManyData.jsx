// import React from 'react';
import React, { useState } from 'react';

// import TestJson from './Testjson.json';
// import { useTable } from 'react-table';


function TestShowManyData() {
  // Filter the data for the desired workplaceId (e.g., "9999")
  // const filteredData = TestJson.filter((item) => item.workplaceId === '9999');

  // // Create an array to hold the data for the table
  // const tableData = [];

  // // Extract employee records from the filtered data
  // filteredData.forEach((item) => {
  //   item.employeeRecord.forEach((record) => {
  //     const staffId = record.staffId;
  //     const staffName = record.staffName;
  //     const shift = record.shift;

  //     // Create a new object representing a row in the table
  //     const rowData = {
  //       staffId,
  //       staffName,
  //       shift,
  //     };

  //     // Push the row data into the tableData array
  //     tableData.push(rowData);
  //   });
  // });

  // // Define the columns for your table
  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: 'staffId',
  //       accessor: 'staffId',
  //     },
  //     {
  //       Header: 'staffName',
  //       accessor: 'staffName',
  //     },
  //     {
  //       Header: 'shift',
  //       accessor: 'shift',
  //     },
  //   ],
  //   []
  // );

  // // Create a table instance
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useTable({
  //   columns,
  //   data: tableData, // Use the transformed tableData
  // });

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const [checkboxValue1, setCheckboxValue1] = useState(100);
  const [checkboxValue2, setCheckboxValue2] = useState(200);
  const [checkboxValue3, setCheckboxValue3] = useState(300);

  const calculateTotal = () => {
    let total = 0;
    if (checkbox1) total += checkboxValue1;
    if (checkbox2) total += checkboxValue2;
    if (checkbox3) total += checkboxValue3;
    return total;
  };

  return (
    <div>

      <h1>Checkbox Calculator</h1>
      <input
        type="checkbox"
        id="checkbox1"
        checked={checkbox1}
        onChange={() => setCheckbox1(!checkbox1)}
      />
      <label htmlFor="checkbox1">Checkbox 1 (Value: 100)</label>
      <br />
      <input
        type="checkbox"
        id="checkbox2"
        checked={checkbox2}
        onChange={() => setCheckbox2(!checkbox2)}
      />
      <label htmlFor="checkbox2">Checkbox 2 (Value: 200)</label>
      <br />
      <input
        type="checkbox"
        id="checkbox3"
        checked={checkbox3}
        onChange={() => setCheckbox3(!checkbox3)}
      />
      <label htmlFor="checkbox3">Checkbox 3 (Value: 300)</label>
      <br />
      <p>Total Value: {calculateTotal()}</p>

      {/* <h1>Table from JSON Data</h1>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
}

export default TestShowManyData;
