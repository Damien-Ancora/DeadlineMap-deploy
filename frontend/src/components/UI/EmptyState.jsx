import React from 'react';

const EmptyState = ({ icon = "bi-inbox", title, message, action }) => {
    return (
        <div className="text-center py-5 bg-light rounded bg-opacity-50">
            <div className="display-1 text-muted mb-3">
                {icon && <i className={`bi ${icon}`}></i>}
            </div>
            <h4 className="text-secondary fw-bold">{title}</h4>
            <p className="text-muted mb-4">{message}</p>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
