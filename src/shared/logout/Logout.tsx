import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
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
    <Link to="/" onClick={handleLogout} className= 'logout'>
      <FaSignOutAlt className="icon" />
      <span className="title">Cerrar Sesión</span>
    </Link>
  );
};

export default Logout;



