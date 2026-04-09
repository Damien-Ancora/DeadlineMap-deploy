import { useState, useCallback } from 'react';
import { getGroups } from '../api/groups';

export const useGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getGroups();
            setGroups(data);
            return data;
        } catch (err) {
            console.error("Erreur chargement groupes:", err);
            setError("Impossible de charger la liste des groupes.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        groups,
        loading,
        error,
        fetchGroups,
        setGroups,
        setError
    };
};
