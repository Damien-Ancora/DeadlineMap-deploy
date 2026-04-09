import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, PageHeader } from '../UI';
import { useGroups } from '../../hooks';
import { GroupCard } from '../Groups/GroupCard';
import EmptyState from '../UI/EmptyState';
import AlertMessage from '../UI/AlertMessage';

const GroupListPage = () => {
    const { groups, loading, error, fetchGroups, setError } = useGroups();

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <div className="container mt-4">
            <PageHeader
                title="Mes Groupes" icon="bi-people"
                actionButton={<Link to="/groups/new" className="btn btn-primary">+ Créer un groupe</Link>}
            />

            {error && (
                <AlertMessage
                    type="danger"
                    message={error}
                    onClose={() => setError(null)}
                    dismissible={false}
                />
            )}

            {groups.length === 0 ? (
                <EmptyState
                    icon="bi-people"
                    title="Vous n'êtes membre d'aucun groupe."
                    message="Rejoignez un groupe existant en demandant une invitation, ou créez-en un nouveau !"
                    action={
                        <Link to="/groups/new" className="btn btn-outline-primary mt-3">Créer mon premier groupe</Link>
                    }
                />
            ) : (
                <div className="row g-4">
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupListPage;
