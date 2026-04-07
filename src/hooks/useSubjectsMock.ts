// Hook temporaire avec des données mockées pour tester l'interface
import { useState, useEffect } from 'react';
import { Subject, Course } from '../lib/supabase';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      const mockSubjects: Subject[] = [
        {
          id: '1',
          name: 'Mathématiques',
          slug: 'mathematiques',
          description: 'Cours de mathématiques pour tous les niveaux',
          color: '#3B82F6',
          icon: 'Calculator',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sciences',
          slug: 'sciences',
          description: 'Physique, chimie et biologie',
          color: '#10B981',
          icon: 'Microscope',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Langues',
          slug: 'langues',
          description: 'Français, anglais et autres langues',
          color: '#F59E0B',
          icon: 'BookOpen',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Histoire',
          slug: 'histoire',
          description: 'Histoire du monde et du Sénégal',
          color: '#EF4444',
          icon: 'Clock',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Géographie',
          slug: 'geographie',
          description: 'Géographie physique et humaine',
          color: '#8B5CF6',
          icon: 'Globe',
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Ressources',
          slug: 'ressources',
          description: 'Ressources pédagogiques et outils',
          color: '#06B6D4',
          icon: 'Book',
          created_at: new Date().toISOString()
        }
      ];
      
      setSubjects(mockSubjects);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchSubjects = async () => {
    // Fonction de rechargement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return { subjects, loading, error, refetch: fetchSubjects };
};

export const useCourses = (subjectId?: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      setLoading(true);
      
      // Simuler un délai de chargement
      const timer = setTimeout(() => {
        const mockCourses: Course[] = [
          {
            id: '1',
            subject_id: subjectId,
            title: 'Introduction aux concepts de base',
            description: 'Découvrez les fondamentaux de cette matière avec des exemples pratiques et des exercices interactifs.',
            content: 'Contenu détaillé du cours...',
            level: 'débutant',
            order_index: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            subject_id: subjectId,
            title: 'Concepts intermédiaires',
            description: 'Approfondissez vos connaissances avec des concepts plus avancés et des applications pratiques.',
            content: 'Contenu détaillé du cours...',
            level: 'intermédiaire',
            order_index: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            subject_id: subjectId,
            title: 'Niveau avancé',
            description: 'Maîtrisez les concepts les plus complexes avec des études de cas et des projets pratiques.',
            content: 'Contenu détaillé du cours...',
            level: 'avancé',
            order_index: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setCourses(mockCourses);
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [subjectId]);

  const fetchCourses = async (subjectId: string) => {
    // Fonction de rechargement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return { courses, loading, error, refetch: () => subjectId && fetchCourses(subjectId) };
};
