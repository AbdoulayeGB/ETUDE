import { useState, useEffect } from 'react';
import { supabase, Subject, Course } from '../lib/supabase';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at');

      if (error) {
        setError(error.message);
      } else {
        setSubjects(data || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des matières');
    } finally {
      setLoading(false);
    }
  };

  return { subjects, loading, error, refetch: fetchSubjects };
};

export const useCourses = (subjectId?: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      fetchCourses(subjectId);
    }
  }, [subjectId]);

  const fetchCourses = async (subjectId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          subject:subjects(*)
        `)
        .eq('subject_id', subjectId)
        .order('order_index');

      if (error) {
        setError(error.message);
      } else {
        setCourses(data || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, refetch: () => subjectId && fetchCourses(subjectId) };
};