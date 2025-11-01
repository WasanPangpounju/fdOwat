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
            <nav className="main-header navbar navbar-expand navbar-white navbar-light" 
                 style={{ marginLeft: '13rem', height: '3.8rem' }}>
                {/* <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                    </li>
                </ul> */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item logout"> 
                        <a 
                            href="#" 
                            onClick={handleLogout}
                            style={{
                                padding: '5.5px 6px', 
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            ออกจากระบบ &nbsp;<img src={arrowRight} width="20" height="17" alt="logout"style={{
                                width: '20px', 
                                height: '20px', 
                                marginLeft: '5px' 
                            }}/>
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Top