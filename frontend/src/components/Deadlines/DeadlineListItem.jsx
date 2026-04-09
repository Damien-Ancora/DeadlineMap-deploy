import React from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../UI/Badges';
import { formatDate } from '../../utils/date';

export const DeadlineListItem = ({ deadline, groupName, hideBadge = false }) => {
    // Determine the group name to display
    // It can come from the prop `groupName` OR from `deadline.group.name` if deadline.group is populated
    const displayGroupName = groupName || (deadline.group && typeof deadline.group === 'object' ? deadline.group.name : null);

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h6 className="mb-1">
                    <Link to={`/deadlines/${deadline.id}`} className="text-decoration-none text-dark fw-bold">
                        {deadline.name}
                    </Link>
                </h6>
                <small className="text-muted">
                    {formatDate(deadline.due_date)}
                    {!hideBadge && (
                        displayGroupName ? (
                            <span className="ms-2 badge bg-info text-dark">
                                Groupe: {displayGroupName}
                            </span>
                        ) : deadline.group ? (
                            <span className="ms-2 badge bg-info text-dark">
                                Groupe
                            </span>
                        ) : (
                            <span className="ms-2 badge bg-light text-dark border">
                                Personnel
                            </span>
                        )
                    )}
                </small>
            </div>
            <div className="d-flex gap-1">
                <StatusBadge status={deadline.status} />
                <PriorityBadge priority={deadline.priority} />
            </div>
        </li>
    );
};
