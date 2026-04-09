import React from 'react';

const LoadingSpinner = ({ color = 'primary', message = 'Chargement...', center = true }) => {
    const spinner = (
        <div className={`spinner-border text-${color}`} role="status">
            <span className="visually-hidden">{message}</span>
        </div>
    );

    if (center) {
        return (
            <div className="text-center mt-5">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
