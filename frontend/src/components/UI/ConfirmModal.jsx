import React from 'react';

const ConfirmModal = ({
    show,
    title = "Confirmation",
    message = "Êtes-vous sûr ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    confirmColor = "danger",
    onConfirm,
    onClose
}) => {
    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                onClick={onClose}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                    onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>{cancelText}</button>
                            <button type="button" className={`btn btn-${confirmColor}`} onClick={() => {
                                onConfirm();
                                onClose();
                            }}>{confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;