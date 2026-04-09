import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/client', () => ({
    authFetch: vi.fn(),
}));

import { authFetch } from '../../src/api/client';
import { getGroups, getGroup, createGroup, addMember, removeMember, leaveGroup } from '../../src/api/groups';

describe('groups api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getGroups returns all paginated results', async () => {
        authFetch
            .mockResolvedValueOnce({ results: [{ id: 1 }], next: 'p2' })
            .mockResolvedValueOnce({ results: [{ id: 2 }], next: null });

        const groups = await getGroups();

        expect(groups).toEqual([{ id: 1 }, { id: 2 }]);
        expect(authFetch).toHaveBeenNthCalledWith(1, '/groups/?page=1');
        expect(authFetch).toHaveBeenNthCalledWith(2, '/groups/?page=2');
    });

    it('group actions call expected endpoints', async () => {
        authFetch.mockResolvedValue({ ok: true });

        await getGroup(4);
        await createGroup({ name: 'Team' });
        await addMember(4, 'x@test.com');
        await removeMember(4, 99);
        await leaveGroup(4);

        expect(authFetch).toHaveBeenNthCalledWith(1, '/groups/4/');
        expect(authFetch).toHaveBeenNthCalledWith(2, '/groups/', expect.objectContaining({ method: 'POST' }));
        expect(authFetch).toHaveBeenNthCalledWith(3, '/groups/4/add_member/', expect.objectContaining({ method: 'POST' }));
        expect(authFetch).toHaveBeenNthCalledWith(4, '/groups/4/remove_member/', expect.objectContaining({ method: 'POST' }));
        expect(authFetch).toHaveBeenNthCalledWith(5, '/groups/4/leave/', expect.objectContaining({ method: 'POST' }));
    });
});
