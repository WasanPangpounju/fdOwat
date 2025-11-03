import endpoint from '../config';

import axios from 'axios';
import { useState } from 'react';

function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleLogin(event) {
        event.preventDefault();
        //const endpoint = 'http://192.168.1.189:3000/users/auth/login';
        //const endpoint = 'http://localhost:3000/users/auth/login';
        localStorage.clear();

        const data = {
            username: username,
            password: password
        };
        axios.post(endpoint + '/users/auth/login', data)
            .then(response => {
                setMessage('Login successful!');
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role); // เพิ่มบรรทัดนี้เพื่อเก็บ role

                localStorage.setItem('loggedIn', 'true');
                window.location.reload();
            })
            .catch(error => {
                setMessage('Login failed. กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง');
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
        <div class="wrapper">
            <div class="Form_login">
                <div class="login-page inner_login">
                    <div class="login-box">
                        <div class="logo-login"><img src="/assets/images/logo-xl.png" alt="" class="" /></div>
                        <div class="title-login">
                            <h2>ระบบบริหารทรัพยากรบุคคล</h2>
                        </div>
                        <div class="txt-login">
                            <i class="fas fa-user-circle"></i> เข้าสู่ระบบ
                        </div>
                        <p>{message}</p>
                        <form onSubmit={handleLogin}>

                            <div class="form-group">
                                <label for="">ชื่อผู้ใช้หรืออีเมล์  <span class="txt-red">*</span></label>
                                <input type="text" class="form-control" id="username" name="username" placeholder="ชื่อผู้ใช้หรืออีเมล์" onChange={handleUsernameChange} />
                            </div>
                            <div class="form-group">
                                <label for="">รหัสผ่าน  <span class="txt-red">*</span></label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="รหัสผ่าน " onChange={handlePasswordChange} />
                            </div>
                            <div class="clr">
                                <button type="submit" class="btn-login btn-block">เข้าสู่ระบบ <img src="/assets/images/right-to-bracket-solid.png" width="15" /></button>
                            </div>
                            <div class="forgotpassword"><a href=""><i class="fas fa-unlock-alt"></i> ลืมรหัสผ่าน ?</a><a href=""><i class="fas fa-user-plus"></i> ลงทะเบียนใหม่</a></div>
                        </form>
                    </div>
                    {/* <!--login-box--> */}
                    <div class="Copyright"><p>Copyright © 2022 สงวนลิขสิทธิ์ โดย บริษัท โอวาท โปร แอนด์ ควิก จำกัด</p></div>
                </div>
                {/* <!--login-page--> */}
            </div>
            {/* <!--Form_login--> */}
        </div>
        // {/* <!--wrapper--> */ }


    );
}

export default LoginForm;
