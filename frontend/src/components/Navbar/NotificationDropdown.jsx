import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationDropdown = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            markAsRead(notif.id);
        }
    };

    return (
        <li className="nav-item dropdown me-3">
            <a
                className="nav-link dropdown-toggle position-relative"
                href="#"
                id="notificationDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                        <span className="visually-hidden">unread messages</span>
                    </span>
                )}
            </a>
            <ul className="dropdown-menu dropdown-menu-end overflow-auto" aria-labelledby="notificationDropdown">
                <li><h6 className="dropdown-header">Notifications</h6></li>
                <li><hr className="dropdown-divider" /></li>

                {notifications.length === 0 ? (
                    <li><span className="dropdown-item text-muted">Aucune notification</span></li>
                ) : (
                    notifications.map(item => (
                        <li key={item.id}>
                            <button
                                className={`dropdown-item text-wrap ${!item.is_read ? 'fw-bold bg-light' : ''}`}
                                onClick={() => handleNotificationClick(item)}
                            >
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">{new Date(item.notification.date).toLocaleDateString()}</small>
                                    {!item.is_read && <span className="badge bg-primary ant-badge-dot"></span>}
                                </div>
                                <p className="mb-1">{item.notification.title}</p>
                                <small className="text-muted">{item.notification.description}</small>
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </li>
    );
};

export default NotificationDropdown;
