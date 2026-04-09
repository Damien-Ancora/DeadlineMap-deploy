import React from 'react';

export const PriorityBadge = ({ priority }) => {
    switch (priority) {
        case 'high': return <span className="badge bg-danger">Haute</span>;
        case 'medium': return <span className="badge bg-warning text-dark">Moyenne</span>;
        default: return <span className="badge bg-success">Basse</span>;
    }
};

export const StatusBadge = ({ status }) => {
    switch (status) {
        case 'completed': return <span className="badge bg-success">Terminé</span>;
        case 'in_progress': return <span className="badge bg-primary">En cours</span>;
        case 'pending': return <span className="badge bg-secondary">En attente</span>;
        default: return <span className="badge bg-light text-dark">{status}</span>;
    }
};

export const RoleBadge = ({ isAdmin, className = '', customText, overrideAdminClass, overrideMemberClass }) => {
    const adminClass = overrideAdminClass || 'bg-warning text-dark';
    const memberClass = overrideMemberClass || 'bg-secondary';

    if (isAdmin) {
        return <span className={`badge ${adminClass} ${className}`}>{customText || "Admin"}</span>;
    }
    return <span className={`badge ${memberClass} ${className}`}>{customText || "Membre"}</span>;
};
