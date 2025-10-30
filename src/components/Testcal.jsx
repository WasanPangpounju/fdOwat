// import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import '../App.css';
import Time from './Time.jsx'

function Testcal() {
    const [date, setDate] = useState(new Date());
    const [showTime, setShowTime] = useState(false)
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
                <h1 className='header'>React Calendar</h1>
                <div>
                    <Calendar onChange={setDate} value={date} onClickDay={() => setShowTime(true)} />
                </div>

                {date.length > 0 ? (
                    <p>
                        <span>Start:</span>
                        {date[0].toDateString()}
                        &nbsp;
                        &nbsp;
                        <span>End:</span>{date[1].toDateString()}
                    </p>
                ) : (
                    <p>
                        <span>Default selected date:</span>{date.toDateString()}
                    </p>
                )
                }
                <Time showTime={showTime} date={date} />

            </div>
        </div>
    )
}

export default Testcal