import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceContext from '../contexts/FaceContext';

const CreateStudent = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [standardData, setStandardData] = useState([]);
    const [standard, setStandard] = useState('');
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Create Student User";
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/standard/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                let parsedData = JSON.parse(data);
                setStandardData(parsedData);
            })
        } else {
            navigate("/login");
        }
    }, [])
    const handleStandardChange = (event) => {
        setStandard(event.target.value);
    }
    const handleAddStudent = () => {
        let data = {
            "name": document.getElementById("name").value,
            "password": document.getElementById("password").value,
            "rollNumber": document.getElementById("rollNumber").value,
            "standard": standard,
        }
        if (standard !== "" && data.name !== "" && data.password !== "" && data.rollNumber !== "") {
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/studentuser/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    document.getElementById("name").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("rollNumber").value = "";
                    setStandard('');
                    alert("Student added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Name and Roll Number and Password and Standard can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className='formGrid'>
                <h2>Add Student User</h2>
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
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Roll Number' id='rollNumber' type='number' required />
                    </ThemeProvider>
                </div>
                <FormControl>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <InputLabel id="standard-label">Standard</InputLabel>
                        <Select
                            labelId="standard-label"
                            id="standard"
                            label="Standard"
                            value={standard}
                            onChange={handleStandardChange}
                        >
                            {standardData.map(ele => {
                                return <MenuItem value={ele.pk} key={ele.pk}>{ele.pk}</MenuItem>
                            })}
                        </Select>
                    </ThemeProvider>
                </FormControl>
                <Button variant='contained' onClick={handleAddStudent}>Add</Button>
            </Container>
        </div>
    )
}

export default CreateStudent
