import endpoint from '../config';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        
        if (isLoading) return;
        
        if (!email) {
            toast.error('กรุณากรอกอีเมล', {
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
            email: email
        };

        axios.post(endpoint + '/users/forgot-password', data)
            .then(response => {
                toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของท่านแล้ว', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            })
            .catch(error => {
                toast.error('ไม่พบอีเมลในระบบ', {
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
                            <i className="fas fa-unlock-alt"></i> ลืมรหัสผ่าน
                        </div>
                        <ToastContainer />
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>อีเมล <span className="txt-red">*</span></label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="กรอกอีเมลที่ใช้ลงทะเบียน" 
                                    onChange={handleEmailChange}
                                    style={{ fontFamily: 'Sarabun, sans-serif' }}
                                    required 
                                />
                                <small style={{ fontFamily: 'Sarabun, sans-serif', color: '#666' }}>
                                    ระบบจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของท่าน
                                </small>
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
                                    {isLoading ? 'กำลังส่งข้อมูล...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                                </button>
                            </div>
                            <div className="forgotpassword">
                                <Link to="/register" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-user-plus"></i> ลงทะเบียนใหม่
                                </Link>
                                <Link to="/login" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;