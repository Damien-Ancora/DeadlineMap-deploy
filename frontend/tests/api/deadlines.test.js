import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/client', () => ({
    authFetch: vi.fn(),
}));

import { authFetch } from '../../src/api/client';
import { getDeadlines, getDeadline, createDeadline, updateDeadline, deleteDeadline } from '../../src/api/deadlines';

describe('deadlines api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getDeadlines merges paginated pages', async () => {
        authFetch
            .mockResolvedValueOnce({ results: [{ id: 1 }], next: 'p2' })
            .mockResolvedValueOnce({ results: [{ id: 2 }], next: null });

        const data = await getDeadlines({ status: 'pending' });

        expect(data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(authFetch).toHaveBeenNthCalledWith(1, '/deadlines/?status=pending&page=1');
        expect(authFetch).toHaveBeenNthCalledWith(2, '/deadlines/?status=pending&page=2');
    });

    it('getDeadline calls detail endpoint', async () => {
        authFetch.mockResolvedValue({ id: 7 });
        await getDeadline(7);
        expect(authFetch).toHaveBeenCalledWith('/deadlines/7/');
    });

    it('create/update/delete call expected HTTP methods', async () => {
        authFetch.mockResolvedValue({ ok: true });

        await createDeadline({ name: 'A' });
        await updateDeadline(5, { status: 'completed' });
        await deleteDeadline(5);

        expect(authFetch).toHaveBeenNthCalledWith(1, '/deadlines/', expect.objectContaining({ method: 'POST' }));
        expect(authFetch).toHaveBeenNthCalledWith(2, '/deadlines/5/', expect.objectContaining({ method: 'PATCH' }));
        expect(authFetch).toHaveBeenNthCalledWith(3, '/deadlines/5/', expect.objectContaining({ method: 'DELETE' }));
    });
});
