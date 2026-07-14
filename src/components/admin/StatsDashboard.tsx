import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Clock,
  Star,
  Loader2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalSubjects: number;
  recentUsers: number;
  popularSubjects: Array<{ name: string; count: number }>;
}

const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    recentUsers: 0,
    popularSubjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: recentUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('name, courses(count)')
        .order('name');

      const popularSubjects =
        subjectsData?.map((s: any) => ({
          name: s.name,
          count: s.courses?.[0]?.count || 0,
        })) || [];

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalSubjects: subjectsCount || 0,
        recentUsers: recentUsersCount || 0,
        popularSubjects: popularSubjects.slice(0, 5),
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tableau de bord - Statistiques</h2>

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
            <BarChart3 className="h-8 w-8 text-cyan-600" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        width: `${Math.min(100, (subject.count / Math.max(...stats.popularSubjects.map((s) => s.count), 1)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{subject.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
              <span className="text-lg font-bold text-green-600">
                {Math.floor(stats.totalUsers * 0.7)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Contenu disponible</p>
                  <p className="text-xs text-gray-500">Cours + Matières</p>
                </div>
              </div>
              <span className="text-lg font-bold text-cyan-600">
                {stats.totalCourses + stats.totalSubjects}
              </span>
            </div>
          </div>
        </div>
      </div>

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
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium">{stats.totalCourses} cours en ligne</span>
          </div>
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <Users className="h-6 w-6 text-cyan-600 mr-3" />
            <span className="font-medium">{stats.totalUsers} membres</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
