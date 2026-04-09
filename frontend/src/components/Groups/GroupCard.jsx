import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoleBadge } from '../UI';
import { getGroup } from '../../api/groups';

export const GroupCard = ({ group }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const groupDetail = await getGroup(group.id);
                setMembers(groupDetail.members || []);
            } catch (err) {
                console.error("Erreur lors de la récupération des membres", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [group.id]);

    return (
        <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold mb-0">{group.name}</h5>
                        <RoleBadge isAdmin={group.is_user_admin} />
                    </div>
                    <p className="card-text text-muted small mb-2">
                        ID: {group.id}
                    </p>
                    <div className="card-text">
                        {loading ? (
                            <span className="text-muted small">Chargement des membres...</span>
                        ) : members.length > 0 ? (
                            members.map(m => (
                                <RoleBadge
                                    key={m.id}
                                    isAdmin={m.is_admin}
                                    className="border me-1 mb-1"
                                    customText={m.user.first_name || m.user.username}
                                    overrideAdminClass="bg-warning text-dark"
                                    overrideMemberClass="bg-light text-dark"
                                />
                            ))
                        ) : (
                            <span className="text-muted small">Aucun membre</span>
                        )}
                    </div>
                </div>
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center pb-3">
                    <Link to={`/groups/${group.id}`} className="btn btn-outline-primary btn-sm w-100">
                        Voir les détails
                    </Link>
                </div>
            </div>
        </div>
    );
};
