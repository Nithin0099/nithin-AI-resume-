import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import WithoutAi from './components/templatePage';
import ResumeEditor from './components/resumeEditor';
import Temp2 from './components/Temp2';
import Temp4 from './components/Temp4';
import Temp3 from './components/Temp3';
import Temp5 from './components/Temp5';
import Temp6 from './components/Temp6';
import Temp7 from './components/Temp7';
import Temp8 from './components/Temp8';
import Temp9 from './components/Temp9';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import Sidebar1 from './components/Sidebar1';
import Sidebar2 from './components/Sidebar2';
import ResumeEditorModern from './components/ResumeEditorModern';
import PrintableResume from './components/PrintableResume';
import PasswordReset from './components/PasswordReset';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/templatepage' element={<WithoutAi />} />
          <Route exact path='/temp1' element={<ResumeEditor />} />
          <Route exact path='/temp2' element={<Temp2 />} />
          <Route exact path='/temp3' element={<Temp3 />} />
          <Route exact path='/temp4' element={<Temp4 />} />
          <Route exact path='/temp5' element={<Temp5 />} />
          <Route exact path='/temp6' element={<Temp6 />} />
          <Route exact path='/temp7' element={<Temp7 />} />
          <Route exact path='/temp8' element={<Temp8 />} />
          <Route exact path='/temp9' element={<Temp9 />} />
          <Route exact path='/Sidebar' element={<Sidebar />} />
          <Route exact path='/Sidebar1' element={<Sidebar1 />} />
          <Route exact path='/Sidebar2' element={<Sidebar2 />} />
          <Route exact path='/ResumeEditorModern' element={<ResumeEditorModern />} />
          <Route exact path='/Login' element={<Login />} />
          <Route exact path='/Signup' element={<Signup />} />
          <Route exact path='/PasswordReset' element={<PasswordReset />} />
          <Route exact path='/printable-resume' element={<PrintableResume />} />
        </Routes>
      </Router>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
