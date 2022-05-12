import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard'; 
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainForm from './components/reportfFilingForm/MainForm';
import Profile from './components/profile/Profile';

function App() {

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' >
              <Route index element={<Dashboard/>} />
              <Route path='file-report' element={<MainForm/>} />
              <Route path='signup' element={<Register/>} /> 
              <Route path='login' element={<Login/>}/>
              <Route path='profile' element={<Profile/>}/>
            </Route>
          </Routes>
        </AuthProvider> 
      </Router>
    </div>
  );
}

export default App;
