import React from 'react';

const DeadlineViewToggle = ({ viewMode, setViewMode, size = 'md', showText = true }) => {
    const btnClass = size === 'sm' ? 'btn-group-sm' : '';

    return (
        <div className={`btn-group ${btnClass}`}>
            <button
                className={`btn ${viewMode === 'list' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
                title="Vue Liste"
            >
                <i className="bi bi-list-ul"></i>{showText ? " Liste" : ""}
            </button>
            <button
                className={`btn ${viewMode === 'calendar' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('calendar')}
                title="Vue Calendrier"
            >
                <i className="bi bi-calendar3"></i>{showText ? " Calendrier" : ""}
            </button>
            <button
                className={`btn ${viewMode === 'timeline' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('timeline')}
                title="Vue Timeline"
            >
                <i className="bi bi-distribute-horizontal"></i>{showText ? " Timeline" : ""}
            </button>
        </div>
    );
};

export default DeadlineViewToggle;