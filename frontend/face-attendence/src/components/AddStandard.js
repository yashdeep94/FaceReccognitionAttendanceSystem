import React, { useContext, useEffect } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, TextField, ThemeProvider } from '@mui/material';

const AddStandard = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Add Standard";
        } else {
            navigate("/login");
        }
    }, [])
    const handleAddStandard = () => {
        let data = {
            "standard": document.getElementById("standard").value,
        }
        if (data.standard !== "") {
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/standard/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "POST",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    document.getElementById("standard").value = "";
                    alert("Standard added successfully.");
                } else {
                    alert("Some error occured.");
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        } else {
            alert("Standard can not be blank.");
        }
    }
    return (
        <div className='formGridWrapper'>
            <Container className="formGrid">
                <h2>Add Standard</h2>
                <div>
                    <ThemeProvider theme={globalState.darkTheme}>
                        <TextField variant='outlined' label='Standard' id='standard' required />
                    </ThemeProvider>
                </div>
                <Button variant='contained' onClick={handleAddStandard}>Add</Button>
            </Container>
        </div>
    )
}

export default AddStandard
