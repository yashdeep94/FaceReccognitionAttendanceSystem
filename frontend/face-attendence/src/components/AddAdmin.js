import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceContext from '../contexts/FaceContext';

const AddAdmin = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [standardData, setStandardData] = useState([]);
    const [standard, setStandard] = useState('');
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Add Admin User";
        } else {
            navigate("/login");
        }
    }, [])
    const handleAddAdmin = () => {
        let data = {
            "name": document.getElementById("name").value,
            "password": document.getElementById("password").value
        }
        if (data.name !== "" && data.password !== "") {
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/auth/createadminuser/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    document.getElementById("name").value = "";
                    document.getElementById("password").value = "";
                    alert("Admin added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Name and Password can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className='formGrid'>
                <h2>Add Admin User</h2>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Name' id='name' required />
                    </ThemeProvider>
                </div>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Password' id='password' type='password' required />
                    </ThemeProvider>
                </div>
                <Button variant='contained' onClick={handleAddAdmin}>Add</Button>
            </Container>
        </div>
    )
}

export default AddAdmin
