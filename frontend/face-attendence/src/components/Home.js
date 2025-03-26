import React, { useContext, useEffect, useState } from 'react';
import FaceContext from '../contexts/FaceContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../css/home.css';
import { dark } from '@mui/material/styles/createPalette';

const Home = () => {
  const globalState = useContext(FaceContext);
  const navigate = useNavigate();
  const [lectureData, setLectureData] = useState([]);
  const [date, setDate] = useState(null);
  useEffect(() => {
    if (globalState.isLogin) {
      document.title = globalState.isAdmin ? "Attendence App | Admin Home" : "Attendence App | Student Home";
      if (!globalState.isAdmin) {
        const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
        let date = new Date();
        fetch(`${globalState.apiUrl}api/lecture?date=${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`, {
          headers: {
            "Auth-Token": cookieValue,
          },
        }).then(response => {
          if (response.status === 200) {
            return response.json();
          }
        }).then(data => {
          let parsedData = JSON.parse(data);
          setLectureData(parsedData);
        })
      }
    } else {
      navigate("/login");
    }
  }, [])
  const handleStartLecture = (ele) => {
    globalState.setCurrentLecture(ele);
    navigate('/lecture');
  }
  const handleDateChange = (value) => {
    setDate(value);
    const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
    fetch(`${globalState.apiUrl}api/lecture?admindate=${value["$y"]}-${(value["$M"] + 1) < 10 ? `0${value["$M"] + 1}` : value["$M"] + 1}-${value["$D"] < 10 ? `0${value["$D"]}` : value["$D"]}`, {
      headers: {
        "Auth-Token": cookieValue,
      },
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
    }).then(data => {
      let parsedData = JSON.parse(data);
      setLectureData(parsedData);
    })
  }
  const handleAttendance = (ele) => {
    globalState.setCurrentLecture(ele);
    navigate('/attendance');
  }
  return (
    <>
      {!globalState.isAdmin ? <>
        <div className='formGridWrapper'>
          {lectureData.length !== 0 ? <Container sx={{ pt: "2rem", pb: "2rem" }}>
            <h2>Available Lectures</h2>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="right">Classroom</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lectureData.map((ele) => (
                    <TableRow
                      key={ele.pk}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {ele.fields.subject}
                      </TableCell>
                      <TableCell align="right">{ele.fields.classroom}</TableCell>
                      <TableCell align="right">{ele.fields.duration} Minutes</TableCell>
                      <TableCell align="right">
                        <Button variant='contained' onClick={() => { handleStartLecture(ele) }}>Start</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container> : <Container sx={{ textAlign: 'center', pt: '2rem' }}>
            <h3>No Lectures Scheduled For Today.</h3>
          </Container>}
        </div>
      </> : <>
        <div className='formGridWrapper'>
          {<Container id='AdminGrid'>
            <div>
              <ThemeProvider theme={globalState.darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker label="Date" value={date} onChange={(value) => { handleDateChange(value) }} />
                  </DemoContainer>
                </LocalizationProvider>
              </ThemeProvider>
            </div>
            {lectureData.length !== 0 ?
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell align="right">Classroom</TableCell>
                      <TableCell align="right">Duration</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lectureData.map((ele) => (
                      <TableRow
                        key={ele.pk}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {ele.fields.subject}
                        </TableCell>
                        <TableCell align="right">{ele.fields.classroom}</TableCell>
                        <TableCell align="right">{ele.fields.duration} Minutes</TableCell>
                        <TableCell align="right">
                          <Button variant='contained' onClick={() => { handleAttendance(ele) }}>Attendance</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              : <Container sx={{ textAlign: 'center', pt: '2rem' }}>
                <h3>No lectures scheduled on selected date.</h3>
              </Container>}
          </Container>}
        </div>
      </>}
    </>
  )
}

export default Home
