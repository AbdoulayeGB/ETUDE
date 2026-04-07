import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { type Course, type UserProgress } from '../lib/supabase';
import { CheckCircle, Clock, Star, Loader2 } from 'lucide-react';

interface UserProgressTrackerProps {
  courses: Course[];
  subjectId?: string;
}

const UserProgressTracker: React.FC<UserProgressTrackerProps> = ({ courses, subjectId }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && courses.length > 0) {
      fetchProgress();
    }
  }, [user, courses]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('user_progress')
        .select(`
          *,
          course:courses(
            id,
            title,
            level
          )
        `)
        .eq('user_id', user.id);

      if (subjectId) {
        query = query.eq('course.subject_id', subjectId);
      }

      const { data, error } = await query
        .in('course_id', courses.map(course => course.id))
        .order('completed_at', { ascending: false });

      if (error) throw error;

      setProgress(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement du progrès:', err);
      setError('Erreur lors du chargement du progrès');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId: string, completed: boolean, score: number = 0) => {
    if (!user) return;

    try {
      const existing = progress.find(p => p.course_id === courseId);
      const completedAt = completed ? new Date().toISOString() : null;

      if (existing) {
        const { error } = await supabase
          .from('user_progress')
          .update({ 
            completed, 
            score, 
            completed_at: completedAt 
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({ 
            user_id: user.id,
            course_id: courseId,
            completed,
            score,
            completed_at: completedAt
          });

        if (error) throw error;
      }

      fetchProgress();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du progrès:', err);
      setError('Erreur lors de la mise à jour du progrès');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
        <span className="text-sm text-gray-600">Chargement du progrès...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  const completedCount = progress.filter(p => p.completed).length;
  const totalCount = courses.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Star className="h-5 w-5 text-yellow-500 mr-2" />
        Mon Progrès
      </h3>

      {/* Progress Overview */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Cours complétés</span>
          <span className="text-lg font-bold text-blue-600">
            {completedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Progress List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {courses.map((course) => {
          const courseProgress = progress.find(p => p.course_id === course.id);
          const isCompleted = courseProgress?.completed || false;
          const score = courseProgress?.score || 0;

          return (
            <div 
              key={course.id}
              className={`p-3 rounded-lg border transition-colors ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.level}</p>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                  {score > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span>{score}/100</span>
                    </div>
                  )}
                </div>
              </div>
              {!isCompleted && (
                <button
                  onClick={() => updateProgress(course.id, true, 85)} // Example score
                  className="mt-2 w-full bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Marquer comme complété
                </button>
              )}
            </div>
          );
        })}
      </div>

      {progress.length === 0 && courses.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Aucun progrès enregistré pour ces cours.</p>
          <p className="text-xs">Commencez à apprendre pour voir votre progression ici.</p>
        </div>
      )}
    </div>
  );
};

export default UserProgressTracker;