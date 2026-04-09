/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/client', () => ({
    authFetch: vi.fn(),
    BASE_URL: 'http://localhost:8000/api',
}));

import { authFetch } from '../../src/api/client';
import {
    createNotificationStream,
    markNotificationAsRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications
} from '../../src/api/notifications';

describe('notifications api actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls mark-as-read endpoint', async () => {
        authFetch.mockResolvedValue({ status: 'ok' });
        await markNotificationAsRead(5);
        expect(authFetch).toHaveBeenCalledWith('/notification-users/5/mark_read/', { method: 'POST' });
    });

    it('calls mark-all and delete-all endpoints', async () => {
        authFetch.mockResolvedValue({ status: 'ok' });

        await markAllRead();
        await deleteAllNotifications();

        expect(authFetch).toHaveBeenNthCalledWith(1, '/notification-users/mark_all_read/', { method: 'POST' });
        expect(authFetch).toHaveBeenNthCalledWith(2, '/notification-users/delete_all/', { method: 'DELETE' });
    });

    it('calls delete single endpoint', async () => {
        authFetch.mockResolvedValue(null);
        await deleteNotification(9);
        expect(authFetch).toHaveBeenCalledWith('/notification-users/9/', { method: 'DELETE' });
    });

    it('stream dispatches unauthorized event when token is missing', async () => {
        const onData = vi.fn();
        const onError = vi.fn();
        const eventSpy = vi.fn();
        window.addEventListener('auth-unauthorized', eventSpy);
        const fetchSpy = vi.spyOn(globalThis, 'fetch');
        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') return null;
            return null;
        });

        createNotificationStream(onData, onError);
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(fetchSpy).not.toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalled();
        expect(onError.mock.calls[0][0].message).toBe('Unauthorized');

        window.removeEventListener('auth-unauthorized', eventSpy);
        fetchSpy.mockRestore();
        getItemSpy.mockRestore();
    });

    it('stream dispatches unauthorized event on 401', async () => {
        const onData = vi.fn();
        const onError = vi.fn();
        const eventSpy = vi.fn();
        window.addEventListener('auth-unauthorized', eventSpy);

        const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') return 'token';
            return null;
        });

        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 401,
        });

        createNotificationStream(onData, onError);
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(fetchSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalled();
        expect(onError.mock.calls[0][0].message).toBe('Unauthorized');

        window.removeEventListener('auth-unauthorized', eventSpy);
        fetchSpy.mockRestore();
        getItemSpy.mockRestore();
    });
});
