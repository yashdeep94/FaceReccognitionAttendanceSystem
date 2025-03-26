import React, { useContext, useEffect, useState } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddLecture = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [subjectData, setSubjectData] = useState([]);
    const [subject, setSubject] = useState('');
    const [classroomData, setClassroomData] = useState([]);
    const [classroom, setClassroom] = useState('');
    const [date, setDate] = useState(null);
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Add Lecture";
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/subject/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                let parsedData = JSON.parse(data);
                setSubjectData(parsedData);
            })
            fetch(`${globalState.apiUrl}api/classroom/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                let parsedData = JSON.parse(data);
                setClassroomData(parsedData);
            })
        } else {
            navigate("/login");
        }
    }, [])
    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    }
    const handleClassroomChange = (event) => {
        setClassroom(event.target.value);
    }
    const handleAddLecture = () => {
        if (date !== null && document.getElementById("duration").value !== "" && classroom !== "" && subject !== "") {
            let data = {
                "date": `${date["$y"]}-${(date["$M"] + 1) < 10 ? `0${date["$M"] + 1}` : date["$M"] + 1}-${date["$D"] < 10 ? `0${date["$D"]}` : date["$D"]}`,
                "classroom": classroom,
                "subject": subject,
                "duration": document.getElementById("duration").value,
            }
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/lecture/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    setDate(null)
                    document.getElementById("duration").value = "";
                    setClassroom('');
                    setSubject('');
                    alert("Lecture added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Date and Classroom and Subject Name and Duration can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className='formGrid'>
                <h2>Add Lecture</h2>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date" value={date} onChange={(value) => { setDate(value); }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </ThemeProvider>
                </div>
                <FormControl>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <InputLabel id="classroom-label">Classroom</InputLabel>
                        <Select
                            labelId="classroom-label"
                            id="classroom"
                            label="Classroom"
                            value={classroom}
                            onChange={handleClassroomChange}
                        >
                            {classroomData.map(ele => {
                                return <MenuItem value={ele.pk} key={ele.pk}>{ele.pk}</MenuItem>
                            })}
                        </Select>
                    </ThemeProvider>
                </FormControl>
                <FormControl>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <InputLabel id="subject-label">Subject</InputLabel>
                        <Select
                            labelId="subject-label"
                            id="subject"
                            label="Subject"
                            value={subject}
                            onChange={handleSubjectChange}
                        >
                            {subjectData.map(ele => {
                                return <MenuItem value={ele.pk} key={ele.pk}>{ele.pk}</MenuItem>
                            })}
                        </Select>
                    </ThemeProvider>
                </FormControl>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Duration (In Minutes)' id='duration' type='number' required />
                    </ThemeProvider>
                </div>
                <Button variant='contained' onClick={handleAddLecture}>Add</Button>
            </Container>
        </div>
    )
}

export default AddLecture
