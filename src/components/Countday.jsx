// import React from 'react'
// import React, { useState } from "react";
import React, { useEffect, useState } from 'react';

function Countday() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [result, setResult] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;

        while (start <= end) {
            if (start.getDay() !== 6) {
                count++;
            }
            start.setDate(start.getDate() + 1);
        }

        setResult(`The number of days between ${startDate} and ${endDate} (excluding Saturdays) is: ${count}`);
    }
    return (
        <div className='Testcal'>
            <div class="content-wrapper">
                {/* <!-- Content Header (Page header) --> */}
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                </ol>
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> แดชบอร์ด</h1>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Start date:
                        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                    </label>
                    <br />
                    <label>
                        End date:
                        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>
                {result && <div>{result}</div>}


            </div>
        </div >
    )
}

export default Countday