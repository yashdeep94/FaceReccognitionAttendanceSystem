import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import FaceState from './contexts/FaceState';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import CreateStudent from './components/CreateStudent';
import AddStandard from './components/AddStandard';
import AddSubject from './components/AddSubject';
import AddClassroom from './components/AddClassroom';
import AddLecture from './components/AddLecture';
import Lecture from './components/Lecture';
import Attendance from './components/Attendance';
import AddAdmin from './components/AddAdmin';

function App() {
  return (
    <>
      <BrowserRouter>
        <FaceState>
          <Navbar />
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/home' element={<Home />} />
              <Route path='/createStudent' element={<CreateStudent />} />
              <Route path='/addStandard' element={<AddStandard />} />
              <Route path='/addSubject' element={<AddSubject />} />
              <Route path='/addClassroom' element={<AddClassroom />} />
              <Route path='/addLecture' element={<AddLecture />} />
              <Route path='/lecture' element={<Lecture />} />
              <Route path='/attendance' element={<Attendance />} />
              <Route path='/createAdmin' element={<AddAdmin />} />
            </Routes>
        </FaceState>
      </BrowserRouter>
    </>
  );
}

export default App;
