import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Course, UserProgress as UserProgressType } from '../lib/supabase';
import { CheckCircle, Star } from 'lucide-react';

interface UserProgressProps {
  courses: Course[];
  subjectId?: string;
}

const UserProgress: React.FC<UserProgressProps> = ({ courses }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgressType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && courses.length > 0) {
      fetchProgress();
    } else if (!user) {
      setProgress([]);
      setLoading(false);
    }
  }, [user, courses]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const courseIds = courses.map(course => course.id);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          course:courses(
            title,
            level
          )
        `)
        .eq('user_id', user.id)
        .in('course_id', courseIds);

      if (error) {
        console.error('Erreur lors de la récupération du progrès:', error);
        return;
      }

      setProgress(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId: string, completed: boolean, score: number = 0) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completed,
          score,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Erreur lors de la mise à jour du progrès:', error);
        alert('Erreur lors de la mise à jour du progrès. Veuillez réessayer.');
        return;
      }

      // Rafraîchir les données
      await fetchProgress();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressForCourse = (courseId: string) => {
    return progress.find(p => p.course_id === courseId);
  };

  const getCompletedCourses = () => {
    return progress.filter(p => p.completed).length;
  };

  const getTotalScore = () => {
    return progress.reduce((total, p) => total + (p.score || 0), 0);
  };

  const getProgressPercentage = () => {
    if (courses.length === 0) return 0;
    return Math.round((getCompletedCourses() / courses.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-500">
        Connectez-vous pour voir votre progrès
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre Progrès</h3>
        
        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression globale</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getCompletedCourses()}
            </div>
            <div className="text-sm text-gray-500">Cours terminés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {courses.length}
            </div>
            <div className="text-sm text-gray-500">Cours disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {getTotalScore()}
            </div>
            <div className="text-sm text-gray-500">Points obtenus</div>
          </div>
        </div>
      </div>

      {/* Liste des cours avec progrès */}
      <div className="space-y-4">
        {courses.map((course) => {
          const courseProgress = getProgressForCourse(course.id);
          const isCompleted = courseProgress?.completed || false;
          const score = courseProgress?.score || 0;

          return (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                isCompleted ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.level === 'débutant' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terminé
                      </span>
                    )}
                    {score > 0 && (
                      <span className="inline-flex items-center text-purple-600 text-sm">
                        <Star className="h-4 w-4 mr-1" />
                        {score} points
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col sm:flex-row gap-2">
                  {isCompleted ? (
                    <button
                      onClick={() => updateProgress(course.id, false, 0)}
                      disabled={loading}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Mise à jour...' : 'Marquer comme non terminé'}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateProgress(course.id, true, 10)}
                      disabled={loading}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Mise à jour...' : 'Marquer comme terminé'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun cours disponible pour le moment.
        </div>
      )}
    </div>
  );
};

export default UserProgress;