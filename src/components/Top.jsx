import React from 'react'
import { arrowRight } from '../assets';
function Top() {
    function handleLogout() {
        // Clear all localStorage
        localStorage.clear();
        // Simple reload
        window.location.href = '/';
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
                            ออกจากระบบ &nbsp;<img src={arrowRight} width="17" alt="logout"/>
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Top