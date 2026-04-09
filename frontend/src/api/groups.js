import { authFetch } from './client';

export const getGroups = async () => {
    let page = 1;
    const allResults = [];

    while (true) {
        const res = await authFetch(`/groups/?page=${page}`);

        if (!res || !Array.isArray(res.results)) {
            return res ?? [];
        }

        allResults.push(...res.results);

        if (!res.next) {
            break;
        }

        page += 1;
    }

    return allResults;
};
export const getGroup = (id) => authFetch(`/groups/${id}/`);
export const createGroup = (data) => authFetch('/groups/', { method: 'POST', body: JSON.stringify(data) });
export const addMember = (groupId, email) => authFetch(`/groups/${groupId}/add_member/`, { method: 'POST', body: JSON.stringify({ email }) });
export const removeMember = (groupId, userId) => authFetch(`/groups/${groupId}/remove_member/`, { method: 'POST', body: JSON.stringify({ user_id: userId }) });
export const leaveGroup = (groupId) => authFetch(`/groups/${groupId}/leave/`, { method: 'POST' });
