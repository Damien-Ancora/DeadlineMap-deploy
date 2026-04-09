import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../UI/FormInput';
import { createGroup } from '../../api/groups';
import AlertMessage from '../UI/AlertMessage';

const GroupForm = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createGroup({ name });
            navigate('/groups'); // Redirect to list
        } catch (err) {
            console.error("Erreur création groupe:", err);
            setError(err.message || "Une erreur est survenue lors de la création du groupe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">Créer un nouveau groupe</h4>
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
                                <div className="mb-4">
                                    <FormInput
                                        id="groupName"
                                        name="groupName"
                                        label="Nom du groupe"
                                        type="text"
                                        placeholder="Ex: Projet Web Avancé"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <div className="form-text mt-n2 mb-3 px-2">Ce nom sera visible par tous les membres.</div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg"
                                        disabled={loading || !name.trim()}
                                    >
                                        {loading ? 'Création...' : 'Créer le groupe'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => navigate('/groups')}
                                    >
                                        Annuler
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

export default GroupForm;
