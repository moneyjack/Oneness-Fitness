import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authApi } from '../services/api'; // 1. 引入剛剛寫好的 API

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; data: any }>;
  signOut: () => void;
  loading: boolean; // 記得保持 boolean
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查 Session (這裡還是可以用 supabase 原生的，因為這是初始化邏輯)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 這裡開始改用 API Handler ---

  const signIn = async (email: string, password: string) => {
    // 呼叫 services/api.ts 裡的 authApi
    const { error } = await authApi.signIn(email, password);
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    // 呼叫 services/api.ts 裡的 authApi
    const { data, error } = await authApi.signUp(email, password, name);
    return { data, error };
  };

  const signOut = async () => {
    await authApi.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);