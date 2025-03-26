import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import '../css/attendance.css';
import { utils, writeFileXLSX } from 'xlsx';

const Attendance = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [attendedData, setAttendedData] = useState([]);
    const [notAttendedData, setNotAttendedData] = useState([]);
    useEffect(() => {
        if (globalState.isLogin && globalState.isAdmin) {
            document.title = "Attendence App | Attendance";
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/studentuser/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                let parsedData = JSON.parse(data);
                let localAttendedData = [];
                let localNotAttendedData = [];
                parsedData.forEach(ele => {
                    if (globalState.currentLecture.fields.students.includes(ele.pk)) {
                        localAttendedData.push(ele);
                    } else {
                        localNotAttendedData.push(ele);
                    }
                })
                setAttendedData(localAttendedData);
                setNotAttendedData(localNotAttendedData);
            })
        } else {
            navigate("/login");
        }
    }, [])
    const handleExportInExcel = () => {
        let dataJson = [{
            "Subject" : globalState.currentLecture.fields.subject,
            "Date" : globalState.currentLecture.fields.date,
            "Classroom" : globalState.currentLecture.fields.classroom,
            "Lecture Duration (In Minutes)" : globalState.currentLecture.fields.duration,
            "" : null,
            "Attended By" : "Roll Number",
            " " : "Name",
            "  " : null,
            "Not Attended By" : "Roll Number",
            "   " : "Name"
        }]
        attendedData.forEach((ele) => {
            dataJson.push({
                "Subject" : null,
                "Date" : null,
                "Classroom" : null,
                "Lecture Duration (In Minutes)" : null,
                "" : null,
                "Attended By" : ele.pk,
                " " : ele.fields.name,
                "  " : null,
                "Not Attended By" : null,
                "   " : null
            });
        });
        notAttendedData.forEach((ele, index) => {
            if (index < attendedData.length) {
                dataJson[index + 1]["Not Attended By"] = ele.pk;
                dataJson[index + 1]["   "] = ele.fields.name;
            }else{
                dataJson.push({
                    "Subject" : null,
                    "Date" : null,
                    "Classroom" : null,
                    "Lecture Duration (In Minutes)" : null,
                    "" : null,
                    "Attended By" : null,
                    " " : null,
                    "  " : null,
                    "Not Attended By" : ele.pk,
                    "   " : ele.fields.name
                });
            }
        });
        let worksheet = utils.json_to_sheet(dataJson);
        worksheet['!merges'] = [{s:{c:5, r:0}, e:{c:6, r:0}}, {s:{c:8, r:0}, e:{c:9, r:0}}];
        worksheet['!cols'] = [
            {"wch" : 20},
            {"wch" : 15},
            {"wch" : 20},
            {"wch" : 30},
            {"wch" : 5},
            {"wch" : 20},
            {"wch" : 20},
            {"wch" : 5},
            {"wch" : 20},
            {"wch" : 20}
        ];
        let workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        writeFileXLSX(workbook, `${globalState.currentLecture.fields.date}_${globalState.currentLecture.fields.subject}.xlsx`);
    }
    return (
        <>
            <div className='formGridWrapper'>
                <Container id='AttendanceGrid'>
                    <div>
                        <div>
                            <h2>{globalState.currentLecture.fields.subject}</h2>
                        </div>
                        <div>
                            <Button variant='contained' color='success' onClick={handleExportInExcel}>Export data</Button>
                        </div>
                    </div>
                    <div>
                        <h2>Attended - ({attendedData.length})</h2>
                        {attendedData.length !== 0 && <TableContainer component={Paper}>
                            <Table aria-label="attended table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Roll Number</TableCell>
                                        <TableCell >Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendedData.map((ele) => (
                                        <TableRow
                                            key={ele.pk}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {ele.pk}
                                            </TableCell>
                                            <TableCell>{ele.fields.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                    </div>
                    <div>
                        <h2>Not Attended - ({notAttendedData.length}) </h2>
                        {notAttendedData.length !== 0 && <TableContainer component={Paper}>
                            <Table aria-label="not attended table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Roll Number</TableCell>
                                        <TableCell>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {notAttendedData.map((ele) => (
                                        <TableRow
                                            key={ele.pk}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {ele.pk}
                                            </TableCell>
                                            <TableCell>{ele.fields.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Attendance
