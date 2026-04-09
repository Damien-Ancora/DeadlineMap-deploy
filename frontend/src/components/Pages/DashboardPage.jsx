import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, PageHeader } from '../UI';
import { useAuth } from '../../auth/AuthProvider';
import { useDeadlines, useGroups, useDeadlineFilters } from '../../hooks';
import DeadlineFilterBar from '../Deadlines/DeadlineFilterBar';
import { DeadlineListItem } from '../Deadlines/DeadlineListItem';
import { GroupListItem } from '../Groups/GroupListItem';
import DeadlineCalendarView from '../Deadlines/DeadlineCalendarView';
import AlertMessage from '../UI/AlertMessage';
import DeadlineTypeToggle from '../Deadlines/DeadlineTypeToggle';
import DeadlineViewToggle from '../Deadlines/DeadlineViewToggle';

const DashboardPage = () => {
    const { user } = useAuth();
    const { deadlines, fetchDeadlines } = useDeadlines();
    const { groups, fetchGroups } = useGroups();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    const filters = useDeadlineFilters('dueDate_asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchDeadlines(),
                    fetchGroups()
                ]);
            } catch (err) {
                console.error("Erreur chargement dashboard:", err);
                setError("Impossible de charger les données. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchDeadlines, fetchGroups]);

    // Helper to get group name from ID
    const getGroupName = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : null;
    };

    // Filter logic leveraging the hook
    const filteredDeadlines = filters.filterAndSort(deadlines);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="container mt-5">
                <AlertMessage
                    type="danger"
                    message={error}
                    dismissible={false}
                />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <PageHeader
                title={`Bonjour, ${user ? (user.first_name || user.username) : 'étudiant'} !`}
                actionButton={<Link to="/deadlines/new" className="btn btn-primary">+ Nouvelle Deadline</Link>}
            />

            <div className="row">
                {/* Section Deadlines */}
                <div className="col-md-8 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-calendar-event me-2"></i> Vos 5 prochaines deadlines</h5>
                            <div className="d-flex gap-2">
                                <DeadlineTypeToggle typeFilter={filters.typeFilter} setTypeFilter={filters.setTypeFilter} size="sm" />
                                <DeadlineViewToggle viewMode={viewMode} setViewMode={setViewMode} size="sm" showText={false} />
                            </div>
                        </div>

                        <DeadlineFilterBar
                            {...filters}
                            showSort={false}
                            className="m-0 border-top-0 border-start-0 border-end-0 rounded-0"
                        />

                        {viewMode === 'calendar' ? (
                            <div className="p-3">
                                <DeadlineCalendarView deadlines={filteredDeadlines} groups={groups} viewType="dayGridMonth" />
                            </div>
                        ) : viewMode === 'timeline' ? (
                            <div className="p-3">
                                <DeadlineCalendarView deadlines={filteredDeadlines} groups={groups} viewType="resourceTimelineMonth" />
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {filteredDeadlines.length > 0 ? (
                                    filteredDeadlines
                                        .slice(0, 5)
                                        .map(deadline => (
                                            <DeadlineListItem
                                                key={deadline.id}
                                                deadline={deadline}
                                                groupName={getGroupName(deadline.group)}
                                            />
                                        ))
                                ) : (
                                    <li className="list-group-item text-center text-muted py-4">
                                        {filters.hasActiveFilters
                                            ? "Aucun résultat pour ces filtres."
                                            : <>Aucune deadline à venir. Profitez-en ! <i className="bi bi-emoji-smile"></i></>}
                                    </li>
                                )}
                            </ul>
                        )}
                        <div className="card-footer bg-white text-center">
                            <Link to="/deadlines" className="text-decoration-none small">Voir toutes les deadlines</Link>
                        </div>
                    </div>
                </div>

                {/* Section Groupes */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><i className="bi bi-people me-2"></i> Mes Groupes</h5>
                            <Link to="/groups/new" className="btn btn-sm btn-outline-primary">+</Link>
                        </div>
                        <ul className="list-group list-group-flush">
                            {groups.length > 0 ? (
                                groups.map(group => (
                                    <GroupListItem key={group.id} group={group} />
                                ))
                            ) : (
                                <li className="list-group-item text-center text-muted py-4">
                                    Vous n'êtes membre d'aucun groupe.
                                </li>
                            )}
                        </ul>
                        <div className="card-footer bg-white text-center">
                            <Link to="/groups" className="text-decoration-none small">Gérer mes groupes</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
