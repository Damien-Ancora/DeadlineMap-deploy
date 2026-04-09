import React from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../UI/Badges';
import { formatDate } from '../../utils/date';

export const DeadlineCard = ({ deadline, groupName, onDelete }) => {
    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
                <div className={`card-body border-start border-4 ${deadline.priority === 'high' ? 'border-danger' : deadline.priority === 'medium' ? 'border-warning' : 'border-success'}`}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold">
                            <Link to={`/deadlines/${deadline.id}`} className="text-decoration-none text-dark hover-link">
                                {deadline.name}
                            </Link>
                        </h5>
                        {deadline.group ? (
                            <span className="badge bg-info text-dark" title="Date de groupe">{groupName || 'Groupe'}</span>
                        ) : (
                            <span className="badge bg-light text-dark border" title="Date personnelle">Personnel</span>
                        )}
                    </div>

                    <p className="card-text text-muted mb-3">
                        <i className="bi bi-calendar me-1"></i> {formatDate(deadline.due_date)}
                    </p>

                    <div className="d-flex gap-2 mb-3">
                        <StatusBadge status={deadline.status} />
                        <PriorityBadge priority={deadline.priority} />
                    </div>

                    {deadline.description && (
                        <p className="card-text text-muted small text-truncate">
                            {deadline.description}
                        </p>
                    )}
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                    <Link to={`/deadlines/${deadline.id}`} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil me-1"></i> Modifier
                    </Link>
                    <button onClick={() => onDelete(deadline.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash me-1"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};
