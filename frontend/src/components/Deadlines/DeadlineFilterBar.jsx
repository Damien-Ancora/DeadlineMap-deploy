import React from 'react';

const DeadlineFilterBar = ({
    priorityFilter, setPriorityFilter,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
    resetFilters,
    hasActiveFilters,
    showSort = true,
    className = "mb-4"
}) => {
    return (
        <div className={`d-flex flex-wrap gap-3 align-items-center justify-content-between bg-light p-2 rounded border ${className}`}>
            <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="fw-bold text-muted small text-uppercase ms-2">
                    <i className="bi bi-funnel me-1"></i> Filtres
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <select
                        className="form-select form-select-sm w-auto"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="all">Toutes priorités</option>
                        <option value="high">Haute</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Basse</option>
                    </select>

                    <select
                        className="form-select form-select-sm w-auto"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tous statuts</option>
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                    </select>

                    {showSort && (
                        <select
                            className="form-select form-select-sm w-auto fw-bold"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="dueDate_asc">Échéance : Proche → Loin</option>
                            <option value="dueDate_desc">Échéance : Loin → Proche</option>
                            <option value="startDate_asc">Début : Proche → Loin</option>
                            <option value="startDate_desc">Début : Loin → Proche</option>
                        </select>
                    )}
                </div>
            </div>

            {hasActiveFilters && (
                <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={resetFilters}
                    title="Réinitialiser les filtres"
                >
                    <i className="bi bi-x-circle me-1"></i> Réinitialiser
                </button>
            )}
        </div>
    );
};

export default DeadlineFilterBar;