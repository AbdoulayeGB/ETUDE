import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { type Course, type Exercise, type UserProgress } from '../lib/supabase';
import { ChevronLeft, CheckCircle, Clock, Star, Loader2, AlertCircle, BookOpen, FileText, Calculator, Microscope, Languages, Globe } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          subject:subjects(name, color, icon)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch exercises
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at');

      if (exercisesError) throw exercisesError;

      // Fetch progress if user is logged in
      let userProgress = null;
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (progressError && progressError.code !== 'PGRST116') throw progressError; // PGRST116 = no rows
        userProgress = progressData || null;
      }

      setCourse(courseData);
      setExercises(exercisesData || []);
      setProgress(userProgress);
    } catch (err: any) {
      console.error('Erreur lors du chargement du cours:', err);
      setError('Impossible de charger le cours. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completed: boolean, score: number = 0) => {
    if (!user || !course) return;

    try {
      const completedAt = completed ? new Date().toISOString() : null;

      if (progress) {
        const { error } = await supabase
          .from('user_progress')
          .update({ 
            completed, 
            score, 
            completed_at: completedAt 
          })
          .eq('id', progress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({ 
            user_id: user.id,
            course_id: course.id,
            completed,
            score,
            completed_at: completedAt
          });

        if (error) throw error;
      }

      fetchCourseDetail();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du progrès:', err);
      setError('Erreur lors de la mise à jour du progrès');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Chargement du cours...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Cours non trouvé'}</h2>
          <button 
            onClick={onBack} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getIconByName(course.subject?.icon || 'BookOpen');
  const color = course.subject?.color || '#3B82F6';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`${getHeaderBgClass(color)} text-white py-20`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={onBack}
            className="flex items-center text-white hover:text-gray-200 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Retour à la matière
          </button>
          <div className="text-center">
            <IconComponent className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl max-w-2xl mx-auto">{course.description || 'Description du cours non disponible.'}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Course Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du cours</h2>
          {course.content ? (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: course.content }} />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <p>Le contenu détaillé de ce cours sera bientôt disponible.</p>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Votre progression</h3>
              <div className="flex items-center space-x-2">
                {progress?.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
                {progress?.score && progress.score > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {progress.score}/100
                  </div>
                )}
              </div>
            </div>
            {!progress?.completed && (
              <button
                onClick={() => updateProgress(true, 85)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Marquer ce cours comme complété
              </button>
            )}
            {progress?.completed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">Cours marqué comme complété !</p>
              </div>
            )}
          </div>
        )}

        {/* Exercises */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercices</h2>
          {exercises.length > 0 ? (
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{exercise.title}</h4>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{exercise.question}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty === 'easy' ? 'Facile' : exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{exercise.points} pts</span>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                      Voir la réponse
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                      {exercise.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>Aucun exercice disponible pour ce cours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions (same as in SubjectPage)
const getHeaderBgClass = (color: string) => {
  if (color.startsWith('#')) {
    return `bg-gradient-to-r from-[${color}] to-[${color}]`;
  }
  switch (color) {
    case 'mathematiques': return 'bg-gradient-to-r from-blue-600 to-blue-700';
    case 'sciences': return 'bg-gradient-to-r from-green-600 to-green-700';
    case 'langues': return 'bg-gradient-to-r from-purple-600 to-purple-700';
    case 'histoire': return 'bg-gradient-to-r from-orange-600 to-orange-700';
    case 'geographie': return 'bg-gradient-to-r from-teal-600 to-teal-700';
    case 'ressources': return 'bg-gradient-to-r from-indigo-600 to-indigo-700';
    default: return 'bg-gradient-to-r from-blue-600 to-blue-700';
  }
};

const getIconByName = (name: string) => {
  switch (name) {
    case 'Calculator': return Calculator;
    case 'Microscope': return Microscope;
    case 'Languages': return Languages;
    case 'Clock': return Clock;
    case 'Globe': return Globe;
    case 'BookOpen': return BookOpen;
    default: return BookOpen;
  }
};

export default CourseDetail;