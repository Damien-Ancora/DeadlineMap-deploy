import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/client', () => ({
    authFetch: vi.fn(),
}));

import { authFetch } from '../../src/api/client';
import { updateProfile, changePassword } from '../../src/api/users';

describe('users api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('updateProfile sends PATCH on /users/me/', async () => {
        authFetch.mockResolvedValue({ id: 1 });
        const payload = { first_name: 'Alice' };

        const res = await updateProfile(payload);

        expect(authFetch).toHaveBeenCalledWith('/users/me/', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        expect(res).toEqual({ id: 1 });
    });

    it('changePassword sends POST on /users/change_password/', async () => {
        authFetch.mockResolvedValue({ detail: 'ok' });
        const payload = { old_password: 'x', new_password: 'y' };

        await changePassword(payload);

        expect(authFetch).toHaveBeenCalledWith('/users/change_password/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    });
});
