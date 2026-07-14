import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase, type Course, type Exercise } from '../../lib/supabase';

const ExercisesManager: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Exercise>>({
    title: '',
    question: '',
    answer: '',
    difficulty: 'easy',
    points: 10,
    course_id: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
    fetchCourses();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*, course:courses(title, subject:subjects(name))')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setExercises(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des exercices:', err);
      setError('Erreur lors du chargement des exercices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, subject:subjects(name)')
        .order('title');
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des cours:', err);
    }
  };

  const handleCreate = () => {
    setEditingExercise(null);
    setFormData({
      title: '',
      question: '',
      answer: '',
      difficulty: 'easy',
      points: 10,
      course_id: '',
    });
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      question: exercise.question,
      answer: exercise.answer,
      difficulty: exercise.difficulty,
      points: exercise.points,
      course_id: exercise.course_id,
    });
    setShowForm(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.course_id || !formData.title || !formData.question || !formData.answer) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }
    try {
      setLoading(true);
      if (editingExercise) {
        const { error } = await supabase
          .from('exercises')
          .update(formData as Exercise)
          .eq('id', editingExercise.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('exercises').insert([formData as Exercise]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingExercise(null);
      fetchExercises();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) return;
    try {
      const { error } = await supabase.from('exercises').delete().eq('id', id);
      if (error) throw error;
      fetchExercises();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(`Erreur: ${err.message}`);
    }
  };

  if (loading && !exercises.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Exercices</h2>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un exercice
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingExercise ? 'Modifier' : 'Ajouter'} un exercice
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cours associé *
                </label>
                <select
                  value={formData.course_id || ''}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.subject?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'exercice *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Résoudre l'équation linéaire"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Posez votre question ici..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réponse *</label>
                <textarea
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Fournissez la réponse détaillée..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
                  <select
                    value={formData.difficulty || 'easy'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    value={formData.points || 10}
                    onChange={(e) =>
                      setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                    }
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((ex) => (
                <tr key={ex.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ex.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ex.course?.title || 'N/A'} ({(ex.course as any)?.subject?.name || ''})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ex.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : ex.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ex.difficulty === 'easy'
                        ? 'Facile'
                        : ex.difficulty === 'medium'
                          ? 'Moyen'
                          : 'Difficile'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ex.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ex.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ex)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ex.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {exercises.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Aucun exercice trouvé.
            <br />
            <button
              onClick={handleCreate}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Ajoutez le premier exercice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesManager;
