import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, PageHeader } from '../UI';
import { useDeadlines, useGroups, useDeadlineFilters } from '../../hooks';
import DeadlineFilterBar from '../Deadlines/DeadlineFilterBar';
import { DeadlineCard } from '../Deadlines/DeadlineCard';
import ConfirmModal from '../UI/ConfirmModal';
import EmptyState from '../UI/EmptyState';
import AlertMessage from '../UI/AlertMessage';
import DeadlineCalendarView from '../Deadlines/DeadlineCalendarView';
import DeadlineTypeToggle from '../Deadlines/DeadlineTypeToggle';
import DeadlineViewToggle from '../Deadlines/DeadlineViewToggle';

const DeadlineListPage = () => {
    const { deadlines, loading: deadlinesLoading, error, fetchDeadlines, removeDeadline } = useDeadlines();
    const { groups, fetchGroups, loading: groupsLoading } = useGroups();
    const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });
    const filters = useDeadlineFilters('dueDate_asc');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    const [modalConfig, setModalConfig] = useState({ show: false, itemId: null });

    useEffect(() => {
        fetchDeadlines();
        fetchGroups();
    }, [fetchDeadlines, fetchGroups]);

    const requestDelete = (id) => {
        setModalConfig({ show: true, itemId: id });
    };

    const confirmDelete = async () => {
        const { itemId } = modalConfig;
        if (!itemId) return;
        try {
            await removeDeadline(itemId);
            setAlertConfig({ show: true, message: 'Deadline supprimée avec succès.', type: 'success' });
        } catch {
            setAlertConfig({ show: true, message: "Erreur lors de la suppression.", type: 'danger' });
        }
    };

    const filteredDeadlines = filters.filterAndSort(deadlines);

    const getGroupName = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : null;
    };

    if (deadlinesLoading || groupsLoading) return <LoadingSpinner />;

    return (
        <div className="container mt-4">
            <PageHeader
                title="Toutes mes Deadlines" icon="bi-calendar-check"
                actionButton={<Link to="/deadlines/new" className="btn btn-primary">+ Nouvelle Deadline</Link>}
            />

            {/* Type Filter Buttons and View Mode aligned */}
            <div className="d-flex justify-content-between mb-3">
                <DeadlineTypeToggle typeFilter={filters.typeFilter} setTypeFilter={filters.setTypeFilter} />
                <DeadlineViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Advanced Filters strictly below the type buttons */}
            <DeadlineFilterBar {...filters} />

            {alertConfig.show && (
                <AlertMessage
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, show: false })}
                />
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {filteredDeadlines.length === 0 ? (
                <EmptyState
                    icon="bi-check2-circle"
                    title={filters.hasActiveFilters ? "Aucune deadline trouvée avec ces filtres." : "Aucune deadline trouvée."}
                    message={filters.hasActiveFilters ? "Essayez de modifier vos critères de recherche." : "Vous êtes à jour dans votre travail !"}
                    action={
                        <Link to="/deadlines/new" className="btn btn-outline-primary">
                            + Ajouter une deadline
                        </Link>
                    }
                />
            ) : viewMode === 'calendar' ? (
                <DeadlineCalendarView deadlines={filteredDeadlines} groups={groups} viewType="dayGridMonth" />
            ) : viewMode === 'timeline' ? (
                <DeadlineCalendarView deadlines={filteredDeadlines} groups={groups} viewType="resourceTimelineMonth" />
            ) : (
                <div className="row g-4">
                    {filteredDeadlines.map(deadline => (
                        <DeadlineCard
                            key={deadline.id}
                            deadline={deadline}
                            groupName={getGroupName(deadline.group)}
                            onDelete={requestDelete}
                        />
                    ))}
                </div>
            )}

            <ConfirmModal
                show={modalConfig.show}
                title="Supprimer la deadline"
                message="Êtes-vous sûr de vouloir supprimer cette deadline ? Cette action est irréversible."
                confirmText="Supprimer"
                confirmColor="danger"
                onConfirm={confirmDelete}
                onClose={() => setModalConfig({ show: false, itemId: null })}
            />
        </div>
    );
};

export default DeadlineListPage;
