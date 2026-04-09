import { authFetch } from './client';

export const updateProfile = async (profileData) => {
    return await authFetch('/users/me/', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
    });
};

export const changePassword = async (passwordData) => {
    return await authFetch('/users/change_password/', {
        method: 'POST',
        body: JSON.stringify(passwordData),
    });
};