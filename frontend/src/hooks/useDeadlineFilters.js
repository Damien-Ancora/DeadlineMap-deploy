import { useState } from 'react';

export const useDeadlineFilters = (initialSort = 'dueDate_asc') => {
    const [typeFilter, setTypeFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState(initialSort);

    const filterAndSort = (deadlines) => {
        if (!deadlines || !Array.isArray(deadlines)) return [];

        // 1. Filtrage
        let result = deadlines.filter(d => {
            if (typeFilter === 'personal' && d.group) return false;
            if (typeFilter === 'group' && !d.group) return false;
            if (priorityFilter !== 'all' && d.priority !== priorityFilter) return false;
            if (statusFilter !== 'all' && d.status !== statusFilter) return false;
            return true;
        });

        // 2. Tri
        result = result.sort((a, b) => {
            const dateA = new Date(a.due_date || 0);
            const dateB = new Date(b.due_date || 0);

            // Pour la date de début, on utilise la due_date si start_date est vide pour avoir une valeur de comparaison pertinente
            const startA = new Date(a.start_date || a.due_date || 0);
            const startB = new Date(b.start_date || b.due_date || 0);

            if (sortBy === 'dueDate_asc') return dateA - dateB;
            if (sortBy === 'dueDate_desc') return dateB - dateA;
            if (sortBy === 'startDate_asc') return startA - startB;
            if (sortBy === 'startDate_desc') return startB - startA;

            return 0;
        });

        return result;
    };

    const resetFilters = () => {
        setTypeFilter('all');
        setPriorityFilter('all');
        setStatusFilter('all');
        setSortBy(initialSort);
    };

    const hasActiveFilters = typeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all';

    return {
        typeFilter, setTypeFilter,
        priorityFilter, setPriorityFilter,
        statusFilter, setStatusFilter,
        sortBy, setSortBy,
        filterAndSort,
        resetFilters,
        hasActiveFilters
    };
};