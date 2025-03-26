import React, { useContext, useEffect, useState } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';

const AddSubject = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [standardData, setStandardData] = useState([]);
    const [standard, setStandard] = useState('');
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Add Subject";
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
    const handleAddSubject = () => {
        let data = {
            "name": document.getElementById("name").value,
            "professor": document.getElementById("professor").value,
            "standard": standard,
        }
        if (standard !== "" && data.name !== "") {
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/subject/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    document.getElementById("name").value = "";
                    document.getElementById("professor").value = "";
                    setStandard('');
                    alert("Subject added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Subject Name and Standard can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className='formGrid'>
                <h2>Add Subject</h2>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Subject Name' id='name' required />
                    </ThemeProvider>
                </div>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Professor Name' id='professor' />
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
                <Button variant='contained' onClick={handleAddSubject}>Add</Button>
            </Container>
        </div>
    )
}

export default AddSubject
