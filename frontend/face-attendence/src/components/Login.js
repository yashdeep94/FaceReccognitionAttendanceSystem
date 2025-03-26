import { Button, Container } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import FaceContext from '../contexts/FaceContext';

const Login = () => {
  const globalState = useContext(FaceContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!globalState.isLogin) {
      document.title = "Attendence App | Login";
    } else {
      navigate("/home");
    }
  }, [])
  const handleAdminClicked = () => {
    globalState.handleIsAdmin(true);
  }
  const handleStudentClicked = () => {
    globalState.handleIsAdmin(false);
  }
  return (
    <div id='mainGrid'>
      <div id='loginGrid'>
        <Container id="buttonGrid">
          <div>
            <Link to="/login">
              <Button variant="contained" className='loginButton' size='large' onClick={handleAdminClicked}>Admin Login</Button>
            </Link>
          </div>
          <div>
            <Link to='/login'>
              <Button variant="contained" className='loginButton' size='large' onClick={handleStudentClicked}>Student Login</Button>
            </Link>
          </div>
        </Container>
        <div>
          <img src=""/>
        </div>
      </div>
    </div>
  )
}

export default Login
