import endpoint from '../config';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import FeatureModal from './FeatureModal';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFeatureModal, setShowFeatureModal] = useState(false);


    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleLogin(event) {
        event.preventDefault();
        
        // ถ้ากำลัง loading อยู่ให้ return ออกไปเลย
        if (isLoading) return;
        
        // เซ็ต loading state เป็น true
        setIsLoading(true);
        
        localStorage.clear();

        const data = {
            username: username,
            password: password
        };
        axios.post(endpoint + '/users/auth/login', data)
            .then(response => {
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('loggedIn', 'true');

                // Show success toast
                toast.success('เข้าสู่ระบบสำเร็จ', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Slight delay before reload to show the toast
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                // Show error toast
                toast.error('ตรวจสอบชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .finally(() => {
                // เซ็ต loading state กลับเป็น false เมื่อเสร็จสิ้น
                setIsLoading(false);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        // Get the values of the username and password fields
        const username = event.target.elements.username.value;
        const password = event.target.elements.password.value;
        // Call the onLogin function with the username and password
        onLogin(username, password);
    }

    return (
        <div className="wrapper login-wrapper">
            <div className="Form_login" style={{ height: '100%' }}>
                <div className="login-page inner_login" style={{ height: '100%', fontFamily: 'Sarabun, sans-serif' }}>
                    <div class="login-box">
                        <div class="logo-login"><img src='src/assets/images/logo-xl.png' alt="logo" class="" /></div>
                        <div class="title-login">
                            <h2 style={{ fontFamily: 'Sarabun, sans-serif' }}>ระบบบริหารทรัพยากรบุคคล</h2>
                        </div>
                        <div class="txt-login">
                            <i class="fas fa-user-circle"></i> เข้าสู่ระบบ
                        </div>
                        <ToastContainer />
                        <form onSubmit={handleLogin}>

                            <div class="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>ชื่อผู้ใช้หรืออีเมล  <span class="txt-red">*</span></label>
                                <input type="text" class="form-control" id="username" name="username" placeholder="ชื่อผู้ใช้หรืออีเมล" onChange={handleUsernameChange} style={{ fontFamily: 'Sarabun, sans-serif' }} />
                            </div>
                            <div class="form-group">
                                <label style={{ fontFamily: 'Sarabun, sans-serif' }}>รหัสผ่าน  <span class="txt-red">*</span></label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="รหัสผ่าน " onChange={handlePasswordChange} style={{ fontFamily: 'Sarabun, sans-serif' }} />
                            </div>
                            <div class="clr">
                                <button 
                                    type="submit" 
                                    class="btn-login btn-block"
                                    style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : (
                                        <>เข้าสู่ระบบ <img src='/src/assets/images/right-to-bracket-solid.png' width="15" alt="login" /></>
                                    )}
                                </button>
                            </div>
                            <div className="forgotpassword">
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowFeatureModal(true); }} style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-unlock-alt"></i> ลืมรหัสผ่าน
                                </a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setShowFeatureModal(true); }} style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-user-plus"></i> ลงทะเบียนใหม่
                                </a>
                            </div>
                            {/* <div className="forgotpassword">
                                <Link to="/forgot-password" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-unlock-alt"></i> ลืมรหัสผ่าน
                                </Link>
                                <Link to="/register" style={{ fontFamily: 'Sarabun, sans-serif' }}>
                                    <i className="fas fa-user-plus"></i> ลงทะเบียนใหม่
                                </Link>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
            <FeatureModal 
                isOpen={showFeatureModal} 
                onClose={() => setShowFeatureModal(false)} 
            />
        </div>
    );

}

export default LoginForm;
