

import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ChargeJournal from './components/ChargeJournal';
import Settings from './components/Settings';
import Stats from './components/Stats';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import Dashboard from './components/Dashboard'; // Import du nouveau composant
import { User } from './types';
import { LogOut, User as UserIcon, BarChart2, BookOpen, Settings as SettingsIcon, Loader, BatteryCharging, FileDown, LogIn, LayoutDashboard } from 'lucide-react';

// ==================================================================
// HomePage Component
// ==================================================================
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);

const HomePage: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen">
            <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Suivi Conso EV
                    </h1>
                    <button
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-300"
                    >
                        <LogIn size={18} />
                        Connexion / Inscription
                    </button>
                </nav>
            </header>

            <main>
                <section className="container mx-auto px-6 py-20 md:py-32 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                        Maîtrisez les coûts de votre véhicule électrique.
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
                        Suivez précisément chaque recharge, analysez votre consommation et optimisez vos dépenses énergétiques. Simple, efficace et gratuit.
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 ease-in-out"
                    >
                        Commencer maintenant
                    </button>
                </section>

                <section id="features" className="bg-slate-100 dark:bg-slate-900/50 py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Fonctionnalités Clés</h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Tout ce dont vous avez besoin pour une gestion parfaite.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BatteryCharging className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                                title="Journal de Recharge"
                                description="Enregistrez chaque session de recharge avec des détails précis : date, kilométrage, % de batterie, et tarif appliqué."
                            />
                            <FeatureCard
                                icon={<BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                                title="Statistiques Détaillées"
                                description="Visualisez des graphiques clairs sur vos coûts, votre consommation d'énergie et vos habitudes de recharge par semaine, mois ou année."
                            />
                            <FeatureCard
                                icon={<FileDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                                title="Export & Import"
                                description="Exportez vos données au format CSV ou PDF pour vos archives, et importez facilement votre historique existant."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-slate-800 py-6">
                <div className="container mx-auto px-6 text-center text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Suivi Conso EV. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};


export type View = 'dashboard' | 'journal' | 'stats' | 'settings';

const NavItem = ({ label, icon: Icon, isActive, onClick }: { label: string; icon: React.ElementType, isActive: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

const AppContent: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const { currentUser, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
            <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10 no-print">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            Suivi Conso EV
                        </h1>
                        <div className="hidden sm:flex items-center space-x-2">
                            <NavItem label="Tableau de bord" icon={LayoutDashboard} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                            <NavItem label="Journal" icon={BookOpen} isActive={activeView === 'journal'} onClick={() => setActiveView('journal')} />
                            <NavItem label="Statistiques" icon={BarChart2} isActive={activeView === 'stats'} onClick={() => setActiveView('stats')} />
                            <NavItem label="Paramètres" icon={SettingsIcon} isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <UserIcon size={16} />
                                <span className="hidden sm:inline">{currentUser?.email}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 p-2 text-sm font-medium rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                                aria-label="Déconnexion"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                     <div className="sm:hidden mt-4 flex justify-around items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                        <NavItem label="Tableau de bord" icon={LayoutDashboard} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                        <NavItem label="Journal" icon={BookOpen} isActive={activeView === 'journal'} onClick={() => setActiveView('journal')} />
                        <NavItem label="Statistiques" icon={BarChart2} isActive={activeView === 'stats'} onClick={() => setActiveView('stats')} />
                        <NavItem label="Paramètres" icon={SettingsIcon} isActive={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                    </div>
                </nav>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {activeView === 'dashboard' && <Dashboard setActiveView={setActiveView} />}
                {activeView === 'journal' && <ChargeJournal />}
                {activeView === 'stats' && <Stats />}
                {activeView === 'settings' && <Settings />}
            </main>
        </div>
    );
};


const AppWrapper: React.FC = () => {
    const { currentUser, loading, logout } = useAuth();
    const [unauthenticatedView, setUnauthenticatedView] = useState<'landing' | 'login'>('landing');

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('Service Worker registered: ', registration);
                }).catch(registrationError => {
                    console.log('Service Worker registration failed: ', registrationError);
                });
            });
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!currentUser) {
        if (unauthenticatedView === 'landing') {
            return <HomePage onLoginClick={() => setUnauthenticatedView('login')} />;
        }
        return <Login onBackToHome={() => setUnauthenticatedView('landing')} />;
    }

    // Admin-specific views
    if (currentUser.isAdmin) {
        return <AdminDashboard onLogout={logout} />;
    }

    // Regular user view
    return (
        <AppProvider userId={currentUser.id}>
            <AppContent />
        </AppProvider>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppWrapper />
        </AuthProvider>
    );
};

export default App;