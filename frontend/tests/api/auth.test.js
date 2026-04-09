import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/client', () => ({
    BASE_URL: 'http://localhost:8000/api',
}));

import { login, register } from '../../src/api/auth';

describe('auth api', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('login sends credentials and returns payload', async () => {
        const payload = { token: 't', refresh: 'r', user: { id: 1 } };
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(payload),
        });

        const result = await login('alice', 'pwd');

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:8000/api/auth/login/',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'alice', password: 'pwd' }),
            })
        );
        expect(result).toEqual(payload);
    });

    it('login throws backend message on error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({ error: 'Identifiants invalides.' }),
        });

        await expect(login('alice', 'bad')).rejects.toThrow('Identifiants invalides.');
    });

    it('register flattens validation errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({ email: ['already exists'], password: ['too short'] }),
        });

        await expect(register({ email: 'x' })).rejects.toThrow('already exists, too short');
    });
});
