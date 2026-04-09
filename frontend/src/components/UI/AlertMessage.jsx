import React, { useEffect } from 'react';

const AlertMessage = ({ type = 'success', message, onClose, duration = 3000, dismissible = true }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!message) return null;

    return (
        <div className={`alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} fade show shadow-sm`} role="alert">
            {message}
            {dismissible && (
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            )}
        </div>
    );
};

export default AlertMessage;