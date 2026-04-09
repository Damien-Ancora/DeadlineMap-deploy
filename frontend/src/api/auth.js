import { BASE_URL } from './client';

export const login = async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    return data;
};

export const register = async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
        const errorMsg = Object.values(data).flat().join(', ') || 'Erreur inscription';
        throw new Error(errorMsg);
    }
    return data;
};
