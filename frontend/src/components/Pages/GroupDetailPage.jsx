import React, { useEffect, useState } from 'react';
import { LoadingSpinner, RoleBadge } from '../UI';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { addMember, removeMember, leaveGroup } from '../../api/groups';
import { DeadlineListItem } from '../Deadlines/DeadlineListItem';
import ConfirmModal from '../UI/ConfirmModal';
import EmptyState from '../UI/EmptyState';
import AlertMessage from '../UI/AlertMessage';
import { useAuth } from '../../auth/AuthProvider';
import { useGroup } from '../../hooks';

const GroupDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const { group, deadlines, loading, error, fetchGroupData, setGroup } = useGroup(id);

    // For adding new members
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // UI Alerts
    const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });

    // For confirmations
    const [modalConfig, setModalConfig] = useState({ show: false, actionData: null, type: '' });

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setAlertConfig({ show: false, message: '', type: 'success' });
        setIsAdding(true);
        try {
            await addMember(id, newMemberEmail);
            // Refresh group data
            await fetchGroupData();
            setNewMemberEmail('');
            setAlertConfig({ show: true, message: 'Membre ajouté avec succès !', type: 'success' });
        } catch (err) {
            setAlertConfig({ show: true, message: err.message || "Erreur lors de l'ajout.", type: 'danger' });
        } finally {
            setIsAdding(false);
        }
    };

    const requestRemoveMember = (userId) => {
        setModalConfig({ show: true, actionData: userId, type: 'removeMember' });
    };

    const confirmRemoveMember = async (userId) => {
        try {
            await removeMember(id, userId);
            setGroup(prev => ({
                ...prev,
                members: prev.members.filter(m => m.user.id !== userId)
            }));
            setAlertConfig({ show: true, message: 'Le membre a été retiré.', type: 'success' });
        } catch (err) {
            setAlertConfig({ show: true, message: err.message || "Impossible de retirer le membre.", type: 'danger' });
        }
    };

    const requestLeaveGroup = () => {
        setModalConfig({ show: true, actionData: null, type: 'leaveGroup' });
    };

    const confirmLeaveGroup = async () => {
        try {
            await leaveGroup(id);
            navigate('/groups');
        } catch (err) {
            setAlertConfig({ show: true, message: err.message || "Impossible de quitter le groupe.", type: 'danger' });
        }
    };

    const handleConfirm = () => {
        const { type, actionData } = modalConfig;
        if (type === 'removeMember') confirmRemoveMember(actionData);
        if (type === 'leaveGroup') confirmLeaveGroup();
        setModalConfig({ show: false, actionData: null, type: '' });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!group) return null;

    const currentMember = group.members?.find(m => m.user.id === currentUser?.id);
    const isCurrentUserAdmin = currentMember?.is_admin;

    return (
        <div className="container mt-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Link to="/groups" className="text-decoration-none">← Retour à la liste</Link>
                <button onClick={requestLeaveGroup} className="btn btn-outline-danger btn-sm">
                    {isCurrentUserAdmin ? 'Dissoudre le groupe' : 'Quitter le groupe'}
                </button>
            </div>

            {alertConfig.show && (
                <AlertMessage
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, show: false })}
                />
            )}

            <div className="row">
                {/* Column 1: Group Info & Deadlines */}
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="card-title fw-bold text-primary">{group.name}</h2>
                            <p className="text-muted small">Groupe ID: {group.id}</p>

                            <hr />

                            <h4 className="mt-4 mb-3">Deadlines du groupe</h4>
                            {deadlines.length === 0 ? (
                                <EmptyState
                                    icon="bi-calendar-event"
                                    title="Aucune deadline."
                                    message="Ce groupe n'a pas encore de deadlines assignées."
                                />
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {deadlines.map(deadline => (
                                        <DeadlineListItem key={deadline.id} deadline={deadline} hideBadge={true} />
                                    ))}
                                </ul>
                            )}

                            <div className="mt-3 text-end">
                                <Link to={`/deadlines/new?groupId=${id}`} className="btn btn-outline-primary btn-sm">
                                    + Ajouter une deadline
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Members Management */}
                <div className="col-lg-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Membres ({group.members ? group.members.length : 0})</h5>
                        </div>

                        <ul className="list-group list-group-flush">
                            {group.members && group.members.map(member => (
                                <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold d-block">
                                            {member.user.first_name || member.user.username} {member.user.last_name}
                                        </span>
                                        <small className="text-muted">{member.user.email}</small>
                                        <div className="mt-1">
                                            <RoleBadge isAdmin={member.is_admin} />
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    {isCurrentUserAdmin && member.user.id !== currentUser?.id && (
                                        <button
                                            className="btn btn-sm btn-outline-danger border-0"
                                            onClick={() => requestRemoveMember(member.user.id)}
                                            title="Retirer du groupe"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {isCurrentUserAdmin && (
                            <div className="card-footer bg-white">
                                <h6 className="mt-2">Inviter un membre</h6>
                                <form onSubmit={handleAddMember} className="d-flex gap-2">
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Email étudiant..."
                                        value={newMemberEmail}
                                        onChange={e => setNewMemberEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary btn-sm" disabled={isAdding}>
                                        {isAdding ? '...' : '+'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={modalConfig.show}
                title={modalConfig.type === 'leaveGroup' ? (isCurrentUserAdmin ? 'Dissoudre le groupe' : 'Quitter le groupe') : 'Retirer le membre'}
                message={
                    modalConfig.type === 'leaveGroup'
                        ? (isCurrentUserAdmin ? 'Êtes-vous sûr de vouloir dissoudre ce groupe ? Cette action est irréversible et supprimera le groupe pour tous les membres.' : 'Êtes-vous sûr de vouloir quitter ce groupe ? Vous ne verrez plus ses deadlines.')
                        : 'Êtes-vous sûr de vouloir retirer cet utilisateur du groupe ?'
                }
                confirmText={modalConfig.type === 'leaveGroup' ? (isCurrentUserAdmin ? 'Dissoudre' : 'Quitter') : 'Retirer'}
                confirmColor="danger"
                onConfirm={handleConfirm}
                onClose={() => setModalConfig({ show: false, actionData: null, type: '' })}
            />
        </div>
    );
};

export default GroupDetailPage;
