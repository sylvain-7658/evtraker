import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, LogIn, UserPlus, HelpCircle, ArrowLeft } from 'lucide-react';

// Vue pour le mot de passe oublié
const ForgotPasswordView: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => (
    <div className="space-y-6 text-center">
        <div className="flex justify-center">
             <HelpCircle className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Mot de passe oublié ?</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
            Pour des raisons de sécurité, la réinitialisation automatique n'est pas disponible. 
            Veuillez contacter l'administrateur de l'application à l'adresse suivante pour obtenir de l'aide :
        </p>
        <p className="font-semibold text-blue-600 dark:text-blue-400">
            sylvain7658@gmail.com
        </p>
        <button
            onClick={onBackToLogin}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <ArrowLeft size={16} />
            Retour à la connexion
        </button>
    </div>
);

// Formulaire d'authentification
const AuthForm: React.FC<{
    isLoginView: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword?: string;
    setConfirmPassword?: (value: string) => void;
    error: string | null;
    isLoading: boolean;
    onForgotPassword: () => void;
    onSwitchView: () => void;
    onAdminLogin: () => void;
}> = ({
    isLoginView,
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    onForgotPassword,
    onSwitchView,
    onAdminLogin,
}) => (
    <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
                <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mot de passe
                </label>
                 {isLoginView && (
                    <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Mot de passe oublié ?
                    </button>
                 )}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLoginView ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {!isLoginView && setConfirmPassword && (
            <div>
               <label htmlFor="confirm-password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmez le mot de passe
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  {isLoginView ? <><LogIn size={16}/> Se connecter</> : <><UserPlus size={16}/> S'inscrire</>}
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchView}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isLoginView ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
          <button
            onClick={onAdminLogin}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Connexion administrateur
          </button>
        </div>
    </>
);

// Composant principal qui gère l'état et la logique
const Login: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleAdminLoginClick = useCallback(() => {
    setEmail('sylvain7658@gmail.com');
    setPassword('Qdeh3jof7658');
    setIsLoginView(true);
    setShowForgotPassword(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        if (isLoginView) {
            await login(email, password);
        } else {
            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas.');
            }
            if (password.length < 6) {
                throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
            }
            await register(email, password);
        }
    } catch (err: any) {
        setError(err.message || 'Une erreur est survenue.');
    } finally {
        setIsLoading(false);
    }
  }, [isLoginView, email, password, confirmPassword, login, register]);

  const handleSwitchView = useCallback(() => {
    setIsLoginView(prev => !prev);
    setError(null);
    setConfirmPassword('');
  }, []);
  
  const handleShowForgotPassword = useCallback(() => {
    setShowForgotPassword(true);
  }, []);
  
  const handleBackToLogin = useCallback(() => {
    setShowForgotPassword(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                EV Tracker
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
                { showForgotPassword ? 'Récupération de mot de passe' : (isLoginView ? 'Connectez-vous à votre compte' : 'Créez un nouveau compte') }
            </p>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-8">
          {showForgotPassword ? (
            <ForgotPasswordView onBackToLogin={handleBackToLogin} />
          ) : (
            <AuthForm
                isLoginView={isLoginView}
                handleSubmit={handleSubmit}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                error={error}
                isLoading={isLoading}
                onForgotPassword={handleShowForgotPassword}
                onSwitchView={handleSwitchView}
                onAdminLogin={handleAdminLoginClick}
            />
          )}
        </div>
        {onBackToHome && (
            <div className="mt-8 text-center">
                <button
                    onClick={onBackToHome}
                    className="flex items-center gap-2 mx-auto text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Retour à l'accueil
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;