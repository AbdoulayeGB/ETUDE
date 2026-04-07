import React, { useState } from 'react';
import { Shield, Users, BookOpen, FileText } from 'lucide-react';
import ContentManagerMock from './admin/ContentManagerMock';
import ExercisesManagerMock from './admin/ExercisesManagerMock';

interface TabItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const AdminPanelMock: React.FC = () => {
  const [activeTab, setActiveTab] = useState('content');

  const tabs: TabItem[] = [
    { id: 'content', name: 'Gestion des Matières', icon: BookOpen },
    { id: 'courses', name: 'Gestion des Cours', icon: FileText },
    { id: 'exercises', name: 'Exercices / Quiz', icon: FileText },
    { id: 'users', name: 'Gestion des Utilisateurs', icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentManagerMock type="subjects" />;
      case 'courses':
        return <ContentManagerMock type="courses" />;
      case 'exercises':
        return <ExercisesManagerMock />;
      case 'users':
        return <UserManagerMock />;
      default:
        return <ContentManagerMock type="subjects" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Panel Admin</h1>
            </div>
          </div>
          
          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Composant mocké pour la gestion des utilisateurs
const UserManagerMock: React.FC = () => {
  const [users] = useState([
    {
      id: '1',
      email: 'abdoulaye@cdp.sn',
      full_name: 'Abdoulaye Admin',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      email: 'etudiant1@example.com',
      full_name: 'Étudiant Test',
      role: 'student',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      email: 'professeur@example.com',
      full_name: 'Professeur Test',
      role: 'teacher',
      created_at: new Date().toISOString()
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <div className="text-sm text-gray-500">
          Mode démo - Données simulées
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' :
                       user.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Modifier
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Mode Démo
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Vous êtes en mode démonstration. Les modifications ne sont pas sauvegardées.</p>
              <p>Pour utiliser les vraies fonctionnalités, configurez Supabase avec les scripts SQL fournis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelMock;
