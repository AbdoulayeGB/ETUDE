import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Subject } from '../../lib/supabase';

type ExerciseType = 'exercice' | 'quiz';
type Difficulty = 'débutant' | 'intermédiaire' | 'avancé';

interface ExerciseItem {
  id: string;
  course_id: string;
  subject_id: string;
  type: ExerciseType;
  title: string;
  statement: string;
  points: number;
  difficulty: Difficulty;
  // Quiz only
  choices?: Array<{ id: string; text: string; correct: boolean }>; 
  // meta
  created_at: string;
  updated_at: string;
}

const ExercisesManagerMock: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Array<{ id: string; subject_id: string; title: string }>>([]);
  const [items, setItems] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ExerciseItem | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterType, setFilterType] = useState<'Tous' | ExerciseType>('Tous');

  const [formData, setFormData] = useState<any>({
    subject_id: '',
    course_id: '',
    type: 'exercice' as ExerciseType,
    title: '',
    statement: '',
    points: 10,
    difficulty: 'débutant' as Difficulty,
    choices: [
      { id: 'A', text: '', correct: true },
      { id: 'B', text: '', correct: false },
      { id: 'C', text: '', correct: false },
      { id: 'D', text: '', correct: false },
    ],
  });

  // Mock data (mêmes sujets/cours que ContentManagerMock)
  useEffect(() => {
    setLoading(true);
    const now = new Date().toISOString();
    const mockSubjects: Subject[] = [
      { id: '1', name: 'Mathématiques', slug: 'mathematiques', description: '', color: '#3B82F6', icon: 'Calculator', created_at: now },
      { id: '2', name: 'Sciences', slug: 'sciences', description: '', color: '#10B981', icon: 'Microscope', created_at: now },
      { id: '3', name: 'Langues', slug: 'langues', description: '', color: '#F59E0B', icon: 'BookOpen', created_at: now },
    ];
    const mockCourses = [
      { id: 'c1', subject_id: '1', title: 'Équations 1er degré' },
      { id: 'c2', subject_id: '1', title: 'Géométrie plane' },
      { id: 'c3', subject_id: '2', title: 'Chimie organique' },
    ];
    const mockExercises: ExerciseItem[] = [
      {
        id: 'e1', subject_id: '1', course_id: 'c1', type: 'exercice',
        title: 'Résoudre 2x + 3 = 11', statement: 'Calculez x.', points: 10, difficulty: 'débutant',
        created_at: now, updated_at: now,
      },
      {
        id: 'e2', subject_id: '1', course_id: 'c2', type: 'quiz',
        title: 'Triangle rectangle', statement: 'Quelle relation est vraie ?', points: 10, difficulty: 'débutant',
        choices: [
          { id: 'A', text: 'a² + b² = c²', correct: true },
          { id: 'B', text: 'a + b = c', correct: false },
          { id: 'C', text: 'a² = b² + c²', correct: false },
          { id: 'D', text: '2ab = c', correct: false },
        ],
        created_at: now, updated_at: now,
      },
    ];

    setTimeout(() => {
      setSubjects(mockSubjects);
      setCourses(mockCourses);
      setItems(mockExercises);
      setLoading(false);
    }, 300);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((it) => (
      (!filterSubject || it.subject_id === filterSubject) &&
      (filterType === 'Tous' || it.type === filterType)
    ));
  }, [items, filterSubject, filterType]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      subject_id: '',
      course_id: '',
      type: 'exercice',
      title: '',
      statement: '',
      points: 10,
      difficulty: 'débutant',
      choices: [
        { id: 'A', text: '', correct: true },
        { id: 'B', text: '', correct: false },
        { id: 'C', text: '', correct: false },
        { id: 'D', text: '', correct: false },
      ],
    });
    setShowForm(true);
  };

  const handleEdit = (item: ExerciseItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      await new Promise((r) => setTimeout(r, 250));
      if (editingItem) {
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...editingItem, ...formData, updated_at: new Date().toISOString() } : it)));
      } else {
        const newItem: ExerciseItem = {
          id: `${Date.now()}`,
          subject_id: formData.subject_id,
          course_id: formData.course_id,
          type: formData.type,
          title: formData.title,
          statement: formData.statement,
          points: Number(formData.points) || 0,
          difficulty: formData.difficulty,
          choices: formData.type === 'quiz' ? formData.choices : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setItems((prev) => [newItem, ...prev]);
      }
      setShowForm(false);
      setEditingItem(null);
      alert('Exercice/Quiz sauvegardé !');
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return;
    await new Promise((r) => setTimeout(r, 200));
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const renderQuizChoices = () => (
    <div className="space-y-3">
      <div className="text-sm text-gray-700 font-medium">Réponses (cochez la bonne)</div>
      {formData.choices.map((c: any, idx: number) => (
        <div key={c.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={c.correct}
            onChange={(e) => {
              const next = formData.choices.map((it: any, i: number) => ({ ...it, correct: i === idx ? e.target.checked : false }));
              setFormData({ ...formData, choices: next });
            }}
          />
          <input
            type="text"
            value={c.text}
            onChange={(e) => {
              const next = [...formData.choices];
              next[idx] = { ...next[idx], text: e.target.value };
              setFormData({ ...formData, choices: next });
            }}
            placeholder={`Réponse ${c.id}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const subjectCourses = courses.filter((c) => !formData.subject_id || c.subject_id === formData.subject_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Exercices & Quiz</h2>
          <div className="mt-4 flex items-center space-x-3">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Toutes les matières</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Tous">Tous les types</option>
              <option value="exercice">Exercice</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>
        <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingItem ? 'Modifier' : 'Ajouter'} un {formData.type}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value, course_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cours</label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    {subjectCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="exercice">Exercice</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="avancé">Avancé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Problème sur Pythagore"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Énoncé</label>
                <textarea
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Décrivez l'exercice ou la question du quiz"
                />
              </div>

              {formData.type === 'quiz' && renderQuizChoices()}

              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                <button onClick={handleSave} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" /> Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière/Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center text-xs font-semibold rounded-full px-2 py-1 bg-gray-100 text-gray-800 capitalize">
                      {it.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{it.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{it.statement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subjects.find((s) => s.id === it.subject_id)?.name || '—'}</div>
                    <div className="text-xs text-gray-500">{courses.find((c) => c.id === it.course_id)?.title || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{it.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      it.difficulty === 'débutant' ? 'bg-green-100 text-green-800' :
                      it.difficulty === 'intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {it.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(it)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(it.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">Aucun exercice/quiz trouvé.</div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="ml-3 text-sm text-blue-800">
            <div className="font-semibold mb-1">Mode Démo</div>
            <div>Les exercices/quiz sont stockés en mémoire lors de la session. Pour la persistance réelle, nous les lierons à Supabase.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesManagerMock;


