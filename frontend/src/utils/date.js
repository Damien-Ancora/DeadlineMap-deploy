// Format a date string to French locale
export const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return '';
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};
