import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2, FileText, ExternalLink } from 'lucide-react';
import { supabase, type Subject } from '../../lib/supabase';
import { getYouTubeEmbedUrl, isPdf } from '../SubjectPage';

interface ContentManagerProps {
  type: 'subjects' | 'courses';
}

const categories = [
  'Mathématiques',
  'Sciences',
  'Langues',
  'Histoire',
  'Géographie',
  'Ressources',
];

const ContentManager: React.FC<ContentManagerProps> = ({ type }) => {
  const [items, setItems] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
    if (type === 'courses') fetchSubjects();
  }, [type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const table = type === 'subjects' ? 'subjects' : 'courses';
      const select = type === 'courses' ? '*, subject:subjects(*)' : '*';
      const { data, error } = await supabase.from(table).select(select).order('created_at', {
        ascending: false,
      });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error(`Erreur lors du chargement des ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(
      type === 'subjects'
        ? {
            name: '',
            slug: '',
            description: '',
            color: '#3B82F6',
            icon: 'BookOpen',
            category: 'Mathématiques',
          }
        : {
            title: '',
            description: '',
            content: '',
            level: 'débutant',
            media_type: 'texte',
            media_url: '',
            subject_id: '',
            order_index: 0,
          }
    );
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const table = type === 'subjects' ? 'subjects' : 'courses';
      if (editingItem) {
        const { error } = await supabase.from(table).update(formData).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez vos droits d\'administration.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      const table = type === 'subjects' ? 'subjects' : 'courses';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const renderForm = () => {
    if (type === 'subjects') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={formData.category || 'Mathématiques'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la matière
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Mathématiques"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Description de la matière"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
            <input
              type="color"
              value={formData.color || '#3B82F6'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-16 h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre du cours</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Introduction aux équations"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
          <select
            value={formData.subject_id || ''}
            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une matière</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
          <select
            value={formData.level || 'débutant'}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="débutant">Débutant</option>
            <option value="intermédiaire">Intermédiaire</option>
            <option value="avancé">Avancé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Description du cours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de contenu
          </label>
          <select
            value={formData.media_type || 'texte'}
            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="texte">Texte</option>
            <option value="video">Vidéo</option>
            <option value="document">Document</option>
          </select>
        </div>
        {formData.media_type !== 'texte' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL du média{' '}
              {formData.media_type === 'video' ? '(YouTube, Vimeo...)' : '(PDF, DOC, lien)'}
            </label>
            <input
              type="url"
              value={formData.media_url || ''}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                formData.media_type === 'video' ? 'https://youtu.be/...' : 'https://.../document.pdf'
              }
            />
            {formData.media_type === 'video' && getYouTubeEmbedUrl(formData.media_url) && (
              <div className="mt-3 aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(formData.media_url) as string}
                  title="Aperçu vidéo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {formData.media_type === 'document' && formData.media_url && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700 truncate max-w-[320px]">
                    {formData.media_url}
                  </span>
                  {isPdf(formData.media_url) && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">PDF</span>
                  )}
                </div>
                <a
                  href={formData.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  Ouvrir <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
          <textarea
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Contenu détaillé du cours"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredItems =
    selectedCategory === 'Tout'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des {type === 'subjects' ? 'Matières' : 'Cours'}
          </h2>
          {type === 'subjects' && (
            <div className="mt-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Tout">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Modifier' : 'Ajouter'}{' '}
                {type === 'subjects' ? 'une matière' : 'un cours'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {renderForm()}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
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
                {type === 'subjects' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Niveau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Média
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {type === 'subjects' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {item.description || 'Aucune description'}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.subject?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.level === 'débutant'
                              ? 'bg-green-100 text-green-800'
                              : item.level === 'intermédiaire'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs uppercase tracking-wide text-gray-700 px-2 py-1 bg-gray-100 rounded">
                          {item.media_type || 'texte'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                        {item.media_url ? (
                          item.media_type === 'video' && getYouTubeEmbedUrl(item.media_url) ? (
                            <div className="w-56 aspect-video rounded overflow-hidden border border-gray-200">
                              <iframe
                                className="w-full h-full"
                                src={getYouTubeEmbedUrl(item.media_url) as string}
                                title={`Vidéo de ${item.title}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <a
                              href={item.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline truncate inline-block max-w-xs"
                            >
                              {item.media_url}
                            </a>
                          )
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
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
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun {type === 'subjects' ? 'matière' : 'cours'} trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManager;
