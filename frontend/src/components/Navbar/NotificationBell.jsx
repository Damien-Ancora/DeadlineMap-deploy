import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBell = () => {
    const { unreadCount } = useNotifications();

    return (
        <li className="nav-item me-3">
            <NavLink className="nav-link position-relative d-flex align-items-center" to="/notifications">
                {/* SVG Bell Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell-fill text-white" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                </svg>

                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1">
                        {unreadCount}
                        <span className="visually-hidden">unread messages</span>
                    </span>
                )}
            </NavLink>
        </li>
    );
};

export default NotificationBell;
