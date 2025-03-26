import React, { useContext, useEffect } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, ThemeProvider } from '@mui/material';

const AddClassroom = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Add Classroom";
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    document.getElementById("latitude").defaultValue = position.coords.latitude;
                    document.getElementById("longitude").defaultValue = position.coords.longitude;
                    document.getElementById("latitude").value = position.coords.latitude;
                    document.getElementById("longitude").value = position.coords.longitude;
                });
            } else {
                alert("Location not supported by browser, so cannot proceed with lecture.");
                navigate('home');
            }
        } else {
            navigate("/login");
        }
    }, [])
    const handleAddClassroom = () => {
        let data = {
            "name": document.getElementById("name").value,
            "latitude": document.getElementById("latitude").value,
            "longitude": document.getElementById("longitude").value,
        }
        if (data.name !== "" && data.latitude !== "" && data.longitude !== "") {
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/classroom/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    document.getElementById("name").value = "";
                    document.getElementById("latitude").value = "";
                    document.getElementById("longitude").value = "";
                    alert("Classroom added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Classroom Name, Latitude and Longitude can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className='formGrid'>
                <h2>Add Classroom</h2>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Classroom Name' id='name' required />
                    </ThemeProvider>
                </div>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Latitude' id='latitude' type='number' />
                    </ThemeProvider>
                </div>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Longitude' id='longitude' type='number' />
                    </ThemeProvider>
                </div>
                <Button variant='contained' onClick={handleAddClassroom}>Add</Button>
            </Container>
        </div>
    )
}

export default AddClassroom
