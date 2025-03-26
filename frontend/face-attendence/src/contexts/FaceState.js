import React, { useRef, useState } from 'react'
import FaceContext from './FaceContext';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

const FaceState = (props) => {
    const [apiUrl, setApiUrl] = useState("http://localhost:8000/");
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const [currentLecture, setCurrentLecture] = useState({});
    const counterIntervalRef = useRef(null);
    const apiIntervalRef = useRef(null);
    const streamObject = useRef(null);
    const stopStream = () => {
        if (streamObject.current !== null) {
            const tracks = streamObject.current.getTracks();
    
            tracks.forEach((track) => {
                track.stop();
            });
        }
    }
    const handleAuthenticate = (value) => {
        setIsLogin(value);
    }
    const handleIsAdmin = (value) => {
        setIsAdmin(value);
    }
    return (
        <FaceContext.Provider value={{apiUrl, isLogin, handleAuthenticate, isAdmin, handleIsAdmin, userName, setUserName, currentLecture, setCurrentLecture, counterIntervalRef, apiIntervalRef, streamObject, stopStream, darkTheme}}>
            {props.children}
        </FaceContext.Provider>
    )
}

export default FaceState
