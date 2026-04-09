import { useState, useEffect } from 'react';
import { createNotificationStream, markAllRead, markNotificationAsRead, deleteNotification, deleteAllNotifications } from '../api/notifications';

export const useNotificationsStream = (user) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initial load + Stream setup
    useEffect(() => {
        let isSubscribed = true;

        if (!user) {
            // Delay zero frame to prevent synchronous state change during effect setup
            setTimeout(() => {
                if (isSubscribed) {
                    setNotifications([]);
                    setUnreadCount(0);
                }
            }, 0);
            return;
        }

        let abortController = new AbortController();
        let timeoutId;

        const connectStream = () => {
            if (!user) return;

            createNotificationStream(
                // onData Callback
                (data) => {
                    if (Array.isArray(data)) {
                        setNotifications(data);
                        setUnreadCount(data.filter(n => !n.is_read).length);
                    }
                },
                // onError Callback
                (error) => {
                    console.error("SSE stream error/disconnect:", error);
                    if (error?.message === 'Unauthorized') {
                        return;
                    }
                    // Attempt to reconnect after 5 seconds
                    timeoutId = setTimeout(connectStream, 5000);
                },
                // Signal
                abortController.signal
            );
        };

        connectStream();

        return () => {
            isSubscribed = false;
            abortController.abort();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [user]);

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await markNotificationAsRead(id);
        } catch (error) {
            console.error("Failed to mark as read, reverting", error);
            // Revert on error
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, is_read: false } : n
            ));
            setUnreadCount(prev => prev + 1);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        const previousNotifications = notifications; // Snapshot for rollback

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await markAllRead();
        } catch (error) {
            console.error("Failed to mark all as read, reverting", error);
            setNotifications(previousNotifications);
            setUnreadCount(previousNotifications.filter(n => !n.is_read).length);
        }
    };

    const deleteNotif = async (id) => {
        const notif = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notif && !notif.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        try {
            await deleteNotification(id);
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const deleteAll = async () => {
        setNotifications([]);
        setUnreadCount(0);

        try {
            await deleteAllNotifications();
        } catch (error) {
            console.error("Failed to delete all notifications", error);
        }
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotif,
        deleteAll
    };
};