import { authFetch } from './client';

export const getDeadlines = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    let page = 1;
    let allResults = [];

    while (true) {
        params.set('page', String(page));
        const res = await authFetch(`/deadlines/?${params.toString()}`);

        // If pagination is disabled on backend, return the plain array/object.
        if (!res || !Array.isArray(res.results)) {
            return res ?? [];
        }

        allResults = allResults.concat(res.results);

        if (!res.next) {
            break;
        }

        page += 1;
    }

    return allResults;
};

export const getDeadline = (id) => authFetch(`/deadlines/${id}/`);
export const createDeadline = (data) => authFetch('/deadlines/', { method: 'POST', body: JSON.stringify(data) });
export const updateDeadline = (id, data) => authFetch(`/deadlines/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteDeadline = (id) => authFetch(`/deadlines/${id}/`, { method: 'DELETE' });
