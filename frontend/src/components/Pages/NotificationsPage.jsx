// src/components/Pages/NotificationsPage.jsx
import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { PageHeader } from '../UI';
import EmptyState from '../UI/EmptyState';

const NotificationsPage = () => {
    const { notifications, markAsRead, markAllAsRead, deleteNotif, deleteAll } = useNotifications();

    const handleNotificationClick = (notif) => {
        if (!notif.is_read) {
            markAsRead(notif.id);
        }
    };

    return (
        <div className="container mt-4">
            <PageHeader title="Mes Notifications" icon="bi-bell-fill">
                <div className="btn-group">
                    {notifications.some(n => !n.is_read) && (
                        <button onClick={markAllAsRead} className="btn btn-outline-primary btn-sm me-2">
                            Tout marquer comme lu
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button onClick={deleteAll} className="btn btn-outline-danger btn-sm">
                            Tout supprimer
                        </button>
                    )}
                </div>
            </PageHeader>

            {notifications.length === 0 ? (
                <EmptyState
                    icon="bi-inbox"
                    title="Aucune notification."
                    message="Vous êtes à jour !"
                />
            ) : (
                <div className="list-group">
                    {notifications.map(item => (
                        <div
                            key={item.id}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${!item.is_read ? 'bg-light fw-bold' : ''}`}
                            onClick={() => handleNotificationClick(item)}
                        >
                            <div className="flex-grow-1">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{item.notification.title}</h5>
                                    <small className="text-muted">{new Date(item.notification.date).toLocaleDateString()}</small>
                                </div>
                                <p className="mb-1">{item.notification.description}</p>
                            </div>

                            <div className="d-flex align-items-center">
                                {!item.is_read && <span className="badge bg-primary rounded-pill me-3">Non lu</span>}
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering markAsRead
                                        deleteNotif(item.id);
                                    }}
                                    title="Supprimer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
