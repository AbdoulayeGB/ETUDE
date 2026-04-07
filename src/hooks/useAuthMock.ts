// Hook mocké pour l'authentification (version de démonstration)
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '../lib/supabase';

export const useAuthMock = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      // Vérifier si l'utilisateur est connecté dans le localStorage
      const savedUser = localStorage.getItem('mock_user');
      const savedProfile = localStorage.getItem('mock_profile');
      
      if (savedUser && savedProfile) {
        setUser(JSON.parse(savedUser));
        setProfile(JSON.parse(savedProfile));
        setSession({
          user: JSON.parse(savedUser),
          access_token: 'mock_token',
          refresh_token: 'mock_refresh_token',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer'
        } as Session);
      }
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: { full_name: fullName },
      identities: [],
      factors: []
    };

    const mockProfile: Profile = {
      id: mockUser.id,
      email,
      full_name: fullName,
      role: 'student',
      level: 'débutant',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Sauvegarder dans le localStorage
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({
      user: mockUser,
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    } as Session);

    return { data: { user: mockUser }, error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier si c'est l'admin
    if (email === 'abdoulaye@cdp.sn' && password === 'ABDOULAHI1989') {
      const mockUser: User = {
        id: 'admin-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { full_name: 'Abdoulaye Admin' },
        identities: [],
        factors: []
      };

      const mockProfile: Profile = {
        id: mockUser.id,
        email,
        full_name: 'Abdoulaye Admin',
        role: 'admin',
        level: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({
        user: mockUser,
        access_token: 'mock_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer'
      } as Session);

      return { data: { user: mockUser }, error: null };
    } else {
      // Utilisateur normal
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        identities: [],
        factors: []
      };

      const mockProfile: Profile = {
        id: mockUser.id,
        email,
        full_name: email.split('@')[0],
        role: 'student',
        level: 'débutant',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Sauvegarder dans le localStorage
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

      setUser(mockUser);
      setProfile(mockProfile);
      setSession({
        user: mockUser,
        access_token: 'mock_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer'
      } as Session);

      return { data: { user: mockUser }, error: null };
    }
  };

  const signOut = async () => {
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Nettoyer le localStorage
      localStorage.removeItem('mock_user');
      localStorage.removeItem('mock_profile');
      
      // Nettoyer l'état local
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Forcer un rechargement de la page
      window.location.href = '/';
      
      return { error: null };
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      return { error: err as Error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: new Error('Utilisateur non connecté') };

    // Simuler une mise à jour
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('mock_profile', JSON.stringify(updatedProfile));
    
    return { data: updatedProfile, error: null };
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
