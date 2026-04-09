const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Generic Fetch Wrapper that automatically injects the Token
 */
export const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Updated for JWT
    }

    let res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        // Attempt to refresh the token
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
            try {
                const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('token', data.access);
                    headers['Authorization'] = `Bearer ${data.access}`;
                    // Retry the original request
                    res = await fetch(`${BASE_URL}${endpoint}`, {
                        ...options,
                        headers,
                    });
                } else {
                    throw new Error('Refresh failed');
                }
            } catch {
                window.dispatchEvent(new Event('auth-unauthorized'));
                throw new Error('Session expirée');
            }
        } else {
            window.dispatchEvent(new Event('auth-unauthorized'));
            throw new Error('Session expirée');
        }
    }

    // Handle 204 No Content (empty body)
    if (res.status === 204) return null;

    // Handle specific backend error JSON format {detail: "error"}
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        if (data.detail) {
            throw new Error(data.detail);
        }

        // Handle DRF dictionary field errors (e.g., { "old_password": ["Ancien mot de passe incorrect."] })
        if (typeof data === 'object' && Object.keys(data).length > 0) {
            const firstKey = Object.keys(data)[0];
            const firstError = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
            if (typeof firstError === 'string') {
                throw new Error(firstError);
            }
        }

        throw new Error('Erreur API');
    }

    return data;
};

export { BASE_URL };
