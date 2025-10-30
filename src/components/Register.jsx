import endpoint from '../config';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    function handleRegister(event) {
        event.preventDefault();
        
        if (isLoading) return;
        
        if (password !== confirmPassword) {
            toast.error('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        
        setIsLoading(true);

        const data = {
            email: email,
            username: username,
            password: password
        };

        axios.post(endpoint + '/users/register', data)
            .then(response => {
                toast.success('ลงทะเบียนสำเร็จ', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            })
            .catch(error => {
                toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="wrapper login-wrapper">
            <div className="Form_login" style={{ height: '100%' }}>
                <div className="login-page inner_login" style={{ height: '100%', fontFamily: 'Sarabun, sans-serif' }}>
                    <div className="login-box">
                        <div className="logo-login"><img src='src/assets/images/logo-xl.png' alt="logo" /></div>
                        <div className="title-login">
                            <h2 style={{ fontFamily: 'Sarabun, sans-serif' }}>ระบบบริหารทรัพยากรบุคคล</h2>
                        </div>
                        <div className="txt-login" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                            <i className="fas fa-user-plus"></i> สมัครสมาชิก
                        </div>
                        <ToastContainer />
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>อีเมล <span className="txt-red">*</span></label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="อีเมล" 
                                    onChange={handleEmailChange}
                                    style={{ fontFamily: 'Sarabun, sans-serif' }}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>ชื่อผู้ใช้ <span className="txt-red">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="ชื่อผู้ใช้" 
                                    onChange={handleUsernameChange}
                                    style={{ fontFamily: 'Sarabun, sans-serif' }}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>รหัสผ่าน <span className="txt-red">*</span></label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="รหัสผ่าน" 
                                    onChange={handlePasswordChange}
                                    style={{ fontFamily: 'Sarabun, sans-serif' }}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>ยืนยันรหัสผ่าน <span className="txt-red">*</span></label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="ยืนยันรหัสผ่าน" 
                                    onChange={handleConfirmPasswordChange}
                                    style={{ fontFamily: 'Sarabun, sans-serif' }}
                                    required 
                                />
                            </div>
                            <div className="clr">
                                <button 
                                    type="submit" 
                                    className="btn-login btn-block"
                                    style={{ 
                                        opacity: isLoading ? 0.7 : 1, 
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Sarabun, sans-serif'
                                    }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'กำลังลงทะเบียน...' : (
                                        <>สมัครสมาชิก</>
                                    )}
                                </button>
                            </div>
                            <div className="forgotpassword">
                                <Link to="/forgot-password" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-unlock-alt"></i> ลืมรหัสผ่าน
                                </Link>
                                <Link to="/login" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-sign-in-alt"></i> มีบัญชีอยู่แล้ว
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;