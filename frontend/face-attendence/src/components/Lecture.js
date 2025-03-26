import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceContext from '../contexts/FaceContext';
import { Alert, Container } from '@mui/material';
import '../css/lecture.css';

const Lecture = () => {
    const globalState = useContext(FaceContext);
    const navigate = useNavigate();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [secondCounter, setSecondCounter] = useState(60);
    const [minuteCounter, setMinuteCounter] = useState(0);
    const [alertBox, setAlertBox] = useState(null);
    const [warningCount, setWarningCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [locationData, setLocationData] = useState({});
    const updateCounter = () => {
        const timerInterval = !globalState.counterIntervalRef.current && setInterval(() => {
            setSecondCounter(secondCounter => secondCounter - 1);
        }, 1000);
        globalState.counterIntervalRef.current = timerInterval;
    }
    useEffect(() => {
        if (globalState.isLogin) {
            setMinuteCounter(globalState.currentLecture.fields.duration - 1);
            document.title = "Attendence App | Lecture";
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                });
            } else {
                alert("Location not supported by browser, so cannot proceed with lecture.");
                navigate('/home');
            }
            if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user"
                    },
                })
                    .then((stream) => {
                        const video = document.querySelector("video");
                        video.srcObject = stream;
                        globalState.streamObject.current = stream;
                        video.onloadedmetadata = () => {
                            video.play();
                            updateCounter();
                        };
                    })
                    .catch((err) => {
                        console.error(`${err.name}: ${err.message}`);
                    });
            } else {
                alert('Camera not supported in this browser, so cannot proceed wih lecture.');
                navigate('/home');
            }
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/classroom?classroom=${globalState.currentLecture.fields.classroom}`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
                setLocationData(data);
            })
        } else {
            navigate("/login");
        }
        return () => {
            clearInterval(globalState.apiIntervalRef.current);
            clearInterval(globalState.counterIntervalRef.current);
            globalState.apiIntervalRef.current = null;
            globalState.counterIntervalRef.current = null;
            globalState.stopStream();
        };
    }, [])
    useEffect(() => {
        if (alertCount === 3) {
            setAlertBox(null);
            if (alertBox === "Face not Matched") {
                navigate('/home');
            }
        } else {
            setAlertCount(alertCount + 1);
        }
        if (secondCounter % 5 === 0) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                });
            } else {
                navigate('/home');
            }
            const interval = !globalState.apiIntervalRef.current && setInterval(() => {
                const video = document.querySelector('video');
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                let image_base64 = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, "");
                let data = {
                    "image": image_base64,
                }
                const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
                fetch(`${globalState.apiUrl}api/recognizeFace/`, {
                    headers: {
                        "Auth-Token": cookieValue,
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                }).then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                }).then(data => {
                    if (data.faceDetected) {
                        if (!data.recognized) {
                            setAlertBox("Face not Matched");
                            setAlertCount(0);
                        }
                    } else {
                        setAlertBox("Face Not Detected");
                        setAlertCount(0);
                        setWarningCount(warningCount => warningCount + 1);
                    }
                }).catch(err => {
                    alert("Some error occured");
                    navigate('/home');
                })
            }, 5000);
            if (!globalState.apiIntervalRef.current) {
                globalState.apiIntervalRef.current = interval;
            }
        }
        if (minuteCounter > 0 && secondCounter === 1) {
            setSecondCounter(60);
            setMinuteCounter(minuteCounter - 1);
        } else if (minuteCounter === 0 && secondCounter === 0) {
            let data = {
                "pk": globalState.currentLecture.pk,
            }
            const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("Auth-Token="))?.split("=")[1];
            fetch(`${globalState.apiUrl}api/lecture/`, {
                headers: {
                    "Auth-Token": cookieValue,
                },
                method: "PUT",
                body: JSON.stringify(data),
            }).then(response => {
                if (response.status === 200) {
                    alert("Lecture has ended attendance marked successfully.");
                    navigate('/home');
                }
            }).catch(err => {
                alert("Some error occured.");
            })
        }
    }, [secondCounter])
    useEffect(() => {
        if (warningCount === Math.ceil(globalState.currentLecture.fields.duration * 5)) {
            navigate("/home");
        }
    }, [warningCount])
    useEffect(() => {
        if (Object.keys(locationData).length !== 0 && latitude && longitude) {
            let latitudeDifference = Math.abs(locationData.latitude - latitude);
            let longitudeDifference = Math.abs(locationData.longitude - longitude);
            if (latitudeDifference > 0.1 || longitudeDifference > 0.1) {
                alert('Location Differs');
                navigate('/home');
            }
        }
    }, [locationData, latitude, longitude])
    return (
        <>
            <div className='formGridWrapper'>
                {<>
                    <div style={{height:"7vh"}}>
                        {alertBox && <Alert variant="filled" severity="warning">
                            {alertBox}
                        </Alert>}
                    </div>
                    <Container sx={{ pt: '0.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                <h2>{globalState.currentLecture.fields.subject}</h2>
                            </div>
                            <video style={{border:'none', borderRadius:'0.5rem'}}></video>
                            <div>
                                <h3>{minuteCounter}:{secondCounter}</h3>
                            </div>
                        </div>
                    </Container>
                </>}
            </div>
        </>
    )
}

export default Lecture
