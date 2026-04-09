import React from 'react';
import { Link } from 'react-router-dom';
import { RoleBadge } from '../UI';

export const GroupListItem = ({ group }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <span className="me-2 fw-medium">{group.name}</span>
                <RoleBadge isAdmin={group.is_user_admin} className="ms-1 small" />
            </div>
            <div className="d-flex align-items-center gap-2">
                <span className="badge bg-secondary rounded-pill" title="Membres">
                    {group.members_count}
                </span>
                <Link to={`/groups/${group.id}`} className="btn btn-sm btn-light border text-dark ms-2">Voir</Link>
            </div>
        </li>
    );
};
