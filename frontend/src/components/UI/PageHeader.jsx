import React from 'react';

const PageHeader = ({ title, icon, actionButton, children }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">
                {icon && <i className={`bi ${icon} me-3 text-primary`}></i>}
                {title}
            </h1>
            {(actionButton || children) && (
                <div>
                    {actionButton}
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
