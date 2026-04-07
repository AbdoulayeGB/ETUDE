import React, { useEffect, useState } from 'react';
import { Calculator, Microscope, Languages, Clock, Globe, BookOpen, Play, FileText, Star, ChevronRight, Loader2 } from 'lucide-react';
import { useSubjects, useCourses } from '../hooks/useSubjectsMock';
import { Subject } from '../lib/supabase';

interface SubjectPageProps {
  subject: string;
}

const SubjectPageMock: React.FC<SubjectPageProps> = ({ subject }) => {
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const { courses, loading: coursesLoading, error: coursesError } = useCourses(selectedSubject?.id);

  useEffect(() => {
    const foundSubject = subjects.find(s => s.slug === subject);
    setSelectedSubject(foundSubject || null);
  }, [subjects, subject]);

  if (subjectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Chargement...</span>
        </div>
      </div>
    );
  }

  if (subjectsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des matières: {subjectsError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Matière non trouvée</h1>
          <p className="text-gray-600 mb-4">La matière demandée n'existe pas.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getIconBySlug(selectedSubject.slug);
  const color = getColorBySlug(selectedSubject.slug);

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Chargement des cours...</span>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des cours: {coursesError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const uniqueLevels = [...new Set(courses.map(course => course.level))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`${getHeaderBgClass(color)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <IconComponent className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">{selectedSubject.name}</h1>
            <p className="text-xl max-w-3xl mx-auto">{selectedSubject.description || 'Découvrez les cours disponibles pour cette matière.'}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Courses List */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  Cours Disponibles
                  <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                    {courses.length} cours{courses.length !== 1 ? 's' : ''}
                  </span>
                </h2>
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {course.description || 'Description du cours non disponible.'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                course.level === 'débutant' ? 'bg-green-100 text-green-800' :
                                course.level === 'intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {course.level}
                              </span>
                              <span>Ordre: {course.order_index}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours disponible</h3>
                    <p className="text-gray-500">Les cours pour cette matière seront bientôt disponibles.</p>
                  </div>
                )}
              </div>

              {/* Learning Resources */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ressources d'apprentissage</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                    <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vidéos</h3>
                    <p className="text-gray-600">Cours en vidéo avec explications détaillées</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200 cursor-pointer">
                    <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Exercices</h3>
                    <p className="text-gray-600">Exercices pratiques et corrigés</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200 cursor-pointer">
                    <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Quiz</h3>
                    <p className="text-gray-600">Tests d'évaluation et quiz interactifs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Levels */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Niveaux disponibles</h3>
                <div className="space-y-2">
                  {uniqueLevels.length > 0 ? uniqueLevels.map((level, index) => (
                    <div
                      key={index}
                      className={`p-3 ${getLevelBgClass(color)} ${getLevelTextClass(color)} rounded-lg font-medium ${getLevelHoverClass(color)} transition-colors duration-200 cursor-pointer`}
                    >
                      {level}
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Niveaux à venir</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cours disponibles</span>
                    <span className="font-semibold text-gray-900">{courses.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Matières totales</span>
                    <span className="font-semibold text-gray-900">{subjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Niveaux</span>
                    <span className="font-semibold text-gray-900">{uniqueLevels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Note moyenne</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900 ml-1">4.7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper functions to handle dynamic Tailwind classes
const getHeaderBgClass = (color: string) => {
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

const getLevelBgClass = (color: string) => {
  switch (color) {
    case 'mathematiques': return 'bg-blue-50';
    case 'sciences': return 'bg-green-50';
    case 'langues': return 'bg-purple-50';
    case 'histoire': return 'bg-orange-50';
    case 'geographie': return 'bg-teal-50';
    case 'ressources': return 'bg-indigo-50';
    default: return 'bg-blue-50';
  }
};

const getLevelTextClass = (color: string) => {
  switch (color) {
    case 'mathematiques': return 'text-blue-700';
    case 'sciences': return 'text-green-700';
    case 'langues': return 'text-purple-700';
    case 'histoire': return 'text-orange-700';
    case 'geographie': return 'text-teal-700';
    case 'ressources': return 'text-indigo-700';
    default: return 'text-blue-700';
  }
};

const getLevelHoverClass = (color: string) => {
  switch (color) {
    case 'mathematiques': return 'hover:bg-blue-100';
    case 'sciences': return 'hover:bg-green-100';
    case 'langues': return 'hover:bg-purple-100';
    case 'histoire': return 'hover:bg-orange-100';
    case 'geographie': return 'hover:bg-teal-100';
    case 'ressources': return 'hover:bg-indigo-100';
    default: return 'hover:bg-blue-100';
  }
};

const getIconBySlug = (slug: string) => {
  switch (slug) {
    case 'mathematiques': return Calculator;
    case 'sciences': return Microscope;
    case 'langues': return Languages;
    case 'histoire': return Clock;
    case 'geographie': return Globe;
    case 'ressources': return BookOpen;
    default: return BookOpen;
  }
};

const getColorBySlug = (slug: string) => {
  switch (slug) {
    case 'mathematiques': return 'mathematiques';
    case 'sciences': return 'sciences';
    case 'langues': return 'langues';
    case 'histoire': return 'histoire';
    case 'geographie': return 'geographie';
    case 'ressources': return 'ressources';
    default: return 'mathematiques';
  }
};

export default SubjectPageMock;
