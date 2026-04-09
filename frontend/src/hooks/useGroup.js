import { useState, useCallback } from 'react';
import { getGroup } from '../api/groups';
import { getDeadlines } from '../api/deadlines';

export const useGroup = (id) => {
    const [group, setGroup] = useState(null);
    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGroupData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const groupData = await getGroup(id);
            setGroup(groupData);

            const deadlinesData = await getDeadlines({ group: id });
            setDeadlines(deadlinesData);
            return { groupData, deadlinesData };
        } catch (err) {
            console.error("Erreur détails groupe:", err);
            setError("Impossible de charger le groupe.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [id]);

    return {
        group,
        deadlines,
        loading,
        error,
        fetchGroupData,
        setGroup,
        setError
    };
};
