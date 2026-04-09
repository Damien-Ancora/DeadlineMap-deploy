import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PublicRoute = ({ children }) => {
    const auth = useAuth();
    // Si l'utilisateur est déjà connecté, on le redirige vers le dashboard
    if (auth && auth.user && auth.token) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default PublicRoute;
