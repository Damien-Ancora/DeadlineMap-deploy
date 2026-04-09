import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    // If not authenticated (no auth context) or no user/token, redirect to login
    if (!auth || !auth.user || !auth.token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default PrivateRoute;
