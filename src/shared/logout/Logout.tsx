import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './logout.css'

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borrar los datos de autenticación del almacenamiento local
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/');
  };

  return (
    <a href="#" onClick={handleLogout} className= 'logout'>
      <FaSignOutAlt className="icon" />
      <span className="title">Cerrar Sesión</span>
    </a>
  );
};

export default Logout;



