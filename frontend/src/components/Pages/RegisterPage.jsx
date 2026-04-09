import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormCard, FormInput } from "../UI";
import AlertMessage from '../UI/AlertMessage';
import { useAuth } from '../../auth/AuthProvider';
import { register } from '../../api/auth';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(firstName)) {
            setError("Le prénom ne peut contenir que des lettres, des accents, des apostrophes ou des tirets.");
            return;
        }

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(lastName)) {
            setError("Le nom ne peut contenir que des lettres, des accents, des apostrophes ou des tirets.");
            return;
        }

        if (!/^[a-zA-Z0-9@.-]+$/.test(email)) {
            setError("L'email contient des caractères non autorisés.");
            return;
        }

        if (!email.endsWith('@student.ichec.be')) {
            setError("L'adresse email doit se terminer par @student.ichec.be");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await register({
                username: email, // use email as username
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });
            auth.login({ token: data.token, refresh: data.refresh, user: data.user });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormCard
            title="Inscription"
            footerText="Déjà un compte ?"
            footerLinkText="Se connecter"
            footerLinkTo="/login"
        >
            <form onSubmit={handleSubmit}>
                <FormInput
                    id="firstName"
                    label="Prénom"
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <FormInput
                    id="lastName"
                    label="Nom"
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
                <FormInput
                    id="email"
                    label="Adresse email"
                    type="email"
                    placeholder="exemple@student.ichec.be"
                    pattern="^[a-zA-Z0-9._%+-]+@student\.ichec\.be$"
                    title="L'email doit se terminer par @student.ichec.be"
                    required={true}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <FormInput
                    id="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <FormInput
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <div className="mb-3">
                    {error && (
                        <AlertMessage
                            type="danger"
                            message={error}
                            onClose={() => setError(null)}
                            dismissible={false}
                        />
                    )}
                </div>
                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
            </form>
        </FormCard>
    );
};

export default RegisterPage;
