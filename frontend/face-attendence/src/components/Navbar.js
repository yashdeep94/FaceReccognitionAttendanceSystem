import React, { useContext } from 'react';
import FaceContext from '../contexts/FaceContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import '../css/navbar.css';

const Navbar = () => {
    const globalState = useContext(FaceContext);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const handleLogout = () => {
        globalState.handleAuthenticate(false);
        globalState.handleIsAdmin(false);
        globalState.setUserName('');
        navigate('/');
    }
    return (
        <Box sx={{ flexGrow: 1, height: '9vh' }}>
            <AppBar position="static" id="navBarComponent">
                <Toolbar>
                    {globalState.isLogin && <>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        {globalState.isAdmin ? <Drawer open={open} onClose={toggleDrawer(false)} color='inherit'>
                            <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
                                <nav aria-label="navbar">
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/home">
                                                    <ListItemText primary="Home" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/createStudent">
                                                    <ListItemText primary="Add Student User" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/addStandard">
                                                    <ListItemText primary="Add Standard" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/addSubject">
                                                    <ListItemText primary="Add Subject" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/addClassroom">
                                                    <ListItemText primary="Add Classroom" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/addLecture">
                                                    <ListItemText primary="Add Lecture" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/createAdmin">
                                                    <ListItemText primary="Add Admin User" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                </nav>
                            </Box>
                        </Drawer> : <Drawer open={open} onClose={toggleDrawer(false)} color='inherit'>
                            <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
                                <nav aria-label="navbar">
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Link to="/home">
                                                    <ListItemText primary="Home" />
                                                </Link>
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                    <Divider />
                                </nav>
                            </Box>
                        </Drawer>}
                    </>}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Student Attendance System
                    </Typography>
                    {globalState.isLogin && <>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', pr: "2rem" }}>
                            {globalState.userName}
                        </Typography>
                        <Button variant='outlined' color="inherit" onClick={handleLogout} sx={{ fontWeight: 'bold' }}>Logout</Button>
                    </>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
