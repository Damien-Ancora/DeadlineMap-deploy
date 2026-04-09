// src/contexts/NotificationContext.jsx
import React, { createContext, useContext } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useNotificationsStream } from '../hooks/useNotificationsStream';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();

    // Defer the logic to our custom hook to respect architecture
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotif,
        deleteAll
    } = useNotificationsStream(user);

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotif,
        deleteAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

