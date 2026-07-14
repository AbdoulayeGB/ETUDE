import React, { useState } from 'react';
import { Shield, Users, BookOpen, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ContentManager from './admin/ContentManager';
import UserManager from './admin/UserManager';
import StatsDashboard from './admin/StatsDashboard';
import ExercisesManager from './admin/ExercisesManager';
import AdminAuth from './admin/AdminAuth';

interface TabItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

const AdminPanel: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  const tabs: TabItem[] = [
    { id: 'stats', name: 'Statistiques', icon: BarChart3 },
    { id: 'content', name: 'Gestion des Matières', icon: BookOpen },
    { id: 'courses', name: 'Gestion des Cours', icon: FileText },
    { id: 'exercises', name: 'Gestion des Exercices', icon: CheckCircle },
    { id: 'users', name: 'Gestion des Utilisateurs', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsDashboard />;
      case 'content':
        return <ContentManager type="subjects" />;
      case 'courses':
        return <ContentManager type="courses" />;
      case 'exercises':
        return <ExercisesManager />;
      case 'users':
        return <UserManager />;
      default:
        return <ContentManager type="subjects" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès administrateur requis
          </h2>
          {user ? (
            <div className="text-red-600">
              Vous n'avez pas les droits d'administration nécessaires. Si vous pensez que c'est
              une erreur, veuillez contacter le support.
            </div>
          ) : (
            <AdminAuth />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Panel Admin</h1>
            </div>
          </div>

          <nav className="mt-6 flex lg:flex-col overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 lg:border-r-2 lg:border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-4 sm:p-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
