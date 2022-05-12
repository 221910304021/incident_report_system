import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import Login from './components/login/Login';
import FiledReports from './components/filedReports/FiledReports';
import Evaluate from './components/filedReports/Evaluation';
import Register from './components/register/Register';
import Students from './components/students/Students';
import SoloStudent from './components/students/SoloStudent';
import { AuthProvider } from './context/AuthContext';
import {useAuth} from './context/AuthContext'

function App() {
  return (
    <div className="App">
      <Router>
      <AuthProvider>
       <Routes>
            <Route path='/'>
              <Route index element={<HomePage/>} />
              <Route path='login' element ={<Login/>}/>
              <Route path='register' element={<Register/>}/>
              <Route path='students'>
                <Route index element={<Students/>} />
                <Route path=':student_id' element={<SoloStudent/>}/>
              </Route>
              <Route path='filed-reports'>
                <Route index element={<FiledReports/>} />
                <Route path='evaluate/:report_id' element={<Evaluate/>}/>
              </Route>
            </Route>
          </Routes>
    </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
