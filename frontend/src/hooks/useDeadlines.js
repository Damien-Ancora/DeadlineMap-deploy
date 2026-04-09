import { useState, useCallback } from 'react';
import { getDeadlines, deleteDeadline } from '../api/deadlines';

export const useDeadlines = () => {
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDeadlines = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDeadlines(filters);
            const sortedData = data.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
            setDeadlines(sortedData);
            return sortedData;
        } catch (err) {
            console.error("Erreur chargement deadlines:", err);
            setError("Impossible de charger les deadlines.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // simplified deps

    const removeDeadline = useCallback(async (id) => {
        try {
            await deleteDeadline(id);
            setDeadlines(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error("Erreur suppression deadline:", err);
            throw err;
        }
    }, []);

    return {
        deadlines,
        loading,
        error,
        fetchDeadlines,
        removeDeadline,
        setDeadlines,
        setError
    };
};
