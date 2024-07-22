import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import ErrorPage from './components/errorpage/ErrorPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginController from './controller/LoginController';
import PrivateRoute from './controller/PrivateRoute';

function App() {
  /* const isLoggedIn = localStorage.getItem('token') !== null; */

  return (
    <div className="App">
          <Routes>
            <Route path="/" element={<LoginController />} />
            <Route path="/home" element={<PrivateRoute component={Home} requiredRole="user" />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/*" element={<Navigate to="/error" />} />
          </Routes>
        </div>
  );
}

export default App;
