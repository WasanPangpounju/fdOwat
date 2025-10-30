import React from 'react'
// import Top from "./Top"
// import AsideLeft from './AsideLeft'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Registration() {
    return (
        <>
            <div className="registration">
                <h1>Registration</h1>
                <label>Username</label>
                <input type="text" /><br />
                <label>password</label>
                <input type="text" /> <br />
                <button> Register</button>
            </div>
        </>
    )
}

export default Registration