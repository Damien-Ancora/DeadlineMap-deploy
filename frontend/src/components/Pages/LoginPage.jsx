import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormCard, FormInput } from "../UI";
import AlertMessage from '../UI/AlertMessage';
import { useAuth } from '../../auth/AuthProvider';
import { login } from '../../api/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await login(email, password);
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
            title="Connexion"
            footerText="Pas encore de compte ?"
            footerLinkText="S'inscrire"
            footerLinkTo="/register"
        >
            <form onSubmit={handleSubmit}>
                <FormInput
                    id="email"
                    label="Adresse email"
                    type="email"
                    placeholder="exemple@student.ichec.be"
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
                    {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
            </form>
        </FormCard>
    );
};

export default LoginPage;
