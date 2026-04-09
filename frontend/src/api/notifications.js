import { authFetch, BASE_URL } from './client';

export const createNotificationStream = (onData, onError, signal) => {
    const token = localStorage.getItem('token');

    // We start an async function but don't await it here, 
    // it runs as a background processor for the stream.
    const startStream = async () => {
        try {
            if (!token) {
                window.dispatchEvent(new Event('auth-unauthorized'));
                throw new Error('Unauthorized');
            }

            const response = await fetch(`${BASE_URL}/notification-users/stream/`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: signal
            });

            if (response.status === 401) {
                window.dispatchEvent(new Event('auth-unauthorized'));
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error('Stream request failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                    const line = buffer.slice(0, newlineIndex).trim();
                    buffer = buffer.slice(newlineIndex + 1);

                    if (line.startsWith('data:')) {
                        const dataStr = line.substring(5).trim();
                        if (dataStr) {
                            try {
                                const data = JSON.parse(dataStr);
                                onData(data);
                            } catch (error) {
                                console.error('SSE Error parsing JSON:', error);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                onError(error);
            }
        }
    };

    startStream();
};

export const markNotificationAsRead = (id) => authFetch(`/notification-users/${id}/mark_read/`, { method: 'POST' });
export const markAllRead = () => authFetch('/notification-users/mark_all_read/', { method: 'POST' });
export const deleteNotification = (id) => authFetch(`/notification-users/${id}/`, { method: 'DELETE' });
export const deleteAllNotifications = () => authFetch('/notification-users/delete_all/', { method: 'DELETE' });
