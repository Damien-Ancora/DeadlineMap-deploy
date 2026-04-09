import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getDeadline, createDeadline, updateDeadline } from '../../api/deadlines';
import { getGroups } from '../../api/groups';
import { useAuth } from '../../auth/AuthProvider';
import AlertMessage from '../UI/AlertMessage';
import FormInput from '../UI/FormInput';
import { LoadingSpinner } from '../UI';

const DeadlineForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        start_date: new Date().toISOString().split('T')[0],
        due_date: '',
        group: searchParams.get('groupId') || '' // Pre-fill from URL param if available
    });

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch groups for the dropdown
                const groupsData = await getGroups();
                setGroups(groupsData);

                if (isEditMode) {
                    const deadlineData = await getDeadline(id);
                    // Format dates for input type="date"
                    const formattedData = {
                        ...deadlineData,
                        group: deadlineData.group ? String(deadlineData.group) : '', // Select expects string values
                        start_date: deadlineData.start_date || '', // date string mostly fine
                        due_date: deadlineData.due_date || ''
                    };
                    setFormData(formattedData);
                }
            } catch (err) {
                console.error("Error fetching deadline data:", err);
                setError("Impossible de charger les données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (formData.start_date && formData.due_date && formData.start_date > formData.due_date) {
            setError("La date d'échéance doit être postérieure ou égale à la date de début.");
            setIsSubmitting(false);
            return;
        }

        // Clean up data before sending
        const payload = { ...formData };

        // Ownership mapping based on selected group:
        // - Personal: user=<current_user_id>, group=null
        // - Group: user=null, group=<group_id>
        payload.group = payload.group ? Number(payload.group) : null;
        payload.user = payload.group ? null : user?.id ?? null;
        payload.is_personal = payload.group === null;

        try {
            if (isEditMode) {
                await updateDeadline(id, payload);
            } else {
                await createDeadline(payload);
            }
            navigate('/deadlines');
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm mx-auto">
                        <div className="card-header bg-primary text-white">
                            <h2 className="h4 mb-0">{isEditMode ? 'Modifier la Deadline' : 'Nouvelle Deadline'}</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <AlertMessage
                                    type="danger"
                                    message={error}
                                    onClose={() => setError(null)}
                                />
                            )}

                            <form onSubmit={handleSubmit}>
                                <FormInput
                                    id="name"
                                    name="name"
                                    label="Titre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                                <FormInput
                                    type="textarea"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <FormInput
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            label="Date de début"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <FormInput
                                            type="date"
                                            id="due_date"
                                            name="due_date"
                                            label="Date d'échéance"
                                            value={formData.due_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <FormInput
                                            id="priority"
                                            name="priority"
                                            label="Priorité"
                                            type="select"
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >
                                            <option value="low">Basse</option>
                                            <option value="medium">Moyenne</option>
                                            <option value="high">Haute</option>
                                        </FormInput>
                                    </div>

                                    <div className="col-md-4">
                                        <FormInput
                                            id="status"
                                            name="status"
                                            label="Statut"
                                            type="select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="in_progress">En cours</option>
                                            <option value="completed">Terminé</option>
                                        </FormInput>
                                    </div>

                                    <div className="col-md-4">
                                        <FormInput
                                            id="group"
                                            name="group"
                                            label="Groupe (Optionnel)"
                                            type="select"
                                            value={formData.group}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Personnel --</option>
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </FormInput>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Chargement...' : (isEditMode ? 'Enregistrer les modifications' : 'Créer la deadline')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlineForm;
