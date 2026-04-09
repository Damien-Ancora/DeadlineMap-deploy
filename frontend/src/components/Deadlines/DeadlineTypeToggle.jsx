import React from 'react';

const DeadlineTypeToggle = ({ typeFilter, setTypeFilter, size = 'md' }) => {
    const btnClass = size === 'sm' ? 'btn-group-sm' : '';

    return (
        <div className={`btn-group ${btnClass}`}>
            <button
                className={`btn ${typeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTypeFilter('all')}
            >
                Tout
            </button>
            <button
                className={`btn ${typeFilter === 'personal' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTypeFilter('personal')}
            >
                Personnel
            </button>
            <button
                className={`btn ${typeFilter === 'group' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTypeFilter('group')}
            >
                Groupes
            </button>
        </div>
    );
};

export default DeadlineTypeToggle;