import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard'; 
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 
function App() {
  
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path='/' element={<Dashboard/>} />
            <Route path='/signup' element={<Register/>} /> 
            <Route path='/login' element={<Login/>}/>
          </Routes>
        </AuthProvider> 
      </Router>
    </div>
  );
}

export default App;
