import React from 'react'
import { useState } from 'react';
// import './editwindowcss.css';
function Top() {

    function handleLogout() {
        localStorage.setItem('loggedIn', 'false');
        window.location.reload();

        setLoggedIn(false);
    }

    return (
        <>
            <nav class="main-header navbar navbar-expand navbar-white navbar-light" style={{marginLeft:'13rem'}}>
                {/* <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                </ul> */}
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item logout">
                        <a href="#" onClick={handleLogout} >
                            ออกจากระบบ &nbsp;<img src="assets/images/arrow-right-from-bracket-solid.png" width="17"/>
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Top