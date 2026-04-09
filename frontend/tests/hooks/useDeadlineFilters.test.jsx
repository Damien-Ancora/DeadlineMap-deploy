/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeadlineFilters } from '../../src/hooks/useDeadlineFilters';

describe('useDeadlineFilters', () => {
    const sample = [
        { id: 1, group: null, priority: 'high', status: 'pending', due_date: '2026-03-20', start_date: '2026-03-10' },
        { id: 2, group: 3, priority: 'low', status: 'completed', due_date: '2026-03-18', start_date: '2026-03-01' },
        { id: 3, group: null, priority: 'medium', status: 'in_progress', due_date: '2026-03-15', start_date: '2026-03-05' },
    ];

    it('filters personal deadlines and sorts by due date asc by default', () => {
        const { result } = renderHook(() => useDeadlineFilters('dueDate_asc'));

        act(() => result.current.setTypeFilter('personal'));

        const output = result.current.filterAndSort(sample);
        expect(output.map(d => d.id)).toEqual([3, 1]);
    });

    it('filters by priority and status and supports reset', () => {
        const { result } = renderHook(() => useDeadlineFilters('dueDate_desc'));

        act(() => {
            result.current.setPriorityFilter('low');
            result.current.setStatusFilter('completed');
        });

        let output = result.current.filterAndSort(sample);
        expect(output.map(d => d.id)).toEqual([2]);
        expect(result.current.hasActiveFilters).toBe(true);

        act(() => result.current.resetFilters());
        output = result.current.filterAndSort(sample);
        expect(output.length).toBe(3);
        expect(result.current.hasActiveFilters).toBe(false);
    });
});
