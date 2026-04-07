import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, TrendingUp, Eye, Clock, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalSubjects: number;
  activeUsers: number;
  recentUsers: number;
  popularSubjects: Array<{ name: string; count: number }>;
  userGrowth: Array<{ date: string; count: number }>;
}

const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    activeUsers: 0,
    recentUsers: 0,
    popularSubjects: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Compter les utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Compter les cours
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Compter les matières
      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      // Utilisateurs récents (derniers 7 jours)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: recentUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Matières populaires (avec nombre de cours)
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select(`
          name,
          courses(count)
        `)
        .order('name');

      const popularSubjects = subjectsData?.map(subject => ({
        name: subject.name,
        count: subject.courses?.[0]?.count || 0
      })) || [];

      // Croissance des utilisateurs (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: userGrowthData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at');

      // Grouper par jour
      const growthMap = new Map<string, number>();
      userGrowthData?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        growthMap.set(date, (growthMap.get(date) || 0) + 1);
      });

      const userGrowth = Array.from(growthMap.entries()).map(([date, count]) => ({
        date,
        count
      }));

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalSubjects: subjectsCount || 0,
        activeUsers: Math.floor((usersCount || 0) * 0.7), // Estimation
        recentUsers: recentUsersCount || 0,
        popularSubjects: popularSubjects.slice(0, 5),
        userGrowth
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tableau de bord - Statistiques</h2>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cours disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Matières</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouveaux (7j)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matières populaires */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Matières populaires
          </h3>
          <div className="space-y-3">
            {stats.popularSubjects.map((subject, index) => (
              <div key={subject.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600 mr-3">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (subject.count / Math.max(...stats.popularSubjects.map(s => s.count), 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{subject.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-500" />
            Activité récente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Nouveaux utilisateurs</p>
                  <p className="text-xs text-gray-500">Cette semaine</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">{stats.recentUsers}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Utilisateurs actifs</p>
                  <p className="text-xs text-gray-500">Estimation</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">{stats.activeUsers}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contenu disponible</p>
                  <p className="text-xs text-gray-500">Cours + Matières</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {stats.totalCourses + stats.totalSubjects}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={fetchStats}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium">Actualiser les stats</span>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
            <BookOpen className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium">Ajouter du contenu</span>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
            <Users className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium">Gérer les utilisateurs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
