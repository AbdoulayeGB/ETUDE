import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, isSupabaseReady } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase n'est pas configuré, arrêter le chargement
    if (!isSupabaseReady) {
      setLoading(false);
      return;
    }

    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for userId:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    console.log('useAuth signOut appelé');
    console.log('isSupabaseReady:', isSupabaseReady);

    if (!isSupabaseReady) {
      console.error('Supabase n\'est pas configuré');
      return { error: new Error('Supabase n\'est pas configuré') };
    }

    try {
      console.log('Appel de supabase.auth.signOut()...');
      const { error } = await supabase.auth.signOut();
      console.log('supabase.auth.signOut() terminé:', { error });
      if (!error) {
        console.log('Aucune erreur, nettoyage de l\'état local...');
        // Nettoyer l'état local
        setUser(null);
        setProfile(null);
        setSession(null);
        // Nettoyer le localStorage
        localStorage.removeItem('supabase.auth.token');
        console.log('État local nettoyé');
      } else {
        console.error('Erreur Supabase lors de la déconnexion:', error);
      }
      return { error };
    } catch (err) {
      console.error('Erreur inattendue lors de la déconnexion:', err);
      return { error: err as Error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Utilisateur non connecté') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};