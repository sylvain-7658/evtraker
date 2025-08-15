import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Shield, User as UserIcon, LogOut, Loader } from 'lucide-react';
import { db } from '../../firebase/config';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const adminEmail = 'sylvain7658@gmail.com';

  useEffect(() => {
    const usersCollectionRef = db.collection('users');
    const q = usersCollectionRef.where('isAdmin', '!=', true);
    
    const unsubscribe = q.onSnapshot((snapshot) => {
        const usersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];
        setUsers(usersList);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching users: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Shield className="text-red-500" size={24}/>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            Tableau de Bord Administrateur
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                            <UserIcon size={16} />
                            <span>{adminEmail}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 p-2 text-sm font-medium rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                            aria-label="Déconnexion"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Utilisateurs Enregistrés</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">ID Utilisateur (Firebase UID)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={2} className="text-center py-10 px-6">
                                            <Loader className="animate-spin inline-block text-blue-500" size={24} />
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300 font-mono">{user.id}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center py-10 px-6 text-slate-500 dark:text-slate-400">
                                            Aucun utilisateur n'est enregistré pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;