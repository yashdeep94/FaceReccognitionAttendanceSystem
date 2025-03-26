import React, { useContext, useEffect } from 'react';
import FaceContext from '../contexts/FaceContext';
import { Button, Container, TextField, ThemeProvider } from '@mui/material';
import '../css/loginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!globalState.isLogin) {
            document.title = globalState.isAdmin ? "Attendence App | Admin Login" : "Attendence App | User Login";
        } else {
            navigate("/home");
        }
    }, [])
    const handleLogin = () => {
        if (globalState.isAdmin) {
            let data = {
                "name": document.getElementById("name").value,
                "password": document.getElementById("password").value,
            }
            if (data.name !== "" && data.password !== "") {
                fetch(`${globalState.apiUrl}api/auth/adminlogin/`, {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                }).then(data => {
                    document.cookie = `Auth-Token=${data.authToken};`;
                    globalState.setUserName(data.userName);
                    globalState.handleAuthenticate(true);
                    navigate('/home');
                }).catch(err => {
                    alert("Login failed.")
                })
            } else {
                alert("Name and Password can not be blank.")
            }
        } else {
            let data = {
                // "class": document.getElementById("class").value,
                "rollNumber": document.getElementById("rollNumber").value,
                "password": document.getElementById("password").value,
            }
            if (data.rollNumber !== "" && data.password !== "") {
                fetch(`${globalState.apiUrl}api/auth/studentlogin/`, {
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                }).then(data => {
                    document.cookie = `Auth-Token=${data.authToken};`;
                    globalState.setUserName(data.userName);
                    globalState.handleAuthenticate(true);
                    navigate('/home');
                }).catch(err => {
                    alert("Login failed.")
                })
            } else {
                alert("Roll Number and Password can not be blank.")
            }
        }
    }
    return (
        <>
            {!globalState.isLogin && <div className='formGridWrapper'>
                <Container className='formGrid'>
                    <div>
                        {globalState.isAdmin ? <h2>Admin Login</h2> : <h2>Student Login</h2>}
                    </div>
                    <div>
                        <ThemeProvider theme={globalState.darkTheme}>
                            {globalState.isAdmin ? <TextField id="name" label="Name" variant="outlined" required /> : <TextField id="rollNumber" label="Roll Number" variant="outlined" type='number' required />}
                        </ThemeProvider>
                    </div>
                    <div>
                        <ThemeProvider theme={globalState.darkTheme}>
                            <TextField id="password" label="Password" variant="outlined" type='password' required />
                        </ThemeProvider>
                    </div>
                    <div>
                        <Button variant="contained" onClick={handleLogin}>Login</Button>
                    </div>
                </Container>
            </div>}
        </>
    )
}

export default LoginForm
