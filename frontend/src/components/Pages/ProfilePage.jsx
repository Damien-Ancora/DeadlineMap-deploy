import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { updateProfile, changePassword } from '../../api/users';
import { PageHeader } from '../UI';
import FormInput from '../UI/FormInput';
import AlertMessage from '../UI/AlertMessage';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();

    // Profile State
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
    });
    const [profileAlert, setProfileAlert] = useState(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [passwordAlert, setPasswordAlert] = useState(null);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileAlert(null);
        setIsSavingProfile(true);

        try {
            const updatedUser = await updateProfile(profileData);
            updateUser(updatedUser); // Force update context
            setProfileAlert({ type: 'success', message: 'Profil mis à jour avec succès.' });
        } catch (err) {
            setProfileAlert({ type: 'danger', message: err.message || "Erreur lors de la mise à jour." });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordAlert(null);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordAlert({ type: 'danger', message: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }

        setIsSavingPassword(true);
        try {
            await changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setPasswordAlert({ type: 'success', message: 'Mot de passe modifié avec succès.' });
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            setPasswordAlert({ type: 'danger', message: err.message || "Erreur lors du changement de mot de passe." });
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="container mt-4">
            <PageHeader title="Mon Profil" icon="bi-person-circle" />

            <div className="row">
                {/* Informations Personnelles */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Informations Personnelles</h5>
                        </div>
                        <div className="card-body">
                            {profileAlert && (
                                <AlertMessage
                                    type={profileAlert.type}
                                    message={profileAlert.message}
                                    onClose={() => setProfileAlert(null)}
                                />
                            )}
                            <form onSubmit={handleProfileSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            id="first_name"
                                            name="first_name"
                                            label="Prénom"
                                            value={profileData.first_name}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <FormInput
                                            id="last_name"
                                            name="last_name"
                                            label="Nom"
                                            value={profileData.last_name}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <FormInput
                                    type="email"
                                    id="email"
                                    name="email"
                                    label="Adresse E-mail"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    required
                                />
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={isSavingProfile}>
                                        {isSavingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Mot de passe */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Sécurité</h5>
                        </div>
                        <div className="card-body">
                            {passwordAlert && (
                                <AlertMessage
                                    type={passwordAlert.type}
                                    message={passwordAlert.message}
                                    onClose={() => setPasswordAlert(null)}
                                />
                            )}
                            <form onSubmit={handlePasswordSubmit}>
                                <FormInput
                                    type="password"
                                    id="old_password"
                                    name="old_password"
                                    label="Mot de passe actuel"
                                    value={passwordData.old_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <FormInput
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                    label="Nouveau mot de passe"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="8"
                                />
                                <FormInput
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    label="Confirmer le nouveau mot de passe"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength="8"
                                />
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-outline-primary" disabled={isSavingPassword}>
                                        {isSavingPassword ? 'Enregistrement...' : 'Modifier le mot de passe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bannière de support */}
            <div className="alert alert-secondary d-flex align-items-center mb-5" role="alert">
                <i className="bi bi-info-circle-fill fs-4 me-3 text-primary"></i>
                <div>
                    <strong>Vous rencontrez un problème ?</strong>
                    <p className="mb-0 small">
                        Si un problème persiste sur la plateforme, n'hésitez pas à contacter un administrateur :{' '}
                        <a href="mailto:admin@ichec.be" className="alert-link text-black">admin@ichec.be</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;