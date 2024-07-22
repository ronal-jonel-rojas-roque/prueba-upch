import React from 'react';
import { Navigate } from 'react-router-dom';

type ComponentType = React.ComponentType<any>;

interface PrivateRouteProps {
    component: ComponentType;
    requiredRole: string;
}

const PrivateRoute = ({ component: Component, requiredRole, ...props }: PrivateRouteProps) => {
    // Comprobar si el usuario está autenticado,
    const isLoggedIn = localStorage.getItem('token') !== null;
    const userRole = localStorage.getItem('userRole');

    // Si el usuario está autenticado, renderiza el componente solicitado, de lo contrario, redirige al inicio
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    if (userRole !== requiredRole) {
        return <Navigate to="/home" />;
    }

    return <Component {...props} />;
};

export default PrivateRoute;
